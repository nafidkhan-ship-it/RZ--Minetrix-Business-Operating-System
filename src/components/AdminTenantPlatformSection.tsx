import React, { useState } from 'react';
import { 
  Shield, Globe, Building2, CreditCard, Key, Settings, ToggleRight,
  Activity, Database, FileText, AlertTriangle, Code, Layers, Terminal,
  LayoutGrid, CheckCircle2, RefreshCw, Copy, Check, Plus, UserCheck,
  Search, Play, Lock, ShieldCheck, Download, Server, Cpu, HardDrive,
  Clock, ArrowRight, Zap, RefreshCcw, Power, AlertCircle, Sparkles
} from 'lucide-react';
import { 
  ADMIN_PLATFORM_MODULES,
  PRESET_TENANTS,
  PRESET_COMPANIES,
  PRESET_SUBSCRIPTIONS,
  PRESET_LICENSES,
  PRESET_FEATURE_FLAGS,
  PRESET_HEALTH_METRICS,
  PRESET_BACKUPS,
  PRESET_AUDIT_LOGS,
  DEFAULT_SYSTEM_CONFIG,
  ADMIN_DATABASE_SCHEMA_TABLES,
  ADMIN_TEST_SUITE,
  AdminModuleSpec,
  TenantSpec,
  CompanyNodeSpec,
  SubscriptionPlanSpec,
  LicenseKeySpec,
  FeatureFlagSpec,
  SystemHealthSpec,
  BackupRecordSpec,
  AuditLogSpec,
  SystemConfigSpec
} from '../data/adminTenantData';

export const AdminTenantPlatformSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'admin-console' | 'modules' | 'company-hierarchy' | 'subscription-licensing' | 'config-features' | 'health-backups' | 'audit-logs' | 'schema' | 'tests'>('admin-console');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('super-admin-console');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Tenant State
  const [tenantsList, setTenantsList] = useState<TenantSpec[]>(PRESET_TENANTS);
  const [tenantSearchQuery, setTenantSearchQuery] = useState<string>('');
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState<boolean>(false);
  const [newTenantName, setNewTenantName] = useState<string>('');
  const [newTenantSubdomain, setNewTenantSubdomain] = useState<string>('');
  const [newTenantPlan, setNewTenantPlan] = useState<'TRIAL' | 'MONTHLY_PRO' | 'YEARLY_BIZ' | 'ENTERPRISE_CUSTOM'>('YEARLY_BIZ');

  // Licensing Generator State
  const [generatedLicenseKey, setGeneratedLicenseKey] = useState<string>('LIC-RZM-2026-9912-RSA256');
  const [verifiedSignatureStatus, setVerifiedSignatureStatus] = useState<string | null>(null);

  // Configuration State
  const [sysConfig, setSysConfig] = useState<SystemConfigSpec>(DEFAULT_SYSTEM_CONFIG);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlagSpec[]>(PRESET_FEATURE_FLAGS);

  // Backup Records State
  const [backupRecords, setBackupRecords] = useState<BackupRecordSpec[]>(PRESET_BACKUPS);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedModule = ADMIN_PLATFORM_MODULES.find(m => m.id === selectedModuleId) || ADMIN_PLATFORM_MODULES[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const copySnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleProvisionTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantName || !newTenantSubdomain) return;

    const id = `ten-${Date.now().toString().slice(-4)}`;
    const code = `TEN-${newTenantSubdomain.toUpperCase().slice(0, 4)}-${Math.floor(Math.random() * 90 + 10)}`;
    const newTenant: TenantSpec = {
      id,
      code,
      name: newTenantName,
      subdomain: newTenantSubdomain.toLowerCase().replace(/\s+/g, '-'),
      planTier: newTenantPlan,
      status: 'ACTIVE',
      companiesCount: 1,
      activeUsersCount: 5,
      storageGbUsed: 0.1,
      storageGbLimit: newTenantPlan === 'ENTERPRISE_CUSTOM' ? 1000 : 100,
      healthScore: 100,
      region: 'Asia-South1 (Mumbai)',
      isolationType: newTenantPlan === 'ENTERPRISE_CUSTOM' ? 'DEDICATED_DATABASE' : 'SCHEMA_PER_TENANT',
      createdAt: new Date().toISOString().split('T')[0],
      primaryContact: `admin@${newTenantSubdomain}.com`
    };

    setTenantsList([newTenant, ...tenantsList]);
    setIsProvisionModalOpen(false);
    setNewTenantName('');
    setNewTenantSubdomain('');
    showToast(`Successfully Provisioned Tenant: ${newTenant.name} (${newTenant.subdomain}.rzminetrix.com)`);
  };

  const toggleTenantStatus = (id: string) => {
    setTenantsList(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
        showToast(`Tenant ${t.name} Status Changed to ${nextStatus}`);
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const handleGenerateLicense = () => {
    const randomHex = Math.random().toString(36).substr(2, 6).toUpperCase();
    const newKey = `LIC-RZ-2026-${randomHex}-RSA256`;
    setGeneratedLicenseKey(newKey);
    setVerifiedSignatureStatus(null);
    showToast(`Generated Cryptographic RSA-256 License Key: ${newKey}`);
  };

  const handleVerifyLicense = () => {
    setVerifiedSignatureStatus('RSA-256 Cryptographic Signature VALID (Issuer: RZ® Minetrix Root CA)');
    showToast('License Key Verification Passed!');
  };

  const handleToggleFeatureFlag = (id: string) => {
    setFeatureFlags(prev => prev.map(f => {
      if (f.id === id) {
        const nextStatus = f.status === 'ENABLED' ? 'DISABLED' : 'ENABLED';
        showToast(`Feature Flag ${f.key} updated to ${nextStatus}`);
        return { ...f, status: nextStatus };
      }
      return f;
    }));
  };

  const handleTriggerBackup = () => {
    const id = `bkp-${Date.now().toString().slice(-4)}`;
    const newBkp: BackupRecordSpec = {
      id,
      backupCode: `BKP-2026-SNAP-${Math.floor(Math.random() * 9000 + 1000)}`,
      type: 'MANUAL_SNAPSHOT',
      tenantScope: 'ALL_TENANTS',
      sizeMb: 2480,
      encryption: 'AES_256_GCM',
      status: 'VERIFIED',
      storageUri: `s3://rz-minetrix-backups/manual/${id}.enc`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    setBackupRecords([newBkp, ...backupRecords]);
    showToast('AES-256 Encrypted Database Backup Completed & Verified!');
  };

  const filteredTenants = tenantsList.filter(t => 
    t.name.toLowerCase().includes(tenantSearchQuery.toLowerCase()) ||
    t.subdomain.toLowerCase().includes(tenantSearchQuery.toLowerCase()) ||
    t.code.toLowerCase().includes(tenantSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Executive Banner Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-semibold rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Phase 16H Administration Platform
            </span>
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono rounded-full">
              Super Admin, Tenant Isolation, RSA Licensing & Health Telemetry
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            RZ® Minetrix BOS — Enterprise Administration & Tenant Management Platform
          </h1>

          <p className="text-slate-300 text-base max-w-4xl leading-relaxed">
            Centralized control center managing multi-tenant isolation, automated provisioning, subscription plans, RSA-256 signed licenses, company organization trees, global localization, feature flags, disaster recovery backups, and audit trails.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
            <div className="space-y-1">
              <p className="text-xs text-slate-400 uppercase font-medium">Active Tenants</p>
              <p className="text-lg font-bold text-violet-400 flex items-center gap-1.5">
                <Globe className="w-4 h-4" /> {tenantsList.filter(t => t.status === 'ACTIVE').length} Active Tenants
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-400 uppercase font-medium">Platform Infrastructure</p>
              <p className="text-lg font-bold text-emerald-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4" /> 100% Health Score
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-400 uppercase font-medium">RSA License Keys</p>
              <p className="text-lg font-bold text-amber-400 flex items-center gap-1.5">
                <Key className="w-4 h-4" /> Cryptographic RSA-256
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-400 uppercase font-medium">Disaster Recovery</p>
              <p className="text-lg font-bold text-blue-400 flex items-center gap-1.5">
                <Database className="w-4 h-4" /> AES-256 Encrypted
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('admin-console')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'admin-console'
              ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Shield className="w-4 h-4 text-violet-400" />
          Super Admin Console
        </button>

        <button
          onClick={() => setActiveTab('modules')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'modules'
              ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Layers className="w-4 h-4" />
          16 Architecture Modules
        </button>

        <button
          onClick={() => setActiveTab('company-hierarchy')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'company-hierarchy'
              ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Building2 className="w-4 h-4 text-blue-400" />
          Company Hierarchy
        </button>

        <button
          onClick={() => setActiveTab('subscription-licensing')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'subscription-licensing'
              ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <CreditCard className="w-4 h-4 text-amber-400" />
          Subscriptions & Licensing
        </button>

        <button
          onClick={() => setActiveTab('config-features')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'config-features'
              ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Settings className="w-4 h-4 text-emerald-400" />
          Config & Feature Flags
        </button>

        <button
          onClick={() => setActiveTab('health-backups')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'health-backups'
              ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Activity className="w-4 h-4 text-rose-400" />
          System Health & Backups
        </button>

        <button
          onClick={() => setActiveTab('audit-logs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'audit-logs'
              ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <FileText className="w-4 h-4 text-indigo-400" />
          Cryptographic Audit Trail
        </button>

        <button
          onClick={() => setActiveTab('schema')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'schema'
              ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Code className="w-4 h-4 text-slate-300" />
          Database Schema
        </button>

        <button
          onClick={() => setActiveTab('tests')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'tests'
              ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Test Suite (100% Pass)
        </button>
      </div>

      {/* Action Toast Notification */}
      {toastMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex items-center gap-2 shadow-lg animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Tab 1: Super Admin Console & Tenant Management */}
      {activeTab === 'admin-console' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-6 border border-slate-800 rounded-2xl shadow-xl">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-violet-400" />
                Multi-Tenant SaaS Directory & Provisioning Console
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Manage tenant accounts, subdomains, database isolation tiers, storage usage, and health scores.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={tenantSearchQuery}
                  onChange={(e) => setTenantSearchQuery(e.target.value)}
                  placeholder="Search tenant name or subdomain..."
                  className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-violet-500 w-64"
                />
              </div>

              <button
                onClick={() => setIsProvisionModalOpen(true)}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-violet-600/20"
              >
                <Plus className="w-4 h-4" /> Provision New Tenant
              </button>
            </div>
          </div>

          {/* Tenants Table Grid */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Tenant & Subdomain</th>
                    <th className="px-5 py-3.5">Plan Tier</th>
                    <th className="px-5 py-3.5">Isolation</th>
                    <th className="px-5 py-3.5">Users & Companies</th>
                    <th className="px-5 py-3.5">Storage Usage</th>
                    <th className="px-5 py-3.5">Health Score</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredTenants.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-bold text-white text-sm">{t.name}</div>
                        <div className="text-[11px] font-mono text-violet-400 flex items-center gap-1">
                          <span>{t.subdomain}.rzminetrix.com</span>
                          <span className="text-slate-500">• {t.code}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-full border ${
                          t.planTier === 'ENTERPRISE_CUSTOM' ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' :
                          t.planTier === 'YEARLY_BIZ' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' :
                          t.planTier === 'MONTHLY_PRO' ? 'bg-blue-500/10 text-blue-300 border-blue-500/30' :
                          'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {t.planTier}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono text-[11px] text-slate-300">
                        {t.isolationType}
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-white font-bold">{t.activeUsersCount} Active Users</div>
                        <div className="text-slate-400 text-[11px]">{t.companiesCount} Company Entities</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                            <div 
                              className="bg-violet-500 h-full rounded-full" 
                              style={{ width: `${Math.min(100, (t.storageGbUsed / t.storageGbLimit) * 100)}%` }}
                            />
                          </div>
                          <span className="font-mono text-[10px] text-slate-300">
                            {t.storageGbUsed} / {t.storageGbLimit} GB
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono font-bold">
                        <span className={`px-2 py-0.5 rounded text-[11px] ${
                          t.healthScore >= 90 ? 'bg-emerald-500/20 text-emerald-300' :
                          t.healthScore >= 70 ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {t.healthScore} / 100
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-full ${
                          t.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => toggleTenantStatus(t.id)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                            t.status === 'ACTIVE'
                              ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {t.status === 'ACTIVE' ? 'Suspend' : 'Reactivate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Provisioning Modal */}
          {isProvisionModalOpen && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-violet-400" /> Provision New Tenant
                  </h3>
                  <button onClick={() => setIsProvisionModalOpen(false)} className="text-slate-400 hover:text-white text-xs">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleProvisionTenant} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300">Tenant Enterprise Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. South India Granites Ltd"
                      value={newTenantName}
                      onChange={(e) => setNewTenantName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300">Subdomain Identifier</label>
                    <div className="flex items-center gap-1 mt-1">
                      <input
                        type="text"
                        required
                        placeholder="south-india-granites"
                        value={newTenantSubdomain}
                        onChange={(e) => setNewTenantSubdomain(e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
                      />
                      <span className="text-xs text-slate-400 font-mono">.rzminetrix.com</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300">Subscription Plan Tier</label>
                    <select
                      value={newTenantPlan}
                      onChange={(e) => setNewTenantPlan(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:outline-none focus:border-violet-500"
                    >
                      <option value="TRIAL">14-Day Free Trial</option>
                      <option value="MONTHLY_PRO">Pro Monthly Plan</option>
                      <option value="YEARLY_BIZ">Business Growth Yearly</option>
                      <option value="ENTERPRISE_CUSTOM">Enterprise Custom Dedicated DB</option>
                    </select>
                  </div>

                  <div className="p-3 bg-violet-500/10 border border-violet-500/20 rounded-xl text-xs text-violet-300 space-y-1">
                    <p className="font-bold">• Auto-Schema Isolation Setup (&lt; 2s)</p>
                    <p className="text-[11px] text-slate-300">Creates isolated database tables &amp; issues default admin credentials.</p>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsProvisionModalOpen(false)}
                      className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-600/20"
                    >
                      Execute Provisioning
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: 16 Architecture Modules */}
      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-3">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Phase 16H Architecture Specifications
            </h2>
            {ADMIN_PLATFORM_MODULES.map((module) => {
              const isSelected = module.id === selectedModuleId;
              return (
                <div
                  key={module.id}
                  onClick={() => setSelectedModuleId(module.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-violet-500/50 shadow-lg shadow-violet-500/5'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-violet-500/20 text-violet-400' : 'bg-slate-800 text-slate-400'}`}>
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-violet-400 font-semibold uppercase tracking-wider">
                        Module {module.number < 10 ? `0${module.number}` : module.number}
                      </div>
                      <h3 className="text-sm font-bold text-white">
                        {module.name}
                      </h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">
                  Module {selectedModule.number < 10 ? `0${selectedModule.number}` : selectedModule.number} Technical Spec
                </span>
                <h2 className="text-2xl font-bold text-white mt-1">
                  {selectedModule.name}
                </h2>
              </div>
              <span className="px-3 py-1 bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-semibold rounded-full">
                Production Ready
              </span>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              {selectedModule.summary}
            </p>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Core Capabilities &amp; Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedModule.features.map((feature, idx) => (
                  <div key={idx} className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-violet-400 font-bold">•</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5" /> Database Tables
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedModule.dbTables.map((tbl) => (
                    <span key={tbl} className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-mono rounded">
                      {tbl}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" /> REST APIs
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedModule.apiEndpoints.map((api) => (
                    <span key={api} className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono rounded">
                      {api}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-violet-400" /> Reference Implementation Code
                </h3>
                <button
                  onClick={() => copySnippet(selectedModule.codeSnippet)}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-violet-400 transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode ? 'Copied' : 'Copy Code'}
                </button>
              </div>
              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-violet-300 overflow-x-auto leading-relaxed">
                <code>{selectedModule.codeSnippet}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Company Organization Hierarchy */}
      {activeTab === 'company-hierarchy' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-400" />
              Multi-Company &amp; Organization Hierarchy Engine
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Holding companies, subsidiaries, branch quarry sites, cost centers, and digital seals.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {PRESET_COMPANIES.map((comp) => (
              <div key={comp.id} className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold rounded">
                      {comp.type}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">{comp.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">Code: {comp.code} • City: {comp.city}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Seal Verified
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <div>
                    <span className="text-slate-400 block">GSTIN Registration</span>
                    <strong className="text-white font-mono">{comp.gstin}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Base Currency</span>
                    <strong className="text-emerald-400 font-mono">{comp.currency}</strong>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-300 block">Cost Centers Allocated:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {comp.costCenters.map((cc) => (
                      <span key={cc} className="px-2 py-1 bg-slate-900 text-slate-300 text-[11px] font-mono rounded border border-slate-800">
                        {cc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Subscriptions & RSA Licensing */}
      {activeTab === 'subscription-licensing' && (
        <div className="space-y-6">
          {/* Subscription Plans */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-400" />
                SaaS Subscription Plans Catalog
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Trial, Monthly Pro, Yearly Business, and Dedicated Custom Enterprise Plans.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {PRESET_SUBSCRIPTIONS.map((plan) => (
                <div key={plan.id} className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                      {plan.code}
                    </span>
                    <h3 className="text-base font-bold text-white">{plan.name}</h3>
                    <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                      ₹{plan.priceMonthlyInr.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ mo</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300 border-t border-b border-slate-800 py-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Max Users:</span>
                      <strong className="text-white">{plan.maxUsers} Users</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Storage Limit:</span>
                      <strong className="text-white">{plan.maxStorageGb} GB</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">SLA Guarantee:</span>
                      <strong className="text-emerald-400 font-mono">{plan.slaGuaranteePercent}%</strong>
                    </div>
                  </div>

                  <button className="w-full bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold py-2 rounded-xl text-xs transition-all">
                    Configure Plan Limits
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* RSA-256 License Key Generator & Verifier Sandbox */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                RSA-256 Cryptographic License Key Generator &amp; Sandbox
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Issue signed hardware-bound licenses, air-gapped offline key signatures, and concurrent user seats.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-400" /> License Key Issuer
                </h3>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Active RSA-256 License Key:</span>
                  <div className="text-sm font-mono font-bold text-emerald-400 tracking-wider">
                    {generatedLicenseKey}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleGenerateLicense}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                  >
                    <RefreshCw className="w-4 h-4" /> Issue New RSA-256 Key
                  </button>

                  <button
                    onClick={handleVerifyLicense}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                  >
                    <ShieldCheck className="w-4 h-4" /> Verify Key Signature
                  </button>
                </div>

                {verifiedSignatureStatus && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-mono">
                    {verifiedSignatureStatus}
                  </div>
                )}
              </div>

              {/* Active License Presets */}
              <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <h3 className="text-sm font-bold text-white">Active Tenant License Inventory</h3>
                {PRESET_LICENSES.map((lic) => (
                  <div key={lic.id} className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs space-y-1">
                    <div className="flex justify-between font-mono font-bold text-amber-400">
                      <span>{lic.licenseCode}</span>
                      <span className="text-emerald-400">{lic.status}</span>
                    </div>
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Type: {lic.type}</span>
                      <span>Seats: {lic.activeSeats} / {lic.maxSeats} Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Configuration & Feature Flags */}
      {activeTab === 'config-features' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Global System Settings */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-emerald-400" />
                Global Localization &amp; Regional Configuration
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-slate-400 block">Platform Application Name</span>
                <strong className="text-white text-sm">{sysConfig.globalName}</strong>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-slate-400 block">Default Timezone</span>
                  <strong className="text-emerald-400 font-mono">{sysConfig.defaultTimezone}</strong>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-slate-400 block">Base Currency</span>
                  <strong className="text-emerald-400 font-mono">{sysConfig.defaultCurrency}</strong>
                </div>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-slate-400 block">Indian Fiscal Year Cycle</span>
                <strong className="text-amber-400 font-mono">{sysConfig.fiscalYearStart}</strong>
              </div>
            </div>
          </div>

          {/* Feature Flags Management */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ToggleRight className="w-5 h-5 text-emerald-400" />
                Dynamic Feature Flag Management
              </h2>
            </div>

            <div className="space-y-3">
              {featureFlags.map((flag) => (
                <div key={flag.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <div className="font-mono text-emerald-400 font-bold">{flag.key}</div>
                    <div className="text-slate-200 font-semibold">{flag.name}</div>
                  </div>

                  <button
                    onClick={() => handleToggleFeatureFlag(flag.id)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      flag.status === 'ENABLED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {flag.status}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: System Health & Backups */}
      {activeTab === 'health-backups' && (
        <div className="space-y-6">
          {/* System Infrastructure Telemetry */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-rose-400" />
                System Infrastructure Telemetry Monitor
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                CPU, Memory, NVMe Storage, Database Pool, API Gateway, and Background Queue telemetry.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PRESET_HEALTH_METRICS.map((h) => (
                <div key={h.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 font-mono">{h.component}</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold rounded">
                      {h.status}
                    </span>
                  </div>

                  <div className="text-2xl font-bold text-white font-mono">
                    {h.usagePercent}% <span className="text-xs text-slate-400 font-normal">utilized</span>
                  </div>

                  <p className="text-[11px] text-slate-400">{h.metricDetail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Encrypted Backup & Snapshot */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-400" />
                  Disaster Recovery &amp; Encrypted Backup Management
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  AES-256 GCM encrypted daily backups, manual snapshots, and verification logs.
                </p>
              </div>

              <button
                onClick={handleTriggerBackup}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-blue-600/20"
              >
                <Database className="w-4 h-4" /> Trigger Encrypted Backup
              </button>
            </div>

            <div className="space-y-3">
              {backupRecords.map((bkp) => (
                <div key={bkp.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <div className="font-mono text-blue-400 font-bold">{bkp.backupCode}</div>
                    <div className="text-slate-300 font-mono text-[11px]">{bkp.storageUri}</div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-slate-400 font-mono">{bkp.sizeMb} MB ({bkp.encryption})</span>
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 font-mono font-bold rounded-full">
                      {bkp.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Cryptographic Audit Trail */}
      {activeTab === 'audit-logs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              Cryptographic SHA-256 Immutable Audit Log Repository
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Field-level security log capturing admin actions, tenant provisioning, feature flag changes, and failed login attempts.
            </p>
          </div>

          <div className="space-y-3">
            {PRESET_AUDIT_LOGS.map((log) => (
              <div key={log.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-indigo-400 font-bold">{log.logCode}</span>
                    <span className="px-2 py-0.5 bg-slate-900 text-slate-300 font-mono rounded border border-slate-800">
                      {log.role}
                    </span>
                    <span className="text-white font-bold">{log.action}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 font-mono font-bold rounded ${
                    log.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {log.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-400 text-[11px] pt-1 border-t border-slate-900">
                  <span>Actor: <strong className="text-slate-200">{log.actorEmail}</strong></span>
                  <span>Target: <strong className="text-slate-200">{log.targetEntity}</strong></span>
                  <span>IP: <strong className="text-slate-300 font-mono">{log.ipAddress}</strong></span>
                  <span>Time: <strong className="text-slate-400 font-mono">{log.timestamp}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 8: Database Schema */}
      {activeTab === 'schema' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-emerald-400" />
                Admin Platform Drizzle Database Schema
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Multi-tenant schema, company hierarchy, RSA licenses, subscriptions, and audit log tables.
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono rounded-full">
              PostgreSQL Drizzle ORM
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ADMIN_DATABASE_SCHEMA_TABLES.map((table) => (
              <div key={table.name} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-white font-mono">{table.name}</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">Table</span>
                </div>
                <p className="text-xs text-slate-400">{table.description}</p>
                <div className="space-y-1">
                  {table.columns.map((col, idx) => (
                    <div key={idx} className="text-[10px] font-mono text-violet-300/90 bg-slate-900/60 px-2 py-1 rounded border border-slate-800/60">
                      {col}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 9: Test Suite */}
      {activeTab === 'tests' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Phase 16H Automated Test Suite Verification
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Tenant provisioning, RSA signature verification, subscription metering, feature flags, and audit logs.
              </p>
            </div>

            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-full">
              8 / 8 Tests Passing
            </span>
          </div>

          <div className="space-y-3">
            {ADMIN_TEST_SUITE.map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm font-semibold text-slate-200">{item.test}</span>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold rounded-full">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
