import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Grid,
  List,
  ShieldCheck,
  MapPin,
  Clock,
  DollarSign,
  Tag,
  Truck,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  MessageSquare,
  Sparkles,
  SlidersHorizontal,
  Bookmark,
  Plus
} from 'lucide-react';
import {
  MARKETPLACE_LISTINGS,
  MachineryListing,
  ListingCategory,
  EquipmentType,
  MachineCondition
} from '../../data/usedMachineryMarketplaceData';

interface MachineryBrowseViewProps {
  initialCategory?: ListingCategory | 'ALL';
  initialTypeFilter?: EquipmentType | 'ALL';
  onSelectList: (listing: MachineryListing) => void;
  onEnquireList: (listing: MachineryListing) => void;
  onOfferList: (listing: MachineryListing) => void;
  onOpenChat: (seller: string, listingCode: string) => void;
  onOpenListWizard: () => void;
  onToggleWatchlist: (listingId: string) => void;
  watchlistIds: string[];
}

export const MachineryBrowseView: React.FC<MachineryBrowseViewProps> = ({
  initialCategory = 'ALL',
  initialTypeFilter = 'ALL',
  onSelectList,
  onEnquireList,
  onOfferList,
  onOpenChat,
  onOpenListWizard,
  onToggleWatchlist,
  watchlistIds
}) => {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ListingCategory | 'ALL'>(initialCategory);
  const [selectedType, setSelectedType] = useState<string>(initialTypeFilter);
  const [selectedCondition, setSelectedCondition] = useState<string>('ALL');
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [selectedInspection, setSelectedInspection] = useState<string>('ALL');
  const [priceRange, setPriceRange] = useState<'ALL' | 'UNDER_30L' | '30L_50L' | 'ABOVE_50L'>('ALL');
  const [showOnlyVerifiedDocs, setShowOnlyVerifiedDocs] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Filtered Listings
  const filteredListings = useMemo(() => {
    return MARKETPLACE_LISTINGS.filter((item) => {
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          item.title.toLowerCase().includes(q) ||
          item.brand.toLowerCase().includes(q) ||
          item.model.toLowerCase().includes(q) ||
          item.listingCode.toLowerCase().includes(q) ||
          item.sellerName.toLowerCase().includes(q) ||
          item.locationCity.toLowerCase().includes(q) ||
          item.locationDistrict.toLowerCase().includes(q) ||
          (item.registrationNumber && item.registrationNumber.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      // Category filter
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }

      // Type filter
      if (selectedType !== 'ALL' && item.type !== selectedType) {
        return false;
      }

      // Condition filter
      if (selectedCondition !== 'ALL' && item.condition !== selectedCondition) {
        return false;
      }

      // State filter
      if (selectedState !== 'ALL' && item.locationState !== selectedState) {
        return false;
      }

      // Inspection filter
      if (selectedInspection !== 'ALL') {
        if (selectedInspection === 'INSPECTED' && (item.inspectionStatus === 'None' || item.inspectionStatus === 'Requested')) {
          return false;
        }
      }

      // Documents filter
      if (showOnlyVerifiedDocs && (!item.hasRcRegistration && !item.hasNocClearance)) {
        return false;
      }

      // Price filter
      if (priceRange === 'UNDER_30L' && item.askingPriceRs > 3000000) return false;
      if (priceRange === '30L_50L' && (item.askingPriceRs < 3000000 || item.askingPriceRs > 5000000)) return false;
      if (priceRange === 'ABOVE_50L' && item.askingPriceRs < 5000000) return false;

      return true;
    });
  }, [
    searchQuery,
    selectedCategory,
    selectedType,
    selectedCondition,
    selectedState,
    selectedInspection,
    showOnlyVerifiedDocs,
    priceRange
  ]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedType('ALL');
    setSelectedCondition('ALL');
    setSelectedState('ALL');
    setSelectedInspection('ALL');
    setPriceRange('ALL');
    setShowOnlyVerifiedDocs(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-white">Browse Heavy Machinery & Fleet</h1>
            <p className="text-xs text-slate-400">
              Showing {filteredListings.length} of {MARKETPLACE_LISTINGS.length} available equipment listings
            </p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Grid / List Switcher (Desktop) */}
            <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'grid' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'list' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              <span>Filters</span>
            </button>

            <button
              onClick={onOpenListWizard}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>List Item</span>
            </button>
          </div>
        </div>

        {/* Global Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search machines, vehicles, equipment by brand, model, registration, location, listing ID..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills (Functional Tabs) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'ALL', label: 'All Categories' },
            { id: 'Machinery', label: 'Heavy Machinery' },
            { id: 'Commercial Vehicles', label: 'Commercial Vehicles' },
            { id: 'Quarry / Crusher Equipment', label: 'Crusher Plants & Screens' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* EXPANDABLE ADVANCED FILTERS PANEL */}
      {isFilterDrawerOpen && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-black text-white uppercase tracking-wider">Advanced Marketplace Filters</h2>
            </div>
            <button
              onClick={clearAllFilters}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Condition */}
            <div>
              <label className="text-slate-400 font-medium block mb-1.5">Machine Condition</label>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="ALL">All Conditions</option>
                <option value="Excellent">Excellent (Ready for heavy work)</option>
                <option value="Good">Good (Minor cosmetic wear)</option>
                <option value="Fair">Fair (Operational)</option>
                <option value="Refurbished">Refurbished</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-slate-400 font-medium block mb-1.5">Price Range</label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="ALL">All Price Ranges</option>
                <option value="UNDER_30L">Under ₹30 Lakh</option>
                <option value="30L_50L">₹30 Lakh – ₹50 Lakh</option>
                <option value="ABOVE_50L">Above ₹50 Lakh</option>
              </select>
            </div>

            {/* Location State */}
            <div>
              <label className="text-slate-400 font-medium block mb-1.5">Location / State</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="ALL">All Mining Corridors</option>
                <option value="Kerala">Kerala (Kasaragod, Kannur, Wayanad)</option>
                <option value="Karnataka">Karnataka (Mangalore, Udupi, Hassan)</option>
              </select>
            </div>

            {/* Inspection Status */}
            <div>
              <label className="text-slate-400 font-medium block mb-1.5">Inspection Status</label>
              <select
                value={selectedInspection}
                onChange={(e) => setSelectedInspection(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="ALL">All Inspection States</option>
                <option value="INSPECTED">Surveyor Tested & Certified</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={showOnlyVerifiedDocs}
                onChange={(e) => setShowOnlyVerifiedDocs(e.target.checked)}
                className="rounded border-slate-700 text-amber-500 focus:ring-0"
              >
              </input>
              <span>Show only equipment with verified RC book / Clear RTO NOC</span>
            </label>
          </div>
        </div>
      )}

      {/* LISTINGS CONTAINER */}
      {filteredListings.length === 0 ? (
        /* 34. EMPTY STATE */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
            <Truck className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-white">No Machines Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No equipment matching your selected criteria. Try adjusting the search keyword or reset your filters.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
            >
              Clear All Filters
            </button>
            <button
              onClick={onOpenListWizard}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition cursor-pointer"
            >
              + List a Machine / Vehicle
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW (Desktop & Mobile) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredListings.map((item) => {
            const isSaved = watchlistIds.includes(item.id);
            return (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden transition flex flex-col justify-between group shadow-xl"
              >
                <div>
                  {/* Image & Badges */}
                  <div className="relative h-48 bg-slate-950 overflow-hidden">
                    <img
                      src={item.featuredImage}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />

                    {/* Top Status & Year */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-amber-400 border border-amber-500/30">
                        {item.year}
                      </span>
                      <span className="text-[10px] font-mono bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-slate-300 border border-slate-800">
                        {item.hoursWorked ? `${item.hoursWorked.toLocaleString()} Hrs` : `${item.odometerKm?.toLocaleString()} KM`}
                      </span>
                    </div>

                    {/* Watchlist Bookmark */}
                    <button
                      onClick={() => onToggleWatchlist(item.id)}
                      className={`absolute top-3 right-3 p-1.5 rounded-lg backdrop-blur-md transition cursor-pointer ${
                        isSaved ? 'bg-amber-500 text-slate-950' : 'bg-slate-950/70 text-slate-400 hover:text-white'
                      }`}
                      title={isSaved ? 'Remove from Watchlist' : 'Save to Watchlist'}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>

                    {/* Inspection Indicator */}
                    <div className="absolute bottom-3 left-3">
                      <span className="text-[10px] font-semibold bg-emerald-950/85 backdrop-blur-md text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>{item.inspectionStatus}</span>
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 text-[10px] font-mono bg-slate-950/80 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                      {item.listingCode}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span className="font-semibold text-slate-300">{item.brand}</span>
                      <span>·</span>
                      <span>{item.model}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {item.locationDistrict}, {item.locationState}
                      </span>
                    </div>

                    <h3
                      onClick={() => onSelectList(item)}
                      className="text-sm font-black text-white line-clamp-2 hover:text-amber-400 transition cursor-pointer"
                    >
                      {item.title}
                    </h3>

                    <div className="text-[11px] text-slate-400 line-clamp-1">
                      Engine: {item.enginePowerHp} · Weight: {item.operatingWeightTons}T
                    </div>

                    {/* Price Block */}
                    <div className="pt-2 flex items-baseline justify-between border-t border-slate-800">
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">Asking Price</div>
                        <div className="text-lg font-black text-white font-mono">
                          {item.priceType === 'Price on Request'
                            ? 'Price on Request'
                            : `₹${(item.askingPriceRs / 100000).toFixed(2)} Lakh`}
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {item.priceType}
                      </span>
                    </div>

                    {/* Seller Tag */}
                    <div className="text-[11px] text-slate-400 pt-1 flex items-center justify-between border-t border-slate-800/60">
                      <span>Seller: {item.sellerBusiness}</span>
                      <span className="text-amber-400 font-mono text-[10px]">★ {item.sellerRating}</span>
                    </div>
                  </div>
                </div>

                {/* 4 Core Clickable Actions */}
                <div className="p-3 bg-slate-950/70 border-t border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => onSelectList(item)}
                    className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer text-center"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => onEnquireList(item)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
                    title="Send Buyer Enquiry"
                  >
                    Enquire
                  </button>

                  <button
                    onClick={() => onOfferList(item)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold transition cursor-pointer"
                    title="Make Offer"
                  >
                    Offer
                  </button>

                  <button
                    onClick={() => onOpenChat(item.sellerName, item.listingCode)}
                    className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer"
                    title="RZ Chat"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="space-y-3">
          {filteredListings.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <img
                  src={item.featuredImage}
                  alt={item.title}
                  className="w-24 h-20 rounded-xl object-cover shrink-0 bg-slate-950"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="font-mono text-amber-400 font-bold">{item.year}</span>
                    <span>·</span>
                    <span>{item.brand} {item.model}</span>
                    <span>·</span>
                    <span>{item.locationDistrict}, {item.locationState}</span>
                  </div>
                  <h3
                    onClick={() => onSelectList(item)}
                    className="text-sm font-black text-white hover:text-amber-400 transition cursor-pointer"
                  >
                    {item.title}
                  </h3>
                  <div className="text-xs text-slate-400 flex items-center gap-3">
                    <span>Hours/KM: {item.hoursWorked || item.odometerKm}</span>
                    <span>·</span>
                    <span className="text-emerald-400 font-medium">{item.inspectionStatus}</span>
                    <span>·</span>
                    <span>Seller: {item.sellerBusiness}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                <div className="text-left md:text-right">
                  <div className="text-[10px] text-slate-500 uppercase">Asking Price</div>
                  <div className="text-base font-black text-white font-mono">
                    ₹{(item.askingPriceRs / 100000).toFixed(2)} Lakh
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => onSelectList(item)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onOfferList(item)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
                  >
                    Make Offer
                  </button>
                  <button
                    onClick={() => onOpenChat(item.sellerName, item.listingCode)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer"
                    title="Chat"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
