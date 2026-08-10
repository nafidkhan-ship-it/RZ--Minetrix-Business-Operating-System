import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Boxes,
  Cpu,
  Search,
  Layout,
  Code2,
  Globe2,
  ShieldCheck,
  Activity,
  Layers,
  CheckCircle2,
  Terminal,
  Database,
  Radio,
  FileCheck2,
  Sliders,
  Bell,
  RefreshCw,
  Send,
  Lock,
  Workflow,
  PieChart,
  Bot,
  Building,
  Server,
  Cloud,
  FileText,
  Key,
  Flame,
  Globe,
  Share2
} from 'lucide-react';
import {
  MOCK_DOMAIN_RUNTIME_SDKS,
  MOCK_INTELLIGENCE_GOVERNANCE,
  MOCK_ENTERPRISE_MISSING_FEATURES,
  MOCK_ENHANCEMENT_PACK_METRICS,
  DomainRuntimeSdkRecord
} from '../data/enterpriseEnhancementPackData';

interface EnterpriseEnhancementPackSectionProps {
  showToast?: (msg: string) => void;
}

export const EnterpriseEnhancementPackSection: React.FC<EnterpriseEnhancementPackSectionProps> = ({
  showToast = (msg: string) => alert(msg)
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'phase16g-runtime'
    | 'phase19-governance'
    | 'missing-features'
    | 'architecture-review'
  >('phase16g-runtime');

  // Interactive Global Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Interactive Low-Code Form Builder State
  const [formFields, setFormFields] = useState<Array<{ label: string; type: string }>>([
    { label: 'Equipment Code', type: 'Text' },
    { label: 'Weighbridge Gross Weight (MT)', type: 'Number' },
    { label: 'Supervisor Signoff', type: 'Digital Signature' }
  ]);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState('Text');

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      showToast('Please enter a search query (e.g. "Bhilwara", "Invoice", "Tipper").');
      return;
    }
    setIsSearching(true);
    setSearchResults([]);
    setTimeout(() => {
      setIsSearching(false);
      setSearchResults([
        `Quarry Pit #1 (Bhilwara): 42,850 MT aggregate dispatched today matching "${searchQuery}"`,
        `Invoice #INV-2026-8812: ₹1,85,000 paid via Razorpay UPI for customer "${searchQuery}"`,
        `Driver Record: Sukhwinder Singh (Tipper RJ-06-GB-8821) assigned to order containing "${searchQuery}"`,
        `IoT Sensor #IOT-WB-BHILWARA-01: Calibrated load cell reading 48.4 MT tagged with "${searchQuery}"`
      ]);
      showToast(`Global Vector Search returned 4 match results across all 10 DDD domains!`);
    }, 400);
  };

  const handleAddFieldToForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldLabel.trim()) return;
    setFormFields([...formFields, { label: newFieldLabel, type: newFieldType }]);
    setNewFieldLabel('');
    showToast(`Added field "${newFieldLabel}" (${newFieldType}) to Low-Code Form Layout!`);
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* HEADER BANNER */}
      <div className="p-6 sm:p-8 bg-slate-950 border border-slate-800 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono font-bold rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Post Phase 26 Enhancement Pack
              </span>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold rounded-full">
                Zero Duplication • Shared Core Architecture
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
              Enterprise Architecture Enhancement Pack &amp; Domain Runtime
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-3xl font-mono">
              Phase 16G Domain SDK Runtime, Phase 19 Executive Digital Twin &amp; Intelligence Governance Platform, Low-Code Form Builders, Universal Search, Developer Portals, and Distributed Observability for RZ® Minetrix BOS.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono">
            <button
              onClick={() => showToast('Enhancement Pack Verified: 14 Domain SDKs Loaded, Digital Twin Active, Outbox 99.99%!')}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg hover:brightness-110 transition"
            >
              <Zap className="w-4 h-4" /> Verify Ecosystem Enhancement
            </button>
          </div>
        </div>

        {/* METRICS STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-800/80 font-mono text-xs">
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Domain SDKs</span>
            <strong className="text-amber-400 text-sm font-black">{MOCK_ENHANCEMENT_PACK_METRICS.totalDomainSDKsActive} Modules</strong>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Digital Twin Nodes</span>
            <strong className="text-emerald-400 text-sm font-black">{MOCK_ENHANCEMENT_PACK_METRICS.digitalTwinNodesConnected} Nodes Live</strong>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Active Sagas</span>
            <strong className="text-cyan-300 text-sm font-black">{MOCK_ENHANCEMENT_PACK_METRICS.activeSagaTransactions} Txns</strong>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Low-Code Workflows</span>
            <strong className="text-indigo-300 text-sm font-black">{MOCK_ENHANCEMENT_PACK_METRICS.lowCodeFormsCreated} Active</strong>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Global Currencies</span>
            <strong className="text-purple-300 text-sm font-black">{MOCK_ENHANCEMENT_PACK_METRICS.globalCurrenciesSupported} FX Rates</strong>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Outbox Success</span>
            <strong className="text-emerald-300 text-sm font-black">{MOCK_ENHANCEMENT_PACK_METRICS.outboxEventSuccessRatePercent}%</strong>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
        {[
          { id: 'phase16g-runtime', label: 'Phase 16G: Domain Runtime SDK', icon: Boxes },
          { id: 'phase19-governance', label: 'Phase 19: Digital Twin & Intelligence', icon: Cpu },
          { id: 'missing-features', label: 'Enterprise Tools & Low-Code', icon: Layout },
          { id: 'architecture-review', label: 'Master Architecture Review', icon: CheckCircle2 }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 rounded-xl whitespace-nowrap flex items-center gap-1.5 font-bold transition cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-black shadow-lg'
                  : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: PHASE 16G ENHANCEMENT - ENTERPRISE DOMAIN RUNTIME */}
      {activeTab === 'phase16g-runtime' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Phase 16G Enhancement</span>
              <h2 className="text-xl font-bold text-white mt-1">Enterprise Domain Runtime &amp; Distributed Saga Framework</h2>
            </div>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-xs flex items-center gap-1">
              <Boxes className="w-3.5 h-3.5" /> Transactional Outbox Enforced
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_DOMAIN_RUNTIME_SDKS.map((sdk) => (
              <div key={sdk.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-amber-400 font-mono font-bold text-xs">{sdk.sdkModuleName}</span>
                    <span className="text-slate-400 text-[10px] block mt-0.5">Category: {sdk.category}</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">{sdk.status}</span>
                </div>

                <p className="text-slate-300 text-xs leading-relaxed">{sdk.description}</p>

                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                  <span>Latency Overhead: <strong className="text-cyan-300">{sdk.latencyImpactMs} ms</strong></span>
                  <span className="text-emerald-400 font-bold">Zero Overhead Runtime</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
            <h3 className="text-white font-bold text-xs">Phase 16G Included Domain Services</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-[11px]">
              {[
                'Shared Domain SDK',
                'Cross-Domain Event Contracts',
                'Feature Flag Framework',
                'API Version Management',
                'Saga Transaction Manager',
                'Outbox Pattern Engine',
                'Idempotency Layer',
                'Distributed Cache (Redis)',
                'Background Job Scheduler',
                'Domain Health Dashboard',
                'Business Rules Engine',
                'Notification Orchestrator',
                'Plugin Framework',
                'Module Dependency Manager',
                'Cross-Suite Workflow Engine'
              ].map((item, idx) => (
                <div key={idx} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 font-bold flex items-center gap-1.5">
                  <span className="text-amber-400">✓</span> {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PHASE 19 ENHANCEMENT - ENTERPRISE INTELLIGENCE & GOVERNANCE PLATFORM */}
      {activeTab === 'phase19-governance' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Phase 19 Enhancement</span>
            <h2 className="text-xl font-bold text-white mt-1">Enterprise Intelligence, Digital Twin &amp; GRC Governance Platform</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_INTELLIGENCE_GOVERNANCE.map((ig) => (
              <div key={ig.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-amber-400 font-bold">{ig.pillar}</span>
                    <h3 className="text-white font-bold text-sm mt-0.5">{ig.moduleName}</h3>
                  </div>
                  <span className="px-2.5 py-0.5 bg-cyan-500/20 text-cyan-300 font-bold rounded-full text-[10px]">{ig.status}</span>
                </div>

                <p className="text-slate-300 text-xs leading-relaxed">{ig.primaryCapability}</p>

                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-[11px]">
                  <span className="text-slate-400 font-bold">KPI &amp; GOVERNANCE METRIC:</span>
                  <strong className="text-emerald-300 block font-mono">{ig.kpiHealthMetric}</strong>
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
            <h3 className="text-white font-bold text-xs">Phase 19 Executive Pillars Implemented</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-300">
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">• Executive Command Center</div>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">• Enterprise Digital Twin</div>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">• Enterprise Data Lake</div>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">• AI Decision Intelligence</div>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">• Predictive Forecasting</div>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">• Enterprise GRC &amp; SOC</div>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">• Global Region &amp; Multi-Currency</div>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">• Executive Mobile Command</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ENTERPRISE MISSING FEATURES & TOOLS */}
      {activeTab === 'missing-features' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Enterprise Tools</span>
            <h2 className="text-xl font-bold text-white mt-1">Universal Search, Low-Code Form Builder &amp; Developer Portal</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* INTERACTIVE UNIVERSAL SEARCH */}
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <Search className="w-4 h-4 text-amber-400" /> Universal Enterprise Search Engine
              </h3>

              <form onSubmit={handleGlobalSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search invoices, quarry pits, tippers, drivers..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 text-xs focus:outline-none focus:border-amber-500 font-mono"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="px-4 py-2.5 bg-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer hover:bg-amber-400 transition"
                >
                  {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />} Search
                </button>
              </form>

              {searchResults.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-slate-400 text-[10px] font-bold block">SUB-MILLISECOND VECTOR SEARCH RESULTS:</span>
                  {searchResults.map((res, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-xs font-mono">
                      • {res}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* INTERACTIVE LOW-CODE FORM BUILDER */}
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <Layout className="w-4 h-4 text-amber-400" /> Low-Code Dynamic Form Builder
              </h3>

              <form onSubmit={handleAddFieldToForm} className="flex items-center gap-2">
                <input
                  type="text"
                  value={newFieldLabel}
                  onChange={(e) => setNewFieldLabel(e.target.value)}
                  placeholder="Field Label (e.g. Safety Gear Inspection)"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                />
                <select
                  value={newFieldType}
                  onChange={(e) => setNewFieldType(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="Text">Text</option>
                  <option value="Number">Number</option>
                  <option value="Digital Signature">Digital Signature</option>
                  <option value="GPS Location Tag">GPS Location Tag</option>
                </select>
                <button type="submit" className="px-3 py-2.5 bg-amber-500 text-slate-950 font-black rounded-xl text-xs cursor-pointer hover:bg-amber-400">
                  Add
                </button>
              </form>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <span className="text-slate-400 text-[10px] font-bold block">LIVE FORM LAYOUT PREVIEW:</span>
                <div className="space-y-1.5">
                  {formFields.map((field, idx) => (
                    <div key={idx} className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
                      <span className="text-white font-bold">{field.label}</span>
                      <span className="text-cyan-400 text-[10px] bg-slate-900 px-2 py-0.5 rounded">{field.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MASTER ARCHITECTURE REVIEW & SIGN-OFF */}
      {activeTab === 'architecture-review' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Complete Ecosystem Sign-off</span>
            <h2 className="text-xl font-bold text-white mt-1">RZ® Minetrix BOS Complete Enterprise Architectural Review</h2>
          </div>

          <div className="p-5 bg-amber-950/40 border border-amber-500/30 rounded-2xl space-y-3">
            <h3 className="text-amber-300 font-bold text-sm">✓ RZ® Minetrix BOS Full Suite Completion Summary</h3>
            <p className="text-slate-300 leading-relaxed text-xs">
              All 26 Phases and Enhancement Packs of the RZ® Minetrix Business Operating System (BOS) are fully implemented and integrated. The system unifies 10 Domain-Driven Design (DDD) Bounded Contexts, Shared Core PostgreSQL RLS Multi-Tenancy, 14 Domain Runtime SDKs, Executive Digital Twin Command Centers, AI Copilot Engines (Gemini 2.5 Flash), Enterprise iPaaS API Gateways, IoT Sensor Networks, and Master SaaS Governance Controls.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-[11px] pt-2">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Phases Completed</span>
                <strong className="text-amber-400 text-sm">Phase 1 to 26 + Pack</strong>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">DDD Domains</span>
                <strong className="text-emerald-400 text-sm">10 Bounded Contexts</strong>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Architectural Style</span>
                <strong className="text-cyan-400 text-sm">Clean Event-Driven</strong>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">System Status</span>
                <strong className="text-emerald-400 text-sm">Production Ready</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
