/**
 * RZ® Minetrix BOS - Enterprise Fleet Operations & Vehicle Management Service (Phase 18)
 * Core business rules, validation, lifecycle states, trip dispatching, odometer validation, and metrics.
 */

import { fleetRepository } from '../repositories/fleetRepositories.js';
import { db, generateUuidV7 } from '../db/database.js';
import {
  FleetVehicle,
  FleetDriver,
  FleetVehicleAssignment,
  FleetTrip,
  FleetFuelLog,
  FleetMaintenanceRecord,
  FleetComplianceRecord,
  FleetVehicleExpense,
  FleetVehicleRevenue,
  FleetVehicleAlert,
  TripStatus,
  VehicleStatus
} from '../db/schema.js';

export interface FleetDashboardMetrics {
  totalVehicles: number;
  availableVehicles: number;
  assignedVehicles: number;
  onTripVehicles: number;
  underMaintenanceVehicles: number;
  totalDrivers: number;
  activeDrivers: number;
  activeTrips: number;
  completedTrips: number;
  totalFuelExpense: number;
  totalMaintenanceExpense: number;
  totalFleetRevenue: number;
  averageFuelEfficiencyKmPerLiter: number;
  activeAlertsCount: number;
}

export class FleetService {
  // ==========================================
  // VEHICLE MANAGEMENT
  // ==========================================
  public async getVehicles(tenantId: string, filters?: { status?: string; search?: string }) {
    return fleetRepository.getVehicles(tenantId, filters);
  }

  public async getVehicleById(tenantId: string, id: string) {
    return fleetRepository.getVehicleById(tenantId, id);
  }

  public async createVehicle(tenantId: string, data: Partial<FleetVehicle>) {
    if (!data.registrationNumber) {
      throw new Error('Vehicle registration number is required.');
    }
    const existing = await fleetRepository.getVehicleByRegistration(tenantId, data.registrationNumber);
    if (existing) {
      throw new Error(`Vehicle with registration number ${data.registrationNumber} already exists in this tenant.`);
    }

    const now = new Date().toISOString();
    const vehicle: FleetVehicle = {
      id: generateUuidV7(),
      tenantId,
      companyId: data.companyId || 'comp-rz-ventures-001',
      branchId: data.branchId || 'br-quarry-alpha',
      businessUnitId: data.businessUnitId,
      registrationNumber: data.registrationNumber.toUpperCase(),
      vehicleType: data.vehicleType || 'Tipper',
      categoryId: data.categoryId,
      categoryName: data.categoryName || 'Heavy Duty Tipper Truck',
      make: data.make || 'Tata',
      model: data.model || 'Prima 2830.K',
      variant: data.variant,
      manufacturingYear: data.manufacturingYear || 2024,
      purchaseDate: data.purchaseDate || new Date().toISOString().slice(0, 10),
      purchaseValue: data.purchaseValue || 0,
      ownershipType: data.ownershipType || 'OWNED',
      ownerName: data.ownerName || 'Racezone Ventures',
      fuelType: data.fuelType || 'DIESEL',
      fuelCapacity: data.fuelCapacity || 300,
      engineNumber: data.engineNumber || 'ENG-GENERIC',
      chassisNumber: data.chassisNumber || 'CHS-GENERIC',
      color: data.color || 'White',
      seatingCapacity: data.seatingCapacity || 2,
      loadCapacity: data.loadCapacity || 25,
      currentOdometer: data.currentOdometer || 0,
      status: 'AVAILABLE',
      location: data.location || 'Main Depot Yard',
      remarks: data.remarks,
      createdAt: now,
      updatedAt: now,
      version: 1
    };

    return fleetRepository.createVehicle(vehicle);
  }

  public async updateVehicleStatus(tenantId: string, vehicleId: string, newStatus: VehicleStatus, reason?: string) {
    const veh = await fleetRepository.getVehicleById(tenantId, vehicleId);
    if (!veh) {
      throw new Error('Vehicle not found.');
    }

    veh.status = newStatus;
    if (reason) veh.remarks = `${veh.remarks || ''} [Status change: ${newStatus} - ${reason}]`.trim();
    return fleetRepository.updateVehicle(veh);
  }

  // ==========================================
  // DRIVER MANAGEMENT & HR LINKAGE
  // ==========================================
  public async getDrivers(tenantId: string, filters?: { status?: string; search?: string }) {
    return fleetRepository.getDrivers(tenantId, filters);
  }

  public async createDriver(tenantId: string, data: Partial<FleetDriver>) {
    if (!data.name || !data.licenseNumber) {
      throw new Error('Driver name and license number are required.');
    }

    const now = new Date().toISOString();
    const driver: FleetDriver = {
      id: generateUuidV7(),
      tenantId,
      employeeId: data.employeeId,
      linkedUserId: data.linkedUserId,
      name: data.name,
      phone: data.phone || '+91-0000000000',
      licenseNumber: data.licenseNumber.toUpperCase(),
      licenseType: data.licenseType || 'HEAVY_COMMERCIAL',
      licenseIssueDate: data.licenseIssueDate || '2020-01-01',
      licenseExpiryDate: data.licenseExpiryDate || '2030-01-01',
      status: 'ACTIVE',
      joiningDate: data.joiningDate || new Date().toISOString().slice(0, 10),
      emergencyContact: data.emergencyContact,
      address: data.address,
      remarks: data.remarks,
      createdAt: now,
      updatedAt: now
    };

    return fleetRepository.createDriver(driver);
  }

  // ==========================================
  // VEHICLE ASSIGNMENT & CONFLICT PREVENTION
  // ==========================================
  public async assignVehicle(tenantId: string, data: Partial<FleetVehicleAssignment>) {
    if (!data.vehicleId || !data.primaryDriverId) {
      throw new Error('Vehicle ID and Primary Driver ID are required for assignment.');
    }

    const veh = await fleetRepository.getVehicleById(tenantId, data.vehicleId);
    if (!veh) throw new Error('Vehicle not found.');

    const driver = await fleetRepository.getDriverById(tenantId, data.primaryDriverId);
    if (!driver) throw new Error('Driver not found.');

    // Check conflict: Is vehicle already assigned or on trip?
    const activeAssignments = await fleetRepository.getAssignments(tenantId, data.vehicleId);
    const hasActiveAssignment = activeAssignments.some(a => a.status === 'ACTIVE');
    if (hasActiveAssignment || veh.status === 'ON_TRIP') {
      throw new Error(`Vehicle ${veh.registrationNumber} currently has an active assignment or is on trip.`);
    }

    const now = new Date().toISOString();
    const assignment: FleetVehicleAssignment = {
      id: generateUuidV7(),
      tenantId,
      vehicleId: data.vehicleId,
      primaryDriverId: data.primaryDriverId,
      secondaryDriverId: data.secondaryDriverId,
      assignedEmployeeId: data.assignedEmployeeId || driver.employeeId,
      companyId: veh.companyId,
      branchId: veh.branchId,
      businessUnitId: veh.businessUnitId,
      assignmentStart: now,
      purpose: data.purpose || 'Mining Fleet Operational Assignment',
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now
    };

    veh.status = 'ASSIGNED';
    await fleetRepository.updateVehicle(veh);

    return fleetRepository.createAssignment(assignment);
  }

  // ==========================================
  // TRIP DISPATCH & LIFECYCLE MANAGEMENT
  // ==========================================
  public async createTrip(tenantId: string, data: Partial<FleetTrip>) {
    if (!data.vehicleId || !data.driverId || !data.source || !data.destination) {
      throw new Error('Vehicle ID, Driver ID, Source, and Destination are required to schedule a trip.');
    }

    const veh = await fleetRepository.getVehicleById(tenantId, data.vehicleId);
    if (!veh) throw new Error('Vehicle not found.');

    const driver = await fleetRepository.getDriverById(tenantId, data.driverId);
    if (!driver) throw new Error('Driver not found.');

    const now = new Date().toISOString();
    const startOdo = data.startOdometer !== undefined ? Number(data.startOdometer) : veh.currentOdometer;

    const trip: FleetTrip = {
      id: generateUuidV7(),
      tenantId,
      tripNumber: data.tripNumber || `TRIP-${Date.now().toString().slice(-6)}`,
      vehicleId: data.vehicleId,
      driverId: data.driverId,
      source: data.source,
      destination: data.destination,
      tripDate: data.tripDate || new Date().toISOString().slice(0, 10),
      startTime: now,
      startOdometer: startOdo,
      distance: 0,
      tripType: data.tripType || 'MINING_DISPATCH',
      customerId: data.customerId,
      customerName: data.customerName,
      material: data.material || 'Granite Aggregate (40mm)',
      quantity: data.quantity || 25,
      loadReference: data.loadReference,
      deliveryReference: data.deliveryReference,
      status: 'PLANNED',
      remarks: data.remarks,
      createdAt: now,
      updatedAt: now
    };

    return fleetRepository.createTrip(trip);
  }

  public async dispatchTrip(tenantId: string, tripId: string) {
    const trip = await fleetRepository.getTripById(tenantId, tripId);
    if (!trip) throw new Error('Trip not found.');

    if (trip.status !== 'PLANNED') {
      throw new Error(`Cannot dispatch trip in status ${trip.status}. Must be PLANNED.`);
    }

    const veh = await fleetRepository.getVehicleById(tenantId, trip.vehicleId);
    if (!veh) throw new Error('Vehicle not found.');

    trip.status = 'DISPATCHED';
    trip.startTime = new Date().toISOString();
    await fleetRepository.updateTrip(trip);

    veh.status = 'ON_TRIP';
    await fleetRepository.updateVehicle(veh);

    return trip;
  }

  public async completeTrip(tenantId: string, tripId: string, endOdometer: number) {
    const trip = await fleetRepository.getTripById(tenantId, tripId);
    if (!trip) throw new Error('Trip not found.');

    if (trip.status !== 'DISPATCHED' && trip.status !== 'IN_PROGRESS' && trip.status !== 'PLANNED') {
      throw new Error(`Cannot complete trip in status ${trip.status}.`);
    }

    // ODOMETER VALIDATION: Reject negative movement or lower than start
    if (endOdometer < trip.startOdometer) {
      throw new Error(`End odometer (${endOdometer} km) cannot be less than start odometer (${trip.startOdometer} km). Negative distance prohibited.`);
    }

    const distance = endOdometer - trip.startOdometer;
    trip.endOdometer = endOdometer;
    trip.distance = distance;
    trip.endTime = new Date().toISOString();
    trip.status = 'COMPLETED';

    await fleetRepository.updateTrip(trip);

    // Update vehicle current odometer and status
    const veh = await fleetRepository.getVehicleById(tenantId, trip.vehicleId);
    if (veh) {
      veh.currentOdometer = endOdometer;
      veh.status = 'AVAILABLE';
      await fleetRepository.updateVehicle(veh);
    }

    return trip;
  }

  public async getTrips(tenantId: string, filters?: { vehicleId?: string; driverId?: string; status?: string }) {
    return fleetRepository.getTrips(tenantId, filters);
  }

  // ==========================================
  // FUEL MANAGEMENT & EFFICIENCY CALCULATION
  // ==========================================
  public async logFuel(tenantId: string, data: Partial<FleetFuelLog>) {
    if (!data.vehicleId || !data.quantity || !data.rate || !data.odometer) {
      throw new Error('Vehicle ID, quantity, rate, and odometer reading are required for fuel logging.');
    }

    const veh = await fleetRepository.getVehicleById(tenantId, data.vehicleId);
    if (!veh) throw new Error('Vehicle not found.');

    const qty = Number(data.quantity);
    const rate = Number(data.rate);
    const totalAmount = qty * rate;
    const odo = Number(data.odometer);

    // Calculate efficiency relative to previous fuel log or vehicle baseline currentOdometer
    const previousLogs = await fleetRepository.getFuelLogs(tenantId, data.vehicleId);
    let efficiency: number | undefined;

    const baselineOdo = previousLogs.length > 0 ? previousLogs[0].odometer : veh.currentOdometer;
    const distanceCovered = odo - baselineOdo;
    if (distanceCovered > 0 && qty > 0) {
      efficiency = Number((distanceCovered / qty).toFixed(2));
    }

    const now = new Date().toISOString();
    const log: FleetFuelLog = {
      id: generateUuidV7(),
      tenantId,
      vehicleId: data.vehicleId,
      driverId: data.driverId,
      logDate: data.logDate || new Date().toISOString().slice(0, 10),
      fuelStation: data.fuelStation || 'Quarry Diesel Station Gate 1',
      fuelType: veh.fuelType,
      quantity: qty,
      rate,
      amount: totalAmount,
      odometer: odo,
      paymentMethod: data.paymentMethod || 'COMPANY_CARD',
      invoiceNumber: data.invoiceNumber,
      calculatedEfficiency: efficiency,
      remarks: data.remarks,
      createdAt: now,
      updatedAt: now
    };

    await fleetRepository.createFuelLog(log);

    // Also record expense automatically
    const expense: FleetVehicleExpense = {
      id: generateUuidV7(),
      tenantId,
      vehicleId: data.vehicleId,
      driverId: data.driverId,
      expenseCategory: 'FUEL',
      expenseDate: log.logDate,
      amount: totalAmount,
      paymentStatus: 'PAID',
      referenceNumber: log.invoiceNumber,
      remarks: `Fuel log ref: ${qty}L @ ${rate}/L`,
      createdAt: now
    };
    await fleetRepository.createExpense(expense);

    // Trigger alert if fuel efficiency is abnormally low (< 1.5 km/L for heavy trucks)
    if (efficiency !== undefined && efficiency < 1.5) {
      const alert: FleetVehicleAlert = {
        id: generateUuidV7(),
        tenantId,
        vehicleId: data.vehicleId,
        alertType: 'HIGH_FUEL_CONSUMPTION',
        severity: 'CRITICAL',
        message: `High fuel consumption alert for vehicle ${veh.registrationNumber}: ${efficiency} KM/L measured on ${log.logDate}.`,
        isResolved: false,
        createdAt: now
      };
      await fleetRepository.createAlert(alert);
    }

    return log;
  }

  // ==========================================
  // MAINTENANCE MANAGEMENT
  // ==========================================
  public async logMaintenance(tenantId: string, data: Partial<FleetMaintenanceRecord>) {
    if (!data.vehicleId || !data.description || data.odometer === undefined) {
      throw new Error('Vehicle ID, description, and odometer reading are required for maintenance record.');
    }

    const veh = await fleetRepository.getVehicleById(tenantId, data.vehicleId);
    if (!veh) throw new Error('Vehicle not found.');

    const parts = Number(data.partsCost || 0);
    const labour = Number(data.labourCost || 0);
    const other = Number(data.otherCost || 0);
    const total = parts + labour + other;

    const now = new Date().toISOString();
    const record: FleetMaintenanceRecord = {
      id: generateUuidV7(),
      tenantId,
      vehicleId: data.vehicleId,
      maintenanceType: data.maintenanceType || 'PREVENTIVE',
      serviceDate: data.serviceDate || new Date().toISOString().slice(0, 10),
      odometer: Number(data.odometer),
      workshop: data.workshop || 'Minetrix Central Workshop',
      description: data.description,
      partsCost: parts,
      labourCost: labour,
      otherCost: other,
      totalCost: total,
      nextServiceDate: data.nextServiceDate,
      nextServiceOdometer: data.nextServiceOdometer,
      status: 'COMPLETED',
      createdAt: now,
      updatedAt: now
    };

    await fleetRepository.createMaintenanceRecord(record);

    // Record expense
    const expense: FleetVehicleExpense = {
      id: generateUuidV7(),
      tenantId,
      vehicleId: data.vehicleId,
      expenseCategory: 'MAINTENANCE',
      expenseDate: record.serviceDate,
      amount: total,
      paymentStatus: 'PAID',
      remarks: `Maintenance: ${record.description}`,
      createdAt: now
    };
    await fleetRepository.createExpense(expense);

    return record;
  }

  // ==========================================
  // DASHBOARD & METRICS
  // ==========================================
  public async getDashboardMetrics(tenantId: string): Promise<FleetDashboardMetrics> {
    const vehicles = await fleetRepository.getVehicles(tenantId);
    const drivers = await fleetRepository.getDrivers(tenantId);
    const trips = await fleetRepository.getTrips(tenantId);
    const fuelLogs = await fleetRepository.getFuelLogs(tenantId);
    const maintenance = await fleetRepository.getMaintenanceRecords(tenantId);
    const expenses = await fleetRepository.getExpenses(tenantId);
    const revenues = await fleetRepository.getRevenues(tenantId);
    const alerts = await fleetRepository.getAlerts(tenantId);

    const totalVehicles = vehicles.length;
    const availableVehicles = vehicles.filter(v => v.status === 'AVAILABLE').length;
    const assignedVehicles = vehicles.filter(v => v.status === 'ASSIGNED').length;
    const onTripVehicles = vehicles.filter(v => v.status === 'ON_TRIP').length;
    const underMaintenanceVehicles = vehicles.filter(v => v.status === 'UNDER_MAINTENANCE').length;

    const totalDrivers = drivers.length;
    const activeDrivers = drivers.filter(d => d.status === 'ACTIVE').length;

    const activeTrips = trips.filter(t => t.status === 'DISPATCHED' || t.status === 'IN_PROGRESS').length;
    const completedTrips = trips.filter(t => t.status === 'COMPLETED').length;

    const totalFuelExpense = fuelLogs.reduce((sum, f) => sum + f.amount, 0);
    const totalMaintenanceExpense = maintenance.reduce((sum, m) => sum + m.totalCost, 0);
    const totalFleetRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);

    const effLogs = fuelLogs.filter(f => f.calculatedEfficiency && f.calculatedEfficiency > 0);
    const avgEff = effLogs.length > 0
      ? Number((effLogs.reduce((sum, f) => sum + (f.calculatedEfficiency || 0), 0) / effLogs.length).toFixed(2))
      : 3.2;

    const activeAlertsCount = alerts.filter(a => !a.isResolved).length;

    return {
      totalVehicles,
      availableVehicles,
      assignedVehicles,
      onTripVehicles,
      underMaintenanceVehicles,
      totalDrivers,
      activeDrivers,
      activeTrips,
      completedTrips,
      totalFuelExpense,
      totalMaintenanceExpense,
      totalFleetRevenue,
      averageFuelEfficiencyKmPerLiter: avgEff,
      activeAlertsCount
    };
  }
}

export const fleetService = new FleetService();
