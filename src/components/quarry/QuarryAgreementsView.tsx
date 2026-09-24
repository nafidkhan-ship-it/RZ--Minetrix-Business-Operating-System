import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Eye,
  Download,
  AlertCircle
} from 'lucide-react';
import { QuarryAgreement, AgreementType } from '../../data/quarryStudioData';

interface QuarryAgreementsViewProps {
  agreements: QuarryAgreement[];
  onOpenNewAgreementModal: () => void;
}

export const QuarryAgreementsView: React.FC<QuarryAgreementsViewProps> = ({
  agreements,
  onOpenNewAgreementModal
}) => {
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = agreements.filter((a) => {
    const matchType = selectedType === 'ALL' || a.type === selectedType;
    const matchSearch =
      a.agreementNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.parcelSurveys.toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              LEGAL CONCESSIONS
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ({filtered.length} executed contracts)
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Quarry Land & Royalty Agreements</h2>
          <p className="text-xs text-slate-400">
            Support for Land Purchase, Mining & Return, Per Load Royalty, and Hybrid Custom terms.
          </p>
        </div>

        <button
          onClick={onOpenNewAgreementModal}
          className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 flex items-center gap-2 transition shadow-lg shadow-amber-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Agreement</span>
        </button>
      </div>

      {/* 4 Archetype Cards (Section 9) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => setSelectedType('Per Load')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            selectedType === 'Per Load'
              ? 'bg-amber-500/10 border-amber-400 text-white'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] font-mono font-bold text-amber-400 block uppercase">Type C</span>
          <div className="font-bold text-white text-sm mt-0.5">Per Load Royalty</div>
          <p className="text-[11px] text-slate-400 mt-1">₹50-₹600 / load or stone extracted</p>
        </div>

        <div
          onClick={() => setSelectedType('Mining & Return')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            selectedType === 'Mining & Return'
              ? 'bg-amber-500/10 border-amber-400 text-white'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] font-mono font-bold text-emerald-400 block uppercase">Type B</span>
          <div className="font-bold text-white text-sm mt-0.5">Mining & Return</div>
          <p className="text-[11px] text-slate-400 mt-1">Land leveled and returned to owner</p>
        </div>

        <div
          onClick={() => setSelectedType('Land Purchase')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            selectedType === 'Land Purchase'
              ? 'bg-amber-500/10 border-amber-400 text-white'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] font-mono font-bold text-blue-400 block uppercase">Type A</span>
          <div className="font-bold text-white text-sm mt-0.5">Land Purchase</div>
          <p className="text-[11px] text-slate-400 mt-1">Freehold acquisition consideration</p>
        </div>

        <div
          onClick={() => setSelectedType('Hybrid / Custom')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            selectedType === 'Hybrid / Custom'
              ? 'bg-amber-500/10 border-amber-400 text-white'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] font-mono font-bold text-purple-400 block uppercase">Type D</span>
          <div className="font-bold text-white text-sm mt-0.5">Hybrid / Custom</div>
          <p className="text-[11px] text-slate-400 mt-1">Minimum guarantee + volume escalation</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search agreement number, landowner name, or surveys..."
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
            Show All Types
          </button>
        )}
      </div>

      {/* Agreements List Cards */}
      <div className="space-y-4">
        {filtered.map((agr) => (
          <div
            key={agr.id}
            className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-amber-400 text-sm">{agr.agreementNumber}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    agr.type === 'Per Load'
                      ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                      : agr.type === 'Mining & Return'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : agr.type === 'Land Purchase'
                          ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                          : 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                  }`}
                >
                  {agr.type}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-slate-400">
                  {agr.status}
                </span>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                {agr.startDate} &rarr; {agr.expiryDate}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Landowner & Concession</span>
                <div className="font-bold text-white text-sm">{agr.ownerName}</div>
                <div className="text-slate-400">{agr.quarryName}</div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Survey Parcels & Extent</span>
                <div className="font-mono text-amber-300 font-bold">{agr.parcelSurveys}</div>
                <div className="text-slate-400">{agr.extentAcres} Acres &bull; {agr.material}</div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Terms Specifics</span>
                <div className="text-slate-200 font-medium">
                  {agr.type === 'Per Load' && `Rate: ₹${agr.ratePerLoad} per ${agr.loadUnit}`}
                  {agr.type === 'Mining & Return' && `Agreed: ₹${agr.agreedMiningAmount?.toLocaleString()} (${agr.miningPeriodMonths} mos)`}
                  {agr.type === 'Land Purchase' && `Rate: ₹${agr.purchaseRatePerAcre?.toLocaleString()}/Acre`}
                  {agr.type === 'Hybrid / Custom' && agr.customRules}
                </div>
                <div className="text-slate-500 text-[11px]">Cycle: {agr.paymentCycle}</div>
              </div>
            </div>

            {/* Financial Progress Bar (Advance, Paid, Balance) */}
            <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Advance Deposited</span>
                <span className="font-mono font-bold text-white text-sm">
                  ₹{agr.advanceAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Paid To Date</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  ₹{agr.paidAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Balance Payable</span>
                <span className="font-mono font-bold text-rose-400 text-sm">
                  ₹{agr.balanceAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
