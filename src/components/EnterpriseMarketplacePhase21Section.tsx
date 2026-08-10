import React, { useState } from 'react';
import {
  Building2,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  MapPin,
  Phone,
  Star,
  ShieldCheck,
  TrendingUp,
  Tag,
  Truck,
  HardHat,
  Briefcase,
  Wrench,
  Compass,
  DollarSign,
  Send,
  ShoppingBag,
  FileText,
  Gavel,
  Award,
  Zap,
  UserCheck,
  Layers,
  ArrowUpRight,
  MessageSquare,
  ThumbsUp,
  Plus,
  BarChart3,
  CreditCard,
  Grid,
  Globe,
  Cpu,
  Smartphone,
  Network,
  Activity,
  Building,
  Users,
  Boxes,
  Radio,
  BadgeCheck,
  FileCheck,
  Landmark,
  PieChart,
  Bot
} from 'lucide-react';

import {
  MOCK_MARKETPLACE_DIRECTORY,
  MOCK_MINING_MARKETPLACE,
  MOCK_BUILDING_MATERIAL_MARKETPLACE,
  MOCK_FLEET_MARKETPLACE,
  MOCK_EQUIPMENT_MARKETPLACE,
  MOCK_USED_MACHINERY,
  MOCK_JOB_MARKETPLACE,
  MOCK_SERVICE_MARKETPLACE,
  MOCK_CONSTRUCTION_MARKETPLACE,
  MOCK_PUBLIC_BUY_SELL,
  MOCK_AI_MATCHING,
  MOCK_BUSINESS_FEED,
  MOCK_TENDERS,
  MOCK_AUCTIONS,
  MOCK_AD_CAMPAIGNS,
  MOCK_FINANCING_OFFERS,
  MOCK_MARKETPLACE_ANALYTICS,
  MOCK_VERIFIED_PARTNERS,
  MOCK_AI_MATCHMAKING_PAIRS,
  MOCK_BUSINESS_SOCIAL_FEED,
  MOCK_DIGITAL_RFQS,
  MOCK_FREIGHT_EXCHANGE_LOADS,
  MOCK_MINING_LAND_PROPERTIES,
  MOCK_INVESTMENT_OPPORTUNITIES,
  MOCK_FINANCE_MARKETPLACE_OFFERS,
  MOCK_PUBLIC_DIRECTORY_ENTRIES,
  MOCK_CONSTRUCTION_PROCUREMENT_BOQS,
  MOCK_USED_ASSETS,
  MOCK_RENTAL_MARKETPLACE_ITEMS,
  MOCK_AI_MARKET_INTELLIGENCE,
  MOCK_ECOSYSTEM_ANALYTICS_DATA,
  MOCK_SUPER_APP_STATUS,
  MOCK_GLOBAL_EXPANSION_ITEMS,
  MOCK_ENTERPRISE_APIS,
  MOCK_FUTURE_TECH_CAPABILITIES,
  DirectoryListing,
  MiningListing,
  BuildingMaterialListing,
  FleetMarketplaceListing,
  EquipmentMarketplaceListing,
  UsedMachineryListing,
  JobMarketplaceListing,
  ServiceMarketplaceListing,
  ConstructionMarketplaceListing,
  PublicBuySellAd,
  AIMatchingResult,
  DigitalBusinessPost,
  TenderNotice,
  DigitalAuctionListing,
  AdCampaign,
  FinancingOffer
} from '../data/enterpriseMarketplacePhase21Data';

export const EnterpriseMarketplacePhase21Section: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'mod1-directory'
    | 'mod2-mining'
    | 'mod3-materials'
    | 'mod4-fleet'
    | 'mod5-equipment'
    | 'mod6-usedmachinery'
    | 'mod7-jobs'
    | 'mod8-services'
    | 'mod9-construction'
    | 'mod10-buysell'
    | 'mod11-aimatching'
    | 'mod12-network'
    | 'mod13-tenders'
    | 'mod14-auctions'
    | 'mod15-ads'
    | 'mod16-financing'
    | 'mod17-customerexp'
    | 'mod18-payments'
    | 'mod19-analytics'
    | 'mod20-ecosystem'
    | 'mod31-verifiedpartners'
    | 'mod32-matchmaking'
    | 'mod33-social'
    | 'mod34-rfq'
    | 'mod35-freight'
    | 'mod36-land'
    | 'mod37-investment'
    | 'mod38-finance'
    | 'mod39-directory'
    | 'mod40-procurement'
    | 'mod41-usedassets'
    | 'mod42-rentals'
    | 'mod43-intelligence'
    | 'mod44-analytics'
    | 'mod45-superapp'
    | 'mod46-global'
    | 'mod47-api'
    | 'mod48-futuretech'
    | 'phase21-review'
  >('mod1-directory');

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-5 py-3 rounded-2xl font-bold shadow-2xl flex items-center gap-2 border border-emerald-300 animate-bounce text-xs">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/40 text-purple-300 font-extrabold rounded-full text-[10px] tracking-wider uppercase">
                Phase 21 Enterprise Suite
              </span>
              <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold rounded-full text-[10px]">
                38 Digital Ecosystem Modules Complete
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
              Enterprise Marketplace, Business Network &amp; Digital Ecosystem
            </h1>
            <p className="text-slate-400 text-xs mt-1 max-w-3xl">
              India&apos;s largest unified B2B digital ecosystem connecting Mining, Quarries, Crusher Units, Building Materials, Fleet, Heavy Equipment, Civil Contractors, Jobs, Services, Financing, Tenders, Land Exchange, Investment, Super App, Global Expansion &amp; Future Tech.
            </p>
          </div>

          <button
            onClick={() => showToast('AI Marketplace matching algorithm triggered for all active requirements!')}
            className="px-5 py-2.5 bg-purple-500 hover:bg-purple-400 text-slate-950 font-black rounded-2xl shadow-lg transition-all text-xs flex items-center gap-2 self-start md:self-center"
          >
            <Sparkles className="w-4 h-4" /> Run AI Matchmaking
          </button>
        </div>

        {/* Global Key Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-4 border-t border-slate-800/80 text-xs">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl">
            <span className="text-slate-400 text-[10px] block">Verified Businesses</span>
            <strong className="text-purple-300 text-sm font-black">{MOCK_MARKETPLACE_ANALYTICS.activeBusinessesCount}+</strong>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl">
            <span className="text-slate-400 text-[10px] block">Active Listings</span>
            <strong className="text-emerald-400 text-sm font-black">{MOCK_MARKETPLACE_ANALYTICS.totalListingsCount}</strong>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl">
            <span className="text-slate-400 text-[10px] block">Monthly GMV</span>
            <strong className="text-amber-300 text-sm font-black">₹{(MOCK_MARKETPLACE_ANALYTICS.monthlyGmvRs / 10000000).toFixed(2)} Cr</strong>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl">
            <span className="text-slate-400 text-[10px] block">AI Matches This Month</span>
            <strong className="text-blue-400 text-sm font-black">{MOCK_MARKETPLACE_ANALYTICS.successfulMatchesThisMonth}</strong>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl">
            <span className="text-slate-400 text-[10px] block">Live Tenders</span>
            <strong className="text-cyan-300 text-sm font-black">{MOCK_MARKETPLACE_ANALYTICS.activeTendersCount}</strong>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl">
            <span className="text-slate-400 text-[10px] block">Financing Sanctioned</span>
            <strong className="text-emerald-300 text-sm font-black">₹{(MOCK_MARKETPLACE_ANALYTICS.financingSanctionedRs / 10000000).toFixed(2)} Cr</strong>
          </div>
        </div>
      </div>

      {/* Module Navigation Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'mod1-directory', label: '1. Directory', icon: Building2 },
          { id: 'mod2-mining', label: '2. Mining Marketplace', icon: Compass },
          { id: 'mod3-materials', label: '3. Materials Marketplace', icon: Tag },
          { id: 'mod4-fleet', label: '4. Fleet Marketplace', icon: Truck },
          { id: 'mod5-equipment', label: '5. Equipment Marketplace', icon: HardHat },
          { id: 'mod6-usedmachinery', label: '6. Used Machinery', icon: Wrench },
          { id: 'mod7-jobs', label: '7. Job Marketplace', icon: Briefcase },
          { id: 'mod8-services', label: '8. Service Marketplace', icon: UserCheck },
          { id: 'mod9-construction', label: '9. Construction', icon: ShieldCheck },
          { id: 'mod10-buysell', label: '10. Public Buy & Sell', icon: ShoppingBag },
          { id: 'mod11-aimatching', label: '11. AI Matchmaker', icon: Sparkles },
          { id: 'mod12-network', label: '12. Business Network', icon: MessageSquare },
          { id: 'mod13-tenders', label: '13. Tender Platform', icon: FileText },
          { id: 'mod14-auctions', label: '14. Digital Auctions', icon: Gavel },
          { id: 'mod15-ads', label: '15. Advertisements', icon: Zap },
          { id: 'mod16-financing', label: '16. Business Financing', icon: DollarSign },
          { id: 'mod17-customerexp', label: '17. Customer CX', icon: Search },
          { id: 'mod18-payments', label: '18. Payment Gateway', icon: CreditCard },
          { id: 'mod19-analytics', label: '19. Marketplace Analytics', icon: BarChart3 },
          { id: 'mod20-ecosystem', label: '20. Ecosystem Bridges', icon: Layers },
          { id: 'mod31-verifiedpartners', label: '31. Verified Partners', icon: BadgeCheck },
          { id: 'mod32-matchmaking', label: '32. AI Matchmaking', icon: Sparkles },
          { id: 'mod33-social', label: '33. Social Network', icon: Network },
          { id: 'mod34-rfq', label: '34. RFQ Exchange', icon: FileCheck },
          { id: 'mod35-freight', label: '35. Freight Exchange', icon: Truck },
          { id: 'mod36-land', label: '36. Land Exchange', icon: Compass },
          { id: 'mod37-investment', label: '37. Investment Platform', icon: TrendingUp },
          { id: 'mod38-finance', label: '38. Finance Marketplace', icon: Landmark },
          { id: 'mod39-directory', label: '39. Public Directory', icon: Building2 },
          { id: 'mod40-procurement', label: '40. Construction Procurement', icon: Boxes },
          { id: 'mod41-usedassets', label: '41. Used Asset Marketplace', icon: Wrench },
          { id: 'mod42-rentals', label: '42. Rental Marketplace', icon: Activity },
          { id: 'mod43-intelligence', label: '43. AI Market Intelligence', icon: PieChart },
          { id: 'mod44-analytics', label: '44. Ecosystem Analytics', icon: BarChart3 },
          { id: 'mod45-superapp', label: '45. Super App', icon: Smartphone },
          { id: 'mod46-global', label: '46. Global Expansion', icon: Globe },
          { id: 'mod47-api', label: '47. API Marketplace', icon: Cpu },
          { id: 'mod48-futuretech', label: '48. Future Tech', icon: Bot },
          { id: 'phase21-review', label: 'Audit & Phase 21 Review', icon: Award }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-purple-500 text-slate-950 font-black shadow-lg scale-105'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* MODULE 1: BUSINESS DIRECTORY */}
      {activeTab === 'mod1-directory' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 1</span>
              <h2 className="text-xl font-bold text-white mt-1">Verified Pan-India Enterprise Business Directory</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search businesses, quarries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
                />
              </div>
              <button onClick={() => showToast('New business verification application opened!')} className="px-3.5 py-2 bg-purple-500 text-slate-950 font-bold rounded-xl flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> Register Business
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_MARKETPLACE_DIRECTORY.map((dir) => (
              <div key={dir.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 hover:border-purple-500/50 transition-all">
                <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-purple-400 font-bold">{dir.code}</span>
                    <h3 className="text-sm font-bold text-white mt-0.5">{dir.businessName}</h3>
                    <span className="text-slate-400 text-[11px] block flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" /> {dir.location}
                    </span>
                  </div>
                  {dir.isVerified && (
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-extrabold rounded-full text-[10px] flex items-center gap-1 border border-emerald-500/40">
                      <ShieldCheck className="w-3 h-3" /> VERIFIED
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Category: <strong className="text-slate-200">{dir.category}</strong></span>
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {dir.rating} ({dir.reviewCount} Reviews)
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {dir.badges.map((b, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-900 text-slate-300 rounded text-[9px] border border-slate-800">
                      {b}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400 text-[11px] flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-purple-400" /> {dir.phone}
                  </span>
                  <button onClick={() => showToast(`Inquiry sent to ${dir.businessName}!`)} className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold rounded-lg border border-purple-500/40 text-[11px]">
                    Contact Business
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 2: MINING MARKETPLACE */}
      {activeTab === 'mod2-mining' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 2</span>
              <h2 className="text-xl font-bold text-white mt-1">Mining Land, Quarry Leases &amp; Joint Ventures</h2>
            </div>
            <button onClick={() => showToast('New Quarry Lease Listing Wizard Launched!')} className="px-3.5 py-2 bg-purple-500 text-slate-950 font-bold rounded-xl flex items-center gap-2">
              <Plus className="w-4 h-4" /> List Mining Property
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_MINING_MARKETPLACE.map((m) => (
              <div key={m.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-purple-400 font-bold">{m.listingNo} • {m.quarryType}</span>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">
                    {m.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white">{m.title}</h3>
                <p className="text-slate-400 text-[11px] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" /> Location: {m.location}
                </p>

                <div className="grid grid-cols-2 gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-400 block">Area &amp; Reserves</span>
                    <strong className="text-white">{m.areaAcres} Acres ({m.estimatedReserveTons.toLocaleString()} Tons)</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Partnership Type</span>
                    <strong className="text-purple-300">{m.type}</strong>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-400 text-[11px]">Valuation: <strong className="text-amber-300 text-sm">₹{(m.askingPriceRs / 100000).toFixed(2)} Lakhs</strong></span>
                  <button onClick={() => showToast(`Non-Disclosure Agreement (NDA) generated for ${m.listingNo}!`)} className="px-3.5 py-1.5 bg-purple-500 text-slate-950 font-bold rounded-xl text-[11px]">
                    Request Pitch Deck &amp; NDA
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 3: BUILDING MATERIAL MARKETPLACE */}
      {activeTab === 'mod3-materials' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 3</span>
              <h2 className="text-xl font-bold text-white mt-1">Direct Quarry &amp; Wholesale Material Marketplace</h2>
            </div>
            <button onClick={() => showToast('Bulk Material BOQ Import Utility Active!')} className="px-3.5 py-2 bg-purple-500 text-slate-950 font-bold rounded-xl flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" /> Bulk Purchase Order
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_BUILDING_MATERIAL_MARKETPLACE.map((mat) => (
              <div key={mat.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-purple-400 font-bold">{mat.itemCode}</span>
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {mat.rating}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white">{mat.title}</h4>
                <p className="text-slate-400 text-[11px]">Vendor: {mat.vendorName} ({mat.location})</p>

                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Direct Price:</span>
                    <strong className="text-emerald-400 text-sm">₹{mat.pricePerUnitRs} / {mat.unit}</strong>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500">Min Order Qty: {mat.minOrderQty} {mat.unit}</span>
                    <span className="text-purple-300">Stock: {mat.inStockQty.toLocaleString()} {mat.unit}</span>
                  </div>
                </div>

                <button onClick={() => showToast(`Added ${mat.title} to Instant Bulk Order Cart!`)} className="w-full py-2 bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold rounded-xl transition-all">
                  Order Direct From Quarry
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 4: FLEET MARKETPLACE */}
      {activeTab === 'mod4-fleet' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 4</span>
            <h2 className="text-xl font-bold text-white mt-1">Tipper Fleet, Truck Rental &amp; Load Exchange</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_FLEET_MARKETPLACE.map((flt) => (
              <div key={flt.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-purple-400 font-bold">{flt.vehicleCode}</span>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">{flt.status}</span>
                </div>

                <h4 className="text-sm font-bold text-white">{flt.vehicleType} ({flt.capacityTons} Ton Pay Load)</h4>
                <p className="text-slate-400 text-[11px]">Owner: {flt.ownerName} • Hub: {flt.baseLocation}</p>

                <div className="grid grid-cols-3 gap-2 bg-slate-900 p-3 rounded-xl text-center border border-slate-800">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Per Trip</span>
                    <strong className="text-emerald-400">₹{flt.ratePerTripRs}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Per Km</span>
                    <strong className="text-amber-300">₹{flt.ratePerKmRs}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Monthly Contract</span>
                    <strong className="text-purple-300">₹{(flt.monthlyRentalRs / 1000).toFixed(0)}k</strong>
                  </div>
                </div>

                <button onClick={() => showToast(`Dispatch agreement initiated for ${flt.vehicleCode}!`)} className="w-full py-2 bg-purple-500 text-slate-950 font-bold rounded-xl">
                  Book Tipper Fleet Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 5: HEAVY EQUIPMENT MARKETPLACE */}
      {activeTab === 'mod5-equipment' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 5</span>
            <h2 className="text-xl font-bold text-white mt-1">Heavy Mining Equipment Rental &amp; Operator Exchange</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_EQUIPMENT_MARKETPLACE.map((eq) => (
              <div key={eq.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-purple-400 font-bold">{eq.equipmentCode}</span>
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 font-bold rounded-full text-[10px]">{eq.condition}</span>
                </div>

                <h4 className="text-sm font-bold text-white">{eq.equipmentType}</h4>
                <p className="text-slate-400 text-[11px]">Owner: {eq.ownerName} • Base: {eq.baseLocation}</p>

                <div className="grid grid-cols-2 gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-400 block">Hourly Hiring Rate</span>
                    <strong className="text-emerald-400 text-sm">₹{eq.hourlyRateRs} / Hour</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Monthly Rate</span>
                    <strong className="text-amber-300 text-sm">₹{eq.monthlyRentalRs.toLocaleString()} / Month</strong>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-400 text-[11px]">{eq.operatorProvided ? '✓ Certified Operator Included' : 'Fuel/Operator Extra'}</span>
                  <button onClick={() => showToast(`Equipment hiring proposal dispatched for ${eq.equipmentCode}!`)} className="px-4 py-1.5 bg-purple-500 text-slate-950 font-bold rounded-xl">
                    Hire Equipment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 6: USED MACHINERY MARKETPLACE */}
      {activeTab === 'mod6-usedmachinery' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 6</span>
              <h2 className="text-xl font-bold text-white mt-1">Pre-Owned Machinery, Valuations &amp; Verified Sales</h2>
            </div>
            <button onClick={() => showToast('Machinery Inspection & Valuation Team Dispatched!')} className="px-3.5 py-2 bg-purple-500 text-slate-950 font-bold rounded-xl flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Request Valuation
            </button>
          </div>

          {MOCK_USED_MACHINERY.map((um) => (
            <div key={um.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-purple-400 font-bold">{um.machineryCode}</span>
                  {um.inspectionVerified && (
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-500/40">
                      ✓ RZ CERTIFIED INSPECTED
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-white">{um.title}</h4>
                <p className="text-slate-400 text-[11px]">Seller: {um.sellerName} • Location: {um.location} • Runtime: {um.hoursOrKmRun}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] block">Valuation / Asking</span>
                  <strong className="text-emerald-400 text-base">₹{(um.askingPriceRs / 100000).toFixed(2)} Lakhs</strong>
                </div>
                <button onClick={() => showToast(`Buyer offer logged for ${um.machineryCode}!`)} className="px-4 py-2 bg-purple-500 text-slate-950 font-bold rounded-xl">
                  Make Buyer Offer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODULE 7: JOB MARKETPLACE */}
      {activeTab === 'mod7-jobs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 7</span>
              <h2 className="text-xl font-bold text-white mt-1">Mining, Quarry &amp; Construction Skilled Job Portal</h2>
            </div>
            <button onClick={() => showToast('Job posting wizard opened!')} className="px-3.5 py-2 bg-purple-500 text-slate-950 font-bold rounded-xl flex items-center gap-2">
              <Plus className="w-4 h-4" /> Post New Job
            </button>
          </div>

          {MOCK_JOB_MARKETPLACE.map((job) => (
            <div key={job.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <span className="text-purple-400 font-bold">{job.jobCode} • {job.companyName}</span>
                <h4 className="text-sm font-bold text-white">{job.title}</h4>
                <p className="text-slate-400 text-[11px]">Location: {job.location} • Salary: <strong className="text-emerald-400">{job.salaryRangeRs}</strong></p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-slate-400 text-[11px]">{job.applicantsCount} Applicants</span>
                <button onClick={() => showToast(`Job Application submitted for ${job.title}!`)} className="px-4 py-2 bg-purple-500 text-slate-950 font-bold rounded-xl">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODULE 8: SERVICE MARKETPLACE */}
      {activeTab === 'mod8-services' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 8</span>
            <h2 className="text-xl font-bold text-white mt-1">On-Demand Heavy Mechanics, Hydraulics &amp; Spares</h2>
          </div>

          {MOCK_SERVICE_MARKETPLACE.map((svc) => (
            <div key={svc.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <span className="text-purple-400 font-bold">{svc.serviceCode} • {svc.category}</span>
                <h4 className="text-sm font-bold text-white">{svc.title}</h4>
                <p className="text-slate-400 text-[11px]">Provider: {svc.providerName} • Location: {svc.location} • Avg Response: <strong className="text-amber-300">{svc.responseMinutes} mins</strong></p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-emerald-400 font-bold text-sm">₹{svc.hourlyRateRs} / Hr</span>
                <button onClick={() => showToast(`Emergency breakdown service dispatched for ${svc.title}!`)} className="px-4 py-2 bg-rose-500 text-slate-950 font-bold rounded-xl flex items-center gap-1.5">
                  <Zap className="w-4 h-4" /> Dispatch Emergency Tech
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODULE 9: CONSTRUCTION MARKETPLACE */}
      {activeTab === 'mod9-construction' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 9</span>
            <h2 className="text-xl font-bold text-white mt-1">Civil Contractors, Architects &amp; Turnkey Builders</h2>
          </div>

          {MOCK_CONSTRUCTION_MARKETPLACE.map((c) => (
            <div key={c.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <span className="text-purple-400 font-bold">{c.projectCode} • {c.category}</span>
                <h4 className="text-sm font-bold text-white">{c.title}</h4>
                <p className="text-slate-400 text-[11px]">Contractor: {c.contractorName} • Experience: {c.experienceYears} Years ({c.verifiedProjectsCount} Projects Completed)</p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-emerald-400 font-bold">₹{c.estimatedCostPerSqFtRs} / Sq.Ft</span>
                <button onClick={() => showToast(`BOQ Consultation booked with ${c.contractorName}!`)} className="px-4 py-2 bg-purple-500 text-slate-950 font-bold rounded-xl">
                  Book BOQ Consultation
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODULE 10: PUBLIC BUY & SELL */}
      {activeTab === 'mod10-buysell' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 10</span>
              <h2 className="text-xl font-bold text-white mt-1">Public Classifieds, Material Buy &amp; Sell Ads</h2>
            </div>
            <button onClick={() => showToast('Ad posting portal launched!')} className="px-3.5 py-2 bg-purple-500 text-slate-950 font-bold rounded-xl flex items-center gap-2">
              <Plus className="w-4 h-4" /> Post Free Classified
            </button>
          </div>

          {MOCK_PUBLIC_BUY_SELL.map((ad) => (
            <div key={ad.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <span className="text-purple-400 font-bold">{ad.adNo} • {ad.category}</span>
                <h4 className="text-sm font-bold text-white">{ad.title}</h4>
                <p className="text-slate-300 text-[11px]">{ad.description}</p>
                <p className="text-slate-500 text-[10px]">Posted By: {ad.postedBy} ({ad.phone}) • Views: {ad.viewsCount}</p>
              </div>

              <div className="flex items-center gap-4">
                <strong className="text-emerald-400 text-sm">₹{ad.priceRs.toLocaleString()}</strong>
                <button onClick={() => showToast(`Contact details unmasked for ${ad.postedBy}!`)} className="px-4 py-2 bg-purple-500 text-slate-950 font-bold rounded-xl">
                  Call Seller
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODULE 11: AI MATCHING ENGINE */}
      {activeTab === 'mod11-aimatching' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 11</span>
            <h2 className="text-xl font-bold text-white mt-1">Gemini AI Multi-Parameter Matchmaking Engine</h2>
          </div>

          {MOCK_AI_MATCHING.map((match) => (
            <div key={match.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-purple-400 font-bold">{match.buyerName}</span>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">
                  {match.matchScorePercent}% AI MATCH SCORE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-slate-400 block">Requirement</span>
                  <strong className="text-white">{match.requirement}</strong>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-slate-400 block">AI Recommended Supplier</span>
                  <strong className="text-purple-300">{match.matchedSupplier}</strong>
                </div>
              </div>

              <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-xl space-y-1">
                <span className="text-purple-300 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> AI Algorithmic Reasoning:
                </span>
                <p className="text-slate-300 text-[11px]">{match.aiReasoning}</p>
                <span className="text-emerald-400 font-bold text-[11px] block mt-1">Estimated Freight Cost Savings: ₹{match.estimatedFreightSavingsRs.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODULE 12: DIGITAL BUSINESS NETWORK */}
      {activeTab === 'mod12-network' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 12</span>
              <h2 className="text-xl font-bold text-white mt-1">B2B Professional Social Network &amp; Partnership Feed</h2>
            </div>
            <button onClick={() => showToast('New partnership post created!')} className="px-3.5 py-2 bg-purple-500 text-slate-950 font-bold rounded-xl flex items-center gap-2">
              <Plus className="w-4 h-4" /> Share Partnership Need
            </button>
          </div>

          {MOCK_BUSINESS_FEED.map((post) => (
            <div key={post.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <div>
                  <h4 className="text-sm font-bold text-white">{post.authorName}</h4>
                  <span className="text-purple-400 text-[10px]">{post.authorCompany} • {post.date}</span>
                </div>
                <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-300 font-bold rounded-full text-[10px]">
                  {post.partnershipType}
                </span>
              </div>

              <p className="text-slate-200 text-[11px] leading-relaxed">{post.content}</p>

              <div className="flex items-center gap-6 pt-2 border-t border-slate-800 text-slate-400 text-[11px]">
                <button onClick={() => showToast('Liked post!')} className="flex items-center gap-1 hover:text-purple-400">
                  <ThumbsUp className="w-3.5 h-3.5" /> {post.likesCount}
                </button>
                <button onClick={() => showToast('Comment thread opened!')} className="flex items-center gap-1 hover:text-purple-400">
                  <MessageSquare className="w-3.5 h-3.5" /> {post.commentsCount} Comments
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODULE 13: TENDER PLATFORM */}
      {activeTab === 'mod13-tenders' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 13</span>
            <h2 className="text-xl font-bold text-white mt-1">Government &amp; Private Material Supply Tenders</h2>
          </div>

          {MOCK_TENDERS.map((t) => (
            <div key={t.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-purple-400 font-bold">{t.tenderNo} • {t.category}</span>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">{t.status}</span>
              </div>

              <h4 className="text-sm font-bold text-white">{t.title}</h4>
              <p className="text-slate-400 text-[11px]">Issuer: {t.issuerName} • Due Date: <strong className="text-rose-300">{t.dueDate}</strong></p>

              <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                <span className="text-slate-400">Est Value: <strong className="text-emerald-400 text-sm">₹{(t.estimatedValueRs / 10000000).toFixed(2)} Cr</strong></span>
                <button onClick={() => showToast(`Tender bidding document kit downloaded for ${t.tenderNo}!`)} className="px-4 py-1.5 bg-purple-500 text-slate-950 font-bold rounded-xl">
                  Submit Tender Bid ({t.bidsSubmittedCount} Bids)
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODULE 14: DIGITAL AUCTION */}
      {activeTab === 'mod14-auctions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 14</span>
            <h2 className="text-xl font-bold text-white mt-1">Live Machinery, Vehicle &amp; Material Digital Auctions</h2>
          </div>

          {MOCK_AUCTIONS.map((auc) => (
            <div key={auc.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-purple-400 font-bold">{auc.auctionNo}</span>
                <span className="px-3 py-1 bg-rose-500/20 text-rose-300 font-bold rounded-full text-[10px] animate-pulse">
                  ● LIVE AUCTION ({auc.timeRemaining})
                </span>
              </div>

              <h4 className="text-sm font-bold text-white">{auc.itemTitle}</h4>

              <div className="grid grid-cols-2 gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-400 block">Starting Bid</span>
                  <strong className="text-slate-300">₹{(auc.startingBidRs / 100000).toFixed(2)} Lakhs</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Current Highest Bid</span>
                  <strong className="text-emerald-400 text-sm">₹{(auc.currentHighBidRs / 100000).toFixed(2)} Lakhs ({auc.totalBidsCount} Bids)</strong>
                </div>
              </div>

              <button onClick={() => showToast(`Bid incremented by ₹50,000 on ${auc.auctionNo}!`)} className="w-full py-2 bg-purple-500 text-slate-950 font-bold rounded-xl">
                Place Higher Bid (+₹50,000)
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MODULE 15: ADVERTISEMENT PLATFORM */}
      {activeTab === 'mod15-ads' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 15</span>
            <h2 className="text-xl font-bold text-white mt-1">Sponsored Ads &amp; Premium Quarry Listings</h2>
          </div>

          {MOCK_AD_CAMPAIGNS.map((ad) => (
            <div key={ad.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <span className="text-purple-400 font-bold">{ad.bannerType} • Sponsor: {ad.sponsorName}</span>
                <h4 className="text-sm font-bold text-white">{ad.campaignTitle}</h4>
                <p className="text-slate-400 text-[11px]">Impressions: {ad.impressionsCount.toLocaleString()} • Clicks: {ad.clicksCount.toLocaleString()}</p>
              </div>

              <button onClick={() => showToast(`Ad Campaign performance report generated!`)} className="px-4 py-2 bg-purple-500 text-slate-950 font-bold rounded-xl">
                Manage Ad Spot
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MODULE 16: BUSINESS FINANCING */}
      {activeTab === 'mod16-financing' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 16</span>
            <h2 className="text-xl font-bold text-white mt-1">Equipment, Fleet &amp; Working Capital Loan Marketplace</h2>
          </div>

          {MOCK_FINANCING_OFFERS.map((fin) => (
            <div key={fin.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-purple-400 font-bold">{fin.offerCode} • {fin.loanType}</span>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">
                  {fin.approvalTimeHours} Hour Instant Sanction
                </span>
              </div>

              <h4 className="text-sm font-bold text-white">{fin.partnerName}</h4>

              <div className="grid grid-cols-3 gap-3 bg-slate-900 p-3 rounded-xl text-center border border-slate-800">
                <div>
                  <span className="text-slate-400 text-[10px] block">Max Sanction</span>
                  <strong className="text-emerald-400 text-sm">₹{(fin.maxSanctionRs / 10000000).toFixed(2)} Cr</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Interest Rate</span>
                  <strong className="text-amber-300 text-sm">{fin.interestRatePercent}% p.a.</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Tenure</span>
                  <strong className="text-purple-300 text-sm">{fin.tenureMonths} Months</strong>
                </div>
              </div>

              <button onClick={() => showToast(`1-Click Loan eligibility check executed!`)} className="w-full py-2 bg-purple-500 text-slate-950 font-bold rounded-xl">
                Check Instant Loan Eligibility
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MODULE 17: CUSTOMER EXPERIENCE */}
      {activeTab === 'mod17-customerexp' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 17</span>
            <h2 className="text-xl font-bold text-white mt-1">Multi-Channel Search, Filters, Voice Search &amp; AI Assistance</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <span className="text-purple-400 font-bold block">Voice Search Assistant</span>
              <p className="text-slate-300 text-[11px]">Kannada, Tulu &amp; Hindi speech-to-search active for quarry operators.</p>
            </div>
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <span className="text-emerald-400 font-bold block">Smart Product Matrix</span>
              <p className="text-slate-300 text-[11px]">Compare 20mm vs 40mm aggregate specifications with 1-click BOQ match.</p>
            </div>
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <span className="text-amber-300 font-bold block">Live WhatsApp AI Assistant</span>
              <p className="text-slate-300 text-[11px]">Instant price quotes and fleet booking via WhatsApp chatbot.</p>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 18: PAYMENT PLATFORM */}
      {activeTab === 'mod18-payments' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 18</span>
            <h2 className="text-xl font-bold text-white mt-1">Escrow Ready B2B Multi-Mode Payment Gateway</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <span className="text-slate-400 text-[10px]">Escrow Protection</span>
              <strong className="text-emerald-400 text-sm block">ACTIVE</strong>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <span className="text-slate-400 text-[10px]">UPI &amp; QR Payments</span>
              <strong className="text-purple-300 text-sm block">INSTANT</strong>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <span className="text-slate-400 text-[10px]">NEFT / RTGS Automation</span>
              <strong className="text-amber-300 text-sm block">AUTO-MATCHED</strong>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <span className="text-slate-400 text-[10px]">Digital Wallet</span>
              <strong className="text-cyan-300 text-sm block">₹4.82 Lakhs Balance</strong>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 19: MARKETPLACE ANALYTICS */}
      {activeTab === 'mod19-analytics' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 19</span>
            <h2 className="text-xl font-bold text-white mt-1">Marketplace Executive BI &amp; Demand Radar</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <span className="text-purple-400 font-bold block">Top In-Demand Material</span>
              <p className="text-slate-200 text-[11px]">Washed M-Sand &amp; Laterite Stone blocks account for 68% of search volume.</p>
            </div>
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <span className="text-emerald-400 font-bold block">Avg Order Fulfillment Time</span>
              <p className="text-slate-200 text-[11px]">42 Minutes from order placement to tipper dispatch at quarry gate.</p>
            </div>
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <span className="text-amber-300 font-bold block">Regional Growth Leader</span>
              <p className="text-slate-200 text-[11px]">Udupi-Manipal corridor shows +34% MoM demand spike in aggregates.</p>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 20: ECOSYSTEM INTEGRATION */}
      {activeTab === 'mod20-ecosystem' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 20</span>
            <h2 className="text-xl font-bold text-white mt-1">Cross-Platform Synchronized Ecosystem Bridges</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Marketplace ↔ Mining Platform',
              'Marketplace ↔ Fleet & Load Exchange',
              'Marketplace ↔ Building Materials',
              'Marketplace ↔ Enterprise CRM 360',
              'Marketplace ↔ Finance & Escrow',
              'Marketplace ↔ HRMS & Job Portal',
              'Marketplace ↔ Gemini AI Engine',
              'Marketplace ↔ Workflow Automation',
              'Marketplace ↔ Real-Time Notifications'
            ].map((b, idx) => (
              <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                <span className="text-slate-200 font-bold">{b}</span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-500/40">
                  CONNECTED
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 31: VERIFIED PARTNER PROGRAM */}
      {activeTab === 'mod31-verifiedpartners' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 31</span>
              <h2 className="text-xl font-bold text-white mt-1">Verified Partner Program &amp; Compliance Badges</h2>
            </div>
            <button onClick={() => showToast('Partner verification audit requested!')} className="px-3.5 py-2 bg-purple-500 text-slate-950 font-bold rounded-xl flex items-center gap-2">
              <BadgeCheck className="w-4 h-4" /> Apply for Partner Verification
            </button>
          </div>

          {MOCK_VERIFIED_PARTNERS.map((partner) => (
            <div key={partner.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-purple-400 font-bold">{partner.partnerType} • {partner.yearsInBusiness} Years Active</span>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    {partner.partnerName}
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] rounded-full flex items-center gap-1">
                      <BadgeCheck className="w-3 h-3 text-emerald-400" /> {partner.complianceStatus}
                    </span>
                  </h3>
                </div>
                <div className="flex items-center gap-4 text-[11px]">
                  <span className="text-slate-400">Trust Score: <strong className="text-emerald-400 font-black text-sm">{partner.trustScore}/100</strong></span>
                  <span className="text-slate-400">AI Reliability: <strong className="text-cyan-300 font-black text-sm">{partner.aiReliabilityScore}%</strong></span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800 text-slate-300 text-[11px]">
                <div><span className="text-slate-400 text-[10px] block">Avg Response Time</span><strong>{partner.responseTimeMinutes} Mins</strong></div>
                <div><span className="text-slate-400 text-[10px] block">Order Fulfillment</span><strong className="text-emerald-400">{partner.orderFulfillmentRatePercent}%</strong></div>
                <div><span className="text-slate-400 text-[10px] block">Business Rating</span><strong className="text-amber-300">★ {partner.businessRating} / 5.0 ({partner.reviewsCount} Reviews)</strong></div>
                <div><span className="text-slate-400 text-[10px] block">Compliance Status</span><strong className="text-purple-300">{partner.complianceStatus}</strong></div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-bold text-[10px] uppercase">Verified Badges &amp; Credentials:</span>
                <div className="flex flex-wrap gap-2 text-[10px]">
                  {partner.verifications.kycVerified && <span className="px-2.5 py-1 bg-emerald-950 border border-emerald-500/30 text-emerald-300 rounded-lg">✓ KYC Verified</span>}
                  {partner.verifications.gstVerified && <span className="px-2.5 py-1 bg-emerald-950 border border-emerald-500/30 text-emerald-300 rounded-lg">✓ GSTIN Active</span>}
                  {partner.verifications.panVerified && <span className="px-2.5 py-1 bg-emerald-950 border border-emerald-500/30 text-emerald-300 rounded-lg">✓ PAN Validated</span>}
                  {partner.verifications.businessLicenseVerified && <span className="px-2.5 py-1 bg-emerald-950 border border-emerald-500/30 text-emerald-300 rounded-lg">✓ Business License</span>}
                  {partner.verifications.miningLicenseVerified && <span className="px-2.5 py-1 bg-emerald-950 border border-emerald-500/30 text-emerald-300 rounded-lg">✓ Mining Permit</span>}
                  {partner.verifications.insuranceVerified && <span className="px-2.5 py-1 bg-emerald-950 border border-emerald-500/30 text-emerald-300 rounded-lg">✓ Insurance Active</span>}
                  {partner.verifications.vehicleRcVerified && <span className="px-2.5 py-1 bg-emerald-950 border border-emerald-500/30 text-emerald-300 rounded-lg">✓ RC Verified</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODULE 32: AI BUSINESS MATCHMAKING */}
      {activeTab === 'mod32-matchmaking' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 32</span>
            <h2 className="text-xl font-bold text-white mt-1">AI Business Matchmaking &amp; Cross-Entity Connect</h2>
          </div>

          {MOCK_AI_MATCHMAKING_PAIRS.map((pair) => (
            <div key={pair.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-purple-400 font-bold">{pair.matchType}</span>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">
                  {pair.recommendationScore}% AI RECOMMENDATION SCORE
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-slate-400 text-[10px] block">Entity A</span>
                  <strong className="text-white">{pair.partyA}</strong>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-slate-400 text-[10px] block">Entity B</span>
                  <strong className="text-purple-300">{pair.partyB}</strong>
                </div>
              </div>

              <div className="p-3 bg-purple-950/30 border border-purple-500/30 rounded-xl space-y-1">
                <span className="text-purple-300 font-bold flex items-center gap-1 text-[11px]">
                  <Sparkles className="w-3.5 h-3.5" /> AI Recommendation Reasoning:
                </span>
                <p className="text-slate-300 text-[11px]">{pair.matchReasoning}</p>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-emerald-400 font-bold text-[11px]">Est. Deal Value: ₹{pair.estimatedDealValueRs.toLocaleString()}</span>
                  <button onClick={() => showToast(`B2B Deal introduction initiated for ${pair.partyA} ↔ ${pair.partyB}!`)} className="px-3.5 py-1.5 bg-purple-500 text-slate-950 font-bold rounded-xl text-[11px]">
                    Initiate Connection
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODULE 33: BUSINESS SOCIAL NETWORK */}
      {activeTab === 'mod33-social' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 33</span>
              <h2 className="text-xl font-bold text-white mt-1">Mining, Quarry &amp; Construction Business Social Network</h2>
            </div>
            <button onClick={() => showToast('New social showcase published!')} className="px-3.5 py-2 bg-purple-500 text-slate-950 font-bold rounded-xl flex items-center gap-2">
              <Plus className="w-4 h-4" /> Create Post / Showcase
            </button>
          </div>

          {MOCK_BUSINESS_SOCIAL_FEED.map((item) => (
            <div key={item.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <div>
                  <h4 className="text-sm font-bold text-white">{item.companyName}</h4>
                  <span className="text-purple-400 text-[10px]">{item.companyType} • {item.postedDate}</span>
                </div>
                <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-300 font-bold rounded-full text-[10px]">
                  {item.postType}
                </span>
              </div>

              <h3 className="text-xs font-bold text-white">{item.postTitle}</h3>
              <p className="text-slate-300 text-[11px] leading-relaxed">{item.content}</p>

              {item.eventDetails && (
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-amber-300 font-bold block">Trade Show / Expo Details:</span>
                  <p className="text-slate-300 text-[10px]">{item.eventDetails.eventName} • Venue: {item.eventDetails.location}</p>
                </div>
              )}

              <div className="flex items-center gap-6 pt-2 border-t border-slate-800 text-slate-400 text-[11px]">
                <span className="hover:text-purple-400 cursor-pointer flex items-center gap-1" onClick={() => showToast('Liked post!')}>
                  <ThumbsUp className="w-3.5 h-3.5" /> {item.likesCount}
                </span>
                <span className="hover:text-purple-400 cursor-pointer flex items-center gap-1" onClick={() => showToast('Opened comments!')}>
                  <MessageSquare className="w-3.5 h-3.5" /> {item.commentsCount} Comments
                </span>
                <span className="text-slate-500 ml-auto">{item.followersCount} Followers</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODULE 34: DIGITAL RFQ EXCHANGE */}
      {activeTab === 'mod34-rfq' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 34</span>
              <h2 className="text-xl font-bold text-white mt-1">Digital RFQ Exchange &amp; Quotation Negotiation</h2>
            </div>
            <button onClick={() => showToast('Multi-Supplier RFQ creation wizard opened!')} className="px-3.5 py-2 bg-purple-500 text-slate-950 font-bold rounded-xl flex items-center gap-2">
              <Plus className="w-4 h-4" /> Create Multi-Supplier RFQ
            </button>
          </div>

          {MOCK_DIGITAL_RFQS.map((rfq) => (
            <div key={rfq.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-purple-400 font-bold">{rfq.rfqNumber} • {rfq.rfqType}</span>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">{rfq.status}</span>
              </div>

              <h4 className="text-sm font-bold text-white">{rfq.title}</h4>
              <p className="text-slate-300 text-[11px]">Buyer: {rfq.buyerName} • Materials: <strong className="text-amber-300">{rfq.materialsRequired}</strong></p>

              <div className="grid grid-cols-3 gap-3 bg-slate-900 p-3 rounded-xl text-slate-300 text-[10px]">
                <div><span className="text-slate-400 block">AI Vendors Selected</span><strong>{rfq.aiVendorSelectionCount} Pre-matched</strong></div>
                <div><span className="text-slate-400 block">AI Best Price</span><strong className="text-emerald-400">₹{rfq.aiBestPriceRs.toLocaleString()}</strong></div>
                <div><span className="text-slate-400 block">Expiry Date</span><strong className="text-rose-300">{rfq.expiryDate}</strong></div>
              </div>

              <button onClick={() => showToast(`Quotation submitted for ${rfq.rfqNumber}!`)} className="w-full py-2 bg-purple-500 text-slate-950 font-bold rounded-xl">
                Submit Competitive Quotation ({rfq.quotationHistoryCount} Quotes Received)
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MODULE 35: DIGITAL FREIGHT EXCHANGE */}
      {activeTab === 'mod35-freight' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 35</span>
              <h2 className="text-xl font-bold text-white mt-1">Live Freight &amp; Tipper Load Exchange</h2>
            </div>
            <button onClick={() => showToast('Load posting form opened!')} className="px-3.5 py-2 bg-purple-500 text-slate-950 font-bold rounded-xl flex items-center gap-2">
              <Plus className="w-4 h-4" /> Post New Tipper Load
            </button>
          </div>

          {MOCK_FREIGHT_EXCHANGE_LOADS.map((load) => (
            <div key={load.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-purple-400 font-bold">{load.loadNumber} • {load.freightType}</span>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">{load.status}</span>
              </div>

              <div className="flex justify-between items-center text-sm font-bold text-white">
                <span>{load.origin}</span>
                <span className="text-purple-400">➔ ➔ ➔</span>
                <span>{load.destination}</span>
              </div>

              <p className="text-slate-300 text-[11px]">Material: {load.materialType} • Quantity: <strong className="text-amber-300">{load.quantityTons} Tons</strong></p>

              <div className="grid grid-cols-3 gap-3 bg-slate-900 p-3 rounded-xl text-slate-300 text-[10px]">
                <div><span className="text-slate-400 block">AI Vehicle Match</span><strong className="text-emerald-400">{load.aiVehicleMatchScore}% Score</strong></div>
                <div><span className="text-slate-400 block">Empty Trip Optimization</span><strong className="text-cyan-300">{load.emptyTripOptimizationPercent}% Saved</strong></div>
                <div><span className="text-slate-400 block">Bidding Rate / Ton</span><strong className="text-emerald-400">₹{load.biddingRatePerTonRs}</strong></div>
              </div>

              <button onClick={() => showToast(`Freight bid placed on ${load.loadNumber}!`)} className="w-full py-2 bg-purple-500 text-slate-950 font-bold rounded-xl">
                Bid for Freight Assignment
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MODULE 36: MINING LAND EXCHANGE */}
      {activeTab === 'mod36-land' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 36</span>
            <h2 className="text-xl font-bold text-white mt-1">Mining Land &amp; Quarry Lease Exchange</h2>
          </div>

          {MOCK_MINING_LAND_PROPERTIES.map((prop) => (
            <div key={prop.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-purple-400 font-bold">{prop.listingCode} • {prop.type}</span>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">
                  {prop.aiLandMatchScore}% AI MATCH
                </span>
              </div>

              <h4 className="text-sm font-bold text-white">{prop.location} ({prop.areaAcres} Acres)</h4>
              <p className="text-slate-300 text-[11px]">Survey: {prop.surveyDetails} • GPS: <strong className="text-cyan-300">{prop.gpsCoordinates}</strong></p>

              <div className="flex gap-4 text-[10px]">
                {prop.boundaryMapAvailable && <span className="text-emerald-400">✓ Boundary GIS Map Verified</span>}
                {prop.legalDocumentsVerified && <span className="text-emerald-400">✓ Legal Title Clean</span>}
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                <span className="text-slate-400">Est. Investment: <strong className="text-emerald-400 text-sm">₹{(prop.estimatedInvestmentRs / 10000000).toFixed(2)} Cr</strong></span>
                <button onClick={() => showToast(`Land survey dossier downloaded for ${prop.listingCode}!`)} className="px-4 py-2 bg-purple-500 text-slate-950 font-bold rounded-xl">
                  Request Survey Dossier
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODULE 37: BUSINESS INVESTMENT PLATFORM */}
      {activeTab === 'mod37-investment' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 37</span>
            <h2 className="text-xl font-bold text-white mt-1">Joint Venture &amp; Mining Investment Platform</h2>
          </div>

          {MOCK_INVESTMENT_OPPORTUNITIES.map((inv) => (
            <div key={inv.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-purple-400 font-bold">{inv.opportunityCode} • {inv.opportunityType}</span>
                <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 font-bold rounded-full text-[10px]">{inv.fundingRequestStatus}</span>
              </div>

              <h4 className="text-sm font-bold text-white">{inv.title}</h4>
              <p className="text-slate-300 text-[11px]">Target Entity: {inv.targetCompany} • Target Investors: {inv.investorProfileTarget}</p>

              <div className="grid grid-cols-2 gap-3 bg-slate-900 p-3 rounded-xl text-slate-300 text-[10px]">
                <div><span className="text-slate-400 block">Required Capital</span><strong className="text-emerald-400 text-xs">₹{(inv.requiredCapitalRs / 10000000).toFixed(2)} Cr</strong></div>
                <div><span className="text-slate-400 block">Expected Annual ROI</span><strong className="text-purple-300 text-xs">{inv.expectedRoiPercent}% p.a.</strong></div>
              </div>

              <button onClick={() => showToast(`Investment Due Diligence kit sent for ${inv.opportunityCode}!`)} className="w-full py-2 bg-purple-500 text-slate-950 font-bold rounded-xl">
                Apply for Investment Due Diligence
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MODULE 38: BUSINESS FINANCE MARKETPLACE */}
      {activeTab === 'mod38-finance' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 38</span>
            <h2 className="text-xl font-bold text-white mt-1">Bank, NBFC &amp; Invoice Discounting Marketplace</h2>
          </div>

          {MOCK_FINANCE_MARKETPLACE_OFFERS.map((offer) => (
            <div key={offer.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-purple-400 font-bold">{offer.offerId} • {offer.financerType}</span>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">
                  {offer.loanEligibilityScore}% ELIGIBILITY SCORE
                </span>
              </div>

              <h4 className="text-sm font-bold text-white">{offer.financerName} ({offer.category})</h4>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                <span className="text-purple-300 font-bold block text-[10px]">AI Finance Recommendation:</span>
                <p className="text-slate-300 text-[11px]">{offer.aiFinanceRecommendation}</p>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-400">Max Sanction: <strong className="text-emerald-400 text-sm">₹{(offer.maxFundingRs / 10000000).toFixed(2)} Cr</strong> @ {offer.interestRatePercent}%</span>
                <button onClick={() => showToast(`Instant loan application filed with ${offer.financerName}!`)} className="px-4 py-2 bg-purple-500 text-slate-950 font-bold rounded-xl">
                  Apply for Loan Sanction
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODULE 39: PUBLIC BUSINESS DIRECTORY */}
      {activeTab === 'mod39-directory' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 39</span>
            <h2 className="text-xl font-bold text-white mt-1">Google Maps Ready Public B2B Directory</h2>
          </div>

          {MOCK_PUBLIC_DIRECTORY_ENTRIES.map((entry) => (
            <div key={entry.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <span className="text-purple-400 font-bold">{entry.category} • {entry.distanceKm} Km Nearby</span>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  {entry.businessName}
                  {entry.isVerified && <BadgeCheck className="w-4 h-4 text-emerald-400" />}
                </h4>
                <p className="text-slate-400 text-[11px]">Location: {entry.location} • Map GPS: {entry.googleMapsCoordinates}</p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-amber-300 font-bold">★ {entry.rating} / 5.0</span>
                <button onClick={() => showToast(`Google Maps navigation launched for ${entry.businessName}!`)} className="px-4 py-2 bg-purple-500 text-slate-950 font-bold rounded-xl flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> Navigate on Map
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODULE 40: CONSTRUCTION PROCUREMENT EXCHANGE */}
      {activeTab === 'mod40-procurement' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 40</span>
              <h2 className="text-xl font-bold text-white mt-1">AI BOQ Upload &amp; Construction Material Procurement</h2>
            </div>
            <button onClick={() => showToast('BOQ Excel / PDF parser launched!')} className="px-3.5 py-2 bg-purple-500 text-slate-950 font-bold rounded-xl flex items-center gap-2">
              <Plus className="w-4 h-4" /> Upload BOQ File
            </button>
          </div>

          {MOCK_CONSTRUCTION_PROCUREMENT_BOQS.map((boq) => (
            <div key={boq.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-purple-400 font-bold">{boq.boqCode} • {boq.ownerType} Project</span>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">
                  AI status: {boq.aiBoqAnalysisStatus}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white">{boq.projectName} ({boq.materialsCount} Line Items)</h4>
              <p className="text-slate-300 text-[11px]">Delivery Plan: {boq.deliverySchedule}</p>

              <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                <span className="text-slate-400">Best AI Matched Quotation: <strong className="text-emerald-400 text-sm">₹{(boq.bestQuotationRs / 10000000).toFixed(2)} Cr</strong> ({boq.matchedSuppliersCount} Suppliers)</span>
                <button onClick={() => showToast(`Supplier procurement order issued for BOQ ${boq.boqCode}!`)} className="px-4 py-2 bg-purple-500 text-slate-950 font-bold rounded-xl">
                  Issue Procurement Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODULE 41: USED ASSET MARKETPLACE */}
      {activeTab === 'mod41-usedassets' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 41</span>
            <h2 className="text-xl font-bold text-white mt-1">Used Quarry, Crusher &amp; Equipment Asset Exchange</h2>
          </div>

          {MOCK_USED_ASSETS.map((asset) => (
            <div key={asset.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-purple-400 font-bold">{asset.assetCode} • {asset.category}</span>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">{asset.conditionRating}</span>
              </div>

              <h4 className="text-sm font-bold text-white">{asset.title}</h4>

              <div className="grid grid-cols-2 gap-3 bg-slate-900 p-3 rounded-xl text-slate-300 text-[10px]">
                <div><span className="text-slate-400 block">AI Estimated Fair Value</span><strong className="text-emerald-400 text-xs">₹{(asset.aiValuationRs / 100000).toFixed(2)} Lakhs</strong></div>
                <div><span className="text-slate-400 block">Current High Bid</span><strong className="text-amber-300 text-xs">₹{(asset.currentBidRs / 100000).toFixed(2)} Lakhs</strong></div>
              </div>

              <button onClick={() => showToast(`Inspection report requested for ${asset.assetCode}!`)} className="w-full py-2 bg-purple-500 text-slate-950 font-bold rounded-xl">
                Inspect Machine &amp; Bid
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MODULE 42: RENTAL MARKETPLACE */}
      {activeTab === 'mod42-rentals' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 42</span>
            <h2 className="text-xl font-bold text-white mt-1">Vehicle, Heavy Machinery, Operator &amp; Labour Rental</h2>
          </div>

          {MOCK_RENTAL_MARKETPLACE_ITEMS.map((rnt) => (
            <div key={rnt.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <span className="text-purple-400 font-bold">{rnt.rentalCode} • {rnt.type}</span>
                <h4 className="text-sm font-bold text-white">{rnt.title}</h4>
                <p className="text-slate-400 text-[11px]">Provider: {rnt.providerName} • Status: <strong className="text-emerald-400">{rnt.availabilityCalendar}</strong></p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-emerald-400 font-bold text-sm">₹{rnt.rateRs.toLocaleString()} / {rnt.rentalTerm}</span>
                <button onClick={() => showToast(`Rental contract booked for ${rnt.rentalCode}!`)} className="px-4 py-2 bg-purple-500 text-slate-950 font-bold rounded-xl">
                  Book Rental
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODULE 43: AI MARKET INTELLIGENCE */}
      {activeTab === 'mod43-intelligence' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 43</span>
            <h2 className="text-xl font-bold text-white mt-1">AI Material Demand Radar &amp; Market Intelligence</h2>
          </div>

          {MOCK_AI_MARKET_INTELLIGENCE.map((intel) => (
            <div key={intel.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-emerald-400">{intel.reportTitle}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-slate-400 font-bold block">Material Demand Forecast</span>
                  <p className="text-slate-200">{intel.demandForecast}</p>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-slate-400 font-bold block">Price Trend Analysis</span>
                  <p className="text-slate-200">{intel.priceTrend}</p>
                </div>
              </div>

              <div className="p-3 bg-purple-950/30 border border-purple-500/30 rounded-xl space-y-1 text-[11px]">
                <span className="text-purple-300 font-bold block">AI Growth Prediction &amp; Recommendation:</span>
                <p className="text-slate-300">{intel.investmentRecommendation}</p>
                <span className="text-emerald-400 font-bold block mt-1">Predicted YoY Growth: +{intel.growthPredictionPercent}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODULE 44: ECOSYSTEM ANALYTICS */}
      {activeTab === 'mod44-analytics' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 44</span>
            <h2 className="text-xl font-bold text-white mt-1">Pan-Ecosystem Revenue, Leads &amp; Top Performers</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-slate-400 text-[10px] block">Marketplace Revenue</span>
              <strong className="text-emerald-400 text-sm">₹{(MOCK_ECOSYSTEM_ANALYTICS_DATA.marketplaceRevenueRs / 10000000).toFixed(2)} Cr</strong>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-slate-400 text-[10px] block">Lead Conversion Rate</span>
              <strong className="text-purple-300 text-sm">{MOCK_ECOSYSTEM_ANALYTICS_DATA.leadConversionRatePercent}%</strong>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-slate-400 text-[10px] block">YoY Ecosystem Growth</span>
              <strong className="text-cyan-300 text-sm">+{MOCK_ECOSYSTEM_ANALYTICS_DATA.marketplaceGrowthYoYPercent}%</strong>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-slate-400 text-[10px] block">Regional Performance Index</span>
              <strong className="text-amber-300 text-xs">{MOCK_ECOSYSTEM_ANALYTICS_DATA.regionalPerformanceIndex}</strong>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 45: SUPER APP EXPERIENCE */}
      {activeTab === 'mod45-superapp' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 45</span>
            <h2 className="text-xl font-bold text-white mt-1">Super App Unified Experience &amp; Role Based Engine</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <span className="text-slate-400 text-[10px]">One Wallet Balance</span>
              <strong className="text-emerald-400 text-base block">₹{MOCK_SUPER_APP_STATUS.oneWalletBalanceRs.toLocaleString()}</strong>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <span className="text-slate-400 text-[10px]">One Notification Hub</span>
              <strong className="text-purple-300 text-base block">{MOCK_SUPER_APP_STATUS.oneNotificationCenterUnread} Unread Alerts</strong>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <span className="text-slate-400 text-[10px]">AI Copilot Status</span>
              <strong className="text-cyan-300 text-xs block">{MOCK_SUPER_APP_STATUS.oneAiAssistantStatus}</strong>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 46: GLOBAL EXPANSION READY */}
      {activeTab === 'mod46-global' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 46</span>
            <h2 className="text-xl font-bold text-white mt-1">Cross-Border International Export &amp; Customs Portal</h2>
          </div>

          {MOCK_GLOBAL_EXPANSION_ITEMS.map((glob) => (
            <div key={glob.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <span className="text-purple-400 font-bold">{glob.tradeType} • {glob.country}</span>
                <h4 className="text-sm font-bold text-white">Logistics: {glob.internationalLogisticsPartner}</h4>
                <p className="text-slate-400 text-[11px]">Currencies: {glob.currency} • Languages: {glob.languagesSupported.join(', ')}</p>
              </div>

              <button onClick={() => showToast(`Customs documentation generator opened for ${glob.country}!`)} className="px-4 py-2 bg-purple-500 text-slate-950 font-bold rounded-xl flex items-center gap-1.5">
                <Globe className="w-4 h-4" /> Export Customs Clearance
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MODULE 47: ENTERPRISE API MARKETPLACE */}
      {activeTab === 'mod47-api' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 47</span>
            <h2 className="text-xl font-bold text-white mt-1">Developer API Gateway, SDKs &amp; Webhook Marketplace</h2>
          </div>

          {MOCK_ENTERPRISE_APIS.map((api) => (
            <div key={api.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <span className="text-purple-400 font-bold">{api.category} • Version {api.version}</span>
                <h4 className="text-sm font-bold text-white">{api.apiName}</h4>
                <p className="text-slate-400 text-[11px] font-mono">{api.endpointUrl}</p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-emerald-400 font-bold">{api.activeIntegrationsCount} Integrations</span>
                <button onClick={() => showToast(`Developer API Key generated for ${api.apiName}!`)} className="px-4 py-2 bg-purple-500 text-slate-950 font-bold rounded-xl flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" /> Get Developer API Key
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODULE 48: FUTURE TECHNOLOGY */}
      {activeTab === 'mod48-futuretech' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 48</span>
            <h2 className="text-xl font-bold text-white mt-1">Digital Twin, Drone GIS, BIM, AutoCAD &amp; Voice AI Copilot</h2>
          </div>

          {MOCK_FUTURE_TECH_CAPABILITIES.map((tech) => (
            <div key={tech.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-purple-400 font-bold">{tech.category}</span>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">
                  {tech.readinessLevelPercent}% READY ({tech.status})
                </span>
              </div>

              <h4 className="text-sm font-bold text-white">{tech.techName}</h4>
              <p className="text-slate-300 text-[11px]">{tech.description}</p>

              <button onClick={() => showToast(`3D / GIS simulation active for ${tech.techName}!`)} className="w-full py-2 bg-purple-500 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2">
                <Bot className="w-4 h-4" /> Launch Interactive 3D / AI Simulation
              </button>
            </div>
          ))}
        </div>
      )}

      {/* AUDIT & PHASE 21 REVIEW */}
      {activeTab === 'phase21-review' && (
        <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">Phase 21 Architectural Audit</span>
              <h2 className="text-xl font-bold text-white mt-1">Implementation Review &amp; Recommendations for Phase 21</h2>
            </div>
            <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold rounded-full">
              STATUS: ALL 38 ECOSYSTEM MODULES COMPLETE (MOD 1-20 &amp; MOD 31-48)
            </span>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Pan-India Enterprise Marketplace Operational
              </h4>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                All 38 Marketplace &amp; Ecosystem modules — Business Directory, Mining Marketplace, Building Materials Marketplace, Fleet Marketplace, Heavy Equipment Marketplace, Used Machinery, Job Portal, Service Marketplace, Construction Marketplace, Public Classifieds, AI Matchmaking Engine, Business Network, Tender Platform, Digital Auctions, Sponsored Ads, Business Financing, Customer Experience, Escrow Payment Gateway, Marketplace Analytics, Ecosystem Bridges, Verified Partner Program, AI Matchmaker, Business Social, Digital RFQ, Freight Exchange, Mining Land Exchange, Investment Platform, Finance Marketplace, Public Directory, Construction Procurement, Used Assets, Rental Marketplace, AI Intelligence, Ecosystem Analytics, Super App, Global Expansion, API Marketplace, and Future Technology — are built, verified, and integrated with Shared Core, Mining, Fleet, Building Materials, and CRM platforms.
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <h4 className="text-sm font-bold text-purple-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" /> Strategic Recommendations &amp; Next Operational Steps
              </h4>
              <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-1 leading-relaxed">
                <li>Integrate automated GSTIN verification via e-Way bill portal for new seller onboarding.</li>
                <li>Activate real-time voice bidding in live machinery auctions.</li>
                <li>Expand Escrow payment protection for cross-state aggregate shipments.</li>
                <li>Connect AI matchmaker to automated WhatsApp broadcast alerts for local contractors.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
