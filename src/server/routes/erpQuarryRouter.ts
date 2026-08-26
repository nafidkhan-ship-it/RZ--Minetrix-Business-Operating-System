import { Router, Response } from 'express';
import {
  authenticateJwt,
  enforceTenantContext,
  requirePermission,
  CustomRequest
} from '../middleware/authMiddleware.js';
import {
  rejectClientTenantId,
  validateCreateQuarryBody,
  validateResourceIdParam
} from '../middleware/inputValidation.js';
import { QuarryService, QuarryServiceError } from '../services/quarryService.js';

export const erpQuarryRouter = Router();
const quarryService = new QuarryService();

function handleQuarryError(error: unknown, res: Response) {
  if (error instanceof QuarryServiceError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.code,
      message: error.message
    });
  }

  console.error('[ERP Quarry API]', error instanceof Error ? error.message : 'Unknown error');
  return res.status(500).json({
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message: 'An internal server error occurred.'
  });
}

erpQuarryRouter.get(
  '/quarries',
  authenticateJwt,
  enforceTenantContext,
  requirePermission('mining:quarry:view'),
  async (req: CustomRequest, res: Response) => {
    try {
      const quarries = await quarryService.listQuarries(req.user!.tenantId);
      return res.json({ success: true, data: quarries });
    } catch (error) {
      return handleQuarryError(error, res);
    }
  }
);

erpQuarryRouter.get(
  '/quarries/:id',
  authenticateJwt,
  enforceTenantContext,
  requirePermission('mining:quarry:view'),
  validateResourceIdParam('id'),
  async (req: CustomRequest, res: Response) => {
    try {
      const quarry = await quarryService.getQuarry(req.user!.tenantId, req.params.id);
      return res.json({ success: true, data: quarry });
    } catch (error) {
      return handleQuarryError(error, res);
    }
  }
);

erpQuarryRouter.post(
  '/quarries',
  authenticateJwt,
  rejectClientTenantId,
  enforceTenantContext,
  requirePermission('mining:quarry:create'),
  validateCreateQuarryBody,
  async (req: CustomRequest, res: Response) => {
    try {
      const isAdmin = req.user!.permissions.includes('shared:admin:access');
      const quarry = await quarryService.createQuarry(
        req.user!.tenantId,
        req.user!.companyId,
        isAdmin,
        {
          ...req.body,
          companyId: req.body.companyId || req.user!.companyId,
          branchId: req.body.branchId || req.user!.branchId,
          createdBy: req.user!.userId
        }
      );
      return res.status(201).json({ success: true, data: quarry });
    } catch (error) {
      return handleQuarryError(error, res);
    }
  }
);
