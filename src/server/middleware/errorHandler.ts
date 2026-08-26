import { Request, Response, NextFunction } from 'express';
import { isProduction } from '../config/securityConfig.js';

const SENSITIVE_PATTERNS = [
  /postgresql:\/\//i,
  /postgres:\/\//i,
  /RSA_PRIVATE_KEY/i,
  /BEGIN (RSA )?PRIVATE KEY/i,
  /DATABASE_URL/i,
  /SHARED_CORE_TEST_SUITE_SECRET/i,
  /SIGNED_URL_HMAC_SECRET/i
];

function sanitizeErrorMessage(message: string): string {
  let sanitized = message;
  for (const pattern of SENSITIVE_PATTERNS) {
    if (pattern.test(sanitized)) {
      return 'An internal server error occurred.';
    }
  }
  return sanitized;
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    error: 'NOT_FOUND',
    message: 'The requested resource was not found.'
  });
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  const rawMessage = err instanceof Error ? err.message : 'Unknown error';
  const isCorsRejection = rawMessage === 'CORS_ORIGIN_NOT_ALLOWED';

  if (isCorsRejection) {
    return res.status(403).json({
      success: false,
      error: 'CORS_FORBIDDEN',
      message: 'Origin not allowed by CORS policy.'
    });
  }

  const statusCode = (err as { statusCode?: number })?.statusCode || 500;
  const clientMessage = isProduction()
    ? statusCode >= 500
      ? 'An internal server error occurred.'
      : sanitizeErrorMessage(rawMessage)
    : sanitizeErrorMessage(rawMessage);

  if (!isProduction()) {
    console.error('[API Error]', rawMessage);
  } else {
    console.error('[API Error]', statusCode >= 500 ? 'Internal server error' : clientMessage);
  }

  res.status(statusCode >= 400 && statusCode < 600 ? statusCode : 500).json({
    success: false,
    error: statusCode >= 500 ? 'INTERNAL_SERVER_ERROR' : 'REQUEST_ERROR',
    message: clientMessage
  });
}
