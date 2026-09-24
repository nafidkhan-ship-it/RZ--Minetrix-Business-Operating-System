import React, { useState } from 'react';
import {
  Layers,
  Search,
  Plus,
  Building2,
  Users,
  Compass,
  FileText,
  TrendingUp,
  Truck,
  ArrowUpRight
} from 'lucide-react';
import { LandWorkingArea, DEMO_LAND_WORKING_AREAS } from '../../../data/quarryLandData';
import { SectionId } from '../../../types/architecture';

interface LandWorkingAreasViewProps {
  onOpenOwnerProfile: (ownerId: string) => void;
  onNavigateSection?: (sectionId: SectionId) => void;
  onOpenNewAgreement: (ownerId?: string) => void;
}

export const LandWorkingAreasView: React.FC<LandWorkingAreasViewProps> = ({
  onOpenOwnerProfile,
  onNavigateSection,
  onOpenNewAgreement
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAreas = DEMO_LAND_WORKING_AREAS.filter((wa) => {
    return (
      wa.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wa.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wa.quarryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wa.ownerNames.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase">
              Platform 7 &bull; Pit Demarcation & Benches
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              {DEMO_LAND_WORKING_AREAS.length} Working Areas
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Quarry Working Areas / Benches</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Different agreements operating inside the same quarry pit bench with full load segregation.
          </p>
        </div>

        <button
          onClick={() => alert('New Working Area creation: Select Quarry Pit and link Land Parcels & active Agreements.')}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Working Area</span>
        </button>
      </div>

      {/* Working Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAreas.map((area) => (
          <div
            key={area.id}
            className="p-5 bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-3xl transition space-y-4 shadow-lg flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-400">{area.code}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                      {area.productionStatus}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-white mt-1">{area.name}</h3>
                  <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>{area.quarryName}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-white font-mono">
                    {area.areaExtentCents} Cents
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    ({area.areaExtentAcres} Acres)
                  </div>
                  <div className="text-[10px] text-cyan-400 font-mono mt-0.5">
                    Bench Depth: {area.benchDepthMeters}m
                  </div>
                </div>
              </div>

              {/* Linked Agreements & Owners */}
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Operating Agreements:</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {area.agreementIds.map((agId, i) => (
                      <span key={i} className="font-mono text-[11px] bg-slate-800 px-2 py-0.5 rounded-lg text-purple-300 font-bold">
                        {agId} ({area.agreementTypes[i] || 'Agreement'})
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] block">Beneficiary Land Owners:</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {area.ownerIds.map((owId, i) => (
                      <button
                        key={i}
                        onClick={() => onOpenOwnerProfile(owId)}
                        className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer bg-slate-900 px-2 py-0.5 rounded-lg"
                      >
                        <span>{area.ownerNames.split(',')[i]?.trim() || owId}</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Production & Dispatch Metrics */}
              <div className="p-3 bg-slate-950/60 rounded-2xl grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Extracted Material:</span>
                  <span className="text-white font-mono font-bold">{area.totalExtractedQty}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Total Traceable Dispatches:</span>
                  <span className="text-emerald-400 font-mono font-bold">{area.loadCount} Dispatched Loads</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
              <button
                onClick={() => onNavigateSection && onNavigateSection('quarry-management')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Open in Platform 1 (Quarry)</span>
              </button>

              <button
                onClick={() => onOpenNewAgreement(area.ownerIds[0])}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Link Agreement</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
