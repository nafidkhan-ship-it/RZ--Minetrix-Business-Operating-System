import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  Plus,
  Layers,
  Sparkles,
  Link2
} from 'lucide-react';
import { OttTask, OttCategory, OttSourceSystem } from '../../../data/rzOttData';

interface OttCalendarViewProps {
  tasks: OttTask[];
  onSelectTask: (task: OttTask) => void;
  onAddNewTask: () => void;
}

export const OttCalendarView: React.FC<OttCalendarViewProps> = ({
  tasks,
  onSelectTask,
  onAddNewTask
}) => {
  const [calendarMode, setCalendarMode] = useState<'DAY' | 'WEEK' | 'MONTH'>('MONTH');
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  const filteredTasks = tasks.filter((t) => {
    if (categoryFilter !== 'ALL' && t.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Calendar Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white">September 2026</h2>
            <div className="text-[11px] font-mono text-slate-400">RZ MINETRIX Operations Schedule</div>
          </div>
        </div>

        {/* View Mode Switcher & Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
            {(['DAY', 'WEEK', 'MONTH'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setCalendarMode(m)}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  calendarMode === m
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-xs font-semibold focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="WORK">Work Operations</option>
            <option value="PERSONAL">Personal</option>
            <option value="FAMILY">Family</option>
            <option value="BUSINESS">Business &amp; Finance</option>
            <option value="STUDY">Study</option>
          </select>

          <button
            onClick={onAddNewTask}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl shadow-md transition cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule</span>
          </button>
        </div>
      </div>

      {/* MONTH VIEW */}
      {calendarMode === 'MONTH' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Month Grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {daysInMonth.map((day) => {
              const isToday = day === 23;
              const isSelected = day === selectedDay;
              // Filter dummy task count
              const dayTasks = filteredTasks.filter((_, idx) => (idx + day) % 4 === 0);

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`min-h-[75px] sm:min-h-[90px] p-2 rounded-xl border flex flex-col justify-between cursor-pointer transition ${
                    isSelected
                      ? 'bg-slate-800/90 border-amber-500/80 ring-1 ring-amber-500/40'
                      : isToday
                      ? 'bg-amber-500/10 border-amber-500/40'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isToday ? 'text-amber-400' : 'text-slate-300'}`}>
                      {day}
                    </span>
                    {isToday && (
                      <span className="text-[9px] font-mono font-bold px-1 rounded bg-amber-500 text-slate-950">
                        TODAY
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    {dayTasks.slice(0, 2).map((t, idx) => (
                      <div
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTask(t);
                        }}
                        className={`text-[9px] sm:text-[10px] truncate px-1.5 py-0.5 rounded font-medium border ${
                          t.priority === 'URGENT'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : 'bg-slate-900 text-amber-300 border-slate-800'
                        }`}
                      >
                        {t.title}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <div className="text-[9px] text-slate-500 font-mono">
                        +{dayTasks.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Day Agenda Detail */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Agenda for September {selectedDay}, 2026:
            </span>
          </div>
          <span className="text-[11px] font-mono text-amber-400">
            {filteredTasks.length} scheduled items
          </span>
        </div>

        <div className="divide-y divide-slate-800">
          {filteredTasks.slice(0, 4).map((t) => (
            <div
              key={t.id}
              onClick={() => onSelectTask(t)}
              className="py-3 flex items-center justify-between gap-3 text-xs hover:bg-slate-800/30 px-2 rounded-xl transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                <div>
                  <div className="font-bold text-white hover:text-amber-300">{t.title}</div>
                  <div className="text-[11px] text-slate-400">{t.assignee.name} &bull; {t.category}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono text-slate-400 shrink-0">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.dueTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
