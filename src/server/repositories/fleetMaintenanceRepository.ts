import pg from 'pg';
import { generateUuidV7 } from '../db/database.js';
import { withTenantTransaction } from '../db/tenantContext.js';
import { FleetMaintenanceRecord, MaintenanceStatus } from '../db/fleet/fleetTypes.js';
import { ErpServiceError } from '../services/erpErrors.js';

function iso(value: unknown): string {
  return value ? new Date(String(value)).toISOString() : '';
}

function isoDate(value: unknown): string | undefined {
  if (!value) return undefined;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  const raw = String(value);
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);
  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  return undefined;
}

export class FleetMaintenanceRepository {
  async createMaintenance(tenantId: string, input: {
    vehicleId: string;
    maintenanceType: string;
    serviceDate: string;
    odometerReading?: number;
    workshopName?: string;
    description?: string;
    partsDetails?: string;
    cost: number;
    nextServiceDate?: string;
    nextServiceOdometer?: number;
    status?: MaintenanceStatus;
    notes?: string;
    createdBy?: string;
  }): Promise<FleetMaintenanceRecord> {
    const id = generateUuidV7();
    return withTenantTransaction(tenantId, async (client) => {
      await this.assertVehicle(client, tenantId, input.vehicleId);
      const result = await client.query(
        `INSERT INTO fleet_vehicle_maintenance (
          id, tenant_id, vehicle_id, maintenance_type, service_date, odometer_reading,
          workshop_name, description, parts_details, cost, next_service_date, next_service_odometer,
          status, notes, created_by
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
        RETURNING *`,
        [
          id,
          tenantId,
          input.vehicleId,
          input.maintenanceType.trim(),
          input.serviceDate,
          input.odometerReading ?? null,
          input.workshopName || null,
          input.description || null,
          input.partsDetails || null,
          input.cost,
          input.nextServiceDate || null,
          input.nextServiceOdometer ?? null,
          input.status || 'OPEN',
          input.notes || null,
          input.createdBy || null
        ]
      );
      return this.mapMaintenance(result.rows[0]);
    });
  }

  async getMaintenance(tenantId: string, maintenanceId: string): Promise<FleetMaintenanceRecord | null> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `SELECT * FROM fleet_vehicle_maintenance WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL LIMIT 1`,
        [tenantId, maintenanceId]
      );
      return result.rows[0] ? this.mapMaintenance(result.rows[0]) : null;
    });
  }

  async listMaintenance(tenantId: string, filters: {
    vehicleId?: string;
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<FleetMaintenanceRecord[]> {
    return withTenantTransaction(tenantId, async (client) => {
      const conditions = ['tenant_id = $1', 'deleted_at IS NULL'];
      const values: unknown[] = [tenantId];
      if (filters.vehicleId) {
        values.push(filters.vehicleId);
        conditions.push(`vehicle_id = $${values.length}`);
      }
      if (filters.status) {
        values.push(filters.status);
        conditions.push(`status = $${values.length}`);
      }
      if (filters.search) {
        values.push(`%${filters.search}%`);
        conditions.push(`(
          maintenance_type ILIKE $${values.length}
          OR workshop_name ILIKE $${values.length}
          OR description ILIKE $${values.length}
        )`);
      }
      const limit = Math.min(Math.max(filters.limit || 100, 1), 200);
      const offset = Math.max(filters.offset || 0, 0);
      values.push(limit, offset);
      const result = await client.query(
        `SELECT * FROM fleet_vehicle_maintenance
         WHERE ${conditions.join(' AND ')}
         ORDER BY service_date DESC
         LIMIT $${values.length - 1} OFFSET $${values.length}`,
        values
      );
      return result.rows.map((row) => this.mapMaintenance(row));
    });
  }

  async updateMaintenance(tenantId: string, maintenanceId: string, input: Partial<{
    maintenanceType: string;
    serviceDate: string;
    odometerReading: number;
    workshopName: string;
    description: string;
    partsDetails: string;
    cost: number;
    nextServiceDate: string;
    nextServiceOdometer: number;
    status: MaintenanceStatus;
    notes: string;
  }>): Promise<FleetMaintenanceRecord> {
    return withTenantTransaction(tenantId, async (client) => {
      const existing = await client.query(
        `SELECT * FROM fleet_vehicle_maintenance WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL FOR UPDATE`,
        [tenantId, maintenanceId]
      );
      if (!existing.rows[0]) throw new ErpServiceError('NOT_FOUND', 'Maintenance record not found.', 404);
      const result = await client.query(
        `UPDATE fleet_vehicle_maintenance SET
          maintenance_type = COALESCE($3, maintenance_type),
          service_date = COALESCE($4, service_date),
          odometer_reading = COALESCE($5, odometer_reading),
          workshop_name = COALESCE($6, workshop_name),
          description = COALESCE($7, description),
          parts_details = COALESCE($8, parts_details),
          cost = COALESCE($9, cost),
          next_service_date = COALESCE($10, next_service_date),
          next_service_odometer = COALESCE($11, next_service_odometer),
          status = COALESCE($12, status),
          notes = COALESCE($13, notes),
          updated_at = NOW()
         WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL
         RETURNING *`,
        [
          tenantId,
          maintenanceId,
          input.maintenanceType || null,
          input.serviceDate || null,
          input.odometerReading ?? null,
          input.workshopName || null,
          input.description || null,
          input.partsDetails || null,
          input.cost ?? null,
          input.nextServiceDate || null,
          input.nextServiceOdometer ?? null,
          input.status || null,
          input.notes || null
        ]
      );
      return this.mapMaintenance(result.rows[0]);
    });
  }

  async archiveMaintenance(tenantId: string, maintenanceId: string): Promise<boolean> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `UPDATE fleet_vehicle_maintenance
         SET deleted_at = NOW(), status = 'CANCELLED', updated_at = NOW()
         WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL`,
        [tenantId, maintenanceId]
      );
      return (result.rowCount ?? 0) > 0;
    });
  }

  async hasOpenMaintenance(tenantId: string, vehicleId: string): Promise<boolean> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `SELECT 1 FROM fleet_vehicle_maintenance
         WHERE tenant_id = $1 AND vehicle_id = $2 AND deleted_at IS NULL
           AND status IN ('OPEN', 'IN_PROGRESS')
         LIMIT 1`,
        [tenantId, vehicleId]
      );
      return Boolean(result.rows[0]);
    });
  }

  private async assertVehicle(client: pg.PoolClient, tenantId: string, vehicleId: string): Promise<void> {
    const result = await client.query(
      `SELECT id FROM fleet_vehicles WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL LIMIT 1`,
      [tenantId, vehicleId]
    );
    if (!result.rows[0]) throw new ErpServiceError('NOT_FOUND', 'Vehicle not found.', 404);
  }

  private mapMaintenance(row: Record<string, unknown>): FleetMaintenanceRecord {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      vehicleId: String(row.vehicle_id),
      maintenanceType: String(row.maintenance_type),
      serviceDate: isoDate(row.service_date) || '',
      odometerReading: row.odometer_reading != null ? Number(row.odometer_reading) : undefined,
      workshopName: row.workshop_name ? String(row.workshop_name) : undefined,
      description: row.description ? String(row.description) : undefined,
      partsDetails: row.parts_details ? String(row.parts_details) : undefined,
      cost: Number(row.cost),
      nextServiceDate: isoDate(row.next_service_date),
      nextServiceOdometer: row.next_service_odometer != null ? Number(row.next_service_odometer) : undefined,
      status: String(row.status) as MaintenanceStatus,
      notes: row.notes ? String(row.notes) : undefined,
      createdAt: iso(row.created_at),
      updatedAt: iso(row.updated_at)
    };
  }
}
