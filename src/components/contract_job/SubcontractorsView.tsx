import React, { useState } from 'react';
import {
  Network,
  Search,
  Plus,
  Filter,
  Eye,
  Briefcase,
  HardHat,
  DollarSign,
  Calendar,
  CheckCircle2,
  X
} from 'lucide-react';
import {
  Subcontractor,
  SAMPLE_SUBCONTRACTORS,
  SAMPLE_CONTRACTORS,
  SAMPLE_JOBS
} from '../../data/contractJobStudioData';

export const SubcontractorsView: React.FC = () => {
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>(SAMPLE_SUBCONTRACTORS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [newSub, setNewSub] = useState<Partial<Subcontractor>>({
    name: '',
    jobId: SAMPLE_JOBS[0]?.id || 'JOB-4001',
    contractorId: SAMPLE_CONTRACTORS[0]?.id || 'CONT-301',
    contractorName: SAMPLE_CONTRACTORS[0]?.name || 'Coastal Blasting & Excavations',
    assignedScope: '',
    startDate: '2026-09-25',
    endDate: '2026-10-25',
    contractValue: 500000,
    supervisorName: 'Praveen Shetty',
    status: 'Active'
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSub.name || !newSub.assignedScope) return;

    const created: Subcontractor = {
      id: `SUB-${500 + subcontractors.length + 1}`,
      name: newSub.name,
      jobId: newSub.jobId || 'JOB-4001',
      contractorId: newSub.contractorId || 'CONT-301',
      contractorName: newSub.contractorName || 'Coastal Blasting',
      assignedScope: newSub.assignedScope,
      startDate: newSub.startDate || '2026-09-25',
      endDate: newSub.endDate || '2026-10-25',
      contractValue: Number(newSub.contractValue) || 500000,
      supervisorName: newSub.supervisorName || 'Site Supervisor',
      status: 'Active'
    };

    setSubcontractors([created, ...subcontractors]);
    setIsAddModalOpen(false);
    showToast(`Added Subcontractor ${created.name}`);
  };

  const filtered = subcontractors.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.assignedScope.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.contractorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.jobId.toLowerCase().includes(searchQuery.toLowerCase())
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
              Operational Hierarchy
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              {filtered.length} Sub-contracts
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-0.5">Subcontractor Management</h2>
          <p className="text-xs text-slate-400">
            Structure: <strong className="text-white">Main Job &rarr; Contractor &rarr; Subcontractor &rarr; Assigned Work</strong>
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Subcontractor</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search subcontractors, main contractors, scope, job ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Visual Hierarchy Cards */}
      <div className="space-y-4">
        {filtered.map((sub) => (
          <div
            key={sub.id}
            className="p-5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl transition space-y-3"
          >
            {/* Visual breadcrumb hierarchy */}
            <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800/80 flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="text-purple-400 font-bold">Job: {sub.jobId}</span>
              <span className="text-slate-600">&rarr;</span>
              <span className="text-slate-300">Contractor: {sub.contractorName}</span>
              <span className="text-slate-600">&rarr;</span>
              <span className="text-emerald-400 font-bold">Subcontractor: {sub.name}</span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-400">{sub.id}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                    {sub.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">{sub.name}</h3>
                <p className="text-xs text-slate-300 mt-1">{sub.assignedScope}</p>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs text-slate-500">Sub-agreement Value</div>
                <div className="text-lg font-black text-white font-mono mt-0.5">
                  ₹{sub.contractValue.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {sub.startDate} to {sub.endDate}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div>
                Site Lead: <span className="text-slate-200">{sub.supervisorName}</span>
              </div>
              <button
                onClick={() => showToast(`Inspection scheduled for ${sub.name}`)}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
              >
                Log Inspection
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD SUBCONTRACTOR MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Network className="w-4 h-4 text-emerald-400" />
                <span>Add Subcontractor to Hierarchy</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Subcontractor Name *</label>
                <input
                  type="text"
                  required
                  value={newSub.name}
                  onChange={(e) => setNewSub({ ...newSub, name: e.target.value })}
                  placeholder="e.g. Canara Drilling Works"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Parent Contractor</label>
                  <select
                    value={newSub.contractorName}
                    onChange={(e) => setNewSub({ ...newSub, contractorName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    {SAMPLE_CONTRACTORS.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Job Allocation</label>
                  <select
                    value={newSub.jobId}
                    onChange={(e) => setNewSub({ ...newSub, jobId: e.target.value })}
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
                  <label className="block text-slate-400 font-medium mb-1">Sub-contract Value (₹)</label>
                  <input
                    type="number"
                    value={newSub.contractValue}
                    onChange={(e) => setNewSub({ ...newSub, contractValue: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Supervisor</label>
                  <input
                    type="text"
                    value={newSub.supervisorName}
                    onChange={(e) => setNewSub({ ...newSub, supervisorName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Assigned Scope Directive *</label>
                <textarea
                  rows={2}
                  required
                  value={newSub.assignedScope}
                  onChange={(e) => setNewSub({ ...newSub, assignedScope: e.target.value })}
                  placeholder="Specific bench drilling, machinery operation..."
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
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  Save Subcontractor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
