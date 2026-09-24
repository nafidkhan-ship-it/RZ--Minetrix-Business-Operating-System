import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  DollarSign,
  PieChart,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { QuarryPartner } from '../../data/quarryStudioData';

interface QuarryPartnersViewProps {
  partners: QuarryPartner[];
  onOpenAddPartnerModal?: () => void;
}

export const QuarryPartnersView: React.FC<QuarryPartnersViewProps> = ({
  partners,
  onOpenAddPartnerModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPartners = partners.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCapital = partners.reduce((acc, p) => acc + p.investmentAmount, 0);

  return (
    <div className="space-y-6">
      {/* Key Principle Banner (Section 8) */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-slate-900 to-slate-900 border border-purple-500/20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-purple-300">
              CRITICAL DISTINCTION &bull; LAND OWNER &ne; QUARRY PARTNER
            </div>
            <p className="text-[11px] text-slate-400">
              A person may be Land Owner only, Quarry Partner only, or Both (e.g. Shri V. Prabhakar Pai).
              Investment %, Ownership %, Profit %, and Loss % are configured independently.
            </p>
          </div>
        </div>
      </div>

      {/* Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              EQUITY & PROFIT SHARE
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ({filteredPartners.length} partners registered)
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Quarry Operating Partners</h2>
          <p className="text-xs text-slate-400">
            Capital contribution, independent ownership, profit, loss, revenue, and expense sharing matrix.
          </p>
        </div>

        <button
          onClick={() => alert('New Partner Registration Form (Simulated)')}
          className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 flex items-center gap-2 transition shadow-lg shadow-amber-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Quarry Partner</span>
        </button>
      </div>

      {/* Total Capitalization Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Partner Capital</span>
          <span className="text-xl font-black text-emerald-400 font-mono">
            ₹{totalCapital.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-500 block">3 Managing Entities</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Ownership Allocation</span>
          <span className="text-xl font-black text-amber-400 font-mono">100.0%</span>
          <span className="text-[10px] text-amber-500/80 block">Fully Subscribed</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Profit Distribution</span>
          <span className="text-xl font-black text-cyan-400 font-mono">100.0%</span>
          <span className="text-[10px] text-cyan-500/80 block">Standard Ratio Matrix</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Entity Archetypes</span>
          <span className="text-sm font-bold text-white block mt-1">1 Dual (Owner & Partner)</span>
          <span className="text-[10px] text-slate-500 block">2 Managing Partners</span>
        </div>
      </div>

      {/* Partner Table (Section 8) */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Partner Name</th>
                <th className="py-3.5 px-4">Investment Capital</th>
                <th className="py-3.5 px-4">Ownership %</th>
                <th className="py-3.5 px-4">Profit %</th>
                <th className="py-3.5 px-4">Loss %</th>
                <th className="py-3.5 px-4">Revenue %</th>
                <th className="py-3.5 px-4">Expense %</th>
                <th className="py-3.5 px-4">Effective From</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPartners.map((partner) => (
                <tr key={partner.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white text-sm">{partner.name}</div>
                    <div className="text-[10px] font-mono text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{partner.phone}</span>
                      {partner.isAlsoLandOwner && (
                        <span className="text-purple-400 font-bold bg-purple-500/10 px-1.5 py-0.2 rounded border border-purple-500/20">
                          Also Land Owner
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white">
                    ₹{partner.investmentAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-400 text-sm">
                    {partner.ownershipPercent}%
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 text-sm">
                    {partner.profitPercent}%
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-rose-400 text-sm">
                    {partner.lossPercent}%
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">{partner.revenuePercent}%</td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">{partner.expensePercent}%</td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">{partner.effectiveFrom}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {partner.status}
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
