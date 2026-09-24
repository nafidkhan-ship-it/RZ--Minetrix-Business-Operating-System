import React, { useState } from 'react';
import {
  Package,
  Search,
  Plus,
  Layers,
  Star,
  ShieldCheck,
  CheckCircle2,
  Filter,
  DollarSign
} from 'lucide-react';
import { CommerceProduct, COMMERCE_PRODUCTS } from '../../data/ecommerceStudioData';

interface ProductsManagementViewProps {
  onSelectProduct: (prod: CommerceProduct) => void;
  onOrderProduct: (prod: CommerceProduct) => void;
  onNewProduct: () => void;
}

export const ProductsManagementView: React.FC<ProductsManagementViewProps> = ({
  onSelectProduct,
  onOrderProduct,
  onNewProduct
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<'All' | 'Stone' | 'Building Materials'>('All');

  const filtered = COMMERCE_PRODUCTS.filter((prod) => {
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = selectedGroup === 'All' || prod.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
              COMMODITY & RAW MATERIAL INVENTORY
            </span>
            <span className="text-xs text-slate-400 font-medium">Stone & Building Supplies</span>
          </div>
          <h1 className="text-xl font-black text-white mt-1">Product Management ({COMMERCE_PRODUCTS.length})</h1>
        </div>

        <button
          onClick={onNewProduct}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product Listing</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by code, name, category..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs w-full sm:w-auto">
          {(['All', 'Stone', 'Building Materials'] as const).map((grp) => (
            <button
              key={grp}
              onClick={() => setSelectedGroup(grp)}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                selectedGroup === grp
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {grp}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] bg-slate-950/80">
                <th className="p-4">Item Code</th>
                <th className="p-4">Product Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Dimensions</th>
                <th className="p-4">Quarries / Mills</th>
                <th className="p-4">Stock In Yards</th>
                <th className="p-4">Ex-Quarry Rate</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map((prod) => (
                <tr
                  key={prod.id}
                  onClick={() => onSelectProduct(prod)}
                  className="hover:bg-slate-800/40 transition cursor-pointer group"
                >
                  <td className="p-4 font-mono font-bold text-amber-400">{prod.code}</td>
                  <td className="p-4">
                    <div className="font-bold text-white group-hover:text-amber-400 transition">{prod.name}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-xs">{prod.finish}</div>
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {prod.category}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300 font-mono">{prod.dimensions}</td>
                  <td className="p-4 text-slate-300 font-mono">{prod.supplierCount} Verified</td>
                  <td className="p-4 text-emerald-400 font-mono font-bold">
                    {prod.availableQuantity.toLocaleString()} {prod.unit}s
                  </td>
                  <td className="p-4 font-mono font-black text-amber-400 text-sm">
                    {prod.basePrice ? `₹${prod.basePrice} / ${prod.unit}` : 'Price on Request'}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOrderProduct(prod);
                      }}
                      className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer shadow-sm"
                    >
                      Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
