import React, { useCallback, useEffect, useState } from 'react';
import { RefreshCw, Landmark, Receipt, CreditCard, FileText, BarChart3 } from 'lucide-react';
import { apiClient } from '../services/apiClient';

export const FinanceOperationsPanel: React.FC<{ onToast: (msg: string) => void }> = ({ onToast }) => {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [salesReport, setSalesReport] = useState<any | null>(null);
  const [receivablesReport, setReceivablesReport] = useState<any | null>(null);
  const [cashFlowReport, setCashFlowReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFinance = useCallback(async () => {
    if (!apiClient.getAuthToken()) {
      setError('Login via Shared Core Implementation to access live finance APIs.');
      setAccounts([]);
      setTransactions([]);
      setInvoices([]);
      setPayments([]);
      setExpenses([]);
      setSalesReport(null);
      setReceivablesReport(null);
      setCashFlowReport(null);
      return;
    }
    setLoading(true);
    setError(null);
    const [acc, txn, inv, pay, exp, sales, recv, cash] = await Promise.all([
      apiClient.listFinanceAccounts(),
      apiClient.listFinanceTransactions(),
      apiClient.listFinanceInvoices(),
      apiClient.listFinancePayments(),
      apiClient.listFinanceExpenses(),
      apiClient.getFinanceReport('sales-summary'),
      apiClient.getFinanceReport('receivables'),
      apiClient.getFinanceReport('cash-flow')
    ]);
    if (!acc.success && acc.message?.includes('403')) {
      setError('Your role does not have finance permissions.');
    } else if (acc.success && Array.isArray(acc.data)) setAccounts(acc.data);
    if (txn.success && Array.isArray(txn.data)) setTransactions(txn.data);
    if (inv.success && Array.isArray(inv.data)) setInvoices(inv.data);
    if (pay.success && Array.isArray(pay.data)) setPayments(pay.data);
    if (exp.success && Array.isArray(exp.data)) setExpenses(exp.data);
    if (sales.success) setSalesReport(sales.data);
    if (recv.success) setReceivablesReport(recv.data);
    if (cash.success) setCashFlowReport(cash.data);
    if (!acc.success && acc.message) onToast(acc.message);
    setLoading(false);
  }, [onToast]);

  useEffect(() => {
    loadFinance();
  }, [loadFinance]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Landmark className="w-5 h-5 text-emerald-400" />
            Live Finance Operations (PostgreSQL APIs)
          </h3>
          <p className="text-slate-400 text-xs mt-1">Accounts, transactions, invoices, payments, expenses, and server-side financial reports.</p>
        </div>
        <button
          onClick={() => loadFinance()}
          className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-sm">{error}</div>
      )}

      {!error && !loading && accounts.length === 0 && transactions.length === 0 && invoices.length === 0 && (
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-sm text-center">
          No finance records yet. Create ERP orders, invoices, and settlements from Mining Operations, then refresh.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-slate-400 text-xs uppercase font-bold">Sales (server total)</span>
          <strong className="text-emerald-400 text-xl font-black block mt-1">₹{salesReport?.totalSalesAmount?.toLocaleString() ?? '—'}</strong>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-slate-400 text-xs uppercase font-bold">Outstanding receivables</span>
          <strong className="text-amber-300 text-xl font-black block mt-1">₹{receivablesReport?.totalOutstanding?.toLocaleString() ?? '—'}</strong>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-slate-400 text-xs uppercase font-bold">Net cash flow</span>
          <strong className="text-cyan-300 text-xl font-black block mt-1">₹{cashFlowReport?.netCashFlow?.toLocaleString() ?? '—'}</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Receipt className="w-4 h-4 text-emerald-400" /> Invoices ({invoices.length})</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto text-xs">
            {invoices.slice(0, 8).map((inv) => (
              <div key={inv.id} className="flex justify-between text-slate-300 border-b border-slate-800 pb-1">
                <span>{inv.invoiceNumber} · {inv.status}</span>
                <span className="font-mono">₹{inv.grandTotal}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><CreditCard className="w-4 h-4 text-cyan-400" /> Payments ({payments.length})</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto text-xs">
            {payments.slice(0, 8).map((p) => (
              <div key={p.id} className="flex justify-between text-slate-300 border-b border-slate-800 pb-1">
                <span>{p.paymentNumber}</span>
                <span className="font-mono">₹{p.amount}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-amber-400" /> Transactions ({transactions.length})</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto text-xs">
            {transactions.slice(0, 8).map((t) => (
              <div key={t.id} className="flex justify-between text-slate-300 border-b border-slate-800 pb-1">
                <span>{t.transactionNumber} · {t.sourceRecordType}</span>
                <span className="font-mono">₹{t.amount}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-purple-400" /> Expenses ({expenses.length})</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto text-xs">
            {expenses.slice(0, 8).map((e) => (
              <div key={e.id} className="flex justify-between text-slate-300 border-b border-slate-800 pb-1">
                <span>{e.expenseNumber} · {e.approvalStatus}</span>
                <span className="font-mono">₹{e.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
