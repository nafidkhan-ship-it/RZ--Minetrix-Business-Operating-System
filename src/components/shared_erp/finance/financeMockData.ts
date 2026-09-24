import {
  DebtorRecord,
  CreditorRecord,
  CashTransaction,
  BankAccountItem,
  BankTransactionItem,
  PayInVoucher,
  PayOutVoucher,
  ExpenseRecord,
  InvestmentPartnerRecord,
  PartnerSettlementItem,
  StaffSalaryItem,
  StaffAdvanceItem,
  TripAccountItem,
  VehicleOwnerItem,
  LandOwnerItem,
  LedgerEntry,
  BankReconciliationItem
} from './types';

// ==========================================
// 1. TOP 11 KPI METRICS
// ==========================================
export const FINANCE_KPI_SUMMARY = {
  cashBalance: 845200,
  bankBalance: 4280450,
  receivables: 3460000,
  payables: 1820000,
  customerAdvances: 450000,
  supplierAdvances: 210000,
  staffAdvances: 125000,
  partnerOwnerPayables: 680000,
  todayPayIn: 385000,
  todayPayOut: 142000,
  netCashFlow: 243000
};

// ==========================================
// 2. DEBTORS DATA
// ==========================================
export const MOCK_DEBTORS: DebtorRecord[] = [
  {
    id: 'DEBT-001',
    customerName: 'Sobha Developers Ltd',
    invoiceNo: 'INV-2026-081',
    invoiceDate: '2026-03-20',
    invoiceAmount: 240000,
    advance: 50000,
    paid: 100000,
    balance: 90000,
    dueDate: '2026-04-05',
    status: 'CURRENT',
    phone: '+91 98471 22334',
    location: 'Calicut Bypass Project'
  },
  {
    id: 'DEBT-002',
    customerName: 'Malabar Highway Infra Ltd',
    invoiceNo: 'INV-2026-074',
    invoiceDate: '2026-03-05',
    invoiceAmount: 850000,
    advance: 100000,
    paid: 300000,
    balance: 450000,
    dueDate: '2026-03-22',
    status: 'OVERDUE',
    phone: '+91 94471 88990',
    location: 'NH-66 Kasaragod Stretch'
  },
  {
    id: 'DEBT-003',
    customerName: 'Calicut Heritage Villas',
    invoiceNo: 'INV-2026-085',
    invoiceDate: '2026-03-23',
    invoiceAmount: 180000,
    advance: 30000,
    paid: 0,
    balance: 150000,
    dueDate: '2026-03-23',
    status: 'DUE',
    phone: '+91 98460 55441',
    location: 'Thamarassery Site'
  },
  {
    id: 'DEBT-004',
    customerName: 'Kalyan Precast Industries',
    invoiceNo: 'INV-2026-068',
    invoiceDate: '2026-02-28',
    invoiceAmount: 320000,
    advance: 50000,
    paid: 270000,
    balance: 0,
    dueDate: '2026-03-15',
    status: 'SETTLED',
    phone: '+91 97451 00221',
    location: 'Palakkad Industrial Yard'
  },
  {
    id: 'DEBT-005',
    customerName: 'Skyline Builders & Realtors',
    invoiceNo: 'INV-2026-089',
    invoiceDate: '2026-03-21',
    invoiceAmount: 520000,
    advance: 80000,
    paid: 140000,
    balance: 300000,
    dueDate: '2026-04-10',
    status: 'CURRENT',
    phone: '+91 98950 11992',
    location: 'Kannur Seaport Link'
  }
];

// ==========================================
// 3. CREDITORS DATA
// ==========================================
export const MOCK_CREDITORS: CreditorRecord[] = [
  {
    id: 'CRED-001',
    partyName: 'Bharat Petroleum Commercial Yard',
    category: 'Supplier',
    billNo: 'BILL-BP-9921',
    billDate: '2026-03-18',
    amount: 650000,
    advance: 100000,
    paid: 200000,
    balance: 350000,
    dueDate: '2026-04-02',
    status: 'APPROVED',
    contact: '+91 495 2720011'
  },
  {
    id: 'CRED-002',
    partyName: 'K. P. Moideenkutty (Quarry Land)',
    category: 'Land Owner',
    billNo: 'ROY-WND-024',
    billDate: '2026-03-15',
    amount: 185000,
    advance: 40000,
    paid: 45000,
    balance: 100000,
    dueDate: '2026-03-20',
    status: 'OVERDUE',
    contact: '+91 98470 12345'
  },
  {
    id: 'CRED-003',
    partyName: 'Sandvik Mining & Rock Tech',
    category: 'Service Provider',
    billNo: 'INV-SV-4401',
    billDate: '2026-03-10',
    amount: 220000,
    advance: 50000,
    paid: 170000,
    balance: 0,
    dueDate: '2026-03-25',
    status: 'PAID',
    contact: '+91 80 66991122'
  },
  {
    id: 'CRED-004',
    partyName: 'JK Tyre Commercial Fleet Hub',
    category: 'Supplier',
    billNo: 'BILL-JK-1022',
    billDate: '2026-03-19',
    amount: 145000,
    advance: 20000,
    paid: 0,
    balance: 125000,
    dueDate: '2026-04-04',
    status: 'PENDING',
    contact: '+91 98460 77112'
  },
  {
    id: 'CRED-005',
    partyName: 'Al-Haj R. Zain (Capital Draw)',
    category: 'Partner',
    billNo: 'SET-PRT-009',
    billDate: '2026-03-01',
    amount: 450000,
    advance: 0,
    paid: 200000,
    balance: 250000,
    dueDate: '2026-03-31',
    status: 'PARTIAL',
    contact: '+91 98470 00001'
  }
];

// ==========================================
// 4. CASH TRANSACTIONS DATA
// ==========================================
export const MOCK_CASH_TRANSACTIONS: CashTransaction[] = [
  {
    id: 'CSH-001',
    date: '2026-03-23 09:00',
    reference: 'OPN-2026-081',
    description: 'Opening Cash Register & Pit Drawer Float',
    type: 'CASH_IN',
    amount: 602200,
    user: 'Nafid Khan (Admin)',
    balance: 602200
  },
  {
    id: 'CSH-002',
    date: '2026-03-23 10:15',
    reference: 'RCT-WB-4102',
    description: 'Direct Cash Sale - 400 Dressed Stones (Sobha City Local)',
    type: 'CASH_IN',
    amount: 16800,
    user: 'Shameer (Weighbridge)',
    balance: 619000
  },
  {
    id: 'CSH-003',
    date: '2026-03-23 11:30',
    reference: 'PAY-BAT-089',
    description: 'Driver Trip Batta - Tipper KL-14-W-4491 to Calicut',
    type: 'CASH_OUT',
    amount: 2500,
    user: 'Haris K. (Fleet Desk)',
    balance: 616500
  },
  {
    id: 'CSH-004',
    date: '2026-03-23 13:45',
    reference: 'RCT-ADV-014',
    description: 'Customer Site Deposit Advance - Calicut Heritage',
    type: 'CASH_IN',
    amount: 30000,
    user: 'Nafid Khan (Admin)',
    balance: 646500
  },
  {
    id: 'CSH-005',
    date: '2026-03-23 15:00',
    reference: 'PAY-DSL-009',
    description: 'Pithead Generator Diesel Cash Refill (200L)',
    type: 'CASH_OUT',
    amount: 18400,
    user: 'M. K. Balaraman',
    balance: 628100
  },
  {
    id: 'CSH-006',
    date: '2026-03-23 17:30',
    reference: 'CLS-2026-081',
    description: 'Daily Evening Physical Reconciliation & Closing Balance',
    type: 'CLOSING',
    amount: 845200,
    user: 'Nafid Khan (Admin)',
    balance: 845200
  }
];

// ==========================================
// 5. BANK ACCOUNTS & TRANSACTIONS
// ==========================================
export const MOCK_BANKS: BankAccountItem[] = [
  {
    id: 'BNK-001',
    bankName: 'HDFC Bank',
    accountLabel: 'HDFC Operating Current A/C',
    accountNumber: '50200019283711',
    ifsc: 'HDFC0000182',
    branch: 'Calicut Main',
    openingBalance: 2450000,
    currentBalance: 2680450,
    todayIn: 320000,
    todayOut: 89550,
    type: 'CURRENT'
  },
  {
    id: 'BNK-002',
    bankName: 'State Bank of India',
    accountLabel: 'SBI Mining Escrow & Concession A/C',
    accountNumber: '30918239019',
    ifsc: 'SBIN0008621',
    branch: 'Kalpetta District Hub',
    openingBalance: 1200000,
    currentBalance: 1100000,
    todayIn: 0,
    todayOut: 100000,
    type: 'ESCROW'
  },
  {
    id: 'BNK-003',
    bankName: 'Federal Bank',
    accountLabel: 'Federal Bank Fleet & Fuel A/C',
    accountNumber: '1102910029381',
    ifsc: 'FDRL0001402',
    branch: 'Kasaragod Highway Hub',
    openingBalance: 480000,
    currentBalance: 500000,
    todayIn: 50000,
    todayOut: 30000,
    type: 'CURRENT'
  }
];

export const MOCK_BANK_TRANSACTIONS: BankTransactionItem[] = [
  {
    id: 'TXN-001',
    date: '2026-03-23 09:30',
    bankName: 'HDFC Bank',
    reference: 'CMS-NEFT-88912',
    description: 'NEFT Inward - Sobha Developers Ltd (Invoice #081)',
    type: 'CUSTOMER_PAYMENT',
    amount: 100000,
    balance: 2550000,
    reconciled: true
  },
  {
    id: 'TXN-002',
    date: '2026-03-23 11:00',
    bankName: 'HDFC Bank',
    reference: 'TRF-HDFC-SBI-01',
    description: 'Internal Treasury Transfer: HDFC to SBI Escrow Reserve',
    type: 'TRANSFER',
    isTransfer: true,
    fromAccount: 'HDFC Operating',
    toAccount: 'SBI Escrow',
    amount: 200000,
    balance: 2350000,
    reconciled: true
  },
  {
    id: 'TXN-003',
    date: '2026-03-23 11:00',
    bankName: 'State Bank of India',
    reference: 'TRF-HDFC-SBI-01',
    description: 'Internal Treasury Transfer: Received from HDFC Operating',
    type: 'TRANSFER',
    isTransfer: true,
    fromAccount: 'HDFC Operating',
    toAccount: 'SBI Escrow',
    amount: 200000,
    balance: 1300000,
    reconciled: true
  },
  {
    id: 'TXN-004',
    date: '2026-03-23 12:30',
    bankName: 'Federal Bank',
    reference: 'RTGS-BP-44910',
    description: 'RTGS Outward - Bharat Petroleum Fuel Depot Settlement',
    type: 'SUPPLIER_PAYMENT',
    amount: 120000,
    balance: 500000,
    reconciled: true
  },
  {
    id: 'TXN-005',
    date: '2026-03-23 14:15',
    bankName: 'HDFC Bank',
    reference: 'UPI-CR-22019',
    description: 'UPI Inward - Malabar Infra Booking Advance',
    type: 'CUSTOMER_PAYMENT',
    amount: 50000,
    balance: 2400000,
    reconciled: false
  },
  {
    id: 'TXN-006',
    date: '2026-03-23 16:00',
    bankName: 'HDFC Bank',
    reference: 'SAL-DISB-MAR01',
    description: 'Monthly Staff Salary Batch Disbursement (14 employees)',
    type: 'SALARY',
    amount: 320000,
    balance: 2080000,
    reconciled: true
  },
  {
    id: 'TXN-007',
    date: '2026-03-23 16:45',
    bankName: 'HDFC Bank',
    reference: 'EMI-VSI-CAT99',
    description: 'Crusher Plant Heavy Machinery Equipment Lease EMI',
    type: 'EMI',
    amount: 85000,
    balance: 1995000,
    reconciled: false
  }
];

// ==========================================
// 6. PAY-IN VOUCHERS
// ==========================================
export const MOCK_PAY_IN_VOUCHERS: PayInVoucher[] = [
  {
    id: 'PI-2026-001',
    voucherNo: 'PI-2026-001',
    date: '2026-03-23',
    party: 'Sobha Developers Ltd',
    source: 'Customer Payment',
    amount: 100000,
    paymentMode: 'NEFT/RTGS',
    account: 'HDFC Operating Current A/C',
    reference: 'UTR: CMS889129938',
    notes: 'Part clearance against Tax Invoice #INV-2026-081',
    attachmentName: 'bank_ack_sobha.pdf',
    status: 'VERIFIED'
  },
  {
    id: 'PI-2026-002',
    voucherNo: 'PI-2026-002',
    date: '2026-03-23',
    party: 'Calicut Heritage Villas',
    source: 'Customer Advance',
    amount: 30000,
    paymentMode: 'CASH',
    account: 'Pithead Main Cash Box',
    reference: 'REC-DEP-0081',
    notes: 'Booking advance for 1,200 Grade A Laterite stones',
    status: 'VERIFIED'
  },
  {
    id: 'PI-2026-003',
    voucherNo: 'PI-2026-003',
    date: '2026-03-22',
    party: 'Al-Haj R. Zain (Investor)',
    source: 'Partner Investment',
    amount: 250000,
    paymentMode: 'NEFT/RTGS',
    account: 'HDFC Operating Current A/C',
    reference: 'UTR: HDFC88219001',
    notes: 'Capital injection for new crusher screen installation',
    status: 'VERIFIED'
  },
  {
    id: 'PI-2026-004',
    voucherNo: 'PI-2026-004',
    date: '2026-03-21',
    party: 'Weighbridge Cash Window',
    source: 'Cash Receipt',
    amount: 45000,
    paymentMode: 'CASH',
    account: 'Pithead Main Cash Box',
    reference: 'WB-SHIFT-01',
    notes: 'Aggregated retail buyer stone and aggregate pickups',
    status: 'VERIFIED'
  }
];

// ==========================================
// 7. PAY-OUT VOUCHERS
// ==========================================
export const MOCK_PAY_OUT_VOUCHERS: PayOutVoucher[] = [
  {
    id: 'PO-2026-001',
    voucherNo: 'PO-2026-001',
    date: '2026-03-23',
    party: 'Bharat Petroleum Commercial',
    category: 'Supplier Payment',
    amount: 120000,
    paymentMode: 'NEFT/RTGS',
    account: 'Federal Bank Fleet & Fuel A/C',
    reference: 'RTGS-BP-44910',
    notes: 'Diesel bowser delivery #12 (4,000 Litres)',
    attachmentName: 'fuel_depot_receipt.pdf',
    status: 'PAID'
  },
  {
    id: 'PO-2026-002',
    voucherNo: 'PO-2026-002',
    date: '2026-03-23',
    party: 'K. P. Moideenkutty',
    category: 'Land Owner Payment',
    amount: 45000,
    paymentMode: 'NEFT/RTGS',
    account: 'State Bank of India',
    reference: 'NEFT-SBI-41102',
    notes: 'Fortnightly pithead concession extraction royalty',
    status: 'PAID'
  },
  {
    id: 'PO-2026-003',
    voucherNo: 'PO-2026-003',
    date: '2026-03-22',
    party: 'Tipper Drivers Pool',
    category: 'Vehicle Expense',
    amount: 14500,
    paymentMode: 'CASH',
    account: 'Pithead Main Cash Box',
    reference: 'BAT-DISB-W03',
    notes: 'Haulage driver food, toll & overnight allowances',
    status: 'APPROVED'
  },
  {
    id: 'PO-2026-004',
    voucherNo: 'PO-2026-004',
    date: '2026-03-20',
    party: 'Site Security & Watchmen',
    category: 'Staff Payment',
    amount: 18000,
    paymentMode: 'UPI',
    account: 'HDFC Operating Current A/C',
    reference: 'UPI-SEC-9912',
    notes: 'Emergency shift batta and night patrol overtime',
    status: 'PAID'
  }
];

// ==========================================
// 8. EXPENSES DATA (15 CATEGORIES)
// ==========================================
export const MOCK_EXPENSES: ExpenseRecord[] = [
  {
    id: 'EXP-001',
    voucherNo: 'EXP-2026-041',
    date: '2026-03-23',
    category: 'Fuel',
    amount: 42500,
    businessUnit: 'Quarry Pit #01',
    paidTo: 'BPCL Fuel Depot',
    paymentMode: 'NEFT',
    approvedBy: 'Nafid Khan',
    status: 'APPROVED',
    notes: '500L Diesel for Hitachi Excavator EX-200'
  },
  {
    id: 'EXP-002',
    voucherNo: 'EXP-2026-042',
    date: '2026-03-23',
    category: 'Batta',
    amount: 8500,
    businessUnit: 'Fleet Logistics Hub',
    paidTo: 'Tipper Drivers (4 trips)',
    paymentMode: 'CASH',
    approvedBy: 'Haris K.',
    status: 'APPROVED',
    notes: 'Driver long-haul batta & food allowances'
  },
  {
    id: 'EXP-003',
    voucherNo: 'EXP-2026-043',
    date: '2026-03-22',
    category: 'Maintenance',
    amount: 18400,
    businessUnit: 'Crusher Plant VSI',
    paidTo: 'Sandvik Spare Tech',
    paymentMode: 'UPI',
    approvedBy: 'Nafid Khan',
    status: 'APPROVED',
    notes: 'Jaw crusher toggle plate & bearing lubrication'
  },
  {
    id: 'EXP-004',
    voucherNo: 'EXP-2026-044',
    date: '2026-03-21',
    category: 'Electricity',
    amount: 36800,
    businessUnit: 'Crusher Plant VSI',
    paidTo: 'KSEB Industrial Division',
    paymentMode: 'NEFT',
    approvedBy: 'Nafid Khan',
    status: 'APPROVED',
    notes: 'Monthly High-Tension (HT) commercial power tariff'
  },
  {
    id: 'EXP-005',
    voucherNo: 'EXP-2026-045',
    date: '2026-03-20',
    category: 'Toll',
    amount: 4200,
    businessUnit: 'Fleet Logistics Hub',
    paidTo: 'NHAI FASTag Auto-Debit',
    paymentMode: 'BANK_AUTODEBIT',
    approvedBy: 'Auto Fastag System',
    status: 'APPROVED',
    notes: 'Kozhikode & Kasaragod toll plazas'
  },
  {
    id: 'EXP-006',
    voucherNo: 'EXP-2026-046',
    date: '2026-03-23',
    category: 'Office',
    amount: 3500,
    businessUnit: 'Central Admin',
    paidTo: 'Calicut Stationery Depot',
    paymentMode: 'CASH',
    status: 'PENDING',
    notes: 'Thermal receipt rolls (100 rolls) & printer ribbon'
  }
];

// ==========================================
// 9. INVESTMENTS & PARTNERS DATA
// ==========================================
export const MOCK_INVESTMENTS_PARTNERS: InvestmentPartnerRecord[] = [
  {
    id: 'INV-001',
    name: 'Al-Haj R. Zain',
    role: 'Partner',
    capitalInvestment: 4500000,
    additionalInvestment: 500000,
    capitalWithdrawal: 200000,
    netCapital: 4800000,
    ownershipPercent: 40.0,
    profitPercent: 35.0,
    lossPercent: 30.0,
    revenuePercent: 40.0,
    expensePercent: 40.0,
    effectiveDate: '2025-04-01',
    status: 'ACTIVE'
  },
  {
    id: 'INV-002',
    name: 'Nafid Khan (Managing Partner)',
    role: 'Partner',
    capitalInvestment: 3000000,
    additionalInvestment: 300000,
    capitalWithdrawal: 0,
    netCapital: 3300000,
    ownershipPercent: 30.0,
    profitPercent: 35.0,
    lossPercent: 40.0,
    revenuePercent: 30.0,
    expensePercent: 30.0,
    effectiveDate: '2025-04-01',
    status: 'ACTIVE'
  },
  {
    id: 'INV-003',
    name: 'Moideenkutty K. P.',
    role: 'Investor',
    capitalInvestment: 2500000,
    additionalInvestment: 0,
    capitalWithdrawal: 150000,
    netCapital: 2350000,
    ownershipPercent: 20.0,
    profitPercent: 20.0,
    lossPercent: 20.0,
    revenuePercent: 20.0,
    expensePercent: 20.0,
    effectiveDate: '2025-06-01',
    status: 'ACTIVE'
  },
  {
    id: 'INV-004',
    name: 'Malabar Syndicate Holding',
    role: 'Investor',
    capitalInvestment: 1500000,
    additionalInvestment: 0,
    capitalWithdrawal: 0,
    netCapital: 1500000,
    ownershipPercent: 10.0,
    profitPercent: 10.0,
    lossPercent: 10.0,
    revenuePercent: 10.0,
    expensePercent: 10.0,
    effectiveDate: '2025-09-01',
    status: 'ACTIVE'
  }
];

// ==========================================
// 10. PARTNER SETTLEMENTS DATA
// ==========================================
export const MOCK_PARTNER_SETTLEMENTS: PartnerSettlementItem[] = [
  {
    id: 'SET-2026-001',
    partnerName: 'Al-Haj R. Zain',
    businessUnit: 'Crusher Unit #01 Wayanad',
    period: 'Feb 2026 (Monthly)',
    grossAmount: 1850000,
    expenses: 920000,
    eligibleShare: 325500,
    adjustments: -25000,
    finalSettlement: 300500,
    status: 'PAID'
  },
  {
    id: 'SET-2026-002',
    partnerName: 'Nafid Khan',
    businessUnit: 'Unified Mining & Fleet Operations',
    period: 'Feb 2026 (Monthly)',
    grossAmount: 2400000,
    expenses: 1250000,
    eligibleShare: 402500,
    adjustments: 0,
    finalSettlement: 402500,
    status: 'APPROVED'
  },
  {
    id: 'SET-2026-003',
    partnerName: 'Moideenkutty K. P.',
    businessUnit: 'Quarry Pithead Concession A',
    period: 'Feb 2026 (Monthly)',
    grossAmount: 820000,
    expenses: 280000,
    eligibleShare: 108000,
    adjustments: -8000,
    finalSettlement: 100000,
    status: 'CALCULATED'
  },
  {
    id: 'SET-2026-004',
    partnerName: 'Malabar Syndicate Holding',
    businessUnit: 'Fleet Haulage Syndicate',
    period: 'Feb 2026 (Monthly)',
    grossAmount: 540000,
    expenses: 260000,
    eligibleShare: 28000,
    adjustments: 0,
    finalSettlement: 28000,
    status: 'PENDING'
  }
];

// ==========================================
// 11. STAFF SALARY PAYROLL DATA
// ==========================================
export const MOCK_STAFF_SALARIES: StaffSalaryItem[] = [
  {
    id: 'SAL-2026-001',
    employeeId: 'EMP-001',
    employeeName: 'Shamsuddeen K.',
    designation: 'Senior Tipper Heavy Driver',
    department: 'Logistics',
    attendanceDays: 26,
    workingDays: 26,
    basicSalary: 22000,
    overtime: 3500,
    batta: 4200,
    advanceDeduction: 5000,
    otherDeduction: 500,
    netSalary: 24200,
    status: 'PAID'
  },
  {
    id: 'SAL-2026-002',
    employeeId: 'EMP-002',
    employeeName: 'Ramesh Chandran',
    designation: 'Crusher Senior Plant Operator',
    department: 'Plant Operations',
    attendanceDays: 25,
    workingDays: 26,
    basicSalary: 28000,
    overtime: 4800,
    batta: 1500,
    advanceDeduction: 0,
    otherDeduction: 600,
    netSalary: 33700,
    status: 'APPROVED'
  },
  {
    id: 'SAL-2026-003',
    employeeId: 'EMP-003',
    employeeName: 'Bijumon V.',
    designation: 'Certified Rock Blaster',
    department: 'Mining Operations',
    attendanceDays: 24,
    workingDays: 26,
    basicSalary: 32000,
    overtime: 6000,
    batta: 2000,
    advanceDeduction: 10000,
    otherDeduction: 800,
    netSalary: 29200,
    status: 'CALCULATED'
  },
  {
    id: 'SAL-2026-004',
    employeeId: 'EMP-004',
    employeeName: 'Haris K.',
    designation: 'Weighbridge & Dispatch Supervisor',
    department: 'Commercial',
    attendanceDays: 26,
    workingDays: 26,
    basicSalary: 25000,
    overtime: 2500,
    batta: 1200,
    advanceDeduction: 2000,
    otherDeduction: 500,
    netSalary: 26200,
    status: 'PAID'
  }
];

// ==========================================
// 12. STAFF ADVANCE DATA
// ==========================================
export const MOCK_STAFF_ADVANCES: StaffAdvanceItem[] = [
  {
    id: 'ADV-001',
    staffName: 'Bijumon V.',
    employeeId: 'EMP-003',
    advanceDate: '2026-03-05',
    advanceAmount: 25000,
    recovered: 10000,
    balance: 15000,
    status: 'PARTIAL',
    reason: 'Family medical hospitalization emergency'
  },
  {
    id: 'ADV-002',
    staffName: 'Shamsuddeen K.',
    employeeId: 'EMP-001',
    advanceDate: '2026-03-10',
    advanceAmount: 10000,
    recovered: 5000,
    balance: 5000,
    status: 'PARTIAL',
    reason: 'Heavy driving commercial license renewal fees'
  },
  {
    id: 'ADV-003',
    staffName: 'Arun Varma',
    employeeId: 'EMP-005',
    advanceDate: '2026-03-15',
    advanceAmount: 8000,
    recovered: 0,
    balance: 8000,
    status: 'ACTIVE',
    reason: 'Home maintenance & children school books'
  },
  {
    id: 'ADV-004',
    staffName: 'Haris K.',
    employeeId: 'EMP-004',
    advanceDate: '2026-02-15',
    advanceAmount: 12000,
    recovered: 12000,
    balance: 0,
    status: 'RECOVERED',
    reason: 'Two-wheeler insurance & vehicle fitness'
  }
];

// ==========================================
// 13. TRIP ACCOUNTS DATA
// ==========================================
export const MOCK_TRIP_ACCOUNTS: TripAccountItem[] = [
  {
    id: 'TRIP-2026-081',
    tripNo: 'TRIP-2026-081',
    date: '2026-03-23',
    vehicleNo: 'KL-14-W-4491',
    driverName: 'Shamsuddeen K.',
    customerName: 'Sobha Developers Ltd',
    pickup: 'Kasaragod Pit #01',
    destination: 'Calicut Bypass NH-66',
    loadQty: '1,200 Laterite Blocks',
    rate: 42,
    tripIncome: 50400,
    fuelExpense: 14500,
    tollExpense: 1800,
    battaExpense: 2500,
    loadingExpense: 2400,
    unloadingExpense: 0,
    otherExpense: 800,
    netContribution: 28400,
    status: 'SETTLED'
  },
  {
    id: 'TRIP-2026-082',
    tripNo: 'TRIP-2026-082',
    date: '2026-03-23',
    vehicleNo: 'KL-11-BH-9921',
    driverName: 'Arun Varma',
    customerName: 'Malabar Highway Infra Ltd',
    pickup: 'Wayanad Crusher Plant',
    destination: 'Kozhikode City Site',
    loadQty: '25 MT 20mm Aggregate',
    rate: 1450,
    tripIncome: 36250,
    fuelExpense: 9800,
    tollExpense: 1200,
    battaExpense: 1800,
    loadingExpense: 1200,
    unloadingExpense: 0,
    otherExpense: 400,
    netContribution: 21850,
    status: 'COMPLETED'
  },
  {
    id: 'TRIP-2026-083',
    tripNo: 'TRIP-2026-083',
    date: '2026-03-22',
    vehicleNo: 'KL-60-A-1020',
    driverName: 'Nizamuddin M.',
    customerName: 'Calicut Heritage Villas',
    pickup: 'Kasaragod Pit #02',
    destination: 'Thamarassery Ghat Base',
    loadQty: '800 Dressed Corner Blocks',
    rate: 55,
    tripIncome: 44000,
    fuelExpense: 12200,
    tollExpense: 1400,
    battaExpense: 2200,
    loadingExpense: 1600,
    unloadingExpense: 0,
    otherExpense: 600,
    netContribution: 26000,
    status: 'SETTLED'
  }
];

// ==========================================
// 14. VEHICLE OWNER ACCOUNTS DATA
// ==========================================
export const MOCK_VEHICLE_OWNERS: VehicleOwnerItem[] = [
  {
    id: 'VEH-OWN-001',
    vehicleNo: 'KL-14-W-4491',
    vehicleModel: 'BharatBenz 2823C (10-Wheel Heavy Tipper)',
    owners: [
      {
        ownerName: 'M. K. Balaraman',
        ownershipPercent: 60,
        ownerShare: 42000,
        paid: 30000,
        balance: 12000
      },
      {
        ownerName: 'E. K. Hameed',
        ownershipPercent: 40,
        ownerShare: 28000,
        paid: 20000,
        balance: 8000
      }
    ],
    grossIncome: 148000,
    eligibleExpenses: 78000,
    netAmount: 70000,
    period: 'March 2026 (Current)',
    status: 'PARTIAL'
  },
  {
    id: 'VEH-OWN-002',
    vehicleNo: 'KL-11-BH-9921',
    vehicleModel: 'Tata Prima 3530.K (Multi-Axle)',
    owners: [
      {
        ownerName: 'K. Sukumaran',
        ownershipPercent: 100,
        ownerShare: 54000,
        paid: 54000,
        balance: 0
      }
    ],
    grossIncome: 112000,
    eligibleExpenses: 58000,
    netAmount: 54000,
    period: 'March 2026 (Current)',
    status: 'SETTLED'
  },
  {
    id: 'VEH-OWN-003',
    vehicleNo: 'KL-60-A-1020',
    vehicleModel: 'Ashok Leyland 2820 (Dumper Tipper)',
    owners: [
      {
        ownerName: 'R. K. Transport Logistics',
        ownershipPercent: 70,
        ownerShare: 45500,
        paid: 25000,
        balance: 20500
      },
      {
        ownerName: 'C. P. Varghese',
        ownershipPercent: 30,
        ownerShare: 19500,
        paid: 10000,
        balance: 9500
      }
    ],
    grossIncome: 135000,
    eligibleExpenses: 70000,
    netAmount: 65000,
    period: 'March 2026 (Current)',
    status: 'PENDING'
  }
];

// ==========================================
// 15. LAND OWNER ACCOUNTS DATA (4 MODELS)
// ==========================================
export const MOCK_LAND_OWNERS: LandOwnerItem[] = [
  {
    id: 'LAND-001',
    landOwnerName: 'K. P. Moideenkutty',
    parcel: 'Wayanad Mining Concession Plot A',
    surveyNo: 'Survey #142/3A & 142/3B',
    agreementType: 'Per-load payment',
    workingArea: '4.80 Acres Active Pit',
    loadCount: 420,
    ratePerLoad: 250,
    advance: 40000,
    payments: 45000,
    deductions: 5000,
    balance: 55000,
    status: 'ACTIVE'
  },
  {
    id: 'LAND-002',
    landOwnerName: 'M. Padmanabhan Nambiar',
    parcel: 'Kasaragod Pithead #01 Hillside',
    surveyNo: 'Survey #88/1',
    agreementType: 'Hybrid agreement',
    workingArea: '6.20 Acres Laterite Reserve',
    loadCount: 680,
    ratePerLoad: 220,
    advance: 60000,
    payments: 60000,
    deductions: 8000,
    balance: 21600,
    status: 'ACTIVE'
  },
  {
    id: 'LAND-003',
    landOwnerName: 'A. C. Chacko',
    parcel: 'Palakkad Aggregate Valley Ridge',
    surveyNo: 'Survey #219/5',
    agreementType: 'Fixed land purchase',
    workingArea: '12.00 Acres Mineral Freehold',
    loadCount: 1100,
    ratePerLoad: 0,
    advance: 500000,
    payments: 1500000,
    deductions: 0,
    balance: 0,
    status: 'CLOSED'
  },
  {
    id: 'LAND-004',
    landOwnerName: 'K. Radhakrishnan',
    parcel: 'Hosdurg Low-Lying Laterite Trench',
    surveyNo: 'Survey #49/2',
    agreementType: 'Mining & return',
    workingArea: '3.50 Acres (Graded Return Post-Quarry)',
    loadCount: 310,
    ratePerLoad: 180,
    advance: 25000,
    payments: 20000,
    deductions: 3000,
    balance: 7800,
    status: 'PENDING_SETTLEMENT'
  }
];

// ==========================================
// 16. GENERAL LEDGER ENTRIES
// ==========================================
export const MOCK_LEDGER_ENTRIES: LedgerEntry[] = [
  {
    id: 'LED-001',
    date: '2026-03-23',
    reference: 'INV-2026-081',
    account: 'Accounts Receivable (Debtors)',
    party: 'Sobha Developers Ltd',
    businessUnit: 'Kasaragod Pit #01',
    description: 'Sale of 1,200 Laterite Blocks (Grade A)',
    debit: 240000,
    credit: 0,
    balance: 240000,
    transactionType: 'SALE'
  },
  {
    id: 'LED-002',
    date: '2026-03-23',
    reference: 'PI-2026-001',
    account: 'HDFC Operating Current A/C',
    party: 'Sobha Developers Ltd',
    businessUnit: 'Treasury Hub',
    description: 'NEFT Part payment against Invoice #INV-2026-081',
    debit: 100000,
    credit: 0,
    balance: 2680450,
    transactionType: 'RECEIPT'
  },
  {
    id: 'LED-003',
    date: '2026-03-23',
    reference: 'BILL-BP-9921',
    account: 'Accounts Payable (Creditors)',
    party: 'Bharat Petroleum Commercial',
    businessUnit: 'Fleet Logistics Hub',
    description: 'Diesel bowser purchase bill (4,000 Litres)',
    debit: 0,
    credit: 650000,
    balance: -650000,
    transactionType: 'PURCHASE'
  },
  {
    id: 'LED-004',
    date: '2026-03-23',
    reference: 'PO-2026-001',
    account: 'Federal Bank Fleet & Fuel A/C',
    party: 'Bharat Petroleum Commercial',
    businessUnit: 'Treasury Hub',
    description: 'RTGS Supplier settlement against Bill #BILL-BP-9921',
    debit: 0,
    credit: 120000,
    balance: 500000,
    transactionType: 'PAYMENT'
  },
  {
    id: 'LED-005',
    date: '2026-03-22',
    reference: 'TRIP-2026-081',
    account: 'Freight & Transport Revenue',
    party: 'Shamsuddeen K.',
    businessUnit: 'Fleet Logistics Hub',
    description: 'Haulage freight revenue realization',
    debit: 0,
    credit: 50400,
    balance: 50400,
    transactionType: 'JOURNAL'
  },
  {
    id: 'LED-006',
    date: '2026-03-22',
    reference: 'ROY-WND-024',
    account: 'Land Concession Royalty Expense',
    party: 'K. P. Moideenkutty',
    businessUnit: 'Wayanad Concession',
    description: 'Accrued royalty for 420 extracted quarry loads',
    debit: 105000,
    credit: 0,
    balance: 105000,
    transactionType: 'JOURNAL'
  }
];

// ==========================================
// 17. BANK RECONCILIATION ITEMS
// ==========================================
export const MOCK_RECONCILIATION_ITEMS: BankReconciliationItem[] = [
  {
    id: 'REC-001',
    statementDate: '2026-03-23',
    statementRef: 'NEFT-INW-88912',
    description: 'Sobha Developers Ltd customer payment',
    statementAmount: 100000,
    systemRef: 'PI-2026-001',
    systemAmount: 100000,
    difference: 0,
    matched: true
  },
  {
    id: 'REC-002',
    statementDate: '2026-03-23',
    statementRef: 'RTGS-OUT-44910',
    description: 'Bharat Petroleum fuel payout',
    statementAmount: -120000,
    systemRef: 'PO-2026-001',
    systemAmount: -120000,
    difference: 0,
    matched: true
  },
  {
    id: 'REC-003',
    statementDate: '2026-03-23',
    statementRef: 'TRF-INT-8910',
    description: 'Internal treasury sweep to Escrow A/C',
    statementAmount: -200000,
    systemRef: 'TRF-HDFC-SBI-01',
    systemAmount: -200000,
    difference: 0,
    matched: true
  },
  {
    id: 'REC-004',
    statementDate: '2026-03-23',
    statementRef: 'BANK-CHG-TAX',
    description: 'Quarterly Ledger Folio & SMS Alert Charges',
    statementAmount: -850,
    systemRef: undefined,
    systemAmount: 0,
    difference: -850,
    matched: false
  },
  {
    id: 'REC-005',
    statementDate: '2026-03-22',
    statementRef: 'UPI-DIR-44921',
    description: 'Retail cash client direct bank counter deposit',
    statementAmount: 24500,
    systemRef: undefined,
    systemAmount: 0,
    difference: 24500,
    matched: false
  }
];

// ==========================================
// 18. FINANCIAL BI REPORTS CATALOGUE
// ==========================================
export const FINANCIAL_REPORTS_LIST = [
  { id: 'cash-flow', title: 'Cash Flow Statement', category: 'Treasury', description: 'Operating, investing & financing cash movement breakdown' },
  { id: 'receivables-aging', title: 'Receivables Aging Report', category: 'Debtors', description: '0-30, 31-60, 61-90 and 90+ days debtor balance analysis' },
  { id: 'payables-aging', title: 'Payables Aging Report', category: 'Creditors', description: 'Upcoming vendor liabilities, fuel bunk credit & partner draws' },
  { id: 'customer-ledger', title: 'Customer Ledger Statement', category: 'Ledger', description: 'Party-specific detailed invoice, debit, credit and balance log' },
  { id: 'supplier-ledger', title: 'Supplier Ledger Statement', category: 'Ledger', description: 'Vendor bills, part payments, debit notes and current balances' },
  { id: 'expense-report', title: 'Expense Analysis Report', category: 'Expenses', description: 'Fuel, batta, maintenance, power and administrative cost breakdown' },
  { id: 'partner-settlement', title: 'Partner Settlement Report', category: 'Settlements', description: 'Capital yield, equity ratios, profit distribution and drawings' },
  { id: 'staff-salary', title: 'Staff Salary & Payroll Summary', category: 'HR & Payroll', description: 'Basic wage, overtime, allowances, advance deductions & net pay' },
  { id: 'vehicle-trip-pnl', title: 'Vehicle Trip P&L Statement', category: 'Logistics', description: 'Freight revenue vs fuel, toll, batta and net per-trip margin' },
  { id: 'land-owner-statement', title: 'Land Owner Royalty Statement', category: 'Concessions', description: 'Load count, pithead royalty rate, deductions and net owner dues' },
  { id: 'business-unit-pnl', title: 'Business Unit P&L (Quarry vs Crusher)', category: 'P&L', description: 'Site-level gross revenue, direct extraction cost & EBITDA' },
  { id: 'profit-and-loss', title: 'Comprehensive Profit & Loss', category: 'Financial Statements', description: 'Audited monthly EBITDA, gross margin and net profit statement' },
  { id: 'balance-summary', title: 'Balance Sheet & Trial Balance', category: 'Financial Statements', description: 'Assets, liabilities, partner capital, liquidity and bank reserves' },
  { id: 'bank-book-report', title: 'Bank Book Reconciliation Report', category: 'Treasury', description: 'Multi-bank transaction register and unpresented voucher audit' }
];
