import { isPostgresEnabled } from '../db/postgresPool.js';
import { FleetMaintenanceRepository } from '../repositories/fleetMaintenanceRepository.js';
import { ErpServiceError } from './erpErrors.js';

export { ErpServiceError };

export class FleetMaintenanceService {
  private repo = new FleetMaintenanceRepository();

  private ensurePostgres(): void {
    if (!isPostgresEnabled()) {
      throw new ErpServiceError('FLEET_POSTGRES_REQUIRED', 'Fleet APIs require PostgreSQL (DATABASE_URL).', 503);
    }
  }

  createMaintenance(tenantId: string, input: Parameters<FleetMaintenanceRepository['createMaintenance']>[1]) {
    this.ensurePostgres();
    return this.repo.createMaintenance(tenantId, input);
  }

  async getMaintenance(tenantId: string, maintenanceId: string) {
    this.ensurePostgres();
    const record = await this.repo.getMaintenance(tenantId, maintenanceId);
    if (!record) throw new ErpServiceError('NOT_FOUND', 'Maintenance record not found.', 404);
    return record;
  }

  listMaintenance(tenantId: string, filters: Parameters<FleetMaintenanceRepository['listMaintenance']>[1]) {
    this.ensurePostgres();
    return this.repo.listMaintenance(tenantId, filters);
  }

  updateMaintenance(
    tenantId: string,
    maintenanceId: string,
    input: Parameters<FleetMaintenanceRepository['updateMaintenance']>[2]
  ) {
    this.ensurePostgres();
    return this.repo.updateMaintenance(tenantId, maintenanceId, input);
  }

  async archiveMaintenance(tenantId: string, maintenanceId: string) {
    this.ensurePostgres();
    const archived = await this.repo.archiveMaintenance(tenantId, maintenanceId);
    if (!archived) throw new ErpServiceError('NOT_FOUND', 'Maintenance record not found.', 404);
  }
}
