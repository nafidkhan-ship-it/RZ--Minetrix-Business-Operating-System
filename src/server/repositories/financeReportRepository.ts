import { withTenantTransaction } from '../db/tenantContext.js';
import { roundMoney } from '../db/finance/financeTypes.js';

export interface DateRangeFilter {
  fromDate?: string;
  toDate?: string;
}

function buildDateConditions(
  column: string,
  filters?: DateRangeFilter,
  startIdx = 2
): { conditions: string[]; params: unknown[]; nextIdx: number } {
  const conditions: string[] = [];
  const params: unknown[] = [];
  let idx = startIdx;
  if (filters?.fromDate) {
    conditions.push(`${column} >= $${idx++}`);
    params.push(filters.fromDate);
  }
  if (filters?.toDate) {
    conditions.push(`${column} <= $${idx++}`);
    params.push(filters.toDate);
  }
  return { conditions, params, nextIdx: idx };
}

export class FinanceReportRepository {
  async salesSummaryReport(tenantId: string, filters?: DateRangeFilter) {
    return withTenantTransaction(tenantId, async (client) => {
      const base = ['tenant_id = $1', "status = 'POSTED'", "source_record_type IN ('ORDER', 'DISPATCH')"];
      const date = buildDateConditions('transaction_date', filters, 2);
      const where = [...base, ...date.conditions].join(' AND ');
      const result = await client.query(
        `SELECT source_record_type, COUNT(*)::int AS count, COALESCE(SUM(amount), 0)::numeric AS total
         FROM finance_transactions WHERE ${where}
         GROUP BY source_record_type ORDER BY source_record_type`,
        [tenantId, ...date.params]
      );
      const totals = await client.query(
        `SELECT COALESCE(SUM(amount), 0)::numeric AS total, COUNT(*)::int AS count FROM finance_transactions WHERE ${where}`,
        [tenantId, ...date.params]
      );
      return {
        totalSalesAmount: roundMoney(Number(totals.rows[0]?.total || 0)),
        transactionCount: Number(totals.rows[0]?.count || 0),
        bySourceType: result.rows.map((row) => ({
          sourceType: String(row.source_record_type),
          count: Number(row.count),
          totalAmount: roundMoney(Number(row.total))
        }))
      };
    });
  }

  async invoiceSummaryReport(tenantId: string, filters?: DateRangeFilter) {
    return withTenantTransaction(tenantId, async (client) => {
      const base = ['tenant_id = $1'];
      const date = buildDateConditions('invoice_date', filters, 2);
      const where = [...base, ...date.conditions].join(' AND ');
      const byStatus = await client.query(
        `SELECT status, COUNT(*)::int AS count,
                COALESCE(SUM(grand_total), 0)::numeric AS grand_total,
                COALESCE(SUM(subtotal), 0)::numeric AS subtotal,
                COALESCE(SUM(tax_amount), 0)::numeric AS tax_amount
         FROM finance_invoices WHERE ${where}
         GROUP BY status ORDER BY status`,
        [tenantId, ...date.params]
      );
      const totals = await client.query(
        `SELECT COUNT(*)::int AS count,
                COALESCE(SUM(grand_total), 0)::numeric AS grand_total,
                COALESCE(SUM(subtotal), 0)::numeric AS subtotal,
                COALESCE(SUM(tax_amount), 0)::numeric AS tax_amount
         FROM finance_invoices WHERE ${where}`,
        [tenantId, ...date.params]
      );
      return {
        invoiceCount: Number(totals.rows[0]?.count || 0),
        totalGrand: roundMoney(Number(totals.rows[0]?.grand_total || 0)),
        totalSubtotal: roundMoney(Number(totals.rows[0]?.subtotal || 0)),
        totalTax: roundMoney(Number(totals.rows[0]?.tax_amount || 0)),
        byStatus: byStatus.rows.map((row) => ({
          status: String(row.status),
          count: Number(row.count),
          grandTotal: roundMoney(Number(row.grand_total)),
          subtotal: roundMoney(Number(row.subtotal)),
          taxAmount: roundMoney(Number(row.tax_amount))
        }))
      };
    });
  }

  async receivablesReport(tenantId: string, filters?: DateRangeFilter) {
    return withTenantTransaction(tenantId, async (client) => {
      const base = ['i.tenant_id = $1', "i.status IN ('ISSUED', 'PARTIALLY_PAID')"];
      const date = buildDateConditions('i.invoice_date', filters, 2);
      const where = [...base, ...date.conditions].join(' AND ');
      const result = await client.query(
        `SELECT i.id, i.invoice_number, i.customer_id, i.invoice_date, i.due_date, i.status,
                i.grand_total::numeric AS grand_total,
                COALESCE(p.paid, 0)::numeric AS paid_amount
         FROM finance_invoices i
         LEFT JOIN (
           SELECT invoice_id, SUM(amount) AS paid FROM finance_payments
           WHERE tenant_id = $1 AND status = 'POSTED' GROUP BY invoice_id
         ) p ON p.invoice_id = i.id
         WHERE ${where}
         ORDER BY i.due_date ASC`,
        [tenantId, ...date.params]
      );
      const rows = result.rows.map((row) => {
        const grand = Number(row.grand_total);
        const paid = Number(row.paid_amount);
        return {
          invoiceId: String(row.id),
          invoiceNumber: String(row.invoice_number),
          customerId: String(row.customer_id),
          invoiceDate: String(row.invoice_date).slice(0, 10),
          dueDate: String(row.due_date).slice(0, 10),
          status: String(row.status),
          grandTotal: roundMoney(grand),
          paidAmount: roundMoney(paid),
          outstandingAmount: roundMoney(grand - paid)
        };
      });
      const totalOutstanding = roundMoney(rows.reduce((s, r) => s + r.outstandingAmount, 0));
      return { totalOutstanding, receivableCount: rows.length, receivables: rows };
    });
  }

  async paymentsSummaryReport(tenantId: string, filters?: DateRangeFilter) {
    return withTenantTransaction(tenantId, async (client) => {
      const base = ['tenant_id = $1', "status = 'POSTED'"];
      const date = buildDateConditions('payment_date', filters, 2);
      const where = [...base, ...date.conditions].join(' AND ');
      const byMethod = await client.query(
        `SELECT payment_method, COUNT(*)::int AS count, COALESCE(SUM(amount), 0)::numeric AS total
         FROM finance_payments WHERE ${where}
         GROUP BY payment_method ORDER BY payment_method`,
        [tenantId, ...date.params]
      );
      const totals = await client.query(
        `SELECT COUNT(*)::int AS count, COALESCE(SUM(amount), 0)::numeric AS total FROM finance_payments WHERE ${where}`,
        [tenantId, ...date.params]
      );
      return {
        paymentCount: Number(totals.rows[0]?.count || 0),
        totalPayments: roundMoney(Number(totals.rows[0]?.total || 0)),
        byMethod: byMethod.rows.map((row) => ({
          paymentMethod: String(row.payment_method),
          count: Number(row.count),
          totalAmount: roundMoney(Number(row.total))
        }))
      };
    });
  }

  async outstandingBalancesReport(tenantId: string) {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `SELECT i.customer_id,
                COUNT(*)::int AS invoice_count,
                COALESCE(SUM(i.grand_total), 0)::numeric AS invoiced_total,
                COALESCE(SUM(p.paid), 0)::numeric AS paid_total
         FROM finance_invoices i
         LEFT JOIN (
           SELECT invoice_id, SUM(amount) AS paid FROM finance_payments
           WHERE tenant_id = $1 AND status = 'POSTED' GROUP BY invoice_id
         ) p ON p.invoice_id = i.id
         WHERE i.tenant_id = $1 AND i.status IN ('ISSUED', 'PARTIALLY_PAID')
         GROUP BY i.customer_id
         ORDER BY i.customer_id`,
        [tenantId]
      );
      const byCustomer = result.rows.map((row) => {
        const invoiced = Number(row.invoiced_total);
        const paid = Number(row.paid_total);
        return {
          customerId: String(row.customer_id),
          invoiceCount: Number(row.invoice_count),
          invoicedTotal: roundMoney(invoiced),
          paidTotal: roundMoney(paid),
          outstandingBalance: roundMoney(invoiced - paid)
        };
      });
      const totalOutstanding = roundMoney(byCustomer.reduce((s, r) => s + r.outstandingBalance, 0));
      return { totalOutstanding, customerCount: byCustomer.length, byCustomer };
    });
  }

  async expensesSummaryReport(tenantId: string, filters?: DateRangeFilter) {
    return withTenantTransaction(tenantId, async (client) => {
      const base = ['tenant_id = $1'];
      const date = buildDateConditions('expense_date', filters, 2);
      const where = [...base, ...date.conditions].join(' AND ');
      const byCategory = await client.query(
        `SELECT category, approval_status, COUNT(*)::int AS count, COALESCE(SUM(amount), 0)::numeric AS total
         FROM finance_expenses WHERE ${where}
         GROUP BY category, approval_status ORDER BY category, approval_status`,
        [tenantId, ...date.params]
      );
      const totals = await client.query(
        `SELECT COUNT(*)::int AS count, COALESCE(SUM(amount), 0)::numeric AS total FROM finance_expenses WHERE ${where}`,
        [tenantId, ...date.params]
      );
      const approved = await client.query(
        `SELECT COALESCE(SUM(amount), 0)::numeric AS total FROM finance_expenses
         WHERE ${where} AND approval_status IN ('APPROVED', 'PAID')`,
        [tenantId, ...date.params]
      );
      return {
        expenseCount: Number(totals.rows[0]?.count || 0),
        totalExpenses: roundMoney(Number(totals.rows[0]?.total || 0)),
        approvedExpenses: roundMoney(Number(approved.rows[0]?.total || 0)),
        byCategoryAndStatus: byCategory.rows.map((row) => ({
          category: String(row.category),
          approvalStatus: String(row.approval_status),
          count: Number(row.count),
          totalAmount: roundMoney(Number(row.total))
        }))
      };
    });
  }

  async incomeExpenseSummaryReport(tenantId: string, filters?: DateRangeFilter) {
    const sales = await this.salesSummaryReport(tenantId, filters);
    const expenses = await this.expensesSummaryReport(tenantId, filters);
    const income = sales.totalSalesAmount;
    const expenseTotal = expenses.approvedExpenses;
    return {
      totalIncome: income,
      totalApprovedExpenses: expenseTotal,
      netPosition: roundMoney(income - expenseTotal),
      salesTransactionCount: sales.transactionCount,
      expenseCount: expenses.expenseCount
    };
  }

  async cashFlowReport(tenantId: string, filters?: DateRangeFilter) {
    const payments = await this.paymentsSummaryReport(tenantId, filters);
    const expenses = await this.expensesSummaryReport(tenantId, filters);
    const cashIn = payments.totalPayments;
    const cashOut = expenses.approvedExpenses;
    return {
      cashIn: cashIn,
      cashOut: cashOut,
      netCashFlow: roundMoney(cashIn - cashOut),
      paymentCount: payments.paymentCount,
      approvedExpenseCount: expenses.expenseCount
    };
  }

  async transactionSummaryReport(tenantId: string, filters?: DateRangeFilter) {
    return withTenantTransaction(tenantId, async (client) => {
      const base = ['tenant_id = $1', "status = 'POSTED'"];
      const date = buildDateConditions('transaction_date', filters, 2);
      const where = [...base, ...date.conditions].join(' AND ');
      const byModule = await client.query(
        `SELECT source_module, source_record_type, COUNT(*)::int AS count, COALESCE(SUM(amount), 0)::numeric AS total
         FROM finance_transactions WHERE ${where}
         GROUP BY source_module, source_record_type ORDER BY source_module, source_record_type`,
        [tenantId, ...date.params]
      );
      const totals = await client.query(
        `SELECT COUNT(*)::int AS count, COALESCE(SUM(amount), 0)::numeric AS total FROM finance_transactions WHERE ${where}`,
        [tenantId, ...date.params]
      );
      return {
        transactionCount: Number(totals.rows[0]?.count || 0),
        totalAmount: roundMoney(Number(totals.rows[0]?.total || 0)),
        byModuleAndType: byModule.rows.map((row) => ({
          sourceModule: String(row.source_module),
          sourceRecordType: String(row.source_record_type),
          count: Number(row.count),
          totalAmount: roundMoney(Number(row.total))
        }))
      };
    });
  }

  async settlementFinancialSummaryReport(tenantId: string, filters?: DateRangeFilter) {
    return withTenantTransaction(tenantId, async (client) => {
      const base = ['ft.tenant_id = $1', "ft.source_record_type = 'SETTLEMENT'", "ft.status = 'POSTED'"];
      const date = buildDateConditions('ft.transaction_date', filters, 2);
      const where = [...base, ...date.conditions].join(' AND ');
      const result = await client.query(
        `SELECT ft.id AS finance_transaction_id, ft.transaction_number, ft.settlement_id,
                ft.amount::numeric AS amount, ft.transaction_date,
                s.settlement_number, s.basis, s.net_amount::numeric AS settlement_net
         FROM finance_transactions ft
         JOIN erp_settlements s ON s.id = ft.settlement_id AND s.tenant_id = ft.tenant_id
         WHERE ${where}
         ORDER BY ft.transaction_date DESC`,
        [tenantId, ...date.params]
      );
      const totals = await client.query(
        `SELECT COUNT(*)::int AS count, COALESCE(SUM(ft.amount), 0)::numeric AS total
         FROM finance_transactions ft
         WHERE ${where.replace(/ft\./g, 'ft.')}`,
        [tenantId, ...date.params]
      );
      const rows = result.rows.map((row) => ({
        financeTransactionId: String(row.finance_transaction_id),
        transactionNumber: String(row.transaction_number),
        settlementId: String(row.settlement_id),
        settlementNumber: String(row.settlement_number),
        basis: String(row.basis),
        amount: roundMoney(Number(row.amount)),
        settlementNetAmount: roundMoney(Number(row.settlement_net)),
        transactionDate: String(row.transaction_date).slice(0, 10)
      }));
      return {
        settlementFinanceCount: Number(totals.rows[0]?.count || 0),
        totalSettlementAmount: roundMoney(Number(totals.rows[0]?.total || 0)),
        settlements: rows
      };
    });
  }
}
