import Koa from 'koa';
import views from '@ladjs/koa-views';
import serve from 'koa-static';
import path from 'path';
import { fileURLToPath } from 'url';

import { errorHandler } from '@/middleware/errorHandler.js';
import { seoMiddleware } from '@/middleware/seoMiddleware.js';
import { blogCacheMiddleware } from '@/middleware/cacheMiddleware.js';
import { requestLogger } from '@/middleware/requestLogger.js';
import { Logger } from '@/utils/logger.js';
import router from '@/routes/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = new Koa();

// Request logging middleware (should be first after error handler)
app.use(requestLogger);

// Error handling middleware (should be first)
app.use(errorHandler);

// View engine setup
app.use(views(path.join(__dirname, '../views'), {
  extension: 'ejs',
  options: {
    layout: false // We'll handle layout manually
  }
}));

// Static files
app.use(serve(path.join(__dirname, '../public')));

// Caching middleware (for better performance)
app.use(blogCacheMiddleware());

// SEO middleware (after views but before routes)
app.use(seoMiddleware);

// Routes
app.use(router.routes()).use(router.allowedMethods());

// Global error handling
app.on('error', (err, ctx) => {
  Logger.error('Server error:', err, ctx);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  Logger.info(`Server running on http://localhost:${PORT}`);
});

export default app;
