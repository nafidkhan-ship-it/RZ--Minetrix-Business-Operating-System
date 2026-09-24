import React, { useState } from 'react';
import {
  X,
  DollarSign,
  Truck,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ShieldCheck,
  Send
} from 'lucide-react';
import { MachineryListing, MarketplaceOffer } from '../../data/usedMachineryMarketplaceData';

interface MakeOfferModalProps {
  listing: MachineryListing | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitOffer: (newOffer: MarketplaceOffer) => void;
}

export const MakeOfferModal: React.FC<MakeOfferModalProps> = ({
  listing,
  isOpen,
  onClose,
  onSubmitOffer
}) => {
  if (!isOpen || !listing) return null;

  const [offeredAmountRs, setOfferedAmountRs] = useState(
    Math.round(listing.askingPriceRs * 0.92)
  );
  const [buyerName, setBuyerName] = useState('Coastal Earthworks Pvt Ltd');
  const [buyerCompany, setBuyerCompany] = useState('Coastal Infrastructure Holdings');
  const [buyerPhone, setBuyerPhone] = useState('+91 98450 77121');
  const [deliveryPreference, setDeliveryPreference] = useState<'Buyer Pickup' | 'RZ Vehicle Fleet Delivery' | 'Seller Arranged'>('RZ Vehicle Fleet Delivery');
  const [notes, setNotes] = useState('Subject to verified surveyor cold-start compression test and boom weld audit.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOffer: MarketplaceOffer = {
      id: `OFF-${Date.now()}`,
      offerCode: `OFR-2026-${Math.floor(500 + Math.random() * 400)}`,
      listingId: listing.id,
      listingTitle: listing.title,
      buyerName,
      buyerCompany,
      buyerPhone,
      sellerName: listing.sellerName,
      askingPriceRs: listing.askingPriceRs,
      offeredAmountRs: Number(offeredAmountRs),
      paymentTerms: '20% Escrow Advance, 80% on Trailer Gate Dispatch',
      deliveryPreference,
      pickupLocation: `${listing.locationCity}, ${listing.locationDistrict}`,
      deliveryDestination: 'Kozhikode Project Site Depot',
      submittedDate: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: 'Submitted',
      history: [
        {
          id: `H-${Date.now()}`,
          date: new Date().toLocaleDateString('en-GB'),
          by: 'Buyer',
          amountRs: Number(offeredAmountRs),
          terms: 'Standard Escrow',
          notes
        }
      ]
    };

    onSubmitOffer(newOffer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-xs">
        {/* HEADER */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] text-amber-400 font-bold">COMMERCIAL OFFER PROPOSAL</div>
            <h2 className="text-base font-black text-white">Make an Offer on Equipment</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SUMMARY BAR */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center gap-3">
          <img src={listing.featuredImage} alt="" className="w-14 h-12 rounded-xl object-cover shrink-0" />
          <div className="space-y-0.5">
            <div className="font-mono text-[10px] text-amber-400">{listing.listingCode}</div>
            <div className="font-bold text-white line-clamp-1">{listing.title}</div>
            <div className="text-slate-400 text-[11px]">
              Asking Price: <span className="font-mono text-white font-bold">₹{(listing.askingPriceRs / 100000).toFixed(2)} Lakh</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="p-3 bg-slate-950 rounded-2xl border border-amber-500/40 space-y-1">
            <label className="text-amber-400 font-bold block">Your Offer Amount (₹)</label>
            <input
              type="number"
              required
              value={offeredAmountRs}
              onChange={(e) => setOfferedAmountRs(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-base font-black focus:outline-none focus:border-amber-500"
            />
            <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
              <span>Equivalent to ₹{(offeredAmountRs / 100000).toFixed(2)} Lakh</span>
              <span className="text-emerald-400 font-semibold">
                Difference: ₹{((listing.askingPriceRs - offeredAmountRs) / 100000).toFixed(2)} Lakh
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 font-medium block mb-1">Buyer / Company Name</label>
              <input
                type="text"
                required
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="text-slate-400 font-medium block mb-1">Contact Phone</label>
              <input
                type="text"
                required
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 font-medium block mb-1">Delivery Preference</label>
            <select
              value={deliveryPreference}
              onChange={(e) => setDeliveryPreference(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
            >
              <option value="RZ Fleet Delivery">RZ Fleet Delivery (Low-bed hydraulic trailer)</option>
              <option value="Buyer Pickup">Self Pickup by Buyer Fleet</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-medium block mb-1">Terms & Conditions / Contingencies</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>SUBMIT COMMERCIAL PROPOSAL</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
