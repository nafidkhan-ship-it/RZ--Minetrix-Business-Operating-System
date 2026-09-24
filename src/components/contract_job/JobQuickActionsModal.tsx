import React from 'react';
import {
  Zap,
  UserPlus,
  FileCheck2,
  FileText,
  FileSignature,
  ClipboardList,
  Briefcase,
  Users,
  Truck,
  Boxes,
  Wallet,
  Receipt,
  CreditCard,
  TrendingUp,
  CalendarCheck,
  MessageSquare,
  X
} from 'lucide-react';

interface JobQuickActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (actionKey: string) => void;
}

export const JobQuickActionsModal: React.FC<JobQuickActionsModalProps> = ({
  isOpen,
  onClose,
  onSelectAction
}) => {
  if (!isOpen) return null;

  const ACTIONS = [
    { key: 'new_customer', label: 'New Customer', icon: UserPlus, color: 'text-emerald-400', nav: 'customers' },
    { key: 'new_requirement', label: 'New Requirement (RFQ)', icon: FileCheck2, color: 'text-cyan-400', nav: 'requirements' },
    { key: 'new_quotation', label: 'New Quotation', icon: FileText, color: 'text-amber-400', nav: 'quotations' },
    { key: 'new_agreement', label: 'Draft Agreement', icon: FileSignature, color: 'text-purple-400', nav: 'agreements' },
    { key: 'new_work_order', label: 'Issue Work Order', icon: ClipboardList, color: 'text-rose-400', nav: 'work-orders' },
    { key: 'new_job', label: 'Initialize New Job', icon: Briefcase, color: 'text-emerald-400', nav: 'jobs' },
    { key: 'add_worker', label: 'Enroll Worker', icon: Users, color: 'text-blue-400', nav: 'workers' },
    { key: 'assign_vehicle', label: 'Assign Fleet Vehicle', icon: Truck, color: 'text-amber-400', nav: 'vehicles' },
    { key: 'allocate_material', label: 'Allocate Material Feed', icon: Boxes, color: 'text-cyan-400', nav: 'materials' },
    { key: 'record_expense', label: 'Record Site Expense', icon: Wallet, color: 'text-rose-400', nav: 'expenses' },
    { key: 'generate_bill', label: 'Generate RA Bill', icon: Receipt, color: 'text-emerald-400', nav: 'billing' },
    { key: 'record_payment', label: 'Record Payment Remittance', icon: CreditCard, color: 'text-cyan-400', nav: 'payments' },
    { key: 'log_progress', label: 'Daily Progress Diary', icon: TrendingUp, color: 'text-amber-400', nav: 'jobs' },
    { key: 'create_ott_task', label: 'Create RZ OTT Task', icon: CalendarCheck, color: 'text-purple-400', nav: 'tasks' },
    { key: 'open_rz_chat', label: 'Open RZ Field Chat', icon: MessageSquare, color: 'text-emerald-400', nav: 'chat' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Global Quick Actions</h2>
              <div className="text-xs text-slate-400 font-mono">
                Rapid operational shortcuts across all 20 modules
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ACTIONS.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.key}
                onClick={() => {
                  onClose();
                  onSelectAction(act.nav);
                }}
                className="p-3.5 bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-2xl transition text-left flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <Icon className={`w-4 h-4 ${act.color}`} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition truncate">
                    {act.label}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono truncate">
                    &rarr; {act.nav}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
