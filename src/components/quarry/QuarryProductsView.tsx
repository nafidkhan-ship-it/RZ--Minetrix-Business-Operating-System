import React, { useState, useEffect } from 'react';
import { 
  PackageCheck, Plus, RefreshCw, AlertCircle, Trash2, Edit3, 
  Search, ShieldAlert, CheckCircle2, DollarSign, Layers
} from 'lucide-react';
import { 
  StoneProduct, CreateStoneProductDto, QuarryMaster, QuarryType, quarryApiClient 
} from '../../services/quarryApiClient';
import { apiClient } from '../../services/apiClient';

interface QuarryProductsViewProps {
  activeQuarry: QuarryMaster;
}

export const QuarryProductsView: React.FC<QuarryProductsViewProps> = ({ activeQuarry }) => {
  const [products, setProducts] = useState<StoneProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateStoneProductDto>({
    quarryId: activeQuarry?.id || 'quarry-laterite-01',
    productCode: '',
    name: '',
    mineralType: activeQuarry?.quarryType || 'LATERITE',
    dimensions: '',
    unit: activeQuarry?.quarryType === 'LATERITE' ? 'PIECE' : 'TON',
    defaultPrice: 500,
    gstRate: 5
  });

  const fetchProducts = async () => {
    if (!activeQuarry?.id) return;
    setLoading(true);
    setErrorMsg(null);
    const res = await quarryApiClient.listProducts(activeQuarry.id);
    setLoading(false);
    if (res.success && res.data) {
      setProducts(res.data);
    } else {
      setErrorMsg(res.message || res.error || 'Failed to load products for this quarry');
    }
  };

  useEffect(() => {
    if (activeQuarry?.id) {
      fetchProducts();
      setFormData((prev) => ({
        ...prev,
        quarryId: activeQuarry.id,
        mineralType: activeQuarry.quarryType,
        unit: activeQuarry.quarryType === 'LATERITE' ? 'PIECE' : 'TON'
      }));
    }
  }, [activeQuarry?.id]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.productCode || formData.defaultPrice <= 0) {
      setErrorMsg('Please complete all required fields with valid pricing.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg(null);
    const res = await quarryApiClient.createProduct(activeQuarry.id, {
      ...formData,
      quarryId: activeQuarry.id,
      mineralType: activeQuarry.quarryType
    });
    setIsSubmitting(false);
    if (res.success && res.data) {
      setShowAddModal(false);
      setSuccessMsg(`Stone product '${res.data.name}' registered successfully.`);
      setTimeout(() => setSuccessMsg(null), 3000);
      setFormData({
        quarryId: activeQuarry.id,
        productCode: '',
        name: '',
        mineralType: activeQuarry.quarryType,
        dimensions: '',
        unit: activeQuarry.quarryType === 'LATERITE' ? 'PIECE' : 'TON',
        defaultPrice: 500,
        gstRate: 5
      });
      fetchProducts();
    } else {
      setErrorMsg(res.message || res.error || 'Failed to create stone product');
    }
  };

  const handleDeactivate = async (productId: string, name: string) => {
    if (!confirm(`Are you sure you want to deactivate '${name}'?`)) return;
    setIsSubmitting(true);
    const res = await quarryApiClient.deactivateProduct(activeQuarry.id, productId);
    setIsSubmitting(false);
    if (res.success) {
      setSuccessMsg(`Product '${name}' deactivated.`);
      setTimeout(() => setSuccessMsg(null), 3000);
      fetchProducts();
    } else {
      setErrorMsg(res.message || res.error || 'Failed to deactivate product');
    }
  };

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.productCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Module 3 — Real Quarry API</span>
          <h2 className="text-xl font-bold text-white mt-1">Stone Product Catalog &amp; Tariff Specifications</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Quarry: <span className="text-amber-300 font-semibold">{activeQuarry.name}</span> ({activeQuarry.quarryType})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search products or codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            onClick={fetchProducts}
            disabled={loading}
            className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 transition-all disabled:opacity-50"
            title="Refresh Products"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          {apiClient.hasPermission('PRODUCT_CREATE') && (
            <button
              onClick={() => {
                setErrorMsg(null);
                setShowAddModal(true);
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Stone Product</span>
            </button>
          )}
        </div>
      </div>

      {/* Error / Success Feedback */}
      {errorMsg && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs font-mono flex flex-col items-center justify-center gap-2">
          <RefreshCw className="w-6 h-6 text-amber-400 animate-spin" />
          <span>Fetching stone products from Quarry API...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-xs font-mono bg-slate-950/60 rounded-2xl border border-slate-800/80 p-8 space-y-2">
          <Layers className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-white font-semibold">No stone products registered for {activeQuarry.name}</p>
          <p className="text-slate-400 text-[11px]">Click "Add Stone Product" above to create products compatible with this quarry's mineral type.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((prod) => (
            <div 
              key={prod.id} 
              className="p-5 bg-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-xl space-y-3 transition-all font-mono"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-slate-900 text-amber-300 text-[10px] rounded-md border border-slate-800 font-bold">
                  {prod.productCode}
                </span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                  prod.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  {prod.status}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white font-sans">{prod.name}</h4>
                {prod.dimensions && (
                  <span className="text-slate-400 text-[11px]">Dimensions: {prod.dimensions}</span>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                <div className="flex justify-between">
                  <span className="text-slate-400">Unit of Measure:</span>
                  <strong className="text-white">{prod.unit}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Base Price (excl. GST):</span>
                  <strong className="text-amber-400">₹{prod.defaultPrice.toLocaleString()} / {prod.unit}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">GST Tariff:</span>
                  <span className="text-emerald-400">{prod.gstRate ?? 5}%</span>
                </div>
                <div className="flex justify-between font-bold text-white border-t border-slate-800/60 pt-1">
                  <span>Price (incl. GST):</span>
                  <span className="text-emerald-400">
                    ₹{((prod.defaultPrice * (1 + (prod.gstRate || 5) / 100))).toFixed(2)} / {prod.unit}
                  </span>
                </div>
              </div>

              {apiClient.hasPermission('PRODUCT_DEACTIVATE') && prod.status === 'ACTIVE' && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleDeactivate(prod.id, prod.name)}
                    disabled={isSubmitting}
                    className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded text-[11px] border border-rose-500/30 flex items-center gap-1 transition-all"
                  >
                    <Trash2 className="w-3 h-3" /> Deactivate
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add Stone Product */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-amber-400" /> Add Stone Product to {activeQuarry.name}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Product Code *</label>
                  <input
                    type="text"
                    required
                    placeholder={activeQuarry.quarryType === 'LATERITE' ? 'LAT-STD-30' : 'AGG-20MM'}
                    value={formData.productCode}
                    onChange={(e) => setFormData({ ...formData, productCode: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Unit of Measure *</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="TON">TON (Metric Ton)</option>
                    <option value="CFT">CFT (Cubic Feet)</option>
                    <option value="PIECE">PIECE (Individual Unit)</option>
                    <option value="LOAD">LOAD (Standard Tipper Load)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder={activeQuarry.quarryType === 'LATERITE' ? 'Laterite Stone Grade A (Structural)' : '20mm Crushed Blue Metal Aggregate'}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Dimensions / Technical Specs</label>
                <input
                  type="text"
                  placeholder="e.g. 30 x 20 x 15 cm or 20mm IS:383 Compliant"
                  value={formData.dimensions}
                  onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Default Base Price (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    value={formData.defaultPrice}
                    onChange={(e) => setFormData({ ...formData, defaultPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">GST Tariff (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="28"
                    value={formData.gstRate}
                    onChange={(e) => setFormData({ ...formData, gstRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 font-mono">
                <span>Mineral Validation: </span>
                <strong className="text-amber-400">
                  {activeQuarry.quarryType === 'LATERITE' ? 'LATERITE (Laterite Quarry Compatible)' : 'HARD_ROCK (Hard Rock Granite Compatible)'}
                </strong>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Registering...' : 'Register Stone Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
