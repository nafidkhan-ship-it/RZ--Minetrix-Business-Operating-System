import React, { useState } from 'react';
import {
  Home,
  Layers,
  MessageSquare,
  Clock,
  MoreHorizontal,
  X,
  Building2,
  DollarSign,
  Users,
  CreditCard,
  Calculator,
  Sliders,
  Sparkles,
  ShoppingBag,
  Pickaxe
} from 'lucide-react';
import { SectionId } from '../../types/architecture';

interface MobileBottomNavProps {
  activeSection: SectionId;
  onNavigateSection: (sectionId: SectionId) => void;
  onOpenLateriteModal?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeSection,
  onNavigateSection,
  onOpenLateriteModal
}) => {
  const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false);

  const isHomeActive = activeSection === 'universal-dashboard';
  const isPlatformsActive = [
    'quarry-management',
    'crusher-management',
    'vehicle-management',
    'contract-job-management',
    'building-materials-ecommerce',
    'used-machinery-marketplace',
    'quarry-land-management'
  ].includes(activeSection);
  const isChatActive = activeSection === 'rz-chating' || activeSection === 'rz-chat-phase29';
  const isOttActive = activeSection === 'rz-ott' || activeSection === 'ott-platform';

  const moreItems: {
    id: SectionId;
    label: string;
    sublabel: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }[] = [
    {
      id: 'shared-erp-core',
      label: 'Shared ERP Core',
      sublabel: 'Master Data, Sales, Purchase & Inventory',
      icon: Building2,
      color: 'text-amber-400'
    },
    {
      id: 'shared-erp-finance',
      label: 'Finance & Accounts',
      sublabel: '10 Ledgers, Bank/Cash, Debtors & Creditors',
      icon: DollarSign,
      color: 'text-emerald-400'
    },
    {
      id: 'shared-erp-organization',
      label: 'Organization Engine',
      sublabel: 'Company Profile, Branches & Operating Sites',
      icon: Building2,
      color: 'text-blue-400'
    },
    {
      id: 'shared-erp-organization',
      label: 'Staff & RBAC',
      sublabel: '24 Ecosystem Roles & 9 Permission Levels',
      icon: Users,
      color: 'text-purple-400'
    },
    {
      id: 'billing-subscription',
      label: 'Subscription & Quotas',
      sublabel: 'Enterprise BOS Tiers & Capacity Meters',
      icon: CreditCard,
      color: 'text-cyan-400'
    },
    {
      id: 'rz-productivity-suite',
      label: 'Productivity Suite',
      sublabel: 'Sheet, Word, Form, Slide, Drive, PDF & Print',
      icon: Layers,
      color: 'text-orange-400'
    },
    {
      id: 'rz-calculator',
      label: 'RZ® Calculator',
      sublabel: 'Free Public Business & Quarry Math Utility',
      icon: Calculator,
      color: 'text-amber-400'
    },
    {
      id: 'shared-erp-organization',
      label: 'Settings & Audit',
      sublabel: 'Branding Studio, Tax Defaults & Audit Logs',
      icon: Sliders,
      color: 'text-slate-400'
    }
  ];

  return (
    <>
      {/* Fixed Bottom Tab Bar on Mobile & Tablet */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 text-slate-300 py-1.5 px-3 flex items-center justify-around shadow-2xl safe-area-pb">
        {/* 1. Home */}
        <button
          onClick={() => onNavigateSection('universal-dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition cursor-pointer ${
            isHomeActive ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px]">Home</span>
        </button>

        {/* 2. Platforms */}
        <button
          onClick={() => onNavigateSection('quarry-management')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition cursor-pointer ${
            isPlatformsActive ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Pickaxe className="w-4 h-4" />
          <span className="text-[10px]">Platforms</span>
        </button>

        {/* 3. Chat */}
        <button
          onClick={() => onNavigateSection('rz-chating')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition cursor-pointer ${
            isChatActive ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span className="text-[10px]">Chat</span>
        </button>

        {/* 4. OTT */}
        <button
          onClick={() => onNavigateSection('rz-ott')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition cursor-pointer ${
            isOttActive ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span className="text-[10px]">OTT</span>
        </button>

        {/* 5. More */}
        <button
          onClick={() => setIsMoreSheetOpen(true)}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition cursor-pointer ${
            isMoreSheetOpen ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <MoreHorizontal className="w-4 h-4" />
          <span className="text-[10px]">More</span>
        </button>
      </div>

      {/* "More" Slide-up Sheet */}
      {isMoreSheetOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col justify-end animate-in fade-in">
          <div
            className="flex-1"
            onClick={() => setIsMoreSheetOpen(false)}
          />
          <div className="bg-slate-900 border-t border-slate-800 rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto space-y-4 shadow-2xl animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                  Extended Ecosystem
                </span>
                <h4 className="text-base font-black text-white">More Modules & Services</h4>
              </div>
              <button
                onClick={() => setIsMoreSheetOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action: ORDER LATERITE */}
            {onOpenLateriteModal && (
              <button
                onClick={() => {
                  setIsMoreSheetOpen(false);
                  onOpenLateriteModal();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ORDER LATERITE STONE NOW</span>
              </button>
            )}

            {/* Grid of More Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {moreItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      onNavigateSection(item.id);
                      setIsMoreSheetOpen(false);
                    }}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 text-left transition cursor-pointer flex items-start gap-3"
                  >
                    <div className={`p-2 rounded-xl bg-slate-900 border border-slate-800 ${item.color} shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs">{item.label}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">{item.sublabel}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
