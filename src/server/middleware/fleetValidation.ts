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

function parseOptionalId(value: unknown, field: string): { error?: string; value?: string } {
  if (value === undefined || value === null || value === '') return { value: undefined };
  if (typeof value !== 'string' || !SAFE_ID.test(value)) return { error: `${field} is invalid.` };
  return { value };
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
  if (employeeId.error) return bad(res, employeeId.error);
  const assignedVehicleId = parseOptionalId(body.assignedVehicleId, 'assignedVehicleId');
  if (assignedVehicleId.error) return bad(res, assignedVehicleId.error);
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

const DOCUMENT_TYPES = new Set(['INSURANCE', 'FITNESS', 'PERMIT', 'REGISTRATION', 'POLLUTION', 'TAX', 'OTHER']);
const DOC_NUMBER = /^[A-Z0-9._/-]{2,128}$/;
const MAINTENANCE_STATUSES = new Set(['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']);
const OPERATION_STATUSES = new Set(['PLANNED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']);
const OPERATION_NUMBER = /^[A-Z0-9-]{4,64}$/;
const FUEL_UNITS = new Set(['LITER', 'GALLON', 'KG', 'KWH']);

export function validateCreateVehicleDocumentBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  const vehicleId = parseOptionalId(body.vehicleId, 'vehicleId');
  if (vehicleId.error || !vehicleId.value) return bad(res, vehicleId.error || 'vehicleId is required.');
  if (typeof body.documentType !== 'string' || !DOCUMENT_TYPES.has(body.documentType)) {
    return bad(res, 'Invalid document type.');
  }
  if (body.documentNumber && (typeof body.documentNumber !== 'string' || !DOC_NUMBER.test(body.documentNumber.trim().toUpperCase()))) {
    return bad(res, 'documentNumber is invalid.');
  }
  if (body.issueDate && (typeof body.issueDate !== 'string' || !DATE.test(body.issueDate))) {
    return bad(res, 'issueDate must be YYYY-MM-DD.');
  }
  if (body.expiryDate && (typeof body.expiryDate !== 'string' || !DATE.test(body.expiryDate))) {
    return bad(res, 'expiryDate must be YYYY-MM-DD.');
  }
  if (body.issueDate && body.expiryDate && body.expiryDate < body.issueDate) {
    return bad(res, 'expiryDate must be on or after issueDate.');
  }
  if (body.storageKey && (typeof body.storageKey !== 'string' || body.storageKey.length > 512)) {
    return bad(res, 'storageKey is invalid.');
  }
  req.body = {
    vehicleId: vehicleId.value,
    documentType: body.documentType,
    documentNumber: typeof body.documentNumber === 'string' ? body.documentNumber.trim().toUpperCase() : undefined,
    issueDate: body.issueDate,
    expiryDate: body.expiryDate,
    issuingAuthority: typeof body.issuingAuthority === 'string' ? body.issuingAuthority.trim() : undefined,
    storageKey: typeof body.storageKey === 'string' ? body.storageKey.trim() : undefined,
    fileName: typeof body.fileName === 'string' ? body.fileName.trim() : undefined,
    notes: typeof body.notes === 'string' ? body.notes.trim() : undefined
  };
  next();
}

export function validatePatchVehicleDocumentBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  if (body.tenantId !== undefined || body.tenant_id !== undefined) {
    return bad(res, 'tenantId must not be supplied by clients; it is derived from authentication.');
  }
  if (body.documentType !== undefined && !DOCUMENT_TYPES.has(body.documentType)) return bad(res, 'Invalid document type.');
  if (body.documentNumber !== undefined && body.documentNumber !== null && body.documentNumber !== '') {
    if (typeof body.documentNumber !== 'string' || !DOC_NUMBER.test(body.documentNumber.trim().toUpperCase())) {
      return bad(res, 'documentNumber is invalid.');
    }
    body.documentNumber = body.documentNumber.trim().toUpperCase();
  }
  if (body.issueDate !== undefined && body.issueDate !== null && body.issueDate !== '') {
    if (typeof body.issueDate !== 'string' || !DATE.test(body.issueDate)) return bad(res, 'issueDate must be YYYY-MM-DD.');
  }
  if (body.expiryDate !== undefined && body.expiryDate !== null && body.expiryDate !== '') {
    if (typeof body.expiryDate !== 'string' || !DATE.test(body.expiryDate)) return bad(res, 'expiryDate must be YYYY-MM-DD.');
  }
  if (body.issueDate && body.expiryDate && body.expiryDate < body.issueDate) {
    return bad(res, 'expiryDate must be on or after issueDate.');
  }
  next();
}

export function validateCreateMaintenanceBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  const vehicleId = parseOptionalId(body.vehicleId, 'vehicleId');
  if (vehicleId.error || !vehicleId.value) return bad(res, vehicleId.error || 'vehicleId is required.');
  const typeErr = requireName(body.maintenanceType, 'maintenanceType');
  if (typeErr) return bad(res, typeErr);
  if (typeof body.serviceDate !== 'string' || !DATE.test(body.serviceDate)) {
    return bad(res, 'serviceDate must be YYYY-MM-DD.');
  }
  if (typeof body.cost !== 'number' || body.cost < 0) return bad(res, 'cost must be a non-negative number.');
  if (body.odometerReading !== undefined && (typeof body.odometerReading !== 'number' || body.odometerReading < 0)) {
    return bad(res, 'odometerReading must be a non-negative number.');
  }
  if (body.status && !MAINTENANCE_STATUSES.has(body.status)) return bad(res, 'Invalid status.');
  if (body.nextServiceDate && (typeof body.nextServiceDate !== 'string' || !DATE.test(body.nextServiceDate))) {
    return bad(res, 'nextServiceDate must be YYYY-MM-DD.');
  }
  if (body.nextServiceDate && body.nextServiceDate < body.serviceDate) {
    return bad(res, 'nextServiceDate must be on or after serviceDate.');
  }
  req.body = {
    vehicleId: vehicleId.value,
    maintenanceType: String(body.maintenanceType).trim(),
    serviceDate: body.serviceDate,
    odometerReading: body.odometerReading,
    workshopName: typeof body.workshopName === 'string' ? body.workshopName.trim() : undefined,
    description: typeof body.description === 'string' ? body.description.trim() : undefined,
    partsDetails: typeof body.partsDetails === 'string' ? body.partsDetails.trim() : undefined,
    cost: body.cost,
    nextServiceDate: body.nextServiceDate,
    nextServiceOdometer: body.nextServiceOdometer,
    status: body.status,
    notes: typeof body.notes === 'string' ? body.notes.trim() : undefined
  };
  next();
}

export function validatePatchMaintenanceBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  if (body.tenantId !== undefined || body.tenant_id !== undefined) {
    return bad(res, 'tenantId must not be supplied by clients; it is derived from authentication.');
  }
  if (body.maintenanceType !== undefined) {
    const typeErr = requireName(body.maintenanceType, 'maintenanceType');
    if (typeErr) return bad(res, typeErr);
  }
  if (body.serviceDate !== undefined && (typeof body.serviceDate !== 'string' || !DATE.test(body.serviceDate))) {
    return bad(res, 'serviceDate must be YYYY-MM-DD.');
  }
  if (body.cost !== undefined && (typeof body.cost !== 'number' || body.cost < 0)) return bad(res, 'cost must be non-negative.');
  if (body.status !== undefined && !MAINTENANCE_STATUSES.has(body.status)) return bad(res, 'Invalid status.');
  next();
}

export function validateCreateFuelBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  const vehicleId = parseOptionalId(body.vehicleId, 'vehicleId');
  if (vehicleId.error || !vehicleId.value) return bad(res, vehicleId.error || 'vehicleId is required.');
  const fuelTypes = new Set([...FUEL_TYPES, 'OTHER']);
  if (typeof body.fuelType !== 'string' || !fuelTypes.has(body.fuelType)) return bad(res, 'Invalid fuel type.');
  if (typeof body.quantity !== 'number' || body.quantity <= 0) return bad(res, 'quantity must be greater than zero.');
  if (typeof body.rate !== 'number' || body.rate < 0) return bad(res, 'rate must be a non-negative number.');
  if (body.unit && !FUEL_UNITS.has(String(body.unit).toUpperCase())) return bad(res, 'Invalid fuel unit.');
  if (body.odometerReading !== undefined && (typeof body.odometerReading !== 'number' || body.odometerReading < 0)) {
    return bad(res, 'odometerReading must be a non-negative number.');
  }
  if (body.totalAmount !== undefined) {
    return bad(res, 'totalAmount is calculated server-side and must not be supplied by clients.');
  }
  req.body = {
    vehicleId: vehicleId.value,
    fuelDate: typeof body.fuelDate === 'string' ? body.fuelDate : undefined,
    fuelType: body.fuelType,
    quantity: body.quantity,
    unit: typeof body.unit === 'string' ? body.unit.trim().toUpperCase() : 'LITER',
    rate: body.rate,
    odometerReading: body.odometerReading,
    stationName: typeof body.stationName === 'string' ? body.stationName.trim() : undefined,
    referenceNumber: typeof body.referenceNumber === 'string' ? body.referenceNumber.trim().toUpperCase() : undefined,
    notes: typeof body.notes === 'string' ? body.notes.trim() : undefined
  };
  next();
}

export function validatePatchFuelBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  if (body.tenantId !== undefined || body.tenant_id !== undefined || body.totalAmount !== undefined) {
    return bad(res, 'tenantId and totalAmount must not be supplied by clients.');
  }
  const fuelTypes = new Set([...FUEL_TYPES, 'OTHER']);
  if (body.fuelType !== undefined && !fuelTypes.has(body.fuelType)) return bad(res, 'Invalid fuel type.');
  if (body.quantity !== undefined && (typeof body.quantity !== 'number' || body.quantity <= 0)) {
    return bad(res, 'quantity must be greater than zero.');
  }
  if (body.rate !== undefined && (typeof body.rate !== 'number' || body.rate < 0)) return bad(res, 'rate must be non-negative.');
  next();
}

export function validateCreateOperationBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  if (typeof body.operationNumber !== 'string' || !OPERATION_NUMBER.test(body.operationNumber.trim().toUpperCase())) {
    return bad(res, 'operationNumber is required (4-64 letters, numbers, or hyphens).');
  }
  const vehicleId = parseOptionalId(body.vehicleId, 'vehicleId');
  if (vehicleId.error || !vehicleId.value) return bad(res, vehicleId.error || 'vehicleId is required.');
  const driverId = parseOptionalId(body.driverId, 'driverId');
  if (driverId.error || !driverId.value) return bad(res, driverId.error || 'driverId is required.');
  const gatePassId = parseOptionalId(body.gatePassId, 'gatePassId');
  if (gatePassId.error) return bad(res, gatePassId.error);
  const dispatchId = parseOptionalId(body.dispatchId, 'dispatchId');
  if (dispatchId.error) return bad(res, dispatchId.error);
  if (body.status && !OPERATION_STATUSES.has(body.status)) return bad(res, 'Invalid status.');
  if (body.odometerStart !== undefined && (typeof body.odometerStart !== 'number' || body.odometerStart < 0)) {
    return bad(res, 'odometerStart must be a non-negative number.');
  }
  req.body = {
    operationNumber: body.operationNumber.trim().toUpperCase(),
    vehicleId: vehicleId.value,
    driverId: driverId.value,
    gatePassId: gatePassId.value,
    dispatchId: dispatchId.value,
    destination: typeof body.destination === 'string' ? body.destination.trim() : undefined,
    plannedStartAt: typeof body.plannedStartAt === 'string' ? body.plannedStartAt : undefined,
    plannedEndAt: typeof body.plannedEndAt === 'string' ? body.plannedEndAt : undefined,
    odometerStart: body.odometerStart,
    status: body.status,
    notes: typeof body.notes === 'string' ? body.notes.trim() : undefined
  };
  next();
}

export function validatePatchOperationBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  if (body.tenantId !== undefined || body.tenant_id !== undefined) {
    return bad(res, 'tenantId must not be supplied by clients; it is derived from authentication.');
  }
  if (body.status !== undefined && !OPERATION_STATUSES.has(body.status)) return bad(res, 'Invalid status.');
  if (body.vehicleId !== undefined) {
    const vehicleId = parseOptionalId(body.vehicleId, 'vehicleId');
    if (vehicleId.error) return bad(res, vehicleId.error);
  }
  if (body.driverId !== undefined) {
    const driverId = parseOptionalId(body.driverId, 'driverId');
    if (driverId.error) return bad(res, driverId.error);
  }
  next();
}
