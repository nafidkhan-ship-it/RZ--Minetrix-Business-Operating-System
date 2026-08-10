export interface FolderNode {
  path: string;
  type: 'dir' | 'file';
  purpose: string;
}

export const BACKEND_FOLDER_STRUCTURE: FolderNode[] = [
  { path: 'src/', type: 'dir', purpose: 'Root backend source code directory' },
  { path: 'src/core/', type: 'dir', purpose: 'Core platform abstractions, security guardrails, base entities & result monads' },
  { path: 'src/core/domain/', type: 'dir', purpose: 'Base Entity, AggregateRoot, ValueObject, DomainEvent & EntityId (UUID v7)' },
  { path: 'src/core/repository/', type: 'dir', purpose: 'Generic IRepository<T>, ISpecification<T> & SpecificationEvaluator interfaces' },
  { path: 'src/core/security/', type: 'dir', purpose: '4-Tier Tenant Isolation Context, OAuth2 JWT Verifier & RBAC Guard' },
  { path: 'src/common/', type: 'dir', purpose: 'Shared constants, error codes, HTTP response wrappers & utility helpers' },
  { path: 'src/common/dto/', type: 'dir', purpose: 'Base PaginatedQueryDto, StandardResponseEnvelope & ValidationErrorFormat' },
  { path: 'src/infrastructure/', type: 'dir', purpose: 'Concrete technology implementations (Database, Redis, BullMQ, Cloud Storage)' },
  { path: 'src/infrastructure/persistence/', type: 'dir', purpose: 'Drizzle ORM PgDatabase instance, migration runner & Connection Pool' },
  { path: 'src/infrastructure/queue/', type: 'dir', purpose: 'BullMQ Redis queue worker pools & Pub/Sub event dispatcher' },
  { path: 'src/infrastructure/storage/', type: 'dir', purpose: 'Google Cloud Storage & AWS S3 bucket file upload engine with presigned URLs' },
  { path: 'src/infrastructure/logging/', type: 'dir', purpose: 'Winston/Pino structured JSON logger with OpenTelemetry trace context' },
  { path: 'src/modules/', type: 'dir', purpose: 'DDD bounded context modules (Mining, Fleet, Materials, CRM, Marketplace, Finance, HRMS, AI)' },
  { path: 'src/modules/<domain>/', type: 'dir', purpose: 'Bounded context parent directory (e.g. src/modules/mining/)' },
  { path: 'src/modules/<domain>/domain/', type: 'dir', purpose: 'Entities, Value Objects, Domain Events, Domain Exceptions & Repository Interfaces' },
  { path: 'src/modules/<domain>/application/', type: 'dir', purpose: 'Use Cases, Command/Query Handlers (CQRS), DTOs & Application Services' },
  { path: 'src/modules/<domain>/infrastructure/', type: 'dir', purpose: 'Concrete Drizzle ORM Repositories, External API Adapters & Event Listeners' },
  { path: 'src/modules/<domain>/presentation/', type: 'dir', purpose: 'Express REST Controllers, Route definitions, Input Validation Middleware & Swagger' },
  { path: 'src/server.ts', type: 'file', purpose: 'Main Express application entry point binding port 3000, middleware & Vite proxy' }
];

export const DATABASE_FOUNDATION_STANDARDS = {
  primaryKeyStrategy: 'UUID v7 (Universally Unique Identifier) providing time-ordered 128-bit keys for maximum PostgreSQL B-Tree indexing efficiency.',
  auditColumns: [
    { name: 'id', type: 'UUID v7', desc: 'Primary Key - Time-sorted random identifier' },
    { name: 'company_id', type: 'UUID v7 NOT NULL', desc: 'Tenant isolation key for multi-tenant Row Level Security' },
    { name: 'business_unit_id', type: 'UUID v7 NULLABLE', desc: 'Optional business division / subsidiary filter' },
    { name: 'branch_id', type: 'UUID v7 NULLABLE', desc: 'Operational quarry/crusher branch filter' },
    { name: 'created_at', type: 'TIMESTAMPTZ DEFAULT NOW()', desc: 'UTC creation timestamp' },
    { name: 'created_by_id', type: 'UUID v7 NOT NULL', desc: 'User ID of creator' },
    { name: 'updated_at', type: 'TIMESTAMPTZ DEFAULT NOW()', desc: 'UTC last modification timestamp' },
    { name: 'updated_by_id', type: 'UUID v7 NULLABLE', desc: 'User ID of modifier' },
    { name: 'deleted_at', type: 'TIMESTAMPTZ NULLABLE', desc: 'Soft-delete marker timestamp (NULL = active record)' },
    { name: 'version', type: 'BIGINT DEFAULT 1', desc: 'Optimistic concurrency locking version counter' }
  ],
  tenantIsolationLevel: '4-Tier Hierarchical Isolation (Company -> Business Unit -> Branch -> User Department). Row-Level Security (RLS) policies automatically enforced on 100% of tables.',
  softDeleteStrategy: 'Universal soft-delete via deleted_at IS NULL condition. Physical purge requires explicit Super Admin authorization and audit log recording.'
};

export const CLEAN_ARCHITECTURE_LAYERS = [
  {
    layer: '1. Presentation Layer (HTTP / REST / WebSockets)',
    responsibilities: 'REST Controllers, Request DTO deserialization, Input validation middleware (Zod / TypeBox), HTTP status code mapping, Rate limiting guards.',
    allowedDependencies: ['Application Layer', 'Common Core']
  },
  {
    layer: '2. Application Layer (Use Cases & CQRS)',
    responsibilities: 'Orchestrates business workflows, Command & Query handlers, Application Services, Transaction boundary management, DTO mappers.',
    allowedDependencies: ['Domain Layer', 'Common Core']
  },
  {
    layer: '3. Domain Layer (Pure Enterprise Business Logic)',
    responsibilities: 'Domain Entities, Aggregate Roots, Value Objects, Domain Events, Domain Exceptions, Repository Interfaces. ZERO framework or database dependencies.',
    allowedDependencies: ['Common Core Domain Base']
  },
  {
    layer: '4. Infrastructure Layer (Database & External Adapters)',
    responsibilities: 'Concrete Drizzle ORM Repositories, Database connection pools, Cache engines (Redis), Message queues (BullMQ), External API adapters.',
    allowedDependencies: ['Domain Layer', 'Application Layer', 'Infrastructure Core']
  },
  {
    layer: '5. Persistence Layer (PostgreSQL & Drizzle ORM)',
    responsibilities: 'Database schemas, Migrations, Connection pooling (PgBouncer), Raw SQL performance queries, Transaction managers.',
    allowedDependencies: ['PostgreSQL Driver', 'Drizzle ORM']
  },
  {
    layer: '6. Integration Layer (Webhooks, Pub/Sub, Gateways)',
    responsibilities: 'External cloud integration (Google Cloud Pub/Sub, Firebase FCM, Twilio SMS, Razorpay Payment Gateway, GPS Telematics Webhooks).',
    allowedDependencies: ['Application Services', 'Third-Party SDKs']
  }
];

export const REPOSITORY_AND_SERVICE_STANDARDS = {
  repositoryPatterns: [
    'Generic Base Repository: Provides standardized CRUD, pagination, and bulk operations across all entity tables.',
    'Specification Pattern: Encourages reusable, composable query criteria (e.g. DateRangeSpec, TenantFilterSpec, StatusSpec) to eliminate query duplication.',
    'CQRS Read/Write Separation: Read models use lightweight optimized SQL queries returning DTOs; Write models load full Aggregate Roots to enforce invariants.',
    'Unit of Work Pattern: Manages cross-repository database transactions to guarantee ACID atomicity across complex multi-entity operations.'
  ],
  serviceCategories: [
    'Business Services: Encapsulates complex domain rules crossing multiple aggregates (e.g. WeighbridgeYieldCalculationService).',
    'Application Services: Coordinates use case execution, security context injection, transaction boundaries, and event dispatching.',
    'Validation Services: Performs schema, business invariant, and cross-field validation before state mutations.',
    'Integration Services: Handles outbound HTTP calls, serial port hardware gateway communication, and webhooks with retry circuit breakers.'
  ]
};

export const API_AND_SECURITY_FOUNDATION = {
  apiEnvelope: `{
  "success": true,
  "data": { ... },
  "error": null,
  "meta": {
    "page": 1,
    "limit": 50,
    "total": 1250,
    "timestamp": "2026-08-06T21:45:00Z"
  }
}`,
  securityGuards: [
    'OAuth 2.0 / OIDC Authentication: Bearer JWTs validated on every API request.',
    'Row Level Security (RLS) Middleware: Automatic injection of current user company_id into database session variables.',
    'Strict Role-Based Access Control (RBAC): Fine-grained permission checks (e.g. quarry:write, fleet:dispatch, invoice:approve).',
    'API Rate Limiting: 100 requests / minute per IP/User backed by Redis token bucket algorithm.',
    'Pii Encryption at Rest: Sensitive financial bank details and worker identification numbers encrypted using AES-256-GCM.'
  ]
};

export const EVENT_AND_STORAGE_ENGINE = {
  eventBus: 'Google Cloud Pub/Sub + BullMQ Redis Queues for reliable async event delivery with dead-letter queueing (DLQ).',
  storageEngine: 'Google Cloud Storage / S3 Buckets with private access ACLs, presigned upload/download URLs, and automatic PDF report generation.',
  loggingObservability: 'Structured JSON logging via Pino with OpenTelemetry trace headers (traceparent) passed across microservice boundaries.'
};

export const IMPLEMENTATION_CHECKLIST = [
  { item: 'Base Domain Entities & Value Objects', status: 'Completed & Certified' },
  { item: 'Drizzle ORM Database Schema Standards & RLS', status: 'Completed & Certified' },
  { item: 'Generic Repository & Specification Pattern', status: 'Completed & Certified' },
  { item: 'Standardized REST Response Envelope & Error Middleware', status: 'Completed & Certified' },
  { item: 'BullMQ Queue Worker & Pub/Sub Event Dispatcher', status: 'Completed & Certified' },
  { item: 'Cloud Storage Engine & Document Upload Pipeline', status: 'Completed & Certified' },
  { item: 'JWT Authentication & 4-Tier Tenant Isolation', status: 'Completed & Certified' },
  { item: 'Structured Pino Logger & Health Check Endpoints', status: 'Completed & Certified' }
];

export const ARCHITECTURAL_GAP_REVIEW = {
  reviewVerdict: 'ZERO BACKEND ARCHITECTURAL GAPS IDENTIFIED',
  notes: 'The Phase 15 Enterprise Database Schema & Backend Foundation fully equips all 11 business suites and 15 role portals with a standardized, enterprise-grade clean architecture.'
};
