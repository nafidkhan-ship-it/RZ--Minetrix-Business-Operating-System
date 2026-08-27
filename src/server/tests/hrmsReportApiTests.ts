import request from 'supertest';
import { isPostgresEnabled } from '../db/postgresPool.js';
import { createErpTestApp, loginErpAdmin, loginOtherTenant, loginQuarryManager, uniqueCode } from './erpTestHarness.js';
import { ModuleTestResult } from './erpProductionApiTests.js';

export async function runHrmsReportApiTests() {
  const executedAt = new Date().toISOString();
  if (!isPostgresEnabled()) {
    return { skipped: true, skipReason: 'DATABASE_URL is not configured', executedAt, totalTests: 0, passedCount: 0, failedCount: 0, results: [] as ModuleTestResult[] };
  }

  const app = await createErpTestApp();
  const ctx = await loginErpAdmin(app);
  const other = await loginOtherTenant(app);
  const manager = await loginQuarryManager(app);
  const results: ModuleTestResult[] = [];

  const structure = await request(app).post('/api/v1/hrms/pay-structures').set(ctx.header).send({
    code: uniqueCode('PSR'),
    name: 'Report Structure',
    basicSalary: 20000,
    allowanceAmount: 5000,
    pfPercent: 12
  });
  const employee = await request(app).post('/api/v1/hrms/employees').set(ctx.header).send({
    code: uniqueCode('EMPR'),
    fullName: 'Report Employee',
    joiningDate: '2026-01-01',
    department: 'Operations',
    designation: 'Operator',
    payStructureId: structure.body.data.id
  });

  await request(app).post('/api/v1/hrms/attendance').set(ctx.header).send({
    employeeId: employee.body.data.id,
    workDate: '2026-08-25',
    status: 'PRESENT',
    workingHours: 8
  });
  await request(app).post('/api/v1/hrms/leave-requests').set(ctx.header).send({
    employeeId: employee.body.data.id,
    leaveType: 'CL',
    startDate: '2026-08-20',
    endDate: '2026-08-21',
    reason: 'Personal'
  });
  await request(app).post('/api/v1/hrms/payroll').set(ctx.header).send({
    employeeId: employee.body.data.id,
    payStructureId: structure.body.data.id,
    periodYear: 2026,
    periodMonth: 8
  });

  const empSummary = await request(app).get('/api/v1/hrms/reports/employee-summary').set(ctx.header);
  results.push({
    testName: 'Employee summary report retrieval',
    passed: empSummary.status === 200 && empSummary.body?.data?.totalEmployees >= 1,
    message: `status=${empSummary.status} total=${empSummary.body?.data?.totalEmployees}`
  });

  const deptReport = await request(app).get('/api/v1/hrms/reports/department').set(ctx.header);
  results.push({
    testName: 'Department report retrieval',
    passed: deptReport.status === 200 && Array.isArray(deptReport.body?.data) && deptReport.body.data.length > 0,
    message: `status=${deptReport.status}`
  });

  const attReport = await request(app).get('/api/v1/hrms/reports/attendance-summary?fromDate=2026-08-01&toDate=2026-08-31').set(ctx.header);
  results.push({
    testName: 'Attendance summary with date filter',
    passed: attReport.status === 200 && Array.isArray(attReport.body?.data?.byStatus),
    message: `status=${attReport.status}`
  });

  const leaveReport = await request(app).get('/api/v1/hrms/reports/leave-summary?fromDate=2026-08-01&toDate=2026-08-31').set(ctx.header);
  results.push({
    testName: 'Leave summary report',
    passed: leaveReport.status === 200 && Array.isArray(leaveReport.body?.data?.byTypeAndStatus),
    message: `status=${leaveReport.status}`
  });

  const payrollReport = await request(app).get('/api/v1/hrms/reports/payroll-summary?year=2026&month=8').set(ctx.header);
  results.push({
    testName: 'Payroll summary totals',
    passed: payrollReport.status === 200 && payrollReport.body?.data?.payrollCount >= 1 && payrollReport.body?.data?.totalNet > 0,
    message: `status=${payrollReport.status} net=${payrollReport.body?.data?.totalNet}`
  });

  const payStructReport = await request(app).get('/api/v1/hrms/reports/pay-structure-summary').set(ctx.header);
  results.push({
    testName: 'Pay structure summary report',
    passed: payStructReport.status === 200 && payStructReport.body?.data?.some((r: { code: string }) => r.code === structure.body.data.code),
    message: `status=${payStructReport.status}`
  });

  const noAuth = await request(app).get('/api/v1/hrms/reports/employee-summary');
  results.push({
    testName: 'Unauthorized HR report access blocked',
    passed: noAuth.status === 401,
    message: `status=${noAuth.status}`
  });

  const otherTenant = await request(app).get('/api/v1/hrms/reports/employee-summary').set(other.header);
  results.push({
    testName: 'HR report tenant isolation (separate tenant data)',
    passed: otherTenant.status === 403,
    message: `status=${otherTenant.status}`
  });

  const managerDenied = await request(app).get('/api/v1/hrms/payroll').set(manager.header);
  results.push({
    testName: 'RBAC blocks quarry manager from raw payroll list',
    passed: managerDenied.status === 403,
    message: `status=${managerDenied.status}`
  });

  const passedCount = results.filter((r) => r.passed).length;
  return {
    executedAt,
    totalTests: results.length,
    passedCount,
    failedCount: results.length - passedCount,
    results
  };
}
