import React, { useState } from 'react';
import {
  PLATFORM_PORTALS_DATA,
  WEB_PLATFORM_SPECIFICATION,
  MOBILE_APP_SPECIFICATION,
  SECURITY_ARCHITECTURE_SPECIFICATION,
  DEVOPS_CLOUD_SPECIFICATION,
  QA_TESTING_STRATEGY,
  PERFORMANCE_SCALABILITY_SPECIFICATION,
  OBSERVABILITY_SPECIFICATION,
  EXTERNAL_INTEGRATIONS_SPECIFICATION,
  PLATFORM_FOLDER_STRUCTURE,
  PRODUCTION_READINESS_CHECKLIST,
  GO_LIVE_CHECKLIST,
  FUTURE_EXPANSION_ROADMAP
} from '../data/platformSuiteData';
import { PlatformPortal } from '../types/architecture';
import {
  ShieldAlert,
  Building2,
  Pickaxe,
  Factory,
  Truck,
  Navigation,
  HardHat,
  ShoppingBag,
  PackageCheck,
  Store,
  Briefcase,
  UserCheck,
  Globe,
  Landmark,
  BarChart3,
  Server,
  Smartphone,
  ShieldCheck,
  Cpu,
  Layers,
  FolderTree,
  CheckCircle2,
  ChevronRight,
  Zap,
  Lock,
  Activity,
  Database,
  Search,
  Radio,
  FileCheck,
  Rocket,
  Sparkles,
  Cloud,
  Terminal
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  ShieldAlert,
  Building2,
  Pickaxe,
  Factory,
  Truck,
  Navigation,
  HardHat,
  ShoppingBag,
  PackageCheck,
  Store,
  Briefcase,
  UserCheck,
  Globe,
  Landmark,
  BarChart3,
  Server,
  Smartphone,
  ShieldCheck,
  FolderTree
};

export const PlatformSuiteSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'portals' | 'web-mobile' | 'security' | 'devops' | 'qa' | 'integrations' | 'structure' | 'go-live'>('portals');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePortal, setActivePortal] = useState<PlatformPortal>(PLATFORM_PORTALS_DATA[0]);

  const filteredPortals = PLATFORM_PORTALS_DATA.filter(portal => {
    const matchesSearch = portal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          portal.targetUser.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          portal.keyCapabilities.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950/90 via-slate-900 to-indigo-950/70 border border-blue-500/30 p-6 sm:p-8 backdrop-blur-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-semibold uppercase tracking-wider">
              <Rocket className="w-3.5 h-3.5" />
              <span>Phase 12 Enterprise Platform Architecture</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Enterprise Platform, Mobile Apps, Portals & Production Architecture
            </h1>
            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              Complete production architecture for RZ® Minetrix BOS. Features 15 specialized role-based portals, responsive PWA web platform, Android & iOS offline mobile apps, 4-tier RLS security model, cloud-native DevOps CI/CD pipeline, performance scalability, and IoT weighbridge/telematics integrations.
            </p>

            {/* Architectural Philosophy Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono text-blue-300">
              <span className="px-2.5 py-1 rounded bg-slate-950 border border-blue-500/30">15 Specialized Portals</span>
              <span className="text-slate-500">→</span>
              <span className="px-2.5 py-1 rounded bg-slate-950 border border-blue-500/30">Offline PWA & Mobile Shells</span>
              <span className="text-slate-500">→</span>
              <span className="px-2.5 py-1 rounded bg-slate-950 border border-blue-500/30">4-Tier RLS & OAuth2</span>
              <span className="text-slate-500">→</span>
              <span className="px-2.5 py-1 rounded bg-slate-950 border border-blue-500/30">Cloud Run & Terraform</span>
              <span className="text-slate-500">→</span>
              <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-200 border border-blue-500/40 font-bold">Production Ready</span>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-col gap-3 shrink-0">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-blue-500/20 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Specialized Portals</div>
                <div className="text-sm font-bold text-white">15 Role Portals</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-blue-500/20 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Go-Live Status</div>
                <div className="text-sm font-bold text-emerald-400">Production Verified</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-slate-800/80 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('portals')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'portals'
                ? 'bg-blue-500 text-slate-950 font-bold shadow-lg shadow-blue-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>15 Role Portals</span>
          </button>

          <button
            onClick={() => setActiveTab('web-mobile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'web-mobile'
                ? 'bg-blue-500 text-slate-950 font-bold shadow-lg shadow-blue-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Web & Mobile Specs</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'security'
                ? 'bg-blue-500 text-slate-950 font-bold shadow-lg shadow-blue-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Security & RLS</span>
          </button>

          <button
            onClick={() => setActiveTab('devops')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'devops'
                ? 'bg-blue-500 text-slate-950 font-bold shadow-lg shadow-blue-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>DevOps & Cloud</span>
          </button>

          <button
            onClick={() => setActiveTab('qa')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'qa'
                ? 'bg-blue-500 text-slate-950 font-bold shadow-lg shadow-blue-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>QA & Performance</span>
          </button>

          <button
            onClick={() => setActiveTab('integrations')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'integrations'
                ? 'bg-blue-500 text-slate-950 font-bold shadow-lg shadow-blue-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Integrations & IoT</span>
          </button>

          <button
            onClick={() => setActiveTab('structure')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'structure'
                ? 'bg-blue-500 text-slate-950 font-bold shadow-lg shadow-blue-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Folder Structure</span>
          </button>

          <button
            onClick={() => setActiveTab('go-live')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'go-live'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Rocket className="w-4 h-4" />
            <span>Go-Live Checklist</span>
          </button>
        </div>
      </div>

      {/* TAB 1: 15 ROLE PORTALS */}
      {activeTab === 'portals' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search 15 specialized portals..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500/50"
              />
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Showing {filteredPortals.length} of {PLATFORM_PORTALS_DATA.length} Role-Based Portals
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Master List */}
            <div className="lg:col-span-5 space-y-2.5 max-h-[800px] overflow-y-auto pr-1">
              {filteredPortals.map(portal => {
                const IconComponent = ICON_MAP[portal.icon] || Globe;
                const isSelected = activePortal.id === portal.id;

                return (
                  <div
                    key={portal.id}
                    onClick={() => setActivePortal(portal)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-blue-500/10 border-blue-500/40 shadow-lg shadow-blue-500/5'
                        : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg border shrink-0 ${
                        isSelected
                          ? 'bg-blue-500 text-slate-950 border-blue-400 font-bold'
                          : 'bg-slate-800/80 text-blue-400 border-slate-700'
                      }`}>
                        <IconComponent className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                            Portal {portal.number}
                          </span>
                        </div>
                        <h3 className={`text-xs font-bold mt-0.5 truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                          {portal.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {portal.targetUser}
                        </p>
                      </div>

                      <ChevronRight className={`w-4 h-4 shrink-0 mt-1 transition ${isSelected ? 'text-blue-400 translate-x-0.5' : 'text-slate-600'}`} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Portal Detail View */}
            <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {React.createElement(ICON_MAP[activePortal.icon] || Globe, { className: "w-6 h-6" })}
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-blue-400 uppercase tracking-wider">
                      Portal {activePortal.number}
                    </span>
                    <h2 className="text-lg font-bold text-white mt-0.5">
                      {activePortal.title}
                    </h2>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Target User Persona</h4>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-blue-300 font-semibold">
                  {activePortal.targetUser}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span>Key Portal Capabilities</span>
                </h4>
                <div className="space-y-2">
                  {activePortal.keyCapabilities.map((cap, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Core Operational Workflows</span>
                </h4>
                <div className="space-y-2">
                  {activePortal.coreWorkflows.map((wf, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/50 flex items-start gap-2 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{wf}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Security & RLS Permission Scope</span>
                </div>
                <div className="text-xs text-slate-200 font-mono">
                  {activePortal.securityScope}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WEB & MOBILE SPECS */}
      {activeTab === 'web-mobile' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Web Platform */}
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Responsive Web & PWA Shell</h3>
                  <div className="text-xs text-slate-400">{WEB_PLATFORM_SPECIFICATION.architecturePattern}</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Progressive Web App (PWA) Features</div>
                {WEB_PLATFORM_SPECIFICATION.pwaCapabilities.map((pwa, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                    {pwa}
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Key UI/UX Features</div>
                {WEB_PLATFORM_SPECIFICATION.keyFeatures.map((feat, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                    {feat}
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Platform */}
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Android & iOS Native Mobile Apps</h3>
                  <div className="text-xs text-slate-400">{MOBILE_APP_SPECIFICATION.frameworkStack}</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Native Device Capabilities</div>
                {MOBILE_APP_SPECIFICATION.nativeCapabilities.map((cap, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                    {cap}
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                <div className="font-bold mb-1">Target Distribution:</div>
                <div className="font-mono">{MOBILE_APP_SPECIFICATION.targetPlatforms.join(' • ')}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SECURITY & RLS */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-400" />
              <span>Enterprise Security, RBAC & 4-Tier RLS Model</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">Authentication Protocol</div>
                <div className="text-xs text-slate-200 font-mono">{SECURITY_ARCHITECTURE_SPECIFICATION.authentication}</div>
                <div className="text-xs font-bold text-blue-400 uppercase tracking-wider pt-2">Authorization Model</div>
                <div className="text-xs text-slate-200 font-mono">{SECURITY_ARCHITECTURE_SPECIFICATION.authorization}</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Audit & Compliance Ledger</div>
                <div className="text-xs text-slate-300 leading-relaxed">{SECURITY_ARCHITECTURE_SPECIFICATION.auditLedger}</div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">4-Tier Row-Level Security (RLS) Isolation</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SECURITY_ARCHITECTURE_SPECIFICATION.rlsFourTiers.map((tier, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                    <span className="p-1 rounded bg-blue-500/20 text-blue-300 font-mono font-bold text-[10px]">T{idx + 1}</span>
                    <span>{tier}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Data Protection & Cryptography</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SECURITY_ARCHITECTURE_SPECIFICATION.dataProtection.map((prot, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                    {prot}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DEVOPS & CLOUD */}
      {activeTab === 'devops' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Cloud className="w-5 h-5 text-blue-400" />
              <span>DevOps, CI/CD Pipeline & Infrastructure Strategy</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Cloud Provider</div>
                <div className="text-xs text-slate-200 font-mono">{DEVOPS_CLOUD_SPECIFICATION.cloudProvider}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Infrastructure as Code</div>
                <div className="text-xs text-slate-200 font-mono">{DEVOPS_CLOUD_SPECIFICATION.infrastructureAsCode}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">Environments</div>
                <div className="text-xs text-slate-200 font-mono">{DEVOPS_CLOUD_SPECIFICATION.environments.length} Tier Setup (Dev, QA, Staging, Prod)</div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">CI/CD Automated Deployment Steps</h3>
              <div className="space-y-2">
                {DEVOPS_CLOUD_SPECIFICATION.ciCdStrategy.map((step, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: QA & PERFORMANCE */}
      {activeTab === 'qa' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-400" />
              <span>Quality Assurance & Performance Testing Strategy</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* QA Layers */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Testing Matrix & Target Coverage</h3>
                {QA_TESTING_STRATEGY.layers.map((layer, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold text-white">{layer.level}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{layer.tools}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-mono font-bold shrink-0">
                      {layer.coverage}
                    </span>
                  </div>
                ))}
              </div>

              {/* Performance & DR */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Disaster Recovery (RPO / RTO)</h3>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-xs text-emerald-400 font-bold">{PERFORMANCE_SCALABILITY_SPECIFICATION.disasterRecovery.rpo}</div>
                  <div className="text-xs text-blue-400 font-bold">{PERFORMANCE_SCALABILITY_SPECIFICATION.disasterRecovery.rto}</div>
                  <div className="text-xs text-slate-300 mt-2">{PERFORMANCE_SCALABILITY_SPECIFICATION.disasterRecovery.backupFrequency}</div>
                </div>

                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pt-2">Observability Metrics</h3>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
                  <div><strong>Metrics:</strong> {OBSERVABILITY_SPECIFICATION.metrics}</div>
                  <div><strong>Tracing:</strong> {OBSERVABILITY_SPECIFICATION.tracing}</div>
                  <div><strong>Logging:</strong> {OBSERVABILITY_SPECIFICATION.logAggregation}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: INTEGRATIONS & IOT */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-blue-400" />
              <span>External Gateway & IoT Integration Architecture</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {EXTERNAL_INTEGRATIONS_SPECIFICATION.map((ext, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-blue-400">{ext.service}</div>
                  <div className="text-xs text-slate-300 leading-relaxed">{ext.purpose}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: FOLDER STRUCTURE */}
      {activeTab === 'structure' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-blue-400" />
              <span>Enterprise Directory Architecture</span>
            </h2>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-blue-300 leading-relaxed overflow-x-auto">
              <pre>{PLATFORM_FOLDER_STRUCTURE.join('\n')}</pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: GO-LIVE CHECKLIST */}
      {activeTab === 'go-live' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-emerald-500/30 p-6 sm:p-8 rounded-2xl space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Production Readiness & Go-Live Cutover Plan</h2>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold mt-1">
                  <span>APPROVED FOR PRODUCTION DEPLOYMENT</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Production Readiness Audit Checklist</h3>
              <div className="space-y-2">
                {PRODUCTION_READINESS_CHECKLIST.map((chk, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{chk.task}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">{chk.category}</span>
                      </div>
                      <div className="text-slate-400 text-[11px]">{chk.details}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-[10px] shrink-0">
                      {chk.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">7-Step Go-Live Cutover Protocol</h3>
              <div className="space-y-2">
                {GO_LIVE_CHECKLIST.map((step) => (
                  <div key={step.step} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3 text-xs">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-500/30">
                      {step.step}
                    </span>
                    <span className="text-slate-200 flex-1">{step.action}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Future Expansion Roadmap (Post Go-Live)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {FUTURE_EXPANSION_ROADMAP.map((fut, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="text-[10px] font-bold text-blue-400 uppercase">{fut.phase}</div>
                    <div className="text-xs font-bold text-white">{fut.title}</div>
                    <div className="text-xs text-slate-400 leading-relaxed">{fut.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
