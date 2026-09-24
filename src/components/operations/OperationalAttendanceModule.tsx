import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Search,
  Filter,
  Download,
  Printer,
  Plus,
  AlertCircle,
  FileText,
  Building2,
  Truck,
  Pickaxe,
  Check
} from 'lucide-react';

export type OperationalPlatform = 'QUARRY' | 'CRUSHER' | 'VEHICLE';

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  category: 'Worker' | 'Supervisor' | 'Operator' | 'Staff' | 'Driver' | 'Helper';
  date: string;
  shift: 'Day (06:00-14:00)' | 'Evening (14:00-22:00)' | 'Night (22:00-06:00)' | 'General (08:30-17:30)';
  checkIn: string;
  checkOut: string;
  status: 'Present' | 'Absent' | 'Leave' | 'Overtime';
  overtimeHours: number;
  notes: string;
  platform: OperationalPlatform;
  siteName: string;
}

interface OperationalAttendanceModuleProps {
  platform: OperationalPlatform;
  siteTitle?: string;
  onCreateOttTask?: (taskTitle: string) => void;
}

export const OperationalAttendanceModule: React.FC<OperationalAttendanceModuleProps> = ({
  platform,
  siteTitle,
  onCreateOttTask
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-21');
  const [selectedShift, setSelectedShift] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Seed sample personnel by platform
  const getInitialRecords = (): AttendanceRecord[] => {
    if (platform === 'QUARRY') {
      return [
        {
          id: 'ATT-Q-01',
          employeeId: 'EMP-Q101',
          employeeName: 'Ramesh Gowda',
          role: 'Excavator Operator',
          category: 'Operator',
          date: '2026-09-21',
          shift: 'Day (06:00-14:00)',
          checkIn: '05:52 AM',
          checkOut: '02:08 PM',
          status: 'Present',
          overtimeHours: 0,
          notes: 'Operating Pit #1 Komatsu PC300',
          platform: 'QUARRY',
          siteName: 'Kasaragod North Pit'
        },
        {
          id: 'ATT-Q-02',
          employeeId: 'EMP-Q102',
          employeeName: 'Mohan Das K.',
          role: 'Pit Supervisor',
          category: 'Supervisor',
          date: '2026-09-21',
          shift: 'Day (06:00-14:00)',
          checkIn: '05:45 AM',
          checkOut: '03:45 PM',
          status: 'Overtime',
          overtimeHours: 2,
          notes: 'Supervising blast pre-clearance and block sizing',
          platform: 'QUARRY',
          siteName: 'Kasaragod North Pit'
        },
        {
          id: 'ATT-Q-03',
          employeeId: 'EMP-Q103',
          employeeName: 'Suresh B.',
          role: 'Stone Cutter Operator',
          category: 'Operator',
          date: '2026-09-21',
          shift: 'Day (06:00-14:00)',
          checkIn: '06:02 AM',
          checkOut: '02:00 PM',
          status: 'Present',
          overtimeHours: 0,
          notes: 'Bench cutting row 4 Laterite block',
          platform: 'QUARRY',
          siteName: 'Kasaragod North Pit'
        },
        {
          id: 'ATT-Q-04',
          employeeId: 'EMP-Q104',
          employeeName: 'Praveen Kumar',
          role: 'Bench Sizing Worker',
          category: 'Worker',
          date: '2026-09-21',
          shift: 'Day (06:00-14:00)',
          checkIn: '-',
          checkOut: '-',
          status: 'Leave',
          overtimeHours: 0,
          notes: 'Approved sick leave (Medical certificate attached)',
          platform: 'QUARRY',
          siteName: 'Kasaragod North Pit'
        },
        {
          id: 'ATT-Q-05',
          employeeId: 'EMP-Q105',
          employeeName: 'Anand Shinde',
          role: 'Quarry Clerk',
          category: 'Staff',
          date: '2026-09-21',
          shift: 'General (08:30-17:30)',
          checkIn: '08:25 AM',
          checkOut: '--:--',
          status: 'Present',
          overtimeHours: 0,
          notes: 'Gate passes & dispatch weigh log',
          platform: 'QUARRY',
          siteName: 'Kasaragod North Pit'
        }
      ];
    } else if (platform === 'CRUSHER') {
      return [
        {
          id: 'ATT-C-01',
          employeeId: 'EMP-C201',
          employeeName: 'Vikram Pillai',
          role: 'VSI Plant Operator',
          category: 'Operator',
          date: '2026-09-21',
          shift: 'Day (06:00-14:00)',
          checkIn: '05:50 AM',
          checkOut: '02:05 PM',
          status: 'Present',
          overtimeHours: 0,
          notes: 'Running 150 TPH M-Sand washing line',
          platform: 'CRUSHER',
          siteName: 'Central Crusher Complex #01'
        },
        {
          id: 'ATT-C-02',
          employeeId: 'EMP-C202',
          employeeName: 'Abdul Latheef',
          role: 'Screening Supervisor',
          category: 'Supervisor',
          date: '2026-09-21',
          shift: 'Day (06:00-14:00)',
          checkIn: '05:40 AM',
          checkOut: '04:10 PM',
          status: 'Overtime',
          overtimeHours: 2.5,
          notes: '20mm & 12mm screen mesh overhaul inspection',
          platform: 'CRUSHER',
          siteName: 'Central Crusher Complex #01'
        },
        {
          id: 'ATT-C-03',
          employeeId: 'EMP-C203',
          employeeName: 'Rajendra Prasad',
          role: 'Hopper Feeder Worker',
          category: 'Worker',
          date: '2026-09-21',
          shift: 'Day (06:00-14:00)',
          checkIn: '05:58 AM',
          checkOut: '02:00 PM',
          status: 'Present',
          overtimeHours: 0,
          notes: 'Primary jaw crusher feeding boulder clear',
          platform: 'CRUSHER',
          siteName: 'Central Crusher Complex #01'
        },
        {
          id: 'ATT-C-04',
          employeeId: 'EMP-C204',
          employeeName: 'Sunil Nair',
          role: 'Electrical Plant Tech',
          category: 'Staff',
          date: '2026-09-21',
          shift: 'General (08:30-17:30)',
          checkIn: '08:15 AM',
          checkOut: '--:--',
          status: 'Present',
          overtimeHours: 0,
          notes: 'Capacitor bank & DG maintenance check',
          platform: 'CRUSHER',
          siteName: 'Central Crusher Complex #01'
        }
      ];
    } else {
      // VEHICLE
      return [
        {
          id: 'ATT-V-01',
          employeeId: 'EMP-V301',
          employeeName: 'Muneer Ahmed',
          role: 'Heavy Tipper Driver',
          category: 'Driver',
          date: '2026-09-21',
          shift: 'Day (06:00-14:00)',
          checkIn: '05:45 AM',
          checkOut: '03:15 PM',
          status: 'Overtime',
          overtimeHours: 1.5,
          notes: 'Completed 3 round trips (KL-14-AJ-8821)',
          platform: 'VEHICLE',
          siteName: 'Fleet Terminal A'
        },
        {
          id: 'ATT-V-02',
          employeeId: 'EMP-V302',
          employeeName: 'Shankar Gowda',
          role: '10-Wheeler Driver',
          category: 'Driver',
          date: '2026-09-21',
          shift: 'Day (06:00-14:00)',
          checkIn: '05:50 AM',
          checkOut: '02:10 PM',
          status: 'Present',
          overtimeHours: 0,
          notes: 'M-Sand delivery to Ullal Smart City Project',
          platform: 'VEHICLE',
          siteName: 'Fleet Terminal A'
        },
        {
          id: 'ATT-V-03',
          employeeId: 'EMP-V303',
          employeeName: 'Gopal Shenoy',
          role: 'Truck Helper / Cleaner',
          category: 'Helper',
          date: '2026-09-21',
          shift: 'Day (06:00-14:00)',
          checkIn: '05:55 AM',
          checkOut: '02:00 PM',
          status: 'Present',
          overtimeHours: 0,
          notes: 'Assisting tipper KL-14-AJ-8821',
          platform: 'VEHICLE',
          siteName: 'Fleet Terminal A'
        },
        {
          id: 'ATT-V-04',
          employeeId: 'EMP-V304',
          employeeName: 'Prakash Rao',
          role: 'Fleet Dispatcher',
          category: 'Staff',
          date: '2026-09-21',
          shift: 'General (08:30-17:30)',
          checkIn: '08:20 AM',
          checkOut: '--:--',
          status: 'Present',
          overtimeHours: 0,
          notes: 'Trip sheet reconciliation and GPS geo-fence logs',
          platform: 'VEHICLE',
          siteName: 'Fleet Terminal A'
        }
      ];
    }
  };

  const [records, setRecords] = useState<AttendanceRecord[]>(getInitialRecords());

  // Form state for new entry
  const [newEmpName, setNewEmpName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newCategory, setNewCategory] = useState<'Worker' | 'Supervisor' | 'Operator' | 'Staff' | 'Driver' | 'Helper'>('Worker');
  const [newShift, setNewShift] = useState<'Day (06:00-14:00)' | 'Evening (14:00-22:00)' | 'Night (22:00-06:00)' | 'General (08:30-17:30)'>('Day (06:00-14:00)');
  const [newStatus, setNewStatus] = useState<'Present' | 'Absent' | 'Leave' | 'Overtime'>('Present');
  const [newOvertime, setNewOvertime] = useState('0');
  const [newNotes, setNewNotes] = useState('');

  const handleAddAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName) {
      showToast('Employee name is required');
      return;
    }
    const newRec: AttendanceRecord = {
      id: `ATT-${platform[0]}-${Date.now().toString().slice(-4)}`,
      employeeId: `EMP-${platform[0]}${Math.floor(100 + Math.random() * 900)}`,
      employeeName: newEmpName,
      role: newRole || `${platform} Staff`,
      category: newCategory,
      date: selectedDate,
      shift: newShift,
      checkIn: newStatus === 'Absent' || newStatus === 'Leave' ? '-' : '06:00 AM',
      checkOut: newStatus === 'Absent' || newStatus === 'Leave' ? '-' : '02:00 PM',
      status: newStatus,
      overtimeHours: parseFloat(newOvertime) || 0,
      notes: newNotes,
      platform,
      siteName: siteTitle || `${platform} Operations Site`
    };

    setRecords([newRec, ...records]);
    setIsNewEntryOpen(false);
    setNewEmpName('');
    setNewRole('');
    setNewNotes('');
    showToast(`Recorded attendance for ${newEmpName} (${platform})`);
  };

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesShift = selectedShift === 'ALL' || r.shift.includes(selectedShift);
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesShift && matchesStatus;
  });

  const totalPersonnel = records.length;
  const presentCount = records.filter((r) => r.status === 'Present' || r.status === 'Overtime').length;
  const overtimeCount = records.filter((r) => r.status === 'Overtime').length;
  const absentCount = records.filter((r) => r.status === 'Absent').length;
  const leaveCount = records.filter((r) => r.status === 'Leave').length;
  const attendanceRate = totalPersonnel > 0 ? Math.round((presentCount / totalPersonnel) * 100) : 0;

  const platformBadgeColor =
    platform === 'QUARRY'
      ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
      : platform === 'CRUSHER'
      ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
      : 'text-blue-400 bg-blue-500/10 border-blue-500/20';

  const PlatformIcon = platform === 'QUARRY' ? Pickaxe : platform === 'CRUSHER' ? Building2 : Truck;

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/40 text-emerald-300 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header & KPI Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${platformBadgeColor}`}>
              <PlatformIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${platformBadgeColor}`}>
                  PLATFORM: {platform} ATTENDANCE
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Date: {selectedDate}</span>
              </div>
              <h2 className="text-lg font-black text-white">{siteTitle || `${platform} Workforce & Attendance`}</h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsNewEntryOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Record Attendance</span>
            </button>
            <button
              onClick={() => {
                if (onCreateOttTask) {
                  onCreateOttTask(`${platform} Attendance & Muster Roll Verification`);
                }
                showToast(`Created OTT Task: Verify ${platform} muster roll`);
              }}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition border border-slate-700"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Muster OTT Task</span>
            </button>
            <button
              onClick={() => showToast(`Exported ${platform} Attendance Ledger (PDF)`)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Export Report"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => showToast(`Printed ${platform} Daily Shift Muster Sheet`)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Print Sheet"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 5 KPI Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-2xl">
            <div className="text-[11px] text-slate-400">Total Roster</div>
            <div className="text-xl font-mono font-black text-white mt-0.5">{totalPersonnel}</div>
            <div className="text-[10px] text-slate-500">Authorized Personnel</div>
          </div>
          <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-2xl">
            <div className="text-[11px] text-slate-400">Present Today</div>
            <div className="text-xl font-mono font-black text-emerald-400 mt-0.5">{presentCount}</div>
            <div className="text-[10px] text-emerald-500/80">{attendanceRate}% Presence Rate</div>
          </div>
          <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-2xl">
            <div className="text-[11px] text-slate-400">Overtime Active</div>
            <div className="text-xl font-mono font-black text-amber-400 mt-0.5">{overtimeCount}</div>
            <div className="text-[10px] text-amber-500/80">Extra Shift Crews</div>
          </div>
          <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-2xl">
            <div className="text-[11px] text-slate-400">On Leave</div>
            <div className="text-xl font-mono font-black text-blue-400 mt-0.5">{leaveCount}</div>
            <div className="text-[10px] text-slate-500">Approved Absences</div>
          </div>
          <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-2xl col-span-2 sm:col-span-1">
            <div className="text-[11px] text-slate-400">Unexplained Absent</div>
            <div className="text-xl font-mono font-black text-rose-400 mt-0.5">{absentCount}</div>
            <div className="text-[10px] text-rose-500/80">Requires HR Follow-up</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder={`Search ${platform.toLowerCase()} crew...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 transition"
            />
          </div>

          {/* Date Picker */}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-slate-950/80 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-amber-400"
          />

          {/* Shift selector */}
          <select
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.target.value)}
            className="bg-slate-950/80 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-400"
          >
            <option value="ALL">All Shifts</option>
            <option value="Day">Day Shift</option>
            <option value="Evening">Evening Shift</option>
            <option value="Night">Night Shift</option>
            <option value="General">General Shift</option>
          </select>

          {/* Status selector */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950/80 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-400"
          >
            <option value="ALL">All Statuses</option>
            <option value="Present">Present</option>
            <option value="Overtime">Overtime</option>
            <option value="Leave">Leave</option>
            <option value="Absent">Absent</option>
          </select>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Showing {filteredRecords.length} of {records.length} records
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950/70 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Employee / ID</th>
                <th className="p-3">Role & Category</th>
                <th className="p-3">Shift</th>
                <th className="p-3">Check-In</th>
                <th className="p-3">Check-Out</th>
                <th className="p-3">Overtime</th>
                <th className="p-3">Status</th>
                <th className="p-3">Notes & Operational Context</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3">
                    <div className="font-bold text-white">{rec.employeeName}</div>
                    <div className="text-[10px] font-mono text-slate-500">{rec.employeeId} &bull; {rec.id}</div>
                  </td>
                  <td className="p-3">
                    <div className="text-slate-200">{rec.role}</div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      {rec.category}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="text-slate-300 text-[11px]">{rec.shift}</div>
                  </td>
                  <td className="p-3 font-mono text-slate-300">{rec.checkIn}</td>
                  <td className="p-3 font-mono text-slate-300">{rec.checkOut}</td>
                  <td className="p-3 font-mono">
                    {rec.overtimeHours > 0 ? (
                      <span className="text-amber-400 font-bold">+{rec.overtimeHours} hrs</span>
                    ) : (
                      <span className="text-slate-600">0</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        rec.status === 'Present'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : rec.status === 'Overtime'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : rec.status === 'Leave'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}
                    >
                      {rec.status}
                    </span>
                  </td>
                  <td className="p-3 max-w-xs text-slate-400 truncate text-[11px]">
                    {rec.notes || 'Normal routine'}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          if (onCreateOttTask) {
                            onCreateOttTask(`Follow up attendance for ${rec.employeeName} (${platform})`);
                          }
                          showToast(`Created OTT follow-up for ${rec.employeeName}`);
                        }}
                        title="Create OTT Task"
                        className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition cursor-pointer"
                      >
                        <Clock className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Attendance Modal */}
      {isNewEntryOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <PlatformIcon className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Record {platform} Attendance</h3>
              </div>
              <button
                onClick={() => setIsNewEntryOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAttendance} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Employee / Worker Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Gowda"
                  value={newEmpName}
                  onChange={(e) => setNewEmpName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Operational Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Stone Cutter, Operator, Driver"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Worker">Worker</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Operator">Operator</option>
                    <option value="Driver">Driver</option>
                    <option value="Helper">Helper</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Shift</label>
                  <select
                    value={newShift}
                    onChange={(e) => setNewShift(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Day (06:00-14:00)">Day (06:00-14:00)</option>
                    <option value="Evening (14:00-22:00)">Evening (14:00-22:00)</option>
                    <option value="Night (22:00-06:00)">Night (22:00-06:00)</option>
                    <option value="General (08:30-17:30)">General (08:30-17:30)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Present">Present</option>
                    <option value="Overtime">Overtime</option>
                    <option value="Leave">Leave</option>
                    <option value="Absent">Absent</option>
                  </select>
                </div>
              </div>

              {newStatus === 'Overtime' && (
                <div>
                  <label className="block text-slate-400 mb-1">Overtime Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="12"
                    value={newOvertime}
                    onChange={(e) => setNewOvertime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-400 mb-1">Operational Notes / Machine / Bench Assigned</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Assigned to Laterite Bench #3, machine cutting test"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewEntryOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
