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
