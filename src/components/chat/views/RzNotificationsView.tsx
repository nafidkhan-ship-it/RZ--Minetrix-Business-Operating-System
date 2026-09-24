import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Clock,
  ShoppingBag,
  Briefcase,
  Landmark,
  MessageSquare,
  Users,
  Phone,
  Trash2,
  Check
} from 'lucide-react';
import { ChatNotificationItem, DEMO_NOTIFICATIONS } from '../../../data/rzChatData';

interface RzNotificationsViewProps {
  onOpenConversation: (convId: string) => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const RzNotificationsView: React.FC<RzNotificationsViewProps> = ({
  onOpenConversation,
  onNavigateSection
}) => {
  const [notifications, setNotifications] = useState<ChatNotificationItem[]>(DEMO_NOTIFICATIONS);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    showToast('All chat notifications marked as read');
  };

  const handleNotificationClick = (notif: ChatNotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
    );

    if (notif.conversationId) {
      onOpenConversation(notif.conversationId);
    } else if (notif.actionUrl && onNavigateSection) {
      onNavigateSection(notif.actionUrl);
    }
  };

  const getIcon = (type: ChatNotificationItem['type']) => {
    switch (type) {
      case 'ott_task':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-emerald-400" />;
      case 'marketplace':
        return <Briefcase className="w-4 h-4 text-purple-400" />;
      case 'land':
        return <Landmark className="w-4 h-4 text-cyan-400" />;
      case 'call':
        return <Phone className="w-4 h-4 text-rose-400" />;
      default:
        return <MessageSquare className="w-4 h-4 text-emerald-400" />;
    }
  };

  const filtered = notifications.filter((n) => {
    if (filterType === 'UNREAD') return !n.isRead;
    if (filterType === 'OTT') return n.type === 'ott_task';
    if (filterType === 'ORDERS') return n.type === 'order' || n.type === 'marketplace';
    return true;
  });

  return (
    <div className="h-full flex flex-col bg-slate-900 text-xs overflow-hidden">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 border border-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-white">Chat Notification Center</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              {notifications.filter((n) => !n.isRead).length} Unread
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Real-time triggers from RZ OTT tasks, materials orders, land negotiations & group chats
          </p>
        </div>

        <button
          onClick={markAllRead}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
        >
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/40 flex items-center gap-1.5">
        {[
          { id: 'ALL', label: 'All Alerts' },
          { id: 'UNREAD', label: 'Unread Only' },
          { id: 'OTT', label: 'RZ OTT Tasks' },
          { id: 'ORDERS', label: 'Orders & Deals' }
        ].map((tab) => {
          const isSel = filterType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer border ${
                isSel
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => handleNotificationClick(item)}
            className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start gap-3.5 group ${
              item.isRead
                ? 'bg-slate-950/50 border-slate-800/80 hover:bg-slate-800/30'
                : 'bg-slate-950/90 border-emerald-500/40 shadow-md hover:bg-slate-800/50'
            }`}
          >
            <div className="relative shrink-0">
              <img
                src={item.avatar}
                alt={item.title}
                className="w-10 h-10 rounded-2xl object-cover border border-slate-700"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                {getIcon(item.type)}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs group-hover:text-emerald-400 transition truncate">
                  {item.title}
                </span>
                <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-2">
                  {item.timeAgo}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                {item.body}
              </p>
            </div>

            {!item.isRead && (
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 self-center" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
