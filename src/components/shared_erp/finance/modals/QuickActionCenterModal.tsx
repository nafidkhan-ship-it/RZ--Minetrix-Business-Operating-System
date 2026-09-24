import React, { useState } from 'react';
import {
  X,
  Zap,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  Users,
  Building2,
  DollarSign,
  Landmark,
  FileSpreadsheet,
  Plus,
  CheckCircle2
} from 'lucide-react';
import { FinanceSectionTab } from '../types';

interface QuickActionCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: FinanceSectionTab) => void;
  onToast: (msg: string) => void;
}

export const QuickActionCenterModal: React.FC<QuickActionCenterModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onToast
}) => {
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  // Form states for quick actions
  const [actionParty, setActionParty] = useState('');
  const [actionAmount, setActionAmount] = useState('');
  const [actionMode, setActionMode] = useState('BANK_TRANSFER');
  const [actionNote, setActionNote] = useState('');

  if (!isOpen) return null;

  const ACTIONS: {
    id: string;
    label: string;
    description: string;
    targetTab: FinanceSectionTab;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    badge: string;
  }[] = [
    {
      id: 'pay-in',
      label: 'Record Pay-In Voucher',
      description: 'Receive payments, customer advances or equity capital',
      targetTab: 'pay-in',
      icon: ArrowDownLeft,
      color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10',
      badge: 'RECEIPT'
    },
    {
      id: 'pay-out',
      label: 'Record Pay-Out Voucher',
      description: 'Disburse supplier dues, vendor bills, lease payments or EMIs',
      targetTab: 'pay-out',
      icon: ArrowUpRight,
      color: 'text-orange-400 border-orange-500/20 bg-orange-500/10',
      badge: 'DISBURSE'
    },
    {
      id: 'new-expense',
      label: 'New Expense Entry',
      description: 'Log immediate pithead, crusher, fleet or administrative expense',
      targetTab: 'expenses',
      icon: Receipt,
      color: 'text-amber-400 border-amber-500/20 bg-amber-500/10',
      badge: 'VOUCHER'
    },
    {
      id: 'cust-payment',
      label: 'Customer Payment Receipt',
      description: 'Credit customer receivables ledger with NEFT, Cheque or Cash',
      targetTab: 'debtors',
      icon: Users,
      color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10',
      badge: 'DEBTOR'
    },
    {
      id: 'supp-payment',
      label: 'Supplier Payment Remittance',
      description: 'Clear vendor bill with automated settlement and ledger posting',
      targetTab: 'creditors',
      icon: Building2,
      color: 'text-rose-400 border-rose-500/20 bg-rose-500/10',
      badge: 'CREDITOR'
    },
    {
      id: 'staff-advance',
      label: 'Issue Staff Advance',
      description: 'Record staff loan or salary advance with recovery tenure',
      targetTab: 'staff-advances',
      icon: DollarSign,
      color: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10',
      badge: 'WORKFORCE'
    },
    {
      id: 'salary-payment',
      label: 'Disburse Salary Payment',
      description: 'Process monthly payroll batch or driver trip allowance',
      targetTab: 'payroll',
      icon: Users,
      color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/10',
      badge: 'PAYROLL'
    },
    {
      id: 'partner-settle',
      label: 'Execute Partner Settlement',
      description: 'Distribute audited monthly profit share or capital dividend',
      targetTab: 'settlements',
      icon: Zap,
      color: 'text-pink-400 border-pink-500/20 bg-pink-500/10',
      badge: 'EQUITY'
    },
    {
      id: 'bank-transfer',
      label: 'Bank-to-Bank Contra Transfer',
      description: 'Inter-account liquidity contra entry (does not affect P&L)',
      targetTab: 'banks',
      icon: Landmark,
      color: 'text-blue-400 border-blue-500/20 bg-blue-500/10',
      badge: 'CONTRA'
    },
    {
      id: 'new-ledger',
      label: 'Post General Ledger Entry',
      description: 'Manual double-entry adjustment journal voucher',
      targetTab: 'ledgers',
      icon: FileSpreadsheet,
      color: 'text-teal-400 border-teal-500/20 bg-teal-500/10',
      badge: 'JOURNAL'
    }
  ];

  const handleExecuteQuick = (act: typeof ACTIONS[0]) => {
    onNavigateTab(act.targetTab);
    onToast(`Opened ${act.label} in Workspace`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Finance Quick Action Center</h3>
              <p className="text-xs text-slate-400">
                10 instant 1-click accounting triggers &amp; voucher initialization shortcuts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 10 Action Cards Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {ACTIONS.map((act) => {
            const Icon = act.icon;
            return (
              <div
                key={act.id}
                onClick={() => handleExecuteQuick(act)}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition cursor-pointer flex items-start gap-3.5 group shadow-sm hover:shadow-md"
              >
                <div className={`p-3 rounded-xl border ${act.color} group-hover:scale-110 transition shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-amber-300 transition truncate">
                      {act.label}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 font-mono font-bold border border-slate-800">
                      {act.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed font-sans">
                    {act.description}
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
