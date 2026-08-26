import request from 'supertest';
import { createCoreApp } from '../app.js';
import { notFoundHandler, errorHandler } from '../middleware/errorHandler.js';
import { initializeDatabase } from '../db/database.js';
import { isPostgresEnabled } from '../db/postgresPool.js';

export interface ErpQuarryApiTestResult {
  testName: string;
  passed: boolean;
  message: string;
}

export async function runErpQuarryApiTests(): Promise<{
  skipped: boolean;
  skipReason?: string;
  executedAt: string;
  totalTests: number;
  passedCount: number;
  failedCount: number;
  results: ErpQuarryApiTestResult[];
}> {
  const executedAt = new Date().toISOString();
  const results: ErpQuarryApiTestResult[] = [];

  if (!isPostgresEnabled()) {
    return {
      skipped: true,
      skipReason: 'DATABASE_URL is not configured',
      executedAt,
      totalTests: 0,
      passedCount: 0,
      failedCount: 0,
      results: []
    };
  }

  await initializeDatabase();
  const app = createCoreApp();
  app.use(notFoundHandler);
  app.use(errorHandler);

  const loginRes = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'admin@racezoneventures.com', password: 'AdminPass2026!' });

  const token = loginRes.body?.data?.token;
  const authHeader = { Authorization: `Bearer ${token}` };
  const quarryCode = `QRY-${Date.now().toString().slice(-6)}`;

  results.push({
    testName: 'Admin login succeeds for quarry API tests',
    passed: loginRes.status === 200 && Boolean(token),
    message: `status=${loginRes.status}`
  });

  const unauthorized = await request(app).get('/api/v1/erp/quarries');
  results.push({
    testName: 'GET /erp/quarries requires authentication',
    passed: unauthorized.status === 401,
    message: `status=${unauthorized.status}`
  });

  const createRes = await request(app)
    .post('/api/v1/erp/quarries')
    .set(authHeader)
    .send({
      code: quarryCode,
      name: 'Integration Test Quarry',
      mineralType: 'HARD_ROCK',
      operationalStatus: 'ACTIVE',
      capacityTons: 1200
    });

  results.push({
    testName: 'POST /erp/quarries creates quarry',
    passed: createRes.status === 201 && createRes.body?.success === true && createRes.body?.data?.code === quarryCode,
    message: `status=${createRes.status}`
  });

  const duplicateRes = await request(app)
    .post('/api/v1/erp/quarries')
    .set(authHeader)
    .send({
      code: quarryCode,
      name: 'Duplicate Quarry Attempt'
    });

  results.push({
    testName: 'POST /erp/quarries rejects duplicate code',
    passed: duplicateRes.status === 409 && duplicateRes.body?.error === 'DUPLICATE_QUARRY_CODE',
    message: `status=${duplicateRes.status}`
  });

  const listRes = await request(app).get('/api/v1/erp/quarries').set(authHeader);
  const listed = Array.isArray(listRes.body?.data)
    ? listRes.body.data.some((item: { code: string }) => item.code === quarryCode)
    : false;

  results.push({
    testName: 'GET /erp/quarries returns created quarry',
    passed: listRes.status === 200 && listed,
    message: `status=${listRes.status}, found=${listed}`
  });

  const quarryId = createRes.body?.data?.id;
  const getRes = quarryId
    ? await request(app).get(`/api/v1/erp/quarries/${quarryId}`).set(authHeader)
    : null;

  results.push({
    testName: 'GET /erp/quarries/:id returns quarry by ID',
    passed: Boolean(getRes && getRes.status === 200 && getRes.body?.data?.id === quarryId),
    message: getRes ? `status=${getRes.status}` : 'create failed'
  });

  const invalidBody = await request(app)
    .post('/api/v1/erp/quarries')
    .set(authHeader)
    .send({ code: 'x', name: 'Bad' });

  results.push({
    testName: 'POST /erp/quarries validates request body',
    passed: invalidBody.status === 400,
    message: `status=${invalidBody.status}`
  });

  const tenantBody = await request(app)
    .post('/api/v1/erp/quarries')
    .set(authHeader)
    .send({ code: 'TENANT-TEST', name: 'Tenant Reject', tenantId: 'other-tenant' });

  results.push({
    testName: 'POST /erp/quarries rejects client tenantId',
    passed: tenantBody.status === 400,
    message: `status=${tenantBody.status}`
  });

  const updateRes = quarryId
    ? await request(app)
        .patch(`/api/v1/erp/quarries/${quarryId}`)
        .set(authHeader)
        .send({ name: 'Integration Test Quarry Updated', capacityTons: 1500 })
    : null;

  results.push({
    testName: 'PATCH /erp/quarries/:id updates quarry',
    passed: Boolean(
      updateRes &&
        updateRes.status === 200 &&
        updateRes.body?.data?.name === 'Integration Test Quarry Updated' &&
        updateRes.body?.data?.capacityTons === 1500
    ),
    message: updateRes ? `status=${updateRes.status}` : 'create failed'
  });

  const archiveCode = `QRY-ARC-${Date.now().toString().slice(-5)}`;
  const archiveCreateRes = await request(app)
    .post('/api/v1/erp/quarries')
    .set(authHeader)
    .send({ code: archiveCode, name: 'Archive Target Quarry' });

  const archiveId = archiveCreateRes.body?.data?.id;
  const archiveRes = archiveId
    ? await request(app).delete(`/api/v1/erp/quarries/${archiveId}`).set(authHeader)
    : null;
  const archivedGetRes = archiveId
    ? await request(app).get(`/api/v1/erp/quarries/${archiveId}`).set(authHeader)
    : null;

  results.push({
    testName: 'DELETE /erp/quarries/:id archives quarry',
    passed: Boolean(archiveRes && archiveRes.status === 200 && archivedGetRes && archivedGetRes.status === 404),
    message: archiveRes ? `delete=${archiveRes.status}, get=${archivedGetRes?.status}` : 'create failed'
  });

  const passedCount = results.filter((result) => result.passed).length;
  return {
    skipped: false,
    executedAt,
    totalTests: results.length,
    passedCount,
    failedCount: results.length - passedCount,
    results
  };
}
