import React, { useState } from 'react';
import {
  Activity,
  Plus,
  Search,
  Zap,
  Fuel,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  Sliders,
  Sparkles
} from 'lucide-react';
import { CrusherProduction } from '../../data/crusherStudioData';

interface CrusherProductionViewProps {
  productions: CrusherProduction[];
  onOpenNewProduction: () => void;
  onNavigatePage: (page: string) => void;
}

export const CrusherProductionView: React.FC<CrusherProductionViewProps> = ({
  productions,
  onOpenNewProduction,
  onNavigatePage
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProd, setSelectedProd] = useState<CrusherProduction | null>(productions[0] || null);

  const filtered = productions.filter(p =>
    p.productionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.plantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.shift.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalInput = productions.reduce((acc, p) => acc + p.inputQuantityTons, 0);
  const totalOutput = productions.reduce((acc, p) => acc + p.totalOutputTons, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                BATCH-WISE CRUSHING & SIZING ENGINE
              </span>
              <h2 className="text-xl font-black text-white">Crusher Production Batches</h2>
            </div>
          </div>
          <button
            onClick={onOpenNewProduction}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Log Production Batch</span>
          </button>
        </div>

        {/* Telemetry Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Total Boulder Ingested</span>
            <span className="text-xl font-black text-white font-mono mt-0.5">{totalInput.toLocaleString()} MT</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Finished Products Output</span>
            <span className="text-xl font-black text-cyan-400 font-mono mt-0.5">{totalOutput.toLocaleString()} MT</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Average Crushing Rate</span>
            <span className="text-xl font-black text-emerald-400 font-mono mt-0.5">188 TPH</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Average Yield Recovery</span>
            <span className="text-xl font-black text-amber-400 font-mono mt-0.5">97.8%</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative pt-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by batch number, plant name, or shift..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9.5 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Production Batches List & Multi-Product Output Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Batches Column */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.map(batch => {
            const isSelected = selectedProd?.id === batch.id;
            return (
              <div
                key={batch.id}
                onClick={() => setSelectedProd(batch)}
                className={`p-5 rounded-3xl border transition cursor-pointer space-y-4 ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500 shadow-xl'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-sm text-cyan-400">{batch.productionNumber}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono font-semibold">
                      {batch.shift}
                    </span>
                    <span className="text-xs text-slate-400">&bull; {batch.date}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    Input: {batch.inputQuantityTons} MT &rarr; Total Output: {batch.totalOutputTons} MT
                  </span>
                </div>

                {/* Multi-Output Products Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {batch.outputs.map(out => (
                    <div key={out.productCode} className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block truncate">{out.productName}</span>
                      <span className="font-mono font-bold text-white text-sm block mt-0.5">
                        {out.quantityTons} MT
                      </span>
                      <div className="flex items-center justify-between text-[10px] text-cyan-400 font-mono mt-1">
                        <span>{out.percentageOfOutput}%</span>
                        <span className="text-slate-500">{out.siloAllocation}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Machine hours & utilities */}
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Runtime: {batch.machineRunHours} hrs ({batch.crushingEfficiencyTPH} TPH)</span>
                    </span>
                    <span className="flex items-center gap-1 text-yellow-400">
                      <Zap className="w-3.5 h-3.5" />
                      <span>{batch.powerConsumedKWh} kWh</span>
                    </span>
                    <span className="flex items-center gap-1 text-cyan-400">
                      <Fuel className="w-3.5 h-3.5" />
                      <span>{batch.dieselConsumedLiters} L</span>
                    </span>
                  </div>
                  <span className="text-slate-500 font-mono text-[10px]">Supervisor: {batch.supervisor}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Batch Analytical Inspector */}
        {selectedProd && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">BATCH TELEMETRY</span>
                <h3 className="text-sm font-bold text-white">{selectedProd.productionNumber}</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
                COMPLETED
              </span>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Processing Plant:</span>
                <span className="font-bold text-white">{selectedProd.plantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Boulder Material:</span>
                <span className="text-slate-200">{selectedProd.inputMaterial}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Feed Boulder Tonnage:</span>
                <span className="font-mono font-bold text-white">{selectedProd.inputQuantityTons} MT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Finished Sized Tonnage:</span>
                <span className="font-mono font-bold text-cyan-400">{selectedProd.totalOutputTons} MT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Processing Loss / Clay Slurry:</span>
                <span className="font-mono text-amber-400">{selectedProd.wastageTons} MT (2.3%)</span>
              </div>
            </div>

            {/* Sizing Deck Distribution */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-300 uppercase font-mono block">
                Screen Sizing Distribution:
              </span>
              {selectedProd.outputs.map(o => (
                <div key={o.productCode} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">{o.productName}</span>
                    <span className="font-mono font-bold text-white">{o.quantityTons} MT ({o.percentageOfOutput}%)</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                    <div
                      className="bg-cyan-500 h-full rounded-full"
                      style={{ width: `${o.percentageOfOutput * 2}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Utility Efficiency Indices */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Power Consumption Index:</span>
                <span className="font-mono font-bold text-yellow-400">
                  {(selectedProd.powerConsumedKWh / selectedProd.totalOutputTons).toFixed(2)} kWh/MT
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Diesel Consumption Index:</span>
                <span className="font-mono font-bold text-cyan-400">
                  {(selectedProd.dieselConsumedLiters / selectedProd.totalOutputTons).toFixed(2)} L/MT
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigatePage('stock')}
              className="w-full py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition cursor-pointer"
            >
              Verify Silo Stock Allocations &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
