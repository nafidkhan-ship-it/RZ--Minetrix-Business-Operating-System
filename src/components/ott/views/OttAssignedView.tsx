import React, { useState } from 'react';
import {
  Inbox,
  UserCheck,
  Send,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Clock,
  MessageCircle,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import {
  OttTask,
  OttTaskStatus,
  CURRENT_USER,
  DEMO_OTT_USERS
} from '../../../data/rzOttData';
import { SectionId } from '../../../types/architecture';

interface OttAssignedViewProps {
  viewMode: 'INBOX' | 'ASSIGNED_TO_ME' | 'ASSIGNED_BY_ME';
  tasks: OttTask[];
  onSelectTask: (task: OttTask) => void;
  onStatusChange: (taskId: string, newStatus: OttTaskStatus) => void;
  onOpenChatWithAssignee: (userName: string) => void;
  onOpenSource: (sectionId: SectionId) => void;
  onAssignNewTask: () => void;
}

export const OttAssignedView: React.FC<OttAssignedViewProps> = ({
  viewMode,
  tasks,
  onSelectTask,
  onStatusChange,
  onOpenChatWithAssignee,
  onOpenSource,
  onAssignNewTask
}) => {
  const [askChangeTaskId, setAskChangeTaskId] = useState<string | null>(null);
  const [changeRequestText, setChangeRequestText] = useState('');

  // Filtering based on mode
  const displayedTasks = tasks.filter((t) => {
    if (viewMode === 'INBOX') {
      // Pending requests assigned to current user that need acceptance
      return t.assignee.id === CURRENT_USER.id && t.status === 'ASSIGNED';
    }
    if (viewMode === 'ASSIGNED_TO_ME') {
      return t.assignee.id === CURRENT_USER.id;
    }
    if (viewMode === 'ASSIGNED_BY_ME') {
      return t.createdBy.id === CURRENT_USER.id && t.assignee.id !== CURRENT_USER.id;
    }
    return true;
  });

  const handleSendChangeRequest = (taskId: string) => {
    if (!changeRequestText.trim()) return;
    alert(`Change request sent to task creator: "${changeRequestText}"`);
    setAskChangeTaskId(null);
    setChangeRequestText('');
  };

  const getHeaderInfo = () => {
    switch (viewMode) {
      case 'INBOX':
        return {
          title: 'Task Inbox & Inbound Requests',
          subtitle: 'Incoming assignments and cross-platform events requiring your review & acceptance',
          icon: Inbox,
          color: 'text-cyan-400'
        };
      case 'ASSIGNED_TO_ME':
        return {
          title: 'Assigned to Me',
          subtitle: 'Work orders and deliverables delegated to you across the RZ MINETRIX ecosystem',
          icon: UserCheck,
          color: 'text-amber-400'
        };
      case 'ASSIGNED_BY_ME':
        return {
          title: 'Assigned by Me',
          subtitle: 'Tasks and directives you have delegated to team members and operational staff',
          icon: Send,
          color: 'text-blue-400'
        };
    }
  };

  const info = getHeaderInfo();
  const HeaderIcon = info.icon;

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <HeaderIcon className={`w-5 h-5 ${info.color}`} />
          </div>
          <div>
            <h2 className="text-base font-black text-white">{info.title}</h2>
            <div className="text-[11px] text-slate-400">{info.subtitle}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {viewMode === 'ASSIGNED_BY_ME' && (
            <button
              onClick={onAssignNewTask}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Assign New Task</span>
            </button>
          )}
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-slate-950 text-slate-300 border border-slate-800">
            {displayedTasks.length} Task{displayedTasks.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Task Cards */}
      <div className="space-y-3">
        {displayedTasks.map((t) => (
          <div
            key={t.id}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition shadow-lg space-y-3 text-xs"
          >
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    t.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                    t.status === 'IN_PROGRESS' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                    t.status === 'ACCEPTED' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' :
                    'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {t.status.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {t.priority}
                  </span>
                  {t.source && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {t.source.sourceSystem}: {t.source.sourceRecordId}
                    </span>
                  )}
                </div>

                <h3
                  onClick={() => onSelectTask(t)}
                  className="font-black text-sm text-white hover:text-amber-300 cursor-pointer"
                >
                  {t.title}
                </h3>
                <p className="text-slate-400 text-xs line-clamp-2">
                  {t.description}
                </p>
              </div>

              {/* Counterparty avatar badge */}
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                <img
                  src={viewMode === 'ASSIGNED_BY_ME' ? t.assignee.avatar : t.createdBy.avatar}
                  alt="avatar"
                  className="w-7 h-7 rounded-full object-cover border border-amber-500/30"
                />
                <div className="text-left">
                  <span className="text-[9px] text-slate-500 uppercase block">
                    {viewMode === 'ASSIGNED_BY_ME' ? 'Assigned To:' : 'Assigned By:'}
                  </span>
                  <strong className="text-white text-xs block">
                    {viewMode === 'ASSIGNED_BY_ME' ? t.assignee.name : t.createdBy.name}
                  </strong>
                </div>
              </div>
            </div>

            {/* Change Request inline box */}
            {askChangeTaskId === t.id && (
              <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/40 space-y-2 animate-fadeIn">
                <span className="text-[11px] font-bold text-amber-400">
                  Request Change or Clarification from Creator:
                </span>
                <input
                  type="text"
                  autoFocus
                  value={changeRequestText}
                  onChange={(e) => setChangeRequestText(e.target.value)}
                  placeholder="Explain why the deadline or scope needs adjusting..."
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs focus:outline-none"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setAskChangeTaskId(null)}
                    className="px-2 py-1 text-slate-400 hover:text-white text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSendChangeRequest(t.id)}
                    className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
                  >
                    Submit Request
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Due: {t.dueDate} at {t.dueTime}</span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {/* Accept & Decline for Inbox */}
                {t.status === 'ASSIGNED' && (
                  <>
                    <button
                      onClick={() => onStatusChange(t.id, 'ACCEPTED')}
                      className="px-3 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold flex items-center gap-1 transition cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Accept
                    </button>
                    <button
                      onClick={() => onStatusChange(t.id, 'BLOCKED')}
                      className="px-2.5 py-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold flex items-center gap-1 transition cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Decline
                    </button>
                    <button
                      onClick={() => setAskChangeTaskId(t.id)}
                      className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center gap-1 transition cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> Ask for Change
                    </button>
                  </>
                )}

                {/* Start / Complete */}
                {t.status !== 'COMPLETED' && t.status !== 'IN_PROGRESS' && t.status !== 'ASSIGNED' && (
                  <button
                    onClick={() => onStatusChange(t.id, 'IN_PROGRESS')}
                    className="px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" /> Start Work
                  </button>
                )}

                {t.status !== 'COMPLETED' && (
                  <button
                    onClick={() => onStatusChange(t.id, 'COMPLETED')}
                    className="px-3 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-md shadow-emerald-500/20 flex items-center gap-1 transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                  </button>
                )}

                {/* Chat */}
                <button
                  onClick={() => onOpenChatWithAssignee(viewMode === 'ASSIGNED_BY_ME' ? t.assignee.name : t.createdBy.name)}
                  className="px-2.5 py-1 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Chat
                </button>

                {/* Details */}
                <button
                  onClick={() => onSelectTask(t)}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <span>Details</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {displayedTasks.length === 0 && (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
            <h3 className="font-bold text-white text-sm">No items in this queue</h3>
            <p className="text-slate-400 text-xs">All tasks are processed or no delegations match this view.</p>
          </div>
        )}
      </div>
    </div>
  );
};
