import Router from '@koa/router';
import blogRoutes from './blogRoutes.js';

const router = new Router();

// Mount blog routes
router.use(blogRoutes.routes(), blogRoutes.allowedMethods());

// Health check endpoint
router.get('/health', (ctx) => {
  ctx.body = { status: 'ok', timestamp: new Date().toISOString() };
});

export default router;
