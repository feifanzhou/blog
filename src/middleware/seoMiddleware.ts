import type { Context, Next } from 'koa';

export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  image?: string;
  type: 'website' | 'article';
  url: string;
}

export async function seoMiddleware(ctx: Context, next: Next) {
  await next();
  
  // Only process HTML responses
  if (!ctx.body || !ctx.response.is('html')) return;
  
  // Set default SEO data
  const defaultSEO: SEOData = {
    title: 'My Blog',
    description: 'A blog about technology, coding, and ideas',
    author: 'Blog Author',
    type: 'website',
    url: `${ctx.protocol}://${ctx.host}${ctx.url}`,
    image: '/images/og-image.png'
  };
  
  // Merge with any SEO data set by route handlers
  const seoData: SEOData = { ...defaultSEO, ...ctx.state.seo };
  
  // Inject SEO meta tags into the rendered HTML
  if (typeof ctx.body === 'string') {
    ctx.body = injectSEOTags(ctx.body, seoData);
  }
  
  // Set caching headers
  setCacheHeaders(ctx);
}

function injectSEOTags(html: string, seo: SEOData): string {
  const metaTags = generateSEOTags(seo);
  
  // Find the closing </head> tag and insert meta tags before it
  return html.replace('</head>', `${metaTags}\n</head>`);
}

function generateSEOTags(seo: SEOData): string {
  const tags = [
    `<meta name="description" content="${escapeAttribute(seo.description)}">`,
    seo.keywords && `<meta name="keywords" content="${escapeAttribute(seo.keywords)}">`,
    seo.author && `<meta name="author" content="${escapeAttribute(seo.author)}">`,
    
    // Open Graph tags
    `<meta property="og:title" content="${escapeAttribute(seo.title)}">`,
    `<meta property="og:description" content="${escapeAttribute(seo.description)}">`,
    `<meta property="og:type" content="${seo.type}">`,
    `<meta property="og:url" content="${escapeAttribute(seo.url)}">`,
    seo.image && `<meta property="og:image" content="${escapeAttribute(seo.image)}">`,
    seo.publishedTime && `<meta property="article:published_time" content="${seo.publishedTime}">`,
    seo.modifiedTime && `<meta property="article:modified_time" content="${seo.modifiedTime}">`,
    seo.author && `<meta property="article:author" content="${escapeAttribute(seo.author)}">`,
    
    // Twitter Card tags
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeAttribute(seo.title)}">`,
    `<meta name="twitter:description" content="${escapeAttribute(seo.description)}">`,
    seo.image && `<meta name="twitter:image" content="${escapeAttribute(seo.image)}">`,
    
    // Additional meta tags
    `<link rel="canonical" href="${escapeAttribute(seo.url)}">`,
    `<meta name="robots" content="index, follow">`,
    `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
  ];
  
  return tags.filter(Boolean).join('\n    ');
}

function escapeAttribute(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function setCacheHeaders(ctx: Context) {
  const isStaticContent = ctx.url.includes('/posts/') || ctx.url === '/';
  
  if (isStaticContent) {
    // Cache static content for 10 minutes
    ctx.set('Cache-Control', 'public, max-age=600');
  } else {
    // Cache dynamic content for 5 minutes
    ctx.set('Cache-Control', 'public, max-age=300');
  }
  
  // Set ETag for better caching
  ctx.set('ETag', `"${Date.now()}"`);
}

// Helper function for route handlers to set SEO data
export function setSEO(ctx: Context, seoData: Partial<SEOData>) {
  ctx.state.seo = { ...ctx.state.seo, ...seoData };
}
