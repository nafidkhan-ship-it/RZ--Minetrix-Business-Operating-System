import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Eye,
  FileText,
  ExternalLink,
  MapPin,
  Layers,
  Pickaxe,
  Building2,
  Users,
  MoreVertical,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Download
} from 'lucide-react';
import { QuarryItem, QuarryMaterialType, QuarryStatus } from '../../data/quarryStudioData';

interface QuarryListViewProps {
  quarries: QuarryItem[];
  onSelectQuarry: (quarry: QuarryItem) => void;
  onOpenNewQuarryModal: () => void;
}

export const QuarryListView: React.FC<QuarryListViewProps> = ({
  quarries,
  onSelectQuarry,
  onOpenNewQuarryModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('ALL');

  const filteredQuarries = quarries.filter((q) => {
    const matchSearch =
      q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = selectedStatus === 'ALL' || q.status === selectedStatus;
    const matchDistrict = selectedDistrict === 'ALL' || q.district === selectedDistrict;
    const matchMaterial = selectedMaterial === 'ALL' || q.material === selectedMaterial;
    return matchSearch && matchStatus && matchDistrict && matchMaterial;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              MASTER REGISTER
            </span>
            <span className="text-xs text-slate-500 font-mono">({filteredQuarries.length} concessions active)</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Quarry Concessions Directory</h2>
          <p className="text-xs text-slate-400">
            Authorized extraction pits, leases, environmental clearances, and operational benches.
          </p>
        </div>

        <button
          onClick={onOpenNewQuarryModal}
          className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 flex items-center gap-2 transition shadow-lg shadow-amber-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Quarry Concession</span>
        </button>
      </div>

      {/* Filter & Search Toolbar (Section 3) */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search quarry name, code, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:border-amber-400 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">ACTIVE (Operational)</option>
            <option value="UNDER_DEVELOPMENT">UNDER_DEVELOPMENT</option>
            <option value="MAINTENANCE">MAINTENANCE</option>
          </select>
        </div>

        {/* District Filter */}
        <div>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:border-amber-400 focus:outline-none"
          >
            <option value="ALL">All Districts</option>
            <option value="Kasaragod">Kasaragod (Kerala)</option>
            <option value="Dakshina Kannada">Dakshina Kannada (Karnataka)</option>
          </select>
        </div>

        {/* Material Filter */}
        <div>
          <select
            value={selectedMaterial}
            onChange={(e) => setSelectedMaterial(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:border-amber-400 focus:outline-none"
          >
            <option value="ALL">All Materials</option>
            <option value="Laterite">Laterite Stone</option>
            <option value="Hard Rock">Hard Rock</option>
            <option value="Granite">Granite</option>
            <option value="Aggregate">Aggregate</option>
          </select>
        </div>
      </div>

      {/* Quarry List Table (Section 3) */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Quarry ID</th>
                <th className="py-3.5 px-4">Quarry Name & Concession</th>
                <th className="py-3.5 px-4">Location / District</th>
                <th className="py-3.5 px-4">Material</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Land Area</th>
                <th className="py-3.5 px-4">Working Areas</th>
                <th className="py-3.5 px-4">Partners</th>
                <th className="py-3.5 px-4">Today Production</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredQuarries.map((quarry) => (
                <tr
                  key={quarry.id}
                  className="hover:bg-slate-800/40 transition cursor-pointer group"
                  onClick={() => onSelectQuarry(quarry)}
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-400">{quarry.code}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white group-hover:text-amber-300 transition text-sm">
                      {quarry.name}
                    </div>
                    <div className="text-[11px] text-slate-500">{quarry.businessName}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-white">{quarry.location}</div>
                    <div className="text-[11px] text-slate-400">
                      {quarry.district}, {quarry.state}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {quarry.material}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        quarry.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                      }`}
                    >
                      {quarry.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <span className="font-bold text-white">{quarry.totalLandAreaAcres}</span>
                    <span className="text-slate-500 text-[11px] ml-1">Acres</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-lg bg-slate-800 font-mono text-slate-300 font-bold">
                      {quarry.workingAreasCount} Benches
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">{quarry.partnersCount} Partners</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">{quarry.todayProduction}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectQuarry(quarry)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition"
                        title="View Full Profile Dossier"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
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
