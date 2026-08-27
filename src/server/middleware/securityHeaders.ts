import helmet from 'helmet';
import { isProduction } from '../config/securityConfig.js';

export const securityHeadersMiddleware = helmet({
  contentSecurityPolicy: isProduction()
    ? {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'"],
          fontSrc: ["'self'", 'data:'],
          objectSrc: ["'none'"],
          frameAncestors: ["'none'"]
        }
      }
    : false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'same-site' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  hsts: isProduction()
    ? { maxAge: 31536000, includeSubDomains: true, preload: false }
    : false
});

export const SECURITY_HEADER_NAMES = [
  'x-content-type-options',
  'x-frame-options',
  'referrer-policy',
  'cross-origin-resource-policy'
] as const;
