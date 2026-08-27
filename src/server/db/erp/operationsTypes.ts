export type ProductionBatchStatus = 'DRAFT' | 'POSTED' | 'CANCELLED';
export type StockMovementType = 'STOCK_IN' | 'STOCK_OUT' | 'ADJUSTMENT';
export type GatePassStatus = 'DRAFT' | 'APPROVED' | 'ISSUED' | 'CANCELLED' | 'DISPATCHED';
export type DispatchStatus = 'POSTED' | 'CANCELLED';
export type SettlementBasis = 'PRODUCTION' | 'DISPATCH';
export type SettlementStatus = 'DRAFT' | 'POSTED' | 'CANCELLED';
export type LeadStatus = 'NEW' | 'QUALIFIED' | 'CONVERTED' | 'LOST';
export type OrderStatus = 'DRAFT' | 'CONFIRMED' | 'ALLOCATED' | 'DISPATCHED' | 'CANCELLED';

export interface ErpProductRecord {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  category: string;
  defaultUom: string;
  densityTonPerCft?: number;
  gstPercent: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ErpProductSizeRecord {
  id: string;
  tenantId: string;
  productId: string;
  sizeCode: string;
  sizeLabel: string;
  dimensions?: string;
  status: string;
}

export interface ErpProductPriceRecord {
  id: string;
  tenantId: string;
  productId: string;
  productSizeId?: string;
  quarryId?: string;
  unitPrice: number;
  currency: string;
  priceIncludesGst: boolean;
  effectiveFrom: string;
  effectiveTo?: string;
  status: string;
}

export interface ErpLandParcelRecord {
  id: string;
  tenantId: string;
  surveyNumber: string;
  villageTaluk?: string;
  acreage?: number;
  ownerName: string;
  status: string;
}

export interface ErpLeaseRecord {
  id: string;
  tenantId: string;
  landParcelId: string;
  quarryId?: string;
  leaseNumber: string;
  royaltyType: string;
  royaltyRate?: number;
  revenueSharePercent?: number;
  startDate: string;
  endDate: string;
  status: string;
}

export interface ErpCustomerRecord {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  destination?: string;
  phone?: string;
  email?: string;
  status: string;
}

export interface ErpCustomerContactRecord {
  id: string;
  tenantId: string;
  customerId: string;
  fullName: string;
  roleTitle?: string;
  phone?: string;
  email?: string;
  status: string;
}

export interface ErpLeadRecord {
  id: string;
  tenantId: string;
  code: string;
  companyName: string;
  contactName?: string;
  phone?: string;
  email?: string;
  source?: string;
  notes?: string;
  status: LeadStatus;
  convertedCustomerId?: string;
}

export interface ErpOrderLineInput {
  productId: string;
  productSizeId?: string;
  locationId?: string;
  quantity: number;
  quantityUom?: string;
  unitPrice: number;
}

export interface ErpOrderRecord {
  id: string;
  tenantId: string;
  orderNumber: string;
  customerId: string;
  quarryId: string;
  status: OrderStatus;
  currency: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  notes?: string;
  gatePassId?: string;
  lines?: Array<ErpOrderLineInput & { id: string; lineTotal: number }>;
  createdAt: string;
  updatedAt: string;
}

export interface ErpCustomerHistoryRecord {
  customer: ErpCustomerRecord;
  contacts: ErpCustomerContactRecord[];
  orders: ErpOrderRecord[];
  convertedFromLead?: ErpLeadRecord;
}

export interface ErpProductionLineInput {
  productId: string;
  productSizeId?: string;
  locationId?: string;
  quantity: number;
  quantityUom?: string;
  notes?: string;
}

export interface ErpProductionBatchRecord {
  id: string;
  tenantId: string;
  quarryId: string;
  batchNumber: string;
  productionDate: string;
  shiftName?: string;
  operatorUserId?: string;
  totalQuantity: number;
  quantityUom: string;
  status: ProductionBatchStatus;
  details?: Record<string, unknown>;
  lines?: Array<ErpProductionLineInput & { id: string }>;
  createdAt: string;
  updatedAt: string;
  postedAt?: string;
}

export interface ErpStockBalanceRecord {
  id: string;
  tenantId: string;
  quarryId: string;
  productId: string;
  productSizeId?: string;
  locationId?: string;
  quantity: number;
  quantityUom: string;
  version: number;
}

export interface ErpStockLedgerRecord {
  id: string;
  tenantId: string;
  quarryId: string;
  productId: string;
  productSizeId?: string;
  locationId?: string;
  movementType: StockMovementType;
  quantity: number;
  quantityUom: string;
  referenceType: string;
  referenceId: string;
  occurredAt: string;
}

export interface ErpGatePassRecord {
  id: string;
  tenantId: string;
  gatePassNumber: string;
  quarryId: string;
  customerId: string;
  vehicleNumber: string;
  driverName: string;
  vehicleId?: string;
  driverId?: string;
  orderId?: string;
  destination?: string;
  status: GatePassStatus;
  dispatchId?: string;
  lines?: Array<ErpProductionLineInput & { id: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface ErpDispatchRecord {
  id: string;
  tenantId: string;
  dispatchNumber: string;
  gatePassId: string;
  quarryId: string;
  customerId: string;
  vehicleNumber: string;
  driverName: string;
  destination?: string;
  status: DispatchStatus;
  dispatchedAt: string;
  lines?: Array<ErpProductionLineInput & { id: string }>;
}

export interface ErpSettlementRateRecord {
  id: string;
  tenantId: string;
  landParcelId: string;
  quarryId?: string;
  productId?: string;
  ratePerUom: number;
  quantityUom: string;
  effectiveFrom: string;
  effectiveTo?: string;
  status: string;
}

export interface ErpSettlementRecord {
  id: string;
  tenantId: string;
  settlementNumber: string;
  landParcelId: string;
  quarryId: string;
  basis: SettlementBasis;
  quantity: number;
  quantityUom: string;
  ratePerUom: number;
  grossAmount: number;
  deductions: number;
  netAmount: number;
  status: SettlementStatus;
  statementRef?: string;
  productionBatchId?: string;
  dispatchId?: string;
}

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calculateSettlementAmounts(quantity: number, ratePerUom: number, deductions: number = 0): {
  grossAmount: number;
  netAmount: number;
} {
  if (quantity <= 0) {
    throw new Error('Quantity must be greater than zero.');
  }
  if (ratePerUom < 0) {
    throw new Error('Rate must be non-negative.');
  }
  if (deductions < 0) {
    throw new Error('Deductions must be non-negative.');
  }
  const grossAmount = roundMoney(quantity * ratePerUom);
  const netAmount = roundMoney(grossAmount - deductions);
  if (netAmount < 0) {
    throw new Error('Net settlement cannot be negative.');
  }
  return { grossAmount, netAmount };
}
