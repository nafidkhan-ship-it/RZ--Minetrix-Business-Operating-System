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

export interface UpdateQuarryInput {
  name?: string;
  mineralType?: QuarryMineralType;
  operationalStatus?: QuarryOperationalStatus;
  gpsLatitude?: number;
  gpsLongitude?: number;
  capacityTons?: number;
  branchId?: string;
  updatedBy?: string;
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

  async findByCode(tenantId: string, code: string): Promise<ErpQuarry | null> {
    return withTenantTransaction(tenantId, async (client: pg.PoolClient) => {
      const result = await client.query(
        `SELECT *
         FROM erp_quarries
         WHERE tenant_id = $1 AND code = $2 AND deleted_at IS NULL
         LIMIT 1`,
        [tenantId, code.trim().toUpperCase()]
      );
      return result.rows[0] ? mapQuarryRow(result.rows[0]) : null;
    });
  }

  async update(tenantId: string, quarryId: string, input: UpdateQuarryInput): Promise<ErpQuarry | null> {
    const fields: string[] = [];
    const values: unknown[] = [tenantId, quarryId];
    let paramIndex = 3;

    if (input.name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(input.name.trim());
    }
    if (input.mineralType !== undefined) {
      fields.push(`mineral_type = $${paramIndex++}`);
      values.push(input.mineralType);
    }
    if (input.operationalStatus !== undefined) {
      fields.push(`operational_status = $${paramIndex++}`);
      values.push(input.operationalStatus);
    }
    if (input.gpsLatitude !== undefined) {
      fields.push(`gps_latitude = $${paramIndex++}`);
      values.push(input.gpsLatitude);
    }
    if (input.gpsLongitude !== undefined) {
      fields.push(`gps_longitude = $${paramIndex++}`);
      values.push(input.gpsLongitude);
    }
    if (input.capacityTons !== undefined) {
      fields.push(`capacity_tons = $${paramIndex++}`);
      values.push(input.capacityTons);
    }
    if (input.branchId !== undefined) {
      fields.push(`branch_id = $${paramIndex++}`);
      values.push(input.branchId || null);
    }
    if (input.updatedBy !== undefined) {
      fields.push(`updated_by = $${paramIndex++}`);
      values.push(input.updatedBy);
    }

    if (fields.length === 0) {
      return this.findById(tenantId, quarryId);
    }

    const now = new Date().toISOString();
    fields.push(`updated_at = $${paramIndex++}`);
    values.push(now);
    fields.push('version = version + 1');

    return withTenantTransaction(tenantId, async (client: pg.PoolClient) => {
      const result = await client.query(
        `UPDATE erp_quarries
         SET ${fields.join(', ')}
         WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL
         RETURNING *`,
        values
      );
      return result.rows[0] ? mapQuarryRow(result.rows[0]) : null;
    });
  }

  async archive(tenantId: string, quarryId: string, updatedBy?: string): Promise<boolean> {
    const now = new Date().toISOString();
    return withTenantTransaction(tenantId, async (client: pg.PoolClient) => {
      const result = await client.query(
        `UPDATE erp_quarries
         SET deleted_at = $3,
             operational_status = 'INACTIVE',
             updated_at = $3,
             updated_by = $4,
             version = version + 1
         WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL`,
        [tenantId, quarryId, now, updatedBy || null]
      );
      return (result.rowCount ?? 0) > 0;
    });
  }
}
