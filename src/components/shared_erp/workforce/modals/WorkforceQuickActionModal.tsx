import React from 'react';
import {
  X,
  Zap,
  Users,
  Clock,
  Calendar,
  CreditCard,
  Truck,
  DollarSign,
  FileText,
  Upload,
  BarChart3,
  ArrowRight
} from 'lucide-react';
import { WorkforceSectionTab } from '../types';

interface WorkforceQuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: WorkforceSectionTab) => void;
  onOpenNewEmployeeModal: () => void;
  onToast: (msg: string) => void;
}

export const WorkforceQuickActionModal: React.FC<WorkforceQuickActionModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenNewEmployeeModal,
  onToast
}) => {
  if (!isOpen) return null;

  const ACTIONS: {
    id: string;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    onClick: () => void;
  }[] = [
    {
      id: 'new-emp',
      label: 'New Employee Profile',
      description: 'Onboard new worker into HR register & assign pay scale',
      icon: Users,
      accentColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      onClick: () => {
        onClose();
        onOpenNewEmployeeModal();
      }
    },
    {
      id: 'mark-att',
      label: 'Mark Daily Attendance',
      description: 'Record muster roll, shift punches, or bulk mark unit',
      icon: Clock,
      accentColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      onClick: () => {
        onClose();
        onNavigateTab('attendance');
        onToast('Switched to Daily Attendance workspace');
      }
    },
    {
      id: 'apply-leave',
      label: 'Apply Leave Request',
      description: 'Submit casual, sick, or annual time-off for sanction',
      icon: Calendar,
      accentColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      onClick: () => {
        onClose();
        onNavigateTab('leave');
        onToast('Switched to Leave Management');
      }
    },
    {
      id: 'add-ot',
      label: 'Add Overtime Hours',
      description: 'Log extra hours for blaster drill or plant maintenance',
      icon: Zap,
      accentColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      onClick: () => {
        onClose();
        onNavigateTab('overtime');
        onToast('Switched to Overtime register');
      }
    },
    {
      id: 'staff-adv',
      label: 'Staff Advance Sanction',
      description: 'Issue worker emergency advance with salary EMI plan',
      icon: CreditCard,
      accentColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
      onClick: () => {
        onClose();
        onNavigateTab('advances');
        onToast('Switched to Staff Advances ledger');
      }
    },
    {
      id: 'add-batta',
      label: 'Log Driver Trip Batta',
      description: 'Record road trip allowances, food per diem & night halt',
      icon: Truck,
      accentColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      onClick: () => {
        onClose();
        onNavigateTab('batta');
        onToast('Switched to Batta & Allowances');
      }
    },
    {
      id: 'calc-pay',
      label: 'Calculate Payroll Batch',
      description: 'Run automatic month-end net salary reconciliation',
      icon: DollarSign,
      accentColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      onClick: () => {
        onClose();
        onNavigateTab('payroll');
        onToast('Switched to Payroll Batch Processing');
      }
    },
    {
      id: 'gen-slip',
      label: 'Generate Salary Slip',
      description: 'Issue official RZ® Minetrix monthly payslip PDF',
      icon: FileText,
      accentColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      onClick: () => {
        onClose();
        onNavigateTab('salary-slips');
        onToast('Switched to Salary Slip Center');
      }
    },
    {
      id: 'upload-doc',
      label: 'Upload Staff Document',
      description: 'Store DGMS certificate, PESO blaster permit, or ID proof',
      icon: Upload,
      accentColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      onClick: () => {
        onClose();
        onNavigateTab('documents');
        onToast('Switched to Staff Document Vault');
      }
    },
    {
      id: 'wf-rep',
      label: 'Workforce Audit Report',
      description: 'Export muster roll, absenteeism analysis, or cost digest',
      icon: BarChart3,
      accentColor: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
      onClick: () => {
        onClose();
        onNavigateTab('reports');
        onToast('Switched to Workforce Reports Hub');
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Workforce Quick Action Center</h3>
              <p className="text-xs text-slate-400">10 high-frequency operations for HR &amp; workforce administrators</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 10 Action Cards */}
        <div className="p-5 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
          {ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <div
                key={action.id}
                onClick={action.onClick}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900/80 transition-all cursor-pointer group flex items-start gap-3"
              >
                <div className={`p-2.5 rounded-xl ${action.accentColor} shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition font-sans">
                      {action.label}
                    </h4>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-1 transition" />
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans mt-1 line-clamp-2">
                    {action.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
