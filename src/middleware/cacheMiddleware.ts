import type { Context, Next } from 'koa';
import { Logger } from '../utils/logger.js';

interface CacheOptions {
  maxAge: number; // Cache duration in seconds
  mustRevalidate?: boolean;
  noCache?: boolean;
  private?: boolean;
}

const DEFAULT_CACHE_OPTIONS: CacheOptions = {
  maxAge: 300, // 5 minutes
  mustRevalidate: false,
  noCache: false,
  private: false
};

// In-memory cache for development (use Redis in production)
const memoryCache = new Map<string, {
  content: any;
  timestamp: number;
  etag: string;
}>();

export function createCacheMiddleware(options: Partial<CacheOptions> = {}) {
  const cacheOptions = { ...DEFAULT_CACHE_OPTIONS, ...options };
  
  return async (ctx: Context, next: Next) => {
    const key = getCacheKey(ctx);
    
    // Check if client has cached version
    const clientETag = ctx.get('If-None-Match');
    
    // Check memory cache
    const cached = memoryCache.get(key);
    if (cached && !isExpired(cached, cacheOptions.maxAge)) {
      // Return 304 if client has current version
      if (clientETag === cached.etag) {
        ctx.status = 304;
        return;
      }
      
      ctx.body = cached.content;
      setCacheHeaders(ctx, cacheOptions, cached.etag, new Date(cached.timestamp));
      return;
    }
    
    // Process request
    await next();
    
    // Cache successful responses
    if (ctx.status === 200 && ctx.body && shouldCache(ctx)) {
      const etag = generateETag(ctx.body);
      const now = Date.now();
      
      memoryCache.set(key, {
        content: ctx.body,
        timestamp: now,
        etag
      });
      
      setCacheHeaders(ctx, cacheOptions, etag, new Date(now));
      
      // Clean up old cache entries periodically
      if (Math.random() < 0.01) { // 1% chance
        cleanupCache();
      }
    }
  };
}

export function blogCacheMiddleware() {
  return createCacheMiddleware({
    maxAge: 600, // 10 minutes for blog content
    mustRevalidate: true
  });
}

export function staticCacheMiddleware() {
  return createCacheMiddleware({
    maxAge: 86400, // 24 hours for static content
    mustRevalidate: false
  });
}

export function apiCacheMiddleware() {
  return createCacheMiddleware({
    maxAge: 300, // 5 minutes for API responses
    mustRevalidate: true,
    private: true
  });
}

function getCacheKey(ctx: Context): string {
  // Include query parameters in cache key for dynamic content
  const url = ctx.url;
  const userAgent = ctx.get('User-Agent') || '';
  
  // Create a hash to avoid collisions on similar URLs
  const content = url + '|' + userAgent;
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return `cache_${Math.abs(hash).toString(36)}`;
}

function isExpired(cached: any, maxAge: number): boolean {
  return Date.now() - cached.timestamp > maxAge * 1000;
}

function shouldCache(ctx: Context): boolean {
  // Don't cache responses with Set-Cookie headers
  if (ctx.response.get('Set-Cookie')) return false;
  
  // Don't cache error responses
  if (ctx.status >= 400) return false;
  
  // Don't cache if explicitly disabled
  if (ctx.response.get('Cache-Control')?.includes('no-cache')) return false;
  
  return true;
}

function setCacheHeaders(
  ctx: Context, 
  options: CacheOptions, 
  etag: string, 
  lastModified: Date
) {
  // Set ETag
  ctx.set('ETag', etag);
  
  // Set Last-Modified
  ctx.set('Last-Modified', lastModified.toUTCString());
  
  // Set Cache-Control
  const cacheControl = [];
  
  if (options.noCache) {
    cacheControl.push('no-cache');
  } else {
    cacheControl.push(options.private ? 'private' : 'public');
    cacheControl.push(`max-age=${options.maxAge}`);
    
    if (options.mustRevalidate) {
      cacheControl.push('must-revalidate');
    }
  }
  
  ctx.set('Cache-Control', cacheControl.join(', '));
  
  // Set Vary header for better caching
  ctx.set('Vary', 'Accept-Encoding, User-Agent');
}

function generateETag(content: any): string {
  let str = typeof content === 'string' ? content : JSON.stringify(content);
  
  // Simple hash function for ETag
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return `"${Math.abs(hash).toString(16)}"`;
}

function cleanupCache() {
  const now = Date.now();
  const maxAge = 3600000; // 1 hour max cache time
  
  for (const [key, value] of memoryCache.entries()) {
    if (now - value.timestamp > maxAge) {
      memoryCache.delete(key);
    }
  }
  
  Logger.info(`Cache cleanup completed. ${memoryCache.size} entries remaining.`);
}

// Utility function to clear all cache
export function clearCache() {
  memoryCache.clear();
  Logger.info('All cache cleared');
}

// Clear cache immediately when module loads (for development)
if (process.env.NODE_ENV !== 'production') {
  clearCache();
}

// Utility function to get cache stats
export function getCacheStats() {
  return {
    size: memoryCache.size,
    keys: Array.from(memoryCache.keys())
  };
}
