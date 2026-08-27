import cors from 'cors';
import { getCorsAllowedOrigins, isOriginAllowed, isProduction } from '../config/securityConfig.js';

export const corsMiddleware = cors({
  origin(origin, callback) {
    if (isOriginAllowed(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('CORS_ORIGIN_NOT_ALLOWED'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Correlation-Id', 'X-Request-Id'],
  exposedHeaders: ['X-Request-Id', 'X-Correlation-Id', 'X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  maxAge: isProduction() ? 600 : 0
});

export function getCorsConfigSummary() {
  return {
    allowedOrigins: getCorsAllowedOrigins(),
    credentialsEnabled: true,
    wildcard: false
  };
}
