// RZ® MINETRIX — PLATFORM 1: QUARRY MANAGEMENT STUDIO DATA & TYPES

export type QuarryMaterialType = 'Laterite' | 'Hard Rock' | 'Granite' | 'Aggregate' | 'Other';

export type QuarryStatus = 'ACTIVE' | 'UNDER_DEVELOPMENT' | 'MAINTENANCE' | 'EXHAUSTED' | 'SUSPENDED';

export type LoadStatus =
  | 'Draft'
  | 'Ready'
  | 'Gate Pass Issued'
  | 'Dispatched'
  | 'Delivered'
  | 'Completed'
  | 'Cancelled';

export type AgreementType = 'Land Purchase' | 'Mining & Return' | 'Per Load' | 'Hybrid / Custom';

export type ExpenseCategory =
  | 'Labour'
  | 'Fuel'
  | 'Machinery'
  | 'Maintenance'
  | 'Electricity'
  | 'Permit'
  | 'Transport'
  | 'Land Owner'
  | 'Partner'
  | 'Other';

export type SettlementType =
  | 'Land Owner Settlement'
  | 'Quarry Partner Settlement'
  | 'Customer Settlement'
  | 'Other';

export type DocumentCategory =
  | 'Quarry Permits'
  | 'Land Documents'
  | 'Agreements'
  | 'Partner Agreements'
  | 'Gate Passes'
  | 'Invoices'
  | 'Receipts'
  | 'Compliance Documents';

// Core Interfaces
export interface QuarryPartner {
  id: string;
  name: string;
  phone: string;
  investmentAmount: number;
  ownershipPercent: number;
  profitPercent: number;
  lossPercent: number;
  revenuePercent: number;
  expensePercent: number;
  effectiveFrom: string;
  status: 'ACTIVE' | 'INACTIVE';
  isAlsoLandOwner?: boolean;
}

export interface LandOwnerProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  panNumber: string;
  bankDetails: string;
  totalParcels: number;
  totalQuarryAreaAcres: number;
  agreementCount: number;
  loadCount: number;
  advancePaid: number;
  totalPaid: number;
  outstandingBalance: number;
  isAlsoPartner?: boolean;
}

export interface LandParcel {
  id: string;
  quarryId: string;
  surveyNumber: string;
  subdivision: string;
  ownerId: string;
  ownerName: string;
  extent: number;
  unit: 'Acres' | 'Cents' | 'Hectares';
  boundaries: {
    north: string;
    south: string;
    east: string;
    west: string;
  };
  location: string;
  status: 'ACTIVE_MINING' | 'AVAILABLE' | 'UNDER_SURVEY' | 'RETURNED';
  agreementId?: string;
  documentsCount: number;
}

export interface QuarryAgreement {
  id: string;
  agreementNumber: string;
  quarryId: string;
  quarryName: string;
  type: AgreementType;
  ownerId: string;
  ownerName: string;
  parcelIds: string[];
  parcelSurveys: string;
  material: QuarryMaterialType;
  extentAcres: number;
  // Financial specifics depending on type
  purchaseRatePerAcre?: number;
  totalAmount?: number;
  agreedMiningAmount?: number;
  miningPeriodMonths?: number;
  returnCondition?: string;
  ratePerLoad?: number;
  loadUnit?: string;
  customRules?: string;
  advanceAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentCycle: 'Per Load' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Lump Sum';
  startDate: string;
  expiryDate: string;
  status: 'ACTIVE' | 'PENDING_RENEWAL' | 'COMPLETED' | 'TERMINATED';
  documents: string[];
}

export interface WorkingArea {
  id: string;
  code: string;
  quarryId: string;
  quarryName: string;
  name: string;
  parcelIds: string[];
  parcelSurveys: string;
  ownerIds: string[];
  ownerNames: string;
  agreementIds: string[];
  agreementNumbers: string;
  material: QuarryMaterialType;
  startDate: string;
  endDate: string;
  status: 'ACTIVE_BENCH' | 'DEVELOPMENT' | 'EXHAUSTED' | 'ON_HOLD';
  depthMeters: number;
  estimatedYield: string;
}

export interface QuarryItem {
  id: string;
  code: string;
  name: string;
  businessName: string;
  type?: string;
  location: string;
  district: string;
  state: string;
  contactPerson: string;
  contactPhone: string;
  gpsCoordinates?: string;
  material: QuarryMaterialType;
  secondaryMaterials?: QuarryMaterialType[];
  status: QuarryStatus;
  totalLandAreaAcres: number;
  activeWorkingAreaAcres?: number;
  workingAreasCount: number;
  partnersCount: number;
  dailyCapacity: string;
  todayProduction: string;
  monthProduction: string;
  pitStock: string;
  salesMonth?: string;
  permitNumber: string;
  permitType: string;
  permitIssueDate?: string;
  permitExpiryDate: string;
  permitStatus?: 'VALID' | 'EXPIRING_SOON' | 'RENEWAL_SUBMITTED' | string;
}

export interface ProductionEntry {
  id: string;
  date: string;
  time?: string;
  quarryId: string;
  quarryName: string;
  workingAreaId: string;
  workingAreaName: string;
  material: QuarryMaterialType | string;
  quantity: number;
  unit: 'Stones' | 'MT' | 'CFT' | 'Trips' | string;
  shift: 'Shift A (06:00 - 14:00)' | 'Shift B (14:00 - 22:00)' | 'General Shift' | string;
  operator: string;
  excavatorId?: string;
  machineryUsed?: string;
  stockAdded?: number;
  notes: string;
}

export interface QuarryLoad {
  id: string;
  loadNumber: string;
  date: string;
  time: string;
  quarryId: string;
  quarryName: string;
  workingAreaId?: string;
  workingAreaName?: string;
  parcelId?: string;
  parcelSurvey?: string;
  agreementId?: string;
  agreementNumber?: string;
  ownerId?: string;
  ownerName?: string;
  material: QuarryMaterialType | string;
  quantity: number;
  unit: 'Stones' | 'MT' | 'CFT' | string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  customerName: string;
  destination?: string;
  ratePerUnit?: number;
  rate?: number;
  royaltyRatePerLoad?: number;
  totalAmount: number;
  status: LoadStatus | string;
  gatePassNumber?: string;
  invoiceNumber?: string;
}

export interface GatePassItem {
  id: string;
  gatePassNumber: string;
  date?: string;
  time?: string;
  timeOut?: string;
  quarryId?: string;
  quarryName: string;
  workingAreaId?: string;
  workingAreaName?: string;
  loadNumber: string;
  material: QuarryMaterialType | string;
  quantity: number;
  unit: string;
  vehicleNumber: string;
  driverName: string;
  customerName?: string;
  destination: string;
  authorizedBy?: string;
  securityOfficer?: string;
  status: 'ISSUED' | 'DISPATCHED' | 'EXPIRED' | 'CANCELLED' | 'CLEARED' | string;
  qrVerificationCode?: string;
}

export type GatePassRecord = GatePassItem;

export interface QuarrySale {
  id: string;
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerPhone: string;
  material: QuarryMaterialType;
  quantity: number;
  unit: string;
  rate: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  loadNumber: string;
  gatePassNumber: string;
  paymentMethod: 'UPI / Bank Transfer' | 'Cash' | 'Cheque' | 'Credit 15-Days';
  status: 'PAID' | 'PARTIAL' | 'PENDING' | 'OVERDUE';
}

export interface QuarryExpense {
  id: string;
  voucherNumber: string;
  date: string;
  quarryId: string;
  quarryName: string;
  workingAreaName?: string;
  category: ExpenseCategory | string;
  amount: number;
  paymentMethod?: 'Bank Transfer' | 'Cash' | 'Petty Cash' | 'Cheque' | string;
  paymentMode?: string;
  paidTo?: string;
  description: string;
  attachmentName?: string;
  referenceNumber: string;
  approvedBy?: string;
  status?: string;
}

export interface SettlementRecord {
  id: string;
  settlementNumber: string;
  settlementDate?: string;
  date?: string;
  type?: SettlementType | string;
  settlementType?: 'Land Owner' | 'Partner' | string;
  beneficiaryName: string;
  beneficiaryRole?: string;
  quarryName: string;
  openingBalance?: number;
  currentTransactions?: number;
  payableAmount?: number;
  paidAmount: number;
  closingBalance?: number;
  calculatedAmount?: number;
  deductions?: number;
  netPayable?: number;
  balance?: number;
  paymentMethod?: string;
  paymentMode?: string;
  periodOrLoadRange?: string;
  referenceNumber?: string;
  status: 'COMPLETED' | 'APPROVED_PENDING_PAYOUT' | 'DRAFT' | 'Paid' | 'Approved' | 'Partially Paid' | string;
}

export interface QuarryDocument {
  id: string;
  title: string;
  documentNumber: string;
  category: DocumentCategory | string;
  quarryName: string;
  associatedEntity?: string;
  linkedEntity?: string;
  fileFormat?: 'PDF' | 'JPG' | 'PNG' | 'DWG' | string;
  fileSize?: string;
  uploadDate?: string;
  issueDate?: string;
  expiryDate?: string;
  status: 'VALID' | 'EXPIRING' | 'EXPIRED' | 'ARCHIVED' | 'Valid' | 'Expiring Soon' | 'Expired' | string;
  downloadUrl?: string;
}

export interface QuarryReportTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  columns: string[];
  previewRows: Record<string, any>[];
}

export const REPORT_TEMPLATES: QuarryReportTemplate[] = [
  {
    id: 'rep-1',
    name: '1. Daily Production Report',
    category: 'Production & Yield',
    description: 'Day-by-day extraction breakdown by bench, working area, wire-saw machine, and stone quality grades.',
    columns: ['Date', 'Quarry Pit', 'Working Bench', 'Machine', 'Grade A', 'Grade B', 'Total Stones', 'Rejection Rate'],
    previewRows: [
      { 'Date': '2026-09-22', 'Quarry Pit': 'Kasaragod Pit #01', 'Working Bench': 'Bench A (North)', 'Machine': 'Wire Saw WS-01', 'Grade A': '2,400', 'Grade B': '800', 'Total Stones': '3,200', 'Rejection Rate': '1.2%' },
      { 'Date': '2026-09-22', 'Quarry Pit': 'Manjeshwar Pit #02', 'Working Bench': 'Bench 1 (Main Face)', 'Machine': 'Wire Saw WS-03', 'Grade A': '1,400', 'Grade B': '400', 'Total Stones': '1,800', 'Rejection Rate': '2.1%' },
      { 'Date': '2026-09-21', 'Quarry Pit': 'Kasaragod Pit #01', 'Working Bench': 'Bench B (Deep Face)', 'Machine': 'Wire Saw WS-02', 'Grade A': '2,800', 'Grade B': '750', 'Total Stones': '3,550', 'Rejection Rate': '1.5%' },
      { 'Date': '2026-09-20', 'Quarry Pit': 'Kasaragod Pit #01', 'Working Bench': 'Bench A (North)', 'Machine': 'Wire Saw WS-01', 'Grade A': '2,600', 'Grade B': '620', 'Total Stones': '3,220', 'Rejection Rate': '1.1%' }
    ]
  },
  {
    id: 'rep-2',
    name: '2. Material-wise Production Report',
    category: 'Production & Yield',
    description: 'Yield volumes aggregated by material classification: Laterite cut stones, granite raw blocks, crushed aggregate, and overburden soil.',
    columns: ['Material', 'Category', 'Unit', 'Month-to-Date', 'Avg Rate / Unit', 'Gross Extracted Value'],
    previewRows: [
      { 'Material': 'Laterite Stone (Grade A - Heavy Density)', 'Category': 'Building Block', 'Unit': 'Stones', 'Month-to-Date': '98,400', 'Avg Rate / Unit': '₹52.00', 'Gross Extracted Value': '₹51,16,800' },
      { 'Material': 'Laterite Stone (Grade B - Standard Masonry)', 'Category': 'Building Block', 'Unit': 'Stones', 'Month-to-Date': '31,600', 'Avg Rate / Unit': '₹48.00', 'Gross Extracted Value': '₹15,16,800' },
      { 'Material': 'Granite Dimensional Dressing Block', 'Category': 'Natural Stone', 'Unit': 'CBM', 'Month-to-Date': '840', 'Avg Rate / Unit': '₹4,500.00', 'Gross Extracted Value': '₹37,80,000' },
      { 'Material': 'Quarry Dust & Granular Rubble', 'Category': 'Aggregate', 'Unit': 'Tons', 'Month-to-Date': '1,850', 'Avg Rate / Unit': '₹450.00', 'Gross Extracted Value': '₹8,32,500' }
    ]
  },
  {
    id: 'rep-3',
    name: '3. Working Area Report',
    category: 'Cadastral & Mining',
    description: 'Excavation progress, active benches, elevation depth, and parcel ownership tracking per working area.',
    columns: ['Working Area', 'Quarry Pit', 'Elevation / Depth', 'Linked Survey No', 'Active Workforce', 'Monthly Stones Yield', 'Status'],
    previewRows: [
      { 'Working Area': 'Bench A - North Face', 'Quarry Pit': 'Kasaragod Pit #01', 'Elevation / Depth': '12.5 m Deep', 'Linked Survey No': 'Survey 412/1A', 'Active Workforce': '14 Personnel', 'Monthly Stones Yield': '54,000 Stones', 'Status': 'Active Cutting' },
      { 'Working Area': 'Bench B - Deep Face', 'Quarry Pit': 'Kasaragod Pit #01', 'Elevation / Depth': '18.0 m Deep', 'Linked Survey No': 'Survey 412/2B', 'Active Workforce': '10 Personnel', 'Monthly Stones Yield': '30,000 Stones', 'Status': 'Active Cutting' },
      { 'Working Area': 'Bench 1 - Main Face', 'Quarry Pit': 'Manjeshwar Pit #02', 'Elevation / Depth': '8.2 m Deep', 'Linked Survey No': 'Survey 284/1', 'Active Workforce': '8 Personnel', 'Monthly Stones Yield': '46,000 Stones', 'Status': 'Active Cutting' },
      { 'Working Area': 'Bench C - East Extension', 'Quarry Pit': 'Kasaragod Pit #01', 'Elevation / Depth': '0.0 m (Overburden)', 'Linked Survey No': 'Survey 413/4', 'Active Workforce': '4 Personnel', 'Monthly Stones Yield': '0 Stones', 'Status': 'Site Clearing' }
    ]
  },
  {
    id: 'rep-4',
    name: '4. Daily Load Report',
    category: 'Logistics & Dispatch',
    description: 'Comprehensive dispatch weighment logs, transport vehicle numbers, drivers, gate pass IDs, and customer destinations.',
    columns: ['Load No', 'Gate Pass ID', 'Date & Time', 'Vehicle No', 'Customer Name', 'Quantity', 'Gross Weight', 'Status'],
    previewRows: [
      { 'Load No': 'LOAD-2026-09-001', 'Gate Pass ID': 'GP-KSD-8810', 'Date & Time': '2026-09-22 08:30 AM', 'Vehicle No': 'KL-14-AC-9901', 'Customer Name': 'Sobha Construction Projects', 'Quantity': '120 Stones', 'Gross Weight': '14.2 Tons', 'Status': 'Dispatched' },
      { 'Load No': 'LOAD-2026-09-002', 'Gate Pass ID': 'GP-KSD-8811', 'Date & Time': '2026-09-22 09:15 AM', 'Vehicle No': 'KA-19-B-4412', 'Customer Name': 'Prestige Commercial Park', 'Quantity': '150 Stones', 'Gross Weight': '16.8 Tons', 'Status': 'Dispatched' },
      { 'Load No': 'LOAD-2026-09-003', 'Gate Pass ID': 'GP-KSD-8812', 'Date & Time': '2026-09-22 10:45 AM', 'Vehicle No': 'KL-14-Y-8812', 'Customer Name': 'Skyline Grandeur Villas', 'Quantity': '100 Stones', 'Gross Weight': '12.0 Tons', 'Status': 'Dispatched' },
      { 'Load No': 'LOAD-2026-09-004', 'Gate Pass ID': 'GP-KSD-8813', 'Date & Time': '2026-09-22 11:30 AM', 'Vehicle No': 'KA-20-C-1904', 'Customer Name': 'Malabar Builders Kasaragod', 'Quantity': '130 Stones', 'Gross Weight': '14.8 Tons', 'Status': 'Dispatched' }
    ]
  },
  {
    id: 'rep-5',
    name: '5. Sales Report',
    category: 'Commercial & Sales',
    description: 'Revenue recognition, invoice numbers, bill subtotal, GST output tax, and billing collection summaries.',
    columns: ['Invoice No', 'Invoice Date', 'Customer', 'Load No', 'Quantity', 'Rate / Stone', 'Total Amount', 'Payment Status'],
    previewRows: [
      { 'Invoice No': 'INV-2026-09-4101', 'Invoice Date': '2026-09-22', 'Customer': 'Sobha Construction Projects', 'Load No': 'LOAD-001', 'Quantity': '120 Stones', 'Rate / Stone': '₹55.00', 'Total Amount': '₹6,600', 'Payment Status': 'Paid' },
      { 'Invoice No': 'INV-2026-09-4102', 'Invoice Date': '2026-09-22', 'Customer': 'Prestige Commercial Park', 'Load No': 'LOAD-002', 'Quantity': '150 Stones', 'Rate / Stone': '₹52.00', 'Total Amount': '₹7,800', 'Payment Status': 'Paid' },
      { 'Invoice No': 'INV-2026-09-4103', 'Invoice Date': '2026-09-22', 'Customer': 'Skyline Grandeur Villas', 'Load No': 'LOAD-003', 'Quantity': '100 Stones', 'Rate / Stone': '₹54.00', 'Total Amount': '₹5,400', 'Payment Status': 'Paid' },
      { 'Invoice No': 'INV-2026-09-4104', 'Invoice Date': '2026-09-21', 'Customer': 'Malabar Builders Kasaragod', 'Load No': 'LOAD-004', 'Quantity': '130 Stones', 'Rate / Stone': '₹53.00', 'Total Amount': '₹6,890', 'Payment Status': 'Partial' }
    ]
  },
  {
    id: 'rep-6',
    name: '6. Customer Sales Summary',
    category: 'Commercial & Sales',
    description: 'Lifetime billed volumes, stone quantities, payments collected, and age of outstanding receivables per client.',
    columns: ['Customer Name', 'Total Orders', 'Total Stones Purchased', 'Gross Billed Value', 'Paid Amount', 'Outstanding Balance', 'Credit Terms'],
    previewRows: [
      { 'Customer Name': 'Sobha Construction Projects', 'Total Orders': '14 Loads', 'Total Stones Purchased': '18,500 Stones', 'Gross Billed Value': '₹9,80,500', 'Paid Amount': '₹8,50,000', 'Outstanding Balance': '₹1,30,500', 'Credit Terms': '15 Days' },
      { 'Customer Name': 'Prestige Commercial Park', 'Total Orders': '11 Loads', 'Total Stones Purchased': '14,200 Stones', 'Gross Billed Value': '₹7,38,400', 'Paid Amount': '₹7,38,400', 'Outstanding Balance': '₹0', 'Credit Terms': 'Immediate Bank' },
      { 'Customer Name': 'Skyline Grandeur Villas', 'Total Orders': '8 Loads', 'Total Stones Purchased': '9,800 Stones', 'Gross Billed Value': '₹5,29,200', 'Paid Amount': '₹4,50,000', 'Outstanding Balance': '₹79,200', 'Credit Terms': '30 Days' },
      { 'Customer Name': 'Malabar Builders Kasaragod', 'Total Orders': '6 Loads', 'Total Stones Purchased': '7,400 Stones', 'Gross Billed Value': '₹3,92,200', 'Paid Amount': '₹3,00,000', 'Outstanding Balance': '₹92,200', 'Credit Terms': '15 Days' }
    ]
  },
  {
    id: 'rep-7',
    name: '7. Expense Report',
    category: 'Expenditure & Costing',
    description: 'Chronological expenditure vouchers for pit consumables, excavator diesel, diamond wire saws, and contract wages.',
    columns: ['Voucher No', 'Date', 'Payee Name', 'Quarry Pit', 'Category', 'Amount', 'Payment Mode', 'Approved By'],
    previewRows: [
      { 'Voucher No': 'VOUCH-2026-09-101', 'Date': '2026-09-22', 'Payee Name': 'Pit Daily Laborers', 'Quarry Pit': 'Kasaragod Pit #01', 'Category': 'Labour Wages', 'Amount': '₹18,500', 'Payment Mode': 'Bank Transfer', 'Approved By': 'K. Mohan Kumar' },
      { 'Voucher No': 'VOUCH-2026-09-102', 'Date': '2026-09-22', 'Payee Name': 'Bharat Petroleum Dealer', 'Quarry Pit': 'Kasaragod Pit #01', 'Category': 'Fuel / Diesel', 'Amount': '₹24,200', 'Payment Mode': 'NEFT Bank', 'Approved By': 'Nafid Khan' },
      { 'Voucher No': 'VOUCH-2026-09-103', 'Date': '2026-09-21', 'Payee Name': 'Apex Machine Works', 'Quarry Pit': 'Kasaragod Pit #01', 'Category': 'Wire Saw & Blades', 'Amount': '₹8,500', 'Payment Mode': 'Cash Voucher', 'Approved By': 'K. Mohan Kumar' },
      { 'Voucher No': 'VOUCH-2026-09-104', 'Date': '2026-09-20', 'Payee Name': 'Shri V. Prabhakar Pai', 'Quarry Pit': 'Kasaragod Pit #01', 'Category': 'Land Owner Royalty', 'Amount': '₹50,000', 'Payment Mode': 'RTGS Canara', 'Approved By': 'Nafid Khan' }
    ]
  },
  {
    id: 'rep-8',
    name: '8. Category-wise Expense Report',
    category: 'Expenditure & Costing',
    description: 'Aggregated cost-center analysis identifying top quarry expense drivers and extraction cost per stone.',
    columns: ['Expense Category', 'Monthly Spend', '% of Total Cost', 'Cost Per Cut Stone', 'Budget Variance'],
    previewRows: [
      { 'Expense Category': 'Labour & Wages', 'Monthly Spend': '₹4,80,000', '% of Total Cost': '36.5%', 'Cost Per Stone': '₹5.71', 'Budget Variance': '-2.1% (Favorable)' },
      { 'Expense Category': 'Fuel / Diesel (HSD for Machinery)', 'Monthly Spend': '₹3,40,000', '% of Total Cost': '25.8%', 'Cost Per Stone': '₹4.04', 'Budget Variance': '+3.4% (Higher Hours)' },
      { 'Expense Category': 'Diamond Wire Saw & Consumables', 'Monthly Spend': '₹1,95,000', '% of Total Cost': '14.8%', 'Cost Per Stone': '₹2.32', 'Budget Variance': '-1.0% (On Budget)' },
      { 'Expense Category': 'DMG Mining Royalty & Permit Taxes', 'Monthly Spend': '₹1,80,000', '% of Total Cost': '13.7%', 'Cost Per Stone': '₹2.14', 'Budget Variance': '0.0% (Statutory)' }
    ]
  },
  {
    id: 'rep-9',
    name: '9. Land Owner Royalty Report',
    category: 'Landowner Accounting',
    description: 'Detailed per-load and survey-number reconciliation calculating earned royalties against extracted volumes.',
    columns: ['Land Owner Name', 'Survey Numbers', 'Agreed Rate / Load', 'Dispatched Loads', 'Gross Royalty Earned', 'Advance Offset', 'Net Due'],
    previewRows: [
      { 'Land Owner Name': 'Shri V. Prabhakar Pai', 'Survey Numbers': 'Survey 412/1A, 412/2B', 'Agreed Rate / Load': '₹600 / Load', 'Dispatched Loads': '142 Loads', 'Gross Royalty Earned': '₹85,200', 'Advance Offset': '₹25,000', 'Net Due': '₹60,200' },
      { 'Land Owner Name': 'Haji K. M. Abdulla', 'Survey Numbers': 'Survey 413/4', 'Agreed Rate / Load': 'Fixed Lumpsum', 'Dispatched Loads': '48 Loads', 'Gross Royalty Earned': '₹65,000', 'Advance Offset': '₹0', 'Net Due': '₹65,000' },
      { 'Land Owner Name': 'Smt. Sarojini Amma', 'Survey Numbers': 'Survey 284/1', 'Agreed Rate / Load': '₹550 / Load', 'Dispatched Loads': '82 Loads', 'Gross Royalty Earned': '₹45,100', 'Advance Offset': '₹15,000', 'Net Due': '₹30,100' }
    ]
  },
  {
    id: 'rep-10',
    name: '10. Land Owner Settlement Statement',
    category: 'Landowner Accounting',
    description: 'Formal bank payout audit statements for landowners detailing opening balance, loads delivered, and RTGS disbursements.',
    columns: ['Settlement No', 'Date', 'Land Owner', 'Load Period', 'Gross Entitlement', 'Deductions / Fuel', 'Net Paid', 'Bank Reference', 'Status'],
    previewRows: [
      { 'Settlement No': 'SET-LO-2026-09', 'Date': '2026-09-20', 'Land Owner': 'Shri V. Prabhakar Pai', 'Load Period': 'Loads #001 to #120', 'Gross Entitlement': '₹72,000', 'Deductions / Fuel': '₹22,000', 'Net Paid': '₹50,000', 'Bank Reference': 'RTGS-CNRB-88129', 'Status': 'Disbursed' },
      { 'Settlement No': 'SET-LO-2026-09B', 'Date': '2026-09-22', 'Land Owner': 'Haji K. M. Abdulla', 'Load Period': 'Bench B Monthly Lease', 'Gross Entitlement': '₹65,000', 'Deductions / Fuel': '₹0', 'Net Paid': '₹65,000', 'Bank Reference': 'Pending Payout', 'Status': 'Approved' }
    ]
  },
  {
    id: 'rep-11',
    name: '11. Partner Profit / Loss Statement',
    category: 'Partnership Accounting',
    description: 'Independent quarry pit P&L distribution showing revenue share, operational cost allocation, and net partner dividends.',
    columns: ['Partner Name', 'Profit / Loss %', 'Gross Pit Revenue', 'Shared Pit Costs', 'Net Pit Profit', 'Partner Dividend', 'Payment Status'],
    previewRows: [
      { 'Partner Name': 'Nafid Khan (Managing Partner)', 'Profit / Loss %': '40.0%', 'Gross Pit Revenue': '₹42,80,000', 'Shared Pit Costs': '₹26,50,000', 'Net Pit Profit': '₹16,30,000', 'Partner Dividend': '₹6,52,000', 'Payment Status': 'Transferred' },
      { 'Partner Name': 'K. Mohan Kumar (Operations)', 'Profit / Loss %': '35.0%', 'Gross Pit Revenue': '₹42,80,000', 'Shared Pit Costs': '₹26,50,000', 'Net Pit Profit': '₹16,30,000', 'Partner Dividend': '₹5,70,500', 'Payment Status': 'Transferred' },
      { 'Partner Name': 'Shri V. Prabhakar Pai (Investor)', 'Profit / Loss %': '25.0%', 'Gross Pit Revenue': '₹42,80,000', 'Shared Pit Costs': '₹26,50,000', 'Net Pit Profit': '₹16,30,000', 'Partner Dividend': '₹4,07,500', 'Payment Status': 'Transferred' }
    ]
  },
  {
    id: 'rep-12',
    name: '12. Quarry Profitability Report',
    category: 'Executive & Strategic',
    description: 'Full financial performance dossier comparing revenue, pit expenses, statutory royalties, and EBITDA margins across all concessions.',
    columns: ['Quarry Concession', 'Total Stones Extracted', 'Gross Revenue', 'Operating Costs', 'Royalty & Taxes', 'Net Profit', 'EBITDA Margin'],
    previewRows: [
      { 'Quarry Concession': 'Kasaragod North Laterite Pit #01', 'Total Stones Extracted': '84,000 Stones', 'Gross Revenue': '₹42,80,000', 'Operating Costs': '₹23,40,000', 'Royalty & Taxes': '₹3,10,000', 'Net Profit': '₹16,30,000', 'EBITDA Margin': '38.1%' },
      { 'Quarry Concession': 'Manjeshwar Laterite Pit #02', 'Total Stones Extracted': '46,000 Stones', 'Gross Revenue': '₹24,10,000', 'Operating Costs': '₹13,80,000', 'Royalty & Taxes': '₹1,80,000', 'Net Profit': '₹8,50,000', 'EBITDA Margin': '35.2%' },
      { 'Quarry Concession': 'Ullal Coastal Hard Rock Concession', 'Total Stones Extracted': '2,400 Blocks', 'Gross Revenue': '₹3,40,000', 'Operating Costs': '₹2,60,000', 'Royalty & Taxes': '₹40,000', 'Net Profit': '₹40,000', 'EBITDA Margin': '11.8%' }
    ]
  },
  {
    id: 'rep-13',
    name: '13. Quarry Audit Report',
    category: 'Executive & Strategic',
    description: 'Comprehensive compliance and audit dossier verifying DMG permit validity, environmental safeguards, tax filings, and load reconciliation.',
    columns: ['Audit Check Area', 'Regulatory Standard', 'Inspection Finding', 'Risk Level', 'Auditor Verification', 'Compliance Status'],
    previewRows: [
      { 'Audit Check Area': 'DMG Mining Permit & Lease Validity', 'Regulatory Standard': 'Kerala Minor Mineral Rules 2015', 'Inspection Finding': 'Lease valid through 2028-03-31; boundary pillars intact', 'Risk Level': 'LOW', 'Auditor Verification': 'DMG Officer S. Panicker', 'Compliance Status': 'Compliant & Verified' },
      { 'Audit Check Area': 'Environmental Clearance & Air Quality', 'Regulatory Standard': 'KSPCB Consent to Operate (CTO)', 'Inspection Finding': 'Water sprinklers operating on haul road; dust index normal', 'Risk Level': 'LOW', 'Auditor Verification': 'District PCB Team', 'Compliance Status': 'Compliant & Verified' },
      { 'Audit Check Area': 'Weighbridge & Gate Pass Reconcile', 'Regulatory Standard': 'Commercial Tax & DMG Transit Pass', 'Inspection Finding': 'Zero discrepancies between physical dispatches & e-way bills', 'Risk Level': 'LOW', 'Auditor Verification': 'RZ Internal Audit Wing', 'Compliance Status': '100% Reconciled' },
      { 'Audit Check Area': 'Explosives & Controlled Blasting', 'Regulatory Standard': 'PESO Magazine Compliance', 'Inspection Finding': 'Magazine register updated; wire saw utilized for secondary', 'Risk Level': 'LOW', 'Auditor Verification': 'Controller of Explosives', 'Compliance Status': 'Compliant & Verified' }
    ]
  }
];

// -------------------------------------------------------------
// INITIAL RICH SAMPLE/DEMO DATA
// -------------------------------------------------------------

export const SAMPLE_QUARRIES: QuarryItem[] = [
  {
    id: 'Q-01',
    code: 'QP-KL-001',
    name: 'Kasaragod North Laterite Pit #01',
    businessName: 'RZ Minetrix Natural Resources LLP',
    location: 'Badiadka, Kasaragod',
    district: 'Kasaragod',
    state: 'Kerala',
    contactPerson: 'K. Mohan Kumar (Site Incharge)',
    contactPhone: '+91 94471 28911',
    material: 'Laterite',
    secondaryMaterials: ['Aggregate'],
    status: 'ACTIVE',
    totalLandAreaAcres: 14.2,
    activeWorkingAreaAcres: 9.8,
    workingAreasCount: 3,
    partnersCount: 3,
    dailyCapacity: '4,000 Cut Stones',
    todayProduction: '3,200 Cut Stones',
    monthProduction: '84,000 Stones',
    pitStock: '18,400 Stones',
    permitNumber: 'DMG/KSD/QL/2023/184',
    permitType: 'Quarrying Lease (Major Mineral Extraction)',
    permitIssueDate: '2023-04-01',
    permitExpiryDate: '2028-03-31',
    permitStatus: 'VALID'
  },
  {
    id: 'Q-02',
    code: 'QP-KL-002',
    name: 'Manjeshwar Laterite & Clay Pit',
    businessName: 'Coastal Builders & Minerals Co.',
    location: 'Hosabettu, Manjeshwar',
    district: 'Kasaragod',
    state: 'Kerala',
    contactPerson: 'Nafid Khan (Partner Incharge)',
    contactPhone: '+91 98450 11234',
    material: 'Laterite',
    secondaryMaterials: ['Other'],
    status: 'ACTIVE',
    totalLandAreaAcres: 8.5,
    activeWorkingAreaAcres: 6.2,
    workingAreasCount: 2,
    partnersCount: 2,
    dailyCapacity: '2,500 Cut Stones',
    todayProduction: '1,800 Cut Stones',
    monthProduction: '46,000 Stones',
    pitStock: '9,200 Stones',
    permitNumber: 'DMG/KSD/QL/2022/091',
    permitType: 'Laterite Mining Concession',
    permitIssueDate: '2022-07-15',
    permitExpiryDate: '2027-07-14',
    permitStatus: 'VALID'
  },
  {
    id: 'Q-03',
    code: 'QP-KA-003',
    name: 'Ullal Coastal Granite & Hard Rock Pit',
    businessName: 'RZ Minetrix Aggregates Karnataka',
    location: 'Someshwar, Ullal, Mangalore',
    district: 'Dakshina Kannada',
    state: 'Karnataka',
    contactPerson: 'Ramesh Adiga (Operations Head)',
    contactPhone: '+91 98453 77211',
    material: 'Hard Rock',
    secondaryMaterials: ['Granite', 'Aggregate'],
    status: 'ACTIVE',
    totalLandAreaAcres: 22.0,
    activeWorkingAreaAcres: 14.5,
    workingAreasCount: 4,
    partnersCount: 3,
    dailyCapacity: '1,800 MT',
    todayProduction: '1,450 MT',
    monthProduction: '38,500 MT',
    pitStock: '12,400 MT Blue Metal',
    permitNumber: 'DMG/DK/CRUSH/2021/412',
    permitType: 'Stone Quarrying Lease & Blasting Permit',
    permitIssueDate: '2021-11-01',
    permitExpiryDate: '2031-10-31',
    permitStatus: 'VALID'
  },
  {
    id: 'Q-04',
    code: 'QP-KA-004',
    name: 'Moodbidri Granite & Aggregate Concession',
    businessName: 'RZ Stone Infra LLP',
    location: 'Mijar, Moodbidri',
    district: 'Dakshina Kannada',
    state: 'Karnataka',
    contactPerson: 'S. Hegde (Site Engineer)',
    contactPhone: '+91 94812 33400',
    material: 'Aggregate',
    secondaryMaterials: ['Hard Rock'],
    status: 'ACTIVE',
    totalLandAreaAcres: 18.0,
    activeWorkingAreaAcres: 11.0,
    workingAreasCount: 2,
    partnersCount: 2,
    dailyCapacity: '1,200 MT',
    todayProduction: '980 MT',
    monthProduction: '25,200 MT',
    pitStock: '8,600 MT GSB & M-Sand',
    permitNumber: 'DMG/DK/MIN/2023/077',
    permitType: 'Granite & Basalt Extraction',
    permitIssueDate: '2023-01-10',
    permitExpiryDate: '2026-12-31',
    permitStatus: 'EXPIRING_SOON'
  },
  {
    id: 'Q-05',
    code: 'QP-KA-005',
    name: 'Vittal Granite Concession Bed',
    businessName: 'Vittal Minerals & Developers',
    location: 'Kolnadu, Vittal, Bantwal',
    district: 'Dakshina Kannada',
    state: 'Karnataka',
    contactPerson: 'Dinesh Poojary',
    contactPhone: '+91 97419 66012',
    material: 'Granite',
    secondaryMaterials: ['Hard Rock'],
    status: 'UNDER_DEVELOPMENT',
    totalLandAreaAcres: 11.5,
    activeWorkingAreaAcres: 3.0,
    workingAreasCount: 1,
    partnersCount: 1,
    dailyCapacity: '0 MT (Bench Strip in progress)',
    todayProduction: '0 MT',
    monthProduction: '0 MT',
    pitStock: '1,400 MT Raw Boulders',
    permitNumber: 'DMG/DK/APP/2024/002',
    permitType: 'Under Survey / Environmental Clearance Application',
    permitIssueDate: '2024-02-15',
    permitExpiryDate: '2029-02-14',
    permitStatus: 'RENEWAL_SUBMITTED'
  }
];

export const SAMPLE_LAND_OWNERS: LandOwnerProfile[] = [
  {
    id: 'LO-01',
    name: 'Shri V. Prabhakar Pai',
    phone: '+91 98450 11234',
    email: 'vppai.kasaragod@gmail.com',
    address: 'Pai Nivas, Main Road, Badiadka, Kasaragod - 671551',
    panNumber: 'ABCDE1234F',
    bankDetails: 'Canara Bank - Badiadka (A/c: 0142101099231, IFSC: CNRB0000142)',
    totalParcels: 3,
    totalQuarryAreaAcres: 7.2,
    agreementCount: 2,
    loadCount: 142,
    advancePaid: 500000,
    totalPaid: 1420000,
    outstandingBalance: 240000,
    isAlsoPartner: true // CRITICAL: A person may be both!
  },
  {
    id: 'LO-02',
    name: 'Haji K. M. Abdulla',
    phone: '+91 94481 99221',
    email: 'abdulla.km@coastalminerals.in',
    address: 'Baitul Noor, Hosabettu, Manjeshwar, Kasaragod - 671323',
    panNumber: 'FGHIJ5678K',
    bankDetails: 'Federal Bank - Uppala Branch (A/c: 12040100449102, IFSC: FDRL0001204)',
    totalParcels: 2,
    totalQuarryAreaAcres: 5.8,
    agreementCount: 1,
    loadCount: 98,
    advancePaid: 300000,
    totalPaid: 890000,
    outstandingBalance: 115000,
    isAlsoPartner: false
  },
  {
    id: 'LO-03',
    name: 'Smt. Rohini Shetty',
    phone: '+91 97412 44331',
    email: 'rohini.shetty.someshwar@outlook.com',
    address: 'Shetty Estate, Near Someshwar Temple, Ullal, Mangalore - 575020',
    panNumber: 'KLMNO9012P',
    bankDetails: 'State Bank of India - Ullal Branch (A/c: 30981124509, IFSC: SBIN0008451)',
    totalParcels: 2,
    totalQuarryAreaAcres: 6.4,
    agreementCount: 1,
    loadCount: 76,
    advancePaid: 400000,
    totalPaid: 650000,
    outstandingBalance: 180000,
    isAlsoPartner: false
  },
  {
    id: 'LO-04',
    name: 'Mohammed Ashraf',
    phone: '+91 98455 88902',
    email: 'ashraf.m@gmail.com',
    address: 'Hill View Villa, Mijar, Moodbidri - 574225',
    panNumber: 'PQRST3456U',
    bankDetails: 'Karnataka Bank - Moodbidri (A/c: 50425001007812, IFSC: KARB0000504)',
    totalParcels: 1,
    totalQuarryAreaAcres: 4.0,
    agreementCount: 1,
    loadCount: 54,
    advancePaid: 250000,
    totalPaid: 420000,
    outstandingBalance: 80000,
    isAlsoPartner: false
  }
];

export const SAMPLE_QUARRY_PARTNERS: QuarryPartner[] = [
  {
    id: 'QP-01',
    name: 'Nafid Khan (Managing Director)',
    phone: '+91 98450 99881',
    investmentAmount: 4500000,
    ownershipPercent: 40,
    profitPercent: 40,
    lossPercent: 40,
    revenuePercent: 40,
    expensePercent: 40,
    effectiveFrom: '2023-01-01',
    status: 'ACTIVE',
    isAlsoLandOwner: false
  },
  {
    id: 'QP-02',
    name: 'K. Mohan Kumar (Technical Partner)',
    phone: '+91 94471 28911',
    investmentAmount: 3000000,
    ownershipPercent: 35,
    profitPercent: 35,
    lossPercent: 35,
    revenuePercent: 35,
    expensePercent: 35,
    effectiveFrom: '2023-01-01',
    status: 'ACTIVE',
    isAlsoLandOwner: false
  },
  {
    id: 'QP-03',
    name: 'Shri V. Prabhakar Pai (Investor & Land Owner)',
    phone: '+91 98450 11234',
    investmentAmount: 2000000,
    ownershipPercent: 25,
    profitPercent: 25,
    lossPercent: 25,
    revenuePercent: 25,
    expensePercent: 25,
    effectiveFrom: '2023-04-15',
    status: 'ACTIVE',
    isAlsoLandOwner: true // CRITICAL: Highlighted in prompt!
  }
];

export const SAMPLE_LAND_PARCELS: LandParcel[] = [
  {
    id: 'LP-101',
    quarryId: 'Q-01',
    surveyNumber: '412/1A',
    subdivision: 'Sub-Division 1',
    ownerId: 'LO-01',
    ownerName: 'Shri V. Prabhakar Pai',
    extent: 3.8,
    unit: 'Acres',
    boundaries: {
      north: 'Survey 411 Village Road',
      south: 'Survey 412/2B (Adjacent Parcel)',
      east: 'Stream Buffer Zone',
      west: 'Government Revenue Land'
    },
    location: 'Bench A - Kasaragod North Pit',
    status: 'ACTIVE_MINING',
    agreementId: 'AGR-2023-01',
    documentsCount: 4
  },
  {
    id: 'LP-102',
    quarryId: 'Q-01',
    surveyNumber: '412/2B',
    subdivision: 'Sub-Division 2',
    ownerId: 'LO-01',
    ownerName: 'Shri V. Prabhakar Pai',
    extent: 3.4,
    unit: 'Acres',
    boundaries: {
      north: 'Survey 412/1A (North Face)',
      south: 'Rubber Plantation of S. Nair',
      east: 'Quarry Access Haul Road',
      west: 'Laterite Ridge Border'
    },
    location: 'Bench A - Kasaragod North Pit',
    status: 'ACTIVE_MINING',
    agreementId: 'AGR-2023-01',
    documentsCount: 3
  },
  {
    id: 'LP-103',
    quarryId: 'Q-01',
    surveyNumber: '413/4',
    subdivision: 'Sub-Division A',
    ownerId: 'LO-02',
    ownerName: 'Haji K. M. Abdulla',
    extent: 2.9,
    unit: 'Acres',
    boundaries: {
      north: 'Survey 412 Border',
      south: 'Private Access Lane',
      east: 'Forest Boundary Line',
      west: 'Agricultural Farmland'
    },
    location: 'Bench B - Ridge Laterite Block',
    status: 'ACTIVE_MINING',
    agreementId: 'AGR-2023-02',
    documentsCount: 5
  },
  {
    id: 'LP-104',
    quarryId: 'Q-01',
    surveyNumber: '413/5',
    subdivision: 'Sub-Division B',
    ownerId: 'LO-02',
    ownerName: 'Haji K. M. Abdulla',
    extent: 2.9,
    unit: 'Acres',
    boundaries: {
      north: 'Survey 413/4 (Adjacent Parcel)',
      south: 'Taluk Road Boundary',
      east: 'Valley Drainage Channel',
      west: 'Granite Outcrop'
    },
    location: 'Bench B - Ridge Laterite Block',
    status: 'ACTIVE_MINING',
    agreementId: 'AGR-2023-02',
    documentsCount: 3
  },
  {
    id: 'LP-105',
    quarryId: 'Q-02',
    surveyNumber: '198/3A',
    subdivision: 'Main Lot',
    ownerId: 'LO-01',
    ownerName: 'Shri V. Prabhakar Pai',
    extent: 4.2,
    unit: 'Acres',
    boundaries: {
      north: 'Coastal Highway NH 66 bypass',
      south: 'Panchayat Well Zone (30m buffer)',
      east: 'Laterite Terrace',
      west: 'Compound Wall'
    },
    location: 'Hosabettu North Block',
    status: 'ACTIVE_MINING',
    agreementId: 'AGR-2024-01',
    documentsCount: 4
  },
  {
    id: 'LP-106',
    quarryId: 'Q-03',
    surveyNumber: '88/1',
    subdivision: 'Plot 1',
    ownerId: 'LO-03',
    ownerName: 'Smt. Rohini Shetty',
    extent: 4.0,
    unit: 'Acres',
    boundaries: {
      north: 'Someshwar Village Road',
      south: 'Survey 88/2 (Granite Face)',
      east: 'Crusher Conveyor Setup',
      west: 'Hill Ridge'
    },
    location: 'Ullal Granite Bench 1',
    status: 'ACTIVE_MINING',
    agreementId: 'AGR-2023-04',
    documentsCount: 6
  },
  {
    id: 'LP-107',
    quarryId: 'Q-03',
    surveyNumber: '88/2',
    subdivision: 'Plot 2',
    ownerId: 'LO-03',
    ownerName: 'Smt. Rohini Shetty',
    extent: 2.4,
    unit: 'Acres',
    boundaries: {
      north: 'Survey 88/1',
      south: 'Reclaimed Safety Buffer',
      east: 'Storage Yard',
      west: 'High Wall Barrier'
    },
    location: 'Ullal Granite Bench 2',
    status: 'ACTIVE_MINING',
    agreementId: 'AGR-2023-04',
    documentsCount: 2
  }
];

export const SAMPLE_AGREEMENTS: QuarryAgreement[] = [
  {
    id: 'AGR-2023-01',
    agreementNumber: 'RZ-AGR-KSD-001',
    quarryId: 'Q-01',
    quarryName: 'Kasaragod North Laterite Pit #01',
    type: 'Per Load',
    ownerId: 'LO-01',
    ownerName: 'Shri V. Prabhakar Pai',
    parcelIds: ['LP-101', 'LP-102'],
    parcelSurveys: '412/1A, 412/2B (7.2 Acres)',
    material: 'Laterite',
    extentAcres: 7.2,
    ratePerLoad: 600, // ₹600 per lorry load (or ₹6 / cut stone)
    loadUnit: 'Lorry Load (approx. 100 Stones)',
    advanceAmount: 500000,
    paidAmount: 1420000,
    balanceAmount: 240000,
    paymentCycle: 'Monthly',
    startDate: '2023-04-01',
    expiryDate: '2028-03-31',
    status: 'ACTIVE',
    documents: ['Registered_Lease_Deed_001.pdf', 'Panchayat_NOC_Pai.pdf']
  },
  {
    id: 'AGR-2023-02',
    agreementNumber: 'RZ-AGR-KSD-002',
    quarryId: 'Q-01',
    quarryName: 'Kasaragod North Laterite Pit #01',
    type: 'Mining & Return',
    ownerId: 'LO-02',
    ownerName: 'Haji K. M. Abdulla',
    parcelIds: ['LP-103', 'LP-104'],
    parcelSurveys: '413/4, 413/5 (5.8 Acres)',
    material: 'Laterite',
    extentAcres: 5.8,
    agreedMiningAmount: 1800000,
    miningPeriodMonths: 36,
    returnCondition: 'Land leveled to +2m ground datum, top soil layered for agriculture planting',
    advanceAmount: 300000,
    paidAmount: 890000,
    balanceAmount: 115000,
    paymentCycle: 'Monthly',
    startDate: '2023-05-15',
    expiryDate: '2026-05-14',
    status: 'ACTIVE',
    documents: ['Mining_Return_Abdulla_Notarized.pdf', 'Leveling_Guarantee_Bond.pdf']
  },
  {
    id: 'AGR-2024-01',
    agreementNumber: 'RZ-AGR-KSD-003',
    quarryId: 'Q-02',
    quarryName: 'Manjeshwar Laterite & Clay Pit',
    type: 'Land Purchase',
    ownerId: 'LO-01',
    ownerName: 'Shri V. Prabhakar Pai',
    parcelIds: ['LP-105'],
    parcelSurveys: '198/3A (4.2 Acres)',
    material: 'Laterite',
    extentAcres: 4.2,
    purchaseRatePerAcre: 1800000,
    totalAmount: 7560000,
    advanceAmount: 2000000,
    paidAmount: 5560000,
    balanceAmount: 2000000,
    paymentCycle: 'Lump Sum',
    startDate: '2024-01-10',
    expiryDate: '2025-12-31',
    status: 'ACTIVE',
    documents: ['Sale_Agreement_Registration_Copy.pdf', 'Title_Deed_Encumbrance.pdf']
  },
  {
    id: 'AGR-2023-04',
    agreementNumber: 'RZ-AGR-MNG-004',
    quarryId: 'Q-03',
    quarryName: 'Ullal Coastal Granite & Hard Rock Pit',
    type: 'Hybrid / Custom',
    ownerId: 'LO-03',
    ownerName: 'Smt. Rohini Shetty',
    parcelIds: ['LP-106', 'LP-107'],
    parcelSurveys: '88/1, 88/2 (6.4 Acres)',
    material: 'Hard Rock',
    extentAcres: 6.4,
    ratePerLoad: 45, // ₹45 per Metric Tonne
    customRules: 'Base royalty ₹45/MT + ₹1,00,000 monthly minimum guarantee regardless of volume + 2% annual escalation',
    advanceAmount: 400000,
    paidAmount: 650000,
    balanceAmount: 180000,
    paymentCycle: 'Monthly',
    startDate: '2023-08-01',
    expiryDate: '2028-07-31',
    status: 'ACTIVE',
    documents: ['Hybrid_Granite_Royalty_Deed.pdf', 'Blasting_Safe_Distance_Affidavit.pdf']
  }
];

export const SAMPLE_WORKING_AREAS: WorkingArea[] = [
  {
    id: 'WA-01',
    code: 'WA-KSD-01',
    quarryId: 'Q-01',
    quarryName: 'Kasaragod North Laterite Pit #01',
    name: 'Bench A - North Laterite Face',
    parcelIds: ['LP-101', 'LP-102'],
    parcelSurveys: '412/1A, 412/2B (Adjacent Parcels)',
    ownerIds: ['LO-01'],
    ownerNames: 'Shri V. Prabhakar Pai',
    agreementIds: ['AGR-2023-01'],
    agreementNumbers: 'RZ-AGR-KSD-001 (Per Load)',
    material: 'Laterite',
    startDate: '2023-04-15',
    endDate: '2027-12-31',
    status: 'ACTIVE_BENCH',
    depthMeters: 8.5,
    estimatedYield: '2,40,000 Cut Stones'
  },
  {
    id: 'WA-02',
    code: 'WA-KSD-02',
    quarryId: 'Q-01',
    quarryName: 'Kasaragod North Laterite Pit #01',
    name: 'Bench B - Ridge Laterite Block',
    parcelIds: ['LP-103', 'LP-104'],
    parcelSurveys: '413/4, 413/5 (Multiple Adjacent Owners)',
    ownerIds: ['LO-02'],
    ownerNames: 'Haji K. M. Abdulla',
    agreementIds: ['AGR-2023-02'],
    agreementNumbers: 'RZ-AGR-KSD-002 (Mining & Return)',
    material: 'Laterite',
    startDate: '2023-06-01',
    endDate: '2026-05-31',
    status: 'ACTIVE_BENCH',
    depthMeters: 6.2,
    estimatedYield: '1,80,000 Cut Stones'
  },
  {
    id: 'WA-03',
    code: 'WA-MSW-01',
    quarryId: 'Q-02',
    quarryName: 'Manjeshwar Laterite & Clay Pit',
    name: 'East Excavation Pit Face',
    parcelIds: ['LP-105'],
    parcelSurveys: '198/3A',
    ownerIds: ['LO-01'],
    ownerNames: 'Shri V. Prabhakar Pai',
    agreementIds: ['AGR-2024-01'],
    agreementNumbers: 'RZ-AGR-KSD-003 (Land Purchase)',
    material: 'Laterite',
    startDate: '2024-02-01',
    endDate: '2028-12-31',
    status: 'ACTIVE_BENCH',
    depthMeters: 4.8,
    estimatedYield: '1,50,000 Stones'
  },
  {
    id: 'WA-04',
    code: 'WA-ULL-01',
    quarryId: 'Q-03',
    quarryName: 'Ullal Coastal Granite & Hard Rock Pit',
    name: 'Granite Hard Rock Bench 1',
    parcelIds: ['LP-106', 'LP-107'],
    parcelSurveys: '88/1, 88/2',
    ownerIds: ['LO-03'],
    ownerNames: 'Smt. Rohini Shetty',
    agreementIds: ['AGR-2023-04'],
    agreementNumbers: 'RZ-AGR-MNG-004 (Hybrid Custom)',
    material: 'Hard Rock',
    startDate: '2023-09-01',
    endDate: '2029-08-31',
    status: 'ACTIVE_BENCH',
    depthMeters: 14.0,
    estimatedYield: '8,50,000 MT Blue Metal'
  }
];

export const SAMPLE_PRODUCTION_ENTRIES: ProductionEntry[] = [
  {
    id: 'PRD-001',
    date: '2026-09-22',
    time: '08:30 AM',
    quarryId: 'Q-01',
    quarryName: 'Kasaragod North Laterite Pit #01',
    workingAreaId: 'WA-01',
    workingAreaName: 'Bench A - North Laterite Face',
    material: 'Laterite',
    quantity: 1600,
    unit: 'Stones',
    shift: 'Shift A (06:00 - 14:00)',
    operator: 'Raju Cutting Team (4 Cutters)',
    excavatorId: 'CAT-320D-01',
    notes: 'Grade A High Density Laterite 12x8x6 inches, clean cuts'
  },
  {
    id: 'PRD-002',
    date: '2026-09-22',
    time: '11:45 AM',
    quarryId: 'Q-01',
    quarryName: 'Kasaragod North Laterite Pit #01',
    workingAreaId: 'WA-02',
    workingAreaName: 'Bench B - Ridge Laterite Block',
    material: 'Laterite',
    quantity: 1600,
    unit: 'Stones',
    shift: 'Shift A (06:00 - 14:00)',
    operator: 'Santosh Wire-Saw Unit',
    excavatorId: 'JCB-3DX-04',
    notes: 'Red Laterite building blocks dispatched straight to stock'
  },
  {
    id: 'PRD-003',
    date: '2026-09-22',
    time: '02:15 PM',
    quarryId: 'Q-03',
    quarryName: 'Ullal Coastal Granite & Hard Rock Pit',
    workingAreaId: 'WA-04',
    workingAreaName: 'Granite Hard Rock Bench 1',
    material: 'Hard Rock',
    quantity: 920,
    unit: 'MT',
    shift: 'Shift A (06:00 - 14:00)',
    operator: 'Voltas Drilling & Blasting Unit',
    excavatorId: 'KOMATSU-PC210',
    notes: 'Bench 1 blasting yield clean basalt granite for crusher feed'
  },
  {
    id: 'PRD-004',
    date: '2026-09-22',
    time: '04:00 PM',
    quarryId: 'Q-03',
    quarryName: 'Ullal Coastal Granite & Hard Rock Pit',
    workingAreaId: 'WA-04',
    workingAreaName: 'Granite Hard Rock Bench 1',
    material: 'Hard Rock',
    quantity: 530,
    unit: 'MT',
    shift: 'Shift B (14:00 - 22:00)',
    operator: 'Secondary Breaker Team',
    excavatorId: 'CAT-320D-02',
    notes: 'Secondary boulder sizing for primary jaw crusher'
  },
  {
    id: 'PRD-005',
    date: '2026-09-22',
    time: '03:10 PM',
    quarryId: 'Q-02',
    quarryName: 'Manjeshwar Laterite & Clay Pit',
    workingAreaId: 'WA-03',
    workingAreaName: 'East Excavation Pit Face',
    material: 'Laterite',
    quantity: 1800,
    unit: 'Stones',
    shift: 'Shift A (06:00 - 14:00)',
    operator: 'Kerala Stone Cutter Gang #3',
    excavatorId: 'HITACHI-EX200',
    notes: 'Moisture optimal, block extraction rate 300 stones/hour'
  },
  {
    id: 'PRD-006',
    date: '2026-09-21',
    time: '05:30 PM',
    quarryId: 'Q-04',
    quarryName: 'Moodbidri Granite & Aggregate Concession',
    workingAreaId: 'WA-04',
    workingAreaName: 'North Aggregate Pit',
    material: 'Aggregate',
    quantity: 980,
    unit: 'MT',
    shift: 'General Shift',
    operator: 'Mijar Crusher Feed Team',
    excavatorId: 'CAT-950L-LOADER',
    notes: '40mm Run-of-Quarry aggregate screened'
  }
];

export const SAMPLE_LOADS: QuarryLoad[] = [
  {
    id: 'LD-1001',
    loadNumber: 'LOAD-2026-09-001',
    date: '2026-09-22',
    time: '09:15 AM',
    quarryId: 'Q-01',
    quarryName: 'Kasaragod North Laterite Pit #01',
    workingAreaId: 'WA-01',
    workingAreaName: 'Bench A - North Laterite Face',
    parcelId: 'LP-101',
    parcelSurvey: '412/1A',
    agreementId: 'AGR-2023-01',
    agreementNumber: 'RZ-AGR-KSD-001',
    ownerId: 'LO-01',
    ownerName: 'Shri V. Prabhakar Pai',
    material: 'Laterite',
    quantity: 120,
    unit: 'Stones',
    vehicleNumber: 'KL-14-AC-8912',
    driverName: 'Mustafa K.',
    driverPhone: '+91 94478 12340',
    customerName: 'Sobha Builders Kasaragod',
    destination: 'Sobha Sapphire Villa Project, Vidyanagar',
    ratePerUnit: 54,
    totalAmount: 6480,
    status: 'Delivered',
    gatePassNumber: 'GP-KSD-8812',
    invoiceNumber: 'INV-2026-4401'
  },
  {
    id: 'LD-1002',
    loadNumber: 'LOAD-2026-09-002',
    date: '2026-09-22',
    time: '10:30 AM',
    quarryId: 'Q-01',
    quarryName: 'Kasaragod North Laterite Pit #01',
    workingAreaId: 'WA-01',
    workingAreaName: 'Bench A - North Laterite Face',
    parcelId: 'LP-102',
    parcelSurvey: '412/2B',
    agreementId: 'AGR-2023-01',
    agreementNumber: 'RZ-AGR-KSD-001',
    ownerId: 'LO-01',
    ownerName: 'Shri V. Prabhakar Pai',
    material: 'Laterite',
    quantity: 150,
    unit: 'Stones',
    vehicleNumber: 'KL-14-B-4401',
    driverName: 'Gopal Naik',
    driverPhone: '+91 97410 88219',
    customerName: 'Prestige Commercial Park',
    destination: 'Highway Junction, Kumble',
    ratePerUnit: 52,
    totalAmount: 7800,
    status: 'Dispatched',
    gatePassNumber: 'GP-KSD-8813',
    invoiceNumber: 'INV-2026-4402'
  },
  {
    id: 'LD-1003',
    loadNumber: 'LOAD-2026-09-003',
    date: '2026-09-22',
    time: '11:45 AM',
    quarryId: 'Q-03',
    quarryName: 'Ullal Coastal Granite & Hard Rock Pit',
    workingAreaId: 'WA-04',
    workingAreaName: 'Granite Hard Rock Bench 1',
    parcelId: 'LP-106',
    parcelSurvey: '88/1',
    agreementId: 'AGR-2023-04',
    agreementNumber: 'RZ-AGR-MNG-004',
    ownerId: 'LO-03',
    ownerName: 'Smt. Rohini Shetty',
    material: 'Hard Rock',
    quantity: 32,
    unit: 'MT',
    vehicleNumber: 'KA-19-D-7822',
    driverName: 'Shekhar Poojary',
    driverPhone: '+91 98801 44520',
    customerName: 'Mangalore Port Sea-Wall Project',
    destination: 'Panambur New Port Berth #8',
    ratePerUnit: 680,
    totalAmount: 21760,
    status: 'Gate Pass Issued',
    gatePassNumber: 'GP-ULL-5501',
    invoiceNumber: 'INV-2026-4403'
  },
  {
    id: 'LD-1004',
    loadNumber: 'LOAD-2026-09-004',
    date: '2026-09-22',
    time: '01:15 PM',
    quarryId: 'Q-01',
    quarryName: 'Kasaragod North Laterite Pit #01',
    workingAreaId: 'WA-02',
    workingAreaName: 'Bench B - Ridge Laterite Block',
    parcelId: 'LP-103',
    parcelSurvey: '413/4',
    agreementId: 'AGR-2023-02',
    agreementNumber: 'RZ-AGR-KSD-002',
    ownerId: 'LO-02',
    ownerName: 'Haji K. M. Abdulla',
    material: 'Laterite',
    quantity: 130,
    unit: 'Stones',
    vehicleNumber: 'KL-60-E-1190',
    driverName: 'Jabbar V. M.',
    driverPhone: '+91 94951 88310',
    customerName: 'Royal Residency Complex',
    destination: 'Cherkala Town',
    ratePerUnit: 53,
    totalAmount: 6890,
    status: 'Ready',
    gatePassNumber: 'GP-KSD-8814'
  },
  {
    id: 'LD-1005',
    loadNumber: 'LOAD-2026-09-005',
    date: '2026-09-22',
    time: '02:30 PM',
    quarryId: 'Q-02',
    quarryName: 'Manjeshwar Laterite & Clay Pit',
    workingAreaId: 'WA-03',
    workingAreaName: 'East Excavation Pit Face',
    parcelId: 'LP-105',
    parcelSurvey: '198/3A',
    agreementId: 'AGR-2024-01',
    agreementNumber: 'RZ-AGR-KSD-003',
    ownerId: 'LO-01',
    ownerName: 'Shri V. Prabhakar Pai',
    material: 'Laterite',
    quantity: 140,
    unit: 'Stones',
    vehicleNumber: 'KL-14-Y-9901',
    driverName: 'Dileep Kumar',
    driverPhone: '+91 98471 22910',
    customerName: 'Coastal Brick Works',
    destination: 'Uppala Beach Road',
    ratePerUnit: 51,
    totalAmount: 7140,
    status: 'Draft'
  }
];

export const SAMPLE_GATE_PASSES: GatePassItem[] = [
  {
    id: 'GP-001',
    gatePassNumber: 'GP-KSD-8812',
    date: '2026-09-22',
    time: '09:10 AM',
    quarryId: 'Q-01',
    quarryName: 'Kasaragod North Laterite Pit #01',
    workingAreaId: 'WA-01',
    workingAreaName: 'Bench A - North Laterite Face',
    loadNumber: 'LOAD-2026-09-001',
    material: 'Laterite',
    quantity: 120,
    unit: 'Stones',
    vehicleNumber: 'KL-14-AC-8912',
    driverName: 'Mustafa K.',
    customerName: 'Sobha Builders Kasaragod',
    destination: 'Sobha Sapphire Villa Project, Vidyanagar',
    authorizedBy: 'K. Mohan Kumar (Weighbridge Officer)',
    status: 'DISPATCHED',
    qrVerificationCode: 'RZ-SEC-GP-KSD-8812-20260922'
  },
  {
    id: 'GP-002',
    gatePassNumber: 'GP-KSD-8813',
    date: '2026-09-22',
    time: '10:25 AM',
    quarryId: 'Q-01',
    quarryName: 'Kasaragod North Laterite Pit #01',
    workingAreaId: 'WA-01',
    workingAreaName: 'Bench A - North Laterite Face',
    loadNumber: 'LOAD-2026-09-002',
    material: 'Laterite',
    quantity: 150,
    unit: 'Stones',
    vehicleNumber: 'KL-14-B-4401',
    driverName: 'Gopal Naik',
    customerName: 'Prestige Commercial Park',
    destination: 'Highway Junction, Kumble',
    authorizedBy: 'K. Mohan Kumar (Weighbridge Officer)',
    status: 'DISPATCHED',
    qrVerificationCode: 'RZ-SEC-GP-KSD-8813-20260922'
  },
  {
    id: 'GP-003',
    gatePassNumber: 'GP-ULL-5501',
    date: '2026-09-22',
    time: '11:40 AM',
    quarryId: 'Q-03',
    quarryName: 'Ullal Coastal Granite & Hard Rock Pit',
    workingAreaId: 'WA-04',
    workingAreaName: 'Granite Hard Rock Bench 1',
    loadNumber: 'LOAD-2026-09-003',
    material: 'Hard Rock',
    quantity: 32,
    unit: 'MT',
    vehicleNumber: 'KA-19-D-7822',
    driverName: 'Shekhar Poojary',
    customerName: 'Mangalore Port Sea-Wall Project',
    destination: 'Panambur New Port Berth #8',
    authorizedBy: 'Ramesh Adiga (Site Incharge)',
    status: 'ISSUED',
    qrVerificationCode: 'RZ-SEC-GP-ULL-5501-20260922'
  },
  {
    id: 'GP-004',
    gatePassNumber: 'GP-KSD-8814',
    date: '2026-09-22',
    time: '01:10 PM',
    quarryId: 'Q-01',
    quarryName: 'Kasaragod North Laterite Pit #01',
    workingAreaId: 'WA-02',
    workingAreaName: 'Bench B - Ridge Laterite Block',
    loadNumber: 'LOAD-2026-09-004',
    material: 'Laterite',
    quantity: 130,
    unit: 'Stones',
    vehicleNumber: 'KL-60-E-1190',
    driverName: 'Jabbar V. M.',
    customerName: 'Royal Residency Complex',
    destination: 'Cherkala Town',
    authorizedBy: 'K. Mohan Kumar (Weighbridge Officer)',
    status: 'ISSUED',
    qrVerificationCode: 'RZ-SEC-GP-KSD-8814-20260922'
  }
];

export const SAMPLE_SALES: QuarrySale[] = [
  {
    id: 'SAL-001',
    invoiceNumber: 'INV-2026-4401',
    date: '2026-09-22',
    customerName: 'Sobha Builders Kasaragod',
    customerPhone: '+91 98450 11990',
    material: 'Laterite',
    quantity: 120,
    unit: 'Stones',
    rate: 54,
    totalAmount: 6480,
    paidAmount: 6480,
    balanceAmount: 0,
    loadNumber: 'LOAD-2026-09-001',
    gatePassNumber: 'GP-KSD-8812',
    paymentMethod: 'UPI / Bank Transfer',
    status: 'PAID'
  },
  {
    id: 'SAL-002',
    invoiceNumber: 'INV-2026-4402',
    date: '2026-09-22',
    customerName: 'Prestige Commercial Park',
    customerPhone: '+91 97411 33440',
    material: 'Laterite',
    quantity: 150,
    unit: 'Stones',
    rate: 52,
    totalAmount: 7800,
    paidAmount: 5000,
    balanceAmount: 2800,
    loadNumber: 'LOAD-2026-09-002',
    gatePassNumber: 'GP-KSD-8813',
    paymentMethod: 'Credit 15-Days',
    status: 'PARTIAL'
  },
  {
    id: 'SAL-003',
    invoiceNumber: 'INV-2026-4403',
    date: '2026-09-22',
    customerName: 'Mangalore Port Sea-Wall Project',
    customerPhone: '+91 98800 55661',
    material: 'Hard Rock',
    quantity: 32,
    unit: 'MT',
    rate: 680,
    totalAmount: 21760,
    paidAmount: 21760,
    balanceAmount: 0,
    loadNumber: 'LOAD-2026-09-003',
    gatePassNumber: 'GP-ULL-5501',
    paymentMethod: 'UPI / Bank Transfer',
    status: 'PAID'
  },
  {
    id: 'SAL-004',
    invoiceNumber: 'INV-2026-4399',
    date: '2026-09-21',
    customerName: 'Malabar Heritage Resort Builders',
    customerPhone: '+91 94470 22119',
    material: 'Laterite',
    quantity: 400,
    unit: 'Stones',
    rate: 53,
    totalAmount: 21200,
    paidAmount: 0,
    balanceAmount: 21200,
    loadNumber: 'LOAD-2026-09-994',
    gatePassNumber: 'GP-KSD-8790',
    paymentMethod: 'Cheque',
    status: 'PENDING'
  }
];

export const SAMPLE_EXPENSES: QuarryExpense[] = [
  {
    id: 'EXP-001',
    voucherNumber: 'VOUCH-2026-09-101',
    date: '2026-09-22',
    quarryId: 'Q-01',
    quarryName: 'Kasaragod North Laterite Pit #01',
    category: 'Labour',
    amount: 18500,
    paymentMethod: 'Bank Transfer',
    description: 'Daily stone cutter wages for 10 cutters (Pit Bench A & B)',
    attachmentName: 'Labour_Sheet_22Sep.pdf',
    referenceNumber: 'UPI-REF-9921401',
    approvedBy: 'K. Mohan Kumar'
  },
  {
    id: 'EXP-002',
    voucherNumber: 'VOUCH-2026-09-102',
    date: '2026-09-22',
    quarryId: 'Q-01',
    quarryName: 'Kasaragod North Laterite Pit #01',
    category: 'Fuel',
    amount: 24200,
    paymentMethod: 'Bank Transfer',
    description: '250 Litres HSD Diesel delivered by Bharat Petroleum dealer for CAT 320D',
    attachmentName: 'BPCL_Fuel_Bill_4812.pdf',
    referenceNumber: 'NEFT-88412091',
    approvedBy: 'Nafid Khan'
  },
  {
    id: 'EXP-003',
    voucherNumber: 'VOUCH-2026-09-103',
    date: '2026-09-21',
    quarryId: 'Q-01',
    quarryName: 'Kasaragod North Laterite Pit #01',
    category: 'Maintenance',
    amount: 8500,
    paymentMethod: 'Cash',
    description: 'Diamond wire-saw blade re-tipping & tensioner pulley replacement',
    attachmentName: 'Saw_Repair_Challan.jpg',
    referenceNumber: 'PETTY-CASH-441',
    approvedBy: 'K. Mohan Kumar'
  },
  {
    id: 'EXP-004',
    voucherNumber: 'VOUCH-2026-09-104',
    date: '2026-09-20',
    quarryId: 'Q-01',
    quarryName: 'Kasaragod North Laterite Pit #01',
    category: 'Land Owner',
    amount: 50000,
    paymentMethod: 'Bank Transfer',
    description: 'Interim royalty payout on account of Survey 412/1A (Shri V. Prabhakar Pai)',
    attachmentName: 'LandOwner_Receipt_Pai.pdf',
    referenceNumber: 'RTGS-CNRB-88129',
    approvedBy: 'Nafid Khan'
  },
  {
    id: 'EXP-005',
    voucherNumber: 'VOUCH-2026-09-19',
    date: '2026-09-19',
    quarryId: 'Q-03',
    quarryName: 'Ullal Coastal Granite & Hard Rock Pit',
    category: 'Permit',
    amount: 35000,
    paymentMethod: 'Bank Transfer',
    description: 'Half-yearly environmental audit & pollution control board compliance fee',
    attachmentName: 'KSPCB_Audit_Receipt.pdf',
    referenceNumber: 'TREASURY-CHLN-192',
    approvedBy: 'Ramesh Adiga'
  },
  {
    id: 'EXP-006',
    voucherNumber: 'VOUCH-2026-09-18',
    date: '2026-09-18',
    quarryId: 'Q-01',
    quarryName: 'Kasaragod North Laterite Pit #01',
    category: 'Electricity',
    amount: 14200,
    paymentMethod: 'Bank Transfer',
    description: 'KSEB high-tension quarry power sub-station monthly electricity invoice',
    attachmentName: 'KSEB_HT_Bill_Sep.pdf',
    referenceNumber: 'KSEB-ONLINE-44812',
    approvedBy: 'Nafid Khan'
  }
];

export const SAMPLE_SETTLEMENTS: SettlementRecord[] = [
  {
    id: 'SET-001',
    settlementNumber: 'SET-LO-2026-09',
    settlementDate: '2026-09-20',
    type: 'Land Owner Settlement',
    beneficiaryName: 'Shri V. Prabhakar Pai',
    beneficiaryRole: 'Land Owner (Survey 412/1A & 412/2B)',
    quarryName: 'Kasaragod North Laterite Pit #01',
    openingBalance: 290000,
    currentTransactions: 50000,
    payableAmount: 50000,
    paidAmount: 50000,
    closingBalance: 240000,
    paymentMethod: 'RTGS Bank Transfer (Canara Bank)',
    referenceNumber: 'RTGS-CNRB-88129',
    status: 'COMPLETED'
  },
  {
    id: 'SET-002',
    settlementNumber: 'SET-QP-2026-08',
    settlementDate: '2026-09-05',
    type: 'Quarry Partner Settlement',
    beneficiaryName: 'K. Mohan Kumar',
    beneficiaryRole: 'Quarry Partner (35% Profit Share)',
    quarryName: 'Kasaragod North Laterite Pit #01',
    openingBalance: 0,
    currentTransactions: 420000,
    payableAmount: 420000,
    paidAmount: 420000,
    closingBalance: 0,
    paymentMethod: 'NEFT Bank Transfer',
    referenceNumber: 'NEFT-AXIS-992140',
    status: 'COMPLETED'
  },
  {
    id: 'SET-003',
    settlementNumber: 'SET-CUST-2026-09',
    settlementDate: '2026-09-21',
    type: 'Customer Settlement',
    beneficiaryName: 'Prestige Commercial Park',
    beneficiaryRole: 'Commercial Client',
    quarryName: 'Kasaragod North Laterite Pit #01',
    openingBalance: 7800,
    currentTransactions: 7800,
    payableAmount: 5000,
    paidAmount: 5000,
    closingBalance: 2800,
    paymentMethod: 'Cheque Clearance (HDFC Bank)',
    referenceNumber: 'CHQ-882190',
    status: 'COMPLETED'
  },
  {
    id: 'SET-004',
    settlementNumber: 'SET-LO-2026-09B',
    settlementDate: '2026-09-22',
    type: 'Land Owner Settlement',
    beneficiaryName: 'Haji K. M. Abdulla',
    beneficiaryRole: 'Land Owner (Survey 413/4)',
    quarryName: 'Kasaragod North Laterite Pit #01',
    openingBalance: 115000,
    currentTransactions: 65000,
    payableAmount: 65000,
    paidAmount: 0,
    closingBalance: 115000,
    paymentMethod: 'Pending RTGS Authorization',
    referenceNumber: 'DRAFT-AUT-0019',
    status: 'APPROVED_PENDING_PAYOUT'
  }
];

export const SAMPLE_DOCUMENTS: QuarryDocument[] = [
  {
    id: 'DOC-001',
    title: 'Mining Lease Concession Deed - Kasaragod North',
    documentNumber: 'DMG/KSD/QL/2023/184',
    category: 'Quarry Permits',
    quarryName: 'Kasaragod North Laterite Pit #01',
    associatedEntity: 'Dept. of Mining & Geology, Govt. of Kerala',
    fileFormat: 'PDF',
    fileSize: '4.2 MB',
    uploadDate: '2023-04-05',
    expiryDate: '2028-03-31',
    status: 'VALID',
    downloadUrl: '#'
  },
  {
    id: 'DOC-002',
    title: 'Registered Land Lease Deed - Survey 412/1A & 412/2B',
    documentNumber: 'DEED-BDI-2023-991',
    category: 'Land Documents',
    quarryName: 'Kasaragod North Laterite Pit #01',
    associatedEntity: 'Shri V. Prabhakar Pai',
    fileFormat: 'PDF',
    fileSize: '3.1 MB',
    uploadDate: '2023-04-10',
    expiryDate: '2028-03-31',
    status: 'VALID',
    downloadUrl: '#'
  },
  {
    id: 'DOC-003',
    title: 'Quarry Partnership Deed (Independent Profit/Loss Terms)',
    documentNumber: 'RZ-PTN-2023-001',
    category: 'Partner Agreements',
    quarryName: 'Kasaragod North Laterite Pit #01',
    associatedEntity: 'Nafid Khan, K. Mohan Kumar, Shri V. Prabhakar Pai',
    fileFormat: 'PDF',
    fileSize: '2.8 MB',
    uploadDate: '2023-04-15',
    status: 'VALID',
    downloadUrl: '#'
  },
  {
    id: 'DOC-004',
    title: 'Environmental Clearance & Pollution Board Certificate',
    documentNumber: 'KSEB-PCB-KSD-2022',
    category: 'Compliance Documents',
    quarryName: 'Kasaragod North Laterite Pit #01',
    associatedEntity: 'Kerala State Pollution Control Board',
    fileFormat: 'PDF',
    fileSize: '5.6 MB',
    uploadDate: '2023-03-20',
    expiryDate: '2027-03-19',
    status: 'VALID',
    downloadUrl: '#'
  },
  {
    id: 'DOC-005',
    title: 'Gate Pass Dispatches Batch Summary Q3 2026',
    documentNumber: 'GP-SUMMARY-2026-Q3',
    category: 'Gate Passes',
    quarryName: 'Kasaragod North Laterite Pit #01',
    associatedEntity: 'Quarry Security & Weighbridge Staff',
    fileFormat: 'PDF',
    fileSize: '1.4 MB',
    uploadDate: '2026-09-22',
    status: 'VALID',
    downloadUrl: '#'
  },
  {
    id: 'DOC-006',
    title: 'Commercial Tax & GST E-Way Bill Records',
    documentNumber: 'EWB-2026-09-4100',
    category: 'Invoices',
    quarryName: 'Kasaragod North Laterite Pit #01',
    associatedEntity: 'Sobha Builders & Prestige Park',
    fileFormat: 'PDF',
    fileSize: '2.1 MB',
    uploadDate: '2026-09-22',
    status: 'VALID',
    downloadUrl: '#'
  }
];

export const SAMPLE_ACTIVITY_LOG = [
  {
    id: 'ACT-01',
    type: 'LOAD_CREATED',
    title: 'New load LOAD-2026-09-005 created',
    detail: '140 Laterite Stones for Coastal Brick Works on KL-14-Y-9901',
    time: '12 minutes ago',
    icon: 'Truck'
  },
  {
    id: 'ACT-02',
    type: 'GATE_PASS',
    title: 'Gate pass GP-KSD-8814 issued',
    detail: 'Load #004 dispatched to Royal Residency Complex',
    time: '34 minutes ago',
    icon: 'ShieldCheck'
  },
  {
    id: 'ACT-03',
    type: 'SALE_RECORDED',
    title: 'Sale recorded INV-2026-4402',
    detail: '₹7,800 total billing to Prestige Commercial Park',
    time: '1 hour ago',
    icon: 'TrendingUp'
  },
  {
    id: 'ACT-04',
    type: 'PAYMENT_RECEIVED',
    title: 'Payment received ₹21,760',
    detail: 'Mangalore Port Sea-Wall project cleared via UPI Bank Transfer',
    time: '2 hours ago',
    icon: 'CheckCircle2'
  },
  {
    id: 'ACT-05',
    type: 'LAND_OWNER_PENDING',
    title: 'Land owner payment pending: Haji K. M. Abdulla',
    detail: 'Approval granted for ₹65,000 against Survey 413/4 royalty',
    time: '3 hours ago',
    icon: 'AlertTriangle'
  },
  {
    id: 'ACT-06',
    type: 'AGREEMENT_UPDATED',
    title: 'Agreement RZ-AGR-KSD-001 terms renewed',
    detail: 'Extended royalty schedule for Bench A with Shri V. Prabhakar Pai',
    time: 'Yesterday',
    icon: 'FileText'
  }
];

export const SAMPLE_ALERTS = [
  {
    id: 'ALT-01',
    level: 'HIGH',
    title: 'Permit Expiring: Moodbidri Granite Pit (QP-KA-004)',
    message: 'Mining lease valid until 2026-12-31. Renewal dossier submission due within 60 days.',
    actionText: 'Renew Permit',
    category: 'Permit / Document Expiry'
  },
  {
    id: 'ALT-02',
    level: 'MEDIUM',
    title: 'Pending Settlement: Haji K. M. Abdulla (LO-02)',
    message: 'Approved pending payout: ₹65,000 royalty on Bench B. Awaiting RTGS disbursement.',
    actionText: 'Process Settlement',
    category: 'Pending Settlement'
  },
  {
    id: 'ALT-03',
    level: 'HIGH',
    title: 'Pending Land Owner Outstanding: Shri V. Prabhakar Pai',
    message: 'Unpaid royalty balance stands at ₹2,40,000 across 142 extracted loads.',
    actionText: 'View Owner Account',
    category: 'Pending Payment'
  },
  {
    id: 'ALT-04',
    level: 'MEDIUM',
    title: 'Wire-Saw Cutter Blade Wear on Pit #01 Bench B',
    message: 'Cutting yield reduced by 14% due to tensioner pulley vibration.',
    actionText: 'Log Maintenance',
    category: 'Production Issue'
  },
  {
    id: 'ALT-05',
    level: 'INFO',
    title: 'Agreement RZ-AGR-KSD-002 Due for Annual Review',
    message: 'Mining & Return agreement has reached month 32 of 36-month term.',
    actionText: 'Open Agreement',
    category: 'Agreement Expiring'
  }
];

// Aliases for convenience across quarry components
export const SAMPLE_PARCELS = SAMPLE_LAND_PARCELS;
export const SAMPLE_OWNERS = SAMPLE_LAND_OWNERS;
export const SAMPLE_PARTNERS = SAMPLE_QUARRY_PARTNERS;
export const SAMPLE_PRODUCTIONS = SAMPLE_PRODUCTION_ENTRIES;

