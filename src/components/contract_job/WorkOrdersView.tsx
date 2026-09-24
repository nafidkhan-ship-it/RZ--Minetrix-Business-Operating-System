import React, { useState } from 'react';
import {
  ClipboardList,
  Search,
  Plus,
  Filter,
  Eye,
  CheckCircle2,
  Calendar,
  DollarSign,
  Users,
  Boxes,
  Truck,
  HardHat,
  X,
  Printer,
  Download,
  AlertCircle
} from 'lucide-react';
import {
  WorkOrder,
  WorkOrderStatus,
  SAMPLE_WORK_ORDERS,
  SAMPLE_CONTRACTORS,
  SAMPLE_JOBS
} from '../../data/contractJobStudioData';

interface WorkOrdersViewProps {
  onOpenJob: (jobId: string) => void;
  onOpenContractor: (contractorName: string) => void;
}

export const WorkOrdersView: React.FC<WorkOrdersViewProps> = ({
  onOpenJob,
  onOpenContractor
}) => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(SAMPLE_WORK_ORDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedWO, setSelectedWO] = useState<WorkOrder | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Work order state
  const [newWO, setNewWO] = useState<Partial<WorkOrder>>({
    jobId: SAMPLE_JOBS[0]?.id || 'JOB-4001',
    customerName: SAMPLE_JOBS[0]?.customerName || 'Prestige Estates Ltd',
    contractorName: SAMPLE_CONTRACTORS[0]?.name || 'Coastal Blasting & Excavations',
    subcontractorName: '',
    scope: '',
    startDate: '2026-09-25',
    endDate: '2026-10-25',
    budget: 800000,
    materialsSummary: '10,000 MT Crushed Stone',
    workersCount: 12,
    vehiclesCount: 4,
    supervisorName: 'Praveen Shetty (Site Eng.)',
    priority: 'High',
    instructions: 'Maintain 50m safety radius during blasting window 12:00-14:00 daily.',
    status: 'Assigned'
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreateWorkOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWO.scope) {
      showToast('Please specify Scope of Work');
      return;
    }

    const created: WorkOrder = {
      workOrderNumber: `WO-2026-0${88 + workOrders.length + 1}`,
      jobId: newWO.jobId || 'JOB-4001',
      customerName: newWO.customerName || 'Direct Customer',
      contractorName: newWO.contractorName || 'Assigned Contractor',
      subcontractorName: newWO.subcontractorName,
      scope: newWO.scope,
      startDate: newWO.startDate || '2026-09-25',
      endDate: newWO.endDate || '2026-10-25',
      budget: Number(newWO.budget) || 500000,
      materialsSummary: newWO.materialsSummary || 'Materials per site requisition',
      workersCount: Number(newWO.workersCount) || 8,
      vehiclesCount: Number(newWO.vehiclesCount) || 3,
      supervisorName: newWO.supervisorName || 'Site Engineer',
      priority: (newWO.priority as any) || 'Medium',
      instructions: newWO.instructions || 'Follow quarry environmental guidelines',
      documentsCount: 1,
      status: 'Assigned'
    };

    setWorkOrders([created, ...workOrders]);
    setIsAddModalOpen(false);
    showToast(`Work Order ${created.workOrderNumber} issued successfully`);
  };

  const filteredOrders = workOrders.filter((wo) => {
    const matchesSearch =
      wo.workOrderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.jobId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.contractorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.scope.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.supervisorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || wo.status === statusFilter;

    return matchesSearch && matchesStatus;
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
              Field Execution Authority
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              {filteredOrders.length} Work Orders Issued
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-0.5">Work Order Management</h2>
          <p className="text-xs text-slate-400">
            Dispatch operational directives to contractors and supervisors with budget caps, crew mandates, and safety protocols.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Work Order</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search work orders, contractor, scope, supervisor..."
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
            <option value="Draft">Draft</option>
            <option value="Assigned">Assigned</option>
            <option value="Accepted">Accepted</option>
            <option value="In Progress">In Progress</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Work Orders List Cards */}
      <div className="space-y-4">
        {filteredOrders.map((wo) => (
          <div
            key={wo.workOrderNumber}
            className="p-5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl transition space-y-4"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-black text-purple-400">
                    {wo.workOrderNumber}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    Job: {wo.jobId}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      wo.priority === 'Critical'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : wo.priority === 'High'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {wo.priority} Priority
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      wo.status === 'In Progress'
                        ? 'bg-blue-500/20 text-blue-400'
                        : wo.status === 'Completed'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {wo.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">
                  Contractor: {wo.contractorName}
                </h3>
                <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                  <span>Client: {wo.customerName}</span>
                  {wo.subcontractorName && (
                    <>
                      <span>&bull;</span>
                      <span className="text-cyan-400">Sub: {wo.subcontractorName}</span>
                    </>
                  )}
                  <span>&bull;</span>
                  <span>Supervisor: {wo.supervisorName}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-500">Allocated Budget</div>
                <div className="text-2xl font-black text-white font-mono mt-0.5">
                  ₹{wo.budget.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {wo.startDate} to {wo.endDate}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed p-3 bg-slate-950/70 rounded-2xl border border-slate-800/80">
              <strong className="text-purple-400 font-mono text-[10px] uppercase block mb-0.5">
                Authorized Scope:
              </strong>
              {wo.scope}
            </p>

            {/* Resource allocation tags */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 bg-slate-950/50 rounded-xl border border-slate-800/60 flex items-center gap-2.5">
                <Boxes className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-slate-500 text-[10px]">Materials Mandate</span>
                  <div className="text-slate-200 truncate">{wo.materialsSummary}</div>
                </div>
              </div>

              <div className="p-2.5 bg-slate-950/50 rounded-xl border border-slate-800/60 flex items-center gap-2.5">
                <Users className="w-4 h-4 text-blue-400 shrink-0" />
                <div>
                  <span className="text-slate-500 text-[10px]">Crew Deployment</span>
                  <div className="text-white font-mono font-bold">{wo.workersCount} Workers Assigned</div>
                </div>
              </div>

              <div className="p-2.5 bg-slate-950/50 rounded-xl border border-slate-800/60 flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-slate-500 text-[10px]">Heavy Machinery & Fleet</span>
                  <div className="text-white font-mono font-bold">{wo.vehiclesCount} Units Committed</div>
                </div>
              </div>
            </div>

            {wo.instructions && (
              <div className="text-xs text-slate-400 flex items-start gap-1.5 p-2 bg-slate-950/30 rounded-xl border border-slate-800/40">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-300">Field Instructions:</strong> {wo.instructions}
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSelectedWO(wo)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>View Details</span>
                </button>

                <button
                  onClick={() => showToast(`Printing Work Order ${wo.workOrderNumber}`)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>

                <button
                  onClick={() => onOpenContractor(wo.contractorName)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition flex items-center gap-1 cursor-pointer"
                >
                  <HardHat className="w-3.5 h-3.5 text-purple-400" />
                  <span>Contractor Profile</span>
                </button>
              </div>

              <button
                onClick={() => onOpenJob(wo.jobId)}
                className="px-4 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold transition cursor-pointer"
              >
                Go to Job {wo.jobId} &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* VIEW WORK ORDER MODAL */}
      {selectedWO && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="font-mono text-xs font-bold text-purple-400">
                  {selectedWO.workOrderNumber}
                </span>
                <h3 className="text-base font-black text-white">Work Order Operational Specification</h3>
                <div className="text-xs text-slate-400">Job: {selectedWO.jobId}</div>
              </div>

              <button
                onClick={() => setSelectedWO(null)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500">Contractor:</span>{' '}
                  <span className="text-white font-bold">{selectedWO.contractorName}</span>
                </div>
                <div>
                  <span className="text-slate-500">Customer:</span>{' '}
                  <span className="text-slate-200">{selectedWO.customerName}</span>
                </div>
                <div>
                  <span className="text-slate-500">Supervisor:</span>{' '}
                  <span className="text-slate-200">{selectedWO.supervisorName}</span>
                </div>
                <div>
                  <span className="text-slate-500">Status / Priority:</span>{' '}
                  <span className="text-emerald-400 font-bold">
                    {selectedWO.status} ({selectedWO.priority})
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-slate-400 block text-[10px] uppercase font-mono tracking-wider">
                  Scope Directive
                </span>
                <p className="text-slate-200 mt-1 leading-relaxed">{selectedWO.scope}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-slate-400 block text-[10px] uppercase font-mono tracking-wider">
                  Site Instructions & Safety Protocol
                </span>
                <p className="text-amber-300/90 mt-1 leading-relaxed">{selectedWO.instructions}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  const wo = selectedWO;
                  setSelectedWO(null);
                  onOpenJob(wo.jobId);
                }}
                className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs transition cursor-pointer"
              >
                View in Job Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW WORK ORDER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-emerald-400" />
                <span>Issue Operational Work Order</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateWorkOrder} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Target Job *</label>
                  <select
                    value={newWO.jobId}
                    onChange={(e) => {
                      const found = SAMPLE_JOBS.find((j) => j.id === e.target.value);
                      setNewWO({
                        ...newWO,
                        jobId: e.target.value,
                        customerName: found ? found.customerName : ''
                      });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {SAMPLE_JOBS.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.id} - {j.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Contractor / Vendor *</label>
                  <select
                    value={newWO.contractorName}
                    onChange={(e) => setNewWO({ ...newWO, contractorName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {SAMPLE_CONTRACTORS.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.serviceType})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Subcontractor (Optional)</label>
                  <input
                    type="text"
                    value={newWO.subcontractorName}
                    onChange={(e) => setNewWO({ ...newWO, subcontractorName: e.target.value })}
                    placeholder="e.g. Canara Explosives & Drills"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Budget Allocation (₹) *</label>
                  <input
                    type="number"
                    value={newWO.budget}
                    onChange={(e) => setNewWO({ ...newWO, budget: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newWO.startDate}
                    onChange={(e) => setNewWO({ ...newWO, startDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    value={newWO.endDate}
                    onChange={(e) => setNewWO({ ...newWO, endDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Supervisor In-Charge</label>
                  <input
                    type="text"
                    value={newWO.supervisorName}
                    onChange={(e) => setNewWO({ ...newWO, supervisorName: e.target.value })}
                    placeholder="e.g. Praveen Shetty"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Priority</label>
                  <select
                    value={newWO.priority}
                    onChange={(e) => setNewWO({ ...newWO, priority: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Scope of Work Directive *</label>
                <textarea
                  rows={2}
                  required
                  value={newWO.scope}
                  onChange={(e) => setNewWO({ ...newWO, scope: e.target.value })}
                  placeholder="Detail exact operational task, bench coordinates, quarry pit..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Safety & Operational Instructions</label>
                <textarea
                  rows={2}
                  value={newWO.instructions}
                  onChange={(e) => setNewWO({ ...newWO, instructions: e.target.value })}
                  placeholder="Blast timings, helmet mandates, vehicle speed limit..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
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
                  Issue Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
