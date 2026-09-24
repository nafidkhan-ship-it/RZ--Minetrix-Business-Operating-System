import React, { useState } from 'react';
import {
  Building2,
  Truck,
  Layers,
  FileText,
  Landmark,
  Users,
  DollarSign,
  TrendingUp,
  Search,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import {
  DEMO_TRACEABILITY_LOADS,
  LandTraceabilityLoad,
  DEMO_LAND_WORKING_AREAS
} from '../../../data/quarryLandData';
import { SectionId } from '../../../types/architecture';

interface LandConnectionsViewProps {
  onOpenOwnerProfile: (ownerId: string) => void;
  onNavigateSection?: (sectionId: SectionId) => void;
}

export const LandConnectionsView: React.FC<LandConnectionsViewProps> = ({
  onOpenOwnerProfile,
  onNavigateSection
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterQuarry, setFilterQuarry] = useState<string>('ALL');

  const filteredLoads = DEMO_TRACEABILITY_LOADS.filter((l) => {
    const matchesSearch =
      l.loadNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.workingAreaName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesQuarry =
      filterQuarry === 'ALL' || l.quarryName.toLowerCase().includes(filterQuarry.toLowerCase());

    return matchesSearch && matchesQuarry;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-purple-400 font-bold uppercase">
              Platform 7 &bull; Real-Time Traceability Chain
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              Deterministic Extraction Audit
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Quarry Connections & Traceability Engine</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Every cubic meter or truck load is deterministically linked from weighbridge to pit parcel to owner ledger.
          </p>
        </div>

        <button
          onClick={() => onNavigateSection && onNavigateSection('quarry-management')}
          className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-purple-500/20 cursor-pointer"
        >
          <Building2 className="w-4 h-4" />
          <span>Go to Platform 1 (Quarries)</span>
        </button>
      </div>

      {/* CHAIN INFOGRAPHIC DIAGRAM */}
      <div className="p-5 bg-slate-950 border border-slate-800 rounded-3xl space-y-3 shadow-inner">
        <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The RZ® Deterministic Traceability Flow</span>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex-1 min-w-[130px] text-center">
            <Truck className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
            <div className="font-bold text-white">1. Dispatched Load</div>
            <div className="text-[10px] text-slate-400 font-mono">Weighment Slip</div>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-600 shrink-0 hidden sm:block" />

          <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex-1 min-w-[130px] text-center">
            <Layers className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <div className="font-bold text-white">2. Working Bench</div>
            <div className="text-[10px] text-slate-400 font-mono">Pit Bench A/B</div>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-600 shrink-0 hidden sm:block" />

          <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex-1 min-w-[130px] text-center">
            <FileText className="w-5 h-5 text-purple-400 mx-auto mb-1" />
            <div className="font-bold text-white">3. Agreement</div>
            <div className="text-[10px] text-slate-400 font-mono">Commercial Terms</div>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-600 shrink-0 hidden sm:block" />

          <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex-1 min-w-[130px] text-center">
            <Landmark className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <div className="font-bold text-white">4. Land Parcel</div>
            <div className="text-[10px] text-slate-400 font-mono">Survey # & Extent</div>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-600 shrink-0 hidden sm:block" />

          <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex-1 min-w-[130px] text-center">
            <Users className="w-5 h-5 text-purple-400 mx-auto mb-1" />
            <div className="font-bold text-white">5. Land Owner</div>
            <div className="text-[10px] text-slate-400 font-mono">Person Dossier</div>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-600 shrink-0 hidden sm:block" />

          <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-2xl flex-1 min-w-[130px] text-center">
            <DollarSign className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <div className="font-bold text-white">6. Settlement</div>
            <div className="text-[10px] text-emerald-400 font-mono">RTGS Payout</div>
          </div>
        </div>
      </div>

      {/* Traceable Loads Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="text-base font-black text-white">
            Audit-Ready Dispatch Loads ({filteredLoads.length})
          </h3>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search load #, vehicle, bench..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-mono">
                <th className="py-2.5 px-3">Load No</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Quarry & Bench</th>
                <th className="py-2.5 px-3">Vehicle</th>
                <th className="py-2.5 px-3">Material</th>
                <th className="py-2.5 px-3">Parcel & Agreement</th>
                <th className="py-2.5 px-3">Land Owner</th>
                <th className="py-2.5 px-3 text-right">Payable (₹)</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {filteredLoads.map((load) => (
                <tr key={load.id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-3 font-bold text-purple-400">{load.loadNumber}</td>
                  <td className="py-3 px-3 text-slate-300">{load.date}</td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-white font-sans">{load.workingAreaName}</div>
                    <div className="text-[10px] text-slate-500 font-sans">{load.quarryName}</div>
                  </td>
                  <td className="py-3 px-3 text-cyan-400 font-bold">{load.vehicleNumber}</td>
                  <td className="py-3 px-3 text-slate-300 font-sans">
                    {load.material} ({load.quantity} {load.unit})
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-white font-sans">{load.parcelSurvey}</div>
                    <div className="text-[10px] text-purple-300">{load.agreementNumber}</div>
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => onOpenOwnerProfile(load.ownerId)}
                      className="text-white hover:text-purple-300 font-bold font-sans flex items-center gap-1 cursor-pointer"
                    >
                      <span>{load.ownerName}</span>
                      <ArrowUpRight className="w-3 h-3 text-purple-400" />
                    </button>
                    <span className="text-[10px] text-slate-500">{load.ownerId}</span>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-400">
                    ₹{load.payableToOwnerRs.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-sans">
                      {load.settlementStatus}
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
