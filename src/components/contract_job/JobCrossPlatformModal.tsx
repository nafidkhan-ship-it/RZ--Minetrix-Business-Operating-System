import React from 'react';
import {
  Layers,
  ArrowRight,
  Pickaxe,
  Building2,
  Truck,
  MessageSquare,
  CalendarCheck,
  Search,
  Bell,
  CheckCircle2,
  X
} from 'lucide-react';

interface JobCrossPlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigatePlatform: (platformId: number) => void;
}

export const JobCrossPlatformModal: React.FC<JobCrossPlatformModalProps> = ({
  isOpen,
  onClose,
  onNavigatePlatform
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 w-full max-w-3xl max-h-[92vh] overflow-y-auto space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Cross-Platform Integration Architecture</h2>
              <div className="text-xs text-slate-400">
                RZ® MINETRIX Unified Quad-Platform Operational Fabric
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

        {/* 3 Core Connected Platforms */}
        <div className="space-y-4">
          {/* Platform 1 */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Pickaxe className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                  Platform 01
                </span>
                <h3 className="text-sm font-bold text-white">Quarry Management</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pit yield extraction, explosive magazines, blasting contractors, bench elevations, and statutory mining lease compliance.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onNavigatePlatform(1);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold text-xs transition border border-emerald-500/30 flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>Open Platform 1</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Platform 2 */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
                  Platform 02
                </span>
                <h3 className="text-sm font-bold text-white">Crusher Management</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Aggregates sizing (10mm, 20mm, 40mm, GSB, VSI M-sand), stockpile batch reservations, and weighbridge terminal dispatch.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onNavigatePlatform(2);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-bold text-xs transition border border-cyan-500/30 flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>Open Platform 2</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Platform 3 */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                  Platform 03
                </span>
                <h3 className="text-sm font-bold text-white">Vehicle & Fleet Management</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Dedicated tipper allocations, driver rosters, trip tracking, diesel slip logs, and automated machinery costing.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onNavigatePlatform(3);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs transition border border-amber-500/30 flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>Open Platform 3</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Global Ecosystem Strip */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
            RZ® Ecosystem Shared Services
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 bg-slate-900 rounded-xl flex items-center gap-2 text-slate-300">
              <MessageSquare className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>RZ Chat Real-Time Hub</span>
            </div>
            <div className="p-2.5 bg-slate-900 rounded-xl flex items-center gap-2 text-slate-300">
              <CalendarCheck className="w-4 h-4 text-purple-400 shrink-0" />
              <span>RZ OTT Task Manager</span>
            </div>
            <div className="p-2.5 bg-slate-900 rounded-xl flex items-center gap-2 text-slate-300">
              <Search className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Global Entity Search</span>
            </div>
            <div className="p-2.5 bg-slate-900 rounded-xl flex items-center gap-2 text-slate-300">
              <Bell className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Unified Notifications</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
