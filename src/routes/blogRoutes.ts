import Router from '@koa/router';
import { PostManager } from '../lib/postManager.js';
import { MarkdownProcessor } from '../lib/markdownProcessor.js';
import { setSEO } from '../middleware/seoMiddleware.js';
import { Logger } from '../utils/logger.js';
import type { Context } from 'koa';

const router = new Router();

// Homepage - lists all posts chronologically
router.get('/', async (ctx: Context) => {
  try {
    const posts = await PostManager.getAllPosts(); // All posts
    const categories = await PostManager.getAllCategories();
    const archiveData = await PostManager.getArchiveData();

    setSEO(ctx, {
      title: 'Feifan Zhou | Blog',
      description:
        'Feifan Zhou | Exploring uncommonly interesting ideas, thinking clearly, and tinkering with software through long-form writing.',
      type: 'website',
    });

    await ctx.render('index', {
      title: 'Feifan Zhou | Blog',
      posts,
      categories: categories.slice(0, 10), // Top 10 categories
      archiveData,
      currentPage: 'home',
    });
  } catch (error) {
    Logger.error('Error loading homepage:', error);
    ctx.throw(500, 'Failed to load homepage');
  }
});

// Individual post pages
router.get('/posts/:slug', async (ctx: Context) => {
  const { slug } = ctx.params;

  try {
    const post = await PostManager.getPostBySlug(slug);

    if (!post || !post.meta.published) {
      ctx.throw(404, 'Post not found');
    }

    const fullTitle = MarkdownProcessor.generatePageTitle(post.meta.title);
    const description = MarkdownProcessor.generateMetaDescription(post.excerpt);

    setSEO(ctx, {
      title: fullTitle,
      description,
      keywords: post.meta.tags.join(', '),
      author: post.meta.author,
      type: 'article',
      publishedTime: new Date(post.meta.date).toISOString(),
      ...(post.meta.hero_image && { image: post.meta.hero_image }),
    });

    await ctx.render('post', {
      title: fullTitle,
      post,
      currentPage: 'post',
    });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === 'object' &&
      'status' in error &&
      (error as any).status === 404
    ) {
      ctx.throw(404, 'Post not found');
    }
    Logger.error(`Error loading post ${slug}:`, error);
    ctx.throw(500, 'Failed to load post');
  }
});

// Category/tag pages
router.get('/labeled/:category', async (ctx: Context) => {
  const { category } = ctx.params;

  try {
    const posts = await PostManager.getPostsByCategory(category);
    const allCategories = await PostManager.getAllCategories();

    const pageTitle = `Posts tagged "${category}" - Feifan Zhou | Blog`;
    const description = `All posts tagged with ${category}. ${posts.length} posts found.`;

    setSEO(ctx, {
      title: pageTitle,
      description,
      type: 'website',
    });

    await ctx.render('category', {
      title: pageTitle,
      category,
      posts,
      categories: allCategories,
      currentPage: 'category',
    });
  } catch (error) {
    Logger.error(`Error loading category ${category}:`, error);
    ctx.throw(500, 'Failed to load category page');
  }
});

// Archive pages by year
router.get('/archive/:year', async (ctx: Context) => {
  const { year } = ctx.params;

  // Validate year format
  if (!/^\d{4}$/.test(year)) {
    ctx.throw(400, 'Invalid year format');
  }

  try {
    const posts = await PostManager.getPostsByYear(year);
    const archiveData = await PostManager.getArchiveData();

    const pageTitle = `${year} Archive - Feifan Zhou | Blog`;
    const description = `Blog posts from ${year}. ${posts.length} posts found.`;

    setSEO(ctx, {
      title: pageTitle,
      description,
      type: 'website',
    });

    await ctx.render('archive', {
      title: pageTitle,
      year,
      posts,
      archiveData,
      currentPage: 'archive',
    });
  } catch (error) {
    Logger.error(`Error loading archive for ${year}:`, error);
    ctx.throw(500, 'Failed to load archive page');
  }
});

// All posts page (paginated)
router.get('/posts', async (ctx: Context) => {
  const page = parseInt(ctx.query.page as string) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;

  try {
    const allPosts = await PostManager.getAllPosts();
    const posts = allPosts.slice(offset, offset + limit);
    const totalPages = Math.ceil(allPosts.length / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    const pageTitle =
      page > 1
        ? `All Posts - Page ${page} - Feifan Zhou | Blog`
        : 'All Posts - Feifan Zhou | Blog';

    setSEO(ctx, {
      title: pageTitle,
      description: `Browse all blog posts. Page ${page} of ${totalPages}.`,
      type: 'website',
    });

    await ctx.render('posts', {
      title: pageTitle,
      posts,
      currentPage: page,
      totalPages,
      hasNextPage,
      hasPrevPage,
      currentPageName: 'posts',
    });
  } catch (error) {
    Logger.error('Error loading posts page:', error);
    ctx.throw(500, 'Failed to load posts page');
  }
});

// RSS Feed
router.get('/feed.xml', async (ctx: Context) => {
  try {
    const posts = await PostManager.getAllPosts(20); // Latest 20 posts

    ctx.type = 'application/xml';
    ctx.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour

    const baseUrl = `${ctx.protocol}://${ctx.host}`;
    const rssContent = generateRSSFeed(posts, baseUrl);

    ctx.body = rssContent;
  } catch (error) {
    Logger.error('Error generating RSS feed:', error);
    ctx.throw(500, 'Failed to generate RSS feed');
  }
});

// Sitemap
router.get('/sitemap.xml', async (ctx: Context) => {
  try {
    const posts = await PostManager.getAllPosts();

    ctx.type = 'application/xml';
    ctx.set('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours

    const baseUrl = `${ctx.protocol}://${ctx.host}`;
    const sitemapContent = generateSitemap(posts, baseUrl);

    ctx.body = sitemapContent;
  } catch (error) {
    Logger.error('Error generating sitemap:', error);
    ctx.throw(500, 'Failed to generate sitemap');
  }
});

function generateRSSFeed(posts: any[], baseUrl: string): string {
  const items = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.meta.title}]]></title>
      <link>${baseUrl}/posts/${post.meta.slug}</link>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${new Date(post.meta.date).toUTCString()}</pubDate>
      <guid>${baseUrl}/posts/${post.meta.slug}</guid>
    </item>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Feifan Zhou | Blog</title>
    <link>${baseUrl}</link>
    <description>A blog about software philosophy</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <language>en-us</language>
    ${items}
  </channel>
</rss>`;
}

function generateSitemap(posts: any[], baseUrl: string): string {
  const postUrls = posts
    .map(
      (post) => `
  <url>
    <loc>${baseUrl}/posts/${post.meta.slug}</loc>
    <lastmod>${post.meta.date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/posts</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  ${postUrls}
</urlset>`;
}

export default router;
