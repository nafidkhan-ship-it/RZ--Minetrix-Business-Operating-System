import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Layers,
  Package,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { COMMERCE_CATEGORIES, CommerceCategory } from '../../data/ecommerceStudioData';

interface CategoriesManagementViewProps {
  onSelectCategory: (categoryName: string) => void;
  onNewCategory?: () => void;
}

export const CategoriesManagementView: React.FC<CategoriesManagementViewProps> = ({
  onSelectCategory,
  onNewCategory
}) => {
  const [categories, setCategories] = useState<CommerceCategory[]>(COMMERCE_CATEGORIES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatGroup, setNewCatGroup] = useState<'Stone' | 'Building Materials'>('Stone');
  const [newCatDesc, setNewCatDesc] = useState('');

  const stoneCats = categories.filter(c => c.group === 'Stone');
  const buildingCats = categories.filter(c => c.group === 'Building Materials');

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    const newCat: CommerceCategory = {
      id: `cat-${Date.now()}`,
      name: newCatName,
      group: newCatGroup,
      description: newCatDesc || 'Configured commercial category',
      itemCount: 0,
      priorityOrder: categories.length + 1,
      iconName: newCatGroup === 'Stone' ? 'Layers' : 'Package'
    };
    setCategories([...categories, newCat]);
    setNewCatName('');
    setNewCatDesc('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
              CONFIGURABLE TAXONOMY & CLASSIFICATION
            </span>
            <span className="text-xs text-slate-400 font-medium">Expandable Material Index</span>
          </div>
          <h1 className="text-xl font-black text-white mt-1">Product Categories ({categories.length})</h1>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Custom Category</span>
        </button>
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="p-5 bg-slate-900 border border-amber-500/40 rounded-3xl shadow-xl space-y-4 max-w-lg">
          <h3 className="text-sm font-bold text-white">Create New Expandable Category</h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Category Name</label>
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Micro Silica, Geosynthetics..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Classification Group</label>
              <select
                value={newCatGroup}
                onChange={(e) => setNewCatGroup(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
              >
                <option value="Stone">Stone / Aggregates / Natural Minerals</option>
                <option value="Building Materials">Manufactured Building Materials / Steel / Cement</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Description</label>
              <input
                type="text"
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                placeholder="Brief technical description"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
              />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs"
              >
                Save Category
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section 1: Stone Categories (Laterite Stone is priority commercial) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Stone & Natural Minerals ({stoneCats.length})</span>
          </h2>
          <span className="text-[11px] text-amber-400 font-mono">Priority Commercial Category: Laterite Stone</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stoneCats.map((cat) => {
            const isLaterite = cat.id === 'cat-laterite';
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.name)}
                className={`p-5 rounded-3xl border transition cursor-pointer flex flex-col justify-between ${
                  isLaterite
                    ? 'bg-amber-500/10 border-amber-500/50 hover:border-amber-400 shadow-lg'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-500">#{cat.priorityOrder}</span>
                    {isLaterite && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                        PRIORITY FLOW
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white">{cat.name}</h3>
                  <p className="text-xs text-slate-400">{cat.description}</p>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-400 font-bold">{cat.itemCount} Listed Products</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold group-hover:text-white">
                    <span>Browse</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Building Materials */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Package className="w-4 h-4 text-cyan-400" />
            <span>Building Materials & Steel ({buildingCats.length})</span>
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">Direct Mill Concession & Distributor</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {buildingCats.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className="p-5 bg-slate-900 border border-slate-800 rounded-3xl hover:border-cyan-500/40 transition cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-slate-500">#{cat.priorityOrder}</span>
                <h3 className="text-base font-bold text-white">{cat.name}</h3>
                <p className="text-xs text-slate-400">{cat.description}</p>
              </div>

              <div className="pt-4 mt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400 font-bold">{cat.itemCount} Listed Products</span>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
                  <span>Browse</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
