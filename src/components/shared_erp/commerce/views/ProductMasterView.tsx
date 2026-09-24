import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Sliders,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Building2,
  FileText,
  DollarSign,
  Download,
  Printer,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { CommerceProduct, CommerceSubTab } from '../types';
import { MOCK_COMMERCE_PRODUCTS, MOCK_PRODUCT_CATEGORIES } from '../commerceMockData';

interface ProductMasterViewProps {
  onNavigateTab: (tab: CommerceSubTab) => void;
  onOpenNewProductModal: () => void;
  onToast: (msg: string) => void;
  onOpenPrintModal: (title: string, data: any) => void;
}

export const ProductMasterView: React.FC<ProductMasterViewProps> = ({
  onNavigateTab,
  onOpenNewProductModal,
  onToast,
  onOpenPrintModal
}) => {
  const [products, setProducts] = useState<CommerceProduct[]>(MOCK_COMMERCE_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedProduct, setSelectedProduct] = useState<CommerceProduct | null>(products[0]);
  const [activeTabDossier, setActiveTabDossier] = useState<'OVERVIEW' | 'RATES' | 'INVENTORY' | 'DOCUMENTS'>('OVERVIEW');

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.hsnSac.includes(searchQuery);
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* 1. Module Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Product Master &bull; Multi-Tier Price Architecture
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                STUDIO PREVIEW / DEMO DATA
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Enterprise Material Catalog &amp; Distinct Pricing Engine
            </h1>
            <p className="text-xs text-slate-400 max-w-3xl">
              Architecturally separates <strong>Catalog Product Rate</strong> &ne; <strong>Customer-Specific Rate</strong> &ne; <strong>Supplier Procured Rate</strong> &ne; <strong>Long-Term Agreement Rate</strong>. Enforces pithead weighbridge tolerances, batch tracking, and quarry origin tags.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenNewProductModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add New Product</span>
            </button>
            <button
              onClick={() => onNavigateTab('rates')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs flex items-center gap-1.5 transition border border-amber-500/30 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Rate Rules Engine</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Search & Category Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-lg">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Product Name, SKU, HSN code or Quarry Origin..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="ALL">All Categories ({products.length})</option>
            {MOCK_PRODUCT_CATEGORIES.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          <button
            onClick={() => onOpenPrintModal('Material Products Master Dossier', products)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition border border-slate-700 cursor-pointer shrink-0"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Catalog</span>
          </button>
        </div>
      </div>

      {/* 3. Product Catalog Grid & Detailed Product Profile Dossier */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Product Table (7 cols) */}
        <div className="xl:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-400" />
                <span>Materials &amp; Spares Master List ({filteredProducts.length})</span>
              </h3>
              <p className="text-[11px] text-slate-400">Click any row to view complete enterprise profile &amp; 4-tier price matrix</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              ALL ACTIVE
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] text-slate-400 font-mono">
                  <th className="py-2.5 px-3">PRODUCT &amp; SKU</th>
                  <th className="py-2.5 px-3">CATEGORY</th>
                  <th className="py-2.5 px-3">UNIT &amp; HSN</th>
                  <th className="py-2.5 px-3 text-right">PURCHASE</th>
                  <th className="py-2.5 px-3 text-right">SALES RATE</th>
                  <th className="py-2.5 px-3 text-right">STOCK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProducts.map((p) => {
                  const isSelected = selectedProduct?.id === p.id;
                  return (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedProduct(p)}
                      className={`transition cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/10 text-amber-200'
                          : 'hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{p.name}</span>
                          {p.stockTracking && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Live Stock Tracking ON" />
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1 mt-0.5">
                          <span>{p.sku}</span>
                          <span>&bull;</span>
                          <span className="text-amber-400/80">{p.id}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px]">
                        <div>{p.unit}</div>
                        <div className="text-[10px] text-slate-400">HSN {p.hsnSac} ({p.gstRatePct}% GST)</div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-400">
                        ₹{p.purchaseRate.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-amber-400">
                        ₹{p.salesRate.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono">
                        <span className={p.currentStock <= p.reorderLevel ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                          {p.currentStock.toLocaleString()} {p.unit}
                        </span>
                        {p.currentStock <= p.reorderLevel && (
                          <div className="text-[9px] text-rose-400 font-bold">LOW STOCK</div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Selected Product Dossier (5 cols) */}
        <div className="xl:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          {selectedProduct ? (
            <>
              {/* Product Header Card */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {selectedProduct.sku} &bull; {selectedProduct.category}
                  </span>
                  <h3 className="text-base font-black text-white">{selectedProduct.name}</h3>
                  <p className="text-xs text-slate-400">{selectedProduct.description}</p>
                </div>
                <button
                  onClick={() => onToast(`Opening quick edit for ${selectedProduct.name}`)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer border border-slate-700"
                >
                  <Sliders className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Dossier Tabs */}
              <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2">
                {[
                  { id: 'OVERVIEW', label: 'Overview & Origin' },
                  { id: 'RATES', label: '4-Tier Price Matrix' },
                  { id: 'INVENTORY', label: 'Stock & Batches' },
                  { id: 'DOCUMENTS', label: 'Specs & Labs' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTabDossier(t.id as any)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      activeTabDossier === t.id
                        ? 'bg-amber-500 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab 1: Overview & Origin */}
              {activeTabDossier === 'OVERVIEW' && (
                <div className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 block font-mono">Source Quarry Concession</span>
                      <strong className="text-white font-medium">{selectedProduct.sourceQuarry || 'Central Stock'}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 block font-mono">Crusher / Plant Unit</span>
                      <strong className="text-white font-medium">{selectedProduct.sourceCrusher || 'Direct Pithead'}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 block font-mono">Primary Supplier / Lessor</span>
                      <strong className="text-amber-400 font-medium">{selectedProduct.primarySupplier || 'Self-Produced'}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 block font-mono">Statutory HSN &amp; GST</span>
                      <strong className="text-white font-mono">HSN {selectedProduct.hsnSac} ({selectedProduct.gstRatePct}%)</strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 block mb-1">Quality &amp; Operation Notes:</span>
                    <p className="text-slate-300 leading-relaxed">{selectedProduct.notes || 'Meets standard commercial specifications.'}</p>
                  </div>
                </div>
              )}

              {/* Tab 2: 4-Tier Price Matrix (Crucial Prompt Requirement: Product Rate ≠ Customer Rate ≠ Supplier Rate ≠ Agreement Rate) */}
              {activeTabDossier === 'RATES' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Separate Configurable Price Pillars</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Product Catalog rate is isolated from vendor purchase contracts and customer MOUs.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">1. Standard Catalog Rate</span>
                      <span className="text-base font-mono font-black text-white mt-1 block">₹{selectedProduct.salesRate}/{selectedProduct.unit}</span>
                      <span className="text-[9px] text-slate-500">Standard gate weighbridge retail</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80">
                      <span className="text-[10px] font-mono text-blue-400 uppercase block">2. Customer Special Rate</span>
                      <span className="text-base font-mono font-black text-blue-300 mt-1 block">₹{selectedProduct.customerRate || selectedProduct.salesRate}/{selectedProduct.unit}</span>
                      <span className="text-[9px] text-slate-500">Active client contract tier</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80">
                      <span className="text-[10px] font-mono text-purple-400 uppercase block">3. Supplier Procured Rate</span>
                      <span className="text-base font-mono font-black text-purple-300 mt-1 block">₹{selectedProduct.supplierRate || selectedProduct.purchaseRate}/{selectedProduct.unit}</span>
                      <span className="text-[9px] text-slate-500">Pithead extraction / buy cost</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80">
                      <span className="text-[10px] font-mono text-emerald-400 uppercase block">4. Agreement / MOU Rate</span>
                      <span className="text-base font-mono font-black text-emerald-300 mt-1 block">₹{selectedProduct.agreementRate || selectedProduct.salesRate * 0.95}/{selectedProduct.unit}</span>
                      <span className="text-[9px] text-slate-500">Highway Joint Venture Master Rate</span>
                    </div>
                  </div>

                  {/* Active Rate Overrides List */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Configured Dynamic Rules ({selectedProduct.rates.length})</span>
                    {selectedProduct.rates.map((r) => (
                      <div key={r.id} className="p-2 rounded-lg bg-slate-800/40 border border-slate-800 flex justify-between items-center text-[11px]">
                        <div>
                          <span className="font-bold text-white">{r.sourceLabel}</span>
                          <span className="text-[10px] text-slate-400 block font-mono">{r.rateType}</span>
                        </div>
                        <span className="font-mono font-bold text-amber-400">₹{r.rate}/{r.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Inventory & Batches */}
              {activeTabDossier === 'INVENTORY' && (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/80">
                      <span className="text-[10px] text-slate-400 block font-mono">Current Physical Stock</span>
                      <strong className="text-lg font-mono font-black text-emerald-400 block mt-0.5">
                        {selectedProduct.currentStock.toLocaleString()} {selectedProduct.unit}
                      </strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/80">
                      <span className="text-[10px] text-slate-400 block font-mono">Reorder Safety Level</span>
                      <strong className="text-lg font-mono font-black text-amber-400 block mt-0.5">
                        {selectedProduct.reorderLevel.toLocaleString()} {selectedProduct.unit}
                      </strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-800 space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Compliance Tracking Flags:</span>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded text-[10px] font-mono font-bold ${
                        selectedProduct.stockTracking ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                      }`}>
                        Stock Tracking: {selectedProduct.stockTracking ? 'ON' : 'OFF'}
                      </span>
                      <span className={`px-2 py-1 rounded text-[10px] font-mono font-bold ${
                        selectedProduct.batchTracking ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-slate-500'
                      }`}>
                        Batch Tracking: {selectedProduct.batchTracking ? 'ENABLED' : 'DISABLED'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Documents & Lab Tests */}
              {activeTabDossier === 'DOCUMENTS' && (
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">IS 383 Sieve Analysis &amp; Silt Report</p>
                      <p className="text-[10px] text-slate-400 font-mono">Certified: 14 Feb 2026 &bull; PDF (1.4 MB)</p>
                    </div>
                    <button
                      onClick={() => onToast('Opening Material Test Certificate preview')}
                      className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold cursor-pointer"
                    >
                      View
                    </button>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">DGMS Flakiness &amp; Elongation Index Certificate</p>
                      <p className="text-[10px] text-slate-400 font-mono">Tested by NIT Calicut Highway Lab</p>
                    </div>
                    <button
                      onClick={() => onToast('Opening NIT Calicut Lab certification')}
                      className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold cursor-pointer"
                    >
                      View
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              Select a product from the left catalog table to inspect full enterprise dossier.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
