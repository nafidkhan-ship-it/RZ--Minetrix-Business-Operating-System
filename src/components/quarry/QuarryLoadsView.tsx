import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Search,
  Printer,
  ShieldCheck,
  TrendingUp,
  XCircle,
  Eye,
  CheckCircle2,
  Calendar,
  Layers,
  Users
} from 'lucide-react';
import { QuarryLoad, LoadStatus } from '../../data/quarryStudioData';

interface QuarryLoadsViewProps {
  loads: QuarryLoad[];
  onOpenNewLoadModal: () => void;
  onNavigateToGatePass: (loadId?: string) => void;
  onNavigateToSales: () => void;
}

export const QuarryLoadsView: React.FC<QuarryLoadsViewProps> = ({
  loads,
  onOpenNewLoadModal,
  onNavigateToGatePass,
  onNavigateToSales
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const filtered = loads.filter((l) => {
    const matchSearch =
      l.loadNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.quarryName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = selectedStatus === 'ALL' || l.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Traceability Callout (Section 12) */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-300">
              AUDIT TRACEABILITY CHAIN &bull; AUTOMATED ROYALTY LINK
            </div>
            <p className="text-[11px] text-slate-400">
              Every dispatched load traces directly to: Quarry &rarr; Working Area &rarr; Land Parcel &rarr; Land Owner &rarr; Agreement Royalty Rate.
            </p>
          </div>
        </div>
      </div>

      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              DISPATCH LEDGER
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ({filtered.length} loads active)
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Pit Load Management & Weighment</h2>
          <p className="text-xs text-slate-400">
            Track haulage vehicles, gross weights, mineral transit passes, and commercial sales generation.
          </p>
        </div>

        <button
          onClick={onOpenNewLoadModal}
          className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 flex items-center gap-2 transition shadow-lg shadow-amber-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Load Dispatch</span>
        </button>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search load no, vehicle number, driver, customer, quarry..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:border-amber-400 focus:outline-none"
          >
            <option value="ALL">All Load Statuses</option>
            <option value="Created">Created</option>
            <option value="Loaded">Loaded</option>
            <option value="Gate Pass Issued">Gate Pass Issued</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Loads Table (Section 12) */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Load Number</th>
                <th className="py-3.5 px-4">Date / Time</th>
                <th className="py-3.5 px-4">Quarry & Bench</th>
                <th className="py-3.5 px-4">Landowner & Parcel</th>
                <th className="py-3.5 px-4">Material & Qty</th>
                <th className="py-3.5 px-4">Vehicle / Driver</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((load) => (
                <tr key={load.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-amber-400 text-sm block">{load.loadNumber}</span>
                    <span className="text-[10px] text-slate-500 font-mono">Royalty: ₹{load.royaltyRatePerLoad}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-white">{load.date}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{load.time}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-white font-medium">{load.quarryName.split(' ')[0]} Pit</div>
                    <div className="text-[11px] text-slate-400">{load.workingAreaName}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-amber-300 font-bold">{load.ownerName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{load.parcelSurvey}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-blue-300 block w-fit mb-1">
                      {load.material}
                    </span>
                    <span className="font-mono font-black text-white text-sm">
                      {load.quantity} {load.unit}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-white">{load.vehicleNumber}</div>
                    <div className="text-[11px] text-slate-400">{load.driverName}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-200 font-medium">{load.customerName}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 text-sm">
                    ₹{load.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        load.status === 'Delivered'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : load.status === 'Dispatched'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                      }`}
                    >
                      {load.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onNavigateToGatePass(load.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition"
                        title="Issue / View Gate Pass"
                      >
                        <ShieldCheck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => alert(`Printing Weighbridge Slip for ${load.loadNumber}`)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        title="Print Slip"
                      >
                        <Printer className="w-4 h-4" />
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
