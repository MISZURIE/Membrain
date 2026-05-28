import { Request, Response, NextFunction } from 'express';

/**
 * Rate Limiting Middleware (Simple in-memory implementation)
 *
 * Limits requests per IP to prevent abuse.
 * In production, use Redis-backed rate limiting for distributed consistency.
 */

const requestCounts = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS = 60;     // 60 requests per minute per IP

export function rateLimitMiddleware(req: Request, res: Response, next: NextFunction): void {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  const record = requestCounts.get(ip);

  if (!record || now > record.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    next();
    return;
  }

  if (record.count >= MAX_REQUESTS) {
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: Math.ceil((record.resetAt - now) / 1000),
    });
    return;
  }

  record.count++;
  next();
}
