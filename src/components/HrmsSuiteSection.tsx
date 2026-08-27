import React, { useState, useEffect, useCallback } from 'react';
import { 
  HRMS_SUITE_MODULES, 
  WORKFORCE_CATEGORIES_DATA, 
  SPECIALIZED_WORKFLOWS, 
  HRMS_INTEGRATION_TOPOLOGY, 
  HRMS_FOLDER_STRUCTURE, 
  HRMS_SECURITY_AND_SCALABILITY, 
  PHASE11_TRANSITION_REVIEW 
} from '../data/hrmsSuiteData';
import { HrmsSuiteModule } from '../types/architecture';
import { 
  LayoutDashboard, 
  UserCheck, 
  Users, 
  Fingerprint, 
  Clock, 
  Calculator, 
  Coins, 
  TrendingUp, 
  Receipt, 
  Calendar, 
  Award, 
  UserPlus, 
  GraduationCap, 
  Smartphone, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  ArrowRight, 
  Cpu, 
  Zap, 
  Activity, 
  Search, 
  Database, 
  Lock, 
  ShieldCheck, 
  FolderTree, 
  Briefcase,
  Building2,
  Truck,
  Pickaxe,
  RefreshCw
} from 'lucide-react';
import { apiClient } from '../services/apiClient';

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  UserCheck,
  Users,
  Fingerprint,
  Clock,
  Calculator,
  Coins,
  TrendingUp,
  Receipt,
  Calendar,
  Award,
  UserPlus,
  GraduationCap,
  Smartphone,
  FileText,
  Sparkles,
  FolderTree,
  Briefcase
};

export const HrmsSuiteSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'live-ops' | 'modules' | 'categories' | 'workflows' | 'integrations' | 'structure' | 'security' | 'review'>('live-ops');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModule, setActiveModule] = useState<HrmsSuiteModule>(HRMS_SUITE_MODULES[0]);

  const categories = ['All', 'Workforce Core', 'Attendance & Shifts', 'Payroll & Settlements', 'Incentives & Advances', 'Talent & ESS', 'Intelligence & Analytics'];

  const filteredModules = HRMS_SUITE_MODULES.filter(mod => {
    const matchesCategory = selectedCategory === 'All' || mod.category === selectedCategory;
    const matchesSearch = mod.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          mod.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          mod.subModules.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [payroll, setPayroll] = useState<any[]>([]);
  const [payStructures, setPayStructures] = useState<any[]>([]);
  const [employeeForm, setEmployeeForm] = useState({
    code: '',
    fullName: '',
    phone: '',
    department: 'Mining',
    designation: 'Plant Operator',
    joiningDate: new Date().toISOString().slice(0, 10),
    payStructureId: ''
  });
  const [attendanceForm, setAttendanceForm] = useState({
    employeeId: '',
    workDate: new Date().toISOString().slice(0, 10),
    status: 'PRESENT'
  });
  const [leaveForm, setLeaveForm] = useState({
    employeeId: '',
    leaveType: 'CL',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    reason: ''
  });
  const [payrollForm, setPayrollForm] = useState({
    employeeId: '',
    periodYear: new Date().getUTCFullYear(),
    periodMonth: new Date().getUTCMonth() + 1
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const loadHrms = useCallback(async () => {
    if (!apiClient.getAuthToken()) {
      setEmployees([]);
      setAttendance([]);
      setLeaves([]);
      setPayroll([]);
      setPayStructures([]);
      return;
    }
    const [emp, att, lv, pay, structures] = await Promise.all([
      apiClient.listHrmsEmployees(),
      apiClient.listHrmsAttendance(),
      apiClient.listHrmsLeaveRequests(),
      apiClient.listHrmsPayroll(),
      apiClient.listHrmsPayStructures()
    ]);
    if (emp.success && Array.isArray(emp.data)) setEmployees(emp.data);
    else if (emp.message) showToast(emp.message);
    if (att.success && Array.isArray(att.data)) setAttendance(att.data);
    if (lv.success && Array.isArray(lv.data)) setLeaves(lv.data);
    if (pay.success && Array.isArray(pay.data)) setPayroll(pay.data);
    if (structures.success && Array.isArray(structures.data)) setPayStructures(structures.data);
  }, []);

  useEffect(() => {
    if (activeTab === 'live-ops') {
      loadHrms();
    }
  }, [activeTab, loadHrms]);

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiClient.getAuthToken()) {
      showToast('Login via Shared Core to manage employees');
      return;
    }
    let payStructureId = employeeForm.payStructureId;
    if (!payStructureId) {
      const createdPay = await apiClient.createHrmsPayStructure({
        code: `PAY-${Date.now().toString().slice(-6)}`,
        name: 'Default Operator Grade',
        basicSalary: 30000,
        allowanceAmount: 2000,
        pfPercent: 12,
        otherDeductionAmount: 500,
        overtimeRatePerHour: 100
      });
      if (!createdPay.success) {
        showToast(createdPay.message || 'Unable to create pay structure');
        return;
      }
      payStructureId = createdPay.data.id;
    }
    const res = await apiClient.createHrmsEmployee({
      code: employeeForm.code.trim().toUpperCase(),
      fullName: employeeForm.fullName.trim(),
      phone: employeeForm.phone.trim() || undefined,
      joiningDate: employeeForm.joiningDate,
      department: employeeForm.department,
      designation: employeeForm.designation,
      payStructureId
    });
    if (res.success) {
      showToast(`Employee ${res.data.code} created`);
      setEmployeeForm({ ...employeeForm, code: '', fullName: '', phone: '', payStructureId });
      await loadHrms();
    } else {
      showToast(res.message || 'Failed to create employee');
    }
  };

  const handleCreateAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiClient.getAuthToken()) {
      showToast('Login via Shared Core to record attendance');
      return;
    }
    const res = await apiClient.createHrmsAttendance({
      employeeId: attendanceForm.employeeId,
      workDate: attendanceForm.workDate,
      status: attendanceForm.status
    });
    if (res.success) {
      showToast(`Attendance ${res.data.status} saved`);
      await loadHrms();
    } else {
      showToast(res.message || 'Failed to record attendance');
    }
  };

  const handleCreateLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiClient.getAuthToken()) {
      showToast('Login via Shared Core to request leave');
      return;
    }
    const res = await apiClient.createHrmsLeaveRequest({
      employeeId: leaveForm.employeeId,
      leaveType: leaveForm.leaveType,
      startDate: leaveForm.startDate,
      endDate: leaveForm.endDate,
      reason: leaveForm.reason || undefined
    });
    if (res.success) {
      showToast(`Leave ${res.data.id} requested`);
      await loadHrms();
    } else {
      showToast(res.message || 'Failed to request leave');
    }
  };

  const handleApproveLeave = async (leaveId: string) => {
    const res = await apiClient.approveHrmsLeave(leaveId);
    showToast(res.success ? `Leave approved` : res.message || 'Approve failed');
    await loadHrms();
  };

  const handleCreatePayroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiClient.getAuthToken()) {
      showToast('Login via Shared Core to run payroll');
      return;
    }
    const res = await apiClient.createHrmsPayroll({
      employeeId: payrollForm.employeeId,
      periodYear: Number(payrollForm.periodYear),
      periodMonth: Number(payrollForm.periodMonth)
    });
    if (res.success) {
      showToast(`Payroll posted net ₹${res.data.netAmount}`);
      await loadHrms();
    } else {
      showToast(res.message || 'Failed to run payroll');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/60 border border-indigo-500/20 p-6 sm:p-8 backdrop-blur-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Phase 10 Master Architecture</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Enterprise HRMS & Workforce Management Suite
            </h1>
            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              Unified workforce management architecture tailored for Mining Quarries, Heavy Fleet Logistics, Crusher Plants, Building Material Yards, CRM Projects, and Corporate Offices. Covers 16 specialized modules, multi-modal biometric attendance, Saturday weekly wage settlements, telematics-linked driver incentives, and Gemini AI workforce copilot.
            </p>

            {/* Architectural Philosophy Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono text-indigo-300">
              <span className="px-2.5 py-1 rounded bg-slate-950 border border-indigo-500/30">One HR Platform</span>
              <span className="text-slate-500">→</span>
              <span className="px-2.5 py-1 rounded bg-slate-950 border border-indigo-500/30">Multiple Companies</span>
              <span className="text-slate-500">→</span>
              <span className="px-2.5 py-1 rounded bg-slate-950 border border-indigo-500/30">Multiple Business Units</span>
              <span className="text-slate-500">→</span>
              <span className="px-2.5 py-1 rounded bg-slate-950 border border-indigo-500/30">Integrated Payroll & Finance</span>
              <span className="text-slate-500">→</span>
              <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-200 border border-indigo-500/40 font-bold">Workforce Optimization</span>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-col gap-3 shrink-0">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-indigo-500/20 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Workforce Types</div>
                <div className="text-sm font-bold text-white">12 Distinct Categories</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-indigo-500/20 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Weekly Payouts</div>
                <div className="text-sm font-bold text-white">Saturday Wage Tally</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-slate-800/80 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('live-ops')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'live-ops'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Live HRMS</span>
          </button>

          <button
            onClick={() => setActiveTab('modules')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'modules'
                ? 'bg-indigo-500 text-slate-950 font-bold shadow-lg shadow-indigo-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>16 HRMS Modules</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-indigo-500 text-slate-950 font-bold shadow-lg shadow-indigo-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Workforce Categories</span>
          </button>

          <button
            onClick={() => setActiveTab('workflows')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'workflows'
                ? 'bg-indigo-500 text-slate-950 font-bold shadow-lg shadow-indigo-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <ArrowRight className="w-4 h-4" />
            <span>Specialized Business Workflows</span>
          </button>

          <button
            onClick={() => setActiveTab('integrations')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'integrations'
                ? 'bg-indigo-500 text-slate-950 font-bold shadow-lg shadow-indigo-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Integration Topology</span>
          </button>

          <button
            onClick={() => setActiveTab('structure')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'structure'
                ? 'bg-indigo-500 text-slate-950 font-bold shadow-lg shadow-indigo-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Folder Structure</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'security'
                ? 'bg-indigo-500 text-slate-950 font-bold shadow-lg shadow-indigo-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Security & Scalability</span>
          </button>

          <button
            onClick={() => setActiveTab('review')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'review'
                ? 'bg-purple-500 text-slate-950 font-bold shadow-lg shadow-purple-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Phase 11 Transition Plan</span>
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-950 border border-emerald-500/40 text-sm text-emerald-200 shadow-xl">
          {toastMsg}
        </div>
      )}

      {activeTab === 'live-ops' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">PostgreSQL-backed employees, attendance, leave, and server-calculated payroll. Login on Shared Core first.</p>
            <button
              onClick={() => loadHrms()}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 hover:bg-slate-800"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <form onSubmit={handleCreateEmployee} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white">Employee master</h3>
              <input className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" placeholder="EMP-CODE" value={employeeForm.code} onChange={(e) => setEmployeeForm({ ...employeeForm, code: e.target.value })} required />
              <input className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" placeholder="Full name" value={employeeForm.fullName} onChange={(e) => setEmployeeForm({ ...employeeForm, fullName: e.target.value })} required />
              <div className="grid grid-cols-2 gap-2">
                <input className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" placeholder="Phone" value={employeeForm.phone} onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })} />
                <input type="text" inputMode="numeric" placeholder="YYYY-MM-DD" pattern="\d{4}-\d{2}-\d{2}" className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" value={employeeForm.joiningDate} onChange={(e) => setEmployeeForm({ ...employeeForm, joiningDate: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" placeholder="Department" value={employeeForm.department} onChange={(e) => setEmployeeForm({ ...employeeForm, department: e.target.value })} />
                <input className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" placeholder="Designation" value={employeeForm.designation} onChange={(e) => setEmployeeForm({ ...employeeForm, designation: e.target.value })} />
              </div>
              <button type="submit" className="w-full py-2 rounded-lg bg-emerald-500 text-slate-950 text-sm font-bold">Create employee</button>
            </form>

            <form onSubmit={handleCreateAttendance} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white">Attendance</h3>
              <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" value={attendanceForm.employeeId} onChange={(e) => setAttendanceForm({ ...attendanceForm, employeeId: e.target.value })} required>
                <option value="">Select employee</option>
                {employees.map((row) => (
                  <option key={row.id} value={row.id}>{row.code} — {row.fullName}</option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" inputMode="numeric" placeholder="YYYY-MM-DD" pattern="\d{4}-\d{2}-\d{2}" className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" value={attendanceForm.workDate} onChange={(e) => setAttendanceForm({ ...attendanceForm, workDate: e.target.value })} />
                <select className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" value={attendanceForm.status} onChange={(e) => setAttendanceForm({ ...attendanceForm, status: e.target.value })}>
                  {['PRESENT', 'ABSENT', 'HALF_DAY', 'HOLIDAY', 'OFF'].map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="w-full py-2 rounded-lg bg-indigo-500 text-slate-950 text-sm font-bold">Record attendance</button>
            </form>

            <form onSubmit={handleCreateLeave} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white">Leave request</h3>
              <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" value={leaveForm.employeeId} onChange={(e) => setLeaveForm({ ...leaveForm, employeeId: e.target.value })} required>
                <option value="">Select employee</option>
                {employees.map((row) => (
                  <option key={row.id} value={row.id}>{row.code} — {row.fullName}</option>
                ))}
              </select>
              <div className="grid grid-cols-3 gap-2">
                <select className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" value={leaveForm.leaveType} onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}>
                  {['CL', 'SL', 'EL', 'LOP'].map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <input type="text" inputMode="numeric" placeholder="YYYY-MM-DD" pattern="\d{4}-\d{2}-\d{2}" className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" value={leaveForm.startDate} onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })} />
                <input type="text" inputMode="numeric" placeholder="YYYY-MM-DD" pattern="\d{4}-\d{2}-\d{2}" className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" value={leaveForm.endDate} onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })} />
              </div>
              <input className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" placeholder="Reason" value={leaveForm.reason} onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })} />
              <button type="submit" className="w-full py-2 rounded-lg bg-amber-500 text-slate-950 text-sm font-bold">Request leave</button>
            </form>

            <form onSubmit={handleCreatePayroll} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white">Payroll (server calculated)</h3>
              <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" value={payrollForm.employeeId} onChange={(e) => setPayrollForm({ ...payrollForm, employeeId: e.target.value })} required>
                <option value="">Select employee</option>
                {employees.map((row) => (
                  <option key={row.id} value={row.id}>{row.code} — {row.fullName}</option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-2">
                <input type="number" className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" value={payrollForm.periodYear} onChange={(e) => setPayrollForm({ ...payrollForm, periodYear: Number(e.target.value) })} />
                <input type="number" min={1} max={12} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" value={payrollForm.periodMonth} onChange={(e) => setPayrollForm({ ...payrollForm, periodMonth: Number(e.target.value) })} />
              </div>
              <button type="submit" className="w-full py-2 rounded-lg bg-fuchsia-500 text-slate-950 text-sm font-bold">Run payroll</button>
            </form>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-3">Employees ({employees.length})</h3>
              <div className="space-y-2 max-h-56 overflow-auto">
                {employees.map((row) => (
                  <div key={row.id} className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
                    <span className="font-mono text-emerald-300">{row.code}</span> {row.fullName} · {row.department} · {row.employmentStatus}
                  </div>
                ))}
                {employees.length === 0 && <p className="text-xs text-slate-500">No employees loaded. Login via Shared Core, then create.</p>}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-3">Leave ({leaves.length})</h3>
              <div className="space-y-2 max-h-56 overflow-auto">
                {leaves.map((row) => (
                  <div key={row.id} className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center justify-between gap-2">
                    <span>{row.leaveType} {row.startDate}→{row.endDate} · {row.status}</span>
                    {row.status === 'REQUESTED' && (
                      <button onClick={() => handleApproveLeave(row.id)} className="px-2 py-1 rounded bg-emerald-500 text-slate-950 font-bold">Approve</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-3">Attendance ({attendance.length})</h3>
              <div className="space-y-2 max-h-56 overflow-auto">
                {attendance.map((row) => (
                  <div key={row.id} className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
                    {row.workDate} · {row.status} · {row.workingHours}h
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-3">Payroll ({payroll.length}) · structures {payStructures.length}</h3>
              <div className="space-y-2 max-h-56 overflow-auto">
                {payroll.map((row) => (
                  <div key={row.id} className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
                    {row.periodYear}-{String(row.periodMonth).padStart(2, '0')} gross ₹{row.grossAmount} net ₹{row.netAmount} · {row.status}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: 16 HRMS MODULES */}
      {activeTab === 'modules' && (
        <div className="space-y-6">
          {/* Controls: Search & Category Filter */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search HRMS modules..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500/50"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Master Detail View Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Module Selection List */}
            <div className="lg:col-span-5 space-y-3 max-h-[800px] overflow-y-auto pr-1">
              {filteredModules.map(mod => {
                const IconComponent = ICON_MAP[mod.icon] || FileText;
                const isSelected = activeModule.id === mod.id;

                return (
                  <div
                    key={mod.id}
                    onClick={() => setActiveModule(mod)}
                    className={`p-4 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-500/10 border-indigo-500/40 shadow-lg shadow-indigo-500/5'
                        : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-xl border shrink-0 ${
                        isSelected 
                          ? 'bg-indigo-500 text-slate-950 border-indigo-400 font-bold' 
                          : 'bg-slate-800/80 text-indigo-400 border-slate-700'
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                            Module {mod.number}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                            {mod.category}
                          </span>
                        </div>
                        <h3 className={`text-sm font-bold mt-1 truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                          {mod.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                          {mod.summary}
                        </p>
                      </div>

                      <ChevronRight className={`w-4 h-4 shrink-0 mt-2 transition ${isSelected ? 'text-indigo-400 translate-x-0.5' : 'text-slate-600'}`} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Deep Module Specification Card */}
            <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
              {/* Module Title Header */}
              <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {React.createElement(ICON_MAP[activeModule.icon] || FileText, { className: "w-6 h-6" })}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">
                        Module {activeModule.number}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {activeModule.category}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-white mt-0.5">
                      {activeModule.title}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Module Summary</h4>
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                  {activeModule.summary}
                </p>
              </div>

              {/* Sub-Modules Breakdown */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <FolderTree className="w-4 h-4 text-indigo-400" />
                  <span>Sub-Modules & Functional Scope</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeModule.subModules.map((sub, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{sub}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Capabilities */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-indigo-400" />
                  <span>Key Architectural & Operational Capabilities</span>
                </h4>
                <ul className="space-y-2">
                  {activeModule.keyCapabilities.map((cap, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Master Data Entities & Events Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Master Entities</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeModule.masterDataEntities.map(ent => (
                      <span key={ent} className="px-2 py-1 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[11px] font-mono">
                        {ent}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Event Streams</span>
                  </div>
                  <div className="space-y-1 font-mono text-[11px]">
                    <div className="text-indigo-400 flex items-center gap-1 truncate">
                      <span className="text-[10px] text-slate-500">PUB:</span>
                      <span>{activeModule.eventIntegrations.publishes.join(', ')}</span>
                    </div>
                    <div className="text-cyan-400 flex items-center gap-1 truncate">
                      <span className="text-[10px] text-slate-500">SUB:</span>
                      <span>{activeModule.eventIntegrations.subscribes.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Features if present */}
              {activeModule.aiFeatures && activeModule.aiFeatures.length > 0 && (
                <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
                  <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Gemini AI Workforce Copilot Features</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeModule.aiFeatures.map((ai, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 text-xs">
                        {ai}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WORKFORCE CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="space-y-8">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <span>Multi-Category Workforce Classification & Compensation Matrix</span>
            </h2>
            <p className="text-xs text-slate-400">
              Flexible classification policy defining compensation models, shift mandates, and settlement cycles across 8 primary workforce categories.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {WORKFORCE_CATEGORIES_DATA.map((cat, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="inline-flex px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold mb-2">
                      Category {idx + 1}
                    </div>
                    <h3 className="text-sm font-bold text-white">{cat.category}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">{cat.description}</p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-800/80">
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase">Target Roles</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {cat.roles.map(role => (
                          <span key={role} className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[10px]">
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-indigo-400/90 uppercase">Compensation Model</div>
                      <p className="text-[11px] text-slate-300 mt-0.5">{cat.compensationModel}</p>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-emerald-400/90 uppercase">Settlement Cycle</div>
                      <p className="text-[11px] text-slate-300 mt-0.5 font-semibold">{cat.settlementCycle}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SPECIALIZED BUSINESS WORKFLOWS */}
      {activeTab === 'workflows' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-indigo-400" />
              <span>Specialized Enterprise & Field Operations Workflows</span>
            </h2>
            <p className="text-xs text-slate-400">
              End-to-end event chains handling standard staff, tipper drivers, machine operators, and quarry labor gangs.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SPECIALIZED_WORKFLOWS.map((wf, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {idx === 0 && <UserCheck className="w-4 h-4" />}
                      {idx === 1 && <Truck className="w-4 h-4" />}
                      {idx === 2 && <Zap className="w-4 h-4" />}
                      {idx === 3 && <Pickaxe className="w-4 h-4" />}
                    </div>
                    <h3 className="text-sm font-bold text-white">{wf.title}</h3>
                  </div>

                  <div className="space-y-2">
                    {wf.steps.map((step, stepIdx) => (
                      <div key={stepIdx} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-indigo-400 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 border border-slate-700">
                          {stepIdx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INTEGRATION TOPOLOGY */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-400" />
              <span>HRMS Cross-Suite & External Integration Topology</span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Inter-service event messaging map connecting HRMS with Mining, Fleet, Building Materials, CRM, Marketplace, General Ledger Finance, EPFO/ESIC statutory portals, and RazorpayX payment gateways.
            </p>

            <div className="space-y-3">
              {HRMS_INTEGRATION_TOPOLOGY.map((integ, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 md:w-1/3">
                    <div className="text-xs font-extrabold text-indigo-400">{integ.suite}</div>
                    <div className="text-xs text-slate-300">{integ.interaction}</div>
                  </div>

                  <div className="md:w-2/3 flex items-center justify-end">
                    <span className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 text-xs font-mono">
                      {integ.protocol}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: FOLDER STRUCTURE */}
      {activeTab === 'structure' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-indigo-400" />
              <span>HRMS Source Code Directory Architecture</span>
            </h2>
            <p className="text-xs text-slate-400">
              Clean modular structure located in `/src/modules/hrms/` isolating controllers, services, data models, event handlers, and interfaces.
            </p>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-300 leading-relaxed overflow-x-auto">
              <pre>{HRMS_FOLDER_STRUCTURE.join('\n')}</pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SECURITY & SCALABILITY */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Security */}
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm border-b border-slate-800 pb-3">
                <Lock className="w-5 h-5" />
                <span>Security & Access Control</span>
              </div>
              <div className="space-y-3">
                {HRMS_SECURITY_AND_SCALABILITY.security.map((sec, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    {sec}
                  </div>
                ))}
              </div>
            </div>

            {/* Audit */}
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm border-b border-slate-800 pb-3">
                <ShieldCheck className="w-5 h-5" />
                <span>Audit & Immutability</span>
              </div>
              <div className="space-y-3">
                {HRMS_SECURITY_AND_SCALABILITY.audit.map((aud, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    {aud}
                  </div>
                ))}
              </div>
            </div>

            {/* Scalability */}
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm border-b border-slate-800 pb-3">
                <Zap className="w-5 h-5" />
                <span>Scalability Strategy</span>
              </div>
              <div className="space-y-3">
                {HRMS_SECURITY_AND_SCALABILITY.scalability.map((sca, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    {sca}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: PHASE 11 TRANSITION REVIEW */}
      {activeTab === 'review' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-purple-500/30 p-6 sm:p-8 rounded-2xl space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{PHASE11_TRANSITION_REVIEW.title}</h2>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-bold mt-1">
                  <span>{PHASE11_TRANSITION_REVIEW.status}</span>
                </div>
              </div>
            </div>

            {/* Validated Core Strengths */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Architectural Strengths Validated in Phase 10</span>
              </h3>
              <div className="space-y-2">
                {PHASE11_TRANSITION_REVIEW.validatedCapabilities.map((cap, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Identified Improvements for Phase 11 */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span>Identified Enhancements to Implement in Phase 11</span>
              </h3>
              <div className="space-y-2">
                {PHASE11_TRANSITION_REVIEW.identifiedImprovementsForPhase11.map((imp, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                    <span>{imp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
