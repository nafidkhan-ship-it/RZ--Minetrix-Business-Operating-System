import React, { useState, useEffect } from 'react';
import { 
  Coins, Plus, RefreshCw, AlertCircle, CheckCircle2, FileText, 
  Trash2, ShieldCheck, Check, Calendar, User, Layers
} from 'lucide-react';
import { 
  QuarryMaster, LandLease, LandownerSettlementStatement, CreateLandLeaseDto, CreateSettlementDto,
  quarryApiClient 
} from '../../services/quarryApiClient';
import { apiClient } from '../../services/apiClient';

interface QuarryLandLeasesViewProps {
  activeQuarry: QuarryMaster;
}

export const QuarryLandLeasesView: React.FC<QuarryLandLeasesViewProps> = ({ activeQuarry }) => {
  const [leases, setLeases] = useState<LandLease[]>([]);
  const [settlements, setSettlements] = useState<LandownerSettlementStatement[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modals
  const [showAddLeaseModal, setShowAddLeaseModal] = useState(false);
  const [showSettlementModal, setShowSettlementModal] = useState(false);

  // Forms
  const [leaseForm, setLeaseForm] = useState<CreateLandLeaseDto>({
    quarryId: activeQuarry?.id || 'quarry-laterite-01',
    ownerName: '',
    surveyNumber: '',
    village: '',
    taluk: '',
    area: 5.0,
    leaseType: 'LEASED',
    royaltyType: 'PER_TON',
    royaltyRate: 45.0,
    startDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
    documentReference: ''
  });

  const [settlementForm, setSettlementForm] = useState<CreateSettlementDto>({
    leaseId: '',
    periodStart: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
    periodEnd: new Date().toISOString().split('T')[0],
    basisQuantity: 1000
  });

  const loadData = async () => {
    if (!activeQuarry?.id) return;
    setLoading(true);
    setErrorMsg(null);
    const [leasesRes, settleRes] = await Promise.all([
      quarryApiClient.listLeases(activeQuarry.id),
      quarryApiClient.listSettlements(activeQuarry.id)
    ]);
    setLoading(false);

    if (leasesRes.success && leasesRes.data) {
      setLeases(leasesRes.data);
      if (leasesRes.data.length > 0 && !settlementForm.leaseId && leasesRes.data[0]?.id) {
        setSettlementForm(prev => ({ ...prev, leaseId: leasesRes.data[0]?.id || '' }));
      }
    }
    if (settleRes.success && settleRes.data) {
      setSettlements(settleRes.data);
    }
  };

  useEffect(() => {
    if (activeQuarry?.id) {
      setLeaseForm(prev => ({ ...prev, quarryId: activeQuarry.id }));
      loadData();
    }
  }, [activeQuarry?.id]);

  const handleCreateLease = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaseForm.ownerName || !leaseForm.surveyNumber || !leaseForm.village) {
      setErrorMsg('Please fill in owner name, survey number, and village location.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg(null);

    const res = await quarryApiClient.createLease(activeQuarry.id, {
      ...leaseForm,
      quarryId: activeQuarry.id
    });

    setIsSubmitting(false);
    if (res.success && res.data) {
      setShowAddLeaseModal(false);
      setSuccessMsg(`Land lease for '${res.data.ownerName}' registered.`);
      setTimeout(() => setSuccessMsg(null), 3500);
      setLeaseForm({
        quarryId: activeQuarry.id,
        ownerName: '',
        surveyNumber: '',
        village: '',
        taluk: '',
        area: 5.0,
        leaseType: 'LEASED',
        royaltyType: 'PER_TON',
        royaltyRate: 45.0,
        startDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
        documentReference: ''
      });
      loadData();
    } else {
      setErrorMsg(res.message || res.error || 'Failed to create land lease');
    }
  };

  const handleDeactivateLease = async (leaseId: string, name: string) => {
    if (!confirm(`Are you sure you want to deactivate lease for '${name}'?`)) return;
    setIsSubmitting(true);
    const res = await quarryApiClient.deactivateLease(activeQuarry.id, leaseId);
    setIsSubmitting(false);
    if (res.success) {
      setSuccessMsg(`Lease for '${name}' terminated.`);
      setTimeout(() => setSuccessMsg(null), 3000);
      loadData();
    } else {
      setErrorMsg(res.message || res.error || 'Failed to deactivate lease');
    }
  };

  const handleCreateSettlement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settlementForm.leaseId || settlementForm.basisQuantity <= 0) {
      setErrorMsg('Please select a valid land lease and positive production basis quantity.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg(null);

    const res = await quarryApiClient.createSettlement(activeQuarry.id, settlementForm);
    setIsSubmitting(false);
    if (res.success && res.data) {
      setShowSettlementModal(false);
      setSuccessMsg(`Settlement statement ${res.data.statementNumber} generated: Net Payable ₹${res.data.netPayable.toLocaleString()}.`);
      setTimeout(() => setSuccessMsg(null), 3500);
      loadData();
    } else {
      setErrorMsg(res.message || res.error || 'Failed to generate settlement statement');
    }
  };

  const handleApproveSettlement = async (settlementId: string, statementNumber: string) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    const res = await quarryApiClient.approveSettlement(activeQuarry.id, settlementId);
    setIsSubmitting(false);
    if (res.success) {
      setSuccessMsg(`Settlement statement ${statementNumber} APPROVED for finance disbursement.`);
      setTimeout(() => setSuccessMsg(null), 3500);
      loadData();
    } else {
      setErrorMsg(res.message || res.error || 'Failed to approve settlement statement');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Module 2 — Land &amp; Royalty Engine</span>
          <h2 className="text-xl font-bold text-white mt-1">Landowner Leases, Survey Demarcation &amp; Royalty Settlements</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Quarry: <span className="text-amber-300 font-semibold">{activeQuarry.name}</span>
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

          {apiClient.hasPermission('LAND_CREATE') && (
            <button
              onClick={() => {
                setErrorMsg(null);
                setShowAddLeaseModal(true);
              }}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Land Lease</span>
            </button>
          )}
        </div>
      </div>

      {/* Error / Success feedback */}
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

      {/* Active Land Leases Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" /> Registered Patta &amp; Government Land Leases
          </h3>
          <span className="text-xs font-mono text-slate-400">{leases.length} Leases Active</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs font-mono flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
            <span>Loading land leases from Quarry API...</span>
          </div>
        ) : leases.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs font-mono bg-slate-950/60 rounded-xl border border-slate-800/80">
            No land lease agreements registered for this quarry yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leases.map((lo) => (
              <div key={lo.id} className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-amber-400 font-bold">{lo.surveyNumber}</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    lo.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {lo.status}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white font-sans">{lo.ownerName}</h4>

                <div className="space-y-1 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Village / Taluk:</span>
                    <span>{lo.village}, {lo.taluk}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Demarcated Area:</span>
                    <span className="text-amber-300 font-bold">{lo.area} Acres</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Royalty Tariff:</span>
                    <span className="text-emerald-400">
                      ₹{lo.royaltyRate} ({lo.royaltyType.replace('_', ' ')})
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800/80 pt-1">
                    <span className="text-slate-400">Validity Expiry:</span>
                    <span className="text-slate-200">{lo.expiryDate}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center border-t border-slate-800/60">
                  <span className="text-[10px] text-slate-500">{lo.leaseType}</span>
                  <div className="flex items-center gap-2">
                    {apiClient.hasPermission('LAND_DEACTIVATE') && lo.status === 'ACTIVE' && (
                      <button
                        onClick={() => handleDeactivateLease(lo.id, lo.ownerName)}
                        disabled={isSubmitting}
                        className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded text-[10px] border border-rose-500/30 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Terminate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settlements Table & Statement Generator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" /> Landowner Royalty Settlement Statements
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Automated calculation of royalty tariffs, 10% TDS withholding and net payables.</p>
          </div>

          {leases.length > 0 && apiClient.hasPermission('SETTLEMENT_CREATE') && (
            <button
              onClick={() => {
                setErrorMsg(null);
                setSettlementForm(prev => ({ ...prev, leaseId: leases[0]?.id || '' }));
                setShowSettlementModal(true);
              }}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Generate Statement</span>
            </button>
          )}
        </div>

        {settlements.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs font-mono bg-slate-950/60 rounded-xl border border-slate-800/80">
            No settlement statements generated for this quarry yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Statement #</th>
                  <th className="p-3">Landowner</th>
                  <th className="p-3">Billing Period</th>
                  <th className="p-3">Basis Quantity</th>
                  <th className="p-3">Calculated Gross</th>
                  <th className="p-3">TDS (10%)</th>
                  <th className="p-3">Net Payable</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {settlements.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-800/50">
                    <td className="p-3 text-amber-400 font-bold">{st.statementNumber}</td>
                    <td className="p-3 font-sans text-white">{st.ownerName}</td>
                    <td className="p-3 text-slate-300 text-[11px]">{st.periodStart} to {st.periodEnd}</td>
                    <td className="p-3 text-slate-200">{st.basisQuantity} Units</td>
                    <td className="p-3 text-slate-300">₹{st.calculatedAmount.toLocaleString()}</td>
                    <td className="p-3 text-rose-400 font-bold">-₹{st.tdsDeduction.toLocaleString()}</td>
                    <td className="p-3 text-emerald-400 font-bold text-sm">₹{st.netPayable.toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        st.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300' :
                        st.status === 'PAID' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-amber-500/20 text-amber-300'
                      }`}>
                        {st.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {st.status === 'DRAFT' && apiClient.hasPermission('SETTLEMENT_APPROVE') && (
                        <button
                          onClick={() => handleApproveSettlement(st.id, st.statementNumber)}
                          disabled={isSubmitting}
                          className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded text-[11px] font-bold flex items-center gap-1 ml-auto"
                        >
                          <Check className="w-3 h-3" /> Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Add Land Lease */}
      {showAddLeaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-400" /> Add Land Lease Agreement
              </h3>
              <button onClick={() => setShowAddLeaseModal(false)} className="text-slate-400 hover:text-white text-sm">✕</button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateLease} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Land Owner Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mahabala Hegde"
                    value={leaseForm.ownerName}
                    onChange={(e) => setLeaseForm({ ...leaseForm, ownerName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Survey Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 142/2A"
                    value={leaseForm.surveyNumber}
                    onChange={(e) => setLeaseForm({ ...leaseForm, surveyNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Village *</label>
                  <input
                    type="text"
                    required
                    placeholder="Bantwal"
                    value={leaseForm.village}
                    onChange={(e) => setLeaseForm({ ...leaseForm, village: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Taluk / District *</label>
                  <input
                    type="text"
                    required
                    placeholder="Dakshina Kannada"
                    value={leaseForm.taluk}
                    onChange={(e) => setLeaseForm({ ...leaseForm, taluk: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Area (Acres) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={leaseForm.area}
                    onChange={(e) => setLeaseForm({ ...leaseForm, area: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Royalty Tariff *</label>
                  <select
                    value={leaseForm.royaltyType}
                    onChange={(e) => setLeaseForm({ ...leaseForm, royaltyType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="PER_TON">PER TON</option>
                    <option value="PER_PIECE">PER PIECE</option>
                    <option value="FIXED_MONTHLY">FIXED MONTHLY</option>
                    <option value="REVENUE_PERCENT">REVENUE SHARE (%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Rate (₹ / %) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    required
                    value={leaseForm.royaltyRate}
                    onChange={(e) => setLeaseForm({ ...leaseForm, royaltyRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    value={leaseForm.startDate}
                    onChange={(e) => setLeaseForm({ ...leaseForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={leaseForm.expiryDate}
                    onChange={(e) => setLeaseForm({ ...leaseForm, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddLeaseModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Registering...' : 'Register Lease'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Generate Settlement Statement */}
      {showSettlementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" /> Generate Royalty Statement
              </h3>
              <button onClick={() => setShowSettlementModal(false)} className="text-slate-400 hover:text-white text-sm">✕</button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateSettlement} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Land Lease *</label>
                <select
                  value={settlementForm.leaseId}
                  onChange={(e) => setSettlementForm({ ...settlementForm, leaseId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                >
                  {leases.map((lo) => (
                    <option key={lo.id} value={lo.id}>
                      {lo.ownerName} (Survey: {lo.surveyNumber} • {lo.royaltyRate} {lo.royaltyType})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Period Start</label>
                  <input
                    type="date"
                    required
                    value={settlementForm.periodStart}
                    onChange={(e) => setSettlementForm({ ...settlementForm, periodStart: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Period End</label>
                  <input
                    type="date"
                    required
                    value={settlementForm.periodEnd}
                    onChange={(e) => setSettlementForm({ ...settlementForm, periodEnd: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Basis Yield / Production Quantity *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={settlementForm.basisQuantity}
                  onChange={(e) => setSettlementForm({ ...settlementForm, basisQuantity: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSettlementModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Calculating...' : 'Generate Statement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
