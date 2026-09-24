import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Send,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  UserX,
  Edit,
  Eye,
  Shield,
  MapPin,
  Calendar,
  MessageSquare,
  Sparkles,
  Phone,
  Mail,
  ChevronRight,
  HardDrive
} from 'lucide-react';
import { DEMO_STAFF_MEMBERS, DEMO_STAFF_INVITATIONS, ALL_24_ROLES_CATALOG } from '../data/orgDemoData';
import { StaffMember, StaffStatus, Role24 } from '../types';

interface StaffDirectoryViewProps {
  onOpenInviteModal: () => void;
  onSelectStaff: (staff: StaffMember) => void;
  onOpenChatWithStaff?: (name: string) => void;
  onCreateTaskForStaff?: (title: string) => void;
}

export const StaffDirectoryView: React.FC<StaffDirectoryViewProps> = ({
  onOpenInviteModal,
  onSelectStaff,
  onOpenChatWithStaff,
  onCreateTaskForStaff
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'directory' | 'invitations' | 'membership'>('directory');
  const [staffList, setStaffList] = useState<StaffMember[]>(DEMO_STAFF_MEMBERS);
  const [invitations, setInvitations] = useState(DEMO_STAFF_INVITATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const toggleStaffStatus = (id: string) => {
    setStaffList(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus: StaffStatus = s.status === 'Active' ? 'Suspended' : 'Active';
        showToast(`Staff member ${s.name} is now ${nextStatus}`);
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const handleMarkRemoved = (id: string, name: string) => {
    setStaffList(prev => prev.map(s => {
      if (s.id === id) {
        showToast(`Staff member ${name} marked as Removed (Preserved in Demo Audit)`);
        return { ...s, status: 'Removed' as StaffStatus };
      }
      return s;
    }));
  };

  const filteredStaff = staffList.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || s.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

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
              WORKFORCE &bull; STAFF GOVERNANCE
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
              Studio Preview / Demo Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            <span>Staff Directory &amp; Access Profiles</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Managing personnel records, 24 RBAC role assignments, physical site deployments, seat reservations, and multi-channel communication bridges.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveSubTab('directory')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeSubTab === 'directory' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Directory ({staffList.length})
            </button>
            <button
              onClick={() => setActiveSubTab('invitations')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeSubTab === 'invitations' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Invitations ({invitations.length})
            </button>
            <button
              onClick={() => setActiveSubTab('membership')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeSubTab === 'membership' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Memberships
            </button>
          </div>

          <button
            onClick={onOpenInviteModal}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-purple-600/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>+ Invite Staff Member</span>
          </button>
        </div>
      </div>

      {/* 1. DIRECTORY TABLE */}
      {activeSubTab === 'directory' && (
        <div className="space-y-4">
          {/* Search & Filters */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search staff by name, ID, email..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <span className="text-slate-400 font-bold">Role:</span>
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-purple-500"
              >
                <option value="ALL">All 24 Roles</option>
                {ALL_24_ROLES_CATALOG.map(r => (
                  <option key={r.id} value={r.id}>{r.number}. {r.title}</option>
                ))}
              </select>

              <span className="text-slate-400 font-bold ml-2">Status:</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-purple-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
                <option value="Removed">Removed</option>
              </select>
            </div>
          </div>

          {/* Responsive Staff Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Employee ID &amp; Name</th>
                    <th className="py-3 px-4">Department &amp; Designation</th>
                    <th className="py-3 px-4">24-Role &amp; Seat</th>
                    <th className="py-3 px-4">Branch &amp; Mining Site</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Last Active</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {filteredStaff.map(member => (
                    <tr key={member.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4">
                        <div
                          onClick={() => onSelectStaff(member)}
                          className="font-bold text-white hover:text-amber-400 cursor-pointer flex items-center gap-1.5"
                        >
                          <span>{member.name}</span>
                          <Eye className="w-3 h-3 text-slate-500" />
                        </div>
                        <div className="text-[10px] font-mono text-purple-400">{member.employeeId} &bull; {member.phone}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-200">{member.designation}</div>
                        <div className="text-[10px] text-slate-500">{member.department}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 text-[10px] inline-block">
                          {member.role}
                        </span>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">Seat: {member.seatType}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-white text-[11px] truncate max-w-[160px]">{member.branch.split('&')[0]}</div>
                        <div className="text-[10px] text-cyan-400 font-mono truncate max-w-[160px]">{member.site}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          member.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          member.status === 'Suspended' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {member.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[10px] text-slate-400">
                        {member.lastActive}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* RZ Chat bridge */}
                          <button
                            onClick={() => onOpenChatWithStaff?.(member.name)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 transition cursor-pointer"
                            title="Open RZ® Chat"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>

                          {/* RZ OTT bridge */}
                          <button
                            onClick={() => onCreateTaskForStaff?.(`Task assigned to ${member.name} (${member.role})`)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-400 hover:text-purple-300 transition cursor-pointer"
                            title="Create OTT Task"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>

                          {/* Status toggle */}
                          <button
                            onClick={() => toggleStaffStatus(member.id)}
                            className={`p-1.5 rounded-lg border text-xs font-bold transition cursor-pointer ${
                              member.status === 'Active'
                                ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                            }`}
                            title={member.status === 'Active' ? 'Suspend Access' : 'Activate Access'}
                          >
                            {member.status === 'Active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => onSelectStaff(member)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 cursor-pointer"
                          >
                            Profile
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. INVITATIONS MANAGEMENT */}
      {activeSubTab === 'invitations' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Send className="w-4 h-4 text-amber-400" />
                <span>Pending &amp; Issued Staff Invitations</span>
              </h3>
              <p className="text-xs text-slate-400">Secure onboarding tokens sent via SMS and Email</p>
            </div>
            <button
              onClick={onOpenInviteModal}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer shadow-md"
            >
              + Send New Invite
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {invitations.map(inv => (
              <div key={inv.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{inv.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
                      {inv.role}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      inv.status === 'Pending' ? 'bg-amber-500/20 text-amber-300' :
                      inv.status === 'Accepted' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px] mt-1">
                    Email: <span className="font-mono text-cyan-400">{inv.email}</span> &bull; Phone: <span className="font-mono text-slate-300">{inv.phone}</span>
                  </div>
                  <div className="text-slate-500 text-[10px] font-mono mt-0.5">
                    Sent: {inv.invitedAt} &bull; Expires: {inv.expiresAt} &bull; Invited By: {inv.invitedBy}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => showToast(`Resent invitation link to ${inv.email}`)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer"
                  >
                    Resend Invite
                  </button>
                  <button
                    onClick={() => {
                      setInvitations(prev => prev.filter(i => i.id !== inv.id));
                      showToast(`Revoked invitation ${inv.id}`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs border border-red-500/30 cursor-pointer"
                  >
                    Revoke
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. MEMBERSHIP & MULTI-BRANCH ACCESS */}
      {activeSubTab === 'membership' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-sm">Organization Multi-Branch Access Roster</h3>
              <p className="text-xs text-slate-400">Specifying cross-branch visibility (All Branches, Selected Branches, Single Branch)</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">Unified Identity</span>
          </div>

          <div className="space-y-3 text-xs">
            {staffList.map(st => (
              <div key={st.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">{st.name} ({st.employeeId})</div>
                  <div className="text-[11px] text-slate-400">Role: <strong className="text-amber-400">{st.role}</strong> &bull; Joining Date: {st.joiningDate}</div>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                    {st.role === 'OWNER' || st.role === 'GENERAL MANAGER' ? 'All 3 Branches (Universal)' : 'Branch-Specific'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
