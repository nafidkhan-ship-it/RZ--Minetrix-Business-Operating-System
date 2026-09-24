// =============================================================
// RZ® MINETRIX — PLATFORM 2: CRUSHER MANAGEMENT STUDIO DATA
// Enterprise Quarry-Crusher Integrated Data Model & Demo Values
// Note: STUDIO PREVIEW / DEMO DATA (Not live production database)
// =============================================================

export type CrusherType =
  | 'Jaw Crusher'
  | 'Cone Crusher'
  | 'VSI (Vertical Shaft Impactor)'
  | 'Impact Crusher'
  | '3-Stage Multi-Plant (Jaw + Cone + VSI)'
  | 'Sand Washing Plant'
  | 'Other / Custom';

export type PlantStatus = 'OPERATIONAL' | 'MAINTENANCE' | 'IDLE' | 'STANDBY' | 'DECOMMISSIONED';

export type RawMaterialType =
  | 'Hard Rock Boulder'
  | 'Granite Run-of-Mine'
  | 'Laterite Ballast'
  | 'Overburden / GSB Feed'
  | 'River Gravel'
  | 'Quarry Spalls';

export type RawMaterialSource =
  | 'Own Quarry'
  | 'External Quarry'
  | 'Contract Supplier'
  | 'Market Purchase'
  | 'Other';

export type ReceiptStatus =
  | 'Expected'
  | 'Arrived'
  | 'Weighed'
  | 'Accepted'
  | 'Rejected'
  | 'Partially Accepted';

export type GateEntryType = 'INCOMING' | 'OUTGOING';

export type GateEntryStatus =
  | 'Waiting'
  | 'Entered'
  | 'Processing'
  | 'Completed'
  | 'Exited';

export type StockHealthStatus = 'Healthy' | 'Low' | 'Critical' | 'Out of Stock';

export type PurchaseCategory =
  | 'Raw Material (Boulders)'
  | 'Spare Parts & Jaw Plates'
  | 'VSI Rotor & Anvils'
  | 'Lubricants & Hydraulic Oil'
  | 'Electricity & Power Equipment'
  | 'Conveyor Belts & Rollers'
  | 'Plant Maintenance Services'
  | 'Fuel / HSD Diesel'
  | 'Other';

export type ExpenseCategory =
  | 'Electricity & KSEB Power'
  | 'Fuel / Diesel (Genset & Loaders)'
  | 'Labour & Plant Wages'
  | 'Maintenance & Overhauls'
  | 'Spare Parts & Wear Liners'
  | 'Machinery Lease & Hire'
  | 'Permits, PCB & DMG Royalty'
  | 'Transport & Internal Haulage'
  | 'Yard Rent & Land Lease'
  | 'Partner Profit Dividend'
  | 'Other Operational Costs';

export type InvestmentType =
  | 'Initial Equity Capital'
  | 'Additional Plant Expansion'
  | 'Equipment Investment (VSI/Cone)'
  | 'Working Capital Loan'
  | 'Capital Withdrawal'
  | 'Other';

export type SettlementType =
  | 'Profit Settlement'
  | 'Capital Settlement'
  | 'Expense Reimbursement'
  | 'Equipment Dividend'
  | 'Other';

// -------------------------------------------------------------
// CORE INTERFACES
// -------------------------------------------------------------

export interface CrusherPlant {
  id: string;
  code: string;
  name: string;
  businessName: string;
  location: string;
  district: string;
  state: string;
  contactPerson: string;
  contactPhone: string;
  plantType: CrusherType;
  capacityTPH: number; // Tons Per Hour
  capacityUnit: string;
  installedDate: string;
  status: PlantStatus;
  machineCount: number;
  machineDetails: string[];
  mainProducts: string[];
  connectedPowerKW: number;
  permitNumber: string;
  permitType: string;
  permitIssueDate: string;
  permitExpiryDate: string;
  permitStatus: 'VALID' | 'EXPIRING' | 'RENEWAL_SUBMITTED';
  todayProductionTons: number;
  monthProductionTons: number;
  rawMaterialStockTons: number;
  finishedProductStockTons: number;
  partnerNames: string[];
  partnerCount: number;
}

export interface CrusherPartner {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  panNumber: string;
  bankDetails: string;
  effectiveDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DORMANT';
  // Financial allocations
  totalInvestment: number;
  ownershipPercent: number;
  profitSharePercent: number; // Can be different from ownership
  lossSharePercent: number;
  revenueSharePercent: number;
  expenseSharePercent: number;
  capitalContributed: number;
  profitPaidToDate: number;
  currentOutstandingPayable: number;
  assignedPlantIds: string[];
  assignedPlantNames: string[];
  // Person / Party multi-role flags
  isAlsoQuarryPartner: boolean;
  isAlsoLandOwner: boolean;
  isAlsoVehicleOwner: boolean;
  isAlsoSupplier: boolean;
  roleTags: string[];
}

export interface CrusherInvestment {
  id: string;
  investmentNumber: string;
  partnerId: string;
  partnerName: string;
  plantId: string;
  plantName: string;
  type: InvestmentType;
  amount: number;
  date: string;
  referenceNumber: string;
  ownershipPercentImpact: number;
  capitalAccountBalanceAfter: number;
  notes: string;
  documentRef?: string;
  status: 'APPROVED' | 'PENDING_APPROVAL' | 'RECONCILED';
}

export interface RawMaterialRecord {
  id: string;
  code: string;
  materialType: RawMaterialType;
  sourceType: RawMaterialSource;
  sourceQuarryId?: string;
  sourceQuarryName?: string;
  sourceWorkingArea?: string;
  supplierName: string;
  quarryLoadRef?: string;
  inwardDate: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  grossWeightTons: number;
  tareWeightTons: number;
  netWeightTons: number;
  ratePerTon: number;
  totalCost: number;
  status: 'ACCEPTED' | 'IN_STOCKPILE' | 'CRUSHED' | 'REJECTED';
  notes: string;
}

export interface MaterialReceipt {
  id: string;
  receiptNumber: string;
  date: string;
  time: string;
  crusherPlantId: string;
  crusherPlantName: string;
  sourceQuarryId?: string;
  sourceQuarryName: string;
  sourceWorkingArea?: string;
  sourceQuarryLoadId?: string;
  supplierName: string;
  material: RawMaterialType | string;
  quantityTons: number;
  unit: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone?: string;
  weighbridgeGrossTons: number;
  weighbridgeTareTons: number;
  weighbridgeNetTons: number;
  moistureDeductionPercent: number;
  payableNetTons: number;
  ratePerTon: number;
  totalAmount: number;
  referenceChallanNo: string;
  weighbridgeSlipNo: string;
  status: ReceiptStatus;
  qualityGrade: 'Grade A Hard Granite' | 'Grade B Trap Rock' | 'Laterite Spalls' | 'Sub-grade (High Dust)';
  receivedBy: string;
}

export interface ProductionOutputItem {
  productCode: string;
  productName: string;
  quantityTons: number;
  percentageOfOutput: number;
  siloAllocation: string;
}

export interface CrusherProduction {
  id: string;
  productionNumber: string;
  date: string;
  shift: 'Shift 1 (Day 07:00 - 15:30)' | 'Shift 2 (Evening 15:30 - 23:00)' | 'Shift 3 (Night Batch)';
  plantId: string;
  plantName: string;
  rawMaterialType: RawMaterialType;
  inputQuantityTons: number;
  // Multiple outputs breakdown
  outputs: ProductionOutputItem[];
  totalOutputTons: number;
  wastageTons: number;
  wastagePercent: number;
  operatorName: string;
  primaryCrusherUnit: string;
  workingHours: number;
  powerUnitsConsumedKWh: number;
  dieselConsumedLiters: number;
  crushingEfficiencyTPH: number;
  notes: string;
  status: 'VERIFIED' | 'PENDING_AUDIT';
}

export interface CrusherProduct {
  id: string;
  code: string;
  name: string;
  category: 'Manufactured Sand' | 'Coarse Aggregate' | 'Fine Aggregate' | 'Sub-base (GSB)' | 'Mineral Powder';
  unit: 'Tons' | 'CBM' | 'Loads';
  hsnCode: string;
  gstRate: number; // e.g. 5%
  productionCostPerTon: number;
  defaultSalesRatePerTon: number;
  minSalesRatePerTon: number;
  maxSalesRatePerTon: number;
  stockTracking: boolean;
  currentStockTons: number;
  stockSiloName: string;
  status: 'ACTIVE' | 'INACTIVE';
  specifications: string;
}

export interface CrusherStockItem {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  unit: string;
  siloOrBayLocation: string;
  openingStockTons: number;
  producedTons: number;
  purchasedTons: number;
  soldTons: number;
  transferredTons: number;
  wastageTons: number;
  closingStockTons: number;
  reservedStockTons: number;
  availableStockTons: number;
  stockValueINR: number;
  healthStatus: StockHealthStatus;
  reorderLevelTons: number;
  lastUpdated: string;
}

export interface CrusherWastageRecord {
  id: string;
  wastageNumber: string;
  date: string;
  plantId: string;
  plantName: string;
  productionRef: string;
  rawMaterial: string;
  productImpacted: string;
  quantityTons: number;
  unit: string;
  reason: 'Screen Blinding & Oversize' | 'Sludge / Washing Clay Loss' | 'Conveyor Spillage' | 'Moisture Evaporation' | 'Sub-grade Powder';
  machineSource: string;
  operatorName: string;
  approvedBy: string;
  financialImpactINR: number;
  reusableForGSB: boolean;
  notes: string;
}

export type CrusherWastageLog = CrusherWastageRecord;

export interface CrusherPurchase {
  id: string;
  purchaseNumber: string;
  poNumber: string;
  date: string;
  supplierName: string;
  supplierContact: string;
  category: PurchaseCategory;
  itemsDescription: string;
  quantity: number;
  unit: string;
  unitRate: number;
  subtotal: number;
  gstAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentTerms: string;
  paymentStatus: 'PAID' | 'PARTIAL' | 'PENDING' | 'OVERDUE';
  goodsReceived: boolean;
  isReturn: boolean;
  returnReason?: string;
  voucherRef: string;
}

export interface CrusherSale {
  id: string;
  invoiceNumber: string;
  orderNumber: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerGstin?: string;
  siteDestination: string;
  productCode: string;
  productName: string;
  quantityTons: number;
  ratePerTon: number;
  subtotal: number;
  gstAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  vehicleNumber: string;
  driverName: string;
  gatePassNumber: string;
  paymentStatus: 'PAID' | 'PARTIAL' | 'PENDING' | 'CREDIT_15_DAYS' | 'CREDIT_30_DAYS';
  paymentMode: 'Bank RTGS' | 'UPI' | 'Cheque' | 'Cash' | 'Credit Ledger';
  isReturn: boolean;
  creditNoteRef?: string;
}

export interface CrusherGateEntry {
  id: string;
  entryNumber: string;
  type: GateEntryType;
  date: string;
  time: string;
  sourceOrDestination: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  materialOrProduct: string;
  declaredQuantityTons: number;
  weighbridgeGrossTons?: number;
  weighbridgeTareTons?: number;
  netWeightTons?: number;
  supplierOrCustomer: string;
  purpose: 'Raw Material Delivery' | 'Finished Product Dispatch' | 'Spares & Fuel Delivery' | 'Maintenance Crew' | 'Visitor / Inspector';
  gatePassRef?: string;
  challanRef?: string;
  securityOfficerName: string;
  status: GateEntryStatus;
}

export interface CrusherGatePass {
  id: string;
  gatePassNumber: string;
  date: string;
  time: string;
  crusherPlantId: string;
  crusherPlantName: string;
  customerName: string;
  orderRef: string;
  invoiceRef: string;
  productName: string;
  quantityTons: number;
  unit: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  destination: string;
  grossWeightTons: number;
  tareWeightTons: number;
  netWeightTons: number;
  authorizedBy: string;
  securityClearanceTime: string;
  status: 'ISSUED' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED';
  qrVerificationCode: string;
}

export interface CrusherExpense {
  id: string;
  voucherNumber: string;
  date: string;
  plantId: string;
  plantName: string;
  category: ExpenseCategory;
  paidTo: string;
  amount: number;
  paymentMethod: 'Bank Transfer (NEFT/RTGS)' | 'Cheque' | 'Cash Voucher' | 'UPI' | 'Corporate Fuel Card';
  description: string;
  referenceNumber: string;
  attachmentName?: string;
  approvedBy: string;
  taxInvoiceAvailable: boolean;
}

export interface CrusherPartnerSettlement {
  id: string;
  settlementNumber: string;
  settlementDate: string;
  settlementPeriod: string; // e.g. "Aug 2026 - Monthly Crushing Operations"
  partnerId: string;
  partnerName: string;
  plantName: string;
  settlementType: SettlementType;
  ownershipPercent: number;
  profitSharePercent: number; // explicitly different if negotiated
  capitalInvestmentINR: number;
  crusherGrossRevenue: number;
  crusherOperatingExpense: number;
  crusherNetProfit: number;
  entitledShareINR: number;
  deductionsAndAdvancesINR: number;
  netPayableINR: number;
  paidAmountINR: number;
  balanceINR: number;
  paymentMode: string;
  bankReference: string;
  status: 'PAID' | 'APPROVED_PENDING_DISBURSEMENT' | 'DRAFT';
}

export interface CrusherDocument {
  id: string;
  title: string;
  documentNumber: string;
  category:
    | 'Plant Permits & Licenses'
    | 'Pollution Control (PCB/CTO)'
    | 'Machinery Manuals & Calibration'
    | 'Partner Agreement Deeds'
    | 'Supplier Contracts'
    | 'Gate Pass Books'
    | 'Tax Invoices & E-Way Bills'
    | 'Electricity Sanction Deeds';
  crusherPlantName: string;
  linkedEntity: string;
  fileFormat: 'PDF' | 'JPG' | 'PNG' | 'DWG';
  fileSize: string;
  uploadDate: string;
  expiryDate?: string;
  status: 'Valid' | 'Expiring Soon' | 'Expired';
  downloadUrl: string;
}

export interface CrusherReportTemplate {
  id: string;
  name: string;
  category: 'Operations' | 'Commerce' | 'Finance' | 'Management';
  description: string;
  columns: string[];
  previewRows: Record<string, any>[];
}

// -------------------------------------------------------------
// SAMPLE / DEMO DATA (Clearly labeled as Studio Preview)
// -------------------------------------------------------------

export const SAMPLE_CRUSHER_PLANTS: CrusherPlant[] = [
  {
    id: 'CP-01',
    code: 'CP-KL-001',
    name: 'Kasaragod High-Tech Blue Metal & VSI Complex',
    businessName: 'RZ Minetrix Aggregates & Sand LLP',
    location: 'Badiadka Industrial Zone, Kasaragod',
    district: 'Kasaragod',
    state: 'Kerala',
    contactPerson: 'Suresh Bhat (Plant Manager)',
    contactPhone: '+91 94472 88100',
    plantType: '3-Stage Multi-Plant (Jaw + Cone + VSI)',
    capacityTPH: 250,
    capacityUnit: 'TPH (Tons Per Hour)',
    installedDate: '2022-11-15',
    status: 'OPERATIONAL',
    machineCount: 6,
    machineDetails: [
      'Primary Jaw Crusher (42" x 30" Metso/Terex equivalent)',
      'Secondary Hydraulic Cone Crusher (CH440 / 300 HP)',
      'Tertiary Vertical Shaft Impactor (VSI-B9000 Sand Maker)',
      'High-Frequency De-watering Screen for P-Sand',
      '4-Deck Inclined Vibrating Screen (20mm, 12mm, 6mm, Dust)',
      'Automated Radial Stacker Conveyor 32m'
    ],
    mainProducts: ['M-Sand (Concrete)', 'P-Sand (Plastering)', '20mm Aggregate', '12mm Blue Metal', '6mm Grit', 'Rock Dust'],
    connectedPowerKW: 680,
    permitNumber: 'PCB/KSD/CTO/2023/491',
    permitType: 'KSPCB Consent to Operate (Red Category Crushing)',
    permitIssueDate: '2023-01-10',
    permitExpiryDate: '2028-01-09',
    permitStatus: 'VALID',
    todayProductionTons: 1490,
    monthProductionTons: 38400,
    rawMaterialStockTons: 4200,
    finishedProductStockTons: 12650,
    partnerNames: ['Partner F (Ibrahim K.)', 'Partner G (Ramesh Shetty)', 'Partner H (Dr. V. Rao)'],
    partnerCount: 3
  },
  {
    id: 'CP-02',
    code: 'CP-KL-002',
    name: 'Manjeshwar Primary Jaw & Cone Station',
    businessName: 'Coastal Minerals & Granites Co.',
    location: 'Hosabettu Mining Belt, Manjeshwar',
    district: 'Kasaragod',
    state: 'Kerala',
    contactPerson: 'Abdul Salam (Operations Chief)',
    contactPhone: '+91 98451 44520',
    plantType: 'Cone Crusher',
    capacityTPH: 150,
    capacityUnit: 'TPH (Tons Per Hour)',
    installedDate: '2023-05-20',
    status: 'OPERATIONAL',
    machineCount: 4,
    machineDetails: [
      'Primary Jaw Crusher 36" x 24"',
      'Cone Crusher 200 HP Secondary',
      '3-Deck Vibrating Screen (40mm, 20mm, GSB)',
      'Automated Weighbridge 60 MT'
    ],
    mainProducts: ['40mm Railway Ballast', '20mm Aggregate', 'GSB Sub-Base Mix', 'Quarry Dust'],
    connectedPowerKW: 420,
    permitNumber: 'PCB/KSD/CTO/2023/812',
    permitType: 'KSPCB Consent to Operate',
    permitIssueDate: '2023-06-01',
    permitExpiryDate: '2028-05-31',
    permitStatus: 'VALID',
    todayProductionTons: 820,
    monthProductionTons: 21500,
    rawMaterialStockTons: 2800,
    finishedProductStockTons: 6400,
    partnerNames: ['Partner F (Ibrahim K.)', 'Farooq Ahmed'],
    partnerCount: 2
  },
  {
    id: 'CP-03',
    code: 'CP-KA-003',
    name: 'Someshwar Coastal M-Sand Washing Facility',
    businessName: 'RZ Minetrix Coastal Materials Karnataka',
    location: 'Someshwar, Ullal, Mangalore',
    district: 'Dakshina Kannada',
    state: 'Karnataka',
    contactPerson: 'Ganesh Kamath (Superintendent)',
    contactPhone: '+91 98453 99120',
    plantType: 'Sand Washing Plant',
    capacityTPH: 120,
    capacityUnit: 'TPH (Tons Per Hour)',
    installedDate: '2024-02-10',
    status: 'STANDBY',
    machineCount: 3,
    machineDetails: [
      'Dual Hydro-cyclone Sand Washing Unit',
      'High-Speed Dewatering Screen 1.8m x 3.6m',
      'Thickener Slurry Clarifier Tank 12m'
    ],
    mainProducts: ['Washed M-Sand (Zone II)', 'Super-fine P-Sand (Zone IV)'],
    connectedPowerKW: 240,
    permitNumber: 'KSPCB/MNG/CTO/2024/110',
    permitType: 'Karnataka PCB Industrial Consent',
    permitIssueDate: '2024-03-01',
    permitExpiryDate: '2029-02-28',
    permitStatus: 'VALID',
    todayProductionTons: 0,
    monthProductionTons: 6200,
    rawMaterialStockTons: 1100,
    finishedProductStockTons: 3200,
    partnerNames: ['Partner G (Ramesh Shetty)', 'Someshwar Ventures'],
    partnerCount: 2
  }
];

export const SAMPLE_CRUSHER_PARTNERS: CrusherPartner[] = [
  {
    id: 'CPT-01',
    name: 'Partner F — Ibrahim K.',
    phone: '+91 98450 33211',
    email: 'ibrahim.k@rzminetrix.demo',
    address: 'Kasaragod Town, Kerala 671121',
    panNumber: 'AAAPK9912F',
    bankDetails: 'HDFC Bank - A/C 5020008819283 (IFSC: HDFC0001201)',
    effectiveDate: '2022-10-01',
    status: 'ACTIVE',
    totalInvestment: 12000000, // ₹1.2 Cr
    ownershipPercent: 50.0,
    profitSharePercent: 50.0,
    lossSharePercent: 50.0,
    revenueSharePercent: 50.0,
    expenseSharePercent: 50.0,
    capitalContributed: 12000000,
    profitPaidToDate: 4850000,
    currentOutstandingPayable: 420000,
    assignedPlantIds: ['CP-01', 'CP-02'],
    assignedPlantNames: ['Kasaragod High-Tech VSI Complex', 'Manjeshwar Primary Jaw Station'],
    isAlsoQuarryPartner: false, // Independent from quarry!
    isAlsoLandOwner: false,
    isAlsoVehicleOwner: true,
    isAlsoSupplier: false,
    roleTags: ['Crusher Partner Only', 'Fleet Vehicle Owner']
  },
  {
    id: 'CPT-02',
    name: 'Partner G — Ramesh Shetty',
    phone: '+91 98452 44102',
    email: 'ramesh.shetty@coastalcrushers.demo',
    address: 'Mangalore Kadri Hills, Karnataka 575002',
    panNumber: 'ABRPS4419K',
    bankDetails: 'Canara Bank - A/C 0192101004921 (IFSC: CNRB0000192)',
    effectiveDate: '2022-10-01',
    status: 'ACTIVE',
    totalInvestment: 7200000, // ₹72 Lakhs
    ownershipPercent: 30.0,
    profitSharePercent: 30.0,
    lossSharePercent: 30.0,
    revenueSharePercent: 30.0,
    expenseSharePercent: 30.0,
    capitalContributed: 7200000,
    profitPaidToDate: 2910000,
    currentOutstandingPayable: 252000,
    assignedPlantIds: ['CP-01', 'CP-03'],
    assignedPlantNames: ['Kasaragod High-Tech VSI Complex', 'Someshwar Coastal M-Sand Facility'],
    isAlsoQuarryPartner: true, // Example of a person who is BOTH
    isAlsoLandOwner: false,
    isAlsoVehicleOwner: false,
    isAlsoSupplier: true,
    roleTags: ['Crusher Partner', 'Quarry Partner', 'Commercial Supplier']
  },
  {
    id: 'CPT-03',
    name: 'Partner H — Dr. V. Rao',
    phone: '+91 94481 99031',
    email: 'dr.vrao@capitalinvest.demo',
    address: 'Kochi Marine Drive, Kerala 682031',
    panNumber: 'AALPV1092M',
    bankDetails: 'State Bank of India - A/C 3881920019 (IFSC: SBIN0008412)',
    effectiveDate: '2023-01-15',
    status: 'ACTIVE',
    totalInvestment: 4800000, // ₹48 Lakhs
    ownershipPercent: 20.0,
    profitSharePercent: 20.0,
    lossSharePercent: 20.0,
    revenueSharePercent: 20.0,
    expenseSharePercent: 20.0,
    capitalContributed: 4800000,
    profitPaidToDate: 1940000,
    currentOutstandingPayable: 168000,
    assignedPlantIds: ['CP-01'],
    assignedPlantNames: ['Kasaragod High-Tech VSI Complex'],
    isAlsoQuarryPartner: false,
    isAlsoLandOwner: false,
    isAlsoVehicleOwner: false,
    isAlsoSupplier: false,
    roleTags: ['Crusher Partner Only', 'Passive Equity Investor']
  }
];

export const SAMPLE_INVESTMENTS: CrusherInvestment[] = [
  {
    id: 'INV-01',
    investmentNumber: 'CR-INV-2022-001',
    partnerId: 'CPT-01',
    partnerName: 'Partner F — Ibrahim K.',
    plantId: 'CP-01',
    plantName: 'Kasaragod High-Tech Blue Metal & VSI Complex',
    type: 'Initial Equity Capital',
    amount: 10000000,
    date: '2022-10-15',
    referenceNumber: 'RTGS-HDFC-99120',
    ownershipPercentImpact: 50.0,
    capitalAccountBalanceAfter: 10000000,
    notes: 'Initial plant equity for primary jaw station and civil foundation works.',
    status: 'APPROVED'
  },
  {
    id: 'INV-02',
    investmentNumber: 'CR-INV-2022-002',
    partnerId: 'CPT-02',
    partnerName: 'Partner G — Ramesh Shetty',
    plantId: 'CP-01',
    plantName: 'Kasaragod High-Tech Blue Metal & VSI Complex',
    type: 'Initial Equity Capital',
    amount: 6000000,
    date: '2022-10-18',
    referenceNumber: 'RTGS-CNRB-44101',
    ownershipPercentImpact: 30.0,
    capitalAccountBalanceAfter: 6000000,
    notes: 'Cone crusher machinery procurement fund allocation.',
    status: 'APPROVED'
  },
  {
    id: 'INV-03',
    investmentNumber: 'CR-INV-2023-003',
    partnerId: 'CPT-03',
    partnerName: 'Partner H — Dr. V. Rao',
    plantId: 'CP-01',
    plantName: 'Kasaragod High-Tech Blue Metal & VSI Complex',
    type: 'Equipment Investment (VSI/Cone)',
    amount: 4800000,
    date: '2023-01-20',
    referenceNumber: 'RTGS-SBIN-88912',
    ownershipPercentImpact: 20.0,
    capitalAccountBalanceAfter: 4800000,
    notes: 'Procurement of VSI Sand Maker rotor, high-frequency de-watering screen and 4-deck screen.',
    status: 'APPROVED'
  },
  {
    id: 'INV-04',
    investmentNumber: 'CR-INV-2024-004',
    partnerId: 'CPT-01',
    partnerName: 'Partner F — Ibrahim K.',
    plantId: 'CP-01',
    plantName: 'Kasaragod High-Tech Blue Metal & VSI Complex',
    type: 'Working Capital Loan',
    amount: 2000000,
    date: '2024-04-10',
    referenceNumber: 'NEFT-HDFC-11092',
    ownershipPercentImpact: 0.0,
    capitalAccountBalanceAfter: 12000000,
    notes: 'Short-term working capital for seasonal bulk raw boulder inventory buildup.',
    status: 'APPROVED'
  }
];

export const SAMPLE_CRUSHER_INVESTMENTS = SAMPLE_INVESTMENTS;

export const SAMPLE_RAW_MATERIALS: RawMaterialRecord[] = [
  {
    id: 'RM-01',
    code: 'RM-GR-001',
    materialType: 'Hard Rock Boulder',
    sourceType: 'Own Quarry',
    sourceQuarryId: 'Q-01',
    sourceQuarryName: 'Kasaragod North Pit #01',
    sourceWorkingArea: 'Bench A - North Face',
    supplierName: 'RZ Minetrix Natural Resources (Internal Transfer)',
    quarryLoadRef: 'LOAD-2026-09-001',
    inwardDate: '2026-09-22',
    vehicleNumber: 'KL-14-AC-9901',
    driverName: 'Moideen Kunhi',
    driverPhone: '+91 94471 88123',
    grossWeightTons: 38.5,
    tareWeightTons: 14.2,
    netWeightTons: 24.3,
    ratePerTon: 340,
    totalCost: 8262,
    status: 'IN_STOCKPILE',
    notes: 'Dense blue granite boulders suitable for high-durability M-Sand and 20mm.'
  },
  {
    id: 'RM-02',
    code: 'RM-GR-002',
    materialType: 'Hard Rock Boulder',
    sourceType: 'External Quarry',
    supplierName: 'Malabar Mining & Stone Supplies',
    inwardDate: '2026-09-22',
    vehicleNumber: 'KA-19-B-4412',
    driverName: 'Shankar Gowda',
    driverPhone: '+91 98452 11990',
    grossWeightTons: 42.1,
    tareWeightTons: 15.1,
    netWeightTons: 27.0,
    ratePerTon: 360,
    totalCost: 9720,
    status: 'IN_STOCKPILE',
    notes: 'External purchase due to spike in 20mm commercial slab orders.'
  },
  {
    id: 'RM-03',
    code: 'RM-LT-003',
    materialType: 'Laterite Ballast',
    sourceType: 'Own Quarry',
    sourceQuarryId: 'Q-01',
    sourceQuarryName: 'Kasaragod North Pit #01',
    sourceWorkingArea: 'Bench B - Deep Face',
    supplierName: 'RZ Minetrix Natural Resources (Internal Transfer)',
    quarryLoadRef: 'LOAD-2026-09-003',
    inwardDate: '2026-09-21',
    vehicleNumber: 'KL-14-Y-8812',
    driverName: 'Raveendran P.',
    driverPhone: '+91 94473 00192',
    grossWeightTons: 31.8,
    tareWeightTons: 12.0,
    netWeightTons: 19.8,
    ratePerTon: 280,
    totalCost: 5544,
    status: 'CRUSHED',
    notes: 'Laterite rubble processed for GSB highway sub-base and filling aggregates.'
  }
];

export const SAMPLE_MATERIAL_RECEIPTS: MaterialReceipt[] = [
  {
    id: 'RCPT-01',
    receiptNumber: 'CR-RCPT-2026-09-410',
    date: '2026-09-22',
    time: '08:45 AM',
    crusherPlantId: 'CP-01',
    crusherPlantName: 'Kasaragod High-Tech Blue Metal & VSI Complex',
    sourceQuarryId: 'Q-01',
    sourceQuarryName: 'Kasaragod North Laterite Pit #01',
    sourceWorkingArea: 'Bench A - North Face',
    sourceQuarryLoadId: 'LOAD-2026-09-001',
    supplierName: 'RZ Minetrix Quarry Concession',
    material: 'Hard Rock Boulder',
    quantityTons: 24.3,
    unit: 'Tons',
    vehicleNumber: 'KL-14-AC-9901',
    driverName: 'Moideen Kunhi',
    driverPhone: '+91 94471 88123',
    weighbridgeGrossTons: 38.5,
    weighbridgeTareTons: 14.2,
    weighbridgeNetTons: 24.3,
    moistureDeductionPercent: 0.0,
    payableNetTons: 24.3,
    ratePerTon: 340,
    totalAmount: 8262,
    referenceChallanNo: 'CH-KSD-8810',
    weighbridgeSlipNo: 'WB-CR-10491',
    status: 'Accepted',
    qualityGrade: 'Grade A Hard Granite',
    receivedBy: 'Gopal Naik (Weighbridge Incharge)'
  },
  {
    id: 'RCPT-02',
    receiptNumber: 'CR-RCPT-2026-09-411',
    date: '2026-09-22',
    time: '09:30 AM',
    crusherPlantId: 'CP-01',
    crusherPlantName: 'Kasaragod High-Tech Blue Metal & VSI Complex',
    sourceQuarryName: 'Malabar Mining & Stone Supplies (External)',
    supplierName: 'Malabar Mining & Stone Supplies',
    material: 'Hard Rock Boulder',
    quantityTons: 27.0,
    unit: 'Tons',
    vehicleNumber: 'KA-19-B-4412',
    driverName: 'Shankar Gowda',
    driverPhone: '+91 98452 11990',
    weighbridgeGrossTons: 42.1,
    weighbridgeTareTons: 15.1,
    weighbridgeNetTons: 27.0,
    moistureDeductionPercent: 0.5,
    payableNetTons: 26.86,
    ratePerTon: 360,
    totalAmount: 9670,
    referenceChallanNo: 'CH-EXT-4921',
    weighbridgeSlipNo: 'WB-CR-10492',
    status: 'Weighed',
    qualityGrade: 'Grade A Hard Granite',
    receivedBy: 'Gopal Naik (Weighbridge Incharge)'
  },
  {
    id: 'RCPT-03',
    receiptNumber: 'CR-RCPT-2026-09-412',
    date: '2026-09-22',
    time: '11:15 AM',
    crusherPlantId: 'CP-01',
    crusherPlantName: 'Kasaragod High-Tech Blue Metal & VSI Complex',
    sourceQuarryId: 'Q-01',
    sourceQuarryName: 'Kasaragod North Laterite Pit #01',
    sourceWorkingArea: 'Bench B - Deep Face',
    sourceQuarryLoadId: 'LOAD-2026-09-004',
    supplierName: 'RZ Minetrix Quarry Concession',
    material: 'Laterite Ballast',
    quantityTons: 22.4,
    unit: 'Tons',
    vehicleNumber: 'KL-14-Z-2210',
    driverName: 'Santhosh Kumar',
    driverPhone: '+91 94474 11900',
    weighbridgeGrossTons: 36.8,
    weighbridgeTareTons: 14.4,
    weighbridgeNetTons: 22.4,
    moistureDeductionPercent: 1.0,
    payableNetTons: 22.18,
    ratePerTon: 280,
    totalAmount: 6210,
    referenceChallanNo: 'CH-KSD-8814',
    weighbridgeSlipNo: 'WB-CR-10493',
    status: 'Accepted',
    qualityGrade: 'Laterite Spalls',
    receivedBy: 'Gopal Naik (Weighbridge Incharge)'
  }
];

export const SAMPLE_CRUSHER_PRODUCTS: CrusherProduct[] = [
  {
    id: 'PRD-01',
    code: 'MSAND-CONC',
    name: 'M-Sand (Manufactured Sand - Concrete Grade)',
    category: 'Manufactured Sand',
    unit: 'Tons',
    hsnCode: '2505',
    gstRate: 5.0,
    productionCostPerTon: 480,
    defaultSalesRatePerTon: 750,
    minSalesRatePerTon: 700,
    maxSalesRatePerTon: 850,
    stockTracking: true,
    currentStockTons: 4800,
    stockSiloName: 'Silo 1 & Radial Bay A',
    status: 'ACTIVE',
    specifications: 'IS 383 Zone II compliant, cubical particle shape via VSI tertiary crushing, silt content < 3.0%'
  },
  {
    id: 'PRD-02',
    code: 'PSAND-PLAST',
    name: 'P-Sand (Plastering Sand - Fine Grade)',
    category: 'Manufactured Sand',
    unit: 'Tons',
    hsnCode: '2505',
    gstRate: 5.0,
    productionCostPerTon: 530,
    defaultSalesRatePerTon: 820,
    minSalesRatePerTon: 780,
    maxSalesRatePerTon: 920,
    stockTracking: true,
    currentStockTons: 2400,
    stockSiloName: 'Silo 2 (Air Classifier Bay)',
    status: 'ACTIVE',
    specifications: 'IS 1542 Zone IV plastering aggregate, washed, zero oversized grains > 2.36mm, smooth finish'
  },
  {
    id: 'PRD-03',
    code: 'AGG-20MM',
    name: '20mm Graded Blue Metal Aggregate',
    category: 'Coarse Aggregate',
    unit: 'Tons',
    hsnCode: '2517',
    gstRate: 5.0,
    productionCostPerTon: 390,
    defaultSalesRatePerTon: 680,
    minSalesRatePerTon: 640,
    maxSalesRatePerTon: 750,
    stockTracking: true,
    currentStockTons: 3100,
    stockSiloName: 'Ground Stockpile Hopper 1',
    status: 'ACTIVE',
    specifications: 'IS 383 single-size & graded blue granite for structural slab RCC casting, flakiness index < 15%'
  },
  {
    id: 'PRD-04',
    code: 'AGG-12MM',
    name: '12mm Down Blue Metal Aggregate',
    category: 'Coarse Aggregate',
    unit: 'Tons',
    hsnCode: '2517',
    gstRate: 5.0,
    productionCostPerTon: 410,
    defaultSalesRatePerTon: 700,
    minSalesRatePerTon: 660,
    maxSalesRatePerTon: 760,
    stockTracking: true,
    currentStockTons: 1150,
    stockSiloName: 'Ground Stockpile Hopper 2',
    status: 'ACTIVE',
    specifications: 'Secondary concrete mixes, pre-cast pavers, hollow brick casting, high compressive resistance'
  },
  {
    id: 'PRD-05',
    code: 'AGG-6MM',
    name: '6mm Blue Metal Grit / Pea Gravel',
    category: 'Fine Aggregate',
    unit: 'Tons',
    hsnCode: '2517',
    gstRate: 5.0,
    productionCostPerTon: 370,
    defaultSalesRatePerTon: 620,
    minSalesRatePerTon: 580,
    maxSalesRatePerTon: 680,
    stockTracking: true,
    currentStockTons: 800,
    stockSiloName: 'Bunker 3',
    status: 'ACTIVE',
    specifications: 'Interlocking tiles, asphalt bitumen wear courses, floor screed leveling'
  },
  {
    id: 'PRD-06',
    code: 'DUST-01',
    name: 'Quarry Rock Dust / Filler',
    category: 'Mineral Powder',
    unit: 'Tons',
    hsnCode: '2517',
    gstRate: 5.0,
    productionCostPerTon: 220,
    defaultSalesRatePerTon: 380,
    minSalesRatePerTon: 340,
    maxSalesRatePerTon: 420,
    stockTracking: true,
    currentStockTons: 400,
    stockSiloName: 'Dust Cyclone Bin',
    status: 'ACTIVE',
    specifications: 'Concrete hollow blocks, brick setting, road formation embankment backfill'
  }
];

export const SAMPLE_PRODUCTIONS: CrusherProduction[] = [
  {
    id: 'PROD-01',
    productionNumber: 'PRD-2026-09-101',
    date: '2026-09-22',
    shift: 'Shift 1 (Day 07:00 - 15:30)',
    plantId: 'CP-01',
    plantName: 'Kasaragod High-Tech Blue Metal & VSI Complex',
    rawMaterialType: 'Hard Rock Boulder',
    inputQuantityTons: 850,
    outputs: [
      { productCode: 'AGG-20MM', productName: '20mm Aggregate', quantityTons: 425, percentageOfOutput: 50.0, siloAllocation: 'Hopper 1' },
      { productCode: 'AGG-12MM', productName: '12mm Blue Metal', quantityTons: 212.5, percentageOfOutput: 25.0, siloAllocation: 'Hopper 2' },
      { productCode: 'AGG-6MM', productName: '6mm Grit', quantityTons: 127.5, percentageOfOutput: 15.0, siloAllocation: 'Bunker 3' },
      { productCode: 'DUST-01', productName: 'Quarry Rock Dust', quantityTons: 68, percentageOfOutput: 8.0, siloAllocation: 'Cyclone Bin' }
    ],
    totalOutputTons: 833,
    wastageTons: 17,
    wastagePercent: 2.0,
    operatorName: 'Sunil Kumar (Chief Operator)',
    primaryCrusherUnit: 'Jaw + Cone + VSI Stream 1',
    workingHours: 7.5,
    powerUnitsConsumedKWh: 3420,
    dieselConsumedLiters: 110,
    crushingEfficiencyTPH: 113.3,
    notes: 'Smooth crushing batch with sharp particle sizing and zero screen jamming.',
    status: 'VERIFIED'
  },
  {
    id: 'PROD-02',
    productionNumber: 'PRD-2026-09-102',
    date: '2026-09-21',
    shift: 'Shift 2 (Evening 15:30 - 23:00)',
    plantId: 'CP-01',
    plantName: 'Kasaragod High-Tech Blue Metal & VSI Complex',
    rawMaterialType: 'Hard Rock Boulder',
    inputQuantityTons: 640,
    outputs: [
      { productCode: 'MSAND-CONC', productName: 'M-Sand (Concrete Grade)', quantityTons: 384, percentageOfOutput: 60.0, siloAllocation: 'Silo 1' },
      { productCode: 'PSAND-PLAST', productName: 'P-Sand (Plastering)', quantityTons: 160, percentageOfOutput: 25.0, siloAllocation: 'Silo 2' },
      { productCode: 'DUST-01', productName: 'Quarry Rock Dust', quantityTons: 83.2, percentageOfOutput: 13.0, siloAllocation: 'Cyclone Bin' }
    ],
    totalOutputTons: 627.2,
    wastageTons: 12.8,
    wastagePercent: 2.0,
    operatorName: 'Ramesh Balan',
    primaryCrusherUnit: 'VSI Sand Making Station B',
    workingHours: 7.0,
    powerUnitsConsumedKWh: 3100,
    dieselConsumedLiters: 95,
    crushingEfficiencyTPH: 91.4,
    notes: 'Sand rotor speed calibrated at 1,450 RPM. Silt washing within IS 383 specs.',
    status: 'VERIFIED'
  }
];

export const SAMPLE_STOCK_ITEMS: CrusherStockItem[] = [
  {
    id: 'STK-01',
    productId: 'PRD-01',
    productCode: 'MSAND-CONC',
    productName: 'M-Sand (Concrete Grade)',
    unit: 'Tons',
    siloOrBayLocation: 'Silo 1 & Radial Bay A',
    openingStockTons: 4500,
    producedTons: 680,
    purchasedTons: 0,
    soldTons: 380,
    transferredTons: 0,
    wastageTons: 0,
    closingStockTons: 4800,
    reservedStockTons: 650,
    availableStockTons: 4150,
    stockValueINR: 3600000,
    healthStatus: 'Healthy',
    reorderLevelTons: 1000,
    lastUpdated: '2026-09-22 11:30'
  },
  {
    id: 'STK-02',
    productId: 'PRD-02',
    productCode: 'PSAND-PLAST',
    productName: 'P-Sand (Plastering Grade)',
    unit: 'Tons',
    siloOrBayLocation: 'Silo 2 (Air Classifier Bay)',
    openingStockTons: 2280,
    producedTons: 320,
    purchasedTons: 0,
    soldTons: 200,
    transferredTons: 0,
    wastageTons: 0,
    closingStockTons: 2400,
    reservedStockTons: 280,
    availableStockTons: 2120,
    stockValueINR: 1968000,
    healthStatus: 'Healthy',
    reorderLevelTons: 600,
    lastUpdated: '2026-09-22 11:30'
  },
  {
    id: 'STK-03',
    productId: 'PRD-03',
    productCode: 'AGG-20MM',
    productName: '20mm Graded Blue Metal',
    unit: 'Tons',
    siloOrBayLocation: 'Ground Stockpile Hopper 1',
    openingStockTons: 2950,
    producedTons: 510,
    purchasedTons: 0,
    soldTons: 360,
    transferredTons: 0,
    wastageTons: 0,
    closingStockTons: 3100,
    reservedStockTons: 420,
    availableStockTons: 2680,
    stockValueINR: 2108000,
    healthStatus: 'Healthy',
    reorderLevelTons: 800,
    lastUpdated: '2026-09-22 11:30'
  },
  {
    id: 'STK-04',
    productId: 'PRD-04',
    productCode: 'AGG-12MM',
    productName: '12mm Down Blue Metal',
    unit: 'Tons',
    siloOrBayLocation: 'Ground Stockpile Hopper 2',
    openingStockTons: 1020,
    producedTons: 240,
    purchasedTons: 0,
    soldTons: 110,
    transferredTons: 0,
    wastageTons: 0,
    closingStockTons: 1150,
    reservedStockTons: 200,
    availableStockTons: 950,
    stockValueINR: 805000,
    healthStatus: 'Healthy',
    reorderLevelTons: 400,
    lastUpdated: '2026-09-22 11:30'
  },
  {
    id: 'STK-05',
    productId: 'PRD-05',
    productCode: 'AGG-6MM',
    productName: '6mm Blue Metal Grit',
    unit: 'Tons',
    siloOrBayLocation: 'Bunker 3',
    openingStockTons: 710,
    producedTons: 140,
    purchasedTons: 0,
    soldTons: 50,
    transferredTons: 0,
    wastageTons: 0,
    closingStockTons: 800,
    reservedStockTons: 100,
    availableStockTons: 700,
    stockValueINR: 496000,
    healthStatus: 'Low',
    reorderLevelTons: 500,
    lastUpdated: '2026-09-22 11:30'
  },
  {
    id: 'STK-06',
    productId: 'PRD-06',
    productCode: 'DUST-01',
    productName: 'Quarry Rock Dust',
    unit: 'Tons',
    siloOrBayLocation: 'Dust Cyclone Bin',
    openingStockTons: 380,
    producedTons: 90,
    purchasedTons: 0,
    soldTons: 70,
    transferredTons: 0,
    wastageTons: 0,
    closingStockTons: 400,
    reservedStockTons: 50,
    availableStockTons: 350,
    stockValueINR: 152000,
    healthStatus: 'Healthy',
    reorderLevelTons: 200,
    lastUpdated: '2026-09-22 11:30'
  }
];

export const SAMPLE_WASTAGE_RECORDS: CrusherWastageRecord[] = [
  {
    id: 'WST-01',
    wastageNumber: 'CR-WST-2026-09-01',
    date: '2026-09-22',
    plantId: 'CP-01',
    plantName: 'Kasaragod High-Tech Blue Metal & VSI Complex',
    productionRef: 'PRD-2026-09-101',
    rawMaterial: 'Hard Rock Boulder',
    productImpacted: 'Coarse Aggregates Mix',
    quantityTons: 17.0,
    unit: 'Tons',
    reason: 'Screen Blinding & Oversize',
    machineSource: 'Secondary Vibrating Screen Top Deck',
    operatorName: 'Sunil Kumar',
    approvedBy: 'Suresh Bhat (Plant Manager)',
    financialImpactINR: 5780,
    reusableForGSB: true,
    notes: 'Damp fines blinded screen cloth during early morning mist; oversize diverted to GSB sub-base bay.'
  },
  {
    id: 'WST-02',
    wastageNumber: 'CR-WST-2026-09-02',
    date: '2026-09-21',
    plantId: 'CP-01',
    plantName: 'Kasaragod High-Tech Blue Metal & VSI Complex',
    productionRef: 'PRD-2026-09-102',
    rawMaterial: 'Hard Rock Boulder',
    productImpacted: 'Manufactured Sand',
    quantityTons: 12.8,
    unit: 'Tons',
    reason: 'Sludge / Washing Clay Loss',
    machineSource: 'Sand Hydrocyclone & Slurry Settling Pit',
    operatorName: 'Ramesh Balan',
    approvedBy: 'Suresh Bhat (Plant Manager)',
    financialImpactINR: 6144,
    reusableForGSB: false,
    notes: 'Micro-fines < 75 microns washed into settling pond in compliance with IS 383 silt limits.'
  }
];

export const SAMPLE_PURCHASES: CrusherPurchase[] = [
  {
    id: 'PUR-01',
    purchaseNumber: 'CR-PUR-2026-09-01',
    poNumber: 'PO-CR-2026-88',
    date: '2026-09-20',
    supplierName: 'Apex Heavy Engineering & Castings',
    supplierContact: '+91 98450 11990',
    category: 'Spare Parts & Jaw Plates',
    itemsDescription: 'Manganese Jaw Plates 42" x 30" (Set of 2 Fixed + 2 Movable)',
    quantity: 1,
    unit: 'Set',
    unitRate: 185000,
    subtotal: 185000,
    gstAmount: 33300,
    totalAmount: 218300,
    paidAmount: 218300,
    balanceAmount: 0,
    paymentTerms: 'Immediate Bank Transfer',
    paymentStatus: 'PAID',
    goodsReceived: true,
    isReturn: false,
    voucherRef: 'VOUCH-PUR-881'
  },
  {
    id: 'PUR-02',
    purchaseNumber: 'CR-PUR-2026-09-02',
    poNumber: 'PO-CR-2026-89',
    date: '2026-09-21',
    supplierName: 'Bharat Petroleum Retail Outlet Badiadka',
    supplierContact: '+91 94471 22891',
    category: 'Fuel / HSD Diesel',
    itemsDescription: 'High-Speed Diesel (HSD) for Front End Loader & Backup Genset',
    quantity: 2500,
    unit: 'Liters',
    unitRate: 94.5,
    subtotal: 236250,
    gstAmount: 0,
    totalAmount: 236250,
    paidAmount: 236250,
    balanceAmount: 0,
    paymentTerms: 'Commercial Credit 7 Days',
    paymentStatus: 'PAID',
    goodsReceived: true,
    isReturn: false,
    voucherRef: 'VOUCH-PUR-882'
  },
  {
    id: 'PUR-03',
    purchaseNumber: 'CR-PUR-2026-09-03',
    poNumber: 'PO-CR-2026-90',
    date: '2026-09-22',
    supplierName: 'Malabar Mining & Stone Supplies',
    supplierContact: '+91 98452 11990',
    category: 'Raw Material (Boulders)',
    itemsDescription: 'Granite Boulders Intake (Ticket #4921 & #4922)',
    quantity: 54,
    unit: 'Tons',
    unitRate: 360,
    subtotal: 19440,
    gstAmount: 972,
    totalAmount: 20412,
    paidAmount: 0,
    balanceAmount: 20412,
    paymentTerms: 'Weekly Payment Cycle',
    paymentStatus: 'PENDING',
    goodsReceived: true,
    isReturn: false,
    voucherRef: 'VOUCH-PUR-883'
  }
];

export const SAMPLE_SALES: CrusherSale[] = [
  {
    id: 'SALE-01',
    invoiceNumber: 'INV-CR-2026-09-881',
    orderNumber: 'CR-ORD-881',
    date: '2026-09-22',
    customerName: 'Kochi Metro Rail JV & Infra Ltd',
    customerPhone: '+91 98451 00293',
    customerGstin: '32AAACK1920B1Z4',
    siteDestination: 'Kochi Metro Elevated Viaduct Station Pier 14',
    productCode: 'MSAND-CONC',
    productName: 'M-Sand (Concrete Grade)',
    quantityTons: 650,
    ratePerTon: 750,
    subtotal: 487500,
    gstAmount: 24375,
    totalAmount: 511875,
    paidAmount: 511875,
    balanceAmount: 0,
    vehicleNumber: 'KL-14-AC-9901 (Batch of 22 Tippers)',
    driverName: 'Moideen & Fleet Drivers',
    gatePassNumber: 'GP-CR-2026-09-4100',
    paymentStatus: 'PAID',
    paymentMode: 'Bank RTGS',
    isReturn: false
  },
  {
    id: 'SALE-02',
    invoiceNumber: 'INV-CR-2026-09-882',
    orderNumber: 'CR-ORD-882',
    date: '2026-09-22',
    customerName: 'Sobha City Horizon Projects',
    customerPhone: '+91 98452 44109',
    customerGstin: '32AABCS8891P1ZX',
    siteDestination: 'Sobha Horizon Tower B RCC Casting Yard',
    productCode: 'AGG-20MM',
    productName: '20mm Graded Blue Metal',
    quantityTons: 420,
    ratePerTon: 680,
    subtotal: 285600,
    gstAmount: 14280,
    totalAmount: 299880,
    paidAmount: 200000,
    balanceAmount: 99880,
    vehicleNumber: 'KA-19-B-4412 & Tippers',
    driverName: 'Shankar Gowda & Crew',
    gatePassNumber: 'GP-CR-2026-09-4101',
    paymentStatus: 'PARTIAL',
    paymentMode: 'Bank RTGS',
    isReturn: false
  },
  {
    id: 'SALE-03',
    invoiceNumber: 'INV-CR-2026-09-883',
    orderNumber: 'CR-ORD-883',
    date: '2026-09-22',
    customerName: 'Malabar Precast Slab Plant',
    customerPhone: '+91 94473 11802',
    customerGstin: '32AABCM4410L1Z9',
    siteDestination: 'Industrial Area Phase 2 Precast Yard',
    productCode: 'PSAND-PLAST',
    productName: 'P-Sand (Plastering Grade)',
    quantityTons: 280,
    ratePerTon: 820,
    subtotal: 229600,
    gstAmount: 11480,
    totalAmount: 241080,
    paidAmount: 241080,
    balanceAmount: 0,
    vehicleNumber: 'KL-14-Y-8812 & Team',
    driverName: 'Raveendran P.',
    gatePassNumber: 'GP-CR-2026-09-4102',
    paymentStatus: 'PAID',
    paymentMode: 'Cheque',
    isReturn: false
  }
];

export const SAMPLE_GATE_ENTRIES: CrusherGateEntry[] = [
  {
    id: 'GE-01',
    entryNumber: 'GE-IN-2026-09-101',
    type: 'INCOMING',
    date: '2026-09-22',
    time: '08:15 AM',
    sourceOrDestination: 'Kasaragod North Pit #01',
    vehicleNumber: 'KL-14-AC-9901',
    driverName: 'Moideen Kunhi',
    driverPhone: '+91 94471 88123',
    materialOrProduct: 'Hard Rock Boulder',
    declaredQuantityTons: 24.3,
    weighbridgeGrossTons: 38.5,
    weighbridgeTareTons: 14.2,
    netWeightTons: 24.3,
    supplierOrCustomer: 'RZ Minetrix Quarry Concession',
    purpose: 'Raw Material Delivery',
    challanRef: 'CH-KSD-8810',
    securityOfficerName: 'Ramesh Naik',
    status: 'Completed'
  },
  {
    id: 'GE-02',
    entryNumber: 'GE-OUT-2026-09-201',
    type: 'OUTGOING',
    date: '2026-09-22',
    time: '09:40 AM',
    sourceOrDestination: 'Kochi Metro Elevated Viaduct Station Pier 14',
    vehicleNumber: 'KL-14-AC-9901',
    driverName: 'Moideen Kunhi',
    driverPhone: '+91 94471 88123',
    materialOrProduct: 'M-Sand (Concrete Grade)',
    declaredQuantityTons: 25.0,
    weighbridgeGrossTons: 39.2,
    weighbridgeTareTons: 14.2,
    netWeightTons: 25.0,
    supplierOrCustomer: 'Kochi Metro Rail JV',
    purpose: 'Finished Product Dispatch',
    gatePassRef: 'GP-CR-2026-09-4100',
    securityOfficerName: 'Ramesh Naik',
    status: 'Exited'
  },
  {
    id: 'GE-03',
    entryNumber: 'GE-IN-2026-09-102',
    type: 'INCOMING',
    date: '2026-09-22',
    time: '10:05 AM',
    sourceOrDestination: 'Bharat Petroleum Dealer Badiadka',
    vehicleNumber: 'KL-14-T-1192',
    driverName: 'Karunakaran N.',
    driverPhone: '+91 94472 00192',
    materialOrProduct: 'HSD Diesel Tanker',
    declaredQuantityTons: 2.5,
    supplierOrCustomer: 'BPCL Retail Outlet',
    purpose: 'Spares & Fuel Delivery',
    challanRef: 'BPCL-INV-4921',
    securityOfficerName: 'Ramesh Naik',
    status: 'Processing'
  }
];

export const SAMPLE_GATE_PASSES: CrusherGatePass[] = [
  {
    id: 'GP-01',
    gatePassNumber: 'GP-CR-2026-09-4100',
    date: '2026-09-22',
    time: '09:35 AM',
    crusherPlantId: 'CP-01',
    crusherPlantName: 'Kasaragod High-Tech Blue Metal & VSI Complex',
    customerName: 'Kochi Metro Rail JV & Infra Ltd',
    orderRef: 'CR-ORD-881',
    invoiceRef: 'INV-CR-2026-09-881',
    productName: 'M-Sand (Manufactured Sand - Concrete Grade)',
    quantityTons: 25.0,
    unit: 'Tons',
    vehicleNumber: 'KL-14-AC-9901',
    driverName: 'Moideen Kunhi',
    driverPhone: '+91 94471 88123',
    destination: 'Kochi Metro Elevated Viaduct Station Pier 14',
    grossWeightTons: 39.2,
    tareWeightTons: 14.2,
    netWeightTons: 25.0,
    authorizedBy: 'Suresh Bhat (Plant Manager)',
    securityClearanceTime: '09:40 AM',
    status: 'DISPATCHED',
    qrVerificationCode: 'CR-PASS-2026-KSD-9901-4100'
  },
  {
    id: 'GP-02',
    gatePassNumber: 'GP-CR-2026-09-4101',
    date: '2026-09-22',
    time: '10:20 AM',
    crusherPlantId: 'CP-01',
    crusherPlantName: 'Kasaragod High-Tech Blue Metal & VSI Complex',
    customerName: 'Sobha City Horizon Projects',
    orderRef: 'CR-ORD-882',
    invoiceRef: 'INV-CR-2026-09-882',
    productName: '20mm Graded Blue Metal Aggregate',
    quantityTons: 28.0,
    unit: 'Tons',
    vehicleNumber: 'KA-19-B-4412',
    driverName: 'Shankar Gowda',
    driverPhone: '+91 98452 11990',
    destination: 'Sobha Horizon Tower B RCC Casting Yard',
    grossWeightTons: 43.1,
    tareWeightTons: 15.1,
    netWeightTons: 28.0,
    authorizedBy: 'Suresh Bhat (Plant Manager)',
    securityClearanceTime: '10:25 AM',
    status: 'DISPATCHED',
    qrVerificationCode: 'CR-PASS-2026-KSD-4412-4101'
  }
];

export const SAMPLE_EXPENSES: CrusherExpense[] = [
  {
    id: 'EXP-01',
    voucherNumber: 'EXP-CR-2026-09-01',
    date: '2026-09-22',
    plantId: 'CP-01',
    plantName: 'Kasaragod High-Tech Blue Metal & VSI Complex',
    category: 'Electricity & KSEB Power',
    paidTo: 'Kerala State Electricity Board (KSEB Special HT Tariff)',
    amount: 384000,
    paymentMethod: 'Bank Transfer (NEFT/RTGS)',
    description: 'Monthly high-tension electrical power bill for 680 KW connected plant motor load',
    referenceNumber: 'KSEB-HT-2026-09-412',
    approvedBy: 'Suresh Bhat (Plant Manager)',
    taxInvoiceAvailable: true
  },
  {
    id: 'EXP-02',
    voucherNumber: 'EXP-CR-2026-09-02',
    date: '2026-09-22',
    plantId: 'CP-01',
    plantName: 'Kasaragod High-Tech Blue Metal & VSI Complex',
    category: 'Labour & Plant Wages',
    paidTo: 'Crusher Operational Crew & Weighbridge Staff (18 personnel)',
    amount: 142000,
    paymentMethod: 'Bank Transfer (NEFT/RTGS)',
    description: 'Fortnightly plant wages for operators, mechanical maintenance team, and loaders',
    referenceNumber: 'WAGE-CR-2026-FN2',
    approvedBy: 'Partner F — Ibrahim K.',
    taxInvoiceAvailable: false
  },
  {
    id: 'EXP-03',
    voucherNumber: 'EXP-CR-2026-09-03',
    date: '2026-09-21',
    plantId: 'CP-01',
    plantName: 'Kasaragod High-Tech Blue Metal & VSI Complex',
    category: 'Fuel / Diesel (Genset & Loaders)',
    paidTo: 'Bharat Petroleum Dealer Badiadka',
    amount: 236250,
    paymentMethod: 'Corporate Fuel Card',
    description: '2,500 Litres HSD for Volvo Front End Wheel Loader and 500 kVA backup DG set',
    referenceNumber: 'BPCL-INV-88910',
    approvedBy: 'Suresh Bhat (Plant Manager)',
    taxInvoiceAvailable: true
  },
  {
    id: 'EXP-04',
    voucherNumber: 'EXP-CR-2026-09-04',
    date: '2026-09-20',
    plantId: 'CP-01',
    plantName: 'Kasaragod High-Tech Blue Metal & VSI Complex',
    category: 'Maintenance & Overhauls',
    paidTo: 'Southern Hydraulic & Pneumatic Engineering',
    amount: 45000,
    paymentMethod: 'Cheque',
    description: 'Cone crusher hydraulic oil replacement and pressure relief valve calibration',
    referenceNumber: 'CHQ-HDFC-99120',
    approvedBy: 'Suresh Bhat (Plant Manager)',
    taxInvoiceAvailable: true
  }
];

export const SAMPLE_PARTNER_SETTLEMENTS: CrusherPartnerSettlement[] = [
  {
    id: 'SET-01',
    settlementNumber: 'CR-SET-2026-08-01',
    settlementDate: '2026-09-05',
    settlementPeriod: 'August 2026 - Monthly Crushing Operations',
    partnerId: 'CPT-01',
    partnerName: 'Partner F — Ibrahim K.',
    plantName: 'Kasaragod High-Tech Blue Metal & VSI Complex',
    settlementType: 'Profit Settlement',
    ownershipPercent: 50.0,
    profitSharePercent: 50.0,
    capitalInvestmentINR: 12000000,
    crusherGrossRevenue: 7850000,
    crusherOperatingExpense: 4850000,
    crusherNetProfit: 3000000,
    entitledShareINR: 1500000,
    deductionsAndAdvancesINR: 200000,
    netPayableINR: 1300000,
    paidAmountINR: 1300000,
    balanceINR: 0,
    paymentMode: 'RTGS Bank Transfer',
    bankReference: 'RTGS-HDFC-882190',
    status: 'PAID'
  },
  {
    id: 'SET-02',
    settlementNumber: 'CR-SET-2026-08-02',
    settlementDate: '2026-09-05',
    settlementPeriod: 'August 2026 - Monthly Crushing Operations',
    partnerId: 'CPT-02',
    partnerName: 'Partner G — Ramesh Shetty',
    plantName: 'Kasaragod High-Tech Blue Metal & VSI Complex',
    settlementType: 'Profit Settlement',
    ownershipPercent: 30.0,
    profitSharePercent: 30.0,
    capitalInvestmentINR: 7200000,
    crusherGrossRevenue: 7850000,
    crusherOperatingExpense: 4850000,
    crusherNetProfit: 3000000,
    entitledShareINR: 900000,
    deductionsAndAdvancesINR: 100000,
    netPayableINR: 800000,
    paidAmountINR: 800000,
    balanceINR: 0,
    paymentMode: 'NEFT Bank Transfer',
    bankReference: 'NEFT-CNRB-44129',
    status: 'PAID'
  },
  {
    id: 'SET-03',
    settlementNumber: 'CR-SET-2026-08-03',
    settlementDate: '2026-09-05',
    settlementPeriod: 'August 2026 - Monthly Crushing Operations',
    partnerId: 'CPT-03',
    partnerName: 'Partner H — Dr. V. Rao',
    plantName: 'Kasaragod High-Tech Blue Metal & VSI Complex',
    settlementType: 'Profit Settlement',
    ownershipPercent: 20.0,
    profitSharePercent: 20.0,
    capitalInvestmentINR: 4800000,
    crusherGrossRevenue: 7850000,
    crusherOperatingExpense: 4850000,
    crusherNetProfit: 3000000,
    entitledShareINR: 600000,
    deductionsAndAdvancesINR: 0,
    netPayableINR: 600000,
    paidAmountINR: 600000,
    balanceINR: 0,
    paymentMode: 'RTGS Bank Transfer',
    bankReference: 'RTGS-SBIN-11928',
    status: 'PAID'
  },
  {
    id: 'SET-04',
    settlementNumber: 'CR-SET-2026-09-01-DRAFT',
    settlementDate: '2026-09-22',
    settlementPeriod: 'September 2026 - Interim Distribution',
    partnerId: 'CPT-01',
    partnerName: 'Partner F — Ibrahim K.',
    plantName: 'Kasaragod High-Tech Blue Metal & VSI Complex',
    settlementType: 'Profit Settlement',
    ownershipPercent: 50.0,
    profitSharePercent: 50.0,
    capitalInvestmentINR: 12000000,
    crusherGrossRevenue: 8240000,
    crusherOperatingExpense: 5080000,
    crusherNetProfit: 3160000,
    entitledShareINR: 1580000,
    deductionsAndAdvancesINR: 0,
    netPayableINR: 1580000,
    paidAmountINR: 0,
    balanceINR: 1580000,
    paymentMode: 'Pending RTGS Authorization',
    bankReference: 'DRAFT-VOUCH-0941',
    status: 'APPROVED_PENDING_DISBURSEMENT'
  }
];

export const SAMPLE_DOCUMENTS: CrusherDocument[] = [
  {
    id: 'CDOC-01',
    title: 'KSPCB Consent to Operate (CTO) - Red Category Crushing',
    documentNumber: 'PCB/KSD/CTO/2023/491',
    category: 'Pollution Control (PCB/CTO)',
    crusherPlantName: 'Kasaragod High-Tech Blue Metal & VSI Complex',
    linkedEntity: 'Kerala State Pollution Control Board',
    fileFormat: 'PDF',
    fileSize: '4.8 MB',
    uploadDate: '2023-01-15',
    expiryDate: '2028-01-09',
    status: 'Valid',
    downloadUrl: '#'
  },
  {
    id: 'CDOC-02',
    title: 'DMG Minor Mineral Crushing License Registration',
    documentNumber: 'DMG/KSD/CR/2022/104',
    category: 'Plant Permits & Licenses',
    crusherPlantName: 'Kasaragod High-Tech Blue Metal & VSI Complex',
    linkedEntity: 'Dept. of Mining & Geology, Govt. of Kerala',
    fileFormat: 'PDF',
    fileSize: '3.4 MB',
    uploadDate: '2022-11-20',
    expiryDate: '2027-11-19',
    status: 'Valid',
    downloadUrl: '#'
  },
  {
    id: 'CDOC-03',
    title: 'Crusher Partnership Deed (Independent Entity Agreement)',
    documentNumber: 'RZ-CR-PTN-2022-001',
    category: 'Partner Agreement Deeds',
    crusherPlantName: 'Kasaragod High-Tech Blue Metal & VSI Complex',
    linkedEntity: 'Partner F, Partner G, Partner H',
    fileFormat: 'PDF',
    fileSize: '3.1 MB',
    uploadDate: '2022-10-05',
    status: 'Valid',
    downloadUrl: '#'
  },
  {
    id: 'CDOC-04',
    title: 'KSEB High Tension (HT) 680 KW Power Sanction Agreement',
    documentNumber: 'KSEB/HT/KSD/2022/991',
    category: 'Electricity Sanction Deeds',
    crusherPlantName: 'Kasaragod High-Tech Blue Metal & VSI Complex',
    linkedEntity: 'Kerala State Electricity Board',
    fileFormat: 'PDF',
    fileSize: '2.6 MB',
    uploadDate: '2022-10-28',
    status: 'Valid',
    downloadUrl: '#'
  },
  {
    id: 'CDOC-05',
    title: 'Metso/Terex VSI & Cone Operational Manual & Parts Catalog',
    documentNumber: 'MANUAL-VSI-CH440-2022',
    category: 'Machinery Manuals & Calibration',
    crusherPlantName: 'Kasaragod High-Tech Blue Metal & VSI Complex',
    linkedEntity: 'Plant Engineering Team',
    fileFormat: 'PDF',
    fileSize: '12.4 MB',
    uploadDate: '2022-11-15',
    status: 'Valid',
    downloadUrl: '#'
  },
  {
    id: 'CDOC-06',
    title: 'Weighbridge Weights & Measures Calibration Certificate (60 MT)',
    documentNumber: 'W&M/KSD/2026/041',
    category: 'Machinery Manuals & Calibration',
    crusherPlantName: 'Kasaragod High-Tech Blue Metal & VSI Complex',
    linkedEntity: 'Legal Metrology Dept, Kerala',
    fileFormat: 'PDF',
    fileSize: '1.2 MB',
    uploadDate: '2026-03-10',
    expiryDate: '2027-03-09',
    status: 'Valid',
    downloadUrl: '#'
  }
];

export const SAMPLE_REPORTS: CrusherReportTemplate[] = [
  // Operations
  {
    id: 'cr-rep-01',
    name: '1. Production Report',
    category: 'Operations',
    description: 'Detailed daily crushing output across screens, shift hours, plant efficiency, and machine utilization.',
    columns: ['Date', 'Shift', 'Input Boulders (Tons)', '20mm (Tons)', '12mm (Tons)', 'M-Sand (Tons)', 'Dust (Tons)', 'Total Output (Tons)', 'Efficiency %'],
    previewRows: [
      { 'Date': '2026-09-22', 'Shift': 'Shift 1', 'Input Boulders (Tons)': '850', '20mm (Tons)': '425', '12mm (Tons)': '212.5', 'M-Sand (Tons)': '0', 'Dust (Tons)': '68', 'Total Output (Tons)': '833', 'Efficiency %': '98.0%' },
      { 'Date': '2026-09-21', 'Shift': 'Shift 2', 'Input Boulders (Tons)': '640', '20mm (Tons)': '0', '12mm (Tons)': '0', 'M-Sand (Tons)': '384', 'Dust (Tons)': '83.2', 'Total Output (Tons)': '627.2', 'Efficiency %': '98.0%' },
      { 'Date': '2026-09-20', 'Shift': 'Shift 1', 'Input Boulders (Tons)': '900', '20mm (Tons)': '450', '12mm (Tons)': '225', 'M-Sand (Tons)': '0', 'Dust (Tons)': '72', 'Total Output (Tons)': '882', 'Efficiency %': '98.0%' }
    ]
  },
  {
    id: 'cr-rep-02',
    name: '2. Raw Material Intake Report',
    category: 'Operations',
    description: 'Tracks boulder sourcing, distinguishing between internal Own Quarry transfers and external commercial suppliers.',
    columns: ['Receipt No', 'Date', 'Source Quarry / Supplier', 'Material Type', 'Vehicle No', 'Net Weight (Tons)', 'Rate / Ton', 'Total Value'],
    previewRows: [
      { 'Receipt No': 'CR-RCPT-410', 'Date': '2026-09-22', 'Source Quarry / Supplier': 'Kasaragod North Pit #01 (Own)', 'Material Type': 'Hard Rock Boulder', 'Vehicle No': 'KL-14-AC-9901', 'Net Weight (Tons)': '24.3', 'Rate / Ton': '₹340', 'Total Value': '₹8,262' },
      { 'Receipt No': 'CR-RCPT-411', 'Date': '2026-09-22', 'Source Quarry / Supplier': 'Malabar Mining (External)', 'Material Type': 'Hard Rock Boulder', 'Vehicle No': 'KA-19-B-4412', 'Net Weight (Tons)': '26.86', 'Rate / Ton': '₹360', 'Total Value': '₹9,670' },
      { 'Receipt No': 'CR-RCPT-412', 'Date': '2026-09-21', 'Source Quarry / Supplier': 'Kasaragod North Pit #01 (Own)', 'Material Type': 'Laterite Ballast', 'Vehicle No': 'KL-14-Z-2210', 'Net Weight (Tons)': '22.18', 'Rate / Ton': '₹280', 'Total Value': '₹6,210' }
    ]
  },
  {
    id: 'cr-rep-03',
    name: '3. Stock & Silo Balance Report',
    category: 'Operations',
    description: 'Current stock across M-Sand silos, aggregate bins, opening balance, daily production additions, and dispatches.',
    columns: ['Product Name', 'Silo / Bay Location', 'Opening (Tons)', 'Produced (Tons)', 'Sold (Tons)', 'Closing (Tons)', 'Stock Status', 'Valuation (INR)'],
    previewRows: [
      { 'Product Name': 'M-Sand (Concrete Grade)', 'Silo / Bay Location': 'Silo 1 & Radial Bay A', 'Opening (Tons)': '4,500', 'Produced (Tons)': '680', 'Sold (Tons)': '380', 'Closing (Tons)': '4,800', 'Stock Status': 'Healthy', 'Valuation (INR)': '₹36,00,000' },
      { 'Product Name': 'P-Sand (Plastering Grade)', 'Silo / Bay Location': 'Silo 2 (Air Classifier)', 'Opening (Tons)': '2,280', 'Produced (Tons)': '320', 'Sold (Tons)': '200', 'Closing (Tons)': '2,400', 'Stock Status': 'Healthy', 'Valuation (INR)': '₹19,68,000' },
      { 'Product Name': '20mm Graded Blue Metal', 'Silo / Bay Location': 'Hopper 1', 'Opening (Tons)': '2,950', 'Produced (Tons)': '510', 'Sold (Tons)': '360', 'Closing (Tons)': '3,100', 'Stock Status': 'Healthy', 'Valuation (INR)': '₹21,08,000' }
    ]
  },
  {
    id: 'cr-rep-04',
    name: '4. Wastage & Sludge Analysis Report',
    category: 'Operations',
    description: 'Screen blinding, moisture evaporation, and wash-plant slurry losses per machine and crushing batch.',
    columns: ['Date', 'Production Batch', 'Wastage Reason', 'Machine Source', 'Wastage (Tons)', 'Wastage %', 'Financial Cost', 'Reusability'],
    previewRows: [
      { 'Date': '2026-09-22', 'Production Batch': 'PRD-101', 'Wastage Reason': 'Screen Blinding & Oversize', 'Machine Source': 'Secondary Screen', 'Wastage (Tons)': '17.0', 'Wastage %': '2.0%', 'Financial Cost': '₹5,780', 'Reusability': 'Sub-base GSB' },
      { 'Date': '2026-09-21', 'Production Batch': 'PRD-102', 'Wastage Reason': 'Sludge / Washing Clay Loss', 'Machine Source': 'Hydrocyclone Pond', 'Wastage (Tons)': '12.8', 'Wastage %': '2.0%', 'Financial Cost': '₹6,144', 'Reusability': 'Sediment Landfill' }
    ]
  },
  // Commerce
  {
    id: 'cr-rep-05',
    name: '5. Sales & Dispatch Register',
    category: 'Commerce',
    description: 'Commercial sales register detailing customer invoices, vehicle weights, GST collected, and settlement status.',
    columns: ['Invoice No', 'Date', 'Customer Name', 'Product', 'Quantity (Tons)', 'Rate / Ton', 'Subtotal', 'GST (5%)', 'Total Billed', 'Status'],
    previewRows: [
      { 'Invoice No': 'INV-CR-881', 'Date': '2026-09-22', 'Customer Name': 'Kochi Metro Rail JV', 'Product': 'M-Sand (Concrete)', 'Quantity (Tons)': '650', 'Rate / Ton': '₹750', 'Subtotal': '₹4,87,500', 'GST (5%)': '₹24,375', 'Total Billed': '₹5,11,875', 'Status': 'Paid' },
      { 'Invoice No': 'INV-CR-882', 'Date': '2026-09-22', 'Customer Name': 'Sobha City Horizon', 'Product': '20mm Blue Metal', 'Quantity (Tons)': '420', 'Rate / Ton': '₹680', 'Subtotal': '₹2,85,600', 'GST (5%)': '₹14,280', 'Total Billed': '₹2,99,880', 'Status': 'Partial' },
      { 'Invoice No': 'INV-CR-883', 'Date': '2026-09-22', 'Customer Name': 'Malabar Precast', 'Product': 'P-Sand (Plastering)', 'Quantity (Tons)': '280', 'Rate / Ton': '₹820', 'Subtotal': '₹2,29,600', 'GST (5%)': '₹11,480', 'Total Billed': '₹2,41,080', 'Status': 'Paid' }
    ]
  },
  {
    id: 'cr-rep-06',
    name: '6. Customer Ledger & Statement',
    category: 'Commerce',
    description: 'Customer-wise account summary showing lifetime tonnage, billing totals, payments received, and outstanding credit aging.',
    columns: ['Customer Name', 'Lifetime Tonnage', 'Total Billed Value', 'Total Collected', 'Outstanding Balance', 'Credit Terms', 'Risk Rating'],
    previewRows: [
      { 'Customer Name': 'Kochi Metro Rail JV', 'Lifetime Tonnage': '14,200 MT', 'Total Billed Value': '₹1,09,20,000', 'Total Collected': '₹1,09,20,000', 'Outstanding Balance': '₹0', 'Credit Terms': 'RTGS Net 15', 'Risk Rating': 'AAA Prime' },
      { 'Customer Name': 'Sobha City Horizon', 'Lifetime Tonnage': '8,600 MT', 'Total Billed Value': '₹61,40,000', 'Total Collected': '₹51,41,120', 'Outstanding Balance': '₹9,98,880', 'Credit Terms': 'Net 30 Days', 'Risk Rating': 'A Regular' },
      { 'Customer Name': 'Malabar Precast Plant', 'Lifetime Tonnage': '5,400 MT', 'Total Billed Value': '₹44,28,000', 'Total Collected': '₹44,28,000', 'Outstanding Balance': '₹0', 'Credit Terms': 'Immediate Cheque', 'Risk Rating': 'AA High' }
    ]
  },
  // Finance
  {
    id: 'cr-rep-07',
    name: '7. Crusher Expense & Cost Breakdown',
    category: 'Finance',
    description: 'Itemized expenditure by cost centers: electricity, diesel, mechanical maintenance, wages, and permits.',
    columns: ['Voucher No', 'Date', 'Expense Category', 'Payee', 'Amount (INR)', 'Payment Mode', 'Approved By'],
    previewRows: [
      { 'Voucher No': 'EXP-CR-01', 'Date': '2026-09-22', 'Expense Category': 'Electricity & Power', 'Payee': 'KSEB HT Division', 'Amount (INR)': '₹3,84,000', 'Payment Mode': 'RTGS Bank', 'Approved By': 'Suresh Bhat' },
      { 'Voucher No': 'EXP-CR-02', 'Date': '2026-09-22', 'Expense Category': 'Labour Wages', 'Payee': 'Crusher Operational Crew', 'Amount (INR)': '₹1,42,000', 'Payment Mode': 'Bank Transfer', 'Approved By': 'Partner F' },
      { 'Voucher No': 'EXP-CR-03', 'Date': '2026-09-21', 'Expense Category': 'Fuel / Diesel', 'Payee': 'BPCL Badiadka', 'Amount (INR)': '₹2,36,250', 'Payment Mode': 'Fuel Card', 'Approved By': 'Suresh Bhat' }
    ]
  },
  {
    id: 'cr-rep-08',
    name: '8. Partner Profit & Loss Distribution Statement',
    category: 'Finance',
    description: 'Independent plant P&L calculation detailing equity ratio vs negotiated profit percentage and net payouts.',
    columns: ['Partner Name', 'Investment Ratio', 'Profit Share %', 'Gross Pit Revenue', 'Operating Cost', 'Net Pit Profit', 'Entitled Payout', 'Status'],
    previewRows: [
      { 'Partner Name': 'Partner F — Ibrahim K.', 'Investment Ratio': '50.0%', 'Profit Share %': '50.0%', 'Gross Pit Revenue': '₹82,40,000', 'Operating Cost': '₹50,80,000', 'Net Pit Profit': '₹31,60,000', 'Entitled Payout': '₹15,80,000', 'Status': 'Pending Approval' },
      { 'Partner Name': 'Partner G — Ramesh Shetty', 'Investment Ratio': '30.0%', 'Profit Share %': '30.0%', 'Gross Pit Revenue': '₹82,40,000', 'Operating Cost': '₹50,80,000', 'Net Pit Profit': '₹31,60,000', 'Entitled Payout': '₹9,48,000', 'Status': 'Pending Approval' },
      { 'Partner Name': 'Partner H — Dr. V. Rao', 'Investment Ratio': '20.0%', 'Profit Share %': '20.0%', 'Gross Pit Revenue': '₹82,40,000', 'Operating Cost': '₹50,80,000', 'Net Pit Profit': '₹31,60,000', 'Entitled Payout': '₹6,32,000', 'Status': 'Pending Approval' }
    ]
  },
  // Management
  {
    id: 'cr-rep-09',
    name: '9. Monthly Crusher Performance Dossier',
    category: 'Management',
    description: 'Executive operational and commercial overview: total tonnage crushed, revenue realization, electricity consumption per ton, and EBITDA.',
    columns: ['Metric Description', 'August 2026 (Actual)', 'September 2026 (MTD)', 'Budget Target', 'Variance %', 'Status Indicator'],
    previewRows: [
      { 'Metric Description': 'Total Crushed Volume', 'August 2026 (Actual)': '36,200 MT', 'September 2026 (MTD)': '38,400 MT', 'Budget Target': '35,000 MT', 'Variance %': '+9.7%', 'Status Indicator': 'Exceeded' },
      { 'Metric Description': 'Gross Sales Billed', 'August 2026 (Actual)': '₹78,50,000', 'September 2026 (MTD)': '₹82,40,000', 'Budget Target': '₹75,00,000', 'Variance %': '+9.8%', 'Status Indicator': 'Exceeded' },
      { 'Metric Description': 'Electricity per Ton', 'August 2026 (Actual)': '4.4 kWh/T', 'September 2026 (MTD)': '4.2 kWh/T', 'Budget Target': '4.5 kWh/T', 'Variance %': '-6.6%', 'Status Indicator': 'Favorable' },
      { 'Metric Description': 'Operating Profit (EBITDA)', 'August 2026 (Actual)': '₹30,00,000', 'September 2026 (MTD)': '₹31,60,000', 'Budget Target': '₹28,00,000', 'Variance %': '+12.8%', 'Status Indicator': 'Strong Margin' }
    ]
  }
];

export const SAMPLE_ACTIVITY_LOGS = [
  { id: 'ACT-01', time: '10 mins ago', title: 'Gate Pass Dispatched', desc: 'Pass GP-CR-4101 approved for Sobha Horizon (28.0 MT 20mm Blue Metal)', type: 'DISPATCH' },
  { id: 'ACT-02', time: '45 mins ago', title: 'Material Receipt Accepted', desc: 'Receipt CR-RCPT-410 confirmed from Kasaragod North Pit #01 (24.3 MT Granite)', type: 'RECEIPT' },
  { id: 'ACT-03', time: '2 hours ago', title: 'Shift 1 Production Logged', desc: 'Batch PRD-101 finished: 850 Tons boulders processed into 833 Tons products', type: 'PRODUCTION' },
  { id: 'ACT-04', time: '3 hours ago', title: 'KSEB Power Bill Logged', desc: 'Voucher EXP-CR-01 generated for ₹3,84,000 HT Electricity payment', type: 'EXPENSE' },
  { id: 'ACT-05', time: 'Yesterday', title: 'Stock Silo Sensor Calibrated', desc: 'Silo 1 radar level transmitter verified at 4,800 MT capacity', type: 'MAINTENANCE' }
];

export const SAMPLE_ALERTS = [
  {
    id: 'ALT-01',
    level: 'HIGH',
    title: 'KSPCB Consent to Operate Renewal Milestone',
    message: 'Permit valid through 2028-01-09. Annual environmental audit filing due in 45 days.',
    actionText: 'Open Permit Dossier',
    category: 'Compliance'
  },
  {
    id: 'ALT-02',
    level: 'MEDIUM',
    title: 'Pending Partner Settlement Approval: Ibrahim K. (₹15.80 L)',
    message: 'September 2026 interim profit distribution calculated. Awaiting dual-signoff.',
    actionText: 'Review Settlement',
    category: 'Finance'
  },
  {
    id: 'ALT-03',
    level: 'MEDIUM',
    title: '6mm Blue Metal Grit Stock Reaching Low Threshold',
    message: 'Current stockpile at 800 Tons; minimum threshold is 500 Tons.',
    actionText: 'Adjust Screen Split',
    category: 'Stock'
  },
  {
    id: 'ALT-04',
    level: 'INFO',
    title: 'Quarry-to-Crusher Feeder Pipeline Active',
    message: 'Kasaragod North Pit #01 Bench A has 420 Tons granite ready for haulage dispatch.',
    actionText: 'View Traceability Flow',
    category: 'Logistics'
  }
];

export const CRUSHER_FINANCE_SUMMARY = {
  crusherSalesRevenue: 8240000,
  rawMaterialCost: 4515000,
  grossProfit: 3725000,
  electricityCost: 384000,
  fuelCost: 142000,
  sparesCost: 95000,
  maintenanceCost: 85000,
  salariesCost: 145000,
  netOperatingProfit: 3040000,
  partnerCapitalAccounts: 45000000,
  customerReceivables: 1480000,
  vendorPayables: 645000,
  gstOutput: 412000,
  gstInputCredit: 225750
};

// Aliases for unified importing across views
export const SAMPLE_CRUSHER_PRODUCTIONS = SAMPLE_PRODUCTIONS;
export const SAMPLE_CRUSHER_STOCKS = SAMPLE_STOCK_ITEMS;
export const SAMPLE_CRUSHER_WASTAGE_LOGS = SAMPLE_WASTAGE_RECORDS;
export const SAMPLE_CRUSHER_PURCHASES = SAMPLE_PURCHASES;
export const SAMPLE_CRUSHER_SALES = SAMPLE_SALES;
export const SAMPLE_CRUSHER_GATE_ENTRIES = SAMPLE_GATE_ENTRIES;
export const SAMPLE_CRUSHER_GATE_PASSES = SAMPLE_GATE_PASSES;
export const SAMPLE_CRUSHER_EXPENSES = SAMPLE_EXPENSES;
export const SAMPLE_CRUSHER_SETTLEMENTS = SAMPLE_PARTNER_SETTLEMENTS;
export const SAMPLE_CRUSHER_DOCUMENTS = SAMPLE_DOCUMENTS;
