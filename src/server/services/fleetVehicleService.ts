import { isPostgresEnabled } from '../db/postgresPool.js';
import { FleetVehicleRepository } from '../repositories/fleetVehicleRepository.js';
import { ErpServiceError } from './erpErrors.js';

export { ErpServiceError };

export class FleetVehicleService {
  private repo = new FleetVehicleRepository();

  private ensurePostgres(): void {
    if (!isPostgresEnabled()) {
      throw new ErpServiceError('FLEET_POSTGRES_REQUIRED', 'Fleet APIs require PostgreSQL (DATABASE_URL).', 503);
    }
  }

  createVehicle(tenantId: string, input: Parameters<FleetVehicleRepository['createVehicle']>[1]) {
    this.ensurePostgres();
    return this.repo.createVehicle(tenantId, input);
  }

  async getVehicle(tenantId: string, vehicleId: string) {
    this.ensurePostgres();
    const vehicle = await this.repo.getVehicle(tenantId, vehicleId);
    if (!vehicle) throw new ErpServiceError('NOT_FOUND', 'Vehicle not found.', 404);
    return vehicle;
  }

  listVehicles(tenantId: string, filters: Parameters<FleetVehicleRepository['listVehicles']>[1]) {
    this.ensurePostgres();
    return this.repo.listVehicles(tenantId, filters);
  }

  updateVehicle(tenantId: string, vehicleId: string, input: Parameters<FleetVehicleRepository['updateVehicle']>[2]) {
    this.ensurePostgres();
    return this.repo.updateVehicle(tenantId, vehicleId, input);
  }

  async archiveVehicle(tenantId: string, vehicleId: string) {
    this.ensurePostgres();
    const archived = await this.repo.archiveVehicle(tenantId, vehicleId);
    if (!archived) throw new ErpServiceError('NOT_FOUND', 'Vehicle not found.', 404);
  }
}
