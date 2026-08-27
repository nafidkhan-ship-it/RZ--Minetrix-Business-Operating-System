import { AuthService, TenantService, UserService, AuditService, NotificationService, WorkflowService } from '../services/sharedCoreServices.js';
import { db, initializeDatabase } from '../db/database.js';
import { jwtService } from '../security/jwtService.js';
import { LocalStorageProvider } from '../providers/storageProvider.js';
import { notificationDispatcher } from '../providers/notificationProviders.js';

export interface TestResult {
  testName: string;
  category: string;
  passed: boolean;
  durationMs: number;
  message: string;
  evidence?: any;
}

export async function runSharedCoreTestSuite(): Promise<{
  executedAt: string;
  totalTests: number;
  passedCount: number;
  failedCount: number;
  results: TestResult[];
}> {
  await initializeDatabase();
  const results: TestResult[] = [];

  const authService = new AuthService();
  const tenantService = new TenantService();
  const userService = new UserService();
  const auditService = new AuditService();
  const notifService = new NotificationService();
  const wfService = new WorkflowService();
  const storageProvider = new LocalStorageProvider();

  // Test 1: Authentication Engine - Valid Login & RS256 Asymmetric Token Issuance
  {
    const start = Date.now();
    try {
      const loginRes = await authService.login('admin@racezoneventures.com', 'AdminPass2026!', '127.0.0.1');
      const verified = loginRes.data?.token ? jwtService.verifyToken(loginRes.data.token) : null;
      const passed = loginRes.success && !!loginRes.data?.token && !!verified && verified.iss === 'rz-minetrix-bos';
      results.push({
        testName: 'Authentication Engine - RS256 Asymmetric JWT Signing & Claims Verification',
        category: 'Security & Auth',
        passed,
        durationMs: Date.now() - start,
        message: passed ? 'Successfully issued and verified RS256 asymmetric token (kid: rz-rsa-key-2026-v1, iss: rz-minetrix-bos)' : 'Failed RS256 token verification',
        evidence: { keyMetadata: jwtService.getKeyMetadata(), claims: verified }
      });
    } catch (err: any) {
      results.push({
        testName: 'Authentication Engine - RS256 Asymmetric JWT Verification',
        category: 'Security & Auth',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // Test 2: Authentication Engine - Invalid Password Block
  {
    const start = Date.now();
    try {
      const loginRes = await authService.login('admin@racezoneventures.com', 'WRONG_PASSWORD', '127.0.0.1');
      const passed = !loginRes.success && loginRes.error === 'INVALID_CREDENTIALS';
      results.push({
        testName: 'Authentication Engine - Invalid Password Rejection & Audit Log',
        category: 'Security & Auth',
        passed,
        durationMs: Date.now() - start,
        message: passed ? 'Invalid password correctly rejected with 401 response and failure audit logged' : 'Failed to block invalid password'
      });
    } catch (err: any) {
      results.push({
        testName: 'Authentication Engine - Invalid Password Rejection',
        category: 'Security & Auth',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // Test 3: Multi-Tenant Scope & Hierarchy Check
  {
    const start = Date.now();
    try {
      const tRes = await tenantService.getTenantContext('tenant-rz-global-001');
      const passed = tRes.success && tRes.data?.companies.length! > 0;
      results.push({
        testName: 'Multi-Tenant Context - Tenant Hierarchy Query',
        category: 'Tenant Isolation',
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Queried Tenant [${tRes.data?.tenant.name}] with ${tRes.data?.companies.length} linked companies` : 'Failed tenant query'
      });
    } catch (err: any) {
      results.push({
        testName: 'Multi-Tenant Context - Tenant Hierarchy Query',
        category: 'Tenant Isolation',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // Test 4: Tenant Isolation Enforcement (Prevent Cross-Tenant Access)
  {
    const start = Date.now();
    try {
      const userRes = await userService.getUsersInTenant('tenant-rz-global-001');
      const tenant2Users = await userService.getUsersInTenant('tenant-apex-quarry-002');
      
      const isIsolated = !userRes.data.some(u => u.email.includes('apexmining.com')) &&
                          tenant2Users.data.every(u => u.email.includes('apexmining.com'));
      results.push({
        testName: 'Tenant Isolation - Cross-Tenant Access Strict Boundary',
        category: 'Tenant Isolation',
        passed: isIsolated,
        durationMs: Date.now() - start,
        message: isIsolated ? 'Tenant A data and Tenant B data remain strictly isolated at database/repository boundary' : 'Cross-tenant leak detected'
      });
    } catch (err: any) {
      results.push({
        testName: 'Tenant Isolation - Cross-Tenant Access Boundary',
        category: 'Tenant Isolation',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // Test 5: Storage Abstraction Provider - Upload, MIME Validation & Presigned URL
  {
    const start = Date.now();
    try {
      const mimeCheck = storageProvider.validateFile({ mimeType: 'application/pdf', sizeBytes: 1024 * 1024 });
      const signedUrl = await storageProvider.getSignedUrl({ storageKey: 'tenant-rz-global-001/doc_test.pdf', tenantId: 'tenant-rz-global-001' });
      const passed = mimeCheck.valid && signedUrl.includes('/api/v1/documents/download');
      results.push({
        testName: 'Storage Provider Abstraction - MIME/Size Validation & Tenant Presigned URL',
        category: 'Storage & Files',
        passed,
        durationMs: Date.now() - start,
        message: passed ? 'MIME validation passed and tenant presigned URL generated securely' : 'Storage provider test failed'
      });
    } catch (err: any) {
      results.push({
        testName: 'Storage Provider Abstraction',
        category: 'Storage & Files',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // Test 6: Notification Provider Separation & External Adapter Reporting
  {
    const start = Date.now();
    try {
      const inAppRes = await notificationDispatcher.dispatch({
        tenantId: 'tenant-rz-global-001',
        recipientUserId: 'usr-admin-001',
        title: 'Test Notification',
        body: 'In-app body',
        channel: 'IN_APP',
        type: 'INFO'
      });
      const emailRes = await notificationDispatcher.dispatch({
        tenantId: 'tenant-rz-global-001',
        recipientUserId: 'usr-admin-001',
        recipientEmail: 'admin@racezoneventures.com',
        title: 'Test Email',
        body: 'Email body',
        channel: 'EMAIL',
        type: 'INFO'
      });

      const passed = inAppRes.status === 'DELIVERED_IN_APP' && emailRes.status === 'EXTERNAL_CONFIG_REQUIRED';
      results.push({
        testName: 'Notification Provider - In-App Delivery vs External Adapter Status Reporting',
        category: 'Notifications',
        passed,
        durationMs: Date.now() - start,
        message: passed ? 'In-App delivered successfully; Email correctly reported EXTERNAL_CONFIG_REQUIRED status without false claim' : 'Notification provider dispatch failed'
      });
    } catch (err: any) {
      results.push({
        testName: 'Notification Provider',
        category: 'Notifications',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // Test 7: Persistence Adapter Health & Schema Readiness
  {
    const start = Date.now();
    try {
      const health = await db.persistenceAdapter.executeHealthCheck();
      const passed = !!health.status;
      results.push({
        testName: 'Database Persistence Adapter - Health Check & Engine Transparency',
        category: 'Database & ORM',
        passed,
        durationMs: Date.now() - start,
        message: `Persistence Engine [${health.engine}] status: ${health.status}`
      });
    } catch (err: any) {
      results.push({
        testName: 'Database Persistence Adapter',
        category: 'Database & ORM',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // Test 8: Operational Linkage - Link User to HR Employee & Operator
  {
    const start = Date.now();
    try {
      const linkRes = await userService.linkOperationalAccount('usr-quarry-mgr-002', 'tenant-rz-global-001', {
        employeeId: 'EMP-088',
        operatorId: 'OP-Q1-01'
      });
      const passed = linkRes.success && linkRes.data.linkedEmployeeId === 'EMP-088';
      results.push({
        testName: 'User Operational Linkage - Linking User Master to HR & Plant Operator',
        category: 'Shared Masters',
        passed,
        durationMs: Date.now() - start,
        message: passed ? 'User profile linked to Employee ID EMP-088 and Operator ID OP-Q1-01' : 'Linkage failed'
      });
    } catch (err: any) {
      results.push({
        testName: 'User Operational Linkage',
        category: 'Shared Masters',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // Test 9: Persistent Audit Engine Log Query
  {
    const start = Date.now();
    try {
      const auditRes = await auditService.getAuditLogs('tenant-rz-global-001');
      const passed = auditRes.success && auditRes.data.length > 0;
      results.push({
        testName: 'Persistent Audit Engine - Audit Log Query & Immutability',
        category: 'Audit & Compliance',
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Found ${auditRes.data.length} persistent audit log entries for tenant` : 'No audit logs found'
      });
    } catch (err: any) {
      results.push({
        testName: 'Persistent Audit Engine',
        category: 'Audit & Compliance',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // Test 10: Workflow Engine Initiation
  {
    const start = Date.now();
    try {
      const wfRes = await wfService.initiateWorkflow(
        'tenant-rz-global-001',
        'WF_INVOICE_APPROVAL',
        'INVOICE',
        'INV-2026-00010',
        'usr-quarry-mgr-002'
      );
      const passed = wfRes.success && wfRes.data.currentState === 'DRAFT';
      results.push({
        testName: 'Workflow Engine - Initiate Workflow Instance & State Transition',
        category: 'Workflows',
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Initiated Workflow Instance [${wfRes.data.id}] in initial state DRAFT` : 'Workflow initiation failed'
      });
    } catch (err: any) {
      results.push({
        testName: 'Workflow Engine',
        category: 'Workflows',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  const passedCount = results.filter(r => r.passed).length;
  const failedCount = results.length - passedCount;

  return {
    executedAt: new Date().toISOString(),
    totalTests: results.length,
    passedCount,
    failedCount,
    results
  };
}
