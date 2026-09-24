import React, { useState } from 'react';
import {
  CheckCircle2,
  Repeat,
  Calendar,
  Clock,
  RotateCcw,
  Sparkles,
  Link2,
  Check,
  ChevronRight,
  Filter
} from 'lucide-react';
import {
  OttTask,
  OttTaskStatus,
  CURRENT_USER
} from '../../../data/rzOttData';
import { SectionId } from '../../../types/architecture';

interface OttCompletedRecurringViewProps {
  viewMode: 'COMPLETED' | 'RECURRING';
  tasks: OttTask[];
  onSelectTask: (task: OttTask) => void;
  onStatusChange: (taskId: string, newStatus: OttTaskStatus) => void;
  onOpenSource: (sectionId: SectionId) => void;
}

export const OttCompletedRecurringView: React.FC<OttCompletedRecurringViewProps> = ({
  viewMode,
  tasks,
  onSelectTask,
  onStatusChange,
  onOpenSource
}) => {
  const displayedTasks = tasks.filter((t) => {
    if (viewMode === 'COMPLETED') {
      return t.status === 'COMPLETED';
    }
    if (viewMode === 'RECURRING') {
      return t.repeatRule !== 'NONE';
    }
    return true;
  });

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            {viewMode === 'COMPLETED' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <Repeat className="w-5 h-5 text-blue-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                viewMode === 'COMPLETED'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
              }`}>
                {viewMode === 'COMPLETED' ? 'RESOLUTION ARCHIVE' : 'AUTOMATED CYCLES'}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {displayedTasks.length} Record{displayedTasks.length === 1 ? '' : 's'}
              </span>
            </div>
            <h2 className="text-base font-black text-white mt-0.5">
              {viewMode === 'COMPLETED' ? 'Completed Tasks & Audit History' : 'Recurring Tasks & Scheduled Routines'}
            </h2>
            <div className="text-xs text-slate-400">
              {viewMode === 'COMPLETED'
                ? 'Immutable record of fulfilled work orders and cross-platform synced completions'
                : 'Automated periodic checklists for plant maintenance, shift handovers, and compliance'}
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {displayedTasks.map((t) => (
          <div
            key={t.id}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition shadow-lg space-y-3 text-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    t.status === 'COMPLETED'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                  }`}>
                    {t.status.replace('_', ' ')}
                  </span>
                  {t.repeatRule !== 'NONE' && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                      <Repeat className="w-2.5 h-2.5" />
                      {t.repeatRule}
                    </span>
                  )}
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

              {/* Resolved / Recurrence Timing */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1 shrink-0">
                <div className="font-mono font-bold text-slate-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.dueTime}</span>
                </div>
                <div className="text-[10px] font-mono text-slate-500">{t.dueDate}</div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Assignee: <strong className="text-white">{t.assignee.name.split(' ')[0]}</strong>
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {t.source ? (
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Synced to {t.source.sourceSystem} ({t.source.sourceStatusAfter})
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-500">Native OTT Task Record</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {t.status === 'COMPLETED' ? (
                  <button
                    onClick={() => onStatusChange(t.id, 'IN_PROGRESS')}
                    className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-[11px] flex items-center gap-1 transition cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Re-open
                  </button>
                ) : (
                  <button
                    onClick={() => onStatusChange(t.id, 'COMPLETED')}
                    className="px-2.5 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] flex items-center gap-1 transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-3 h-3" /> Mark Completed
                  </button>
                )}

                <button
                  onClick={() => onSelectTask(t)}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] flex items-center gap-1 transition cursor-pointer"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {displayedTasks.length === 0 && (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
            <h3 className="font-bold text-white text-sm">No items matching this archive</h3>
            <p className="text-slate-400 text-xs">Records will populate as you fulfill task lifecycle routines.</p>
          </div>
        )}
      </div>
    </div>
  );
};
