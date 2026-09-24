import React from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  Award,
  Clock,
  CalendarDays,
  Calendar,
  Zap,
  Sliders,
  DollarSign,
  CreditCard,
  Truck,
  FileText,
  FolderLock,
  Contact,
  BarChart3,
  CheckSquare,
  Settings,
  Search,
  Sparkles
} from 'lucide-react';
import { WorkforceSectionTab, WorkforceRole } from './types';

interface WorkforceNavPillsProps {
  activeTab: WorkforceSectionTab;
  onSelectTab: (tab: WorkforceSectionTab) => void;
  currentRole: WorkforceRole;
  onChangeRole: (role: WorkforceRole) => void;
  onOpenSearch: () => void;
  onOpenFlows: () => void;
  onOpenQuickAction: () => void;
}

export const WorkforceNavPills: React.FC<WorkforceNavPillsProps> = ({
  activeTab,
  onSelectTab,
  currentRole,
  onChangeRole,
  onOpenSearch,
  onOpenFlows,
  onOpenQuickAction
}) => {
  const NAV_ITEMS: {
    id: WorkforceSectionTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
  }[] = [
    { id: 'dashboard', label: 'Workforce Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees', icon: Users, count: 148 },
    { id: 'departments', label: 'Departments', icon: Building2, count: 14 },
    { id: 'designations', label: 'Designations', icon: Award, count: 14 },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'shifts', label: 'Shifts', icon: CalendarDays, count: 7 },
    { id: 'leave', label: 'Leave Management', icon: Calendar, count: 4 },
    { id: 'overtime', label: 'Overtime', icon: Zap, count: 4 },
    { id: 'salary-setup', label: 'Salary Setup', icon: Sliders },
    { id: 'payroll', label: 'Payroll', icon: DollarSign },
    { id: 'advances', label: 'Staff Advances', icon: CreditCard, count: 6 },
    { id: 'batta', label: 'Batta & Allowances', icon: Truck, count: 5 },
    { id: 'salary-slips', label: 'Salary Slips', icon: FileText },
    { id: 'documents', label: 'Staff Documents', icon: FolderLock, count: 7 },
    { id: 'directory', label: 'Staff Directory', icon: Contact },
    { id: 'reports', label: 'Workforce Reports', icon: BarChart3, count: 14 },
    { id: 'approvals', label: 'Approvals', icon: CheckSquare, count: 6 },
    { id: 'settings', label: 'Workforce Settings', icon: Settings }
  ];

  const ROLES: { id: WorkforceRole; label: string }[] = [
    { id: 'OWNER', label: 'Owner / Director' },
    { id: 'HR', label: 'HR Lead' },
    { id: 'ACCOUNTANT', label: 'Accountant' },
    { id: 'MANAGER', label: 'Plant Manager' },
    { id: 'SUPERVISOR', label: 'Pit Supervisor' },
    { id: 'DRIVER', label: 'Driver' },
    { id: 'STAFF', label: 'Staff' }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3 font-mono">
      {/* Top action row: Role-Aware Switcher + Search + Flows + Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Simulate Role View:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            {ROLES.map((r) => (
              <button
                key={r.id}
                onClick={() => onChangeRole(r.id)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer shrink-0 border ${
                  currentRole === r.id
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenSearch}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
          >
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span>Search</span>
          </button>
          <button
            onClick={onOpenFlows}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>7 Studio Flows</span>
          </button>
          <button
            onClick={onOpenQuickAction}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-amber-500/20"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Quick Actions</span>
          </button>
        </div>
      </div>

      {/* 18 Horizontal Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 cursor-pointer shrink-0 border ${
                isActive
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-lg shadow-amber-500/20'
                  : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
              <span>{item.label}</span>
              {item.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isActive
                      ? 'bg-slate-950 text-amber-400'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
