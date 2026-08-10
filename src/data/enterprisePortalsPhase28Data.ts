// RZ® Minetrix BOS Phase 28 Enterprise Self-Service Portals & Digital Experience Platform Data

export interface PortalRoleDefinition {
  id: string;
  name: string;
  category: 'Commercial & Sales' | 'Production & Infrastructure' | 'Logistics & Fleet' | 'Projects & Construction' | 'Workforce & Field' | 'Ecosystem & Governance';
  targetAudience: string;
  primaryFeatures: string[];
  kpis: { label: string; value: string }[];
  activeUsers: number;
  securityLevel: 'L1 Standard B2C' | 'L2 Business B2B' | 'L3 Sensitive Partner' | 'L4 C-Suite & Gov Liaison';
  description: string;
}

export interface PortalModuleDefinition {
  moduleId: number;
  title: string;
  category: string;
  subModules: string[];
  keyCapabilities: string[];
  ecosystemIntegrations: string[];
  aiFeatures: string[];
  description: string;
}

export interface CustomerOrderSample {
  orderId: string;
  customerName: string;
  projectName: string;
  materialItem: string;
  quantityMt: number;
  totalAmountInr: number;
  paymentStatus: 'Paid via UPI' | 'Credit Escrow' | 'Pending NetBanking';
  deliveryStatus: 'In Transit (Live GPS)' | 'Weighbridge Dispatched' | 'Delivered' | 'Order Confirmed';
  deliveryEta: string;
  repeatOrderEligible: boolean;
}

export interface DealerStatementSample {
  dealerId: string;
  dealerName: string;
  regionZone: string;
  creditLimitInr: number;
  utilizedCreditInr: number;
  availableCreditInr: number;
  incentiveEarningsInr: number;
  pendingClaimsCount: number;
  activePromotionsCount: number;
  currentTier: 'Diamond Premier' | 'Platinum Elite' | 'Gold Partner';
}

export interface SupplierPOSample {
  poId: string;
  supplierName: string;
  category: 'Explosives & Blasting' | 'Heavy Crusher Spares' | 'Diesel & Fuel' | 'Safety Gear & PPE';
  poAmountInr: number;
  deliveryStatus: 'Delivered At Quarry' | 'In Transit' | 'PO Issued';
  vendorRatingStars: number;
  settlementStatus: 'Settled via Instant Payout' | 'Under Audit' | 'Invoice Submitted';
}

export interface ContractorBOQSample {
  projectId: string;
  contractorName: string;
  projectName: string;
  boqBudgetInr: number;
  boqSpentInr: number;
  materialRequirementMt: number;
  labourCountAssigned: number;
  equipmentUnitsDeployed: number;
  completionPercent: number;
}

export interface SupportTicketSample {
  ticketId: string;
  portalUser: string;
  userRole: string;
  subject: string;
  category: 'Weighbridge Slip Issue' | 'Invoice Dispute' | 'Delivery Delay' | 'E-Way Bill Error' | 'KYC Verification';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  aiDeflected: boolean;
  status: 'AI Resolved' | 'Assigned to Support Specialist' | 'In Progress';
  createdAt: string;
}

export interface DocumentVaultSample {
  docId: string;
  title: string;
  docType: 'Quarry Lease Agreement' | 'Tax Invoice & GST' | 'E-Way Bill' | 'Pollution Clearance Cert' | 'Driver License & KYC';
  fileSizeMb: number;
  digitallySigned: boolean;
  ocrSearchIndexed: boolean;
  securityScope: 'Public' | 'Restricted B2B' | 'Confidential';
  uploadDate: string;
}

export interface PortalMetricsSummary {
  totalPortalsDeployed: number;
  totalSelfServiceUsers: number;
  dailyPortalOrdersVolume: string;
  aiBotDeflectionRate: string;
  monthlyDocumentsSigned: number;
  avgTicketResolutionTime: string;
  mfaEnforcedUsersPercent: number;
  ecosystemEventsPerDay: string;
}

export const MOCK_PORTALS_LIST: PortalRoleDefinition[] = [
  {
    id: 'p-cust',
    name: 'Customer Portal',
    category: 'Commercial & Sales',
    targetAudience: 'B2C Home Builders, Infrastructure Buyers, Commercial Procurement',
    primaryFeatures: ['Profile Management', 'Live Material Orders', 'Instant Tax Invoices', 'UPI & Escrow Payments', 'Live Truck GPS Tracking', 'Material BOQ Calculator', 'AI Assistant', 'Support Tickets', 'Warranty & Quality Certs', 'Repeat Orders', 'Saved Projects'],
    kpis: [{ label: 'Active Monthly Buyers', value: '42,800' }, { label: 'Repeat Order Rate', value: '68.4%' }, { label: 'Avg Order Value', value: '₹1.85 Lakh' }],
    activeUsers: 42800,
    securityLevel: 'L1 Standard B2C',
    description: 'Self-service portal empowering buyers to calculate material requirements, place direct aggregate orders, track delivery vehicles in real-time, and download instant GST invoices.'
  },
  {
    id: 'p-dealer',
    name: 'Dealer Portal',
    category: 'Commercial & Sales',
    targetAudience: 'Authorized Aggregates & Building Material Dealers',
    primaryFeatures: ['Dealer Executive Dashboard', 'Live Yard Stock', 'Bulk Order Booking', 'Dynamic Credit Limit', 'Real-Time Ledger', 'Period Statements', 'Promotions & Schemes', 'Incentives & Rebates', 'Claims Settlement', 'Dealer Sales Analytics'],
    kpis: [{ label: 'Authorized Dealers', value: '1,450' }, { label: 'Avg Monthly Turnovers', value: '₹42 Lakh/Dealer' }, { label: 'Credit Utilization', value: '74.2%' }],
    activeUsers: 1450,
    securityLevel: 'L2 Business B2B',
    description: 'Comprehensive business portal for aggregate dealers to monitor credit headroom, order bulk materials, calculate scheme rebates, and view real-time financial statements.'
  },
  {
    id: 'p-distributor',
    name: 'Distributor Portal',
    category: 'Commercial & Sales',
    targetAudience: 'Regional Aggregates & Cement Distributors',
    primaryFeatures: ['Regional Territory Stock', 'Sub-Dealer Network Management', 'Credit Allocations', 'Consolidated Invoicing', 'Volume Rebate Tracker', 'Supply Chain Visibility'],
    kpis: [{ label: 'Regional Networks', value: '280' }, { label: 'Monthly Dispatch Volume', value: '1,80,000 MT' }],
    activeUsers: 280,
    securityLevel: 'L2 Business B2B',
    description: 'Hub portal for regional distributors managing multi-dealer networks, stock allocations, and bulk logistics scheduling across multiple zones.'
  },
  {
    id: 'p-supplier',
    name: 'Supplier Portal',
    category: 'Ecosystem & Governance',
    targetAudience: 'Explosives, Fuel, Machinery Spares, PPE & Consumable Vendors',
    primaryFeatures: ['Purchase Orders Queue', 'Delivery Dispatch Confirmations', 'Automated GST Invoicing', 'Instant Payout Settlements', 'Vendor Rating Matrix', 'On-Time Performance Score', 'Document Vault', 'Settlement History'],
    kpis: [{ label: 'On-Boarded Suppliers', value: '890' }, { label: 'On-Time PO Delivery', value: '96.2%' }, { label: 'Avg Payout Time', value: '2.4 Hours' }],
    activeUsers: 890,
    securityLevel: 'L2 Business B2B',
    description: 'Vendor collaboration platform for processing digital purchase orders, submitting invoices, tracking material deliveries, and accessing instant vendor payouts.'
  },
  {
    id: 'p-quarry',
    name: 'Quarry Owner Portal',
    category: 'Production & Infrastructure',
    targetAudience: 'Mine Owners, Quarry Lease Holders, Pit Managers',
    primaryFeatures: ['Daily Pit Excavation Summary', 'Stockpile Reserves', 'Dispatch Gate Queue', 'Live Order Bookings', 'E-Royalty & Compliance', 'Pit Expense Ledger', 'Machine Status Twin', 'Mine Yield Analytics'],
    kpis: [{ label: 'Registered Quarries', value: '142' }, { label: 'Daily Pit Yield', value: '84,000 MT' }, { label: 'Royalty Audit Compliance', value: '100%' }],
    activeUsers: 142,
    securityLevel: 'L3 Sensitive Partner',
    description: 'Production command portal giving quarry lease holders complete visibility over daily rock excavation, royalty passes, crusher feeds, and mine profitability.'
  },
  {
    id: 'p-crusher',
    name: 'Crusher Owner Portal',
    category: 'Production & Infrastructure',
    targetAudience: 'Crusher Plant Owners, Plant Managers, Processing Engineers',
    primaryFeatures: ['Crusher Feed & Output', 'Inventory Stockpiles (GSB, 20mm, M-Sand)', 'Sales Dispatch Slips', 'Jaw/Cone Health Telemetry', 'Scheduled Maintenance', 'Fuel & Energy Audit', 'Yield Analytics'],
    kpis: [{ label: 'Active Crusher Units', value: '210' }, { label: 'Overall Equipment Effectiveness (OEE)', value: '88.6%' }, { label: 'Crusher Power Efficiency', value: '1.2 kWh/MT' }],
    activeUsers: 210,
    securityLevel: 'L3 Sensitive Partner',
    description: 'Specialized processing portal monitoring jaw and cone crusher throughput, power consumption, screen sizing distribution, and inventory dispatches.'
  },
  {
    id: 'p-fleet',
    name: 'Fleet Owner Portal',
    category: 'Logistics & Fleet',
    targetAudience: 'Transport Company Owners, Fleet Managers, Logistics Logistics Partners',
    primaryFeatures: ['Fleet Operations Dashboard', 'Live Trip Assignments', 'Driver Roster', 'Vehicle Telematics & Health', 'GPS Route Optimization', 'Fuel Card Analytics', 'Maintenance Log', 'Driver Trip Settlements'],
    kpis: [{ label: 'Managed Tipper Fleets', value: '3,200' }, { label: 'Active Trucks', value: '18,500' }, { label: 'Fleet Fleet Utilization', value: '92.4%' }],
    activeUsers: 3200,
    securityLevel: 'L2 Business B2B',
    description: 'Comprehensive transport portal for managing heavy tipper fleets, tracking fuel consumption, monitoring trip margins, and automating driver settlements.'
  },
  {
    id: 'p-vehicle',
    name: 'Vehicle Owner Portal',
    category: 'Logistics & Fleet',
    targetAudience: 'Individual Truck/Tipper Owners (Single/Dual Truck Operators)',
    primaryFeatures: ['My Truck Trips', 'Trip Income & Margin', 'Fuel Dispense History', 'Tyre & Maintenance Tracker', 'Vehicle Insurance & Fitness Alert', 'Fastag & Toll Summary'],
    kpis: [{ label: 'Individual Truck Owners', value: '6,400' }, { label: 'Monthly Earnings / Truck', value: '₹1.45 Lakh' }],
    activeUsers: 6400,
    securityLevel: 'L2 Business B2B',
    description: 'Self-service app and web portal for single-truck owners to claim trips, monitor earnings, renew vehicle compliance documents, and request instant freight advances.'
  },
  {
    id: 'p-equipment',
    name: 'Equipment Owner Portal',
    category: 'Production & Infrastructure',
    targetAudience: 'Excavator, Loader, Drill Rig & Heavy Equipment Leasing Owners',
    primaryFeatures: ['Equipment Machine Hours', 'Site Assignment Status', 'Fuel Consumption Rate', 'Hydraulic Health Alerts', 'Hourly Rental Payouts', 'Breakdown Service Ticket'],
    kpis: [{ label: 'Leased Machines', value: '1,820' }, { label: 'Avg Machine Utilization', value: '14.2 Hrs/Day' }],
    activeUsers: 1820,
    securityLevel: 'L2 Business B2B',
    description: 'Rental and leasing management portal for owners of excavators, wheel loaders, and drilling rigs to audit engine hours, fuel efficiency, and rental payouts.'
  },
  {
    id: 'p-contractor',
    name: 'Contractor Portal',
    category: 'Projects & Construction',
    targetAudience: 'EPC Contractors, Highway Builders, Infrastructure Project Managers',
    primaryFeatures: ['Project Milestone Dashboard', 'BOQ Bill of Quantities', 'Direct Aggregate Orders', 'Sub-Contractor Labour Allocation', 'Machinery Deployment', 'Progress Payments', 'GST Invoices'],
    kpis: [{ label: 'Active Infrastructure Projects', value: '940' }, { label: 'BOQ Fulfilled Volume', value: '4.2M MT' }],
    activeUsers: 940,
    securityLevel: 'L2 Business B2B',
    description: 'Construction management portal for EPC contractors to order bulk materials as per project BOQ, track site deliveries, and reconcile progress payments.'
  },
  {
    id: 'p-builder',
    name: 'Builder Portal',
    category: 'Projects & Construction',
    targetAudience: 'Real Estate Developers, Residential Builders, Commercial Complex Developers',
    primaryFeatures: ['Multi-Site Project Overview', 'Material Planning & Schedules', 'Bulk Concrete/Sand Orders', 'Scheduled Delivery Staggering', 'Project Budget vs Actual', 'Quality Lab Reports'],
    kpis: [{ label: 'Real Estate Projects', value: '1,120' }, { label: 'Scheduled Orders On-Time', value: '98.1%' }],
    activeUsers: 1120,
    securityLevel: 'L2 Business B2B',
    description: 'Planning and procurement portal for real estate builders to schedule site dispatches, verify lab strength certificates, and maintain construction budgets.'
  },
  {
    id: 'p-architect',
    name: 'Architect Portal',
    category: 'Projects & Construction',
    targetAudience: 'Architects, Structural Designers, Interior Consultants',
    primaryFeatures: ['Material Catalog & Specifications', '3D Texture & Stone Library', 'Sample Request Studio', 'Specification Commission Tracker', 'Structural Strength Guidelines'],
    kpis: [{ label: 'Registered Architects', value: '2,400' }, { label: 'Sample Requests Fulfilled', value: '8,900' }],
    activeUsers: 2400,
    securityLevel: 'L1 Standard B2C',
    description: 'Design consultation portal offering high-res stone material textures, structural load specifications, sample ordering, and project specification rewards.'
  },
  {
    id: 'p-engineer',
    name: 'Engineer Portal',
    category: 'Projects & Construction',
    targetAudience: 'Civil Engineers, Quality Assurance Officers, Site Inspectors',
    primaryFeatures: ['Quality Test Certificates', 'Crusher Aggregate Gradation Sieve Analysis', 'Lab Test Reports', 'Mix Design Calculator', 'Site Compliance Verification'],
    kpis: [{ label: 'Quality QA Engineers', value: '3,100' }, { label: 'Lab Reports Generated', value: '24,500' }],
    activeUsers: 3100,
    securityLevel: 'L2 Business B2B',
    description: 'Technical portal providing civil engineers access to certified aggregate sieve analysis, Los Angeles abrasion test scores, and concrete mix design tools.'
  },
  {
    id: 'p-transport',
    name: 'Transport Agency Portal',
    category: 'Logistics & Fleet',
    targetAudience: 'Freight Brokers, Logistics Agencies, Transport Associations',
    primaryFeatures: ['Load Exchange Bidding', 'Route Freight Rates', 'Fleet Sourcing Queue', 'Tripartite Agreements', 'Brokerage Commission Ledger', 'E-Way Bill Generation'],
    kpis: [{ label: 'Transport Brokers', value: '1,850' }, { label: 'Loads Matched Daily', value: '3,400' }],
    activeUsers: 1850,
    securityLevel: 'L2 Business B2B',
    description: 'Freight brokerage portal connecting transport agencies with quarry dispatches, load matching algorithms, and automated E-way bill creation.'
  },
  {
    id: 'p-labour',
    name: 'Labour Contractor Portal',
    category: 'Workforce & Field',
    targetAudience: 'Manpower Suppliers, Quarry Labour Contractors, Site Staffing Partners',
    primaryFeatures: ['Worker Gang Roster', 'Geofenced Daily Attendance', 'PF & ESI Compliance', 'Weekly Wage Disbursal', 'Safety Training Records', 'Advancements & Deductions'],
    kpis: [{ label: 'Labour Agencies', value: '620' }, { label: 'Managed Field Workforce', value: '28,400 Workers' }],
    activeUsers: 620,
    securityLevel: 'L2 Business B2B',
    description: 'Workforce management portal for labour contractors to track daily attendance, manage PF/ESI statutory compliance, and disburse instant worker wages.'
  },
  {
    id: 'p-driver',
    name: 'Driver Portal',
    category: 'Workforce & Field',
    targetAudience: 'Heavy Tipper Drivers, Delivery Drivers, Logistics Operators',
    primaryFeatures: ['Assigned Trips', 'Trip Earnings & Incentives', 'Biometric Attendance', 'Mobile Wallet Account', 'License & Document Expiry Alert', 'Safety & Defensive Driving Modules'],
    kpis: [{ label: 'Active Tipper Drivers', value: '22,400' }, { label: 'Daily Earnings Disbursed', value: '₹18.5 Lakh' }],
    activeUsers: 22400,
    securityLevel: 'L1 Standard B2C',
    description: 'Mobile-first driver self-service portal for accepting trip assignments, viewing live earnings, requesting wallet withdrawals, and accessing emergency support.'
  },
  {
    id: 'p-operator',
    name: 'Operator Portal',
    category: 'Workforce & Field',
    targetAudience: 'Excavator Operators, Crusher Operators, Loader Operators',
    primaryFeatures: ['Machine Log Shift Hours', 'Work Orders & Duty Roster', 'Productivity Target Score', 'Equipment Maintenance Reporting', 'Safety Certification Badge'],
    kpis: [{ label: 'Heavy Machinery Operators', value: '4,800' }, { label: 'Shift Productivity Score', value: '94.2/100' }],
    activeUsers: 4800,
    securityLevel: 'L1 Standard B2C',
    description: 'Operator portal for recording machine run-hours, logging diesel refills, flagging hydraulic faults, and monitoring shift productivity rewards.'
  },
  {
    id: 'p-investor',
    name: 'Investor Portal',
    category: 'Ecosystem & Governance',
    targetAudience: 'Equity Partners, PE Funds, Franchise Investors, Board Directors',
    primaryFeatures: ['Investor Executive Dashboard', 'Capital Deployment Status', 'Yield & ROI Metrics', 'Quarterly Financial Reports', 'Audited Document Room', 'Real-Time Revenue Run-Rate'],
    kpis: [{ label: 'Institutional Investors', value: '65' }, { label: 'Capital Under Management', value: '₹850 Cr' }],
    activeUsers: 65,
    securityLevel: 'L4 C-Suite & Gov Liaison',
    description: 'High-security investor portal providing financial audit trails, ESG compliance reporting, capital return metrics, and live enterprise revenue dashboards.'
  },
  {
    id: 'p-gov',
    name: 'Government Liaison Portal',
    category: 'Ecosystem & Governance',
    targetAudience: 'Mines & Geology Department, GST Inspectors, RTO & Pollution Control Board',
    primaryFeatures: ['E-Royalty Verification', 'Mining Permit Compliance Audit', 'Pollution Control Real-Time Telemetry', 'GST Reconciliation', 'Overload Vehicle Alert Stream'],
    kpis: [{ label: 'Regulatory Bodies Integrated', value: '18 State Depts' }, { label: 'Compliance Audit Score', value: '99.98%' }],
    activeUsers: 18,
    securityLevel: 'L4 C-Suite & Gov Liaison',
    description: 'Regulatory compliance portal enabling government officials to audit e-royalty passes, verify environmental emission telemetry, and inspect vehicle weight logs.'
  },
  {
    id: 'p-partner',
    name: 'Partner Portal',
    category: 'Ecosystem & Governance',
    targetAudience: 'Technology Integrators, Insurance Partners, NBFC Financing Partners',
    primaryFeatures: ['API Credential Management', 'Loan Application Pipeline', 'Equipment Insurance Claims', 'Revenue Sharing Dashboard', 'Webhooks & Event Stream Monitor'],
    kpis: [{ label: 'Fintech & Tech Partners', value: '140' }, { label: 'Loan Disbursements Processed', value: '₹120 Cr' }],
    activeUsers: 140,
    securityLevel: 'L3 Sensitive Partner',
    description: 'Ecosystem partner portal for banks, NBFCs, and insurance firms to process working capital loans, verify tipper assets, and integrate custom APIs.'
  },
  {
    id: 'p-franchise',
    name: 'Franchise Portal',
    category: 'Commercial & Sales',
    targetAudience: 'Minetrix Hub Franchise Owners, Regional Store Managers',
    primaryFeatures: ['Franchise Store Operations', 'Local Yard Inventory', 'Counter POS Sales', 'Royalty Fee Ledger', 'Brand Marketing Collaterals', 'Franchise Profitability'],
    kpis: [{ label: 'Minetrix Franchise Hubs', value: '85' }, { label: 'Avg Hub Monthly Profit', value: '₹8.5 Lakh' }],
    activeUsers: 85,
    securityLevel: 'L2 Business B2B',
    description: 'Franchise management portal providing local Minetrix hub owners tools to run counter POS sales, manage yard stock, and track franchise profit shares.'
  },
  {
    id: 'p-vendor',
    name: 'Vendor Portal',
    category: 'Ecosystem & Governance',
    targetAudience: 'Third-Party Service Vendors, Facility Management, IT Vendors',
    primaryFeatures: ['RFP & Tender Bidding', 'Work Order Contracts', 'Milestone Invoicing', 'Service Level Agreement (SLA) Monitor', 'Payment Status'],
    kpis: [{ label: 'Active Vendors', value: '450' }, { label: 'SLA Adherence', value: '97.5%' }],
    activeUsers: 450,
    securityLevel: 'L2 Business B2B',
    description: 'Vendor portal for participating in open tenders, uploading work completion proof, tracking invoice approvals, and monitoring SLA performance.'
  },
  {
    id: 'p-service',
    name: 'Service Provider Portal',
    category: 'Ecosystem & Governance',
    targetAudience: 'Machinery Repair Technicians, Tire Service Mechanics, Calibration Engineers',
    primaryFeatures: ['Breakdown Service Orders', 'Technician Dispatch', 'Spare Parts Requisition', 'Job Sheet Sign-off', 'Service Rating & Instant Payouts'],
    kpis: [{ label: 'Certified Service Techs', value: '780' }, { label: 'Avg Breakdown Resolution', value: '45 mins' }],
    activeUsers: 780,
    securityLevel: 'L2 Business B2B',
    description: 'Field service portal for equipment repair technicians to accept emergency quarry breakdown calls, request spare parts, and receive instant work payouts.'
  }
];

export const MOCK_PORTAL_MODULES: PortalModuleDefinition[] = [
  {
    moduleId: 1,
    title: 'Customer Self-Service Portal',
    category: 'Customer Experience',
    subModules: ['Profile Management', 'Order Engine', 'Invoices & Tax', 'Payment Gateways', 'Delivery GPS Tracking', 'Material BOQ Calculator', 'AI Assistant', 'Support Desk', 'Warranty Vault', 'Repeat Orders', 'Wishlist & Saved Projects'],
    keyCapabilities: ['Direct B2C/B2B material ordering with live aggregate rate calculator', 'Instant GST invoice generation & UPI/Escrow payments', 'Real-time truck location on interactive map with ETA alerts', 'One-click repeat order placement for construction sites'],
    ecosystemIntegrations: ['Building Materials Suite', 'CRM Suite', 'Finance Suite', 'GPS Telematics Engine'],
    aiFeatures: ['AI Material Requirement Estimator based on plot square-footage', 'Voice-guided material ordering in regional languages'],
    description: 'Complete digital experience suite empowering individual home builders and commercial buyers to order, pay, track, and manage aggregate purchases.'
  },
  {
    moduleId: 2,
    title: 'Dealer Self-Service Portal',
    category: 'Dealer Network',
    subModules: ['Dealer Dashboard', 'Live Yard Stock', 'Bulk Order Booking', 'Credit Headroom', 'Ledger & Statements', 'Promotions & Schemes', 'Rebates & Claims', 'Dealer Analytics'],
    keyCapabilities: ['Real-time credit limit checking with instant credit enhancement requests', 'Multi-yard stock availability lookup across regional crushers', 'Automated quarterly rebate calculation & claim processing'],
    ecosystemIntegrations: ['CRM Suite', 'Finance Suite', 'Inventory Masters', 'Banking Gateway'],
    aiFeatures: ['Predictive stock replenishment recommendations for peak construction seasons'],
    description: 'B2B commercial portal designed for aggregate dealers to streamline credit lines, book bulk dispatches, and track sales performance.'
  },
  {
    moduleId: 3,
    title: 'Supplier Self-Service Portal',
    category: 'Supplier & Vendor',
    subModules: ['Purchase Orders Queue', 'Delivery Confirmations', 'Automated Invoicing', 'Instant Payouts', 'Vendor Rating Matrix', 'Performance Scorecard', 'Document Vault', 'Settlements'],
    keyCapabilities: ['Bi-directional PO confirmation and digital delivery challan upload', 'Automated 3-way matching between PO, Weighbridge Slip, and Invoice', 'Instant vendor payouts upon gate arrival verification'],
    ecosystemIntegrations: ['Procurement Engine', 'Finance Suite', 'Weighbridge System', 'Shared Core DMS'],
    aiFeatures: ['AI-driven vendor reliability score based on past delivery timeliness and material quality'],
    description: 'Supply chain collaboration portal enabling vendors to receive POs, submit digital invoices, and get instant payment settlements.'
  },
  {
    moduleId: 4,
    title: 'Quarry Owner Portal',
    category: 'Mine Operations',
    subModules: ['Production Summary', 'Stockpiles', 'Dispatch Queue', 'Orders Overview', 'E-Royalty & Permits', 'Expense Ledger', 'Machine Status', 'Yield Reports'],
    keyCapabilities: ['Live monitoring of rock excavation volume in Metric Tons', 'Automated e-royalty pass generation synced with state mining department', 'Real-time crusher feed queue and pit face safety status'],
    ecosystemIntegrations: ['Mining Suite', 'Government Liaison Engine', 'Fleet Suite', 'Shared Core Auth'],
    aiFeatures: ['AI blasting yield optimizer predicting rock fragmentation quality'],
    description: 'Executive portal for quarry lease holders offering complete visibility over daily pit excavation, royalty compliance, and crusher feed logistics.'
  },
  {
    moduleId: 5,
    title: 'Crusher Owner Portal',
    category: 'Processing & Plant',
    subModules: ['Feed & Output Telemetry', 'Sized Stockpiles', 'Dispatch Sales Slips', 'Jaw/Cone Machine Health', 'Preventive Maintenance', 'Fuel & Power Audit', 'OEE Analytics'],
    keyCapabilities: ['Overall Equipment Effectiveness (OEE) tracking for primary and secondary crushers', 'Sieve size aggregate distribution monitor (20mm, 10mm, GSB, M-Sand)', 'Power consumption efficiency tracking per Metric Ton processed'],
    ecosystemIntegrations: ['Building Materials Suite', 'IoT Sensor Stream', 'Finance Suite', 'Asset Management'],
    aiFeatures: ['Predictive maintenance alerts for liner wear and crusher mantle replacement'],
    description: 'Plant management portal monitoring crusher throughput, power efficiency, aggregate size gradations, and preventive maintenance.'
  },
  {
    moduleId: 6,
    title: 'Fleet Owner Portal',
    category: 'Fleet & Logistics',
    subModules: ['Fleet Operations Dashboard', 'Trip Queue', 'Driver Roster', 'Vehicle Telematics', 'GPS Route Optimizer', 'Fuel Card Analytics', 'Maintenance Log', 'Driver Settlements'],
    keyCapabilities: ['Live GPS tracking of 100+ tippers on a unified spatial map', 'Automated trip margin calculation considering fuel consumed, driver wage, and toll', 'Instant driver wallet payout upon trip completion verification'],
    ecosystemIntegrations: ['Fleet Suite', 'GPS Telematics', 'Fuel Card API', 'Driver Wallet Engine'],
    aiFeatures: ['AI route optimization considering road weight restrictions and traffic density'],
    description: 'Logistics portal for transport fleet owners to dispatch trucks, track fuel efficiency, optimize haulage routes, and settle driver wages.'
  },
  {
    moduleId: 7,
    title: 'Driver Self-Service Portal',
    category: 'Field Workforce',
    subModules: ['Assigned Trips', 'Trip Earnings', 'Biometric Punch', 'Mobile Wallet', 'Document Locker', 'License Expiry Alerts', 'Safety Training', 'SOS Support'],
    keyCapabilities: ['Mobile-optimized trip acceptance with turn-by-turn quarry navigation', 'Instant wallet credit for trip allowance and performance bonus', 'Digital document locker storing DL, RC, Fitness, and Insurance'],
    ecosystemIntegrations: ['Fleet Suite', 'HRMS Suite', 'UPI Payout Engine', 'Mobile Platform'],
    aiFeatures: ['Voice-guided trip instructions in Hindi, Marwari, Gujarati, and Tamil'],
    description: 'Personal mobility portal for heavy tipper drivers to manage trip assignments, view daily earnings, and access instant wallet withdrawals.'
  },
  {
    moduleId: 8,
    title: 'Operator Self-Service Portal',
    category: 'Field Workforce',
    subModules: ['Machine Run Hours', 'Shift Duty Roster', 'Productivity Targets', 'Fuel Dispense Log', 'Maintenance Tickets', 'Safety Badges'],
    keyCapabilities: ['Digital logbook for recording engine run-hours and hydraulic fluid levels', 'Instant breakdown ticket logging with photo proof', 'Shift productivity incentive tracking'],
    ecosystemIntegrations: ['Mining Operations', 'HRMS Suite', 'Asset Telematics'],
    aiFeatures: ['AI fuel theft detection analyzing idle run-time vs fuel level drops'],
    description: 'Equipment operator portal for logging machine hours, recording diesel refills, and flagging hydraulic maintenance issues.'
  },
  {
    moduleId: 9,
    title: 'Contractor Self-Service Portal',
    category: 'Projects & Infrastructure',
    subModules: ['Project Dashboard', 'BOQ Management', 'Material Orders', 'Labour Allocation', 'Equipment Rentals', 'Progress Payments', 'GST Invoices'],
    keyCapabilities: ['BOQ material tracking with automated reorder triggers when reserves fall below 15%', 'Sub-contractor manpower and machinery deployment reconciliation', 'Milestone-based progress payment requests'],
    ecosystemIntegrations: ['Building Materials Suite', 'Marketplace Suite', 'Finance Suite'],
    aiFeatures: ['AI project delay predictor based on material dispatch speeds'],
    description: 'Construction portal for EPC contractors to manage project BOQs, order aggregates, allocate site labour, and reconcile progress bills.'
  },
  {
    moduleId: 10,
    title: 'Builder Self-Service Portal',
    category: 'Projects & Construction',
    subModules: ['Multi-Site Overview', 'Material Schedules', 'Bulk Concrete/Sand Booking', 'Delivery Staggering', 'Budget vs Actual', 'Lab Quality Reports'],
    keyCapabilities: ['Staggered dispatch scheduling to prevent site traffic congestion', 'Access to certified laboratory aggregate test reports for structural engineering', 'Real-time project budget variance tracking'],
    ecosystemIntegrations: ['CRM Suite', 'Building Materials Suite', 'Quality Control Masters'],
    aiFeatures: ['AI concrete curing & material dispatch scheduling advisor'],
    description: 'Real estate builder portal for scheduling staggered material dispatches, inspecting lab strength reports, and controlling site budgets.'
  },
  {
    moduleId: 11,
    title: 'Investor Self-Service Portal',
    category: 'Governance & Finance',
    subModules: ['Investment Dashboard', 'Projects Portfolio', 'Returns & Dividends', 'Data Room & Audit Docs', 'Quarterly Statements', 'ESG Compliance Scorecard'],
    keyCapabilities: ['Real-time IRR and ROI tracking across funded quarry and fleet assets', 'Secure virtual data room for accessing audited financial statements', 'ESG environmental sustainability compliance metrics'],
    ecosystemIntegrations: ['Finance Suite', 'Enterprise Admin', 'Shared Core DMS'],
    aiFeatures: ['AI executive summary generation summarizing quarterly operational performance'],
    description: 'C-Suite and institutional investor portal providing secure financial reporting, capital return analytics, and ESG compliance tracking.'
  },
  {
    moduleId: 12,
    title: 'Service Provider Portal',
    category: 'Ecosystem Services',
    subModules: ['Work Orders Queue', 'Technician Dispatch', 'Invoices & Payouts', 'Spare Parts Requisition', 'Rating Scorecard', 'Technical Support'],
    keyCapabilities: ['Emergency breakdown dispatch job acceptance with GPS location', 'In-app spare part ordering from authorized Minetrix store', 'Instant technician payment upon digital customer sign-off'],
    ecosystemIntegrations: ['Marketplace Suite', 'Asset Management', 'Finance Suite'],
    aiFeatures: ['AI spare part recommendation engine based on equipment fault codes'],
    description: 'Specialized portal for machinery repair technicians and service agencies to manage emergency breakdown calls and spare parts.'
  },
  {
    moduleId: 13,
    title: 'Enterprise Support Center & Desk',
    category: 'Support & Experience',
    subModules: ['Omnichannel Help Desk', 'Ticket Queue', 'Knowledge Base KB', 'AI Copilot Chatbot', 'Live Agent Escalation', 'Voice Support Integration'],
    keyCapabilities: ['Omnichannel ticket creation via Portal, WhatsApp, Call, or App', 'AI Chatbot auto-resolving 80%+ of routine delivery & invoice queries', 'SLA-based priority routing for critical weighbridge disputes'],
    ecosystemIntegrations: ['Notification Engine', 'CRM Suite', 'AI Platform'],
    aiFeatures: ['NLP Sentiment analysis routing dissatisfied customers to senior managers instantly'],
    description: 'Centralized help desk and AI assistant platform handling multi-portal support tickets, live agent chats, and knowledge base articles.'
  },
  {
    moduleId: 14,
    title: 'Document Center & OCR Engine',
    category: 'Document Management',
    subModules: ['Contract Vault', 'Tax Invoices', 'Certificates & Permits', 'Reports Archive', 'Digital Signature Pad', 'OCR Vector Search'],
    keyCapabilities: ['Aadhaar & PAN OCR auto-verification for swift vendor/driver onboarding', 'Aadhaar-based eSign and digital cryptographic signature on contracts', 'Full-text vector search across millions of scanned PDF challans'],
    ecosystemIntegrations: ['Shared Core DMS', 'Security & Auth', 'Government Verification APIs'],
    aiFeatures: ['AI document parser extracting vehicle registration numbers, tax amounts, and dates'],
    description: 'Enterprise document repository with OCR text extraction, cryptographic digital signatures, and automated compliance indexing.'
  },
  {
    moduleId: 15,
    title: 'AI Portal Assistant & Natural Language Engine',
    category: 'AI Experience',
    subModules: ['Voice Assistant', 'AI Semantic Search', 'Personalized Recommendations', 'Document Synthesizer', 'Natural Language SQL Queries'],
    keyCapabilities: ['Ask questions like "Show me all unpaid aggregate invoices for Chittorgarh Site"', 'Voice-based material search in 6 regional Indian languages', 'Proactive alerts for expiring quarry permits and credit limit thresholds'],
    ecosystemIntegrations: ['Enterprise AI Platform', 'All 23 Portals', 'Data Lakehouse'],
    aiFeatures: ['Gemini 1.5 Flash powered conversational assistant embedded in every portal header'],
    description: 'Embedded AI assistant offering voice search, natural language queries, document summarization, and proactive business insights.'
  },
  {
    moduleId: 16,
    title: 'Omnichannel Notification Center',
    category: 'Communication',
    subModules: ['WhatsApp Business API', 'Transactional Email', 'SMS Gateway', 'Mobile Push Notifications', 'Critical Incident Alerts', 'Approval Workflows'],
    keyCapabilities: ['Instant WhatsApp dispatch of Weighbridge PDF Slips and GST Invoices', 'Push notifications for truck gate arrival and payment disbursements', 'Multi-channel broadcast alerts for quarry emergency blasts'],
    ecosystemIntegrations: ['Notification Engine', 'WhatsApp Gateway', 'SMS/Email Providers'],
    aiFeatures: ['AI notification timing optimizer delivering alerts when users are most active'],
    description: 'Multi-channel messaging hub delivering WhatsApp messages, SMS alerts, push notifications, and email reports across all portals.'
  },
  {
    moduleId: 17,
    title: 'Portal Security, RBAC & Device Trust',
    category: 'Security & Governance',
    subModules: ['Role-Based Access Control (RBAC)', 'Multi-Factor Auth (MFA)', 'Cryptographic Audit Trail', 'Device Fingerprinting & Binding', 'Session Governance'],
    keyCapabilities: ['Granular role-based permissions across 23 distinct portal personas', 'Hardware device binding ensuring sensitive portal logins only occur from registered devices', 'Immutable cryptographic audit logging for every financial edit'],
    ecosystemIntegrations: ['Shared Core Security', 'PostgreSQL RLS', 'Identity Provider'],
    aiFeatures: ['AI anomaly detector flagging suspicious login attempts from unrecognized IP ranges'],
    description: 'Enterprise security architecture enforcing RBAC, MFA, device fingerprinting, and tamper-evident audit logging.'
  },
  {
    moduleId: 18,
    title: 'Bi-Directional Ecosystem Integration Bridge',
    category: 'Ecosystem Bridge',
    subModules: ['Portal ↔ Mining Bridge', 'Portal ↔ Fleet Bridge', 'Portal ↔ Materials Bridge', 'Portal ↔ CRM Bridge', 'Portal ↔ Marketplace Bridge', 'Portal ↔ Finance Bridge', 'Portal ↔ HRMS Bridge', 'Portal ↔ AI Bridge', 'Portal ↔ iPaaS Integration'],
    keyCapabilities: ['Zero-latency event streaming between self-service portals and core DDD engines', 'Transactional consistency across orders, inventory deduction, and ledger posts', 'REST and gRPC webhooks for external ERP & banking integrations'],
    ecosystemIntegrations: ['Integration Gateway Phase 25', 'All 10 DDD Bounded Contexts', 'Kafka Event Bus'],
    aiFeatures: ['Auto-healing event bus retrying failed webhook dispatches with exponential backoff'],
    description: 'Universal event integration bridge connecting all 23 self-service portals to back-end Mining, Fleet, Finance, HRMS, and CRM platforms.'
  },
  {
    moduleId: 26,
    title: 'Unified Digital Workspace',
    category: 'Workspace & Productivity',
    subModules: ['Personal Dashboard', 'My Tasks', 'My Orders', 'My Quotations', 'My Deliveries', 'My Invoices', 'My Payments', 'My Wallet', 'My Documents', 'My Calendar', 'My Notifications', 'My AI Assistant', 'My Reports', 'My KPIs'],
    keyCapabilities: ['Single pane-of-glass personalized workspace aggregating user-specific tasks, pending approvals, active deliveries, and wallet balance', 'Universal drag-and-drop task kanban with automated SLA reminders', 'Integrated multi-tier financial ledger and document shortcut drawer'],
    ecosystemIntegrations: ['All 23 Portals', 'Identity Engine', 'DMS', 'Finance Ledger'],
    aiFeatures: ['AI daily morning debrief summarizing priority actions, urgent deliveries, and pending invoices'],
    description: 'Unified command workspace bringing personal tasks, live orders, wallet balances, schedules, and AI suggestions into a single hub.'
  },
  {
    moduleId: 27,
    title: 'Business Collaboration Hub',
    category: 'Collaboration & Chat',
    subModules: ['Internal Chat', 'Business Chat', 'Customer Chat', 'Supplier Chat', 'Dealer Chat', 'Contractor Chat', 'Group Discussions', 'File Sharing', 'Task Sharing', 'Shared Calendar', 'Activity Timeline', 'Announcement Board'],
    keyCapabilities: ['Context-aware chat threads directly linked to specific POs, Weighbridge Slips, and BOQ lines', 'Instant file drop and AutoCAD dwg drawing previews inside chat windows', 'Enterprise-wide announcement board with broadcast receipt verification'],
    ecosystemIntegrations: ['Notification Engine', 'DMS', 'CRM Suite', 'Project Management'],
    aiFeatures: ['AI Chat Summarizer generating key decision summaries from long group discussion threads'],
    description: 'Enterprise business messaging and collaboration platform supporting direct customer, dealer, supplier, contractor, and internal team threads.'
  },
  {
    moduleId: 28,
    title: 'Public Digital Commerce',
    category: 'Commerce & Marketplace',
    subModules: ['Public Laterite Stone Ordering', 'Public Crusher Product Ordering', 'Public Building Materials Store', 'Public Vehicle Booking', 'Public Equipment Rental', 'Public Load Booking', 'Public Load Tracking', 'Guest Checkout', 'Customer Registration', 'Online Quotations'],
    keyCapabilities: ['Guest checkout flow with instant SMS OTP validation for direct material or rental booking', 'Live catalog of laterite blocks, aggregates, M-sand, heavy excavators, and tipper rentals', 'Instant online quotation generator with volume-discount pricing rules'],
    ecosystemIntegrations: ['Building Materials Suite', 'Marketplace Suite', 'UPI/PG Gateways', 'Logistics Engine'],
    aiFeatures: ['AI dynamic pricing engine optimizing aggregate rates based on real-time haul distance and quarry load'],
    description: 'Public-facing digital store enabling guest buyers, contractors, and transporters to book materials, rent machinery, and generate formal quotations.'
  },
  {
    moduleId: 29,
    title: 'Construction Project Portal',
    category: 'Projects & Engineering',
    subModules: ['Project Dashboard', 'BOQ Upload', 'Material Estimation', 'Project Timeline', 'Material Orders', 'Delivery Tracking', 'Budget Monitoring', 'AI Cost Estimation', 'Progress Reports'],
    keyCapabilities: ['Automated PDF/Excel BOQ parser calculating exact stone, sand, and concrete requirements', 'Gantt chart timeline tracking material delivery milestones against site pouring schedules', 'AI-driven cost over-run warning system highlighting variance between BOQ budget and actual spend'],
    ecosystemIntegrations: ['Building Materials Suite', 'DMS', 'Contractor Suite', 'Finance Suite'],
    aiFeatures: ['AI Cost Estimator predicting aggregate price volatility over multi-year infrastructure timelines'],
    description: 'Project engineering portal for contractors and developers to parse BOQs, estimate material demand, track site progress, and control costs.'
  },
  {
    moduleId: 30,
    title: 'Smart Procurement Portal',
    category: 'Procurement & Sourcing',
    subModules: ['Purchase Requests', 'RFQ', 'Quotation Comparison', 'Vendor Selection', 'Purchase Approval', 'Purchase Tracking', 'Supplier Performance'],
    keyCapabilities: ['Automated RFQ distribution to vetted suppliers with side-by-side bid comparison matrix', 'Multi-level threshold purchase approval matrix with digital sign-offs', 'Vendor performance scorecard tracking quality, lead time, and price competitiveness'],
    ecosystemIntegrations: ['Procurement Suite', 'Finance Suite', 'DMS', 'Supplier Portal'],
    aiFeatures: ['AI Bid Analyzer identifying anomalous vendor pricing and recommending optimal award split'],
    description: 'Strategic sourcing portal simplifying purchase requisitions, RFQ bidding, bid comparisons, purchase approvals, and supplier scorecards.'
  },
  {
    moduleId: 31,
    title: 'Digital Document Center & CAD Vault',
    category: 'Document Management',
    subModules: ['Contracts', 'Agreements', 'Invoices', 'Certificates', 'Reports', 'Drawings', 'AutoCAD Files', 'BOQ Files', 'OCR Search', 'Digital Signature', 'Version Control'],
    keyCapabilities: ['Integrated AutoCAD .dwg and 3D CAD viewer directly in browser without external plugins', 'Cryptographic Aadhaar/eID digital signing on agreements and quarry lease deeds', 'Full-text OCR vector index searching millions of scanned paper bills and test certificates'],
    ecosystemIntegrations: ['DMS Engine', 'Legal & Compliance', 'Security Auth', 'Government Portals'],
    aiFeatures: ['AI CAD Parser automatically extracting structural material specifications from engineering drawings'],
    description: 'Document vault handling contracts, AutoCAD drawings, BOQs, tax invoices, version histories, and vector OCR search.'
  },
  {
    moduleId: 32,
    title: 'AI Digital Assistant & Copilot',
    category: 'AI Experience',
    subModules: ['Voice Assistant', 'AI Search', 'Document Chat', 'AI Recommendations', 'AI Notifications', 'AI Report Generator', 'Natural Language Queries', 'Translation Assistant'],
    keyCapabilities: ['Multi-lingual voice assistant in 8 regional Indian languages for field operators and drivers', 'Chat with PDF/CAD documents asking specific questions about quarry lease covenants', 'Natural language text-to-SQL report generator converting plain text queries into live charts'],
    ecosystemIntegrations: ['Gemini 1.5/2.0 API', 'All 23 Portals', 'Data Lakehouse', 'DMS'],
    aiFeatures: ['Real-time audio translation bridging communication between quarry workers and foreign equipment engineers'],
    description: 'Conversational AI copilot providing voice search, document chat, natural language reporting, and multi-lingual translation.'
  },
  {
    moduleId: 33,
    title: 'Digital Experience Platform (DXP)',
    category: 'Experience & Personalization',
    subModules: ['Personalized Home', 'Role Based Widgets', 'Favorites', 'Recent Activities', 'Quick Actions', 'Bookmarks', 'Dark Mode', 'Accessibility Support'],
    keyCapabilities: ['Customizable drag-and-drop widget layout tailored to each user role and operational domain', 'WCAG 2.1 AA accessibility compliance with high-contrast, screen-reader, and keyboard modes', 'Smart quick-action floating bar for instant order booking and ticket creation'],
    ecosystemIntegrations: ['Frontend DXP Engine', 'Identity Provider', 'User Preference Store'],
    aiFeatures: ['AI layout engine dynamically surfacing the most relevant widgets based on daily workflow patterns'],
    description: 'Digital experience layer delivering personalized dashboards, role-based widgets, dark/light themes, and accessibility controls.'
  },
  {
    moduleId: 34,
    title: 'Customer Success Platform',
    category: 'Customer Experience',
    subModules: ['Support Tickets', 'Warranty', 'AMC', 'Complaint Management', 'Feedback', 'Ratings', 'CSAT', 'NPS', 'AI Support Suggestions'],
    keyCapabilities: ['End-to-end complaint management with automated SLA escalation rules', 'Digital warranty & Annual Maintenance Contract (AMC) tracking for crushers and vehicles', 'Post-delivery CSAT & NPS survey loops integrated into WhatsApp and portal app'],
    ecosystemIntegrations: ['CRM Suite', 'Support Desk', 'WhatsApp Business API'],
    aiFeatures: ['AI Support Suggestion engine auto-recommending ticket resolution steps to support agents'],
    description: 'Customer success suite managing support tickets, aggregate warranty claims, AMC schedules, complaints, and CSAT scores.'
  },
  {
    moduleId: 35,
    title: 'Dealer Success Platform',
    category: 'Dealer Network',
    subModules: ['Dealer Targets', 'Dealer Incentives', 'Sales Analytics', 'Marketing Materials', 'Training Videos', 'Reward Program', 'AI Sales Suggestions'],
    keyCapabilities: ['Real-time target vs actual sales tracker with automated tier progress badges', 'Digital marketing asset repository with co-brandable banners and social media templates', 'Dealer reward point wallet convertible to cash discounts or equipment upgrades'],
    ecosystemIntegrations: ['CRM Suite', 'Finance Suite', 'LMS Engine', 'Reward Wallet'],
    aiFeatures: ['AI Sales Suggestion assistant identifying under-penetrated zip codes and high-margin product opportunities'],
    description: 'Dealer growth platform providing targets, incentive calculators, marketing assets, training academies, and AI sales tips.'
  },
  {
    moduleId: 36,
    title: 'Supplier Success Platform',
    category: 'Supplier & Vendor',
    subModules: ['Supplier Dashboard', 'Purchase Orders', 'Payments', 'Performance Score', 'Quality Rating', 'Settlement', 'Forecast Demand'],
    keyCapabilities: ['3-month rolling material and spare part demand forecasts enabling suppliers to pre-stock inventory', 'Transparent quality defect rating and weighbridge variance reporting', 'Automated early payment discount program allowing suppliers to receive immediate payouts for a small fee'],
    ecosystemIntegrations: ['Procurement Suite', 'Finance Suite', 'Weighbridge System', 'Supply Chain Engine'],
    aiFeatures: ['AI Demand Forecasting predicting explosive and fuel requirement peaks across regional quarry clusters'],
    description: 'Supplier enablement portal offering demand forecasts, transparent performance ratings, PO tracking, and early payment settlements.'
  },
  {
    moduleId: 37,
    title: 'Executive Experience Center',
    category: 'C-Suite Command',
    subModules: ['CEO Workspace', 'COO Workspace', 'CFO Workspace', 'CHRO Workspace', 'Sales Dashboard', 'Operations Dashboard', 'Marketplace Dashboard', 'AI Executive Insights'],
    keyCapabilities: ['Custom executive views designed specifically for CEO (Growth/EBITDA), COO (Yield/OEE), CFO (Cash Flow/Credit), and CHRO (Manpower/Safety)', 'AI Executive Briefing audio stream summarizing top 3 risks and achievements every morning', 'Real-time cross-domain marketplace and quarry cluster heatmaps'],
    ecosystemIntegrations: ['Data Lakehouse', 'All 10 DDD Domains', 'Finance Suite', 'HRMS Suite'],
    aiFeatures: ['Gemini Executive AI Copilot answering natural language C-suite strategic queries with drill-down charts'],
    description: 'Strategic C-suite command center with specialized CEO, COO, CFO, and CHRO workspaces, real-time KPIs, and AI executive summaries.'
  },
  {
    moduleId: 38,
    title: 'Portal Security Center',
    category: 'Security & Compliance',
    subModules: ['MFA', 'Device Trust', 'Session Management', 'Access Logs', 'Role Based Access', 'Audit Trail'],
    keyCapabilities: ['Biometric & TOTP multi-factor authentication across all 23 portal roles', 'Hardware device trust binding preventing unauthorized logins from untrusted terminals', 'Immutable cryptographically signed audit trail recording every financial transaction and permission change'],
    ecosystemIntegrations: ['Security & Auth Suite', 'PostgreSQL RLS', 'SIEM Engine'],
    aiFeatures: ['AI Anomaly Detection flagging suspicious bulk data download attempts or simultaneous login geolocations'],
    description: 'Security governance hub providing MFA, device trust rules, active session kill switches, access logs, and audit trails.'
  },
  {
    moduleId: 39,
    title: 'White Label Portal & Branding Engine',
    category: 'White Label & Multi-Tenant',
    subModules: ['Tenant Branding', 'Custom Domain', 'Themes', 'Logo', 'Portal Colors', 'Email Branding', 'Portal Templates'],
    keyCapabilities: ['Multi-tenant white labeling allowing partner joint-ventures to run on custom domains with custom logos, CSS themes, and favicon sets', 'Custom SMTP email & WhatsApp branding templates with partner headers', 'Instant theme switcher supporting dark, light, emerald, amber, and midnight palettes'],
    ecosystemIntegrations: ['Frontend DXP Engine', 'DNS Resolver', 'Notification Gateway'],
    aiFeatures: ['AI Brand Assister automatically extracting brand color palettes from uploaded logo images'],
    description: 'Multi-tenant white-labeling engine enabling customized portal branding, domains, color themes, logos, and email headers.'
  },
  {
    moduleId: 40,
    title: 'Portal Analytics & User Behavior',
    category: 'Analytics & Business Intelligence',
    subModules: ['Portal Usage', 'User Analytics', 'Customer Analytics', 'Dealer Analytics', 'Supplier Analytics', 'Executive Dashboard'],
    keyCapabilities: ['Detailed user funnel conversion analytics for public ordering and dealer checkout flows', 'Heatmap and session duration tracking identifying UX friction points', 'Cohort retention analysis for repeat material buyers and active transport fleets'],
    ecosystemIntegrations: ['Analytics Engine', 'Data Lakehouse', 'Frontend DXP'],
    aiFeatures: ['AI User Churn Predictor flagging dealers or contractors whose portal activity drops by over 30%'],
    description: 'Comprehensive usage analytics platform measuring active sessions, conversion funnels, user retention, and platform health.'
  },
  {
    moduleId: 41,
    title: 'Digital Knowledge Center & SOP Vault',
    category: 'Knowledge & Standard Operating Procedures',
    subModules: ['Knowledge Base', 'FAQs', 'Training Videos', 'Product Catalogs', 'Technical Manuals', 'Mining SOP', 'Fleet SOP', 'Construction Guides', 'AI Knowledge Search'],
    keyCapabilities: ['Comprehensive repository of blasting safety SOPs, crusher maintenance manuals, and concrete mix design guides', 'HD video streaming academy for equipment operator certifications and dealer onboarding', 'Interactive FAQ bot auto-answering technical specifications for M-Sand and GSB aggregates'],
    ecosystemIntegrations: ['DMS', 'AI Platform', 'LMS Engine'],
    aiFeatures: ['AI Semantic Knowledge Search indexing video transcripts and technical PDF manuals for instant answers'],
    description: 'Knowledge and training portal hosting mining SOPs, fleet manuals, video tutorials, product catalogs, and AI semantic search.'
  },
  {
    moduleId: 42,
    title: 'Community Platform & Business Forum',
    category: 'Community & Ecosystem',
    subModules: ['Discussion Forum', 'Community Groups', 'Business Groups', 'Questions & Answers', 'Ideas Portal', 'Success Stories', 'Events'],
    keyCapabilities: ['Peer-to-peer business forum for quarry owners, dealers, contractors, and transport fleet operators', 'Upvotable Ideas Portal for submitting feature requests directly to RZ® Minetrix product engineers', 'Virtual industry event hub for attending mineral summits and equipment expos'],
    ecosystemIntegrations: ['Community Engine', 'CRM Suite', 'Notification Gateway'],
    aiFeatures: ['AI Content Moderation auto-filtering spam, policy violations, and inappropriate forum posts'],
    description: 'Ecosystem community hub connecting quarry operators, contractors, dealers, and fleet owners for discussions, Q&A, and ideas.'
  },
  {
    moduleId: 43,
    title: 'Omnichannel Notification Center',
    category: 'Communications & Alerts',
    subModules: ['WhatsApp', 'Email', 'SMS', 'Push Notifications', 'In-App Notifications', 'Reminder Center', 'Announcement Center'],
    keyCapabilities: ['Unified dispatch queue supporting WhatsApp, SMS, Email, and Push with automatic failover fallback', 'Custom notification template builder with dynamic merge fields (Order #, Driver Name, Weight MT)', 'User notification preference center allowing granularity over SMS vs WhatsApp alerts'],
    ecosystemIntegrations: ['WhatsApp Gateway', 'SMS/Email Services', 'Push Gateway', 'All 23 Portals'],
    aiFeatures: ['AI Delivery Channel Optimizer picking the fastest, highest-open-rate channel per user persona'],
    description: 'Unified notification hub delivering WhatsApp messages, SMS, email receipts, push notifications, and reminder alerts.'
  },
  {
    moduleId: 44,
    title: 'Future Ready DXP & Edge Runtime',
    category: 'Future Ready Tech',
    subModules: ['Progressive Web App (PWA)', 'Offline Viewing', 'Multi Language', 'Multi Currency', 'Voice Navigation', 'AR Ready', 'Digital Twin Ready', 'AI Powered UI'],
    keyCapabilities: ['Progressive Web App (PWA) with offline local SQLite storage for remote quarry sites with zero cellular coverage', 'Multi-currency and multi-language support (English, Hindi, Arabic, Spanish, French, Swahili)', 'Augmented Reality (AR) aggregate stockpile volume estimator using mobile phone camera'],
    ecosystemIntegrations: ['Frontend PWA Framework', 'WebXR/AR Engine', 'Local Cache Database'],
    aiFeatures: ['AI Mobile Camera Vision estimating aggregate stockpile tonnage in real-time via AR camera overlay'],
    description: 'Next-gen DXP supporting PWA offline modes, multi-language/multi-currency, AR camera measurements, and digital twin sync.'
  },
  {
    moduleId: 45,
    title: 'Ecosystem Digital Experience Bridge Matrix',
    category: 'Ecosystem Architecture',
    subModules: ['Portal ↔ Mobile', 'Portal ↔ Mining', 'Portal ↔ Fleet', 'Portal ↔ Building Materials', 'Portal ↔ CRM', 'Portal ↔ Marketplace', 'Portal ↔ Finance', 'Portal ↔ HRMS', 'Portal ↔ AI Platform', 'Portal ↔ Integration Platform'],
    keyCapabilities: ['Universal 10-way bi-directional synchronization connecting portals with every core enterprise bounded context', 'Real-time event streaming via gRPC / WebSockets with guaranteed order delivery', 'Automated reconciliation between front-end portal transactions and back-end ERP financial books'],
    ecosystemIntegrations: ['Integration Gateway Phase 25', 'All Bounded Contexts', 'Kafka Event Stream', 'PostgreSQL RLS'],
    aiFeatures: ['AI Ecosystem Health Monitor auto-detecting message lag or API latency spikes across subsystem bridges'],
    description: 'Bi-directional integration grid unifying all 23 self-service portals with Mobile, Mining, Fleet, Materials, CRM, Finance, and AI engines.'
  }
];

export const MOCK_CUSTOMER_ORDERS: CustomerOrderSample[] = [
  {
    orderId: 'ORD-2026-8810',
    customerName: 'Shree Ram Construction Pvt Ltd',
    projectName: 'Jaipur Expressway Flyover Project',
    materialItem: '20mm Aggregate Stone (Grade A)',
    quantityMt: 450,
    totalAmountInr: 292500,
    paymentStatus: 'Paid via UPI',
    deliveryStatus: 'In Transit (Live GPS)',
    deliveryEta: '25 mins (3 Trucks en route)',
    repeatOrderEligible: true
  },
  {
    orderId: 'ORD-2026-8811',
    customerName: 'Rajesh Buildcon',
    projectName: 'Bhilwara Commercial Hub Sector 4',
    materialItem: 'M-Sand (Manufactured Sand)',
    quantityMt: 280,
    totalAmountInr: 210000,
    paymentStatus: 'Credit Escrow',
    deliveryStatus: 'Weighbridge Dispatched',
    deliveryEta: '45 mins',
    repeatOrderEligible: true
  },
  {
    orderId: 'ORD-2026-8812',
    customerName: 'Anil Kumar (Individual Home Builder)',
    projectName: 'Residential Plot #42, Kota',
    materialItem: 'GSB (Granular Sub-Base)',
    quantityMt: 80,
    totalAmountInr: 52000,
    paymentStatus: 'Paid via UPI',
    deliveryStatus: 'Delivered',
    deliveryEta: 'Delivered Today 08:30 AM',
    repeatOrderEligible: true
  }
];

export const MOCK_DEALER_STATEMENTS: DealerStatementSample[] = [
  {
    dealerId: 'DLR-RAJ-01',
    dealerName: 'Chittorgarh Building Material Depot',
    regionZone: 'Rajasthan South Zone',
    creditLimitInr: 5000000,
    utilizedCreditInr: 3420000,
    availableCreditInr: 1580000,
    incentiveEarningsInr: 185000,
    pendingClaimsCount: 1,
    activePromotionsCount: 3,
    currentTier: 'Diamond Premier'
  },
  {
    dealerId: 'DLR-RAJ-02',
    dealerName: 'Mewar Aggregates & Cement Agency',
    regionZone: 'Bhilwara Central Zone',
    creditLimitInr: 3500000,
    utilizedCreditInr: 2100000,
    availableCreditInr: 1400000,
    incentiveEarningsInr: 112000,
    pendingClaimsCount: 0,
    activePromotionsCount: 2,
    currentTier: 'Platinum Elite'
  }
];

export const MOCK_SUPPLIER_POS: SupplierPOSample[] = [
  {
    poId: 'PO-2026-4410',
    supplierName: 'Gulf Oil & Fuel Corp',
    category: 'Diesel & Fuel',
    poAmountInr: 1250000,
    deliveryStatus: 'Delivered At Quarry',
    vendorRatingStars: 4.9,
    settlementStatus: 'Settled via Instant Payout'
  },
  {
    poId: 'PO-2026-4411',
    supplierName: 'Sandvik Mining Spares Pvt Ltd',
    category: 'Heavy Crusher Spares',
    poAmountInr: 840000,
    deliveryStatus: 'In Transit',
    vendorRatingStars: 4.8,
    settlementStatus: 'Invoice Submitted'
  }
];

export const MOCK_CONTRACTOR_BOQS: ContractorBOQSample[] = [
  {
    projectId: 'PRJ-HWY-09',
    contractorName: 'L&T Infrastructure Construction',
    projectName: 'NH-79 Chittorgarh Bypass 6-Laning',
    boqBudgetInr: 45000000,
    boqSpentInr: 28400000,
    materialRequirementMt: 85000,
    labourCountAssigned: 180,
    equipmentUnitsDeployed: 24,
    completionPercent: 63.1
  }
];

export const MOCK_SUPPORT_TICKETS: SupportTicketSample[] = [
  {
    ticketId: 'TCK-2026-1021',
    portalUser: 'Vikramaditya Singh (Dealer)',
    userRole: 'Dealer',
    subject: 'Request for Credit Limit Enhancement by ₹10 Lakhs',
    category: 'KYC Verification',
    priority: 'High',
    aiDeflected: false,
    status: 'In Progress',
    createdAt: '2026-08-08 08:15 AM'
  },
  {
    ticketId: 'TCK-2026-1022',
    portalUser: 'Sukhwinder Singh (Driver)',
    userRole: 'Driver',
    subject: 'Trip Payout Wallet Credit Status query',
    category: 'Weighbridge Slip Issue',
    priority: 'Medium',
    aiDeflected: true,
    status: 'AI Resolved',
    createdAt: '2026-08-08 08:30 AM'
  }
];

export const MOCK_DOCUMENT_VAULT: DocumentVaultSample[] = [
  {
    docId: 'DOC-2026-901',
    title: 'Bhilwara Pit Block-A Mining Permit & Environmental Clearance',
    docType: 'Quarry Lease Agreement',
    fileSizeMb: 4.8,
    digitallySigned: true,
    ocrSearchIndexed: true,
    securityScope: 'Confidential',
    uploadDate: '2026-01-15'
  },
  {
    docId: 'DOC-2026-902',
    title: 'Tax Invoice & E-Way Bill #INV-8810-2026',
    docType: 'Tax Invoice & GST',
    fileSizeMb: 1.2,
    digitallySigned: true,
    ocrSearchIndexed: true,
    securityScope: 'Restricted B2B',
    uploadDate: '2026-08-08'
  }
];

export const MOCK_PORTAL_METRICS: PortalMetricsSummary = {
  totalPortalsDeployed: 23,
  totalSelfServiceUsers: 128450,
  dailyPortalOrdersVolume: '₹4.82 Cr',
  aiBotDeflectionRate: '84.5%',
  monthlyDocumentsSigned: 42100,
  avgTicketResolutionTime: '12 mins',
  mfaEnforcedUsersPercent: 99.98,
  ecosystemEventsPerDay: '12.4 M'
};

// MODULE 26: UNIFIED DIGITAL WORKSPACE MOCK DATA
export const MOCK_WORKSPACE_TASKS = [
  { id: 'TSK-101', title: 'Approve Quarry Lease Environmental Clearance renewal', priority: 'High', status: 'Pending Approval', dueDate: 'Today 05:00 PM', category: 'Compliance' },
  { id: 'TSK-102', title: 'Review BOQ variance for NH-79 Expressway Flyover', priority: 'Medium', status: 'In Progress', dueDate: 'Tomorrow 11:30 AM', category: 'Engineering' },
  { id: 'TSK-103', title: 'Disburse Dealer Incentive rebate for Mewar Depot', priority: 'Urgent', status: 'Action Required', dueDate: 'Today 02:00 PM', category: 'Finance' }
];

export const MOCK_WORKSPACE_WALLET = {
  balanceInr: 485200,
  escrowInr: 1250000,
  recentTransactions: [
    { txId: 'TX-9011', type: 'Credit (Order Payment)', amount: 292500, date: '2026-08-08 09:12 AM', status: 'Completed' },
    { txId: 'TX-9012', type: 'Debit (Driver Trip Payout)', amount: 18500, date: '2026-08-08 08:45 AM', status: 'Completed' }
  ]
};

// MODULE 27: BUSINESS COLLABORATION CHAT THREADS
export const MOCK_COLLABORATION_THREADS = [
  {
    threadId: 'CHAT-101',
    participant: 'Chittorgarh Building Material Depot (Dealer)',
    channelType: 'Dealer Chat',
    lastMessage: 'Requested additional 100 MT of 20mm aggregate for site #4.',
    timeAgo: '5 mins ago',
    unreadCount: 2,
    linkedItem: 'PO #ORD-2026-8810'
  },
  {
    threadId: 'CHAT-102',
    participant: 'Gulf Oil & Fuel Corp (Supplier)',
    channelType: 'Supplier Chat',
    lastMessage: 'Fuel tanker truck RJ-09-GC-4412 has arrived at Bhilwara Quarry Gate #1.',
    timeAgo: '18 mins ago',
    unreadCount: 0,
    linkedItem: 'PO #PO-2026-4410'
  },
  {
    threadId: 'CHAT-103',
    participant: 'L&T Infrastructure Site Engineers (Contractor)',
    channelType: 'Contractor Chat',
    lastMessage: 'Uploaded AutoCAD drawing file for bridge pillar pour #3.',
    timeAgo: '1 hour ago',
    unreadCount: 1,
    linkedItem: 'Project #PRJ-HWY-09'
  }
];

// MODULE 28: PUBLIC DIGITAL COMMERCE CATALOG
export const MOCK_PUBLIC_COMMERCE_CATALOG = [
  { id: 'PRD-LAT-01', name: 'Premium Laterite Building Blocks (Grade A)', category: 'Laterite Stone', priceInrPerUnit: 42, unit: 'Block (16x8x8 in)', stockAvailable: 12000, minOrder: 500, deliveryTime: 'Same Day Delivery' },
  { id: 'PRD-AGG-20', name: 'VSI 20mm Crushed Blue Metal Aggregate', category: 'Crusher Products', priceInrPerUnit: 650, unit: 'Metric Ton', stockAvailable: 45000, minOrder: 20, deliveryTime: 'Immediate Dispatch' },
  { id: 'PRD-MSND-01', name: 'Washed M-Sand (Manufactured Concrete Sand)', category: 'Crusher Products', priceInrPerUnit: 750, unit: 'Metric Ton', stockAvailable: 28000, minOrder: 20, deliveryTime: 'Immediate Dispatch' },
  { id: 'PRD-EQP-EXC', name: 'CAT 320D Heavy Crawler Excavator Rental', category: 'Equipment Rental', priceInrPerUnit: 2800, unit: 'Engine Hour', stockAvailable: 14, minOrder: 8, deliveryTime: 'Deployable in 2 Hours' },
  { id: 'PRD-VEH-TIP', name: 'Volvo FMX 480 10-Wheeler Tipper Tipper Rental', category: 'Vehicle Rental', priceInrPerUnit: 4500, unit: 'Day + Diesel', stockAvailable: 35, minOrder: 1, deliveryTime: 'Deployable in 1 Hour' }
];

// MODULE 30: SMART PROCUREMENT RFQS
export const MOCK_PROCUREMENT_RFQS = [
  {
    rfqId: 'RFQ-2026-701',
    title: 'Supply of Heavy Jaw Crusher Manganese Liner Plates',
    category: 'Crusher Spares',
    targetDate: '2026-08-15',
    bidsReceived: 4,
    lowestBidInr: 680000,
    status: 'Bidding Open',
    recommendedVendor: 'Sandvik Mining Spares'
  },
  {
    rfqId: 'RFQ-2026-702',
    title: 'Bulk Commercial Diesel Supply for Chittorgarh Quarry Fleet (50,000 Liters)',
    category: 'Fuel & Energy',
    targetDate: '2026-08-12',
    bidsReceived: 3,
    lowestBidInr: 4450000,
    status: 'Evaluation Phase',
    recommendedVendor: 'Gulf Oil Corp'
  }
];

// MODULE 37: EXECUTIVE C-SUITE WORKSPACES
export const MOCK_EXECUTIVE_WORKSPACES = {
  ceo: { focus: 'Enterprise Growth & EBITDA', keyMetric: '₹48.5 Cr Monthly Revenue (+14.2% YoY)', topInsight: 'Quarry Cluster #2 yield increased by 18% after AI blast optimization.' },
  coo: { focus: 'Operations Yield & Crusher OEE', keyMetric: '88.6% Crusher OEE (Target: 85.0%)', topInsight: 'Zero breakdown hours recorded across Bhilwara crushers in the past 7 days.' },
  cfo: { focus: 'Cash Flow & Working Capital', keyMetric: '₹14.2 Cr Days Sales Outstanding (DSO 18 Days)', topInsight: 'Automated dealer early payment discount adoption reduced receivables by ₹2.8 Cr.' },
  chro: { focus: 'Workforce Safety & Compliance', keyMetric: '2,480 Days Lost Time Injury Free', topInsight: '99.8% driver Aadhaar biometric attendance verification completed today.' }
};

// MODULE 39: WHITE LABEL BRANDING CONFIG
export const MOCK_WHITE_LABEL_CONFIG = {
  tenantName: 'Minetrix Rajasthan Infrastructure Joint Venture',
  customDomain: 'portals.minetrix-rajasthan.com',
  primaryColor: '#f59e0b',
  accentColor: '#10b981',
  themeStyle: 'Midnight Luxury Gold',
  customLogoUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=100&auto=format&fit=crop&q=80',
  emailHeaderFooter: 'Branded with Minetrix® Enterprise Partner Crest'
};

// MODULE 41: DIGITAL KNOWLEDGE CENTER & SOPS
export const MOCK_KNOWLEDGE_SOPS = [
  { id: 'SOP-MIN-01', title: 'Quarry Pit Bench Blasting Safety Standard Operating Procedure', category: 'Mining SOP', views: 4200, rating: 4.9 },
  { id: 'SOP-FLT-02', title: 'Heavy Tipper Pre-Trip 21-Point Safety & Brake Check Guide', category: 'Fleet SOP', views: 8900, rating: 5.0 },
  { id: 'SOP-CON-03', title: 'M-Sand vs Natural River Sand Structural Mix Ratio Manual', category: 'Construction Guide', views: 12400, rating: 4.8 }
];

// MODULE 42: COMMUNITY FORUM TOPICS
export const MOCK_COMMUNITY_TOPICS = [
  { id: 'TOP-201', title: 'Best practices for extending jaw crusher manganese liner lifespan in hard granite pits?', author: 'Ramesh Patel (Crusher Operator)', replies: 14, upvotes: 38 },
  { id: 'TOP-202', title: 'How to calculate GST input tax credit on aggregate transport freight charges?', author: 'Sunil Mehta (Dealer)', replies: 9, upvotes: 27 }
];

