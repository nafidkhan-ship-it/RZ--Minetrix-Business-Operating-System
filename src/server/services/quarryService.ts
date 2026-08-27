import { QuarryRepository, CreateQuarryInput, UpdateQuarryInput } from '../repositories/quarryRepository.js';
import { ErpQuarry } from '../db/erp/quarryTypes.js';
import { isPostgresEnabled } from '../db/postgresPool.js';
import { db } from '../db/database.js';

export class QuarryServiceError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
  }
}

export class QuarryService {
  private quarryRepo = new QuarryRepository();

  private ensurePostgres(): void {
    if (!isPostgresEnabled()) {
      throw new QuarryServiceError(
        'ERP_POSTGRES_REQUIRED',
        'Quarry APIs require PostgreSQL (DATABASE_URL).',
        503
      );
    }
  }

  private resolveCompanyId(requestedCompanyId: string | undefined, userCompanyId: string, isAdmin: boolean): string {
    const companyId = requestedCompanyId?.trim() || userCompanyId;
    if (!companyId) {
      throw new QuarryServiceError('BAD_REQUEST', 'A valid companyId is required.');
    }
    if (requestedCompanyId && requestedCompanyId !== userCompanyId && !isAdmin) {
      throw new QuarryServiceError('FORBIDDEN', 'Cannot create quarries for another company.');
    }
    if (!db.companies.has(companyId)) {
      throw new QuarryServiceError('BAD_REQUEST', 'Company does not exist.');
    }
    return companyId;
  }

  async listQuarries(tenantId: string): Promise<ErpQuarry[]> {
    this.ensurePostgres();
    return this.quarryRepo.listByTenant(tenantId);
  }

  async getQuarry(tenantId: string, quarryId: string): Promise<ErpQuarry> {
    this.ensurePostgres();
    const quarry = await this.quarryRepo.findById(tenantId, quarryId);
    if (!quarry) {
      throw new QuarryServiceError('NOT_FOUND', 'Quarry not found.', 404);
    }
    return quarry;
  }

  async createQuarry(
    tenantId: string,
    userCompanyId: string,
    isAdmin: boolean,
    input: CreateQuarryInput
  ): Promise<ErpQuarry> {
    this.ensurePostgres();

    const companyId = this.resolveCompanyId(input.companyId, userCompanyId, isAdmin);
    const existing = await this.quarryRepo.findByCode(tenantId, input.code);
    if (existing) {
      throw new QuarryServiceError('DUPLICATE_QUARRY_CODE', `Quarry code [${input.code}] already exists.`, 409);
    }

    try {
      return await this.quarryRepo.create(tenantId, { ...input, companyId });
    } catch (error: unknown) {
      if (typeof error === 'object' && error && 'code' in error && (error as { code: string }).code === '23505') {
        throw new QuarryServiceError('DUPLICATE_QUARRY_CODE', `Quarry code [${input.code}] already exists.`, 409);
      }
      throw error;
    }
  }

  async updateQuarry(
    tenantId: string,
    quarryId: string,
    input: UpdateQuarryInput
  ): Promise<ErpQuarry> {
    this.ensurePostgres();
    const updated = await this.quarryRepo.update(tenantId, quarryId, input);
    if (!updated) {
      throw new QuarryServiceError('NOT_FOUND', 'Quarry not found.', 404);
    }
    return updated;
  }

  async archiveQuarry(tenantId: string, quarryId: string, updatedBy?: string): Promise<void> {
    this.ensurePostgres();
    const archived = await this.quarryRepo.archive(tenantId, quarryId, updatedBy);
    if (!archived) {
      throw new QuarryServiceError('NOT_FOUND', 'Quarry not found.', 404);
    }
  }
}
