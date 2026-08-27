import React, { useState, useEffect, useCallback } from 'react';
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
import { apiClient } from '../services/apiClient';

interface QuarrySiteRecord {
  id: string;
  code: string;
  name: string;
  mineralType: string;
  operationalStatus: string;
  capacityTons?: number;
}

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

  // Building Materials state
  const [searchMaterial, setSearchMaterial] = useState('');
  const [selectedMaterialCategory, setSelectedMaterialCategory] = useState<string>('All');
  const [materialCatalog] = useState<BuildingMaterialItem[]>(BUILDING_MATERIALS_CATALOG);

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

  // Laterite Cutting state
  const [lateriteLogs, setLateriteLogs] = useState(MOCK_LATERITE_CUTTING_LOGS);
  const [cuttingForm, setCuttingForm] = useState({
    siteName: 'Bantwal Quarry Bench #1',
    grade: 'Grade A (Structural)',
    dimensions: '30 x 20 x 15 cm',
    piecesCut: 500,
    freePieces: 15,
    operator: 'Ramesh Gowda'
  });

  // Crusher state
  const [crusherLog] = useState(MOCK_CRUSHER_SHIFT_LOGS);

  const [quarries, setQuarries] = useState<QuarrySiteRecord[]>([]);
  const [quarriesLoading, setQuarriesLoading] = useState(false);
  const [quarryForm, setQuarryForm] = useState({
    code: '',
    name: '',
    mineralType: 'HARD_ROCK',
    capacityTons: 1000
  });
  const [erpProducts, setErpProducts] = useState<Array<{ id: string; code: string; name: string }>>([]);
  const [productionBatches, setProductionBatches] = useState<Array<{ id: string; batchNumber: string; status: string; totalQuantity: number }>>([]);
  const [stockBalances, setStockBalances] = useState<Array<{ id: string; productId: string; quantity: number; quantityUom: string }>>([]);
  const [landParcels, setLandParcels] = useState<Array<{ id: string; surveyNumber: string; ownerName: string; acreage?: number; villageTaluk?: string }>>([]);
  const [gatePasses, setGatePasses] = useState<Array<{ id: string; gatePassNumber: string; status: string }>>([]);
  const [settlements, setSettlements] = useState<Array<{ id: string; settlementNumber: string; grossAmount: number; netAmount: number; quantity: number }>>([]);
  const [auditEntries, setAuditEntries] = useState<Array<{ action: string; module?: string; resource?: string; status?: string; createdAt: string }>>([]);
  const [crmOrders, setCrmOrders] = useState<Array<{ id: string; orderNumber: string; status: string; totalAmount: number }>>([]);
  const [crmForm, setCrmForm] = useState({
    companyName: '',
    contactName: '',
    quarryId: '',
    productId: '',
    quantity: 4,
    unitPrice: 640,
    vehicleNumber: '',
    driverName: ''
  });
  const [productForm, setProductForm] = useState({ code: '', name: '20mm Aggregate', category: 'Crushed Aggregate' });
  const [productionForm, setProductionForm] = useState({
    quarryId: '',
    productId: '',
    quantity: 10,
    shiftName: 'A'
  });
  const [dispatchForm, setDispatchForm] = useState({
    quarryId: '',
    productId: '',
    customerCode: '',
    customerName: '',
    vehicleNumber: '',
    driverName: '',
    quantity: 5
  });
  const [parcelForm, setParcelForm] = useState({
    surveyNumber: '',
    ownerName: '',
    villageTaluk: 'Bantwal',
    acreage: 4.5
  });
  const [settlementForm, setSettlementForm] = useState({
    quarryId: '',
    landParcelId: '',
    productionBatchId: '',
    ratePerUom: 80,
    deductions: 25
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const loadQuarries = useCallback(async () => {
    if (!apiClient.getAuthToken()) {
      setQuarries([]);
      return;
    }
    setQuarriesLoading(true);
    const res = await apiClient.listQuarries();
    if (res.success && Array.isArray(res.data)) {
      setQuarries(res.data);
    } else if (res.error === 'NETWORK_ERROR' || res.message) {
      showToast(res.message || 'Unable to load quarry sites');
    }
    setQuarriesLoading(false);
  }, []);

  const loadErpOperations = useCallback(async () => {
    if (!apiClient.getAuthToken()) return;
    const [products, batches, stock, parcels, passes, stmts, audit, orders] = await Promise.all([
      apiClient.listProducts(),
      apiClient.listProductionBatches(),
      apiClient.listStockBalances(),
      apiClient.listLandParcels(),
      apiClient.listGatePasses(),
      apiClient.listSettlements(),
      apiClient.getAuditLogs(),
      apiClient.listOrders()
    ]);
    if (products.success && Array.isArray(products.data)) setErpProducts(products.data);
    if (batches.success && Array.isArray(batches.data)) setProductionBatches(batches.data);
    if (stock.success && Array.isArray(stock.data)) setStockBalances(stock.data);
    if (parcels.success && Array.isArray(parcels.data)) setLandParcels(parcels.data);
    if (passes.success && Array.isArray(passes.data)) setGatePasses(passes.data);
    if (stmts.success && Array.isArray(stmts.data)) setSettlements(stmts.data);
    if (audit.success && Array.isArray(audit.data)) setAuditEntries(audit.data);
    if (orders.success && Array.isArray(orders.data)) setCrmOrders(orders.data);
  }, []);

  useEffect(() => {
    if (activeTab === 'land-management' || activeTab === 'production-stock' || activeTab === 'pricing-dispatch' || activeTab === 'building-materials') {
      loadQuarries();
      loadErpOperations();
    }
  }, [activeTab, loadQuarries, loadErpOperations]);

  const handleCreateQuarry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiClient.getAuthToken()) {
      showToast('Login via Shared Core to register quarry sites');
      return;
    }
    if (!quarryForm.code.trim() || !quarryForm.name.trim()) {
      showToast('Quarry code and name are required');
      return;
    }
    const res = await apiClient.createQuarry({
      code: quarryForm.code.trim().toUpperCase(),
      name: quarryForm.name.trim(),
      mineralType: quarryForm.mineralType,
      operationalStatus: 'ACTIVE',
      capacityTons: Number(quarryForm.capacityTons)
    });
    if (res.success) {
      showToast(`Quarry [${quarryForm.code.toUpperCase()}] registered`);
      setQuarryForm({ code: '', name: '', mineralType: 'HARD_ROCK', capacityTons: 1000 });
      await loadQuarries();
    } else {
      showToast(res.message || 'Failed to create quarry');
    }
  };

  const handleCreateProductionBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiClient.getAuthToken()) {
      showToast('Login via Shared Core to post production');
      return;
    }
    if (!productionForm.quarryId || !productionForm.productId) {
      showToast('Select quarry and product');
      return;
    }
    const res = await apiClient.createProductionBatch({
      quarryId: productionForm.quarryId,
      batchNumber: `BAT-${Date.now().toString().slice(-8)}`,
      productionDate: new Date().toISOString().slice(0, 10),
      shiftName: productionForm.shiftName,
      postImmediately: true,
      lines: [{ productId: productionForm.productId, quantity: Number(productionForm.quantity), quantityUom: 'TON' }]
    });
    if (res.success) {
      showToast(`Production posted [${res.data.batchNumber}] — stock increased`);
      await loadErpOperations();
    } else {
      showToast(res.message || 'Failed to post production');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiClient.getAuthToken()) {
      showToast('Login via Shared Core to create products');
      return;
    }
    if (!productForm.code.trim() || !productForm.name.trim()) {
      showToast('Product code and name are required');
      return;
    }
    const res = await apiClient.createProduct({
      code: productForm.code.trim().toUpperCase(),
      name: productForm.name.trim(),
      category: productForm.category,
      defaultUom: 'TON',
      gstPercent: 5
    });
    if (res.success) {
      showToast(`Product [${productForm.code.toUpperCase()}] created`);
      setProductForm({ code: '', name: '20mm Aggregate', category: 'Crushed Aggregate' });
      await loadErpOperations();
    } else {
      showToast(res.message || 'Failed to create product');
    }
  };

  const handleCreateLiveDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiClient.getAuthToken()) {
      showToast('Login via Shared Core to create a gate pass');
      return;
    }
    if (!dispatchForm.quarryId || !dispatchForm.productId || !dispatchForm.customerName || !dispatchForm.vehicleNumber || !dispatchForm.driverName) {
      showToast('Complete quarry, product, customer, vehicle and driver');
      return;
    }
    const customer = await apiClient.createCustomer({
      code: dispatchForm.customerCode.trim().toUpperCase() || `CUST-${Date.now().toString().slice(-6)}`,
      name: dispatchForm.customerName.trim(),
      destination: 'Site delivery'
    });
    if (!customer.success) {
      showToast(customer.message || 'Failed to create customer');
      return;
    }
    const gatePass = await apiClient.createGatePass({
      gatePassNumber: `GP-${Date.now().toString().slice(-8)}`,
      quarryId: dispatchForm.quarryId,
      customerId: customer.data.id,
      vehicleNumber: dispatchForm.vehicleNumber,
      driverName: dispatchForm.driverName,
      destination: 'Site delivery',
      lines: [{ productId: dispatchForm.productId, quantity: Number(dispatchForm.quantity), quantityUom: 'TON' }]
    });
    if (gatePass.success) {
      showToast(`Gate pass ${gatePass.data.gatePassNumber} created as DRAFT`);
      await loadErpOperations();
    } else {
      showToast(gatePass.message || 'Failed to create gate pass');
    }
  };

  const handleGatePassAction = async (gatePassId: string, action: 'approve' | 'issue' | 'cancel') => {
    const res = await apiClient.transitionGatePass(gatePassId, action);
    if (res.success) {
      showToast(`Gate pass ${action}d → ${res.data.status}`);
      await loadErpOperations();
    } else {
      showToast(res.message || `Failed to ${action} gate pass`);
    }
  };

  const handleDispatchGatePass = async (gatePassId: string) => {
    const res = await apiClient.createDispatch({
      dispatchNumber: `DSP-${Date.now().toString().slice(-8)}`,
      gatePassId
    });
    if (res.success) {
      showToast(`Dispatch ${res.data.dispatchNumber} posted — stock decreased`);
      await loadErpOperations();
    } else {
      showToast(res.message || 'Failed to create dispatch');
    }
  };

  const handleCreateParcel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiClient.getAuthToken()) {
      showToast('Login via Shared Core to register land parcels');
      return;
    }
    if (!parcelForm.surveyNumber.trim() || !parcelForm.ownerName.trim()) {
      showToast('Survey number and owner name are required');
      return;
    }
    const res = await apiClient.createLandParcel({
      surveyNumber: parcelForm.surveyNumber.trim(),
      villageTaluk: parcelForm.villageTaluk,
      acreage: Number(parcelForm.acreage),
      ownerName: parcelForm.ownerName.trim()
    });
    if (res.success) {
      showToast(`Land parcel ${parcelForm.surveyNumber} registered`);
      setParcelForm({ surveyNumber: '', ownerName: '', villageTaluk: 'Bantwal', acreage: 4.5 });
      await loadErpOperations();
    } else {
      showToast(res.message || 'Failed to create land parcel');
    }
  };

  const handleCreateSettlement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiClient.getAuthToken()) {
      showToast('Login via Shared Core to create settlement');
      return;
    }
    if (!settlementForm.quarryId || !settlementForm.landParcelId || !settlementForm.productionBatchId) {
      showToast('Select quarry, land parcel, and posted production batch');
      return;
    }
    const rate = await apiClient.createSettlementRate({
      landParcelId: settlementForm.landParcelId,
      quarryId: settlementForm.quarryId,
      ratePerUom: Number(settlementForm.ratePerUom),
      quantityUom: 'TON',
      effectiveFrom: '2026-01-01'
    });
    if (!rate.success) {
      showToast(rate.message || 'Failed to configure settlement rate');
      return;
    }
    const settlement = await apiClient.createSettlement({
      settlementNumber: `STL-${Date.now().toString().slice(-8)}`,
      landParcelId: settlementForm.landParcelId,
      quarryId: settlementForm.quarryId,
      basis: 'PRODUCTION',
      productionBatchId: settlementForm.productionBatchId,
      deductions: Number(settlementForm.deductions),
      statementRef: 'UAT-STMT'
    });
    if (settlement.success) {
      showToast(`Settlement net ₹${settlement.data.netAmount} (gross ₹${settlement.data.grossAmount})`);
      await loadErpOperations();
    } else {
      showToast(settlement.message || 'Failed to create settlement');
    }
  };

  const handleLiveCrmOrderFlow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiClient.getAuthToken()) {
      showToast('Login via Shared Core for CRM orders');
      return;
    }
    if (!crmForm.companyName.trim() || !crmForm.quarryId || !crmForm.productId || !crmForm.vehicleNumber.trim() || !crmForm.driverName.trim()) {
      showToast('Complete company, quarry, product, vehicle and driver');
      return;
    }
    const lead = await apiClient.createLead({
      code: `LD-${Date.now().toString().slice(-6)}`,
      companyName: crmForm.companyName.trim(),
      contactName: crmForm.contactName.trim() || crmForm.companyName.trim(),
      source: 'UI'
    });
    if (!lead.success) {
      showToast(lead.message || 'Failed to create lead');
      return;
    }
    const converted = await apiClient.convertLead(lead.data.id);
    if (!converted.success || !converted.data?.convertedCustomerId) {
      showToast(converted.message || 'Failed to convert lead');
      return;
    }
    await apiClient.createContact({
      customerId: converted.data.convertedCustomerId,
      fullName: crmForm.contactName.trim() || crmForm.companyName.trim(),
      roleTitle: 'Primary'
    });
    const order = await apiClient.createOrder({
      orderNumber: `SO-${Date.now().toString().slice(-8)}`,
      customerId: converted.data.convertedCustomerId,
      quarryId: crmForm.quarryId,
      lines: [{ productId: crmForm.productId, quantity: Number(crmForm.quantity), unitPrice: Number(crmForm.unitPrice), quantityUom: 'TON' }]
    });
    if (!order.success) {
      showToast(order.message || 'Failed to create order');
      return;
    }
    const confirmed = await apiClient.confirmOrder(order.data.id);
    if (!confirmed.success) {
      showToast(confirmed.message || 'Failed to confirm order (need stock)');
      return;
    }
    const gp = await apiClient.createOrderGatePass(order.data.id, {
      gatePassNumber: `GP-SO-${Date.now().toString().slice(-6)}`,
      vehicleNumber: crmForm.vehicleNumber,
      driverName: crmForm.driverName,
      destination: 'Order delivery'
    });
    if (gp.success) {
      showToast(`Order ${order.data.orderNumber} confirmed → gate pass ${gp.data.gatePassNumber} DRAFT`);
      await loadErpOperations();
    } else {
      showToast(gp.message || 'Failed to create order gate pass');
    }
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

  const handleAddCuttingLog = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = {
      cuttingRegisterId: `LAT-REG-${Math.floor(200 + Math.random() * 800)}`,
      quarrySiteName: cuttingForm.siteName,
      stoneGrade: cuttingForm.grade as any,
      dimensionsCm: cuttingForm.dimensions,
      piecesCutToday: Number(cuttingForm.piecesCut),
      freeBonusPiecesCount: Number(cuttingForm.freePieces),
      dressingWastePercent: 4.5,
      calculatedTonnageEquivalent: Math.round(Number(cuttingForm.piecesCut) * 0.053 * 10) / 10,
      operatorName: cuttingForm.operator,
      machineId: 'CUTTER-LAT-09'
    };
    setLateriteLogs([newEntry, ...lateriteLogs]);
    showToast('Laterite cutting register entry recorded & bonus free pieces calculated!');
  };

  const filteredMaterials = materialCatalog.filter(mat => {
    const matchesCat = selectedMaterialCategory === 'All' || mat.category === selectedMaterialCategory;
    const matchesSearch = mat.name.toLowerCase().includes(searchMaterial.toLowerCase()) || mat.code.toLowerCase().includes(searchMaterial.toLowerCase());
    return matchesCat && matchesSearch;
  });

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
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Module 2</span>
              <h2 className="text-xl font-bold text-white mt-1">Land Owner Management, Lease Agreements &amp; Royalty Revenue Share</h2>
            </div>
            <button
              onClick={() => showToast('Initiated new Patta Land Lease Registration workflow!')}
              className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-md"
            >
              + Add Land Lease Record
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Pickaxe className="w-4 h-4 text-amber-400" /> Quarry Site Registry (Live API)
              </h3>
              {!apiClient.getAuthToken() && (
                <p className="text-xs text-slate-400">
                  Login via Phase 16 Shared Core to load and register quarry sites from PostgreSQL.
                </p>
              )}
              <form onSubmit={handleCreateQuarry} className="space-y-3 text-xs">
                <input
                  type="text"
                  placeholder="Quarry code (e.g. QRY-NORTH)"
                  value={quarryForm.code}
                  onChange={(e) => setQuarryForm({ ...quarryForm, code: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white"
                />
                <input
                  type="text"
                  placeholder="Quarry name"
                  value={quarryForm.name}
                  onChange={(e) => setQuarryForm({ ...quarryForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white"
                />
                <select
                  value={quarryForm.mineralType}
                  onChange={(e) => setQuarryForm({ ...quarryForm, mineralType: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white"
                >
                  <option value="HARD_ROCK">Hard Rock</option>
                  <option value="LATERITE">Laterite</option>
                  <option value="GRANITE">Granite</option>
                  <option value="BLUE_METAL">Blue Metal</option>
                </select>
                <button type="submit" className="w-full py-2 bg-amber-500 text-slate-950 font-bold rounded-lg">
                  Register Quarry Site
                </button>
              </form>
              <form onSubmit={handleCreateParcel} className="space-y-3 text-xs border-t border-slate-800 pt-3">
                <h4 className="text-amber-300 font-bold">Land Parcel (Live API)</h4>
                <input placeholder="Survey number" value={parcelForm.surveyNumber} onChange={(e) => setParcelForm({ ...parcelForm, surveyNumber: e.target.value })} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white" />
                <input placeholder="Owner name" value={parcelForm.ownerName} onChange={(e) => setParcelForm({ ...parcelForm, ownerName: e.target.value })} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white" />
                <button type="submit" className="w-full py-2 bg-slate-800 text-amber-300 font-bold rounded-lg">Register Land Parcel</button>
              </form>
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {quarriesLoading && <p className="text-slate-400 text-xs">Loading quarry sites...</p>}
                {!quarriesLoading && quarries.length === 0 && (
                  <p className="text-slate-500 text-xs">No quarry sites registered yet.</p>
                )}
                {quarries.map((quarry) => (
                  <div key={quarry.id} className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs">
                    <div className="font-bold text-amber-300">{quarry.code}</div>
                    <div className="text-white">{quarry.name}</div>
                    <div className="text-slate-400">{quarry.mineralType} · {quarry.operationalStatus}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {landParcels.length > 0 && landParcels.map((parcel) => (
              <div key={parcel.id} className="p-5 bg-slate-950 border border-amber-500/30 rounded-xl space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-amber-400 font-bold">{parcel.surveyNumber}</span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full">LIVE API</span>
                </div>
                <h4 className="text-sm font-bold text-white">{parcel.ownerName}</h4>
                <div className="space-y-1 text-slate-300">
                  <div className="flex justify-between"><span className="text-slate-400">Village / Taluk:</span><span>{parcel.villageTaluk || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Lease Area:</span><span className="text-amber-300 font-bold">{parcel.acreage ?? '—'} Acres</span></div>
                </div>
              </div>
            ))}
            {MOCK_LAND_OWNERS.map((lo) => (
              <div key={lo.id} className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-amber-400 font-bold">{lo.id}</span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full">
                    {lo.status}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white">{lo.ownerName}</h4>

                <div className="space-y-1 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Survey No:</span>
                    <span>{lo.surveyNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Village / Taluk:</span>
                    <span>{lo.villageTaluk}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Lease Area:</span>
                    <span className="text-amber-300 font-bold">{lo.acreage} Acres</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Royalty Tariff:</span>
                    <span className="text-emerald-400">{lo.royaltyTerms}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800/80 pt-1">
                    <span className="text-slate-400">Lease Renewal Expiry:</span>
                    <span className="text-slate-200">{lo.expiryDate}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => showToast(`Downloaded Lease Agreement PDF for ${lo.ownerName}`)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] rounded border border-slate-800 flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" /> View Lease PDF
                  </button>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BUILDING MATERIALS ENGINE */}
      {activeTab === 'building-materials' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Module 3 &amp; Catalog</span>
              <h2 className="text-xl font-bold text-white mt-1">Centralized Building Materials Engine &amp; Stockyard</h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products or SKU codes..."
                  value={searchMaterial}
                  onChange={(e) => setSearchMaterial(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <select
                value={selectedMaterialCategory}
                onChange={(e) => setSelectedMaterialCategory(e.target.value)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="All">All Categories</option>
                <option value="Quarry Stone">Quarry Stone</option>
                <option value="Crushed Aggregate">Crushed Aggregate</option>
                <option value="Sand Product">Sand Product</option>
                <option value="Manufactured Block">Manufactured Block</option>
                <option value="Construction Hardware">Construction Hardware</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {erpProducts.map((product) => (
              <div key={product.id} className="p-4 bg-slate-950 border border-amber-500/40 rounded-xl space-y-3">
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full">LIVE API</span>
                <div className="text-amber-300 font-mono text-[10px]">{product.code}</div>
                <h4 className="text-sm font-bold text-white">{product.name}</h4>
              </div>
            ))}
            {filteredMaterials.map((mat) => (
              <div key={mat.id} className="p-4 bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-xl space-y-3 transition-all">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-slate-900 text-amber-300 font-mono text-[10px] rounded border border-slate-800">
                    {mat.code}
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full">
                    {mat.liveAvailabilityStatus}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white leading-tight">{mat.name}</h4>

                <div className="space-y-1 font-mono text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Stock in Hand:</span>
                    <strong className="text-white">{mat.stockInHand} {mat.unitOfMeasure}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Density Factor:</span>
                    <strong className="text-slate-300">{mat.densityTonPerCft} Ton/CFT</strong>
                  </div>
                  <div className="flex justify-between text-slate-400 border-t border-slate-800/80 pt-1 mt-1">
                    <span>Base Rate (Excl GST):</span>
                    <strong className="text-amber-400">₹{mat.unitPriceGstExcl.toLocaleString()} / {mat.unitOfMeasure}</strong>
                  </div>
                </div>

                <button
                  onClick={() => showToast(`Added ${mat.name} to dispatch order queue`)}
                  className="w-full py-2 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-bold rounded-lg border border-slate-800 transition-all flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Book Order
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PRODUCTION & STOCK YARD */}
      {activeTab === 'production-stock' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Live Production Posting (PostgreSQL + Stock Ledger)</h3>
            {!apiClient.getAuthToken() && (
              <p className="text-xs text-slate-400">Login via Phase 16 Shared Core to post production and update stock.</p>
            )}
            <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <input placeholder="Product code" value={productForm.code} onChange={(e) => setProductForm({ ...productForm, code: e.target.value })} className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white" />
              <input placeholder="Product name" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white" />
              <input placeholder="Category" value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white" />
              <button type="submit" className="py-2 bg-slate-800 text-amber-300 font-bold rounded-xl">Create Product Master</button>
            </form>
            <form onSubmit={handleCreateProductionBatch} className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
              <select
                value={productionForm.quarryId}
                onChange={(e) => setProductionForm({ ...productionForm, quarryId: e.target.value })}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              >
                <option value="">Select quarry</option>
                {quarries.map((quarry) => (
                  <option key={quarry.id} value={quarry.id}>{quarry.code} · {quarry.name}</option>
                ))}
              </select>
              <select
                value={productionForm.productId}
                onChange={(e) => setProductionForm({ ...productionForm, productId: e.target.value })}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              >
                <option value="">Select product</option>
                {erpProducts.map((product) => (
                  <option key={product.id} value={product.id}>{product.code} · {product.name}</option>
                ))}
              </select>
              <input
                type="number"
                min={0.001}
                step="0.001"
                value={productionForm.quantity}
                onChange={(e) => setProductionForm({ ...productionForm, quantity: Number(e.target.value) })}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
              <input
                type="text"
                value={productionForm.shiftName}
                onChange={(e) => setProductionForm({ ...productionForm, shiftName: e.target.value })}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
              <button type="submit" className="py-2 bg-amber-500 text-slate-950 font-bold rounded-xl">Post Production</button>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <h4 className="text-amber-300 font-bold mb-2">Posted batches</h4>
                {productionBatches.length === 0 && <p className="text-slate-500">No live batches yet.</p>}
                {productionBatches.slice(0, 6).map((batch) => (
                  <div key={batch.id} className="flex justify-between border-b border-slate-800 py-1">
                    <span className="text-white">{batch.batchNumber}</span>
                    <span className="text-emerald-400">{batch.status} · {batch.totalQuantity}</span>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="text-emerald-300 font-bold mb-2">Stock balances</h4>
                {stockBalances.length === 0 && <p className="text-slate-500">No live stock yet.</p>}
                {stockBalances.slice(0, 6).map((row) => (
                  <div key={row.id} className="flex justify-between border-b border-slate-800 py-1">
                    <span className="text-slate-300">{row.productId.slice(0, 8)}…</span>
                    <span className="text-white font-bold">{row.quantity} {row.quantityUom}</span>
                  </div>
                ))}
              </div>
            </div>
            <form onSubmit={handleCreateSettlement} className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs border-t border-slate-800 pt-4">
              <select value={settlementForm.quarryId} onChange={(e) => setSettlementForm({ ...settlementForm, quarryId: e.target.value })} className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white">
                <option value="">Quarry</option>
                {quarries.map((quarry) => <option key={quarry.id} value={quarry.id}>{quarry.code}</option>)}
              </select>
              <select value={settlementForm.landParcelId} onChange={(e) => setSettlementForm({ ...settlementForm, landParcelId: e.target.value })} className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white">
                <option value="">Land parcel</option>
                {landParcels.map((parcel) => <option key={parcel.id} value={parcel.id}>{parcel.surveyNumber}</option>)}
              </select>
              <select value={settlementForm.productionBatchId} onChange={(e) => setSettlementForm({ ...settlementForm, productionBatchId: e.target.value })} className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white">
                <option value="">Posted batch</option>
                {productionBatches.filter((batch) => batch.status === 'POSTED').map((batch) => (
                  <option key={batch.id} value={batch.id}>{batch.batchNumber}</option>
                ))}
              </select>
              <input type="number" value={settlementForm.ratePerUom} onChange={(e) => setSettlementForm({ ...settlementForm, ratePerUom: Number(e.target.value) })} className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono" />
              <button type="submit" className="py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl">Create Settlement</button>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <h4 className="text-emerald-300 font-bold mb-2">Settlements</h4>
                {settlements.length === 0 && <p className="text-slate-500">No live settlements yet.</p>}
                {settlements.slice(0, 6).map((row) => (
                  <div key={row.id} className="flex justify-between border-b border-slate-800 py-1">
                    <span className="text-white">{row.settlementNumber}</span>
                    <span className="text-amber-300">gross ₹{row.grossAmount} / net ₹{row.netAmount}</span>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="text-slate-300 font-bold mb-2">Audit trail</h4>
                {auditEntries.length === 0 && <p className="text-slate-500">No audit rows yet.</p>}
                {auditEntries.slice(0, 6).map((row, idx) => (
                  <div key={`${row.createdAt}-${idx}`} className="flex justify-between border-b border-slate-800 py-1">
                    <span className="text-white">{row.action}</span>
                    <span className="text-slate-400">{row.status} · {row.resource}</span>
                  </div>
                ))}
              </div>
            </div>
            <form onSubmit={handleLiveCrmOrderFlow} className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs border-t border-slate-800 pt-4">
              <h4 className="md:col-span-4 text-amber-300 font-bold">Live CRM → Order → Gate Pass</h4>
              <input placeholder="Company / lead" value={crmForm.companyName} onChange={(e) => setCrmForm({ ...crmForm, companyName: e.target.value })} className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white" />
              <input placeholder="Contact name" value={crmForm.contactName} onChange={(e) => setCrmForm({ ...crmForm, contactName: e.target.value })} className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white" />
              <select value={crmForm.quarryId} onChange={(e) => setCrmForm({ ...crmForm, quarryId: e.target.value })} className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white">
                <option value="">Quarry</option>
                {quarries.map((quarry) => <option key={quarry.id} value={quarry.id}>{quarry.code}</option>)}
              </select>
              <select value={crmForm.productId} onChange={(e) => setCrmForm({ ...crmForm, productId: e.target.value })} className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white">
                <option value="">Product</option>
                {erpProducts.map((product) => <option key={product.id} value={product.id}>{product.code}</option>)}
              </select>
              <input type="number" min={0.001} step="0.001" value={crmForm.quantity} onChange={(e) => setCrmForm({ ...crmForm, quantity: Number(e.target.value) })} className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono" />
              <input type="number" min={0} step="0.01" value={crmForm.unitPrice} onChange={(e) => setCrmForm({ ...crmForm, unitPrice: Number(e.target.value) })} className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono" />
              <input placeholder="Vehicle" value={crmForm.vehicleNumber} onChange={(e) => setCrmForm({ ...crmForm, vehicleNumber: e.target.value })} className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white" />
              <input placeholder="Driver" value={crmForm.driverName} onChange={(e) => setCrmForm({ ...crmForm, driverName: e.target.value })} className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white" />
              <button type="submit" className="md:col-span-4 py-2 bg-blue-500 text-slate-950 font-bold rounded-xl">Create Lead, Order, Confirm, Gate Pass</button>
            </form>
            <div className="text-xs font-mono">
              <h4 className="text-blue-300 font-bold mb-2">Live orders</h4>
              {crmOrders.length === 0 && <p className="text-slate-500">No live orders yet.</p>}
              {crmOrders.slice(0, 6).map((row) => (
                <div key={row.id} className="flex justify-between border-b border-slate-800 py-1">
                  <span className="text-white">{row.orderNumber}</span>
                  <span className="text-amber-300">{row.status} · ₹{row.totalAmount}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cutting Register Entry Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <Pickaxe className="w-5 h-5 text-amber-400" /> Laterite Stone Cutting Register
              </h3>

              <form onSubmit={handleAddCuttingLog} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Quarry Bench Location</label>
                  <input
                    type="text"
                    value={cuttingForm.siteName}
                    onChange={(e) => setCuttingForm({ ...cuttingForm, siteName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Stone Grade</label>
                  <select
                    value={cuttingForm.grade}
                    onChange={(e) => setCuttingForm({ ...cuttingForm, grade: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  >
                    <option>Grade A (Structural)</option>
                    <option>Grade B (Standard Wall)</option>
                    <option>Grade C (Partition)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Pieces Cut</label>
                    <input
                      type="number"
                      value={cuttingForm.piecesCut}
                      onChange={(e) => setCuttingForm({ ...cuttingForm, piecesCut: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Free Bonus Pieces</label>
                    <input
                      type="number"
                      value={cuttingForm.freePieces}
                      onChange={(e) => setCuttingForm({ ...cuttingForm, freePieces: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Operator Name</label>
                  <input
                    type="text"
                    value={cuttingForm.operator}
                    onChange={(e) => setCuttingForm({ ...cuttingForm, operator: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl shadow-lg transition-all"
                >
                  Record Laterite Shift Production
                </button>
              </form>
            </div>

            {/* Crusher Yield & Stockyard Live Table */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
                <span>Crusher Plant Live Production Yield (Shift Summary)</span>
                <span className="text-xs font-mono text-emerald-400">Total Yield: 1,480 Tons</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-slate-400 text-[10px] block">Raw Boulder Feed</span>
                  <strong className="text-amber-400 text-base">{crusherLog.rawFeedBoulderTons} T</strong>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-slate-400 text-[10px] block">20mm Aggregates</span>
                  <strong className="text-emerald-400 text-base">{crusherLog.produced20mmTons} T</strong>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-slate-400 text-[10px] block">M-Sand Output</span>
                  <strong className="text-blue-400 text-base">{crusherLog.producedMSandTons} T</strong>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-slate-400 text-[10px] block">P-Sand Output</span>
                  <strong className="text-purple-400 text-base">{crusherLog.producedPSandTons} T</strong>
                </div>
              </div>

              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3">Register ID</th>
                      <th className="p-3">Quarry Site</th>
                      <th className="p-3">Grade</th>
                      <th className="p-3">Pieces Cut</th>
                      <th className="p-3">Free Pieces</th>
                      <th className="p-3">Est Tonnage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {lateriteLogs.map((log) => (
                      <tr key={log.cuttingRegisterId} className="hover:bg-slate-800/50">
                        <td className="p-3 text-amber-400 font-bold">{log.cuttingRegisterId}</td>
                        <td className="p-3">{log.quarrySiteName}</td>
                        <td className="p-3 text-slate-300">{log.stoneGrade}</td>
                        <td className="p-3 font-bold text-white">{log.piecesCutToday}</td>
                        <td className="p-3 text-emerald-400 font-bold">+{log.freeBonusPiecesCount}</td>
                        <td className="p-3">{log.calculatedTonnageEquivalent} T</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
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
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Modules 6, 7 &amp; 8</span>
            <h2 className="text-xl font-bold text-white mt-1">Smart Dynamic Pricing, Automated Gate Pass &amp; Weighbridge Telemetry</h2>
          </div>

          <div className="p-5 bg-slate-950 border border-amber-500/40 rounded-xl space-y-3">
            <h4 className="text-sm font-bold text-amber-400">Live Gate Pass → Dispatch (stock-checked)</h4>
            <form onSubmit={handleCreateLiveDispatch} className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <select value={dispatchForm.quarryId} onChange={(e) => setDispatchForm({ ...dispatchForm, quarryId: e.target.value })} className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white">
                <option value="">Select quarry</option>
                {quarries.map((quarry) => <option key={quarry.id} value={quarry.id}>{quarry.code}</option>)}
              </select>
              <select value={dispatchForm.productId} onChange={(e) => setDispatchForm({ ...dispatchForm, productId: e.target.value })} className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white">
                <option value="">Select product</option>
                {erpProducts.map((product) => <option key={product.id} value={product.id}>{product.code}</option>)}
              </select>
              <input placeholder="Customer name" value={dispatchForm.customerName} onChange={(e) => setDispatchForm({ ...dispatchForm, customerName: e.target.value })} className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white" />
              <input placeholder="Vehicle number" value={dispatchForm.vehicleNumber} onChange={(e) => setDispatchForm({ ...dispatchForm, vehicleNumber: e.target.value })} className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white" />
              <input placeholder="Driver name" value={dispatchForm.driverName} onChange={(e) => setDispatchForm({ ...dispatchForm, driverName: e.target.value })} className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white" />
              <input type="number" min={0.001} step="0.001" value={dispatchForm.quantity} onChange={(e) => setDispatchForm({ ...dispatchForm, quantity: Number(e.target.value) })} className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono" />
              <button type="submit" className="md:col-span-3 py-2 bg-amber-500 text-slate-950 font-bold rounded-lg">Create Gate Pass (DRAFT)</button>
            </form>
            <div className="space-y-2 text-[11px] font-mono text-slate-300">
              {gatePasses.slice(0, 6).map((gp) => (
                <div key={gp.id} className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
                  <span className="text-amber-300 font-bold">{gp.gatePassNumber}</span>
                  <span>{gp.status}</span>
                  {gp.status === 'DRAFT' && <button type="button" onClick={() => handleGatePassAction(gp.id, 'approve')} className="px-2 py-1 bg-slate-800 rounded text-emerald-300">Approve</button>}
                  {gp.status === 'APPROVED' && <button type="button" onClick={() => handleGatePassAction(gp.id, 'issue')} className="px-2 py-1 bg-slate-800 rounded text-blue-300">Issue</button>}
                  {gp.status === 'ISSUED' && <button type="button" onClick={() => handleDispatchGatePass(gp.id)} className="px-2 py-1 bg-amber-500 text-slate-950 rounded font-bold">Dispatch</button>}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3 font-mono">
              <h4 className="text-sm font-bold text-amber-400">Smart Pricing Tiers</h4>
              <ul className="space-y-1.5 text-slate-300">
                <li className="flex justify-between"><span>Retail Walk-In Rate:</span><strong className="text-white">₹780 / Ton</strong></li>
                <li className="flex justify-between"><span>Wholesale Dealer Rate:</span><strong className="text-emerald-400">₹680 / Ton</strong></li>
                <li className="flex justify-between"><span>Contractor Project Rate:</span><strong className="text-amber-300">₹640 / Ton</strong></li>
                <li className="flex justify-between"><span>Loading Charge:</span><span>₹35 / Ton</span></li>
              </ul>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3 font-mono">
              <h4 className="text-sm font-bold text-emerald-400">Digital Gate Pass &amp; QR Code</h4>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                E-Way bill integrated digital gate pass generated upon scalehouse gross weight capture. QR verified by quarry security guards before gate exit.
              </p>
              <button
                onClick={() => showToast('Generated sample E-Way Bill Gate Pass PDF with QR code')}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded border border-slate-800 font-bold text-[11px]"
              >
                Simulate QR Gate Pass
              </button>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3 font-mono">
              <h4 className="text-sm font-bold text-blue-400">Weighbridge Telemetry</h4>
              <ul className="space-y-1.5 text-slate-300 text-[11px]">
                <li className="flex justify-between"><span>Scalehouse #1:</span><strong className="text-emerald-400">ONLINE (60T Capacity)</strong></li>
                <li className="flex justify-between"><span>Scalehouse #2:</span><strong className="text-emerald-400">ONLINE (80T Capacity)</strong></li>
                <li className="flex justify-between"><span>ANPR Camera:</span><span>Automated Plate Capture Active</span></li>
                <li className="flex justify-between"><span>RFID Tag Reader:</span><span>Fleet Fast-Pass Active</span></li>
              </ul>
            </div>
          </div>
        </div>
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
