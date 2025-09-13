#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface ExtractionStats {
  totalFiles: number;
  yearDirectories: string[];
  missingFrontmatter: string[];
  invalidFiles: string[];
  urlMapEntries: number;
}

async function verifyExtraction(): Promise<ExtractionStats> {
  const stats: ExtractionStats = {
    totalFiles: 0,
    yearDirectories: [],
    missingFrontmatter: [],
    invalidFiles: [],
    urlMapEntries: 0
  };

  const postsDir = path.join(process.cwd(), 'posts');
  const urlMapFile = path.join(process.cwd(), 'url-map.json');

  try {
    console.log('🔍 Verifying extraction results...\n');

    // Check if posts directory exists
    try {
      await fs.access(postsDir);
      console.log('✅ Posts directory exists');
    } catch {
      console.log('❌ Posts directory not found');
      return stats;
    }

    // Get year directories
    const entries = await fs.readdir(postsDir, { withFileTypes: true });
    stats.yearDirectories = entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .sort();

    console.log(`📁 Year directories: ${stats.yearDirectories.join(', ')}`);

    // Count files and verify frontmatter
    for (const yearDir of stats.yearDirectories) {
      const yearPath = path.join(postsDir, yearDir);
      const files = await fs.readdir(yearPath);
      const mdFiles = files.filter(file => file.endsWith('.md'));
      
      console.log(`\n📅 ${yearDir}: ${mdFiles.length} posts`);
      stats.totalFiles += mdFiles.length;

      // Verify a few sample files
      const sampleFiles = mdFiles.slice(0, Math.min(3, mdFiles.length));
      
      for (const file of sampleFiles) {
        const filePath = path.join(yearPath, file);
        
        try {
          const content = await fs.readFile(filePath, 'utf8');
          const parsed = matter(content);
          
          const requiredFields = ['title', 'date', 'slug'];
          const missingFields = requiredFields.filter(field => !parsed.data[field]);
          
          if (missingFields.length > 0) {
            stats.missingFrontmatter.push(`${yearDir}/${file}: missing ${missingFields.join(', ')}`);
            console.log(`   ⚠️  ${file}: missing frontmatter fields - ${missingFields.join(', ')}`);
          } else {
            console.log(`   ✅ ${file}: valid frontmatter`);
          }
        } catch (error) {
          stats.invalidFiles.push(`${yearDir}/${file}`);
          console.log(`   ❌ ${file}: invalid file - ${error}`);
        }
      }
    }

    // Check URL map
    try {
      const urlMapContent = await fs.readFile(urlMapFile, 'utf8');
      const urlMap = JSON.parse(urlMapContent);
      stats.urlMapEntries = Object.keys(urlMap).length;
      console.log(`\n🗺️  URL map: ${stats.urlMapEntries} entries`);
    } catch {
      console.log('\n❌ URL map file not found or invalid');
    }

    console.log(`\n📊 Summary:`);
    console.log(`   📁 Year directories: ${stats.yearDirectories.length}`);
    console.log(`   📄 Total posts: ${stats.totalFiles}`);
    console.log(`   🗺️  URL mappings: ${stats.urlMapEntries}`);
    console.log(`   ⚠️  Issues: ${stats.missingFrontmatter.length + stats.invalidFiles.length}`);

    if (stats.missingFrontmatter.length > 0) {
      console.log(`\n⚠️  Files with missing frontmatter:`);
      stats.missingFrontmatter.forEach(issue => console.log(`   - ${issue}`));
    }

    if (stats.invalidFiles.length > 0) {
      console.log(`\n❌ Invalid files:`);
      stats.invalidFiles.forEach(file => console.log(`   - ${file}`));
    }

  } catch (error) {
    console.error('💥 Verification failed:', error);
    throw error;
  }

  return stats;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  verifyExtraction()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { verifyExtraction };
