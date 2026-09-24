import React, { useState } from 'react';
import {
  Disc,
  Search,
  Plus,
  Truck,
  RotateCw,
  TrendingDown,
  CheckCircle2,
  DollarSign,
  Calendar
} from 'lucide-react';
import { TyreRecord, Vehicle } from '../../data/vehicleStudioData';

interface VehicleTyresViewProps {
  tyres: TyreRecord[];
  vehicles: Vehicle[];
  onOpenAddTyreModal: () => void;
  onRotateTyreModal?: () => void;
}

export const VehicleTyresView: React.FC<VehicleTyresViewProps> = ({
  tyres,
  vehicles,
  onOpenAddTyreModal,
  onRotateTyreModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = tyres.filter((t) => {
    const matchesSearch =
      t.tyreNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.position.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-purple-400 uppercase tracking-wider">
              COMMERCIAL TYRE ASSET VAULT &bull; {tyres.length} MONITORED TYRES
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-bold border border-purple-500/20">
              Studio Preview / Demo Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Commercial Tyre Inventory & Axle Positions</h2>
          <p className="text-xs text-slate-400">
            Serial tracking, tread depth wear measurements, rotation schedules and retreading lifecycles
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onRotateTyreModal && (
            <button
              onClick={onRotateTyreModal}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer shrink-0"
            >
              <RotateCw className="w-3.5 h-3.5 text-purple-400" />
              <span>Log Rotation</span>
            </button>
          )}

          <button
            onClick={onOpenAddTyreModal}
            className="px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/20 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Tyre</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-inner">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search serial number, vehicle number, brand, position..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-purple-500"
            >
              <option value="ALL">All Tyre Statuses</option>
              <option value="Active">Active on Axle</option>
              <option value="Rotated">Rotated</option>
              <option value="Retreaded">Retreaded</option>
              <option value="Scrapped">Scrapped</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tyres Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((tyre) => (
          <div
            key={tyre.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4 text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="font-mono font-bold text-white text-sm">{tyre.tyreNumber}</span>
                <div className="text-[10px] text-slate-400">
                  {tyre.brand} &bull; {tyre.size}
                </div>
              </div>

              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                {tyre.position}
              </span>
            </div>

            {/* Vehicle & Run Info */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Vehicle:</span>
                <span className="font-mono font-bold text-cyan-400">{tyre.vehicleNumber}</span>
              </div>
              <div className="flex justify-between text-slate-300 font-mono">
                <span>Distance Run:</span>
                <span className="text-white font-bold">{tyre.kmRun.toLocaleString()} KM</span>
              </div>
              <div className="flex justify-between text-slate-300 font-mono">
                <span>Cost / km:</span>
                <span className="text-emerald-400 font-bold">₹{tyre.costPerKm}/km</span>
              </div>
            </div>

            {/* Tread Depth Wear Meter */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Tread Depth Remaining:</span>
                <span className="font-mono font-bold text-purple-300">
                  {tyre.currentTreadDepthMm}mm / {tyre.initialTreadDepthMm}mm
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className="bg-purple-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(tyre.currentTreadDepthMm / tyre.initialTreadDepthMm) * 100}%` }}
                />
              </div>
            </div>

            {/* Rotation History */}
            <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
              <span className="text-slate-500 block text-[10px] uppercase font-mono">Rotation Record</span>
              <div className="text-slate-300 mt-0.5">{tyre.rotationHistory}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
