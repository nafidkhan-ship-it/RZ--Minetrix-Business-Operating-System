import React from 'react';
import {
  X,
  Layers,
  Pickaxe,
  Building2,
  Truck,
  GitFork,
  ShoppingBag,
  Landmark,
  MessageSquare,
  Clock,
  Calculator,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { SectionId } from '../../types/architecture';

interface PlatformSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: SectionId;
  onNavigateSection: (sectionId: SectionId) => void;
}

export const PLATFORMS_LIST: {
  id: SectionId;
  number: string;
  name: string;
  category: string;
  subtitle: string;
  route: string;
  tag?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}[] = [
  {
    id: 'quarry-management',
    number: '01',
    name: 'Quarry Management',
    category: 'Business Operations',
    subtitle: 'Pithead extraction, land parcels, daily blasting & gate pass dispatch',
    route: '/quarry',
    icon: Pickaxe,
    color: 'text-amber-400'
  },
  {
    id: 'crusher-management',
    number: '02',
    name: 'Crusher Management',
    category: 'Business Operations',
    subtitle: 'Boulder intake, aggregate processing (20mm, 10mm, M-Sand) & silos',
    route: '/crusher',
    icon: Building2,
    color: 'text-cyan-400'
  },
  {
    id: 'vehicle-management',
    number: '03',
    name: 'Vehicle Management',
    category: 'Business Operations',
    subtitle: 'Heavy multi-axle tippers, live GPS telematics, driver batta & trips',
    route: '/vehicle',
    icon: Truck,
    color: 'text-blue-400'
  },
  {
    id: 'contract-job-management',
    number: '04',
    name: 'Contract & Job Management',
    category: 'Business Operations',
    subtitle: 'Civil earthmoving work orders, subcontractor bills & progress MB',
    route: '/jobs',
    icon: GitFork,
    color: 'text-emerald-400'
  },
  {
    id: 'building-materials-ecommerce',
    number: '05',
    name: 'Building Materials E-Commerce',
    category: 'Marketplace & Commerce',
    subtitle: 'Direct trade in dressed laterite stone, aggregates, M-Sand & blocks',
    route: '/commerce',
    tag: 'Priority Laterite Order',
    icon: ShoppingBag,
    color: 'text-amber-400'
  },
  {
    id: 'used-machinery-marketplace',
    number: '06',
    name: 'Used Machinery & Vehicle Marketplace',
    category: 'Marketplace & Commerce',
    subtitle: 'Certified excavators, wheel loaders, crushers & tipper exchanges',
    route: '/marketplace',
    icon: Truck,
    color: 'text-purple-400'
  },
  {
    id: 'quarry-land-management',
    number: '07',
    name: 'Quarry Land Management',
    category: 'Marketplace & Commerce',
    subtitle: 'Mining lease deeds, mineral land parcels, survey boundaries & titles',
    route: '/land',
    icon: Landmark,
    color: 'text-indigo-400'
  },
  {
    id: 'rz-chating',
    number: '08',
    name: 'RZ® Chat',
    category: 'Digital Platform',
    subtitle: 'Universal messaging, group dispatch channels, reels & OTT bridge',
    route: '/chat',
    icon: MessageSquare,
    color: 'text-emerald-400'
  },
  {
    id: 'rz-ott',
    number: '09',
    name: 'RZ® OTT',
    category: 'Digital Platform',
    subtitle: 'Organise Today & Tomorrow — Universal task planner & reminders',
    route: '/ott',
    tag: 'Universal OS',
    icon: Clock,
    color: 'text-amber-400'
  },
  {
    id: 'rz-calculator',
    number: '10',
    name: 'RZ® Calculator — FREE',
    category: 'Digital Platform',
    subtitle: 'Free engineering, GST, financial, vehicle trip & pit math utility',
    route: '/calculator',
    tag: '100% FREE',
    icon: Calculator,
    color: 'text-emerald-400'
  }
];

export const PlatformSwitcherModal: React.FC<PlatformSwitcherModalProps> = ({
  isOpen,
  onClose,
  activeSection,
  onNavigateSection
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                Section Z &bull; All 10 Platforms
              </span>
              <span className="text-[9px] font-mono text-emerald-400 font-bold">10/10 Ready</span>
            </div>
            <h3 className="text-xl font-black text-white mt-1 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>RZ® Minetrix Platform Switcher</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any of the 10 official platforms to immediately jump to its primary command dashboard.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 10 Platforms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto pr-1 flex-1">
          {PLATFORMS_LIST.map((platform) => {
            const Icon = platform.icon;
            const isCurrent = activeSection === platform.id;

            return (
              <button
                key={platform.id}
                onClick={() => {
                  onNavigateSection(platform.id);
                  onClose();
                }}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer flex items-start justify-between gap-3 group ${
                  isCurrent
                    ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                    : 'bg-slate-950/70 border-slate-800 hover:border-amber-500/40 hover:bg-slate-950 text-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-3 rounded-xl bg-slate-900 border border-slate-800 ${platform.color} group-hover:scale-105 transition-transform shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-black text-amber-400 px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/20">
                        {platform.number}
                      </span>
                      <h4 className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">
                        {platform.name}
                      </h4>
                      {platform.tag && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase bg-emerald-500/20 text-emerald-400">
                          {platform.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {platform.subtitle}
                    </p>
                    <div className="text-[9px] font-mono text-purple-400 mt-2 uppercase">
                      {platform.category} &bull; {platform.route}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 mt-1">
                  <ArrowRight className={`w-4 h-4 transition-all ${
                    isCurrent ? 'text-amber-400' : 'text-slate-600 group-hover:text-amber-400 group-hover:translate-x-1'
                  }`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
