export interface LoadPostItem {
  id: string;
  loadNo: string;
  materialType: 'Laterite Stone' | 'Washed M-Sand' | 'Plastering P-Sand' | '20mm Aggregate' | '40mm Sub-Base Metal' | 'Cement Bags' | 'TMT Steel Rebars';
  category: 'Mining Quarry' | 'Crusher Plant' | 'Building Material Supplier' | 'Construction Project';
  weightTons: number;
  volumeCuM: number;
  pickupLocation: string;
  pickupGps: { lat: number; lng: number };
  destinationLocation: string;
  destinationGps: { lat: number; lng: number };
  loadingDate: string;
  loadingTime: string;
  priority: 'Emergency Instant' | 'High Express' | 'Standard Delivery';
  requiredVehicleType: 'Heavy Tipper (10-Wheeler)' | 'Multi-Axle Trailer (18-Wheeler)' | 'Commercial Pickup' | 'Low-Bed Machinery Carrier';
  offeredPriceRs: number;
  advancePaymentRs: number;
  status: 'AVAILABLE' | 'BIDDING_OPEN' | 'BOOKED' | 'IN_TRANSIT' | 'DELIVERED_POD' | 'COMPLETED';
  postedBy: string;
  consignorPhone: string;
  bidsCount: number;
}

export interface LoadBidRecord {
  bidId: string;
  loadId: string;
  bidderType: 'Fleet Company' | 'Vehicle Owner' | 'Transport Agency';
  bidderName: string;
  bidderPhone: string;
  bidderRating: number; // e.g. 4.9
  proposedFreightRs: number;
  offeredVehicleReg: string;
  driverName: string;
  estimatedTransitTimeHours: number;
  bidStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  aiRankScore: number; // e.g. 98/100
}

export interface ReturnLoadBackhaulMatch {
  matchId: string;
  emptyReturnVehicleReg: string;
  driverName: string;
  currentUnloadLocation: string;
  homeDepotLocation: string;
  matchedLoadNo: string;
  materialName: string;
  pickupDistanceKm: number;
  potentialFuelSavingsRs: number;
  extraFreightProfitRs: number;
  aiMatchConfidence: number; // e.g. 96.5%
}

export interface FreightMarketplaceAnalytics {
  totalActiveLoadsCount: number;
  totalTonnageInTransit: number;
  totalFreightVolumeRs: number;
  emptyReturnTripReductionPercent: number;
  averageFreightPerTonRs: number;
  topPerformingRoute: string;
  aiSuggestedFairFreightRateRs: number;
}

export const MOCK_LOAD_POSTINGS: LoadPostItem[] = [
  {
    id: 'LOAD-2026-101',
    loadNo: 'LD-MNT-8801',
    materialType: 'Washed M-Sand',
    category: 'Crusher Plant',
    weightTons: 32.5,
    volumeCuM: 21.6,
    pickupLocation: 'Central Crusher Plant #1, Bantwal Quarry Zone',
    pickupGps: { lat: 12.8941, lng: 75.0210 },
    destinationLocation: 'Shri Balaji Villa Construction Site, Mangalore',
    destinationGps: { lat: 12.9141, lng: 74.8560 },
    loadingDate: '2026-08-07',
    loadingTime: '09:30 AM',
    priority: 'High Express',
    requiredVehicleType: 'Heavy Tipper (10-Wheeler)',
    offeredPriceRs: 8500,
    advancePaymentRs: 3000,
    status: 'BIDDING_OPEN',
    postedBy: 'Bantwal Crusher Operations Unit',
    consignorPhone: '+91 98450 11223',
    bidsCount: 4
  },
  {
    id: 'LOAD-2026-102',
    loadNo: 'LD-MNT-8802',
    materialType: 'Laterite Stone',
    category: 'Mining Quarry',
    weightTons: 28.0,
    volumeCuM: 18.0,
    pickupLocation: 'Bantwal Laterite Bench #3',
    pickupGps: { lat: 12.8800, lng: 75.0300 },
    destinationLocation: 'Highway Smart Depot, Udupi Corridor',
    destinationGps: { lat: 13.3409, lng: 74.7421 },
    loadingDate: '2026-08-07',
    loadingTime: '11:00 AM',
    priority: 'Standard Delivery',
    requiredVehicleType: 'Heavy Tipper (10-Wheeler)',
    offeredPriceRs: 7200,
    advancePaymentRs: 2500,
    status: 'IN_TRANSIT',
    postedBy: 'Coastal Laterite Mining Ltd',
    consignorPhone: '+91 94481 22334',
    bidsCount: 2
  },
  {
    id: 'LOAD-2026-103',
    loadNo: 'LD-MNT-8803',
    materialType: '20mm Aggregate',
    category: 'Building Material Supplier',
    weightTons: 42.0,
    volumeCuM: 28.0,
    pickupLocation: 'Central Aggregate Stockyard #2',
    pickupGps: { lat: 12.9100, lng: 74.9800 },
    destinationLocation: 'Panambur Port Trust Expansion Yard',
    destinationGps: { lat: 12.9500, lng: 74.8100 },
    loadingDate: '2026-08-07',
    loadingTime: '01:00 PM',
    priority: 'Emergency Instant',
    requiredVehicleType: 'Multi-Axle Trailer (18-Wheeler)',
    offeredPriceRs: 12800,
    advancePaymentRs: 5000,
    status: 'AVAILABLE',
    postedBy: 'Mangalore Building Materials Hub',
    consignorPhone: '+91 97312 88440',
    bidsCount: 6
  }
];

export const MOCK_LOAD_BIDS: LoadBidRecord[] = [
  {
    bidId: 'BID-901',
    loadId: 'LOAD-2026-101',
    bidderType: 'Fleet Company',
    bidderName: 'Karavali Mining Logistics Pvt Ltd',
    bidderPhone: '+91 98800 44112',
    bidderRating: 4.9,
    proposedFreightRs: 8200,
    offeredVehicleReg: 'KA-19-AB-4491',
    driverName: 'Suresh Kumar',
    estimatedTransitTimeHours: 1.5,
    bidStatus: 'PENDING',
    aiRankScore: 98
  },
  {
    bidId: 'BID-902',
    loadId: 'LOAD-2026-101',
    bidderType: 'Vehicle Owner',
    bidderName: 'Santhosh Transport (Attached Partner)',
    bidderPhone: '+91 94490 88221',
    bidderRating: 4.7,
    proposedFreightRs: 8400,
    offeredVehicleReg: 'KA-20-C-9912',
    driverName: 'Ramesh Naik',
    estimatedTransitTimeHours: 1.8,
    bidStatus: 'PENDING',
    aiRankScore: 91
  }
];

export const MOCK_RETURN_BACKHAUL_MATCHES: ReturnLoadBackhaulMatch[] = [
  {
    matchId: 'BKH-401',
    emptyReturnVehicleReg: 'KA-19-MC-8812 (Ashok Leyland 5525)',
    driverName: 'Vikram Singh',
    currentUnloadLocation: 'Udupi Highway Site (Delivered Aggregate)',
    homeDepotLocation: 'Bantwal Quarry Base Yard',
    matchedLoadNo: 'LD-MNT-8809 (Clinker Bags)',
    materialName: 'Raw Cement Clinker Bags',
    pickupDistanceKm: 4.2,
    potentialFuelSavingsRs: 3800,
    extraFreightProfitRs: 6400,
    aiMatchConfidence: 97.4
  },
  {
    matchId: 'BKH-402',
    emptyReturnVehicleReg: 'KA-19-AB-4491 (BharatBenz Tipper)',
    driverName: 'Suresh Kumar',
    currentUnloadLocation: 'Panambur Port Terminal',
    homeDepotLocation: 'Central Crusher #1',
    matchedLoadNo: 'LD-MNT-8812 (M-Sand Return)',
    materialName: 'River Sand Blend Aggregate',
    pickupDistanceKm: 2.8,
    potentialFuelSavingsRs: 2900,
    extraFreightProfitRs: 5200,
    aiMatchConfidence: 95.8
  }
];

export const MOCK_MARKETPLACE_ANALYTICS: FreightMarketplaceAnalytics = {
  totalActiveLoadsCount: 148,
  totalTonnageInTransit: 4280.5,
  totalFreightVolumeRs: 3840000,
  emptyReturnTripReductionPercent: 34.2,
  averageFreightPerTonRs: 685,
  topPerformingRoute: 'Bantwal Quarry Zone ➔ Panambur Port Terminal',
  aiSuggestedFairFreightRateRs: 672
};
