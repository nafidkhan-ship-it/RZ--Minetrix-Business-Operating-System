import pg from 'pg';
import { generateUuidV7 } from '../db/database.js';
import { withTenantTransaction } from '../db/tenantContext.js';
import {
  FleetVehicleDocumentRecord,
  VehicleDocumentStatus,
  VehicleDocumentType
} from '../db/fleet/fleetTypes.js';
import { ErpServiceError, isUniqueViolation } from '../services/erpErrors.js';
import { computeVehicleDocumentStatus } from '../services/fleetHelpers.js';

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

export class FleetVehicleDocumentRepository {
  async createDocument(tenantId: string, input: {
    vehicleId: string;
    documentType: VehicleDocumentType;
    documentNumber?: string;
    issueDate?: string;
    expiryDate?: string;
    issuingAuthority?: string;
    storageKey?: string;
    fileName?: string;
    notes?: string;
    createdBy?: string;
  }): Promise<FleetVehicleDocumentRecord> {
    const id = generateUuidV7();
    const status = computeVehicleDocumentStatus(input.expiryDate);
    return withTenantTransaction(tenantId, async (client) => {
      await this.assertVehicle(client, tenantId, input.vehicleId);
      try {
        const result = await client.query(
          `INSERT INTO fleet_vehicle_documents (
            id, tenant_id, vehicle_id, document_type, document_number, issue_date, expiry_date,
            issuing_authority, status, storage_key, file_name, notes, created_by
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
          RETURNING *`,
          [
            id,
            tenantId,
            input.vehicleId,
            input.documentType,
            input.documentNumber ? input.documentNumber.trim().toUpperCase() : null,
            input.issueDate || null,
            input.expiryDate || null,
            input.issuingAuthority || null,
            status,
            input.storageKey || null,
            input.fileName || null,
            input.notes || null,
            input.createdBy || null
          ]
        );
        return this.mapDocument(result.rows[0]);
      } catch (error) {
        if (isUniqueViolation(error)) {
          throw new ErpServiceError('DUPLICATE_DOCUMENT', 'Document number already exists for this vehicle and type.', 409);
        }
        throw error;
      }
    });
  }

  async getDocument(tenantId: string, documentId: string): Promise<FleetVehicleDocumentRecord | null> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `SELECT * FROM fleet_vehicle_documents WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL LIMIT 1`,
        [tenantId, documentId]
      );
      return result.rows[0] ? this.mapDocument(result.rows[0]) : null;
    });
  }

  async listDocuments(tenantId: string, filters: {
    vehicleId?: string;
    documentType?: string;
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<FleetVehicleDocumentRecord[]> {
    return withTenantTransaction(tenantId, async (client) => {
      const conditions = ['tenant_id = $1', 'deleted_at IS NULL'];
      const values: unknown[] = [tenantId];
      if (filters.vehicleId) {
        values.push(filters.vehicleId);
        conditions.push(`vehicle_id = $${values.length}`);
      }
      if (filters.documentType) {
        values.push(filters.documentType);
        conditions.push(`document_type = $${values.length}`);
      }
      if (filters.search) {
        values.push(`%${filters.search}%`);
        conditions.push(`(
          document_number ILIKE $${values.length}
          OR issuing_authority ILIKE $${values.length}
          OR file_name ILIKE $${values.length}
        )`);
      }
      const limit = Math.min(Math.max(filters.limit || 100, 1), 200);
      const offset = Math.max(filters.offset || 0, 0);
      values.push(limit, offset);
      const result = await client.query(
        `SELECT * FROM fleet_vehicle_documents
         WHERE ${conditions.join(' AND ')}
         ORDER BY expiry_date NULLS LAST, document_type
         LIMIT $${values.length - 1} OFFSET $${values.length}`,
        values
      );
      const rows = result.rows.map((row) => this.mapDocument(row));
      if (filters.status) {
        return rows.filter((row) => row.status === filters.status);
      }
      return rows;
    });
  }

  async updateDocument(tenantId: string, documentId: string, input: Partial<{
    documentType: VehicleDocumentType;
    documentNumber: string;
    issueDate: string;
    expiryDate: string;
    issuingAuthority: string;
    storageKey: string;
    fileName: string;
    notes: string;
  }>): Promise<FleetVehicleDocumentRecord> {
    return withTenantTransaction(tenantId, async (client) => {
      const existing = await client.query(
        `SELECT * FROM fleet_vehicle_documents WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL FOR UPDATE`,
        [tenantId, documentId]
      );
      if (!existing.rows[0]) throw new ErpServiceError('NOT_FOUND', 'Vehicle document not found.', 404);

      const issueDate = Object.prototype.hasOwnProperty.call(input, 'issueDate')
        ? input.issueDate || null
        : isoDate(existing.rows[0].issue_date) || null;
      const expiryDate = Object.prototype.hasOwnProperty.call(input, 'expiryDate')
        ? input.expiryDate || null
        : isoDate(existing.rows[0].expiry_date) || null;
      if (issueDate && expiryDate && expiryDate < issueDate) {
        throw new ErpServiceError('INVALID_DATES', 'expiryDate must be on or after issueDate.', 400);
      }
      const status = computeVehicleDocumentStatus(expiryDate);

      try {
        const result = await client.query(
          `UPDATE fleet_vehicle_documents SET
            document_type = COALESCE($3, document_type),
            document_number = COALESCE($4, document_number),
            issue_date = $5,
            expiry_date = $6,
            issuing_authority = COALESCE($7, issuing_authority),
            status = $8,
            storage_key = COALESCE($9, storage_key),
            file_name = COALESCE($10, file_name),
            notes = COALESCE($11, notes),
            updated_at = NOW()
           WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL
           RETURNING *`,
          [
            tenantId,
            documentId,
            input.documentType || null,
            input.documentNumber ? input.documentNumber.trim().toUpperCase() : null,
            issueDate,
            expiryDate,
            input.issuingAuthority || null,
            status,
            input.storageKey || null,
            input.fileName || null,
            input.notes || null
          ]
        );
        return this.mapDocument(result.rows[0]);
      } catch (error) {
        if (isUniqueViolation(error)) {
          throw new ErpServiceError('DUPLICATE_DOCUMENT', 'Document number already exists for this vehicle and type.', 409);
        }
        throw error;
      }
    });
  }

  async archiveDocument(tenantId: string, documentId: string): Promise<boolean> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `UPDATE fleet_vehicle_documents
         SET deleted_at = NOW(), status = 'ARCHIVED', updated_at = NOW()
         WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL`,
        [tenantId, documentId]
      );
      return (result.rowCount ?? 0) > 0;
    });
  }

  async hasExpiredMandatoryDocuments(tenantId: string, vehicleId: string): Promise<boolean> {
    return withTenantTransaction(tenantId, async (client) => {
      const mandatoryTypes = ['INSURANCE', 'FITNESS', 'PERMIT'];
      const result = await client.query(
        `SELECT document_type, expiry_date, status
         FROM fleet_vehicle_documents
         WHERE tenant_id = $1 AND vehicle_id = $2 AND deleted_at IS NULL
           AND document_type = ANY($3::text[])`,
        [tenantId, vehicleId, mandatoryTypes]
      );
      const byType = new Map(result.rows.map((row) => [String(row.document_type), row]));
      for (const docType of mandatoryTypes) {
        const row = byType.get(docType);
        if (!row) return true;
        const status = computeVehicleDocumentStatus(isoDate(row.expiry_date), String(row.status));
        if (status === 'EXPIRED') return true;
      }
      return false;
    });
  }

  private async assertVehicle(client: pg.PoolClient, tenantId: string, vehicleId: string): Promise<void> {
    const result = await client.query(
      `SELECT id FROM fleet_vehicles WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL LIMIT 1`,
      [tenantId, vehicleId]
    );
    if (!result.rows[0]) throw new ErpServiceError('NOT_FOUND', 'Vehicle not found.', 404);
  }

  private mapDocument(row: Record<string, unknown>): FleetVehicleDocumentRecord {
    const expiryDate = isoDate(row.expiry_date);
    const status = computeVehicleDocumentStatus(expiryDate, String(row.status));
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      vehicleId: String(row.vehicle_id),
      documentType: String(row.document_type) as VehicleDocumentType,
      documentNumber: row.document_number ? String(row.document_number) : undefined,
      issueDate: isoDate(row.issue_date),
      expiryDate,
      issuingAuthority: row.issuing_authority ? String(row.issuing_authority) : undefined,
      status: status as VehicleDocumentStatus,
      storageKey: row.storage_key ? String(row.storage_key) : undefined,
      fileName: row.file_name ? String(row.file_name) : undefined,
      notes: row.notes ? String(row.notes) : undefined,
      createdAt: iso(row.created_at),
      updatedAt: iso(row.updated_at)
    };
  }
}
