import React, { useState } from 'react';
import {
  IMPLEMENTATION_ROADMAP,
  TECH_STACK_SPECIFICATION,
  CODING_AND_DATABASE_STANDARDS,
  UI_UX_DESIGN_SYSTEM,
  FINAL_ARCHITECTURAL_AUDIT
} from '../data/masterBlueprintData';
import {
  Rocket,
  Calendar,
  Layers,
  Code2,
  Database,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  ShieldCheck,
  Zap,
  Globe,
  Palette,
  Server,
  Smartphone,
  Sparkles,
  Award,
  ChevronRight,
  FileCode,
  FolderTree,
  Lock,
  Activity,
  Bot
} from 'lucide-react';

export const MasterBlueprintSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'tech-stack' | 'standards' | 'design-system' | 'audit'>('roadmap');
  const [selectedSprint, setSelectedSprint] = useState(IMPLEMENTATION_ROADMAP[0]);

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/90 via-slate-900 to-blue-950/80 border border-emerald-500/40 p-6 sm:p-8 backdrop-blur-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>Phase 13 Master Development Blueprint</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Final Enterprise Master Blueprint & Implementation Roadmap
            </h1>
            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              Official software development blueprint for RZ® Minetrix BOS Enterprise Edition. Converts the complete 13-phase architecture into an implementation-ready project roadmap covering 6 development sprints, enterprise tech stack specs, coding/database standards, UI design system, and full architectural audit certification.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono text-emerald-300">
              <span className="px-2.5 py-1 rounded bg-slate-950 border border-emerald-500/30">24-Week / 6-Sprint Roadmap</span>
              <span className="text-slate-500">→</span>
              <span className="px-2.5 py-1 rounded bg-slate-950 border border-emerald-500/30">Enterprise Tech Stack</span>
              <span className="text-slate-500">→</span>
              <span className="px-2.5 py-1 rounded bg-slate-950 border border-emerald-500/30">UUID v7 & RLS Standards</span>
              <span className="text-slate-500">→</span>
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-200 border border-emerald-500/40 font-bold">Readiness Certified</span>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-col gap-3 shrink-0">
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Architecture Status</div>
                <div className="text-xs font-extrabold text-emerald-400">Phase 0 - 13 Completed</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-blue-500/30 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                <Rocket className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Dev Readiness</div>
                <div className="text-xs font-extrabold text-blue-400">100% Implementation Ready</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-slate-800/80 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'roadmap'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>24-Week Implementation Roadmap</span>
          </button>

          <button
            onClick={() => setActiveTab('tech-stack')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'tech-stack'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Enterprise Tech Stack</span>
          </button>

          <button
            onClick={() => setActiveTab('standards')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'standards'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Coding & DB Standards</span>
          </button>

          <button
            onClick={() => setActiveTab('design-system')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'design-system'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>UI/UX Design System</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Final Architecture Audit</span>
          </button>
        </div>
      </div>

      {/* TAB 1: IMPLEMENTATION ROADMAP */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sprint List */}
            <div className="lg:col-span-5 space-y-3">
              {IMPLEMENTATION_ROADMAP.map((sprint, idx) => {
                const isSelected = selectedSprint.sprint === sprint.sprint;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedSprint(sprint)}
                    className={`p-4 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                        : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider">
                            {sprint.sprint}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 text-[10px] font-mono">
                            {sprint.duration}
                          </span>
                        </div>
                        <h3 className={`text-xs font-bold mt-1 ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                          {sprint.title}
                        </h3>
                      </div>
                      <ChevronRight className={`w-4 h-4 shrink-0 mt-1 transition ${isSelected ? 'text-emerald-400 translate-x-0.5' : 'text-slate-600'}`} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sprint Detail */}
            <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                    {selectedSprint.sprint} ({selectedSprint.duration})
                  </span>
                  <h2 className="text-lg font-bold text-white mt-0.5">
                    {selectedSprint.title}
                  </h2>
                </div>
                {selectedSprint.criticalPath && (
                  <span className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 text-[10px] font-bold uppercase">
                    Critical Path Task
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Core Deliverables & Modules</span>
                </h4>
                <div className="space-y-2">
                  {selectedSprint.coreDeliverables.map((deliv, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Module Dependencies</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSprint.moduleDependencies.map((dep, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-blue-300 font-mono">
                      {dep}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Risk Assessment & Mitigation Strategy</span>
                </div>
                <div className="text-slate-300">{selectedSprint.riskAssessment}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TECH STACK */}
      {activeTab === 'tech-stack' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <span>Enterprise Cloud SaaS Technology Stack Specifications</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] font-bold text-emerald-400 uppercase">Frontend Web</div>
                <div className="text-xs text-slate-200 font-mono">{TECH_STACK_SPECIFICATION.frontend}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] font-bold text-blue-400 uppercase">Mobile Apps</div>
                <div className="text-xs text-slate-200 font-mono">{TECH_STACK_SPECIFICATION.mobile}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] font-bold text-purple-400 uppercase">Backend Microservices</div>
                <div className="text-xs text-slate-200 font-mono">{TECH_STACK_SPECIFICATION.backend}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] font-bold text-amber-400 uppercase">Relational Database</div>
                <div className="text-xs text-slate-200 font-mono">{TECH_STACK_SPECIFICATION.database}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] font-bold text-cyan-400 uppercase">Authentication Engine</div>
                <div className="text-xs text-slate-200 font-mono">{TECH_STACK_SPECIFICATION.authentication}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] font-bold text-pink-400 uppercase">Storage & Caching</div>
                <div className="text-xs text-slate-200 font-mono">{TECH_STACK_SPECIFICATION.storage} + {TECH_STACK_SPECIFICATION.caching}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] font-bold text-violet-400 uppercase">AI Platform SDK</div>
                <div className="text-xs text-slate-200 font-mono">{TECH_STACK_SPECIFICATION.aiEngine}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] font-bold text-rose-400 uppercase">Maps & Location</div>
                <div className="text-xs text-slate-200 font-mono">{TECH_STACK_SPECIFICATION.maps}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] font-bold text-emerald-400 uppercase">Observability</div>
                <div className="text-xs text-slate-200 font-mono">{TECH_STACK_SPECIFICATION.observability}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STANDARDS */}
      {activeTab === 'standards' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-emerald-400" />
              <span>Software Engineering, Database & API Standards</span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <FileCode className="w-4 h-4" />
                  <span>Coding & Git Standards</span>
                </h3>
                <div className="space-y-2">
                  {CODING_AND_DATABASE_STANDARDS.codingStandards.map((std, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                      {std}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  <span>Database & Schema Standards</span>
                </h3>
                <div className="space-y-2">
                  {CODING_AND_DATABASE_STANDARDS.databaseStandards.map((std, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                      {std}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
                  <Server className="w-4 h-4" />
                  <span>API Design Standards</span>
                </h3>
                <div className="space-y-2">
                  {CODING_AND_DATABASE_STANDARDS.apiStandards.map((std, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                      {std}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DESIGN SYSTEM */}
      {activeTab === 'design-system' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Palette className="w-5 h-5 text-emerald-400" />
              <span>UI/UX Design System Guidelines</span>
            </h2>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Core Color Tokens</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                {UI_UX_DESIGN_SYSTEM.colorPalette.map((col, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="h-10 rounded-lg border border-slate-700/50" style={{ backgroundColor: col.hex }} />
                    <div className="text-xs font-bold text-white">{col.name}</div>
                    <div className="text-[10px] font-mono text-slate-400">{col.hex}</div>
                    <div className="text-[10px] text-slate-400 leading-tight">{col.usage}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Typography Pairing</div>
              <div className="text-xs text-slate-200 font-mono">{UI_UX_DESIGN_SYSTEM.typography}</div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Design System Principles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {UI_UX_DESIGN_SYSTEM.designPrinciples.map((pr, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                    {pr}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: FINAL AUDIT */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-emerald-500/40 p-6 sm:p-8 rounded-2xl space-y-6">
            <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Final Architectural System Audit (Phase 0 to 13)</h2>
                <div className="text-xs text-emerald-400 font-mono font-bold mt-0.5">{FINAL_ARCHITECTURAL_AUDIT.totalPhasesCovered}</div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {FINAL_ARCHITECTURAL_AUDIT.auditSummary}
            </p>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Validated Enterprise Business Suites</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {FINAL_ARCHITECTURAL_AUDIT.validatedSuites.map((suite, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{suite}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950 to-slate-950 border border-emerald-500/50 text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-extrabold uppercase">
                <Sparkles className="w-4 h-4" />
                <span>OFFICIAL VERDICT</span>
              </div>
              <h3 className="text-lg font-black text-white">
                {FINAL_ARCHITECTURAL_AUDIT.readinessVerdict}
              </h3>
              <p className="text-xs text-slate-400 max-w-2xl mx-auto">
                The architecture is 100% frozen, complete, and ready for software development. All modules, APIs, database schemas, portals, and security scopes are fully specified.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
