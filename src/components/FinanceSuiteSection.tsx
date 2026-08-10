import React, { useState } from 'react';
import { 
  FINANCE_SUITE_MODULES, 
  BUSINESS_UNITS_DATA, 
  CHART_OF_ACCOUNTS_STRUCTURE, 
  FINANCIAL_WORKFLOWS, 
  INTEGRATION_TOPOLOGY_DATA, 
  FINANCE_FOLDER_STRUCTURE, 
  SECURITY_AND_AUDIT_STRATEGY, 
  PHASE10_TRANSITION_REVIEW 
} from '../data/financeSuiteData';
import { FinanceSuiteModule } from '../types/architecture';
import { 
  LayoutDashboard, 
  FolderTree, 
  BookOpen, 
  Landmark, 
  Receipt, 
  CreditCard, 
  ShoppingBag, 
  DollarSign, 
  Coins, 
  Building2, 
  Wrench, 
  Users, 
  ShieldCheck, 
  PieChart, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  ArrowRight, 
  Cpu, 
  Zap, 
  Activity, 
  Search, 
  Database, 
  Lock, 
  Layers, 
  BarChart3,
  TrendingUp,
  Briefcase
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  FolderTree,
  BookOpen,
  Landmark,
  Receipt,
  CreditCard,
  ShoppingBag,
  DollarSign,
  Coins,
  Building2,
  Wrench,
  Users,
  ShieldCheck,
  PieChart,
  FileText,
  Sparkles,
  Layers,
  BarChart3,
  TrendingUp,
  Briefcase
};

export const FinanceSuiteSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'modules' | 'coa' | 'workflows' | 'integrations' | 'structure' | 'security' | 'review'>('modules');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModule, setActiveModule] = useState<FinanceSuiteModule>(FINANCE_SUITE_MODULES[0]);

  const categories = ['All', 'Core Financials', 'Operational Accounting', 'Assets & Taxation', 'Control & Intelligence'];

  const filteredModules = FINANCE_SUITE_MODULES.filter(mod => {
    const matchesCategory = selectedCategory === 'All' || mod.category === selectedCategory;
    const matchesSearch = mod.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          mod.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          mod.subModules.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/60 border border-emerald-500/20 p-6 sm:p-8 backdrop-blur-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Phase 9 Master Architecture</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Enterprise Finance, Accounts & Business Intelligence Suite
            </h1>
            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              Centralized financial engine shared across Mining, Fleet & Logistics, Building Materials, CRM, Marketplace, Equipment Rentals, and HRMS. Features 16 core modules, automated double-entry ledger posting, Indian GST/TDS tax compliance, cost-center P&L tracking, and Gemini AI financial copilot.
            </p>

            {/* Architectural Philosophy Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono text-emerald-300">
              <span className="px-2.5 py-1 rounded bg-slate-950 border border-emerald-500/30">One Company</span>
              <span className="text-slate-500">→</span>
              <span className="px-2.5 py-1 rounded bg-slate-950 border border-emerald-500/30">Multiple Business Units</span>
              <span className="text-slate-500">→</span>
              <span className="px-2.5 py-1 rounded bg-slate-950 border border-emerald-500/30">Multiple Cost Centers</span>
              <span className="text-slate-500">→</span>
              <span className="px-2.5 py-1 rounded bg-slate-950 border border-emerald-500/30">Single Finance Engine</span>
              <span className="text-slate-500">→</span>
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-200 border border-emerald-500/40 font-bold">Enterprise Reporting</span>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-col gap-3 shrink-0">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/20 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Ledger Posting</div>
                <div className="text-sm font-bold text-white">100% Automated System JVs</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/20 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Statutory Taxing</div>
                <div className="text-sm font-bold text-white">GST & TDS Compliant</div>
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
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>16 Finance Modules</span>
          </button>

          <button
            onClick={() => setActiveTab('coa')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'coa'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Chart of Accounts & Business Units</span>
          </button>

          <button
            onClick={() => setActiveTab('workflows')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'workflows'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <ArrowRight className="w-4 h-4" />
            <span>Automated Financial Workflows</span>
          </button>

          <button
            onClick={() => setActiveTab('integrations')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'integrations'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
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
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Folder Structure</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'security'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Security, Audit & Scalability</span>
          </button>

          <button
            onClick={() => setActiveTab('review')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'review'
                ? 'bg-blue-500 text-slate-950 font-bold shadow-lg shadow-blue-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Phase 10 Transition Review</span>
          </button>
        </div>
      </div>

      {/* TAB 1: 16 FINANCE MODULES */}
      {activeTab === 'modules' && (
        <div className="space-y-6">
          {/* Controls: Search & Category Filter */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search Finance modules..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold'
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
                const IconComponent = ICON_MAP[mod.icon] || BookOpen;
                const isSelected = activeModule.id === mod.id;

                return (
                  <div
                    key={mod.id}
                    onClick={() => setActiveModule(mod)}
                    className={`p-4 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                        : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-xl border shrink-0 ${
                        isSelected 
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold' 
                          : 'bg-slate-800/80 text-emerald-400 border-slate-700'
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
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

                      <ChevronRight className={`w-4 h-4 shrink-0 mt-2 transition ${isSelected ? 'text-emerald-400 translate-x-0.5' : 'text-slate-600'}`} />
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
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {React.createElement(ICON_MAP[activeModule.icon] || BookOpen, { className: "w-6 h-6" })}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
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
                  <FolderTree className="w-4 h-4 text-emerald-400" />
                  <span>Sub-Modules & Functional Scope</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeModule.subModules.map((sub, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{sub}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Capabilities */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>Key Architectural & Business Capabilities</span>
                </h4>
                <ul className="space-y-2">
                  {activeModule.keyCapabilities.map((cap, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Master Data Entities & Events Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Master Entities</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeModule.masterDataEntities.map(ent => (
                      <span key={ent} className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[11px] font-mono">
                        {ent}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Event Streams</span>
                  </div>
                  <div className="space-y-1 font-mono text-[11px]">
                    <div className="text-emerald-400 flex items-center gap-1 truncate">
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

              {/* AI Features if present */}
              {activeModule.aiFeatures && activeModule.aiFeatures.length > 0 && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Gemini AI CFO Copilot Features</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeModule.aiFeatures.map((ai, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 text-xs">
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

      {/* TAB 2: CHART OF ACCOUNTS & BUSINESS UNITS */}
      {activeTab === 'coa' && (
        <div className="space-y-8">
          {/* Business Units Matrix */}
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              <span>Multi-Business Unit & Cost Center Architecture</span>
            </h2>
            <p className="text-xs text-slate-400">
              6 distinct Business Units sharing the central financial engine, each with specialized cost centers, revenue drivers, and expense allocations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {BUSINESS_UNITS_DATA.map((bu) => (
                <div key={bu.code} className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                        {bu.code}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white">{bu.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">{bu.description}</p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-800/80">
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase">Cost Centers</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {bu.costCenters.map(cc => (
                          <span key={cc} className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[10px] font-mono">
                            {cc}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-emerald-400/90 uppercase">Revenue Streams</div>
                      <p className="text-[11px] text-slate-300 mt-0.5">{bu.keyRevenueStreams.join(', ')}</p>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-rose-400/90 uppercase">Key Expense Drivers</div>
                      <p className="text-[11px] text-slate-300 mt-0.5">{bu.keyExpenseDrivers.join(', ')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart of Accounts Hierarchy */}
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-emerald-400" />
              <span>Hierarchical Chart of Accounts (COA) Structure</span>
            </h2>
            <p className="text-xs text-slate-400">
              6-level numeric account classification system mapping Assets (1000s), Liabilities (2000s), Equity (3000s), Revenue (4000s), COGS (5000s), and Operating Expenses (6000s).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CHART_OF_ACCOUNTS_STRUCTURE.map((group, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="text-sm font-extrabold text-emerald-400 border-b border-slate-800 pb-2">
                    {group.category}
                  </div>

                  <div className="space-y-3">
                    {group.subClasses.map((sc) => (
                      <div key={sc.code} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] font-bold">
                            {sc.code}
                          </span>
                          <span className="text-xs font-bold text-white">{sc.name}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {sc.examples.map(ex => (
                            <span key={ex} className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 text-[10px]">
                              {ex}
                            </span>
                          ))}
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

      {/* TAB 3: AUTOMATED FINANCIAL WORKFLOWS */}
      {activeTab === 'workflows' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-emerald-400" />
              <span>Zero-Duplicate Operational Event to General Ledger Journal Postings</span>
            </h2>
            <p className="text-xs text-slate-400">
              Operational transactions from Mining, Fleet, Building Materials, CRM, Marketplace, and HRMS automatically trigger double-entry GL vouchers with 0 manual re-entry.
            </p>

            <div className="space-y-4">
              {FINANCIAL_WORKFLOWS.map((wf, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                        {wf.source}
                      </span>
                      <h3 className="text-sm font-bold text-white">{wf.trigger}</h3>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800 text-[10px] font-mono">
                      {wf.automationLevel}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-xs text-emerald-300">
                    <span className="text-slate-500 text-[10px] block mb-1">AUTOMATED JOURNAL ENTRY:</span>
                    {wf.journalPosting}
                  </div>

                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <span className="text-slate-500">Cost Center Assignment:</span>
                    <span className="text-slate-300 font-mono">{wf.costCenter}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INTEGRATION TOPOLOGY */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <span>Finance Suite Cross-System Integration Topology</span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Inter-service messaging and RPC protocol mapping connecting Finance with Mining, Fleet, Building Materials, CRM, Marketplace, GSTN, and Banking APIs.
            </p>

            <div className="space-y-3">
              {INTEGRATION_TOPOLOGY_DATA.map((integ, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 md:w-1/3">
                    <div className="text-xs font-extrabold text-emerald-400">{integ.suite}</div>
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

      {/* TAB 5: FOLDER STRUCTURE */}
      {activeTab === 'structure' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-emerald-400" />
              <span>Finance Suite Module Source Code Layout</span>
            </h2>
            <p className="text-xs text-slate-400">
              Clean directory structure for controllers, services, models, event publishers, and interfaces in `/src/modules/finance/`.
            </p>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto">
              <pre>{FINANCE_FOLDER_STRUCTURE.join('\n')}</pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SECURITY, AUDIT & SCALABILITY */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Security */}
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm border-b border-slate-800 pb-3">
                <Lock className="w-5 h-5" />
                <span>Security & Access Control</span>
              </div>
              <div className="space-y-3">
                {SECURITY_AND_AUDIT_STRATEGY.security.map((sec, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    {sec}
                  </div>
                ))}
              </div>
            </div>

            {/* Audit */}
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm border-b border-slate-800 pb-3">
                <ShieldCheck className="w-5 h-5" />
                <span>Audit & Immutability</span>
              </div>
              <div className="space-y-3">
                {SECURITY_AND_AUDIT_STRATEGY.audit.map((aud, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    {aud}
                  </div>
                ))}
              </div>
            </div>

            {/* Scalability */}
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm border-b border-slate-800 pb-3">
                <Zap className="w-5 h-5" />
                <span>Scalability Strategy</span>
              </div>
              <div className="space-y-3">
                {SECURITY_AND_AUDIT_STRATEGY.scalability.map((sca, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    {sca}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: PHASE 10 TRANSITION REVIEW */}
      {activeTab === 'review' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-blue-500/30 p-6 sm:p-8 rounded-2xl space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{PHASE10_TRANSITION_REVIEW.title}</h2>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold mt-1">
                  <span>{PHASE10_TRANSITION_REVIEW.status}</span>
                </div>
              </div>
            </div>

            {/* Validated Core Strengths */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Architectural Strengths Validated in Phase 9</span>
              </h3>
              <div className="space-y-2">
                {PHASE10_TRANSITION_REVIEW.validatedCapabilities.map((cap, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Identified Improvements for Phase 10 */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400" />
                <span>Identified Enhancements to Implement in Phase 10</span>
              </h3>
              <div className="space-y-2">
                {PHASE10_TRANSITION_REVIEW.identifiedImprovementsForPhase10.map((imp, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
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
