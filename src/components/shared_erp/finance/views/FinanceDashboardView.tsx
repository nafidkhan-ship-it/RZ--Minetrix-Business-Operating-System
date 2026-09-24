import React from 'react';
import {
  Wallet,
  Landmark,
  TrendingUp,
  CreditCard,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  AlertTriangle,
  Users,
  Building2,
  Layers,
  Truck,
  DollarSign,
  BookOpen,
  RefreshCw,
  FileSpreadsheet,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { FINANCE_KPI_SUMMARY, MOCK_BANKS, MOCK_DEBTORS, MOCK_CREDITORS, MOCK_EXPENSES } from '../financeMockData';
import { FinanceSectionTab } from '../types';

export const FinanceDashboardView: React.FC<{
  onToast: (msg: string) => void;
  onNavigateTab: (tab: FinanceSectionTab) => void;
  onOpenPrintModal?: (title: string, data: any) => void;
}> = ({ onToast, onNavigateTab, onOpenPrintModal }) => {
  const kpi = FINANCE_KPI_SUMMARY;

  const urgentDebtors = MOCK_DEBTORS.filter((d) => d.status === 'OVERDUE' || d.status === 'DUE');
  const urgentCreditors = MOCK_CREDITORS.filter((c) => c.status === 'PENDING' || c.status === 'OVERDUE');
  const pendingExpenses = MOCK_EXPENSES.filter((e) => e.status === 'PENDING');

  return (
    <div className="space-y-6">
      {/* 11 KPI Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {/* 1. Cash Balance */}
        <div
          onClick={() => onNavigateTab('cash')}
          className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Cash Balance</span>
            <Wallet className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-lg font-black text-amber-400 font-mono">
            ₹{kpi.cashBalance.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-500">Pithead Drawer &amp; Float</span>
        </div>

        {/* 2. Bank Balance */}
        <div
          onClick={() => onNavigateTab('banks')}
          className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Bank Balance</span>
            <Landmark className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-lg font-black text-blue-400 font-mono">
            ₹{kpi.bankBalance.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-500">Across 3 Operating Banks</span>
        </div>

        {/* 3. Receivables */}
        <div
          onClick={() => onNavigateTab('debtors')}
          className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Receivables</span>
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-lg font-black text-cyan-400 font-mono">
            ₹{kpi.receivables.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-500">Customer Dues (Debtors)</span>
        </div>

        {/* 4. Payables */}
        <div
          onClick={() => onNavigateTab('creditors')}
          className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Payables</span>
            <CreditCard className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-lg font-black text-rose-400 font-mono">
            ₹{kpi.payables.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-500">Suppliers &amp; Vendors</span>
        </div>

        {/* 5. Customer Advances */}
        <div
          onClick={() => onNavigateTab('debtors')}
          className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Customer Advances</span>
            <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-lg font-black text-emerald-400 font-mono">
            ₹{kpi.customerAdvances.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-500">Site Booking Advances</span>
        </div>

        {/* 6. Supplier Advances */}
        <div
          onClick={() => onNavigateTab('creditors')}
          className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Supplier Advances</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-lg font-black text-purple-400 font-mono">
            ₹{kpi.supplierAdvances.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-500">Pre-orders &amp; Deposits</span>
        </div>

        {/* 7. Staff Advances */}
        <div
          onClick={() => onNavigateTab('staff-advances')}
          className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-yellow-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Staff Advances</span>
            <DollarSign className="w-3.5 h-3.5 text-yellow-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-lg font-black text-yellow-400 font-mono">
            ₹{kpi.staffAdvances.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-500">Employee Recoveries</span>
        </div>

        {/* 8. Partner Payables */}
        <div
          onClick={() => onNavigateTab('settlements')}
          className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-pink-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Partner Payables</span>
            <Sparkles className="w-3.5 h-3.5 text-pink-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-lg font-black text-pink-400 font-mono">
            ₹{kpi.partnerOwnerPayables.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-500">Monthly Profit Due</span>
        </div>

        {/* 9. Today Pay-In */}
        <div
          onClick={() => onNavigateTab('pay-in')}
          className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-400">Today Pay-In</span>
            <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-lg font-black text-emerald-400 font-mono">
            ₹{kpi.todayPayIn.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-500">Inward Collections</span>
        </div>

        {/* 10. Today Pay-Out */}
        <div
          onClick={() => onNavigateTab('pay-out')}
          className="p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/20 hover:border-orange-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px] text-orange-400">Today Pay-Out</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-orange-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-lg font-black text-orange-400 font-mono">
            ₹{kpi.todayPayOut.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-500">Disbursed Outflows</span>
        </div>

        {/* 11. Net Cash Flow */}
        <div
          onClick={() => onNavigateTab('reports')}
          className="col-span-2 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-amber-500/30 hover:border-amber-400 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px] text-amber-300">
              Net Cash Flow (Daily Spread)
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-400">+63.1% Spread</span>
          </div>
          <div className="text-xl font-black text-white font-mono">
            +₹{kpi.netCashFlow.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-400">Realized Surplus (Pay-In minus Pay-Out)</span>
        </div>
      </div>

      {/* Quick Action Navigation Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block mb-3">
          Quick Financial Operations
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onNavigateTab('pay-in')}
            className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-2 cursor-pointer transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Pay-In</span>
          </button>
          <button
            onClick={() => onNavigateTab('pay-out')}
            className="px-3.5 py-2 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 text-orange-300 border border-orange-500/30 text-xs font-bold flex items-center gap-2 cursor-pointer transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Pay-Out</span>
          </button>
          <button
            onClick={() => onNavigateTab('expenses')}
            className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-2 cursor-pointer transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Expense Voucher</span>
          </button>
          <button
            onClick={() => onNavigateTab('banks')}
            className="px-3.5 py-2 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 text-xs font-bold flex items-center gap-2 cursor-pointer transition"
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Execute Bank Transfer</span>
          </button>
          <button
            onClick={() => onNavigateTab('staff-advances')}
            className="px-3.5 py-2 rounded-xl bg-yellow-500/15 hover:bg-yellow-500/25 text-yellow-300 border border-yellow-500/30 text-xs font-bold flex items-center gap-2 cursor-pointer transition"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Issue Staff Advance</span>
          </button>
          <button
            onClick={() => onNavigateTab('reports')}
            className="px-3.5 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center gap-2 cursor-pointer transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>14 Financial BI Reports</span>
          </button>
        </div>
      </div>

      {/* Two Column Grid: Immediate Attention & Bank Snapshots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Immediate Attention List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Immediate Financial Attention &amp; Critical Dues</span>
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono font-bold">
              {urgentDebtors.length + urgentCreditors.length + pendingExpenses.length} Action Items
            </span>
          </div>

          <div className="space-y-2.5">
            {urgentDebtors.map((d) => (
              <div
                key={d.id}
                onClick={() => onNavigateTab('debtors')}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between cursor-pointer transition"
              >
                <div>
                  <div className="text-xs font-bold text-white">{d.customerName}</div>
                  <div className="text-[10px] text-slate-400">{d.invoiceNo} &bull; Due: {d.dueDate}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-rose-400 font-mono">
                    ₹{d.balance.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-bold uppercase">
                    {d.status}
                  </span>
                </div>
              </div>
            ))}

            {urgentCreditors.map((c) => (
              <div
                key={c.id}
                onClick={() => onNavigateTab('creditors')}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between cursor-pointer transition"
              >
                <div>
                  <div className="text-xs font-bold text-white">{c.partyName}</div>
                  <div className="text-[10px] text-slate-400">{c.billNo} &bull; {c.category}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-orange-400 font-mono">
                    ₹{c.balance.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-300 font-bold uppercase">
                    {c.status}
                  </span>
                </div>
              </div>
            ))}

            {pendingExpenses.map((e) => (
              <div
                key={e.id}
                onClick={() => onNavigateTab('expenses')}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between cursor-pointer transition"
              >
                <div>
                  <div className="text-xs font-bold text-white">{e.paidTo}</div>
                  <div className="text-[10px] text-slate-400">{e.voucherNo} &bull; {e.category}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-amber-400 font-mono">
                    ₹{e.amount.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold uppercase">
                    Awaiting Approval
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Bank Balances Snapshot & Reconciliation Health */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Landmark className="w-4 h-4 text-blue-400" />
              <span>Commercial Bank Accounts &amp; Treasury Balances</span>
            </h3>
            <button
              onClick={() => onNavigateTab('reconciliation')}
              className="text-xs text-blue-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Reconciliation Hub</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {MOCK_BANKS.map((b) => (
              <div
                key={b.id}
                onClick={() => onNavigateTab('banks')}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between cursor-pointer transition"
              >
                <div>
                  <div className="text-xs font-bold text-white">{b.bankName}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {b.accountNumber} &bull; {b.branch}
                  </div>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-mono font-bold mt-1 inline-block">
                    {b.type}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-blue-400 font-mono">
                    ₹{b.currentBalance.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                    In: +₹{b.todayIn.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-rose-400 font-mono">
                    Out: -₹{b.todayOut.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-300 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Automated Bank Feed Synced</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Updated 12 mins ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};
