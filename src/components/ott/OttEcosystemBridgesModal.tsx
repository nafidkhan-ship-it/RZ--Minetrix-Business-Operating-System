import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  Sparkles,
  Table,
  GitFork,
  CheckCircle2,
  ArrowRight,
  Send,
  Link2,
  Clock,
  ShieldCheck,
  Zap,
  RefreshCw,
  FileCheck
} from 'lucide-react';
import { UserRef, WorkspaceContext } from '../../types/ottTypes';

interface OttEcosystemBridgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreatedFromBridge: (task: any) => void;
  contacts: UserRef[];
}

export const OttEcosystemBridgesModal: React.FC<OttEcosystemBridgesModalProps> = ({
  isOpen,
  onClose,
  onTaskCreatedFromBridge,
  contacts
}) => {
  const [activeBridge, setActiveBridge] = useState<'CHAT' | 'GRID' | 'WORKFLOW'>('CHAT');

  // Simulation State: RZ Chat
  const [chatMessage, setChatMessage] = useState('Please complete the quarry environmental compliance report file today.');
  const [chatTaskCreated, setChatTaskCreated] = useState(false);
  const [chatTaskStatus, setChatTaskStatus] = useState<'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED'>('PENDING');

  // Simulation State: RZ Grid
  const [gridRowId, setGridRowId] = useState('ROW-WB-9042');
  const [gridStatus, setGridStatus] = useState<'ANOMALY_FLAGGED' | 'OTT_TASK_DISPATCHED' | 'VERIFIED'>('ANOMALY_FLAGGED');

  // Simulation State: RZ Workflow
  const [workflowInvoiceId, setWorkflowInvoiceId] = useState('INV-2026-8819');
  const [workflowStep, setWorkflowStep] = useState<'APPROVAL_PENDING' | 'DISPATCHED_TO_OTT' | 'APPROVED'>('APPROVAL_PENDING');

  if (!isOpen) return null;

  const handleCreateTaskFromChat = () => {
    const newTask = {
      title: chatMessage,
      description: 'Dispatched directly from RZ® Chat message thread between Quarry Owner and Site Manager.',
      workspace: 'RZ_MINETRIX' as WorkspaceContext,
      priority: 'HIGH',
      startDate: new Date().toISOString().split('T')[0],
      startTime: '10:00',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '17:00',
      estimatedMinutes: 60,
      assignedToId: contacts[1]?.id || 'USR-1002',
      recurrence: 'NONE',
      checklist: [
        'Collect lab water samples',
        'Verify dust suppression logs',
        'Upload sealed stamp scan'
      ]
    };

    onTaskCreatedFromBridge(newTask);
    setChatTaskCreated(true);
    setChatTaskStatus('ACCEPTED');
  };

  const handleDispatchGridTask = () => {
    const newTask = {
      title: `Verify Weighbridge Tare Discrepancy (${gridRowId})`,
      description: 'Triggered by RZ® Grid automated discrepancy rule: Tare weight exceeded +350kg tolerance on Tipper KL-11-AV-9912.',
      workspace: 'RZ_MINETRIX' as WorkspaceContext,
      priority: 'URGENT',
      startDate: new Date().toISOString().split('T')[0],
      startTime: '11:00',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '13:00',
      estimatedMinutes: 30,
      assignedToId: contacts[2]?.id || 'USR-1003',
      recurrence: 'NONE',
      checklist: [
        'Inspect weighbridge load sensors',
        'Recalibrate zero-point in RZ Grid',
        'Authorize re-weigh'
      ]
    };

    onTaskCreatedFromBridge(newTask);
    setGridStatus('OTT_TASK_DISPATCHED');
  };

  const handleDispatchWorkflowTask = () => {
    const newTask = {
      title: `Review & Authorize Diesel Vendor PO (${workflowInvoiceId})`,
      description: 'Dispatched by RZ® Workflow Multi-Tier Approval Engine for fuel purchase order exceeding $5,000 threshold.',
      workspace: 'RZ_MINETRIX' as WorkspaceContext,
      priority: 'HIGH',
      startDate: new Date().toISOString().split('T')[0],
      startTime: '14:00',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '18:00',
      estimatedMinutes: 20,
      assignedToId: contacts[0]?.id || 'USR-1001',
      recurrence: 'NONE',
      checklist: [
        'Verify delivery receipt & dipstick reading',
        'Confirm purchase contract price',
        'Submit digital approval signature'
      ]
    };

    onTaskCreatedFromBridge(newTask);
    setWorkflowStep('DISPATCHED_TO_OTT');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                RZ® Shared Backbone & Ecosystem Bridges
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                  Live Simulators
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Bidirectional cross-platform integrations between OTT, RZ® Chat, RZ® Grid & RZ® Workflow
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Integration Selector Tabs */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950 px-6 gap-2">
          <button
            onClick={() => setActiveBridge('CHAT')}
            className={`px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
              activeBridge === 'CHAT'
                ? 'border-amber-400 text-amber-300 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            1. RZ® Chat &rarr; OTT Task
          </button>
          <button
            onClick={() => setActiveBridge('GRID')}
            className={`px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
              activeBridge === 'GRID'
                ? 'border-cyan-400 text-cyan-300 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Table className="w-4 h-4" />
            2. RZ® Grid &rarr; OTT Action
          </button>
          <button
            onClick={() => setActiveBridge('WORKFLOW')}
            className={`px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
              activeBridge === 'WORKFLOW'
                ? 'border-purple-400 text-purple-300 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitFork className="w-4 h-4" />
            3. RZ® Workflow &rarr; OTT Task
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">

          {/* SIMULATOR 1: RZ CHAT BRIDGE */}
          {activeBridge === 'CHAT' && (
            <div className="space-y-5">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  RZ® Chat Message &rarr; One-Click OTT Task Bridge
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  When a manager or owner sends an instruction inside an RZ® Chat room (e.g. Quarry Operations or Transport Fleet chat), any team member can convert that message into an active OTT task in one click. OTT then tracks the lifecycle, sends reminders, and streams progress updates back to the chat thread.
                </p>
              </div>

              {/* Chat Thread Simulation UI */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
                  <span>Chat Room: #quarry-operations-daily</span>
                  <span>Participants: Tariq (Owner), Rahul (Manager)</span>
                </div>

                {/* Owner message bubble */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0">
                    TO
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-sm p-3.5 max-w-md space-y-2 shadow-md">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold text-white">Tariq Al-Mansoor (Quarry Owner)</span>
                      <span>10:02 AM</span>
                    </div>
                    <p className="text-xs text-slate-200">{chatMessage}</p>

                    {/* CREATE OTT TASK CTA BUTTON */}
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      {!chatTaskCreated ? (
                        <button
                          onClick={handleCreateTaskFromChat}
                          className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          CREATE OTT TASK
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>OTT Task Created &bull; Status: {chatTaskStatus}</span>
                        </div>
                      )}
                      <span className="text-[10px] text-slate-500 font-mono">source: rz_chat_v2</span>
                    </div>
                  </div>
                </div>

                {/* Status Synchronization Card */}
                {chatTaskCreated && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2 text-emerald-300">
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1.5">
                        <Link2 className="w-3.5 h-3.5" />
                        Synchronized With Rahul&apos;s OTT &ldquo;My Day&rdquo;
                      </span>
                      <button
                        onClick={() => {
                          const nextStatus = chatTaskStatus === 'ACCEPTED' ? 'IN_PROGRESS' : chatTaskStatus === 'IN_PROGRESS' ? 'COMPLETED' : 'ACCEPTED';
                          setChatTaskStatus(nextStatus);
                        }}
                        className="px-2 py-0.5 bg-emerald-500/20 hover:bg-emerald-500/30 rounded text-[10px] font-bold transition"
                      >
                        Simulate Staff Status Advance &rarr; {chatTaskStatus}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      When Rahul changes status or checks off milestones in OTT, the status in RZ Chat updates automatically in real-time via WebSocket pub/sub.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SIMULATOR 2: RZ GRID BRIDGE */}
          {activeBridge === 'GRID' && (
            <div className="space-y-5">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Table className="w-4 h-4 text-cyan-400" />
                  RZ® Grid Structured Data &rarr; OTT Action Dispatches
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  RZ® Grid is the high-density structured data-entry backbone of RZ® Minetrix BOS. When tabular entries trigger business anomalies (e.g. weighbridge tare variances, crusher breakdown logs, fuel dipstick deviations), RZ Grid dispatches an action item straight to the operator&apos;s OTT day schedule.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
                  <span>Grid Dataset: RZ_WEIGHBRIDGE_DISPATCH_LEDGER</span>
                  <span>Status: Validation Rule Exception</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-[11px]">
                    <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="p-2">Row ID</th>
                        <th className="p-2">Vehicle #</th>
                        <th className="p-2">Product</th>
                        <th className="p-2">Tare Diff</th>
                        <th className="p-2">Anomaly Flag</th>
                        <th className="p-2">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      <tr className="bg-cyan-500/5">
                        <td className="p-2 text-cyan-300 font-bold">{gridRowId}</td>
                        <td className="p-2 text-white">KL-11-AV-9912</td>
                        <td className="p-2 text-slate-300">20mm Aggregates</td>
                        <td className="p-2 text-red-400 font-bold">+380 kg</td>
                        <td className="p-2">
                          <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 text-[10px]">
                            OUT_OF_BOUNDS
                          </span>
                        </td>
                        <td className="p-2">
                          {gridStatus === 'ANOMALY_FLAGGED' ? (
                            <button
                              onClick={handleDispatchGridTask}
                              className="px-2.5 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[10px] rounded flex items-center gap-1 transition"
                            >
                              <Zap className="w-3 h-3" />
                              Dispatch OTT Task
                            </button>
                          ) : (
                            <span className="text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> OTT Task Active
                            </span>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {gridStatus === 'OTT_TASK_DISPATCHED' && (
                  <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-300 space-y-1">
                    <span className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Assigned to Quarry Weighbridge Master
                    </span>
                    <p className="text-[11px] text-slate-300">
                      Task dispatched with idempotency key: <code>grid_tare_wb9042_chk</code>. Once resolved and verified, RZ Grid automatically unlocks the vehicle&apos;s electronic gate pass.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SIMULATOR 3: RZ WORKFLOW BRIDGE */}
          {activeBridge === 'WORKFLOW' && (
            <div className="space-y-5">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <GitFork className="w-4 h-4 text-purple-400" />
                  RZ® Workflow Multi-Step Approvals &rarr; OTT Task Loop
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  RZ® Workflow manages multi-tier organizational processes (purchase requisitions, equipment lease approvals, contractor payment releases). Rather than getting lost in email inboxes, required sign-offs populate as urgent, time-blocked action cards on executives&apos; OTT daily plans.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
                  <span>Workflow Definition: WF_PROCUREMENT_DIESEL_PO</span>
                  <span>Invoice: {workflowInvoiceId}</span>
                </div>

                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">Fuel Requisition #8819 — 12,000 Litres Bulk HSD</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">Vendor: Bharat Petroleum &bull; Amount: $14,280 USD</div>
                  </div>
                  {workflowStep === 'APPROVAL_PENDING' ? (
                    <button
                      onClick={handleDispatchWorkflowTask}
                      className="px-3 py-1.5 bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
                    >
                      <GitFork className="w-3.5 h-3.5" />
                      Route Approval to OTT
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 text-purple-300 font-semibold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      <span>Pending Managing Director Sign-off in OTT</span>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <span className="font-bold text-slate-300">Auditable Workflow State Machine:</span>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500 pt-1">
                    <span className="text-emerald-400">1. Requisition Generated</span> &rarr;
                    <span className="text-amber-400">2. OTT Task Dispatched</span> &rarr;
                    <span>3. Executive Review</span> &rarr;
                    <span>4. ERP Payment Released</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/60">
          <div className="text-[11px] text-slate-400">
            Powered by RZ® Shared Backbone Pub/Sub &amp; Common Identity Platform
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl transition"
          >
            Close Bridge Console
          </button>
        </div>

      </div>
    </div>
  );
};
