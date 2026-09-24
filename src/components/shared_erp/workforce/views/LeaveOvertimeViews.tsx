import React, { useState } from 'react';
import {
  Calendar,
  Zap,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  Download,
  AlertCircle,
  DollarSign
} from 'lucide-react';
import { LeaveRequest, OvertimeEntry, LeaveType, WorkforceSectionTab } from '../types';
import { MOCK_LEAVE_REQUESTS, MOCK_OVERTIME_ENTRIES } from '../workforceMockData';

interface ViewProps {
  onToast: (msg: string) => void;
  onOpenPrintModal?: (title: string, data: any) => void;
  onNavigateTab?: (tab: WorkforceSectionTab) => void;
}

/* ========================================================================
   1. LEAVE MANAGEMENT VIEW
   ======================================================================== */
export const LeaveManagementView: React.FC<ViewProps> = ({ onToast, onOpenPrintModal, onNavigateTab }) => {
  const [requests, setRequests] = useState<LeaveRequest[]>(MOCK_LEAVE_REQUESTS);
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filteredRequests = requests.filter((r) => {
    const matchesType = filterType === 'ALL' || r.leaveType === filterType;
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
    return matchesType && matchesStatus;
  });

  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r))
    );
    onToast(`Leave request ${id} approved successfully`);
  };

  const handleReject = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Rejected' } : r))
    );
    onToast(`Leave request ${id} rejected`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              STAFF LEAVE &amp; TIME-OFF
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
              STUDIO PREVIEW / DEMO DATA
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <span>Leave Management &amp; Quotas</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Casual, sick, annual, and festival time-off requests with approval workflow and live balance tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenPrintModal?.('Leave Register', filteredRequests)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Register</span>
          </button>
          <button
            onClick={() => onToast('Opened Apply Leave Dialog')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Apply Leave</span>
          </button>
        </div>
      </div>

      {/* Leave Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase font-bold">Total Requests</span>
          <div className="text-xl font-black text-white mt-0.5">{requests.length}</div>
          <span className="text-[10px] text-slate-400">Current quarter</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Pending Review</span>
          <div className="text-xl font-black text-amber-400 mt-0.5">
            {requests.filter((r) => r.status === 'Pending').length}
          </div>
          <span className="text-[10px] text-slate-400">Requires supervisor signoff</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Approved</span>
          <div className="text-xl font-black text-emerald-400 mt-0.5">
            {requests.filter((r) => r.status === 'Approved').length}
          </div>
          <span className="text-[10px] text-emerald-400">Sanctioned &amp; rostered</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Avg Leave Balance</span>
          <div className="text-xl font-black text-cyan-400 mt-0.5">14.2 Days</div>
          <span className="text-[10px] text-cyan-400">Per employee quota</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl flex flex-wrap items-center gap-2 font-mono">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-amber-500 font-sans"
        >
          <option value="ALL">All Leave Types</option>
          <option value="Casual Leave">Casual Leave</option>
          <option value="Sick Leave">Sick Leave</option>
          <option value="Annual Leave">Annual Leave</option>
          <option value="Emergency Leave">Emergency Leave</option>
          <option value="Unpaid Leave">Unpaid Leave</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-amber-500 font-sans"
        >
          <option value="ALL">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-bold">Leave ID</th>
                <th className="py-3.5 px-4 font-bold">Employee</th>
                <th className="py-3.5 px-4 font-bold">Department</th>
                <th className="py-3.5 px-4 font-bold">Type</th>
                <th className="py-3.5 px-4 font-bold">Duration</th>
                <th className="py-3.5 px-4 font-bold">Days</th>
                <th className="py-3.5 px-4 font-bold">Reason</th>
                <th className="py-3.5 px-4 font-bold">Approver</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRequests.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 text-amber-400 font-bold">{r.id}</td>
                  <td className="py-3 px-4">
                    <span className="text-white font-bold font-sans block">{r.employeeName}</span>
                    <span className="text-[10px] text-slate-500">{r.employeeId}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-sans">{r.department}</td>
                  <td className="py-3 px-4 text-cyan-400 font-sans">{r.leaveType}</td>
                  <td className="py-3 px-4 text-slate-300 text-[11px]">
                    {r.fromDate} &rarr; {r.toDate}
                  </td>
                  <td className="py-3 px-4 font-bold text-white">{r.days} Days</td>
                  <td className="py-3 px-4 text-slate-400 font-sans text-[11px] max-w-[180px] truncate">
                    {r.reason}
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-sans text-[11px]">{r.approver}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                        r.status === 'Approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : r.status === 'Rejected'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-sans">
                    {r.status === 'Pending' ? (
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleApprove(r.id)}
                          className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-[10px] font-bold cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(r.id)}
                          className="px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 text-[10px] font-bold cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-500">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ========================================================================
   2. OVERTIME DASHBOARD VIEW
   ======================================================================== */
export const OvertimeView: React.FC<ViewProps> = ({ onToast, onOpenPrintModal, onNavigateTab }) => {
  const [otEntries, setOtEntries] = useState<OvertimeEntry[]>(MOCK_OVERTIME_ENTRIES);

  const handleApproveOt = (id: string) => {
    setOtEntries((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'Approved', approvedBy: 'Accounts Comptroller' } : o))
    );
    onToast(`Overtime entry ${id} authorized for payroll`);
  };

  const totalOtHours = otEntries.reduce((acc, curr) => acc + curr.overtimeHours, 0);
  const totalOtAmount = otEntries.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              OVERTIME &amp; DIFFERENTIAL RATES
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
              STUDIO PREVIEW / DEMO DATA
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span>Overtime Register &amp; Calculations</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Extra hours tracking across quarry blasting, crusher night shifts, and emergency plant repairs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToast('Recalculated OT Rates for Payroll')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Calculate OT</span>
          </button>
          <button
            onClick={() => onToast('Opened Log Overtime Dialog')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Overtime</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Total OT Logged</span>
          <div className="text-xl font-black text-purple-400 mt-0.5">{totalOtHours.toFixed(1)} Hours</div>
          <span className="text-[10px] text-slate-400">Current pay cycle</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Total OT Payable</span>
          <div className="text-xl font-black text-emerald-400 mt-0.5">₹{totalOtAmount.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-emerald-400">To be credited to salary</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Pending Review</span>
          <div className="text-xl font-black text-amber-400 mt-0.5">
            {otEntries.filter((o) => o.status === 'Pending').length} Entries
          </div>
          <span className="text-[10px] text-slate-400">Awaiting plant approval</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Standard Multiplier</span>
          <div className="text-xl font-black text-cyan-400 mt-0.5">1.5x Base</div>
          <span className="text-[10px] text-cyan-400">Statutory rate applied</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-bold">OT ID</th>
                <th className="py-3.5 px-4 font-bold">Employee</th>
                <th className="py-3.5 px-4 font-bold">Department</th>
                <th className="py-3.5 px-4 font-bold">Date</th>
                <th className="py-3.5 px-4 font-bold">Shift Standard</th>
                <th className="py-3.5 px-4 font-bold">OT Hours</th>
                <th className="py-3.5 px-4 font-bold">Hourly Rate</th>
                <th className="py-3.5 px-4 font-bold">Total OT Amount</th>
                <th className="py-3.5 px-4 font-bold">Approval</th>
                <th className="py-3.5 px-4 font-bold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {otEntries.map((o) => (
                <tr key={o.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 text-purple-400 font-bold">{o.id}</td>
                  <td className="py-3 px-4">
                    <span className="text-white font-bold font-sans block">{o.employeeName}</span>
                    <span className="text-[10px] text-slate-500">{o.employeeId}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-sans">{o.department}</td>
                  <td className="py-3 px-4 text-slate-300">{o.date}</td>
                  <td className="py-3 px-4 text-slate-400">{o.regularHours} hrs</td>
                  <td className="py-3 px-4 font-black text-purple-400">+{o.overtimeHours} hrs</td>
                  <td className="py-3 px-4 text-slate-300">₹{o.rate}/hr</td>
                  <td className="py-3 px-4 font-black text-emerald-400">₹{o.amount.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                        o.status === 'Approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {o.status} {o.approvedBy && `(${o.approvedBy})`}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-sans">
                    {o.status === 'Pending' ? (
                      <button
                        onClick={() => handleApproveOt(o.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-[10px] font-bold cursor-pointer"
                      >
                        Authorize
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-500">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
