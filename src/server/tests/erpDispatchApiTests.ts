import request from 'supertest';
import { isPostgresEnabled } from '../db/postgresPool.js';
import { createErpTestApp, loginErpAdmin, loginOtherTenant, uniqueCode } from './erpTestHarness.js';
import { ModuleTestResult } from './erpProductionApiTests.js';

export async function runErpDispatchApiTests() {
  const executedAt = new Date().toISOString();
  if (!isPostgresEnabled()) {
    return { skipped: true, skipReason: 'DATABASE_URL is not configured', executedAt, totalTests: 0, passedCount: 0, failedCount: 0, results: [] as ModuleTestResult[] };
  }

  const app = await createErpTestApp();
  const ctx = await loginErpAdmin(app);
  const other = await loginOtherTenant(app);
  const results: ModuleTestResult[] = [];

  const quarry = await request(app).post('/api/v1/erp/quarries').set(ctx.header).send({
    code: uniqueCode('QD'),
    name: 'Dispatch Quarry'
  });
  const product = await request(app).post('/api/v1/erp/products').set(ctx.header).send({
    code: uniqueCode('PD'),
    name: 'P-Sand',
    category: 'Sand Product',
    defaultUom: 'TON'
  });
  await request(app).post('/api/v1/erp/production/batches').set(ctx.header).send({
    quarryId: quarry.body.data.id,
    batchNumber: uniqueCode('BD'),
    productionDate: '2026-08-26',
    postImmediately: true,
    lines: [{ productId: product.body.data.id, quantity: 20, quantityUom: 'TON' }]
  });
  const customer = await request(app).post('/api/v1/erp/customers').set(ctx.header).send({
    code: uniqueCode('CD'),
    name: 'Dispatch Customer',
    destination: 'Yard South'
  });

  const gp = await request(app).post('/api/v1/erp/gate-passes').set(ctx.header).send({
    gatePassNumber: uniqueCode('GPD'),
    quarryId: quarry.body.data.id,
    customerId: customer.body.data.id,
    vehicleNumber: 'KA-21-D-2211',
    driverName: 'Suresh',
    destination: 'Yard South',
    lines: [{ productId: product.body.data.id, quantity: 8, quantityUom: 'TON' }]
  });
  await request(app).post(`/api/v1/erp/gate-passes/${gp.body.data.id}/approve`).set(ctx.header);
  await request(app).post(`/api/v1/erp/gate-passes/${gp.body.data.id}/issue`).set(ctx.header);

  const idempotencyKey = uniqueCode('IDEM');
  const dispatchRes = await request(app)
    .post('/api/v1/erp/dispatches')
    .set({ ...ctx.header, 'Idempotency-Key': idempotencyKey })
    .send({
      dispatchNumber: uniqueCode('DSP'),
      gatePassId: gp.body.data.id
    });

  results.push({
    testName: 'Successful dispatch from issued gate pass',
    passed: dispatchRes.status === 201 && dispatchRes.body?.data?.status === 'POSTED' && Boolean(dispatchRes.body?.data?.id),
    message: `status=${dispatchRes.status}`
  });

  const balances = await request(app)
    .get(`/api/v1/erp/stock/balances?quarryId=${quarry.body.data.id}`)
    .set(ctx.header);
  const qty = Array.isArray(balances.body?.data)
    ? balances.body.data.find((row: { productId: string }) => row.productId === product.body.data.id)?.quantity
    : undefined;
  results.push({
    testName: 'Dispatch decreases stock',
    passed: qty === 12,
    message: `qty=${qty}`
  });

  const replay = await request(app)
    .post('/api/v1/erp/dispatches')
    .set({ ...ctx.header, 'Idempotency-Key': idempotencyKey })
    .send({
      dispatchNumber: uniqueCode('DSP2'),
      gatePassId: gp.body.data.id
    });
  results.push({
    testName: 'Idempotent dispatch replay returns original dispatch',
    passed: replay.body?.data?.id === dispatchRes.body?.data?.id,
    message: `original=${dispatchRes.body?.data?.id} replay=${replay.body?.data?.id} status=${replay.status}`
  });

  const duplicate = await request(app).post('/api/v1/erp/dispatches').set(ctx.header).send({
    dispatchNumber: uniqueCode('DSP3'),
    gatePassId: gp.body.data.id
  });
  results.push({
    testName: 'Duplicate dispatch against same gate pass is rejected',
    passed:
      duplicate.status === 409 ||
      (duplicate.status === 400 && (duplicate.body?.error === 'INVALID_STATUS' || duplicate.body?.error === 'DUPLICATE_DISPATCH')),
    message: `status=${duplicate.status} error=${duplicate.body?.error}`
  });

  const cancelledGp = await request(app).post('/api/v1/erp/gate-passes').set(ctx.header).send({
    gatePassNumber: uniqueCode('GPCX'),
    quarryId: quarry.body.data.id,
    customerId: customer.body.data.id,
    vehicleNumber: 'KA-21-D-2299',
    driverName: 'Cancelled',
    lines: [{ productId: product.body.data.id, quantity: 1, quantityUom: 'TON' }]
  });
  await request(app).post(`/api/v1/erp/gate-passes/${cancelledGp.body.data.id}/cancel`).set(ctx.header);
  const cancelDispatch = await request(app).post('/api/v1/erp/dispatches').set(ctx.header).send({
    dispatchNumber: uniqueCode('DSPC'),
    gatePassId: cancelledGp.body.data.id
  });
  results.push({
    testName: 'Dispatch of cancelled gate pass is rejected',
    passed: cancelDispatch.status === 400 && cancelDispatch.body?.error === 'GATE_PASS_CANCELLED',
    message: `status=${cancelDispatch.status} error=${cancelDispatch.body?.error}`
  });

  const isolated = await request(app).get(`/api/v1/erp/dispatches/${dispatchRes.body.data.id}`).set(other.header);
  results.push({
    testName: 'Other tenant cannot read dispatch',
    passed: isolated.status === 404 || isolated.status === 403 || isolated.status === 401,
    message: `status=${isolated.status}`
  });

  const unauthorized = await request(app).post('/api/v1/erp/dispatches').send({
    dispatchNumber: 'X',
    gatePassId: 'y'
  });
  results.push({
    testName: 'Dispatch requires authentication',
    passed: unauthorized.status === 401,
    message: `status=${unauthorized.status}`
  });

  const passedCount = results.filter((result) => result.passed).length;
  return { skipped: false, executedAt, totalTests: results.length, passedCount, failedCount: results.length - passedCount, results };
}
