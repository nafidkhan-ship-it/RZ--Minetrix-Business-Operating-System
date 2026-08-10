export interface BusinessModelSpec {
  id: string;
  name: string;
  description: string;
  supportedProducts: string[];
  keyProcessWorkflows: string[];
  defaultRoyaltyType: string;
  isConfigurable: boolean;
}

export interface BuildingMaterialItem {
  id: string;
  code: string;
  name: string;
  category: 'Quarry Stone' | 'Crushed Aggregate' | 'Sand Product' | 'Manufactured Block' | 'Construction Hardware';
  unitOfMeasure: 'Ton' | 'CFT' | 'Piece' | 'Bag' | 'Meter' | 'Kg';
  densityTonPerCft: number;
  stockInHand: number;
  unitPriceGstExcl: number;
  gstPercent: number;
  liveAvailabilityStatus: 'In Stock' | 'Low Stock' | 'Production On Order';
}

export interface PublicCustomerOrder {
  orderId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  materialName: string;
  quantityOrdered: number;
  uom: string;
  totalPriceGstIncl: number;
  orderStatus: 'QUOTATION_REQUESTED' | 'BOOKED' | 'IN_TRANSIT' | 'DELIVERED';
  assignedVehicleNo: string;
  liveGpsCoordinates: { lat: number; lng: number };
  estimatedDeliveryTime: string;
}

export interface LateriteStoneProductionEntry {
  cuttingRegisterId: string;
  quarrySiteName: string;
  stoneGrade: 'Grade A (Structural)' | 'Grade B (Standard Wall)' | 'Grade C (Partition)';
  dimensionsCm: string; // e.g. "30 x 20 x 15 cm"
  piecesCutToday: number;
  freeBonusPiecesCount: number;
  dressingWastePercent: number;
  calculatedTonnageEquivalent: number;
  operatorName: string;
  machineId: string; // Laterite cutter machine ID
}

export interface CrusherShiftProductionLog {
  logId: string;
  shiftName: 'Day Shift (06:00 - 18:00)' | 'Night Shift (18:00 - 06:00)';
  crusherPlantName: 'Primary Jaw & Secondary Cone Plant #1';
  rawFeedBoulderTons: number;
  produced40mmTons: number;
  produced20mmTons: number;
  produced12mmTons: number;
  produced6mmTons: number;
  producedMSandTons: number;
  producedPSandTons: number;
  producedCrusherDustTons: number;
  downtimeMinutes: number;
  powerConsumptionKwh: number;
  dieselBurnLiters: number;
}

export interface LandOwnerRecord {
  id: string;
  ownerName: string;
  surveyNo: string;
  villageTaluk: string;
  acreage: number;
  royaltyTerms: string;
  revenueSharePercent: number;
  expiryDate: string;
  status: 'ACTIVE' | 'PENDING_RENEWAL';
}

export interface EquipmentRentalListing {
  id: string;
  machineType: 'Excavator 20T' | 'JCB 3DX' | 'Jaw Crusher 150 TPH' | 'Wheel Loader 3T' | 'Rock Breaker';
  modelName: string;
  hourlyRate: number;
  operatorIncluded: boolean;
  availabilityStatus: 'AVAILABLE' | 'ON_LEASE' | 'MAINTENANCE';
  currentLocation: string;
}

export interface UsedMarketplaceItem {
  id: string;
  title: string;
  category: 'Quarry Cutter' | 'Heavy Excavator' | 'Dump Truck' | 'Crusher Screen';
  year: number;
  operatingHours: number;
  askingPrice: number;
  certifiedInspectionScore: number; // e.g. 94/100
  sellerLocation: string;
}

export interface QualityTestLog {
  id: string;
  batchNo: string;
  materialType: string;
  flakinessIndexPercent: number;
  crushingValuePercent: number;
  finenessModulus: number;
  sievePassPercent75m: number;
  labStatus: 'PASSED_IS_2386' | 'REJECTED' | 'TESTING';
}

export interface SafetyIncidentRecord {
  id: string;
  incidentType: 'Near Miss' | 'Equipment Minor Scratch' | 'Dust Alert' | 'PPE Warning';
  location: string;
  reportedDate: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  correctiveAction: string;
}

export interface ConstructionBOQItem {
  id: string;
  projectName: string;
  clientType: 'Residential House' | 'Commercial Complex' | 'Road Sub-Base';
  requiredMSandTons: number;
  required20mmTons: number;
  requiredLateritePieces: number;
  requiredCementBags: number;
  estimatedTotalCost: number;
  materialFulfillmentPercent: number;
}

export interface DroneStockpileSurvey {
  id: string;
  stockpileId: string;
  materialName: string;
  surveyDate: string;
  calculatedVolumeCuM: number;
  estimatedTonnage: number;
  accuracyPercent: number; // e.g. 99.4%
  dronePilot: string;
}

export const MINING_BUSINESS_TYPES: BusinessModelSpec[] = [
  {
    id: 'laterite-quarry',
    name: 'Laterite Stone Quarry',
    description: 'Specialized quarry operations for laterite stone cutting, sizing, piece counting, and direct building site dispatch.',
    supportedProducts: ['Laterite Stone Grade A (30x20x15)', 'Laterite Stone Grade B (30x15x15)', 'Laterite Waste Dressing Powder'],
    keyProcessWorkflows: ['Wire/Blade Cutting Log', 'Piece Counting & Bonus Free Pieces', 'Site Direct Gatepass Dispatch'],
    defaultRoyaltyType: 'Per 1000 Pieces or Per CFT',
    isConfigurable: true
  },
  {
    id: 'granite-quarry',
    name: 'Granite Dimensional Stone Quarry',
    description: 'High-precision wire-saw slicing, gangsaw block recovery, block numbering, and export-grade stone sorting.',
    supportedProducts: ['Granite Rough Block Grade-1', 'Granite Slabs', 'Monumental Blocks'],
    keyProcessWorkflows: ['Bench Slicing Register', 'Block Numbering & QC Defect Tagging', 'Heavy Crane Loading Gatepass'],
    defaultRoyaltyType: 'Per Cubic Meter (m³)',
    isConfigurable: true
  },
  {
    id: 'hardrock-crusher-unit',
    name: 'Hard Rock Quarry & Crusher Plant Unit',
    description: 'Integrated drill-and-blast hard rock excavation feeding primary jaw crushers, VSI impactors, and sand washing units.',
    supportedProducts: ['40mm Metal', '20mm Metal', '12mm Metal', '6mm Metal', 'M-Sand (Washed)', 'P-Sand', 'Crusher Dust'],
    keyProcessWorkflows: ['Explosive Permit & Blasting Log', 'Primary Jaw Crusher Feed Log', 'VSI Sand Washing Register', 'Weighbridge Automated Ticket'],
    defaultRoyaltyType: 'Per Metric Ton (MT)',
    isConfigurable: true
  },
  {
    id: 'crusher-building-materials',
    name: 'Integrated Crusher & Building Material Depot',
    description: 'Comprehensive mining and construction supply depot stocking crushed aggregates, M-Sand, cement, TMT steel, and hollow blocks.',
    supportedProducts: ['Aggregates', 'M-Sand', 'P-Sand', 'Cement Bags', 'TMT Rebars (8mm-32mm)', 'Hollow Concrete Blocks', 'Paver Blocks'],
    keyProcessWorkflows: ['Multi-Category Stock Inventory', 'Public Customer Booking Portal', 'Combined Invoice & E-Way Bill Dispatch'],
    defaultRoyaltyType: 'Composite Multi-Product Tariff',
    isConfigurable: true
  }
];

export const BUILDING_MATERIALS_CATALOG: BuildingMaterialItem[] = [
  { id: 'bm-01', code: 'MAT-LAT-3015', name: 'Laterite Stone Grade A (30x20x15 cm)', category: 'Quarry Stone', unitOfMeasure: 'Piece', densityTonPerCft: 0.052, stockInHand: 42500, unitPriceGstExcl: 42.0, gstPercent: 5.0, liveAvailabilityStatus: 'In Stock' },
  { id: 'bm-02', code: 'MAT-AGG-20MM', name: '20mm Crushed Blue Metal Aggregate', category: 'Crushed Aggregate', unitOfMeasure: 'Ton', densityTonPerCft: 0.045, stockInHand: 1240.5, unitPriceGstExcl: 680.0, gstPercent: 5.0, liveAvailabilityStatus: 'In Stock' },
  { id: 'bm-03', code: 'MAT-AGG-40MM', name: '40mm Crushed Metal (Sub-Base)', category: 'Crushed Aggregate', unitOfMeasure: 'Ton', densityTonPerCft: 0.046, stockInHand: 890.0, unitPriceGstExcl: 620.0, gstPercent: 5.0, liveAvailabilityStatus: 'In Stock' },
  { id: 'bm-04', code: 'MAT-SND-MSAND', name: 'Washed Manufactured Sand (M-Sand Concrete Grade)', category: 'Sand Product', unitOfMeasure: 'Ton', densityTonPerCft: 0.048, stockInHand: 3100.0, unitPriceGstExcl: 750.0, gstPercent: 5.0, liveAvailabilityStatus: 'In Stock' },
  { id: 'bm-05', code: 'MAT-SND-PSAND', name: 'Plastering Manufactured Sand (P-Sand Fine)', category: 'Sand Product', unitOfMeasure: 'Ton', densityTonPerCft: 0.047, stockInHand: 1850.0, unitPriceGstExcl: 880.0, gstPercent: 5.0, liveAvailabilityStatus: 'In Stock' },
  { id: 'bm-06', code: 'MAT-BLK-HOL6IN', name: 'Concrete Hollow Block (6 Inch Heavy Duty)', category: 'Manufactured Block', unitOfMeasure: 'Piece', densityTonPerCft: 0.018, stockInHand: 8500, unitPriceGstExcl: 38.0, gstPercent: 12.0, liveAvailabilityStatus: 'In Stock' },
  { id: 'bm-07', code: 'MAT-CMT-PPC50', name: 'Portland Pozzolana Cement (50kg Bag)', category: 'Construction Hardware', unitOfMeasure: 'Bag', densityTonPerCft: 0.050, stockInHand: 1200, unitPriceGstExcl: 360.0, gstPercent: 28.0, liveAvailabilityStatus: 'In Stock' },
  { id: 'bm-08', code: 'MAT-STL-TMT12', name: 'Fe-550D TMT Steel Rebar 12mm', category: 'Construction Hardware', unitOfMeasure: 'Ton', densityTonPerCft: 0.22, stockInHand: 45.2, unitPriceGstExcl: 54000.0, gstPercent: 18.0, liveAvailabilityStatus: 'In Stock' }
];

export const MOCK_PUBLIC_ORDERS: PublicCustomerOrder[] = [
  {
    orderId: 'ORD-2026-8801',
    customerName: 'Shri Balaji Builders & Developers',
    customerPhone: '+91 98765 43210',
    deliveryAddress: 'Site #42, Green Valley Villa Project, Mangalore',
    materialName: 'Washed Manufactured Sand (M-Sand)',
    quantityOrdered: 32.5,
    uom: 'Ton',
    totalPriceGstIncl: 25593.75,
    orderStatus: 'IN_TRANSIT',
    assignedVehicleNo: 'KA-19-AB-4491',
    liveGpsCoordinates: { lat: 12.9141, lng: 74.8560 },
    estimatedDeliveryTime: '35 Mins (Arriving at 11:15 AM)'
  },
  {
    orderId: 'ORD-2026-8802',
    customerName: 'Kiran House Construction',
    customerPhone: '+91 94481 12233',
    deliveryAddress: 'Plot #18, Highway View, Udupi',
    materialName: 'Laterite Stone Grade A (30x20x15 cm)',
    quantityOrdered: 1200,
    uom: 'Piece',
    totalPriceGstIncl: 52920.0,
    orderStatus: 'BOOKED',
    assignedVehicleNo: 'KA-20-C-9912',
    liveGpsCoordinates: { lat: 13.3409, lng: 74.7421 },
    estimatedDeliveryTime: 'Scheduled Loading at 02:00 PM'
  }
];

export const MOCK_LATERITE_CUTTING_LOGS: LateriteStoneProductionEntry[] = [
  { cuttingRegisterId: 'LAT-REG-104', quarrySiteName: 'Bantwal Quarry Bench #2', stoneGrade: 'Grade A (Structural)', dimensionsCm: '30 x 20 x 15 cm', piecesCutToday: 1850, freeBonusPiecesCount: 50, dressingWastePercent: 4.2, calculatedTonnageEquivalent: 98.8, operatorName: 'Suresh Gowda', machineId: 'CUTTER-LAT-04' },
  { cuttingRegisterId: 'LAT-REG-105', quarrySiteName: 'Bantwal Quarry Bench #3', stoneGrade: 'Grade B (Standard Wall)', dimensionsCm: '30 x 15 x 15 cm', piecesCutToday: 2400, freeBonusPiecesCount: 60, dressingWastePercent: 5.1, calculatedTonnageEquivalent: 96.0, operatorName: 'Ramesh Naik', machineId: 'CUTTER-LAT-02' }
];

export const MOCK_CRUSHER_SHIFT_LOGS: CrusherShiftProductionLog = {
  logId: 'CRSH-SHIFT-2026-08-07-DAY',
  shiftName: 'Day Shift (06:00 - 18:00)',
  crusherPlantName: 'Primary Jaw & Secondary Cone Plant #1',
  rawFeedBoulderTons: 1450.0,
  produced40mmTons: 320.0,
  produced20mmTons: 410.0,
  produced12mmTons: 220.0,
  produced6mmTons: 110.0,
  producedMSandTons: 260.0,
  producedPSandTons: 85.0,
  producedCrusherDustTons: 45.0,
  downtimeMinutes: 18,
  powerConsumptionKwh: 1840,
  dieselBurnLiters: 142.5
};

export const MOCK_LAND_OWNERS: LandOwnerRecord[] = [
  { id: 'LO-101', ownerName: 'Santhosh Shetty & Brothers', surveyNo: '142/1A, 142/1B', villageTaluk: 'Bantwal, Dakshina Kannada', acreage: 14.5, royaltyTerms: '₹4.50 per Piece / ₹85 per Ton', revenueSharePercent: 8.5, expiryDate: '2031-12-31', status: 'ACTIVE' },
  { id: 'LO-102', ownerName: 'Karkala Agricultural Trust', surveyNo: '88/4', villageTaluk: 'Karkala, Udupi', acreage: 22.0, royaltyTerms: 'Fixed Monthly Lease ₹1,20,000 + ₹12/Ton', revenueSharePercent: 5.0, expiryDate: '2028-06-30', status: 'ACTIVE' }
];

export const MOCK_EQUIPMENT_RENTALS: EquipmentRentalListing[] = [
  { id: 'RENT-01', machineType: 'Excavator 20T', modelName: 'CAT 320D3 Heavy Duty', hourlyRate: 2400, operatorIncluded: true, availabilityStatus: 'AVAILABLE', currentLocation: 'Quarry Site #2, Bantwal' },
  { id: 'RENT-02', machineType: 'Rock Breaker', modelName: 'FURUKAWA F35 Breaker Unit', hourlyRate: 3100, operatorIncluded: true, availabilityStatus: 'ON_LEASE', currentLocation: 'Highway Project Km 48' },
  { id: 'RENT-03', machineType: 'Jaw Crusher 150 TPH', modelName: 'TEREX Pegson Mobile Crusher', hourlyRate: 8500, operatorIncluded: true, availabilityStatus: 'AVAILABLE', currentLocation: 'Central Stockyard' }
];

export const MOCK_USED_MARKETPLACE: UsedMarketplaceItem[] = [
  { id: 'MKT-8801', title: '2022 CAT 320D Heavy Excavator with Rock Piping', category: 'Heavy Excavator', year: 2022, operatingHours: 4200, askingPrice: 4850000, certifiedInspectionScore: 94, sellerLocation: 'Mangalore' },
  { id: 'MKT-8802', title: 'Laterite High-Speed Track Cutter Machine 120mm Blade', category: 'Quarry Cutter', year: 2023, operatingHours: 1150, askingPrice: 820000, certifiedInspectionScore: 98, sellerLocation: 'Udupi' }
];

export const MOCK_QUALITY_LOGS: QualityTestLog[] = [
  { id: 'QC-2026-101', batchNo: 'BATCH-MSAND-0807-A', materialType: 'Washed M-Sand', flakinessIndexPercent: 12.4, crushingValuePercent: 18.2, finenessModulus: 2.82, sievePassPercent75m: 3.1, labStatus: 'PASSED_IS_2386' },
  { id: 'QC-2026-102', batchNo: 'BATCH-20MM-0807-B', materialType: '20mm Aggregate', flakinessIndexPercent: 14.1, crushingValuePercent: 19.5, finenessModulus: 6.80, sievePassPercent75m: 0.8, labStatus: 'PASSED_IS_2386' }
];

export const MOCK_SAFETY_LOGS: SafetyIncidentRecord[] = [
  { id: 'SAF-001', incidentType: 'Dust Alert', location: 'Secondary Cone Crusher #2', reportedDate: '2026-08-06', severity: 'LOW', correctiveAction: 'High-pressure mist water nozzle unblocked & pressure restored.' },
  { id: 'SAF-002', incidentType: 'PPE Warning', location: 'Bench #3 Loading Area', reportedDate: '2026-08-05', severity: 'LOW', correctiveAction: 'Safety helmet & high-vis vest issued to visiting truck driver.' }
];

export const MOCK_BOQ_PROJECTS: ConstructionBOQItem[] = [
  { id: 'BOQ-401', projectName: 'Green Valley Luxury Villa Colony (40 Units)', clientType: 'Residential House', requiredMSandTons: 840, required20mmTons: 620, requiredLateritePieces: 45000, requiredCementBags: 3200, estimatedTotalCost: 3840000, materialFulfillmentPercent: 68 },
  { id: 'BOQ-402', projectName: 'National Highway 66 Bypass Expansion Sub-Base', clientType: 'Road Sub-Base', requiredMSandTons: 4200, required20mmTons: 8900, requiredLateritePieces: 0, requiredCementBags: 0, estimatedTotalCost: 9150000, materialFulfillmentPercent: 42 }
];

export const MOCK_DRONE_SURVEYS: DroneStockpileSurvey[] = [
  { id: 'DRN-2026-01', stockpileId: 'STK-AGG-20MM', materialName: '20mm Blue Metal', surveyDate: '2026-08-05', calculatedVolumeCuM: 827.0, estimatedTonnage: 1240.5, accuracyPercent: 99.4, dronePilot: 'Capt. Vikram Singh (LiDAR Spec)' },
  { id: 'DRN-2026-02', stockpileId: 'STK-MSAND-WASHED', materialName: 'Washed M-Sand', surveyDate: '2026-08-05', calculatedVolumeCuM: 2066.6, estimatedTonnage: 3100.0, accuracyPercent: 99.6, dronePilot: 'Capt. Vikram Singh (LiDAR Spec)' }
];
