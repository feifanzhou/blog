import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { MarkdownProcessor, ProcessedPost } from './markdownProcessor.js';
import { Logger } from '@/utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = path.join(__dirname, '../../posts');
const URL_MAP_PATH = path.join(__dirname, '../../url-map.json');

interface UrlMapping {
  [key: string]: string;
}

export class PostManager {
  private static urlMap: UrlMapping | null = null;
  private static postCache = new Map<string, ProcessedPost>();
  private static lastCacheUpdate = 0;
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private static async loadUrlMap(): Promise<UrlMapping> {
    if (this.urlMap) return this.urlMap;
    
    try {
      const urlMapContent = await fs.readFile(URL_MAP_PATH, 'utf-8');
      this.urlMap = JSON.parse(urlMapContent);
      return this.urlMap!;
    } catch (error) {
      Logger.warn('No url-map.json found, using direct file lookup');
      this.urlMap = {};
      return {};
    }
  }

  static async getPostBySlug(slug: string): Promise<ProcessedPost | null> {
    const cacheKey = `post:${slug}`;
    
    // Check cache first
    if (this.postCache.has(cacheKey) && (Date.now() - this.lastCacheUpdate) < this.CACHE_DURATION) {
      return this.postCache.get(cacheKey)!;
    }

    try {
      const urlMap = await this.loadUrlMap();
      let filePath: string;

      // Try to find in URL map first
      const mappedPath = urlMap[`/posts/${slug}`] || urlMap[`/${slug}`];
      if (mappedPath) {
        filePath = path.join(__dirname, '../..', mappedPath);
      } else {
        // Fallback: search for the file in posts directory
        filePath = await this.findPostFile(slug);
      }

      const markdownContent = await fs.readFile(filePath, 'utf-8');
      const processedPost = MarkdownProcessor.processMarkdown(markdownContent, slug);
      
      // Cache the result
      this.postCache.set(cacheKey, processedPost);
      this.lastCacheUpdate = Date.now();
      
      return processedPost;
    } catch (error) {
      Logger.error(`Error loading post ${slug}:`, error);
      return null;
    }
  }

  private static async findPostFile(slug: string): Promise<string> {
    const years = await fs.readdir(POSTS_DIR);
    
    for (const year of years) {
      const yearPath = path.join(POSTS_DIR, year);
      const stat = await fs.stat(yearPath);
      
      if (stat.isDirectory()) {
        const postPath = path.join(yearPath, `${slug}.md`);
        try {
          await fs.access(postPath);
          return postPath;
        } catch {
          // Continue searching
        }
      }
    }
    
    throw new Error(`Post not found: ${slug}`);
  }

  static async getAllPosts(limit?: number): Promise<ProcessedPost[]> {
    const cacheKey = `all-posts:${limit || 'unlimited'}`;
    
    if (this.postCache.has(cacheKey) && (Date.now() - this.lastCacheUpdate) < this.CACHE_DURATION) {
      return this.postCache.get(cacheKey)! as any;
    }

    try {
      const posts: ProcessedPost[] = [];
      const years = await fs.readdir(POSTS_DIR);
      
      for (const year of years.sort().reverse()) { // Most recent first
        const yearPath = path.join(POSTS_DIR, year);
        const stat = await fs.stat(yearPath);
        
        if (stat.isDirectory()) {
          const files = await fs.readdir(yearPath);
          const markdownFiles = files.filter(f => f.endsWith('.md'));
          
          for (const file of markdownFiles) {
            const filePath = path.join(yearPath, file);
            const slug = file.replace('.md', '');
            const markdownContent = await fs.readFile(filePath, 'utf-8');
            const processedPost = MarkdownProcessor.processMarkdown(markdownContent, slug);
            
            if (processedPost.meta.published) {
              posts.push(processedPost);
            }
          }
        }
      }

      // Sort by date (most recent first)
      posts.sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());
      
      const result = limit ? posts.slice(0, limit) : posts;
      this.postCache.set(cacheKey, result as any);
      
      return result;
    } catch (error) {
      Logger.error('Error loading all posts:', error);
      return [];
    }
  }

  static async getPostsByCategory(category: string): Promise<ProcessedPost[]> {
    const allPosts = await this.getAllPosts();
    return allPosts.filter(post => 
      post.meta.tags.some(tag => tag.toLowerCase() === category.toLowerCase())
    );
  }

  static async getPostsByYear(year: string): Promise<ProcessedPost[]> {
    const allPosts = await this.getAllPosts();
    return allPosts.filter(post => post.meta.date.startsWith(year));
  }

  static async getArchiveData(): Promise<{[year: string]: number}> {
    const allPosts = await this.getAllPosts();
    const archive: {[year: string]: number} = {};
    
    allPosts.forEach(post => {
      const year = post.meta.date.split('-')[0];
      if (year) {
        archive[year] = (archive[year] || 0) + 1;
      }
    });
    
    return archive;
  }

  static async getAllCategories(): Promise<{category: string, count: number}[]> {
    const allPosts = await this.getAllPosts();
    const categoryCount: {[key: string]: number} = {};
    
    allPosts.forEach(post => {
      post.meta.tags.forEach(tag => {
        const normalizedTag = tag.toLowerCase();
        categoryCount[normalizedTag] = (categoryCount[normalizedTag] || 0) + 1;
      });
    });
    
    return Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  }

  static clearCache(): void {
    this.postCache.clear();
    this.lastCacheUpdate = 0;
  }
}
