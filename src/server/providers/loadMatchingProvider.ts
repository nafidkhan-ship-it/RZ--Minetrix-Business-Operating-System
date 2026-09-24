import { db } from '../db/database.js';
import { LoadRequest, LoadMatch, FleetVehicle, FleetDriver, TransporterProfile } from '../db/schema.js';
import { routingProvider, smartPricingProvider } from './routingPricingProvider.js';

export interface MatchCandidate {
  vehicle: FleetVehicle;
  driver?: FleetDriver;
  transporter?: TransporterProfile;
  distanceKm: number;
  estimatedTime: string;
  estimatedCost: number;
  offeredPrice: number;
  matchScore: number;
  reasonCodes: string[];
}

export class LoadMatchingProvider {
  /**
   * Scores a single candidate vehicle/driver/transporter against a Load Request.
   */
  public scoreMatch(
    load: LoadRequest,
    vehicle: FleetVehicle,
    driver?: FleetDriver,
    transporter?: TransporterProfile
  ): MatchCandidate {
    const reasonCodes: string[] = [];
    let score = 0;

    // 1. Vehicle Capacity Compatibility (30 points)
    if (vehicle.loadCapacity >= load.quantity) {
      score += 25;
      reasonCodes.push('HIGH_CAPACITY_MATCH');
      if (vehicle.loadCapacity <= load.quantity * 1.25) {
        score += 5; // Optimal sizing, no wasted capacity
      }
    } else {
      score += Math.max(0, Math.round((vehicle.loadCapacity / load.quantity) * 15));
    }

    // 2. Vehicle Type Matching (20 points)
    if (vehicle.vehicleType.toLowerCase() === load.vehicleType.toLowerCase()) {
      score += 20;
      reasonCodes.push('EXACT_VEHICLE_MATCH');
    } else if (vehicle.vehicleType.toLowerCase().includes('tipper') && load.vehicleType.toLowerCase().includes('dumper')) {
      score += 15;
    }

    // 3. Availability & Status (20 points)
    if (vehicle.status === 'AVAILABLE') {
      score += 15;
      reasonCodes.push('AVAILABLE_NOW');
    }
    if (driver && driver.status === 'ACTIVE') {
      score += 5;
    }

    // 4. Distance & Proximity (15 points)
    const distanceInfo = routingProvider.calculateDistance(vehicle.location || 'Quarry Yard', load.source);
    if (distanceInfo.distanceKm <= 15) {
      score += 15;
      reasonCodes.push('NEAR_SOURCE');
    } else if (distanceInfo.distanceKm <= 35) {
      score += 10;
    } else {
      score += 5;
    }

    // 5. Transporter Rating & Performance History (15 points)
    const rating = transporter ? transporter.rating : 4.5;
    if (rating >= 4.8) {
      score += 15;
      reasonCodes.push('GOOD_COMPLETION_HISTORY');
    } else if (rating >= 4.0) {
      score += 10;
    } else {
      score += 5;
    }

    // Pricing calculation
    const priceEst = smartPricingProvider.estimatePrice(
      load.tenantId,
      load.materialId,
      load.quantity,
      load.source,
      load.destination,
      vehicle.vehicleType
    );

    if (priceEst.recommendedPrice <= load.budget) {
      score += 5;
      reasonCodes.push('LOWER_ESTIMATED_COST');
    }

    const matchScore = Math.min(100, Math.max(10, score));

    return {
      vehicle,
      driver,
      transporter,
      distanceKm: priceEst.distanceKm,
      estimatedTime: routingProvider.estimateTravelTime(priceEst.distanceKm, vehicle.vehicleType),
      estimatedCost: priceEst.estimatedCost,
      offeredPrice: priceEst.recommendedPrice,
      matchScore,
      reasonCodes
    };
  }

  /**
   * Finds and ranks suitable vehicle/transporter matches for an OPEN load request.
   */
  public findMatches(tenantId: string, load: LoadRequest): MatchCandidate[] {
    // Query tenant-scoped available vehicles
    const tenantVehicles = Array.from(db.fleetVehicles.values()).filter(
      v => v.tenantId === tenantId && (v.status === 'AVAILABLE' || v.status === 'ASSIGNED')
    );

    const tenantDrivers = Array.from(db.fleetDrivers.values()).filter(
      d => d.tenantId === tenantId && d.status === 'ACTIVE'
    );

    const tenantTransporters = Array.from(db.transporterProfiles.values()).filter(
      t => t.tenantId === tenantId && t.verifiedStatus === 'VERIFIED'
    );

    const defaultTransporter = tenantTransporters[0];
    const defaultDriver = tenantDrivers[0];

    const candidates: MatchCandidate[] = tenantVehicles.map(v => {
      const driver = tenantDrivers.find(d => d.id === v.id) || defaultDriver;
      const transporter = tenantTransporters.find(t => t.vehicleTypes.includes(v.vehicleType)) || defaultTransporter;
      return this.scoreMatch(load, v, driver, transporter);
    });

    return this.rankMatches(candidates);
  }

  /**
   * Ranks matches descending by score.
   */
  public rankMatches(candidates: MatchCandidate[]): MatchCandidate[] {
    return candidates.sort((a, b) => b.matchScore - a.matchScore);
  }
}

export const loadMatchingProvider = new LoadMatchingProvider();
