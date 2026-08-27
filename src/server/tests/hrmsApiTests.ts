import request from 'supertest';
import { isPostgresEnabled } from '../db/postgresPool.js';
import { calculatePayrollAmounts } from '../db/hrms/hrmsTypes.js';
import { createErpTestApp, loginErpAdmin, loginOtherTenant, loginQuarryManager, uniqueCode } from './erpTestHarness.js';
import { ModuleTestResult } from './erpProductionApiTests.js';

export async function runHrmsApiTests() {
  const executedAt = new Date().toISOString();
  if (!isPostgresEnabled()) {
    return { skipped: true, skipReason: 'DATABASE_URL is not configured', executedAt, totalTests: 0, passedCount: 0, failedCount: 0, results: [] as ModuleTestResult[] };
  }

  const app = await createErpTestApp();
  const ctx = await loginErpAdmin(app);
  const other = await loginOtherTenant(app);
  const manager = await loginQuarryManager(app);
  const results: ModuleTestResult[] = [];

  const unauthorized = await request(app).get('/api/v1/hrms/employees');
  results.push({
    testName: 'GET employees requires authentication',
    passed: unauthorized.status === 401,
    message: `status=${unauthorized.status}`
  });

  const invalidCreate = await request(app).post('/api/v1/hrms/employees').set(ctx.header).send({ code: 'x', fullName: 'A' });
  results.push({
    testName: 'POST employee rejects invalid payload',
    passed: invalidCreate.status === 400,
    message: `status=${invalidCreate.status}`
  });

  const clientTenant = await request(app).post('/api/v1/hrms/employees').set(ctx.header).send({
    code: uniqueCode('EMPT'),
    fullName: 'Illegal Tenant Body',
    joiningDate: '2026-01-15',
    department: 'Mining',
    designation: 'Operator',
    tenantId: 'tenant-apex-quarry-002'
  });
  results.push({
    testName: 'POST employee rejects client-supplied tenantId',
    passed: clientTenant.status === 400,
    message: `status=${clientTenant.status}`
  });

  const otherList = await request(app).get('/api/v1/hrms/employees').set(other.header);
  results.push({
    testName: 'Other tenant is denied employee view (RBAC + isolation)',
    passed: otherList.status === 403,
    message: `status=${otherList.status}`
  });

  const pay = await request(app).post('/api/v1/hrms/pay-structures').set(ctx.header).send({
    code: uniqueCode('PAY'),
    name: 'Quarry Operator Grade A',
    basicSalary: 30000,
    allowanceAmount: 2000,
    pfPercent: 12,
    otherDeductionAmount: 500,
    overtimeRatePerHour: 100
  });
  results.push({
    testName: 'POST pay structure persists configured salary (not hardcoded)',
    passed: pay.status === 201 && pay.body?.data?.basicSalary === 30000 && Boolean(pay.body?.data?.id),
    message: `status=${pay.status} basic=${pay.body?.data?.basicSalary}`
  });

  const employeeCode = uniqueCode('EMP');
  const created = await request(app).post('/api/v1/hrms/employees').set(ctx.header).send({
    code: employeeCode,
    fullName: 'Anita Rao',
    phone: '9876501234',
    email: 'anita.rao@racezoneventures.com',
    address: 'Bantwal Camp',
    joiningDate: '2026-01-15',
    department: 'Mining',
    designation: 'Plant Operator',
    payStructureId: pay.body.data.id,
    emergencyContactName: 'Ravi Rao',
    emergencyContactPhone: '9876509999'
  });
  results.push({
    testName: 'POST employee creates master record',
    passed:
      created.status === 201 &&
      created.body?.data?.code === employeeCode &&
      created.body?.data?.fullName === 'Anita Rao' &&
      created.body?.data?.employmentStatus === 'ACTIVE' &&
      Boolean(created.body?.data?.id) &&
      Boolean(created.body?.data?.createdAt),
    message: `status=${created.status} id=${created.body?.data?.id}`
  });

  const employeeId = created.body?.data?.id as string;

  const retrieved = await request(app).get(`/api/v1/hrms/employees/${employeeId}`).set(ctx.header);
  results.push({
    testName: 'GET employee persists in PostgreSQL',
    passed:
      retrieved.status === 200 &&
      retrieved.body?.data?.id === employeeId &&
      retrieved.body?.data?.email === 'anita.rao@racezoneventures.com' &&
      retrieved.body?.data?.payStructureId === pay.body.data.id,
    message: `status=${retrieved.status}`
  });

  const listed = await request(app).get(`/api/v1/hrms/employees?search=${employeeCode}`).set(ctx.header);
  results.push({
    testName: 'GET employees lists created record',
    passed:
      listed.status === 200 &&
      Array.isArray(listed.body?.data) &&
      listed.body.data.some((row: { id: string }) => row.id === employeeId),
    message: `status=${listed.status} count=${listed.body?.data?.length}`
  });

  const duplicate = await request(app).post('/api/v1/hrms/employees').set(ctx.header).send({
    code: employeeCode,
    fullName: 'Duplicate Operator',
    joiningDate: '2026-02-01',
    department: 'Mining',
    designation: 'Operator'
  });
  results.push({
    testName: 'Duplicate employee code is rejected',
    passed: duplicate.status === 409 && duplicate.body?.error === 'DUPLICATE_EMPLOYEE_CODE',
    message: `status=${duplicate.status} error=${duplicate.body?.error}`
  });

  const otherGet = await request(app).get(`/api/v1/hrms/employees/${employeeId}`).set(other.header);
  results.push({
    testName: 'Tenant isolation blocks employee retrieval',
    passed: otherGet.status === 403,
    message: `status=${otherGet.status}`
  });

  const missingAttendance = await request(app).post('/api/v1/hrms/attendance').set(ctx.header).send({
    employeeId: '00000000-0000-7000-a000-000000000000',
    workDate: '2026-08-03',
    status: 'PRESENT'
  });
  results.push({
    testName: 'Attendance rejects unknown employee',
    passed: missingAttendance.status === 404,
    message: `status=${missingAttendance.status}`
  });

  const att1 = await request(app).post('/api/v1/hrms/attendance').set(ctx.header).send({
    employeeId,
    workDate: '2026-08-03',
    status: 'PRESENT',
    checkIn: '2026-08-03T08:00:00.000Z',
    checkOut: '2026-08-03T17:00:00.000Z',
    overtimeHours: 1
  });
  results.push({
    testName: 'POST attendance creates PRESENT record',
    passed: att1.status === 201 && att1.body?.data?.status === 'PRESENT' && att1.body?.data?.workingHours === 9,
    message: `status=${att1.status} hours=${att1.body?.data?.workingHours}`
  });

  const attDup = await request(app).post('/api/v1/hrms/attendance').set(ctx.header).send({
    employeeId,
    workDate: '2026-08-03',
    status: 'ABSENT'
  });
  results.push({
    testName: 'Duplicate attendance for same employee/date is rejected',
    passed: attDup.status === 409 && attDup.body?.error === 'DUPLICATE_ATTENDANCE',
    message: `status=${attDup.status} error=${attDup.body?.error}`
  });

  const otherAttendance = await request(app).post('/api/v1/hrms/attendance').set(other.header).send({
    employeeId,
    workDate: '2026-08-04',
    status: 'PRESENT'
  });
  results.push({
    testName: 'Attendance RBAC denies other tenant',
    passed: otherAttendance.status === 403,
    message: `status=${otherAttendance.status}`
  });

  const att2 = await request(app).post('/api/v1/hrms/attendance').set(ctx.header).send({
    employeeId,
    workDate: '2026-08-04',
    status: 'PRESENT',
    overtimeHours: 1
  });
  results.push({
    testName: 'Second attendance day is accepted',
    passed: att2.status === 201,
    message: `status=${att2.status}`
  });

  const leave = await request(app).post('/api/v1/hrms/leave-requests').set(ctx.header).send({
    employeeId,
    leaveType: 'CL',
    startDate: '2026-08-10',
    endDate: '2026-08-11',
    reason: 'Family function'
  });
  results.push({
    testName: 'POST leave creates REQUESTED record',
    passed: leave.status === 201 && leave.body?.data?.status === 'REQUESTED',
    message: `status=${leave.status} leaveStatus=${leave.body?.data?.status}`
  });

  const approved = await request(app)
    .post(`/api/v1/hrms/leave-requests/${leave.body.data.id}/approve`)
    .set(ctx.header);
  results.push({
    testName: 'Leave approval transitions REQUESTED to APPROVED',
    passed: approved.status === 200 && approved.body?.data?.status === 'APPROVED' && Boolean(approved.body?.data?.approvedAt),
    message: `status=${approved.status} leaveStatus=${approved.body?.data?.status}`
  });

  const attendanceAfterLeave = await request(app).get(`/api/v1/hrms/attendance?employeeId=${employeeId}`).set(ctx.header);
  const leaveDays = Array.isArray(attendanceAfterLeave.body?.data)
    ? attendanceAfterLeave.body.data.filter((row: { status: string; workDate: string }) => row.status === 'LEAVE' && (row.workDate === '2026-08-10' || row.workDate === '2026-08-11'))
    : [];
  results.push({
    testName: 'Approved leave seeds LEAVE attendance',
    passed: attendanceAfterLeave.status === 200 && leaveDays.length === 2,
    message: `status=${attendanceAfterLeave.status} leaveAttendance=${leaveDays.length}`
  });

  const reApprove = await request(app)
    .post(`/api/v1/hrms/leave-requests/${leave.body.data.id}/approve`)
    .set(ctx.header);
  results.push({
    testName: 'Invalid leave transition is rejected',
    passed: reApprove.status === 400 && reApprove.body?.error === 'INVALID_STATUS_TRANSITION',
    message: `status=${reApprove.status} error=${reApprove.body?.error}`
  });

  const leave2 = await request(app).post('/api/v1/hrms/leave-requests').set(ctx.header).send({
    employeeId,
    leaveType: 'SL',
    startDate: '2026-08-20',
    endDate: '2026-08-20',
    reason: 'Fever'
  });
  const rejected = await request(app)
    .post(`/api/v1/hrms/leave-requests/${leave2.body.data.id}/reject`)
    .set(ctx.header);
  results.push({
    testName: 'Leave rejection transitions REQUESTED to REJECTED',
    passed: rejected.status === 200 && rejected.body?.data?.status === 'REJECTED',
    message: `status=${rejected.status} leaveStatus=${rejected.body?.data?.status}`
  });

  const otherLeave = await request(app).get(`/api/v1/hrms/leave-requests/${leave.body.data.id}`).set(other.header);
  results.push({
    testName: 'Leave tenant isolation returns 403',
    passed: otherLeave.status === 403,
    message: `status=${otherLeave.status}`
  });

  const expected = calculatePayrollAmounts({
    basicSalary: 30000,
    allowanceAmount: 2000,
    pfPercent: 12,
    otherDeductionAmount: 500,
    overtimeHours: 2,
    overtimeRatePerHour: 100,
    payableDays: 2 + 2
  });
  const payroll = await request(app).post('/api/v1/hrms/payroll').set(ctx.header).send({
    employeeId,
    periodYear: 2026,
    periodMonth: 8
  });
  results.push({
    testName: 'Payroll is calculated on the server',
    passed:
      payroll.status === 201 &&
      payroll.body?.data?.grossAmount === expected.grossAmount &&
      payroll.body?.data?.netAmount === expected.netAmount &&
      payroll.body?.data?.deductions === expected.deductions &&
      payroll.body?.data?.payableDays === 4,
    message: `status=${payroll.status} gross=${payroll.body?.data?.grossAmount} net=${payroll.body?.data?.netAmount} payable=${payroll.body?.data?.payableDays}`
  });

  const payrollDup = await request(app).post('/api/v1/hrms/payroll').set(ctx.header).send({
    employeeId,
    periodYear: 2026,
    periodMonth: 8
  });
  results.push({
    testName: 'Duplicate payroll period is rejected',
    passed: payrollDup.status === 409 && payrollDup.body?.error === 'DUPLICATE_PAYROLL_PERIOD',
    message: `status=${payrollDup.status} error=${payrollDup.body?.error}`
  });

  const invalidPayroll = await request(app).post('/api/v1/hrms/payroll').set(ctx.header).send({
    employeeId: '00000000-0000-7000-a000-000000000000',
    periodYear: 2026,
    periodMonth: 7
  });
  results.push({
    testName: 'Payroll rejects unknown employee',
    passed: invalidPayroll.status === 404,
    message: `status=${invalidPayroll.status}`
  });

  const toxicPay = await request(app).post('/api/v1/hrms/pay-structures').set(ctx.header).send({
    code: uniqueCode('TOX'),
    name: 'Negative Net Fixture',
    basicSalary: 1000,
    allowanceAmount: 0,
    pfPercent: 0,
    otherDeductionAmount: 50000,
    overtimeRatePerHour: 0
  });
  const toxicEmp = await request(app).post('/api/v1/hrms/employees').set(ctx.header).send({
    code: uniqueCode('TOXEMP'),
    fullName: 'Rollback Case',
    joiningDate: '2026-01-01',
    department: 'Mining',
    designation: 'Helper',
    payStructureId: toxicPay.body.data.id
  });
  const failedPayroll = await request(app).post('/api/v1/hrms/payroll').set(ctx.header).send({
    employeeId: toxicEmp.body.data.id,
    periodYear: 2026,
    periodMonth: 7
  });
  const listedToxic = await request(app)
    .get(`/api/v1/hrms/payroll?employeeId=${toxicEmp.body.data.id}`)
    .set(ctx.header);
  results.push({
    testName: 'Failed payroll calculation rolls back and does not persist',
    passed:
      failedPayroll.status >= 400 &&
      listedToxic.status === 200 &&
      Array.isArray(listedToxic.body?.data) &&
      listedToxic.body.data.length === 0,
    message: `status=${failedPayroll.status} persisted=${listedToxic.body?.data?.length}`
  });

  const managerPayroll = await request(app).post('/api/v1/hrms/payroll').set(manager.header).send({
    employeeId,
    periodYear: 2026,
    periodMonth: 9
  });
  results.push({
    testName: 'Payroll RBAC is separated from employee permissions',
    passed: managerPayroll.status === 403,
    message: `status=${managerPayroll.status}`
  });

  const otherPayroll = await request(app).get(`/api/v1/hrms/payroll/${payroll.body.data.id}`).set(other.header);
  results.push({
    testName: 'Payroll tenant isolation returns 403',
    passed: otherPayroll.status === 403,
    message: `status=${otherPayroll.status}`
  });

  const managerEmployee = await request(app).post('/api/v1/hrms/employees').set(manager.header).send({
    code: uniqueCode('MGR'),
    fullName: 'Site Helper',
    joiningDate: '2026-03-01',
    department: 'Mining',
    designation: 'Helper'
  });
  results.push({
    testName: 'Quarry manager can create employees without payroll access',
    passed: managerEmployee.status === 201,
    message: `status=${managerEmployee.status}`
  });

  const passedCount = results.filter((row) => row.passed).length;
  return {
    skipped: false,
    executedAt,
    totalTests: results.length,
    passedCount,
    failedCount: results.length - passedCount,
    results
  };
}
