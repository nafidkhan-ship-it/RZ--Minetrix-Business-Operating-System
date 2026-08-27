import { Express } from 'express';
import request from 'supertest';
import { isPostgresEnabled } from '../db/postgresPool.js';
import { createErpTestApp, loginErpAdmin, uniqueCode } from './erpTestHarness.js';
import { ModuleTestResult } from './erpProductionApiTests.js';

async function seedPostedStock(app: Express, header: Record<string, string>, quantity: number) {
  const quarry = await request(app).post('/api/v1/erp/quarries').set(header).send({
    code: uniqueCode('QG'),
    name: 'Gate Pass Quarry'
  });
  const product = await request(app).post('/api/v1/erp/products').set(header).send({
    code: uniqueCode('PG'),
    name: '40mm Metal',
    category: 'Crushed Aggregate',
    defaultUom: 'TON'
  });
  await request(app).post('/api/v1/erp/production/batches').set(header).send({
    quarryId: quarry.body.data.id,
    batchNumber: uniqueCode('BG'),
    productionDate: '2026-08-26',
    postImmediately: true,
    lines: [{ productId: product.body.data.id, quantity, quantityUom: 'TON' }]
  });
  const customer = await request(app).post('/api/v1/erp/customers').set(header).send({
    code: uniqueCode('CU'),
    name: 'Highway Infra',
    destination: 'NH-66 Site'
  });
  return {
    quarryId: quarry.body.data.id as string,
    productId: product.body.data.id as string,
    customerId: customer.body.data.id as string
  };
}

export async function runErpGatePassApiTests() {
  const executedAt = new Date().toISOString();
  if (!isPostgresEnabled()) {
    return { skipped: true, skipReason: 'DATABASE_URL is not configured', executedAt, totalTests: 0, passedCount: 0, failedCount: 0, results: [] as ModuleTestResult[] };
  }

  const app = await createErpTestApp();
  const ctx = await loginErpAdmin(app);
  const results: ModuleTestResult[] = [];
  const seed = await seedPostedStock(app, ctx.header, 30);

  const unauthorized = await request(app).get('/api/v1/erp/gate-passes');
  results.push({
    testName: 'GET gate passes requires authentication',
    passed: unauthorized.status === 401,
    message: `status=${unauthorized.status}`
  });

  const createRes = await request(app).post('/api/v1/erp/gate-passes').set(ctx.header).send({
    gatePassNumber: uniqueCode('GP'),
    quarryId: seed.quarryId,
    customerId: seed.customerId,
    vehicleNumber: 'KA-19-MC-1001',
    driverName: 'Ramesh Gowda',
    destination: 'NH-66 Site',
    lines: [{ productId: seed.productId, quantity: 12, quantityUom: 'TON' }]
  });
  results.push({
    testName: 'POST gate pass creates DRAFT when stock is available',
    passed: createRes.status === 201 && createRes.body?.data?.status === 'DRAFT',
    message: `status=${createRes.status}`
  });

  const insufficient = await request(app).post('/api/v1/erp/gate-passes').set(ctx.header).send({
    gatePassNumber: uniqueCode('GPX'),
    quarryId: seed.quarryId,
    customerId: seed.customerId,
    vehicleNumber: 'KA-19-MC-1002',
    driverName: 'Driver Two',
    lines: [{ productId: seed.productId, quantity: 9999, quantityUom: 'TON' }]
  });
  results.push({
    testName: 'Gate pass creation rejects insufficient stock',
    passed: insufficient.status === 409 && insufficient.body?.error === 'INSUFFICIENT_STOCK',
    message: `status=${insufficient.status} error=${insufficient.body?.error}`
  });

  const gpId = createRes.body?.data?.id;
  const approve = await request(app).post(`/api/v1/erp/gate-passes/${gpId}/approve`).set(ctx.header);
  results.push({
    testName: 'Gate pass DRAFT → APPROVED',
    passed: approve.status === 200 && approve.body?.data?.status === 'APPROVED',
    message: `status=${approve.status}`
  });

  const issue = await request(app).post(`/api/v1/erp/gate-passes/${gpId}/issue`).set(ctx.header);
  results.push({
    testName: 'Gate pass APPROVED → ISSUED',
    passed: issue.status === 200 && issue.body?.data?.status === 'ISSUED',
    message: `status=${issue.status}`
  });

  const invalidTransition = await request(app).post(`/api/v1/erp/gate-passes/${gpId}/approve`).set(ctx.header);
  results.push({
    testName: 'Invalid gate pass transition is rejected',
    passed: invalidTransition.status === 400 && invalidTransition.body?.error === 'INVALID_STATUS_TRANSITION',
    message: `status=${invalidTransition.status}`
  });

  const cancelTarget = await request(app).post('/api/v1/erp/gate-passes').set(ctx.header).send({
    gatePassNumber: uniqueCode('GPC'),
    quarryId: seed.quarryId,
    customerId: seed.customerId,
    vehicleNumber: 'KA-19-MC-1003',
    driverName: 'Cancel Driver',
    lines: [{ productId: seed.productId, quantity: 1, quantityUom: 'TON' }]
  });
  const cancelled = await request(app).post(`/api/v1/erp/gate-passes/${cancelTarget.body.data.id}/cancel`).set(ctx.header);
  results.push({
    testName: 'Gate pass DRAFT → CANCELLED',
    passed: cancelled.status === 200 && cancelled.body?.data?.status === 'CANCELLED',
    message: `status=${cancelled.status}`
  });

  const passedCount = results.filter((result) => result.passed).length;
  return { skipped: false, executedAt, totalTests: results.length, passedCount, failedCount: results.length - passedCount, results };
}
