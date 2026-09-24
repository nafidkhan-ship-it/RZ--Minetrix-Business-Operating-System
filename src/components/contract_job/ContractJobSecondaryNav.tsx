import React from 'react';
import {
  LayoutDashboard,
  Users,
  FileCheck2,
  Target,
  FileSpreadsheet,
  FileSignature,
  ClipboardList,
  Briefcase,
  HardHat,
  Network,
  UserCheck,
  Boxes,
  Truck,
  TrendingUp,
  Receipt,
  CreditCard,
  Wallet,
  PieChart,
  FolderOpen,
  BarChart4,
  GitBranch,
  Zap,
  ArrowRightLeft
} from 'lucide-react';

export type ContractJobTab =
  | 'dashboard'
  | 'customers'
  | 'requirements'
  | 'leads'
  | 'quotations'
  | 'agreements'
  | 'work-orders'
  | 'jobs'
  | 'contractors'
  | 'subcontractors'
  | 'workers'
  | 'materials'
  | 'vehicles'
  | 'progress'
  | 'billing'
  | 'payments'
  | 'expenses'
  | 'pnl'
  | 'documents'
  | 'reports'
  | 'change-orders';

interface ContractJobSecondaryNavProps {
  activeTab: ContractJobTab;
  onTabChange: (tab: ContractJobTab) => void;
  onOpenWorkflow: () => void;
  onOpenCrossPlatform: () => void;
  onOpenQuickActions: () => void;
}

export const ContractJobSecondaryNav: React.FC<ContractJobSecondaryNavProps> = ({
  activeTab,
  onTabChange,
  onOpenWorkflow,
  onOpenCrossPlatform,
  onOpenQuickActions
}) => {
  const NAV_ITEMS: { id: ContractJobTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'requirements', label: 'Requirements', icon: FileCheck2 },
    { id: 'leads', label: 'Leads', icon: Target },
    { id: 'quotations', label: 'Quotations', icon: FileSpreadsheet },
    { id: 'agreements', label: 'Agreements', icon: FileSignature },
    { id: 'work-orders', label: 'Work Orders', icon: ClipboardList },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'contractors', label: 'Contractors', icon: HardHat },
    { id: 'subcontractors', label: 'Subcontractors', icon: Network },
    { id: 'workers', label: 'Workers', icon: UserCheck },
    { id: 'materials', label: 'Materials', icon: Boxes },
    { id: 'vehicles', label: 'Vehicles', icon: Truck },
    { id: 'progress', label: 'Job Progress', icon: TrendingUp },
    { id: 'billing', label: 'Billing', icon: Receipt },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'expenses', label: 'Expenses', icon: Wallet },
    { id: 'pnl', label: 'Job P&L', icon: PieChart },
    { id: 'documents', label: 'Documents', icon: FolderOpen },
    { id: 'reports', label: 'Reports', icon: BarChart4 },
  ];

  return (
    <div className="space-y-3">
      {/* Top action helper bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            Secondary Navigation (20 Modules)
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
            All Accessible
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenWorkflow}
            className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold text-xs border border-purple-500/30 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Open End-to-End Clickable Job Workflow"
          >
            <GitBranch className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">End-to-End</span> Workflow
          </button>

          <button
            onClick={onOpenCrossPlatform}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs border border-cyan-500/30 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Quarry, Crusher, Vehicle, Materials & Finance Connections"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Cross-Platform</span> Integrations
          </button>

          <button
            onClick={onOpenQuickActions}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md"
            title="16 Quick Action Shortcuts"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Quick Actions</span>
          </button>
        </div>
      </div>

      {/* 20 Accessible Navigation Tabs */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2 shadow-inner overflow-x-auto scrollbar-thin">
        <div className="flex items-center gap-1.5 min-w-max">
          {NAV_ITEMS.map((item, idx) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-950/70 text-slate-400 border-slate-800/80 hover:text-white hover:bg-slate-800/80 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] font-mono opacity-80">{idx + 1}.</span>
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
