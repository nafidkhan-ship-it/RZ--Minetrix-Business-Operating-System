import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const limitStore = new Map<string, RateLimitRecord>();
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupStaleEntries(now: number): void {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, record] of limitStore.entries()) {
    if (record.resetAt <= now) {
      limitStore.delete(key);
    }
  }
}

function getClientKey(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || '127.0.0.1';
}

/**
 * In-memory per-process rate limiter.
 * Multi-instance production deployments should use a shared backend (e.g. Redis)
 * for consistent enforcement across replicas.
 */
export function rateLimiter(options: { windowMs: number; max: number; keyPrefix?: string }) {
  const { windowMs, max, keyPrefix = 'rl' } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    cleanupStaleEntries(now);

    const key = `${keyPrefix}:${getClientKey(req)}:${req.path}`;
    let record = limitStore.get(key);

    if (!record || now > record.resetAt) {
      record = { count: 1, resetAt: now + windowMs };
      limitStore.set(key, record);
    } else {
      record.count++;
    }

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - record.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetAt / 1000));

    if (record.count > max) {
      return res.status(429).json({
        success: false,
        error: 'RATE_LIMIT_EXCEEDED',
        message: `Too many requests. Please retry after ${Math.ceil((record.resetAt - now) / 1000)} seconds.`,
        retryAfter: Math.ceil((record.resetAt - now) / 1000)
      });
    }

    next();
  };
}
