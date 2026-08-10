import React, { useState } from 'react';
import { 
  GitFork, CheckSquare, ListTodo, Cpu, Clock, ShieldCheck, History,
  AlertOctagon, CheckCircle2, BarChart3, Code, Terminal, Copy, Check,
  Search, Plus, Layers, Send, RefreshCw, AlertTriangle, Eye, Shield,
  FileText, ArrowRight, XCircle, UserCheck, CheckCircle, Zap, ShieldAlert,
  Play, Pause, Sliders, CornerDownRight, Filter, Download
} from 'lucide-react';
import { 
  WORKFLOW_APPROVAL_MODULES,
  PREBUILT_APPROVAL_REQUESTS,
  PRECONFIGURED_BUSINESS_RULES,
  PRECONFIGURED_TASKS,
  IMMUTABLE_AUDIT_LOGS,
  WORKFLOW_DATABASE_SCHEMA_TABLES,
  WORKFLOW_TEST_SUITE,
  WorkflowModuleSpec,
  ApprovalRequestSpec,
  TaskItemSpec,
  BusinessRuleSpec,
  AuditLogSpec
} from '../data/workflowApprovalAuditData';

export const WorkflowApprovalAuditSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'modules' | 'designer' | 'tasks' | 'rules' | 'audit' | 'timeline' | 'schema' | 'tests'>('inbox');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('workflow-execution-engine');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Approval Inbox State
  const [approvalList, setApprovalList] = useState<ApprovalRequestSpec[]>(PREBUILT_APPROVAL_REQUESTS);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [activeRequestModal, setActiveRequestModal] = useState<ApprovalRequestSpec | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Business Rules Simulator State
  const [ruleTestContext, setRuleTestContext] = useState<{ amount: number; dept: string }>({ amount: 650000, dept: 'MINING' });
  const [ruleEvaluationResult, setRuleEvaluationResult] = useState<string | null>(null);

  // Task Kanban State
  const [tasksList, setTasksList] = useState<TaskItemSpec[]>(PRECONFIGURED_TASKS);

  const selectedModule = WORKFLOW_APPROVAL_MODULES.find(m => m.id === selectedModuleId) || WORKFLOW_APPROVAL_MODULES[0];

  const copySnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleApproveRequest = (id: string) => {
    setApprovalList(prev => prev.map(req => req.id === id ? { ...req, status: 'APPROVED' } : req));
    setActionSuccessMsg(`Approval Request ${id} approved with Digital Signature Stamp.`);
    setActiveRequestModal(null);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  const handleRejectRequest = (id: string) => {
    setApprovalList(prev => prev.map(req => req.id === id ? { ...req, status: 'REJECTED' } : req));
    setActionSuccessMsg(`Approval Request ${id} rejected and returned to requester.`);
    setActiveRequestModal(null);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  const handleEvaluateRule = () => {
    if (ruleTestContext.amount <= 50000) {
      setRuleEvaluationResult(`Rule Result: AUTO_APPROVED (< ₹50,000 threshold). No higher level approval required.`);
    } else if (ruleTestContext.dept === 'MINING' && ruleTestContext.amount > 500000) {
      setRuleEvaluationResult(`Rule Result: MANDATORY_LEVEL_3_APPROVAL required (Mining High Value > ₹5,00,000). Route to MD / Safety Head.`);
    } else {
      setRuleEvaluationResult(`Rule Result: STANDARD_LEVEL_2_APPROVAL required. Route to Department Head.`);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Executive Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <GitFork className="w-3.5 h-3.5" /> Phase 16E Workflow Platform
            </span>
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono rounded-full">
              Workflow Engine, Approvals, Business Rules & Immutable Audit
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            RZ® Minetrix BOS — Enterprise Workflow, Approval & Business Rules Platform
          </h1>

          <p className="text-slate-300 text-base max-w-4xl leading-relaxed">
            Centralized multi-tenant workflow engine, visual BPMN designer, multi-level approval matrix, rule evaluation engine, task delegation inbox, SLA escalation router, and immutable audit platform powering all 10 Business Suites.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
            <div className="space-y-1">
              <p className="text-xs text-slate-400 uppercase font-medium">Approval Engine</p>
              <p className="text-lg font-bold text-amber-400 flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4" /> Multi-Level & Digital Sign
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-400 uppercase font-medium">Business Rule Engine</p>
              <p className="text-lg font-bold text-emerald-400 flex items-center gap-1.5">
                <Cpu className="w-4 h-4" /> Dynamic IF-THEN Logic
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-400 uppercase font-medium">Task Inbox & Board</p>
              <p className="text-lg font-bold text-blue-400 flex items-center gap-1.5">
                <ListTodo className="w-4 h-4" /> Kanban & Delegation
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-400 uppercase font-medium">Immutable Audit</p>
              <p className="text-lg font-bold text-violet-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> SHA-256 Field Ledger
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('inbox')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'inbox'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <CheckSquare className="w-4 h-4 text-amber-400" />
          Digital Approval Inbox
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
          10 Core Modules
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'tasks'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <ListTodo className="w-4 h-4 text-blue-400" />
          Task Inbox & Kanban
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'rules'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Cpu className="w-4 h-4 text-emerald-400" />
          Rule Engine Simulator
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'audit'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-violet-400" />
          Immutable Audit Platform
        </button>

        <button
          onClick={() => setActiveTab('schema')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'schema'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg'
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
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Test Matrix (100% Pass)
        </button>
      </div>

      {/* Action Success Toast */}
      {actionSuccessMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex items-center gap-2 shadow-lg animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="font-semibold">{actionSuccessMsg}</span>
        </div>
      )}

      {/* Tab 1: Live Digital Approval Inbox */}
      {activeTab === 'inbox' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-amber-400" />
                  Universal Digital Approval Center Inbox
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  14 Cross-suite approval workflows across Mining, Fleet, Building Materials, Finance, HRMS, and Marketplace.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {['ALL', 'MINING', 'FLEET', 'BUILDING_MATERIALS', 'FINANCE', 'HRMS'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedCategoryFilter === cat
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Approval Request Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {approvalList
                .filter(req => selectedCategoryFilter === 'ALL' || req.category === selectedCategoryFilter)
                .map((req) => (
                  <div
                    key={req.id}
                    className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3 flex flex-col justify-between hover:border-slate-700 transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-amber-400">{req.requestCode}</span>
                        <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                          req.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300' :
                          req.status === 'REJECTED' ? 'bg-red-500/20 text-red-300' :
                          req.status === 'AUTO_APPROVED' ? 'bg-blue-500/20 text-blue-300' :
                          'bg-amber-500/20 text-amber-300'
                        }`}>
                          {req.status}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white line-clamp-2">{req.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2">{req.details}</p>

                      <div className="p-3 bg-slate-900 border border-slate-800/80 rounded-lg space-y-1 text-xs">
                        <div className="flex justify-between text-slate-400">
                          <span>Requester:</span>
                          <span className="text-slate-200 font-medium">{req.requesterName}</span>
                        </div>
                        {req.amountINR && (
                          <div className="flex justify-between text-slate-400">
                            <span>Amount:</span>
                            <span className="text-amber-400 font-mono font-bold">₹{req.amountINR.toLocaleString('en-IN')}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-slate-400">
                          <span>Level:</span>
                          <span className="text-emerald-400 font-mono font-bold">Level {req.currentLevel} of {req.totalLevels}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-900 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setActiveRequestModal(req)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspect
                      </button>

                      {req.status === 'PENDING' && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleRejectRequest(req.id)}
                            className="px-3 py-1.5 bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                          <button
                            onClick={() => handleApproveRequest(req.id)}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-lg shadow-emerald-500/20"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 10 Core Architecture Modules */}
      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-3">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Phase 16E Workflow Platform Modules
            </h2>
            {WORKFLOW_APPROVAL_MODULES.map((module) => {
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
                      <GitFork className="w-5 h-5" />
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

      {/* Tab 3: Task Inbox & Kanban Board */}
      {activeTab === 'tasks' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-blue-400" />
              Enterprise Task Inbox & Operations Board
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Cross-suite operational tasks, task delegation, checklist monitoring, and due date alerts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tasksList.map((task) => (
              <div key={task.id} className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-400">{task.taskCode}</span>
                  <span className="px-2 py-0.5 bg-slate-900 text-[10px] font-mono text-slate-300 rounded font-bold">
                    {task.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white">{task.title}</h3>

                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Assignee:</span>
                    <span className="text-slate-200 font-medium">{task.assignee}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Due Date:</span>
                    <span className="text-amber-400 font-mono font-bold">{task.dueDate}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-900">
                  <span>Checklist: {task.checklistCount.done} / {task.checklistCount.total}</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">{task.suite}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Business Rule Engine Simulator */}
      {activeTab === 'rules' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-400" />
              Business Rule Engine & IF-THEN Simulator
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Dynamic rule expression evaluator executing threshold auto-approvals, safety alerts, and credit blocks.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rule Tester Form */}
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" /> Rule Evaluation Sandbox
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Transaction Amount (INR)</label>
                  <input
                    type="number"
                    value={ruleTestContext.amount}
                    onChange={(e) => setRuleTestContext({ ...ruleTestContext, amount: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300">Department</label>
                  <select
                    value={ruleTestContext.dept}
                    onChange={(e) => setRuleTestContext({ ...ruleTestContext, dept: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="MINING">Mining Operations</option>
                    <option value="FLEET">Fleet & Transport</option>
                    <option value="FINANCE">Finance & Accounts</option>
                    <option value="PROCUREMENT">Procurement & Stores</option>
                  </select>
                </div>

                <button
                  onClick={handleEvaluateRule}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <Play className="w-4 h-4" /> Evaluate Rule Expression
                </button>

                {ruleEvaluationResult && (
                  <div className="p-4 bg-slate-900 border border-slate-800 text-emerald-300 text-xs rounded-xl font-mono leading-relaxed">
                    {ruleEvaluationResult}
                  </div>
                )}
              </div>
            </div>

            {/* Active Rules List */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">Pre-Configured Business Rules</h3>
              {PRECONFIGURED_BUSINESS_RULES.map((rule) => (
                <div key={rule.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400">{rule.ruleCode}</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold rounded">
                      {rule.version} ACTIVE
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{rule.name}</h4>
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded text-[11px] font-mono text-slate-300">
                    IF ({rule.conditionIf}) THEN ({rule.actionThen})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Immutable Audit Platform */}
      {activeTab === 'audit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-violet-400" />
              Immutable Enterprise Audit Platform
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Field-level append-only audit trail capturing user actions, approval signatures, digital hash stamps, and IP logs.
            </p>
          </div>

          <div className="space-y-3">
            {IMMUTABLE_AUDIT_LOGS.map((log) => (
              <div key={log.id} className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-violet-400">{log.id} • {log.actionType}</span>
                  <span className="text-xs font-mono text-slate-400">{log.timestamp}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                  <div>User: <strong className="text-slate-200">{log.userEmail}</strong></div>
                  <div>Entity: <strong className="text-slate-200">{log.entityName} ({log.entityId})</strong></div>
                  <div>IP Address: <strong className="text-slate-200">{log.ipAddress}</strong></div>
                </div>

                <div className="space-y-1 pt-2 border-t border-slate-900">
                  <div className="text-[10px] font-mono uppercase text-slate-500 font-bold">Field Level Delta Changes:</div>
                  {log.fieldChanges.map((delta, i) => (
                    <div key={i} className="p-2 bg-slate-900 border border-slate-800/80 rounded font-mono text-xs flex justify-between text-slate-300">
                      <span>Field: <strong className="text-amber-400">{delta.field}</strong></span>
                      <span>Old: <span className="text-red-400">{delta.oldValue}</span> → New: <span className="text-emerald-400">{delta.newValue}</span></span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Database Schema */}
      {activeTab === 'schema' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-amber-400" />
                Workflow Engine Database Schema
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
            {WORKFLOW_DATABASE_SCHEMA_TABLES.map((table) => (
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

      {/* Tab 7: Automated Test Suite */}
      {activeTab === 'tests' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Phase 16E Automated Test Suite Verification
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                BPMN state transition tests, approval matrix verification, rule compiler tests, and audit hash verification.
              </p>
            </div>

            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-full">
              8 / 8 Tests Passing
            </span>
          </div>

          <div className="space-y-3">
            {WORKFLOW_TEST_SUITE.map((item, idx) => (
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

      {/* Detailed Modal Inspector */}
      {activeRequestModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold">{activeRequestModal.requestCode}</span>
                <h3 className="text-lg font-bold text-white">{activeRequestModal.title}</h3>
              </div>
              <button
                onClick={() => setActiveRequestModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{activeRequestModal.details}</p>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Department:</span>
                <span className="text-slate-200 font-bold">{activeRequestModal.department}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Priority:</span>
                <span className="text-amber-400 font-bold">{activeRequestModal.priority}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>SLA Due:</span>
                <span className="text-emerald-400 font-mono font-bold">{activeRequestModal.slaDueDate}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Assigned Approver:</span>
                <span className="text-violet-300 font-bold">{activeRequestModal.assignedApproverRole}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setActiveRequestModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
              >
                Close
              </button>
              {activeRequestModal.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => handleRejectRequest(activeRequestModal.id)}
                    className="px-4 py-2 bg-red-500/20 text-red-300 hover:bg-red-500/30 text-xs font-bold rounded-xl"
                  >
                    Reject Request
                  </button>
                  <button
                    onClick={() => handleApproveRequest(activeRequestModal.id)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-xl"
                  >
                    Approve with Digital Signature
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
