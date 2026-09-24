import React, { useState, useEffect } from 'react';
import {
  Zap,
  Bell,
  Clock,
  Send,
  Play,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Settings,
  ShieldCheck,
  Smartphone,
  Mail,
  MessageSquare,
  PhoneCall,
  Volume2,
  Plus,
  RefreshCw,
  Terminal,
  Activity,
  Calendar,
  Eye
} from 'lucide-react';
import { automationService } from '../services/automationService';
import {
  BosEventType,
  BosActionType,
  ReminderChannel,
  AutomationRule,
  AutomationExecutionLog,
  ReminderConfig
} from '../types/automation';

export const AutomationEngineSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rules' | 'event-bus' | 'reminders' | 'execution-logs'>('rules');
  const [rules, setRules] = useState<AutomationRule[]>(automationService.getRules());
  const [logs, setLogs] = useState<AutomationExecutionLog[]>(automationService.getExecutionLogs());
  const [reminders, setReminders] = useState<ReminderConfig[]>(automationService.getReminders());

  // Simulation State
  const [selectedEventType, setSelectedEventType] = useState<BosEventType>('STOCK_LOW');
  const [simPayload, setSimPayload] = useState<string>('Laterite Stone inventory dropped below 15% safety buffer at Kasaragod Quarry');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsub = automationService.subscribe(() => {
      setRules(automationService.getRules());
      setLogs(automationService.getExecutionLogs());
      setReminders(automationService.getReminders());
    });
    return () => unsub();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSimulateEvent = () => {
    const executed = automationService.simulateTriggerEvent(selectedEventType, simPayload);
    if (executed) {
      showToast(`⚡ Event ${selectedEventType} triggered rule: "${executed.ruleName}" (${executed.durationMs}ms)`);
      setActiveTab('execution-logs');
    } else {
      showToast(`ℹ️ Event ${selectedEventType} emitted. No active rule matched conditions.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/20 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider">
                  SHARED ERP CORE &bull; AUTOMATION & REMINDERS
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  22 BOS EVENTS READY
                </span>
              </div>
              <h1 className="text-2xl font-black text-white mt-0.5">
                Centralized Automation & Reminder Engine
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Event-driven choreography connecting Quarry, Crusher, Vehicle Fleet, Contracts, Marketplace Orders, RZ® Chating and RZ® OTT with low-latency event processing, multi-channel reminders, quiet-hours and rate limiting.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveTab('event-bus')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Simulate BOS Event</span>
            </button>
            <button
              onClick={() => showToast('New Automation Rule template ready')}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Rule</span>
            </button>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80 text-xs">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="text-slate-400 text-[11px]">Active Rules Configured</div>
            <div className="text-lg font-black text-white font-mono mt-0.5">{rules.filter((r) => r.enabled).length} / {rules.length}</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Deterministic Triggers</div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="text-slate-400 text-[11px]">Total Events Handled</div>
            <div className="text-lg font-black text-amber-400 font-mono mt-0.5">
              {rules.reduce((acc, r) => acc + r.executionCount, 0)} Dispatches
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Avg latency: ~34ms</div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="text-slate-400 text-[11px]">Scheduled Reminders</div>
            <div className="text-lg font-black text-cyan-400 font-mono mt-0.5">{reminders.length} Active</div>
            <div className="text-[10px] text-slate-400 mt-0.5">WhatsApp / Voice / Alarm</div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="text-slate-400 text-[11px]">Quiet Hours Protection</div>
            <div className="text-lg font-black text-purple-400 font-mono mt-0.5">22:00 - 06:00</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Anti-Spam Active</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-1 text-xs overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition cursor-pointer border ${
            activeTab === 'rules'
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
              : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Automation Rules ({rules.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('event-bus')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition cursor-pointer border ${
            activeTab === 'event-bus'
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
              : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Play className="w-3.5 h-3.5" />
          <span>Live Event Bus Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab('reminders')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition cursor-pointer border ${
            activeTab === 'reminders'
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
              : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Multi-Channel Reminders ({reminders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('execution-logs')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition cursor-pointer border ${
            activeTab === 'execution-logs'
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
              : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Execution Logs ({logs.length})</span>
        </button>
      </div>

      {/* 1. RULES TAB */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg transition hover:border-slate-700"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-bold">
                        {rule.eventType}
                      </span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {rule.sourceModule}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Executions: {rule.executionCount}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white mt-1.5">{rule.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{rule.description}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rule.enabled}
                        onChange={() => automationService.toggleRule(rule.id)}
                        className="rounded text-amber-500 focus:ring-amber-500 bg-slate-950 border-slate-700"
                      />
                      <span>{rule.enabled ? 'Enabled' : 'Disabled'}</span>
                    </label>
                  </div>
                </div>

                {/* Actions Dispatched */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-500 text-[11px]">Dispatches:</span>
                  {rule.actions.map((act, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5 text-[11px]"
                    >
                      <Zap className="w-3 h-3 text-amber-400" />
                      <strong>{act.actionType}</strong>
                      {act.channel && <span className="text-slate-400 font-mono">({act.channel})</span>}
                      <span className="text-slate-500">&rarr; {act.targetRecipient}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. EVENT BUS SIMULATOR */}
      {activeTab === 'event-bus' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span>RZ® Minetrix BOS Core Event Emitter</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Select one of the 22 standardized system events to simulate real-time ingestion, rule evaluation, and action choreography.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select Event Type</label>
              <select
                value={selectedEventType}
                onChange={(e: any) => setSelectedEventType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-500"
              >
                <option value="STOCK_LOW">STOCK_LOW (Quarry / Crusher Stockpile Buffer)</option>
                <option value="VEHICLE_SERVICE_DUE">VEHICLE_SERVICE_DUE (Fleet Telemetry KMs)</option>
                <option value="ORDER_CREATED">ORDER_CREATED (Public Building Materials Order)</option>
                <option value="ORDER_DISPATCHED">ORDER_DISPATCHED (Weighbridge Exit)</option>
                <option value="TASK_NEAR_DUE">TASK_NEAR_DUE (RZ® OTT 2-Hour Alert)</option>
                <option value="TASK_OVERDUE">TASK_OVERDUE (Escalation to Management)</option>
                <option value="APPROVAL_REQUIRED">APPROVAL_REQUIRED (Multi-Level Workflow Sign-off)</option>
                <option value="DOCUMENT_EXPIRING">DOCUMENT_EXPIRING (Mining Lease / PCB Consent)</option>
                <option value="INSURANCE_EXPIRING">INSURANCE_EXPIRING (Tipper Commercial Policy)</option>
                <option value="PAYMENT_DUE">PAYMENT_DUE (Customer Invoice Aging &gt; 30 Days)</option>
                <option value="PAYMENT_RECEIVED">PAYMENT_RECEIVED (Auto Accounts Ledger Entry)</option>
                <option value="APPLICATION_RECEIVED">APPLICATION_RECEIVED (Public Job Candidate Apply)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Event Payload Summary</label>
              <input
                type="text"
                value={simPayload}
                onChange={(e) => setSimPayload(e.target.value)}
                placeholder="Details of the event trigger"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSimulateEvent}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition cursor-pointer flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Emit Event to BOS Event Bus</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. MULTI-CHANNEL REMINDERS */}
      {activeTab === 'reminders' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {reminders.map((rem) => (
              <div
                key={rem.id}
                className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-mono text-cyan-400 font-bold">{rem.entityType}</span>
                    <span className="font-mono text-slate-500">{rem.entityId}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1.5">{rem.title}</h4>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Due: {new Date(rem.dueDateTime).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase font-mono mb-1">Active Channels</div>
                  <div className="flex flex-wrap gap-1">
                    {rem.channels.map((ch) => (
                      <span
                        key={ch}
                        className="px-2 py-0.5 rounded font-mono text-[10px] bg-slate-950 text-amber-300 border border-slate-800"
                      >
                        {ch}
                      </span>
                    ))}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2 flex items-center justify-between">
                    <span>Quiet Hours: {rem.quietHoursStart}-{rem.quietHoursEnd}</span>
                    <button
                      onClick={() => automationService.dismissReminder(rem.id)}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. EXECUTION LOGS */}
      {activeTab === 'execution-logs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Triggered At</th>
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4">Rule Matched</th>
                  <th className="py-3 px-4">Dispatched Actions</th>
                  <th className="py-3 px-4">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(log.triggeredAt).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-4 text-amber-400 font-bold">{log.eventType}</td>
                    <td className="py-3 px-4 text-white">{log.ruleName}</td>
                    <td className="py-3 px-4">
                      {log.actionsDispatched.map((a, i) => (
                        <div key={i} className="text-[11px] text-slate-300">
                          &bull; {a.actionType} {a.channel ? `(${a.channel})` : ''} &rarr; {a.recipient}
                        </div>
                      ))}
                    </td>
                    <td className="py-3 px-4 text-emerald-400">{log.durationMs}ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
