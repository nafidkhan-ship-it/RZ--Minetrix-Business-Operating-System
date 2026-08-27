import { isPostgresEnabled } from '../db/postgresPool.js';
import { FleetFuelRepository } from '../repositories/fleetFuelRepository.js';
import { ErpServiceError } from './erpErrors.js';

export { ErpServiceError };

export class FleetFuelService {
  private repo = new FleetFuelRepository();

  private ensurePostgres(): void {
    if (!isPostgresEnabled()) {
      throw new ErpServiceError('FLEET_POSTGRES_REQUIRED', 'Fleet APIs require PostgreSQL (DATABASE_URL).', 503);
    }
  }

  createFuelRecord(tenantId: string, input: Parameters<FleetFuelRepository['createFuelRecord']>[1]) {
    this.ensurePostgres();
    return this.repo.createFuelRecord(tenantId, input);
  }

  async getFuelRecord(tenantId: string, fuelId: string) {
    this.ensurePostgres();
    const record = await this.repo.getFuelRecord(tenantId, fuelId);
    if (!record) throw new ErpServiceError('NOT_FOUND', 'Fuel record not found.', 404);
    return record;
  }

  listFuelRecords(tenantId: string, filters: Parameters<FleetFuelRepository['listFuelRecords']>[1]) {
    this.ensurePostgres();
    return this.repo.listFuelRecords(tenantId, filters);
  }

  updateFuelRecord(tenantId: string, fuelId: string, input: Parameters<FleetFuelRepository['updateFuelRecord']>[2]) {
    this.ensurePostgres();
    return this.repo.updateFuelRecord(tenantId, fuelId, input);
  }

  async archiveFuelRecord(tenantId: string, fuelId: string) {
    this.ensurePostgres();
    const archived = await this.repo.archiveFuelRecord(tenantId, fuelId);
    if (!archived) throw new ErpServiceError('NOT_FOUND', 'Fuel record not found.', 404);
  }
}
