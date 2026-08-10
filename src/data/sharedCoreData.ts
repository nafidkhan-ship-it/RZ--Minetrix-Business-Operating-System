import { SharedCoreModule } from '../types/architecture';

export const SHARED_CORE_MODULES: SharedCoreModule[] = [
  {
    id: 'identity-auth',
    number: 1,
    title: 'Identity & Authentication Engine',
    icon: 'KeyRound',
    category: 'Security & Auth',
    summary: 'Centralized authentication protocol supporting multi-factor auth, stateless JWT/JWKS dual-tokens, biometric device binding, and enterprise SSO.',
    keyResponsibilities: [
      'Stateless Dual-Token Issuance: Short-lived access JWTs (15 min) + Refresh tokens (7 days) in HttpOnly secure cookies.',
      'Argon2id Password Hashing: High-memory key derivation with per-user cryptographic salt & pepper.',
      'Multi-Factor Authentication (MFA): TOTP (Google Authenticator/Authy) and SMS/WhatsApp OTP fallbacks.',
      'Device Management & Fingerprinting: Device trust binding, active session tracking, and remote kill switch.',
      'Federated Single Sign-On (SSO): OAuth2 / SAML 2.0 integration for enterprise corporate logins.'
    ],
    serviceBoundaries: [
      'Encapsulates user credentials, refresh tokens, and device registry in dedicated auth database schema.',
      'Exposes gRPC and REST endpoints exclusively for Token Verification, Session Validation, and OTP Generation.'
    ],
    securityAndPermissions: [
      'Brute-force protection with exponential rate limiting (5 failed attempts trigger 15-min lockout).',
      'Device fingerprint mismatch forces step-up MFA challenge.'
    ],
    eventStreams: {
      publishes: ['core.auth.user_logged_in', 'core.auth.session_revoked', 'core.auth.mfa_challenged'],
      subscribes: ['core.user.status_changed']
    },
    suiteConsumers: ['Mining Suite', 'Fleet Suite', 'Building Materials Suite', 'CRM Suite', 'Marketplace Suite'],
    techStack: 'Node.js / Express, Argon2id, Redis Session Store, JWKS, Twilio / WhatsApp Cloud API'
  },
  {
    id: 'authorization-rbac',
    number: 2,
    title: 'Authorization & Fine-Grained Access Control',
    icon: 'ShieldCheck',
    category: 'Security & Auth',
    summary: 'Hybrid RBAC + ABAC authorization framework enforcing row-level, field-level, and multi-boundary (Company, Branch, Business Unit) data security.',
    keyResponsibilities: [
      'Role Based Access Control (RBAC): Dynamic custom roles with granular permission grants.',
      'Attribute-Based Access Control (ABAC): Dynamic context checks (e.g. time-of-day, IP subnet, operational shift).',
      'Multi-Level Boundary Scoping: Strict isolation at Company, Branch, Business Unit, and Quarry Site levels.',
      'Field-Level Data Masking & Redaction: Mask financial margins, statutory royalty rates, or customer PII based on user role.',
      'Dynamic Permission Matrix: Instant permission updates propagate via Redis Pub/Sub invalidation in <50ms.'
    ],
    serviceBoundaries: [
      'Stores permission definitions, role mappings, and policy enforcement rules.',
      'Injects authorization middleware into API Gateway for zero-trust route enforcement.'
    ],
    securityAndPermissions: [
      'PostgreSQL RLS context provider initializing `app.current_user_id`, `app.current_branch_id`, and `app.current_role`.',
      'Zero default permissions — explicit whitelist policy model.'
    ],
    eventStreams: {
      publishes: ['core.authz.role_updated', 'core.authz.permission_revoked'],
      subscribes: ['core.auth.user_logged_in']
    },
    suiteConsumers: ['Mining Suite', 'Fleet Suite', 'Building Materials Suite', 'CRM Suite', 'Marketplace Suite'],
    techStack: 'PostgreSQL RLS, Casbin / OPA Policy Engine, Redis Pub/Sub'
  },
  {
    id: 'multi-tenant-platform',
    number: 3,
    title: 'Multi-Tenant SaaS Platform Engine',
    icon: 'Building2',
    category: 'Data & Multi-Tenancy',
    summary: 'Foundational multi-tenancy governor managing organization hierarchies, subscription licensing tiers, tenant quotas, and feature flags.',
    keyResponsibilities: [
      '4-Tier Organization Hierarchy: Tenant -> Company -> Branch -> Business Unit.',
      'Subscription & Licensing Engine: Tiered SaaS packaging (Starter, Growth, Enterprise, Custom).',
      'Usage Quotas & Rate Governors: Real-time tracking of API calls, storage usage, active drivers, and weighbridge passes.',
      'Feature Flag & Entitlement Manager: Toggle suite modules dynamically per tenant without code redeploy.',
      'Tenant Provisioning Automation: Self-service tenant onboarding initializing database schemas and default masters.'
    ],
    serviceBoundaries: [
      'Authoritative master for tenant accounts, billing cycles, quotas, and organizational trees.',
      'Monitors system usage metrics and blocks operations exceeding tier limits.'
    ],
    securityAndPermissions: [
      'Universal `tenant_id` mandatory foreign key on 100% of persistent storage tables.',
      'Strict database-level Row-Level Security (RLS) policies prevent cross-tenant data leaks.'
    ],
    eventStreams: {
      publishes: ['core.tenant.provisioned', 'core.tenant.quota_exceeded', 'core.tenant.plan_upgraded'],
      subscribes: []
    },
    suiteConsumers: ['Mining Suite', 'Fleet Suite', 'Building Materials Suite', 'CRM Suite', 'Marketplace Suite'],
    techStack: 'PostgreSQL RLS, Redis Quota Counter, Stripe / Razorpay Webhooks'
  },
  {
    id: 'user-management',
    number: 4,
    title: 'User Management & Poly-Identity Linker',
    icon: 'Users',
    category: 'Security & Auth',
    summary: 'Enterprise directory managing user profiles, organizational hierarchy, and poly-associations with field personnel (Employees, Drivers, Operators).',
    keyResponsibilities: [
      'UserProfile & Identity Registry: Contact details, avatar, regional preferences, and language locale.',
      'Department & Designation Matrices: Multi-dimensional org charts and reporting hierarchy.',
      'Poly-Identity Entity Linker: Map single user account to HR Employee, Fleet Driver, Tipper Owner, or Quarry Operator.',
      'User Groups & Team Allocations: Group-based notification routing and task distribution.',
      'Lifecycle Delegation: Account suspension, handover of pending approvals, and exit deprovisioning.'
    ],
    serviceBoundaries: [
      'Manages user master profiles and external domain identity links.',
      'Does not handle raw authentication secrets (delegated to Identity & Auth Module).'
    ],
    securityAndPermissions: [
      'Self-service profile edits guarded by field permission schema.',
      'Org chart modifications restricted to HR & System Admin roles.'
    ],
    eventStreams: {
      publishes: ['core.user.created', 'core.user.updated', 'core.user.linked_to_entity'],
      subscribes: ['hr.employee.created', 'fleet.driver.created']
    },
    suiteConsumers: ['Mining Suite', 'Fleet Suite', 'Building Materials Suite', 'CRM Suite', 'Marketplace Suite'],
    techStack: 'Node.js, GraphQL Directory API, PostgreSQL'
  },
  {
    id: 'shared-masters',
    number: 5,
    title: 'Shared Master Data Management (MDM)',
    icon: 'Database',
    category: 'Data & Multi-Tenancy',
    summary: 'Universal master data repository standardizing geopolitical entities, tax compliance codes, currency conversions, UOMs, and trade terms.',
    keyResponsibilities: [
      'Geopolitical Master Data: ISO 3166 Country, State, District, and PIN Code databases.',
      'Tax & GST Rule Matrix: Standard tax codes (GST, HSN/SAC, TDS, TCS, VAT) with effective date ranges.',
      'Multi-Currency Engine: ISO currency list with automated daily exchange rate feeds.',
      'Units of Measure (UOM) Converter: Dimensional conversions (Tons -> Cubic Meters, CFT -> Tons, Bags -> KGs).',
      'Document Types & Payment Terms: Standardized trade terms (Net 30, COD, Advance, PDC) and document taxonomy.'
    ],
    serviceBoundaries: [
      'Source of truth for all universal static reference tables and tax structures.',
      'High-cache hit ratio powered by Redis L2 in-memory storage.'
    ],
    securityAndPermissions: [
      'Read-access granted to all authenticated microservices.',
      'Write-access strictly reserved for System Admins and Tax Compliance Officers.'
    ],
    eventStreams: {
      publishes: ['core.master.tax_updated', 'core.master.currency_rate_updated'],
      subscribes: []
    },
    techStack: 'PostgreSQL, Redis L2 Cache, Open Exchange Rates API',
    suiteConsumers: ['Mining Suite', 'Fleet Suite', 'Building Materials Suite', 'CRM Suite', 'Marketplace Suite']
  },
  {
    id: 'notification-platform',
    number: 6,
    title: 'Omni-Channel Notification Router',
    icon: 'Bell',
    category: 'Integration & Ops',
    summary: 'Asynchronous notification broker delivering messages via In-App WebSockets, WhatsApp Business Cloud API, Email, SMS, and Mobile Push.',
    keyResponsibilities: [
      'Multi-Channel Router: In-App Toast/Bell, WhatsApp API, Transactional Email (SES), SMS, and Mobile Push (FCM).',
      'Dynamic Template Engine: Localized Handlebars templates with variable injection and preview sandbox.',
      'Scheduled Reminder Engine: Automated Cron cronjobs for payment follow-ups, weighbridge pass expiries, and royalty pass limits.',
      'User Preference Matrix: Opt-in/opt-out channel controls per notification category.',
      'Delivery Audit & Fallback Routing: Automatic retry with fallback channel (e.g. WhatsApp fails -> SMS fallback).'
    ],
    serviceBoundaries: [
      'Consumes notification events from all domain microservices via Kafka/NATS.',
      'Handles rate limits, provider webhooks, and delivery status logs.'
    ],
    securityAndPermissions: [
      'Sanitizes outgoing messages to prevent sensitive PII leakage.',
      'Encrypted template variables stored in memory during processing.'
    ],
    eventStreams: {
      publishes: ['core.notification.sent', 'core.notification.failed'],
      subscribes: ['*.*.notification_requested', 'mining.gatepass.created', 'finance.invoice.overdue']
    },
    suiteConsumers: ['Mining Suite', 'Fleet Suite', 'Building Materials Suite', 'CRM Suite', 'Marketplace Suite'],
    techStack: 'Node.js, WhatsApp Cloud API, AWS SES, Twilio, Firebase Cloud Messaging, WebSockets'
  },
  {
    id: 'document-management',
    number: 7,
    title: 'Document Management System (DMS)',
    icon: 'FolderKanban',
    category: 'Integration & Ops',
    summary: 'Enterprise document repository handling file storage, automated watermarking, versioning, PDF generation, and expiring secure URLs.',
    keyResponsibilities: [
      'Cloud Object Storage Integration: AWS S3 / MinIO compatible storage with tenant-isolated bucket prefixes.',
      'Expiring Presigned URLs: Time-limited (15-minute) secure upload and download link generation.',
      'Automated PDF Engine: Server-side rendering of Weighbridge Gate Passes, Invoices, Delivery Challans, and Quotes.',
      'Document Watermarking & QR Injection: Inject digital verification QR codes and security watermarks into generated PDFs.',
      'FileVersion & Audit Logging: Immutable version control for agreements, lease deeds, and licenses.'
    ],
    serviceBoundaries: [
      'Encapsulates all direct cloud storage SDK calls and file metadata tables.',
      'Does not store plain file payloads in database — only metadata and S3 keys.'
    ],
    securityAndPermissions: [
      'Strict tenant isolation in S3 bucket path (`s3://bucket/{tenant_id}/{entity}/{yyyy}/{mm}/{id}.pdf`).',
      'Presigned URL generation enforces user authorization check.'
    ],
    eventStreams: {
      publishes: ['core.dms.file_uploaded', 'core.dms.pdf_generated'],
      subscribes: ['mining.gatepass.issued', 'finance.invoice.created']
    },
    suiteConsumers: ['Mining Suite', 'Fleet Suite', 'Building Materials Suite', 'CRM Suite', 'Marketplace Suite'],
    techStack: 'Node.js, Puppeteer / PDFKit, AWS S3 / MinIO, Sharp Image Processor'
  },
  {
    id: 'finance-shared-services',
    number: 8,
    title: 'Finance Shared Services Bridge',
    icon: 'Receipt',
    category: 'Data & Multi-Tenancy',
    summary: 'Cross-suite accounting bridge handling auto-sequential numbering, currency conversions, tax matrix computations, and GL journal postings.',
    keyResponsibilities: [
      'Sequential Auto-Number Generator: Thread-safe atomic counter for Invoices, Gate Passes, Vouchers, and POs.',
      'Tax Matrix Engine: Calculate composite GST/VAT and TDS withholdings on transactions.',
      'General Ledger Journal Bridge: Standardized event adapter converting operational events into double-entry journal postings.',
      'Multi-Currency Conversion Service: Real-time transaction amount conversions to company base ledger currency.',
      'Financial Lock Period Enforcement: Prevent back-dated transactions into closed accounting periods.'
    ],
    serviceBoundaries: [
      'Exposes posting API endpoints and event listeners for transactional microservices.',
      'Interfaces directly with the Finance Domain Chart of Accounts.'
    ],
    securityAndPermissions: [
      'Requires financial transaction authorization scope.',
      'All posting operations generate immutable double-entry journal entries.'
    ],
    eventStreams: {
      publishes: ['core.fin.journal_posted', 'core.fin.number_generated'],
      subscribes: ['mining.sales.completed', 'fleet.fuel.logged', 'materials.so.fulfilled']
    },
    suiteConsumers: ['Mining Suite', 'Fleet Suite', 'Building Materials Suite', 'CRM Suite'],
    techStack: 'Node.js / Go, PostgreSQL Atomic Sequences, Redis Distributed Lock (Redlock)'
  },
  {
    id: 'hr-shared-services',
    number: 9,
    title: 'HR & Personnel Shared Services',
    icon: 'UserCheck',
    category: 'Data & Multi-Tenancy',
    summary: 'Universal HR bridge managing cross-domain employee identity, biometric attendance ingestion, and shift allowance calculations.',
    keyResponsibilities: [
      'Cross-Suite Employee Resolver: Unified service resolving Employee IDs for drivers, operators, cashiers, and sales agents.',
      'Biometric Attendance Event Ingestion: Real-time API endpoint accepting biometric face/fingerprint device events.',
      'Shift Timing & Allowance Calculator: Computes overtime hours, night shift allowances, and trip bonuses.',
      'Payroll Deduction Adapter: Integrates driver damage deductions or cash advances into monthly payroll runs.',
      'Leave & Availability Check: Real-time check preventing assignment of drivers or operators who are on leave.'
    ],
    serviceBoundaries: [
      'Central bridge between operational suites and the HRMS Payroll domain.',
      'Maintains operational roster states without exposing sensitive salary data.'
    ],
    securityAndPermissions: [
      'Operational users can view shift status, but salary details are restricted to HR role.'
    ],
    eventStreams: {
      publishes: ['core.hr.attendance_logged', 'core.hr.employee_assigned'],
      subscribes: ['fleet.trip.assigned', 'mining.crusher.shift_started']
    },
    suiteConsumers: ['Mining Suite', 'Fleet Suite', 'Building Materials Suite', 'CRM Suite'],
    techStack: 'Node.js, PostgreSQL, MQTT / HTTP Biometric Ingress Gateway'
  },
  {
    id: 'dashboard-engine',
    number: 10,
    title: 'Executive & Operational Dashboard Engine',
    icon: 'LayoutDashboard',
    category: 'Intelligence & Workflows',
    summary: 'Customizable widget and analytics grid supporting real-time KPI metrics, charting abstractions, and role-based quick action boards.',
    keyResponsibilities: [
      'Modular Widget Registry: Reusable visual widgets (Weighbridge Tonnage, Fleet Trips, Outstanding Receivables).',
      'KPI Card Builder: High-level metric displays with target thresholds and period-over-period comparisons.',
      'Interactive Charting Abstraction: Unified data schema for Line, Bar, Donut, and Heatmap visualizers.',
      'User Personalization & Layout Persistence: Drag-and-drop grid customization stored per user profile.',
      'Real-Time WebSocket Data Refresh: Stream live metric updates directly to executive boards.'
    ],
    serviceBoundaries: [
      'Aggregates read-only analytical data from read-replicas or Elasticsearch indexes.',
      'Does not perform transactional mutations.'
    ],
    securityAndPermissions: [
      'Enforces user authorization on widget data queries — hidden widgets emit no data.'
    ],
    eventStreams: {
      publishes: ['core.dashboard.layout_saved'],
      subscribes: ['mining.dispatch.completed', 'fleet.trip.completed']
    },
    suiteConsumers: ['Mining Suite', 'Fleet Suite', 'Building Materials Suite', 'CRM Suite', 'Marketplace Suite'],
    techStack: 'React 19, Recharts, WebSockets / SSE, Redis Caching'
  },
  {
    id: 'reporting-engine',
    number: 11,
    title: 'Dynamic & Scheduled Reporting Engine',
    icon: 'BarChart3',
    category: 'Intelligence & Workflows',
    summary: 'Enterprise reporting engine for ad-hoc SQL query generation, background report worker pools, and automated PDF/Excel email schedules.',
    keyResponsibilities: [
      'Dynamic Schema Query Builder: Secure parametric report generator for non-technical managers.',
      'Background Execution Worker Pool: Queue heavy reports to run asynchronously without blocking web UI.',
      'Automated Cron Schedule Triggers: Deliver daily shift reports, weekly tonnage summaries, and monthly P&L automatically.',
      'Export Formatting: Render formatted PDF reports or raw streaming Excel (.xlsx) workbooks.',
      'Row-Level Security Enforcement: All generated report queries execute under the user RLS context.'
    ],
    serviceBoundaries: [
      'Operates on isolated read-only PostgreSQL replicas.',
      'Stores generated report artifacts in S3 with 7-day retention expiry.'
    ],
    securityAndPermissions: [
      'Report access governed by user role permissions and branch data scope.'
    ],
    eventStreams: {
      publishes: ['core.report.generated', 'core.report.scheduled_sent'],
      subscribes: ['core.report.trigger_requested']
    },
    suiteConsumers: ['Mining Suite', 'Fleet Suite', 'Building Materials Suite', 'CRM Suite', 'Marketplace Suite'],
    techStack: 'Node.js, BullMQ / Redis Queue, ExcelJS, Puppeteer, PostgreSQL Read-Replicas'
  },
  {
    id: 'ai-platform',
    number: 12,
    title: 'Gemini AI Ecosystem & Automation Platform',
    icon: 'Sparkles',
    category: 'Intelligence & Workflows',
    summary: 'Server-side AI suite integrating Gemini models for operational copilot natural language queries, weighbridge receipt OCR, and voice commands.',
    keyResponsibilities: [
      'Gemini AI Operational Copilot: Natural language query engine ("Show quarry 2 tonnage for last night shift").',
      'Weighbridge OCR Engine: Extract gross weight, tare weight, vehicle number, and material grade from scanned paper slips.',
      'Voice Command Parser: Hands-free voice interface for kiosk operators and fleet dispatchers.',
      'Smart Anomaly Detection: Detect suspicious weighbridge re-weighs, fuel theft spikes, or abnormal pricing discounts.',
      'Predictive Equipment Maintenance: Analyze machinery telemetry to forecast component breakdown risks.'
    ],
    serviceBoundaries: [
      'Server-side proxy (`/api/ai/*`) securing `GEMINI_API_KEY` behind strict tenant auth checks.',
      'Outputs structured JSON schemas strictly adhering to domain interfaces.'
    ],
    securityAndPermissions: [
      'Zero user PII or sensitive banking details transmitted to AI prompts.',
      'All AI inferences audited with tenant ID and token usage tracking.'
    ],
    eventStreams: {
      publishes: ['core.ai.ocr_completed', 'core.ai.anomaly_detected'],
      subscribes: ['mining.weighbridge.slip_uploaded', 'fleet.fuel.logged']
    },
    suiteConsumers: ['Mining Suite', 'Fleet Suite', 'Building Materials Suite', 'CRM Suite', 'Marketplace Suite'],
    techStack: 'Google GenAI SDK (@google/genai), Gemini 2.5 Flash / Pro, Python / FastAPI AI Microservice'
  },
  {
    id: 'api-gateway',
    number: 13,
    title: 'Enterprise API Gateway & Service Mesh',
    icon: 'Network',
    category: 'Integration & Ops',
    summary: 'Reverse proxy and traffic controller managing routing, JWKS JWT validation, rate limiting, versioning, and internal mTLS gRPC mesh.',
    keyResponsibilities: [
      'Unified Entry Point: Nginx / Express API Gateway listening on port 3000.',
      'Token Bucket Rate Limiting: Tiered limits per tenant subscription (e.g. 100 req/min vs 5,000 req/min).',
      'API Versioning Router: Support dual major versions (`/v1/`, `/v2/`) with graceful deprecation headers.',
      'Internal Service Mesh: High-performance gRPC inter-service communication with mutual TLS (mTLS).',
      'Cross-Origin (CORS) & OWASP Header Guard: Strict security headers, payload size caps, and sanitization.'
    ],
    serviceBoundaries: [
      'Perimeter firewall inspecting all inbound HTTP/WebSocket/gRPC traffic.',
      'Strips internal headers and injects validated `x-tenant-id`, `x-user-id`, and `x-branch-id` upstream.'
    ],
    securityAndPermissions: [
      'Validates JWKS signature before relaying requests to backend microservices.',
      'Automatic IP reputation checking and DDoS challenge.'
    ],
    eventStreams: {
      publishes: ['core.gateway.rate_limit_exceeded', 'core.gateway.threat_blocked'],
      subscribes: []
    },
    suiteConsumers: ['Mining Suite', 'Fleet Suite', 'Building Materials Suite', 'CRM Suite', 'Marketplace Suite'],
    techStack: 'Nginx, Express, Envoy Proxy, gRPC, Redis Rate Limiter'
  },
  {
    id: 'audit-monitoring',
    number: 14,
    title: 'Audit & Telemetry Subsystem',
    icon: 'Activity',
    category: 'Integration & Ops',
    summary: 'Immutable compliance auditing, change data capture (CDC) tracking, system error masking, and APM performance telemetry.',
    keyResponsibilities: [
      'Immutable CDC Audit Trail: Record `before_state` and `after_state` JSON diffs for every data mutation.',
      'Security Login & Session History: Track IP addresses, geolocation, device fingerprints, and auth failures.',
      'Error Masking & Stack Trace Sanitization: Log full stack traces internally while returning safe error codes to clients.',
      'APM Performance Metrics: Track endpoint latency, database query times, cache hit ratios, and queue depths.',
      'Compliance Export Vault: Encrypted long-term audit archive fulfilling ISO 27001 and statutory mining audit requirements.'
    ],
    serviceBoundaries: [
      'Asynchronous write queue backed by Kafka/NATS to avoid adding latency to application transactions.',
      'Read access restricted to System Compliance Auditors.'
    ],
    securityAndPermissions: [
      'Audit log tables are append-only with PostgreSQL trigger locks preventing updates or deletes.'
    ],
    eventStreams: {
      publishes: ['core.audit.alert_triggered'],
      subscribes: ['*.*.*']
    },
    suiteConsumers: ['Mining Suite', 'Fleet Suite', 'Building Materials Suite', 'CRM Suite', 'Marketplace Suite'],
    techStack: 'PostgreSQL Append-Only Tables, OpenTelemetry, Prometheus, Grafana, Elasticsearch'
  },
  {
    id: 'backup-recovery',
    number: 15,
    title: 'Backup & Disaster Recovery (DR) Strategy',
    icon: 'HardDriveDownload',
    category: 'Integration & Ops',
    summary: 'Enterprise disaster recovery engine providing automated WAL archiving, point-in-time recovery (PITR), and air-gapped backups.',
    keyResponsibilities: [
      'Continuous Write-Ahead Log (WAL) Shipping: Continuous streaming replication to secondary cloud region.',
      'Point-In-Time Recovery (PITR): Restore database to any precise second within a 35-day rolling window.',
      'Automated Daily Snapshots: Full encrypted database backups stored in air-gapped S3 Glacier storage.',
      'RPO & RTO Guarantees: Recovery Point Objective (RPO) < 1 minute; Recovery Time Objective (RTO) < 15 minutes.',
      'Automated DR Drill Verification: Weekly automated restore test into isolated sandbox to verify backup integrity.'
    ],
    serviceBoundaries: [
      'Infrastructure-level service managing database clusters, object storage mirrors, and failover DNS.'
    ],
    securityAndPermissions: [
      'Backups encrypted with AWS KMS / GCP KMS customer-managed keys (AES-256).',
      'Multi-party authorization required for disaster recovery initiation.'
    ],
    eventStreams: {
      publishes: ['core.dr.backup_completed', 'core.dr.health_check_failed'],
      subscribes: []
    },
    suiteConsumers: ['Mining Suite', 'Fleet Suite', 'Building Materials Suite', 'CRM Suite', 'Marketplace Suite'],
    techStack: 'pgBackRest, AWS S3 Glacier, Route53 Failover DNS, Terraform'
  },
  {
    id: 'shared-workflow-engine',
    number: 16,
    title: 'Shared Workflow & Approval Engine',
    icon: 'GitFork',
    category: 'Intelligence & Workflows',
    summary: 'Configurable state machine engine driving multi-step approval workflows, task delegation, auto-escalations, and custom business rules.',
    keyResponsibilities: [
      'Multi-Tier Approval Workflows: Define custom approval chains (e.g., PO > $5,000 requires Branch Manager -> Finance Director).',
      'Task Assignment & Queue Manager: Auto-assign tasks to user roles or specific individuals with SLA timers.',
      'Automated Escalation Triggers: Escalates pending approvals after SLA threshold timeout.',
      'Custom Business Rules Engine: Declarative rule evaluation (e.g. "If vehicle weight exceeds licensed limit by 10%, block pass issuance").',
      'Visual Workflow Tracker: Audit timeline showing current step, approver history, comments, and decision timestamps.'
    ],
    serviceBoundaries: [
      'Orchestrates domain state transitions without directly owning domain business tables.',
      'Emits domain approval events upon state completion.'
    ],
    securityAndPermissions: [
      'Approver identity verified with password re-challenge for high-value financial or regulatory approvals.'
    ],
    eventStreams: {
      publishes: ['core.workflow.approved', 'core.workflow.rejected', 'core.workflow.escalated'],
      subscribes: ['mining.permit.requested', 'finance.po.approval_required']
    },
    suiteConsumers: ['Mining Suite', 'Fleet Suite', 'Building Materials Suite', 'CRM Suite', 'Marketplace Suite'],
    techStack: 'Node.js, Temporal.io / Camunda, PostgreSQL, Redis SLA Timers'
  }
];

export const SHARED_CORE_SERVICES_MAP = [
  {
    category: '1. Identity, Security & Multi-Tenancy',
    services: [
      'Identity & Auth Service (`auth-service`)',
      'RBAC & ABAC Policy Engine (`authz-service`)',
      'Tenant & Subscription Governor (`tenant-service`)',
      'User Management & Entity Linker (`user-service`)',
      'Audit & Telemetry Service (`audit-service`)'
    ]
  },
  {
    category: '2. Integration, Messaging & Documents',
    services: [
      'API Gateway & Service Mesh (`api-gateway`)',
      'Omni-Channel Notification Router (`notification-service`)',
      'Document Management & PDF Engine (`dms-service`)',
      'Shared Workflow & Approval Engine (`workflow-service`)',
      'Disaster Recovery & Backup Controller (`dr-service`)'
    ]
  },
  {
    category: '3. Data & Cross-Suite Bridges',
    services: [
      'Shared Master Data Manager (`master-service`)',
      'Finance Ledger Bridge (`fin-bridge-service`)',
      'HR Personnel Bridge (`hr-bridge-service`)',
      'Executive Dashboard Engine (`dashboard-service`)',
      'Dynamic Reporting Engine (`reporting-service`)',
      'Gemini AI Automation Service (`ai-service`)'
    ]
  }
];

export const PHASE4_READINESS_REVIEW = {
  title: 'Shared Core Architectural Review & Phase 4 Transition Readiness',
  strengths: [
    'Zero Duplicate Logic: Master data, authentication, general ledger posting, and notifications are completely centralized.',
    '4-Tier Scoping: Complete tenant boundary separation (Tenant -> Company -> Branch -> Business Unit) enforced by PostgreSQL RLS.',
    'Event-Driven Loose Coupling: Microservices communicate asynchronously via Kafka/NATS without direct synchronous database sharing.',
    'Server-Side Gemini AI: Secure, server-side AI proxy handling weighbridge OCR, voice commands, and predictive maintenance.',
    'Enterprise Compliance: Immutable audit trails with CDC tracking, presigned expiring URLs, and automated PITR disaster recovery.'
  ],
  identifiedImprovements: [
    'Distributed Transaction Consistency: Introduce Saga pattern orchestrator in Workflow Engine for multi-service transactions (e.g. Mining GatePass -> Fleet Trip -> Finance Ledger).',
    'Edge Caching Strategy: Implement Cloudflare Workers edge caching for public Marketplace listings to reduce API gateway latency.',
    'Biometric Device Connector Standardization: Standardize MQTT protocol payloads for offline weighbridge camera and biometric hardware devices.',
    'RLS Performance Tuning: Add composite GIN indexes on `(tenant_id, metadata)` JSONB columns to optimize high-throughput telemetry queries.'
  ],
  phase4ReadinessStatus: 'APPROVED FOR PHASE 4 (MINING OPERATIONS & WEIGHBRIDGE GATEPASS SUITE)'
};
