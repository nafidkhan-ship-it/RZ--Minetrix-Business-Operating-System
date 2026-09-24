import { hrRepository } from '../repositories/hrRepositories.js';
import { financeRepository } from '../repositories/financeRepositories.js';
import { db, generateUuidV7 } from '../db/database.js';
import {
  HrEmployee,
  HrDepartment,
  HrDesignation,
  HrEmployeeAssignment,
  HrEmployeeUser,
  HrShift,
  HrEmployeeShift,
  HrAttendance,
  HrAttendanceCorrection,
  HrLeaveType,
  HrLeavePolicy,
  HrLeaveBalance,
  HrLeaveApplication,
  HrHoliday,
  HrOvertime,
  HrSalaryStructure,
  HrSalaryComponent,
  HrPayrollYear,
  HrPayrollPeriod,
  HrPayrollRun,
  HrPayrollItem,
  HrPayslip,
  HrSalaryAdvance,
  HrEmployeeLoan,
  HrLoanInstallment,
  HrReimbursement,
  HrEmployeeDocument,
  HrPerformanceCycle,
  HrEmployeeGoal,
  HrEmployeeReview,
  HrJobRequisition,
  HrCandidate,
  HrApplication,
  HrInterview,
  HrOffer,
  HrOnboarding,
  HrOffboarding,
  HrFinalSettlement,
  AuditLog,
  Notification,
  Journal
} from '../db/schema.js';

export class HrService {

  private logAudit(tenantId: string, userId: string, action: string, resource: string, resourceId: string, details: any) {
    const audit: AuditLog = {
      id: generateUuidV7(),
      tenantId,
      actorUserId: userId,
      actorEmail: 'hr.admin@racezoneventures.com',
      action,
      module: 'HRMS',
      resource,
      resourceId,
      ipAddress: '127.0.0.1',
      correlationId: `corr-${generateUuidV7().slice(0, 8)}`,
      status: 'SUCCESS',
      afterStateJson: JSON.stringify(details),
      createdAt: new Date().toISOString()
    };
    db.auditLogs.set(audit.id, audit);
  }

  private sendNotification(tenantId: string, recipientUserId: string, title: string, body: string) {
    const notif: Notification = {
      id: generateUuidV7(),
      tenantId,
      recipientUserId,
      title,
      body,
      type: 'INFO',
      channel: 'IN_APP',
      isRead: true,
      createdAt: new Date().toISOString()
    };
    db.notifications.set(notif.id, notif);
  }

  // ==========================================
  // DASHBOARD METRICS
  // ==========================================
  public async getDashboardMetrics(tenantId: string) {
    const employees = await hrRepository.getEmployees(tenantId);
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(e => e.employmentStatus === 'ACTIVE').length;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newJoiners = employees.filter(e => new Date(e.joiningDate) >= thirtyDaysAgo).length;
    const exits = employees.filter(e => e.employmentStatus === 'RESIGNED' || e.employmentStatus === 'TERMINATED').length;

    const todayStr = new Date().toISOString().split('T')[0];
    const todayAttendance = await hrRepository.getAttendance(tenantId, undefined, todayStr);
    const attendanceTodayCount = todayAttendance.filter(a => a.status === 'PRESENT' || a.status === 'LATE' || a.status === 'REMOTE').length;
    const absentTodayCount = todayAttendance.filter(a => a.status === 'ABSENT').length;
    const onLeaveTodayCount = todayAttendance.filter(a => a.status === 'ON_LEAVE').length;
    const lateTodayCount = todayAttendance.filter(a => a.status === 'LATE').length;

    const leaveApps = await hrRepository.getLeaveApplications(tenantId);
    const pendingLeaveApps = leaveApps.filter(l => l.status === 'SUBMITTED').length;

    const advances = await hrRepository.getSalaryAdvances(tenantId);
    const pendingAdvances = advances.filter(a => a.status === 'REQUESTED').length;

    const loans = await hrRepository.getEmployeeLoans(tenantId);
    const pendingLoans = loans.filter(l => l.status === 'REQUESTED').length;

    const reimbursements = await hrRepository.getReimbursements(tenantId);
    const pendingReimbursements = reimbursements.filter(r => r.status === 'SUBMITTED').length;

    const jobReqs = await hrRepository.getJobRequisitions(tenantId);
    const openVacancies = jobReqs.filter(j => j.status === 'OPEN').reduce((sum, j) => sum + j.openings, 0);

    const candidates = await hrRepository.getCandidates(tenantId);
    const pipelineCount = candidates.length;

    const runs = await hrRepository.getPayrollRuns(tenantId);
    const latestRun = runs.length > 0 ? runs[runs.length - 1] : null;
    const payrollCost = latestRun ? latestRun.totalNet : 0;

    // Headcount by Department
    const depts = await hrRepository.getDepartments(tenantId);
    const headcountByDept = depts.map(d => {
      const count = employees.filter(e => e.departmentId === d.id).length;
      return { departmentName: d.name, count };
    });

    return {
      totalEmployees,
      activeEmployees,
      newJoiners,
      exits,
      attendanceToday: attendanceTodayCount,
      absentToday: absentTodayCount,
      onLeaveToday: onLeaveTodayCount,
      lateToday: lateTodayCount,
      pendingLeave: pendingLeaveApps,
      pendingApprovals: pendingLeaveApps + pendingAdvances + pendingLoans + pendingReimbursements,
      pendingReimbursements,
      openVacancies,
      recruitmentPipeline: pipelineCount,
      payrollCost,
      employeeTurnoverRate: totalEmployees > 0 ? Number(((exits / totalEmployees) * 100).toFixed(1)) : 0,
      headcountByDepartment: headcountByDept
    };
  }

  // ==========================================
  // EMPLOYEE MASTER
  // ==========================================
  public async getEmployees(tenantId: string): Promise<HrEmployee[]> {
    return hrRepository.getEmployees(tenantId);
  }

  public async getEmployeeById(tenantId: string, id: string): Promise<HrEmployee | undefined> {
    return hrRepository.getEmployeeById(tenantId, id);
  }

  public async createEmployee(tenantId: string, userId: string, data: Partial<HrEmployee>): Promise<HrEmployee> {
    const existing = await hrRepository.getEmployeeByCode(tenantId, data.employeeCode || '');
    if (existing) {
      throw new Error(`Employee with code ${data.employeeCode} already exists.`);
    }

    const emp: HrEmployee = {
      id: generateUuidV7(),
      tenantId,
      employeeCode: data.employeeCode || `EMP-${Date.now().toString().slice(-4)}`,
      firstName: data.firstName || 'First',
      middleName: data.middleName || '',
      lastName: data.lastName || 'Last',
      displayName: data.displayName || `${data.firstName || 'First'} ${data.lastName || 'Last'}`,
      gender: data.gender || 'MALE',
      dateOfBirth: data.dateOfBirth || '1990-01-01',
      phone: data.phone || '+1234567890',
      email: data.email || `emp.${Date.now()}@racezoneventures.com`,
      address: data.address || 'Company HQ',
      joiningDate: data.joiningDate || new Date().toISOString().split('T')[0],
      employmentType: data.employmentType || 'FULL_TIME',
      employmentStatus: data.employmentStatus || 'ACTIVE',
      departmentId: data.departmentId || '',
      designationId: data.designationId || '',
      managerId: data.managerId,
      branchId: data.branchId,
      businessUnitId: data.businessUnitId,
      workLocation: data.workLocation || 'Main Office',
      bankAccountMasked: data.bankAccountMasked ? `****${data.bankAccountMasked.slice(-4)}` : '****1234',
      emergencyContact: data.emergencyContact || 'Emergency Contact',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = await hrRepository.saveEmployee(emp);
    this.logAudit(tenantId, userId, 'EMPLOYEE_CREATE', 'hr_employees', saved.id, saved);
    return saved;
  }

  public async updateEmployee(tenantId: string, userId: string, id: string, data: Partial<HrEmployee>): Promise<HrEmployee> {
    const existing = await hrRepository.getEmployeeById(tenantId, id);
    if (!existing) {
      throw new Error(`Employee with ID ${id} not found.`);
    }

    const updated: HrEmployee = {
      ...existing,
      ...data,
      bankAccountMasked: data.bankAccountMasked ? (data.bankAccountMasked.includes('*') ? data.bankAccountMasked : `****${data.bankAccountMasked.slice(-4)}`) : existing.bankAccountMasked,
      updatedAt: new Date().toISOString()
    };

    const saved = await hrRepository.saveEmployee(updated);
    this.logAudit(tenantId, userId, 'EMPLOYEE_UPDATE', 'hr_employees', saved.id, saved);
    return saved;
  }

  public async linkEmployeeUser(tenantId: string, userId: string, employeeId: string, targetUserId: string): Promise<HrEmployeeUser> {
    const emp = await hrRepository.getEmployeeById(tenantId, employeeId);
    if (!emp) throw new Error(`Employee ${employeeId} not found.`);

    const link: HrEmployeeUser = {
      id: generateUuidV7(),
      tenantId,
      employeeId,
      userId: targetUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = await hrRepository.saveEmployeeUser(link);
    this.logAudit(tenantId, userId, 'EMPLOYEE_USER_LINK', 'hr_employee_users', saved.id, saved);
    return saved;
  }

  // ==========================================
  // DEPARTMENTS & DESIGNATIONS
  // ==========================================
  public async getDepartments(tenantId: string): Promise<HrDepartment[]> {
    return hrRepository.getDepartments(tenantId);
  }

  public async createDepartment(tenantId: string, userId: string, data: Partial<HrDepartment>): Promise<HrDepartment> {
    const dept: HrDepartment = {
      id: generateUuidV7(),
      tenantId,
      code: data.code || `DEPT-${Date.now().toString().slice(-3)}`,
      name: data.name || 'Department',
      description: data.description || '',
      headEmployeeId: data.headEmployeeId,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = await hrRepository.saveDepartment(dept);
    this.logAudit(tenantId, userId, 'DEPARTMENT_CREATE', 'hr_departments', saved.id, saved);
    return saved;
  }

  public async getDesignations(tenantId: string): Promise<HrDesignation[]> {
    return hrRepository.getDesignations(tenantId);
  }

  public async createDesignation(tenantId: string, userId: string, data: Partial<HrDesignation>): Promise<HrDesignation> {
    const desig: HrDesignation = {
      id: generateUuidV7(),
      tenantId,
      code: data.code || `DESIG-${Date.now().toString().slice(-3)}`,
      title: data.title || 'Designation Title',
      departmentId: data.departmentId,
      gradeLevel: data.gradeLevel || 'G1',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = await hrRepository.saveDesignation(desig);
    this.logAudit(tenantId, userId, 'DESIGNATION_CREATE', 'hr_designations', saved.id, saved);
    return saved;
  }

  // ==========================================
  // SHIFTS
  // ==========================================
  public async getShifts(tenantId: string): Promise<HrShift[]> {
    return hrRepository.getShifts(tenantId);
  }

  public async createShift(tenantId: string, userId: string, data: Partial<HrShift>): Promise<HrShift> {
    const shift: HrShift = {
      id: generateUuidV7(),
      tenantId,
      shiftCode: data.shiftCode || `SHIFT-${Date.now().toString().slice(-3)}`,
      shiftName: data.shiftName || 'Day Shift',
      startTime: data.startTime || '09:00',
      endTime: data.endTime || '17:00',
      graceMinutes: data.graceMinutes || 15,
      breakMinutes: data.breakMinutes || 60,
      overtimeAfterMinutes: data.overtimeAfterMinutes || 480,
      shiftType: data.shiftType || 'DAY',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = await hrRepository.saveShift(shift);
    this.logAudit(tenantId, userId, 'SHIFT_CREATE', 'hr_shifts', saved.id, saved);
    return saved;
  }

  // ==========================================
  // ATTENDANCE & CORRECTIONS
  // ==========================================
  public async getAttendance(tenantId: string, employeeId?: string, date?: string): Promise<HrAttendance[]> {
    return hrRepository.getAttendance(tenantId, employeeId, date);
  }

  public async checkIn(tenantId: string, userId: string, employeeId: string, checkInTime?: string): Promise<HrAttendance> {
    const dateStr = new Date().toISOString().split('T')[0];
    const existing = await hrRepository.getAttendance(tenantId, employeeId, dateStr);
    
    if (existing.length > 0 && existing[0].checkIn) {
      throw new Error(`Employee ${employeeId} has already checked in today (${dateStr}).`);
    }

    const checkInIso = checkInTime || new Date().toISOString();
    const att: HrAttendance = {
      id: existing.length > 0 ? existing[0].id : generateUuidV7(),
      tenantId,
      employeeId,
      date: dateStr,
      checkIn: checkInIso,
      breakMinutes: 0,
      workingMinutes: 0,
      overtimeMinutes: 0,
      lateMinutes: 0,
      status: 'PRESENT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = await hrRepository.saveAttendance(att);
    this.logAudit(tenantId, userId, 'ATTENDANCE_CHECK_IN', 'hr_attendance', saved.id, saved);
    return saved;
  }

  public async checkOut(tenantId: string, userId: string, attendanceId: string, checkOutTime?: string): Promise<HrAttendance> {
    const att = await hrRepository.getAttendanceById(tenantId, attendanceId);
    if (!att) throw new Error(`Attendance record ${attendanceId} not found.`);

    const checkOutIso = checkOutTime || new Date().toISOString();
    const checkInMs = new Date(att.checkIn || att.createdAt).getTime();
    const checkOutMs = new Date(checkOutIso).getTime();

    const durationMinutes = Math.max(0, Math.floor((checkOutMs - checkInMs) / (1000 * 60)) - att.breakMinutes);
    const standardWorkingMinutes = 480; // 8 hours
    const overtime = durationMinutes > standardWorkingMinutes ? durationMinutes - standardWorkingMinutes : 0;

    const updated: HrAttendance = {
      ...att,
      checkOut: checkOutIso,
      workingMinutes: durationMinutes,
      overtimeMinutes: overtime,
      status: durationMinutes > 0 ? 'PRESENT' : 'ABSENT',
      updatedAt: new Date().toISOString()
    };

    const saved = await hrRepository.saveAttendance(updated);
    this.logAudit(tenantId, userId, 'ATTENDANCE_CHECK_OUT', 'hr_attendance', saved.id, saved);
    return saved;
  }

  public async submitAttendanceCorrection(tenantId: string, userId: string, data: Partial<HrAttendanceCorrection>): Promise<HrAttendanceCorrection> {
    const corr: HrAttendanceCorrection = {
      id: generateUuidV7(),
      tenantId,
      attendanceId: data.attendanceId,
      employeeId: data.employeeId || '',
      date: data.date || new Date().toISOString().split('T')[0],
      requestedCheckIn: data.requestedCheckIn || new Date().toISOString(),
      requestedCheckOut: data.requestedCheckOut || new Date().toISOString(),
      reason: data.reason || 'Correction requested',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = await hrRepository.saveAttendanceCorrection(corr);
    this.logAudit(tenantId, userId, 'ATTENDANCE_CORRECTION_SUBMIT', 'hr_attendance_corrections', saved.id, saved);
    return saved;
  }

  public async approveAttendanceCorrection(tenantId: string, userId: string, correctionId: string, approved: boolean): Promise<HrAttendanceCorrection> {
    const list = await hrRepository.getAttendanceCorrections(tenantId);
    const corr = list.find(c => c.id === correctionId);
    if (!corr) throw new Error(`Correction ${correctionId} not found.`);

    corr.status = approved ? 'APPROVED' : 'REJECTED';
    corr.approvedBy = userId;
    corr.updatedAt = new Date().toISOString();

    if (approved) {
      let att = corr.attendanceId ? await hrRepository.getAttendanceById(tenantId, corr.attendanceId) : undefined;
      if (!att) {
        att = {
          id: generateUuidV7(),
          tenantId,
          employeeId: corr.employeeId,
          date: corr.date,
          breakMinutes: 0,
          workingMinutes: 480,
          overtimeMinutes: 0,
          lateMinutes: 0,
          status: 'PRESENT',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
      att.checkIn = corr.requestedCheckIn;
      att.checkOut = corr.requestedCheckOut;
      const inMs = new Date(corr.requestedCheckIn).getTime();
      const outMs = new Date(corr.requestedCheckOut).getTime();
      att.workingMinutes = Math.max(0, Math.floor((outMs - inMs) / 60000) - att.breakMinutes);
      att.status = 'PRESENT';
      await hrRepository.saveAttendance(att);
    }

    const saved = await hrRepository.saveAttendanceCorrection(corr);
    this.logAudit(tenantId, userId, 'ATTENDANCE_CORRECTION_APPROVE', 'hr_attendance_corrections', saved.id, saved);
    return saved;
  }

  // ==========================================
  // LEAVE MANAGEMENT
  // ==========================================
  public async getLeaveTypes(tenantId: string): Promise<HrLeaveType[]> {
    return hrRepository.getLeaveTypes(tenantId);
  }

  public async getLeaveBalances(tenantId: string, employeeId?: string): Promise<HrLeaveBalance[]> {
    return hrRepository.getLeaveBalances(tenantId, employeeId);
  }

  public async applyLeave(tenantId: string, userId: string, data: Partial<HrLeaveApplication>): Promise<HrLeaveApplication> {
    const employeeId = data.employeeId || '';
    const startDate = data.startDate || '';
    const endDate = data.endDate || '';

    // Check for overlapping existing leave applications
    const existingApps = await hrRepository.getLeaveApplications(tenantId, employeeId);
    const hasOverlap = existingApps.some(app => {
      if (app.status === 'REJECTED' || app.status === 'CANCELLED') return false;
      return (startDate <= app.endDate && endDate >= app.startDate);
    });

    if (hasOverlap) {
      throw new Error(`Invalid leave application: Overlaps with an existing leave application from ${startDate} to ${endDate}.`);
    }

    const startMs = new Date(startDate).getTime();
    const endMs = new Date(endDate).getTime();
    const diffDays = Math.max(1, Math.ceil((endMs - startMs) / (1000 * 60 * 60 * 24)) + 1);

    const app: HrLeaveApplication = {
      id: generateUuidV7(),
      tenantId,
      employeeId,
      leaveTypeId: data.leaveTypeId || '',
      startDate,
      endDate,
      totalDays: data.totalDays || diffDays,
      reason: data.reason || 'Personal leave',
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = await hrRepository.saveLeaveApplication(app);
    this.logAudit(tenantId, userId, 'LEAVE_SUBMIT', 'hr_leave_applications', saved.id, saved);
    this.sendNotification(tenantId, userId, 'Leave Application Submitted', `Leave application submitted for ${diffDays} day(s).`);
    return saved;
  }

  public async approveLeave(tenantId: string, userId: string, applicationId: string, approved: boolean): Promise<HrLeaveApplication> {
    const list = await hrRepository.getLeaveApplications(tenantId);
    const app = list.find(a => a.id === applicationId);
    if (!app) throw new Error(`Leave application ${applicationId} not found.`);

    app.status = approved ? 'APPROVED' : 'REJECTED';
    app.approvedBy = userId;
    app.updatedAt = new Date().toISOString();

    if (approved) {
      // Automatically deduct leave balance
      const currentYear = new Date().getFullYear();
      const balances = await hrRepository.getLeaveBalances(tenantId, app.employeeId);
      let bal = balances.find(b => b.leaveTypeId === app.leaveTypeId && b.year === currentYear);

      if (!bal) {
        bal = {
          id: generateUuidV7(),
          tenantId,
          employeeId: app.employeeId,
          leaveTypeId: app.leaveTypeId,
          year: currentYear,
          totalAllocated: 15,
          used: 0,
          pending: 0,
          remaining: 15,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }

      bal.used += app.totalDays;
      bal.remaining = Math.max(0, bal.totalAllocated - bal.used);
      bal.updatedAt = new Date().toISOString();
      await hrRepository.saveLeaveBalance(bal);
    }

    const saved = await hrRepository.saveLeaveApplication(app);
    this.logAudit(tenantId, userId, 'LEAVE_APPROVE', 'hr_leave_applications', saved.id, saved);
    this.sendNotification(tenantId, userId, `Leave Application ${approved ? 'Approved' : 'Rejected'}`, `Your leave request from ${app.startDate} was ${app.status.toLowerCase()}.`);
    return saved;
  }

  // ==========================================
  // HOLIDAYS & OVERTIME
  // ==========================================
  public async getHolidays(tenantId: string): Promise<HrHoliday[]> {
    return hrRepository.getHolidays(tenantId);
  }

  public async createHoliday(tenantId: string, userId: string, data: Partial<HrHoliday>): Promise<HrHoliday> {
    const hol: HrHoliday = {
      id: generateUuidV7(),
      tenantId,
      name: data.name || 'Holiday',
      date: data.date || new Date().toISOString().split('T')[0],
      branchId: data.branchId,
      businessUnitId: data.businessUnitId,
      holidayType: data.holidayType || 'NATIONAL',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = await hrRepository.saveHoliday(hol);
    this.logAudit(tenantId, userId, 'HOLIDAY_CREATE', 'hr_holidays', saved.id, saved);
    return saved;
  }

  public async getOvertime(tenantId: string): Promise<HrOvertime[]> {
    return hrRepository.getOvertime(tenantId);
  }

  public async approveOvertime(tenantId: string, userId: string, overtimeId: string, approvedMinutes: number, rate: number = 1.5): Promise<HrOvertime> {
    const list = await hrRepository.getOvertime(tenantId);
    const ot = list.find(o => o.id === overtimeId);
    if (!ot) throw new Error(`Overtime record ${overtimeId} not found.`);

    const hourlyRate = 25.00; // Base rate
    const amount = (approvedMinutes / 60) * hourlyRate * rate;

    ot.approvedMinutes = approvedMinutes;
    ot.rate = rate;
    ot.amount = amount;
    ot.approvalStatus = 'APPROVED';
    ot.approvedBy = userId;
    ot.updatedAt = new Date().toISOString();

    const saved = await hrRepository.saveOvertime(ot);
    this.logAudit(tenantId, userId, 'OVERTIME_APPROVE', 'hr_overtime', saved.id, saved);
    return saved;
  }

  // ==========================================
  // SALARY STRUCTURES & COMPONENTS
  // ==========================================
  public async getSalaryStructures(tenantId: string, employeeId?: string): Promise<HrSalaryStructure[]> {
    return hrRepository.getSalaryStructures(tenantId, employeeId);
  }

  public async createSalaryStructure(tenantId: string, userId: string, data: Partial<HrSalaryStructure>, components: Partial<HrSalaryComponent>[] = []): Promise<HrSalaryStructure> {
    const ss: HrSalaryStructure = {
      id: generateUuidV7(),
      tenantId,
      employeeId: data.employeeId || '',
      effectiveDate: data.effectiveDate || new Date().toISOString().split('T')[0],
      baseSalary: data.baseSalary || 5000,
      payFrequency: data.payFrequency || 'MONTHLY',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = await hrRepository.saveSalaryStructure(ss);

    // Save default components if none provided
    const defaultComps: Partial<HrSalaryComponent>[] = components.length > 0 ? components : [
      { componentName: 'Basic Salary', componentType: 'EARNING', amount: ss.baseSalary * 0.5 },
      { componentName: 'House Rent Allowance (HRA)', componentType: 'EARNING', amount: ss.baseSalary * 0.2 },
      { componentName: 'Special Allowance', componentType: 'EARNING', amount: ss.baseSalary * 0.3 }
    ];

    for (const compData of defaultComps) {
      const comp: HrSalaryComponent = {
        id: generateUuidV7(),
        tenantId,
        salaryStructureId: saved.id,
        componentName: compData.componentName || 'Allowance',
        componentType: compData.componentType || 'EARNING',
        amount: compData.amount || 0,
        isPercentage: compData.isPercentage || false,
        percentageOf: compData.percentageOf,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await hrRepository.saveSalaryComponent(comp);
    }

    this.logAudit(tenantId, userId, 'SALARY_STRUCTURE_CREATE', 'hr_salary_structures', saved.id, saved);
    return saved;
  }

  // ==========================================
  // PAYROLL & PERIODS & PAYSLIPS
  // ==========================================
  public async getPayrollPeriods(tenantId: string): Promise<HrPayrollPeriod[]> {
    return hrRepository.getPayrollPeriods(tenantId);
  }

  public async createPayrollPeriod(tenantId: string, userId: string, data: Partial<HrPayrollPeriod>): Promise<HrPayrollPeriod> {
    const period: HrPayrollPeriod = {
      id: generateUuidV7(),
      tenantId,
      yearId: data.yearId || generateUuidV7(),
      periodName: data.periodName || `Period ${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
      month: data.month || new Date().getMonth() + 1,
      year: data.year || new Date().getFullYear(),
      startDate: data.startDate || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`,
      endDate: data.endDate || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-28`,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = await hrRepository.savePayrollPeriod(period);
    this.logAudit(tenantId, userId, 'PAYROLL_PERIOD_CREATE', 'hr_payroll_periods', saved.id, saved);
    return saved;
  }

  public async getPayrollRuns(tenantId: string): Promise<HrPayrollRun[]> {
    return hrRepository.getPayrollRuns(tenantId);
  }

  public async calculatePayroll(tenantId: string, periodId: string, userId: string): Promise<HrPayrollRun> {
    const period = (await hrRepository.getPayrollPeriods(tenantId)).find(p => p.id === periodId);
    if (!period) throw new Error(`Payroll period ${periodId} not found.`);

    if (period.status === 'LOCKED' || period.status === 'CLOSED') {
      throw new Error(`Cannot modify or calculate payroll for a ${period.status} period.`);
    }

    const employees = (await hrRepository.getEmployees(tenantId)).filter(e => e.employmentStatus === 'ACTIVE');
    const runNumber = `PRUN-${period.year}-${String(period.month).padStart(2, '0')}-${Date.now().toString().slice(-4)}`;

    const run: HrPayrollRun = {
      id: generateUuidV7(),
      tenantId,
      periodId,
      runNumber,
      runDate: new Date().toISOString().split('T')[0],
      totalEmployees: employees.length,
      totalGross: 0,
      totalDeductions: 0,
      totalNet: 0,
      status: 'CALCULATING',
      processedBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let runTotalGross = 0;
    let runTotalDeductions = 0;
    let runTotalNet = 0;

    for (const emp of employees) {
      const structures = await hrRepository.getSalaryStructures(tenantId, emp.id);
      const activeStruct = structures.find(s => s.status === 'ACTIVE') || { baseSalary: 5000 };
      const baseSalary = activeStruct.baseSalary || 5000;

      const basicEarnings = baseSalary * 0.5;
      const hra = baseSalary * 0.2;
      const allowances = baseSalary * 0.3;

      // Calculate Overtime for the employee
      const otList = (await hrRepository.getOvertime(tenantId)).filter(o => o.employeeId === emp.id && o.approvalStatus === 'APPROVED');
      const overtimeAmount = otList.reduce((sum, o) => sum + o.amount, 0);

      const grossEarnings = basicEarnings + hra + allowances + overtimeAmount;

      // Calculate Advance Recovery
      const advances = (await hrRepository.getSalaryAdvances(tenantId, emp.id)).filter(a => a.status === 'DISBURSED' || a.status === 'PARTIALLY_RECOVERED');
      const advanceDeduction = advances.reduce((sum, a) => sum + Math.min(a.monthlyRecoveryAmount, a.remainingBalance), 0);

      // Calculate Loan Recovery
      const loans = (await hrRepository.getEmployeeLoans(tenantId, emp.id)).filter(l => l.status === 'ACTIVE');
      const loanDeduction = loans.reduce((sum, l) => sum + Math.min(l.monthlyDeduction, l.remainingBalance), 0);

      const unpaidLeaveDeduction = 0;
      const otherDeductions = 0;

      const totalDeductions = advanceDeduction + loanDeduction + unpaidLeaveDeduction + otherDeductions;
      
      // FORMULA: NET SALARY = GROSS EARNINGS - TOTAL DEDUCTIONS
      const netSalary = grossEarnings - totalDeductions;

      runTotalGross += grossEarnings;
      runTotalDeductions += totalDeductions;
      runTotalNet += netSalary;

      const item: HrPayrollItem = {
        id: generateUuidV7(),
        tenantId,
        payrollRunId: run.id,
        employeeId: emp.id,
        basicEarnings,
        hra,
        allowances,
        overtimeAmount,
        bonusAmount: 0,
        grossEarnings,
        advanceDeduction,
        loanDeduction,
        unpaidLeaveDeduction,
        otherDeductions,
        totalDeductions,
        netSalary,
        status: 'GENERATED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await hrRepository.savePayrollItem(item);

      // Generate Payslip
      const depts = await hrRepository.getDepartments(tenantId);
      const desigs = await hrRepository.getDesignations(tenantId);
      const deptName = depts.find(d => d.id === emp.departmentId)?.name || 'General';
      const desigName = desigs.find(d => d.id === emp.designationId)?.title || 'Employee';

      const payslip: HrPayslip = {
        id: generateUuidV7(),
        tenantId,
        payrollRunId: run.id,
        payrollItemId: item.id,
        employeeId: emp.id,
        employeeCode: emp.employeeCode,
        departmentName: deptName,
        designationName: desigName,
        periodName: period.periodName,
        grossSalary: grossEarnings,
        totalDeductions,
        netSalary,
        earningsJson: JSON.stringify({ basic: basicEarnings, hra, allowances, overtime: overtimeAmount }),
        deductionsJson: JSON.stringify({ advance: advanceDeduction, loan: loanDeduction }),
        status: 'GENERATED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await hrRepository.savePayslip(payslip);
    }

    run.totalGross = runTotalGross;
    run.totalDeductions = runTotalDeductions;
    run.totalNet = runTotalNet;
    run.status = 'REVIEW';
    run.updatedAt = new Date().toISOString();

    const savedRun = await hrRepository.savePayrollRun(run);
    this.logAudit(tenantId, userId, 'PAYROLL_CALCULATE', 'hr_payroll_runs', savedRun.id, savedRun);
    return savedRun;
  }

  public async approvePayroll(tenantId: string, runId: string, userId: string): Promise<HrPayrollRun> {
    const run = await hrRepository.getPayrollRunById(tenantId, runId);
    if (!run) throw new Error(`Payroll run ${runId} not found.`);

    run.status = 'APPROVED';
    run.updatedAt = new Date().toISOString();
    const saved = await hrRepository.savePayrollRun(run);
    this.logAudit(tenantId, userId, 'PAYROLL_APPROVE', 'hr_payroll_runs', saved.id, saved);
    return saved;
  }

  public async processPayroll(tenantId: string, runId: string, userId: string): Promise<HrPayrollRun> {
    const run = await hrRepository.getPayrollRunById(tenantId, runId);
    if (!run) throw new Error(`Payroll run ${runId} not found.`);

    run.status = 'PROCESSED';
    run.updatedAt = new Date().toISOString();

    // Deduct advance/loan balances upon processing
    const items = await hrRepository.getPayrollItems(tenantId, runId);
    for (const item of items) {
      if (item.advanceDeduction > 0) {
        const advances = await hrRepository.getSalaryAdvances(tenantId, item.employeeId);
        for (const adv of advances) {
          if (adv.remainingBalance > 0) {
            const deduct = Math.min(adv.remainingBalance, item.advanceDeduction);
            adv.recoveredAmount += deduct;
            adv.remainingBalance -= deduct;
            if (adv.remainingBalance <= 0) adv.status = 'RECOVERED';
            else adv.status = 'PARTIALLY_RECOVERED';
            await hrRepository.saveSalaryAdvance(adv);
          }
        }
      }
      if (item.loanDeduction > 0) {
        const loans = await hrRepository.getEmployeeLoans(tenantId, item.employeeId);
        for (const loan of loans) {
          if (loan.remainingBalance > 0) {
            const deduct = Math.min(loan.remainingBalance, item.loanDeduction);
            loan.recoveredAmount += deduct;
            loan.remainingBalance -= deduct;
            if (loan.remainingBalance <= 0) loan.status = 'COMPLETED';
            await hrRepository.saveEmployeeLoan(loan);
          }
        }
      }
    }

    // FINANCE INTEGRATION: Post Journal Entry in Phase 21 Finance
    const journal: Journal = {
      id: generateUuidV7(),
      tenantId,
      journalNumber: `JNL-PAYROLL-${run.runNumber}`,
      journalDate: new Date().toISOString().split('T')[0],
      referenceType: 'EXPENSE',
      referenceId: run.id,
      description: `Payroll Processing Expense for Run ${run.runNumber}`,
      totalDebit: run.totalNet,
      totalCredit: run.totalNet,
      status: 'POSTED',
      createdBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.journals.set(journal.id, journal);
    run.journalId = journal.id;

    const saved = await hrRepository.savePayrollRun(run);
    this.logAudit(tenantId, userId, 'PAYROLL_PROCESS', 'hr_payroll_runs', saved.id, saved);
    return saved;
  }

  public async getPayslips(tenantId: string, employeeId?: string): Promise<HrPayslip[]> {
    return hrRepository.getPayslips(tenantId, employeeId);
  }

  // ==========================================
  // SALARY ADVANCES & LOANS
  // ==========================================
  public async getSalaryAdvances(tenantId: string, employeeId?: string): Promise<HrSalaryAdvance[]> {
    return hrRepository.getSalaryAdvances(tenantId, employeeId);
  }

  public async requestSalaryAdvance(tenantId: string, userId: string, data: Partial<HrSalaryAdvance>): Promise<HrSalaryAdvance> {
    const adv: HrSalaryAdvance = {
      id: generateUuidV7(),
      tenantId,
      employeeId: data.employeeId || '',
      amount: data.amount || 1000,
      reason: data.reason || 'Emergency advance',
      monthlyRecoveryAmount: data.monthlyRecoveryAmount || 250,
      recoveredAmount: 0,
      remainingBalance: data.amount || 1000,
      status: 'REQUESTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = await hrRepository.saveSalaryAdvance(adv);
    this.logAudit(tenantId, userId, 'ADVANCE_REQUEST', 'hr_salary_advances', saved.id, saved);
    return saved;
  }

  public async approveSalaryAdvance(tenantId: string, userId: string, advanceId: string, approved: boolean): Promise<HrSalaryAdvance> {
    const list = await hrRepository.getSalaryAdvances(tenantId);
    const adv = list.find(a => a.id === advanceId);
    if (!adv) throw new Error(`Salary advance ${advanceId} not found.`);

    adv.status = approved ? 'DISBURSED' : 'REJECTED';
    adv.approvedBy = userId;
    adv.updatedAt = new Date().toISOString();

    const saved = await hrRepository.saveSalaryAdvance(adv);
    this.logAudit(tenantId, userId, 'ADVANCE_APPROVE', 'hr_salary_advances', saved.id, saved);
    return saved;
  }

  public async getEmployeeLoans(tenantId: string, employeeId?: string): Promise<HrEmployeeLoan[]> {
    return hrRepository.getEmployeeLoans(tenantId, employeeId);
  }

  public async requestEmployeeLoan(tenantId: string, userId: string, data: Partial<HrEmployeeLoan>): Promise<HrEmployeeLoan> {
    const amount = data.loanAmount || 5000;
    const installments = data.installments || 12;
    const monthly = Number((amount / installments).toFixed(2));

    const loan: HrEmployeeLoan = {
      id: generateUuidV7(),
      tenantId,
      employeeId: data.employeeId || '',
      loanAmount: amount,
      interestRate: data.interestRate || 0,
      installments,
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      monthlyDeduction: monthly,
      recoveredAmount: 0,
      remainingBalance: amount,
      status: 'REQUESTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = await hrRepository.saveEmployeeLoan(loan);
    this.logAudit(tenantId, userId, 'LOAN_REQUEST', 'hr_employee_loans', saved.id, saved);
    return saved;
  }

  public async approveEmployeeLoan(tenantId: string, userId: string, loanId: string, approved: boolean): Promise<HrEmployeeLoan> {
    const list = await hrRepository.getEmployeeLoans(tenantId);
    const loan = list.find(l => l.id === loanId);
    if (!loan) throw new Error(`Loan ${loanId} not found.`);

    loan.status = approved ? 'ACTIVE' : 'CANCELLED';
    loan.approvedBy = userId;
    loan.updatedAt = new Date().toISOString();

    const saved = await hrRepository.saveEmployeeLoan(loan);
    this.logAudit(tenantId, userId, 'LOAN_APPROVE', 'hr_employee_loans', saved.id, saved);
    return saved;
  }

  // ==========================================
  // REIMBURSEMENTS & FINANCE INTEGRATION
  // ==========================================
  public async getReimbursements(tenantId: string, employeeId?: string): Promise<HrReimbursement[]> {
    return hrRepository.getReimbursements(tenantId, employeeId);
  }

  public async submitReimbursement(tenantId: string, userId: string, data: Partial<HrReimbursement>): Promise<HrReimbursement> {
    const reimb: HrReimbursement = {
      id: generateUuidV7(),
      tenantId,
      employeeId: data.employeeId || '',
      category: data.category || 'Travel',
      amount: data.amount || 150,
      expenseDate: data.expenseDate || new Date().toISOString().split('T')[0],
      description: data.description || 'Travel reimbursement',
      receiptReference: data.receiptReference || 'REC-001',
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = await hrRepository.saveReimbursement(reimb);
    this.logAudit(tenantId, userId, 'REIMBURSEMENT_SUBMIT', 'hr_reimbursements', saved.id, saved);
    return saved;
  }

  public async approveReimbursement(tenantId: string, userId: string, reimbursementId: string, approved: boolean): Promise<HrReimbursement> {
    const list = await hrRepository.getReimbursements(tenantId);
    const reimb = list.find(r => r.id === reimbursementId);
    if (!reimb) throw new Error(`Reimbursement ${reimbursementId} not found.`);

    reimb.status = approved ? 'APPROVED' : 'REJECTED';
    reimb.approvedBy = userId;
    reimb.updatedAt = new Date().toISOString();

    if (approved) {
      // FINANCE INTEGRATION: Create Journal Entry in Phase 21 Finance
      const journal: Journal = {
        id: generateUuidV7(),
        tenantId,
        journalNumber: `JNL-REIMB-${Date.now().toString().slice(-4)}`,
        journalDate: new Date().toISOString().split('T')[0],
        referenceType: 'EXPENSE',
        referenceId: reimb.id,
        description: `Employee Reimbursement: ${reimb.category} - ${reimb.description}`,
        totalDebit: reimb.amount,
        totalCredit: reimb.amount,
        status: 'POSTED',
        createdBy: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      db.journals.set(journal.id, journal);
      reimb.financeJournalId = journal.id;
      reimb.status = 'PAID';
    }

    const saved = await hrRepository.saveReimbursement(reimb);
    this.logAudit(tenantId, userId, 'REIMBURSEMENT_APPROVE', 'hr_reimbursements', saved.id, saved);
    return saved;
  }

  // ==========================================
  // DOCUMENTS
  // ==========================================
  public async getEmployeeDocuments(tenantId: string, employeeId?: string): Promise<HrEmployeeDocument[]> {
    return hrRepository.getEmployeeDocuments(tenantId, employeeId);
  }

  public async addEmployeeDocument(tenantId: string, userId: string, data: Partial<HrEmployeeDocument>): Promise<HrEmployeeDocument> {
    const doc: HrEmployeeDocument = {
      id: generateUuidV7(),
      tenantId,
      employeeId: data.employeeId || '',
      documentType: data.documentType || 'ID',
      documentName: data.documentName || 'Document.pdf',
      fileReference: data.fileReference || 'doc_ref_123',
      expiryDate: data.expiryDate,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = await hrRepository.saveEmployeeDocument(doc);
    this.logAudit(tenantId, userId, 'EMPLOYEE_DOCUMENT_ADD', 'hr_employee_documents', saved.id, saved);
    return saved;
  }

  // ==========================================
  // PERFORMANCE
  // ==========================================
  public async getPerformanceCycles(tenantId: string): Promise<HrPerformanceCycle[]> {
    return hrRepository.getPerformanceCycles(tenantId);
  }

  public async createPerformanceCycle(tenantId: string, userId: string, data: Partial<HrPerformanceCycle>): Promise<HrPerformanceCycle> {
    const pc: HrPerformanceCycle = {
      id: generateUuidV7(),
      tenantId,
      cycleName: data.cycleName || `Annual Review ${new Date().getFullYear()}`,
      startDate: data.startDate || `${new Date().getFullYear()}-01-01`,
      endDate: data.endDate || `${new Date().getFullYear()}-12-31`,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = await hrRepository.savePerformanceCycle(pc);
    this.logAudit(tenantId, userId, 'PERFORMANCE_CYCLE_CREATE', 'hr_performance_cycles', saved.id, saved);
    return saved;
  }

  public async getEmployeeGoals(tenantId: string, employeeId?: string): Promise<HrEmployeeGoal[]> {
    return hrRepository.getEmployeeGoals(tenantId, employeeId);
  }

  public async createEmployeeGoal(tenantId: string, userId: string, data: Partial<HrEmployeeGoal>): Promise<HrEmployeeGoal> {
    const goal: HrEmployeeGoal = {
      id: generateUuidV7(),
      tenantId,
      cycleId: data.cycleId || '',
      employeeId: data.employeeId || '',
      goalTitle: data.goalTitle || 'Quarterly KPI Goal',
      description: data.description || 'Achieve operational SLA target',
      weightage: data.weightage || 100,
      targetValue: data.targetValue || 100,
      achievedValue: data.achievedValue || 0,
      status: 'IN_PROGRESS',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = await hrRepository.saveEmployeeGoal(goal);
    this.logAudit(tenantId, userId, 'EMPLOYEE_GOAL_CREATE', 'hr_employee_goals', saved.id, saved);
    return saved;
  }

  public async getEmployeeReviews(tenantId: string, employeeId?: string): Promise<HrEmployeeReview[]> {
    return hrRepository.getEmployeeReviews(tenantId, employeeId);
  }

  public async submitEmployeeReview(tenantId: string, userId: string, data: Partial<HrEmployeeReview>): Promise<HrEmployeeReview> {
    const rev: HrEmployeeReview = {
      id: generateUuidV7(),
      tenantId,
      cycleId: data.cycleId || '',
      employeeId: data.employeeId || '',
      reviewerUserId: userId,
      selfRating: data.selfRating || 4.5,
      managerRating: data.managerRating || 4.5,
      finalRating: data.finalRating || 4.5,
      feedback: data.feedback || 'Exceeds performance benchmarks.',
      status: 'COMPLETED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = await hrRepository.saveEmployeeReview(rev);
    this.logAudit(tenantId, userId, 'EMPLOYEE_REVIEW_SUBMIT', 'hr_employee_reviews', saved.id, saved);
    return saved;
  }

  // ==========================================
  // RECRUITMENT & ATS
  // ==========================================
  public async getJobRequisitions(tenantId: string): Promise<HrJobRequisition[]> {
    return hrRepository.getJobRequisitions(tenantId);
  }

  public async createJobRequisition(tenantId: string, userId: string, data: Partial<HrJobRequisition>): Promise<HrJobRequisition> {
    const req: HrJobRequisition = {
      id: generateUuidV7(),
      tenantId,
      title: data.title || 'Senior Software Engineer',
      departmentId: data.departmentId || '',
      designationId: data.designationId || '',
      openings: data.openings || 2,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = await hrRepository.saveJobRequisition(req);
    this.logAudit(tenantId, userId, 'JOB_REQUISITION_CREATE', 'hr_job_requisitions', saved.id, saved);
    return saved;
  }

  public async getCandidates(tenantId: string): Promise<HrCandidate[]> {
    return hrRepository.getCandidates(tenantId);
  }

  public async createCandidate(tenantId: string, userId: string, data: Partial<HrCandidate>): Promise<HrCandidate> {
    const cand: HrCandidate = {
      id: generateUuidV7(),
      tenantId,
      firstName: data.firstName || 'Candidate',
      lastName: data.lastName || 'Name',
      email: data.email || `candidate.${Date.now()}@example.com`,
      phone: data.phone || '+1234567890',
      resumeReference: data.resumeReference || 'resume_ref_123',
      status: 'NEW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = await hrRepository.saveCandidate(cand);
    this.logAudit(tenantId, userId, 'CANDIDATE_CREATE', 'hr_candidates', saved.id, saved);
    return saved;
  }

  public async getApplications(tenantId: string): Promise<HrApplication[]> {
    return hrRepository.getApplications(tenantId);
  }

  public async createApplication(tenantId: string, userId: string, requisitionId: string, candidateId: string): Promise<HrApplication> {
    const app: HrApplication = {
      id: generateUuidV7(),
      tenantId,
      jobRequisitionId: requisitionId,
      candidateId,
      status: 'APPLIED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = await hrRepository.saveApplication(app);
    this.logAudit(tenantId, userId, 'APPLICATION_CREATE', 'hr_applications', saved.id, saved);
    return saved;
  }

  public async hireCandidate(tenantId: string, userId: string, candidateId: string, departmentId: string, designationId: string): Promise<{ candidate: HrCandidate; employee: HrEmployee }> {
    const candidates = await hrRepository.getCandidates(tenantId);
    const cand = candidates.find(c => c.id === candidateId);
    if (!cand) throw new Error(`Candidate ${candidateId} not found.`);

    cand.status = 'HIRED';
    cand.updatedAt = new Date().toISOString();
    await hrRepository.saveCandidate(cand);

    // Create Employee record without duplicate
    const emp = await this.createEmployee(tenantId, userId, {
      firstName: cand.firstName,
      lastName: cand.lastName,
      email: cand.email,
      phone: cand.phone,
      departmentId,
      designationId,
      employmentType: 'FULL_TIME',
      employmentStatus: 'ACTIVE'
    });

    this.logAudit(tenantId, userId, 'CANDIDATE_HIRED', 'hr_candidates', cand.id, { candidate: cand, employee: emp });
    return { candidate: cand, employee: emp };
  }

  // ==========================================
  // ONBOARDING, OFFBOARDING & FINAL SETTLEMENT
  // ==========================================
  public async getOnboardings(tenantId: string, employeeId?: string): Promise<HrOnboarding[]> {
    return hrRepository.getOnboardings(tenantId, employeeId);
  }

  public async createOnboardingTask(tenantId: string, userId: string, data: Partial<HrOnboarding>): Promise<HrOnboarding> {
    const onb: HrOnboarding = {
      id: generateUuidV7(),
      tenantId,
      employeeId: data.employeeId || '',
      taskName: data.taskName || 'Submit Tax & Identity Documents',
      category: data.category || 'Documentation',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = await hrRepository.saveOnboarding(onb);
    this.logAudit(tenantId, userId, 'ONBOARDING_TASK_CREATE', 'hr_onboarding', saved.id, saved);
    return saved;
  }

  public async getOffboardings(tenantId: string, employeeId?: string): Promise<HrOffboarding[]> {
    return hrRepository.getOffboardings(tenantId, employeeId);
  }

  public async initiateOffboarding(tenantId: string, userId: string, data: Partial<HrOffboarding>): Promise<HrOffboarding> {
    const offb: HrOffboarding = {
      id: generateUuidV7(),
      tenantId,
      employeeId: data.employeeId || '',
      resignationDate: data.resignationDate || new Date().toISOString().split('T')[0],
      noticePeriodDays: data.noticePeriodDays || 30,
      lastWorkingDate: data.lastWorkingDate || new Date().toISOString().split('T')[0],
      reason: data.reason || 'Personal reasons',
      status: 'IN_PROGRESS',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = await hrRepository.saveOffboarding(offb);
    this.logAudit(tenantId, userId, 'OFFBOARDING_INITIATE', 'hr_offboarding', saved.id, saved);
    return saved;
  }

  public async calculateFinalSettlement(tenantId: string, userId: string, employeeId: string): Promise<HrFinalSettlement> {
    const pendingSalary = 2500;
    const leaveSettlement = 500;
    const advanceRecovery = 200;
    const loanRecovery = 300;
    const reimbursements = 150;
    const otherDeductions = 0;

    const netPayable = (pendingSalary + leaveSettlement + reimbursements) - (advanceRecovery + loanRecovery + otherDeductions);

    const settlement: HrFinalSettlement = {
      id: generateUuidV7(),
      tenantId,
      employeeId,
      pendingSalary,
      leaveSettlement,
      advanceRecovery,
      loanRecovery,
      reimbursements,
      otherDeductions,
      netPayable,
      status: 'APPROVED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = await hrRepository.saveFinalSettlement(settlement);
    this.logAudit(tenantId, userId, 'FINAL_SETTLEMENT_CALCULATE', 'hr_final_settlements', saved.id, saved);
    return saved;
  }

  // ==========================================
  // HR REPORTS
  // ==========================================
  public async getHrReports(tenantId: string, filters: any = {}) {
    const employees = await hrRepository.getEmployees(tenantId);
    const attendance = await hrRepository.getAttendance(tenantId);
    const leaves = await hrRepository.getLeaveApplications(tenantId);
    const payrollRuns = await hrRepository.getPayrollRuns(tenantId);
    const advances = await hrRepository.getSalaryAdvances(tenantId);
    const loans = await hrRepository.getEmployeeLoans(tenantId);

    return {
      reportType: filters.reportType || 'SUMMARY',
      generatedAt: new Date().toISOString(),
      employeeRegister: employees.map(e => ({ code: e.employeeCode, name: e.displayName, status: e.employmentStatus, dept: e.departmentId })),
      attendanceSummary: { totalRecords: attendance.length, present: attendance.filter(a => a.status === 'PRESENT').length },
      leaveSummary: { totalApplications: leaves.length, approved: leaves.filter(l => l.status === 'APPROVED').length },
      payrollSummary: { totalRuns: payrollRuns.length, totalNetSalaryPaid: payrollRuns.reduce((sum, r) => sum + r.totalNet, 0) },
      financialAssistance: { advanceBalance: advances.reduce((sum, a) => sum + a.remainingBalance, 0), loanBalance: loans.reduce((sum, l) => sum + l.remainingBalance, 0) }
    };
  }
}

export const hrService = new HrService();
