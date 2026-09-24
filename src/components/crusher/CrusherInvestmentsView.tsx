import React, { useState } from 'react';
import {
  DollarSign,
  Search,
  Plus,
  TrendingUp,
  FileText,
  Calendar,
  CheckCircle2,
  Building2,
  Users,
  Info
} from 'lucide-react';
import { CrusherInvestment, CrusherPartner } from '../../data/crusherStudioData';

interface CrusherInvestmentsViewProps {
  investments: CrusherInvestment[];
  partners: CrusherPartner[];
  onOpenAddInvestment: () => void;
  onNavigatePage: (page: string) => void;
}

export const CrusherInvestmentsView: React.FC<CrusherInvestmentsViewProps> = ({
  investments,
  partners,
  onOpenAddInvestment,
  onNavigatePage
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filtered = investments.filter(inv => {
    const matchSearch =
      inv.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.investmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.plantName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === 'ALL' || inv.type === typeFilter;
    return matchSearch && matchType;
  });

  const totalInvested = investments.reduce((acc, i) => acc + i.amount, 0);

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
                CRUSHER CAPITAL LEDGER &bull; EQUITY ACCOUNTS
              </span>
              <h2 className="text-xl font-black text-white">Investments & Capital Contributions</h2>
            </div>
          </div>
          <button
            onClick={onOpenAddInvestment}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Investment</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Total Capital Injected</span>
            <span className="text-xl font-black text-cyan-400 font-mono mt-0.5">₹{(totalInvested / 10000000).toFixed(2)} Cr</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Plant Expansion Equity</span>
            <span className="text-xl font-black text-white font-mono mt-0.5">₹48.0 L</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Working Capital Loans</span>
            <span className="text-xl font-black text-amber-400 font-mono mt-0.5">₹20.0 L</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Reconciled Entries</span>
            <span className="text-xl font-black text-emerald-400 font-mono mt-0.5">100% Verified</span>
          </div>
        </div>

        {/* Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by partner name, voucher no, or plant..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9.5 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="ALL">All Investment Types</option>
              <option value="Initial Equity Capital">Initial Equity Capital</option>
              <option value="Equipment Investment (VSI/Cone)">Equipment Investment (VSI/Cone)</option>
              <option value="Working Capital Loan">Working Capital Loan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl overflow-x-auto">
        <table className="w-full text-xs text-left text-slate-300">
          <thead className="bg-slate-950/70 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
            <tr>
              <th className="p-3">Voucher Ref</th>
              <th className="p-3">Partner Name</th>
              <th className="p-3">Crusher Facility</th>
              <th className="p-3">Category</th>
              <th className="p-3">Date</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Equity Impact</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map(inv => (
              <tr key={inv.id} className="hover:bg-slate-800/40">
                <td className="p-3 font-mono font-bold text-cyan-400">{inv.investmentNumber}</td>
                <td className="p-3 font-bold text-white">{inv.partnerName}</td>
                <td className="p-3 text-slate-400 truncate max-w-xs">{inv.plantName}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                    {inv.type}
                  </span>
                </td>
                <td className="p-3 font-mono text-slate-400">{inv.date}</td>
                <td className="p-3 font-mono font-black text-emerald-400">₹{inv.amount.toLocaleString()}</td>
                <td className="p-3 font-mono text-cyan-400">+{inv.ownershipPercentImpact}%</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold font-mono">
                    {inv.status}
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
