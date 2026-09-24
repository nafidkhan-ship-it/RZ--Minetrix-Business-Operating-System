import React, { useState } from 'react';
import {
  Layers,
  Search,
  Plus,
  DollarSign,
  TrendingUp,
  Building2,
  CheckCircle2,
  FileText,
  Sliders,
  Sparkles
} from 'lucide-react';
import { CrusherProduct } from '../../data/crusherStudioData';

interface CrusherProductsViewProps {
  products: CrusherProduct[];
  onOpenNewProduct: () => void;
  onNavigatePage: (page: string) => void;
}

export const CrusherProductsView: React.FC<CrusherProductsViewProps> = ({
  products,
  onOpenNewProduct,
  onNavigatePage
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sizeFilter, setSizeFilter] = useState('ALL');

  const filtered = products.filter(p => {
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.hsnCode.includes(searchTerm);
    const matchSize = sizeFilter === 'ALL' || p.sizeFraction === sizeFilter;
    return matchSearch && matchSize;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                PRODUCT MASTER & COMMERCIAL TARIFFS &bull; {products.length} GRADES
              </span>
              <h2 className="text-xl font-black text-white">Aggregates & Sand Master Catalog</h2>
            </div>
          </div>
          <button
            onClick={onOpenNewProduct}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Finished Product</span>
          </button>
        </div>

        {/* Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by grade name, code, or HSN (e.g., 2517, M-Sand)..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9.5 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <select
              value={sizeFilter}
              onChange={e => setSizeFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="ALL">All Fraction Sizes</option>
              <option value="0-4.75 mm">0-4.75 mm (Fine Aggregates / M-Sand)</option>
              <option value="10 mm">10 mm (Coarse)</option>
              <option value="20 mm">20 mm (Concrete Structural)</option>
              <option value="40 mm">40 mm (Railway / Heavy Base)</option>
              <option value="0-40 mm Graded">0-40 mm Graded (GSB Road Base)</option>
              <option value="0-75 micron">0-75 micron (Mineral Quarry Dust)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(product => (
          <div
            key={product.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between hover:border-cyan-500/40 transition group space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-cyan-400">{product.code}</span>
                    <span className="text-[10px] font-mono text-slate-500">HSN: {product.hsnCode}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1 group-hover:text-cyan-300 transition">
                    {product.name}
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-mono font-bold">
                  {product.sizeFraction}
                </span>
              </div>

              {/* Economic Metrics */}
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950 rounded-2xl border border-slate-800/80 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Default Sales Tariff</span>
                  <span className="font-mono font-black text-emerald-400 text-sm block mt-0.5">
                    ₹{product.defaultSalesRatePerTon} / {product.unit}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Est Production Cost</span>
                  <span className="font-mono font-bold text-slate-300 text-sm block mt-0.5">
                    ₹{product.productionCostPerTon} / {product.unit}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">GST Rate</span>
                  <span className="font-mono font-bold text-cyan-400 block mt-0.5">{product.gstRatePercent}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Assigned Storage</span>
                  <span className="font-mono font-bold text-amber-400 block mt-0.5 truncate">
                    {product.defaultSiloId}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                {product.description}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono text-[10px]">
                Target Margin: ₹{product.defaultSalesRatePerTon - product.productionCostPerTon}/T
              </span>
              <button
                onClick={() => onNavigatePage('sales')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 font-bold transition cursor-pointer"
              >
                Create Invoice
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
