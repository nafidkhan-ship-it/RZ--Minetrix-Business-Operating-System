import React, { useState } from 'react';
import {
  GitFork,
  Briefcase,
  Pickaxe,
  Building2,
  Package,
  Factory,
  FileText,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserCheck,
  Truck,
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  Sparkles,
  Send,
  Calendar,
  Layers,
  ChevronRight,
  Coins
} from 'lucide-react';

interface JobOrder {
  id: string;
  code: string;
  title: string;
  category: 'QUARRY' | 'CRUSHER' | 'BUILDING_MATERIALS' | 'MANUFACTURING';
  clientOrProject: string;
  agreementType: 'PER_TON' | 'LUMP_SUM' | 'HOURLY_RENTAL' | 'SQUARE_FEET';
  targetQuantity: string;
  rate: string;
  totalValueRs: number;
  startDate: string;
  endDate: string;
  subcontractor: string;
  status: 'ACTIVE' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'COMPLETED';
  profitMarginPercent: number;
  supervisor: string;
}

export const ContractJobManagementSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'jobs-pipeline'
    | 'quarry-crusher-jobs'
    | 'agreements-work-orders'
    | 'subcontractors-rentals'
    | 'quotations-billing'
    | 'job-profitability'
    | 'reports'
  >('jobs-pipeline');

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const [jobs, setJobs] = useState<JobOrder[]>([
    {
      id: 'JOB-101',
      code: 'QJ-2026-08',
      title: 'Pit Face Blasting & Primary Excavation',
      category: 'QUARRY',
      clientOrProject: 'Bantwal Quarry Block B',
      agreementType: 'PER_TON',
      targetQuantity: '45,000 MT',
      rate: '₹68 / MT',
      totalValueRs: 3060000,
      startDate: '2026-09-01',
      endDate: '2026-10-15',
      subcontractor: 'Coastal Blasting & Mining Services',
      status: 'IN_PROGRESS',
      profitMarginPercent: 24.5,
      supervisor: 'Vikram Singh'
    },
    {
      id: 'JOB-102',
      code: 'CJ-2026-14',
      title: '20mm & 10mm Aggregate Secondary Crushing Contract',
      category: 'CRUSHER',
      clientOrProject: 'Karkala Mega Crusher Plant #2',
      agreementType: 'PER_TON',
      targetQuantity: '60,000 MT',
      rate: '₹95 / MT',
      totalValueRs: 5700000,
      startDate: '2026-09-10',
      endDate: '2026-11-30',
      subcontractor: 'Apex Crusher Operations LLC',
      status: 'ACTIVE',
      profitMarginPercent: 28.0,
      supervisor: 'Mohammed Tariq'
    },
    {
      id: 'JOB-103',
      code: 'BM-2026-22',
      title: 'High-Strength Solid Blocks Supply & Hauling Contract',
      category: 'BUILDING_MATERIALS',
      clientOrProject: 'Smart City Infrastructure Project Hub',
      agreementType: 'LUMP_SUM',
      targetQuantity: '1,20,000 Nos',
      rate: '₹34 / Block',
      totalValueRs: 4080000,
      startDate: '2026-08-15',
      endDate: '2026-12-31',
      subcontractor: 'Karnataka Precast Blocks Ltd',
      status: 'IN_PROGRESS',
      profitMarginPercent: 21.2,
      supervisor: 'Anil Rao'
    },
    {
      id: 'JOB-104',
      code: 'MF-2026-05',
      title: 'Laterite Stone Wire-Saw Precision Dressing',
      category: 'MANUFACTURING',
      clientOrProject: 'Heritage Resort Villa Project',
      agreementType: 'SQUARE_FEET',
      targetQuantity: '35,000 Sq.Ft',
      rate: '₹55 / Sq.Ft',
      totalValueRs: 1925000,
      startDate: '2026-09-05',
      endDate: '2026-10-30',
      subcontractor: 'Malabar Stone Cutters Guild',
      status: 'ACTIVE',
      profitMarginPercent: 31.8,
      supervisor: 'Karthik N'
    }
  ]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const filteredJobs = jobs.filter(j => {
    const matchCat = categoryFilter === 'ALL' || j.category === categoryFilter;
    const matchText = j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.subcontractor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchText;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-400">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-6 sm:p-7 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Pillar 4 &bull; Business Operations
              </span>
              <span className="text-slate-500 text-xs">&bull; Enterprise Contracts &amp; Execution</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <GitFork className="w-7 h-7 text-emerald-400" />
              4. Contract &amp; Job Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-3xl">
              End-to-end agreement lifecycle, work orders, subcontractor management, rental coordination, quotations, progress billing, and real-time job profitability margins across Quarry, Crusher, and Building Materials operations.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => showToast('New Work Order wizard initialized.')}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              New Contract / Job
            </button>
            <button
              onClick={() => showToast('Dispatched milestone review to RZ® OTT & Staff Task Queues.')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Dispatch OTT Task
            </button>
          </div>
        </div>

        {/* Quick KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80 text-xs">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 block text-[11px]">Active Contracts Value</span>
            <span className="text-base font-black text-white mt-0.5 block">₹1,47,65,000</span>
            <span className="text-[10px] text-emerald-400 font-semibold">+18.2% vs last month</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 block text-[11px]">Live Work Orders</span>
            <span className="text-base font-black text-amber-400 mt-0.5 block">14 In-Progress</span>
            <span className="text-[10px] text-slate-400">4 Subcontractor crews</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 block text-[11px]">Avg Net Job Margin</span>
            <span className="text-base font-black text-emerald-400 mt-0.5 block">26.4%</span>
            <span className="text-[10px] text-slate-400">Target benchmark: 22%</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 block text-[11px]">Retention Money Held</span>
            <span className="text-base font-black text-blue-400 mt-0.5 block">₹12,40,000</span>
            <span className="text-[10px] text-slate-400">Released upon handover</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none pb-1 border-b border-slate-800">
        {[
          { id: 'jobs-pipeline', label: 'Job Pipeline & Work Orders', icon: Briefcase },
          { id: 'quarry-crusher-jobs', label: 'Quarry & Crusher Jobs', icon: Pickaxe },
          { id: 'agreements-work-orders', label: 'Agreement-Based Work', icon: FileText },
          { id: 'subcontractors-rentals', label: 'Subcontractor & Rental Ops', icon: Truck },
          { id: 'quotations-billing', label: 'Quotations & Progress Billing', icon: DollarSign },
          { id: 'job-profitability', label: 'Job Profitability & Margins', icon: TrendingUp },
          { id: 'reports', label: 'Contract Audit & Reports', icon: ShieldCheck }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search job code, client, subcontractor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
          {['ALL', 'QUARRY', 'CRUSHER', 'BUILDING_MATERIALS', 'MANUFACTURING'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition text-xs whitespace-nowrap cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              {cat.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Jobs Listing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredJobs.map(job => (
          <div
            key={job.id}
            className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 shadow-xl transition space-y-4"
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {job.code}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    job.status === 'ACTIVE'
                      ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                      : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                  }`}>
                    {job.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mt-1.5 leading-snug">{job.title}</h3>
                <span className="text-xs text-slate-400">{job.clientOrProject}</span>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs text-slate-400 block">Total Value</span>
                <span className="text-sm font-black text-white font-mono">₹{job.totalValueRs.toLocaleString()}</span>
                <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">
                  Margin: {job.profitMarginPercent}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Agreement Type</span>
                <span className="font-bold text-slate-200">{job.agreementType.replace(/_/g, ' ')}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Rate: {job.rate}</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Target Quantity</span>
                <span className="font-bold text-amber-300">{job.targetQuantity}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Due: {job.endDate}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 text-slate-400">
              <div>
                <span className="block text-[11px]">Subcontractor: <strong className="text-slate-200">{job.subcontractor}</strong></span>
                <span className="block text-[10px] text-slate-500">Supervisor: {job.supervisor}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => showToast(`Dispatched progress update for ${job.code} to RZ® OTT`)}
                  className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold transition"
                >
                  OTT Sync
                </button>
                <button
                  onClick={() => showToast(`Opening billing breakdown for ${job.code}`)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
