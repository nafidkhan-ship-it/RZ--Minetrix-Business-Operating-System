import { isPostgresEnabled } from '../db/postgresPool.js';
import { FleetOperationRepository } from '../repositories/fleetOperationRepository.js';
import { ErpServiceError } from './erpErrors.js';

export { ErpServiceError };

export class FleetOperationService {
  private repo = new FleetOperationRepository();

  private ensurePostgres(): void {
    if (!isPostgresEnabled()) {
      throw new ErpServiceError('FLEET_POSTGRES_REQUIRED', 'Fleet APIs require PostgreSQL (DATABASE_URL).', 503);
    }
  }

  createOperation(tenantId: string, input: Parameters<FleetOperationRepository['createOperation']>[1]) {
    this.ensurePostgres();
    return this.repo.createOperation(tenantId, input);
  }

  async getOperation(tenantId: string, operationId: string) {
    this.ensurePostgres();
    const record = await this.repo.getOperation(tenantId, operationId);
    if (!record) throw new ErpServiceError('NOT_FOUND', 'Fleet operation not found.', 404);
    return record;
  }

  listOperations(tenantId: string, filters: Parameters<FleetOperationRepository['listOperations']>[1]) {
    this.ensurePostgres();
    return this.repo.listOperations(tenantId, filters);
  }

  updateOperation(tenantId: string, operationId: string, input: Parameters<FleetOperationRepository['updateOperation']>[2]) {
    this.ensurePostgres();
    return this.repo.updateOperation(tenantId, operationId, input);
  }

  async archiveOperation(tenantId: string, operationId: string) {
    this.ensurePostgres();
    const archived = await this.repo.archiveOperation(tenantId, operationId);
    if (!archived) throw new ErpServiceError('NOT_FOUND', 'Fleet operation not found.', 404);
  }
}
