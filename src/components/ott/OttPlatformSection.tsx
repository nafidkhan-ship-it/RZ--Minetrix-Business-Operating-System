import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ListTodo,
  Calendar,
  Inbox,
  UserCheck,
  Send,
  Clock,
  CalendarDays,
  AlertTriangle,
  CheckCircle2,
  Repeat,
  PhoneCall,
  ShieldCheck,
  FolderKanban,
  Users,
  FolderTree,
  Bell,
  BarChart3,
  Settings,
  Plus,
  Link2,
  Search,
  Filter,
  Layers,
  ExternalLink,
  ChevronRight,
  Flame,
  Check,
  RotateCcw,
  Sun,
  Menu,
  X
} from 'lucide-react';
import { SectionId } from '../../types/architecture';
import {
  OttTask,
  OttTaskStatus,
  OttCategory,
  INITIAL_OTT_TASKS,
  CURRENT_USER,
  DEMO_OTT_USERS,
  OttSourceSystem
} from '../../data/rzOttData';

// Modals
import { OttNewTaskModal } from './OttNewTaskModal';
import { OttAssignTaskModal } from './OttAssignTaskModal';
import { OttQuickReminderModal } from './OttQuickReminderModal';
import { OttSnoozeModal } from './OttSnoozeModal';
import { OttTemplatesModal } from './OttTemplatesModal';
import { OttTaskDetailModal } from './OttTaskDetailModal';

// Subviews
import { OttMyDayView } from './views/OttMyDayView';
import { OttTaskListView } from './views/OttTaskListView';
import { OttCalendarView } from './views/OttCalendarView';
import { OttAssignedView } from './views/OttAssignedView';
import { OttTimeViews } from './views/OttTimeViews';
import { OttCompletedRecurringView } from './views/OttCompletedRecurringView';
import { OttFollowUpsView } from './views/OttFollowUpsView';
import { OttApprovalsView } from './views/OttApprovalsView';
import { OttProjectsTeamsView } from './views/OttProjectsTeamsView';
import { OttCrossPlatformBridgeView } from './views/OttCrossPlatformBridgeView';
import { OttNotificationsReportsSettingsView } from './views/OttNotificationsReportsSettingsView';

export type OttSecondaryTab =
  | 'my-day'
  | 'tasks'
  | 'calendar'
  | 'inbox'
  | 'assigned-to-me'
  | 'assigned-by-me'
  | 'today'
  | 'upcoming'
  | 'overdue'
  | 'completed'
  | 'recurring'
  | 'follow-ups'
  | 'approvals'
  | 'projects'
  | 'teams'
  | 'categories'
  | 'bridge'
  | 'notifications'
  | 'reports'
  | 'settings';

interface OttPlatformSectionProps {
  initialTab?: OttSecondaryTab;
  onNavigateSection?: (sectionId: SectionId) => void;
}

export const OttPlatformSection: React.FC<OttPlatformSectionProps> = ({
  initialTab = 'my-day',
  onNavigateSection
}) => {
  // Primary Navigation
  const [activeTab, setActiveTab] = useState<OttSecondaryTab>(initialTab);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Central Tasks State
  const [tasks, setTasks] = useState<OttTask[]>(INITIAL_OTT_TASKS);

  // Modals State
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [templatesModalOpen, setTemplatesModalOpen] = useState(false);
  const [snoozeModalOpen, setSnoozeModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<OttTask | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync initialTab if changed by parent
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Statistics calculation for Header Metrics
  const todayStr = new Date().toISOString().split('T')[0];
  const stats = {
    today: tasks.filter(t => t.dueDate === todayStr).length,
    dueSoon: tasks.filter(t => t.dueDate >= todayStr && t.status !== 'COMPLETED').length,
    overdue: tasks.filter(t => t.status === 'OVERDUE' || (t.dueDate < todayStr && t.status !== 'COMPLETED')).length,
    completed: tasks.filter(t => t.status === 'COMPLETED').length,
    inProgress: tasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'STARTED').length,
    highPriority: tasks.filter(t => (t.priority === 'HIGH' || t.priority === 'URGENT') && t.status !== 'COMPLETED').length
  };

  // Task Mutators
  const handleCreateTask = (taskData: Partial<OttTask>) => {
    const newTask: OttTask = {
      id: `task-${Date.now()}`,
      title: taskData.title || 'Untitled OTT Task',
      description: taskData.description || '',
      category: taskData.category || 'WORK',
      priority: taskData.priority || 'MEDIUM',
      status: taskData.status || 'ASSIGNED',
      assignee: taskData.assignee || CURRENT_USER,
      createdBy: CURRENT_USER,
      dueDate: taskData.dueDate || todayStr,
      dueTime: taskData.dueTime || '05:00 PM',
      startDate: todayStr,
      reminderRule: taskData.reminderRule || '30 minutes before',
      reminderStatus: 'SCHEDULED',
      repeatRule: taskData.repeatRule || 'NONE',
      tags: taskData.tags || ['Task'],
      subtasks: taskData.subtasks || [],
      attachments: taskData.attachments || [],
      comments: taskData.comments || [],
      source: taskData.source,
      activityLog: taskData.activityLog || [
        {
          id: `act-${Date.now()}`,
          action: 'Created task in OTT',
          actor: CURRENT_USER.name,
          timestamp: 'Just now'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTasks(prev => [newTask, ...prev]);
    showToast(`Task "${newTask.title}" added to My Day schedule!`);
  };

  const handleUpdateStatus = (taskId: string, newStatus: OttTaskStatus) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const updated: OttTask = {
            ...t,
            status: newStatus,
            completedAt: newStatus === 'COMPLETED' ? new Date().toISOString() : undefined,
            activityLog: [
              {
                id: `act-${Date.now()}`,
                action: `Status changed to ${newStatus.replace('_', ' ')}`,
                actor: CURRENT_USER.name,
                timestamp: 'Just now'
              },
              ...t.activityLog
            ]
          };

          if (newStatus === 'COMPLETED' && t.source) {
            showToast(`Task completed! Synced to ${t.source.sourceSystem} [${t.source.sourceRecordId}] &rarr; Status updated to ${t.source.sourceStatusAfter}`);
          } else {
            showToast(`Task marked as ${newStatus.replace('_', ' ')}`);
          }

          if (selectedTask?.id === taskId) {
            setSelectedTask(updated);
          }
          return updated;
        }
        return t;
      })
    );
  };

  const handleSnooze = (taskId: string, snoozeText: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const updated: OttTask = {
            ...t,
            status: 'SNOOZED',
            snoozedUntil: snoozeText,
            activityLog: [
              {
                id: `act-${Date.now()}`,
                action: `Snoozed until ${snoozeText}`,
                actor: CURRENT_USER.name,
                timestamp: 'Just now'
              },
              ...t.activityLog
            ]
          };
          if (selectedTask?.id === taskId) {
            setSelectedTask(updated);
          }
          return updated;
        }
        return t;
      })
    );
    showToast(`Task snoozed until ${snoozeText}`);
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const updatedSubtasks = t.subtasks.map(st =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          const updated = { ...t, subtasks: updatedSubtasks };
          if (selectedTask?.id === taskId) {
            setSelectedTask(updated);
          }
          return updated;
        }
        return t;
      })
    );
  };

  const handleAddSubtask = (taskId: string, title: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const updatedSubtasks = [
            ...t.subtasks,
            { id: `st-${Date.now()}`, title, completed: false }
          ];
          const updated = { ...t, subtasks: updatedSubtasks };
          if (selectedTask?.id === taskId) {
            setSelectedTask(updated);
          }
          return updated;
        }
        return t;
      })
    );
    showToast('Subtask checklist item added');
  };

  const handleAddComment = (taskId: string, text: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const updatedComments = [
            ...t.comments,
            {
              id: `cm-${Date.now()}`,
              userId: CURRENT_USER.id,
              userName: CURRENT_USER.name,
              userAvatar: CURRENT_USER.avatar,
              text,
              timestamp: 'Just now'
            }
          ];
          const updated = { ...t, comments: updatedComments };
          if (selectedTask?.id === taskId) {
            setSelectedTask(updated);
          }
          return updated;
        }
        return t;
      })
    );
    showToast('Comment recorded to audit log');
  };

  const handleOpenSource = (sectionId: SectionId) => {
    if (onNavigateSection) {
      onNavigateSection(sectionId);
    } else {
      showToast(`Navigating to source platform workspace: ${sectionId}`);
    }
  };

  const handleOpenChatWithUser = (userName: string) => {
    if (onNavigateSection) {
      showToast(`Launching Platform 8 — RZ Chat conversation with ${userName}...`);
      onNavigateSection('chat-platform');
    } else {
      showToast(`Opening RZ Chat direct message with ${userName}`);
    }
  };

  // Nav items configuration based on prompt section 2
  const navItems: {
    id: OttSecondaryTab;
    label: string;
    icon: any;
    count?: number;
    badgeColor?: string;
  }[] = [
    { id: 'my-day', label: 'My Day', icon: Sparkles, count: tasks.filter(t => t.dueDate === todayStr && t.status !== 'COMPLETED').length, badgeColor: 'bg-amber-500/20 text-amber-300' },
    { id: 'tasks', label: 'Tasks', icon: ListTodo, count: tasks.length },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'inbox', label: 'Inbox', icon: Inbox, count: tasks.filter(t => t.assignee.id === CURRENT_USER.id && t.status === 'ASSIGNED').length, badgeColor: 'bg-cyan-500/20 text-cyan-300' },
    { id: 'assigned-to-me', label: 'Assigned to Me', icon: UserCheck, count: tasks.filter(t => t.assignee.id === CURRENT_USER.id).length },
    { id: 'assigned-by-me', label: 'Assigned by Me', icon: Send, count: tasks.filter(t => t.createdBy.id === CURRENT_USER.id && t.assignee.id !== CURRENT_USER.id).length },
    { id: 'today', label: 'Today', icon: Clock, count: stats.today },
    { id: 'upcoming', label: 'Upcoming', icon: CalendarDays },
    { id: 'overdue', label: 'Overdue', icon: AlertTriangle, count: stats.overdue, badgeColor: 'bg-rose-500/20 text-rose-300' },
    { id: 'completed', label: 'Completed', icon: CheckCircle2, count: stats.completed },
    { id: 'recurring', label: 'Recurring', icon: Repeat },
    { id: 'follow-ups', label: 'Follow-ups', icon: PhoneCall },
    { id: 'approvals', label: 'Approvals', icon: ShieldCheck },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'bridge', label: 'Cross-Platform Bridge', icon: Link2, badgeColor: 'bg-purple-500/20 text-purple-300' },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="flex flex-col min-h-[850px] bg-slate-950 text-white rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-amber-500/50 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-fadeIn max-w-md">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="flex-1" dangerouslySetInnerHTML={{ __html: toastMessage }} />
        </div>
      )}

      {/* Main Top Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Branding & Subtitle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-amber-500 text-slate-950 uppercase tracking-wider">
                  RZ® OTT
                </span>
                <span className="text-[11px] font-mono text-slate-400">Organise Today &amp; Tomorrow</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                  STUDIO PREVIEW / DEMO DATA
                </span>
              </div>
              <h1 className="text-base sm:text-xl font-black text-white mt-0.5">
                Universal Work &amp; Productivity Engine
              </h1>
            </div>
          </div>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Primary Action Buttons Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setNewTaskModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>

          <button
            onClick={() => setAssignModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Assign Task</span>
          </button>

          <button
            onClick={() => setReminderModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Quick Reminder</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Schedule</span>
          </button>

          <button
            onClick={() => setActiveTab('follow-ups')}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Create Follow-up</span>
          </button>
        </div>
      </div>

      {/* Section 3: TODAY METRICS OVERVIEW BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3 p-3 sm:p-4 bg-slate-900/60 border-b border-slate-800/80 text-xs">
        <div
          onClick={() => setActiveTab('today')}
          className="p-2.5 sm:p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase">Tasks Today</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono mt-1">{stats.today}</div>
        </div>

        <div
          onClick={() => setActiveTab('upcoming')}
          className="p-2.5 sm:p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase">Due Soon</span>
            <CalendarDays className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-blue-300 font-mono mt-1">{stats.dueSoon}</div>
        </div>

        <div
          onClick={() => setActiveTab('overdue')}
          className="p-2.5 sm:p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-rose-500/40 transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase text-rose-400">Overdue</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-400 font-mono mt-1">{stats.overdue}</div>
        </div>

        <div
          onClick={() => setActiveTab('completed')}
          className="p-2.5 sm:p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase text-emerald-400">Completed</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono mt-1">{stats.completed}</div>
        </div>

        <div
          onClick={() => setActiveTab('tasks')}
          className="p-2.5 sm:p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase">In Progress</span>
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono mt-1">{stats.inProgress}</div>
        </div>

        <div
          onClick={() => setActiveTab('my-day')}
          className="p-2.5 sm:p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase text-amber-400">High Priority</span>
            <Flame className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono mt-1">{stats.highPriority}</div>
        </div>
      </div>

      {/* Main Workspace Layout: Desktop Sidebar + Content Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* SECONDARY NAVIGATION SIDEBAR */}
        <aside
          className={`${
            mobileMenuOpen ? 'flex' : 'hidden'
          } md:flex flex-col w-full md:w-64 bg-slate-900/80 border-r border-slate-800 shrink-0 p-3 overflow-y-auto space-y-1 text-xs`}
        >
          <div className="px-3 py-2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            RZ® OTT Workspaces
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isAct = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-3 py-2 rounded-xl font-bold flex items-center justify-between transition cursor-pointer border ${
                  isAct
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                    : 'bg-transparent text-slate-300 border-transparent hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isAct ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                      isAct
                        ? 'bg-slate-950 text-amber-300'
                        : item.badgeColor || 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}

          {/* Smart Templates Quick CTA at Bottom of Sidebar */}
          <div className="pt-4 mt-auto">
            <button
              onClick={() => setTemplatesModalOpen(true)}
              className="w-full p-3 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/20 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-2 hover:border-amber-400 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="text-left">
                <div className="font-black text-white">Smart Templates</div>
                <div className="text-[10px] text-slate-400">Ready-made workflows</div>
              </div>
            </button>
          </div>
        </aside>

        {/* WORKSPACE CONTENT AREA */}
        <main className="flex-1 p-3 sm:p-5 overflow-y-auto bg-slate-950/70">
          {/* 1. MY DAY */}
          {activeTab === 'my-day' && (
            <OttMyDayView
              tasks={tasks}
              onSelectTask={(task) => {
                setSelectedTask(task);
                setDetailModalOpen(true);
              }}
              onStatusChange={handleUpdateStatus}
              onOpenSnooze={(task) => {
                setSelectedTask(task);
                setSnoozeModalOpen(true);
              }}
              onOpenSource={handleOpenSource}
              onOpenChatWithAssignee={handleOpenChatWithUser}
              onAddNewTask={() => setNewTaskModalOpen(true)}
              onOpenTemplates={() => setTemplatesModalOpen(true)}
              onAddSubtask={(taskId) => {
                setSelectedTask(tasks.find(t => t.id === taskId) || null);
                setDetailModalOpen(true);
              }}
              onSimulateCompleteCallback={(task) => handleUpdateStatus(task.id, 'COMPLETED')}
            />
          )}

          {/* 2. TASKS */}
          {activeTab === 'tasks' && (
            <OttTaskListView
              tasks={tasks}
              onSelectTask={(task) => {
                setSelectedTask(task);
                setDetailModalOpen(true);
              }}
              onStatusChange={handleUpdateStatus}
              onAddNewTask={() => setNewTaskModalOpen(true)}
              onOpenSource={handleOpenSource}
            />
          )}

          {/* 3. CALENDAR */}
          {activeTab === 'calendar' && (
            <OttCalendarView
              tasks={tasks}
              onSelectTask={(task) => {
                setSelectedTask(task);
                setDetailModalOpen(true);
              }}
              onAddNewTask={() => setNewTaskModalOpen(true)}
            />
          )}

          {/* 4. INBOX */}
          {activeTab === 'inbox' && (
            <OttAssignedView
              viewMode="INBOX"
              tasks={tasks}
              onSelectTask={(task) => {
                setSelectedTask(task);
                setDetailModalOpen(true);
              }}
              onStatusChange={handleUpdateStatus}
              onOpenChatWithAssignee={handleOpenChatWithUser}
              onOpenSource={handleOpenSource}
              onAssignNewTask={() => setAssignModalOpen(true)}
            />
          )}

          {/* 5. ASSIGNED TO ME */}
          {activeTab === 'assigned-to-me' && (
            <OttAssignedView
              viewMode="ASSIGNED_TO_ME"
              tasks={tasks}
              onSelectTask={(task) => {
                setSelectedTask(task);
                setDetailModalOpen(true);
              }}
              onStatusChange={handleUpdateStatus}
              onOpenChatWithAssignee={handleOpenChatWithUser}
              onOpenSource={handleOpenSource}
              onAssignNewTask={() => setAssignModalOpen(true)}
            />
          )}

          {/* 6. ASSIGNED BY ME */}
          {activeTab === 'assigned-by-me' && (
            <OttAssignedView
              viewMode="ASSIGNED_BY_ME"
              tasks={tasks}
              onSelectTask={(task) => {
                setSelectedTask(task);
                setDetailModalOpen(true);
              }}
              onStatusChange={handleUpdateStatus}
              onOpenChatWithAssignee={handleOpenChatWithUser}
              onOpenSource={handleOpenSource}
              onAssignNewTask={() => setAssignModalOpen(true)}
            />
          )}

          {/* 7. TODAY */}
          {activeTab === 'today' && (
            <OttTimeViews
              viewMode="TODAY"
              tasks={tasks}
              onSelectTask={(task) => {
                setSelectedTask(task);
                setDetailModalOpen(true);
              }}
              onStatusChange={handleUpdateStatus}
              onOpenSnooze={(task) => {
                setSelectedTask(task);
                setSnoozeModalOpen(true);
              }}
              onOpenSource={handleOpenSource}
            />
          )}

          {/* 8. UPCOMING */}
          {activeTab === 'upcoming' && (
            <OttTimeViews
              viewMode="UPCOMING"
              tasks={tasks}
              onSelectTask={(task) => {
                setSelectedTask(task);
                setDetailModalOpen(true);
              }}
              onStatusChange={handleUpdateStatus}
              onOpenSnooze={(task) => {
                setSelectedTask(task);
                setSnoozeModalOpen(true);
              }}
              onOpenSource={handleOpenSource}
            />
          )}

          {/* 9. OVERDUE */}
          {activeTab === 'overdue' && (
            <OttTimeViews
              viewMode="OVERDUE"
              tasks={tasks}
              onSelectTask={(task) => {
                setSelectedTask(task);
                setDetailModalOpen(true);
              }}
              onStatusChange={handleUpdateStatus}
              onOpenSnooze={(task) => {
                setSelectedTask(task);
                setSnoozeModalOpen(true);
              }}
              onOpenSource={handleOpenSource}
            />
          )}

          {/* 10. COMPLETED */}
          {activeTab === 'completed' && (
            <OttCompletedRecurringView
              viewMode="COMPLETED"
              tasks={tasks}
              onSelectTask={(task) => {
                setSelectedTask(task);
                setDetailModalOpen(true);
              }}
              onStatusChange={handleUpdateStatus}
              onOpenSource={handleOpenSource}
            />
          )}

          {/* 11. RECURRING */}
          {activeTab === 'recurring' && (
            <OttCompletedRecurringView
              viewMode="RECURRING"
              tasks={tasks}
              onSelectTask={(task) => {
                setSelectedTask(task);
                setDetailModalOpen(true);
              }}
              onStatusChange={handleUpdateStatus}
              onOpenSource={handleOpenSource}
            />
          )}

          {/* 12. FOLLOW-UPS */}
          {activeTab === 'follow-ups' && (
            <OttFollowUpsView
              onOpenChatWithAssignee={handleOpenChatWithUser}
            />
          )}

          {/* 13. APPROVALS */}
          {activeTab === 'approvals' && (
            <OttApprovalsView
              onOpenSource={handleOpenSource}
            />
          )}

          {/* 14. PROJECTS */}
          {activeTab === 'projects' && (
            <OttProjectsTeamsView
              viewMode="PROJECTS"
            />
          )}

          {/* 15. TEAMS */}
          {activeTab === 'teams' && (
            <OttProjectsTeamsView
              viewMode="TEAMS"
            />
          )}

          {/* 16. CATEGORIES */}
          {activeTab === 'categories' && (
            <OttNotificationsReportsSettingsView
              viewMode="CATEGORIES"
              tasks={tasks}
            />
          )}

          {/* 17. CROSS-PLATFORM BRIDGE */}
          {activeTab === 'bridge' && (
            <OttCrossPlatformBridgeView
              onInjectCrossPlatformTask={handleCreateTask}
              onOpenSource={handleOpenSource}
            />
          )}

          {/* 18. NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <OttNotificationsReportsSettingsView
              viewMode="NOTIFICATIONS"
              tasks={tasks}
            />
          )}

          {/* 19. REPORTS */}
          {activeTab === 'reports' && (
            <OttNotificationsReportsSettingsView
              viewMode="REPORTS"
              tasks={tasks}
            />
          )}

          {/* 20. SETTINGS */}
          {activeTab === 'settings' && (
            <OttNotificationsReportsSettingsView
              viewMode="SETTINGS"
              tasks={tasks}
            />
          )}
        </main>
      </div>

      {/* ALL MODALS */}
      <OttNewTaskModal
        isOpen={newTaskModalOpen}
        onClose={() => setNewTaskModalOpen(false)}
        onSave={handleCreateTask}
      />

      <OttAssignTaskModal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        onAssign={handleCreateTask}
      />

      <OttQuickReminderModal
        isOpen={reminderModalOpen}
        onClose={() => setReminderModalOpen(false)}
        onSave={handleCreateTask}
      />

      <OttSnoozeModal
        isOpen={snoozeModalOpen}
        onClose={() => setSnoozeModalOpen(false)}
        task={selectedTask}
        onSnooze={handleSnooze}
      />

      <OttTemplatesModal
        isOpen={templatesModalOpen}
        onClose={() => setTemplatesModalOpen(false)}
        onApplyTemplate={handleCreateTask}
      />

      <OttTaskDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        task={selectedTask}
        onStatusChange={handleUpdateStatus}
        onToggleSubtask={handleToggleSubtask}
        onAddSubtask={handleAddSubtask}
        onAddComment={handleAddComment}
        onOpenSource={handleOpenSource}
        onOpenChatWithAssignee={handleOpenChatWithUser}
        onOpenSnooze={(t) => {
          setSelectedTask(t);
          setSnoozeModalOpen(true);
        }}
      />
    </div>
  );
};
