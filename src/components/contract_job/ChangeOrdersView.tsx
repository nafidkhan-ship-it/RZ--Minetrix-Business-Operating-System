import React, { useState } from 'react';
import {
  ArrowRightLeft,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  DollarSign,
  Calendar,
  AlertTriangle,
  Clock,
  Check,
  XCircle,
  X
} from 'lucide-react';
import {
  ChangeOrder,
  ChangeOrderReason,
  SAMPLE_CHANGE_ORDERS,
  SAMPLE_JOBS
} from '../../data/contractJobStudioData';

export const ChangeOrdersView: React.FC = () => {
  const [changeOrders, setChangeOrders] = useState<ChangeOrder[]>(SAMPLE_CHANGE_ORDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Variation form
  const [newCO, setNewCO] = useState<Partial<ChangeOrder>>({
    jobId: SAMPLE_JOBS[0]?.id || 'JOB-4001',
    date: '2026-09-24',
    reason: 'Site Condition',
    description: '',
    valueChange: 250000,
    scheduleImpactDays: 10,
    customerApproval: 'Pending',
    status: 'Submitted'
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCO.description) return;

    const created: ChangeOrder = {
      changeOrderNumber: `CO-2026-0${changeOrders.length + 80}`,
      jobId: newCO.jobId || 'JOB-4001',
      date: newCO.date || '2026-09-24',
      reason: (newCO.reason as ChangeOrderReason) || 'Scope Addition',
      description: newCO.description,
      valueChange: Number(newCO.valueChange) || 100000,
      scheduleImpactDays: Number(newCO.scheduleImpactDays) || 7,
      customerApproval: 'Pending',
      status: 'Submitted'
    };

    setChangeOrders([created, ...changeOrders]);
    setIsAddModalOpen(false);
    showToast(`Logged Change Order ${created.changeOrderNumber}`);
  };

  const handleApprove = (coNum: string) => {
    setChangeOrders(
      changeOrders.map((c) =>
        c.changeOrderNumber === coNum
          ? { ...c, customerApproval: 'Approved', status: 'Approved' }
          : c
      )
    );
    showToast(`Change Order ${coNum} Approved! Contract Value & Schedule Adjusted.`);
  };

  const filtered = changeOrders.filter((c) =>
    c.changeOrderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.jobId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 border border-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header and Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              Contract Variations
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
              {filtered.length} Variations Logged
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-0.5">Change Orders & Variations</h2>
          <p className="text-xs text-slate-400">
            Scope additions, extra blasting depth, rock hardness variations, and schedule extension impact.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Raise Change Order</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search change orders, reason, job ID, details..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Change Orders Cards */}
      <div className="space-y-4">
        {filtered.map((co) => (
          <div
            key={co.changeOrderNumber}
            className="p-5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl transition space-y-4"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-black text-amber-400">
                    {co.changeOrderNumber}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    Job: {co.jobId}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
                    {co.reason}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      co.customerApproval === 'Approved'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    Client {co.customerApproval}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">{co.description}</h3>
                <div className="text-xs text-slate-400 mt-0.5">Recorded: {co.date}</div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs text-slate-500">Commercial Value Adjustment</div>
                <div
                  className={`text-2xl font-black font-mono mt-0.5 ${
                    co.valueChange >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {co.valueChange >= 0 ? '+' : ''}₹{co.valueChange.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-amber-400 font-mono font-semibold">
                  Schedule Impact: +{co.scheduleImpactDays} Days
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">
                Auto-sync status:{' '}
                <strong className="text-slate-200">
                  {co.customerApproval === 'Approved'
                    ? 'Contract Value & Budget Synced'
                    : 'Awaiting Client Sign-off'}
                </strong>
              </span>

              {co.customerApproval !== 'Approved' && (
                <button
                  onClick={() => handleApprove(co.changeOrderNumber)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve & Apply to Job</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* RAISE CHANGE ORDER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-amber-400" />
                <span>Raise Contract Variation / Change Order</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Target Job</label>
                  <select
                    value={newCO.jobId}
                    onChange={(e) => setNewCO({ ...newCO, jobId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  >
                    {SAMPLE_JOBS.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.id} - {j.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Reason for Variation</label>
                  <select
                    value={newCO.reason}
                    onChange={(e) => setNewCO({ ...newCO, reason: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Scope Addition">Scope Addition</option>
                    <option value="Scope Reduction">Scope Reduction</option>
                    <option value="Site Condition">Site Condition</option>
                    <option value="Material Price Variation">Material Price Variation</option>
                    <option value="Design Change">Design Change</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Value Change (+ / - ₹) *</label>
                  <input
                    type="number"
                    required
                    value={newCO.valueChange}
                    onChange={(e) => setNewCO({ ...newCO, valueChange: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Schedule Impact (Days)</label>
                  <input
                    type="number"
                    value={newCO.scheduleImpactDays}
                    onChange={(e) =>
                      setNewCO({ ...newCO, scheduleImpactDays: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Technical Variation Description *</label>
                <textarea
                  rows={2}
                  required
                  value={newCO.description}
                  onChange={(e) => setNewCO({ ...newCO, description: e.target.value })}
                  placeholder="Detail geological hardness change, extra cubic meters required..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                >
                  Submit Change Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
