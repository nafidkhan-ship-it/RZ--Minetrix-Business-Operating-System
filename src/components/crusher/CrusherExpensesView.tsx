import React, { useState } from 'react';
import {
  DollarSign,
  Search,
  Plus,
  Zap,
  Fuel,
  Wrench,
  Users,
  Building2,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { CrusherExpense } from '../../data/crusherStudioData';

interface CrusherExpensesViewProps {
  expenses: CrusherExpense[];
  onNavigatePage: (page: string) => void;
}

export const CrusherExpensesView: React.FC<CrusherExpensesViewProps> = ({
  expenses,
  onNavigatePage
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [catFilter, setCatFilter] = useState('ALL');

  const filtered = expenses.filter(e => {
    const matchSearch =
      e.voucherNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.paidTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = catFilter === 'ALL' || e.category === catFilter;
    return matchSearch && matchCat;
  });

  const totalExpense = expenses.reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                OPEX & UTILITY VOUCHERS
              </span>
              <h2 className="text-xl font-black text-white">Crusher Operating Expenses</h2>
            </div>
          </div>
          <button
            onClick={() => alert('New Expense Voucher created.')}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Expense Voucher</span>
          </button>
        </div>

        {/* Expense Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Month Opex Total</span>
            <span className="text-xl font-black text-cyan-400 font-mono mt-0.5">₹{(totalExpense / 100000).toFixed(1)} L</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Electricity / KSEB</span>
            <span className="text-xl font-black text-yellow-400 font-mono mt-0.5">₹3.85 L</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Plant Maintenance</span>
            <span className="text-xl font-black text-amber-400 font-mono mt-0.5">₹1.80 L</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Labor & Operators</span>
            <span className="text-xl font-black text-white font-mono mt-0.5">₹1.45 L</span>
          </div>
        </div>

        {/* Search */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by voucher, category, payee, or description..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9.5 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <select
              value={catFilter}
              onChange={e => setCatFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="Electricity / HT Power">Electricity / HT Power</option>
              <option value="Fuel / Generator Diesel">Fuel / Generator Diesel</option>
              <option value="Machinery Maintenance">Machinery Maintenance</option>
              <option value="Wages & Operator Salaries">Wages & Operator Salaries</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl overflow-x-auto space-y-3">
        <h3 className="text-sm font-bold text-white">Expense Vouchers Log</h3>
        <table className="w-full text-xs text-left text-slate-300">
          <thead className="bg-slate-950/70 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
            <tr>
              <th className="p-3">Voucher Ref</th>
              <th className="p-3">Category</th>
              <th className="p-3">Paid To / Vendor</th>
              <th className="p-3">Description</th>
              <th className="p-3">Date</th>
              <th className="p-3">Mode</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map(exp => (
              <tr key={exp.id} className="hover:bg-slate-800/40">
                <td className="p-3 font-mono font-bold text-cyan-400">{exp.voucherNumber}</td>
                <td className="p-3 text-slate-200 font-medium">{exp.category}</td>
                <td className="p-3 font-bold text-white">{exp.paidTo}</td>
                <td className="p-3 text-slate-400 max-w-xs truncate">{exp.description}</td>
                <td className="p-3 font-mono text-slate-400">{exp.date}</td>
                <td className="p-3 font-mono text-slate-300 text-[11px]">{exp.paymentMode}</td>
                <td className="p-3 font-mono font-bold text-emerald-400">₹{exp.amount.toLocaleString()}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
                    {exp.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
