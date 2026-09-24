import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  Search,
  Calendar,
  Filter,
  Layers,
  FileText,
  CreditCard,
  Building2,
  TrendingDown
} from 'lucide-react';
import { QuarryExpense, ExpenseCategory, QuarryItem } from '../../data/quarryStudioData';

interface QuarryExpensesViewProps {
  expenses: QuarryExpense[];
  quarries: QuarryItem[];
  onOpenExpenseModal: () => void;
}

export const QuarryExpensesView: React.FC<QuarryExpensesViewProps> = ({
  expenses,
  quarries,
  onOpenExpenseModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filtered = expenses.filter((e) => {
    const matchSearch =
      e.voucherNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.paidTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.quarryName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'ALL' || e.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const totalExpense = filtered.reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              PIT EXPENDITURE
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ({filtered.length} expense vouchers)
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Operational Expenses Ledger</h2>
          <p className="text-xs text-slate-400">
            Dedicated quarry cost vouchers: wire-saw diamond cables, excavator diesel, blaster fees, and DMG royalties.
          </p>
        </div>

        <button
          onClick={onOpenExpenseModal}
          className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 flex items-center gap-2 transition shadow-lg shadow-amber-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Record Expense</span>
        </button>
      </div>

      {/* Expense Categories Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Ledger Spend</span>
          <span className="text-2xl font-black text-rose-400 font-mono">
            ₹{totalExpense.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-500 block">Current Operating Period</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Fuel & Diesel (HSD)</span>
          <span className="text-xl font-black text-amber-400 font-mono">₹24,200</span>
          <span className="text-[10px] text-slate-500 block">Heavy Machinery Consumables</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Wire Saw & Maintenance</span>
          <span className="text-xl font-black text-blue-400 font-mono">₹14,500</span>
          <span className="text-[10px] text-slate-500 block">Bead Replacement & Servicing</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Labour Wages</span>
          <span className="text-xl font-black text-emerald-400 font-mono">₹32,000</span>
          <span className="text-[10px] text-slate-500 block">Extraction & Dressing Crews</span>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search voucher number, payee name, description, quarry..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:border-amber-400 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="Fuel / Diesel">Fuel / Diesel</option>
            <option value="Wire Saw">Wire Saw Diamond Consumables</option>
            <option value="Labour">Labour Wages</option>
            <option value="Machinery">Machinery Rental</option>
            <option value="Maintenance">Pit Maintenance</option>
            <option value="Blasting">Blasting & Explosives</option>
            <option value="Legal / Permit">DMG Permit & Royalty</option>
          </select>
        </div>
      </div>

      {/* Expense Vouchers Table (Section 15) */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Voucher No</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Quarry & Bench</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Paid To</th>
                <th className="py-3.5 px-4">Mode / Ref</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-400 text-sm">
                    {exp.voucherNumber}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-white">{exp.date}</td>
                  <td className="py-3.5 px-4">
                    <div className="text-white font-medium">{exp.quarryName.split(' ')[0]} Pit</div>
                    <div className="text-[10px] text-slate-500">{exp.workingAreaName}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-white max-w-xs">{exp.description}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-200">{exp.paidTo}</td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    <div>{exp.paymentMode}</div>
                    <div className="text-slate-500 truncate">{exp.referenceNumber}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-black text-rose-400 text-sm">
                    ₹{exp.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {exp.status}
                    </span>
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
