import React, { useState } from 'react';
import {
  Truck,
  Search,
  Plus,
  Clock,
  CheckCircle2,
  Calendar,
  Building2,
  Scale,
  FileText,
  Printer
} from 'lucide-react';
import { CrusherGateEntry } from '../../data/crusherStudioData';

interface CrusherGateEntryViewProps {
  gateEntries: CrusherGateEntry[];
  onNavigatePage: (page: string) => void;
}

export const CrusherGateEntryView: React.FC<CrusherGateEntryViewProps> = ({
  gateEntries,
  onNavigatePage
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filtered = gateEntries.filter(g => {
    const matchSearch =
      g.entryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === 'ALL' || g.entryType === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                SECURITY BOOTH & BOOM BARRIER
              </span>
              <h2 className="text-xl font-black text-white">Inward & Outward Gate Entry</h2>
            </div>
          </div>
          <button
            onClick={() => alert('New Vehicle Gate Entry logged.')}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Log Vehicle Check-In</span>
          </button>
        </div>

        {/* Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by entry number, vehicle, driver, or purpose..."
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
              <option value="ALL">All Gate Movement Types</option>
              <option value="Inward Raw Material">Inward Raw Material (Boulders)</option>
              <option value="Inward Purchase">Inward Purchase (Spares / Fuel)</option>
              <option value="Outward Sales">Outward Sales (Aggregates)</option>
              <option value="Outward Waste">Outward Waste</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl overflow-x-auto space-y-3">
        <h3 className="text-sm font-bold text-white">Security Barrier Movement Log</h3>
        <table className="w-full text-xs text-left text-slate-300">
          <thead className="bg-slate-950/70 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
            <tr>
              <th className="p-3">Gate Ref</th>
              <th className="p-3">Type</th>
              <th className="p-3">Vehicle No</th>
              <th className="p-3">Driver & Contact</th>
              <th className="p-3">Purpose & Material</th>
              <th className="p-3">In / Out Time</th>
              <th className="p-3">Gross / Tare / Net</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map(entry => (
              <tr key={entry.id} className="hover:bg-slate-800/40">
                <td className="p-3 font-mono font-bold text-cyan-400">{entry.entryNumber}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                      entry.entryType.includes('Inward')
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}
                  >
                    {entry.entryType}
                  </span>
                </td>
                <td className="p-3 font-mono font-bold text-white">{entry.vehicleNumber}</td>
                <td className="p-3">
                  <div className="font-bold text-white">{entry.driverName}</div>
                  <div className="text-[10px] text-slate-500">{entry.driverPhone}</div>
                </td>
                <td className="p-3 text-slate-300 max-w-xs">{entry.purpose}</td>
                <td className="p-3 font-mono text-slate-400">
                  <div>In: {entry.inTime}</div>
                  <div>Out: {entry.outTime}</div>
                </td>
                <td className="p-3 font-mono text-slate-300">
                  <div className="text-white font-bold">Net: {entry.netWeightTons} MT</div>
                  <div className="text-[10px] text-slate-500">G: {entry.grossWeightTons} | T: {entry.tareWeightTons}</div>
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
                    {entry.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
