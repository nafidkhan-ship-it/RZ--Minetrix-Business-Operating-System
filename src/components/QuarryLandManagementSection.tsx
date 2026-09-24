import React, { useState } from 'react';
import {
  Landmark,
  MapPin,
  FileText,
  Search,
  Plus,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Coins,
  DollarSign,
  TrendingUp,
  Layers,
  Compass,
  Users,
  Building2,
  Calendar,
  Sparkles,
  Phone,
  ArrowUpRight,
  Handshake,
  Check,
  Share2
} from 'lucide-react';
import { MOCK_MINING_LAND_PROPERTIES, MiningLandProperty } from '../data/enterpriseMarketplacePhase21Data';

export const QuarryLandManagementSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'land-database'
    | 'land-for-sale'
    | 'land-for-lease'
    | 'investor-matching'
    | 'owner-registration'
    | 'deal-assistance'
    | 'active-leases'
  >('land-database');

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  // Land Database Listings
  const [properties, setProperties] = useState([
    {
      id: 'QLND-101',
      code: 'LAND-KL-01',
      title: 'High-Density Laterite Stone Quarry Land',
      type: 'FOR_SALE',
      mineralPotential: 'Laterite Stone (Grade A Premium Cutting)',
      location: 'Kasaragod - Kanhangad Belt, Kerala',
      surveyNo: 'Survey No. 248/2A & 248/2B',
      areaAcres: 12.5,
      estimatedYieldMT: '3,80,000 MT / 18,00,000 Cut Stones',
      askingPriceRs: 22500000,
      leaseTerms: null,
      roadAccess: 'Tarred PWD Road with 12m turning radius for multi-axle tippers',
      permits: ['Panchayat NOC Active', 'Geology Department Letter of Intent (LoI)'],
      ownerName: 'V. Prabhakaran Nair',
      ownerPhone: '+91 94471 22890',
      matchScore: 98,
      status: 'AVAILABLE'
    },
    {
      id: 'QLND-102',
      code: 'LAND-KA-04',
      title: 'Blue Metal Hard Rock Granite Quarry & Crusher Site',
      type: 'FOR_LEASE',
      mineralPotential: 'Grey Granite / 20mm & 40mm Crusher Aggregate',
      location: 'Moodbidri Quarry Cluster, Dakshina Kannada',
      surveyNo: 'Survey No. 119/4',
      areaAcres: 18.0,
      estimatedYieldMT: '12,50,000 MT Hard Rock Reserve',
      askingPriceRs: null,
      leaseTerms: '₹45 / MT Royalty + ₹25,00,000 Upfront Security Deposit (10-Yr Lease)',
      roadAccess: 'Heavy-duty quarry haul road directly linked to NH-169 (1.2 km)',
      permits: ['Pollution Control Board Consent to Operate (CTO)', 'SEIAA Environmental Clearance'],
      ownerName: 'Devadas Shetty',
      ownerPhone: '+91 98452 33411',
      matchScore: 94,
      status: 'IN_NEGOTIATION'
    },
    {
      id: 'QLND-103',
      code: 'LAND-KL-09',
      title: 'Strategic Basalt Hard Rock Hillock Plot',
      type: 'FOR_SALE',
      mineralPotential: 'Basalt Black Stone / Highway Grade Aggregates',
      location: 'Mananthavady, Wayanad Corridor',
      surveyNo: 'Survey No. 412/1',
      areaAcres: 8.5,
      estimatedYieldMT: '6,20,000 MT Raw Stone Reserve',
      askingPriceRs: 16500000,
      leaseTerms: null,
      roadAccess: 'Dedicated 9m gravel haul track connecting to State Highway 54',
      permits: ['Revenue Land Tax Clear', 'Forest Buffer Zone Clearance Verified (>500m)'],
      ownerName: 'Thomas Mathew',
      ownerPhone: '+91 94478 99120',
      matchScore: 91,
      status: 'AVAILABLE'
    }
  ]);

  // Land Owner Registration Modal/Form State
  const [ownerForm, setOwnerForm] = useState({
    ownerName: '',
    phone: '',
    district: 'Kasaragod',
    surveyNo: '',
    totalAcres: 5,
    dealType: 'FOR_SALE',
    expectedPriceOrRoyalty: '',
    rockType: 'Laterite Stone'
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleRegisterOwner = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Land registered successfully for ${ownerForm.ownerName}! AI Matchmaking activated.`);
    setActiveTab('land-database');
  };

  const filteredProps = properties.filter(p => {
    const matchType = filterType === 'ALL' || p.type === filterType;
    const matchText = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.surveyNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.mineralPotential.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchText;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-400">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-slate-800 p-6 sm:p-7 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-purple-500/10 text-purple-300 border border-purple-500/30">
                Pillar 7 &bull; Marketplace &amp; Commerce
              </span>
              <span className="text-slate-500 text-xs">&bull; Verified Landowners &amp; Mining Permits</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Landmark className="w-7 h-7 text-purple-400" />
              7. Quarry Land Management
            </h1>
            <div className="mt-2 p-2.5 bg-slate-950/70 rounded-xl border border-purple-500/30 max-w-2xl">
              <span className="text-xs font-bold text-amber-300 font-sans block">
                പ്രാഥമിക ലക്ഷ്യം (Core Purpose):
              </span>
              <p className="text-sm font-semibold text-white mt-0.5 leading-snug">
                &ldquo;ഭൂ ഉടമയ്ക്ക് ശരിയായ buyer / lessee കണ്ടെത്തി deal എത്തിക്കുക&rdquo;
              </p>
              <span className="text-[11px] text-slate-400 block mt-1">
                Connecting quarry land owners directly with vetted quarry operators, crusher unit investors, and mining contractors with end-to-end legal clearance diligence.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('owner-registration')}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/20 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Register Land Owner
            </button>
            <button
              onClick={() => showToast('AI Matchmaking engine matching 28 verified investors with newly listed land holdings.')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Run Investor Match
            </button>
          </div>
        </div>

        {/* Quick KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80 text-xs">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 block text-[11px]">Total Land Parcels</span>
            <span className="text-base font-black text-white mt-0.5 block">142 Properties</span>
            <span className="text-[10px] text-purple-400 font-semibold">1,840 Total Acres</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 block text-[11px]">Active Deals in Negotiation</span>
            <span className="text-base font-black text-amber-400 mt-0.5 block">18 Transactions</span>
            <span className="text-[10px] text-slate-400">Total pipeline: ₹38.4 Cr</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 block text-[11px]">Avg Match Velocity</span>
            <span className="text-base font-black text-emerald-400 mt-0.5 block">14 Days</span>
            <span className="text-[10px] text-slate-400">From listing to buyer LoI</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 block text-[11px]">Active Leases Managed</span>
            <span className="text-base font-black text-blue-400 mt-0.5 block">36 Live Leases</span>
            <span className="text-[10px] text-slate-400">Royalty settlement automated</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none pb-1 border-b border-slate-800">
        {[
          { id: 'land-database', label: 'Quarry Land Database', icon: Landmark },
          { id: 'land-for-sale', label: 'Land for Sale', icon: DollarSign },
          { id: 'land-for-lease', label: 'Land for Lease', icon: Calendar },
          { id: 'investor-matching', label: 'Buyer / Investor Matching', icon: Sparkles },
          { id: 'owner-registration', label: 'Land Owner Registration', icon: Plus },
          { id: 'deal-assistance', label: 'RZ® BOS Deal Assistance', icon: Handshake }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
                isActive
                  ? 'bg-purple-500 text-white border-purple-400 font-bold shadow-md shadow-purple-500/20'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: LAND DATABASE & LISTINGS */}
      {(activeTab === 'land-database' || activeTab === 'land-for-sale' || activeTab === 'land-for-lease') && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search location, survey number, stone type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
              {['ALL', 'FOR_SALE', 'FOR_LEASE'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition text-xs whitespace-nowrap cursor-pointer ${
                    filterType === type
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {type === 'ALL' ? 'All Land Listings' : type === 'FOR_SALE' ? 'Land for Sale' : 'Land for Lease'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProps.map(property => (
              <div
                key={property.id}
                className="bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-5 shadow-xl transition space-y-4"
              >
                <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                        {property.code}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        property.type === 'FOR_SALE'
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                          : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                      }`}>
                        {property.type.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white mt-1.5 leading-snug">{property.title}</h3>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-purple-400" />
                      <span>{property.location}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs text-slate-400 block">Valuation / Terms</span>
                    {property.askingPriceRs ? (
                      <span className="text-sm font-black text-white font-mono">
                        ₹{(property.askingPriceRs / 10000000).toFixed(2)} Cr
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-amber-300">
                        Royalty / Lease
                      </span>
                    )}
                    <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">
                      AI Match: {property.matchScore}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Total Area &amp; Survey</span>
                    <span className="font-bold text-slate-200">{property.areaAcres} Acres</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{property.surveyNo}</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Mineral Potential</span>
                    <span className="font-bold text-amber-300">{property.mineralPotential}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Reserve: {property.estimatedYieldMT}</span>
                  </div>
                </div>

                {property.leaseTerms && (
                  <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-xs text-amber-200">
                    <strong>Lease Terms:</strong> {property.leaseTerms}
                  </div>
                )}

                <div className="space-y-1 text-xs">
                  <span className="text-[11px] text-slate-400 font-semibold block">Regulatory Permits Status:</span>
                  <div className="flex flex-wrap gap-1">
                    {property.permits.map((p, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400" />
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60 text-slate-400">
                  <div>
                    <span className="block text-[11px]">Owner: <strong className="text-slate-200">{property.ownerName}</strong></span>
                    <span className="block text-[10px] text-slate-500">{property.ownerPhone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => showToast(`Initiated RZ® BOS Deal Assistance & Legal Escrow for ${property.code}`)}
                      className="px-2.5 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 rounded-lg text-xs font-semibold transition"
                    >
                      Assist Deal
                    </button>
                    <button
                      onClick={() => showToast(`Connecting with ${property.ownerName} via RZ® Chat`)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition"
                    >
                      Connect Owner
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: LAND OWNER REGISTRATION */}
      {activeTab === 'owner-registration' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl max-w-2xl mx-auto space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-400" />
              Land Owner Registration &bull; ഭൂ ഉടമ രജിസ്ട്രേഷൻ
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              List your land holding to instantly connect with verified quarry operators and buyers.
            </p>
          </div>

          <form onSubmit={handleRegisterOwner} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Land Owner Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhakrishnan Menon"
                  value={ownerForm.ownerName}
                  onChange={(e) => setOwnerForm({ ...ownerForm, ownerName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Contact Mobile Phone</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +91 98470 12345"
                  value={ownerForm.phone}
                  onChange={(e) => setOwnerForm({ ...ownerForm, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">District / Taluk</label>
                <input
                  type="text"
                  required
                  value={ownerForm.district}
                  onChange={(e) => setOwnerForm({ ...ownerForm, district: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Survey Number(s)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 182/1, 182/3"
                  value={ownerForm.surveyNo}
                  onChange={(e) => setOwnerForm({ ...ownerForm, surveyNo: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Total Land Area (Acres)</label>
                <input
                  type="number"
                  required
                  min="0.5"
                  step="0.1"
                  value={ownerForm.totalAcres}
                  onChange={(e) => setOwnerForm({ ...ownerForm, totalAcres: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Preferred Deal Type</label>
                <select
                  value={ownerForm.dealType}
                  onChange={(e) => setOwnerForm({ ...ownerForm, dealType: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl focus:outline-none focus:border-purple-500"
                >
                  <option value="FOR_SALE">Outright Sale (വില്പന)</option>
                  <option value="FOR_LEASE">Long-Term Quarry Lease (പാട്ടം / വാടക)</option>
                  <option value="ROYALTY_SHARING">Per-Ton Royalty Sharing (റോയൽറ്റി ഷെയറിങ്)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Mineral / Rock Reserve Type</label>
                <select
                  value={ownerForm.rockType}
                  onChange={(e) => setOwnerForm({ ...ownerForm, rockType: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl focus:outline-none focus:border-purple-500"
                >
                  <option value="Laterite Stone">Laterite Stone (ചെങ്കല്ല്)</option>
                  <option value="Granite Blue Metal">Granite Blue Metal (ഗ്രാനൈറ്റ് / മെറ്റൽ)</option>
                  <option value="Basalt Hard Rock">Basalt Hard Rock (കരിങ്കല്ല്)</option>
                  <option value="Gravel & Soil">Gravel &amp; Filling Soil (മണ്ണ് / ഗ്രാവൽ)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Expected Asking Price / Royalty Expectations</label>
              <input
                type="text"
                placeholder="e.g. ₹1.8 Cr total or ₹50 per MT royalty"
                value={ownerForm.expectedPriceOrRoyalty}
                onChange={(e) => setOwnerForm({ ...ownerForm, expectedPriceOrRoyalty: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('land-database')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 transition"
              >
                Submit Land Registration
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB CONTENT: INVESTOR MATCHING & DEAL ASSISTANCE */}
      {(activeTab === 'investor-matching' || activeTab === 'deal-assistance') && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                AI-Powered Buyer &amp; Investor Matchmaking
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Automated pairing of verified quarry owners, crusher conglomerates, and highway contractors with registered landowners.
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold font-mono">
              Match Engine Online
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Investor Requirement #INV-490</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                  98% Match
                </span>
              </div>
              <p className="text-xs text-slate-300">
                <strong>Investor:</strong> Malabar Infrastructure Consortium<br />
                <strong>Need:</strong> 10-15 Acres Laterite Stone Quarry with Panchayat NOC within Kasaragod or Kannur districts.<br />
                <strong>Budget:</strong> ₹2.5 Cr immediate settlement.
              </p>
              <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20 text-[11px] text-purple-300">
                Matched with: <strong>LAND-KL-01 (12.5 Acres, Kasaragod)</strong>
              </div>
              <button
                onClick={() => showToast('Scheduled deal consultation between Landowner and Malabar Consortium.')}
                className="w-full py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg transition"
              >
                Initiate RZ® Deal Conference
              </button>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Investor Requirement #INV-512</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  94% Match
                </span>
              </div>
              <p className="text-xs text-slate-300">
                <strong>Investor:</strong> Dakshina Crusher Plant JV<br />
                <strong>Need:</strong> Long-term lease for 15+ Acres Granite Rock for 200 TPH Crusher unit.<br />
                <strong>Budget:</strong> Up to ₹50/MT royalty + ₹30 Lakhs security deposit.
              </p>
              <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20 text-[11px] text-purple-300">
                Matched with: <strong>LAND-KA-04 (18 Acres, Moodbidri)</strong>
              </div>
              <button
                onClick={() => showToast('Scheduled deal consultation between Landowner and Dakshina Crusher JV.')}
                className="w-full py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg transition"
              >
                Initiate RZ® Deal Conference
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
