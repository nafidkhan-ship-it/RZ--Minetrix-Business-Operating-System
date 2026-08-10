import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  Lock,
  Smartphone,
  UserX,
  Bell,
  Eye,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  Clock,
  History,
  KeyRound,
  FileText,
  Volume2,
  VolumeX,
  SmartphoneNfc
} from 'lucide-react';
import {
  PrivacySettings,
  NotificationPreferences,
  UserDevice,
  ChatUser,
  AuditLogRecord
} from '../types/rzChatTypes';
import { rzChatService } from '../services/rzChatService';

interface PrivacySecurityCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacySecurityCenterModal: React.FC<PrivacySecurityCenterModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'notifications' | 'sessions' | 'blocked' | 'audit'>('privacy');

  const currentUser = rzChatService.getCurrentUser();

  // Local States
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(
    rzChatService.getUserPrivacySettings(currentUser.id)
  );
  const [notifPreferences, setNotifPreferences] = useState<NotificationPreferences>(
    rzChatService.getUserNotificationPreferences(currentUser.id)
  );
  const [devices, setDevices] = useState<UserDevice[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<ChatUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadAllData = () => {
    setPrivacySettings(rzChatService.getUserPrivacySettings(currentUser.id));
    setNotifPreferences(rzChatService.getUserNotificationPreferences(currentUser.id));
    setDevices(rzChatService.getUserDevices(currentUser.id));
    setBlockedUsers(rzChatService.getBlockedUsersForUser(currentUser.id));
    setAuditLogs(rzChatService.getUserSecurityAuditTrail(currentUser.id));
  };

  useEffect(() => {
    if (isOpen) {
      loadAllData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdatePrivacy = (updates: Partial<PrivacySettings>) => {
    const updated = rzChatService.updateUserPrivacySettings(currentUser.id, updates);
    setPrivacySettings({ ...updated });
    showToast('Privacy settings saved.');
  };

  const handleToggleNotifPref = (key: keyof NotificationPreferences) => {
    if (key === 'securityAlerts') return; // Mandatory locked

    const currentVal = notifPreferences[key];
    const updated = rzChatService.updateUserNotificationPreferences(currentUser.id, {
      [key]: !currentVal
    });
    setNotifPreferences({ ...updated });
    showToast('Notification preferences updated.');
  };

  const handleSignOutDevice = (deviceId: string) => {
    const ok = rzChatService.signOutDevice(currentUser.id, deviceId);
    if (ok) {
      setDevices(rzChatService.getUserDevices(currentUser.id));
      showToast('Device session terminated.');
    }
  };

  const handleSignOutAllOtherDevices = () => {
    const count = rzChatService.signOutAllOtherDevices(currentUser.id);
    setDevices(rzChatService.getUserDevices(currentUser.id));
    showToast(`Successfully terminated ${count} other active sessions.`);
  };

  const handleUnblockUser = (targetUserId: string) => {
    const ok = rzChatService.unblockUser(currentUser.id, targetUserId);
    if (ok) {
      setBlockedUsers(rzChatService.getBlockedUsersForUser(currentUser.id));
      showToast('User unblocked successfully.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Privacy &amp; Security Center
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Account privacy, session management, block list &amp; audit trail
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
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {toastMessage}
            </span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="px-6 pt-3 pb-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-1 overflow-x-auto">
          {[
            { id: 'privacy', label: 'Privacy Controls', icon: Lock },
            { id: 'notifications', label: 'Alert Prefs', icon: Bell },
            { id: 'sessions', label: `Sessions (${devices.length})`, icon: Smartphone },
            { id: 'blocked', label: `Blocked (${blockedUsers.length})`, icon: UserX },
            { id: 'audit', label: 'Security Trail', icon: History }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Body Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: PRIVACY CONTROLS */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600" /> Direct Messaging Access
                </h3>
                <p className="text-xs text-slate-500">
                  Control who can initiate direct messaging conversations with your account.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: 'everyone', label: 'Everyone', desc: 'Any public user can message you' },
                    { value: 'contacts', label: 'Contacts Only', desc: 'Only saved contacts can chat' },
                    { value: 'nobody', label: 'Nobody', desc: 'Block all new incoming messages' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => handleUpdatePrivacy({ whoCanMessageMe: opt.value as any })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        privacySettings.whoCanMessageMe === opt.value
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center justify-between">
                        {opt.label}
                        {privacySettings.whoCanMessageMe === opt.value && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        {opt.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Profile Visibility Items */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-600" /> Visibility Settings
                </h3>

                <div className="divide-y divide-slate-200 dark:divide-slate-800 border rounded-xl border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-800/30">
                  {/* Last Seen */}
                  <div className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Last Seen &amp; Online Status</div>
                      <div className="text-[11px] text-slate-500">Who can see when you were last online</div>
                    </div>
                    <select
                      value={privacySettings.lastSeen}
                      onChange={e => handleUpdatePrivacy({ lastSeen: e.target.value as any })}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-slate-100"
                    >
                      <option value="everyone">Everyone</option>
                      <option value="contacts">Contacts Only</option>
                      <option value="nobody">Nobody</option>
                    </select>
                  </div>

                  {/* Profile Photo */}
                  <div className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Profile Photo</div>
                      <div className="text-[11px] text-slate-500">Who can view your display avatar</div>
                    </div>
                    <select
                      value={privacySettings.profilePhoto}
                      onChange={e => handleUpdatePrivacy({ profilePhoto: e.target.value as any })}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-slate-100"
                    >
                      <option value="everyone">Everyone</option>
                      <option value="contacts">Contacts Only</option>
                      <option value="nobody">Nobody</option>
                    </select>
                  </div>

                  {/* About / Bio */}
                  <div className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">About / Bio Information</div>
                      <div className="text-[11px] text-slate-500">Who can read your bio details</div>
                    </div>
                    <select
                      value={privacySettings.about}
                      onChange={e => handleUpdatePrivacy({ about: e.target.value as any })}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-slate-100"
                    >
                      <option value="everyone">Everyone</option>
                      <option value="contacts">Contacts Only</option>
                      <option value="nobody">Nobody</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NOTIFICATION PREFERENCES */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/50 text-xs text-blue-900 dark:text-blue-300 flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Configure in-app sound, vibration &amp; push alert toggles per notification class.</span>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-slate-800 border rounded-xl border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-800/30">
                {[
                  { key: 'directMessages', title: 'Direct Messages', desc: 'Alerts for one-on-one chat messages' },
                  { key: 'groupMessages', title: 'Group Chat Messages', desc: 'Alerts for messages in group channels' },
                  { key: 'mentions', title: 'User Mentions (@you)', desc: 'Alerts when mentioned in conversations' },
                  { key: 'businessMessages', title: 'Business Chat Messages', desc: 'Commercial communication alerts' },
                  { key: 'enquiries', title: 'Customer Enquiries', desc: 'New customer enquiry submissions' },
                  { key: 'orderUpdates', title: 'ERP Order Status Updates', desc: 'ERP aggregate purchase order changes' },
                  { key: 'dispatchUpdates', title: 'Quarry Dispatch Tracking', desc: 'Truck load & weighbridge dispatch updates' },
                  { key: 'invoiceUpdates', title: 'ERP Invoices & GST Bills', desc: 'Invoice generation & tax receipts' },
                  { key: 'paymentUpdates', title: 'Payment Confirmations', desc: 'ERP receipt & payment verifications' },
                  { key: 'securityAlerts', title: 'Security & Login Alerts', desc: 'New device login alerts (Mandatory)', mandatory: true },
                  { key: 'soundEnabled', title: 'Notification Sound Effect', desc: 'Play audio sound on incoming alert' },
                  { key: 'vibrationEnabled', title: 'Haptic Vibration', desc: 'Vibrate device on notification delivery' }
                ].map(item => {
                  const isChecked = notifPreferences[item.key as keyof NotificationPreferences];
                  const isMandatory = item.mandatory;

                  return (
                    <div key={item.key} className="p-4 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          {item.title}
                          {isMandatory && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold">
                              Mandatory
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500">{item.desc}</div>
                      </div>

                      <button
                        disabled={isMandatory}
                        onClick={() => handleToggleNotifPref(item.key as any)}
                        className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-1 ${
                          isChecked ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                        } ${isMandatory ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${
                            isChecked ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: SESSIONS & ACTIVE DEVICES */}
          {activeTab === 'sessions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Active Account Sessions ({devices.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Active devices logged into your RZ Chat &amp; ERP account
                  </p>
                </div>
                {devices.length > 1 && (
                  <button
                    onClick={handleSignOutAllOtherDevices}
                    className="px-3 py-1.5 bg-red-50 dark:bg-red-950/50 hover:bg-red-100 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out All Other Devices
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {devices.map(dev => (
                  <div
                    key={dev.id}
                    className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                      dev.isCurrent
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                        : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          {dev.deviceName}
                          {dev.isCurrent && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 text-[10px] font-bold">
                              Current Session
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-3 flex-wrap">
                          <span>IP: {dev.ipAddress}</span>
                          <span>App: {dev.appVersion}</span>
                          <span>Active: {new Date(dev.lastActiveAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>

                    {!dev.isCurrent && (
                      <button
                        onClick={() => handleSignOutDevice(dev.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors shrink-0"
                      >
                        Terminate
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BLOCKED USERS */}
          {activeTab === 'blocked' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Blocked Users List ({blockedUsers.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Blocked accounts cannot send messages or view your profile updates.
                </p>
              </div>

              {blockedUsers.length === 0 ? (
                <div className="py-12 text-center text-slate-400 dark:text-slate-500 flex flex-col items-center gap-2">
                  <UserX className="w-10 h-10 stroke-1 opacity-50" />
                  <p className="text-sm font-medium">No blocked users.</p>
                  <p className="text-xs text-slate-400">You haven't blocked anyone on RZ Chat.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200 dark:divide-slate-800 border rounded-xl border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-800/30">
                  {blockedUsers.map(usr => (
                    <div key={usr.id} className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-200">
                          {usr.displayName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            {usr.displayName}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            @{usr.username}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleUnblockUser(usr.id)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors"
                      >
                        Unblock User
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SECURITY AUDIT TRAIL */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <History className="w-4 h-4 text-emerald-600" /> Personal Security Audit Trail
                </h3>
                <p className="text-xs text-slate-500">
                  Immutable security event log of account logins, setting changes &amp; moderation activity.
                </p>
              </div>

              <div className="space-y-2">
                {auditLogs.map(log => (
                  <div
                    key={log.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-slate-100 capitalize">
                          [{log.action.replace(/_/g, ' ')}]
                        </span>
                        <span className="text-slate-400 font-mono text-[10px]">
                          #{log.id}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-xs">
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

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between text-xs text-slate-500">
          <span>RZ Security &amp; Compliance Boundary Shield</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
