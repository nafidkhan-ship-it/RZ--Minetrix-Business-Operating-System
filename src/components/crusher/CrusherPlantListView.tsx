import React, { useState } from 'react';
import {
  Building2,
  Search,
  Filter,
  Plus,
  Activity,
  Layers,
  Zap,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  Eye,
  Sliders,
  Sparkles,
  MapPin,
  Calendar,
  Truck
} from 'lucide-react';
import { CrusherPlant, CrusherType } from '../../data/crusherStudioData';

interface CrusherPlantListViewProps {
  plants: CrusherPlant[];
  onSelectPlant: (plant: CrusherPlant) => void;
  onOpenNewPlant: () => void;
  onNavigatePage: (page: string) => void;
}

export const CrusherPlantListView: React.FC<CrusherPlantListViewProps> = ({
  plants,
  onSelectPlant,
  onOpenNewPlant,
  onNavigatePage
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('GRID');

  const filteredPlants = plants.filter(p => {
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.businessName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === 'ALL' || p.plantType === typeFilter;
    const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className="space-y-5">
      {/* Header with Search & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
              CRUSHER MASTER REGISTRY &bull; {plants.length} PLANTS
            </span>
            <h2 className="text-xl font-black text-white">Crusher Processing Complexes</h2>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onOpenNewPlant}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Register New Plant</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by plant name, location, code, or business..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9.5 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="ALL">All Plant Architectures</option>
              <option value="3-Stage Multi-Plant (Jaw + Cone + VSI)">3-Stage (Jaw + Cone + VSI)</option>
              <option value="Cone Crusher">Cone Crusher</option>
              <option value="Sand Washing Plant">Sand Washing Plant</option>
              <option value="Jaw Crusher">Jaw Crusher</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="ALL">All Operational Statuses</option>
              <option value="OPERATIONAL">Operational</option>
              <option value="STANDBY">Standby</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>

            <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-0.5">
              <button
                onClick={() => setViewMode('GRID')}
                className={`px-2.5 py-1 text-xs rounded-lg font-bold transition ${
                  viewMode === 'GRID' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('TABLE')}
                className={`px-2.5 py-1 text-xs rounded-lg font-bold transition ${
                  viewMode === 'TABLE' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                }`}
              >
                Table
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'GRID' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPlants.map(plant => (
            <div
              key={plant.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between hover:border-cyan-500/50 transition group space-y-4"
            >
              <div className="space-y-3">
                {/* Header info */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] font-bold text-cyan-400">{plant.code}</span>
                      <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                        {plant.name}
                      </h3>
                    </div>
                  </div>
                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      plant.status === 'OPERATIONAL'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}
                  >
                    {plant.status}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{plant.location}</span>
                </div>

                {/* Key Technical Specs */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Crusher Architecture</span>
                    <span className="font-bold text-slate-200 block truncate">{plant.plantType}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Design Capacity</span>
                    <span className="font-mono font-bold text-cyan-400 block">{plant.capacityTPH} TPH</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Today Output</span>
                    <span className="font-mono font-bold text-emerald-400 block">{plant.todayProductionTons} MT</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Silo Stock</span>
                    <span className="font-mono font-bold text-amber-400 block">{plant.finishedProductStockTons.toLocaleString()} MT</span>
                  </div>
                </div>

                {/* Products Badge List */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Manufactured Grades:</span>
                  <div className="flex flex-wrap gap-1">
                    {plant.mainProducts.slice(0, 4).map(prod => (
                      <span
                        key={prod}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-medium"
                      >
                        {prod}
                      </span>
                    ))}
                    {plant.mainProducts.length > 4 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        +{plant.mainProducts.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Permit Info */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                  <div className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>CTO Valid: {plant.permitExpiryDate}</span>
                  </div>
                  <span className="text-slate-500 font-mono">{plant.connectedPowerKW} KW</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => onSelectPlant(plant)}
                  className="flex-1 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer shadow-md"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Plant Profile</span>
                </button>
                <button
                  onClick={() => onNavigatePage('production')}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                  title="Log Crushing Production"
                >
                  <Activity className="w-4 h-4 text-cyan-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'TABLE' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950/70 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Code</th>
                <th className="p-3">Plant Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Capacity</th>
                <th className="p-3">Status</th>
                <th className="p-3">Today Output</th>
                <th className="p-3">Silo Stock</th>
                <th className="p-3">Permit CTO</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPlants.map(plant => (
                <tr key={plant.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono font-bold text-cyan-400">{plant.code}</td>
                  <td className="p-3">
                    <div className="font-bold text-white">{plant.name}</div>
                    <div className="text-[11px] text-slate-500">{plant.location}</div>
                  </td>
                  <td className="p-3 text-slate-300">{plant.plantType}</td>
                  <td className="p-3 font-mono font-bold text-white">{plant.capacityTPH} TPH</td>
                  <td className="p-3">
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        plant.status === 'OPERATIONAL'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {plant.status}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-cyan-400">{plant.todayProductionTons} MT</td>
                  <td className="p-3 font-mono text-amber-400">{plant.finishedProductStockTons.toLocaleString()} MT</td>
                  <td className="p-3 font-mono text-[11px] text-emerald-400">{plant.permitExpiryDate}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onSelectPlant(plant)}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Profile</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
