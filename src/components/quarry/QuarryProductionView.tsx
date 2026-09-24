import React, { useState } from 'react';
import {
  Pickaxe,
  Plus,
  Search,
  Calendar,
  Layers,
  Truck,
  ArrowRight,
  TrendingUp,
  Download
} from 'lucide-react';
import { ProductionEntry, QuarryItem } from '../../data/quarryStudioData';

interface QuarryProductionViewProps {
  productions: ProductionEntry[];
  quarries: QuarryItem[];
  onOpenProductionEntryModal: () => void;
}

export const QuarryProductionView: React.FC<QuarryProductionViewProps> = ({
  productions,
  quarries,
  onOpenProductionEntryModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('ALL');

  const filtered = productions.filter((p) => {
    const matchSearch =
      p.workingAreaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.quarryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.operator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchMaterial = selectedMaterial === 'ALL' || p.material === selectedMaterial;
    return matchSearch && matchMaterial;
  });

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              PIT EXTRACTION TELEMETRY
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ({filtered.length} shift logs recorded)
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Daily Pit Production Logs</h2>
          <p className="text-xs text-slate-400">
            Shift-wise wire-saw extraction, explosive blasting logs, machine hours, and pit stock additions.
          </p>
        </div>

        <button
          onClick={onOpenProductionEntryModal}
          className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 flex items-center gap-2 transition shadow-lg shadow-amber-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Production Entry</span>
        </button>
      </div>

      {/* Production Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Today Laterite Cut</span>
          <span className="text-2xl font-black text-amber-400 font-mono">5,000</span>
          <span className="text-[10px] text-slate-500 block">Building Stones</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Today Hard Rock Blast</span>
          <span className="text-2xl font-black text-blue-400 font-mono">1,450</span>
          <span className="text-[10px] text-slate-500 block">Metric Tonnes (MT)</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Secondary Aggregates</span>
          <span className="text-2xl font-black text-emerald-400 font-mono">980</span>
          <span className="text-[10px] text-slate-500 block">MT Overburden & Clay</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Pit Stock</span>
          <span className="text-lg font-black text-white font-mono">27.6K Pcs / 12.4K MT</span>
          <span className="text-[10px] text-emerald-400 block">Ready for Dispatch</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search bench, operator, or quarry name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div>
          <select
            value={selectedMaterial}
            onChange={(e) => setSelectedMaterial(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:border-amber-400 focus:outline-none"
          >
            <option value="ALL">All Materials</option>
            <option value="Laterite">Laterite Stones</option>
            <option value="Hard Rock">Hard Rock / Granite</option>
            <option value="Aggregate">Crushed Aggregate</option>
          </select>
        </div>
      </div>

      {/* Production Entries Table (Section 11) */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Production ID</th>
                <th className="py-3.5 px-4">Date & Shift</th>
                <th className="py-3.5 px-4">Quarry & Working Area</th>
                <th className="py-3.5 px-4">Material</th>
                <th className="py-3.5 px-4">Extracted Qty</th>
                <th className="py-3.5 px-4">Machinery Utilized</th>
                <th className="py-3.5 px-4">Operator In-Charge</th>
                <th className="py-3.5 px-4">Stock Added</th>
                <th className="py-3.5 px-4">Shift Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-400">{prod.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-white font-bold">{prod.date}</div>
                    <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.2 rounded">
                      {prod.shift}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{prod.workingAreaName}</div>
                    <div className="text-[11px] text-slate-400">{prod.quarryName}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                      {prod.material}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-black text-emerald-400 text-sm">
                    {prod.quantity.toLocaleString('en-IN')} {prod.unit}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{prod.machineryUsed}</td>
                  <td className="py-3.5 px-4 text-slate-200 font-medium">{prod.operator}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">+{prod.stockAdded}</td>
                  <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">{prod.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
