import React, { useState } from 'react';
import { 
  LayoutDashboard, Component, PieChart, Target, TrendingUp, FileText,
  Download, Filter, Radio, Sparkles, Calendar, CheckCircle2, Code,
  Terminal, Copy, Check, Search, Plus, Layers, Send, RefreshCw,
  AlertTriangle, Eye, ShieldCheck, Sun, Moon, ArrowUpRight, ArrowDownRight,
  Maximize2, Share2, Grid, Table, BarChart3, Clock, Zap, Cpu, Settings
} from 'lucide-react';
import { 
  DASHBOARD_REPORTING_MODULES,
  PRECONFIGURED_KPIS,
  PRECONFIGURED_WIDGETS,
  EXECUTIVE_SUITE_DASHBOARDS,
  REPORT_TEMPLATES_CATALOG,
  DASHBOARD_DATABASE_SCHEMA_TABLES,
  DASHBOARD_TEST_SUITE,
  DashboardModuleSpec,
  KpiMetricSpec,
  ExecutiveDashboardSuite,
  ReportTemplateSpec
} from '../data/dashboardKpiReportingData';

export const DashboardKpiReportingSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'modules' | 'cockpit' | 'kpis' | 'widgets' | 'reports' | 'analytics' | 'scheduler' | 'schema' | 'tests'>('cockpit');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('enterprise-dashboard-framework');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Executive Cockpit State
  const [selectedSuiteId, setSelectedSuiteId] = useState<string>('c-suite-exec');
  const [themeMode, setThemeMode] = useState<'DARK' | 'LIGHT'>('DARK');
  const [kpisList, setKpisList] = useState<KpiMetricSpec[]>(PRECONFIGURED_KPIS);
  const [selectedKpiCategory, setSelectedKpiCategory] = useState<string>('ALL');

  // AI Copilot Query Simulator
  const [nlQuery, setNlQuery] = useState<string>('Show me diesel consumption ratio vs MT dispatched for Quarry Pit #04');
  const [aiSummaryResult, setAiSummaryResult] = useState<string | null>(null);
  const [isGeneratingAiSummary, setIsGeneratingAiSummary] = useState<boolean>(false);

  // Export Center Simulator
  const [exportFormat, setExportFormat] = useState<'PDF' | 'EXCEL' | 'CSV' | 'WHATSAPP'>('PDF');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccessMsg, setExportSuccessMsg] = useState<string | null>(null);

  // Filter Engine Global State
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL_BRANCHES');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('THIS_MONTH');

  const selectedModule = DASHBOARD_REPORTING_MODULES.find(m => m.id === selectedModuleId) || DASHBOARD_REPORTING_MODULES[0];
  const activeSuite = EXECUTIVE_SUITE_DASHBOARDS.find(s => s.id === selectedSuiteId) || EXECUTIVE_SUITE_DASHBOARDS[0];

  const copySnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSimulateAiSummary = () => {
    setIsGeneratingAiSummary(true);
    setTimeout(() => {
      setIsGeneratingAiSummary(false);
      setAiSummaryResult(
        `Gemini AI Executive Analysis (FY 2026-27):\n` +
        `• Quarry Pit #04 dispatched 48,250 MT of aggregate (+14.6% vs target), driven by strong demand for 20mm Granite.\n` +
        `• Fleet diesel efficiency averaged 0.92 L/MT (slight 8.2% variance above 0.85 L/MT benchmark due to extended haul road idle times).\n` +
        `• Recommendation: Optimize Tipper turnaround cycles at Crusher Feed Hopper #2 to reduce idle fuel loss by ~450 Liters/week.`
      );
    }, 800);
  };

  const handleSimulateExport = () => {
    setIsExporting(true);
    setExportSuccessMsg(null);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccessMsg(`Successfully generated and queued ${exportFormat} export for ${activeSuite.suiteName}.`);
    }, 700);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Executive Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <LayoutDashboard className="w-3.5 h-3.5" /> Phase 16D Dashboard & Reporting Engine
            </span>
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono rounded-full">
              Executive Cockpit, Dynamic KPIs, Analytics & AI Copilot
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            RZ® Minetrix BOS — Enterprise Dashboard Engine & Reporting Platform
          </h1>

          <p className="text-slate-300 text-base max-w-4xl leading-relaxed">
            Universal business intelligence and reporting platform delivering real-time executive cockpits, dynamic drag-and-drop widget layouts, custom KPI formula engines, OLAP analytics cubes, Gemini AI reporting copilot, and automated multi-channel report schedulers across all 10 Business Suites.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
            <div className="space-y-1">
              <p className="text-xs text-slate-400 uppercase font-medium">Executive Cockpits</p>
              <p className="text-lg font-bold text-amber-400 flex items-center gap-1.5">
                <PieChart className="w-4 h-4" /> 10 Pre-Configured Suites
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-400 uppercase font-medium">Dynamic KPI Framework</p>
              <p className="text-lg font-bold text-emerald-400 flex items-center gap-1.5">
                <Target className="w-4 h-4" /> Custom Math Formulas
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-400 uppercase font-medium">Multi-Format Exports</p>
              <p className="text-lg font-bold text-blue-400 flex items-center gap-1.5">
                <Download className="w-4 h-4" /> PDF, Excel, WhatsApp
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-400 uppercase font-medium">AI Reporting Copilot</p>
              <p className="text-lg font-bold text-violet-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Gemini AI Natural Language
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('cockpit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'cockpit'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 text-amber-400" />
          Live Executive Cockpit
        </button>

        <button
          onClick={() => setActiveTab('modules')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'modules'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Layers className="w-4 h-4" />
          11 Core Modules
        </button>

        <button
          onClick={() => setActiveTab('kpis')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'kpis'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Target className="w-4 h-4 text-emerald-400" />
          KPI Engine & Formulas
        </button>

        <button
          onClick={() => setActiveTab('widgets')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'widgets'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Component className="w-4 h-4 text-blue-400" />
          Widget Engine
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'reports'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <FileText className="w-4 h-4 text-violet-400" />
          Report Builder & Export
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'analytics'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          AI Analytics & Copilot
        </button>

        <button
          onClick={() => setActiveTab('scheduler')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'scheduler'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Calendar className="w-4 h-4 text-blue-400" />
          Report Scheduler
        </button>

        <button
          onClick={() => setActiveTab('schema')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'schema'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Code className="w-4 h-4" />
          Database Schema
        </button>

        <button
          onClick={() => setActiveTab('tests')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'tests'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Test Matrix (100% Pass)
        </button>
      </div>

      {/* Tab 1: Live Executive Cockpit Sandbox */}
      {activeTab === 'cockpit' && (
        <div className="space-y-6">
          {/* Top Control Bar: Suite Selector, Theme Switch, Global Filter */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
            {/* Suite Selector Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {EXECUTIVE_SUITE_DASHBOARDS.map((suite) => (
                <button
                  key={suite.id}
                  onClick={() => setSelectedSuiteId(suite.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedSuiteId === suite.id
                      ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {suite.suiteName.split(' ')[0]} {suite.suiteName.split(' ')[1]}
                </button>
              ))}
            </div>

            {/* Controls & Theme Switch */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="bg-transparent text-white focus:outline-none"
                >
                  <option value="ALL_BRANCHES">All Quarry Pits & Sites</option>
                  <option value="BLR_QUARRY_01">Bangalore North Quarry #1</option>
                  <option value="KAR_QUARRY_04">Hospet Iron/Granite Pit #4</option>
                </select>
              </div>

              <button
                onClick={() => setThemeMode(prev => prev === 'DARK' ? 'LIGHT' : 'DARK')}
                className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              >
                {themeMode === 'DARK' ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                {themeMode}
              </button>
            </div>
          </div>

          {/* Active Cockpit Frame */}
          <div className={`p-6 rounded-2xl border transition-all ${
            themeMode === 'DARK'
              ? 'bg-slate-950 border-slate-800 text-white'
              : 'bg-slate-100 border-slate-300 text-slate-900 shadow-2xl'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                  Active Cockpit Scope: {activeSuite.roleScope}
                </span>
                <h2 className={`text-2xl font-bold mt-1 ${themeMode === 'DARK' ? 'text-white' : 'text-slate-900'}`}>
                  {activeSuite.suiteName}
                </h2>
                <p className={`text-xs mt-1 ${themeMode === 'DARK' ? 'text-slate-400' : 'text-slate-600'}`}>
                  {activeSuite.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold rounded-full flex items-center gap-1">
                  <Radio className="w-3 h-3 animate-pulse" /> Live Stream Connected
                </span>
              </div>
            </div>

            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {PRECONFIGURED_KPIS.slice(0, 4).map((kpi) => (
                <div
                  key={kpi.id}
                  className={`p-4 rounded-xl border transition-all ${
                    themeMode === 'DARK'
                      ? 'bg-slate-900 border-slate-800'
                      : 'bg-white border-slate-200 shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">{kpi.category}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                      kpi.status === 'OPTIMAL' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {kpi.status}
                    </span>
                  </div>

                  <h3 className={`text-xs font-bold ${themeMode === 'DARK' ? 'text-slate-300' : 'text-slate-700'}`}>
                    {kpi.title}
                  </h3>

                  <div className="flex items-baseline justify-between mt-3">
                    <div className="text-2xl font-bold font-mono tracking-tight">
                      {kpi.currentValue.toLocaleString()} <span className="text-xs text-slate-400 font-sans">{kpi.unit}</span>
                    </div>

                    <div className={`flex items-center text-xs font-mono font-bold ${
                      kpi.trendPercentage >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {kpi.trendPercentage >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      {Math.abs(kpi.trendPercentage)}%
                    </div>
                  </div>

                  <div className="mt-2 text-[10px] text-slate-500 font-mono border-t border-slate-800/60 pt-2 flex justify-between">
                    <span>Target: {kpi.targetValue} {kpi.unit}</span>
                    <span>Prev: {kpi.previousPeriodValue}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Interactive Visual Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Chart 1: Live Weighbridge Dispatch Trend */}
              <div className={`lg:col-span-8 p-5 rounded-xl border ${
                themeMode === 'DARK' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-md'
              }`}>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold">Hourly Aggregate Dispatch Tonnage (MT)</h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Target: 4,000 MT / Shift</span>
                </div>

                {/* SVG Live Bar Visualizer */}
                <div className="h-48 flex items-end justify-between gap-2 pt-6 px-2">
                  {[
                    { hour: '07:00', mt: 320, color: 'bg-amber-500' },
                    { hour: '09:00', mt: 580, color: 'bg-amber-500' },
                    { hour: '11:00', mt: 890, color: 'bg-emerald-500' },
                    { hour: '13:00', mt: 740, color: 'bg-amber-500' },
                    { hour: '15:00', mt: 960, color: 'bg-emerald-500' },
                    { hour: '17:00', mt: 820, color: 'bg-emerald-500' },
                    { hour: '19:00', mt: 510, color: 'bg-amber-500' }
                  ].map((bar, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <span className="text-[10px] font-mono font-bold text-slate-300">{bar.mt}</span>
                      <div
                        style={{ height: `${(bar.mt / 1000) * 100}%` }}
                        className={`w-full rounded-t-md ${bar.color} transition-all duration-500 hover:opacity-80`}
                      />
                      <span className="text-[9px] font-mono text-slate-500">{bar.hour}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart 2: Material Grade Donut Breakdown */}
              <div className={`lg:col-span-4 p-5 rounded-xl border ${
                themeMode === 'DARK' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-md'
              }`}>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold">Material Grade Mix</h3>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {[
                    { grade: '20mm Granite Aggregate', pct: 38, mt: '18,335 MT', color: 'bg-emerald-500' },
                    { grade: '10mm Granite Aggregate', pct: 24, mt: '11,580 MT', color: 'bg-blue-500' },
                    { grade: 'M-Sand (Manufactured)', pct: 20, mt: '9,650 MT', color: 'bg-amber-500' },
                    { grade: 'GSB Base Material', pct: 18, mt: '8,685 MT', color: 'bg-violet-500' }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-300">{item.grade}</span>
                        <span className="font-mono text-slate-400">{item.mt} ({item.pct}%)</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div style={{ width: `${item.pct}%` }} className={`h-full ${item.color}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Table 3: Active Tipper GPS Live Status */}
              <div className={`lg:col-span-12 p-5 rounded-xl border ${
                themeMode === 'DARK' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-md'
              }`}>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Table className="w-4 h-4 text-blue-400" />
                    <h3 className="text-sm font-bold">Live Active Tipper GPS Operations Feed</h3>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">6 Active Vehicles in Transit</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="p-2.5">Vehicle Reg #</th>
                        <th className="p-2.5">Driver Name</th>
                        <th className="p-2.5">Current GPS Zone</th>
                        <th className="p-2.5">Payload Material</th>
                        <th className="p-2.5">Speed (km/h)</th>
                        <th className="p-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {[
                        { reg: 'KA-04-E-9920', driver: 'Ramesh Kumar', zone: 'Quarry Pit #4 -> Crusher Hopper #2', mat: '20mm Granite', speed: '32 km/h', status: 'IN_TRANSIT' },
                        { reg: 'KA-04-E-9921', driver: 'Suresh Patil', zone: 'Weighbridge Gate #1', mat: 'M-Sand', speed: '0 km/h', status: 'WEIGHING' },
                        { reg: 'KA-04-E-9925', driver: 'Abdul Rahman', zone: 'Outer Ring Road Highway Dispatch', mat: 'GSB Material', speed: '54 km/h', status: 'DISPATCHED' }
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-slate-800/40">
                          <td className="p-2.5 font-bold text-amber-400">{row.reg}</td>
                          <td className="p-2.5 text-slate-300">{row.driver}</td>
                          <td className="p-2.5 text-slate-400">{row.zone}</td>
                          <td className="p-2.5 text-emerald-400">{row.mat}</td>
                          <td className="p-2.5 text-slate-300">{row.speed}</td>
                          <td className="p-2.5">
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded">
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 11 Architecture Modules */}
      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-3">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Phase 16D Core Architecture Modules
            </h2>
            {DASHBOARD_REPORTING_MODULES.map((module) => {
              const isSelected = module.id === selectedModuleId;
              return (
                <div
                  key={module.id}
                  onClick={() => setSelectedModuleId(module.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500/50 shadow-lg shadow-amber-500/5'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                      <LayoutDashboard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                        Module 0{module.number}
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
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  Module 0{selectedModule.number} Technical Spec
                </span>
                <h2 className="text-2xl font-bold text-white mt-1">
                  {selectedModule.name}
                </h2>
              </div>
              <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold rounded-full">
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
                    <span className="text-amber-400 font-bold">•</span>
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
                  <Terminal className="w-4 h-4 text-amber-400" /> Reference Code Implementation
                </h3>
                <button
                  onClick={() => copySnippet(selectedModule.codeSnippet)}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-400 transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode ? 'Copied' : 'Copy Code'}
                </button>
              </div>
              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-amber-300 overflow-x-auto leading-relaxed">
                <code>{selectedModule.codeSnippet}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: KPI Engine & Formula Manager */}
      {activeTab === 'kpis' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-400" />
                  Dynamic KPI Metric Catalog & Formula Builder
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  Custom math formula evaluator tracking target variances and status metrics across all 10 Business Suites.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {['ALL', 'PRODUCTION', 'FINANCIAL', 'FLEET'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedKpiCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedKpiCategory === cat
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {kpisList
                .filter(k => selectedKpiCategory === 'ALL' || k.category === selectedKpiCategory)
                .map((kpi) => (
                  <div key={kpi.id} className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-emerald-400">{kpi.code}</span>
                      <span className={`px-2.5 py-0.5 text-xs font-mono font-bold rounded ${
                        kpi.status === 'OPTIMAL' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {kpi.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">{kpi.title}</h3>
                    <p className="text-xs text-slate-400">{kpi.description}</p>

                    <div className="p-3 bg-slate-900 border border-slate-800/80 rounded-lg font-mono text-xs text-amber-300">
                      Formula: {kpi.formula}
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-900">
                      <span className="text-slate-400">Current: <strong className="text-white font-mono">{kpi.currentValue} {kpi.unit}</strong></span>
                      <span className="text-slate-400">Target: <strong className="text-white font-mono">{kpi.targetValue} {kpi.unit}</strong></span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Widget Engine Catalog */}
      {activeTab === 'widgets' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Component className="w-5 h-5 text-blue-400" />
              Reusable Widget Engine & Visual Catalog
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Reusable visual widgets connectable to any API data stream with auto-refresh timers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRECONFIGURED_WIDGETS.map((wid) => (
              <div key={wid.id} className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[10px] font-mono font-bold rounded">
                    {wid.type}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Refresh: {wid.refreshRateSeconds}s</span>
                </div>

                <h3 className="text-sm font-bold text-white">{wid.title}</h3>

                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-emerald-400">
                  Data API: {wid.dataSourceApi}
                </div>

                <div className="text-[10px] text-slate-500 font-mono">
                  Grid Allocation: {wid.size} Columns
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Report Builder & Multi-Format Export Center */}
      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-violet-400" />
                Custom Report Builder & Export Hub
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Generate vector PDFs, multi-tab Excel sheets, streaming CSVs, or instant WhatsApp dispatches.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Select Report Template</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500">
                  {REPORT_TEMPLATES_CATALOG.map((rpt) => (
                    <option key={rpt.id} value={rpt.id}>{rpt.title} ({rpt.reportCode})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Target Export Format</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['PDF', 'EXCEL', 'CSV', 'WHATSAPP'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setExportFormat(fmt)}
                      className={`p-2.5 rounded-xl text-xs font-bold transition-all ${
                        exportFormat === fmt
                          ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/20'
                          : 'bg-slate-950 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSimulateExport}
                disabled={isExporting}
                className="w-full bg-violet-500 hover:bg-violet-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {isExporting ? 'Generating Export File...' : `Export Report as ${exportFormat}`}
              </button>

              {exportSuccessMsg && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{exportSuccessMsg}</span>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Standard Pre-Built Enterprise Reports
            </h2>
            <div className="space-y-3">
              {REPORT_TEMPLATES_CATALOG.map((rpt) => (
                <div key={rpt.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400">{rpt.reportCode}</span>
                    <span className="px-2 py-0.5 bg-slate-900 text-[10px] font-mono font-bold text-violet-300 rounded">
                      {rpt.scheduleFrequency}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{rpt.title}</h3>
                  <p className="text-xs text-slate-400">{rpt.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: AI Analytics & Copilot */}
      {activeTab === 'analytics' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Gemini AI Analytics Copilot & Natural Language Query Sandbox
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Ask operational questions in plain English to generate instant executive text summaries and anomaly forecasts.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Natural Language Operational Prompt</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={nlQuery}
                  onChange={(e) => setNlQuery(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={handleSimulateAiSummary}
                  disabled={isGeneratingAiSummary}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  {isGeneratingAiSummary ? 'Analyzing...' : 'Run Copilot Query'}
                </button>
              </div>
            </div>

            {aiSummaryResult && (
              <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <Sparkles className="w-4 h-4" /> Gemini AI Executive Analysis Output:
                </div>
                <pre className="whitespace-pre-wrap font-sans text-xs text-slate-200 leading-relaxed">
                  {aiSummaryResult}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 7: Report Scheduler */}
      {activeTab === 'scheduler' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Automated Report Scheduler & Auto-Archive Manager
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Cron engine executing daily morning digests, weekly fleet performance reports, and auto-archiving to Cloud Storage.
            </p>
          </div>

          <div className="p-8 text-center bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Cron Scheduler Active & Healthy</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              3 Active Cron Schedules (Daily at 07:00 AM IST, Weekly Monday 08:00 AM, Monthly 1st 09:00 AM). All dispatches executed within SLA.
            </p>
          </div>
        </div>
      )}

      {/* Tab 8: Database & RLS Schema */}
      {activeTab === 'schema' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-amber-400" />
                Dashboard & Reporting Engine Database Schema
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Multi-tenant tenant isolation, Drizzle ORM schemas, and foreign key bindings.
              </p>
            </div>
            <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono rounded-full">
              Drizzle ORM Schema
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {DASHBOARD_DATABASE_SCHEMA_TABLES.map((table) => (
              <div key={table.name} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-white font-mono">{table.name}</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">Table</span>
                </div>
                <p className="text-xs text-slate-400">{table.description}</p>
                <div className="space-y-1">
                  {table.columns.map((col, idx) => (
                    <div key={idx} className="text-[10px] font-mono text-amber-300/90 bg-slate-900/60 px-2 py-1 rounded border border-slate-800/60">
                      {col}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 9: Automated Test Suite */}
      {activeTab === 'tests' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Phase 16D Automated Test Suite Verification
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Unit tests, integration tests, Gemini AI summarizer tests, and export engine benchmarks.
              </p>
            </div>

            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-full">
              8 / 8 Tests Passing
            </span>
          </div>

          <div className="space-y-3">
            {DASHBOARD_TEST_SUITE.map((item, idx) => (
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
