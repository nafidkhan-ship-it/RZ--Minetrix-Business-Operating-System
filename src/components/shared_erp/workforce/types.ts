export type WorkforceSectionTab =
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
  | 'batta'
  | 'salary-slips'
  | 'documents'
  | 'directory'
  | 'reports'
  | 'approvals'
  | 'settings';

export type WorkforceRole =
  | 'OWNER'
  | 'DIRECTOR'
  | 'ADMIN'
  | 'GENERAL_MANAGER'
  | 'MANAGER'
  | 'ACCOUNTANT'
  | 'HR'
  | 'SUPERVISOR'
  | 'OPERATOR'
  | 'DRIVER'
  | 'STAFF';

export type EmployeeStatus =
  | 'Active'
  | 'Probation'
  | 'On Leave'
  | 'Suspended'
  | 'Inactive';

export type SalaryType =
  | 'Daily Wage'
  | 'Weekly Wage'
  | 'Monthly Salary'
  | 'Trip Commission';

export type EmploymentType =
  | 'Full Time'
  | 'Part Time'
  | 'Contract'
  | 'Temporary'
  | 'Daily Wage'
  | 'Weekly Wage'
  | 'Monthly Salary';

export type AttendanceStatus =
  | 'Present'
  | 'Absent'
  | 'Half Day'
  | 'Leave'
  | 'Holiday'
  | 'Weekly Off'
  | 'Late'
  | 'Overtime';

export type LeaveType =
  | 'Casual Leave'
  | 'Sick Leave'
  | 'Annual Leave'
  | 'Emergency Leave'
  | 'Unpaid Leave'
  | 'Compensatory Off'
  | 'Other';

export type DocumentCategory =
  | 'ID Proof'
  | 'Address Proof'
  | 'Employment Agreement'
  | 'Bank Document'
  | 'License'
  | 'Certification'
  | 'Medical/Work Fitness Document'
  | 'Other';

export type DocumentStatus =
  | 'Valid'
  | 'Expiring Soon'
  | 'Expired'
  | 'Missing';

export interface Employee {
  id: string;
  name: string;
  photo?: string;
  department: string;
  designation: string;
  role: WorkforceRole;
  branch: string;
  joiningDate: string;
  salaryType: SalaryType;
  salaryRate: number;
  status: EmployeeStatus;
  phone: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  address: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  reportingManager: string;
  employmentType: EmploymentType;
  overtimeRate: number;
  battaEligible: boolean;
  paymentMode: 'Bank Transfer' | 'Cash' | 'Cheque';
  bankDetails: {
    bankName: string;
    accountNo: string;
    ifsc: string;
    branch: string;
  };
  attendanceThisMonth: number;
  leaveBalance: number;
  advanceBalance: number;
  pendingSalary: number;
  documentsCount: number;
}

export interface Department {
  id: string;
  name: string;
  manager: string;
  employeeCount: number;
  activeCount: number;
  status: 'Active' | 'Inactive';
  description: string;
  budgetAllocated: number;
}

export interface Designation {
  id: string;
  name: string;
  department: string;
  grade: 'A' | 'B' | 'C' | 'D' | 'Executive';
  salaryType: SalaryType;
  defaultSalary: number;
  overtimeEligible: boolean;
  battaEligible: boolean;
  status: 'Active' | 'Inactive';
}

export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  breakDuration: string;
  gracePeriod: string;
  overtimeRule: string;
  department: string;
  status: 'Active' | 'Inactive';
  assignedStaffCount: number;
}

export interface AttendanceEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  shift: string;
  checkIn: string;
  checkOut: string;
  status: AttendanceStatus;
  workingHours: number;
  overtimeHours: number;
  lateMinutes: number;
  remarks: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: LeaveType;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approver: string;
  appliedDate: string;
}

export interface OvertimeEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  regularHours: number;
  overtimeHours: number;
  rate: number;
  amount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: string;
}

export interface SalarySetupItem {
  employeeId: string;
  employeeName: string;
  department: string;
  salaryType: SalaryType;
  basicSalary: number;
  dailyRate?: number;
  weeklyRate?: number;
  monthlySalary?: number;
  overtimeRate: number;
  battaRate: number;
  fixedAllowance: number;
  statutoryDeductions: number;
  bonusPercentage: number;
  advanceDeductionPlan: number;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  month: string;
  workingDays: number;
  basic: number;
  overtime: number;
  batta: number;
  allowances: number;
  advanceDeduction: number;
  otherDeductions: number;
  grossSalary: number;
  netSalary: number;
  status: 'Draft' | 'Calculated' | 'Reviewed' | 'Approved' | 'Paid';
  paymentDate?: string;
  paymentMode: string;
}

export interface StaffAdvance {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  advanceDate: string;
  purpose: string;
  advanceAmount: number;
  recoveredAmount: number;
  balance: number;
  recoveryPlan: string;
  monthlyDeduction: number;
  status: 'Active' | 'Recovered' | 'Disputed' | 'Waived';
}

export interface BattaEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  type: 'Trip Batta' | 'Food Allowance' | 'Night Halt' | 'Outstation' | 'Daily Allowance' | 'Travel Allowance' | 'Other';
  date: string;
  reference: string;
  amount: number;
  vehicleNo?: string;
  status: 'Pending' | 'Approved' | 'Paid';
  approvedBy?: string;
}

export interface StaffDocument {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  title: string;
  category: DocumentCategory;
  documentNumber: string;
  issueDate: string;
  expiryDate: string;
  status: DocumentStatus;
  fileUrl?: string;
}

export interface WorkforceApproval {
  id: string;
  type: 'Leave' | 'Attendance Correction' | 'Overtime' | 'Salary' | 'Staff Advance' | 'Batta' | 'Documents';
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  amountOrDays: string;
  requestedBy: string;
  details: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}
