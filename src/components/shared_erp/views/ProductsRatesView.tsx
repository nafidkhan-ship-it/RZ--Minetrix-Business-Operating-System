import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Tag,
  DollarSign,
  TrendingUp,
  Percent,
  Layers,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Calendar,
  MapPin,
  Building2,
  X,
  Sparkles
} from 'lucide-react';
import { ErpProduct, ProductUnit, RateRule } from '../types';
import { MOCK_ERP_PRODUCTS } from '../data/erpMasterData';

export const ProductsRatesView: React.FC = () => {
  const [products, setProducts] = useState<ErpProduct[]>(MOCK_ERP_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<ErpProduct>(products[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddRateModalOpen, setIsAddRateModalOpen] = useState(false);

  // Rate Simulator State
  const [simCustomer, setSimCustomer] = useState<'Standard' | 'Sobha' | 'NH_Agreement'>('Standard');
  const [simQty, setSimQty] = useState<number>(100);
  const [simLocation, setSimLocation] = useState<'Standard' | 'Wayanad_Hill'>('Standard');

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dynamic Rate Calculation simulation
  const calculateEffectiveRate = () => {
    if (!selectedProduct) return { rate: 0, source: 'None' };

    // Check Agreement or Customer override first
    if (simCustomer === 'Sobha') {
      const custRule = selectedProduct.rates.find(r => r.rateType === 'CUSTOMER_SPECIFIC');
      if (custRule) {
        return { rate: custRule.rate, source: custRule.sourceLabel };
      }
    }
    if (simCustomer === 'NH_Agreement') {
      const agrRule = selectedProduct.rates.find(r => r.rateType === 'AGREEMENT');
      if (agrRule) {
        return { rate: agrRule.rate, source: agrRule.sourceLabel };
      }
    }
    // Location override
    if (simLocation === 'Wayanad_Hill') {
      const locRule = selectedProduct.rates.find(r => r.rateType === 'LOCATION');
      if (locRule) {
        return { rate: locRule.rate, source: locRule.sourceLabel };
      }
    }
    // Quantity Tier
    const tierRule = selectedProduct.rates.find(r => r.rateType === 'QUANTITY_TIER' && simQty >= (r.minQty || 0));
    if (tierRule) {
      return { rate: tierRule.rate, source: tierRule.sourceLabel };
    }

    return { rate: selectedProduct.salesRate, source: 'Standard Default Catalog Rate' };
  };

  const calculated = calculateEffectiveRate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              PRODUCT MASTER &bull; DYNAMIC RATE ENGINE
            </span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-[10px] text-emerald-400 font-mono">
              NO HARDCODED RATES
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <Package className="w-6 h-6 text-amber-400" />
            <span>Product Master &amp; Dynamic Rate Rules</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Enforces the core rule: <strong>Product Rate &ne; Agreement Rate &ne; Customer-Specific Rate</strong>. Every order resolves its rate transparently with source tags.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
          Units Supported: Piece, Load, Ton, Kg, Litre, Trip, Hour, Day, Sq.ft, Cent, Acre
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Product List */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="font-bold text-white text-xs">Product Catalog ({filteredProducts.length})</span>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search SKU/name..."
                className="bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
            {filteredProducts.map(p => {
              const isSelected = selectedProduct.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer space-y-1 ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 shadow-sm'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-bold text-xs text-white line-clamp-1">{p.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-amber-400 font-mono shrink-0">
                      {p.unit}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    SKU: {p.sku} &bull; HSN: {p.hsnSac} &bull; GST: {p.gstRatePct}%
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-xs font-mono">
                    <span className="text-slate-400">Stock: <strong className="text-white">{p.currentStock.toLocaleString()} {p.unit}</strong></span>
                    <span className="text-emerald-400 font-bold">₹{p.salesRate} / {p.unit}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center & Right: Selected Product Details & Dynamic Rate Engine */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Overview Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                  {selectedProduct.category.replace('_', ' ')} &bull; {selectedProduct.sku}
                </span>
                <h3 className="text-lg font-black text-white">{selectedProduct.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedProduct.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono font-bold">
                  Stock: {selectedProduct.currentStock.toLocaleString()} {selectedProduct.unit}
                </span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Sales Default Rate</span>
                <span className="text-lg font-black text-amber-400">₹{selectedProduct.salesRate}</span>
                <span className="text-[10px] text-slate-500 block">per {selectedProduct.unit}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Purchase Rate</span>
                <span className="text-lg font-black text-slate-300">₹{selectedProduct.purchaseRate}</span>
                <span className="text-[10px] text-slate-500 block">Avg Cost</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Allowed Floor / Ceiling</span>
                <span className="text-sm font-black text-cyan-400">₹{selectedProduct.minRate} – ₹{selectedProduct.maxRate}</span>
                <span className="text-[10px] text-slate-500 block">Guardrail Limits</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">HSN / GST Rate</span>
                <span className="text-sm font-black text-purple-400">{selectedProduct.hsnSac} ({selectedProduct.gstRatePct}%)</span>
                <span className="text-[10px] text-slate-500 block">GST Compliant</span>
              </div>
            </div>
          </div>

          {/* Active Rate Rules for this Product */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-400" />
                  <span>Configured Rate Rules for this Item ({selectedProduct.rates.length})</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  The Rate Engine evaluates these rules dynamically on every purchase, sales order, and dispatch pass.
                </p>
              </div>
              <button
                onClick={() => setIsAddRateModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Rate Rule</span>
              </button>
            </div>

            <div className="space-y-2">
              {selectedProduct.rates.map(rule => (
                <div
                  key={rule.id}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-bold">
                        {rule.rateType}
                      </span>
                      <span className="text-white font-bold">{rule.sourceLabel}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {rule.targetEntityName && <span>Target: {rule.targetEntityName} &bull; </span>}
                      {rule.minQty && <span>Min Qty: {rule.minQty} {rule.unit} &bull; </span>}
                      {rule.location && <span>Location: {rule.location} &bull; </span>}
                      <span>Effective from {rule.effectiveFrom}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-black text-amber-400">
                      ₹{rule.rate} / {rule.unit}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Live Rate Engine Simulation Sandbox */}
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <div>
                <h4 className="font-bold text-white text-sm">Interactive Rate Engine Simulator</h4>
                <p className="text-xs text-slate-400">
                  Select customer profile, order quantity, and delivery sector to inspect the resolved price:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Customer / Entity Tier</label>
                <select
                  value={simCustomer}
                  onChange={e => setSimCustomer(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Standard">Standard Retail Buyer</option>
                  <option value="Sobha">Sobha Developers (Enterprise)</option>
                  <option value="NH_Agreement">NH Highway Project (Agreement Rate)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Order Quantity ({selectedProduct.unit})</label>
                <input
                  type="number"
                  value={simQty}
                  onChange={e => setSimQty(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Delivery Destination</label>
                <select
                  value={simLocation}
                  onChange={e => setSimLocation(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Standard">Plains / Local Sector (Calicut)</option>
                  <option value="Wayanad_Hill">Wayanad Hill Sector (+ Haulage)</option>
                </select>
              </div>
            </div>

            {/* Resolved Result */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-slate-500 font-mono uppercase block font-bold">
                  RESOLVED APPLIED RATE
                </span>
                <div className="text-2xl font-black text-amber-400 font-mono mt-0.5">
                  ₹{calculated.rate} <span className="text-xs font-normal text-slate-400">/ {selectedProduct.unit}</span>
                </div>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Rule Source: <strong>{calculated.source}</strong></span>
                </div>
              </div>

              <div className="text-right font-mono">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Estimated Order Value</span>
                <span className="text-xl font-black text-white">
                  ₹{(calculated.rate * simQty).toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 block">Excluding 5% GST</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
