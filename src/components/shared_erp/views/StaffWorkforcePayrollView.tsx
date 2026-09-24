import React, { useState, useEffect } from 'react';
import {
  Users,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  CreditCard,
  Truck,
  FileText,
  FolderLock,
  Contact,
  BarChart3,
  CheckSquare,
  Settings,
  Plus,
  Search,
  Sparkles,
  Zap,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  Printer
} from 'lucide-react';
import {
  WorkforceSectionTab,
  WorkforceRole,
  Employee
} from '../workforce/types';
import { MOCK_EMPLOYEES } from '../workforce/workforceMockData';
import { WorkforceKpiCards } from '../workforce/WorkforceKpiCards';
import { WorkforceNavPills } from '../workforce/WorkforceNavPills';

// Sub-Views
import { WorkforceDashboardView } from '../workforce/views/WorkforceDashboardView';
import { EmployeeDirectoryView } from '../workforce/views/EmployeeDirectoryView';
import {
  DepartmentsView,
  DesignationsView,
  ShiftsView
} from '../workforce/views/DepartmentsDesignationsShiftsViews';
import { AttendanceManagementView } from '../workforce/views/AttendanceManagementView';
import {
  LeaveManagementView,
  OvertimeView
} from '../workforce/views/LeaveOvertimeViews';
import {
  SalarySetupView,
  PayrollView
} from '../workforce/views/SalarySetupPayrollViews';
import {
  StaffAdvancesView,
  BattaView
} from '../workforce/views/StaffAdvancesBattaViews';
import {
  SalarySlipsView,
  StaffDocumentsView
} from '../workforce/views/SalarySlipsDocumentsViews';
import {
  StaffDirectoryView,
  WorkforceApprovalsView
} from '../workforce/views/StaffDirectoryApprovalsViews';
import {
  WorkforceReportsView,
  WorkforceSettingsView
} from '../workforce/views/WorkforceReportsSettingsViews';

// Modals
import { NewEmployeeModal } from '../workforce/modals/NewEmployeeModal';
import { EmployeeProfileModal } from '../workforce/modals/EmployeeProfileModal';
import { WorkforceSearchModal } from '../workforce/modals/WorkforceSearchModal';
import { WorkforceQuickActionModal } from '../workforce/modals/WorkforceQuickActionModal';
import { WorkforceFlowsModal } from '../workforce/modals/WorkforceFlowsModal';
import { WorkforcePrintModal } from '../workforce/modals/WorkforcePrintModal';

export type PeopleSubTab =
  | 'dashboard'
  | 'employees'
  | 'departments'
  | 'designations'
  | 'attendance'
  | 'shifts'
  | 'leave'
  | 'overtime'
  | 'salary-setup'
  | 'payroll'
  | 'advances'
  | 'advance-receipts'
  | 'batta'
  | 'salary-slips'
  | 'documents'
  | 'directory'
  | 'reports'
  | 'approvals'
  | 'settings'
  | 'staff-accounts';

interface StaffWorkforcePayrollViewProps {
  initialSubTab?: PeopleSubTab | string;
  onOpenPrintModal?: (title: string, data: any) => void;
}

export const StaffWorkforcePayrollView: React.FC<StaffWorkforcePayrollViewProps> = ({
  initialSubTab = 'dashboard',
  onOpenPrintModal: externalPrintModal
}) => {
  // Normalize incoming initialSubTab to WorkforceSectionTab
  const normalizeTab = (raw: string): WorkforceSectionTab => {
    const t = raw.toLowerCase();
    if (t === 'staff' || t === 'employees' || t === 'people' || t === 'hr') return 'employees';
    if (t === 'departments') return 'departments';
    if (t === 'designations') return 'designations';
    if (t === 'attendance') return 'attendance';
    if (t === 'shifts') return 'shifts';
    if (t === 'leave') return 'leave';
    if (t === 'overtime') return 'overtime';
    if (t === 'salary-setup') return 'salary-setup';
    if (t === 'payroll') return 'payroll';
    if (t === 'advances' || t === 'advance-receipts') return 'advances';
    if (t === 'batta') return 'batta';
    if (t === 'salary-slips' || t === 'salary-slip') return 'salary-slips';
    if (t === 'documents') return 'documents';
    if (t === 'directory' || t === 'staff-accounts' || t === 'staff-account') return 'directory';
    if (t === 'reports') return 'reports';
    if (t === 'approvals') return 'approvals';
    if (t === 'settings') return 'settings';
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState<WorkforceSectionTab>(() => normalizeTab(initialSubTab));
  const [currentRole, setCurrentRole] = useState<WorkforceRole>('OWNER');
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(MOCK_EMPLOYEES[0]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isNewEmpModalOpen, setIsNewEmpModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isFlowsModalOpen, setIsFlowsModalOpen] = useState(false);
  const [localPrintState, setLocalPrintState] = useState<{
    isOpen: boolean;
    title: string;
    data: any;
  }>({
    isOpen: false,
    title: '',
    data: null
  });

  // Sync prop changes
  useEffect(() => {
    if (initialSubTab) {
      setActiveTab(normalizeTab(initialSubTab));
    }
  }, [initialSubTab]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenPrint = (title: string, data: any) => {
    if (externalPrintModal) {
      externalPrintModal(title, data);
    } else {
      setLocalPrintState({ isOpen: true, title, data });
    }
  };

  const handleSelectEmployee = (emp: Employee) => {
    setSelectedEmployee(emp);
    setIsProfileModalOpen(true);
  };

  const handleAddNewEmployee = (newEmp: Employee) => {
    setEmployees((prev) => [newEmp, ...prev]);
    showToast(`New employee ${newEmp.name} (${newEmp.id}) onboarded successfully`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. PEOPLE & WORKFORCE HUB HEADER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black text-sm shrink-0">
              WF
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  RZ&reg; MINETRIX People &amp; Workforce
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                  STUDIO PREVIEW / DEMO DATA
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                Central workforce, employee, attendance, leave, payroll-support and staff administration workspace.
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-4xl">
                Shared ERP Core module linking all 10 RZ® MINETRIX platforms. Unifies pithead muster rolls, crusher shifts, driver trip batta, staff loan recoveries, and statutory compliance.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Universal Search</span>
            </button>
            <button
              onClick={() => setIsQuickActionsOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-amber-500/30"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Quick Actions</span>
            </button>
            <button
              onClick={() => setIsFlowsModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>7 Studio Flows</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 12 TOP KPI CARDS */}
      <WorkforceKpiCards onNavigateTab={setActiveTab} />

      {/* 3. 18-TAB HORIZONTAL WORKFORCE NAVIGATION & ROLE SWITCHER */}
      <WorkforceNavPills
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenQuickActions={() => setIsQuickActionsOpen(true)}
        onOpenFlows={() => setIsFlowsModalOpen(true)}
        onOpenNewEmployee={() => setIsNewEmpModalOpen(true)}
      />

      {/* ============================================================== */}
      {/* 4. ACTIVE SUB-VIEW RENDERING */}
      {/* ============================================================== */}

      {/* Tab 1: Workforce Dashboard */}
      {activeTab === 'dashboard' && (
        <WorkforceDashboardView
          onNavigateTab={setActiveTab}
          onOpenNewEmployeeModal={() => setIsNewEmpModalOpen(true)}
          onOpenFlowModal={() => setIsFlowsModalOpen(true)}
          onToast={showToast}
          onOpenPrintModal={handleOpenPrint}
        />
      )}

      {/* Tab 2: Employee Directory */}
      {activeTab === 'employees' && (
        <EmployeeDirectoryView
          onSelectEmployee={handleSelectEmployee}
          onOpenNewEmployeeModal={() => setIsNewEmpModalOpen(true)}
          onNavigateTab={setActiveTab}
          onToast={showToast}
          onOpenPrintModal={handleOpenPrint}
        />
      )}

      {/* Tab 3: Departments */}
      {activeTab === 'departments' && (
        <DepartmentsView
          onNavigateTab={setActiveTab}
          onToast={showToast}
          onOpenPrintModal={handleOpenPrint}
        />
      )}

      {/* Tab 4: Designations */}
      {activeTab === 'designations' && (
        <DesignationsView
          onNavigateTab={setActiveTab}
          onToast={showToast}
          onOpenPrintModal={handleOpenPrint}
        />
      )}

      {/* Tab 5: Attendance */}
      {activeTab === 'attendance' && (
        <AttendanceManagementView
          onToast={showToast}
          onOpenPrintModal={handleOpenPrint}
          onNavigateTab={setActiveTab}
        />
      )}

      {/* Tab 6: Shifts */}
      {activeTab === 'shifts' && (
        <ShiftsView
          onNavigateTab={setActiveTab}
          onToast={showToast}
          onOpenPrintModal={handleOpenPrint}
        />
      )}

      {/* Tab 7: Leave Management */}
      {activeTab === 'leave' && (
        <LeaveManagementView
          onToast={showToast}
          onOpenPrintModal={handleOpenPrint}
          onNavigateTab={setActiveTab}
        />
      )}

      {/* Tab 8: Overtime */}
      {activeTab === 'overtime' && (
        <OvertimeView
          onToast={showToast}
          onOpenPrintModal={handleOpenPrint}
          onNavigateTab={setActiveTab}
        />
      )}

      {/* Tab 9: Salary Setup */}
      {activeTab === 'salary-setup' && (
        <SalarySetupView
          onToast={showToast}
          onOpenPrintModal={handleOpenPrint}
          onNavigateTab={setActiveTab}
        />
      )}

      {/* Tab 10: Payroll */}
      {activeTab === 'payroll' && (
        <PayrollView
          onToast={showToast}
          onOpenPrintModal={handleOpenPrint}
          onNavigateTab={setActiveTab}
        />
      )}

      {/* Tab 11: Staff Advances */}
      {activeTab === 'advances' && (
        <StaffAdvancesView
          onToast={showToast}
          onOpenPrintModal={handleOpenPrint}
          onNavigateTab={setActiveTab}
        />
      )}

      {/* Tab 12: Batta & Allowances */}
      {activeTab === 'batta' && (
        <BattaView
          onToast={showToast}
          onOpenPrintModal={handleOpenPrint}
          onNavigateTab={setActiveTab}
        />
      )}

      {/* Tab 13: Salary Slips */}
      {activeTab === 'salary-slips' && (
        <SalarySlipsView
          onToast={showToast}
          onOpenPrintModal={handleOpenPrint}
          onNavigateTab={setActiveTab}
        />
      )}

      {/* Tab 14: Staff Documents */}
      {activeTab === 'documents' && (
        <StaffDocumentsView
          onToast={showToast}
          onOpenPrintModal={handleOpenPrint}
          onNavigateTab={setActiveTab}
        />
      )}

      {/* Tab 15: Staff Directory */}
      {activeTab === 'directory' && (
        <StaffDirectoryView
          onToast={showToast}
          onSelectEmployee={handleSelectEmployee}
          onNavigateTab={setActiveTab}
        />
      )}

      {/* Tab 16: Workforce Reports */}
      {activeTab === 'reports' && (
        <WorkforceReportsView
          onToast={showToast}
          onOpenPrintModal={handleOpenPrint}
          onNavigateTab={setActiveTab}
        />
      )}

      {/* Tab 17: Approvals */}
      {activeTab === 'approvals' && (
        <WorkforceApprovalsView
          onToast={showToast}
          onOpenPrintModal={handleOpenPrint}
          onNavigateTab={setActiveTab}
        />
      )}

      {/* Tab 18: Workforce Settings */}
      {activeTab === 'settings' && (
        <WorkforceSettingsView
          onToast={showToast}
          onOpenPrintModal={handleOpenPrint}
          onNavigateTab={setActiveTab}
        />
      )}

      {/* ============================================================== */}
      {/* 5. MODALS & POPUPS */}
      {/* ============================================================== */}

      {/* New Employee Modal */}
      <NewEmployeeModal
        isOpen={isNewEmpModalOpen}
        onClose={() => setIsNewEmpModalOpen(false)}
        onSave={handleAddNewEmployee}
        onToast={showToast}
      />

      {/* Employee Profile Modal */}
      <EmployeeProfileModal
        employee={selectedEmployee}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onToast={showToast}
        onOpenPrintModal={handleOpenPrint}
      />

      {/* Universal Search Modal */}
      <WorkforceSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onNavigateTab={setActiveTab}
        onToast={showToast}
      />

      {/* Quick Action Modal */}
      <WorkforceQuickActionModal
        isOpen={isQuickActionsOpen}
        onClose={() => setIsQuickActionsOpen(false)}
        onNavigateTab={setActiveTab}
        onOpenNewEmployeeModal={() => setIsNewEmpModalOpen(true)}
        onToast={showToast}
      />

      {/* 7 Interactive Flows Modal */}
      <WorkforceFlowsModal
        isOpen={isFlowsModalOpen}
        onClose={() => setIsFlowsModalOpen(false)}
        onNavigateTab={setActiveTab}
        onToast={showToast}
      />

      {/* Printable Preview Modal */}
      <WorkforcePrintModal
        isOpen={localPrintState.isOpen}
        title={localPrintState.title}
        data={localPrintState.data}
        onClose={() => setLocalPrintState({ isOpen: false, title: '', data: null })}
        onToast={showToast}
      />
    </div>
  );
};
