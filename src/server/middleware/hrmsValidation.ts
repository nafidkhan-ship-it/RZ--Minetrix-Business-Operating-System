import { Response, NextFunction } from 'express';
import { CustomRequest } from './authMiddleware.js';

const SAFE_ID = /^[a-zA-Z0-9._-]{1,128}$/;
const CODE = /^[A-Z0-9._-]{2,64}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STATUSES = new Set(['ACTIVE', 'INACTIVE', 'ARCHIVED']);
const ATTENDANCE = new Set(['PRESENT', 'ABSENT', 'HALF_DAY', 'LEAVE', 'HOLIDAY', 'OFF']);
const LEAVE_TYPES = new Set(['CL', 'SL', 'EL', 'LOP', 'MATERNITY', 'PATERNITY']);

function bad(res: Response, message: string) {
  return res.status(400).json({ success: false, error: 'BAD_REQUEST', message });
}

function requireCode(value: unknown, field: string): string | null {
  if (typeof value !== 'string' || !CODE.test(value.trim().toUpperCase())) {
    return `${field} must be 2-64 characters (letters, numbers, dot, underscore, hyphen).`;
  }
  return null;
}

function requireName(value: unknown, field: string): string | null {
  if (typeof value !== 'string' || value.trim().length < 2 || value.trim().length > 255) {
    return `${field} must be between 2 and 255 characters.`;
  }
  return null;
}

export function validateCreatePayStructureBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  const codeErr = requireCode(body.code, 'code');
  if (codeErr) return bad(res, codeErr);
  const nameErr = requireName(body.name, 'name');
  if (nameErr) return bad(res, nameErr);
  if (typeof body.basicSalary !== 'number' || body.basicSalary < 0) return bad(res, 'basicSalary must be a non-negative number.');
  req.body = {
    code: String(body.code).trim().toUpperCase(),
    name: String(body.name).trim(),
    basicSalary: body.basicSalary,
    allowanceAmount: body.allowanceAmount,
    pfPercent: body.pfPercent,
    otherDeductionAmount: body.otherDeductionAmount,
    overtimeRatePerHour: body.overtimeRatePerHour
  };
  next();
}

export function validateCreateEmployeeBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  const codeErr = requireCode(body.code, 'code');
  if (codeErr) return bad(res, codeErr);
  const nameErr = requireName(body.fullName, 'fullName');
  if (nameErr) return bad(res, nameErr);
  if (typeof body.joiningDate !== 'string' || !DATE.test(body.joiningDate)) return bad(res, 'joiningDate must be YYYY-MM-DD.');
  const deptErr = requireName(body.department, 'department');
  if (deptErr) return bad(res, deptErr);
  const desigErr = requireName(body.designation, 'designation');
  if (desigErr) return bad(res, desigErr);
  if (body.email && (typeof body.email !== 'string' || !EMAIL.test(body.email))) return bad(res, 'email is invalid.');
  if (body.payStructureId && (typeof body.payStructureId !== 'string' || !SAFE_ID.test(body.payStructureId))) {
    return bad(res, 'Invalid payStructureId.');
  }
  if (body.employmentStatus && !STATUSES.has(body.employmentStatus)) return bad(res, 'Invalid employmentStatus.');
  req.body = {
    code: String(body.code).trim().toUpperCase(),
    fullName: String(body.fullName).trim(),
    phone: typeof body.phone === 'string' ? body.phone.trim() : undefined,
    email: typeof body.email === 'string' ? body.email.trim().toLowerCase() : undefined,
    address: typeof body.address === 'string' ? body.address.trim() : undefined,
    joiningDate: body.joiningDate,
    department: String(body.department).trim(),
    designation: String(body.designation).trim(),
    employmentStatus: body.employmentStatus,
    branchId: body.branchId,
    payStructureId: body.payStructureId,
    emergencyContactName: typeof body.emergencyContactName === 'string' ? body.emergencyContactName.trim() : undefined,
    emergencyContactPhone: typeof body.emergencyContactPhone === 'string' ? body.emergencyContactPhone.trim() : undefined
  };
  next();
}

export function validatePatchEmployeeBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  if (body.tenantId !== undefined) return bad(res, 'Client-supplied tenantId is not allowed.');
  if (body.fullName !== undefined) {
    const nameErr = requireName(body.fullName, 'fullName');
    if (nameErr) return bad(res, nameErr);
  }
  if (body.employmentStatus && !STATUSES.has(body.employmentStatus)) return bad(res, 'Invalid employmentStatus.');
  next();
}

export function validateCreateAttendanceBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  if (typeof body.employeeId !== 'string' || !SAFE_ID.test(body.employeeId)) return bad(res, 'Invalid employeeId.');
  if (typeof body.workDate !== 'string' || !DATE.test(body.workDate)) return bad(res, 'workDate must be YYYY-MM-DD.');
  if (typeof body.status !== 'string' || !ATTENDANCE.has(body.status)) return bad(res, 'Invalid attendance status.');
  req.body = {
    employeeId: body.employeeId,
    workDate: body.workDate,
    checkIn: body.checkIn,
    checkOut: body.checkOut,
    status: body.status,
    overtimeHours: body.overtimeHours,
    remarks: typeof body.remarks === 'string' ? body.remarks.trim() : undefined,
    branchId: body.branchId
  };
  next();
}

export function validateCreateLeaveBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  if (typeof body.employeeId !== 'string' || !SAFE_ID.test(body.employeeId)) return bad(res, 'Invalid employeeId.');
  if (typeof body.leaveType !== 'string' || !LEAVE_TYPES.has(body.leaveType)) return bad(res, 'Invalid leaveType.');
  if (typeof body.startDate !== 'string' || !DATE.test(body.startDate)) return bad(res, 'startDate must be YYYY-MM-DD.');
  if (typeof body.endDate !== 'string' || !DATE.test(body.endDate)) return bad(res, 'endDate must be YYYY-MM-DD.');
  if (body.endDate < body.startDate) return bad(res, 'endDate must be on or after startDate.');
  req.body = {
    employeeId: body.employeeId,
    leaveType: body.leaveType,
    startDate: body.startDate,
    endDate: body.endDate,
    reason: typeof body.reason === 'string' ? body.reason.trim() : undefined
  };
  next();
}

export function validateCreatePayrollBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  if (typeof body.employeeId !== 'string' || !SAFE_ID.test(body.employeeId)) return bad(res, 'Invalid employeeId.');
  if (typeof body.periodYear !== 'number' || body.periodYear < 2000 || body.periodYear > 2100) {
    return bad(res, 'periodYear must be a valid year.');
  }
  if (typeof body.periodMonth !== 'number' || body.periodMonth < 1 || body.periodMonth > 12) {
    return bad(res, 'periodMonth must be between 1 and 12.');
  }
  req.body = {
    employeeId: body.employeeId,
    periodYear: body.periodYear,
    periodMonth: body.periodMonth
  };
  next();
}
