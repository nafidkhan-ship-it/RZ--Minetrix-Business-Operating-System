import { Router, Request, Response } from 'express';
import { hrService } from '../services/hrServices.js';

export const hrRouter = Router();

// Middleware helper to extract tenant & user ID with default fallback for dev/testing
function getContext(req: Request) {
  const user = (req as any).user || {};
  const tenantId = user.tenantId || req.headers['x-tenant-id'] || 'tenant-rz-global-001';
  const userId = user.id || 'usr-admin-001';
  return { tenantId: String(tenantId), userId: String(userId) };
}

// 1. Dashboard Metrics
hrRouter.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const { tenantId } = getContext(req);
    const metrics = await hrService.getDashboardMetrics(tenantId);
    res.json({ success: true, data: metrics });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Employees Master
hrRouter.get('/employees', async (req: Request, res: Response) => {
  try {
    const { tenantId } = getContext(req);
    const employees = await hrService.getEmployees(tenantId);
    res.json({ success: true, data: employees });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

hrRouter.get('/employees/:id', async (req: Request, res: Response) => {
  try {
    const { tenantId } = getContext(req);
    const emp = await hrService.getEmployeeById(tenantId, req.params.id);
    if (!emp) return res.status(404).json({ success: false, error: 'Employee not found' });
    res.json({ success: true, data: emp });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

hrRouter.post('/employees', async (req: Request, res: Response) => {
  try {
    const { tenantId, userId } = getContext(req);
    const emp = await hrService.createEmployee(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: emp });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

hrRouter.put('/employees/:id', async (req: Request, res: Response) => {
  try {
    const { tenantId, userId } = getContext(req);
    const emp = await hrService.updateEmployee(tenantId, userId, req.params.id, req.body);
    res.json({ success: true, data: emp });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

hrRouter.post('/employees/:id/link-user', async (req: Request, res: Response) => {
  try {
    const { tenantId, userId } = getContext(req);
    const link = await hrService.linkEmployeeUser(tenantId, userId, req.params.id, req.body.targetUserId);
    res.json({ success: true, data: link });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 3. Departments & Designations
hrRouter.get('/departments', async (req: Request, res: Response) => {
  try {
    const { tenantId } = getContext(req);
    const depts = await hrService.getDepartments(tenantId);
    res.json({ success: true, data: depts });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

hrRouter.post('/departments', async (req: Request, res: Response) => {
  try {
    const { tenantId, userId } = getContext(req);
    const dept = await hrService.createDepartment(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: dept });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

hrRouter.get('/designations', async (req: Request, res: Response) => {
  try {
    const { tenantId } = getContext(req);
    const desigs = await hrService.getDesignations(tenantId);
    res.json({ success: true, data: desigs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

hrRouter.post('/designations', async (req: Request, res: Response) => {
  try {
    const { tenantId, userId } = getContext(req);
    const desig = await hrService.createDesignation(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: desig });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 4. Shifts
hrRouter.get('/shifts', async (req: Request, res: Response) => {
  try {
    const { tenantId } = getContext(req);
    const shifts = await hrService.getShifts(tenantId);
    res.json({ success: true, data: shifts });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

hrRouter.post('/shifts', async (req: Request, res: Response) => {
  try {
    const { tenantId, userId } = getContext(req);
    const shift = await hrService.createShift(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: shift });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 5. Attendance & Corrections
hrRouter.get('/attendance', async (req: Request, res: Response) => {
  try {
    const { tenantId } = getContext(req);
    const employeeId = req.query.employeeId ? String(req.query.employeeId) : undefined;
    const date = req.query.date ? String(req.query.date) : undefined;
    const records = await hrService.getAttendance(tenantId, employeeId, date);
    res.json({ success: true, data: records });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

hrRouter.post('/attendance/check-in', async (req: Request, res: Response) => {
  try {
    const { tenantId, userId } = getContext(req);
    const att = await hrService.checkIn(tenantId, userId, req.body.employeeId, req.body.checkInTime);
    res.json({ success: true, data: att });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

hrRouter.post('/attendance/check-out', async (req: Request, res: Response) => {
  try {
    const { tenantId, userId } = getContext(req);
    const att = await hrService.checkOut(tenantId, userId, req.body.attendanceId, req.body.checkOutTime);
    res.json({ success: true, data: att });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

hrRouter.post('/attendance/corrections', async (req: Request, res: Response) => {
  try {
    const { tenantId, userId } = getContext(req);
    const corr = await hrService.submitAttendanceCorrection(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: corr });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

hrRouter.post('/attendance/corrections/:id/approve', async (req: Request, res: Response) => {
  try {
    const { tenantId, userId } = getContext(req);
    const corr = await hrService.approveAttendanceCorrection(tenantId, userId, req.params.id, req.body.approved !== false);
    res.json({ success: true, data: corr });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 6. Leave Management
hrRouter.get('/leave/types', async (req: Request, res: Response) => {
  try {
    const { tenantId } = getContext(req);
    const types = await hrService.getLeaveTypes(tenantId);
    res.json({ success: true, data: types });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

hrRouter.get('/leave/balances', async (req: Request, res: Response) => {
  try {
    const { tenantId } = getContext(req);
    const employeeId = req.query.employeeId ? String(req.query.employeeId) : undefined;
    const balances = await hrService.getLeaveBalances(tenantId, employeeId);
    res.json({ success: true, data: balances });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

hrRouter.get('/leave/applications', async (req: Request, res: Response) => {
  try {
    const { tenantId } = getContext(req);
    const employeeId = req.query.employeeId ? String(req.query.employeeId) : undefined;
    const apps = await hrService.getLeaveBalances(tenantId, employeeId); // Fallback / actual lookup via repo
    const list = await hrService.applyLeave ? (await hrService.getLeaveBalances(tenantId, employeeId)) : [];
    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

hrRouter.post('/leave/applications', async (req: Request, res: Response) => {
  try {
    const { tenantId, userId } = getContext(req);
    const app = await hrService.applyLeave(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: app });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

hrRouter.post('/leave/applications/:id/approve', async (req: Request, res: Response) => {
  try {
    const { tenantId, userId } = getContext(req);
    const app = await hrService.approveLeave(tenantId, userId, req.params.id, req.body.approved !== false);
    res.json({ success: true, data: app });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 7. Holidays & Overtime
hrRouter.get('/holidays', async (req: Request, res: Response) => {
  try {
    const { tenantId } = getContext(req);
    const hols = await hrService.getHolidays(tenantId);
    res.json({ success: true, data: hols });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

hrRouter.post('/holidays', async (req: Request, res: Response) => {
  try {
    const { tenantId, userId } = getContext(req);
    const hol = await hrService.createHoliday(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: hol });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

hrRouter.get('/overtime', async (req: Request, res: Response) => {
  try {
    const { tenantId } = getContext(req);
    const ot = await hrService.getOvertime(tenantId);
    res.json({ success: true, data: ot });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

hrRouter.post('/overtime/:id/approve', async (req: Request, res: Response) => {
  try {
    const { tenantId, userId } = getContext(req);
    const ot = await hrService.approveOvertime(tenantId, userId, req.params.id, req.body.approvedMinutes || 120, req.body.rate || 1.5);
    res.json({ success: true, data: ot });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 8. Salary Structures
hrRouter.get('/salary-structures', async (req: Request, res: Response) => {
  try {
    const { tenantId } = getContext(req);
    const employeeId = req.query.employeeId ? String(req.query.employeeId) : undefined;
    const structs = await hrService.getSalaryStructures(tenantId, employeeId);
    res.json({ success: true, data: structs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

hrRouter.post('/salary-structures', async (req: Request, res: Response) => {
  try {
    const { tenantId, userId } = getContext(req);
    const struct = await hrService.createSalaryStructure(tenantId, userId, req.body.structure || req.body, req.body.components || []);
    res.status(201).json({ success: true, data: struct });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 9. Payroll
hrRouter.get('/payroll/periods', async (req: Request, res: Response) => {
  try {
    const { tenantId } = getContext(req);
    const periods = await hrService.getPayrollPeriods(tenantId);
    res.json({ success: true, data: periods });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

hrRouter.post('/payroll/periods', async (req: Request, res: Response) => {
  try {
    const { tenantId, userId } = getContext(req);
    const period = await hrService.createPayrollPeriod(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: period });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

hrRouter.get('/payroll/runs', async (req: Request, res: Response) => {
  try {
    const { tenantId } = getContext(req);
    const runs = await hrService.getPayrollRuns(tenantId);
    res.json({ success: true, data: runs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

hrRouter.post('/payroll/calculate', async (req: Request, res: Response) => {
  try {
    const { tenantId, userId } = getContext(req);
    const run = await hrService.calculatePayroll(tenantId, req.body.periodId, userId);
    res.status(201).json({ success: true, data: run });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

hrRouter.post('/payroll/runs/:id/approve', async (req: Request, res: Response) => {
  try {
    const { tenantId, userId } = getContext(req);
    const run = await hrService.approvePayroll(tenantId, req.params.id, userId);
    res.json({ success: true, data: run });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

hrRouter.post('/payroll/runs/:id/process', async (req: Request, res: Response) => {
  try {
    const { tenantId, userId } = getContext(req);
    const run = await hrService.processPayroll(tenantId, req.params.id, userId);
    res.json({ success: true, data: run });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

hrRouter.get('/payslips', async (req: Request, res: Response) => {
  try {
    const { tenantId } = getContext(req);
    const employeeId = req.query.employeeId ? String(req.query.employeeId) : undefined;
    const payslips = await hrService.getPayslips(tenantId, employeeId);
    res.json({ success: true, data: payslips });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 10. Advances & Loans
hrRouter.get('/advances', async (req: Request, res: Response) => {
  try {
    const { tenantId } = getContext(req);
    const employeeId = req.query.employeeId ? String(req.query.employeeId) : undefined;
    const advances = await hrService.getSalaryAdvances(tenantId, employeeId);
    res.json({ success: true, data: advances });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

hrRouter.post('/advances', async (req: Request, res: Response) => {
  try {
    const { tenantId, userId } = getContext(req);
    const adv = await hrService.requestSalaryAdvance(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: adv });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

hrRouter.post('/advances/:id/approve', async (req: Request, res: Response) => {
  try {
    const { tenantId, userId } = getContext(req);
    const adv = await hrService.approveSalaryAdvance(tenantId, userId, req.params.id, req.body.approved !== false);
    res.json({ success: true, data: adv });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

hrRouter.get('/loans', async (req: Request, res: Response) => {
  try {
    const { tenantId } = getContext(req);
    const employeeId = req.query.employeeId ? String(req.query.employeeId) : undefined;
    const loans = await hrService.getEmployeeLoans(tenantId, employeeId);
    res.json({ success: true, data: loans });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

hrRouter.post('/loans', async (req: Request, res: Response) => {
  try {
    const { tenantId, userId } = getContext(req);
    const loan = await hrService.requestEmployeeLoan(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: loan });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

hrRouter.post('/loans/:id/approve', async (req: Request, res: Response) => {
  try {
    const { tenantId, userId } = getContext(req);
    const loan = await hrService.approveEmployeeLoan(tenantId, userId, req.params.id, req.body.approved !== false);
    res.json({ success: true, data: loan });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 11. Reimbursements
hrRouter.get('/reimbursements', async (req: Request, res: Response) => {
  try {
    const { tenantId } = getContext(req);
    const employeeId = req.query.employeeId ? String(req.query.employeeId) : undefined;
    const reimbs = await hrService.getReimbursements(tenantId, employeeId);
    res.json({ success: true, data: reimbs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

hrRouter.post('/reimbursements', async (req: Request, res: Response) => {
  try {
    const { tenantId, userId } = getContext(req);
    const reimb = await hrService.submitReimbursement(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: reimb });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

hrRouter.post('/reimbursements/:id/approve', async (req: Request, res: Response) => {
  try {
    const { tenantId, userId } = getContext(req);
    const reimb = await hrService.approveReimbursement(tenantId, userId, req.params.id, req.body.approved !== false);
    res.json({ success: true, data: reimb });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 12. Documents
hrRouter.get('/documents', async (req: Request, res: Response) => {
  try {
    const { tenantId } = getContext(req);
    const employeeId = req.query.employeeId ? String(req.query.employeeId) : undefined;
    const docs = await hrService.getEmployeeDocuments(tenantId, employeeId);
    res.json({ success: true, data: docs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

hrRouter.post('/documents', async (req: Request, res: Response) => {
  try {
    const { tenantId, userId } = getContext(req);
    const doc = await hrService.addEmployeeDocument(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: doc });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 13. Performance
hrRouter.get('/performance/cycles', async (req: Request, res: Response) => {
  try {
    const { tenantId } = getContext(req);
    const cycles = await hrService.getPerformanceCycles(tenantId);
    res.json({ success: true, data: cycles });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

hrRouter.post('/performance/cycles', async (req: Request, res: Response) => {
  try {
    const { tenantId, userId } = getContext(req);
    const cycle = await hrService.createPerformanceCycle(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: cycle });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

hrRouter.get('/performance/goals', async (req: Request, res: Response) => {
  try {
    const { tenantId } = getContext(req);
    const employeeId = req.query.employeeId ? String(req.query.employeeId) : undefined;
    const goals = await hrService.getEmployeeGoals(tenantId, employeeId);
    res.json({ success: true, data: goals });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

hrRouter.post('/performance/goals', async (req: Request, res: Response) => {
  try {
    const { tenantId, userId } = getContext(req);
    const goal = await hrService.createEmployeeGoal(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: goal });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

hrRouter.get('/performance/reviews', async (req: Request, res: Response) => {
  try {
    const { tenantId } = getContext(req);
    const employeeId = req.query.employeeId ? String(req.query.employeeId) : undefined;
    const reviews = await hrService.getEmployeeReviews(tenantId, employeeId);
    res.json({ success: true, data: reviews });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

hrRouter.post('/performance/reviews', async (req: Request, res: Response) => {
  try {
    const { tenantId, userId } = getContext(req);
    const rev = await hrService.submitEmployeeReview(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: rev });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 14. Recruitment
hrRouter.get('/recruitment/requisitions', async (req: Request, res: Response) => {
  try {
    const { tenantId } = getContext(req);
    const reqs = await hrService.getJobRequisitions(tenantId);
    res.json({ success: true, data: reqs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

hrRouter.post('/recruitment/requisitions', async (req: Request, res: Response) => {
  try {
    const { tenantId, userId } = getContext(req);
    const reqItem = await hrService.createJobRequisition(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: reqItem });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

hrRouter.get('/recruitment/candidates', async (req: Request, res: Response) => {
  try {
    const { tenantId } = getContext(req);
    const candidates = await hrService.getCandidates(tenantId);
    res.json({ success: true, data: candidates });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

hrRouter.post('/recruitment/candidates', async (req: Request, res: Response) => {
  try {
    const { tenantId, userId } = getContext(req);
    const cand = await hrService.createCandidate(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: cand });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

hrRouter.post('/recruitment/candidates/:id/hire', async (req: Request, res: Response) => {
  try {
    const { tenantId, userId } = getContext(req);
    const result = await hrService.hireCandidate(tenantId, userId, req.params.id, req.body.departmentId, req.body.designationId);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 15. Onboarding & Offboarding
hrRouter.get('/onboarding', async (req: Request, res: Response) => {
  try {
    const { tenantId } = getContext(req);
    const employeeId = req.query.employeeId ? String(req.query.employeeId) : undefined;
    const tasks = await hrService.getOnboardings(tenantId, employeeId);
    res.json({ success: true, data: tasks });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

hrRouter.post('/onboarding', async (req: Request, res: Response) => {
  try {
    const { tenantId, userId } = getContext(req);
    const task = await hrService.createOnboardingTask(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: task });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

hrRouter.get('/offboarding', async (req: Request, res: Response) => {
  try {
    const { tenantId } = getContext(req);
    const employeeId = req.query.employeeId ? String(req.query.employeeId) : undefined;
    const records = await hrService.getOffboardings(tenantId, employeeId);
    res.json({ success: true, data: records });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

hrRouter.post('/offboarding', async (req: Request, res: Response) => {
  try {
    const { tenantId, userId } = getContext(req);
    const rec = await hrService.initiateOffboarding(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: rec });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

hrRouter.post('/offboarding/final-settlement', async (req: Request, res: Response) => {
  try {
    const { tenantId, userId } = getContext(req);
    const settlement = await hrService.calculateFinalSettlement(tenantId, userId, req.body.employeeId);
    res.json({ success: true, data: settlement });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 16. Reports
hrRouter.get('/reports', async (req: Request, res: Response) => {
  try {
    const { tenantId } = getContext(req);
    const reports = await hrService.getHrReports(tenantId, req.query);
    res.json({ success: true, data: reports });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
