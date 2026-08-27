import { isPostgresEnabled } from '../db/postgresPool.js';
import { HrmsRepository } from '../repositories/hrmsRepository.js';
import { AttendanceStatus, LeaveType } from '../db/hrms/hrmsTypes.js';
import { ErpServiceError, isUniqueViolation } from './erpErrors.js';

export { ErpServiceError };

export class HrmsService {
  private repo = new HrmsRepository();

  private ensurePostgres(): void {
    if (!isPostgresEnabled()) {
      throw new ErpServiceError('HRMS_POSTGRES_REQUIRED', 'HRMS APIs require PostgreSQL (DATABASE_URL).', 503);
    }
  }

  async createPayStructure(tenantId: string, input: Parameters<HrmsRepository['createPayStructure']>[1]) {
    this.ensurePostgres();
    try {
      return await this.repo.createPayStructure(tenantId, input);
    } catch (error) {
      if (isUniqueViolation(error)) throw new ErpServiceError('DUPLICATE_PAY_STRUCTURE', 'Pay structure code already exists.', 409);
      throw error;
    }
  }

  listPayStructures(tenantId: string) {
    this.ensurePostgres();
    return this.repo.listPayStructures(tenantId);
  }

  async createEmployee(tenantId: string, input: Parameters<HrmsRepository['createEmployee']>[1]) {
    this.ensurePostgres();
    try {
      return await this.repo.createEmployee(tenantId, input);
    } catch (error) {
      if (isUniqueViolation(error)) throw new ErpServiceError('DUPLICATE_EMPLOYEE_CODE', 'Employee code already exists.', 409);
      throw error;
    }
  }

  async getEmployee(tenantId: string, employeeId: string) {
    this.ensurePostgres();
    const employee = await this.repo.getEmployee(tenantId, employeeId);
    if (!employee) throw new ErpServiceError('NOT_FOUND', 'Employee not found.', 404);
    return employee;
  }

  listEmployees(tenantId: string, filters: Parameters<HrmsRepository['listEmployees']>[1]) {
    this.ensurePostgres();
    return this.repo.listEmployees(tenantId, filters);
  }

  updateEmployee(tenantId: string, employeeId: string, input: Parameters<HrmsRepository['updateEmployee']>[2]) {
    this.ensurePostgres();
    return this.repo.updateEmployee(tenantId, employeeId, input);
  }

  async archiveEmployee(tenantId: string, employeeId: string) {
    this.ensurePostgres();
    const archived = await this.repo.archiveEmployee(tenantId, employeeId);
    if (!archived) throw new ErpServiceError('NOT_FOUND', 'Employee not found.', 404);
  }

  createAttendance(tenantId: string, input: Parameters<HrmsRepository['createAttendance']>[1]) {
    this.ensurePostgres();
    return this.repo.createAttendance(tenantId, input);
  }

  listAttendance(tenantId: string, employeeId?: string) {
    this.ensurePostgres();
    return this.repo.listAttendance(tenantId, employeeId);
  }

  createLeave(tenantId: string, input: Parameters<HrmsRepository['createLeave']>[1]) {
    this.ensurePostgres();
    return this.repo.createLeave(tenantId, input);
  }

  listLeaves(tenantId: string, employeeId?: string) {
    this.ensurePostgres();
    return this.repo.listLeaves(tenantId, employeeId);
  }

  async getLeave(tenantId: string, leaveId: string) {
    this.ensurePostgres();
    const leave = await this.repo.getLeave(tenantId, leaveId);
    if (!leave) throw new ErpServiceError('NOT_FOUND', 'Leave request not found.', 404);
    return leave;
  }

  transitionLeave(tenantId: string, leaveId: string, next: 'APPROVED' | 'REJECTED' | 'CANCELLED', actorUserId?: string) {
    this.ensurePostgres();
    return this.repo.transitionLeave(tenantId, leaveId, next, actorUserId);
  }

  createPayroll(tenantId: string, input: Parameters<HrmsRepository['createPayroll']>[1]) {
    this.ensurePostgres();
    return this.repo.createPayroll(tenantId, input);
  }

  listPayroll(tenantId: string, employeeId?: string) {
    this.ensurePostgres();
    return this.repo.listPayroll(tenantId, employeeId);
  }

  async getPayroll(tenantId: string, payrollId: string) {
    this.ensurePostgres();
    const payroll = await this.repo.getPayroll(tenantId, payrollId);
    if (!payroll) throw new ErpServiceError('NOT_FOUND', 'Payroll run not found.', 404);
    return payroll;
  }

  employeeSummaryReport(tenantId: string, filters?: Parameters<HrmsRepository['employeeSummaryReport']>[1]) {
    this.ensurePostgres();
    return this.repo.employeeSummaryReport(tenantId, filters);
  }

  departmentReport(tenantId: string) {
    this.ensurePostgres();
    return this.repo.departmentReport(tenantId);
  }

  attendanceSummaryReport(tenantId: string, filters?: Parameters<HrmsRepository['attendanceSummaryReport']>[1]) {
    this.ensurePostgres();
    return this.repo.attendanceSummaryReport(tenantId, filters);
  }

  leaveSummaryReport(tenantId: string, filters?: Parameters<HrmsRepository['leaveSummaryReport']>[1]) {
    this.ensurePostgres();
    return this.repo.leaveSummaryReport(tenantId, filters);
  }

  payrollSummaryReport(tenantId: string, filters?: Parameters<HrmsRepository['payrollSummaryReport']>[1]) {
    this.ensurePostgres();
    return this.repo.payrollSummaryReport(tenantId, filters);
  }

  payStructureSummaryReport(tenantId: string) {
    this.ensurePostgres();
    return this.repo.payStructureSummaryReport(tenantId);
  }
}

export type { AttendanceStatus, LeaveType };
