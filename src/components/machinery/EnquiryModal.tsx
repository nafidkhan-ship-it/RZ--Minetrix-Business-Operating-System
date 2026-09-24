import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  Send,
  Building2,
  Phone,
  CheckCircle2
} from 'lucide-react';
import { MachineryListing, MarketplaceEnquiry } from '../../data/usedMachineryMarketplaceData';

interface EnquiryModalProps {
  listing: MachineryListing | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitEnquiry: (newEnquiry: MarketplaceEnquiry) => void;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  listing,
  isOpen,
  onClose,
  onSubmitEnquiry
}) => {
  if (!isOpen || !listing) return null;

  const [buyerName, setBuyerName] = useState('Anand Krishna');
  const [buyerCompany, setBuyerCompany] = useState('Krishna Infrastructure & Quarry Works');
  const [buyerPhone, setBuyerPhone] = useState('+91 94472 88102');
  const [buyerLocation, setBuyerLocation] = useState('Kozhikode Mining Zone');
  const [urgency, setUrgency] = useState<'Immediate (Within 7 Days)' | 'Next 30 Days' | 'Exploring Options'>('Immediate (Within 7 Days)');
  const [message, setMessage] = useState(
    `We require ${listing.title} for immediate deployment on our aggregate production site. Please confirm availability for surveyor physical inspection.`
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEnquiry: MarketplaceEnquiry = {
      id: `ENQ-${Date.now()}`,
      enquiryCode: `ENQ-2026-${Math.floor(100 + Math.random() * 900)}`,
      listingId: listing.id,
      listingTitle: listing.title,
      listingPriceRs: listing.askingPriceRs,
      listingCategory: listing.category,
      sellerName: listing.sellerName,
      buyerName,
      buyerCompany,
      buyerPhone,
      buyerLocation,
      date: new Date().toISOString().split('T')[0],
      message,
      requirementUrgency: urgency,
      status: 'New'
    };

    onSubmitEnquiry(newEnquiry);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-xs">
        {/* HEADER */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] text-amber-400 font-bold">EQUIPMENT INQUIRY DISPATCH</div>
            <h2 className="text-base font-black text-white">Send Direct Buyer Inquiry</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SUMMARY */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center gap-3">
          <img src={listing.featuredImage} alt="" className="w-14 h-12 rounded-xl object-cover shrink-0" />
          <div className="space-y-0.5">
            <div className="font-mono text-[10px] text-amber-400">{listing.listingCode}</div>
            <div className="font-bold text-white line-clamp-1">{listing.title}</div>
            <div className="text-slate-400 text-[11px]">
              Seller: {listing.sellerBusiness} &bull; {listing.locationDistrict}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 font-medium block mb-1">Your Name</label>
              <input
                type="text"
                required
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="text-slate-400 font-medium block mb-1">Company / Quarry Enterprise</label>
              <input
                type="text"
                required
                value={buyerCompany}
                onChange={(e) => setBuyerCompany(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 font-medium block mb-1">Phone Number</label>
              <input
                type="text"
                required
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-400 font-medium block mb-1">Requirement Urgency</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              >
                <option value="Immediate">Immediate Requirement (1-3 days)</option>
                <option value="Within 15 Days">Within 15 Days</option>
                <option value="Next 30 Days">Next 30 Days</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-400 font-medium block mb-1">Message / Questions to Seller</label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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
              <span>DISPATCH INQUIRY</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
