import pg from 'pg';
import { generateUuidV7 } from '../db/database.js';
import { withTenantTransaction } from '../db/tenantContext.js';
import { ErpQuarry, QuarryMineralType, QuarryOperationalStatus } from '../db/erp/quarryTypes.js';

export interface CreateQuarryInput {
  companyId: string;
  branchId?: string;
  code: string;
  name: string;
  mineralType?: QuarryMineralType;
  operationalStatus?: QuarryOperationalStatus;
  gpsLatitude?: number;
  gpsLongitude?: number;
  capacityTons?: number;
  createdBy?: string;
}

function mapQuarryRow(row: Record<string, unknown>): ErpQuarry {
  return {
    id: String(row.id),
    tenantId: String(row.tenant_id),
    companyId: String(row.company_id),
    branchId: row.branch_id ? String(row.branch_id) : undefined,
    code: String(row.code),
    name: String(row.name),
    mineralType: String(row.mineral_type) as QuarryMineralType,
    operationalStatus: String(row.operational_status) as QuarryOperationalStatus,
    gpsLatitude: row.gps_latitude != null ? Number(row.gps_latitude) : undefined,
    gpsLongitude: row.gps_longitude != null ? Number(row.gps_longitude) : undefined,
    capacityTons: row.capacity_tons != null ? Number(row.capacity_tons) : undefined,
    metadata: (row.metadata_json as Record<string, unknown>) || {},
    createdAt: new Date(String(row.created_at)).toISOString(),
    updatedAt: new Date(String(row.updated_at)).toISOString(),
    createdBy: row.created_by ? String(row.created_by) : undefined,
    updatedBy: row.updated_by ? String(row.updated_by) : undefined,
    deletedAt: row.deleted_at ? new Date(String(row.deleted_at)).toISOString() : undefined,
    version: Number(row.version)
  };
}

export class QuarryRepository {
  async listByTenant(tenantId: string): Promise<ErpQuarry[]> {
    return withTenantTransaction(tenantId, async (client: pg.PoolClient) => {
      const result = await client.query(
        `SELECT *
         FROM erp_quarries
         WHERE tenant_id = $1 AND deleted_at IS NULL
         ORDER BY name ASC`,
        [tenantId]
      );
      return result.rows.map(mapQuarryRow);
    });
  }

  async create(tenantId: string, input: CreateQuarryInput): Promise<ErpQuarry> {
    const id = generateUuidV7();
    const now = new Date().toISOString();

    return withTenantTransaction(tenantId, async (client: pg.PoolClient) => {
      const result = await client.query(
        `INSERT INTO erp_quarries (
          id, tenant_id, company_id, branch_id, code, name, mineral_type,
          operational_status, gps_latitude, gps_longitude, capacity_tons,
          created_at, updated_at, created_by, version
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $11,
          $12, $13, $14, 1
        )
        RETURNING *`,
        [
          id,
          tenantId,
          input.companyId,
          input.branchId || null,
          input.code.trim().toUpperCase(),
          input.name.trim(),
          input.mineralType || 'HARD_ROCK',
          input.operationalStatus || 'ACTIVE',
          input.gpsLatitude ?? null,
          input.gpsLongitude ?? null,
          input.capacityTons ?? null,
          now,
          now,
          input.createdBy || null
        ]
      );

      return mapQuarryRow(result.rows[0]);
    });
  }

  async findById(tenantId: string, quarryId: string): Promise<ErpQuarry | null> {
    return withTenantTransaction(tenantId, async (client: pg.PoolClient) => {
      const result = await client.query(
        `SELECT *
         FROM erp_quarries
         WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL
         LIMIT 1`,
        [tenantId, quarryId]
      );
      return result.rows[0] ? mapQuarryRow(result.rows[0]) : null;
    });
  }
}
