import React, { useState } from 'react';
import {
  X,
  User,
  Shield,
  Briefcase,
  Activity,
  FileText,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Calendar,
  MapPin,
  Phone,
  Mail,
  HardDrive
} from 'lucide-react';
import { StaffMember } from '../types';

interface StaffDetailModalProps {
  staff: StaffMember | null;
  onClose: () => void;
  onOpenChat?: (name: string) => void;
  onCreateTask?: (task: string) => void;
}

export const StaffDetailModal: React.FC<StaffDetailModalProps> = ({
  staff,
  onClose,
  onOpenChat,
  onCreateTask
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'employment' | 'access' | 'activity' | 'documents'>('profile');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!staff) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5">
        {toastMsg && (
          <div className="fixed top-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-black text-lg">
              {staff.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">{staff.name}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
                  {staff.role}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                  {staff.status}
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {staff.designation} &bull; {staff.department} &bull; <span className="font-mono text-purple-400">{staff.employeeId}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {[
            { id: 'profile', label: 'Personal Profile', icon: User },
            { id: 'employment', label: 'Employment Record', icon: Briefcase },
            { id: 'access', label: 'Access & RBAC', icon: Shield },
            { id: 'activity', label: 'Recent Activity', icon: Activity },
            { id: 'documents', label: 'Documents', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. PERSONAL PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Email Address</span>
              <div className="font-mono font-bold text-cyan-400">{staff.email}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Mobile Contact</span>
              <div className="font-mono font-bold text-white">{staff.phone}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Primary Branch</span>
              <div className="font-bold text-white">{staff.branch}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Operating Site</span>
              <div className="font-bold text-amber-400">{staff.site}</div>
            </div>
          </div>
        )}

        {/* 2. EMPLOYMENT TAB */}
        {activeTab === 'employment' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Date of Joining</span>
              <div className="font-mono font-bold text-white">{staff.joiningDate}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Reporting Manager</span>
              <div className="font-bold text-cyan-400">{staff.manager}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Assigned Seat Allocation</span>
              <div className="font-bold text-amber-400">{staff.seatType} Seat</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Biometric Terminal</span>
              <div className="font-bold text-emerald-400">Device #KKD-GATE-01 Enrolled</div>
            </div>
          </div>
        )}

        {/* 3. ACCESS & RBAC TAB */}
        {activeTab === 'access' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                Authorized Permissions ({staff.permissions.length} of 9):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {staff.permissions.map(p => (
                  <span key={p} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-white font-mono text-[11px]">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono uppercase text-purple-400 font-bold block">
                Authorized Modules:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {staff.authorizedModules.map((m, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300 font-mono text-[11px]">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. ACTIVITY TAB */}
        {activeTab === 'activity' && (
          <div className="space-y-2.5 text-xs">
            {[
              { act: 'Weighbridge pass verified for Tipper KL-11-BH-9921', time: '10 mins ago', type: 'Operation' },
              { act: 'Clocked in via Biometric Face Scanner #01', time: 'Today 08:30 AM', type: 'Attendance' },
              { act: 'Submitted fuel voucher reimbursement for review', time: 'Yesterday 17:15', type: 'Finance' }
            ].map((item, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="font-bold text-white text-xs">{item.act}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{item.time}</div>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {item.type}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* 5. DOCUMENTS TAB */}
        {activeTab === 'documents' && (
          <div className="space-y-2.5 text-xs">
            {[
              { doc: 'Aadhaar Identification Card', ref: 'Verified UIDAI', status: 'Approved' },
              { doc: 'Commercial Heavy Vehicle Driving License', ref: 'KL-11-2019-9921', status: 'Valid 2029' },
              { doc: 'Employment Offer Letter & NDA', ref: 'Signed & Certified', status: 'Archived' }
            ].map((d, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="font-bold text-white text-xs">{d.doc}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{d.ref}</div>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                  {d.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Modal Footer with RZ Chat & OTT Integration Buttons */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onOpenChat?.(staff.name);
                onClose();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Open RZ® Chat</span>
            </button>
            <button
              onClick={() => {
                onCreateTask?.(`Task for ${staff.name} (${staff.role})`);
                onClose();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-400 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create OTT Task</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
