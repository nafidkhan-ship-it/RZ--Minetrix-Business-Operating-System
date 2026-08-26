import { Response, NextFunction } from 'express';
import { CustomRequest } from './authMiddleware.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SAFE_ID_PATTERN = /^[a-zA-Z0-9._-]{1,128}$/;

export function validateLoginBody(req: CustomRequest, res: Response, next: NextFunction) {
  const { email, password } = req.body || {};

  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'BAD_REQUEST',
      message: 'Email and password must be strings.'
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!EMAIL_PATTERN.test(normalizedEmail) || normalizedEmail.length > 255) {
    return res.status(400).json({
      success: false,
      error: 'BAD_REQUEST',
      message: 'A valid email address is required.'
    });
  }

  if (password.length < 8 || password.length > 256) {
    return res.status(400).json({
      success: false,
      error: 'BAD_REQUEST',
      message: 'Password must be between 8 and 256 characters.'
    });
  }

  req.body.email = normalizedEmail;
  next();
}

export function validateResourceIdParam(paramName: string = 'id') {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    const value = req.params[paramName];
    if (!value || !SAFE_ID_PATTERN.test(value)) {
      return res.status(400).json({
        success: false,
        error: 'BAD_REQUEST',
        message: `Invalid ${paramName} parameter.`
      });
    }
    next();
  };
}

export function validateOptionalQueryId(paramName: string) {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    const value = req.query[paramName];
    if (value === undefined || value === '') {
      return next();
    }
    if (typeof value !== 'string' || !SAFE_ID_PATTERN.test(value)) {
      return res.status(400).json({
        success: false,
        error: 'BAD_REQUEST',
        message: `Invalid query parameter: ${paramName}.`
      });
    }
    next();
  };
}

export function validatePaginationQuery(maxLimit = 100) {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    const { limit, offset } = req.query;
    if (limit !== undefined) {
      const parsed = Number(limit);
      if (!Number.isInteger(parsed) || parsed < 1 || parsed > maxLimit) {
        return res.status(400).json({
          success: false,
          error: 'BAD_REQUEST',
          message: `limit must be an integer between 1 and ${maxLimit}.`
        });
      }
    }
    if (offset !== undefined) {
      const parsed = Number(offset);
      if (!Number.isInteger(parsed) || parsed < 0) {
        return res.status(400).json({
          success: false,
          error: 'BAD_REQUEST',
          message: 'offset must be a non-negative integer.'
        });
      }
    }
    next();
  };
}

export function rejectClientTenantId(req: CustomRequest, res: Response, next: NextFunction) {
  const bodyTenantId = req.body?.tenantId || req.body?.tenant_id;
  if (bodyTenantId !== undefined) {
    return res.status(400).json({
      success: false,
      error: 'BAD_REQUEST',
      message: 'tenantId must not be supplied by clients; it is derived from authentication.'
    });
  }
  next();
}

const QUARRY_CODE_PATTERN = /^[A-Z0-9._-]{2,64}$/;
const MINERAL_TYPES = new Set(['LATERITE', 'GRANITE', 'HARD_ROCK', 'BLUE_METAL', 'OTHER']);
const OPERATIONAL_STATUSES = new Set(['ACTIVE', 'MAINTENANCE', 'ENVIRONMENTAL_PAUSE', 'INACTIVE']);

export function validateCreateQuarryBody(req: CustomRequest, res: Response, next: NextFunction) {
  const body = req.body || {};
  const { code, name, mineralType, operationalStatus, companyId, branchId, gpsLatitude, gpsLongitude, capacityTons } = body;

  if (typeof code !== 'string' || !QUARRY_CODE_PATTERN.test(code.trim().toUpperCase())) {
    return res.status(400).json({
      success: false,
      error: 'BAD_REQUEST',
      message: 'code must be 2-64 characters (letters, numbers, dot, underscore, hyphen).'
    });
  }

  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 255) {
    return res.status(400).json({
      success: false,
      error: 'BAD_REQUEST',
      message: 'name must be between 2 and 255 characters.'
    });
  }

  if (mineralType !== undefined && (typeof mineralType !== 'string' || !MINERAL_TYPES.has(mineralType))) {
    return res.status(400).json({
      success: false,
      error: 'BAD_REQUEST',
      message: 'mineralType must be one of LATERITE, GRANITE, HARD_ROCK, BLUE_METAL, OTHER.'
    });
  }

  if (operationalStatus !== undefined && (typeof operationalStatus !== 'string' || !OPERATIONAL_STATUSES.has(operationalStatus))) {
    return res.status(400).json({
      success: false,
      error: 'BAD_REQUEST',
      message: 'operationalStatus must be ACTIVE, MAINTENANCE, ENVIRONMENTAL_PAUSE, or INACTIVE.'
    });
  }

  if (companyId !== undefined && (typeof companyId !== 'string' || !SAFE_ID_PATTERN.test(companyId))) {
    return res.status(400).json({
      success: false,
      error: 'BAD_REQUEST',
      message: 'Invalid companyId.'
    });
  }

  if (branchId !== undefined && branchId !== '' && (typeof branchId !== 'string' || !SAFE_ID_PATTERN.test(branchId))) {
    return res.status(400).json({
      success: false,
      error: 'BAD_REQUEST',
      message: 'Invalid branchId.'
    });
  }

  if (gpsLatitude !== undefined && (typeof gpsLatitude !== 'number' || gpsLatitude < -90 || gpsLatitude > 90)) {
    return res.status(400).json({ success: false, error: 'BAD_REQUEST', message: 'gpsLatitude must be between -90 and 90.' });
  }

  if (gpsLongitude !== undefined && (typeof gpsLongitude !== 'number' || gpsLongitude < -180 || gpsLongitude > 180)) {
    return res.status(400).json({ success: false, error: 'BAD_REQUEST', message: 'gpsLongitude must be between -180 and 180.' });
  }

  if (capacityTons !== undefined && (typeof capacityTons !== 'number' || capacityTons < 0)) {
    return res.status(400).json({ success: false, error: 'BAD_REQUEST', message: 'capacityTons must be a non-negative number.' });
  }

  req.body = {
    code: code.trim().toUpperCase(),
    name: name.trim(),
    mineralType,
    operationalStatus,
    companyId,
    branchId,
    gpsLatitude,
    gpsLongitude,
    capacityTons
  };

  next();
}
