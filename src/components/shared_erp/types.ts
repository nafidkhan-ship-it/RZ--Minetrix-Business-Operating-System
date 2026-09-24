// Shared ERP Core Data Structures & Navigation Types
export type ErpNavigationTab =
  | 'dashboard'
  | 'master-data'
  | 'products-rates'
  | 'customers'
  | 'suppliers'
  | 'purchase'
  | 'sales'
  | 'orders'
  | 'inventory'
  | 'gate-pass'
  | 'staff'
  | 'attendance'
  | 'payroll'
  | 'advances'
  | 'batta'
  | 'debtors'
  | 'creditors'
  | 'cash'
  | 'banks'
  | 'pay-in'
  | 'pay-out'
  | 'investors'
  | 'partners'
  | 'trip-accounts'
  | 'ownership'
  | 'settlements'
  | 'documents'
  | 'reports'
  | 'audit-activity';

export type PersonRoleType =
  | 'CUSTOMER'
  | 'SUPPLIER'
  | 'STAFF'
  | 'PARTNER'
  | 'INVESTOR'
  | 'LAND_OWNER'
  | 'VEHICLE_OWNER'
  | 'DRIVER'
  | 'CONTRACTOR'
  | 'SERVICE_PROVIDER';

export interface MasterPerson {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  gstin?: string;
  panNumber?: string;
  relationships: PersonRoleType[];
  primaryRole: PersonRoleType;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    ifsc: string;
    branch: string;
  };
  creditLimit?: number;
  paymentTerms?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  notes?: string;
  createdAt: string;
  totalReceivable?: number;
  totalPayable?: number;
}

export type ProductUnit =
  | 'Piece'
  | 'Load'
  | 'Ton'
  | 'Kg'
  | 'Litre'
  | 'Trip'
  | 'Hour'
  | 'Day'
  | 'Sq.ft'
  | 'Sq.m'
  | 'Cent'
  | 'Acre';

export interface RateRule {
  id: string;
  rateType: 'DEFAULT' | 'CUSTOMER_SPECIFIC' | 'SUPPLIER_SPECIFIC' | 'AGREEMENT' | 'QUANTITY_TIER' | 'DATE_SEASON' | 'LOCATION';
  targetEntityName?: string;
  minQty?: number;
  maxQty?: number;
  rate: number;
  unit: ProductUnit;
  effectiveFrom: string;
  effectiveTo?: string;
  location?: string;
  sourceLabel: string;
}

export interface ErpProduct {
  id: string;
  name: string;
  sku: string;
  category: 'DIMENSION_STONE' | 'CRUSHED_AGGREGATES' | 'CRUSHED_SAND' | 'RAW_BOULDER' | 'FUEL_CONSUMABLE' | 'MACHINERY_SPARE' | 'SERVICE';
  unit: ProductUnit;
  hsnSac: string;
  gstRatePct: number;
  purchaseRate: number;
  salesRate: number;
  minRate: number;
  maxRate: number;
  stockTracking: boolean;
  currentStock: number;
  reorderLevel: number;
  sourceQuarry?: string;
  sourceCrusher?: string;
  preferredSupplier?: string;
  description: string;
  isActive: boolean;
  rates: RateRule[];
}

export type OrderStatus =
  | 'DRAFT'
  | 'ENQUIRY'
  | 'QUOTATION_REQUESTED'
  | 'QUOTATION_RECEIVED'
  | 'CONFIRMED'
  | 'PAYMENT_PENDING'
  | 'PROCESSING'
  | 'READY_FOR_DISPATCH'
  | 'DISPATCHED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CUSTOMER_CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DISPUTED'
  | 'REFUND_PENDING'
  | 'REFUNDED';

export interface CentralOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerId: string;
  customerPhone: string;
  date: string;
  deliveryDate: string;
  productName: string;
  productId: string;
  quantity: number;
  unit: ProductUnit;
  appliedRate: number;
  rateSource: string;
  subtotal: number;
  gstAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: OrderStatus;
  destination: string;
  assignedVehicle?: string;
  assignedDriver?: string;
  supplierOrPlantSource?: string;
  dispatchId?: string;
  invoiceId?: string;
  notes?: string;
}

export interface PurchaseRequest {
  id: string;
  requestNo: string;
  requestedBy: string;
  department: string;
  product: string;
  quantity: string;
  requiredDate: string;
  purpose: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  date: string;
  deliveryDate: string;
  items: {
    productName: string;
    qty: number;
    unit: ProductUnit;
    rate: number;
    discountPct: number;
    gstPct: number;
    total: number;
  }[];
  subtotal: number;
  taxTotal: number;
  totalAmount: number;
  paymentTerms: string;
  status: 'DRAFT' | 'APPROVED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
}

export interface GoodsReceiptNote {
  id: string;
  grnNumber: string;
  poNumber: string;
  supplierName: string;
  date: string;
  productName: string;
  orderedQty: number;
  receivedQty: number;
  acceptedQty: number;
  rejectedQty: number;
  vehicleNumber: string;
  driverName: string;
  gatePassNo: string;
  remarks: string;
  status: 'VERIFIED' | 'DISCREPANCY' | 'PENDING';
}

export interface PurchaseBill {
  id: string;
  billNumber: string;
  supplierName: string;
  grnNumber: string;
  poNumber: string;
  billDate: string;
  dueDate: string;
  amount: number;
  taxAmount: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  paymentStatus: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID';
}

export interface SalesQuotation {
  id: string;
  quotationNo: string;
  customerName: string;
  customerId: string;
  date: string;
  validUntil: string;
  productName: string;
  quantity: number;
  unit: ProductUnit;
  rate: number;
  discountPct: number;
  gstPct: number;
  deliveryTerms: string;
  totalAmount: number;
  status: 'SENT' | 'ACCEPTED' | 'CONVERTED' | 'EXPIRED';
}

export interface SalesInvoice {
  id: string;
  invoiceNumber: string;
  orderNumber?: string;
  customerName: string;
  customerId: string;
  customerGst?: string;
  invoiceDate: string;
  dueDate: string;
  items: {
    name: string;
    qty: number;
    unit: ProductUnit;
    rate: number;
    amount: number;
  }[];
  subtotal: number;
  gstTotal: number;
  roundOff: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentStatus: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE';
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  category: string;
  location: 'Quarry #1 Pit' | 'Crusher Plant Wayanad' | 'Calicut Central Yard' | 'Workshop Store' | 'Fuel Bowser Depot';
  unit: ProductUnit;
  openingStock: number;
  stockIn: number;
  stockOut: number;
  currentBalance: number;
  valuationRate: number;
  totalValuation: number;
  status: 'OPTIMAL' | 'LOW_STOCK' | 'SURPLUS';
}

export interface GatePassRecord {
  id: string;
  gatePassNo: string;
  passType: 'INCOMING' | 'OUTGOING';
  dateTime: string;
  location: string;
  partyName: string;
  partyType: 'CUSTOMER' | 'SUPPLIER';
  orderOrPoNo: string;
  materialName: string;
  quantity: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  loadNumber: string;
  destination: string;
  authorizedBy: string;
  qrCodeRef: string;
}

export interface StaffProfile {
  id: string;
  employeeId: string;
  name: string;
  phone: string;
  department: 'MINING' | 'CRUSHER' | 'FLEET' | 'COMMERCE' | 'FINANCE' | 'SECURITY';
  designation: string;
  role: string;
  joiningDate: string;
  salaryType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'HOURLY' | 'CONTRACT';
  salaryRate: number;
  workLocation: string;
  bankName: string;
  accountNo: string;
  ifsc: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'RESIGNED';
  activeAdvancesBalance: number;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  shift: 'DAY' | 'NIGHT';
  inTime: string;
  outTime: string;
  status: 'PRESENT' | 'ABSENT' | 'LEAVE' | 'HALF_DAY' | 'OVERTIME' | 'HOLIDAY';
  overtimeHours: number;
  remarks?: string;
}

export interface StaffAdvance {
  id: string;
  advanceNo: string;
  employeeId: string;
  employeeName: string;
  requestDate: string;
  amount: number;
  purpose: string;
  repaymentMethod: 'MONTHLY_SALARY_DEDUCTION' | 'CASH_SETTLEMENT' | 'TRIP_SETTLEMENT';
  installmentPerMonth: number;
  balanceRemaining: number;
  status: 'APPROVED' | 'DISBURSED' | 'REPAID' | 'PENDING';
}

export interface BattaAllowance {
  id: string;
  employeeId: string;
  employeeName: string;
  tripNo?: string;
  date: string;
  allowanceType: 'TRIP_BATTA' | 'FOOD_ALLOWANCE' | 'NIGHT_HALT' | 'OUTSTATION' | 'DAILY_ALLOWANCE' | 'OTHER';
  amount: number;
  approvalStatus: 'APPROVED' | 'PAID' | 'PENDING';
  remarks?: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountType: 'CURRENT' | 'ESCROW' | 'SAVINGS' | 'OVERDRAFT';
  ifsc: string;
  branch: string;
  openingBalance: number;
  currentBalance: number;
  status: 'ACTIVE' | 'DORMANT';
}

export interface OwnershipPartner {
  id: string;
  entityType: 'QUARRY' | 'CRUSHER' | 'VEHICLE' | 'BUSINESS_PROJECT';
  entityName: string;
  stakeholderName: string;
  relationship: 'PARTNER' | 'INVESTOR' | 'LAND_OWNER' | 'VEHICLE_OWNER';
  ownershipPct: number;
  investmentAmount: number;
  investmentPct: number;
  revenuePct: number;
  expensePct: number;
  profitPct: number;
  lossPct: number;
  fixedRoyaltyPerUnit?: number;
  royaltyUnit?: ProductUnit;
  unsettledAmount: number;
  settledYTD: number;
}

export interface VehicleTripAccount {
  id: string;
  tripNo: string;
  date: string;
  vehicleNumber: string;
  driverName: string;
  customerName: string;
  pickupLocation: string;
  destination: string;
  loadMaterial: string;
  quantityTons: number;
  freightRate: number;
  tripIncome: number;
  dieselExpense: number;
  tollExpense: number;
  driverBatta: number;
  loadingUnloadingCost: number;
  maintenanceReserve: number;
  otherExpenses: number;
  netTripProfit: number;
  ownerSettlementStatus: 'PENDING' | 'SETTLED';
}

export interface SettlementRecord {
  id: string;
  settlementNo: string;
  category: 'LAND_OWNER' | 'QUARRY_PARTNER' | 'CRUSHER_PARTNER' | 'VEHICLE_OWNER' | 'INVESTOR' | 'STAFF' | 'SUPPLIER';
  beneficiaryName: string;
  entityRef: string;
  period: string;
  totalGrossEligible: number;
  deductions: number;
  netPayable: number;
  status: 'DRAFT' | 'CALCULATED' | 'PENDING_APPROVAL' | 'APPROVED' | 'PAID' | 'PARTIALLY_PAID' | 'CANCELLED';
  paymentDate?: string;
  paymentMode?: string;
  bankRef?: string;
}
