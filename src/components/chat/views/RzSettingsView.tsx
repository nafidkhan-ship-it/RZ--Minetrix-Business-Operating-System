import React, { useState } from 'react';
import {
  Settings,
  User,
  Shield,
  Bell,
  Lock,
  Moon,
  Smartphone,
  CheckCircle2,
  Database,
  Eye,
  Camera
} from 'lucide-react';

export const RzSettingsView: React.FC = () => {
  const [enterToSend, setEnterToSend] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [lastSeenPrivacy, setLastSeenPrivacy] = useState<'everyone' | 'contacts' | 'nobody'>('contacts');
  const [mediaAutoDownload, setMediaAutoDownload] = useState(true);
  const [ottTaskAlerts, setOttTaskAlerts] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

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
          <h2 className="text-base font-black text-white">Chat & Communication Settings</h2>
          <p className="text-[11px] text-slate-400">
            Account preferences, encryption, notification rules and RZ OTT automation bridges
          </p>
        </div>
      </div>

      {/* Main Settings Form */}
      <div className="flex-1 overflow-y-auto p-4 max-w-3xl space-y-6">
        {/* Profile Card */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="Account User"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/40"
              />
              <button
                onClick={() => showToast('Profile avatar upload open')}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center cursor-pointer shadow"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <h3 className="text-sm font-black text-white">RZ Operations Desk (Primary)</h3>
              <p className="text-[11px] text-slate-400 font-mono">+91 94470 00001 &bull; Kasaragod HQ</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                  Verified Ecosystem Admin
                </span>
                <span className="text-[10px] text-slate-500 font-mono">End-to-End Encrypted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messaging Behavior */}
        <div className="space-y-2">
          <span className="text-slate-400 font-bold text-xs uppercase tracking-wider font-mono">
            Messaging Preferences
          </span>
          <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-4 divide-y divide-slate-800/60">
            <div className="flex items-center justify-between py-2.5">
              <div>
                <div className="text-white font-bold text-xs">Enter Key Sends Message</div>
                <div className="text-[11px] text-slate-400">
                  Pressing Enter will immediately dispatch message. Shift+Enter creates a new line.
                </div>
              </div>
              <button
                onClick={() => {
                  setEnterToSend(!enterToSend);
                  showToast('Enter to send toggled');
                }}
                className={`w-10 h-6 rounded-full transition relative cursor-pointer ${
                  enterToSend ? 'bg-emerald-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition absolute top-1 ${
                    enterToSend ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-2.5">
              <div>
                <div className="text-white font-bold text-xs">Media Auto-Download on Wi-Fi</div>
                <div className="text-[11px] text-slate-400">
                  Automatically cache high-resolution drone geotiffs, CAD files & video inspections.
                </div>
              </div>
              <button
                onClick={() => {
                  setMediaAutoDownload(!mediaAutoDownload);
                  showToast('Media auto-download preference updated');
                }}
                className={`w-10 h-6 rounded-full transition relative cursor-pointer ${
                  mediaAutoDownload ? 'bg-emerald-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition absolute top-1 ${
                    mediaAutoDownload ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="space-y-2">
          <span className="text-slate-400 font-bold text-xs uppercase tracking-wider font-mono">
            Privacy & Trust
          </span>
          <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-4 divide-y divide-slate-800/60">
            <div className="flex items-center justify-between py-2.5">
              <div>
                <div className="text-white font-bold text-xs">Read Receipts (Blue Ticks)</div>
                <div className="text-[11px] text-slate-400">
                  Allow conversational partners to see when you have read their dispatch messages.
                </div>
              </div>
              <button
                onClick={() => {
                  setReadReceipts(!readReceipts);
                  showToast('Read receipts updated');
                }}
                className={`w-10 h-6 rounded-full transition relative cursor-pointer ${
                  readReceipts ? 'bg-emerald-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition absolute top-1 ${
                    readReceipts ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-2.5">
              <div>
                <div className="text-white font-bold text-xs">Last Seen & Online Presence</div>
                <div className="text-[11px] text-slate-400">
                  Choose who can see when you were last active on RZ Chat.
                </div>
              </div>
              <select
                value={lastSeenPrivacy}
                onChange={(e) => {
                  setLastSeenPrivacy(e.target.value as any);
                  showToast('Last seen visibility updated');
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium"
              >
                <option value="everyone">Everyone</option>
                <option value="contacts">My Contacts Only</option>
                <option value="nobody">Nobody</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cross-Platform OTT Automations */}
        <div className="space-y-2">
          <span className="text-slate-400 font-bold text-xs uppercase tracking-wider font-mono">
            Cross-Platform Bridges
          </span>
          <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-4 divide-y divide-slate-800/60">
            <div className="flex items-center justify-between py-2.5">
              <div>
                <div className="text-white font-bold text-xs">RZ® OTT Task Sync Notifications</div>
                <div className="text-[11px] text-slate-400">
                  Notify this chat whenever an assigned OTT task is completed by vehicle driver or pit team.
                </div>
              </div>
              <button
                onClick={() => {
                  setOttTaskAlerts(!ottTaskAlerts);
                  showToast('OTT task alerts toggled');
                }}
                className={`w-10 h-6 rounded-full transition relative cursor-pointer ${
                  ottTaskAlerts ? 'bg-emerald-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition absolute top-1 ${
                    ottTaskAlerts ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
