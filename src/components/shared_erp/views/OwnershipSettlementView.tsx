import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Truck,
  Building2,
  Users,
  Layers,
  Sparkles,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ChevronRight,
  Plus
} from 'lucide-react';
import {
  OwnershipPartner,
  VehicleTripAccount,
  SettlementRecord
} from '../types';
import {
  MOCK_OWNERSHIP_PARTNERS,
  MOCK_VEHICLE_TRIP_ACCOUNTS,
  MOCK_SETTLEMENT_RECORDS
} from '../data/erpMasterData';

interface OwnershipSettlementViewProps {
  initialSubTab?: 'investors' | 'partners' | 'trip-accounts' | 'ownership' | 'settlements';
  onOpenPrintModal?: (title: string, data: any) => void;
}

export const OwnershipSettlementView: React.FC<OwnershipSettlementViewProps> = ({
  initialSubTab = 'settlements',
  onOpenPrintModal
}) => {
  const [subTab, setSubTab] = useState<'investors' | 'partners' | 'trip-accounts' | 'ownership' | 'settlements'>(initialSubTab);
  const [partners, setPartners] = useState<OwnershipPartner[]>(MOCK_OWNERSHIP_PARTNERS);
  const [trips, setTrips] = useState<VehicleTripAccount[]>(MOCK_VEHICLE_TRIP_ACCOUNTS);
  const [settlements, setSettlements] = useState<SettlementRecord[]>(MOCK_SETTLEMENT_RECORDS);
  const [selectedSettlement, setSelectedSettlement] = useState<SettlementRecord>(settlements[0]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const approveSettlement = (id: string) => {
    setSettlements(prev =>
      prev.map(s => {
        if (s.id !== id) return s;
        const updated: SettlementRecord = { ...s, status: 'APPROVED' };
        if (selectedSettlement?.id === id) setSelectedSettlement(updated);
        return updated;
      })
    );
    showToast('Settlement voucher approved by Finance Director');
  };

  const paySettlement = (id: string) => {
    setSettlements(prev =>
      prev.map(s => {
        if (s.id !== id) return s;
        const updated: SettlementRecord = { ...s, status: 'PAID' };
        if (selectedSettlement?.id === id) setSelectedSettlement(updated);
        return updated;
      })
    );
    showToast('Settlement paid via direct bank transfer');
  };

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              OWNERSHIP &bull; STAKEHOLDER SETTLEMENTS
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
              Studio Preview / Demo Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-rose-400" />
            <span>Ownership Engine, Trip Ledgers &amp; Settlements</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Calculates: <strong>Transaction &rarr; Eligible Amount &rarr; Agreement/Ownership Split &rarr; Calculation &rarr; Settlement &rarr; Payment</strong>. Transparently supports: <em>Investment % &ne; Profit %</em>.
          </p>
        </div>

        <button
          onClick={() => showToast('Run settlement calculation batch')}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Run Settlement Batch</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs font-mono">
        {[
          { id: 'settlements', label: `Settlement Statements (${settlements.length})`, icon: ShieldCheck },
          { id: 'trip-accounts', label: `Vehicle Trip Accounts (${trips.length})`, icon: Truck },
          { id: 'ownership', label: 'Ownership & Share Engine', icon: Layers },
          { id: 'investors', label: 'Investor Accounts', icon: Sparkles },
          { id: 'partners', label: 'Partner Accounts', icon: Building2 }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl font-bold transition cursor-pointer flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. SETTLEMENT STATEMENTS */}
      {subTab === 'settlements' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List of Statements */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
            <h3 className="font-bold text-white text-xs border-b border-slate-800 pb-2">
              Pending &amp; Approved Settlements
            </h3>

            <div className="space-y-2">
              {settlements.map(set => {
                const isSelected = selectedSettlement.id === set.id;
                return (
                  <div
                    key={set.id}
                    onClick={() => setSelectedSettlement(set)}
                    className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 font-mono text-xs ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 shadow-md'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-bold text-white">{set.settlementNo}</span>
                        <div className="text-[10px] text-slate-500">{set.beneficiaryName}</div>
                      </div>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                        set.status === 'PAID'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : set.status === 'APPROVED'
                          ? 'bg-cyan-500/10 text-cyan-400'
                          : 'bg-amber-500/10 text-amber-300'
                      }`}>
                        {set.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 font-sans">{set.period}</div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-slate-400">
                      <span>Net Payable:</span>
                      <span className="text-amber-400 font-black">₹{set.netPayable.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Statement Detail Card */}
          <div className="lg:col-span-2">
            {selectedSettlement ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="font-bold text-amber-400 text-base">{selectedSettlement.settlementNo}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold">
                        {selectedSettlement.category.replace('_', ' ')}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                        {selectedSettlement.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-1">{selectedSettlement.beneficiaryName}</h3>
                    <div className="text-xs text-slate-400 font-mono">Entity: {selectedSettlement.entityRef} &bull; Period: {selectedSettlement.period}</div>
                  </div>

                  <button
                    onClick={() => onOpenPrintModal?.(`Settlement Voucher ${selectedSettlement.settlementNo}`, selectedSettlement)}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Statement</span>
                  </button>
                </div>

                {/* Calculation Details */}
                <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
                  <span className="font-bold text-white text-xs block font-sans">Calculation Breakdown</span>
                  <div className="space-y-1.5 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Gross Eligible Amount:</span>
                      <span className="text-white font-bold">₹{selectedSettlement.totalGrossEligible.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Adjustments / Advances Deducted:</span>
                      <span className="text-rose-400 font-bold">&minus;₹{selectedSettlement.deductions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-900 text-base font-bold text-white">
                      <span>Net Settlement Payable:</span>
                      <span className="text-amber-400">₹{selectedSettlement.netPayable.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  {selectedSettlement.status === 'PENDING_APPROVAL' && (
                    <button
                      onClick={() => approveSettlement(selectedSettlement.id)}
                      className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer shadow-md"
                    >
                      Authorize &amp; Approve Settlement
                    </button>
                  )}
                  {selectedSettlement.status === 'APPROVED' && (
                    <button
                      onClick={() => paySettlement(selectedSettlement.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer shadow-md"
                    >
                      Disburse Net Payment via Bank
                    </button>
                  )}
                  {selectedSettlement.status === 'PAID' && (
                    <div className="text-emerald-400 font-mono text-xs flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Settlement Disbursed &amp; Reconciled in Bank Ledger</span>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* 2. TRIP ACCOUNTS */}
      {subTab === 'trip-accounts' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-sm">Vehicle Trip Profit &amp; Loss Accounts</h3>
            <p className="text-xs text-slate-400">
              Trip Income &minus; (Diesel + Toll + Driver Batta + Loading + Maintenance) = Net Distributable Profit.
            </p>

            <div className="space-y-3 font-mono text-xs">
              {trips.map(tr => (
                <div
                  key={tr.id}
                  className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-900 pb-2">
                    <div>
                      <span className="font-bold text-amber-400 text-sm">{tr.tripNo}</span>
                      <span className="text-slate-400 text-xs ml-2 font-sans font-bold text-white">
                        {tr.vehicleNumber} ({tr.driverName})
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                      {tr.ownerSettlementStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-300">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Freight Revenue</span>
                      <span className="text-white font-bold">₹{tr.tripIncome.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-500 block">({tr.quantityTons} MT @ ₹{tr.freightRate})</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-rose-500 block">&minus; Fuel (Diesel)</span>
                      <span className="text-rose-400 font-bold">₹{tr.dieselExpense.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-rose-500 block">&minus; Batta + Toll + Unloading</span>
                      <span className="text-rose-400 font-bold">
                        ₹{(tr.driverBatta + tr.tollExpense + tr.loadingUnloadingCost).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">Net Trip Profit</span>
                      <span className="text-base font-black text-emerald-400">
                        ₹{tr.netTripProfit.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. OWNERSHIP & SHARE ENGINE */}
      {(subTab === 'ownership' || subTab === 'investors' || subTab === 'partners') && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-sm">Configured Stakeholders &amp; Equity Agreements</h3>

            <div className="space-y-3 font-mono text-xs">
              {partners.map(p => (
                <div
                  key={p.id}
                  className="p-5 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm font-sans">{p.stakeholderName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                        {p.relationship}
                      </span>
                    </div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      Entity: <strong className="text-white">{p.entityName}</strong> ({p.entityType})
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-slate-300">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Equity Share</span>
                      <span className="text-white font-bold">{p.ownershipPct}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-500 block">Profit Share</span>
                      <span className="text-emerald-400 font-bold">{p.profitPct}%</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">Unsettled Balance</span>
                      <span className="text-base font-black text-rose-400">₹{p.unsettledAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
