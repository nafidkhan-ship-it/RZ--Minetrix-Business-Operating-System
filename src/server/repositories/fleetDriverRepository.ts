import pg from 'pg';
import { generateUuidV7 } from '../db/database.js';
import { withTenantTransaction } from '../db/tenantContext.js';
import { DriverStatus, FleetDriverRecord, LicenseClass } from '../db/fleet/fleetTypes.js';
import { ErpServiceError, isUniqueViolation } from '../services/erpErrors.js';

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

export class FleetDriverRepository {
  async createDriver(tenantId: string, input: {
    fullName: string;
    phone?: string;
    licenseNumber: string;
    licenseClass: LicenseClass;
    licenseIssueDate?: string;
    licenseExpiryDate?: string;
    badgeCode?: string;
    branchId?: string;
    status?: DriverStatus;
    employeeId?: string;
    assignedVehicleId?: string;
    notes?: string;
    createdBy?: string;
  }): Promise<FleetDriverRecord> {
    const id = generateUuidV7();
    return withTenantTransaction(tenantId, async (client) => {
      await this.assertEmployee(client, tenantId, input.employeeId);
      await this.assertAssignableVehicle(client, tenantId, input.assignedVehicleId);
      try {
        const result = await client.query(
          `INSERT INTO fleet_drivers (
            id, tenant_id, employee_id, full_name, phone, license_number, license_class,
            license_issue_date, license_expiry_date, badge_code, branch_id, status,
            assigned_vehicle_id, notes, created_by
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
          RETURNING *`,
          [
            id,
            tenantId,
            input.employeeId || null,
            input.fullName.trim(),
            input.phone ? input.phone.trim() : null,
            input.licenseNumber.trim().toUpperCase(),
            input.licenseClass,
            input.licenseIssueDate || null,
            input.licenseExpiryDate || null,
            input.badgeCode ? input.badgeCode.trim().toUpperCase() : null,
            input.branchId || null,
            input.status || 'ACTIVE',
            input.assignedVehicleId || null,
            input.notes || null,
            input.createdBy || null
          ]
        );
        return this.mapDriver(result.rows[0]);
      } catch (error) {
        if (isUniqueViolation(error)) {
          const constraint = typeof error === 'object' && error && 'constraint' in error
            ? String((error as { constraint?: string }).constraint || '')
            : '';
          if (constraint.includes('badge')) {
            throw new ErpServiceError('DUPLICATE_BADGE', 'Driver badge/code already exists.', 409);
          }
          throw new ErpServiceError('DUPLICATE_LICENSE', 'Driver license or badge already exists.', 409);
        }
        throw error;
      }
    });
  }

  async getDriver(tenantId: string, driverId: string): Promise<FleetDriverRecord | null> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `SELECT * FROM fleet_drivers WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL LIMIT 1`,
        [tenantId, driverId]
      );
      return result.rows[0] ? this.mapDriver(result.rows[0]) : null;
    });
  }

  async listDrivers(tenantId: string, filters: {
    search?: string;
    status?: string;
    licenseNumber?: string;
    licenseClass?: string;
    limit?: number;
    offset?: number;
  }): Promise<FleetDriverRecord[]> {
    return withTenantTransaction(tenantId, async (client) => {
      const conditions = ['tenant_id = $1', 'deleted_at IS NULL'];
      const values: unknown[] = [tenantId];
      if (filters.status) {
        values.push(filters.status);
        conditions.push(`status = $${values.length}`);
      }
      if (filters.licenseNumber) {
        values.push(filters.licenseNumber.trim().toUpperCase());
        conditions.push(`license_number = $${values.length}`);
      }
      if (filters.licenseClass) {
        values.push(filters.licenseClass);
        conditions.push(`license_class = $${values.length}`);
      }
      if (filters.search) {
        values.push(`%${filters.search}%`);
        conditions.push(`(
          full_name ILIKE $${values.length}
          OR license_number ILIKE $${values.length}
          OR badge_code ILIKE $${values.length}
          OR phone ILIKE $${values.length}
        )`);
      }
      const limit = Math.min(Math.max(filters.limit || 100, 1), 200);
      const offset = Math.max(filters.offset || 0, 0);
      values.push(limit, offset);
      const result = await client.query(
        `SELECT * FROM fleet_drivers
         WHERE ${conditions.join(' AND ')}
         ORDER BY full_name
         LIMIT $${values.length - 1} OFFSET $${values.length}`,
        values
      );
      return result.rows.map((row) => this.mapDriver(row));
    });
  }

  async updateDriver(tenantId: string, driverId: string, input: {
    fullName?: string;
    phone?: string;
    licenseNumber?: string;
    licenseClass?: LicenseClass;
    licenseIssueDate?: string;
    licenseExpiryDate?: string;
    badgeCode?: string;
    branchId?: string;
    status?: DriverStatus;
    employeeId?: string | null;
    assignedVehicleId?: string | null;
    notes?: string;
  }): Promise<FleetDriverRecord> {
    return withTenantTransaction(tenantId, async (client) => {
      const existing = await client.query(
        `SELECT * FROM fleet_drivers WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL FOR UPDATE`,
        [tenantId, driverId]
      );
      if (!existing.rows[0]) throw new ErpServiceError('NOT_FOUND', 'Driver not found.', 404);

      const employeeId = Object.prototype.hasOwnProperty.call(input, 'employeeId')
        ? input.employeeId || null
        : existing.rows[0].employee_id;
      const assignedVehicleId = Object.prototype.hasOwnProperty.call(input, 'assignedVehicleId')
        ? input.assignedVehicleId || null
        : existing.rows[0].assigned_vehicle_id;

      await this.assertEmployee(client, tenantId, employeeId || undefined);
      await this.assertAssignableVehicle(client, tenantId, assignedVehicleId || undefined);

      try {
        const result = await client.query(
          `UPDATE fleet_drivers SET
            full_name = COALESCE($3, full_name),
            phone = COALESCE($4, phone),
            license_number = COALESCE($5, license_number),
            license_class = COALESCE($6, license_class),
            license_issue_date = COALESCE($7, license_issue_date),
            license_expiry_date = COALESCE($8, license_expiry_date),
            badge_code = COALESCE($9, badge_code),
            branch_id = COALESCE($10, branch_id),
            status = COALESCE($11, status),
            employee_id = $12,
            assigned_vehicle_id = $13,
            notes = COALESCE($14, notes),
            updated_at = NOW()
           WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL
           RETURNING *`,
          [
            tenantId,
            driverId,
            input.fullName || null,
            input.phone || null,
            input.licenseNumber ? input.licenseNumber.trim().toUpperCase() : null,
            input.licenseClass || null,
            input.licenseIssueDate || null,
            input.licenseExpiryDate || null,
            input.badgeCode ? input.badgeCode.trim().toUpperCase() : null,
            input.branchId || null,
            input.status || null,
            employeeId,
            assignedVehicleId,
            input.notes || null
          ]
        );
        return this.mapDriver(result.rows[0]);
      } catch (error) {
        if (isUniqueViolation(error)) {
          const constraint = typeof error === 'object' && error && 'constraint' in error
            ? String((error as { constraint?: string }).constraint || '')
            : '';
          if (constraint.includes('badge')) {
            throw new ErpServiceError('DUPLICATE_BADGE', 'Driver badge/code already exists.', 409);
          }
          throw new ErpServiceError('DUPLICATE_LICENSE', 'Driver license or badge already exists.', 409);
        }
        throw error;
      }
    });
  }

  async archiveDriver(tenantId: string, driverId: string): Promise<boolean> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `UPDATE fleet_drivers
         SET deleted_at = NOW(), status = 'INACTIVE', assigned_vehicle_id = NULL, updated_at = NOW()
         WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL`,
        [tenantId, driverId]
      );
      return (result.rowCount ?? 0) > 0;
    });
  }

  private async assertEmployee(client: pg.PoolClient, tenantId: string, employeeId?: string): Promise<void> {
    if (!employeeId) return;
    const result = await client.query(
      `SELECT id FROM hrms_employees WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL LIMIT 1`,
      [tenantId, employeeId]
    );
    if (!result.rows[0]) throw new ErpServiceError('NOT_FOUND', 'Employee not found.', 404);
  }

  private async assertAssignableVehicle(client: pg.PoolClient, tenantId: string, vehicleId?: string): Promise<void> {
    if (!vehicleId) return;
    const result = await client.query(
      `SELECT id, status, deleted_at FROM fleet_vehicles WHERE tenant_id = $1 AND id = $2 LIMIT 1`,
      [tenantId, vehicleId]
    );
    if (!result.rows[0] || result.rows[0].deleted_at) {
      throw new ErpServiceError('NOT_FOUND', 'Vehicle not found.', 404);
    }
    if (String(result.rows[0].status) === 'RETIRED') {
      throw new ErpServiceError('VEHICLE_NOT_ASSIGNABLE', 'Archived or retired vehicles cannot be assigned.', 409);
    }
  }

  private mapDriver(row: Record<string, unknown>): FleetDriverRecord {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      employeeId: row.employee_id ? String(row.employee_id) : undefined,
      fullName: String(row.full_name),
      phone: row.phone ? String(row.phone) : undefined,
      licenseNumber: String(row.license_number),
      licenseClass: String(row.license_class) as LicenseClass,
      licenseIssueDate: isoDate(row.license_issue_date),
      licenseExpiryDate: isoDate(row.license_expiry_date),
      badgeCode: row.badge_code ? String(row.badge_code) : undefined,
      branchId: row.branch_id ? String(row.branch_id) : undefined,
      status: String(row.status) as DriverStatus,
      assignedVehicleId: row.assigned_vehicle_id ? String(row.assigned_vehicle_id) : undefined,
      notes: row.notes ? String(row.notes) : undefined,
      createdAt: iso(row.created_at),
      updatedAt: iso(row.updated_at)
    };
  }
}
