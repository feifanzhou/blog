import { watch } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __dirname = join(fileURLToPath(import.meta.url), '../..');

let isBuilding = false;

async function buildCSS() {
  if (isBuilding) return;
  isBuilding = true;
  
  try {
    console.log('🔄 Building CSS...');
    await execAsync('tsx src/scripts/build-css.ts', { cwd: join(__dirname, '..') });
    console.log('✓ CSS rebuilt');
  } catch (error) {
    console.error('❌ CSS build failed:', error);
  } finally {
    isBuilding = false;
  }
}

console.log('👀 Watching for CSS changes...');

// Watch for changes in source CSS files
watch(join(__dirname, 'styles'), { recursive: true }, (_eventType, filename) => {
  if (filename && (filename.endsWith('.css') || filename.endsWith('.scss'))) {
    console.log(`📝 ${filename} changed`);
    buildCSS();
  }
});

// Watch for changes in template files
watch(join(__dirname, '../views'), { recursive: true }, (_eventType, filename) => {
  if (filename && filename.endsWith('.ejs')) {
    console.log(`📝 Template ${filename} changed`);
    buildCSS();
  }
});

// Watch for changes in TypeScript files
watch(join(__dirname), { recursive: true }, (_eventType, filename) => {
  if (filename && filename.endsWith('.ts')) {
    console.log(`📝 TypeScript ${filename} changed`);
    buildCSS();
  }
});

// Watch for changes in markdown files
watch(join(__dirname, '../posts'), { recursive: true }, (_eventType, filename) => {
  if (filename && filename.endsWith('.md')) {
    console.log(`📝 Post ${filename} changed`);
    buildCSS();
  }
});

// Initial build
buildCSS();

// Keep the process running
process.on('SIGINT', () => {
  console.log('\n👋 Stopping CSS watcher...');
  process.exit(0);
});
