import React, { useState } from 'react';
import {
  Shield,
  Layers,
  CheckCircle2,
  Lock,
  Plus,
  Edit,
  Eye,
  Copy,
  Users,
  Search,
  Filter,
  ArrowRight,
  Check,
  X,
  Sliders,
  ChevronDown
} from 'lucide-react';
import {
  ALL_24_ROLES_CATALOG,
  ALL_MODULES_LIST,
  PERMISSION_TYPES_LIST
} from '../data/orgDemoData';
import { Role24, PermissionAction } from '../types';

interface RbacRoleDirectoryViewProps {
  onSelectRoleForDashboard?: (role: Role24) => void;
}

export const RbacRoleDirectoryView: React.FC<RbacRoleDirectoryViewProps> = ({
  onSelectRoleForDashboard
}) => {
  const [activeTab, setActiveTab] = useState<'roles' | 'matrix' | 'engine' | 'modules'>('roles');
  const [selectedRole, setSelectedRole] = useState<Role24>('ACCOUNTANT');
  const [searchRole, setSearchRole] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Configurable Permission Matrix State
  const [permissionMatrix, setPermissionMatrix] = useState<Record<string, Record<PermissionAction, boolean>>>({
    'Quarry Management': { View: true, Create: true, Edit: true, Delete: false, Approve: true, Export: true, Print: true, Calculate: true, Manage: true },
    'Crusher Management': { View: true, Create: true, Edit: true, Delete: false, Approve: true, Export: true, Print: true, Calculate: true, Manage: true },
    'Vehicle Management': { View: true, Create: true, Edit: true, Delete: false, Approve: true, Export: true, Print: true, Calculate: true, Manage: true },
    'Contract & Job': { View: true, Create: true, Edit: true, Delete: false, Approve: true, Export: true, Print: true, Calculate: true, Manage: false },
    'Building Materials': { View: true, Create: true, Edit: true, Delete: false, Approve: false, Export: true, Print: true, Calculate: false, Manage: false },
    'Commercial Sales': { View: true, Create: true, Edit: true, Delete: false, Approve: true, Export: true, Print: true, Calculate: true, Manage: false },
    'Procurement & PO': { View: true, Create: true, Edit: true, Delete: false, Approve: true, Export: true, Print: true, Calculate: true, Manage: false },
    'Finance & Ledgers': { View: true, Create: false, Edit: false, Delete: false, Approve: true, Export: true, Print: true, Calculate: true, Manage: true },
    'Staff & Workforce': { View: true, Create: true, Edit: true, Delete: false, Approve: true, Export: true, Print: true, Calculate: true, Manage: false },
    'BI Reports & Vault': { View: true, Create: false, Edit: false, Delete: false, Approve: false, Export: true, Print: true, Calculate: false, Manage: false }
  });

  // Configurable Modules State
  const [modulesState, setModulesState] = useState<Record<string, boolean>>({
    quarry: true,
    crusher: true,
    vehicle: true,
    contract: true,
    materials: true,
    marketplace: true,
    land: true,
    chat: true,
    ott: true,
    calculator: true,
    erp_core: true,
    finance: true,
    workforce: true,
    bi_reports: true
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const toggleMatrixCell = (module: string, action: PermissionAction) => {
    setPermissionMatrix(prev => {
      const current = prev[module]?.[action] ?? false;
      return {
        ...prev,
        [module]: {
          ...prev[module],
          [action]: !current
        }
      };
    });
    showToast(`Updated permission: ${module} -> ${action}`);
  };

  const toggleModule = (id: string, name: string) => {
    setModulesState(prev => {
      const next = !prev[id];
      showToast(`${name} is now ${next ? 'ENABLED' : 'DISABLED'}`);
      return { ...prev, [id]: next };
    });
  };

  const filteredRoles = ALL_24_ROLES_CATALOG.filter(r =>
    r.title.toLowerCase().includes(searchRole.toLowerCase()) ||
    r.id.toLowerCase().includes(searchRole.toLowerCase()) ||
    r.category.toLowerCase().includes(searchRole.toLowerCase())
  );

  const activeRoleDef = ALL_24_ROLES_CATALOG.find(r => r.id === selectedRole) || ALL_24_ROLES_CATALOG[6];

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
              ROLE-BASED ACCESS CONTROL (RBAC) &bull; 24 ROLES &bull; 9 PERMISSION LEVELS
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
              Studio Preview / Demo Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-400" />
            <span>24 Roles &amp; Multi-Tier Permission Engine</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            <strong>Architecture Principle:</strong> RBAC determines what each person can access and do. Granular permissions across the full operational matrix.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              activeTab === 'roles' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            24 Roles Directory
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              activeTab === 'matrix' ? 'bg-amber-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Permission Matrix (9 Types)
          </button>
          <button
            onClick={() => setActiveTab('modules')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              activeTab === 'modules' ? 'bg-emerald-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Module Access
          </button>
          <button
            onClick={() => setActiveTab('engine')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              activeTab === 'engine' ? 'bg-cyan-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Role &rarr; Permission Pipeline
          </button>
        </div>
      </div>

      {/* 1. 24 ROLES DIRECTORY */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchRole}
                onChange={e => setSearchRole(e.target.value)}
                placeholder="Search across all 24 official roles..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <span className="text-slate-400 font-mono text-[11px]">
              24 Defined Roles &bull; Zero Missing Positions
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRoles.map(role => (
              <div
                key={role.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 flex flex-col justify-between hover:border-slate-700 transition"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                      #{role.number} &bull; {role.category}
                    </span>
                    <span className="text-xs font-mono text-cyan-400 font-bold">{role.userCount} Assigned</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-base">{role.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{role.description}</p>
                  </div>

                  {/* Core Modules Authorized */}
                  <div className="space-y-1 pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                      Core Authorized Modules:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {role.coreModules.map((m, mIdx) => (
                        <span key={mIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Default Permissions Verbs */}
                  <div className="space-y-1 pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                      Authorized Permission Verbs ({role.defaultPermissions.length} of 9):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {role.defaultPermissions.map((p, pIdx) => (
                        <span key={pIdx} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      setSelectedRole(role.id);
                      showToast(`Duplicated role template: ${role.title} (Copy)`);
                    }}
                    className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Duplicate</span>
                  </button>

                  <button
                    onClick={() => onSelectRoleForDashboard?.(role.id)}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 transition cursor-pointer shadow-md"
                  >
                    <span>View Role Dashboard</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. PERMISSION MATRIX (9 TYPES X MODULES) */}
      {activeTab === 'matrix' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl space-y-4 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-white text-base">Configurable Enterprise Permission Matrix</h3>
              <p className="text-xs text-slate-400">
                Interactive matrix mapping standard permission levels across operating modules. Click any cell to toggle.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => showToast('Reset permission matrix to corporate defaults')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Reset Defaults
              </button>
              <button
                onClick={() => showToast('Permission matrix policies deployed across all tenant services')}
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer shadow-md"
              >
                Apply Policies
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Operating Module</th>
                  {PERMISSION_TYPES_LIST.map(p => (
                    <th key={p} className="py-3 px-3 text-center">{p}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {Object.keys(permissionMatrix).map((modName) => (
                  <tr key={modName} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">{modName}</td>
                    {PERMISSION_TYPES_LIST.map((action) => {
                      const isAllowed = permissionMatrix[modName]?.[action] ?? false;
                      return (
                        <td key={action} className="py-3 px-3 text-center">
                          <button
                            onClick={() => toggleMatrixCell(modName, action)}
                            className={`w-7 h-7 rounded-lg inline-flex items-center justify-center font-bold text-xs transition cursor-pointer ${
                              isAllowed
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                                : 'bg-slate-950 text-slate-600 border border-slate-800 hover:text-slate-400'
                            }`}
                          >
                            {isAllowed ? '✓' : '—'}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. MODULE ACCESS TOGGLES */}
      {activeTab === 'modules' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-white text-base">Module Access Controls (All 10 Platforms + ERP)</h3>
              <p className="text-xs text-slate-400">
                Interactive preview switches to simulate module enabling/disabling per tenant organization
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">Studio Preview Toggles</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ALL_MODULES_LIST.map(mod => {
              const isEnabled = modulesState[mod.id] ?? true;
              return (
                <div
                  key={mod.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="font-bold text-white text-sm">{mod.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">{mod.category}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      isEnabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {isEnabled ? 'ENABLED' : 'DISABLED'}
                    </span>
                    <button
                      onClick={() => toggleModule(mod.id, mod.name)}
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                        isEnabled ? 'bg-emerald-500' : 'bg-slate-800'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        isEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. ROLE + MODULE + PERMISSION ENGINE EXPLORER */}
      {activeTab === 'engine' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="font-bold text-white text-base">Role &rarr; Module Access &rarr; Permission Pipeline Explorer</h3>
            <p className="text-xs text-slate-400">
              Interactive relationship visualizer explaining how staff users inherit permissions and executable actions
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center text-xs font-mono">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-amber-400 font-bold">1. USER</span>
              <div className="font-bold text-white">Anjali Menon</div>
              <div className="text-[10px] text-slate-500">STF-003</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-purple-400 font-bold">2. ROLE</span>
              <div className="font-bold text-white">ACCOUNTANT</div>
              <div className="text-[10px] text-slate-500">Position #7</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-blue-400 font-bold">3. MODULE ACCESS</span>
              <div className="font-bold text-white">Finance &amp; Ledgers</div>
              <div className="text-[10px] text-slate-500">Commercial Invoicing</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-emerald-400 font-bold">4. PERMISSIONS</span>
              <div className="font-bold text-white">View, Create, Edit</div>
              <div className="text-[10px] text-slate-500">Approve, Export, Print</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-cyan-400 font-bold">5. ACTIONS</span>
              <div className="font-bold text-white">Generate Tax Invoice</div>
              <div className="text-[10px] text-slate-500">Post Creditor Payment</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
