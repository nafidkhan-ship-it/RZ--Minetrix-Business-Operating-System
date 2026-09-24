import React, { useState, useEffect } from 'react';
import {
  Pickaxe, Factory, Building2, ShoppingBag, Truck, Cpu,
  Layers, ShieldCheck, Sparkles, CheckCircle2, Search, Filter,
  TrendingUp, Activity, Fuel, Wrench, BarChart3, Clock, MapPin,
  FileText, QrCode, DollarSign, Calculator, RefreshCw, AlertTriangle,
  ChevronRight, Phone, Eye, ArrowUpRight, Zap, Scale, PackageCheck,
  Compass, Camera, ShieldAlert, Award, FileSpreadsheet, HardHat,
  Sliders, ArrowDownRight, Share2, Hammer, Coins
} from 'lucide-react';

import {
  MINING_BUSINESS_TYPES,
  BUILDING_MATERIALS_CATALOG,
  MOCK_PUBLIC_ORDERS,
  MOCK_LATERITE_CUTTING_LOGS,
  MOCK_CRUSHER_SHIFT_LOGS,
  MOCK_LAND_OWNERS,
  MOCK_EQUIPMENT_RENTALS,
  MOCK_USED_MARKETPLACE,
  MOCK_QUALITY_LOGS,
  MOCK_SAFETY_LOGS,
  MOCK_BOQ_PROJECTS,
  MOCK_DRONE_SURVEYS,
  BuildingMaterialItem,
  PublicCustomerOrder
} from '../data/miningPlatformPhase17Data';

import { QuarryActiveContextBar } from './quarry/QuarryActiveContextBar';
import { QuarryProductsView } from './quarry/QuarryProductsView';
import { QuarryProductionStockView } from './quarry/QuarryProductionStockView';
import { QuarryGatePassDispatchView } from './quarry/QuarryGatePassDispatchView';
import { QuarryLandLeasesView } from './quarry/QuarryLandLeasesView';
import { QuarryMaster, quarryApiClient } from '../services/quarryApiClient';
import { apiClient, AuthUser } from '../services/apiClient';

const DEFAULT_DEMO_QUARRY: QuarryMaster = {
  id: 'quarry-laterite-01',
  tenantId: 'tenant-rz-global',
  companyId: 'comp-rz-corp-01',
  branchId: 'br-bangalore-01',
  name: 'RZ Laterite & Stone Pit - Zone A',
  quarryType: 'LATERITE',
  location: 'Malappuram & Mangalore Clusters',
  address: 'Mining Sector 4B, South Zone',
  status: 'ACTIVE',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z'
};

export const MiningOperationsPhase17Section: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'business-models'
    | 'land-management'
    | 'building-materials'
    | 'production-stock'
    | 'public-portal'
    | 'pricing-dispatch'
    | 'machinery-rental'
    | 'quality-safety-fuel'
    | 'construction-gis'
    | 'ai-analytics'
    | 'shared-core'
  >('business-models');

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Active Quarry & Auth Context (Real Quarry API)
  const [quarries, setQuarries] = useState<QuarryMaster[]>([DEFAULT_DEMO_QUARRY]);
  const [activeQuarry, setActiveQuarry] = useState<QuarryMaster>(DEFAULT_DEMO_QUARRY);
  const [quarriesLoading, setQuarriesLoading] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(apiClient.getAuthUser());

  const fetchQuarries = async () => {
    setQuarriesLoading(true);
    const res = await quarryApiClient.listQuarries();
    setQuarriesLoading(false);
    if (res.success && res.data && res.data.length > 0) {
      setQuarries(res.data);
      if (!res.data.some(q => q.id === activeQuarry.id)) {
        setActiveQuarry(res.data[0]);
      }
    }
  };

  useEffect(() => {
    fetchQuarries();
  }, []);

  const handleAuthChange = () => {
    setAuthUser(apiClient.getAuthUser());
  };

  // Public Order Platform state
  const [publicOrders, setPublicOrders] = useState<PublicCustomerOrder[]>(MOCK_PUBLIC_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<PublicCustomerOrder | null>(MOCK_PUBLIC_ORDERS[0]);
  const [newOrderForm, setNewOrderForm] = useState({
    customerName: '',
    customerPhone: '',
    deliveryAddress: '',
    materialName: 'Washed Manufactured Sand (M-Sand Concrete Grade)',
    quantity: 10
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderForm.customerName || !newOrderForm.customerPhone) {
      showToast('Please fill in customer name and phone number');
      return;
    }

    const createdOrder: PublicCustomerOrder = {
      orderId: `ORD-2026-${Math.floor(8800 + Math.random() * 1000)}`,
      customerName: newOrderForm.customerName,
      customerPhone: newOrderForm.customerPhone,
      deliveryAddress: newOrderForm.deliveryAddress || 'Site Delivery',
      materialName: newOrderForm.materialName,
      quantityOrdered: Number(newOrderForm.quantity),
      uom: 'Ton',
      totalPriceGstIncl: Number(newOrderForm.quantity) * 785 * 1.05,
      orderStatus: 'BOOKED',
      assignedVehicleNo: 'KA-19-MC-8812',
      liveGpsCoordinates: { lat: 12.9141, lng: 74.856 },
      estimatedDeliveryTime: 'Dispatched from Scalehouse'
    };

    setPublicOrders([createdOrder, ...publicOrders]);
    setSelectedOrder(createdOrder);
    setNewOrderForm({ customerName: '', customerPhone: '', deliveryAddress: '', materialName: 'Washed Manufactured Sand (M-Sand Concrete Grade)', quantity: 10 });
    showToast('Public Order Booked Successfully! E-Way bill & GPS tracking activated.');
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Banner Header */}
      <div className="relative bg-gradient-to-r from-amber-950 via-slate-900 to-amber-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <Pickaxe className="w-4 h-4 text-amber-400" /> Phase 17 Enterprise Mining Operations Platform
            </span>
            <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold rounded-full">
              Multi-Tenant Shared Core Integrated
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            RZ® Minetrix BOS — Mining, Crusher &amp; Building Materials Platform
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-4xl leading-relaxed">
            19 Enterprise Mining Modules: Laterite Stone Cutting, Granite Blocks, Hard Rock Blasting, Crusher Plants (M-Sand/P-Sand), 25+ Building Materials, Public E-Commerce Order Portal, Smart Pricing, Drone LiDAR Stockpile GIS, Equipment Marketplace &amp; AI Mining Command Center.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs flex items-center gap-2 font-mono">
              <Factory className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400">Active Crushers:</span>
              <strong className="text-white">4 Primary Plants</strong>
            </div>
            <div className="px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs flex items-center gap-2 font-mono">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-400">Daily Tonnage:</span>
              <strong className="text-emerald-400">3,480.5 Tons</strong>
            </div>
            <div className="px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs flex items-center gap-2 font-mono">
              <ShoppingBag className="w-4 h-4 text-blue-400" />
              <span className="text-slate-400">Public Portal Orders:</span>
              <strong className="text-blue-400">142 Live Today</strong>
            </div>
            <div className="px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs flex items-center gap-2 font-mono">
              <Compass className="w-4 h-4 text-purple-400" />
              <span className="text-slate-400">Drone LiDAR Accuracy:</span>
              <strong className="text-purple-300">99.6% Volume</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Active Quarry Master & Real RBAC Context Bar */}
      <QuarryActiveContextBar
        activeQuarry={activeQuarry}
        quarries={quarries}
        loading={quarriesLoading}
        onSelectQuarry={setActiveQuarry}
        onRefreshQuarries={fetchQuarries}
        authUser={authUser}
        onAuthChange={handleAuthChange}
      />

      {/* Primary Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
        <button
          onClick={() => setActiveTab('business-models')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
            activeTab === 'business-models' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          1. Business Types &amp; Organization
        </button>

        <button
          onClick={() => setActiveTab('land-management')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
            activeTab === 'land-management' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Coins className="w-4 h-4" />
          2. Land Owner &amp; Lease Royalties
        </button>

        <button
          onClick={() => setActiveTab('building-materials')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
            activeTab === 'building-materials' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          3. Building Materials Engine
        </button>

        <button
          onClick={() => setActiveTab('production-stock')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
            activeTab === 'production-stock' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Pickaxe className="w-4 h-4" />
          4. Production &amp; Stockyard
        </button>

        <button
          onClick={() => setActiveTab('public-portal')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
            activeTab === 'public-portal' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          5. Public Order Portal
        </button>

        <button
          onClick={() => setActiveTab('pricing-dispatch')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
            activeTab === 'pricing-dispatch' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Scale className="w-4 h-4" />
          6. Pricing, Dispatch &amp; Weighbridge
        </button>

        <button
          onClick={() => setActiveTab('machinery-rental')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
            activeTab === 'machinery-rental' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Wrench className="w-4 h-4" />
          7. Machinery, Rental &amp; Marketplace
        </button>

        <button
          onClick={() => setActiveTab('quality-safety-fuel')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
            activeTab === 'quality-safety-fuel' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <HardHat className="w-4 h-4" />
          8. Quality Lab, Safety &amp; Fuel
        </button>

        <button
          onClick={() => setActiveTab('construction-gis')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
            activeTab === 'construction-gis' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Compass className="w-4 h-4" />
          9. Construction BOQ &amp; Drone GIS
        </button>

        <button
          onClick={() => setActiveTab('ai-analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
            activeTab === 'ai-analytics' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Cpu className="w-4 h-4" />
          10. AI Command Center &amp; Analytics
        </button>

        <button
          onClick={() => setActiveTab('shared-core')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
            activeTab === 'shared-core' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          11. Ecosystem &amp; Shared Core
        </button>
      </div>

      {/* TAB 1: BUSINESS MODELS */}
      {activeTab === 'business-models' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" /> Module 1: Configurable Mining Business Model Engines
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              RZ® Minetrix BOS supports flexible, zero-code business model configurations. Switch between individual quarry operations, crusher aggregate units, multi-material supply depots, or fully integrated enterprise mining entities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MINING_BUSINESS_TYPES.map((biz) => (
              <div key={biz.id} className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-6 space-y-4 shadow-xl transition-all">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-amber-400">{biz.name}</h3>
                  {biz.isConfigurable && (
                    <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold rounded-full">
                      Zero-Code Configurable
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{biz.description}</p>

                <div className="space-y-2 text-xs">
                  <span className="text-slate-400 font-semibold block">Supported Products:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {biz.supportedProducts.map((p, pIdx) => (
                      <span key={pIdx} className="px-2 py-1 bg-slate-950 border border-slate-800 text-slate-200 font-mono text-[11px] rounded-lg">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 text-xs pt-2 border-t border-slate-800">
                  <span className="text-slate-400 font-semibold block">Key Process Workflows:</span>
                  <ul className="space-y-1 text-slate-300 font-mono text-[11px]">
                    {biz.keyProcessWorkflows.map((wf, wIdx) => (
                      <li key={wIdx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>{wf}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Default Royalty Tariff:</span>
                  <span className="text-amber-300 font-bold">{biz.defaultRoyaltyType}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: LAND MANAGEMENT */}
      {activeTab === 'land-management' && (
        <QuarryLandLeasesView activeQuarry={activeQuarry} />
      )}

      {/* TAB 3: BUILDING MATERIALS ENGINE */}
      {activeTab === 'building-materials' && (
        <QuarryProductsView activeQuarry={activeQuarry} />
      )}

      {/* TAB 4: PRODUCTION & STOCK YARD */}
      {activeTab === 'production-stock' && (
        <QuarryProductionStockView activeQuarry={activeQuarry} />
      )}

      {/* TAB 5: PUBLIC ORDER PORTAL */}
      {activeTab === 'public-portal' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Placement Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShoppingBag className="w-5 h-5 text-amber-400" /> Module 5: Public Customer Booking Portal
            </h3>

            <form onSubmit={handleCreateOrder} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Customer / Contractor Name</label>
                <input
                  type="text"
                  placeholder="e.g. Mangalore Highway Infra Pvt Ltd"
                  value={newOrderForm.customerName}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, customerName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Contact Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={newOrderForm.customerPhone}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, customerPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Site Delivery Address</label>
                <textarea
                  placeholder="Plot / Site location address for GPS dispatch..."
                  value={newOrderForm.deliveryAddress}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, deliveryAddress: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 h-16"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Material</label>
                <select
                  value={newOrderForm.materialName}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, materialName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                >
                  <option>Washed Manufactured Sand (M-Sand Concrete Grade)</option>
                  <option>Plastering Manufactured Sand (P-Sand Fine)</option>
                  <option>20mm Crushed Blue Metal Aggregate</option>
                  <option>40mm Crushed Metal (Sub-Base)</option>
                  <option>Laterite Stone Grade A (30x20x15 cm)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Quantity (Tons / Pieces)</label>
                <input
                  type="number"
                  value={newOrderForm.quantity}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, quantity: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold rounded-xl shadow-lg transition-all"
              >
                Submit Order &amp; Request Instant Dispatch
              </button>
            </form>
          </div>

          {/* Active Orders List */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>Live Public Delivery Tracking Portal</span>
              <span className="text-xs font-mono text-amber-400">{publicOrders.length} Orders Active</span>
            </h3>

            <div className="space-y-3">
              {publicOrders.map((ord) => (
                <div
                  key={ord.orderId}
                  onClick={() => setSelectedOrder(ord)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    selectedOrder?.orderId === ord.orderId
                      ? 'bg-slate-950 border-amber-500 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-400 font-bold">{ord.orderId}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      ord.orderStatus === 'IN_TRANSIT' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {ord.orderStatus}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{ord.customerName}</h4>
                    <span className="text-xs font-mono text-emerald-400 font-bold">₹{ord.totalPriceGstIncl.toLocaleString()}</span>
                  </div>

                  <p className="text-xs text-slate-400 font-mono">
                    {ord.quantityOrdered} {ord.uom} of {ord.materialName}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 font-mono border-t border-slate-800/80">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-amber-400" /> Vehicle: {ord.assignedVehicleNo}
                    </span>
                    <span className="flex items-center gap-1 text-amber-300">
                      <Clock className="w-3.5 h-3.5" /> {ord.estimatedDeliveryTime}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: PRICING, DISPATCH & WEIGHBRIDGE */}
      {activeTab === 'pricing-dispatch' && (
        <QuarryGatePassDispatchView activeQuarry={activeQuarry} />
      )}

      {/* TAB 7: MACHINERY, RENTAL & MARKETPLACE */}
      {activeTab === 'machinery-rental' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Modules 9, 10 &amp; 11</span>
                <h2 className="text-xl font-bold text-white mt-1">Equipment Telematics, Fleet Rentals &amp; Used Machine Marketplace</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rental Listings */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-amber-400" /> Machinery Equipment Rentals
                </h3>
                <div className="space-y-2">
                  {MOCK_EQUIPMENT_RENTALS.map((rent) => (
                    <div key={rent.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-mono">
                      <div>
                        <strong className="text-white block">{rent.modelName}</strong>
                        <span className="text-slate-400 text-[11px]">{rent.currentLocation}</span>
                      </div>
                      <div className="text-right">
                        <strong className="text-amber-400 block">₹{rent.hourlyRate.toLocaleString()} / Hr</strong>
                        <span className="text-emerald-400 text-[10px]">{rent.availabilityStatus}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Used Marketplace */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-400" /> Used Machinery Marketplace
                </h3>
                <div className="space-y-2">
                  {MOCK_USED_MARKETPLACE.map((mkt) => (
                    <div key={mkt.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-xs font-mono">
                      <div className="flex justify-between font-bold">
                        <span className="text-white">{mkt.title}</span>
                        <span className="text-emerald-400">₹{(mkt.askingPrice / 100000).toFixed(2)} Lakhs</span>
                      </div>
                      <div className="flex justify-between text-slate-400 text-[11px]">
                        <span>Year {mkt.year} • {mkt.operatingHours} Hrs</span>
                        <span className="text-amber-300">Score: {mkt.certifiedInspectionScore}/100</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: QUALITY, SAFETY & FUEL */}
      {activeTab === 'quality-safety-fuel' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Modules 12, 13 &amp; 14</span>
            <h2 className="text-xl font-bold text-white mt-1">Quality Control Lab (IS 2386), Safety Compliance &amp; Fuel Bowser Logs</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* QC Lab */}
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3 font-mono">
              <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Quality Control Lab (IS 2386)
              </h4>
              {MOCK_QUALITY_LOGS.map((qc) => (
                <div key={qc.id} className="p-2.5 bg-slate-900 rounded border border-slate-800 space-y-1 text-[11px]">
                  <div className="flex justify-between font-bold">
                    <span className="text-white">{qc.batchNo}</span>
                    <span className="text-emerald-300">{qc.labStatus}</span>
                  </div>
                  <div className="text-slate-400">Flakiness: {qc.flakinessIndexPercent}% • Crushing: {qc.crushingValuePercent}%</div>
                </div>
              ))}
            </div>

            {/* Safety & Environment */}
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3 font-mono">
              <h4 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                <HardHat className="w-4 h-4" /> Safety &amp; PCB Environmental
              </h4>
              {MOCK_SAFETY_LOGS.map((saf) => (
                <div key={saf.id} className="p-2.5 bg-slate-900 rounded border border-slate-800 space-y-1 text-[11px]">
                  <div className="flex justify-between font-bold">
                    <span className="text-white">{saf.incidentType}</span>
                    <span className="text-amber-300">{saf.severity}</span>
                  </div>
                  <p className="text-slate-400">{saf.correctiveAction}</p>
                </div>
              ))}
            </div>

            {/* Fuel & Bowser */}
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3 font-mono">
              <h4 className="text-sm font-bold text-purple-400 flex items-center gap-1.5">
                <Fuel className="w-4 h-4" /> Fuel Management &amp; Bowser
              </h4>
              <div className="space-y-1.5 text-slate-300 text-[11px]">
                <div className="flex justify-between"><span>Diesel Storage Tank #1:</span><strong className="text-emerald-400">18,500 Liters</strong></div>
                <div className="flex justify-between"><span>Mobile Bowser #1:</span><strong className="text-white">4,200 Liters</strong></div>
                <div className="flex justify-between"><span>Average Burn Rate:</span><span>14.2 L / Ton Yield</span></div>
                <div className="flex justify-between text-amber-300 font-bold border-t border-slate-800/80 pt-1"><span>AI Fuel Anti-Theft:</span><span>0 Anomalies</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: CONSTRUCTION BOQ & DRONE GIS */}
      {activeTab === 'construction-gis' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Modules 15 &amp; 16</span>
            <h2 className="text-xl font-bold text-white mt-1">Construction Project BOQ Platform &amp; Drone LiDAR GIS Stockpile Volumetrics</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
            {/* BOQ Projects */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" /> Project BOQ Material Requirements
              </h3>
              {MOCK_BOQ_PROJECTS.map((boq) => (
                <div key={boq.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-amber-400">{boq.projectName}</span>
                    <span className="text-emerald-400">{boq.materialFulfillmentPercent}% Fulfilled</span>
                  </div>
                  <div className="text-slate-300 text-[11px]">
                    Required: {boq.requiredMSandTons}T M-Sand, {boq.required20mmTons}T 20mm, {boq.requiredLateritePieces} Laterite Blocks
                  </div>
                </div>
              ))}
            </div>

            {/* Drone LiDAR Stockpile */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-purple-400" /> Drone LiDAR Stockpile Volumetrics
              </h3>
              {MOCK_DRONE_SURVEYS.map((drn) => (
                <div key={drn.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-purple-300">{drn.stockpileId} ({drn.materialName})</span>
                    <span className="text-emerald-400">{drn.accuracyPercent}% Accuracy</span>
                  </div>
                  <div className="text-slate-300 text-[11px]">
                    Volume: {drn.calculatedVolumeCuM} m³ • Tonnage: {drn.estimatedTonnage} Tons • Pilot: {drn.dronePilot}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 10: AI COMMAND CENTER & ANALYTICS */}
      {activeTab === 'ai-analytics' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
              <Cpu className="w-4 h-4" /> Modules 17 &amp; 18: AI Mining Command Center &amp; Enterprise Profitability Analytics
            </span>
            <h2 className="text-xl font-bold text-white mt-1">Autonomous Production Forecasting &amp; Executive Intelligence</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <TrendingUp className="w-4 h-4" /> AI Demand &amp; Production Forecast
              </div>
              <p className="text-slate-300 leading-relaxed">
                Predicts M-Sand demand increase of +24% for next week based on regional highway project schedules and seasonal rainfall patterns.
              </p>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Fuel className="w-4 h-4" /> Fuel Optimization Copilot
              </div>
              <p className="text-slate-300 leading-relaxed">
                Identified 12.4 Liters/Hour excess idle fuel burn on Excavator EX-04 during bench haul waits. Recommends shift queue adjustments.
              </p>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-purple-400 font-bold">
                <Wrench className="w-4 h-4" /> Preventive Machine Health
              </div>
              <p className="text-slate-300 leading-relaxed">
                Primary Jaw Crusher bearing vibration telemetry indicates 88% liner wear. Automated maintenance ticket generated for Sunday stoppage.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 11: ECOSYSTEM & SHARED CORE */}
      {activeTab === 'shared-core' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Module 19: Ecosystem Integration &amp; Shared Core Reuse Matrix
            </span>
            <h2 className="text-xl font-bold text-white mt-1">Non-Duplicative Multi-Tenant Platform Architecture (Phase 16A–16K)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {[
              { core: 'Finance & General Ledger', mining: 'Automated revenue posting from weighbridge gate passes & royalty deductions' },
              { core: 'HRMS & Payroll', mining: 'Quarry operator attendance, shift rosters, and driver tripping allowances' },
              { core: 'Workflow & Approval Engine', mining: 'Multi-level approval for blasting permits & machinery POs above ₹5 Lakhs' },
              { core: 'Notification & Comms Hub', mining: 'Instant WhatsApp & SMS dispatch gate pass receipts to drivers & customers' },
              { core: 'AI Suite (Gemini GenAI)', mining: 'Predictive fuel burn algorithms, yield optimization & natural language query' },
              { core: 'Shared Masters & DMS', mining: 'Centralized customer/vendor directory and statutory lease PDF document storage' }
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-amber-400 font-bold block">{item.core}</span>
                <p className="text-slate-300 text-[11px]">{item.mining}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
