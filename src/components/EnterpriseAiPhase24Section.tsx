import React, { useState } from 'react';
import {
  Brain,
  Bot,
  Zap,
  Sliders,
  FileSearch,
  TrendingUp,
  FileText,
  Lightbulb,
  ShieldAlert,
  Send,
  Bell,
  BarChart3,
  BookOpen,
  Mic,
  ShieldCheck,
  Layers,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Cpu,
  Globe,
  Radio,
  FileCheck,
  ArrowRight,
  Database,
  Lock,
  ChevronRight
} from 'lucide-react';
import {
  MOCK_AI_COPILOT_QUERIES,
  MOCK_WORKFLOW_INSTANCES,
  MOCK_BUSINESS_RULES,
  MOCK_DOCUMENT_AI_SCANS,
  MOCK_PREDICTIVE_AI_FORECASTS,
  MOCK_GENERATIVE_AI_DOCS,
  MOCK_DECISION_RECOMMENDATIONS,
  MOCK_PROMPT_LIBRARY,
  MOCK_AI_HEALTH_METRICS,
  MOCK_KNOWLEDGE_HUB,
  MOCK_AI_AGENT_ECOSYSTEM,
  MOCK_DIGITAL_TWIN_NODES,
  MOCK_KNOWLEDGE_GRAPH_NODES,
  MOCK_VISION_AI_INSPECTIONS,
  MOCK_EXECUTIVE_BRIEFINGS,
  MOCK_SIMULATION_SCENARIOS,
  MOCK_FUTURE_AI_CAPABILITIES,
  AiCopilotQueryRecord
} from '../data/enterpriseAiPhase24Data';

interface EnterpriseAiPhase24SectionProps {
  showToast?: (msg: string) => void;
}

export const EnterpriseAiPhase24Section: React.FC<EnterpriseAiPhase24SectionProps> = ({
  showToast = (msg: string) => alert(msg)
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'mod1-copilot'
    | 'mod2-workflow'
    | 'mod3-rules'
    | 'mod4-docai'
    | 'mod5-predictive'
    | 'mod6-generative'
    | 'mod7-decision'
    | 'mod8-cmdcenter'
    | 'mod9-notifications'
    | 'mod10-analytics'
    | 'mod11-knowledge'
    | 'mod12-multimodal'
    | 'mod13-security'
    | 'mod14-ecosystem'
    | 'mod26-agents'
    | 'mod28-digitaltwin'
    | 'mod29-knowledgegraph'
    | 'mod32-visionai'
    | 'mod40-executivebriefing'
    | 'mod42-simulations'
    | 'mod45-futureai'
    | 'phase24-review'
  >('mod1-copilot');

  // Interactive state for AI Copilot Simulator
  const [copilotRole, setCopilotRole] = useState<'CEO / Executive' | 'Mining Safety Officer' | 'Fleet Logistics Manager' | 'Chief Accountant' | 'HR Director'>('CEO / Executive');
  const [copilotLanguage, setCopilotLanguage] = useState<'English' | 'Hindi' | 'Rajasthani' | 'Gujarati'>('English');
  const [inputQueryText, setInputQueryText] = useState('');
  const [simulatedQueries, setSimulatedQueries] = useState<AiCopilotQueryRecord[]>(MOCK_AI_COPILOT_QUERIES);
  const [isGeneratingCopilot, setIsGeneratingCopilot] = useState(false);

  const handleRunCopilotQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQueryText.trim()) return;

    setIsGeneratingCopilot(true);
    setTimeout(() => {
      const newQuery: AiCopilotQueryRecord = {
        id: `cop-${Date.now()}`,
        queryCode: `AI-QRY-${Math.floor(1000 + Math.random() * 9000)}`,
        userRole: copilotRole,
        userLanguage: copilotLanguage,
        promptCategory: 'Real-Time Operational Intelligence',
        userPromptText: inputQueryText,
        aiResponseSummary: `[AI Copilot Analysis]: Cross-module ledger audit verified. Real-time telemetry sync confirms normal parameters across Bhilwara & Rajsamand operating units. No compliance violations detected.`,
        suggestedActionName: 'Execute Recommended Optimization',
        confidenceScorePercent: 99.1,
        timestamp: 'Just Now'
      };
      setSimulatedQueries([newQuery, ...simulatedQueries]);
      setInputQueryText('');
      setIsGeneratingCopilot(false);
      showToast('Gemini AI Copilot query processed successfully!');
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="p-6 sm:p-8 bg-slate-950 border border-slate-800 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -z-0 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-mono font-bold rounded-full flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5" /> Phase 24 Complete
              </span>
              <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-mono font-bold rounded-full">
                14 Modules
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
              Enterprise AI, Automation, Workflow &amp; Decision Platform
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-3xl font-mono">
              Central Intelligence Engine powering Mining, Fleet, Building Materials, CRM, Marketplace, Finance &amp; HRMS with Gemini AI Copilot, Document OCR, Workflow Automation &amp; Predictive Optimization.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono">
            <button
              onClick={() => showToast('AI Platform Health Diagnostics: All 14 Engines Online & Operational!')}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg hover:brightness-110 transition"
            >
              <Sparkles className="w-4 h-4" /> Run AI Diagnostics
            </button>
          </div>
        </div>

        {/* METRICS STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-800/80 font-mono text-xs">
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">24h AI Inferences</span>
            <strong className="text-purple-400 text-sm font-black">{MOCK_AI_HEALTH_METRICS.totalInferences24h.toLocaleString()}</strong>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Avg Response Latency</span>
            <strong className="text-emerald-400 text-sm font-black">{MOCK_AI_HEALTH_METRICS.averageResponseLatencyMs} ms</strong>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Document OCR Accuracy</span>
            <strong className="text-cyan-300 text-sm font-black">{MOCK_AI_HEALTH_METRICS.ocrAccuracyPercent}%</strong>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Governance Audit</span>
            <strong className="text-indigo-300 text-sm font-black">{MOCK_AI_HEALTH_METRICS.governanceAuditsPassedPercent}% Passed</strong>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Prompt Attacks Blocked</span>
            <strong className="text-amber-400 text-sm font-black">{MOCK_AI_HEALTH_METRICS.promptSecurityBlockedAttacks} Blocked</strong>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Monthly Tokens</span>
            <strong className="text-purple-300 text-sm font-black">{MOCK_AI_HEALTH_METRICS.monthlyTokensConsumedMillions}M Tokens</strong>
          </div>
        </div>
      </div>

      {/* SUB-MODULE NAVIGATION TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
        {[
          { id: 'mod1-copilot', label: '1. AI Copilot', icon: Bot },
          { id: 'mod2-workflow', label: '2. Workflow Engine', icon: Zap },
          { id: 'mod3-rules', label: '3. Rule Engine', icon: Sliders },
          { id: 'mod4-docai', label: '4. Document AI', icon: FileSearch },
          { id: 'mod5-predictive', label: '5. Predictive AI', icon: TrendingUp },
          { id: 'mod6-generative', label: '6. Generative AI', icon: FileText },
          { id: 'mod7-decision', label: '7. Decision Intelligence', icon: Lightbulb },
          { id: 'mod8-cmdcenter', label: '8. AI Command Center', icon: Cpu },
          { id: 'mod9-notifications', label: '9. Notifications', icon: Bell },
          { id: 'mod10-analytics', label: '10. Analytics & Insights', icon: BarChart3 },
          { id: 'mod11-knowledge', label: '11. Knowledge Hub', icon: BookOpen },
          { id: 'mod12-multimodal', label: '12. Multimodal AI', icon: Mic },
          { id: 'mod13-security', label: '13. AI Security', icon: ShieldCheck },
          { id: 'mod14-ecosystem', label: '14. Ecosystem Bridges', icon: Layers },
          { id: 'mod26-agents', label: '26. AI Agent Ecosystem', icon: Bot },
          { id: 'mod28-digitaltwin', label: '28. Digital Twin', icon: Radio },
          { id: 'mod29-knowledgegraph', label: '29. Knowledge Graph', icon: Database },
          { id: 'mod32-visionai', label: '32. Vision AI', icon: Globe },
          { id: 'mod40-executivebriefing', label: '40. Exec Briefings', icon: FileCheck },
          { id: 'mod42-simulations', label: '42. AI Simulations', icon: RefreshCw },
          { id: 'mod45-futureai', label: '45. Future AI / MCP', icon: Sparkles },
          { id: 'phase24-review', label: 'Phase 24 Review', icon: CheckCircle2 }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 rounded-xl whitespace-nowrap flex items-center gap-1.5 font-bold transition cursor-pointer ${
                isActive
                  ? 'bg-purple-500 text-slate-950 font-black shadow-lg'
                  : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* MODULE 1: AI COPILOT */}
      {activeTab === 'mod1-copilot' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 1</span>
              <h2 className="text-xl font-bold text-white mt-1">Enterprise Voice &amp; Text AI Copilot Simulator</h2>
            </div>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 font-bold rounded-full text-xs flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Powered by Gemini
            </span>
          </div>

          {/* ROLE & LANGUAGE SELECTORS */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-[10px] block font-bold mb-1">Select Persona Role:</label>
              <select
                value={copilotRole}
                onChange={(e: any) => setCopilotRole(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-bold focus:outline-none focus:border-purple-500"
              >
                <option value="CEO / Executive">CEO / Executive</option>
                <option value="Mining Safety Officer">Mining Safety Officer</option>
                <option value="Fleet Logistics Manager">Fleet Logistics Manager</option>
                <option value="Chief Accountant">Chief Accountant</option>
                <option value="HR Director">HR Director</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 text-[10px] block font-bold mb-1">Select Response Language:</label>
              <select
                value={copilotLanguage}
                onChange={(e: any) => setCopilotLanguage(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-bold focus:outline-none focus:border-purple-500"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Rajasthani">Rajasthani (राजस्थानी)</option>
                <option value="Gujarati">Gujarati (ગુજરાતી)</option>
              </select>
            </div>
          </div>

          {/* QUERY FORM */}
          <form onSubmit={handleRunCopilotQuery} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask AI Copilot (e.g., Check crusher diesel efficiency or driver overtime eligibility)..."
                value={inputQueryText}
                onChange={(e) => setInputQueryText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white text-xs focus:outline-none focus:border-purple-500 pr-24"
              />
              <button
                type="submit"
                disabled={isGeneratingCopilot}
                className="absolute right-2 top-2 bottom-2 px-4 bg-purple-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer hover:bg-purple-400"
              >
                {isGeneratingCopilot ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                Ask AI
              </button>
            </div>
          </form>

          {/* SIMULATED QUERY STREAM */}
          <div className="space-y-4 pt-2">
            <h3 className="text-purple-400 font-bold text-xs uppercase">Recent Cross-Module AI Responses</h3>
            {simulatedQueries.map((q) => (
              <div key={q.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-purple-400 font-bold">{q.queryCode}</span>
                    <h4 className="text-white font-bold text-xs mt-0.5">"{q.userPromptText}"</h4>
                    <span className="text-slate-400 text-[10px]">Persona: {q.userRole} • Language: {q.userLanguage}</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-300 font-bold rounded-full text-[10px]">
                    Confidence: {q.confidenceScorePercent}%
                  </span>
                </div>

                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-slate-400 text-[10px] block font-bold mb-1">GEMINI AI RESPONSE SUMMARY:</span>
                  <p className="text-slate-200 text-xs leading-relaxed">{q.aiResponseSummary}</p>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-500 text-[10px]">{q.timestamp}</span>
                  <button onClick={() => showToast(`Triggered Action: ${q.suggestedActionName}`)} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg text-xs cursor-pointer">
                    ⚡ {q.suggestedActionName}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 2: WORKFLOW ENGINE */}
      {activeTab === 'mod2-workflow' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 2</span>
              <h2 className="text-xl font-bold text-white mt-1">Multi-Level Conditional Workflow Engine</h2>
            </div>
            <button onClick={() => showToast('New Automated Workflow Template Created!')} className="px-3 py-1.5 bg-purple-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer">
              <Zap className="w-4 h-4" /> Design New Workflow
            </button>
          </div>

          <div className="space-y-4">
            {MOCK_WORKFLOW_INSTANCES.map((wf) => (
              <div key={wf.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-purple-400 font-bold">{wf.workflowCode}</span>
                    <h3 className="text-white font-bold text-sm mt-0.5">{wf.workflowName}</h3>
                    <span className="text-slate-400 text-[10px]">Trigger: {wf.triggerEvent}</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">{wf.currentStatus}</span>
                </div>

                <div className="space-y-2">
                  <span className="text-slate-400 text-[10px] font-bold block uppercase">Approval Chain &amp; SLA Tracking (Max {wf.slaDeadlineHours} Hours SLA):</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {wf.approvalLevels.map((lvl) => (
                      <div key={lvl.levelIndex} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center">
                        <div>
                          <strong className="text-white text-xs block">L{lvl.levelIndex}: {lvl.approverRole}</strong>
                          <span className="text-slate-500 text-[10px]">{lvl.approvedAt || 'Awaiting Review'}</span>
                        </div>
                        <span className={`px-2 py-0.5 font-bold rounded text-[10px] ${lvl.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                          {lvl.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 3: BUSINESS RULE ENGINE */}
      {activeTab === 'mod3-rules' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 3</span>
            <h2 className="text-xl font-bold text-white mt-1">Enterprise Business Rule Engine &amp; Logic Builder</h2>
          </div>

          <div className="space-y-3">
            {MOCK_BUSINESS_RULES.map((br) => (
              <div key={br.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-purple-400 font-bold">{br.ruleCode}</span>
                    <h3 className="text-white font-bold text-sm mt-0.5">{br.ruleName}</h3>
                    <span className="text-slate-400 text-[10px]">Domain: {br.targetDomain}</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">Triggered {br.timesTriggeredThisMonth}x This Month</span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-amber-400 font-bold text-[10px]">CONDITIONAL LOGIC:</span>
                  <p className="text-slate-200 text-xs font-mono">{br.conditionalLogic}</p>
                </div>

                <div className="flex justify-between items-center text-[11px] pt-1">
                  <span className="text-slate-300">Action: <strong className="text-cyan-300">{br.actionOnTrigger}</strong></span>
                  <button onClick={() => showToast(`Rule ${br.ruleCode} Tested against Live Orders!`)} className="px-3 py-1 bg-purple-500 text-slate-950 font-black rounded-lg text-xs cursor-pointer">
                    Test Rule Logic
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 4: DOCUMENT AI */}
      {activeTab === 'mod4-docai' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 4</span>
              <h2 className="text-xl font-bold text-white mt-1">Document AI &amp; Intelligent OCR Scanner</h2>
            </div>
            <button onClick={() => showToast('OCR Scan Completed! 99.4% Field Match Accuracy.')} className="px-3 py-1.5 bg-purple-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer">
              <FileSearch className="w-4 h-4" /> Scan New PDF/Image
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_DOCUMENT_AI_SCANS.map((doc) => (
              <div key={doc.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-purple-400 font-bold">{doc.scanCode}</span>
                    <h3 className="text-white font-bold text-xs mt-0.5">{doc.scannedFileName}</h3>
                    <span className="text-slate-400 text-[10px]">Type: {doc.documentType}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">{doc.ocrConfidencePercent}% OCR</span>
                </div>

                <div className="space-y-1 p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px]">
                  <span className="text-slate-400 text-[10px] block font-bold mb-1">EXTRACTED KEY-VALUE FIELDS:</span>
                  {Object.entries(doc.extractedFields).map(([k, v]) => (
                    <div key={k} className="flex justify-between py-0.5 border-b border-slate-800/50 last:border-0">
                      <span className="text-slate-400">{k}:</span>
                      <strong className="text-white">{v}</strong>
                    </div>
                  ))}
                </div>

                <span className="px-2.5 py-1 bg-indigo-950 text-indigo-300 border border-indigo-500/30 font-bold text-[10px] rounded-lg block text-center">
                  Status: {doc.classificationTag}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 5: PREDICTIVE AI */}
      {activeTab === 'mod5-predictive' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 5</span>
            <h2 className="text-xl font-bold text-white mt-1">Predictive AI (Demand, Maintenance &amp; Cash Flow Forecasts)</h2>
          </div>

          <div className="space-y-3">
            {MOCK_PREDICTIVE_AI_FORECASTS.map((pred) => (
              <div key={pred.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <h3 className="text-white font-bold text-sm">{pred.forecastModel}</h3>
                    <span className="text-purple-400 text-[10px]">Domain: {pred.targetDomain}</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 font-bold rounded-full text-[10px]">{pred.riskFactorAlert}</span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">PREDICTED FORECAST OUTPUT ({pred.confidenceInterval}):</span>
                  <strong className="text-indigo-300 text-sm mt-0.5 block">{pred.predictedValue}</strong>
                </div>

                <p className="text-slate-300 text-xs">💡 <strong>AI Recommended Action:</strong> {pred.recommendedIntervention}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 6: GENERATIVE AI */}
      {activeTab === 'mod6-generative' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 6</span>
              <h2 className="text-xl font-bold text-white mt-1">Generative AI (Quotations, Agreements &amp; Reports)</h2>
            </div>
            <button onClick={() => showToast('AI Quotation Generated for L&T Infrastructure!')} className="px-3 py-1.5 bg-purple-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer">
              <FileText className="w-4 h-4" /> Auto-Generate Document
            </button>
          </div>

          <div className="space-y-3">
            {MOCK_GENERATIVE_AI_DOCS.map((gen) => (
              <div key={gen.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-purple-400 font-bold">{gen.docCode}</span>
                    <h3 className="text-white font-bold text-xs mt-0.5">{gen.generatorType}</h3>
                    <span className="text-slate-400 text-[10px]">Client/Vendor: {gen.targetClientOrVendor}</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">{gen.status}</span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block font-bold mb-1">GENERATED CONTENT PREVIEW:</span>
                  <p className="text-slate-200 text-xs italic">"{gen.generatedContentSnippet}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 7: DECISION INTELLIGENCE */}
      {activeTab === 'mod7-decision' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 7</span>
            <h2 className="text-xl font-bold text-white mt-1">Executive Decision Intelligence &amp; Cost Optimization</h2>
          </div>

          <div className="space-y-3">
            {MOCK_DECISION_RECOMMENDATIONS.map((dec) => (
              <div key={dec.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-purple-400 font-bold">{dec.recommendationCode}</span>
                    <h3 className="text-white font-bold text-sm mt-0.5">{dec.category}</h3>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">
                    Projected Savings: ₹{dec.projectedCostSavingsRs.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">PROBLEM STATEMENT:</span>
                    <p className="text-slate-300">{dec.problemStatement}</p>
                  </div>

                  <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl">
                    <span className="text-indigo-400 font-bold text-[10px] block">AI OPTIMIZED RECOMMENDATION:</span>
                    <p className="text-slate-200 mt-0.5">{dec.aiOptimizedSolution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 8: AI COMMAND CENTER */}
      {activeTab === 'mod8-cmdcenter' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 8</span>
            <h2 className="text-xl font-bold text-white mt-1">AI Command Center &amp; Prompt Library Explorer</h2>
          </div>

          <div className="space-y-4">
            <h3 className="text-purple-400 font-bold text-xs uppercase">Managed Prompt Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_PROMPT_LIBRARY.map((prt) => (
                <div key={prt.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                    <div>
                      <span className="text-purple-400 font-bold">{prt.promptCode}</span>
                      <h4 className="text-white font-bold text-xs mt-0.5">{prt.title}</h4>
                      <span className="text-slate-400 text-[10px]">Role: {prt.targetRole}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] rounded">{prt.domainModule}</span>
                  </div>

                  <p className="text-slate-300 text-xs italic bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    "{prt.systemPromptTemplate}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODULE 9: NOTIFICATIONS */}
      {activeTab === 'mod9-notifications' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 9</span>
            <h2 className="text-xl font-bold text-white mt-1">Automated Multi-Channel Notification Engine</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-center">
              <span className="text-emerald-400 font-bold text-sm block">WhatsApp Gateway</span>
              <p className="text-slate-400 text-[11px]">Instant dispatch slips, driver assignment alerts &amp; daily wage UPI receipts.</p>
              <strong className="text-white text-xs block pt-2">Active • 1,240 Sent Today</strong>
            </div>
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-center">
              <span className="text-indigo-400 font-bold text-sm block">Email &amp; PDF Dispatch</span>
              <p className="text-slate-400 text-[11px]">Automated GST E-Invoices, PO approvals &amp; board summaries sent directly to clients.</p>
              <strong className="text-white text-xs block pt-2">Active • 380 Sent Today</strong>
            </div>
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-center">
              <span className="text-purple-400 font-bold text-sm block">SMS &amp; Mobile Push</span>
              <p className="text-slate-400 text-[11px]">Shift reminders, safety siren warnings &amp; gate weighbridge ticket confirmations.</p>
              <strong className="text-white text-xs block pt-2">Active • 4,120 Sent Today</strong>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 10: ANALYTICS & INSIGHTS */}
      {activeTab === 'mod10-analytics' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 10</span>
            <h2 className="text-xl font-bold text-white mt-1">AI Executive Analytics &amp; Anomaly Detection</h2>
          </div>

          <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-amber-400 font-bold">⚡ AI Anomaly Alert Detected</span>
              <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 font-bold rounded-full text-[10px]">High Variance</span>
            </div>
            <h3 className="text-white font-bold text-sm">Fuel Consumption Spike Detected at Crusher Unit #2</h3>
            <p className="text-slate-300 text-xs">
              AI Root Cause Analysis: Fuel burn rate increased by 14% over baseline. Visual inspection recommended for clogged air intake filters or fuel line injector leakage.
            </p>
          </div>
        </div>
      )}

      {/* MODULE 11: KNOWLEDGE HUB */}
      {activeTab === 'mod11-knowledge' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 11</span>
            <h2 className="text-xl font-bold text-white mt-1">Enterprise SOP Knowledge Hub &amp; Guidelines Repository</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_KNOWLEDGE_HUB.map((kn) => (
              <div key={kn.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-purple-400 font-bold">{kn.articleCode}</span>
                    <h4 className="text-white font-bold text-xs mt-0.5">{kn.title}</h4>
                    <span className="text-slate-400 text-[10px]">Category: {kn.category}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] rounded">{kn.fileFormat}</span>
                </div>

                <div className="flex justify-between text-slate-300 text-[11px] pt-1">
                  <span>Access: <strong className="text-white">{kn.accessPermission}</strong></span>
                  <span>Views: <strong className="text-emerald-400">{kn.viewsCount} Times</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 12: MULTIMODAL AI */}
      {activeTab === 'mod12-multimodal' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 12</span>
            <h2 className="text-xl font-bold text-white mt-1">Multimodal AI (Voice + Image + Document Processing)</h2>
          </div>

          <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
            <h3 className="text-white font-bold text-sm">Multimodal Grounding Engines Active</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <strong className="text-purple-400 block font-bold mb-1">Speech-to-Text &amp; Voice Commands</strong>
                <p className="text-slate-400 text-[11px]">Real-time Hindi &amp; Rajasthani voice input processing for driver check-ins.</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <strong className="text-indigo-400 block font-bold mb-1">Image &amp; Camera Understanding</strong>
                <p className="text-slate-400 text-[11px]">Automated tire wear inspection &amp; rock size distribution analysis from pit camera feeds.</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <strong className="text-emerald-400 block font-bold mb-1">Document &amp; PDF Understanding</strong>
                <p className="text-slate-400 text-[11px]">Instant parsing of complex multi-page mining leases &amp; tax documents.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 13: AI SECURITY */}
      {activeTab === 'mod13-security' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 13</span>
            <h2 className="text-xl font-bold text-white mt-1">AI Security, Prompt Guard &amp; PII Data Masking</h2>
          </div>

          <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-emerald-400 font-bold">✓ AI Security Infrastructure Active</span>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">100% Audit Passed</span>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div>• <strong>Prompt Injection Guard:</strong> Blocks malicious override prompts before hitting AI models.</div>
              <div>• <strong>PII &amp; Financial Masking:</strong> Aadhaar numbers, bank accounts &amp; executive phone numbers sanitized automatically in prompts.</div>
              <div>• <strong>Role-Based Scope Lock:</strong> Drivers &amp; Operators cannot query corporate profit margins or payroll ledgers.</div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 14: ECOSYSTEM BRIDGES */}
      {activeTab === 'mod14-ecosystem' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 14</span>
            <h2 className="text-xl font-bold text-white mt-1">Ecosystem AI Integration Bridges (Cross-Platform)</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex justify-between items-center">
              <div>
                <strong className="text-white block">AI ↔ Mining Operations (Phase 17)</strong>
                <span className="text-slate-400 text-[10px]">Blast Yield, Bench Quality &amp; Quarry Capacity</span>
              </div>
              <span className="text-emerald-400 font-bold text-[10px]">Real-Time Sync</span>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex justify-between items-center">
              <div>
                <strong className="text-white block">AI ↔ Fleet Logistics (Phase 18)</strong>
                <span className="text-slate-400 text-[10px]">Route Optimization, Idling &amp; Predictive Maintenance</span>
              </div>
              <span className="text-emerald-400 font-bold text-[10px]">Real-Time Sync</span>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex justify-between items-center">
              <div>
                <strong className="text-white block">AI ↔ Building Materials (Phase 19)</strong>
                <span className="text-slate-400 text-[10px]">Dynamic Pricing &amp; Public Customer Ordering</span>
              </div>
              <span className="text-emerald-400 font-bold text-[10px]">Real-Time Sync</span>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex justify-between items-center">
              <div>
                <strong className="text-white block">AI ↔ Finance &amp; HRMS (Phase 22 &amp; 23)</strong>
                <span className="text-slate-400 text-[10px]">Invoice OCR, Cash Runway &amp; Shift Optimizations</span>
              </div>
              <span className="text-emerald-400 font-bold text-[10px]">Real-Time Sync</span>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 26: ENTERPRISE AI AGENT ECOSYSTEM */}
      {activeTab === 'mod26-agents' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 26</span>
              <h2 className="text-xl font-bold text-white mt-1">Enterprise Autonomous AI Agent Ecosystem</h2>
            </div>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 font-bold rounded-full text-xs">
              Agent-to-Agent Communication Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MOCK_AI_AGENT_ECOSYSTEM.map((agt) => (
              <div key={agt.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-purple-400 font-bold">{agt.agentCode}</span>
                    <h3 className="text-white font-bold text-xs mt-0.5">{agt.agentName}</h3>
                    <span className="text-slate-400 text-[10px]">Domain: {agt.domainFocus}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded text-[10px]">{agt.activeStatus}</span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] space-y-1">
                  <span className="text-slate-500 block font-bold text-[10px]">LAST DELEGATED TASK:</span>
                  <p className="text-slate-200">{agt.lastDelegatedTask}</p>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                  <span>Memory Store: <strong className="text-purple-300">{agt.memoryStoreBytes}</strong></span>
                  <button onClick={() => showToast(`Triggered Manual Delegation for ${agt.agentCode}`)} className="px-2.5 py-1 bg-purple-500 text-slate-950 font-black rounded-lg cursor-pointer">
                    Delegate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 28: ENTERPRISE DIGITAL TWIN */}
      {activeTab === 'mod28-digitaltwin' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 28</span>
            <h2 className="text-xl font-bold text-white mt-1">Enterprise Digital Twin Telemetry &amp; Live Simulation</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_DIGITAL_TWIN_NODES.map((dt) => (
              <div key={dt.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-purple-400 font-bold">{dt.twinCode}</span>
                    <h3 className="text-white font-bold text-sm mt-0.5">{dt.twinName}</h3>
                    <span className="text-slate-400 text-[10px]">Category: {dt.twinCategory}</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">{dt.liveHealthScorePercent}% Health</span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-amber-400 font-bold text-[10px]">PREDICTED ANOMALY / STATUS:</span>
                  <p className="text-slate-200 text-xs">{dt.aiPredictedAnomaly}</p>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span>Telemetry Nodes: <strong className="text-cyan-300">{dt.activeTelemetryNodes} Sensors</strong></span>
                  <span className="text-slate-500">{dt.lastUpdated}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 29: ENTERPRISE KNOWLEDGE GRAPH */}
      {activeTab === 'mod29-knowledgegraph' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 29</span>
            <h2 className="text-xl font-bold text-white mt-1">Enterprise Knowledge Graph &amp; Semantic Relationships</h2>
          </div>

          <div className="space-y-3">
            {MOCK_KNOWLEDGE_GRAPH_NODES.map((kg) => (
              <div key={kg.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-[10px]">{kg.entityA}</span>
                    <span className="text-slate-500">── [{kg.relationshipType}] ──►</span>
                    <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-[10px]">{kg.entityB}</span>
                  </div>
                  <span className="text-slate-400 text-[10px] block">Context: {kg.contextModule}</span>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">Weight: {kg.semanticWeightScore}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 32: VISION AI PLATFORM */}
      {activeTab === 'mod32-visionai' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 32</span>
            <h2 className="text-xl font-bold text-white mt-1">Vision AI Inspection &amp; Camera Feed Monitoring</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_VISION_AI_INSPECTIONS.map((vis) => (
              <div key={vis.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-purple-400 font-bold">{vis.inspectionCode}</span>
                    <h3 className="text-white font-bold text-xs mt-0.5">{vis.targetCategory}</h3>
                    <span className="text-slate-400 text-[10px]">Source: {vis.imageUrlOrSource}</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 font-bold rounded-full text-[10px]">{vis.severityGrade}</span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px]">
                  <span className="text-slate-400 text-[10px] block font-bold mb-1">AI DETECTION ANALYSIS:</span>
                  <p className="text-slate-200">{vis.aiDetectionSummary}</p>
                </div>

                <span className="text-slate-500 text-[10px] block text-right">{vis.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 40: EXECUTIVE BRIEFINGS */}
      {activeTab === 'mod40-executivebriefing' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 40</span>
            <h2 className="text-xl font-bold text-white mt-1">Executive AI Command Briefing &amp; Daily C-Suite Digests</h2>
          </div>

          <div className="space-y-4">
            {MOCK_EXECUTIVE_BRIEFINGS.map((eb) => (
              <div key={eb.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 font-bold rounded text-[10px]">{eb.role} Briefing</span>
                    <h3 className="text-white font-bold text-sm mt-1">{eb.briefingTitle}</h3>
                  </div>
                  <span className="text-emerald-400 font-bold text-xs">{eb.financialImpactEstimateRs}</span>
                </div>

                <div className="space-y-2 text-xs">
                  <p className="text-slate-200">📌 <strong>Key Insight:</strong> {eb.keyAiInsightBullet}</p>
                  <p className="text-amber-300">⚠️ <strong>Action Required:</strong> {eb.flaggedRiskAction}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 42: AI SIMULATION ENGINE */}
      {activeTab === 'mod42-simulations' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 42</span>
            <h2 className="text-xl font-bold text-white mt-1">AI What-If Simulation Engine &amp; Scenario Planner</h2>
          </div>

          <div className="space-y-4">
            {MOCK_SIMULATION_SCENARIOS.map((sim) => (
              <div key={sim.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-purple-400 font-bold">{sim.scenarioCode}</span>
                    <h3 className="text-white font-bold text-sm mt-0.5">{sim.simulationName}</h3>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded text-[10px]">{sim.confidenceScorePercent}% Confidence</span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] font-bold block">WHAT-IF HYPOTHESIS:</span>
                  <p className="text-slate-300 text-xs">{sim.whatIfParameters}</p>
                </div>

                <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-xl space-y-1">
                  <span className="text-purple-300 text-[10px] font-bold block">SIMULATED OUTCOME &amp; RECOMMENDATION:</span>
                  <p className="text-slate-200 text-xs">{sim.simulatedOutcome}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 45: FUTURE AI PLATFORM */}
      {activeTab === 'mod45-futureai' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Module 45</span>
            <h2 className="text-xl font-bold text-white mt-1">Future AI Platform (MCP Protocol, LLM Agnostic &amp; Edge AI)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MOCK_FUTURE_AI_CAPABILITIES.map((fut) => (
              <div key={fut.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-purple-400 font-bold">{fut.featureCode}</span>
                    <h3 className="text-white font-bold text-xs mt-0.5">{fut.technologyTag}</h3>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded text-[10px]">{fut.deploymentStatus}</span>
                </div>

                <p className="text-slate-300 text-xs leading-relaxed">{fut.impactDescription}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PHASE 24 REVIEW */}
      {activeTab === 'phase24-review' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Phase 24 Sign-off</span>
            <h2 className="text-xl font-bold text-white mt-1">Phase 24 Architectural Completion Review</h2>
          </div>

          <div className="p-5 bg-purple-950/40 border border-purple-500/30 rounded-2xl space-y-3">
            <h3 className="text-purple-300 font-bold text-sm">✓ Phase 24 AI Platform Architectural Sign-off</h3>
            <p className="text-slate-300 leading-relaxed text-xs">
              Phase 24 establishes a unified Enterprise AI, Automation, Workflow &amp; Decision Intelligence Platform for RZ® Minetrix BOS. It provides shared AI Copilots, Document OCR, Multi-Level Workflow Execution, Business Rule Enforcement, Predictive Analytics, Decision Optimization, Multi-Agent Ecosystems, Digital Twins, Knowledge Graphs, Vision AI, Executive Briefings, AI Simulations, and Future MCP/Edge Capabilities across all business units (Mining, Fleet, Materials, CRM, Marketplace, Finance &amp; HRMS).
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-[11px] pt-2">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Modules Built</span>
                <strong className="text-purple-400 text-sm">46 / 46 Extended Coverage</strong>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Copilot Support</span>
                <strong className="text-purple-400 text-sm">Voice + Text (4 Languages)</strong>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">OCR Accuracy</span>
                <strong className="text-emerald-400 text-sm">99.2% Average</strong>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Ecosystem Bridges</span>
                <strong className="text-emerald-400 text-sm">Full BOS Coverage</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
