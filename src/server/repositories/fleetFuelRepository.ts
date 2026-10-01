import pg from 'pg';
import { generateUuidV7 } from '../db/database.js';
import { withTenantTransaction } from '../db/tenantContext.js';
import { FleetFuelRecord, FuelType } from '../db/fleet/fleetTypes.js';
import { ErpServiceError, isUniqueViolation } from '../services/erpErrors.js';
import { computeFuelTotal } from '../services/fleetHelpers.js';

function iso(value: unknown): string {
  return value ? new Date(String(value)).toISOString() : '';
}

export class FleetFuelRepository {
  async createFuelRecord(tenantId: string, input: {
    vehicleId: string;
    fuelDate?: string;
    fuelType: FuelType | 'OTHER';
    quantity: number;
    unit?: string;
    rate: number;
    odometerReading?: number;
    stationName?: string;
    referenceNumber?: string;
    notes?: string;
    createdBy?: string;
  }): Promise<FleetFuelRecord> {
    const id = generateUuidV7();
    const totalAmount = computeFuelTotal(input.quantity, input.rate);
    return withTenantTransaction(tenantId, async (client) => {
      await this.assertVehicle(client, tenantId, input.vehicleId);
      try {
        const result = await client.query(
          `INSERT INTO fleet_fuel_records (
            id, tenant_id, vehicle_id, fuel_date, fuel_type, quantity, unit, rate, total_amount,
            odometer_reading, station_name, reference_number, notes, created_by
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
          RETURNING *`,
          [
            id,
            tenantId,
            input.vehicleId,
            input.fuelDate || new Date().toISOString(),
            input.fuelType,
            input.quantity,
            input.unit || 'LITER',
            input.rate,
            totalAmount,
            input.odometerReading ?? null,
            input.stationName || null,
            input.referenceNumber ? input.referenceNumber.trim().toUpperCase() : null,
            input.notes || null,
            input.createdBy || null
          ]
        );
        return this.mapFuel(result.rows[0]);
      } catch (error) {
        if (isUniqueViolation(error)) {
          throw new ErpServiceError('DUPLICATE_REFERENCE', 'Fuel reference number already exists.', 409);
        }
        throw error;
      }
    });
  }

  async getFuelRecord(tenantId: string, fuelId: string): Promise<FleetFuelRecord | null> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `SELECT * FROM fleet_fuel_records WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL LIMIT 1`,
        [tenantId, fuelId]
      );
      return result.rows[0] ? this.mapFuel(result.rows[0]) : null;
    });
  }

  async listFuelRecords(tenantId: string, filters: {
    vehicleId?: string;
    fuelType?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<FleetFuelRecord[]> {
    return withTenantTransaction(tenantId, async (client) => {
      const conditions = ['tenant_id = $1', 'deleted_at IS NULL'];
      const values: unknown[] = [tenantId];
      if (filters.vehicleId) {
        values.push(filters.vehicleId);
        conditions.push(`vehicle_id = $${values.length}`);
      }
      if (filters.fuelType) {
        values.push(filters.fuelType);
        conditions.push(`fuel_type = $${values.length}`);
      }
      if (filters.search) {
        values.push(`%${filters.search}%`);
        conditions.push(`(
          reference_number ILIKE $${values.length}
          OR station_name ILIKE $${values.length}
        )`);
      }
      const limit = Math.min(Math.max(filters.limit || 100, 1), 200);
      const offset = Math.max(filters.offset || 0, 0);
      values.push(limit, offset);
      const result = await client.query(
        `SELECT * FROM fleet_fuel_records
         WHERE ${conditions.join(' AND ')}
         ORDER BY fuel_date DESC
         LIMIT $${values.length - 1} OFFSET $${values.length}`,
        values
      );
      return result.rows.map((row) => this.mapFuel(row));
    });
  }

  async updateFuelRecord(tenantId: string, fuelId: string, input: Partial<{
    fuelDate: string;
    fuelType: FuelType | 'OTHER';
    quantity: number;
    unit: string;
    rate: number;
    odometerReading: number;
    stationName: string;
    referenceNumber: string;
    notes: string;
  }>): Promise<FleetFuelRecord> {
    return withTenantTransaction(tenantId, async (client) => {
      const existing = await client.query(
        `SELECT * FROM fleet_fuel_records WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL FOR UPDATE`,
        [tenantId, fuelId]
      );
      if (!existing.rows[0]) throw new ErpServiceError('NOT_FOUND', 'Fuel record not found.', 404);

      const quantity = input.quantity ?? Number(existing.rows[0].quantity);
      const rate = input.rate ?? Number(existing.rows[0].rate);
      const totalAmount = computeFuelTotal(quantity, rate);

      try {
        const result = await client.query(
          `UPDATE fleet_fuel_records SET
            fuel_date = COALESCE($3, fuel_date),
            fuel_type = COALESCE($4, fuel_type),
            quantity = $5,
            unit = COALESCE($6, unit),
            rate = $7,
            total_amount = $8,
            odometer_reading = COALESCE($9, odometer_reading),
            station_name = COALESCE($10, station_name),
            reference_number = COALESCE($11, reference_number),
            notes = COALESCE($12, notes),
            updated_at = NOW()
           WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL
           RETURNING *`,
          [
            tenantId,
            fuelId,
            input.fuelDate || null,
            input.fuelType || null,
            quantity,
            input.unit || null,
            rate,
            totalAmount,
            input.odometerReading ?? null,
            input.stationName || null,
            input.referenceNumber ? input.referenceNumber.trim().toUpperCase() : null,
            input.notes || null
          ]
        );
        return this.mapFuel(result.rows[0]);
      } catch (error) {
        if (isUniqueViolation(error)) {
          throw new ErpServiceError('DUPLICATE_REFERENCE', 'Fuel reference number already exists.', 409);
        }
        throw error;
      }
    });
  }

  async archiveFuelRecord(tenantId: string, fuelId: string): Promise<boolean> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `UPDATE fleet_fuel_records SET deleted_at = NOW(), updated_at = NOW()
         WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL`,
        [tenantId, fuelId]
      );
      return (result.rowCount ?? 0) > 0;
    });
  }

  private async assertVehicle(client: pg.PoolClient, tenantId: string, vehicleId: string): Promise<void> {
    const result = await client.query(
      `SELECT id FROM fleet_vehicles WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL LIMIT 1`,
      [tenantId, vehicleId]
    );
    if (!result.rows[0]) throw new ErpServiceError('NOT_FOUND', 'Vehicle not found.', 404);
  }

  private mapFuel(row: Record<string, unknown>): FleetFuelRecord {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      vehicleId: String(row.vehicle_id),
      fuelDate: iso(row.fuel_date),
      fuelType: String(row.fuel_type) as FuelType | 'OTHER',
      quantity: Number(row.quantity),
      unit: String(row.unit),
      rate: Number(row.rate),
      totalAmount: Number(row.total_amount),
      odometerReading: row.odometer_reading != null ? Number(row.odometer_reading) : undefined,
      stationName: row.station_name ? String(row.station_name) : undefined,
      referenceNumber: row.reference_number ? String(row.reference_number) : undefined,
      notes: row.notes ? String(row.notes) : undefined,
      createdAt: iso(row.created_at),
      updatedAt: iso(row.updated_at)
    };
  }
}
