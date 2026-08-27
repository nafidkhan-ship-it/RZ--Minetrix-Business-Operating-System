export type FinanceAccountCategory = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
export type FinanceTransactionStatus = 'DRAFT' | 'POSTED' | 'CANCELLED';
export type FinanceInvoiceStatus = 'DRAFT' | 'ISSUED' | 'PARTIALLY_PAID' | 'PAID' | 'CANCELLED';
export type FinancePaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'CHEQUE' | 'UPI' | 'CARD' | 'OTHER';
export type FinanceExpenseStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'PAID';

export interface FinanceAccountRecord {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  category: FinanceAccountCategory;
  parentAccountId?: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinanceTransactionRecord {
  id: string;
  tenantId: string;
  transactionNumber: string;
  sourceModule: string;
  sourceRecordType: string;
  sourceRecordId: string;
  customerId?: string;
  orderId?: string;
  dispatchId?: string;
  settlementId?: string;
  transactionDate: string;
  amount: number;
  currency: string;
  status: FinanceTransactionStatus;
  description?: string;
  journalId?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinanceJournalRecord {
  id: string;
  tenantId: string;
  journalNumber: string;
  journalDate: string;
  description?: string;
  sourceTransactionId?: string;
  status: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  entries?: FinanceJournalEntryRecord[];
}

export interface FinanceJournalEntryRecord {
  id: string;
  tenantId: string;
  journalId: string;
  accountId: string;
  entryType: 'DEBIT' | 'CREDIT';
  amount: number;
  description?: string;
}

export interface FinanceInvoiceRecord {
  id: string;
  tenantId: string;
  invoiceNumber: string;
  customerId: string;
  orderId?: string;
  invoiceDate: string;
  dueDate: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  grandTotal: number;
  status: FinanceInvoiceStatus;
  notes?: string;
  financeTransactionId?: string;
  createdBy?: string;
  issuedAt?: string;
  createdAt: string;
  updatedAt: string;
  lines?: FinanceInvoiceLineRecord[];
  paidAmount?: number;
  outstandingAmount?: number;
}

export interface FinanceInvoiceLineRecord {
  id: string;
  tenantId: string;
  invoiceId: string;
  productId?: string;
  productSizeId?: string;
  description: string;
  quantity: number;
  quantityUom: string;
  unitPrice: number;
  lineSubtotal: number;
  taxPercent: number;
  taxAmount: number;
  lineTotal: number;
}

export interface FinancePaymentRecord {
  id: string;
  tenantId: string;
  paymentNumber: string;
  invoiceId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: FinancePaymentMethod;
  paymentReference?: string;
  status: string;
  notes?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinanceExpenseRecord {
  id: string;
  tenantId: string;
  expenseNumber: string;
  category: string;
  amount: number;
  expenseDate: string;
  vendorName?: string;
  reference?: string;
  attachmentRef?: string;
  approvalStatus: FinanceExpenseStatus;
  notes?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceLineInput {
  productId?: string;
  productSizeId?: string;
  description: string;
  quantity: number;
  quantityUom?: string;
  unitPrice: number;
  taxPercent?: number;
}

export function calculateInvoiceTotals(
  lines: InvoiceLineInput[],
  discountAmount = 0
): { subtotal: number; taxAmount: number; grandTotal: number; lineTotals: Array<{ lineSubtotal: number; taxAmount: number; lineTotal: number }> } {
  if (!lines.length) {
    throw new Error('Invoice requires at least one line item.');
  }
  const lineTotals: Array<{ lineSubtotal: number; taxAmount: number; lineTotal: number }> = [];
  let subtotal = 0;
  let taxAmount = 0;
  for (const line of lines) {
    const lineSubtotal = roundMoney(line.quantity * line.unitPrice);
    const tax = roundMoney(lineSubtotal * ((line.taxPercent || 0) / 100));
    const lineTotal = roundMoney(lineSubtotal + tax);
    lineTotals.push({ lineSubtotal, taxAmount: tax, lineTotal });
    subtotal += lineSubtotal;
    taxAmount += tax;
  }
  const grandTotal = roundMoney(subtotal + taxAmount - discountAmount);
  if (grandTotal < 0) {
    throw new Error('Invoice grand total cannot be negative.');
  }
  return { subtotal: roundMoney(subtotal), taxAmount: roundMoney(taxAmount), grandTotal, lineTotals };
}

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}
