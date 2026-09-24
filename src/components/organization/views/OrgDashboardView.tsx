import React from 'react';
import {
  Users,
  Building2,
  Package,
  HardDrive,
  CreditCard,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  Send,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Layers,
  ShieldCheck,
  Zap,
  TrendingUp
} from 'lucide-react';
import {
  DEMO_COMPANY_PROFILE,
  DEMO_BRANCHES,
  DEMO_SITES,
  DEMO_STAFF_MEMBERS,
  DEMO_STAFF_INVITATIONS,
  ALL_MODULES_LIST
} from '../data/orgDemoData';

interface OrgDashboardViewProps {
  onNavigateTab: (tab: string) => void;
  onOpenInviteModal: () => void;
  onOpenUpgradeModal: () => void;
  onOpenTestFlowsModal: () => void;
}

export const OrgDashboardView: React.FC<OrgDashboardViewProps> = ({
  onNavigateTab,
  onOpenInviteModal,
  onOpenUpgradeModal,
  onOpenTestFlowsModal
}) => {
  const KPIS = [
    { label: 'Active Users', val: '24 Accounts', sub: 'SSO & Multi-Factor', icon: Users, color: 'text-amber-400', border: 'border-amber-500/20' },
    { label: 'Total Staff', val: `${DEMO_STAFF_MEMBERS.length + 37} Personnel`, sub: 'Roster & Biometric', icon: ShieldCheck, color: 'text-cyan-400', border: 'border-cyan-500/20' },
    { label: 'Active Modules', val: '14 Modules', sub: 'All 10 Platforms + ERP', icon: Package, color: 'text-emerald-400', border: 'border-emerald-500/20' },
    { label: 'Operating Branches', val: `${DEMO_BRANCHES.length} Hubs`, sub: 'Kerala & Regional', icon: Building2, color: 'text-purple-400', border: 'border-purple-500/20' },
    { label: 'Mining & Plant Sites', val: `${DEMO_SITES.length} Locations`, sub: 'Quarries, Silos & Yards', icon: MapPin, color: 'text-rose-400', border: 'border-rose-500/20' },
    { label: 'Cloud Storage Vault', val: '14.2 / 50 GB', sub: '28% Utilized', icon: HardDrive, color: 'text-blue-400', border: 'border-blue-500/20' },
    { label: 'Monthly BOS Events', val: '184.2k / 1M', sub: 'Healthy Run-Rate', icon: Zap, color: 'text-yellow-400', border: 'border-yellow-500/20' },
    { label: 'Subscription Tier', val: 'Enterprise BOS', sub: 'Active & Verified', icon: CreditCard, color: 'text-emerald-400', border: 'border-emerald-500/20' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Alert / Demo Notice */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              ORGANIZATION ENGINE OVERVIEW
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
              Studio Preview / Demo Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">
            {DEMO_COMPANY_PROFILE.displayName}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Governing enterprise multi-tenant configuration, branch operations, subscription limits, and staff RBAC access matrix across all 10 ecosystem platforms.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenTestFlowsModal}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>4 Interactive Test Flows</span>
          </button>
          <button
            onClick={onOpenInviteModal}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-purple-600/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>+ Invite Staff</span>
          </button>
        </div>
      </div>

      {/* 8 Primary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {KPIS.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl bg-slate-900 border ${kpi.border} space-y-1 shadow-md hover:border-slate-700 transition flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] uppercase font-mono font-bold truncate">{kpi.label}</span>
                <Icon className={`w-3.5 h-3.5 ${kpi.color} shrink-0`} />
              </div>
              <div className={`text-sm font-black font-mono ${kpi.color} mt-1`}>
                {kpi.val}
              </div>
              <div className="text-[9px] text-slate-500 font-mono truncate">
                {kpi.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: User Activity, Branch Operations, and Pending Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Branch Summary & Module Usage */}
        <div className="lg:col-span-2 space-y-6">
          {/* Branch Activity & Operating Sites */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-purple-400" />
                  <span>Branch Operations &amp; Site Utilization</span>
                </h3>
                <p className="text-xs text-slate-400">Multi-branch execution under unified enterprise isolation</p>
              </div>
              <button
                onClick={() => onNavigateTab('branches')}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>View All Branches</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {DEMO_BRANCHES.map(br => (
                <div key={br.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                      {br.status}
                    </span>
                    <span className="text-xs font-mono text-slate-500">{br.code}</span>
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-xs">{br.name}</h4>
                    <div className="text-[11px] text-slate-400 mt-0.5">{br.district}, {br.state}</div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Headcount: <strong className="text-white">{br.staffCount}</strong></span>
                    <span className="text-slate-400">Sites: <strong className="text-amber-400">{br.sitesCount}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Module Usage & Platform Accessibility */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-400" />
                  <span>Subscribed Platform &amp; Module Status</span>
                </h3>
                <p className="text-xs text-slate-400">Governed by Enterprise BOS subscription tier</p>
              </div>
              <button
                onClick={() => onNavigateTab('subscription')}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Subscription Limits</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              {ALL_MODULES_LIST.slice(0, 9).map(m => (
                <div key={m.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <div className="truncate pr-2">
                    <div className="font-bold text-slate-200 text-[11px] truncate">{m.name}</div>
                    <div className="text-[9px] font-mono text-slate-500">{m.category}</div>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold shrink-0">
                    ACTIVE
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Pending Invitations & Subscription Alerts */}
        <div className="space-y-6">
          {/* Pending Invitations Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>Staff Invitations</span>
                </h3>
                <p className="text-xs text-slate-400">{DEMO_STAFF_INVITATIONS.filter(i => i.status === 'Pending').length} Pending onboarding</p>
              </div>
              <button
                onClick={() => onNavigateTab('staff')}
                className="text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Directory</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {DEMO_STAFF_INVITATIONS.slice(0, 3).map(inv => (
                <div key={inv.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{inv.name}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      inv.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' :
                      inv.status === 'Accepted' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Role: <strong className="text-amber-400">{inv.role}</strong> &bull; Seat: {inv.seatType}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    Sent: {inv.invitedAt}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subscription Alerts & Capacity Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Subscription Capacity</span>
              </h3>
              <span className="text-xs font-mono text-emerald-400 font-bold">Healthy</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between items-center text-[11px] mb-1">
                  <span className="text-slate-300">Staff Accounts (7 / 10 used)</span>
                  <span className="font-mono text-amber-400 font-bold">70%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: '70%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-[11px] mb-1">
                  <span className="text-slate-300">Driver Seats (12 / 20 used)</span>
                  <span className="font-mono text-cyan-400 font-bold">60%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full rounded-full" style={{ width: '60%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-[11px] mb-1">
                  <span className="text-slate-300">Cloud Storage (14.2 / 50 GB used)</span>
                  <span className="font-mono text-purple-400 font-bold">28%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-400 h-full rounded-full" style={{ width: '28%' }} />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={onOpenUpgradeModal}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Manage Plan / Compare Tiers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
