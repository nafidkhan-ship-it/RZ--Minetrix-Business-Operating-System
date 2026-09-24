import React, { useState } from 'react';
import {
  Sun,
  Filter,
  CheckCircle2,
  Clock,
  Play,
  Check,
  RotateCcw,
  Sparkles,
  Link2,
  Paperclip,
  Plus,
  MessageCircle,
  ExternalLink,
  Tag,
  AlertTriangle,
  ChevronRight,
  ListTodo,
  Calendar,
  Layers
} from 'lucide-react';
import {
  OttTask,
  OttCategory,
  OttTaskPriority,
  OttTaskStatus,
  CURRENT_USER
} from '../../../data/rzOttData';
import { SectionId } from '../../../types/architecture';

interface OttMyDayViewProps {
  tasks: OttTask[];
  onSelectTask: (task: OttTask) => void;
  onStatusChange: (taskId: string, newStatus: OttTaskStatus) => void;
  onOpenSnooze: (task: OttTask) => void;
  onOpenSource: (sectionId: SectionId) => void;
  onOpenChatWithAssignee: (userName: string) => void;
  onAddNewTask: () => void;
  onOpenTemplates: () => void;
  onAddSubtask: (taskId: string) => void;
  onSimulateCompleteCallback: (task: OttTask) => void;
}

export const OttMyDayView: React.FC<OttMyDayViewProps> = ({
  tasks,
  onSelectTask,
  onStatusChange,
  onOpenSnooze,
  onOpenSource,
  onOpenChatWithAssignee,
  onAddNewTask,
  onOpenTemplates,
  onAddSubtask,
  onSimulateCompleteCallback
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | OttCategory>('ALL');
  const [secondaryFilter, setSecondaryFilter] = useState<'ALL' | 'HIGH_PRIORITY' | 'DUE_TODAY' | 'OVERDUE' | 'ASSIGNED_TO_ME' | 'CREATED_BY_ME'>('ALL');

  // Filter logic
  const filteredTasks = tasks.filter((t) => {
    // Category
    if (categoryFilter !== 'ALL' && t.category !== categoryFilter) {
      return false;
    }

    // Secondary
    if (secondaryFilter === 'HIGH_PRIORITY' && t.priority !== 'HIGH' && t.priority !== 'URGENT') {
      return false;
    }
    if (secondaryFilter === 'DUE_TODAY' && t.dueDate !== new Date().toISOString().split('T')[0]) {
      return false;
    }
    if (secondaryFilter === 'OVERDUE' && t.status !== 'OVERDUE') {
      return false;
    }
    if (secondaryFilter === 'ASSIGNED_TO_ME' && t.assignee.id !== CURRENT_USER.id) {
      return false;
    }
    if (secondaryFilter === 'CREATED_BY_ME' && t.createdBy.id !== CURRENT_USER.id) {
      return false;
    }

    return true;
  });

  const getPriorityStyle = (priority: OttTaskPriority) => {
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

  const getStatusStyle = (status: OttTaskStatus) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
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
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const getSourceBadge = (system?: string) => {
    switch (system) {
      case 'QUARRY': return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      case 'CRUSHER': return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
      case 'VEHICLE': return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
      case 'CONTRACT_JOB': return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
      case 'BUILDING_MATERIALS': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'MARKETPLACE': return 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10';
      case 'QUARRY_LAND': return 'text-lime-400 border-lime-500/30 bg-lime-500/10';
      case 'RZ_CHAT': return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
      default: return 'text-slate-400 border-slate-800 bg-slate-900';
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        {/* Primary Categories */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-amber-400" /> Focus:
            </span>
            {(['ALL', 'WORK', 'PERSONAL', 'FAMILY', 'BUSINESS', 'STUDY', 'OTHER'] as const).map((cat) => {
              const isSelected = categoryFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                      : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {cat === 'ALL' ? 'All Contexts' : cat.charAt(0) + cat.slice(1).toLowerCase()}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenTemplates}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Smart Templates</span>
            </button>
            <button
              onClick={onAddNewTask}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Task</span>
            </button>
          </div>
        </div>

        {/* Secondary Filter Chips */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 overflow-x-auto scrollbar-none text-xs">
          <span className="text-[11px] font-bold text-slate-500 shrink-0">Filter by:</span>
          {[
            { id: 'ALL', label: 'All Tasks' },
            { id: 'HIGH_PRIORITY', label: 'High & Urgent' },
            { id: 'DUE_TODAY', label: 'Due Today' },
            { id: 'OVERDUE', label: 'Overdue' },
            { id: 'ASSIGNED_TO_ME', label: 'Assigned to Me' },
            { id: 'CREATED_BY_ME', label: 'Created by Me' }
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setSecondaryFilter(sec.id as any)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                secondaryFilter === sec.id
                  ? 'bg-slate-800 text-amber-300 font-bold border border-amber-500/40'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-900'
              }`}
            >
              {sec.label}
            </button>
          ))}
          <span className="ml-auto text-[11px] font-mono text-slate-500 shrink-0">
            Showing {filteredTasks.length} task{filteredTasks.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Task Cards Stream */}
      <div className="space-y-3.5">
        {filteredTasks.map((task) => {
          const isCompleted = task.status === 'COMPLETED';
          const completedSubtasks = task.subtasks.filter(s => s.completed).length;
          const totalSubtasks = task.subtasks.length;

          return (
            <div
              key={task.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
                isCompleted
                  ? 'bg-slate-950/40 border-slate-800/60 opacity-80'
                  : task.status === 'OVERDUE'
                  ? 'bg-gradient-to-r from-rose-950/20 via-slate-900 to-slate-900 border-rose-500/30'
                  : 'bg-slate-900/90 border-slate-800 hover:border-amber-500/40 shadow-lg'
              }`}
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Status Pill */}
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getStatusStyle(task.status)}`}>
                      {task.status.replace('_', ' ')}
                    </span>

                    {/* Priority Pill */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getPriorityStyle(task.priority)}`}>
                      {task.priority}
                    </span>

                    {/* Category Pill */}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                      {task.category}
                    </span>

                    {/* Source System Pill */}
                    {task.source && (
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${getSourceBadge(task.source.sourceSystem)}`}>
                        <Link2 className="w-2.5 h-2.5" />
                        {task.source.sourceSystem} &bull; {task.source.sourceRecordId}
                      </span>
                    )}

                    {/* Snoozed Indicator */}
                    {task.status === 'SNOOZED' && task.snoozedUntil && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        Snoozed until: {task.snoozedUntil}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => onSelectTask(task)}
                    className={`text-sm sm:text-base font-black leading-snug cursor-pointer hover:text-amber-300 transition ${
                      isCompleted ? 'line-through text-slate-500' : 'text-white'
                    }`}
                  >
                    {task.title}
                  </h3>

                  {/* Description preview */}
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {task.description}
                  </p>
                </div>

                {/* Due Time & Assignee Avatar */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span className={task.status === 'OVERDUE' ? 'text-rose-400' : 'text-slate-300'}>
                      {task.dueTime}
                    </span>
                    <span className="text-[10px] text-slate-500">({task.dueDate})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <img
                      src={task.assignee.avatar}
                      alt={task.assignee.name}
                      title={`Assigned to ${task.assignee.name}`}
                      className="w-6 h-6 rounded-full object-cover border border-amber-500/40"
                    />
                    <span className="text-[11px] text-slate-400 hidden sm:inline">
                      {task.assignee.name.split(' ')[0]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Subtask Progress & Chips */}
              <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-3">
                  {/* Subtasks summary */}
                  {totalSubtasks > 0 && (
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <ListTodo className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-semibold text-slate-300">
                        {completedSubtasks} / {totalSubtasks} steps
                      </span>
                    </div>
                  )}

                  {/* Reminder setting */}
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <span className="text-slate-500">Reminder:</span>
                    <span className="text-slate-300 font-mono">{task.reminderRule}</span>
                  </div>

                  {/* Attachments count */}
                  {task.attachments.length > 0 && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Paperclip className="w-3 h-3 text-slate-500" />
                      <span>{task.attachments.length} file{task.attachments.length === 1 ? '' : 's'}</span>
                    </div>
                  )}

                  {/* Tags */}
                  {task.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-500 border border-slate-800">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Primary Action Buttons */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* Start / In Progress Button */}
                  {!isCompleted && task.status !== 'IN_PROGRESS' && (
                    <button
                      type="button"
                      onClick={() => onStatusChange(task.id, 'IN_PROGRESS')}
                      className="px-2.5 py-1 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                    >
                      <Play className="w-3 h-3" />
                      <span>Start</span>
                    </button>
                  )}

                  {/* Complete Button */}
                  {!isCompleted ? (
                    <button
                      type="button"
                      onClick={() => onSimulateCompleteCallback(task)}
                      className="px-3 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-black shadow-md shadow-emerald-500/20 flex items-center gap-1 transition cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Complete</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onStatusChange(task.id, 'IN_PROGRESS')}
                      className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Re-open</span>
                    </button>
                  )}

                  {/* Snooze Button */}
                  {!isCompleted && (
                    <button
                      type="button"
                      onClick={() => onOpenSnooze(task)}
                      className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                    >
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Snooze</span>
                    </button>
                  )}

                  {/* Open Source platform button */}
                  {task.source && (
                    <button
                      type="button"
                      onClick={() => onOpenSource(task.source!.targetSectionId)}
                      className="px-2.5 py-1 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Open Source</span>
                    </button>
                  )}

                  {/* Open Chat */}
                  <button
                    type="button"
                    onClick={() => onOpenChatWithAssignee(task.assignee.name)}
                    className="p-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                    title={`Open RZ Chat with ${task.assignee.name}`}
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-purple-400" />
                  </button>

                  {/* Edit / Detail view */}
                  <button
                    type="button"
                    onClick={() => onSelectTask(task)}
                    className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    <span>Details</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <div className="p-12 text-center bg-slate-900/60 border border-dashed border-slate-800 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <Sun className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">No tasks matching your current filter</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              All caught up in this view! Enjoy the peace of mind or schedule your next high-impact operational task.
            </p>
            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                onClick={onAddNewTask}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                + New Task
              </button>
              <button
                onClick={onOpenTemplates}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 cursor-pointer"
              >
                Load From Template
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
