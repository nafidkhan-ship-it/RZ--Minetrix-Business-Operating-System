import React, { useState } from 'react';
import {
  Scale,
  Search,
  Plus,
  Truck,
  Building2,
  FileText,
  Calendar,
  CheckCircle2,
  Printer,
  Sparkles,
  ArrowRight,
  Filter,
  Eye,
  Info
} from 'lucide-react';
import { MaterialReceipt } from '../../data/crusherStudioData';

interface CrusherReceiptsViewProps {
  receipts: MaterialReceipt[];
  onOpenNewReceipt: () => void;
  onOpenWorkflow: () => void;
  onNavigatePage: (page: string) => void;
}

export const CrusherReceiptsView: React.FC<CrusherReceiptsViewProps> = ({
  receipts,
  onOpenNewReceipt,
  onOpenWorkflow,
  onNavigatePage
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<MaterialReceipt | null>(receipts[0] || null);

  const filtered = receipts.filter(r =>
    r.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.sourceQuarryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.driverName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalTons = receipts.reduce((acc, r) => acc + r.quantityTons, 0);
  const totalValuation = receipts.reduce((acc, r) => acc + r.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                QUARRY → CRUSHER WEIGHBRIDGE INTAKE
              </span>
              <h2 className="text-xl font-black text-white">Raw Material Weighbridge Receipts</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenWorkflow}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Traceability Pipeline</span>
            </button>
            <button
              onClick={onOpenNewReceipt}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Record Weighbridge Receipt</span>
            </button>
          </div>
        </div>

        {/* Quarry Connection Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Total Received Today</span>
            <span className="text-xl font-black text-cyan-400 font-mono mt-0.5">{totalTons.toFixed(1)} MT</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Inward Boulder Value</span>
            <span className="text-xl font-black text-emerald-400 font-mono mt-0.5">₹{totalValuation.toLocaleString()}</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Primary Feeder Pit</span>
            <span className="text-sm font-bold text-white block mt-1 truncate">Kasaragod Pit #01</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Weighbridge Status</span>
            <span className="text-xs font-mono font-bold text-emerald-400 block mt-1">60 MT Dual Scale Online</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative pt-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by receipt number, source quarry, vehicle number, or driver..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9.5 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Main Grid: Receipts Table & Slip Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl overflow-x-auto space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Weighbridge Log Sheet</h3>
            <span className="text-[10px] font-mono text-cyan-400">{filtered.length} Inward Loads</span>
          </div>

          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950/70 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-2.5">Receipt No</th>
                <th className="p-2.5">Quarry Source</th>
                <th className="p-2.5">Vehicle</th>
                <th className="p-2.5">Material</th>
                <th className="p-2.5">Net (MT)</th>
                <th className="p-2.5">Amount</th>
                <th className="p-2.5 text-right">Slip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map(rcpt => (
                <tr
                  key={rcpt.id}
                  onClick={() => setSelectedReceipt(rcpt)}
                  className={`hover:bg-slate-800/40 cursor-pointer transition ${
                    selectedReceipt?.id === rcpt.id ? 'bg-cyan-500/10' : ''
                  }`}
                >
                  <td className="p-2.5 font-mono font-bold text-cyan-400">{rcpt.receiptNumber}</td>
                  <td className="p-2.5">
                    <div className="font-bold text-white truncate max-w-xs">{rcpt.sourceQuarryName}</div>
                    <div className="text-[10px] text-slate-500">{rcpt.date} &bull; {rcpt.time}</div>
                  </td>
                  <td className="p-2.5 font-mono text-slate-300">{rcpt.vehicleNumber}</td>
                  <td className="p-2.5 text-slate-300">{rcpt.material}</td>
                  <td className="p-2.5 font-mono font-black text-white">{rcpt.quantityTons}</td>
                  <td className="p-2.5 font-mono font-bold text-emerald-400">₹{rcpt.totalAmount.toLocaleString()}</td>
                  <td className="p-2.5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReceipt(rcpt);
                      }}
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Digital Weighbridge Slip Card */}
        {selectedReceipt && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">DIGITAL WEIGH SLIP</span>
                <h3 className="text-sm font-bold text-white">{selectedReceipt.weighbridgeSlipNo}</h3>
              </div>
              <button
                onClick={() => alert(`Printing Weighbridge Slip ${selectedReceipt.weighbridgeSlipNo}...`)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                title="Print Slip"
              >
                <Printer className="w-4 h-4 text-cyan-400" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 text-xs font-mono">
              <div className="text-center pb-2 border-b border-slate-900">
                <span className="text-[11px] font-bold text-white block">RZ® MINETRIX CRUSHER WEIGHBRIDGE</span>
                <span className="text-[10px] text-slate-500">Plant CP-01 Dual Loadcell Inward Slip</span>
              </div>

              <div className="space-y-1.5 text-slate-400">
                <div className="flex justify-between">
                  <span>RECEIPT NO:</span>
                  <span className="text-white font-bold">{selectedReceipt.receiptNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>DATE & TIME:</span>
                  <span className="text-white">{selectedReceipt.date} {selectedReceipt.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>SOURCE PIT:</span>
                  <span className="text-cyan-400 font-bold truncate max-w-[160px]">{selectedReceipt.sourceQuarryName}</span>
                </div>
                <div className="flex justify-between">
                  <span>VEHICLE NO:</span>
                  <span className="text-white font-bold">{selectedReceipt.vehicleNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>DRIVER:</span>
                  <span className="text-slate-300">{selectedReceipt.driverName}</span>
                </div>
                <div className="flex justify-between">
                  <span>MATERIAL:</span>
                  <span className="text-amber-400 font-bold">{selectedReceipt.material}</span>
                </div>
                <div className="flex justify-between">
                  <span>QUALITY:</span>
                  <span className="text-emerald-400">{selectedReceipt.qualityGrade}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-900 space-y-1 text-slate-300">
                <div className="flex justify-between text-[11px]">
                  <span>GROSS WEIGHT:</span>
                  <span>{selectedReceipt.weighbridgeGrossTons.toFixed(2)} MT</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>TARE WEIGHT:</span>
                  <span>{selectedReceipt.weighbridgeTareTons.toFixed(2)} MT</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-cyan-400 pt-1 border-t border-slate-900">
                  <span>NET BILLABLE:</span>
                  <span>{selectedReceipt.weighbridgeNetTons.toFixed(2)} MT</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-emerald-400">
                  <span>TOTAL VALUATION:</span>
                  <span>₹{selectedReceipt.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-slate-500 border-t border-slate-900 flex justify-between">
                <span>INCHARGE: {selectedReceipt.receivedBy}</span>
                <span className="text-emerald-400 font-bold">VERIFIED</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
