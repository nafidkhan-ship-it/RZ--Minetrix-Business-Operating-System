import React from 'react';
import {
  Pickaxe,
  Truck,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileText,
  Layers,
  Users,
  ShieldCheck,
  Plus,
  ArrowUpRight,
  Sparkles,
  Info,
  Calendar,
  DollarSign
} from 'lucide-react';
import {
  QuarryItem,
  QuarryLoad,
  SAMPLE_ACTIVITY_LOG,
  SAMPLE_ALERTS,
  ProductionEntry,
  SettlementRecord
} from '../../data/quarryStudioData';

interface QuarryDashboardViewProps {
  quarries: QuarryItem[];
  loads: QuarryLoad[];
  productions: ProductionEntry[];
  settlements: SettlementRecord[];
  onNavigate: (page: string) => void;
  onOpenQuickAction: (action: string) => void;
}

export const QuarryDashboardView: React.FC<QuarryDashboardViewProps> = ({
  quarries,
  loads,
  productions,
  settlements,
  onNavigate,
  onOpenQuickAction
}) => {
  const activeQuarriesCount = quarries.filter((q) => q.status === 'ACTIVE').length;
  const totalWorkingAreas = quarries.reduce((acc, q) => acc + q.workingAreasCount, 0);

  // Today's stats calculation
  const todayLoads = loads.filter((l) => l.date === '2026-09-22');
  const todaySalesAmount = todayLoads.reduce((acc, l) => acc + l.totalAmount, 0);

  const lateriteProd = productions
    .filter((p) => p.material === 'Laterite' && p.date === '2026-09-22')
    .reduce((acc, p) => acc + p.quantity, 0);

  const hardRockProd = productions
    .filter((p) => p.material === 'Hard Rock' && p.date === '2026-09-22')
    .reduce((acc, p) => acc + p.quantity, 0);

  const aggregateProd = productions
    .filter((p) => p.material === 'Aggregate' || p.material === 'Granite')
    .reduce((acc, p) => acc + p.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Action Launchpad */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/20 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              PLATFORM 01 &bull; STUDIO PREVIEW
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ALL SERVICES OPERATIONAL
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Quarry Management Workspace
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Unified concession control: land parcel surveying, multi-owner royalties, independent partner equity,
            pit wire-saw & blast extraction, traceable dispatch loads, and regulatory compliance.
          </p>
        </div>

        {/* Studio Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onOpenQuickAction('flow')}
            className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/30 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Flow Walkthrough</span>
          </button>

          <button
            onClick={() => onOpenQuickAction('new-quarry')}
            className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-black hover:bg-amber-400 flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Quarry</span>
          </button>
        </div>
      </div>

      {/* TOP 8 KPI CARDS (as specified in Section 2) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* KPI 1: Total Quarries */}
        <div
          onClick={() => onNavigate('quarries')}
          className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-400/40 cursor-pointer transition"
        >
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Quarries</span>
          <div className="text-xl font-black text-white mt-1 font-mono">{quarries.length}</div>
          <span className="text-[10px] text-amber-400 font-medium">Licensed Pits</span>
        </div>

        {/* KPI 2: Active Quarries */}
        <div
          onClick={() => onNavigate('quarries')}
          className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-400/40 cursor-pointer transition"
        >
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Active Quarries</span>
          <div className="text-xl font-black text-emerald-400 mt-1 font-mono">{activeQuarriesCount}</div>
          <span className="text-[10px] text-emerald-500 font-medium">Full Production</span>
        </div>

        {/* KPI 3: Working Areas */}
        <div
          onClick={() => onNavigate('working-areas')}
          className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-400/40 cursor-pointer transition"
        >
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Working Areas</span>
          <div className="text-xl font-black text-white mt-1 font-mono">{totalWorkingAreas}</div>
          <span className="text-[10px] text-slate-400 font-medium">Active Benches</span>
        </div>

        {/* KPI 4: Today's Production */}
        <div
          onClick={() => onNavigate('production')}
          className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-400/40 cursor-pointer transition"
        >
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Today's Production</span>
          <div className="text-xl font-black text-amber-400 mt-1 font-mono">5,000</div>
          <span className="text-[10px] text-slate-400 font-medium">Cut Stones + 1,450 MT</span>
        </div>

        {/* KPI 5: Today's Loads */}
        <div
          onClick={() => onNavigate('loads')}
          className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-400/40 cursor-pointer transition"
        >
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Today's Loads</span>
          <div className="text-xl font-black text-cyan-400 mt-1 font-mono">34</div>
          <span className="text-[10px] text-cyan-500 font-medium">Dispatched Pit Loads</span>
        </div>

        {/* KPI 6: Today's Sales */}
        <div
          onClick={() => onNavigate('sales')}
          className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-400/40 cursor-pointer transition"
        >
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Today's Sales</span>
          <div className="text-lg font-black text-emerald-400 mt-1 font-mono">₹1,48,200</div>
          <span className="text-[10px] text-emerald-500 font-medium">₹66.9L MTD</span>
        </div>

        {/* KPI 7: Pending Land Owner Payments */}
        <div
          onClick={() => onNavigate('owners')}
          className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-400/40 cursor-pointer transition"
        >
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Owner Balances</span>
          <div className="text-lg font-black text-rose-400 mt-1 font-mono">₹6,15,000</div>
          <span className="text-[10px] text-rose-400/80 font-medium">4 Land Owners</span>
        </div>

        {/* KPI 8: Pending Settlements */}
        <div
          onClick={() => onNavigate('settlements')}
          className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-400/40 cursor-pointer transition"
        >
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Settlements</span>
          <div className="text-lg font-black text-amber-300 mt-1 font-mono">₹1,75,000</div>
          <span className="text-[10px] text-amber-400/80 font-medium">2 In Approval</span>
        </div>
      </div>

      {/* QUICK ACTION BUTTONS BAR (Section 20) */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3 overflow-x-auto">
        <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider shrink-0">
          Quick Actions:
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenQuickAction('new-quarry')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition whitespace-nowrap"
          >
            + New Quarry
          </button>
          <button
            onClick={() => onOpenQuickAction('add-parcel')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition whitespace-nowrap"
          >
            + Add Land Parcel
          </button>
          <button
            onClick={() => onOpenQuickAction('add-owner')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition whitespace-nowrap"
          >
            + Add Land Owner
          </button>
          <button
            onClick={() => onOpenQuickAction('new-agreement')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition whitespace-nowrap"
          >
            + New Agreement
          </button>
          <button
            onClick={() => onOpenQuickAction('production-entry')}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition whitespace-nowrap"
          >
            + Production Entry
          </button>
          <button
            onClick={() => onOpenQuickAction('new-load')}
            className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-black transition whitespace-nowrap hover:bg-amber-400"
          >
            + New Load
          </button>
          <button
            onClick={() => onOpenQuickAction('expense')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition whitespace-nowrap"
          >
            + Expense
          </button>
        </div>
      </div>

      {/* PRODUCTION OVERVIEW BY MATERIAL (Section 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Hard Rock */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Layers className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-sm">Hard Rock / Granite</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/10 text-blue-300 border border-blue-500/20">
              Active Blasting
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">1,450</span>
            <span className="text-xs text-slate-400 font-medium">MT Extracted Today</span>
          </div>
          <p className="text-xs text-slate-400">
            Feed delivered to Ullal & Moodbidri crushers. Primary basalt blasting yields high-density aggregate.
          </p>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Pit Stock: 12,400 MT</span>
            <button
              onClick={() => onNavigate('production')}
              className="text-amber-400 hover:underline font-semibold"
            >
              View Shift Logs &rarr;
            </button>
          </div>
        </div>

        {/* Laterite */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Pickaxe className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-sm">Laterite Building Stone</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20">
              Wire-Saw Cut
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-400 font-mono">5,000</span>
            <span className="text-xs text-slate-400 font-medium">Cut Stones Today</span>
          </div>
          <p className="text-xs text-slate-400">
            Kasaragod North & Manjeshwar Pits. 12x8x6 in Grade A red laterite stones for coastal construction.
          </p>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Pit Stock: 27,600 Stones</span>
            <button
              onClick={() => onNavigate('production')}
              className="text-amber-400 hover:underline font-semibold"
            >
              View Shift Logs &rarr;
            </button>
          </div>
        </div>

        {/* Other Materials */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Truck className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-sm">Aggregates & Clay</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              By-Product Yield
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400 font-mono">980</span>
            <span className="text-xs text-slate-400 font-medium">MT Secondary Output</span>
          </div>
          <p className="text-xs text-slate-400">
            Laterite overburden clay, GSB, sub-base gravel, and M-sand feed ready for road and brick works.
          </p>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Pit Stock: 8,600 MT</span>
            <button
              onClick={() => onNavigate('production')}
              className="text-amber-400 hover:underline font-semibold"
            >
              View Shift Logs &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* TODAY'S LOADS TABLE (Section 2) */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-black text-white">Today's Dispatched Loads</h2>
            <span className="text-xs text-slate-400 font-mono">({loads.length} Loads Registered)</span>
          </div>
          <button
            onClick={() => onNavigate('loads')}
            className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
          >
            <span>Open All Loads</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Load No</th>
                <th className="py-3 px-3">Quarry Pit</th>
                <th className="py-3 px-3">Working Area</th>
                <th className="py-3 px-3">Material</th>
                <th className="py-3 px-3">Qty</th>
                <th className="py-3 px-3">Vehicle</th>
                <th className="py-3 px-3">Driver</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loads.slice(0, 5).map((load) => (
                <tr key={load.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 px-3 font-mono font-bold text-amber-400">{load.loadNumber}</td>
                  <td className="py-3 px-3 text-white font-medium">{load.quarryName.split(' ')[0]} Pit</td>
                  <td className="py-3 px-3 text-slate-400">{load.workingAreaName}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-amber-300">
                      {load.material}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-white">
                    {load.quantity} {load.unit}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-300">{load.vehicleNumber}</td>
                  <td className="py-3 px-3 text-slate-400">{load.driverName}</td>
                  <td className="py-3 px-3 text-slate-200">{load.customerName}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        load.status === 'Delivered'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : load.status === 'Dispatched'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : load.status === 'Gate Pass Issued'
                              ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                              : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {load.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECENT ACTIVITY & ALERTS (Section 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Log */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-black text-white">Recent Activity Stream</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Live Concession Telemetry</span>
          </div>

          <div className="space-y-3">
            {SAMPLE_ACTIVITY_LOG.map((act) => (
              <div
                key={act.id}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate">{act.title}</span>
                    <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap ml-2">{act.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{act.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Concession Alerts */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <h3 className="text-base font-black text-white">Concession & Compliance Alerts</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-rose-500/10 text-rose-300 border border-rose-500/20">
              5 Attention Items
            </span>
          </div>

          <div className="space-y-3">
            {SAMPLE_ALERTS.map((alt) => (
              <div
                key={alt.id}
                className={`p-3 rounded-2xl border flex items-start justify-between gap-3 ${
                  alt.level === 'HIGH'
                    ? 'bg-rose-950/20 border-rose-500/30'
                    : alt.level === 'MEDIUM'
                      ? 'bg-amber-950/20 border-amber-500/30'
                      : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        alt.level === 'HIGH'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {alt.category}
                    </span>
                    <span className="text-xs font-bold text-white">{alt.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-300">{alt.message}</p>
                </div>
                <button
                  onClick={() => {
                    if (alt.actionText.includes('Owner')) onNavigate('owners');
                    else if (alt.actionText.includes('Settlement')) onNavigate('settlements');
                    else if (alt.actionText.includes('Agreement')) onNavigate('agreements');
                    else onNavigate('documents');
                  }}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-[11px] text-white font-bold whitespace-nowrap shrink-0 transition"
                >
                  {alt.actionText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
