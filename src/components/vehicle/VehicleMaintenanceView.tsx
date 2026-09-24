import React, { useState } from 'react';
import {
  Wrench,
  Search,
  Plus,
  Truck,
  DollarSign,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { MaintenanceRecord, Vehicle } from '../../data/vehicleStudioData';

interface VehicleMaintenanceViewProps {
  maintenances: MaintenanceRecord[];
  vehicles: Vehicle[];
  onOpenMaintenanceModal: () => void;
  onCreateOttTask?: (msg: string) => void;
}

export const VehicleMaintenanceView: React.FC<VehicleMaintenanceViewProps> = ({
  maintenances,
  vehicles,
  onOpenMaintenanceModal,
  onCreateOttTask
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filtered = maintenances.filter((m) => {
    const matchesSearch =
      m.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.serviceProvider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.technicianName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || m.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalCost = filtered.reduce((acc, m) => acc + m.cost, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-rose-400 uppercase tracking-wider">
              FLEET WORKSHOP WORK ORDERS &bull; {maintenances.length} SERVICE LOGS
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-bold border border-rose-500/20">
              Studio Preview / Demo Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Preventative Maintenance & Workshop Repairs</h2>
          <p className="text-xs text-slate-400">
            Engine overhauls, brake pad renewals, periodic greasing and preventative service schedules
          </p>
        </div>

        <button
          onClick={onOpenMaintenanceModal}
          className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-rose-500/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Service Entry</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl">
          <div className="text-xs text-slate-400">Total Maintenance Spend</div>
          <div className="text-2xl font-black text-rose-400 font-mono mt-1">
            ₹{totalCost.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Parts, Consumables & Specialized Labor</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl">
          <div className="text-xs text-slate-400">Active Work Orders</div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {filtered.filter((m) => m.status === 'Completed').length} / {filtered.length}
          </div>
          <div className="text-[11px] text-emerald-400 mt-0.5">All fleet services up-to-date</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl">
          <div className="text-xs text-slate-400">Next Major Inspection Due</div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">
            Oct 12, 2024
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Target: 48,000 KM Odometer</div>
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
              placeholder="Search service description, vehicle, workshop, technician..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-rose-500"
            >
              <option value="ALL">All Categories</option>
              <option value="Engine">Engine</option>
              <option value="Brakes">Brakes</option>
              <option value="Suspension">Suspension</option>
              <option value="Electrical">Electrical</option>
              <option value="Body">Body</option>
              <option value="Oil & Filters">Oil & Filters</option>
              <option value="Greasing">Greasing</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Maintenance Cards */}
      <div className="space-y-3">
        {filtered.map((m) => (
          <div
            key={m.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-3 text-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono font-bold flex items-center justify-center text-xs">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{m.category}: {m.description}</span>
                    <span className="font-mono text-cyan-400 font-bold">{m.vehicleNumber}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                      {m.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Workshop: <strong className="text-slate-200">{m.serviceProvider}</strong> &bull; Tech: {m.technicianName} &bull; Date: {m.date}
                  </div>
                </div>
              </div>

              <div className="sm:text-right font-mono">
                <div className="text-rose-400 font-bold text-base">₹{m.cost.toLocaleString()}</div>
                <div className="text-[10px] text-slate-500">Odometer: {m.odometerKm.toLocaleString()} KM</div>
              </div>
            </div>

            {/* Replaced Parts */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 text-[11px] text-slate-300">
              <span className="text-slate-500 block mb-0.5">Replaced Components & Consumables:</span>
              <div className="font-medium text-white">{m.partsReplaced.join(', ')}</div>
            </div>

            {/* Schedule Footers */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400 pt-1">
              <div>
                Next Scheduled Target: <strong className="text-amber-400 font-mono">{m.nextServiceDate}</strong> or <strong className="text-white font-mono">{m.nextServiceOdometerKm?.toLocaleString()} KM</strong>
              </div>

              {onCreateOttTask && (
                <button
                  onClick={() => onCreateOttTask(`Vehicle Workshop Follow-up: ${m.vehicleNumber} (${m.category})`)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] transition cursor-pointer"
                >
                  Create OTT Task
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
