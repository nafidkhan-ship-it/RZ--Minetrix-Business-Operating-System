import request from 'supertest';
import { isPostgresEnabled } from '../db/postgresPool.js';
import { createErpTestApp, loginErpAdmin, loginOtherTenant, uniqueCode } from './erpTestHarness.js';
import { ModuleTestResult } from './erpProductionApiTests.js';

export async function runErpStockApiTests() {
  const executedAt = new Date().toISOString();
  if (!isPostgresEnabled()) {
    return { skipped: true, skipReason: 'DATABASE_URL is not configured', executedAt, totalTests: 0, passedCount: 0, failedCount: 0, results: [] as ModuleTestResult[] };
  }

  const app = await createErpTestApp();
  const ctx = await loginErpAdmin(app);
  const other = await loginOtherTenant(app);
  const results: ModuleTestResult[] = [];

  const quarry = await request(app).post('/api/v1/erp/quarries').set(ctx.header).send({
    code: uniqueCode('QS'),
    name: 'Stock Test Quarry'
  });
  const product = await request(app).post('/api/v1/erp/products').set(ctx.header).send({
    code: uniqueCode('PS'),
    name: 'M-Sand',
    category: 'Sand Product',
    defaultUom: 'TON'
  });

  const posted = await request(app).post('/api/v1/erp/production/batches').set(ctx.header).send({
    quarryId: quarry.body.data.id,
    batchNumber: uniqueCode('STK'),
    productionDate: '2026-08-26',
    postImmediately: true,
    lines: [{ productId: product.body.data.id, quantity: 40, quantityUom: 'TON' }]
  });

  results.push({
    testName: 'Posted production increases stock',
    passed: posted.status === 201 && posted.body?.data?.status === 'POSTED',
    message: `status=${posted.status}`
  });

  const balances = await request(app)
    .get(`/api/v1/erp/stock/balances?quarryId=${quarry.body.data.id}`)
    .set(ctx.header);
  const match = Array.isArray(balances.body?.data)
    ? balances.body.data.find((row: { productId: string; quantity: number }) => row.productId === product.body.data.id)
    : null;
  results.push({
    testName: 'Stock balance reflects production quantity',
    passed: balances.status === 200 && match?.quantity === 40,
    message: `status=${balances.status} qty=${match?.quantity}`
  });

  const ledger = await request(app)
    .get(`/api/v1/erp/stock/ledger?quarryId=${quarry.body.data.id}`)
    .set(ctx.header);
  const inMovement = Array.isArray(ledger.body?.data)
    ? ledger.body.data.some((row: { movementType: string; referenceType: string }) => row.movementType === 'STOCK_IN' && row.referenceType === 'PRODUCTION')
    : false;
  results.push({
    testName: 'Stock ledger records PRODUCTION STOCK_IN',
    passed: ledger.status === 200 && inMovement,
    message: `status=${ledger.status} found=${inMovement}`
  });

  const isolated = await request(app)
    .get(`/api/v1/erp/stock/balances?quarryId=${quarry.body.data.id}`)
    .set(other.header);
  const otherSaw = Array.isArray(isolated.body?.data) && isolated.body.data.some((row: { quarryId: string }) => row.quarryId === quarry.body.data.id);
  results.push({
    testName: 'Other tenant cannot see stock balances',
    passed: (isolated.status === 403 || isolated.status === 401 || (isolated.status === 200 && !otherSaw)),
    message: `status=${isolated.status} leaked=${otherSaw}`
  });

  const overAdjustOut = await request(app).post('/api/v1/erp/stock/adjustments').set(ctx.header).send({
    quarryId: quarry.body.data.id,
    productId: product.body.data.id,
    quantity: 1
  });
  results.push({
    testName: 'Positive stock adjustment posts to ledger',
    passed: overAdjustOut.status === 201 && overAdjustOut.body?.data?.movementType === 'ADJUSTMENT',
    message: `status=${overAdjustOut.status}`
  });

  const unauthorized = await request(app).get('/api/v1/erp/stock/balances');
  results.push({
    testName: 'GET stock balances requires authentication',
    passed: unauthorized.status === 401,
    message: `status=${unauthorized.status}`
  });

  const passedCount = results.filter((result) => result.passed).length;
  return { skipped: false, executedAt, totalTests: results.length, passedCount, failedCount: results.length - passedCount, results };
}
