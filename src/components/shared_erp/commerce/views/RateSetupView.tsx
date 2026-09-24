import React, { useState } from 'react';
import {
  Sliders,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  History,
  Tag,
  Users,
  Building2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { CommerceSubTab, ProductRateType, CommerceRateEntry } from '../types';
import { MOCK_COMMERCE_PRODUCTS } from '../commerceMockData';

interface RateSetupViewProps {
  onNavigateTab: (tab: CommerceSubTab) => void;
  onToast: (msg: string) => void;
}

export const RateSetupView: React.FC<RateSetupViewProps> = ({ onNavigateTab, onToast }) => {
  const [selectedProduct, setSelectedProduct] = useState(MOCK_COMMERCE_PRODUCTS[0]);
  const [rateTypeFilter, setRateTypeFilter] = useState<string>('ALL');

  const RATE_TYPES: { type: ProductRateType; label: string; desc: string }[] = [
    { type: 'DEFAULT', label: '1. Default Catalog Rate', desc: 'Base gate weighbridge retail price for uncontracted buyers' },
    { type: 'CUSTOMER_SPECIFIC', label: '2. Customer-Specific Rate', desc: 'Negotiated discounts for recurring key accounts (e.g. Sobha Developers)' },
    { type: 'SUPPLIER_SPECIFIC', label: '3. Supplier Procured Rate', desc: 'Direct cost from quarry leaseholders, diesel depots or crusher plants' },
    { type: 'AGREEMENT', label: '4. Agreement / MOU Rate', desc: 'Fixed long-term framework rate for highway infrastructure consortia' },
    { type: 'QUANTITY_TIER', label: '5. Quantity-Based Rate', desc: 'Wholesale tiered pricing for bulk orders exceeding threshold tonnages' },
    { type: 'LOCATION', label: '6. Location-Based Rate', desc: 'Site-specific haulage differential (e.g. Ghat road / high altitude)' },
    { type: 'EFFECTIVE_DATE', label: '7. Effective-Date Rate', desc: 'Future scheduled price changes or seasonal adjustments' }
  ];

  const filteredRates = selectedProduct.rates.filter((r) =>
    rateTypeFilter === 'ALL' || r.rateType === rateTypeFilter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Dynamic Pricing Engine &bull; Module 2
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                STUDIO PREVIEW / DEMO DATA
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              7-Tier Rate Setup, Effective Date Schedule &amp; Price Change Audit Log
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Configures custom customer rebates, quantity breaks, geographic haulage surcharges, and historical price revisions without altering historical billing integrity.
            </p>
          </div>

          <button
            onClick={() => onToast('Rate override rule saved')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Rate Rule</span>
          </button>
        </div>
      </div>

      {/* 7 Rate Types Reference Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {RATE_TYPES.map((rt) => (
          <div
            key={rt.type}
            onClick={() => setRateTypeFilter(rt.type)}
            className={`p-3 rounded-2xl border transition cursor-pointer text-xs flex flex-col justify-between ${
              rateTypeFilter === rt.type
                ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400'
            }`}
          >
            <div>
              <span className="font-bold text-white block text-[11px] truncate">{rt.label}</span>
              <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">{rt.desc}</p>
            </div>
            <span className="text-[9px] font-mono text-amber-400 mt-2 font-bold">Rule Filter</span>
          </div>
        ))}
      </div>

      {/* Main Rate Matrix & Audit Log Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Product Selector (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Select Product Catalog</h3>
            <span className="text-[10px] text-slate-400 font-mono">Rates Configured</span>
          </div>
          <div className="space-y-2">
            {MOCK_COMMERCE_PRODUCTS.map((prod) => {
              const isSelected = selectedProduct.id === prod.id;
              return (
                <div
                  key={prod.id}
                  onClick={() => setSelectedProduct(prod)}
                  className={`p-3 rounded-2xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/60 text-amber-200 shadow-md'
                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-bold text-white truncate">{prod.name}</p>
                    <span className="text-xs font-mono font-bold text-amber-400">₹{prod.salesRate}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 font-mono">
                    <span>{prod.sku}</span>
                    <span>{prod.rates.length} active rules</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Active Rates, History & Change Log (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">{selectedProduct.sku}</span>
              <h3 className="text-base font-black text-white">{selectedProduct.name} &bull; Rate Rules</h3>
            </div>
            {rateTypeFilter !== 'ALL' && (
              <button
                onClick={() => setRateTypeFilter('ALL')}
                className="text-[11px] text-amber-400 hover:underline cursor-pointer"
              >
                Clear Filter ({rateTypeFilter})
              </button>
            )}
          </div>

          {/* Rate Cards */}
          <div className="space-y-3">
            {filteredRates.map((r) => (
              <div
                key={r.id}
                className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/70 hover:border-slate-600 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{r.sourceLabel}</span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      {r.rateType}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-3">
                    <span>Unit: <strong className="text-white">{r.unit}</strong></span>
                    {r.minQty && <span>Min Qty: <strong className="text-white">{r.minQty}</strong></span>}
                    {r.location && <span>Location: <strong className="text-white">{r.location}</strong></span>}
                    <span>Effective: <strong className="text-slate-300 font-mono">{r.effectiveFrom}</strong></span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-700">
                  <span className="text-base font-mono font-black text-amber-400">
                    ₹{r.rate.toLocaleString()}/{r.unit}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Rate Change Audit Log */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <History className="w-3.5 h-3.5 text-amber-400" />
              <span>Immutable Rate Change Audit Log</span>
            </h4>
            <div className="space-y-1.5 text-xs">
              <div className="p-2 rounded-xl bg-slate-800/40 border border-slate-800 text-[11px] flex justify-between items-center">
                <span className="text-slate-300">Default Catalog Rate adjusted from ₹44 to ₹46 / Piece (Inflation + diesel hike)</span>
                <span className="text-[10px] font-mono text-slate-500">15 Jan 2026 &bull; MD Approval</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/40 border border-slate-800 text-[11px] flex justify-between items-center">
                <span className="text-slate-300">Sobha Developers framework contractual rate renewed at ₹42 / Piece</span>
                <span className="text-[10px] font-mono text-slate-500">01 Jan 2026 &bull; Commercial Head</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
