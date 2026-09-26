import React, { useCallback, useEffect, useState } from 'react';
import { Bell, CheckCheck, RefreshCw } from 'lucide-react';
import { apiClient } from '../services/apiClient';

export const NotificationLiveFeedPanel: React.FC<{ onToast: (msg: string) => void }> = ({ onToast }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const loadNotifications = useCallback(async () => {
    if (!apiClient.getAuthToken()) {
      setError('Login via Shared Core Implementation to load notifications.');
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    setLoading(true);
    setError(null);
    const res = await apiClient.getNotifications();
    if (res.success && res.data) {
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } else {
      setError(res.message || 'Failed to load notifications');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleMarkRead = async (id: string) => {
    const res = await apiClient.markNotificationRead(id);
    if (res.success) await loadNotifications();
    else onToast(res.message || 'Failed to mark read');
  };

  const handleMarkAll = async () => {
    const res = await apiClient.markAllNotificationsRead();
    if (res.success) {
      onToast(`Marked ${res.data?.markedCount ?? 0} notifications read`);
      await loadNotifications();
    } else onToast(res.message || 'Failed');
  };

  const handleCreate = async () => {
    if (!title.trim()) return;
    const res = await apiClient.createNotification({ title: title.trim(), body: body.trim(), type: 'INFO' });
    if (res.success) {
      setTitle('');
      setBody('');
      onToast('Notification created');
      await loadNotifications();
    } else onToast(res.message || 'Failed to create notification');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-400" />
            Live Notification Feed (PostgreSQL)
          </h3>
          <p className="text-slate-400 text-xs mt-1">Tenant-isolated in-app notifications with read/unread state.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleMarkAll} className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-2 cursor-pointer">
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
          <button onClick={() => loadNotifications()} className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-2 cursor-pointer">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-sm">{error}</div>}

      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap gap-2 items-end">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notification title" className="flex-1 min-w-[200px] px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white" />
        <input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Message" className="flex-1 min-w-[200px] px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white" />
        <button onClick={handleCreate} className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold cursor-pointer">Create</button>
      </div>

      <div className="text-xs text-slate-400">Unread: <strong className="text-emerald-400">{unreadCount}</strong></div>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {notifications.length === 0 && !error && (
          <div className="p-6 text-center text-slate-500 text-sm border border-slate-800 rounded-xl">No notifications yet.</div>
        )}
        {notifications.map((n) => (
          <div key={n.id} className={`p-3 rounded-xl border ${n.isRead ? 'bg-slate-900/50 border-slate-800' : 'bg-emerald-950/30 border-emerald-500/30'}`}>
            <div className="flex justify-between gap-2">
              <div>
                <strong className="text-white text-sm">{n.title}</strong>
                <p className="text-slate-400 text-xs mt-1">{n.body}</p>
                {n.relatedModule && (
                  <span className="text-[10px] text-slate-500 mt-1 block">{n.relatedModule} / {n.relatedRecordType}</span>
                )}
              </div>
              {!n.isRead && (
                <button onClick={() => handleMarkRead(n.id)} className="text-xs text-emerald-400 font-bold shrink-0 cursor-pointer">Mark read</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
