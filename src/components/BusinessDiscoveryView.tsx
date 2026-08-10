import React, { useState } from 'react';
import {
  Search,
  Building2,
  BadgeCheck,
  MapPin,
  MessageSquare,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Store,
  Sparkles
} from 'lucide-react';
import { BusinessProfile, BusinessCategory } from '../types/rzChatTypes';
import { rzChatService } from '../services/rzChatService';

interface BusinessDiscoveryViewProps {
  viewerUserId: string;
  onViewBusiness: (business: BusinessProfile) => void;
  onStartChatWithBusiness: (businessId: string) => void;
  onRegisterBusiness: () => void;
  onToast: (msg: string) => void;
}

const CATEGORIES: (BusinessCategory | 'All')[] = [
  'All',
  'Quarry',
  'Transport',
  'Construction',
  'Equipment Rental',
  'Machinery',
  'Manufacturing',
  'Wholesale',
  'Retail',
  'Service',
  'Professional Services',
  'Food',
  'Automotive',
  'Other'
];

export const BusinessDiscoveryView: React.FC<BusinessDiscoveryViewProps> = ({
  viewerUserId,
  onViewBusiness,
  onStartChatWithBusiness,
  onRegisterBusiness,
  onToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [page, setPage] = useState(1);

  const paginatedResult = rzChatService.getBusinesses(
    searchQuery,
    selectedCategory,
    page,
    9
  );

  return (
    <div className="space-y-6 font-sans">
      {/* HEADER HERO STRIP & REGISTER CTA */}
      <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 font-mono">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded-full border border-amber-500/30 flex items-center gap-1">
              <Store className="w-3 h-3" /> Public Commercial Marketplace
            </span>
          </div>
          <h2 className="text-xl font-black text-white">RZ Business Directory &amp; Discovery</h2>
          <p className="text-slate-400 text-xs mt-1 max-w-xl">
            Discover verified quarries, haulage providers, equipment rental firms, and commercial suppliers across the RZ Chat network.
          </p>
        </div>

        <button
          onClick={onRegisterBusiness}
          className="px-4 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Register Business Profile
        </button>
      </div>

      {/* SEARCH BAR & CATEGORY PILLS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl font-mono space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by business name, handle @rzmining, services, or location..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* CATEGORIES HORIZONTAL SCROLL */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-[10px] text-slate-500 font-bold uppercase shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Sector:
          </span>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* BUSINESS CARDS GRID */}
      {paginatedResult.businesses.length === 0 ? (
        <div className="p-12 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-3 font-mono">
          <Building2 className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-bold text-slate-300">No commercial entities found.</p>
          <p className="text-xs text-slate-500">Try switching sector filters or register your business profile now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedResult.businesses.map(b => (
            <div
              key={b.id}
              onClick={() => onViewBusiness(b)}
              className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* COVER & LOGO */}
                <div className="h-28 relative bg-slate-800">
                  <img
                    src={b.coverImageUrl}
                    alt={b.businessName}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                  {/* VERIFIED BADGE OVERLAY */}
                  {b.verificationStatus === 'verified' && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 shadow-lg">
                      <BadgeCheck className="w-3.5 h-3.5" /> Verified
                    </span>
                  )}
                </div>

                <div className="p-5 relative -mt-8 space-y-3 font-mono">
                  <div className="flex justify-between items-end">
                    <img
                      src={b.logoUrl}
                      alt={b.businessName}
                      className="w-14 h-14 rounded-2xl object-cover border-3 border-slate-900 shadow-xl bg-slate-900"
                    />
                    <span className="px-2 py-0.5 bg-slate-950 text-slate-300 border border-slate-800 rounded-md text-[10px]">
                      {b.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition truncate">
                      {b.businessName}
                    </h3>
                    <p className="text-amber-400 font-bold text-xs">@{b.username}</p>
                  </div>

                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                    {b.description}
                  </p>

                  {/* SERVICES CHIPS */}
                  <div className="flex flex-wrap gap-1">
                    {b.services.slice(0, 3).map((s, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-slate-950 text-slate-400 text-[10px] rounded-lg border border-slate-800"
                      >
                        {s}
                      </span>
                    ))}
                    {b.services.length > 3 && (
                      <span className="px-2 py-0.5 bg-slate-950 text-slate-500 text-[10px] rounded-lg border border-slate-800">
                        +{b.services.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500/70 shrink-0" />
                    <span className="truncate">{b.location}</span>
                  </div>
                </div>
              </div>

              {/* CARD FOOTER */}
              <div className="p-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-2 font-mono" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => onViewBusiness(b)}
                  className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs transition cursor-pointer"
                >
                  View Profile
                </button>
                <button
                  onClick={() => onStartChatWithBusiness(b.id)}
                  className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md shadow-amber-500/10"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Message
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {paginatedResult.totalPages > 1 && (
        <div className="flex justify-between items-center bg-slate-900 border border-slate-800 rounded-2xl p-4 font-mono text-xs">
          <span className="text-slate-400">
            Page <strong className="text-amber-400">{page}</strong> of {paginatedResult.totalPages}
          </span>

          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded-xl transition cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <button
              disabled={page >= paginatedResult.totalPages}
              onClick={() => setPage(p => Math.min(paginatedResult.totalPages, p + 1))}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded-xl transition cursor-pointer flex items-center gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
