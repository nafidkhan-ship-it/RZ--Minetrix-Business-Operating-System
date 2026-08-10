import React, { useState } from 'react';
import {
  Users,
  Building2,
  UserCheck,
  UserPlus,
  Clock,
  Calendar,
  DollarSign,
  Briefcase,
  Truck,
  Award,
  GraduationCap,
  ShieldAlert,
  Smartphone,
  CheckSquare,
  Brain,
  BarChart3,
  Layers,
  Plus,
  Sparkles,
  Search,
  CheckCircle2,
  FileText,
  QrCode,
  MapPin,
  Activity,
  AlertTriangle,
  Send,
  Zap,
  Lock,
  ChevronRight,
  Fingerprint,
  Globe,
  Radio,
  Cpu,
  Shield,
  FileCheck,
  Receipt,
  Compass,
  TrendingUp,
  Sliders,
  Target,
  Sparkle
} from 'lucide-react';
import {
  MOCK_ORG_STRUCTURE,
  MOCK_EMPLOYEE_MASTER,
  MOCK_RECRUITMENT,
  MOCK_ATTENDANCE,
  MOCK_LEAVE_REQUESTS,
  MOCK_PAYROLL,
  MOCK_CONTRACTOR_WORKFORCE,
  MOCK_DRIVER_OPERATOR,
  MOCK_PERFORMANCE_KPIS,
  MOCK_SAFETY_TRAINING,
  MOCK_HEALTH_SAFETY,
  MOCK_ESS_TICKETS,
  MOCK_MSS_APPROVALS,
  MOCK_AI_HR_PLATFORM,
  MOCK_WORKFORCE_ANALYTICS,
  MOCK_ECOSYSTEM_HR_INTEGRATIONS,
  MOCK_WORKFORCE_MARKETPLACE,
  MOCK_DIGITAL_RECRUITMENT,
  MOCK_WORKFORCE_PLANNING,
  MOCK_COMPETENCY_MATRIX,
  MOCK_TRAINING_COURSES,
  MOCK_SUCCESSION_PLANS,
  MOCK_EMPLOYEE_ENGAGEMENT,
  MOCK_TIME_PRODUCTIVITY,
  MOCK_SAFETY_COMPLIANCE,
  MOCK_DIGITAL_DOCUMENTS,
  MOCK_EXPENSE_CLAIMS,
  MOCK_AI_COMMAND_INSIGHTS,
  MOCK_EXECUTIVE_HR_METRICS,
  MOCK_MOBILE_APPS_STATUS,
  MOCK_WORKFORCE_DIGITAL_TWIN,
  MOCK_FUTURE_READY_CAPABILITIES,
  EmployeeMasterRecord
} from '../data/enterpriseHrmsPhase23Data';

export const EnterpriseHrmsPhase23Section: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'mod1-org'
    | 'mod2-employee'
    | 'mod3-recruitment'
    | 'mod4-attendance'
    | 'mod5-leave'
    | 'mod6-payroll'
    | 'mod7-contractor'
    | 'mod8-driver'
    | 'mod9-performance'
    | 'mod10-training'
    | 'mod11-safety'
    | 'mod12-ess'
    | 'mod13-mss'
    | 'mod14-ai'
    | 'mod15-analytics'
    | 'mod28-marketplace'
    | 'mod29-career'
    | 'mod30-planning'
    | 'mod31-competency'
    | 'mod34-engagement'
    | 'mod35-productivity'
    | 'mod37-docs'
    | 'mod38-expenses'
    | 'mod39-aicenter'
    | 'mod41-exec'
    | 'mod42-mobile'
    | 'mod44-twin'
    | 'mod45-future'
    | 'mod16-ecosystem'
    | 'phase23-review'
  >('mod1-org');

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [employeeSearch, setEmployeeSearch] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeMasterRecord | null>(MOCK_EMPLOYEE_MASTER[0]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredEmployees = MOCK_EMPLOYEE_MASTER.filter(emp =>
    emp.fullName.toLowerCase().includes(employeeSearch.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(employeeSearch.toLowerCase()) ||
    emp.designation.toLowerCase().includes(employeeSearch.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-500 text-slate-950 font-black text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-indigo-300 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/20 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-mono font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Phase 23 Master Implementation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Enterprise HRMS, Workforce, Payroll &amp; Intelligence Platform
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
              Complete Workforce Operating System for Mining Quarries, Crusher Plants, Heavy Fleet Haulage, Building Materials, CRM Projects, and Corporate Headquarters. Features multi-modal biometric/GPS attendance, Saturday weekly wage settlements, driver trip incentive calculations, contractor billing, and AI attrition &amp; shift optimization.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => showToast('Monthly Payroll Run Batch Initiated!')}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-slate-950 font-black rounded-xl text-xs transition shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4" /> Run Payroll Batch
            </button>
          </div>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
        {[
          { id: 'mod1-org', label: '1. Org Structure', icon: Building2 },
          { id: 'mod2-employee', label: '2. Employee Master', icon: Users },
          { id: 'mod3-recruitment', label: '3. Recruitment', icon: UserPlus },
          { id: 'mod4-attendance', label: '4. Attendance', icon: Clock },
          { id: 'mod5-leave', label: '5. Leave Mgmt', icon: Calendar },
          { id: 'mod6-payroll', label: '6. Payroll Engine', icon: DollarSign },
          { id: 'mod7-contractor', label: '7. Contractor Workforce', icon: Briefcase },
          { id: 'mod8-driver', label: '8. Drivers & Operators', icon: Truck },
          { id: 'mod9-performance', label: '9. Performance & KPIs', icon: Award },
          { id: 'mod10-training', label: '10. Safety Training', icon: GraduationCap },
          { id: 'mod11-safety', label: '11. Health & Safety', icon: ShieldAlert },
          { id: 'mod12-ess', label: '12. Employee Self Service', icon: Smartphone },
          { id: 'mod13-mss', label: '13. Manager Self Service', icon: CheckSquare },
          { id: 'mod14-ai', label: '14. AI HR Intelligence', icon: Brain },
          { id: 'mod15-analytics', label: '15. Workforce Analytics', icon: BarChart3 },
          { id: 'mod28-marketplace', label: '28. Workforce Marketplace', icon: Globe },
          { id: 'mod29-career', label: '29. Digital Recruitment', icon: FileCheck },
          { id: 'mod30-planning', label: '30. Workforce Planning', icon: Target },
          { id: 'mod31-competency', label: '31. Competency & Skills', icon: Sliders },
          { id: 'mod34-engagement', label: '34. Employee Engagement', icon: Compass },
          { id: 'mod35-productivity', label: '35. Time & Productivity', icon: Activity },
          { id: 'mod37-docs', label: '37. Digital Document Center', icon: FileText },
          { id: 'mod38-expenses', label: '38. Expense & Claims', icon: Receipt },
          { id: 'mod39-aicenter', label: '39. AI HR Command Center', icon: Sparkle },
          { id: 'mod41-exec', label: '41. Executive Command Center', icon: TrendingUp },
          { id: 'mod42-mobile', label: '42. Mobile App Fleet', icon: Smartphone },
          { id: 'mod44-twin', label: '44. Workforce Digital Twin', icon: Radio },
          { id: 'mod45-future', label: '45. Future Ready & Wallet', icon: Cpu },
          { id: 'mod16-ecosystem', label: '16. Ecosystem Bridges', icon: Layers },
          { id: 'phase23-review', label: 'Phase 23 Review', icon: CheckCircle2 }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-indigo-500 text-slate-950 font-black shadow-lg'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* MODULE 1: ORGANIZATION MANAGEMENT */}
      {activeTab === 'mod1-org' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">Module 01</span>
              <h2 className="text-xl font-bold text-white mt-1">Enterprise Organization Management &amp; Hierarchy</h2>
            </div>
            <button onClick={() => showToast('New Department Created in Org Tree!')} className="px-3 py-1.5 bg-indigo-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Add Business Unit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_ORG_STRUCTURE.map((org) => (
              <div key={org.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-indigo-400 font-bold">{org.code}</span>
                    <h3 className="text-white font-bold text-sm mt-0.5">{org.name}</h3>
                  </div>
                  <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 font-bold rounded-full text-[10px]">
                    {org.type}
                  </span>
                </div>

                <div className="space-y-1.5 text-slate-300 text-[11px]">
                  <div className="flex justify-between"><span>Unit Head:</span><strong className="text-white">{org.headPerson}</strong></div>
                  <div className="flex justify-between"><span>Headcount:</span><strong className="text-indigo-400">{org.employeeCount} Staff</strong></div>
                  <div className="flex justify-between"><span>Location:</span><strong className="text-slate-400">{org.location}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 2: EMPLOYEE MASTER */}
      {activeTab === 'mod2-employee' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">Module 02</span>
              <h2 className="text-xl font-bold text-white mt-1">Employee Master, KYC &amp; Bank Ledger</h2>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search Employee..."
                value={employeeSearch}
                onChange={(e) => setEmployeeSearch(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-2">
              <h3 className="text-slate-400 font-bold text-xs uppercase">Employee Directory ({filteredEmployees.length})</h3>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {filteredEmployees.map((emp) => (
                  <div
                    key={emp.id}
                    onClick={() => setSelectedEmployee(emp)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center gap-3 ${
                      selectedEmployee?.id === emp.id ? 'bg-indigo-950/80 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <img src={emp.photoUrl} alt={emp.fullName} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                    <div>
                      <span className="text-indigo-400 font-bold text-[10px] block">{emp.employeeId}</span>
                      <h4 className="text-white font-bold text-xs">{emp.fullName}</h4>
                      <span className="text-slate-400 text-[10px]">{emp.designation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedEmployee && (
              <div className="lg:col-span-2 p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-4">
                    <img src={selectedEmployee.photoUrl} alt={selectedEmployee.fullName} className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-indigo-400 font-bold text-xs">{selectedEmployee.employeeId}</span>
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full">{selectedEmployee.kycStatus}</span>
                      </div>
                      <h3 className="text-white font-black text-lg">{selectedEmployee.fullName}</h3>
                      <p className="text-slate-400 text-xs">{selectedEmployee.designation} • {selectedEmployee.department}</p>
                    </div>
                  </div>

                  <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 font-bold rounded-xl text-xs">
                    {selectedEmployee.workforceType}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Aadhaar (Masked)</span>
                    <strong className="text-white">{selectedEmployee.aadhaarNumberMasked}</strong>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">PAN Number</span>
                    <strong className="text-white">{selectedEmployee.panNumberMasked}</strong>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Bank Account</span>
                    <strong className="text-indigo-400">{selectedEmployee.bankAccountMasked}</strong>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Phone</span>
                    <strong className="text-white">{selectedEmployee.phone}</strong>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Joining Date</span>
                    <strong className="text-white">{selectedEmployee.joiningDate}</strong>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Business Unit</span>
                    <strong className="text-white">{selectedEmployee.businessUnit}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODULE 3: RECRUITMENT */}
      {activeTab === 'mod3-recruitment' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">Module 03</span>
            <h2 className="text-xl font-bold text-white mt-1">Recruitment Pipeline, Applications &amp; Onboarding</h2>
          </div>

          <div className="space-y-3">
            {MOCK_RECRUITMENT.map((rec) => (
              <div key={rec.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400 font-bold text-xs">{rec.jobCode}</span>
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] rounded">{rec.department}</span>
                  </div>
                  <h3 className="text-white font-bold text-sm">{rec.title}</h3>
                  <p className="text-slate-400 text-[11px]">Applicants: <strong className="text-white">{rec.applicantsCount}</strong> • Shortlisted: <strong className="text-indigo-300">{rec.shortlistedCount}</strong> • Offered: <strong className="text-emerald-400">{rec.offeredCount}</strong></p>
                </div>

                <div className="text-right self-start sm:self-center">
                  <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 font-bold rounded-full text-xs inline-block">
                    {rec.status} ({rec.openings} Openings)
                  </span>
                  <span className="text-slate-500 text-[10px] block mt-1">Target Join: {rec.targetJoiningDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 4: ATTENDANCE MANAGEMENT */}
      {activeTab === 'mod4-attendance' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">Module 04</span>
              <h2 className="text-xl font-bold text-white mt-1">Attendance Engine (GPS, Face Rec &amp; Biometric)</h2>
            </div>
            <button onClick={() => showToast('Real-time Biometric & GPS Log Synced!')} className="px-3 py-1.5 bg-indigo-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5">
              <Fingerprint className="w-4 h-4" /> Sync Biometric Logs
            </button>
          </div>

          <div className="space-y-3">
            {MOCK_ATTENDANCE.map((att) => (
              <div key={att.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400 font-bold">{att.employeeId}</span>
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] rounded">{att.workforceType}</span>
                    <span className="text-slate-500 text-[10px]">{att.date}</span>
                  </div>
                  <h3 className="text-white font-bold text-xs">{att.employeeName}</h3>
                  <p className="text-slate-400 text-[10px]">📍 Geofence Check-in: <span className="text-indigo-300 font-mono">{att.locationCoordinates}</span></p>
                </div>

                <div className="text-right self-start sm:self-center">
                  <span className="text-emerald-400 font-bold text-xs block">{att.checkInTime} - {att.checkOutTime}</span>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px] inline-block mt-1">
                    {att.status} ({att.verificationMethod})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 5: LEAVE MANAGEMENT */}
      {activeTab === 'mod5-leave' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">Module 05</span>
            <h2 className="text-xl font-bold text-white mt-1">Leave Management, Balances &amp; Workflow</h2>
          </div>

          <div className="space-y-3">
            {MOCK_LEAVE_REQUESTS.map((lev) => (
              <div key={lev.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-indigo-400 font-bold text-xs">{lev.leaveCode}</span>
                    <h3 className="text-white font-bold text-xs mt-0.5">{lev.employeeName}</h3>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">{lev.approvalStatus}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-300 text-[11px]">
                  <div>Leave Type: <strong className="text-white">{lev.leaveType}</strong></div>
                  <div>Period: <strong className="text-white">{lev.startDate} to {lev.endDate}</strong></div>
                  <div>Total Days: <strong className="text-indigo-400">{lev.totalDays} Days</strong></div>
                  <div>Balance Remaining: <strong className="text-emerald-400">{lev.leaveBalanceRemaining} Days</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 6: PAYROLL ENGINE */}
      {activeTab === 'mod6-payroll' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">Module 06</span>
              <h2 className="text-xl font-bold text-white mt-1">Payroll Engine (Monthly, Saturday Weekly &amp; Daily)</h2>
            </div>
            <button onClick={() => showToast('Saturday Weekly Wage Settlement Processed!')} className="px-3 py-1.5 bg-indigo-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5">
              <DollarSign className="w-4 h-4" /> Run Saturday Settlement
            </button>
          </div>

          <div className="space-y-4">
            {MOCK_PAYROLL.map((pay) => (
              <div key={pay.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-400 font-bold text-xs">{pay.paySlipNumber}</span>
                      <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-[10px] rounded">{pay.payType}</span>
                    </div>
                    <h3 className="text-white font-bold text-sm mt-0.5">{pay.employeeName} ({pay.payPeriod})</h3>
                  </div>

                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-xs">
                    {pay.paymentStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Base Pay</span>
                    <strong className="text-white">₹{pay.basePayRs.toLocaleString()}</strong>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Overtime + Incentives</span>
                    <strong className="text-indigo-400">₹{(pay.overtimePayRs + pay.tripIncentivesRs + pay.loadingChargesRs).toLocaleString()}</strong>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Statutory &amp; Advance Deductions</span>
                    <strong className="text-amber-400">₹{(pay.advanceDeductionsRs + pay.statutoryDeductionsRs).toLocaleString()}</strong>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Net Payout Amount</span>
                    <strong className="text-emerald-400 text-sm font-black">₹{pay.netPayoutRs.toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 7: CONTRACTOR WORKFORCE */}
      {activeTab === 'mod7-contractor' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">Module 07</span>
            <h2 className="text-xl font-bold text-white mt-1">Contractor Workforce &amp; Labour Work Order Billing</h2>
          </div>

          {MOCK_CONTRACTOR_WORKFORCE.map((cnt) => (
            <div key={cnt.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                <div>
                  <span className="text-indigo-400 font-bold text-xs">{cnt.contractorCode}</span>
                  <h3 className="text-white font-bold text-sm mt-0.5">{cnt.contractorName}</h3>
                  <span className="text-slate-400 text-[10px]">Work Order: {cnt.workOrderNumber}</span>
                </div>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">{cnt.complianceStatus}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Assigned Site</span>
                  <strong className="text-white">{cnt.assignedSite}</strong>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Active Labour Count</span>
                  <strong className="text-indigo-400">{cnt.activeLabourCount} Labourers</strong>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Rate Per Head / Shift</span>
                  <strong className="text-white">₹{cnt.dailyBillingRatePerHeadRs}</strong>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Weekly Settlement Due</span>
                  <strong className="text-emerald-400 font-bold">₹{cnt.weeklySettlementDueRs.toLocaleString()}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODULE 8: DRIVER & OPERATOR */}
      {activeTab === 'mod8-driver' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">Module 08</span>
            <h2 className="text-xl font-bold text-white mt-1">Driver &amp; Heavy Operator Performance &amp; Trip Ledger</h2>
          </div>

          {MOCK_DRIVER_OPERATOR.map((drv) => (
            <div key={drv.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                <div>
                  <span className="text-indigo-400 font-bold">{drv.staffCode}</span>
                  <h3 className="text-white font-bold text-sm mt-0.5">{drv.fullName}</h3>
                  <span className="text-slate-400 text-[10px]">{drv.role}</span>
                </div>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">{drv.medicalFitnessStatus}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Heavy Driving License</span>
                  <strong className="text-white">{drv.licenseNumber}</strong>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Monthly Trips Completed</span>
                  <strong className="text-indigo-400">{drv.monthlyCompletedTrips} Trips</strong>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Machine Efficiency</span>
                  <strong className="text-emerald-400">{drv.machineEfficiencyScore}% Score</strong>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Safety Incidents</span>
                  <strong className="text-emerald-400">Zero Incidents</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODULE 9: PERFORMANCE MANAGEMENT */}
      {activeTab === 'mod9-performance' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">Module 09</span>
            <h2 className="text-xl font-bold text-white mt-1">Performance Appraisal, KPIs &amp; AI Productivity</h2>
          </div>

          {MOCK_PERFORMANCE_KPIS.map((kpi) => (
            <div key={kpi.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                <div>
                  <h3 className="text-white font-bold text-sm">{kpi.employeeName}</h3>
                  <span className="text-slate-400 text-[10px]">{kpi.role}</span>
                </div>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">{kpi.performanceRating}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Target KPI</span>
                  <strong className="text-slate-300">{kpi.targetMetric}</strong>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Achieved Metric</span>
                  <strong className="text-emerald-400">{kpi.achievedMetric}</strong>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">AI Productivity Score</span>
                  <strong className="text-indigo-400 text-sm font-bold">{kpi.aiProductivityScore} / 100</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODULE 10: TRAINING MANAGEMENT */}
      {activeTab === 'mod10-training' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">Module 10</span>
            <h2 className="text-xl font-bold text-white mt-1">Mining Safety &amp; Machine Skill Training Calendar</h2>
          </div>

          {MOCK_SAFETY_TRAINING.map((trn) => (
            <div key={trn.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                <div>
                  <span className="text-indigo-400 font-bold">{trn.courseCode}</span>
                  <h3 className="text-white font-bold text-sm mt-0.5">{trn.topic}</h3>
                  <span className="text-slate-400 text-[10px]">Lead Trainer: {trn.trainerName}</span>
                </div>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">{trn.status}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Certified Employees</span>
                  <strong className="text-indigo-400">{trn.completedEmployeesCount} Personnel</strong>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Certificate Validity</span>
                  <strong className="text-white">{trn.certificationValidityDays} Days</strong>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Next Session</span>
                  <strong className="text-cyan-300">{trn.nextScheduledSession}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODULE 11: HEALTH & SAFETY */}
      {activeTab === 'mod11-safety' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">Module 11</span>
            <h2 className="text-xl font-bold text-white mt-1">Health, Safety &amp; Incident Investigation Log</h2>
          </div>

          {MOCK_HEALTH_SAFETY.map((hs) => (
            <div key={hs.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                <div>
                  <span className="text-indigo-400 font-bold">{hs.incidentCode}</span>
                  <h3 className="text-white font-bold text-xs mt-0.5">{hs.incidentType} @ {hs.siteLocation}</h3>
                </div>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">{hs.investigationStatus}</span>
              </div>

              <p className="text-slate-300 text-xs"><strong>Corrective Action Taken:</strong> {hs.actionTaken}</p>
            </div>
          ))}
        </div>
      )}

      {/* MODULE 12: EMPLOYEE SELF SERVICE */}
      {activeTab === 'mod12-ess' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">Module 12</span>
              <h2 className="text-xl font-bold text-white mt-1">Employee Self Service (ESS Mobile &amp; Web)</h2>
            </div>
            <button onClick={() => showToast('New Support Ticket Submitted!')} className="px-3 py-1.5 bg-indigo-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Raise ESS Query
            </button>
          </div>

          {MOCK_ESS_TICKETS.map((ess) => (
            <div key={ess.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-indigo-400 font-bold">{ess.ticketNumber}</span>
                  <h3 className="text-white font-bold text-xs mt-0.5">{ess.subject}</h3>
                  <span className="text-slate-400 text-[10px]">Submitted by {ess.employeeName}</span>
                </div>
                <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 font-bold rounded-full text-[10px]">{ess.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODULE 13: MANAGER SELF SERVICE */}
      {activeTab === 'mod13-mss' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">Module 13</span>
            <h2 className="text-xl font-bold text-white mt-1">Manager Self Service (MSS Approvals &amp; Advances)</h2>
          </div>

          {MOCK_MSS_APPROVALS.map((mss) => (
            <div key={mss.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                <div>
                  <span className="text-indigo-400 font-bold">{mss.approvalCode}</span>
                  <h3 className="text-white font-bold text-xs mt-0.5">{mss.requestType}</h3>
                  <span className="text-slate-400 text-[10px]">Requested by: {mss.requestedBy}</span>
                </div>
                <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 font-bold rounded-full text-[10px]">{mss.status}</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300">{mss.requestDetails}</span>
                <button onClick={() => showToast('Advance Approved & Payout Enqueued!')} className="px-3 py-1 bg-emerald-500 text-slate-950 font-black rounded-lg text-xs">
                  Approve Advance ({mss.amountOrHours})
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODULE 14: AI HR PLATFORM */}
      {activeTab === 'mod14-ai' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">Module 14</span>
            <h2 className="text-xl font-bold text-white mt-1">AI HR Intelligence, Attrition Risk &amp; Shift Copilot</h2>
          </div>

          {MOCK_AI_HR_PLATFORM.map((aihr) => (
            <div key={aihr.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-amber-400 font-bold text-xs">⚡ {aihr.insightType}</span>
                <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 font-bold rounded-full text-[10px]">{aihr.severity}</span>
              </div>

              <p className="text-slate-200 text-xs">{aihr.findingSummary}</p>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                <span className="text-indigo-400 font-bold text-[11px]">AI Suggested Action:</span>
                <p className="text-slate-300 text-[11px]">{aihr.aiSuggestedAction}</p>
                <div className="text-right text-[10px] text-indigo-300 mt-1">
                  Confidence: <strong>{aihr.confidencePercent}%</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODULE 15: WORKFORCE ANALYTICS */}
      {activeTab === 'mod15-analytics' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">Module 15</span>
            <h2 className="text-xl font-bold text-white mt-1">Workforce Executive Analytics &amp; Payroll Cost Metrics</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
              <span className="text-slate-400 text-[10px] block">Total Active Workforce</span>
              <strong className="text-indigo-400 text-lg font-black">{MOCK_WORKFORCE_ANALYTICS.totalActiveWorkforce} Staff</strong>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
              <span className="text-slate-400 text-[10px] block">Avg Attendance Rate</span>
              <strong className="text-emerald-400 text-lg font-black">{MOCK_WORKFORCE_ANALYTICS.averageAttendancePercent}%</strong>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
              <span className="text-slate-400 text-[10px] block">Monthly Payroll Disbursed</span>
              <strong className="text-indigo-300 text-lg font-black">₹{(MOCK_WORKFORCE_ANALYTICS.totalMonthlyPayrollDisbursedRs / 100000).toFixed(2)} Lakhs</strong>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
              <span className="text-slate-400 text-[10px] block">Attrition Rate</span>
              <strong className="text-purple-300 text-lg font-black">{MOCK_WORKFORCE_ANALYTICS.attritionRatePercent}% / Year</strong>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 28: WORKFORCE MARKETPLACE */}
      {activeTab === 'mod28-marketplace' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">Module 28</span>
              <h2 className="text-xl font-bold text-white mt-1">Enterprise Workforce Marketplace</h2>
            </div>
            <button onClick={() => showToast('AI Candidate Search Matched 3 Operators!')} className="px-3 py-1.5 bg-indigo-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer">
              <Sparkles className="w-4 h-4" /> AI Match Candidates
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MOCK_WORKFORCE_MARKETPLACE.map((cand) => (
              <div key={cand.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                    <div>
                      <span className="text-indigo-400 font-bold text-[10px]">{cand.candidateCode}</span>
                      <h3 className="text-white font-bold text-sm">{cand.fullName}</h3>
                      <span className="text-slate-400 text-[10px]">{cand.primaryRole} • {cand.experienceYears} Yrs Exp</span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">
                      ★ {cand.rating}
                    </span>
                  </div>

                  <div className="space-y-1 text-slate-300 text-[11px]">
                    <div>Location: <strong className="text-white">{cand.currentLocation}</strong></div>
                    <div>Daily Rate: <strong className="text-emerald-400">₹{cand.dailyRateRs} / Shift</strong></div>
                    <div>Status: <strong className="text-cyan-300">{cand.availabilityStatus}</strong></div>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {cand.skills.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[9px] rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-indigo-400 text-[10px] font-bold">AI Match: {cand.aiMatchScore}%</span>
                  <button onClick={() => showToast(`Work Order Contract Sent to ${cand.fullName}!`)} className="px-3 py-1 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-black rounded-lg text-xs cursor-pointer">
                    Contract Staff
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 29: DIGITAL RECRUITMENT */}
      {activeTab === 'mod29-career' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">Module 29</span>
              <h2 className="text-xl font-bold text-white mt-1">Digital Recruitment &amp; AI Screening Portal</h2>
            </div>
            <button onClick={() => showToast('AI Resume Parser Scanned 12 New Portals!')} className="px-3 py-1.5 bg-indigo-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer">
              <FileCheck className="w-4 h-4" /> Run AI Resume Screening
            </button>
          </div>

          <div className="space-y-3">
            {MOCK_DIGITAL_RECRUITMENT.map((app) => (
              <div key={app.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-indigo-400 font-bold">{app.applicantCode}</span>
                    <h3 className="text-white font-bold text-sm mt-0.5">{app.applicantName}</h3>
                    <span className="text-slate-400 text-[10px]">Applied for: {app.appliedPosition} ({app.parsedExperienceYears} Yrs Exp)</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">{app.digitalOfferStatus}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">AI Resume Rating</span>
                    <strong className="text-indigo-400">{app.aiResumeScore} / 100 Score</strong>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Video Interview</span>
                    <strong className="text-white">{app.videoInterviewStatus}</strong>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Background Check</span>
                    <strong className="text-emerald-400">{app.bgVerificationStatus}</strong>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Target Join Date</span>
                    <strong className="text-cyan-300">{app.joiningDate}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 30: WORKFORCE PLANNING */}
      {activeTab === 'mod30-planning' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">Module 30 &amp; 33</span>
            <h2 className="text-xl font-bold text-white mt-1">Workforce Capacity Planning &amp; Succession Pipelines</h2>
          </div>

          <div className="space-y-4">
            <h3 className="text-indigo-400 font-bold text-xs uppercase">Site Capacity Forecast &amp; Headcount Gaps</h3>
            {MOCK_WORKFORCE_PLANNING.map((plan) => (
              <div key={plan.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <h4 className="text-white font-bold text-sm">{plan.unitOrProjectName}</h4>
                    <span className="text-slate-400 text-[10px]">Category: {plan.domainCategory}</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 font-bold rounded-full text-[10px]">Gap: {plan.headcountGap} Staff</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Current Headcount</span>
                    <strong className="text-white">{plan.currentHeadcount} Staff</strong>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Required Headcount</span>
                    <strong className="text-indigo-400">{plan.requiredHeadcount} Staff</strong>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Shift Capacity</span>
                    <strong className="text-emerald-400">{plan.shiftCapacityPercent}%</strong>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">AI 30-Day Demand Forecast</span>
                    <strong className="text-cyan-300">{plan.ai30DayForecastDemand} Staff</strong>
                  </div>
                </div>

                <p className="text-indigo-300 text-xs">💡 <strong>AI Plan Recommendation:</strong> {plan.recommendedAction}</p>
              </div>
            ))}

            <h3 className="text-indigo-400 font-bold text-xs uppercase pt-4">Key Leadership Succession Pipelines</h3>
            {MOCK_SUCCESSION_PLANS.map((succ) => (
              <div key={succ.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <h4 className="text-white font-bold text-sm">{succ.criticalPositionTitle}</h4>
                    <span className="text-slate-400 text-[10px]">Incumbent: {succ.currentIncumbent} ({succ.department})</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">{succ.readinessLevel}</span>
                </div>

                <div className="space-y-2">
                  <span className="text-slate-400 text-[10px] block font-bold">DESIGNATED SUCCESSORS:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {succ.designatedSuccessors.map((s, idx) => (
                      <div key={idx} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                        <div>
                          <strong className="text-white text-xs block">{s.name}</strong>
                          <span className="text-slate-400 text-[10px]">{s.currentRole}</span>
                        </div>
                        <span className="text-emerald-400 font-bold text-xs">{s.readinessScore}% Ready</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 31: COMPETENCY & SKILL MANAGEMENT */}
      {activeTab === 'mod31-competency' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">Module 31 &amp; 32</span>
            <h2 className="text-xl font-bold text-white mt-1">Competency Matrix, Machine Authorizations &amp; LMS Courses</h2>
          </div>

          <div className="space-y-4">
            {MOCK_COMPETENCY_MATRIX.map((comp) => (
              <div key={comp.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-indigo-400 font-bold">{comp.employeeId}</span>
                    <h3 className="text-white font-bold text-sm mt-0.5">{comp.employeeName}</h3>
                    <span className="text-slate-400 text-[10px]">{comp.designation}</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">{comp.competencyRating}</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block font-bold">AUTHORIZED HEAVY EQUIPMENT:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {comp.machineAuthorizationList.map((m, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-indigo-950 text-indigo-300 border border-indigo-500/30 font-bold text-[10px] rounded-lg">
                          ✓ {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-amber-400 font-bold text-[10px]">Identified Skill Gap: {comp.skillGapIdentified}</span>
                    <p className="text-slate-300 text-[11px]">AI Recommended Upskill Course: <strong className="text-cyan-300">{comp.aiRecommendedCourse}</strong></p>
                  </div>
                </div>
              </div>
            ))}

            <h3 className="text-indigo-400 font-bold text-xs uppercase pt-2">Active Training LMS Courses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_TRAINING_COURSES.map((crs) => (
                <div key={crs.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                    <div>
                      <span className="text-indigo-400 font-bold">{crs.courseId}</span>
                      <h4 className="text-white font-bold text-xs mt-0.5">{crs.title}</h4>
                      <span className="text-slate-400 text-[10px]">{crs.category}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] rounded">{crs.format}</span>
                  </div>

                  <div className="flex justify-between text-slate-300 text-[11px]">
                    <span>Enrolled: <strong className="text-white">{crs.enrolledCount} Staff</strong></span>
                    <span>Completion: <strong className="text-emerald-400">{crs.completionRatePercent}%</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODULE 34: EMPLOYEE ENGAGEMENT */}
      {activeTab === 'mod34-engagement' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">Module 34</span>
            <h2 className="text-xl font-bold text-white mt-1">Employee Engagement, Pulse Surveys &amp; Notice Board</h2>
          </div>

          {MOCK_EMPLOYEE_ENGAGEMENT.map((eng) => (
            <div key={eng.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                <div>
                  <span className="text-indigo-400 font-bold">{eng.type}</span>
                  <h3 className="text-white font-bold text-sm mt-0.5">{eng.title}</h3>
                  <span className="text-slate-400 text-[10px]">Published: {eng.publishedDate}</span>
                </div>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">
                  Score: {eng.engagementScorePercent}%
                </span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block font-bold">PULSE FEEDBACK SUMMARY ({eng.participantCount} Responses):</span>
                <p className="text-slate-200 text-xs mt-1">{eng.topFeedbackSummary}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODULE 35: TIME & PRODUCTIVITY */}
      {activeTab === 'mod35-productivity' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">Module 35</span>
            <h2 className="text-xl font-bold text-white mt-1">Time &amp; Productivity Cards (Machine &amp; Operator Hours)</h2>
          </div>

          {MOCK_TIME_PRODUCTIVITY.map((jc) => (
            <div key={jc.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                <div>
                  <span className="text-indigo-400 font-bold">{jc.jobCardNumber}</span>
                  <h3 className="text-white font-bold text-sm mt-0.5">{jc.taskAllocation}</h3>
                  <span className="text-slate-400 text-[10px]">Assigned: {jc.assignedStaffName} • Machine: {jc.machineUnitId}</span>
                </div>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">
                  Efficiency Score: {jc.productivityScore}%
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Allocated Shift Hours</span>
                  <strong className="text-white">{jc.allocatedHours} Hours</strong>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Actual Machine Active</span>
                  <strong className="text-emerald-400">{jc.actualMachineHours} Hours</strong>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Idle / Delay Hours</span>
                  <strong className="text-amber-400">{jc.idleHours} Hours</strong>
                </div>
              </div>

              <p className="text-slate-300 text-xs">🤖 <strong>AI Productivity Diagnostics:</strong> {jc.aiEfficiencyNote}</p>
            </div>
          ))}
        </div>
      )}

      {/* MODULE 37: DIGITAL DOCUMENT CENTER */}
      {activeTab === 'mod37-docs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">Module 36 &amp; 37</span>
            <h2 className="text-xl font-bold text-white mt-1">Digital Document Vault, Permits &amp; License Expiry Alerts</h2>
          </div>

          <div className="space-y-4">
            <h3 className="text-indigo-400 font-bold text-xs uppercase">Permit To Work &amp; Site Safety Register</h3>
            {MOCK_SAFETY_COMPLIANCE.map((safe) => (
              <div key={safe.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-indigo-400 font-bold">{safe.recordCode}</span>
                    <h4 className="text-white font-bold text-xs mt-0.5">{safe.permitToWorkType} @ {safe.location}</h4>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">{safe.permitStatus}</span>
                </div>
                <p className="text-slate-300 text-xs">Toolbox Topic: {safe.toolboxMeetingTopic} (PPE Issued: {safe.ppeIssuedCount})</p>
              </div>
            ))}

            <h3 className="text-indigo-400 font-bold text-xs uppercase pt-2">OCR Document Vault &amp; Expiry Tracker</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_DIGITAL_DOCUMENTS.map((doc) => (
                <div key={doc.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                    <div>
                      <span className="text-indigo-400 font-bold">{doc.documentId}</span>
                      <h4 className="text-white font-bold text-xs mt-0.5">{doc.employeeName}</h4>
                      <span className="text-slate-400 text-[10px]">{doc.documentType}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">{doc.ocrVerificationStatus}</span>
                  </div>

                  <div className="flex justify-between text-slate-300 text-[11px]">
                    <span>Expiry Date: <strong className="text-white">{doc.expiryDate}</strong></span>
                    <span>Status: <strong className="text-cyan-300">{doc.daysToExpiry} Days Remaining</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODULE 38: EXPENSE & CLAIMS */}
      {activeTab === 'mod38-expenses' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">Module 38</span>
            <h2 className="text-xl font-bold text-white mt-1">Expense Claims &amp; Site Fuel Reimbursement</h2>
          </div>

          {MOCK_EXPENSE_CLAIMS.map((exp) => (
            <div key={exp.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                <div>
                  <span className="text-indigo-400 font-bold">{exp.claimNumber}</span>
                  <h3 className="text-white font-bold text-xs mt-0.5">{exp.employeeName}</h3>
                  <span className="text-slate-400 text-[10px]">Category: {exp.expenseCategory}</span>
                </div>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">{exp.approvalStatus}</span>
              </div>

              <div className="flex justify-between items-center text-xs pt-1">
                <span className="text-slate-400">Submitted on: {exp.submissionDate}</span>
                <strong className="text-emerald-400 font-black text-sm">₹{exp.claimAmountRs.toLocaleString()}</strong>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODULE 39: AI HR COMMAND CENTER */}
      {activeTab === 'mod39-aicenter' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">Module 39</span>
              <h2 className="text-xl font-bold text-white mt-1">AI HR Command Center (Gemini Copilot)</h2>
            </div>
            <button onClick={() => showToast('AI Command Center Audit Triggered!')} className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer">
              <Sparkles className="w-4 h-4" /> Run AI Executive Audit
            </button>
          </div>

          <div className="space-y-3">
            {MOCK_AI_COMMAND_INSIGHTS.map((cmd) => (
              <div key={cmd.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-indigo-400 font-bold text-xs">⚡ {cmd.moduleSource}</span>
                  <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 font-bold rounded-full text-[10px]">{cmd.actionStatus}</span>
                </div>

                <h3 className="text-white font-bold text-sm">{cmd.executiveAlert}</h3>
                <p className="text-slate-400 text-[10px]">Scope: {cmd.impactScope}</p>

                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-indigo-400 font-bold text-[11px]">AI Action Directive:</span>
                  <p className="text-slate-300 text-[11px]">{cmd.aiRecommendation}</p>
                  <div className="text-right text-[10px] text-indigo-300 mt-1">
                    Confidence: <strong>{cmd.confidenceScore}%</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 41: EXECUTIVE COMMAND CENTER */}
      {activeTab === 'mod41-exec' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">Module 40 &amp; 41</span>
            <h2 className="text-xl font-bold text-white mt-1">Executive HR Command Center (CEO &amp; Operations Dashboard)</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
              <span className="text-slate-400 text-[10px] block">Live On-Site Workforce</span>
              <strong className="text-indigo-400 text-lg font-black">{MOCK_EXECUTIVE_HR_METRICS.liveOnsiteWorkforce} Staff</strong>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
              <span className="text-slate-400 text-[10px] block">Active Shifts Running</span>
              <strong className="text-emerald-400 text-lg font-black">{MOCK_EXECUTIVE_HR_METRICS.activeShiftsRunning} Shifts</strong>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
              <span className="text-slate-400 text-[10px] block">Driver / Operator Coverage</span>
              <strong className="text-indigo-300 text-lg font-black">{MOCK_EXECUTIVE_HR_METRICS.driverCoveragePercent}%</strong>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
              <span className="text-slate-400 text-[10px] block">AI Health Index</span>
              <strong className="text-purple-300 text-lg font-black">{MOCK_EXECUTIVE_HR_METRICS.aiWorkforceHealthIndex} / 100</strong>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 42: MOBILE APP FLEET */}
      {activeTab === 'mod42-mobile' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">Module 42</span>
            <h2 className="text-xl font-bold text-white mt-1">Mobile Workforce Platform Fleet (Offline + GPS + Face Rec)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_MOBILE_APPS_STATUS.map((app, idx) => (
              <div key={idx} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <h3 className="text-white font-bold text-sm">{app.appName}</h3>
                    <span className="text-slate-400 text-[10px]">Version: {app.appVersion}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">
                    Active Installs: {app.activeInstallsCount}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-300">
                  <div>Offline Queue: <strong className="text-indigo-400">{app.offlineSyncQueueCount} Jobs</strong></div>
                  <div>GPS Accuracy: <strong className="text-emerald-400">{app.gpsCheckInRatePercent}%</strong></div>
                  <div>Face Match: <strong className="text-cyan-300">{app.faceRecMatchRatePercent}%</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 44: WORKFORCE DIGITAL TWIN */}
      {activeTab === 'mod44-twin' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">Module 44</span>
            <h2 className="text-xl font-bold text-white mt-1">Workforce Digital Twin &amp; Live Site Capacity Map</h2>
          </div>

          <div className="space-y-3">
            {MOCK_WORKFORCE_DIGITAL_TWIN.map((dt) => (
              <div key={dt.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <h3 className="text-white font-bold text-sm">{dt.siteName}</h3>
                    <span className="text-indigo-400 text-[10px]">Coordinates: {dt.coordinates}</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">{dt.riskFactor}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Assigned Roster</span>
                    <strong className="text-white">{dt.assignedWorkersCount} Staff</strong>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Live Present On-Site</span>
                    <strong className="text-emerald-400">{dt.livePresentCount} Staff</strong>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Active Heavy Equipment</span>
                    <strong className="text-indigo-400">{dt.activeMachineryCount} Units</strong>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Capacity Utilization</span>
                    <strong className="text-cyan-300 font-bold">{dt.capacityUtilizationPercent}%</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 45: FUTURE READY & DIGITAL WALLET */}
      {activeTab === 'mod45-future' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">Module 45</span>
            <h2 className="text-xl font-bold text-white mt-1">Future Ready Innovations (Voice AI, Wearables &amp; Digital Wallet)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_FUTURE_READY_CAPABILITIES.map((cap, idx) => (
              <div key={idx} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <h3 className="text-white font-bold text-sm">{cap.capabilityName}</h3>
                    <span className="text-indigo-400 text-[10px]">{cap.technologyCategory}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px]">
                    {cap.deploymentStatus}
                  </span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">{cap.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 16: ECOSYSTEM BRIDGES */}
      {activeTab === 'mod16-ecosystem' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">Module 16 &amp; 46</span>
            <h2 className="text-xl font-bold text-white mt-1">Ecosystem HRMS Integration Bridges &amp; Cross-Platform Data Sync</h2>
          </div>

          <div className="space-y-3">
            {MOCK_ECOSYSTEM_HR_INTEGRATIONS.map((b) => (
              <div key={b.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <span className="text-indigo-400 font-bold text-xs">{b.connectedDomain}</span>
                  <p className="text-white font-bold text-xs mt-0.5">{b.integrationBridgeName}</p>
                </div>

                <div className="text-right text-[10px]">
                  <span className="text-indigo-300 font-bold block">{b.dataFlowFrequency}</span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-[10px] inline-block mt-1">{b.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PHASE 23 REVIEW */}
      {activeTab === 'phase23-review' && (
        <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">Master Architecture Audit</span>
            <h2 className="text-xl font-bold text-white mt-1">Phase 23 Enterprise HRMS &amp; Workforce Certification</h2>
          </div>

          <div className="p-5 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl space-y-3">
            <h3 className="text-indigo-300 font-bold text-sm">✓ Phase 23 Architectural Sign-off</h3>
            <p className="text-slate-300 leading-relaxed text-xs">
              Phase 23 delivers a comprehensive Enterprise Workforce Operating System across all 46 modules. It seamlessly integrates attendance verification (GPS geofencing, face recognition, biometric thumb), multi-tier payroll calculation (monthly salary, Saturday weekly wage settlements, daily shift allowances, dumper trip incentives), contractor labour work order management, driver &amp; excavator operator licenses, safety training certifications, workforce marketplace matching, digital recruitment, competency skill matrices, expense claims, digital document vault, workforce digital twin, and AI-driven shift, attrition, and executive command analytics.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-[11px] pt-2">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Modules Implemented</span>
                <strong className="text-indigo-400 text-sm">46 / 46 Complete</strong>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Workforce Types</span>
                <strong className="text-indigo-400 text-sm">28 Categories</strong>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Ecosystem Sync</span>
                <strong className="text-emerald-400 text-sm">Mining, Fleet, Materials, CRM, Finance, Marketplace</strong>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Compliance &amp; AI</span>
                <strong className="text-emerald-400 text-sm">PF, ESI, DGMS &amp; Gemini AI Copilot</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
