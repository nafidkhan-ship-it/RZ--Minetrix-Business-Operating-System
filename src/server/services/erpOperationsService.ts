import { isPostgresEnabled } from '../db/postgresPool.js';
import { ErpCatalogRepository } from '../repositories/erpCatalogRepository.js';
import { ErpOperationsRepository } from '../repositories/erpOperationsRepository.js';
import { QuarryRepository } from '../repositories/quarryRepository.js';
import { ErpServiceError, isUniqueViolation } from './erpErrors.js';
import { ErpProductionLineInput } from '../db/erp/operationsTypes.js';

export { ErpServiceError };

export class ErpOperationsService {
  private catalog = new ErpCatalogRepository();
  private operations = new ErpOperationsRepository();
  private quarries = new QuarryRepository();

  private ensurePostgres(): void {
    if (!isPostgresEnabled()) {
      throw new ErpServiceError('ERP_POSTGRES_REQUIRED', 'ERP APIs require PostgreSQL (DATABASE_URL).', 503);
    }
  }

  async createProduct(tenantId: string, input: Parameters<ErpCatalogRepository['createProduct']>[1]) {
    this.ensurePostgres();
    try {
      return await this.catalog.createProduct(tenantId, input);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ErpServiceError('DUPLICATE_PRODUCT_CODE', `Product code [${input.code}] already exists.`, 409);
      }
      throw error;
    }
  }

  listProducts(tenantId: string) {
    this.ensurePostgres();
    return this.catalog.listProducts(tenantId);
  }

  async getProduct(tenantId: string, productId: string) {
    this.ensurePostgres();
    const product = await this.catalog.findProduct(tenantId, productId);
    if (!product) throw new ErpServiceError('NOT_FOUND', 'Product not found.', 404);
    return product;
  }

  async createProductSize(tenantId: string, input: Parameters<ErpCatalogRepository['createProductSize']>[1]) {
    this.ensurePostgres();
    await this.getProduct(tenantId, input.productId);
    try {
      return await this.catalog.createProductSize(tenantId, input);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ErpServiceError('DUPLICATE_PRODUCT_SIZE', 'Product size already exists.', 409);
      }
      throw error;
    }
  }

  listProductSizes(tenantId: string, productId: string) {
    this.ensurePostgres();
    return this.catalog.listProductSizes(tenantId, productId);
  }

  createProductPrice(tenantId: string, input: Parameters<ErpCatalogRepository['createProductPrice']>[1]) {
    this.ensurePostgres();
    return this.catalog.createProductPrice(tenantId, input);
  }

  listProductPrices(tenantId: string, productId?: string) {
    this.ensurePostgres();
    return this.catalog.listProductPrices(tenantId, productId);
  }

  async createLocation(tenantId: string, input: Parameters<ErpCatalogRepository['createLocation']>[1]) {
    this.ensurePostgres();
    const quarry = await this.quarries.findById(tenantId, input.quarryId);
    if (!quarry) throw new ErpServiceError('NOT_FOUND', 'Quarry not found.', 404);
    return this.catalog.createLocation(tenantId, input);
  }

  listLocations(tenantId: string, quarryId: string) {
    this.ensurePostgres();
    return this.catalog.listLocations(tenantId, quarryId);
  }

  async createLandParcel(tenantId: string, input: Parameters<ErpCatalogRepository['createLandParcel']>[1]) {
    this.ensurePostgres();
    try {
      return await this.catalog.createLandParcel(tenantId, input);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ErpServiceError('DUPLICATE_SURVEY_NUMBER', 'Survey number already exists.', 409);
      }
      throw error;
    }
  }

  listLandParcels(tenantId: string) {
    this.ensurePostgres();
    return this.catalog.listLandParcels(tenantId);
  }

  async createLease(tenantId: string, input: Parameters<ErpCatalogRepository['createLease']>[1]) {
    this.ensurePostgres();
    try {
      return await this.catalog.createLease(tenantId, input);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ErpServiceError('DUPLICATE_LEASE_NUMBER', 'Lease number already exists.', 409);
      }
      throw error;
    }
  }

  listLeases(tenantId: string) {
    this.ensurePostgres();
    return this.catalog.listLeases(tenantId);
  }

  async createCustomer(tenantId: string, input: Parameters<ErpCatalogRepository['createCustomer']>[1]) {
    this.ensurePostgres();
    try {
      return await this.catalog.createCustomer(tenantId, input);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ErpServiceError('DUPLICATE_CUSTOMER_CODE', 'Customer code already exists.', 409);
      }
      throw error;
    }
  }

  listCustomers(tenantId: string) {
    this.ensurePostgres();
    return this.catalog.listCustomers(tenantId);
  }

  async createProductionBatch(
    tenantId: string,
    input: {
      quarryId: string;
      batchNumber: string;
      productionDate: string;
      shiftName?: string;
      operatorUserId?: string;
      quantityUom?: string;
      details?: Record<string, unknown>;
      createdBy?: string;
      lines: ErpProductionLineInput[];
      postImmediately?: boolean;
    }
  ) {
    this.ensurePostgres();
    const quarry = await this.quarries.findById(tenantId, input.quarryId);
    if (!quarry) throw new ErpServiceError('NOT_FOUND', 'Quarry not found.', 404);
    if (!input.lines?.length) throw new ErpServiceError('BAD_REQUEST', 'At least one production line is required.');

    try {
      const batch = await this.operations.createProductionBatch(tenantId, input);
      if (input.postImmediately) {
        return this.operations.postProductionBatch(tenantId, batch.id, input.createdBy);
      }
      return batch;
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ErpServiceError('DUPLICATE_BATCH_NUMBER', `Batch number [${input.batchNumber}] already exists.`, 409);
      }
      throw error;
    }
  }

  getProductionBatch(tenantId: string, batchId: string) {
    this.ensurePostgres();
    return this.operations.getProductionBatch(tenantId, batchId).then((batch) => {
      if (!batch) throw new ErpServiceError('NOT_FOUND', 'Production batch not found.', 404);
      return batch;
    });
  }

  listProductionBatches(tenantId: string, quarryId?: string) {
    this.ensurePostgres();
    return this.operations.listProductionBatches(tenantId, quarryId);
  }

  postProductionBatch(tenantId: string, batchId: string, postedBy?: string) {
    this.ensurePostgres();
    return this.operations.postProductionBatch(tenantId, batchId, postedBy);
  }

  listStockBalances(tenantId: string, quarryId?: string) {
    this.ensurePostgres();
    return this.operations.listStockBalances(tenantId, quarryId);
  }

  listStockLedger(tenantId: string, quarryId?: string) {
    this.ensurePostgres();
    return this.operations.listStockLedger(tenantId, quarryId);
  }

  createAdjustment(tenantId: string, input: Parameters<ErpOperationsRepository['createAdjustment']>[1]) {
    this.ensurePostgres();
    return this.operations.createAdjustment(tenantId, input);
  }

  async createGatePass(tenantId: string, input: Parameters<ErpOperationsRepository['createGatePass']>[1]) {
    this.ensurePostgres();
    const quarry = await this.quarries.findById(tenantId, input.quarryId);
    if (!quarry) throw new ErpServiceError('NOT_FOUND', 'Quarry not found.', 404);
    const customer = await this.catalog.findCustomer(tenantId, input.customerId);
    if (!customer) throw new ErpServiceError('NOT_FOUND', 'Customer not found.', 404);
    if (!input.lines?.length) throw new ErpServiceError('BAD_REQUEST', 'At least one gate pass line is required.');
    try {
      return await this.operations.createGatePass(tenantId, input);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ErpServiceError('DUPLICATE_GATE_PASS', `Gate pass [${input.gatePassNumber}] already exists.`, 409);
      }
      throw error;
    }
  }

  getGatePass(tenantId: string, gatePassId: string) {
    this.ensurePostgres();
    return this.operations.getGatePass(tenantId, gatePassId).then((record) => {
      if (!record) throw new ErpServiceError('NOT_FOUND', 'Gate pass not found.', 404);
      return record;
    });
  }

  listGatePasses(tenantId: string) {
    this.ensurePostgres();
    return this.operations.listGatePasses(tenantId);
  }

  transitionGatePass(
    tenantId: string,
    gatePassId: string,
    nextStatus: 'APPROVED' | 'ISSUED' | 'CANCELLED',
    actorUserId?: string
  ) {
    this.ensurePostgres();
    return this.operations.transitionGatePass(tenantId, gatePassId, nextStatus, actorUserId);
  }

  createDispatch(tenantId: string, input: Parameters<ErpOperationsRepository['createDispatch']>[1]) {
    this.ensurePostgres();
    return this.operations.createDispatch(tenantId, input);
  }

  getDispatch(tenantId: string, dispatchId: string) {
    this.ensurePostgres();
    return this.operations.getDispatch(tenantId, dispatchId).then((record) => {
      if (!record) throw new ErpServiceError('NOT_FOUND', 'Dispatch not found.', 404);
      return record;
    });
  }

  listDispatches(tenantId: string) {
    this.ensurePostgres();
    return this.operations.listDispatches(tenantId);
  }

  createSettlementRate(tenantId: string, input: Parameters<ErpOperationsRepository['createSettlementRate']>[1]) {
    this.ensurePostgres();
    return this.operations.createSettlementRate(tenantId, input);
  }

  listSettlementRates(tenantId: string) {
    this.ensurePostgres();
    return this.operations.listSettlementRates(tenantId);
  }

  createSettlement(tenantId: string, input: Parameters<ErpOperationsRepository['createSettlement']>[1]) {
    this.ensurePostgres();
    return this.operations.createSettlement(tenantId, input);
  }

  listSettlements(tenantId: string) {
    this.ensurePostgres();
    return this.operations.listSettlements(tenantId);
  }
}
