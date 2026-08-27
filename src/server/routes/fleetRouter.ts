import { Router, Response } from 'express';
import {
  authenticateJwt,
  enforceTenantContext,
  requirePermission,
  CustomRequest
} from '../middleware/authMiddleware.js';
import { rejectClientTenantId, validateResourceIdParam } from '../middleware/inputValidation.js';
import { validateCreateVehicleBody, validatePatchVehicleBody, validateCreateDriverBody, validatePatchDriverBody } from '../middleware/fleetValidation.js';
import { FleetVehicleService, ErpServiceError } from '../services/fleetVehicleService.js';
import { FleetDriverService } from '../services/fleetDriverService.js';

export const fleetRouter = Router();
const fleet = new FleetVehicleService();
const drivers = new FleetDriverService();

function handleFleetError(error: unknown, res: Response) {
  if (error instanceof ErpServiceError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.code,
      message: error.message
    });
  }
  console.error('[FLEET API]', error instanceof Error ? error.message : 'Unknown error');
  return res.status(500).json({
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message: 'An internal server error occurred.'
  });
}

const viewVehicle = [authenticateJwt, enforceTenantContext, requirePermission('fleet:vehicle:view')] as const;
const createVehicle = [authenticateJwt, rejectClientTenantId, enforceTenantContext, requirePermission('fleet:vehicle:create')] as const;
const updateVehicle = [authenticateJwt, rejectClientTenantId, enforceTenantContext, requirePermission('fleet:vehicle:update')] as const;
const archiveVehicle = [authenticateJwt, enforceTenantContext, requirePermission('fleet:vehicle:archive')] as const;
const viewDriver = [authenticateJwt, enforceTenantContext, requirePermission('fleet:driver:view')] as const;
const createDriver = [authenticateJwt, rejectClientTenantId, enforceTenantContext, requirePermission('fleet:driver:create')] as const;
const updateDriver = [authenticateJwt, rejectClientTenantId, enforceTenantContext, requirePermission('fleet:driver:update')] as const;
const archiveDriver = [authenticateJwt, enforceTenantContext, requirePermission('fleet:driver:archive')] as const;

fleetRouter.get('/vehicles', ...viewVehicle, async (req: CustomRequest, res: Response) => {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const registrationNumber = typeof req.query.registrationNumber === 'string' ? req.query.registrationNumber : undefined;
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const vehicleType = typeof req.query.vehicleType === 'string' ? req.query.vehicleType : undefined;
    const limit = typeof req.query.limit === 'string' ? Number(req.query.limit) : undefined;
    const offset = typeof req.query.offset === 'string' ? Number(req.query.offset) : undefined;
    return res.json({
      success: true,
      data: await fleet.listVehicles(req.user!.tenantId, {
        search,
        registrationNumber,
        status,
        vehicleType,
        limit,
        offset
      })
    });
  } catch (error) {
    return handleFleetError(error, res);
  }
});

fleetRouter.post('/vehicles', ...createVehicle, validateCreateVehicleBody, async (req: CustomRequest, res: Response) => {
  try {
    const vehicle = await fleet.createVehicle(req.user!.tenantId, { ...req.body, createdBy: req.user!.userId });
    return res.status(201).json({ success: true, data: vehicle });
  } catch (error) {
    return handleFleetError(error, res);
  }
});

fleetRouter.get('/vehicles/:id', ...viewVehicle, validateResourceIdParam('id'), async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await fleet.getVehicle(req.user!.tenantId, req.params.id) });
  } catch (error) {
    return handleFleetError(error, res);
  }
});

fleetRouter.patch('/vehicles/:id', ...updateVehicle, validateResourceIdParam('id'), validatePatchVehicleBody, async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await fleet.updateVehicle(req.user!.tenantId, req.params.id, req.body) });
  } catch (error) {
    return handleFleetError(error, res);
  }
});

fleetRouter.delete('/vehicles/:id', ...archiveVehicle, validateResourceIdParam('id'), async (req: CustomRequest, res: Response) => {
  try {
    await fleet.archiveVehicle(req.user!.tenantId, req.params.id);
    return res.json({ success: true, message: 'Vehicle archived successfully.' });
  } catch (error) {
    return handleFleetError(error, res);
  }
});

fleetRouter.get('/drivers', ...viewDriver, async (req: CustomRequest, res: Response) => {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const licenseNumber = typeof req.query.licenseNumber === 'string' ? req.query.licenseNumber : undefined;
    const licenseClass = typeof req.query.licenseClass === 'string' ? req.query.licenseClass : undefined;
    const limit = typeof req.query.limit === 'string' ? Number(req.query.limit) : undefined;
    const offset = typeof req.query.offset === 'string' ? Number(req.query.offset) : undefined;
    return res.json({
      success: true,
      data: await drivers.listDrivers(req.user!.tenantId, {
        search,
        status,
        licenseNumber,
        licenseClass,
        limit,
        offset
      })
    });
  } catch (error) {
    return handleFleetError(error, res);
  }
});

fleetRouter.post('/drivers', ...createDriver, validateCreateDriverBody, async (req: CustomRequest, res: Response) => {
  try {
    const driver = await drivers.createDriver(req.user!.tenantId, { ...req.body, createdBy: req.user!.userId });
    return res.status(201).json({ success: true, data: driver });
  } catch (error) {
    return handleFleetError(error, res);
  }
});

fleetRouter.get('/drivers/:id', ...viewDriver, validateResourceIdParam('id'), async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await drivers.getDriver(req.user!.tenantId, req.params.id) });
  } catch (error) {
    return handleFleetError(error, res);
  }
});

fleetRouter.patch('/drivers/:id', ...updateDriver, validateResourceIdParam('id'), validatePatchDriverBody, async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await drivers.updateDriver(req.user!.tenantId, req.params.id, req.body) });
  } catch (error) {
    return handleFleetError(error, res);
  }
});

fleetRouter.delete('/drivers/:id', ...archiveDriver, validateResourceIdParam('id'), async (req: CustomRequest, res: Response) => {
  try {
    await drivers.archiveDriver(req.user!.tenantId, req.params.id);
    return res.json({ success: true, message: 'Driver archived successfully.' });
  } catch (error) {
    return handleFleetError(error, res);
  }
});
