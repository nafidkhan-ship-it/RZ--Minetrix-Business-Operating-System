import React, { useState } from 'react';
import {
  CreditCard,
  Search,
  Plus,
  Truck,
  DollarSign,
  Radio,
  CheckCircle2,
  Calendar,
  MapPin
} from 'lucide-react';
import { TollRecord, Vehicle } from '../../data/vehicleStudioData';

interface VehicleTollViewProps {
  tolls: TollRecord[];
  vehicles: Vehicle[];
  onOpenTollModal: () => void;
}

export const VehicleTollView: React.FC<VehicleTollViewProps> = ({
  tolls,
  vehicles,
  onOpenTollModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('ALL');

  const filtered = tolls.filter((t) => {
    const matchesSearch =
      t.tollPlaza.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.fastagTagId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.route.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPayment = paymentFilter === 'ALL' || t.paymentMethod === paymentFilter;
    return matchesSearch && matchesPayment;
  });

  const totalTollAmount = filtered.reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
              FASTAG NHAI RADAR &bull; {tolls.length} TRANSACTIONS
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20">
              Studio Preview / Demo Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Toll Expenses & Automated Fastag Deductions</h2>
          <p className="text-xs text-slate-400">
            NHAI RFID Fastag electronic toll collection, trip-wise toll routing and cash bypass slips
          </p>
        </div>

        <button
          onClick={onOpenTollModal}
          className="px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Toll Entry</span>
        </button>
      </div>

      {/* KPI Banner */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Total Toll Expenses (Filtered)</div>
            <div className="text-2xl font-black text-white font-mono">
              ₹{totalTollAmount.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-400 text-right">
          <span className="text-emerald-400 font-bold">98.4% Automated Fastag</span> &bull; 1.6% Manual Cash Plazas
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-inner">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search toll plaza, vehicle number, route, tag ID..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Payment Methods</option>
              <option value="Fastag">Fastag RFID</option>
              <option value="Cash">Cash Receipt</option>
            </select>
          </div>
        </div>
      </div>

      {/* Toll Records List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Toll Plaza & Corridor</th>
                <th className="py-3.5 px-3">Vehicle</th>
                <th className="py-3.5 px-3">Date & Time</th>
                <th className="py-3.5 px-3">Payment Method</th>
                <th className="py-3.5 px-3">Fastag Transaction ID</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filtered.map((toll) => (
                <tr key={toll.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white text-sm">{toll.tollPlaza}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>{toll.route}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 font-mono font-bold text-cyan-400">
                    {toll.vehicleNumber}
                  </td>

                  <td className="py-3.5 px-3 text-slate-300">
                    <div>{toll.date}</div>
                    <div className="text-[10px] text-slate-500">{toll.time}</div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        toll.paymentMethod === 'Fastag'
                          ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {toll.paymentMethod}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 font-mono text-slate-400 text-[11px]">
                    {toll.fastagTagId}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-bold text-indigo-400 text-sm">
                    ₹{toll.amount}
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
