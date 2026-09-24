import React, { useState } from 'react';
import {
  Building2,
  ChevronDown,
  Check,
  MapPin,
  Layers,
  ArrowRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { DEMO_BRANCHES, DEMO_SITES } from './data/orgDemoData';

interface WorkspaceSwitcherProps {
  currentWorkspace: {
    branchId: string;
    branchName: string;
    siteId?: string;
    siteName?: string;
  };
  onSwitchWorkspace: (branchId: string, siteId?: string) => void;
}

export const WorkspaceSwitcher: React.FC<WorkspaceSwitcherProps> = ({
  currentWorkspace,
  onSwitchWorkspace
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedBranch = DEMO_BRANCHES.find(b => b.id === currentWorkspace.branchId) || DEMO_BRANCHES[0];
  const selectedSite = currentWorkspace.siteId
    ? DEMO_SITES.find(s => s.id === currentWorkspace.siteId)
    : null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-left transition cursor-pointer shadow-md group"
      >
        <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
          <Building2 className="w-4 h-4" />
        </div>

        <div className="min-w-0 pr-1">
          <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase text-slate-400 font-bold">
            <span>Workspace</span>
            <span className="text-amber-400">&bull;</span>
            <span className="text-amber-400 font-bold truncate">{selectedBranch.name.split('&')[0]}</span>
          </div>
          <div className="text-xs font-bold text-white truncate max-w-[190px]">
            {selectedSite ? selectedSite.name : 'All Operational Sites'}
          </div>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Switcher Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl z-50 space-y-3 font-sans text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <div className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                Enterprise Multi-Branch Context
              </div>
              <div className="font-bold text-white text-xs">Switch Operating Scope</div>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
              Single App Engine
            </span>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {DEMO_BRANCHES.map(branch => {
              const isBranchActive = branch.id === currentWorkspace.branchId && !currentWorkspace.siteId;
              const branchSites = DEMO_SITES.filter(s => s.branchId === branch.id);

              return (
                <div key={branch.id} className="rounded-2xl bg-slate-950 border border-slate-800/80 p-2.5 space-y-1.5">
                  <div
                    onClick={() => {
                      onSwitchWorkspace(branch.id, undefined);
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-between cursor-pointer p-1 rounded-lg hover:bg-slate-900 transition"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <div>
                        <div className="font-bold text-white text-[11px]">{branch.name}</div>
                        <div className="text-[9px] font-mono text-slate-400">{branch.code} &bull; {branch.state}</div>
                      </div>
                    </div>
                    {isBranchActive && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </div>

                  {/* Connected Mining Sites under this Branch */}
                  <div className="pl-5 space-y-1 border-l border-slate-800 ml-2">
                    {branchSites.map(site => {
                      const isSiteActive = currentWorkspace.siteId === site.id;
                      return (
                        <div
                          key={site.id}
                          onClick={() => {
                            onSwitchWorkspace(branch.id, site.id);
                            setIsOpen(false);
                          }}
                          className={`p-1.5 rounded-lg flex items-center justify-between text-[11px] cursor-pointer transition ${
                            isSiteActive
                              ? 'bg-amber-500/20 text-white font-bold'
                              : 'text-slate-400 hover:text-white hover:bg-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                            <span className="truncate">{site.name}</span>
                          </div>
                          {isSiteActive && <Check className="w-3 h-3 text-amber-400" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Current: {selectedBranch.code}</span>
            <span className="text-amber-400">Unified DB Isolation</span>
          </div>
        </div>
      )}
    </div>
  );
};
