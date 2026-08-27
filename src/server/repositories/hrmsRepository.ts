import pg from 'pg';
import { generateUuidV7 } from '../db/database.js';
import { withTenantTransaction } from '../db/tenantContext.js';
import {
  AttendanceStatus,
  HrmsAttendanceRecord,
  HrmsEmployeeRecord,
  HrmsLeaveRecord,
  HrmsPayStructureRecord,
  HrmsPayrollRecord,
  LeaveStatus,
  LeaveType,
  calculatePayrollAmounts,
  daysInclusive
} from '../db/hrms/hrmsTypes.js';
import { ErpServiceError, isUniqueViolation } from '../services/erpErrors.js';

function isoDate(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  const raw = String(value);
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
    return raw.slice(0, 10);
  }
  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }
  return raw.slice(0, 10);
}

function iso(value: unknown): string | undefined {
  return value ? new Date(String(value)).toISOString() : undefined;
}

export class HrmsRepository {
  async createPayStructure(tenantId: string, input: {
    code: string;
    name: string;
    basicSalary: number;
    allowanceAmount?: number;
    pfPercent?: number;
    otherDeductionAmount?: number;
    overtimeRatePerHour?: number;
  }): Promise<HrmsPayStructureRecord> {
    const id = generateUuidV7();
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `INSERT INTO hrms_pay_structures (
          id, tenant_id, code, name, basic_salary, allowance_amount, pf_percent, other_deduction_amount, overtime_rate_per_hour
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING *`,
        [
          id,
          tenantId,
          input.code.trim().toUpperCase(),
          input.name.trim(),
          input.basicSalary,
          input.allowanceAmount || 0,
          input.pfPercent || 0,
          input.otherDeductionAmount || 0,
          input.overtimeRatePerHour || 0
        ]
      );
      return this.mapPayStructure(result.rows[0]);
    });
  }

  async getPayStructure(tenantId: string, id: string): Promise<HrmsPayStructureRecord | null> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `SELECT * FROM hrms_pay_structures WHERE tenant_id = $1 AND id = $2 LIMIT 1`,
        [tenantId, id]
      );
      return result.rows[0] ? this.mapPayStructure(result.rows[0]) : null;
    });
  }

  async listPayStructures(tenantId: string): Promise<HrmsPayStructureRecord[]> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `SELECT * FROM hrms_pay_structures WHERE tenant_id = $1 AND status = 'ACTIVE' ORDER BY code`,
        [tenantId]
      );
      return result.rows.map((row) => this.mapPayStructure(row));
    });
  }

  async createEmployee(tenantId: string, input: {
    code: string;
    fullName: string;
    phone?: string;
    email?: string;
    address?: string;
    joiningDate: string;
    department: string;
    designation: string;
    employmentStatus?: string;
    branchId?: string;
    payStructureId?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    createdBy?: string;
  }): Promise<HrmsEmployeeRecord> {
    const id = generateUuidV7();
    return withTenantTransaction(tenantId, async (client) => {
      if (input.payStructureId) {
        const structure = await client.query(
          `SELECT id FROM hrms_pay_structures WHERE tenant_id = $1 AND id = $2 LIMIT 1`,
          [tenantId, input.payStructureId]
        );
        if (!structure.rows[0]) throw new ErpServiceError('NOT_FOUND', 'Pay structure not found.', 404);
      }
      const result = await client.query(
        `INSERT INTO hrms_employees (
          id, tenant_id, code, full_name, phone, email, address, joining_date, department, designation,
          employment_status, branch_id, pay_structure_id, emergency_contact_name, emergency_contact_phone, created_by
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
        RETURNING *`,
        [
          id,
          tenantId,
          input.code.trim().toUpperCase(),
          input.fullName.trim(),
          input.phone || null,
          input.email || null,
          input.address || null,
          input.joiningDate,
          input.department.trim(),
          input.designation.trim(),
          input.employmentStatus || 'ACTIVE',
          input.branchId || null,
          input.payStructureId || null,
          input.emergencyContactName || null,
          input.emergencyContactPhone || null,
          input.createdBy || null
        ]
      );
      return this.mapEmployee(result.rows[0]);
    });
  }

  async getEmployee(tenantId: string, employeeId: string): Promise<HrmsEmployeeRecord | null> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `SELECT * FROM hrms_employees WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL LIMIT 1`,
        [tenantId, employeeId]
      );
      return result.rows[0] ? this.mapEmployee(result.rows[0]) : null;
    });
  }

  async listEmployees(tenantId: string, filters: {
    search?: string;
    department?: string;
    employmentStatus?: string;
    limit?: number;
    offset?: number;
  }): Promise<HrmsEmployeeRecord[]> {
    return withTenantTransaction(tenantId, async (client) => {
      const conditions = ['tenant_id = $1', 'deleted_at IS NULL'];
      const values: unknown[] = [tenantId];
      if (filters.employmentStatus) {
        values.push(filters.employmentStatus);
        conditions.push(`employment_status = $${values.length}`);
      }
      if (filters.department) {
        values.push(filters.department);
        conditions.push(`department = $${values.length}`);
      }
      if (filters.search) {
        values.push(`%${filters.search}%`);
        conditions.push(`(code ILIKE $${values.length} OR full_name ILIKE $${values.length} OR designation ILIKE $${values.length})`);
      }
      const limit = Math.min(Math.max(filters.limit || 100, 1), 200);
      const offset = Math.max(filters.offset || 0, 0);
      values.push(limit, offset);
      const result = await client.query(
        `SELECT * FROM hrms_employees
         WHERE ${conditions.join(' AND ')}
         ORDER BY code
         LIMIT $${values.length - 1} OFFSET $${values.length}`,
        values
      );
      return result.rows.map((row) => this.mapEmployee(row));
    });
  }

  async updateEmployee(tenantId: string, employeeId: string, input: Partial<{
    fullName: string;
    phone: string;
    email: string;
    address: string;
    department: string;
    designation: string;
    employmentStatus: string;
    branchId: string;
    payStructureId: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
  }>): Promise<HrmsEmployeeRecord> {
    return withTenantTransaction(tenantId, async (client) => {
      const existing = await client.query(
        `SELECT id FROM hrms_employees WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL FOR UPDATE`,
        [tenantId, employeeId]
      );
      if (!existing.rows[0]) throw new ErpServiceError('NOT_FOUND', 'Employee not found.', 404);
      if (input.payStructureId) {
        const structure = await client.query(
          `SELECT id FROM hrms_pay_structures WHERE tenant_id = $1 AND id = $2 LIMIT 1`,
          [tenantId, input.payStructureId]
        );
        if (!structure.rows[0]) throw new ErpServiceError('NOT_FOUND', 'Pay structure not found.', 404);
      }
      const result = await client.query(
        `UPDATE hrms_employees SET
          full_name = COALESCE($3, full_name),
          phone = COALESCE($4, phone),
          email = COALESCE($5, email),
          address = COALESCE($6, address),
          department = COALESCE($7, department),
          designation = COALESCE($8, designation),
          employment_status = COALESCE($9, employment_status),
          branch_id = COALESCE($10, branch_id),
          pay_structure_id = COALESCE($11, pay_structure_id),
          emergency_contact_name = COALESCE($12, emergency_contact_name),
          emergency_contact_phone = COALESCE($13, emergency_contact_phone),
          updated_at = NOW()
         WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL
         RETURNING *`,
        [
          tenantId,
          employeeId,
          input.fullName || null,
          input.phone || null,
          input.email || null,
          input.address || null,
          input.department || null,
          input.designation || null,
          input.employmentStatus || null,
          input.branchId || null,
          input.payStructureId || null,
          input.emergencyContactName || null,
          input.emergencyContactPhone || null
        ]
      );
      return this.mapEmployee(result.rows[0]);
    });
  }

  async archiveEmployee(tenantId: string, employeeId: string): Promise<boolean> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `UPDATE hrms_employees
         SET deleted_at = NOW(), employment_status = 'ARCHIVED', updated_at = NOW()
         WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL`,
        [tenantId, employeeId]
      );
      return (result.rowCount ?? 0) > 0;
    });
  }

  async createAttendance(tenantId: string, input: {
    employeeId: string;
    workDate: string;
    checkIn?: string;
    checkOut?: string;
    status: AttendanceStatus;
    overtimeHours?: number;
    remarks?: string;
    branchId?: string;
    createdBy?: string;
  }): Promise<HrmsAttendanceRecord> {
    const id = generateUuidV7();
    return withTenantTransaction(tenantId, async (client) => {
      const employee = await client.query(
        `SELECT id FROM hrms_employees WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL LIMIT 1`,
        [tenantId, input.employeeId]
      );
      if (!employee.rows[0]) throw new ErpServiceError('NOT_FOUND', 'Employee not found.', 404);

      let leaveRequestId: string | null = null;
      if (input.status === 'LEAVE') {
        const leave = await client.query(
          `SELECT id FROM hrms_leave_requests
           WHERE tenant_id = $1 AND employee_id = $2 AND status = 'APPROVED'
             AND start_date <= $3::date AND end_date >= $3::date
           LIMIT 1`,
          [tenantId, input.employeeId, input.workDate]
        );
        if (!leave.rows[0]) {
          throw new ErpServiceError('LEAVE_NOT_APPROVED', 'LEAVE attendance requires an approved leave covering this date.');
        }
        leaveRequestId = String(leave.rows[0].id);
      }

      const hours = this.computeHours(input.checkIn, input.checkOut, input.overtimeHours);
      try {
        const result = await client.query(
          `INSERT INTO hrms_attendance (
            id, tenant_id, employee_id, work_date, check_in, check_out, status, working_hours, overtime_hours, remarks, branch_id, leave_request_id, created_by
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
          RETURNING *`,
          [
            id,
            tenantId,
            input.employeeId,
            input.workDate,
            input.checkIn || null,
            input.checkOut || null,
            input.status,
            hours.workingHours,
            hours.overtimeHours,
            input.remarks || null,
            input.branchId || null,
            leaveRequestId,
            input.createdBy || null
          ]
        );
        return this.mapAttendance(result.rows[0]);
      } catch (error) {
        if (isUniqueViolation(error)) {
          throw new ErpServiceError('DUPLICATE_ATTENDANCE', 'Attendance already exists for this employee and date.', 409);
        }
        throw error;
      }
    });
  }

  async listAttendance(tenantId: string, employeeId?: string): Promise<HrmsAttendanceRecord[]> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = employeeId
        ? await client.query(
            `SELECT * FROM hrms_attendance WHERE tenant_id = $1 AND employee_id = $2 ORDER BY work_date DESC`,
            [tenantId, employeeId]
          )
        : await client.query(
            `SELECT * FROM hrms_attendance WHERE tenant_id = $1 ORDER BY work_date DESC LIMIT 200`,
            [tenantId]
          );
      return result.rows.map((row) => this.mapAttendance(row));
    });
  }

  async createLeave(tenantId: string, input: {
    employeeId: string;
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    reason?: string;
    createdBy?: string;
  }): Promise<HrmsLeaveRecord> {
    const id = generateUuidV7();
    return withTenantTransaction(tenantId, async (client) => {
      const employee = await client.query(
        `SELECT id FROM hrms_employees WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL LIMIT 1`,
        [tenantId, input.employeeId]
      );
      if (!employee.rows[0]) throw new ErpServiceError('NOT_FOUND', 'Employee not found.', 404);
      const overlap = await client.query(
        `SELECT id FROM hrms_leave_requests
         WHERE tenant_id = $1 AND employee_id = $2 AND status IN ('REQUESTED', 'APPROVED')
           AND start_date <= $4::date AND end_date >= $3::date
         LIMIT 1`,
        [tenantId, input.employeeId, input.startDate, input.endDate]
      );
      if (overlap.rows[0]) {
        throw new ErpServiceError('LEAVE_OVERLAP', 'An overlapping leave request already exists.', 409);
      }
      const result = await client.query(
        `INSERT INTO hrms_leave_requests (
          id, tenant_id, employee_id, leave_type, start_date, end_date, reason, created_by
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING *`,
        [id, tenantId, input.employeeId, input.leaveType, input.startDate, input.endDate, input.reason || null, input.createdBy || null]
      );
      return this.mapLeave(result.rows[0]);
    });
  }

  async transitionLeave(tenantId: string, leaveId: string, nextStatus: 'APPROVED' | 'REJECTED' | 'CANCELLED', actorUserId?: string): Promise<HrmsLeaveRecord> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `SELECT * FROM hrms_leave_requests WHERE tenant_id = $1 AND id = $2 FOR UPDATE`,
        [tenantId, leaveId]
      );
      if (!result.rows[0]) throw new ErpServiceError('NOT_FOUND', 'Leave request not found.', 404);
      const current = String(result.rows[0].status);
      const allowed: Record<string, string[]> = {
        REQUESTED: ['APPROVED', 'REJECTED', 'CANCELLED'],
        APPROVED: ['CANCELLED']
      };
      if (!allowed[current]?.includes(nextStatus)) {
        throw new ErpServiceError('INVALID_STATUS_TRANSITION', `Cannot transition leave from ${current} to ${nextStatus}.`);
      }

      if (nextStatus === 'APPROVED') {
        await client.query(
          `UPDATE hrms_leave_requests
           SET status = 'APPROVED', approved_by = $3, approved_at = NOW(), updated_at = NOW()
           WHERE tenant_id = $1 AND id = $2`,
          [tenantId, leaveId, actorUserId || null]
        );
        await this.seedLeaveAttendance(client, tenantId, result.rows[0], leaveId, actorUserId);
      } else if (nextStatus === 'REJECTED') {
        await client.query(
          `UPDATE hrms_leave_requests
           SET status = 'REJECTED', rejected_by = $3, rejected_at = NOW(), updated_at = NOW()
           WHERE tenant_id = $1 AND id = $2`,
          [tenantId, leaveId, actorUserId || null]
        );
      } else {
        await client.query(
          `UPDATE hrms_leave_requests SET status = 'CANCELLED', updated_at = NOW() WHERE tenant_id = $1 AND id = $2`,
          [tenantId, leaveId]
        );
      }

      const updated = await client.query(
        `SELECT * FROM hrms_leave_requests WHERE tenant_id = $1 AND id = $2`,
        [tenantId, leaveId]
      );
      return this.mapLeave(updated.rows[0]);
    });
  }

  async listLeaves(tenantId: string, employeeId?: string): Promise<HrmsLeaveRecord[]> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = employeeId
        ? await client.query(
            `SELECT * FROM hrms_leave_requests WHERE tenant_id = $1 AND employee_id = $2 ORDER BY start_date DESC`,
            [tenantId, employeeId]
          )
        : await client.query(
            `SELECT * FROM hrms_leave_requests WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 200`,
            [tenantId]
          );
      return result.rows.map((row) => this.mapLeave(row));
    });
  }

  async getLeave(tenantId: string, leaveId: string): Promise<HrmsLeaveRecord | null> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `SELECT * FROM hrms_leave_requests WHERE tenant_id = $1 AND id = $2 LIMIT 1`,
        [tenantId, leaveId]
      );
      return result.rows[0] ? this.mapLeave(result.rows[0]) : null;
    });
  }

  async createPayroll(tenantId: string, input: {
    employeeId: string;
    periodYear: number;
    periodMonth: number;
    createdBy?: string;
  }): Promise<HrmsPayrollRecord> {
    const id = generateUuidV7();
    return withTenantTransaction(tenantId, async (client) => {
      const employee = await client.query(
        `SELECT * FROM hrms_employees WHERE tenant_id = $1 AND id = $2 AND deleted_at IS NULL FOR UPDATE`,
        [tenantId, input.employeeId]
      );
      if (!employee.rows[0]) throw new ErpServiceError('NOT_FOUND', 'Employee not found.', 404);
      const payStructureId = employee.rows[0].pay_structure_id;
      if (!payStructureId) {
        throw new ErpServiceError('PAY_STRUCTURE_REQUIRED', 'Employee has no configured pay structure.');
      }
      const structureRes = await client.query(
        `SELECT * FROM hrms_pay_structures WHERE tenant_id = $1 AND id = $2 LIMIT 1`,
        [tenantId, payStructureId]
      );
      if (!structureRes.rows[0]) throw new ErpServiceError('NOT_FOUND', 'Pay structure not found.', 404);
      const structure = this.mapPayStructure(structureRes.rows[0]);

      const start = `${input.periodYear}-${String(input.periodMonth).padStart(2, '0')}-01`;
      const endDate = new Date(Date.UTC(input.periodYear, input.periodMonth, 0));
      const end = endDate.toISOString().slice(0, 10);

      const attendance = await client.query(
        `SELECT status, overtime_hours FROM hrms_attendance
         WHERE tenant_id = $1 AND employee_id = $2 AND work_date >= $3::date AND work_date <= $4::date`,
        [tenantId, input.employeeId, start, end]
      );

      let presentDays = 0;
      let leaveDays = 0;
      let absentDays = 0;
      let overtimeHours = 0;
      for (const row of attendance.rows) {
        const status = String(row.status);
        overtimeHours += Number(row.overtime_hours || 0);
        if (status === 'PRESENT') presentDays += 1;
        else if (status === 'HALF_DAY') presentDays += 0.5;
        else if (status === 'LEAVE') leaveDays += 1;
        else if (status === 'ABSENT') absentDays += 1;
      }

      const lop = await client.query(
        `SELECT start_date, end_date FROM hrms_leave_requests
         WHERE tenant_id = $1 AND employee_id = $2 AND status = 'APPROVED' AND leave_type = 'LOP'
           AND start_date <= $4::date AND end_date >= $3::date`,
        [tenantId, input.employeeId, start, end]
      );
      let lopDays = 0;
      for (const row of lop.rows) {
        const overlapStart = isoDate(row.start_date) > start ? isoDate(row.start_date) : start;
        const overlapEnd = isoDate(row.end_date) < end ? isoDate(row.end_date) : end;
        lopDays += daysInclusive(overlapStart, overlapEnd);
      }

      const paidLeaveDays = Math.max(leaveDays - lopDays, 0);
      const payableDays = presentDays + paidLeaveDays;

      let amounts: ReturnType<typeof calculatePayrollAmounts>;
      try {
        amounts = calculatePayrollAmounts({
          basicSalary: structure.basicSalary,
          allowanceAmount: structure.allowanceAmount,
          pfPercent: structure.pfPercent,
          otherDeductionAmount: structure.otherDeductionAmount,
          overtimeHours,
          overtimeRatePerHour: structure.overtimeRatePerHour,
          payableDays
        });
      } catch (error) {
        throw new ErpServiceError(
          'PAYROLL_CALCULATION_FAILED',
          error instanceof Error ? error.message : 'Payroll calculation failed.',
          400
        );
      }

      try {
        const result = await client.query(
          `INSERT INTO hrms_payroll_runs (
            id, tenant_id, employee_id, pay_structure_id, period_year, period_month,
            present_days, leave_days, absent_days, payable_days, overtime_hours,
            basic_salary, allowances, overtime_amount, deductions, gross_amount, net_amount, created_by
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
          RETURNING *`,
          [
            id,
            tenantId,
            input.employeeId,
            structure.id,
            input.periodYear,
            input.periodMonth,
            presentDays,
            leaveDays,
            absentDays,
            payableDays,
            overtimeHours,
            structure.basicSalary,
            structure.allowanceAmount,
            amounts.overtimeAmount,
            amounts.deductions,
            amounts.grossAmount,
            amounts.netAmount,
            input.createdBy || null
          ]
        );
        return this.mapPayroll(result.rows[0]);
      } catch (error) {
        if (isUniqueViolation(error)) {
          throw new ErpServiceError('DUPLICATE_PAYROLL_PERIOD', 'Payroll already exists for this employee and period.', 409);
        }
        throw error;
      }
    });
  }

  async listPayroll(tenantId: string, employeeId?: string): Promise<HrmsPayrollRecord[]> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = employeeId
        ? await client.query(
            `SELECT * FROM hrms_payroll_runs WHERE tenant_id = $1 AND employee_id = $2 ORDER BY period_year DESC, period_month DESC`,
            [tenantId, employeeId]
          )
        : await client.query(
            `SELECT * FROM hrms_payroll_runs WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 200`,
            [tenantId]
          );
      return result.rows.map((row) => this.mapPayroll(row));
    });
  }

  async getPayroll(tenantId: string, payrollId: string): Promise<HrmsPayrollRecord | null> {
    return withTenantTransaction(tenantId, async (client) => {
      const result = await client.query(
        `SELECT * FROM hrms_payroll_runs WHERE tenant_id = $1 AND id = $2 LIMIT 1`,
        [tenantId, payrollId]
      );
      return result.rows[0] ? this.mapPayroll(result.rows[0]) : null;
    });
  }

  private async seedLeaveAttendance(
    client: pg.PoolClient,
    tenantId: string,
    leaveRow: Record<string, unknown>,
    leaveId: string,
    actorUserId?: string
  ): Promise<void> {
    const start = isoDate(leaveRow.start_date);
    const end = isoDate(leaveRow.end_date);
    const employeeId = String(leaveRow.employee_id);
    const cursor = new Date(`${start}T00:00:00Z`);
    const last = new Date(`${end}T00:00:00Z`);
    while (cursor <= last) {
      const workDate = cursor.toISOString().slice(0, 10);
      const existing = await client.query(
        `SELECT id, status FROM hrms_attendance WHERE tenant_id = $1 AND employee_id = $2 AND work_date = $3::date`,
        [tenantId, employeeId, workDate]
      );
      if (!existing.rows[0]) {
        await client.query(
          `INSERT INTO hrms_attendance (
            id, tenant_id, employee_id, work_date, status, working_hours, overtime_hours, leave_request_id, created_by
          ) VALUES ($1,$2,$3,$4,'LEAVE',0,0,$5,$6)`,
          [generateUuidV7(), tenantId, employeeId, workDate, leaveId, actorUserId || null]
        );
      } else if (String(existing.rows[0].status) !== 'PRESENT') {
        await client.query(
          `UPDATE hrms_attendance SET status = 'LEAVE', leave_request_id = $4, updated_at = NOW()
           WHERE tenant_id = $1 AND employee_id = $2 AND work_date = $3::date`,
          [tenantId, employeeId, workDate, leaveId]
        );
      }
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
  }

  private computeHours(checkIn?: string, checkOut?: string, overtimeHours?: number): { workingHours: number; overtimeHours: number } {
    if (!checkIn || !checkOut) {
      return { workingHours: 0, overtimeHours: overtimeHours || 0 };
    }
    const start = Date.parse(checkIn);
    const end = Date.parse(checkOut);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
      throw new ErpServiceError('BAD_REQUEST', 'checkOut must be after checkIn.');
    }
    const workingHours = Math.round(((end - start) / 3600000) * 100) / 100;
    const overtime = overtimeHours !== undefined ? overtimeHours : Math.max(0, Math.round((workingHours - 8) * 100) / 100);
    return { workingHours, overtimeHours: overtime };
  }

  private mapPayStructure(row: Record<string, unknown>): HrmsPayStructureRecord {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      code: String(row.code),
      name: String(row.name),
      basicSalary: Number(row.basic_salary),
      allowanceAmount: Number(row.allowance_amount),
      pfPercent: Number(row.pf_percent),
      otherDeductionAmount: Number(row.other_deduction_amount),
      overtimeRatePerHour: Number(row.overtime_rate_per_hour),
      status: String(row.status)
    };
  }

  private mapEmployee(row: Record<string, unknown>): HrmsEmployeeRecord {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      code: String(row.code),
      fullName: String(row.full_name),
      phone: row.phone ? String(row.phone) : undefined,
      email: row.email ? String(row.email) : undefined,
      address: row.address ? String(row.address) : undefined,
      joiningDate: isoDate(row.joining_date),
      department: String(row.department),
      designation: String(row.designation),
      employmentStatus: String(row.employment_status) as HrmsEmployeeRecord['employmentStatus'],
      branchId: row.branch_id ? String(row.branch_id) : undefined,
      payStructureId: row.pay_structure_id ? String(row.pay_structure_id) : undefined,
      emergencyContactName: row.emergency_contact_name ? String(row.emergency_contact_name) : undefined,
      emergencyContactPhone: row.emergency_contact_phone ? String(row.emergency_contact_phone) : undefined,
      createdAt: iso(row.created_at) || '',
      updatedAt: iso(row.updated_at) || ''
    };
  }

  private mapAttendance(row: Record<string, unknown>): HrmsAttendanceRecord {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      employeeId: String(row.employee_id),
      workDate: isoDate(row.work_date),
      checkIn: iso(row.check_in),
      checkOut: iso(row.check_out),
      status: String(row.status) as AttendanceStatus,
      workingHours: Number(row.working_hours),
      overtimeHours: Number(row.overtime_hours),
      remarks: row.remarks ? String(row.remarks) : undefined,
      branchId: row.branch_id ? String(row.branch_id) : undefined,
      leaveRequestId: row.leave_request_id ? String(row.leave_request_id) : undefined
    };
  }

  private mapLeave(row: Record<string, unknown>): HrmsLeaveRecord {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      employeeId: String(row.employee_id),
      leaveType: String(row.leave_type) as LeaveType,
      startDate: isoDate(row.start_date),
      endDate: isoDate(row.end_date),
      reason: row.reason ? String(row.reason) : undefined,
      status: String(row.status) as LeaveStatus,
      approvedBy: row.approved_by ? String(row.approved_by) : undefined,
      approvedAt: iso(row.approved_at),
      rejectedBy: row.rejected_by ? String(row.rejected_by) : undefined,
      rejectedAt: iso(row.rejected_at)
    };
  }

  private mapPayroll(row: Record<string, unknown>): HrmsPayrollRecord {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      employeeId: String(row.employee_id),
      payStructureId: String(row.pay_structure_id),
      periodYear: Number(row.period_year),
      periodMonth: Number(row.period_month),
      presentDays: Number(row.present_days),
      leaveDays: Number(row.leave_days),
      absentDays: Number(row.absent_days),
      payableDays: Number(row.payable_days),
      overtimeHours: Number(row.overtime_hours),
      basicSalary: Number(row.basic_salary),
      allowances: Number(row.allowances),
      overtimeAmount: Number(row.overtime_amount),
      deductions: Number(row.deductions),
      grossAmount: Number(row.gross_amount),
      netAmount: Number(row.net_amount),
      status: String(row.status) as HrmsPayrollRecord['status']
    };
  }
}
