import request from 'supertest';
import { isPostgresEnabled } from '../db/postgresPool.js';
import { calculateSettlementAmounts } from '../db/erp/operationsTypes.js';
import { createErpTestApp, loginErpAdmin, uniqueCode } from './erpTestHarness.js';
import { ModuleTestResult } from './erpProductionApiTests.js';

export async function runErpSettlementApiTests() {
  const executedAt = new Date().toISOString();
  if (!isPostgresEnabled()) {
    return { skipped: true, skipReason: 'DATABASE_URL is not configured', executedAt, totalTests: 0, passedCount: 0, failedCount: 0, results: [] as ModuleTestResult[] };
  }

  const app = await createErpTestApp();
  const ctx = await loginErpAdmin(app);
  const results: ModuleTestResult[] = [];

  const calc = calculateSettlementAmounts(12.5, 80, 25);
  results.push({
    testName: 'Settlement calculation is centralized and exact',
    passed: calc.grossAmount === 1000 && calc.netAmount === 975,
    message: `gross=${calc.grossAmount} net=${calc.netAmount}`
  });

  let calcThrew = false;
  try {
    calculateSettlementAmounts(10, 50, 600);
  } catch {
    calcThrew = true;
  }
  results.push({
    testName: 'Settlement calculation rejects negative net',
    passed: calcThrew,
    message: calcThrew ? 'rejected' : 'accepted invalid net'
  });

  const quarry = await request(app).post('/api/v1/erp/quarries').set(ctx.header).send({
    code: uniqueCode('QSET'),
    name: 'Settlement Quarry'
  });
  const product = await request(app).post('/api/v1/erp/products').set(ctx.header).send({
    code: uniqueCode('PSET'),
    name: 'Laterite',
    category: 'Quarry Stone',
    defaultUom: 'TON'
  });
  const batch = await request(app).post('/api/v1/erp/production/batches').set(ctx.header).send({
    quarryId: quarry.body.data.id,
    batchNumber: uniqueCode('BSET'),
    productionDate: '2026-08-26',
    postImmediately: true,
    lines: [{ productId: product.body.data.id, quantity: 12.5, quantityUom: 'TON' }]
  });
  const parcel = await request(app).post('/api/v1/erp/land-parcels').set(ctx.header).send({
    surveyNumber: uniqueCode('SY'),
    villageTaluk: 'Bantwal',
    acreage: 4.5,
    ownerName: 'Landowner A'
  });
  const rate = await request(app).post('/api/v1/erp/settlement-rates').set(ctx.header).send({
    landParcelId: parcel.body.data.id,
    quarryId: quarry.body.data.id,
    ratePerUom: 80,
    quantityUom: 'TON',
    effectiveFrom: '2026-01-01'
  });
  results.push({
    testName: 'Settlement rate is configured, not hardcoded',
    passed: rate.status === 201 && rate.body?.data?.ratePerUom === 80,
    message: `status=${rate.status}`
  });

  const missingRateParcel = await request(app).post('/api/v1/erp/land-parcels').set(ctx.header).send({
    surveyNumber: uniqueCode('SY2'),
    ownerName: 'No Rate Owner'
  });
  const noRate = await request(app).post('/api/v1/erp/settlements').set(ctx.header).send({
    settlementNumber: uniqueCode('STL0'),
    landParcelId: missingRateParcel.body.data.id,
    quarryId: quarry.body.data.id,
    basis: 'PRODUCTION',
    productionBatchId: batch.body.data.id
  });
  results.push({
    testName: 'Settlement without configured rate is rejected',
    passed: noRate.status === 400 && noRate.body?.error === 'RATE_NOT_CONFIGURED',
    message: `status=${noRate.status}`
  });

  const settlement = await request(app).post('/api/v1/erp/settlements').set(ctx.header).send({
    settlementNumber: uniqueCode('STL'),
    landParcelId: parcel.body.data.id,
    quarryId: quarry.body.data.id,
    basis: 'PRODUCTION',
    productionBatchId: batch.body.data.id,
    deductions: 25,
    statementRef: 'STMT-001'
  });
  results.push({
    testName: 'POST settlement uses production quantity and configured rate',
    passed:
      settlement.status === 201 &&
      settlement.body?.data?.quantity === 12.5 &&
      settlement.body?.data?.grossAmount === 1000 &&
      settlement.body?.data?.netAmount === 975 &&
      Boolean(settlement.body?.data?.id),
    message: `status=${settlement.status} gross=${settlement.body?.data?.grossAmount} net=${settlement.body?.data?.netAmount}`
  });

  const list = await request(app).get('/api/v1/erp/settlements').set(ctx.header);
  results.push({
    testName: 'GET settlements returns created statement',
    passed: list.status === 200 && Array.isArray(list.body?.data) && list.body.data.some((row: { id: string }) => row.id === settlement.body.data.id),
    message: `status=${list.status}`
  });

  const unauthorized = await request(app).get('/api/v1/erp/settlements');
  results.push({
    testName: 'GET settlements requires authentication',
    passed: unauthorized.status === 401,
    message: `status=${unauthorized.status}`
  });

  const passedCount = results.filter((result) => result.passed).length;
  return { skipped: false, executedAt, totalTests: results.length, passedCount, failedCount: results.length - passedCount, results };
}
