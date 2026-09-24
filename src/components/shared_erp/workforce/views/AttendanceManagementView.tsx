import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  AlertTriangle,
  Zap,
  Filter,
  Search,
  Plus,
  Download,
  Printer,
  ChevronRight,
  ShieldCheck,
  Check,
  RotateCcw,
  Sparkles,
  Layers,
  Building2,
  Users
} from 'lucide-react';
import { AttendanceEntry, AttendanceStatus, WorkforceSectionTab } from '../types';
import { MOCK_ATTENDANCE_ENTRIES } from '../workforceMockData';

interface AttendanceManagementViewProps {
  onToast: (msg: string) => void;
  onOpenPrintModal?: (title: string, data: any) => void;
  onNavigateTab?: (tab: WorkforceSectionTab) => void;
}

export const AttendanceManagementView: React.FC<AttendanceManagementViewProps> = ({
  onToast,
  onOpenPrintModal,
  onNavigateTab
}) => {
  const [entries, setEntries] = useState<AttendanceEntry[]>(MOCK_ATTENDANCE_ENTRIES);
  const [selectedDate, setSelectedDate] = useState('2026-03-24');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Entry Mode state: 'view' | 'quick-mark' | 'bulk-department'
  const [entryMode, setEntryMode] = useState<'view' | 'quick-mark' | 'bulk-department'>('view');
  const [bulkStatus, setBulkStatus] = useState<AttendanceStatus>('Present');

  const filteredEntries = entries.filter((e) => {
    const matchesSearch =
      e.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || e.status === selectedStatus;
    const matchesDept = selectedDept === 'ALL' || e.department === selectedDept;
    return matchesSearch && matchesStatus && matchesDept;
  });

  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'Present':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Absent':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'Half Day':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Leave':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Late':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'Overtime':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Holiday':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'Weekly Off':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  const handleQuickMark = (id: string, newStatus: AttendanceStatus) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              status: newStatus,
              checkIn: newStatus === 'Absent' ? '-' : e.checkIn === '-' ? '08:00 AM' : e.checkIn,
              checkOut: newStatus === 'Absent' ? '-' : e.checkOut === '-' ? '05:00 PM' : e.checkOut,
              workingHours: newStatus === 'Absent' ? 0 : newStatus === 'Half Day' ? 4.0 : 8.0
            }
          : e
      )
    );
    onToast(`Updated attendance status to ${newStatus}`);
  };

  const handleApplyBulk = () => {
    setEntries((prev) =>
      prev.map((e) =>
        selectedDept === 'ALL' || e.department === selectedDept
          ? {
              ...e,
              status: bulkStatus,
              workingHours: bulkStatus === 'Absent' ? 0 : bulkStatus === 'Half Day' ? 4.0 : 8.0
            }
          : e
      )
    );
    onToast(`Applied bulk "${bulkStatus}" status to ${selectedDept === 'ALL' ? 'all visible staff' : selectedDept}`);
  };

  return (
    <div className="space-y-6">
      {/* Header & Biometric Placeholder Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              WORKFORCE TIME &amp; ATTENDANCE
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
              STUDIO PREVIEW / DEMO DATA
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <span>Daily Attendance &amp; Shift Register</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pithead muster roll, crusher plant screen shifts, driver haulage logs, and late arrival monitoring.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onOpenPrintModal?.(`Daily Attendance Register: ${selectedDate}`, filteredEntries)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Register</span>
          </button>
          <button
            onClick={() => onToast('Exported Attendance CSV')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setEntryMode(entryMode === 'view' ? 'quick-mark' : 'view')}
            className={`px-4 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg ${
              entryMode === 'quick-mark'
                ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{entryMode === 'quick-mark' ? 'Finish Quick Mark' : 'Quick Attendance Entry'}</span>
          </button>
        </div>
      </div>

      {/* Mandatory UI Placeholder: Biometric Integration */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white flex items-center gap-2">
              <span>Biometric Integration &mdash; Coming in Production Backend</span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-bold border border-indigo-500/40">
                FINGERPRINT / FACIAL RECOGNITION
              </span>
            </div>
            <p className="text-slate-400 text-[11px] mt-0.5 font-sans">
              Connects to eSSL / ZKTeco optical scanners at Pithead Gate, Crusher Weighbridge, and Head Office turnstiles.
            </p>
          </div>
        </div>
        <button
          onClick={() => onToast('Simulated Biometric Sync: 134 entries polled')}
          className="px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold font-mono cursor-pointer shrink-0"
        >
          Simulate Scan Sync
        </button>
      </div>

      {/* 7 Attendance KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 font-mono">
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Present</span>
          <span className="text-xl font-black text-emerald-400">134</span>
        </div>
        <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Absent</span>
          <span className="text-xl font-black text-rose-400">5</span>
        </div>
        <div className="p-3 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Half Day</span>
          <span className="text-xl font-black text-yellow-400">2</span>
        </div>
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Leave</span>
          <span className="text-xl font-black text-amber-400">3</span>
        </div>
        <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Late</span>
          <span className="text-xl font-black text-orange-400">7</span>
        </div>
        <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Overtime</span>
          <span className="text-xl font-black text-purple-400">4 (18h)</span>
        </div>
        <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-center col-span-2 sm:col-span-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Not Marked</span>
          <span className="text-xl font-black text-slate-300">2</span>
        </div>
      </div>

      {/* Filter, Date Selector & Bulk Attendance Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3 font-mono">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-500"
            />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-amber-500 font-sans"
            >
              <option value="ALL">All Departments</option>
              <option value="Quarry Operations">Quarry Operations</option>
              <option value="Crusher Plant">Crusher Plant</option>
              <option value="Vehicle & Fleet Logistics">Vehicle & Fleet Logistics</option>
              <option value="Accounts & Finance">Accounts & Finance</option>
              <option value="Dispatch & Weighbridge">Dispatch & Weighbridge</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-amber-500 font-sans"
            >
              <option value="ALL">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Half Day">Half Day</option>
              <option value="Leave">Leave</option>
              <option value="Late">Late</option>
              <option value="Overtime">Overtime</option>
            </select>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search staff name or ID..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Quick Bulk Action Panel */}
        {entryMode === 'quick-mark' && (
          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-bold">Bulk Action for {selectedDept}:</span>
              {(['Present', 'Absent', 'Half Day', 'Holiday', 'Weekly Off'] as AttendanceStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => setBulkStatus(st)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer border ${
                    bulkStatus === st
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
            <button
              onClick={handleApplyBulk}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer shadow-md"
            >
              Apply to All Visible
            </button>
          </div>
        )}
      </div>

      {/* Attendance Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-bold">Employee</th>
                <th className="py-3.5 px-4 font-bold">Department</th>
                <th className="py-3.5 px-4 font-bold">Shift</th>
                <th className="py-3.5 px-4 font-bold">Check In / Out</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold">Work Hours</th>
                <th className="py-3.5 px-4 font-bold">Overtime</th>
                <th className="py-3.5 px-4 font-bold">Remarks</th>
                <th className="py-3.5 px-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredEntries.map((e) => (
                <tr key={e.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <span className="font-bold text-white font-sans text-xs block">{e.employeeName}</span>
                    <span className="text-[10px] text-amber-400 font-mono">{e.employeeId}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-sans">{e.department}</td>
                  <td className="py-3 px-4 text-slate-400 text-[11px] max-w-[150px] truncate">{e.shift}</td>
                  <td className="py-3 px-4 text-slate-200">
                    <div>{e.checkIn} &mdash; {e.checkOut}</div>
                    {e.lateMinutes > 0 && (
                      <span className="text-[10px] text-orange-400 font-bold">Late by {e.lateMinutes} mins</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getStatusBadge(e.status)}`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-cyan-400">
                    {e.workingHours > 0 ? `${e.workingHours} hrs` : '-'}
                  </td>
                  <td className="py-3 px-4">
                    {e.overtimeHours > 0 ? (
                      <span className="text-purple-400 font-bold">+{e.overtimeHours} hrs OT</span>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-sans text-[11px] max-w-[180px] truncate">
                    {e.remarks}
                  </td>
                  <td className="py-3 px-4 text-center font-sans">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        title="Mark Present"
                        onClick={() => handleQuickMark(e.id, 'Present')}
                        className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Mark Absent"
                        onClick={() => handleQuickMark(e.id, 'Absent')}
                        className="p-1 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Mark Half Day"
                        onClick={() => handleQuickMark(e.id, 'Half Day')}
                        className="p-1 rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 cursor-pointer"
                      >
                        <Clock className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Approve Correction"
                        onClick={() => onToast(`Attendance correction approved for ${e.employeeName}`)}
                        className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
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
  );
};
