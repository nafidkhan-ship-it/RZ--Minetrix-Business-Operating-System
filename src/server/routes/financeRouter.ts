import { Router, Response } from 'express';
import {
  authenticateJwt,
  enforceTenantContext,
  requirePermission,
  CustomRequest
} from '../middleware/authMiddleware.js';
import { rejectClientTenantId, validateResourceIdParam } from '../middleware/inputValidation.js';
import {
  validateCreateAccountBody,
  validateCreateExpenseBody,
  validateCreateFinanceTransactionBody,
  validateCreateInvoiceBody,
  validateCreatePaymentBody
} from '../middleware/financeValidation.js';
import { FinanceService } from '../services/financeService.js';
import { ErpServiceError } from '../services/erpErrors.js';

export const financeRouter = Router();
const finance = new FinanceService();

function handleFinanceError(error: unknown, res: Response) {
  if (error instanceof ErpServiceError) {
    return res.status(error.statusCode).json({ success: false, error: error.code, message: error.message });
  }
  console.error('[Finance API]', error instanceof Error ? error.message : 'Unknown error');
  return res.status(500).json({ success: false, error: 'INTERNAL_SERVER_ERROR', message: 'An internal server error occurred.' });
}

const viewFinance = [authenticateJwt, enforceTenantContext, requirePermission('finance:transaction:view')] as const;
const writeFinance = [authenticateJwt, rejectClientTenantId, enforceTenantContext, requirePermission('finance:transaction:create')] as const;
const viewInvoice = [authenticateJwt, enforceTenantContext, requirePermission('finance:invoice:view')] as const;
const writeInvoice = [authenticateJwt, rejectClientTenantId, enforceTenantContext, requirePermission('finance:invoice:create')] as const;
const writePayment = [authenticateJwt, rejectClientTenantId, enforceTenantContext, requirePermission('finance:payment:create')] as const;
const viewExpense = [authenticateJwt, enforceTenantContext, requirePermission('finance:expense:view')] as const;
const writeExpense = [authenticateJwt, rejectClientTenantId, enforceTenantContext, requirePermission('finance:expense:create')] as const;
const approveExpense = [authenticateJwt, enforceTenantContext, requirePermission('finance:expense:approve')] as const;
const viewReports = [authenticateJwt, enforceTenantContext, requirePermission('finance:report:view')] as const;

function parseDateRangeQuery(req: CustomRequest) {
  const fromDate = typeof req.query.fromDate === 'string' ? req.query.fromDate : undefined;
  const toDate = typeof req.query.toDate === 'string' ? req.query.toDate : undefined;
  return { fromDate, toDate };
}

financeRouter.get('/accounts', ...viewFinance, async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await finance.listAccounts(req.user!.tenantId) });
  } catch (error) {
    return handleFinanceError(error, res);
  }
});

financeRouter.post('/accounts', ...writeFinance, validateCreateAccountBody, async (req: CustomRequest, res: Response) => {
  try {
    const account = await finance.createAccount(req.user!.tenantId, req.body);
    return res.status(201).json({ success: true, data: account });
  } catch (error) {
    return handleFinanceError(error, res);
  }
});

financeRouter.get('/transactions', ...viewFinance, async (req: CustomRequest, res: Response) => {
  try {
    const customerId = typeof req.query.customerId === 'string' ? req.query.customerId : undefined;
    const orderId = typeof req.query.orderId === 'string' ? req.query.orderId : undefined;
    const sourceModule = typeof req.query.sourceModule === 'string' ? req.query.sourceModule : undefined;
    return res.json({
      success: true,
      data: await finance.listTransactions(req.user!.tenantId, { customerId, orderId, sourceModule })
    });
  } catch (error) {
    return handleFinanceError(error, res);
  }
});

financeRouter.get('/transactions/:id', ...viewFinance, validateResourceIdParam('id'), async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await finance.getTransaction(req.user!.tenantId, req.params.id) });
  } catch (error) {
    return handleFinanceError(error, res);
  }
});

financeRouter.post('/transactions/from-settlement/:settlementId', ...writeFinance, validateResourceIdParam('settlementId'), validateCreateFinanceTransactionBody, async (req: CustomRequest, res: Response) => {
  try {
    const txn = await finance.createTransactionFromSettlement(req.user!.tenantId, {
      settlementId: req.params.settlementId,
      transactionNumber: req.body.transactionNumber,
      createdBy: req.user!.userId
    });
    return res.status(201).json({ success: true, data: txn });
  } catch (error) {
    return handleFinanceError(error, res);
  }
});

financeRouter.post('/transactions/from-order/:orderId', ...writeFinance, validateResourceIdParam('orderId'), validateCreateFinanceTransactionBody, async (req: CustomRequest, res: Response) => {
  try {
    const txn = await finance.createTransactionFromOrder(req.user!.tenantId, {
      orderId: req.params.orderId,
      transactionNumber: req.body.transactionNumber,
      createdBy: req.user!.userId
    });
    return res.status(201).json({ success: true, data: txn });
  } catch (error) {
    return handleFinanceError(error, res);
  }
});

financeRouter.post('/transactions/from-dispatch/:dispatchId', ...writeFinance, validateResourceIdParam('dispatchId'), validateCreateFinanceTransactionBody, async (req: CustomRequest, res: Response) => {
  try {
    const txn = await finance.createTransactionFromDispatch(req.user!.tenantId, {
      dispatchId: req.params.dispatchId,
      transactionNumber: req.body.transactionNumber,
      createdBy: req.user!.userId
    });
    return res.status(201).json({ success: true, data: txn });
  } catch (error) {
    return handleFinanceError(error, res);
  }
});

financeRouter.get('/journals/:id', ...viewFinance, validateResourceIdParam('id'), async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await finance.getJournal(req.user!.tenantId, req.params.id) });
  } catch (error) {
    return handleFinanceError(error, res);
  }
});

financeRouter.get('/invoices', ...viewInvoice, async (req: CustomRequest, res: Response) => {
  try {
    const customerId = typeof req.query.customerId === 'string' ? req.query.customerId : undefined;
    return res.json({ success: true, data: await finance.listInvoices(req.user!.tenantId, customerId) });
  } catch (error) {
    return handleFinanceError(error, res);
  }
});

financeRouter.post('/invoices', ...writeInvoice, validateCreateInvoiceBody, async (req: CustomRequest, res: Response) => {
  try {
    const invoice = await finance.createInvoice(req.user!.tenantId, { ...req.body, createdBy: req.user!.userId });
    return res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    return handleFinanceError(error, res);
  }
});

financeRouter.get('/invoices/:id', ...viewInvoice, validateResourceIdParam('id'), async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await finance.getInvoice(req.user!.tenantId, req.params.id) });
  } catch (error) {
    return handleFinanceError(error, res);
  }
});

financeRouter.post('/invoices/:id/issue', ...writeInvoice, validateResourceIdParam('id'), async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await finance.issueInvoice(req.user!.tenantId, req.params.id) });
  } catch (error) {
    return handleFinanceError(error, res);
  }
});

financeRouter.get('/payments', ...viewInvoice, async (req: CustomRequest, res: Response) => {
  try {
    const invoiceId = typeof req.query.invoiceId === 'string' ? req.query.invoiceId : undefined;
    return res.json({ success: true, data: await finance.listPayments(req.user!.tenantId, invoiceId) });
  } catch (error) {
    return handleFinanceError(error, res);
  }
});

financeRouter.post('/payments', ...writePayment, validateCreatePaymentBody, async (req: CustomRequest, res: Response) => {
  try {
    const payment = await finance.createPayment(req.user!.tenantId, { ...req.body, createdBy: req.user!.userId });
    return res.status(201).json({ success: true, data: payment });
  } catch (error) {
    return handleFinanceError(error, res);
  }
});

financeRouter.get('/expenses', ...viewExpense, async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await finance.listExpenses(req.user!.tenantId) });
  } catch (error) {
    return handleFinanceError(error, res);
  }
});

financeRouter.post('/expenses', ...writeExpense, validateCreateExpenseBody, async (req: CustomRequest, res: Response) => {
  try {
    const expense = await finance.createExpense(req.user!.tenantId, { ...req.body, createdBy: req.user!.userId });
    return res.status(201).json({ success: true, data: expense });
  } catch (error) {
    return handleFinanceError(error, res);
  }
});

financeRouter.post('/expenses/:id/submit', ...writeExpense, validateResourceIdParam('id'), async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await finance.transitionExpense(req.user!.tenantId, req.params.id, 'SUBMITTED', req.user!.userId) });
  } catch (error) {
    return handleFinanceError(error, res);
  }
});

financeRouter.post('/expenses/:id/approve', ...approveExpense, validateResourceIdParam('id'), async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await finance.transitionExpense(req.user!.tenantId, req.params.id, 'APPROVED', req.user!.userId) });
  } catch (error) {
    return handleFinanceError(error, res);
  }
});

financeRouter.post('/expenses/:id/reject', ...approveExpense, validateResourceIdParam('id'), async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await finance.transitionExpense(req.user!.tenantId, req.params.id, 'REJECTED', req.user!.userId) });
  } catch (error) {
    return handleFinanceError(error, res);
  }
});

financeRouter.get('/reports/sales-summary', ...viewReports, async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await finance.salesSummaryReport(req.user!.tenantId, parseDateRangeQuery(req)) });
  } catch (error) {
    return handleFinanceError(error, res);
  }
});

financeRouter.get('/reports/invoice-summary', ...viewReports, async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await finance.invoiceSummaryReport(req.user!.tenantId, parseDateRangeQuery(req)) });
  } catch (error) {
    return handleFinanceError(error, res);
  }
});

financeRouter.get('/reports/receivables', ...viewReports, async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await finance.receivablesReport(req.user!.tenantId, parseDateRangeQuery(req)) });
  } catch (error) {
    return handleFinanceError(error, res);
  }
});

financeRouter.get('/reports/payments-summary', ...viewReports, async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await finance.paymentsSummaryReport(req.user!.tenantId, parseDateRangeQuery(req)) });
  } catch (error) {
    return handleFinanceError(error, res);
  }
});

financeRouter.get('/reports/outstanding-balances', ...viewReports, async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await finance.outstandingBalancesReport(req.user!.tenantId) });
  } catch (error) {
    return handleFinanceError(error, res);
  }
});

financeRouter.get('/reports/expenses-summary', ...viewReports, async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await finance.expensesSummaryReport(req.user!.tenantId, parseDateRangeQuery(req)) });
  } catch (error) {
    return handleFinanceError(error, res);
  }
});

financeRouter.get('/reports/income-expense-summary', ...viewReports, async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await finance.incomeExpenseSummaryReport(req.user!.tenantId, parseDateRangeQuery(req)) });
  } catch (error) {
    return handleFinanceError(error, res);
  }
});

financeRouter.get('/reports/cash-flow', ...viewReports, async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await finance.cashFlowReport(req.user!.tenantId, parseDateRangeQuery(req)) });
  } catch (error) {
    return handleFinanceError(error, res);
  }
});

financeRouter.get('/reports/transaction-summary', ...viewReports, async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await finance.transactionSummaryReport(req.user!.tenantId, parseDateRangeQuery(req)) });
  } catch (error) {
    return handleFinanceError(error, res);
  }
});

financeRouter.get('/reports/settlement-summary', ...viewReports, async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await finance.settlementFinancialSummaryReport(req.user!.tenantId, parseDateRangeQuery(req)) });
  } catch (error) {
    return handleFinanceError(error, res);
  }
});
