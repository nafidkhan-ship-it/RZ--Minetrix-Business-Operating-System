import React, { useState } from 'react';
import {
  BACKEND_FOLDER_STRUCTURE,
  DATABASE_FOUNDATION_STANDARDS,
  CLEAN_ARCHITECTURE_LAYERS,
  REPOSITORY_AND_SERVICE_STANDARDS,
  API_AND_SECURITY_FOUNDATION,
  EVENT_AND_STORAGE_ENGINE,
  IMPLEMENTATION_CHECKLIST,
  ARCHITECTURAL_GAP_REVIEW
} from '../data/backendFoundationData';
import {
  Server,
  Database,
  FolderTree,
  Layers,
  ShieldCheck,
  Code2,
  CheckCircle2,
  Cpu,
  Terminal,
  Lock,
  Activity,
  Zap,
  HardDrive,
  FileCode,
  Radio,
  FileText,
  Key,
  Award,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Cloud,
  Box
} from 'lucide-react';

export const BackendFoundationSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'structure' | 'database' | 'layers' | 'repository' | 'api-security' | 'events-storage' | 'checklist'>('structure');
  const [selectedFolder, setSelectedFolder] = useState(BACKEND_FOLDER_STRUCTURE[0]);

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950/90 via-slate-900 to-indigo-950/80 border border-blue-500/40 p-6 sm:p-8 backdrop-blur-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-semibold uppercase tracking-wider">
              <Server className="w-3.5 h-3.5" />
              <span>Phase 15 Enterprise Database Schema & Backend Foundation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Enterprise Backend Architecture & Database Foundation
            </h1>
            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              Domain-Driven Design (DDD) backend architecture, 6-layer clean architecture stack, UUID v7 database schema standards, generic repository & specification pattern, 4-tier tenant isolation security, BullMQ queue event bus, and cloud file storage pipeline.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono text-blue-300">
              <span className="px-2.5 py-1 rounded bg-slate-950 border border-blue-500/30">DDD 6-Layer Architecture</span>
              <span className="text-slate-500">→</span>
              <span className="px-2.5 py-1 rounded bg-slate-950 border border-blue-500/30">UUID v7 & RLS Isolation</span>
              <span className="text-slate-500">→</span>
              <span className="px-2.5 py-1 rounded bg-slate-950 border border-blue-500/30">Repository & CQRS Pattern</span>
              <span className="text-slate-500">→</span>
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-200 border border-emerald-500/40 font-bold">Foundation Certified</span>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-col gap-3 shrink-0">
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-blue-500/30 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Backend Engine</div>
                <div className="text-xs font-extrabold text-blue-400">Node.js + Express + ESM</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Database Engine</div>
                <div className="text-xs font-extrabold text-emerald-400">PostgreSQL 16 + Drizzle ORM</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-slate-800/80 overflow-x-auto pb-1">
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
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'database'
                ? 'bg-blue-500 text-slate-950 font-bold shadow-lg shadow-blue-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Database Foundation</span>
          </button>

          <button
            onClick={() => setActiveTab('layers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'layers'
                ? 'bg-blue-500 text-slate-950 font-bold shadow-lg shadow-blue-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>6-Layer Clean Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('repository')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'repository'
                ? 'bg-blue-500 text-slate-950 font-bold shadow-lg shadow-blue-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Repositories & Services</span>
          </button>

          <button
            onClick={() => setActiveTab('api-security')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'api-security'
                ? 'bg-blue-500 text-slate-950 font-bold shadow-lg shadow-blue-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>API & Security Foundation</span>
          </button>

          <button
            onClick={() => setActiveTab('events-storage')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'events-storage'
                ? 'bg-blue-500 text-slate-950 font-bold shadow-lg shadow-blue-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Events & Cloud Storage</span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'checklist'
                ? 'bg-blue-500 text-slate-950 font-bold shadow-lg shadow-blue-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Checklist & Readiness</span>
          </button>
        </div>
      </div>

      {/* TAB 1: FOLDER STRUCTURE */}
      {activeTab === 'structure' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2 max-h-[500px] overflow-y-auto">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 pb-2 border-b border-slate-800">
                DDD Backend Directory Tree
              </div>
              {BACKEND_FOLDER_STRUCTURE.map((node, idx) => {
                const isSelected = selectedFolder.path === node.path;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedFolder(node)}
                    className={`p-2.5 rounded-lg border transition cursor-pointer font-mono text-xs flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-500/10 border-blue-500/40 text-blue-300 font-bold'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {node.type === 'dir' ? (
                        <FolderTree className="w-4 h-4 text-blue-400 shrink-0" />
                      ) : (
                        <FileCode className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      <span className="truncate">{node.path}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition ${isSelected ? 'text-blue-400 translate-x-0.5' : 'text-slate-600'}`} />
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  {selectedFolder.type === 'dir' ? (
                    <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      <FolderTree className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <FileCode className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Selected Backend Path</div>
                    <div className="text-sm font-mono font-bold text-white">{selectedFolder.path}</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-slate-950 text-blue-400 text-[10px] font-mono border border-slate-800">
                  {selectedFolder.type.toUpperCase()}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Purpose & Architecture Role</h4>
                <p className="text-xs text-slate-300 leading-relaxed p-4 rounded-xl bg-slate-950 border border-slate-800">
                  {selectedFolder.purpose}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2 text-xs text-blue-300">
                <div className="font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>Domain Isolation Principle</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Every bounded domain module under <code className="text-blue-300">/src/modules/</code> operates as an isolated package containing its own domain entities, use cases, ORM persistence layer, and REST controllers. Cross-module communications occur strictly through Domain Events or explicit Application Service interfaces.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DATABASE FOUNDATION */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-400" />
              <span>Database Foundation & Base Schema Standards</span>
            </h2>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">Primary Key Strategy</div>
              <div className="text-xs text-slate-300">{DATABASE_FOUNDATION_STANDARDS.primaryKeyStrategy}</div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Universal Base Schema Columns (100% of Entity Tables)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {DATABASE_FOUNDATION_STANDARDS.auditColumns.map((col, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 font-mono">{col.name}</span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{col.type}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">{col.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-blue-400 uppercase">Tenant & Isolation Hierarchy</div>
                <div className="text-xs text-slate-300">{DATABASE_FOUNDATION_STANDARDS.tenantIsolationLevel}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-amber-400 uppercase">Soft Delete Policy</div>
                <div className="text-xs text-slate-300">{DATABASE_FOUNDATION_STANDARDS.softDeleteStrategy}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 6-LAYER CLEAN ARCHITECTURE */}
      {activeTab === 'layers' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              <span>DDD 6-Layer Clean Architecture Hierarchy</span>
            </h2>

            <div className="space-y-4">
              {CLEAN_ARCHITECTURE_LAYERS.map((layer, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">{layer.layer}</h3>
                    <div className="flex items-center gap-1">
                      {layer.allowedDependencies.map((dep, dIdx) => (
                        <span key={dIdx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{layer.responsibilities}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REPOSITORIES & SERVICES */}
      {activeTab === 'repository' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-blue-400" />
              <span>Generic Repository, Specification & Service Standards</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400">Repository & CQRS Patterns</h3>
                <div className="space-y-2">
                  {REPOSITORY_AND_SERVICE_STANDARDS.repositoryPatterns.map((pat, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                      {pat}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Service Layer Categories</h3>
                <div className="space-y-2">
                  {REPOSITORY_AND_SERVICE_STANDARDS.serviceCategories.map((cat, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                      {cat}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: API & SECURITY */}
      {activeTab === 'api-security' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-400" />
              <span>Unified API Response Envelope & Security Foundation</span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Standard REST JSON Response Envelope</h3>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto">
                  <pre>{API_AND_SECURITY_FOUNDATION.apiEnvelope}</pre>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Enterprise Security Controls</h3>
                <div className="space-y-2">
                  {API_AND_SECURITY_FOUNDATION.securityGuards.map((sec, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                      <Lock className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                      <span>{sec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: EVENTS & STORAGE */}
      {activeTab === 'events-storage' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-blue-400" />
              <span>Event Bus Architecture & Cloud File Storage Engine</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-blue-400 uppercase flex items-center gap-2">
                  <Radio className="w-4 h-4 text-blue-400" />
                  <span>Pub/Sub & Event Bus</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{EVENT_AND_STORAGE_ENGINE.eventBus}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-emerald-400" />
                  <span>Cloud Storage Engine</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{EVENT_AND_STORAGE_ENGINE.storageEngine}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-purple-400 uppercase flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <span>Logging & Tracing</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{EVENT_AND_STORAGE_ENGINE.loggingObservability}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: CHECKLIST & READINESS */}
      {activeTab === 'checklist' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-blue-500/40 p-6 sm:p-8 rounded-2xl space-y-6">
            <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
              <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/40">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Backend Foundation Readiness Audit</h2>
                <div className="text-xs text-blue-400 font-mono font-bold mt-0.5">{ARCHITECTURAL_GAP_REVIEW.reviewVerdict}</div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {ARCHITECTURAL_GAP_REVIEW.notes}
            </p>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Implementation Foundation Checklist</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {IMPLEMENTATION_CHECKLIST.map((chk, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-200 font-medium">{chk.item}</span>
                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold font-mono text-[11px] bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{chk.status}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950 to-slate-950 border border-blue-500/50 text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-extrabold uppercase">
                <Sparkles className="w-4 h-4" />
                <span>OFFICIAL VERDICT</span>
              </div>
              <h3 className="text-lg font-black text-white">
                BACKEND ARCHITECTURE READY FOR BUSINESS SUITE MODULES
              </h3>
              <p className="text-xs text-slate-400 max-w-2xl mx-auto">
                The database schema standards, 6-layer clean architecture, repository patterns, security controls, and event infrastructure are 100% frozen and ready for business suite development.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
