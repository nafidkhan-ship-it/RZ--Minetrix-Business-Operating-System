import React, { useState } from 'react';
import {
  DollarSign,
  Search,
  Plus,
  Truck,
  Users,
  CheckCircle2,
  Clock,
  Calendar,
  Filter
} from 'lucide-react';
import { DriverBattaRecord, Driver, Vehicle } from '../../data/vehicleStudioData';

interface VehicleBattaViewProps {
  battas: DriverBattaRecord[];
  drivers: Driver[];
  vehicles: Vehicle[];
  onOpenAddBattaModal: () => void;
  onUpdateBattaStatus?: (battaId: string, status: 'Paid' | 'Pending' | 'Adjusted with Salary') => void;
}

export const VehicleBattaView: React.FC<VehicleBattaViewProps> = ({
  battas,
  drivers,
  vehicles,
  onOpenAddBattaModal,
  onUpdateBattaStatus
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = battas.filter((b) => {
    const matchesSearch =
      b.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.approvedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'ALL' || b.battaType === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || b.paymentStatus === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalBatta = filtered.reduce((acc, b) => acc + b.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-amber-400 uppercase tracking-wider">
              CREW ALLOWANCES &bull; {battas.length} BATTA SLIPS
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
              Studio Preview / Demo Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Driver Batta, Food & Night Halt Allowances</h2>
          <p className="text-xs text-slate-400">
            Multi-mode compensation (per trip, daily, distance-based) with trip deduction and salary adjustment
          </p>
        </div>

        <button
          onClick={onOpenAddBattaModal}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Batta Entry</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl">
          <div className="text-xs text-slate-400">Total Batta Disbursed</div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">
            ₹{totalBatta.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Recorded across all haulage routes</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl">
          <div className="text-xs text-slate-400">Paid Direct / Instant Cash</div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            ₹{(totalBatta * 0.72).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-0.5">72% settled at trip termination</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl">
          <div className="text-xs text-slate-400">Salary Adjustment Queue</div>
          <div className="text-2xl font-black text-cyan-400 font-mono mt-1">
            ₹{(totalBatta * 0.28).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Reconciled on monthly payroll</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-inner">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search driver name, vehicle, ref #, approver..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Batta Types</option>
              <option value="Daily Batta">Daily Batta</option>
              <option value="Trip Batta">Trip Batta</option>
              <option value="Food Allowance">Food Allowance</option>
              <option value="Night Halt">Night Halt</option>
              <option value="Outstation">Outstation</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Payment Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Adjusted with Salary">Adjusted with Salary</option>
            </select>
          </div>
        </div>
      </div>

      {/* Batta Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Driver & Ref #</th>
                <th className="py-3.5 px-3">Vehicle</th>
                <th className="py-3.5 px-3">Batta Type</th>
                <th className="py-3.5 px-3">Date</th>
                <th className="py-3.5 px-3">Units & Rate</th>
                <th className="py-3.5 px-3">Payment Status</th>
                <th className="py-3.5 px-3">Approved By</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white text-sm">{b.driverName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{b.referenceNumber}</div>
                  </td>

                  <td className="py-3.5 px-3 font-mono font-bold text-cyan-400">
                    {b.vehicleNumber}
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-bold">
                      {b.battaType}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-slate-300">
                    {b.date}
                  </td>

                  <td className="py-3.5 px-3 font-mono text-[11px]">
                    {b.daysOrUnits} @ ₹{b.rate}
                  </td>

                  <td className="py-3.5 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        b.paymentStatus === 'Paid'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : b.paymentStatus === 'Pending'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}
                    >
                      {b.paymentStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-slate-400">
                    {b.approvedBy}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-400 text-sm">
                    ₹{b.amount.toLocaleString()}
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
