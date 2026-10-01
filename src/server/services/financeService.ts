import { FinanceRepository } from '../repositories/financeRepository.js';
import { FinanceReportRepository } from '../repositories/financeReportRepository.js';
import { ErpServiceError } from './erpErrors.js';

export class FinanceService {
  private repo = new FinanceRepository();
  private reportRepo = new FinanceReportRepository();

  createAccount(tenantId: string, input: Parameters<FinanceRepository['createAccount']>[1]) {
    return this.repo.createAccount(tenantId, input);
  }

  listAccounts(tenantId: string) {
    return this.repo.listAccounts(tenantId);
  }

  async createTransactionFromSettlement(tenantId: string, input: { settlementId: string; transactionNumber: string; createdBy?: string }) {
    return this.repo.createTransactionFromSettlement(tenantId, input);
  }

  async createTransactionFromOrder(tenantId: string, input: { orderId: string; transactionNumber: string; createdBy?: string }) {
    return this.repo.createTransactionFromOrder(tenantId, input);
  }

  async createTransactionFromDispatch(tenantId: string, input: { dispatchId: string; transactionNumber: string; createdBy?: string }) {
    return this.repo.createTransactionFromDispatch(tenantId, input);
  }

  listTransactions(tenantId: string, filters?: Parameters<FinanceRepository['listTransactions']>[1]) {
    return this.repo.listTransactions(tenantId, filters);
  }

  async getTransaction(tenantId: string, id: string) {
    const txn = await this.repo.getTransaction(tenantId, id);
    if (!txn) throw new ErpServiceError('NOT_FOUND', 'Finance transaction not found.', 404);
    return txn;
  }

  createInvoice(tenantId: string, input: Parameters<FinanceRepository['createInvoice']>[1]) {
    return this.repo.createInvoice(tenantId, input);
  }

  issueInvoice(tenantId: string, invoiceId: string) {
    return this.repo.issueInvoice(tenantId, invoiceId);
  }

  listInvoices(tenantId: string, customerId?: string) {
    return this.repo.listInvoices(tenantId, customerId);
  }

  async getInvoice(tenantId: string, id: string) {
    const invoice = await this.repo.getInvoice(tenantId, id);
    if (!invoice) throw new ErpServiceError('NOT_FOUND', 'Invoice not found.', 404);
    return invoice;
  }

  createPayment(tenantId: string, input: Parameters<FinanceRepository['createPayment']>[1]) {
    return this.repo.createPayment(tenantId, input);
  }

  listPayments(tenantId: string, invoiceId?: string) {
    return this.repo.listPayments(tenantId, invoiceId);
  }

  createExpense(tenantId: string, input: Parameters<FinanceRepository['createExpense']>[1]) {
    return this.repo.createExpense(tenantId, input);
  }

  transitionExpense(tenantId: string, expenseId: string, status: Parameters<FinanceRepository['transitionExpense']>[2], actorId?: string) {
    return this.repo.transitionExpense(tenantId, expenseId, status, actorId);
  }

  listExpenses(tenantId: string) {
    return this.repo.listExpenses(tenantId);
  }

  async getJournal(tenantId: string, id: string) {
    const journal = await this.repo.getJournal(tenantId, id);
    if (!journal) throw new ErpServiceError('NOT_FOUND', 'Journal not found.', 404);
    return journal;
  }

  salesSummaryReport(tenantId: string, filters?: { fromDate?: string; toDate?: string }) {
    return this.reportRepo.salesSummaryReport(tenantId, filters);
  }

  invoiceSummaryReport(tenantId: string, filters?: { fromDate?: string; toDate?: string }) {
    return this.reportRepo.invoiceSummaryReport(tenantId, filters);
  }

  receivablesReport(tenantId: string, filters?: { fromDate?: string; toDate?: string }) {
    return this.reportRepo.receivablesReport(tenantId, filters);
  }

  paymentsSummaryReport(tenantId: string, filters?: { fromDate?: string; toDate?: string }) {
    return this.reportRepo.paymentsSummaryReport(tenantId, filters);
  }

  outstandingBalancesReport(tenantId: string) {
    return this.reportRepo.outstandingBalancesReport(tenantId);
  }

  expensesSummaryReport(tenantId: string, filters?: { fromDate?: string; toDate?: string }) {
    return this.reportRepo.expensesSummaryReport(tenantId, filters);
  }

  incomeExpenseSummaryReport(tenantId: string, filters?: { fromDate?: string; toDate?: string }) {
    return this.reportRepo.incomeExpenseSummaryReport(tenantId, filters);
  }

  cashFlowReport(tenantId: string, filters?: { fromDate?: string; toDate?: string }) {
    return this.reportRepo.cashFlowReport(tenantId, filters);
  }

  transactionSummaryReport(tenantId: string, filters?: { fromDate?: string; toDate?: string }) {
    return this.reportRepo.transactionSummaryReport(tenantId, filters);
  }

  settlementFinancialSummaryReport(tenantId: string, filters?: { fromDate?: string; toDate?: string }) {
    return this.reportRepo.settlementFinancialSummaryReport(tenantId, filters);
  }
}
