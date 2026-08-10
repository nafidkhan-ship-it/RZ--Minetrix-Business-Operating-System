import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldAlert,
  AlertTriangle,
  UserCheck,
  UserX,
  CheckCircle2,
  Clock,
  Filter,
  FileText,
  History,
  Shield,
  Search,
  Check,
  Ban
} from 'lucide-react';
import {
  ReportRecord,
  ReportStatus,
  ModerationAction,
  ChatUser,
  AuditLogRecord
} from '../types/rzChatTypes';
import { rzChatService } from '../services/rzChatService';

interface AdminModerationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModerationModal: React.FC<AdminModerationModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'reports' | 'moderation' | 'audit'>('reports');
  const [filterStatus, setFilterStatus] = useState<ReportStatus | 'all'>('pending');

  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportRecord | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Account Moderation State
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [selectedTargetUser, setSelectedTargetUser] = useState<ChatUser | null>(null);
  const [moderationAction, setModerationAction] = useState<ModerationAction>('restrict');
  const [moderationReason, setModerationReason] = useState('');

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const currentUser = rzChatService.getCurrentUser();

  const loadData = () => {
    const reps = rzChatService.getAllReportsForAdmin(
      currentUser.id,
      filterStatus === 'all' ? undefined : filterStatus
    );
    setReports([...reps]);

    const logs = rzChatService.getAllAuditLogsForAdmin(currentUser.id);
    setAuditLogs([...logs]);
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, filterStatus, activeTab]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleResolveReport = (reportId: string, resolution: 'resolved' | 'dismissed') => {
    try {
      rzChatService.resolveReport(currentUser.id, reportId, resolution, resolutionNotes.trim() || undefined);
      showToast(`Report #${reportId} marked as ${resolution.toUpperCase()}.`);
      setSelectedReport(null);
      setResolutionNotes('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update report.');
    }
  };

  const handleApplyAccountModeration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTargetUser) return;

    try {
      rzChatService.updateAccountStatusByAdmin(
        currentUser.id,
        selectedTargetUser.id,
        moderationAction,
        moderationReason.trim() || undefined
      );

      showToast(`Account status updated for ${selectedTargetUser.displayName} -> ${moderationAction.toUpperCase()}`);
      setSelectedTargetUser(null);
      setModerationReason('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update user account status.');
    }
  };

  const filteredUsers = rzChatService.getAllUsers().filter(u => {
    if (!searchUserQuery.trim()) return true;
    const q = searchUserQuery.toLowerCase();
    return u.displayName.toLowerCase().includes(q) || u.username.toLowerCase().includes(q) || u.id.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-amber-500/10 dark:bg-amber-950/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                Platform Moderation Portal
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 text-xs font-bold">
                  Admin Access
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                User reports review, account status enforcement &amp; platform security audits
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
          <div className="bg-emerald-50 dark:bg-emerald-950/50 border-b border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs px-6 py-2 flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            {toastMessage}
          </div>
        )}

        {/* Tab Switcher */}
        <div className="px-6 pt-3 pb-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
          {[
            { id: 'reports', label: 'User Reports Queue', icon: FileText },
            { id: 'moderation', label: 'Account Enforcement', icon: Ban },
            { id: 'audit', label: 'Global Audit Logs', icon: History }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* TAB 1: REPORTS QUEUE */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              {/* Filter Sub-bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
                  <Filter className="w-3 h-3" /> Status Filter:
                </span>
                {(['pending', 'resolved', 'dismissed', 'all'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-3 py-1 rounded-full text-xs capitalize font-medium transition-all shrink-0 ${
                      filterStatus === st
                        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {reports.length === 0 ? (
                <div className="py-12 text-center text-slate-400 dark:text-slate-500 flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-10 h-10 stroke-1 text-emerald-500 opacity-60" />
                  <p className="text-sm font-medium">No reports found matching this filter.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reports.map(rep => (
                    <div
                      key={rep.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                        rep.status === 'pending'
                          ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50'
                          : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[10px] text-slate-400 font-bold">
                            #{rep.id}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                              rep.status === 'pending'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : rep.status === 'resolved'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {rep.status}
                          </span>
                        </div>

                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            Target: {rep.reportedUserDisplayName}
                          </div>
                          <div className="text-[11px] text-red-600 dark:text-red-400 font-semibold uppercase mt-0.5">
                            Reason: {rep.reason.replace(/_/g, ' ')}
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                          "{rep.description}"
                        </p>

                        {rep.resolutionNotes && (
                          <div className="text-[11px] text-slate-500 italic">
                            Admin Note: {rep.resolutionNotes}
                          </div>
                        )}
                      </div>

                      {rep.status === 'pending' && (
                        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedReport(rep);
                            }}
                            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-bold transition-colors"
                          >
                            Review &amp; Action
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ACCOUNT ENFORCEMENT */}
          {activeTab === 'moderation' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Selector */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Select User Account
                </h3>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchUserQuery}
                    onChange={e => setSearchUserQuery(e.target.value)}
                    placeholder="Search name or username..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  />
                </div>

                <div className="max-h-60 overflow-y-auto border rounded-xl border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.map(u => (
                    <button
                      type="button"
                      key={u.id}
                      onClick={() => setSelectedTargetUser(u)}
                      className={`w-full p-3 text-left transition-colors flex items-center justify-between ${
                        selectedTargetUser?.id === u.id
                          ? 'bg-amber-50 dark:bg-amber-950/40 border-l-4 border-amber-500'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {u.displayName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          @{u.username} · {u.accountCategory}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          u.accountStatus === 'active'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                        }`}
                      >
                        {u.accountStatus}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Form */}
              <form onSubmit={handleApplyAccountModeration} className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Moderation Enforcement Action
                </h3>

                {selectedTargetUser ? (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900 text-xs">
                    Target: <span className="font-bold">{selectedTargetUser.displayName}</span> (Current Status: <span className="uppercase font-bold">{selectedTargetUser.accountStatus}</span>)
                  </div>
                ) : (
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs text-slate-400">
                    Select a user account from the left list to apply moderation.
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Enforcement Action
                  </label>
                  <select
                    value={moderationAction}
                    onChange={e => setModerationAction(e.target.value as ModerationAction)}
                    disabled={!selectedTargetUser}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none"
                  >
                    <option value="restrict">Restrict (Limit message volume &amp; features)</option>
                    <option value="suspend">Suspend Account (Temporary lockout)</option>
                    <option value="ban">Ban Account (Permanent platform ban)</option>
                    <option value="unsuspend">Unsuspend / Reactivate Active Status</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Compliance &amp; Reason Explanation
                  </label>
                  <textarea
                    value={moderationReason}
                    onChange={e => setModerationReason(e.target.value)}
                    disabled={!selectedTargetUser}
                    placeholder="Provide official compliance reason..."
                    rows={3}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!selectedTargetUser}
                  className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg transition-colors disabled:opacity-50"
                >
                  Apply Moderation Status Change
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: GLOBAL AUDIT LOGS */}
          {activeTab === 'audit' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <History className="w-4 h-4 text-amber-600" /> Platform Audit Trail ({auditLogs.length})
              </h3>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {auditLogs.map(log => (
                  <div
                    key={log.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        {log.actorName} · <span className="capitalize text-amber-600 dark:text-amber-400">[{log.action.replace(/_/g, ' ')}]</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-xs mt-0.5">
                        {log.details}
                      </p>
                    </div>
                    <div className="text-[10px] text-slate-400 shrink-0 text-right">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      <br />
                      {new Date(log.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Prompt for Report Action */}
        {selectedReport && (
          <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl max-w-md w-full space-y-4 border border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Resolve Report #{selectedReport.id}
              </h3>
              <p className="text-xs text-slate-500">
                Target: {selectedReport.reportedUserDisplayName} ({selectedReport.reason})
              </p>

              <textarea
                value={resolutionNotes}
                onChange={e => setResolutionNotes(e.target.value)}
                placeholder="Enter resolution / dismissal notes..."
                rows={3}
                className="w-full p-2 bg-slate-100 dark:bg-slate-800 border rounded-lg text-xs"
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleResolveReport(selectedReport.id, 'dismissed')}
                  className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-xs font-bold rounded-lg"
                >
                  Dismiss Report
                </button>
                <button
                  onClick={() => handleResolveReport(selectedReport.id, 'resolved')}
                  className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg"
                >
                  Mark Resolved
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between text-xs text-slate-500">
          <span>RZ Minetrix Admin Security Officer Portal</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
