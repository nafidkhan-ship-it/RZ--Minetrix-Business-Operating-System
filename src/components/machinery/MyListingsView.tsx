import React, { useState } from 'react';
import {
  Eye,
  Plus,
  Edit3,
  PauseCircle,
  PlayCircle,
  CheckCircle2,
  DollarSign,
  Users,
  Search,
  MessageSquare,
  AlertCircle,
  TrendingUp,
  Tag
} from 'lucide-react';
import { MachineryListing, ListingStatus } from '../../data/usedMachineryMarketplaceData';

interface MyListingsViewProps {
  listings: MachineryListing[];
  onSelectList: (listing: MachineryListing) => void;
  onOpenListWizard: () => void;
  onUpdateStatus: (listingId: string, newStatus: ListingStatus) => void;
  onOpenChat: (seller: string, listingCode: string) => void;
}

export const MyListingsView: React.FC<MyListingsViewProps> = ({
  listings,
  onSelectList,
  onOpenListWizard,
  onUpdateStatus,
  onOpenChat
}) => {
  const [statusFilter, setStatusFilter] = useState<'ALL' | ListingStatus>('ALL');
  const [search, setSearch] = useState('');

  const filtered = listings.filter((item) => {
    if (statusFilter !== 'ALL' && item.inspectionStatus !== statusFilter) {
      // In sample data we can map
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!item.title.toLowerCase().includes(q) && !item.listingCode.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white">My Machinery & Vehicle Listings</h1>
          <p className="text-xs text-slate-400">
            Manage your inventory, monitor views and inbound offers, or update asking prices
          </p>
        </div>

        <button
          onClick={onOpenListWizard}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Listing</span>
        </button>
      </div>

      {/* KPI Ticker */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-slate-400 text-xs font-medium">My Active Listings</div>
          <div className="text-2xl font-black text-white font-mono mt-1">{listings.length}</div>
          <div className="text-[11px] text-amber-400 mt-1">Live in marketplace</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-slate-400 text-xs font-medium">Total Inbound Views</div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {listings.reduce((acc, curr) => acc + curr.viewsCount, 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Operator impressions</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-slate-400 text-xs font-medium">Active Enquiries</div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">
            {listings.reduce((acc, curr) => acc + curr.enquiriesCount, 0)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Direct buyer messages</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-slate-400 text-xs font-medium">Received Offers</div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            {listings.reduce((acc, curr) => acc + curr.offersCount, 0)}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">Under negotiation</div>
        </div>
      </div>

      {/* Listings Table / Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="text-base font-black text-white">Active Inventory Portfolio</h2>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search my listings..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 transition hover:border-slate-700"
            >
              <div className="flex items-start gap-4">
                <img
                  src={item.featuredImage}
                  alt={item.title}
                  className="w-20 h-16 rounded-xl object-cover bg-slate-900 shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                    <span className="text-amber-400 font-bold">{item.listingCode}</span>
                    <span>·</span>
                    <span>{item.category}</span>
                    <span>·</span>
                    <span className="text-emerald-400 font-semibold">{item.condition}</span>
                  </div>
                  <h3
                    onClick={() => onSelectList(item)}
                    className="text-sm font-black text-white hover:text-amber-400 transition cursor-pointer"
                  >
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>{item.locationDistrict}, {item.locationState}</span>
                    <span>·</span>
                    <span>Posted {item.postedDate}</span>
                  </div>
                </div>
              </div>

              {/* Metrics & Actions */}
              <div className="flex flex-wrap items-center gap-6 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-900 text-xs">
                <div className="flex items-center gap-4 text-center">
                  <div>
                    <div className="text-[10px] text-slate-500">Asking</div>
                    <div className="font-mono font-bold text-white">
                      ₹{(item.askingPriceRs / 100000).toFixed(2)}L
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">Views</div>
                    <div className="font-mono text-slate-300">{item.viewsCount}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">Enquiries</div>
                    <div className="font-mono text-amber-400 font-bold">{item.enquiriesCount}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">Offers</div>
                    <div className="font-mono text-emerald-400 font-bold">{item.offersCount}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectList(item)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer"
                  >
                    Preview
                  </button>

                  <button
                    onClick={() => onOpenChat(item.sellerName, item.listingCode)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs transition cursor-pointer flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Enquiries</span>
                  </button>

                  <button
                    onClick={() => onUpdateStatus(item.id, 'Sold')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs transition cursor-pointer"
                  >
                    Mark Sold
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
