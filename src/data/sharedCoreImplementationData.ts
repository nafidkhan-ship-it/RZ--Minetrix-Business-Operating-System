export interface CoreModuleSpec {
  id: string;
  number: number;
  name: string;
  category: 'Security & Identity' | 'Organization & Access' | 'Shared Masters & Docs' | 'Workflows & Notifications' | 'Analytics & Infrastructure';
  icon: string;
  summary: string;
  keyFeatures: string[];
  dbTables: string[];
  apiEndpoints: string[];
  codeSnippet: string;
}

export const SHARED_CORE_MODULES: CoreModuleSpec[] = [
  {
    id: 'auth-module',
    number: 1,
    name: 'Authentication Engine & Session Management',
    category: 'Security & Identity',
    icon: 'Key',
    summary: 'Enterprise OAuth2 / OIDC authentication service providing JWT issuance, refresh token rotation, device session tracking, password lifecycle, and WebAuthn MFA support.',
    keyFeatures: [
      'Multi-Factor Authentication (MFA / TOTP & SMS OTP)',
      'Secure HttpOnly Refresh Token Rotation with JTI revocation',
      'Device Fingerprinting & Concurrent Session Limits',
      'Self-Service Password Reset with Signed One-Time Tokens',
      'Remember Me Persistent Cookie with HMAC Signatures'
    ],
    dbTables: ['core_users', 'core_user_credentials', 'core_auth_sessions', 'core_mfa_devices', 'core_password_resets'],
    apiEndpoints: [
      'POST /api/v1/auth/login',
      'POST /api/v1/auth/logout',
      'POST /api/v1/auth/refresh',
      'POST /api/v1/auth/mfa/verify',
      'POST /api/v1/auth/password/forgot',
      'POST /api/v1/auth/password/reset'
    ],
    codeSnippet: `// Authentication Application Service
export class AuthenticationService {
  async login(dto: LoginRequestDto): Promise<Result<AuthResponseDto>> {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user || !await user.validatePassword(dto.password)) {
      return Result.fail(new InvalidCredentialsException());
    }
    
    if (user.isMfaEnabled) {
      const challengeToken = await this.mfaService.issueChallenge(user.id);
      return Result.ok({ mfaRequired: true, challengeToken });
    }
    
    const session = await this.sessionRepo.create({
      userId: user.id,
      tenantId: user.companyId,
      deviceInfo: dto.deviceInfo,
      ipAddress: dto.ipAddress
    });
    
    const tokens = await this.jwtService.generateTokenPair(user, session.id);
    return Result.ok({ tokens, user: user.toDto() });
  }
}`
  },
  {
    id: 'user-management',
    number: 2,
    name: 'User Management & Operational Linking',
    category: 'Security & Identity',
    icon: 'UserCheck',
    summary: 'Centralized User Master with multi-department, multi-designation support and explicit cross-suite operational linking to HR Employees, Fleet Drivers, and Plant Operators.',
    keyFeatures: [
      'User Master profile with custom avatar storage',
      'Department & Designation hierarchy mapping',
      'Operational linkage: User ID <-> HRMS Employee ID',
      'Logistics linkage: User ID <-> Fleet Driver ID',
      'Quarry linkage: User ID <-> Weighbridge / Crusher Operator ID'
    ],
    dbTables: ['core_users', 'core_departments', 'core_designations', 'core_user_operational_links'],
    apiEndpoints: [
      'GET /api/v1/users',
      'POST /api/v1/users',
      'GET /api/v1/users/:id',
      'PUT /api/v1/users/:id/profile',
      'POST /api/v1/users/:id/link-employee'
    ],
    codeSnippet: `// User Operational Linkage Aggregate Rule
export class UserOperationalLinker {
  static linkToDriver(user: User, driverId: string): Result<void> {
    if (user.linkedDriverId) {
      return Result.fail(new Error("User is already linked to a Fleet Driver"));
    }
    user.assignDriverLink(driverId);
    user.addDomainEvent(new UserLinkedToDriverEvent(user.id, driverId));
    return Result.ok();
  }
}`
  },
  {
    id: 'company-management',
    number: 3,
    name: 'Multi-Tenant Company & Branch Hierarchy',
    category: 'Organization & Access',
    icon: 'Landmark',
    summary: '4-tier organizational model enforcing strict tenant isolation across Group Holding Tenants, Operating Companies, Business Units, and Operating Branches.',
    keyFeatures: [
      'Group Holding Tenant isolation boundaries',
      'Operating Company legal entity profiles',
      'Business Unit (Mining Division, Crusher Division, Logistics Division)',
      'Operating Branch / Quarry Pit site location mappings',
      'Dynamic Tenant Configuration & Feature Toggles'
    ],
    dbTables: ['core_tenants', 'core_companies', 'core_business_units', 'core_branches', 'core_company_settings'],
    apiEndpoints: [
      'GET /api/v1/organizations/tenants',
      'GET /api/v1/organizations/companies',
      'POST /api/v1/organizations/branches',
      'PUT /api/v1/organizations/settings'
    ],
    codeSnippet: `// Tenant Context Middleware
export const tenantContextMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const companyId = req.headers['x-company-id'] || req.user?.companyId;
  const branchId = req.headers['x-branch-id'] || req.user?.branchId;
  
  if (!companyId) {
    return res.status(400).json({ error: "Missing Tenant Company Context Header" });
  }
  
  AsyncLocalStorage.run({ companyId, branchId }, () => next());
};`
  },
  {
    id: 'rbac-engine',
    number: 4,
    name: 'Fine-Grained Role-Based Access Control (RBAC)',
    category: 'Organization & Access',
    icon: 'Shield',
    summary: 'Matrix-based security engine providing granular control across Module Features, UI Components, Form Fields, Data Rows, and Organizational Units.',
    keyFeatures: [
      'Role definition with hierarchical inheritance',
      'Feature Permissions (e.g. weighbridge:ticket:create)',
      'Field Level Security (e.g. conceal truck rate amount for operators)',
      'Row Level Security (RLS) policies targeting Company/Branch',
      'Dynamic Menu & UI Action Permission Evaluation'
    ],
    dbTables: ['core_roles', 'core_permissions', 'core_role_permissions', 'core_user_roles', 'core_data_access_rules'],
    apiEndpoints: [
      'GET /api/v1/rbac/roles',
      'POST /api/v1/rbac/roles',
      'GET /api/v1/rbac/permissions/my-matrix',
      'POST /api/v1/rbac/user-roles/assign'
    ],
    codeSnippet: `// RBAC Permission Guard
export function RequirePermission(...permissions: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userPermissions = req.user?.permissions || [];
    const hasAccess = permissions.every(p => userPermissions.includes(p));
    
    if (!hasAccess) {
      return res.status(403).json({ error: "Insufficient Role Permissions" });
    }
    next();
  };
}`
  },
  {
    id: 'shared-masters',
    number: 5,
    name: 'Global Shared Masters & Reference Data',
    category: 'Shared Masters & Docs',
    icon: 'Database',
    summary: 'Universal master data repository managing Countries, States, Currencies, Tax Schedules, Units of Measurement (UOM), and Document Categories.',
    keyFeatures: [
      'ISO Country & State code registers',
      'Multi-Currency Master with daily exchange rate sync',
      'Units of Measurement (UOM) with conversion matrices (e.g. Tonnes -> CFT -> Kg)',
      'Tax Schedule & GST/VAT tax code engine',
      'Payment Terms & Document Category Taxonomies'
    ],
    dbTables: ['core_countries', 'core_currencies', 'core_uoms', 'core_uom_conversions', 'core_taxes', 'core_payment_terms'],
    apiEndpoints: [
      'GET /api/v1/masters/currencies',
      'GET /api/v1/masters/uom/conversions',
      'GET /api/v1/masters/taxes',
      'POST /api/v1/masters/payment-terms'
    ],
    codeSnippet: `// UOM Converter Utility
export class UnitConverter {
  static convert(value: number, fromUom: string, toUom: string, conversionMatrix: UomConversionMap): number {
    if (fromUom === toUom) return value;
    const factor = conversionMatrix.getFactor(fromUom, toUom);
    if (!factor) throw new InvalidUomConversionException(fromUom, toUom);
    return value * factor;
  }
}`
  },
  {
    id: 'notification-engine',
    number: 6,
    name: 'Omni-Channel Notification & Queue Engine',
    category: 'Workflows & Notifications',
    icon: 'Bell',
    summary: 'Multi-channel message dispatcher delivering In-App Alerts, Email Queue, WhatsApp API, Web Push, and automated reminder schedules.',
    keyFeatures: [
      'In-App Notification Drawer with real-time WebSocket delivery',
      'Transactional Email Queue with HTML template rendering',
      'WhatsApp Business API messaging integration',
      'Web Push Notification Ready (VAPID/FCM)',
      'Reminder Engine with Cron expression scheduler'
    ],
    dbTables: ['core_notifications', 'core_notification_templates', 'core_notification_queue', 'core_user_notification_prefs'],
    apiEndpoints: [
      'GET /api/v1/notifications/my-alerts',
      'PUT /api/v1/notifications/:id/read',
      'POST /api/v1/notifications/dispatch',
      'POST /api/v1/notifications/whatsapp/send'
    ],
    codeSnippet: `// Notification Dispatcher Service
export class NotificationDispatcher {
  async dispatch(event: NotificationEvent): Promise<void> {
    const template = await this.templateRepo.findByName(event.templateName);
    const rendered = template.render(event.payload);
    
    if (event.channels.includes('IN_APP')) {
      await this.wsGateway.sendToUser(event.userId, rendered);
      await this.notificationRepo.saveInApp(event.userId, rendered);
    }
    if (event.channels.includes('EMAIL')) {
      await this.emailQueue.add('send-email', { to: event.email, content: rendered });
    }
  }
}`
  },
  {
    id: 'document-management',
    number: 7,
    name: 'Document Management System & Cloud Storage',
    category: 'Shared Masters & Docs',
    icon: 'FileText',
    summary: 'Enterprise document vault supporting multi-cloud storage (Google Cloud Storage / S3), version control, thumbnail generation, and presigned URLs.',
    keyFeatures: [
      'Presigned Direct-to-Cloud Upload URLs',
      'PDF, Image, and CAD/GIS File Previewers',
      'Document Versioning & Immutable Hash Audit Trail',
      'Watermarking & Sensitive Data Masking',
      'Attachment Linking to any Domain Entity'
    ],
    dbTables: ['core_documents', 'core_document_versions', 'core_document_attachments', 'core_storage_nodes'],
    apiEndpoints: [
      'POST /api/v1/documents/presigned-upload-url',
      'GET /api/v1/documents/:id',
      'GET /api/v1/documents/:id/download-url',
      'POST /api/v1/documents/:id/versions'
    ],
    codeSnippet: `// Cloud Storage Service
export class CloudStorageService {
  async generateUploadPresignedUrl(fileName: string, mimeType: string, companyId: string): Promise<PresignedUrlDto> {
    const key = \`tenants/\${companyId}/docs/\${Date.now()}_\${fileName}\`;
    const [url] = await this.gcsBucket.file(key).getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 mins
      contentType: mimeType
    });
    return { uploadUrl: url, fileKey: key };
  }
}`
  },
  {
    id: 'dashboard-engine',
    number: 8,
    name: 'Personalized Executive Dashboard Engine',
    category: 'Analytics & Infrastructure',
    icon: 'LayoutGrid',
    summary: 'Dynamic widget layout manager with drag-and-drop KPI cards, Recharts data visualizers, quick action shortcuts, and role-tailored perspectives.',
    keyFeatures: [
      'Drag & Drop Custom Dashboard Canvas',
      'Reusable KPI Metric Cards with real-time polling',
      'Interactive Chart Widgets (Line, Bar, Area, Pie)',
      'Quick Action Launcher Shortcuts',
      'Role-Tailored Default Presets (Executive, Manager, Operator)'
    ],
    dbTables: ['core_dashboard_layouts', 'core_dashboard_widgets', 'core_user_dashboard_prefs'],
    apiEndpoints: [
      'GET /api/v1/dashboards/my-layout',
      'PUT /api/v1/dashboards/layout',
      'GET /api/v1/dashboards/widgets/data'
    ],
    codeSnippet: `// Dashboard Widget Resolver
export class DashboardWidgetResolver {
  async resolveWidgetData(widgetId: string, companyId: string): Promise<WidgetDataDto> {
    const widget = await this.widgetRepo.findById(widgetId);
    const data = await this.analyticsEngine.executeMetricQuery(widget.querySpec, companyId);
    return { widgetId, title: widget.title, type: widget.type, data };
  }
}`
  },
  {
    id: 'reporting-engine',
    number: 9,
    name: 'Dynamic Reporting & Export Engine',
    category: 'Analytics & Infrastructure',
    icon: 'FileSpreadsheet',
    summary: 'Enterprise report generation suite with custom layout templates, high-speed PDF rendering, Excel data streaming, and automated email delivery schedules.',
    keyFeatures: [
      'Dynamic Report Schema Builder',
      'High-Speed PDF Generation Engine with Header/Footer templates',
      'Streaming Excel Export (XLSX) for large datasets (>100k rows)',
      'Report Scheduling Engine (Daily, Weekly, Monthly PDF dispatch)',
      'Export Watermarking & Compliance Disclaimers'
    ],
    dbTables: ['core_report_definitions', 'core_report_schedules', 'core_report_executions'],
    apiEndpoints: [
      'GET /api/v1/reports/definitions',
      'POST /api/v1/reports/render-pdf',
      'POST /api/v1/reports/export-excel',
      'POST /api/v1/reports/schedules'
    ],
    codeSnippet: `// PDF Report Generation Worker
export class PdfReportGenerator {
  async renderPdf(reportId: string, parameters: Record<string, any>): Promise<Buffer> {
    const reportDef = await this.reportRepo.findById(reportId);
    const dataset = await this.queryRunner.execute(reportDef.sqlQuery, parameters);
    const html = await this.templateEngine.render(reportDef.templateHtml, { dataset, parameters });
    return await this.puppeteerPool.generatePdfFromHtml(html);
  }
}`
  },
  {
    id: 'shared-workflow',
    number: 10,
    name: 'Shared Workflow & Approval Engine',
    category: 'Workflows & Notifications',
    icon: 'GitPullRequest',
    summary: 'Configurable multi-stage state machine engine managing approval hierarchies, automated task assignments, timeout escalations, and business rules.',
    keyFeatures: [
      'Visual State Machine Definition',
      'Multi-Tier Sequential & Parallel Approvals',
      'Escalation Rules on SLA Expiry',
      'Business Rules Engine (e.g. Purchase order > $10k requires VP approval)',
      'Workflow Audit Trail & Rejection Reason Tracking'
    ],
    dbTables: ['core_workflow_definitions', 'core_workflow_instances', 'core_workflow_tasks', 'core_workflow_history'],
    apiEndpoints: [
      'POST /api/v1/workflows/instances/start',
      'GET /api/v1/workflows/tasks/my-pending',
      'POST /api/v1/workflows/tasks/:id/approve',
      'POST /api/v1/workflows/tasks/:id/reject'
    ],
    codeSnippet: `// Workflow Execution Engine
export class WorkflowExecutionEngine {
  async approveTask(taskId: string, userId: string, comments: string): Promise<WorkflowState> {
    const task = await this.taskRepo.findById(taskId);
    task.markApproved(userId, comments);
    
    const instance = await this.instanceRepo.findById(task.instanceId);
    const nextStep = instance.evaluateNextStep(task);
    
    if (nextStep.isCompleted) {
      instance.complete();
      await this.eventBus.publish(new WorkflowCompletedEvent(instance.id));
    } else {
      await this.taskRepo.createPendingTask(instance.id, nextStep.assigneeRoleId);
    }
    return instance.state;
  }
}`
  },
  {
    id: 'audit-system',
    number: 11,
    name: 'Immutable Audit System & Security Logs',
    category: 'Security & Identity',
    icon: 'ShieldCheck',
    summary: 'Compliance-grade event logger recording before/after state diffs, user activity streams, authentication history, and system security events.',
    keyFeatures: [
      'JSON Delta Diff Logging (old_values vs new_values)',
      'Immutable Tamper-Evident Storage',
      'User Activity Stream Timeline',
      'Security Exception & Failed Login Monitor',
      'Compliance Data Export (ISO 27001 & SOC 2 Ready)'
    ],
    dbTables: ['core_audit_logs', 'core_activity_logs', 'core_login_history', 'core_security_events'],
    apiEndpoints: [
      'GET /api/v1/audit/logs',
      'GET /api/v1/audit/activity-stream',
      'GET /api/v1/audit/login-history'
    ],
    codeSnippet: `// Audit Middleware Interceptor
export class AuditInterceptor {
  static createAuditLog(entityName: string, entityId: string, action: 'CREATE' | 'UPDATE' | 'DELETE', oldState: any, newState: any, userContext: UserContext): AuditLogEntry {
    return {
      id: generateUuidV7(),
      companyId: userContext.companyId,
      userId: userContext.userId,
      entityName,
      entityId,
      action,
      oldValues: oldState ? JSON.stringify(oldState) : null,
      newValues: newState ? JSON.stringify(newState) : null,
      ipAddress: userContext.ipAddress,
      createdAt: new Date().toISOString()
    };
  }
}`
  },
  {
    id: 'api-gateway-foundation',
    number: 12,
    name: 'API Gateway Foundation & Middleware Pipeline',
    category: 'Analytics & Infrastructure',
    icon: 'Server',
    summary: 'Standardized REST entry gateway providing URI versioning, request validation middleware, uniform JSON envelopes, and centralized error handling.',
    keyFeatures: [
      'API Versioning Strategy (/api/v1/...)',
      'Zod / TypeBox Request Schema Validation Middleware',
      'Uniform Standard JSON Response Envelope Format',
      'Centralized Global Error Handling & Domain Exception Mapping',
      'Cors, Helmets, and Compression Security Headers'
    ],
    dbTables: ['core_api_keys', 'core_rate_limit_buckets'],
    apiEndpoints: [
      'GET /api/v1/health',
      'GET /api/v1/metrics'
    ],
    codeSnippet: `// Global Error Handler Middleware
export const globalErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err instanceof BaseDomainException ? err.statusCode : 500;
  const errorCode = err instanceof BaseDomainException ? err.code : 'INTERNAL_SERVER_ERROR';
  
  pinoLogger.error({ err, path: req.path, user: req.user?.id });
  
  res.status(statusCode).json({
    success: false,
    data: null,
    error: {
      code: errorCode,
      message: err.message,
      details: (err as any).details || null
    },
    meta: {
      timestamp: new Date().toISOString(),
      traceId: req.headers['x-trace-id'] || 'no-trace-id'
    }
  });
};`
  },
  {
    id: 'shared-services',
    number: 13,
    name: 'Core Shared Utilities & Number Series Engine',
    category: 'Analytics & Infrastructure',
    icon: 'Zap',
    summary: 'Essential low-level utility services providing UUID v7 generation, auto-incrementing document number series, date/time normalization, and Redis caching.',
    keyFeatures: [
      'UUID v7 Time-Ordered Unique Identifier Generator',
      'Number Series Generator (e.g. INV-2026-00042, TKT-MNE-00109)',
      'UTC Date & Multi-Timezone Converter',
      'Localization (i18n) & Multi-Language Dictionary',
      'Redis Cache Abstraction Layer'
    ],
    dbTables: ['core_number_series_definitions', 'core_number_series_counters', 'core_translations'],
    apiEndpoints: [
      'POST /api/v1/utilities/number-series/next',
      'GET /api/v1/utilities/i18n/:lang'
    ],
    codeSnippet: `// Number Series Generator
export class NumberSeriesService {
  async generateNextNumber(seriesCode: string, companyId: string): Promise<string> {
    return await this.db.transaction(async (tx) => {
      const series = await tx.query.coreNumberSeries.findFirst({
        where: and(eq(coreNumberSeries.code, seriesCode), eq(coreNumberSeries.companyId, companyId))
      });
      const nextVal = series.currentValue + 1;
      await tx.update(coreNumberSeries).set({ currentValue: nextVal }).where(eq(coreNumberSeries.id, series.id));
      
      const formatted = series.prefix + String(nextVal).padStart(series.paddingLength, '0') + series.suffix;
      return formatted;
    });
  }
}`
  },
  {
    id: 'security-infrastructure',
    number: 14,
    name: 'Security Infrastructure & Secrets Management',
    category: 'Security & Identity',
    icon: 'Lock',
    summary: 'Platform-wide security architecture enforcing AES-256-GCM encryption at rest, secrets vault integration, dynamic rate limiting, and CORS security headers.',
    keyFeatures: [
      'AES-256-GCM Column-Level Data Encryption',
      'Google Cloud Secret Manager / HashiCorp Vault Integration',
      'Redis Token Bucket Rate Limiting per IP and User ID',
      'SQL Injection & XSS Sanitation Pipelines',
      'Strict Content Security Policy (CSP) & CORS Controls'
    ],
    dbTables: ['core_kms_keys', 'core_security_audit_vault'],
    apiEndpoints: [
      'GET /api/v1/security/health',
      'POST /api/v1/security/kms/rotate'
    ],
    codeSnippet: `// Field Encryptor Utility
export class FieldEncryptor {
  private static readonly ALGORITHM = 'aes-256-gcm';
  
  static encrypt(text: string, secretKeyHex: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.ALGORITHM, Buffer.from(secretKeyHex, 'hex'), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return \`\${iv.toString('hex')}:\${authTag}:\${encrypted}\`;
  }
}`
  },
  {
    id: 'background-processing',
    number: 15,
    name: 'Background Processing & BullMQ Queue Worker',
    category: 'Analytics & Infrastructure',
    icon: 'Cpu',
    summary: 'High-throughput async job worker infrastructure powered by BullMQ and Redis, managing retries, exponential backoffs, and scheduled cron jobs.',
    keyFeatures: [
      'BullMQ Redis Queue Worker Pools',
      'Exponential Backoff Retry Engine with Dead-Letter Queues (DLQ)',
      'Scheduled Cron Jobs (Nightly backups, Invoice reminders, Shift summaries)',
      'Worker Concurrency & Priority Queuing',
      'Job Health Monitoring Dashboard Integration'
    ],
    dbTables: ['core_background_jobs', 'core_failed_jobs'],
    apiEndpoints: [
      'GET /api/v1/background/jobs/queue-stats',
      'POST /api/v1/background/jobs/retry-failed'
    ],
    codeSnippet: `// Queue Worker Definition
export class ReportQueueWorker {
  constructor(private redisConn: Redis) {
    new Worker('report-generation-queue', async (job: Job) => {
      console.log(\`[Job \${job.id}] Processing report generation for tenant \${job.data.companyId}\`);
      await this.reportService.execute(job.data);
    }, { connection: this.redisConn, concurrency: 5 });
  }
}`
  }
];

export const SHARED_CORE_DATABASE_SCHEMA = [
  {
    table: 'core_tenants',
    columns: [
      'id UUID PK DEFAULT uuid_generate_v7()',
      'tenant_code VARCHAR(32) UNIQUE NOT NULL',
      'name VARCHAR(255) NOT NULL',
      'status VARCHAR(20) DEFAULT "ACTIVE"',
      'created_at TIMESTAMPTZ DEFAULT NOW()'
    ]
  },
  {
    table: 'core_companies',
    columns: [
      'id UUID PK DEFAULT uuid_generate_v7()',
      'tenant_id UUID FK REFERENCES core_tenants(id)',
      'company_code VARCHAR(32) NOT NULL',
      'legal_name VARCHAR(255) NOT NULL',
      'tax_id VARCHAR(64)',
      'currency_code VARCHAR(3) DEFAULT "INR"',
      'created_at TIMESTAMPTZ DEFAULT NOW()'
    ]
  },
  {
    table: 'core_users',
    columns: [
      'id UUID PK DEFAULT uuid_generate_v7()',
      'company_id UUID FK REFERENCES core_companies(id)',
      'email VARCHAR(255) UNIQUE NOT NULL',
      'first_name VARCHAR(128) NOT NULL',
      'last_name VARCHAR(128)',
      'phone VARCHAR(32)',
      'is_active BOOLEAN DEFAULT TRUE',
      'created_at TIMESTAMPTZ DEFAULT NOW()'
    ]
  },
  {
    table: 'core_roles',
    columns: [
      'id UUID PK DEFAULT uuid_generate_v7()',
      'company_id UUID FK REFERENCES core_companies(id)',
      'role_name VARCHAR(64) NOT NULL',
      'description TEXT',
      'is_system_role BOOLEAN DEFAULT FALSE',
      'created_at TIMESTAMPTZ DEFAULT NOW()'
    ]
  },
  {
    table: 'core_notifications',
    columns: [
      'id UUID PK DEFAULT uuid_generate_v7()',
      'company_id UUID FK REFERENCES core_companies(id)',
      'user_id UUID FK REFERENCES core_users(id)',
      'title VARCHAR(255) NOT NULL',
      'message TEXT NOT NULL',
      'type VARCHAR(32) DEFAULT "INFO"',
      'is_read BOOLEAN DEFAULT FALSE',
      'created_at TIMESTAMPTZ DEFAULT NOW()'
    ]
  },
  {
    table: 'core_audit_logs',
    columns: [
      'id UUID PK DEFAULT uuid_generate_v7()',
      'company_id UUID FK REFERENCES core_companies(id)',
      'user_id UUID FK REFERENCES core_users(id)',
      'entity_name VARCHAR(128) NOT NULL',
      'entity_id UUID NOT NULL',
      'action VARCHAR(32) NOT NULL',
      'old_values JSONB',
      'new_values JSONB',
      'ip_address VARCHAR(45)',
      'created_at TIMESTAMPTZ DEFAULT NOW()'
    ]
  }
];

export const SHARED_CORE_CHECKLIST = [
  { item: '1. Authentication & Session Management Engine', status: 'Implemented & Certified' },
  { item: '2. User Management & Operational Linkages', status: 'Implemented & Certified' },
  { item: '3. Multi-Tenant Company & Branch Hierarchy', status: 'Implemented & Certified' },
  { item: '4. Fine-Grained Role-Based Access Control (RBAC)', status: 'Implemented & Certified' },
  { item: '5. Global Shared Masters (Currency, UOM, Taxes)', status: 'Implemented & Certified' },
  { item: '6. Omni-Channel Notification Engine', status: 'Implemented & Certified' },
  { item: '7. Document Management & Cloud Storage Vault', status: 'Implemented & Certified' },
  { item: '8. Dynamic Executive Dashboard Engine', status: 'Implemented & Certified' },
  { item: '9. Dynamic Reporting & Export Engine', status: 'Implemented & Certified' },
  { item: '10. Shared Workflow & Approval Engine', status: 'Implemented & Certified' },
  { item: '11. Immutable Audit System & Security Logs', status: 'Implemented & Certified' },
  { item: '12. API Gateway & Middleware Pipeline', status: 'Implemented & Certified' },
  { item: '13. Core Shared Utilities & Number Series Engine', status: 'Implemented & Certified' },
  { item: '14. Security Infrastructure & Encryption Vault', status: 'Implemented & Certified' },
  { item: '15. Background Processing & BullMQ Queue Worker', status: 'Implemented & Certified' }
];
