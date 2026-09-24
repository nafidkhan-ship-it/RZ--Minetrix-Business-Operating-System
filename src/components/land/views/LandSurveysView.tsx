import React, { useState } from 'react';
import {
  Compass,
  Search,
  Plus,
  MapPin,
  FileText,
  ShieldCheck,
  Eye,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';
import { DEMO_LAND_PARCELS, LandParcel } from '../../../data/quarryLandData';
import { CadastralMapModal } from '../LandNewModals';

export const LandSurveysView: React.FC = () => {
  const [selectedParcel, setSelectedParcel] = useState<LandParcel | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = DEMO_LAND_PARCELS.filter(
    (p) =>
      p.surveyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-purple-400 font-bold uppercase">
              Platform 7 &bull; Cadastral Demarcation
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              DGPS Surveyed Cairns
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Land Survey & Boundary Registry</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cadastral Field Measurement Books (FMB), Boundary Cairns, Haul Road Corridors, and Legal Buffers.
          </p>
        </div>

        <button
          onClick={() => alert('New Cadastral Survey Entry: Upload DGPS Coordinates & Licensed Surveyor Report.')}
          className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-purple-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Record Survey Measurement</span>
        </button>
      </div>

      {/* Parcels Boundary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((parcel) => (
          <div
            key={parcel.id}
            className="p-5 bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-3xl transition space-y-4 shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-purple-400">{parcel.code}</span>
                <h3 className="text-base font-black text-white mt-0.5">
                  Survey {parcel.surveyNumber} ({parcel.extent} {parcel.unit})
                </h3>
                <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{parcel.village}, {parcel.localBody}, {parcel.district}</span>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {parcel.currentStatus}
              </span>
            </div>

            {/* Demarcation Card */}
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs">
              <div className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                <Compass className="w-3 h-3" />
                <span>Four Boundary Demarcations (FMB Benchmark)</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div className="bg-slate-900/80 p-2 rounded-xl">
                  <span className="text-slate-500 block text-[10px] font-bold">NORTH BOUNDARY</span>
                  <span className="text-white text-[11px]">{parcel.boundaries.north}</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-xl">
                  <span className="text-slate-500 block text-[10px] font-bold">SOUTH BOUNDARY</span>
                  <span className="text-white text-[11px]">{parcel.boundaries.south}</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-xl">
                  <span className="text-slate-500 block text-[10px] font-bold">EAST BOUNDARY</span>
                  <span className="text-white text-[11px]">{parcel.boundaries.east}</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-xl">
                  <span className="text-slate-500 block text-[10px] font-bold">WEST BOUNDARY</span>
                  <span className="text-white text-[11px]">{parcel.boundaries.west}</span>
                </div>
              </div>
            </div>

            {/* Access Road & FMB Action */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
              <span className="text-[11px] text-slate-400">{parcel.accessRoad}</span>
              <button
                onClick={() => setSelectedParcel(parcel)}
                className="px-3.5 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>View Cadastral Map</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedParcel && (
        <CadastralMapModal
          isOpen={!!selectedParcel}
          onClose={() => setSelectedParcel(null)}
          parcelCode={selectedParcel.code}
          surveyNumber={`Survey ${selectedParcel.surveyNumber}`}
          extent={`${selectedParcel.extent} ${selectedParcel.unit} (${selectedParcel.extentAcres} Acres)`}
        />
      )}
    </div>
  );
};
