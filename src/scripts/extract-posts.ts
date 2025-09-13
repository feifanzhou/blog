#!/usr/bin/env node

import { Client } from 'pg';
import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface PostRecord {
  id: number;
  title: string;
  content_md: string | null;
  urlsafe_slug: string;
  inserted_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}

interface UrlMapping {
  [legacyUrl: string]: string;
}

const DB_CONFIG = {
  connectionString: 'postgresql://postgres:aeb2oa5R_iech9Air_zei9ux5A@66.175.221.161/tanagram2',
  ssl: false
};

const OUTPUT_DIR = path.join(process.cwd(), 'posts');
const URL_MAP_FILE = path.join(process.cwd(), 'url-map.json');

class PostExtractor {
  private client: Client;
  private urlMap: UrlMapping = {};

  constructor() {
    this.client = new Client(DB_CONFIG);
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      console.log('✅ Connected to PostgreSQL database');
    } catch (error) {
      console.error('❌ Failed to connect to database:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.client.end();
    console.log('✅ Database connection closed');
  }

  private extractExcerpt(contentMd: string | null): string {
    if (!contentMd) return '';
    
    // Remove markdown formatting and extract first paragraph
    const firstParagraph = contentMd
      .split('\n\n')[0]
      ?.replace(/[#*_`~]/g, '')
      ?.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      ?.trim() || '';
    
    return firstParagraph.length > 200 
      ? firstParagraph.substring(0, 200).replace(/\s+\S*$/, '') + '...'
      : firstParagraph;
  }

  private sanitizeContent(content: string | null): string {
    if (!content) return '';
    
    // Handle encoding issues
    return content
      .replace(/\u0000/g, '') // Remove null bytes
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\r/g, '\n')
      .trim();
  }

  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
      console.log(`📁 Created directory: ${dirPath}`);
    }
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0] || '';
  }

  private getFilePathFromPost(post: PostRecord): string {
    const year = new Date(post.inserted_at).getFullYear().toString();
    const filename = `${post.urlsafe_slug}.md`;
    return path.join(OUTPUT_DIR, year, filename);
  }

  private generateFrontmatter(post: PostRecord): string {
    const excerpt = this.extractExcerpt(post.content_md);
    const frontmatter: Record<string, any> = {
      title: post.title,
      date: this.formatDate(new Date(post.inserted_at)),
      updated: this.formatDate(new Date(post.updated_at)),
      slug: post.urlsafe_slug
    };

    if (excerpt) {
      frontmatter.excerpt = excerpt;
    }

    // Use matter.stringify properly to generate full frontmatter
    const matterResult = matter.stringify('', frontmatter);
    return matterResult.split('\n').slice(0, -1).join('\n'); // Remove the empty content line at end
  }

  async fetchPosts(): Promise<PostRecord[]> {
    try {
      console.log('🔍 Fetching posts from database...');
      
      const query = `
        SELECT 
          id,
          title,
          content_md,
          urlsafe_slug,
          inserted_at,
          updated_at,
          is_deleted
        FROM post_items 
        WHERE is_deleted = false
        ORDER BY inserted_at DESC
      `;

      const result = await this.client.query(query);
      console.log(`✅ Found ${result.rows.length} posts to extract`);
      
      return result.rows as PostRecord[];
    } catch (error) {
      console.error('❌ Failed to fetch posts:', error);
      throw error;
    }
  }

  async savePost(post: PostRecord): Promise<void> {
    try {
      const filePath = this.getFilePathFromPost(post);
      const dirPath = path.dirname(filePath);
      
      await this.ensureDirectoryExists(dirPath);

      const frontmatter = this.generateFrontmatter(post);
      const content = this.sanitizeContent(post.content_md);
      const fileContent = `${frontmatter}\n\n${content}`;

      await fs.writeFile(filePath, fileContent, 'utf8');

      // Update URL mapping
      const relativePath = path.relative(process.cwd(), filePath);
      const year = new Date(post.inserted_at).getFullYear().toString();
      
      // Add various legacy URL patterns
      this.urlMap[`/posts/${post.urlsafe_slug}`] = relativePath;
      this.urlMap[`/${year}/${post.urlsafe_slug}`] = relativePath;
      this.urlMap[`/blog/${post.urlsafe_slug}`] = relativePath;
      this.urlMap[`/p/${post.id}`] = relativePath;

      console.log(`💾 Saved: ${relativePath}`);
    } catch (error) {
      console.error(`❌ Failed to save post ${post.urlsafe_slug}:`, error);
      throw error;
    }
  }

  async saveUrlMap(): Promise<void> {
    try {
      const urlMapJson = JSON.stringify(this.urlMap, null, 2);
      await fs.writeFile(URL_MAP_FILE, urlMapJson, 'utf8');
      console.log(`🗺️  Saved URL mapping with ${Object.keys(this.urlMap).length} entries: ${URL_MAP_FILE}`);
    } catch (error) {
      console.error('❌ Failed to save URL map:', error);
      throw error;
    }
  }

  async extractAll(): Promise<void> {
    const startTime = Date.now();
    let processedCount = 0;

    try {
      await this.connect();
      
      // Ensure output directory exists
      await this.ensureDirectoryExists(OUTPUT_DIR);

      const posts = await this.fetchPosts();

      for (const post of posts) {
        try {
          await this.savePost(post);
          processedCount++;
          
          if (processedCount % 10 === 0) {
            console.log(`📊 Progress: ${processedCount}/${posts.length} posts processed`);
          }
        } catch (error) {
          console.error(`⚠️  Skipped post ${post.urlsafe_slug} due to error:`, error);
        }
      }

      await this.saveUrlMap();

      const duration = (Date.now() - startTime) / 1000;
      console.log(`\n🎉 Extraction completed!`);
      console.log(`   📈 Processed: ${processedCount}/${posts.length} posts`);
      console.log(`   ⏱️  Duration: ${duration.toFixed(2)}s`);
      console.log(`   📁 Output: ${OUTPUT_DIR}`);
      console.log(`   🗺️  URL Map: ${URL_MAP_FILE}`);

    } catch (error) {
      console.error('\n💥 Extraction failed:', error);
      throw error;
    } finally {
      await this.disconnect();
    }
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Extraction cancelled by user');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error('\n💥 Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('\n💥 Unhandled rejection:', reason);
  process.exit(1);
});

// Run the extraction
async function main() {
  const extractor = new PostExtractor();
  
  try {
    await extractor.extractAll();
    process.exit(0);
  } catch (error) {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { PostExtractor };
