#!/usr/bin/env node

import { build } from 'esbuild';
import { promises as fs } from 'fs';

const buildConfig = {
  entryPoints: ['src/main.tsx'],
  bundle: true,
  outdir: 'dist',
  format: 'esm',
  target: 'es2020',
  jsx: 'automatic',
  minify: false,
  sourcemap: false,
  splitting: false,
  metafile: false,
  write: true,
  loader: {
    '.png': 'dataurl',
    '.jpg': 'dataurl',
    '.jpeg': 'dataurl',
    '.gif': 'dataurl',
    '.svg': 'text',
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  external: [],
};

async function buildFast() {
  try {
    // Clean dist directory
    await fs.rm('dist', { recursive: true, force: true });
    await fs.mkdir('dist', { recursive: true });
    
    // Build with esbuild
    const result = await build(buildConfig);
    
    // Create index.html
    const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>JobPortal - Find Your Dream Job</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.js"></script>
  </body>
</html>`;
    
    await fs.writeFile('dist/index.html', html);
    
    console.log('✓ Fast build completed');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildFast();