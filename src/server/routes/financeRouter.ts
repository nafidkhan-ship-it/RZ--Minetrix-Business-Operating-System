/**
 * RZ® Minetrix BOS - Enterprise Finance, Accounting & Financial Control Suite Router (Phase 21)
 */

import { Router, Request, Response } from 'express';
import { financeService } from '../services/financeServices.ts';

export const financeRouter = Router();

function getTenantId(req: Request): string {
  return (req as any).tenantContext?.tenantId || (req as any).user?.tenantId || 'tenant-rz-global-001';
}

function getUserId(req: Request): string {
  return (req as any).user?.id || 'usr-admin-001';
}

// 1. Dashboard Metrics
financeRouter.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const metrics = await financeService.getDashboardMetrics(tenantId);
    res.json({ success: true, data: metrics });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Chart of Accounts
financeRouter.get('/accounts', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const accounts = await financeService.getChartOfAccounts(tenantId);
    res.json({ success: true, data: accounts });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

financeRouter.get('/accounts/:id', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const account = await financeService.getAccountById(tenantId, req.params.id);
    if (!account) return res.status(404).json({ success: false, error: 'Account not found' });
    res.json({ success: true, data: account });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

financeRouter.post('/accounts', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const userId = getUserId(req);
    const account = await financeService.createAccount(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: account });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

financeRouter.put('/accounts/:id', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const userId = getUserId(req);
    const account = await financeService.updateAccount(tenantId, userId, req.params.id, req.body);
    res.json({ success: true, data: account });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 3. Fiscal Years & Periods
financeRouter.get('/fiscal-years', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const years = await financeService.getFiscalYears(tenantId);
    res.json({ success: true, data: years });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

financeRouter.get('/fiscal-periods', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const periods = await financeService.getFiscalPeriods(tenantId, req.query.fiscalYearId as string);
    res.json({ success: true, data: periods });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

financeRouter.post('/fiscal-periods/:id/close', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const userId = getUserId(req);
    const period = await financeService.closeFiscalPeriod(tenantId, userId, req.params.id);
    res.json({ success: true, data: period });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

financeRouter.post('/fiscal-periods/:id/reopen', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const userId = getUserId(req);
    const period = await financeService.reopenFiscalPeriod(tenantId, userId, req.params.id);
    res.json({ success: true, data: period });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 4. Journals & Posting Engine
financeRouter.get('/journals', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const journals = await financeService.getJournals(tenantId);
    res.json({ success: true, data: journals });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

financeRouter.get('/journals/:id', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const details = await financeService.getJournalDetails(tenantId, req.params.id);
    res.json({ success: true, data: details });
  } catch (err: any) {
    res.status(404).json({ success: false, error: err.message });
  }
});

financeRouter.post('/journals', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const userId = getUserId(req);
    const journal = await financeService.createJournal(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: journal });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

financeRouter.post('/journals/:id/post', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const userId = getUserId(req);
    const journal = await financeService.postJournal(tenantId, userId, req.params.id);
    res.json({ success: true, data: journal });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

financeRouter.post('/journals/:id/reverse', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const userId = getUserId(req);
    const { reason } = req.body || {};
    const reversedJournal = await financeService.reverseJournal(tenantId, userId, req.params.id, reason || 'Requested reversal');
    res.json({ success: true, data: reversedJournal });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 5. Accounts Receivable (Invoices & Payments)
financeRouter.get('/invoices', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const invoices = await financeService.getInvoices(tenantId);
    res.json({ success: true, data: invoices });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

financeRouter.post('/invoices', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const userId = getUserId(req);
    const invoice = await financeService.createCustomerInvoice(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: invoice });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

financeRouter.post('/payments', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const userId = getUserId(req);
    const payment = await financeService.recordCustomerPayment(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: payment });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

financeRouter.post('/payments/:id/allocate', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const userId = getUserId(req);
    const { invoiceId, allocatedAmount } = req.body || {};
    const alloc = await financeService.allocatePaymentToInvoice(tenantId, userId, req.params.id, invoiceId, Number(allocatedAmount));
    res.json({ success: true, data: alloc });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 6. Accounts Payable (Bills)
financeRouter.get('/bills', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const bills = await financeService.getSupplierBills(tenantId);
    res.json({ success: true, data: bills });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

financeRouter.post('/bills', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const userId = getUserId(req);
    const bill = await financeService.createSupplierBill(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: bill });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 7. Expenses
financeRouter.get('/expenses', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const expenses = await financeService.getExpenses(tenantId);
    res.json({ success: true, data: expenses });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

financeRouter.post('/expenses', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const userId = getUserId(req);
    const expense = await financeService.recordExpense(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: expense });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 8. Bank Management & Reconciliation
financeRouter.get('/bank-accounts', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const accounts = await financeService.getBankAccounts(tenantId);
    res.json({ success: true, data: accounts });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

financeRouter.get('/bank-transactions', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const txs = await financeService.getBankTransactions(tenantId, req.query.bankAccountId as string);
    res.json({ success: true, data: txs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

financeRouter.post('/bank-reconciliation', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const userId = getUserId(req);
    const rec = await financeService.reconcileBankStatement(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: rec });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 9. Reports Engine
financeRouter.get('/reports/general-ledger', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const report = await financeService.getGeneralLedgerReport(
      tenantId,
      req.query.accountId as string,
      req.query.startDate as string,
      req.query.endDate as string
    );
    res.json({ success: true, data: report });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

financeRouter.get('/reports/trial-balance', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const report = await financeService.getTrialBalanceReport(tenantId, req.query.asOfDate as string);
    res.json({ success: true, data: report });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

financeRouter.get('/reports/profit-loss', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const report = await financeService.getProfitAndLossReport(
      tenantId,
      req.query.startDate as string,
      req.query.endDate as string
    );
    res.json({ success: true, data: report });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

financeRouter.get('/reports/balance-sheet', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const report = await financeService.getBalanceSheetReport(tenantId, req.query.asOfDate as string);
    res.json({ success: true, data: report });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

financeRouter.get('/reports/aging', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const type = (req.query.type as string)?.toUpperCase() === 'AP' ? 'AP' : 'AR';
    const report = await financeService.getAgingReport(tenantId, type);
    res.json({ success: true, data: report });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
