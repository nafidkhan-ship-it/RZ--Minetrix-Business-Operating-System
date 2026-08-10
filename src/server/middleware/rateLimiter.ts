import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const limitStore = new Map<string, RateLimitRecord>();

export function rateLimiter(options: { windowMs: number; max: number; keyPrefix?: string }) {
  const { windowMs, max, keyPrefix = 'rl' } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const key = `${keyPrefix}:${ip}`;
    const now = Date.now();

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
        message: `Too many requests from this IP address. Please retry after ${Math.ceil((record.resetAt - now) / 1000)} seconds.`
      });
    }

    next();
  };
}
