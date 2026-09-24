import React from 'react';
import {
  Briefcase,
  TrendingUp,
  DollarSign,
  Users,
  HardHat,
  Truck,
  Boxes,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileSpreadsheet,
  FileSignature,
  ClipboardList,
  ArrowUpRight,
  ExternalLink,
  ShieldAlert,
  ArrowRightLeft,
  MessageSquare,
  CalendarCheck,
  Building2,
  Pickaxe,
  Zap,
  Plus
} from 'lucide-react';
import {
  SAMPLE_JOBS,
  SAMPLE_OTT_TASKS,
  ContractJob
} from '../../data/contractJobStudioData';

interface JobDashboardViewProps {
  onSelectJob: (job: ContractJob) => void;
  onNavigateTab: (tab: any) => void;
  onOpenQuickActions: () => void;
  onOpenWorkflow: () => void;
  onOpenCrossPlatform: () => void;
  onOpenOttModal: (taskTitle?: string) => void;
  onOpenChatModal: (recipientName?: string) => void;
}

export const JobDashboardView: React.FC<JobDashboardViewProps> = ({
  onSelectJob,
  onNavigateTab,
  onOpenQuickActions,
  onOpenWorkflow,
  onOpenCrossPlatform,
  onOpenOttModal,
  onOpenChatModal
}) => {
  return (
    <div className="space-y-6">
      {/* Demo Data Safety Notice */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs text-amber-300">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Studio Preview / Demo Data Mode:</strong> All sample contract values, progress figures, invoices, and job metrics are representative simulations for RZ® MINETRIX evaluation.
          </span>
        </div>
        <span className="font-mono text-[10px] bg-amber-500/20 text-amber-200 px-2 py-0.5 rounded font-bold uppercase tracking-wider shrink-0">
          Demo Safety Verified
        </span>
      </div>

      {/* TOP KPI CARDS (8 Items Required) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <span>Top Contract & Job Metrics</span>
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">Real-time Project Tally</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl hover:border-slate-700 transition">
            <div className="text-[11px] text-slate-400 font-medium">Total Jobs</div>
            <div className="text-xl font-black text-white font-mono mt-1">24</div>
            <div className="text-[10px] text-slate-500 mt-0.5">All Sites & Lots</div>
          </div>

          <div className="p-3.5 bg-slate-900 border border-emerald-500/30 rounded-2xl bg-emerald-500/5">
            <div className="text-[11px] text-emerald-400 font-semibold">Active Jobs</div>
            <div className="text-xl font-black text-emerald-300 font-mono mt-1">14</div>
            <div className="text-[10px] text-emerald-500 mt-0.5">8 Quarry &bull; 6 Crusher</div>
          </div>

          <div
            onClick={() => onNavigateTab('quotations')}
            className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl hover:border-amber-500/50 cursor-pointer transition"
          >
            <div className="text-[11px] text-amber-400 font-semibold">Pending Quotes</div>
            <div className="text-xl font-black text-amber-300 font-mono mt-1">5</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Awaiting Acceptance</div>
          </div>

          <div
            onClick={() => onNavigateTab('agreements')}
            className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl hover:border-cyan-500/50 cursor-pointer transition"
          >
            <div className="text-[11px] text-cyan-400 font-semibold">Pending Agrmnts</div>
            <div className="text-xl font-black text-cyan-300 font-mono mt-1">3</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Legal & Sign Off</div>
          </div>

          <div
            onClick={() => onNavigateTab('work-orders')}
            className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl hover:border-purple-500/50 cursor-pointer transition"
          >
            <div className="text-[11px] text-purple-400 font-semibold">Work Orders</div>
            <div className="text-xl font-black text-purple-300 font-mono mt-1">18</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Assigned & Active</div>
          </div>

          <div className="p-3.5 bg-slate-900 border border-blue-500/30 rounded-2xl bg-blue-500/5">
            <div className="text-[11px] text-blue-400 font-semibold">In Progress</div>
            <div className="text-xl font-black text-blue-300 font-mono mt-1">11</div>
            <div className="text-[10px] text-blue-500 mt-0.5">Live Operations</div>
          </div>

          <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-[11px] text-emerald-400 font-semibold">Completed Jobs</div>
            <div className="text-xl font-black text-emerald-400 font-mono mt-1">8</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Reconciled & Closed</div>
          </div>

          <div className="p-3.5 bg-slate-900 border border-rose-500/30 rounded-2xl bg-rose-500/5">
            <div className="text-[11px] text-rose-400 font-semibold">Delayed Jobs</div>
            <div className="text-xl font-black text-rose-300 font-mono mt-1">2</div>
            <div className="text-[10px] text-rose-500 mt-0.5">Requires Attention</div>
          </div>
        </div>
      </div>

      {/* FINANCIAL KPIS (7 Items Required) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Commercial & Financial Health</span>
          </h2>
          <span className="text-[11px] text-emerald-400 font-semibold">Currency: INR (₹)</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl">
            <div className="text-xs text-slate-400">Contract Value</div>
            <div className="text-xl font-black text-white font-mono mt-1">₹4.85 Cr</div>
            <div className="text-[10px] text-slate-500 mt-1">Total Signed Pipeline</div>
          </div>

          <div
            onClick={() => onNavigateTab('billing')}
            className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl hover:border-slate-700 cursor-pointer transition"
          >
            <div className="text-xs text-slate-400">Total Billed</div>
            <div className="text-xl font-black text-cyan-300 font-mono mt-1">₹2.60 Cr</div>
            <div className="text-[10px] text-cyan-500 mt-1">53.6% Contract Invoiced</div>
          </div>

          <div
            onClick={() => onNavigateTab('payments')}
            className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl hover:border-emerald-500/40 cursor-pointer transition"
          >
            <div className="text-xs text-slate-400">Total Received</div>
            <div className="text-xl font-black text-emerald-400 font-mono mt-1">₹2.15 Cr</div>
            <div className="text-[10px] text-emerald-500 mt-1">82.7% Collection Rate</div>
          </div>

          <div className="p-4 bg-slate-900/90 border border-amber-500/30 bg-amber-500/5 rounded-2xl">
            <div className="text-xs text-amber-400 font-semibold">Outstanding</div>
            <div className="text-xl font-black text-amber-300 font-mono mt-1">₹45.0 L</div>
            <div className="text-[10px] text-amber-500 mt-1">₹14.2 L Overdue &gt; 15d</div>
          </div>

          <div
            onClick={() => onNavigateTab('expenses')}
            className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl hover:border-rose-500/40 cursor-pointer transition"
          >
            <div className="text-xs text-slate-400">Job Expenses</div>
            <div className="text-xl font-black text-rose-300 font-mono mt-1">₹1.68 Cr</div>
            <div className="text-[10px] text-rose-500 mt-1">Labour, Fuel & Fleet</div>
          </div>

          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl">
            <div className="text-xs text-slate-400">Estimated Profit</div>
            <div className="text-xl font-black text-emerald-400 font-mono mt-1">₹1.25 Cr</div>
            <div className="text-[10px] text-slate-500 mt-1">Planned 25.8% Margin</div>
          </div>

          <div
            onClick={() => onNavigateTab('pnl')}
            className="p-4 bg-slate-900/90 border border-emerald-500/40 bg-emerald-500/10 rounded-2xl hover:border-emerald-400 cursor-pointer transition"
          >
            <div className="text-xs text-emerald-300 font-bold">Actual Profit</div>
            <div className="text-xl font-black text-emerald-300 font-mono mt-1">₹92.0 L</div>
            <div className="text-[10px] text-emerald-400 mt-1 font-semibold">27.2% Current Net</div>
          </div>
        </div>
      </div>

      {/* OPERATIONAL KPIS (5 Items Required) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <HardHat className="w-4 h-4 text-emerald-400" />
            <span>Operational Ground Deployment</span>
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">Live On-Site Fleet & Crew</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div
            onClick={() => onNavigateTab('workers')}
            className="p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-slate-700 cursor-pointer transition flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Workers On-Site</div>
              <div className="text-xl font-black text-white font-mono">86 Crew</div>
              <div className="text-[10px] text-blue-400 font-semibold">Operators & Masons</div>
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('contractors')}
            className="p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-slate-700 cursor-pointer transition flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Contractors</div>
              <div className="text-xl font-black text-white font-mono">12 Vendors</div>
              <div className="text-[10px] text-purple-400 font-semibold">Blasting & Haulage</div>
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('vehicles')}
            className="p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-slate-700 cursor-pointer transition flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Vehicles & Heavy</div>
              <div className="text-xl font-black text-white font-mono">28 Units</div>
              <div className="text-[10px] text-amber-400 font-semibold">18 Tippers &bull; 10 Plant</div>
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('materials')}
            className="p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-slate-700 cursor-pointer transition flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Materials In Transit</div>
              <div className="text-xl font-black text-white font-mono">14,500 MT</div>
              <div className="text-[10px] text-emerald-400 font-semibold">GSB, Sand, Laterite</div>
            </div>
          </div>

          <div
            onClick={() => onOpenOttModal()}
            className="p-4 bg-slate-900 border border-rose-500/30 bg-rose-500/5 rounded-2xl hover:border-rose-400 cursor-pointer transition flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-rose-400 font-semibold">Tasks Due Today</div>
              <div className="text-xl font-black text-rose-300 font-mono">7 Tasks</div>
              <div className="text-[10px] text-rose-400 font-semibold">RZ® OTT Sync Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS ROW & WORKFLOW BANNER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* End-to-End Workflow & Variation Launch Card */}
        <div className="p-5 bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/40 border border-purple-500/30 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-purple-400 uppercase tracking-wider">
              Interactive Job Lifecycle
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
              18 Steps Verified
            </span>
          </div>

          <div>
            <h3 className="text-base font-black text-white">End-to-End Job & Contract Workflow</h3>
            <p className="text-xs text-slate-400 mt-1">
              Customer &rarr; Requirement &rarr; Lead &rarr; Quotation &rarr; Agreement &rarr; Work Order &rarr; Job &rarr; Resources &rarr; Progress &rarr; Billing &rarr; P&L.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={onOpenWorkflow}
              className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-purple-500/20"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Launch Clickable Workflow</span>
            </button>
            <button
              onClick={() => onNavigateTab('change-orders')}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition border border-slate-700 cursor-pointer"
            >
              Variation Orders
            </button>
          </div>
        </div>

        {/* Cross-Platform Ecosystem Integration Card */}
        <div className="p-5 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/30 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
              Ecosystem Connectivity
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
              Quarry &bull; Crusher &bull; Fleet
            </span>
          </div>

          <div>
            <h3 className="text-base font-black text-white">Cross-Platform Operational Hub</h3>
            <p className="text-xs text-slate-400 mt-1">
              Direct live links between Job Requirements, Quarry Excavation, Crusher Stock, Fleet Trips, Finance Ledger, and RZ® OTT.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={onOpenCrossPlatform}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>View Connections Diagram</span>
            </button>
            <button
              onClick={() => onOpenChatModal('Job Coordination')}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition border border-slate-700 cursor-pointer flex items-center gap-1"
            >
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>RZ Chat</span>
            </button>
          </div>
        </div>

        {/* Quick Actions Shortcuts Launch Card */}
        <div className="p-5 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider">
              16 Quick Actions
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              Instant Entry
            </span>
          </div>

          <div>
            <h3 className="text-base font-black text-white">Create Any Record Instantly</h3>
            <p className="text-xs text-slate-400 mt-1">
              New Customer, Requirement, Quotation, Agreement, Work Order, Job, Worker, Material, Bill, or OTT Task with 1 click.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={onOpenQuickActions}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Open Quick Actions Menu</span>
            </button>
            <button
              onClick={() => onOpenOttModal('Follow up on Milestone')}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition border border-slate-700 cursor-pointer flex items-center gap-1"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>+ OTT Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* ACTIVE JOBS PIPELINE (Clickable to Job Profile) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 uppercase font-mono tracking-wider">
                Live Active Pipeline
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                {SAMPLE_JOBS.length} Projects Loaded
              </span>
            </div>
            <h3 className="text-lg font-black text-white mt-0.5">Contract Work Orders & Progress</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('jobs')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1 border border-slate-700 cursor-pointer"
            >
              <span>View All 24 Jobs</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SAMPLE_JOBS.map((job) => (
            <div
              key={job.id}
              onClick={() => onSelectJob(job)}
              className="p-4 bg-slate-950/70 border border-slate-800 hover:border-emerald-500/50 rounded-2xl transition cursor-pointer group space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
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
                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition mt-1">
                    {job.name}
                  </h4>
                  <div className="text-xs text-slate-400 mt-0.5">{job.customerName}</div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs text-slate-500">Contract Value</div>
                  <div className="text-base font-black text-white font-mono">
                    ₹{(job.contractValue / 100000).toFixed(2)} L
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400 text-[11px]">Execution Progress</span>
                  <span className="text-emerald-400 font-mono font-bold text-[11px]">
                    {job.progressPercent}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      job.status === 'Delayed' ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${job.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Job mini specs */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                <div>
                  <span className="text-slate-500">Billed:</span>{' '}
                  <span className="text-slate-300 font-mono font-semibold">
                    ₹{(job.billedAmount / 100000).toFixed(1)} L
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Actual Cost:</span>{' '}
                  <span className="text-slate-300 font-mono font-semibold">
                    ₹{(job.actualCost / 100000).toFixed(1)} L
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold group-hover:underline flex items-center justify-end gap-1">
                    <span>Job Profile</span>
                    <ArrowRightLeft className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* URGENT OTT TASKS & TODAY'S ACTION ITEMS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">RZ® OTT: Today's High-Priority Tasks</h3>
              <p className="text-xs text-slate-400">Organise Today & Tomorrow integration with active contract workflows</p>
            </div>
          </div>

          <button
            onClick={() => onOpenOttModal()}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create OTT Task</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SAMPLE_OTT_TASKS.map((task) => (
            <div
              key={task.id}
              className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-2xl flex flex-col justify-between space-y-2.5"
            >
              <div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-mono text-emerald-400 font-bold">{task.id}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                      task.priority === 'Urgent'
                        ? 'bg-rose-500/20 text-rose-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
                <div className="text-xs font-bold text-white mt-1 leading-snug">{task.title}</div>
                <div className="text-[11px] text-slate-400 mt-1">{task.customerOrContractor}</div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                <span className="text-slate-500 font-mono">Due: {task.dueDate}</span>
                <button
                  onClick={() => onOpenChatModal(task.customerOrContractor)}
                  className="text-cyan-400 hover:underline flex items-center gap-0.5 cursor-pointer font-semibold"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>Chat</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
