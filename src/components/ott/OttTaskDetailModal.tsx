import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Paperclip,
  CheckCircle2,
  AlertTriangle,
  Play,
  Check,
  Pause,
  RotateCcw,
  MessageSquare,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  Plus,
  Trash2,
  Share2,
  FileText,
  Shield,
  Layers,
  Sparkles,
  Link2,
  Tag,
  AlertCircle
} from 'lucide-react';
import {
  OttTask,
  OttTaskStatus,
  OttSubtask,
  OttComment,
  CURRENT_USER,
  DEMO_OTT_USERS
} from '../../data/rzOttData';
import { SectionId } from '../../types/architecture';

interface OttTaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: OttTask | null;
  onStatusChange: (taskId: string, newStatus: OttTaskStatus) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onAddSubtask: (taskId: string, title: string) => void;
  onAddComment: (taskId: string, text: string) => void;
  onOpenSource?: (sectionId: SectionId) => void;
  onOpenChatWithAssignee?: (userName: string) => void;
  onOpenSnooze?: (task: OttTask) => void;
}

export const OttTaskDetailModal: React.FC<OttTaskDetailModalProps> = ({
  isOpen,
  onClose,
  task,
  onStatusChange,
  onToggleSubtask,
  onAddSubtask,
  onAddComment,
  onOpenSource,
  onOpenChatWithAssignee,
  onOpenSnooze
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'subtasks' | 'comments' | 'attachments' | 'activity'>('overview');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  if (!isOpen || !task) return null;

  const completedSubtasksCount = task.subtasks.filter(s => s.completed).length;
  const totalSubtasks = task.subtasks.length;
  const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasksCount / totalSubtasks) * 100) : 0;

  const handleCreateSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    onAddSubtask(task.id, newSubtaskTitle.trim());
    setNewSubtaskTitle('');
    setIsAddingSubtask(false);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    onAddComment(task.id, newCommentText.trim());
    setNewCommentText('');
  };

  const getStatusBadge = (status: OttTaskStatus) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'IN_PROGRESS':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'STARTED':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'ACCEPTED':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'OVERDUE':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse';
      case 'SNOOZED':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'BLOCKED':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'MEDIUM':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-start justify-between bg-slate-950/60 gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getStatusBadge(task.status)}`}>
                {task.status.replace('_', ' ')}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getPriorityBadge(task.priority)}`}>
                {task.priority} PRIORITY
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {task.category}
              </span>
              {task.source && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  {task.source.sourceSystem}
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-black text-white leading-snug">
              {task.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Lifecycle Action Bar */}
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/40 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono text-slate-400 mr-1">Lifecycle Action:</span>
            {task.status !== 'COMPLETED' ? (
              <>
                {task.status === 'ASSIGNED' && (
                  <button
                    onClick={() => onStatusChange(task.id, 'ACCEPTED')}
                    className="px-3 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" /> Accept
                  </button>
                )}
                {task.status !== 'IN_PROGRESS' && (
                  <button
                    onClick={() => onStatusChange(task.id, 'IN_PROGRESS')}
                    className="px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" /> Start / In Progress
                  </button>
                )}
                <button
                  onClick={() => onStatusChange(task.id, 'COMPLETED')}
                  className="px-3 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-md shadow-emerald-500/20 flex items-center gap-1 transition cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
                </button>
                <button
                  onClick={() => onOpenSnooze && onOpenSnooze(task)}
                  className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5" /> Snooze
                </button>
              </>
            ) : (
              <button
                onClick={() => onStatusChange(task.id, 'IN_PROGRESS')}
                className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold flex items-center gap-1 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Re-open Task
              </button>
            )}
          </div>

          {/* Open RZ Chat with Assigned Person */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenChatWithAssignee && onOpenChatWithAssignee(task.assignee.name)}
              className="px-3 py-1 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-purple-400" />
              <span>Chat with {task.assignee.name.split(' ')[0]}</span>
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="px-5 border-b border-slate-800 flex items-center gap-4 text-xs font-bold overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'subtasks', label: `Subtasks (${task.subtasks.length})` },
            { id: 'comments', label: `Comments (${task.comments.length})` },
            { id: 'attachments', label: `Attachments (${task.attachments.length})` },
            { id: 'activity', label: 'Activity Log' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`py-3 border-b-2 transition whitespace-nowrap cursor-pointer ${
                activeTab === t.id
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="p-5 overflow-y-auto flex-1 text-xs space-y-4">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Description */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Description
                </span>
                <p className="text-slate-200 leading-relaxed whitespace-pre-line">
                  {task.description || 'No description provided.'}
                </p>
                {task.location && (
                  <div className="mt-3 pt-2 border-t border-slate-800/80 text-slate-400 flex items-center gap-1.5">
                    <span className="text-slate-500 font-semibold">Location:</span>
                    <strong className="text-white">{task.location}</strong>
                  </div>
                )}
              </div>

              {/* People Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Assigned To
                  </span>
                  <div className="flex items-center gap-2.5">
                    <img
                      src={task.assignee.avatar}
                      alt={task.assignee.name}
                      className="w-8 h-8 rounded-full object-cover border border-amber-500/40"
                    />
                    <div>
                      <div className="font-black text-white">{task.assignee.name}</div>
                      <div className="text-[10px] text-amber-400">{task.assignee.role}</div>
                      <div className="text-[10px] text-slate-500">{task.assignee.phone}</div>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Created By
                  </span>
                  <div className="flex items-center gap-2.5">
                    <img
                      src={task.createdBy.avatar}
                      alt={task.createdBy.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <div className="font-black text-white">{task.createdBy.name}</div>
                      <div className="text-[10px] text-slate-400">{task.createdBy.role}</div>
                      <div className="text-[10px] text-slate-500">Created: {new Date(task.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deadlines & Reminders */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500 block">Due Date</span>
                  <strong className="text-white font-mono mt-0.5 block">{task.dueDate}</strong>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500 block">Due Time</span>
                  <strong className="text-amber-400 font-mono mt-0.5 block">{task.dueTime}</strong>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500 block">Reminder</span>
                  <strong className="text-slate-300 mt-0.5 block">{task.reminderRule}</strong>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500 block">Repeat</span>
                  <strong className="text-slate-300 mt-0.5 block">{task.repeatRule}</strong>
                </div>
              </div>

              {/* Source System Traceability Banner */}
              {task.source ? (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/30 to-slate-950 border border-purple-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                      CROSS-PLATFORM ORIGIN
                    </span>
                    {onOpenSource && (
                      <button
                        onClick={() => onOpenSource(task.source!.targetSectionId)}
                        className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Open Source ({task.source.sourceSystem})</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                    <div>
                      <span className="text-slate-500 text-[10px] block">source_system:</span>
                      <strong className="text-white">{task.source.sourceSystem}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">source_module:</span>
                      <strong className="text-slate-300">{task.source.sourceModule}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">source_record_id:</span>
                      <strong className="text-amber-400">{task.source.sourceRecordId}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">source_event:</span>
                      <strong className="text-slate-300">{task.source.sourceEvent}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">source_task_id:</span>
                      <strong className="text-cyan-400">{task.source.sourceTaskId || task.id}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">external_reference:</span>
                      <strong className="text-slate-400">{task.source.externalReference || 'EXT-REF-AUTO'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">idempotency_key:</span>
                      <strong className="text-purple-300">{task.source.idempotencyKey || `IDEM-${task.id}-001`}</strong>
                    </div>
                    {task.source.chatMessageId && (
                      <div>
                        <span className="text-slate-500 text-[10px] block">chat_message_id:</span>
                        <strong className="text-cyan-400">{task.source.chatMessageId}</strong>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-500 text-[11px] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-slate-600" />
                  <span>Native RZ® OTT Task (No external platform link)</span>
                </div>
              )}

              {/* Subtasks Summary Bar */}
              {task.subtasks.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">
                      Subtask Completion Progress ({completedSubtasksCount} / {totalSubtasks})
                    </span>
                    <span className="font-mono font-bold text-amber-400">{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SUBTASKS */}
          {activeTab === 'subtasks' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">
                  Checklist &amp; Steps ({completedSubtasksCount}/{totalSubtasks})
                </span>
                <button
                  onClick={() => setIsAddingSubtask(true)}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Subtask
                </button>
              </div>

              {isAddingSubtask && (
                <form onSubmit={handleCreateSubtask} className="p-3 rounded-2xl bg-slate-950 border border-amber-500/40 flex items-center gap-2">
                  <input
                    type="text"
                    autoFocus
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    placeholder="Enter subtask step title..."
                    className="flex-1 bg-transparent text-white text-xs focus:outline-none placeholder-slate-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingSubtask(false)}
                    className="px-2 py-1 text-slate-400 hover:text-white text-xs"
                  >
                    Cancel
                  </button>
                </form>
              )}

              <div className="space-y-2">
                {task.subtasks.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => onToggleSubtask(task.id, st.id)}
                    className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition ${
                      st.completed
                        ? 'bg-slate-950/40 border-slate-800/60 text-slate-400'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-white'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() => {}}
                      className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                    />
                    <span className={`text-xs font-medium flex-1 ${st.completed ? 'line-through' : ''}`}>
                      {st.title}
                    </span>
                  </div>
                ))}
                {task.subtasks.length === 0 && (
                  <div className="p-6 text-center text-slate-500">
                    No subtasks created yet. Click &quot;Add Subtask&quot; to break this task down.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: COMMENTS */}
          {activeTab === 'comments' && (
            <div className="space-y-4">
              <div className="space-y-3">
                {task.comments.map((cm) => (
                  <div key={cm.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={cm.userAvatar} alt={cm.userName} className="w-6 h-6 rounded-full object-cover" />
                        <span className="font-bold text-white text-xs">{cm.userName}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{cm.timestamp}</span>
                    </div>
                    <p className="text-slate-300 text-xs pl-8">{cm.text}</p>
                  </div>
                ))}
                {task.comments.length === 0 && (
                  <div className="p-6 text-center text-slate-500">
                    No comments yet. Post an operational note or status update below.
                  </div>
                )}
              </div>

              {/* Comment composer */}
              <form onSubmit={handlePostComment} className="pt-2 border-t border-slate-800 space-y-2">
                <textarea
                  rows={2}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Add a comment, tag staff, or log updates..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none resize-none"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenChatWithAssignee && onOpenChatWithAssignee(task.assignee.name)}
                      className="text-[11px] text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> Open RZ Chat for Rich Discussion
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition cursor-pointer"
                  >
                    Post Comment
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: ATTACHMENTS */}
          {activeTab === 'attachments' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">
                  Attached Documents &amp; Files ({task.attachments.length})
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {task.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-white truncate text-xs">{att.name}</div>
                        <div className="text-[10px] text-slate-500">{att.size} &bull; {att.uploadedAt}</div>
                      </div>
                    </div>

                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); alert(`Previewing ${att.name}`); }}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 text-[11px] font-bold border border-slate-800 shrink-0"
                    >
                      View
                    </a>
                  </div>
                ))}
                {task.attachments.length === 0 && (
                  <div className="col-span-2 p-6 text-center text-slate-500">
                    No attachments attached to this task.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: ACTIVITY LOG */}
          {activeTab === 'activity' && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Audit Trail &amp; Execution Timeline
              </span>
              <div className="space-y-2">
                {task.activityLog.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-white">{log.action}</span>
                      <span className="text-slate-500 text-[11px]">&bull; {log.actor}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
