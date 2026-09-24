// RZ® MINETRIX — PLATFORM 7: QUARRY LAND MANAGEMENT
// STUDIO PREVIEW / DEMO DATASET & DOMAIN INTERFACES
// Core Principle: LAND OWNERSHIP ≠ QUARRY PARTNERSHIP
// A person can hold multiple roles (Owner, Partner, Investor, Fleet Operator) simultaneously without duplicate profiles.

export type LandUnit = 'Cent' | 'Acre' | 'Hectare' | 'Sq.Ft' | 'Sq.M';

export type LandType =
  | 'Laterite Hillock'
  | 'Granite Outcrop'
  | 'Basalt Hard Rock'
  | 'Agricultural / Dry Land'
  | 'Industrial / Quarry Buffer';

export type ParcelStatus =
  | 'Available'
  | 'Under Review'
  | 'Under Agreement'
  | 'Connected to Quarry'
  | 'Active Mining'
  | 'Mining Completed'
  | 'Returned'
  | 'Sold'
  | 'Leased'
  | 'Inactive';

export type AgreementType =
  | 'Purchase'
  | 'Mining & Return'
  | 'Per-Load'
  | 'Hybrid';

export type AgreementStatus =
  | 'Draft'
  | 'Negotiation'
  | 'Approved'
  | 'Registered'
  | 'Completed'
  | 'Cancelled';

export type SettlementStatus =
  | 'Pending'
  | 'Under Review'
  | 'Approved'
  | 'Partially Paid'
  | 'Settled'
  | 'Disputed';

export type DocumentType =
  | 'Title Deed (Jenmam / Kanam)'
  | 'Registered Sale Deed'
  | 'Tax Receipt & Pokkuvaravu'
  | 'Survey Sketch / FMB Sketch'
  | 'Possession Certificate'
  | 'Quarry Mining Agreement'
  | 'Identity Proof (Aadhaar / PAN)'
  | 'Panchayat / Geology LoI NOC'
  | 'SEIAA Environmental Clearance';

export type PersonRole =
  | 'Land Owner'
  | 'Quarry Partner'
  | 'Vehicle Owner'
  | 'Crusher Partner'
  | 'Investor';

// Shared Person / Party entity
export interface PersonParty {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  state: string;
  idProof: string; // PAN or Aadhaar
  roles: PersonRole[];
  status: 'ACTIVE' | 'INACTIVE';
  bankDetails: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branch: string;
  };
}

// Land Owner Entity (Extends Person concept)
export interface LandOwner {
  id: string;
  personId: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  state: string;
  idDocRef: string;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branch: string;
  };
  totalParcels: number;
  totalExtentCents: number;
  totalExtentAcres: number;
  quarryConnections: {
    quarryId: string;
    quarryName: string;
    role: string;
  }[];
  activeAgreementsCount: number;
  totalAdvancesReceivedRs: number;
  totalPayableEarnedRs: number;
  totalPaidReceivedRs: number;
  outstandingBalanceRs: number;
  status: 'ACTIVE' | 'INACTIVE';
  roles: PersonRole[];
  joinedDate: string;
}

// Land Parcel Entity
export interface LandParcel {
  id: string;
  code: string;
  surveyNumber: string;
  subdivisionNumber: string;
  village: string;
  localBody: string; // Panchayat or Municipality
  taluk: string;
  district: string;
  state: string;
  extent: number;
  unit: LandUnit;
  extentInCents: number;
  extentInAcres: number;
  landType: LandType;
  owners: {
    ownerId: string;
    ownerName: string;
    sharePercent: number;
  }[];
  boundaries: {
    north: string;
    south: string;
    east: string;
    west: string;
  };
  accessRoad: string;
  currentStatus: ParcelStatus;
  documentsCount: number;
  quarryId?: string;
  quarryName?: string;
  activeWorkingAreaId?: string;
  activeWorkingAreaName?: string;
  activeAgreementId?: string;
  activeAgreementType?: AgreementType;
  coordinates: {
    lat: number;
    lng: number;
  };
  polygonPoints: string;
  estimatedMineralYield: string;
  topographyNotes: string;
}

// Survey & Cadastral Boundary Record
export interface SurveyBoundaryRecord {
  id: string;
  parcelId: string;
  surveyNumber: string;
  subdivision: string;
  fmbSketchRef: string;
  extentFormatted: string;
  northBoundary: string;
  southBoundary: string;
  eastBoundary: string;
  westBoundary: string;
  accessRoadWidthMeters: number;
  accessRoadType: string;
  adjacentParcels: string[];
  verifiedBySurveyor: string;
  verificationDate: string;
  status: 'Verified' | 'Field Pending' | 'Disputed';
  gpsCenter: string;
  perimeterMeters: number;
}

// Land Agreement Entity (4 Types Engine)
export interface LandAgreement {
  id: string;
  agreementNumber: string;
  type: AgreementType;
  status: AgreementStatus;
  ownerId: string;
  ownerName: string;
  parcelIds: string[];
  parcelSurveys: string;
  quarryId: string;
  quarryName: string;
  workingAreaId?: string;
  workingAreaName?: string;
  material: string;
  extentInCents: number;
  extentInAcres: number;

  // Specific commercial terms
  purchaseRatePerCentRs?: number;
  purchaseTotalAmountRs?: number;
  miningAgreedAmountRs?: number;
  miningRatePerCentRs?: number;
  miningPeriodMonths?: number;
  miningStartDate?: string;
  expectedCompletionDate?: string;
  returnCondition?: string;

  ratePerLoadRs?: number;
  minCommitmentLoads?: number;
  maxCommitmentLoads?: number;
  totalLoadsExtracted?: number;
  completedLoads?: number;
  pendingLoads?: number;

  // Hybrid engine fields
  hybridBaseAmountRs?: number;
  hybridPerLoadRs?: number;
  hybridAdvanceSecurityRs?: number;
  hybridCustomTerms?: string;

  // Financial reconciliation
  totalAgreedPayableRs: number;
  advanceAmountRs: number;
  paidAmountRs: number;
  balanceAmountRs: number;

  paymentCycle: 'Per Load' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Lump Sum';
  createdDate: string;
  effectiveDate: string;
  expiryDate?: string;
  registrationStatus: 'Not Applicable' | 'Registered at Sub-Registrar' | 'Stamp Paper Notarized' | 'Pending Registration';
  subRegistrarOffice?: string;
  documentsCount: number;
}

// Working Area Entity (Quarry link)
export interface LandWorkingArea {
  id: string;
  code: string;
  name: string;
  quarryId: string;
  quarryName: string;
  parcelIds: string[];
  parcelSurveys: string;
  ownerIds: string[];
  ownerNames: string;
  agreementIds: string[];
  agreementTypes: AgreementType[];
  material: string;
  areaExtentCents: number;
  areaExtentAcres: number;
  benchDepthMeters: number;
  productionStatus: 'Active Extraction' | 'Development' | 'Exhausted' | 'Restoration';
  loadCount: number;
  totalExtractedQty: string;
  startDate: string;
  endDate: string;
  status: 'Planned' | 'Active' | 'Paused' | 'Completed' | 'Closed';
  dailyTargetLoads: number;
  quarryManager: string;
}

// Quarry Load Traceability (Chain: Load -> Working Area -> Agreement -> Parcel -> Owner -> Settlement)
export interface LandTraceabilityLoad {
  id: string;
  loadNumber: string;
  date: string;
  time: string;
  quarryId: string;
  quarryName: string;
  workingAreaId: string;
  workingAreaName: string;
  parcelId: string;
  parcelSurvey: string;
  agreementId: string;
  agreementNumber: string;
  agreementType: AgreementType;
  ownerId: string;
  ownerName: string;
  material: string;
  quantity: number;
  unit: string;
  vehicleNumber: string;
  driverName: string;
  ratePerUnitRs: number;
  payableToOwnerRs: number;
  settlementStatus: SettlementStatus;
  gatePassNumber: string;
}

// Land Owner Account Ledger & Balances
export interface LandOwnerAccount {
  ownerId: string;
  ownerName: string;
  totalAgreementsValueRs: number;
  totalAdvancesReceivedRs: number;
  totalLoadPayablesRs: number;
  totalPaymentsReceivedRs: number;
  netAdjustmentsRs: number;
  currentOutstandingBalanceRs: number;
  pendingSettlementRs: number;
}

// Owner Advance Entity
export interface OwnerAdvance {
  id: string;
  advanceNumber: string;
  ownerId: string;
  ownerName: string;
  agreementId: string;
  agreementNumber: string;
  date: string;
  amountRs: number;
  paymentMethod: 'RTGS' | 'NEFT' | 'Cheque' | 'Cash' | 'UPI';
  referenceNumber: string;
  adjustedAgainstLoadsRs: number;
  remainingAdvanceRs: number;
  status: 'Active' | 'Fully Adjusted' | 'Refunded';
  notes: string;
}

// Owner Payment Entity
export interface OwnerPayment {
  id: string;
  paymentNumber: string;
  ownerId: string;
  ownerName: string;
  agreementId: string;
  agreementNumber: string;
  amountRs: number;
  date: string;
  paymentMethod: 'RTGS' | 'NEFT' | 'Cheque' | 'Cash' | 'UPI';
  referenceNumber: string;
  notes: string;
  settlementId?: string;
  status: 'Completed';
}

// Owner Settlement Entity
export interface OwnerSettlement {
  id: string;
  settlementNumber: string;
  ownerId: string;
  ownerName: string;
  agreementId: string;
  agreementNumber: string;
  workingAreaId: string;
  workingAreaName: string;
  period: string;
  totalLoadsCount: number;
  totalPayableRs: number;
  advanceDeductionRs: number;
  previouslyPaidRs: number;
  netPayableRs: number;
  settlementStatus: SettlementStatus;
  date: string;
  notes: string;
}

// Detailed Ledger Statement Row
export interface OwnerLedgerStatementItem {
  id: string;
  ownerId: string;
  date: string;
  referenceNo: string;
  type: 'Advance Paid' | 'Load Extraction Payable' | 'Agreement Installment' | 'Payment Payout' | 'Reconciliation Adjustment';
  agreementNumber: string;
  workingArea?: string;
  loadNumber?: string;
  debitRs: number; // Quarry pays owner or owner draws
  creditRs: number; // Owner earns from loads/agreement
  balanceRs: number;
  remarks: string;
}

// Land Marketplace Listing
export interface LandListingItem {
  id: string;
  listingCode: string;
  ownerId: string;
  ownerNameShielded: string; // Shielded for privacy on public marketplace
  ownerRealName: string;
  title: string;
  location: string;
  village: string;
  taluk: string;
  district: string;
  state: string;
  surveyReference: string;
  extentCents: number;
  extentAcres: number;
  accessRoad: string;
  landType: LandType;
  intendedUse: 'Immediate Mining' | 'Lease & Royalty' | 'Outright Sale' | 'Crusher Setup';
  commercialModel: 'For Sale' | 'For Lease' | 'Mining & Return' | 'Joint Venture';
  askingPriceRs?: number;
  leaseTerms?: string;
  estimatedYieldMT: string;
  permits: string[];
  matchScore: number;
  status: 'Available' | 'Under Offer' | 'Deal In Progress' | 'Sold' | 'Leased';
  featuredImage: string;
}

// Buyer Enquiry
export interface BuyerEnquiryItem {
  id: string;
  enquiryCode: string;
  listingId: string;
  listingTitle: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  buyerCompany: string;
  requirement: string;
  budgetRs: number;
  message: string;
  date: string;
  status: 'New' | 'Contacted' | 'Discussion' | 'Site Visit' | 'Negotiation' | 'Converted' | 'Closed';
  assignedExecutive: string;
}

// Investor Enquiry
export interface InvestorEnquiryItem {
  id: string;
  enquiryCode: string;
  listingId: string;
  listingTitle: string;
  investorName: string;
  investorPhone: string;
  investorCompany: string;
  investorType: 'Mining Enterprise' | 'Private Equity' | 'Infrastructure Contractor' | 'Syndicate';
  proposedArrangement: 'Full Acquisition' | 'Profit Sharing Concession' | 'Royalty per Load' | 'Equity Mining JV';
  investmentCapacityRs: number;
  message: string;
  date: string;
  status: 'New' | 'Screening' | 'Pitch Review' | 'Term Sheet' | 'MoU Drafting' | 'Closed';
  assignedExecutive: string;
}

// Site Visit
export interface SiteVisitItem {
  id: string;
  visitCode: string;
  listingId: string;
  listingTitle: string;
  visitorName: string;
  visitorPhone: string;
  visitorType: 'Buyer' | 'Investor' | 'Surveyor / Geologist';
  date: string;
  time: string;
  purpose: string;
  assignedExecutive: string;
  status: 'Requested' | 'Scheduled' | 'Completed' | 'Cancelled';
  notes: string;
  ottTaskId?: string;
}

// Land Document Record
export interface LandDocumentItem {
  id: string;
  docTitle: string;
  docType: DocumentType;
  parcelId?: string;
  parcelSurvey?: string;
  ownerId?: string;
  ownerName?: string;
  uploadDate: string;
  verifiedStatus: 'Pending' | 'Uploaded' | 'Under Review' | 'Approved' | 'Rejected';
  fileSize: string;
  mimeType: string;
  fileUrl: string;
  notaryOrAuthority: string;
}

// ==========================================
// 1. SHARED PERSONS DATA (Illustrating Multi-Role Identity)
// ==========================================
export const DEMO_PERSON_PARTIES: PersonParty[] = [
  {
    id: 'PERSON-001',
    name: 'Shri V. Prabhakar Pai',
    phone: '+91 94471 22890',
    email: 'prabhakar.pai@kasaragodmines.com',
    address: 'Pai Nivas, Kanhangad South, Hosdurg',
    district: 'Kasaragod',
    state: 'Kerala',
    idProof: 'PAN: ABCPP1234K',
    roles: ['Land Owner', 'Quarry Partner'],
    status: 'ACTIVE',
    bankDetails: {
      bankName: 'Canara Bank',
      accountNumber: '0834101099231',
      ifscCode: 'CNRB0000834',
      branch: 'Kanhangad Main'
    }
  },
  {
    id: 'PERSON-002',
    name: 'Devadas Shetty',
    phone: '+91 98452 33411',
    email: 'devadas.shetty@moodbidri.org',
    address: 'Shetty Estate, Alangar Post, Moodbidri',
    district: 'Dakshina Kannada',
    state: 'Karnataka',
    idProof: 'PAN: BCDPS5678L',
    roles: ['Land Owner'],
    status: 'ACTIVE',
    bankDetails: {
      bankName: 'State Bank of India',
      accountNumber: '319800214455',
      ifscCode: 'SBIN0001248',
      branch: 'Moodbidri'
    }
  },
  {
    id: 'PERSON-003',
    name: 'Thomas Mathew',
    phone: '+91 94478 99120',
    email: 'thomas.mathew@wayanadstone.in',
    address: 'Vallithode Villa, Mananthavady',
    district: 'Wayanad',
    state: 'Kerala',
    idProof: 'PAN: CDEPM9012M',
    roles: ['Land Owner', 'Investor'],
    status: 'ACTIVE',
    bankDetails: {
      bankName: 'Federal Bank',
      accountNumber: '1102020088194',
      ifscCode: 'FDRL0001102',
      branch: 'Mananthavady'
    }
  },
  {
    id: 'PERSON-004',
    name: 'K. Mohan Kumar',
    phone: '+91 94473 11840',
    email: 'k.mohankumar@rzquarries.com',
    address: 'Minetrix Complex, Cheruvathur',
    district: 'Kasaragod',
    state: 'Kerala',
    idProof: 'PAN: DEFPM3456N',
    roles: ['Quarry Partner', 'Vehicle Owner', 'Investor'],
    status: 'ACTIVE',
    bankDetails: {
      bankName: 'HDFC Bank',
      accountNumber: '50200044819234',
      ifscCode: 'HDFC0001844',
      branch: 'Cheruvathur'
    }
  },
  {
    id: 'PERSON-005',
    name: 'Smt. Fathima Bi & A. Abdul Razak',
    phone: '+91 98950 44129',
    email: 'razak.fathima@nileshwar.net',
    address: 'Baitul Noor, Padanna Road, Nileshwar',
    district: 'Kasaragod',
    state: 'Kerala',
    idProof: 'Aadhaar: 4892 1204 8819',
    roles: ['Land Owner'],
    status: 'ACTIVE',
    bankDetails: {
      bankName: 'South Indian Bank',
      accountNumber: '04120530000192',
      ifscCode: 'SIBL0000412',
      branch: 'Nileshwar'
    }
  },
  {
    id: 'PERSON-006',
    name: 'Western Ghats Mining Consortium',
    phone: '+91 824 2498110',
    email: 'acquisitions@wgmc.co.in',
    address: 'City Centre, KS Rao Road, Mangaluru',
    district: 'Dakshina Kannada',
    state: 'Karnataka',
    idProof: 'CIN: U14200KA2021PTC148810',
    roles: ['Investor', 'Crusher Partner'],
    status: 'ACTIVE',
    bankDetails: {
      bankName: 'ICICI Bank',
      accountNumber: '003205018944',
      ifscCode: 'ICIC0000032',
      branch: 'Mangaluru Circle'
    }
  },
  {
    id: 'PERSON-007',
    name: 'Harishchandra Rao',
    phone: '+91 98450 67182',
    email: 'harish.rao@belthangady.com',
    address: 'Rao Compound, Guruvayanakere',
    district: 'Dakshina Kannada',
    state: 'Karnataka',
    idProof: 'PAN: EFGPR7890P',
    roles: ['Land Owner', 'Quarry Partner'],
    status: 'ACTIVE',
    bankDetails: {
      bankName: 'Karnataka Bank',
      accountNumber: '19425001009841',
      ifscCode: 'KARB0000194',
      branch: 'Guruvayanakere'
    }
  }
];

// ==========================================
// 2. LAND OWNERS DATA (Domain-grounded)
// ==========================================
export const DEMO_LAND_OWNERS: LandOwner[] = [
  {
    id: 'LND-OWN-01',
    personId: 'PERSON-001',
    name: 'Shri V. Prabhakar Pai',
    phone: '+91 94471 22890',
    email: 'prabhakar.pai@kasaragodmines.com',
    address: 'Pai Nivas, Kanhangad South, Hosdurg',
    district: 'Kasaragod',
    state: 'Kerala',
    idDocRef: 'PAN: ABCPP1234K / Title Reg: 1420/2014',
    bankDetails: {
      bankName: 'Canara Bank',
      accountNumber: '0834101099231',
      ifscCode: 'CNRB0000834',
      branch: 'Kanhangad Main'
    },
    totalParcels: 3,
    totalExtentCents: 450,
    totalExtentAcres: 4.5,
    quarryConnections: [
      { quarryId: 'Q001', quarryName: 'Kasaragod Pit #01', role: 'Land Owner & Quarry Partner (25%)' }
    ],
    activeAgreementsCount: 2,
    totalAdvancesReceivedRs: 500000,
    totalPayableEarnedRs: 1850000,
    totalPaidReceivedRs: 1600000,
    outstandingBalanceRs: 250000,
    status: 'ACTIVE',
    roles: ['Land Owner', 'Quarry Partner'],
    joinedDate: '2023-04-10'
  },
  {
    id: 'LND-OWN-02',
    personId: 'PERSON-002',
    name: 'Devadas Shetty',
    phone: '+91 98452 33411',
    email: 'devadas.shetty@moodbidri.org',
    address: 'Shetty Estate, Alangar Post, Moodbidri',
    district: 'Dakshina Kannada',
    state: 'Karnataka',
    idDocRef: 'PAN: BCDPS5678L / RTC Mutation: MR-89/2018',
    bankDetails: {
      bankName: 'State Bank of India',
      accountNumber: '319800214455',
      ifscCode: 'SBIN0001248',
      branch: 'Moodbidri'
    },
    totalParcels: 2,
    totalExtentCents: 1800,
    totalExtentAcres: 18.0,
    quarryConnections: [
      { quarryId: 'Q003', quarryName: 'Moodbidri Granite Zone', role: 'Land Owner Concessionaire' }
    ],
    activeAgreementsCount: 1,
    totalAdvancesReceivedRs: 2500000,
    totalPayableEarnedRs: 4800000,
    totalPaidReceivedRs: 4200000,
    outstandingBalanceRs: 600000,
    status: 'ACTIVE',
    roles: ['Land Owner'],
    joinedDate: '2023-08-15'
  },
  {
    id: 'LND-OWN-03',
    personId: 'PERSON-003',
    name: 'Thomas Mathew',
    phone: '+91 94478 99120',
    email: 'thomas.mathew@wayanadstone.in',
    address: 'Vallithode Villa, Mananthavady',
    district: 'Wayanad',
    state: 'Kerala',
    idDocRef: 'PAN: CDEPM9012M / Patta No: 412/12',
    bankDetails: {
      bankName: 'Federal Bank',
      accountNumber: '1102020088194',
      ifscCode: 'FDRL0001102',
      branch: 'Mananthavady'
    },
    totalParcels: 2,
    totalExtentCents: 850,
    totalExtentAcres: 8.5,
    quarryConnections: [
      { quarryId: 'Q004', quarryName: 'Wayanad Basalt Corridor', role: 'Land Owner & Mining Investor' }
    ],
    activeAgreementsCount: 1,
    totalAdvancesReceivedRs: 800000,
    totalPayableEarnedRs: 2200000,
    totalPaidReceivedRs: 1900000,
    outstandingBalanceRs: 300000,
    status: 'ACTIVE',
    roles: ['Land Owner', 'Investor'],
    joinedDate: '2024-01-20'
  },
  {
    id: 'LND-OWN-04',
    personId: 'PERSON-005',
    name: 'Smt. Fathima Bi & A. Abdul Razak',
    phone: '+91 98950 44129',
    email: 'razak.fathima@nileshwar.net',
    address: 'Baitul Noor, Padanna Road, Nileshwar',
    district: 'Kasaragod',
    state: 'Kerala',
    idDocRef: 'Aadhaar: 4892 1204 8819 / Jenmam Deed: 881/2009',
    bankDetails: {
      bankName: 'South Indian Bank',
      accountNumber: '04120530000192',
      ifscCode: 'SIBL0000412',
      branch: 'Nileshwar'
    },
    totalParcels: 2,
    totalExtentCents: 620,
    totalExtentAcres: 6.2,
    quarryConnections: [
      { quarryId: 'Q002', quarryName: 'Manjeshwar Pit #02', role: 'Land Owner' }
    ],
    activeAgreementsCount: 1,
    totalAdvancesReceivedRs: 400000,
    totalPayableEarnedRs: 1450000,
    totalPaidReceivedRs: 1300000,
    outstandingBalanceRs: 150000,
    status: 'ACTIVE',
    roles: ['Land Owner'],
    joinedDate: '2024-03-05'
  },
  {
    id: 'LND-OWN-05',
    personId: 'PERSON-007',
    name: 'Harishchandra Rao',
    phone: '+91 98450 67182',
    email: 'harish.rao@belthangady.com',
    address: 'Rao Compound, Guruvayanakere',
    district: 'Dakshina Kannada',
    state: 'Karnataka',
    idDocRef: 'PAN: EFGPR7890P / Land RTC 94B: 2020',
    bankDetails: {
      bankName: 'Karnataka Bank',
      accountNumber: '19425001009841',
      ifscCode: 'KARB0000194',
      branch: 'Guruvayanakere'
    },
    totalParcels: 1,
    totalExtentCents: 550,
    totalExtentAcres: 5.5,
    quarryConnections: [],
    activeAgreementsCount: 0,
    totalAdvancesReceivedRs: 0,
    totalPayableEarnedRs: 0,
    totalPaidReceivedRs: 0,
    outstandingBalanceRs: 0,
    status: 'ACTIVE',
    roles: ['Land Owner', 'Quarry Partner'],
    joinedDate: '2025-02-14'
  }
];

// ==========================================
// 3. LAND PARCELS DATA (Multi-Owner & Multi-Parcel Aware)
// ==========================================
export const DEMO_LAND_PARCELS: LandParcel[] = [
  {
    id: 'PARCEL-KSD-01',
    code: 'LND-KL-412-1A',
    surveyNumber: '412/1A',
    subdivisionNumber: '1A',
    village: 'Bare Village',
    localBody: 'Pallikkara Grama Panchayat',
    taluk: 'Hosdurg',
    district: 'Kasaragod',
    state: 'Kerala',
    extent: 250,
    unit: 'Cent',
    extentInCents: 250,
    extentInAcres: 2.5,
    landType: 'Laterite Hillock',
    owners: [
      { ownerId: 'LND-OWN-01', ownerName: 'Shri V. Prabhakar Pai', sharePercent: 100 }
    ],
    boundaries: {
      north: 'Survey 412/1B Private Rubber Plantation',
      south: 'PWD 12m Tarred Haul Road',
      east: 'Survey 412/2B (Shri Pai & Family Parcel)',
      west: 'Panchayat Drainage Channel'
    },
    accessRoad: '12m Tarred PWD Haul Road with heavy tipper turning bay',
    currentStatus: 'Active Mining',
    documentsCount: 6,
    quarryId: 'Q001',
    quarryName: 'Kasaragod Pit #01',
    activeWorkingAreaId: 'WA-KSD-01',
    activeWorkingAreaName: 'Bench A - North Face',
    activeAgreementId: 'AGR-MNR-01',
    activeAgreementType: 'Mining & Return',
    coordinates: { lat: 12.3854, lng: 75.0421 },
    polygonPoints: '12.3854,75.0421; 12.3862,75.0435; 12.3848,75.0442; 12.3840,75.0428',
    estimatedMineralYield: '14,00,000 Laterite Grade A Stones',
    topographyNotes: 'Elevated plateau 42m above MSL with compact laterite cap layer.'
  },
  {
    id: 'PARCEL-KSD-02',
    code: 'LND-KL-412-2B',
    surveyNumber: '412/2B',
    subdivisionNumber: '2B',
    village: 'Bare Village',
    localBody: 'Pallikkara Grama Panchayat',
    taluk: 'Hosdurg',
    district: 'Kasaragod',
    state: 'Kerala',
    extent: 200,
    unit: 'Cent',
    extentInCents: 200,
    extentInAcres: 2.0,
    landType: 'Laterite Hillock',
    owners: [
      { ownerId: 'LND-OWN-01', ownerName: 'Shri V. Prabhakar Pai', sharePercent: 100 }
    ],
    boundaries: {
      north: 'Survey 413/4 Bare Hillock Ridge',
      south: 'PWD 12m Tarred Haul Road',
      east: 'Survey 412/3 Forest Boundary Wall (>500m)',
      west: 'Survey 412/1A (Quarry Pit #01 Bench A)'
    },
    accessRoad: 'Directly linked to Survey 412/1A internal haul route',
    currentStatus: 'Active Mining',
    documentsCount: 4,
    quarryId: 'Q001',
    quarryName: 'Kasaragod Pit #01',
    activeWorkingAreaId: 'WA-KSD-02',
    activeWorkingAreaName: 'Bench B - Deep Face',
    activeAgreementId: 'AGR-LOD-02',
    activeAgreementType: 'Per-Load',
    coordinates: { lat: 12.3849, lng: 75.0445 },
    polygonPoints: '12.3849,75.0445; 12.3858,75.0458; 12.3842,75.0463; 12.3835,75.0450',
    estimatedMineralYield: '9,80,000 Laterite Cut Stones',
    topographyNotes: 'Deep virgin seam, hard red laterite masonry quality.'
  },
  {
    id: 'PARCEL-DK-01',
    code: 'LND-KA-119-4',
    surveyNumber: '119/4',
    subdivisionNumber: '4',
    village: 'Alangar',
    localBody: 'Moodbidri Town Municipality',
    taluk: 'Moodbidri',
    district: 'Dakshina Kannada',
    state: 'Karnataka',
    extent: 18.0,
    unit: 'Acre',
    extentInCents: 1800,
    extentInAcres: 18.0,
    landType: 'Granite Outcrop',
    owners: [
      { ownerId: 'LND-OWN-02', ownerName: 'Devadas Shetty', sharePercent: 100 }
    ],
    boundaries: {
      north: 'Survey 118 Government Revenue Gomal Land',
      south: 'NH-169 Highway Haul Link (1.2 km dedicated access)',
      east: 'Survey 120 Private Cashew Plantation',
      west: 'Survey 119/3 Granite Quarry'
    },
    accessRoad: '14m double-lane metalled road engineered for 40-ton tippers',
    currentStatus: 'Under Agreement',
    documentsCount: 8,
    quarryId: 'Q003',
    quarryName: 'Moodbidri Granite Zone',
    activeWorkingAreaId: 'WA-DK-01',
    activeWorkingAreaName: 'Main Grey Granite Quarry Face',
    activeAgreementId: 'AGR-HYB-03',
    activeAgreementType: 'Hybrid',
    coordinates: { lat: 13.0682, lng: 74.9942 },
    polygonPoints: '13.0682,74.9942; 13.0720,74.9980; 13.0690,75.0020; 13.0650,74.9970',
    estimatedMineralYield: '12,50,000 MT Hard Rock Blue Metal',
    topographyNotes: 'Massive monolithic granite dome ideal for 200 TPH crusher plant.'
  },
  {
    id: 'PARCEL-WYD-01',
    code: 'LND-KL-412-1',
    surveyNumber: '412/1',
    subdivisionNumber: '1',
    village: 'Tholpetty',
    localBody: 'Thirunelly Grama Panchayat',
    taluk: 'Mananthavady',
    district: 'Wayanad',
    state: 'Kerala',
    extent: 8.5,
    unit: 'Acre',
    extentInCents: 850,
    extentInAcres: 8.5,
    landType: 'Basalt Hard Rock',
    owners: [
      { ownerId: 'LND-OWN-03', ownerName: 'Thomas Mathew', sharePercent: 100 }
    ],
    boundaries: {
      north: 'Survey 411 Private Coffee Estate',
      south: 'State Highway 54 feeder road',
      east: 'Survey 412/2 Natural stream (>100m buffer maintained)',
      west: 'Survey 410 Dry Barren Ridge'
    },
    accessRoad: '9m gravel haul track connecting to SH-54',
    currentStatus: 'Connected to Quarry',
    documentsCount: 5,
    quarryId: 'Q004',
    quarryName: 'Wayanad Basalt Corridor',
    activeWorkingAreaId: 'WA-WYD-01',
    activeWorkingAreaName: 'Black Basalt Cutting Face',
    activeAgreementId: 'AGR-PUR-04',
    activeAgreementType: 'Purchase',
    coordinates: { lat: 11.8421, lng: 76.0125 },
    polygonPoints: '11.8421,76.0125; 11.8445,76.0150; 11.8410,76.0175; 11.8390,76.0140',
    estimatedMineralYield: '6,20,000 MT Black Basalt',
    topographyNotes: 'Solid basalt formation with minimal overburden (0.8m soil).'
  },
  {
    id: 'PARCEL-MNJ-01',
    code: 'LND-KL-284-1',
    surveyNumber: '284/1',
    subdivisionNumber: '1',
    village: 'Meenja',
    localBody: 'Meenja Grama Panchayat',
    taluk: 'Manjeshwar',
    district: 'Kasaragod',
    state: 'Kerala',
    extent: 380,
    unit: 'Cent',
    extentInCents: 380,
    extentInAcres: 3.8,
    landType: 'Laterite Hillock',
    owners: [
      { ownerId: 'LND-OWN-04', ownerName: 'Smt. Fathima Bi & A. Abdul Razak', sharePercent: 100 }
    ],
    boundaries: {
      north: 'Survey 283 Village Footpath & Coconut Grove',
      south: 'Panchayat Tarred Road',
      east: 'Survey 284/2 Barren Dry Land',
      west: 'Survey 282 Old Laterite Quarry'
    },
    accessRoad: '10m Panchayat tarred road',
    currentStatus: 'Active Mining',
    documentsCount: 4,
    quarryId: 'Q002',
    quarryName: 'Manjeshwar Pit #02',
    activeWorkingAreaId: 'WA-MNJ-01',
    activeWorkingAreaName: 'Bench 1 - Main Face',
    activeAgreementId: 'AGR-MNR-05',
    activeAgreementType: 'Mining & Return',
    coordinates: { lat: 12.7214, lng: 74.9810 },
    polygonPoints: '12.7214,74.9810; 12.7230,74.9830; 12.7205,74.9845; 12.7190,74.9820',
    estimatedMineralYield: '11,20,000 Premium Laterite Stones',
    topographyNotes: 'Prime laterite formation with superior compaction.'
  },
  {
    id: 'PARCEL-BLT-01',
    code: 'LND-KA-94-2',
    surveyNumber: '94/2',
    subdivisionNumber: '2',
    village: 'Guruvayanakere',
    localBody: 'Kuvedu Grama Panchayat',
    taluk: 'Belthangady',
    district: 'Dakshina Kannada',
    state: 'Karnataka',
    extent: 5.5,
    unit: 'Acre',
    extentInCents: 550,
    extentInAcres: 5.5,
    landType: 'Granite Outcrop',
    owners: [
      { ownerId: 'LND-OWN-05', ownerName: 'Harishchandra Rao', sharePercent: 100 }
    ],
    boundaries: {
      north: 'Survey 93 State Highway 37 link',
      south: 'Survey 95 Barren rocky outcrop',
      east: 'Survey 94/1 Cashew grove',
      west: 'Survey 94/3 Stream buffer'
    },
    accessRoad: '12m wide approach from SH-37',
    currentStatus: 'Available',
    documentsCount: 3,
    coordinates: { lat: 12.9812, lng: 75.2410 },
    polygonPoints: '12.9812,75.2410; 12.9835,75.2435; 12.9805,75.2450; 12.9785,75.2425',
    estimatedMineralYield: '5,50,000 MT Granite Reserve',
    topographyNotes: 'Fresh virgin granite boulder field, ready for environmental clearance.'
  },
  {
    id: 'PARCEL-JOINT-01',
    code: 'LND-KL-413-4',
    surveyNumber: '413/4',
    subdivisionNumber: '4',
    village: 'Bare Village',
    localBody: 'Pallikkara Grama Panchayat',
    taluk: 'Hosdurg',
    district: 'Kasaragod',
    state: 'Kerala',
    extent: 160,
    unit: 'Cent',
    extentInCents: 160,
    extentInAcres: 1.6,
    landType: 'Laterite Hillock',
    owners: [
      { ownerId: 'LND-OWN-01', ownerName: 'Shri V. Prabhakar Pai', sharePercent: 60 },
      { ownerId: 'LND-OWN-04', ownerName: 'Smt. Fathima Bi & A. Abdul Razak', sharePercent: 40 }
    ],
    boundaries: {
      north: 'Survey 414 Public Hill Slope',
      south: 'Survey 412/2B (Quarry Pit #01 Bench B)',
      east: 'Private plantation',
      west: 'Internal haul road'
    },
    accessRoad: 'Shared 10m haul road with Kasaragod Pit #01',
    currentStatus: 'Under Review',
    documentsCount: 3,
    coordinates: { lat: 12.3865, lng: 75.0452 },
    polygonPoints: '12.3865,75.0452; 12.3875,75.0465; 12.3858,75.0472; 12.3850,75.0458',
    estimatedMineralYield: '4,50,000 Laterite Stones',
    topographyNotes: 'Jointly held parcel by two families with legal 60/40 consent deeds signed.'
  }
];

// ==========================================
// 4. SURVEY & BOUNDARY CADASTRAL RECORDS
// ==========================================
export const DEMO_SURVEY_RECORDS: SurveyBoundaryRecord[] = [
  {
    id: 'SRV-KL-412-1A',
    parcelId: 'PARCEL-KSD-01',
    surveyNumber: '412/1A',
    subdivision: '1A',
    fmbSketchRef: 'FMB-HSD-2022-8941',
    extentFormatted: '250 Cents (2.50 Acres)',
    northBoundary: 'Survey 412/1B Private Rubber Plantation with marked boundary stones',
    southBoundary: 'PWD 12m Tarred Haul Road, 8m buffer maintained',
    eastBoundary: 'Survey 412/2B (Shri Pai & Family Parcel, joint boundary cairn)',
    westBoundary: 'Panchayat Drainage Channel with RCC retaining wall',
    accessRoadWidthMeters: 12,
    accessRoadType: 'Tarred PWD All-Weather Road',
    adjacentParcels: ['412/1B', '412/2B', '411/3'],
    verifiedBySurveyor: 'K. Balakrishnan (Licensed Revenue Surveyor #LR-412)',
    verificationDate: '2025-11-14',
    status: 'Verified',
    gpsCenter: '12.3854° N, 75.0421° E',
    perimeterMeters: 640
  },
  {
    id: 'SRV-KL-412-2B',
    parcelId: 'PARCEL-KSD-02',
    surveyNumber: '412/2B',
    subdivision: '2B',
    fmbSketchRef: 'FMB-HSD-2023-1102',
    extentFormatted: '200 Cents (2.00 Acres)',
    northBoundary: 'Survey 413/4 Bare Hillock Ridge, surveyed benchmarks placed',
    southBoundary: 'PWD 12m Tarred Haul Road',
    eastBoundary: 'Survey 412/3 Forest Department boundary fence (610m away)',
    westBoundary: 'Survey 412/1A (Quarry Pit #01 Bench A)',
    accessRoadWidthMeters: 12,
    accessRoadType: 'Tarred Heavy Haul Link',
    adjacentParcels: ['413/4', '412/1A', '412/3'],
    verifiedBySurveyor: 'K. Balakrishnan (Licensed Revenue Surveyor #LR-412)',
    verificationDate: '2025-11-16',
    status: 'Verified',
    gpsCenter: '12.3849° N, 75.0445° E',
    perimeterMeters: 580
  },
  {
    id: 'SRV-KA-119-4',
    parcelId: 'PARCEL-DK-01',
    surveyNumber: '119/4',
    subdivision: '4',
    fmbSketchRef: 'RTC-DK-MBD-2023-4129',
    extentFormatted: '18.00 Acres (1800 Cents)',
    northBoundary: 'Survey 118 Government Revenue Gomal Land, permanent survey pegs installed',
    southBoundary: 'NH-169 Highway corridor haul route (1.2 km dedicated access)',
    eastBoundary: 'Survey 120 Private Cashew Grove',
    westBoundary: 'Survey 119/3 Granite Quarry Pit',
    accessRoadWidthMeters: 14,
    accessRoadType: 'Double-Lane Heavy Duty Metalled Haul Road',
    adjacentParcels: ['118', '119/3', '120'],
    verifiedBySurveyor: 'Raghavendra Bhat (Senior Cadastral Surveyor DK)',
    verificationDate: '2024-05-18',
    status: 'Verified',
    gpsCenter: '13.0682° N, 74.9942° E',
    perimeterMeters: 1480
  },
  {
    id: 'SRV-KL-412-1',
    parcelId: 'PARCEL-WYD-01',
    surveyNumber: '412/1',
    subdivision: '1',
    fmbSketchRef: 'FMB-WYD-MNT-2023-7721',
    extentFormatted: '8.50 Acres (850 Cents)',
    northBoundary: 'Survey 411 Private Coffee Estate with live wire fencing',
    southBoundary: 'State Highway 54 approach track',
    eastBoundary: 'Survey 412/2 Natural water channel, 120m environmental buffer demarcated',
    westBoundary: 'Survey 410 Barren Rocky Slope',
    accessRoadWidthMeters: 9,
    accessRoadType: 'Compacted Gravel Haul Track',
    adjacentParcels: ['411', '412/2', '410'],
    verifiedBySurveyor: 'Biju Varghese (Revenue Surveyor Wayanad)',
    verificationDate: '2024-08-22',
    status: 'Verified',
    gpsCenter: '11.8421° N, 76.0125° E',
    perimeterMeters: 980
  }
];

// ==========================================
// 5. LAND AGREEMENTS DATA (Covering 4 Types)
// ==========================================
export const DEMO_LAND_AGREEMENTS: LandAgreement[] = [
  {
    id: 'AGR-MNR-01',
    agreementNumber: 'RZ-LND-2024-MNR-001',
    type: 'Mining & Return',
    status: 'Registered',
    ownerId: 'LND-OWN-01',
    ownerName: 'Shri V. Prabhakar Pai',
    parcelIds: ['PARCEL-KSD-01'],
    parcelSurveys: 'Survey 412/1A (250 Cents)',
    quarryId: 'Q001',
    quarryName: 'Kasaragod Pit #01',
    workingAreaId: 'WA-KSD-01',
    workingAreaName: 'Bench A - North Face',
    material: 'Laterite Stone (Grade A Premium)',
    extentInCents: 250,
    extentInAcres: 2.5,
    miningAgreedAmountRs: 4000000,
    miningRatePerCentRs: 160000,
    miningPeriodMonths: 36,
    miningStartDate: '2024-05-01',
    expectedCompletionDate: '2027-04-30',
    returnCondition: 'Land must be leveled to road grade (+1.5m), graded with topsoil and boundary trench restored for agricultural development.',
    totalAgreedPayableRs: 4000000,
    advanceAmountRs: 500000,
    paidAmountRs: 1600000,
    balanceAmountRs: 1900000,
    paymentCycle: 'Monthly',
    createdDate: '2024-04-15',
    effectiveDate: '2024-05-01',
    expiryDate: '2027-04-30',
    registrationStatus: 'Registered at Sub-Registrar',
    subRegistrarOffice: 'Hosdurg SRO (Doc No: 1420/2024 Book 1)',
    documentsCount: 4
  },
  {
    id: 'AGR-LOD-02',
    agreementNumber: 'RZ-LND-2025-LOD-002',
    type: 'Per-Load',
    status: 'Approved',
    ownerId: 'LND-OWN-01',
    ownerName: 'Shri V. Prabhakar Pai',
    parcelIds: ['PARCEL-KSD-02'],
    parcelSurveys: 'Survey 412/2B (200 Cents)',
    quarryId: 'Q001',
    quarryName: 'Kasaragod Pit #01',
    workingAreaId: 'WA-KSD-02',
    workingAreaName: 'Bench B - Deep Face',
    material: 'Laterite Masonry Stones',
    extentInCents: 200,
    extentInAcres: 2.0,
    ratePerLoadRs: 5000,
    minCommitmentLoads: 400,
    maxCommitmentLoads: 800,
    totalLoadsExtracted: 250,
    completedLoads: 250,
    pendingLoads: 150,
    totalAgreedPayableRs: 2000000,
    advanceAmountRs: 200000,
    paidAmountRs: 1050000,
    balanceAmountRs: 750000,
    paymentCycle: 'Per Load',
    createdDate: '2025-01-10',
    effectiveDate: '2025-02-01',
    expiryDate: '2026-08-31',
    registrationStatus: 'Stamp Paper Notarized',
    documentsCount: 3
  },
  {
    id: 'AGR-HYB-03',
    agreementNumber: 'RZ-LND-2023-HYB-003',
    type: 'Hybrid',
    status: 'Registered',
    ownerId: 'LND-OWN-02',
    ownerName: 'Devadas Shetty',
    parcelIds: ['PARCEL-DK-01'],
    parcelSurveys: 'Survey 119/4 (18.00 Acres)',
    quarryId: 'Q003',
    quarryName: 'Moodbidri Granite Zone',
    workingAreaId: 'WA-DK-01',
    workingAreaName: 'Main Grey Granite Quarry Face',
    material: 'Blue Metal Granite / Aggregates',
    extentInCents: 1800,
    extentInAcres: 18.0,
    hybridBaseAmountRs: 1200000,
    hybridPerLoadRs: 450,
    hybridAdvanceSecurityRs: 2500000,
    hybridCustomTerms: 'Base annual lease ₹12,00,000 + ₹45 per MT extracted + 10 Year Concession with 5% escalation every 3 years. Security Deposit adjusted at Year 10.',
    totalAgreedPayableRs: 4800000,
    advanceAmountRs: 2500000,
    paidAmountRs: 4200000,
    balanceAmountRs: 600000,
    paymentCycle: 'Monthly',
    createdDate: '2023-07-20',
    effectiveDate: '2023-08-01',
    expiryDate: '2033-07-31',
    registrationStatus: 'Registered at Sub-Registrar',
    subRegistrarOffice: 'Moodbidri SRO (Doc No: 890/2023 Book 1)',
    documentsCount: 6
  },
  {
    id: 'AGR-PUR-04',
    agreementNumber: 'RZ-LND-2024-PUR-004',
    type: 'Purchase',
    status: 'Registered',
    ownerId: 'LND-OWN-03',
    ownerName: 'Thomas Mathew',
    parcelIds: ['PARCEL-WYD-01'],
    parcelSurveys: 'Survey 412/1 (8.50 Acres)',
    quarryId: 'Q004',
    quarryName: 'Wayanad Basalt Corridor',
    workingAreaId: 'WA-WYD-01',
    workingAreaName: 'Black Basalt Cutting Face',
    material: 'Basalt Black Stone / Aggregates',
    extentInCents: 850,
    extentInAcres: 8.5,
    purchaseRatePerCentRs: 250000,
    purchaseTotalAmountRs: 21250000,
    totalAgreedPayableRs: 21250000,
    advanceAmountRs: 3000000,
    paidAmountRs: 18250000,
    balanceAmountRs: 0,
    paymentCycle: 'Lump Sum',
    createdDate: '2024-01-15',
    effectiveDate: '2024-02-01',
    registrationStatus: 'Registered at Sub-Registrar',
    subRegistrarOffice: 'Mananthavady SRO (Sale Deed 312/2024)',
    documentsCount: 5
  },
  {
    id: 'AGR-MNR-05',
    agreementNumber: 'RZ-LND-2024-MNR-005',
    type: 'Mining & Return',
    status: 'Approved',
    ownerId: 'LND-OWN-04',
    ownerName: 'Smt. Fathima Bi & A. Abdul Razak',
    parcelIds: ['PARCEL-MNJ-01'],
    parcelSurveys: 'Survey 284/1 (380 Cents)',
    quarryId: 'Q002',
    quarryName: 'Manjeshwar Pit #02',
    workingAreaId: 'WA-MNJ-01',
    workingAreaName: 'Bench 1 - Main Face',
    material: 'Laterite Stone (Grade A Masonry)',
    extentInCents: 380,
    extentInAcres: 3.8,
    miningAgreedAmountRs: 3800000,
    miningRatePerCentRs: 100000,
    miningPeriodMonths: 24,
    miningStartDate: '2024-04-01',
    expectedCompletionDate: '2026-03-31',
    returnCondition: 'Ground to be leveled, compound retaining wall constructed and handed back for rubber or cashew replanting.',
    totalAgreedPayableRs: 3800000,
    advanceAmountRs: 400000,
    paidAmountRs: 1300000,
    balanceAmountRs: 2100000,
    paymentCycle: 'Monthly',
    createdDate: '2024-03-12',
    effectiveDate: '2024-04-01',
    expiryDate: '2026-03-31',
    registrationStatus: 'Stamp Paper Notarized',
    documentsCount: 3
  }
];

// ==========================================
// 6. WORKING AREAS DATA (Connecting Quarry <-> Land <-> Agreement)
// ==========================================
export const DEMO_LAND_WORKING_AREAS: LandWorkingArea[] = [
  {
    id: 'WA-KSD-01',
    code: 'WA-01-NORTH',
    name: 'Bench A - North Face',
    quarryId: 'Q001',
    quarryName: 'Kasaragod Pit #01',
    parcelIds: ['PARCEL-KSD-01'],
    parcelSurveys: 'Survey 412/1A',
    ownerIds: ['LND-OWN-01'],
    ownerNames: 'Shri V. Prabhakar Pai',
    agreementIds: ['AGR-MNR-01'],
    agreementTypes: ['Mining & Return'],
    material: 'Laterite Stone (Grade A Premium)',
    areaExtentCents: 250,
    areaExtentAcres: 2.5,
    benchDepthMeters: 12.5,
    productionStatus: 'Active Extraction',
    loadCount: 420,
    totalExtractedQty: '54,000 Stones / Month',
    startDate: '2024-05-01',
    endDate: '2027-04-30',
    status: 'Active',
    dailyTargetLoads: 18,
    quarryManager: 'K. Mohan Kumar'
  },
  {
    id: 'WA-KSD-02',
    code: 'WA-02-DEEP',
    name: 'Bench B - Deep Face',
    quarryId: 'Q001',
    quarryName: 'Kasaragod Pit #01',
    parcelIds: ['PARCEL-KSD-02'],
    parcelSurveys: 'Survey 412/2B',
    ownerIds: ['LND-OWN-01'],
    ownerNames: 'Shri V. Prabhakar Pai',
    agreementIds: ['AGR-LOD-02'],
    agreementTypes: ['Per-Load'],
    material: 'Laterite Masonry Stones',
    areaExtentCents: 200,
    areaExtentAcres: 2.0,
    benchDepthMeters: 18.0,
    productionStatus: 'Active Extraction',
    loadCount: 250,
    totalExtractedQty: '30,000 Stones / Month',
    startDate: '2025-02-01',
    endDate: '2026-08-31',
    status: 'Active',
    dailyTargetLoads: 12,
    quarryManager: 'Nafid Khan'
  },
  {
    id: 'WA-DK-01',
    code: 'WA-DK-MAIN',
    name: 'Main Grey Granite Quarry Face',
    quarryId: 'Q003',
    quarryName: 'Moodbidri Granite Zone',
    parcelIds: ['PARCEL-DK-01'],
    parcelSurveys: 'Survey 119/4',
    ownerIds: ['LND-OWN-02'],
    ownerNames: 'Devadas Shetty',
    agreementIds: ['AGR-HYB-03'],
    agreementTypes: ['Hybrid'],
    material: 'Blue Metal Granite / Aggregates',
    areaExtentCents: 1800,
    areaExtentAcres: 18.0,
    benchDepthMeters: 24.0,
    productionStatus: 'Active Extraction',
    loadCount: 1140,
    totalExtractedQty: '45,000 MT / Month',
    startDate: '2023-08-01',
    endDate: '2033-07-31',
    status: 'Active',
    dailyTargetLoads: 45,
    quarryManager: 'Praveen Alva'
  },
  {
    id: 'WA-WYD-01',
    code: 'WA-WYD-BASALT',
    name: 'Black Basalt Cutting Face',
    quarryId: 'Q004',
    quarryName: 'Wayanad Basalt Corridor',
    parcelIds: ['PARCEL-WYD-01'],
    parcelSurveys: 'Survey 412/1',
    ownerIds: ['LND-OWN-03'],
    ownerNames: 'Thomas Mathew',
    agreementIds: ['AGR-PUR-04'],
    agreementTypes: ['Purchase'],
    material: 'Basalt Black Stone / Aggregates',
    areaExtentCents: 850,
    areaExtentAcres: 8.5,
    benchDepthMeters: 15.0,
    productionStatus: 'Active Extraction',
    loadCount: 310,
    totalExtractedQty: '18,000 MT / Month',
    startDate: '2024-02-01',
    endDate: '2029-01-31',
    status: 'Active',
    dailyTargetLoads: 20,
    quarryManager: 'Babu Kurian'
  },
  {
    id: 'WA-MNJ-01',
    code: 'WA-MNJ-MAIN',
    name: 'Bench 1 - Main Face',
    quarryId: 'Q002',
    quarryName: 'Manjeshwar Pit #02',
    parcelIds: ['PARCEL-MNJ-01'],
    parcelSurveys: 'Survey 284/1',
    ownerIds: ['LND-OWN-04'],
    ownerNames: 'Smt. Fathima Bi & A. Abdul Razak',
    agreementIds: ['AGR-MNR-05'],
    agreementTypes: ['Mining & Return'],
    material: 'Laterite Stone (Grade A Masonry)',
    areaExtentCents: 380,
    areaExtentAcres: 3.8,
    benchDepthMeters: 8.2,
    productionStatus: 'Active Extraction',
    loadCount: 380,
    totalExtractedQty: '46,000 Stones / Month',
    startDate: '2024-04-01',
    endDate: '2026-03-31',
    status: 'Active',
    dailyTargetLoads: 16,
    quarryManager: 'Iqbal Kumble'
  }
];

// ==========================================
// 7. TRACEABILITY LOADS (Load -> Working Area -> Agreement -> Parcel -> Owner)
// ==========================================
export const DEMO_TRACEABILITY_LOADS: LandTraceabilityLoad[] = [
  {
    id: 'TRC-LOD-001',
    loadNumber: 'LOAD-2026-09-001',
    date: '2026-09-22',
    time: '08:30 AM',
    quarryId: 'Q001',
    quarryName: 'Kasaragod Pit #01',
    workingAreaId: 'WA-KSD-01',
    workingAreaName: 'Bench A - North Face',
    parcelId: 'PARCEL-KSD-01',
    parcelSurvey: 'Survey 412/1A',
    agreementId: 'AGR-MNR-01',
    agreementNumber: 'RZ-LND-2024-MNR-001',
    agreementType: 'Mining & Return',
    ownerId: 'LND-OWN-01',
    ownerName: 'Shri V. Prabhakar Pai',
    material: 'Laterite Stone (Grade A)',
    quantity: 120,
    unit: 'Stones',
    vehicleNumber: 'KL-14-AC-9901',
    driverName: 'Suresh Kumar',
    ratePerUnitRs: 5.50,
    payableToOwnerRs: 660,
    settlementStatus: 'Settled',
    gatePassNumber: 'GP-KSD-8810'
  },
  {
    id: 'TRC-LOD-002',
    loadNumber: 'LOAD-2026-09-002',
    date: '2026-09-22',
    time: '09:15 AM',
    quarryId: 'Q001',
    quarryName: 'Kasaragod Pit #01',
    workingAreaId: 'WA-KSD-02',
    workingAreaName: 'Bench B - Deep Face',
    parcelId: 'PARCEL-KSD-02',
    parcelSurvey: 'Survey 412/2B',
    agreementId: 'AGR-LOD-02',
    agreementNumber: 'RZ-LND-2025-LOD-002',
    agreementType: 'Per-Load',
    ownerId: 'LND-OWN-01',
    ownerName: 'Shri V. Prabhakar Pai',
    material: 'Laterite Masonry Stones',
    quantity: 150,
    unit: 'Stones',
    vehicleNumber: 'KA-19-B-4412',
    driverName: 'Ramesh Gowda',
    ratePerUnitRs: 5000, // Per full vehicle load
    payableToOwnerRs: 5000,
    settlementStatus: 'Approved',
    gatePassNumber: 'GP-KSD-8811'
  },
  {
    id: 'TRC-LOD-003',
    loadNumber: 'LOAD-2026-09-003',
    date: '2026-09-22',
    time: '10:45 AM',
    quarryId: 'Q001',
    quarryName: 'Kasaragod Pit #01',
    workingAreaId: 'WA-KSD-01',
    workingAreaName: 'Bench A - North Face',
    parcelId: 'PARCEL-KSD-01',
    parcelSurvey: 'Survey 412/1A',
    agreementId: 'AGR-MNR-01',
    agreementNumber: 'RZ-LND-2024-MNR-001',
    agreementType: 'Mining & Return',
    ownerId: 'LND-OWN-01',
    ownerName: 'Shri V. Prabhakar Pai',
    material: 'Laterite Stone (Grade A)',
    quantity: 100,
    unit: 'Stones',
    vehicleNumber: 'KL-14-Y-8812',
    driverName: 'Muneer P.A.',
    ratePerUnitRs: 5.50,
    payableToOwnerRs: 550,
    settlementStatus: 'Approved',
    gatePassNumber: 'GP-KSD-8812'
  },
  {
    id: 'TRC-LOD-004',
    loadNumber: 'LOAD-2026-09-004',
    date: '2026-09-22',
    time: '11:30 AM',
    quarryId: 'Q003',
    quarryName: 'Moodbidri Granite Zone',
    workingAreaId: 'WA-DK-01',
    workingAreaName: 'Main Grey Granite Quarry Face',
    parcelId: 'PARCEL-DK-01',
    parcelSurvey: 'Survey 119/4',
    agreementId: 'AGR-HYB-03',
    agreementNumber: 'RZ-LND-2023-HYB-003',
    agreementType: 'Hybrid',
    ownerId: 'LND-OWN-02',
    ownerName: 'Devadas Shetty',
    material: '20mm Granite Aggregate',
    quantity: 28,
    unit: 'MT',
    vehicleNumber: 'KA-20-C-1904',
    driverName: 'Santhosh Poojary',
    ratePerUnitRs: 45, // Rs 45 per MT royalty
    payableToOwnerRs: 1260,
    settlementStatus: 'Pending',
    gatePassNumber: 'GP-MBD-4419'
  },
  {
    id: 'TRC-LOD-005',
    loadNumber: 'LOAD-2026-09-005',
    date: '2026-09-21',
    time: '02:15 PM',
    quarryId: 'Q002',
    quarryName: 'Manjeshwar Pit #02',
    workingAreaId: 'WA-MNJ-01',
    workingAreaName: 'Bench 1 - Main Face',
    parcelId: 'PARCEL-MNJ-01',
    parcelSurvey: 'Survey 284/1',
    agreementId: 'AGR-MNR-05',
    agreementNumber: 'RZ-LND-2024-MNR-005',
    agreementType: 'Mining & Return',
    ownerId: 'LND-OWN-04',
    ownerName: 'Smt. Fathima Bi & A. Abdul Razak',
    material: 'Laterite Stone (Grade A Masonry)',
    quantity: 130,
    unit: 'Stones',
    vehicleNumber: 'KL-14-W-3310',
    driverName: 'Abdul Kareem',
    ratePerUnitRs: 5.20,
    payableToOwnerRs: 676,
    settlementStatus: 'Settled',
    gatePassNumber: 'GP-MNJ-2201'
  }
];

// ==========================================
// 8. FINANCIAL DATA (Accounts, Advances, Payments, Settlements, Statements)
// ==========================================
export const DEMO_OWNER_ACCOUNTS: LandOwnerAccount[] = [
  {
    ownerId: 'LND-OWN-01',
    ownerName: 'Shri V. Prabhakar Pai',
    totalAgreementsValueRs: 6000000,
    totalAdvancesReceivedRs: 700000,
    totalLoadPayablesRs: 1850000,
    totalPaymentsReceivedRs: 1600000,
    netAdjustmentsRs: 0,
    currentOutstandingBalanceRs: 250000,
    pendingSettlementRs: 85000
  },
  {
    ownerId: 'LND-OWN-02',
    ownerName: 'Devadas Shetty',
    totalAgreementsValueRs: 4800000,
    totalAdvancesReceivedRs: 2500000,
    totalLoadPayablesRs: 4800000,
    totalPaymentsReceivedRs: 4200000,
    netAdjustmentsRs: 0,
    currentOutstandingBalanceRs: 600000,
    pendingSettlementRs: 125000
  },
  {
    ownerId: 'LND-OWN-03',
    ownerName: 'Thomas Mathew',
    totalAgreementsValueRs: 21250000,
    totalAdvancesReceivedRs: 3000000,
    totalLoadPayablesRs: 21250000,
    totalPaymentsReceivedRs: 18250000,
    netAdjustmentsRs: 0,
    currentOutstandingBalanceRs: 0,
    pendingSettlementRs: 0
  },
  {
    ownerId: 'LND-OWN-04',
    ownerName: 'Smt. Fathima Bi & A. Abdul Razak',
    totalAgreementsValueRs: 3800000,
    totalAdvancesReceivedRs: 400000,
    totalLoadPayablesRs: 1450000,
    totalPaymentsReceivedRs: 1300000,
    netAdjustmentsRs: 0,
    currentOutstandingBalanceRs: 150000,
    pendingSettlementRs: 42000
  }
];

export const DEMO_OWNER_ADVANCES: OwnerAdvance[] = [
  {
    id: 'ADV-001',
    advanceNumber: 'ADV-2024-001',
    ownerId: 'LND-OWN-01',
    ownerName: 'Shri V. Prabhakar Pai',
    agreementId: 'AGR-MNR-01',
    agreementNumber: 'RZ-LND-2024-MNR-001',
    date: '2024-04-20',
    amountRs: 500000,
    paymentMethod: 'RTGS',
    referenceNumber: 'RTGS/CNRB/20240420/99812',
    adjustedAgainstLoadsRs: 400000,
    remainingAdvanceRs: 100000,
    status: 'Active',
    notes: 'Mobilization & site clearing advance paid upon title clearance.'
  },
  {
    id: 'ADV-002',
    advanceNumber: 'ADV-2025-002',
    ownerId: 'LND-OWN-01',
    ownerName: 'Shri V. Prabhakar Pai',
    agreementId: 'AGR-LOD-02',
    agreementNumber: 'RZ-LND-2025-LOD-002',
    date: '2025-01-25',
    amountRs: 200000,
    paymentMethod: 'NEFT',
    referenceNumber: 'NEFT/HDFC/20250125/44120',
    adjustedAgainstLoadsRs: 150000,
    remainingAdvanceRs: 50000,
    status: 'Active',
    notes: 'Haul road extension commitment advance.'
  },
  {
    id: 'ADV-003',
    advanceNumber: 'ADV-2023-003',
    ownerId: 'LND-OWN-02',
    ownerName: 'Devadas Shetty',
    agreementId: 'AGR-HYB-03',
    agreementNumber: 'RZ-LND-2023-HYB-003',
    date: '2023-07-25',
    amountRs: 2500000,
    paymentMethod: 'RTGS',
    referenceNumber: 'RTGS/SBIN/20230725/11094',
    adjustedAgainstLoadsRs: 0,
    remainingAdvanceRs: 2500000,
    status: 'Active',
    notes: '10-Year lease refundable security deposit.'
  },
  {
    id: 'ADV-004',
    advanceNumber: 'ADV-2024-004',
    ownerId: 'LND-OWN-04',
    ownerName: 'Smt. Fathima Bi & A. Abdul Razak',
    agreementId: 'AGR-MNR-05',
    agreementNumber: 'RZ-LND-2024-MNR-005',
    date: '2024-03-20',
    amountRs: 400000,
    paymentMethod: 'NEFT',
    referenceNumber: 'NEFT/SIBL/20240320/88123',
    adjustedAgainstLoadsRs: 300000,
    remainingAdvanceRs: 100000,
    status: 'Active',
    notes: 'Initial boundary wall & leveling advance.'
  }
];

export const DEMO_OWNER_PAYMENTS: OwnerPayment[] = [
  {
    id: 'PAY-001',
    paymentNumber: 'PAY-2026-09-101',
    ownerId: 'LND-OWN-01',
    ownerName: 'Shri V. Prabhakar Pai',
    agreementId: 'AGR-MNR-01',
    agreementNumber: 'RZ-LND-2024-MNR-001',
    amountRs: 120000,
    date: '2026-09-10',
    paymentMethod: 'RTGS',
    referenceNumber: 'RTGS/CNRB/20260910/77412',
    notes: 'August 2026 Monthly Mining & Return installment payout.',
    settlementId: 'SET-2026-08',
    status: 'Completed'
  },
  {
    id: 'PAY-002',
    paymentNumber: 'PAY-2026-09-102',
    ownerId: 'LND-OWN-01',
    ownerName: 'Shri V. Prabhakar Pai',
    agreementId: 'AGR-LOD-02',
    agreementNumber: 'RZ-LND-2025-LOD-002',
    amountRs: 75000,
    date: '2026-09-15',
    paymentMethod: 'NEFT',
    referenceNumber: 'NEFT/HDFC/20260915/22901',
    notes: '15-Day load dispatch reconciliation payout (15 loads @ ₹5,000).',
    settlementId: 'SET-2026-08-LOD',
    status: 'Completed'
  },
  {
    id: 'PAY-003',
    paymentNumber: 'PAY-2026-09-103',
    ownerId: 'LND-OWN-02',
    ownerName: 'Devadas Shetty',
    agreementId: 'AGR-HYB-03',
    agreementNumber: 'RZ-LND-2023-HYB-003',
    amountRs: 180000,
    date: '2026-09-05',
    paymentMethod: 'RTGS',
    referenceNumber: 'RTGS/SBIN/20260905/66184',
    notes: 'Monthly fixed lease ₹1,00,000 + August aggregate royalty payout ₹80,000.',
    settlementId: 'SET-2026-08-MBD',
    status: 'Completed'
  },
  {
    id: 'PAY-004',
    paymentNumber: 'PAY-2026-09-104',
    ownerId: 'LND-OWN-04',
    ownerName: 'Smt. Fathima Bi & A. Abdul Razak',
    agreementId: 'AGR-MNR-05',
    agreementNumber: 'RZ-LND-2024-MNR-005',
    amountRs: 95000,
    date: '2026-09-08',
    paymentMethod: 'UPI',
    referenceNumber: 'UPI/SIBL/20260908/441829',
    notes: 'August extraction milestone payout.',
    settlementId: 'SET-2026-08-MNJ',
    status: 'Completed'
  }
];

export const DEMO_OWNER_SETTLEMENTS: OwnerSettlement[] = [
  {
    id: 'SET-001',
    settlementNumber: 'SET-2026-08-KSD',
    ownerId: 'LND-OWN-01',
    ownerName: 'Shri V. Prabhakar Pai',
    agreementId: 'AGR-MNR-01',
    agreementNumber: 'RZ-LND-2024-MNR-001',
    workingAreaId: 'WA-KSD-01',
    workingAreaName: 'Bench A - North Face',
    period: '01 Aug 2026 - 31 Aug 2026',
    totalLoadsCount: 48,
    totalPayableRs: 150000,
    advanceDeductionRs: 30000,
    previouslyPaidRs: 0,
    netPayableRs: 120000,
    settlementStatus: 'Settled',
    date: '2026-09-10',
    notes: 'Approved by Quarry Partner Mohan Kumar. Net payout credited via RTGS.'
  },
  {
    id: 'SET-002',
    settlementNumber: 'SET-2026-09-PENDING',
    ownerId: 'LND-OWN-01',
    ownerName: 'Shri V. Prabhakar Pai',
    agreementId: 'AGR-LOD-02',
    agreementNumber: 'RZ-LND-2025-LOD-002',
    workingAreaId: 'WA-KSD-02',
    workingAreaName: 'Bench B - Deep Face',
    period: '01 Sep 2026 - 15 Sep 2026',
    totalLoadsCount: 22,
    totalPayableRs: 110000,
    advanceDeductionRs: 25000,
    previouslyPaidRs: 0,
    netPayableRs: 85000,
    settlementStatus: 'Under Review',
    date: '2026-09-16',
    notes: 'Weighment slip audit completed. Awaiting partner counter-signature.'
  },
  {
    id: 'SET-003',
    settlementNumber: 'SET-2026-08-MBD',
    ownerId: 'LND-OWN-02',
    ownerName: 'Devadas Shetty',
    agreementId: 'AGR-HYB-03',
    agreementNumber: 'RZ-LND-2023-HYB-003',
    workingAreaId: 'WA-DK-01',
    workingAreaName: 'Main Grey Granite Quarry Face',
    period: '01 Aug 2026 - 31 Aug 2026',
    totalLoadsCount: 312,
    totalPayableRs: 180000,
    advanceDeductionRs: 0,
    previouslyPaidRs: 0,
    netPayableRs: 180000,
    settlementStatus: 'Settled',
    date: '2026-09-05',
    notes: 'Crusher aggregate tonnage 1,780 MT @ ₹45 + base lease ₹1,00,000.'
  },
  {
    id: 'SET-004',
    settlementNumber: 'SET-2026-09-MBD-CURR',
    ownerId: 'LND-OWN-02',
    ownerName: 'Devadas Shetty',
    agreementId: 'AGR-HYB-03',
    agreementNumber: 'RZ-LND-2023-HYB-003',
    workingAreaId: 'WA-DK-01',
    workingAreaName: 'Main Grey Granite Quarry Face',
    period: '01 Sep 2026 - 20 Sep 2026',
    totalLoadsCount: 215,
    totalPayableRs: 125000,
    advanceDeductionRs: 0,
    previouslyPaidRs: 0,
    netPayableRs: 125000,
    settlementStatus: 'Pending',
    date: '2026-09-21',
    notes: 'Mid-month draft settlement generated.'
  }
];

export const DEMO_OWNER_STATEMENTS: OwnerLedgerStatementItem[] = [
  {
    id: 'STMT-001',
    ownerId: 'LND-OWN-01',
    date: '2026-09-01',
    referenceNo: 'BAL-FWD',
    type: 'Reconciliation Adjustment',
    agreementNumber: 'ALL',
    debitRs: 0,
    creditRs: 0,
    balanceRs: 220000,
    remarks: 'Opening Balance brought forward from August ledger.'
  },
  {
    id: 'STMT-002',
    ownerId: 'LND-OWN-01',
    date: '2026-09-10',
    referenceNo: 'PAY-2026-09-101',
    type: 'Payment Payout',
    agreementNumber: 'RZ-LND-2024-MNR-001',
    workingArea: 'Bench A - North Face',
    debitRs: 120000,
    creditRs: 0,
    balanceRs: 100000,
    remarks: 'Monthly settlement payout credited via RTGS (Ref: 77412).'
  },
  {
    id: 'STMT-003',
    ownerId: 'LND-OWN-01',
    date: '2026-09-15',
    referenceNo: 'PAY-2026-09-102',
    type: 'Payment Payout',
    agreementNumber: 'RZ-LND-2025-LOD-002',
    workingArea: 'Bench B - Deep Face',
    debitRs: 75000,
    creditRs: 0,
    balanceRs: 25000,
    remarks: '15-Day load dispatch reconciliation payout credited via NEFT.'
  },
  {
    id: 'STMT-004',
    ownerId: 'LND-OWN-01',
    date: '2026-09-20',
    referenceNo: 'LOD-RUN-SEP-1',
    type: 'Load Extraction Payable',
    agreementNumber: 'RZ-LND-2025-LOD-002',
    workingArea: 'Bench B - Deep Face',
    debitRs: 0,
    creditRs: 110000,
    balanceRs: 135000,
    remarks: '22 Verified Laterite tipper loads extracted (22 @ ₹5,000).'
  },
  {
    id: 'STMT-005',
    ownerId: 'LND-OWN-01',
    date: '2026-09-22',
    referenceNo: 'LOAD-2026-09-001',
    type: 'Load Extraction Payable',
    agreementNumber: 'RZ-LND-2024-MNR-001',
    workingArea: 'Bench A - North Face',
    loadNumber: 'LOAD-2026-09-001',
    debitRs: 0,
    creditRs: 660,
    balanceRs: 135660,
    remarks: 'Daily dispatch 120 Grade A stones to Sobha Construction.'
  }
];

// ==========================================
// 9. MARKETPLACE DATA (Listings, Enquiries, Site Visits)
// ==========================================
export const DEMO_LAND_LISTINGS: LandListingItem[] = [
  {
    id: 'LIST-LND-001',
    listingCode: 'LND-KL-SALE-01',
    ownerId: 'LND-OWN-01',
    ownerNameShielded: 'Verified Land Owner (Kasaragod)',
    ownerRealName: 'Shri V. Prabhakar Pai',
    title: 'High-Density Laterite Stone Quarry Land',
    location: 'Kasaragod - Kanhangad Belt, Kerala',
    village: 'Bare Village',
    taluk: 'Hosdurg',
    district: 'Kasaragod',
    state: 'Kerala',
    surveyReference: 'Survey No. 248/2A & 248/2B',
    extentCents: 1250,
    extentAcres: 12.5,
    accessRoad: 'Tarred PWD Road with 12m turning radius for multi-axle tippers',
    landType: 'Laterite Hillock',
    intendedUse: 'Immediate Mining',
    commercialModel: 'For Sale',
    askingPriceRs: 22500000,
    estimatedYieldMT: '3,80,000 MT / 18,00,000 Cut Stones',
    permits: [
      'Panchayat NOC Active',
      'Geology Department Letter of Intent (LoI)',
      'Clear Jenmam Title Certificate'
    ],
    matchScore: 98,
    status: 'Available',
    featuredImage: 'laterite_quarry_landscape'
  },
  {
    id: 'LIST-LND-002',
    listingCode: 'LND-KA-LEASE-02',
    ownerId: 'LND-OWN-02',
    ownerNameShielded: 'Reputed Landlord (Dakshina Kannada)',
    ownerRealName: 'Devadas Shetty',
    title: 'Blue Metal Hard Rock Granite Quarry & Crusher Site',
    location: 'Moodbidri Quarry Cluster, Dakshina Kannada',
    village: 'Alangar',
    taluk: 'Moodbidri',
    district: 'Dakshina Kannada',
    state: 'Karnataka',
    surveyReference: 'Survey No. 119/4',
    extentCents: 1800,
    extentAcres: 18.0,
    accessRoad: 'Heavy-duty quarry haul road directly linked to NH-169 (1.2 km)',
    landType: 'Granite Outcrop',
    intendedUse: 'Crusher Setup',
    commercialModel: 'For Lease',
    leaseTerms: '₹45 / MT Royalty + ₹25,00,000 Upfront Security Deposit (10-Yr Concession)',
    estimatedYieldMT: '12,50,000 MT Hard Rock Reserve',
    permits: [
      'Pollution Control Board Consent to Operate (CTO)',
      'SEIAA Environmental Clearance',
      'Electricity Sanction 250 HP'
    ],
    matchScore: 94,
    status: 'Deal In Progress',
    featuredImage: 'granite_quarry_site'
  },
  {
    id: 'LIST-LND-003',
    listingCode: 'LND-KL-SALE-03',
    ownerId: 'LND-OWN-03',
    ownerNameShielded: 'Plantation & Hillock Owner',
    ownerRealName: 'Thomas Mathew',
    title: 'Strategic Basalt Hard Rock Hillock Plot',
    location: 'Mananthavady, Wayanad Corridor',
    village: 'Tholpetty',
    taluk: 'Mananthavady',
    district: 'Wayanad',
    state: 'Kerala',
    surveyReference: 'Survey No. 412/1',
    extentCents: 850,
    extentAcres: 8.5,
    accessRoad: 'Dedicated 9m gravel haul track connecting to State Highway 54',
    landType: 'Basalt Hard Rock',
    intendedUse: 'Immediate Mining',
    commercialModel: 'For Sale',
    askingPriceRs: 16500000,
    estimatedYieldMT: '6,20,000 MT Raw Stone Reserve',
    permits: [
      'Revenue Land Tax Clear',
      'Forest Buffer Zone Clearance Verified (>500m)',
      'Groundwater Hydrology NOC'
    ],
    matchScore: 91,
    status: 'Available',
    featuredImage: 'basalt_rock_hillock'
  },
  {
    id: 'LIST-LND-004',
    listingCode: 'LND-KA-JV-04',
    ownerId: 'LND-OWN-05',
    ownerNameShielded: 'Agricultural & Mining Estate',
    ownerRealName: 'Harishchandra Rao',
    title: 'Guruvayanakere Virgin Granite Dome Plot',
    location: 'Guruvayanakere, Belthangady, Karnataka',
    village: 'Guruvayanakere',
    taluk: 'Belthangady',
    district: 'Dakshina Kannada',
    state: 'Karnataka',
    surveyReference: 'Survey No. 94/2',
    extentCents: 550,
    extentAcres: 5.5,
    accessRoad: '12m wide tarred approach from SH-37',
    landType: 'Granite Outcrop',
    intendedUse: 'Lease & Royalty',
    commercialModel: 'Joint Venture',
    leaseTerms: '50% Profit Sharing with Mining Operator or Outright Sale at ₹1.1 Cr',
    askingPriceRs: 11000000,
    estimatedYieldMT: '5,50,000 MT High Grade Granite',
    permits: ['Revenue RTC Mutation Clear', 'Non-Agricultural Mining Conversion Pending'],
    matchScore: 89,
    status: 'Available',
    featuredImage: 'virgin_granite_hill'
  }
];

export const DEMO_BUYER_ENQUIRIES: BuyerEnquiryItem[] = [
  {
    id: 'ENQ-BUY-01',
    enquiryCode: 'BUY-2026-081',
    listingId: 'LIST-LND-001',
    listingTitle: 'High-Density Laterite Stone Quarry Land',
    buyerName: 'Er. Rajesh Varma',
    buyerPhone: '+91 98450 11992',
    buyerEmail: 'rajesh.varma@malabarinfra.com',
    buyerCompany: 'Malabar Infra Developers Pvt Ltd',
    requirement: 'Looking for 10-15 Acres of active laterite stone extraction land for our NH-66 bypass expansion contracts.',
    budgetRs: 22000000,
    message: 'We inspected the Bare Village topography. Willing to negotiate immediate advance upon verification of Mining Dept LoI.',
    date: '2026-09-20',
    status: 'Discussion',
    assignedExecutive: 'K. Mohan Kumar (Mining Operations Desk)'
  },
  {
    id: 'ENQ-BUY-02',
    enquiryCode: 'BUY-2026-082',
    listingId: 'LIST-LND-003',
    listingTitle: 'Strategic Basalt Hard Rock Hillock Plot',
    buyerName: 'Antony Joseph',
    buyerPhone: '+91 94471 88201',
    buyerEmail: 'antony.joseph@wayanadbuilders.com',
    buyerCompany: 'Wayanad Stone & Aggregates',
    requirement: 'Basalt outcrop suitable for 100 TPH crusher plant with road access.',
    budgetRs: 15000000,
    message: 'Requesting certified survey map and FMB sketch copy. Schedule field inspection this Saturday.',
    date: '2026-09-21',
    status: 'Site Visit',
    assignedExecutive: 'Er. Rajesh Nair (Surveyor)'
  }
];

export const DEMO_INVESTOR_ENQUIRIES: InvestorEnquiryItem[] = [
  {
    id: 'ENQ-INV-01',
    enquiryCode: 'INV-2026-041',
    listingId: 'LIST-LND-002',
    listingTitle: 'Blue Metal Hard Rock Granite Quarry & Crusher Site',
    investorName: 'Western Ghats Mining Consortium',
    investorPhone: '+91 824 2498110',
    investorCompany: 'WGMC Private Equity Group',
    investorType: 'Mining Enterprise',
    proposedArrangement: 'Profit Sharing Concession',
    investmentCapacityRs: 50000000,
    message: 'We propose placing a 200 TPH Metso automated crusher with ₹2.5 Cr advance and ₹45/MT royalty for 10-year term sheet.',
    date: '2026-09-18',
    status: 'MoU Drafting',
    assignedExecutive: 'S. K. Hegde (Corporate Concessions Head)'
  },
  {
    id: 'ENQ-INV-02',
    enquiryCode: 'INV-2026-042',
    listingId: 'LIST-LND-004',
    listingTitle: 'Guruvayanakere Virgin Granite Dome Plot',
    investorName: 'Coastal Karnataka Infra Syndicate',
    investorPhone: '+91 98452 77019',
    investorCompany: 'Coastal Aggregates LLP',
    investorType: 'Syndicate',
    proposedArrangement: 'Equity Mining JV',
    investmentCapacityRs: 20000000,
    message: 'Interested in partnering with Shri Harishchandra Rao for joint permit filing and wire-saw development.',
    date: '2026-09-19',
    status: 'Pitch Review',
    assignedExecutive: 'Er. Rajesh Nair (Surveyor)'
  }
];

export const DEMO_SITE_VISITS: SiteVisitItem[] = [
  {
    id: 'VISIT-001',
    visitCode: 'VST-2026-101',
    listingId: 'LIST-LND-001',
    listingTitle: 'High-Density Laterite Stone Quarry Land',
    visitorName: 'Er. Rajesh Varma & Mining Geologist',
    visitorPhone: '+91 98450 11992',
    visitorType: 'Buyer',
    date: '2026-09-24',
    time: '10:30 AM',
    purpose: 'Core sample drilling verification and road gradient measurement.',
    assignedExecutive: 'K. Mohan Kumar (Quarry Head)',
    status: 'Scheduled',
    notes: 'Tipper turning radius demonstration planned with vehicle KL-14-AC-9901.',
    ottTaskId: 'OTT-TASK-8819'
  },
  {
    id: 'VISIT-002',
    visitCode: 'VST-2026-102',
    listingId: 'LIST-LND-003',
    listingTitle: 'Strategic Basalt Hard Rock Hillock Plot',
    visitorName: 'Antony Joseph & Team',
    visitorPhone: '+91 94471 88201',
    visitorType: 'Buyer',
    date: '2026-09-26',
    time: '02:00 PM',
    purpose: 'Boundary survey verification with DGPS instrument.',
    assignedExecutive: 'Er. Rajesh Nair (Surveyor)',
    status: 'Requested',
    notes: 'Coordinate with Mananthavady village officer for FMB sketch verification.',
    ottTaskId: 'OTT-TASK-8822'
  }
];

// ==========================================
// 10. LAND DOCUMENTS DATA
// ==========================================
export const DEMO_LAND_DOCUMENTS: LandDocumentItem[] = [
  {
    id: 'DOC-LND-01',
    docTitle: 'Jenmam Title Deed (Doc No. 1420/2014)',
    docType: 'Title Deed (Jenmam / Kanam)',
    parcelId: 'PARCEL-KSD-01',
    parcelSurvey: 'Survey 412/1A',
    ownerId: 'LND-OWN-01',
    ownerName: 'Shri V. Prabhakar Pai',
    uploadDate: '2024-04-10',
    verifiedStatus: 'Approved',
    fileSize: '4.8 MB',
    mimeType: 'application/pdf',
    fileUrl: '/docs/title_deed_412_1a.pdf',
    notaryOrAuthority: 'Sub-Registrar Office, Hosdurg, Kerala'
  },
  {
    id: 'DOC-LND-02',
    docTitle: 'Geology & Mining Dept Letter of Intent (LoI)',
    docType: 'Panchayat / Geology LoI NOC',
    parcelId: 'PARCEL-KSD-01',
    parcelSurvey: 'Survey 412/1A',
    ownerId: 'LND-OWN-01',
    ownerName: 'Shri V. Prabhakar Pai',
    uploadDate: '2024-04-12',
    verifiedStatus: 'Approved',
    fileSize: '2.1 MB',
    mimeType: 'application/pdf',
    fileUrl: '/docs/geology_loi_ksd.pdf',
    notaryOrAuthority: 'Department of Mining and Geology, Kasaragod'
  },
  {
    id: 'DOC-LND-03',
    docTitle: 'FMB Field Measurement Book Cadastral Map',
    docType: 'Survey Sketch / FMB Sketch',
    parcelId: 'PARCEL-KSD-01',
    parcelSurvey: 'Survey 412/1A',
    ownerId: 'LND-OWN-01',
    ownerName: 'Shri V. Prabhakar Pai',
    uploadDate: '2024-04-14',
    verifiedStatus: 'Approved',
    fileSize: '3.4 MB',
    mimeType: 'image/jpeg',
    fileUrl: '/docs/fmb_bare_412.jpg',
    notaryOrAuthority: 'Taluk Office, Hosdurg'
  },
  {
    id: 'DOC-LND-04',
    docTitle: 'SEIAA Environmental Clearance Certificate',
    docType: 'SEIAA Environmental Clearance',
    parcelId: 'PARCEL-DK-01',
    parcelSurvey: 'Survey 119/4',
    ownerId: 'LND-OWN-02',
    ownerName: 'Devadas Shetty',
    uploadDate: '2023-07-15',
    verifiedStatus: 'Approved',
    fileSize: '6.2 MB',
    mimeType: 'application/pdf',
    fileUrl: '/docs/seiaa_moodbidri_119_4.pdf',
    notaryOrAuthority: 'State Environment Impact Assessment Authority, Karnataka'
  },
  {
    id: 'DOC-LND-05',
    docTitle: 'Registered Mining Concession Lease Deed',
    docType: 'Quarry Mining Agreement',
    parcelId: 'PARCEL-DK-01',
    parcelSurvey: 'Survey 119/4',
    ownerId: 'LND-OWN-02',
    ownerName: 'Devadas Shetty',
    uploadDate: '2023-07-28',
    verifiedStatus: 'Approved',
    fileSize: '5.1 MB',
    mimeType: 'application/pdf',
    fileUrl: '/docs/concession_lease_890.pdf',
    notaryOrAuthority: 'Sub-Registrar Office, Moodbidri'
  },
  {
    id: 'DOC-LND-06',
    docTitle: 'Registered Sale Deed (Doc No. 312/2024)',
    docType: 'Registered Sale Deed',
    parcelId: 'PARCEL-WYD-01',
    parcelSurvey: 'Survey 412/1',
    ownerId: 'LND-OWN-03',
    ownerName: 'Thomas Mathew',
    uploadDate: '2024-01-22',
    verifiedStatus: 'Approved',
    fileSize: '3.9 MB',
    mimeType: 'application/pdf',
    fileUrl: '/docs/sale_deed_mananthavady.pdf',
    notaryOrAuthority: 'Sub-Registrar Office, Mananthavady'
  },
  {
    id: 'DOC-LND-07',
    docTitle: 'Land Revenue Tax Paid Receipt (2025-26)',
    docType: 'Tax Receipt & Pokkuvaravu',
    parcelId: 'PARCEL-KSD-02',
    parcelSurvey: 'Survey 412/2B',
    ownerId: 'LND-OWN-01',
    ownerName: 'Shri V. Prabhakar Pai',
    uploadDate: '2025-05-10',
    verifiedStatus: 'Approved',
    fileSize: '1.2 MB',
    mimeType: 'application/pdf',
    fileUrl: '/docs/tax_receipt_2025.pdf',
    notaryOrAuthority: 'Bare Village Office, Kerala Revenue'
  }
];

// Helper calculations for summary dashboard
export const getLandDashboardMetrics = () => {
  const totalOwners = DEMO_LAND_OWNERS.length;
  const totalParcels = DEMO_LAND_PARCELS.length;
  const totalExtentCents = DEMO_LAND_PARCELS.reduce((acc, p) => acc + p.extentInCents, 0);
  const totalExtentAcres = DEMO_LAND_PARCELS.reduce((acc, p) => acc + p.extentInAcres, 0);
  
  const connectedParcels = DEMO_LAND_PARCELS.filter(p => p.quarryId).length;
  const availableParcels = DEMO_LAND_PARCELS.filter(p => p.currentStatus === 'Available').length;
  const activeWorkingAreas = DEMO_LAND_WORKING_AREAS.filter(w => w.status === 'Active').length;
  const activeAgreements = DEMO_LAND_AGREEMENTS.filter(a => a.status === 'Registered' || a.status === 'Approved').length;
  
  const buyerEnquiries = DEMO_BUYER_ENQUIRIES.length;
  const investorEnquiries = DEMO_INVESTOR_ENQUIRIES.length;
  const totalEnquiries = buyerEnquiries + investorEnquiries;
  
  const totalAdvances = DEMO_OWNER_ADVANCES.reduce((acc, a) => acc + a.amountRs, 0);
  const remainingAdvances = DEMO_OWNER_ADVANCES.reduce((acc, a) => acc + a.remainingAdvanceRs, 0);
  const totalPayablesEarned = DEMO_OWNER_ACCOUNTS.reduce((acc, a) => acc + a.totalLoadPayablesRs, 0);
  const totalPaid = DEMO_OWNER_ACCOUNTS.reduce((acc, a) => acc + a.totalPaymentsReceivedRs, 0);
  const totalOutstanding = DEMO_OWNER_ACCOUNTS.reduce((acc, a) => acc + a.currentOutstandingBalanceRs, 0);
  const pendingSettlement = DEMO_OWNER_ACCOUNTS.reduce((acc, a) => acc + a.pendingSettlementRs, 0);

  // Breakdown by Agreement Type
  const purchaseAgreements = DEMO_LAND_AGREEMENTS.filter(a => a.type === 'Purchase');
  const miningReturnAgreements = DEMO_LAND_AGREEMENTS.filter(a => a.type === 'Mining & Return');
  const perLoadAgreements = DEMO_LAND_AGREEMENTS.filter(a => a.type === 'Per-Load');
  const hybridAgreements = DEMO_LAND_AGREEMENTS.filter(a => a.type === 'Hybrid');

  const purchaseValue = purchaseAgreements.reduce((acc, a) => acc + a.totalAgreedPayableRs, 0);
  const miningReturnValue = miningReturnAgreements.reduce((acc, a) => acc + a.totalAgreedPayableRs, 0);
  const perLoadValue = perLoadAgreements.reduce((acc, a) => acc + a.totalAgreedPayableRs, 0);
  const hybridValue = hybridAgreements.reduce((acc, a) => acc + a.totalAgreedPayableRs, 0);

  return {
    totalOwners,
    totalParcels,
    totalExtentCents,
    totalExtentAcres: parseFloat(totalExtentAcres.toFixed(2)),
    connectedParcels,
    availableParcels,
    activeWorkingAreas,
    activeAgreements,
    totalEnquiries,
    buyerEnquiries,
    investorEnquiries,
    totalAdvances,
    remainingAdvances,
    totalPayablesEarned,
    totalPaid,
    totalOutstanding,
    pendingSettlement,
    agreementBreakdown: {
      purchaseCount: purchaseAgreements.length,
      purchaseValue,
      miningReturnCount: miningReturnAgreements.length,
      miningReturnValue,
      perLoadCount: perLoadAgreements.length,
      perLoadValue,
      hybridCount: hybridAgreements.length,
      hybridValue
    }
  };
};

// Unit conversion tool helper
export const convertLandUnit = (
  value: number,
  from: LandUnit,
  to: LandUnit
): number => {
  // Conversion factors to Cents (Kerala standard 1 Acre = 100 Cents, 1 Hectare = 247.1 Cents, 1 Cent = 435.6 Sq.Ft = 40.4686 Sq.M)
  let cents = 0;
  switch (from) {
    case 'Cent':
      cents = value;
      break;
    case 'Acre':
      cents = value * 100;
      break;
    case 'Hectare':
      cents = value * 247.105;
      break;
    case 'Sq.Ft':
      cents = value / 435.6;
      break;
    case 'Sq.M':
      cents = value / 40.4686;
      break;
  }

  switch (to) {
    case 'Cent':
      return parseFloat(cents.toFixed(2));
    case 'Acre':
      return parseFloat((cents / 100).toFixed(4));
    case 'Hectare':
      return parseFloat((cents / 247.105).toFixed(4));
    case 'Sq.Ft':
      return parseFloat((cents * 435.6).toFixed(1));
    case 'Sq.M':
      return parseFloat((cents * 40.4686).toFixed(1));
  }
};
