import { MiningSuiteModule } from '../types/architecture';

export const MINING_SUITE_MODULES: MiningSuiteModule[] = [
  {
    id: 'executive-dashboard',
    number: 1,
    title: 'Mining Executive Dashboard & Command Center',
    icon: 'LayoutDashboard',
    category: 'Finance & Analytics',
    summary: 'Real-time operational cockpit aggregating quarry tonnage, crusher production throughput, weighbridge gate pass dispatches, machinery utilization, and AI anomaly alerts.',
    subModules: [
      'Production KPIs (Tonnage by Stone/Grade/Quarry)',
      'Sales & Revenue Realization Monitor',
      'Live Weighbridge Gate Pass Dispatch Feed',
      'Machinery Status & Active Breaker/Excavator Map',
      'Operator Attendance & Shift Efficiency',
      'Fuel Consumption & L/Ton Efficiency Tracker',
      'Pending Customer Deliveries & Queue Depth',
      'Raw & Finished Stock Yard Levels',
      'AI Operational Insights & Anomaly Feed'
    ],
    keyCapabilities: [
      'Real-time streaming metrics over WebSockets/SSE from weighbridges and GPS telematics.',
      'Threshold alert cards for low raw feed stock, uncalibrated scales, or high fuel burn.',
      'Executive role-based view customization with branch/quarry filter selectors.',
      'Direct drill-down into active gate passes, machine breakdown tickets, and royalty balances.'
    ],
    masterDataEntities: ['QuarryMaster', 'CrusherPlant', 'ShiftMaster', 'ProductMaster'],
    eventIntegrations: {
      publishes: ['mining.dashboard.viewed'],
      subscribes: ['mining.production.logged', 'mining.gatepass.issued', 'mining.machinery.breakdown']
    },
    sharedCoreDependencies: ['Executive Dashboard Engine (Mod 10)', 'Identity & Auth (Mod 1)'],
    aiFeatures: ['Natural language copilot query for daily yield comparisons', 'Anomaly alert detection']
  },
  {
    id: 'mining-masters',
    number: 2,
    title: 'Quarry & Mining Master Data Management (MDM)',
    icon: 'Database',
    category: 'Operations & Quarry',
    summary: 'Centralized master data repository defining physical quarry sites, crusher plants, stone classifications, product grades, machinery profiles, and tax structures.',
    subModules: [
      'Quarry Master (Site GPS, mineral type, lease ID, capacity)',
      'Crusher Plant Master (Primary/secondary crusher specs, TPH rating)',
      'Stone & Mineral Master (Laterite, Granite, Hard Rock, Blue Metal)',
      'Product Master (GSB, WMM, 10mm, 20mm, 40mm, M-Sand, P-Sand, Crusher Dust)',
      'Grade & Density Specs Master (Specific gravity, moisture tolerance)',
      'Business Unit & Branch Mapping',
      'Tax & Statutory Royalty Master (State royalty per Ton/CFT, GST rates)',
      'Operational Expense Categories',
      'Shift & Roster Master (Day/Night shift timings, break hours)',
      'Machine & Operator Directory',
      'Supplier & Customer Master'
    ],
    keyCapabilities: [
      'Multi-tenant inheritance with global tax reference defaults and tenant-specific site specs.',
      'Strict change data capture (CDC) audit trail on statutory royalty rate modifications.',
      'Multi-UOM conversion factors configured per product (e.g. 1 Ton = 0.72 CFT for 20mm aggregate).'
    ],
    masterDataEntities: ['QuarryMaster', 'CrusherPlant', 'StoneMaster', 'ProductGradeMaster', 'RoyaltyTaxMaster'],
    eventIntegrations: {
      publishes: ['mining.master.quarry_updated', 'mining.master.product_created'],
      subscribes: ['core.master.tax_updated']
    },
    sharedCoreDependencies: ['Shared Master Data Management (Mod 5)', 'Multi-Tenant Platform (Mod 3)'],
  },
  {
    id: 'quarry-management',
    number: 3,
    title: 'Quarry Operations & Mineral Extraction Management',
    icon: 'Pickaxe',
    category: 'Operations & Quarry',
    summary: 'Multi-site quarry management governing laterite cutting, granite block slicing, hard rock blasting, and raw boulder excavation across multiple geographical sites.',
    subModules: [
      'Laterite Quarry Management (Laterite stone cutting, block sizes, dressing logs)',
      'Granite Quarry Management (Dimensional stone blocks, wire-saw cutting, grade sorting)',
      'Hard Rock & Metal Quarry Management (Blasting logs, explosive permits, rock breaking)',
      'Multi-Quarry Portfolio Control',
      'Quarry Operational Status (Active, Maintenance, Environmental Pause)',
      'Quarry Capacity & Reserve Tracking (Mined volume vs remaining reserve)',
      'GPS Boundary & Bench Mapping (3D GIS bench excavation tracking)'
    ],
    keyCapabilities: [
      'Blasting log records tracking explosive usage, hole depth, detonators, and yield tonnage.',
      'Laterite block dressing register tracking dimensional quality (e.g. 30x20x15 cm blocks).',
      'Real-time GPS geofencing mapping active excavation benches and haul road access points.'
    ],
    masterDataEntities: ['QuarrySite', 'ExcavationBench', 'BlastingLog', 'MineralType'],
    eventIntegrations: {
      publishes: ['mining.quarry.blasting_executed', 'mining.quarry.reserve_updated'],
      subscribes: ['mining.compliance.permit_renewed']
    },
    sharedCoreDependencies: ['Document Management System (Mod 7)', 'Audit & Telemetry (Mod 14)'],
    aiFeatures: ['Computer vision block quality grading', 'Yield prediction based on geological rock seam data']
  },
  {
    id: 'crusher-management',
    number: 4,
    title: 'Crusher Plant & Aggregate Processing Management',
    icon: 'Factory',
    category: 'Operations & Quarry',
    summary: 'Secondary manufacturing engine managing primary jaw crushers, cone crushers, VSI units, wet/dry screening, and aggregate wash plants.',
    subModules: [
      'Crusher Plant Operational Control (TPH throughput, jaw gap settings)',
      'Coarse Aggregate Production (40mm, 20mm, 12mm, 6mm blue metal)',
      'Manufactured Sand (M-Sand) Processing & Washing',
      'Plastering Sand (P-Sand) Ultra-Fine Screening',
      'Crusher Dust & Quarry Waste By-Product Tracking',
      'Crusher Feed vs Output Mass Balance Ratio Monitor',
      'Stockpile Production Logging'
    ],
    keyCapabilities: [
      'Mass balance loss calculation comparing raw boulder feed tonnage against total crushed aggregate output.',
      'VSI (Vertical Shaft Impactor) wear part tracker calculating rotor tip replacement intervals per 1,000 tons.',
      'Wet wash plant water consumption and silt recovery pond monitoring.'
    ],
    masterDataEntities: ['CrusherPlant', 'CrusherShiftRun', 'OutputGradationLog'],
    eventIntegrations: {
      publishes: ['mining.crusher.shift_completed', 'mining.crusher.mass_balance_logged'],
      subscribes: ['mining.production.boulder_delivered']
    },
    sharedCoreDependencies: ['Finance Shared Services (Mod 8)', 'Omni-Channel Notifications (Mod 6)'],
    aiFeatures: ['AI particle size distribution analysis', 'Predictive jaw liner replacement forecasting']
  },
  {
    id: 'land-management',
    number: 5,
    title: 'Land Acquisition, Lease & Landowner Royalty Management',
    icon: 'Map',
    category: 'Compliance & Land',
    summary: 'Comprehensive land registry managing mining leases, surface rights, private landowner revenue-sharing agreements, surface rent, and boundary GPS surveys.',
    subModules: [
      'Land Parcel Registry (Survey numbers, acreage, surface ownership)',
      'Landowner Agreement Engine (Fixed monthly rent, per-ton royalty, profit share)',
      'Mining Lease Contract Management (Government lease period, boundary markers)',
      'Royalty & Revenue Sharing Settlement Calculator',
      'Land Document Vault (Title deeds, NOC, land conversion certificates)',
      'GPS Polygon Mapping & Polygon GIS Boundary Surveyor'
    ],
    keyCapabilities: [
      'Automated monthly/quarterly landowner royalty settlement statement generation.',
      'Land lease tenure countdown timers alerting management 180 days prior to lease expiry.',
      'Cadastral survey map attachment with polygon GPS coordinates for dispute resolution.'
    ],
    masterDataEntities: ['LandParcel', 'LandownerAgreement', 'SurfaceLease', 'LandownerSettlement'],
    eventIntegrations: {
      publishes: ['mining.land.settlement_calculated', 'mining.land.lease_expiring'],
      subscribes: ['mining.gatepass.issued']
    },
    sharedCoreDependencies: ['Document Management System (Mod 7)', 'Finance Shared Services (Mod 8)'],
  },
  {
    id: 'mining-compliance',
    number: 6,
    title: 'Mining Statutory Compliance & Environmental Permit Engine',
    icon: 'FileCheck',
    category: 'Compliance & Land',
    summary: 'Regulatory governance engine tracking statutory mining leases, Pollution Control Board (PCB) NOCs, Director General of Mines Safety (DGMS) permits, and statutory e-pass balances.',
    subModules: [
      'Mining License & Quarry Permit Vault',
      'Statutory Government Permit Expiry Alert Engine',
      'Government E-Pass / Royalty Permit Balance Tracker',
      'Environmental Compliance Monitor (Air/water quality, noise levels, tree plantation)',
      'DGMS Explosive Permit & Blasting Manager Certification Register',
      'Statutory Inspection & Audit Response Log'
    ],
    keyCapabilities: [
      'Real-time statutory royalty pass quota monitoring — auto-blocks weighbridge gate passes when pass balance hits zero.',
      'Automated regulatory filing reminder engine for monthly mineral return submissions.',
      'Audit vault maintaining immutable digital copies of environmental clearance certificates.'
    ],
    masterDataEntities: ['MiningLicense', 'RoyaltyPassQuota', 'EnvironmentalNOC', 'ComplianceAuditLog'],
    eventIntegrations: {
      publishes: ['mining.compliance.quota_exhausted', 'mining.compliance.permit_expiring'],
      subscribes: ['mining.gatepass.issued']
    },
    sharedCoreDependencies: ['Omni-Channel Notification Router (Mod 6)', 'Audit & Telemetry (Mod 14)'],
    aiFeatures: ['Automated government regulatory compliance document extraction']
  },
  {
    id: 'production-management',
    number: 7,
    title: 'Daily Quarry & Crusher Production Management',
    icon: 'HardHat',
    category: 'Operations & Quarry',
    summary: 'End-to-end production recorder tracking shift-wise excavation yield, machine production hours, operator output, crusher throughput, and downtime losses.',
    subModules: [
      'Daily Quarry Excavation Production Logging',
      'Shift-wise Crusher Production Recording',
      'Machine-wise Production Tracking (Tons/Hour per Excavator/Breaker)',
      'Operator Yield & Efficiency Recording',
      'Production Target vs Actual Variance Planner',
      'Downtime & Production Loss Classification (Power outage, mechanical, weather)',
      'Shift Handover Logbook'
    ],
    keyCapabilities: [
      'Shift production entry with dual validation (operator entry vs weighbridge tally).',
      'Root-cause categorization for production loss (e.g. 45 mins idle waiting for tippers).',
      'Direct synchronization with inventory stock ledger to update raw and finished yards.'
    ],
    masterDataEntities: ['ProductionRun', 'ShiftLog', 'DowntimeReason', 'MachineOutput'],
    eventIntegrations: {
      publishes: ['mining.production.logged', 'mining.production.downtime_recorded'],
      subscribes: ['core.hr.attendance_logged']
    },
    sharedCoreDependencies: ['HR Shared Services Bridge (Mod 9)', 'Shared Workflow Engine (Mod 16)'],
    aiFeatures: ['AI Production forecast based on weather, machine health, and historical yield']
  },
  {
    id: 'stock-management',
    number: 8,
    title: 'Quarry & Yard Multi-Stock Management',
    icon: 'Layers',
    category: 'Operations & Quarry',
    summary: 'Yard inventory manager tracking raw boulder stockpiles, finished aggregate yards, M-sand washing bays, internal stock movements, and volumetric laser/drone verification.',
    subModules: [
      'Raw Boulder Stockyard Ledger',
      'Finished Aggregate Yard Management (40mm, 20mm, M-sand bays)',
      'Multi-Yard Stock Movement & Transfer Tracking',
      'Stock Adjustment & Moisture Loss Allowance Ledger',
      'Physical Stock Verification & Volumetric Drone/Laser Audit Adapter',
      'Reorder Threshold & Min/Max Buffer Controller'
    ],
    keyCapabilities: [
      'Real-time inventory deduction triggered immediately upon weighbridge gate pass print.',
      'Moisture loss allowance adjustment factor (e.g. 2% weight loss on wet washed M-Sand).',
      'Integration with drone survey 3D mesh files for volumetric stockpile estimations.'
    ],
    masterDataEntities: ['StockYard', 'YardInventoryLedger', 'StockAdjustmentLog', 'StockTransferTicket'],
    eventIntegrations: {
      publishes: ['mining.stock.updated', 'mining.stock.low_buffer_alert'],
      subscribes: ['mining.production.logged', 'mining.gatepass.issued']
    },
    sharedCoreDependencies: ['Shared Master Data Management (Mod 5)', 'Finance Shared Services (Mod 8)'],
    aiFeatures: ['Computer vision stockpile volume estimation']
  },
  {
    id: 'gate-pass',
    number: 9,
    title: 'Weighbridge Gate Pass & Scalehouse Engine',
    icon: 'QrCode',
    category: 'Logistics & Dispatch',
    summary: 'Mission-critical weighbridge kiosk software handling dual-weighing (gross/tare), automatic scale indicator reading, QR/barcode generation, camera snapshot capture, and statutory slip printing.',
    subModules: [
      'Outbound Dispatch Gate Pass (Material sales dispatches)',
      'Inbound Material Gate Pass (Raw boulders, diesel, explosives, spares)',
      'Vehicle & Tipper Number Verification',
      'Sales Order & Customer Linkage',
      'Driver Identity & Mobile App Linkage',
      'QR Code & Barcode Gate Pass Verification',
      'Weighbridge Camera Snapshot & License Plate Capture',
      'Thermal Gate Pass Slip Printing & WhatsApp Pass Dispatch'
    ],
    keyCapabilities: [
      'RS232 / TCP/IP Weighbridge Scale Indicator Direct Driver (Serial protocol integration for tamper-proof weight capture).',
      'Sub-second QR code generation containing encrypted ticket metadata for mobile checkposts.',
      'Automatic Tare Weight caching based on vehicle registration history with variance alert if tare differs by > 2%.'
    ],
    masterDataEntities: ['GatePassTicket', 'WeighbridgeScale', 'VehicleTareCache'],
    eventIntegrations: {
      publishes: ['mining.gatepass.issued', 'mining.gatepass.cancelled'],
      subscribes: ['crm.order.approved', 'fleet.vehicle.assigned']
    },
    sharedCoreDependencies: ['Document Management System (Mod 7)', 'Omni-Channel Notification Router (Mod 6)', 'Gemini AI OCR (Mod 12)'],
    aiFeatures: ['Gemini OCR reading paper slips and vehicle license plates']
  },
  {
    id: 'dispatch-management',
    number: 10,
    title: 'Dispatch Planning & Loading Queue Manager',
    icon: 'Truck',
    category: 'Logistics & Dispatch',
    summary: 'Field dispatch controller managing sales order fulfillment queues, loader machine allocations, vehicle bay routing, dispatch schedules, and delivery tracking.',
    subModules: [
      'Dispatch Order Fulfillment Planner',
      'Vehicle & Tipper Allocation Engine',
      'Driver Assignment & Mobile Notification Push',
      'Wheel Loader Queue & Loading Bay Controller',
      'Delivery Time Schedule & Slot Allocator',
      'Live Dispatch Queue Tracking (At Gate, At Scale, Loading, Dispatched)'
    ],
    keyCapabilities: [
      'Real-time token queue display for field tipper drivers showing loading bay numbers.',
      'Auto-dispatching notification sent to customer WhatsApp with driver phone number and live GPS tracking link.',
      'Integration with Fleet & Logistics suite for internal tipper auto-assignment.'
    ],
    masterDataEntities: ['DispatchQueueItem', 'LoadingBay', 'DeliverySchedule'],
    eventIntegrations: {
      publishes: ['mining.dispatch.queued', 'mining.dispatch.completed'],
      subscribes: ['crm.order.approved', 'fleet.vehicle.available']
    },
    sharedCoreDependencies: ['Shared Workflow Engine (Mod 16)', 'Omni-Channel Notification Router (Mod 6)'],
    aiFeatures: ['Smart dispatch queue optimization reducing tipper turnaround time']
  },
  {
    id: 'quarry-machinery',
    number: 11,
    title: 'Quarry Machinery ERP & Telematics Engine',
    icon: 'Wrench',
    category: 'Fleet & Machinery',
    summary: 'Comprehensive heavy machinery ERP managing excavators, JCBs, rock breakers, drills, wheel loaders, crushers, diesel consumption, maintenance schedules, and breakdown logs.',
    subModules: [
      'Heavy Equipment Directory (Excavators, JCB, Wheel Loaders, Cranes, Bulldozers, Rock Breakers, Drills, Generators)',
      'Crusher Plant Equipment Specs (Conveyors, Screens, Jaw Crushers, VSI)',
      'Hour Meter (HMR) & Odometer Logbook',
      'Diesel Fuel Ingestion & Consumption Log (Liters per Machine Hour)',
      'Preventive Maintenance Schedule & Service Kit Manager',
      'Breakdown Ticket & Job Card Management',
      'Spare Parts Inventory & Reorder Tracker',
      'Annual Maintenance Contract (AMC) & Warranty Manager'
    ],
    keyCapabilities: [
      'HMR (Hour Meter Reading) tracking enforcing maintenance service triggers every 250 machine hours.',
      'Specific Fuel Consumption (SFC) benchmark monitor alerting managers if an excavator burn rate exceeds 18 L/hr.',
      'Breakdown downtime tracking integrated directly into production yield loss analytics.'
    ],
    masterDataEntities: ['MachineryAsset', 'HMRReadingLog', 'FuelLog', 'MaintenanceTicket', 'SparePartItem'],
    eventIntegrations: {
      publishes: ['mining.machinery.hmr_updated', 'mining.machinery.breakdown', 'mining.machinery.service_due'],
      subscribes: ['mining.production.logged']
    },
    sharedCoreDependencies: ['Shared Master Data Management (Mod 5)', 'Omni-Channel Notification Router (Mod 6)'],
    aiFeatures: ['Predictive breakdown risk modeling based on telematics vibratory/temperature sensors']
  },
  {
    id: 'equipment-rental',
    number: 12,
    title: 'Equipment Rental & Machine Hiring Management',
    icon: 'Key',
    category: 'Fleet & Machinery',
    summary: 'Commercial rental management governing external equipment hiring (inward rental) and outbound equipment rental services to third-party contractors.',
    subModules: [
      'Machine Only Rental Contracts',
      'Machine + Operator Rental Bundles',
      'Rate Models (Hourly, Daily, Weekly, Monthly, Project Contract)',
      'Rental Machine Logbook (Active HMR hours vs idle hours)',
      'Rental Billing & Invoicing Engine',
      'Third-Party Vendor Rental Settlement Engine'
    ],
    keyCapabilities: [
      'Minimum guaranteed billing hours enforcement (e.g., minimum 8 hours/day billing even if idle).',
      'Diesel arrangement clauses (Owner Diesel vs Hiring Party Diesel) with automatic fuel deduction reconciliations.',
      'Automated monthly rental invoicing integrated into General Ledger Finance.'
    ],
    masterDataEntities: ['RentalContract', 'RentalLogbookEntry', 'RentalInvoice'],
    eventIntegrations: {
      publishes: ['mining.rental.invoice_generated', 'mining.rental.contract_expired'],
      subscribes: ['mining.machinery.hmr_updated']
    },
    sharedCoreDependencies: ['Finance Shared Services Bridge (Mod 8)', 'Document Management System (Mod 7)'],
  },
  {
    id: 'operators-management',
    number: 13,
    title: 'Machinery Operators & Field Crew Management',
    icon: 'UserCheck',
    category: 'Fleet & Machinery',
    summary: 'Field personnel module managing excavator operators, rock breaker crew, weighbridge clerks, biometric shift attendance, performance incentives, and weekly settlements.',
    subModules: [
      'Machine Operator Directory & License Verifier',
      'Biometric / Mobile Shift Attendance Ingestion',
      'Operator Performance Tracker (Tons moved per hour, diesel efficiency score)',
      'Shift & Machinery Allocation Roster',
      'Trip / Tonnage Operator Incentive Calculator',
      'Weekly Operator Advance & Settlement Engine'
    ],
    keyCapabilities: [
      'Fuel efficiency bonus score calculated automatically per operator based on baseline SFC standards.',
      'Operator-machine pair locking preventing uncertified operators from starting heavy machinery.',
      'Seamless integration with HRMS Payroll engine for monthly salary rollups.'
    ],
    masterDataEntities: ['OperatorProfile', 'OperatorShiftAllocation', 'IncentiveRecord'],
    eventIntegrations: {
      publishes: ['mining.operator.settlement_calculated', 'mining.operator.incentive_earned'],
      subscribes: ['core.hr.attendance_logged']
    },
    sharedCoreDependencies: ['HR Shared Services Bridge (Mod 9)', 'User Management & Linker (Mod 4)'],
  },
  {
    id: 'quarry-finance',
    number: 14,
    title: 'Quarry Financials, Costing & Royalty Accounting',
    icon: 'Receipt',
    category: 'Finance & Analytics',
    summary: 'Specialized quarry cost accounting engine tracking raw material purchases, blasting expenses, statutory royalty fees, diesel costs, cost per ton, and quarry profitability.',
    subModules: [
      'Quarry Purchases & Raw Material Vendor Invoices',
      'Operational Expense Ledger (Explosives, diesel, spare parts, electricity)',
      'Statutory Royalty Fee Accounting & E-Pass Payments',
      'Income & Material Sales Realization Ledger',
      'General Ledger Journal Posting Adapter',
      'Cost Center Accounting (Cost per Ton per Quarry / Crusher)',
      'Quarry & Crusher Profitability Analyzer'
    ],
    keyCapabilities: [
      'Granular Cost-per-Ton breakdown showing Drilling Cost + Blasting Cost + Excavation Fuel + Crusher Power + Royalty = Total Production Cost/Ton.',
      'Automated GST TDS/TCS tax calculations on mineral sales and vendor bills.',
      'Direct double-entry ledger posting into the Shared Core Finance Engine.'
    ],
    masterDataEntities: ['QuarryCostCenter', 'QuarryExpenseInvoice', 'RoyaltyPaymentRecord'],
    eventIntegrations: {
      publishes: ['mining.fin.cost_calculated', 'mining.fin.royalty_paid'],
      subscribes: ['mining.gatepass.issued', 'mining.machinery.fuel_logged']
    },
    sharedCoreDependencies: ['Finance Shared Services Bridge (Mod 8)', 'Shared Master Data Management (Mod 5)'],
  },
  {
    id: 'mining-reports',
    number: 15,
    title: 'Mining Business Intelligence & Compliance Reporting',
    icon: 'BarChart3',
    category: 'Finance & Analytics',
    summary: 'Comprehensive reporting module delivering daily production summaries, machine utilization charts, fuel efficiency trends, royalty statements, and statutory government returns.',
    subModules: [
      'Daily Quarry & Crusher Production Summaries',
      'Monthly Production & Yield Target Variance Reports',
      'Machine Utilization & Idle Time Heatmaps',
      'Fuel Consumption & SFC Efficiency Analysis',
      'Dispatch & Weighbridge Tonnage Analytics',
      'Customer & Product Sales Realization Reports',
      'Stock Yard Valuation & Reconciliation Reports',
      'Statutory Government Mineral Return Reports',
      'Quarry Site Profitability & Margin Reports'
    ],
    keyCapabilities: [
      'Asynchronous report generation supporting streaming PDF and Excel downloads.',
      'Scheduled automated email/WhatsApp dispatch of daily evening production summaries to executives.',
      'Statutory monthly Form-G mineral return formatting compliant with mining department standards.'
    ],
    masterDataEntities: ['ReportTemplate', 'ScheduledReportJob'],
    eventIntegrations: {
      publishes: ['mining.report.generated'],
      subscribes: ['core.report.trigger_requested']
    },
    sharedCoreDependencies: ['Dynamic Reporting Engine (Mod 11)', 'Document Management System (Mod 7)'],
  },
  {
    id: 'mining-ai-features',
    number: 16,
    title: 'Gemini AI Operational Intelligence & Automation Engine',
    icon: 'Sparkles',
    category: 'Finance & Analytics',
    summary: 'Server-side AI suite harnessing Gemini models for predictive machinery breakdown alerts, yield forecasting, weighbridge OCR slip reading, fuel theft anomaly detection, and dispatch route optimization.',
    subModules: [
      'Predictive Machinery Maintenance & Breakdown Risk Forecaster',
      'AI Mineral Yield & Blasting Production Forecaster',
      'Fuel Optimization & Theft Anomaly Detector',
      'Machine Utilization & Fleet Efficiency Analyzer',
      'Stockyard Volume Estimation & Demand Forecaster',
      'Dispatch Queue & Tipper Loading Optimizer',
      'Executive Natural Language Operational Copilot'
    ],
    keyCapabilities: [
      'Server-side Gemini 2.5 Flash execution via `/api/ai/mining/*` routes keeping API keys strictly confidential.',
      'Fuel theft anomaly detector flagging suspicious fuel drops during idle shift hours.',
      'Predictive dispatch load balancer calculating optimal tipper arrival intervals to eliminate weighbridge bottlenecks.'
    ],
    masterDataEntities: ['AIPredictionRun', 'AIAnomalyAlert'],
    eventIntegrations: {
      publishes: ['mining.ai.anomaly_flagged', 'mining.ai.forecast_generated'],
      subscribes: ['mining.production.logged', 'mining.machinery.fuel_logged']
    },
    sharedCoreDependencies: ['Gemini AI Ecosystem (Mod 12)', 'Audit & Telemetry (Mod 14)'],
    aiFeatures: ['Gemini 2.5 Flash / Pro operational copilot', 'Computer vision slip OCR', 'Predictive ML breakdowns']
  }
];

export const MINING_LIFECYCLE_WORKFLOWS = [
  {
    step: 1,
    title: '1. Land & Permitting',
    subtitle: 'Acquisition & Regulatory Clearance',
    description: 'Acquire land parcel, execute landowner revenue-share agreement, secure Pollution Control Board (PCB) NOC, DGMS explosive permit, and government mining lease.',
    icon: 'Map',
    entities: ['LandParcel', 'MiningLicense', 'RoyaltyPassQuota'],
    events: ['mining.land.lease_executed', 'mining.compliance.permit_issued']
  },
  {
    step: 2,
    title: '2. Quarry Excavation & Production',
    subtitle: 'Blasting, Cutting & Raw Extraction',
    description: 'Execute controlled rock blasting / wire-saw cutting, extract boulders/blocks, log machine production hours, operator yield, and fuel consumption.',
    icon: 'Pickaxe',
    entities: ['BlastingLog', 'ProductionRun', 'HMRReadingLog'],
    events: ['mining.quarry.blasting_executed', 'mining.production.logged']
  },
  {
    step: 3,
    title: '3. Crusher Processing & Stock Yard',
    subtitle: 'Aggregate Crushing & Yard Inventory',
    description: 'Feed raw boulders into primary jaw crushers, produce multi-grade aggregates (20mm, M-sand, P-sand), update stockyard ledgers with moisture adjustments.',
    icon: 'Factory',
    entities: ['CrusherShiftRun', 'YardInventoryLedger', 'StockAdjustmentLog'],
    events: ['mining.crusher.shift_completed', 'mining.stock.updated']
  },
  {
    step: 4,
    title: '4. Sales Order & Loading Queue',
    subtitle: 'Customer Order & Tipper Allocation',
    description: 'Receive customer/dealer order, verify credit limit, allocate field tipper, queue vehicle at wheel loader bay via WhatsApp driver notification.',
    icon: 'Truck',
    entities: ['SalesOrder', 'DispatchQueueItem', 'LoadingBay'],
    events: ['crm.order.approved', 'mining.dispatch.queued']
  },
  {
    step: 5,
    title: '5. Weighbridge Scalehouse & Gate Pass',
    subtitle: 'Dual Weighing, QR Slip & E-Pass Deduct',
    description: 'Measure gross weight, verify tare weight history, capture license plate snapshot, deduct government royalty e-pass quota, print QR gate pass.',
    icon: 'QrCode',
    entities: ['GatePassTicket', 'WeighbridgeScale', 'RoyaltyPassQuota'],
    events: ['mining.gatepass.issued', 'mining.compliance.quota_exhausted']
  },
  {
    step: 6,
    title: '6. Delivery, Finance & Analytics',
    subtitle: 'GL Journal Posting & AI Insights',
    description: 'Deliver material to customer site, trigger auto-posting to General Ledger finance, update executive KPI dashboards, and run AI yield anomaly checks.',
    icon: 'Receipt',
    entities: ['JournalEntry', 'QuarryCostCenter', 'AIAnomalyAlert'],
    events: ['core.fin.journal_posted', 'mining.fin.cost_calculated', 'mining.ai.anomaly_flagged']
  }
];

export const MINING_SUITE_INTEGRATIONS = [
  {
    system: 'Shared Core Platform',
    purpose: 'Universal Auth, 4-Tier RLS Tenant Isolation, Master Data, Document Management (PDFs), Omni-Channel Notifications, Gemini AI Server Proxy.',
    protocol: 'gRPC Internal Mesh / Node.js Local Imports'
  },
  {
    system: 'Fleet & Logistics Suite',
    purpose: 'Tipper Vehicle Registry, Driver Assignments, GPS Telematics, Fuel Logs, Trip Settlement, Driver PWA Integration.',
    protocol: 'Kafka / NATS Event Streaming (`fleet.vehicle.assigned`, `fleet.trip.completed`)'
  },
  {
    system: 'Building Materials Suite',
    purpose: 'Multi-Warehouse Inventory Stock Feed, Retail Trade Sales, Aggregate Supply Chain Fulfillment.',
    protocol: 'REST / Event Subscriptions (`materials.so.fulfilled`)'
  },
  {
    system: 'CRM & Business Suite',
    purpose: 'B2B Customer Accounts, Contractor Quotations, Sales Order Approval, Dispute Ticketing.',
    protocol: 'Kafka Events (`crm.order.approved`)'
  },
  {
    system: 'Marketplace Suite',
    purpose: 'Online Stone & Aggregates E-Commerce Store, Machine Hiring Listings, Direct Customer Inquiries.',
    protocol: 'REST API Proxy via API Gateway'
  },
  {
    system: 'Finance Shared Engine',
    purpose: 'Automatic Tax & GST Computations, Double-Entry General Ledger Journal Posting, Cost Center Accounting.',
    protocol: 'Direct Event Adapter (`core.fin.journal_posted`)'
  },
  {
    system: 'HRMS Engine',
    purpose: 'Biometric Attendance Integration, Operator Shift Roster Sync, Incentive & Payroll Rollups.',
    protocol: 'REST Bridge (`core.hr.attendance_logged`)'
  }
];

export const PHASE5_TRANSITION_REVIEW = {
  title: 'Phase 4 Mining Suite Architectural Review & Phase 5 Transition Plan',
  validatedCapabilities: [
    'Complete Lifecycle Coverage: 100% domain coverage from land acquisition, quarry excavation, crusher processing, weighbridge scalehouse, to ledger posting.',
    '4 Quarry Types Supported: Specialized workflows tailored for Laterite blocks, Granite dimensional blocks, Hard Rock blasting, and Metal quarries.',
    'Weighbridge Hardware Interfacing: Native serial driver architecture for RS232 scale indicators with QR slip printing and camera snapshot integration.',
    'Statutory Royalty Compliance: Real-time government e-pass balance tracking with automatic gate pass lockout upon quota exhaustion.',
    'Heavy Machinery Telematics: HMR hour tracking, Specific Fuel Consumption (SFC) anomaly detection, and 250-hour preventive maintenance alerts.'
  ],
  identifiedImprovementsForPhase5: [
    'Multi-Warehouse Stock Synchronization: Seamlessly bridge quarry aggregate output with multi-warehouse Building Materials inventory nodes.',
    'Driver PWA Offline Offline Queueing: Ensure weighbridge gate pass verification works in zero-connectivity quarry pits via local IndexedDB caching.',
    'GPS Telematics Geofence Sync: Auto-trigger loading queue status when tippers cross quarry entrance geofence.'
  ],
  status: 'APPROVED — READY FOR PHASE 5 (FLEET LOGISTICS & BUILDING MATERIALS SUITE)'
};
