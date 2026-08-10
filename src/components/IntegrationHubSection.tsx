import React, { useState } from 'react';
import { 
  Server, Activity, Plug, Webhook, Sliders, Cpu, Search, BarChart3,
  Brain, GitFork, ShieldCheck, Terminal, Layers, Code, Play, Check,
  Copy, RefreshCw, CheckCircle2, AlertTriangle, Zap, Eye, Download,
  ArrowRight, Shield, Globe, Lock, Clock, Database, Radio, List, Box
} from 'lucide-react';
import { 
  INTEGRATION_HUB_MODULES,
  PREBUILT_API_ROUTES,
  PRECONFIGURED_CONNECTORS,
  LIVE_EVENT_STREAMS,
  BACKGROUND_JOB_QUEUES,
  WEBHOOK_LOGS,
  NUMBER_SERIES_PRESETS,
  INTEGRATION_DATABASE_SCHEMA_TABLES,
  INTEGRATION_TEST_SUITE,
  IntegrationModuleSpec,
  ApiRouteMetricSpec,
  ConnectorSpec,
  EventStreamSpec,
  BackgroundJobSpec,
  WebhookLogSpec,
  NumberSeriesRuleSpec
} from '../data/integrationHubData';

export const IntegrationHubSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'command-center' | 'modules' | 'flow-builder' | 'shared-services' | 'search-cache' | 'schema' | 'tests'>('command-center');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('api-gateway');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Shared Services Sandbox State
  const [selectedNsPreset, setSelectedNsPreset] = useState<NumberSeriesRuleSpec>(NUMBER_SERIES_PRESETS[0]);
  const [generatedNumberCode, setGeneratedNumberCode] = useState<string>(NUMBER_SERIES_PRESETS[0].exampleOutput);
  const [nsCounter, setNsCounter] = useState<number>(NUMBER_SERIES_PRESETS[0].currentSequence);

  // Global Search State
  const [searchQuery, setSearchQuery] = useState<string>('Tipper KA-04-E-9920');
  const [searchFilter, setSearchFilter] = useState<string>('ALL');
  const [searchResultCount, setSearchResultCount] = useState<number>(4);

  // Action Toast
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Flow Builder Canvas Mock Nodes
  const [builderNodes, setBuilderNodes] = useState([
    { id: 'node-1', type: 'TRIGGER', title: 'Weighbridge Pass Generated', detail: 'Event: WEIGHBRIDGE_GROSS_WEIGHT_CAPTURED' },
    { id: 'node-2', type: 'TRANSFORM', title: 'Transform JSON to PDF Invoice', detail: 'Mapping: Gross Weight -> Net Tonnage Tax' },
    { id: 'node-3', type: 'ACTION', title: 'WhatsApp Business API Dispatch', detail: 'Connector: Meta Cloud API -> Customer Phone' }
  ]);

  const selectedModule = INTEGRATION_HUB_MODULES.find(m => m.id === selectedModuleId) || INTEGRATION_HUB_MODULES[0];

  const copySnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleGenerateNextNumberSeries = () => {
    const nextSeq = nsCounter + 1;
    setNsCounter(nextSeq);
    const padded = String(nextSeq).padStart(selectedNsPreset.padLength, '0');
    const newCode = `${selectedNsPreset.prefix}-2026-${padded}`;
    setGeneratedNumberCode(newCode);
    setActionSuccessMsg(`Generated Atomic Sequential Number Code: ${newCode}`);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  const handleTestFlowRun = () => {
    setActionSuccessMsg(`Flow Execution Test Passed! Trigger -> Transform -> Dispatch completed in 18ms.`);
    setTimeout(() => setActionSuccessMsg(null), 3500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Executive Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Plug className="w-3.5 h-3.5" /> Phase 16F Integration Platform
            </span>
            <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-mono rounded-full">
              API Gateway, Integration Hub, Event Bus & Shared Services
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            RZ® Minetrix BOS — Enterprise Integration Platform & API Gateway
          </h1>

          <p className="text-slate-300 text-base max-w-4xl leading-relaxed">
            Single integration backbone connecting all 10 Business Suites. Features API Gateway, Event Bus, Background Queue Engine, Connector Hub, Webhook Dispatcher, Shared Core Services, Distributed Cache, Full-Text Search, and No-Code Flow Builder.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
            <div className="space-y-1">
              <p className="text-xs text-slate-400 uppercase font-medium">API Ingress Traffic</p>
              <p className="text-lg font-bold text-emerald-400 flex items-center gap-1.5">
                <Server className="w-4 h-4" /> 18,900 RPM (14ms avg)
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-400 uppercase font-medium">Event Bus Stream</p>
              <p className="text-lg font-bold text-amber-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4" /> Outbox Pub/Sub Ready
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-400 uppercase font-medium">Connector Catalog</p>
              <p className="text-lg font-bold text-blue-400 flex items-center gap-1.5">
                <Plug className="w-4 h-4" /> 5 Live Integrations
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-400 uppercase font-medium">Shared Core Services</p>
              <p className="text-lg font-bold text-violet-400 flex items-center gap-1.5">
                <Sliders className="w-4 h-4" /> Atomic Number Series
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('command-center')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'command-center'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Terminal className="w-4 h-4 text-emerald-400" />
          Live Command Center
        </button>

        <button
          onClick={() => setActiveTab('modules')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'modules'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Layers className="w-4 h-4" />
          14 Core Architecture Modules
        </button>

        <button
          onClick={() => setActiveTab('flow-builder')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'flow-builder'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <GitFork className="w-4 h-4 text-amber-400" />
          No-Code Integration Builder
        </button>

        <button
          onClick={() => setActiveTab('shared-services')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'shared-services'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Sliders className="w-4 h-4 text-blue-400" />
          Shared Services & Number Series
        </button>

        <button
          onClick={() => setActiveTab('search-cache')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'search-cache'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Search className="w-4 h-4 text-violet-400" />
          Global Search & Cache
        </button>

        <button
          onClick={() => setActiveTab('schema')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'schema'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Code className="w-4 h-4 text-slate-300" />
          Database Schema
        </button>

        <button
          onClick={() => setActiveTab('tests')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'tests'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Test Suite (100% Pass)
        </button>
      </div>

      {/* Action Toast Notification */}
      {actionSuccessMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex items-center gap-2 shadow-lg animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="font-semibold">{actionSuccessMsg}</span>
        </div>
      )}

      {/* Tab 1: Live Command Center */}
      {activeTab === 'command-center' && (
        <div className="space-y-6">
          {/* API Gateway & Connector Health Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live API Route Metrics */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-400" /> Live API Gateway Traffic
                </h2>
                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-300 text-xs font-mono rounded-full border border-emerald-500/20">
                  Rate Limiting Active
                </span>
              </div>

              <div className="space-y-3">
                {PREBUILT_API_ROUTES.map((route) => (
                  <div key={route.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-slate-900 text-emerald-400 font-mono font-bold rounded">
                          {route.method}
                        </span>
                        <span className="font-mono text-slate-200 font-bold">{route.endpoint}</span>
                      </div>
                      <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                        route.status === 'HEALTHY' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {route.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-900">
                      <span>RPM: <strong className="text-slate-200">{route.rpm.toLocaleString()}</strong></span>
                      <span>Avg Latency: <strong className="text-amber-400 font-mono">{route.avgLatencyMs}ms</strong></span>
                      <span>Auth: <strong className="text-blue-300 font-mono">{route.authType}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Connectors & External Ecosystem Health */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Plug className="w-4 h-4 text-blue-400" /> External Integration Connectors
                </h2>
                <span className="px-2.5 py-1 bg-blue-500/10 text-blue-300 text-xs font-mono rounded-full border border-blue-500/20">
                  5 Active Connectors
                </span>
              </div>

              <div className="space-y-3">
                {PRECONFIGURED_CONNECTORS.map((conn) => (
                  <div key={conn.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{conn.name}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                        conn.healthStatus === 'CONNECTED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {conn.healthStatus}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-900">
                      <span>Provider: <strong className="text-slate-200">{conn.provider}</strong></span>
                      <span>Daily Reqs: <strong className="text-emerald-400 font-mono">{conn.dailyRequests.toLocaleString()}</strong></span>
                      <span>Latency: <strong className="text-amber-400 font-mono">{conn.latencyMs}ms</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Event Stream & Background Queue Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live Event Bus Streams */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-400" /> Enterprise Event Bus Stream
                </h2>
                <span className="px-2.5 py-1 bg-amber-500/10 text-amber-300 text-xs font-mono rounded-full border border-amber-500/20">
                  Transactional Outbox
                </span>
              </div>

              <div className="space-y-3">
                {LIVE_EVENT_STREAMS.map((evt) => (
                  <div key={evt.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-amber-400 font-bold">{evt.eventName}</span>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold rounded">
                        {evt.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-900">
                      <span>Domain: <strong className="text-slate-200">{evt.sourceDomain}</strong></span>
                      <span>Subscribers: <strong className="text-blue-300">{evt.subscriberCount} Apps</strong></span>
                      <span>Time: <strong className="text-slate-400 font-mono">{evt.timestamp}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Background Job Queue Status */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-violet-400" /> Distributed Background Queue Engine
                </h2>
                <span className="px-2.5 py-1 bg-violet-500/10 text-violet-300 text-xs font-mono rounded-full border border-violet-500/20">
                  Multi-Worker Active
                </span>
              </div>

              <div className="space-y-3">
                {BACKGROUND_JOB_QUEUES.map((job) => (
                  <div key={job.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{job.jobName}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                        job.status === 'RUNNING' ? 'bg-amber-500/20 text-amber-300 animate-pulse' :
                        job.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {job.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-900">
                      <span>Queue: <strong className="text-violet-300 font-mono">{job.queueName}</strong></span>
                      <span>Attempts: <strong className="text-slate-200">{job.attempts}/{job.maxAttempts}</strong></span>
                      {job.durationMs && <span>Execution: <strong className="text-emerald-400 font-mono">{job.durationMs}ms</strong></span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 14 Core Architecture Modules */}
      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-3">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Phase 16F Integration Architecture Modules
            </h2>
            {INTEGRATION_HUB_MODULES.map((module) => {
              const isSelected = module.id === selectedModuleId;
              return (
                <div
                  key={module.id}
                  onClick={() => setSelectedModuleId(module.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500/50 shadow-lg shadow-emerald-500/5'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                      <Plug className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                        Module {module.number < 10 ? `0${module.number}` : module.number}
                      </div>
                      <h3 className="text-sm font-bold text-white">
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
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Module {selectedModule.number < 10 ? `0${selectedModule.number}` : selectedModule.number} Technical Spec
                </span>
                <h2 className="text-2xl font-bold text-white mt-1">
                  {selectedModule.name}
                </h2>
              </div>
              <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-full">
                Production Ready
              </span>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              {selectedModule.summary}
            </p>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Core Capabilities & Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedModule.features.map((feature, idx) => (
                  <div key={idx} className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                <h4 className="text-xs font-semibold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5" /> Database Tables
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedModule.dbTables.map((tbl) => (
                    <span key={tbl} className="px-2 py-1 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-mono rounded">
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
                  <Terminal className="w-4 h-4 text-emerald-400" /> Reference Code Implementation
                </h3>
                <button
                  onClick={() => copySnippet(selectedModule.codeSnippet)}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode ? 'Copied' : 'Copy Code'}
                </button>
              </div>
              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
                <code>{selectedModule.codeSnippet}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: No-Code Integration Builder */}
      {activeTab === 'flow-builder' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <GitFork className="w-5 h-5 text-amber-400" />
                No-Code Integration & Visual Flow Builder
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Design custom API event flows, webhook listeners, transformers, and connector actions with zero code.
              </p>
            </div>

            <button
              onClick={handleTestFlowRun}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
            >
              <Play className="w-4 h-4" /> Run Flow Simulation
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
            {builderNodes.map((node, i) => (
              <div key={node.id} className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                    node.type === 'TRIGGER' ? 'bg-emerald-500/20 text-emerald-300' :
                    node.type === 'TRANSFORM' ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    NODE 0{i + 1} • {node.type}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Active</span>
                </div>

                <h3 className="text-sm font-bold text-white">{node.title}</h3>
                <p className="text-xs text-slate-400 font-mono">{node.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Shared Core Services & Number Series */}
      {activeTab === 'shared-services' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-blue-400" />
              Shared Core Services & Atomic Number Series Engine
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Thread-safe atomic sequence generation, UUID v7 keys, Indian GST tax calculator, and feature flags.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Number Series Interactive Generator */}
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Box className="w-4 h-4 text-blue-400" /> Atomic Number Series Generator
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Select Document Entity</label>
                  <select
                    value={selectedNsPreset.id}
                    onChange={(e) => {
                      const preset = NUMBER_SERIES_PRESETS.find(p => p.id === e.target.value) || NUMBER_SERIES_PRESETS[0];
                      setSelectedNsPreset(preset);
                      setNsCounter(preset.currentSequence);
                      setGeneratedNumberCode(preset.exampleOutput);
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:outline-none focus:border-blue-500"
                  >
                    {NUMBER_SERIES_PRESETS.map((p) => (
                      <option key={p.id} value={p.id}>{p.entityType} ({p.prefix}-2026-XXXX)</option>
                    ))}
                  </select>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Prefix: <strong className="text-slate-200">{selectedNsPreset.prefix}</strong></span>
                    <span>Pad Length: <strong className="text-slate-200">{selectedNsPreset.padLength} Digits</strong></span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Current Sequence: <strong className="text-amber-400 font-mono">{nsCounter}</strong></span>
                    <span>Suffix: <strong className="text-slate-200">{selectedNsPreset.suffix}</strong></span>
                  </div>
                </div>

                <button
                  onClick={handleGenerateNextNumberSeries}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  <RefreshCw className="w-4 h-4" /> Generate Next Sequential Code
                </button>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-center space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Generated Result Code:</span>
                  <div className="text-xl font-bold font-mono text-emerald-400 tracking-wider">
                    {generatedNumberCode}
                  </div>
                </div>
              </div>
            </div>

            {/* GST & Tax Engine Specs */}
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Statutory Tax & Currency Services
              </h3>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex justify-between">
                  <span>Intra-State GST Rate:</span>
                  <strong className="text-emerald-400 font-mono">CGST 9% + SGST 9% (18% Total)</strong>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex justify-between">
                  <span>Inter-State GST Rate:</span>
                  <strong className="text-emerald-400 font-mono">IGST 18%</strong>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex justify-between">
                  <span>Mining Minerals TCS:</span>
                  <strong className="text-amber-400 font-mono">Section 206C(1C) — 1.00% TCS</strong>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex justify-between">
                  <span>UUID v7 Key Engine:</span>
                  <strong className="text-violet-300 font-mono">Time-Ordered 128-bit UUID</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Global Search & Distributed Cache */}
      {activeTab === 'search-cache' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-violet-400" />
              Global Enterprise Search & Distributed Cache Platform
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Cross-suite full-text search indexing with two-tier L1 memory and L2 Redis distributed caching.
            </p>
          </div>

          <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Tipper Registration, Invoice, PO, Customer, or Material..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>
              <button className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white font-bold text-xs rounded-xl transition-all">
                Search
              </button>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs flex justify-between items-center">
                <div>
                  <span className="font-bold text-white">[VEHICLE] Tipper Truck KA-04-E-9920</span>
                  <p className="text-[11px] text-slate-400">Fleet & Logistics • Assigned Driver: Suresh Patil</p>
                </div>
                <span className="text-emerald-400 font-mono text-[10px]">Indexed in L1 Cache (0.2ms)</span>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs flex justify-between items-center">
                <div>
                  <span className="font-bold text-white">[WEIGHBRIDGE PASS] WBP-2026-018920</span>
                  <p className="text-[11px] text-slate-400">Quarry Pit #4 • Net Tonnage: 32.45 MT GSB Aggregate</p>
                </div>
                <span className="text-emerald-400 font-mono text-[10px]">Indexed in Full-Text Search (12ms)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Database Schema */}
      {activeTab === 'schema' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-emerald-400" />
                Integration Platform Database Schema
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Multi-tenant isolated tables for API Gateway keys, Event Outbox, Queue Jobs, and Connectors.
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono rounded-full">
              Drizzle ORM Schema
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {INTEGRATION_DATABASE_SCHEMA_TABLES.map((table) => (
              <div key={table.name} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-white font-mono">{table.name}</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">Table</span>
                </div>
                <p className="text-xs text-slate-400">{table.description}</p>
                <div className="space-y-1">
                  {table.columns.map((col, idx) => (
                    <div key={idx} className="text-[10px] font-mono text-emerald-300/90 bg-slate-900/60 px-2 py-1 rounded border border-slate-800/60">
                      {col}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: Test Suite */}
      {activeTab === 'tests' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Phase 16F Automated Test Suite Verification
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Gateway JWT verification, event outbox replay, worker concurrency, and number series tests.
              </p>
            </div>

            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-full">
              8 / 8 Tests Passing
            </span>
          </div>

          <div className="space-y-3">
            {INTEGRATION_TEST_SUITE.map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm font-semibold text-slate-200">{item.test}</span>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold rounded-full">
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
