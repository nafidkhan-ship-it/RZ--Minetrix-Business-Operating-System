import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  Search,
  CheckCircle2,
  Printer,
  Calendar,
  Users,
  Briefcase,
  Layers,
  ArrowRight,
  Clock,
  AlertCircle
} from 'lucide-react';
import { SettlementRecord, QuarryItem } from '../../data/quarryStudioData';

interface QuarrySettlementsViewProps {
  settlements: SettlementRecord[];
  quarries: QuarryItem[];
  onOpenNewSettlementModal?: () => void;
}

export const QuarrySettlementsView: React.FC<QuarrySettlementsViewProps> = ({
  settlements,
  quarries,
  onOpenNewSettlementModal
}) => {
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = settlements.filter((s) => {
    const matchType = selectedType === 'ALL' || s.settlementType === selectedType;
    const matchSearch =
      s.settlementNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.quarryName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  const totalPayable = filtered.reduce((acc, s) => acc + s.netPayable, 0);
  const totalPaid = filtered.reduce((acc, s) => acc + s.paidAmount, 0);
  const totalBalance = filtered.reduce((acc, s) => acc + s.balance, 0);

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              DISBURSEMENT LEDGER
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ({filtered.length} settlements processed)
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Land Owner & Partner Settlements</h2>
          <p className="text-xs text-slate-400">
            Automated royalty calculation, advance adjustment, partner dividend distribution, and RTGS payment vouchers.
          </p>
        </div>

        <button
          onClick={() => alert('Initiate New Settlement Workflow (Simulated)')}
          className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 flex items-center gap-2 transition shadow-lg shadow-amber-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Process New Settlement</span>
        </button>
      </div>

      {/* 2 Settlement Types Toggle Ribbon (Section 17) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          onClick={() => setSelectedType(selectedType === 'Land Owner' ? 'ALL' : 'Land Owner')}
          className={`p-5 rounded-3xl border transition cursor-pointer flex items-center justify-between ${
            selectedType === 'Land Owner'
              ? 'bg-amber-500/10 border-amber-400 text-white'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400 block uppercase">Settlement Category A</span>
              <h3 className="font-black text-white text-sm">Land Owner Royalty Settlements</h3>
              <p className="text-xs text-slate-400">Per-load extraction royalties minus advance deposits</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-amber-400">
            {settlements.filter((s) => s.settlementType === 'Land Owner').length} Active
          </span>
        </div>

        <div
          onClick={() => setSelectedType(selectedType === 'Partner' ? 'ALL' : 'Partner')}
          className={`p-5 rounded-3xl border transition cursor-pointer flex items-center justify-between ${
            selectedType === 'Partner'
              ? 'bg-purple-500/10 border-purple-400 text-white'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-purple-400 block uppercase">Settlement Category B</span>
              <h3 className="font-black text-white text-sm">Quarry Partner Profit Shares</h3>
              <p className="text-xs text-slate-400">Monthly net pit profit distributed per partner equity ratio</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-purple-400">
            {settlements.filter((s) => s.settlementType === 'Partner').length} Active
          </span>
        </div>
      </div>

      {/* Financial Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Net Payable Obligation</span>
          <span className="text-2xl font-black text-white font-mono">
            ₹{totalPayable.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-500 block">After Advance & Fuel Deductions</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Disbursed (Paid)</span>
          <span className="text-2xl font-black text-emerald-400 font-mono">
            ₹{totalPaid.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-emerald-500/80 block">Completed Bank Transfers</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Pending Disbursement</span>
          <span className="text-2xl font-black text-rose-400 font-mono">
            ₹{totalBalance.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-rose-400/80 block">Scheduled for Approval</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search settlement ID, beneficiary name, or quarry..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
          />
        </div>

        {selectedType !== 'ALL' && (
          <button
            onClick={() => setSelectedType('ALL')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
          >
            Show All Settlements
          </button>
        )}
      </div>

      {/* Settlements Table (Section 17) */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Settlement ID</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Beneficiary</th>
                <th className="py-3.5 px-4">Quarry & Period</th>
                <th className="py-3.5 px-4">Calculated & Deductions</th>
                <th className="py-3.5 px-4">Net Payable</th>
                <th className="py-3.5 px-4">Paid / Balance</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((set) => (
                <tr key={set.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-400 text-sm">
                    {set.settlementNumber}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-white">{set.date}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        set.settlementType === 'Land Owner'
                          ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                          : 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                      }`}
                    >
                      {set.settlementType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{set.beneficiaryName}</div>
                    <div className="text-[10px] font-mono text-slate-500">{set.paymentMode}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-white font-medium">{set.quarryName.split(' ')[0]} Pit</div>
                    <div className="text-[10px] font-mono text-slate-400">{set.periodOrLoadRange}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px]">
                    <div className="text-slate-300">Gross: ₹{set.calculatedAmount.toLocaleString('en-IN')}</div>
                    {set.deductions > 0 && (
                      <div className="text-rose-400">Ded: -₹{set.deductions.toLocaleString('en-IN')}</div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-black text-white text-sm">
                    ₹{set.netPayable.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <div className="text-emerald-400 font-bold">
                      Paid: ₹{set.paidAmount.toLocaleString('en-IN')}
                    </div>
                    {set.balance > 0 ? (
                      <div className="text-rose-400 text-[11px]">
                        Bal: ₹{set.balance.toLocaleString('en-IN')}
                      </div>
                    ) : (
                      <div className="text-slate-500 text-[11px]">Settled</div>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        set.status === 'Paid'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : set.status === 'Approved'
                            ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                            : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                      }`}
                    >
                      {set.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {set.status !== 'Paid' && (
                        <button
                          onClick={() => alert(`Authorizing Payment for ${set.settlementNumber}`)}
                          className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 transition"
                          title="Pay / Disburse"
                        >
                          <DollarSign className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => alert(`Printing Settlement Statement ${set.settlementNumber}`)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        title="Print Statement"
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
