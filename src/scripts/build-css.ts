import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = join(fileURLToPath(import.meta.url), '../..');

async function buildCSS() {
  try {
    // Ensure output directory exists
    await mkdir(join(__dirname, '../public/styles'), { recursive: true });
    
    // Read input CSS
    const inputCSS = await readFile(join(__dirname, 'styles/main.css'), 'utf8');
    
    // Process with PostCSS
    const result = await postcss([
      tailwindcss,
      autoprefixer
    ]).process(inputCSS, {
      from: join(__dirname, 'styles/main.css'),
      to: join(__dirname, '../public/styles/main.css')
    });
    
    // Write output CSS
    await writeFile(join(__dirname, '../public/styles/main.css'), result.css);
    
    if (result.map) {
      await writeFile(join(__dirname, '../public/styles/main.css.map'), result.map.toString());
    }
    
    console.log('✓ CSS built successfully');
    
    if (result.warnings().length > 0) {
      console.log('Warnings:');
      result.warnings().forEach((warn) => {
        console.log(warn.toString());
      });
    }
    
  } catch (error) {
    console.error('Error building CSS:', error);
    process.exit(1);
  }
}

buildCSS();
