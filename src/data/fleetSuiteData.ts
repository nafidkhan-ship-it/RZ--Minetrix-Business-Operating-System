import { FleetSuiteModule } from '../types/architecture';

export const FLEET_SUITE_MODULES: FleetSuiteModule[] = [
  {
    id: 'executive-dashboard',
    number: 1,
    title: 'Fleet & Logistics Executive Dashboard',
    icon: 'LayoutDashboard',
    category: 'Finance & Intelligence',
    summary: 'Real-time operational command center aggregating live vehicle positions, active trip status, fleet utilization ratios, fuel cost per km, maintenance schedules, driver availability, and AI anomaly alerts.',
    subModules: [
      'Fleet Operational KPIs (Active Vehicles, Utilization Rate, On-Time Delivery)',
      'Available Vehicles & Standby Tipper Monitor',
      'Live Running Trips & Delivery Progress Bar',
      'Completed Trips & Daily Tonnage Dispatched',
      'Real-Time Fuel Cost & Mileage (Km/L) Analyzer',
      'Maintenance & Workshop Downtime Monitor',
      'Driver Roster, Active Duty & Shift Status',
      'Vehicle Capacity & Payload Utilization Matrix',
      'Commercial Rental & Lease Revenue Monitor',
      'Pending Customer Deliveries & Backlog Queue',
      'Gemini AI Telematics Anomaly Feed'
    ],
    keyCapabilities: [
      'Streaming telemetry ingestion displaying live vehicle pins, speed vectors, and ignition status on interactive vector map.',
      'Real-time cost-per-kilometer dashboard metric calculating fuel + tire wear + driver allowance + toll costs.',
      'Multi-tenant branch and owner filtering (Internal Fleet vs Attached Contractor Fleet).'
    ],
    masterDataEntities: ['VehicleMaster', 'TripMaster', 'DriverMaster', 'VehicleOwner'],
    eventIntegrations: {
      publishes: ['fleet.dashboard.viewed'],
      subscribes: ['fleet.trip.started', 'fleet.trip.completed', 'fleet.maintenance.breakdown', 'fleet.fuel.logged']
    },
    sharedCoreDependencies: ['Executive Dashboard Engine (Mod 10)', 'Identity & Auth (Mod 1)'],
    aiFeatures: ['Natural language copilot for fleet fuel and cost variance queries', 'Route delay prediction']
  },
  {
    id: 'fleet-masters',
    number: 2,
    title: 'Fleet & Transport Master Data Management (MDM)',
    icon: 'Database',
    category: 'Fleet Operations',
    summary: 'Centralized master data registry for commercial vehicles, transport agencies, contractors, standard freight routes, fuel station tie-ups, and expense structures.',
    subModules: [
      'Vehicle Master (VIN, Chassis, Engine No, Make, Model, Axle count)',
      'Vehicle Category & Type Master (Tipper, Lorry, Trailer, Tanker, Support)',
      'Vehicle Owner Master (Self-Owned, Partner Owned, Attached Contractor)',
      'Driver & Cleaner Directory',
      'Transport Agency & Logistics Partner Master',
      'Transport Contractor & Sub-Contractor Registry',
      'Standard Route Master (Origin, Destination, Distance km, Toll points)',
      'Trip Type Master (Mining Dispatch, Inter-Yard, Customer Sale, Material Return)',
      'Fuel Station Partner Master (HPCL, BPCL, IOCL, In-House Yard Pump)',
      'Vehicle Expense Head Master (Toll, Police, Loading, Maintenance, FASTag)',
      'Tax Master (GST, RTO Tax, State Permits)',
      'Business Unit & Transport Hub Mapping'
    ],
    keyCapabilities: [
      'Hierarchical owner-vehicle-driver relationship mapping supporting revenue-sharing matrices.',
      'Route master with pre-calculated distance, standard transit time, and FASTag toll expense baselines.'
    ],
    masterDataEntities: ['VehicleMaster', 'VehicleOwner', 'DriverMaster', 'RouteMaster', 'FuelStationMaster'],
    eventIntegrations: {
      publishes: ['fleet.master.vehicle_registered', 'fleet.master.route_created'],
      subscribes: ['core.master.tax_updated']
    },
    sharedCoreDependencies: ['Shared Master Data Management (Mod 5)', 'Multi-Tenant Platform (Mod 3)']
  },
  {
    id: 'vehicle-management',
    number: 3,
    title: 'Vehicle Fleet & Statutory Compliance Management',
    icon: 'Truck',
    category: 'Fleet Operations',
    summary: '360-degree vehicle lifecycle management covering heavy tippers, multi-axle trailers, tankers, support vehicles, RTO compliance documents, FASTag tolls, and IoT GPS telematics hardware.',
    subModules: [
      'Multi-Category Vehicle Registry (Tipper, Lorry, Pickup, Mini Truck, Trailer, Tanker, Bus, Car)',
      'RTO Registration & RC Smart Card Vault',
      'Commercial Vehicle Insurance Policy Renewal Tracker',
      'State & National Permit Management (Goods Permit, All India Tourist Permit)',
      'Fitness Certificate (FC) Expiry Alert Engine',
      'Pollution Under Control (PUC) Compliance Monitor',
      'FASTag RFID Wallet Linkage & Automated Toll Log Ingestion',
      'Vehicle Document Vault & Photo Gallery (360-degree inspection photos)',
      'GPS Device Hardware Binding & Sensor Pairing'
    ],
    keyCapabilities: [
      'Automated RTO compliance countdown timers — auto-blocks vehicle allocation if Insurance, Fitness, or Permit expires.',
      'Direct FASTag API integration logging toll plaza crossings with instant wallet deduction checks.',
      'IoT GPS device mapping with multi-sensor support (Fuel level sensor, temperature probe, door sensor, ignition sensor).'
    ],
    masterDataEntities: ['VehicleMaster', 'VehicleComplianceDoc', 'FASTagAccount', 'GPSDeviceBinding'],
    eventIntegrations: {
      publishes: ['fleet.vehicle.compliance_expiring', 'fleet.vehicle.blocked'],
      subscribes: ['fleet.trip.assigned']
    },
    sharedCoreDependencies: ['Document Management System (Mod 7)', 'Omni-Channel Notifications (Mod 6)'],
    aiFeatures: ['Gemini OCR reading RTO Registration Certificates, Insurance policies, and Fitness cards']
  },
  {
    id: 'driver-management',
    number: 4,
    title: 'Driver HR, Safety & Performance Management',
    icon: 'UserCheck',
    category: 'Drivers & Owners',
    summary: 'Complete driver lifecycle module managing commercial driving licenses, heavy vehicle badges, medical fitness, biometric shift attendance, trip incentives, penalties, and weekly settlements.',
    subModules: [
      'Driver Profile & Commercial Driving License Vault',
      'Heavy Vehicle Driver Badge & Hazmat Clearance Verification',
      'Driver Annual Medical Fitness & Eye Test Register',
      'Emergency Contact & Guarantor Directory',
      'Biometric & Mobile App Shift Attendance',
      'Driver Performance Scorecard (Safety rating, speed compliance, fuel efficiency score)',
      'Weekly Driver Settlement & Batta Allowance Calculator',
      'Driver Cash Advance & Expense Subaccount Ledger',
      'Trip Incentive & Fuel Savings Bonus Engine',
      'Violation Penalty & Accident Fine Deduction Log'
    ],
    keyCapabilities: [
      'Driving License expiry verification with automatic lockout from trip assignments if license is invalid.',
      'Driver safety scoring combining harsh braking events, overspeed alerts, and idling time into a 100-point index.',
      'Weekly driver trip batta and night allowance calculation integrated into HRMS Payroll.'
    ],
    masterDataEntities: ['DriverProfile', 'DriverLicense', 'DriverScorecard', 'DriverSettlement'],
    eventIntegrations: {
      publishes: ['fleet.driver.settlement_calculated', 'fleet.driver.safety_violation'],
      subscribes: ['core.hr.attendance_logged', 'fleet.trip.completed']
    },
    sharedCoreDependencies: ['HR Shared Services Bridge (Mod 9)', 'User Management & Linker (Mod 4)']
  },
  {
    id: 'owner-management',
    number: 5,
    title: 'Vehicle Owner & Attached Fleet Management',
    icon: 'Building2',
    category: 'Drivers & Owners',
    summary: 'Partner owner portal managing attached private tippers and third-party logistics fleets, security deposit ledgers, revenue-sharing agreements, and commission settlements.',
    subModules: [
      'Vehicle Owner Profile & Bank Account Registry',
      'Owner Vehicle Mapping & Fleet Contract Binder',
      'Owner Settlement & Trip Revenue Disbursement Engine',
      'Security Deposit Ledger & Escrow Balance Tracker',
      'Revenue Sharing Models (Percentage split, fixed rate/ton, fixed monthly hire)',
      'Agency Commission Deduction & TDS Tax Calculator',
      'Owner Monthly Statement & Payment Voucher Generator'
    ],
    keyCapabilities: [
      'Multi-tier revenue sharing rules: e.g. 90% gross trip freight to vehicle owner, 10% agency commission.',
      'Automated diesel deduction against owner settlement for fuel drawn from company yard pumps.',
      'Automated TDS (Tax Deducted at Source) calculation under Section 194C for transport contractors.'
    ],
    masterDataEntities: ['VehicleOwner', 'OwnerContract', 'OwnerSettlementStatement'],
    eventIntegrations: {
      publishes: ['fleet.owner.settlement_calculated', 'fleet.owner.statement_generated'],
      subscribes: ['fleet.trip.closed', 'fleet.fuel.logged']
    },
    sharedCoreDependencies: ['Finance Shared Services Bridge (Mod 8)', 'Shared Master Data Management (Mod 5)']
  },
  {
    id: 'trip-management',
    number: 6,
    title: 'End-to-End Trip Lifecycle & Delivery Management',
    icon: 'MapPin',
    category: 'Logistics & Dispatch',
    summary: 'Core transport execution engine handling trip creation, vehicle/driver pairing, loading point dispatch, route navigation, live transit tracking, delivery proof, and trip closure.',
    subModules: [
      'Trip Order Creation (Auto-triggered from Sales Order / Mining Gate Pass)',
      'Vehicle & Driver Pair Allocation Engine',
      'Trip Scheduling & Dispatch Slotting',
      'Loading Point & Quarry Yard Dispatch Register',
      'Unloading Point & Customer Site Arrival Register',
      'Distance Calculation & Expected Time of Arrival (ETA) Matrix',
      'Live Trip Status Lifecycle (Scheduled, En Route to Loading, Loading, In Transit, At Destination, Unloaded, Closed)',
      'Proof of Delivery (e-POD) & Electronic Customer Signature Capture',
      'Trip Closure & Operational Variance Reconciliation'
    ],
    keyCapabilities: [
      'Auto-trip creation triggered instantly upon printing a Mining Weighbridge Gate Pass.',
      'Digital Proof of Delivery (e-POD) mobile photo upload with GPS coordinates and customer signature.',
      'Automatic trip mileage calculation comparing GPS tracked distance vs odometer reading vs standard route distance.'
    ],
    masterDataEntities: ['TripMaster', 'TripStop', 'ProofOfDelivery'],
    eventIntegrations: {
      publishes: ['fleet.trip.created', 'fleet.trip.started', 'fleet.trip.completed', 'fleet.trip.closed'],
      subscribes: ['mining.gatepass.issued', 'crm.order.approved']
    },
    sharedCoreDependencies: ['Document Management System (Mod 7)', 'Omni-Channel Notification Router (Mod 6)'],
    aiFeatures: ['Real-time ETA prediction accounting for traffic congestion and loading delay']
  },
  {
    id: 'vehicle-rental',
    number: 7,
    title: 'Commercial Vehicle Rental & Lease Engine',
    icon: 'Key',
    category: 'Logistics & Dispatch',
    summary: 'Commercial vehicle hiring and leasing suite governing spot rentals, long-term corporate contracts, hourly/daily vehicle hiring, rental quotes, billing, and settlements.',
    subModules: [
      'Rental Models (Trip Rental, Hourly, Daily, Weekly, Monthly, Project Contract)',
      'Service Modes (Vehicle Only / Bareboat vs Vehicle + Driver + Fuel)',
      'Long-Term Corporate Fleet Leasing Contracts',
      'Corporate & Contractor Rental Quotation Builder',
      'Rental Agreement Vault & Security Deposit Collector',
      'Rental Time & HMR/Odometer Usage Logbook',
      'Rental Invoicing & Billing Engine',
      'Third-Party Vehicle Hiring Settlement Engine'
    ],
    keyCapabilities: [
      'Minimum guaranteed kilometer/hour billing clauses (e.g. minimum 200 km/day billing).',
      'Overtime usage calculator for hours/kms exceeding contractual limits.',
      'Seamless integration into General Ledger Finance emitting automated recurring monthly rental invoices.'
    ],
    masterDataEntities: ['RentalQuotation', 'RentalContract', 'RentalLogbook', 'RentalInvoice'],
    eventIntegrations: {
      publishes: ['fleet.rental.contract_activated', 'fleet.rental.invoiced'],
      subscribes: ['fleet.trip.completed']
    },
    sharedCoreDependencies: ['Finance Shared Services Bridge (Mod 8)', 'Document Management System (Mod 7)']
  },
  {
    id: 'fuel-management',
    number: 8,
    title: 'Fuel Consumption, Mileage & Theft Anomaly Engine',
    icon: 'Fuel',
    category: 'Maintenance & Fuel',
    summary: 'Comprehensive fuel accounting engine monitoring diesel dispenser logs, external fuel pump receipts, fuel card transactions, mileage (Km/L) benchmarking, and fuel theft detection.',
    subModules: [
      'Digital Fuel Entry Ingestion (In-house yard pump dispenser & external station slips)',
      'Fuel Station Partner Integration (HPCL, BPCL, Shell fuel card sync)',
      'Vehicle Mileage & Specific Fuel Consumption (SFC) Benchmarking',
      'Fuel Tank Level Sensor IoT Monitoring',
      'Fuel Drain & Sudden Drop Anomaly Detector',
      'Fuel Cost Distribution per Trip / Ton-Km',
      'Diesel Stockyard Inventory Ledger'
    ],
    keyCapabilities: [
      'IoT Ultrasonic Fuel Level Sensor integration sampling tank volume every 30 seconds.',
      'Instant alert triggered if fuel level drops by > 15 Liters while ignition is off (Fuel Theft Alert).',
      'Automatic mileage calculation (Km/Liter and Liters/Ton) with driver efficiency comparison.'
    ],
    masterDataEntities: ['FuelEntryLog', 'FuelStationAccount', 'FuelTheftAlert'],
    eventIntegrations: {
      publishes: ['fleet.fuel.logged', 'fleet.fuel.theft_alert'],
      subscribes: ['fleet.trip.started', 'fleet.gps.telematics_received']
    },
    sharedCoreDependencies: ['Gemini AI Ecosystem (Mod 12)', 'Omni-Channel Notification Router (Mod 6)'],
    aiFeatures: ['Gemini AI fuel theft pattern recognition and mileage anomaly detection']
  },
  {
    id: 'fleet-maintenance',
    number: 9,
    title: 'Fleet Workshop, Tyres & Maintenance ERP',
    icon: 'Wrench',
    category: 'Maintenance & Fuel',
    summary: 'Commercial vehicle maintenance software governing preventive service schedules, breakdown job cards, tyre serial tracking, battery replacements, spare parts inventory, and AMC warranties.',
    subModules: [
      'Preventive Maintenance Schedule (Every 10,000 km / 250 engine hours)',
      'Breakdown Ticket & Roadside Assistance Dispatch',
      'Workshop Job Card & Mechanic Assignment',
      'Tyre Life Management (Tyre serial number tracking, tread depth, retreading history)',
      'Battery & Electrical System Maintenance Register',
      'Lubricants & Engine Oil Replacement Log',
      'Spare Parts Yard Inventory & Reorder Controller',
      'Annual Maintenance Contract (AMC) & Warranty Claim Engine'
    ],
    keyCapabilities: [
      'Individual tyre serial number mapping tracking mounting position (e.g., Rear Right Outer) and retread cycles.',
      'Preventive service trigger emitting automated alerts 500 km prior to scheduled service due date.',
      'Detailed breakdown cost per vehicle feeding into total cost of ownership (TCO) analytics.'
    ],
    masterDataEntities: ['VehicleServiceTicket', 'TyreAssetLog', 'SparePartItem', 'WorkshopJobCard'],
    eventIntegrations: {
      publishes: ['fleet.maintenance.service_due', 'fleet.maintenance.breakdown', 'fleet.maintenance.completed'],
      subscribes: ['fleet.gps.odometer_updated']
    },
    sharedCoreDependencies: ['Shared Master Data Management (Mod 5)', 'Finance Shared Services Bridge (Mod 8)']
  },
  {
    id: 'gps-tracking',
    number: 10,
    title: 'IoT Telematics, Geofencing & Route Monitoring Engine',
    icon: 'Navigation',
    category: 'Maintenance & Fuel',
    summary: 'High-throughput telematics processing platform ingesting real-time GPS coordinates, vehicle speed, ignition state, geofence boundary events, and driver behavior telemetry.',
    subModules: [
      'Live Vehicle Vector Map & Multi-Vehicle Fleet View',
      'Trip Route Replay & Speed Profile Graph',
      'Polygonal Geofencing (Quarry pits, unloading sites, fuel pumps, restricted zones)',
      'Route History & Mileage Audit Log',
      'Speed Monitoring & Overspeed Incident Logger',
      'Engine Idle Time Monitor & CO2 Emission Estimator',
      'Harsh Acceleration, Braking & Cornering Telematics Logger'
    ],
    keyCapabilities: [
      'Inundation handling capable of processing 10,000 GPS telemetry packets per second via Redis stream pipeline.',
      'Automatic Geofence Entry/Exit event generation updating Trip Status without driver manual input.',
      'Tamper detection alert if GPS device is disconnected or antenna is shielded.'
    ],
    masterDataEntities: ['GPSTelematicsPacket', 'GeofenceZone', 'TelematicsAlert'],
    eventIntegrations: {
      publishes: ['fleet.gps.geofence_entered', 'fleet.gps.geofence_exited', 'fleet.gps.overspeed'],
      subscribes: ['fleet.vehicle.registered']
    },
    sharedCoreDependencies: ['API Gateway & Service Mesh (Mod 13)', 'Audit & Telemetry (Mod 14)'],
    aiFeatures: ['Geofence boundary auto-clustering and optimal route deviation detection']
  },
  {
    id: 'dispatch-logistics',
    number: 11,
    title: 'Dispatch Optimization & Delivery Planning Engine',
    icon: 'Send',
    category: 'Logistics & Dispatch',
    summary: 'Logistics scheduling hub optimizing tipper allocation, driver shifts, yard loading queues, delivery routes, and real-time delivery notifications.',
    subModules: [
      'Automated Tipper & Lorry Allocation Engine',
      'Driver Shift Matching & Rest Period Enforcer',
      'Quarry & Yard Loading Queue Controller',
      'Multi-Stop Delivery Route Planner',
      'Real-Time Customer Delivery Dispatch Tracker',
      'Digital Proof of Delivery (e-POD) Verification'
    ],
    keyCapabilities: [
      'Rule-based vehicle auto-allocation prioritizing self-owned vehicles before calling attached contractor fleet.',
      'Driver fatigue enforcement preventing drivers from starting trips if rest period is < 8 hours.',
      'Automated WhatsApp SMS trigger sending customer a live vehicle tracking link.'
    ],
    masterDataEntities: ['DispatchPlan', 'LoadingQueueSlot', 'DeliveryRoutePlan'],
    eventIntegrations: {
      publishes: ['fleet.dispatch.allocated', 'fleet.dispatch.epod_verified'],
      subscribes: ['crm.order.approved', 'mining.gatepass.issued']
    },
    sharedCoreDependencies: ['Shared Workflow Engine (Mod 16)', 'Omni-Channel Notification Router (Mod 6)'],
    aiFeatures: ['AI Tipper Load Balancing reducing queue wait time at quarry scales']
  },
  {
    id: 'fleet-finance',
    number: 12,
    title: 'Fleet Financials, Cost Center & Profitability Engine',
    icon: 'Receipt',
    category: 'Finance & Intelligence',
    summary: 'Specialized logistics cost accounting engine tracking trip expenses, fuel costs, maintenance overheads, driver wages, rental revenue, owner disbursements, and net vehicle profitability.',
    subModules: [
      'Trip Expense Accounting (Toll, police, loading, unloading, driver batta)',
      'Fuel Expense Ledger & Station Payment Reconciliation',
      'Vehicle Maintenance Cost Allocation',
      'Trip Freight Revenue Ledger & Sales Invoicing',
      'Commercial Rental Revenue Ledger',
      'Driver Weekly Settlement & Incentive Accounting',
      'Vehicle Owner Disbursement & TDS Accounting',
      'General Ledger Double-Entry Posting Adapter',
      'Vehicle Cost Center Accounting (P&L per Vehicle / per Route / per Ton-Km)'
    ],
    keyCapabilities: [
      'Granular Vehicle P&L calculation: Revenue - (Fuel + Driver Batta + Tolls + Maintenance + Depreciation + Owner Share) = Net Margin.',
      'Automated double-entry journal posting into Shared Core General Ledger.',
      'TDS Tax deduction & RTO expense reconciliation.'
    ],
    masterDataEntities: ['VehicleCostCenter', 'TripExpenseVoucher', 'OwnerDisbursementRecord'],
    eventIntegrations: {
      publishes: ['fleet.fin.cost_calculated', 'fleet.fin.journal_posted'],
      subscribes: ['fleet.trip.closed', 'fleet.fuel.logged', 'fleet.maintenance.completed']
    },
    sharedCoreDependencies: ['Finance Shared Services Bridge (Mod 8)', 'Shared Master Data Management (Mod 5)']
  },
  {
    id: 'fleet-reports',
    number: 13,
    title: 'Fleet Business Intelligence & Logistics Analytics',
    icon: 'BarChart3',
    category: 'Finance & Intelligence',
    summary: 'Reporting engine delivering detailed vehicle utilization charts, driver safety scorecards, trip profitability heatmaps, fuel efficiency reports, and RTO compliance audits.',
    subModules: [
      'Fleet Utilization & Idle Time Heatmaps',
      'Vehicle Performance & Cost-per-Km Analytics',
      'Driver Safety, Mileage & On-Time Delivery Scorecards',
      'Trip Profitability & Route Realization Reports',
      'Fuel Consumption & SFC Variance Analysis',
      'Workshop Maintenance & Tyre Life Reports',
      'Vehicle Rental & Contract Revenue Reports',
      'Owner Disbursement & Commission Summaries',
      'RTO Statutory Compliance Audit Reports'
    ],
    keyCapabilities: [
      'Asynchronous worker pool emitting streaming Excel (.xlsx) and PDF reports.',
      'Scheduled WhatsApp/Email dispatch of daily morning fleet readiness reports to transport managers.',
      'Interactive Recharts visualizations for fuel trend and vehicle downtime breakdown.'
    ],
    masterDataEntities: ['FleetReportTemplate', 'ScheduledFleetReportJob'],
    eventIntegrations: {
      publishes: ['fleet.report.generated'],
      subscribes: ['core.report.trigger_requested']
    },
    sharedCoreDependencies: ['Dynamic Reporting Engine (Mod 11)', 'Document Management System (Mod 7)']
  },
  {
    id: 'fleet-ai-features',
    number: 14,
    title: 'Gemini AI Fleet Optimization & Predictive Telematics',
    icon: 'Sparkles',
    category: 'Finance & Intelligence',
    summary: 'Server-side AI suite harnessing Gemini models for vehicle utilization prediction, predictive breakdown maintenance, route cost estimation, fuel theft detection, and driver performance insights.',
    subModules: [
      'Vehicle Utilization & Demand Prediction Model',
      'Predictive Maintenance & Component Failure Warning',
      'Fuel Optimization & Theft Pattern Recognition Engine',
      'Dynamic Route & Transit Time Optimizer',
      'Trip Freight Cost & Margin Predictor',
      'Vehicle Rental Demand Forecasting Engine',
      'Driver Behavior & Safety Performance Coach',
      'Executive Fleet Copilot (Natural Language Query Interface)'
    ],
    keyCapabilities: [
      'Server-side Gemini 2.5 Flash execution via `/api/ai/fleet/*` keeping credentials 100% secure.',
      'Predictive maintenance model analyzing telematics engine temperature and vibration to predict alternator or clutch failure.',
      'Route optimization algorithm recommending alternative routes during monsoon or road closures.'
    ],
    masterDataEntities: ['AIFleetPrediction', 'AITelematicsAnomaly'],
    eventIntegrations: {
      publishes: ['fleet.ai.anomaly_flagged', 'fleet.ai.route_optimized'],
      subscribes: ['fleet.gps.telematics_received', 'fleet.fuel.logged']
    },
    sharedCoreDependencies: ['Gemini AI Ecosystem (Mod 12)', 'Audit & Telemetry (Mod 14)'],
    aiFeatures: ['Gemini 2.5 Flash / Pro operational fleet copilot', 'Predictive ML maintenance', 'Fuel theft pattern recognition']
  }
];

export const FLEET_LIFECYCLE_WORKFLOWS = [
  {
    step: 1,
    title: '1. Order & Vehicle Allocation',
    subtitle: 'Sales Order & Fleet Availability Check',
    description: 'System receives Sales Order or Mining Gate Pass request, checks vehicle compliance/RTO status, auto-allocates compliant tipper and rest-certified driver.',
    icon: 'Truck',
    entities: ['SalesOrder', 'VehicleMaster', 'DriverProfile'],
    events: ['crm.order.approved', 'fleet.dispatch.allocated']
  },
  {
    step: 2,
    title: '2. Driver Assignment & Loading Queue',
    subtitle: 'Mobile App Push & Quarry Scalehouse Queue',
    description: 'Push notification sent to driver mobile app with route details. Tipper enters quarry loading queue, wheel loader loads material, vehicle proceeds to weighbridge.',
    icon: 'UserCheck',
    entities: ['DispatchPlan', 'LoadingQueueSlot', 'DriverProfile'],
    events: ['fleet.trip.assigned', 'mining.dispatch.queued']
  },
  {
    step: 3,
    title: '3. Gate Pass & Automated Trip Creation',
    subtitle: 'Dual Weighing, QR Ticket & Auto-Trip Creation',
    description: 'Weighbridge measures gross weight, captures license plate camera snapshot, prints QR gate pass. System auto-generates Fleet Trip record instantly.',
    icon: 'QrCode',
    entities: ['GatePassTicket', 'TripMaster', 'FASTagAccount'],
    events: ['mining.gatepass.issued', 'fleet.trip.created']
  },
  {
    step: 4,
    title: '4. In Transit GPS Tracking & Fuel Ingestion',
    subtitle: 'Geofencing, Route Replay & Fuel Monitoring',
    description: 'IoT telematics streams vehicle position every 10 seconds. Automated geofence entry/exit detection. Fuel level sensor checks for sudden drops.',
    icon: 'Navigation',
    entities: ['GPSTelematicsPacket', 'GeofenceZone', 'FuelEntryLog'],
    events: ['fleet.gps.geofence_entered', 'fleet.fuel.logged']
  },
  {
    step: 5,
    title: '5. Customer Delivery & Digital e-POD',
    subtitle: 'Arrival Geofence, Photo e-POD & Customer Sign',
    description: 'Tipper arrives at customer site. Driver captures e-POD photo of unloaded aggregate and customer digital signature via mobile PWA.',
    icon: 'MapPin',
    entities: ['ProofOfDelivery', 'TripStop', 'TripMaster'],
    events: ['fleet.trip.completed', 'fleet.dispatch.epod_verified']
  },
  {
    step: 6,
    title: '6. Settlement, GL Finance Posting & AI Analytics',
    subtitle: 'Driver Batta, Owner Payout, GL Post & AI Insights',
    description: 'Trip closed with distance variance check. System calculates driver batta, owner revenue share, posts journal to General Ledger, and runs AI mileage analytics.',
    icon: 'Receipt',
    entities: ['DriverSettlement', 'OwnerSettlementStatement', 'JournalEntry', 'VehicleCostCenter'],
    events: ['fleet.trip.closed', 'fleet.fin.journal_posted', 'fleet.ai.anomaly_flagged']
  }
];

export const FLEET_INTEGRATIONS_TOPOLOGY = [
  {
    system: 'Shared Core Platform',
    purpose: 'Universal Single Sign-On, 4-Tier RLS Tenant Isolation, Master Data Management, Document Management (PDF Invoices), Omni-Channel WhatsApp/Push Notifications, Gemini AI Server Proxy.',
    protocol: 'gRPC Internal Mesh / Node.js Local Imports'
  },
  {
    system: 'Mining Operations Suite',
    purpose: 'Automatic trip creation upon weighbridge gate pass printing, quarry loading queue synchronization, raw boulder transport routing.',
    protocol: 'Kafka / NATS Event Streaming (`mining.gatepass.issued`, `mining.dispatch.queued`)'
  },
  {
    system: 'Building Materials Suite',
    purpose: 'Multi-warehouse stock transport, inter-depot stock transfers, retail delivery fulfillment.',
    protocol: 'REST / Event Subscriptions (`materials.transfer.requested`)'
  },
  {
    system: 'CRM & Business Suite',
    purpose: 'Customer delivery addresses, B2B order dispatch schedules, delivery confirmation feedback.',
    protocol: 'Kafka Events (`crm.order.approved`)'
  },
  {
    system: 'Marketplace Suite',
    purpose: 'Commercial vehicle rental hiring listings, third-party fleet hiring inquiries, job board driver listings.',
    protocol: 'REST API Proxy via API Gateway'
  },
  {
    system: 'Finance Shared Engine',
    purpose: 'Automatic freight invoicing, TDS tax calculations, driver/owner payouts, General Ledger double-entry posting.',
    protocol: 'Direct Event Adapter (`fleet.fin.journal_posted`)'
  },
  {
    system: 'HRMS Engine',
    purpose: 'Driver biometric shift attendance, weekly trip allowance (batta) payroll rollups, medical compliance records.',
    protocol: 'REST Bridge (`core.hr.attendance_logged`)'
  },
  {
    system: 'GPS Telematics & FASTag Providers',
    purpose: 'Live vehicle coordinates, speed, ignition status, ultrasonic fuel sensor, automated FASTag toll plaza logging.',
    protocol: 'HTTPS Webhook / MQTT Telematics Stream'
  }
];

export const FLEET_FOLDER_STRUCTURE = [
  'src/modules/fleet/',
  '├── controllers/',
  '│   ├── vehicle.controller.ts',
  '│   ├── driver.controller.ts',
  '│   ├── trip.controller.ts',
  '│   ├── fuel.controller.ts',
  '│   ├── maintenance.controller.ts',
  '│   ├── gps.controller.ts',
  '│   └── settlement.controller.ts',
  '├── services/',
  '│   ├── vehicle-compliance.service.ts',
  '│   ├── trip-lifecycle.service.ts',
  '│   ├── telematics-ingestion.service.ts',
  '│   ├── fuel-theft-detector.service.ts',
  '│   ├── owner-settlement.service.ts',
  '│   └── fleet-ai-copilot.service.ts',
  '├── models/',
  '│   ├── vehicle.model.ts',
  '│   ├── driver.model.ts',
  '│   ├── trip.model.ts',
  '│   ├── fuel-log.model.ts',
  '│   └── maintenance-jobcard.model.ts',
  '├── events/',
  '│   ├── fleet-events.publisher.ts',
  '│   └── fleet-events.subscriber.ts',
  '└── interfaces/',
  '    ├── telematics-packet.interface.ts',
  '    └── epod.interface.ts'
];

export const PHASE6_TRANSITION_REVIEW = {
  title: 'Phase 5 Fleet & Logistics Suite Architectural Review & Phase 6 Transition Plan',
  validatedCapabilities: [
    'Complete Fleet Lifecycle Coverage: 100% domain coverage from order allocation, vehicle compliance check, trip execution, GPS telematics, fuel theft detection, to owner settlement.',
    'Seamless Mining Integration: Automatic trip creation triggered directly upon weighbridge gate pass print with zero human delay.',
    'Multi-Owner Fleet Model: Robust revenue-sharing and settlement engine supporting self-owned tippers and attached contractor fleets.',
    'High-Throughput IoT Telematics: Redis-backed stream ingestion engine handling 10,000 GPS packets/sec with geofence entry/exit detection.',
    'Gemini AI Telematics Copilot: Fuel theft pattern detection and predictive maintenance alerts based on HMR and engine telemetry.'
  ],
  identifiedImprovementsForPhase6: [
    'CRM Order-to-Delivery Real-Time Sync: Map live fleet transit coordinates directly onto CRM customer delivery tracking portal.',
    'Building Materials Multi-Depot Route Planner: Optimize multi-drop retail delivery routes for building material supply chains.',
    'HRMS Driver Biometric Shift Linking: Synchronize driver biometric attendance with vehicle ignition lock mechanisms.'
  ],
  status: 'APPROVED — READY FOR PHASE 6 (CRM, GENERAL LEDGER FINANCE & HRMS PAYROLL)'
};
