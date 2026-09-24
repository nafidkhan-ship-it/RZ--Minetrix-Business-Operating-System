import React from 'react';
import {
  Zap,
  X,
  Plus,
  Package,
  Users,
  Building2,
  FileText,
  Filter,
  ShoppingBag,
  Truck,
  Receipt,
  RotateCcw,
  QrCode,
  DollarSign,
  CreditCard,
  Sliders,
  Sparkles
} from 'lucide-react';
import { CommerceSubTab } from '../types';

interface CommerceQuickActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: CommerceSubTab) => void;
  onOpenNewProduct: () => void;
  onToast: (msg: string) => void;
}

export const CommerceQuickActionsModal: React.FC<CommerceQuickActionsModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenNewProduct,
  onToast
}) => {
  if (!isOpen) return null;

  const ACTIONS: {
    id: string;
    label: string;
    desc: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    action: () => void;
  }[] = [
    {
      id: 'act-1',
      label: '1. New Material SKU',
      desc: 'Add rock aggregate, sand or spares to master catalog',
      icon: Package,
      accentColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      action: () => {
        onClose();
        onOpenNewProduct();
      }
    },
    {
      id: 'act-2',
      label: '2. New Customer CRM',
      desc: 'Register builder or contractor with credit limit',
      icon: Users,
      accentColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      action: () => {
        onClose();
        onNavigateTab('customers');
        onToast('Open New Customer CRM dialog');
      }
    },
    {
      id: 'act-3',
      label: '3. New Supplier SRM',
      desc: 'Onboard fuel refinery, explosives or spare vendor',
      icon: Building2,
      accentColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      action: () => {
        onClose();
        onNavigateTab('suppliers');
        onToast('Open New Supplier SRM dialog');
      }
    },
    {
      id: 'act-4',
      label: '4. Purchase Request (PR)',
      desc: 'Internal pithead or crusher requisition',
      icon: FileText,
      accentColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      action: () => {
        onClose();
        onNavigateTab('purchase-requests');
        onToast('Open New Requisition Form');
      }
    },
    {
      id: 'act-5',
      label: '5. Launch RFQ Bidding',
      desc: 'Send request for quote to approved vendors',
      icon: Filter,
      accentColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
      action: () => {
        onClose();
        onNavigateTab('rfq');
        onToast('Open RFQ Creation Matrix');
      }
    },
    {
      id: 'act-6',
      label: '6. Release Purchase Order',
      desc: 'Binding order for diesel, liners or equipment',
      icon: ShoppingBag,
      accentColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
      action: () => {
        onClose();
        onNavigateTab('purchase-orders');
        onToast('Open Purchase Order Generator');
      }
    },
    {
      id: 'act-7',
      label: '7. Record Inward GRN',
      desc: 'Weighbridge QC check and material intake',
      icon: Truck,
      accentColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      action: () => {
        onClose();
        onNavigateTab('grn');
        onToast('Open Inward GRN Weighbridge form');
      }
    },
    {
      id: 'act-8',
      label: '8. Book Purchase Bill',
      desc: '3-way match vendor bill for accounts payable',
      icon: DollarSign,
      accentColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      action: () => {
        onClose();
        onNavigateTab('purchase-bills');
        onToast('Open Purchase Bill Booking');
      }
    },
    {
      id: 'act-9',
      label: '9. Create Quotation',
      desc: 'Formal commercial estimate with 1-click SO conversion',
      icon: FileText,
      accentColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      action: () => {
        onClose();
        onNavigateTab('quotations');
        onToast('Open Commercial Quotation Creator');
      }
    },
    {
      id: 'act-10',
      label: '10. Confirm Sales Order',
      desc: 'Book customer loading slot and schedule tipper',
      icon: Package,
      accentColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      action: () => {
        onClose();
        onNavigateTab('sales-orders');
        onToast('Open Sales Order Dialog');
      }
    },
    {
      id: 'act-11',
      label: '11. Issue QR Gate Pass',
      desc: 'Security clearance pass for outward tipper haulage',
      icon: QrCode,
      accentColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      action: () => {
        onClose();
        onNavigateTab('gate-pass');
        onToast('Open Gate Pass Generator');
      }
    },
    {
      id: 'act-12',
      label: '12. Generate Tax Invoice',
      desc: 'Issue GST e-Invoice with IRN and e-Way Bill',
      icon: Receipt,
      accentColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
      action: () => {
        onClose();
        onNavigateTab('invoices');
        onToast('Open Tax Invoice Generator');
      }
    },
    {
      id: 'act-13',
      label: '13. Receive Customer Payment',
      desc: 'Record UPI, RTGS or cash collection against invoice',
      icon: DollarSign,
      accentColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      action: () => {
        onClose();
        onNavigateTab('payments');
        onToast('Open Payment Receipt Form');
      }
    },
    {
      id: 'act-14',
      label: '14. Disburse Vendor Bill',
      desc: 'Release bank payment to fuel or spares supplier',
      icon: DollarSign,
      accentColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      action: () => {
        onClose();
        onNavigateTab('payments');
        onToast('Open Vendor Disbursement Form');
      }
    },
    {
      id: 'act-15',
      label: '15. Issue Credit/Debit Note',
      desc: 'Post-billing adjustment for weighbridge moisture or returns',
      icon: CreditCard,
      accentColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      action: () => {
        onClose();
        onNavigateTab('credit-debit-notes');
        onToast('Open Credit/Debit Note Form');
      }
    }
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-5 relative overflow-hidden flex flex-col max-h-[85vh]">
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h2 className="text-lg font-black text-white">Commerce Operations Action Center</h2>
            </div>
            <p className="text-xs text-slate-400">15 enterprise operational shortcuts across the full procurement and fulfillment life-cycle</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto pr-1">
          {ACTIONS.map((act) => {
            const Icon = act.icon;
            return (
              <div
                key={act.id}
                onClick={act.action}
                className="p-3.5 rounded-2xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-500/40 transition cursor-pointer flex items-start gap-3 group shadow"
              >
                <div className={`p-2.5 rounded-xl border shrink-0 ${act.accentColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold text-white group-hover:text-amber-300 transition">
                    {act.label}
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    {act.desc}
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
