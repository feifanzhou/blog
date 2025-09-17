#!/usr/bin/env tsx

import { OGImageGenerator } from '../lib/ogImageGenerator.js';
import { BlogPostMeta } from '../types/index.js';
import fs from 'fs/promises';
import path from 'path';

// Test data
const testPost: BlogPostMeta = {
  title: 'Building Dynamic OG Images for Blog Posts',
  date: '2025-01-15',
  published: true,
  tags: ['web-development', 'node.js', 'canvas'],
  author: 'Feifan Zhou',
  slug: 'test-og-image-generation',
  excerpt: 'Learn how to dynamically generate beautiful Open Graph images for your blog posts using Canvas and Node.js. We\'ll create vintage magazine-style social media previews that match your site\'s aesthetic.',
};

async function testOGGeneration() {
  try {
    console.log('🖼️  Testing OG image generation...');
    
    // Generate the image
    const imageBuffer = await OGImageGenerator.generateOGImage(testPost);
    
    // Save test image
    const outputPath = path.join(process.cwd(), 'test-og-image.png');
    await fs.writeFile(outputPath, imageBuffer);
    
    console.log(`✅ Success! Test OG image saved to: ${outputPath}`);
    console.log(`📊 Image size: ${imageBuffer.length} bytes`);
    
    // Test cache key generation
    const cacheKey = OGImageGenerator.generateCacheKey(testPost);
    console.log(`🔑 Cache key: ${cacheKey}`);
    
  } catch (error) {
    console.error('❌ Error generating OG image:', error);
    process.exit(1);
  }
}

testOGGeneration();
