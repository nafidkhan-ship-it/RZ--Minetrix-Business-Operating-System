import { financeRepository } from '../repositories/financeRepositories.ts';
import { db, generateUuidV7 } from '../db/database.ts';
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
  TaxCode,
  AuditLog,
  Notification
} from '../db/schema.ts';

export class FinanceService {

  // ==========================================
  // AUDIT LOGGING HELPER
  // ==========================================
  private logAudit(tenantId: string, userId: string, action: string, resource: string, resourceId: string, details: any) {
    const audit: AuditLog = {
      id: generateUuidV7(),
      tenantId,
      actorUserId: userId,
      actorEmail: 'finance.user@racezoneventures.com',
      action,
      module: 'Finance',
      resource,
      resourceId,
      ipAddress: '127.0.0.1',
      correlationId: `corr-${generateUuidV7().slice(0, 8)}`,
      status: 'SUCCESS',
      afterStateJson: JSON.stringify(details),
      createdAt: new Date().toISOString()
    };
    db.auditLogs.set(audit.id, audit);
  }

  // ==========================================
  // NOTIFICATION HELPER
  // ==========================================
  private sendNotification(tenantId: string, recipientUserId: string, title: string, body: string, channel: 'IN_APP' | 'EMAIL' | 'WHATSAPP' | 'PUSH' = 'IN_APP') {
    const notif: Notification = {
      id: generateUuidV7(),
      tenantId,
      recipientUserId,
      type: 'INFO',
      title,
      body,
      channel,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    db.notifications.set(notif.id, notif);
  }

  // ==========================================
  // 1. CHART OF ACCOUNTS SERVICES
  // ==========================================
  public async getChartOfAccounts(tenantId: string): Promise<ChartOfAccount[]> {
    return financeRepository.getAccounts(tenantId);
  }

  public async getAccountById(tenantId: string, id: string): Promise<ChartOfAccount | undefined> {
    return financeRepository.getAccountById(tenantId, id);
  }

  public async createAccount(tenantId: string, userId: string, data: Partial<ChartOfAccount>): Promise<ChartOfAccount> {
    if (!data.accountCode || !data.accountName || !data.accountType) {
      throw new Error('Account code, name, and type are required');
    }
    const existing = await financeRepository.getAccountByCode(tenantId, data.accountCode);
    if (existing) {
      throw new Error(`Account code ${data.accountCode} already exists`);
    }
    const now = new Date().toISOString();
    const acc: ChartOfAccount = {
      id: generateUuidV7(),
      tenantId,
      accountCode: data.accountCode,
      accountName: data.accountName,
      accountType: data.accountType,
      parentAccountId: data.parentAccountId,
      currency: data.currency || 'INR',
      isControlAccount: data.isControlAccount ?? false,
      isActive: data.isActive ?? true,
      createdAt: now,
      updatedAt: now
    };
    await financeRepository.saveAccount(acc);
    this.logAudit(tenantId, userId, 'CREATE_ACCOUNT', 'ChartOfAccount', acc.id, { accountCode: acc.accountCode });
    return acc;
  }

  public async updateAccount(tenantId: string, userId: string, id: string, data: Partial<ChartOfAccount>): Promise<ChartOfAccount> {
    const acc = await financeRepository.getAccountById(tenantId, id);
    if (!acc) throw new Error('Account not found');

    if (data.accountName) acc.accountName = data.accountName;
    if (data.parentAccountId !== undefined) acc.parentAccountId = data.parentAccountId;
    if (data.isControlAccount !== undefined) acc.isControlAccount = data.isControlAccount;
    if (data.isActive !== undefined) acc.isActive = data.isActive;
    acc.updatedAt = new Date().toISOString();

    await financeRepository.saveAccount(acc);
    this.logAudit(tenantId, userId, 'UPDATE_ACCOUNT', 'ChartOfAccount', acc.id, { accountCode: acc.accountCode });
    return acc;
  }

  // ==========================================
  // 2. FISCAL PERIODS & YEARS
  // ==========================================
  public async getFiscalYears(tenantId: string): Promise<FiscalYear[]> {
    return financeRepository.getFiscalYears(tenantId);
  }

  public async getFiscalPeriods(tenantId: string, fiscalYearId?: string): Promise<FiscalPeriod[]> {
    return financeRepository.getFiscalPeriods(tenantId, fiscalYearId);
  }

  public async closeFiscalPeriod(tenantId: string, userId: string, periodId: string): Promise<FiscalPeriod> {
    const fp = await financeRepository.getFiscalPeriodById(tenantId, periodId);
    if (!fp) throw new Error('Fiscal period not found');
    if (fp.status === 'CLOSED') throw new Error('Fiscal period is already closed');

    // Check for unposted draft journals in period
    const journals = await financeRepository.getJournals(tenantId);
    const unposted = journals.filter(j => j.status === 'DRAFT' && j.journalDate >= fp.startDate && j.journalDate <= fp.endDate);
    if (unposted.length > 0) {
      throw new Error(`Cannot close fiscal period: ${unposted.length} unposted draft journal entries remain`);
    }

    fp.status = 'CLOSED';
    fp.updatedAt = new Date().toISOString();
    await financeRepository.saveFiscalPeriod(fp);
    this.logAudit(tenantId, userId, 'CLOSE_FISCAL_PERIOD', 'FiscalPeriod', fp.id, { periodName: fp.periodName });
    return fp;
  }

  public async reopenFiscalPeriod(tenantId: string, userId: string, periodId: string): Promise<FiscalPeriod> {
    const fp = await financeRepository.getFiscalPeriodById(tenantId, periodId);
    if (!fp) throw new Error('Fiscal period not found');
    fp.status = 'OPEN';
    fp.updatedAt = new Date().toISOString();
    await financeRepository.saveFiscalPeriod(fp);
    this.logAudit(tenantId, userId, 'REOPEN_FISCAL_PERIOD', 'FiscalPeriod', fp.id, { periodName: fp.periodName });
    return fp;
  }

  // ==========================================
  // 3. FINANCIAL POSTING ENGINE (DOUBLE-ENTRY)
  // ==========================================
  public async getJournals(tenantId: string): Promise<Journal[]> {
    return financeRepository.getJournals(tenantId);
  }

  public async getJournalDetails(tenantId: string, id: string): Promise<{ journal: Journal; lines: JournalLine[] }> {
    const journal = await financeRepository.getJournalById(tenantId, id);
    if (!journal) throw new Error('Journal not found');
    const lines = await financeRepository.getJournalLines(tenantId, id);
    return { journal, lines };
  }

  public async createJournal(
    tenantId: string,
    userId: string,
    data: {
      journalDate: string;
      referenceType: Journal['referenceType'];
      referenceId?: string;
      description: string;
      lines: Array<{
        accountId: string;
        debit: number;
        credit: number;
        costCenterId?: string;
        projectId?: string;
        customerId?: string;
        supplierId?: string;
        description: string;
      }>;
    }
  ): Promise<Journal> {
    if (!data.lines || data.lines.length < 2) {
      throw new Error('A double-entry journal must contain at least two line items');
    }

    // Check Fiscal Period status
    const periods = await financeRepository.getFiscalPeriods(tenantId);
    const matchingPeriod = periods.find(fp => data.journalDate >= fp.startDate && data.journalDate <= fp.endDate);
    if (matchingPeriod && matchingPeriod.status !== 'OPEN') {
      throw new Error(`Cannot create journal entry in a ${matchingPeriod.status.toLowerCase()} fiscal period (${matchingPeriod.periodName})`);
    }

    let totalDebit = 0;
    let totalCredit = 0;
    for (const l of data.lines) {
      if (l.debit < 0 || l.credit < 0) throw new Error('Debit and credit amounts must be non-negative');
      totalDebit += Number(l.debit || 0);
      totalCredit += Number(l.credit || 0);
    }

    // Double-entry validation
    if (Math.abs(totalDebit - totalCredit) > 0.001) {
      throw new Error(`Journal entry is unbalanced: Total Debit (${totalDebit.toFixed(2)}) must equal Total Credit (${totalCredit.toFixed(2)})`);
    }

    const now = new Date().toISOString();
    const count = (await financeRepository.getJournals(tenantId)).length + 1;
    const journalNumber = `JNL-${new Date().getFullYear()}-${count.toString().padStart(5, '0')}`;

    const journal: Journal = {
      id: generateUuidV7(),
      tenantId,
      journalNumber,
      journalDate: data.journalDate,
      referenceType: data.referenceType,
      referenceId: data.referenceId,
      description: data.description,
      status: 'DRAFT',
      createdBy: userId,
      totalDebit: Number(totalDebit.toFixed(2)),
      totalCredit: Number(totalCredit.toFixed(2)),
      createdAt: now,
      updatedAt: now
    };

    await financeRepository.saveJournal(journal);

    for (const l of data.lines) {
      const line: JournalLine = {
        id: generateUuidV7(),
        tenantId,
        journalId: journal.id,
        accountId: l.accountId,
        debit: Number(l.debit || 0),
        credit: Number(l.credit || 0),
        costCenterId: l.costCenterId,
        projectId: l.projectId,
        customerId: l.customerId,
        supplierId: l.supplierId,
        description: l.description
      };
      await financeRepository.saveJournalLine(line);
    }

    this.logAudit(tenantId, userId, 'CREATE_JOURNAL', 'Journal', journal.id, { journalNumber });
    return journal;
  }

  public async postJournal(tenantId: string, userId: string, journalId: string): Promise<Journal> {
    const journal = await financeRepository.getJournalById(tenantId, journalId);
    if (!journal) throw new Error('Journal not found');
    if (journal.status !== 'DRAFT') throw new Error(`Journal is already in ${journal.status} status`);

    // Verify Fiscal Period
    const periods = await financeRepository.getFiscalPeriods(tenantId);
    const matchingPeriod = periods.find(fp => journal.journalDate >= fp.startDate && journal.journalDate <= fp.endDate);
    if (matchingPeriod && matchingPeriod.status !== 'OPEN') {
      throw new Error(`Cannot post journal entry in a ${matchingPeriod.status.toLowerCase()} fiscal period`);
    }

    const now = new Date().toISOString();
    journal.status = 'POSTED';
    journal.postedBy = userId;
    journal.postedAt = now;
    journal.updatedAt = now;

    await financeRepository.saveJournal(journal);
    this.logAudit(tenantId, userId, 'POST_JOURNAL', 'Journal', journal.id, { journalNumber: journal.journalNumber });
    return journal;
  }

  public async reverseJournal(tenantId: string, userId: string, journalId: string, reason: string): Promise<Journal> {
    const journal = await financeRepository.getJournalById(tenantId, journalId);
    if (!journal) throw new Error('Journal not found');
    if (journal.status !== 'POSTED') throw new Error('Only POSTED journals can be reversed');

    const lines = await financeRepository.getJournalLines(tenantId, journalId);

    // Create reversing lines (swap debit and credit)
    const ReversingLines = lines.map(l => ({
      accountId: l.accountId,
      debit: l.credit,
      credit: l.debit,
      costCenterId: l.costCenterId,
      projectId: l.projectId,
      customerId: l.customerId,
      supplierId: l.supplierId,
      description: `REVERSAL: ${l.description}`
    }));

    const now = new Date().toISOString();
    const revJournal = await this.createJournal(tenantId, userId, {
      journalDate: now.split('T')[0],
      referenceType: 'REVERSAL',
      referenceId: journal.id,
      description: `Reversal of ${journal.journalNumber}: ${reason}`,
      lines: ReversingLines
    });

    await this.postJournal(tenantId, userId, revJournal.id);

    journal.status = 'REVERSED';
    journal.reversedBy = userId;
    journal.reversedJournalId = revJournal.id;
    journal.updatedAt = now;
    await financeRepository.saveJournal(journal);

    this.logAudit(tenantId, userId, 'REVERSE_JOURNAL', 'Journal', journal.id, { reversedByJournalNumber: revJournal.journalNumber });
    return revJournal;
  }

  // ==========================================
  // 4. ACCOUNTS RECEIVABLE (AR) INVOICES & PAYMENTS
  // ==========================================
  public async getInvoices(tenantId: string): Promise<CustomerInvoice[]> {
    return financeRepository.getInvoices(tenantId);
  }

  public async createCustomerInvoice(
    tenantId: string,
    userId: string,
    data: {
      customerId: string;
      quotationId?: string;
      invoiceDate: string;
      dueDate: string;
      creditTermsDays?: number;
      notes?: string;
      items: Array<{
        itemDescription: string;
        quantity: number;
        unitPrice: number;
        taxCodeId?: string;
        taxRate?: number;
      }>;
    }
  ): Promise<CustomerInvoice> {
    if (!data.customerId || !data.items || data.items.length === 0) {
      throw new Error('Customer ID and at least one item are required');
    }

    let subtotal = 0;
    let totalTax = 0;

    const itemsToSave: InvoiceItem[] = [];
    const invId = generateUuidV7();

    for (const item of data.items) {
      const lineSubtotal = item.quantity * item.unitPrice;
      const taxRate = item.taxRate || 18.0;
      const taxAmount = (lineSubtotal * taxRate) / 100;
      const totalPrice = lineSubtotal + taxAmount;

      subtotal += lineSubtotal;
      totalTax += taxAmount;

      itemsToSave.push({
        id: generateUuidV7(),
        tenantId,
        invoiceId: invId,
        itemDescription: item.itemDescription,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        taxCodeId: item.taxCodeId,
        taxRate,
        taxAmount,
        totalPrice
      });
    }

    const totalAmount = subtotal + totalTax;
    const count = (await financeRepository.getInvoices(tenantId)).length + 1;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${count.toString().padStart(4, '0')}`;
    const now = new Date().toISOString();

    const invoice: CustomerInvoice = {
      id: invId,
      tenantId,
      invoiceNumber,
      customerId: data.customerId,
      quotationId: data.quotationId,
      invoiceDate: data.invoiceDate,
      dueDate: data.dueDate,
      creditTermsDays: data.creditTermsDays || 30,
      subtotal: Number(subtotal.toFixed(2)),
      taxAmount: Number(totalTax.toFixed(2)),
      discountAmount: 0,
      totalAmount: Number(totalAmount.toFixed(2)),
      outstandingAmount: Number(totalAmount.toFixed(2)),
      status: 'APPROVED',
      notes: data.notes,
      createdAt: now,
      updatedAt: now,
      items: itemsToSave
    };

    await financeRepository.saveInvoice(invoice);
    for (const it of itemsToSave) {
      await financeRepository.saveInvoiceItem(it);
    }

    // Auto-create & post Financial Journal Entry for Invoice
    const journalData = {
      journalDate: data.invoiceDate,
      referenceType: 'INVOICE' as const,
      referenceId: invoice.id,
      description: `Sales Invoice ${invoiceNumber} for Customer ${data.customerId}`,
      lines: [
        {
          accountId: 'acc-1100', // Accounts Receivable
          debit: invoice.totalAmount,
          credit: 0,
          customerId: data.customerId,
          description: `AR Debit for Invoice ${invoiceNumber}`
        },
        {
          accountId: 'acc-4000', // Sales Revenue
          debit: 0,
          credit: invoice.subtotal,
          description: `Sales Revenue for Invoice ${invoiceNumber}`
        },
        {
          accountId: 'acc-2200', // GST Output Tax
          debit: 0,
          credit: invoice.taxAmount,
          description: `GST Payable for Invoice ${invoiceNumber}`
        }
      ]
    };

    const journal = await this.createJournal(tenantId, userId, journalData);
    await this.postJournal(tenantId, userId, journal.id);

    invoice.journalId = journal.id;
    invoice.status = 'ISSUED';
    await financeRepository.saveInvoice(invoice);

    this.logAudit(tenantId, userId, 'CREATE_INVOICE', 'CustomerInvoice', invoice.id, { invoiceNumber, totalAmount: invoice.totalAmount });
    return invoice;
  }

  public async recordCustomerPayment(
    tenantId: string,
    userId: string,
    data: {
      customerId: string;
      paymentDate: string;
      amount: number;
      paymentMethod: CustomerPayment['paymentMethod'];
      bankAccountId?: string;
      referenceNumber?: string;
      allocateToInvoiceId?: string;
    }
  ): Promise<CustomerPayment> {
    if (!data.customerId || !data.amount || data.amount <= 0) {
      throw new Error('Customer ID and positive amount are required');
    }

    const count = (await financeRepository.getPayments(tenantId)).length + 1;
    const paymentNumber = `PAY-${new Date().getFullYear()}-${count.toString().padStart(4, '0')}`;
    const now = new Date().toISOString();

    const payment: CustomerPayment = {
      id: generateUuidV7(),
      tenantId,
      paymentNumber,
      customerId: data.customerId,
      paymentDate: data.paymentDate,
      amount: Number(data.amount.toFixed(2)),
      currency: 'INR',
      paymentMethod: data.paymentMethod,
      bankAccountId: data.bankAccountId || 'bank-hdfc-001',
      referenceNumber: data.referenceNumber,
      unallocatedAmount: Number(data.amount.toFixed(2)),
      status: 'POSTED',
      createdAt: now,
      updatedAt: now
    };

    await financeRepository.savePayment(payment);

    // Create journal posting for payment (Debit Bank/Cash, Credit AR)
    const bankAcc = data.bankAccountId ? await financeRepository.getBankAccountById(tenantId, data.bankAccountId) : undefined;
    const glAcc = bankAcc?.glAccountId || 'acc-1010';

    const journal = await this.createJournal(tenantId, userId, {
      journalDate: data.paymentDate,
      referenceType: 'PAYMENT',
      referenceId: payment.id,
      description: `Customer Receipt ${paymentNumber} from Customer ${data.customerId}`,
      lines: [
        {
          accountId: glAcc, // Bank/Cash Asset
          debit: payment.amount,
          credit: 0,
          customerId: data.customerId,
          description: `Bank Debit for Receipt ${paymentNumber}`
        },
        {
          accountId: 'acc-1100', // Accounts Receivable
          debit: 0,
          credit: payment.amount,
          customerId: data.customerId,
          description: `AR Credit for Receipt ${paymentNumber}`
        }
      ]
    });
    await this.postJournal(tenantId, userId, journal.id);

    payment.journalId = journal.id;
    await financeRepository.savePayment(payment);

    // Auto-allocate if invoice specified
    if (data.allocateToInvoiceId) {
      await this.allocatePaymentToInvoice(tenantId, userId, payment.id, data.allocateToInvoiceId, payment.amount);
    }

    this.logAudit(tenantId, userId, 'RECORD_PAYMENT', 'CustomerPayment', payment.id, { paymentNumber, amount: payment.amount });
    return payment;
  }

  public async allocatePaymentToInvoice(
    tenantId: string,
    userId: string,
    paymentId: string,
    invoiceId: string,
    allocatedAmount: number
  ): Promise<PaymentAllocation> {
    const payment = await financeRepository.getPaymentById(tenantId, paymentId);
    if (!payment) throw new Error('Payment not found');

    const invoice = await financeRepository.getInvoiceById(tenantId, invoiceId);
    if (!invoice) throw new Error('Invoice not found');

    if (allocatedAmount <= 0) throw new Error('Allocation amount must be greater than zero');
    if (allocatedAmount > payment.unallocatedAmount) {
      throw new Error(`Allocated amount (${allocatedAmount}) exceeds unallocated payment balance (${payment.unallocatedAmount})`);
    }
    if (allocatedAmount > invoice.outstandingAmount) {
      throw new Error(`Allocated amount (${allocatedAmount}) exceeds invoice outstanding amount (${invoice.outstandingAmount})`);
    }

    const now = new Date().toISOString();
    const alloc: PaymentAllocation = {
      id: generateUuidV7(),
      tenantId,
      paymentId,
      invoiceId,
      allocatedAmount: Number(allocatedAmount.toFixed(2)),
      allocatedAt: now
    };

    await financeRepository.savePaymentAllocation(alloc);

    // Update payment unallocated amount
    payment.unallocatedAmount = Number((payment.unallocatedAmount - allocatedAmount).toFixed(2));
    payment.updatedAt = now;
    await financeRepository.savePayment(payment);

    // Update invoice outstanding amount & status
    invoice.outstandingAmount = Number((invoice.outstandingAmount - allocatedAmount).toFixed(2));
    if (invoice.outstandingAmount <= 0.01) {
      invoice.status = 'PAID';
      invoice.outstandingAmount = 0;
    } else {
      invoice.status = 'PARTIALLY_PAID';
    }
    invoice.updatedAt = now;
    await financeRepository.saveInvoice(invoice);

    this.logAudit(tenantId, userId, 'ALLOCATE_PAYMENT', 'PaymentAllocation', alloc.id, { paymentId, invoiceId, allocatedAmount });
    return alloc;
  }

  // ==========================================
  // 5. ACCOUNTS PAYABLE (AP) BILLS & PAYMENTS
  // ==========================================
  public async getSupplierBills(tenantId: string): Promise<SupplierBill[]> {
    return financeRepository.getSupplierBills(tenantId);
  }

  public async createSupplierBill(
    tenantId: string,
    userId: string,
    data: {
      supplierName: string;
      supplierId?: string;
      billDate: string;
      dueDate: string;
      items: Array<{
        itemDescription: string;
        quantity: number;
        unitPrice: number;
        taxAmount?: number;
        costCenterId?: string;
      }>;
    }
  ): Promise<SupplierBill> {
    if (!data.supplierName || !data.items || data.items.length === 0) {
      throw new Error('Supplier name and at least one bill item are required');
    }

    let subtotal = 0;
    let totalTax = 0;
    const billId = generateUuidV7();
    const itemsToSave: SupplierBillItem[] = [];

    for (const item of data.items) {
      const lineSubtotal = item.quantity * item.unitPrice;
      const taxAmount = item.taxAmount || lineSubtotal * 0.18;
      const totalPrice = lineSubtotal + taxAmount;

      subtotal += lineSubtotal;
      totalTax += taxAmount;

      itemsToSave.push({
        id: generateUuidV7(),
        tenantId,
        billId,
        itemDescription: item.itemDescription,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        taxAmount,
        totalPrice,
        costCenterId: item.costCenterId || 'cc-fleet'
      });
    }

    const totalAmount = subtotal + totalTax;
    const count = (await financeRepository.getSupplierBills(tenantId)).length + 1;
    const billNumber = `BILL-${new Date().getFullYear()}-${count.toString().padStart(4, '0')}`;
    const now = new Date().toISOString();

    const bill: SupplierBill = {
      id: billId,
      tenantId,
      billNumber,
      supplierName: data.supplierName,
      supplierId: data.supplierId,
      billDate: data.billDate,
      dueDate: data.dueDate,
      subtotal: Number(subtotal.toFixed(2)),
      taxAmount: Number(totalTax.toFixed(2)),
      discountAmount: 0,
      totalAmount: Number(totalAmount.toFixed(2)),
      outstandingAmount: Number(totalAmount.toFixed(2)),
      status: 'APPROVED',
      createdAt: now,
      updatedAt: now,
      items: itemsToSave
    };

    await financeRepository.saveSupplierBill(bill);
    for (const it of itemsToSave) {
      await financeRepository.saveSupplierBillItem(it);
    }

    // Auto-create & post Financial Journal for Bill
    const journalLines = [
      {
        accountId: 'acc-5100', // Fleet Fuel & Operating Expenses
        debit: bill.subtotal,
        credit: 0,
        costCenterId: 'cc-fleet',
        supplierId: data.supplierId,
        description: `Expense Debit for Bill ${billNumber}`
      }
    ];

    if (bill.taxAmount > 0) {
      journalLines.push({
        accountId: 'acc-1300', // GST Input Tax Credit
        debit: bill.taxAmount,
        credit: 0,
        costCenterId: 'cc-fleet',
        supplierId: data.supplierId,
        description: `GST Input Tax Credit for Bill ${billNumber}`
      });
    }

    journalLines.push({
      accountId: 'acc-2100', // Accounts Payable
      debit: 0,
      credit: bill.totalAmount,
      costCenterId: 'cc-fleet',
      supplierId: data.supplierId,
      description: `AP Credit for Bill ${billNumber}`
    });

    const journal = await this.createJournal(tenantId, userId, {
      journalDate: data.billDate,
      referenceType: 'BILL',
      referenceId: bill.id,
      description: `Supplier Bill ${billNumber} from ${data.supplierName}`,
      lines: journalLines
    });
    await this.postJournal(tenantId, userId, journal.id);

    bill.journalId = journal.id;
    bill.status = 'POSTED';
    await financeRepository.saveSupplierBill(bill);

    this.logAudit(tenantId, userId, 'CREATE_SUPPLIER_BILL', 'SupplierBill', bill.id, { billNumber, totalAmount: bill.totalAmount });
    return bill;
  }

  // ==========================================
  // 6. EXPENSE MANAGEMENT
  // ==========================================
  public async getExpenses(tenantId: string): Promise<FinanceExpense[]> {
    return financeRepository.getExpenses(tenantId);
  }

  public async recordExpense(
    tenantId: string,
    userId: string,
    data: {
      category: FinanceExpense['category'];
      amount: number;
      expenseDate: string;
      paymentMethod: FinanceExpense['paymentMethod'];
      costCenterId?: string;
      projectId?: string;
      vehicleId?: string;
      employeeId?: string;
      description: string;
    }
  ): Promise<FinanceExpense> {
    if (!data.amount || data.amount <= 0 || !data.description) {
      throw new Error('Expense amount and description are required');
    }

    const count = (await financeRepository.getExpenses(tenantId)).length + 1;
    const expenseNumber = `EXP-${new Date().getFullYear()}-${count.toString().padStart(4, '0')}`;
    const now = new Date().toISOString();

    const expense: FinanceExpense = {
      id: generateUuidV7(),
      tenantId,
      expenseNumber,
      category: data.category,
      amount: Number(data.amount.toFixed(2)),
      expenseDate: data.expenseDate,
      paymentMethod: data.paymentMethod,
      costCenterId: data.costCenterId || 'cc-fleet',
      projectId: data.projectId,
      vehicleId: data.vehicleId,
      employeeId: data.employeeId,
      description: data.description,
      status: 'APPROVED',
      createdAt: now,
      updatedAt: now
    };

    await financeRepository.saveExpense(expense);

    // Auto-create & post Financial Journal for Expense
    const expAcc = data.category === 'Fuel' ? 'acc-5100' : 'acc-5400';
    const journal = await this.createJournal(tenantId, userId, {
      journalDate: data.expenseDate,
      referenceType: 'EXPENSE',
      referenceId: expense.id,
      description: `Expense ${expenseNumber}: ${data.description}`,
      lines: [
        {
          accountId: expAcc,
          debit: expense.amount,
          credit: 0,
          costCenterId: expense.costCenterId,
          projectId: expense.projectId,
          description: `Debit Expense - ${data.category}`
        },
        {
          accountId: 'acc-1010', // Bank Current Account
          debit: 0,
          credit: expense.amount,
          description: `Credit Cash/Bank for Expense ${expenseNumber}`
        }
      ]
    });
    await this.postJournal(tenantId, userId, journal.id);

    expense.journalId = journal.id;
    expense.status = 'POSTED';
    await financeRepository.saveExpense(expense);

    this.logAudit(tenantId, userId, 'RECORD_EXPENSE', 'FinanceExpense', expense.id, { expenseNumber, amount: expense.amount });
    return expense;
  }

  // ==========================================
  // 7. BANK & CASH RECONCILIATION
  // ==========================================
  public async getBankAccounts(tenantId: string): Promise<BankAccount[]> {
    return financeRepository.getBankAccounts(tenantId);
  }

  public async getBankTransactions(tenantId: string, bankAccountId?: string): Promise<BankTransaction[]> {
    return financeRepository.getBankTransactions(tenantId, bankAccountId);
  }

  public async reconcileBankStatement(
    tenantId: string,
    userId: string,
    data: {
      bankAccountId: string;
      statementDate: string;
      statementBalance: number;
    }
  ): Promise<BankReconciliation> {
    const bank = await financeRepository.getBankAccountById(tenantId, data.bankAccountId);
    if (!bank) throw new Error('Bank account not found');

    const txs = await financeRepository.getBankTransactions(tenantId, data.bankAccountId);
    const glBalance = bank.currentBalance;
    const difference = Math.abs(data.statementBalance - glBalance);

    const now = new Date().toISOString();
    const rec: BankReconciliation = {
      id: generateUuidV7(),
      tenantId,
      bankAccountId: data.bankAccountId,
      statementDate: data.statementDate,
      statementBalance: Number(data.statementBalance.toFixed(2)),
      glBalance: Number(glBalance.toFixed(2)),
      difference: Number(difference.toFixed(2)),
      status: difference === 0 ? 'RECONCILED' : 'DRAFT',
      reconciledBy: userId,
      reconciledAt: now,
      createdAt: now
    };

    await financeRepository.saveReconciliation(rec);

    // Mark matched transactions as reconciled
    for (const tx of txs) {
      if (tx.reconciliationStatus === 'MATCHED') {
        tx.reconciliationStatus = 'RECONCILED';
        await financeRepository.saveBankTransaction(tx);
      }
    }

    this.logAudit(tenantId, userId, 'BANK_RECONCILIATION', 'BankReconciliation', rec.id, { difference, status: rec.status });
    return rec;
  }

  // ==========================================
  // 8. FINANCIAL STATEMENTS & REPORTS ENGINE
  // ==========================================

  // General Ledger Report
  public async getGeneralLedgerReport(
    tenantId: string,
    accountId?: string,
    startDate?: string,
    endDate?: string
  ): Promise<any> {
    const accounts = await financeRepository.getAccounts(tenantId);
    const journals = await financeRepository.getJournals(tenantId);
    const allLines = await financeRepository.getJournalLines(tenantId);

    const postedJournals = journals.filter(j => j.status === 'POSTED');
    const postedJournalIds = new Set(postedJournals.map(j => j.id));

    let filteredLines = allLines.filter(l => postedJournalIds.has(l.journalId));

    if (accountId) {
      filteredLines = filteredLines.filter(l => l.accountId === accountId);
    }

    const reportEntries = filteredLines.map(line => {
      const j = postedJournals.find(pj => pj.id === line.journalId)!;
      const acc = accounts.find(a => a.id === line.accountId);
      return {
        lineId: line.id,
        journalNumber: j.journalNumber,
        journalDate: j.journalDate,
        accountCode: acc?.accountCode || 'N/A',
        accountName: acc?.accountName || 'Unknown',
        accountType: acc?.accountType || 'N/A',
        description: line.description || j.description,
        debit: line.debit,
        credit: line.credit,
        costCenterId: line.costCenterId,
        projectId: line.projectId
      };
    });

    let runningBalance = 0;
    const ledgerRows = reportEntries.map(entry => {
      if (entry.accountType === 'ASSET' || entry.accountType === 'EXPENSE') {
        runningBalance += entry.debit - entry.credit;
      } else {
        runningBalance += entry.credit - entry.debit;
      }
      return { ...entry, runningBalance: Number(runningBalance.toFixed(2)) };
    });

    return {
      tenantId,
      totalEntries: ledgerRows.length,
      rows: ledgerRows
    };
  }

  // Trial Balance Report
  public async getTrialBalanceReport(tenantId: string, asOfDate?: string): Promise<any> {
    const accounts = await financeRepository.getAccounts(tenantId);
    const journals = await financeRepository.getJournals(tenantId);
    const lines = await financeRepository.getJournalLines(tenantId);

    const postedJournals = journals.filter(j => j.status === 'POSTED');
    const postedIds = new Set(postedJournals.map(j => j.id));

    const rows = accounts.map(acc => {
      const accLines = lines.filter(l => l.accountId === acc.id && postedIds.has(l.journalId));
      const totalDebit = accLines.reduce((sum, l) => sum + l.debit, 0);
      const totalCredit = accLines.reduce((sum, l) => sum + l.credit, 0);
      let netDebit = 0;
      let netCredit = 0;

      if (acc.accountType === 'ASSET' || acc.accountType === 'EXPENSE') {
        const net = totalDebit - totalCredit;
        if (net >= 0) netDebit = net;
        else netCredit = Math.abs(net);
      } else {
        const net = totalCredit - totalDebit;
        if (net >= 0) netCredit = net;
        else netDebit = Math.abs(net);
      }

      return {
        accountId: acc.id,
        accountCode: acc.accountCode,
        accountName: acc.accountName,
        accountType: acc.accountType,
        totalDebit: Number(totalDebit.toFixed(2)),
        totalCredit: Number(totalCredit.toFixed(2)),
        netDebit: Number(netDebit.toFixed(2)),
        netCredit: Number(netCredit.toFixed(2))
      };
    });

    const sumDebit = rows.reduce((s, r) => s + r.netDebit, 0);
    const sumCredit = rows.reduce((s, r) => s + r.netCredit, 0);
    const isBalanced = Math.abs(sumDebit - sumCredit) < 0.01;

    return {
      tenantId,
      asOfDate: asOfDate || new Date().toISOString().split('T')[0],
      isBalanced,
      totalNetDebit: Number(sumDebit.toFixed(2)),
      totalNetCredit: Number(sumCredit.toFixed(2)),
      accounts: rows
    };
  }

  // Profit & Loss Statement (P&L)
  public async getProfitAndLossReport(tenantId: string, startDate?: string, endDate?: string): Promise<any> {
    const accounts = await financeRepository.getAccounts(tenantId);
    const journals = await financeRepository.getJournals(tenantId);
    const lines = await financeRepository.getJournalLines(tenantId);

    const postedIds = new Set(journals.filter(j => j.status === 'POSTED').map(j => j.id));

    const revenueAccounts = accounts.filter(a => a.accountType === 'REVENUE');
    const expenseAccounts = accounts.filter(a => a.accountType === 'EXPENSE');

    let totalRevenue = 0;
    const revenueDetails = revenueAccounts.map(acc => {
      const accLines = lines.filter(l => l.accountId === acc.id && postedIds.has(l.journalId));
      const amount = accLines.reduce((sum, l) => sum + (l.credit - l.debit), 0);
      totalRevenue += amount;
      return { accountCode: acc.accountCode, accountName: acc.accountName, amount: Number(amount.toFixed(2)) };
    });

    let totalExpenses = 0;
    const expenseDetails = expenseAccounts.map(acc => {
      const accLines = lines.filter(l => l.accountId === acc.id && postedIds.has(l.journalId));
      const amount = accLines.reduce((sum, l) => sum + (l.debit - l.credit), 0);
      totalExpenses += amount;
      return { accountCode: acc.accountCode, accountName: acc.accountName, amount: Number(amount.toFixed(2)) };
    });

    const grossProfit = totalRevenue;
    const netProfit = totalRevenue - totalExpenses;
    const netProfitMarginPct = totalRevenue > 0 ? Number(((netProfit / totalRevenue) * 100).toFixed(2)) : 0;

    return {
      tenantId,
      period: { startDate: startDate || '2026-04-01', endDate: endDate || new Date().toISOString().split('T')[0] },
      summary: {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        totalExpenses: Number(totalExpenses.toFixed(2)),
        grossProfit: Number(grossProfit.toFixed(2)),
        netProfit: Number(netProfit.toFixed(2)),
        netProfitMarginPct
      },
      revenueDetails,
      expenseDetails
    };
  }

  // Balance Sheet
  public async getBalanceSheetReport(tenantId: string, asOfDate?: string): Promise<any> {
    const accounts = await financeRepository.getAccounts(tenantId);
    const journals = await financeRepository.getJournals(tenantId);
    const lines = await financeRepository.getJournalLines(tenantId);

    const postedIds = new Set(journals.filter(j => j.status === 'POSTED').map(j => j.id));

    const assetAccounts = accounts.filter(a => a.accountType === 'ASSET');
    const liabilityAccounts = accounts.filter(a => a.accountType === 'LIABILITY');
    const equityAccounts = accounts.filter(a => a.accountType === 'EQUITY');

    let totalAssets = 0;
    const assetDetails = assetAccounts.map(acc => {
      const accLines = lines.filter(l => l.accountId === acc.id && postedIds.has(l.journalId));
      const balance = accLines.reduce((s, l) => s + (l.debit - l.credit), 0);
      totalAssets += balance;
      return { accountCode: acc.accountCode, accountName: acc.accountName, balance: Number(balance.toFixed(2)) };
    });

    let totalLiabilities = 0;
    const liabilityDetails = liabilityAccounts.map(acc => {
      const accLines = lines.filter(l => l.accountId === acc.id && postedIds.has(l.journalId));
      const balance = accLines.reduce((s, l) => s + (l.credit - l.debit), 0);
      totalLiabilities += balance;
      return { accountCode: acc.accountCode, accountName: acc.accountName, balance: Number(balance.toFixed(2)) };
    });

    let totalEquity = 0;
    const equityDetails = equityAccounts.map(acc => {
      const accLines = lines.filter(l => l.accountId === acc.id && postedIds.has(l.journalId));
      const balance = accLines.reduce((s, l) => s + (l.credit - l.debit), 0);
      totalEquity += balance;
      return { accountCode: acc.accountCode, accountName: acc.accountName, balance: Number(balance.toFixed(2)) };
    });

    // Add Net Income from P&L to Equity
    const pnl = await this.getProfitAndLossReport(tenantId);
    const netIncome = pnl.summary.netProfit;
    totalEquity += netIncome;
    equityDetails.push({ accountCode: '3999', accountName: 'Current Period Retained Net Income', balance: Number(netIncome.toFixed(2)) });

    const isEquationBalanced = Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01;

    return {
      tenantId,
      asOfDate: asOfDate || new Date().toISOString().split('T')[0],
      isEquationBalanced,
      summary: {
        totalAssets: Number(totalAssets.toFixed(2)),
        totalLiabilities: Number(totalLiabilities.toFixed(2)),
        totalEquity: Number(totalEquity.toFixed(2)),
        totalLiabilitiesAndEquity: Number((totalLiabilities + totalEquity).toFixed(2))
      },
      assetDetails,
      liabilityDetails,
      equityDetails
    };
  }

  // Aging Reports (AR & AP)
  public async getAgingReport(tenantId: string, type: 'AR' | 'AP'): Promise<any> {
    const today = new Date();

    if (type === 'AR') {
      const invoices = await financeRepository.getInvoices(tenantId);
      const openInvoices = invoices.filter(i => i.status !== 'PAID' && i.outstandingAmount > 0);

      const buckets = { current: 0, days1_30: 0, days31_60: 0, days61_90: 0, days90Plus: 0 };
      const items = openInvoices.map(inv => {
        const dueDate = new Date(inv.dueDate);
        const diffDays = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 3600 * 24));
        let bucket = 'Current';

        if (diffDays <= 0) buckets.current += inv.outstandingAmount;
        else if (diffDays <= 30) { buckets.days1_30 += inv.outstandingAmount; bucket = '1-30 Days'; }
        else if (diffDays <= 60) { buckets.days31_60 += inv.outstandingAmount; bucket = '31-60 Days'; }
        else if (diffDays <= 90) { buckets.days61_90 += inv.outstandingAmount; bucket = '61-90 Days'; }
        else { buckets.days90Plus += inv.outstandingAmount; bucket = '90+ Days'; }

        return {
          invoiceNumber: inv.invoiceNumber,
          customerId: inv.customerId,
          invoiceDate: inv.invoiceDate,
          dueDate: inv.dueDate,
          daysOverdue: diffDays > 0 ? diffDays : 0,
          totalAmount: inv.totalAmount,
          outstandingAmount: inv.outstandingAmount,
          bucket
        };
      });

      return { tenantId, type: 'AR', summaryBuckets: buckets, totalOutstanding: Object.values(buckets).reduce((a, b) => a + b, 0), items };
    } else {
      const bills = await financeRepository.getSupplierBills(tenantId);
      const openBills = bills.filter(b => b.status !== 'PAID' && b.outstandingAmount > 0);

      const buckets = { current: 0, days1_30: 0, days31_60: 0, days61_90: 0, days90Plus: 0 };
      const items = openBills.map(bill => {
        const dueDate = new Date(bill.dueDate);
        const diffDays = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 3600 * 24));
        let bucket = 'Current';

        if (diffDays <= 0) buckets.current += bill.outstandingAmount;
        else if (diffDays <= 30) { buckets.days1_30 += bill.outstandingAmount; bucket = '1-30 Days'; }
        else if (diffDays <= 60) { buckets.days31_60 += bill.outstandingAmount; bucket = '31-60 Days'; }
        else if (diffDays <= 90) { buckets.days61_90 += bill.outstandingAmount; bucket = '61-90 Days'; }
        else { buckets.days90Plus += bill.outstandingAmount; bucket = '90+ Days'; }

        return {
          billNumber: bill.billNumber,
          supplierName: bill.supplierName,
          billDate: bill.billDate,
          dueDate: bill.dueDate,
          daysOverdue: diffDays > 0 ? diffDays : 0,
          totalAmount: bill.totalAmount,
          outstandingAmount: bill.outstandingAmount,
          bucket
        };
      });

      return { tenantId, type: 'AP', summaryBuckets: buckets, totalOutstanding: Object.values(buckets).reduce((a, b) => a + b, 0), items };
    }
  }

  // Financial Dashboard Executive Metrics
  public async getDashboardMetrics(tenantId: string): Promise<any> {
    const pnl = await this.getProfitAndLossReport(tenantId);
    const bs = await this.getBalanceSheetReport(tenantId);
    const arAging = await this.getAgingReport(tenantId, 'AR');
    const apAging = await this.getAgingReport(tenantId, 'AP');
    const bankAccounts = await financeRepository.getBankAccounts(tenantId);

    const totalBankCashBalance = bankAccounts.reduce((sum, b) => sum + b.currentBalance, 0);
    const totalArOutstanding = arAging.totalOutstanding;
    const totalApOutstanding = apAging.totalOutstanding;

    const invoices = await financeRepository.getInvoices(tenantId);
    const overdueInvoicesCount = invoices.filter(i => i.outstandingAmount > 0 && new Date(i.dueDate) < new Date()).length;

    return {
      tenantId,
      asOfDate: new Date().toISOString(),
      revenue: pnl.summary.totalRevenue,
      expenses: pnl.summary.totalExpenses,
      netProfit: pnl.summary.netProfit,
      netProfitMarginPct: pnl.summary.netProfitMarginPct,
      cashAndBankBalance: totalBankCashBalance,
      accountsReceivableOutstanding: totalArOutstanding,
      accountsPayableOutstanding: totalApOutstanding,
      overdueInvoicesCount,
      totalAssets: bs.summary.totalAssets,
      totalLiabilities: bs.summary.totalLiabilities,
      totalEquity: bs.summary.totalEquity
    };
  }
}

export const financeService = new FinanceService();
