/**
 * RZ® Minetrix BOS - Fleet Repositories Layer (Phase 18)
 * Tenant-scoped CRUD and query handling for Fleet Operations & Vehicle Management
 */

import { db, generateUuidV7 } from '../db/database.js';
import {
  FleetVehicleCategory,
  FleetVehicle,
  FleetVehicleDocument,
  FleetDriver,
  FleetVehicleAssignment,
  FleetTrip,
  FleetFuelLog,
  FleetMaintenanceRecord,
  FleetComplianceRecord,
  FleetOdometerLog,
  FleetVehicleExpense,
  FleetVehicleRevenue,
  FleetVehicleAlert
} from '../db/schema.js';

export class FleetRepository {
  // --- Vehicles ---
  public async getVehicles(tenantId: string, filters?: { status?: string; search?: string }): Promise<FleetVehicle[]> {
    let list = Array.from(db.fleetVehicles.values()).filter(v => v.tenantId === tenantId);
    if (filters?.status && filters.status !== 'ALL') {
      list = list.filter(v => v.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(v => 
        v.registrationNumber.toLowerCase().includes(q) ||
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q)
      );
    }
    return list;
  }

  public async getVehicleById(tenantId: string, id: string): Promise<FleetVehicle | null> {
    const veh = db.fleetVehicles.get(id);
    if (!veh || veh.tenantId !== tenantId) return null;
    return veh;
  }

  public async getVehicleByRegistration(tenantId: string, regNumber: string): Promise<FleetVehicle | null> {
    const list = Array.from(db.fleetVehicles.values());
    const found = list.find(v => v.tenantId === tenantId && v.registrationNumber.toUpperCase() === regNumber.toUpperCase());
    return found || null;
  }

  public async createVehicle(vehicle: FleetVehicle): Promise<FleetVehicle> {
    db.fleetVehicles.set(vehicle.id, vehicle);
    db.persistToDisk();
    return vehicle;
  }

  public async updateVehicle(vehicle: FleetVehicle): Promise<FleetVehicle> {
    vehicle.updatedAt = new Date().toISOString();
    vehicle.version += 1;
    db.fleetVehicles.set(vehicle.id, vehicle);
    db.persistToDisk();
    return vehicle;
  }

  public async deleteVehicle(tenantId: string, id: string): Promise<boolean> {
    const veh = await this.getVehicleById(tenantId, id);
    if (!veh) return false;
    db.fleetVehicles.delete(id);
    db.persistToDisk();
    return true;
  }

  // --- Drivers ---
  public async getDrivers(tenantId: string, filters?: { status?: string; search?: string }): Promise<FleetDriver[]> {
    let list = Array.from(db.fleetDrivers.values()).filter(d => d.tenantId === tenantId);
    if (filters?.status && filters.status !== 'ALL') {
      list = list.filter(d => d.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(d => 
        d.name.toLowerCase().includes(q) ||
        d.licenseNumber.toLowerCase().includes(q) ||
        d.phone.includes(q)
      );
    }
    return list;
  }

  public async getDriverById(tenantId: string, id: string): Promise<FleetDriver | null> {
    const d = db.fleetDrivers.get(id);
    if (!d || d.tenantId !== tenantId) return null;
    return d;
  }

  public async createDriver(driver: FleetDriver): Promise<FleetDriver> {
    db.fleetDrivers.set(driver.id, driver);
    db.persistToDisk();
    return driver;
  }

  public async updateDriver(driver: FleetDriver): Promise<FleetDriver> {
    driver.updatedAt = new Date().toISOString();
    db.fleetDrivers.set(driver.id, driver);
    db.persistToDisk();
    return driver;
  }

  // --- Assignments ---
  public async getAssignments(tenantId: string, vehicleId?: string): Promise<FleetVehicleAssignment[]> {
    let list = Array.from(db.fleetVehicleAssignments.values()).filter(a => a.tenantId === tenantId);
    if (vehicleId) {
      list = list.filter(a => a.vehicleId === vehicleId);
    }
    return list;
  }

  public async createAssignment(assignment: FleetVehicleAssignment): Promise<FleetVehicleAssignment> {
    db.fleetVehicleAssignments.set(assignment.id, assignment);
    db.persistToDisk();
    return assignment;
  }

  // --- Trips ---
  public async getTrips(tenantId: string, filters?: { status?: string; vehicleId?: string; driverId?: string }): Promise<FleetTrip[]> {
    let list = Array.from(db.fleetTrips.values()).filter(t => t.tenantId === tenantId);
    if (filters?.status && filters.status !== 'ALL') {
      list = list.filter(t => t.status === filters.status);
    }
    if (filters?.vehicleId) {
      list = list.filter(t => t.vehicleId === filters.vehicleId);
    }
    if (filters?.driverId) {
      list = list.filter(t => t.driverId === filters.driverId);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async getTripById(tenantId: string, id: string): Promise<FleetTrip | null> {
    const t = db.fleetTrips.get(id);
    if (!t || t.tenantId !== tenantId) return null;
    return t;
  }

  public async createTrip(trip: FleetTrip): Promise<FleetTrip> {
    db.fleetTrips.set(trip.id, trip);
    db.persistToDisk();
    return trip;
  }

  public async updateTrip(trip: FleetTrip): Promise<FleetTrip> {
    trip.updatedAt = new Date().toISOString();
    db.fleetTrips.set(trip.id, trip);
    db.persistToDisk();
    return trip;
  }

  // --- Fuel Logs ---
  public async getFuelLogs(tenantId: string, vehicleId?: string): Promise<FleetFuelLog[]> {
    let list = Array.from(db.fleetFuelLogs.values()).filter(f => f.tenantId === tenantId);
    if (vehicleId) {
      list = list.filter(f => f.vehicleId === vehicleId);
    }
    return list.sort((a, b) => new Date(b.logDate).getTime() - new Date(a.logDate).getTime());
  }

  public async createFuelLog(log: FleetFuelLog): Promise<FleetFuelLog> {
    db.fleetFuelLogs.set(log.id, log);
    db.persistToDisk();
    return log;
  }

  // --- Maintenance Records ---
  public async getMaintenanceRecords(tenantId: string, vehicleId?: string): Promise<FleetMaintenanceRecord[]> {
    let list = Array.from(db.fleetMaintenanceRecords.values()).filter(m => m.tenantId === tenantId);
    if (vehicleId) {
      list = list.filter(m => m.vehicleId === vehicleId);
    }
    return list.sort((a, b) => new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime());
  }

  public async createMaintenanceRecord(record: FleetMaintenanceRecord): Promise<FleetMaintenanceRecord> {
    db.fleetMaintenanceRecords.set(record.id, record);
    db.persistToDisk();
    return record;
  }

  // --- Compliance & Documents ---
  public async getComplianceRecords(tenantId: string, vehicleId?: string): Promise<FleetComplianceRecord[]> {
    let list = Array.from(db.fleetComplianceRecords.values()).filter(c => c.tenantId === tenantId);
    if (vehicleId) {
      list = list.filter(c => c.vehicleId === vehicleId);
    }
    return list;
  }

  public async createComplianceRecord(record: FleetComplianceRecord): Promise<FleetComplianceRecord> {
    db.fleetComplianceRecords.set(record.id, record);
    db.persistToDisk();
    return record;
  }

  // --- Expenses & Revenues ---
  public async getExpenses(tenantId: string, vehicleId?: string): Promise<FleetVehicleExpense[]> {
    let list = Array.from(db.fleetExpenses.values()).filter(e => e.tenantId === tenantId);
    if (vehicleId) list = list.filter(e => e.vehicleId === vehicleId);
    return list;
  }

  public async createExpense(expense: FleetVehicleExpense): Promise<FleetVehicleExpense> {
    db.fleetExpenses.set(expense.id, expense);
    db.persistToDisk();
    return expense;
  }

  public async getRevenues(tenantId: string, vehicleId?: string): Promise<FleetVehicleRevenue[]> {
    let list = Array.from(db.fleetRevenues.values()).filter(r => r.tenantId === tenantId);
    if (vehicleId) list = list.filter(r => r.vehicleId === vehicleId);
    return list;
  }

  public async createRevenue(revenue: FleetVehicleRevenue): Promise<FleetVehicleRevenue> {
    db.fleetRevenues.set(revenue.id, revenue);
    db.persistToDisk();
    return revenue;
  }

  // --- Alerts ---
  public async getAlerts(tenantId: string): Promise<FleetVehicleAlert[]> {
    return Array.from(db.fleetAlerts.values()).filter(a => a.tenantId === tenantId);
  }

  public async createAlert(alert: FleetVehicleAlert): Promise<FleetVehicleAlert> {
    db.fleetAlerts.set(alert.id, alert);
    db.persistToDisk();
    return alert;
  }
}

export const fleetRepository = new FleetRepository();
