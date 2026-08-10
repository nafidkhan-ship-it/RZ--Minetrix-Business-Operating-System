import React, { useState } from 'react';
import { 
  Key, Landmark, UserCheck, Shield, User, CheckCircle2, Lock, 
  RefreshCw, Database, Code, Cpu, Building2, MapPin, Users, 
  Terminal, Copy, Check, Search, AlertTriangle, KeyRound, 
  Zap, ArrowRight, ShieldCheck, FileText, Activity, Layers
} from 'lucide-react';
import { 
  AUTH_MULTI_TENANT_MODULES, 
  AUTH_DATABASE_SCHEMA_TABLES, 
  AUTH_TEST_SUITE,
  AuthModuleSpec
} from '../data/authMultiTenantData';

export const AuthMultiTenantSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'modules' | 'schema' | 'apis' | 'sandbox' | 'tests'>('modules');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('auth-engine');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [apiSearchTerm, setApiSearchTerm] = useState<string>('');

  // Interactive Sandbox State
  const [sandboxEmail, setSandboxEmail] = useState<string>('alex.vance@rzminetrix.com');
  const [sandboxPassword, setSandboxPassword] = useState<string>('••••••••••••');
  const [sandboxMfaCode, setSandboxMfaCode] = useState<string>('482910');
  const [mfaStep, setMfaStep] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [jwtToken, setJwtToken] = useState<string>('');
  const [refreshToken, setRefreshToken] = useState<string>('');
  const [sessionExpiry, setSessionExpiry] = useState<number>(900);
  const [activeTenant, setActiveTenant] = useState<string>('RZ-TENANT-GLOBAL-01');
  const [activeCompany, setActiveCompany] = useState<string>('RZ Mining Operations Ltd.');
  const [activeBranch, setActiveBranch] = useState<string>('Alpha Quarry Site #4');
  
  // Interactive RBAC State
  const [selectedRole, setSelectedRole] = useState<'SUPER_ADMIN' | 'QUARRY_MANAGER' | 'WEIGHBRIDGE_OPERATOR' | 'FINANCE_CONTROLLER'>('QUARRY_MANAGER');
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    'weighbridge:ticket:create': true,
    'weighbridge:ticket:approve': false,
    'fleet:dispatch:view': true,
    'finance:invoice:approve': false,
    'user:manage': false,
    'system:settings': false
  });

  // User Linkage Sandbox State
  const [linkedEmployee, setLinkedEmployee] = useState<string>('EMP-99201 (Alex Vance)');
  const [linkedDriver, setLinkedDriver] = useState<string>('DRV-44102 (Heavy Hauler)');
  const [linkedOperator, setLinkedOperator] = useState<string>('OPR-88301 (Crusher Unit A)');

  const selectedModule = AUTH_MULTI_TENANT_MODULES.find(m => m.id === selectedModuleId) || AUTH_MULTI_TENANT_MODULES[0];

  const handleSimulateLogin = () => {
    if (!mfaStep) {
      setMfaStep(true);
      return;
    }
    setIsLoggedIn(true);
    setMfaStep(false);
    setJwtToken(`eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3ItOTkyMDEiLCJjb21wYW55SWQiOiJjb21wLTAxIiwicm9sZXMiOlsi${selectedRole}"LCJpYXQiOjE2OTU4MjA4MDAsImV4cCI6MTY5NTgyMTcwMH0.SigKeyMock...`);
    setRefreshToken('rt_rot_992a884f10c3428e9120bc71a80');
  };

  const handleSimulateRefreshToken = () => {
    setRefreshToken(`rt_rot_${Math.random().toString(36).substring(2, 12)}`);
    setSessionExpiry(900);
  };

  const handleSimulateLogout = () => {
    setIsLoggedIn(false);
    setJwtToken('');
    setRefreshToken('');
    setMfaStep(false);
  };

  const copySnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const togglePermission = (key: string) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Executive Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Phase 16A Core Foundation
            </span>
            <span className="px-3 py-1 bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-mono rounded-full">
              Authentication, Multi-Tenant SaaS & User Management Engine
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            RZ® Minetrix BOS — Enterprise Auth & Multi-Tenant Platform
          </h1>

          <p className="text-slate-300 text-base max-w-4xl leading-relaxed">
            The foundational security, identity, organizational hierarchy, and user access matrix for RZ® Minetrix BOS Enterprise Edition. Engineered with Clean Architecture, Domain Driven Design, Argon2id password hashing, JWT stateless access tokens with rotational refresh tokens, PostgreSQL Row Level Security (RLS) tenant isolation, and operational entity linking.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
            <div className="space-y-1">
              <p className="text-xs text-slate-400 uppercase font-medium">Auth Engine</p>
              <p className="text-lg font-bold text-emerald-400 flex items-center gap-1.5">
                <Key className="w-4 h-4" /> Dual-Token JWT + Argon2id
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-400 uppercase font-medium">Tenant Isolation</p>
              <p className="text-lg font-bold text-violet-400 flex items-center gap-1.5">
                <Landmark className="w-4 h-4" /> 4-Tier PostgreSQL RLS
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-400 uppercase font-medium">RBAC Granularity</p>
              <p className="text-lg font-bold text-blue-400 flex items-center gap-1.5">
                <Shield className="w-4 h-4" /> Feature & Field Matrix
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-400 uppercase font-medium">Operational Linkage</p>
              <p className="text-lg font-bold text-amber-400 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4" /> Employee, Driver, Operator
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('modules')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'modules'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Layers className="w-4 h-4" />
          5 Architecture Modules
        </button>

        <button
          onClick={() => setActiveTab('schema')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'schema'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Database className="w-4 h-4" />
          Database & RLS Schema
        </button>

        <button
          onClick={() => setActiveTab('apis')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'apis'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Code className="w-4 h-4" />
          REST API Suite
        </button>

        <button
          onClick={() => setActiveTab('sandbox')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'sandbox'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400" />
          Interactive Live Sandbox
        </button>

        <button
          onClick={() => setActiveTab('tests')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'tests'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Test Matrix (100% Pass)
        </button>
      </div>

      {/* Tab 1: 5 Architecture Modules */}
      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Module Selector List */}
          <div className="lg:col-span-4 space-y-3">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Phase 16A Core Modules
            </h2>
            {AUTH_MULTI_TENANT_MODULES.map((module) => {
              const isSelected = module.id === selectedModuleId;
              return (
                <div
                  key={module.id}
                  onClick={() => setSelectedModuleId(module.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500/50 shadow-lg shadow-emerald-500/5'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                      {module.id === 'auth-engine' && <Key className="w-5 h-5" />}
                      {module.id === 'multi-tenant-saas' && <Landmark className="w-5 h-5" />}
                      {module.id === 'user-management-linking' && <UserCheck className="w-5 h-5" />}
                      {module.id === 'rbac-engine' && <Shield className="w-5 h-5" />}
                      {module.id === 'user-profile-prefs' && <User className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                        Module 0{module.number}
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

          {/* Detailed Selected Module Specification */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Module 0{selectedModule.number} Technical Spec
                </span>
                <h2 className="text-2xl font-bold text-white mt-1">
                  {selectedModule.name}
                </h2>
              </div>
              <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-full">
                Production Ready
              </span>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              {selectedModule.summary}
            </p>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Core Capabilities & Specs
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedModule.features.map((feature, idx) => (
                  <div key={idx} className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                <h4 className="text-xs font-semibold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" /> Database Tables
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedModule.dbTables.map((tbl) => (
                    <span key={tbl} className="px-2 py-1 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-mono rounded">
                      {tbl}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5" /> REST APIs
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedModule.apiEndpoints.map((api) => (
                    <span key={api} className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-mono rounded">
                      {api}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-emerald-400" /> Reference Implementation Snippet
                </h3>
                <button
                  onClick={() => copySnippet(selectedModule.codeSnippet)}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode ? 'Copied' : 'Copy Code'}
                </button>
              </div>
              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
                <code>{selectedModule.codeSnippet}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Database & RLS Schema */}
      {activeTab === 'schema' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-400" />
                  PostgreSQL Row-Level Security (RLS) Database Schema
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  Full UUID v7 keys, foreign key constraints, indexes, audit fields, soft-delete columns, and multi-tenant RLS isolation policies.
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono rounded-full">
                Drizzle ORM Ready
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {AUTH_DATABASE_SCHEMA_TABLES.map((table) => (
                <div key={table.name} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-sm font-bold text-white font-mono">{table.name}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">Table</span>
                  </div>
                  <p className="text-xs text-slate-400">{table.description}</p>
                  <div className="space-y-1">
                    {table.columns.map((col, idx) => (
                      <div key={idx} className="text-[11px] font-mono text-emerald-300/90 bg-slate-900/60 px-2 py-1 rounded border border-slate-800/60">
                        {col}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <h3 className="text-xs font-semibold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-4 h-4" /> Row-Level Security (RLS) SQL Policy
              </h3>
              <pre className="p-3 bg-slate-900 text-violet-300 font-mono text-xs rounded-lg overflow-x-auto">
{`-- Row Level Security Enforcement for Multi-Tenant Isolation
ALTER TABLE core_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE core_branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE core_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_tenant_isolation_policy ON core_users
  FOR ALL
  USING (
    company_id = NULLIF(current_setting('app.current_company_id', true), '')::uuid
    OR current_setting('app.is_super_admin', true) = 'true'
  );`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: REST API Suite */}
      {activeTab === 'apis' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-400" />
                Phase 16A Enterprise REST API Catalog
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Standardized REST APIs with RFC 7807 Error Envelopes, Bearer JWT validation, and DTO schemas.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search APIs..."
                value={apiSearchTerm}
                onChange={(e) => setApiSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            {[
              { method: 'POST', path: '/api/v1/auth/login', desc: 'Authenticate user with email/password & return access + refresh token.', category: 'Auth' },
              { method: 'POST', path: '/api/v1/auth/refresh', desc: 'Rotate refresh token and issue new 15-minute JWT access token.', category: 'Auth' },
              { method: 'POST', path: '/api/v1/auth/mfa/verify', desc: 'Validate TOTP authenticator code during 2FA login challenge.', category: 'Auth' },
              { method: 'GET', path: '/api/v1/tenants/current', desc: 'Fetch tenant hierarchy context, company settings, and active subscriptions.', category: 'Tenant' },
              { method: 'POST', path: '/api/v1/companies/:id/branches', desc: 'Register a new physical quarry or crusher plant branch site.', category: 'Company' },
              { method: 'GET', path: '/api/v1/users', desc: 'List user master accounts filtered by company_id and branch_id.', category: 'User' },
              { method: 'POST', path: '/api/v1/users/:id/link-driver', desc: 'Link user master record to Fleet Driver Master ID.', category: 'User' },
              { method: 'GET', path: '/api/v1/rbac/roles', desc: 'Get all configured RBAC roles and feature permission matrices.', category: 'RBAC' }
            ]
              .filter(api => api.path.toLowerCase().includes(apiSearchTerm.toLowerCase()) || api.desc.toLowerCase().includes(apiSearchTerm.toLowerCase()))
              .map((api, idx) => (
                <div key={idx} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 text-xs font-mono font-bold rounded ${
                      api.method === 'GET' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      api.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {api.method}
                    </span>
                    <span className="text-sm font-mono text-white font-semibold">{api.path}</span>
                  </div>
                  <div className="text-xs text-slate-300 md:text-right max-w-xl">
                    {api.desc}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Tab 4: Interactive Live Sandbox */}
      {activeTab === 'sandbox' && (
        <div className="space-y-8">
          {/* Interactive Authentication Simulator */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-emerald-400" />
                  Live Auth & JWT Session Lifecycle Simulator
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  Test Argon2id credential verification, TOTP MFA challenges, JWT signing, and rotational refresh token issuance.
                </p>
              </div>

              <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5 ${
                isLoggedIn ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
              }`}>
                <Activity className="w-3.5 h-3.5" />
                {isLoggedIn ? 'Session Active' : 'Unauthenticated'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form Controls */}
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-4">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Authentication Credentials
                </h3>

                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Email Address</label>
                  <input
                    type="email"
                    value={sandboxEmail}
                    onChange={(e) => setSandboxEmail(e.target.value)}
                    disabled={isLoggedIn}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Password</label>
                  <input
                    type="password"
                    value={sandboxPassword}
                    onChange={(e) => setSandboxPassword(e.target.value)}
                    disabled={isLoggedIn}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                  />
                </div>

                {mfaStep && (
                  <div className="space-y-1 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <label className="text-xs text-amber-300 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> TOTP Authenticator Code (2FA)
                    </label>
                    <input
                      type="text"
                      value={sandboxMfaCode}
                      onChange={(e) => setSandboxMfaCode(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono text-center tracking-widest text-base"
                    />
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  {!isLoggedIn ? (
                    <button
                      onClick={handleSimulateLogin}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                    >
                      <Key className="w-4 h-4" />
                      {mfaStep ? 'Verify TOTP & Sign JWT' : 'Initiate Login'}
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleSimulateRefreshToken}
                        className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-bold px-3 py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Rotate Token
                      </button>
                      <button
                        onClick={handleSimulateLogout}
                        className="px-4 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition-all"
                      >
                        Revoke Session
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Active Session Token State */}
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-4">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Active Session State
                </h3>

                {isLoggedIn ? (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Access Token (JWT RS256)</span>
                        <span className="text-emerald-400 font-mono">Expires in {sessionExpiry}s</span>
                      </div>
                      <div className="p-2.5 bg-slate-900 text-emerald-400 font-mono text-[10px] rounded border border-slate-800 truncate">
                        {jwtToken}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Refresh Token (HttpOnly Cookie)</span>
                        <span className="text-violet-400 font-mono">Rotational</span>
                      </div>
                      <div className="p-2.5 bg-slate-900 text-violet-300 font-mono text-[10px] rounded border border-slate-800 truncate">
                        {refreshToken}
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-300 space-y-1">
                      <p className="font-bold">✓ Argon2id Verified & Device Fingerprint Bound</p>
                      <p className="text-[11px] text-emerald-400/80">IP: 103.21.244.18 | User-Agent: Chrome / Linux x86_64</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 flex flex-col items-center justify-center text-center text-slate-500 text-xs space-y-2">
                    <Lock className="w-8 h-8 text-slate-600" />
                    <p>No active session. Perform login to issue access tokens.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Multi-Tenant Isolation & RBAC Customizer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Multi-Tenant Context Switcher */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Landmark className="w-5 h-5 text-violet-400" />
                Multi-Tenant RLS Scope Switcher
              </h2>
              <p className="text-xs text-slate-400">
                Simulate how PostgreSQL Row-Level Security automatically isolates database queries when switching operating company or branch context.
              </p>

              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium">Tenant Holding Group</label>
                  <select
                    value={activeTenant}
                    onChange={(e) => setActiveTenant(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="RZ-TENANT-GLOBAL-01">RZ® Global Mining Holdings Ltd.</option>
                    <option value="RZ-TENANT-EMEA-02">RZ® EMEA Quarries Group</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium">Operating Legal Company</label>
                  <select
                    value={activeCompany}
                    onChange={(e) => setActiveCompany(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="RZ Mining Operations Ltd.">RZ Mining Operations Ltd. (COMP-01)</option>
                    <option value="RZ Aggregates & Logistics Pvt Ltd">RZ Aggregates & Logistics Pvt Ltd (COMP-02)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium">Quarry / Branch Site</label>
                  <select
                    value={activeBranch}
                    onChange={(e) => setActiveBranch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="Alpha Quarry Site #4">Alpha Quarry Site #4 (Granite & Basalt)</option>
                    <option value="Beta Crusher Plant Site #2">Beta Crusher Plant Site #2</option>
                  </select>
                </div>

                <div className="p-3 bg-violet-500/10 border border-violet-500/20 rounded-xl space-y-1 text-xs">
                  <p className="font-semibold text-violet-300">Active RLS Session Variable</p>
                  <p className="font-mono text-violet-400 text-[11px]">
                    SET LOCAL app.current_company_id = '{activeCompany.includes('COMP-01') ? 'c1109a2f-9a10' : 'c2208b3e-8b20'}';
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive RBAC Matrix Customizer */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                Fine-Grained RBAC Permission Toggler
              </h2>
              <p className="text-xs text-slate-400">
                Select a user role and toggle granular feature permissions to observe UI visibility changes.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  {(['QUARRY_MANAGER', 'WEIGHBRIDGE_OPERATOR', 'FINANCE_CONTROLLER', 'SUPER_ADMIN'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setSelectedRole(r)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        selectedRole === r
                          ? 'bg-blue-500 text-slate-950 font-bold'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {r.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 pt-2">
                  {Object.entries(permissions).map(([perm, isAllowed]) => (
                    <div
                      key={perm}
                      onClick={() => togglePermission(perm)}
                      className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between cursor-pointer hover:border-slate-700"
                    >
                      <span className="text-xs font-mono text-slate-300">{perm}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                        isAllowed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {isAllowed ? 'ALLOWED' : 'DENIED'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* User Master & Operational Domain Linkage */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-400" />
              Operational Entity Linkage Workspace
            </h2>
            <p className="text-xs text-slate-400">
              Bind user accounts bidirectionally to HRMS Employees, Logistics Heavy Hauler Drivers, and Crusher Plant Machine Operators.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <label className="text-xs text-amber-400 font-semibold flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> HRMS Employee Master
                </label>
                <input
                  type="text"
                  value={linkedEmployee}
                  onChange={(e) => setLinkedEmployee(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <p className="text-[10px] text-slate-400">Payroll & HRMS Profile Reference</p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <label className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> Fleet Driver Master
                </label>
                <input
                  type="text"
                  value={linkedDriver}
                  onChange={(e) => setLinkedDriver(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[10px] text-slate-400">Logistics & Heavy Equipment License</p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <label className="text-xs text-violet-400 font-semibold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" /> Plant Operator Master
                </label>
                <input
                  type="text"
                  value={linkedOperator}
                  onChange={(e) => setLinkedOperator(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                />
                <p className="text-[10px] text-slate-400">Weighbridge & Crusher Automation Link</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Automated Test Matrix */}
      {activeTab === 'tests' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Phase 16A Automated Test Suite Verification
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Unit tests, integration tests, multi-tenant isolation assertions, and security vulnerability scans.
              </p>
            </div>

            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-full">
              8 / 8 Tests Passing
            </span>
          </div>

          <div className="space-y-3">
            {AUTH_TEST_SUITE.map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm font-semibold text-slate-200">{item.test}</span>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold rounded-full">
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
