import React, { useState } from 'react';
import {
  X,
  User,
  Clock,
  DollarSign,
  CreditCard,
  Truck,
  FolderLock,
  Activity,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Printer,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Employee } from '../types';

interface EmployeeProfileModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
  onOpenPrintModal?: (title: string, data: any) => void;
}

export const EmployeeProfileModal: React.FC<EmployeeProfileModalProps> = ({
  employee,
  isOpen,
  onClose,
  onToast,
  onOpenPrintModal
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'attendance' | 'salary' | 'advances' | 'batta' | 'documents' | 'activity'
  >('overview');

  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Profile Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/60 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src={employee.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
              alt={employee.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-500/50 shadow-xl shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-black text-white">{employee.name}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                  {employee.id}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/30">
                  {employee.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-1">
                {employee.designation} &bull; <span className="text-amber-400">{employee.department}</span>
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2 font-mono">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{employee.branch}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{employee.phone}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{employee.email}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 7 Tabs Bar */}
        <div className="flex items-center gap-1.5 px-6 pt-3 pb-2 border-b border-slate-800 bg-slate-900 overflow-x-auto scrollbar-none font-mono">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'attendance', label: 'Attendance', icon: Clock },
            { id: 'salary', label: 'Salary Setup', icon: DollarSign },
            { id: 'advances', label: 'Advances', icon: CreditCard },
            { id: 'batta', label: 'Batta', icon: Truck },
            { id: 'documents', label: 'Documents', icon: FolderLock },
            { id: 'activity', label: 'Activity Log', icon: Activity }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 font-mono text-xs">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Overview Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Joining Date</span>
                  <div className="text-base font-bold text-white mt-1">{employee.joiningDate}</div>
                  <span className="text-[10px] text-slate-400 font-sans">Full Time Roll</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Current Salary</span>
                  <div className="text-base font-bold text-emerald-400 mt-1">
                    ₹{employee.salaryRate.toLocaleString('en-IN')}{' '}
                    <span className="text-[10px] text-slate-400">{employee.salaryType === 'Daily Wage' ? '/day' : '/mo'}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-sans">{employee.salaryType}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Attendance This Month</span>
                  <div className="text-base font-bold text-cyan-400 mt-1">{employee.attendanceThisMonth} Days</div>
                  <span className="text-[10px] text-emerald-400">96.8% Present Rate</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Leave Balance</span>
                  <div className="text-base font-bold text-amber-400 mt-1">{employee.leaveBalance} Days</div>
                  <span className="text-[10px] text-slate-400 font-sans">Casual + Sick + Annual</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Advance Balance</span>
                  <div className="text-base font-bold text-yellow-400 mt-1">₹{employee.advanceBalance.toLocaleString('en-IN')}</div>
                  <span className="text-[10px] text-slate-400 font-sans">Monthly recovery active</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Pending Salary</span>
                  <div className="text-base font-bold text-white mt-1">₹{employee.pendingSalary.toLocaleString('en-IN')}</div>
                  <span className="text-[10px] text-emerald-400">No arrears outstanding</span>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Staff Quick Operations:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onToast(`Marked today's attendance for ${employee.name}`)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Attendance</span>
                  </button>
                  <button
                    onClick={() => onToast(`Opened new Staff Advance slip for ${employee.name}`)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-yellow-400 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Staff Advance</span>
                  </button>
                  <button
                    onClick={() => onToast(`Logged Batta voucher for ${employee.name}`)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Log Batta</span>
                  </button>
                  <button
                    onClick={() => onToast(`Generated current payroll calculation for ${employee.name}`)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Calculate Salary</span>
                  </button>
                  <button
                    onClick={() => onToast(`Opened document uploader for ${employee.name}`)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-400 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Document</span>
                  </button>
                  <button
                    onClick={() => onOpenPrintModal?.(`Employee Profile: ${employee.name} (${employee.id})`, employee)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer ml-auto"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Dossier</span>
                  </button>
                </div>
              </div>

              {/* Personal & Emergency Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <span className="text-[11px] font-bold text-amber-400 uppercase">Personal Information</span>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Date of Birth:</span>
                    <span>{employee.dob}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Gender:</span>
                    <span>{employee.gender}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Permanent Address:</span>
                    <span className="text-right max-w-[200px] truncate">{employee.address}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <span className="text-[11px] font-bold text-amber-400 uppercase">Emergency Contact &amp; Banking</span>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Contact Person:</span>
                    <span>{employee.emergencyContact.name} ({employee.emergencyContact.relation})</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Emergency Phone:</span>
                    <span className="text-amber-300">{employee.emergencyContact.phone}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Disbursement Bank:</span>
                    <span>{employee.bankDetails.bankName} (A/C: {employee.bankDetails.accountNo})</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ATTENDANCE */}
          {activeTab === 'attendance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">Monthly Attendance Roll (March 2026)</span>
                <span className="text-[10px] text-emerald-400 font-bold">23 Present &bull; 1 Leave &bull; 0 Absent</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono">
                <div className="flex justify-between text-slate-500 text-[10px] pb-1 border-b border-slate-800">
                  <span>DATE</span>
                  <span>SHIFT</span>
                  <span>IN / OUT</span>
                  <span>STATUS</span>
                  <span>HOURS / OT</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>24 Mar 2026</span>
                  <span>Quarry Pithead Shift</span>
                  <span>06:24 AM / 03:15 PM</span>
                  <span className="text-emerald-400 font-bold">Present</span>
                  <span>8.8 hrs (0.8 OT)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>23 Mar 2026</span>
                  <span>Quarry Pithead Shift</span>
                  <span>06:28 AM / 02:30 PM</span>
                  <span className="text-emerald-400 font-bold">Present</span>
                  <span>8.0 hrs</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>22 Mar 2026</span>
                  <span>Weekly Off Sunday</span>
                  <span>- / -</span>
                  <span className="text-blue-400 font-bold">Weekly Off</span>
                  <span>0.0 hrs</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SALARY */}
          {activeTab === 'salary' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-[11px] font-bold text-amber-400 uppercase">Compensation Package Breakdown</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Basic Base</span>
                    <span className="text-sm font-black text-white font-mono">₹{employee.salaryRate.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Overtime Rate</span>
                    <span className="text-sm font-black text-purple-400 font-mono">₹{employee.overtimeRate} / hr</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Batta Eligibility</span>
                    <span className="text-sm font-black text-amber-400 font-mono">{employee.battaEligible ? 'Eligible' : 'Not Eligible'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Payment Channel</span>
                    <span className="text-sm font-black text-cyan-400 font-mono">{employee.paymentMode}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ADVANCES */}
          {activeTab === 'advances' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-white uppercase">Active Advance Recovery Plan</span>
                  <span className="text-xs font-bold text-yellow-400 font-mono">Outstanding: ₹{employee.advanceBalance.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-xs text-slate-400 font-sans">
                  Recovered automatically via monthly payroll run. Standard deduction installment: ₹1,000 / month.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: BATTA */}
          {activeTab === 'batta' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-white uppercase">Batta &amp; Field Allowances</span>
                <p className="text-xs text-slate-400 font-sans">
                  Total batta booked this month: <strong className="text-amber-400">₹4,200</strong> across 12 operational field logs.
                </p>
              </div>
            </div>
          )}

          {/* TAB 6: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-white uppercase">KYC &amp; Statutory Licenses ({employee.documentsCount})</span>
                <p className="text-xs text-slate-400 font-sans">
                  Verified documents stored in secure digital vault.
                </p>
              </div>
            </div>
          )}

          {/* TAB 7: ACTIVITY */}
          {activeTab === 'activity' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-white uppercase">Workforce Audit Trail</span>
                <div className="text-slate-300 space-y-1">
                  <div>&bull; 24 Mar 2026: Shift check-in logged at 06:24 AM</div>
                  <div>&bull; 20 Mar 2026: Salary disbursement ₹34,240 cleared via NEFT</div>
                  <div>&bull; 10 Jan 2026: Staff advance ₹10,000 sanctioned by MD</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
