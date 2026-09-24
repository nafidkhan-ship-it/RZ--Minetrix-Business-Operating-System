import React, { useState } from 'react';
import {
  Briefcase,
  ChevronLeft,
  Calendar,
  DollarSign,
  TrendingUp,
  Boxes,
  Truck,
  Users,
  HardHat,
  Network,
  PieChart,
  Receipt,
  CreditCard,
  Wallet,
  FolderOpen,
  BarChart4,
  CalendarCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileSignature,
  ClipboardList,
  FileCheck2,
  Layers,
  Flag,
  Plus,
  MessageSquare,
  ArrowRightLeft,
  X
} from 'lucide-react';
import {
  ContractJob,
  JobScopeItem,
  JobMilestone,
  SAMPLE_SCOPE_ITEMS,
  SAMPLE_MILESTONES,
  SAMPLE_JOB_PROGRESS,
  SAMPLE_WORKERS,
  SAMPLE_CONTRACTORS,
  SAMPLE_SUBCONTRACTORS,
  SAMPLE_MATERIAL_ALLOCATIONS,
  SAMPLE_VEHICLE_ALLOCATIONS,
  SAMPLE_EXPENSES,
  SAMPLE_INVOICES,
  SAMPLE_PAYMENTS,
  SAMPLE_DOCUMENTS,
  SAMPLE_OTT_TASKS,
  SAMPLE_WORK_ORDERS
} from '../../data/contractJobStudioData';

export type JobProfileTab =
  | 'overview'
  | 'scope'
  | 'requirements'
  | 'agreement'
  | 'work-order'
  | 'progress'
  | 'milestones'
  | 'workers'
  | 'contractors'
  | 'subcontractors'
  | 'materials'
  | 'vehicles'
  | 'expenses'
  | 'billing'
  | 'payments'
  | 'pnl'
  | 'documents'
  | 'tasks'
  | 'reports';

interface JobProfileViewProps {
  job: ContractJob;
  onBack: () => void;
  onOpenChat: (title: string) => void;
  onOpenOttModal: (taskTitle?: string) => void;
}

export const JobProfileView: React.FC<JobProfileViewProps> = ({
  job,
  onBack,
  onOpenChat,
  onOpenOttModal
}) => {
  const [activeProfileTab, setActiveProfileTab] = useState<JobProfileTab>('overview');
  const [scopeItems, setScopeItems] = useState<JobScopeItem[]>(SAMPLE_SCOPE_ITEMS);
  const [milestones, setMilestones] = useState<JobMilestone[]>(SAMPLE_MILESTONES);
  const [isAddScopeOpen, setIsAddScopeOpen] = useState(false);
  const [isAddMilestoneOpen, setIsAddMilestoneOpen] = useState(false);
  const [isAddProgressOpen, setIsAddProgressOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New scope form
  const [newScopeTitle, setNewScopeTitle] = useState('');
  const [newScopeQty, setNewScopeQty] = useState(1000);
  const [newScopeUnit, setNewScopeUnit] = useState('MT');
  const [newScopeRate, setNewScopeRate] = useState(250);

  // New milestone form
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestonePercent, setNewMilestonePercent] = useState(25);
  const [newMilestoneDue, setNewMilestoneDue] = useState('2026-11-15');

  // New progress log
  const [progressLogPercent, setProgressLogPercent] = useState(job.progressPercent + 5);
  const [progressLogWork, setProgressLogWork] = useState('Completed additional 1,200 MT gravel grading');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAddScope = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScopeTitle) return;
    const amount = newScopeQty * newScopeRate;
    const newItem: JobScopeItem = {
      id: `SCP-00${scopeItems.length + 1}`,
      jobId: job.id,
      title: newScopeTitle,
      description: 'Site verified scope specification',
      quantity: newScopeQty,
      completedQuantity: 0,
      unit: newScopeUnit,
      rate: newScopeRate,
      amount,
      responsiblePerson: job.manager,
      startDate: job.startDate,
      endDate: job.endDate,
      status: 'Pending'
    };
    setScopeItems([...scopeItems, newItem]);
    setIsAddScopeOpen(false);
    showToast(`Added scope item: ${newItem.title}`);
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle) return;
    const amount = Math.round((job.contractValue * newMilestonePercent) / 100);
    const newM: JobMilestone = {
      id: `MLS-00${milestones.length + 1}`,
      jobId: job.id,
      title: newMilestoneTitle,
      description: 'Scheduled milestone target',
      percentage: newMilestonePercent,
      targetDate: newMilestoneDue,
      amount,
      status: 'Pending',
      responsiblePerson: job.manager
    };
    setMilestones([...milestones, newM]);
    setIsAddMilestoneOpen(false);
    showToast(`Added milestone: ${newM.title}`);
  };

  const PROFILE_TABS: { id: JobProfileTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: Briefcase },
    { id: 'scope', label: 'Scope', icon: Layers },
    { id: 'requirements', label: 'Requirements', icon: FileCheck2 },
    { id: 'agreement', label: 'Agreement', icon: FileSignature },
    { id: 'work-order', label: 'Work Order', icon: ClipboardList },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'milestones', label: 'Milestones', icon: Flag },
    { id: 'workers', label: 'Workers', icon: Users },
    { id: 'contractors', label: 'Contractors', icon: HardHat },
    { id: 'subcontractors', label: 'Subcontractors', icon: Network },
    { id: 'materials', label: 'Materials', icon: Boxes },
    { id: 'vehicles', label: 'Vehicles', icon: Truck },
    { id: 'expenses', label: 'Expenses', icon: Wallet },
    { id: 'billing', label: 'Billing', icon: Receipt },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'pnl', label: 'P&L', icon: PieChart },
    { id: 'documents', label: 'Documents', icon: FolderOpen },
    { id: 'tasks', label: 'Tasks', icon: CalendarCheck },
    { id: 'reports', label: 'Reports', icon: BarChart4 }
  ];

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 border border-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TOP HEADER: Complete Job Profile Specs */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-1 transition cursor-pointer font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Job Directory</span>
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-black text-emerald-400">{job.id}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300 font-mono">
                {job.category}
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
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
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 font-bold border border-slate-700">
                {job.priority} Priority
              </span>
            </div>

            <h1 className="text-2xl font-black text-white">{job.name}</h1>
            <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3">
              <span>
                Customer: <strong className="text-slate-200">{job.customerName}</strong>
              </span>
              <span>&bull;</span>
              <span>Site: {job.location}</span>
              <span>&bull;</span>
              <span>Manager: {job.manager}</span>
              <span>&bull;</span>
              <span>Supervisor: {job.supervisor}</span>
              <span>&bull;</span>
              <span>
                Term: {job.startDate} &rarr; {job.endDate}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenChat(`${job.id} Coordination`)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Job Chat</span>
            </button>

            <button
              onClick={() => onOpenOttModal(`Milestone review for ${job.name}`)}
              className="px-3 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold text-xs border border-purple-500/30 transition flex items-center gap-1.5 cursor-pointer"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>+ OTT Task</span>
            </button>

            <button
              onClick={() => setIsAddProgressOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Progress Update</span>
            </button>
          </div>
        </div>

        {/* Header Financial & Progress Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-3 border-t border-slate-800 text-xs">
          <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800/80">
            <div className="text-slate-500 text-[10px] font-medium">Contract Value</div>
            <div className="text-base font-black text-white font-mono mt-0.5">
              ₹{(job.contractValue / 100000).toFixed(2)} L
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800/80">
            <div className="text-slate-500 text-[10px] font-medium">Allocated Budget</div>
            <div className="text-base font-black text-slate-300 font-mono mt-0.5">
              ₹{(job.budget / 100000).toFixed(2)} L
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800/80">
            <div className="text-slate-500 text-[10px] font-medium">Actual Cost Spent</div>
            <div className="text-base font-black text-rose-300 font-mono mt-0.5">
              ₹{(job.actualCost / 100000).toFixed(2)} L
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800/80">
            <div className="text-slate-500 text-[10px] font-medium">Billed To Date</div>
            <div className="text-base font-black text-cyan-300 font-mono mt-0.5">
              ₹{(job.billedAmount / 100000).toFixed(2)} L
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
            <div className="text-emerald-400 text-[10px] font-medium">Profit / Contribution</div>
            <div className="text-base font-black text-emerald-300 font-mono mt-0.5">
              ₹{(job.actualProfit / 100000).toFixed(2)} L
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800/80">
            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span>Progress</span>
              <span className="font-mono font-bold text-emerald-400">{job.progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full"
                style={{ width: `${job.progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 19 ACCESSIBLE JOB PROFILE TABS BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-inner overflow-x-auto scrollbar-thin">
        <div className="flex items-center gap-1.5 min-w-max">
          {PROFILE_TABS.map((tab) => {
            const isActive = activeProfileTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveProfileTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-md'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT PANELS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl min-h-[400px]">
        {/* 1. OVERVIEW TAB */}
        {activeProfileTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                  Resource Mobilization
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-slate-500">Workers:</span>{' '}
                    <span className="text-white font-mono font-bold">{job.workersCount} Assigned</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Contractors:</span>{' '}
                    <span className="text-white font-mono font-bold">{job.contractorsCount} Active</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Vehicles:</span>{' '}
                    <span className="text-white font-mono font-bold">{job.vehiclesCount} Committed</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Materials:</span>{' '}
                    <span className="text-white font-mono font-bold">
                      {job.materialsTons.toLocaleString()} MT
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                  Commercial Milestone Schedule
                </span>
                <div className="text-xs space-y-1 pt-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Milestones:</span>
                    <span className="text-white font-mono font-bold">{milestones.length} Defined</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Completed:</span>
                    <span className="text-emerald-400 font-mono font-bold">
                      {milestones.filter((m) => m.status === 'Completed').length} Closed
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Remaining Billed:</span>
                    <span className="text-cyan-400 font-mono font-bold">
                      ₹{((job.contractValue - job.billedAmount) / 100000).toFixed(2)} L
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                  Field Contacts & Supervision
                </span>
                <div className="text-xs space-y-1.5 pt-1 text-slate-300">
                  <div>
                    <span className="text-slate-500">Project Manager:</span> {job.manager}
                  </div>
                  <div>
                    <span className="text-slate-500">Field Supervisor:</span> {job.supervisor}
                  </div>
                  <div>
                    <span className="text-slate-500">Primary Quarry Lot:</span> Moodbidri Pit 2
                  </div>
                </div>
              </div>
            </div>

            {/* Scope Items Snapshot */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Primary Scope Schedule
                </h3>
                <button
                  onClick={() => setActiveProfileTab('scope')}
                  className="text-xs text-emerald-400 hover:underline font-semibold"
                >
                  View Full Scope Detail &rarr;
                </button>
              </div>

              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 border-b border-slate-800 text-[10px] uppercase font-mono text-slate-400">
                    <tr>
                      <th className="py-2.5 px-3">Scope ID</th>
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3 text-right">Target Qty</th>
                      <th className="py-2.5 px-3 text-right">Completed</th>
                      <th className="py-2.5 px-3 text-right">Value (₹)</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-[11px] font-mono">
                    {scopeItems.map((item) => (
                      <tr key={item.id}>
                        <td className="py-2 px-3 text-emerald-400 font-bold">{item.id}</td>
                        <td className="py-2 px-3 font-sans text-white">{item.title}</td>
                        <td className="py-2 px-3 text-right text-slate-300">
                          {item.quantity.toLocaleString()} {item.unit}
                        </td>
                        <td className="py-2 px-3 text-right text-emerald-400">
                          {item.completedQuantity.toLocaleString()} {item.unit}
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-white">
                          ₹{item.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2 px-3 font-sans">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. SCOPE TAB */}
        {activeProfileTab === 'scope' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Contract Scope Breakdown Structure</h3>
                <p className="text-xs text-slate-400">
                  Track quantities, unit rates, completed execution, and scope variations.
                </p>
              </div>

              <button
                onClick={() => setIsAddScopeOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Scope Item</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500">Total Scope Value</span>
                <div className="text-base font-black text-white font-mono mt-0.5">
                  ₹{scopeItems.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString('en-IN')}
                </div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500">Completed Scope</span>
                <div className="text-base font-black text-emerald-400 font-mono mt-0.5">
                  ₹
                  {scopeItems
                    .reduce((acc, curr) => acc + curr.completedQuantity * curr.rate, 0)
                    .toLocaleString('en-IN')}
                </div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500">Remaining Scope</span>
                <div className="text-base font-black text-amber-400 font-mono mt-0.5">
                  ₹
                  {scopeItems
                    .reduce(
                      (acc, curr) => acc + (curr.quantity - curr.completedQuantity) * curr.rate,
                      0
                    )
                    .toLocaleString('en-IN')}
                </div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500">Items Defined</span>
                <div className="text-base font-black text-cyan-400 font-mono mt-0.5">
                  {scopeItems.length} Deliverables
                </div>
              </div>
            </div>

            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 border-b border-slate-800 text-[10px] uppercase font-mono text-slate-400">
                  <tr>
                    <th className="py-2.5 px-3">Item #</th>
                    <th className="py-2.5 px-3">Scope Title & Specs</th>
                    <th className="py-2.5 px-3 text-right">Target Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Rate (₹)</th>
                    <th className="py-2.5 px-3 text-right">Completed Qty</th>
                    <th className="py-2.5 px-3 text-right">Scope Total (₹)</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-[11px] font-mono">
                  {scopeItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-900/40">
                      <td className="py-2.5 px-3 text-emerald-400 font-bold">{item.id}</td>
                      <td className="py-2.5 px-3 font-sans">
                        <div className="text-white font-medium">{item.title}</div>
                        <div className="text-[10px] text-slate-500">{item.description}</div>
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-300">
                        {item.quantity.toLocaleString()} {item.unit}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-300">₹{item.rate}</td>
                      <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">
                        {item.completedQuantity.toLocaleString()} {item.unit}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-white">
                        ₹{item.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 font-sans">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. REQUIREMENTS TAB */}
        {activeProfileTab === 'requirements' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Linked Inbound Requirements (RFQ)</h3>
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-emerald-400 font-bold">REQ-2026-001</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
                  Converted to Job
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">
                40mm Graded Granite Aggregate for Suratkal Bypass Bridge
              </h4>
              <p className="text-slate-300">
                15,000 MT Crushed Aggregate + 8,000 MT VSI Concrete Sand for Pier Foundations.
              </p>
              <div className="pt-2 border-t border-slate-800 text-slate-400 flex gap-4 text-[11px]">
                <span>Budget: ₹35,00,000</span>
                <span>Location: Suratkal NH-66</span>
                <span>Fleet: 6 Tippers</span>
              </div>
            </div>
          </div>
        )}

        {/* 4. AGREEMENT TAB */}
        {activeProfileTab === 'agreement' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Executed Contract Agreement</h3>
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-cyan-400 font-bold text-sm">AGR-2026-019</span>
                <span className="text-emerald-400 font-bold font-mono">
                  Fully Executed (E-Signed)
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-300">
                <div>
                  <span className="text-slate-500 block text-[10px]">Contract Value</span>
                  <span className="font-mono text-white font-bold">
                    ₹{job.contractValue.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Mobilization Advance</span>
                  <span className="font-mono text-white">15% Received</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Retention Guarantee</span>
                  <span className="font-mono text-white">5% Held</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Signed Date</span>
                  <span className="font-mono text-white">2026-09-12</span>
                </div>
              </div>
              <p className="text-slate-400 pt-2 border-t border-slate-800">
                Includes statutory compliance for mining royaltyship, weighbridge certifications, and environmental pit rehabilitation indemnity.
              </p>
            </div>
          </div>
        )}

        {/* 5. WORK ORDER TAB */}
        {activeProfileTab === 'work-order' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Operational Work Orders Dispatched</h3>
            <div className="space-y-3">
              {SAMPLE_WORK_ORDERS.filter((w) => w.jobId === job.id).map((wo) => (
                <div
                  key={wo.workOrderNumber}
                  className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-purple-400 font-bold">{wo.workOrderNumber}</span>
                    <span className="text-emerald-400 font-bold">{wo.status}</span>
                  </div>
                  <h4 className="text-white font-bold">{wo.contractorName}</h4>
                  <p className="text-slate-300">{wo.scope}</p>
                  <div className="pt-2 border-t border-slate-800 flex justify-between text-slate-400 text-[11px]">
                    <span>Budget: ₹{wo.budget.toLocaleString('en-IN')}</span>
                    <span>Supervisor: {wo.supervisorName}</span>
                    <span>Priority: {wo.priority}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. PROGRESS TAB */}
        {activeProfileTab === 'progress' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Physical & Material Progress Log</h3>
                <p className="text-xs text-slate-400">
                  Daily site diary, completed volumes, machine hours, and photo verifications.
                </p>
              </div>

              <button
                onClick={() => setIsAddProgressOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Log Daily Update</span>
              </button>
            </div>

            <div className="space-y-3">
              {SAMPLE_JOB_PROGRESS.map((log) => (
                <div
                  key={log.id}
                  className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-emerald-400 font-bold">{log.date}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        Logged by {log.loggedBy}
                      </span>
                    </div>
                    <span className="font-mono text-base font-black text-emerald-400">
                      {log.progressPercent}% Overall
                    </span>
                  </div>

                  <p className="text-white font-medium">{log.workCompleted}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2.5 bg-slate-900/60 rounded-xl text-[11px] text-slate-300">
                    <div>
                      <span className="text-slate-500">Materials:</span> {log.materialsUsed}
                    </div>
                    <div>
                      <span className="text-slate-500">Workers:</span> {log.workersPresent} Crew On-Site
                    </div>
                    <div>
                      <span className="text-slate-500">Fleet:</span> {log.vehiclesActive} Active Machines
                    </div>
                  </div>

                  {log.notes && (
                    <div className="text-[11px] text-slate-400 italic">Notes: {log.notes}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. MILESTONES TAB */}
        {activeProfileTab === 'milestones' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Commercial & Operational Milestones</h3>
                <p className="text-xs text-slate-400">
                  Target completion stages linked directly to progress billing releases.
                </p>
              </div>

              <button
                onClick={() => setIsAddMilestoneOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Milestone</span>
              </button>
            </div>

            <div className="space-y-3">
              {milestones.map((ms, idx) => (
                <div
                  key={ms.id}
                  className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-mono font-bold text-emerald-400 shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-emerald-400 font-bold">{ms.id}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {ms.percentage}% of Contract
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            ms.status === 'Completed'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : ms.status === 'In Progress'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {ms.status}
                        </span>
                      </div>
                      <h4 className="text-white font-bold text-sm mt-0.5">{ms.title}</h4>
                      <div className="text-slate-400 text-[11px] mt-0.5">
                        Target Date: <strong className="text-slate-200">{ms.targetDate}</strong> &bull; Lead: {ms.responsiblePerson}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[10px] text-slate-500">Milestone Value</div>
                    <div className="text-base font-black text-white font-mono">
                      ₹{ms.amount.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. WORKERS TAB */}
        {activeProfileTab === 'workers' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Workers & Labour Allocation</h3>
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 border-b border-slate-800 text-[10px] uppercase font-mono text-slate-400">
                  <tr>
                    <th className="py-2.5 px-3">Emp ID</th>
                    <th className="py-2.5 px-3">Worker Name</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Contractor / Vendor</th>
                    <th className="py-2.5 px-3 text-right">Daily Rate</th>
                    <th className="py-2.5 px-3 text-right">Attendance</th>
                    <th className="py-2.5 px-3 text-right">Batta</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-[11px]">
                  {SAMPLE_WORKERS.map((w) => (
                    <tr key={w.id}>
                      <td className="py-2 px-3 font-mono text-emerald-400">{w.id}</td>
                      <td className="py-2 px-3 text-white font-semibold">{w.name}</td>
                      <td className="py-2 px-3 text-slate-300">{w.role}</td>
                      <td className="py-2 px-3 text-slate-400">{w.contractorName}</td>
                      <td className="py-2 px-3 text-right font-mono text-slate-300">₹{w.dailyRate}</td>
                      <td className="py-2 px-3 text-right font-mono text-emerald-400">
                        {w.attendanceDays} Days
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-amber-400">₹{w.battaAmount}</td>
                      <td className="py-2 px-3">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
                          {w.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 9. CONTRACTORS TAB */}
        {activeProfileTab === 'contractors' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Assigned Primary Contractors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SAMPLE_CONTRACTORS.map((c) => (
                <div key={c.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-purple-400 font-bold">{c.id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
                      {c.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{c.name}</h4>
                  <div className="text-slate-400">{c.serviceType} &bull; Contact: {c.contactPerson}</div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between text-[11px]">
                    <span className="text-slate-400">Total Contracted:</span>
                    <span className="text-white font-mono font-bold">
                      ₹{(c.contractValue / 100000).toFixed(1)} L
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 10. SUBCONTRACTORS TAB */}
        {activeProfileTab === 'subcontractors' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Subcontractor Hierarchy</h3>
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                <span>Main Job: {job.id}</span> &rarr;{' '}
                <span>Contractor: Coastal Blasting</span> &rarr;{' '}
                <span className="text-cyan-400 font-bold">Subcontractor: Canara Drilling Crew</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <div className="font-bold text-white">Canara Precision Drilling Works</div>
                <div className="text-slate-400">Deep blast hole drilling at Pit #2 Benches 3 & 4</div>
                <div className="flex justify-between pt-1 text-[11px] font-mono">
                  <span className="text-slate-400">Sub-agreement Value: ₹6,50,000</span>
                  <span className="text-emerald-400">Status: Active</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 11. MATERIALS TAB */}
        {activeProfileTab === 'materials' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Material Logistics & Stock Consumption</h3>
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 border-b border-slate-800 text-[10px] uppercase font-mono text-slate-400">
                  <tr>
                    <th className="py-2.5 px-3">Material Grade</th>
                    <th className="py-2.5 px-3">Source Origin</th>
                    <th className="py-2.5 px-3 text-right">Required (MT)</th>
                    <th className="py-2.5 px-3 text-right">Received (MT)</th>
                    <th className="py-2.5 px-3 text-right">Used (MT)</th>
                    <th className="py-2.5 px-3 text-right">Total Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-[11px] font-mono">
                  {SAMPLE_MATERIAL_ALLOCATIONS.map((m) => (
                    <tr key={m.id}>
                      <td className="py-2 px-3 font-sans text-white font-medium">{m.materialName}</td>
                      <td className="py-2 px-3 font-sans text-slate-400">{m.source}</td>
                      <td className="py-2 px-3 text-right text-slate-300">
                        {m.quantityRequired.toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-right text-cyan-400">
                        {m.quantityReceived.toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-right text-emerald-400 font-bold">
                        {m.quantityUsed.toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-right text-white font-bold">
                        ₹{m.amount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 12. VEHICLES TAB */}
        {activeProfileTab === 'vehicles' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Allocated Fleet & Heavy Equipment</h3>
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 border-b border-slate-800 text-[10px] uppercase font-mono text-slate-400">
                  <tr>
                    <th className="py-2.5 px-3">Vehicle #</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Driver</th>
                    <th className="py-2.5 px-3 text-right">Trips Logged</th>
                    <th className="py-2.5 px-3 text-right">Daily Rate</th>
                    <th className="py-2.5 px-3 text-right">Total Cost (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-[11px] font-mono">
                  {SAMPLE_VEHICLE_ALLOCATIONS.map((v) => (
                    <tr key={v.id}>
                      <td className="py-2 px-3 text-amber-400 font-bold">{v.vehicleNumber}</td>
                      <td className="py-2 px-3 font-sans text-slate-300">{v.vehicleType}</td>
                      <td className="py-2 px-3 font-sans text-slate-200">{v.driverName}</td>
                      <td className="py-2 px-3 text-right text-emerald-400 font-bold">{v.tripsCount}</td>
                      <td className="py-2 px-3 text-right text-slate-300">₹{v.dailyRate}</td>
                      <td className="py-2 px-3 text-right text-white font-bold">
                        ₹{v.totalCost.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 13. EXPENSES TAB */}
        {activeProfileTab === 'expenses' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Job Operational Expenses</h3>
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 border-b border-slate-800 text-[10px] uppercase font-mono text-slate-400">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                    <th className="py-2.5 px-3">Paid To</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-[11px]">
                  {SAMPLE_EXPENSES.map((e) => (
                    <tr key={e.id}>
                      <td className="py-2 px-3 font-mono text-slate-400">{e.date}</td>
                      <td className="py-2 px-3 text-emerald-400 font-semibold">{e.category}</td>
                      <td className="py-2 px-3 text-white">{e.description}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-rose-300">
                        ₹{e.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2 px-3 text-slate-400">{e.paidTo}</td>
                      <td className="py-2 px-3">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
                          {e.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 14. BILLING TAB */}
        {activeProfileTab === 'billing' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Running Account (RA) Bills & Invoices</h3>
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 border-b border-slate-800 text-[10px] uppercase font-mono text-slate-400">
                  <tr>
                    <th className="py-2.5 px-3">Invoice #</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3 text-right">Taxable</th>
                    <th className="py-2.5 px-3 text-right">GST</th>
                    <th className="py-2.5 px-3 text-right">Total (₹)</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-[11px] font-mono">
                  {SAMPLE_INVOICES.map((inv) => (
                    <tr key={inv.invoiceNumber}>
                      <td className="py-2 px-3 text-cyan-400 font-bold">{inv.invoiceNumber}</td>
                      <td className="py-2 px-3 text-slate-400">{inv.date}</td>
                      <td className="py-2 px-3 font-sans text-slate-300">{inv.billingType}</td>
                      <td className="py-2 px-3 text-right text-slate-300">
                        ₹{inv.currentAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-400">
                        ₹{inv.taxAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2 px-3 text-right text-emerald-400 font-bold">
                        ₹{inv.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2 px-3 font-sans">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 15. PAYMENTS TAB */}
        {activeProfileTab === 'payments' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Client Payment Receipts</h3>
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 border-b border-slate-800 text-[10px] uppercase font-mono text-slate-400">
                  <tr>
                    <th className="py-2.5 px-3">Receipt #</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Mode</th>
                    <th className="py-2.5 px-3">Reference</th>
                    <th className="py-2.5 px-3 text-right">Amount Received (₹)</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-[11px] font-mono">
                  {SAMPLE_PAYMENTS.map((p) => (
                    <tr key={p.id}>
                      <td className="py-2 px-3 text-emerald-400 font-bold">{p.id}</td>
                      <td className="py-2 px-3 text-slate-400">{p.date}</td>
                      <td className="py-2 px-3 font-sans text-slate-300">{p.paymentMode}</td>
                      <td className="py-2 px-3 text-slate-400">{p.referenceNumber}</td>
                      <td className="py-2 px-3 text-right text-emerald-300 font-black">
                        ₹{p.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2 px-3 font-sans">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 16. P&L TAB */}
        {activeProfileTab === 'pnl' && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-white">Job Contribution & P&L Statement</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-slate-400 font-mono text-[10px] uppercase font-bold">
                  Revenue Summary
                </span>
                <div className="text-xs space-y-1.5 pt-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Contract Value:</span>
                    <span className="text-white font-mono font-bold">
                      ₹{job.contractValue.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Billed:</span>
                    <span className="text-cyan-400 font-mono font-bold">
                      ₹{job.billedAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Received:</span>
                    <span className="text-emerald-400 font-mono font-bold">
                      ₹{job.receivedAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-slate-400 font-mono text-[10px] uppercase font-bold">
                  Actual Costs Breakdown
                </span>
                <div className="text-xs space-y-1.5 pt-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Actual Cost:</span>
                    <span className="text-rose-300 font-mono font-bold">
                      ₹{job.actualCost.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Allocated Budget:</span>
                    <span className="text-slate-300 font-mono font-bold">
                      ₹{job.budget.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cost Variance:</span>
                    <span className="text-emerald-400 font-mono font-bold">Under Budget</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
                <span className="text-emerald-400 font-mono text-[10px] uppercase font-bold">
                  Net Job Profit / Contribution
                </span>
                <div className="text-2xl font-black text-emerald-300 font-mono mt-2">
                  ₹{job.actualProfit.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-emerald-400 font-semibold">
                  Contribution Margin: 27.2% Net
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 17. DOCUMENTS TAB */}
        {activeProfileTab === 'documents' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Project Documents & Safety Records</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {SAMPLE_DOCUMENTS.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-purple-400 font-bold">{doc.category}</span>
                    <span className="text-slate-500 font-mono">{doc.fileSize}</span>
                  </div>
                  <h4 className="text-white font-bold leading-snug">{doc.title}</h4>
                  <div className="text-slate-400 text-[11px]">{doc.fileName}</div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                    <span>{doc.uploadDate}</span>
                    <span className="text-emerald-400 font-semibold cursor-pointer hover:underline">
                      Download
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 18. TASKS TAB */}
        {activeProfileTab === 'tasks' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">RZ® OTT Tasks for This Job</h3>
                <p className="text-xs text-slate-400">
                  Tasks automatically synced to Organise Today & Tomorrow.
                </p>
              </div>

              <button
                onClick={() => onOpenOttModal(`Task for ${job.name}`)}
                className="px-3.5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Create OTT Task</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {SAMPLE_OTT_TASKS.filter((t) => t.jobId === job.id).map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-emerald-400 font-bold">{task.id}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                        {task.priority}
                      </span>
                    </div>
                    <div className="font-bold text-white mt-1">{task.title}</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      Assignee: {task.assignedTo} &bull; Due: {task.dueDate}
                    </div>
                  </div>

                  <span className="text-[10px] px-2 py-1 rounded-full bg-slate-800 text-slate-300 font-mono font-bold">
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 19. REPORTS TAB */}
        {activeProfileTab === 'reports' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Job Performance Analytics & Exports</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-white">Operational Summary Report</h4>
                <p className="text-slate-400 text-[11px]">
                  Daily logs, workers deployed, machinery hours, and quarry yield.
                </p>
                <button
                  onClick={() => showToast('Generated Operational Summary Report')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] cursor-pointer"
                >
                  Download PDF
                </button>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-white">Commercial Financial Statement</h4>
                <p className="text-slate-400 text-[11px]">
                  Billed, payments, retention, overdue balances, and tax vouchers.
                </p>
                <button
                  onClick={() => showToast('Generated Commercial Financial Statement')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] cursor-pointer"
                >
                  Download PDF
                </button>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-white">Cost vs Budget Audit</h4>
                <p className="text-slate-400 text-[11px]">
                  Detailed variance audit comparing planned rates with field costs.
                </p>
                <button
                  onClick={() => showToast('Generated Cost vs Budget Audit')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] cursor-pointer"
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ADD SCOPE MODAL */}
      {isAddScopeOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white">Add Scope Deliverable</h3>
              <button
                onClick={() => setIsAddScopeOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddScope} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Scope Item Title *</label>
                <input
                  type="text"
                  required
                  value={newScopeTitle}
                  onChange={(e) => setNewScopeTitle(e.target.value)}
                  placeholder="e.g. 60mm Hand Broken Rubble Supply"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Quantity</label>
                  <input
                    type="number"
                    value={newScopeQty}
                    onChange={(e) => setNewScopeQty(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Unit</label>
                  <input
                    type="text"
                    value={newScopeUnit}
                    onChange={(e) => setNewScopeUnit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-center font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Unit Rate (₹)</label>
                  <input
                    type="number"
                    value={newScopeRate}
                    onChange={(e) => setNewScopeRate(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between font-mono">
                <span className="text-slate-400">Total Scope Amount:</span>
                <span className="text-emerald-400 font-bold">
                  ₹{(newScopeQty * newScopeRate).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddScopeOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  Save Scope Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD MILESTONE MODAL */}
      {isAddMilestoneOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white">Schedule Project Milestone</h3>
              <button
                onClick={() => setIsAddMilestoneOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMilestone} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Milestone Title *</label>
                <input
                  type="text"
                  required
                  value={newMilestoneTitle}
                  onChange={(e) => setNewMilestoneTitle(e.target.value)}
                  placeholder="e.g. 50% Sub-base Layer Completion"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">% of Contract</label>
                  <input
                    type="number"
                    value={newMilestonePercent}
                    onChange={(e) => setNewMilestonePercent(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Target Completion Date</label>
                  <input
                    type="date"
                    value={newMilestoneDue}
                    onChange={(e) => setNewMilestoneDue(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddMilestoneOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOG PROGRESS MODAL */}
      {isAddProgressOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white">Log Daily Progress Update</h3>
              <button
                onClick={() => setIsAddProgressOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                showToast(`Logged progress update: ${progressLogPercent}%`);
                setIsAddProgressOpen(false);
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block text-slate-400 font-medium mb-1">Cumulative Progress (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={progressLogPercent}
                  onChange={(e) => setProgressLogPercent(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Work Completed Today *</label>
                <textarea
                  rows={2}
                  required
                  value={progressLogWork}
                  onChange={(e) => setProgressLogWork(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddProgressOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  Save Progress Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
