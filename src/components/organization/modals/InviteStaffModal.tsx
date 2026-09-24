import React, { useState } from 'react';
import {
  Send,
  X,
  CheckCircle2,
  Users,
  Shield,
  Building2,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { ALL_24_ROLES_CATALOG, DEMO_BRANCHES, DEMO_SITES } from '../data/orgDemoData';
import { Role24, SeatType } from '../types';

interface InviteStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (invitedName: string, role: string) => void;
}

export const InviteStaffModal: React.FC<InviteStaffModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Operations & Mining');
  const [designation, setDesignation] = useState('Assistant Operations In-charge');
  const [seatType, setSeatType] = useState<SeatType>('Staff');
  const [role, setRole] = useState<Role24>('SUPERVISOR');
  const [branchId, setBranchId] = useState<string>(DEMO_BRANCHES[0].id);
  const [siteId, setSiteId] = useState<string>(DEMO_SITES[0].id);

  if (!isOpen) return null;

  const handleSend = () => {
    onSuccess(name || 'New Personnel', role);
    onClose();
  };

  const branchSites = DEMO_SITES.filter(s => s.branchId === branchId);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                Step {step} of 3 &bull; Staff Invitation Workflow
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                Studio Preview
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">Invite Personnel to Workspace</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-base cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: PERSONAL DETAILS */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Full Legal Name *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Salman Faris"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="salman@company.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Mobile Phone (for SMS Invite) *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98470 99887"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Designation</label>
                <input
                  type="text"
                  value={designation}
                  onChange={e => setDesignation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: ROLE & SEAT TYPE */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Assigned Seat Capacity Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Staff', 'Driver', 'Contractor'] as SeatType[]).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSeatType(t)}
                    className={`p-2.5 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                      seatType === t
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {t} Seat
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Select 1 of 24 Official Roles</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as Role24)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500"
              >
                {ALL_24_ROLES_CATALOG.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.number}. {r.title} ({r.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Role Summary */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-slate-300">
              <div className="text-[10px] font-mono uppercase text-amber-400 font-bold">Role Capabilities:</div>
              <div>{ALL_24_ROLES_CATALOG.find(r => r.id === role)?.description}</div>
            </div>
          </div>
        )}

        {/* STEP 3: BRANCH & SITE ALLOCATION */}
        {step === 3 && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Deploy to Operating Branch</label>
              <select
                value={branchId}
                onChange={e => {
                  setBranchId(e.target.value);
                  const firstSite = DEMO_SITES.find(s => s.branchId === e.target.value);
                  if (firstSite) setSiteId(firstSite.id);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500"
              >
                {DEMO_BRANCHES.map(b => (
                  <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Primary Operating Location / Site</label>
              <select
                value={siteId}
                onChange={e => setSiteId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500"
              >
                {branchSites.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.type})</option>
                ))}
              </select>
            </div>

            {/* Review Summary */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
              <div className="text-[10px] font-mono text-purple-400 font-bold uppercase">Ready to Issue Invitation</div>
              <div className="font-bold text-white">{name || 'New Staff Candidate'} &bull; {email || 'candidate@domain.com'}</div>
              <div className="text-slate-400">
                Assigned Role: <strong className="text-amber-400">{role}</strong> &bull; Seat: <strong className="text-cyan-400">{seatType}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-md"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSend}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Invitation Link</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
