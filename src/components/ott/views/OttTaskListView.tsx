import React, { useState } from 'react';
import {
  Search,
  Filter,
  Layers,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowUpDown,
  Tag,
  Link2,
  Calendar,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import {
  OttTask,
  OttTaskStatus,
  OttTaskPriority,
  OttCategory,
  OttSourceSystem,
  DEMO_OTT_USERS
} from '../../../data/rzOttData';
import { SectionId } from '../../../types/architecture';

interface OttTaskListViewProps {
  tasks: OttTask[];
  onSelectTask: (task: OttTask) => void;
  onStatusChange: (taskId: string, newStatus: OttTaskStatus) => void;
  onAddNewTask: () => void;
  onOpenSource: (sectionId: SectionId) => void;
}

export const OttTaskListView: React.FC<OttTaskListViewProps> = ({
  tasks,
  onSelectTask,
  onStatusChange,
  onAddNewTask,
  onOpenSource
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');

  const filteredTasks = tasks.filter((t) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description.toLowerCase().includes(q);
      const matchAssignee = t.assignee.name.toLowerCase().includes(q);
      const matchTags = t.tags.some(tag => tag.toLowerCase().includes(q));
      const matchRecord = t.source?.sourceRecordId.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchAssignee && !matchTags && !matchRecord) {
        return false;
      }
    }

    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false;
    if (categoryFilter !== 'ALL' && t.category !== categoryFilter) return false;
    if (sourceFilter !== 'ALL') {
      if (sourceFilter === 'NATIVE') {
        if (t.source) return false;
      } else {
        if (t.source?.sourceSystem !== sourceFilter) return false;
      }
    }

    return true;
  });

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Search & Filter Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks by title, record ID, assignee, or #tag..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onAddNewTask}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Task</span>
            </button>
          </div>
        </div>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-xs">
          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="STARTED">Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="OVERDUE">Overdue</option>
            <option value="SNOOZED">Snoozed</option>
          </select>

          {/* Priority */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="WORK">Work</option>
            <option value="PERSONAL">Personal</option>
            <option value="FAMILY">Family</option>
            <option value="BUSINESS">Business</option>
            <option value="STUDY">Study</option>
            <option value="OTHER">Other</option>
          </select>

          {/* Source System */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Source Systems</option>
            <option value="NATIVE">Native RZ OTT</option>
            <option value="QUARRY">Quarry Management</option>
            <option value="CRUSHER">Crusher Management</option>
            <option value="VEHICLE">Vehicle Management</option>
            <option value="CONTRACT_JOB">Contract &amp; Job</option>
            <option value="BUILDING_MATERIALS">Building Materials</option>
            <option value="MARKETPLACE">Marketplace</option>
            <option value="QUARRY_LAND">Quarry Land</option>
            <option value="RZ_CHAT">RZ Chat</option>
          </select>
        </div>
      </div>

      {/* Task Count & Table View */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-3.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs font-bold text-slate-400">
          <span>Found {filteredTasks.length} Task Records</span>
          <span className="text-[10px] font-mono text-slate-500">Sorted by Priority &bull; Due Date</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {filteredTasks.map((t) => (
            <div
              key={t.id}
              className="p-4 hover:bg-slate-800/40 transition flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    t.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                    t.status === 'OVERDUE' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                    t.status === 'IN_PROGRESS' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                    'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {t.status.replace('_', ' ')}
                  </span>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    t.priority === 'URGENT' ? 'bg-rose-500/20 text-rose-300' :
                    t.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-300' :
                    'bg-blue-500/20 text-blue-300'
                  }`}>
                    {t.priority}
                  </span>

                  <span className="text-[10px] font-mono text-slate-400">
                    {t.category}
                  </span>

                  {t.source && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {t.source.sourceSystem}: {t.source.sourceRecordId}
                    </span>
                  )}
                </div>

                <div
                  onClick={() => onSelectTask(t)}
                  className="font-bold text-white text-sm hover:text-amber-300 cursor-pointer truncate"
                >
                  {t.title}
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-1">
                  {t.description}
                </p>
              </div>

              {/* Right Metas */}
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <div className="font-mono font-bold text-white text-xs flex items-center gap-1 justify-end">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.dueTime}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">{t.dueDate}</div>
                </div>

                <div className="flex items-center gap-2">
                  <img
                    src={t.assignee.avatar}
                    alt={t.assignee.name}
                    className="w-7 h-7 rounded-full object-cover border border-amber-500/30"
                  />
                  <div className="hidden sm:block text-left">
                    <div className="font-bold text-white text-xs">{t.assignee.name.split(' ')[0]}</div>
                    <div className="text-[9px] text-slate-500">{t.assignee.team}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectTask(t)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {filteredTasks.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-xs">
              No tasks match your search and filter criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
