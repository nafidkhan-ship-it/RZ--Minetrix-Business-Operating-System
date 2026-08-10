export interface LeadItem {
  id: string;
  leadNo: string;
  contactName: string;
  companyName: string;
  phone: string;
  source: 'Website' | 'WhatsApp' | 'Public Marketplace' | 'Facebook' | 'Instagram' | 'Google' | 'Referral' | 'Walk-in';
  materialNeeded: string;
  estimatedTons: number;
  estimatedBudgetRs: number;
  leadScore: number;
  stage: 'New Ingest' | 'Qualified' | 'Proposal Sent' | 'Negotiation' | 'Converted' | 'Dropped';
  assignedTo: string;
  territory: string;
  createdAt: string;
}

export interface Customer360 {
  id: string;
  customerCode: string;
  name: string;
  category: 'Infrastructure Developer' | 'Building Material Dealer' | 'Civil Contractor' | 'Individual Home Builder' | 'Quarry Partner';
  kycStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
  creditLimitRs: number;
  usedCreditRs: number;
  walletBalanceRs: number;
  totalOrdersCount: number;
  lifetimeValueRs: number;
  primaryPhone: string;
  gstin: string;
  creditScore: number;
  healthScore: number;
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH';
  deliveryLocations: { siteName: string; address: string; gps: { lat: number; lng: number } }[];
  timeline: { id: string; date: string; type: 'Call' | 'Order' | 'Payment' | 'Ticket' | 'Site Visit'; note: string }[];
  purchaseHistory: { orderId: string; date: string; itemsSummary: string; amountRs: number; status: string }[];
  ledger: { date: string; debitRs: number; creditRs: number; balanceRs: number; refNo: string; remarks: string }[];
  documents: { name: string; type: string; url: string; verified: boolean }[];
}

export interface FieldSalesExecutive {
  id: string;
  execCode: string;
  name: string;
  phone: string;
  beatName: string;
  dailyVisitCount: number;
  targetTons: number;
  achievedTons: number;
  gpsStatus: 'CHECKED_IN' | 'CHECKED_OUT' | 'IN_TRANSIT';
  currentLocation: string;
  dailyAllowanceRs: number;
  travelAllowanceRs: number;
  incentiveEarnedRs: number;
  collectionsTodayRs: number;
}

export interface ChannelPartner {
  id: string;
  code: string;
  name: string;
  type: 'Dealer' | 'Distributor' | 'Retailer' | 'Wholesaler' | 'Builder' | 'Contractor' | 'Architect' | 'Engineer';
  approvalStatus: 'APPROVED' | 'PENDING' | 'REJECTED';
  walletBalanceRs: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  commissionEarnedRs: number;
  projectsCompleted: number;
  contactPerson: string;
  phone: string;
}

export interface ProjectCRMItem {
  id: string;
  projectCode: string;
  projectName: string;
  category: 'House Project' | 'Commercial Project' | 'Apartment Project' | 'Villa Project' | 'Industrial Project' | 'Infrastructure';
  location: string;
  budgetRs: number;
  boqTotalRs: number;
  materialRequired: string;
  supplyProgressPercent: number;
  status: 'Planning' | 'Under Construction' | 'Finishing' | 'Handed Over';
  builderContractorName: string;
}

export interface DigitalMarketingCampaign {
  id: string;
  campaignNo: string;
  title: string;
  channel: 'WhatsApp' | 'Email' | 'SMS' | 'Push' | 'Google Ads' | 'Facebook' | 'Instagram';
  landingPageUrl: string;
  impressions: number;
  clicksCount: number;
  leadsGenerated: number;
  spendRs: number;
  revenueGeneratedRs: number;
  roiPercent: number;
  status: 'Active' | 'Scheduled' | 'Completed';
}

export interface LoyaltyMember {
  id: string;
  memberCode: string;
  name: string;
  role: 'Customer' | 'Dealer' | 'Partner';
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  rewardPoints: number;
  cashbackEarnedRs: number;
  activeCoupons: string[];
  referralCode: string;
  successfulReferrals: number;
}

export interface CustomerSuccessMetric {
  customerId: string;
  customerName: string;
  csatScore: number;
  npsScore: number;
  churnProbabilityPercent: number;
  renewalDate: string;
  activeTasksCount: number;
  aiRecommendation: string;
}

export interface AISalesCopilotInsight {
  leadId: string;
  leadName: string;
  qualificationStatus: 'HOT' | 'WARM' | 'COLD';
  winProbabilityPercent: number;
  forecastRevenueRs: number;
  suggestedPriceRsPerTon: number;
  crossSellOpportunities: string[];
  nextBestAction: string;
  meetingSummary: string;
}

export interface AIConstructionConsultation {
  id: string;
  clientName: string;
  planType: '2BHK Villa' | '3BHK Residential' | 'Commercial Complex' | 'Apartment Complex';
  drawingOcrStatus: 'PROCESSED' | 'PENDING';
  estimatedLateriteBlocks: number;
  estimatedCrushedAggTons: number;
  estimatedMSandTons: number;
  estimatedPSandTons: number;
  estimatedCementBags: number;
  estimatedSteelTons: number;
  totalProjectCostRs: number;
  recommendedNearestQuarry: string;
  recommendedDealer: string;
  recommendedTransporter: string;
}

export interface PublicMarketplaceLead {
  id: string;
  leadTitle: string;
  category: 'House Construction' | 'Commercial Building' | 'Apartment' | 'Government Tender' | 'Private Project' | 'Contractor Tender';
  location: string;
  estimatedTonnage: number;
  estimatedBudgetRs: number;
  postedDate: string;
  bidsCount: number;
  status: 'OPEN_FOR_BID' | 'ASSIGNED' | 'EXPIRED';
}

export interface FutureReadyFeature {
  id: string;
  featureName: string;
  category: 'WhatsApp Commerce' | 'Video Consultation' | 'Voice CRM' | 'Digital Contracts' | 'AutoCAD/BIM Ready' | 'AR Preview' | 'AI Voice Calling';
  status: 'LIVE' | 'BETA' | 'READY';
  integrationEndpoint: string;
}

export interface QuotationRecord {
  id: string;
  quoteNo: string;
  customerName: string;
  quoteType: 'Material Supply' | 'Construction BOQ' | 'Vehicle Fleet Rental' | 'Heavy Machinery' | 'Turnkey Transport';
  items: { description: string; qty: number; unit: string; unitPriceRs: number; totalRs: number }[];
  subtotalRs: number;
  freightChargeRs: number;
  discountRs: number;
  totalAmountRs: number;
  version: number;
  approvalStatus: 'APPROVED' | 'PENDING_APPROVAL' | 'REJECTED';
  isDigitallySigned: boolean;
  validTill: string;
}

export interface FollowUpTask {
  id: string;
  customerOrLeadName: string;
  type: 'Call Schedule' | 'Meeting' | 'WhatsApp Follow-up' | 'Email' | 'Site Visit';
  scheduledDate: string;
  scheduledTime: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Completed' | 'Overdue';
  assignedAgent: string;
  aiSuggestionNote: string;
}

export interface DealerRecord {
  id: string;
  dealerCode: string;
  name: string;
  territory: string;
  monthlyTargetTons: number;
  achievedTons: number;
  incentiveEarnedRs: number;
  walletBalanceRs: number;
  rating: number;
  activeContractorsCount: number;
}

export interface SupplierRecord {
  id: string;
  supplierCode: string;
  name: string;
  category: 'Explosives & Blasting' | 'Heavy Machinery Spare Parts' | 'Diesel & Lubricants' | 'Raw Stone Aggregates' | 'TMT Steel & Cement';
  vendorRatingScore: number;
  deliveryOnTimePercent: number;
  activeAgreementsCount: number;
  totalProcurementVolumeRs: number;
}

export interface SupportTicket {
  id: string;
  ticketNo: string;
  customerName: string;
  issueCategory: 'Material Quality Dispute' | 'Weighbridge Ticket Discrepancy' | 'Tipper Delivery Delay' | 'Machinery Breakdown' | 'Billing Dispute';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  assignedTechnician: string;
  createdAt: string;
  resolutionTimeHours: number;
}

export interface MarketingCampaign {
  id: string;
  title: string;
  channel: 'WhatsApp Broadcast' | 'Email' | 'SMS' | 'Social Ad' | 'Coupon Offer';
  targetAudience: string;
  reachCount: number;
  conversionRatePercent: number;
  revenueGeneratedRs: number;
  status: 'Active' | 'Scheduled' | 'Completed';
}

export interface JobListing {
  id: string;
  jobCode: string;
  title: string;
  roleCategory: 'Tipper Driver' | 'Excavator Operator' | 'Rock Breaker Tech' | 'Quarry Site Supervisor' | 'Sales Executive';
  location: string;
  salaryRangeRs: string;
  applicantsCount: number;
  status: 'Open' | 'Closed';
}

export interface DigitalAgreement {
  id: string;
  agreementNo: string;
  partyName: string;
  agreementType: 'Customer Supply' | 'Dealer Franchise' | 'Vendor Procurement' | 'Equipment Lease' | 'Transport Contract';
  startDate: string;
  expiryDate: string;
  isSigned: boolean;
  qrVerifiedCode: string;
  status: 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED';
}

export const MOCK_PHASE20_LEADS: LeadItem[] = [
  {
    id: 'LEAD-101',
    leadNo: 'LD-2026-001',
    contactName: 'Rajesh Hegde',
    companyName: 'Hegde Infra & Developers',
    phone: '+91 98451 22334',
    source: 'WhatsApp',
    materialNeeded: 'Washed M-Sand & 20mm Crushed Aggregates',
    estimatedTons: 1200,
    estimatedBudgetRs: 850000,
    leadScore: 92,
    stage: 'Proposal Sent',
    assignedTo: 'Vikram Sharma (Senior Sales Mgr)',
    territory: 'Mangalore Coastal Circle',
    createdAt: '2026-08-05'
  },
  {
    id: 'LEAD-102',
    leadNo: 'LD-2026-002',
    contactName: 'Suresh Bhat',
    companyName: 'Karnataka Road Builders',
    phone: '+91 94482 11900',
    source: 'Public Marketplace',
    materialNeeded: 'Laterite Stone Blocks & Sub-Base Aggregate',
    estimatedTons: 3500,
    estimatedBudgetRs: 2400000,
    leadScore: 88,
    stage: 'Negotiation',
    assignedTo: 'Ananya Rao (Key Account Executive)',
    territory: 'Udupi-Kundapura Corridor',
    createdAt: '2026-08-06'
  },
  {
    id: 'LEAD-103',
    leadNo: 'LD-2026-003',
    contactName: 'Mohammad Tariq',
    companyName: 'Coastline Commercial Complex',
    phone: '+91 97410 88776',
    source: 'Website',
    materialNeeded: 'P-Sand & TMT Steel Rebars',
    estimatedTons: 450,
    estimatedBudgetRs: 420000,
    leadScore: 74,
    stage: 'Qualified',
    assignedTo: 'Rohan Naik (Sales Officer)',
    territory: 'Bantwal-Beltangady Zone',
    createdAt: '2026-08-06'
  },
  {
    id: 'LEAD-104',
    leadNo: 'LD-2026-004',
    contactName: 'Ganesh Shenoy',
    companyName: 'Shenoy Bricks & Yards',
    phone: '+91 99002 33445',
    source: 'Referral',
    materialNeeded: 'Quarry Dust & 40mm Metal',
    estimatedTons: 800,
    estimatedBudgetRs: 520000,
    leadScore: 81,
    stage: 'New Ingest',
    assignedTo: 'Vikram Sharma (Senior Sales Mgr)',
    territory: 'Moodabidri Mining Belt',
    createdAt: '2026-08-07'
  }
];

export const MOCK_PHASE20_CUSTOMERS: Customer360[] = [
  {
    id: 'CUST-301',
    customerCode: 'CUST-MNG-088',
    name: 'Mangalore Smart Infra Private Limited',
    category: 'Infrastructure Developer',
    kycStatus: 'VERIFIED',
    creditLimitRs: 5000000,
    usedCreditRs: 1850000,
    walletBalanceRs: 340000,
    totalOrdersCount: 42,
    lifetimeValueRs: 18400000,
    primaryPhone: '+91 824 2490011',
    gstin: '29AAACM3319K1ZM',
    creditScore: 820,
    healthScore: 94,
    riskScore: 'LOW',
    deliveryLocations: [
      { siteName: 'Site #1 NH-66 Flyover Expansion', address: 'Kuntikana Junction, Mangalore', gps: { lat: 12.89, lng: 74.84 } },
      { siteName: 'Site #2 Port Highway Road Works', address: 'Panambur Industrial Area', gps: { lat: 12.95, lng: 74.81 } }
    ],
    timeline: [
      { id: 'TL-1', date: '2026-08-06', type: 'Payment', note: 'Received ₹4,50,000 via NEFT against Invoice #INV-2026-889' },
      { id: 'TL-2', date: '2026-08-04', type: 'Order', note: 'Placed order for 250 Tons Washed M-Sand via Customer Portal' },
      { id: 'TL-3', date: '2026-08-02', type: 'Site Visit', note: 'Key Account Executive Ananya inspected site stockyard' }
    ],
    purchaseHistory: [
      { orderId: 'ORD-8801', date: '2026-08-04', itemsSummary: '250T Washed M-Sand', amountRs: 170000, status: 'DELIVERED' },
      { orderId: 'ORD-8712', date: '2026-07-28', itemsSummary: '500T 20mm Blue Metal', amountRs: 310000, status: 'DELIVERED' }
    ],
    ledger: [
      { date: '2026-08-06', debitRs: 0, creditRs: 450000, balanceRs: 1850000, refNo: 'NEFT-88912', remarks: 'NEFT Receipt' },
      { date: '2026-08-04', debitRs: 170000, creditRs: 0, balanceRs: 2300000, refNo: 'INV-2026-8801', remarks: 'M-Sand Supply' }
    ],
    documents: [
      { name: 'GST Certificate.pdf', type: 'GSTIN', url: '/docs/gst.pdf', verified: true },
      { name: 'PAN & Director Board Resolution.pdf', type: 'KYC', url: '/docs/kyc.pdf', verified: true }
    ]
  },
  {
    id: 'CUST-302',
    customerCode: 'CUST-UDU-012',
    name: 'Coastal Building Supplies & Dealer Hub',
    category: 'Building Material Dealer',
    kycStatus: 'VERIFIED',
    creditLimitRs: 3000000,
    usedCreditRs: 890000,
    walletBalanceRs: 120000,
    totalOrdersCount: 88,
    lifetimeValueRs: 29500000,
    primaryPhone: '+91 820 2521199',
    gstin: '29ABCCD9981P1ZX',
    creditScore: 760,
    healthScore: 88,
    riskScore: 'LOW',
    deliveryLocations: [
      { siteName: 'Main Storage Yard #1', address: 'Kadiyali Main Road, Udupi', gps: { lat: 13.34, lng: 74.75 } }
    ],
    timeline: [
      { id: 'TL-4', date: '2026-08-05', type: 'Order', note: 'Dispatched 12 Tipper Loads of 20mm Aggregates' }
    ],
    purchaseHistory: [
      { orderId: 'ORD-7710', date: '2026-08-05', itemsSummary: '12 Tipper Loads 20mm Aggregate', amountRs: 144000, status: 'DELIVERED' }
    ],
    ledger: [
      { date: '2026-08-05', debitRs: 144000, creditRs: 0, balanceRs: 890000, refNo: 'INV-7710', remarks: 'Dealer Stock Delivery' }
    ],
    documents: [
      { name: 'Dealer License & Lease Agreement.pdf', type: 'LICENSE', url: '/docs/dealer.pdf', verified: true }
    ]
  }
];

export const MOCK_PHASE20_SALES_EXECS: FieldSalesExecutive[] = [
  {
    id: 'EXEC-01',
    execCode: 'SFA-MNG-01',
    name: 'Vikram Sharma',
    phone: '+91 98450 11223',
    beatName: 'Mangalore Port & Highway Beat',
    dailyVisitCount: 6,
    targetTons: 2500,
    achievedTons: 2180,
    gpsStatus: 'CHECKED_IN',
    currentLocation: 'Kuntikana Flyover Site Yard',
    dailyAllowanceRs: 850,
    travelAllowanceRs: 1400,
    incentiveEarnedRs: 42000,
    collectionsTodayRs: 450000
  },
  {
    id: 'EXEC-02',
    execCode: 'SFA-UDU-02',
    name: 'Ananya Rao',
    phone: '+91 94481 33445',
    beatName: 'Udupi-Manipal Crusher & Yard Beat',
    dailyVisitCount: 8,
    targetTons: 1800,
    achievedTons: 1750,
    gpsStatus: 'IN_TRANSIT',
    currentLocation: 'Kadiyali Commercial Zone',
    dailyAllowanceRs: 850,
    travelAllowanceRs: 1100,
    incentiveEarnedRs: 38500,
    collectionsTodayRs: 280000
  }
];

export const MOCK_PHASE20_CHANNEL_PARTNERS: ChannelPartner[] = [
  {
    id: 'CP-01',
    code: 'CP-MNG-101',
    name: 'Dakshina Kannada Building Supplies Outlet',
    type: 'Dealer',
    approvalStatus: 'APPROVED',
    walletBalanceRs: 85000,
    tier: 'Platinum',
    commissionEarnedRs: 245000,
    projectsCompleted: 34,
    contactPerson: 'Suresh Poojary',
    phone: '+91 98441 88990'
  },
  {
    id: 'CP-02',
    code: 'CP-UDU-202',
    name: 'Coastal Structural Engineers & Architects',
    type: 'Architect',
    approvalStatus: 'APPROVED',
    walletBalanceRs: 42000,
    tier: 'Gold',
    commissionEarnedRs: 118000,
    projectsCompleted: 19,
    contactPerson: 'Ar. Nidhi Shetty',
    phone: '+91 97412 55667'
  }
];

export const MOCK_PHASE20_PROJECTS: ProjectCRMItem[] = [
  {
    id: 'PRJ-101',
    projectCode: 'PRJ-MNG-880',
    projectName: 'Oceanic Horizon 14-Storey Apartments',
    category: 'Apartment Project',
    location: 'Kadri Hills, Mangalore',
    budgetRs: 45000000,
    boqTotalRs: 12500000,
    materialRequired: 'Washed M-Sand, P-Sand & 20mm Aggregates',
    supplyProgressPercent: 68,
    status: 'Under Construction',
    builderContractorName: 'Hegde Infra & Developers'
  },
  {
    id: 'PRJ-102',
    projectCode: 'PRJ-UDU-992',
    projectName: 'Sri Krishna Villa Enclave (12 Units)',
    category: 'Villa Project',
    location: 'Manipal End Point Road',
    budgetRs: 28000000,
    boqTotalRs: 7200000,
    materialRequired: 'Laterite Stone Blocks & Sub-Base Aggregates',
    supplyProgressPercent: 42,
    status: 'Under Construction',
    builderContractorName: 'Coastal Housing & Builders'
  }
];

export const MOCK_PHASE20_MARKETING_CAMPAIGNS: DigitalMarketingCampaign[] = [
  {
    id: 'CAMP-301',
    campaignNo: 'CAMP-2026-M01',
    title: 'Monsoon Crusher Price Freeze WhatsApp Broadcast',
    channel: 'WhatsApp',
    landingPageUrl: 'https://minetrix.app/offers/monsoon2026',
    impressions: 14500,
    clicksCount: 2840,
    leadsGenerated: 142,
    spendRs: 18000,
    revenueGeneratedRs: 3850000,
    roiPercent: 2128,
    status: 'Active'
  },
  {
    id: 'CAMP-302',
    campaignNo: 'CAMP-2026-M02',
    title: 'Laterite Quarry Direct Homebuilder Ads',
    channel: 'Facebook',
    landingPageUrl: 'https://minetrix.app/laterite-direct',
    impressions: 48000,
    clicksCount: 3910,
    leadsGenerated: 88,
    spendRs: 35000,
    revenueGeneratedRs: 1920000,
    roiPercent: 538,
    status: 'Active'
  }
];

export const MOCK_PHASE20_LOYALTY: LoyaltyMember[] = [
  {
    id: 'LOY-01',
    memberCode: 'LOY-CUST-881',
    name: 'Mangalore Smart Infra',
    role: 'Customer',
    tier: 'Platinum',
    rewardPoints: 14500,
    cashbackEarnedRs: 72500,
    activeCoupons: ['MONSOON5000', 'FREIGHTFREE20'],
    referralCode: 'SMARTINFRA2026',
    successfulReferrals: 8
  },
  {
    id: 'LOY-02',
    memberCode: 'LOY-DLR-402',
    name: 'Dakshina Kannada Building Depot',
    role: 'Dealer',
    tier: 'Gold',
    rewardPoints: 9800,
    cashbackEarnedRs: 49000,
    activeCoupons: ['DEALERBOOST2'],
    referralCode: 'DKDEPOT99',
    successfulReferrals: 12
  }
];

export const MOCK_PHASE20_CSAT: CustomerSuccessMetric[] = [
  {
    customerId: 'CUST-301',
    customerName: 'Mangalore Smart Infra Private Limited',
    csatScore: 4.9,
    npsScore: 92,
    churnProbabilityPercent: 2.1,
    renewalDate: '2026-12-31',
    activeTasksCount: 1,
    aiRecommendation: 'High loyalty score! Pitch annual volume rebate agreement with zero delivery surcharge.'
  },
  {
    customerId: 'CUST-302',
    customerName: 'Coastal Building Supplies & Dealer Hub',
    csatScore: 4.7,
    npsScore: 84,
    churnProbabilityPercent: 5.4,
    renewalDate: '2026-09-30',
    activeTasksCount: 0,
    aiRecommendation: 'Stable performance. Schedule quarter end review for incentive payout.'
  }
];

export const MOCK_PHASE20_AI_COPILOT: AISalesCopilotInsight[] = [
  {
    leadId: 'LEAD-101',
    leadName: 'Rajesh Hegde (Hegde Infra)',
    qualificationStatus: 'HOT',
    winProbabilityPercent: 92,
    forecastRevenueRs: 850000,
    suggestedPriceRsPerTon: 675,
    crossSellOpportunities: ['10-Wheeler Fleet Rental', 'Rock Breaker Hiring'],
    nextBestAction: 'Send digital agreement with 2% early settlement discount on advance payment.',
    meetingSummary: 'Client requires 1,200 Tons Washed M-Sand for Kadri Hills apartment slab casting by Aug 15.'
  },
  {
    leadId: 'LEAD-102',
    leadName: 'Suresh Bhat (Karnataka Road Builders)',
    qualificationStatus: 'HOT',
    winProbabilityPercent: 88,
    forecastRevenueRs: 2400000,
    suggestedPriceRsPerTon: 540,
    crossSellOpportunities: ['Sub-Base Granular Aggregates', 'Laterite Blocks'],
    nextBestAction: 'Verify multi-axle tipper access route at Udupi bypass construction site.',
    meetingSummary: 'Road contractor needs continuous supply of 3,500 Tons laterite and sub-base over 30 days.'
  }
];

export const MOCK_PHASE20_AI_CONSTRUCTION: AIConstructionConsultation[] = [
  {
    id: 'CONS-2026-01',
    clientName: 'Shri K. V. Prabhu (Residential Villa Builder)',
    planType: '2BHK Villa',
    drawingOcrStatus: 'PROCESSED',
    estimatedLateriteBlocks: 4200,
    estimatedCrushedAggTons: 380,
    estimatedMSandTons: 420,
    estimatedPSandTons: 180,
    estimatedCementBags: 1100,
    estimatedSteelTons: 14.5,
    totalProjectCostRs: 3850000,
    recommendedNearestQuarry: 'Bantwal Quarry Hub #2 (8.4 Km)',
    recommendedDealer: 'Dakshina Kannada Building Depot',
    recommendedTransporter: 'RZ Express Tipper Logistics'
  }
];

export const MOCK_PHASE20_PUBLIC_MARKETPLACE: PublicMarketplaceLead[] = [
  {
    id: 'MKT-LEAD-881',
    leadTitle: 'National Highway NH-66 Culvert Reconstruction Material Tender',
    category: 'Government Tender',
    location: 'Surathkal - Mulki Corridor',
    estimatedTonnage: 8500,
    estimatedBudgetRs: 5800000,
    postedDate: '2026-08-06',
    bidsCount: 4,
    status: 'OPEN_FOR_BID'
  },
  {
    id: 'MKT-LEAD-882',
    leadTitle: 'Commercial Mall Masonry Stone Requirement (12,000 Blocks)',
    category: 'Commercial Building',
    location: 'Deralakatte Medical Hub',
    estimatedTonnage: 2400,
    estimatedBudgetRs: 1680000,
    postedDate: '2026-08-07',
    bidsCount: 2,
    status: 'OPEN_FOR_BID'
  }
];

export const MOCK_PHASE20_FUTURE_FEATURES: FutureReadyFeature[] = [
  {
    id: 'FUT-01',
    featureName: 'WhatsApp Conversational Commerce Engine',
    category: 'WhatsApp Commerce',
    status: 'LIVE',
    integrationEndpoint: 'api.minetrix.app/v1/whatsapp/catalog'
  },
  {
    id: 'FUT-02',
    featureName: 'Voice CRM & Speech-to-Order AI Transcriber',
    category: 'Voice CRM',
    status: 'LIVE',
    integrationEndpoint: 'api.minetrix.app/v1/ai/voice-transcribe'
  },
  {
    id: 'FUT-03',
    featureName: 'AutoCAD / Revit / BIM Drawing Material Auto-Extractor',
    category: 'AutoCAD/BIM Ready',
    status: 'BETA',
    integrationEndpoint: 'api.minetrix.app/v1/cad/extract-boq'
  },
  {
    id: 'FUT-04',
    featureName: 'Augmented Reality (AR) Stone Dressing & Block Preview',
    category: 'AR Preview',
    status: 'READY',
    integrationEndpoint: 'api.minetrix.app/v1/ar/stone-viewer'
  }
];

export const MOCK_PHASE20_QUOTATIONS: QuotationRecord[] = [
  {
    id: 'QT-2026-01',
    quoteNo: 'QT-MNT-9901',
    customerName: 'Hegde Infra & Developers',
    quoteType: 'Material Supply',
    items: [
      { description: 'Washed M-Sand (1st Dressing Quality)', qty: 800, unit: 'Tons', unitPriceRs: 680, totalRs: 544000 },
      { description: '20mm Crushed Blue Metal Aggregate', qty: 400, unit: 'Tons', unitPriceRs: 620, totalRs: 248000 }
    ],
    subtotalRs: 792000,
    freightChargeRs: 85000,
    discountRs: 27000,
    totalAmountRs: 850000,
    version: 2,
    approvalStatus: 'APPROVED',
    isDigitallySigned: true,
    validTill: '2026-08-20'
  },
  {
    id: 'QT-2026-02',
    quoteNo: 'QT-MNT-9902',
    customerName: 'Karnataka Road Builders',
    quoteType: 'Construction BOQ',
    items: [
      { description: 'Laterite Stone Blocks (Class A 15x9x6")', qty: 5000, unit: 'Blocks', unitPriceRs: 45, totalRs: 225000 },
      { description: 'Sub-Base Granular Aggregate', qty: 3000, unit: 'Tons', unitPriceRs: 550, totalRs: 1650000 }
    ],
    subtotalRs: 1875000,
    freightChargeRs: 180000,
    discountRs: 55000,
    totalAmountRs: 2000000,
    version: 1,
    approvalStatus: 'PENDING_APPROVAL',
    isDigitallySigned: false,
    validTill: '2026-08-25'
  }
];

export const MOCK_PHASE20_FOLLOWUPS: FollowUpTask[] = [
  {
    id: 'FLW-01',
    customerOrLeadName: 'Rajesh Hegde (Hegde Infra)',
    type: 'WhatsApp Follow-up',
    scheduledDate: '2026-08-07',
    scheduledTime: '11:30 AM',
    priority: 'High',
    status: 'Pending',
    assignedAgent: 'Vikram Sharma',
    aiSuggestionNote: 'High conversion probability (92%). Offer 2% early settlement discount on advance payment.'
  },
  {
    id: 'FLW-02',
    customerOrLeadName: 'Suresh Bhat (Karnataka Road Builders)',
    type: 'Site Visit',
    scheduledDate: '2026-08-07',
    scheduledTime: '02:00 PM',
    priority: 'High',
    status: 'Pending',
    assignedAgent: 'Ananya Rao',
    aiSuggestionNote: 'Verify site access road clearance for 18-wheeler multi-axle tippers before finalizing BOQ.'
  },
  {
    id: 'FLW-03',
    customerOrLeadName: 'Mohammad Tariq (Coastline Complex)',
    type: 'Call Schedule',
    scheduledDate: '2026-08-08',
    scheduledTime: '10:00 AM',
    priority: 'Medium',
    status: 'Pending',
    assignedAgent: 'Rohan Naik',
    aiSuggestionNote: 'Follow up on structural engineer approval for M-Sand specification sample.'
  }
];

export const MOCK_PHASE20_DEALERS: DealerRecord[] = [
  {
    id: 'DLR-01',
    dealerCode: 'DLR-MNG-01',
    name: 'Dakshina Kannada Building Depot',
    territory: 'Mangalore City & Suburbs',
    monthlyTargetTons: 2000,
    achievedTons: 1850,
    incentiveEarnedRs: 185000,
    walletBalanceRs: 45000,
    rating: 4.9,
    activeContractorsCount: 34
  },
  {
    id: 'DLR-02',
    dealerCode: 'DLR-UDU-04',
    name: 'Udupi Stone & Aggregate Agency',
    territory: 'Udupi-Manipal District',
    monthlyTargetTons: 1500,
    achievedTons: 1420,
    incentiveEarnedRs: 142000,
    walletBalanceRs: 28000,
    rating: 4.7,
    activeContractorsCount: 22
  }
];

export const MOCK_PHASE20_SUPPLIERS: SupplierRecord[] = [
  {
    id: 'SUP-01',
    supplierCode: 'SUP-BLST-09',
    name: 'Deccan Industrial Explosives Ltd',
    category: 'Explosives & Blasting',
    vendorRatingScore: 98,
    deliveryOnTimePercent: 99.2,
    activeAgreementsCount: 3,
    totalProcurementVolumeRs: 4500000
  },
  {
    id: 'SUP-02',
    supplierCode: 'SUP-PETRO-02',
    name: 'Mangalore Refinery Petroleum Fuelling',
    category: 'Diesel & Lubricants',
    vendorRatingScore: 96,
    deliveryOnTimePercent: 98.5,
    activeAgreementsCount: 5,
    totalProcurementVolumeRs: 18500000
  }
];

export const MOCK_PHASE20_TICKETS: SupportTicket[] = [
  {
    id: 'TCK-801',
    ticketNo: 'TCK-MNT-441',
    customerName: 'Mangalore Smart Infra Private Limited',
    issueCategory: 'Weighbridge Ticket Discrepancy',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    assignedTechnician: 'Santhosh Kumar (Yard Supervisor)',
    createdAt: '2026-08-07 08:30 AM',
    resolutionTimeHours: 4
  },
  {
    id: 'TCK-802',
    ticketNo: 'TCK-MNT-442',
    customerName: 'Coastline Commercial Complex',
    issueCategory: 'Material Quality Dispute',
    priority: 'MEDIUM',
    status: 'OPEN',
    assignedTechnician: 'Mahesh Shetty (Quality Inspector)',
    createdAt: '2026-08-07 09:15 AM',
    resolutionTimeHours: 12
  }
];

export const MOCK_PHASE20_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: 'CMP-01',
    title: 'Monsoon Construction Pre-Order Discount',
    channel: 'WhatsApp Broadcast',
    targetAudience: 'Civil Contractors & Developers',
    reachCount: 1450,
    conversionRatePercent: 12.4,
    revenueGeneratedRs: 3850000,
    status: 'Active'
  },
  {
    id: 'CMP-02',
    title: 'Laterite Stone Quarry Direct Outlet Launch',
    channel: 'SMS',
    targetAudience: 'Architects & Masons',
    reachCount: 2200,
    conversionRatePercent: 8.1,
    revenueGeneratedRs: 1920000,
    status: 'Active'
  }
];

export const MOCK_PHASE20_JOBS: JobListing[] = [
  {
    id: 'JOB-01',
    jobCode: 'JOB-MNT-11',
    title: 'Heavy Tipper Driver (10-Wheeler / 14-Wheeler)',
    roleCategory: 'Tipper Driver',
    location: 'Bantwal Quarry Zone #2',
    salaryRangeRs: '₹28,000 - ₹35,000 / month + Trip Bonus',
    applicantsCount: 18,
    status: 'Open'
  },
  {
    id: 'JOB-02',
    jobCode: 'JOB-MNT-12',
    title: 'Hydraulic Excavator Operator (20-Ton CAT/Volvo)',
    roleCategory: 'Excavator Operator',
    location: 'Moodabidri Crusher Hub',
    salaryRangeRs: '₹32,000 - ₹40,000 / month',
    applicantsCount: 12,
    status: 'Open'
  }
];

export const MOCK_PHASE20_AGREEMENTS: DigitalAgreement[] = [
  {
    id: 'AGR-01',
    agreementNo: 'AGR-SUP-2026-881',
    partyName: 'Mangalore Smart Infra Private Limited',
    agreementType: 'Customer Supply',
    startDate: '2026-01-01',
    expiryDate: '2026-12-31',
    isSigned: true,
    qrVerifiedCode: 'RZ-MNT-QR-881-2026',
    status: 'ACTIVE'
  },
  {
    id: 'AGR-02',
    agreementNo: 'AGR-DLR-2026-114',
    partyName: 'Dakshina Kannada Building Depot',
    agreementType: 'Dealer Franchise',
    startDate: '2025-09-01',
    expiryDate: '2026-08-31',
    isSigned: true,
    qrVerifiedCode: 'RZ-MNT-QR-114-2025',
    status: 'EXPIRING_SOON'
  }
];

export const MOCK_PHASE20_ANALYTICS = {
  totalLeadsThisMonth: 142,
  leadConversionRatePercent: 28.5,
  totalPipelineValueRs: 48500000,
  averageDealClosureDays: 6.2,
  customerRetentionRatePercent: 94.2,
  monthlySalesRevenueRs: 32400000,
  activeDealersCount: 48,
  activeSuppliersCount: 29
};
