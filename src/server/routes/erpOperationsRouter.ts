import { Router, Response } from 'express';
import {
  authenticateJwt,
  enforceTenantContext,
  requirePermission,
  CustomRequest
} from '../middleware/authMiddleware.js';
import { rejectClientTenantId, validateResourceIdParam } from '../middleware/inputValidation.js';
import {
  validateAdjustmentBody,
  validateCreateCustomerBody,
  validateCreateDispatchBody,
  validateCreateGatePassBody,
  validateCreateLeaseBody,
  validateCreateLocationBody,
  validateCreateParcelBody,
  validateCreatePriceBody,
  validateCreateProductBody,
  validateCreateProductSizeBody,
  validateCreateProductionBody,
  validateCreateSettlementBody,
  validateCreateSettlementRateBody
} from '../middleware/erpValidation.js';
import { ErpOperationsService, ErpServiceError } from '../services/erpOperationsService.js';

export const erpOperationsRouter = Router();
const erp = new ErpOperationsService();

function handleErpError(error: unknown, res: Response) {
  if (error instanceof ErpServiceError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.code,
      message: error.message
    });
  }
  console.error('[ERP Operations API]', error instanceof Error ? error.message : 'Unknown error');
  return res.status(500).json({
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message: 'An internal server error occurred.'
  });
}

const authViewQuarry = [authenticateJwt, enforceTenantContext, requirePermission('mining:quarry:view')] as const;
const authWriteQuarry = [authenticateJwt, rejectClientTenantId, enforceTenantContext, requirePermission('mining:quarry:create')] as const;
const authViewProduct = [authenticateJwt, enforceTenantContext, requirePermission('mining:product:view')] as const;
const authWriteProduct = [authenticateJwt, rejectClientTenantId, enforceTenantContext, requirePermission('mining:product:create')] as const;
const authViewProduction = [authenticateJwt, enforceTenantContext, requirePermission('mining:production:view')] as const;
const authWriteProduction = [authenticateJwt, rejectClientTenantId, enforceTenantContext, requirePermission('mining:production:create')] as const;
const authViewStock = [authenticateJwt, enforceTenantContext, requirePermission('mining:stock:view')] as const;
const authAdjustStock = [authenticateJwt, rejectClientTenantId, enforceTenantContext, requirePermission('mining:stock:adjust')] as const;
const authViewGatePass = [authenticateJwt, enforceTenantContext, requirePermission('mining:gatepass:view')] as const;
const authWriteGatePass = [authenticateJwt, rejectClientTenantId, enforceTenantContext, requirePermission('mining:gatepass:create')] as const;
const authApproveGatePass = [authenticateJwt, enforceTenantContext, requirePermission('mining:gatepass:approve')] as const;
const authViewDispatch = [authenticateJwt, enforceTenantContext, requirePermission('mining:dispatch:view')] as const;
const authWriteDispatch = [authenticateJwt, rejectClientTenantId, enforceTenantContext, requirePermission('mining:dispatch:create')] as const;
const authViewSettlement = [authenticateJwt, enforceTenantContext, requirePermission('mining:settlement:view')] as const;
const authWriteSettlement = [authenticateJwt, rejectClientTenantId, enforceTenantContext, requirePermission('mining:settlement:create')] as const;

erpOperationsRouter.get('/products', ...authViewProduct, async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await erp.listProducts(req.user!.tenantId) });
  } catch (error) {
    return handleErpError(error, res);
  }
});

erpOperationsRouter.post('/products', ...authWriteProduct, validateCreateProductBody, async (req: CustomRequest, res: Response) => {
  try {
    const product = await erp.createProduct(req.user!.tenantId, req.body);
    return res.status(201).json({ success: true, data: product });
  } catch (error) {
    return handleErpError(error, res);
  }
});

erpOperationsRouter.get('/products/:id/sizes', ...authViewProduct, validateResourceIdParam('id'), async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await erp.listProductSizes(req.user!.tenantId, req.params.id) });
  } catch (error) {
    return handleErpError(error, res);
  }
});

erpOperationsRouter.post('/products/:id/sizes', ...authWriteProduct, validateResourceIdParam('id'), validateCreateProductSizeBody, async (req: CustomRequest, res: Response) => {
  try {
    const size = await erp.createProductSize(req.user!.tenantId, { ...req.body, productId: req.params.id });
    return res.status(201).json({ success: true, data: size });
  } catch (error) {
    return handleErpError(error, res);
  }
});

erpOperationsRouter.get('/product-prices', ...authViewProduct, async (req: CustomRequest, res: Response) => {
  try {
    const productId = typeof req.query.productId === 'string' ? req.query.productId : undefined;
    return res.json({ success: true, data: await erp.listProductPrices(req.user!.tenantId, productId) });
  } catch (error) {
    return handleErpError(error, res);
  }
});

erpOperationsRouter.post('/product-prices', ...authWriteProduct, validateCreatePriceBody, async (req: CustomRequest, res: Response) => {
  try {
    const price = await erp.createProductPrice(req.user!.tenantId, req.body);
    return res.status(201).json({ success: true, data: price });
  } catch (error) {
    return handleErpError(error, res);
  }
});

erpOperationsRouter.get('/quarries/:id/locations', ...authViewQuarry, validateResourceIdParam('id'), async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await erp.listLocations(req.user!.tenantId, req.params.id) });
  } catch (error) {
    return handleErpError(error, res);
  }
});

erpOperationsRouter.post('/quarries/:id/locations', ...authWriteQuarry, validateResourceIdParam('id'), validateCreateLocationBody, async (req: CustomRequest, res: Response) => {
  try {
    const location = await erp.createLocation(req.user!.tenantId, { ...req.body, quarryId: req.params.id });
    return res.status(201).json({ success: true, data: location });
  } catch (error) {
    return handleErpError(error, res);
  }
});

erpOperationsRouter.get('/land-parcels', ...authViewQuarry, async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await erp.listLandParcels(req.user!.tenantId) });
  } catch (error) {
    return handleErpError(error, res);
  }
});

erpOperationsRouter.post('/land-parcels', ...authWriteQuarry, validateCreateParcelBody, async (req: CustomRequest, res: Response) => {
  try {
    const parcel = await erp.createLandParcel(req.user!.tenantId, req.body);
    return res.status(201).json({ success: true, data: parcel });
  } catch (error) {
    return handleErpError(error, res);
  }
});

erpOperationsRouter.get('/leases', ...authViewQuarry, async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await erp.listLeases(req.user!.tenantId) });
  } catch (error) {
    return handleErpError(error, res);
  }
});

erpOperationsRouter.post('/leases', ...authWriteQuarry, validateCreateLeaseBody, async (req: CustomRequest, res: Response) => {
  try {
    const lease = await erp.createLease(req.user!.tenantId, req.body);
    return res.status(201).json({ success: true, data: lease });
  } catch (error) {
    return handleErpError(error, res);
  }
});

erpOperationsRouter.get('/customers', ...authViewDispatch, async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await erp.listCustomers(req.user!.tenantId) });
  } catch (error) {
    return handleErpError(error, res);
  }
});

erpOperationsRouter.post('/customers', ...authWriteDispatch, validateCreateCustomerBody, async (req: CustomRequest, res: Response) => {
  try {
    const customer = await erp.createCustomer(req.user!.tenantId, req.body);
    return res.status(201).json({ success: true, data: customer });
  } catch (error) {
    return handleErpError(error, res);
  }
});

erpOperationsRouter.get('/production/batches', ...authViewProduction, async (req: CustomRequest, res: Response) => {
  try {
    const quarryId = typeof req.query.quarryId === 'string' ? req.query.quarryId : undefined;
    return res.json({ success: true, data: await erp.listProductionBatches(req.user!.tenantId, quarryId) });
  } catch (error) {
    return handleErpError(error, res);
  }
});

erpOperationsRouter.post('/production/batches', ...authWriteProduction, validateCreateProductionBody, async (req: CustomRequest, res: Response) => {
  try {
    const batch = await erp.createProductionBatch(req.user!.tenantId, {
      ...req.body,
      createdBy: req.user!.userId
    });
    return res.status(201).json({ success: true, data: batch });
  } catch (error) {
    return handleErpError(error, res);
  }
});

erpOperationsRouter.get('/production/batches/:id', ...authViewProduction, validateResourceIdParam('id'), async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await erp.getProductionBatch(req.user!.tenantId, req.params.id) });
  } catch (error) {
    return handleErpError(error, res);
  }
});

erpOperationsRouter.post('/production/batches/:id/post', ...authWriteProduction, validateResourceIdParam('id'), async (req: CustomRequest, res: Response) => {
  try {
    const batch = await erp.postProductionBatch(req.user!.tenantId, req.params.id, req.user!.userId);
    return res.json({ success: true, data: batch });
  } catch (error) {
    return handleErpError(error, res);
  }
});

erpOperationsRouter.get('/stock/balances', ...authViewStock, async (req: CustomRequest, res: Response) => {
  try {
    const quarryId = typeof req.query.quarryId === 'string' ? req.query.quarryId : undefined;
    return res.json({ success: true, data: await erp.listStockBalances(req.user!.tenantId, quarryId) });
  } catch (error) {
    return handleErpError(error, res);
  }
});

erpOperationsRouter.get('/stock/ledger', ...authViewStock, async (req: CustomRequest, res: Response) => {
  try {
    const quarryId = typeof req.query.quarryId === 'string' ? req.query.quarryId : undefined;
    return res.json({ success: true, data: await erp.listStockLedger(req.user!.tenantId, quarryId) });
  } catch (error) {
    return handleErpError(error, res);
  }
});

erpOperationsRouter.post('/stock/adjustments', ...authAdjustStock, validateAdjustmentBody, async (req: CustomRequest, res: Response) => {
  try {
    const movement = await erp.createAdjustment(req.user!.tenantId, {
      ...req.body,
      createdBy: req.user!.userId
    });
    return res.status(201).json({ success: true, data: movement });
  } catch (error) {
    return handleErpError(error, res);
  }
});

erpOperationsRouter.get('/gate-passes', ...authViewGatePass, async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await erp.listGatePasses(req.user!.tenantId) });
  } catch (error) {
    return handleErpError(error, res);
  }
});

erpOperationsRouter.post('/gate-passes', ...authWriteGatePass, validateCreateGatePassBody, async (req: CustomRequest, res: Response) => {
  try {
    const gatePass = await erp.createGatePass(req.user!.tenantId, {
      ...req.body,
      createdBy: req.user!.userId
    });
    return res.status(201).json({ success: true, data: gatePass });
  } catch (error) {
    return handleErpError(error, res);
  }
});

erpOperationsRouter.get('/gate-passes/:id', ...authViewGatePass, validateResourceIdParam('id'), async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await erp.getGatePass(req.user!.tenantId, req.params.id) });
  } catch (error) {
    return handleErpError(error, res);
  }
});

erpOperationsRouter.post('/gate-passes/:id/approve', ...authApproveGatePass, validateResourceIdParam('id'), async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await erp.transitionGatePass(req.user!.tenantId, req.params.id, 'APPROVED', req.user!.userId) });
  } catch (error) {
    return handleErpError(error, res);
  }
});

erpOperationsRouter.post('/gate-passes/:id/issue', ...authApproveGatePass, validateResourceIdParam('id'), async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await erp.transitionGatePass(req.user!.tenantId, req.params.id, 'ISSUED', req.user!.userId) });
  } catch (error) {
    return handleErpError(error, res);
  }
});

erpOperationsRouter.post('/gate-passes/:id/cancel', ...authApproveGatePass, validateResourceIdParam('id'), async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await erp.transitionGatePass(req.user!.tenantId, req.params.id, 'CANCELLED', req.user!.userId) });
  } catch (error) {
    return handleErpError(error, res);
  }
});

erpOperationsRouter.get('/dispatches', ...authViewDispatch, async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await erp.listDispatches(req.user!.tenantId) });
  } catch (error) {
    return handleErpError(error, res);
  }
});

erpOperationsRouter.post('/dispatches', ...authWriteDispatch, validateCreateDispatchBody, async (req: CustomRequest, res: Response) => {
  try {
    const idempotencyKey = (req.header('Idempotency-Key') || req.body.idempotencyKey || '').trim() || undefined;
    const dispatch = await erp.createDispatch(req.user!.tenantId, {
      dispatchNumber: req.body.dispatchNumber,
      gatePassId: req.body.gatePassId,
      createdBy: req.user!.userId,
      idempotencyKey
    });
    return res.status(201).json({ success: true, data: dispatch });
  } catch (error) {
    return handleErpError(error, res);
  }
});

erpOperationsRouter.get('/dispatches/:id', ...authViewDispatch, validateResourceIdParam('id'), async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await erp.getDispatch(req.user!.tenantId, req.params.id) });
  } catch (error) {
    return handleErpError(error, res);
  }
});

erpOperationsRouter.get('/settlement-rates', ...authViewSettlement, async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await erp.listSettlementRates(req.user!.tenantId) });
  } catch (error) {
    return handleErpError(error, res);
  }
});

erpOperationsRouter.post('/settlement-rates', ...authWriteSettlement, validateCreateSettlementRateBody, async (req: CustomRequest, res: Response) => {
  try {
    const rate = await erp.createSettlementRate(req.user!.tenantId, req.body);
    return res.status(201).json({ success: true, data: rate });
  } catch (error) {
    return handleErpError(error, res);
  }
});

erpOperationsRouter.get('/settlements', ...authViewSettlement, async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await erp.listSettlements(req.user!.tenantId) });
  } catch (error) {
    return handleErpError(error, res);
  }
});

erpOperationsRouter.post('/settlements', ...authWriteSettlement, validateCreateSettlementBody, async (req: CustomRequest, res: Response) => {
  try {
    const settlement = await erp.createSettlement(req.user!.tenantId, {
      ...req.body,
      createdBy: req.user!.userId
    });
    return res.status(201).json({ success: true, data: settlement });
  } catch (error) {
    return handleErpError(error, res);
  }
});
