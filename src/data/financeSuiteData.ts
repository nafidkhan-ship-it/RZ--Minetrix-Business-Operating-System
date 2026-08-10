import { FinanceSuiteModule } from '../types/architecture';

export const BUSINESS_UNITS_DATA = [
  {
    code: 'BU-MINING',
    name: 'Mining & Quarry Operations',
    description: 'Covers Laterite stone quarries, granite pits, crusher plants, blasting operations, and weighbridges.',
    costCenters: ['CC-Q101 (Kannur Quarry)', 'CC-Q102 (Kasaragod Quarry)', 'CC-CR01 (Crusher Unit 1)', 'CC-BLAST (Blasting Ops)'],
    keyRevenueStreams: ['Direct Stone Sales', 'Crusher Aggregates', 'Custom Dressing Contracts'],
    keyExpenseDrivers: ['Explosives & Blasting', 'Pit Machine Fuel & Diesel', 'Dressing Labor Piece-Rates', 'KPCB Royalty Fees']
  },
  {
    code: 'BU-FLEET',
    name: 'Fleet & Logistics Transport',
    description: 'Commercial tipper vehicles, dump trucks, heavy lorries, transit mixers, and third-party haulage agents.',
    costCenters: ['CC-FL-TIPPER (Tipper Division)', 'CC-FL-HEAVY (Heavy Lorries)', 'CC-MAINT-WORKSHOP (Central Garage)', 'CC-FUEL-STATION (Internal Bunk)'],
    keyRevenueStreams: ['Trip Freight Charges', 'Haulage Contracts', 'Third-Party Transport Commissions'],
    keyExpenseDrivers: ['Vehicle Diesel & Fuel', 'Tyre Wear & Mechanical Spares', 'Driver Wages & Trip Allowances', 'RTO Taxes & Permits']
  },
  {
    code: 'BU-MATERIALS',
    name: 'Building Materials & Stockyards',
    description: 'Regional stockyards, retail hardware outlets, cement distribution, TMT steel yards, and precast paver plants.',
    costCenters: ['CC-SY-KANNUR (Main Yard)', 'CC-SY-KOZHIKODE (Regional Yard)', 'CC-PAVER-PLANT (Interlock Manufacturing)'],
    keyRevenueStreams: ['Cement & Steel Sales', 'Tiles & Sanitaryware Sales', 'Precast Paver Blocks'],
    keyExpenseDrivers: ['Manufacturer Wholesale Purchases', 'Yard Warehousing Rent', 'Material Handling Labor', 'Freight Inward']
  },
  {
    code: 'BU-CRM-SERVICES',
    name: 'CRM & Turnkey Contracting',
    description: 'Civil construction contracting, earthwork projects, site leveling, demolition contracts, and engineering advisory.',
    costCenters: ['CC-CONTRACT-PROJECTS (Civil Site Ops)', 'CC-ENG-CONSULT (Technical Advisory)'],
    keyRevenueStreams: ['Turnkey Civil Contracts', 'Site Preparation Invoices', 'Consulting Retainers'],
    keyExpenseDrivers: ['Sub-contractor Charges', 'Site Material Consumption', 'Engineering Salaries', 'Project Performance Guarantees']
  },
  {
    code: 'BU-MARKETPLACE',
    name: 'Digital Commerce Platform',
    description: 'Online public e-commerce portal, vendor subscriptions, escrow management, and sponsored ad network.',
    costCenters: ['CC-MKT-ECOMMERCE (Public Portal)', 'CC-MKT-ADNETWORK (Ad Platform)', 'CC-MKT-ESCROW (Financial Services)'],
    keyRevenueStreams: ['Platform Take-Rate (Commission)', 'Rental Booking Fees', 'Featured Ad Revenue', 'Vendor Subscriptions'],
    keyExpenseDrivers: ['Payment Gateway Processing Fees', 'Cloud Hosting & Telemetry', 'Digital Marketing & User Acquisition']
  },
  {
    code: 'BU-RENTAL-DIV',
    name: 'Heavy Equipment & Commercial Rentals',
    description: 'Short-term and long-term hiring of JCB excavators, rock breakers, mobile crushers, and tipper fleets.',
    costCenters: ['CC-[RENT-HEAVY] (Excavator Rental)', 'CC-[RENT-FLEET] (Tipper Rental)'],
    keyRevenueStreams: ['Hourly Machine Rental Fees', 'Daily/Monthly Tipper Leases', 'Mobilization Freight Surcharges'],
    keyExpenseDrivers: ['Operator Salaries & Overtime', 'Equipment Depreciation', 'Low-Bed Transport Freight Inward', 'Engine Overhaul']
  }
];

export const CHART_OF_ACCOUNTS_STRUCTURE = [
  {
    category: '1000 - ASSETS',
    subClasses: [
      { code: '1100', name: 'Current Assets', examples: ['1110 Cash in Hand', '1120 Bank Accounts (HDFC, SBI, Federal)', '1130 Accounts Receivable (Customers & Contractors)', '1140 Inventory (Stone Stock, Aggregates, Cement)', '1150 Prepaid Expenses & GST Input Credit'] },
      { code: '1200', name: 'Non-Current Assets', examples: ['1210 Mining Land & Quarry Reserves', '1220 Quarry Buildings & Dressing Sheds', '1230 Heavy Mining Machinery (Excavators, Breakers, Crushers)', '1240 Commercial Fleet Vehicles (Tippers, Lorries)', '1250 Furniture & IT Infrastructure'] },
      { code: '1300', name: 'Accumulated Depreciation', examples: ['1330 Acc. Dep. - Quarry Machinery', '1340 Acc. Dep. - Commercial Fleet', '1350 Acc. Dep. - Buildings'] }
    ]
  },
  {
    category: '2000 - LIABILITIES',
    subClasses: [
      { code: '2100', name: 'Current Liabilities', examples: ['2110 Accounts Payable (Suppliers & Vendors)', '2120 Statutory Liabilities (GST Payable, TDS Payable)', '2130 Accrued Salaries & Piece-Rate Wages', '2140 Customer Advance Deposits & Escrow Holds'] },
      { code: '2200', name: 'Non-Current Liabilities', examples: ['2210 Commercial Vehicle Bank Term Loans', '2220 Equipment Machinery Hypothecation Loans', '2230 Partner Long-Term Loans'] }
    ]
  },
  {
    category: '3000 - EQUITY & CAPITAL',
    subClasses: [
      { code: '3100', name: 'Partner Capital Accounts', examples: ['3110 Partner A Capital', '3120 Partner B Capital', '3130 Partner Partner Current Accounts'] },
      { code: '3200', name: 'Retained Earnings', examples: ['3210 Accum. Retained Earnings', '3220 Current Year Profit/Loss Reserve'] }
    ]
  },
  {
    category: '4000 - REVENUE / INCOME',
    subClasses: [
      { code: '4100', name: 'Mining & Aggregate Sales', examples: ['4110 Laterite Stone Sales (1st/2nd/3rd Grade)', '4120 Crusher Aggregates (M-Sand, P-Sand, 20mm)', '4130 Quarry Dust & Granular Sub-Base'] },
      { code: '4200', name: 'Logistics & Haulage Income', examples: ['4210 Tipper Trip Freight Revenue', '4220 Fleet Long-Haul Contract Income'] },
      { code: '4300', name: 'Building Material Sales', examples: ['4310 Cement Wholesale Sales', '4320 TMT Rebar Sales', '4330 Precast Paver Blocks'] },
      { code: '4400', name: 'Rental & Marketplace Revenue', examples: ['4410 Heavy Machinery Rental Revenue', '4420 Vehicle Rental Income', '4430 Marketplace Take-Rate Commission', '4440 Ad & Sponsored Listing Revenue'] }
    ]
  },
  {
    category: '5000 - DIRECT COST OF GOODS SOLD (COGS)',
    subClasses: [
      { code: '5100', name: 'Direct Mining & Quarry COGS', examples: ['5110 Explosives & Detonators Expense', '5120 Pit Machine Diesel & Fuel', '5130 Stone Dressing Piece-Rate Labor Waged', '5140 KPCB Mining Royalty & Environmental Cess'] },
      { code: '5200', name: 'Direct Logistics COGS', examples: ['5210 Vehicle Fuel Expense', '5220 Driver Trip Allowances & Bata', '5230 Interstate Toll Charges'] },
      { code: '5300', name: 'Material Procurement COGS', examples: ['5310 Raw Cement Purchase Cost', '5320 TMT Steel Wholesale Purchase', '5330 Inward Freight Charges'] }
    ]
  },
  {
    category: '6000 - OPERATING & OVERHEAD EXPENSES',
    subClasses: [
      { code: '6100', name: 'Administrative & Office Expenses', examples: ['6110 Administrative Staff Salaries', '6120 Office Rent & Utilities', '6130 Legal, Audit & Environmental Statutory Fees', '6140 Software License & Cloud Telemetry'] },
      { code: '6200', name: 'Maintenance & Repairs', examples: ['6210 Vehicle Spare Parts & Tyre Replacement', '6220 Machinery Hydraulic Repair & Overhaul', '6230 Quarry Workshop Consumables'] },
      { code: '6300', name: 'Financial & Bank Charges', examples: ['6310 Commercial Loan Interest Expense', '6320 Payment Gateway Processing Fees', '6330 Bank Service Charges & Loan Processing'] }
    ]
  }
];

export const FINANCE_SUITE_MODULES: FinanceSuiteModule[] = [
  {
    id: 'executive-finance-dashboard',
    number: 1,
    title: 'Executive Finance Command & Real-Time Analytics Dashboard',
    icon: 'LayoutDashboard',
    category: 'Core Financials',
    summary: 'CFO executive command center tracking real-time enterprise Revenue, COGS, Gross Profit, Operating Expenses, Net Cash Flow, Bank Balances, Accounts Receivable, Accounts Payable, Business Unit Profitability, and Gemini AI Financial Insights.',
    subModules: [
      'Real-Time Consolidated GMV, Gross Revenue & Net Profit KPI Cards',
      'Operating Cash Flow vs Net Profit Waterfall Chart',
      'Liquid Cash & Multi-Bank Balances Matrix (HDFC, SBI, Federal, Cash-in-Hand)',
      'Accounts Receivable (AR) & Accounts Payable (AP) Aging Breakdown',
      'Today\'s Collection Tracker (UPI, Razorpay, Cash, Bank Transfer)',
      'Today\'s Outflow & Supplier Payout Summary',
      'Business Unit Profitability Leaderboard (Mining, Fleet, Materials, Marketplace, CRM)',
      'Cost Center Variance & Over-Budget Alert Bar',
      'Gemini AI CFO Financial Anomaly & Working Capital Insight Feed'
    ],
    keyCapabilities: [
      'Live consolidation across all 6 Business Units with instant drill-down to individual voucher postings.',
      'Automated daily cash-flow forecasting based on active receivable invoices and supplier bill due dates.',
      'Real-time working capital ratio, current ratio, and debt-equity ratio calculations.'
    ],
    masterDataEntities: ['ExecutiveFinanceKPI', 'BankBalanceSnapshot', 'WorkingCapitalLog', 'AICFOInsight'],
    eventIntegrations: {
      publishes: ['fin.dashboard.viewed', 'fin.kpi.recalculated'],
      subscribes: ['fin.journal.posted', 'fin.payment.received', 'fin.payout.released']
    },
    sharedCoreDependencies: ['Executive Dashboard Engine (Mod 10)', 'Identity & Auth (Mod 1)'],
    aiFeatures: ['Automated working capital liquidity forecast & cash runway projection']
  },
  {
    id: 'chart-of-accounts',
    number: 2,
    title: 'Enterprise Chart of Accounts & Hierarchy Engine',
    icon: 'FolderTree',
    category: 'Core Financials',
    summary: 'Centralized 6-level hierarchical Chart of Accounts (COA) engine organizing Assets, Liabilities, Equity, Revenue, COGS, and Expenses mapped cleanly across Business Units, Cost Centers, and Project Accounts.',
    subModules: [
      '6-Level Hierarchical Chart of Accounts Tree Navigator',
      'Asset, Liability, Equity, Income, COGS & Expense Account Master Configurator',
      'Business Unit & Branch Account Mapping Matrix',
      'Cost Center & Profit Center Account Association Engine',
      'Project-Specific Ledger Code Generator (Civil Contracts & Mining Concessions)',
      'Account Restriction & Maker-Checker Permission Enforcer',
      'Multi-Currency & International Accounting Standard Adapter'
    ],
    keyCapabilities: [
      'Flexible account creation with strict validation preventing orphan ledger accounts.',
      'Direct mapping between operational events (e.g., stone loading) and COA account codes (e.g., 4110 Laterite Sales).',
      'Account freeze capability locking legacy accounts during fiscal year-end audits.'
    ],
    masterDataEntities: ['AccountMaster', 'CostCenterMaster', 'BusinessUnitAccountMap'],
    eventIntegrations: {
      publishes: ['fin.account.created', 'fin.account.updated'],
      subscribes: ['core.tenant.provisioned']
    },
    sharedCoreDependencies: ['Shared Master Data Management (Mod 5)', 'RBAC Engine (Mod 2)']
  },
  {
    id: 'general-ledger',
    number: 3,
    title: 'Immutable Double-Entry General Ledger Engine',
    icon: 'BookOpen',
    category: 'Core Financials',
    summary: 'Enterprise double-entry ledger execution engine processing automated system journal vouchers, manual journal entries, opening balances, recurring postings, and multi-branch balance sheet reconciliations.',
    subModules: [
      'Automated Operational System Voucher Ingestion (Sales, Purchases, Fuel, Payroll)',
      'Manual Journal Voucher (JV) Entry with Multi-Account Debit/Credit Balancing',
      'Opening & Closing Balance Carry-Forward Engine',
      'Multi-Branch & Inter-Company Transaction Adjustment Ledger',
      'Fiscal Year-End Closing & Period Lock Manager',
      'Hash-Chained Immutable Transaction Ledger Ledger Audit Log',
      'Reversal Voucher & Adjustment Entry Workflow'
    ],
    keyCapabilities: [
      'Strict double-entry validation: sum(Debit) MUST equal sum(Credit) before posting approval.',
      'Cryptographic hash chaining guaranteeing historical financial records cannot be tampered with.',
      'Instant drill-down from general ledger line item to source dispatch pass or weighbridge ticket.'
    ],
    masterDataEntities: ['GeneralLedgerHeader', 'GeneralLedgerLine', 'FiscalPeriodLock'],
    eventIntegrations: {
      publishes: ['fin.journal.posted', 'fin.period.closed'],
      subscribes: ['mining.sale.completed', 'fleet.trip.completed', 'materials.invoice.generated']
    },
    sharedCoreDependencies: ['Audit & Telemetry (Mod 14)', 'Finance Shared Bridge (Mod 8)']
  },
  {
    id: 'cash-bank',
    number: 4,
    title: 'Cash Book, Bank Book & Auto-Reconciliation Engine',
    icon: 'Landmark',
    category: 'Core Financials',
    summary: 'Comprehensive treasury management handling Cash-in-Hand books, multi-bank account books, physical cheque management, inter-bank funds transfers, and automated electronic bank statement reconciliation.',
    subModules: [
      'Petty Cash Book & Quarry Yard Field Expense Float Tracker',
      'Multi-Bank Account Register (HDFC, SBI, Federal Bank, Axis Bank)',
      'Inter-Bank & Cash-to-Bank Contra Transfer Voucher Entry',
      'Cheque Management System (PDC Tracking, Clearing, Dishonor Handling)',
      'Bank Statement OFX/CSV Import & Automated MT940 Matching Engine',
      'Unreconciled Transaction Dispute & Settlement Desk',
      'Cash Denomination Counter & Yard Cash Box Audit Log'
    ],
    keyCapabilities: [
      'Auto-reconciliation algorithm matching bank statement entries with ERP receipts using reference numbers & amounts.',
      'Real-time physical cash box limit alerts preventing unauthorized cash holdings at remote quarry yards.',
      'Post-Dated Cheque (PDC) maturity calendar triggering automated deposit reminders.'
    ],
    masterDataEntities: ['BankAccountRegister', 'CashBookEntry', 'BankReconciliationStatement', 'PDCChequeRecord'],
    eventIntegrations: {
      publishes: ['fin.bank.reconciled', 'fin.cash.transferred'],
      subscribes: ['fin.payment.received', 'fin.payout.released']
    },
    sharedCoreDependencies: ['Finance Shared Bridge (Mod 8)', 'Omni-Channel Notification Router (Mod 6)']
  },
  {
    id: 'accounts-receivable',
    number: 5,
    title: 'Accounts Receivable (AR), Credit Limits & Collection Engine',
    icon: 'Receipt',
    category: 'Operational Accounting',
    summary: 'Customer credit management system processing B2B customer ledgers, sales invoicing sync, Razorpay/UPI payment receipts, credit note adjustments, customer credit limit enforcement, and automated WhatsApp payment dunning.',
    subModules: [
      'Customer Financial Ledger & Statement of Account Generator',
      'Automated Sales Invoice Ingestion & Debit Adjustment Engine',
      'Multi-Channel Payment Receipt Entry (UPI, Razorpay, Cheque, NEFT/RTGS)',
      'Credit Note & Material Return Discount Adjustment Voucher Desk',
      'Real-Time Customer Credit Limit & Credit Days Lock Enforcer',
      'AR Aging Analysis (0-30, 31-60, 61-90, 90+ Days Bucket Breakdown)',
      'Automated Payment Dunning & WhatsApp Collection Notice Router'
    ],
    keyCapabilities: [
      'Automated order block: Prevents dispatching new stone/aggregate loads if customer credit limit is breached.',
      'One-click PDF Customer Account Statement sharing via WhatsApp and Email.',
      'Partial payment matching allocating receipts against specific open sales invoices.'
    ],
    masterDataEntities: ['CustomerLedgerAccount', 'ARInvoiceRecord', 'ReceiptVoucher', 'CreditNoteRecord'],
    eventIntegrations: {
      publishes: ['fin.receipt.recorded', 'fin.credit_limit.breached'],
      subscribes: ['materials.sales.invoiced', 'marketplace.order.completed']
    },
    sharedCoreDependencies: ['CRM & Business Suite (Phase 7)', 'Omni-Channel Notification Router (Mod 6)']
  },
  {
    id: 'accounts-payable',
    number: 6,
    title: 'Accounts Payable (AP), Supplier Aging & Payout Engine',
    icon: 'CreditCard',
    category: 'Operational Accounting',
    summary: 'Vendor payment management suite handling supplier ledgers, purchase bill verification, vendor debit notes, batch vendor payout processing, supplier aging schedules, and TDS withholding tax deductions.',
    subModules: [
      'Supplier & Vendor Financial Ledger Master',
      'Purchase Bill Verification & 3-Way Matching Desk (PO, GRN, Bill)',
      'Vendor Debit Note & Return Material Adjustment Manager',
      'Batch Vendor Payout Execution Engine via RazorpayX / Bank API',
      'AP Aging Analysis (0-30, 31-60, 61-90, 90+ Days Vendor Liability)',
      'Supplier Early Payment Discount & Cash Discount Optimizer',
      'TDS Withholding Tax Deduction Calculator at Source'
    ],
    keyCapabilities: [
      '3-Way Match Validation: Automatically verifies supplier bills against Goods Receipt Note (GRN) and Purchase Order (PO).',
      'Batch NEFT/RTGS payout file generation for thousands of transport tipper owners.',
      'TDS calculation automatically applying 194C/194Q tax rates based on supplier PAN type.'
    ],
    masterDataEntities: ['SupplierLedgerAccount', 'APBillRecord', 'PaymentVoucher', 'DebitNoteRecord'],
    eventIntegrations: {
      publishes: ['fin.payout.processed', 'fin.ap_bill.approved'],
      subscribes: ['materials.purchase.received', 'mining.explosive.purchased']
    },
    sharedCoreDependencies: ['Building Materials Suite (Phase 6)', 'Taxation Engine (Mod 13)']
  },
  {
    id: 'purchase-accounting',
    number: 7,
    title: 'Purchase Accounting & Expense Allocation Engine',
    icon: 'ShoppingBag',
    category: 'Operational Accounting',
    summary: 'Automated procurement accounting engine capturing raw material purchases, capital equipment purchases, purchase returns, GST input tax credit (ITC) calculations, and freight-inward expense allocation.',
    subModules: [
      'Raw Material Purchase Invoice Accounting (Cement, Steel, Fuel, Explosives)',
      'Capital Equipment Purchase Entry (Excavators, Crushers, Land Acquisition)',
      'Purchase Return & Supplier Rejection Financial Adjustment Desk',
      'GST Input Tax Credit (ITC) CGST/SGST/IGST Automatic Ledger Posting',
      'Freight Inward & Landing Cost Allocation Engine (Landed Costing)',
      'Import Duty & Custom Clearance Purchase Accounting Adapter'
    ],
    keyCapabilities: [
      'Landed Cost Calculator: Distributes inward freight costs across purchased inventory items to reflect true cost of stock.',
      'Automated GST ITC GSTR-2B reconciliation identifying eligible and ineligible input tax credits.',
      'Real-time inventory valuation updates upon purchase bill approval.'
    ],
    masterDataEntities: ['PurchaseAccountingVoucher', 'LandedCostDistribution', 'GSTInputCreditLedger'],
    eventIntegrations: {
      publishes: ['fin.purchase.accounted', 'fin.gst_itc.recorded'],
      subscribes: ['materials.po.fulfilled']
    },
    sharedCoreDependencies: ['Building Materials Suite (Phase 6)', 'Taxation Engine (Mod 13)']
  },
  {
    id: 'sales-accounting',
    number: 8,
    title: 'Sales Accounting, Discounts & Revenue Recognition',
    icon: 'DollarSign',
    category: 'Operational Accounting',
    summary: 'Automated revenue accounting engine capturing sales invoices across quarries, fleet, retail material yards, and e-commerce portal, handling trade discounts, GST output liability, and deferred revenue recognition.',
    subModules: [
      'Quarry Stone & Aggregate Sales Invoice Accounting Automation',
      'Fleet Logistics Freight Charge & Haulage Billing Accounting',
      'Building Material Cash/Credit Sales Accounting Automation',
      'Trade Discount, Volume Scheme & Early Settlement Discount Adjuster',
      'GST Output Liability (CGST/SGST/IGST) Ledger Posting Engine',
      'Ind AS 115 Revenue Recognition & Deferred Income Allocator for Long-Term Contracts'
    ],
    keyCapabilities: [
      'Instant ledger posting upon dispatch: Debits Customer / Cash, Credits Revenue Account and GST Output Payable.',
      'Ind AS 115 compliant revenue recognition for multi-month civil construction contracting projects.',
      'E-Way Bill and e-Invoice IRN QR code generation embedded on every sales invoice.'
    ],
    masterDataEntities: ['SalesAccountingVoucher', 'GSTOutputLiabilityLedger', 'RevenueRecognitionSchedule'],
    eventIntegrations: {
      publishes: ['fin.sales.accounted', 'fin.gst_output.recorded'],
      subscribes: ['mining.dispatch.completed', 'materials.sales.invoiced']
    },
    sharedCoreDependencies: ['Mining Operations Suite (Phase 4)', 'Taxation Engine (Mod 13)']
  },
  {
    id: 'expense-management',
    number: 9,
    title: 'Multi-Category Expense Accounting & Cost Allocation Engine',
    icon: 'Coins',
    category: 'Operational Accounting',
    summary: 'Granular operational expense tracking module allocating expenses across Fuel, Vehicles, Machinery, Quarry Pit Operations, Yard Offices, Salaries, Repairs, and Maintenance with strict cost-center attribution.',
    subModules: [
      'Vehicle Diesel & Fleet Fuel Expense Allocation Desk',
      'Heavy Equipment Machine Diesel & Lubricant Expense Accounting',
      'Quarry Pit Explosives, Detonators & Environmental Cess Expenses',
      'Site Maintenance, Mechanical Spares & Hydraulic Overhaul Expenses',
      'Yard Office Rent, Electricity, Utilities & Stationery Expenses',
      'Staff Salaries, Yard Piece-Rate Labor & Driver Bata Expense Voucher',
      'Employee Expense Claim, Yard Cash Advance & Reimbursement Desk'
    ],
    keyCapabilities: [
      'Mandatory Cost Center Tagging: Every expense line must be assigned to a specific Quarry, Vehicle, or Office Cost Center.',
      'Fuel efficiency anomaly detection linking fuel expense vouchers directly to telemetry mileage logs.',
      'Mobile expense claim receipt OCR scanning for yard managers.'
    ],
    masterDataEntities: ['ExpenseVoucher', 'CostCenterExpenseLog', 'EmployeeClaimRecord'],
    eventIntegrations: {
      publishes: ['fin.expense.recorded', 'fin.cost_center.debited'],
      subscribes: ['fleet.fuel.dispensed', 'mining.maintenance.logged']
    },
    sharedCoreDependencies: ['Fleet & Logistics Suite (Phase 5)', 'Mining Operations Suite (Phase 4)']
  },
  {
    id: 'asset-management',
    number: 10,
    title: 'Fixed Asset Register, Land Vault & Depreciation Engine',
    icon: 'Building2',
    category: 'Assets & Taxation',
    summary: 'Comprehensive enterprise fixed asset lifecycle management tracking Quarry Land, Mining Concessions, Buildings, Excavators, Breakers, Tippers, IT Equipment, and automated Straight-Line (SLM) & Written-Down Value (WDV) depreciation.',
    subModules: [
      'Mining Land, Leasehold Rights & Geological Reserve Valuation Register',
      'Quarry Sheds, Buildings & Civil Works Fixed Asset Catalog',
      'Heavy Quarry Machinery & Crusher Plant Fixed Asset Register',
      'Commercial Fleet Vehicle & Transport Asset Tracking Master',
      'Companies Act 2013 & Income Tax Act Dual Depreciation Calculator (SLM & WDV)',
      'Asset Disposal, Scrap Sale & Profit/Loss on Asset Sale Accounting',
      'Asset Impairment Testing & Physical Asset Barcode Audit Desk'
    ],
    keyCapabilities: [
      'Dual Depreciation Execution: Calculates Companies Act depreciation for financial reporting and Income Tax WDV for tax filing.',
      'GPS and Telematics linkage tracking physical location and operational status of high-value excavators.',
      'Automated gain/loss calculation on trade-in or sale of old commercial tippers.'
    ],
    masterDataEntities: ['FixedAssetMaster', 'DepreciationSchedule', 'AssetDisposalRecord'],
    eventIntegrations: {
      publishes: ['fin.asset.created', 'fin.depreciation.posted', 'fin.asset.disposed'],
      subscribes: ['fin.purchase.accounted']
    },
    sharedCoreDependencies: ['Shared Master Data Management (Mod 5)', 'Audit & Telemetry (Mod 14)']
  },
  {
    id: 'rental-accounting',
    number: 11,
    title: 'Vehicle & Equipment Rental Accounting & Escrow Engine',
    icon: 'Wrench',
    category: 'Operational Accounting',
    summary: 'Specialized accounting engine handling revenue recognition, security deposits, low-bed transport mobilization charges, operator allowances, and escrow settlements for commercial vehicle and heavy machine rentals.',
    subModules: [
      'Vehicle Rental Revenue & Trip-Based Haulage Ledger Ingestion',
      'Heavy Machinery Hourly Telematics Hour-Meter Rental Billing Adapter',
      'Long-Term Rental Agreement Billing & Security Deposit Accounting',
      'Mobilization & Demobilization Freight Charge Expense Allocator',
      'Marketplace Rental Escrow Advance Deposit & Release Engine',
      'Machine Breakdown Rental Credit Refund & Penalty Desk'
    ],
    keyCapabilities: [
      'IoT Hour-Meter Ingestion: Converts machine engine running hours directly into customer rental billing vouchers.',
      'Escrow Hold Management: Secures contractor rental advances until site sign-off.',
      'Automatic operator bata expense deduction from gross rental revenue.'
    ],
    masterDataEntities: ['RentalBillingVoucher', 'RentalEscrowHold', 'SecurityDepositLedger'],
    eventIntegrations: {
      publishes: ['fin.rental.billed', 'fin.rental_escrow.settled'],
      subscribes: ['marketplace.rental.booked', 'marketplace.rental.settled']
    },
    sharedCoreDependencies: ['Marketplace Suite (Phase 8)', 'Mining Operations Suite (Phase 4)']
  },
  {
    id: 'partner-investment',
    number: 12,
    title: 'Partner Capital, Investment & Profit-Sharing Engine',
    icon: 'Users',
    category: 'Assets & Taxation',
    summary: 'Partnership accounting framework managing partner capital accounts, joint venture investments, capital contributions, profit-sharing ratio distributions, partner drawings, and interest on capital allocations.',
    subModules: [
      'Partner Master & Equity Ownership Percentage Register',
      'Capital Contribution & Current Account Entry Manager',
      'Quarry Joint Venture (JV) Investment & Royalty Sharing Ledger',
      'Automated Fiscal Year-End Profit / Loss Distribution Engine',
      'Partner Monthly Drawings & Personal Withdrawal Manager',
      'Interest on Capital & Partner Remuneration Calculation Desk'
    ],
    keyCapabilities: [
      'Automated profit distribution allocating net annual profit according to deed ratio (e.g., 60:40).',
      'Individual Partner Statement of Account detailing capital, drawings, share of profit, and current balance.',
      'Quarry JV revenue-sharing engine calculating land owner royalties automatically.'
    ],
    masterDataEntities: ['PartnerMaster', 'PartnerCapitalLedger', 'JVInvestmentRecord', 'ProfitDistributionVoucher'],
    eventIntegrations: {
      publishes: ['fin.capital.transferred', 'fin.profit.distributed'],
      subscribes: ['fin.period.closed']
    },
    sharedCoreDependencies: ['Shared Master Data Management (Mod 5)', 'RBAC Engine (Mod 2)']
  },
  {
    id: 'taxation',
    number: 13,
    title: 'Indian Statutory GST & TDS Compliance Accounting Suite',
    icon: 'ShieldCheck',
    category: 'Assets & Taxation',
    summary: 'Comprehensive statutory tax compliance engine handling GST (GSTR-1, GSTR-3B, GSTR-2B ITC Matching, E-Way Bill, E-Invoicing IRN), TDS withholding tax returns (Form 26Q, 27EQ TCS), and Tax Ledger reconciliation.',
    subModules: [
      'Automated GST CGST, SGST & IGST Ledger Calculation Engine',
      'GSTR-1 Outward Supply Return Data Generator & Portal Sync',
      'GSTR-2B Input Tax Credit (ITC) Auto-Reconciliation Desk',
      'GSTR-3B Tax Liability & ITC Offset Settlement Worksheet',
      'TDS Under Income Tax Act (194C, 194J, 194Q) Deduction Ledger',
      'TCS Under Section 206C(1H) Sale of Goods Tax Collection Engine',
      'GST & TDS Tax Liability Payment & Challan Posting Register'
    ],
    keyCapabilities: [
      'NIC GST API direct integration for instant E-Way Bill and E-Invoice IRN QR code generation.',
      'Automated blocking of vendor payments if vendor has filed non-compliant GST returns (GSTR-2B mismatch).',
      'Quarterly TDS return Form 26Q file compiler.'
    ],
    masterDataEntities: ['GSTLedgerMaster', 'TDSDeductionRecord', 'TaxChallanReceipt', 'EWayBillRecord'],
    eventIntegrations: {
      publishes: ['fin.gst.filed', 'fin.tds.deducted', 'fin.tax.paid'],
      subscribes: ['fin.sales.accounted', 'fin.purchase.accounted']
    },
    sharedCoreDependencies: ['Finance Shared Bridge (Mod 8)', 'Document Management System (Mod 7)']
  },
  {
    id: 'budget-cost-control',
    number: 14,
    title: 'Annual Budgeting, Cost Center & Variance Control',
    icon: 'PieChart',
    category: 'Control & Intelligence',
    summary: 'Proactive enterprise financial control framework managing annual operating budgets, business unit budgets, project budgets, cost-center spending caps, real-time variance analysis, and budget overrun prevention.',
    subModules: [
      'Annual Enterprise Financial Budget Configurator',
      'Business Unit & Branch Expense Budget Allocation Desk',
      'Project-Specific Capital & Operational Budget Planner (CAPEX & OPEX)',
      'Cost Center Spending Limit & Real-Time Hard Stop Enforcer',
      'Budget vs. Actual Variance Analysis Matrix (Monthly & YTD)',
      'Emergency Budget Override & Management Approval Workflow'
    ],
    keyCapabilities: [
      'Real-time PO/Expense block: Prevents issuing purchase orders or expenses if cost center budget is exceeded.',
      'Variance heatmapping alerting management to negative spending trends in early days of the month.',
      'Zero-Based Budgeting (ZBB) template for annual quarry operational planning.'
    ],
    masterDataEntities: ['BudgetMaster', 'CostCenterBudgetLimit', 'BudgetVarianceRecord'],
    eventIntegrations: {
      publishes: ['fin.budget.created', 'fin.budget_overrun.flagged'],
      subscribes: ['fin.expense.recorded', 'materials.po.created']
    },
    sharedCoreDependencies: ['Shared Master Data Management (Mod 5)', 'RBAC Engine (Mod 2)']
  },
  {
    id: 'financial-reports',
    number: 15,
    title: 'Statutory & Management Financial Reporting Engine',
    icon: 'FileText',
    category: 'Control & Intelligence',
    summary: 'Comprehensive reporting system generating real-time Trial Balance, Profit & Loss (P&L) Statement, Balance Sheet, Cash Flow Statement (Direct/Indirect), Day Book, General Ledger Statements, and Business Unit Financials.',
    subModules: [
      'Real-Time Trial Balance Generator (Grouped & Detailed View)',
      'Statement of Profit & Loss (P&L) by Business Unit & Consolidated',
      'Balance Sheet Statement (Horizontal & Vertical Ind AS Schedule III)',
      'Cash Flow Statement (Direct Method & Indirect Method)',
      'Daily Financial Day Book & Cash Box Transaction Statement',
      'Comprehensive Ledger Account Statement Exporter (PDF/Excel)',
      'Receivables & Payables Customer/Vendor Outstanding Statements',
      'Cost Center Expense Analysis & Variance Reports'
    ],
    keyCapabilities: [
      'Instant financial statement generation in <1 second across millions of GL records.',
      'One-click drill-down from Balance Sheet numbers straight to individual source vouchers.',
      'Export to Schedule III compliant financial statements for external Chartered Accountant audits.'
    ],
    masterDataEntities: ['FinancialReportConfig', 'ReportSnapshotRecord', 'AuditExportPackage'],
    eventIntegrations: {
      publishes: ['fin.report.generated', 'fin.audit.exported'],
      subscribes: ['fin.journal.posted']
    },
    sharedCoreDependencies: ['Document Management System (Mod 7)', 'Audit & Telemetry (Mod 14)']
  },
  {
    id: 'business-intelligence',
    number: 16,
    title: 'Enterprise Financial BI & Gemini AI Copilot Suite',
    icon: 'Sparkles',
    category: 'Control & Intelligence',
    summary: 'Advanced business intelligence suite powered by server-side Gemini AI models providing executive financial KPIs, cross-suite profitability matrices, margin analysis, branch comparisons, and automated anomaly detection.',
    subModules: [
      'Executive Financial KPI Benchmark Matrix',
      'Quarry Pit & Mining Unit Profitability Analyzer (Revenue per Ton vs COGS per Ton)',
      'Fleet Logistics Profitability Analyzer (Revenue per Km vs Diesel/Maintenance per Km)',
      'Building Material Stockyard Profitability & Gross Margin Matrix',
      'Marketplace Platform Take-Rate & Ad Revenue Monetization BI',
      'Branch & Cost Center Financial Performance Comparison Matrix',
      'Gemini AI Financial Anomaly, Fraud & Revenue Leakage Detection Copilot',
      'Natural Language Financial Query Assistant ("What was Kannur Quarry profit last month?")'
    ],
    keyCapabilities: [
      'Server-side Gemini execution via `/api/ai/finance/*` keeping financial data secure.',
      'Unit Economics Analysis: Calculates exact profit per ton of Laterite stone and per kilometer of tipper transit.',
      'Automated fraud detection identifying suspicious manual JVs or duplicate supplier bills.'
    ],
    masterDataEntities: ['FinancialBISnapshot', 'UnitEconomicsRecord', 'AIFinancialAnomalyFlag'],
    eventIntegrations: {
      publishes: ['fin.bi.insight_generated', 'fin.ai.anomaly_detected'],
      subscribes: ['fin.journal.posted', 'fin.sales.accounted', 'fin.expense.recorded']
    },
    sharedCoreDependencies: ['Gemini AI Ecosystem (Mod 12)', 'Executive Dashboard Engine (Mod 10)'],
    aiFeatures: ['Gemini CFO Anomaly Detector', 'Natural Language Financial Q&A Assistant', 'Unit Economics Profit Optimizer']
  }
];

export const FINANCIAL_WORKFLOWS = [
  {
    source: 'Mining Operations (Phase 4)',
    trigger: 'Quarry Stone Gate Pass / Crusher Weighbridge Departure',
    journalPosting: 'Debit: Customer A/C or Cash (1110/1130) | Credit: Laterite Stone Sales Revenue (4110) | Credit: GST Output Payable (2120)',
    automationLevel: '100% Automated System Voucher',
    costCenter: 'Assigned to specific Quarry Pit or Crusher Plant Cost Center (e.g., CC-Q101)'
  },
  {
    source: 'Fleet & Logistics (Phase 5)',
    trigger: 'Tipper Trip e-POD Delivery Signature Verification',
    journalPosting: 'Debit: Shipper AR / Cash (1130) | Credit: Freight Logistics Income (4210) | Credit: GST Output (2120)',
    automationLevel: '100% Automated System Voucher',
    costCenter: 'Assigned to specific Commercial Vehicle Cost Center (e.g., CC-FL-KL13X1234)'
  },
  {
    source: 'Fleet Fuel Bunk (Phase 5)',
    trigger: 'Internal Diesel Dispenser Log at Quarry Garage',
    journalPosting: 'Debit: Vehicle Diesel Expense (5210) | Credit: Fuel Bunk Inventory (1140)',
    automationLevel: '100% Automated System Voucher',
    costCenter: 'Assigned to specific Tipper Vehicle or Excavator Machine Cost Center'
  },
  {
    source: 'Building Materials (Phase 6)',
    trigger: 'Yard Sales Invoice Issue & Stock Dispatch',
    journalPosting: 'Debit: Customer A/C (1130) | Credit: Cement/Steel Sales (4310) | Credit: GST Output (2120)',
    automationLevel: '100% Automated System Voucher',
    costCenter: 'Assigned to specific Retail Yard Cost Center (e.g., CC-SY-KANNUR)'
  },
  {
    source: 'CRM & Contracting (Phase 7)',
    trigger: 'Civil Engineering Project Milestone Sign-Off',
    journalPosting: 'Debit: Project Client AR (1130) | Credit: Contract Revenue (4400) | Credit: GST Output (2120)',
    automationLevel: '100% Automated System Voucher',
    costCenter: 'Assigned to specific Civil Project Account Code'
  },
  {
    source: 'Marketplace Suite (Phase 8)',
    trigger: 'Public Portal Order Delivery & Escrow Settlement',
    journalPosting: 'Debit: Razorpay Gateway Escrow (1120) | Credit: Seller Payout Payable (2110) | Credit: Platform Take-Rate Revenue (4430)',
    automationLevel: '100% Automated System Voucher',
    costCenter: 'Assigned to Digital Marketplace Cost Center (CC-MKT-ECOMMERCE)'
  },
  {
    source: 'HRMS Engine (Phase 9)',
    trigger: 'Monthly Payroll Run & Yard Worker Piece-Rate Sign-Off',
    journalPosting: 'Debit: Salary & Labor Expense (6140/5130) | Credit: TDS Payable (2120) | Credit: Bank / Salary Payable (2130)',
    automationLevel: '100% Automated System Voucher',
    costCenter: 'Distributed across respective Quarry, Fleet, or Office Cost Centers'
  }
];

export const INTEGRATION_TOPOLOGY_DATA = [
  {
    suite: 'Shared Core Platform',
    interaction: 'Provides Tenant Security, 4-Tier RLS, Master Data Management, PDF Invoicing Engine, Omni-Channel WhatsApp Alerts, and Gemini AI Gateway.',
    protocol: 'gRPC Internal Mesh / Node.js Local Module Imports'
  },
  {
    suite: 'Mining Operations Suite (Phase 4)',
    interaction: 'Real-time weighbridge ticket & gate pass event streaming triggering automated sales revenue & royalty expense postings.',
    protocol: 'Kafka / NATS Event Topics (`mining.stone_sale.completed`, `mining.royalty.paid`)'
  },
  {
    suite: 'Fleet & Logistics Suite (Phase 5)',
    interaction: 'Trip delivery e-POD sign-off & fuel dispenser telemetry triggering freight income and diesel expense GL postings.',
    protocol: 'Inter-Service Event Adapter (`fleet.trip.completed`, `fleet.fuel.dispensed`)'
  },
  {
    suite: 'Building Materials Suite (Phase 6)',
    interaction: '3-Way PO matching, stock receipt GRN, and retail customer sales invoice integration.',
    protocol: 'Inter-Service Event Adapter (`materials.sales.invoiced`, `materials.purchase.received`)'
  },
  {
    suite: 'CRM & Business Suite (Phase 7)',
    interaction: 'Contractor credit limit checks, customer deposit tracking, and milestone billing synchronization.',
    protocol: 'REST API Proxy & Event Adapter (`crm.contract.milestone_signed`)'
  },
  {
    suite: 'Marketplace Suite (Phase 8)',
    interaction: 'Razorpay payment webhooks, escrow holds, seller payout ledger settlements, and platform commission accounting.',
    protocol: 'Direct Event Adapter (`marketplace.escrow.released`, `marketplace.payout.settled`)'
  },
  {
    suite: 'External Statutory Services (GSTN & Banks)',
    interaction: 'NIC GST Portal for E-Way Bill / E-Invoice IRN, RazorpayX / Bank APIs for NEFT batch payouts, and MT940 bank statement sync.',
    protocol: 'External HTTPS REST API / Secure Webhooks'
  }
];

export const FINANCE_FOLDER_STRUCTURE = [
  'src/modules/finance/',
  '├── controllers/',
  '│   ├── executive-dashboard.controller.ts',
  '│   ├── chart-of-accounts.controller.ts',
  '│   ├── general-ledger.controller.ts',
  '│   ├── cash-bank.controller.ts',
  '│   ├── accounts-receivable.controller.ts',
  '│   ├── accounts-payable.controller.ts',
  '│   ├── purchase-accounting.controller.ts',
  '│   ├── sales-accounting.controller.ts',
  '│   ├── expense-management.controller.ts',
  '│   ├── asset-management.controller.ts',
  '│   ├── rental-accounting.controller.ts',
  '│   ├── partner-investment.controller.ts',
  '│   ├── taxation.controller.ts',
  '│   ├── budget-control.controller.ts',
  '│   ├── financial-reports.controller.ts',
  '│   └── finance-bi.controller.ts',
  '├── services/',
  '│   ├── double-entry-engine.service.ts',
  '│   ├── cost-center-allocator.service.ts',
  '│   ├── bank-reconciliation.service.ts',
  '│   ├── gst-nic-taxation.service.ts',
  '│   ├── Depreciation-calculator.service.ts',
  '│   └── finance-ai-copilot.service.ts',
  '├── models/',
  '│   ├── account-master.model.ts',
  '│   ├── journal-ledger.model.ts',
  '│   ├── ar-ap-invoice.model.ts',
  '│   ├── fixed-asset.model.ts',
  '│   └── tax-ledger.model.ts',
  '├── events/',
  '│   ├── finance-events.publisher.ts',
  '│   └── finance-events.subscriber.ts',
  '└── interfaces/',
  '    ├── ledger-entry.interface.ts',
  '    └── financial-report.interface.ts'
];

export const SECURITY_AND_AUDIT_STRATEGY = {
  security: [
    '4-Tier Row Level Security (RLS) Multi-Tenancy: Strict isolation ensuring branch finance staff only view vouchers belonging to their specific Business Unit or Quarry Branch.',
    'Maker-Checker Journal Controls: Manual journal vouchers above ₹50,000 require dual-level approval (Finance Manager + CFO sign-off) before ledger posting.',
    'Separation of Duties (SoD): Strict RBAC segregation ensuring staff who create purchase orders CANNOT approve payment vouchers or modify bank details.'
  ],
  audit: [
    'Cryptographic Ledger Hash Chaining: Every GL voucher line contains a SHA-256 hash linking it to the previous transaction, making historical edits mathematically impossible.',
    'Immutable Event Log: System transactions from weighbridges or tippers write read-only audit records that cannot be overwritten or deleted.',
    'Full Change History: Every account modification, credit limit change, or budget override logs timestamp, user ID, IP address, and before/after values.'
  ],
  scalability: [
    'Sharded General Ledger Partitioning: General Ledger table partitioned by fiscal year and Business Unit ID enabling sub-second queries across millions of entries.',
    'Asynchronous Ledger Processing: Operational events are processed asynchronously through Kafka queues to prevent blocking dispatch gate passes during peak hours.',
    'In-Memory Balance Aggregation: Redis cached trial balance and balance sheet aggregates refreshed in real time upon posting.'
  ]
};

export const PHASE10_TRANSITION_REVIEW = {
  title: 'Phase 9 Enterprise Finance Architecture Review & Phase 10 HRMS Transition Plan',
  validatedCapabilities: [
    'Centralized Multi-Unit Engine: Single unified financial architecture supporting Mining, Fleet, Building Materials, CRM, Marketplace, Equipment Rentals, and Partner Capital.',
    'Automated Zero-Duplicate Posting: Operational dispatch and sales events automatically create balanced double-entry GL journal vouchers with 0 manual re-entry.',
    'Real-Time Cost Center Attribution: Precise P&L tracking at individual Quarry Pit, Tipper Vehicle, Crusher Plant, and Retail Yard level.',
    'Indian GST & TDS Compliance: Full integration for E-Way Bill, E-Invoice IRN, GSTR-2B ITC reconciliation, and TDS withholding tax returns.',
    'Gemini AI CFO Copilot: Server-side AI intelligence providing working capital forecasts, unit economics analysis, and anomaly detection.'
  ],
  identifiedImprovementsForPhase10: [
    'Direct HRMS Payroll Integration: Deep binding between quarry stone dressing piece-rate labor logs, driver trip bata, and automated payroll tax slips.',
    'Biometric Attendance & Shift Sync: Real-time worker attendance streaming into automated daily labor expense accruals.',
    'Autonomous AI Contractor Credit Scoring: AI model analyzing past payment history to dynamically adjust contractor credit limits.'
  ],
  status: 'APPROVED — READY FOR PHASE 10 (HRMS, PAYROLL, WORKFORCE MANAGEMENT & AI PLATFORM DEEP EXPANSION)'
};
