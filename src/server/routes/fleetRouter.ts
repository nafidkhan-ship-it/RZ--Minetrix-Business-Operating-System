import { Router, Response } from 'express';
import {
  authenticateJwt,
  enforceTenantContext,
  requirePermission,
  CustomRequest
} from '../middleware/authMiddleware.js';
import { rejectClientTenantId, validateResourceIdParam } from '../middleware/inputValidation.js';
import {
  validateCreateVehicleBody,
  validatePatchVehicleBody,
  validateCreateDriverBody,
  validatePatchDriverBody,
  validateCreateVehicleDocumentBody,
  validatePatchVehicleDocumentBody,
  validateCreateMaintenanceBody,
  validatePatchMaintenanceBody,
  validateCreateFuelBody,
  validatePatchFuelBody,
  validateCreateOperationBody,
  validatePatchOperationBody
} from '../middleware/fleetValidation.js';
import { FleetVehicleService, ErpServiceError } from '../services/fleetVehicleService.js';
import { FleetDriverService } from '../services/fleetDriverService.js';
import { FleetVehicleDocumentService } from '../services/fleetVehicleDocumentService.js';
import { FleetMaintenanceService } from '../services/fleetMaintenanceService.js';
import { FleetFuelService } from '../services/fleetFuelService.js';
import { FleetOperationService } from '../services/fleetOperationService.js';

export const fleetRouter = Router();
const fleet = new FleetVehicleService();
const drivers = new FleetDriverService();
const documents = new FleetVehicleDocumentService();
const maintenance = new FleetMaintenanceService();
const fuel = new FleetFuelService();
const operations = new FleetOperationService();

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
const viewDocument = [authenticateJwt, enforceTenantContext, requirePermission('fleet:document:view')] as const;
const createDocument = [authenticateJwt, rejectClientTenantId, enforceTenantContext, requirePermission('fleet:document:create')] as const;
const updateDocument = [authenticateJwt, rejectClientTenantId, enforceTenantContext, requirePermission('fleet:document:update')] as const;
const archiveDocument = [authenticateJwt, enforceTenantContext, requirePermission('fleet:document:archive')] as const;
const viewMaintenance = [authenticateJwt, enforceTenantContext, requirePermission('fleet:maintenance:view')] as const;
const createMaintenance = [authenticateJwt, rejectClientTenantId, enforceTenantContext, requirePermission('fleet:maintenance:create')] as const;
const updateMaintenance = [authenticateJwt, rejectClientTenantId, enforceTenantContext, requirePermission('fleet:maintenance:update')] as const;
const archiveMaintenance = [authenticateJwt, enforceTenantContext, requirePermission('fleet:maintenance:archive')] as const;
const viewFuel = [authenticateJwt, enforceTenantContext, requirePermission('fleet:fuel:view')] as const;
const createFuel = [authenticateJwt, rejectClientTenantId, enforceTenantContext, requirePermission('fleet:fuel:create')] as const;
const updateFuel = [authenticateJwt, rejectClientTenantId, enforceTenantContext, requirePermission('fleet:fuel:update')] as const;
const archiveFuel = [authenticateJwt, enforceTenantContext, requirePermission('fleet:fuel:archive')] as const;
const viewOperation = [authenticateJwt, enforceTenantContext, requirePermission('fleet:operation:view')] as const;
const createOperation = [authenticateJwt, rejectClientTenantId, enforceTenantContext, requirePermission('fleet:operation:create')] as const;
const updateOperation = [authenticateJwt, rejectClientTenantId, enforceTenantContext, requirePermission('fleet:operation:update')] as const;
const archiveOperation = [authenticateJwt, enforceTenantContext, requirePermission('fleet:operation:archive')] as const;

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

fleetRouter.get('/vehicle-documents', ...viewDocument, async (req: CustomRequest, res: Response) => {
  try {
    const vehicleId = typeof req.query.vehicleId === 'string' ? req.query.vehicleId : undefined;
    const documentType = typeof req.query.documentType === 'string' ? req.query.documentType : undefined;
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const limit = typeof req.query.limit === 'string' ? Number(req.query.limit) : undefined;
    const offset = typeof req.query.offset === 'string' ? Number(req.query.offset) : undefined;
    return res.json({
      success: true,
      data: await documents.listDocuments(req.user!.tenantId, { vehicleId, documentType, status, search, limit, offset })
    });
  } catch (error) {
    return handleFleetError(error, res);
  }
});

fleetRouter.post('/vehicle-documents', ...createDocument, validateCreateVehicleDocumentBody, async (req: CustomRequest, res: Response) => {
  try {
    const record = await documents.createDocument(req.user!.tenantId, { ...req.body, createdBy: req.user!.userId });
    return res.status(201).json({ success: true, data: record });
  } catch (error) {
    return handleFleetError(error, res);
  }
});

fleetRouter.get('/vehicle-documents/:id', ...viewDocument, validateResourceIdParam('id'), async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await documents.getDocument(req.user!.tenantId, req.params.id) });
  } catch (error) {
    return handleFleetError(error, res);
  }
});

fleetRouter.patch('/vehicle-documents/:id', ...updateDocument, validateResourceIdParam('id'), validatePatchVehicleDocumentBody, async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await documents.updateDocument(req.user!.tenantId, req.params.id, req.body) });
  } catch (error) {
    return handleFleetError(error, res);
  }
});

fleetRouter.delete('/vehicle-documents/:id', ...archiveDocument, validateResourceIdParam('id'), async (req: CustomRequest, res: Response) => {
  try {
    await documents.archiveDocument(req.user!.tenantId, req.params.id);
    return res.json({ success: true, message: 'Vehicle document archived successfully.' });
  } catch (error) {
    return handleFleetError(error, res);
  }
});

fleetRouter.get('/maintenance', ...viewMaintenance, async (req: CustomRequest, res: Response) => {
  try {
    const vehicleId = typeof req.query.vehicleId === 'string' ? req.query.vehicleId : undefined;
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const limit = typeof req.query.limit === 'string' ? Number(req.query.limit) : undefined;
    const offset = typeof req.query.offset === 'string' ? Number(req.query.offset) : undefined;
    return res.json({
      success: true,
      data: await maintenance.listMaintenance(req.user!.tenantId, { vehicleId, status, search, limit, offset })
    });
  } catch (error) {
    return handleFleetError(error, res);
  }
});

fleetRouter.post('/maintenance', ...createMaintenance, validateCreateMaintenanceBody, async (req: CustomRequest, res: Response) => {
  try {
    const record = await maintenance.createMaintenance(req.user!.tenantId, { ...req.body, createdBy: req.user!.userId });
    return res.status(201).json({ success: true, data: record });
  } catch (error) {
    return handleFleetError(error, res);
  }
});

fleetRouter.get('/maintenance/:id', ...viewMaintenance, validateResourceIdParam('id'), async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await maintenance.getMaintenance(req.user!.tenantId, req.params.id) });
  } catch (error) {
    return handleFleetError(error, res);
  }
});

fleetRouter.patch('/maintenance/:id', ...updateMaintenance, validateResourceIdParam('id'), validatePatchMaintenanceBody, async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await maintenance.updateMaintenance(req.user!.tenantId, req.params.id, req.body) });
  } catch (error) {
    return handleFleetError(error, res);
  }
});

fleetRouter.delete('/maintenance/:id', ...archiveMaintenance, validateResourceIdParam('id'), async (req: CustomRequest, res: Response) => {
  try {
    await maintenance.archiveMaintenance(req.user!.tenantId, req.params.id);
    return res.json({ success: true, message: 'Maintenance record archived successfully.' });
  } catch (error) {
    return handleFleetError(error, res);
  }
});

fleetRouter.get('/fuel', ...viewFuel, async (req: CustomRequest, res: Response) => {
  try {
    const vehicleId = typeof req.query.vehicleId === 'string' ? req.query.vehicleId : undefined;
    const fuelType = typeof req.query.fuelType === 'string' ? req.query.fuelType : undefined;
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const limit = typeof req.query.limit === 'string' ? Number(req.query.limit) : undefined;
    const offset = typeof req.query.offset === 'string' ? Number(req.query.offset) : undefined;
    return res.json({
      success: true,
      data: await fuel.listFuelRecords(req.user!.tenantId, { vehicleId, fuelType, search, limit, offset })
    });
  } catch (error) {
    return handleFleetError(error, res);
  }
});

fleetRouter.post('/fuel', ...createFuel, validateCreateFuelBody, async (req: CustomRequest, res: Response) => {
  try {
    const record = await fuel.createFuelRecord(req.user!.tenantId, { ...req.body, createdBy: req.user!.userId });
    return res.status(201).json({ success: true, data: record });
  } catch (error) {
    return handleFleetError(error, res);
  }
});

fleetRouter.get('/fuel/:id', ...viewFuel, validateResourceIdParam('id'), async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await fuel.getFuelRecord(req.user!.tenantId, req.params.id) });
  } catch (error) {
    return handleFleetError(error, res);
  }
});

fleetRouter.patch('/fuel/:id', ...updateFuel, validateResourceIdParam('id'), validatePatchFuelBody, async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await fuel.updateFuelRecord(req.user!.tenantId, req.params.id, req.body) });
  } catch (error) {
    return handleFleetError(error, res);
  }
});

fleetRouter.delete('/fuel/:id', ...archiveFuel, validateResourceIdParam('id'), async (req: CustomRequest, res: Response) => {
  try {
    await fuel.archiveFuelRecord(req.user!.tenantId, req.params.id);
    return res.json({ success: true, message: 'Fuel record archived successfully.' });
  } catch (error) {
    return handleFleetError(error, res);
  }
});

fleetRouter.get('/operations', ...viewOperation, async (req: CustomRequest, res: Response) => {
  try {
    const vehicleId = typeof req.query.vehicleId === 'string' ? req.query.vehicleId : undefined;
    const driverId = typeof req.query.driverId === 'string' ? req.query.driverId : undefined;
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const limit = typeof req.query.limit === 'string' ? Number(req.query.limit) : undefined;
    const offset = typeof req.query.offset === 'string' ? Number(req.query.offset) : undefined;
    return res.json({
      success: true,
      data: await operations.listOperations(req.user!.tenantId, { vehicleId, driverId, status, search, limit, offset })
    });
  } catch (error) {
    return handleFleetError(error, res);
  }
});

fleetRouter.post('/operations', ...createOperation, validateCreateOperationBody, async (req: CustomRequest, res: Response) => {
  try {
    const record = await operations.createOperation(req.user!.tenantId, { ...req.body, createdBy: req.user!.userId });
    return res.status(201).json({ success: true, data: record });
  } catch (error) {
    return handleFleetError(error, res);
  }
});

fleetRouter.get('/operations/:id', ...viewOperation, validateResourceIdParam('id'), async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await operations.getOperation(req.user!.tenantId, req.params.id) });
  } catch (error) {
    return handleFleetError(error, res);
  }
});

fleetRouter.patch('/operations/:id', ...updateOperation, validateResourceIdParam('id'), validatePatchOperationBody, async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await operations.updateOperation(req.user!.tenantId, req.params.id, req.body) });
  } catch (error) {
    return handleFleetError(error, res);
  }
});

fleetRouter.delete('/operations/:id', ...archiveOperation, validateResourceIdParam('id'), async (req: CustomRequest, res: Response) => {
  try {
    await operations.archiveOperation(req.user!.tenantId, req.params.id);
    return res.json({ success: true, message: 'Fleet operation archived successfully.' });
  } catch (error) {
    return handleFleetError(error, res);
  }
});
