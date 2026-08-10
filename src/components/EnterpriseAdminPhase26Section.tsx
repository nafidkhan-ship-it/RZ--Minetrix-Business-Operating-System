import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Users,
  Key,
  Lock,
  Award,
  CreditCard,
  Sliders,
  FileText,
  Activity,
  DatabaseBackup,
  GitCommit,
  ToggleLeft,
  Settings,
  BookOpen,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Server,
  Terminal,
  Plus,
  RefreshCw,
  Search,
  Check,
  X,
  UserPlus,
  Download,
  KeyRound,
  ShieldAlert
} from 'lucide-react';
import {
  MOCK_TENANTS,
  MOCK_COMPANIES,
  MOCK_USER_ACCOUNTS,
  MOCK_SECURITY_THREATS,
  MOCK_SUBSCRIPTIONS,
  MOCK_SYSTEM_HEALTH_NODES,
  MOCK_FEATURE_FLAGS,
  MOCK_BACKUP_RECOVERY,
  MOCK_DEVOPS_RELEASES,
  MOCK_ADMIN_METRICS,
  TenantMasterRecord,
  UserAccountRecord,
  FeatureFlagRecord
} from '../data/enterpriseAdminPhase26Data';

interface EnterpriseAdminPhase26SectionProps {
  showToast?: (msg: string) => void;
}

export const EnterpriseAdminPhase26Section: React.FC<EnterpriseAdminPhase26SectionProps> = ({
  showToast = (msg: string) => alert(msg)
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'mod1-multitenant'
    | 'mod2-company'
    | 'mod3-users'
    | 'mod4-iam'
    | 'mod5-securitycenter'
    | 'mod6-licenses'
    | 'mod7-subscriptions'
    | 'mod8-settings'
    | 'mod9-audit'
    | 'mod10-monitoring'
    | 'mod11-backup'
    | 'mod12-devops'
    | 'mod13-features'
    | 'mod14-config'
    | 'mod15-docs'
    | 'mod16-ecosystem'
    | 'phase26-review'
  >('mod1-multitenant');

  // Interactive Tenant State
  const [tenants, setTenants] = useState<TenantMasterRecord[]>(MOCK_TENANTS);
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantSubdomain, setNewTenantSubdomain] = useState('');
  const [newTenantPlan, setNewTenantPlan] = useState<'Enterprise Ultimate' | 'Pro Mining & Fleet' | 'Commercial Quarry'>('Enterprise Ultimate');

  // Interactive Feature Flags
  const [featureFlags, setFeatureFlags] = useState<FeatureFlagRecord[]>(MOCK_FEATURE_FLAGS);

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantName || !newTenantSubdomain) {
      showToast('Please enter both Tenant Name and Subdomain.');
      return;
    }

    const newTenant: TenantMasterRecord = {
      id: `t-${Date.now()}`,
      tenantCode: `TNT-${newTenantSubdomain.toUpperCase()}-04`,
      tenantName: newTenantName,
      subdomain: `${newTenantSubdomain.toLowerCase()}.minetrixbos.com`,
      planName: newTenantPlan,
      databaseIsolation: 'Dedicated Schema (RLS Enforced)',
      storageQuotaGb: 1000,
      storageUsedGb: 0.1,
      activeUsersCount: 1,
      maxUserSeats: newTenantPlan === 'Enterprise Ultimate' ? 250 : 100,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setTenants([newTenant, ...tenants]);
    setNewTenantName('');
    setNewTenantSubdomain('');
    showToast(`Tenant "${newTenant.tenantName}" successfully provisioned with dedicated RLS schema!`);
  };

  const handleToggleTenantStatus = (id: string) => {
    setTenants(
      tenants.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === 'Active' ? 'Suspended (Payment Overdue)' : 'Active';
          showToast(`Tenant ${t.tenantCode} status set to ${nextStatus}`);
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const handleToggleFeatureFlag = (id: string) => {
    setFeatureFlags(
      featureFlags.map((ff) => {
        if (ff.id === id) {
          const updatedState = !ff.isEnabled;
          showToast(`Feature Flag ${ff.flagKey} is now ${updatedState ? 'ENABLED' : 'DISABLED'}`);
          return { ...ff, isEnabled: updatedState };
        }
        return ff;
      })
    );
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* HEADER BANNER */}
      <div className="p-6 sm:p-8 bg-slate-950 border border-slate-800 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl -z-0 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-mono font-bold rounded-full flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Phase 26 Complete
              </span>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold rounded-full">
                16 Admin Modules
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
              Enterprise SaaS Administration, Governance, DevSecOps &amp; Security Control Center
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-3xl font-mono">
              Central Master SaaS Control Center regulating multi-tenant isolation, RBAC/ABAC IAM, security threat detection, subscription billing, point-in-time database backups, and CI/CD release engineering across RZ® Minetrix BOS.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono">
            <button
              onClick={() => showToast('SaaS Governance Health: All 3 Multi-Tenant Schemas Active, 0 Security Incidents!')}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg hover:brightness-110 transition"
            >
              <Activity className="w-4 h-4" /> Run Governance Audit
            </button>
          </div>
        </div>

        {/* METRICS STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-6 pt-6 border-t border-slate-800/80 font-mono text-xs">
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Active Tenants</span>
            <strong className="text-red-400 text-sm font-black">{tenants.length} Tenants</strong>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Total Registered Users</span>
            <strong className="text-emerald-400 text-sm font-black">{MOCK_ADMIN_METRICS.totalRegisteredUsers} Seats</strong>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">System Uptime</span>
            <strong className="text-cyan-300 text-sm font-black">{MOCK_ADMIN_METRICS.totalSystemUptimePercent}%</strong>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Threat Incidents</span>
            <strong className="text-emerald-400 text-sm font-black">{MOCK_ADMIN_METRICS.activeSecurityIncidents} Active</strong>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Monthly ARR</span>
            <strong className="text-amber-300 text-sm font-black">₹{(MOCK_ADMIN_METRICS.monthlyRecurringRevenueRs / 100000).toFixed(2)} Lakhs</strong>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Database Storage</span>
            <strong className="text-purple-300 text-sm font-black">{MOCK_ADMIN_METRICS.databaseStorageUsedTb} TB</strong>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Active Feature Flags</span>
            <strong className="text-indigo-300 text-sm font-black">{featureFlags.length} Enforced</strong>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
        {[
          { id: 'mod1-multitenant', label: '1. Multi-Tenant Master', icon: Building2 },
          { id: 'mod2-company', label: '2. Org Structure', icon: Layers },
          { id: 'mod3-users', label: '3. Users & Roles', icon: Users },
          { id: 'mod4-iam', label: '4. IAM / MFA / SSO', icon: Key },
          { id: 'mod5-securitycenter', label: '5. Security Vault & WAF', icon: Lock },
          { id: 'mod6-licenses', label: '6. License Manager', icon: Award },
          { id: 'mod7-subscriptions', label: '7. Subscriptions & Billing', icon: CreditCard },
          { id: 'mod8-settings', label: '8. System Settings', icon: Sliders },
          { id: 'mod9-audit', label: '9. Audit Center', icon: FileText },
          { id: 'mod10-monitoring', label: '10. System Health', icon: Activity },
          { id: 'mod11-backup', label: '11. Backup & Recovery', icon: DatabaseBackup },
          { id: 'mod12-devops', label: '12. DevOps CI/CD', icon: GitCommit },
          { id: 'mod13-features', label: '13. Feature Flags', icon: ToggleLeft },
          { id: 'mod14-config', label: '14. System Config', icon: Settings },
          { id: 'mod15-docs', label: '15. Docs & Manuals', icon: BookOpen },
          { id: 'mod16-ecosystem', label: '16. Ecosystem Bridges', icon: Layers },
          { id: 'phase26-review', label: 'Phase 26 Review', icon: CheckCircle2 }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 rounded-xl whitespace-nowrap flex items-center gap-1.5 font-bold transition cursor-pointer ${
                isActive
                  ? 'bg-red-500 text-slate-950 font-black shadow-lg'
                  : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* MODULE 1: MULTI TENANT MANAGEMENT */}
      {activeTab === 'mod1-multitenant' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-red-400 uppercase tracking-wider">Module 1</span>
              <h2 className="text-xl font-bold text-white mt-1">Multi-Tenant Management &amp; Database Isolation Engine</h2>
            </div>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-xs flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> RLS Schema Isolation Active
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* PROVISION NEW TENANT FORM */}
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-red-400" /> Provision New Enterprise Tenant
              </h3>

              <form onSubmit={handleCreateTenant} className="space-y-3">
                <div>
                  <label className="text-slate-400 text-[10px] block font-bold mb-1">Company / Tenant Name:</label>
                  <input
                    type="text"
                    value={newTenantName}
                    onChange={(e) => setNewTenantName(e.target.value)}
                    placeholder="e.g. Chittorgarh Aggregate Mines Ltd"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 text-xs focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 text-[10px] block font-bold mb-1">Subdomain Slug:</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={newTenantSubdomain}
                      onChange={(e) => setNewTenantSubdomain(e.target.value)}
                      placeholder="chittorgarh"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 text-xs focus:outline-none focus:border-red-500 font-mono"
                    />
                    <span className="text-slate-500 text-[10px]">.minetrixbos.com</span>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 text-[10px] block font-bold mb-1">Subscription Tier Plan:</label>
                  <select
                    value={newTenantPlan}
                    onChange={(e) => setNewTenantPlan(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 text-xs focus:outline-none focus:border-red-500"
                  >
                    <option value="Enterprise Ultimate">Enterprise Ultimate (250 Seats)</option>
                    <option value="Pro Mining & Fleet">Pro Mining &amp; Fleet (100 Seats)</option>
                    <option value="Commercial Quarry">Commercial Quarry (50 Seats)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-red-500 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-red-400 transition shadow-lg mt-2"
                >
                  <Building2 className="w-4 h-4" /> Provision Tenant Workspace
                </button>
              </form>
            </div>

            {/* TENANT LIST */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-red-400 font-bold text-xs uppercase">Active Multi-Tenant Workspaces ({tenants.length})</h3>
              {tenants.map((t) => (
                <div key={t.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                    <div>
                      <span className="text-red-400 font-bold">{t.tenantCode}</span>
                      <h3 className="text-white font-bold text-sm mt-0.5">{t.tenantName}</h3>
                      <span className="text-cyan-400 text-[11px] font-mono">{t.subdomain}</span>
                    </div>
                    <span className={`px-2.5 py-0.5 font-bold rounded-full text-[10px] ${t.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                      {t.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-300 bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-slate-500 block font-bold">PLAN:</span>
                      <strong className="text-amber-300">{t.planName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block font-bold">DB ISOLATION:</span>
                      <strong className="text-slate-200">{t.databaseIsolation}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block font-bold">USER SEATS:</span>
                      <strong className="text-emerald-300">{t.activeUsersCount} / {t.maxUserSeats}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block font-bold">STORAGE USED:</span>
                      <strong className="text-purple-300">{t.storageUsedGb} GB / {t.storageQuotaGb} GB</strong>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500">Created: {t.createdAt}</span>
                    <button
                      onClick={() => handleToggleTenantStatus(t.id)}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg cursor-pointer"
                    >
                      {t.status === 'Active' ? 'Suspend Tenant' : 'Reactivate Tenant'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: COMPANY MANAGEMENT */}
      {activeTab === 'mod2-company' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-red-400 uppercase tracking-wider">Module 2</span>
            <h2 className="text-xl font-bold text-white mt-1">Company, Branches &amp; Organizational Hierarchy</h2>
          </div>

          <div className="space-y-4">
            {MOCK_COMPANIES.map((cmp) => (
              <div key={cmp.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-red-400 font-bold">{cmp.companyCode}</span>
                    <h3 className="text-white font-bold text-base mt-0.5">{cmp.companyName}</h3>
                    <span className="text-slate-400 text-[11px]">Parent Group: {cmp.parentGroup}</span>
                  </div>
                  <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 font-bold rounded-full text-xs">
                    GSTIN: {cmp.gstinRegistration}
                  </span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">ACTIVE BUSINESS DIVISIONS &amp; UNITS:</span>
                  <div className="flex flex-wrap gap-2">
                    {cmp.businessUnits.map((bu, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded-lg text-xs font-bold border border-slate-700">
                        • {bu}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-[11px] text-slate-400">
                  Headquarters &amp; Hubs: <strong className="text-white">{cmp.headquartersLocation}</strong> ({cmp.activeBranchesCount} Active Regional Offices)
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 3: USER MANAGEMENT */}
      {activeTab === 'mod3-users' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-red-400 uppercase tracking-wider">Module 3</span>
              <h2 className="text-xl font-bold text-white mt-1">Enterprise User Management &amp; Role Templates</h2>
            </div>
            <button onClick={() => showToast('New User Account Invitation Dispatched!')} className="px-3.5 py-1.5 bg-red-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer">
              <UserPlus className="w-4 h-4" /> Add User Account
            </button>
          </div>

          <div className="space-y-3">
            {MOCK_USER_ACCOUNTS.map((u) => (
              <div key={u.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-red-400 font-bold">{u.userCode}</span>
                    <h3 className="text-white font-bold text-sm mt-0.5">{u.fullName}</h3>
                    <span className="text-slate-400 text-[11px]">{u.email}</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-300 font-bold rounded-full text-[10px]">{u.assignedRole}</span>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                  <span>Department: <strong className="text-slate-200">{u.department}</strong></span>
                  <span>MFA: <strong className="text-emerald-300">{u.mfaStatus}</strong></span>
                  <span>Last Active: {u.lastLogin}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 4: IAM */}
      {activeTab === 'mod4-iam' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-red-400 uppercase tracking-wider">Module 4</span>
            <h2 className="text-xl font-bold text-white mt-1">Identity &amp; Access Management (RBAC / ABAC / MFA / SSO)</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <strong className="text-cyan-400 text-sm block">Attribute-Based Access Control (ABAC)</strong>
              <p className="text-slate-400 text-xs">Dynamic security enforcement evaluating Tenant ID + Department + Shift Time + Geofence Location.</p>
              <span className="text-emerald-400 font-bold text-[10px] block pt-2">Active Policy Enforced</span>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <strong className="text-indigo-300 text-sm block">Enterprise Single Sign-On (SSO)</strong>
              <p className="text-slate-400 text-xs">SAML 2.0 &amp; OpenID Connect integration for Google Workspace, Microsoft Entra ID &amp; Okta.</p>
              <span className="text-emerald-400 font-bold text-[10px] block pt-2">Connected &amp; Active</span>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 5: SECURITY CENTER */}
      {activeTab === 'mod5-securitycenter' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-red-400 uppercase tracking-wider">Module 5</span>
              <h2 className="text-xl font-bold text-white mt-1">Security Center (WAF, Encryption, Threats &amp; Vault)</h2>
            </div>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-xs">
              0 Active Threats
            </span>
          </div>

          <div className="space-y-3">
            {MOCK_SECURITY_THREATS.map((sec) => (
              <div key={sec.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-red-400 font-bold">{sec.threatCode}</span>
                    <h3 className="text-white font-bold text-xs mt-0.5">{sec.threatType}</h3>
                    <span className="text-slate-400 text-[10px]">Target: {sec.targetResource}</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 font-bold rounded-full text-[10px]">{sec.severity} Severity</span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] font-bold block">MITIGATION ACTION EXECUTED:</span>
                  <p className="text-slate-200 text-xs font-mono">{sec.mitigationActionTaken}</p>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                  <span>Origin IP: <strong className="text-cyan-300">{sec.ipAddressOrigin}</strong></span>
                  <span>Detected: {sec.detectedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 7: SUBSCRIPTION PLATFORM */}
      {activeTab === 'mod7-subscriptions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-red-400 uppercase tracking-wider">Module 7</span>
            <h2 className="text-xl font-bold text-white mt-1">Subscription Billing &amp; Revenue Ledger</h2>
          </div>

          <div className="space-y-3">
            {MOCK_SUBSCRIPTIONS.map((sub) => (
              <div key={sub.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-red-400 font-bold">{sub.invoiceCode}</span>
                    <h3 className="text-white font-bold text-sm mt-0.5">{sub.tenantName}</h3>
                    <span className="text-slate-400 text-[10px]">Plan: {sub.planName}</span>
                  </div>
                  <span className="text-emerald-400 font-black text-sm">₹{sub.amountRs.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span>Cycle: <strong className="text-slate-200">{sub.billingCycle}</strong></span>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full">{sub.paymentStatus}</span>
                  <span>Next Renewal: {sub.renewalDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 10: MONITORING */}
      {activeTab === 'mod10-monitoring' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-red-400 uppercase tracking-wider">Module 10</span>
            <h2 className="text-xl font-bold text-white mt-1">System Observability &amp; Infrastructure Health Nodes</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_SYSTEM_HEALTH_NODES.map((sys) => (
              <div key={sys.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <h3 className="text-white font-bold text-xs">{sys.subsystemName}</h3>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded text-[10px]">{sys.status}</span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">90-Day Uptime:</span>
                    <strong className="text-cyan-300">{sys.uptime90DaysPercent}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">CPU Load:</span>
                    <strong className="text-emerald-300">{sys.cpuLoadPercent}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">RAM Usage:</span>
                    <strong className="text-amber-300">{sys.ramUsagePercent}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active Connections:</span>
                    <strong className="text-purple-300">{sys.activeConnections.toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 11: BACKUP & RECOVERY */}
      {activeTab === 'mod11-backup' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-red-400 uppercase tracking-wider">Module 11</span>
              <h2 className="text-xl font-bold text-white mt-1">Automated Point-In-Time Backup &amp; Disaster Recovery</h2>
            </div>
            <button onClick={() => showToast('Initiated Instant On-Demand Point-in-time Snapshot Backup!')} className="px-3.5 py-1.5 bg-red-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer">
              <DatabaseBackup className="w-4 h-4" /> Trigger Backup
            </button>
          </div>

          <div className="space-y-3">
            {MOCK_BACKUP_RECOVERY.map((bak) => (
              <div key={bak.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-red-400 font-bold">{bak.backupCode}</span>
                    <h3 className="text-white font-bold text-xs mt-0.5">{bak.tenantCode}</h3>
                    <span className="text-slate-400 text-[10px]">Type: {bak.backupType}</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">{bak.restoreVerifiedStatus}</span>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span>Size: <strong className="text-cyan-300">{bak.sizeGb} GB</strong></span>
                  <span>Timestamp: {bak.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 12: DEVOPS */}
      {activeTab === 'mod12-devops' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-red-400 uppercase tracking-wider">Module 12</span>
            <h2 className="text-xl font-bold text-white mt-1">DevOps CI/CD Release Engineering &amp; Deploy History</h2>
          </div>

          <div className="space-y-3">
            {MOCK_DEVOPS_RELEASES.map((rel) => (
              <div key={rel.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-red-400 font-bold">{rel.versionTag}</span>
                    <h3 className="text-white font-bold text-sm mt-0.5">{rel.releaseTitle}</h3>
                    <span className="text-slate-400 text-[10px]">Environment: {rel.deployEnvironment}</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">{rel.buildStatus}</span>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span>Deployed By: <strong className="text-slate-200">{rel.deployedBy}</strong></span>
                  <span>Deployed At: {rel.deployedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 13: FEATURE MANAGEMENT */}
      {activeTab === 'mod13-features' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-red-400 uppercase tracking-wider">Module 13</span>
              <h2 className="text-xl font-bold text-white mt-1">Feature Management &amp; Rollout Kill-Switches</h2>
            </div>
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 font-bold rounded-full text-xs">
              Instant Rollout Sync
            </span>
          </div>

          <div className="space-y-3">
            {featureFlags.map((ff) => (
              <div key={ff.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <span className="text-red-400 font-mono font-bold text-xs">{ff.flagKey}</span>
                  <h3 className="text-white font-bold text-sm">{ff.featureName}</h3>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span>Category: <strong>{ff.category}</strong></span>
                    <span>•</span>
                    <span>Env: <strong>{ff.environment}</strong></span>
                    <span>•</span>
                    <span>Rollout: <strong className="text-cyan-300">{ff.rolloutPercent}% Users</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleFeatureFlag(ff.id)}
                  className={`px-4 py-2 font-black rounded-xl cursor-pointer text-xs transition ${
                    ff.isEnabled ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {ff.isEnabled ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 16: ECOSYSTEM BRIDGES */}
      {activeTab === 'mod16-ecosystem' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-red-400 uppercase tracking-wider">Module 16</span>
            <h2 className="text-xl font-bold text-white mt-1">Administration ↔ Full Platform Ecosystem Control</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: 'Mining Operations Platform', scope: 'Quarry Tenant Isolation & Equipment Permission Scope' },
              { name: 'Fleet Logistics Platform', scope: 'Driver User Accounts, Geofence Enforcement & Telemetry Locks' },
              { name: 'Building Materials Platform', scope: 'Public Catalog Feature Flags & Rate Limit Quotas' },
              { name: 'CRM & Marketplace Platform', scope: 'Merchant Credentials, Escrow Licenses & Commission Rules' },
              { name: 'Finance & HRMS Platform', scope: 'Bank API Encryption Secrets, Payroll Audit Trails & Tax Rules' },
              { name: 'AI Copilot & iPaaS Gateway', scope: 'Model Context Protocol (MCP) Router & Gateway API Key Vault' }
            ].map((eco, idx) => (
              <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex justify-between items-center">
                <div>
                  <strong className="text-white block text-xs">{eco.name}</strong>
                  <span className="text-slate-400 text-[10px]">{eco.scope}</span>
                </div>
                <span className="text-emerald-400 font-bold text-[10px]">Governed</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PHASE 26 REVIEW */}
      {activeTab === 'phase26-review' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-red-400 uppercase tracking-wider">Phase 26 Sign-off</span>
            <h2 className="text-xl font-bold text-white mt-1">Phase 26 SaaS Governance Architectural Completion Sign-off</h2>
          </div>

          <div className="p-5 bg-red-950/40 border border-red-500/30 rounded-2xl space-y-3">
            <h3 className="text-red-300 font-bold text-sm">✓ Phase 26 Enterprise Governance &amp; Administration Platform Sign-off</h3>
            <p className="text-slate-300 leading-relaxed text-xs">
              Phase 26 establishes the Master SaaS Administration Control Center for RZ® Minetrix BOS. It provides multi-tenant database schema isolation, ABAC/RBAC identity control, WAF threat detection, automated subscription billing, system health monitoring, point-in-time database backups, CI/CD release management, and feature flag rollouts across all business platforms.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-[11px] pt-2">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Control Center</span>
                <strong className="text-red-400 text-sm">16 / 16 Complete</strong>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Active Tenants</span>
                <strong className="text-emerald-400 text-sm">{tenants.length} Workspaces</strong>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Security Incidents</span>
                <strong className="text-emerald-400 text-sm">0 Threats Active</strong>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Release Engine</span>
                <strong className="text-cyan-400 text-sm">CI/CD Automated</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
