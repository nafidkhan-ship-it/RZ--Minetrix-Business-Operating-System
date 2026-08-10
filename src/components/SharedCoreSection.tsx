import React, { useState } from 'react';
import { SHARED_CORE_MODULES, SHARED_CORE_SERVICES_MAP, PHASE4_READINESS_REVIEW } from '../data/sharedCoreData';
import { 
  Box, ShieldCheck, KeyRound, Building2, Users, Database, Bell, FolderKanban, Receipt, UserCheck, 
  LayoutDashboard, BarChart3, Sparkles, Network, Activity, HardDriveDownload, GitFork, ChevronRight, 
  CheckCircle2, ArrowRight, Layers, AlertTriangle, Lock, Cpu
} from 'lucide-react';

export const SharedCoreSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('identity-auth');

  const categories = ['All', 'Security & Auth', 'Data & Multi-Tenancy', 'Integration & Ops', 'Intelligence & Workflows'];

  const filteredModules = activeCategory === 'All' 
    ? SHARED_CORE_MODULES 
    : SHARED_CORE_MODULES.filter(m => m.category === activeCategory);

  const selectedModule = SHARED_CORE_MODULES.find(m => m.id === selectedModuleId) || SHARED_CORE_MODULES[0];

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'KeyRound': return <KeyRound className="w-5 h-5 text-amber-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'Building2': return <Building2 className="w-5 h-5 text-sky-400" />;
      case 'Users': return <Users className="w-5 h-5 text-indigo-400" />;
      case 'Database': return <Database className="w-5 h-5 text-amber-400" />;
      case 'Bell': return <Bell className="w-5 h-5 text-purple-400" />;
      case 'FolderKanban': return <FolderKanban className="w-5 h-5 text-blue-400" />;
      case 'Receipt': return <Receipt className="w-5 h-5 text-emerald-400" />;
      case 'UserCheck': return <UserCheck className="w-5 h-5 text-teal-400" />;
      case 'LayoutDashboard': return <LayoutDashboard className="w-5 h-5 text-orange-400" />;
      case 'BarChart3': return <BarChart3 className="w-5 h-5 text-rose-400" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-amber-300" />;
      case 'Network': return <Network className="w-5 h-5 text-cyan-400" />;
      case 'Activity': return <Activity className="w-5 h-5 text-emerald-400" />;
      case 'HardDriveDownload': return <HardDriveDownload className="w-5 h-5 text-sky-400" />;
      case 'GitFork': return <GitFork className="w-5 h-5 text-violet-400" />;
      default: return <Box className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
          <Box className="w-4 h-4" />
          <span>Phase 3 — Shared Core Platform Architecture</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white mt-1">Universal Shared Core Platform</h2>
        <p className="text-slate-400 text-sm mt-2 max-w-4xl leading-relaxed">
          The Shared Core serves as the enterprise backbone for RZ® Minetrix BOS. Engineered for high performance, multi-tenancy, zero-trust security, and loose coupling, every business suite consumes these 16 core services with zero duplicate business logic.
        </p>
      </div>

      {/* Shared Services Quick Map */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" /> Microservices Map & Shared Core Topology
          </h3>
          <span className="text-xs text-amber-400 font-mono bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            16 Bounded Core Services
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SHARED_CORE_SERVICES_MAP.map((cat, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">{cat.category}</h4>
              <ul className="space-y-2">
                {cat.services.map((svc, sIdx) => (
                  <li key={sIdx} className="text-xs text-slate-300 flex items-center gap-2 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>{svc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 16 Shared Core Modules Interactive Explorer */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-amber-400" /> 16 Shared Core Module Specifications
            </h3>
            <p className="text-xs text-slate-400 mt-1">Select a module to inspect its responsibilities, service boundaries, event streams, and security policies.</p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-900 border border-slate-800 rounded-xl">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Explorer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left List of Modules */}
          <div className="lg:col-span-5 space-y-2 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
            {filteredModules.map((mod) => {
              const isSelected = mod.id === selectedModuleId;
              return (
                <button
                  key={mod.id}
                  onClick={() => setSelectedModuleId(mod.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-md'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 shrink-0">
                    {getModuleIcon(mod.icon)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                        MOD #{mod.number < 10 ? `0${mod.number}` : mod.number}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono truncate">{mod.category}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white mt-1 truncate">{mod.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{mod.summary}</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 self-center transition ${isSelected ? 'text-amber-400 translate-x-0.5' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>

          {/* Right Selected Module Deep Dive Panel */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30">
                  {getModuleIcon(selectedModule.icon)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      MODULE #{selectedModule.number}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{selectedModule.category}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">{selectedModule.title}</h3>
                </div>
              </div>

              <div className="text-right hidden sm:block">
                <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-mono">Tech Stack</span>
                <span className="text-xs text-amber-300 font-mono font-semibold">{selectedModule.techStack}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              {selectedModule.summary}
            </p>

            {/* Key Responsibilities */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Key Architectural Responsibilities
              </h4>
              <ul className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
                {selectedModule.keyResponsibilities.map((resp, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Service Boundaries & Security */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Box className="w-3.5 h-3.5" /> Service Boundaries
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  {selectedModule.serviceBoundaries.map((sb, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-sky-400 font-bold">›</span>
                      <span>{sb}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> Security & Policy
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  {selectedModule.securityAndPermissions.map((sp, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">›</span>
                      <span>{sp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Event Streams */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
              <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider font-sans flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" /> Kafka / NATS Event Streams
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-emerald-400 block font-bold mb-1 uppercase">Publishes Events:</span>
                  <div className="space-y-1">
                    {selectedModule.eventStreams.publishes.map((evt, idx) => (
                      <div key={idx} className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
                        {evt}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-amber-400 block font-bold mb-1 uppercase">Subscribes To:</span>
                  <div className="space-y-1">
                    {selectedModule.eventStreams.subscribes.length > 0 ? (
                      selectedModule.eventStreams.subscribes.map((evt, idx) => (
                        <div key={idx} className="p-1.5 rounded bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
                          {evt}
                        </div>
                      ))
                    ) : (
                      <div className="p-1.5 rounded bg-slate-900 text-slate-500 text-[11px]">None (Autonomous Source)</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Suite Consumers */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-400">Suite Consumers:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedModule.suiteConsumers.map((sc, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-amber-300 border border-slate-700">
                    {sc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Multi-Tenant Isolation Strategy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security & Permission Scoping Matrix */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
            <Lock className="w-5 h-5" />
            <h3>Security & Fine-Grained Permission Scoping Model</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The Shared Core implements a zero-trust policy model blending Role-Based Access Control (RBAC), Attribute-Based Access Control (ABAC), and PostgreSQL Row-Level Security (RLS).
          </p>

          <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs">
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-amber-400 font-bold">1. Feature Permissions (RBAC)</div>
              <div className="text-slate-400">Grants capability to invoke routes (e.g., `mining:gatepass:create`, `finance:journal:post`).</div>
            </div>

            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-emerald-400 font-bold">2. Data Scoping Permissions (4-Tier)</div>
              <div className="text-slate-400">Restricts records by `tenant_id`, `company_id`, `branch_id`, and `business_unit_id`.</div>
            </div>

            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-sky-400 font-bold">3. Field-Level Redaction</div>
              <div className="text-slate-400">Masks sensitive columns (e.g. profit margins, royalty pass rates) based on user role.</div>
            </div>

            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-purple-400 font-bold">4. Dynamic Shift & Location ABAC</div>
              <div className="text-slate-400">Restricts weighbridge operators to active shift times and geofenced branch IPs.</div>
            </div>
          </div>
        </div>

        {/* Tenant Isolation Strategy */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
            <Building2 className="w-5 h-5" />
            <h3>Multi-Tenant Data Isolation & RLS Policy</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every database query executed across RZ® Minetrix BOS automatically passes through the PostgreSQL Row-Level Security (RLS) enforcement engine.
          </p>

          <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs border border-slate-800 space-y-2 text-slate-300">
            <div className="text-amber-400 font-bold">// PostgreSQL Row-Level Security Policy Specification</div>
            <div className="p-3 rounded bg-slate-900 text-amber-300 border border-slate-800 overflow-x-auto">
              <pre>{`ALTER TABLE gate_passes ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_gate_passes ON gate_passes
  FOR ALL
  TO authenticated_app_user
  USING (
    tenant_id = current_setting('app.current_tenant_id')::uuid
    AND (
      branch_id = current_setting('app.current_branch_id')::uuid
      OR current_setting('app.is_executive_user')::boolean = true
    )
  );`}</pre>
            </div>
            <div className="text-slate-400 text-[11px] pt-1">
              Guarantees zero cross-tenant data leakage even in the event of an application-level SQL query defect.
            </div>
          </div>
        </div>
      </div>

      {/* Scalability, DR Strategy & Backup */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
          <HardDriveDownload className="w-5 h-5" />
          <h3>Scalability, High Availability & Disaster Recovery (DR) Guarantees</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Continuity & Recovery</div>
            <p className="text-xs text-white font-bold">RPO &lt; 1 Minute | RTO &lt; 15 Minutes</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Continuous Write-Ahead Log (WAL) streaming replication across multi-region availability zones.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Point-In-Time Recovery</div>
            <p className="text-xs text-white font-bold">35-Day Rolling Restoration Window</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Granular per-second database restoration capability to reverse accidental data loss or corruption.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-sky-400 uppercase tracking-wider">Air-Gapped Cold Backup</div>
            <p className="text-xs text-white font-bold">Encrypted AWS S3 Glacier Vault</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Daily immutable encrypted snapshots secured with customer-managed AES-256 KMS keys.
            </p>
          </div>
        </div>
      </div>

      {/* Phase 4 Readiness Review Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/30 shadow-2xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-amber-500/20 pb-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-amber-400" />
            <h3 className="text-lg font-extrabold text-white">{PHASE4_READINESS_REVIEW.title}</h3>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-extrabold bg-amber-500 text-slate-950 shadow-md">
            {PHASE4_READINESS_REVIEW.phase4ReadinessStatus}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Architectural Strengths Validated:</h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {PHASE4_READINESS_REVIEW.strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Next-Phase Fine-Tuning Recommendations:
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {PHASE4_READINESS_REVIEW.identifiedImprovements.map((imp, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">→</span>
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
