/**
 * RZ® Minetrix BOS - Fleet Operations REST API Router (Phase 18)
 * Tenant-isolated endpoints for Vehicles, Drivers, Trips, Fuel, Maintenance, Compliance & Dashboard.
 */

import { Router, Request, Response } from 'express';
import { fleetService } from '../services/fleetServices.js';
import { fleetRepository } from '../repositories/fleetRepositories.js';
import { AuditRepository } from '../repositories/sharedCoreRepositories.js';
import { generateUuidV7 } from '../db/database.js';

export const fleetRouter = Router();
const auditRepo = new AuditRepository();

// Helper to get authenticated tenant context
function getTenantId(req: Request): string {
  return (req as any).tenantContext?.tenantId || (req as any).user?.tenantId || 'tenant-rz-global-001';
}

function getUserId(req: Request): string {
  return (req as any).user?.id || 'usr-admin-001';
}

function getUserEmail(req: Request): string {
  return (req as any).user?.email || 'admin@racezoneventures.com';
}

// 1. Fleet Dashboard Metrics
fleetRouter.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const metrics = await fleetService.getDashboardMetrics(tenantId);
    res.json({ success: true, data: metrics });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Vehicles CRUD
fleetRouter.get('/vehicles', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const status = req.query.status as string;
    const search = req.query.search as string;
    const vehicles = await fleetService.getVehicles(tenantId, { status, search });
    res.json({ success: true, data: vehicles });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

fleetRouter.get('/vehicles/:id', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const vehicle = await fleetService.getVehicleById(tenantId, req.params.id);
    if (!vehicle) return res.status(404).json({ success: false, error: 'Vehicle not found' });
    res.json({ success: true, data: vehicle });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

fleetRouter.post('/vehicles', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const vehicle = await fleetService.createVehicle(tenantId, req.body);
    
    await auditRepo.log({
      tenantId,
      actorUserId: getUserId(req),
      actorEmail: getUserEmail(req),
      action: 'FLEET_VEHICLE_CREATE',
      module: 'Fleet Operations',
      resource: 'fleet_vehicles',
      resourceId: vehicle.id,
      ipAddress: req.ip || '127.0.0.1',
      correlationId: generateUuidV7(),
      status: 'SUCCESS'
    });

    res.status(201).json({ success: true, data: vehicle });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

fleetRouter.delete('/vehicles/:id', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const deleted = await fleetRepository.deleteVehicle(tenantId, req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Vehicle not found' });

    await auditRepo.log({
      tenantId,
      actorUserId: getUserId(req),
      actorEmail: getUserEmail(req),
      action: 'FLEET_VEHICLE_DELETE',
      module: 'Fleet Operations',
      resource: 'fleet_vehicles',
      resourceId: req.params.id,
      ipAddress: req.ip || '127.0.0.1',
      correlationId: generateUuidV7(),
      status: 'SUCCESS'
    });

    res.json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Drivers CRUD
fleetRouter.get('/drivers', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const status = req.query.status as string;
    const search = req.query.search as string;
    const drivers = await fleetService.getDrivers(tenantId, { status, search });
    res.json({ success: true, data: drivers });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

fleetRouter.post('/drivers', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const driver = await fleetService.createDriver(tenantId, req.body);
    res.status(201).json({ success: true, data: driver });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 4. Assignments
fleetRouter.get('/assignments', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const vehicleId = req.query.vehicleId as string;
    const list = await fleetRepository.getAssignments(tenantId, vehicleId);
    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

fleetRouter.post('/assignments', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const assignment = await fleetService.assignVehicle(tenantId, req.body);
    res.status(201).json({ success: true, data: assignment });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 5. Trips Management
fleetRouter.get('/trips', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const status = req.query.status as string;
    const vehicleId = req.query.vehicleId as string;
    const driverId = req.query.driverId as string;
    const trips = await fleetRepository.getTrips(tenantId, { status, vehicleId, driverId });
    res.json({ success: true, data: trips });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

fleetRouter.post('/trips', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const trip = await fleetService.createTrip(tenantId, req.body);
    res.status(201).json({ success: true, data: trip });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

fleetRouter.post('/trips/:id/dispatch', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const trip = await fleetService.dispatchTrip(tenantId, req.params.id);
    res.json({ success: true, data: trip });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

fleetRouter.post('/trips/:id/complete', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const endOdometer = Number(req.body.endOdometer);
    if (isNaN(endOdometer)) {
      return res.status(400).json({ success: false, error: 'Valid endOdometer reading is required' });
    }
    const trip = await fleetService.completeTrip(tenantId, req.params.id, endOdometer);
    res.json({ success: true, data: trip });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 6. Fuel Logs
fleetRouter.get('/fuel', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const vehicleId = req.query.vehicleId as string;
    const logs = await fleetRepository.getFuelLogs(tenantId, vehicleId);
    res.json({ success: true, data: logs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

fleetRouter.post('/fuel', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const log = await fleetService.logFuel(tenantId, req.body);
    res.status(201).json({ success: true, data: log });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 7. Maintenance Records
fleetRouter.get('/maintenance', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const vehicleId = req.query.vehicleId as string;
    const records = await fleetRepository.getMaintenanceRecords(tenantId, vehicleId);
    res.json({ success: true, data: records });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

fleetRouter.post('/maintenance', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const record = await fleetService.logMaintenance(tenantId, req.body);
    res.status(201).json({ success: true, data: record });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 8. Alerts
fleetRouter.get('/alerts', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const alerts = await fleetRepository.getAlerts(tenantId);
    res.json({ success: true, data: alerts });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
