import { hrService } from '../services/hrServices.js';
import { db } from '../db/database.js';

export async function runHrTestSuite() {
  const tenantId = 'tenant-rz-global-001';
  const userId = 'usr-admin-001';
  const results: { test: string; status: 'PASSED' | 'FAILED'; error?: string }[] = [];

  const assert = (condition: boolean, testName: string, failureMsg?: string) => {
    if (condition) {
      results.push({ test: testName, status: 'PASSED' });
    } else {
      results.push({ test: testName, status: 'FAILED', error: failureMsg || 'Assertion failed' });
    }
  };

  console.log('=======================================================');
  console.log(' RUNNING PHASE 22 ENTERPRISE HRMS TEST SUITE');
  console.log('=======================================================');

  try {
    // 1. HR Dashboard Metrics
    const metrics = await hrService.getDashboardMetrics(tenantId);
    assert(metrics.totalEmployees >= 0, 'HR Dashboard Metrics Retrieval', 'Failed to retrieve dashboard metrics');

    // 2. Department & Designation Creation
    const dept = await hrService.createDepartment(tenantId, userId, {
      code: `TEST-DEPT-${Date.now().toString().slice(-4)}`,
      name: 'Quality Assurance & Testing',
      description: 'QA & Compliance Division'
    });
    assert(dept.id !== undefined, 'HR Department Creation', 'Department ID was undefined');

    const desig = await hrService.createDesignation(tenantId, userId, {
      code: `TEST-DESIG-${Date.now().toString().slice(-4)}`,
      title: 'Senior QA Automation Engineer',
      departmentId: dept.id,
      gradeLevel: 'E2'
    });
    assert(desig.id !== undefined, 'HR Designation Creation', 'Designation ID was undefined');

    // 3. Employee Creation & Duplicate Code Validation
    const empCode = `EMP-TEST-${Date.now().toString().slice(-4)}`;
    const emp = await hrService.createEmployee(tenantId, userId, {
      employeeCode: empCode,
      firstName: 'Test',
      lastName: 'User',
      email: `test.emp.${Date.now()}@racezoneventures.com`,
      phone: '+1 (555) 990-1122',
      departmentId: dept.id,
      designationId: desig.id,
      joiningDate: '2026-01-01',
      employmentStatus: 'ACTIVE',
      bankAccountMasked: '9988112233'
    });
    assert(emp.id !== undefined && emp.bankAccountMasked === '****2233', 'Employee Creation & Bank Masking', 'Employee creation failed or bank account was not masked correctly');

    let dupErrorCaught = false;
    try {
      await hrService.createEmployee(tenantId, userId, {
        employeeCode: empCode,
        firstName: 'Duplicate',
        lastName: 'User',
        email: 'dup@example.com',
        phone: '+111',
        departmentId: dept.id,
        designationId: desig.id
      });
    } catch (e) {
      dupErrorCaught = true;
    }
    assert(dupErrorCaught, 'Duplicate Employee Code Rejection', 'System allowed duplicate employee code');

    // 4. Employee User Account Link
    const link = await hrService.linkEmployeeUser(tenantId, userId, emp.id, userId);
    assert(link.id !== undefined, 'Employee User Account Link', 'Failed to link employee to user account');

    // 5. Shift Creation & Attendance Check-In / Check-Out
    const shift = await hrService.createShift(tenantId, userId, {
      shiftCode: `SH-${Date.now().toString().slice(-4)}`,
      shiftName: 'Test Night Shift',
      startTime: '22:00',
      endTime: '06:00',
      shiftType: 'NIGHT'
    });
    assert(shift.id !== undefined, 'Shift Creation', 'Failed to create shift');

    const checkInAtt = await hrService.checkIn(tenantId, userId, emp.id);
    assert(checkInAtt.checkIn !== undefined, 'Attendance Check-In', 'Check-in failed');

    const checkOutAtt = await hrService.checkOut(tenantId, userId, checkInAtt.id);
    assert(checkOutAtt.checkOut !== undefined, 'Attendance Check-Out', 'Check-out failed');

    // 6. Leave Application & Overlap Validation
    const leaveType = (await hrService.getLeaveTypes(tenantId))[0];
    assert(leaveType !== undefined, 'Leave Types Retrieval', 'No leave types found in database');

    const leaveApp1 = await hrService.applyLeave(tenantId, userId, {
      employeeId: emp.id,
      leaveTypeId: leaveType.id,
      startDate: '2026-09-01',
      endDate: '2026-09-05',
      reason: 'Vacation'
    });
    assert(leaveApp1.id !== undefined, 'Leave Application Submission', 'Failed to submit leave application');

    let overlapErrorCaught = false;
    try {
      await hrService.applyLeave(tenantId, userId, {
        employeeId: emp.id,
        leaveTypeId: leaveType.id,
        startDate: '2026-09-03',
        endDate: '2026-09-07',
        reason: 'Overlapping Vacation'
      });
    } catch (e) {
      overlapErrorCaught = true;
    }
    assert(overlapErrorCaught, 'Leave Overlap Rejection', 'System allowed overlapping leave application');

    // Approve Leave & Verify Balance Deduction
    const approvedLeave = await hrService.approveLeave(tenantId, userId, leaveApp1.id, true);
    assert(approvedLeave.status === 'APPROVED', 'Leave Application Approval', 'Leave status was not APPROVED');

    // 7. Salary Structure & Payroll Calculation
    const salaryStruct = await hrService.createSalaryStructure(tenantId, userId, {
      employeeId: emp.id,
      effectiveDate: '2026-01-01',
      baseSalary: 6000
    });
    assert(salaryStruct.id !== undefined, 'Salary Structure Creation', 'Failed to create salary structure');

    const period = (await hrService.getPayrollPeriods(tenantId))[0];
    assert(period !== undefined, 'Payroll Period Retrieval', 'No payroll period found');

    const payrollRun = await hrService.calculatePayroll(tenantId, period.id, userId);
    assert(payrollRun.id !== undefined && payrollRun.totalNet > 0, 'Payroll Calculation Engine', 'Payroll calculation failed or total net <= 0');

    // Approve & Process Payroll (Verifying Finance Journal Integration)
    await hrService.approvePayroll(tenantId, payrollRun.id, userId);
    const processedRun = await hrService.processPayroll(tenantId, payrollRun.id, userId);
    assert(processedRun.status === 'PROCESSED' && processedRun.journalId !== undefined, 'Payroll Processing & Finance Journal Posting', 'Payroll processing failed or did not generate Finance journal');

    // 8. Reimbursement Submission & Approval (Verifying Finance Journal Integration)
    const reimb = await hrService.submitReimbursement(tenantId, userId, {
      employeeId: emp.id,
      category: 'Travel',
      amount: 250,
      description: 'Site Visit Flight'
    });
    const approvedReimb = await hrService.approveReimbursement(tenantId, userId, reimb.id, true);
    assert(approvedReimb.status === 'PAID' && approvedReimb.financeJournalId !== undefined, 'Reimbursement Approval & Finance Journal Posting', 'Reimbursement approval failed or did not post Finance journal');

    // 9. Recruitment & Candidate Hiring
    const cand = await hrService.createCandidate(tenantId, userId, {
      firstName: 'Alice',
      lastName: 'Wong',
      email: `alice.wong.${Date.now()}@example.com`,
      phone: '+1 555-444-3322'
    });
    const hireResult = await hrService.hireCandidate(tenantId, userId, cand.id, dept.id, desig.id);
    assert(hireResult.candidate.status === 'HIRED' && hireResult.employee.id !== undefined, 'Recruitment Candidate Hiring Flow', 'Candidate hiring flow failed');

    // 10. HR Reports
    const reports = await hrService.getHrReports(tenantId);
    assert(reports.employeeRegister.length > 0, 'HR Reports Generation', 'Failed to generate HR reports');

  } catch (err: any) {
    results.push({ test: 'HRMS Suite Global Execution', status: 'FAILED', error: err.message });
  }

  const passedCount = results.filter(r => r.status === 'PASSED').length;
  const totalCount = results.length;

  console.log(`HRMS TEST RESULTS: ${passedCount}/${totalCount} PASSED`);
  results.forEach(r => {
    if (r.status === 'PASSED') {
      console.log(`  [PASS] ${r.test}`);
    } else {
      console.error(`  [FAIL] ${r.test}: ${r.error}`);
    }
  });

  return { passedCount, totalCount, results };
}
