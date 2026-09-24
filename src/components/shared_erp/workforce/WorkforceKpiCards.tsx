import React from 'react';
import {
  Users,
  UserCheck,
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  Zap,
  CreditCard,
  DollarSign,
  AlertTriangle,
  Briefcase,
  Building2,
  ChevronRight
} from 'lucide-react';
import { WorkforceSectionTab } from './types';

interface WorkforceKpiCardsProps {
  onCardClick?: (targetTab: WorkforceSectionTab) => void;
}

export const WorkforceKpiCards: React.FC<WorkforceKpiCardsProps> = ({ onCardClick }) => {
  const KPIS: {
    id: string;
    label: string;
    value: string;
    subtext: string;
    targetTab: WorkforceSectionTab;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    badge: string;
    badgeColor: string;
  }[] = [
    {
      id: 'total-emp',
      label: 'Total Employees',
      value: '148',
      subtext: 'Across 14 operational units',
      targetTab: 'employees',
      icon: Users,
      accentColor: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
      badge: '+6 this quarter',
      badgeColor: 'text-blue-400 bg-blue-500/10'
    },
    {
      id: 'active-emp',
      label: 'Active Employees',
      value: '142',
      subtext: '95.9% on-roll workforce',
      targetTab: 'employees',
      icon: UserCheck,
      accentColor: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
      badge: 'ON ROLL',
      badgeColor: 'text-emerald-400 bg-emerald-500/10'
    },
    {
      id: 'present-today',
      label: 'Present Today',
      value: '134',
      subtext: 'Pithead, plant & dispatch',
      targetTab: 'attendance',
      icon: CheckCircle2,
      accentColor: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
      badge: '94.3% RATE',
      badgeColor: 'text-cyan-400 bg-cyan-500/10'
    },
    {
      id: 'absent-today',
      label: 'Absent Today',
      value: '5',
      subtext: 'Unplanned absence alerts',
      targetTab: 'attendance',
      icon: XCircle,
      accentColor: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
      badge: 'ACTION REQ',
      badgeColor: 'text-rose-400 bg-rose-500/10'
    },
    {
      id: 'on-leave',
      label: 'On Leave',
      value: '3',
      subtext: 'Approved medical/casual leave',
      targetTab: 'leave',
      icon: Calendar,
      accentColor: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
      badge: 'SANCTIONED',
      badgeColor: 'text-amber-400 bg-amber-500/10'
    },
    {
      id: 'late-today',
      label: 'Late Today',
      value: '7',
      subtext: 'Grace period exceeded (>15m)',
      targetTab: 'attendance',
      icon: Clock,
      accentColor: 'border-orange-500/30 bg-orange-500/10 text-orange-400',
      badge: 'NOTIFIED',
      badgeColor: 'text-orange-400 bg-orange-500/10'
    },
    {
      id: 'ot-today',
      label: 'Overtime Today',
      value: '18 hrs',
      subtext: 'Crusher night shift & blasters',
      targetTab: 'overtime',
      icon: Zap,
      accentColor: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
      badge: '4 LOGGED',
      badgeColor: 'text-purple-400 bg-purple-500/10'
    },
    {
      id: 'pending-adv',
      label: 'Pending Advances',
      value: '₹3,45,000',
      subtext: 'Recoverable across 18 staff',
      targetTab: 'advances',
      icon: CreditCard,
      accentColor: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
      badge: 'ACTIVE EMI',
      badgeColor: 'text-yellow-400 bg-yellow-500/10'
    },
    {
      id: 'payroll-pend',
      label: 'Payroll Pending',
      value: '₹48,20,000',
      subtext: 'Current month salary batch',
      targetTab: 'payroll',
      icon: DollarSign,
      accentColor: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400',
      badge: 'PROCESSING',
      badgeColor: 'text-indigo-400 bg-indigo-500/10'
    },
    {
      id: 'doc-exp',
      label: 'Documents Expiring',
      value: '6',
      subtext: 'HMV licenses & mining blaster',
      targetTab: 'documents',
      icon: AlertTriangle,
      accentColor: 'border-red-500/30 bg-red-500/10 text-red-400',
      badge: 'RENEWAL DUE',
      badgeColor: 'text-red-400 bg-red-500/10'
    },
    {
      id: 'open-pos',
      label: 'Open Positions',
      value: '4',
      subtext: 'Heavy operators & QC surveyor',
      targetTab: 'employees',
      icon: Briefcase,
      accentColor: 'border-teal-500/30 bg-teal-500/10 text-teal-400',
      badge: 'HIRING',
      badgeColor: 'text-teal-400 bg-teal-500/10'
    },
    {
      id: 'dep-count',
      label: 'Departments',
      value: '14',
      subtext: 'Quarry, Crusher, Fleet, Office',
      targetTab: 'departments',
      icon: Building2,
      accentColor: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
      badge: 'ACTIVE UNITS',
      badgeColor: 'text-amber-400 bg-amber-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {KPIS.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.id}
            onClick={() => onCardClick?.(kpi.targetTab)}
            className={`p-3.5 rounded-2xl bg-slate-900 border transition-all duration-200 hover:border-amber-500/40 hover:scale-[1.02] cursor-pointer group shadow-lg flex flex-col justify-between ${kpi.accentColor.split(' ')[0]}`}
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className={`p-2 rounded-xl ${kpi.accentColor} shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${kpi.badgeColor}`}>
                  {kpi.badge}
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-400 group-hover:text-white transition line-clamp-1">
                {kpi.label}
              </span>
              <div className="text-lg sm:text-xl font-black text-white mt-0.5 tracking-tight font-mono">
                {kpi.value}
              </div>
            </div>

            <div className="pt-2 mt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 group-hover:text-amber-400 transition">
              <span className="truncate">{kpi.subtext}</span>
              <ChevronRight className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
