import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Truck,
  Phone,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Award,
  DollarSign,
  Clock
} from 'lucide-react';
import { Driver, Vehicle } from '../../data/vehicleStudioData';

interface VehicleDriversViewProps {
  drivers: Driver[];
  vehicles: Vehicle[];
  onOpenAddDriverModal: () => void;
  onAssignVehicle?: (driverId: string, vehicleNumber: string) => void;
  onCreateOttTask?: (msg: string) => void;
}

export const VehicleDriversView: React.FC<VehicleDriversViewProps> = ({
  drivers,
  vehicles,
  onOpenAddDriverModal,
  onAssignVehicle,
  onCreateOttTask
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dutyFilter, setDutyFilter] = useState('ALL');

  const filteredDrivers = drivers.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.driverId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.assignedVehicleNumber && d.assignedVehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDuty = dutyFilter === 'ALL' || d.dutyStatus === dutyFilter;
    return matchesSearch && matchesDuty;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              HEAVY COMMERCIAL CREW &bull; {drivers.length} REGISTERED DRIVERS
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              Studio Preview / Demo Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Commercial Drivers & Crew Management</h2>
          <p className="text-xs text-slate-400">
            Heavy HMV/Transport license verification, duty status, vehicle assignment & batta structure
          </p>
        </div>

        <button
          onClick={onOpenAddDriverModal}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Driver</span>
        </button>
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
              placeholder="Search driver by name, ID, license, assigned vehicle..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <select
              value={dutyFilter}
              onChange={(e) => setDutyFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Duty Statuses</option>
              <option value="On Duty">On Duty</option>
              <option value="Resting">Resting</option>
              <option value="Leave">On Leave</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDrivers.map((driver) => (
          <div
            key={driver.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4 text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center text-xs">
                  {driver.driverId.slice(-3)}
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{driver.name}</h3>
                  <div className="text-[10px] text-slate-400 font-mono">{driver.driverId}</div>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  driver.dutyStatus === 'On Duty'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : driver.dutyStatus === 'Resting'
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}
              >
                {driver.dutyStatus}
              </span>
            </div>

            {/* Assigned Vehicle */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-400" />
                <span className="text-slate-400 text-[11px]">Assigned Vehicle:</span>
              </div>
              <span className="font-mono font-bold text-white text-xs">
                {driver.assignedVehicleNumber || 'Standby'}
              </span>
            </div>

            {/* License & Ratings */}
            <div className="space-y-1.5 text-[11px] text-slate-400">
              <div className="flex justify-between">
                <span>License ({driver.licenseType}):</span>
                <span className="font-mono text-slate-200">{driver.licenseNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>License Expiry:</span>
                <span className="font-mono text-amber-400">{driver.licenseExpiry}</span>
              </div>
              <div className="flex justify-between">
                <span>Safety Rating:</span>
                <span className="text-yellow-400 font-bold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  {driver.safetyRating} / 5.0
                </span>
              </div>
              <div className="flex justify-between">
                <span>Batta Model:</span>
                <span className="text-white font-medium">{driver.battaType}</span>
              </div>
            </div>

            {/* Contact & Footer */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Phone className="w-3 h-3 text-slate-500" />
                <span>{driver.phone}</span>
              </div>

              {onCreateOttTask && (
                <button
                  onClick={() => onCreateOttTask(`Driver License Verification: ${driver.name}`)}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] transition"
                >
                  OTT Task
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
