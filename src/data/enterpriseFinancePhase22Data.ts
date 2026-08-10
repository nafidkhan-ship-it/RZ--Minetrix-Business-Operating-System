// RZ® Minetrix BOS - Phase 22 Enterprise Finance, Accounts, Treasury & Business Intelligence Data

export interface ChartOfAccountItem {
  id: string;
  accountCode: string;
  accountName: string;
  groupType: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  subGroup: string;
  costCenter: string;
  profitCenter: string;
  branch: string;
  businessUnit: 'Mining' | 'Crusher' | 'Fleet' | 'Building Materials' | 'Equipment Rental' | 'Construction' | 'Marketplace' | 'HQ';
  currentBalanceRs: number;
  balanceType: 'Dr' | 'Cr';
  isActive: boolean;
}

export interface GeneralLedgerVoucher {
  id: string;
  voucherNumber: string;
  voucherDate: string;
  voucherType: 'Journal' | 'Payment' | 'Receipt' | 'Sales' | 'Purchase' | 'Contra' | 'Debit Note' | 'Credit Note';
  refNumber: string;
  narration: string;
  debitAccount: string;
  creditAccount: string;
  amountRs: number;
  status: 'Approved' | 'Pending Approval' | 'Draft' | 'Posted';
  approvedBy: string;
  costCenter: string;
  businessUnit: string;
}

export interface AccountsReceivableInvoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerCode: string;
  businessType: 'Mining Buyer' | 'Crusher Dealer' | 'Construction Client' | 'Marketplace Buyer';
  invoiceDate: string;
  dueDate: string;
  totalAmountRs: number;
  paidAmountRs: number;
  outstandingBalanceRs: number;
  ageingDays: number;
  ageingCategory: '0-30 Days' | '31-60 Days' | '61-90 Days' | '90+ Days Overdue';
  status: 'Paid' | 'Partially Paid' | 'Overdue' | 'Reminder Sent';
  interestApplicablePercent: number;
  reminderStatus: 'Automated SMS Sent' | 'WhatsApp Sent' | 'Escalated to Legal' | 'Pending';
}

export interface AccountsPayableVendor {
  id: string;
  billNumber: string;
  vendorName: string;
  vendorCode: string;
  vendorCategory: 'Explosives Supplier' | 'Diesel Vendor' | 'Machinery OEM' | 'Spare Parts Supplier' | 'Haulage Operator';
  billDate: string;
  dueDate: string;
  totalBillRs: number;
  paidRs: number;
  outstandingRs: number;
  ageingDays: number;
  approvalStatus: 'Approved for Payment' | 'Pending Manager Approval' | 'On Hold (QC Check)';
  paymentScheduleDate: string;
}

export interface TreasuryAccount {
  id: string;
  accountCode: string;
  bankName: string;
  accountNumber: string;
  accountType: 'Current' | 'Overdraft' | 'Cash Credit' | 'Petty Cash' | 'Escrow Vault';
  branchLocation: string;
  closingBalanceRs: number;
  unreconciledItemsCount: number;
  lastBrsDate: string;
  cashFlowTodayRs: number;
  chequePencilBookingsCount: number;
}

export interface GstTaxRecord {
  id: string;
  period: string; // e.g. 'July 2026'
  gstin: string;
  hsnCode: string;
  taxableTurnoverRs: number;
  cgstRs: number;
  sgstRs: number;
  igstRs: number;
  tdsDeductedRs: number;
  tcsCollectedRs: number;
  gstr1Status: 'Filed' | 'Pending Audit' | 'Draft';
  gstr3bStatus: 'Filed' | 'Pending Audit' | 'Draft';
  taxAuditStatus: 'Verified' | 'Flagged Discrepancy';
}

export interface FixedAssetItem {
  id: string;
  assetCode: string;
  assetName: string;
  category: 'Excavators & Dumpers' | 'Crusher Plant Equipment' | 'Transit Mixers' | 'Quarry Land & Structures' | 'IT & Office Infrastructure';
  purchaseDate: string;
  originalValueRs: number;
  depreciationMethod: 'SLM (Straight Line)' | 'WDV (Written Down Value)';
  depreciationRatePercent: number;
  accumulatedDepreciationRs: number;
  currentBookValueRs: number;
  qrAssetCode: string;
  locationBranch: string;
  status: 'In Active Use' | 'Under Maintenance' | 'Scheduled for Disposal';
}

export interface PartnerInvestorLedger {
  id: string;
  partnerCode: string;
  partnerName: string;
  equitySharePercent: number;
  capitalContributionRs: number;
  drawingsYtdRs: number;
  profitShareAllocatedRs: number;
  dividendPaidRs: number;
  netInvestmentBalanceRs: number;
  settlementStatus: 'Settled FY26' | 'Pending Dividend Payout';
}

export interface ProjectAccountRecord {
  id: string;
  projectCode: string;
  projectName: string;
  clientName: string;
  totalBoqBudgetRs: number;
  actualExpensesRs: number;
  billedRevenueRs: number;
  projectProfitRs: number;
  marginPercent: number;
  costOverrunRisk: 'Low (Within Budget)' | 'Medium (Approach Threshold)' | 'High (Budget Overrun)';
  status: 'In Progress' | 'Completed & Audited';
}

export interface PaymentTransactionRecord {
  id: string;
  txnId: string;
  timestamp: string;
  payerName: string;
  payeeName: string;
  mode: 'UPI' | 'NEFT' | 'RTGS' | 'Cheque' | 'Cash' | 'Customer Wallet' | 'Dealer Wallet' | 'Supplier Wallet';
  amountRs: number;
  paymentType: 'Advance Payment' | 'Invoice Settlement' | 'Wallet Topup' | 'Security Deposit';
  status: 'Instant Success' | 'Pending Clearance' | 'Wallet Escrow Hold';
  gatewayRef: string;
}

export interface PayrollAccountingRecord {
  id: string;
  monthPeriod: string;
  employeeCategory: 'Executive Staff' | 'Quarry Workers' | 'Crusher Operators' | 'Fleet Drivers' | 'Contract Labour';
  totalHeadcount: number;
  grossSalaryRs: number;
  pfDeductionRs: number;
  esiDeductionRs: number;
  advanceRecoveredRs: number;
  netPayableRs: number;
  postingStatus: 'Journal Posted to GL' | 'Pending Disbursement';
}

export interface MiningAccountingMetrics {
  id: string;
  mineLocation: string;
  royaltyPaidRs: number;
  landownerSettlementRs: number;
  dieselExpenseRs: number;
  explosiveCostRs: number;
  productionCostPerTonRs: number;
  crusherCostPerTonRs: number;
  machineCostPerHourRs: number;
  totalMiningCostYtdRs: number;
}

export interface FleetAccountingRecord {
  id: string;
  fleetGroup: string;
  tripRevenueRs: number;
  tripCostRs: number;
  fuelCostRs: number;
  maintenanceCostRs: number;
  vehicleOwnerSettlementRs: number;
  driverIncentiveRs: number;
  netFleetProfitRs: number;
  profitMarginPercent: number;
}

export interface BuildingMaterialsAccountingRecord {
  id: string;
  materialCategory: string;
  purchaseCostRs: number;
  salesRevenueRs: number;
  inventoryValuationRs: number;
  dealerIncentivesPaidRs: number;
  supplierSettlementRs: number;
  grossMarginPercent: number;
}

export interface MarketplaceAccountingRecord {
  id: string;
  period: string;
  marketplaceCommissionRs: number;
  subscriptionRevenueRs: number;
  adBannerRevenueRs: number;
  escrowVolumeProcessedRs: number;
  netMarketplaceRevenueRs: number;
  payoutStatus: 'Settled to Vendors' | 'In Escrow';
}

export interface FinancialReportingSummary {
  trialBalanceDrRs: number;
  trialBalanceCrRs: number;
  ytdRevenueRs: number;
  ytdExpensesRs: number;
  netProfitRs: number;
  netProfitMarginPercent: number;
  totalAssetsRs: number;
  totalLiabilitiesRs: number;
  workingCapitalRs: number;
  operatingCashFlowRs: number;
}

export interface AIFinanceInsights {
  id: string;
  insightType: 'Cash Flow Forecast' | 'Profit Prediction' | 'Cost Optimization' | 'Fraud Detection' | 'Health Score' | 'Working Capital' | 'Budget Recommendation';
  title: string;
  description: string;
  aiConfidencePercent: number;
  suggestedAction: string;
  impactValueRs: number;
  severity: 'Critical' | 'Optimization Opportunity' | 'Healthy';
}

export interface BusinessIntelligenceMetrics {
  executiveKpi: {
    monthlyRecurringRevenueRs: number;
    ebitdaRs: number;
    ebitdaMarginPercent: number;
    quickRatio: number;
    debtToEquityRatio: number;
    cashRunwayMonths: number;
  };
  revenueByUnit: {
    unit: string;
    revenueRs: number;
    percentage: number;
  }[];
  expenseBreakdown: {
    category: string;
    costRs: number;
    percentage: number;
  }[];
}

export interface ComplianceAuditRecord {
  id: string;
  auditId: string;
  moduleName: string;
  actionPerformed: string;
  performedBy: string;
  timestamp: string;
  ipAddress: string;
  complianceCategory: 'Statutory GST' | 'Internal Controls' | 'Tax Audit' | 'Document Archive' | 'Approval Limits';
  verificationStatus: 'Compliant & Verified' | 'Needs Review';
}

export interface EcosystemFinanceIntegration {
  id: string;
  systemConnected: 'Mining Operations' | 'Fleet & Logistics' | 'Building Materials' | 'Enterprise CRM' | 'B2B Marketplace' | 'HRMS & Payroll' | 'AI Copilot' | 'Notification Hub';
  syncStatus: 'Real-Time Synchronized' | 'Queue Active';
  dailyTransferredVolumeRs: number;
  recordsSyncedToday: number;
  lastSyncTimestamp: string;
}

// MOCK DATASETS

export const MOCK_CHART_OF_ACCOUNTS: ChartOfAccountItem[] = [
  {
    id: 'coa-101',
    accountCode: '10010',
    accountName: 'State Bank of India - Main Current A/c',
    groupType: 'Asset',
    subGroup: 'Bank Accounts',
    costCenter: 'HQ Finance',
    profitCenter: 'Treasury',
    branch: 'Udaipur HQ',
    businessUnit: 'HQ',
    currentBalanceRs: 48500000,
    balanceType: 'Dr',
    isActive: true
  },
  {
    id: 'coa-102',
    accountCode: '12010',
    accountName: 'Trade Receivables - Mining & Quarries',
    groupType: 'Asset',
    subGroup: 'Accounts Receivable',
    costCenter: 'Sales Control',
    profitCenter: 'Mining Division',
    branch: 'Bhilwara Mine-01',
    businessUnit: 'Mining',
    currentBalanceRs: 34200000,
    balanceType: 'Dr',
    isActive: true
  },
  {
    id: 'coa-103',
    accountCode: '14010',
    accountName: 'Heavy Equipment & Mining Machinery',
    groupType: 'Asset',
    subGroup: 'Fixed Assets',
    costCenter: 'Asset Mgmt',
    profitCenter: 'Mining Division',
    branch: 'Bhilwara Mine-01',
    businessUnit: 'Mining',
    currentBalanceRs: 125000000,
    balanceType: 'Dr',
    isActive: true
  },
  {
    id: 'coa-104',
    accountCode: '20010',
    accountName: 'Trade Payables - Diesel & Explosive Suppliers',
    groupType: 'Liability',
    subGroup: 'Accounts Payable',
    costCenter: 'Procurement',
    profitCenter: 'Crusher Division',
    branch: 'Rajsamand Plant',
    businessUnit: 'Crusher',
    currentBalanceRs: 18400000,
    balanceType: 'Cr',
    isActive: true
  },
  {
    id: 'coa-105',
    accountCode: '22010',
    accountName: 'GST Payable (CGST + SGST + IGST)',
    groupType: 'Liability',
    subGroup: 'Statutory Dues',
    costCenter: 'Taxation Cell',
    profitCenter: 'HQ Central',
    branch: 'Udaipur HQ',
    businessUnit: 'HQ',
    currentBalanceRs: 6450000,
    balanceType: 'Cr',
    isActive: true
  },
  {
    id: 'coa-106',
    accountCode: '30010',
    accountName: 'Shareholders Equity & Retained Earnings',
    groupType: 'Equity',
    subGroup: 'Capital Reserves',
    costCenter: 'Board',
    profitCenter: 'HQ Central',
    branch: 'Udaipur HQ',
    businessUnit: 'HQ',
    currentBalanceRs: 145000000,
    balanceType: 'Cr',
    isActive: true
  },
  {
    id: 'coa-107',
    accountCode: '40010',
    accountName: 'Revenue from Aggregate & M-Sand Sales',
    groupType: 'Revenue',
    subGroup: 'Operating Revenue',
    costCenter: 'Commercial',
    profitCenter: 'Crusher Division',
    branch: 'Rajsamand Plant',
    businessUnit: 'Crusher',
    currentBalanceRs: 89500000,
    balanceType: 'Cr',
    isActive: true
  },
  {
    id: 'coa-108',
    accountCode: '50010',
    accountName: 'Diesel & Fuel Operating Expense',
    groupType: 'Expense',
    subGroup: 'Direct Fuel Costs',
    costCenter: 'Fuel Control',
    profitCenter: 'Fleet Division',
    branch: 'Chittorgarh Depot',
    businessUnit: 'Fleet',
    currentBalanceRs: 21800000,
    balanceType: 'Dr',
    isActive: true
  }
];

export const MOCK_GENERAL_LEDGER: GeneralLedgerVoucher[] = [
  {
    id: 'gl-1001',
    voucherNumber: 'JV-2026-0801',
    voucherDate: '2026-08-01',
    voucherType: 'Journal',
    refNumber: 'MIN-ROYALTY-781',
    narration: 'Provision for Mining Royalty & DMF Cesses to Department of Mines for July 2026',
    debitAccount: 'Royalty & Mining Cess Expense (50020)',
    creditAccount: 'Royalty Payable State Govt (22030)',
    amountRs: 4850000,
    status: 'Approved',
    approvedBy: 'Financial Controller (CA Rajat Mehta)',
    costCenter: 'Compliance',
    businessUnit: 'Mining'
  },
  {
    id: 'gl-1002',
    voucherNumber: 'PV-2026-0802',
    voucherDate: '2026-08-02',
    voucherType: 'Payment',
    refNumber: 'INV-DIESEL-994',
    narration: 'Bulk Diesel fuel payment to Indian Oil Corporation Ltd Chittorgarh Depot',
    debitAccount: 'Trade Payables - Fuel (20010)',
    creditAccount: 'State Bank of India - Main (10010)',
    amountRs: 3200000,
    status: 'Posted',
    approvedBy: 'Treasury Head (Suresh Sharma)',
    costCenter: 'Fuel Control',
    businessUnit: 'Fleet'
  },
  {
    id: 'gl-1003',
    voucherNumber: 'RV-2026-0803',
    voucherDate: '2026-08-03',
    voucherType: 'Receipt',
    refNumber: 'CL-PAY-4410',
    narration: 'Wire transfer payment received from L&T Infra Project Site - Aggregate Dispatch',
    debitAccount: 'HDFC Bank - Escrow (10020)',
    creditAccount: 'Trade Receivables - L&T Infra (12010)',
    amountRs: 8750000,
    status: 'Posted',
    approvedBy: 'AR Lead (Ananya Verma)',
    costCenter: 'Sales Control',
    businessUnit: 'Building Materials'
  },
  {
    id: 'gl-1004',
    voucherNumber: 'DN-2026-0804',
    voucherDate: '2026-08-04',
    voucherType: 'Debit Note',
    refNumber: 'DN-EXPLOSIVE-02',
    narration: 'Debit Note issued to Solar Explosives for shortage in ANFO delivery bulk ton',
    debitAccount: 'Trade Payables - Solar Explosives (20010)',
    creditAccount: 'Explosive Expense Reversal (50030)',
    amountRs: 340000,
    status: 'Approved',
    approvedBy: 'Mines Director',
    costCenter: 'Quarry Control',
    businessUnit: 'Mining'
  }
];

export const MOCK_ACCOUNTS_RECEIVABLE: AccountsReceivableInvoice[] = [
  {
    id: 'ar-501',
    invoiceNumber: 'INV-2026-9081',
    customerName: 'Larsen & Toubro Infra Projects',
    customerCode: 'CUST-LT-01',
    businessType: 'Construction Client',
    invoiceDate: '2026-07-10',
    dueDate: '2026-08-09',
    totalAmountRs: 12500000,
    paidAmountRs: 8000000,
    outstandingBalanceRs: 4500000,
    ageingDays: 28,
    ageingCategory: '0-30 Days',
    status: 'Partially Paid',
    interestApplicablePercent: 12,
    reminderStatus: 'Automated SMS Sent'
  },
  {
    id: 'ar-502',
    invoiceNumber: 'INV-2026-8812',
    customerName: 'Ahuja Builders & Developers',
    customerCode: 'CUST-AHUJA-88',
    businessType: 'Crusher Dealer',
    invoiceDate: '2026-06-01',
    dueDate: '2026-07-01',
    totalAmountRs: 6800000,
    paidAmountRs: 2000000,
    outstandingBalanceRs: 4800000,
    ageingDays: 67,
    ageingCategory: '61-90 Days',
    status: 'Overdue',
    interestApplicablePercent: 18,
    reminderStatus: 'WhatsApp Sent'
  },
  {
    id: 'ar-503',
    invoiceNumber: 'INV-2026-7910',
    customerName: 'Chittorgarh Highway Concessionaires',
    customerCode: 'CUST-CHC-40',
    businessType: 'Mining Buyer',
    invoiceDate: '2026-04-15',
    dueDate: '2026-05-15',
    totalAmountRs: 9200000,
    paidAmountRs: 0,
    outstandingBalanceRs: 9200000,
    ageingDays: 114,
    ageingCategory: '90+ Days Overdue',
    status: 'Overdue',
    interestApplicablePercent: 24,
    reminderStatus: 'Escalated to Legal'
  }
];

export const MOCK_ACCOUNTS_PAYABLE: AccountsPayableVendor[] = [
  {
    id: 'ap-601',
    billNumber: 'SUP-IOCL-8821',
    vendorName: 'Indian Oil Corporation Ltd',
    vendorCode: 'VEND-IOCL-01',
    vendorCategory: 'Diesel Vendor',
    billDate: '2026-08-01',
    dueDate: '2026-08-15',
    totalBillRs: 14500000,
    paidRs: 5000000,
    outstandingRs: 9500000,
    ageingDays: 6,
    approvalStatus: 'Approved for Payment',
    paymentScheduleDate: '2026-08-12'
  },
  {
    id: 'ap-602',
    billNumber: 'SUP-CAT-4491',
    vendorName: 'GMMco Caterpillar Mining Machinery',
    vendorCode: 'VEND-CAT-99',
    vendorCategory: 'Machinery OEM',
    billDate: '2026-07-20',
    dueDate: '2026-08-20',
    totalBillRs: 8400000,
    paidRs: 0,
    outstandingRs: 8400000,
    ageingDays: 18,
    approvalStatus: 'Pending Manager Approval',
    paymentScheduleDate: '2026-08-18'
  },
  {
    id: 'ap-603',
    billNumber: 'SUP-SOLAR-3310',
    vendorName: 'Solar Industries India (Explosives)',
    vendorCode: 'VEND-SOLAR-03',
    vendorCategory: 'Explosives Supplier',
    billDate: '2026-07-05',
    dueDate: '2026-08-05',
    totalBillRs: 3800000,
    paidRs: 1800000,
    outstandingRs: 2000000,
    ageingDays: 33,
    approvalStatus: 'On Hold (QC Check)',
    paymentScheduleDate: '2026-08-22'
  }
];

export const MOCK_TREASURY_ACCOUNTS: TreasuryAccount[] = [
  {
    id: 'tr-1',
    accountCode: 'TREAS-SBI-01',
    bankName: 'State Bank of India',
    accountNumber: '•••• •••• 4410',
    accountType: 'Current',
    branchLocation: 'Udaipur Main Branch',
    closingBalanceRs: 48500000,
    unreconciledItemsCount: 3,
    lastBrsDate: '2026-08-06',
    cashFlowTodayRs: 12400000,
    chequePencilBookingsCount: 2
  },
  {
    id: 'tr-2',
    accountCode: 'TREAS-HDFC-02',
    bankName: 'HDFC Bank Escrow Vault',
    accountNumber: '•••• •••• 9012',
    accountType: 'Escrow Vault',
    branchLocation: 'Jaipur Corporate Branch',
    closingBalanceRs: 28400000,
    unreconciledItemsCount: 0,
    lastBrsDate: '2026-08-07',
    cashFlowTodayRs: 8900000,
    chequePencilBookingsCount: 0
  },
  {
    id: 'tr-3',
    accountCode: 'TREAS-ICICI-03',
    bankName: 'ICICI Cash Credit Facility',
    accountNumber: '•••• •••• 1122',
    accountType: 'Cash Credit',
    branchLocation: 'Bhilwara Industrial',
    closingBalanceRs: 15000000,
    unreconciledItemsCount: 1,
    lastBrsDate: '2026-08-05',
    cashFlowTodayRs: -2100000,
    chequePencilBookingsCount: 1
  }
];

export const MOCK_GST_TAX_RECORDS: GstTaxRecord[] = [
  {
    id: 'gst-1',
    period: 'July 2026',
    gstin: '08AAACR9981F1Z8',
    hsnCode: '2517 (Pebbles, Gravel, Crushed Stone)',
    taxableTurnoverRs: 89500000,
    cgstRs: 2237500,
    sgstRs: 2237500,
    igstRs: 1980000,
    tdsDeductedRs: 895000,
    tcsCollectedRs: 447500,
    gstr1Status: 'Filed',
    gstr3bStatus: 'Filed',
    taxAuditStatus: 'Verified'
  },
  {
    id: 'gst-2',
    period: 'August 2026 (Live)',
    gstin: '08AAACR9981F1Z8',
    hsnCode: '2505 (Natural Sands)',
    taxableTurnoverRs: 34200000,
    cgstRs: 855000,
    sgstRs: 855000,
    igstRs: 680000,
    tdsDeductedRs: 342000,
    tcsCollectedRs: 171000,
    gstr1Status: 'Draft',
    gstr3bStatus: 'Pending Audit',
    taxAuditStatus: 'Verified'
  }
];

export const MOCK_FIXED_ASSETS: FixedAssetItem[] = [
  {
    id: 'fa-101',
    assetCode: 'EXC-CAT-320D',
    assetName: 'Caterpillar 320D Hydraulic Excavator',
    category: 'Excavators & Dumpers',
    purchaseDate: '2024-03-15',
    originalValueRs: 18500000,
    depreciationMethod: 'WDV (Written Down Value)',
    depreciationRatePercent: 15,
    accumulatedDepreciationRs: 4800000,
    currentBookValueRs: 13700000,
    qrAssetCode: 'QR-ASSET-EXC320D-BHIL',
    locationBranch: 'Bhilwara Mine-01 Quarry',
    status: 'In Active Use'
  },
  {
    id: 'fa-102',
    assetCode: 'CRUSH-TEREX-200T',
    assetName: 'Terex Finlay 200 TPH Cone Crusher Plant',
    category: 'Crusher Plant Equipment',
    purchaseDate: '2023-08-10',
    originalValueRs: 42000000,
    depreciationMethod: 'SLM (Straight Line)',
    depreciationRatePercent: 10,
    accumulatedDepreciationRs: 12600000,
    currentBookValueRs: 29400000,
    qrAssetCode: 'QR-ASSET-CRUSH200T-RAJ',
    locationBranch: 'Rajsamand Plant Unit B',
    status: 'In Active Use'
  }
];

export const MOCK_PARTNER_INVESTOR: PartnerInvestorLedger[] = [
  {
    id: 'part-1',
    partnerCode: 'PART-RZ-01',
    partnerName: 'Race Zone Ventures Pvt Ltd',
    equitySharePercent: 60.0,
    capitalContributionRs: 90000000,
    drawingsYtdRs: 5000000,
    profitShareAllocatedRs: 28400000,
    dividendPaidRs: 15000000,
    netInvestmentBalanceRs: 98400000,
    settlementStatus: 'Settled FY26'
  },
  {
    id: 'part-2',
    partnerCode: 'PART-INV-02',
    partnerName: 'Rajasthan Mining Infrastructure Fund',
    equitySharePercent: 40.0,
    capitalContributionRs: 60000000,
    drawingsYtdRs: 0,
    profitShareAllocatedRs: 18933333,
    dividendPaidRs: 10000000,
    netInvestmentBalanceRs: 68933333,
    settlementStatus: 'Pending Dividend Payout'
  }
];

export const MOCK_PROJECT_ACCOUNTING: ProjectAccountRecord[] = [
  {
    id: 'prj-1',
    projectCode: 'PRJ-HWY-NH79',
    projectName: 'NH-79 Four Laning Highway Supply Project',
    clientName: 'NHAI / Cube Highways',
    totalBoqBudgetRs: 85000000,
    actualExpensesRs: 52000000,
    billedRevenueRs: 68000000,
    projectProfitRs: 16000000,
    marginPercent: 23.5,
    costOverrunRisk: 'Low (Within Budget)',
    status: 'In Progress'
  },
  {
    id: 'prj-2',
    projectCode: 'PRJ-DAM-RAJ',
    projectName: 'Mahi Canal Concrete Lining Project',
    clientName: 'Irrigation Dept Govt of Rajasthan',
    totalBoqBudgetRs: 42000000,
    actualExpensesRs: 38500000,
    billedRevenueRs: 39000000,
    projectProfitRs: 500000,
    marginPercent: 1.28,
    costOverrunRisk: 'High (Budget Overrun)',
    status: 'In Progress'
  }
];

export const MOCK_PAYMENT_TRANSACTIONS: PaymentTransactionRecord[] = [
  {
    id: 'pay-901',
    txnId: 'TXN-UPI-882190',
    timestamp: '2026-08-07 11:24:10',
    payerName: 'Ramesh Transport Corp',
    payeeName: 'RZ Minetrix Main Account',
    mode: 'UPI',
    amountRs: 250000,
    paymentType: 'Advance Payment',
    status: 'Instant Success',
    gatewayRef: 'UPI/6218192810/NPCI'
  },
  {
    id: 'pay-902',
    txnId: 'TXN-RTGS-110291',
    timestamp: '2026-08-07 10:15:00',
    payerName: 'L&T Construction',
    payeeName: 'RZ Minetrix Escrow Vault',
    mode: 'RTGS',
    amountRs: 4500000,
    paymentType: 'Invoice Settlement',
    status: 'Instant Success',
    gatewayRef: 'SBI/RTGS/881270912'
  }
];

export const MOCK_PAYROLL_ACCOUNTING: PayrollAccountingRecord[] = [
  {
    id: 'payr-1',
    monthPeriod: 'July 2026',
    employeeCategory: 'Quarry Workers',
    totalHeadcount: 142,
    grossSalaryRs: 3550000,
    pfDeductionRs: 284000,
    esiDeductionRs: 88750,
    advanceRecoveredRs: 150000,
    netPayableRs: 3027250,
    postingStatus: 'Journal Posted to GL'
  },
  {
    id: 'payr-2',
    monthPeriod: 'July 2026',
    employeeCategory: 'Fleet Drivers',
    totalHeadcount: 88,
    grossSalaryRs: 2640000,
    pfDeductionRs: 211200,
    esiDeductionRs: 66000,
    advanceRecoveredRs: 200000,
    netPayableRs: 2162800,
    postingStatus: 'Journal Posted to GL'
  }
];

export const MOCK_MINING_ACCOUNTING: MiningAccountingMetrics[] = [
  {
    id: 'm-acc-1',
    mineLocation: 'Bhilwara Mine-01 Granite & Aggregate Pit',
    royaltyPaidRs: 14200000,
    landownerSettlementRs: 4800000,
    dieselExpenseRs: 18500000,
    explosiveCostRs: 6200000,
    productionCostPerTonRs: 142.50,
    crusherCostPerTonRs: 85.00,
    machineCostPerHourRs: 1850.00,
    totalMiningCostYtdRs: 43700000
  }
];

export const MOCK_FLEET_ACCOUNTING: FleetAccountingRecord[] = [
  {
    id: 'f-acc-1',
    fleetGroup: 'Heavy Tipper Division (10-Wheeler Fleet)',
    tripRevenueRs: 28500000,
    tripCostRs: 14200000,
    fuelCostRs: 8900000,
    maintenanceCostRs: 2100000,
    vehicleOwnerSettlementRs: 8500000,
    driverIncentiveRs: 850000,
    netFleetProfitRs: 5800000,
    profitMarginPercent: 20.35
  }
];

export const MOCK_BUILDING_MATERIALS_ACCOUNTING: BuildingMaterialsAccountingRecord[] = [
  {
    id: 'bm-acc-1',
    materialCategory: 'Aggregates (10mm, 20mm, GSB)',
    purchaseCostRs: 32000000,
    salesRevenueRs: 48500000,
    inventoryValuationRs: 6800000,
    dealerIncentivesPaidRs: 1450000,
    supplierSettlementRs: 28000000,
    grossMarginPercent: 34.02
  }
];

export const MOCK_MARKETPLACE_ACCOUNTING: MarketplaceAccountingRecord[] = [
  {
    id: 'mkt-acc-1',
    period: 'July 2026',
    marketplaceCommissionRs: 3850000,
    subscriptionRevenueRs: 1420000,
    adBannerRevenueRs: 680000,
    escrowVolumeProcessedRs: 185000000,
    netMarketplaceRevenueRs: 5950000,
    payoutStatus: 'Settled to Vendors'
  }
];

export const MOCK_FINANCIAL_REPORTING: FinancialReportingSummary = {
  trialBalanceDrRs: 485000000,
  trialBalanceCrRs: 485000000,
  ytdRevenueRs: 248500000,
  ytdExpensesRs: 168200000,
  netProfitRs: 80300000,
  netProfitMarginPercent: 32.31,
  totalAssetsRs: 385000000,
  totalLiabilitiesRs: 142000000,
  workingCapitalRs: 124500000,
  operatingCashFlowRs: 92800000
};

export const MOCK_AI_FINANCE_INSIGHTS: AIFinanceInsights[] = [
  {
    id: 'ai-fin-1',
    insightType: 'Cash Flow Forecast',
    title: '30-Day Cash Inflow Surplus Predicted (+₹3.4 Cr)',
    description: 'AI model predicts 88% probability of receiving major pending payments from L&T Infra and NHAI contractor before Aug 25, 2026.',
    aiConfidencePercent: 94.2,
    suggestedAction: 'Allocate ₹1.5 Cr to early vendor settlement for 2.5% prompt payment cash discount.',
    impactValueRs: 375000,
    severity: 'Optimization Opportunity'
  },
  {
    id: 'ai-fin-2',
    insightType: 'Cost Optimization',
    title: 'Diesel Fuel Variance Alert at Rajsamand Crusher (+14% over baseline)',
    description: 'Crusher DG Set fuel consumption spike detected during night shift compared to tonnage output.',
    aiConfidencePercent: 98.1,
    suggestedAction: 'Audit DG Set fuel meter #03 and calibrate load factor.',
    impactValueRs: 420000,
    severity: 'Critical'
  },
  {
    id: 'ai-fin-3',
    insightType: 'Fraud Detection',
    title: 'Zero Duplicate Invoices or Anomalous GL Postings Detected',
    description: 'AI Autonomous GL Auditor scanned 1,420 journal vouchers for duplicate GSTINs or round-figure payment anomalies.',
    aiConfidencePercent: 99.8,
    suggestedAction: 'Maintain current dual-approval rule for vouchers > ₹10 Lakhs.',
    impactValueRs: 0,
    severity: 'Healthy'
  }
];

export const MOCK_BI_METRICS: BusinessIntelligenceMetrics = {
  executiveKpi: {
    monthlyRecurringRevenueRs: 38500000,
    ebitdaRs: 64200000,
    ebitdaMarginPercent: 38.6,
    quickRatio: 2.14,
    debtToEquityRatio: 0.38,
    cashRunwayMonths: 18.5
  },
  revenueByUnit: [
    { unit: 'Mining Operations', revenueRs: 98500000, percentage: 39.6 },
    { unit: 'Crusher Plants', revenueRs: 68200000, percentage: 27.4 },
    { unit: 'Fleet & Logistics', revenueRs: 48500000, percentage: 19.5 },
    { unit: 'Building Materials', revenueRs: 22800000, percentage: 9.2 },
    { unit: 'Marketplace Suite', revenueRs: 10500000, percentage: 4.3 }
  ],
  expenseBreakdown: [
    { category: 'Diesel & Energy Costs', costRs: 52400000, percentage: 31.1 },
    { category: 'Royalty & Statutory Cesses', costRs: 38200000, percentage: 22.7 },
    { category: 'Machinery Depreciation & Spares', costRs: 28900000, percentage: 17.2 },
    { category: 'Payroll & Labour Wager', costRs: 24500000, percentage: 14.6 },
    { category: 'Admin & IT Infrastructure', costRs: 24200000, percentage: 14.4 }
  ]
};

export const MOCK_COMPLIANCE_AUDITS: ComplianceAuditRecord[] = [
  {
    id: 'aud-101',
    auditId: 'AUD-2026-GST-091',
    moduleName: 'GST & Tax Platform',
    actionPerformed: 'GSTR-3B Auto-Reconciliation with GSTR-2A Purchase Register',
    performedBy: 'System Auto-Auditor (AI Compliance Engine)',
    timestamp: '2026-08-07 09:30:15',
    ipAddress: '10.0.12.45 (Internal Cloud Service)',
    complianceCategory: 'Statutory GST',
    verificationStatus: 'Compliant & Verified'
  },
  {
    id: 'aud-102',
    auditId: 'AUD-2026-AP-440',
    moduleName: 'Accounts Payable',
    actionPerformed: 'High-Value Payment Approval (> ₹25 Lakhs) for Heavy Equipment Lease',
    performedBy: 'CFO (Vikramaditya Singhania)',
    timestamp: '2026-08-06 16:45:22',
    ipAddress: '122.176.45.12 (Jaipur Office VPN)',
    complianceCategory: 'Approval Limits',
    verificationStatus: 'Compliant & Verified'
  }
];

export const MOCK_ECOSYSTEM_FINANCE_INTEGRATIONS: EcosystemFinanceIntegration[] = [
  {
    id: 'eco-1',
    systemConnected: 'Mining Operations',
    syncStatus: 'Real-Time Synchronized',
    dailyTransferredVolumeRs: 14800000,
    recordsSyncedToday: 342,
    lastSyncTimestamp: '2026-08-07 11:35:00'
  },
  {
    id: 'eco-2',
    systemConnected: 'Fleet & Logistics',
    syncStatus: 'Real-Time Synchronized',
    dailyTransferredVolumeRs: 8900000,
    recordsSyncedToday: 188,
    lastSyncTimestamp: '2026-08-07 11:34:45'
  },
  {
    id: 'eco-3',
    systemConnected: 'Building Materials',
    syncStatus: 'Real-Time Synchronized',
    dailyTransferredVolumeRs: 6200000,
    recordsSyncedToday: 115,
    lastSyncTimestamp: '2026-08-07 11:32:10'
  },
  {
    id: 'eco-4',
    systemConnected: 'Enterprise CRM',
    syncStatus: 'Real-Time Synchronized',
    dailyTransferredVolumeRs: 12500000,
    recordsSyncedToday: 94,
    lastSyncTimestamp: '2026-08-07 11:30:00'
  },
  {
    id: 'eco-5',
    systemConnected: 'B2B Marketplace',
    syncStatus: 'Real-Time Synchronized',
    dailyTransferredVolumeRs: 18500000,
    recordsSyncedToday: 410,
    lastSyncTimestamp: '2026-08-07 11:33:20'
  },
  {
    id: 'eco-6',
    systemConnected: 'HRMS & Payroll',
    syncStatus: 'Real-Time Synchronized',
    dailyTransferredVolumeRs: 3550000,
    recordsSyncedToday: 230,
    lastSyncTimestamp: '2026-08-07 08:00:00'
  }
];

// MODULES 31 - 50 TYPES & MOCK DATA

export interface EnterpriseBudgetRecord {
  id: string;
  budgetCode: string;
  budgetName: string;
  businessUnit: string;
  period: string;
  allocatedBudgetRs: number;
  utilizedBudgetRs: number;
  varianceRs: number;
  status: 'Approved & Locked' | 'Draft' | 'Under Revision';
  aiRecommendation: string;
}

export interface CostAccountingRecord {
  id: string;
  costCenterCode: string;
  costCenterName: string;
  category: 'Quarry Operations' | 'Crusher Plant' | 'Fleet Haulage' | 'Building Materials Warehouse' | 'Project Site';
  costingMethod: 'Activity Based Costing (ABC)' | 'Standard Costing' | 'Actual Costing';
  directCostsRs: number;
  allocatedOverheadsRs: number;
  totalCostRs: number;
  variancePercent: number;
  aiOptimizationTip: string;
}

export interface TreasuryLiquidityRecord {
  id: string;
  entityName: string;
  dailyCashPositionRs: number;
  forecast30DayCashInflowRs: number;
  forecast30DayCashOutflowRs: number;
  netLiquidityBufferRs: number;
  cashPoolingRatioPercent: number;
  aiLiquidityAlert: string;
}

export interface BankingAutoMatchRecord {
  id: string;
  txnRef: string;
  bankName: string;
  statementDate: string;
  description: string;
  amountRs: number;
  matchConfidencePercent: number;
  matchedGlAccount: string;
  reconciliationStatus: 'Auto-Matched' | 'Manual Review Required' | 'Reconciled';
}

export interface DigitalInvoiceRecord {
  id: string;
  invoiceNumber: string;
  customerName: string;
  invoiceType: 'Tax Invoice' | 'E-Invoice (IRN Enriched)' | 'Proforma Invoice' | 'Debit Note' | 'Credit Note';
  irnNumber: string;
  qrCodeEnriched: boolean;
  ocrAccuracyPercent: number;
  invoiceAmountRs: number;
  status: 'IRN Generated' | 'Pending E-Invoice' | 'Digitally Signed';
}

export interface CreditControlRecord {
  id: string;
  entityCode: string;
  entityName: string;
  entityType: 'Customer' | 'Dealer' | 'Sub-Contractor';
  creditLimitRs: number;
  currentExposureRs: number;
  availableCreditRs: number;
  creditHoldStatus: 'Active - Normal' | 'On Credit Hold (Overlimit)' | 'Special Release Approved';
  aiCreditRiskScore: number; // 0-100
}

export interface FixedAssetGpsRecord {
  id: string;
  assetCode: string;
  assetName: string;
  gpsTrackedLocation: string;
  qrCodeUrl: string;
  revaluationDate: string;
  marketAppraisedValueRs: number;
  bookValueRs: number;
  disposalStatus: 'Active Operation' | 'Scheduled for Auction';
}

export interface AuditManagementRecord {
  id: string;
  auditTaskCode: string;
  auditScope: 'Internal Financial Audit' | 'GST Tax Audit' | 'Physical Stock Verification' | 'Operational Audit';
  auditorName: string;
  checklistCompletionPercent: number;
  evidenceFilesAttached: number;
  findingsCount: number;
  status: 'In Progress' | 'Action Plan Signed Off' | 'Compliant';
}

export interface StatutoryComplianceRecord {
  id: string;
  statutoryType: 'GST Return' | 'TDS / TCS Filing' | 'Labour PF / ESI' | 'Mining Royalty Dues' | 'Pollution / Environmental Permit';
  dueDate: string;
  responsibleOfficer: string;
  complianceStatus: 'Submitted On Time' | 'Upcoming Deadline' | 'Document Archived';
  penaltyRiskRs: number;
}

export interface DocumentVaultRecord {
  id: string;
  docCode: string;
  documentTitle: string;
  category: 'Voucher Attachment' | 'Purchase Invoice OCR' | 'Tax Assessment Order' | 'E-Way Bill Proof';
  uploadedBy: string;
  ocrExtractedAmountRs: number;
  aiClassificationConfidence: number;
  vaultHash: string;
}

export interface ProjectAccountingDetailedRecord {
  id: string;
  projectCode: string;
  projectName: string;
  contractorName: string;
  billedRevenueRs: number;
  directMaterialCostRs: number;
  machineryRentalCostRs: number;
  netMarginRs: number;
  cashFlowStatus: 'Positive Net Inflow' | 'Deficit Buffer';
}

export interface PartnerInvestorPortalRecord {
  id: string;
  investorCode: string;
  investorName: string;
  investmentTier: 'Series A Lead' | 'JV Quarry Partner' | 'Equipment Fund Partner';
  capitalInvestedRs: number;
  cumulativeDividendsRs: number;
  dashboardAccessStatus: 'Live Vault Access' | 'Restricted Portal';
  nextPayoutDate: string;
}

export interface BIRegionalRecord {
  id: string;
  regionName: string;
  regionalRevenueRs: number;
  regionalExpensesRs: number;
  regionalMarginPercent: number;
  topPerformingUnit: string;
  workingCapitalEfficiencyDays: number;
}

export interface AICFOCommandRecord {
  id: string;
  alertType: 'Cash Flow Warning' | 'Tax Optimization Opportunity' | 'Fraud Anomaly Guard' | 'Capital Allocation';
  severity: 'Critical Alert' | 'Optimization Opportunity' | 'Healthy Monitor';
  insightSummary: string;
  recommendedCfoAction: string;
  projectedSavingsRs: number;
  aiConfidencePercent: number;
}

export interface FinancialSimulationScenario {
  id: string;
  scenarioName: 'Best Case Growth' | 'Expected Market Baseline' | 'Worst Case Diesel Spike (+25%)' | 'Monsoon Production Halt';
  dieselPriceImpactPercent: number;
  materialPriceImpactPercent: number;
  projectedRevenueRs: number;
  projectedNetProfitRs: number;
  breakEvenTonnage: number;
  roiPercent: number;
}

export interface MultiCompanyConsolidationRecord {
  id: string;
  companyName: string;
  standaloneRevenueRs: number;
  standaloneProfitRs: number;
  intercompanyTransactionsRs: number;
  intercompanyEliminationRs: number;
  consolidatedContributionRs: number;
}

export interface DigitalWalletRecord {
  id: string;
  walletId: string;
  walletOwner: string;
  ownerCategory: 'Customer Wallet' | 'Dealer Wallet' | 'Supplier Wallet' | 'Partner Escrow Wallet';
  availableBalanceRs: number;
  escrowReservedRs: number;
  autoReconciliationStatus: 'Synced with Gateway' | 'Pending Topup Clearance';
}

export interface ExecutiveCommandMetrics {
  liveTodayRevenueRs: number;
  liveTodayExpensesRs: number;
  liveBankBalanceRs: number;
  totalReceivablesRs: number;
  totalPayablesRs: number;
  unitWiseProfitability: {
    unit: string;
    profitRs: number;
  }[];
}

export interface FutureReadyCompliance {
  indAsCompliant: boolean;
  xbrlExportReady: boolean;
  eInvoiceAutoSync: boolean;
  eWayBillIntegration: boolean;
  voiceAiFinanceEnabled: boolean;
  bankApiDirectIntegration: boolean;
}

export interface EcosystemBridgeRecord {
  id: string;
  ecosystemDomain: string;
  bridgeName: string;
  dataTransferredDailyMb: number;
  eventsProcessed: number;
  status: 'Active 24/7 Sync' | 'Standby';
}

// MOCK DATASETS FOR MODULES 31 - 50

export const MOCK_ENTERPRISE_BUDGETS: EnterpriseBudgetRecord[] = [
  {
    id: 'bgt-1',
    budgetCode: 'BGT-2027-MINING',
    budgetName: 'Bhilwara Mine-01 Annual Extraction Budget',
    businessUnit: 'Mining Operations',
    period: 'FY 2026-27',
    allocatedBudgetRs: 85000000,
    utilizedBudgetRs: 52000000,
    varianceRs: 33000000,
    status: 'Approved & Locked',
    aiRecommendation: 'Reallocate ₹50 Lakhs unutilized explosive budget to heavy machinery tyre replacement.'
  },
  {
    id: 'bgt-2',
    budgetCode: 'BGT-2027-FLEET',
    budgetName: 'Chittorgarh Fleet Fuel & Maintenance Budget',
    businessUnit: 'Fleet Division',
    period: 'FY 2026-27',
    allocatedBudgetRs: 45000000,
    utilizedBudgetRs: 38000000,
    varianceRs: 7000000,
    status: 'Approved & Locked',
    aiRecommendation: 'Fuel price surge risk detected. Lock bulk diesel forward purchase agreement.'
  }
];

export const MOCK_COST_ACCOUNTING: CostAccountingRecord[] = [
  {
    id: 'cost-101',
    costCenterCode: 'CC-QUARRY-01',
    costCenterName: 'Bhilwara Pit Excavation & Blasting Cost Center',
    category: 'Quarry Operations',
    costingMethod: 'Activity Based Costing (ABC)',
    directCostsRs: 28500000,
    allocatedOverheadsRs: 4200000,
    totalCostRs: 32700000,
    variancePercent: -3.2,
    aiOptimizationTip: 'Calibrate excavator bucket fill factor to reduce diesel consumption by 4.5%.'
  },
  {
    id: 'cost-102',
    costCenterCode: 'CC-CRUSHER-02',
    costCenterName: 'Rajsamand Cone Crusher Primary Circuit',
    category: 'Crusher Plant',
    costingMethod: 'Standard Costing',
    directCostsRs: 18400000,
    allocatedOverheadsRs: 2900000,
    totalCostRs: 21300000,
    variancePercent: +1.8,
    aiOptimizationTip: 'Shift heavy primary crushing to non-peak electricity tariff hours (11 PM - 6 AM).'
  }
];

export const MOCK_TREASURY_LIQUIDITY: TreasuryLiquidityRecord[] = [
  {
    id: 'liq-1',
    entityName: 'RZ Minetrix Group HQ',
    dailyCashPositionRs: 91900000,
    forecast30DayCashInflowRs: 145000000,
    forecast30DayCashOutflowRs: 88000000,
    netLiquidityBufferRs: 148900000,
    cashPoolingRatioPercent: 92.5,
    aiLiquidityAlert: 'Surplus liquidity expected by Aug 20. Recommend 14-day sweep fixed deposit @ 6.8% p.a.'
  }
];

export const MOCK_BANKING_AUTO_MATCH: BankingAutoMatchRecord[] = [
  {
    id: 'bank-m1',
    txnRef: 'CMS202608070921',
    bankName: 'State Bank of India',
    statementDate: '2026-08-07',
    description: 'NEFT CR-LARSEN AND TOUBRO INFRA-CL-PAYMENT-AUG',
    amountRs: 4500000,
    matchConfidencePercent: 99.4,
    matchedGlAccount: '12010 - Trade Receivables (L&T Infra)',
    reconciliationStatus: 'Auto-Matched'
  },
  {
    id: 'bank-m2',
    txnRef: 'CMS202608070815',
    bankName: 'HDFC Bank',
    statementDate: '2026-08-07',
    description: 'IMPS-62181928-AHUJA BUILDERS DEPOSIT',
    amountRs: 850000,
    matchConfidencePercent: 95.8,
    matchedGlAccount: '12020 - Trade Receivables (Ahuja Builders)',
    reconciliationStatus: 'Reconciled'
  }
];

export const MOCK_DIGITAL_INVOICES: DigitalInvoiceRecord[] = [
  {
    id: 'einv-1',
    invoiceNumber: 'INV-2026-E9901',
    customerName: 'Kubera Infrastructure Limited',
    invoiceType: 'E-Invoice (IRN Enriched)',
    irnNumber: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    qrCodeEnriched: true,
    ocrAccuracyPercent: 99.8,
    invoiceAmountRs: 14200000,
    status: 'IRN Generated'
  }
];

export const MOCK_CREDIT_CONTROL: CreditControlRecord[] = [
  {
    id: 'cred-1',
    entityCode: 'CUST-AHUJA-88',
    entityName: 'Ahuja Builders & Developers',
    entityType: 'Customer',
    creditLimitRs: 10000000,
    currentExposureRs: 9200000,
    availableCreditRs: 800000,
    creditHoldStatus: 'On Credit Hold (Overlimit)',
    aiCreditRiskScore: 78 // High Risk
  },
  {
    id: 'cred-2',
    entityCode: 'CUST-LT-01',
    entityName: 'Larsen & Toubro Infra Projects',
    entityType: 'Customer',
    creditLimitRs: 50000000,
    currentExposureRs: 18500000,
    availableCreditRs: 31500000,
    creditHoldStatus: 'Active - Normal',
    aiCreditRiskScore: 12 // Low Risk
  }
];

export const MOCK_FIXED_ASSETS_GPS: FixedAssetGpsRecord[] = [
  {
    id: 'fagps-1',
    assetCode: 'EXC-CAT-320D',
    assetName: 'Caterpillar 320D Hydraulic Excavator',
    gpsTrackedLocation: '25.3478° N, 74.6358° E (Pit #2 Bhilwara)',
    qrCodeUrl: 'QR-ASSET-EXC320D-BHIL',
    revaluationDate: '2026-03-31',
    marketAppraisedValueRs: 15200000,
    bookValueRs: 13700000,
    disposalStatus: 'Active Operation'
  }
];

export const MOCK_AUDIT_MANAGEMENT: AuditManagementRecord[] = [
  {
    id: 'aud-301',
    auditTaskCode: 'AUD-FY26-Q1-STAT',
    auditScope: 'Internal Financial Audit',
    auditorName: 'Deloitte Touche Tohmatsu India',
    checklistCompletionPercent: 94.0,
    evidenceFilesAttached: 42,
    findingsCount: 1,
    status: 'Action Plan Signed Off'
  }
];

export const MOCK_STATUTORY_COMPLIANCE: StatutoryComplianceRecord[] = [
  {
    id: 'stat-1',
    statutoryType: 'GST Return',
    dueDate: '2026-08-20',
    responsibleOfficer: 'Taxation Head (CA Rajat Mehta)',
    complianceStatus: 'Submitted On Time',
    penaltyRiskRs: 0
  },
  {
    id: 'stat-2',
    statutoryType: 'Mining Royalty Dues',
    dueDate: '2026-08-15',
    responsibleOfficer: 'Mines Legal Advisor',
    complianceStatus: 'Upcoming Deadline',
    penaltyRiskRs: 50000
  }
];

export const MOCK_DOCUMENT_VAULT: DocumentVaultRecord[] = [
  {
    id: 'doc-1',
    docCode: 'DOC-INV-2026-0801',
    documentTitle: 'Indian Oil Bulk Fuel Delivery Challan & Tax Invoice',
    category: 'Purchase Invoice OCR',
    uploadedBy: 'Store Manager (Bhilwara)',
    ocrExtractedAmountRs: 3200000,
    aiClassificationConfidence: 99.2,
    vaultHash: 'SHA256:8f2b31a...9910'
  }
];

export const MOCK_PROJECT_ACCOUNTING_DETAILED: ProjectAccountingDetailedRecord[] = [
  {
    id: 'prjd-1',
    projectCode: 'PRJ-HWY-NH79',
    projectName: 'NH-79 Four Laning Highway Supply Project',
    contractorName: 'Cube Highways Concessionaire',
    billedRevenueRs: 68000000,
    directMaterialCostRs: 38000000,
    machineryRentalCostRs: 14000000,
    netMarginRs: 16000000,
    cashFlowStatus: 'Positive Net Inflow'
  }
];

export const MOCK_PARTNER_INVESTOR_PORTAL: PartnerInvestorPortalRecord[] = [
  {
    id: 'partp-1',
    investorCode: 'INV-RZV-01',
    investorName: 'Race Zone Ventures Growth Fund',
    investmentTier: 'Series A Lead',
    capitalInvestedRs: 90000000,
    cumulativeDividendsRs: 15000000,
    dashboardAccessStatus: 'Live Vault Access',
    nextPayoutDate: '2026-09-30'
  }
];

export const MOCK_BI_REGIONAL: BIRegionalRecord[] = [
  {
    id: 'reg-1',
    regionName: 'Mewar Mining Cluster (Bhilwara & Rajsamand)',
    regionalRevenueRs: 166700000,
    regionalExpensesRs: 108500000,
    regionalMarginPercent: 34.9,
    topPerformingUnit: 'Rajsamand Crusher Unit B',
    workingCapitalEfficiencyDays: 24
  }
];

export const MOCK_AI_CFO_COMMAND: AICFOCommandRecord[] = [
  {
    id: 'cfo-1',
    alertType: 'Cash Flow Warning',
    severity: 'Optimization Opportunity',
    insightSummary: '30-Day projected cash inflow will exceed debt service obligations by 3.2x.',
    recommendedCfoAction: 'Prepay ICICI Equipment Overdraft Facility to save ₹2.4 Lakhs monthly interest.',
    projectedSavingsRs: 2880000,
    aiConfidencePercent: 96.5
  }
];

export const MOCK_FINANCIAL_SIMULATION: FinancialSimulationScenario[] = [
  {
    id: 'sim-1',
    scenarioName: 'Expected Market Baseline',
    dieselPriceImpactPercent: 0,
    materialPriceImpactPercent: 0,
    projectedRevenueRs: 248500000,
    projectedNetProfitRs: 80300000,
    breakEvenTonnage: 185000,
    roiPercent: 28.4
  },
  {
    id: 'sim-2',
    scenarioName: 'Worst Case Diesel Spike (+25%)',
    dieselPriceImpactPercent: +25,
    materialPriceImpactPercent: +5,
    projectedRevenueRs: 252000000,
    projectedNetProfitRs: 64200000,
    breakEvenTonnage: 215000,
    roiPercent: 21.2
  }
];

export const MOCK_MULTI_COMPANY_CONSOLIDATION: MultiCompanyConsolidationRecord[] = [
  {
    id: 'mc-1',
    companyName: 'RZ Minetrix Mining & Aggregates Pvt Ltd',
    standaloneRevenueRs: 148500000,
    standaloneProfitRs: 48500000,
    intercompanyTransactionsRs: 18500000,
    intercompanyEliminationRs: -18500000,
    consolidatedContributionRs: 130000000
  },
  {
    id: 'mc-2',
    companyName: 'Minetrix Fleet & Logistics Solutions LLP',
    standaloneRevenueRs: 68000000,
    standaloneProfitRs: 18200000,
    intercompanyTransactionsRs: 12000000,
    intercompanyEliminationRs: -12000000,
    consolidatedContributionRs: 56000000
  }
];

export const MOCK_DIGITAL_WALLETS: DigitalWalletRecord[] = [
  {
    id: 'wal-1',
    walletId: 'WAL-CUST-881',
    walletOwner: 'L&T Infrastructure Projects Wallet',
    ownerCategory: 'Customer Wallet',
    availableBalanceRs: 4500000,
    escrowReservedRs: 2000000,
    autoReconciliationStatus: 'Synced with Gateway'
  }
];

export const MOCK_EXECUTIVE_COMMAND: ExecutiveCommandMetrics = {
  liveTodayRevenueRs: 4850000,
  liveTodayExpensesRs: 2100000,
  liveBankBalanceRs: 91900000,
  totalReceivablesRs: 34200000,
  totalPayablesRs: 18400000,
  unitWiseProfitability: [
    { unit: 'Mining Operations', profitRs: 48500000 },
    { unit: 'Crusher Plants', profitRs: 28400000 },
    { unit: 'Fleet Haulage', profitRs: 14200000 },
    { unit: 'Building Materials', profitRs: 8900000 },
    { unit: 'Marketplace Platform', profitRs: 5950000 }
  ]
};

export const MOCK_FUTURE_READY: FutureReadyCompliance = {
  indAsCompliant: true,
  xbrlExportReady: true,
  eInvoiceAutoSync: true,
  eWayBillIntegration: true,
  voiceAiFinanceEnabled: true,
  bankApiDirectIntegration: true
};

export const MOCK_ECOSYSTEM_BRIDGES: EcosystemBridgeRecord[] = [
  {
    id: 'bridge-1',
    ecosystemDomain: 'Finance ↔ Load Exchange Marketplace (Phase 31)',
    bridgeName: 'Automated Freight Invoice & Wallet Escrow Settlement',
    dataTransferredDailyMb: 148.5,
    eventsProcessed: 1420,
    status: 'Active 24/7 Sync'
  },
  {
    id: 'bridge-2',
    ecosystemDomain: 'Finance ↔ Mining Platform (Phase 17)',
    bridgeName: 'Real-time Royalty, Lease & Diesel Cost Accounting',
    dataTransferredDailyMb: 210.2,
    eventsProcessed: 2850,
    status: 'Active 24/7 Sync'
  }
];

