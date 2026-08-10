import React, { useState } from 'react';
import {
  Truck, Search, Filter, Plus, ArrowUpRight, ArrowDownRight,
  ShieldCheck, DollarSign, Cpu, Activity, Navigation, MapPin,
  Clock, CheckCircle2, Sparkles, AlertCircle, FileText, ShoppingBag,
  RefreshCw, Award, BarChart3, ChevronRight, Phone, ShieldAlert,
  Zap, Compass, UserCheck, Layers, Building2, Check, Send
} from 'lucide-react';

import {
  MOCK_LOAD_POSTINGS,
  MOCK_LOAD_BIDS,
  MOCK_RETURN_BACKHAUL_MATCHES,
  MOCK_MARKETPLACE_ANALYTICS,
  LoadPostItem,
  LoadBidRecord,
  ReturnLoadBackhaulMatch
} from '../data/aiLoadExchangeMarketplaceData';

export const AILoadExchangeMarketplaceSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'live-board'
    | 'post-load'
    | 'bidding-matching'
    | 'return-load-engine'
    | 'gps-pod-tracking'
    | 'payments-wallets'
    | 'ai-analytics'
    | 'user-portals'
  >('live-board');

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // States
  const [loads, setLoads] = useState<LoadPostItem[]>(MOCK_LOAD_POSTINGS);
  const [bids, setBids] = useState<LoadBidRecord[]>(MOCK_LOAD_BIDS);
  const [backhaulMatches] = useState<ReturnLoadBackhaulMatch[]>(MOCK_RETURN_BACKHAUL_MATCHES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Form State for Load Posting
  const [postForm, setPostForm] = useState({
    materialType: 'Washed M-Sand' as LoadPostItem['materialType'],
    category: 'Crusher Plant' as LoadPostItem['category'],
    weightTons: 30,
    volumeCuM: 20,
    pickupLocation: 'Bantwal Quarry Zone #2',
    destinationLocation: 'Mangalore Smart City Site',
    loadingDate: '2026-08-07',
    loadingTime: '10:00 AM',
    priority: 'High Express' as LoadPostItem['priority'],
    requiredVehicleType: 'Heavy Tipper (10-Wheeler)' as LoadPostItem['requiredVehicleType'],
    offeredPriceRs: 9000,
    advancePaymentRs: 3500,
    postedBy: 'Coastal Quarry & Crusher Hub',
    consignorPhone: '+91 98450 99887'
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreateLoad = (e: React.FormEvent) => {
    e.preventDefault();
    const newLoad: LoadPostItem = {
      id: `LOAD-2026-${Math.floor(100 + Math.random() * 900)}`,
      loadNo: `LD-MNT-${Math.floor(8000 + Math.random() * 1000)}`,
      materialType: postForm.materialType,
      category: postForm.category,
      weightTons: Number(postForm.weightTons),
      volumeCuM: Number(postForm.volumeCuM),
      pickupLocation: postForm.pickupLocation,
      pickupGps: { lat: 12.89, lng: 75.02 },
      destinationLocation: postForm.destinationLocation,
      destinationGps: { lat: 12.91, lng: 74.85 },
      loadingDate: postForm.loadingDate,
      loadingTime: postForm.loadingTime,
      priority: postForm.priority,
      requiredVehicleType: postForm.requiredVehicleType,
      offeredPriceRs: Number(postForm.offeredPriceRs),
      advancePaymentRs: Number(postForm.advancePaymentRs),
      status: 'BIDDING_OPEN',
      postedBy: postForm.postedBy,
      consignorPhone: postForm.consignorPhone,
      bidsCount: 0
    };

    setLoads([newLoad, ...loads]);
    showToast(`Load ${newLoad.loadNo} posted! Transmitted to 500+ nearby vehicle owners & fleet operators via AI Matchmaker.`);
    setActiveTab('live-board');
  };

  const handleAcceptBid = (bid: LoadBidRecord) => {
    setBids(bids.map(b => b.bidId === bid.bidId ? { ...b, bidStatus: 'ACCEPTED' } : b));
    setLoads(loads.map(l => l.id === bid.loadId ? { ...l, status: 'BOOKED' } : l));
    showToast(`Bid from ${bid.bidderName} accepted! Vehicle ${bid.offeredVehicleReg} & Driver ${bid.driverName} allocated.`);
  };

  const filteredLoads = loads.filter(l => {
    const matchesSearch = l.loadNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.materialType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.pickupLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.destinationLocation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || l.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Banner Header */}
      <div className="relative bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <ShoppingBag className="w-4 h-4 text-blue-400" /> Module 31 AI Load Exchange Marketplace
            </span>
            <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold rounded-full">
              India's #1 Mining &amp; Freight Freightboard
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            RZ® Minetrix BOS — AI Load Exchange &amp; Smart Freight Marketplace
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-4xl leading-relaxed">
            AI-powered freight matching connecting Quarries, Crusher Plants, Building Material Suppliers, Fleet Owners, Transport Agencies, and Drivers across India. Instant vehicle matching, empty return backhaul optimization, real-time GPS tracking &amp; digital OTP-backed Proof of Delivery.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs flex items-center gap-2 font-mono">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-slate-400">Active Live Loads:</span>
              <strong className="text-white">{MOCK_MARKETPLACE_ANALYTICS.totalActiveLoadsCount} Listings</strong>
            </div>
            <div className="px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs flex items-center gap-2 font-mono">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-400">Tonnage In Transit:</span>
              <strong className="text-emerald-400">{MOCK_MARKETPLACE_ANALYTICS.totalTonnageInTransit.toLocaleString()} Tons</strong>
            </div>
            <div className="px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs flex items-center gap-2 font-mono">
              <DollarSign className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400">Daily Freight Volume:</span>
              <strong className="text-amber-300">₹{(MOCK_MARKETPLACE_ANALYTICS.totalFreightVolumeRs / 100000).toFixed(2)} Lakhs</strong>
            </div>
            <div className="px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs flex items-center gap-2 font-mono">
              <RefreshCw className="w-4 h-4 text-purple-400" />
              <span className="text-slate-400">Empty Return Cut:</span>
              <strong className="text-purple-300">+{MOCK_MARKETPLACE_ANALYTICS.emptyReturnTripReductionPercent}% Efficiency</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
        <button
          onClick={() => setActiveTab('live-board')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
            activeTab === 'live-board' ? 'bg-blue-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Layers className="w-4 h-4" />
          1. Live Load Board ({loads.length})
        </button>

        <button
          onClick={() => setActiveTab('post-load')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
            activeTab === 'post-load' ? 'bg-blue-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Plus className="w-4 h-4" />
          2. Post New Material Load
        </button>

        <button
          onClick={() => setActiveTab('bidding-matching')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
            activeTab === 'bidding-matching' ? 'bg-blue-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Cpu className="w-4 h-4" />
          3. AI Bidding &amp; Vehicle Matchmaker
        </button>

        <button
          onClick={() => setActiveTab('return-load-engine')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
            activeTab === 'return-load-engine' ? 'bg-blue-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          4. AI Backhaul Return Engine
        </button>

        <button
          onClick={() => setActiveTab('gps-pod-tracking')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
            activeTab === 'gps-pod-tracking' ? 'bg-blue-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Compass className="w-4 h-4" />
          5. Live GPS &amp; Digital POD
        </button>

        <button
          onClick={() => setActiveTab('payments-wallets')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
            activeTab === 'payments-wallets' ? 'bg-blue-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          6. Freight Settlements &amp; Wallets
        </button>

        <button
          onClick={() => setActiveTab('user-portals')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
            activeTab === 'user-portals' ? 'bg-blue-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          7. Role Portals (Driver/Owner/Consignor)
        </button>

        <button
          onClick={() => setActiveTab('ai-analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
            activeTab === 'ai-analytics' ? 'bg-blue-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          8. AI Freight Analytics &amp; Rates
        </button>
      </div>

      {/* TAB 1: LIVE LOAD BOARD */}
      {activeTab === 'live-board' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Material, Location, or Load ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">All Categories</option>
                <option value="Mining Quarry">Mining Quarry</option>
                <option value="Crusher Plant">Crusher Plant</option>
                <option value="Building Material Supplier">Building Material Supplier</option>
                <option value="Construction Project">Construction Project</option>
              </select>
            </div>

            <button
              onClick={() => setActiveTab('post-load')}
              className="px-4 py-2 bg-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Post Load Request
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLoads.map((load) => (
              <div key={load.id} className="p-5 bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl space-y-4 shadow-xl transition-all">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-blue-400">{load.loadNo}</span>
                    <span className="text-[10px] text-slate-400 block">{load.category}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                    load.status === 'AVAILABLE' ? 'bg-emerald-500/20 text-emerald-300' :
                    load.status === 'BIDDING_OPEN' ? 'bg-blue-500/20 text-blue-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {load.status.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{load.materialType}</h3>
                  <p className="text-xs font-mono text-amber-300 font-semibold mt-0.5">
                    {load.weightTons} Tons • {load.volumeCuM} Cu.M
                  </p>
                </div>

                <div className="space-y-1.5 text-xs font-mono text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 text-[10px] block">Pickup:</span>
                      <strong className="text-white text-[11px]">{load.pickupLocation}</strong>
                    </div>
                  </div>
                  <div className="flex items-start gap-1.5 pt-1 border-t border-slate-800/60">
                    <Navigation className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 text-[10px] block">Destination:</span>
                      <strong className="text-white text-[11px]">{load.destinationLocation}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Freight Rate Offered:</span>
                    <strong className="text-emerald-400 text-sm">₹{load.offeredPriceRs.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Advance Pay:</span>
                    <strong className="text-amber-300 text-xs">₹{load.advancePaymentRs.toLocaleString()}</strong>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('bidding-matching');
                    showToast(`Opened AI Matchmaker & Bids for ${load.loadNo}`);
                  }}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Cpu className="w-4 h-4 text-blue-400" /> View Bids ({load.bidsCount}) &amp; AI Match
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: POST NEW LOAD */}
      {activeTab === 'post-load' && (
        <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Module 31</span>
            <h2 className="text-xl font-bold text-white mt-1">Post Material Load to Freight Exchange</h2>
            <p className="text-xs text-slate-400">Broadcast your material transport load to 500+ verified fleet companies, truck owners &amp; transport agencies instantly.</p>
          </div>

          <form onSubmit={handleCreateLoad} className="space-y-4 text-xs font-mono">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Material Type</label>
                <select
                  value={postForm.materialType}
                  onChange={(e) => setPostForm({ ...postForm, materialType: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Washed M-Sand">Washed M-Sand</option>
                  <option value="Plastering P-Sand">Plastering P-Sand</option>
                  <option value="Laterite Stone">Laterite Stone</option>
                  <option value="20mm Aggregate">20mm Crushed Blue Metal Aggregate</option>
                  <option value="40mm Sub-Base Metal">40mm Sub-Base Metal</option>
                  <option value="Cement Bags">Cement Bags</option>
                  <option value="TMT Steel Rebars">TMT Steel Rebars</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Requester Category</label>
                <select
                  value={postForm.category}
                  onChange={(e) => setPostForm({ ...postForm, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Mining Quarry">Mining Quarry</option>
                  <option value="Crusher Plant">Crusher Plant</option>
                  <option value="Building Material Supplier">Building Material Supplier</option>
                  <option value="Construction Project">Construction Project</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tonnage (Tons)</label>
                <input
                  type="number"
                  value={postForm.weightTons}
                  onChange={(e) => setPostForm({ ...postForm, weightTons: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Estimated Volume (Cu.M)</label>
                <input
                  type="number"
                  value={postForm.volumeCuM}
                  onChange={(e) => setPostForm({ ...postForm, volumeCuM: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Pickup Location &amp; GPS Anchor</label>
              <input
                type="text"
                value={postForm.pickupLocation}
                onChange={(e) => setPostForm({ ...postForm, pickupLocation: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Destination Delivery Site</label>
              <input
                type="text"
                value={postForm.destinationLocation}
                onChange={(e) => setPostForm({ ...postForm, destinationLocation: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Offered Freight Price (₹)</label>
                <input
                  type="number"
                  value={postForm.offeredPriceRs}
                  onChange={(e) => setPostForm({ ...postForm, offeredPriceRs: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Advance Amount (₹)</label>
                <input
                  type="number"
                  value={postForm.advancePaymentRs}
                  onChange={(e) => setPostForm({ ...postForm, advancePaymentRs: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Required Vehicle Type</label>
              <select
                value={postForm.requiredVehicleType}
                onChange={(e) => setPostForm({ ...postForm, requiredVehicleType: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Heavy Tipper (10-Wheeler)">Heavy Tipper (10-Wheeler)</option>
                <option value="Multi-Axle Trailer (18-Wheeler)">Multi-Axle Trailer (18-Wheeler)</option>
                <option value="Commercial Pickup">Commercial Pickup</option>
                <option value="Low-Bed Machinery Carrier">Low-Bed Machinery Carrier</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-slate-950 font-bold rounded-xl shadow-xl hover:bg-blue-400 transition-all text-sm flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Broadcast Load Request to AI Exchange
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: BIDDING & AI MATCHMAKER */}
      {activeTab === 'bidding-matching' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Module 31</span>
            <h2 className="text-xl font-bold text-white mt-1">AI Smart Bidding &amp; Transport Matchmaker</h2>
            <p className="text-xs text-slate-400">AI automatically ranks bids from fleet owners and independent truckers based on proximity, safety rating, cost efficiency, and speed.</p>
          </div>

          <div className="space-y-4">
            {bids.map((bid) => (
              <div key={bid.bidId} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400 font-bold">{bid.bidId}</span>
                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-[10px] font-bold rounded-full">
                      AI Rank Match: {bid.aiRankScore}/100
                    </span>
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded-full">
                      ★ {bid.bidderRating}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white">{bid.bidderName} ({bid.bidderType})</h4>
                  <p className="text-slate-400 text-[11px]">
                    Vehicle: <strong className="text-white">{bid.offeredVehicleReg}</strong> • Driver: <strong className="text-white">{bid.driverName}</strong> • Est. Transit: {bid.estimatedTransitTimeHours} hrs
                  </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
                  <div className="text-right">
                    <span className="text-slate-400 text-[10px] block">Proposed Freight:</span>
                    <strong className="text-emerald-400 text-base">₹{bid.proposedFreightRs.toLocaleString()}</strong>
                  </div>

                  {bid.bidStatus === 'PENDING' ? (
                    <button
                      onClick={() => handleAcceptBid(bid)}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md"
                    >
                      Accept Bid &amp; Dispatch
                    </button>
                  ) : (
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-bold rounded-full">
                      ACCEPTED
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: RETURN LOAD ENGINE */}
      {activeTab === 'return-load-engine' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Module 31</span>
            <h2 className="text-xl font-bold text-white mt-1">AI Empty Return Backhaul Engine</h2>
            <p className="text-xs text-slate-400">Eliminate zero-payload empty return runs by matching returning tippers with nearby freight requests on homebound corridors.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            {backhaulMatches.map((m) => (
              <div key={m.matchId} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-blue-400 font-bold">{m.matchId}</span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full">
                    Match Confidence: {m.aiMatchConfidence}%
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white">{m.emptyReturnVehicleReg}</h4>

                <div className="space-y-1.5 text-slate-300 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Unload Site:</span>
                    <span>{m.currentUnloadLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Suggested Backhaul:</span>
                    <strong className="text-amber-300">{m.materialName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Extra Profit Added:</span>
                    <strong className="text-emerald-400">+₹{m.extraFreightProfitRs.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between border-t border-slate-800/80 pt-1">
                    <span className="text-slate-400">Fuel Waste Saved:</span>
                    <strong className="text-purple-300">₹{m.potentialFuelSavingsRs.toLocaleString()}</strong>
                  </div>
                </div>

                <button
                  onClick={() => showToast(`Backhaul trip booked for ${m.emptyReturnVehicleReg}! Driver notified.`)}
                  className="w-full py-2 bg-blue-500 text-slate-950 font-bold rounded-xl shadow-md"
                >
                  Book AI Return Backhaul
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: GPS & DIGITAL POD */}
      {activeTab === 'gps-pod-tracking' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Module 31</span>
            <h2 className="text-xl font-bold text-white mt-1">Live Freight GPS Telemetry &amp; OTP Proof of Delivery</h2>
          </div>

          <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4 font-mono text-xs">
            <div className="flex justify-between text-slate-300">
              <span className="text-emerald-400 font-bold">Active Delivery: LD-MNT-8802 (Laterite Stone)</span>
              <span>ETA: 22 Mins Remaining</span>
            </div>

            <div className="h-40 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-500 text-sm">
              <Compass className="w-8 h-8 text-blue-400 animate-spin mr-2" />
              <span>Live Vehicle Satellite Track Active — Speed 42 Km/h</span>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-4 border-t border-slate-800 pt-3">
              <div>
                <span className="text-slate-400 text-[10px] block">Customer Delivery OTP:</span>
                <strong className="text-amber-300 text-base">3319</strong>
              </div>
              <button
                onClick={() => showToast('Simulated Customer OTP Verification & Digital POD Receipt Generation!')}
                className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl"
              >
                Verify Customer OTP &amp; Mark Delivered
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: PAYMENTS & WALLETS */}
      {activeTab === 'payments-wallets' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Module 31</span>
            <h2 className="text-xl font-bold text-white mt-1">Freight Payments, Advance Escrow &amp; Instant Driver Wallets</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <span className="text-slate-400 text-[10px] block">Total Escrow Processed</span>
              <strong className="text-emerald-400 text-lg">₹38,40,000</strong>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <span className="text-slate-400 text-[10px] block">Marketplace Brokerage Fee</span>
              <strong className="text-blue-400 text-lg">2.5% Per Trip</strong>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <span className="text-slate-400 text-[10px] block">Driver Wallet Payout Speed</span>
              <strong className="text-amber-300 text-lg">Instant (&lt; 60 Secs)</strong>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: ROLE PORTALS */}
      {activeTab === 'user-portals' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Module 31</span>
            <h2 className="text-xl font-bold text-white mt-1">Multi-Stakeholder Experience Portals</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <h4 className="text-sm font-bold text-blue-400">Driver Portal</h4>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Accept trips, navigate via Google Maps, submit digital POD photo, request instant trip advances &amp; fuel vouchers.
              </p>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <h4 className="text-sm font-bold text-emerald-400">Fleet Owner Portal</h4>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Bidding dashboard, automated driver assignment, fuel consumption alerts &amp; weekly freight revenue settlements.
              </p>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <h4 className="text-sm font-bold text-amber-400">Consignor / Customer Portal</h4>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Post bulk material loads, track live tipper ETA, view E-Way bills &amp; rate truck driver performance.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: AI ANALYTICS */}
      {activeTab === 'ai-analytics' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Module 31</span>
            <h2 className="text-xl font-bold text-white mt-1">AI Smart Freight Analytics &amp; Price Guidance</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <h4 className="text-sm font-bold text-blue-400">AI Freight Rate Prediction</h4>
              <p className="text-slate-300 leading-relaxed">
                Suggested fair benchmark rate for M-Sand transport: <strong className="text-emerald-400">₹672 / Ton</strong> (Adjusted for diesel prices &amp; monsoon toll rates).
              </p>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <h4 className="text-sm font-bold text-emerald-400">Top Freight Route</h4>
              <p className="text-slate-300 leading-relaxed">
                <strong className="text-white">{MOCK_MARKETPLACE_ANALYTICS.topPerformingRoute}</strong>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
