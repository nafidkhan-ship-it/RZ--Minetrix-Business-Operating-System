import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  DollarSign,
  Calendar,
  Building2,
  Users,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import {
  LandAgreement,
  AgreementType,
  DEMO_LAND_AGREEMENTS
} from '../../../data/quarryLandData';

interface LandAgreementsViewProps {
  onOpenNewAgreement: (ownerId?: string, defaultType?: AgreementType) => void;
  onOpenOwnerProfile: (ownerId: string) => void;
  onOpenAdvance: (ownerId: string) => void;
  onOpenPayment: (ownerId: string) => void;
  onOpenSettlement: (ownerId: string) => void;
  initialTypeFilter?: AgreementType | 'ALL';
}

export const LandAgreementsView: React.FC<LandAgreementsViewProps> = ({
  onOpenNewAgreement,
  onOpenOwnerProfile,
  onOpenAdvance,
  onOpenPayment,
  onOpenSettlement,
  initialTypeFilter = 'ALL'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>(initialTypeFilter);

  const filteredAgreements = DEMO_LAND_AGREEMENTS.filter((agr) => {
    const matchesSearch =
      agr.agreementNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agr.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agr.parcelSurveys.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agr.quarryName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      typeFilter === 'ALL' || agr.type === typeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-purple-400 font-bold uppercase">
              Platform 7 &bull; Commercial Contract Hub
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-bold border border-purple-500/20">
              {DEMO_LAND_AGREEMENTS.length} Executed
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Quarry Land Agreement Engine</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            4 Core Models: <strong>Purchase</strong>, <strong>Mining & Return</strong>, <strong>Per-Load Dispatches</strong>, and <strong>Hybrid Royalties</strong>.
          </p>
        </div>

        <button
          onClick={() => onOpenNewAgreement(undefined, typeFilter !== 'ALL' ? (typeFilter as AgreementType) : undefined)}
          className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-purple-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Agreement</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'ALL', label: 'All Agreements' },
            { id: 'Purchase', label: '1. Land Purchase' },
            { id: 'Mining & Return', label: '2. Mining & Return' },
            { id: 'Per-Load', label: '3. Per-Load Dispatches' },
            { id: 'Hybrid', label: '4. Hybrid Commercial' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTypeFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border cursor-pointer ${
                typeFilter === tab.id
                  ? 'bg-purple-500 text-slate-950 border-purple-400 font-bold shadow-md'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by agreement #, owner, survey #, quarry..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-400"
          />
        </div>
      </div>

      {/* Agreements List */}
      <div className="space-y-4">
        {filteredAgreements.map((agr) => {
          const typeBadgeColor =
            agr.type === 'Purchase'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : agr.type === 'Mining & Return'
              ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
              : agr.type === 'Per-Load'
              ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20';

          return (
            <div
              key={agr.id}
              className="p-5 bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-3xl transition space-y-4 shadow-lg"
            >
              {/* Top Row: Agreement ID, Type, Status, Total Value */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-purple-400">{agr.agreementNumber}</span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${typeBadgeColor}`}>
                      {agr.type}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                      {agr.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Reg: {agr.registrationStatus}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-white mt-1">
                    {agr.parcelSurveys} &bull; <span className="text-purple-300">{agr.material}</span>
                  </h3>
                  <div className="text-xs text-slate-400 flex items-center gap-3 flex-wrap mt-0.5">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      {agr.quarryName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-slate-500" />
                      {agr.workingAreaName || 'General Pit Concession'}
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Agreed Commercial Commitment</div>
                  <div className="text-xl font-black text-white font-mono">
                    ₹{agr.totalAgreedPayableRs.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs font-mono text-emerald-400">
                    ₹{agr.paidAmountRs.toLocaleString('en-IN')} Paid &bull; Bal: ₹{agr.balanceAmountRs.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Owner and Commercial Breakdown */}
              <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Land Owner:</span>
                  <button
                    onClick={() => onOpenOwnerProfile(agr.ownerId)}
                    className="font-bold text-white hover:text-purple-300 flex items-center gap-1 cursor-pointer mt-0.5"
                  >
                    <span>{agr.ownerName}</span>
                    <ArrowUpRight className="w-3 h-3 text-purple-400" />
                  </button>
                  <span className="text-[10px] font-mono text-slate-500">{agr.ownerId}</span>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] block">Rate Specification:</span>
                  <span className="text-white font-semibold">
                    {agr.ratePerLoadRs
                      ? `₹${agr.ratePerLoadRs.toLocaleString('en-IN')} / Load`
                      : agr.miningRatePerCentRs
                      ? `₹${agr.miningRatePerCentRs.toLocaleString('en-IN')} / Cent`
                      : agr.purchaseRatePerCentRs
                      ? `₹${agr.purchaseRatePerCentRs.toLocaleString('en-IN')} / Cent`
                      : agr.hybridPerLoadRs
                      ? `₹${agr.hybridBaseAmountRs?.toLocaleString('en-IN')} + ₹${agr.hybridPerLoadRs}/Load`
                      : 'Commercial Terms'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] block">Effective Tenure:</span>
                  <span className="text-white font-mono">{agr.effectiveDate} to {agr.expiryDate || 'Perpetual'}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{agr.paymentCycle} Settlement</span>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] block">Advance Mobilization:</span>
                  <span className="text-amber-400 font-mono font-bold">
                    ₹{agr.advanceAmountRs.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 block">Deductible per load</span>
                </div>
              </div>

              {/* Return Condition if Mining & Return */}
              {agr.returnCondition && (
                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-[11px] text-purple-200">
                  <strong className="text-purple-300">Restoration & Ground Return Terms:</strong> {agr.returnCondition}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-slate-800/60 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenOwnerProfile(agr.ownerId)}
                    className="px-3 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>View Owner Dossier</span>
                  </button>
                  <button
                    onClick={() => onOpenSettlement(agr.ownerId)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition flex items-center gap-1 cursor-pointer"
                  >
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Create Settlement</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenAdvance(agr.ownerId)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold transition cursor-pointer"
                  >
                    + Issue Advance
                  </button>
                  <button
                    onClick={() => onOpenPayment(agr.ownerId)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold transition cursor-pointer"
                  >
                    + Record Payment
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
