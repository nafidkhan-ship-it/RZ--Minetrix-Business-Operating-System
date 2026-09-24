import React, { useState } from 'react';
import {
  MapPin,
  Plus,
  Search,
  Layers,
  FileText,
  Users,
  Eye,
  CheckCircle2,
  Compass,
  ArrowRight
} from 'lucide-react';
import { LandParcel, QuarryItem } from '../../data/quarryStudioData';

interface QuarryParcelsViewProps {
  parcels: LandParcel[];
  quarries: QuarryItem[];
  onOpenAddParcelModal: () => void;
  onNavigateToOwners: () => void;
  onNavigateToAgreements: () => void;
}

export const QuarryParcelsView: React.FC<QuarryParcelsViewProps> = ({
  parcels,
  quarries,
  onOpenAddParcelModal,
  onNavigateToOwners,
  onNavigateToAgreements
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuarryId, setSelectedQuarryId] = useState<string>('ALL');

  const filtered = parcels.filter((p) => {
    const matchSearch =
      p.surveyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchQuarry = selectedQuarryId === 'ALL' || p.quarryId === selectedQuarryId;
    return matchSearch && matchQuarry;
  });

  return (
    <div className="space-y-6">
      {/* Hierarchy Banner (Section 6) */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4 overflow-x-auto">
        <div className="flex items-center gap-2 text-xs font-mono font-bold whitespace-nowrap">
          <span className="text-slate-400">RELATIONAL ARCHITECTURE:</span>
          <span className="text-amber-400">Quarry</span> &rarr;
          <span className="text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            Land Parcels
          </span>{' '}
          &rarr;
          <span className="text-white hover:text-amber-400 cursor-pointer" onClick={onNavigateToOwners}>
            Land Owners
          </span>{' '}
          &rarr;
          <span className="text-white hover:text-amber-400 cursor-pointer" onClick={onNavigateToAgreements}>
            Agreements
          </span>{' '}
          &rarr;
          <span className="text-emerald-400">Working Areas</span>
        </div>
      </div>

      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              LAND REGISTRATION
            </span>
            <span className="text-xs text-slate-500 font-mono">({filtered.length} parcels recorded)</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Land Parcels & Cadastral Surveys</h2>
          <p className="text-xs text-slate-400">
            Boundary-demarcated plots, legal survey numbers, sub-divisions, and landowner titles.
          </p>
        </div>

        <button
          onClick={onOpenAddParcelModal}
          className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 flex items-center gap-2 transition shadow-lg shadow-amber-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Land Parcel</span>
        </button>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search survey number, landowner name, or bench..."
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

      {/* Parcels Table (Section 6) */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Parcel ID</th>
                <th className="py-3.5 px-4">Survey Number</th>
                <th className="py-3.5 px-4">Subdivision</th>
                <th className="py-3.5 px-4">Registered Owner</th>
                <th className="py-3.5 px-4">Extent</th>
                <th className="py-3.5 px-4">Boundaries (N / S / E / W)</th>
                <th className="py-3.5 px-4">Location / Bench</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((parcel) => (
                <tr key={parcel.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-400">{parcel.id}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white text-sm">
                    {parcel.surveyNumber}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{parcel.subdivision}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white">{parcel.ownerName}</span>
                    <span className="block text-[10px] text-slate-500 font-mono">{parcel.ownerId}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <span className="font-bold text-white">{parcel.extent}</span>
                    <span className="text-slate-500 text-[11px] ml-1">{parcel.unit}</span>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs text-[11px] text-slate-400">
                    <div>N: {parcel.boundaries.north}</div>
                    <div>S: {parcel.boundaries.south}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{parcel.location}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {parcel.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => alert(`Showing Survey Map & Title Deed for ${parcel.surveyNumber}`)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition"
                      title="View Survey Boundary Dossier"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
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
