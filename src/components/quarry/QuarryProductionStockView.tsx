import React, { useState, useEffect } from 'react';
import { 
  Pickaxe, RefreshCw, AlertCircle, CheckCircle2, Sliders, 
  Layers, FileText, ArrowUpRight, ArrowDownRight, Clock, User, Plus
} from 'lucide-react';
import { 
  QuarryMaster, StoneProduct, ProductionLog, StockSummaryItem, StockLedgerEntry,
  RecordProductionDto, RecordStockAdjustmentDto, quarryApiClient 
} from '../../services/quarryApiClient';
import { apiClient } from '../../services/apiClient';

interface QuarryProductionStockViewProps {
  activeQuarry: QuarryMaster;
}

export const QuarryProductionStockView: React.FC<QuarryProductionStockViewProps> = ({ activeQuarry }) => {
  const [products, setProducts] = useState<StoneProduct[]>([]);
  const [productionLogs, setProductionLogs] = useState<ProductionLog[]>([]);
  const [stockSummary, setStockSummary] = useState<StockSummaryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Stock Ledger Modal state
  const [selectedLedgerProduct, setSelectedLedgerProduct] = useState<StoneProduct | null>(null);
  const [ledgerEntries, setLedgerEntries] = useState<StockLedgerEntry[]>([]);
  const [ledgerLoading, setLedgerLoading] = useState(false);

  // Stock Adjustment Modal state
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [adjustmentForm, setAdjustmentForm] = useState<RecordStockAdjustmentDto>({
    quarryId: activeQuarry?.id || 'quarry-laterite-01',
    productId: '',
    adjustmentType: 'ADJUSTMENT_IN',
    quantity: 10,
    reason: '',
    remarks: ''
  });

  // Production Form state
  const [productionForm, setProductionForm] = useState<RecordProductionDto>({
    quarryId: activeQuarry?.id || 'quarry-laterite-01',
    productId: '',
    productionType: activeQuarry?.quarryType === 'LATERITE' ? 'LATERITE_CUTTING' : 'HARD_ROCK_EXTRACTION',
    shift: 'DAY',
    quantity: 100,
    operatorId: 'OPR-88201',
    remarks: ''
  });

  const loadData = async () => {
    if (!activeQuarry?.id) return;
    setLoading(true);
    setErrorMsg(null);

    // Fetch products, production logs, stock summary in parallel
    const [prodRes, logsRes, stockRes] = await Promise.all([
      quarryApiClient.listProducts(activeQuarry.id),
      quarryApiClient.listProduction(activeQuarry.id),
      quarryApiClient.getStockSummary(activeQuarry.id)
    ]);

    setLoading(false);

    if (prodRes.success && prodRes.data) {
      setProducts(prodRes.data);
      if (prodRes.data.length > 0 && !productionForm.productId && prodRes.data[0]?.id) {
        setProductionForm(prev => ({ ...prev, productId: prodRes.data[0]?.id || '' }));
      }
    }
    if (logsRes.success && logsRes.data) {
      setProductionLogs(logsRes.data);
    }
    if (stockRes.success && stockRes.data) {
      setStockSummary(stockRes.data);
    }
  };

  useEffect(() => {
    setProductionForm(prev => ({
      ...prev,
      quarryId: activeQuarry.id,
      productionType: activeQuarry.quarryType === 'LATERITE' ? 'LATERITE_CUTTING' : 'HARD_ROCK_EXTRACTION'
    }));
    setAdjustmentForm(prev => ({ ...prev, quarryId: activeQuarry.id }));
    loadData();
  }, [activeQuarry.id]);

  const handleRecordProduction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productionForm.productId || productionForm.quantity <= 0) {
      setErrorMsg('Please choose a product and enter a valid quantity > 0.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg(null);

    const res = await quarryApiClient.recordProduction(activeQuarry.id, {
      ...productionForm,
      quarryId: activeQuarry.id
    });

    setIsSubmitting(false);
    if (res.success && res.data) {
      setSuccessMsg(`Production of ${res.data.quantity} units recorded into stock ledger.`);
      setTimeout(() => setSuccessMsg(null), 3500);
      setProductionForm(prev => ({
        ...prev,
        quantity: 100,
        remarks: ''
      }));
      // Refresh both stock and production list from backend
      loadData();
    } else {
      setErrorMsg(res.message || res.error || 'Failed to record production');
    }
  };

  const handleOpenLedger = async (prod: StoneProduct) => {
    setSelectedLedgerProduct(prod);
    setLedgerLoading(true);
    const res = await quarryApiClient.getStockLedger(activeQuarry.id, prod.id);
    setLedgerLoading(false);
    if (res.success && res.data) {
      setLedgerEntries(res.data);
    } else {
      setLedgerEntries([]);
    }
  };

  const handleRecordAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustmentForm.productId || adjustmentForm.quantity <= 0 || !adjustmentForm.reason.trim()) {
      setErrorMsg('Please select a product, positive quantity, and mandatory justification reason.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg(null);

    const res = await quarryApiClient.recordStockAdjustment(activeQuarry.id, {
      ...adjustmentForm,
      quarryId: activeQuarry.id
    });

    setIsSubmitting(false);
    if (res.success && res.data) {
      setShowAdjustmentModal(false);
      setSuccessMsg(`Stock adjustment recorded. Updated balance: ${res.data.balanceQuantity}`);
      setTimeout(() => setSuccessMsg(null), 3500);
      setAdjustmentForm({
        quarryId: activeQuarry.id,
        productId: products[0]?.id || '',
        adjustmentType: 'ADJUSTMENT_IN',
        quantity: 10,
        reason: '',
        remarks: ''
      });
      loadData();
    } else {
      setErrorMsg(res.message || res.error || 'Stock adjustment rejected by server');
    }
  };

  return (
    <div className="space-y-6">
      {/* Messages */}
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

      {/* Real-time Stockyard Summary Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Authoritative Stockyard Ledger</span>
            <h3 className="text-lg font-bold text-white mt-0.5">Live Stock Balances for {activeQuarry.name}</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 text-xs flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
              <span>Refresh Stock</span>
            </button>

            {apiClient.hasPermission('STOCK_ADJUST') && products.length > 0 && (
              <button
                onClick={() => {
                  setErrorMsg(null);
                  setAdjustmentForm(prev => ({ ...prev, productId: products[0]?.id || '' }));
                  setShowAdjustmentModal(true);
                }}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Stock Adjustment</span>
              </button>
            )}
          </div>
        </div>

        {stockSummary.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs font-mono bg-slate-950/60 rounded-xl border border-slate-800/80">
            No stock movements recorded yet for this quarry. Record production below to initialize stock.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {stockSummary.map((item) => {
              const matchingProd = products.find(p => p.id === item.productId);
              return (
                <div key={item.productId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-400 font-bold text-[11px]">{item.productCode}</span>
                    <span className="text-[10px] text-slate-400">{item.unit}</span>
                  </div>

                  <h5 className="text-white font-sans font-bold truncate">{item.productName}</h5>

                  <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px]">
                    <div className="flex justify-between text-slate-400">
                      <span>Total Produced:</span>
                      <span className="text-emerald-400 font-bold">+{item.totalIn}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Total Dispatched:</span>
                      <span className="text-rose-400 font-bold">-{item.totalOut}</span>
                    </div>
                    <div className="flex justify-between font-bold text-white border-t border-slate-800/60 pt-1 text-xs">
                      <span>Available Stock:</span>
                      <span className="text-amber-300">{item.balanceQuantity} {item.unit}</span>
                    </div>
                  </div>

                  {matchingProd && (
                    <button
                      onClick={() => handleOpenLedger(matchingProd)}
                      className="w-full mt-2 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded text-[10px] border border-slate-800 flex items-center justify-center gap-1 font-sans font-semibold"
                    >
                      <FileText className="w-3 h-3 text-amber-400" /> View Ledger History
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Grid: Record Shift Production & Production Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form: Record Production */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Pickaxe className="w-5 h-5 text-amber-400" /> Log Shift Production
          </h3>

          {products.length === 0 ? (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs">
              Please register stone products under the <strong>Building Materials Engine</strong> tab before logging production.
            </div>
          ) : (
            <form onSubmit={handleRecordProduction} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Stone Product *</label>
                <select
                  value={productionForm.productId}
                  onChange={(e) => setProductionForm({ ...productionForm, productId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 font-mono"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.productCode}) — [{p.unit}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Production Type</label>
                  <select
                    value={productionForm.productionType}
                    onChange={(e) => setProductionForm({ ...productionForm, productionType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="LATERITE_CUTTING">Laterite Cutting</option>
                    <option value="HARD_ROCK_EXTRACTION">Hard Rock Extraction</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Work Shift</label>
                  <select
                    value={productionForm.shift}
                    onChange={(e) => setProductionForm({ ...productionForm, shift: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="DAY">Day Shift</option>
                    <option value="NIGHT">Night Shift</option>
                    <option value="GENERAL">General Shift</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Yield Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={productionForm.quantity}
                    onChange={(e) => setProductionForm({ ...productionForm, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Operator ID *</label>
                  <input
                    type="text"
                    required
                    value={productionForm.operatorId}
                    onChange={(e) => setProductionForm({ ...productionForm, operatorId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Machine / Bench Remarks</label>
                <input
                  type="text"
                  placeholder="e.g. Cutter Bench #2, Blade replacement at 14:00"
                  value={productionForm.remarks || ''}
                  onChange={(e) => setProductionForm({ ...productionForm, remarks: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Recording to Ledger...' : 'Post Shift Production'}
              </button>
            </form>
          )}
        </div>

        {/* Live Production Register Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>Shift Production Register (Real Backend Log)</span>
            <span className="text-xs font-mono text-amber-400">{productionLogs.length} Entries Logged</span>
          </h3>

          <div className="overflow-x-auto">
            {productionLogs.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs font-mono">
                No production logs recorded yet.
              </div>
            ) : (
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Log ID</th>
                    <th className="p-3">Product</th>
                    <th className="p-3">Quantity</th>
                    <th className="p-3">Shift</th>
                    <th className="p-3">Operator</th>
                    <th className="p-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {productionLogs.map((log) => {
                    const prod = products.find(p => p.id === log.productId);
                    return (
                      <tr key={log.id} className="hover:bg-slate-800/50">
                        <td className="p-3 text-amber-400 font-bold">{log.id.slice(0, 10)}...</td>
                        <td className="p-3 font-sans text-white">{prod ? prod.name : log.productId}</td>
                        <td className="p-3 text-emerald-400 font-bold">+{log.quantity} {prod?.unit || 'units'}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px]">
                            {log.shift || 'DAY'}
                          </span>
                        </td>
                        <td className="p-3 text-slate-300">{log.operatorId}</td>
                        <td className="p-3 text-slate-400 text-[11px]">
                          {log.createdAt ? new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal / Drawer: Stock Ledger History */}
      {selectedLedgerProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs text-amber-400 font-mono uppercase">Authoritative Stock Ledger</span>
                <h3 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
                  <FileText className="w-5 h-5 text-amber-400" /> {selectedLedgerProduct.name} ({selectedLedgerProduct.productCode})
                </h3>
              </div>
              <button
                onClick={() => setSelectedLedgerProduct(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {ledgerLoading ? (
                <div className="py-12 text-center text-slate-400 text-xs font-mono flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
                  <span>Loading ledger entries...</span>
                </div>
              ) : ledgerEntries.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs font-mono">
                  No stock transactions found for this product.
                </div>
              ) : (
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">Date</th>
                      <th className="p-2.5">Transaction Type</th>
                      <th className="p-2.5">Ref Type</th>
                      <th className="p-2.5 text-right">In (+)</th>
                      <th className="p-2.5 text-right">Out (-)</th>
                      <th className="p-2.5 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {ledgerEntries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-800/40">
                        <td className="p-2.5 text-slate-400 text-[11px]">{entry.transactionDate}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            entry.transactionType.includes('IN') ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                          }`}>
                            {entry.transactionType}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-300 text-[11px]">{entry.referenceType || '-'}</td>
                        <td className="p-2.5 text-right text-emerald-400 font-bold">
                          {entry.quantityIn > 0 ? `+${entry.quantityIn}` : '-'}
                        </td>
                        <td className="p-2.5 text-right text-rose-400 font-bold">
                          {entry.quantityOut > 0 ? `-${entry.quantityOut}` : '-'}
                        </td>
                        <td className="p-2.5 text-right text-amber-300 font-bold">
                          {entry.balanceQuantity} {selectedLedgerProduct.unit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedLedgerProduct(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Close Ledger
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Record Stock Adjustment */}
      {showAdjustmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-400" /> Stock Adjustment (Audit Gated)
              </h3>
              <button
                onClick={() => setShowAdjustmentModal(false)}
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

            <form onSubmit={handleRecordAdjustment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Product *</label>
                <select
                  value={adjustmentForm.productId}
                  onChange={(e) => setAdjustmentForm({ ...adjustmentForm, productId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.productCode})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Adjustment Type *</label>
                  <select
                    value={adjustmentForm.adjustmentType}
                    onChange={(e) => setAdjustmentForm({ ...adjustmentForm, adjustmentType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="ADJUSTMENT_IN">ADJUSTMENT_IN (+)</option>
                    <option value="ADJUSTMENT_OUT">ADJUSTMENT_OUT (-)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Delta Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={adjustmentForm.quantity}
                    onChange={(e) => setAdjustmentForm({ ...adjustmentForm, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Mandatory Justification Reason *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Physical inventory variance reconciliation approved by quarry controller"
                  value={adjustmentForm.reason}
                  onChange={(e) => setAdjustmentForm({ ...adjustmentForm, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdjustmentModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Applying Adjustment...' : 'Record Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
