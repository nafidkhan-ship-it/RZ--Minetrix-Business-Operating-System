import React from 'react';
import {
  X,
  Layers,
  FileText,
  FileSpreadsheet,
  FileType,
  Printer,
  FormInput,
  ArrowRight,
  Mountain,
  Cpu,
  Truck,
  Building2,
  ShoppingBag,
  Users,
  DollarSign
} from 'lucide-react';
import { ProductivityToolId } from '../types';

interface CrossPlatformDocModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (tool: ProductivityToolId, title: string, category: string) => void;
}

export const CrossPlatformDocModal: React.FC<CrossPlatformDocModalProps> = ({
  isOpen,
  onClose,
  onSelectAction
}) => {
  if (!isOpen) return null;

  const ACTIONS = [
    {
      platform: 'Platform 01 — Quarry',
      icon: Mountain,
      color: 'text-amber-400',
      options: [
        { label: 'Create RZ Word Mining Agreement', tool: 'word', template: 'Mining Concession Lease Agreement', category: 'Quarry' },
        { label: 'Create RZ PDF Pithead Statement', tool: 'pdf', template: 'Quarry Extraction Statutory Statement', category: 'Quarry' }
      ]
    },
    {
      platform: 'Platform 02 — Crusher',
      icon: Cpu,
      color: 'text-emerald-400',
      options: [
        { label: 'Create RZ Sheet Production Report', tool: 'sheet', template: 'Crusher Production Sheet', category: 'Crusher' },
        { label: 'Create RZ Word Maintenance Work Order', tool: 'word', template: 'Work Order', category: 'Crusher' }
      ]
    },
    {
      platform: 'Platform 03 — Vehicle & Fleet',
      icon: Truck,
      color: 'text-cyan-400',
      options: [
        { label: 'Create RZ Sheet Vehicle Trip Sheet', tool: 'sheet', template: 'Vehicle Trip Sheet', category: 'Vehicle' },
        { label: 'Create RZ Print Driver Batta Slip', tool: 'print', template: 'Driver Trip Batta Voucher', category: 'Vehicle' }
      ]
    },
    {
      platform: 'Platform 04 — Contract & Job',
      icon: Building2,
      color: 'text-purple-400',
      options: [
        { label: 'Create RZ Word Subcontractor Agreement', tool: 'word', template: 'Contract', category: 'Contracts' },
        { label: 'Create RZ PDF Progress Billing Dossier', tool: 'pdf', template: 'Contract', category: 'Contracts' }
      ]
    },
    {
      platform: 'Platform 05 — Building Materials Commerce',
      icon: ShoppingBag,
      color: 'text-rose-400',
      options: [
        { label: 'Create RZ Word Commercial Quotation', tool: 'word', template: 'Quotation', category: 'Invoices' },
        { label: 'Create RZ PDF GST Tax Invoice', tool: 'pdf', template: 'Invoice', category: 'Invoices' }
      ]
    },
    {
      platform: 'Platform 07 — Quarry Land',
      icon: Layers,
      color: 'text-yellow-400',
      options: [
        { label: 'Create RZ Word Land Concession Agreement', tool: 'word', template: 'Land Agreement', category: 'Contracts' },
        { label: 'Create RZ Sheet Land Royalty Register', tool: 'sheet', template: 'Expense Sheet', category: 'Quarry' }
      ]
    },
    {
      platform: 'Shared ERP — People & HR',
      icon: Users,
      color: 'text-indigo-400',
      options: [
        { label: 'Create RZ Print Official Salary Slip', tool: 'print', template: 'Salary Slip', category: 'HR' },
        { label: 'Create RZ Word Staff Appointment Letter', tool: 'word', template: 'Appointment Letter', category: 'HR' }
      ]
    },
    {
      platform: 'Shared ERP — Finance & Ledgers',
      icon: DollarSign,
      color: 'text-teal-400',
      options: [
        { label: 'Create RZ Sheet Customer / Supplier Ledger', tool: 'sheet', template: 'Customer Ledger', category: 'Finance' },
        { label: 'Create RZ PDF Auditor Statement', tool: 'pdf', template: 'Statement', category: 'Finance' }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Cross-Platform Document Generator</h3>
              <p className="text-xs text-slate-400">
                Launch pre-configured Productivity templates contextual to any of the 10 Platforms.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Platform Grid */}
        <div className="overflow-y-auto space-y-4 pr-1 scrollbar-none flex-1">
          {ACTIONS.map((group, idx) => {
            const Icon = group.icon;
            return (
              <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 font-bold text-white text-xs">
                  <Icon className={`w-4 h-4 ${group.color}`} />
                  <span>{group.platform}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-xs">
                  {group.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => {
                        onSelectAction(opt.tool as ProductivityToolId, opt.template, opt.category);
                        onClose();
                      }}
                      className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800/80 hover:border-slate-700 text-left transition flex items-center justify-between cursor-pointer group"
                    >
                      <div className="truncate pr-2">
                        <span className="font-bold text-slate-200 group-hover:text-amber-400 transition block truncate">
                          {opt.label}
                        </span>
                        <span className="text-[10px] text-slate-500">Preset: {opt.template}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 shrink-0 transition" />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
