import React, { useState } from 'react';
import {
  Receipt,
  Sparkles,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Printer,
  Download,
  Filter,
  DollarSign,
  TrendingUp,
  Percent,
  Calendar,
  X,
  Building2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ExpenseRecord, InvestmentPartnerRecord, PartnerSettlementItem } from '../types';
import {
  MOCK_EXPENSES,
  MOCK_INVESTMENTS_PARTNERS,
  MOCK_PARTNER_SETTLEMENTS
} from '../financeMockData';

// =========================================================================
// 1. EXPENSES VIEW (15 Categories, Approval Lifecycle, Category Breakdown)
// =========================================================================
export const ExpensesView: React.FC<{
  onToast: (msg: string) => void;
  onOpenPrintModal?: (title: string, data: any) => void;
}> = ({ onToast, onOpenPrintModal }) => {
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(MOCK_EXPENSES);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isNewExpenseOpen, setIsNewExpenseOpen] = useState(false);

  // New Expense form state
  const [categoryInput, setCategoryInput] = useState<ExpenseRecord['category']>('Fuel');
  const [amountInput, setAmountInput] = useState('12000');
  const [buInput, setBuInput] = useState('Quarry Pit #01');
  const [paidToInput, setPaidToInput] = useState('BPCL Highway Hub');
  const [notesInput, setNotesInput] = useState('Excavator hydraulic fluid & diesel');

  const EXPENSE_CATEGORIES = [
    'Fuel',
    'Maintenance',
    'Salary',
    'Batta',
    'Rent',
    'Electricity',
    'Transport',
    'Loading',
    'Unloading',
    'Toll',
    'Office',
    'Marketing',
    'Professional Fees',
    'Repairs',
    'Other'
  ];

  const filtered = expenses.filter(
    (e) => selectedCategory === 'ALL' || e.category === selectedCategory
  );

  const expenseToday = 51000;
  const expenseThisMonth = 485000;
  const pendingApprovals = expenses.filter((e) => e.status === 'PENDING').length;

  const handleApprove = (id: string) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'APPROVED', approvedBy: 'Nafid Khan (Admin)' } : e))
    );
    onToast(`Approved expense voucher ${id}`);
  };

  const handleReject = (id: string) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'REJECTED' } : e))
    );
    onToast(`Rejected expense voucher ${id}`);
  };

  const handleCreateExpense = () => {
    const amt = parseFloat(amountInput) || 0;
    const newExp: ExpenseRecord = {
      id: `EXP-00${expenses.length + 1}`,
      voucherNo: `EXP-2026-0${40 + expenses.length + 1}`,
      date: new Date().toISOString().slice(0, 10),
      category: categoryInput,
      amount: amt,
      businessUnit: buInput,
      paidTo: paidToInput,
      paymentMode: 'NEFT',
      status: 'PENDING',
      notes: notesInput
    };
    setExpenses([newExp, ...expenses]);
    setIsNewExpenseOpen(false);
    onToast(`Submitted new expense voucher for ${categoryInput} (₹${amt.toLocaleString('en-IN')})`);
  };

  return (
    <div className="space-y-6">
      {/* 4 Expense Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <span className="text-xs font-bold text-slate-400 uppercase">Expense Today</span>
          <div className="text-xl font-black text-amber-400 mt-1">₹{expenseToday.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-slate-500">Pit diesel &amp; driver batta</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase">Expense This Month</span>
          <div className="text-xl font-black text-slate-200 mt-1">₹{expenseThisMonth.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-slate-500">Across 15 core cost centers</span>
        </div>
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
          <span className="text-xs font-bold text-slate-400 uppercase">Pending Approvals</span>
          <div className="text-xl font-black text-rose-400 mt-1">{pendingApprovals} Vouchers</div>
          <span className="text-[10px] text-slate-500">Awaiting director sign-off</span>
        </div>
        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
          <span className="text-xs font-bold text-slate-400 uppercase">Configured Categories</span>
          <div className="text-xl font-black text-cyan-400 mt-1">15 Categories</div>
          <span className="text-[10px] text-slate-500">Standardized cost taxonomy</span>
        </div>
      </div>

      {/* 15 Category Filter Badges */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-300 uppercase">
            Expense Category Breakdown
          </span>
          <button
            onClick={() => setSelectedCategory('ALL')}
            className="text-[11px] text-amber-400 hover:underline font-bold cursor-pointer"
          >
            Show All
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All (15)
          </button>
          {EXPENSE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-3">
        <span className="text-xs font-mono font-bold text-slate-300">
          Showing {filtered.length} Expense Records
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToast('Exported Expense Analysis to Excel')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
          <button
            onClick={() => onOpenPrintModal?.('Expense Vouchers Audit Log', filtered)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
          <button
            onClick={() => setIsNewExpenseOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Expense</span>
          </button>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Voucher #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Business Unit</th>
                <th className="py-3 px-4">Paid To</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Approvals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filtered.map((e) => (
                <tr key={e.id} className="hover:bg-slate-850/60 transition">
                  <td className="py-3 px-4 text-amber-400 font-bold">{e.voucherNo}</td>
                  <td className="py-3 px-4 text-slate-400">{e.date}</td>
                  <td className="py-3 px-4 font-sans">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-bold">
                      {e.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-sans">{e.businessUnit}</td>
                  <td className="py-3 px-4 text-white font-sans font-bold">{e.paidTo}</td>
                  <td className="py-3 px-4 text-slate-400 font-sans max-w-[200px] truncate">{e.notes}</td>
                  <td className="py-3 px-4 text-right font-black text-rose-400">
                    -₹{e.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        e.status === 'APPROVED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : e.status === 'REJECTED'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {e.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans text-center">
                    {e.status === 'PENDING' ? (
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleApprove(e.id)}
                          className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-[11px] font-bold cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(e.id)}
                          className="px-2 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-[11px] font-bold cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-500">{e.approvedBy || 'System Validated'}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Expense Modal */}
      {isNewExpenseOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Create New Expense Voucher</h3>
              <button
                onClick={() => setIsNewExpenseOpen(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Expense Category (15 Standard)</label>
                <select
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                >
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Amount (₹)</label>
                <input
                  type="number"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Business Unit</label>
                <select
                  value={buInput}
                  onChange={(e) => setBuInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                >
                  <option value="Quarry Pit #01">Quarry Pit #01 (Laterite)</option>
                  <option value="Crusher Plant VSI">Crusher Plant VSI (Wayanad)</option>
                  <option value="Fleet Logistics Hub">Fleet Logistics Hub</option>
                  <option value="Central Admin">Central Corporate Office</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Paid To / Payee</label>
                <input
                  type="text"
                  value={paidToInput}
                  onChange={(e) => setPaidToInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Voucher Description</label>
                <input
                  type="text"
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsNewExpenseOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateExpense}
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black cursor-pointer shadow-md shadow-amber-500/20"
              >
                Submit Expense
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 2. INVESTMENTS & PARTNERS VIEW (Separate Investment %, Profit %, Loss %)
// =========================================================================
export const InvestmentsPartnersView: React.FC<{
  onToast: (msg: string) => void;
  onOpenPrintModal?: (title: string, data: any) => void;
}> = ({ onToast, onOpenPrintModal }) => {
  const [partners, setPartners] = useState<InvestmentPartnerRecord[]>(MOCK_INVESTMENTS_PARTNERS);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Equity Capital, Partner Ratios &amp; Investment Yield</span>
          </h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold border border-purple-500/30">
            CONFIGURABLE SPLIT MODEL
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Critical Enterprise Rule: Investment %, Profit %, and Loss % are maintained as distinct independent parameters with specific effective start dates to prevent historical transaction contamination.
        </p>
      </div>

      {/* Example Split Visualizer */}
      <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
            %
          </div>
          <div>
            <span className="text-white font-bold block">Partner Configuration Example</span>
            <span className="text-slate-400 text-[11px]">Partner A: Investment: 40% &bull; Profit: 35% &bull; Loss: 30%</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 font-bold">
            Effective Date: 2025-04-01
          </span>
          <button
            onClick={() => onToast('Opened Capital Injection dialog')}
            className="px-3 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-black cursor-pointer"
          >
            + Capital Injection
          </button>
        </div>
      </div>

      {/* Partners Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Partner / Investor</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4 text-right">Capital Contributed</th>
                <th className="py-3 px-4 text-right">Additional</th>
                <th className="py-3 px-4 text-right">Withdrawal</th>
                <th className="py-3 px-4 text-right font-black">Net Capital</th>
                <th className="py-3 px-4 text-center">Investment %</th>
                <th className="py-3 px-4 text-center text-emerald-400">Profit %</th>
                <th className="py-3 px-4 text-center text-rose-400">Loss %</th>
                <th className="py-3 px-4">Effective Date</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {partners.map((p) => (
                <tr key={p.id} className="hover:bg-slate-850/60 transition">
                  <td className="py-3 px-4 font-sans font-bold text-white text-xs">{p.name}</td>
                  <td className="py-3 px-4 font-sans">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        p.role === 'Partner'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {p.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-300">
                    ₹{p.capitalInvestment.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right text-emerald-400">
                    +₹{p.additionalInvestment.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right text-rose-400">
                    -₹{p.capitalWithdrawal.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right font-black text-amber-400 text-sm">
                    ₹{p.netCapital.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-slate-200">
                    {p.ownershipPercent.toFixed(1)}%
                  </td>
                  <td className="py-3 px-4 text-center font-black text-emerald-400">
                    {p.profitPercent.toFixed(1)}%
                  </td>
                  <td className="py-3 px-4 text-center font-black text-rose-400">
                    {p.lossPercent.toFixed(1)}%
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px]">{p.effectiveDate}</td>
                  <td className="py-3 px-4 font-sans text-center">
                    <button
                      onClick={() => onOpenPrintModal?.(`Partner Equity Statement: ${p.name}`, p)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold cursor-pointer"
                    >
                      Statement
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 3. PARTNER SETTLEMENT VIEW (Pending, Calculated, Approved, Paid, Disputed)
// =========================================================================
export const PartnerSettlementView: React.FC<{
  onToast: (msg: string) => void;
  onOpenPrintModal?: (title: string, data: any) => void;
}> = ({ onToast, onOpenPrintModal }) => {
  const [settlements, setSettlements] = useState<PartnerSettlementItem[]>(MOCK_PARTNER_SETTLEMENTS);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filtered = settlements.filter(
    (s) => statusFilter === 'ALL' || s.status === statusFilter
  );

  const pending = settlements.filter((s) => s.status === 'PENDING').length;
  const calculated = settlements.filter((s) => s.status === 'CALCULATED').length;
  const approved = settlements.filter((s) => s.status === 'APPROVED').length;
  const paid = settlements.filter((s) => s.status === 'PAID').length;
  const disputed = settlements.filter((s) => s.status === 'DISPUTED').length;

  const handleApprove = (id: string) => {
    setSettlements((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'APPROVED' } : s))
    );
    onToast(`Approved partner settlement ${id}`);
  };

  const handlePay = (id: string) => {
    setSettlements((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'PAID' } : s))
    );
    onToast(`Executed payment for partner settlement ${id}`);
  };

  return (
    <div className="space-y-6">
      {/* 5 Status Dashboard Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={() => setStatusFilter('PENDING')}
          className={`p-3 rounded-2xl border text-left cursor-pointer transition ${
            statusFilter === 'PENDING'
              ? 'bg-amber-500/20 border-amber-500 text-amber-300'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <span className="text-[10px] uppercase font-bold block">Pending</span>
          <span className="text-xl font-black text-white">{pending}</span>
        </button>

        <button
          onClick={() => setStatusFilter('CALCULATED')}
          className={`p-3 rounded-2xl border text-left cursor-pointer transition ${
            statusFilter === 'CALCULATED'
              ? 'bg-blue-500/20 border-blue-500 text-blue-300'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <span className="text-[10px] uppercase font-bold block">Calculated</span>
          <span className="text-xl font-black text-white">{calculated}</span>
        </button>

        <button
          onClick={() => setStatusFilter('APPROVED')}
          className={`p-3 rounded-2xl border text-left cursor-pointer transition ${
            statusFilter === 'APPROVED'
              ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <span className="text-[10px] uppercase font-bold block">Approved</span>
          <span className="text-xl font-black text-white">{approved}</span>
        </button>

        <button
          onClick={() => setStatusFilter('PAID')}
          className={`p-3 rounded-2xl border text-left cursor-pointer transition ${
            statusFilter === 'PAID'
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <span className="text-[10px] uppercase font-bold block">Paid</span>
          <span className="text-xl font-black text-white">{paid}</span>
        </button>

        <button
          onClick={() => setStatusFilter('DISPUTED')}
          className={`p-3 rounded-2xl border text-left cursor-pointer transition ${
            statusFilter === 'DISPUTED'
              ? 'bg-rose-500/20 border-rose-500 text-rose-300'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <span className="text-[10px] uppercase font-bold block">Disputed</span>
          <span className="text-xl font-black text-white">{disputed}</span>
        </button>
      </div>

      {/* Settlements Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Monthly Profit Distribution &amp; Settlement Vouchers</h3>
          <button
            onClick={() => setStatusFilter('ALL')}
            className="text-xs text-amber-400 hover:underline font-bold cursor-pointer"
          >
            Clear Filter (Show All)
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Partner</th>
                <th className="py-3 px-4">Business Unit</th>
                <th className="py-3 px-4">Period</th>
                <th className="py-3 px-4 text-right">Gross Amount</th>
                <th className="py-3 px-4 text-right">Expenses</th>
                <th className="py-3 px-4 text-right">Eligible Share</th>
                <th className="py-3 px-4 text-right">Adjustments</th>
                <th className="py-3 px-4 text-right font-black">Final Settlement</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-850/60 transition">
                  <td className="py-3 px-4 font-sans font-bold text-white text-xs">{s.partnerName}</td>
                  <td className="py-3 px-4 text-slate-300 font-sans">{s.businessUnit}</td>
                  <td className="py-3 px-4 text-slate-400">{s.period}</td>
                  <td className="py-3 px-4 text-right text-slate-200">
                    ₹{s.grossAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right text-rose-400">
                    -₹{s.expenses.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right text-blue-400 font-bold">
                    ₹{s.eligibleShare.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right text-amber-400">
                    {s.adjustments !== 0 ? `₹${s.adjustments.toLocaleString('en-IN')}` : '₹0'}
                  </td>
                  <td className="py-3 px-4 text-right font-black text-emerald-400 text-sm">
                    ₹{s.finalSettlement.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        s.status === 'PAID'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : s.status === 'APPROVED'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : s.status === 'CALCULATED'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <div className="flex items-center justify-center gap-1.5">
                      {s.status === 'CALCULATED' && (
                        <button
                          onClick={() => handleApprove(s.id)}
                          className="px-2 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[11px] font-bold cursor-pointer"
                        >
                          Approve
                        </button>
                      )}
                      {s.status === 'APPROVED' && (
                        <button
                          onClick={() => handlePay(s.id)}
                          className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-bold cursor-pointer"
                        >
                          Pay
                        </button>
                      )}
                      <button
                        onClick={() => onOpenPrintModal?.(`Partner Settlement Statement: ${s.partnerName}`, s)}
                        className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
