import { financeService } from '../services/financeServices.ts';
import { db } from '../db/database.ts';

export async function runFinanceTestSuite(): Promise<{ success: boolean; totalTests: number; passedTests: number; failedTests: number; errors: string[] }> {
  const errors: string[] = [];
  let totalTests = 0;
  let passedTests = 0;

  const tenantA = 'tenant-rz-global-001';
  const tenantB = 'tenant-apex-quarry-002';
  const userId = 'usr-admin-001';

  async function assertTest(name: string, fn: () => Promise<void>) {
    totalTests++;
    try {
      await fn();
      passedTests++;
      console.log(`  [PASS] ${name}`);
    } catch (err: any) {
      errors.push(`${name}: ${err.message}`);
      console.error(`  [FAIL] ${name}: ${err.message}`);
    }
  }

  console.log('==================================================');
  console.log('RUNNING PHASE 21 ENTERPRISE FINANCE TEST SUITE');
  console.log('==================================================');

  // 1. Chart of Accounts Test
  await assertTest('Chart of Accounts Retrieval & Creation', async () => {
    const coa = await financeService.getChartOfAccounts(tenantA);
    if (coa.length < 10) throw new Error(`Expected at least 10 accounts, found ${coa.length}`);

    const accCode = `5500-${Date.now().toString().slice(-4)}`;
    const newAcc = await financeService.createAccount(tenantA, userId, {
      accountCode: accCode,
      accountName: 'Heavy Equipment Depreciation Expense',
      accountType: 'EXPENSE',
      currency: 'INR'
    });

    if (!newAcc.id || newAcc.accountCode !== accCode) {
      throw new Error('Failed to create account');
    }
  });

  // 2. Fiscal Period Lock/Close Flow
  await assertTest('Fiscal Period Closing & Reopening', async () => {
    const periods = await financeService.getFiscalPeriods(tenantA);
    if (periods.length === 0) throw new Error('No fiscal periods found');

    const openPeriod = periods.find(p => p.status === 'OPEN') || periods[0];
    const closed = await financeService.closeFiscalPeriod(tenantA, userId, openPeriod.id);
    if (closed.status !== 'CLOSED') throw new Error('Failed to close fiscal period');

    const reopened = await financeService.reopenFiscalPeriod(tenantA, userId, openPeriod.id);
    if (reopened.status !== 'OPEN') throw new Error('Failed to reopen fiscal period');
  });

  // 3. Double-Entry Balance Validation Test
  await assertTest('Posting Engine - Enforce Double-Entry Balance', async () => {
    // Attempt unbalanced entry (should throw)
    try {
      await financeService.createJournal(tenantA, userId, {
        journalDate: '2026-08-10',
        referenceType: 'MANUAL',
        description: 'Unbalanced Journal Test',
        lines: [
          { accountId: 'acc-1010', debit: 50000, credit: 0, description: 'Debit 50k' },
          { accountId: 'acc-4000', debit: 0, credit: 40000, description: 'Credit 40k' }
        ]
      });
      throw new Error('Unbalanced journal entry was wrongly accepted!');
    } catch (err: any) {
      if (!err.message.includes('unbalanced') && !err.message.includes('equal Total Credit')) {
        throw new Error(`Unexpected error message for unbalanced journal: ${err.message}`);
      }
    }

    // Balanced Entry
    const journal = await financeService.createJournal(tenantA, userId, {
      journalDate: '2026-08-10',
      referenceType: 'MANUAL',
      description: 'Balanced Capital Injection Test',
      lines: [
        { accountId: 'acc-1010', debit: 100000, credit: 0, description: 'Bank Debit' },
        { accountId: 'acc-3000', debit: 0, credit: 100000, description: 'Capital Equity Credit' }
      ]
    });

    const posted = await financeService.postJournal(tenantA, userId, journal.id);
    if (posted.status !== 'POSTED') throw new Error('Journal posting failed');
  });

  // 4. Journal Reversal Test
  await assertTest('Journal Entry Reversal Flow', async () => {
    const journal = await financeService.createJournal(tenantA, userId, {
      journalDate: '2026-08-10',
      referenceType: 'MANUAL',
      description: 'Journal to be Reversed',
      lines: [
        { accountId: 'acc-5400', debit: 12000, credit: 0, description: 'Admin Expense Debit' },
        { accountId: 'acc-1010', debit: 0, credit: 12000, description: 'Bank Credit' }
      ]
    });

    await financeService.postJournal(tenantA, userId, journal.id);
    const reversed = await financeService.reverseJournal(tenantA, userId, journal.id, 'Erroneous posting');

    if (reversed.status !== 'POSTED') throw new Error('Reversal journal creation/posting failed');
    const orig = (await financeService.getJournals(tenantA)).find(j => j.id === journal.id);
    if (orig?.status !== 'REVERSED') throw new Error('Original journal was not marked as REVERSED');
  });

  // 5. Accounts Receivable (AR) Full Flow
  await assertTest('Accounts Receivable - Invoice, Payment & Allocation', async () => {
    const inv = await financeService.createCustomerInvoice(tenantA, userId, {
      customerId: 'cust-harbor-dev',
      invoiceDate: '2026-08-10',
      dueDate: '2026-09-10',
      items: [
        { itemDescription: 'Laterite Stone Supply', quantity: 50, unitPrice: 2000, taxRate: 18.0 }
      ]
    });

    if (inv.status !== 'ISSUED' || inv.totalAmount !== 118000) {
      throw new Error(`Invoice calculation or status wrong: ${inv.status}, total: ${inv.totalAmount}`);
    }

    // Record Payment
    const pay = await financeService.recordCustomerPayment(tenantA, userId, {
      customerId: 'cust-harbor-dev',
      paymentDate: '2026-08-12',
      amount: 118000,
      paymentMethod: 'TRANSFER',
      bankAccountId: 'bank-hdfc-001',
      referenceNumber: 'NEFT-TEST-9988'
    });

    if (pay.unallocatedAmount !== 118000) throw new Error('Payment unallocated amount incorrect');

    // Allocate Payment to Invoice
    const alloc = await financeService.allocatePaymentToInvoice(tenantA, userId, pay.id, inv.id, 118000);
    if (alloc.allocatedAmount !== 118000) throw new Error('Allocation amount mismatch');

    const updatedInv = (await financeService.getInvoices(tenantA)).find(i => i.id === inv.id);
    if (updatedInv?.status !== 'PAID' || updatedInv.outstandingAmount !== 0) {
      throw new Error(`Invoice status after full allocation should be PAID with 0 outstanding, found: ${updatedInv?.status}, outstanding: ${updatedInv?.outstandingAmount}`);
    }
  });

  // 6. Accounts Payable (AP) Supplier Bill Flow
  await assertTest('Accounts Payable - Supplier Bill Creation & Posting', async () => {
    const bill = await financeService.createSupplierBill(tenantA, userId, {
      supplierName: 'Bharat Petroleum Corp Ltd',
      billDate: '2026-08-10',
      dueDate: '2026-08-25',
      items: [
        { itemDescription: 'Commercial Diesel Bulk Purchase', quantity: 1000, unitPrice: 90, taxAmount: 16200 }
      ]
    });

    if (bill.status !== 'POSTED' || bill.totalAmount !== 106200) {
      throw new Error(`Supplier bill creation/posting failed, total: ${bill.totalAmount}`);
    }
  });

  // 7. Expense Management Test
  await assertTest('Expense Recording & Posting', async () => {
    const expense = await financeService.recordExpense(tenantA, userId, {
      category: 'Maintenance',
      amount: 25000,
      expenseDate: '2026-08-10',
      paymentMethod: 'BANK',
      costCenterId: 'cc-fleet',
      vehicleId: 'veh-ka19-4491',
      description: 'Tipper Hydraulic Pump Repair & Oil Seal Replacement'
    });

    if (expense.status !== 'POSTED' || !expense.journalId) {
      throw new Error('Expense failed to create or post journal');
    }
  });

  // 8. Bank Reconciliation Test
  await assertTest('Bank Reconciliation Flow', async () => {
    const bank = (await financeService.getBankAccounts(tenantA))[0];
    if (!bank) throw new Error('Bank account not found');

    const rec = await financeService.reconcileBankStatement(tenantA, userId, {
      bankAccountId: bank.id,
      statementDate: '2026-08-10',
      statementBalance: bank.currentBalance
    });

    if (rec.difference !== 0 || rec.status !== 'RECONCILED') {
      throw new Error(`Bank reconciliation status should be RECONCILED with 0 diff, found status: ${rec.status}, diff: ${rec.difference}`);
    }
  });

  // 9. Financial Reports Engine Test
  await assertTest('Financial Reports (Trial Balance, P&L, Balance Sheet, Aging)', async () => {
    const tb = await financeService.getTrialBalanceReport(tenantA);
    if (!tb.isBalanced) throw new Error('Trial balance report is UNBALANCED!');

    const pnl = await financeService.getProfitAndLossReport(tenantA);
    if (typeof pnl.summary.netProfit !== 'number') throw new Error('P&L Net Profit calculation invalid');

    const bs = await financeService.getBalanceSheetReport(tenantA);
    if (!bs.isEquationBalanced) throw new Error('Balance Sheet equation Assets = Liabilities + Equity is broken!');

    const arAging = await financeService.getAgingReport(tenantA, 'AR');
    if (typeof arAging.totalOutstanding !== 'number') throw new Error('AR Aging total calculation invalid');

    const dash = await financeService.getDashboardMetrics(tenantA);
    if (typeof dash.netProfit !== 'number' || typeof dash.cashAndBankBalance !== 'number') {
      throw new Error('Financial Executive Dashboard metrics invalid');
    }
  });

  // 10. Tenant Isolation Test
  await assertTest('Tenant Isolation Enforced on Financial Data', async () => {
    const accountsB = await financeService.getChartOfAccounts(tenantB);
    const journalsB = await financeService.getJournals(tenantB);
    const invoicesB = await financeService.getInvoices(tenantB);

    if (accountsB.length > 0) throw new Error('Tenant B accessed Tenant A accounts!');
    if (journalsB.length > 0) throw new Error('Tenant B accessed Tenant A journals!');
    if (invoicesB.length > 0) throw new Error('Tenant B accessed Tenant A invoices!');
  });

  console.log('==================================================');
  console.log(`FINANCE TEST SUITE COMPLETED: ${passedTests}/${totalTests} PASSED`);
  console.log('==================================================');

  return {
    success: errors.length === 0,
    totalTests,
    passedTests,
    failedTests: errors.length,
    errors
  };
}
