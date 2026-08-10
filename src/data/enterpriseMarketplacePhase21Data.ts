export interface DirectoryListing {
  id: string;
  code: string;
  businessName: string;
  category: 'Quarry Partner' | 'Crusher Unit' | 'Building Material Dealer' | 'Fleet Owner' | 'Equipment Operator' | 'Civil Contractor' | 'Architect/Engineer' | 'Spare Parts Supplier' | 'Consultant';
  location: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  phone: string;
  servicesOffered: string[];
  badges: string[];
}

export interface MiningListing {
  id: string;
  listingNo: string;
  title: string;
  quarryType: 'Laterite Quarry' | 'Granite Quarry' | 'Hard Rock Blue Metal' | 'Crusher Unit' | 'Mining Land Lease';
  location: string;
  areaAcres: number;
  estimatedReserveTons: number;
  askingPriceRs: number;
  type: 'Lease Sale' | 'Joint Venture' | 'Royalty Partnership' | 'Land Sale';
  status: 'ACTIVE' | 'IN_TALKS' | 'CLOSED';
}

export interface BuildingMaterialListing {
  id: string;
  itemCode: string;
  title: string;
  category: 'Laterite Stone' | 'Crushed Blue Metal' | 'Washed M-Sand' | 'Plaster P-Sand' | 'Cement' | 'TMT Steel' | 'Ready Mix Concrete' | 'Construction Hardware';
  unit: string;
  pricePerUnitRs: number;
  minOrderQty: number;
  vendorName: string;
  location: string;
  inStockQty: number;
  rating: number;
}

export interface FleetMarketplaceListing {
  id: string;
  vehicleCode: string;
  vehicleType: '10-Wheeler Tipper' | '14-Wheeler Multi-Axle' | 'Heavy Trailer' | 'Mini Truck' | 'Pickup Van';
  capacityTons: number;
  ratePerTripRs: number;
  ratePerKmRs: number;
  monthlyRentalRs: number;
  ownerName: string;
  baseLocation: string;
  status: 'AVAILABLE' | 'ON_TRIP' | 'BOOKED';
}

export interface EquipmentMarketplaceListing {
  id: string;
  equipmentCode: string;
  equipmentType: 'Excavator (20-Ton)' | 'JCB Backhoe Loader' | 'Rock Breaker' | 'Crawler Crane' | 'Diesel Generator (125 kVA)';
  hourlyRateRs: number;
  monthlyRentalRs: number;
  operatorProvided: boolean;
  ownerName: string;
  location?: string;
  baseLocation?: string;
  condition: 'NEW' | 'LIKE_NEW' | 'OPERATIONAL';
}

export interface UsedMachineryListing {
  id: string;
  machineryCode: string;
  title: string;
  category: 'Used Crusher Plant' | 'Used Excavator' | 'Used Tipper Truck' | 'Used Rock Breaker';
  modelYear: number;
  hoursOrKmRun: string;
  valuationRs: number;
  askingPriceRs: number;
  inspectionVerified: boolean;
  sellerName: string;
  location: string;
  status: 'FOR_SALE' | 'AUCTION_ACTIVE' | 'SOLD';
}

export interface JobMarketplaceListing {
  id: string;
  jobCode: string;
  title: string;
  category: 'Tipper Driver' | 'Excavator Operator' | 'Quarry Tech' | 'Site Supervisor' | 'Civil Engineer' | 'Office Executive';
  companyName: string;
  location: string;
  salaryRangeRs: string;
  applicantsCount: number;
  postedDate: string;
  status: 'OPEN' | 'CLOSED';
}

export interface ServiceMarketplaceListing {
  id: string;
  serviceCode: string;
  serviceName: string;
  title?: string;
  category: 'Heavy Equipment Mechanic' | 'Hydraulic Tech' | 'Auto Electrician' | 'Tyre Retreading Shop' | 'Fuel/Lube Supplier' | 'Insurance & Finance Broker';
  providerName: string;
  location: string;
  rating: number;
  hourlyRateRs: number;
  responseMinutes: number;
}

export interface ConstructionMarketplaceListing {
  id: string;
  projectCode: string;
  title: string;
  category: 'Turnkey Civil Building' | 'Structural Engineering' | 'Architectural Blueprint' | 'Interior Decoration' | 'Earthwork Excavation';
  contractorName: string;
  location: string;
  experienceYears: number;
  estimatedCostPerSqFtRs: number;
  verifiedProjectsCount: number;
}

export interface PublicBuySellAd {
  id: string;
  adNo: string;
  title: string;
  category: 'Material Sell' | 'Vehicle Sell' | 'Equipment Sell' | 'Land/Quarry Buy';
  description: string;
  priceRs: number;
  postedBy: string;
  phone: string;
  postedDate: string;
  viewsCount: number;
}

export interface AIMatchingResult {
  id: string;
  buyerName: string;
  requirement: string;
  matchedSupplier: string;
  matchScorePercent: number;
  estimatedFreightSavingsRs: number;
  aiReasoning: string;
}

export interface DigitalBusinessPost {
  id: string;
  authorName: string;
  authorCompany: string;
  date: string;
  content: string;
  likesCount: number;
  commentsCount: number;
  partnershipType: string;
}

export interface TenderNotice {
  id: string;
  tenderNo: string;
  title: string;
  issuerName: string;
  category: 'Government Infrastructure' | 'Private Commercial' | 'Material Supply Tender' | 'Transport Contract';
  estimatedValueRs: number;
  dueDate: string;
  bidsSubmittedCount: number;
  status: 'OPEN' | 'UNDER_EVALUATION' | 'AWARDED';
}

export interface DigitalAuctionListing {
  id: string;
  auctionNo: string;
  itemTitle: string;
  startingBidRs: number;
  currentHighBidRs: number;
  totalBidsCount: number;
  timeRemaining: string;
  auctionType: 'Forward Auction' | 'Reverse Auction';
  status: 'LIVE' | 'UPCOMING' | 'CLOSED';
}

export interface AdCampaign {
  id: string;
  campaignTitle: string;
  sponsorName: string;
  bannerType: 'Hero Banner' | 'Featured Listing' | 'Sponsored Product';
  impressionsCount: number;
  clicksCount: number;
  status: 'ACTIVE' | 'SCHEDULED' | 'PAUSED';
}

export interface FinancingOffer {
  id: string;
  offerCode: string;
  partnerName: string;
  loanType: 'Equipment Finance' | 'Tipper Fleet Purchase' | 'Working Capital Line' | 'Project Advances';
  maxSanctionRs: number;
  interestRatePercent: number;
  tenureMonths: number;
  approvalTimeHours: number;
}

export const MOCK_MARKETPLACE_DIRECTORY: DirectoryListing[] = [
  {
    id: 'DIR-101',
    code: 'DIR-MNG-001',
    businessName: 'Bantwal Stone Quarry & Crushing Hub',
    category: 'Quarry Partner',
    location: 'Bantwal Industrial Mining Zone, Mangalore',
    rating: 4.9,
    reviewCount: 88,
    isVerified: true,
    phone: '+91 98451 11223',
    servicesOffered: ['Washed M-Sand', 'P-Sand', '20mm Aggregate', '40mm Metal'],
    badges: ['DIRECT QUARRY PRODUCER', 'ISO QUALITY CERTIFIED', 'RZ PREFERRED']
  },
  {
    id: 'DIR-102',
    code: 'DIR-UDU-002',
    businessName: 'Coastal Earthmovers & Heavy Tipper Fleet',
    category: 'Fleet Owner',
    location: 'Kadiyali Bypass, Udupi',
    rating: 4.8,
    reviewCount: 64,
    isVerified: true,
    phone: '+91 94482 33445',
    servicesOffered: ['10-Wheeler Tippers', '20-Ton Excavators', 'Rock Breakers'],
    badges: ['GPS TRACKED FLEET', '24x7 DISPATCH']
  },
  {
    id: 'DIR-103',
    code: 'DIR-MNG-003',
    businessName: 'Dakshina Kannada Civil Builders & Developers',
    category: 'Civil Contractor',
    location: 'Kuntikana Commercial Complex, Mangalore',
    rating: 4.7,
    reviewCount: 42,
    isVerified: true,
    phone: '+91 97410 88776',
    servicesOffered: ['Commercial Infrastructure', 'High-rise Residential', 'BOQ Execution'],
    badges: ['CLASS-1 CONTRACTOR']
  }
];

export const MOCK_MINING_MARKETPLACE: MiningListing[] = [
  {
    id: 'MN-201',
    listingNo: 'MN-LEASE-881',
    title: '5-Acre High Grade Hard Rock Blue Granite Quarry Lease',
    quarryType: 'Hard Rock Blue Metal',
    location: 'Moodabidri Mining Belt, DK District',
    areaAcres: 5.0,
    estimatedReserveTons: 1200000,
    askingPriceRs: 8500000,
    type: 'Lease Sale',
    status: 'ACTIVE'
  },
  {
    id: 'MN-202',
    listingNo: 'MN-JV-402',
    title: 'Laterite Stone Quarry Joint Venture Opportunity (Class-A Dressing)',
    quarryType: 'Laterite Quarry',
    location: 'Bantwal Ridge, Mangalore Suburbs',
    areaAcres: 8.5,
    estimatedReserveTons: 850000,
    askingPriceRs: 4500000,
    type: 'Joint Venture',
    status: 'ACTIVE'
  }
];

export const MOCK_BUILDING_MATERIAL_MARKETPLACE: BuildingMaterialListing[] = [
  {
    id: 'MAT-301',
    itemCode: 'MAT-MSAND-01',
    title: 'Washed M-Sand (1st Dressing Concrete Grade)',
    category: 'Washed M-Sand',
    unit: 'Tons',
    pricePerUnitRs: 680,
    minOrderQty: 10,
    vendorName: 'Bantwal Crusher Hub',
    location: 'Mangalore Coastal Circle',
    inStockQty: 4500,
    rating: 4.9
  },
  {
    id: 'MAT-302',
    itemCode: 'MAT-LAT-02',
    title: 'Prime Cut Laterite Masonry Stone (15x9x6 Inch)',
    category: 'Laterite Stone',
    unit: 'Blocks',
    pricePerUnitRs: 45,
    minOrderQty: 500,
    vendorName: 'Dakshina Quarry Outlet',
    location: 'Udupi-Kundapura Corridor',
    inStockQty: 25000,
    rating: 4.8
  },
  {
    id: 'MAT-303',
    itemCode: 'MAT-AGG-03',
    title: '20mm Crushed Blue Metal Granular Aggregate',
    category: 'Crushed Blue Metal',
    unit: 'Tons',
    pricePerUnitRs: 620,
    minOrderQty: 15,
    vendorName: 'Moodabidri Aggregate Works',
    location: 'Moodabidri Mining Belt',
    inStockQty: 8000,
    rating: 4.7
  }
];

export const MOCK_FLEET_MARKETPLACE: FleetMarketplaceListing[] = [
  {
    id: 'FLT-401',
    vehicleCode: 'FLT-TIP-10W',
    vehicleType: '10-Wheeler Tipper',
    capacityTons: 16,
    ratePerTripRs: 3500,
    ratePerKmRs: 85,
    monthlyRentalRs: 110000,
    ownerName: 'Coastal Logistics & Tippers',
    baseLocation: 'Panambur Port Area',
    status: 'AVAILABLE'
  },
  {
    id: 'FLT-402',
    vehicleCode: 'FLT-TIP-14W',
    vehicleType: '14-Wheeler Multi-Axle',
    capacityTons: 25,
    ratePerTripRs: 5200,
    ratePerKmRs: 110,
    monthlyRentalRs: 165000,
    ownerName: 'Karnataka Heavy Movers',
    baseLocation: 'Surathkal Highway Junction',
    status: 'AVAILABLE'
  }
];

export const MOCK_EQUIPMENT_MARKETPLACE: EquipmentMarketplaceListing[] = [
  {
    id: 'EQ-501',
    equipmentCode: 'EQ-CAT-20T',
    equipmentType: 'Excavator (20-Ton)',
    hourlyRateRs: 2200,
    monthlyRentalRs: 240000,
    operatorProvided: true,
    ownerName: 'Mangalore Earthmovers Corp',
    baseLocation: 'Kuntikana Flyover Yard',
    condition: 'OPERATIONAL'
  },
  {
    id: 'EQ-502',
    equipmentCode: 'EQ-JCB-3CX',
    equipmentType: 'JCB Backhoe Loader',
    hourlyRateRs: 1100,
    monthlyRentalRs: 125000,
    operatorProvided: true,
    ownerName: 'Udupi Machinery Rentals',
    baseLocation: 'Kadiyali Depot',
    condition: 'LIKE_NEW'
  }
];

export const MOCK_USED_MACHINERY: UsedMachineryListing[] = [
  {
    id: 'USED-601',
    machineryCode: 'UM-VOLVO-210',
    title: '2022 Volvo EC210D Heavy Excavator (4,200 Hours)',
    category: 'Used Excavator',
    modelYear: 2022,
    hoursOrKmRun: '4,200 Hours',
    valuationRs: 4800000,
    askingPriceRs: 4500000,
    inspectionVerified: true,
    sellerName: 'Hegde Earthworks',
    location: 'Bantwal Quarry #2',
    status: 'FOR_SALE'
  }
];

export const MOCK_JOB_MARKETPLACE: JobMarketplaceListing[] = [
  {
    id: 'JOB-701',
    jobCode: 'JOB-MNG-901',
    title: 'Experienced Heavy Tipper Driver (10-Wheeler)',
    category: 'Tipper Driver',
    companyName: 'RZ Express Logistics',
    location: 'Mangalore Port Circle',
    salaryRangeRs: '₹30,000 - ₹38,000 / month',
    applicantsCount: 16,
    postedDate: '2026-08-05',
    status: 'OPEN'
  }
];

export const MOCK_SERVICE_MARKETPLACE: ServiceMarketplaceListing[] = [
  {
    id: 'SVC-801',
    serviceCode: 'SVC-HYD-01',
    serviceName: 'Mobile Heavy Hydraulic Hose & Pump Technician',
    title: 'Mobile Heavy Hydraulic Hose & Pump Technician',
    category: 'Hydraulic Tech',
    providerName: 'Coastal Hydraulic Services',
    location: 'Panambur Industrial Area',
    rating: 4.9,
    hourlyRateRs: 850,
    responseMinutes: 25
  }
];

export const MOCK_CONSTRUCTION_MARKETPLACE: ConstructionMarketplaceListing[] = [
  {
    id: 'CON-901',
    projectCode: 'CON-MNG-11',
    title: 'Turnkey Commercial & High-Rise Building Construction',
    category: 'Turnkey Civil Building',
    contractorName: 'Mangalore Smart Infra Builders',
    location: 'Mangalore City Circle',
    experienceYears: 18,
    estimatedCostPerSqFtRs: 1850,
    verifiedProjectsCount: 48
  }
];

export const MOCK_PUBLIC_BUY_SELL: PublicBuySellAd[] = [
  {
    id: 'AD-101',
    adNo: 'AD-2026-8801',
    title: 'Selling Surplus 200 Tons 20mm Blue Metal Aggregates',
    category: 'Material Sell',
    description: 'Fresh crushed blue granite aggregate available immediately for site delivery.',
    priceRs: 118000,
    postedBy: 'Ganesh Builders',
    phone: '+91 99002 88776',
    postedDate: '2026-08-06',
    viewsCount: 342
  }
];

export const MOCK_AI_MATCHING: AIMatchingResult[] = [
  {
    id: 'MATCH-01',
    buyerName: 'Hegde Infra & Developers (Kadri Site)',
    requirement: '1,200 Tons Washed M-Sand',
    matchedSupplier: 'Bantwal Crusher Hub (8.2 Km away)',
    matchScorePercent: 98,
    estimatedFreightSavingsRs: 42000,
    aiReasoning: 'Nearest supplier with active stock and lowest return trip haulage cost.'
  }
];

export const MOCK_BUSINESS_FEED: DigitalBusinessPost[] = [
  {
    id: 'POST-01',
    authorName: 'Suresh Poojary',
    authorCompany: 'Bantwal Quarry Hub',
    date: '2026-08-07 09:30 AM',
    content: 'Expanded wet sand washing plant capacity to 1,500 Tons/day. Looking for long-term supply agreements with ready-mix concrete plants in Mangalore and Udupi.',
    likesCount: 28,
    commentsCount: 9,
    partnershipType: 'Off-Take Agreement'
  }
];

export const MOCK_TENDERS: TenderNotice[] = [
  {
    id: 'TND-01',
    tenderNo: 'TND-NH66-2026-09',
    title: 'Supply of 45,000 Tons Sub-Base Granular Aggregates for Flyover Extension',
    issuerName: 'National Highways Authority of India (NHAI)',
    category: 'Government Infrastructure',
    estimatedValueRs: 28500000,
    dueDate: '2026-08-25',
    bidsSubmittedCount: 6,
    status: 'OPEN'
  }
];

export const MOCK_AUCTIONS: DigitalAuctionListing[] = [
  {
    id: 'AUC-01',
    auctionNo: 'AUC-2026-VOLVO',
    itemTitle: '2021 Volvo EC210 Excavator (Reconditioned Engine)',
    startingBidRs: 3200000,
    currentHighBidRs: 3850000,
    totalBidsCount: 14,
    timeRemaining: '04 Hours 12 Mins',
    auctionType: 'Forward Auction',
    status: 'LIVE'
  }
];

export const MOCK_AD_CAMPAIGNS: AdCampaign[] = [
  {
    id: 'AD-CAMP-01',
    campaignTitle: 'Direct Quarry Laterite Stone Monsoon Discount Banner',
    sponsorName: 'Dakshina Quarry Outlet',
    bannerType: 'Hero Banner',
    impressionsCount: 28400,
    clicksCount: 1950,
    status: 'ACTIVE'
  }
];

export const MOCK_FINANCING_OFFERS: FinancingOffer[] = [
  {
    id: 'FIN-01',
    offerCode: 'FIN-EQUIP-99',
    partnerName: 'Karnataka Mining & Heavy Equipment Finance Ltd',
    loanType: 'Equipment Finance',
    maxSanctionRs: 15000000,
    interestRatePercent: 8.5,
    tenureMonths: 60,
    approvalTimeHours: 24
  }
];

export const MOCK_MARKETPLACE_ANALYTICS = {
  activeBusinessesCount: 1420,
  totalListingsCount: 8950,
  monthlyGmvRs: 485000000,
  successfulMatchesThisMonth: 1280,
  activeTendersCount: 145,
  financingSanctionedRs: 185000000
};

// MODULES 31 - 48 DATA TYPES & MOCK DATA

export interface VerifiedPartner {
  id: string;
  partnerName: string;
  partnerType: 'Verified Quarry' | 'Verified Crusher' | 'Verified Building Material Dealer' | 'Verified Supplier' | 'Verified Fleet Owner' | 'Verified Vehicle Owner' | 'Verified Equipment Owner' | 'Verified Contractor' | 'Verified Builder' | 'Verified Architect' | 'Verified Engineer' | 'Verified Transport Agency' | 'Verified Machine Operator' | 'Verified Driver' | 'Verified Labour Contractor';
  trustScore: number;
  businessRating: number;
  aiReliabilityScore: number;
  responseTimeMinutes: number;
  orderFulfillmentRatePercent: number;
  complianceStatus: 'FULLY_COMPLIANT' | 'VERIFICATION_PENDING' | 'AUDIT_SCHEDULED';
  yearsInBusiness: number;
  verifications: {
    kycVerified: boolean;
    gstVerified: boolean;
    panVerified: boolean;
    businessLicenseVerified: boolean;
    miningLicenseVerified: boolean;
    insuranceVerified: boolean;
    vehicleRcVerified: boolean;
  };
  reviewsCount: number;
}

export interface AIMatchmakingPair {
  id: string;
  matchType: string;
  partyA: string;
  partyB: string;
  recommendationScore: number;
  matchReasoning: string;
  estimatedDealValueRs: number;
  status: 'RECOMMENDED' | 'CONNECTED' | 'CONTRACT_SIGNED';
}

export interface BusinessSocialNetworkFeed {
  id: string;
  companyName: string;
  companyType: string;
  postTitle: string;
  postType: 'Project Showcase' | 'Product Showcase' | 'Announcement' | 'Success Story' | 'Trade Show Event';
  content: string;
  followersCount: number;
  followingCount: number;
  likesCount: number;
  commentsCount: number;
  postedDate: string;
  eventDetails?: {
    eventName: string;
    location: string;
    eventType: 'Mining Expo' | 'Construction Expo' | 'Trade Show';
  };
}

export interface DigitalRFQItem {
  id: string;
  rfqNumber: string;
  title: string;
  buyerName: string;
  rfqType: 'Multi Supplier RFQ' | 'Multi Dealer RFQ' | 'Custom Material Order';
  materialsRequired: string;
  aiVendorSelectionCount: number;
  aiBestPriceRs: number;
  expiryDate: string;
  status: 'OPEN' | 'NEGOTIATION' | 'APPROVED' | 'EXPIRED';
  quotationHistoryCount: number;
}

export interface DigitalFreightLoad {
  id: string;
  loadNumber: string;
  origin: string;
  destination: string;
  materialType: string;
  quantityTons: number;
  freightType: 'Spot Freight' | 'Contract Freight' | 'Recurring Freight' | 'Return Load Marketplace';
  aiVehicleMatchScore: number;
  aiDriverMatchScore: number;
  emptyTripOptimizationPercent: number;
  biddingRatePerTonRs: number;
  status: 'LIVE' | 'MATCHED' | 'DISPATCHED';
}

export interface MiningLandProperty {
  id: string;
  listingCode: string;
  type: 'Land Available' | 'Land Required' | 'Lease Available' | 'Lease Required';
  location: string;
  areaAcres: number;
  surveyDetails: string;
  gpsCoordinates: string;
  boundaryMapAvailable: boolean;
  legalDocumentsVerified: boolean;
  aiLandMatchScore: number;
  estimatedInvestmentRs: number;
}

export interface InvestmentOpportunity {
  id: string;
  opportunityCode: string;
  title: string;
  opportunityType: 'Joint Venture' | 'Business Partnership' | 'Franchise' | 'Dealer Expansion' | 'Crusher Investment' | 'Quarry Investment' | 'Equipment Investment' | 'Fleet Investment';
  targetCompany: string;
  requiredCapitalRs: number;
  investorProfileTarget: string;
  fundingRequestStatus: 'OPEN' | 'DUE_DILIGENCE' | 'FUNDED';
  expectedRoiPercent: number;
}

export interface FinanceMarketplaceOffer {
  id: string;
  offerId: string;
  financerName: string;
  financerType: 'Bank Marketplace' | 'NBFC Marketplace' | 'Insurance Marketplace';
  category: 'Equipment Finance' | 'Vehicle Finance' | 'Working Capital' | 'Project Finance' | 'Invoice Financing';
  maxFundingRs: number;
  interestRatePercent: number;
  loanEligibilityScore: number;
  aiFinanceRecommendation: string;
}

export interface PublicDirectoryEntry {
  id: string;
  businessName: string;
  category: 'Mining Companies' | 'Quarries' | 'Crusher Units' | 'Dealers' | 'Suppliers' | 'Fleet Owners' | 'Equipment Owners' | 'Contractors' | 'Builders' | 'Architects' | 'Engineers' | 'Consultants' | 'Service Providers';
  isVerified: boolean;
  location: string;
  distanceKm: number;
  googleMapsCoordinates: string;
  phone: string;
  rating: number;
}

export interface ConstructionProcurementBOQ {
  id: string;
  boqCode: string;
  projectName: string;
  ownerType: 'Builder' | 'Contractor' | 'Architect' | 'Project Owner';
  materialsCount: number;
  aiBoqAnalysisStatus: 'ANALYZED' | 'PROCESSING';
  matchedSuppliersCount: number;
  bestQuotationRs: number;
  deliverySchedule: string;
}

export interface UsedAssetItem {
  id: string;
  assetCode: string;
  title: string;
  category: 'Used Quarry Machines' | 'Used Crusher Machines' | 'Used Commercial Vehicles' | 'Used Equipment' | 'Used Generators' | 'Used Spare Parts';
  inspectionReportAvailable: boolean;
  aiValuationRs: number;
  auctionType: 'Live Auction' | 'Direct Negotiation';
  currentBidRs: number;
  conditionRating: string;
}

export interface RentalMarketplaceItem {
  id: string;
  rentalCode: string;
  title: string;
  type: 'Vehicle Rental' | 'Equipment Rental' | 'Machine Rental' | 'Operator Rental' | 'Driver Rental' | 'Labour Rental';
  rentalTerm: 'Trip Rental' | 'Monthly Rental' | 'Contract Rental';
  rateRs: number;
  availabilityCalendar: string;
  providerName: string;
}

export interface AIMarketIntelligenceReport {
  id: string;
  reportTitle: string;
  demandForecast: string;
  priceTrend: string;
  regionalHeatmapLocation: string;
  competitorAnalysis: string;
  marketOpportunity: string;
  seasonalForecast: string;
  growthPredictionPercent: number;
  investmentRecommendation: string;
}

export interface EcosystemAnalyticsOverview {
  marketplaceRevenueRs: number;
  leadConversionRatePercent: number;
  topBuyers: string[];
  topSellers: string[];
  topQuarries: string[];
  topDealers: string[];
  topFleetOwners: string[];
  topEquipmentOwners: string[];
  regionalPerformanceIndex: string;
  marketplaceGrowthYoYPercent: number;
}

export interface SuperAppModuleStatus {
  oneLoginActive: boolean;
  oneWalletBalanceRs: number;
  oneOrderHistoryCount: number;
  oneNotificationCenterUnread: number;
  oneAiAssistantStatus: string;
  offlineModeReady: boolean;
}

export interface GlobalExpansionModule {
  id: string;
  country: string;
  tradeType: 'Export Marketplace' | 'Import Marketplace';
  currency: string;
  languagesSupported: string[];
  internationalLogisticsPartner: string;
  customsReady: boolean;
  globalPartnerCount: number;
}

export interface EnterpriseAPIEndpoint {
  id: string;
  apiName: string;
  category: 'Public APIs' | 'Developer Portal' | 'SDK' | 'Webhook Marketplace' | 'Plugins' | 'App Marketplace';
  endpointUrl: string;
  version: string;
  activeIntegrationsCount: number;
  status: 'STABLE' | 'BETA';
}

export interface FutureTechCapability {
  id: string;
  techName: string;
  category: 'Digital Twin' | 'IoT Ready' | 'Drone Ready' | 'GIS Ready' | 'BIM Ready' | 'AutoCAD Ready' | 'Revit Ready' | 'AR Ready' | 'VR Ready' | 'Voice Commerce' | 'AI Copilot';
  description: string;
  readinessLevelPercent: number;
  status: 'ACTIVE' | 'DEPLOYED';
}

// MOCK DATA FOR MODULES 31 - 48

export const MOCK_VERIFIED_PARTNERS: VerifiedPartner[] = [
  {
    id: 'VP-3101',
    partnerName: 'Dakshina Granite Quarries Ltd',
    partnerType: 'Verified Quarry',
    trustScore: 98,
    businessRating: 4.9,
    aiReliabilityScore: 99,
    responseTimeMinutes: 8,
    orderFulfillmentRatePercent: 99.4,
    complianceStatus: 'FULLY_COMPLIANT',
    yearsInBusiness: 24,
    verifications: {
      kycVerified: true,
      gstVerified: true,
      panVerified: true,
      businessLicenseVerified: true,
      miningLicenseVerified: true,
      insuranceVerified: true,
      vehicleRcVerified: true
    },
    reviewsCount: 142
  },
  {
    id: 'VP-3102',
    partnerName: 'Bantwal Heavy Crusher Plant',
    partnerType: 'Verified Crusher',
    trustScore: 96,
    businessRating: 4.8,
    aiReliabilityScore: 97,
    responseTimeMinutes: 12,
    orderFulfillmentRatePercent: 98.2,
    complianceStatus: 'FULLY_COMPLIANT',
    yearsInBusiness: 16,
    verifications: {
      kycVerified: true,
      gstVerified: true,
      panVerified: true,
      businessLicenseVerified: true,
      miningLicenseVerified: true,
      insuranceVerified: true,
      vehicleRcVerified: true
    },
    reviewsCount: 98
  },
  {
    id: 'VP-3103',
    partnerName: 'Mangalore Building Materials Mega Hub',
    partnerType: 'Verified Building Material Dealer',
    trustScore: 95,
    businessRating: 4.7,
    aiReliabilityScore: 96,
    responseTimeMinutes: 10,
    orderFulfillmentRatePercent: 97.8,
    complianceStatus: 'FULLY_COMPLIANT',
    yearsInBusiness: 12,
    verifications: {
      kycVerified: true,
      gstVerified: true,
      panVerified: true,
      businessLicenseVerified: true,
      miningLicenseVerified: false,
      insuranceVerified: true,
      vehicleRcVerified: true
    },
    reviewsCount: 86
  }
];

export const MOCK_AI_MATCHMAKING_PAIRS: AIMatchmakingPair[] = [
  {
    id: 'MATCH-3201',
    matchType: 'Customers ↔ Quarry',
    partyA: 'Coastal Infra Developers (Kadri Project)',
    partyB: 'Dakshina Granite Quarries Ltd',
    recommendationScore: 98,
    matchReasoning: 'Nearest high-capacity quarry with active stock of 20mm aggregates and optimal haul route.',
    estimatedDealValueRs: 4800000,
    status: 'CONNECTED'
  },
  {
    id: 'MATCH-3202',
    matchType: 'Builders ↔ Contractors',
    partyA: 'Apex Skyrise Builders',
    partyB: 'Mangalore Civil Contractors & Engineers',
    recommendationScore: 95,
    matchReasoning: 'Matched on structural engineering domain experience, equipment fleet capacity, and past BOQ score.',
    estimatedDealValueRs: 12500000,
    status: 'RECOMMENDED'
  },
  {
    id: 'MATCH-3203',
    matchType: 'Quarry ↔ Fleet',
    partyA: 'Bantwal Crusher Hub',
    partyB: 'Coastal Heavy Transport Fleet',
    recommendationScore: 97,
    matchReasoning: '10 Tippers ready within 5 Km radius for return load optimization.',
    estimatedDealValueRs: 1800000,
    status: 'CONTRACT_SIGNED'
  }
];

export const MOCK_BUSINESS_SOCIAL_FEED: BusinessSocialNetworkFeed[] = [
  {
    id: 'FEED-3301',
    companyName: 'Bantwal Stone Crusher Corp',
    companyType: 'Crusher & Material Manufacturer',
    postTitle: 'Showcase: Commissioned New 300 TPH VSI Washing Plant',
    postType: 'Product Showcase',
    content: 'Successfully installed state-of-the-art VSI Crusher producing zero-silt manufactured sand for high-strength concrete.',
    followersCount: 1420,
    followingCount: 180,
    likesCount: 128,
    commentsCount: 24,
    postedDate: '2026-08-07'
  },
  {
    id: 'FEED-3302',
    companyName: 'Karnataka Mining & Heavy Equipment Expo',
    companyType: 'Industry Event Organizer',
    postTitle: 'Announcement: South India Mining & Construction Tech Expo 2026',
    postType: 'Trade Show Event',
    content: 'Join 500+ exhibitors, quarry owners, equipment OEMs, and civil contractors at Bangalore International Exhibition Centre.',
    followersCount: 5800,
    followingCount: 320,
    likesCount: 412,
    commentsCount: 68,
    postedDate: '2026-08-06',
    eventDetails: {
      eventName: 'South India Mining Expo 2026',
      location: 'BIEC, Bengaluru',
      eventType: 'Mining Expo'
    }
  }
];

export const MOCK_DIGITAL_RFQS: DigitalRFQItem[] = [
  {
    id: 'RFQ-3401',
    rfqNumber: 'RFQ-2026-8801',
    title: 'Supply of 5,000 Tons M-Sand & 20mm Aggregates for Smart City Highway',
    buyerName: 'NHAI Highway Infra Private Limited',
    rfqType: 'Multi Supplier RFQ',
    materialsRequired: '3,000 T M-Sand, 2,000 T 20mm Blue Granite',
    aiVendorSelectionCount: 6,
    aiBestPriceRs: 2450000,
    expiryDate: '2026-08-20',
    status: 'NEGOTIATION',
    quotationHistoryCount: 12
  },
  {
    id: 'RFQ-3402',
    rfqNumber: 'RFQ-2026-8802',
    title: 'Ready Mix Concrete Batching Plant Supply Agreement',
    buyerName: 'Ganesh ReadyMix Concrete Ltd',
    rfqType: 'Multi Dealer RFQ',
    materialsRequired: '10,000 T Washed Manufactured Sand',
    aiVendorSelectionCount: 4,
    aiBestPriceRs: 4800000,
    expiryDate: '2026-08-25',
    status: 'OPEN',
    quotationHistoryCount: 8
  }
];

export const MOCK_FREIGHT_EXCHANGE_LOADS: DigitalFreightLoad[] = [
  {
    id: 'FRT-3501',
    loadNumber: 'LOAD-MNG-401',
    origin: 'Bantwal Quarry Hub',
    destination: 'Udupi Smart Highway Site',
    materialType: '20mm Aggregate',
    quantityTons: 420,
    freightType: 'Return Load Marketplace',
    aiVehicleMatchScore: 99,
    aiDriverMatchScore: 98,
    emptyTripOptimizationPercent: 88,
    biddingRatePerTonRs: 380,
    status: 'LIVE'
  },
  {
    id: 'FRT-3502',
    loadNumber: 'LOAD-MNG-402',
    origin: 'Moodbidri Laterite Quarry',
    destination: 'Panambur Port Warehouse',
    materialType: 'Laterite Stone Blocks',
    quantityTons: 1200,
    freightType: 'Contract Freight',
    aiVehicleMatchScore: 96,
    aiDriverMatchScore: 95,
    emptyTripOptimizationPercent: 74,
    biddingRatePerTonRs: 420,
    status: 'DISPATCHED'
  }
];

export const MOCK_MINING_LAND_PROPERTIES: MiningLandProperty[] = [
  {
    id: 'LND-3601',
    listingCode: 'LAND-MNG-09',
    type: 'Lease Available',
    location: 'Belthangady Mining Corridor',
    areaAcres: 14.5,
    surveyDetails: 'Survey No. 142/1A, Category 1 Granite Mine Permit',
    gpsCoordinates: '13.0124° N, 75.2412° E',
    boundaryMapAvailable: true,
    legalDocumentsVerified: true,
    aiLandMatchScore: 96,
    estimatedInvestmentRs: 28000000
  },
  {
    id: 'LND-3602',
    listingCode: 'LAND-MNG-10',
    type: 'Land Available',
    location: 'Karkala Industrial Zone',
    areaAcres: 22.0,
    surveyDetails: 'Survey No. 88/3, Crusher Unit Permitted Land',
    gpsCoordinates: '13.2188° N, 74.9912° E',
    boundaryMapAvailable: true,
    legalDocumentsVerified: true,
    aiLandMatchScore: 94,
    estimatedInvestmentRs: 42000000
  }
];

export const MOCK_INVESTMENT_OPPORTUNITIES: InvestmentOpportunity[] = [
  {
    id: 'INV-3701',
    opportunityCode: 'INV-JV-2026',
    title: 'Joint Venture: 500 TPH Automated Granite Crusher Expansion',
    opportunityType: 'Joint Venture',
    targetCompany: 'Coastal Crusher Hub Pvt Ltd',
    requiredCapitalRs: 35000000,
    investorProfileTarget: 'Mining Investors & High Net Worth Partners',
    fundingRequestStatus: 'DUE_DILIGENCE',
    expectedRoiPercent: 22.5
  },
  {
    id: 'INV-3702',
    opportunityCode: 'INV-FLEET-88',
    title: 'Fleet Expansion: 15 Heavy Tippers Off-Take Partnership',
    opportunityType: 'Fleet Investment',
    targetCompany: 'Mangalore Logistics Alliance',
    requiredCapitalRs: 18000000,
    investorProfileTarget: 'Transport & Logistics Investors',
    fundingRequestStatus: 'OPEN',
    expectedRoiPercent: 19.8
  }
];

export const MOCK_FINANCE_MARKETPLACE_OFFERS: FinanceMarketplaceOffer[] = [
  {
    id: 'FIN-3801',
    offerId: 'FIN-EQUIP-8801',
    financerName: 'HDFC Bank Equipment Finance Division',
    financerType: 'Bank Marketplace',
    category: 'Equipment Finance',
    maxFundingRs: 25000000,
    interestRatePercent: 8.25,
    loanEligibilityScore: 96,
    aiFinanceRecommendation: 'Pre-approved based on 3-year quarry cashflow and active POs.'
  },
  {
    id: 'FIN-3802',
    offerId: 'FIN-INV-8802',
    financerName: 'Tata Capital NBFC Working Capital',
    financerType: 'NBFC Marketplace',
    category: 'Invoice Financing',
    maxFundingRs: 15000000,
    interestRatePercent: 9.5,
    loanEligibilityScore: 94,
    aiFinanceRecommendation: 'Instant 80% invoice discounting for NHAI/PWD supply invoices.'
  }
];

export const MOCK_PUBLIC_DIRECTORY_ENTRIES: PublicDirectoryEntry[] = [
  {
    id: 'DIR-3901',
    businessName: 'Mangalore Smart Quarries & Crusher Alliance',
    category: 'Quarries',
    isVerified: true,
    location: 'Bantwal Industrial Estate',
    distanceKm: 4.2,
    googleMapsCoordinates: '12.8912, 75.0211',
    phone: '+91 98450 11223',
    rating: 4.9
  },
  {
    id: 'DIR-3902',
    businessName: 'Coastal Heavy Equipment & Tipper Fleet Corp',
    category: 'Fleet Owners',
    isVerified: true,
    location: 'Baikampady Industrial Area',
    distanceKm: 8.5,
    googleMapsCoordinates: '12.9412, 74.8211',
    phone: '+91 99001 44556',
    rating: 4.8
  }
];

export const MOCK_CONSTRUCTION_PROCUREMENT_BOQS: ConstructionProcurementBOQ[] = [
  {
    id: 'BOQ-4001',
    boqCode: 'BOQ-2026-SKYLINE',
    projectName: 'Skyline Commercial Towers (18 Floors)',
    ownerType: 'Builder',
    materialsCount: 18,
    aiBoqAnalysisStatus: 'ANALYZED',
    matchedSuppliersCount: 8,
    bestQuotationRs: 38500000,
    deliverySchedule: 'Phased Staggered Delivery (Aug 2026 - Dec 2026)'
  }
];

export const MOCK_USED_ASSETS: UsedAssetItem[] = [
  {
    id: 'USED-4101',
    assetCode: 'USED-CAT-320',
    title: 'CAT 320D Heavy Hydraulic Excavator (4,200 Hrs Run)',
    category: 'Used Equipment',
    inspectionReportAvailable: true,
    aiValuationRs: 4200000,
    auctionType: 'Live Auction',
    currentBidRs: 4450000,
    conditionRating: 'EXCELLENT (4.8/5)'
  },
  {
    id: 'USED-4102',
    assetCode: 'USED-GEN-125',
    title: 'Cummins 125 kVA Silent Diesel Generator for Quarry Site',
    category: 'Used Generators',
    inspectionReportAvailable: true,
    aiValuationRs: 650000,
    auctionType: 'Direct Negotiation',
    currentBidRs: 680000,
    conditionRating: 'OPERATIONAL (4.5/5)'
  }
];

export const MOCK_RENTAL_MARKETPLACE_ITEMS: RentalMarketplaceItem[] = [
  {
    id: 'RNT-4201',
    rentalCode: 'RNT-JCB-88',
    title: 'JCB 3CX Backhoe Loader with Experienced Operator',
    type: 'Equipment Rental',
    rentalTerm: 'Monthly Rental',
    rateRs: 125000,
    availabilityCalendar: 'Immediate Availability (28 Days Open)',
    providerName: 'Coastal Machinery Rentals'
  },
  {
    id: 'RNT-4202',
    rentalCode: 'RNT-TIP-10',
    title: '10-Wheel 25-Ton Heavy Tipper Tri-Axle Truck',
    type: 'Vehicle Rental',
    rentalTerm: 'Trip Rental',
    rateRs: 3800,
    availabilityCalendar: 'Available Today',
    providerName: 'Mangalore Logistics Alliance'
  }
];

export const MOCK_AI_MARKET_INTELLIGENCE: AIMarketIntelligenceReport[] = [
  {
    id: 'INTEL-4301',
    reportTitle: 'Q3 2026 Karnataka Coastal Belt Aggregate & M-Sand Outlook',
    demandForecast: '+18.4% MoM Demand surge due to NH66 highway flyovers & Smart City projects.',
    priceTrend: 'Aggregate prices stable at ₹38/Cft; M-Sand trending +2.5% due to river sand restrictions.',
    regionalHeatmapLocation: 'Mangalore-Udupi Industrial Corridor',
    competitorAnalysis: '12 active crusher units operating at 88% average capacity.',
    marketOpportunity: 'High demand for washed plastering sand in residential high-rises.',
    seasonalForecast: 'Monsoon stock buffering recommended before heavy downpours.',
    growthPredictionPercent: 21.5,
    investmentRecommendation: 'Invest in secondary VSI crusher units and washed sand settling tanks.'
  }
];

export const MOCK_ECOSYSTEM_ANALYTICS_DATA: EcosystemAnalyticsOverview = {
  marketplaceRevenueRs: 148500000,
  leadConversionRatePercent: 34.2,
  topBuyers: ['NHAI Highway Infra', 'Ganesh Builders', 'Hegde Developers', 'Apex Skyrise'],
  topSellers: ['Dakshina Granite Quarries', 'Bantwal Crusher Hub', 'Coastal Building Materials'],
  topQuarries: ['Dakshina Granite Quarries Ltd', 'Belthangady Mining Corridor'],
  topDealers: ['Mangalore Material Hub', 'Udupi Building Supply Co'],
  topFleetOwners: ['Coastal Heavy Fleet', 'Mangalore Logistics Alliance'],
  topEquipmentOwners: ['Coastal Machinery Rentals', 'Karnataka Heavy Cranes'],
  regionalPerformanceIndex: 'Dakshina Kannada & Udupi (Index 98.4/100)',
  marketplaceGrowthYoYPercent: 142.8
};

export const MOCK_SUPER_APP_STATUS: SuperAppModuleStatus = {
  oneLoginActive: true,
  oneWalletBalanceRs: 845000,
  oneOrderHistoryCount: 142,
  oneNotificationCenterUnread: 5,
  oneAiAssistantStatus: 'GEMINI AI COPILOT ACTIVE',
  offlineModeReady: true
};

export const MOCK_GLOBAL_EXPANSION_ITEMS: GlobalExpansionModule[] = [
  {
    id: 'GLOB-4601',
    country: 'United Arab Emirates (Dubai / Abu Dhabi)',
    tradeType: 'Export Marketplace',
    currency: 'AED (Dirhams) / USD ($)',
    languagesSupported: ['English', 'Arabic', 'Hindi'],
    internationalLogisticsPartner: 'DP World & Maersk Logistics',
    customsReady: true,
    globalPartnerCount: 28
  },
  {
    id: 'GLOB-4602',
    country: 'Oman & Qatar Corridor',
    tradeType: 'Export Marketplace',
    currency: 'OMR / QAR / USD',
    languagesSupported: ['English', 'Arabic'],
    internationalLogisticsPartner: 'Salalah Port Services',
    customsReady: true,
    globalPartnerCount: 16
  }
];

export const MOCK_ENTERPRISE_APIS: EnterpriseAPIEndpoint[] = [
  {
    id: 'API-4701',
    apiName: 'B2B Material Order & Dispatch Webhook API',
    category: 'Public APIs',
    endpointUrl: 'https://api.rzminetrix.com/v1/orders/dispatch-webhook',
    version: 'v1.4.0',
    activeIntegrationsCount: 142,
    status: 'STABLE'
  },
  {
    id: 'API-4702',
    apiName: 'AI Load & Tipper Matchmaking SDK',
    category: 'SDK',
    endpointUrl: '@rzminetrix/ai-freight-sdk-ts',
    version: 'v2.1.0',
    activeIntegrationsCount: 88,
    status: 'STABLE'
  }
];

export const MOCK_FUTURE_TECH_CAPABILITIES: FutureTechCapability[] = [
  {
    id: 'TECH-4801',
    techName: 'Quarry 3D Digital Twin & Drone GIS Mapping',
    category: 'Digital Twin',
    description: 'Photogrammetry drone surveys rendered in 3D WebGL for volumetric pit calculation.',
    readinessLevelPercent: 98,
    status: 'ACTIVE'
  },
  {
    id: 'TECH-4802',
    techName: 'BIM & AutoCAD Material Quantities Auto-Extractor',
    category: 'BIM Ready',
    description: 'Direct parsing of Revit & AutoCAD DWG files into RZ Minetrix BOQ tenders.',
    readinessLevelPercent: 95,
    status: 'DEPLOYED'
  },
  {
    id: 'TECH-4803',
    techName: 'Voice Commerce & Multi-Lingual AI Copilot',
    category: 'Voice Commerce',
    description: 'Order aggregates, book tippers, and check quarry stock via Kannada/Tulu/Hindi voice commands.',
    readinessLevelPercent: 100,
    status: 'ACTIVE'
  }
];

