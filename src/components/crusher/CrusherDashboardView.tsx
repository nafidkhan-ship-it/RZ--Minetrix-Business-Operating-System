import React from 'react';
import {
  Building2,
  Activity,
  Layers,
  Zap,
  Fuel,
  Wrench,
  TrendingUp,
  Truck,
  BarChart3,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Plus,
  DollarSign,
  Users,
  FileText,
  ShieldCheck,
  Download,
  Printer,
  Sparkles,
  Clock,
  ExternalLink,
  ChevronRight,
  Eye,
  Sliders,
  Scale,
  ShoppingBag,
  CreditCard,
  Check,
  ArrowRight,
  Info
} from 'lucide-react';
import {
  CrusherPlant,
  CrusherStockItem,
  MaterialReceipt,
  CrusherProduction,
  SAMPLE_ALERTS,
  SAMPLE_ACTIVITY_LOGS
} from '../../data/crusherStudioData';

interface CrusherDashboardViewProps {
  plants: CrusherPlant[];
  stocks: CrusherStockItem[];
  receipts: MaterialReceipt[];
  productions: CrusherProduction[];
  onNavigatePage: (pageId: any) => void;
  onOpenNewPlant: () => void;
  onOpenNewReceipt: () => void;
  onOpenNewProduction: () => void;
  onOpenWorkflow: () => void;
  onSelectPlant: (plant: CrusherPlant) => void;
}

export const CrusherDashboardView: React.FC<CrusherDashboardViewProps> = ({
  plants,
  stocks,
  receipts,
  productions,
  onNavigatePage,
  onOpenNewPlant,
  onOpenNewReceipt,
  onOpenNewProduction,
  onOpenWorkflow,
  onSelectPlant
}) => {
  const activePlant = plants[0];

  return (
    <div className="space-y-6">
      {/* Studio Preview / Demo Notice Banner */}
      <div className="p-3.5 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-cyan-300">
          <Sparkles className="w-4 h-4 shrink-0 text-cyan-400" />
          <span>
            <strong>RZ® Minetrix Platform 2 — Crusher Management Studio Preview:</strong> Fully integrated 3-stage crushing, quarry-to-crusher weighbridge traceability, independent partner equity, and automated silo stock telemetry.
          </span>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/30">
            DEMO / SAMPLE DATA
          </span>
          <button
            onClick={onOpenWorkflow}
            className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
          >
            Traceability Model &rarr;
          </button>
        </div>
      </div>

      {/* 1. EXECUTIVE KPI METRICS (Exact Metrics from Specification) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
        <div
          onClick={() => onNavigatePage('crusher-plants')}
          className="p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-cyan-500/40 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Crusher Plants</span>
            <Building2 className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-black text-white font-mono mt-1">{plants.length} Units</div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1">2 Operational &bull; 1 Standby</div>
        </div>

        <div
          onClick={() => onNavigatePage('production')}
          className="p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-cyan-500/40 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Production Today</span>
            <Activity className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-black text-cyan-400 font-mono mt-1">1,490 MT</div>
          <div className="text-[11px] text-slate-400 mt-1">M-Sand 680T &bull; 20mm 510T</div>
        </div>

        <div
          onClick={() => onNavigatePage('production')}
          className="p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-cyan-500/40 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Production Month</span>
            <TrendingUp className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-black text-white font-mono mt-1">38,400 MT</div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1">+16.8% vs Target</div>
        </div>

        <div
          onClick={() => onNavigatePage('stock')}
          className="p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-cyan-500/40 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Material Stock in Silos</span>
            <Layers className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">12,650 MT</div>
          <div className="text-[11px] text-slate-400 mt-1">Silos 72% &bull; Yard Stock 28%</div>
        </div>

        <div
          onClick={() => onNavigatePage('dispatch')}
          className="p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-cyan-500/40 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Dispatch Today</span>
            <Truck className="w-4 h-4 text-blue-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-black text-blue-400 font-mono mt-1">52 Tippers</div>
          <div className="text-[11px] text-slate-400 mt-1">1,420 MT Outward Weighed</div>
        </div>

        <div
          onClick={() => onNavigatePage('sales')}
          className="p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-cyan-500/40 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Crusher Sales Month</span>
            <DollarSign className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">₹82.4 L</div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1">Avg ₹620/MT Realization</div>
        </div>

        <div
          onClick={() => onNavigatePage('raw-material')}
          className="p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-cyan-500/40 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Raw Boulder Intake</span>
            <Scale className="w-4 h-4 text-slate-300 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-black text-slate-200 font-mono mt-1">42,000 MT</div>
          <div className="text-[11px] text-slate-400 mt-1">Own Pit: 88% &bull; Ext: 12%</div>
        </div>

        <div
          onClick={() => onNavigatePage('expenses')}
          className="p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-cyan-500/40 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Power & Fuel Index</span>
            <Zap className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-black text-yellow-400 font-mono mt-1">4.2 kWh/T</div>
          <div className="text-[11px] text-cyan-400 mt-1">Diesel: 0.85 L/T (Optimum)</div>
        </div>
      </div>

      {/* 2. QUICK ACTION CENTER (Section 25: 13 Quick Actions) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Crusher Quick Action Center
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500">13 Workflows Available</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-1">
          <button
            onClick={onOpenNewPlant}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80 text-left transition group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              <Plus className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
            </div>
            <span className="text-xs font-bold text-white block">New Plant</span>
            <span className="text-[10px] text-slate-500">Register facility</span>
          </button>

          <button
            onClick={onOpenNewReceipt}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80 text-left transition group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1">
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <Plus className="w-3 h-3 text-slate-500 group-hover:text-amber-400" />
            </div>
            <span className="text-xs font-bold text-white block">Receive Boulder</span>
            <span className="text-[10px] text-slate-500">Quarry weighbridge</span>
          </button>

          <button
            onClick={onOpenNewProduction}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80 text-left transition group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <Plus className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
            </div>
            <span className="text-xs font-bold text-white block">Log Production</span>
            <span className="text-[10px] text-slate-500">Shift outputs</span>
          </button>

          <button
            onClick={() => onNavigatePage('sales')}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80 text-left transition group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1">
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
              <Plus className="w-3 h-3 text-slate-500 group-hover:text-emerald-400" />
            </div>
            <span className="text-xs font-bold text-white block">New Sale</span>
            <span className="text-[10px] text-slate-500">Aggregate invoice</span>
          </button>

          <button
            onClick={() => onNavigatePage('gate-entry')}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80 text-left transition group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1">
              <Truck className="w-3.5 h-3.5 text-blue-400" />
              <Plus className="w-3 h-3 text-slate-500 group-hover:text-blue-400" />
            </div>
            <span className="text-xs font-bold text-white block">Gate Entry</span>
            <span className="text-[10px] text-slate-500">Security check-in</span>
          </button>

          <button
            onClick={() => onNavigatePage('gate-pass')}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80 text-left transition group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1">
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <Plus className="w-3 h-3 text-slate-500 group-hover:text-purple-400" />
            </div>
            <span className="text-xs font-bold text-white block">Issue Gate Pass</span>
            <span className="text-[10px] text-slate-500">QR digital pass</span>
          </button>

          <button
            onClick={() => onNavigatePage('partner-settlement')}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80 text-left transition group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1">
              <Users className="w-3.5 h-3.5 text-rose-400" />
              <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-rose-400" />
            </div>
            <span className="text-xs font-bold text-white block">Settlement</span>
            <span className="text-[10px] text-slate-500">Partner dividend</span>
          </button>
        </div>
      </div>

      {/* 3. MIDDLE SECTION: LIVE SILO STOCK & QUARRY-TO-CRUSHER PIPELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Silo Stock Gauges */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                SILO LEVEL & STOCKPILE RADAR
              </span>
              <h3 className="text-base font-bold text-white">Aggregates & M-Sand Live Inventory</h3>
            </div>
            <button
              onClick={() => onNavigatePage('stock')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <span>View Full Inventory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {stocks.slice(0, 4).map(stk => {
              const fillPct = Math.min(100, Math.round((stk.closingStockTons / 6000) * 100));
              return (
                <div
                  key={stk.id}
                  className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{stk.productName}</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        stk.healthStatus === 'Healthy'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {stk.healthStatus}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-mono font-black text-cyan-400">
                      {stk.closingStockTons.toLocaleString()} MT
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      ₹{(stk.stockValueINR / 100000).toFixed(1)} L
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          fillPct > 70 ? 'bg-cyan-500' : fillPct > 30 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>{stk.siloOrBayLocation}</span>
                      <span>{fillPct}% Capacity</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Traceability Flow Widget */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Truck className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                QUARRY → CRUSHER TRACEABILITY
              </span>
            </div>
            <h3 className="text-base font-bold text-white">Direct Feeder Pipeline</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Real-time link connecting Kasaragod North Laterite Pit #01 to Plant CP-01. Every boulder tipper links to pit blast bench & weighbridge gross slip.
            </p>

            <div className="mt-4 p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Active Quarry Feed:</span>
                <span className="font-bold text-white">Pit #01 Bench A</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Pending Inward Tippers:</span>
                <span className="font-mono font-bold text-cyan-400">4 En-Route</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Intake Rate / Ton:</span>
                <span className="font-mono font-bold text-emerald-400">₹340 / MT</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={onOpenWorkflow}
              className="w-full py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Open Traceability Pipeline Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. RECENT ACTIVITY & ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance & Operations Alerts */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Operational & Compliance Alerts</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Auto-Audited</span>
          </div>

          <div className="space-y-2.5">
            {SAMPLE_ALERTS.map(alert => (
              <div
                key={alert.id}
                className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-mono font-black px-1.5 py-0.5 rounded ${
                        alert.level === 'HIGH'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : alert.level === 'MEDIUM'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      }`}
                    >
                      {alert.level}
                    </span>
                    <span className="font-bold text-white">{alert.title}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-normal">{alert.message}</p>
                </div>
                <button
                  onClick={() => onNavigatePage(alert.category === 'Compliance' ? 'documents' : alert.category === 'Finance' ? 'partner-settlement' : 'stock')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold shrink-0 transition"
                >
                  {alert.actionText}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Live Operational Activity Log */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Live Activity Stream</h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Telemetry
            </span>
          </div>

          <div className="space-y-2.5">
            {SAMPLE_ACTIVITY_LOGS.map(act => (
              <div
                key={act.id}
                className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">{act.title}</span>
                    <span className="text-[11px] text-slate-400 block">{act.desc}</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono shrink-0">{act.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
