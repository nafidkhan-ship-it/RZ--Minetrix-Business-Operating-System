import React, { useState } from 'react';
import {
  Search,
  Layers,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Star,
  Truck,
  Sparkles,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Filter,
  FileText,
  MapPin,
  TrendingUp,
  Building2,
  PhoneCall
} from 'lucide-react';
import {
  COMMERCE_CATEGORIES,
  COMMERCE_PRODUCTS,
  COMMERCE_SUPPLIERS,
  CommerceCategory,
  CommerceProduct
} from '../../data/ecommerceStudioData';
import heroLateriteImg from '../../assets/images/hero_laterite_quarry_1790166404713.jpg';

interface EcommerceShopViewProps {
  onSelectProduct: (product: CommerceProduct) => void;
  onOrderLaterite: () => void;
  onNavigateSubpage: (subpageId: string) => void;
  onRequestQuoteForProduct?: (product: CommerceProduct) => void;
}

export const EcommerceShopView: React.FC<EcommerceShopViewProps> = ({
  onSelectProduct,
  onOrderLaterite,
  onNavigateSubpage,
  onRequestQuoteForProduct
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<'All' | 'Stone' | 'Building Materials'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter products
  const filteredProducts = COMMERCE_PRODUCTS.filter((prod) => {
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGroup = selectedGroup === 'All' || prod.group === selectedGroup;
    const matchesCategory = selectedCategory === 'All' || prod.category === selectedCategory;

    return matchesSearch && matchesGroup && matchesCategory;
  });

  const lateriteProducts = COMMERCE_PRODUCTS.filter(p => p.isLaterite);
  const buildingMaterialsProducts = COMMERCE_PRODUCTS.filter(p => !p.isLaterite);

  return (
    <div className="space-y-8">
      {/* 1. STOREFRONT HERO CAMPAIGN (1 bold focal point with direct route into collection) */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-950/80 via-slate-900 to-slate-950 p-6 sm:p-10 shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 opacity-25 lg:opacity-40 pointer-events-none">
          <img
            src={heroLateriteImg}
            alt="Laterite Stone Concession"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
              RZ® Direct Concession Marketplace
            </span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> 100% Certified Quarries
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-none">
            Direct Mill & Quarry Building Materials
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
            Source mature geological red laterite stone, VSI manufactured sand, 20mm granite aggregates, and fresh mill cement direct from verified producers with automated tipper dispatch.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOrderLaterite}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm flex items-center gap-2 shadow-xl shadow-amber-500/25 cursor-pointer transition transform hover:scale-[1.02]"
            >
              <Layers className="w-4 h-4" />
              <span>ORDER LATERITE STONE</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateSubpage('laterite-stone')}
              className="px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700 flex items-center gap-2 transition cursor-pointer"
            >
              <span>View Laterite Stone Catalogue</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-5 pt-3 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Weighbridge Certified Slip
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Government Transit Passes
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Integrated Fleet Logistics
            </span>
          </div>
        </div>
      </div>

      {/* 2. SEARCH & CATEGORY FILTER LAYER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name, code (e.g. LAT-STD, 20mm), stone finish, or grade..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-white text-xs placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Group Segmented Control */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs w-full md:w-auto">
            {(['All', 'Stone', 'Building Materials'] as const).map((group) => (
              <button
                key={group}
                onClick={() => {
                  setSelectedGroup(group);
                  setSelectedCategory('All');
                }}
                className={`flex-1 md:flex-none px-4 py-2 rounded-xl font-bold transition cursor-pointer ${
                  selectedGroup === group
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            All Categories ({COMMERCE_PRODUCTS.length})
          </button>
          {COMMERCE_CATEGORIES.filter(c => selectedGroup === 'All' || c.group === selectedGroup).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border cursor-pointer ${
                selectedCategory === cat.name
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat.name} ({cat.itemCount})
            </button>
          ))}
        </div>
      </div>

      {/* 3. RECENT ORDERS LIVE TICKER */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-2xl px-4 py-2.5 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500 font-bold">Recent Dispatches:</span>
        </div>
        <div className="overflow-hidden flex-1">
          <div className="text-slate-300 truncate font-mono text-[11px]">
            &bull; <strong className="text-white">Sobha Horizon</strong> booked 2,400 Standard Laterite Blocks (Kasaragod) &bull; <strong className="text-white">EcoVillas</strong> ordered 1,800 Wire-Cut Laterite Blocks (Kannur) &bull; <strong className="text-white">Prestige Habitat</strong> cleared 60 MT 20mm Aggregates (Mangalore)
          </div>
        </div>
        <button
          onClick={() => onNavigateSubpage('orders')}
          className="text-amber-400 hover:text-amber-300 text-xs font-bold whitespace-nowrap flex items-center gap-1 cursor-pointer"
        >
          <span>Track Live</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4. PRIORITY SECTION: LATERITE STONE (PRIORITY COMMERCIAL CATEGORY) */}
      {(selectedGroup === 'All' || selectedGroup === 'Stone') && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30 uppercase">
                  Featured Category &bull; Priority Commercial
                </span>
                <span className="text-xs text-slate-400 font-medium">Direct Ex-Quarry Supply</span>
              </div>
              <h2 className="text-xl font-black text-white mt-1">Laterite Stone Concession Products</h2>
            </div>
            <button
              onClick={() => onNavigateSubpage('laterite-stone')}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Laterite Catalogue (5 Specifications)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {lateriteProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-amber-500/50 transition duration-200 flex flex-col justify-between group shadow-lg"
              >
                <div>
                  {/* Lead with imagery */}
                  <div
                    onClick={() => onSelectProduct(prod)}
                    className="h-48 overflow-hidden bg-slate-950 relative cursor-pointer"
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-[10px] font-mono font-bold text-amber-400 border border-slate-800">
                      {prod.code}
                    </div>
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> In Stock
                    </div>
                  </div>

                  {/* Clean Metadata */}
                  <div className="p-5 space-y-2">
                    <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                      {prod.finish}
                    </div>
                    <h3
                      onClick={() => onSelectProduct(prod)}
                      className="text-base font-bold text-white group-hover:text-amber-400 transition cursor-pointer"
                    >
                      {prod.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{prod.description}</p>
                    <div className="pt-2 flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>{prod.dimensions}</span>
                      <span className="text-amber-300 font-semibold">{prod.rating} ★</span>
                    </div>
                  </div>
                </div>

                {/* Card Action / Price Row */}
                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-500 font-mono">BASE EX-QUARRY</div>
                      <div className="text-lg font-black text-amber-400 font-mono">
                        {prod.basePrice ? `₹${prod.basePrice}` : 'Price on Request'}
                        {prod.basePrice && <span className="text-[11px] text-slate-400 font-normal"> / {prod.unit}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectProduct(prod)}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition"
                      >
                        Details
                      </button>
                      <button
                        onClick={onOrderLaterite}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black cursor-pointer transition shadow-md shadow-amber-500/20"
                      >
                        ORDER NOW
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. GENERAL BUILDING MATERIALS & AGGREGATES */}
      {(selectedGroup === 'All' || selectedGroup === 'Building Materials') && (
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30 uppercase">
                  Aggregates, Sand, Cement & Steel
                </span>
                <span className="text-xs text-slate-400 font-medium">Direct Mill & Crusher Supply</span>
              </div>
              <h2 className="text-xl font-black text-white mt-1">Core Construction Materials</h2>
            </div>
            <button
              onClick={() => onNavigateSubpage('products')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All Products</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {buildingMaterialsProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-700 transition duration-200 flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div
                    onClick={() => onSelectProduct(prod)}
                    className="h-44 overflow-hidden bg-slate-950 relative cursor-pointer"
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-[10px] font-mono font-bold text-cyan-400 border border-slate-800">
                      {prod.code}
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                      {prod.category}
                    </div>
                    <h3
                      onClick={() => onSelectProduct(prod)}
                      className="text-base font-bold text-white group-hover:text-cyan-400 transition cursor-pointer"
                    >
                      {prod.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{prod.description}</p>
                    <div className="pt-2 flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>Min: {prod.minimumOrder} {prod.unit}s</span>
                      <span className="text-emerald-400 font-semibold">{prod.availableQuantity.toLocaleString()} in stock</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-500 font-mono">RATE PER {prod.unit.toUpperCase()}</div>
                      <div className="text-lg font-black text-white font-mono">
                        ₹{prod.basePrice?.toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectProduct(prod)}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => {
                          if (onRequestQuoteForProduct) {
                            onRequestQuoteForProduct(prod);
                          } else {
                            onSelectProduct(prod);
                          }
                        }}
                        className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black cursor-pointer transition"
                      >
                        GET QUOTE
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. VERIFIED SUPPLIER AVAILABILITY STRIP */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              Network Availability
            </span>
            <h3 className="text-lg font-black text-white mt-0.5">Active Concession Suppliers & Mills</h3>
          </div>
          <button
            onClick={() => onNavigateSubpage('suppliers')}
            className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>Supplier Directory</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {COMMERCE_SUPPLIERS.map((sup) => (
            <div
              key={sup.id}
              className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-amber-400 font-bold">{sup.id}</span>
                <span className="text-xs font-bold text-amber-300">{sup.rating} ★</span>
              </div>
              <h4 className="text-xs font-bold text-white truncate">{sup.name}</h4>
              <div className="text-[11px] text-slate-400 truncate">{sup.district}, {sup.state}</div>
              <div className="text-[11px] text-emerald-400 font-mono font-semibold pt-1">
                {sup.monthlyCapacity}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
