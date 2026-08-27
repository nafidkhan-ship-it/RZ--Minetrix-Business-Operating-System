import { Response, NextFunction } from 'express';
import { CustomRequest } from './authMiddleware.js';

const SAFE_ID = /^[a-zA-Z0-9._-]{1,128}$/;
const CODE = /^[A-Z0-9._-]{2,64}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const UOMS = new Set(['TON', 'CFT', 'PIECE', 'BAG']);

function bad(res: Response, message: string) {
  return res.status(400).json({ success: false, error: 'BAD_REQUEST', message });
}

function requireCode(value: unknown, field: string): string | null {
  if (typeof value !== 'string' || !CODE.test(value.trim().toUpperCase())) return `${field} must be 2-64 characters (letters, numbers, dot, underscore, hyphen).`;
  return null;
}

function requireName(value: unknown, field = 'name'): string | null {
  if (typeof value !== 'string' || value.trim().length < 2 || value.trim().length > 255) return `${field} must be between 2 and 255 characters.`;
  return null;
}

function requirePositiveNumber(value: unknown, field: string): string | null {
  if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) return `${field} must be a number greater than zero.`;
  return null;
}

function requireLines(value: unknown): string | null {
  if (!Array.isArray(value) || value.length === 0) return 'lines must be a non-empty array.';
  for (const line of value) {
    if (!line || typeof line !== 'object') return 'Each line must be an object.';
    if (typeof line.productId !== 'string' || !SAFE_ID.test(line.productId)) return 'Each line requires a valid productId.';
    if (typeof line.quantity !== 'number' || line.quantity <= 0) return 'Each line quantity must be greater than zero.';
    if (line.productSizeId && (typeof line.productSizeId !== 'string' || !SAFE_ID.test(line.productSizeId))) return 'Invalid productSizeId.';
    if (line.locationId && (typeof line.locationId !== 'string' || !SAFE_ID.test(line.locationId))) return 'Invalid locationId.';
    if (line.quantityUom && (typeof line.quantityUom !== 'string' || !UOMS.has(line.quantityUom))) return 'Invalid quantityUom.';
  }
  return null;
}

export function validateCreateProductBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  const codeErr = requireCode(body.code, 'code');
  if (codeErr) return bad(res, codeErr);
  const nameErr = requireName(body.name);
  if (nameErr) return bad(res, nameErr);
  if (typeof body.category !== 'string' || body.category.trim().length < 2) return bad(res, 'category is required.');
  if (body.defaultUom && !UOMS.has(body.defaultUom)) return bad(res, 'defaultUom must be TON, CFT, PIECE, or BAG.');
  if (body.gstPercent !== undefined && (typeof body.gstPercent !== 'number' || body.gstPercent < 0 || body.gstPercent > 100)) {
    return bad(res, 'gstPercent must be between 0 and 100.');
  }
  req.body = {
    code: String(body.code).trim().toUpperCase(),
    name: String(body.name).trim(),
    category: String(body.category).trim(),
    defaultUom: body.defaultUom,
    densityTonPerCft: body.densityTonPerCft,
    gstPercent: body.gstPercent
  };
  next();
}

export function validateCreateProductSizeBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  const codeErr = requireCode(body.sizeCode, 'sizeCode');
  if (codeErr) return bad(res, codeErr);
  const nameErr = requireName(body.sizeLabel, 'sizeLabel');
  if (nameErr) return bad(res, nameErr);
  req.body = {
    sizeCode: String(body.sizeCode).trim().toUpperCase(),
    sizeLabel: String(body.sizeLabel).trim(),
    dimensions: typeof body.dimensions === 'string' ? body.dimensions.trim() : undefined
  };
  next();
}

export function validateCreatePriceBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  if (typeof body.productId !== 'string' || !SAFE_ID.test(body.productId)) return bad(res, 'Invalid productId.');
  if (typeof body.unitPrice !== 'number' || body.unitPrice < 0) return bad(res, 'unitPrice must be a non-negative number.');
  if (typeof body.effectiveFrom !== 'string' || !DATE.test(body.effectiveFrom)) return bad(res, 'effectiveFrom must be YYYY-MM-DD.');
  req.body = {
    productId: body.productId,
    productSizeId: body.productSizeId,
    quarryId: body.quarryId,
    unitPrice: body.unitPrice,
    currency: body.currency,
    priceIncludesGst: body.priceIncludesGst === true,
    effectiveFrom: body.effectiveFrom,
    effectiveTo: body.effectiveTo
  };
  next();
}

export function validateCreateParcelBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  if (typeof body.surveyNumber !== 'string' || body.surveyNumber.trim().length < 2) return bad(res, 'surveyNumber is required.');
  const nameErr = requireName(body.ownerName, 'ownerName');
  if (nameErr) return bad(res, nameErr);
  req.body = {
    surveyNumber: String(body.surveyNumber).trim(),
    villageTaluk: typeof body.villageTaluk === 'string' ? body.villageTaluk.trim() : undefined,
    acreage: typeof body.acreage === 'number' ? body.acreage : undefined,
    ownerName: String(body.ownerName).trim()
  };
  next();
}

export function validateCreateLeaseBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  if (typeof body.landParcelId !== 'string' || !SAFE_ID.test(body.landParcelId)) return bad(res, 'Invalid landParcelId.');
  const numErr = requireCode(body.leaseNumber, 'leaseNumber');
  if (numErr) return bad(res, numErr);
  if (typeof body.royaltyType !== 'string' || body.royaltyType.trim().length < 2) return bad(res, 'royaltyType is required.');
  if (typeof body.startDate !== 'string' || !DATE.test(body.startDate)) return bad(res, 'startDate must be YYYY-MM-DD.');
  if (typeof body.endDate !== 'string' || !DATE.test(body.endDate)) return bad(res, 'endDate must be YYYY-MM-DD.');
  req.body = {
    landParcelId: body.landParcelId,
    quarryId: body.quarryId,
    leaseNumber: String(body.leaseNumber).trim().toUpperCase(),
    royaltyType: String(body.royaltyType).trim(),
    royaltyRate: body.royaltyRate,
    revenueSharePercent: body.revenueSharePercent,
    startDate: body.startDate,
    endDate: body.endDate
  };
  next();
}

export function validateCreateLocationBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  const nameErr = requireName(body.name);
  if (nameErr) return bad(res, nameErr);
  req.body = {
    name: String(body.name).trim(),
    locationType: body.locationType
  };
  next();
}

export function validateCreateCustomerBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  const codeErr = requireCode(body.code, 'code');
  if (codeErr) return bad(res, codeErr);
  const nameErr = requireName(body.name);
  if (nameErr) return bad(res, nameErr);
  req.body = {
    code: String(body.code).trim().toUpperCase(),
    name: String(body.name).trim(),
    destination: typeof body.destination === 'string' ? body.destination.trim() : undefined,
    phone: typeof body.phone === 'string' ? body.phone.trim() : undefined,
    email: typeof body.email === 'string' ? body.email.trim() : undefined
  };
  next();
}

export function validateCreateProductionBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  if (typeof body.quarryId !== 'string' || !SAFE_ID.test(body.quarryId)) return bad(res, 'Invalid quarryId.');
  const numErr = requireCode(body.batchNumber, 'batchNumber');
  if (numErr) return bad(res, numErr);
  if (typeof body.productionDate !== 'string' || !DATE.test(body.productionDate)) return bad(res, 'productionDate must be YYYY-MM-DD.');
  const lineErr = requireLines(body.lines);
  if (lineErr) return bad(res, lineErr);
  req.body = {
    quarryId: body.quarryId,
    batchNumber: String(body.batchNumber).trim().toUpperCase(),
    productionDate: body.productionDate,
    shiftName: typeof body.shiftName === 'string' ? body.shiftName.trim() : undefined,
    operatorUserId: body.operatorUserId,
    quantityUom: body.quantityUom,
    details: body.details && typeof body.details === 'object' ? body.details : undefined,
    lines: body.lines,
    postImmediately: body.postImmediately === true
  };
  next();
}

export function validateCreateGatePassBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  const numErr = requireCode(body.gatePassNumber, 'gatePassNumber');
  if (numErr) return bad(res, numErr);
  if (typeof body.quarryId !== 'string' || !SAFE_ID.test(body.quarryId)) return bad(res, 'Invalid quarryId.');
  if (typeof body.customerId !== 'string' || !SAFE_ID.test(body.customerId)) return bad(res, 'Invalid customerId.');
  if (typeof body.vehicleNumber !== 'string' || body.vehicleNumber.trim().length < 2) return bad(res, 'vehicleNumber is required.');
  const driverErr = requireName(body.driverName, 'driverName');
  if (driverErr) return bad(res, driverErr);
  const lineErr = requireLines(body.lines);
  if (lineErr) return bad(res, lineErr);
  req.body = {
    gatePassNumber: String(body.gatePassNumber).trim().toUpperCase(),
    quarryId: body.quarryId,
    customerId: body.customerId,
    vehicleNumber: String(body.vehicleNumber).trim().toUpperCase(),
    driverName: String(body.driverName).trim(),
    destination: typeof body.destination === 'string' ? body.destination.trim() : undefined,
    notes: typeof body.notes === 'string' ? body.notes.trim() : undefined,
    lines: body.lines
  };
  next();
}

export function validateCreateDispatchBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  const numErr = requireCode(body.dispatchNumber, 'dispatchNumber');
  if (numErr) return bad(res, numErr);
  if (typeof body.gatePassId !== 'string' || !SAFE_ID.test(body.gatePassId)) return bad(res, 'Invalid gatePassId.');
  req.body = {
    dispatchNumber: String(body.dispatchNumber).trim().toUpperCase(),
    gatePassId: body.gatePassId,
    idempotencyKey: typeof body.idempotencyKey === 'string' ? body.idempotencyKey.trim() : undefined
  };
  next();
}

export function validateCreateSettlementRateBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  if (typeof body.landParcelId !== 'string' || !SAFE_ID.test(body.landParcelId)) return bad(res, 'Invalid landParcelId.');
  if (typeof body.ratePerUom !== 'number' || body.ratePerUom < 0) return bad(res, 'ratePerUom must be a non-negative number.');
  if (typeof body.effectiveFrom !== 'string' || !DATE.test(body.effectiveFrom)) return bad(res, 'effectiveFrom must be YYYY-MM-DD.');
  req.body = {
    landParcelId: body.landParcelId,
    quarryId: body.quarryId,
    productId: body.productId,
    ratePerUom: body.ratePerUom,
    quantityUom: body.quantityUom,
    effectiveFrom: body.effectiveFrom,
    effectiveTo: body.effectiveTo
  };
  next();
}

export function validateCreateSettlementBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  const numErr = requireCode(body.settlementNumber, 'settlementNumber');
  if (numErr) return bad(res, numErr);
  if (typeof body.landParcelId !== 'string' || !SAFE_ID.test(body.landParcelId)) return bad(res, 'Invalid landParcelId.');
  if (typeof body.quarryId !== 'string' || !SAFE_ID.test(body.quarryId)) return bad(res, 'Invalid quarryId.');
  if (body.basis !== 'PRODUCTION' && body.basis !== 'DISPATCH') return bad(res, 'basis must be PRODUCTION or DISPATCH.');
  if (body.deductions !== undefined && (typeof body.deductions !== 'number' || body.deductions < 0)) {
    return bad(res, 'deductions must be a non-negative number.');
  }
  req.body = {
    settlementNumber: String(body.settlementNumber).trim().toUpperCase(),
    landParcelId: body.landParcelId,
    quarryId: body.quarryId,
    basis: body.basis,
    quantity: body.quantity,
    productionBatchId: body.productionBatchId,
    dispatchId: body.dispatchId,
    deductions: body.deductions,
    statementRef: typeof body.statementRef === 'string' ? body.statementRef.trim() : undefined
  };
  next();
}

export function validateAdjustmentBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  if (typeof body.quarryId !== 'string' || !SAFE_ID.test(body.quarryId)) return bad(res, 'Invalid quarryId.');
  if (typeof body.productId !== 'string' || !SAFE_ID.test(body.productId)) return bad(res, 'Invalid productId.');
  const qtyErr = requirePositiveNumber(body.quantity, 'quantity');
  if (qtyErr) return bad(res, qtyErr);
  req.body = {
    quarryId: body.quarryId,
    productId: body.productId,
    productSizeId: body.productSizeId,
    locationId: body.locationId,
    quantity: body.quantity,
    quantityUom: body.quantityUom,
    notes: typeof body.notes === 'string' ? body.notes.trim() : undefined
  };
  next();
}

export function validateCreateContactBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  if (typeof body.customerId !== 'string' || !SAFE_ID.test(body.customerId)) return bad(res, 'Invalid customerId.');
  const nameErr = requireName(body.fullName, 'fullName');
  if (nameErr) return bad(res, nameErr);
  req.body = {
    customerId: body.customerId,
    fullName: String(body.fullName).trim(),
    roleTitle: typeof body.roleTitle === 'string' ? body.roleTitle.trim() : undefined,
    phone: typeof body.phone === 'string' ? body.phone.trim() : undefined,
    email: typeof body.email === 'string' ? body.email.trim() : undefined
  };
  next();
}

export function validateCreateLeadBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  const codeErr = requireCode(body.code, 'code');
  if (codeErr) return bad(res, codeErr);
  const nameErr = requireName(body.companyName, 'companyName');
  if (nameErr) return bad(res, nameErr);
  req.body = {
    code: String(body.code).trim().toUpperCase(),
    companyName: String(body.companyName).trim(),
    contactName: typeof body.contactName === 'string' ? body.contactName.trim() : undefined,
    phone: typeof body.phone === 'string' ? body.phone.trim() : undefined,
    email: typeof body.email === 'string' ? body.email.trim() : undefined,
    source: typeof body.source === 'string' ? body.source.trim() : undefined,
    notes: typeof body.notes === 'string' ? body.notes.trim() : undefined
  };
  next();
}

export function validateCreateOrderBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  const numErr = requireCode(body.orderNumber, 'orderNumber');
  if (numErr) return bad(res, numErr);
  if (typeof body.customerId !== 'string' || !SAFE_ID.test(body.customerId)) return bad(res, 'Invalid customerId.');
  if (typeof body.quarryId !== 'string' || !SAFE_ID.test(body.quarryId)) return bad(res, 'Invalid quarryId.');
  if (!Array.isArray(body.lines) || body.lines.length === 0) return bad(res, 'lines must be a non-empty array.');
  for (const line of body.lines) {
    if (!line || typeof line !== 'object') return bad(res, 'Each line must be an object.');
    if (typeof line.productId !== 'string' || !SAFE_ID.test(line.productId)) return bad(res, 'Each line requires a valid productId.');
    if (typeof line.quantity !== 'number' || line.quantity <= 0) return bad(res, 'Each line quantity must be greater than zero.');
    if (typeof line.unitPrice !== 'number' || line.unitPrice < 0) return bad(res, 'Each line unitPrice must be a non-negative number.');
    if (line.quantityUom && (typeof line.quantityUom !== 'string' || !UOMS.has(line.quantityUom))) return bad(res, 'Invalid quantityUom.');
  }
  if (body.taxAmount !== undefined && (typeof body.taxAmount !== 'number' || body.taxAmount < 0)) {
    return bad(res, 'taxAmount must be a non-negative number.');
  }
  req.body = {
    orderNumber: String(body.orderNumber).trim().toUpperCase(),
    customerId: body.customerId,
    quarryId: body.quarryId,
    notes: typeof body.notes === 'string' ? body.notes.trim() : undefined,
    taxAmount: body.taxAmount,
    lines: body.lines
  };
  next();
}

export function validateCreateOrderGatePassBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  const numErr = requireCode(body.gatePassNumber, 'gatePassNumber');
  if (numErr) return bad(res, numErr);
  if (typeof body.vehicleNumber !== 'string' || body.vehicleNumber.trim().length < 2) return bad(res, 'vehicleNumber is required.');
  const driverErr = requireName(body.driverName, 'driverName');
  if (driverErr) return bad(res, driverErr);
  req.body = {
    gatePassNumber: String(body.gatePassNumber).trim().toUpperCase(),
    vehicleNumber: String(body.vehicleNumber).trim().toUpperCase(),
    driverName: String(body.driverName).trim(),
    destination: typeof body.destination === 'string' ? body.destination.trim() : undefined
  };
  next();
}
