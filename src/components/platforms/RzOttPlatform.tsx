import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  BarChart3,
  Users,
  Bell,
  Sparkles,
  Zap,
  Tag,
  CheckSquare,
  ListTodo,
  TrendingUp,
  Share2,
  FolderKanban,
  Repeat,
  Settings,
  HelpCircle,
  Eye,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { SectionId } from '../../types/architecture';
import { OttPlatformSection } from '../ott/OttPlatformSection';
import { QuickActionModal } from '../QuickActionModal';

interface RzOttPlatformProps {
  onNavigateSection?: (sectionId: SectionId) => void;
}

export type OttSubpageId =
  | 'my-day'
  | 'today'
  | 'tomorrow'
  | 'upcoming'
  | 'calendar'
  | 'tasks'
  | 'task-requests'
  | 'connections'
  | 'workspaces'
  | 'checklists'
  | 'time-management'
  | 'daily-planner'
  | 'reminders'
  | 'notifications'
  | 'follow-ups'
  | 'automation'
  | 'reports'
  | 'analytics'
  | 'rz-ecosystem'
  | 'api'
  | 'settings';

export const RzOttPlatform: React.FC<RzOttPlatformProps> = ({
  onNavigateSection
}) => {
  const [activePage, setActivePage] = useState<OttSubpageId>('my-day');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [quickActionOpen, setQuickActionOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // 21 Subpages in exact specified order
  const SUBPAGES: { id: OttSubpageId; number: number; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'my-day', number: 1, label: 'My Day', icon: Sparkles },
    { id: 'today', number: 2, label: 'Today', icon: Clock },
    { id: 'tomorrow', number: 3, label: 'Tomorrow', icon: Calendar },
    { id: 'upcoming', number: 4, label: 'Upcoming', icon: Calendar },
    { id: 'calendar', number: 5, label: 'Calendar', icon: Calendar },
    { id: 'tasks', number: 6, label: 'All Tasks', icon: ListTodo },
    { id: 'task-requests', number: 7, label: 'Task Requests', icon: Users },
    { id: 'connections', number: 8, label: 'Connections', icon: Users },
    { id: 'workspaces', number: 9, label: 'Workspaces', icon: FolderKanban },
    { id: 'checklists', number: 10, label: 'Checklists', icon: CheckSquare },
    { id: 'time-management', number: 11, label: 'Time Management', icon: Clock },
    { id: 'daily-planner', number: 12, label: 'Daily Planner', icon: Calendar },
    { id: 'reminders', number: 13, label: 'Reminders', icon: Bell },
    { id: 'notifications', number: 14, label: 'Notifications', icon: Bell },
    { id: 'follow-ups', number: 15, label: 'Follow-ups', icon: Repeat },
    { id: 'automation', number: 16, label: 'Automation', icon: Zap },
    { id: 'reports', number: 17, label: 'Reports', icon: BarChart3 },
    { id: 'analytics', number: 18, label: 'Analytics', icon: TrendingUp },
    { id: 'rz-ecosystem', number: 19, label: 'RZ Ecosystem Sync', icon: Share2 },
    { id: 'api', number: 20, label: 'API & Webhooks', icon: Zap },
    { id: 'settings', number: 21, label: 'Settings', icon: Settings }
  ];

  // Map active subpage to OttSecondaryTab
  const mapSubpageToSecondaryTab = (page: OttSubpageId): any => {
    switch (page) {
      case 'my-day': return 'my-day';
      case 'today': return 'today';
      case 'tomorrow':
      case 'upcoming': return 'upcoming';
      case 'calendar':
      case 'daily-planner':
      case 'time-management': return 'calendar';
      case 'tasks':
      case 'checklists': return 'tasks';
      case 'task-requests': return 'inbox';
      case 'connections': return 'teams';
      case 'workspaces': return 'projects';
      case 'reminders': return 'my-day';
      case 'notifications': return 'notifications';
      case 'follow-ups': return 'follow-ups';
      case 'automation': return 'recurring';
      case 'reports':
      case 'analytics': return 'reports';
      case 'rz-ecosystem':
      case 'api': return 'bridge';
      case 'settings': return 'settings';
      default: return 'my-day';
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-500 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 border border-amber-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Quick Action Modal */}
      <QuickActionModal
        isOpen={quickActionOpen}
        onClose={() => setQuickActionOpen(false)}
        defaultAction="TASK"
        onNavigate={onNavigateSection}
      />

      {/* Platform Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                PLATFORM 9 &bull; ORGANISER OS
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                Universal Free App
              </span>
            </div>
            <h1 className="text-xl font-black text-white">RZ® OTT — Organise Today &amp; Tomorrow</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuickActionOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Quick Action</span>
          </button>
        </div>
      </div>

      {/* 21-PAGE SUBNAVIGATOR (Scrollable tabs with numbers) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2 shadow-inner overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {SUBPAGES.map((page) => {
            const isAct = activePage === page.id;
            const Icon = page.icon;
            return (
              <button
                key={page.id}
                onClick={() => {
                  setActivePage(page.id);
                  showToast(`Opened ${page.label}`);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border cursor-pointer ${
                  isAct
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md'
                    : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span className="text-[10px] font-mono opacity-80">{page.number}.</span>
                <Icon className="w-3.5 h-3.5" />
                <span>{page.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Embedded Full RZ OTT Platform */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <OttPlatformSection
          initialTab={mapSubpageToSecondaryTab(activePage)}
          onNavigateSection={onNavigateSection}
        />
      </div>
    </div>
  );
};
