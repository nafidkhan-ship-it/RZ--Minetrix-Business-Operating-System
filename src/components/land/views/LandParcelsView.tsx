import React, { useState } from 'react';
import {
  Landmark,
  Search,
  Plus,
  MapPin,
  Compass,
  FileText,
  Building2,
  Users,
  Eye,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { LandParcel, DEMO_LAND_PARCELS } from '../../../data/quarryLandData';
import { CadastralMapModal } from '../LandNewModals';

interface LandParcelsViewProps {
  onOpenNewParcel: () => void;
  onOpenOwnerProfile: (ownerId: string) => void;
  onOpenNewAgreement: (ownerId?: string) => void;
  onNavigateSubpage: (pageId: string) => void;
}

export const LandParcelsView: React.FC<LandParcelsViewProps> = ({
  onOpenNewParcel,
  onOpenOwnerProfile,
  onOpenNewAgreement,
  onNavigateSubpage
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedMapParcel, setSelectedMapParcel] = useState<LandParcel | null>(null);

  const filteredParcels = DEMO_LAND_PARCELS.filter((p) => {
    const matchesSearch =
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.surveyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.quarryName && p.quarryName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'ALL' || p.currentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase">
              Platform 7 &bull; Cadastral Database
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">
              {DEMO_LAND_PARCELS.length} Parcels Mapped
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Quarry Land Database</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cadastral survey boundaries, mineral yield potential, and multi-owner equity shares.
          </p>
        </div>

        <button
          onClick={onOpenNewParcel}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Land Parcel</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by survey #, village, quarry..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'Connected to Quarry', 'Available for Mining', 'Surveyed / Boundary Mapped', 'In Negotiation'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                statusFilter === st
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Parcels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredParcels.map((parcel) => (
          <div
            key={parcel.id}
            className="p-5 bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-3xl transition space-y-4 shadow-lg flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header row */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">{parcel.code}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                      {parcel.landType}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-white mt-1">
                    Survey {parcel.surveyNumber}
                  </h3>
                  <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{parcel.village}, {parcel.localBody}, {parcel.district}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {parcel.currentStatus}
                  </span>
                  <div className="text-base font-black text-white font-mono mt-1.5">
                    {parcel.extent} {parcel.unit}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    ({parcel.extentInAcres} Acres / {parcel.extentInCents} Cents)
                  </div>
                </div>
              </div>

              {/* Ownership % breakdown */}
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-1.5 text-xs">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Users className="w-3 h-3 text-cyan-400" />
                  <span>Title Holders & Share % Allocation</span>
                </div>
                <div className="space-y-1">
                  {parcel.owners.map((ow, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px]">
                      <button
                        onClick={() => onOpenOwnerProfile(ow.ownerId)}
                        className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>{ow.ownerName}</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                      <span className="font-mono text-white bg-slate-800 px-2 py-0.2 rounded-md font-bold">
                        {ow.sharePercent}% Share
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Minerals & Access road */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Mineral Yield:</span>
                  <span className="text-white font-semibold text-[11px]">{parcel.estimatedMineralYield}</span>
                </div>
                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Haul Access:</span>
                  <span className="text-white font-semibold text-[11px]">{parcel.accessRoad}</span>
                </div>
              </div>

              {/* Four Boundaries mini-pills */}
              <div className="p-2.5 bg-slate-950/40 rounded-xl border border-slate-800/60 text-[10px] text-slate-300 grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                <div><span className="text-slate-500 font-bold">N:</span> {parcel.boundaries.north}</div>
                <div><span className="text-slate-500 font-bold">S:</span> {parcel.boundaries.south}</div>
                <div><span className="text-slate-500 font-bold">E:</span> {parcel.boundaries.east}</div>
                <div><span className="text-slate-500 font-bold">W:</span> {parcel.boundaries.west}</div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedMapParcel(parcel)}
                  className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 transition flex items-center gap-1 cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5 text-purple-400" />
                  <span>Cadastral Boundary Map</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenNewAgreement(parcel.owners[0]?.ownerId)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>+ Agreement</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cadastral Map Modal */}
      {selectedMapParcel && (
        <CadastralMapModal
          isOpen={!!selectedMapParcel}
          onClose={() => setSelectedMapParcel(null)}
          parcelCode={selectedMapParcel.code}
          surveyNumber={`Survey ${selectedMapParcel.surveyNumber}`}
          extent={`${selectedMapParcel.extent} ${selectedMapParcel.unit} (${selectedMapParcel.extentAcres} Acres)`}
        />
      )}
    </div>
  );
};
