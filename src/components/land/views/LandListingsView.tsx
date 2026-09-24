import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Plus,
  Compass,
  FileText,
  DollarSign,
  ShieldCheck,
  Calendar,
  Building2,
  Users,
  Eye,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import {
  LandListingItem,
  DEMO_LAND_LISTINGS,
  convertLandUnit
} from '../../../data/quarryLandData';

interface LandListingsViewProps {
  onOpenOwnerProfile: (ownerId: string) => void;
  onOpenNewAgreement: (ownerId?: string) => void;
  onScheduleVisit: (listingTitle: string) => void;
  onOpenEnquiryModal: (listingId: string) => void;
}

export const LandListingsView: React.FC<LandListingsViewProps> = ({
  onOpenOwnerProfile,
  onOpenNewAgreement,
  onScheduleVisit,
  onOpenEnquiryModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [listingTypeFilter, setListingTypeFilter] = useState<string>('ALL');

  const filteredListings = DEMO_LAND_LISTINGS.filter((l) => {
    const matchesSearch =
      l.listingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.landType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      listingTypeFilter === 'ALL' || l.commercialModel === listingTypeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-amber-400 font-bold uppercase">
              Platform 7 &bull; Marketplace
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              Verified Title Deeds
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Quarry Land Listings</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified mineral-rich quarry lands available for outright purchase, concession lease, or joint venture.
          </p>
        </div>

        <button
          onClick={() => alert('New Quarry Land Listing: Upload Title Deed & Survey Sketch for RZ Bos Verification.')}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Land Listing</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['ALL', 'For Sale', 'For Mining Concession Lease', 'Joint Venture'].map((type) => (
            <button
              key={type}
              onClick={() => setListingTypeFilter(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border cursor-pointer ${
                listingTypeFilter === type
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search listings by title, location..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredListings.map((listing) => (
          <div
            key={listing.id}
            className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-3xl transition space-y-4 shadow-lg flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400">{listing.listingCode}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                      {listing.commercialModel}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-white mt-1">{listing.title}</h3>
                  <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{listing.location}, {listing.district}, {listing.state}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-white font-mono">
                    {listing.extentCents} Cents
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    ({listing.extentAcres} Acres)
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-block mt-1">
                    {listing.status}
                  </span>
                </div>
              </div>

              {/* Pricing & Commercial Terms */}
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold">Asking Price / Rate</span>
                  <div className="text-lg font-black text-amber-400 font-mono mt-0.5">
                    {listing.askingPriceRs ? `₹${listing.askingPriceRs.toLocaleString('en-IN')}` : 'Royalty / Lease'}
                  </div>
                  <div className="text-[10px] text-slate-400">{listing.leaseTerms || 'Outright Sale'}</div>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] uppercase font-semibold">Commercial Model</span>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {listing.commercialModel}
                  </div>
                </div>
              </div>

              {/* Mineral Potential & Access */}
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block font-semibold">Mineral Potential & Geological Reserve:</span>
                  <span className="text-white font-medium">{listing.estimatedYieldMT} &bull; {listing.landType}</span>
                </div>
                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block font-semibold">Haul Access & Clearances:</span>
                  <span className="text-slate-300">{listing.accessRoad} &bull; {listing.permits.join(', ')}</span>
                </div>
              </div>

              {/* Shielded Owner Notice */}
              <div className="p-2 bg-slate-950/40 rounded-xl flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Owner Contact: Verified & Shielded by RZ® Bos</span>
                </span>
                <button
                  onClick={() => onOpenOwnerProfile(listing.ownerId)}
                  className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Dossier</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
              <button
                onClick={() => onScheduleVisit(listing.title)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Schedule Site Inspection</span>
              </button>

              <button
                onClick={() => onOpenEnquiryModal(listing.id)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <span>Express Buyer Interest</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
