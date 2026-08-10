import React, { useState } from 'react';
import { 
  GitBranch, Server, Box, Code, Activity, AlertTriangle, Database,
  RefreshCw, Zap, Shield, Layers, Lock, FileText, CheckCircle2,
  Terminal, Play, Search, Plus, Copy, Check, ShieldCheck, Cpu, HardDrive,
  Download, ArrowRight, Clock, AlertCircle, RefreshCcw, Sparkles, LayoutGrid,
  Radio, Smartphone, Mail, Globe, Cloud, BarChart2, Flame, DollarSign, Brain, Monitor, Truck
} from 'lucide-react';
import { 
  DEVOPS_MODULES,
  PRESET_PIPELINE_RUNS,
  PRESET_ENVIRONMENTS,
  PRESET_CONTAINER_IMAGES,
  PRESET_OBSERVABILITY_METRICS,
  PRESET_ALERT_INCIDENTS,
  PRESET_DISASTER_RECOVERY,
  PRESET_RELEASE_NOTES,
  PRESET_SRE_STATUS,
  PRESET_FINOPS_COSTS,
  PRESET_EOC_LIVE,
  PRESET_MINING_INFRA_HEALTH,
  PRESET_COMPLIANCE_SCORES,
  PRESET_DIGITAL_TWIN_NODES,
  DEVOPS_DATABASE_SCHEMA_TABLES,
  DEVOPS_TEST_SUITE,
  DevOpsModuleSpec,
  PipelineRunSpec,
  EnvironmentSpec,
  ContainerImageSpec,
  ObservabilityMetricSpec,
  AlertIncidentSpec,
  DisasterRecoverySpec,
  ReleaseNoteSpec
} from '../data/devopsCloudData';

export const DevOpsCloudPlatformSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'devops-dashboard' | 'modules' | 'sre' | 'finops-multicloud' | 'ai-devops' | 'eoc-mining' | 'continuity-compliance' | 'digital-twin' | 'environments' | 'containers-iac' | 'observability-alerts' | 'backups-dr' | 'secops-releases' | 'schema' | 'tests'>('devops-dashboard');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('cicd-git-automation-pipeline');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Pipelines State
  const [pipelinesList, setPipelinesList] = useState<PipelineRunSpec[]>(PRESET_PIPELINE_RUNS);
  const [isTriggeringBuild, setIsTriggeringBuild] = useState<boolean>(false);

  // Incident Alerts State
  const [incidentsList, setIncidentsList] = useState<AlertIncidentSpec[]>(PRESET_ALERT_INCIDENTS);
  const [testAlertMessage, setTestAlertMessage] = useState<string>('');

  // DR Failover State
  const [drStatus, setDrStatus] = useState<DisasterRecoverySpec>(PRESET_DISASTER_RECOVERY);
  const [isSimulatingFailover, setIsSimulatingFailover] = useState<boolean>(false);

  // AI DevOps Assistant State
  const [aiLogInput, setAiLogInput] = useState<string>('ERROR [2026-08-07 04:30:12] WeighbridgeSerialStream: Timeout receiving bytes from Serial Com1 (Retry 3/3)');
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);
  const [isAnalyzingLog, setIsAnalyzingLog] = useState<boolean>(false);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedModule = DEVOPS_MODULES.find(m => m.id === selectedModuleId) || DEVOPS_MODULES[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const copySnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleTriggerPipeline = () => {
    setIsTriggeringBuild(true);
    setTimeout(() => {
      const id = `pipe-${Date.now().toString().slice(-4)}`;
      const newRun: PipelineRunSpec = {
        id,
        pipelineCode: `PIPE-BUILD-${Math.floor(Math.random() * 9000 + 1000)}`,
        branch: 'main',
        commitHash: Math.random().toString(16).substr(2, 7),
        environment: 'PRODUCTION',
        status: 'SUCCESS',
        durationSeconds: 112,
        author: 'sre-lead@minetrix.com',
        deploymentStrategy: 'BLUE_GREEN',
        startedAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
      };
      setPipelinesList([newRun, ...pipelinesList]);
      setIsTriggeringBuild(false);
      showToast('CI/CD Pipeline Build & Blue/Green Switch Executed Successfully!');
    }, 1200);
  };

  const handleSimulateDrFailover = () => {
    setIsSimulatingFailover(true);
    setTimeout(() => {
      setDrStatus(prev => ({
        ...prev,
        primaryRegion: 'Asia-East1 (Singapore)',
        failoverRegion: 'Asia-South1 (Mumbai)',
        replicationStatus: 'FAILOVER_READY'
      }));
      setIsSimulatingFailover(false);
      showToast('Cross-Region Disaster Recovery Failover Completed! Active Region: Singapore (RTO: 1.2m, RPO: 0ms)');
    }, 1500);
  };

  const handleRunAiLogAnalysis = () => {
    setIsAnalyzingLog(true);
    setTimeout(() => {
      setAiAnalysisResult(`[Gemini AI DevOps Analysis]
Root Cause: Transient baud-rate mismatch on RS-232 weighpad serial interface.
Risk Score: Low (Severity 2).
Automated Remediation: Executed auto-flush on buffer port COM1. Re-established sync in 120ms. Zero weighment data loss.`);
      setIsAnalyzingLog(false);
      showToast('Gemini AI Log Analysis & Root Cause Diagnosis Completed!');
    }, 1000);
  };

  const handleDispatchTestAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testAlertMessage) return;

    const newInc: AlertIncidentSpec = {
      id: `inc-${Date.now().toString().slice(-4)}`,
      incidentCode: `INC-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
      severity: 'WARNING',
      serviceAffected: 'Mining Engine Microservice',
      title: testAlertMessage,
      status: 'INVESTIGATING',
      assignedSre: 'sre-oncall@minetrix.com',
      channelDispatched: 'WHATSAPP',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };

    setIncidentsList([newInc, ...incidentsList]);
    setTestAlertMessage('');
    showToast(`WhatsApp Alert Dispatched to On-Call SRE: ${newInc.incidentCode}`);
  };

  const handleResolveIncident = (id: string) => {
    setIncidentsList(prev => prev.map(i => i.id === id ? { ...i, status: 'RESOLVED' } : i));
    showToast('Incident Marked as RESOLVED');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Executive Banner Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5" /> Phase 16I DevOps, FinOps, SRE &amp; EOC Platform
            </span>
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono rounded-full">
              32 Architecture Modules • GitOps, FinOps, AI Assistant, SRE &amp; Digital Twin
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            RZ® Minetrix BOS — Enterprise DevOps, Cloud Infrastructure, Observability, SRE &amp; FinOps
          </h1>

          <p className="text-slate-300 text-base max-w-4xl leading-relaxed">
            Enterprise multi-cloud platform combining Blue/Green CI/CD, Site Reliability Engineering (SLO/SLI Error Budgets), FinOps Cost Analytics, Gemini AI DevOps Assistant, Enterprise Operations Center (EOC), Mining Fleet IoT Telemetry, ISO 27001 Compliance, and 3D Digital Twin Topology.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
            <div className="space-y-1">
              <p className="text-xs text-slate-400 uppercase font-medium">Primary Region Cluster</p>
              <p className="text-lg font-bold text-blue-400 flex items-center gap-1.5">
                <Cloud className="w-4 h-4" /> {drStatus.primaryRegion}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-400 uppercase font-medium">Disaster Recovery Targets</p>
              <p className="text-lg font-bold text-emerald-400 flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4" /> RTO &lt; {drStatus.rtoMinutes}m | RPO &lt; {drStatus.rpoMinutes}m
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-400 uppercase font-medium">SRE Reliability Index</p>
              <p className="text-lg font-bold text-amber-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4" /> {PRESET_SRE_STATUS.reliabilityScore}% (SLO 99.99%)
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-400 uppercase font-medium">FinOps Savings Potential</p>
              <p className="text-lg font-bold text-indigo-400 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" /> ${PRESET_FINOPS_COSTS.potentialSavingsUsd}/mo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('devops-dashboard')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'devops-dashboard'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <GitBranch className="w-4 h-4 text-blue-400" />
          DevOps &amp; CI/CD
        </button>

        <button
          onClick={() => setActiveTab('modules')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'modules'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Layers className="w-4 h-4 text-amber-400" />
          32 Architecture Modules
        </button>

        <button
          onClick={() => setActiveTab('sre')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'sre'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Activity className="w-4 h-4 text-rose-400" />
          SRE &amp; Error Budgets
        </button>

        <button
          onClick={() => setActiveTab('finops-multicloud')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'finops-multicloud'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <DollarSign className="w-4 h-4 text-emerald-400" />
          FinOps &amp; Multi-Cloud
        </button>

        <button
          onClick={() => setActiveTab('ai-devops')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'ai-devops'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Brain className="w-4 h-4 text-violet-400" />
          AI DevOps Assistant
        </button>

        <button
          onClick={() => setActiveTab('eoc-mining')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'eoc-mining'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Monitor className="w-4 h-4 text-cyan-400" />
          EOC &amp; Mining Fleet IoT
        </button>

        <button
          onClick={() => setActiveTab('continuity-compliance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'continuity-compliance'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Compliance &amp; DX Portal
        </button>

        <button
          onClick={() => setActiveTab('digital-twin')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'digital-twin'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          Digital Twin Map
        </button>

        <button
          onClick={() => setActiveTab('environments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'environments'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Server className="w-4 h-4 text-indigo-400" />
          Clusters
        </button>

        <button
          onClick={() => setActiveTab('containers-iac')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'containers-iac'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Box className="w-4 h-4 text-emerald-400" />
          Containers/IaC
        </button>

        <button
          onClick={() => setActiveTab('observability-alerts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'observability-alerts'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Activity className="w-4 h-4 text-rose-400" />
          APM &amp; Alerts
        </button>

        <button
          onClick={() => setActiveTab('backups-dr')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'backups-dr'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Database className="w-4 h-4 text-amber-400" />
          PITR Backups
        </button>

        <button
          onClick={() => setActiveTab('schema')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'schema'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Code className="w-4 h-4 text-slate-300" />
          Schema
        </button>

        <button
          onClick={() => setActiveTab('tests')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'tests'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Tests
        </button>
      </div>

      {/* Action Toast Notification */}
      {toastMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex items-center gap-2 shadow-lg animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Tab 1: DevOps Command Dashboard */}
      {activeTab === 'devops-dashboard' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-6 border border-slate-800 rounded-2xl shadow-xl">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-blue-400" />
                GitOps CI/CD Build &amp; Blue/Green Deployment Hub
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Trigger zero-downtime Blue/Green deployments, track pipeline build times, and monitor active release versions.
              </p>
            </div>

            <button
              onClick={handleTriggerPipeline}
              disabled={isTriggeringBuild}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-current" />
              {isTriggeringBuild ? 'Executing Pipeline Build...' : 'Trigger Blue/Green Release Deployment'}
            </button>
          </div>

          {/* Pipelines Grid */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Pipeline Code &amp; Commit</th>
                    <th className="px-5 py-3.5">Branch</th>
                    <th className="px-5 py-3.5">Environment</th>
                    <th className="px-5 py-3.5">Strategy</th>
                    <th className="px-5 py-3.5">Duration</th>
                    <th className="px-5 py-3.5">Author</th>
                    <th className="px-5 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {pipelinesList.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-bold text-white font-mono">{p.pipelineCode}</div>
                        <div className="text-[11px] font-mono text-blue-400 flex items-center gap-1">
                          <span>Commit #{p.commitHash}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono text-slate-300">
                        {p.branch}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-full ${
                          p.environment === 'PRODUCTION' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' :
                          p.environment === 'STAGING' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30' :
                          'bg-blue-500/10 text-blue-300 border border-blue-500/30'
                        }`}>
                          {p.environment}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono text-slate-300">
                        {p.deploymentStrategy}
                      </td>
                      <td className="px-5 py-4 font-mono text-slate-300">
                        {p.durationSeconds}s
                      </td>
                      <td className="px-5 py-4 text-slate-400">
                        {p.author}
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-[10px] font-bold rounded-full">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: All 32 Architecture Modules */}
      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-3 max-h-[750px] overflow-y-auto pr-1">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Phase 16I Architecture Modules (1-32)
            </h2>
            {DEVOPS_MODULES.map((module) => {
              const isSelected = module.id === selectedModuleId;
              return (
                <div
                  key={module.id}
                  onClick={() => setSelectedModuleId(module.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-blue-500/50 shadow-lg shadow-blue-500/5'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400'}`}>
                      <Server className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] text-blue-400 font-semibold uppercase tracking-wider">
                        Module {module.number < 10 ? `0${module.number}` : module.number}
                      </div>
                      <h3 className="text-xs font-bold text-white line-clamp-1">
                        {module.name}
                      </h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                  Module {selectedModule.number < 10 ? `0${selectedModule.number}` : selectedModule.number} Technical Spec
                </span>
                <h2 className="text-2xl font-bold text-white mt-1">
                  {selectedModule.name}
                </h2>
              </div>
              <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold rounded-full">
                Production Ready
              </span>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              {selectedModule.summary}
            </p>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Core Capabilities &amp; Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedModule.features.map((feature, idx) => (
                  <div key={idx} className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5" /> Database Tables
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedModule.dbTables.map((tbl) => (
                    <span key={tbl} className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-mono rounded">
                      {tbl}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" /> REST APIs
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedModule.apiEndpoints.map((api) => (
                    <span key={api} className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono rounded">
                      {api}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-blue-400" /> Reference Implementation Code
                </h3>
                <button
                  onClick={() => copySnippet(selectedModule.codeSnippet)}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-blue-400 transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode ? 'Copied' : 'Copy Code'}
                </button>
              </div>
              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-blue-300 overflow-x-auto leading-relaxed">
                <code>{selectedModule.codeSnippet}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Site Reliability Engineering (SRE) */}
      {activeTab === 'sre' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-rose-400" />
              Site Reliability Engineering (SRE) &amp; Error Budget Dashboard
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              SLI, SLO, Error Budgets, Reliability Scorecard, MTTD, MTTR, MTBF, and Root Cause Incident Timelines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <span className="text-slate-400 text-xs block">Service Level Indicator (SLI)</span>
              <div className="text-2xl font-bold text-emerald-400 font-mono">{PRESET_SRE_STATUS.sliValue}%</div>
              <p className="text-[11px] text-slate-400 font-mono">Target SLO: {PRESET_SRE_STATUS.sloTarget}%</p>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <span className="text-slate-400 text-xs block">Remaining Error Budget</span>
              <div className="text-2xl font-bold text-blue-400 font-mono">{PRESET_SRE_STATUS.remainingErrorBudgetPercent}%</div>
              <p className="text-[11px] text-emerald-400 font-mono">Burn Rate: 0.02x (Normal)</p>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <span className="text-slate-400 text-xs block">Mean Time To Detect / Recover</span>
              <div className="text-xl font-bold text-white font-mono">
                {PRESET_SRE_STATUS.mttdMinutes}m <span className="text-slate-400 text-xs font-normal">MTTD</span> / {PRESET_SRE_STATUS.mttrMinutes}m <span className="text-slate-400 text-xs font-normal">MTTR</span>
              </div>
              <p className="text-[11px] text-indigo-400 font-mono">MTBF: 42 Days</p>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <span className="text-slate-400 text-xs block">Reliability Score Index</span>
              <div className="text-2xl font-bold text-amber-400 font-mono">{PRESET_SRE_STATUS.reliabilityScore} / 100</div>
              <p className="text-[11px] text-emerald-400 font-mono">Status: Excellent</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: FinOps & Multi-Cloud */}
      {activeTab === 'finops-multicloud' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Enterprise FinOps &amp; Multi-Cloud Cost Allocation
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Multi-Cloud cost attribution, tenant billing metering, AI/database/storage cost allocation, and idle resource detection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <span className="text-slate-400 text-xs">Total Monthly Cloud Cost</span>
              <div className="text-3xl font-bold text-white font-mono">${PRESET_FINOPS_COSTS.totalMonthlyUsd.toLocaleString()}</div>
              <p className="text-xs text-amber-400 font-mono">Forecasted Next Month: ${PRESET_FINOPS_COSTS.forecastedNextMonthUsd.toLocaleString()}</p>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <span className="text-slate-400 text-xs">Idle Resources Detected</span>
              <div className="text-3xl font-bold text-amber-400 font-mono">{PRESET_FINOPS_COSTS.idleResourcesDetectedCount} Containers</div>
              <p className="text-xs text-slate-300 font-mono">Unused QA Envs Auto-Shutdown Triggered</p>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <span className="text-slate-400 text-xs">Monthly Cost Savings Potential</span>
              <div className="text-3xl font-bold text-emerald-400 font-mono">${PRESET_FINOPS_COSTS.potentialSavingsUsd.toLocaleString()}</div>
              <p className="text-xs text-emerald-300 font-mono">Action: Scale down idle staging pods</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: AI DevOps Assistant */}
      {activeTab === 'ai-devops' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-violet-400" />
              Gemini AI DevOps &amp; Predictive Incident Assistant
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              AI log anomaly diagnosis, deployment risk score evaluation, failure prediction, and automated recovery playbooks.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Paste Log Stream or Telemetry Text for AI Analysis:</label>
              <textarea
                rows={3}
                value={aiLogInput}
                onChange={(e) => setAiLogInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-violet-500"
              />
            </div>

            <button
              onClick={handleRunAiLogAnalysis}
              disabled={isAnalyzingLog}
              className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-violet-600/20 disabled:opacity-50"
            >
              <Brain className="w-4 h-4" />
              {isAnalyzingLog ? 'Gemini AI Analyzing Telemetry...' : 'Run Gemini AI Log Anomaly Diagnosis'}
            </button>

            {aiAnalysisResult && (
              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-violet-300 leading-relaxed overflow-x-auto">
                <code>{aiAnalysisResult}</code>
              </pre>
            )}
          </div>
        </div>
      )}

      {/* Tab 6: EOC & Mining Fleet IoT */}
      {activeTab === 'eoc-mining' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Monitor className="w-5 h-5 text-cyan-400" />
                Enterprise Operations Center (EOC) Live Telemetry
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-slate-400 block">Overall Status</span>
                <strong className="text-emerald-400 font-mono text-sm">{PRESET_EOC_LIVE.overallStatus}</strong>
              </div>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-slate-400 block">API Ingress Rate</span>
                <strong className="text-blue-400 font-mono text-sm">{PRESET_EOC_LIVE.apiReqPerSec} Req/Sec</strong>
              </div>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-slate-400 block">Active GPS Fleet Streams</span>
                <strong className="text-amber-400 font-mono text-sm">{PRESET_EOC_LIVE.activeGpsStreamCount} Modems</strong>
              </div>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-slate-400 block">AI LLM Subsystem Health</span>
                <strong className="text-violet-400 font-mono text-sm">{PRESET_EOC_LIVE.aiSubsystemHealth}</strong>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-400" /> Mining Fleet &amp; Quarry Infrastructure IoT Monitors
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {PRESET_MINING_INFRA_HEALTH.map((dev, idx) => (
                <div key={idx} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <div className="text-slate-200 font-bold">{dev.device}</div>
                    <div className="text-[11px] text-slate-400 font-mono">Latency: {dev.latencyMs} ms</div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[10px] rounded-full">
                    {dev.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Compliance & DX Portal */}
      {activeTab === 'continuity-compliance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> Compliance Audit Frameworks
            </h2>

            <div className="space-y-3">
              {PRESET_COMPLIANCE_SCORES.map((c, idx) => (
                <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <div className="text-slate-200 font-bold">{c.framework}</div>
                    <div className="text-emerald-400 font-mono text-[11px]">Audit Verification: {c.status}</div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-mono font-bold rounded-full">
                    {c.score}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-400" /> Developer Experience (DX) Portal &amp; SDKs
            </h2>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <span>TypeScript SDK Package (@rzminetrix/bos-sdk)</span>
                <span className="text-blue-400 font-mono font-bold">v2026.8.16I</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <span>Python Mining Telemetry SDK</span>
                <span className="text-emerald-400 font-mono font-bold">v2026.8.16I</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <span>OpenAPI 3.0 Interactive Swagger Explorer</span>
                <span className="text-indigo-400 font-mono font-bold">Ready</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <span>SonarQube Code Quality Score</span>
                <span className="text-amber-400 font-mono font-bold">98.4% Zero Smells</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 8: Digital Twin Topology */}
      {activeTab === 'digital-twin' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              Enterprise Platform 3D Digital Twin Infrastructure Topology
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRESET_DIGITAL_TWIN_NODES.map((node) => (
              <div key={node.id} className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                <div className="font-mono text-amber-300 font-bold">{node.label}</div>
                <div className="text-slate-400 font-mono">{node.type}</div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-emerald-400 font-bold">{node.health}</span>
                  <span className="text-blue-400 font-mono">Load: {node.loadPercent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 9: Environments */}
      {activeTab === 'environments' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-indigo-400" />
              Multi-Environment Runtime Clusters
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Production Kubernetes EKS, Staging, QA Serverless, and Customer Partner Sandbox environments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRESET_ENVIRONMENTS.map((env) => (
              <div key={env.id} className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
                <div>
                  <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold rounded">
                    {env.code}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">{env.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">{env.clusterType}</p>
                </div>

                <div className="space-y-2 text-xs border-t border-b border-slate-800 py-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Compute Resource:</span>
                    <strong className="text-white font-mono">{env.cpuCores} vCPU / {env.memoryGb} GB</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active Nodes:</span>
                    <strong className="text-emerald-400 font-mono">{env.activeNodes} Pods</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active Release:</span>
                    <strong className="text-blue-400 font-mono">{env.activeReleaseVersion}</strong>
                  </div>
                </div>

                <span className="w-full block text-center bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-bold py-1.5 rounded-lg">
                  {env.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 10: Containers & IaC */}
      {activeTab === 'containers-iac' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Box className="w-5 h-5 text-emerald-400" />
                Container Registry &amp; Trivy Vulnerability Scan
              </h2>
            </div>

            <div className="space-y-3">
              {PRESET_CONTAINER_IMAGES.map((img) => (
                <div key={img.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                  <div className="font-mono text-emerald-400 font-bold">{img.imageTag}</div>
                  <div className="text-slate-400 font-mono text-[11px] truncate">{img.digestSha}</div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                    <span className="text-slate-300 font-mono">{img.sizeMb} MB</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-mono font-bold rounded">
                      0 Critical / 0 High Vulnerabilities
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-emerald-400" />
                Terraform HCL Infrastructure &amp; Vault Secrets
              </h2>
            </div>

            <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
<code>{`# Terraform AWS EKS Cluster Provisioning Template
module "eks_cluster" {
  source          = "terraform-aws-modules/eks/aws"
  cluster_name    = "rzminetrix-bos-prod-mumbai"
  cluster_version = "1.30"
  subnets         = ["subnet-mumbai-az1", "subnet-mumbai-az2"]

  node_groups = {
    mining_workers = {
      desired_capacity = 6
      max_capacity     = 20
      min_capacity     = 2
      instance_types   = ["c6i.2xlarge"]
    }
  }
}`}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Tab 11: Observability & Alerts */}
      {activeTab === 'observability-alerts' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-rose-400" />
                Live OpenTelemetry APM &amp; Infrastructure Metrics
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PRESET_OBSERVABILITY_METRICS.map((m) => (
                <div key={m.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 font-mono">{m.metricKey}</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold rounded">
                      {m.status}
                    </span>
                  </div>

                  <div className="text-2xl font-bold text-white font-mono">
                    {m.currentValue} <span className="text-xs text-slate-400 font-normal">{m.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                Multi-Channel WhatsApp / Email Incident Dispatcher
              </h2>
            </div>

            <form onSubmit={handleDispatchTestAlert} className="flex gap-3">
              <input
                type="text"
                required
                placeholder="Simulate SRE Incident Alert title..."
                value={testAlertMessage}
                onChange={(e) => setTestAlertMessage(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
              >
                <Smartphone className="w-4 h-4" /> Dispatch WhatsApp Alert
              </button>
            </form>

            <div className="space-y-3">
              {incidentsList.map((inc) => (
                <div key={inc.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <div className="font-mono text-amber-400 font-bold">{inc.incidentCode} • {inc.serviceAffected}</div>
                    <div className="text-slate-200 font-semibold mt-0.5">{inc.title}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 font-mono font-bold rounded-full">
                      {inc.status}
                    </span>
                    {inc.status !== 'RESOLVED' && (
                      <button
                        onClick={() => handleResolveIncident(inc.id)}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 12: Backups & DR */}
      {activeTab === 'backups-dr' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-emerald-400" />
                Cross-Region Disaster Recovery &amp; Failover Router
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Primary: {drStatus.primaryRegion} | Failover: {drStatus.failoverRegion} | RTO &lt; {drStatus.rtoMinutes}m | RPO &lt; {drStatus.rpoMinutes}m
              </p>
            </div>

            <button
              onClick={handleSimulateDrFailover}
              disabled={isSimulatingFailover}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4" />
              {isSimulatingFailover ? 'Executing Failover...' : 'Execute DR Failover Simulation'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <span className="text-slate-400 block">Replication Status</span>
              <strong className="text-emerald-400 font-mono text-sm">{drStatus.replicationStatus}</strong>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <span className="text-slate-400 block">Recovery Time Objective (RTO)</span>
              <strong className="text-white font-mono text-sm">&lt; {drStatus.rtoMinutes} Minutes Guaranteed</strong>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <span className="text-slate-400 block">Recovery Point Objective (RPO)</span>
              <strong className="text-white font-mono text-sm">&lt; {drStatus.rpoMinutes} Minutes Guaranteed</strong>
            </div>
          </div>
        </div>
      )}

      {/* Tab 13: Schema */}
      {activeTab === 'schema' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Code className="w-5 h-5 text-slate-300" />
              DevOps Platform PostgreSQL Database Schema
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {DEVOPS_DATABASE_SCHEMA_TABLES.map((table) => (
              <div key={table.name} className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="font-mono text-blue-400 font-bold text-sm">{table.name}</div>
                <p className="text-xs text-slate-300">{table.description}</p>
                <div className="space-y-1 font-mono text-[11px] text-slate-400 bg-slate-900 p-3 rounded-lg border border-slate-800">
                  {table.columns.map((col, idx) => (
                    <div key={idx} className="text-slate-300">{col}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 14: Tests */}
      {activeTab === 'tests' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Phase 16I Automated DevOps &amp; SRE Test Suite Verification
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {DEVOPS_TEST_SUITE.map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-200 font-medium">{item.test}</span>
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 font-mono font-bold rounded-full">
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
