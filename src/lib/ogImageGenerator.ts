import { CanvasRenderingContext2D, createCanvas, registerFont } from 'canvas';
import fs from 'fs/promises';
import path from 'path';
import { BlogPostMeta } from '../types/index.js';
import { Logger } from '../utils/logger.js';

// Register fonts if they exist
const FONTS_PATH = path.join(process.cwd(), 'assets/fonts');

interface OGImageOptions {
  title: string;
  description?: string;
  date?: string;
  author?: string;
  theme?: 'light' | 'dark';
}

export class OGImageGenerator {
  private static readonly CANVAS_WIDTH = 1200;
  private static readonly CANVAS_HEIGHT = 630;
  private static readonly MARGIN = 80;
  private static readonly CONTENT_WIDTH = this.CANVAS_WIDTH - 2 * this.MARGIN;

  /**
   * Generate an og:image for a blog post in vintage magazine style
   */
  static async generateOGImage(post: BlogPostMeta): Promise<Buffer> {
    try {
      // Try to register JetBrains Mono if available
      await this.tryRegisterFonts();

      const options: OGImageOptions = {
        title: post.title,
        ...(post.excerpt && { description: post.excerpt }),
        date: new Date(post.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        author: post.author || 'Feifan Zhou',
      };

      return await this.createMagazineSpread(options);
    } catch (error) {
      Logger.error('Error generating OG image:', error);
      throw error;
    }
  }

  /**
   * Try to register JetBrains Mono font if available
   */
  private static async tryRegisterFonts(): Promise<void> {
    try {
      const fontRegular = path.join(FONTS_PATH, 'JetBrainsMono-Regular.ttf');
      const fontBold = path.join(FONTS_PATH, 'JetBrainsMono-Bold.ttf');

      // Check if fonts exist before trying to register
      try {
        await fs.access(fontRegular);
        registerFont(fontRegular, { family: 'JetBrains Mono', weight: 'normal' });
      } catch {
        // Font file doesn't exist, skip
      }

      try {
        await fs.access(fontBold);
        registerFont(fontBold, { family: 'JetBrains Mono', weight: 'bold' });
      } catch {
        // Font file doesn't exist, skip
      }
    } catch (error) {
      // Silently continue without custom fonts
      Logger.debug('Custom fonts not available, using system defaults');
    }
  }

  /**
   * Create a vintage magazine spread-style image
   */
  private static async createMagazineSpread(options: OGImageOptions): Promise<Buffer> {
    const canvas = createCanvas(this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
    const ctx = canvas.getContext('2d');

    // Set background with dot grid pattern
    this.drawBackground(ctx);

    // Draw content sections
    this.drawMasthead(ctx, options);
    this.drawMainContent(ctx, options);

    return canvas.toBuffer('image/png');
  }

  /**
   * Draw background with dot grid pattern
   */
  private static drawBackground(ctx: CanvasRenderingContext2D): void {
    // Fill with cream/off-white background
    ctx.fillStyle = '#FEFEFE';
    ctx.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);

    // Add subtle dot grid pattern
    const dotSize = 1;
    const gridSpacing = 20;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';

    for (let x = gridSpacing; x < this.CANVAS_WIDTH; x += gridSpacing) {
      for (let y = gridSpacing; y < this.CANVAS_HEIGHT; y += gridSpacing) {
        ctx.beginPath();
        ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  /**
   * Draw magazine masthead
   */
  private static drawMasthead(ctx: CanvasRenderingContext2D, options: OGImageOptions): void {
    const y = this.MARGIN + 40;

    // Magazine title
    ctx.font = 'bold 32px monospace';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'left';
    ctx.fillText('FEIFAN ZHOU', this.MARGIN, y);

    // Date/issue info
    ctx.font = '18px monospace';
    ctx.textAlign = 'right';
    if (options.date) {
      ctx.fillText(options.date.toUpperCase(), this.CANVAS_WIDTH - this.MARGIN, y);
    }

    // Horizontal line
    const lineY = y + 20;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.MARGIN, lineY);
    ctx.lineTo(this.CANVAS_WIDTH - this.MARGIN, lineY);
    ctx.stroke();
  }

  /**
   * Draw main content area
   */
  private static drawMainContent(ctx: CanvasRenderingContext2D, options: OGImageOptions): void {
    const startY = this.MARGIN + 160; // Added more spacing after masthead
    const contentX = this.MARGIN;
    const contentWidth = this.CONTENT_WIDTH;

    // Main content area (full width)
    this.drawMainArticle(ctx, contentX, startY, contentWidth, options);
  }



  /**
   * Draw main article content
   */
  private static drawMainArticle(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    options: OGImageOptions
  ): void {
    let currentY = y;

    // Article title - larger and more prominent
    ctx.font = 'bold 56px monospace';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'left';

    // Word wrap the title
    const titleLines = this.wrapText(ctx, options.title, width);
    titleLines.forEach((line) => {
      ctx.fillText(line, x, currentY);
      currentY += 68;
    });

    currentY += 50; // More spacing before description

    // Description/excerpt
    if (options.description) {
      ctx.font = '20px monospace';
      ctx.fillStyle = '#333';
      
      // Clean and truncate description
      const cleanDescription = (options.description || '')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 180) + '...';
      
      const descriptionLines = cleanDescription ? this.wrapText(ctx, cleanDescription, width) : [];
      const maxDescriptionLines = Math.min(descriptionLines.length, 3);
      
      for (let i = 0; i < maxDescriptionLines; i++) {
        const line = descriptionLines[i];
        if (line) {
          ctx.fillText(line, x, currentY);
          currentY += 32;
        }
      }
    }
  }



  /**
   * Wrap text to fit within specified width
   */
  private static wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
  ): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  /**
   * Generate a cache key for the OG image
   */
  static generateCacheKey(post: BlogPostMeta): string {
    const titleHash = Buffer.from(post.title).toString('base64').replace(/[/+=]/g, '');
    return `og-${post.slug}-${titleHash.substring(0, 8)}.png`;
  }
}
