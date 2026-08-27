export type EmploymentStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE' | 'HOLIDAY' | 'OFF';
export type LeaveType = 'CL' | 'SL' | 'EL' | 'LOP' | 'MATERNITY' | 'PATERNITY';
export type LeaveStatus = 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
export type PayrollStatus = 'DRAFT' | 'POSTED' | 'CANCELLED';

export interface HrmsPayStructureRecord {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  basicSalary: number;
  allowanceAmount: number;
  pfPercent: number;
  otherDeductionAmount: number;
  overtimeRatePerHour: number;
  status: string;
}

export interface HrmsEmployeeRecord {
  id: string;
  tenantId: string;
  code: string;
  fullName: string;
  phone?: string;
  email?: string;
  address?: string;
  joiningDate: string;
  department: string;
  designation: string;
  employmentStatus: EmploymentStatus;
  branchId?: string;
  payStructureId?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HrmsAttendanceRecord {
  id: string;
  tenantId: string;
  employeeId: string;
  workDate: string;
  checkIn?: string;
  checkOut?: string;
  status: AttendanceStatus;
  workingHours: number;
  overtimeHours: number;
  remarks?: string;
  branchId?: string;
  leaveRequestId?: string;
}

export interface HrmsLeaveRecord {
  id: string;
  tenantId: string;
  employeeId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason?: string;
  status: LeaveStatus;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
}

export interface HrmsPayrollRecord {
  id: string;
  tenantId: string;
  employeeId: string;
  payStructureId: string;
  periodYear: number;
  periodMonth: number;
  presentDays: number;
  leaveDays: number;
  absentDays: number;
  payableDays: number;
  overtimeHours: number;
  basicSalary: number;
  allowances: number;
  overtimeAmount: number;
  deductions: number;
  grossAmount: number;
  netAmount: number;
  status: PayrollStatus;
}

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function daysInclusive(startDate: string, endDate: string): number {
  const start = Date.parse(`${startDate}T00:00:00Z`);
  const end = Date.parse(`${endDate}T00:00:00Z`);
  return Math.floor((end - start) / 86400000) + 1;
}

export function calculatePayrollAmounts(input: {
  basicSalary: number;
  allowanceAmount: number;
  pfPercent: number;
  otherDeductionAmount: number;
  overtimeHours: number;
  overtimeRatePerHour: number;
  payableDays: number;
  monthDays?: number;
}): { overtimeAmount: number; grossAmount: number; deductions: number; netAmount: number } {
  if (input.basicSalary < 0 || input.allowanceAmount < 0 || input.overtimeHours < 0) {
    throw new Error('Payroll inputs cannot be negative.');
  }
  const monthDays = input.monthDays && input.monthDays > 0 ? input.monthDays : 30;
  const proratedBasic = roundMoney((input.basicSalary * input.payableDays) / monthDays);
  const overtimeAmount = roundMoney(input.overtimeHours * input.overtimeRatePerHour);
  const grossAmount = roundMoney(proratedBasic + input.allowanceAmount + overtimeAmount);
  const pf = roundMoney((proratedBasic * input.pfPercent) / 100);
  const deductions = roundMoney(pf + input.otherDeductionAmount);
  const netAmount = roundMoney(grossAmount - deductions);
  if (netAmount < 0) {
    throw new Error('Net payroll cannot be negative.');
  }
  return { overtimeAmount, grossAmount, deductions, netAmount };
}
