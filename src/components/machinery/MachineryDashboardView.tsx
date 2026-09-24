import React from 'react';
import {
  Truck,
  Building2,
  Wrench,
  DollarSign,
  TrendingUp,
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  Plus,
  BarChart3,
  Eye,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Clock,
  FileText,
  Package,
  Layers,
  Phone,
  MessageSquare
} from 'lucide-react';
import {
  MARKETPLACE_KPIS,
  MARKETPLACE_CATEGORIES,
  MARKETPLACE_LISTINGS,
  MARKETPLACE_DEALS,
  MachineryListing,
  MarketplaceDeal
} from '../../data/usedMachineryMarketplaceData';

interface MachineryDashboardViewProps {
  onNavigateSubpage: (subpageId: string) => void;
  onSelectList: (listing: MachineryListing) => void;
  onOpenListWizard: () => void;
  onOpenOttModal: (contextRef?: string) => void;
  onOpenChat: (seller: string, listingCode: string) => void;
}

export const MachineryDashboardView: React.FC<MachineryDashboardViewProps> = ({
  onNavigateSubpage,
  onSelectList,
  onOpenListWizard,
  onOpenOttModal,
  onOpenChat
}) => {
  return (
    <div className="space-y-6">
      {/* Studio Demo Banner Notice */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-slate-300">
          <span className="font-mono text-amber-400 font-bold uppercase tracking-wider">
            Studio Preview / Demo Data
          </span>
          <span className="text-slate-600">·</span>
          <span>Sample inventory based on Southern Mining Corridor operations (Kerala & Karnataka)</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 font-medium">
          <span>Physical verification conducted by certified surveyors</span>
        </div>
      </div>

      {/* PRIMARY MARKETPLACE HERO & SEARCH BAR */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              Heavy Equipment & Mining Fleet Exchange
            </span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-400">Escrow Protected Deals</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Used Machinery & Vehicle Marketplace
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Direct B2B exchange for hydraulic excavators, primary jaw crushers, screening plants, and 10-wheeler mining tippers with verifiable service history and 48-point technical inspection reports.
          </p>

          {/* Quick Search Launcher */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div
              onClick={() => onNavigateSubpage('browse')}
              className="flex-1 bg-slate-950/80 border border-slate-700/80 rounded-2xl px-4 py-3 text-slate-400 text-xs flex items-center justify-between cursor-pointer hover:border-amber-500/50 transition group"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition" />
                <span className="text-slate-400 group-hover:text-slate-200 transition">
                  Search machines, vehicles, equipment by brand, model, location...
                </span>
              </div>
              <span className="font-mono text-[10px] text-amber-400/80 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                Press to Browse
              </span>
            </div>

            <button
              onClick={onOpenListWizard}
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Sell Machine / Vehicle</span>
            </button>
          </div>

          {/* Primary Quick Category Direct Links */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span className="text-slate-500 text-[11px]">Quick Filters:</span>
            <button
              onClick={() => onNavigateSubpage('excavators')}
              className="hover:text-amber-400 transition cursor-pointer underline underline-offset-4 decoration-slate-700 hover:decoration-amber-400"
            >
              Excavators (20T–35T)
            </button>
            <span className="text-slate-600">·</span>
            <button
              onClick={() => onNavigateSubpage('tippers-trucks')}
              className="hover:text-amber-400 transition cursor-pointer underline underline-offset-4 decoration-slate-700 hover:decoration-amber-400"
            >
              Commercial Tippers (10 & 14-Wheeler)
            </button>
            <span className="text-slate-600">·</span>
            <button
              onClick={() => onNavigateSubpage('crusher-machines')}
              className="hover:text-amber-400 transition cursor-pointer underline underline-offset-4 decoration-slate-700 hover:decoration-amber-400"
            >
              Jaw & Cone Crushers
            </button>
            <span className="text-slate-600">·</span>
            <button
              onClick={() => onNavigateSubpage('other-equipment')}
              className="hover:text-amber-400 transition cursor-pointer underline underline-offset-4 decoration-slate-700 hover:decoration-amber-400"
            >
              Screening & Drill Rigs
            </button>
          </div>
        </div>
      </div>

      {/* MARKETPLACE DASHBOARD KPIS (All 12 Factual Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-slate-400 text-xs font-medium">Active Listings</div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {MARKETPLACE_KPIS.activeListings}
          </div>
          <div className="text-[11px] text-amber-400 mt-1">
            +{MARKETPLACE_KPIS.newListingsToday} Listed Today
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-slate-400 text-xs font-medium">Heavy Machinery</div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {MARKETPLACE_KPIS.machineryListings}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Excavators & Crushers</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-slate-400 text-xs font-medium">Commercial Fleet</div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {MARKETPLACE_KPIS.vehicleListings}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Tippers & Trailers</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-slate-400 text-xs font-medium">New Enquiries</div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">
            {MARKETPLACE_KPIS.newEnquiries}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Inquiry Pipeline</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-slate-400 text-xs font-medium">Active Deals</div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            {MARKETPLACE_KPIS.activeDeals}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">In Escrow / RTO</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-slate-400 text-xs font-medium">Marketplace Value</div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            ₹{(MARKETPLACE_KPIS.totalMarketplaceValueRs / 10000000).toFixed(1)} Cr
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Verified Portfolio</div>
        </div>
      </div>

      {/* ADDITIONAL OPERATIONAL PIPELINE METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => onNavigateSubpage('offers')}
          className="p-3.5 bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl cursor-pointer transition flex items-center justify-between"
        >
          <div>
            <div className="text-slate-400 text-xs font-medium">Offers Pending</div>
            <div className="text-lg font-black text-white font-mono mt-0.5">
              {MARKETPLACE_KPIS.offersPending} Negotiations
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600" />
        </div>

        <div
          onClick={() => onNavigateSubpage('inspections')}
          className="p-3.5 bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl cursor-pointer transition flex items-center justify-between"
        >
          <div>
            <div className="text-slate-400 text-xs font-medium">Pending Inspections</div>
            <div className="text-lg font-black text-amber-400 font-mono mt-0.5">
              {MARKETPLACE_KPIS.pendingInspections} Scheduled
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600" />
        </div>

        <div
          onClick={() => onNavigateSubpage('documents')}
          className="p-3.5 bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl cursor-pointer transition flex items-center justify-between"
        >
          <div>
            <div className="text-slate-400 text-xs font-medium">RTO Documents Pending</div>
            <div className="text-lg font-black text-white font-mono mt-0.5">
              {MARKETPLACE_KPIS.documentsPending} NOC / Transfers
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600" />
        </div>

        <div
          onClick={() => onNavigateSubpage('transfer-delivery')}
          className="p-3.5 bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl cursor-pointer transition flex items-center justify-between"
        >
          <div>
            <div className="text-slate-400 text-xs font-medium">Delivery / Transport</div>
            <div className="text-lg font-black text-white font-mono mt-0.5">
              {MARKETPLACE_KPIS.deliveryPending} Low-Bed Trailers
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600" />
        </div>
      </div>

      {/* 27. MARKETPLACE QUICK ACTION DOCK */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black text-white uppercase tracking-wider">
            Marketplace Operations Shortcuts
          </h2>
          <span className="text-xs text-slate-400">12 Quick Actions</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
          <button
            onClick={onOpenListWizard}
            className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-left transition group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <Plus className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white group-hover:text-amber-400 transition">List Machine</div>
            <div className="text-[10px] text-slate-400">Seller 8-step wizard</div>
          </button>

          <button
            onClick={onOpenListWizard}
            className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-left transition group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <Truck className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white group-hover:text-blue-400 transition">List Vehicle</div>
            <div className="text-[10px] text-slate-400">Tipper / truck listing</div>
          </button>

          <button
            onClick={() => onNavigateSubpage('buyer-enquiries')}
            className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-left transition group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition">Buyer Enquiry</div>
            <div className="text-[10px] text-slate-400">View buyer leads</div>
          </button>

          <button
            onClick={() => onNavigateSubpage('offers')}
            className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-left transition group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <DollarSign className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white group-hover:text-amber-400 transition">Make Offer</div>
            <div className="text-[10px] text-slate-400">Active counter-offers</div>
          </button>

          <button
            onClick={() => onNavigateSubpage('inspections')}
            className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-left transition group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white group-hover:text-purple-400 transition">Request Inspection</div>
            <div className="text-[10px] text-slate-400">48-point surveyor test</div>
          </button>

          <button
            onClick={() => onNavigateSubpage('deals')}
            className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-left transition group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition">Create Deal</div>
            <div className="text-[10px] text-slate-400">Escrow agreement</div>
          </button>

          <button
            onClick={() => onNavigateSubpage('payments')}
            className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-left transition group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <DollarSign className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white group-hover:text-amber-400 transition">Payment UI</div>
            <div className="text-[10px] text-slate-400">Escrow & advance</div>
          </button>

          <button
            onClick={() => onNavigateSubpage('transfer-delivery')}
            className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-left transition group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <Truck className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white group-hover:text-blue-400 transition">Transfer / Delivery</div>
            <div className="text-[10px] text-slate-400">Vehicle fleet link</div>
          </button>

          <button
            onClick={() => onNavigateSubpage('documents')}
            className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-left transition group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <FileText className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition">Documents</div>
            <div className="text-[10px] text-slate-400">RTO NOC & RC</div>
          </button>

          <button
            onClick={() => onOpenChat('Malabar Mining Desk', 'GENERAL-ENQ')}
            className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-left transition group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white group-hover:text-amber-400 transition">RZ Chat</div>
            <div className="text-[10px] text-slate-400">Live negotiation</div>
          </button>

          <button
            onClick={() => onOpenOttModal('MKT-TASK-GEN')}
            className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-left transition group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white group-hover:text-purple-400 transition">RZ OTT Task</div>
            <div className="text-[10px] text-slate-400">Create schedule task</div>
          </button>

          <button
            onClick={() => onNavigateSubpage('reports')}
            className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-left transition group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition">Reports</div>
            <div className="text-[10px] text-slate-400">Deal & inventory log</div>
          </button>
        </div>
      </div>

      {/* 3 PRIMARY CATEGORY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MARKETPLACE_CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            onClick={() => {
              if (cat.id === 'Machinery') onNavigateSubpage('machines');
              else if (cat.id === 'Commercial Vehicles') onNavigateSubpage('vehicles');
              else onNavigateSubpage('equipment');
            }}
            className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-3xl transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono text-slate-400">{cat.count} Live Listings</span>
                <span className="text-amber-400 font-bold group-hover:translate-x-1 transition flex items-center gap-1">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <h3 className="text-base font-black text-white group-hover:text-amber-400 transition">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {cat.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* FEATURED LIVE LISTINGS PREVIEW */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-black text-white">
              Featured Verified Machinery & Vehicles
            </h2>
            <p className="text-xs text-slate-400">
              Live equipment ready for immediate site inspection in Kerala and Karnataka
            </p>
          </div>
          <button
            onClick={() => onNavigateSubpage('browse')}
            className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>View All 68 Listings</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MARKETPLACE_LISTINGS.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition flex flex-col justify-between group"
            >
              <div>
                {/* Image Placeholder with real URL fallback */}
                <div className="relative h-44 bg-slate-900 overflow-hidden">
                  <img
                    src={item.featuredImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-amber-400 border border-amber-500/30">
                      {item.year}
                    </span>
                    <span className="text-[10px] font-mono bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-slate-300 border border-slate-800">
                      {item.hoursWorked ? `${item.hoursWorked.toLocaleString()} Hrs` : `${item.odometerKm?.toLocaleString()} KM`}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 right-2.5">
                    <span className="text-[10px] font-semibold bg-emerald-950/80 backdrop-blur-md text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      {item.inspectionStatus}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span>{item.brand}</span>
                    <span>·</span>
                    <span>{item.locationDistrict}, {item.locationState}</span>
                  </div>

                  <h3 className="text-sm font-black text-white line-clamp-1 group-hover:text-amber-400 transition">
                    {item.title}
                  </h3>

                  <div className="pt-2 flex items-baseline justify-between border-t border-slate-900">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">Asking Price</div>
                      <div className="text-base font-black text-white font-mono">
                        ₹{(item.askingPriceRs / 100000).toFixed(2)} Lakh
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {item.priceType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-3 bg-slate-900/60 border-t border-slate-900 flex items-center gap-2">
                <button
                  onClick={() => onSelectList(item)}
                  className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer text-center"
                >
                  View Details
                </button>
                <button
                  onClick={() => onOpenChat(item.sellerName, item.listingCode)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
                  title="Chat with Seller"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RECENT DEALS & ESCROW TRANSACTIONS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-base font-black text-white">Recent Marketplace Escrow Deals</h2>
            <p className="text-xs text-slate-400">
              Closed and active equipment transactions across quarry operators
            </p>
          </div>
          <button
            onClick={() => onNavigateSubpage('deals')}
            className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>All Deals</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5">
          {MARKETPLACE_DEALS.map((deal) => (
            <div
              key={deal.id}
              className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-amber-400 font-bold">{deal.dealCode}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">{deal.dealDate}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-emerald-400 font-semibold">{deal.status}</span>
                </div>
                <div className="font-bold text-white text-sm">{deal.listingTitle}</div>
                <div className="text-slate-400 flex items-center gap-2">
                  <span>Buyer: {deal.buyerCompany}</span>
                  <span>→</span>
                  <span>Seller: {deal.sellerCompany}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-2 md:pt-0 border-slate-900">
                <div className="text-right">
                  <div className="text-[10px] text-slate-500 uppercase">Agreed Deal Price</div>
                  <div className="text-sm font-black text-white font-mono">
                    ₹{(deal.agreedPriceRs / 100000).toFixed(2)} Lakh
                  </div>
                </div>

                <button
                  onClick={() => onNavigateSubpage('deals')}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer"
                >
                  View Dossier
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
