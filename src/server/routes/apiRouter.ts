import { Router, Request, Response } from 'express';
import {
  authenticateJwt,
  enforceTenantContext,
  requirePermission,
  auditLogger,
  CustomRequest
} from '../middleware/authMiddleware.js';
import {
  AuthService,
  TenantService,
  UserService,
  AuditService,
  NotificationService,
  WorkflowService
} from '../services/sharedCoreServices.js';
import { OrganizationRepository, RolePermissionRepository, DocumentRepository } from '../repositories/sharedCoreRepositories.js';
import { runSharedCoreTestSuite } from '../tests/sharedCoreTests.js';
import { getReadinessPayload } from '../health/readiness.js';
import { db } from '../db/database.js';
import { jwtService } from '../security/jwtService.js';
import { rateLimiter } from '../middleware/rateLimiter.js';
import { LocalStorageProvider } from '../providers/storageProvider.ts';
import { notificationDispatcher } from '../providers/notificationProviders.ts';
import { isTestSuiteAuthorized, isTestSuiteEnabled } from '../config/securityConfig.js';
import {
  rejectClientTenantId,
  validateLoginBody,
  validateOptionalQueryId,
  validateResourceIdParam
} from '../middleware/inputValidation.js';
import { erpQuarryRouter } from './erpQuarryRouter.js';
import { erpOperationsRouter } from './erpOperationsRouter.js';
import { hrmsRouter } from './hrmsRouter.js';
import { fleetRouter } from './fleetRouter.js';

export const apiRouter = Router();

const authService = new AuthService();
const tenantService = new TenantService();
const userService = new UserService();
const auditService = new AuditService();
const notifService = new NotificationService();
const wfService = new WorkflowService();
const orgRepo = new OrganizationRepository();
const rolePermRepo = new RolePermissionRepository();
const docRepo = new DocumentRepository();
const storageProvider = new LocalStorageProvider();

// Global Audit Middleware on Router
apiRouter.use(auditLogger);

// ERP Quarry + operations APIs (PostgreSQL + RLS)
apiRouter.use('/erp', erpQuarryRouter);
apiRouter.use('/erp', erpOperationsRouter);
apiRouter.use('/hrms', hrmsRouter);
apiRouter.use('/fleet', fleetRouter);

// Rate Limiters
const authRateLimiter = rateLimiter({ windowMs: 15 * 60 * 1000, max: 15, keyPrefix: 'auth_login' });
const testRateLimiter = rateLimiter({ windowMs: 60 * 1000, max: 5, keyPrefix: 'test_suite' });

// ==========================================
// 1. HEALTH & OBSERVABILITY ENDPOINTS
// ==========================================
apiRouter.get('/health/liveness', (req: Request, res: Response) => {
  res.json({
    status: 'UP',
    service: 'RZ® Minetrix BOS Shared Core Backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

apiRouter.get('/health/readiness', async (req: Request, res: Response) => {
  const payload = await getReadinessPayload();
  res.status(payload.status === 'READY' ? 200 : 503).json(payload);
});

// ==========================================
// 2. AUTHENTICATION ENDPOINTS
// ==========================================
apiRouter.post('/auth/login', authRateLimiter, validateLoginBody, async (req: Request, res: Response) => {
  const { email, password } = req.body || {};
  const result = await authService.login(email, password, req.ip || '127.0.0.1');
  if (!result.success) {
    return res.status(401).json(result);
  }

  return res.json(result);
});

apiRouter.get('/auth/session', authenticateJwt, (req: CustomRequest, res: Response) => {
  return res.json({
    success: true,
    data: {
      user: req.user,
      jwtMetadata: jwtService.getKeyMetadata(),
      correlationId: req.correlationId,
      requestId: req.requestId
    }
  });
});

// ==========================================
// 3. TENANT & ORGANIZATION ENDPOINTS
// ==========================================
apiRouter.get('/tenants/context', authenticateJwt, enforceTenantContext, async (req: CustomRequest, res: Response) => {
  const result = await tenantService.getTenantContext(req.user!.tenantId);
  return res.json(result);
});

apiRouter.get('/tenants', authenticateJwt, requirePermission('shared:admin:access'), async (req: Request, res: Response) => {
  const result = await tenantService.getAllTenants();
  return res.json(result);
});

apiRouter.get('/organizations/companies', authenticateJwt, enforceTenantContext, async (req: CustomRequest, res: Response) => {
  const companies = await orgRepo.findCompaniesByTenant(req.user!.tenantId);
  return res.json({ success: true, data: companies });
});

apiRouter.get(
  '/organizations/branches',
  authenticateJwt,
  enforceTenantContext,
  validateOptionalQueryId('companyId'),
  async (req: CustomRequest, res: Response) => {
    const { companyId } = req.query;
    const branches = await orgRepo.findBranchesByCompany(String(companyId || req.user!.companyId), req.user!.tenantId);
    return res.json({ success: true, data: branches });
  }
);

// ==========================================
// 4. USER MANAGEMENT ENDPOINTS
// ==========================================
apiRouter.get('/users', authenticateJwt, enforceTenantContext, async (req: CustomRequest, res: Response) => {
  const result = await userService.getUsersInTenant(req.user!.tenantId);
  return res.json(result);
});

apiRouter.post(
  '/users/:id/link-operational',
  authenticateJwt,
  enforceTenantContext,
  requirePermission('shared:admin:access'),
  validateResourceIdParam('id'),
  rejectClientTenantId,
  async (req: CustomRequest, res: Response) => {
    const { id } = req.params;
    const { employeeId, driverId, operatorId } = req.body || {};
    const result = await userService.linkOperationalAccount(id, req.user!.tenantId, { employeeId, driverId, operatorId });
    return res.json(result);
  }
);

// ==========================================
// 5. ROLES & PERMISSIONS (RBAC)
// ==========================================
apiRouter.get('/roles', authenticateJwt, enforceTenantContext, async (req: CustomRequest, res: Response) => {
  const roles = await rolePermRepo.findRolesByTenant(req.user!.tenantId);
  return res.json({ success: true, data: roles });
});

apiRouter.get('/permissions', authenticateJwt, async (req: CustomRequest, res: Response) => {
  const permissions = Array.from(db.permissions.values());
  return res.json({ success: true, data: permissions });
});

// ==========================================
// 6. NOTIFICATION ENGINE ENDPOINTS
// ==========================================
apiRouter.get('/notifications', authenticateJwt, enforceTenantContext, async (req: CustomRequest, res: Response) => {
  const result = await notifService.getUserNotifications(req.user!.userId, req.user!.tenantId);
  return res.json(result);
});

apiRouter.post('/notifications/dispatch', authenticateJwt, enforceTenantContext, rejectClientTenantId, async (req: CustomRequest, res: Response) => {
  const { recipientUserId, recipientEmail, title, body, channel, type } = req.body || {};
  const result = await notificationDispatcher.dispatch({
    tenantId: req.user!.tenantId,
    recipientUserId: recipientUserId || req.user!.userId,
    recipientEmail: recipientEmail || req.user!.email,
    title: title || 'System Notification',
    body: body || '',
    channel: channel || 'IN_APP',
    type: type || 'INFO'
  });

  // Also persist in notification feed
  await notifService.createNotification(
    req.user!.tenantId,
    recipientUserId || req.user!.userId,
    title || 'Notification',
    body || '',
    type || 'INFO'
  );

  return res.json({ success: true, deliveryResult: result });
});

// ==========================================
// 7. DOCUMENT MANAGEMENT ENDPOINTS
// ==========================================
apiRouter.get('/documents', authenticateJwt, enforceTenantContext, async (req: CustomRequest, res: Response) => {
  const { module, entityType, entityId } = req.query;
  const docs = await docRepo.findByEntity(
    req.user!.tenantId,
    String(module || 'Shared Core'),
    String(entityType || 'GENERAL'),
    String(entityId || '0')
  );
  return res.json({ success: true, data: docs });
});

apiRouter.post('/documents/metadata', authenticateJwt, enforceTenantContext, rejectClientTenantId, async (req: CustomRequest, res: Response) => {
  const { fileName, fileSize, mimeType, module, entityType, entityId, accessLevel } = req.body || {};
  const doc = await docRepo.registerMetadata({
    tenantId: req.user!.tenantId,
    companyId: req.user!.companyId,
    module,
    entityType,
    entityId,
    fileName,
    fileSize,
    mimeType,
    accessLevel,
    uploaderUserId: req.user!.userId
  });

  const signedUrl = await storageProvider.getSignedUrl({ storageKey: doc.storageKey, tenantId: req.user!.tenantId });

  return res.json({ success: true, data: { ...doc, signedUrl } });
});

// ==========================================
// 8. AUDIT LOG ENDPOINTS
// ==========================================
apiRouter.get('/audit/search', authenticateJwt, enforceTenantContext, requirePermission('shared:admin:access'), async (req: CustomRequest, res: Response) => {
  const requested = Number(req.query.limit);
  const limit = Number.isFinite(requested) ? Math.min(200, Math.max(1, requested)) : 50;
  const result = await auditService.getAuditLogs(req.user!.tenantId, limit);
  return res.json(result);
});

// ==========================================
// 9. WORKFLOW ENGINE ENDPOINTS
// ==========================================
apiRouter.post('/workflows/initiate', authenticateJwt, enforceTenantContext, rejectClientTenantId, async (req: CustomRequest, res: Response) => {
  const { workflowCode, entityType, entityId } = req.body || {};
  const result = await wfService.initiateWorkflow(
    req.user!.tenantId,
    workflowCode,
    entityType,
    entityId,
    req.user!.userId
  );
  return res.json(result);
});

// ==========================================
// 10. PROTECTED SHARED CORE TEST SUITE ENDPOINT
// ==========================================
apiRouter.get('/test/run-suite', testRateLimiter, async (req: Request, res: Response) => {
  if (!isTestSuiteEnabled()) {
    return res.status(404).json({
      success: false,
      error: 'NOT_FOUND',
      message: 'Test suite endpoint is not enabled.'
    });
  }

  const secretKey = req.query.key || req.headers['x-test-key'];
  if (!isTestSuiteAuthorized(secretKey)) {
    return res.status(403).json({
      success: false,
      error: 'FORBIDDEN_TEST_SUITE_ACCESS',
      message: 'Test suite execution requires a valid authorization key.'
    });
  }

  const report = await runSharedCoreTestSuite();
  return res.json({
    success: true,
    report
  });
});
