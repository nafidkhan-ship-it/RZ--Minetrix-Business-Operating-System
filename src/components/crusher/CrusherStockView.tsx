import React, { useState } from 'react';
import {
  Layers,
  Search,
  Plus,
  AlertTriangle,
  Building2,
  TrendingUp,
  Sliders,
  Sparkles,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { CrusherStockItem } from '../../data/crusherStudioData';

interface CrusherStockViewProps {
  stocks: CrusherStockItem[];
  onOpenNewProduction: () => void;
  onNavigatePage: (page: string) => void;
}

export const CrusherStockView: React.FC<CrusherStockViewProps> = ({
  stocks,
  onOpenNewProduction,
  onNavigatePage
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = stocks.filter(s => {
    const matchSearch =
      s.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.siloOrBayLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || s.healthStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalStockTons = stocks.reduce((acc, s) => acc + s.closingStockTons, 0);
  const totalStockValuation = stocks.reduce((acc, s) => acc + s.stockValueINR, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                SILOS & STOCKPILE MANAGEMENT
              </span>
              <h2 className="text-xl font-black text-white">Finished Aggregates Live Inventory</h2>
            </div>
          </div>
          <button
            onClick={() => alert('Stock adjustment logged.')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
            <span>Physical Stock Audit / Adjustment</span>
          </button>
        </div>

        {/* Global Stock Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Aggregate Stock Total</span>
            <span className="text-xl font-black text-white font-mono mt-0.5">{totalStockTons.toLocaleString()} MT</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Inventory Book Valuation</span>
            <span className="text-xl font-black text-emerald-400 font-mono mt-0.5">₹{(totalStockValuation / 100000).toFixed(1)} L</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Silo Average Utilization</span>
            <span className="text-xl font-black text-cyan-400 font-mono mt-0.5">68.4%</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Stock Buffers</span>
            <span className="text-xl font-black text-emerald-400 font-mono mt-0.5">All Optimal</span>
          </div>
        </div>

        {/* Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by product name or silo location..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9.5 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="ALL">All Silo Health Statuses</option>
              <option value="Healthy">Healthy (Optimal Reserve)</option>
              <option value="Warning">Warning (Buffer Critical)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Silo Gauges Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(stk => {
          const capPercent = Math.min(100, Math.round((stk.closingStockTons / 6000) * 100));
          return (
            <div
              key={stk.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between hover:border-cyan-500/40 transition space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-cyan-400 font-bold block">
                      {stk.siloOrBayLocation}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">{stk.productName}</h3>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full border text-[10px] font-mono font-bold ${
                      stk.healthStatus === 'Healthy'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}
                  >
                    {stk.healthStatus}
                  </span>
                </div>

                {/* Big Tonnage Counter */}
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black font-mono text-cyan-400">
                    {stk.closingStockTons.toLocaleString()} MT
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ₹{(stk.stockValueINR / 100000).toFixed(1)} Lakhs
                  </span>
                </div>

                {/* Progress bar level indicator */}
                <div className="space-y-1.5">
                  <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800 p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        capPercent > 70 ? 'bg-cyan-500' : capPercent > 35 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${capPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Min Buffer: {stk.reorderLevelTons} MT</span>
                    <span>{capPercent}% Storage Full</span>
                  </div>
                </div>

                {/* Inward/Outward movements today */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950 rounded-2xl border border-slate-800/80 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Crushed In Today</span>
                    <span className="font-mono font-bold text-emerald-400 block mt-0.5">
                      +{stk.inwardTodayTons} MT
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Dispatched Today</span>
                    <span className="font-mono font-bold text-blue-400 block mt-0.5">
                      -{stk.outwardTodayTons} MT
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono text-[10px]">Audit: {stk.lastUpdated}</span>
                <button
                  onClick={() => onNavigatePage('dispatch')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 font-bold transition cursor-pointer"
                >
                  Dispatch Tiper
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
