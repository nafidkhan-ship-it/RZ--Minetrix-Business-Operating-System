import React, { useState } from 'react';
import {
  Truck,
  Building2,
  ArrowRight,
  Layers,
  Activity,
  CheckCircle2,
  Scale,
  ShoppingBag,
  Sparkles,
  MapPin,
  ExternalLink,
  Plus
} from 'lucide-react';
import { CrusherPlant, MaterialReceipt } from '../../data/crusherStudioData';

interface QuarryCrusherFlowViewProps {
  plants: CrusherPlant[];
  receipts: MaterialReceipt[];
  onOpenNewReceipt: () => void;
  onNavigatePage: (page: string) => void;
}

export const QuarryCrusherFlowView: React.FC<QuarryCrusherFlowViewProps> = ({
  plants,
  receipts,
  onOpenNewReceipt,
  onNavigatePage
}) => {
  const [selectedQuarry, setSelectedQuarry] = useState('Kasaragod North Laterite Pit #01');
  const [selectedBench, setSelectedBench] = useState('Bench A - North Face');
  const [selectedPlant, setSelectedPlant] = useState(plants[0]?.id || 'CP-01');

  const QUARRIES = [
    {
      id: 'Q-01',
      name: 'Kasaragod North Laterite Pit #01',
      location: 'Badiadka Sector 4',
      benches: ['Bench A - North Face', 'Bench B - Deep Face', 'Bench C - West Ridge'],
      activeTippers: 6,
      stockpileBoulders: '18,500 MT Ready',
      material: 'Hard Rock Granite Boulders'
    },
    {
      id: 'Q-02',
      name: 'Manjeshwar Granite Quarry Pit #02',
      location: 'Hosabettu Mining Concession',
      benches: ['Bench 1 - Primary Ledge', 'Bench 2 - South Face'],
      activeTippers: 4,
      stockpileBoulders: '12,200 MT Ready',
      material: 'Blue Trap Rock'
    },
    {
      id: 'Q-EXT',
      name: 'Malabar Mining & Stone Supplies (External)',
      location: 'Panathur Quarry Cluster',
      benches: ['Commercial Outcrop'],
      activeTippers: 2,
      stockpileBoulders: 'Spot Purchase',
      material: 'Run-of-Mine Granite'
    }
  ];

  const currentQuarryObj = QUARRIES.find(q => q.name === selectedQuarry) || QUARRIES[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                END-TO-END TRACEABILITY PIPELINE
              </span>
              <h2 className="text-xl font-black text-white">Quarry-to-Crusher Operational Pipeline</h2>
            </div>
          </div>
          <button
            onClick={onOpenNewReceipt}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Dispatch Inward Load</span>
          </button>
        </div>

        {/* Visual Pipeline Banner */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase font-mono block">
            End-to-End Industry Material & Value Stream:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-amber-400 font-mono font-bold block">1. QUARRY PIT</span>
              <span className="text-xs font-bold text-white block mt-0.5">Bench Blast</span>
            </div>
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-mono font-bold block">2. BOULDER HAUL</span>
              <span className="text-xs font-bold text-white block mt-0.5">Tipper Transit</span>
            </div>
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-blue-400 font-mono font-bold block">3. WEIGHBRIDGE</span>
              <span className="text-xs font-bold text-white block mt-0.5">Gross & Tare Slip</span>
            </div>
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-cyan-400 font-mono font-bold block">4. 3-STAGE CRUSHER</span>
              <span className="text-xs font-bold text-white block mt-0.5">Jaw + Cone + VSI</span>
            </div>
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-emerald-400 font-mono font-bold block">5. SILO STOCK</span>
              <span className="text-xs font-bold text-white block mt-0.5">M-Sand & 20mm</span>
            </div>
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-purple-400 font-mono font-bold block">6. COMMERCIAL SALE</span>
              <span className="text-xs font-bold text-white block mt-0.5">Gate Pass & Invoice</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Traceability Configurator (Section 10) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Source Quarry Selector */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-400" />
              <span>Step 1: Select Source Quarry</span>
            </span>
            <span className="text-[10px] font-mono text-cyan-400">{QUARRIES.length} Pits</span>
          </div>

          <div className="space-y-2">
            {QUARRIES.map(q => {
              const isSelected = selectedQuarry === q.name;
              return (
                <div
                  key={q.id}
                  onClick={() => {
                    setSelectedQuarry(q.name);
                    setSelectedBench(q.benches[0]);
                  }}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer text-xs space-y-1 ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-500/50 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{q.name}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <div className="text-[11px] text-slate-500">{q.location} &bull; {q.material}</div>
                  <div className="flex items-center justify-between text-[10px] font-mono pt-1 text-slate-400">
                    <span>{q.activeTippers} Active Tippers</span>
                    <span className="text-amber-400 font-bold">{q.stockpileBoulders}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Working Area / Bench Selection */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-300 block">Step 2: Working Area / Quarry Bench:</span>
            <div className="flex flex-wrap gap-1.5">
              {currentQuarryObj.benches.map(b => (
                <button
                  key={b}
                  onClick={() => setSelectedBench(b)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                    selectedBench === b
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Active Feeder Loads Pipeline */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                REAL-TIME VEHICLE HAULAGE TO CRUSHER CP-01
              </span>
              <h3 className="text-base font-bold text-white">Active Transit Loads ({selectedBench})</h3>
            </div>
            <button
              onClick={() => onNavigatePage('material-receipt')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Weighbridge Register &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'LOAD-TR-01',
                tipper: 'KL-14-AC-9901',
                driver: 'Moideen Kunhi',
                material: 'Hard Rock Granite Boulders',
                net: '24.3 MT',
                status: 'Weighed & Entering Feeder Hopper',
                time: '08:45 AM'
              },
              {
                id: 'LOAD-TR-02',
                tipper: 'KL-14-Y-8812',
                driver: 'Raveendran P.',
                material: 'Laterite Ballast',
                net: '22.4 MT',
                status: 'In Transit on Badiadka Highway (3 km away)',
                time: '09:15 AM'
              },
              {
                id: 'LOAD-TR-03',
                tipper: 'KA-19-B-4412',
                driver: 'Shankar Gowda',
                material: 'Hard Rock Granite Boulders',
                net: '27.0 MT',
                status: 'Loading at Quarry Bench A Excavator',
                time: '09:30 AM'
              }
            ].map(item => (
              <div
                key={item.id}
                className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-sm">{item.tipper}</span>
                      <span className="text-[10px] text-slate-500 font-mono">Driver: {item.driver}</span>
                    </div>
                    <span className="text-cyan-400 font-semibold block">{item.material} &bull; {item.net}</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">{item.status}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <span className="text-[10px] font-mono text-slate-500">{item.time}</span>
                  <button
                    onClick={onOpenNewReceipt}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 font-bold transition cursor-pointer"
                  >
                    Receive Load
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-cyan-300 text-xs flex items-center justify-between">
            <span>
              <strong>Quarry Concession Link:</strong> Verified RZ Minetrix internal transfer with royalty zero-deduction pass.
            </span>
            <button
              onClick={() => onNavigatePage('production')}
              className="px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition"
            >
              Start Crushing Batch &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
