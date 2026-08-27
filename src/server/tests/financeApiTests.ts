import request from 'supertest';
import { isPostgresEnabled } from '../db/postgresPool.js';
import { calculateInvoiceTotals } from '../db/finance/financeTypes.js';
import { createErpTestApp, loginErpAdmin, loginOtherTenant, loginQuarryManager, uniqueCode } from './erpTestHarness.js';
import { ModuleTestResult } from './erpProductionApiTests.js';

export async function runFinanceApiTests() {
  const executedAt = new Date().toISOString();
  if (!isPostgresEnabled()) {
    return { skipped: true, skipReason: 'DATABASE_URL is not configured', executedAt, totalTests: 0, passedCount: 0, failedCount: 0, results: [] as ModuleTestResult[] };
  }

  const app = await createErpTestApp();
  const ctx = await loginErpAdmin(app);
  const other = await loginOtherTenant(app);
  const manager = await loginQuarryManager(app);
  const results: ModuleTestResult[] = [];

  const totals = calculateInvoiceTotals([{ description: 'Aggregate', quantity: 10, unitPrice: 640, taxPercent: 5 }]);
  results.push({
    testName: 'Invoice totals calculated server-side',
    passed: totals.subtotal === 6400 && totals.taxAmount === 320 && totals.grandTotal === 6720,
    message: `subtotal=${totals.subtotal} tax=${totals.taxAmount} total=${totals.grandTotal}`
  });

  const account = await request(app).post('/api/v1/finance/accounts').set(ctx.header).send({
    code: uniqueCode('ACC'),
    name: 'Test Cash Account',
    category: 'ASSET'
  });
  results.push({
    testName: 'Finance account creation',
    passed: account.status === 201 && account.body?.data?.category === 'ASSET',
    message: `status=${account.status}`
  });

  const quarry = await request(app).post('/api/v1/erp/quarries').set(ctx.header).send({ code: uniqueCode('QFN'), name: 'Finance Quarry' });
  const product = await request(app).post('/api/v1/erp/products').set(ctx.header).send({
    code: uniqueCode('PFN'),
    name: 'Finance Stone',
    category: 'Crushed Aggregate',
    defaultUom: 'TON'
  });
  const batch = await request(app).post('/api/v1/erp/production/batches').set(ctx.header).send({
    quarryId: quarry.body.data.id,
    batchNumber: uniqueCode('BFN'),
    productionDate: '2026-08-26',
    postImmediately: true,
    lines: [{ productId: product.body.data.id, quantity: 10, quantityUom: 'TON' }]
  });
  const parcel = await request(app).post('/api/v1/erp/land-parcels').set(ctx.header).send({
    surveyNumber: uniqueCode('SYFN'),
    ownerName: 'Finance Landowner'
  });
  await request(app).post('/api/v1/erp/settlement-rates').set(ctx.header).send({
    landParcelId: parcel.body.data.id,
    quarryId: quarry.body.data.id,
    ratePerUom: 80,
    quantityUom: 'TON',
    effectiveFrom: '2026-01-01'
  });
  const settlement = await request(app).post('/api/v1/erp/settlements').set(ctx.header).send({
    settlementNumber: uniqueCode('STFN'),
    landParcelId: parcel.body.data.id,
    quarryId: quarry.body.data.id,
    basis: 'PRODUCTION',
    productionBatchId: batch.body.data.id,
    deductions: 20
  });

  const finTxn = await request(app)
    .post(`/api/v1/finance/transactions/from-settlement/${settlement.body.data.id}`)
    .set(ctx.header)
    .send({ transactionNumber: uniqueCode('FTX') });
  results.push({
    testName: 'ERP settlement → finance transaction reference',
    passed:
      finTxn.status === 201 &&
      finTxn.body?.data?.settlementId === settlement.body.data.id &&
      finTxn.body?.data?.amount === settlement.body.data.netAmount &&
      Boolean(finTxn.body?.data?.journalId),
    message: `status=${finTxn.status} amount=${finTxn.body?.data?.amount}`
  });

  const dupTxn = await request(app)
    .post(`/api/v1/finance/transactions/from-settlement/${settlement.body.data.id}`)
    .set(ctx.header)
    .send({ transactionNumber: uniqueCode('FTXDUP') });
  results.push({
    testName: 'Duplicate finance transaction prevention',
    passed: dupTxn.status === 409 && dupTxn.body?.error === 'DUPLICATE_TRANSACTION',
    message: `status=${dupTxn.status}`
  });

  const customer = await request(app).post('/api/v1/erp/customers').set(ctx.header).send({
    code: uniqueCode('CFN'),
    name: 'Finance Customer'
  });
  const order = await request(app).post('/api/v1/erp/orders').set(ctx.header).send({
    orderNumber: uniqueCode('OFN'),
    customerId: customer.body.data.id,
    quarryId: quarry.body.data.id,
    lines: [{ productId: product.body.data.id, quantity: 5, unitPrice: 640, quantityUom: 'TON' }]
  });
  await request(app).post(`/api/v1/erp/orders/${order.body.data.id}/confirm`).set(ctx.header);
  const orderTxn = await request(app)
    .post(`/api/v1/finance/transactions/from-order/${order.body.data.id}`)
    .set(ctx.header)
    .send({ transactionNumber: uniqueCode('OTX') });
  results.push({
    testName: 'Order reference finance transaction',
    passed: orderTxn.status === 201 && orderTxn.body?.data?.orderId === order.body.data.id,
    message: `status=${orderTxn.status}`
  });

  const journal = await request(app).get(`/api/v1/finance/journals/${finTxn.body.data.journalId}`).set(ctx.header);
  const debitTotal = journal.body?.data?.entries?.filter((e: { entryType: string }) => e.entryType === 'DEBIT').reduce((s: number, e: { amount: number }) => s + e.amount, 0);
  const creditTotal = journal.body?.data?.entries?.filter((e: { entryType: string }) => e.entryType === 'CREDIT').reduce((s: number, e: { amount: number }) => s + e.amount, 0);
  results.push({
    testName: 'Journal debit/credit integrity',
    passed: journal.status === 200 && debitTotal === creditTotal && debitTotal === finTxn.body.data.amount,
    message: `debit=${debitTotal} credit=${creditTotal}`
  });

  const invoice = await request(app).post('/api/v1/finance/invoices').set(ctx.header).send({
    invoiceNumber: uniqueCode('INV'),
    customerId: customer.body.data.id,
    orderId: order.body.data.id,
    invoiceDate: '2026-08-26',
    dueDate: '2026-09-26',
    issueImmediately: true,
    lines: [{ description: 'Aggregate 5 TON', quantity: 5, unitPrice: 640, taxPercent: 5 }]
  });
  results.push({
    testName: 'Invoice creation with server totals',
    passed: invoice.status === 201 && invoice.body?.data?.grandTotal === 3360 && invoice.body?.data?.status === 'ISSUED',
    message: `status=${invoice.status} total=${invoice.body?.data?.grandTotal}`
  });

  const dupInvoice = await request(app).post('/api/v1/finance/invoices').set(ctx.header).send({
    invoiceNumber: uniqueCode('INVDUP'),
    customerId: customer.body.data.id,
    orderId: order.body.data.id,
    invoiceDate: '2026-08-26',
    dueDate: '2026-09-26',
    lines: [{ description: 'Dup', quantity: 1, unitPrice: 100 }]
  });
  results.push({
    testName: 'Duplicate invoice for same order rejected',
    passed: dupInvoice.status === 409 && dupInvoice.body?.error === 'DUPLICATE_INVOICE',
    message: `status=${dupInvoice.status}`
  });

  const partialPay = await request(app).post('/api/v1/finance/payments').set(ctx.header).send({
    paymentNumber: uniqueCode('PAY1'),
    invoiceId: invoice.body.data.id,
    amount: 1000,
    paymentDate: '2026-08-27',
    paymentMethod: 'BANK_TRANSFER',
    paymentReference: uniqueCode('REF')
  });
  results.push({
    testName: 'Partial payment updates invoice status',
    passed: partialPay.status === 201,
    message: `status=${partialPay.status}`
  });

  const invoiceAfterPartial = await request(app).get(`/api/v1/finance/invoices/${invoice.body.data.id}`).set(ctx.header);
  results.push({
    testName: 'Outstanding amount after partial payment',
    passed: invoiceAfterPartial.body?.data?.status === 'PARTIALLY_PAID' && invoiceAfterPartial.body?.data?.outstandingAmount === 2360,
    message: `status=${invoiceAfterPartial.body?.data?.status} outstanding=${invoiceAfterPartial.body?.data?.outstandingAmount}`
  });

  const fullPay = await request(app).post('/api/v1/finance/payments').set(ctx.header).send({
    paymentNumber: uniqueCode('PAY2'),
    invoiceId: invoice.body.data.id,
    amount: 2360,
    paymentDate: '2026-08-28',
    paymentMethod: 'UPI',
    paymentReference: uniqueCode('REF2')
  });
  const invoicePaid = await request(app).get(`/api/v1/finance/invoices/${invoice.body.data.id}`).set(ctx.header);
  results.push({
    testName: 'Full payment marks invoice PAID',
    passed: fullPay.status === 201 && invoicePaid.body?.data?.status === 'PAID' && invoicePaid.body?.data?.outstandingAmount === 0,
    message: `status=${invoicePaid.body?.data?.status}`
  });

  const overpay = await request(app).post('/api/v1/finance/payments').set(ctx.header).send({
    paymentNumber: uniqueCode('PAY3'),
    invoiceId: invoice.body.data.id,
    amount: 1,
    paymentDate: '2026-08-29',
    paymentMethod: 'CASH'
  });
  results.push({
    testName: 'Overpayment rejected',
    passed: overpay.status === 400 && overpay.body?.error === 'OVERPAYMENT',
    message: `status=${overpay.status}`
  });

  const expense = await request(app).post('/api/v1/finance/expenses').set(ctx.header).send({
    expenseNumber: uniqueCode('EXP'),
    category: 'FUEL',
    amount: 500,
    expenseDate: '2026-08-26',
    vendorName: 'Fuel Vendor'
  });
  const submit = await request(app).post(`/api/v1/finance/expenses/${expense.body.data.id}/submit`).set(ctx.header);
  const approve = await request(app).post(`/api/v1/finance/expenses/${expense.body.data.id}/approve`).set(ctx.header);
  results.push({
    testName: 'Expense submit and approve workflow',
    passed: expense.status === 201 && submit.body?.data?.approvalStatus === 'SUBMITTED' && approve.body?.data?.approvalStatus === 'APPROVED',
    message: `expense=${expense.status} approve=${approve.body?.data?.approvalStatus}`
  });

  const noAuth = await request(app).get('/api/v1/finance/transactions');
  results.push({
    testName: 'Unauthorized finance access blocked',
    passed: noAuth.status === 401,
    message: `status=${noAuth.status}`
  });

  const otherTxn = await request(app).get(`/api/v1/finance/transactions/${finTxn.body.data.id}`).set(other.header);
  results.push({
    testName: 'Finance tenant isolation',
    passed: otherTxn.status === 404,
    message: `status=${otherTxn.status}`
  });

  const managerDenied = await request(app).get('/api/v1/finance/transactions').set(manager.header);
  results.push({
    testName: 'RBAC blocks quarry manager from finance',
    passed: managerDenied.status === 403,
    message: `status=${managerDenied.status}`
  });

  const passedCount = results.filter((r) => r.passed).length;
  return {
    executedAt,
    totalTests: results.length,
    passedCount,
    failedCount: results.length - passedCount,
    results
  };
}
