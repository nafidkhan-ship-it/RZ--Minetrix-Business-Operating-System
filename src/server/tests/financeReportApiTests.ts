import request from 'supertest';
import { isPostgresEnabled } from '../db/postgresPool.js';
import { createErpTestApp, loginErpAdmin, loginOtherTenant, loginQuarryManager, uniqueCode } from './erpTestHarness.js';
import { ModuleTestResult } from './erpProductionApiTests.js';

export async function runFinanceReportApiTests() {
  const executedAt = new Date().toISOString();
  if (!isPostgresEnabled()) {
    return { skipped: true, skipReason: 'DATABASE_URL is not configured', executedAt, totalTests: 0, passedCount: 0, failedCount: 0, results: [] as ModuleTestResult[] };
  }

  const app = await createErpTestApp();
  const ctx = await loginErpAdmin(app);
  const other = await loginOtherTenant(app);
  const manager = await loginQuarryManager(app);
  const results: ModuleTestResult[] = [];

  const quarry = await request(app).post('/api/v1/erp/quarries').set(ctx.header).send({ code: uniqueCode('QFR'), name: 'Report Quarry' });
  const product = await request(app).post('/api/v1/erp/products').set(ctx.header).send({
    code: uniqueCode('PFR'),
    name: 'Report Stone',
    category: 'Crushed Aggregate',
    defaultUom: 'TON'
  });
  await request(app).post('/api/v1/erp/production/batches').set(ctx.header).send({
    quarryId: quarry.body.data.id,
    batchNumber: uniqueCode('BFRST'),
    productionDate: '2026-08-26',
    postImmediately: true,
    lines: [{ productId: product.body.data.id, quantity: 50, quantityUom: 'TON' }]
  });
  const customer = await request(app).post('/api/v1/erp/customers').set(ctx.header).send({
    code: uniqueCode('CFR'),
    name: 'Report Customer'
  });
  const order = await request(app).post('/api/v1/erp/orders').set(ctx.header).send({
    orderNumber: uniqueCode('OFR'),
    customerId: customer.body.data.id,
    quarryId: quarry.body.data.id,
    lines: [{ productId: product.body.data.id, quantity: 10, unitPrice: 640, quantityUom: 'TON' }]
  });
  await request(app).post(`/api/v1/erp/orders/${order.body.data.id}/confirm`).set(ctx.header);
  const orderTxn = await request(app)
    .post(`/api/v1/finance/transactions/from-order/${order.body.data.id}`)
    .set(ctx.header)
    .send({ transactionNumber: uniqueCode('RFTX') });
  results.push({
    testName: 'Order finance transaction for reports',
    passed: orderTxn.status === 201,
    message: `status=${orderTxn.status}`
  });

  const invoice = await request(app).post('/api/v1/finance/invoices').set(ctx.header).send({
    invoiceNumber: uniqueCode('RINV'),
    customerId: customer.body.data.id,
    orderId: order.body.data.id,
    invoiceDate: '2026-08-26',
    dueDate: '2026-09-26',
    issueImmediately: true,
    lines: [{ description: 'Aggregate 10 TON', quantity: 10, unitPrice: 640, taxPercent: 5 }]
  });

  const partialPay = await request(app).post('/api/v1/finance/payments').set(ctx.header).send({
    paymentNumber: uniqueCode('RPAY'),
    invoiceId: invoice.body.data.id,
    amount: 3000,
    paymentDate: '2026-08-26',
    paymentMethod: 'BANK_TRANSFER'
  });

  const expense = await request(app).post('/api/v1/finance/expenses').set(ctx.header).send({
    expenseNumber: uniqueCode('REXP'),
    category: 'Operations',
    amount: 1500,
    expenseDate: '2026-08-26'
  });
  await request(app).post(`/api/v1/finance/expenses/${expense.body.data.id}/submit`).set(ctx.header);
  await request(app).post(`/api/v1/finance/expenses/${expense.body.data.id}/approve`).set(ctx.header);

  const parcel = await request(app).post('/api/v1/erp/land-parcels').set(ctx.header).send({
    surveyNumber: uniqueCode('SYFR'),
    ownerName: 'Report Landowner'
  });
  await request(app).post('/api/v1/erp/settlement-rates').set(ctx.header).send({
    landParcelId: parcel.body.data.id,
    quarryId: quarry.body.data.id,
    ratePerUom: 80,
    quantityUom: 'TON',
    effectiveFrom: '2026-01-01'
  });
  const batch = await request(app).post('/api/v1/erp/production/batches').set(ctx.header).send({
    quarryId: quarry.body.data.id,
    batchNumber: uniqueCode('BFR'),
    productionDate: '2026-08-26',
    postImmediately: true,
    lines: [{ productId: product.body.data.id, quantity: 5, quantityUom: 'TON' }]
  });
  const settlement = await request(app).post('/api/v1/erp/settlements').set(ctx.header).send({
    settlementNumber: uniqueCode('STFR'),
    landParcelId: parcel.body.data.id,
    quarryId: quarry.body.data.id,
    basis: 'PRODUCTION',
    productionBatchId: batch.body.data.id,
    deductions: 10
  });
  await request(app)
    .post(`/api/v1/finance/transactions/from-settlement/${settlement.body.data.id}`)
    .set(ctx.header)
    .send({ transactionNumber: uniqueCode('SFTX') });

  const sales = await request(app).get('/api/v1/finance/reports/sales-summary?fromDate=2026-08-01&toDate=2026-08-31').set(ctx.header);
  results.push({
    testName: 'Sales summary report with date filter',
    passed: sales.status === 200 && sales.body?.data?.totalSalesAmount >= order.body.data.totalAmount,
    message: `status=${sales.status} total=${sales.body?.data?.totalSalesAmount}`
  });

  const invoiceReport = await request(app).get('/api/v1/finance/reports/invoice-summary').set(ctx.header);
  results.push({
    testName: 'Invoice summary authoritative totals',
    passed: invoiceReport.status === 200 && invoiceReport.body?.data?.invoiceCount >= 1 && invoiceReport.body?.data?.totalGrand >= invoice.body.data.grandTotal,
    message: `status=${invoiceReport.status} grand=${invoiceReport.body?.data?.totalGrand}`
  });

  const receivables = await request(app).get('/api/v1/finance/reports/receivables').set(ctx.header);
  const outstanding = receivables.body?.data?.receivables?.find((r: { invoiceId: string }) => r.invoiceId === invoice.body.data.id);
  results.push({
    testName: 'Receivables report outstanding balance',
    passed: receivables.status === 200 && outstanding && outstanding.outstandingAmount > 0,
    message: `status=${receivables.status} outstanding=${outstanding?.outstandingAmount}`
  });

  const payments = await request(app).get('/api/v1/finance/reports/payments-summary').set(ctx.header);
  results.push({
    testName: 'Payments summary report',
    passed: payments.status === 200 && payments.body?.data?.totalPayments >= partialPay.body.data.amount,
    message: `status=${payments.status} total=${payments.body?.data?.totalPayments}`
  });

  const expensesReport = await request(app).get('/api/v1/finance/reports/expenses-summary').set(ctx.header);
  results.push({
    testName: 'Expenses summary report',
    passed: expensesReport.status === 200 && expensesReport.body?.data?.approvedExpenses >= 1500,
    message: `status=${expensesReport.status} approved=${expensesReport.body?.data?.approvedExpenses}`
  });

  const cashFlow = await request(app).get('/api/v1/finance/reports/cash-flow?fromDate=2026-08-01&toDate=2026-08-31').set(ctx.header);
  results.push({
    testName: 'Cash flow report',
    passed: cashFlow.status === 200 && cashFlow.body?.data?.cashIn >= 3000 && cashFlow.body?.data?.cashOut >= 1500,
    message: `status=${cashFlow.status} in=${cashFlow.body?.data?.cashIn} out=${cashFlow.body?.data?.cashOut}`
  });

  const txnSummary = await request(app).get('/api/v1/finance/reports/transaction-summary').set(ctx.header);
  results.push({
    testName: 'Transaction summary report',
    passed: txnSummary.status === 200 && txnSummary.body?.data?.transactionCount >= 2,
    message: `status=${txnSummary.status} count=${txnSummary.body?.data?.transactionCount}`
  });

  const settlementReport = await request(app).get('/api/v1/finance/reports/settlement-summary').set(ctx.header);
  results.push({
    testName: 'Settlement financial summary',
    passed: settlementReport.status === 200 && settlementReport.body?.data?.settlementFinanceCount >= 1,
    message: `status=${settlementReport.status} count=${settlementReport.body?.data?.settlementFinanceCount}`
  });

  const emptyRange = await request(app).get('/api/v1/finance/reports/sales-summary?fromDate=2099-01-01&toDate=2099-01-31').set(ctx.header);
  results.push({
    testName: 'Empty date range handling',
    passed: emptyRange.status === 200 && emptyRange.body?.data?.transactionCount === 0,
    message: `status=${emptyRange.status} count=${emptyRange.body?.data?.transactionCount}`
  });

  const noAuth = await request(app).get('/api/v1/finance/reports/sales-summary');
  results.push({
    testName: 'Unauthorized finance report blocked',
    passed: noAuth.status === 401,
    message: `status=${noAuth.status}`
  });

  const otherTenant = await request(app).get('/api/v1/finance/reports/sales-summary').set(other.header);
  results.push({
    testName: 'Cross-tenant finance report isolation',
    passed: otherTenant.status === 403,
    message: `status=${otherTenant.status}`
  });

  const managerDenied = await request(app).get('/api/v1/finance/reports/receivables').set(manager.header);
  results.push({
    testName: 'RBAC blocks quarry manager from finance reports',
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
