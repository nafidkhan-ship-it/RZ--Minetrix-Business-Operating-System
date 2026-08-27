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
