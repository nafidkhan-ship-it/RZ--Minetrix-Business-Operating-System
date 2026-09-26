import pg from 'pg';
import { generateUuidV7 } from '../db/database.js';
import { withTenantTransaction } from '../db/tenantContext.js';
import { FleetOperationRecord, FleetOperationStatus } from '../db/fleet/fleetTypes.js';
import { ErpServiceError, isUniqueViolation } from '../services/erpErrors.js';
import { FleetVehicleDocumentRepository } from './fleetVehicleDocumentRepository.js';
import { FleetMaintenanceRepository } from './fleetMaintenanceRepository.js';

function iso(value: unknown): string {
  return value ? new Date(String(value)).toISOString() : '';
}

export class FleetOperationRepository {
  private documents = new FleetVehicleDocumentRepository();
  private maintenance = new FleetMaintenanceRepository();

  async createOperation(tenantId: string, input: {
    operationNumber: string;
    vehicleId: string;
    driverId: string;
    gatePassId?: string;
    dispatchId?: string;
    destination?: string;
    plannedStartAt?: string;
    plannedEndAt?: string;
    odometerStart?: number;
    status?: FleetOperationStatus;
    notes?: string;
    createdBy?: string;
  }): Promise<FleetOperationRecord> {
    const id = generateUuidV7();
    return withTenantTransaction(tenantId, async (client) => {
      await this.assertOperationalVehicle(client, tenantId, input.vehicleId);
      await this.assertOperationalDriver(client, tenantId, input.driverId);
      await this.assertNoActiveOperation(client, tenantId, input.vehicleId, input.driverId);
      if (await this.documents.hasExpiredMandatoryDocuments(tenantId, input.vehicleId)) {
        throw new ErpServiceError('DOCUMENT_EXPIRED', 'Vehicle has expired mandatory compliance documents.', 409);
      }
      if (await this.maintenance.hasOpenMaintenance(tenantId, input.vehicleId)) {
        throw new ErpServiceError('VEHICLE_IN_MAINTENANCE', 'Vehicle has open maintenance and cannot be assigned.', 409);
      }
      if (input.gatePassId) {
        await this.assertGatePass(client, tenantId, input.gatePassId);
      }
      if (input.dispatchId) {
        await this.assertDispatch(client, tenantId, input.dispatchId, input.gatePassId);
      }

      try {
        const result = await client.query(
          `INSERT INTO fleet_operations (
            id, tenant_id, operation_number, vehicle_id, driver_id, gate_pass_id, dispatch_id,
            destination, planned_start_at, planned_end_at, odometer_start, status, notes, created_by
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
          RETURNING *`,
          [
            id,
            tenantId,
            input.operationNumber.trim().toUpperCase(),
            input.vehicleId,
            input.driverId,
            input.gatePassId || null,
            input.dispatchId || null,
            input.destination || null,
            input.plannedStartAt || null,
            input.plannedEndAt || null,
            input.odometerStart ?? null,
            input.status || 'PLANNED',
            input.notes || null,
            input.createdBy || null
          ]
        );
        return this.mapOperation(result.rows[0]);
      } catch (error) {
        if (isUniqueViolation(error)) {
          const constraint = typeof error === 'object' && error && 'constraint' in error
            ? String((error as { constraint?: string }).constraint || '')
            : '';
          if (constraint.includes('gate_pass')) {
            throw new ErpServiceError('DUPLICATE_GATE_PASS_LINK', 'Gate pass is already linked to a fleet operation.', 409);
          }
          throw new ErpServiceError('DUPLICATE_OPERATION', 'Operation number already exists.', 409);
        }
        throw error;
      }
    });
  }

  async getByGatePass(tenantId: string, gatePassId: string): Promise<FleetOperationRecord | null> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `SELECT * FROM fleet_operations
         WHERE tenant_id = $1 AND gate_pass_id = $2 AND deleted_at IS NULL
         LIMIT 1`,
        [tenantId, gatePassId]
      );
      return result.rows[0] ? this.mapOperation(result.rows[0]) : null;
    });
  }

  async getOperation(tenantId: string, operationId: string): Promise<FleetOperationRecord | null> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `SELECT * FROM fleet_operations WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL LIMIT 1`,
        [tenantId, operationId]
      );
      return result.rows[0] ? this.mapOperation(result.rows[0]) : null;
    });
  }

  async listOperations(tenantId: string, filters: {
    vehicleId?: string;
    driverId?: string;
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<FleetOperationRecord[]> {
    return withTenantTransaction(tenantId, async (client) => {
      const conditions = ['tenant_id = $1', 'deleted_at IS NULL'];
      const values: unknown[] = [tenantId];
      if (filters.vehicleId) {
        values.push(filters.vehicleId);
        conditions.push(`vehicle_id = $${values.length}`);
      }
      if (filters.driverId) {
        values.push(filters.driverId);
        conditions.push(`driver_id = $${values.length}`);
      }
      if (filters.status) {
        values.push(filters.status);
        conditions.push(`status = $${values.length}`);
      }
      if (filters.search) {
        values.push(`%${filters.search}%`);
        conditions.push(`(
          operation_number ILIKE $${values.length}
          OR destination ILIKE $${values.length}
        )`);
      }
      const limit = Math.min(Math.max(filters.limit || 100, 1), 200);
      const offset = Math.max(filters.offset || 0, 0);
      values.push(limit, offset);
      const result = await client.query(
        `SELECT * FROM fleet_operations
         WHERE ${conditions.join(' AND ')}
         ORDER BY created_at DESC
         LIMIT $${values.length - 1} OFFSET $${values.length}`,
        values
      );
      return result.rows.map((row) => this.mapOperation(row));
    });
  }

  async updateOperation(tenantId: string, operationId: string, input: Partial<{
    vehicleId: string;
    driverId: string;
    gatePassId: string | null;
    dispatchId: string | null;
    destination: string;
    plannedStartAt: string;
    plannedEndAt: string;
    actualStartAt: string;
    actualEndAt: string;
    odometerStart: number;
    odometerEnd: number;
    status: FleetOperationStatus;
    notes: string;
  }>): Promise<FleetOperationRecord> {
    return withTenantTransaction(tenantId, async (client) => {
      const existing = await client.query(
        `SELECT * FROM fleet_operations WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL FOR UPDATE`,
        [tenantId, operationId]
      );
      if (!existing.rows[0]) throw new ErpServiceError('NOT_FOUND', 'Fleet operation not found.', 404);

      const vehicleId = input.vehicleId || String(existing.rows[0].vehicle_id);
      const driverId = input.driverId || String(existing.rows[0].driver_id);
      if (input.vehicleId || input.driverId) {
        await this.assertOperationalVehicle(client, tenantId, vehicleId);
        await this.assertOperationalDriver(client, tenantId, driverId);
      }
      if (input.gatePassId) {
        await this.assertGatePass(client, tenantId, input.gatePassId);
      }
      if (input.dispatchId) {
        await this.assertDispatch(client, tenantId, input.dispatchId, input.gatePassId || existing.rows[0].gate_pass_id);
      }

      try {
        const result = await client.query(
          `UPDATE fleet_operations SET
            vehicle_id = COALESCE($3, vehicle_id),
            driver_id = COALESCE($4, driver_id),
            gate_pass_id = COALESCE($5, gate_pass_id),
            dispatch_id = COALESCE($6, dispatch_id),
            destination = COALESCE($7, destination),
            planned_start_at = COALESCE($8, planned_start_at),
            planned_end_at = COALESCE($9, planned_end_at),
            actual_start_at = COALESCE($10, actual_start_at),
            actual_end_at = COALESCE($11, actual_end_at),
            odometer_start = COALESCE($12, odometer_start),
            odometer_end = COALESCE($13, odometer_end),
            status = COALESCE($14, status),
            notes = COALESCE($15, notes),
            updated_at = NOW()
           WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL
           RETURNING *`,
          [
            tenantId,
            operationId,
            input.vehicleId || null,
            input.driverId || null,
            Object.prototype.hasOwnProperty.call(input, 'gatePassId') ? input.gatePassId : null,
            Object.prototype.hasOwnProperty.call(input, 'dispatchId') ? input.dispatchId : null,
            input.destination || null,
            input.plannedStartAt || null,
            input.plannedEndAt || null,
            input.actualStartAt || null,
            input.actualEndAt || null,
            input.odometerStart ?? null,
            input.odometerEnd ?? null,
            input.status || null,
            input.notes || null
          ]
        );
        return this.mapOperation(result.rows[0]);
      } catch (error) {
        if (isUniqueViolation(error)) {
          throw new ErpServiceError('DUPLICATE_GATE_PASS_LINK', 'Gate pass is already linked to a fleet operation.', 409);
        }
        throw error;
      }
    });
  }

  async archiveOperation(tenantId: string, operationId: string): Promise<boolean> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `UPDATE fleet_operations
         SET deleted_at = NOW(), status = 'CANCELLED', updated_at = NOW()
         WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL`,
        [tenantId, operationId]
      );
      return (result.rowCount ?? 0) > 0;
    });
  }

  private async assertOperationalVehicle(client: pg.PoolClient, tenantId: string, vehicleId: string): Promise<void> {
    const result = await client.query(
      `SELECT id, status, deleted_at FROM fleet_vehicles WHERE tenant_id = $1 AND id = $2 LIMIT 1`,
      [tenantId, vehicleId]
    );
    if (!result.rows[0] || result.rows[0].deleted_at) {
      throw new ErpServiceError('NOT_FOUND', 'Vehicle not found.', 404);
    }
    const status = String(result.rows[0].status);
    if (status !== 'ACTIVE') {
      throw new ErpServiceError('VEHICLE_UNAVAILABLE', 'Vehicle is not available for operations.', 409);
    }
  }

  private async assertOperationalDriver(client: pg.PoolClient, tenantId: string, driverId: string): Promise<void> {
    const result = await client.query(
      `SELECT id, status, deleted_at FROM fleet_drivers WHERE tenant_id = $1 AND id = $2 LIMIT 1`,
      [tenantId, driverId]
    );
    if (!result.rows[0] || result.rows[0].deleted_at) {
      throw new ErpServiceError('NOT_FOUND', 'Driver not found.', 404);
    }
    if (String(result.rows[0].status) !== 'ACTIVE') {
      throw new ErpServiceError('DRIVER_UNAVAILABLE', 'Driver is not available for operations.', 409);
    }
  }

  private async assertNoActiveOperation(
    client: pg.PoolClient,
    tenantId: string,
    vehicleId: string,
    driverId: string
  ): Promise<void> {
    const result = await client.query(
      `SELECT id FROM fleet_operations
       WHERE tenant_id = $1 AND deleted_at IS NULL
         AND status IN ('PLANNED', 'ASSIGNED', 'IN_PROGRESS')
         AND (vehicle_id = $2 OR driver_id = $3)
       LIMIT 1`,
      [tenantId, vehicleId, driverId]
    );
    if (result.rows[0]) {
      throw new ErpServiceError('RESOURCE_BUSY', 'Vehicle or driver already has an active operation.', 409);
    }
  }

  private async assertGatePass(client: pg.PoolClient, tenantId: string, gatePassId: string): Promise<void> {
    const result = await client.query(
      `SELECT id, status FROM erp_gate_passes WHERE tenant_id = $1 AND id = $2 LIMIT 1`,
      [tenantId, gatePassId]
    );
    if (!result.rows[0]) throw new ErpServiceError('NOT_FOUND', 'Gate pass not found.', 404);
    const status = String(result.rows[0].status);
    if (!['ISSUED', 'DISPATCHED', 'APPROVED'].includes(status)) {
      throw new ErpServiceError('INVALID_GATE_PASS', 'Gate pass is not in a valid state for fleet operations.', 409);
    }
  }

  private async assertDispatch(
    client: pg.PoolClient,
    tenantId: string,
    dispatchId: string,
    gatePassId?: string | null
  ): Promise<void> {
    const result = await client.query(
      `SELECT id, gate_pass_id, status FROM erp_dispatches WHERE tenant_id = $1 AND id = $2 LIMIT 1`,
      [tenantId, dispatchId]
    );
    if (!result.rows[0]) throw new ErpServiceError('NOT_FOUND', 'Dispatch not found.', 404);
    if (String(result.rows[0].status) === 'CANCELLED') {
      throw new ErpServiceError('INVALID_DISPATCH', 'Dispatch is cancelled.', 409);
    }
    if (gatePassId && String(result.rows[0].gate_pass_id) !== gatePassId) {
      throw new ErpServiceError('DISPATCH_GATE_PASS_MISMATCH', 'Dispatch does not match the linked gate pass.', 409);
    }
  }

  private mapOperation(row: Record<string, unknown>): FleetOperationRecord {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      operationNumber: String(row.operation_number),
      vehicleId: String(row.vehicle_id),
      driverId: String(row.driver_id),
      gatePassId: row.gate_pass_id ? String(row.gate_pass_id) : undefined,
      dispatchId: row.dispatch_id ? String(row.dispatch_id) : undefined,
      destination: row.destination ? String(row.destination) : undefined,
      plannedStartAt: row.planned_start_at ? iso(row.planned_start_at) : undefined,
      plannedEndAt: row.planned_end_at ? iso(row.planned_end_at) : undefined,
      actualStartAt: row.actual_start_at ? iso(row.actual_start_at) : undefined,
      actualEndAt: row.actual_end_at ? iso(row.actual_end_at) : undefined,
      odometerStart: row.odometer_start != null ? Number(row.odometer_start) : undefined,
      odometerEnd: row.odometer_end != null ? Number(row.odometer_end) : undefined,
      status: String(row.status) as FleetOperationStatus,
      notes: row.notes ? String(row.notes) : undefined,
      createdAt: iso(row.created_at),
      updatedAt: iso(row.updated_at)
    };
  }
}
