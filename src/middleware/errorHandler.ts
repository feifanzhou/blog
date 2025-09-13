import { Context, Next } from 'koa';
import { Logger } from '@/utils/logger.js';

interface HttpError extends Error {
  statusCode?: number;
  status?: number;
}

export const errorHandler = async (ctx: Context, next: Next) => {
  try {
    await next();
    
    // Handle 404 for unmatched routes
    if (ctx.response.status === 404 && !ctx.body) {
      ctx.status = 404;
      await handle404(ctx);
    }
  } catch (err) {
    const error = err as HttpError;
    const status = error.statusCode || error.status || 500;
    
    ctx.status = status;
    
    // Log error details
    if (status >= 500) {
      Logger.error('Server error:', error.message, error.stack);
    } else if (status >= 400 && process.env.NODE_ENV === 'development') {
      Logger.warn(`Client error ${status}:`, error.message);
    }
    
    // Render appropriate error page
    if (status === 404) {
      await handle404(ctx);
    } else if (status >= 500) {
      await handle500(ctx, error);
    } else {
      await handleClientError(ctx, error);
    }
    
    ctx.app.emit('error', error, ctx);
  }
};

async function handle404(ctx: Context) {
  const acceptsHTML = ctx.accepts('html', 'json') === 'html';
  
  if (acceptsHTML) {
    const errorData = {
      title: '404 - Page Not Found',
      status: 404,
      message: 'The page you are looking for could not be found.',
      currentPage: 'error'
    };
    
    try {
      await ctx.render('error', errorData);
    } catch {
      // Fallback if error template doesn't exist
      ctx.type = 'html';
      ctx.body = generateErrorHTML(errorData);
    }
  } else {
    ctx.body = {
      error: 'Not Found',
      message: 'The requested resource could not be found.',
      status: 404
    };
  }
}

async function handle500(ctx: Context, error: HttpError) {
  const acceptsHTML = ctx.accepts('html', 'json') === 'html';
  
  if (acceptsHTML) {
    const errorData = {
      title: '500 - Server Error',
      status: 500,
      message: process.env.NODE_ENV === 'development' 
        ? error.message 
        : 'An internal server error occurred.',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      currentPage: 'error'
    };
    
    try {
      await ctx.render('error', errorData);
    } catch {
      // Fallback if error template doesn't exist
      ctx.type = 'html';
      ctx.body = generateErrorHTML(errorData);
    }
  } else {
    ctx.body = {
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred.',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
      status: 500
    };
  }
}

async function handleClientError(ctx: Context, error: HttpError) {
  const acceptsHTML = ctx.accepts('html', 'json') === 'html';
  
  if (acceptsHTML) {
    const errorData = {
      title: `${ctx.status} - Client Error`,
      status: ctx.status,
      message: error.message || 'A client error occurred.',
      currentPage: 'error'
    };
    
    try {
      await ctx.render('error', errorData);
    } catch {
      // Fallback if error template doesn't exist
      ctx.type = 'html';
      ctx.body = generateErrorHTML(errorData);
    }
  } else {
    ctx.body = {
      error: 'Client Error',
      message: error.message || 'A client error occurred.',
      status: ctx.status
    };
  }
}

function generateErrorHTML(data: any): string {
  return `
<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title}</title>
    <link rel="stylesheet" href="/styles/main.css">
</head>
<body class="h-full bg-gray-50 flex flex-col">
    <header class="bg-white shadow-sm">
        <div class="blog-container">
            <div class="blog-nav">
                <h1 class="text-2xl font-bold text-gray-900">
                    <a href="/" class="hover:text-blue-600 transition-colors">My Blog</a>
                </h1>
                <nav class="blog-nav-links">
                    <a href="/" class="blog-nav-link">Home</a>
                    <a href="/posts" class="blog-nav-link">Posts</a>
                    <a href="/about" class="blog-nav-link">About</a>
                </nav>
            </div>
        </div>
    </header>
    
    <main class="flex-1 flex items-center justify-center">
        <div class="text-center">
            <h1 class="text-9xl font-bold text-gray-200">${data.status}</h1>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">${data.message}</h2>
            <p class="text-gray-600 mb-8">Sorry, something went wrong.</p>
            <a href="/" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                Go Home
            </a>
            ${data.stack ? `<pre class="mt-8 text-left text-xs bg-gray-100 p-4 rounded overflow-auto max-w-2xl mx-auto">${data.stack}</pre>` : ''}
        </div>
    </main>
    
    <footer class="bg-white border-t border-gray-200 mt-12">
        <div class="blog-container">
            <div class="blog-footer">
                <div class="flex flex-col md:flex-row justify-between items-center">
                    <p class="text-gray-600 mb-4 md:mb-0">&copy; 2025 My Blog. Built with Koa.js and Tailwind CSS.</p>
                </div>
            </div>
        </div>
    </footer>
</body>
</html>`;
}
