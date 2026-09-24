import React, { useState } from 'react';
import {
  Boxes,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
  Building2,
  Pickaxe,
  Truck,
  DollarSign,
  X
} from 'lucide-react';
import {
  JobMaterialAllocation,
  SAMPLE_MATERIAL_ALLOCATIONS,
  SAMPLE_JOBS
} from '../../data/contractJobStudioData';

export const MaterialsView: React.FC = () => {
  const [materials, setMaterials] = useState<JobMaterialAllocation[]>(SAMPLE_MATERIAL_ALLOCATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New allocation form
  const [newMat, setNewMat] = useState<Partial<JobMaterialAllocation>>({
    jobId: SAMPLE_JOBS[0]?.id || 'JOB-4001',
    materialName: '40mm Granular Sub-base Stone',
    source: 'Platform 1 - Quarry Management',
    quantityRequired: 5000,
    quantityReceived: 3500,
    quantityUsed: 2800,
    unit: 'MT',
    rate: 150
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const req = Number(newMat.quantityRequired) || 1000;
    const rec = Number(newMat.quantityReceived) || 0;
    const used = Number(newMat.quantityUsed) || 0;
    const rate = Number(newMat.rate) || 150;

    const created: JobMaterialAllocation = {
      id: `MAT-AL-${100 + materials.length + 1}`,
      jobId: newMat.jobId || 'JOB-4001',
      materialName: newMat.materialName || 'Aggregate',
      source: (newMat.source as any) || 'Platform 1 - Quarry Management',
      quantityRequired: req,
      quantityReceived: rec,
      quantityUsed: used,
      quantityRemaining: Math.max(0, rec - used),
      unit: newMat.unit || 'MT',
      rate,
      amount: used * rate,
      status: 'Active'
    };

    setMaterials([created, ...materials]);
    setIsAddModalOpen(false);
    showToast(`Material ${created.materialName} allocated to Job ${created.jobId}`);
  };

  const filtered = materials.filter((m) =>
    m.materialName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.jobId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.source.toLowerCase().includes(searchQuery.toLowerCase())
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
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Cross-Platform Supply Chain
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              {filtered.length} Material Feeds
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-0.5">Material Allocation & Job Costing</h2>
          <p className="text-xs text-slate-400">
            Real-time feed: <strong className="text-white">Quarry / Crusher &rarr; Material Allocation &rarr; Job Site &rarr; Consumption &rarr; Job Cost</strong>
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Allocate Material</span>
        </button>
      </div>

      {/* Flow Diagram Strip */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Pickaxe className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Platform 1: Quarry Pit Excavation</span>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden sm:block" />
        <div className="flex items-center gap-2 text-slate-400">
          <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Platform 2: Crusher Screening & Stock</span>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden sm:block" />
        <div className="flex items-center gap-2 text-slate-400">
          <Boxes className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-white font-bold">Platform 4: Job Site Requisition</span>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden sm:block" />
        <div className="flex items-center gap-2 text-emerald-400 font-bold">
          <DollarSign className="w-4 h-4 shrink-0" />
          <span>Direct Job Cost Ledger Post</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search materials, job ID, source..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Material Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-[10px] uppercase font-mono text-slate-400">
              <tr>
                <th className="py-3 px-4">Job ID</th>
                <th className="py-3 px-4">Material Grade</th>
                <th className="py-3 px-4">Source Origin</th>
                <th className="py-3 px-4 text-right">Required</th>
                <th className="py-3 px-4 text-right">Received</th>
                <th className="py-3 px-4 text-right">Consumed</th>
                <th className="py-3 px-4 text-right">Balance Site Stock</th>
                <th className="py-3 px-4 text-right">Unit Rate</th>
                <th className="py-3 px-4 text-right">Total Charged (₹)</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300 font-mono text-xs">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-slate-850 transition">
                  <td className="py-3 px-4 font-bold text-purple-400">{m.jobId}</td>
                  <td className="py-3 px-4 font-sans font-semibold text-white">{m.materialName}</td>
                  <td className="py-3 px-4 font-sans text-slate-400">{m.source}</td>
                  <td className="py-3 px-4 text-right text-slate-300">
                    {m.quantityRequired.toLocaleString()} {m.unit}
                  </td>
                  <td className="py-3 px-4 text-right text-cyan-400">
                    {m.quantityReceived.toLocaleString()} {m.unit}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-400">
                    {m.quantityUsed.toLocaleString()} {m.unit}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-amber-400">
                    {m.quantityRemaining.toLocaleString()} {m.unit}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-300">₹{m.rate}</td>
                  <td className="py-3 px-4 text-right font-bold text-white">
                    ₹{m.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right font-sans">
                    <button
                      onClick={() => showToast(`Logged consumption of 200 MT for ${m.materialName}`)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold text-[11px] border border-emerald-500/20 cursor-pointer"
                    >
                      + Consume
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ALLOCATE MATERIAL MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Boxes className="w-4 h-4 text-emerald-400" />
                <span>Allocate Material from Supply Chain</span>
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
                    value={newMat.jobId}
                    onChange={(e) => setNewMat({ ...newMat, jobId: e.target.value })}
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
                  <label className="block text-slate-400 font-medium mb-1">Source Platform / Vendor</label>
                  <select
                    value={newMat.source}
                    onChange={(e) => setNewMat({ ...newMat, source: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Platform 1 - Quarry Management">Platform 1 - Quarry Management</option>
                    <option value="Platform 2 - Crusher Management">Platform 2 - Crusher Management</option>
                    <option value="External Supplier">External Supplier</option>
                    <option value="Building Materials Store">Building Materials Store</option>
                    <option value="Existing Central Inventory">Existing Central Inventory</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Material Name *</label>
                  <input
                    type="text"
                    required
                    value={newMat.materialName}
                    onChange={(e) => setNewMat({ ...newMat, materialName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Unit Rate (₹ / MT)</label>
                  <input
                    type="number"
                    value={newMat.rate}
                    onChange={(e) => setNewMat({ ...newMat, rate: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Required Quantity (MT)</label>
                  <input
                    type="number"
                    value={newMat.quantityRequired}
                    onChange={(e) => setNewMat({ ...newMat, quantityRequired: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Received Quantity (MT)</label>
                  <input
                    type="number"
                    value={newMat.quantityReceived}
                    onChange={(e) => setNewMat({ ...newMat, quantityReceived: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
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
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
