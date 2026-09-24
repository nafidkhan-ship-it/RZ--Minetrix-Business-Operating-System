import React, { useState } from 'react';
import {
  Plus,
  X,
  Pickaxe,
  Building2,
  Truck,
  GitFork,
  ShoppingBag,
  Package,
  Users,
  Clock,
  DollarSign,
  FileText,
  Shield,
  ArrowRight,
  Zap
} from 'lucide-react';
import { GLOBAL_QUICK_ACTIONS } from './routeRegistry';
import { QuickActionItem } from './types';

interface GlobalQuickActionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: QuickActionItem) => void;
}

export const GlobalQuickActionsMenu: React.FC<GlobalQuickActionsMenuProps> = ({
  isOpen,
  onClose,
  onSelectAction
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  if (!isOpen) return null;

  const categories = ['ALL', 'Operations', 'Fleet & Commerce', 'Financial', 'Workforce'];

  const filteredActions = selectedCategory === 'ALL'
    ? GLOBAL_QUICK_ACTIONS
    : GLOBAL_QUICK_ACTIONS.filter(a => a.category === selectedCategory);

  const getActionIcon = (iconName: string) => {
    switch (iconName) {
      case 'Pickaxe': return Pickaxe;
      case 'Building2': return Building2;
      case 'Truck': return Truck;
      case 'GitFork': return GitFork;
      case 'ShoppingBag': return ShoppingBag;
      case 'Package': return Package;
      case 'Users': return Users;
      case 'Clock': return Clock;
      case 'DollarSign': return DollarSign;
      case 'FileText': return FileText;
      case 'Shield': return Shield;
      default: return Plus;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                Section AB &bull; 12 Global Actions
              </span>
              <span className="text-[9px] font-mono text-purple-400">Contextual Dispatch</span>
            </div>
            <h3 className="text-xl font-black text-white mt-1 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Universal Quick Actions</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Rapidly trigger core business records, registrations, work orders and bookings from any screen.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Action Grid (All 12 Specified Global Actions) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {filteredActions.map(action => {
            const Icon = getActionIcon(action.icon);
            return (
              <button
                key={action.id}
                onClick={() => {
                  onSelectAction(action);
                  onClose();
                }}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-amber-500/50 hover:bg-slate-850 text-left transition cursor-pointer group flex items-start justify-between gap-3 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs group-hover:text-amber-300 transition-colors">
                      {action.title}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 leading-snug">
                      {action.subtitle}
                    </div>
                    <div className="text-[9px] font-mono text-purple-400 mt-1 uppercase">
                      {action.category} &bull; {action.targetPath}
                    </div>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
