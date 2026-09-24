/**
 * RZ® Minetrix BOS - Fleet GPS & Telematics Integration Abstraction Layer
 * Provides integration-ready interface for Fleet Tracking Providers (GPS / IoT OBD-II / CANbus)
 */

export interface VehicleLocation {
  vehicleId: string;
  latitude: number;
  longitude: number;
  speedKmH: number;
  headingDegrees: number;
  ignitionOn: boolean;
  odometerKm: number;
  fuelLevelPercent: number;
  lastUpdated: string;
}

export interface VehicleTrackingStatus {
  vehicleId: string;
  isOnline: boolean;
  gpsSignalStatus: 'STRONG' | 'WEAK' | 'NO_SIGNAL' | 'UNCONFIGURED';
  telematicsDeviceId?: string;
  providerName: string;
  currentLocation: VehicleLocation;
}

export interface IFleetTrackingProvider {
  providerName: string;
  isConfigured(): boolean;
  getVehicleLocation(vehicleId: string): Promise<VehicleLocation | null>;
  getVehicleStatus(vehicleId: string): Promise<VehicleTrackingStatus | null>;
  getTripLocation(tripId: string): Promise<VehicleLocation | null>;
  getTripHistory(tripId: string): Promise<VehicleLocation[]>;
}

export class TelematicsIntegrationProvider implements IFleetTrackingProvider {
  public providerName = 'RZ_GPS_TELEMATICS_GATEWAY';
  private apiKey?: string;

  constructor() {
    this.apiKey = process.env.FLEET_GPS_API_KEY;
  }

  public isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.length > 0);
  }

  public async getVehicleLocation(vehicleId: string): Promise<VehicleLocation | null> {
    if (!this.isConfigured()) {
      return null; // Clean unconfigured state - no fabricated coordinates
    }
    // Real GPS integration API endpoint hook
    return null;
  }

  public async getVehicleStatus(vehicleId: string): Promise<VehicleTrackingStatus | null> {
    const isConf = this.isConfigured();
    return {
      vehicleId,
      isOnline: isConf,
      gpsSignalStatus: isConf ? 'STRONG' : 'UNCONFIGURED',
      providerName: this.providerName,
      currentLocation: {
        vehicleId,
        latitude: 0,
        longitude: 0,
        speedKmH: 0,
        headingDegrees: 0,
        ignitionOn: false,
        odometerKm: 0,
        fuelLevelPercent: 0,
        lastUpdated: new Date().toISOString()
      }
    };
  }

  public async getTripLocation(tripId: string): Promise<VehicleLocation | null> {
    if (!this.isConfigured()) return null;
    return null;
  }

  public async getTripHistory(tripId: string): Promise<VehicleLocation[]> {
    return [];
  }
}

export const fleetTrackingProvider = new TelematicsIntegrationProvider();
