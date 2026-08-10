import { PlatformPortal } from '../types/architecture';

export const PLATFORM_PORTALS_DATA: PlatformPortal[] = [
  {
    id: 'portal-super-admin',
    number: 1,
    title: 'Super Admin Platform Portal',
    icon: 'ShieldAlert',
    targetUser: 'Platform Operator & SaaS Infrastructure Engineers',
    keyCapabilities: [
      'Multi-tenant provisioning, subscription billing tiers, and license entitlement management.',
      'Real-time global platform health telemetry, API quota usage, and database connection pooling metrics.',
      'Global cross-tenant audit ledger search, compliance monitoring, and prompt governance overrides.',
      'Global system feature flag toggles, emergency tenant isolation, and security incident response.'
    ],
    coreWorkflows: [
      'Tenant Onboarding Pipeline: Automated database schema provisioning, RLS policy deployment, and domain binding.',
      'Global License Entitlement Sync: Upgrading/downgrading active modules across all 11 BOS suites.',
      'Infrastructure Health Alarm Dispatch: Automated paging to SRE team on latency spikes or DB failovers.'
    ],
    securityScope: 'System-wide Super Admin (Bypasses RLS with strict immutable dual-authorization logging).'
  },
  {
    id: 'portal-company-admin',
    number: 2,
    title: 'Company / Tenant Admin Portal',
    icon: 'Building2',
    targetUser: 'CFO, Managing Director & General Managers',
    keyCapabilities: [
      'Company organization tree setup (Branches, Quarries, Crushers, Depots, and Cost Centers).',
      'Role-Based Access Control (RBAC) permission matrix definition and employee role assignments.',
      'Multi-tier approval threshold matrix configuration for Purchase Orders, Expenses, and Credit Limits.',
      'Custom branding, GST tax configurations, voucher series configuration, and bank account setup.'
    ],
    coreWorkflows: [
      'New Employee Onboarding: User credential creation, role mapping, and mobile app activation code generation.',
      'Inter-Branch Master Data Sync: Pushing shared price lists and material SKUs to all operating sites.',
      'Financial Year End Closing: Locking accounting ledgers and initiating automated balance roll-forward.'
    ],
    securityScope: 'Tenant-isolated Company Admin (Restricted to company tenant ID and assigned branches).'
  },
  {
    id: 'portal-quarry-owner',
    number: 3,
    title: 'Quarry Owner Portal',
    icon: 'Pickaxe',
    targetUser: 'Quarry License Holders, Mine Directors & Site Managers',
    keyCapabilities: [
      'Real-time pit rock extraction tonnage counters, overburden removal tracking, and crusher feed logs.',
      'Live weighbridge gate pass monitor, truck loading queues, and delivery challan verification.',
      'Government mining lease permit tracking, Environmental Cess, Royalty e-Pass, and DGMS compliance ledger.',
      'Heavy machinery pit availability, diesel consumption tracking, and pit profitability analytics.'
    ],
    coreWorkflows: [
      'Daily Pit Yield Reconciliation: Comparing raw rock excavated vs crushed aggregate produced.',
      'Royalty Permit Allocation: Automated deduction of government permit pass tonnage per dispatched tipper.',
      'Equipment Rental Dispatch: Offering idle quarry excavators on the RZ® Marketplace Suite.'
    ],
    securityScope: 'Branch & Quarry Pit-scoped RLS permissions.'
  },
  {
    id: 'portal-crusher-owner',
    number: 4,
    title: 'Crusher Plant Owner Portal',
    icon: 'Factory',
    targetUser: 'Crusher Unit Managers & Production Engineers',
    keyCapabilities: [
      'Crusher plant feeder throughput rate, grid screen size yield analysis (20mm, 12mm, 6mm, M-Sand, GSB).',
      'Stockpile inventory balance gauge with automatic safety stock reorder point alerts.',
      'Direct sales order desk, gate pass issuance, and instant weighbridge gross/tare weight logging.',
      'Crusher maintenance scheduler, jaw plate wear monitoring, and electrical power consumption tracking.'
    ],
    coreWorkflows: [
      'Crusher Production Shift Logging: Recording jaw crusher running hours, electricity units, and crushed output.',
      'Instant Gate Pass Dispatch: Capturing tipper gross weight from IoT weighbridge and auto-generating e-Tax Invoice.',
      'Crusher Maintenance Log: Scheduling liner replacement before catastrophic breakdown occurs.'
    ],
    securityScope: 'Crusher Unit & Plant-scoped RLS permissions.'
  },
  {
    id: 'portal-vehicle-owner',
    number: 5,
    title: 'Commercial Vehicle & Tipper Fleet Owner Portal',
    icon: 'Truck',
    targetUser: 'Fleet Owners, Logistics Contractors & Tipper Operators',
    keyCapabilities: [
      'Live GPS telematics fleet tracking, route replay, speed alerts, and geofence entry/exit logs.',
      'Trip-wise revenue vs expense tracking, driver trip bata calculations, and fuel efficiency (km/L) audit.',
      'Automated maintenance scheduler, tire mileage tracker, engine oil change reminders, and breakdown logs.',
      'Document expiration vault for RC, Fitness, Pollution, National Permit, and Commercial Insurance.'
    ],
    coreWorkflows: [
      'Trip Voucher Settlement: Verifying trip start/end weights, driver expenses, and releasing trip bata.',
      'Fuel Theft Anomaly Detection: Cross-referencing IoT fuel dispenser logs with GPS tank fuel sensors.',
      'Marketplace Logistics Allocation: Accepting aggregate haulage orders from external quarries.'
    ],
    securityScope: 'Fleet Owner & Assigned Vehicle-scoped RLS permissions.'
  },
  {
    id: 'portal-driver',
    number: 6,
    title: 'Driver Mobile Portal & App',
    icon: 'Navigation',
    targetUser: 'Tipper Drivers, Heavy Equipment Operators & Delivery Drivers',
    keyCapabilities: [
      'Assigned trip list, turn-by-turn Google Maps navigation to quarry pit / customer delivery site.',
      'Digital e-POD (Proof of Delivery) capture with customer signature, photo upload, and geotag.',
      'Expense entry (toll charges, fuel receipts, police fees) with instant receipt OCR photo scan.',
      'Attendance punch, daily trip bata summary, WhatsApp notification status, and trip settlement history.'
    ],
    coreWorkflows: [
      'Trip Execution Pipeline: Driver accepts assigned trip -> navigates to quarry -> weighs at gate pass -> delivers to site -> uploads e-POD.',
      'Breakdown Incident Alert: One-tap SOS report capturing breakdown GPS coordinates and voice note.',
      'Daily Wage Punch: Clocking in via mobile face-recognition / GPS geofence.'
    ],
    securityScope: 'Driver Individual Account (Access restricted to assigned active trips and personal profile).'
  },
  {
    id: 'portal-equipment-owner',
    number: 7,
    title: 'Heavy Equipment & Machinery Owner Portal',
    icon: 'HardHat',
    targetUser: 'Excavator, Loader, Rock Breaker & Crane Owners',
    keyCapabilities: [
      'Machine hour-meter tracking, idle time analysis, and fuel burn rate per working hour.',
      'Equipment rental booking calendar, site dispatch assignments, and operator deployment status.',
      'Preventive maintenance scheduler, hydraulic oil replacement alerts, and spare parts consumption logs.',
      'Machine rental invoicing, operator salary allocations, and equipment net ROI statement.'
    ],
    coreWorkflows: [
      'Rental Dispatch Setup: Deploying 30-ton excavator to external quarry site with operator.',
      'Hour-Meter Verification: Reconciling machine telematics running hours with daily site supervisor sign-off.',
      'Maintenance Ticket Creation: Logging track-chain wear and reserving replacement parts from store.'
    ],
    securityScope: 'Equipment Owner & Machine Asset-scoped RLS permissions.'
  },
  {
    id: 'portal-customer',
    number: 8,
    title: 'Customer Self-Service Portal & Ordering App',
    icon: 'ShoppingBag',
    targetUser: 'Building Contractors, Real Estate Developers & Retail Material Buyers',
    keyCapabilities: [
      'Online ordering for Laterite Stones, 20mm/12mm/6mm Aggregates, M-Sand, P-Sand, GSB, and Bricks.',
      'Real-time delivery truck GPS tracking map showing tipper ETA and driver phone contact.',
      'Digital tax invoice download, account statement ledger, credit limit balance view, and instant UPI/NetBanking payment.',
      'Ticket logging for quality complaints, weight discrepancies, delivery delays, and customer support.'
    ],
    coreWorkflows: [
      'Instant Aggregate Order: Customer selects 20 tons M-Sand -> selects delivery site -> pays deposit -> tracks tipper live.',
      'Invoice Ledger Reconciliation: Downloading monthly GST tax statement for GST input credit claims.',
      'Complaint Escalation: Uploading photo of material quality issue for instant quality team inspection.'
    ],
    securityScope: 'Customer Tenant Account (Strictly isolated to customer profile and ordered shipments).'
  },
  {
    id: 'portal-supplier',
    number: 9,
    title: 'Supplier & Vendor Portal',
    icon: 'PackageCheck',
    targetUser: 'Raw Material Vendors, Spare Parts Suppliers, Fuel Stations & Explosive Dealers',
    keyCapabilities: [
      'Purchase Order (PO) view, digital order acceptance, and delivery schedule confirmation.',
      'Digital bill submission with instant 3-way OCR matching against PO and Gate Receipts.',
      'Payment advice tracking, outstanding accounts payable ledger, and TDS deduction statements.',
      'Supplier product catalog update, unit pricing revisions, and stock availability updates.'
    ],
    coreWorkflows: [
      'Bill Submission Pipeline: Supplier uploads invoice PDF -> AI OCR parses line items -> matches PO -> queues for AP payment.',
      'Fuel Station Settlement: Reconciling monthly diesel dispenser bills against vehicle telematics refills.',
      'Explosive Material Log: Submitting statutory explosive delivery certificates to quarry safety officer.'
    ],
    securityScope: 'Supplier Account (Isolated to purchase orders and bills issued to supplier).'
  },
  {
    id: 'portal-dealer',
    number: 10,
    title: 'Dealer & Franchisee Portal',
    icon: 'Store',
    targetUser: 'Building Material Dealers, Aggregate Yard Owners & Distributors',
    keyCapabilities: [
      'Wholesale bulk material ordering, yard stock balance tracking, and retail distribution management.',
      'Sub-customer order management, localized truck dispatch, and margin markup setup.',
      'Dealer credit line monitoring, incentive tracking, trade discount statements, and bank guarantee logs.',
      'Consolidated sales analytics across retail customer network.'
    ],
    coreWorkflows: [
      'Bulk Stock Replenishment: Dealer orders 100 tons GSB aggregate from parent quarry for local depot.',
      'Retail Customer Dispatch: Allocating yard tipper truck to deliver aggregate to home builder.',
      'Credit Limit Top-Up: Submitting bank guarantee deposit to increase monthly material quota.'
    ],
    securityScope: 'Dealer Franchise Account & Yard-scoped RLS permissions.'
  },
  {
    id: 'portal-contractor',
    number: 11,
    title: 'Contractor & Infrastructure Works Portal',
    icon: 'Briefcase',
    targetUser: 'Civil Contractors, Highway Builders & Earthwork Project Managers',
    keyCapabilities: [
      'Multi-project material requirement forecasting (laterite stone, aggregates, road sub-base).',
      'Daily site material delivery schedule, site dump location management, and vehicle unloading logs.',
      'Project-wise machinery rental booking (excavators, compactor rollers, graders, tippers).',
      'Contractor progress billing, running account (RA) bill reconciliation, and material test certificates.'
    ],
    coreWorkflows: [
      'Highway Project Supply Schedule: Setting up automated daily 500-ton aggregate delivery stream.',
      'Material Quality Verification: Downloading laboratory sieve test reports and crushing value certificates.',
      'RA Bill Matching: Aligning delivered material challans with PWD / NHAI milestone invoices.'
    ],
    securityScope: 'Contractor Organization & Project-scoped RLS permissions.'
  },
  {
    id: 'portal-employee',
    number: 12,
    title: 'Employee Self-Service (ESS) Portal & App',
    icon: 'UserCheck',
    targetUser: 'Quarry Workers, Staff, Finance Team, Engineers & Managers',
    keyCapabilities: [
      'Biometric / GPS geofenced attendance punch, shift roster view, and attendance regularization requests.',
      'Leave application management, approval tracking, holiday calendar view, and overtime logs.',
      'Digital payslip download, Form 16 tax certificate, weekly wage settlement summary, and advance loan requests.',
      'Internal task management, SOP knowledge base search, and company announcements.'
    ],
    coreWorkflows: [
      'Daily Attendance Punch: Selfie biometric punch with GPS geofence verification at quarry site.',
      'Weekly Wage Settlement: Quarry laborer checks trip loading bata earnings and bank account payout.',
      'SOP Lookup: Querying AI Copilot for safety equipment operational instructions.'
    ],
    securityScope: 'Employee Individual Account (Restricted to own employment records and tasks).'
  },
  {
    id: 'portal-marketplace-public',
    number: 13,
    title: 'Marketplace Public Portal & E-Commerce Web',
    icon: 'Globe',
    targetUser: 'Public Buyers, Unregistered Contractors & Industry Visitors',
    keyCapabilities: [
      'Public product directory for Laterite Stones, Crushed Aggregates, M-Sand, Ready-Mix Concrete, and Machinery.',
      'Live regional building material price index, quarry location map, and supplier ratings.',
      'Instant quote request generator, supplier inquiry form, and WhatsApp chat connect.',
      'Public machinery rental directory with equipment specifications, hour rates, and availability.'
    ],
    coreWorkflows: [
      'Public Price Discovery: Visitor checks current 20mm aggregate price in Kannur / Ernakulam region.',
      'Inquiry Generation: Visitor requests bulk quote for 1,000 tons laterite stone for commercial project.',
      'Guest Checkout: Instant guest purchase with OTP verification and online payment.'
    ],
    securityScope: 'Public Unauthenticated Access (Read-only public catalog with rate-limited inquiry submission).'
  },
  {
    id: 'portal-crusher-depot',
    number: 14,
    title: 'Material Depot & Yard Cashier Portal',
    icon: 'Landmark',
    targetUser: 'Depot Yard Cashiers, Weighbridge Clerks & Security Officers',
    keyCapabilities: [
      'High-speed POS weighbridge entry desk, truck gross/tare weight capture, and instant receipt printing.',
      'Cash / UPI / Cheque payment collection desk with cash drawer reconciliation ledger.',
      'Gate pass barcode / QR code scanning, security vehicle exit verification, and loading slip validation.',
      'Real-time yard inventory counter and daily shift cash collection summary.'
    ],
    coreWorkflows: [
      'Weighbridge Ticket Generation: Auto-reading weight scale -> collecting payment -> printing thermal receipt.',
      'Gate Security Verification: Scanning driver QR code to verify loaded material matches invoice before gate release.',
      'Shift Cash Handoff: Reconciling collected cash against gate pass receipts before handing shift to next cashier.'
    ],
    securityScope: 'Depot / Weighbridge Station-scoped RLS permissions.'
  },
  {
    id: 'portal-super-analytics',
    number: 15,
    title: 'Executive Platform Analytics & BI Command Portal',
    icon: 'BarChart3',
    targetUser: 'Board Members, Investors & Executive C-Suite',
    keyCapabilities: [
      'Real-time Enterprise Business Health Scorecard (0-100), consolidated P&L, and 90-day cashflow forecast.',
      'Cross-quarry production yield comparison, fleet utilization matrix, and customer credit risk radar.',
      'Gemini AI Executive Voice/Text Query Assistant for instant natural language report synthesis.',
      'Strategic CapEx simulator evaluating new quarry pit acquisitions, machinery investments, and branch expansion.'
    ],
    coreWorkflows: [
      'Morning Executive Digest: AI auto-generates 6:00 AM summary of yesterday’s production, sales, and cash balance.',
      'Risk Intervention: Instant drill-down from enterprise risk alert to delinquent customer account.',
      'Board Meeting Presentation Export: Exporting multi-branch performance analytics to formatted PDF presentation.'
    ],
    securityScope: 'Executive C-Suite & Board-level authorization scope.'
  }
];

export const WEB_PLATFORM_SPECIFICATION = {
  architecturePattern: 'Single-Page Application (SPA) + Progressive Web App (PWA) + Server-Side Express Proxy',
  frameworkStack: 'React 18 + Vite + TypeScript + Tailwind CSS + Lucide React + Motion/React',
  pwaCapabilities: [
    'Service Worker background caching for offline application shell and core asset bundle.',
    'IndexedDB local client storage for offline form entries (Gate passes, trip notes, inventory logs).',
    'Background Sync API automatically flushing queued offline mutations when internet restores.',
    'Installable web app prompt for desktop, Android chrome, and iOS Safari homescreens.'
  ],
  keyFeatures: [
    'Role-Based Responsive Dashboard Layouts: Dynamic navigation tree rendering only permitted portals.',
    'Customizable Drag-and-Drop Widget Engine: Users assemble personalized KPI metrics, charts, and shortcuts.',
    'Global Smart Search (Ctrl+K): Sub-50ms search across customers, vehicles, invoices, orders, and products.',
    'Multi-Language Localization Engine: Instant switching between Malayalam, English, Tamil, and Hindi.',
    'Dark Mode & Accessibility (WCAG 2.1 AA): High-contrast dark canvas for night shift quarry operators.'
  ]
};

export const MOBILE_APP_SPECIFICATION = {
  frameworkStack: 'React Native / Flutter Cloud Hybrid Native Shell with Shared TypeScript Business Logic',
  targetPlatforms: ['Android (APK / App Bundle - API Level 24+)', 'iOS (IPA - iOS 14.0+)'],
  nativeCapabilities: [
    'Offline First Data Capture: Full SQLite local database allowing drivers/operators to log data without network.',
    'Background GPS Tracking: High-precision location updates sent every 30 seconds for active tipper trips.',
    'Camera & Document Scanner: Edge document boundary detection, perspective correction, and auto-contrast for bill OCR.',
    'QR Code & Barcode Scanner: Hardware-accelerated camera scanner for gate passes, asset tags, and driver IDs.',
    'Biometric Authentication: Native Fingerprint / FaceID login with secure OS KeyStore credential storage.',
    'Push Notifications: Firebase Cloud Messaging (FCM) & Apple Push Notification service (APNs) integration.',
    'Voice Input Gateway: Native speech microphone recorder streaming audio to Gemini Voice Gateway.'
  ]
};

export const SECURITY_ARCHITECTURE_SPECIFICATION = {
  authentication: 'OAuth 2.0 + OpenID Connect (OIDC) with Firebase Auth / Cloud Auth Identity Provider.',
  authorization: 'Attribute & Role-Based Access Control (RBAC) + 4-Tier Row-Level Security (RLS) in PostgreSQL.',
  rlsFourTiers: [
    'Tier 1: Tenant ID Isolation (Guarantees zero cross-company data visibility).',
    'Tier 2: Branch / Site Isolation (Restricts users to assigned quarries, crushers, or material yards).',
    'Tier 3: Role Permission Scoping (Filters read/write capabilities by explicit RBAC permission keys).',
    'Tier 4: Record Ownership Scoping (Restricts employees/drivers to records authored by or assigned to them).'
  ],
  dataProtection: [
    'AES-256 Encryption at Rest for all Cloud SQL storage, file attachments, and backups.',
    'TLS 1.3 Transport Encryption for all client-to-server and inter-service gRPC communication.',
    'Automated Sensitive Data Masking: Redacting customer phone numbers, driver Aadhaar, and bank account numbers.',
    'Device Vault & Session Revocation: Instant remote wipe of lost mobile phone active sessions.'
  ],
  auditLedger: 'Immutable Append-Only Audit Vault logging user ID, IP address, device fingerprint, payload hash, and timestamp for every write operation.'
};

export const DEVOPS_CLOUD_SPECIFICATION = {
  cloudProvider: 'Google Cloud Platform (GCP) / Cloud Run Containers + Managed Cloud SQL PostgreSQL',
  environments: [
    'Development (Dev): Feature branch preview deployments with synthetic mock data.',
    'Testing / QA: Automated end-to-end integration testing environment.',
    'Staging (Pre-Prod): Mirror copy of production setup with sanitized data for user acceptance testing.',
    'Production (Prod): High-availability multi-zone deployment with auto-scaling container pods.'
  ],
  ciCdStrategy: [
    'GitHub Actions / Cloud Build Automated Pipelines.',
    'Automated Linting, Static Code Analysis (ESLint, SonarQube), and TypeScript Compiler Checks.',
    'Automated Docker Container Build & Container Registry Upload.',
    'Zero-Downtime Blue-Green & Canary Deployment via Google Cloud Run / Kubernetes (GKE).',
    'Automated Rollback Strategy: Instant rollback to previous container image hash on health check failure.'
  ],
  infrastructureAsCode: 'Terraform scripts provisioning Cloud Run, Cloud SQL PostgreSQL, Redis Cache, Cloud Storage, and Cloud Armor WAF.'
};

export const QA_TESTING_STRATEGY = {
  layers: [
    { level: 'Unit Testing', coverage: '>85%', tools: 'Vitest / Jest for business logic, math calculations, and state reducers.' },
    { level: 'Integration Testing', coverage: '>80%', tools: 'Supertest + PostgreSQL test container for API routes and database queries.' },
    { level: 'End-to-End (E2E) Testing', coverage: '100% Critical Flows', tools: 'Playwright / Cypress for user login, order placement, and invoice generation.' },
    { level: 'Mobile App Automation', coverage: 'Core Workflows', tools: 'Appium / Detox testing offline sync, camera scanner, and GPS tracking.' },
    { level: 'Performance & Load Testing', coverage: '10,000 Concurrent Users', tools: 'k6 / Locust simulating peak weighbridge gate pass spikes and order bursts.' },
    { level: 'Security Penetration Testing', coverage: 'OWASP Top 10', tools: 'OWASP ZAP, SonarQube static analysis, and third-party security audits.' }
  ]
};

export const PERFORMANCE_SCALABILITY_SPECIFICATION = {
  cachingStrategy: 'Redis Cluster multi-tier caching (Session tokens, active prices, master data, search indices).',
  cdnDelivery: 'Google Cloud CDN for fast static frontend asset serving and PDF invoice downloads.',
  databaseScaling: 'Cloud SQL Read Replicas for analytical queries + PgBouncer connection pooling.',
  queueProcessing: 'BullMQ & Redis background worker pools for heavy tasks (OCR parsing, PDF generation, WhatsApp dispatch).',
  disasterRecovery: {
    rpo: 'RPO = 0 (Zero data loss via synchronous database WAL replication)',
    rto: 'RTO < 15 minutes (Automated cross-region database failover)',
    backupFrequency: 'Automated continuous Point-In-Time Recovery (PITR) with daily encrypted offsite backups.'
  }
};

export const OBSERVABILITY_SPECIFICATION = {
  metrics: 'Prometheus & Grafana dashboards tracking API request latency (p95 < 200ms), DB CPU, and memory.',
  tracing: 'OpenTelemetry distributed tracing across client apps, Express backend, and Gemini AI Gateway.',
  logAggregation: 'Cloud Logging structured JSON logs with correlation IDs linking requests across services.',
  alerts: 'PagerDuty & Slack alarms for server errors (>0.1%), DB CPU (>80%), or offline sync failures.'
};

export const EXTERNAL_INTEGRATIONS_SPECIFICATION = [
  { service: 'Google Maps Platform', purpose: 'Distance calculations, route optimization, geocoding, and live tipper tracking map.' },
  { service: 'GPS Telematics Gateways', purpose: 'Hardware GPS integration (Teltonika, Concox) for speed, fuel sensors, and engine ignition.' },
  { service: 'Payment Gateways', purpose: 'Razorpay / Cashfree / Stripe for online UPI, NetBanking, Credit Cards, and recurring payouts.' },
  { service: 'WhatsApp Business API', purpose: 'Automated trip vouchers, PDF tax invoices, order updates, and payment reminders.' },
  { service: 'Transactional SMS & Email', purpose: 'Twilio / Msg91 SMS and SendGrid email delivery for OTPs and statutory statements.' },
  { service: 'Cloud Storage Vault', purpose: 'Google Cloud Storage buckets for driver documents, RC photos, and signed e-PODs.' },
  { service: 'IoT Weighbridge Systems', purpose: 'RS232 / Serial / Ethernet weighbridge scale reader for gross and tare truck weight.' },
  { service: 'RFID & Boom Barrier Gate', purpose: 'Automated RFID vehicle windshield tag reader for hands-free quarry gate entry.' },
  { service: 'Biometric Facial Recognition', purpose: 'IoT hardware biometric clocking devices for quarry laborer shift attendance.' }
];

export const PLATFORM_FOLDER_STRUCTURE = [
  'src/',
  '├── platform/',
  '│   ├── web/                     # Responsive SPA / PWA Shell',
  '│   │   ├── components/          # Reusable UI Controls & Layouts',
  '│   │   ├── hooks/               # Custom React Hooks & Offline Sync',
  '│   │   └── widgets/             # Customizable Executive Widgets',
  '│   ├── mobile/                  # Android & iOS Native Mobile Code',
  '│   │   ├── offline/             # SQLite Local Cache & Background Sync',
  '│   │   ├── sensors/             # GPS Telematics, Camera, Barcode Scanner',
  '│   │   └── biometrics/          # Native Fingerprint & FaceID Handler',
  '│   ├── portals/                 # 15 Specialized Role-Based Portals',
  '│   │   ├── super-admin/         # Platform Operator Portal',
  '│   │   ├── company-admin/       # Tenant Settings & RBAC Portal',
  '│   │   ├── quarry-owner/        # Mine Production & Royalty Portal',
  '│   │   ├── crusher-owner/       # Crusher Plant & Inventory Portal',
  '│   │   ├── vehicle-owner/       # Fleet Telematics & Trip Portal',
  '│   │   ├── driver-app/          # Driver Navigation & e-POD App',
  '│   │   ├── customer-portal/     # Online Material Ordering Portal',
  '│   │   ├── supplier-portal/     # Vendor PO & Bill OCR Portal',
  '│   │   ├── employee-ess/        # Attendance & Payroll ESS Portal',
  '│   │   └── analytics-csuite/    # Executive BI Command Portal',
  '│   ├── security/                # AuthN/AuthZ, 4-Tier RLS, PII Vault',
  '│   └── devops/                  # CI/CD, Kubernetes, Terraform & Helm',
  '├── modules/                     # 11 BOS Core Microservices (Mining, Fleet, Materials, etc.)',
  '└── k8s/                         # Helm Charts, Cloud Run Specs & Terraform Scripts'
];

export const PRODUCTION_READINESS_CHECKLIST = [
  { task: 'Database RLS Verification', category: 'Security', status: 'VERIFIED', details: 'Confirmed 100% of tables enforce company_id and branch_id tenant isolation policies.' },
  { task: 'Secrets & API Key Security', category: 'Security', status: 'VERIFIED', details: 'All production API keys, DB passwords, and OAuth secrets stored in Google Secret Manager.' },
  { task: 'SSL/TLS & Domain Binding', category: 'Infrastructure', status: 'VERIFIED', details: 'TLS 1.3 SSL certificates issued for all portal subdomains with HSTS enabled.' },
  { task: 'Database Backup & PITR Test', category: 'Disaster Recovery', status: 'VERIFIED', details: 'Point-In-Time Recovery tested successfully; restored DB copy in under 10 minutes.' },
  { task: 'Load Testing Verification', category: 'Performance', status: 'VERIFIED', details: 'Simulated 10,000 concurrent user gate pass transactions with p95 response time < 180ms.' },
  { task: 'Mobile App Offline Sync Test', category: 'Mobile QA', status: 'VERIFIED', details: 'Tested driver offline e-POD submission with network disconnect; 100% data synced on reconnect.' },
  { task: 'Penetration Testing Audit', category: 'Security', status: 'VERIFIED', details: 'Zero critical or high OWASP vulnerabilities found in external penetration security scan.' }
];

export const GO_LIVE_CHECKLIST = [
  { step: 1, action: 'Provision Production Cloud Run & Cloud SQL PostgreSQL instances via Terraform.', verified: true },
  { step: 2, action: 'Deploy initial database migrations and seed system master tables.', verified: true },
  { step: 3, action: 'Configure Google Secret Manager, Redis Cluster, and Cloud Storage buckets.', verified: true },
  { step: 4, action: 'Setup Google Maps, WhatsApp Business, Payment Gateway, and SMS API credentials.', verified: true },
  { step: 5, action: 'Publish Android APK / App Bundle to Google Play Store and iOS IPA to Apple App Store.', verified: true },
  { step: 6, action: 'Conduct final smoke test across all 15 Specialized Portals and Mobile App flows.', verified: true },
  { step: 7, action: 'Activate DNS CNAME records and cutover production web traffic to RZ® Minetrix BOS Cloud.', verified: true }
];

export const FUTURE_EXPANSION_ROADMAP = [
  {
    phase: 'Phase 13 (Q1 2027)',
    title: 'Autonomous Drone Quarry Pit Mapping & LiDAR Stockpile Volumetrics',
    description: 'Integration with autonomous survey drones for automated 3D LiDAR volumetric stockpile measurement and quarry pit bench safety monitoring.'
  },
  {
    phase: 'Phase 14 (Q2 2027)',
    title: 'Edge Computer Vision Gate Cameras & Autonomous AI Weighbridges',
    description: 'On-device camera AI models running directly on weighbridge camera hardware for instant license plate recognition and automatic truck body filling percentage estimation.'
  },
  {
    phase: 'Phase 15 (Q3 2027)',
    title: 'Global Multi-Region Cross-Border Quarry Operations & Carbon Ledger',
    description: 'Multi-currency, multi-jurisdiction mining tax compliance, carbon footprint tracking, and international building material export platform.'
  }
];
