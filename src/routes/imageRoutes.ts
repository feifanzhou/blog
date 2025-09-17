import Router from '@koa/router';
import { Context } from 'koa';
import { OGImageGenerator } from '../lib/ogImageGenerator.js';
import { PostManager } from '../lib/postManager.js';
import { Logger } from '../utils/logger.js';
import fs from 'fs/promises';
import path from 'path';

const router = new Router();

// Ensure the images cache directory exists
const CACHE_DIR = path.join(process.cwd(), 'public', 'generated-images');

async function ensureCacheDir(): Promise<void> {
  try {
    await fs.access(CACHE_DIR);
  } catch {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  }
}

/**
 * Generate and serve dynamic og:image for posts without hero_image
 */
router.get('/og-image/:slug.png', async (ctx: Context) => {
  const { slug } = ctx.params;

  try {
    // Get the post
    const post = await PostManager.getPostBySlug(slug);
    
    if (!post || !post.meta.published) {
      ctx.throw(404, 'Post not found');
    }

    // If the post already has a hero_image, redirect to it
    if (post.meta.hero_image) {
      ctx.redirect(post.meta.hero_image);
      return;
    }

    // Generate cache key
    const cacheKey = OGImageGenerator.generateCacheKey(post.meta);
    const cachePath = path.join(CACHE_DIR, cacheKey);

    let imageBuffer: Buffer;

    try {
      // Try to serve from cache
      imageBuffer = await fs.readFile(cachePath);
      Logger.debug(`Serving cached OG image for ${slug}`);
    } catch {
      // Generate new image
      Logger.info(`Generating new OG image for ${slug}`);
      await ensureCacheDir();
      
      imageBuffer = await OGImageGenerator.generateOGImage(post.meta);
      
      // Cache the generated image
      try {
        await fs.writeFile(cachePath, imageBuffer);
        Logger.debug(`Cached OG image for ${slug}`);
      } catch (error) {
        Logger.warn('Failed to cache OG image:', error);
        // Continue without caching
      }
    }

    // Set appropriate headers
    ctx.type = 'image/png';
    ctx.set('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    ctx.set('ETag', `"og-${slug}-${Date.now()}"`);
    
    ctx.body = imageBuffer;

  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'status' in error && (error as any).status === 404) {
      ctx.throw(404, 'Post not found');
    }
    
    Logger.error(`Error generating OG image for ${slug}:`, error);
    ctx.throw(500, 'Failed to generate OG image');
  }
});

/**
 * Health check endpoint for the image generation service
 */
router.get('/og-image/health', async (ctx: Context) => {
  ctx.body = {
    status: 'ok',
    service: 'og-image-generator',
    timestamp: new Date().toISOString(),
  };
});

/**
 * Clear the OG image cache (admin endpoint)
 */
router.delete('/og-image/cache', async (ctx: Context) => {
  try {
    await ensureCacheDir();
    const files = await fs.readdir(CACHE_DIR);
    
    for (const file of files) {
      if (file.endsWith('.png')) {
        await fs.unlink(path.join(CACHE_DIR, file));
      }
    }
    
    Logger.info(`Cleared ${files.length} cached OG images`);
    
    ctx.body = {
      status: 'success',
      message: `Cleared ${files.length} cached images`,
    };
  } catch (error) {
    Logger.error('Error clearing OG image cache:', error);
    ctx.throw(500, 'Failed to clear cache');
  }
});

export default router;
