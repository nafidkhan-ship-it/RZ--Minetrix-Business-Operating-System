import request from 'supertest';
import { isPostgresEnabled } from '../db/postgresPool.js';
import { createErpTestApp, loginErpAdmin, uniqueCode } from './erpTestHarness.js';

export interface ModuleTestResult {
  testName: string;
  passed: boolean;
  message: string;
}

export async function runErpProductionApiTests() {
  const executedAt = new Date().toISOString();
  if (!isPostgresEnabled()) {
    return { skipped: true, skipReason: 'DATABASE_URL is not configured', executedAt, totalTests: 0, passedCount: 0, failedCount: 0, results: [] as ModuleTestResult[] };
  }

  const app = await createErpTestApp();
  const ctx = await loginErpAdmin(app);
  const results: ModuleTestResult[] = [];

  const quarry = await request(app).post('/api/v1/erp/quarries').set(ctx.header).send({
    code: uniqueCode('QP'),
    name: 'Production Test Quarry'
  });
  const product = await request(app).post('/api/v1/erp/products').set(ctx.header).send({
    code: uniqueCode('PP'),
    name: 'Laterite Grade A',
    category: 'Quarry Stone',
    defaultUom: 'TON'
  });

  results.push({
    testName: 'Seed quarry and product for production tests',
    passed: quarry.status === 201 && product.status === 201,
    message: `quarry=${quarry.status} product=${product.status}`
  });

  const unauthorized = await request(app).get('/api/v1/erp/production/batches');
  results.push({
    testName: 'GET production batches requires authentication',
    passed: unauthorized.status === 401,
    message: `status=${unauthorized.status}`
  });

  const createRes = await request(app)
    .post('/api/v1/erp/production/batches')
    .set(ctx.header)
    .send({
      quarryId: quarry.body.data.id,
      batchNumber: uniqueCode('BAT'),
      productionDate: '2026-08-26',
      shiftName: 'A',
      lines: [{ productId: product.body.data.id, quantity: 25, quantityUom: 'TON' }]
    });

  results.push({
    testName: 'POST production batch creates DRAFT record',
    passed: createRes.status === 201 && createRes.body?.data?.status === 'DRAFT' && createRes.body?.data?.totalQuantity === 25,
    message: `status=${createRes.status} batchStatus=${createRes.body?.data?.status}`
  });

  const batchId = createRes.body?.data?.id;
  const getRes = await request(app).get(`/api/v1/erp/production/batches/${batchId}`).set(ctx.header);
  results.push({
    testName: 'GET production batch by ID',
    passed: getRes.status === 200 && getRes.body?.data?.id === batchId,
    message: `status=${getRes.status}`
  });

  const postRes = await request(app).post(`/api/v1/erp/production/batches/${batchId}/post`).set(ctx.header);
  results.push({
    testName: 'POST production batch posts to stock',
    passed: postRes.status === 200 && postRes.body?.data?.status === 'POSTED',
    message: `status=${postRes.status} batchStatus=${postRes.body?.data?.status}`
  });

  const dupPost = await request(app).post(`/api/v1/erp/production/batches/${batchId}/post`).set(ctx.header);
  results.push({
    testName: 'Duplicate production posting is rejected',
    passed: dupPost.status === 409 && dupPost.body?.error === 'DUPLICATE_PRODUCTION_POSTING',
    message: `status=${dupPost.status} error=${dupPost.body?.error}`
  });

  const invalid = await request(app).post('/api/v1/erp/production/batches').set(ctx.header).send({
    quarryId: quarry.body.data.id,
    batchNumber: 'x',
    productionDate: 'bad',
    lines: []
  });
  results.push({
    testName: 'POST production batch validates body',
    passed: invalid.status === 400,
    message: `status=${invalid.status}`
  });

  const tenantReject = await request(app).post('/api/v1/erp/production/batches').set(ctx.header).send({
    quarryId: quarry.body.data.id,
    batchNumber: uniqueCode('TEN'),
    productionDate: '2026-08-26',
    tenantId: 'other',
    lines: [{ productId: product.body.data.id, quantity: 1 }]
  });
  results.push({
    testName: 'POST production batch rejects client tenantId',
    passed: tenantReject.status === 400,
    message: `status=${tenantReject.status}`
  });

  const passedCount = results.filter((result) => result.passed).length;
  return { skipped: false, executedAt, totalTests: results.length, passedCount, failedCount: results.length - passedCount, results };
}
