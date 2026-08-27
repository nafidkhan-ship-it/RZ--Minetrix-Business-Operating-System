import { isPostgresEnabled } from '../db/postgresPool.js';
import { FleetVehicleDocumentRepository } from '../repositories/fleetVehicleDocumentRepository.js';
import { LocalStorageProvider } from '../providers/storageProvider.js';
import { FleetVehicleDocumentRecord } from '../db/fleet/fleetTypes.js';
import { ErpServiceError } from './erpErrors.js';

export { ErpServiceError };

export class FleetVehicleDocumentService {
  private repo = new FleetVehicleDocumentRepository();
  private storage = new LocalStorageProvider();

  private ensurePostgres(): void {
    if (!isPostgresEnabled()) {
      throw new ErpServiceError('FLEET_POSTGRES_REQUIRED', 'Fleet APIs require PostgreSQL (DATABASE_URL).', 503);
    }
  }

  private async attachSignedUrl(tenantId: string, record: FleetVehicleDocumentRecord): Promise<FleetVehicleDocumentRecord> {
    if (!record.storageKey) return record;
    const signedUrl = await this.storage.getSignedUrl({ storageKey: record.storageKey, tenantId });
    return { ...record, signedUrl };
  }

  async createDocument(tenantId: string, input: Parameters<FleetVehicleDocumentRepository['createDocument']>[1]) {
    this.ensurePostgres();
    const record = await this.repo.createDocument(tenantId, input);
    return this.attachSignedUrl(tenantId, record);
  }

  async getDocument(tenantId: string, documentId: string) {
    this.ensurePostgres();
    const record = await this.repo.getDocument(tenantId, documentId);
    if (!record) throw new ErpServiceError('NOT_FOUND', 'Vehicle document not found.', 404);
    return this.attachSignedUrl(tenantId, record);
  }

  async listDocuments(tenantId: string, filters: Parameters<FleetVehicleDocumentRepository['listDocuments']>[1]) {
    this.ensurePostgres();
    const records = await this.repo.listDocuments(tenantId, filters);
    return Promise.all(records.map((record) => this.attachSignedUrl(tenantId, record)));
  }

  async updateDocument(
    tenantId: string,
    documentId: string,
    input: Parameters<FleetVehicleDocumentRepository['updateDocument']>[2]
  ) {
    this.ensurePostgres();
    const record = await this.repo.updateDocument(tenantId, documentId, input);
    return this.attachSignedUrl(tenantId, record);
  }

  async archiveDocument(tenantId: string, documentId: string) {
    this.ensurePostgres();
    const archived = await this.repo.archiveDocument(tenantId, documentId);
    if (!archived) throw new ErpServiceError('NOT_FOUND', 'Vehicle document not found.', 404);
  }
}
