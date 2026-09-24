import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Globe,
  Bell,
  FileText,
  Clock,
  Layers,
  Search,
  Download
} from 'lucide-react';
import { DEMO_AUDIT_LOGS, DEMO_COMPANY_PROFILE } from '../data/orgDemoData';
import { AuditLogItem } from '../types';

export const OrgSettingsAuditView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'branding' | 'notifications' | 'audit'>('general');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [searchAudit, setSearchAudit] = useState('');

  // Notification toggles state
  const [notifications, setNotifications] = useState({
    tasks: true,
    orders: true,
    payments: true,
    invoices: true,
    approvals: true,
    staff: true,
    subscription: true,
    system: false
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    showToast(`Updated notification preferences for: ${String(key)}`);
  };

  const filteredLogs = DEMO_AUDIT_LOGS.filter(log =>
    log.user.toLowerCase().includes(searchAudit.toLowerCase()) ||
    log.action.toLowerCase().includes(searchAudit.toLowerCase()) ||
    log.module.toLowerCase().includes(searchAudit.toLowerCase()) ||
    log.details.toLowerCase().includes(searchAudit.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold">
              SETTINGS &bull; BRANDING &bull; IMMUTABLE AUDIT LOGS
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
              Studio Preview / Demo Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <Settings className="w-6 h-6 text-purple-400" />
            <span>Organization Settings &amp; Security Audit Trail</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Configure enterprise localization, invoice document branding headers, automated alert rules, and examine the compliance audit trail.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveSubTab('general')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              activeSubTab === 'general' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            General &amp; Locale
          </button>
          <button
            onClick={() => setActiveSubTab('branding')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              activeSubTab === 'branding' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Branding Studio
          </button>
          <button
            onClick={() => setActiveSubTab('notifications')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              activeSubTab === 'notifications' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Notifications
          </button>
          <button
            onClick={() => setActiveSubTab('audit')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              activeSubTab === 'audit' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Audit Trail ({DEMO_AUDIT_LOGS.length})
          </button>
        </div>
      </div>

      {/* 1. GENERAL & LOCALIZATION */}
      {activeSubTab === 'general' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-400" />
              <span>Localization &amp; Regional Formats</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Base Currency</label>
                <input
                  type="text"
                  defaultValue="INR (₹) — Indian Rupee"
                  readOnly
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Standard Number Format</label>
                <input
                  type="text"
                  defaultValue="Indian numbering system (Lakhs & Crores: ₹1,00,000)"
                  readOnly
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Fiscal Date Format</label>
                <input
                  type="text"
                  defaultValue="DD/MM/YYYY (e.g. 21/02/2026)"
                  readOnly
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Timezone</label>
                <input
                  type="text"
                  defaultValue="Asia/Kolkata (IST — UTC+05:30)"
                  readOnly
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Tax Configuration &amp; Auto-Sequences</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">GST Tax Invoicing Engine</label>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                  Automated CGST (2.5%) + SGST (2.5%) for Intra-State (Kerala), IGST (5%) for Inter-State dispatch.
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Weighbridge Ticket Number Sequence</label>
                <input
                  type="text"
                  defaultValue="WB-2026-#### (Auto-Incrementing)"
                  readOnly
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Commercial Gate Pass Sequence</label>
                <input
                  type="text"
                  defaultValue="GP-OUT-2026-#### (Auto-Incrementing)"
                  readOnly
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. BRANDING STUDIO */}
      {activeSubTab === 'branding' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="font-bold text-white text-base">Corporate Branding Studio</h3>
            <p className="text-xs text-slate-400">
              Customize logos, print document headers, and letterhead styles rendered across all 10 platforms and ERP tax vouchers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-slate-400 block text-xs mb-1">Primary Organization Logo</label>
                <div className="p-6 rounded-2xl bg-slate-950 border border-dashed border-slate-800 flex flex-col items-center justify-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black">
                    RZ
                  </div>
                  <span className="text-xs font-bold text-white">RZ_MINETRIX_VECTOR_LOGO.SVG</span>
                  <button
                    onClick={() => showToast('Uploaded new corporate brand asset')}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-purple-400" />
                    <span>Replace Logo</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block text-xs mb-1">Invoice Document Header Text</label>
                <textarea
                  defaultValue="RZ MINING & INFRASTRUCTURE PRIVATE LIMITED — Calicut Bypass Road, Palazhi, Kozhikode, Kerala 673014"
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs font-mono"
                />
              </div>
            </div>

            {/* Document Header Preview Box */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                Live Document Header Preview (Vouchers & Invoices)
              </span>

              <div className="p-4 rounded-xl bg-white text-slate-950 font-sans space-y-2 shadow-inner">
                <div className="flex justify-between items-start border-b border-slate-300 pb-2">
                  <div>
                    <h4 className="font-black text-sm tracking-tight text-slate-900">RZ MINING &amp; INFRASTRUCTURE PVT LTD</h4>
                    <p className="text-[10px] text-slate-600">Palazhi Bypass Road, Kozhikode &bull; GSTIN: 32AABCR1234F1Z8</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-mono bg-slate-900 text-white px-2 py-0.5 rounded font-bold">
                      TAX INVOICE
                    </span>
                  </div>
                </div>
                <div className="text-[9px] text-slate-500 font-mono flex justify-between">
                  <span>Customer: ABC Civil Infra</span>
                  <span>Invoice #RZ-INV-2026-9921</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. NOTIFICATIONS PREFERENCES */}
      {activeSubTab === 'notifications' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="font-bold text-white text-base">Organization Notification &amp; Alert Routing</h3>
            <p className="text-xs text-slate-400">
              Configure real-time notifications routed to RZ® OTT, RZ® Chat, SMS and corporate email
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {Object.entries(notifications).map(([key, enabled]) => (
              <div
                key={key}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-white capitalize">{key} Alerts</span>
                  <div className="text-[11px] text-slate-400">Instant notification on new {key} events</div>
                </div>

                <button
                  onClick={() => toggleNotification(key as keyof typeof notifications)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    enabled ? 'bg-purple-600' : 'bg-slate-800'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SECURITY & AUDIT TRAIL */}
      {activeSubTab === 'audit' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchAudit}
                onChange={e => setSearchAudit(e.target.value)}
                placeholder="Search audit trail by user, action, module..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              onClick={() => showToast('Exported complete immutable security audit log as CSV')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export Audit Trail (CSV)</span>
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Timestamp &amp; User</th>
                    <th className="py-3 px-4">Action Type</th>
                    <th className="py-3 px-4">Target Module</th>
                    <th className="py-3 px-4">Action Details</th>
                    <th className="py-3 px-4">IP &amp; Device</th>
                    <th className="py-3 px-4 text-right">Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{log.user}</div>
                        <div className="text-[10px] font-mono text-slate-400">{log.timestamp}</div>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-amber-400">
                        {log.action}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono text-slate-300 text-[11px]">{log.module}</span>
                      </td>

                      <td className="py-3 px-4 text-slate-300 max-w-xs truncate">
                        {log.details}
                      </td>

                      <td className="py-3 px-4 font-mono text-[10px] text-slate-400">
                        {log.ipDevice}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                          log.status === 'Success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          log.status === 'Warning' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
