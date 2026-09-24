import React, { useState } from 'react';
import {
  Scale,
  Search,
  Plus,
  Truck,
  Users,
  CheckCircle2,
  DollarSign,
  Download,
  Printer,
  FileText,
  Calendar,
  Sparkles
} from 'lucide-react';
import { OwnerSettlementRecord, VehicleOwner, Vehicle } from '../../data/vehicleStudioData';

interface VehicleOwnerSettlementViewProps {
  settlements: OwnerSettlementRecord[];
  owners: VehicleOwner[];
  vehicles: Vehicle[];
  onOpenNewSettlementModal: () => void;
  onApproveSettlement?: (settlementId: string) => void;
}

export const VehicleOwnerSettlementView: React.FC<VehicleOwnerSettlementViewProps> = ({
  settlements,
  owners,
  vehicles,
  onOpenNewSettlementModal,
  onApproveSettlement
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedSettlement, setSelectedSettlement] = useState<OwnerSettlementRecord | null>(
    settlements[0] || null
  );

  const filtered = settlements.filter((s) => {
    const matchesSearch =
      s.settlementNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.period.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalSettled = settlements.filter(s => s.status === 'Paid').reduce((acc, s) => acc + s.netPayable, 0);
  const totalPending = settlements.filter(s => s.status !== 'Paid').reduce((acc, s) => acc + s.netPayable, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-amber-400 uppercase tracking-wider">
              SYNDICATE PROFIT DISBURSEMENT &bull; {settlements.length} SETTLEMENTS
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
              Studio Preview / Demo Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Vehicle Owner Settlement & Profit Sharing Engine</h2>
          <p className="text-xs text-slate-400">
            Formulas supported: Direct Profit Share, Revenue minus Expense, Fixed Royalty & Hybrid Multi-Owner Splits
          </p>
        </div>

        <button
          onClick={onOpenNewSettlementModal}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Generate Settlement</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl">
          <div className="text-xs text-slate-400">Total Settled (Paid to Partners)</div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            ₹{totalSettled.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Wire transfers & bank RTGS</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl">
          <div className="text-xs text-slate-400">Pending Partner Payouts</div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">
            ₹{totalPending.toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-400/80 mt-0.5">Approved or Draft cycle</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl">
          <div className="text-xs text-slate-400">Formula Rule Engine</div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            4 Models Active
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Zero cross-entity accounting conflicts</div>
        </div>
      </div>

      {/* Split view: Table on left, Settlement Slip on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Settlement List */}
        <div className="lg:col-span-7 space-y-3">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-inner flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search settlement #, owner, vehicle..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Approved">Approved</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          <div className="space-y-2">
            {filtered.map((s) => {
              const isSelected = selectedSettlement?.id === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedSettlement(s)}
                  className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 text-xs ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500 shadow-md ring-1 ring-amber-500/50'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-white text-sm">{s.settlementNumber}</span>
                      <div className="text-[11px] text-slate-400">
                        {s.ownerName} &bull; <span className="font-mono text-cyan-400">{s.vehicleNumber}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        s.status === 'Paid'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : s.status === 'Approved'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px]">
                    <span className="text-slate-400 font-mono">Period: {s.period}</span>
                    <span className="font-mono font-bold text-amber-400 text-sm">
                      Net: ₹{s.netPayable.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Printable Settlement Slip Preview */}
        {selectedSettlement && (
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white uppercase tracking-wider font-mono text-xs">
                  Settlement Slip &bull; {selectedSettlement.settlementNumber}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Simulated PDF Download: ${selectedSettlement.settlementNumber}`)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                  title="Download PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Slip Paper representation */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 font-mono">
              <div className="text-center pb-2 border-b border-slate-800">
                <div className="font-bold text-white text-sm">RZ MINETRIX COMMERCIAL FLEET</div>
                <div className="text-[10px] text-slate-400">PARTNER DISBURSEMENT VOUCHER</div>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Partner / Owner:</span>
                  <span className="text-white font-bold">{selectedSettlement.ownerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vehicle Number:</span>
                  <span className="text-cyan-400 font-bold">{selectedSettlement.vehicleNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Billing Cycle:</span>
                  <span className="text-slate-200">{selectedSettlement.period}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Formula Rule:</span>
                  <span className="text-amber-400">{selectedSettlement.formulaType}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl space-y-1.5 text-[11px] border border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Gross Freight Revenue:</span>
                  <span className="text-emerald-400">₹{selectedSettlement.grossRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Operating Deductions:</span>
                  <span className="text-rose-400">-₹{selectedSettlement.deductions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-800">
                  <span className="text-slate-300 font-bold">Net Asset Surplus:</span>
                  <span className="text-white font-bold">₹{selectedSettlement.netProfit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Configured Partner Share:</span>
                  <span className="text-cyan-400">{selectedSettlement.profitPercent}%</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-800">
                  <span className="text-slate-400">Calculated Gross Share:</span>
                  <span className="text-amber-400 font-bold">₹{selectedSettlement.ownerShare.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Statutory TDS (1%):</span>
                  <span className="text-rose-400">-₹{selectedSettlement.tdsDeduction.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-slate-700 text-sm font-black text-emerald-400">
                  <span>Net Disbursed:</span>
                  <span>₹{selectedSettlement.netPayable.toLocaleString()}</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 pt-1 space-y-0.5">
                <div>Bank Ref: {selectedSettlement.bankReference}</div>
                <div>Status: {selectedSettlement.status} on {selectedSettlement.settlementDate}</div>
              </div>
            </div>

            {selectedSettlement.status !== 'Paid' && onApproveSettlement && (
              <button
                onClick={() => onApproveSettlement(selectedSettlement.id)}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Settlement Paid / Disbursed</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
