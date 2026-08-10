import React, { useState, useEffect } from 'react';
import {
  X,
  Bell,
  MessageSquare,
  Building2,
  Database,
  ShieldAlert,
  CheckCheck,
  Trash2,
  ExternalLink,
  Smartphone,
  CheckCircle2,
  Filter,
  Info
} from 'lucide-react';
import { NotificationRecord, NotificationCategory } from '../types/rzChatTypes';
import { rzChatService } from '../services/rzChatService';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToConversation?: (conversationId: string) => void;
  onNavigateToEnquiry?: (enquiryId: string) => void;
  onNavigateToBusiness?: (businessId: string) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  onNavigateToConversation,
  onNavigateToEnquiry,
  onNavigateToBusiness
}) => {
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory | 'all'>('all');
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'notifications' | 'push_logs'>('notifications');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentUser = rzChatService.getCurrentUser();

  const loadData = () => {
    const list = rzChatService.getNotificationsForUser(currentUser.id, selectedCategory);
    setNotifications([...list]);
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, selectedCategory]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleMarkAsRead = (id: string) => {
    rzChatService.markNotificationAsRead(currentUser.id, id);
    loadData();
  };

  const handleMarkAllRead = () => {
    rzChatService.markAllNotificationsAsRead(currentUser.id);
    loadData();
    showToast('All notifications marked as read.');
  };

  const handleCleanupOld = () => {
    const cleaned = rzChatService.cleanupOldNotifications(currentUser.id, 30);
    loadData();
    showToast(`Cleaned up ${cleaned} notifications older than 30 days.`);
  };

  const handleNotificationClick = (notif: NotificationRecord) => {
    if (!notif.isRead) {
      rzChatService.markNotificationAsRead(currentUser.id, notif.id);
    }

    if (notif.relatedConversationId && onNavigateToConversation) {
      onNavigateToConversation(notif.relatedConversationId);
      onClose();
    } else if (notif.relatedEnquiryId && onNavigateToEnquiry) {
      onNavigateToEnquiry(notif.relatedEnquiryId);
      onClose();
    } else if (notif.relatedBusinessId && onNavigateToBusiness) {
      onNavigateToBusiness(notif.relatedBusinessId);
      onClose();
    }
  };

  const getCategoryBadge = (category: NotificationCategory) => {
    switch (category) {
      case 'chat':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
            <MessageSquare className="w-3 h-3" /> Chat
          </span>
        );
      case 'business':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            <Building2 className="w-3 h-3" /> Business
          </span>
        );
      case 'erp':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <Database className="w-3 h-3" /> ERP
          </span>
        );
      case 'system':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
            <ShieldAlert className="w-3 h-3" /> System
          </span>
        );
    }
  };

  const unreadCount = rzChatService.getUnreadNotificationCount(currentUser.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                Notification Center
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                In-app alerts, push notifications & ERP updates
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="bg-emerald-50 dark:bg-emerald-950/50 border-b border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs px-6 py-2 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {toastMessage}
            </span>
          </div>
        )}

        {/* View Switcher & Action Bar */}
        <div className="px-6 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'notifications'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              In-App Center ({notifications.length})
            </button>
            <button
              onClick={() => setActiveTab('push_logs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'push_logs'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> Push Logs & Delivery
            </button>
          </div>

          {activeTab === 'notifications' && (
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="px-2.5 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-md transition-colors flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" /> Mark All Read
                </button>
              )}
              <button
                onClick={handleCleanupOld}
                className="px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors flex items-center gap-1"
                title="Clean up notifications older than 30 days"
              >
                <Trash2 className="w-3.5 h-3.5" /> Auto-Purge (&gt;30d)
              </button>
            </div>
          )}
        </div>

        {/* Category Filters for Notifications */}
        {activeTab === 'notifications' && (
          <div className="px-6 py-2 bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {(['all', 'chat', 'business', 'erp', 'system'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs capitalize font-medium transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {activeTab === 'notifications' ? (
            notifications.length === 0 ? (
              <div className="py-12 text-center text-slate-400 dark:text-slate-500 flex flex-col items-center gap-2">
                <Bell className="w-10 h-10 stroke-1 opacity-50" />
                <p className="text-sm font-medium">No notifications in this category.</p>
                <p className="text-xs text-slate-400">All caught up! New message &amp; ERP alerts will appear here.</p>
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  className={`p-4 rounded-xl border transition-all relative group ${
                    !n.isRead
                      ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50 shadow-sm'
                      : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        {getCategoryBadge(n.category)}
                        {!n.isRead && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                        )}
                        {n.groupCount && n.groupCount > 1 && (
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-[10px] font-bold">
                            {n.groupCount} Grouped Alerts
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400 ml-auto">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {n.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                        {n.body}
                      </p>

                      {/* Deep Link Action Button */}
                      {(n.relatedConversationId || n.relatedEnquiryId || n.relatedBusinessId) && (
                        <button
                          onClick={() => handleNotificationClick(n)}
                          className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          {n.relatedConversationId
                            ? 'Open Chat Conversation'
                            : n.relatedEnquiryId
                            ? 'View Customer Enquiry'
                            : 'View Business Profile'}
                        </button>
                      )}
                    </div>

                    {!n.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(n.id)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors shrink-0"
                        title="Mark as read"
                      >
                        <CheckCheck className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )
          ) : (
            /* Push Notification Logs View */
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">Push Delivery Foundation:</span>
                  <p className="mt-0.5">
                    Simulates FCM/APNs push notification dispatch across your active registered devices. Payloads strip sensitive accounting details automatically for lockscreen safety.
                  </p>
                </div>
              </div>

              {rzChatService.getUserDevices(currentUser.id).map(dev => (
                <div
                  key={dev.id}
                  className="p-3.5 bg-white dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-blue-600" />
                      {dev.deviceName}
                      <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-[10px] uppercase font-bold">
                        {dev.platform}
                      </span>
                    </div>
                    <p className="text-slate-400 font-mono text-[10px] mt-1">
                      Push Token: {dev.pushToken}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> FCM Connected
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between text-xs text-slate-500">
          <span>RZ Minetrix ERP + RZ Chat Phase 34 Engine</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
