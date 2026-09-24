import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Users,
  Layers,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
  Phone,
  Mail
} from 'lucide-react';
import { DEMO_BRANCHES, DEMO_SITES } from '../data/orgDemoData';
import { Branch, OperatingSite, OperatingSiteType } from '../types';

interface BranchesSitesViewProps {
  onOpenAddBranch: () => void;
  onOpenAddSite: () => void;
}

export const BranchesSitesView: React.FC<BranchesSitesViewProps> = ({
  onOpenAddBranch,
  onOpenAddSite
}) => {
  const [activeTab, setActiveTab] = useState<'branches' | 'sites'>('branches');
  const [branches, setBranches] = useState<Branch[]>(DEMO_BRANCHES);
  const [sites, setSites] = useState<OperatingSite[]>(DEMO_SITES);
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('ALL');
  const [selectedSiteTypeFilter, setSelectedSiteTypeFilter] = useState<string>('ALL');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const toggleBranchStatus = (branchId: string) => {
    setBranches(prev => prev.map(b => {
      if (b.id === branchId) {
        const nextStatus = b.status === 'Active' ? 'Suspended' : 'Active';
        showToast(`Branch ${b.name} is now ${nextStatus}`);
        return { ...b, status: nextStatus };
      }
      return b;
    }));
  };

  const filteredSites = sites.filter(s => {
    const matchesBranch = selectedBranchFilter === 'ALL' || s.branchId === selectedBranchFilter;
    const matchesType = selectedSiteTypeFilter === 'ALL' || s.type === selectedSiteTypeFilter;
    return matchesBranch && matchesType;
  });

  const SITE_TYPES: OperatingSiteType[] = [
    'Quarry', 'Crusher', 'Warehouse', 'Yard', 'Office', 'Workshop', 'Other'
  ];

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
              MULTI-TENANT HIERARCHY &bull; PHYSICAL HUBS
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
              Studio Preview / Demo Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-purple-400" />
            <span>Branches &amp; Operating Mining Sites</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Single application engine managing multi-branch jurisdiction, quarry extraction faces, crushing plants, stockyard silos, and maintenance workshops.
          </p>
        </div>

        {/* Tab Toggle & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('branches')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'branches'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Branches ({branches.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('sites')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'sites'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Mining Sites ({sites.length})</span>
            </button>
          </div>

          <button
            onClick={activeTab === 'branches' ? onOpenAddBranch : onOpenAddSite}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-purple-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>{activeTab === 'branches' ? '+ Add Branch' : '+ Add Mining Site'}</span>
          </button>
        </div>
      </div>

      {/* 1. BRANCHES VIEW */}
      {activeTab === 'branches' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {branches.map(br => {
            const connectedSites = sites.filter(s => s.branchId === br.id);
            return (
              <div
                key={br.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                      br.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {br.status}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{br.code}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-base">{br.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{br.address}</p>
                    <div className="text-[11px] text-amber-400 font-mono mt-0.5">{br.district}, {br.state}</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Regional Manager:</span>
                      <strong className="text-white">{br.manager}</strong>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Telephone:</span>
                      <span className="font-mono text-slate-300">{br.phone}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Email:</span>
                      <span className="font-mono text-cyan-400">{br.email}</span>
                    </div>
                  </div>

                  {/* Connected Operating Locations Preview */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                      Connected Operating Sites ({connectedSites.length})
                    </span>
                    <div className="space-y-1">
                      {connectedSites.map(s => (
                        <div key={s.id} className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] flex items-center justify-between">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                            <span className="text-slate-200 truncate">{s.name}</span>
                          </div>
                          <span className="text-[9px] font-mono text-slate-400">{s.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                  <button
                    onClick={() => toggleBranchStatus(br.id)}
                    className={`text-xs font-bold transition cursor-pointer ${
                      br.status === 'Active' ? 'text-red-400 hover:text-red-300' : 'text-emerald-400 hover:text-emerald-300'
                    }`}
                  >
                    {br.status === 'Active' ? 'Suspend Branch' : 'Activate Branch'}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => showToast(`Edit Branch: ${br.name}`)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. MINING SITES & OPERATING LOCATIONS */}
      {activeTab === 'sites' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 font-bold">Filter by Branch:</span>
              <select
                value={selectedBranchFilter}
                onChange={e => setSelectedBranchFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="ALL">All Branches</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>

              <span className="text-slate-400 font-bold ml-2">Type:</span>
              <select
                value={selectedSiteTypeFilter}
                onChange={e => setSelectedSiteTypeFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="ALL">All Site Types</option>
                {SITE_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <span className="text-slate-400 font-mono text-[11px]">
              Showing {filteredSites.length} of {sites.length} operating locations
            </span>
          </div>

          {/* Sites Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSites.map(site => (
              <div
                key={site.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 font-bold border border-purple-500/20">
                      {site.type}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">{site.status}</span>
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-sm">{site.name}</h4>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-blue-400 shrink-0" />
                      <span>{site.location}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Parent Branch:</span>
                      <strong className="text-white truncate max-w-[140px]">{site.branchName.split('&')[0]}</strong>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Site In-Charge:</span>
                      <strong className="text-cyan-400">{site.manager}</strong>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Rated Capacity:</span>
                      <strong className="text-amber-400 font-mono">{site.capacity}</strong>
                    </div>
                  </div>

                  {/* Connected Platform linkage */}
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400">Connected System:</span>
                    <span className="text-emerald-400 font-bold">{site.connectedPlatform}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <button
                    onClick={() => showToast(`Edit Site parameters: ${site.name}`)}
                    className="text-slate-400 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit className="w-3 h-3" />
                    <span>Configure</span>
                  </button>

                  <button
                    onClick={() => showToast(`Jump to ${site.connectedPlatform}`)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Open Hub</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
