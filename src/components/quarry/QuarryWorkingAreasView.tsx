import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Search,
  MapPin,
  Users,
  FileText,
  Pickaxe,
  Calendar,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { WorkingArea, QuarryItem } from '../../data/quarryStudioData';

interface QuarryWorkingAreasViewProps {
  workingAreas: WorkingArea[];
  quarries: QuarryItem[];
  onOpenNewWorkingAreaModal?: () => void;
}

export const QuarryWorkingAreasView: React.FC<QuarryWorkingAreasViewProps> = ({
  workingAreas,
  quarries,
  onOpenNewWorkingAreaModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuarryId, setSelectedQuarryId] = useState('ALL');

  const filtered = workingAreas.filter((w) => {
    const matchSearch =
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.parcelSurveys.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.ownerNames.toLowerCase().includes(searchTerm.toLowerCase());
    const matchQuarry = selectedQuarryId === 'ALL' || w.quarryId === selectedQuarryId;
    return matchSearch && matchQuarry;
  });

  return (
    <div className="space-y-6">
      {/* Relational Hub Banner (Section 10) */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-300">
              RELATIONAL FULCRUM &bull; MULTI-PARCEL WORKING BENCHES
            </div>
            <p className="text-[11px] text-slate-400">
              A working area connects: Quarry &rarr; Land Parcel(s) &rarr; Land Owner(s) &rarr; Agreement(s) &rarr; Production &rarr; Loads.
              Supports multiple adjacent parcels and multiple landowners under a single operational bench face.
            </p>
          </div>
        </div>
      </div>

      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              MINING FACES
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ({filtered.length} active extraction benches)
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Operational Working Areas</h2>
          <p className="text-xs text-slate-400">
            Active extraction faces grouped by geological bench, parcel boundaries, and royalty contracts.
          </p>
        </div>

        <button
          onClick={() => alert('New Working Area Registration Modal (Simulated)')}
          className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 flex items-center gap-2 transition shadow-lg shadow-amber-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Working Area</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search bench name, survey numbers, landowner name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div>
          <select
            value={selectedQuarryId}
            onChange={(e) => setSelectedQuarryId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:border-amber-400 focus:outline-none"
          >
            <option value="ALL">All Quarry Concessions</option>
            {quarries.map((q) => (
              <option key={q.id} value={q.id}>
                {q.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Working Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((wa) => (
          <div
            key={wa.id}
            className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-4 text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {wa.code}
                </span>
                <h3 className="font-bold text-white text-sm">{wa.name}</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {wa.status}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <span className="text-slate-400">Quarry Concession:</span>
                <span className="text-white font-medium text-right">{wa.quarryName}</span>
              </div>

              <div className="flex items-start justify-between">
                <span className="text-slate-400">Survey Parcels (Multi):</span>
                <span className="text-amber-300 font-mono font-bold text-right">{wa.parcelSurveys}</span>
              </div>

              <div className="flex items-start justify-between">
                <span className="text-slate-400">Land Owners (Multi):</span>
                <span className="text-white font-medium text-right">{wa.ownerNames}</span>
              </div>

              <div className="flex items-start justify-between">
                <span className="text-slate-400">Royalty Agreement:</span>
                <span className="text-blue-300 font-mono text-right">{wa.agreementNumbers}</span>
              </div>

              <div className="flex items-start justify-between">
                <span className="text-slate-400">Geological Material:</span>
                <span className="text-amber-400 font-bold">{wa.material}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block">Bench Depth</span>
                <span className="font-mono font-bold text-white">{wa.depthMeters} Meters Datum</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block">Estimated Reserve</span>
                <span className="font-mono font-bold text-emerald-400">{wa.estimatedYield}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
