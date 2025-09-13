import type { Context, Next } from 'koa';
import { Logger } from '../utils/logger.js';

export async function requestLogger(ctx: Context, next: Next) {
  const start = Date.now();
  
  try {
    await next();
  } finally {
    const responseTime = Date.now() - start;
    
    // Add response time to context for potential use elsewhere
    ctx.state.responseTime = responseTime;
    
    // Log request details in development
    if (process.env.NODE_ENV === 'development') {
      const { method, url, status } = ctx;
      const userAgent = ctx.get('User-Agent') || 'Unknown';
      const ip = ctx.ip || ctx.request.ip || 'Unknown';
      
      Logger.info(
        `${method} ${url} - ${status} - ${responseTime}ms - ${ip} - ${userAgent.substring(0, 100)}`
      );
      
      // Log slow requests
      if (responseTime > 1000) {
        Logger.warn(`Slow request detected: ${method} ${url} took ${responseTime}ms`);
      }
    }
  }
}
