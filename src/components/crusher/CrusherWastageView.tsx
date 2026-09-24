import React, { useState } from 'react';
import {
  AlertTriangle,
  Search,
  Plus,
  Layers,
  TrendingDown,
  CheckCircle2,
  Calendar,
  Building2,
  Sparkles,
  Info
} from 'lucide-react';
import { CrusherWastageLog } from '../../data/crusherStudioData';

interface CrusherWastageViewProps {
  wastageLogs: CrusherWastageLog[];
  onNavigatePage: (page: string) => void;
}

export const CrusherWastageView: React.FC<CrusherWastageViewProps> = ({
  wastageLogs,
  onNavigatePage
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = wastageLogs.filter(w =>
    w.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.plantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.recoveryPlan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalWastage = wastageLogs.reduce((acc, w) => acc + w.quantityTons, 0);
  const totalCostImpact = wastageLogs.reduce((acc, w) => acc + w.costImpactINR, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                BY-PRODUCT RECOVERY & SLURRY AUDIT
              </span>
              <h2 className="text-xl font-black text-white">Crushing Loss & Wastage Management</h2>
            </div>
          </div>
          <button
            onClick={() => alert('New wastage incident logged.')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Log Wastage Incident</span>
          </button>
        </div>

        {/* Wastage Specs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Logged Month Loss</span>
            <span className="text-xl font-black text-amber-400 font-mono mt-0.5">{totalWastage} MT</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Financial Cost Impact</span>
            <span className="text-xl font-black text-red-400 font-mono mt-0.5">₹{totalCostImpact.toLocaleString()}</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Plant Yield Recovery</span>
            <span className="text-xl font-black text-emerald-400 font-mono mt-0.5">97.8% Overall</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">GSB Roadbase Reuse</span>
            <span className="text-xl font-black text-cyan-400 font-mono mt-0.5">70% Reclaimed</span>
          </div>
        </div>
      </div>

      {/* Wastage Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl overflow-x-auto space-y-3">
        <h3 className="text-sm font-bold text-white">Wastage & By-Product Recovery Incident Registry</h3>
        <table className="w-full text-xs text-left text-slate-300">
          <thead className="bg-slate-950/70 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
            <tr>
              <th className="p-3">Ref Code</th>
              <th className="p-3">Date</th>
              <th className="p-3">Category & Root Cause</th>
              <th className="p-3">Loss Tonnage</th>
              <th className="p-3">Cost Impact</th>
              <th className="p-3">Reusability Status</th>
              <th className="p-3">Mitigation / Recovery Plan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map(w => (
              <tr key={w.id} className="hover:bg-slate-800/40">
                <td className="p-3 font-mono font-bold text-cyan-400">{w.id}</td>
                <td className="p-3 font-mono text-slate-400">{w.date}</td>
                <td className="p-3 font-bold text-white">
                  <div>{w.category}</div>
                  <div className="text-[10px] text-slate-500">{w.plantName}</div>
                </td>
                <td className="p-3 font-mono font-black text-amber-400">{w.quantityTons} MT</td>
                <td className="p-3 font-mono font-bold text-red-400">₹{w.costImpactINR.toLocaleString()}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                      w.isReusable
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}
                  >
                    {w.isReusable ? 'REUSABLE SUB-BASE' : 'UNREUSABLE SLURRY'}
                  </span>
                </td>
                <td className="p-3 text-slate-300 max-w-xs">{w.recoveryPlan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
