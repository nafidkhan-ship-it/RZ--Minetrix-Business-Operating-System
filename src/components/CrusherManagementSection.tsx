import React, { useState } from 'react';
import {
  Building2,
  Cpu,
  Layers,
  Activity,
  Truck,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  BarChart3,
  Gauge,
  Fuel,
  Zap,
  Users,
  Wrench,
  DollarSign,
  FileText,
  ShieldCheck,
  Scale,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Package,
  ShoppingBag,
  Coins
} from 'lucide-react';

interface CrusherPlant {
  id: string;
  code: string;
  name: string;
  location: string;
  crusherType: '3_STAGE_VSI' | '2_STAGE_CONE' | 'PRIMARY_JAW_ONLY';
  capacityTPH: number; // Tons per hour
  operatingStatus: 'RUNNING' | 'MAINTENANCE' | 'IDLE' | 'BREAKDOWN';
  currentThroughputTPH: number;
  feedMaterial: string;
  powerSource: 'GRID_3_PHASE' | 'GENSET_DIESEL';
  powerMeterKWh: number;
  fuelBalanceLitres: number;
  managerName: string;
}

interface AggregateStock {
  id: string;
  code: string;
  name: string;
  grade: 'M_SAND' | 'P_SAND' | '20MM' | '12MM' | '6MM' | 'GBS_BASE';
  currentStockTons: number;
  bufferStockTons: number;
  unitPricePerTonRs: number;
  finenessModulus?: number;
  siltContentPercent?: number;
  moisturePercent: number;
  dailyProducedTons: number;
  dailyDispatchedTons: number;
}

interface DispatchTicket {
  id: string;
  ticketNumber: string;
  vehicleNumber: string;
  customerName: string;
  productName: string;
  grossWeightTons: number;
  tareWeightTons: number;
  netWeightTons: number;
  ratePerTonRs: number;
  totalAmountRs: number;
  gstAmountRs: number;
  dispatchTime: string;
  status: 'DISPATCHED' | 'WEIGHED_OUT' | 'PENDING_APPROVAL';
}

export const CrusherManagementSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'plant-overview'
    | 'production-aggregates'
    | 'stock-silos'
    | 'dispatch-weighbridge'
    | 'plant-maintenance'
    | 'power-fuel-labour'
    | 'financials-ledger'
    | 'reports-analytics'
  >('plant-overview');

  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Plants State
  const [plants, setPlants] = useState<CrusherPlant[]>([
    {
      id: 'PLANT-01',
      code: 'CRUSH-WYD-01',
      name: 'Wayanad High-Tech 3-Stage VSI Sand Plant',
      location: 'Meppadi Hills, Wayanad, Kerala',
      crusherType: '3_STAGE_VSI',
      capacityTPH: 250,
      operatingStatus: 'RUNNING',
      currentThroughputTPH: 228,
      feedMaterial: 'Granite Boulders (400mm-600mm)',
      powerSource: 'GRID_3_PHASE',
      powerMeterKWh: 14820,
      fuelBalanceLitres: 4200,
      managerName: 'Sunil Kurian (Crusher Lead)'
    },
    {
      id: 'PLANT-02',
      code: 'CRUSH-KSD-02',
      name: 'Kasaragod Secondary Cone Crushing Station',
      location: 'Kanhangad Industrial Zone, Kasaragod',
      crusherType: '2_STAGE_CONE',
      capacityTPH: 180,
      operatingStatus: 'RUNNING',
      currentThroughputTPH: 165,
      feedMaterial: 'Granite & Hard Basalt Rocks',
      powerSource: 'GRID_3_PHASE',
      powerMeterKWh: 9810,
      fuelBalanceLitres: 2800,
      managerName: 'K. R. Varma'
    }
  ]);

  // Aggregate Materials & Stockpile
  const [aggregates, setAggregates] = useState<AggregateStock[]>([
    {
      id: 'AGG-01',
      code: 'MSAND-GRADE-A',
      name: 'M-Sand (Manufactured Sand for Concrete)',
      grade: 'M_SAND',
      currentStockTons: 1840,
      bufferStockTons: 500,
      unitPricePerTonRs: 650,
      finenessModulus: 2.85,
      siltContentPercent: 2.4,
      moisturePercent: 3.1,
      dailyProducedTons: 380,
      dailyDispatchedTons: 310
    },
    {
      id: 'AGG-02',
      code: 'PSAND-PLASTER',
      name: 'P-Sand (Superfine Plastering Sand)',
      grade: 'P_SAND',
      currentStockTons: 920,
      bufferStockTons: 300,
      unitPricePerTonRs: 820,
      finenessModulus: 1.65,
      siltContentPercent: 1.8,
      moisturePercent: 2.2,
      dailyProducedTons: 160,
      dailyDispatchedTons: 145
    },
    {
      id: 'AGG-03',
      code: 'AGG-20MM',
      name: '20mm Graded Aggregate (Coarse Concrete)',
      grade: '20MM',
      currentStockTons: 3450,
      bufferStockTons: 800,
      unitPricePerTonRs: 520,
      moisturePercent: 1.2,
      dailyProducedTons: 520,
      dailyDispatchedTons: 490
    },
    {
      id: 'AGG-04',
      code: 'AGG-12MM',
      name: '12mm Clean Cubical Aggregate (Roads & Slabs)',
      grade: '12MM',
      currentStockTons: 1680,
      bufferStockTons: 400,
      unitPricePerTonRs: 540,
      moisturePercent: 1.0,
      dailyProducedTons: 290,
      dailyDispatchedTons: 260
    },
    {
      id: 'AGG-05',
      code: 'AGG-6MM-CHIPS',
      name: '6mm Aggregate Chips (Pavers & Asphalt)',
      grade: '6MM',
      currentStockTons: 840,
      bufferStockTons: 250,
      unitPricePerTonRs: 480,
      moisturePercent: 1.5,
      dailyProducedTons: 140,
      dailyDispatchedTons: 110
    }
  ]);

  // Dispatch Tickets
  const [dispatchTickets, setDispatchTickets] = useState<DispatchTicket[]>([
    {
      id: 'DSP-CRU-881',
      ticketNumber: 'WB-CRUSH-2026-0901',
      vehicleNumber: 'KL-11-BH-9821',
      customerName: 'Sobha City Infra Developers Ltd.',
      productName: 'M-Sand (Manufactured Sand)',
      grossWeightTons: 38.4,
      tareWeightTons: 12.2,
      netWeightTons: 26.2,
      ratePerTonRs: 650,
      totalAmountRs: 17030,
      gstAmountRs: 851.5,
      dispatchTime: '2026-09-21 08:45 AM',
      status: 'DISPATCHED'
    },
    {
      id: 'DSP-CRU-882',
      ticketNumber: 'WB-CRUSH-2026-0902',
      vehicleNumber: 'KL-58-Q-4410',
      customerName: 'Kozhikode Smart Road Corridor Project',
      productName: '20mm Graded Aggregate',
      grossWeightTons: 44.8,
      tareWeightTons: 14.1,
      netWeightTons: 30.7,
      ratePerTonRs: 520,
      totalAmountRs: 15964,
      gstAmountRs: 798.2,
      dispatchTime: '2026-09-21 09:15 AM',
      status: 'DISPATCHED'
    },
    {
      id: 'DSP-CRU-883',
      ticketNumber: 'WB-CRUSH-2026-0903',
      vehicleNumber: 'KL-13-Z-7722',
      customerName: 'Wayanad Precast Blocks Works',
      productName: 'P-Sand (Superfine Plastering)',
      grossWeightTons: 28.5,
      tareWeightTons: 10.3,
      netWeightTons: 18.2,
      ratePerTonRs: 820,
      totalAmountRs: 14924,
      gstAmountRs: 746.2,
      dispatchTime: '2026-09-21 10:05 AM',
      status: 'DISPATCHED'
    }
  ]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const totalStockTons = aggregates.reduce((sum, item) => sum, 0) + aggregates.reduce((acc, curr) => acc + curr.currentStockTons, 0);
  const totalDailyProduction = aggregates.reduce((acc, curr) => acc + curr.dailyProducedTons, 0);
  const totalDailyDispatch = aggregates.reduce((acc, curr) => acc + curr.dailyDispatchedTons, 0);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/20 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  PLATFORM 2 &bull; BUSINESS OPERATIONS
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
                  LIVE TELEMETRY
                </span>
              </div>
              <h1 className="text-2xl font-black text-white mt-0.5">Crusher Management System</h1>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Primary jaw crushing, secondary cone sorting, VSI vertical shaft impaction, washed M-Sand/P-Sand, 20mm/12mm/6mm aggregates, silo stocks & automated weighbridge billing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => showToast('Dispatched automated aggregate sieve quality inspection')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sieve Quality Check</span>
            </button>
            <button
              onClick={() => showToast('New weighbridge dispatch ticket created')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Dispatch Pass</span>
            </button>
          </div>
        </div>

        {/* Top KPI Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="text-slate-400 text-[11px]">Total Stock In Yard</div>
            <div className="text-lg font-black text-white font-mono mt-0.5">
              {totalStockTons.toLocaleString()} <span className="text-xs font-normal text-slate-400">Tons</span>
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Safe Buffer (+22%)</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="text-slate-400 text-[11px]">Daily Production</div>
            <div className="text-lg font-black text-cyan-400 font-mono mt-0.5">
              {totalDailyProduction.toLocaleString()} <span className="text-xs font-normal text-slate-400">Tons/Day</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Throughput: 393 TPH peak</div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="text-slate-400 text-[11px]">Daily Dispatch Net</div>
            <div className="text-lg font-black text-amber-400 font-mono mt-0.5">
              {totalDailyDispatch.toLocaleString()} <span className="text-xs font-normal text-slate-400">Tons/Day</span>
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">38 Tippers Cleared</div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="text-slate-400 text-[11px]">Power & Energy Index</div>
            <div className="text-lg font-black text-purple-400 font-mono mt-0.5">
              3.8 <span className="text-xs font-normal text-slate-400">kWh/Ton</span>
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">High Efficiency Zone</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 text-xs border-b border-slate-800">
        {[
          { id: 'plant-overview', label: 'Plant Master & Telemetry', icon: Gauge },
          { id: 'production-aggregates', label: 'Aggregate Production', icon: Layers },
          { id: 'stock-silos', label: 'Stockpiles & Silos', icon: Package },
          { id: 'dispatch-weighbridge', label: 'Dispatch & Weighbridge', icon: Scale },
          { id: 'plant-maintenance', label: 'Maintenance & Spares', icon: Wrench },
          { id: 'power-fuel-labour', label: 'Fuel, Power & Labour', icon: Zap },
          { id: 'financials-ledger', label: 'Expenses & Accounts', icon: DollarSign },
          { id: 'reports-analytics', label: 'Reports & Analytics', icon: BarChart3 }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition cursor-pointer border ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. PLANT OVERVIEW */}
      {activeTab === 'plant-overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {plants.map((plant) => (
              <div
                key={plant.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold">
                        {plant.code}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        {plant.operatingStatus}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1.5">{plant.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{plant.location}</p>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-xs text-slate-400">Current Load</div>
                    <div className="text-xl font-black text-cyan-400">
                      {plant.currentThroughputTPH} <span className="text-xs text-slate-500">/ {plant.capacityTPH} TPH</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-800 text-xs">
                  <div>
                    <div className="text-slate-500 text-[11px]">Primary Power</div>
                    <div className="font-semibold text-slate-200 mt-0.5">{plant.powerSource.replace(/_/g, ' ')}</div>
                    <div className="text-[10px] text-slate-400">{plant.powerMeterKWh.toLocaleString()} kWh</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[11px]">Genset Diesel Balance</div>
                    <div className="font-semibold text-slate-200 mt-0.5">{plant.fuelBalanceLitres.toLocaleString()} L</div>
                    <div className="text-[10px] text-emerald-400">Healthy Tank</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[11px]">Plant Manager</div>
                    <div className="font-semibold text-slate-200 mt-0.5">{plant.managerName}</div>
                    <div className="text-[10px] text-slate-400">On Duty</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Crushing Stages: Jaw Primary &bull; Cone Secondary &bull; VSI Rotor</span>
                  <button
                    onClick={() => showToast(`Telemetry synchronized for ${plant.code}`)}
                    className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Sensor Telemetry</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. AGGREGATE PRODUCTION & STOCKS */}
      {(activeTab === 'production-aggregates' || activeTab === 'stock-silos') && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search M-Sand, 20mm, 12mm, P-Sand..."
                className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => showToast('Sieve gradation curves exported to PDF')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition cursor-pointer"
              >
                Export Sieve Analysis
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Material / Code</th>
                    <th className="py-3 px-4">Grade</th>
                    <th className="py-3 px-4">Silo Stock</th>
                    <th className="py-3 px-4">Quality Metrics</th>
                    <th className="py-3 px-4">Daily Output</th>
                    <th className="py-3 px-4">Unit Price</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {aggregates.map((agg) => (
                    <tr key={agg.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{agg.name}</div>
                        <div className="text-[11px] text-cyan-400 font-mono">{agg.code}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                          {agg.grade}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold">
                        <div className="text-white text-sm">{agg.currentStockTons.toLocaleString()} T</div>
                        <div className="text-[10px] text-slate-500">Buffer: {agg.bufferStockTons} T</div>
                      </td>
                      <td className="py-3 px-4 text-[11px]">
                        {agg.finenessModulus && (
                          <div>FM: <span className="font-mono text-slate-200">{agg.finenessModulus}</span></div>
                        )}
                        {agg.siltContentPercent && (
                          <div>Silt: <span className="font-mono text-slate-200">{agg.siltContentPercent}%</span></div>
                        )}
                        <div>Moisture: <span className="font-mono text-slate-200">{agg.moisturePercent}%</span></div>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <div className="text-emerald-400 font-bold">+{agg.dailyProducedTons} T</div>
                        <div className="text-amber-400 text-[10px]">-{agg.dailyDispatchedTons} T out</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        ₹{agg.unitPricePerTonRs} <span className="text-[10px] text-slate-500 font-normal">/ Ton</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => showToast(`Adjusted stockpile calibration for ${agg.code}`)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold transition cursor-pointer"
                        >
                          Calibrate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. DISPATCH & WEIGHBRIDGE */}
      {activeTab === 'dispatch-weighbridge' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-cyan-400" />
                <span>Today's Crusher Weighbridge Dispatch Log</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Gross - Tare = Net Automatic Deduction</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Pass No.</th>
                    <th className="py-3 px-4">Vehicle</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Aggregate</th>
                    <th className="py-3 px-4">Net Weight</th>
                    <th className="py-3 px-4">Total Value</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {dispatchTickets.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3 px-4 font-mono text-cyan-400 font-bold">{t.ticketNumber}</td>
                      <td className="py-3 px-4 font-mono font-bold text-white">{t.vehicleNumber}</td>
                      <td className="py-3 px-4 text-slate-200">{t.customerName}</td>
                      <td className="py-3 px-4 text-slate-300">{t.productName}</td>
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        {t.netWeightTons} Tons
                        <span className="block text-[10px] text-slate-500 font-normal">
                          Gross: {t.grossWeightTons} | Tare: {t.tareWeightTons}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-amber-400">
                        ₹{t.totalAmountRs.toLocaleString()}
                        <span className="block text-[10px] text-slate-500 font-normal">GST: ₹{t.gstAmountRs}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. OTHER SUB-MODULES: Maintenance, Fuel/Power, Ledger, Reports */}
      {(activeTab === 'plant-maintenance' ||
        activeTab === 'power-fuel-labour' ||
        activeTab === 'financials-ledger' ||
        activeTab === 'reports-analytics') && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
          <Wrench className="w-10 h-10 text-cyan-400 mx-auto" />
          <h3 className="text-base font-bold text-white">
            {activeTab === 'plant-maintenance' && 'Jaw Plates, Cone Mantle & VSI Rotor Tip Maintenance'}
            {activeTab === 'power-fuel-labour' && 'Crusher Power Grid kWh Telemetry & Diesel Generator Logs'}
            {activeTab === 'financials-ledger' && 'Crusher Operational Expenses, Royalties & Profit Ledger'}
            {activeTab === 'reports-analytics' && 'Automated Production, Sieve Compliance & Dispatch BI Reports'}
          </h3>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Integrated with RZ® Shared ERP Core accounts, inventory valuation, GST e-way bills and workforce shift attendance.
          </p>
          <div className="pt-2">
            <button
              onClick={() => showToast('Action initiated successfully.')}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition cursor-pointer"
            >
              Generate Operational Summary
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
