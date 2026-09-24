import { db } from '../db/database.ts';
import {
  ChartOfAccount,
  FiscalYear,
  FiscalPeriod,
  CostCenter,
  FinanceProject,
  Journal,
  JournalLine,
  CustomerInvoice,
  InvoiceItem,
  CustomerPayment,
  PaymentAllocation,
  SupplierBill,
  SupplierBillItem,
  SupplierPayment,
  FinanceExpense,
  BankAccount,
  BankTransaction,
  BankReconciliation,
  CreditNote,
  DebitNote,
  TaxCode
} from '../db/schema.ts';

export class FinanceRepository {

  // Chart of Accounts
  public async getAccounts(tenantId: string): Promise<ChartOfAccount[]> {
    return Array.from(db.chartOfAccounts.values()).filter(a => a.tenantId === tenantId);
  }
  public async getAccountById(tenantId: string, id: string): Promise<ChartOfAccount | undefined> {
    const acc = db.chartOfAccounts.get(id);
    return acc && acc.tenantId === tenantId ? acc : undefined;
  }
  public async getAccountByCode(tenantId: string, code: string): Promise<ChartOfAccount | undefined> {
    return Array.from(db.chartOfAccounts.values()).find(a => a.tenantId === tenantId && a.accountCode === code);
  }
  public async saveAccount(acc: ChartOfAccount): Promise<ChartOfAccount> {
    db.chartOfAccounts.set(acc.id, acc);
    db.persistToDisk();
    return acc;
  }

  // Fiscal Years & Periods
  public async getFiscalYears(tenantId: string): Promise<FiscalYear[]> {
    return Array.from(db.fiscalYears.values()).filter(f => f.tenantId === tenantId);
  }
  public async getFiscalYearById(tenantId: string, id: string): Promise<FiscalYear | undefined> {
    const fy = db.fiscalYears.get(id);
    return fy && fy.tenantId === tenantId ? fy : undefined;
  }
  public async saveFiscalYear(fy: FiscalYear): Promise<FiscalYear> {
    db.fiscalYears.set(fy.id, fy);
    db.persistToDisk();
    return fy;
  }

  public async getFiscalPeriods(tenantId: string, fiscalYearId?: string): Promise<FiscalPeriod[]> {
    return Array.from(db.fiscalPeriods.values()).filter(fp => {
      if (fp.tenantId !== tenantId) return false;
      if (fiscalYearId && fp.fiscalYearId !== fiscalYearId) return false;
      return true;
    });
  }
  public async getFiscalPeriodById(tenantId: string, id: string): Promise<FiscalPeriod | undefined> {
    const fp = db.fiscalPeriods.get(id);
    return fp && fp.tenantId === tenantId ? fp : undefined;
  }
  public async saveFiscalPeriod(fp: FiscalPeriod): Promise<FiscalPeriod> {
    db.fiscalPeriods.set(fp.id, fp);
    db.persistToDisk();
    return fp;
  }

  // Cost Centers
  public async getCostCenters(tenantId: string): Promise<CostCenter[]> {
    return Array.from(db.costCenters.values()).filter(cc => cc.tenantId === tenantId);
  }
  public async getCostCenterById(tenantId: string, id: string): Promise<CostCenter | undefined> {
    const cc = db.costCenters.get(id);
    return cc && cc.tenantId === tenantId ? cc : undefined;
  }
  public async saveCostCenter(cc: CostCenter): Promise<CostCenter> {
    db.costCenters.set(cc.id, cc);
    db.persistToDisk();
    return cc;
  }

  // Projects
  public async getProjects(tenantId: string): Promise<FinanceProject[]> {
    return Array.from(db.financeProjects.values()).filter(p => p.tenantId === tenantId);
  }
  public async getProjectById(tenantId: string, id: string): Promise<FinanceProject | undefined> {
    const p = db.financeProjects.get(id);
    return p && p.tenantId === tenantId ? p : undefined;
  }
  public async saveProject(p: FinanceProject): Promise<FinanceProject> {
    db.financeProjects.set(p.id, p);
    db.persistToDisk();
    return p;
  }

  // Journals & Journal Lines
  public async getJournals(tenantId: string): Promise<Journal[]> {
    return Array.from(db.journals.values()).filter(j => j.tenantId === tenantId);
  }
  public async getJournalById(tenantId: string, id: string): Promise<Journal | undefined> {
    const j = db.journals.get(id);
    return j && j.tenantId === tenantId ? j : undefined;
  }
  public async saveJournal(journal: Journal): Promise<Journal> {
    db.journals.set(journal.id, journal);
    db.persistToDisk();
    return journal;
  }

  public async getJournalLines(tenantId: string, journalId?: string): Promise<JournalLine[]> {
    return Array.from(db.journalLines.values()).filter(jl => {
      if (jl.tenantId !== tenantId) return false;
      if (journalId && jl.journalId !== journalId) return false;
      return true;
    });
  }
  public async saveJournalLine(jl: JournalLine): Promise<JournalLine> {
    db.journalLines.set(jl.id, jl);
    db.persistToDisk();
    return jl;
  }

  // Customer Invoices
  public async getInvoices(tenantId: string): Promise<CustomerInvoice[]> {
    return Array.from(db.customerInvoices.values()).filter(i => i.tenantId === tenantId);
  }
  public async getInvoiceById(tenantId: string, id: string): Promise<CustomerInvoice | undefined> {
    const inv = db.customerInvoices.get(id);
    return inv && inv.tenantId === tenantId ? inv : undefined;
  }
  public async saveInvoice(inv: CustomerInvoice): Promise<CustomerInvoice> {
    db.customerInvoices.set(inv.id, inv);
    db.persistToDisk();
    return inv;
  }

  public async getInvoiceItems(tenantId: string, invoiceId: string): Promise<InvoiceItem[]> {
    return Array.from(db.invoiceItems.values()).filter(item => item.tenantId === tenantId && item.invoiceId === invoiceId);
  }
  public async saveInvoiceItem(item: InvoiceItem): Promise<InvoiceItem> {
    db.invoiceItems.set(item.id, item);
    db.persistToDisk();
    return item;
  }

  // Customer Payments & Allocations
  public async getPayments(tenantId: string): Promise<CustomerPayment[]> {
    return Array.from(db.customerPayments.values()).filter(p => p.tenantId === tenantId);
  }
  public async getPaymentById(tenantId: string, id: string): Promise<CustomerPayment | undefined> {
    const pay = db.customerPayments.get(id);
    return pay && pay.tenantId === tenantId ? pay : undefined;
  }
  public async savePayment(pay: CustomerPayment): Promise<CustomerPayment> {
    db.customerPayments.set(pay.id, pay);
    db.persistToDisk();
    return pay;
  }

  public async getPaymentAllocations(tenantId: string, paymentId?: string): Promise<PaymentAllocation[]> {
    return Array.from(db.paymentAllocations.values()).filter(pa => {
      if (pa.tenantId !== tenantId) return false;
      if (paymentId && pa.paymentId !== paymentId) return false;
      return true;
    });
  }
  public async savePaymentAllocation(alloc: PaymentAllocation): Promise<PaymentAllocation> {
    db.paymentAllocations.set(alloc.id, alloc);
    db.persistToDisk();
    return alloc;
  }

  // Supplier Bills
  public async getSupplierBills(tenantId: string): Promise<SupplierBill[]> {
    return Array.from(db.supplierBills.values()).filter(b => b.tenantId === tenantId);
  }
  public async getSupplierBillById(tenantId: string, id: string): Promise<SupplierBill | undefined> {
    const bill = db.supplierBills.get(id);
    return bill && bill.tenantId === tenantId ? bill : undefined;
  }
  public async saveSupplierBill(bill: SupplierBill): Promise<SupplierBill> {
    db.supplierBills.set(bill.id, bill);
    db.persistToDisk();
    return bill;
  }

  public async getSupplierBillItems(tenantId: string, billId: string): Promise<SupplierBillItem[]> {
    return Array.from(db.supplierBillItems.values()).filter(item => item.tenantId === tenantId && item.billId === billId);
  }
  public async saveSupplierBillItem(item: SupplierBillItem): Promise<SupplierBillItem> {
    db.supplierBillItems.set(item.id, item);
    db.persistToDisk();
    return item;
  }

  // Supplier Payments
  public async getSupplierPayments(tenantId: string): Promise<SupplierPayment[]> {
    return Array.from(db.supplierPayments.values()).filter(p => p.tenantId === tenantId);
  }
  public async saveSupplierPayment(sp: SupplierPayment): Promise<SupplierPayment> {
    db.supplierPayments.set(sp.id, sp);
    db.persistToDisk();
    return sp;
  }

  // Expenses
  public async getExpenses(tenantId: string): Promise<FinanceExpense[]> {
    return Array.from(db.financeExpenses.values()).filter(e => e.tenantId === tenantId);
  }
  public async getExpenseById(tenantId: string, id: string): Promise<FinanceExpense | undefined> {
    const exp = db.financeExpenses.get(id);
    return exp && exp.tenantId === tenantId ? exp : undefined;
  }
  public async saveExpense(exp: FinanceExpense): Promise<FinanceExpense> {
    db.financeExpenses.set(exp.id, exp);
    db.persistToDisk();
    return exp;
  }

  // Bank Accounts & Transactions
  public async getBankAccounts(tenantId: string): Promise<BankAccount[]> {
    return Array.from(db.bankAccounts.values()).filter(b => b.tenantId === tenantId);
  }
  public async getBankAccountById(tenantId: string, id: string): Promise<BankAccount | undefined> {
    const bank = db.bankAccounts.get(id);
    return bank && bank.tenantId === tenantId ? bank : undefined;
  }
  public async saveBankAccount(bank: BankAccount): Promise<BankAccount> {
    db.bankAccounts.set(bank.id, bank);
    db.persistToDisk();
    return bank;
  }

  public async getBankTransactions(tenantId: string, bankAccountId?: string): Promise<BankTransaction[]> {
    return Array.from(db.bankTransactions.values()).filter(bt => {
      if (bt.tenantId !== tenantId) return false;
      if (bankAccountId && bt.bankAccountId !== bankAccountId) return false;
      return true;
    });
  }
  public async saveBankTransaction(bt: BankTransaction): Promise<BankTransaction> {
    db.bankTransactions.set(bt.id, bt);
    db.persistToDisk();
    return bt;
  }

  // Reconciliations
  public async getReconciliations(tenantId: string): Promise<BankReconciliation[]> {
    return Array.from(db.bankReconciliations.values()).filter(r => r.tenantId === tenantId);
  }
  public async saveReconciliation(rec: BankReconciliation): Promise<BankReconciliation> {
    db.bankReconciliations.set(rec.id, rec);
    db.persistToDisk();
    return rec;
  }

  // Credit Notes & Debit Notes
  public async getCreditNotes(tenantId: string): Promise<CreditNote[]> {
    return Array.from(db.creditNotes.values()).filter(cn => cn.tenantId === tenantId);
  }
  public async saveCreditNote(cn: CreditNote): Promise<CreditNote> {
    db.creditNotes.set(cn.id, cn);
    db.persistToDisk();
    return cn;
  }

  public async getDebitNotes(tenantId: string): Promise<DebitNote[]> {
    return Array.from(db.debitNotes.values()).filter(dn => dn.tenantId === tenantId);
  }
  public async saveDebitNote(dn: DebitNote): Promise<DebitNote> {
    db.debitNotes.set(dn.id, dn);
    db.persistToDisk();
    return dn;
  }

  // Tax Codes
  public async getTaxCodes(tenantId: string): Promise<TaxCode[]> {
    return Array.from(db.taxCodes.values()).filter(tc => tc.tenantId === tenantId);
  }
  public async saveTaxCode(tc: TaxCode): Promise<TaxCode> {
    db.taxCodes.set(tc.id, tc);
    db.persistToDisk();
    return tc;
  }
}

export const financeRepository = new FinanceRepository();
