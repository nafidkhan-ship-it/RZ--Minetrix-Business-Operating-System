import React, { useState } from 'react';
import { 
  AI_SUITE_MODULES, 
  AUTOMATION_WORKFLOWS_DATA, 
  AI_INTEGRATION_TOPOLOGY, 
  AI_FOLDER_STRUCTURE, 
  AI_PROMPT_GOVERNANCE_AND_SECURITY, 
  PHASE12_TRANSITION_REVIEW 
} from '../data/aiSuiteData';
import { AiSuiteModule } from '../types/architecture';
import { 
  LayoutDashboard, 
  Bot, 
  FileScan, 
  Mic, 
  Workflow, 
  Lightbulb, 
  TrendingUp, 
  Brain, 
  BellRing, 
  Search, 
  FileBarChart, 
  BarChart3, 
  BookOpen, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  ArrowRight, 
  Cpu, 
  Zap, 
  Activity, 
  Database, 
  Lock, 
  ShieldCheck, 
  FolderTree, 
  HelpCircle,
  Clock,
  Layers
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  Bot,
  FileScan,
  Mic,
  Workflow,
  Lightbulb,
  TrendingUp,
  Brain,
  BellRing,
  Search,
  FileBarChart,
  BarChart3,
  BookOpen,
  ShieldAlert,
  FolderTree,
  Sparkles
};

export const AiSuiteSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'modules' | 'workflows' | 'integrations' | 'structure' | 'governance' | 'review'>('modules');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModule, setActiveModule] = useState<AiSuiteModule>(AI_SUITE_MODULES[0]);

  const categories = ['All', 'Command & Copilot', 'Document & Voice AI', 'Automation & Rules', 'Predictive & Decision Intelligence', 'Search & Knowledge', 'Security & Governance'];

  const filteredModules = AI_SUITE_MODULES.filter(mod => {
    const matchesCategory = selectedCategory === 'All' || mod.category === selectedCategory;
    const matchesSearch = mod.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          mod.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          mod.subModules.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-950/90 via-slate-900 to-indigo-950/70 border border-violet-500/30 p-6 sm:p-8 backdrop-blur-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/30 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Phase 11 Master Architecture</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI Platform, Automation & Enterprise Intelligence Suite
            </h1>
            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              Shared enterprise intelligence layer servicing all business suites (Mining, Fleet, Building Materials, CRM, Marketplace, Finance, HRMS). Features 14 modular AI services, multi-modal OCR vision, conversational Gemini Copilot, speech recognition, event-driven business automation engine, predictive analytics, and prompt governance guardrails.
            </p>

            {/* Architectural Philosophy Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono text-violet-300">
              <span className="px-2.5 py-1 rounded bg-slate-950 border border-violet-500/30">Shared AI Microservice</span>
              <span className="text-slate-500">→</span>
              <span className="px-2.5 py-1 rounded bg-slate-950 border border-violet-500/30">Server-Side Gemini APIs</span>
              <span className="text-slate-500">→</span>
              <span className="px-2.5 py-1 rounded bg-slate-950 border border-violet-500/30">Event-Driven Automation</span>
              <span className="text-slate-500">→</span>
              <span className="px-2.5 py-1 rounded bg-slate-950 border border-violet-500/30">Prompt Governance & Privacy</span>
              <span className="text-slate-500">→</span>
              <span className="px-2.5 py-1 rounded bg-violet-500/20 text-violet-200 border border-violet-500/40 font-bold">Enterprise Intelligence</span>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-col gap-3 shrink-0">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-violet-500/20 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400">AI Modules</div>
                <div className="text-sm font-bold text-white">14 Core Services</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-violet-500/20 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Workflow className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Automation Engine</div>
                <div className="text-sm font-bold text-white">Cross-Suite Event Flows</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-slate-800/80 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('modules')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'modules'
                ? 'bg-violet-500 text-slate-950 font-bold shadow-lg shadow-violet-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>14 AI Modules</span>
          </button>

          <button
            onClick={() => setActiveTab('workflows')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'workflows'
                ? 'bg-violet-500 text-slate-950 font-bold shadow-lg shadow-violet-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Workflow className="w-4 h-4" />
            <span>Automation Workflows</span>
          </button>

          <button
            onClick={() => setActiveTab('integrations')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'integrations'
                ? 'bg-violet-500 text-slate-950 font-bold shadow-lg shadow-violet-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Integration Topology</span>
          </button>

          <button
            onClick={() => setActiveTab('structure')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'structure'
                ? 'bg-violet-500 text-slate-950 font-bold shadow-lg shadow-violet-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Folder Structure</span>
          </button>

          <button
            onClick={() => setActiveTab('governance')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'governance'
                ? 'bg-violet-500 text-slate-950 font-bold shadow-lg shadow-violet-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Prompt Governance & Security</span>
          </button>

          <button
            onClick={() => setActiveTab('review')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'review'
                ? 'bg-purple-500 text-slate-950 font-bold shadow-lg shadow-purple-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Phase 12 Transition Plan</span>
          </button>
        </div>
      </div>

      {/* TAB 1: 14 AI MODULES */}
      {activeTab === 'modules' && (
        <div className="space-y-6">
          {/* Controls: Search & Category Filter */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search AI modules..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-violet-500/50"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Master Detail View Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Module Selection List */}
            <div className="lg:col-span-5 space-y-3 max-h-[800px] overflow-y-auto pr-1">
              {filteredModules.map(mod => {
                const IconComponent = ICON_MAP[mod.icon] || Brain;
                const isSelected = activeModule.id === mod.id;

                return (
                  <div
                    key={mod.id}
                    onClick={() => setActiveModule(mod)}
                    className={`p-4 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-violet-500/10 border-violet-500/40 shadow-lg shadow-violet-500/5'
                        : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-xl border shrink-0 ${
                        isSelected 
                          ? 'bg-violet-500 text-slate-950 border-violet-400 font-bold' 
                          : 'bg-slate-800/80 text-violet-400 border-slate-700'
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider">
                            Module {mod.number}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                            {mod.category}
                          </span>
                        </div>
                        <h3 className={`text-sm font-bold mt-1 truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                          {mod.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                          {mod.summary}
                        </p>
                      </div>

                      <ChevronRight className={`w-4 h-4 shrink-0 mt-2 transition ${isSelected ? 'text-violet-400 translate-x-0.5' : 'text-slate-600'}`} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Deep Module Specification Card */}
            <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
              {/* Module Title Header */}
              <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                    {React.createElement(ICON_MAP[activeModule.icon] || Brain, { className: "w-6 h-6" })}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-violet-400 uppercase tracking-wider">
                        Module {activeModule.number}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {activeModule.category}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-white mt-0.5">
                      {activeModule.title}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Module Summary</h4>
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                  {activeModule.summary}
                </p>
              </div>

              {/* Sub-Modules Breakdown */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <FolderTree className="w-4 h-4 text-violet-400" />
                  <span>Sub-Services & Functional Scope</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeModule.subModules.map((sub, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                      <span>{sub}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Capabilities */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-violet-400" />
                  <span>Key Architectural & AI Capabilities</span>
                </h4>
                <ul className="space-y-2">
                  {activeModule.keyCapabilities.map((cap, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Master Data Entities & Events Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-violet-400" />
                    <span>Master Entities</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeModule.masterDataEntities.map(ent => (
                      <span key={ent} className="px-2 py-1 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20 text-[11px] font-mono">
                        {ent}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Event Streams</span>
                  </div>
                  <div className="space-y-1 font-mono text-[11px]">
                    <div className="text-violet-400 flex items-center gap-1 truncate">
                      <span className="text-[10px] text-slate-500">PUB:</span>
                      <span>{activeModule.eventIntegrations.publishes.join(', ')}</span>
                    </div>
                    <div className="text-cyan-400 flex items-center gap-1 truncate">
                      <span className="text-[10px] text-slate-500">SUB:</span>
                      <span>{activeModule.eventIntegrations.subscribes.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Features */}
              {activeModule.aiFeatures && activeModule.aiFeatures.length > 0 && (
                <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/30">
                  <div className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Gemini AI Implementation Highlights</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeModule.aiFeatures.map((ai, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-violet-500/20 text-violet-200 border border-violet-500/30 text-xs">
                        {ai}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AUTOMATION WORKFLOWS */}
      {activeTab === 'workflows' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Workflow className="w-5 h-5 text-violet-400" />
              <span>Smart Event-Driven Automation Workflows</span>
            </h2>
            <p className="text-xs text-slate-400">
              Autonomous end-to-end event chains orchestrating operations across Mining, Fleet, Materials, CRM, Finance, and HRMS.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {AUTOMATION_WORKFLOWS_DATA.map((wf, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20 text-xs font-mono font-bold">
                        W{idx + 1}
                      </span>
                      <span>{wf.title}</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">{wf.description}</p>
                  </div>

                  <div className="space-y-3">
                    {wf.steps.map((st) => (
                      <div key={st.step} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-violet-500/30">
                          {st.step}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-white">{st.title}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{st.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INTEGRATION TOPOLOGY */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-violet-400" />
              <span>AI Microservice Cross-Suite Integration Topology</span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Inter-service integration map showing how the shared AI Platform services every business suite across RZ® Minetrix BOS.
            </p>

            <div className="space-y-3">
              {AI_INTEGRATION_TOPOLOGY.map((integ, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 md:w-1/3">
                    <div className="text-xs font-extrabold text-violet-400">{integ.suite}</div>
                    <div className="text-xs text-slate-300">{integ.interaction}</div>
                  </div>

                  <div className="md:w-2/3 flex items-center justify-end">
                    <span className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 text-xs font-mono">
                      {integ.protocol}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FOLDER STRUCTURE */}
      {activeTab === 'structure' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-violet-400" />
              <span>AI Platform Source Code Directory Architecture</span>
            </h2>
            <p className="text-xs text-slate-400">
              Clean modular structure located in `/src/modules/ai/` isolating controllers, services, models, event handlers, and interfaces.
            </p>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-violet-300 leading-relaxed overflow-x-auto">
              <pre>{AI_FOLDER_STRUCTURE.join('\n')}</pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PROMPT GOVERNANCE & SECURITY */}
      {activeTab === 'governance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Prompt Governance */}
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-violet-400 font-bold text-sm border-b border-slate-800 pb-3">
                <ShieldAlert className="w-5 h-5" />
                <span>Prompt Governance</span>
              </div>
              <div className="space-y-3">
                {AI_PROMPT_GOVERNANCE_AND_SECURITY.promptGovernance.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Security Model */}
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm border-b border-slate-800 pb-3">
                <Lock className="w-5 h-5" />
                <span>Security & Privacy</span>
              </div>
              <div className="space-y-3">
                {AI_PROMPT_GOVERNANCE_AND_SECURITY.securityModel.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Scalability Strategy */}
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm border-b border-slate-800 pb-3">
                <Zap className="w-5 h-5" />
                <span>Scalability & Performance</span>
              </div>
              <div className="space-y-3">
                {AI_PROMPT_GOVERNANCE_AND_SECURITY.scalabilityStrategy.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: PHASE 12 TRANSITION REVIEW */}
      {activeTab === 'review' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-purple-500/30 p-6 sm:p-8 rounded-2xl space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{PHASE12_TRANSITION_REVIEW.title}</h2>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-bold mt-1">
                  <span>{PHASE12_TRANSITION_REVIEW.status}</span>
                </div>
              </div>
            </div>

            {/* Validated Core Strengths */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Architectural Strengths Validated in Phase 11</span>
              </h3>
              <div className="space-y-2">
                {PHASE12_TRANSITION_REVIEW.validatedCapabilities.map((cap, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Identified Improvements for Phase 12 */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span>Identified Enhancements to Implement in Phase 12</span>
              </h3>
              <div className="space-y-2">
                {PHASE12_TRANSITION_REVIEW.identifiedImprovementsForPhase12.map((imp, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                    <span>{imp}</span>
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
