import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  MessageSquare,
  AlertCircle,
  ShieldCheck,
  Send,
  Building2,
  RefreshCw
} from 'lucide-react';
import {
  MARKETPLACE_OFFERS,
  MarketplaceOffer
} from '../../data/usedMachineryMarketplaceData';

interface OffersNegotiationViewProps {
  onOpenChat: (party: string, listingCode: string) => void;
  onOpenOttModal: (contextRef?: string) => void;
  onAcceptOfferToDeal: (offer: MarketplaceOffer) => void;
}

export const OffersNegotiationView: React.FC<OffersNegotiationViewProps> = ({
  onOpenChat,
  onOpenOttModal,
  onAcceptOfferToDeal
}) => {
  const [offers, setOffers] = useState<MarketplaceOffer[]>(MARKETPLACE_OFFERS);
  const [counterAmounts, setCounterAmounts] = useState<{ [id: string]: number }>({});
  const [counterNotes, setCounterNotes] = useState<{ [id: string]: string }>({});
  const [activeCounterOfferId, setActiveCounterOfferId] = useState<string | null>(null);

  const handleSendCounter = (offerId: string) => {
    const amount = counterAmounts[offerId];
    if (!amount) return;

    setOffers((prev) =>
      prev.map((off) => {
        if (off.id === offerId) {
          const newHistoryItem = {
            id: `OFH-${Date.now()}`,
            date: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            by: 'Seller' as const,
            amountRs: Number(amount),
            terms: 'Revised counter-offer with escrow terms',
            notes: counterNotes[offerId] || 'Seller revised proposal.'
          };
          return {
            ...off,
            status: 'Counter Offer' as const,
            offeredAmountRs: Number(amount),
            history: [...off.history, newHistoryItem]
          };
        }
        return off;
      })
    );
    setActiveCounterOfferId(null);
  };

  const handleReject = (offerId: string) => {
    setOffers((prev) =>
      prev.map((off) => (off.id === offerId ? { ...off, status: 'Rejected' as const } : off))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white">Offers & Commercial Negotiations</h1>
          <p className="text-xs text-slate-400">
            Submit, evaluate, counter-offer, or lock escrow on heavy earthmoving & commercial equipment proposals
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenOttModal('OFR-NEGOTIATION-BATCH')}
            className="px-4 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Clock className="w-4 h-4" />
            <span>+ Create Negotiation Task</span>
          </button>
        </div>
      </div>

      {/* Offers Pipeline Cards */}
      <div className="space-y-5">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5"
          >
            {/* Header row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {offer.offerCode}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">Submitted {offer.submittedDate}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">Valid till {offer.validUntil}</span>
                </div>
                <h3 className="text-base font-black text-white">{offer.listingTitle}</h3>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-3 py-1 rounded-full font-bold border ${
                    offer.status === 'Accepted'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : offer.status === 'Rejected'
                      ? 'bg-red-500/10 text-red-400 border-red-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}
                >
                  Status: {offer.status}
                </span>
              </div>
            </div>

            {/* Commercial Comparison Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="text-slate-500">Public Asking Price</div>
                <div className="text-base font-black text-white font-mono mt-0.5">
                  ₹{(offer.askingPriceRs / 100000).toFixed(2)} Lakh
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-amber-500/40">
                <div className="text-amber-400 font-semibold">Current Offer Amount</div>
                <div className="text-base font-black text-amber-400 font-mono mt-0.5">
                  ₹{(offer.offeredAmountRs / 100000).toFixed(2)} Lakh
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="text-slate-500">Difference / Discount</div>
                <div className="text-base font-black text-emerald-400 font-mono mt-0.5">
                  -₹{((offer.askingPriceRs - offer.offeredAmountRs) / 100000).toFixed(2)} L (
                  {Math.round(((offer.askingPriceRs - offer.offeredAmountRs) / offer.askingPriceRs) * 100)}%)
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="text-slate-500">Delivery Mode</div>
                <div className="font-bold text-white mt-0.5">{offer.deliveryPreference}</div>
              </div>
            </div>

            {/* Negotiation History Thread */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                <span>Negotiation Timeline & Counter History</span>
              </div>

              <div className="space-y-2 border-l-2 border-slate-800 pl-4 ml-2">
                {offer.history.map((hist) => (
                  <div key={hist.id} className="relative text-xs space-y-0.5">
                    <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-amber-400" />
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{hist.by} Proposal:</span>
                      <span className="font-mono font-bold text-amber-400">
                        ₹{(hist.amountRs / 100000).toFixed(2)} Lakh
                      </span>
                      <span className="text-slate-500">·</span>
                      <span className="text-slate-500 text-[11px]">{hist.date}</span>
                    </div>
                    <div className="text-slate-400">{hist.notes}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* In-Line Counter Offer Form */}
            {activeCounterOfferId === offer.id && (
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 text-xs">
                <div className="font-bold text-white text-sm">Submit Counter Offer</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 font-medium block mb-1">New Counter Amount (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 4050000"
                      value={counterAmounts[offer.id] || ''}
                      onChange={(e) =>
                        setCounterAmounts({ ...counterAmounts, [offer.id]: Number(e.target.value) })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Counter Terms & Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. Include newly fitted ground engaging teeth"
                      value={counterNotes[offer.id] || ''}
                      onChange={(e) =>
                        setCounterNotes({ ...counterNotes, [offer.id]: e.target.value })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => setActiveCounterOfferId(null)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSendCounter(offer.id)}
                    className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Counter Offer</span>
                  </button>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenChat(offer.buyerName, offer.offerCode)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Negotiation Chat</span>
                </button>

                <button
                  onClick={() =>
                    setActiveCounterOfferId(activeCounterOfferId === offer.id ? null : offer.id)
                  }
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer"
                >
                  Counter Offer
                </button>

                <button
                  onClick={() => handleReject(offer.id)}
                  disabled={offer.status === 'Rejected'}
                  className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-bold text-xs transition cursor-pointer disabled:opacity-40"
                >
                  Reject
                </button>
              </div>

              <button
                onClick={() => onAcceptOfferToDeal(offer)}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>ACCEPT & CONVERT TO DEAL</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
