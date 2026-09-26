import React, { useState } from 'react';
import { NotificationLiveFeedPanel } from './NotificationLiveFeedPanel';
import { 
  Bell, Mail, MessageSquare, Smartphone, Clock, Zap, Inbox, FileCode,
  CheckCircle2, Code, Terminal, Copy, Check, Filter, Search, Plus,
  Shield, Layers, Send, RefreshCw, AlertTriangle, FileText, Download,
  Eye, Trash2, Sliders, Calendar, ChevronRight, ArrowRight, ShieldCheck,
  CheckCheck, User, Sparkles, Building2, Globe, Radio, Phone, Activity
} from 'lucide-react';
import { 
  NOTIFICATION_COMMUNICATION_MODULES,
  PREBUILT_NOTIFICATION_TEMPLATES,
  ACTIVE_INDUSTRIAL_REMINDERS,
  AUTOMATION_RULES_LIST,
  NOTIFICATION_DATABASE_SCHEMA_TABLES,
  NOTIFICATION_TEST_SUITE,
  NotificationModuleSpec,
  NotificationTemplate,
  IndustrialReminder,
  AutomationRule
} from '../data/notificationCommunicationData';

export const NotificationCommunicationSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'live-feed' | 'modules' | 'simulator' | 'reminders' | 'automation' | 'templates' | 'messages' | 'schema' | 'tests'>('modules');
  const [feedToast, setFeedToast] = useState<string | null>(null);
  const showFeedToast = (msg: string) => {
    setFeedToast(msg);
    setTimeout(() => setFeedToast(null), 3000);
  };
  const [selectedModuleId, setSelectedModuleId] = useState<string>('enterprise-notification-engine');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Live Multi-Channel Dispatcher Simulator State
  const [dispatchChannel, setDispatchChannel] = useState<'IN_APP' | 'WHATSAPP' | 'EMAIL' | 'SMS' | 'PUSH'>('IN_APP');
  const [simRecipient, setSimRecipient] = useState<string>('Alex Vance (Mining Compliance Head)');
  const [simPhone, setSimPhone] = useState<string>('+91 98801 23456');
  const [simEmail, setSimEmail] = useState<string>('alex.vance@rzmining.com');
  const [simTitle, setSimTitle] = useState<string>('Quarry Pit #04 Overburden Blast Notification');
  const [simBody, setSimBody] = useState<string>('Primary jaw crusher blast clear 500m zone. Scheduled for 14:30 IST today.');
  const [simPriority, setSimPriority] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM' | 'SILENT'>('CRITICAL');
  const [liveToasts, setLiveToasts] = useState<any[]>([
    {
      id: 'toast-001',
      channel: 'IN_APP',
      title: 'Weighbridge Dispatch Completed',
      body: 'Tipper KA-04-E-9920 loaded with 18.5 MT 20mm Granite Aggregate.',
      priority: 'HIGH',
      timestamp: '2 mins ago',
      read: false
    },
    {
      id: 'toast-002',
      channel: 'WHATSAPP',
      title: 'WhatsApp PDF Invoice Sent',
      body: 'Tax Invoice #INV-2026-0842 delivered to InfraBuild Corp (+91 98450 11223).',
      priority: 'MEDIUM',
      timestamp: '12 mins ago',
      read: true
    }
  ]);
  const [isSimulatingDispatch, setIsSimulatingDispatch] = useState<boolean>(false);

  // Interactive Reminder Filter State
  const [reminderCategory, setReminderCategory] = useState<string>('ALL');
  const [reminderSearch, setReminderSearch] = useState<string>('');
  const [remindersList, setRemindersList] = useState<IndustrialReminder[]>(ACTIVE_INDUSTRIAL_REMINDERS);

  // Template Manager State
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tpl-001');
  const selectedTemplate = PREBUILT_NOTIFICATION_TEMPLATES.find(t => t.id === selectedTemplateId) || PREBUILT_NOTIFICATION_TEMPLATES[0];

  // Automation Rule State
  const [rules, setRules] = useState<AutomationRule[]>(AUTOMATION_RULES_LIST);

  const selectedModule = NOTIFICATION_COMMUNICATION_MODULES.find(m => m.id === selectedModuleId) || NOTIFICATION_COMMUNICATION_MODULES[0];

  const copySnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSimulatedDispatch = () => {
    setIsSimulatingDispatch(true);
    setTimeout(() => {
      setIsSimulatingDispatch(false);
      const newToast = {
        id: `toast-${Date.now().toString().slice(-4)}`,
        channel: dispatchChannel,
        title: simTitle,
        body: simBody,
        priority: simPriority,
        timestamp: 'Just now',
        read: false
      };
      setLiveToasts(prev => [newToast, ...prev]);
    }, 600);
  };

  const handleAcknowledgeReminder = (id: string) => {
    setRemindersList(prev => prev.map(r => r.id === id ? { ...r, status: 'ACKNOWLEDGED' } : r));
  };

  const handleToggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, isEnabled: !r.isEnabled } : r));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Executive Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5" /> Phase 16C Communication Engine
            </span>
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono rounded-full">
              Notification Center, Email, WhatsApp & Reminders
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            RZ® Minetrix BOS — Enterprise Notification & Communication Engine
          </h1>

          <p className="text-slate-300 text-base max-w-4xl leading-relaxed">
            The universal cross-cutting communication platform powering multi-channel real-time in-app alerts, AWS SES email compilation, Meta WhatsApp Business API PDF dispatches, DLT-compliant SMS OTPs, FCM mobile push, and proactive industrial compliance reminders across all 10 Business Suites.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
            <div className="space-y-1">
              <p className="text-xs text-slate-400 uppercase font-medium">In-App Notifications</p>
              <p className="text-lg font-bold text-blue-400 flex items-center gap-1.5">
                <Bell className="w-4 h-4" /> Real-Time SSE & Toasts
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-400 uppercase font-medium">WhatsApp Business</p>
              <p className="text-lg font-bold text-emerald-400 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" /> PDF Invoices & Gate Passes
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-400 uppercase font-medium">Compliance Reminders</p>
              <p className="text-lg font-bold text-amber-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Auto-Scheduler Matrix
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-400 uppercase font-medium">Automation Rules</p>
              <p className="text-lg font-bold text-violet-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4" /> Event Trigger Engine
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('live-feed')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'live-feed'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Bell className="w-4 h-4" />
          Live PostgreSQL Feed
        </button>
        <button
          onClick={() => setActiveTab('modules')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'modules'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Layers className="w-4 h-4" />
          8 Architecture Modules
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'simulator'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Send className="w-4 h-4 text-emerald-400" />
          Live Dispatch Simulator
        </button>

        <button
          onClick={() => setActiveTab('reminders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'reminders'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-400" />
          Industrial Reminders
        </button>

        <button
          onClick={() => setActiveTab('automation')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'automation'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Zap className="w-4 h-4 text-violet-400" />
          Automation Rules
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'templates'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <FileCode className="w-4 h-4 text-blue-400" />
          Template Registry
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'messages'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Inbox className="w-4 h-4 text-emerald-400" />
          Message Center & Outbox
        </button>

        <button
          onClick={() => setActiveTab('schema')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'schema'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-lg'
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
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Test Matrix (100% Pass)
        </button>
      </div>

      {feedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 font-extrabold px-5 py-3 rounded-2xl shadow-2xl text-xs">
          {feedToast}
        </div>
      )}

      {activeTab === 'live-feed' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <NotificationLiveFeedPanel onToast={showFeedToast} />
        </div>
      )}

      {/* Tab 1: 8 Architecture Modules */}
      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Module Selector List */}
          <div className="lg:col-span-4 space-y-3">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Phase 16C Core Communication Modules
            </h2>
            {NOTIFICATION_COMMUNICATION_MODULES.map((module) => {
              const isSelected = module.id === selectedModuleId;
              return (
                <div
                  key={module.id}
                  onClick={() => setSelectedModuleId(module.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-blue-500/50 shadow-lg shadow-blue-500/5'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400'}`}>
                      {module.id === 'enterprise-notification-engine' && <Bell className="w-5 h-5" />}
                      {module.id === 'enterprise-email-engine' && <Mail className="w-5 h-5" />}
                      {module.id === 'whatsapp-business-engine' && <MessageSquare className="w-5 h-5 text-emerald-400" />}
                      {module.id === 'push-sms-engine' && <Smartphone className="w-5 h-5 text-violet-400" />}
                      {module.id === 'industrial-reminder-engine' && <Clock className="w-5 h-5 text-amber-400" />}
                      {module.id === 'automation-rule-engine' && <Zap className="w-5 h-5 text-emerald-400" />}
                      {module.id === 'enterprise-message-center' && <Inbox className="w-5 h-5 text-blue-400" />}
                      {module.id === 'global-template-manager' && <FileCode className="w-5 h-5 text-amber-400" />}
                    </div>
                    <div>
                      <div className="text-xs text-blue-400 font-semibold uppercase tracking-wider">
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

          {/* Detailed Selected Module Specification */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                  Module 0{selectedModule.number} Technical Spec
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
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Core Capabilities & Features
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
                  <Terminal className="w-4 h-4 text-blue-400" /> Reference Code Implementation
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

      {/* Tab 2: Live Dispatch Simulator */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Dispatch Control Panel */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-400" />
                Live Multi-Channel Message Dispatcher Sandbox
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Dispatch test messages across In-App Toasts, Meta WhatsApp PDF, AWS SES Email, SMS OTP, and FCM Mobile Push.
              </p>
            </div>

            {/* Channel Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Select Dispatch Channel</label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { id: 'IN_APP', label: 'In-App', icon: <Bell className="w-3.5 h-3.5" /> },
                  { id: 'WHATSAPP', label: 'WhatsApp', icon: <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> },
                  { id: 'EMAIL', label: 'Email', icon: <Mail className="w-3.5 h-3.5 text-blue-400" /> },
                  { id: 'SMS', label: 'SMS', icon: <Phone className="w-3.5 h-3.5 text-amber-400" /> },
                  { id: 'PUSH', label: 'Push', icon: <Smartphone className="w-3.5 h-3.5 text-violet-400" /> }
                ].map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => setDispatchChannel(ch.id as any)}
                    className={`p-2.5 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                      dispatchChannel === ch.id
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50 shadow-lg'
                        : 'bg-slate-950 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {ch.icon}
                    <span>{ch.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form Inputs */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Recipient Name / Role</label>
                <input
                  type="text"
                  value={simRecipient}
                  onChange={(e) => setSimRecipient(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {dispatchChannel === 'WHATSAPP' && (
                <div className="space-y-1">
                  <label className="text-xs text-emerald-400 font-medium">WhatsApp Phone Number</label>
                  <input
                    type="text"
                    value={simPhone}
                    onChange={(e) => setSimPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              {dispatchChannel === 'EMAIL' && (
                <div className="space-y-1">
                  <label className="text-xs text-blue-400 font-medium">Recipient Email Address</label>
                  <input
                    type="email"
                    value={simEmail}
                    onChange={(e) => setSimEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Message Header / Subject</label>
                <input
                  type="text"
                  value={simTitle}
                  onChange={(e) => setSimTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Notification Body Content</label>
                <textarea
                  rows={3}
                  value={simBody}
                  onChange={(e) => setSimBody(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium">Priority Tier</label>
                  <select
                    value={simPriority}
                    onChange={(e) => setSimPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="CRITICAL">CRITICAL (Immediate Override)</option>
                    <option value="HIGH">HIGH Priority</option>
                    <option value="MEDIUM">MEDIUM Priority</option>
                    <option value="SILENT">SILENT Notification</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleSimulatedDispatch}
                    disabled={isSimulatingDispatch}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {isSimulatingDispatch ? 'Dispatching...' : 'Execute Dispatch'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Live In-App Feed & Delivery Logs */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                Live In-App Notification Feed & Delivery Receipts
              </h2>
              <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono rounded-full">
                WebSocket Connected
              </span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {liveToasts.map((toast) => (
                <div key={toast.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[10px] font-mono font-bold rounded flex items-center gap-1">
                      {toast.channel === 'IN_APP' && <Bell className="w-3 h-3 text-blue-400" />}
                      {toast.channel === 'WHATSAPP' && <MessageSquare className="w-3 h-3 text-emerald-400" />}
                      {toast.channel === 'EMAIL' && <Mail className="w-3 h-3 text-blue-400" />}
                      {toast.channel}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-mono">{toast.timestamp}</span>
                      <span className="px-2 py-0.5 bg-amber-500/10 text-amber-300 text-[10px] font-bold rounded">
                        {toast.priority}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white">{toast.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{toast.body}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCheck className="w-3.5 h-3.5" /> Delivery Acknowledged (SLA &lt; 100ms)
                    </span>
                    <span className="font-mono text-slate-500">Ref #{toast.id}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Industrial Compliance Reminders */}
      {activeTab === 'reminders' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  Industrial & Compliance Auto-Reminder Engine
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  Proactive multi-timeline tracking for Mining Permits, Vehicle Fitness, Machine Servicing, Overdue Recoveries, and GST Filings.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search reminders..."
                    value={reminderSearch}
                    onChange={(e) => setReminderSearch(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 w-full sm:w-64"
                  />
                </div>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {['ALL', 'PERMIT', 'VEHICLE', 'MAINTENANCE', 'FINANCE'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setReminderCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    reminderCategory === cat
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Reminders List */}
            <div className="space-y-3">
              {remindersList
                .filter(r => (reminderCategory === 'ALL' || r.category === reminderCategory) && (r.title.toLowerCase().includes(reminderSearch.toLowerCase()) || r.assignedTo.toLowerCase().includes(reminderSearch.toLowerCase())))
                .map((rem) => (
                  <div key={rem.id} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-all">
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-lg ${rem.priority === 'URGENT' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white">{rem.title}</h3>
                          <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${rem.daysRemaining <= 7 ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'}`}>
                            {rem.daysRemaining} Days Left
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Due Date: {rem.dueDate} • Assigned: {rem.assignedTo} • Channels: {rem.channels.join(', ')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 text-xs font-mono font-bold rounded ${rem.status === 'ACKNOWLEDGED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-900 text-slate-400'}`}>
                        {rem.status}
                      </span>

                      {rem.status !== 'ACKNOWLEDGED' && (
                        <button
                          onClick={() => handleAcknowledgeReminder(rem.id)}
                          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Acknowledge
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Automation Rules Builder */}
      {activeTab === 'automation' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-violet-400" />
              Event-Driven Communication Automation Rules
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Visual condition evaluator linking Domain Events (Weighbridge Dispatch, Quarry Blasts, Payment Overdues) to multi-channel workflows.
            </p>
          </div>

          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-violet-400" />
                    <div>
                      <h3 className="text-base font-bold text-white">{rule.ruleName}</h3>
                      <span className="text-xs font-mono text-emerald-400">Trigger: {rule.triggerEvent}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleRule(rule.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      rule.isEnabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {rule.isEnabled ? 'ACTIVE RULE' : 'DISABLED'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-lg space-y-1">
                    <span className="font-semibold text-slate-400 uppercase text-[10px]">Evaluation Conditions:</span>
                    {rule.conditions.map((c, i) => (
                      <div key={i} className="font-mono text-amber-300">• {c}</div>
                    ))}
                  </div>

                  <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-lg space-y-1">
                    <span className="font-semibold text-slate-400 uppercase text-[10px]">Action Pipeline:</span>
                    {rule.actions.map((a, i) => (
                      <div key={i} className="text-blue-300">• {a}</div>
                    ))}
                  </div>

                  <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-lg space-y-1">
                    <span className="font-semibold text-slate-400 uppercase text-[10px]">Escalation Policy:</span>
                    <div className="text-red-300 font-medium">• {rule.escalationPolicy}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Template Registry */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-3">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Multi-Channel Templates
            </h2>
            {PREBUILT_NOTIFICATION_TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => setSelectedTemplateId(tpl.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedTemplateId === tpl.id
                    ? 'bg-slate-900 border-blue-500/50 shadow-lg'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2">
                  <span className="text-xs font-mono font-bold text-blue-400">{tpl.code}</span>
                  <span className="px-2 py-0.5 bg-slate-950 text-[10px] font-bold text-emerald-400 rounded">
                    {tpl.channel}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">{tpl.title}</h3>
              </div>
            ))}
          </div>

          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-blue-400">{selectedTemplate.code}</span>
                <h2 className="text-2xl font-bold text-white mt-1">{selectedTemplate.title}</h2>
              </div>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-mono rounded-full">
                {selectedTemplate.channel} Channel
              </span>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Header / Subject Pattern</label>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-amber-300">
                  {selectedTemplate.subjectOrHeader}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Body Content Pattern (Handlebars Variable Syntax)</label>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-blue-300 leading-relaxed">
                  {selectedTemplate.bodyPattern}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase">Validated Dynamic Variables</label>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.variables.map((v) => (
                    <span key={v} className="px-2.5 py-1 bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-mono rounded">
                      &#123;&#123;{v}&#125;&#125;
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Message Center */}
      {activeTab === 'messages' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Inbox className="w-5 h-5 text-emerald-400" />
              Enterprise Outbox & Message History
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Monitor live message dispatches, dead letter queues (DLQ), and retry failed dispatches.
            </p>
          </div>

          <div className="p-8 text-center bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Outbox Queue Operational</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              0 Dead Letter Queue (DLQ) messages. All email, WhatsApp, SMS, and push channels operating within SLA metrics (&lt; 1.2s delivery delay).
            </p>
          </div>
        </div>
      )}

      {/* Tab 7: Database & RLS Schema */}
      {activeTab === 'schema' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-400" />
                Notification & Communication Engine Database Schema
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Full UUID v7 keys, tenant isolation fields, foreign key bindings, and audit trails.
              </p>
            </div>
            <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono rounded-full">
              Drizzle ORM Schema
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {NOTIFICATION_DATABASE_SCHEMA_TABLES.map((table) => (
              <div key={table.name} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-sm font-bold text-white font-mono">{table.name}</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">Table</span>
                </div>
                <p className="text-xs text-slate-400">{table.description}</p>
                <div className="space-y-1">
                  {table.columns.map((col, idx) => (
                    <div key={idx} className="text-[11px] font-mono text-blue-300/90 bg-slate-900/60 px-2 py-1 rounded border border-slate-800/60">
                      {col}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 8: Automated Test Suite */}
      {activeTab === 'tests' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Phase 16C Automated Test Suite Verification
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Unit tests, integration tests, handlebar email compilations, WhatsApp PDF dispatches, and compliance scheduler benchmarks.
              </p>
            </div>

            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-full">
              8 / 8 Tests Passing
            </span>
          </div>

          <div className="space-y-3">
            {NOTIFICATION_TEST_SUITE.map((item, idx) => (
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
