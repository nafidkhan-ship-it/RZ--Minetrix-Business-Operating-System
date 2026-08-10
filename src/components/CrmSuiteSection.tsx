import React, { useState } from 'react';
import { 
  CRM_SUITE_MODULES, 
  CRM_PARTNER_ROLES, 
  CUSTOMER_PORTAL_ARCHITECTURE, 
  CRM_BUSINESS_WORKFLOW, 
  CRM_INTEGRATIONS_TOPOLOGY, 
  CRM_FOLDER_STRUCTURE, 
  PHASE8_TRANSITION_REVIEW 
} from '../data/crmSuiteData';
import { CrmSuiteModule } from '../types/architecture';
import { 
  LayoutDashboard, 
  Database, 
  UserPlus, 
  FileQuestion, 
  FileText, 
  ShoppingCart, 
  Contact, 
  Store, 
  Building2, 
  LifeBuoy, 
  FileCheck, 
  Megaphone, 
  Receipt, 
  BarChart3, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  ArrowRight, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Activity, 
  FolderTree, 
  Search, 
  Globe, 
  Users, 
  Truck, 
  Compass, 
  Briefcase, 
  Lock, 
  Headphones, 
  Download, 
  CreditCard 
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  Database,
  UserPlus,
  FileQuestion,
  FileText,
  ShoppingCart,
  Contact,
  Store,
  Building2,
  LifeBuoy,
  FileCheck,
  Megaphone,
  Receipt,
  BarChart3,
  Sparkles,
  Users,
  Truck,
  Compass,
  Briefcase
};

export const CrmSuiteSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'modules' | 'stakeholders' | 'portal' | 'workflows' | 'integrations' | 'structure' | 'review'>('modules');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModule, setActiveModule] = useState<CrmSuiteModule>(CRM_SUITE_MODULES[0]);

  const categories = ['All', 'Lead & Opportunity', 'Sales & Commercial', 'Partner & Network', 'Service & Contracts', 'Marketing & Intelligence'];

  const filteredModules = CRM_SUITE_MODULES.filter(mod => {
    const matchesCategory = selectedCategory === 'All' || mod.category === selectedCategory;
    const matchesSearch = mod.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          mod.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          mod.subModules.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/60 border border-purple-500/20 p-6 sm:p-8 backdrop-blur-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Phase 7 Master Architecture</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              CRM & Business Relationship Suite
            </h1>
            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              Enterprise CX and Relationship Management platform for customer, dealer, supplier, contractor, architect, and broker lifecycles.
              Features 15 core modules, self-service customer portal, multi-tier quotation approvals, automated credit controls, and Gemini AI sales intelligence.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col gap-3 shrink-0">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-purple-500/20 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Stakeholder Coverage</div>
                <div className="text-sm font-bold text-white">Customers, Dealers & Contractors</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-purple-500/20 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Customer Portal</div>
                <div className="text-sm font-bold text-white">24/7 Self-Service & Order Tracking</div>
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
                ? 'bg-purple-500 text-slate-950 font-bold shadow-lg shadow-purple-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>15 CRM Modules</span>
          </button>

          <button
            onClick={() => setActiveTab('stakeholders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'stakeholders'
                ? 'bg-purple-500 text-slate-950 font-bold shadow-lg shadow-purple-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Stakeholder Network</span>
          </button>

          <button
            onClick={() => setActiveTab('portal')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'portal'
                ? 'bg-purple-500 text-slate-950 font-bold shadow-lg shadow-purple-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Self-Service Customer Portal</span>
          </button>

          <button
            onClick={() => setActiveTab('workflows')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'workflows'
                ? 'bg-purple-500 text-slate-950 font-bold shadow-lg shadow-purple-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <ArrowRight className="w-4 h-4" />
            <span>End-to-End Business Lifecycle</span>
          </button>

          <button
            onClick={() => setActiveTab('integrations')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'integrations'
                ? 'bg-purple-500 text-slate-950 font-bold shadow-lg shadow-purple-500/20'
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
                ? 'bg-purple-500 text-slate-950 font-bold shadow-lg shadow-purple-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Folder Structure</span>
          </button>

          <button
            onClick={() => setActiveTab('review')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'review'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Phase 8 Transition Review</span>
          </button>
        </div>
      </div>

      {/* TAB 1: 15 CRM MODULES */}
      {activeTab === 'modules' && (
        <div className="space-y-6">
          {/* Controls: Search & Category Filter */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search CRM modules..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500/50"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30 font-semibold'
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
                const IconComponent = ICON_MAP[mod.icon] || Contact;
                const isSelected = activeModule.id === mod.id;

                return (
                  <div
                    key={mod.id}
                    onClick={() => setActiveModule(mod)}
                    className={`p-4 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-purple-500/10 border-purple-500/40 shadow-lg shadow-purple-500/5'
                        : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-xl border shrink-0 ${
                        isSelected 
                          ? 'bg-purple-500 text-slate-950 border-purple-400 font-bold' 
                          : 'bg-slate-800/80 text-purple-400 border-slate-700'
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
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

                      <ChevronRight className={`w-4 h-4 shrink-0 mt-2 transition ${isSelected ? 'text-purple-400 translate-x-0.5' : 'text-slate-600'}`} />
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
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    {React.createElement(ICON_MAP[activeModule.icon] || Contact, { className: "w-6 h-6" })}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">
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
                  <FolderTree className="w-4 h-4 text-purple-400" />
                  <span>Sub-Modules & Functional Scope</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeModule.subModules.map((sub, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
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
                    <Database className="w-3.5 h-3.5 text-purple-400" />
                    <span>Master Entities</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeModule.masterDataEntities.map(ent => (
                      <span key={ent} className="px-2 py-1 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[11px] font-mono">
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
                    <div className="text-purple-400 flex items-center gap-1 truncate">
                      <span className="text-[10px] text-slate-500">SUB:</span>
                      <span>{activeModule.eventIntegrations.subscribes.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Features if present */}
              {activeModule.aiFeatures && activeModule.aiFeatures.length > 0 && (
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                  <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Gemini AI Integrations</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeModule.aiFeatures.map((ai, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-200 border border-purple-500/30 text-xs">
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

      {/* TAB 2: STAKEHOLDER NETWORK */}
      {activeTab === 'stakeholders' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              <span>Multi-Role Stakeholder Network Topology</span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Unified CRM directory mapping customer accounts, dealer networks, raw material suppliers, construction influencers, and commercial intermediaries.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CRM_PARTNER_ROLES.map((role, idx) => {
                const IconComponent = ICON_MAP[role.icon] || Users;

                return (
                  <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                      <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{role.role}</h3>
                        <p className="text-[11px] text-slate-400">{role.description}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Associated Entities</div>
                      {role.entities.map((ent, entIdx) => (
                        <div key={entIdx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center gap-2 text-xs font-mono text-purple-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span>{ent}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SELF-SERVICE CUSTOMER PORTAL */}
      {activeTab === 'portal' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold mb-1">
                  <Globe className="w-3.5 h-3.5" />
                  <span>⭐ Self-Service Portal</span>
                </div>
                <h2 className="text-lg font-bold text-white">{CUSTOMER_PORTAL_ARCHITECTURE.title}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{CUSTOMER_PORTAL_ARCHITECTURE.description}</p>
              </div>
            </div>

            {/* Portal Features */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span>Customer Self-Service Capabilities</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CUSTOMER_PORTAL_ARCHITECTURE.portalFeatures.map((feat, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                    <h4 className="text-xs font-bold text-purple-300">{feat.feature}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{feat.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: END-TO-END WORKFLOWS */}
      {activeTab === 'workflows' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-purple-400" />
              <span>Full Business Lifecycle Workflow</span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Complete relationship execution from lead ingestion, enquiry feasibility, commercial quotation, multi-suite order allocation, fleet dispatch, site e-POD, GST invoicing, payment collection, CSAT feedback, and AI churn prevention.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {CRM_BUSINESS_WORKFLOW.map((wf) => {
                const IconComponent = ICON_MAP[wf.icon] || ArrowRight;

                return (
                  <div key={wf.step} className="relative bg-slate-950 border border-slate-800/80 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/40 text-xs font-bold flex items-center justify-center">
                          {wf.step}
                        </span>
                        <div className="p-2 rounded-xl bg-slate-900 text-purple-400 border border-slate-800">
                          <IconComponent className="w-5 h-5" />
                        </div>
                      </div>

                      <h3 className="text-sm font-bold text-white">{wf.title}</h3>
                      <div className="text-xs font-medium text-purple-400/90 mb-2">{wf.subtitle}</div>
                      <p className="text-xs text-slate-400 leading-relaxed">{wf.description}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-800/80 space-y-2">
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Entities Created</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {wf.entities.map(e => (
                            <span key={e} className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[10px] font-mono">
                              {e}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Event Signals</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {wf.events.map(ev => (
                            <span key={ev} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-mono">
                              {ev}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: INTEGRATIONS TOPOLOGY */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-purple-400" />
              <span>CRM Cross-Suite Integration Topology</span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Inter-service communication mapping event topics, RPC protocols, and data synchronization across CRM, Mining, Fleet, Building Materials, Marketplace, Finance, and HRMS suites.
            </p>

            <div className="space-y-3">
              {CRM_INTEGRATIONS_TOPOLOGY.map((integ, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 md:w-1/3">
                    <div className="text-xs font-extrabold text-purple-400">{integ.system}</div>
                    <div className="text-xs text-slate-300">{integ.purpose}</div>
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

      {/* TAB 6: FOLDER STRUCTURE */}
      {activeTab === 'structure' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-purple-400" />
              <span>CRM Module Source Code Layout</span>
            </h2>
            <p className="text-xs text-slate-400">
              Clean directory structure for controllers, services, models, event publishers, and interfaces in `/src/modules/crm/`.
            </p>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-purple-300 leading-relaxed overflow-x-auto">
              <pre>{CRM_FOLDER_STRUCTURE.join('\n')}</pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: PHASE 8 TRANSITION REVIEW */}
      {activeTab === 'review' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-emerald-500/30 p-6 sm:p-8 rounded-2xl space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{PHASE8_TRANSITION_REVIEW.title}</h2>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold mt-1">
                  <span>{PHASE8_TRANSITION_REVIEW.status}</span>
                </div>
              </div>
            </div>

            {/* Validated Core Strengths */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Architectural Strengths Validated in Phase 7</span>
              </h3>
              <div className="space-y-2">
                {PHASE8_TRANSITION_REVIEW.validatedCapabilities.map((cap, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Identified Improvements for Phase 8 */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span>Identified Enhancements to Implement in Phase 8</span>
              </h3>
              <div className="space-y-2">
                {PHASE8_TRANSITION_REVIEW.identifiedImprovementsForPhase8.map((imp, idx) => (
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
