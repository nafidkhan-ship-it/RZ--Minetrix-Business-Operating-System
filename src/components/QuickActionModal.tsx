import React, { useState } from 'react';
import {
  X,
  Plus,
  CheckCircle2,
  Clock,
  Users,
  ShoppingBag,
  Truck,
  Pickaxe,
  Building2,
  GitFork,
  FileText,
  DollarSign,
  Bell,
  Sparkles,
  Layers,
  MapPin,
  Tractor
} from 'lucide-react';
import { SectionId } from '../types/architecture';
import { LateriteStoneOrderModal } from './LateriteStoneOrderModal';
import { ottEcosystemBridge } from '../services/ottEcosystemBridge';

export type QuickActionType =
  | 'LATERITE_ORDER'
  | 'QUARRY'
  | 'PRODUCTION'
  | 'CRUSHER'
  | 'VEHICLE'
  | 'TRIP'
  | 'JOB'
  | 'CUSTOMER'
  | 'SUPPLIER'
  | 'PRODUCT'
  | 'MARKETPLACE'
  | 'LAND'
  | 'TASK'
  | 'REMINDER'
  | 'FOLLOW_UP'
  | 'INVOICE'
  | 'EXPENSE'
  | 'DOCUMENT';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAction?: QuickActionType;
  onNavigate?: (section: SectionId) => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  isOpen,
  onClose,
  defaultAction = 'TASK',
  onNavigate
}) => {
  const [selectedAction, setSelectedAction] = useState<QuickActionType>(defaultAction);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lateriteModalOpen, setLateriteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    targetDate: new Date().toISOString().split('T')[0],
    assignedTo: 'Nafid Khan (Owner)',
    amount: '',
    referenceCode: `RZ-${Math.floor(1000 + Math.random() * 9000)}`,
    notes: ''
  });

  if (!isOpen && !lateriteModalOpen) return null;

  const ACTION_CATEGORIES: {
    type: QuickActionType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    section: SectionId;
    isFeatured?: boolean;
  }[] = [
    { type: 'LATERITE_ORDER', label: 'Order Laterite Stone', icon: Layers, color: 'text-amber-400 border-amber-500 bg-amber-500/20 font-bold', section: 'building-materials-ecommerce', isFeatured: true },
    { type: 'QUARRY', label: 'New Quarry', icon: Pickaxe, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10', section: 'quarry-management' },
    { type: 'PRODUCTION', label: 'New Production', icon: Layers, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10', section: 'quarry-management' },
    { type: 'CRUSHER', label: 'New Crusher', icon: Building2, color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10', section: 'crusher-management' },
    { type: 'VEHICLE', label: 'New Vehicle', icon: Truck, color: 'text-blue-400 border-blue-500/30 bg-blue-500/10', section: 'vehicle-management' },
    { type: 'TRIP', label: 'New Trip', icon: Truck, color: 'text-blue-400 border-blue-500/30 bg-blue-500/10', section: 'vehicle-management' },
    { type: 'JOB', label: 'New Job', icon: GitFork, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10', section: 'contract-job-management' },
    { type: 'CUSTOMER', label: 'New Customer', icon: Users, color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10', section: 'building-materials-ecommerce' },
    { type: 'SUPPLIER', label: 'New Supplier', icon: Users, color: 'text-blue-400 border-blue-500/30 bg-blue-500/10', section: 'building-materials-ecommerce' },
    { type: 'PRODUCT', label: 'New Product', icon: ShoppingBag, color: 'text-rose-400 border-rose-500/30 bg-rose-500/10', section: 'building-materials-ecommerce' },
    { type: 'MARKETPLACE', label: 'New Machine Listing', icon: Tractor, color: 'text-orange-400 border-orange-500/30 bg-orange-500/10', section: 'used-machinery-marketplace' },
    { type: 'LAND', label: 'New Land Listing', icon: MapPin, color: 'text-lime-400 border-lime-500/30 bg-lime-500/10', section: 'quarry-land-management' },
    { type: 'TASK', label: 'New Task', icon: Clock, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10', section: 'rz-ott' },
    { type: 'REMINDER', label: 'New Reminder', icon: Bell, color: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10', section: 'rz-ott' },
    { type: 'FOLLOW_UP', label: 'New Follow-up', icon: Clock, color: 'text-violet-400 border-violet-500/30 bg-violet-500/10', section: 'rz-ott' },
    { type: 'INVOICE', label: 'New Invoice', icon: DollarSign, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10', section: 'finance-suite' },
    { type: 'EXPENSE', label: 'New Expense', icon: DollarSign, color: 'text-red-400 border-red-500/30 bg-red-500/10', section: 'finance-suite' },
    { type: 'DOCUMENT', label: 'New Document', icon: FileText, color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10', section: 'shared-masters-dms' },
  ];

  const handleActionSelect = (type: QuickActionType) => {
    if (type === 'LATERITE_ORDER') {
      onClose();
      setLateriteModalOpen(true);
      return;
    }
    setSelectedAction(type);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);

    // If it's a task/reminder/follow-up, create it in connected OTT
    if (selectedAction === 'TASK' || selectedAction === 'REMINDER' || selectedAction === 'FOLLOW_UP') {
      ottEcosystemBridge.createItem({
        title: formData.title || `Quick ${selectedAction} Entry`,
        description: formData.description || 'Action created via Global Quick Action Center.',
        type: selectedAction === 'REMINDER' ? 'REMINDER' : selectedAction === 'FOLLOW_UP' ? 'FOLLOW_UP' : 'TASK',
        source_system: 'PERSONAL',
        source_module: 'QUICK_ACTION',
        source_record_id: formData.referenceCode,
        source_event: 'QUICK_ACTION_CREATED',
        idempotency_key: `QA_${formData.referenceCode}`,
        sourceStatusBefore: 'CREATED',
        sourceStatusAfter: 'COMPLETED'
      });
    }

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      const current = ACTION_CATEGORIES.find((c) => c.type === selectedAction);
      if (current && onNavigate) {
        onNavigate(current.section);
      }
    }, 900);
  };

  const activeCategory = ACTION_CATEGORIES.find((c) => c.type === selectedAction);

  return (
    <>
      {lateriteModalOpen && (
        <LateriteStoneOrderModal
          isOpen={lateriteModalOpen}
          onClose={() => setLateriteModalOpen(false)}
          onSuccess={(orderId) => {
            if (onNavigate) onNavigate('building-materials-ecommerce');
          }}
        />
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6">
            {/* Header */}
            <div className="bg-slate-950 p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Global Quick Action Center</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold uppercase">
                      18 Triggers
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Instant creation triggers synchronized across all 10 primary RZ® Minetrix platforms.
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Action Buttons Grid */}
            <div className="p-4 bg-slate-950/50 border-b border-slate-800/80">
              <div className="text-[11px] font-bold text-slate-400 mb-2 uppercase font-mono">
                Select Action:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 max-h-48 overflow-y-auto pr-1">
                {ACTION_CATEGORIES.map((act) => {
                  const Icon = act.icon;
                  const isSelected = selectedAction === act.type;
                  return (
                    <button
                      key={act.type}
                      type="button"
                      onClick={() => handleActionSelect(act.type)}
                      className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition text-left cursor-pointer ${
                        act.isFeatured
                          ? 'border-amber-400 bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/40'
                          : isSelected
                          ? 'border-amber-400 bg-amber-500 text-slate-950 font-bold'
                          : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{act.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-3">
              {isSuccess ? (
                <div className="py-8 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">Record Successfully Created!</h4>
                  <p className="text-xs text-slate-400">
                    Synchronized with RZ® OTT and routing to target platform...
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>
                      Creating: <strong className="text-amber-400">{activeCategory?.label}</strong>
                    </span>
                    <span className="font-mono text-[11px]">{formData.referenceCode}</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Title / Subject</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder={`e.g. New ${activeCategory?.label} Entry`}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Person</label>
                      <input
                        type="text"
                        value={formData.assignedTo}
                        onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
                      <input
                        type="date"
                        value={formData.targetDate}
                        onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Details & Remarks</label>
                    <textarea
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Add operational notes or specific parameters..."
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:text-white transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-amber-500 text-xs font-black text-slate-950 hover:bg-amber-400 transition shadow-md shadow-amber-500/20"
                    >
                      Create & Synchronize
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};
