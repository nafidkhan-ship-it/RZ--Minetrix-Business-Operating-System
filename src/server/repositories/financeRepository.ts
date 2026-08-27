import pg from 'pg';
import { generateUuidV7 } from '../db/database.js';
import { withTenantTransaction } from '../db/tenantContext.js';
import {
  FinanceAccountRecord,
  FinanceExpenseRecord,
  FinanceInvoiceRecord,
  FinanceJournalEntryRecord,
  FinanceJournalRecord,
  FinancePaymentRecord,
  FinanceTransactionRecord,
  calculateInvoiceTotals,
  InvoiceLineInput,
  roundMoney
} from '../db/finance/financeTypes.js';
import { ErpServiceError, isUniqueViolation } from '../services/erpErrors.js';

function isoDate(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  const raw = String(value);
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
    return raw.slice(0, 10);
  }
  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }
  return raw.slice(0, 10);
}

export class FinanceRepository {
  async createAccount(tenantId: string, input: {
    code: string;
    name: string;
    category: FinanceAccountRecord['category'];
    parentAccountId?: string;
    description?: string;
  }): Promise<FinanceAccountRecord> {
    const id = generateUuidV7();
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `INSERT INTO finance_accounts (id, tenant_id, code, name, category, parent_account_id, description)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
        [id, tenantId, input.code.trim().toUpperCase(), input.name.trim(), input.category, input.parentAccountId || null, input.description || null]
      );
      return this.mapAccount(result.rows[0]);
    });
  }

  async listAccounts(tenantId: string): Promise<FinanceAccountRecord[]> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `SELECT * FROM finance_accounts WHERE tenant_id = $1 AND status = 'ACTIVE' ORDER BY code`,
        [tenantId]
      );
      return result.rows.map((row) => this.mapAccount(row));
    });
  }

  async getAccountByCode(tenantId: string, code: string): Promise<FinanceAccountRecord | null> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `SELECT * FROM finance_accounts WHERE tenant_id = $1 AND code = $2 LIMIT 1`,
        [tenantId, code.trim().toUpperCase()]
      );
      return result.rows[0] ? this.mapAccount(result.rows[0]) : null;
    });
  }

  async createTransactionFromSettlement(
    tenantId: string,
    input: { settlementId: string; transactionNumber: string; createdBy?: string }
  ): Promise<FinanceTransactionRecord> {
    return withTenantTransaction(tenantId, async (client) => {
      const settlement = await client.query(
        `SELECT s.*, d.customer_id, d.id AS linked_dispatch_id
         FROM erp_settlements s
         LEFT JOIN erp_dispatches d ON d.id = s.dispatch_id AND d.tenant_id = s.tenant_id
         WHERE s.tenant_id = $1 AND s.id = $2`,
        [tenantId, input.settlementId]
      );
      if (!settlement.rows[0]) {
        throw new ErpServiceError('NOT_FOUND', 'Settlement not found.', 404);
      }
      const row = settlement.rows[0];
      if (row.status === 'CANCELLED') {
        throw new ErpServiceError('BAD_REQUEST', 'Cannot create finance transaction from cancelled settlement.');
      }

      const existing = await client.query(
        `SELECT id FROM finance_transactions
         WHERE tenant_id = $1 AND source_module = 'ERP' AND source_record_type = 'SETTLEMENT' AND source_record_id = $2`,
        [tenantId, input.settlementId]
      );
      if (existing.rows[0]) {
        throw new ErpServiceError('DUPLICATE_TRANSACTION', 'Finance transaction already exists for this settlement.', 409);
      }

      const id = generateUuidV7();
      const txnDate = isoDate(row.created_at);
      const amount = Number(row.net_amount);
      const result = await client.query(
        `INSERT INTO finance_transactions (
          id, tenant_id, transaction_number, source_module, source_record_type, source_record_id,
          dispatch_id, settlement_id, transaction_date, amount, currency, status, description, created_by
        ) VALUES ($1,$2,$3,'ERP','SETTLEMENT',$4,$5,$6,$7,$8,'INR','POSTED',$9,$10)
        RETURNING *`,
        [
          id,
          tenantId,
          input.transactionNumber.trim().toUpperCase(),
          input.settlementId,
          row.dispatch_id || row.linked_dispatch_id || null,
          input.settlementId,
          txnDate,
          amount,
          `Settlement ${row.settlement_number} (${row.basis})`,
          input.createdBy || null
        ]
      );
      const txn = this.mapTransaction(result.rows[0]);
      const journal = await this.postJournalForTransaction(client, tenantId, txn, input.createdBy);
      await client.query(`UPDATE finance_transactions SET journal_id = $3 WHERE tenant_id = $1 AND id = $2`, [tenantId, id, journal.id]);
      txn.journalId = journal.id;
      return txn;
    });
  }

  async createTransactionFromOrder(
    tenantId: string,
    input: { orderId: string; transactionNumber: string; createdBy?: string }
  ): Promise<FinanceTransactionRecord> {
    return withTenantTransaction(tenantId, async (client) => {
      const order = await client.query(
        `SELECT * FROM erp_orders WHERE tenant_id = $1 AND id = $2`,
        [tenantId, input.orderId]
      );
      if (!order.rows[0]) {
        throw new ErpServiceError('NOT_FOUND', 'Order not found.', 404);
      }
      const row = order.rows[0];
      if (row.status === 'CANCELLED' || row.status === 'DRAFT') {
        throw new ErpServiceError('BAD_REQUEST', 'Finance transaction requires a confirmed or dispatched order.');
      }

      const existing = await client.query(
        `SELECT id FROM finance_transactions
         WHERE tenant_id = $1 AND source_module = 'ERP' AND source_record_type = 'ORDER' AND source_record_id = $2`,
        [tenantId, input.orderId]
      );
      if (existing.rows[0]) {
        throw new ErpServiceError('DUPLICATE_TRANSACTION', 'Finance transaction already exists for this order.', 409);
      }

      const id = generateUuidV7();
      const txnDate = isoDate(row.confirmed_at || row.created_at);
      const amount = Number(row.total_amount);
      const result = await client.query(
        `INSERT INTO finance_transactions (
          id, tenant_id, transaction_number, source_module, source_record_type, source_record_id,
          customer_id, order_id, transaction_date, amount, currency, status, description, created_by
        ) VALUES ($1,$2,$3,'ERP','ORDER',$4,$5,$6,$7,$8,'INR','POSTED',$9,$10)
        RETURNING *`,
        [
          id,
          tenantId,
          input.transactionNumber.trim().toUpperCase(),
          input.orderId,
          row.customer_id,
          input.orderId,
          txnDate,
          amount,
          `Sales order ${row.order_number}`,
          input.createdBy || null
        ]
      );
      const txn = this.mapTransaction(result.rows[0]);
      const journal = await this.postJournalForTransaction(client, tenantId, txn, input.createdBy, 'REVENUE');
      await client.query(`UPDATE finance_transactions SET journal_id = $3 WHERE tenant_id = $1 AND id = $2`, [tenantId, id, journal.id]);
      txn.journalId = journal.id;
      return txn;
    });
  }

  async createTransactionFromDispatch(
    tenantId: string,
    input: { dispatchId: string; transactionNumber: string; createdBy?: string }
  ): Promise<FinanceTransactionRecord> {
    return withTenantTransaction(tenantId, async (client) => {
      const dispatch = await client.query(
        `SELECT * FROM erp_dispatches WHERE tenant_id = $1 AND id = $2`,
        [tenantId, input.dispatchId]
      );
      if (!dispatch.rows[0]) {
        throw new ErpServiceError('NOT_FOUND', 'Dispatch not found.', 404);
      }
      const row = dispatch.rows[0];
      if (row.status === 'CANCELLED') {
        throw new ErpServiceError('BAD_REQUEST', 'Cannot create finance transaction from cancelled dispatch.');
      }

      const existing = await client.query(
        `SELECT id FROM finance_transactions
         WHERE tenant_id = $1 AND source_module = 'ERP' AND source_record_type = 'DISPATCH' AND source_record_id = $2`,
        [tenantId, input.dispatchId]
      );
      if (existing.rows[0]) {
        throw new ErpServiceError('DUPLICATE_TRANSACTION', 'Finance transaction already exists for this dispatch.', 409);
      }

      const orderRes = await client.query(
        `SELECT o.id, o.total_amount, o.order_number
         FROM erp_orders o
         JOIN erp_gate_passes gp ON gp.id = $2 AND gp.tenant_id = o.tenant_id
         WHERE o.tenant_id = $1 AND o.gate_pass_id = gp.id
         LIMIT 1`,
        [tenantId, row.gate_pass_id]
      );
      let amount = 0;
      let orderId: string | null = null;
      if (orderRes.rows[0]) {
        amount = Number(orderRes.rows[0].total_amount);
        orderId = String(orderRes.rows[0].id);
      } else {
        const qtyRes = await client.query(
          `SELECT COALESCE(SUM(dl.quantity), 0) AS qty FROM erp_dispatch_lines dl WHERE dl.tenant_id = $1 AND dl.dispatch_id = $2`,
          [tenantId, input.dispatchId]
        );
        const qty = Number(qtyRes.rows[0]?.qty || 0);
        amount = roundMoney(qty * 640);
      }

      const id = generateUuidV7();
      const txnDate = isoDate(row.dispatched_at);
      const result = await client.query(
        `INSERT INTO finance_transactions (
          id, tenant_id, transaction_number, source_module, source_record_type, source_record_id,
          customer_id, order_id, dispatch_id, transaction_date, amount, currency, status, description, created_by
        ) VALUES ($1,$2,$3,'ERP','DISPATCH',$4,$5,$6,$7,$8,$9,'INR','POSTED',$10,$11)
        RETURNING *`,
        [
          id,
          tenantId,
          input.transactionNumber.trim().toUpperCase(),
          input.dispatchId,
          row.customer_id,
          orderId,
          input.dispatchId,
          txnDate,
          amount,
          `Dispatch ${row.dispatch_number}`,
          input.createdBy || null
        ]
      );
      const txn = this.mapTransaction(result.rows[0]);
      const journal = await this.postJournalForTransaction(client, tenantId, txn, input.createdBy, 'REVENUE');
      await client.query(`UPDATE finance_transactions SET journal_id = $3 WHERE tenant_id = $1 AND id = $2`, [tenantId, id, journal.id]);
      txn.journalId = journal.id;
      return txn;
    });
  }

  async listTransactions(tenantId: string, filters?: {
    customerId?: string;
    orderId?: string;
    sourceModule?: string;
    limit?: number;
    offset?: number;
  }): Promise<FinanceTransactionRecord[]> {
    return withTenantTransaction(tenantId, async (client) => {
      const conditions = ['tenant_id = $1'];
      const params: unknown[] = [tenantId];
      let idx = 2;
      if (filters?.customerId) {
        conditions.push(`customer_id = $${idx++}`);
        params.push(filters.customerId);
      }
      if (filters?.orderId) {
        conditions.push(`order_id = $${idx++}`);
        params.push(filters.orderId);
      }
      if (filters?.sourceModule) {
        conditions.push(`source_module = $${idx++}`);
        params.push(filters.sourceModule);
      }
      const limit = Math.min(filters?.limit || 100, 500);
      const offset = filters?.offset || 0;
      const result = await client.query(
        `SELECT * FROM finance_transactions WHERE ${conditions.join(' AND ')} ORDER BY transaction_date DESC, created_at DESC LIMIT $${idx++} OFFSET $${idx}`,
        [...params, limit, offset]
      );
      return result.rows.map((row) => this.mapTransaction(row));
    });
  }

  async getTransaction(tenantId: string, id: string): Promise<FinanceTransactionRecord | null> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `SELECT * FROM finance_transactions WHERE tenant_id = $1 AND id = $2 LIMIT 1`,
        [tenantId, id]
      );
      return result.rows[0] ? this.mapTransaction(result.rows[0]) : null;
    });
  }

  async createInvoice(
    tenantId: string,
    input: {
      invoiceNumber: string;
      customerId: string;
      orderId?: string;
      invoiceDate: string;
      dueDate: string;
      lines: InvoiceLineInput[];
      discountAmount?: number;
      notes?: string;
      createdBy?: string;
      issueImmediately?: boolean;
    }
  ): Promise<FinanceInvoiceRecord> {
    const id = generateUuidV7();
    return withTenantTransaction(tenantId, async (client) => {
      if (input.orderId) {
        const dup = await client.query(
          `SELECT id FROM finance_invoices WHERE tenant_id = $1 AND order_id = $2`,
          [tenantId, input.orderId]
        );
        if (dup.rows[0]) {
          throw new ErpServiceError('DUPLICATE_INVOICE', 'An invoice already exists for this order.', 409);
        }
        const order = await client.query(
          `SELECT customer_id, status FROM erp_orders WHERE tenant_id = $1 AND id = $2`,
          [tenantId, input.orderId]
        );
        if (!order.rows[0] || order.rows[0].status === 'CANCELLED') {
          throw new ErpServiceError('BAD_REQUEST', 'Order not found or cancelled.');
        }
        if (String(order.rows[0].customer_id) !== input.customerId) {
          throw new ErpServiceError('BAD_REQUEST', 'Customer does not match order.');
        }
      }

      const totals = calculateInvoiceTotals(input.lines, input.discountAmount || 0);
      const status = input.issueImmediately ? 'ISSUED' : 'DRAFT';
      const result = await client.query(
        `INSERT INTO finance_invoices (
          id, tenant_id, invoice_number, customer_id, order_id, invoice_date, due_date,
          subtotal, tax_amount, discount_amount, grand_total, status, notes, created_by, issued_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
        RETURNING *`,
        [
          id,
          tenantId,
          input.invoiceNumber.trim().toUpperCase(),
          input.customerId,
          input.orderId || null,
          input.invoiceDate,
          input.dueDate,
          totals.subtotal,
          totals.taxAmount,
          input.discountAmount || 0,
          totals.grandTotal,
          status,
          input.notes || null,
          input.createdBy || null,
          input.issueImmediately ? new Date().toISOString() : null
        ]
      );

      for (let i = 0; i < input.lines.length; i++) {
        const line = input.lines[i];
        const lt = totals.lineTotals[i];
        await client.query(
          `INSERT INTO finance_invoice_lines (
            id, tenant_id, invoice_id, product_id, product_size_id, description,
            quantity, quantity_uom, unit_price, line_subtotal, tax_percent, tax_amount, line_total
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
          [
            generateUuidV7(),
            tenantId,
            id,
            line.productId || null,
            line.productSizeId || null,
            line.description,
            line.quantity,
            line.quantityUom || 'TON',
            line.unitPrice,
            lt.lineSubtotal,
            line.taxPercent || 0,
            lt.taxAmount,
            lt.lineTotal
          ]
        );
      }

      return this.loadInvoice(client, tenantId, id, result.rows[0]);
    });
  }

  async issueInvoice(tenantId: string, invoiceId: string): Promise<FinanceInvoiceRecord> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `UPDATE finance_invoices SET status = 'ISSUED', issued_at = NOW(), updated_at = NOW()
         WHERE tenant_id = $1 AND id = $2 AND status = 'DRAFT' RETURNING *`,
        [tenantId, invoiceId]
      );
      if (!result.rows[0]) {
        const existing = await client.query(`SELECT status FROM finance_invoices WHERE tenant_id = $1 AND id = $2`, [tenantId, invoiceId]);
        if (!existing.rows[0]) throw new ErpServiceError('NOT_FOUND', 'Invoice not found.', 404);
        throw new ErpServiceError('INVALID_TRANSITION', 'Only DRAFT invoices can be issued.');
      }
      return this.loadInvoice(client, tenantId, invoiceId, result.rows[0]);
    });
  }

  async listInvoices(tenantId: string, customerId?: string): Promise<FinanceInvoiceRecord[]> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = customerId
        ? await client.query(`SELECT * FROM finance_invoices WHERE tenant_id = $1 AND customer_id = $2 ORDER BY invoice_date DESC`, [tenantId, customerId])
        : await client.query(`SELECT * FROM finance_invoices WHERE tenant_id = $1 ORDER BY invoice_date DESC`, [tenantId]);
      const invoices: FinanceInvoiceRecord[] = [];
      for (const row of result.rows) {
        invoices.push(await this.loadInvoice(client, tenantId, String(row.id), row));
      }
      return invoices;
    });
  }

  async getInvoice(tenantId: string, id: string): Promise<FinanceInvoiceRecord | null> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(`SELECT * FROM finance_invoices WHERE tenant_id = $1 AND id = $2`, [tenantId, id]);
      if (!result.rows[0]) return null;
      return this.loadInvoice(client, tenantId, id, result.rows[0]);
    });
  }

  async createPayment(
    tenantId: string,
    input: {
      paymentNumber: string;
      invoiceId: string;
      amount: number;
      paymentDate: string;
      paymentMethod: FinancePaymentRecord['paymentMethod'];
      paymentReference?: string;
      notes?: string;
      createdBy?: string;
    }
  ): Promise<FinancePaymentRecord> {
    const id = generateUuidV7();
    return withTenantTransaction(tenantId, async (client) => {
      const invoice = await client.query(
        `SELECT * FROM finance_invoices WHERE tenant_id = $1 AND id = $2 FOR UPDATE`,
        [tenantId, input.invoiceId]
      );
      if (!invoice.rows[0]) throw new ErpServiceError('NOT_FOUND', 'Invoice not found.', 404);
      const inv = invoice.rows[0];
      if (inv.status === 'CANCELLED' || inv.status === 'DRAFT') {
        throw new ErpServiceError('BAD_REQUEST', 'Payments require an issued invoice.');
      }

      const paidRes = await client.query(
        `SELECT COALESCE(SUM(amount), 0) AS paid FROM finance_payments WHERE tenant_id = $1 AND invoice_id = $2 AND status = 'POSTED'`,
        [tenantId, input.invoiceId]
      );
      const paid = Number(paidRes.rows[0].paid);
      const outstanding = roundMoney(Number(inv.grand_total) - paid);
      if (input.amount <= 0) throw new ErpServiceError('BAD_REQUEST', 'Payment amount must be positive.');
      if (input.amount > outstanding) {
        throw new ErpServiceError('OVERPAYMENT', `Payment exceeds outstanding amount (${outstanding}).`);
      }

      if (input.paymentReference) {
        const dupRef = await client.query(
          `SELECT id FROM finance_payments WHERE tenant_id = $1 AND payment_reference = $2`,
          [tenantId, input.paymentReference]
        );
        if (dupRef.rows[0]) {
          throw new ErpServiceError('DUPLICATE_PAYMENT', 'Payment reference already exists.', 409);
        }
      }

      const result = await client.query(
        `INSERT INTO finance_payments (
          id, tenant_id, payment_number, invoice_id, amount, payment_date, payment_method,
          payment_reference, status, notes, created_by
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'POSTED',$9,$10) RETURNING *`,
        [
          id,
          tenantId,
          input.paymentNumber.trim().toUpperCase(),
          input.invoiceId,
          input.amount,
          input.paymentDate,
          input.paymentMethod,
          input.paymentReference || null,
          input.notes || null,
          input.createdBy || null
        ]
      );

      const newPaid = roundMoney(paid + input.amount);
      const grandTotal = Number(inv.grand_total);
      let newStatus = 'ISSUED';
      if (newPaid >= grandTotal) newStatus = 'PAID';
      else if (newPaid > 0) newStatus = 'PARTIALLY_PAID';
      await client.query(
        `UPDATE finance_invoices SET status = $3, updated_at = NOW() WHERE tenant_id = $1 AND id = $2`,
        [tenantId, input.invoiceId, newStatus]
      );

      return this.mapPayment(result.rows[0]);
    });
  }

  async listPayments(tenantId: string, invoiceId?: string): Promise<FinancePaymentRecord[]> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = invoiceId
        ? await client.query(`SELECT * FROM finance_payments WHERE tenant_id = $1 AND invoice_id = $2 ORDER BY payment_date DESC`, [tenantId, invoiceId])
        : await client.query(`SELECT * FROM finance_payments WHERE tenant_id = $1 ORDER BY payment_date DESC`, [tenantId]);
      return result.rows.map((row) => this.mapPayment(row));
    });
  }

  async createExpense(tenantId: string, input: {
    expenseNumber: string;
    category: string;
    amount: number;
    expenseDate: string;
    vendorName?: string;
    reference?: string;
    attachmentRef?: string;
    notes?: string;
    createdBy?: string;
  }): Promise<FinanceExpenseRecord> {
    const id = generateUuidV7();
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `INSERT INTO finance_expenses (
          id, tenant_id, expense_number, category, amount, expense_date, vendor_name,
          reference, attachment_ref, approval_status, notes, created_by
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'DRAFT',$10,$11) RETURNING *`,
        [
          id, tenantId, input.expenseNumber.trim().toUpperCase(), input.category.trim(),
          input.amount, input.expenseDate, input.vendorName || null, input.reference || null,
          input.attachmentRef || null, input.notes || null, input.createdBy || null
        ]
      );
      return this.mapExpense(result.rows[0]);
    });
  }

  async transitionExpense(tenantId: string, expenseId: string, status: FinanceExpenseRecord['approvalStatus'], actorId?: string): Promise<FinanceExpenseRecord> {
    return withTenantTransaction(tenantId, async (client) => {
      const current = await client.query(`SELECT approval_status FROM finance_expenses WHERE tenant_id = $1 AND id = $2`, [tenantId, expenseId]);
      if (!current.rows[0]) throw new ErpServiceError('NOT_FOUND', 'Expense not found.', 404);
      const from = String(current.rows[0].approval_status);
      const allowed: Record<string, string[]> = {
        DRAFT: ['SUBMITTED'],
        SUBMITTED: ['APPROVED', 'REJECTED'],
        APPROVED: ['PAID'],
        REJECTED: [],
        PAID: []
      };
      if (!allowed[from]?.includes(status)) {
        throw new ErpServiceError('INVALID_TRANSITION', `Cannot transition expense from ${from} to ${status}.`);
      }
      let result;
      if (status === 'SUBMITTED') {
        result = await client.query(
          `UPDATE finance_expenses SET approval_status = $3, submitted_by = $4, updated_at = NOW() WHERE tenant_id = $1 AND id = $2 RETURNING *`,
          [tenantId, expenseId, status, actorId || null]
        );
      } else if (status === 'APPROVED') {
        result = await client.query(
          `UPDATE finance_expenses SET approval_status = $3, approved_by = $4, updated_at = NOW() WHERE tenant_id = $1 AND id = $2 RETURNING *`,
          [tenantId, expenseId, status, actorId || null]
        );
      } else if (status === 'REJECTED') {
        result = await client.query(
          `UPDATE finance_expenses SET approval_status = $3, rejected_by = $4, updated_at = NOW() WHERE tenant_id = $1 AND id = $2 RETURNING *`,
          [tenantId, expenseId, status, actorId || null]
        );
      } else {
        result = await client.query(
          `UPDATE finance_expenses SET approval_status = $3, updated_at = NOW() WHERE tenant_id = $1 AND id = $2 RETURNING *`,
          [tenantId, expenseId, status]
        );
      }
      return this.mapExpense(result.rows[0]);
    });
  }

  async listExpenses(tenantId: string): Promise<FinanceExpenseRecord[]> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(`SELECT * FROM finance_expenses WHERE tenant_id = $1 ORDER BY expense_date DESC`, [tenantId]);
      return result.rows.map((row) => this.mapExpense(row));
    });
  }

  async getJournal(tenantId: string, id: string): Promise<FinanceJournalRecord | null> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(`SELECT * FROM finance_journals WHERE tenant_id = $1 AND id = $2`, [tenantId, id]);
      if (!result.rows[0]) return null;
      const entries = await client.query(`SELECT * FROM finance_journal_entries WHERE tenant_id = $1 AND journal_id = $2`, [tenantId, id]);
      const journal = this.mapJournal(result.rows[0]);
      journal.entries = entries.rows.map((row) => this.mapJournalEntry(row));
      return journal;
    });
  }

  private async postJournalForTransaction(
    client: pg.PoolClient,
    tenantId: string,
    txn: FinanceTransactionRecord,
    createdBy?: string,
    debitCategory: 'EXPENSE' | 'REVENUE' = 'EXPENSE'
  ): Promise<FinanceJournalRecord> {
    const debitCode = debitCategory === 'REVENUE' ? 'AR-TRADE' : 'EXP-LANDOWNER';
    const creditCode = debitCategory === 'REVENUE' ? 'REV-SALES' : 'LIAB-LANDOWNER';
    await this.ensureDefaultAccounts(client, tenantId);
    const debitRes = await client.query(`SELECT * FROM finance_accounts WHERE tenant_id = $1 AND code = $2`, [tenantId, debitCode]);
    const creditRes = await client.query(`SELECT * FROM finance_accounts WHERE tenant_id = $1 AND code = $2`, [tenantId, creditCode]);
    const debitAccount = debitRes.rows[0] ? this.mapAccount(debitRes.rows[0]) : null;
    const creditAccount = creditRes.rows[0] ? this.mapAccount(creditRes.rows[0]) : null;
    if (!debitAccount || !creditAccount) {
      throw new ErpServiceError('ACCOUNT_NOT_FOUND', 'Required default accounts are missing.');
    }

    const journalId = generateUuidV7();
    const journalNumber = `J-${txn.transactionNumber}`;
    const journal = await client.query(
      `INSERT INTO finance_journals (id, tenant_id, journal_number, journal_date, description, source_transaction_id, status, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,'POSTED',$7) RETURNING *`,
      [journalId, tenantId, journalNumber, txn.transactionDate, txn.description || txn.transactionNumber, txn.id, createdBy || null]
    );

    await client.query(
      `INSERT INTO finance_journal_entries (id, tenant_id, journal_id, account_id, entry_type, amount, description)
       VALUES ($1,$2,$3,$4,'DEBIT',$5,$6)`,
      [generateUuidV7(), tenantId, journalId, debitAccount.id, txn.amount, `Debit ${debitCode}`]
    );
    await client.query(
      `INSERT INTO finance_journal_entries (id, tenant_id, journal_id, account_id, entry_type, amount, description)
       VALUES ($1,$2,$3,$4,'CREDIT',$5,$6)`,
      [generateUuidV7(), tenantId, journalId, creditAccount.id, txn.amount, `Credit ${creditCode}`]
    );

    const mapped = this.mapJournal(journal.rows[0]);
    const entries = await client.query(`SELECT * FROM finance_journal_entries WHERE tenant_id = $1 AND journal_id = $2`, [tenantId, journalId]);
    mapped.entries = entries.rows.map((row) => this.mapJournalEntry(row));
    return mapped;
  }

  private async ensureDefaultAccounts(client: pg.PoolClient, tenantId: string): Promise<void> {
    const defaults = [
      { code: 'AR-TRADE', name: 'Trade Receivables', category: 'ASSET' },
      { code: 'REV-SALES', name: 'Sales Revenue', category: 'REVENUE' },
      { code: 'EXP-LANDOWNER', name: 'Landowner Settlement Expense', category: 'EXPENSE' },
      { code: 'LIAB-LANDOWNER', name: 'Landowner Payable', category: 'LIABILITY' },
      { code: 'CASH-BANK', name: 'Cash and Bank', category: 'ASSET' }
    ];
    for (const acc of defaults) {
      const exists = await client.query(`SELECT 1 FROM finance_accounts WHERE tenant_id = $1 AND code = $2`, [tenantId, acc.code]);
      if (!exists.rows[0]) {
        await client.query(
          `INSERT INTO finance_accounts (id, tenant_id, code, name, category) VALUES ($1,$2,$3,$4,$5)`,
          [generateUuidV7(), tenantId, acc.code, acc.name, acc.category]
        );
      }
    }
  }

  private async loadInvoice(client: pg.PoolClient, tenantId: string, id: string, row: pg.QueryResultRow): Promise<FinanceInvoiceRecord> {
    const lines = await client.query(`SELECT * FROM finance_invoice_lines WHERE tenant_id = $1 AND invoice_id = $2`, [tenantId, id]);
    const paidRes = await client.query(
      `SELECT COALESCE(SUM(amount), 0) AS paid FROM finance_payments WHERE tenant_id = $1 AND invoice_id = $2 AND status = 'POSTED'`,
      [tenantId, id]
    );
    const paid = Number(paidRes.rows[0].paid);
    const invoice = this.mapInvoice(row);
    invoice.lines = lines.rows.map((l) => this.mapInvoiceLine(l));
    invoice.paidAmount = paid;
    invoice.outstandingAmount = roundMoney(Number(row.grand_total) - paid);
    return invoice;
  }

  private mapAccount(row: pg.QueryResultRow): FinanceAccountRecord {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      code: String(row.code),
      name: String(row.name),
      category: row.category as FinanceAccountRecord['category'],
      parentAccountId: row.parent_account_id ? String(row.parent_account_id) : undefined,
      description: row.description ? String(row.description) : undefined,
      status: String(row.status),
      createdAt: new Date(row.created_at).toISOString(),
      updatedAt: new Date(row.updated_at).toISOString()
    };
  }

  private mapTransaction(row: pg.QueryResultRow): FinanceTransactionRecord {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      transactionNumber: String(row.transaction_number),
      sourceModule: String(row.source_module),
      sourceRecordType: String(row.source_record_type),
      sourceRecordId: String(row.source_record_id),
      customerId: row.customer_id ? String(row.customer_id) : undefined,
      orderId: row.order_id ? String(row.order_id) : undefined,
      dispatchId: row.dispatch_id ? String(row.dispatch_id) : undefined,
      settlementId: row.settlement_id ? String(row.settlement_id) : undefined,
      transactionDate: isoDate(row.transaction_date),
      amount: Number(row.amount),
      currency: String(row.currency),
      status: row.status as FinanceTransactionRecord['status'],
      description: row.description ? String(row.description) : undefined,
      journalId: row.journal_id ? String(row.journal_id) : undefined,
      createdBy: row.created_by ? String(row.created_by) : undefined,
      createdAt: new Date(row.created_at).toISOString(),
      updatedAt: new Date(row.updated_at).toISOString()
    };
  }

  private mapJournal(row: pg.QueryResultRow): FinanceJournalRecord {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      journalNumber: String(row.journal_number),
      journalDate: isoDate(row.journal_date),
      description: row.description ? String(row.description) : undefined,
      sourceTransactionId: row.source_transaction_id ? String(row.source_transaction_id) : undefined,
      status: String(row.status),
      createdBy: row.created_by ? String(row.created_by) : undefined,
      createdAt: new Date(row.created_at).toISOString(),
      updatedAt: new Date(row.updated_at).toISOString()
    };
  }

  private mapJournalEntry(row: pg.QueryResultRow): FinanceJournalEntryRecord {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      journalId: String(row.journal_id),
      accountId: String(row.account_id),
      entryType: row.entry_type as 'DEBIT' | 'CREDIT',
      amount: Number(row.amount),
      description: row.description ? String(row.description) : undefined
    };
  }

  private mapInvoice(row: pg.QueryResultRow): FinanceInvoiceRecord {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      invoiceNumber: String(row.invoice_number),
      customerId: String(row.customer_id),
      orderId: row.order_id ? String(row.order_id) : undefined,
      invoiceDate: isoDate(row.invoice_date),
      dueDate: isoDate(row.due_date),
      subtotal: Number(row.subtotal),
      taxAmount: Number(row.tax_amount),
      discountAmount: Number(row.discount_amount),
      grandTotal: Number(row.grand_total),
      status: row.status as FinanceInvoiceRecord['status'],
      notes: row.notes ? String(row.notes) : undefined,
      financeTransactionId: row.finance_transaction_id ? String(row.finance_transaction_id) : undefined,
      createdBy: row.created_by ? String(row.created_by) : undefined,
      issuedAt: row.issued_at ? new Date(row.issued_at).toISOString() : undefined,
      createdAt: new Date(row.created_at).toISOString(),
      updatedAt: new Date(row.updated_at).toISOString()
    };
  }

  private mapInvoiceLine(row: pg.QueryResultRow): FinanceInvoiceRecord['lines'][0] {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      invoiceId: String(row.invoice_id),
      productId: row.product_id ? String(row.product_id) : undefined,
      productSizeId: row.product_size_id ? String(row.product_size_id) : undefined,
      description: String(row.description),
      quantity: Number(row.quantity),
      quantityUom: String(row.quantity_uom),
      unitPrice: Number(row.unit_price),
      lineSubtotal: Number(row.line_subtotal),
      taxPercent: Number(row.tax_percent),
      taxAmount: Number(row.tax_amount),
      lineTotal: Number(row.line_total)
    };
  }

  private mapPayment(row: pg.QueryResultRow): FinancePaymentRecord {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      paymentNumber: String(row.payment_number),
      invoiceId: String(row.invoice_id),
      amount: Number(row.amount),
      paymentDate: isoDate(row.payment_date),
      paymentMethod: row.payment_method as FinancePaymentRecord['paymentMethod'],
      paymentReference: row.payment_reference ? String(row.payment_reference) : undefined,
      status: String(row.status),
      notes: row.notes ? String(row.notes) : undefined,
      createdBy: row.created_by ? String(row.created_by) : undefined,
      createdAt: new Date(row.created_at).toISOString(),
      updatedAt: new Date(row.updated_at).toISOString()
    };
  }

  private mapExpense(row: pg.QueryResultRow): FinanceExpenseRecord {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      expenseNumber: String(row.expense_number),
      category: String(row.category),
      amount: Number(row.amount),
      expenseDate: isoDate(row.expense_date),
      vendorName: row.vendor_name ? String(row.vendor_name) : undefined,
      reference: row.reference ? String(row.reference) : undefined,
      attachmentRef: row.attachment_ref ? String(row.attachment_ref) : undefined,
      approvalStatus: row.approval_status as FinanceExpenseRecord['approvalStatus'],
      notes: row.notes ? String(row.notes) : undefined,
      createdBy: row.created_by ? String(row.created_by) : undefined,
      createdAt: new Date(row.created_at).toISOString(),
      updatedAt: new Date(row.updated_at).toISOString()
    };
  }
}
