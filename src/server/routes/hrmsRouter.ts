import { Router, Response } from 'express';
import {
  authenticateJwt,
  enforceTenantContext,
  requirePermission,
  CustomRequest
} from '../middleware/authMiddleware.js';
import { rejectClientTenantId, validateResourceIdParam } from '../middleware/inputValidation.js';
import {
  validateCreateAttendanceBody,
  validateCreateEmployeeBody,
  validateCreateLeaveBody,
  validateCreatePayStructureBody,
  validateCreatePayrollBody,
  validatePatchEmployeeBody
} from '../middleware/hrmsValidation.js';
import { HrmsService, ErpServiceError } from '../services/hrmsService.js';

export const hrmsRouter = Router();
const hrms = new HrmsService();

function handleHrmsError(error: unknown, res: Response) {
  if (error instanceof ErpServiceError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.code,
      message: error.message
    });
  }
  console.error('[HRMS API]', error instanceof Error ? error.message : 'Unknown error');
  return res.status(500).json({
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message: 'An internal server error occurred.'
  });
}

const viewEmployee = [authenticateJwt, enforceTenantContext, requirePermission('hrms:employee:view')] as const;
const createEmployee = [authenticateJwt, rejectClientTenantId, enforceTenantContext, requirePermission('hrms:employee:create')] as const;
const updateEmployee = [authenticateJwt, rejectClientTenantId, enforceTenantContext, requirePermission('hrms:employee:update')] as const;
const viewAttendance = [authenticateJwt, enforceTenantContext, requirePermission('hrms:attendance:view')] as const;
const writeAttendance = [authenticateJwt, rejectClientTenantId, enforceTenantContext, requirePermission('hrms:attendance:create')] as const;
const viewLeave = [authenticateJwt, enforceTenantContext, requirePermission('hrms:leave:view')] as const;
const writeLeave = [authenticateJwt, rejectClientTenantId, enforceTenantContext, requirePermission('hrms:leave:create')] as const;
const approveLeave = [authenticateJwt, enforceTenantContext, requirePermission('hrms:leave:approve')] as const;
const viewPayroll = [authenticateJwt, enforceTenantContext, requirePermission('hrms:payroll:view')] as const;
const writePayroll = [authenticateJwt, rejectClientTenantId, enforceTenantContext, requirePermission('hrms:payroll:create')] as const;
const viewReports = [authenticateJwt, enforceTenantContext, requirePermission('hrms:report:view')] as const;

hrmsRouter.get('/pay-structures', ...viewPayroll, async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await hrms.listPayStructures(req.user!.tenantId) });
  } catch (error) {
    return handleHrmsError(error, res);
  }
});

hrmsRouter.post('/pay-structures', ...writePayroll, validateCreatePayStructureBody, async (req: CustomRequest, res: Response) => {
  try {
    const structure = await hrms.createPayStructure(req.user!.tenantId, req.body);
    return res.status(201).json({ success: true, data: structure });
  } catch (error) {
    return handleHrmsError(error, res);
  }
});

hrmsRouter.get('/employees', ...viewEmployee, async (req: CustomRequest, res: Response) => {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const department = typeof req.query.department === 'string' ? req.query.department : undefined;
    const employmentStatus = typeof req.query.employmentStatus === 'string' ? req.query.employmentStatus : undefined;
    const limit = typeof req.query.limit === 'string' ? Number(req.query.limit) : undefined;
    const offset = typeof req.query.offset === 'string' ? Number(req.query.offset) : undefined;
    return res.json({
      success: true,
      data: await hrms.listEmployees(req.user!.tenantId, { search, department, employmentStatus, limit, offset })
    });
  } catch (error) {
    return handleHrmsError(error, res);
  }
});

hrmsRouter.post('/employees', ...createEmployee, validateCreateEmployeeBody, async (req: CustomRequest, res: Response) => {
  try {
    const employee = await hrms.createEmployee(req.user!.tenantId, { ...req.body, createdBy: req.user!.userId });
    return res.status(201).json({ success: true, data: employee });
  } catch (error) {
    return handleHrmsError(error, res);
  }
});

hrmsRouter.get('/employees/:id', ...viewEmployee, validateResourceIdParam('id'), async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await hrms.getEmployee(req.user!.tenantId, req.params.id) });
  } catch (error) {
    return handleHrmsError(error, res);
  }
});

hrmsRouter.patch('/employees/:id', ...updateEmployee, validateResourceIdParam('id'), validatePatchEmployeeBody, async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await hrms.updateEmployee(req.user!.tenantId, req.params.id, req.body) });
  } catch (error) {
    return handleHrmsError(error, res);
  }
});

hrmsRouter.delete('/employees/:id', ...updateEmployee, validateResourceIdParam('id'), async (req: CustomRequest, res: Response) => {
  try {
    await hrms.archiveEmployee(req.user!.tenantId, req.params.id);
    return res.json({ success: true, message: 'Employee archived successfully.' });
  } catch (error) {
    return handleHrmsError(error, res);
  }
});

hrmsRouter.get('/attendance', ...viewAttendance, async (req: CustomRequest, res: Response) => {
  try {
    const employeeId = typeof req.query.employeeId === 'string' ? req.query.employeeId : undefined;
    return res.json({ success: true, data: await hrms.listAttendance(req.user!.tenantId, employeeId) });
  } catch (error) {
    return handleHrmsError(error, res);
  }
});

hrmsRouter.post('/attendance', ...writeAttendance, validateCreateAttendanceBody, async (req: CustomRequest, res: Response) => {
  try {
    const row = await hrms.createAttendance(req.user!.tenantId, { ...req.body, createdBy: req.user!.userId });
    return res.status(201).json({ success: true, data: row });
  } catch (error) {
    return handleHrmsError(error, res);
  }
});

hrmsRouter.get('/leave-requests', ...viewLeave, async (req: CustomRequest, res: Response) => {
  try {
    const employeeId = typeof req.query.employeeId === 'string' ? req.query.employeeId : undefined;
    return res.json({ success: true, data: await hrms.listLeaves(req.user!.tenantId, employeeId) });
  } catch (error) {
    return handleHrmsError(error, res);
  }
});

hrmsRouter.post('/leave-requests', ...writeLeave, validateCreateLeaveBody, async (req: CustomRequest, res: Response) => {
  try {
    const leave = await hrms.createLeave(req.user!.tenantId, { ...req.body, createdBy: req.user!.userId });
    return res.status(201).json({ success: true, data: leave });
  } catch (error) {
    return handleHrmsError(error, res);
  }
});

hrmsRouter.get('/leave-requests/:id', ...viewLeave, validateResourceIdParam('id'), async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await hrms.getLeave(req.user!.tenantId, req.params.id) });
  } catch (error) {
    return handleHrmsError(error, res);
  }
});

hrmsRouter.post('/leave-requests/:id/approve', ...approveLeave, validateResourceIdParam('id'), async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await hrms.transitionLeave(req.user!.tenantId, req.params.id, 'APPROVED', req.user!.userId) });
  } catch (error) {
    return handleHrmsError(error, res);
  }
});

hrmsRouter.post('/leave-requests/:id/reject', ...approveLeave, validateResourceIdParam('id'), async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await hrms.transitionLeave(req.user!.tenantId, req.params.id, 'REJECTED', req.user!.userId) });
  } catch (error) {
    return handleHrmsError(error, res);
  }
});

hrmsRouter.get('/payroll', ...viewPayroll, async (req: CustomRequest, res: Response) => {
  try {
    const employeeId = typeof req.query.employeeId === 'string' ? req.query.employeeId : undefined;
    return res.json({ success: true, data: await hrms.listPayroll(req.user!.tenantId, employeeId) });
  } catch (error) {
    return handleHrmsError(error, res);
  }
});

hrmsRouter.post('/payroll', ...writePayroll, validateCreatePayrollBody, async (req: CustomRequest, res: Response) => {
  try {
    const payroll = await hrms.createPayroll(req.user!.tenantId, { ...req.body, createdBy: req.user!.userId });
    return res.status(201).json({ success: true, data: payroll });
  } catch (error) {
    return handleHrmsError(error, res);
  }
});

hrmsRouter.get('/payroll/:id', ...viewPayroll, validateResourceIdParam('id'), async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await hrms.getPayroll(req.user!.tenantId, req.params.id) });
  } catch (error) {
    return handleHrmsError(error, res);
  }
});

hrmsRouter.get('/reports/employee-summary', ...viewReports, async (req: CustomRequest, res: Response) => {
  try {
    const department = typeof req.query.department === 'string' ? req.query.department : undefined;
    const employmentStatus = typeof req.query.employmentStatus === 'string' ? req.query.employmentStatus : undefined;
    return res.json({ success: true, data: await hrms.employeeSummaryReport(req.user!.tenantId, { department, employmentStatus }) });
  } catch (error) {
    return handleHrmsError(error, res);
  }
});

hrmsRouter.get('/reports/department', ...viewReports, async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await hrms.departmentReport(req.user!.tenantId) });
  } catch (error) {
    return handleHrmsError(error, res);
  }
});

hrmsRouter.get('/reports/attendance-summary', ...viewReports, async (req: CustomRequest, res: Response) => {
  try {
    const fromDate = typeof req.query.fromDate === 'string' ? req.query.fromDate : undefined;
    const toDate = typeof req.query.toDate === 'string' ? req.query.toDate : undefined;
    const employeeId = typeof req.query.employeeId === 'string' ? req.query.employeeId : undefined;
    return res.json({ success: true, data: await hrms.attendanceSummaryReport(req.user!.tenantId, { fromDate, toDate, employeeId }) });
  } catch (error) {
    return handleHrmsError(error, res);
  }
});

hrmsRouter.get('/reports/leave-summary', ...viewReports, async (req: CustomRequest, res: Response) => {
  try {
    const fromDate = typeof req.query.fromDate === 'string' ? req.query.fromDate : undefined;
    const toDate = typeof req.query.toDate === 'string' ? req.query.toDate : undefined;
    const employeeId = typeof req.query.employeeId === 'string' ? req.query.employeeId : undefined;
    return res.json({ success: true, data: await hrms.leaveSummaryReport(req.user!.tenantId, { fromDate, toDate, employeeId }) });
  } catch (error) {
    return handleHrmsError(error, res);
  }
});

hrmsRouter.get('/reports/payroll-summary', ...viewReports, async (req: CustomRequest, res: Response) => {
  try {
    const year = typeof req.query.year === 'string' ? Number(req.query.year) : undefined;
    const month = typeof req.query.month === 'string' ? Number(req.query.month) : undefined;
    const employeeId = typeof req.query.employeeId === 'string' ? req.query.employeeId : undefined;
    return res.json({ success: true, data: await hrms.payrollSummaryReport(req.user!.tenantId, { year, month, employeeId }) });
  } catch (error) {
    return handleHrmsError(error, res);
  }
});

hrmsRouter.get('/reports/pay-structure-summary', ...viewReports, async (req: CustomRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await hrms.payStructureSummaryReport(req.user!.tenantId) });
  } catch (error) {
    return handleHrmsError(error, res);
  }
});
