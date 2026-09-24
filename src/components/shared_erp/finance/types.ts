export type FinanceSectionTab =
  | 'finance-dashboard'
  | 'debtors'
  | 'creditors'
  | 'cash'
  | 'banks'
  | 'pay-in'
  | 'pay-out'
  | 'expenses'
  | 'investments'
  | 'settlements'
  | 'payroll'
  | 'staff-advances'
  | 'trips'
  | 'vehicle-owners'
  | 'land-owners'
  | 'ledgers'
  | 'reconciliation'
  | 'reports';

export interface DebtorRecord {
  id: string;
  customerName: string;
  invoiceNo: string;
  invoiceDate: string;
  invoiceAmount: number;
  advance: number;
  paid: number;
  balance: number;
  dueDate: string;
  status: 'CURRENT' | 'DUE' | 'OVERDUE' | 'SETTLED';
  phone: string;
  location: string;
}

export interface CreditorRecord {
  id: string;
  partyName: string;
  category: 'Supplier' | 'Land Owner' | 'Service Provider' | 'Partner' | 'Other';
  billNo: string;
  billDate: string;
  amount: number;
  advance: number;
  paid: number;
  balance: number;
  dueDate: string;
  status: 'PENDING' | 'APPROVED' | 'PARTIAL' | 'PAID' | 'OVERDUE';
  contact: string;
}

export interface CashTransaction {
  id: string;
  date: string;
  reference: string;
  description: string;
  type: 'CASH_IN' | 'CASH_OUT' | 'ADJUSTMENT' | 'CLOSING';
  amount: number;
  user: string;
  balance: number;
}

export interface BankAccountItem {
  id: string;
  bankName: string;
  accountLabel: string;
  accountNumber: string;
  ifsc: string;
  branch: string;
  openingBalance: number;
  currentBalance: number;
  todayIn: number;
  todayOut: number;
  type: 'CURRENT' | 'OVERDRAFT' | 'ESCROW';
}

export interface BankTransactionItem {
  id: string;
  date: string;
  bankName: string;
  reference: string;
  description: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'CUSTOMER_PAYMENT' | 'SUPPLIER_PAYMENT' | 'SALARY' | 'EMI' | 'BANK_CHARGE' | 'TRANSFER';
  isTransfer?: boolean;
  fromAccount?: string;
  toAccount?: string;
  amount: number;
  balance: number;
  reconciled: boolean;
}

export interface PayInVoucher {
  id: string;
  voucherNo: string;
  date: string;
  party: string;
  source: 'Customer Payment' | 'Customer Advance' | 'Cash Receipt' | 'Bank Receipt' | 'Other Income' | 'Partner Investment';
  amount: number;
  paymentMode: 'CASH' | 'NEFT/RTGS' | 'UPI' | 'CHEQUE';
  account: string;
  reference: string;
  notes: string;
  attachmentName?: string;
  status: 'VERIFIED' | 'PENDING';
}

export interface PayOutVoucher {
  id: string;
  voucherNo: string;
  date: string;
  party: string;
  category: 'Supplier Payment' | 'Land Owner Payment' | 'Partner Payment' | 'Staff Payment' | 'Vehicle Expense' | 'Salary' | 'Purchase' | 'Expense' | 'EMI' | 'Other';
  amount: number;
  paymentMode: 'CASH' | 'NEFT/RTGS' | 'UPI' | 'CHEQUE';
  account: string;
  reference: string;
  notes: string;
  attachmentName?: string;
  status: 'APPROVED' | 'PAID' | 'PENDING_APPROVAL';
}

export interface ExpenseRecord {
  id: string;
  voucherNo: string;
  date: string;
  category: 'Fuel' | 'Maintenance' | 'Salary' | 'Batta' | 'Rent' | 'Electricity' | 'Transport' | 'Loading' | 'Unloading' | 'Toll' | 'Office' | 'Marketing' | 'Professional Fees' | 'Repairs' | 'Other';
  amount: number;
  businessUnit: string;
  paidTo: string;
  paymentMode: string;
  approvedBy?: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  notes: string;
}

export interface InvestmentPartnerRecord {
  id: string;
  name: string;
  role: 'Investor' | 'Partner';
  capitalInvestment: number;
  additionalInvestment: number;
  capitalWithdrawal: number;
  netCapital: number;
  ownershipPercent: number;
  profitPercent: number;
  lossPercent: number;
  revenuePercent: number;
  expensePercent: number;
  effectiveDate: string;
  status: 'ACTIVE' | 'RESTRICTED';
}

export interface PartnerSettlementItem {
  id: string;
  partnerName: string;
  businessUnit: string;
  period: string;
  grossAmount: number;
  expenses: number;
  eligibleShare: number;
  adjustments: number;
  finalSettlement: number;
  status: 'PENDING' | 'CALCULATED' | 'APPROVED' | 'PAID' | 'DISPUTED';
}

export interface StaffSalaryItem {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  attendanceDays: number;
  workingDays: number;
  basicSalary: number;
  overtime: number;
  batta: number;
  advanceDeduction: number;
  otherDeduction: number;
  netSalary: number;
  status: 'CALCULATED' | 'APPROVED' | 'PAID' | 'PENDING';
}

export interface StaffAdvanceItem {
  id: string;
  staffName: string;
  employeeId: string;
  advanceDate: string;
  advanceAmount: number;
  recovered: number;
  balance: number;
  status: 'ACTIVE' | 'PARTIAL' | 'RECOVERED';
  reason: string;
}

export interface TripAccountItem {
  id: string;
  tripNo: string;
  date: string;
  vehicleNo: string;
  driverName: string;
  customerName: string;
  pickup: string;
  destination: string;
  loadQty: string;
  rate: number;
  tripIncome: number;
  fuelExpense: number;
  tollExpense: number;
  battaExpense: number;
  loadingExpense: number;
  unloadingExpense: number;
  otherExpense: number;
  netContribution: number;
  status: 'COMPLETED' | 'SETTLED' | 'IN_TRANSIT';
}

export interface VehicleOwnerItem {
  id: string;
  vehicleNo: string;
  vehicleModel: string;
  owners: {
    ownerName: string;
    ownershipPercent: number;
    ownerShare: number;
    paid: number;
    balance: number;
  }[];
  grossIncome: number;
  eligibleExpenses: number;
  netAmount: number;
  period: string;
  status: 'SETTLED' | 'PENDING' | 'PARTIAL';
}

export interface LandOwnerItem {
  id: string;
  landOwnerName: string;
  parcel: string;
  surveyNo: string;
  agreementType: 'Fixed land purchase' | 'Mining & return' | 'Per-load payment' | 'Hybrid agreement';
  workingArea: string;
  loadCount: number;
  ratePerLoad: number;
  advance: number;
  payments: number;
  deductions: number;
  balance: number;
  status: 'ACTIVE' | 'PENDING_SETTLEMENT' | 'CLOSED';
}

export interface LedgerEntry {
  id: string;
  date: string;
  reference: string;
  account: string;
  party: string;
  businessUnit: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  transactionType: 'SALE' | 'PURCHASE' | 'RECEIPT' | 'PAYMENT' | 'JOURNAL' | 'CONTRA';
}

export interface BankReconciliationItem {
  id: string;
  statementDate: string;
  statementRef: string;
  description: string;
  statementAmount: number;
  systemRef?: string;
  systemAmount?: number;
  difference: number;
  matched: boolean;
}
