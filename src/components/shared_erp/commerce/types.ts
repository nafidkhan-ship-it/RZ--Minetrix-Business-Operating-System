// Commerce & Trade Types for RZ® MINETRIX BOS Shared ERP Core

export type CommerceSubTab =
  | 'dashboard'
  | 'commerce-dashboard'
  | 'products'
  | 'categories'
  | 'units'
  | 'hsn-gst'
  | 'rates'
  | 'customers'
  | 'suppliers'
  | 'purchase-requests'
  | 'rfq'
  | 'purchase-orders'
  | 'grn'
  | 'purchase-bills'
  | 'purchase-returns'
  | 'quotations'
  | 'sales-orders'
  | 'delivery'
  | 'invoices'
  | 'payments'
  | 'sales-returns'
  | 'credit-debit-notes'
  | 'orders'
  | 'gate-pass'
  | 'customer-ledger'
  | 'supplier-ledger'
  | 'reports'
  | 'settings';

export type CommerceRole =
  | 'OWNER'
  | 'MANAGER'
  | 'ACCOUNTANT'
  | 'SALES'
  | 'PURCHASE'
  | 'STORE'
  | 'DISPATCH'
  | 'SUPERVISOR'
  | 'STAFF'
  | 'CUSTOMER'
  | 'SUPPLIER';

export type ProductRateType =
  | 'DEFAULT'
  | 'CUSTOMER_SPECIFIC'
  | 'SUPPLIER_SPECIFIC'
  | 'AGREEMENT'
  | 'QUANTITY_TIER'
  | 'LOCATION'
  | 'EFFECTIVE_DATE';

export interface CommerceRateEntry {
  id: string;
  rateType: ProductRateType;
  targetEntityName?: string;
  targetEntityId?: string;
  rate: number;
  unit: string;
  minQty?: number;
  maxQty?: number;
  location?: string;
  effectiveFrom: string;
  effectiveTo?: string;
  sourceLabel: string;
  status: 'ACTIVE' | 'EXPIRED' | 'UPCOMING';
  previousRate?: number;
  changeLog?: string;
}

export interface CommerceProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  subcategory: string;
  description: string;
  unit: string;
  hsnSac: string;
  gstRatePct: number;
  purchaseRate: number;
  salesRate: number;
  minRate: number;
  maxRate: number;
  customerRate?: number;
  supplierRate?: number;
  agreementRate?: number;
  stockTracking: boolean;
  currentStock: number;
  reorderLevel: number;
  batchTracking: boolean;
  serialTracking: boolean;
  isActive: boolean;
  primarySupplier?: string;
  sourceQuarry?: string;
  sourceCrusher?: string;
  imageUrl?: string;
  documentsCount: number;
  notes?: string;
  rates: CommerceRateEntry[];
}

export interface ProductCategory {
  id: string;
  name: string;
  subcategories: string[];
  productCount: number;
  activeCount: number;
  defaultUnit: string;
  defaultGstPct: number;
  status: 'ACTIVE' | 'ARCHIVED';
  description: string;
}

export interface MeasurementUnit {
  id: string;
  name: string;
  symbol: string;
  conversionFactor: number;
  baseUnit: string;
  decimalPrecision: number;
  isActive: boolean;
  category: 'MASS' | 'VOLUME' | 'COUNT' | 'DISTANCE' | 'TIME' | 'AREA';
}

export interface HsnGstRecord {
  id: string;
  hsnSac: string;
  description: string;
  category: string;
  gstPct: number;
  cgstPct: number;
  sgstPct: number;
  igstPct: number;
  effectiveDate: string;
  isActive: boolean;
}

export interface CustomerProfile {
  id: string;
  name: string;
  businessName: string;
  phone: string;
  email: string;
  address: string;
  gstin: string;
  state: string;
  district: string;
  customerType: 'ENTERPRISE' | 'RETAILER' | 'CONTRACTOR' | 'INDIVIDUAL';
  creditLimit: number;
  paymentTerms: string;
  openingBalance: number;
  salesHistoryCount: number;
  outstandingReceivable: number;
  advanceBalance: number;
  status: 'ACTIVE' | 'ON_HOLD' | 'BLOCKED';
  notes?: string;
  documents: string[];
}

export interface SupplierProfile {
  id: string;
  name: string;
  businessName: string;
  phone: string;
  email: string;
  address: string;
  gstin: string;
  state: string;
  district: string;
  supplierType: 'OEM_SPARES' | 'FUEL_DEPOT' | 'EXPLOSIVES' | 'LOGISTICS' | 'QUARRY_LESSOR';
  creditTerms: string;
  openingBalance: number;
  purchaseHistoryCount: number;
  outstandingPayable: number;
  advancePaid: number;
  status: 'ACTIVE' | 'ON_HOLD' | 'BLACKLISTED';
  notes?: string;
  documents: string[];
}

export interface PurchaseRequestItem {
  id: string;
  requestNumber: string;
  requestDate: string;
  requestedBy: string;
  department: string;
  branch: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  requiredDate: string;
  preferredSupplier: string;
  estimatedRate: number;
  estimatedAmount: number;
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
  approvalStatus: 'DRAFT' | 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'CONVERTED_TO_RFQ';
}

export interface RfqSupplierQuote {
  supplierId: string;
  supplierName: string;
  rate: number;
  taxPct: number;
  freight: number;
  deliveryTimeDays: number;
  paymentTerms: string;
  totalAmount: number;
  isSelected?: boolean;
}

export interface RfqRecord {
  id: string;
  rfqNumber: string;
  prNumber: string;
  productName: string;
  quantity: number;
  unit: string;
  dateCreated: string;
  closingDate: string;
  status: 'DRAFT' | 'SENT' | 'QUOTES_RECEIVED' | 'EVALUATED' | 'PO_ISSUED';
  quotes: RfqSupplierQuote[];
}

export interface PurchaseOrderItem {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  date: string;
  expectedDelivery: string;
  productName: string;
  quantity: number;
  unit: string;
  rate: number;
  discount: number;
  taxPct: number;
  freight: number;
  total: number;
  paymentTerms: string;
  deliveryLocation: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'SENT' | 'PARTIALLY_RECEIVED' | 'RECEIVED' | 'CLOSED' | 'CANCELLED';
  notes: string;
}

export interface GrnRecord {
  id: string;
  grnNumber: string;
  poNumber: string;
  supplierName: string;
  vehicleNumber: string;
  driverName: string;
  date: string;
  materialName: string;
  orderedQty: number;
  receivedQty: number;
  rejectedQty: number;
  acceptedQty: number;
  unit: string;
  batchNumber: string;
  qualityCheck: 'PASSED' | 'CONDITIONAL' | 'FAILED';
  remarks: string;
  receivedBy: string;
  stockUpdated: boolean;
}

export interface PurchaseBillRecord {
  id: string;
  billNumber: string;
  supplierName: string;
  grnNumber: string;
  poNumber: string;
  billDate: string;
  dueDate: string;
  taxableAmount: number;
  discount: number;
  gstAmount: number;
  otherCharges: number;
  roundOff: number;
  grandTotal: number;
  paymentTerms: string;
  paidAmount: number;
  balanceAmount: number;
  status: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE';
}

export interface PurchaseReturnRecord {
  id: string;
  returnNumber: string;
  billNumber: string;
  supplierName: string;
  productName: string;
  quantity: number;
  unit: string;
  reason: string;
  debitNoteNumber: string;
  amount: number;
  date: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'DISPATCHED' | 'ADJUSTED_IN_LEDGER';
}

export interface QuotationRecord {
  id: string;
  quotationNumber: string;
  customerName: string;
  date: string;
  validityDate: string;
  productName: string;
  quantity: number;
  unit: string;
  rate: number;
  discount: number;
  gstAmount: number;
  deliveryCharge: number;
  grandTotal: number;
  paymentTerms: string;
  notes: string;
  termsAndConditions: string;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'CONVERTED_TO_ORDER';
}

export interface SalesOrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  quotationNumber?: string;
  orderDate: string;
  deliveryDate: string;
  productName: string;
  quantity: number;
  unit: string;
  rate: number;
  discount: number;
  taxAmount: number;
  grandTotal: number;
  deliveryAddress: string;
  vehicleRequirement: string;
  paymentTerms: string;
  advanceAmount: number;
  balanceAmount: number;
  status: 'CONFIRMED' | 'PROCESSING' | 'READY_FOR_DISPATCH' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED';
}

export interface DeliveryRecord {
  id: string;
  deliveryNumber: string;
  salesOrderNumber: string;
  customerName: string;
  productName: string;
  quantity: number;
  unit: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  loadingLocation: string;
  destination: string;
  dispatchDate: string;
  expectedDelivery: string;
  actualDelivery?: string;
  gatePassNumber: string;
  proofOfDelivery: boolean;
  status: 'PENDING' | 'READY' | 'DISPATCHED' | 'IN_TRANSIT' | 'DELIVERED' | 'CUSTOMER_CONFIRMED' | 'COMPLETED';
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  customerName: string;
  orderNumber: string;
  date: string;
  dueDate: string;
  invoiceType: 'TAX_INVOICE' | 'CREDIT_INVOICE' | 'DEBIT_INVOICE' | 'ADVANCE_INVOICE' | 'FINAL_INVOICE';
  productName: string;
  quantity: number;
  unit: string;
  taxableValue: number;
  discount: number;
  gstAmount: number;
  roundOff: number;
  grandTotal: number;
  paidAmount: number;
  balanceAmount: number;
  paymentStatus: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE';
}

export interface PaymentRecord {
  id: string;
  paymentNumber: string;
  paymentType: 'CUSTOMER_PAYMENT' | 'CUSTOMER_ADVANCE' | 'SUPPLIER_PAYMENT' | 'SUPPLIER_ADVANCE' | 'REFUND' | 'ADJUSTMENT';
  relatedInvoiceOrBill: string;
  partyName: string;
  partyType: 'CUSTOMER' | 'SUPPLIER';
  amount: number;
  mode: 'CASH' | 'BANK' | 'UPI' | 'NEFT' | 'RTGS' | 'CHEQUE' | 'OTHER';
  referenceNo: string;
  date: string;
  bankAccount: string;
  status: 'COMPLETED' | 'PENDING_CLEARANCE' | 'FAILED';
  notes: string;
}

export interface SalesReturnRecord {
  id: string;
  returnNumber: string;
  invoiceNumber: string;
  customerName: string;
  productName: string;
  originalQty: number;
  returnedQty: number;
  unit: string;
  reason: string;
  condition: 'GOOD_RESTOCK' | 'DAMAGED_DISPOSAL' | 'DOWNGRADED';
  creditNoteNumber: string;
  creditAmount: number;
  date: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'RESTOCKED' | 'ADJUSTED_IN_LEDGER';
}

export interface CreditDebitNoteRecord {
  id: string;
  noteNumber: string;
  type: 'CREDIT_NOTE' | 'DEBIT_NOTE';
  originalDocNumber: string;
  partyName: string;
  partyType: 'CUSTOMER' | 'SUPPLIER';
  reason: string;
  taxableAmount: number;
  taxAmount: number;
  totalAmount: number;
  date: string;
  status: 'ISSUED' | 'APPLIED_TO_LEDGER' | 'CANCELLED';
}

export type PlatformSource =
  | 'DIRECT_ERP'
  | 'BUILDING_MATERIALS_ECOMMERCE'
  | 'QUARRY_MANAGEMENT'
  | 'CRUSHER_MANAGEMENT'
  | 'CONTRACT_JOB'
  | 'USED_MARKETPLACE';

export interface UnifiedOrderRecord {
  id: string;
  sourcePlatform: PlatformSource;
  customerName: string;
  productName: string;
  quantity: number;
  unit: string;
  amount: number;
  status: 'CONFIRMED' | 'IN_PRODUCTION' | 'DISPATCHING' | 'DELIVERED' | 'BILLED';
  vehicleNumber?: string;
  deliveryDate: string;
  paymentStatus: 'PAID' | 'PARTIAL' | 'UNPAID';
  createdDate: string;
}

export interface CommerceGatePass {
  id: string;
  gatePassNumber: string;
  dateTime: string;
  type: 'INCOMING' | 'OUTGOING';
  sourcePlatform: 'QUARRY' | 'CRUSHER' | 'DEPOT' | 'WORKSHOP';
  partyName: string;
  orderNumber: string;
  invoiceNumber?: string;
  productName: string;
  quantity: number;
  unit: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  loadNumber: string;
  destination: string;
  authorizedBy: string;
  qrPayload: string;
  status: 'ACTIVE' | 'CLEARED_GATE' | 'FLAGGED';
}

export interface LedgerEntry {
  id: string;
  date: string;
  docType: 'INVOICE' | 'BILL' | 'PAYMENT' | 'ADVANCE' | 'CREDIT_NOTE' | 'DEBIT_NOTE' | 'ADJUSTMENT';
  docNumber: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface CommerceReportDefinition {
  id: string;
  code: string;
  title: string;
  category: 'SALES' | 'PURCHASE' | 'RECEIVABLES' | 'PAYABLES' | 'TAXATION' | 'INVENTORY' | 'AUDIT';
  description: string;
  frequency: string;
}

export type CommerceLedgerEntry = LedgerEntry;
export type GatePassRecord = CommerceGatePass;
export type CommercePayment = PaymentRecord;
export type UnifiedCommerceOrder = UnifiedOrderRecord;
