import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  Plus,
  Filter,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  PieChart
} from 'lucide-react';
import {
  ContractJob,
  JobStatus,
  JobCategory,
  SAMPLE_JOBS,
  SAMPLE_CUSTOMERS
} from '../../data/contractJobStudioData';

interface JobsListViewProps {
  onSelectJob: (job: ContractJob) => void;
  onOpenQuickActions: () => void;
}

export const JobsListView: React.FC<JobsListViewProps> = ({
  onSelectJob,
  onOpenQuickActions
}) => {
  const [jobs, setJobs] = useState<ContractJob[]>(SAMPLE_JOBS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Job state
  const [newJobData, setNewJobData] = useState<Partial<ContractJob>>({
    name: '',
    customerId: SAMPLE_CUSTOMERS[0]?.id || '',
    customerName: SAMPLE_CUSTOMERS[0]?.name || '',
    category: 'Quarry Operations',
    contractValue: 5000000,
    budget: 3800000,
    startDate: '2026-10-01',
    endDate: '2026-12-31',
    location: 'Quarry Pit No. 2, Moodbidri',
    manager: 'Er. Rajesh Varma',
    supervisor: 'Ganesh Naik',
    priority: 'High',
    status: 'Planned'
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobData.name) {
      showToast('Please enter Job Name');
      return;
    }

    const created: ContractJob = {
      id: `JOB-${4000 + jobs.length + 1}`,
      name: newJobData.name,
      customerId: newJobData.customerId || 'CUST-1001',
      customerName: newJobData.customerName || 'Direct Customer',
      category: (newJobData.category as JobCategory) || 'Quarry Operations',
      contractValue: Number(newJobData.contractValue) || 1000000,
      budget: Number(newJobData.budget) || 800000,
      actualCost: 0,
      billedAmount: 0,
      receivedAmount: 0,
      outstandingAmount: 0,
      estimatedProfit: (Number(newJobData.contractValue) || 1000000) - (Number(newJobData.budget) || 800000),
      actualProfit: 0,
      progressPercent: 0,
      startDate: newJobData.startDate || '2026-10-01',
      endDate: newJobData.endDate || '2026-12-31',
      status: 'Planned',
      priority: (newJobData.priority as any) || 'Medium',
      location: newJobData.location || 'Site Location',
      manager: newJobData.manager || 'Site Manager',
      supervisor: newJobData.supervisor || 'Site Supervisor',
      workersCount: 0,
      contractorsCount: 0,
      vehiclesCount: 0,
      materialsTons: 0,
      scopeItemsCount: 1,
      milestonesCount: 3,
      documentsCount: 1,
      openTasksCount: 1
    };

    setJobs([created, ...jobs]);
    setIsAddModalOpen(false);
    showToast(`Created Job ${created.name} (${created.id})`);
  };

  const filteredJobs = jobs.filter((j) => {
    const matchesSearch =
      j.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.manager.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || j.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || j.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
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
              Project Master Directory
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              {filteredJobs.length} Jobs Active
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-0.5">Contract Job Directory</h2>
          <p className="text-xs text-slate-400">
            Track full operational lifecycles, progress execution bars, planned vs actual spend, and P&L contributions.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Job</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search jobs by name, ID, customer, manager, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Planned">Planned</option>
            <option value="In Progress">In Progress</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
            <option value="Delayed">Delayed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Categories</option>
            <option value="Quarry Operations">Quarry Operations</option>
            <option value="Crusher Supply">Crusher Supply</option>
            <option value="Earthwork & Excavation">Earthwork & Excavation</option>
            <option value="Road Construction">Road Construction</option>
            <option value="Building Materials">Building Materials</option>
            <option value="Fleet Hire">Fleet Hire</option>
          </select>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            onClick={() => onSelectJob(job)}
            className="p-5 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-3xl transition cursor-pointer group space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-400">{job.id}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    {job.category}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      job.status === 'In Progress'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : job.status === 'Completed'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : job.status === 'Delayed'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition mt-1.5 leading-snug">
                  {job.name}
                </h3>
                <div className="text-xs text-slate-400 mt-0.5">
                  Client: <strong className="text-slate-200">{job.customerName}</strong> &bull; {job.location}
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs text-slate-500">Contract Value</div>
                <div className="text-lg font-black text-white font-mono mt-0.5">
                  ₹{(job.contractValue / 100000).toFixed(2)} L
                </div>
                <div className="text-[10px] text-emerald-400 font-mono font-semibold">
                  Budget: ₹{(job.budget / 100000).toFixed(1)} L
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400 font-medium">Execution Progress</span>
                <span className="text-emerald-400 font-mono font-bold">{job.progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    job.status === 'Delayed' ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${job.progressPercent}%` }}
                />
              </div>
            </div>

            {/* Financial & Operational breakdown */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950/70 rounded-2xl border border-slate-800/80 text-xs">
              <div>
                <div className="text-slate-500 text-[10px]">Actual Cost</div>
                <div className="text-slate-200 font-mono font-bold">
                  ₹{(job.actualCost / 100000).toFixed(2)} L
                </div>
              </div>
              <div>
                <div className="text-slate-500 text-[10px]">Billed</div>
                <div className="text-cyan-400 font-mono font-bold">
                  ₹{(job.billedAmount / 100000).toFixed(2)} L
                </div>
              </div>
              <div>
                <div className="text-slate-500 text-[10px]">Est. Profit</div>
                <div className="text-emerald-400 font-mono font-bold">
                  ₹{(job.estimatedProfit / 100000).toFixed(2)} L
                </div>
              </div>
            </div>

            {/* Footer details */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs">
              <div className="text-slate-400 text-[11px]">
                Manager: <span className="text-slate-200">{job.manager}</span> &bull;{' '}
                <span className="font-mono text-slate-500">{job.startDate} to {job.endDate}</span>
              </div>

              <div className="text-emerald-400 font-bold group-hover:underline flex items-center gap-1">
                <span>Open Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE NEW JOB MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <span>Initialize New Contract Job</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Job / Project Name *</label>
                <input
                  type="text"
                  required
                  value={newJobData.name}
                  onChange={(e) => setNewJobData({ ...newJobData, name: e.target.value })}
                  placeholder="e.g. NH-66 Suratkal Bypass Road Metal Supply"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Customer / Client *</label>
                  <select
                    value={newJobData.customerId}
                    onChange={(e) => {
                      const found = SAMPLE_CUSTOMERS.find((c) => c.id === e.target.value);
                      setNewJobData({
                        ...newJobData,
                        customerId: e.target.value,
                        customerName: found ? found.name : ''
                      });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {SAMPLE_CUSTOMERS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Category</label>
                  <select
                    value={newJobData.category}
                    onChange={(e) =>
                      setNewJobData({ ...newJobData, category: e.target.value as JobCategory })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Quarry Operations">Quarry Operations</option>
                    <option value="Crusher Supply">Crusher Supply</option>
                    <option value="Earthwork & Excavation">Earthwork & Excavation</option>
                    <option value="Road Construction">Road Construction</option>
                    <option value="Building Materials">Building Materials</option>
                    <option value="Fleet Hire">Fleet Hire</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Contract Value (₹) *</label>
                  <input
                    type="number"
                    value={newJobData.contractValue}
                    onChange={(e) => setNewJobData({ ...newJobData, contractValue: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Allocated Budget (₹) *</label>
                  <input
                    type="number"
                    value={newJobData.budget}
                    onChange={(e) => setNewJobData({ ...newJobData, budget: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newJobData.startDate}
                    onChange={(e) => setNewJobData({ ...newJobData, startDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Target End Date</label>
                  <input
                    type="date"
                    value={newJobData.endDate}
                    onChange={(e) => setNewJobData({ ...newJobData, endDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Job Location / Site</label>
                  <input
                    type="text"
                    value={newJobData.location}
                    onChange={(e) => setNewJobData({ ...newJobData, location: e.target.value })}
                    placeholder="e.g. Moodbidri Quarry Pit 2"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Assigned Project Manager</label>
                  <input
                    type="text"
                    value={newJobData.manager}
                    onChange={(e) => setNewJobData({ ...newJobData, manager: e.target.value })}
                    placeholder="e.g. Er. Rajesh Varma"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  Create Job Master
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
