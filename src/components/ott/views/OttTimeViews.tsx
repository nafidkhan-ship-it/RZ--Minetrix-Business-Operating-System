import React from 'react';
import {
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import {
  OttTask,
  OttTaskStatus
} from '../../../data/rzOttData';
import { SectionId } from '../../../types/architecture';

interface OttTimeViewsProps {
  viewMode: 'TODAY' | 'UPCOMING' | 'OVERDUE';
  tasks: OttTask[];
  onSelectTask: (task: OttTask) => void;
  onStatusChange: (taskId: string, newStatus: OttTaskStatus) => void;
  onOpenSnooze: (task: OttTask) => void;
  onOpenSource: (sectionId: SectionId) => void;
}

export const OttTimeViews: React.FC<OttTimeViewsProps> = ({
  viewMode,
  tasks,
  onSelectTask,
  onStatusChange,
  onOpenSnooze,
  onOpenSource
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Partition tasks
  let displayedTasks: OttTask[] = [];
  let headerTitle = '';
  let headerDesc = '';
  let headerBadge = '';

  if (viewMode === 'TODAY') {
    displayedTasks = tasks.filter(t => t.dueDate === todayStr || t.status === 'IN_PROGRESS');
    headerTitle = "Today's Agenda & Focus";
    headerDesc = 'Immediate execution queue, shifts scheduled, and daily production deadlines';
    headerBadge = 'DUE TODAY';
  } else if (viewMode === 'UPCOMING') {
    displayedTasks = tasks.filter(t => t.dueDate > todayStr && t.status !== 'COMPLETED');
    headerTitle = 'Upcoming Pipeline & Forward Horizons';
    headerDesc = 'Upcoming inspections, lease renewals, scheduled plant shutdowns, and deliveries';
    headerBadge = 'HORIZON';
  } else if (viewMode === 'OVERDUE') {
    displayedTasks = tasks.filter(t => t.status === 'OVERDUE' || (t.dueDate < todayStr && t.status !== 'COMPLETED'));
    headerTitle = 'Overdue Bottlenecks & Critical Escalations';
    headerDesc = 'Delinquent tasks, lapsed compliance filings, and delayed shipments requiring intervention';
    headerBadge = 'CRITICAL ATTENTION';
  }

  const handleEscalate = (task: OttTask) => {
    alert(`Escalated task "${task.title}" to General Manager & Operational Telegram Bridge.`);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Banner */}
      <div className={`p-4 sm:p-5 rounded-2xl border shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 ${
        viewMode === 'OVERDUE'
          ? 'bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border-rose-500/30'
          : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
            viewMode === 'OVERDUE'
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
          }`}>
            {viewMode === 'OVERDUE' ? <Flame className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                viewMode === 'OVERDUE'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}>
                {headerBadge}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {displayedTasks.length} Task{displayedTasks.length === 1 ? '' : 's'}
              </span>
            </div>
            <h2 className="text-base font-black text-white mt-0.5">{headerTitle}</h2>
            <div className="text-xs text-slate-400">{headerDesc}</div>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {displayedTasks.map((t) => (
          <div
            key={t.id}
            className={`p-4 rounded-2xl border shadow-lg space-y-3 text-xs transition ${
              viewMode === 'OVERDUE'
                ? 'bg-slate-900/90 border-rose-500/30 hover:border-rose-500/50'
                : 'bg-slate-900/90 border-slate-800 hover:border-amber-500/40'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {viewMode === 'OVERDUE' && (
                    <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-rose-500 text-slate-950">
                      OVERDUE BY 1+ DAYS
                    </span>
                  )}
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    t.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                    t.status === 'IN_PROGRESS' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                    'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {t.status.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950 text-amber-400 border border-slate-800">
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

              {/* Time & Assignee */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1.5 shrink-0">
                <div className="font-mono font-bold text-white flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.dueTime}</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  {t.dueDate}
                </div>
                <div className="text-[11px] text-slate-300 font-semibold mt-1">
                  {t.assignee.name}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
              <div className="text-[11px] text-slate-400 font-mono">
                Category: <strong className="text-slate-200">{t.category}</strong>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {viewMode === 'OVERDUE' && (
                  <button
                    onClick={() => handleEscalate(t)}
                    className="px-2.5 py-1 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-black flex items-center gap-1 transition cursor-pointer"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Escalate Task</span>
                  </button>
                )}

                {t.status !== 'COMPLETED' && (
                  <>
                    <button
                      onClick={() => onStatusChange(t.id, 'COMPLETED')}
                      className="px-3 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-black shadow-md shadow-emerald-500/20 flex items-center gap-1 transition cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Complete</span>
                    </button>
                    <button
                      onClick={() => onOpenSnooze(t)}
                      className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Reschedule</span>
                    </button>
                  </>
                )}

                {t.source && (
                  <button
                    onClick={() => onOpenSource(t.source!.targetSectionId)}
                    className="px-2.5 py-1 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>View Origin</span>
                  </button>
                )}

                <button
                  onClick={() => onSelectTask(t)}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
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
            <h3 className="font-bold text-white text-sm">No tasks in this time horizon</h3>
            <p className="text-slate-400 text-xs">Schedule is completely clear for this period.</p>
          </div>
        )}
      </div>
    </div>
  );
};
