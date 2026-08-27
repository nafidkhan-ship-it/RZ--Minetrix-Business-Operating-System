import { Response, NextFunction } from 'express';
import { CustomRequest } from './authMiddleware.js';

const SAFE_ID = /^[a-zA-Z0-9._-]{1,128}$/;
const REGISTRATION = /^[A-Z0-9-]{4,32}$/;
const VEHICLE_TYPES = new Set(['TIPPER', 'TRAILER', 'TANKER', 'PICKUP', 'LOWBED', 'OTHER']);
const FUEL_TYPES = new Set(['DIESEL', 'PETROL', 'CNG', 'ELECTRIC', 'HYBRID']);
const OWNERSHIP_TYPES = new Set(['COMPANY', 'ATTACHED', 'CONTRACTOR', 'LEASED']);
const STATUSES = new Set(['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'RETIRED']);

function bad(res: Response, message: string) {
  return res.status(400).json({ success: false, error: 'BAD_REQUEST', message });
}

function requireName(value: unknown, field: string): string | null {
  if (typeof value !== 'string' || value.trim().length < 1 || value.trim().length > 128) {
    return `${field} must be between 1 and 128 characters.`;
  }
  return null;
}

export function validateCreateVehicleBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  if (typeof body.registrationNumber !== 'string' || !REGISTRATION.test(body.registrationNumber.trim().toUpperCase())) {
    return bad(res, 'registrationNumber is required (4-32 letters, numbers, or hyphens).');
  }
  if (typeof body.vehicleType !== 'string' || !VEHICLE_TYPES.has(body.vehicleType)) {
    return bad(res, 'Invalid vehicle type.');
  }
  const makeErr = requireName(body.make, 'make');
  if (makeErr) return bad(res, makeErr);
  const modelErr = requireName(body.model, 'model');
  if (modelErr) return bad(res, modelErr);
  if (typeof body.manufacturingYear !== 'number' || body.manufacturingYear < 1980 || body.manufacturingYear > 2100) {
    return bad(res, 'manufacturingYear must be between 1980 and 2100.');
  }
  if (typeof body.fuelType !== 'string' || !FUEL_TYPES.has(body.fuelType)) {
    return bad(res, 'Invalid fuel type.');
  }
  if (typeof body.ownershipType !== 'string' || !OWNERSHIP_TYPES.has(body.ownershipType)) {
    return bad(res, 'Invalid ownership type.');
  }
  if (typeof body.capacity !== 'number' || body.capacity < 0) {
    return bad(res, 'capacity must be a non-negative number.');
  }
  if (body.status && !STATUSES.has(body.status)) return bad(res, 'Invalid status.');
  if (body.branchId && (typeof body.branchId !== 'string' || !SAFE_ID.test(body.branchId))) {
    return bad(res, 'Invalid branchId.');
  }
  req.body = {
    registrationNumber: String(body.registrationNumber).trim().toUpperCase(),
    vehicleType: body.vehicleType,
    make: String(body.make).trim(),
    model: String(body.model).trim(),
    variant: typeof body.variant === 'string' ? body.variant.trim() : undefined,
    manufacturingYear: body.manufacturingYear,
    fuelType: body.fuelType,
    ownershipType: body.ownershipType,
    ownerReference: typeof body.ownerReference === 'string' ? body.ownerReference.trim() : undefined,
    capacity: body.capacity,
    capacityUnit: typeof body.capacityUnit === 'string' ? body.capacityUnit.trim().toUpperCase() : 'TON',
    branchId: body.branchId,
    status: body.status,
    insuranceReference: typeof body.insuranceReference === 'string' ? body.insuranceReference.trim() : undefined,
    fitnessReference: typeof body.fitnessReference === 'string' ? body.fitnessReference.trim() : undefined,
    permitReference: typeof body.permitReference === 'string' ? body.permitReference.trim() : undefined
  };
  next();
}

export function validatePatchVehicleBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  if (body.tenantId !== undefined || body.tenant_id !== undefined) {
    return bad(res, 'tenantId must not be supplied by clients; it is derived from authentication.');
  }
  if (body.registrationNumber !== undefined) {
    if (typeof body.registrationNumber !== 'string' || !REGISTRATION.test(body.registrationNumber.trim().toUpperCase())) {
      return bad(res, 'registrationNumber is invalid.');
    }
    body.registrationNumber = body.registrationNumber.trim().toUpperCase();
  }
  if (body.vehicleType !== undefined && !VEHICLE_TYPES.has(body.vehicleType)) return bad(res, 'Invalid vehicle type.');
  if (body.fuelType !== undefined && !FUEL_TYPES.has(body.fuelType)) return bad(res, 'Invalid fuel type.');
  if (body.ownershipType !== undefined && !OWNERSHIP_TYPES.has(body.ownershipType)) return bad(res, 'Invalid ownership type.');
  if (body.status !== undefined && !STATUSES.has(body.status)) return bad(res, 'Invalid status.');
  if (body.capacity !== undefined && (typeof body.capacity !== 'number' || body.capacity < 0)) {
    return bad(res, 'capacity must be a non-negative number.');
  }
  if (body.manufacturingYear !== undefined) {
    if (typeof body.manufacturingYear !== 'number' || body.manufacturingYear < 1980 || body.manufacturingYear > 2100) {
      return bad(res, 'manufacturingYear must be between 1980 and 2100.');
    }
  }
  next();
}

const DRIVER_STATUSES = new Set(['ACTIVE', 'INACTIVE', 'SUSPENDED']);
const LICENSE_CLASSES = new Set(['LMV', 'HMV', 'HGMV', 'TRANS', 'OTHER']);
const LICENSE_NO = /^[A-Z0-9-]{4,64}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const BADGE = /^[A-Z0-9._-]{2,64}$/;

function parseOptionalId(value: unknown, field: string): { ok: true; value?: string } | { ok: false; message: string } {
  if (value === undefined || value === null || value === '') return { ok: true, value: undefined };
  if (typeof value !== 'string' || !SAFE_ID.test(value)) return { ok: false, message: `${field} is invalid.` };
  return { ok: true, value };
}

export function validateCreateDriverBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  const nameErr = requireName(body.fullName, 'fullName');
  if (nameErr) return bad(res, nameErr);
  if (typeof body.licenseNumber !== 'string' || !LICENSE_NO.test(body.licenseNumber.trim().toUpperCase())) {
    return bad(res, 'licenseNumber is required (4-64 letters, numbers, or hyphens).');
  }
  if (typeof body.licenseClass !== 'string' || !LICENSE_CLASSES.has(body.licenseClass)) {
    return bad(res, 'Invalid license class.');
  }
  if (body.licenseIssueDate && (typeof body.licenseIssueDate !== 'string' || !DATE.test(body.licenseIssueDate))) {
    return bad(res, 'licenseIssueDate must be YYYY-MM-DD.');
  }
  if (body.licenseExpiryDate && (typeof body.licenseExpiryDate !== 'string' || !DATE.test(body.licenseExpiryDate))) {
    return bad(res, 'licenseExpiryDate must be YYYY-MM-DD.');
  }
  if (body.licenseIssueDate && body.licenseExpiryDate && body.licenseExpiryDate < body.licenseIssueDate) {
    return bad(res, 'licenseExpiryDate must be on or after licenseIssueDate.');
  }
  if (body.status && !DRIVER_STATUSES.has(body.status)) return bad(res, 'Invalid status.');
  if (body.badgeCode && (typeof body.badgeCode !== 'string' || !BADGE.test(body.badgeCode.trim().toUpperCase()))) {
    return bad(res, 'badgeCode is invalid.');
  }
  const employeeId = parseOptionalId(body.employeeId, 'employeeId');
  if (!employeeId.ok) return bad(res, employeeId.message);
  const assignedVehicleId = parseOptionalId(body.assignedVehicleId, 'assignedVehicleId');
  if (!assignedVehicleId.ok) return bad(res, assignedVehicleId.message);
  if (body.phone && (typeof body.phone !== 'string' || body.phone.trim().length < 6 || body.phone.trim().length > 32)) {
    return bad(res, 'phone must be between 6 and 32 characters when provided.');
  }
  req.body = {
    fullName: String(body.fullName).trim(),
    phone: typeof body.phone === 'string' ? body.phone.trim() : undefined,
    licenseNumber: String(body.licenseNumber).trim().toUpperCase(),
    licenseClass: body.licenseClass,
    licenseIssueDate: body.licenseIssueDate,
    licenseExpiryDate: body.licenseExpiryDate,
    badgeCode: typeof body.badgeCode === 'string' ? body.badgeCode.trim().toUpperCase() : undefined,
    branchId: body.branchId,
    status: body.status,
    employeeId: employeeId.value,
    assignedVehicleId: assignedVehicleId.value,
    notes: typeof body.notes === 'string' ? body.notes.trim() : undefined
  };
  next();
}

export function validatePatchDriverBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  if (body.tenantId !== undefined || body.tenant_id !== undefined) {
    return bad(res, 'tenantId must not be supplied by clients; it is derived from authentication.');
  }
  if (body.fullName !== undefined) {
    const nameErr = requireName(body.fullName, 'fullName');
    if (nameErr) return bad(res, nameErr);
  }
  if (body.licenseNumber !== undefined) {
    if (typeof body.licenseNumber !== 'string' || !LICENSE_NO.test(body.licenseNumber.trim().toUpperCase())) {
      return bad(res, 'licenseNumber is invalid.');
    }
    body.licenseNumber = body.licenseNumber.trim().toUpperCase();
  }
  if (body.licenseClass !== undefined && !LICENSE_CLASSES.has(body.licenseClass)) return bad(res, 'Invalid license class.');
  if (body.status !== undefined && !DRIVER_STATUSES.has(body.status)) return bad(res, 'Invalid status.');
  if (body.licenseIssueDate !== undefined && body.licenseIssueDate !== null && body.licenseIssueDate !== '') {
    if (typeof body.licenseIssueDate !== 'string' || !DATE.test(body.licenseIssueDate)) {
      return bad(res, 'licenseIssueDate must be YYYY-MM-DD.');
    }
  }
  if (body.licenseExpiryDate !== undefined && body.licenseExpiryDate !== null && body.licenseExpiryDate !== '') {
    if (typeof body.licenseExpiryDate !== 'string' || !DATE.test(body.licenseExpiryDate)) {
      return bad(res, 'licenseExpiryDate must be YYYY-MM-DD.');
    }
  }
  if (body.licenseIssueDate && body.licenseExpiryDate && body.licenseExpiryDate < body.licenseIssueDate) {
    return bad(res, 'licenseExpiryDate must be on or after licenseIssueDate.');
  }
  if (body.employeeId !== undefined && body.employeeId !== null && body.employeeId !== '') {
    if (typeof body.employeeId !== 'string' || !SAFE_ID.test(body.employeeId)) return bad(res, 'Invalid employeeId.');
  }
  if (body.assignedVehicleId !== undefined && body.assignedVehicleId !== null && body.assignedVehicleId !== '') {
    if (typeof body.assignedVehicleId !== 'string' || !SAFE_ID.test(body.assignedVehicleId)) {
      return bad(res, 'Invalid assignedVehicleId.');
    }
  }
  next();
}
