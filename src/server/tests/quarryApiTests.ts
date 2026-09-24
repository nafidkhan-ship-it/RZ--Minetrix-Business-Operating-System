/**
 * RZ® MINETRIX BOS — Quarry Management API & RBAC Integration Test Suite
 * Validates HTTP route handlers, JWT authentication, tenant isolation, RBAC permissions,
 * error code mappings, and immutable stock ledger integration.
 */

import express, { Express } from 'express';
import { quarryRouter } from '../routes/quarryRouter.js';
import { correlationIdMiddleware, auditLogger } from '../middleware/authMiddleware.js';
import { AuthService } from '../services/sharedCoreServices.js';
import { db } from '../db/database.js';

export interface TestResult {
  testName: string;
  category: string;
  passed: boolean;
  durationMs: number;
  message: string;
  evidence?: any;
}

function createTestApp(): Express {
  const app = express();
  app.use(express.json());
  app.use(correlationIdMiddleware as any);
  app.use(auditLogger);
  app.use('/api/quarries', quarryRouter);
  return app;
}

async function simulateRequest(
  app: Express,
  method: string,
  url: string,
  opts: {
    token?: string;
    tenantHeader?: string;
    body?: any;
    query?: Record<string, any>;
  } = {}
): Promise<{ status: number; body: any }> {
  return new Promise((resolve) => {
    const parsedUrl = new URL(`http://localhost${url}`);
    if (opts.query) {
      Object.entries(opts.query).forEach(([k, v]) => {
        if (v !== undefined) parsedUrl.searchParams.set(k, String(v));
      });
    }

    const headers: Record<string, string> = {
      'content-type': 'application/json',
      'host': 'localhost'
    };
    if (opts.token) {
      headers['authorization'] = `Bearer ${opts.token}`;
    }
    if (opts.tenantHeader) {
      headers['x-tenant-id'] = opts.tenantHeader;
    }

    let statusCode = 200;
    let responseBody: any = null;
    let finished = false;

    const res: any = {
      statusCode: 200,
      headersSent: false,
      status(code: number) {
        statusCode = code;
        this.statusCode = code;
        return this;
      },
      setHeader() {
        return this;
      },
      getHeader() {
        return undefined;
      },
      json(data: any) {
        responseBody = data;
        this.finish();
        return this;
      },
      send(data: any) {
        try {
          responseBody = JSON.parse(data);
        } catch {
          responseBody = data;
        }
        this.finish();
        return this;
      },
      end(data?: any) {
        if (data && !responseBody) {
          try {
            responseBody = JSON.parse(data);
          } catch {
            responseBody = data;
          }
        }
        this.finish();
        return this;
      },
      on(event: string, callback: () => void) {
        if (event === 'finish' && finished) {
          callback();
        }
        return this;
      },
      finish() {
        if (!finished) {
          finished = true;
          resolve({ status: statusCode, body: responseBody });
        }
      }
    };

    const req: any = {
      method: method.toUpperCase(),
      url: parsedUrl.pathname + parsedUrl.search,
      originalUrl: parsedUrl.pathname + parsedUrl.search,
      path: parsedUrl.pathname,
      query: Object.fromEntries(parsedUrl.searchParams.entries()),
      headers,
      header(name: string) {
        return headers[name.toLowerCase()];
      },
      get(name: string) {
        return headers[name.toLowerCase()];
      },
      body: opts.body || {},
      ip: '127.0.0.1',
      socket: { remoteAddress: '127.0.0.1' },
      on(event: string, cb: any) {
        if (event === 'data' && opts.body) cb(Buffer.from(JSON.stringify(opts.body)));
        if (event === 'end') cb();
        return this;
      }
    };

    (app as any).handle(req, res, (err: any) => {
      if (err) {
        resolve({ status: 500, body: { success: false, error: 'SERVER_ERROR', message: err.message } });
      } else if (!finished) {
        resolve({ status: 404, body: { success: false, error: 'NOT_FOUND', message: 'Route not matched' } });
      }
    });
  });
}

export async function runQuarryApiTestSuite(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  const app = createTestApp();
  const authService = new AuthService();

  // Ensure DB RBAC is seeded
  db.seedQuarryRbacData();

  // 1. Acquire JWT Tokens for each Role Persona
  const adminLogin = await authService.login('admin@racezoneventures.com', 'AdminPass2026!', '127.0.0.1');
  const ownerLogin = await authService.login('quarry.owner@racezoneventures.com', 'OwnerPass2026!', '127.0.0.1');
  const managerLogin = await authService.login('quarry.manager@racezoneventures.com', 'ManagerPass2026!', '127.0.0.1');
  const staffLogin = await authService.login('quarry.staff@racezoneventures.com', 'StaffPass2026!', '127.0.0.1');
  const apexLogin = await authService.login('site.mgr@apexmining.com', 'ApexPass2026!', '127.0.0.1');

  const adminToken = adminLogin.data?.token || '';
  const ownerToken = ownerLogin.data?.token || '';
  const managerToken = managerLogin.data?.token || '';
  const staffToken = staffLogin.data?.token || '';
  const apexToken = apexLogin.data?.token || '';
  const testSuffix = Date.now().toString().slice(-6);

  let createdQuarryId = '';
  let createdProductId = '';
  let createdGatePassId = '';
  let createdLeaseId = '';
  let createdSettlementId = '';

  // -------------------------------------------------------------
  // Test 1: Authentication Guard - Missing Token (401)
  // -------------------------------------------------------------
  {
    const start = Date.now();
    const res = await simulateRequest(app, 'GET', '/api/quarries');
    const passed = res.status === 401 && (res.body?.error === 'UNAUTHORIZED' || res.body?.error === 'UNAUTHORIZED_MISSING_TOKEN');
    results.push({
      testName: 'Quarry API Auth: Rejects Unauthenticated Request (401)',
      category: 'Quarry API & Security',
      passed,
      durationMs: Date.now() - start,
      message: passed ? 'Correctly rejected request without Bearer token with 401 UNAUTHORIZED' : `Expected 401, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }

  // -------------------------------------------------------------
  // Test 2: Authentication Guard - Invalid/Forged JWT Token (401)
  // -------------------------------------------------------------
  {
    const start = Date.now();
    const res = await simulateRequest(app, 'GET', '/api/quarries', { token: 'invalid.token.signature.payload' });
    const passed = res.status === 401 && (res.body?.error === 'INVALID_TOKEN' || res.body?.error === 'UNAUTHORIZED' || res.body?.error === 'UNAUTHORIZED_INVALID_TOKEN');
    results.push({
      testName: 'Quarry API Auth: Rejects Forged JWT Token (401)',
      category: 'Quarry API & Security',
      passed,
      durationMs: Date.now() - start,
      message: passed ? 'Correctly rejected forged JWT token with 401 UNAUTHORIZED' : `Expected 401, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }

  // -------------------------------------------------------------
  // Test 3: RBAC - QUARRY_OWNER Creates Quarry Master (201 Created)
  // -------------------------------------------------------------
  {
    const start = Date.now();
    const tenant1 = db.tenants.get('tenant-rz-global-001') || Array.from(db.tenants.values())[0];
    const company = Array.from(db.companies.values()).find(c => c.tenantId === tenant1?.id) || Array.from(db.companies.values())[0];
    const branch = Array.from(db.branches.values()).find(b => b.tenantId === tenant1?.id) || Array.from(db.branches.values())[0];

    const res = await simulateRequest(app, 'POST', '/api/quarries', {
      token: ownerToken,
      body: {
        companyId: company?.id || 'comp-rz-ventures-001',
        branchId: branch?.id || 'br-quarry-alpha',
        name: 'Api Test Granite Quarry ' + testSuffix,
        quarryType: 'HARD_ROCK',
        location: 'Karkala Ridge Zone 4',
        address: 'Survey 22/B, Karkala, Karnataka',
        leaseReference: 'LEASE-APITEST-' + testSuffix
      }
    });

    const passed = res.status === 201 && res.body?.success === true && !!res.body?.data?.id;
    if (passed) {
      createdQuarryId = res.body.data.id;
    }

    results.push({
      testName: 'Quarry RBAC: QUARRY_OWNER Allowed to Create Quarry Master (201)',
      category: 'Quarry RBAC & Auth',
      passed,
      durationMs: Date.now() - start,
      message: passed ? `Quarry Master created successfully by QUARRY_OWNER: [${createdQuarryId}]` : `Expected 201, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }

  // -------------------------------------------------------------
  // Test 4: RBAC - QUARRY_MANAGER Prohibited from Creating Quarry (403 Forbidden)
  // -------------------------------------------------------------
  {
    const start = Date.now();
    const tenant1 = db.tenants.get('tenant-rz-global-001') || Array.from(db.tenants.values())[0];
    const company = Array.from(db.companies.values()).find(c => c.tenantId === tenant1?.id) || Array.from(db.companies.values())[0];
    const branch = Array.from(db.branches.values()).find(b => b.tenantId === tenant1?.id) || Array.from(db.branches.values())[0];

    const res = await simulateRequest(app, 'POST', '/api/quarries', {
      token: managerToken,
      body: {
        companyId: company?.id || 'comp-rz-ventures-001',
        branchId: branch?.id || 'br-quarry-alpha',
        name: 'Unauthorized Manager Quarry ' + testSuffix,
        quarryType: 'LATERITE',
        location: 'Illegal Location'
      }
    });

    const passed = res.status === 403 && (res.body?.error === 'FORBIDDEN' || res.body?.error === 'FORBIDDEN_PERMISSION_REQUIRED');
    results.push({
      testName: 'Quarry RBAC: QUARRY_MANAGER Denied Quarry Creation (403)',
      category: 'Quarry RBAC & Auth',
      passed,
      durationMs: Date.now() - start,
      message: passed ? 'RBAC enforcement successfully rejected QUARRY_CREATE by QUARRY_MANAGER' : `Expected 403, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }

  // -------------------------------------------------------------
  // Test 5: RBAC - QUARRY_MANAGER Allowed to View and Edit Quarry (200 OK)
  // -------------------------------------------------------------
  {
    const start = Date.now();
    const getRes = await simulateRequest(app, 'GET', `/api/quarries/${createdQuarryId}`, { token: managerToken });
    const updateRes = await simulateRequest(app, 'PUT', `/api/quarries/${createdQuarryId}`, {
      token: managerToken,
      body: { location: 'Karkala Ridge Zone 4 - Updated by Manager' }
    });

    const passed = getRes.status === 200 && updateRes.status === 200 && updateRes.body?.data?.location?.includes('Updated by Manager');
    results.push({
      testName: 'Quarry RBAC: QUARRY_MANAGER Permitted to View & Edit Quarry Master (200)',
      category: 'Quarry Operations',
      passed,
      durationMs: Date.now() - start,
      message: passed ? 'QUARRY_MANAGER successfully viewed and updated quarry metadata' : `Expected 200, got ${updateRes.status}: ${JSON.stringify(updateRes.body)}`,
      evidence: updateRes.body
    });
  }

  // -------------------------------------------------------------
  // Test 6: RBAC - QUARRY_STAFF Denied Quarry Edit (403 Forbidden)
  // -------------------------------------------------------------
  {
    const start = Date.now();
    const res = await simulateRequest(app, 'PUT', `/api/quarries/${createdQuarryId}`, {
      token: staffToken,
      body: { name: 'Staff Renamed Quarry' }
    });

    const passed = res.status === 403 && (res.body?.error === 'FORBIDDEN' || res.body?.error === 'FORBIDDEN_PERMISSION_REQUIRED');
    results.push({
      testName: 'Quarry RBAC: QUARRY_STAFF Denied Quarry Edit (403)',
      category: 'Quarry RBAC & Auth',
      passed,
      durationMs: Date.now() - start,
      message: passed ? 'RBAC correctly denied QUARRY_EDIT to QUARRY_STAFF' : `Expected 403, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }

  // -------------------------------------------------------------
  // Test 7: Tenant Isolation - Prevent Cross-Tenant Quarry Access (404/403)
  // -------------------------------------------------------------
  {
    const start = Date.now();
    const res = await simulateRequest(app, 'GET', `/api/quarries/${createdQuarryId}`, {
      token: apexToken // Token belonging to Tenant 2 (Apex Mining)
    });

    const passed = res.status === 404 || res.status === 403;
    results.push({
      testName: 'Quarry Tenant Security: Cross-Tenant Quarry Access Denied',
      category: 'Tenant Isolation',
      passed,
      durationMs: Date.now() - start,
      message: passed ? 'Tenant boundary enforced: Apex Mining user unable to access Tenant 1 quarry' : `Expected 404/403, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }

  // -------------------------------------------------------------
  // Test 8: Stone Products API - Create Product with Matching Mineral Type (201)
  // -------------------------------------------------------------
  {
    const start = Date.now();
    const res = await simulateRequest(app, 'POST', `/api/quarries/${createdQuarryId}/products`, {
      token: managerToken,
      body: {
        productCode: 'GRAN-20MM-' + testSuffix,
        name: '20mm Crushed Blue Metal Aggregate',
        mineralType: 'HARD_ROCK',
        unit: 'TON',
        defaultPrice: 850,
        gstRate: 5
      }
    });

    const passed = res.status === 201 && res.body?.success === true && res.body?.data?.id;
    if (passed) {
      createdProductId = res.body.data.id;
    }

    results.push({
      testName: 'Stone Products API: Create Stone Product with Matching Mineral Type (201)',
      category: 'Stone Products',
      passed,
      durationMs: Date.now() - start,
      message: passed ? `Stone Product created: [${res.body.data.productCode}]` : `Expected 201, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }

  // -------------------------------------------------------------
  // Test 9: Stone Products API - Mineral Type Mismatch Rejected (422)
  // -------------------------------------------------------------
  {
    const start = Date.now();
    const res = await simulateRequest(app, 'POST', `/api/quarries/${createdQuarryId}/products`, {
      token: managerToken,
      body: {
        productCode: 'LAT-BRICK-MISMATCH',
        name: 'Laterite Stone Brick in Hard Rock Quarry',
        mineralType: 'LATERITE', // Mismatch with quarry's HARD_ROCK type!
        unit: 'PIECE',
        defaultPrice: 45
      }
    });

    const passed = res.status === 422 && res.body?.error === 'MINERAL_TYPE_MISMATCH';
    results.push({
      testName: 'Stone Products API: Reject Mineral Type Mismatch with Quarry (422)',
      category: 'Stone Products',
      passed,
      durationMs: Date.now() - start,
      message: passed ? 'Domain validation correctly rejected LATERITE product in HARD_ROCK quarry' : `Expected 422, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }

  // -------------------------------------------------------------
  // Test 10: Hierarchy Integrity - Reject Cross-Quarry Product URL (403 Resource Mismatch)
  // -------------------------------------------------------------
  {
    const start = Date.now();
    const otherQuarryId = 'qm-laterite-001'; // Default seeded laterite quarry
    const res = await simulateRequest(app, 'GET', `/api/quarries/${otherQuarryId}/products/${createdProductId}`, {
      token: managerToken
    });

    const passed = res.status === 403 && res.body?.error === 'CROSS_QUARRY_RESOURCE_MISMATCH';
    results.push({
      testName: 'Quarry Hierarchy: Reject Cross-Quarry Product Route Access (403)',
      category: 'Stone Products',
      passed,
      durationMs: Date.now() - start,
      message: passed ? 'Hierarchy validation prevented access to product via mismatching quarry URL (403 Forbidden)' : `Expected 403, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }

  // -------------------------------------------------------------
  // Test 11: Production API - Record Production & Automatic STOCK_IN (201)
  // -------------------------------------------------------------
  {
    const start = Date.now();
    const res = await simulateRequest(app, 'POST', `/api/quarries/${createdQuarryId}/production`, {
      token: staffToken, // Quarry staff has PRODUCTION_CREATE permission
      body: {
        productId: createdProductId,
        productionType: 'CRUSHING_PRIMARY',
        productionDate: '2026-08-18',
        shift: 'DAY',
        quantity: 600,
        remarks: 'Morning blasting & crushing yield'
      }
    });

    const passed = res.status === 201 &&
      res.body?.success === true &&
      res.body?.data?.production?.quantity === 600 &&
      res.body?.data?.stockLedgerEntry?.transactionType === 'STOCK_IN' &&
      res.body?.data?.newBalance === 600;

    results.push({
      testName: 'Production API: Log Production & Produce Atomic STOCK_IN Entry (201)',
      category: 'Quarry Production',
      passed,
      durationMs: Date.now() - start,
      message: passed ? 'Production logged and immutable STOCK_IN entry recorded (Stock Balance: 600 TON)' : `Expected 201 with stockLedgerEntry, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }

  // -------------------------------------------------------------
  // Test 12: Production API - Reject Zero or Negative Production Quantity (400)
  // -------------------------------------------------------------
  {
    const start = Date.now();
    const res = await simulateRequest(app, 'POST', `/api/quarries/${createdQuarryId}/production`, {
      token: staffToken,
      body: {
        productId: createdProductId,
        quantity: -50
      }
    });

    const passed = res.status === 400 && res.body?.error === 'INVALID_QUANTITY';
    results.push({
      testName: 'Production API: Reject Negative Quantity (400)',
      category: 'Quarry Production',
      passed,
      durationMs: Date.now() - start,
      message: passed ? 'Validation correctly blocked negative production entry' : `Expected 400, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }

  // -------------------------------------------------------------
  // Test 13: Stock API - View Quarry Stock Summary (200 OK)
  // -------------------------------------------------------------
  {
    const start = Date.now();
    const res = await simulateRequest(app, 'GET', `/api/quarries/${createdQuarryId}/stock`, {
      token: staffToken
    });

    const summary = res.body?.data || [];
    const item = summary.find((s: any) => s.productId === createdProductId);
    const passed = res.status === 200 && res.body?.success === true && item && item.balanceQuantity === 600;

    results.push({
      testName: 'Stock API: Fetch Quarry Stock Summary across all Products (200)',
      category: 'Quarry Inventory',
      passed,
      durationMs: Date.now() - start,
      message: passed ? `Stock summary returned balance of ${item.balanceQuantity} ${item.unit} for [${item.productName}]` : `Expected 200 with balance 600, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }

  // -------------------------------------------------------------
  // Test 14: Stock API - Record Stock Adjustment by QUARRY_MANAGER (201)
  // -------------------------------------------------------------
  {
    const start = Date.now();
    const res = await simulateRequest(app, 'POST', `/api/quarries/${createdQuarryId}/stock/adjustment`, {
      token: managerToken,
      body: {
        productId: createdProductId,
        adjustmentType: 'ADJUSTMENT_IN',
        quantity: 50,
        reason: 'Physical stockpile survey surplus calibration'
      }
    });

    const passed = res.status === 201 && res.body?.data?.transactionType === 'ADJUSTMENT_IN' && res.body?.data?.balanceQuantity === 650;
    results.push({
      testName: 'Stock API: QUARRY_MANAGER Executes Stock Adjustment (201)',
      category: 'Quarry Inventory',
      passed,
      durationMs: Date.now() - start,
      message: passed ? 'Stock adjustment applied: balance updated to 650 TON' : `Expected 201 with balance 650, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }

  // -------------------------------------------------------------
  // Test 15: RBAC - QUARRY_STAFF Denied Stock Adjustment (403 Forbidden)
  // -------------------------------------------------------------
  {
    const start = Date.now();
    const res = await simulateRequest(app, 'POST', `/api/quarries/${createdQuarryId}/stock/adjustment`, {
      token: staffToken,
      body: {
        productId: createdProductId,
        adjustmentType: 'ADJUSTMENT_OUT',
        quantity: 20,
        reason: 'Unverified scale loss'
      }
    });

    const passed = res.status === 403 && (res.body?.error === 'FORBIDDEN' || res.body?.error === 'FORBIDDEN_PERMISSION_REQUIRED');
    results.push({
      testName: 'Quarry RBAC: QUARRY_STAFF Denied Stock Adjustment Permission (403)',
      category: 'Quarry RBAC & Auth',
      passed,
      durationMs: Date.now() - start,
      message: passed ? 'RBAC rejected unauthorized stock adjustment by floor staff' : `Expected 403, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }

  // -------------------------------------------------------------
  // Test 16: Gate Pass API - Create Gate Pass in ISSUED State (201)
  // -------------------------------------------------------------
  {
    const start = Date.now();
    const customer = Array.from(db.crmCustomers.values())[0] || { id: 'cust-harbor-dev' };
    const res = await simulateRequest(app, 'POST', `/api/quarries/${createdQuarryId}/gate-passes`, {
      token: staffToken,
      body: {
        customerId: customer.id,
        productId: createdProductId,
        quantity: 150,
        unit: 'TON',
        vehicleNo: 'KA-20-MB-9090',
        driverName: 'Ramesh Shetty',
        grossWeight: 45000,
        tareWeight: 15000,
        salesReference: 'SO-API-TEST-001'
      }
    });

    const passed = res.status === 201 && res.body?.data?.id && res.body?.data?.status === 'ISSUED';
    if (passed) {
      createdGatePassId = res.body.data.id;
    }

    results.push({
      testName: 'Gate Pass API: Create Gate Pass in ISSUED State (201)',
      category: 'Gate Pass & Weighbridge',
      passed,
      durationMs: Date.now() - start,
      message: passed ? `Gate Pass created with passNumber: [${res.body.data.passNumber}]` : `Expected 201, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }

  // -------------------------------------------------------------
  // Test 17: Gate Pass API - Reject Tare Weight Exceeding Gross Weight (422)
  // -------------------------------------------------------------
  {
    const start = Date.now();
    const customer = Array.from(db.crmCustomers.values())[0] || { id: 'cust-harbor-dev' };
    const res = await simulateRequest(app, 'POST', `/api/quarries/${createdQuarryId}/gate-passes`, {
      token: staffToken,
      body: {
        customerId: customer.id,
        productId: createdProductId,
        quantity: 100,
        grossWeight: 10000,
        tareWeight: 15000 // Inverted weight!
      }
    });

    const passed = res.status === 422 && res.body?.error === 'TARE_EXCEEDS_GROSS';
    results.push({
      testName: 'Gate Pass API: Reject Inverted Tare Weight Exceeding Gross (422)',
      category: 'Gate Pass & Weighbridge',
      passed,
      durationMs: Date.now() - start,
      message: passed ? 'Weighbridge validation correctly rejected tare > gross' : `Expected 422, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }

  // -------------------------------------------------------------
  // Test 18: Gate Pass API - Verify & Dispatch with Atomic STOCK_OUT (200 OK)
  // -------------------------------------------------------------
  {
    const start = Date.now();
    // Step 1: Verify
    const verifyRes = await simulateRequest(app, 'POST', `/api/quarries/${createdQuarryId}/gate-passes/${createdGatePassId}/verify`, {
      token: managerToken
    });

    // Step 2: Dispatch
    const dispatchRes = await simulateRequest(app, 'POST', `/api/quarries/${createdQuarryId}/gate-passes/${createdGatePassId}/dispatch`, {
      token: managerToken
    });

    const passed = verifyRes.status === 200 &&
      dispatchRes.status === 200 &&
      dispatchRes.body?.data?.gatePass?.status === 'DISPATCHED' &&
      dispatchRes.body?.data?.stockLedgerEntry?.transactionType === 'STOCK_OUT' &&
      dispatchRes.body?.data?.remainingStock === 500; // 650 - 150 = 500

    results.push({
      testName: 'Gate Pass API: Verify & Dispatch Gate Pass with Atomic STOCK_OUT (200)',
      category: 'Gate Pass & Weighbridge',
      passed,
      durationMs: Date.now() - start,
      message: passed ? 'Gate Pass transitioned to DISPATCHED with atomic 150 TON deduction (Remaining: 500 TON)' : `Expected 200, got ${dispatchRes.status}: ${JSON.stringify(dispatchRes.body)}`,
      evidence: dispatchRes.body
    });
  }

  // -------------------------------------------------------------
  // Test 19: Gate Pass API - Reject Double Dispatch of Dispatched Pass (409 Conflict)
  // -------------------------------------------------------------
  {
    const start = Date.now();
    const res = await simulateRequest(app, 'POST', `/api/quarries/${createdQuarryId}/gate-passes/${createdGatePassId}/dispatch`, {
      token: managerToken
    });

    const passed = res.status === 409 && res.body?.error === 'GATE_PASS_ALREADY_DISPATCHED';
    results.push({
      testName: 'Gate Pass API: Prevent Double Dispatch & Stock Deduction (409 Conflict)',
      category: 'Gate Pass & Weighbridge',
      passed,
      durationMs: Date.now() - start,
      message: passed ? 'State machine prevented duplicate stock deduction on already dispatched pass' : `Expected 409, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }

  // -------------------------------------------------------------
  // Test 20: Land Lease & Settlement API - Create Lease, Calculate & Approve Settlement (201/200)
  // -------------------------------------------------------------
  {
    const start = Date.now();
    // 1. Create Lease
    const leaseRes = await simulateRequest(app, 'POST', `/api/quarries/${createdQuarryId}/land-leases`, {
      token: managerToken,
      body: {
        ownerName: 'Subbanna Bhat',
        surveyNumber: 'SY-102/4',
        village: 'Belvai',
        taluk: 'Moodbidri',
        area: 4.5,
        leaseType: 'LEASED',
        royaltyType: 'PER_TON',
        royaltyRate: 40,
        startDate: '2026-01-01',
        expiryDate: '2030-12-31'
      }
    });

    createdLeaseId = leaseRes.body?.data?.id || '';

    // 2. Create Settlement Statement for 1000 Tons extracted
    const settlementRes = await simulateRequest(app, 'POST', `/api/quarries/${createdQuarryId}/settlements`, {
      token: managerToken,
      body: {
        leaseId: createdLeaseId,
        periodStart: '2026-08-01',
        periodEnd: '2026-08-31',
        basisQuantity: 1000
      }
    });

    createdSettlementId = settlementRes.body?.data?.id || '';
    const expectedPayable = 1000 * 40; // 40,000

    // 3. Approve Settlement as QUARRY_OWNER
    const approveRes = await simulateRequest(app, 'POST', `/api/quarries/${createdQuarryId}/settlements/${createdSettlementId}/approve`, {
      token: ownerToken
    });

    const passed = leaseRes.status === 201 &&
      settlementRes.status === 201 &&
      (settlementRes.body?.data?.calculatedAmount === expectedPayable || settlementRes.body?.data?.netPayable === expectedPayable) &&
      approveRes.status === 200 &&
      approveRes.body?.data?.status === 'APPROVED';

    results.push({
      testName: 'Land Lease & Settlement API: Lifecycle Flow & Approval (201/200)',
      category: 'Land Lease & Settlements',
      passed,
      durationMs: Date.now() - start,
      message: passed ? `Land Lease and Settlement approved: Net payable ₹${expectedPayable}` : `Expected 200/201, got lease: ${leaseRes.status}, settlement: ${settlementRes.status}, approve: ${approveRes.status}`,
      evidence: { lease: leaseRes.body, settlement: settlementRes.body, approved: approveRes.body }
    });
  }

  // -------------------------------------------------------------
  // Test 21: Controlled Soft-Delete / Deactivation via DELETE Route (200 OK)
  // -------------------------------------------------------------
  {
    const start = Date.now();
    const deleteRes = await simulateRequest(app, 'DELETE', `/api/quarries/${createdQuarryId}`, {
      token: ownerToken
    });

    const passed = deleteRes.status === 200 &&
      deleteRes.body?.data?.status === 'INACTIVE' &&
      deleteRes.body?.success === true;

    results.push({
      testName: 'Quarry Master: Soft-Delete Deactivation via HTTP DELETE (200)',
      category: 'Quarry Operations',
      passed,
      durationMs: Date.now() - start,
      message: passed ? 'DELETE route successfully performed soft-deactivation (hard delete prevented)' : `Expected 200 INACTIVE, got ${deleteRes.status}: ${JSON.stringify(deleteRes.body)}`,
      evidence: deleteRes.body
    });
  }

  // -------------------------------------------------------------
  // Test 22: Security Context Invariant - Request Body tenantId Spoofing Blocked
  // -------------------------------------------------------------
  {
    const start = Date.now();
    const tenant1 = db.tenants.get('tenant-rz-global-001') || Array.from(db.tenants.values())[0];
    const company = Array.from(db.companies.values()).find(c => c.tenantId === tenant1?.id) || Array.from(db.companies.values())[0];
    const branch = Array.from(db.branches.values()).find(b => b.tenantId === tenant1?.id) || Array.from(db.branches.values())[0];

    // Attempt to inject an external tenant ID in the body while authenticated as tenant-rz-global-001
    const res = await simulateRequest(app, 'POST', '/api/quarries', {
      token: ownerToken,
      body: {
        tenantId: 'tenant-malicious-spoofed-999',
        companyId: company?.id || 'comp-rz-ventures-001',
        branchId: branch?.id || 'br-quarry-alpha',
        name: 'Spoof Attempt Granite Quarry ' + testSuffix,
        quarryType: 'HARD_ROCK',
        location: 'Spoofed Ridge',
        address: 'Survey 999, Karkala',
        leaseReference: 'LEASE-SPOOF-' + testSuffix
      }
    });

    // The middleware MUST block the spoofing attempt with 403 FORBIDDEN_CROSS_TENANT_ACCESS
    const passed = res.status === 403 &&
      res.body?.error === 'FORBIDDEN_CROSS_TENANT_ACCESS';

    results.push({
      testName: 'Tenant Security: Request Body tenantId Cannot Override SecurityContext (403)',
      category: 'Tenant Isolation',
      passed,
      durationMs: Date.now() - start,
      message: passed ? 'Tenant Isolation Security: Cross-tenant body spoofing blocked with 403 FORBIDDEN_CROSS_TENANT_ACCESS' : `Expected 403 FORBIDDEN_CROSS_TENANT_ACCESS, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }

  // -------------------------------------------------------------
  // Test 23: Sensitive Permission - QUARRY_DEACTIVATE Denied to QUARRY_STAFF (403)
  // -------------------------------------------------------------
  {
    const start = Date.now();
    const res = await simulateRequest(app, 'DELETE', `/api/quarries/${createdQuarryId}`, {
      token: staffToken
    });

    const passed = res.status === 403 && (res.body?.error === 'FORBIDDEN' || res.body?.error === 'FORBIDDEN_PERMISSION_REQUIRED');
    results.push({
      testName: 'Sensitive Permission: QUARRY_DEACTIVATE Denied to QUARRY_STAFF (403)',
      category: 'Quarry RBAC & Auth',
      passed,
      durationMs: Date.now() - start,
      message: passed ? 'QUARRY_DEACTIVATE permission verified server-side' : `Expected 403, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }

  // -------------------------------------------------------------
  // Test 24: Sensitive Permission - GATE_PASS_VERIFY Denied to QUARRY_STAFF (403)
  // -------------------------------------------------------------
  {
    const start = Date.now();
    const res = await simulateRequest(app, 'POST', `/api/quarries/${createdQuarryId}/gate-passes/${createdGatePassId}/verify`, {
      token: staffToken
    });

    const passed = res.status === 403 && (res.body?.error === 'FORBIDDEN' || res.body?.error === 'FORBIDDEN_PERMISSION_REQUIRED');
    results.push({
      testName: 'Sensitive Permission: GATE_PASS_VERIFY Denied to QUARRY_STAFF (403)',
      category: 'Quarry RBAC & Auth',
      passed,
      durationMs: Date.now() - start,
      message: passed ? 'GATE_PASS_VERIFY permission verified server-side' : `Expected 403, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }

  // -------------------------------------------------------------
  // Test 25: Gate Pass Lifecycle - Controlled Cancellation (200 OK)
  // -------------------------------------------------------------
  {
    const start = Date.now();
    const customer = Array.from(db.crmCustomers.values())[0] || { id: 'cust-harbor-dev' };
    
    // Create new gate pass for cancellation
    const createRes = await simulateRequest(app, 'POST', `/api/quarries/${createdQuarryId}/gate-passes`, {
      token: staffToken,
      body: {
        customerId: customer.id,
        productId: createdProductId,
        quantity: 50,
        unit: 'TON',
        vehicleNo: 'KA-19-Z-1111',
        driverName: 'Mohan Kumar'
      }
    });

    const newPassId = createRes.body?.data?.id;

    // Cancel gate pass as Manager
    const cancelRes = await simulateRequest(app, 'POST', `/api/quarries/${createdQuarryId}/gate-passes/${newPassId}/cancel`, {
      token: managerToken,
      body: { reason: 'Vehicle breakdown at weighbridge entrance' }
    });

    const passed = createRes.status === 201 &&
      cancelRes.status === 200 &&
      cancelRes.body?.data?.status === 'CANCELLED';

    results.push({
      testName: 'Gate Pass State Machine: Controlled Cancellation to CANCELLED (200)',
      category: 'Gate Pass & Weighbridge',
      passed,
      durationMs: Date.now() - start,
      message: passed ? 'Gate pass transitioned to CANCELLED with audit reason' : `Expected 200 CANCELLED, got ${cancelRes.status}: ${JSON.stringify(cancelRes.body)}`,
      evidence: cancelRes.body
    });
  }

  // -------------------------------------------------------------
  // Test 26: Sensitive Permission - GATE_PASS_CANCEL Denied to QUARRY_STAFF (403)
  // -------------------------------------------------------------
  {
    const start = Date.now();
    const res = await simulateRequest(app, 'POST', `/api/quarries/${createdQuarryId}/gate-passes/${createdGatePassId}/cancel`, {
      token: staffToken,
      body: { reason: 'Unauthorized cancellation attempt' }
    });

    const passed = res.status === 403 && (res.body?.error === 'FORBIDDEN' || res.body?.error === 'FORBIDDEN_PERMISSION_REQUIRED');
    results.push({
      testName: 'Sensitive Permission: GATE_PASS_CANCEL Denied to QUARRY_STAFF (403)',
      category: 'Quarry RBAC & Auth',
      passed,
      durationMs: Date.now() - start,
      message: passed ? 'GATE_PASS_CANCEL permission verified server-side' : `Expected 403, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }

  return results;
}
