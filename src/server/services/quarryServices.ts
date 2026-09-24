import { db, generateUuidV7 } from '../db/database.js';
import {
  QuarryMaster,
  StoneProduct,
  QuarryProduction,
  QuarryStock,
  GatePass,
  GatePassStatus,
  QuarryLandLease,
  LandownerSettlement,
  QuarryType
} from '../db/schema.js';
import { QuarryRepository } from '../repositories/quarryRepositories.js';
import { AuditRepository } from '../repositories/sharedCoreRepositories.js';

// ============================================================================
// DOMAIN ERROR HANDLING
// ============================================================================

export class QuarryDomainError extends Error {
  public code: string;
  public details?: any;

  constructor(code: string, message: string, details?: any) {
    super(message);
    this.name = 'QuarryDomainError';
    this.code = code;
    this.details = details;
  }
}

// ============================================================================
// CONTEXT & DTO INTERFACES
// ============================================================================

export interface SecurityContext {
  tenantId: string;
  userId: string;
  userEmail?: string;
  ipAddress?: string;
  correlationId?: string;
}

export interface CreateQuarryDto {
  companyId: string;
  branchId: string;
  businessUnitId?: string;
  name: string;
  quarryType: QuarryType;
  location: string;
  address?: string;
  ownerId?: string;
  leaseReference?: string;
}

export interface UpdateQuarryDto {
  name?: string;
  location?: string;
  address?: string;
  ownerId?: string;
  leaseReference?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
}

export interface CreateStoneProductDto {
  quarryId: string;
  productCode: string;
  name: string;
  mineralType: QuarryType;
  dimensions?: string;
  unit: 'TON' | 'CFT' | 'PIECE' | 'LOAD';
  defaultPrice: number;
  gstRate?: number;
}

export interface UpdateStoneProductDto {
  name?: string;
  dimensions?: string;
  unit?: 'TON' | 'CFT' | 'PIECE' | 'LOAD';
  defaultPrice?: number;
  gstRate?: number;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface RecordProductionDto {
  id?: string; // Optional idempotency client id
  quarryId: string;
  productId: string;
  productionType?: 'LATERITE_CUTTING' | 'HARD_ROCK_EXTRACTION';
  productionDate?: string;
  shift?: 'DAY' | 'NIGHT' | 'GENERAL';
  quantity: number;
  operatorId: string;
  machineId?: string;
  remarks?: string;
}

export interface RecordStockAdjustmentDto {
  quarryId: string;
  productId: string;
  adjustmentType: 'ADJUSTMENT_IN' | 'ADJUSTMENT_OUT';
  quantity: number;
  reason: string;
  remarks?: string;
}

export interface CreateGatePassDto {
  id?: string;
  quarryId: string;
  customerId: string;
  productId: string;
  quantity: number;
  unit?: 'TON' | 'CFT' | 'PIECE' | 'LOAD';
  vehicleId?: string;
  vehicleNo?: string;
  driverId?: string;
  driverName?: string;
  grossWeight?: number;
  tareWeight?: number;
  salesReference?: string;
}

export interface CreateLandLeaseDto {
  quarryId: string;
  ownerId?: string;
  ownerName: string;
  surveyNumber: string;
  village: string;
  taluk: string;
  area: number; // in Acres
  leaseType: 'OWNED' | 'LEASED' | 'REVENUE_SHARE';
  royaltyType: 'FIXED_MONTHLY' | 'PER_TON' | 'PER_PIECE' | 'REVENUE_PERCENT';
  royaltyRate: number;
  startDate: string;
  expiryDate: string;
  documentReference?: string;
}

export interface UpdateLandLeaseDto {
  ownerName?: string;
  area?: number;
  royaltyType?: 'FIXED_MONTHLY' | 'PER_TON' | 'PER_PIECE' | 'REVENUE_PERCENT';
  royaltyRate?: number;
  expiryDate?: string;
  status?: 'ACTIVE' | 'EXPIRED' | 'TERMINATED';
  documentReference?: string;
}

export interface CreateSettlementDto {
  leaseId: string;
  periodStart: string;
  periodEnd: string;
  basisQuantity: number;
}

export interface SettlementCalculationResult {
  leaseId: string;
  leaseOwner: string;
  royaltyType: 'FIXED_MONTHLY' | 'PER_TON' | 'PER_PIECE' | 'REVENUE_PERCENT';
  royaltyRate: number;
  basisQuantity: number;
  periodStart: string;
  periodEnd: string;
  calculatedAmount: number;
}

// ============================================================================
// QUARRY MASTER SERVICE
// ============================================================================

export class QuarryMasterService {
  private repo: QuarryRepository;
  private auditRepo: AuditRepository;

  constructor() {
    this.repo = new QuarryRepository();
    this.auditRepo = new AuditRepository();
  }

  public async createQuarry(dto: CreateQuarryDto, ctx: SecurityContext): Promise<QuarryMaster> {
    if (!ctx.tenantId) throw new QuarryDomainError('TENANT_ACCESS_DENIED', 'Tenant ID is required.');
    if (!dto.name || !dto.name.trim()) throw new QuarryDomainError('INVALID_QUARRY_TYPE', 'Quarry name is required.');
    if (dto.quarryType !== 'LATERITE' && dto.quarryType !== 'HARD_ROCK') {
      throw new QuarryDomainError('INVALID_QUARRY_TYPE', `Invalid quarry type '${dto.quarryType}'. Must be LATERITE or HARD_ROCK.`);
    }

    // Validate Company & Branch in Tenant
    const company = db.companies.get(dto.companyId);
    if (!company || company.tenantId !== ctx.tenantId) {
      throw new QuarryDomainError('INVALID_COMPANY', `Company '${dto.companyId}' is invalid or access is denied.`);
    }

    const branch = db.branches.get(dto.branchId);
    if (!branch || branch.tenantId !== ctx.tenantId) {
      throw new QuarryDomainError('INVALID_BRANCH', `Branch '${dto.branchId}' is invalid or access is denied.`);
    }

    // Prevent duplicate name within same tenant & company
    const existing = await this.repo.getQuarryByName(ctx.tenantId, dto.companyId, dto.name);
    if (existing) {
      throw new QuarryDomainError('DUPLICATE_QUARRY', `A quarry with name '${dto.name}' already exists in this company.`);
    }

    const now = new Date().toISOString();
    const quarryId = generateUuidV7();

    const quarry: QuarryMaster = {
      id: quarryId,
      tenantId: ctx.tenantId,
      companyId: dto.companyId,
      branchId: dto.branchId,
      businessUnitId: dto.businessUnitId,
      name: dto.name.trim(),
      quarryType: dto.quarryType,
      status: 'ACTIVE',
      location: dto.location || '',
      address: dto.address,
      ownerId: dto.ownerId || ctx.userId,
      leaseReference: dto.leaseReference,
      createdAt: now,
      updatedAt: now,
      createdBy: ctx.userId,
      version: 1
    };

    await this.repo.saveQuarry(quarry);

    // Audit mutation
    await this.auditRepo.log({
      tenantId: ctx.tenantId,
      actorUserId: ctx.userId,
      actorEmail: ctx.userEmail || 'system@minetrix.local',
      action: 'QUARRY_MASTER_CREATE',
      module: 'Quarry Management',
      resource: 'QuarryMaster',
      resourceId: quarry.id,
      ipAddress: ctx.ipAddress || '127.0.0.1',
      correlationId: ctx.correlationId || `corr-quarry-${quarry.id}`,
      afterStateJson: JSON.stringify(quarry),
      status: 'SUCCESS'
    });

    return quarry;
  }

  public async getQuarry(id: string, ctx: SecurityContext): Promise<QuarryMaster> {
    if (!ctx.tenantId) throw new QuarryDomainError('TENANT_ACCESS_DENIED', 'Tenant context required.');
    const quarry = await this.repo.getQuarryById(ctx.tenantId, id);
    if (!quarry) {
      throw new QuarryDomainError('QUARRY_NOT_FOUND', `Quarry '${id}' not found or access denied.`);
    }
    return quarry;
  }

  public async listQuarries(ctx: SecurityContext): Promise<QuarryMaster[]> {
    if (!ctx.tenantId) throw new QuarryDomainError('TENANT_ACCESS_DENIED', 'Tenant context required.');
    return this.repo.getQuarries(ctx.tenantId);
  }

  public async updateQuarry(id: string, dto: UpdateQuarryDto, ctx: SecurityContext): Promise<QuarryMaster> {
    const quarry = await this.getQuarry(id, ctx);
    const beforeState = JSON.stringify(quarry);

    if (dto.name && dto.name.trim()) {
      const existing = await this.repo.getQuarryByName(ctx.tenantId, quarry.companyId, dto.name);
      if (existing && existing.id !== quarry.id) {
        throw new QuarryDomainError('DUPLICATE_QUARRY', `Another quarry with name '${dto.name}' already exists.`);
      }
      quarry.name = dto.name.trim();
    }

    if (dto.location !== undefined) quarry.location = dto.location;
    if (dto.address !== undefined) quarry.address = dto.address;
    if (dto.ownerId !== undefined) quarry.ownerId = dto.ownerId;
    if (dto.leaseReference !== undefined) quarry.leaseReference = dto.leaseReference;
    if (dto.status !== undefined) quarry.status = dto.status;

    quarry.updatedAt = new Date().toISOString();
    quarry.updatedBy = ctx.userId;
    quarry.version = (quarry.version || 1) + 1;

    await this.repo.saveQuarry(quarry);

    await this.auditRepo.log({
      tenantId: ctx.tenantId,
      actorUserId: ctx.userId,
      actorEmail: ctx.userEmail || 'system@minetrix.local',
      action: 'QUARRY_MASTER_UPDATE',
      module: 'Quarry Management',
      resource: 'QuarryMaster',
      resourceId: quarry.id,
      ipAddress: ctx.ipAddress || '127.0.0.1',
      correlationId: ctx.correlationId || `corr-quarry-${quarry.id}`,
      beforeStateJson: beforeState,
      afterStateJson: JSON.stringify(quarry),
      status: 'SUCCESS'
    });

    return quarry;
  }

  public async deactivateQuarry(id: string, ctx: SecurityContext): Promise<QuarryMaster> {
    const quarry = await this.getQuarry(id, ctx);
    const beforeState = JSON.stringify(quarry);

    quarry.status = 'INACTIVE';
    quarry.updatedAt = new Date().toISOString();
    quarry.updatedBy = ctx.userId;

    await this.repo.saveQuarry(quarry);

    await this.auditRepo.log({
      tenantId: ctx.tenantId,
      actorUserId: ctx.userId,
      actorEmail: ctx.userEmail || 'system@minetrix.local',
      action: 'QUARRY_MASTER_DEACTIVATE',
      module: 'Quarry Management',
      resource: 'QuarryMaster',
      resourceId: quarry.id,
      ipAddress: ctx.ipAddress || '127.0.0.1',
      correlationId: ctx.correlationId || `corr-quarry-${quarry.id}`,
      beforeStateJson: beforeState,
      afterStateJson: JSON.stringify(quarry),
      status: 'SUCCESS'
    });

    return quarry;
  }
}

// ============================================================================
// STONE PRODUCT SERVICE
// ============================================================================

export class StoneProductService {
  private repo: QuarryRepository;
  private auditRepo: AuditRepository;

  constructor() {
    this.repo = new QuarryRepository();
    this.auditRepo = new AuditRepository();
  }

  public async createStoneProduct(dto: CreateStoneProductDto, ctx: SecurityContext): Promise<StoneProduct> {
    if (!ctx.tenantId) throw new QuarryDomainError('TENANT_ACCESS_DENIED', 'Tenant ID is required.');
    if (!dto.productCode || !dto.productCode.trim()) throw new QuarryDomainError('INVALID_PRODUCT', 'Product code is required.');
    if (!dto.name || !dto.name.trim()) throw new QuarryDomainError('INVALID_PRODUCT', 'Product name is required.');

    // Validate Quarry
    const quarry = await this.repo.getQuarryById(ctx.tenantId, dto.quarryId);
    if (!quarry) {
      throw new QuarryDomainError('QUARRY_NOT_FOUND', `Quarry '${dto.quarryId}' not found or access denied.`);
    }

    // Mineral type compatibility rule
    if (dto.mineralType !== quarry.quarryType) {
      throw new QuarryDomainError(
        'INVALID_PRODUCT',
        `Product mineral type '${dto.mineralType}' does not match quarry type '${quarry.quarryType}'.`
      );
    }

    // Unit validity
    const validUnits = ['TON', 'CFT', 'PIECE', 'LOAD'];
    if (!validUnits.includes(dto.unit)) {
      throw new QuarryDomainError('INVALID_PRODUCT', `Invalid product unit '${dto.unit}'. Allowed: TON, CFT, PIECE, LOAD.`);
    }

    // Price validity
    if (dto.defaultPrice === undefined || dto.defaultPrice < 0) {
      throw new QuarryDomainError('INVALID_PRODUCT', 'Default price must be non-negative.');
    }

    // Duplicate product code check
    const existing = await this.repo.getProductByCode(ctx.tenantId, dto.quarryId, dto.productCode);
    if (existing) {
      throw new QuarryDomainError('DUPLICATE_PRODUCT', `A product with code '${dto.productCode}' already exists for this quarry.`);
    }

    const now = new Date().toISOString();
    const product: StoneProduct = {
      id: generateUuidV7(),
      tenantId: ctx.tenantId,
      quarryId: dto.quarryId,
      productCode: dto.productCode.trim(),
      name: dto.name.trim(),
      mineralType: dto.mineralType,
      dimensions: dto.dimensions,
      unit: dto.unit,
      defaultPrice: dto.defaultPrice,
      gstRate: dto.gstRate !== undefined ? dto.gstRate : 5,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
      createdBy: ctx.userId
    };

    await this.repo.saveProduct(product);

    await this.auditRepo.log({
      tenantId: ctx.tenantId,
      actorUserId: ctx.userId,
      actorEmail: ctx.userEmail || 'system@minetrix.local',
      action: 'STONE_PRODUCT_CREATE',
      module: 'Quarry Management',
      resource: 'StoneProduct',
      resourceId: product.id,
      ipAddress: ctx.ipAddress || '127.0.0.1',
      correlationId: ctx.correlationId || `corr-prod-${product.id}`,
      afterStateJson: JSON.stringify(product),
      status: 'SUCCESS'
    });

    return product;
  }

  public async getStoneProduct(id: string, ctx: SecurityContext): Promise<StoneProduct> {
    if (!ctx.tenantId) throw new QuarryDomainError('TENANT_ACCESS_DENIED', 'Tenant ID is required.');
    const prod = await this.repo.getProductById(ctx.tenantId, id);
    if (!prod) {
      throw new QuarryDomainError('PRODUCT_NOT_FOUND', `Stone product '${id}' not found or access denied.`);
    }
    return prod;
  }

  public async listStoneProducts(ctx: SecurityContext, quarryId?: string): Promise<StoneProduct[]> {
    if (!ctx.tenantId) throw new QuarryDomainError('TENANT_ACCESS_DENIED', 'Tenant ID is required.');
    return this.repo.getProducts(ctx.tenantId, quarryId);
  }

  public async updateStoneProduct(id: string, dto: UpdateStoneProductDto, ctx: SecurityContext): Promise<StoneProduct> {
    const product = await this.getStoneProduct(id, ctx);
    const beforeState = JSON.stringify(product);

    if (dto.name !== undefined) product.name = dto.name.trim();
    if (dto.dimensions !== undefined) product.dimensions = dto.dimensions;
    if (dto.unit !== undefined) product.unit = dto.unit;
    if (dto.defaultPrice !== undefined) {
      if (dto.defaultPrice < 0) throw new QuarryDomainError('INVALID_PRODUCT', 'Price cannot be negative.');
      product.defaultPrice = dto.defaultPrice;
    }
    if (dto.gstRate !== undefined) product.gstRate = dto.gstRate;
    if (dto.status !== undefined) product.status = dto.status;

    product.updatedAt = new Date().toISOString();
    product.updatedBy = ctx.userId;

    await this.repo.saveProduct(product);

    await this.auditRepo.log({
      tenantId: ctx.tenantId,
      actorUserId: ctx.userId,
      actorEmail: ctx.userEmail || 'system@minetrix.local',
      action: 'STONE_PRODUCT_UPDATE',
      module: 'Quarry Management',
      resource: 'StoneProduct',
      resourceId: product.id,
      ipAddress: ctx.ipAddress || '127.0.0.1',
      correlationId: ctx.correlationId || `corr-prod-${product.id}`,
      beforeStateJson: beforeState,
      afterStateJson: JSON.stringify(product),
      status: 'SUCCESS'
    });

    return product;
  }

  public async deactivateStoneProduct(id: string, ctx: SecurityContext): Promise<StoneProduct> {
    const product = await this.getStoneProduct(id, ctx);
    const beforeState = JSON.stringify(product);

    product.status = 'INACTIVE';
    product.updatedAt = new Date().toISOString();
    product.updatedBy = ctx.userId;

    await this.repo.saveProduct(product);

    await this.auditRepo.log({
      tenantId: ctx.tenantId,
      actorUserId: ctx.userId,
      actorEmail: ctx.userEmail || 'system@minetrix.local',
      action: 'STONE_PRODUCT_DEACTIVATE',
      module: 'Quarry Management',
      resource: 'StoneProduct',
      resourceId: product.id,
      ipAddress: ctx.ipAddress || '127.0.0.1',
      correlationId: ctx.correlationId || `corr-prod-${product.id}`,
      beforeStateJson: beforeState,
      afterStateJson: JSON.stringify(product),
      status: 'SUCCESS'
    });

    return product;
  }
}

// ============================================================================
// PRODUCTION SERVICE
// ============================================================================

export class ProductionService {
  private repo: QuarryRepository;
  private auditRepo: AuditRepository;

  constructor() {
    this.repo = new QuarryRepository();
    this.auditRepo = new AuditRepository();
  }

  /**
   * Enterprise Production Flow:
   * Production -> validate Quarry -> validate Product -> validate Operator -> validate Machine -> create Production -> create exactly ONE STOCK_IN -> Audit
   */
  public async recordProduction(
    dto: RecordProductionDto,
    ctx: SecurityContext
  ): Promise<{ production: QuarryProduction; stockLedgerEntry: QuarryStock; newBalance: number }> {
    if (!ctx.tenantId) throw new QuarryDomainError('TENANT_ACCESS_DENIED', 'Tenant ID is required.');

    // 1. Validate Quarry
    if (!dto.quarryId) throw new QuarryDomainError('QUARRY_NOT_FOUND', 'Quarry ID is required.');
    const quarry = await this.repo.getQuarryById(ctx.tenantId, dto.quarryId);
    if (!quarry) throw new QuarryDomainError('QUARRY_NOT_FOUND', `Quarry '${dto.quarryId}' not found or access denied.`);
    if (quarry.status !== 'ACTIVE') throw new QuarryDomainError('INVALID_QUARRY_TYPE', `Quarry '${quarry.name}' is not ACTIVE.`);

    // Determine production type
    const resolvedProductionType = dto.productionType || (
      quarry.quarryType === 'LATERITE' ? 'LATERITE_CUTTING' : 'HARD_ROCK_EXTRACTION'
    );

    if (resolvedProductionType === 'LATERITE_CUTTING' && quarry.quarryType !== 'LATERITE') {
      throw new QuarryDomainError('INVALID_QUARRY_TYPE', `Cannot perform LATERITE_CUTTING on a ${quarry.quarryType} quarry.`);
    }
    if (resolvedProductionType === 'HARD_ROCK_EXTRACTION' && quarry.quarryType !== 'HARD_ROCK') {
      throw new QuarryDomainError('INVALID_QUARRY_TYPE', `Cannot perform HARD_ROCK_EXTRACTION on a ${quarry.quarryType} quarry.`);
    }

    // 2. Validate Product
    if (!dto.productId) throw new QuarryDomainError('PRODUCT_NOT_FOUND', 'Product ID is required.');
    const product = await this.repo.getProductById(ctx.tenantId, dto.productId);
    if (!product) throw new QuarryDomainError('PRODUCT_NOT_FOUND', `Product '${dto.productId}' not found or access denied.`);
    if (product.status !== 'ACTIVE') throw new QuarryDomainError('INVALID_PRODUCT', `Product '${product.name}' is not ACTIVE.`);
    if (product.mineralType !== quarry.quarryType) {
      throw new QuarryDomainError('INVALID_PRODUCT', `Product mineral type '${product.mineralType}' is incompatible with quarry type '${quarry.quarryType}'.`);
    }
    if (product.quarryId && product.quarryId !== quarry.id) {
      throw new QuarryDomainError('INVALID_PRODUCT', `Product '${product.name}' is assigned to a different quarry.`);
    }

    // 3. Validate Operator if provided
    if (dto.operatorId) {
      const opUser = db.users.get(dto.operatorId);
      const opEmp = db.hrEmployees.get(dto.operatorId);
      const validUser = opUser && opUser.tenantId === ctx.tenantId && !opUser.deletedAt;
      const validEmp = opEmp && opEmp.tenantId === ctx.tenantId && opEmp.status === 'ACTIVE';
      if (!validUser && !validEmp) {
        throw new QuarryDomainError('INVALID_OPERATOR', `Operator '${dto.operatorId}' is not an active staff/user in this tenant.`);
      }
    }

    // 4. Validate Machine reference if provided
    if (dto.machineId) {
      const machine = db.fleetVehicles.get(dto.machineId);
      if (machine && machine.tenantId !== ctx.tenantId) {
        throw new QuarryDomainError('INVALID_MACHINE', `Machine vehicle '${dto.machineId}' belongs to another tenant.`);
      }
    }

    // 5. Validate Quantity
    if (!dto.quantity || dto.quantity <= 0 || isNaN(dto.quantity)) {
      throw new QuarryDomainError('INVALID_QUANTITY', 'Production quantity must be greater than zero.');
    }

    const now = new Date().toISOString();
    const productionDate = dto.productionDate || now.split('T')[0];
    const productionId = dto.id || generateUuidV7();

    // Concurrency Protection: Acquire stock advisory lock on composite key (tenantId + quarryId + productId)
    const releaseLock = await db.acquireStockAdvisoryLock(ctx.tenantId, quarry.id, product.id);

    try {
      // Execute within atomic database transaction boundary
      return await db.executeTransaction(async (tx) => {
        if (tx.isPostgres && tx.acquireAdvisoryLock) {
          await tx.acquireAdvisoryLock(`stock_lock:${ctx.tenantId}:${quarry.id}:${product.id}`);
        }
        // 6. Idempotency Check: Prevent duplicate STOCK_IN if production record already recorded
        const existingProd = await this.repo.getProductionById(ctx.tenantId, productionId);
        if (existingProd) {
          const existingStock = await this.repo.findStockEntryByReference(
            ctx.tenantId,
            quarry.id,
            product.id,
            'PRODUCTION',
            existingProd.id,
            'STOCK_IN'
          );
          if (existingStock) {
            const balance = await this.repo.calculateBalance(ctx.tenantId, quarry.id, product.id);
            return { production: existingProd, stockLedgerEntry: existingStock, newBalance: balance };
          }
        }

        // 7. Create Production Record
        const production: QuarryProduction = {
          id: productionId,
          tenantId: ctx.tenantId,
          quarryId: quarry.id,
          productId: product.id,
          productionType: resolvedProductionType,
          productionDate,
          shift: dto.shift || 'DAY',
          quantity: Number(dto.quantity),
          unit: product.unit,
          operatorId: dto.operatorId || ctx.userId,
          machineId: dto.machineId,
          remarks: dto.remarks,
          createdAt: now,
          updatedAt: now,
          createdBy: ctx.userId
        };

        // 8. Create Atomic STOCK_IN Transaction
        const prevBalance = await this.repo.calculateBalance(ctx.tenantId, quarry.id, product.id);
        const newBalance = prevBalance + Number(dto.quantity);

        const stockLedgerEntry: QuarryStock = {
          id: generateUuidV7(),
          tenantId: ctx.tenantId,
          quarryId: quarry.id,
          productId: product.id,
          transactionType: 'STOCK_IN',
          referenceType: 'PRODUCTION',
          referenceId: production.id,
          quantityIn: Number(dto.quantity),
          quantityOut: 0,
          balanceQuantity: newBalance,
          transactionDate: productionDate,
          createdBy: ctx.userId,
          createdAt: now
        };

        // Atomically persist both
        db.quarryProductions.set(production.id, production);
        db.quarryStocks.set(stockLedgerEntry.id, stockLedgerEntry);

        // 9. Audit
        await this.auditRepo.log({
          tenantId: ctx.tenantId,
          actorUserId: ctx.userId,
          actorEmail: ctx.userEmail || 'system@minetrix.local',
          action: 'QUARRY_PRODUCTION_RECORD',
          module: 'Quarry Management',
          resource: 'QuarryProduction',
          resourceId: production.id,
          ipAddress: ctx.ipAddress || '127.0.0.1',
          correlationId: ctx.correlationId || `corr-prod-${production.id}`,
          beforeStateJson: JSON.stringify({ previousBalance: prevBalance }),
          afterStateJson: JSON.stringify({
            productionId: production.id,
            stockLedgerId: stockLedgerEntry.id,
            quarryId: quarry.id,
            productId: product.id,
            quantity: dto.quantity,
            unit: product.unit,
            newBalance
          }),
          status: 'SUCCESS'
        });

        return { production, stockLedgerEntry, newBalance };
      }, ctx.tenantId);
    } catch (err: any) {
      if (err.code === '23505') {
        throw new QuarryDomainError('DUPLICATE_STOCK_TRANSACTION', 'A stock ledger entry for this production reference already exists.');
      }
      throw err;
    } finally {
      releaseLock();
    }
  }

  public async getProduction(id: string, ctx: SecurityContext): Promise<QuarryProduction> {
    if (!ctx.tenantId) throw new QuarryDomainError('TENANT_ACCESS_DENIED', 'Tenant ID is required.');
    const prod = await this.repo.getProductionById(ctx.tenantId, id);
    if (!prod) throw new QuarryDomainError('PRODUCTION_NOT_FOUND', `Production record '${id}' not found.`);
    return prod;
  }

  public async listProduction(ctx: SecurityContext, quarryId?: string): Promise<QuarryProduction[]> {
    if (!ctx.tenantId) throw new QuarryDomainError('TENANT_ACCESS_DENIED', 'Tenant ID is required.');
    return this.repo.getProductions(ctx.tenantId, quarryId);
  }
}

// ============================================================================
// STOCK SERVICE
// ============================================================================

export class StockService {
  private repo: QuarryRepository;
  private auditRepo: AuditRepository;

  constructor() {
    this.repo = new QuarryRepository();
    this.auditRepo = new AuditRepository();
  }

  public async getStockBalance(quarryId: string, productId: string, ctx: SecurityContext): Promise<number> {
    if (!ctx.tenantId) throw new QuarryDomainError('TENANT_ACCESS_DENIED', 'Tenant ID is required.');
    
    // Verify quarry and product
    const quarry = await this.repo.getQuarryById(ctx.tenantId, quarryId);
    if (!quarry) throw new QuarryDomainError('QUARRY_NOT_FOUND', `Quarry '${quarryId}' not found.`);

    const product = await this.repo.getProductById(ctx.tenantId, productId);
    if (!product) throw new QuarryDomainError('PRODUCT_NOT_FOUND', `Product '${productId}' not found.`);

    return this.repo.calculateBalance(ctx.tenantId, quarryId, productId);
  }

  public async getStockLedger(quarryId: string, productId: string, ctx: SecurityContext): Promise<QuarryStock[]> {
    if (!ctx.tenantId) throw new QuarryDomainError('TENANT_ACCESS_DENIED', 'Tenant ID is required.');
    return this.repo.getStockLedger(ctx.tenantId, quarryId, productId);
  }

  public async recordStockAdjustment(dto: RecordStockAdjustmentDto, ctx: SecurityContext): Promise<QuarryStock> {
    if (!ctx.tenantId) throw new QuarryDomainError('TENANT_ACCESS_DENIED', 'Tenant ID is required.');
    if (!dto.reason || !dto.reason.trim()) {
      throw new QuarryDomainError('INVALID_STOCK_ADJUSTMENT', 'Stock adjustment requires a valid justification reason.');
    }
    if (!dto.quantity || dto.quantity <= 0) {
      throw new QuarryDomainError('INVALID_QUANTITY', 'Adjustment quantity must be greater than zero.');
    }

    const quarry = await this.repo.getQuarryById(ctx.tenantId, dto.quarryId);
    if (!quarry) throw new QuarryDomainError('QUARRY_NOT_FOUND', `Quarry '${dto.quarryId}' not found.`);

    const product = await this.repo.getProductById(ctx.tenantId, dto.productId);
    if (!product) throw new QuarryDomainError('PRODUCT_NOT_FOUND', `Product '${dto.productId}' not found.`);

    const currentBalance = await this.repo.calculateBalance(ctx.tenantId, dto.quarryId, dto.productId);

    if (dto.adjustmentType === 'ADJUSTMENT_OUT' && currentBalance < dto.quantity) {
      throw new QuarryDomainError(
        'INSUFFICIENT_STOCK',
        `Cannot adjust out ${dto.quantity} ${product.unit}. Available balance is only ${currentBalance} ${product.unit}.`
      );
    }

    const now = new Date().toISOString();
    const newBalance = dto.adjustmentType === 'ADJUSTMENT_IN'
      ? currentBalance + dto.quantity
      : currentBalance - dto.quantity;

    const adjustmentId = generateUuidV7();
    const entry: QuarryStock = {
      id: adjustmentId,
      tenantId: ctx.tenantId,
      quarryId: dto.quarryId,
      productId: dto.productId,
      transactionType: dto.adjustmentType,
      referenceType: 'STOCK_ADJUSTMENT',
      referenceId: adjustmentId,
      quantityIn: dto.adjustmentType === 'ADJUSTMENT_IN' ? dto.quantity : 0,
      quantityOut: dto.adjustmentType === 'ADJUSTMENT_OUT' ? dto.quantity : 0,
      balanceQuantity: newBalance,
      transactionDate: now.split('T')[0],
      createdBy: ctx.userId,
      createdAt: now
    };

    await this.repo.saveStock(entry);

    await this.auditRepo.log({
      tenantId: ctx.tenantId,
      actorUserId: ctx.userId,
      actorEmail: ctx.userEmail || 'system@minetrix.local',
      action: 'STOCK_ADJUSTMENT_RECORD',
      module: 'Quarry Management',
      resource: 'QuarryStock',
      resourceId: entry.id,
      ipAddress: ctx.ipAddress || '127.0.0.1',
      correlationId: ctx.correlationId || `corr-stk-${entry.id}`,
      beforeStateJson: JSON.stringify({ previousBalance: currentBalance, reason: dto.reason }),
      afterStateJson: JSON.stringify({
        stockId: entry.id,
        quarryId: dto.quarryId,
        productId: dto.productId,
        adjustmentType: dto.adjustmentType,
        quantity: dto.quantity,
        newBalance,
        reason: dto.reason
      }),
      status: 'SUCCESS'
    });

    return entry;
  }

  public async getQuarryStockSummary(quarryId: string, ctx: SecurityContext): Promise<Array<{
    productId: string;
    productCode: string;
    productName: string;
    unit: string;
    mineralType: string;
    balanceQuantity: number;
    status: string;
  }>> {
    if (!ctx.tenantId) throw new QuarryDomainError('TENANT_ACCESS_DENIED', 'Tenant ID is required.');
    const quarry = await this.repo.getQuarryById(ctx.tenantId, quarryId);
    if (!quarry) throw new QuarryDomainError('QUARRY_NOT_FOUND', `Quarry '${quarryId}' not found.`);

    const products = await this.repo.getProducts(ctx.tenantId, quarryId);
    const summaryList = [];

    for (const prod of products) {
      const balance = await this.repo.calculateBalance(ctx.tenantId, quarryId, prod.id);
      summaryList.push({
        productId: prod.id,
        productCode: prod.productCode,
        productName: prod.name,
        unit: prod.unit,
        mineralType: prod.mineralType,
        balanceQuantity: balance,
        status: prod.status
      });
    }

    return summaryList;
  }
}

// ============================================================================
// GATE PASS SERVICE
// ============================================================================

export class GatePassService {
  private repo: QuarryRepository;
  private auditRepo: AuditRepository;

  constructor() {
    this.repo = new QuarryRepository();
    this.auditRepo = new AuditRepository();
  }

  private async generateSequentialPassNumber(tenantId: string, quarryId: string): Promise<string> {
    const quarry = await this.repo.getQuarryById(tenantId, quarryId);
    const code = quarry ? quarry.name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase() : 'QRY';
    const year = new Date().getFullYear();
    const count = await this.repo.countGatePasses(tenantId, quarryId);
    const seq = String(count + 1).padStart(5, '0');
    return `GP-${code}-${year}-${seq}`;
  }

  public async createGatePass(dto: CreateGatePassDto, ctx: SecurityContext): Promise<GatePass> {
    if (!ctx.tenantId) throw new QuarryDomainError('TENANT_ACCESS_DENIED', 'Tenant ID is required.');

    // 1. Validate Quarry
    const quarry = await this.repo.getQuarryById(ctx.tenantId, dto.quarryId);
    if (!quarry) throw new QuarryDomainError('QUARRY_NOT_FOUND', `Quarry '${dto.quarryId}' not found.`);

    // 2. Validate Customer
    const customer = db.crmCustomers.get(dto.customerId) || db.customerInvoices.get(dto.customerId);
    if (!dto.customerId) throw new QuarryDomainError('INVALID_CUSTOMER', 'Customer ID is required.');

    // 3. Validate Product
    const product = await this.repo.getProductById(ctx.tenantId, dto.productId);
    if (!product) throw new QuarryDomainError('PRODUCT_NOT_FOUND', `Product '${dto.productId}' not found.`);

    // 4. Validate Quantity
    if (!dto.quantity || dto.quantity <= 0) {
      throw new QuarryDomainError('INVALID_QUANTITY', 'Gate pass quantity must be greater than zero.');
    }

    // 5. Weight calculation and validation
    let netWeight: number | undefined = undefined;
    if (dto.grossWeight !== undefined && dto.tareWeight !== undefined) {
      if (dto.grossWeight < dto.tareWeight) {
        throw new QuarryDomainError('INVALID_WEIGHT', `Gross weight (${dto.grossWeight}) cannot be less than tare weight (${dto.tareWeight}).`);
      }
      netWeight = dto.grossWeight - dto.tareWeight;
    }

    // 6. Validate Available Stock
    const availableStock = await this.repo.calculateBalance(ctx.tenantId, dto.quarryId, dto.productId);
    if (availableStock < dto.quantity) {
      throw new QuarryDomainError(
        'INSUFFICIENT_STOCK',
        `Insufficient stock for product '${product.name}'. Available: ${availableStock} ${product.unit}, requested: ${dto.quantity} ${product.unit}.`
      );
    }

    // 7. Validate Vehicle Reference from Fleet if vehicleId provided
    if (dto.vehicleId) {
      const vehicle = db.fleetVehicles.get(dto.vehicleId);
      if (vehicle && vehicle.tenantId !== ctx.tenantId) {
        throw new QuarryDomainError('INVALID_VEHICLE', `Vehicle '${dto.vehicleId}' does not belong to this tenant.`);
      }
    }

    // 8. Validate Driver Reference if driverId provided
    if (dto.driverId) {
      const driver = db.fleetDrivers.get(dto.driverId) || db.hrEmployees.get(dto.driverId);
      if (driver && driver.tenantId !== ctx.tenantId) {
        throw new QuarryDomainError('INVALID_DRIVER', `Driver '${dto.driverId}' does not belong to this tenant.`);
      }
    }

    const passNumber = await this.generateSequentialPassNumber(ctx.tenantId, dto.quarryId);
    const now = new Date().toISOString();

    const gatePass: GatePass = {
      id: dto.id || generateUuidV7(),
      tenantId: ctx.tenantId,
      quarryId: dto.quarryId,
      passNumber,
      customerId: dto.customerId,
      productId: dto.productId,
      quantity: Number(dto.quantity),
      unit: dto.unit || product.unit,
      vehicleId: dto.vehicleId,
      vehicleNo: dto.vehicleNo,
      driverId: dto.driverId,
      driverName: dto.driverName,
      grossWeight: dto.grossWeight,
      tareWeight: dto.tareWeight,
      netWeight,
      status: 'ISSUED',
      salesReference: dto.salesReference,
      createdBy: ctx.userId,
      createdAt: now,
      updatedAt: now
    };

    await this.repo.saveGatePass(gatePass);

    await this.auditRepo.log({
      tenantId: ctx.tenantId,
      actorUserId: ctx.userId,
      actorEmail: ctx.userEmail || 'system@minetrix.local',
      action: 'GATE_PASS_CREATE',
      module: 'Quarry Management',
      resource: 'GatePass',
      resourceId: gatePass.id,
      ipAddress: ctx.ipAddress || '127.0.0.1',
      correlationId: ctx.correlationId || `corr-gp-${gatePass.id}`,
      afterStateJson: JSON.stringify(gatePass),
      status: 'SUCCESS'
    });

    return gatePass;
  }

  public async getGatePass(id: string, ctx: SecurityContext): Promise<GatePass> {
    if (!ctx.tenantId) throw new QuarryDomainError('TENANT_ACCESS_DENIED', 'Tenant ID is required.');
    const gp = await this.repo.getGatePassById(ctx.tenantId, id);
    if (!gp) throw new QuarryDomainError('GATE_PASS_NOT_FOUND', `Gate pass '${id}' not found.`);
    return gp;
  }

  public async listGatePasses(ctx: SecurityContext, quarryId?: string): Promise<GatePass[]> {
    if (!ctx.tenantId) throw new QuarryDomainError('TENANT_ACCESS_DENIED', 'Tenant ID is required.');
    return this.repo.getGatePasses(ctx.tenantId, quarryId);
  }

  public async verifyGatePass(id: string, ctx: SecurityContext): Promise<GatePass> {
    const gp = await this.getGatePass(id, ctx);
    if (gp.status !== 'ISSUED') {
      throw new QuarryDomainError('INVALID_GATE_PASS_STATE', `Gate pass '${gp.passNumber}' cannot be verified in current status '${gp.status}'. Must be ISSUED.`);
    }

    const beforeState = JSON.stringify(gp);
    gp.status = 'VERIFIED';
    gp.approvedBy = ctx.userId;
    gp.updatedAt = new Date().toISOString();

    await this.repo.saveGatePass(gp);

    await this.auditRepo.log({
      tenantId: ctx.tenantId,
      actorUserId: ctx.userId,
      actorEmail: ctx.userEmail || 'system@minetrix.local',
      action: 'GATE_PASS_VERIFY',
      module: 'Quarry Management',
      resource: 'GatePass',
      resourceId: gp.id,
      ipAddress: ctx.ipAddress || '127.0.0.1',
      correlationId: ctx.correlationId || `corr-gp-${gp.id}`,
      beforeStateJson: beforeState,
      afterStateJson: JSON.stringify(gp),
      status: 'SUCCESS'
    });

    return gp;
  }

  /**
   * Dispatch Gate Pass:
   * 1. Validates status is VERIFIED or ISSUED
   * 2. Prevents duplicate dispatch / duplicate STOCK_OUT
   * 3. Validates stock availability
   * 4. Deducts stock via atomic STOCK_OUT entry
   * 5. Marks GatePass as DISPATCHED
   * 6. Triggers Shared Finance integration hook
   * 7. Logs audit trail
   */
  public async dispatchGatePass(id: string, ctx: SecurityContext): Promise<{ gatePass: GatePass; stockLedgerEntry: QuarryStock; remainingStock: number }> {
    const gp = await this.getGatePass(id, ctx);

    // Concurrency Protection: Acquire stock advisory lock on composite key (tenantId + quarryId + productId)
    const releaseLock = await db.acquireStockAdvisoryLock(ctx.tenantId, gp.quarryId, gp.productId);

    try {
      // Execute within atomic database transaction boundary
      return await db.executeTransaction(async (tx) => {
        if (tx.isPostgres && tx.acquireAdvisoryLock) {
          await tx.acquireAdvisoryLock(`stock_lock:${ctx.tenantId}:${gp.quarryId}:${gp.productId}`);
        }
        // Re-read current gate pass within transaction boundary
        const currentGp = db.gatePasses.get(id);
        if (!currentGp || currentGp.tenantId !== ctx.tenantId) {
          throw new QuarryDomainError('GATE_PASS_NOT_FOUND', `Gate pass '${id}' not found.`);
        }

        if (currentGp.status === 'DISPATCHED') {
          throw new QuarryDomainError('GATE_PASS_ALREADY_DISPATCHED', `Gate pass '${currentGp.passNumber}' has already been dispatched.`);
        }

        if (currentGp.status === 'CANCELLED') {
          throw new QuarryDomainError('INVALID_GATE_PASS_STATE', `Cannot dispatch cancelled gate pass '${currentGp.passNumber}'.`);
        }

        // Check duplicate stock deduction idempotency
        const existingStockOut = await this.repo.findStockEntryByReference(
          ctx.tenantId,
          currentGp.quarryId,
          currentGp.productId,
          'GATE_PASS',
          currentGp.id,
          'STOCK_OUT'
        );
        if (existingStockOut) {
          throw new QuarryDomainError('DUPLICATE_STOCK_DEDUCTION', `Stock deduction already exists for gate pass '${currentGp.passNumber}'.`);
        }

        // Check live stock with lock held
        const currentStock = await this.repo.calculateBalance(ctx.tenantId, currentGp.quarryId, currentGp.productId);
        if (currentStock < currentGp.quantity) {
          throw new QuarryDomainError(
            'INSUFFICIENT_STOCK',
            `Cannot dispatch gate pass. Available stock: ${currentStock} ${currentGp.unit}, required: ${currentGp.quantity} ${currentGp.unit}.`
          );
        }

        const now = new Date().toISOString();
        const remainingStock = currentStock - currentGp.quantity;

        // Create atomic STOCK_OUT ledger entry
        const stockOutEntry: QuarryStock = {
          id: generateUuidV7(),
          tenantId: ctx.tenantId,
          quarryId: currentGp.quarryId,
          productId: currentGp.productId,
          transactionType: 'STOCK_OUT',
          referenceType: 'GATE_PASS',
          referenceId: currentGp.id,
          quantityIn: 0,
          quantityOut: currentGp.quantity,
          balanceQuantity: remainingStock,
          transactionDate: now.split('T')[0],
          createdBy: ctx.userId,
          createdAt: now
        };

        const beforeState = JSON.stringify(currentGp);
        currentGp.status = 'DISPATCHED';
        currentGp.updatedAt = now;

        // Save both atomically inside transaction
        db.gatePasses.set(currentGp.id, currentGp);
        db.quarryStocks.set(stockOutEntry.id, stockOutEntry);

        // Clean hook for Shared Finance integration point
        this.onGatePassDispatched(currentGp, ctx);

        // Audit log
        await this.auditRepo.log({
          tenantId: ctx.tenantId,
          actorUserId: ctx.userId,
          actorEmail: ctx.userEmail || 'system@minetrix.local',
          action: 'GATE_PASS_DISPATCH',
          module: 'Quarry Management',
          resource: 'GatePass',
          resourceId: currentGp.id,
          ipAddress: ctx.ipAddress || '127.0.0.1',
          correlationId: ctx.correlationId || `corr-gp-${currentGp.id}`,
          beforeStateJson: beforeState,
          afterStateJson: JSON.stringify({
            gatePassId: currentGp.id,
            stockOutEntryId: stockOutEntry.id,
            quantityDeducted: currentGp.quantity,
            remainingStock
          }),
          status: 'SUCCESS'
        });

        return { gatePass: currentGp, stockLedgerEntry: stockOutEntry, remainingStock };
      }, ctx.tenantId);
    } catch (err: any) {
      if (err.code === '23505') {
        throw new QuarryDomainError('DUPLICATE_STOCK_DEDUCTION', 'A stock ledger deduction for this gate pass reference already exists.');
      }
      throw err;
    } finally {
      releaseLock();
    }
  }

  public async cancelGatePass(id: string, reason: string, ctx: SecurityContext): Promise<GatePass> {
    const gp = await this.getGatePass(id, ctx);

    if (gp.status === 'DISPATCHED') {
      throw new QuarryDomainError('INVALID_GATE_PASS_STATE', `Dispatched gate pass '${gp.passNumber}' cannot be cancelled as stock has already been dispatched.`);
    }

    if (gp.status === 'CANCELLED') {
      return gp;
    }

    const beforeState = JSON.stringify(gp);
    gp.status = 'CANCELLED';
    gp.updatedAt = new Date().toISOString();

    await this.repo.saveGatePass(gp);

    await this.auditRepo.log({
      tenantId: ctx.tenantId,
      actorUserId: ctx.userId,
      actorEmail: ctx.userEmail || 'system@minetrix.local',
      action: 'GATE_PASS_CANCEL',
      module: 'Quarry Management',
      resource: 'GatePass',
      resourceId: gp.id,
      ipAddress: ctx.ipAddress || '127.0.0.1',
      correlationId: ctx.correlationId || `corr-gp-${gp.id}`,
      beforeStateJson: beforeState,
      afterStateJson: JSON.stringify({ gatePass: gp, cancelReason: reason }),
      status: 'SUCCESS'
    });

    return gp;
  }

  /**
   * Integration point / event hook for Shared Finance (Customer Invoice generation)
   */
  private onGatePassDispatched(gp: GatePass, ctx: SecurityContext) {
    // Shared Finance Integration Hook
    // Ready for downstream asynchronous or synchronous CustomerInvoice creation
  }
}

// ============================================================================
// LAND LEASE SERVICE
// ============================================================================

export class LandLeaseService {
  private repo: QuarryRepository;
  private auditRepo: AuditRepository;

  constructor() {
    this.repo = new QuarryRepository();
    this.auditRepo = new AuditRepository();
  }

  public async createLease(dto: CreateLandLeaseDto, ctx: SecurityContext): Promise<QuarryLandLease> {
    if (!ctx.tenantId) throw new QuarryDomainError('TENANT_ACCESS_DENIED', 'Tenant ID is required.');
    if (!dto.ownerName || !dto.ownerName.trim()) throw new QuarryDomainError('INVALID_LEASE', 'Landowner name is required.');
    if (!dto.surveyNumber || !dto.surveyNumber.trim()) throw new QuarryDomainError('INVALID_LEASE', 'Survey number is required.');
    if (dto.area <= 0) throw new QuarryDomainError('INVALID_LEASE', 'Lease area in acres must be greater than zero.');
    if (dto.royaltyRate < 0) throw new QuarryDomainError('INVALID_LEASE', 'Royalty rate cannot be negative.');

    // Validate Quarry
    const quarry = await this.repo.getQuarryById(ctx.tenantId, dto.quarryId);
    if (!quarry) throw new QuarryDomainError('QUARRY_NOT_FOUND', `Quarry '${dto.quarryId}' not found.`);

    // Validate Dates
    if (new Date(dto.expiryDate).getTime() < new Date(dto.startDate).getTime()) {
      throw new QuarryDomainError('INVALID_LEASE_DATES', 'Lease expiry date cannot be earlier than start date.');
    }

    const now = new Date().toISOString();
    const lease: QuarryLandLease = {
      id: generateUuidV7(),
      tenantId: ctx.tenantId,
      quarryId: dto.quarryId,
      ownerId: dto.ownerId,
      ownerName: dto.ownerName.trim(),
      surveyNumber: dto.surveyNumber.trim(),
      village: dto.village.trim(),
      taluk: dto.taluk.trim(),
      area: dto.area,
      leaseType: dto.leaseType,
      royaltyType: dto.royaltyType,
      royaltyRate: dto.royaltyRate,
      startDate: dto.startDate,
      expiryDate: dto.expiryDate,
      status: 'ACTIVE',
      documentReference: dto.documentReference,
      createdAt: now,
      updatedAt: now
    };

    await this.repo.saveLandLease(lease);

    await this.auditRepo.log({
      tenantId: ctx.tenantId,
      actorUserId: ctx.userId,
      actorEmail: ctx.userEmail || 'system@minetrix.local',
      action: 'LAND_LEASE_CREATE',
      module: 'Quarry Management',
      resource: 'QuarryLandLease',
      resourceId: lease.id,
      ipAddress: ctx.ipAddress || '127.0.0.1',
      correlationId: ctx.correlationId || `corr-lease-${lease.id}`,
      afterStateJson: JSON.stringify(lease),
      status: 'SUCCESS'
    });

    return lease;
  }

  public async getLease(id: string, ctx: SecurityContext): Promise<QuarryLandLease> {
    if (!ctx.tenantId) throw new QuarryDomainError('TENANT_ACCESS_DENIED', 'Tenant ID is required.');
    const lease = await this.repo.getLandLeaseById(ctx.tenantId, id);
    if (!lease) throw new QuarryDomainError('LEASE_NOT_FOUND', `Land lease '${id}' not found.`);
    return lease;
  }

  public async listLeases(ctx: SecurityContext, quarryId?: string): Promise<QuarryLandLease[]> {
    if (!ctx.tenantId) throw new QuarryDomainError('TENANT_ACCESS_DENIED', 'Tenant ID is required.');
    return this.repo.getLandLeases(ctx.tenantId, quarryId);
  }

  public async updateLease(id: string, dto: UpdateLandLeaseDto, ctx: SecurityContext): Promise<QuarryLandLease> {
    const lease = await this.getLease(id, ctx);
    const beforeState = JSON.stringify(lease);

    if (dto.ownerName !== undefined) lease.ownerName = dto.ownerName.trim();
    if (dto.area !== undefined) {
      if (dto.area <= 0) throw new QuarryDomainError('INVALID_LEASE', 'Area must be greater than zero.');
      lease.area = dto.area;
    }
    if (dto.royaltyType !== undefined) lease.royaltyType = dto.royaltyType;
    if (dto.royaltyRate !== undefined) {
      if (dto.royaltyRate < 0) throw new QuarryDomainError('INVALID_LEASE', 'Royalty rate cannot be negative.');
      lease.royaltyRate = dto.royaltyRate;
    }
    if (dto.expiryDate !== undefined) lease.expiryDate = dto.expiryDate;
    if (dto.status !== undefined) lease.status = dto.status;
    if (dto.documentReference !== undefined) lease.documentReference = dto.documentReference;

    lease.updatedAt = new Date().toISOString();

    await this.repo.saveLandLease(lease);

    await this.auditRepo.log({
      tenantId: ctx.tenantId,
      actorUserId: ctx.userId,
      actorEmail: ctx.userEmail || 'system@minetrix.local',
      action: 'LAND_LEASE_UPDATE',
      module: 'Quarry Management',
      resource: 'QuarryLandLease',
      resourceId: lease.id,
      ipAddress: ctx.ipAddress || '127.0.0.1',
      correlationId: ctx.correlationId || `corr-lease-${lease.id}`,
      beforeStateJson: beforeState,
      afterStateJson: JSON.stringify(lease),
      status: 'SUCCESS'
    });

    return lease;
  }

  public async deactivateLease(id: string, ctx: SecurityContext): Promise<QuarryLandLease> {
    const lease = await this.getLease(id, ctx);
    const beforeState = JSON.stringify(lease);

    lease.status = 'TERMINATED';
    lease.updatedAt = new Date().toISOString();

    await this.repo.saveLandLease(lease);

    await this.auditRepo.log({
      tenantId: ctx.tenantId,
      actorUserId: ctx.userId,
      actorEmail: ctx.userEmail || 'system@minetrix.local',
      action: 'LAND_LEASE_TERMINATE',
      module: 'Quarry Management',
      resource: 'QuarryLandLease',
      resourceId: lease.id,
      ipAddress: ctx.ipAddress || '127.0.0.1',
      correlationId: ctx.correlationId || `corr-lease-${lease.id}`,
      beforeStateJson: beforeState,
      afterStateJson: JSON.stringify(lease),
      status: 'SUCCESS'
    });

    return lease;
  }
}

// ============================================================================
// LANDOWNER SETTLEMENT SERVICE
// ============================================================================

export class LandownerSettlementService {
  private repo: QuarryRepository;
  private auditRepo: AuditRepository;

  constructor() {
    this.repo = new QuarryRepository();
    this.auditRepo = new AuditRepository();
  }

  public calculateSettlement(lease: QuarryLandLease, basisQuantity: number, periodStart: string, periodEnd: string): SettlementCalculationResult {
    let calculatedAmount = 0;

    switch (lease.royaltyType) {
      case 'FIXED_MONTHLY':
        calculatedAmount = lease.royaltyRate;
        break;
      case 'PER_TON':
      case 'PER_PIECE':
        calculatedAmount = basisQuantity * lease.royaltyRate;
        break;
      case 'REVENUE_PERCENT':
        // basisQuantity is the gross sales revenue
        calculatedAmount = (basisQuantity * lease.royaltyRate) / 100;
        break;
      default:
        calculatedAmount = basisQuantity * lease.royaltyRate;
    }

    return {
      leaseId: lease.id,
      leaseOwner: lease.ownerName,
      royaltyType: lease.royaltyType,
      royaltyRate: lease.royaltyRate,
      basisQuantity,
      periodStart,
      periodEnd,
      calculatedAmount: Math.round((calculatedAmount + Number.EPSILON) * 100) / 100
    };
  }

  public async createSettlement(dto: CreateSettlementDto, ctx: SecurityContext): Promise<LandownerSettlement> {
    if (!ctx.tenantId) throw new QuarryDomainError('TENANT_ACCESS_DENIED', 'Tenant ID is required.');
    if (dto.basisQuantity < 0) throw new QuarryDomainError('INVALID_SETTLEMENT', 'Basis quantity cannot be negative.');

    const lease = await this.repo.getLandLeaseById(ctx.tenantId, dto.leaseId);
    if (!lease) throw new QuarryDomainError('LEASE_NOT_FOUND', `Land lease '${dto.leaseId}' not found.`);

    const calculation = this.calculateSettlement(lease, dto.basisQuantity, dto.periodStart, dto.periodEnd);
    const now = new Date().toISOString();

    const settlement: LandownerSettlement = {
      id: generateUuidV7(),
      tenantId: ctx.tenantId,
      leaseId: lease.id,
      periodStart: dto.periodStart,
      periodEnd: dto.periodEnd,
      basisQuantity: dto.basisQuantity,
      calculatedAmount: calculation.calculatedAmount,
      status: 'DRAFT',
      createdAt: now,
      updatedAt: now
    };

    await this.repo.saveSettlement(settlement);

    await this.auditRepo.log({
      tenantId: ctx.tenantId,
      actorUserId: ctx.userId,
      actorEmail: ctx.userEmail || 'system@minetrix.local',
      action: 'LANDOWNER_SETTLEMENT_CREATE',
      module: 'Quarry Management',
      resource: 'LandownerSettlement',
      resourceId: settlement.id,
      ipAddress: ctx.ipAddress || '127.0.0.1',
      correlationId: ctx.correlationId || `corr-settle-${settlement.id}`,
      afterStateJson: JSON.stringify(settlement),
      status: 'SUCCESS'
    });

    return settlement;
  }

  public async approveSettlement(id: string, ctx: SecurityContext): Promise<LandownerSettlement> {
    if (!ctx.tenantId) throw new QuarryDomainError('TENANT_ACCESS_DENIED', 'Tenant ID is required.');
    const settlement = await this.repo.getSettlementById(ctx.tenantId, id);
    if (!settlement) throw new QuarryDomainError('SETTLEMENT_NOT_FOUND', `Settlement '${id}' not found.`);

    if (settlement.status !== 'DRAFT') {
      throw new QuarryDomainError('INVALID_SETTLEMENT_STATE', `Settlement '${id}' is already in status '${settlement.status}'.`);
    }

    const beforeState = JSON.stringify(settlement);
    settlement.status = 'APPROVED';
    // Prepare integration-ready finance bill reference placeholder
    settlement.financeBillId = `BILL-ROYALTY-${settlement.id.slice(0, 8).toUpperCase()}`;
    settlement.updatedAt = new Date().toISOString();

    await this.repo.saveSettlement(settlement);

    await this.auditRepo.log({
      tenantId: ctx.tenantId,
      actorUserId: ctx.userId,
      actorEmail: ctx.userEmail || 'system@minetrix.local',
      action: 'LANDOWNER_SETTLEMENT_APPROVE',
      module: 'Quarry Management',
      resource: 'LandownerSettlement',
      resourceId: settlement.id,
      ipAddress: ctx.ipAddress || '127.0.0.1',
      correlationId: ctx.correlationId || `corr-settle-${settlement.id}`,
      beforeStateJson: beforeState,
      afterStateJson: JSON.stringify(settlement),
      status: 'SUCCESS'
    });

    return settlement;
  }

  public async getSettlement(id: string, ctx: SecurityContext): Promise<LandownerSettlement> {
    if (!ctx.tenantId) throw new QuarryDomainError('TENANT_ACCESS_DENIED', 'Tenant ID is required.');
    const settlement = await this.repo.getSettlementById(ctx.tenantId, id);
    if (!settlement) throw new QuarryDomainError('SETTLEMENT_NOT_FOUND', `Settlement '${id}' not found.`);
    return settlement;
  }

  public async listSettlements(ctx: SecurityContext, leaseId?: string, quarryId?: string): Promise<LandownerSettlement[]> {
    if (!ctx.tenantId) throw new QuarryDomainError('TENANT_ACCESS_DENIED', 'Tenant ID is required.');
    let settlements = await this.repo.getSettlements(ctx.tenantId, leaseId);

    if (quarryId) {
      const leases = await this.repo.getLandLeases(ctx.tenantId, quarryId);
      const leaseIdSet = new Set(leases.map(l => l.id));
      settlements = settlements.filter(s => leaseIdSet.has(s.leaseId));
    }

    return settlements;
  }
}

// Export a unified facade
export const quarryMasterService = new QuarryMasterService();
export const stoneProductService = new StoneProductService();
export const productionService = new ProductionService();
export const stockService = new StockService();
export const gatePassService = new GatePassService();
export const landLeaseService = new LandLeaseService();
export const landownerSettlementService = new LandownerSettlementService();
