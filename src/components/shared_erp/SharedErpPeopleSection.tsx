import React, { useState } from 'react';
import {
  Users,
  Calendar,
  DollarSign,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  ChevronRight,
  ShieldCheck,
  Building2,
  Truck,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Briefcase
} from 'lucide-react';

export type PeopleTab = 'staff' | 'attendance' | 'payroll' | 'advances' | 'salary-slips' | 'batta';

interface SharedErpPeopleSectionProps {
  onNavigate?: (section: string) => void;
  initialSubTab?: PeopleTab;
}

export const SharedErpPeopleSection: React.FC<SharedErpPeopleSectionProps> = ({
  onNavigate,
  initialSubTab = 'staff'
}) => {
  const [activeTab, setActiveTab] = useState<PeopleTab>(initialSubTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<any | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const STAFF_MEMBERS = [
    {
      id: 'STF-001',
      name: 'Rajesh Nair',
      role: 'SUPERVISOR',
      branch: 'Calicut Laterite Concession #1',
      phone: '+91 98471 22334',
      status: 'ACTIVE',
      baseSalary: 28000,
      advances: 4000,
      battaToday: 350,
      attendanceRate: '98%',
      joined: '12 Jan 2022'
    },
    {
      id: 'STF-002',
      name: 'Mustafa K.',
      role: 'OPERATOR',
      branch: 'Wayanad VSI Sand Plant',
      phone: '+91 94472 88192',
      status: 'ACTIVE',
      baseSalary: 24000,
      advances: 1500,
      battaToday: 400,
      attendanceRate: '95%',
      joined: '04 Mar 2023'
    },
    {
      id: 'STF-003',
      name: 'Arun Varma',
      role: 'DRIVER',
      branch: 'Malabar Fleet Depot',
      phone: '+91 99951 10293',
      status: 'ACTIVE',
      baseSalary: 22000,
      advances: 5000,
      battaToday: 600,
      attendanceRate: '96%',
      joined: '15 Aug 2021'
    },
    {
      id: 'STF-004',
      name: 'Anjali Menon',
      role: 'ACCOUNTANT',
      branch: 'Corporate HQ Calicut',
      phone: '+91 97455 33412',
      status: 'ACTIVE',
      baseSalary: 38000,
      advances: 0,
      battaToday: 0,
      attendanceRate: '100%',
      joined: '01 Feb 2021'
    },
    {
      id: 'STF-005',
      name: 'Suresh Babu',
      role: 'DISPATCH',
      branch: 'Kozhikode Weighbridge #2',
      phone: '+91 98950 44921',
      status: 'ACTIVE',
      baseSalary: 26000,
      advances: 2000,
      battaToday: 250,
      attendanceRate: '92%',
      joined: '10 Jun 2023'
    },
    {
      id: 'STF-006',
      name: 'Bilal Ahmed',
      role: 'STORE',
      branch: 'Central Spare Parts Warehouse',
      phone: '+91 96332 55104',
      status: 'SUSPENDED',
      baseSalary: 20000,
      advances: 8000,
      battaToday: 0,
      attendanceRate: '78%',
      joined: '19 Nov 2023'
    },
    {
      id: 'STF-007',
      name: 'Deepak Mohan',
      role: 'GENERAL MANAGER',
      branch: 'All Mining & Plant Sites',
      phone: '+91 94460 99201',
      status: 'ACTIVE',
      baseSalary: 65000,
      advances: 0,
      battaToday: 0,
      attendanceRate: '99%',
      joined: '01 Jan 2020'
    }
  ];

  const ATTENDANCE_LOGS = [
    { id: 'ATT-101', staff: 'Rajesh Nair', role: 'Supervisor', site: 'Laterite Pit #1', shift: 'Day (07:00 - 17:00)', inTime: '06:52 AM', status: 'PRESENT' },
    { id: 'ATT-102', staff: 'Mustafa K.', role: 'Excavator Operator', site: 'VSI Plant Crusher', shift: 'Day (07:00 - 17:00)', inTime: '07:04 AM', status: 'PRESENT' },
    { id: 'ATT-103', staff: 'Arun Varma', role: 'Tipper Driver (KL-11-BH-4401)', site: 'Fleet Logistics Hub', shift: 'Trip Duty', inTime: '06:15 AM', status: 'ON_ROAD' },
    { id: 'ATT-104', staff: 'Anjali Menon', role: 'Senior Accountant', site: 'Corporate Office', shift: 'General (09:00 - 18:00)', inTime: '08:55 AM', status: 'PRESENT' },
    { id: 'ATT-105', staff: 'Suresh Babu', role: 'Weighbridge Dispatch Clerk', site: 'Weighbridge Gate 1', shift: 'Morning Shift', inTime: '06:45 AM', status: 'PRESENT' },
    { id: 'ATT-106', staff: 'Vikram Singh', role: 'Drilling Specialist', site: 'Laterite Pit Section B', shift: 'Day Shift', inTime: '—', status: 'LEAVE_APPROVED' },
    { id: 'ATT-107', staff: 'Sunil Kumar', role: 'Loader Operator', site: 'Sand Processing Yard', shift: 'Night Shift', inTime: 'Pending', status: 'SCHEDULED' }
  ];

  const PAYROLL_RECORDS = [
    { id: 'PAY-2026-02-01', staff: 'Rajesh Nair', basic: 28000, da: 5600, hra: 4200, overtime: 3200, deductions: 2400, advances: 4000, netSalary: 34600, status: 'PAID' },
    { id: 'PAY-2026-02-02', staff: 'Mustafa K.', basic: 24000, da: 4800, hra: 3600, overtime: 4500, deductions: 2000, advances: 1500, netSalary: 33400, status: 'PROCESSED' },
    { id: 'PAY-2026-02-03', staff: 'Arun Varma', basic: 22000, da: 4400, hra: 3300, overtime: 6800, deductions: 1800, advances: 5000, netSalary: 29700, status: 'PROCESSED' },
    { id: 'PAY-2026-02-04', staff: 'Anjali Menon', basic: 38000, da: 7600, hra: 5700, overtime: 0, deductions: 3500, advances: 0, netSalary: 47800, status: 'PAID' },
    { id: 'PAY-2026-02-05', staff: 'Deepak Mohan', basic: 65000, da: 13000, hra: 9750, overtime: 0, deductions: 6000, advances: 0, netSalary: 81750, status: 'PAID' }
  ];

  const ADVANCES_LOG = [
    { id: 'ADV-801', staff: 'Arun Varma', date: '18 Feb 2026', requested: 10000, approved: 10000, repaid: 5000, balance: 5000, purpose: 'Family Medical Emergency', approver: 'Deepak Mohan' },
    { id: 'ADV-802', staff: 'Rajesh Nair', date: '02 Feb 2026', requested: 5000, approved: 4000, repaid: 0, balance: 4000, purpose: 'Children School Tuition', approver: 'Deepak Mohan' },
    { id: 'ADV-803', staff: 'Mustafa K.', date: '10 Feb 2026', requested: 3000, approved: 3000, repaid: 1500, balance: 1500, purpose: 'Vehicle Repair', approver: 'Rajesh Nair' },
    { id: 'ADV-804', staff: 'Bilal Ahmed', date: '15 Jan 2026', requested: 8000, approved: 8000, repaid: 0, balance: 8000, purpose: 'House Maintenance', approver: 'Deepak Mohan' }
  ];

  const BATTA_LOG = [
    { id: 'BAT-401', staff: 'Arun Varma', role: 'Driver', vehicle: 'KL-11-BH-4401 (10-Wheel Tipper)', route: 'Laterite Pit #1 → Calicut NH 66 Project', trips: 3, dailyBattaRate: 200, totalBatta: 600, status: 'APPROVED' },
    { id: 'BAT-402', staff: 'Kareem PK', role: 'Driver', vehicle: 'KL-18-E-9022 (6-Wheel Tipper)', route: 'VSI Crusher → Wayanad PWD Bypass', trips: 2, dailyBattaRate: 200, totalBatta: 400, status: 'APPROVED' },
    { id: 'BAT-403', staff: 'Mustafa K.', role: 'Operator', vehicle: 'Komatsu PC210 Hydraulic Excavator', route: 'Quarry Face Excavation', trips: 1, dailyBattaRate: 400, totalBatta: 400, status: 'PAID' },
    { id: 'BAT-404', staff: 'Suresh Babu', role: 'Dispatch', vehicle: 'Weighbridge Desk', route: 'Night Weighing Shift', trips: 1, dailyBattaRate: 250, totalBatta: 250, status: 'PENDING' }
  ];

  const filteredStaff = STAFF_MEMBERS.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.branch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 border border-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header with Sub-tabs */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
              Shared ERP Core
            </span>
            <span className="text-slate-500">&bull;</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Studio Preview &bull; Demo / Sample Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span>People & Workforce</span>
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => showToast('Synchronized with Biometric Site Gate')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>Sync Biometrics</span>
          </button>
          <button
            onClick={() => setIsAddStaffOpen(true)}
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Staff</span>
          </button>
        </div>
      </div>

      {/* 6 Macro Sub-tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none pb-1">
        {[
          { id: 'staff' as PeopleTab, label: 'Staff Directory', count: STAFF_MEMBERS.length, icon: Users },
          { id: 'attendance' as PeopleTab, label: 'Site Attendance', count: '94% Active', icon: Clock },
          { id: 'payroll' as PeopleTab, label: 'Payroll & Salary', count: '₹2.26 L', icon: DollarSign },
          { id: 'advances' as PeopleTab, label: 'Staff Advances', count: '₹18.5k Bal', icon: CreditCard },
          { id: 'salary-slips' as PeopleTab, label: 'Salary Slips', count: '5 Ready', icon: FileText },
          { id: 'batta' as PeopleTab, label: 'Driver & Op Batta', count: '₹1,650 Today', icon: Truck }
        ].map((tab) => {
          const Icon = tab.icon;
          const isAct = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap border cursor-pointer ${
                isAct
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                isAct ? 'bg-blue-900 text-white' : 'bg-slate-800 text-slate-300'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: STAFF LIST & DIRECTORY */}
      {activeTab === 'staff' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search staff by name, role, or site..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span>Showing <strong>{filteredStaff.length}</strong> active & contracted personnel</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Staff ID & Name</th>
                    <th className="py-3 px-4">Role & Concession Branch</th>
                    <th className="py-3 px-4">Contact Phone</th>
                    <th className="py-3 px-4">Monthly Salary</th>
                    <th className="py-3 px-4">Advance Bal.</th>
                    <th className="py-3 px-4">Attendance</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {filteredStaff.map((staff) => (
                    <tr key={staff.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white text-sm">{staff.name}</div>
                        <div className="text-[10px] font-mono text-blue-400">{staff.id}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 text-[10px]">
                          {staff.role}
                        </span>
                        <div className="text-[11px] text-slate-400 mt-0.5">{staff.branch}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">{staff.phone}</td>
                      <td className="py-3 px-4 font-mono text-emerald-400 font-bold">
                        ₹{staff.baseSalary.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono text-amber-300">
                        {staff.advances > 0 ? `₹${staff.advances.toLocaleString()}` : '—'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-emerald-400 font-bold">{staff.attendanceRate}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          staff.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {staff.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedStaff(staff);
                            showToast(`Opened profile for ${staff.name}`);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 cursor-pointer transition"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SITE ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Total Roster Present</span>
              <div className="text-2xl font-black text-white font-mono mt-1">42 / 45</div>
              <span className="text-[10px] text-emerald-400 font-bold">93.3% On-site turnout</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Active Tipper Drivers</span>
              <div className="text-2xl font-black text-blue-400 font-mono mt-1">18 On Road</div>
              <span className="text-[10px] text-slate-500">2 on quarry standby</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Approved Leave</span>
              <div className="text-2xl font-black text-amber-400 font-mono mt-1">2 Staff</div>
              <span className="text-[10px] text-slate-500">Drilling Team #2</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Biometric Device Status</span>
              <div className="text-lg font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>3 Gates Synced</span>
              </div>
              <span className="text-[10px] text-slate-500">Last heartbeat: 2 mins ago</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Daily Site Punch & Attendance Log</h3>
              <button
                onClick={() => showToast('Attendance report exported to CSV')}
                className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 flex items-center gap-1 transition cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Export Log</span>
              </button>
            </div>
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Log ID</th>
                  <th className="py-3 px-4">Staff & Role</th>
                  <th className="py-3 px-4">Concession Site / Machine</th>
                  <th className="py-3 px-4">Shift</th>
                  <th className="py-3 px-4">Punch In Time</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {ATTENDANCE_LOGS.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono text-slate-400">{log.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{log.staff}</div>
                      <div className="text-[11px] text-blue-400">{log.role}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{log.site}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{log.shift}</td>
                    <td className="py-3 px-4 font-mono text-emerald-400 font-bold">{log.inTime}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 'PRESENT' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        log.status === 'ON_ROAD' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        log.status === 'LEAVE_APPROVED' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {log.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PAYROLL */}
      {activeTab === 'payroll' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <div>
              <div className="text-xs text-slate-400">Active Payroll Cycle</div>
              <div className="text-base font-bold text-white">February 2026 Monthly Payroll</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => showToast('Disbursement batch sent to Bank NEFT portal')}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                Disburse Payroll Batch
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Pay Slip ID</th>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Basic + DA</th>
                  <th className="py-3 px-4">HRA & Allowances</th>
                  <th className="py-3 px-4">Overtime</th>
                  <th className="py-3 px-4">Adv Deductions</th>
                  <th className="py-3 px-4">Net Payable</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {PAYROLL_RECORDS.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono text-slate-400">{p.id}</td>
                    <td className="py-3 px-4 font-bold text-white">{p.staff}</td>
                    <td className="py-3 px-4 font-mono">₹{(p.basic + p.da).toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono text-slate-300">₹{p.hra.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono text-amber-400 font-bold">
                      {p.overtime > 0 ? `+₹${p.overtime.toLocaleString()}` : '—'}
                    </td>
                    <td className="py-3 px-4 font-mono text-rose-400 font-bold">
                      {p.advances > 0 ? `-₹${p.advances.toLocaleString()}` : '—'}
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-400 font-black text-sm">
                      ₹{p.netSalary.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ADVANCES */}
      {activeTab === 'advances' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <div>
              <div className="text-xs text-slate-400">Total Outstanding Staff Advances</div>
              <div className="text-2xl font-black text-amber-400 font-mono">₹18,500</div>
            </div>
            <button
              onClick={() => showToast('Issue New Advance Modal Triggered')}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Issue Salary Advance</span>
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Advance ID</th>
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Date Approved</th>
                  <th className="py-3 px-4">Sanctioned Amount</th>
                  <th className="py-3 px-4">Repaid</th>
                  <th className="py-3 px-4">Outstanding Balance</th>
                  <th className="py-3 px-4">Purpose</th>
                  <th className="py-3 px-4">Approver</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {ADVANCES_LOG.map((adv) => (
                  <tr key={adv.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono text-slate-400">{adv.id}</td>
                    <td className="py-3 px-4 font-bold text-white">{adv.staff}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{adv.date}</td>
                    <td className="py-3 px-4 font-mono font-bold text-white">₹{adv.approved.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono text-emerald-400">₹{adv.repaid.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono text-amber-400 font-bold">₹{adv.balance.toLocaleString()}</td>
                    <td className="py-3 px-4 text-slate-300">{adv.purpose}</td>
                    <td className="py-3 px-4 text-slate-400">{adv.approver}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: SALARY SLIPS */}
      {activeTab === 'salary-slips' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">Official Pay Slip Preview</h3>
              <p className="text-xs text-slate-400">Generated automatically from biometric attendance & deductions</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => showToast('Printing Official Salary Slip')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Slip</span>
              </button>
              <button
                onClick={() => showToast('PDF Salary Slip downloaded')}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 max-w-2xl mx-auto space-y-4 font-mono text-xs">
            <div className="border-b border-slate-800 pb-3 flex justify-between items-start">
              <div>
                <div className="text-base font-black text-amber-400">RZ MINING & INFRASTRUCTURE PVT LTD</div>
                <div className="text-[11px] text-slate-400">Calicut Concession Sector 4 &bull; GSTIN: 32AABCR1234F1Z8</div>
              </div>
              <div className="text-right text-[11px] text-slate-400">
                <div>Month: FEB 2026</div>
                <div>Slip: SLIP-2026-02-001</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px] border-b border-slate-800 pb-3">
              <div><span className="text-slate-500">Employee Name:</span> <strong className="text-white">Rajesh Nair</strong></div>
              <div><span className="text-slate-500">Designation:</span> <strong className="text-white">Supervisor (Quarry)</strong></div>
              <div><span className="text-slate-500">Employee ID:</span> <strong className="text-amber-400">STF-001</strong></div>
              <div><span className="text-slate-500">Days Worked:</span> <strong className="text-white">28 / 28 Days</strong></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-400 uppercase">Earnings</div>
                <div className="flex justify-between"><span>Basic Pay</span><span>₹28,000</span></div>
                <div className="flex justify-between"><span>Dearness Allowance (DA)</span><span>₹5,600</span></div>
                <div className="flex justify-between"><span>HRA</span><span>₹4,200</span></div>
                <div className="flex justify-between"><span>Site Overtime</span><span>₹3,200</span></div>
                <div className="flex justify-between border-t border-slate-800 pt-1 font-bold text-white">
                  <span>Gross Earnings</span><span>₹41,000</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-400 uppercase">Deductions</div>
                <div className="flex justify-between"><span>Provident Fund (PF)</span><span>₹1,800</span></div>
                <div className="flex justify-between"><span>ESI Statutory</span><span>₹600</span></div>
                <div className="flex justify-between"><span>Salary Advance Deduction</span><span>₹4,000</span></div>
                <div className="flex justify-between border-t border-slate-800 pt-1 font-bold text-rose-400">
                  <span>Total Deductions</span><span>₹6,400</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-sm font-bold">
              <span className="text-slate-300">NET SALARY PAYABLE:</span>
              <span className="text-emerald-400 text-lg">₹34,600</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: BATTA LOG */}
      {activeTab === 'batta' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <div>
              <div className="text-xs text-slate-400">Today&apos;s Dispatched Batta Accruals</div>
              <div className="text-xl font-black text-amber-400 font-mono">₹1,650 across 7 trips</div>
            </div>
            <button
              onClick={() => showToast('All approved batta disbursed via cash desk')}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer"
            >
              Disburse Today&apos;s Batta
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Batta Slip</th>
                  <th className="py-3 px-4">Driver / Operator</th>
                  <th className="py-3 px-4">Assigned Vehicle / Machinery</th>
                  <th className="py-3 px-4">Dispatch Route</th>
                  <th className="py-3 px-4">Trips</th>
                  <th className="py-3 px-4">Rate</th>
                  <th className="py-3 px-4">Total Accrued</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {BATTA_LOG.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono text-slate-400">{b.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{b.staff}</div>
                      <div className="text-[10px] text-blue-400">{b.role}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">{b.vehicle}</td>
                    <td className="py-3 px-4 text-slate-400">{b.route}</td>
                    <td className="py-3 px-4 font-mono text-center">{b.trips}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">₹{b.dailyBattaRate}</td>
                    <td className="py-3 px-4 font-mono text-emerald-400 font-bold">₹{b.totalBatta}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        b.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        b.status === 'APPROVED' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
