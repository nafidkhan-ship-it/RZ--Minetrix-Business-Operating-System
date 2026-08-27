import { generateUuidV7 } from '../db/database.js';
import { withTenantTransaction } from '../db/tenantContext.js';
import { FleetVehicleRecord, FuelType, OwnershipType, VehicleStatus, VehicleType } from '../db/fleet/fleetTypes.js';
import { ErpServiceError, isUniqueViolation } from '../services/erpErrors.js';

function iso(value: unknown): string {
  return value ? new Date(String(value)).toISOString() : '';
}

export class FleetVehicleRepository {
  async createVehicle(tenantId: string, input: {
    registrationNumber: string;
    vehicleType: VehicleType;
    make: string;
    model: string;
    variant?: string;
    manufacturingYear: number;
    fuelType: FuelType;
    ownershipType: OwnershipType;
    ownerReference?: string;
    capacity: number;
    capacityUnit?: string;
    branchId?: string;
    status?: VehicleStatus;
    insuranceReference?: string;
    fitnessReference?: string;
    permitReference?: string;
    createdBy?: string;
  }): Promise<FleetVehicleRecord> {
    const id = generateUuidV7();
    return withTenantTransaction(tenantId, async (client) => {
      try {
        const result = await client.query(
          `INSERT INTO fleet_vehicles (
            id, tenant_id, registration_number, vehicle_type, make, model, variant, manufacturing_year,
            fuel_type, ownership_type, owner_reference, capacity, capacity_unit, branch_id, status,
            insurance_reference, fitness_reference, permit_reference, created_by
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
          RETURNING *`,
          [
            id,
            tenantId,
            input.registrationNumber.trim().toUpperCase(),
            input.vehicleType,
            input.make.trim(),
            input.model.trim(),
            input.variant || null,
            input.manufacturingYear,
            input.fuelType,
            input.ownershipType,
            input.ownerReference || null,
            input.capacity,
            input.capacityUnit || 'TON',
            input.branchId || null,
            input.status || 'ACTIVE',
            input.insuranceReference || null,
            input.fitnessReference || null,
            input.permitReference || null,
            input.createdBy || null
          ]
        );
        return this.mapVehicle(result.rows[0]);
      } catch (error) {
        if (isUniqueViolation(error)) {
          throw new ErpServiceError('DUPLICATE_REGISTRATION', 'Vehicle registration already exists.', 409);
        }
        throw error;
      }
    });
  }

  async getVehicle(tenantId: string, vehicleId: string): Promise<FleetVehicleRecord | null> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `SELECT * FROM fleet_vehicles WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL LIMIT 1`,
        [tenantId, vehicleId]
      );
      return result.rows[0] ? this.mapVehicle(result.rows[0]) : null;
    });
  }

  async listVehicles(tenantId: string, filters: {
    search?: string;
    registrationNumber?: string;
    status?: string;
    vehicleType?: string;
    limit?: number;
    offset?: number;
  }): Promise<FleetVehicleRecord[]> {
    return withTenantTransaction(tenantId, async (client) => {
      const conditions = ['tenant_id = $1', 'deleted_at IS NULL'];
      const values: unknown[] = [tenantId];
      if (filters.status) {
        values.push(filters.status);
        conditions.push(`status = $${values.length}`);
      }
      if (filters.vehicleType) {
        values.push(filters.vehicleType);
        conditions.push(`vehicle_type = $${values.length}`);
      }
      if (filters.registrationNumber) {
        values.push(filters.registrationNumber.trim().toUpperCase());
        conditions.push(`registration_number = $${values.length}`);
      }
      if (filters.search) {
        values.push(`%${filters.search}%`);
        conditions.push(`(
          registration_number ILIKE $${values.length}
          OR make ILIKE $${values.length}
          OR model ILIKE $${values.length}
          OR owner_reference ILIKE $${values.length}
        )`);
      }
      const limit = Math.min(Math.max(filters.limit || 100, 1), 200);
      const offset = Math.max(filters.offset || 0, 0);
      values.push(limit, offset);
      const result = await client.query(
        `SELECT * FROM fleet_vehicles
         WHERE ${conditions.join(' AND ')}
         ORDER BY registration_number
         LIMIT $${values.length - 1} OFFSET $${values.length}`,
        values
      );
      return result.rows.map((row) => this.mapVehicle(row));
    });
  }

  async updateVehicle(tenantId: string, vehicleId: string, input: Partial<{
    registrationNumber: string;
    vehicleType: VehicleType;
    make: string;
    model: string;
    variant: string;
    manufacturingYear: number;
    fuelType: FuelType;
    ownershipType: OwnershipType;
    ownerReference: string;
    capacity: number;
    capacityUnit: string;
    branchId: string;
    status: VehicleStatus;
    insuranceReference: string;
    fitnessReference: string;
    permitReference: string;
  }>): Promise<FleetVehicleRecord> {
    return withTenantTransaction(tenantId, async (client) => {
      const existing = await client.query(
        `SELECT * FROM fleet_vehicles WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL FOR UPDATE`,
        [tenantId, vehicleId]
      );
      if (!existing.rows[0]) throw new ErpServiceError('NOT_FOUND', 'Vehicle not found.', 404);
      try {
        const result = await client.query(
          `UPDATE fleet_vehicles SET
            registration_number = COALESCE($3, registration_number),
            vehicle_type = COALESCE($4, vehicle_type),
            make = COALESCE($5, make),
            model = COALESCE($6, model),
            variant = COALESCE($7, variant),
            manufacturing_year = COALESCE($8, manufacturing_year),
            fuel_type = COALESCE($9, fuel_type),
            ownership_type = COALESCE($10, ownership_type),
            owner_reference = COALESCE($11, owner_reference),
            capacity = COALESCE($12, capacity),
            capacity_unit = COALESCE($13, capacity_unit),
            branch_id = COALESCE($14, branch_id),
            status = COALESCE($15, status),
            insurance_reference = COALESCE($16, insurance_reference),
            fitness_reference = COALESCE($17, fitness_reference),
            permit_reference = COALESCE($18, permit_reference),
            updated_at = NOW()
           WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL
           RETURNING *`,
          [
            tenantId,
            vehicleId,
            input.registrationNumber || null,
            input.vehicleType || null,
            input.make || null,
            input.model || null,
            input.variant || null,
            input.manufacturingYear ?? null,
            input.fuelType || null,
            input.ownershipType || null,
            input.ownerReference || null,
            input.capacity ?? null,
            input.capacityUnit || null,
            input.branchId || null,
            input.status || null,
            input.insuranceReference || null,
            input.fitnessReference || null,
            input.permitReference || null
          ]
        );
        return this.mapVehicle(result.rows[0]);
      } catch (error) {
        if (isUniqueViolation(error)) {
          throw new ErpServiceError('DUPLICATE_REGISTRATION', 'Vehicle registration already exists.', 409);
        }
        throw error;
      }
    });
  }

  async archiveVehicle(tenantId: string, vehicleId: string): Promise<boolean> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `UPDATE fleet_vehicles
         SET deleted_at = NOW(), status = 'RETIRED', updated_at = NOW()
         WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL`,
        [tenantId, vehicleId]
      );
      return (result.rowCount ?? 0) > 0;
    });
  }

  private mapVehicle(row: Record<string, unknown>): FleetVehicleRecord {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      registrationNumber: String(row.registration_number),
      vehicleType: String(row.vehicle_type) as VehicleType,
      make: String(row.make),
      model: String(row.model),
      variant: row.variant ? String(row.variant) : undefined,
      manufacturingYear: Number(row.manufacturing_year),
      fuelType: String(row.fuel_type) as FuelType,
      ownershipType: String(row.ownership_type) as OwnershipType,
      ownerReference: row.owner_reference ? String(row.owner_reference) : undefined,
      capacity: Number(row.capacity),
      capacityUnit: String(row.capacity_unit),
      branchId: row.branch_id ? String(row.branch_id) : undefined,
      status: String(row.status) as VehicleStatus,
      insuranceReference: row.insurance_reference ? String(row.insurance_reference) : undefined,
      fitnessReference: row.fitness_reference ? String(row.fitness_reference) : undefined,
      permitReference: row.permit_reference ? String(row.permit_reference) : undefined,
      createdAt: iso(row.created_at),
      updatedAt: iso(row.updated_at)
    };
  }
}
