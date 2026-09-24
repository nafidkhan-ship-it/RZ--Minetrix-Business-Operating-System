/**
 * RZ® MINETRIX BOS — Quarry Management API Router & RBAC (Platform 1)
 * Clean HTTP API layer connecting HTTP endpoints directly to Quarry Services.
 */

import { Router, Response } from 'express';
import {
  authenticateJwt,
  enforceTenantContext,
  requirePermission,
  CustomRequest
} from '../middleware/authMiddleware.js';
import {
  QuarryMasterService,
  StoneProductService,
  ProductionService,
  StockService,
  GatePassService,
  LandLeaseService,
  LandownerSettlementService,
  QuarryDomainError,
  SecurityContext
} from '../services/quarryServices.js';

export const quarryRouter = Router();

const quarryMasterService = new QuarryMasterService();
const stoneProductService = new StoneProductService();
const productionService = new ProductionService();
const stockService = new StockService();
const gatePassService = new GatePassService();
const landLeaseService = new LandLeaseService();
const landownerSettlementService = new LandownerSettlementService();

// Apply Authentication and Tenant Isolation to all Quarry API endpoints
quarryRouter.use(authenticateJwt);
quarryRouter.use(enforceTenantContext);

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function getSecurityContext(req: CustomRequest): SecurityContext {
  if (!req.user || !req.user.tenantId) {
    throw new QuarryDomainError('UNAUTHORIZED', 'Authentication context missing or invalid.');
  }
  return {
    tenantId: req.user.tenantId,
    userId: req.user.userId,
    userEmail: req.user.email,
    ipAddress: req.ip || '127.0.0.1',
    correlationId: req.correlationId || (req.headers['x-correlation-id'] as string)
  };
}

function paginate<T>(items: T[], page = 1, pageSize = 20) {
  const p = Math.max(1, Number(page) || 1);
  const ps = Math.min(100, Math.max(1, Number(pageSize) || 20));
  const total = items.length;
  const totalPages = Math.ceil(total / ps);
  const start = (p - 1) * ps;
  const data = items.slice(start, start + ps);
  return {
    data,
    pagination: {
      page: p,
      pageSize: ps,
      total,
      totalPages
    }
  };
}

function handleQuarryError(err: any, res: Response) {
  if (err instanceof QuarryDomainError) {
    switch (err.code) {
      case 'QUARRY_NOT_FOUND':
      case 'PRODUCT_NOT_FOUND':
      case 'PRODUCTION_NOT_FOUND':
      case 'GATE_PASS_NOT_FOUND':
      case 'LEASE_NOT_FOUND':
      case 'LAND_LEASE_NOT_FOUND':
      case 'SETTLEMENT_NOT_FOUND':
      case 'CUSTOMER_NOT_FOUND':
      case 'EMPLOYEE_NOT_FOUND':
        return res.status(404).json({
          success: false,
          error: err.code,
          message: err.message,
          details: err.details
        });

      case 'TENANT_ACCESS_DENIED':
      case 'CROSS_TENANT_VIOLATION':
      case 'UNAUTHORIZED_QUARRY_ACCESS':
      case 'FORBIDDEN_CROSS_TENANT_ACCESS':
      case 'CROSS_QUARRY_RESOURCE_MISMATCH':
      case 'FORBIDDEN_RESOURCE_MISMATCH':
        return res.status(403).json({
          success: false,
          error: err.code,
          message: err.message,
          details: err.details
        });

      case 'DUPLICATE_QUARRY':
      case 'DUPLICATE_PRODUCT':
      case 'DUPLICATE_PRODUCT_CODE':
      case 'DUPLICATE_GATE_PASS_NUMBER':
      case 'GATE_PASS_ALREADY_DISPATCHED':
      case 'DUPLICATE_STOCK_DEDUCTION':
      case 'SETTLEMENT_ALREADY_APPROVED':
        return res.status(409).json({
          success: false,
          error: err.code,
          message: err.message,
          details: err.details
        });

      case 'INSUFFICIENT_STOCK':
      case 'MINERAL_TYPE_MISMATCH':
      case 'INVALID_GATE_PASS_STATE':
      case 'INVALID_SETTLEMENT_STATE':
      case 'SETTLEMENT_CALCULATION_ERROR':
      case 'INVALID_QUARRY_TYPE':
      case 'INVALID_LEASE_DATES':
      case 'INVALID_WEIGHT':
      case 'TARE_EXCEEDS_GROSS':
        return res.status(422).json({
          success: false,
          error: err.code,
          message: err.message,
          details: err.details
        });

      case 'INVALID_COMPANY':
      case 'INVALID_BRANCH':
      case 'INVALID_PRODUCT':
      case 'INVALID_OPERATOR':
      case 'INVALID_MACHINE':
      case 'INVALID_VEHICLE':
      case 'INVALID_DRIVER':
      case 'INVALID_CUSTOMER':
      case 'INVALID_QUANTITY':
      case 'INVALID_LEASE':
      case 'INVALID_SETTLEMENT':
      case 'INVALID_STOCK_ADJUSTMENT':
      case 'MISSING_REQUIRED_FIELDS':
      case 'INVALID_INPUT':
      default:
        return res.status(400).json({
          success: false,
          error: err.code,
          message: err.message,
          details: err.details
        });
    }
  }

  // Generic unhandled exception
  return res.status(500).json({
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message: err?.message || 'An unexpected internal server error occurred.'
  });
}

// =========================================================================
// 1. QUARRY MASTER ENDPOINTS (/api/quarries)
// =========================================================================

/**
 * GET /api/quarries - List quarries for authenticated tenant
 */
quarryRouter.get('/', requirePermission('QUARRY_VIEW'), async (req: CustomRequest, res: Response) => {
  try {
    const ctx = getSecurityContext(req);
    let list = await quarryMasterService.listQuarries(ctx);

    const { search, quarryType, status, companyId, page, pageSize } = req.query;

    if (quarryType) {
      list = list.filter(q => q.quarryType === quarryType);
    }
    if (status) {
      list = list.filter(q => q.status === status);
    }
    if (companyId) {
      list = list.filter(q => q.companyId === companyId);
    }
    if (search && typeof search === 'string') {
      const qLower = search.toLowerCase();
      list = list.filter(q =>
        q.name.toLowerCase().includes(qLower) ||
        q.location.toLowerCase().includes(qLower) ||
        (q.leaseReference && q.leaseReference.toLowerCase().includes(qLower))
      );
    }

    const result = paginate(list, Number(page), Number(pageSize));
    return res.json({ success: true, ...result });
  } catch (err: any) {
    return handleQuarryError(err, res);
  }
});

/**
 * POST /api/quarries - Create new quarry
 */
quarryRouter.post('/', requirePermission('QUARRY_CREATE'), async (req: CustomRequest, res: Response) => {
  try {
    const ctx = getSecurityContext(req);
    const { name, quarryType, companyId, branchId, location } = req.body || {};

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_INPUT',
        message: 'Quarry name is required and cannot be empty.'
      });
    }

    if (!quarryType || !['LATERITE', 'HARD_ROCK'].includes(quarryType)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_QUARRY_TYPE',
        message: "quarryType must be either 'LATERITE' or 'HARD_ROCK'."
      });
    }

    if (!companyId || !branchId || !location) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_REQUIRED_FIELDS',
        message: 'companyId, branchId, and location are required.'
      });
    }

    const quarry = await quarryMasterService.createQuarry(req.body, ctx);
    return res.status(201).json({ success: true, data: quarry });
  } catch (err: any) {
    return handleQuarryError(err, res);
  }
});

/**
 * GET /api/quarries/:quarryId - Get quarry details by ID
 */
quarryRouter.get('/:quarryId', requirePermission('QUARRY_VIEW'), async (req: CustomRequest, res: Response) => {
  try {
    const ctx = getSecurityContext(req);
    const quarry = await quarryMasterService.getQuarry(req.params.quarryId, ctx);
    return res.json({ success: true, data: quarry });
  } catch (err: any) {
    return handleQuarryError(err, res);
  }
});

/**
 * PUT /api/quarries/:quarryId - Update quarry metadata
 */
quarryRouter.put('/:quarryId', requirePermission('QUARRY_EDIT'), async (req: CustomRequest, res: Response) => {
  try {
    const ctx = getSecurityContext(req);
    const quarry = await quarryMasterService.updateQuarry(req.params.quarryId, req.body, ctx);
    return res.json({ success: true, data: quarry });
  } catch (err: any) {
    return handleQuarryError(err, res);
  }
});

/**
 * POST /api/quarries/:quarryId/deactivate - Deactivate quarry
 */
quarryRouter.post('/:quarryId/deactivate', requirePermission('QUARRY_DEACTIVATE'), async (req: CustomRequest, res: Response) => {
  try {
    const ctx = getSecurityContext(req);
    const quarry = await quarryMasterService.deactivateQuarry(req.params.quarryId, ctx);
    return res.json({ success: true, data: quarry });
  } catch (err: any) {
    return handleQuarryError(err, res);
  }
});

/**
 * DELETE /api/quarries/:quarryId - Soft delete / Deactivate quarry (Hard deletion strictly prevented)
 */
quarryRouter.delete('/:quarryId', requirePermission('QUARRY_DEACTIVATE'), async (req: CustomRequest, res: Response) => {
  try {
    const ctx = getSecurityContext(req);
    const quarry = await quarryMasterService.deactivateQuarry(req.params.quarryId, ctx);
    return res.json({
      success: true,
      data: quarry,
      message: 'Quarry deactivated successfully (hard deletion disabled).'
    });
  } catch (err: any) {
    return handleQuarryError(err, res);
  }
});

// =========================================================================
// 2. STONE PRODUCTS ENDPOINTS (/api/quarries/:quarryId/products)
// =========================================================================

/**
 * GET /api/quarries/:quarryId/products - List products for quarry
 */
quarryRouter.get('/:quarryId/products', requirePermission('PRODUCT_VIEW'), async (req: CustomRequest, res: Response) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId } = req.params;
    await quarryMasterService.getQuarry(quarryId, ctx);

    let products = await stoneProductService.listStoneProducts(ctx, quarryId);

    const { status, mineralType, search, page, pageSize } = req.query;
    if (status) {
      products = products.filter(p => p.status === status);
    }
    if (mineralType) {
      products = products.filter(p => p.mineralType === mineralType);
    }
    if (search && typeof search === 'string') {
      const qLower = search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(qLower) ||
        p.productCode.toLowerCase().includes(qLower)
      );
    }

    const result = paginate(products, Number(page), Number(pageSize));
    return res.json({ success: true, ...result });
  } catch (err: any) {
    return handleQuarryError(err, res);
  }
});

/**
 * POST /api/quarries/:quarryId/products - Create new stone product
 */
quarryRouter.post('/:quarryId/products', requirePermission('PRODUCT_CREATE'), async (req: CustomRequest, res: Response) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId } = req.params;
    const quarry = await quarryMasterService.getQuarry(quarryId, ctx);

    const { productCode, name, mineralType, unit, defaultPrice } = req.body || {};
    if (!productCode || !name) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_REQUIRED_FIELDS',
        message: 'productCode and name are required.'
      });
    }

    if (mineralType && mineralType !== quarry.quarryType) {
      return res.status(422).json({
        success: false,
        error: 'MINERAL_TYPE_MISMATCH',
        message: `Product mineralType [${mineralType}] must match quarry type [${quarry.quarryType}].`
      });
    }

    if (unit && !['TON', 'CFT', 'PIECE', 'LOAD'].includes(unit)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_INPUT',
        message: "unit must be 'TON', 'CFT', 'PIECE', or 'LOAD'."
      });
    }

    if (defaultPrice !== undefined && (typeof defaultPrice !== 'number' || defaultPrice < 0)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_INPUT',
        message: 'defaultPrice must be a non-negative number.'
      });
    }

    const product = await stoneProductService.createStoneProduct({
      ...req.body,
      quarryId
    }, ctx);

    return res.status(201).json({ success: true, data: product });
  } catch (err: any) {
    return handleQuarryError(err, res);
  }
});

/**
 * GET /api/quarries/:quarryId/products/:productId - Get stone product by ID
 */
quarryRouter.get('/:quarryId/products/:productId', requirePermission('PRODUCT_VIEW'), async (req: CustomRequest, res: Response) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId, productId } = req.params;
    await quarryMasterService.getQuarry(quarryId, ctx);

    const product = await stoneProductService.getStoneProduct(productId, ctx);
    if (product.quarryId !== quarryId) {
      throw new QuarryDomainError('CROSS_QUARRY_RESOURCE_MISMATCH', 'Product does not belong to specified quarry.');
    }

    return res.json({ success: true, data: product });
  } catch (err: any) {
    return handleQuarryError(err, res);
  }
});

/**
 * PUT /api/quarries/:quarryId/products/:productId - Update stone product
 */
quarryRouter.put('/:quarryId/products/:productId', requirePermission('PRODUCT_EDIT'), async (req: CustomRequest, res: Response) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId, productId } = req.params;
    await quarryMasterService.getQuarry(quarryId, ctx);

    const product = await stoneProductService.getStoneProduct(productId, ctx);
    if (product.quarryId !== quarryId) {
      throw new QuarryDomainError('CROSS_QUARRY_RESOURCE_MISMATCH', 'Product does not belong to specified quarry.');
    }

    const updated = await stoneProductService.updateStoneProduct(productId, req.body, ctx);
    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return handleQuarryError(err, res);
  }
});

/**
 * POST /api/quarries/:quarryId/products/:productId/deactivate - Deactivate stone product
 */
quarryRouter.post('/:quarryId/products/:productId/deactivate', requirePermission('PRODUCT_DEACTIVATE'), async (req: CustomRequest, res: Response) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId, productId } = req.params;
    await quarryMasterService.getQuarry(quarryId, ctx);

    const product = await stoneProductService.getStoneProduct(productId, ctx);
    if (product.quarryId !== quarryId) {
      throw new QuarryDomainError('CROSS_QUARRY_RESOURCE_MISMATCH', 'Product does not belong to specified quarry.');
    }

    const updated = await stoneProductService.deactivateStoneProduct(productId, ctx);
    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return handleQuarryError(err, res);
  }
});

/**
 * DELETE /api/quarries/:quarryId/products/:productId - Soft delete / Deactivate stone product
 */
quarryRouter.delete('/:quarryId/products/:productId', requirePermission('PRODUCT_DEACTIVATE'), async (req: CustomRequest, res: Response) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId, productId } = req.params;
    await quarryMasterService.getQuarry(quarryId, ctx);

    const product = await stoneProductService.getStoneProduct(productId, ctx);
    if (product.quarryId !== quarryId) {
      throw new QuarryDomainError('CROSS_QUARRY_RESOURCE_MISMATCH', 'Product does not belong to specified quarry.');
    }

    const updated = await stoneProductService.deactivateStoneProduct(productId, ctx);
    return res.json({
      success: true,
      data: updated,
      message: 'Product deactivated successfully (hard deletion disabled).'
    });
  } catch (err: any) {
    return handleQuarryError(err, res);
  }
});

// =========================================================================
// 3. PRODUCTION LOGS ENDPOINTS (/api/quarries/:quarryId/production)
// =========================================================================

/**
 * GET /api/quarries/:quarryId/production - List production records for quarry
 */
quarryRouter.get('/:quarryId/production', requirePermission('PRODUCTION_VIEW'), async (req: CustomRequest, res: Response) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId } = req.params;
    await quarryMasterService.getQuarry(quarryId, ctx);

    let list = await productionService.listProduction(ctx, quarryId);

    const { productId, shift, operatorId, startDate, endDate, page, pageSize } = req.query;
    if (productId) {
      list = list.filter(p => p.productId === productId);
    }
    if (shift) {
      list = list.filter(p => p.shift === shift);
    }
    if (operatorId) {
      list = list.filter(p => p.operatorId === operatorId);
    }
    if (startDate) {
      list = list.filter(p => p.productionDate >= (startDate as string));
    }
    if (endDate) {
      list = list.filter(p => p.productionDate <= (endDate as string));
    }

    const result = paginate(list, Number(page), Number(pageSize));
    return res.json({ success: true, ...result });
  } catch (err: any) {
    return handleQuarryError(err, res);
  }
});

/**
 * POST /api/quarries/:quarryId/production - Record production run and create STOCK_IN ledger entry
 */
quarryRouter.post('/:quarryId/production', requirePermission('PRODUCTION_CREATE'), async (req: CustomRequest, res: Response) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId } = req.params;
    await quarryMasterService.getQuarry(quarryId, ctx);

    const { productId, quantity } = req.body || {};
    if (!productId) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_REQUIRED_FIELDS',
        message: 'productId is required.'
      });
    }

    if (quantity === undefined || typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_QUANTITY',
        message: 'quantity must be a positive number.'
      });
    }

    const product = await stoneProductService.getStoneProduct(productId, ctx);
    if (product.quarryId !== quarryId) {
      throw new QuarryDomainError('CROSS_QUARRY_RESOURCE_MISMATCH', 'Product does not belong to specified quarry.');
    }

    const result = await productionService.recordProduction({
      ...req.body,
      quarryId
    }, ctx);

    return res.status(201).json({ success: true, data: result });
  } catch (err: any) {
    return handleQuarryError(err, res);
  }
});

/**
 * GET /api/quarries/:quarryId/production/:productionId - Get single production record
 */
quarryRouter.get('/:quarryId/production/:productionId', requirePermission('PRODUCTION_VIEW'), async (req: CustomRequest, res: Response) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId, productionId } = req.params;
    await quarryMasterService.getQuarry(quarryId, ctx);

    const prod = await productionService.getProduction(productionId, ctx);
    if (prod.quarryId !== quarryId) {
      throw new QuarryDomainError('CROSS_QUARRY_RESOURCE_MISMATCH', 'Production record does not belong to specified quarry.');
    }

    return res.json({ success: true, data: prod });
  } catch (err: any) {
    return handleQuarryError(err, res);
  }
});

// =========================================================================
// 4. STOCK & INVENTORY ENDPOINTS (/api/quarries/:quarryId/stock)
// =========================================================================

/**
 * GET /api/quarries/:quarryId/stock - Get stock summary for all products in quarry
 */
quarryRouter.get('/:quarryId/stock', requirePermission('STOCK_VIEW'), async (req: CustomRequest, res: Response) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId } = req.params;
    await quarryMasterService.getQuarry(quarryId, ctx);

    const summary = await stockService.getQuarryStockSummary(quarryId, ctx);
    return res.json({ success: true, data: summary });
  } catch (err: any) {
    return handleQuarryError(err, res);
  }
});

/**
 * GET /api/quarries/:quarryId/stock/:productId - Get balance & full immutable ledger for a product
 */
quarryRouter.get('/:quarryId/stock/:productId', requirePermission('STOCK_VIEW'), async (req: CustomRequest, res: Response) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId, productId } = req.params;
    await quarryMasterService.getQuarry(quarryId, ctx);

    const product = await stoneProductService.getStoneProduct(productId, ctx);
    if (product.quarryId !== quarryId) {
      throw new QuarryDomainError('CROSS_QUARRY_RESOURCE_MISMATCH', 'Product does not belong to specified quarry.');
    }

    const currentBalance = await stockService.getStockBalance(quarryId, productId, ctx);
    const ledger = await stockService.getStockLedger(quarryId, productId, ctx);

    return res.json({
      success: true,
      data: {
        productId: product.id,
        productCode: product.productCode,
        productName: product.name,
        unit: product.unit,
        currentBalance,
        ledger
      }
    });
  } catch (err: any) {
    return handleQuarryError(err, res);
  }
});

/**
 * POST /api/quarries/:quarryId/stock/adjustment - Perform stock adjustment
 */
quarryRouter.post('/:quarryId/stock/adjustment', requirePermission('STOCK_ADJUST'), async (req: CustomRequest, res: Response) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId } = req.params;
    await quarryMasterService.getQuarry(quarryId, ctx);

    const { productId, adjustmentType, quantity, reason } = req.body || {};
    if (!productId || !adjustmentType || !reason) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_REQUIRED_FIELDS',
        message: 'productId, adjustmentType, and reason are required.'
      });
    }

    if (!['ADJUSTMENT_IN', 'ADJUSTMENT_OUT'].includes(adjustmentType)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_STOCK_ADJUSTMENT',
        message: "adjustmentType must be 'ADJUSTMENT_IN' or 'ADJUSTMENT_OUT'."
      });
    }

    if (typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_QUANTITY',
        message: 'quantity must be a positive number.'
      });
    }

    const product = await stoneProductService.getStoneProduct(productId, ctx);
    if (product.quarryId !== quarryId) {
      throw new QuarryDomainError('CROSS_QUARRY_RESOURCE_MISMATCH', 'Product does not belong to specified quarry.');
    }

    const stockEntry = await stockService.recordStockAdjustment({
      ...req.body,
      quarryId
    }, ctx);

    return res.status(201).json({ success: true, data: stockEntry });
  } catch (err: any) {
    return handleQuarryError(err, res);
  }
});

// =========================================================================
// 5. GATE PASS ENDPOINTS (/api/quarries/:quarryId/gate-passes)
// =========================================================================

/**
 * GET /api/quarries/:quarryId/gate-passes - List gate passes
 */
quarryRouter.get('/:quarryId/gate-passes', requirePermission('GATE_PASS_VIEW'), async (req: CustomRequest, res: Response) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId } = req.params;
    await quarryMasterService.getQuarry(quarryId, ctx);

    let list = await gatePassService.listGatePasses(ctx, quarryId);

    const { status, customerId, productId, startDate, endDate, search, page, pageSize } = req.query;
    if (status) {
      list = list.filter(g => g.status === status);
    }
    if (customerId) {
      list = list.filter(g => g.customerId === customerId);
    }
    if (productId) {
      list = list.filter(g => g.productId === productId);
    }
    if (startDate) {
      list = list.filter(g => g.createdAt >= (startDate as string));
    }
    if (endDate) {
      list = list.filter(g => g.createdAt <= (endDate as string));
    }
    if (search && typeof search === 'string') {
      const qLower = search.toLowerCase();
      list = list.filter(g =>
        g.passNumber.toLowerCase().includes(qLower) ||
        g.vehicleNo.toLowerCase().includes(qLower) ||
        g.driverName.toLowerCase().includes(qLower)
      );
    }

    const result = paginate(list, Number(page), Number(pageSize));
    return res.json({ success: true, ...result });
  } catch (err: any) {
    return handleQuarryError(err, res);
  }
});

/**
 * POST /api/quarries/:quarryId/gate-passes - Create draft/issued gate pass
 */
quarryRouter.post('/:quarryId/gate-passes', requirePermission('GATE_PASS_CREATE'), async (req: CustomRequest, res: Response) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId } = req.params;
    await quarryMasterService.getQuarry(quarryId, ctx);

    const { customerId, productId, quantity, grossWeight, tareWeight } = req.body || {};
    if (!customerId || !productId) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_REQUIRED_FIELDS',
        message: 'customerId and productId are required.'
      });
    }

    if (typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_QUANTITY',
        message: 'quantity must be a positive number.'
      });
    }

    if (grossWeight !== undefined && tareWeight !== undefined) {
      if (grossWeight < 0 || tareWeight < 0 || tareWeight > grossWeight) {
        return res.status(422).json({
          success: false,
          error: 'TARE_EXCEEDS_GROSS',
          message: 'tareWeight cannot exceed grossWeight.'
        });
      }
    }

    const product = await stoneProductService.getStoneProduct(productId, ctx);
    if (product.quarryId !== quarryId) {
      throw new QuarryDomainError('CROSS_QUARRY_RESOURCE_MISMATCH', 'Product does not belong to specified quarry.');
    }

    const gatePass = await gatePassService.createGatePass({
      ...req.body,
      quarryId
    }, ctx);

    return res.status(201).json({ success: true, data: gatePass });
  } catch (err: any) {
    return handleQuarryError(err, res);
  }
});

/**
 * GET /api/quarries/:quarryId/gate-passes/:gatePassId - Get single gate pass
 */
quarryRouter.get('/:quarryId/gate-passes/:gatePassId', requirePermission('GATE_PASS_VIEW'), async (req: CustomRequest, res: Response) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId, gatePassId } = req.params;
    await quarryMasterService.getQuarry(quarryId, ctx);

    const gp = await gatePassService.getGatePass(gatePassId, ctx);
    if (gp.quarryId !== quarryId) {
      throw new QuarryDomainError('CROSS_QUARRY_RESOURCE_MISMATCH', 'Gate pass does not belong to specified quarry.');
    }

    return res.json({ success: true, data: gp });
  } catch (err: any) {
    return handleQuarryError(err, res);
  }
});

/**
 * POST /api/quarries/:quarryId/gate-passes/:gatePassId/verify - Weighbridge verification step
 */
quarryRouter.post('/:quarryId/gate-passes/:gatePassId/verify', requirePermission('GATE_PASS_VERIFY'), async (req: CustomRequest, res: Response) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId, gatePassId } = req.params;
    await quarryMasterService.getQuarry(quarryId, ctx);

    const gp = await gatePassService.getGatePass(gatePassId, ctx);
    if (gp.quarryId !== quarryId) {
      throw new QuarryDomainError('CROSS_QUARRY_RESOURCE_MISMATCH', 'Gate pass does not belong to specified quarry.');
    }

    const updated = await gatePassService.verifyGatePass(gatePassId, ctx);
    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return handleQuarryError(err, res);
  }
});

/**
 * POST /api/quarries/:quarryId/gate-passes/:gatePassId/dispatch - Dispatch gate pass & atomic STOCK_OUT deduction
 */
quarryRouter.post('/:quarryId/gate-passes/:gatePassId/dispatch', requirePermission('GATE_PASS_DISPATCH'), async (req: CustomRequest, res: Response) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId, gatePassId } = req.params;
    await quarryMasterService.getQuarry(quarryId, ctx);

    const gp = await gatePassService.getGatePass(gatePassId, ctx);
    if (gp.quarryId !== quarryId) {
      throw new QuarryDomainError('CROSS_QUARRY_RESOURCE_MISMATCH', 'Gate pass does not belong to specified quarry.');
    }

    const result = await gatePassService.dispatchGatePass(gatePassId, ctx);
    return res.json({ success: true, data: result });
  } catch (err: any) {
    return handleQuarryError(err, res);
  }
});

/**
 * POST /api/quarries/:quarryId/gate-passes/:gatePassId/cancel - Cancel gate pass
 */
quarryRouter.post('/:quarryId/gate-passes/:gatePassId/cancel', requirePermission('GATE_PASS_CANCEL'), async (req: CustomRequest, res: Response) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId, gatePassId } = req.params;
    await quarryMasterService.getQuarry(quarryId, ctx);

    const gp = await gatePassService.getGatePass(gatePassId, ctx);
    if (gp.quarryId !== quarryId) {
      throw new QuarryDomainError('CROSS_QUARRY_RESOURCE_MISMATCH', 'Gate pass does not belong to specified quarry.');
    }

    const reason = req.body?.reason || 'Cancelled by authorized user';
    const updated = await gatePassService.cancelGatePass(gatePassId, reason, ctx);
    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return handleQuarryError(err, res);
  }
});

// =========================================================================
// 6. LAND LEASE ENDPOINTS (/api/quarries/:quarryId/land-leases)
// =========================================================================

/**
 * GET /api/quarries/:quarryId/land-leases - List land leases for quarry
 */
quarryRouter.get('/:quarryId/land-leases', requirePermission('LAND_VIEW'), async (req: CustomRequest, res: Response) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId } = req.params;
    await quarryMasterService.getQuarry(quarryId, ctx);

    let list = await landLeaseService.listLeases(ctx, quarryId);

    const { status, leaseType, royaltyType, page, pageSize } = req.query;
    if (status) {
      list = list.filter(l => l.status === status);
    }
    if (leaseType) {
      list = list.filter(l => l.leaseType === leaseType);
    }
    if (royaltyType) {
      list = list.filter(l => l.royaltyType === royaltyType);
    }

    const result = paginate(list, Number(page), Number(pageSize));
    return res.json({ success: true, ...result });
  } catch (err: any) {
    return handleQuarryError(err, res);
  }
});

/**
 * POST /api/quarries/:quarryId/land-leases - Create new land lease
 */
quarryRouter.post('/:quarryId/land-leases', requirePermission('LAND_CREATE'), async (req: CustomRequest, res: Response) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId } = req.params;
    await quarryMasterService.getQuarry(quarryId, ctx);

    const { ownerName, surveyNumber, village, taluk, area, leaseType, royaltyType, royaltyRate, startDate, expiryDate } = req.body || {};
    if (!ownerName || !surveyNumber || !village || !taluk) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_REQUIRED_FIELDS',
        message: 'ownerName, surveyNumber, village, and taluk are required.'
      });
    }

    if (area !== undefined && (typeof area !== 'number' || area <= 0)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_INPUT',
        message: 'area must be a positive number.'
      });
    }

    if (royaltyRate !== undefined && (typeof royaltyRate !== 'number' || royaltyRate < 0)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_INPUT',
        message: 'royaltyRate must be a non-negative number.'
      });
    }

    if (leaseType && !['OWNED', 'LEASED', 'REVENUE_SHARE'].includes(leaseType)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_INPUT',
        message: "leaseType must be 'OWNED', 'LEASED', or 'REVENUE_SHARE'."
      });
    }

    if (royaltyType && !['FIXED_MONTHLY', 'PER_TON', 'PER_PIECE', 'REVENUE_PERCENT'].includes(royaltyType)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_INPUT',
        message: "royaltyType must be 'FIXED_MONTHLY', 'PER_TON', 'PER_PIECE', or 'REVENUE_PERCENT'."
      });
    }

    if (startDate && expiryDate && expiryDate < startDate) {
      return res.status(422).json({
        success: false,
        error: 'INVALID_LEASE_DATES',
        message: 'expiryDate cannot be earlier than startDate.'
      });
    }

    const lease = await landLeaseService.createLease({
      ...req.body,
      quarryId
    }, ctx);

    return res.status(201).json({ success: true, data: lease });
  } catch (err: any) {
    return handleQuarryError(err, res);
  }
});

/**
 * GET /api/quarries/:quarryId/land-leases/:leaseId - Get single land lease
 */
quarryRouter.get('/:quarryId/land-leases/:leaseId', requirePermission('LAND_VIEW'), async (req: CustomRequest, res: Response) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId, leaseId } = req.params;
    await quarryMasterService.getQuarry(quarryId, ctx);

    const lease = await landLeaseService.getLease(leaseId, ctx);
    if (lease.quarryId !== quarryId) {
      throw new QuarryDomainError('CROSS_QUARRY_RESOURCE_MISMATCH', 'Land lease does not belong to specified quarry.');
    }

    return res.json({ success: true, data: lease });
  } catch (err: any) {
    return handleQuarryError(err, res);
  }
});

/**
 * PUT /api/quarries/:quarryId/land-leases/:leaseId - Update land lease
 */
quarryRouter.put('/:quarryId/land-leases/:leaseId', requirePermission('LAND_EDIT'), async (req: CustomRequest, res: Response) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId, leaseId } = req.params;
    await quarryMasterService.getQuarry(quarryId, ctx);

    const lease = await landLeaseService.getLease(leaseId, ctx);
    if (lease.quarryId !== quarryId) {
      throw new QuarryDomainError('CROSS_QUARRY_RESOURCE_MISMATCH', 'Land lease does not belong to specified quarry.');
    }

    const updated = await landLeaseService.updateLease(leaseId, req.body, ctx);
    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return handleQuarryError(err, res);
  }
});

/**
 * POST /api/quarries/:quarryId/land-leases/:leaseId/deactivate - Deactivate land lease
 */
quarryRouter.post('/:quarryId/land-leases/:leaseId/deactivate', requirePermission('LAND_DEACTIVATE'), async (req: CustomRequest, res: Response) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId, leaseId } = req.params;
    await quarryMasterService.getQuarry(quarryId, ctx);

    const lease = await landLeaseService.getLease(leaseId, ctx);
    if (lease.quarryId !== quarryId) {
      throw new QuarryDomainError('CROSS_QUARRY_RESOURCE_MISMATCH', 'Land lease does not belong to specified quarry.');
    }

    const updated = await landLeaseService.deactivateLease(leaseId, ctx);
    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return handleQuarryError(err, res);
  }
});

/**
 * DELETE /api/quarries/:quarryId/land-leases/:leaseId - Soft delete / Deactivate land lease
 */
quarryRouter.delete('/:quarryId/land-leases/:leaseId', requirePermission('LAND_DEACTIVATE'), async (req: CustomRequest, res: Response) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId, leaseId } = req.params;
    await quarryMasterService.getQuarry(quarryId, ctx);

    const lease = await landLeaseService.getLease(leaseId, ctx);
    if (lease.quarryId !== quarryId) {
      throw new QuarryDomainError('CROSS_QUARRY_RESOURCE_MISMATCH', 'Land lease does not belong to specified quarry.');
    }

    const updated = await landLeaseService.deactivateLease(leaseId, ctx);
    return res.json({
      success: true,
      data: updated,
      message: 'Land lease deactivated successfully (hard deletion disabled).'
    });
  } catch (err: any) {
    return handleQuarryError(err, res);
  }
});

// =========================================================================
// 7. LANDOWNER SETTLEMENTS ENDPOINTS (/api/quarries/:quarryId/settlements)
// =========================================================================

/**
 * GET /api/quarries/:quarryId/settlements - List settlements for quarry
 */
quarryRouter.get('/:quarryId/settlements', requirePermission('SETTLEMENT_VIEW'), async (req: CustomRequest, res: Response) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId } = req.params;
    await quarryMasterService.getQuarry(quarryId, ctx);

    const { leaseId, status, page, pageSize } = req.query;
    let list = await landownerSettlementService.listSettlements(ctx, leaseId as string, quarryId);

    if (status) {
      list = list.filter(s => s.status === status);
    }

    const result = paginate(list, Number(page), Number(pageSize));
    return res.json({ success: true, ...result });
  } catch (err: any) {
    return handleQuarryError(err, res);
  }
});

/**
 * POST /api/quarries/:quarryId/settlements - Create settlement statement
 */
quarryRouter.post('/:quarryId/settlements', requirePermission('SETTLEMENT_CREATE'), async (req: CustomRequest, res: Response) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId } = req.params;
    await quarryMasterService.getQuarry(quarryId, ctx);

    const { leaseId, periodStart, periodEnd, basisQuantity } = req.body || {};
    if (!leaseId || !periodStart || !periodEnd) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_REQUIRED_FIELDS',
        message: 'leaseId, periodStart, and periodEnd are required.'
      });
    }

    const lease = await landLeaseService.getLease(leaseId, ctx);
    if (lease.quarryId !== quarryId) {
      throw new QuarryDomainError('CROSS_QUARRY_RESOURCE_MISMATCH', 'Land lease does not belong to specified quarry.');
    }

    if (basisQuantity !== undefined && (typeof basisQuantity !== 'number' || basisQuantity < 0)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_QUANTITY',
        message: 'basisQuantity must be a non-negative number.'
      });
    }

    const settlement = await landownerSettlementService.createSettlement(req.body, ctx);
    return res.status(201).json({ success: true, data: settlement });
  } catch (err: any) {
    return handleQuarryError(err, res);
  }
});

/**
 * GET /api/quarries/:quarryId/settlements/:settlementId - Get single settlement statement
 */
quarryRouter.get('/:quarryId/settlements/:settlementId', requirePermission('SETTLEMENT_VIEW'), async (req: CustomRequest, res: Response) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId, settlementId } = req.params;
    await quarryMasterService.getQuarry(quarryId, ctx);

    const settlement = await landownerSettlementService.getSettlement(settlementId, ctx);
    const lease = await landLeaseService.getLease(settlement.leaseId, ctx);
    if (lease.quarryId !== quarryId) {
      throw new QuarryDomainError('CROSS_QUARRY_RESOURCE_MISMATCH', 'Settlement does not belong to specified quarry.');
    }

    return res.json({ success: true, data: settlement });
  } catch (err: any) {
    return handleQuarryError(err, res);
  }
});

/**
 * POST /api/quarries/:quarryId/settlements/:settlementId/approve - Approve landowner settlement statement
 */
quarryRouter.post('/:quarryId/settlements/:settlementId/approve', requirePermission('SETTLEMENT_APPROVE'), async (req: CustomRequest, res: Response) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId, settlementId } = req.params;
    await quarryMasterService.getQuarry(quarryId, ctx);

    const settlement = await landownerSettlementService.getSettlement(settlementId, ctx);
    const lease = await landLeaseService.getLease(settlement.leaseId, ctx);
    if (lease.quarryId !== quarryId) {
      throw new QuarryDomainError('CROSS_QUARRY_RESOURCE_MISMATCH', 'Settlement does not belong to specified quarry.');
    }

    const approved = await landownerSettlementService.approveSettlement(settlementId, ctx);
    return res.json({ success: true, data: approved });
  } catch (err: any) {
    return handleQuarryError(err, res);
  }
});
