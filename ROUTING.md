# Blog Routing System

A comprehensive Koa.js routing system for the blog with advanced features including markdown processing, SEO optimization, caching, and error handling.

## Features

### 🚀 Core Functionality
- **Homepage (/)** - Lists recent posts chronologically
- **Individual Posts (/posts/{slug})** - Renders markdown posts with syntax highlighting
- **Category Pages (/labeled/{category})** - Filters posts by tags/categories
- **Archive Pages (/archive/{year})** - Posts organized by publication year
- **All Posts (/posts)** - Paginated list of all blog posts

### 📝 Markdown Processing
- **Gray Matter Frontmatter** support for post metadata
- **Prism.js Syntax Highlighting** with 20+ language support
- **Auto-generated excerpts** and reading time calculation
- **Enhanced HTML** with copy-to-clipboard code blocks
- **Responsive images** and external link handling

### 🎯 SEO & Meta Tags
- **Dynamic meta tag injection** for each page
- **Open Graph and Twitter Card** support
- **Canonical URLs** and proper heading structure
- **RSS Feed (/feed.xml)** for content syndication
- **XML Sitemap (/sitemap.xml)** for search engines

### ⚡ Performance & Caching
- **Intelligent caching middleware** with ETag support
- **Memory-based cache** (Redis-ready for production)
- **Proper HTTP cache headers** for optimal browser caching
- **Cache invalidation** and cleanup mechanisms

### 🛡️ Error Handling
- **Custom 404 pages** with helpful navigation
- **Graceful error responses** for server errors
- **Development vs production** error display
- **Comprehensive logging** system

## Route Structure

```
/                           # Homepage with recent posts
├── posts/
│   ├── {slug}             # Individual post pages
│   └── ?page=N            # Paginated all posts listing
├── labeled/
│   └── {category}         # Posts filtered by category/tag
├── archive/
│   └── {year}             # Posts from specific year
├── feed.xml               # RSS feed
├── sitemap.xml            # XML sitemap
└── health                 # Health check endpoint
```

## Middleware Stack

The application uses the following middleware stack (in order):

1. **Request Logger** - Logs all requests in development
2. **Error Handler** - Catches and formats errors
3. **View Engine** - EJS template processing
4. **Static Files** - Serves CSS, images, etc.
5. **Cache Middleware** - HTTP caching with ETag support
6. **SEO Middleware** - Meta tag injection
7. **Router** - Route handling and dispatch

## URL Mapping System

The system supports URL preservation through `url-map.json`:

```json
{
  "/posts/my-post": "posts/2024/my-post.md",
  "/legacy/old-url": "posts/2023/new-location.md"
}
```

This allows maintaining existing URLs when restructuring content.

## Configuration

### Environment Variables
- `NODE_ENV` - Controls logging and error display
- `PORT` - Server port (default: 3000)

### Cache Settings
- **Blog Content**: 10 minutes with must-revalidate
- **Static Assets**: 24 hours without revalidation
- **RSS/Sitemap**: 1 hour caching

### Supported Languages (Syntax Highlighting)
- JavaScript/TypeScript (+ JSX/TSX)
- CSS/SCSS
- HTML/XML
- JSON/YAML
- Bash/Shell
- Python
- Go/Rust
- Java/PHP/Ruby
- SQL
- Docker
- Markdown

## File Structure

```
src/
├── routes/
│   ├── index.ts           # Route aggregation
│   └── blogRoutes.ts      # Main blog routes
├── middleware/
│   ├── errorHandler.ts    # Error processing
│   ├── seoMiddleware.ts   # Meta tag injection
│   ├── cacheMiddleware.ts # HTTP caching
│   └── requestLogger.ts   # Request logging
├── lib/
│   ├── postManager.ts     # Post loading and caching
│   └── markdownProcessor.ts # Markdown to HTML conversion
├── utils/
│   └── logger.ts          # Logging utilities
└── types/
    └── index.ts          # Type definitions

views/
├── layout.ejs            # Base template
├── index.ejs             # Homepage
├── post.ejs              # Individual posts
├── posts.ejs             # All posts listing
├── category.ejs          # Category pages
├── archive.ejs           # Archive pages
└── error.ejs             # Error pages
```

## Usage Examples

### Adding a New Post
1. Create markdown file in `posts/YYYY/post-slug.md`
2. Add frontmatter:
```markdown
---
title: "My New Post"
date: "2025-01-15"
tags: ["javascript", "tutorial"]
author: "Author Name"
excerpt: "Brief description of the post"
published: true
---

# My New Post

Content goes here...
```

### Custom URL Mapping
Add to `url-map.json`:
```json
{
  "/posts/custom-url": "posts/2025/actual-filename.md"
}
```

### Accessing Posts Programmatically
```typescript
import { PostManager } from '@/lib/postManager';

// Get single post
const post = await PostManager.getPostBySlug('my-post');

// Get all posts
const allPosts = await PostManager.getAllPosts();

// Get posts by category
const jsPosts = await PostManager.getPostsByCategory('javascript');

// Get posts by year
const posts2025 = await PostManager.getPostsByYear('2025');
```

## Performance Features

### Caching Strategy
- **Memory cache** for processed posts (5-minute TTL)
- **HTTP caching** with proper headers
- **ETag support** for client-side caching
- **Conditional requests** (304 Not Modified)

### Optimization
- **Lazy loading** of Prism.js language components
- **Efficient post lookups** via URL mapping
- **Automatic cache cleanup** for memory management
- **Response time logging** for performance monitoring

## Development Commands

```bash
# Start development server
pnpm run dev

# Build CSS and TypeScript
pnpm run build

# Type checking
pnpm run typecheck

# Linting
pnpm run lint
```

## Production Deployment

For production deployment, consider:

1. **Replace memory cache** with Redis
2. **Add CDN** for static assets
3. **Enable gzip compression**
4. **Configure reverse proxy** (nginx)
5. **Set up SSL/TLS** certificates
6. **Monitor performance** and logs

The routing system is designed to be scalable and maintainable, with clear separation of concerns and comprehensive error handling.
