import React, { useState, useEffect } from 'react';
import { 
  Scale, Plus, RefreshCw, AlertCircle, CheckCircle2, QrCode, 
  Truck, User, FileText, Ban, Check, ArrowRight, ShieldCheck
} from 'lucide-react';
import { 
  QuarryMaster, StoneProduct, GatePass, CreateGatePassDto, VerifyWeighbridgeDto,
  quarryApiClient 
} from '../../services/quarryApiClient';
import { apiClient } from '../../services/apiClient';

interface QuarryGatePassDispatchViewProps {
  activeQuarry: QuarryMaster;
}

export const QuarryGatePassDispatchView: React.FC<QuarryGatePassDispatchViewProps> = ({ activeQuarry }) => {
  const [gatePasses, setGatePasses] = useState<GatePass[]>([]);
  const [products, setProducts] = useState<StoneProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedPass, setSelectedPass] = useState<GatePass | null>(null);

  // Forms
  const [createForm, setCreateForm] = useState<CreateGatePassDto>({
    quarryId: activeQuarry?.id || 'quarry-laterite-01',
    customerId: 'cust-infra-01',
    productId: '',
    quantity: 20,
    vehicleNo: 'KA-19-MC-8812',
    driverName: 'Ramesh Gowda',
    salesReference: 'PO-2026-992'
  });

  const [verifyForm, setVerifyForm] = useState<VerifyWeighbridgeDto>({
    grossWeight: 42.5,
    tareWeight: 14.2
  });

  const [cancelReason, setCancelReason] = useState('');

  const loadData = async () => {
    if (!activeQuarry?.id) return;
    setLoading(true);
    setErrorMsg(null);
    const [passesRes, prodRes] = await Promise.all([
      quarryApiClient.listGatePasses(activeQuarry.id),
      quarryApiClient.listProducts(activeQuarry.id)
    ]);
    setLoading(false);

    if (passesRes.success && passesRes.data) {
      setGatePasses(passesRes.data);
    }
    if (prodRes.success && prodRes.data) {
      setProducts(prodRes.data);
      if (prodRes.data.length > 0 && !createForm.productId && prodRes.data[0]?.id) {
        setCreateForm(prev => ({ ...prev, productId: prodRes.data[0]?.id || '' }));
      }
    }
  };

  useEffect(() => {
    if (activeQuarry?.id) {
      setCreateForm(prev => ({ ...prev, quarryId: activeQuarry.id }));
      loadData();
    }
  }, [activeQuarry?.id]);

  const handleCreatePass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.productId || createForm.quantity <= 0 || !createForm.customerId) {
      setErrorMsg('Please specify a valid product, customer, and positive quantity.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg(null);

    const res = await quarryApiClient.createGatePass(activeQuarry.id, {
      ...createForm,
      quarryId: activeQuarry.id
    });

    setIsSubmitting(false);
    if (res.success && res.data) {
      setShowCreateModal(false);
      setSuccessMsg(`Gate pass ${res.data.passNumber} generated in ISSUED state.`);
      setTimeout(() => setSuccessMsg(null), 3500);
      setCreateForm(prev => ({
        ...prev,
        quantity: 20,
        salesReference: ''
      }));
      loadData();
    } else {
      setErrorMsg(res.message || res.error || 'Failed to create gate pass');
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPass) return;
    setIsSubmitting(true);
    setErrorMsg(null);

    const res = await quarryApiClient.verifyGatePass(activeQuarry.id, selectedPass.id, verifyForm);
    setIsSubmitting(false);
    if (res.success && res.data) {
      setShowVerifyModal(false);
      setSelectedPass(null);
      setSuccessMsg(`Gate pass ${res.data.passNumber} weighbridge verified.`);
      setTimeout(() => setSuccessMsg(null), 3500);
      loadData();
    } else {
      setErrorMsg(res.message || res.error || 'Weighbridge verification failed');
    }
  };

  const handleDispatch = async (pass: GatePass) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMsg(null);

    const res = await quarryApiClient.dispatchGatePass(activeQuarry.id, pass.id);
    setIsSubmitting(false);

    if (res.success && res.data) {
      setSuccessMsg(`Gate pass ${res.data.gatePass.passNumber} DISPATCHED. Stock deducted: remaining balance is ${res.data.remainingStock}.`);
      setTimeout(() => setSuccessMsg(null), 4000);
      loadData();
    } else {
      // Map error codes gracefully
      if (res.error === 'GATE_PASS_ALREADY_DISPATCHED' || res.message?.includes('already been dispatched')) {
        setErrorMsg(`Gate pass ${pass.passNumber} was already dispatched. Refreshed state.`);
        loadData();
      } else if (res.error === 'INSUFFICIENT_STOCK') {
        setErrorMsg(res.message || 'Dispatch rejected: Insufficient stock in quarry stockyard.');
      } else {
        setErrorMsg(res.message || res.error || 'Dispatch operation failed');
      }
    }
  };

  const handleCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPass || !cancelReason.trim()) {
      setErrorMsg('Please specify a cancellation reason.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg(null);

    const res = await quarryApiClient.cancelGatePass(activeQuarry.id, selectedPass.id, cancelReason);
    setIsSubmitting(false);
    if (res.success && res.data) {
      setShowCancelModal(false);
      setSelectedPass(null);
      setCancelReason('');
      setSuccessMsg(`Gate pass ${res.data.passNumber} cancelled.`);
      setTimeout(() => setSuccessMsg(null), 3500);
      loadData();
    } else {
      setErrorMsg(res.message || res.error || 'Failed to cancel gate pass');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Modules 6 &amp; 8 — Scalehouse &amp; Dispatch</span>
          <h2 className="text-xl font-bold text-white mt-1">Weighbridge Gate Pass &amp; Atomic Stock Deduction Engine</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Quarry: <span className="text-amber-300 font-semibold">{activeQuarry.name}</span> • State Machine: <span className="text-emerald-400 font-mono">DRAFT → ISSUED → VERIFIED → DISPATCHED</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 text-xs flex items-center gap-1.5"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            <span>Refresh</span>
          </button>

          {apiClient.hasPermission('GATE_PASS_CREATE') && (
            <button
              onClick={() => {
                setErrorMsg(null);
                setShowCreateModal(true);
              }}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Gate Pass</span>
            </button>
          )}
        </div>
      </div>

      {/* Error & Success Toasts */}
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

      {/* Gate Passes Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-400" /> Operational Gate Passes
          </h3>
          <span className="text-xs font-mono text-slate-400">{gatePasses.length} Total Passes</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs font-mono flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
            <span>Fetching gate passes from server...</span>
          </div>
        ) : gatePasses.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs font-mono bg-slate-950/60 rounded-xl border border-slate-800/80">
            No gate passes recorded for this quarry yet. Click "Create Gate Pass" to initiate a scalehouse dispatch.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Pass Number</th>
                  <th className="p-3">Product</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Vehicle / Driver</th>
                  <th className="p-3">Weighbridge Weights</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Operational Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {gatePasses.map((gp) => {
                  const prod = products.find(p => p.id === gp.productId);
                  return (
                    <tr key={gp.id} className="hover:bg-slate-800/50">
                      <td className="p-3">
                        <span className="text-amber-400 font-bold block">{gp.passNumber}</span>
                        <span className="text-[10px] text-slate-400">{gp.salesReference || 'Walk-in Order'}</span>
                      </td>
                      <td className="p-3 font-sans text-white">
                        {prod ? prod.name : gp.productId}
                      </td>
                      <td className="p-3 text-emerald-400 font-bold">
                        {gp.quantity} {gp.unit}
                      </td>
                      <td className="p-3">
                        <div className="text-white font-semibold">{gp.vehicleNo || 'N/A'}</div>
                        <div className="text-slate-400 text-[10px]">{gp.driverName || 'Driver N/A'}</div>
                      </td>
                      <td className="p-3 text-[11px] text-slate-300">
                        {gp.grossWeight ? (
                          <div>
                            <span>Gross: {gp.grossWeight} T • Tare: {gp.tareWeight} T</span>
                            {gp.netWeight !== undefined && (
                              <strong className="text-amber-300 block">Net: {gp.netWeight} T</strong>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">Not weighed</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                          gp.status === 'DISPATCHED' ? 'bg-emerald-500/20 text-emerald-300' :
                          gp.status === 'VERIFIED' ? 'bg-blue-500/20 text-blue-300' :
                          gp.status === 'ISSUED' ? 'bg-amber-500/20 text-amber-300' :
                          'bg-rose-500/20 text-rose-300'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {gp.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Verify Button (ISSUED -> VERIFIED) */}
                          {gp.status === 'ISSUED' && apiClient.hasPermission('GATE_PASS_VERIFY') && (
                            <button
                              onClick={() => {
                                setSelectedPass(gp);
                                setVerifyForm({
                                  grossWeight: gp.grossWeight || 40.0,
                                  tareWeight: gp.tareWeight || 12.5
                                });
                                setErrorMsg(null);
                                setShowVerifyModal(true);
                              }}
                              disabled={isSubmitting}
                              className="px-2.5 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 rounded text-[11px] font-bold flex items-center gap-1"
                            >
                              <Scale className="w-3 h-3" /> Verify
                            </button>
                          )}

                          {/* Dispatch Button (VERIFIED or ISSUED -> DISPATCHED) */}
                          {(gp.status === 'VERIFIED' || gp.status === 'ISSUED') && apiClient.hasPermission('GATE_PASS_DISPATCH') && (
                            <button
                              onClick={() => handleDispatch(gp)}
                              disabled={isSubmitting}
                              className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded text-[11px] font-bold flex items-center gap-1 disabled:opacity-50"
                            >
                              <ArrowRight className="w-3 h-3" /> Dispatch
                            </button>
                          )}

                          {/* Cancel Button (Not DISPATCHED/CANCELLED) */}
                          {gp.status !== 'DISPATCHED' && gp.status !== 'CANCELLED' && apiClient.hasPermission('GATE_PASS_CANCEL') && (
                            <button
                              onClick={() => {
                                setSelectedPass(gp);
                                setCancelReason('');
                                setErrorMsg(null);
                                setShowCancelModal(true);
                              }}
                              disabled={isSubmitting}
                              className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded text-[11px]"
                            >
                              <Ban className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Create Gate Pass */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-400" /> Create Digital Gate Pass
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white text-sm">✕</button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreatePass} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Stone Product *</label>
                <select
                  value={createForm.productId}
                  onChange={(e) => setCreateForm({ ...createForm, productId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.productCode}) — [{p.unit}]</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={createForm.quantity}
                    onChange={(e) => setCreateForm({ ...createForm, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Customer / Contractor ID *</label>
                  <input
                    type="text"
                    required
                    value={createForm.customerId}
                    onChange={(e) => setCreateForm({ ...createForm, customerId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Vehicle Number</label>
                  <input
                    type="text"
                    placeholder="KA-19-MC-8812"
                    value={createForm.vehicleNo || ''}
                    onChange={(e) => setCreateForm({ ...createForm, vehicleNo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Driver Name</label>
                  <input
                    type="text"
                    placeholder="Ramesh Gowda"
                    value={createForm.driverName || ''}
                    onChange={(e) => setCreateForm({ ...createForm, driverName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Sales Order / PO Reference</label>
                <input
                  type="text"
                  placeholder="PO-2026-992 / Counter Sale"
                  value={createForm.salesReference || ''}
                  onChange={(e) => setCreateForm({ ...createForm, salesReference: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Issuing...' : 'Issue Gate Pass'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Weighbridge Verification */}
      {showVerifyModal && selectedPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-400" /> Weighbridge Verification — {selectedPass.passNumber}
              </h3>
              <button onClick={() => setShowVerifyModal(false)} className="text-slate-400 hover:text-white text-sm">✕</button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Gross Weight (Tons)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={verifyForm.grossWeight}
                    onChange={(e) => setVerifyForm({ ...verifyForm, grossWeight: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tare Weight (Tons)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={verifyForm.tareWeight}
                    onChange={(e) => setVerifyForm({ ...verifyForm, tareWeight: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {verifyForm.grossWeight && verifyForm.tareWeight && (
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 flex justify-between">
                  <span>Calculated Net Material Weight:</span>
                  <strong className="text-emerald-400">
                    {(verifyForm.grossWeight - verifyForm.tareWeight).toFixed(2)} Tons
                  </strong>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowVerifyModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Verifying...' : 'Approve Weighbridge'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Cancel Gate Pass */}
      {showCancelModal && selectedPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Ban className="w-5 h-5 text-rose-400" /> Cancel Gate Pass — {selectedPass.passNumber}
              </h3>
              <button onClick={() => setShowCancelModal(false)} className="text-slate-400 hover:text-white text-sm">✕</button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCancel} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cancellation Justification Reason *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Vehicle breakdown prior to loading, or order cancelled by client"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-xl shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
