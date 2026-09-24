import React, { useState } from 'react';
import {
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Star,
  Clock,
  Award,
  CheckCircle2,
  TrendingUp,
  FileText,
  DollarSign,
  MessageSquare
} from 'lucide-react';
import {
  MARKETPLACE_LISTINGS,
  MARKETPLACE_DEALS,
  MARKETPLACE_OFFERS
} from '../../data/usedMachineryMarketplaceData';

interface BuyerSellerProfilesViewProps {
  initialType?: 'buyer' | 'seller';
  onOpenChat: (party: string, code: string) => void;
}

export const BuyerSellerProfilesView: React.FC<BuyerSellerProfilesViewProps> = ({
  initialType = 'seller',
  onOpenChat
}) => {
  const [profileType, setProfileType] = useState<'buyer' | 'seller'>(initialType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white">Commercial Profiles & Verified Credentials</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational standing, quarry concession licenses, fleet ownership, and verified transaction histories
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800">
          <button
            onClick={() => setProfileType('seller')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              profileType === 'seller'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Seller Enterprise Profile
          </button>
          <button
            onClick={() => setProfileType('buyer')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              profileType === 'buyer'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Buyer Contractor Profile
          </button>
        </div>
      </div>

      {/* SELLER PROFILE */}
      {profileType === 'seller' ? (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xl">
                  CK
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-white">Coastal Granite & Minerals Consortium</h2>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>RZ Verified Quarry Enterprise</span>
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Primary Contact: <span className="text-white font-medium">Mr. Charles Varghese (Plant Director)</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-500" /> Kannur & Kasaragod, Kerala</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-500" /> +91 94470 98112</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-1">
                <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>4.9 / 5.0</span>
                </div>
                <div className="text-[11px] text-slate-500">Based on 14 completed machine deliveries</div>
                <div className="text-[11px] text-emerald-400 font-mono">Avg Response Time: &lt; 25 mins</div>
              </div>
            </div>

            {/* Seller stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="text-slate-500">Active Listed Units</div>
                <div className="text-2xl font-black text-white font-mono mt-1">12 Machines</div>
                <div className="text-[11px] text-amber-400 mt-1">Excavators & Tippers</div>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="text-slate-500">Completed Transactions</div>
                <div className="text-2xl font-black text-emerald-400 font-mono mt-1">₹3.80 Cr</div>
                <div className="text-[11px] text-slate-400 mt-1">Total escrow transacted</div>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="text-slate-500">Inspection Pass Rate</div>
                <div className="text-2xl font-black text-white font-mono mt-1">100%</div>
                <div className="text-[11px] text-emerald-400 mt-1">No major powertrain defects</div>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="text-slate-500">Concession Validity</div>
                <div className="text-base font-black text-white mt-1">Valid till 2034</div>
                <div className="text-[11px] text-slate-400 mt-1">Dept of Mining & Geology</div>
              </div>
            </div>

            {/* Seller Live Equipment */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-white uppercase tracking-wider">
                  Live Equipment Listed by This Seller
                </h3>
                <span className="text-xs text-slate-400">{MARKETPLACE_LISTINGS.length} available</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {MARKETPLACE_LISTINGS.slice(0, 3).map((item) => (
                  <div key={item.id} className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-3">
                    <img src={item.featuredImage} alt="" className="w-16 h-14 rounded-xl object-cover" />
                    <div className="space-y-0.5 text-xs">
                      <div className="font-bold text-white line-clamp-1">{item.title}</div>
                      <div className="font-mono text-amber-400">₹{(item.askingPriceRs / 100000).toFixed(2)}L</div>
                      <div className="text-[10px] text-slate-500">{item.hoursWorked || item.odometerKm} &bull; {item.year}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* BUYER PROFILE */
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-black text-xl">
                  MC
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-white">Malabar Earthmovers & Infrastructure Pvt Ltd</h2>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Class-A Highway Contractor</span>
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Lead Representative: <span className="text-white font-medium">Mr. K. R. Nambiar (Managing Director)</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-500" /> Kozhikode Mining Zone</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-500" /> +91 98460 33412</span>
                  </div>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-xs text-slate-500">Escrow Trust Score</div>
                <div className="text-base font-black text-emerald-400">Tier-1 Preferred Buyer</div>
                <div className="text-[11px] text-slate-400">Zero defaults across 8 equipment acquisitions</div>
              </div>
            </div>

            {/* Buyer stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="text-slate-500">Purchased Heavy Fleet</div>
                <div className="text-2xl font-black text-white font-mono mt-1">18 Units</div>
                <div className="text-[11px] text-slate-400 mt-1">Operating on NH-66 packages</div>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="text-slate-500">Active Proposals Submitted</div>
                <div className="text-2xl font-black text-amber-400 font-mono mt-1">3 Offers</div>
                <div className="text-[11px] text-amber-400 mt-1">Currently in negotiation</div>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="text-slate-500">Pending Inspections</div>
                <div className="text-2xl font-black text-white font-mono mt-1">2 Audits</div>
                <div className="text-[11px] text-slate-400 mt-1">Surveyor scheduled</div>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="text-slate-500">Preferred Equipment</div>
                <div className="text-base font-black text-white mt-1">20T+ Excavators</div>
                <div className="text-[11px] text-slate-400 mt-1">Cat, Komatsu, Volvo</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
