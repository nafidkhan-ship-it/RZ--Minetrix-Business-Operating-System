import request from 'supertest';
import { isPostgresEnabled } from '../db/postgresPool.js';
import { createErpTestApp, loginErpAdmin, loginOtherTenant, uniqueCode } from './erpTestHarness.js';
import { ModuleTestResult } from './erpProductionApiTests.js';

export async function runErpCrmOrderApiTests() {
  const executedAt = new Date().toISOString();
  if (!isPostgresEnabled()) {
    return { skipped: true, skipReason: 'DATABASE_URL is not configured', executedAt, totalTests: 0, passedCount: 0, failedCount: 0, results: [] as ModuleTestResult[] };
  }

  const app = await createErpTestApp();
  const ctx = await loginErpAdmin(app);
  const other = await loginOtherTenant(app);
  const results: ModuleTestResult[] = [];

  const unauthorized = await request(app).get('/api/v1/erp/orders');
  results.push({
    testName: 'GET orders requires authentication',
    passed: unauthorized.status === 401,
    message: `status=${unauthorized.status}`
  });

  const quarry = await request(app).post('/api/v1/erp/quarries').set(ctx.header).send({
    code: uniqueCode('QCRM'),
    name: 'CRM Order Quarry'
  });
  const product = await request(app).post('/api/v1/erp/products').set(ctx.header).send({
    code: uniqueCode('PCRM'),
    name: '20mm Aggregate',
    category: 'Crushed Aggregate',
    defaultUom: 'TON'
  });

  const lead = await request(app).post('/api/v1/erp/leads').set(ctx.header).send({
    code: uniqueCode('LD'),
    companyName: 'UAT Builders',
    contactName: 'Priya Rao',
    phone: '9990001111',
    source: 'SITE_VISIT'
  });
  results.push({
    testName: 'POST lead creates NEW lead',
    passed: lead.status === 201 && lead.body?.data?.status === 'NEW' && Boolean(lead.body?.data?.id),
    message: `status=${lead.status}`
  });

  const converted = await request(app).post(`/api/v1/erp/leads/${lead.body.data.id}/convert`).set(ctx.header);
  results.push({
    testName: 'Convert lead creates customer',
    passed: converted.status === 200 && converted.body?.data?.status === 'CONVERTED' && Boolean(converted.body?.data?.convertedCustomerId),
    message: `status=${converted.status} customer=${converted.body?.data?.convertedCustomerId}`
  });

  const customerId = converted.body?.data?.convertedCustomerId as string;
  const contact = await request(app).post('/api/v1/erp/contacts').set(ctx.header).send({
    customerId,
    fullName: 'Accounts Desk',
    roleTitle: 'Billing',
    phone: '9990002222'
  });
  results.push({
    testName: 'POST contact attaches to customer',
    passed: contact.status === 201 && contact.body?.data?.customerId === customerId,
    message: `status=${contact.status}`
  });

  const draftOrder = await request(app).post('/api/v1/erp/orders').set(ctx.header).send({
    orderNumber: uniqueCode('SO'),
    customerId,
    quarryId: quarry.body.data.id,
    taxAmount: 50,
    lines: [{ productId: product.body.data.id, quantity: 4, quantityUom: 'TON', unitPrice: 640 }]
  });
  results.push({
    testName: 'POST order stores quantity, pricing, and DRAFT status',
    passed:
      draftOrder.status === 201 &&
      draftOrder.body?.data?.status === 'DRAFT' &&
      draftOrder.body?.data?.subtotal === 2560 &&
      draftOrder.body?.data?.totalAmount === 2610 &&
      draftOrder.body?.data?.lines?.[0]?.quantity === 4,
    message: `status=${draftOrder.status} total=${draftOrder.body?.data?.totalAmount}`
  });

  const confirmNoStock = await request(app).post(`/api/v1/erp/orders/${draftOrder.body.data.id}/confirm`).set(ctx.header);
  results.push({
    testName: 'Confirm order without stock is rejected',
    passed: confirmNoStock.status === 409 && confirmNoStock.body?.error === 'INSUFFICIENT_STOCK',
    message: `status=${confirmNoStock.status} error=${confirmNoStock.body?.error}`
  });

  await request(app).post('/api/v1/erp/production/batches').set(ctx.header).send({
    quarryId: quarry.body.data.id,
    batchNumber: uniqueCode('BCRM'),
    productionDate: '2026-08-26',
    postImmediately: true,
    lines: [{ productId: product.body.data.id, quantity: 20, quantityUom: 'TON' }]
  });

  const stockBefore = await request(app)
    .get(`/api/v1/erp/stock/balances?quarryId=${quarry.body.data.id}`)
    .set(ctx.header);
  const qtyBefore = Array.isArray(stockBefore.body?.data)
    ? stockBefore.body.data.find((row: { productId: string }) => row.productId === product.body.data.id)?.quantity
    : undefined;

  const confirmed = await request(app).post(`/api/v1/erp/orders/${draftOrder.body.data.id}/confirm`).set(ctx.header);
  results.push({
    testName: 'Confirm order with stock does not consume inventory',
    passed: confirmed.status === 200 && confirmed.body?.data?.status === 'CONFIRMED',
    message: `status=${confirmed.status} orderStatus=${confirmed.body?.data?.status}`
  });

  const stockAfterConfirm = await request(app)
    .get(`/api/v1/erp/stock/balances?quarryId=${quarry.body.data.id}`)
    .set(ctx.header);
  const qtyAfterConfirm = Array.isArray(stockAfterConfirm.body?.data)
    ? stockAfterConfirm.body.data.find((row: { productId: string }) => row.productId === product.body.data.id)?.quantity
    : undefined;
  results.push({
    testName: 'Stock unchanged after order confirm',
    passed: qtyAfterConfirm === qtyBefore && qtyBefore === 20,
    message: `before=${qtyBefore} afterConfirm=${qtyAfterConfirm}`
  });

  const gpFromOrder = await request(app)
    .post(`/api/v1/erp/orders/${draftOrder.body.data.id}/gate-pass`)
    .set(ctx.header)
    .send({
      gatePassNumber: uniqueCode('GPO'),
      vehicleNumber: 'KA-19-CRM-01',
      driverName: 'Order Driver',
      destination: 'Site A'
    });
  results.push({
    testName: 'Confirmed order creates DRAFT gate pass without double stock move',
    passed: gpFromOrder.status === 201 && gpFromOrder.body?.data?.status === 'DRAFT' && gpFromOrder.body?.data?.orderId === draftOrder.body.data.id,
    message: `status=${gpFromOrder.status} gpStatus=${gpFromOrder.body?.data?.status}`
  });

  const duplicateGp = await request(app)
    .post(`/api/v1/erp/orders/${draftOrder.body.data.id}/gate-pass`)
    .set(ctx.header)
    .send({
      gatePassNumber: uniqueCode('GPO2'),
      vehicleNumber: 'KA-19-CRM-02',
      driverName: 'Order Driver'
    });
  results.push({
    testName: 'Second gate pass from the same order is rejected',
    passed: duplicateGp.status === 409 || duplicateGp.status === 400,
    message: `status=${duplicateGp.status} error=${duplicateGp.body?.error}`
  });

  await request(app).post(`/api/v1/erp/gate-passes/${gpFromOrder.body.data.id}/approve`).set(ctx.header);
  await request(app).post(`/api/v1/erp/gate-passes/${gpFromOrder.body.data.id}/issue`).set(ctx.header);
  const dispatch = await request(app).post('/api/v1/erp/dispatches').set(ctx.header).send({
    dispatchNumber: uniqueCode('DSPO'),
    gatePassId: gpFromOrder.body.data.id
  });

  const stockAfterDispatch = await request(app)
    .get(`/api/v1/erp/stock/balances?quarryId=${quarry.body.data.id}`)
    .set(ctx.header);
  const qtyAfterDispatch = Array.isArray(stockAfterDispatch.body?.data)
    ? stockAfterDispatch.body.data.find((row: { productId: string }) => row.productId === product.body.data.id)?.quantity
    : undefined;
  const orderAfter = await request(app).get(`/api/v1/erp/orders/${draftOrder.body.data.id}`).set(ctx.header);

  results.push({
    testName: 'Dispatch from order gate pass consumes stock once and marks order DISPATCHED',
    passed:
      dispatch.status === 201 &&
      qtyAfterDispatch === 16 &&
      orderAfter.body?.data?.status === 'DISPATCHED',
    message: `dispatch=${dispatch.status} qty=${qtyAfterDispatch} order=${orderAfter.body?.data?.status}`
  });

  const history = await request(app).get(`/api/v1/erp/customers/${customerId}/history`).set(ctx.header);
  results.push({
    testName: 'Customer history includes contacts, orders, and converted lead',
    passed:
      history.status === 200 &&
      history.body?.data?.customer?.id === customerId &&
      Array.isArray(history.body?.data?.contacts) &&
      history.body.data.contacts.length >= 1 &&
      Array.isArray(history.body?.data?.orders) &&
      history.body.data.orders.some((row: { id: string }) => row.id === draftOrder.body.data.id) &&
      history.body?.data?.convertedFromLead?.id === lead.body.data.id,
    message: `status=${history.status}`
  });

  const isolated = await request(app).get(`/api/v1/erp/orders/${draftOrder.body.data.id}`).set(other.header);
  results.push({
    testName: 'Other tenant cannot read order',
    passed: isolated.status === 404 || isolated.status === 403 || isolated.status === 401,
    message: `status=${isolated.status}`
  });

  const spoof = await request(app).post('/api/v1/erp/orders').set(ctx.header).send({
    tenantId: 'tenant-apex-quarry-002',
    orderNumber: uniqueCode('SOX'),
    customerId,
    quarryId: quarry.body.data.id,
    lines: [{ productId: product.body.data.id, quantity: 1, unitPrice: 10 }]
  });
  results.push({
    testName: 'Order create rejects client tenantId',
    passed: spoof.status === 400,
    message: `status=${spoof.status}`
  });

  const passedCount = results.filter((result) => result.passed).length;
  return { skipped: false, executedAt, totalTests: results.length, passedCount, failedCount: results.length - passedCount, results };
}
