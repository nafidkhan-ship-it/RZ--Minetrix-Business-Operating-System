import React, { useState } from 'react';
import {
  Layers,
  Search,
  Plus,
  Truck,
  MapPin,
  CheckCircle2,
  FileText,
  Clock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Scale
} from 'lucide-react';
import { VehicleLoad, Vehicle } from '../../data/vehicleStudioData';

interface VehicleLoadsViewProps {
  loads: VehicleLoad[];
  vehicles: Vehicle[];
  onOpenNewLoadModal: () => void;
  onOpenTraceModal?: (load: VehicleLoad) => void;
}

export const VehicleLoadsView: React.FC<VehicleLoadsViewProps> = ({
  loads,
  vehicles,
  onOpenNewLoadModal,
  onOpenTraceModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('ALL');

  const filteredLoads = loads.filter((l) => {
    const matchesSearch =
      l.loadNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.gatePassNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.sourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.material.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSource = sourceFilter === 'ALL' || l.sourceType === sourceFilter;
    return matchesSearch && matchesSource;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-teal-400 uppercase tracking-wider">
              MINE HAULAGE DISPATCH &bull; {loads.length} LOADS
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 font-bold border border-teal-500/20">
              Studio Preview / Demo Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Quarry & Crusher Load Dispatch Registry</h2>
          <p className="text-xs text-slate-400">
            Source-to-gate pass traceability & automated weighbridge gross, tare, and net tonnage recording
          </p>
        </div>

        <button
          onClick={onOpenNewLoadModal}
          className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-teal-500/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Load Entry</span>
        </button>
      </div>

      {/* Traceability Callout Banner (Item 11 & 31) */}
      <div className="bg-gradient-to-r from-teal-500/10 via-blue-500/10 to-indigo-500/10 border border-teal-500/20 rounded-2xl p-4 text-xs text-teal-300 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
          <div>
            <strong className="text-white">End-to-End Mining Traceability:</strong> Visual supply chain connects Quarry/Crusher pit origin &rarr; Working Face &rarr; Tipper &rarr; Weighbridge Gate Pass &rarr; NHAI Transit &rarr; Customer Site Sign-off.
          </div>
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
              placeholder="Search load #, vehicle, gate pass, source, material..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Source Types</option>
              <option value="Quarry">Quarry Pit</option>
              <option value="Crusher">Crusher Plant</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loads Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Load # & Gate Pass</th>
                <th className="py-3.5 px-3">Vehicle & Driver</th>
                <th className="py-3.5 px-3">Source Origin & Face</th>
                <th className="py-3.5 px-3">Material</th>
                <th className="py-3.5 px-3">Weighbridge (Tare / Gross / Net)</th>
                <th className="py-3.5 px-3">Destination</th>
                <th className="py-3.5 px-3">Delivery Status</th>
                <th className="py-3.5 px-4 text-right">Trace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLoads.map((load) => (
                <tr key={load.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-mono">
                    <div className="font-bold text-white">{load.loadNumber}</div>
                    <div className="text-[10px] text-teal-400">GP: {load.gatePassNumber}</div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="font-mono font-bold text-white">{load.vehicleNumber}</div>
                    <div className="text-[10px] text-slate-400">{load.driverName}</div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-200">
                      {load.sourceType}: {load.sourceName}
                    </div>
                    <div className="text-[10px] text-slate-400">Pit: {load.workingArea}</div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="text-white font-medium">{load.material}</div>
                  </td>

                  <td className="py-3.5 px-3 font-mono">
                    <div className="font-bold text-emerald-400 text-sm">{load.netWeightMT} MT Net</div>
                    <div className="text-[10px] text-slate-400">
                      Gross: {load.grossWeightMT} &bull; Tare: {load.tareWeightMT} MT
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="text-slate-200 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>{load.destination}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        load.deliveryStatus === 'Delivered'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}
                    >
                      {load.deliveryStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onOpenTraceModal && onOpenTraceModal(load)}
                      className="px-2.5 py-1 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 font-bold text-[10px] border border-teal-500/20 transition flex items-center gap-1 ml-auto cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>View Trace</span>
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
