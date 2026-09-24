import React, { useState } from 'react';
import {
  TrendingUp,
  Award,
  DollarSign,
  FileText,
  Truck,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShieldCheck,
  Building2,
  Phone,
  Calendar,
  AlertCircle
} from 'lucide-react';
import {
  MARKETPLACE_DEALS,
  MarketplaceDeal
} from '../../data/usedMachineryMarketplaceData';

interface DealsManagementViewProps {
  onOpenChat: (party: string, dealCode: string) => void;
  onOpenOttModal: (contextRef?: string) => void;
  onNavigateToPayments: () => void;
  onNavigateToDocuments: () => void;
  onNavigateToDelivery: () => void;
}

export const DealsManagementView: React.FC<DealsManagementViewProps> = ({
  onOpenChat,
  onOpenOttModal,
  onNavigateToPayments,
  onNavigateToDocuments,
  onNavigateToDelivery
}) => {
  const [deals, setDeals] = useState<MarketplaceDeal[]>(MARKETPLACE_DEALS);
  const [selectedDeal, setSelectedDeal] = useState<MarketplaceDeal | null>(deals[0] || null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white">Deal Closures & Escrow Contracts</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              Escrow Protected
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Complete deal lifecycle tracking from bilateral agreement execution to delivery signoff
          </p>
        </div>

        <button
          onClick={() => onOpenOttModal('DEAL-MILESTONE-AUDIT')}
          className="px-4 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
        >
          <Clock className="w-4 h-4" />
          <span>+ Create Deal OTT Task</span>
        </button>
      </div>

      {/* 16. DEAL LIFECYCLE PIPELINE VISUALIZER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <h2 className="text-xs font-black text-white uppercase tracking-wider">
          Marketplace Deal Stage Pipeline
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-xs">
          {[
            { step: '1', title: 'Offer Accepted', desc: 'Bilateral agreement' },
            { step: '2', title: 'Deal Created', desc: 'Escrow dossier opened' },
            { step: '3', title: 'Advance Escrow', desc: 'Token deposit' },
            { step: '4', title: 'RTO Documents', desc: 'Form 29/30 & NOC' },
            { step: '5', title: 'Full Settlement', desc: 'Escrow locked' },
            { step: '6', title: 'Fleet Transport', desc: 'Low-bed trailer' },
            { step: '7', title: 'Completed', desc: 'Payout released' }
          ].map((s) => (
            <div key={s.step} className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <div className="font-mono text-[10px] text-amber-400 font-bold">STAGE {s.step}</div>
              <div className="font-bold text-white text-xs">{s.title}</div>
              <div className="text-[10px] text-slate-500">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* DEALS LIST & ACTIVE DOSSIER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Deals List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-sm font-black text-white uppercase tracking-wider">Active Deals ({deals.length})</h2>
          {deals.map((deal) => {
            const isSel = selectedDeal?.id === deal.id;
            return (
              <div
                key={deal.id}
                onClick={() => setSelectedDeal(deal)}
                className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 ${
                  isSel
                    ? 'bg-amber-500/10 border-amber-400 shadow-md'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-amber-400 font-bold">{deal.dealCode}</span>
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {deal.status}
                  </span>
                </div>

                <div className="font-bold text-white text-sm line-clamp-1">{deal.listingTitle}</div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Agreed Price:</span>
                  <span className="font-mono text-white font-bold">
                    ₹{(deal.agreedPriceRs / 100000).toFixed(2)} Lakh
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Deal Dossier (7 cols) */}
        {selectedDeal && (
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="font-mono text-xs text-amber-400 font-bold">{selectedDeal.dealCode}</div>
                <h3 className="text-base font-black text-white">{selectedDeal.listingTitle}</h3>
                <div className="text-xs text-slate-400 mt-0.5">Executed on {selectedDeal.dealDate}</div>
              </div>

              <span className="text-xs px-3 py-1 rounded-full font-bold bg-slate-800 text-slate-200 border border-slate-700">
                {selectedDeal.status}
              </span>
            </div>

            {/* Commercial Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="text-slate-500">Agreed Price</div>
                <div className="text-base font-black text-white font-mono mt-0.5">
                  ₹{(selectedDeal.agreedPriceRs / 100000).toFixed(2)} Lakh
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-emerald-500/40">
                <div className="text-emerald-400 font-semibold">Advance Escrow Held</div>
                <div className="text-base font-black text-emerald-400 font-mono mt-0.5">
                  ₹{(selectedDeal.advancePaidRs / 100000).toFixed(2)} Lakh
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="text-slate-500">Balance Payable</div>
                <div className="text-base font-black text-amber-400 font-mono mt-0.5">
                  ₹{(selectedDeal.balancePayableRs / 100000).toFixed(2)} Lakh
                </div>
              </div>
            </div>

            {/* Parties */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-slate-500">Buyer Entity</div>
                <div className="font-bold text-white text-sm">{selectedDeal.buyerCompany}</div>
                <div className="text-slate-400">{selectedDeal.buyerName}</div>
                <div className="text-slate-400 font-mono text-[11px]">{selectedDeal.buyerContact}</div>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-slate-500">Seller Entity</div>
                <div className="font-bold text-white text-sm">{selectedDeal.sellerCompany}</div>
                <div className="text-slate-400">{selectedDeal.sellerName}</div>
                <div className="text-slate-400 font-mono text-[11px]">{selectedDeal.sellerContact}</div>
              </div>
            </div>

            {/* Milestone Timeline */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                Deal Progress Timeline
              </div>
              <div className="space-y-2 border-l-2 border-slate-800 pl-4 ml-2 text-xs">
                {selectedDeal.timeline.map((item, idx) => (
                  <div key={idx} className="relative space-y-0.5">
                    <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-emerald-400" />
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{item.title}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-slate-500 text-[11px]">{item.date}</span>
                    </div>
                    <div className="text-slate-400">{item.notes}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cross-Link Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={onNavigateToPayments}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                <span>Payment Details</span>
              </button>

              <button
                onClick={onNavigateToDocuments}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>RTO Documents</span>
              </button>

              <button
                onClick={onNavigateToDelivery}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Truck className="w-3.5 h-3.5 text-blue-400" />
                <span>Transport / Fleet</span>
              </button>

              <button
                onClick={() => onOpenChat(selectedDeal.buyerName, selectedDeal.dealCode)}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer ml-auto"
              >
                Chat with Parties
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
