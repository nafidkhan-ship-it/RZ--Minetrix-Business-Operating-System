import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  CreditCard,
  Wallet,
  Landmark,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  Sparkles,
  Users,
  DollarSign,
  UserCheck,
  Truck,
  Layers,
  FileSpreadsheet,
  RefreshCw,
  BarChart3,
  Search,
  Filter
} from 'lucide-react';
import { FinanceSectionTab } from './types';

interface FinanceNavPillsProps {
  activeTab: FinanceSectionTab;
  onSelectTab: (tab: FinanceSectionTab) => void;
  onOpenSearch: () => void;
  onOpenFlows: () => void;
}

export const FINANCE_TABS_CONFIG: {
  id: FinanceSectionTab;
  label: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'finance-dashboard', label: '1. Dashboard', icon: LayoutDashboard },
  { id: 'debtors', label: '2. Debtors', badge: '5 Due', icon: TrendingUp },
  { id: 'creditors', label: '3. Creditors', badge: '4 Bills', icon: CreditCard },
  { id: 'cash', label: '4. Cash Desk', badge: '₹8.45L', icon: Wallet },
  { id: 'banks', label: '5. Banks', badge: '3 A/Cs', icon: Landmark },
  { id: 'pay-in', label: '6. Pay-In', icon: ArrowDownLeft },
  { id: 'pay-out', label: '7. Pay-Out', icon: ArrowUpRight },
  { id: 'expenses', label: '8. Expenses', badge: '15 Cats', icon: Receipt },
  { id: 'investments', label: '9. Investments', icon: Sparkles },
  { id: 'settlements', label: '10. Partners & Settlements', icon: Users },
  { id: 'payroll', label: '11. Staff Salary', icon: DollarSign },
  { id: 'staff-advances', label: '12. Staff Advances', badge: '₹1.25L', icon: UserCheck },
  { id: 'trips', label: '13. Trip Accounts', badge: '3 Trips', icon: Truck },
  { id: 'vehicle-owners', label: '14. Vehicle Owners', icon: Truck },
  { id: 'land-owners', label: '15. Land Owners', badge: '4 Concessions', icon: Layers },
  { id: 'ledgers', label: '16. Ledgers', icon: FileSpreadsheet },
  { id: 'reconciliation', label: '17. Reconciliation', badge: '2 Diff', icon: RefreshCw },
  { id: 'reports', label: '18. Reports', badge: '14 BI', icon: BarChart3 }
];

export const FinanceNavPills: React.FC<FinanceNavPillsProps> = ({
  activeTab,
  onSelectTab,
  onOpenSearch,
  onOpenFlows
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 shadow-lg space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            Finance &amp; Accounts Module Navigation (18 Workspaces)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSearch}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span>Finance Search</span>
          </button>
          <button
            onClick={onOpenFlows}
            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>5 Interactive Flows</span>
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {FINANCE_TABS_CONFIG.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelectTab(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 border ${
                isActive
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md shadow-amber-500/20'
                  : 'bg-slate-950/70 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-800/80'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-500'}`} />
              <span>{t.label}</span>
              {t.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-md font-mono ${
                    isActive
                      ? 'bg-slate-950 text-amber-400 font-bold'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
