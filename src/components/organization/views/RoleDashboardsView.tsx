import React, { useState } from 'react';
import {
  Shield,
  Layers,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Sparkles,
  MessageSquare,
  Activity,
  Zap,
  Clock,
  Send,
  Eye,
  Check
} from 'lucide-react';
import { ALL_24_ROLES_CATALOG } from '../data/orgDemoData';
import { Role24 } from '../types';

interface RoleDashboardsViewProps {
  initialRole?: Role24;
  onOpenChat?: () => void;
  onOpenOttTask?: (task: string) => void;
}

export const RoleDashboardsView: React.FC<RoleDashboardsViewProps> = ({
  initialRole = 'OWNER',
  onOpenChat,
  onOpenOttTask
}) => {
  const [selectedRole, setSelectedRole] = useState<Role24>(initialRole);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const roleDef = ALL_24_ROLES_CATALOG.find(r => r.id === selectedRole) || ALL_24_ROLES_CATALOG[1];

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold">
              ROLE DASHBOARD SUITE &bull; ALL 24 ROLES SUPPORTED
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
              Studio Preview / Demo Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-400" />
            <span>Role-Specific Experience Preview</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Experience the custom dashboard layout, quick action widgets, and KPI tiles tailored specifically for each of the 24 ecosystem positions.
          </p>
        </div>

        {/* 24 Role Quick Selector Dropdown */}
        <div className="w-full md:w-auto">
          <label className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1">Select 1 of 24 Roles</label>
          <select
            value={selectedRole}
            onChange={e => setSelectedRole(e.target.value as Role24)}
            className="w-full md:w-64 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-bold focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            {ALL_24_ROLES_CATALOG.map(r => (
              <option key={r.id} value={r.id}>
                {r.number}. {r.title} ({r.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 24 Roles Fast Pill Switcher */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Quick Role Navigation Strip</span>
          <span className="text-[10px] font-mono text-amber-400 font-bold">Selected: #{roleDef.number} {roleDef.title}</span>
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
          {ALL_24_ROLES_CATALOG.map(r => (
            <button
              key={r.id}
              onClick={() => setSelectedRole(r.id)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold transition cursor-pointer border ${
                selectedRole === r.id
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span>{r.number}. {r.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Role Preview Card & Dashboard Display */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        {/* Role Identity Card */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold text-[10px] font-mono uppercase">
                {roleDef.category} Category
              </span>
              <span className="text-xs font-mono text-slate-400">Position #{roleDef.number} of 24</span>
            </div>
            <h3 className="text-2xl font-black text-white mt-1">{roleDef.title}</h3>
            <p className="text-xs text-slate-300 max-w-2xl mt-0.5">{roleDef.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onOpenChat?.()}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>RZ® Chat</span>
            </button>
            <button
              onClick={() => onOpenOttTask?.(`Action item dispatched for ${roleDef.title}`)}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create OTT Task</span>
            </button>
          </div>
        </div>

        {/* Custom Dashboard Widgets for this Role */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Assigned Role Widgets &amp; Live Feeds</span>
            </h4>
            <span className="text-[10px] font-mono text-slate-500">Auto-configured for {roleDef.title}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {roleDef.dashboardWidgets.map((widgetName, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="uppercase">Widget #{idx + 1}</span>
                    <span className="text-emerald-400 font-bold">ONLINE</span>
                  </div>
                  <h5 className="font-bold text-white text-sm mt-1">{widgetName}</h5>
                  <p className="text-xs text-slate-400 mt-1">
                    Real-time streaming telemetry and executable actions authorized for {roleDef.title}.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono text-amber-400">Interactive Preview</span>
                  <button
                    onClick={() => showToast(`Executed action in widget: ${widgetName}`)}
                    className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Interact</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Permissions & Module Access Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
              Core Modules Accessible:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {roleDef.coreModules.map((m, mIdx) => (
                <span key={mIdx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-white font-mono text-[11px]">
                  {m}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
              Authorized Action Verbs:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {roleDef.defaultPermissions.map((p, pIdx) => (
                <span key={pIdx} className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-[11px]">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
