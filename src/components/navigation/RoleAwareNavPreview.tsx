import React, { useState } from 'react';
import {
  UserCheck,
  ChevronRight,
  Shield,
  Briefcase,
  Truck,
  DollarSign,
  ShoppingBag,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ROLE_NAVIGATION_PRESETS } from './routeRegistry';
import { DemoRole } from './types';

interface RoleAwareNavPreviewProps {
  onNavigatePath: (path: string) => void;
  currentRole?: DemoRole;
  onSelectRole?: (role: DemoRole) => void;
}

export const RoleAwareNavPreview: React.FC<RoleAwareNavPreviewProps> = ({
  onNavigatePath,
  currentRole: propRole,
  onSelectRole
}) => {
  const [activeRole, setActiveRole] = useState<DemoRole>(propRole || 'OWNER');

  const handleRoleChange = (role: DemoRole) => {
    setActiveRole(role);
    if (onSelectRole) onSelectRole(role);
  };

  const selectedPreset = ROLE_NAVIGATION_PRESETS.find(p => p.role === activeRole) || ROLE_NAVIGATION_PRESETS[0];

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 rounded-3xl p-4 md:p-5 mb-6 shadow-xl space-y-4">
      {/* Top Bar: Explainer + Role Toggle Pills */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                Section AA &bull; Role-Aware Navigation Preview
              </span>
              <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[9px] font-mono text-emerald-400 font-bold">
                Studio Preview
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">
              Persona-Tailored Route Experience
            </h3>
          </div>
        </div>

        {/* 4 Demo Roles Switcher */}
        <div className="flex items-center flex-wrap gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
          {ROLE_NAVIGATION_PRESETS.map((preset) => {
            const isSelected = activeRole === preset.role;
            return (
              <button
                key={preset.role}
                onClick={() => handleRoleChange(preset.role)}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{preset.role}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Role Details and Tailored Featured Routes */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-white font-black text-sm">{selectedPreset.title}</span>
            <span className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-mono">
              {selectedPreset.badge}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {selectedPreset.description}
          </p>
        </div>

        {/* Featured Route Badges */}
        <div className="flex items-center flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
          {selectedPreset.featuredRoutes.map((route, rIdx) => (
            <button
              key={rIdx}
              onClick={() => onNavigatePath(route.path)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 hover:border-amber-500/50 text-xs font-semibold transition cursor-pointer group shadow-sm"
            >
              <span>{route.label}</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-900 text-amber-400 font-mono">
                {route.tag}
              </span>
              <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
