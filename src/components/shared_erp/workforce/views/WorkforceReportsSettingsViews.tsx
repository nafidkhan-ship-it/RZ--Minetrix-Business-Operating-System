import React, { useState } from 'react';
import {
  BarChart3,
  Settings,
  FileText,
  Printer,
  Download,
  Filter,
  Eye,
  CheckCircle2,
  Calendar,
  Clock,
  DollarSign,
  CreditCard,
  Truck,
  Building2,
  FolderLock,
  Save,
  ShieldCheck
} from 'lucide-react';
import { WorkforceSectionTab } from '../types';

interface ViewProps {
  onToast: (msg: string) => void;
  onOpenPrintModal?: (title: string, data: any) => void;
  onNavigateTab?: (tab: WorkforceSectionTab) => void;
}

/* ========================================================================
   1. WORKFORCE REPORTS VIEW (14 Reports)
   ======================================================================== */
export const WorkforceReportsView: React.FC<ViewProps> = ({ onToast, onOpenPrintModal }) => {
  const REPORTS: {
    id: string;
    title: string;
    category: string;
    description: string;
    frequency: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'REP-01', title: 'Employee Register', category: 'Master Directory', description: 'Comprehensive on-roll staff directory with personal details, qualifications, and joining dates.', frequency: 'Monthly', icon: FileText },
    { id: 'REP-02', title: 'Attendance Report', category: 'Time & Muster', description: 'Daily attendance logs with in/out timestamps, late flags, and missed punch markers.', frequency: 'Daily', icon: Clock },
    { id: 'REP-03', title: 'Monthly Attendance Summary', category: 'Time & Muster', description: 'Consolidated working days, paid holidays, and aggregate attendance percentages.', frequency: 'Monthly', icon: Calendar },
    { id: 'REP-04', title: 'Absence Report', category: 'Exceptions', description: 'Unplanned absenteeism and unauthorized leaves categorized by department and shift.', frequency: 'Weekly', icon: Calendar },
    { id: 'REP-05', title: 'Late Arrival Report', category: 'Exceptions', description: 'Grace period breaches (>15m) and cumulative tardiness minutes impacting wage runs.', frequency: 'Weekly', icon: Clock },
    { id: 'REP-06', title: 'Overtime Report', category: 'Wages & OT', description: 'Overtime hours logged by shift, multiplier rates, and pithead emergency operations.', frequency: 'Bi-Weekly', icon: Clock },
    { id: 'REP-07', title: 'Leave Utilization Report', category: 'Time Off', description: 'Casual, medical, and annual leave balances with opening/closing quotas.', frequency: 'Monthly', icon: Calendar },
    { id: 'REP-08', title: 'Payroll Master Report', category: 'Payroll', description: 'Gross salaries, advance recoveries, statutory deductions (PF/ESI), and net pay.', frequency: 'Monthly', icon: DollarSign },
    { id: 'REP-09', title: 'Salary Summary by Grade', category: 'Payroll', description: 'Executive, supervisor, operator, and daily wage cost distribution per unit.', frequency: 'Monthly', icon: DollarSign },
    { id: 'REP-10', title: 'Staff Advance & Recovery Report', category: 'Ledgers', description: 'Active advance loans, repayment schedules, monthly deductions, and ledger balances.', frequency: 'Monthly', icon: CreditCard },
    { id: 'REP-11', title: 'Batta & Allowances Report', category: 'Logistics & Field', description: 'Fleet trip batta, outstation per diems, night halt vouchers, and food allowances.', frequency: 'Weekly', icon: Truck },
    { id: 'REP-12', title: 'Department Workforce Report', category: 'Organization', description: 'Headcount metrics, overtime ratios, and staffing capacity across 14 departments.', frequency: 'Monthly', icon: Building2 },
    { id: 'REP-13', title: 'Staff Document Expiry Audit', category: 'Compliance', description: 'DGMS mining competency, PESO blaster certificates, and HMV license expiry warnings.', frequency: 'Weekly', icon: FolderLock },
    { id: 'REP-14', title: 'Workforce Cost Summary', category: 'Executive Finance', description: 'Complete workforce cost overview: base wages, batta, overtime, and HR overheads.', frequency: 'Monthly', icon: BarChart3 }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              WORKFORCE AUDIT &amp; ANALYTICS
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
              STUDIO PREVIEW / DEMO DATA
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <span>Workforce Management Reports (14 Standard Formats)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Statutory compliance registers, attendance audits, payroll summaries, and management dashboards.
          </p>
        </div>

        <button
          onClick={() => onToast('Generated Full Workforce Audit Package')}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-amber-500/20"
        >
          <Download className="w-4 h-4" />
          <span>Export All Reports</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
        {REPORTS.map((rep) => {
          const Icon = rep.icon;
          return (
            <div
              key={rep.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl hover:border-amber-500/40 transition flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-400 font-bold">{rep.id}</span>
                      <h3 className="text-xs font-bold text-white font-sans">{rep.title}</h3>
                    </div>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-bold">
                    {rep.frequency}
                  </span>
                </div>

                <div className="mt-2">
                  <span className="text-[10px] text-cyan-400 font-bold block">{rep.category}</span>
                  <p className="text-[11px] text-slate-400 font-sans mt-1 line-clamp-2">
                    {rep.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center gap-1.5 font-sans">
                <button
                  onClick={() => onToast(`Generating preview for ${rep.title}`)}
                  className="flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer transition flex items-center justify-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>
                <button
                  onClick={() => onOpenPrintModal?.(rep.title, { reportId: rep.id, generatedAt: new Date().toISOString() })}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                  title="Print"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onToast(`Exported ${rep.title} as CSV/Excel`)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 cursor-pointer"
                  title="Download CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ========================================================================
   2. WORKFORCE SETTINGS VIEW
   ======================================================================== */
export const WorkforceSettingsView: React.FC<ViewProps> = ({ onToast }) => {
  const [workingHours, setWorkingHours] = useState('8.0');
  const [gracePeriod, setGracePeriod] = useState('15');
  const [otMultiplier, setOtMultiplier] = useState('1.5');
  const [casualLeaveQuota, setCasualLeaveQuota] = useState('12');
  const [sickLeaveQuota, setSickLeaveQuota] = useState('12');
  const [biometricGatewayIp, setBiometricGatewayIp] = useState('192.168.1.120:4370');

  const handleSave = () => {
    onToast('Workforce governance configuration saved successfully');
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              WORKFORCE GOVERNANCE &amp; POLICIES
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
              STUDIO PREVIEW / DEMO DATA
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <span>Workforce Rules, Quotas &amp; Shifts Configuration</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Global attendance parameters, overtime calculation rules, leave accrual schemes, and hardware gateway endpoints.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-amber-500/20"
        >
          <Save className="w-4 h-4" />
          <span>Save Policy Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
        {/* Working Hours & Shift Rules */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
            1. Attendance &amp; Shift Rules
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-slate-400 text-[11px] font-bold block mb-1">
                Standard Working Hours Per Shift
              </label>
              <input
                type="text"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-slate-400 text-[11px] font-bold block mb-1">
                Late Arrival Grace Period (Minutes)
              </label>
              <input
                type="text"
                value={gracePeriod}
                onChange={(e) => setGracePeriod(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-orange-400 font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-slate-400 text-[11px] font-bold block mb-1">
                Standard Overtime Multiplier Rate
              </label>
              <input
                type="text"
                value={otMultiplier}
                onChange={(e) => setOtMultiplier(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-purple-400 font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Leave Quotas & Accrual */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
            2. Annual Leave Quotas
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-slate-400 text-[11px] font-bold block mb-1">
                Annual Casual Leave (CL) Quota
              </label>
              <input
                type="text"
                value={casualLeaveQuota}
                onChange={(e) => setCasualLeaveQuota(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-slate-400 text-[11px] font-bold block mb-1">
                Annual Sick Leave (SL) Quota
              </label>
              <input
                type="text"
                value={sickLeaveQuota}
                onChange={(e) => setSickLeaveQuota(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-slate-400 text-[11px] font-bold block mb-1">
                Biometric Gateway Endpoint Address
              </label>
              <input
                type="text"
                value={biometricGatewayIp}
                onChange={(e) => setBiometricGatewayIp(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
