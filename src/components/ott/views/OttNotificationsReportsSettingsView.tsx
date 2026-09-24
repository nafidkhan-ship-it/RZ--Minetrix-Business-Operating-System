import React, { useState } from 'react';
import {
  Bell,
  BarChart3,
  Settings,
  FolderTree,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  Calendar,
  Layers,
  Sparkles,
  Shield,
  Sliders,
  Check
} from 'lucide-react';
import {
  OttNotificationItem,
  INITIAL_OTT_NOTIFICATIONS,
  OttTask,
  CURRENT_USER
} from '../../../data/rzOttData';

interface OttNotificationsReportsSettingsViewProps {
  viewMode: 'NOTIFICATIONS' | 'REPORTS' | 'SETTINGS' | 'CATEGORIES';
  tasks: OttTask[];
  onSelectTaskById?: (taskId: string) => void;
}

export const OttNotificationsReportsSettingsView: React.FC<OttNotificationsReportsSettingsViewProps> = ({
  viewMode,
  tasks,
  onSelectTaskById
}) => {
  const [notifications, setNotifications] = useState<OttNotificationItem[]>(INITIAL_OTT_NOTIFICATIONS);
  const [notifFilter, setNotifFilter] = useState<string>('ALL');

  // Settings states
  const [morningBriefingTime, setMorningBriefingTime] = useState('07:30 AM');
  const [autoSnoozeMins, setAutoSnoozeMins] = useState('30');
  const [pushSound, setPushSound] = useState(true);
  const [crossPlatformSync, setCrossPlatformSync] = useState(true);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const filteredNotifs = notifications.filter((n) => {
    if (notifFilter !== 'ALL' && n.type !== notifFilter) return false;
    return true;
  });

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  // Metrics for reports & categories
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
  const overdueTasks = tasks.filter(t => t.status === 'OVERDUE').length;
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const categoryCounts = {
    WORK: tasks.filter(t => t.category === 'WORK').length,
    PERSONAL: tasks.filter(t => t.category === 'PERSONAL').length,
    FAMILY: tasks.filter(t => t.category === 'FAMILY').length,
    BUSINESS: tasks.filter(t => t.category === 'BUSINESS').length,
    STUDY: tasks.filter(t => t.category === 'STUDY').length,
    OTHER: tasks.filter(t => t.category === 'OTHER').length
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* NOTIFICATIONS VIEW */}
      {viewMode === 'NOTIFICATIONS' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-white">Notifications &amp; Activity Stream</h2>
                <div className="text-xs text-slate-400">Real-time alerts, assignment triggers, and reminder pings</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={markAllRead}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                Mark all as read
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            {[
              { id: 'ALL', label: 'All Alerts' },
              { id: 'ASSIGNED', label: 'Assigned' },
              { id: 'REMINDER', label: 'Reminders' },
              { id: 'APPROVAL', label: 'Approvals' },
              { id: 'OVERDUE', label: 'Overdue' },
              { id: 'COMPLETED', label: 'Completions' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setNotifFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer border ${
                  notifFilter === f.id
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filteredNotifs.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 text-xs ${
                  n.read
                    ? 'bg-slate-900/60 border-slate-800/80 text-slate-400'
                    : 'bg-slate-900 border-amber-500/30 text-white shadow-lg'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${n.read ? 'bg-slate-700' : 'bg-amber-400'}`} />
                  <div>
                    <div className="font-bold text-white text-xs">{n.title}</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">{n.message}</div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono text-slate-500">{n.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REPORTS VIEW */}
      {viewMode === 'REPORTS' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-white">Productivity &amp; Operations Intelligence</h2>
                <div className="text-xs text-slate-400">Metrics, turnaround speeds, and team task completion velocity</div>
              </div>
            </div>

            <button
              onClick={() => alert('Exporting OTT Operations Report as CSV / PDF...')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Report</span>
            </button>
          </div>

          {/* 4 Metric KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Scheduled</span>
              <div className="text-2xl font-black text-white font-mono mt-1">{totalTasks}</div>
              <span className="text-[10px] text-slate-500 mt-1 block">Across all contexts</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Completion Velocity</span>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-1">{completionRate}%</div>
              <span className="text-[10px] text-emerald-500/80 mt-1 block">{completedTasks} tasks closed</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">In Flight (Active)</span>
              <div className="text-2xl font-black text-amber-400 font-mono mt-1">{inProgressTasks}</div>
              <span className="text-[10px] text-amber-500/80 mt-1 block">Executing right now</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Overdue Bottlenecks</span>
              <div className="text-2xl font-black text-rose-400 font-mono mt-1">{overdueTasks}</div>
              <span className="text-[10px] text-rose-500/80 mt-1 block">Requires escalation</span>
            </div>
          </div>

          {/* Context Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-black text-white text-sm">Workload Distribution by Context</h3>
            <div className="space-y-3">
              {Object.entries(categoryCounts).map(([cat, count]) => {
                const pct = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-white">{cat}</span>
                      <span className="text-slate-400 font-mono">{count} tasks ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CATEGORIES VIEW */}
      {viewMode === 'CATEGORIES' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <FolderTree className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-white">Categories &amp; Context Domains</h2>
                <div className="text-xs text-slate-400">
                  OTT supports Work, Personal, Family, Business, Study, and Other life operational spheres
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: 'Work', key: 'WORK', desc: 'Quarrying, crushing, fleet logistics, civil jobs', count: categoryCounts.WORK },
              { name: 'Personal', key: 'PERSONAL', desc: 'Personal health, appointments, self-care routines', count: categoryCounts.PERSONAL },
              { name: 'Family', key: 'FAMILY', desc: 'Family commitments, domestic repairs, gatherings', count: categoryCounts.FAMILY },
              { name: 'Business', key: 'BUSINESS', desc: 'Finances, contracts, vendor terms, banking', count: categoryCounts.BUSINESS },
              { name: 'Study', key: 'STUDY', desc: 'Mining engineering certifications, safety courses', count: categoryCounts.STUDY },
              { name: 'Other', key: 'OTHER', desc: 'Miscellaneous reminders and ad-hoc actions', count: categoryCounts.OTHER }
            ].map((cat) => (
              <div key={cat.key} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-white text-sm">{cat.name}</h3>
                  <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-mono font-bold text-xs">
                    {cat.count} Tasks
                  </span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SETTINGS VIEW */}
      {viewMode === 'SETTINGS' && (
        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-white">OTT Configuration &amp; Preferences</h2>
                <div className="text-xs text-slate-400">Manage notifications, working hours, auto-snooze and ecosystem sync rules</div>
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>

          {settingsSaved && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" />
              <span>Preferences saved successfully to local Studio storage!</span>
            </div>
          )}

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
            <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">Scheduling &amp; Nudges</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Daily Morning Briefing Time
                </label>
                <input
                  type="text"
                  value={morningBriefingTime}
                  onChange={(e) => setMorningBriefingTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Default Snooze Interval (Minutes)
                </label>
                <input
                  type="number"
                  value={autoSnoozeMins}
                  onChange={(e) => setAutoSnoozeMins(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none"
                />
              </div>
            </div>

            <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2 pt-2">Ecosystem Sync</h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <div>
                  <div className="font-bold text-white">Bi-directional Cross-Platform Sync</div>
                  <div className="text-[10px] text-slate-400">
                    Automatically propagate task completion events back to Quarry, Crusher, and Fleet records
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={crossPlatformSync}
                  onChange={(e) => setCrossPlatformSync(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <div>
                  <div className="font-bold text-white">Audible Reminder Chimes</div>
                  <div className="text-[10px] text-slate-400">Play subtle chime when a scheduled due time is triggered</div>
                </div>
                <input
                  type="checkbox"
                  checked={pushSound}
                  onChange={(e) => setPushSound(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
