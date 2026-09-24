import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Phone,
  Mail,
  Building2,
  Info
} from 'lucide-react';
import { CrusherPartner } from '../../data/crusherStudioData';

interface CrusherPartnersViewProps {
  partners: CrusherPartner[];
  onOpenAddPartner: () => void;
  onNavigatePage: (page: string) => void;
}

export const CrusherPartnersView: React.FC<CrusherPartnersViewProps> = ({
  partners,
  onOpenAddPartner,
  onNavigatePage
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = partners.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm) ||
    p.panNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCapital = partners.reduce((acc, p) => acc + p.totalInvestment, 0);
  const totalProfitPaid = partners.reduce((acc, p) => acc + p.profitPaidToDate, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                INDEPENDENT PARTNERSHIP STRUCTURE
              </span>
              <h2 className="text-xl font-black text-white">Crusher Plant Partners</h2>
            </div>
          </div>
          <button
            onClick={onOpenAddPartner}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Crusher Partner</span>
          </button>
        </div>

        {/* Independence Architecture Explanation */}
        <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-300">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong>Crucial Architecture Rule:</strong> Crusher partnership is legally & financially independent from Quarry partnership. A person may be a Crusher Partner only, Quarry Partner only, or both, with separate P&L accounts.
            </span>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20 shrink-0">
            SEPARATE EQUITY & SETTLEMENTS
          </span>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Registered Partners</span>
            <span className="text-xl font-black text-white font-mono mt-0.5">{partners.length}</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Total Plant Equity</span>
            <span className="text-xl font-black text-cyan-400 font-mono mt-0.5">₹{(totalCapital / 10000000).toFixed(2)} Cr</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Profit Paid To Date</span>
            <span className="text-xl font-black text-emerald-400 font-mono mt-0.5">₹{(totalProfitPaid / 100000).toFixed(1)} L</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Pending Settlements</span>
            <span className="text-xl font-black text-amber-400 font-mono mt-0.5">₹8.4 L</span>
          </div>
        </div>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(partner => (
          <div
            key={partner.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between hover:border-cyan-500/40 transition space-y-4"
          >
            <div className="space-y-3">
              {/* Partner Name & Tag */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-cyan-400 font-bold">{partner.id}</span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                      {partner.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{partner.name}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-black text-cyan-400 block">
                    {partner.ownershipPercent}% Equity
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold block">
                    {partner.profitSharePercent}% Profit
                  </span>
                </div>
              </div>

              {/* Contact info */}
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 text-xs space-y-1.5 text-slate-400">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{partner.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{partner.email}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-900">
                  <span className="text-slate-500 font-mono">PAN: {partner.panNumber}</span>
                  <span className="text-slate-500 font-mono">Since {partner.effectiveDate}</span>
                </div>
              </div>

              {/* Financial Metrics */}
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950 rounded-2xl border border-slate-800/80 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Contributed Capital</span>
                  <span className="font-mono font-bold text-white block mt-0.5">
                    ₹{(partner.totalInvestment / 100000).toFixed(1)} L
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Dividends Received</span>
                  <span className="font-mono font-bold text-emerald-400 block mt-0.5">
                    ₹{(partner.profitPaidToDate / 100000).toFixed(1)} L
                  </span>
                </div>
              </div>

              {/* Multi-role Tags */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Party Roles Across System:</span>
                <div className="flex flex-wrap gap-1">
                  {partner.roleTags.map(tag => (
                    <span
                      key={tag}
                      className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${
                        tag.includes('Quarry')
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                          : tag.includes('Vehicle')
                          ? 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                          : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Assigned: {partner.assignedPlantNames.length} Plant(s)
              </span>
              <button
                onClick={() => onNavigatePage('partner-settlement')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                View Settlements
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
