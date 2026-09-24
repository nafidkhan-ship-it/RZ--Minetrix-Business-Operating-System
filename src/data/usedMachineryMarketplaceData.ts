// RZ® MINETRIX — Platform 6: Used Machinery & Vehicle Marketplace
// Studio Preview / Demo Data (Realistic heavy earthmoving, quarry plants, and commercial vehicles)

export type ListingCategory = 'Machinery' | 'Commercial Vehicles' | 'Quarry / Crusher Equipment';

export type EquipmentType =
  // Machinery
  | 'Excavators'
  | 'Wheel Loaders'
  | 'Backhoe Loaders'
  | 'Jaw Crushers'
  | 'Cone Crushers'
  | 'VSI'
  | 'Screening Plants'
  | 'Drilling Machines'
  | 'Hydraulic Breakers'
  | 'Generators'
  | 'Compressors'
  | 'Other Machinery'
  // Commercial Vehicles
  | 'Tippers'
  | 'Trucks'
  | 'Trailers'
  | 'Tankers'
  | 'Pickup Vehicles'
  | 'Heavy Vehicles'
  | 'Other Commercial Vehicles'
  // Quarry / Crusher Equipment
  | 'Crusher Plants'
  | 'Conveyor Systems'
  | 'Feeders'
  | 'Screens'
  | 'Hoppers'
  | 'Motors'
  | 'Spare Equipment'
  | 'Other Equipment';

export type MachineCondition = 'Excellent' | 'Good' | 'Fair' | 'Refurbished' | 'Needs Overhaul';
export type PriceType = 'Fixed' | 'Negotiable' | 'Price on Request';
export type ListingStatus = 'Draft' | 'Pending Review' | 'Published' | 'Paused' | 'Under Deal' | 'Sold' | 'Expired';
export type InspectionStatus = 'None' | 'Requested' | 'Scheduled' | 'In Progress' | 'Completed' | 'Report Available';

export interface MachineryListing {
  id: string;
  listingCode: string;
  title: string;
  category: ListingCategory;
  type: EquipmentType;
  brand: string;
  model: string;
  year: number;
  hoursWorked?: number;
  odometerKm?: number;
  registrationNumber?: string;
  locationState: string;
  locationDistrict: string;
  locationCity: string;
  condition: MachineCondition;
  askingPriceRs: number;
  priceType: PriceType;
  minimumAcceptablePriceRs?: number; // Private to seller, never shown publicly
  financeAvailable: boolean;
  paymentTerms: string;
  // Technical Specifications
  engineMakeModel: string;
  enginePowerHp: string;
  operatingWeightTons: number;
  bucketOrPayloadCapacity: string;
  fuelType: 'Diesel' | 'Electric' | 'Dual';
  productionCapacity?: string; // e.g. "180 TPH"
  chassisSerialNumber: string;
  overallDimensions?: string;
  // Documentation Status
  hasRcRegistration: boolean;
  hasInsurance: boolean;
  insuranceValidTill?: string;
  hasFitness: boolean;
  fitnessValidTill?: string;
  hasPollutionTax: boolean;
  hasNocClearance: boolean;
  hasServiceRecords: boolean;
  ownershipCount: number; // 1st owner, 2nd owner
  // Verification & Inspection
  inspectionStatus: InspectionStatus;
  inspectionReportId?: string;
  inspectionScore?: string; // Factual inspection finding summary, e.g. "48-pt Mechanical Pass"
  // Seller Dossier
  sellerId: string;
  sellerName: string;
  sellerBusiness: string;
  sellerType: 'Quarry Owner' | 'Crusher Operator' | 'Fleet Contractor' | 'Authorized Dealer' | 'Individual Contractor';
  sellerPhone: string;
  sellerCity: string;
  sellerRating: number;
  sellerTotalListings: number;
  // Media
  featuredImage: string;
  galleryImages: string[];
  hasVideo: boolean;
  // Engagement
  viewsCount: number;
  enquiriesCount: number;
  offersCount: number;
  postedDate: string;
  featured: boolean;
}

export interface MarketplaceEnquiry {
  id: string;
  enquiryCode: string;
  listingId: string;
  listingTitle: string;
  listingPriceRs: number;
  listingCategory: ListingCategory;
  buyerName: string;
  buyerCompany: string;
  buyerPhone: string;
  buyerLocation: string;
  date: string;
  message: string;
  requirementUrgency: 'Immediate (Within 7 Days)' | 'Next 30 Days' | 'Exploring Options';
  status: 'New' | 'Contacted' | 'Negotiation' | 'Inspection' | 'Offer' | 'Closed';
  sellerName: string;
}

export interface OfferNegotiationItem {
  id: string;
  date: string;
  by: 'Buyer' | 'Seller';
  amountRs: number;
  terms: string;
  notes: string;
}

export interface MarketplaceOffer {
  id: string;
  offerCode: string;
  listingId: string;
  listingTitle: string;
  askingPriceRs: number;
  offeredAmountRs: number;
  buyerName: string;
  buyerCompany: string;
  buyerPhone: string;
  sellerName: string;
  paymentTerms: string;
  deliveryPreference: 'Buyer Pickup' | 'RZ Vehicle Fleet Delivery' | 'Seller Arranged';
  pickupLocation: string;
  deliveryDestination?: string;
  status: 'Submitted' | 'Viewed' | 'Counter Offer' | 'Negotiation' | 'Accepted' | 'Rejected' | 'Expired';
  submittedDate: string;
  validUntil: string;
  history: OfferNegotiationItem[];
}

export interface InspectionChecklistItem {
  name: string;
  category: 'Engine' | 'Hydraulics' | 'Mechanical' | 'Structural' | 'Documentation';
  status: 'Good' | 'Satisfactory' | 'Attention Required' | 'Not Applicable';
  remarks: string;
}

export interface MarketplaceInspection {
  id: string;
  inspectionCode: string;
  listingId: string;
  listingTitle: string;
  machineBrandModel: string;
  serialNumber: string;
  type: 'Buyer Requested' | 'Seller Requested' | 'Pre-Listing Certification';
  inspectorName: string;
  inspectorAgency: string;
  date: string;
  location: string;
  status: 'Requested' | 'Scheduled' | 'In Progress' | 'Completed' | 'Report Available' | 'Cancelled';
  engineFindings: string;
  hydraulicFindings: string;
  mechanicalFindings: string;
  structuralFindings: string;
  documentationFindings: string;
  checklist: InspectionChecklistItem[];
  testDriveNotes: string;
  recommendedRepairs: string;
  estimatedImmediateMaintenanceCostRs: number;
  certifiedWorkingHours: number;
}

export interface MarketplaceDeal {
  id: string;
  dealCode: string;
  listingId: string;
  listingTitle: string;
  listingCategory: ListingCategory;
  buyerName: string;
  buyerCompany: string;
  buyerContact: string;
  sellerName: string;
  sellerCompany: string;
  sellerContact: string;
  agreedPriceRs: number;
  dealDate: string;
  paymentTerms: string;
  advancePaidRs: number;
  balancePayableRs: number;
  paymentStatus: 'Advance Received' | 'Escrow Secured' | 'Fully Paid' | 'Refunded';
  documentsStatus: 'Documents In Review' | 'RC Transfer Initiated' | 'RTO Endorsement Completed' | 'All Documents Handed Over';
  deliveryMode: 'Buyer Self-Pickup' | 'RZ Heavy Trailer Fleet Dispatch';
  deliveryStatus: 'Pending Dispatch' | 'Trailer Assigned' | 'In Transit' | 'Delivered On-Site' | 'Completed';
  assignedTrailerNumber?: string;
  driverName?: string;
  driverPhone?: string;
  status: 'Deal Created' | 'Payment In Progress' | 'RTO Documentation' | 'Transport In Transit' | 'Completed' | 'Cancelled';
  timeline: { date: string; title: string; notes: string }[];
}

export interface MarketplacePaymentRecord {
  id: string;
  paymentCode: string;
  dealId: string;
  dealCode: string;
  partyName: string;
  paymentType: 'Advance Escrow' | 'Part Payment' | 'Final Balance Settlement' | 'Inspection Fee' | 'Transport Freight Charge';
  amountRs: number;
  paymentMethod: 'RTGS / NEFT Bank Transfer' | 'Direct Escrow Account' | 'Demand Draft' | 'UPI' | 'Cheque';
  referenceId: string;
  date: string;
  status: 'Settled & Verified' | 'Pending Bank Clearance' | 'Processing';
  receiptNumber: string;
}

export interface DealDocumentItem {
  id: string;
  dealCode: string;
  title: string;
  documentType: 'Original RC Book' | 'RTO Form 29 & 30' | 'Comprehensive Insurance Policy' | 'Commercial Tax Clearance' | 'Mining Concession Permit' | 'Pollution Under Control' | 'Commercial Fitness Certificate' | 'Notarized Sale Agreement' | 'Payment Proof';
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  status: 'Pending' | 'Uploaded' | 'Reviewed' | 'Approved' | 'Rejected';
  verifiedBy?: string;
}

// -------------------------------------------------------------
// SAMPLE DATASETS (Studio Preview / Demo Data)
// -------------------------------------------------------------

export const MARKETPLACE_KPIS = {
  activeListings: 68,
  machineryListings: 38,
  vehicleListings: 18,
  equipmentListings: 12,
  newListingsToday: 4,
  newEnquiries: 46,
  activeDeals: 11,
  pendingInspections: 7,
  dealsThisMonth: 9,
  totalMarketplaceValueRs: 187400000, // ₹18.74 Cr
  offersPending: 14,
  documentsPending: 6,
  deliveryPending: 5
};

export const MARKETPLACE_CATEGORIES: { id: ListingCategory; name: string; description: string; count: number }[] = [
  {
    id: 'Machinery',
    name: 'Heavy Earthmoving & Processing Machinery',
    description: 'Excavators, wheel loaders, backhoes, jaw & cone crushers, VSI plants, rock drills, and heavy air compressors.',
    count: 38
  },
  {
    id: 'Commercial Vehicles',
    name: 'Commercial Mining & Construction Vehicles',
    description: 'Tippers (6, 10, 12, 14-wheeler), heavy haulage trucks, multi-axle trailers, diesel tankers, and site service pickups.',
    count: 18
  },
  {
    id: 'Quarry / Crusher Equipment',
    name: 'Quarry & Crusher Plant Ancillaries',
    description: 'Stationary aggregate crusher plants, belt conveyor systems, vibrating grizzly feeders, high-frequency screens, and motors.',
    count: 12
  }
];

export const MARKETPLACE_LISTINGS: MachineryListing[] = [
  {
    id: 'LST-MAC-001',
    listingCode: 'RZ-LST-2026-901',
    title: 'Caterpillar 320D Heavy Hydraulic Excavator (20.5 Ton)',
    category: 'Machinery',
    type: 'Excavators',
    brand: 'Caterpillar',
    model: '320D',
    year: 2021,
    hoursWorked: 4820,
    registrationNumber: 'KL-14-EA-4412',
    locationState: 'Kerala',
    locationDistrict: 'Kasaragod',
    locationCity: 'Nileshwaram Quarry Hub',
    condition: 'Excellent',
    askingPriceRs: 4250000,
    priceType: 'Negotiable',
    minimumAcceptablePriceRs: 3950000,
    financeAvailable: true,
    paymentTerms: '20% Advance token, 80% upon technical inspection & RTO NOC handover',
    engineMakeModel: 'Cat C6.4 ACERT Diesel (Direct Injected)',
    enginePowerHp: '148 HP @ 1800 RPM',
    operatingWeightTons: 20.8,
    bucketOrPayloadCapacity: '1.0 m³ Heavy Duty Rock Bucket',
    fuelType: 'Diesel',
    chassisSerialNumber: 'CAT0320DPG099182',
    overallDimensions: '9.46 m × 2.80 m × 3.05 m',
    hasRcRegistration: true,
    hasInsurance: true,
    insuranceValidTill: '2027-02-15',
    hasFitness: true,
    fitnessValidTill: '2027-04-10',
    hasPollutionTax: true,
    hasNocClearance: true,
    hasServiceRecords: true,
    ownershipCount: 1,
    inspectionStatus: 'Report Available',
    inspectionReportId: 'INSP-RZ-401',
    inspectionScore: '48-Point Technical Checklist Passed (92% Health)',
    sellerId: 'SEL-001',
    sellerName: 'K. V. Damodaran Nair',
    sellerBusiness: 'Malabar Mining & Earthmovers Ltd',
    sellerType: 'Quarry Owner',
    sellerPhone: '+91 94471 88200',
    sellerCity: 'Kasaragod',
    sellerRating: 4.9,
    sellerTotalListings: 4,
    featuredImage: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
    ],
    hasVideo: true,
    viewsCount: 342,
    enquiriesCount: 14,
    offersCount: 5,
    postedDate: '2026-09-12',
    featured: true
  },
  {
    id: 'LST-MAC-002',
    listingCode: 'RZ-LST-2026-902',
    title: 'Komatsu PC210-10M0 Heavy Duty Rock Excavator',
    category: 'Machinery',
    type: 'Excavators',
    brand: 'Komatsu',
    model: 'PC210-10M0',
    year: 2022,
    hoursWorked: 3650,
    registrationNumber: 'KA-19-M-7719',
    locationState: 'Karnataka',
    locationDistrict: 'Dakshina Kannada',
    locationCity: 'Mangalore Mining Zone',
    condition: 'Excellent',
    askingPriceRs: 4680000,
    priceType: 'Negotiable',
    minimumAcceptablePriceRs: 4400000,
    financeAvailable: true,
    paymentTerms: 'Flexible milestone payment via verified escrow',
    engineMakeModel: 'Komatsu SAA6D107E-1 Turbocharged',
    enginePowerHp: '165 HP @ 2000 RPM',
    operatingWeightTons: 21.5,
    bucketOrPayloadCapacity: '1.2 m³ Armored Quarry Bucket with Side Cutters',
    fuelType: 'Diesel',
    chassisSerialNumber: 'KMT21010M0-99410',
    hasRcRegistration: true,
    hasInsurance: true,
    insuranceValidTill: '2027-01-20',
    hasFitness: true,
    fitnessValidTill: '2027-03-30',
    hasPollutionTax: true,
    hasNocClearance: true,
    hasServiceRecords: true,
    ownershipCount: 1,
    inspectionStatus: 'Completed',
    inspectionReportId: 'INSP-RZ-402',
    inspectionScore: 'Hydraulic Pressure & Undercarriage Tested',
    sellerId: 'SEL-002',
    sellerName: 'Shekhar Shetty',
    sellerBusiness: 'Coastal Infrastructure & Stone Quarry Hub',
    sellerType: 'Crusher Operator',
    sellerPhone: '+91 98802 33110',
    sellerCity: 'Mangalore',
    sellerRating: 4.8,
    sellerTotalListings: 6,
    featuredImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
    ],
    hasVideo: true,
    viewsCount: 290,
    enquiriesCount: 11,
    offersCount: 4,
    postedDate: '2026-09-15',
    featured: true
  },
  {
    id: 'LST-VEH-003',
    listingCode: 'RZ-LST-2026-903',
    title: 'Ashok Leyland 2820 Tipper (10-Wheeler, 16 MT Payload Box)',
    category: 'Commercial Vehicles',
    type: 'Tippers',
    brand: 'Ashok Leyland',
    model: '2820 6x4 Tipper',
    year: 2023,
    odometerKm: 58400,
    registrationNumber: 'KL-13-AQ-9912',
    locationState: 'Kerala',
    locationDistrict: 'Kannur',
    locationCity: 'Taliparamba Quarry Depot',
    condition: 'Excellent',
    askingPriceRs: 3150000,
    priceType: 'Negotiable',
    minimumAcceptablePriceRs: 2980000,
    financeAvailable: true,
    paymentTerms: 'Bank transfer with immediate RTO online transfer filing',
    engineMakeModel: 'H-Series 6-Cylinder i-Gen6 BS-VI Engine',
    enginePowerHp: '200 HP @ 2400 RPM',
    operatingWeightTons: 28.0,
    bucketOrPayloadCapacity: '16 m³ Rock Body Tipper Box',
    fuelType: 'Diesel',
    chassisSerialNumber: 'AL28206X4-KL1388102',
    hasRcRegistration: true,
    hasInsurance: true,
    insuranceValidTill: '2026-11-20',
    hasFitness: true,
    fitnessValidTill: '2027-05-18',
    hasPollutionTax: true,
    hasNocClearance: true,
    hasServiceRecords: true,
    ownershipCount: 1,
    inspectionStatus: 'Report Available',
    inspectionReportId: 'INSP-RZ-403',
    inspectionScore: 'Tyres 80% Life Remaining, Hydraulic Cylinder Sound',
    sellerId: 'SEL-003',
    sellerName: 'Musthafa K.',
    sellerBusiness: 'Kannur Valley Transport Logistics',
    sellerType: 'Fleet Contractor',
    sellerPhone: '+91 94475 11922',
    sellerCity: 'Kannur',
    sellerRating: 4.95,
    sellerTotalListings: 8,
    featuredImage: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80'
    ],
    hasVideo: false,
    viewsCount: 412,
    enquiriesCount: 19,
    offersCount: 7,
    postedDate: '2026-09-08',
    featured: true
  },
  {
    id: 'LST-VEH-004',
    listingCode: 'RZ-LST-2026-904',
    title: 'BharatBenz 2828C Heavy Mining Tipper (6x4 Heavy Hub-Reduction)',
    category: 'Commercial Vehicles',
    type: 'Tippers',
    brand: 'BharatBenz',
    model: '2828C Heavy Bogie',
    year: 2022,
    odometerKm: 72100,
    registrationNumber: 'KA-20-C-8014',
    locationState: 'Karnataka',
    locationDistrict: 'Udupi',
    locationCity: 'Karkala Quarry Cluster',
    condition: 'Good',
    askingPriceRs: 3380000,
    priceType: 'Negotiable',
    minimumAcceptablePriceRs: 3180000,
    financeAvailable: true,
    paymentTerms: 'Advance token and full balance before dispatch release',
    engineMakeModel: 'OM926 BS-VI Electronic 7.2L Turbo',
    enginePowerHp: '281 HP @ 2200 RPM',
    operatingWeightTons: 28.0,
    bucketOrPayloadCapacity: '18 m³ Hardox Mining Tipper Box',
    fuelType: 'Diesel',
    chassisSerialNumber: 'BB2828C-UD99120',
    hasRcRegistration: true,
    hasInsurance: true,
    insuranceValidTill: '2027-04-12',
    hasFitness: true,
    fitnessValidTill: '2027-06-08',
    hasPollutionTax: true,
    hasNocClearance: true,
    hasServiceRecords: true,
    ownershipCount: 1,
    inspectionStatus: 'Completed',
    inspectionReportId: 'INSP-RZ-404',
    inspectionScore: 'Differential Lock & Hub Reduction Operational',
    sellerId: 'SEL-004',
    sellerName: 'Ganesh Poojary',
    sellerBusiness: 'Udupi Blue Metal Crushing Corp',
    sellerType: 'Crusher Operator',
    sellerPhone: '+91 98450 77412',
    sellerCity: 'Udupi',
    sellerRating: 4.7,
    sellerTotalListings: 3,
    featuredImage: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80'
    ],
    hasVideo: true,
    viewsCount: 220,
    enquiriesCount: 8,
    offersCount: 3,
    postedDate: '2026-09-17',
    featured: false
  },
  {
    id: 'LST-MAC-005',
    listingCode: 'RZ-LST-2026-905',
    title: 'Metso Nordberg C106 Stationary Jaw Crusher (180–220 TPH)',
    category: 'Quarry / Crusher Equipment',
    type: 'Jaw Crushers',
    brand: 'Metso Nordberg',
    model: 'C106 Primary Jaw',
    year: 2020,
    hoursWorked: 6900,
    locationState: 'Kerala',
    locationDistrict: 'Wayanad',
    locationCity: 'Mananthavady Crushing Unit',
    condition: 'Good',
    askingPriceRs: 5200000,
    priceType: 'Price on Request',
    minimumAcceptablePriceRs: 4800000,
    financeAvailable: false,
    paymentTerms: '50% on contract signing, balance upon dismantling and loading',
    engineMakeModel: 'ABB 110 kW Heavy Duty Industrial Electric Motor',
    enginePowerHp: '150 HP Electric Drive',
    operatingWeightTons: 16.5,
    bucketOrPayloadCapacity: 'Feed Opening: 1060 mm × 700 mm',
    fuelType: 'Electric',
    productionCapacity: '200 TPH Primary Hard Rock Crushing',
    chassisSerialNumber: 'MET-C106-WY20188',
    hasRcRegistration: false,
    hasInsurance: false,
    hasFitness: false,
    hasPollutionTax: false,
    hasNocClearance: true,
    hasServiceRecords: true,
    ownershipCount: 1,
    inspectionStatus: 'Report Available',
    inspectionReportId: 'INSP-RZ-405',
    inspectionScore: 'Flywheels, Eccentric Shaft, and Jaw Plates Inspected',
    sellerId: 'SEL-005',
    sellerName: 'Mathew Thomas',
    sellerBusiness: 'Highland Aggregates & M-Sand Plant',
    sellerType: 'Crusher Operator',
    sellerPhone: '+91 94470 66500',
    sellerCity: 'Wayanad',
    sellerRating: 4.85,
    sellerTotalListings: 2,
    featuredImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80'
    ],
    hasVideo: false,
    viewsCount: 512,
    enquiriesCount: 22,
    offersCount: 8,
    postedDate: '2026-09-02',
    featured: true
  },
  {
    id: 'LST-MAC-006',
    listingCode: 'RZ-LST-2026-906',
    title: 'JCB 3DX Super 4WD Backhoe Loader (Heavy Duty Axles)',
    category: 'Machinery',
    type: 'Backhoe Loaders',
    brand: 'JCB',
    model: '3DX Super EcoXcellence 4WD',
    year: 2022,
    hoursWorked: 2950,
    registrationNumber: 'KL-14-W-3008',
    locationState: 'Kerala',
    locationDistrict: 'Kasaragod',
    locationCity: 'Kanhangad',
    condition: 'Excellent',
    askingPriceRs: 2450000,
    priceType: 'Negotiable',
    minimumAcceptablePriceRs: 2280000,
    financeAvailable: true,
    paymentTerms: 'Bank loan transfer or outright settlement',
    engineMakeModel: 'JCB ecoMAX 4.8L BS-IV Diesel',
    enginePowerHp: '76 HP @ 2200 RPM',
    operatingWeightTons: 8.2,
    bucketOrPayloadCapacity: 'Loader: 1.1 m³ / Excavator: 0.28 m³ Heavy Duty',
    fuelType: 'Diesel',
    chassisSerialNumber: 'JCB3DXS-KL2022-819',
    hasRcRegistration: true,
    hasInsurance: true,
    insuranceValidTill: '2027-02-28',
    hasFitness: true,
    fitnessValidTill: '2027-05-15',
    hasPollutionTax: true,
    hasNocClearance: true,
    hasServiceRecords: true,
    ownershipCount: 1,
    inspectionStatus: 'Scheduled',
    sellerId: 'SEL-001',
    sellerName: 'K. V. Damodaran Nair',
    sellerBusiness: 'Malabar Mining & Earthmovers Ltd',
    sellerType: 'Quarry Owner',
    sellerPhone: '+91 94471 88200',
    sellerCity: 'Kasaragod',
    sellerRating: 4.9,
    sellerTotalListings: 4,
    featuredImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f8?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f8?auto=format&fit=crop&w=800&q=80'
    ],
    hasVideo: false,
    viewsCount: 380,
    enquiriesCount: 16,
    offersCount: 6,
    postedDate: '2026-09-14',
    featured: false
  },
  {
    id: 'LST-MAC-007',
    listingCode: 'RZ-LST-2026-907',
    title: 'Atlas Copco ROC D7 Crawler Surface Drilling Rig',
    category: 'Machinery',
    type: 'Drilling Machines',
    brand: 'Atlas Copco / Epiroc',
    model: 'ROC D7-11',
    year: 2019,
    hoursWorked: 5400,
    locationState: 'Karnataka',
    locationDistrict: 'Hassan',
    locationCity: 'Granite Belt Concession #04',
    condition: 'Good',
    askingPriceRs: 3850000,
    priceType: 'Negotiable',
    minimumAcceptablePriceRs: 3500000,
    financeAvailable: false,
    paymentTerms: 'Payment in 2 installments: 40% advance, 60% on trail drill demo',
    engineMakeModel: 'Caterpillar C7 Tier 3 Diesel',
    enginePowerHp: '225 HP @ 2000 RPM',
    operatingWeightTons: 14.8,
    bucketOrPayloadCapacity: 'Hole Diameter: 64 mm – 115 mm (Drill Depth: 28 m)',
    fuelType: 'Diesel',
    chassisSerialNumber: 'EPIROC-ROCD7-99124',
    hasRcRegistration: false,
    hasInsurance: false,
    hasFitness: false,
    hasPollutionTax: false,
    hasNocClearance: true,
    hasServiceRecords: true,
    ownershipCount: 1,
    inspectionStatus: 'Completed',
    inspectionReportId: 'INSP-RZ-407',
    inspectionScore: 'Compressor Pressure 10.5 Bar Verified, Drifter COP 1838 Operational',
    sellerId: 'SEL-006',
    sellerName: 'B. Ravindra Kumar',
    sellerBusiness: 'Deccan Blast & Drilling Solutions',
    sellerType: 'Fleet Contractor',
    sellerPhone: '+91 98860 44210',
    sellerCity: 'Hassan',
    sellerRating: 4.75,
    sellerTotalListings: 5,
    featuredImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80'
    ],
    hasVideo: true,
    viewsCount: 180,
    enquiriesCount: 7,
    offersCount: 2,
    postedDate: '2026-09-10',
    featured: false
  },
  {
    id: 'LST-EQP-008',
    listingCode: 'RZ-LST-2026-908',
    title: 'Terex Finlay 683 Supertrak Mobile 3-Way Incline Screen',
    category: 'Quarry / Crusher Equipment',
    type: 'Screening Plants',
    brand: 'Terex Finlay',
    model: '683 Supertrak',
    year: 2021,
    hoursWorked: 3890,
    locationState: 'Kerala',
    locationDistrict: 'Kozhikode',
    locationCity: 'Koduvally Stone Quarry Zone',
    condition: 'Excellent',
    askingPriceRs: 4950000,
    priceType: 'Negotiable',
    minimumAcceptablePriceRs: 4650000,
    financeAvailable: true,
    paymentTerms: 'Escrow release upon site delivery and live screening test',
    engineMakeModel: 'Deutz 74 kW Industrial Engine',
    enginePowerHp: '100 HP Diesel Hydraulic Drive',
    operatingWeightTons: 25.0,
    bucketOrPayloadCapacity: 'Screen Deck: 3.66 m × 1.52 m (Twin Deck, 3 Aggregates Output)',
    fuelType: 'Diesel',
    productionCapacity: '250 TPH Screening Output',
    chassisSerialNumber: 'TRX683-KZ2021-99',
    hasRcRegistration: false,
    hasInsurance: true,
    insuranceValidTill: '2027-03-10',
    hasFitness: false,
    hasPollutionTax: false,
    hasNocClearance: true,
    hasServiceRecords: true,
    ownershipCount: 1,
    inspectionStatus: 'Report Available',
    inspectionReportId: 'INSP-RZ-408',
    inspectionScore: 'Conveyor Belts & Screen Meshes in Pristine State',
    sellerId: 'SEL-007',
    sellerName: 'Abdul Gafoor',
    sellerBusiness: 'Malabar Sand & Stone Processors',
    sellerType: 'Crusher Operator',
    sellerPhone: '+91 94460 11988',
    sellerCity: 'Kozhikode',
    sellerRating: 4.88,
    sellerTotalListings: 3,
    featuredImage: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80'
    ],
    hasVideo: true,
    viewsCount: 310,
    enquiriesCount: 12,
    offersCount: 4,
    postedDate: '2026-09-06',
    featured: true
  }
];

export const MARKETPLACE_ENQUIRIES: MarketplaceEnquiry[] = [
  {
    id: 'ENQ-001',
    enquiryCode: 'ENQ-RZ-2026-104',
    listingId: 'LST-MAC-001',
    listingTitle: 'Caterpillar 320D Heavy Hydraulic Excavator (20.5 Ton)',
    listingPriceRs: 4250000,
    listingCategory: 'Machinery',
    buyerName: 'Vikramaditya Infrastructure Corp',
    buyerCompany: 'Vikramaditya Infra Ltd',
    buyerPhone: '+91 98840 77120',
    buyerLocation: 'Calicut, Kerala',
    date: '2026-09-22 11:30 AM',
    message: 'We require a 20-ton excavator immediately for our NH-66 widening project package. What is the latest hydraulic pump test pressure and when can we inspect the machine at Nileshwaram?',
    requirementUrgency: 'Immediate (Within 7 Days)',
    status: 'Negotiation',
    sellerName: 'K. V. Damodaran Nair'
  },
  {
    id: 'ENQ-002',
    enquiryCode: 'ENQ-RZ-2026-105',
    listingId: 'LST-VEH-003',
    listingTitle: 'Ashok Leyland 2820 Tipper (10-Wheeler, 16 MT Payload Box)',
    listingPriceRs: 3150000,
    listingCategory: 'Commercial Vehicles',
    buyerName: 'Sanjay Hegde',
    buyerCompany: 'Hegde Minerals & Transport',
    buyerPhone: '+91 94480 33910',
    buyerLocation: 'Mangalore, Karnataka',
    date: '2026-09-21 04:15 PM',
    message: 'Interested in this 2820 Tipper. Is Karnataka RTO NOC readily available? Would like to offer ₹29,50,000 all inclusive.',
    requirementUrgency: 'Next 30 Days',
    status: 'Offer',
    sellerName: 'Musthafa K.'
  },
  {
    id: 'ENQ-003',
    enquiryCode: 'ENQ-RZ-2026-106',
    listingId: 'LST-MAC-005',
    listingTitle: 'Metso Nordberg C106 Stationary Jaw Crusher (180–220 TPH)',
    listingPriceRs: 5200000,
    listingCategory: 'Quarry / Crusher Equipment',
    buyerName: 'Eldho Varghese',
    buyerCompany: 'Highland Stone Mills & M-Sand',
    buyerPhone: '+91 98471 22840',
    buyerLocation: 'Idukki, Kerala',
    date: '2026-09-20 02:45 PM',
    message: 'We are expanding our crusher plant to 200 TPH. What is the condition of toggle plate and flywheels? Please send dismantling videos.',
    requirementUrgency: 'Immediate (Within 7 Days)',
    status: 'Contacted',
    sellerName: 'Mathew Thomas'
  },
  {
    id: 'ENQ-004',
    enquiryCode: 'ENQ-RZ-2026-107',
    listingId: 'LST-MAC-002',
    listingTitle: 'Komatsu PC210-10M0 Heavy Duty Rock Excavator',
    listingPriceRs: 4680000,
    listingCategory: 'Machinery',
    buyerName: 'Naveen Rao',
    buyerCompany: 'Coastal Earthmovers Pvt Ltd',
    buyerPhone: '+91 97412 88900',
    buyerLocation: 'Udupi, Karnataka',
    date: '2026-09-19 10:00 AM',
    message: 'Is RZ certified inspection completed for Komatsu PC210? We want to verify track link wear and hydraulic oil analysis.',
    requirementUrgency: 'Next 30 Days',
    status: 'Inspection',
    sellerName: 'Shekhar Shetty'
  }
];

export const MARKETPLACE_OFFERS: MarketplaceOffer[] = [
  {
    id: 'OFF-001',
    offerCode: 'OFR-RZ-2026-881',
    listingId: 'LST-MAC-001',
    listingTitle: 'Caterpillar 320D Heavy Hydraulic Excavator (20.5 Ton)',
    askingPriceRs: 4250000,
    offeredAmountRs: 4000000,
    buyerName: 'Vikramaditya Infrastructure Corp',
    buyerCompany: 'Vikramaditya Infra Ltd',
    buyerPhone: '+91 98840 77120',
    sellerName: 'K. V. Damodaran Nair',
    paymentTerms: '₹5,00,000 Advance Escrow, Balance ₹35,00,000 on RTO NOC verification',
    deliveryPreference: 'RZ Vehicle Fleet Delivery',
    pickupLocation: 'Nileshwaram Quarry Hub, Kasaragod',
    deliveryDestination: 'NH-66 Project Site, Calicut',
    status: 'Negotiation',
    submittedDate: '2026-09-22',
    validUntil: '2026-09-29',
    history: [
      {
        id: 'OFH-01',
        date: '2026-09-22 11:45 AM',
        by: 'Buyer',
        amountRs: 3900000,
        terms: 'Prompt payment, buyer to arrange low-bed trailer',
        notes: 'Initial buyer proposal.'
      },
      {
        id: 'OFH-02',
        date: '2026-09-22 02:30 PM',
        by: 'Seller',
        amountRs: 4100000,
        terms: 'Includes newly replaced track rollers and complete filter kit',
        notes: 'Seller counter-offer.'
      },
      {
        id: 'OFH-03',
        date: '2026-09-23 09:15 AM',
        by: 'Buyer',
        amountRs: 4000000,
        terms: 'Final proposal with RZ Escrow protection',
        notes: 'Buyer revised counter.'
      }
    ]
  },
  {
    id: 'OFF-002',
    offerCode: 'OFR-RZ-2026-882',
    listingId: 'LST-VEH-003',
    listingTitle: 'Ashok Leyland 2820 Tipper (10-Wheeler, 16 MT Payload Box)',
    askingPriceRs: 3150000,
    offeredAmountRs: 3000000,
    buyerName: 'Sanjay Hegde',
    buyerCompany: 'Hegde Minerals & Transport',
    buyerPhone: '+91 94480 33910',
    sellerName: 'Musthafa K.',
    paymentTerms: 'Full settlement via RTGS within 48 hours of inspection report pass',
    deliveryPreference: 'Buyer Pickup',
    pickupLocation: 'Taliparamba Quarry Depot, Kannur',
    status: 'Accepted',
    submittedDate: '2026-09-21',
    validUntil: '2026-09-28',
    history: [
      {
        id: 'OFH-11',
        date: '2026-09-21 04:30 PM',
        by: 'Buyer',
        amountRs: 2950000,
        terms: 'Full payment on RTO NOC issuance',
        notes: 'Initial offer.'
      },
      {
        id: 'OFH-12',
        date: '2026-09-22 10:00 AM',
        by: 'Seller',
        amountRs: 3000000,
        terms: 'Agreed at round ₹30 Lakh with current comprehensive insurance',
        notes: 'Seller agreed.'
      }
    ]
  }
];

export const MARKETPLACE_INSPECTIONS: MarketplaceInspection[] = [
  {
    id: 'INSP-RZ-401',
    inspectionCode: 'INS-2026-781',
    listingId: 'LST-MAC-001',
    listingTitle: 'Caterpillar 320D Heavy Hydraulic Excavator (20.5 Ton)',
    machineBrandModel: 'Caterpillar 320D',
    serialNumber: 'CAT0320DPG099182',
    type: 'Buyer Requested',
    inspectorName: 'Er. Rajesh K. Nair (Lead Mechanical Surveyor)',
    inspectorAgency: 'RZ Technical Survey & Machinery Audits',
    date: '2026-09-20',
    location: 'Nileshwaram Quarry Hub, Kasaragod',
    status: 'Report Available',
    engineFindings: 'Engine start test immediate. Blow-by minimal within permissible OEM limits. Turbocharger spool and intercooler hoses sound.',
    hydraulicFindings: 'Main pump working pressure tested at 345 bar. Slew motor backlash within 2.5 mm. Boom and arm hydraulic rams free of pitting or seal leakage.',
    mechanicalFindings: 'Slew bearing rotation smooth, zero grinding noise. Final drive oil sample clear of metallic flakes. Track sprockets show ~20% tooth wear.',
    structuralFindings: 'Boom reinforcement plates intact, no hairline cracks observed along weld seams. Heavy rock bucket side cutters in 75% condition.',
    documentationFindings: 'Original RC, Commercial Fitness valid till 2027, Form 29 & 30 signed by registered owner. Clear NOC from Kasaragod RTO.',
    testDriveNotes: 'Operated under live granite excavation loading for 45 minutes. Hydraulic cycle times: Boom raise 3.1 sec, Bucket curl 2.2 sec.',
    recommendedRepairs: 'Routine replacement of secondary hydraulic return filter element recommended at 5,000 hour service.',
    estimatedImmediateMaintenanceCostRs: 28000,
    certifiedWorkingHours: 4820,
    checklist: [
      { name: 'Engine Starting & Cold Cranking', category: 'Engine', status: 'Good', remarks: 'Started in single crank, steady 750 RPM idle.' },
      { name: 'Exhaust Smoke & Emissions', category: 'Engine', status: 'Good', remarks: 'No blue or black soot under sudden acceleration.' },
      { name: 'Engine Oil & Coolant Condition', category: 'Engine', status: 'Good', remarks: 'Oil viscosity good, zero coolant contamination.' },
      { name: 'Hydraulic Main Pump Pressure', category: 'Hydraulics', status: 'Good', remarks: 'Delivers 345 bar relief valve cutoff.' },
      { name: 'Control Valve Spool Leaks', category: 'Hydraulics', status: 'Good', remarks: 'Main control valve dry, O-rings sealed.' },
      { name: 'Cylinders & Hydraulic Hoses', category: 'Hydraulics', status: 'Satisfactory', remarks: 'Arm cylinder seal weeping negligible, monitor.' },
      { name: 'Slew Ring & Turntable Bearing', category: 'Mechanical', status: 'Good', remarks: 'Greased regularly, minimal play.' },
      { name: 'Track Chains & Sprockets', category: 'Mechanical', status: 'Satisfactory', remarks: 'Track tension adjusted, ~25% bushing wear.' },
      { name: 'Boom & Arm Structural Welds', category: 'Structural', status: 'Good', remarks: 'Factory gusset plates intact.' },
      { name: 'Cabin Roll-Over Protection (ROPS)', category: 'Structural', status: 'Good', remarks: 'OEM ROPS certified cabin structure.' },
      { name: 'RTO Registration & Clear NOC', category: 'Documentation', status: 'Good', remarks: 'Hypothecation cancellation letter stamped.' }
    ]
  },
  {
    id: 'INSP-RZ-403',
    inspectionCode: 'INS-2026-782',
    listingId: 'LST-VEH-003',
    listingTitle: 'Ashok Leyland 2820 Tipper (10-Wheeler, 16 MT Payload Box)',
    machineBrandModel: 'Ashok Leyland 2820 6x4',
    serialNumber: 'AL28206X4-KL1388102',
    type: 'Pre-Listing Certification',
    inspectorName: 'Suresh Babu (Automotive Surveyor)',
    inspectorAgency: 'RZ Technical Survey & Machinery Audits',
    date: '2026-09-18',
    location: 'Taliparamba Quarry Depot, Kannur',
    status: 'Completed',
    engineFindings: 'BS-VI engine starts smooth. DEF dosing system operational. Diagnostic scan shows zero active OBD error codes.',
    hydraulicFindings: 'Penta tipping hydraulic cylinder operates at full 52-degree dump angle without shudder. Oil reservoir level full.',
    mechanicalFindings: 'ZF 9-speed manual gearbox shifts crisp. Bogie suspension leaf springs unbroken. Full air dual line S-cam brakes test: 100% stop efficiency.',
    structuralFindings: 'Rock body floor plate 8 mm high tensile steel with minor surface pitting. Chassis frame straight and unbent.',
    documentationFindings: 'All commercial vehicle papers valid. Fitness cert valid till May 2027.',
    testDriveNotes: 'Driven 12 km loaded on highway and quarry gradient. Excellent pulling power in crawler gear.',
    recommendedRepairs: 'Front left tie-rod boot grease repacking.',
    estimatedImmediateMaintenanceCostRs: 6500,
    certifiedWorkingHours: 0,
    checklist: [
      { name: 'Engine Performance & Exhaust', category: 'Engine', status: 'Good', remarks: 'Clean BS-VI exhaust, DEF tank full.' },
      { name: 'Hydraulic Tipping Ram', category: 'Hydraulics', status: 'Good', remarks: 'Lifting and lowering times within OEM spec.' },
      { name: 'Transmission & Clutch', category: 'Mechanical', status: 'Good', remarks: 'Clutch bite positive, no slippage.' },
      { name: 'Chassis & Rock Body Integrity', category: 'Structural', status: 'Good', remarks: 'No structural weld repairs or twists.' },
      { name: 'RC, Fitness & Road Tax', category: 'Documentation', status: 'Good', remarks: 'Kerala tax paid advance.' }
    ]
  }
];

export const MARKETPLACE_DEALS: MarketplaceDeal[] = [
  {
    id: 'DEAL-901',
    dealCode: 'DL-RZ-2026-441',
    listingId: 'LST-VEH-003',
    listingTitle: 'Ashok Leyland 2820 Tipper (10-Wheeler, 16 MT Payload Box)',
    listingCategory: 'Commercial Vehicles',
    buyerName: 'Sanjay Hegde',
    buyerCompany: 'Hegde Minerals & Transport',
    buyerContact: '+91 94480 33910',
    sellerName: 'Musthafa K.',
    sellerCompany: 'Kannur Valley Transport Logistics',
    sellerContact: '+91 94475 11922',
    agreedPriceRs: 3000000,
    dealDate: '2026-09-22',
    paymentTerms: '₹3,00,000 Advance Escrow, ₹27,00,000 Balance on RTO Registration Filing',
    advancePaidRs: 300000,
    balancePayableRs: 2700000,
    paymentStatus: 'Advance Received',
    documentsStatus: 'RC Transfer Initiated',
    deliveryMode: 'Buyer Self-Pickup',
    deliveryStatus: 'Pending Dispatch',
    status: 'RTO Documentation',
    timeline: [
      { date: '2026-09-21', title: 'Offer Accepted', notes: 'Seller accepted buyer offer of ₹30,00,000.' },
      { date: '2026-09-22', title: 'Deal Agreement Executed', notes: 'Bilingual sale agreement signed digitally by buyer and seller.' },
      { date: '2026-09-22', title: 'Advance Escrow Deposited', notes: '₹3,00,000 token advance confirmed via RTGS into RZ Deal Escrow.' },
      { date: '2026-09-23', title: 'RTO Transfer Lodged', notes: 'Parivahan Form 29 & 30 application submitted to RTO Kannur.' }
    ]
  },
  {
    id: 'DEAL-902',
    dealCode: 'DL-RZ-2026-439',
    listingId: 'LST-MAC-006',
    listingTitle: 'JCB 3DX Super 4WD Backhoe Loader (Heavy Duty Axles)',
    listingCategory: 'Machinery',
    buyerName: 'P. Radhakrishnan',
    buyerCompany: 'Radhakrishnan Earthworks & Grading',
    buyerContact: '+91 98472 90112',
    sellerName: 'K. V. Damodaran Nair',
    sellerCompany: 'Malabar Mining & Earthmovers Ltd',
    sellerContact: '+91 94471 88200',
    agreedPriceRs: 2350000,
    dealDate: '2026-09-16',
    paymentTerms: '100% Escrow Secured prior to trailer loading',
    advancePaidRs: 2350000,
    balancePayableRs: 0,
    paymentStatus: 'Fully Paid',
    documentsStatus: 'All Documents Handed Over',
    deliveryMode: 'RZ Heavy Trailer Fleet Dispatch',
    deliveryStatus: 'Completed',
    assignedTrailerNumber: 'KL-14-TR-9021',
    driverName: 'Somanatha Shenoy',
    driverPhone: '+91 98470 55100',
    status: 'Completed',
    timeline: [
      { date: '2026-09-16', title: 'Offer Finalized', notes: 'Agreed price ₹23,50,000 confirmed.' },
      { date: '2026-09-17', title: 'Full Settlement Deposited', notes: 'Full payment deposited and secured in escrow.' },
      { date: '2026-09-18', title: 'RZ Heavy Trailer Assigned', notes: 'Low-bed trailer KL-14-TR-9021 assigned from Vehicle Management Platform.' },
      { date: '2026-09-19', title: 'Delivered to Kanhangad Site', notes: 'JCB safely offloaded and physical receipt signed by buyer.' },
      { date: '2026-09-20', title: 'Escrow Payout Disbursed', notes: '₹23,50,000 released to seller account.' }
    ]
  }
];

export const MARKETPLACE_PAYMENTS: MarketplacePaymentRecord[] = [
  {
    id: 'PAY-MK-101',
    paymentCode: 'TXN-RZ-99120',
    dealId: 'DEAL-901',
    dealCode: 'DL-RZ-2026-441',
    partyName: 'Sanjay Hegde (Buyer)',
    paymentType: 'Advance Escrow',
    amountRs: 300000,
    paymentMethod: 'RTGS / NEFT Bank Transfer',
    referenceId: 'HDFCR520260922901844',
    date: '2026-09-22 03:30 PM',
    status: 'Settled & Verified',
    receiptNumber: 'RCPT-MK-2026-881'
  },
  {
    id: 'PAY-MK-102',
    paymentCode: 'TXN-RZ-99105',
    dealId: 'DEAL-902',
    dealCode: 'DL-RZ-2026-439',
    partyName: 'P. Radhakrishnan (Buyer)',
    paymentType: 'Final Balance Settlement',
    amountRs: 2350000,
    paymentMethod: 'Direct Escrow Account',
    referenceId: 'ICICIR20260917004128',
    date: '2026-09-17 11:15 AM',
    status: 'Settled & Verified',
    receiptNumber: 'RCPT-MK-2026-874'
  }
];

export const DEAL_DOCUMENTS: DealDocumentItem[] = [
  {
    id: 'DOC-DL-01',
    dealCode: 'DL-RZ-2026-441',
    title: 'Original Smart Card RC Book',
    documentType: 'Original RC Book',
    fileName: 'RC_KL13AQ9912_AshokLeyland.pdf',
    fileSize: '1.2 MB',
    uploadedAt: '2026-09-22',
    status: 'Approved',
    verifiedBy: 'RZ Documentation Team'
  },
  {
    id: 'DOC-DL-02',
    dealCode: 'DL-RZ-2026-441',
    title: 'RTO Form 29 & 30 Ownership Transfer Notice',
    documentType: 'RTO Form 29 & 30',
    fileName: 'RTO_Form_29_30_Signed_Kannur.pdf',
    fileSize: '840 KB',
    uploadedAt: '2026-09-23',
    status: 'Reviewed',
    verifiedBy: 'RZ Documentation Team'
  },
  {
    id: 'DOC-DL-03',
    dealCode: 'DL-RZ-2026-441',
    title: 'Comprehensive Commercial Insurance Policy',
    documentType: 'Comprehensive Insurance Policy',
    fileName: 'NationalInsurance_KL13AQ9912.pdf',
    fileSize: '650 KB',
    uploadedAt: '2026-09-22',
    status: 'Approved',
    verifiedBy: 'RZ Documentation Team'
  },
  {
    id: 'DOC-DL-04',
    dealCode: 'DL-RZ-2026-439',
    title: 'Notarized Sale Agreement & Delivery Receipt',
    documentType: 'Notarized Sale Agreement',
    fileName: 'SaleAgreement_JCB3DX_Damodaran_Radhakrishnan.pdf',
    fileSize: '1.8 MB',
    uploadedAt: '2026-09-17',
    status: 'Approved',
    verifiedBy: 'RZ Legal Desk'
  }
];
