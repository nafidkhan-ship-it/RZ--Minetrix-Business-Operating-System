import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Search,
  CheckCircle2,
  Archive,
  RotateCcw,
  Sliders,
  Scale,
  Percent,
  ChevronRight
} from 'lucide-react';
import { ProductCategory, CommerceSubTab } from '../types';
import { MOCK_PRODUCT_CATEGORIES } from '../commerceMockData';

interface ProductCategoriesViewProps {
  onNavigateTab: (tab: CommerceSubTab) => void;
  onToast: (msg: string) => void;
}

export const ProductCategoriesView: React.FC<ProductCategoriesViewProps> = ({
  onNavigateTab,
  onToast
}) => {
  const [categories, setCategories] = useState<ProductCategory[]>(MOCK_PRODUCT_CATEGORIES);
  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newSubcats, setNewSubcats] = useState('');
  const [newUnit, setNewUnit] = useState('Ton');
  const [newGst, setNewGst] = useState(5);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const cat: ProductCategory = {
      id: `CAT-${categories.length + 1}`.padStart(6, '0'),
      name: newCatName,
      subcategories: newSubcats.split(',').map((s) => s.trim()).filter(Boolean),
      productCount: 0,
      activeCount: 0,
      defaultUnit: newUnit,
      defaultGstPct: Number(newGst),
      status: 'ACTIVE',
      description: `User-defined category for ${newCatName}`
    };
    setCategories([cat, ...categories]);
    setIsCreating(false);
    setNewCatName('');
    setNewSubcats('');
    onToast(`Created category "${cat.name}"`);
  };

  const handleToggleArchive = (id: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE' } : c
      )
    );
    onToast(`Category status updated`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Catalog Taxonomy &bull; Module 2
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                STUDIO PREVIEW / DEMO DATA
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Product Categories &amp; Subcategory Hierarchies
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Configures statutory default units, baseline GST rates, and multi-tier subcategories for quarry raw materials, crusher aggregates, and plant spares.
            </p>
          </div>

          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Category</span>
          </button>
        </div>
      </div>

      {/* New Category Modal/Drawer */}
      {isCreating && (
        <form onSubmit={handleCreate} className="bg-slate-900 border border-amber-500/40 rounded-3xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Create New Product Category</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Category Name *</label>
              <input
                type="text"
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Ready-Mix Concrete (RMC)"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Subcategories (comma-separated)</label>
              <input
                type="text"
                value={newSubcats}
                onChange={(e) => setNewSubcats(e.target.value)}
                placeholder="M20 Grade, M25 Grade, Pumpable"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Default Unit</label>
              <select
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Ton">Ton</option>
                <option value="Piece">Piece</option>
                <option value="Load">Load</option>
                <option value="Cu.m">Cu.m (Cubic Metre)</option>
                <option value="Litre">Litre</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Default GST %</label>
              <select
                value={newGst}
                onChange={(e) => setNewGst(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              >
                <option value={5}>5% (Mining / Minerals)</option>
                <option value={18}>18% (Fuels / Spares)</option>
                <option value={28}>28% (Special Machinery Tyres)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
            >
              Discard
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-black"
            >
              Save Category
            </button>
          </div>
        </form>
      )}

      {/* Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search categories or subcategories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((cat) => (
          <div
            key={cat.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 space-y-3 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400">{cat.id}</span>
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                  cat.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  {cat.status}
                </span>
              </div>
              <h3 className="text-base font-black text-white mt-1">{cat.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{cat.description}</p>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {cat.subcategories.map((sub, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300">
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Default Unit: <strong className="text-white">{cat.defaultUnit}</strong></span>
                <span>Default GST: <strong className="text-amber-400 font-mono">{cat.defaultGstPct}%</strong></span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => onNavigateTab('products')}
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                >
                  <span>View Products ({cat.productCount})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleToggleArchive(cat.id)}
                  className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 cursor-pointer"
                >
                  <Archive className="w-3 h-3" />
                  <span>{cat.status === 'ACTIVE' ? 'Archive' : 'Restore'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
