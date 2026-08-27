import { isPostgresEnabled } from '../db/postgresPool.js';
import { FleetDriverRepository } from '../repositories/fleetDriverRepository.js';
import { ErpServiceError } from './erpErrors.js';

export { ErpServiceError };

export class FleetDriverService {
  private repo = new FleetDriverRepository();

  private ensurePostgres(): void {
    if (!isPostgresEnabled()) {
      throw new ErpServiceError('FLEET_POSTGRES_REQUIRED', 'Fleet APIs require PostgreSQL (DATABASE_URL).', 503);
    }
  }

  createDriver(tenantId: string, input: Parameters<FleetDriverRepository['createDriver']>[1]) {
    this.ensurePostgres();
    return this.repo.createDriver(tenantId, input);
  }

  async getDriver(tenantId: string, driverId: string) {
    this.ensurePostgres();
    const driver = await this.repo.getDriver(tenantId, driverId);
    if (!driver) throw new ErpServiceError('NOT_FOUND', 'Driver not found.', 404);
    return driver;
  }

  listDrivers(tenantId: string, filters: Parameters<FleetDriverRepository['listDrivers']>[1]) {
    this.ensurePostgres();
    return this.repo.listDrivers(tenantId, filters);
  }

  updateDriver(tenantId: string, driverId: string, input: Parameters<FleetDriverRepository['updateDriver']>[2]) {
    this.ensurePostgres();
    return this.repo.updateDriver(tenantId, driverId, input);
  }

  async archiveDriver(tenantId: string, driverId: string) {
    this.ensurePostgres();
    const archived = await this.repo.archiveDriver(tenantId, driverId);
    if (!archived) throw new ErpServiceError('NOT_FOUND', 'Driver not found.', 404);
  }
}
