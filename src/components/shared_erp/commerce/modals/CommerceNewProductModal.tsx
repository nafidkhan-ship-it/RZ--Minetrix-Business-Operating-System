import React, { useState } from 'react';
import {
  Package,
  X,
  Plus,
  Save,
  Sliders,
  DollarSign,
  Building2,
  Scale,
  Percent,
  Layers,
  FileText
} from 'lucide-react';
import { CommerceProduct } from '../types';
import { MOCK_PRODUCT_CATEGORIES, MOCK_MEASUREMENT_UNITS } from '../commerceMockData';

interface CommerceNewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProduct: (product: CommerceProduct, addAnother?: boolean) => void;
  onToast: (msg: string) => void;
}

export const CommerceNewProductModal: React.FC<CommerceNewProductModalProps> = ({
  isOpen,
  onClose,
  onSaveProduct,
  onToast
}) => {
  if (!isOpen) return null;

  const [productId, setProductId] = useState(`PRD-${Math.floor(100 + Math.random() * 900)}`);
  const [productName, setProductName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState(MOCK_PRODUCT_CATEGORIES[0].name);
  const [subcategory, setSubcategory] = useState(MOCK_PRODUCT_CATEGORIES[0].subcategories[0] || 'Standard');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState(MOCK_MEASUREMENT_UNITS[0].name);
  const [hsnSac, setHsnSac] = useState('2517');
  const [gstRate, setGstRate] = useState(5);

  // Distinct Pricing Pillars (Prompt Section 5: Product Rate ≠ Customer Rate ≠ Supplier Rate ≠ Agreement Rate)
  const [salesRate, setSalesRate] = useState<number>(450);
  const [purchaseRate, setPurchaseRate] = useState<number>(320);
  const [minRate, setMinRate] = useState<number>(400);
  const [maxRate, setMaxRate] = useState<number>(550);
  const [customerRate, setCustomerRate] = useState<number>(430);
  const [supplierRate, setSupplierRate] = useState<number>(310);
  const [agreementRate, setAgreementRate] = useState<number>(420);

  // Stock & Tracking Flags
  const [stockTracking, setStockTracking] = useState(true);
  const [batchTracking, setBatchTracking] = useState(true);
  const [serialTracking, setSerialTracking] = useState(false);
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');

  // Origin & Suppliers
  const [primarySupplier, setPrimarySupplier] = useState('Central Production Depot');
  const [sourceQuarry, setSourceQuarry] = useState('Central Quarry Concession Block A');
  const [sourceCrusher, setSourceCrusher] = useState('Crusher Unit Alpha (Metso 250 TPH)');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent, addAnother = false) => {
    e.preventDefault();
    if (!productName.trim() || !sku.trim()) {
      onToast('Please enter both Product Name and SKU');
      return;
    }

    const newProd: CommerceProduct = {
      id: productId,
      name: productName,
      sku: sku.toUpperCase(),
      category,
      subcategory,
      description,
      unit,
      hsnSac,
      gstRatePct: Number(gstRate),
      purchaseRate: Number(purchaseRate),
      salesRate: Number(salesRate),
      minRate: Number(minRate),
      maxRate: Number(maxRate),
      customerRate: Number(customerRate),
      supplierRate: Number(supplierRate),
      agreementRate: Number(agreementRate),
      currentStock: 1000,
      reorderLevel: 200,
      stockTracking,
      batchTracking,
      serialTracking,
      isActive: status === 'ACTIVE',
      documentsCount: 0,
      primarySupplier,
      sourceQuarry,
      sourceCrusher,
      notes,
      rates: [
        {
          id: `R-${Date.now()}-1`,
          rateType: 'DEFAULT',
          rate: Number(salesRate),
          unit,
          effectiveFrom: '2026-02-01',
          status: 'ACTIVE',
          sourceLabel: 'Standard Default Catalog Price'
        },
        {
          id: `R-${Date.now()}-2`,
          rateType: 'CUSTOMER_SPECIFIC',
          rate: Number(customerRate),
          unit,
          effectiveFrom: '2026-02-01',
          status: 'ACTIVE',
          sourceLabel: 'Key Accounts Special Tier'
        },
        {
          id: `R-${Date.now()}-3`,
          rateType: 'SUPPLIER_SPECIFIC',
          rate: Number(supplierRate),
          unit,
          effectiveFrom: '2026-02-01',
          status: 'ACTIVE',
          sourceLabel: 'Direct Procured Extraction Cost'
        },
        {
          id: `R-${Date.now()}-4`,
          rateType: 'AGREEMENT',
          rate: Number(agreementRate),
          unit,
          effectiveFrom: '2026-02-01',
          status: 'ACTIVE',
          sourceLabel: 'Long-term Consortium MOU Rate'
        }
      ]
    };

    onSaveProduct(newProd, addAnother);

    if (addAnother) {
      setProductId(`PRD-${Math.floor(100 + Math.random() * 900)}`);
      setProductName('');
      setSku('');
      onToast(`Saved "${newProd.name}". Ready for next product.`);
    } else {
      onToast(`Saved Product "${newProd.name}"`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-5 relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Product Master Setup &bull; Module 2
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                STUDIO PREVIEW / DEMO DATA
              </span>
            </div>
            <h2 className="text-xl font-black text-white mt-1">Configure Enterprise Material SKU</h2>
            <p className="text-xs text-slate-400">
              Architecturally records distinct rates: <strong>Catalog Rate</strong> &ne; <strong>Customer Rate</strong> &ne; <strong>Supplier Rate</strong> &ne; <strong>Agreement Rate</strong>.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="new-product-form" onSubmit={(e) => handleSubmit(e, false)} className="space-y-5 overflow-y-auto pr-1">
          {/* Section 1: Basic Identifiers */}
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Package className="w-3.5 h-3.5 text-amber-400" />
              <span>1. Basic Material Identification &amp; Statutory Codes</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Product ID (Auto)</label>
                <input
                  type="text"
                  readOnly
                  value={productId}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-amber-400 font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Material Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 20mm Blue Metal Granite"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Product Code / SKU *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AGG-20MM-BM"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono uppercase focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {MOCK_PRODUCT_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Measurement Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {MOCK_MEASUREMENT_UNITS.map((u) => (
                    <option key={u.id} value={u.name}>{u.name} ({u.symbol})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">HSN / SAC Code</label>
                <input
                  type="text"
                  value={hsnSac}
                  onChange={(e) => setHsnSac(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">GST Rate %</label>
                <select
                  value={gstRate}
                  onChange={(e) => setGstRate(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold cursor-pointer"
                >
                  <option value={5}>5% (Mining Minerals &amp; Stone)</option>
                  <option value={12}>12% (Chemical Admixtures)</option>
                  <option value={18}>18% (Fuels, Spares &amp; Freight)</option>
                  <option value={28}>28% (Heavy Machinery Tyres)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: 4-Tier Pricing Architecture (Prompt Core Mandate) */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>2. Multi-Pillar Rate Architecture (Distinct Configurable Concepts)</span>
              </h4>
              <span className="text-[10px] font-mono text-amber-400">All rates per {unit}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 space-y-1">
                <label className="text-slate-400 text-[10px] font-mono uppercase block">1. Catalog Retail Rate *</label>
                <input
                  type="number"
                  required
                  value={salesRate}
                  onChange={(e) => setSalesRate(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono font-bold"
                />
                <span className="text-[9px] text-slate-500">Base gate price</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 space-y-1">
                <label className="text-blue-400 text-[10px] font-mono uppercase block">2. Customer Rate</label>
                <input
                  type="number"
                  value={customerRate}
                  onChange={(e) => setCustomerRate(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-blue-300 font-mono font-bold"
                />
                <span className="text-[9px] text-slate-500">Contract account tier</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 space-y-1">
                <label className="text-purple-400 text-[10px] font-mono uppercase block">3. Supplier Buy Rate</label>
                <input
                  type="number"
                  value={supplierRate}
                  onChange={(e) => setSupplierRate(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-purple-300 font-mono font-bold"
                />
                <span className="text-[9px] text-slate-500">Pithead extraction cost</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 space-y-1">
                <label className="text-emerald-400 text-[10px] font-mono uppercase block">4. Agreement Rate</label>
                <input
                  type="number"
                  value={agreementRate}
                  onChange={(e) => setAgreementRate(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-emerald-300 font-mono font-bold"
                />
                <span className="text-[9px] text-slate-500">Highway MOU framework</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <label className="text-slate-400 block mb-1">Minimum Floor Rate (Price Floor)</label>
                <input
                  type="number"
                  value={minRate}
                  onChange={(e) => setMinRate(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Maximum Ceiling Rate (MRP)</label>
                <input
                  type="number"
                  value={maxRate}
                  onChange={(e) => setMaxRate(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-300 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Origin & Operational Allocation */}
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span>3. Concession Origin &amp; Compliance Flags</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Source Quarry Concession</label>
                <input
                  type="text"
                  value={sourceQuarry}
                  onChange={(e) => setSourceQuarry(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Source Crusher Plant Unit</label>
                <input
                  type="text"
                  value={sourceCrusher}
                  onChange={(e) => setSourceCrusher(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Primary Supplier / Vendor</label>
                <input
                  type="text"
                  value={primarySupplier}
                  onChange={(e) => setPrimarySupplier(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={stockTracking}
                  onChange={(e) => setStockTracking(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-0 cursor-pointer"
                />
                <span className="text-slate-300">Live Weighbridge Stock Tracking ON</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={batchTracking}
                  onChange={(e) => setBatchTracking(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-0 cursor-pointer"
                />
                <span className="text-slate-300">QC Sieve Batch Tracking</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={serialTracking}
                  onChange={(e) => setSerialTracking(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-0 cursor-pointer"
                />
                <span className="text-slate-300">Serial Tracking (Machinery/Tyres)</span>
              </label>
            </div>
          </div>
        </form>

        {/* Action Buttons (Prompt Requirement 5: Save Employee/Product, Save & Add Another, Cancel) */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs border border-amber-500/30 cursor-pointer"
          >
            Save &amp; Add Another
          </button>
          <button
            type="submit"
            form="new-product-form"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Product</span>
          </button>
        </div>
      </div>
    </div>
  );
};
