// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  integrations: [svelte()],
  site: 'https://perseusmx.github.io',
  base: '/',
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true
    }
  },
  build: {
    // Inline all stylesheets to eliminate render-blocking CSS
    inlineStylesheets: 'always'
  },
  vite: {
    build: {
      // Ensure small CSS files are always inlined
      assetsInlineLimit: 0,
      // Add content hash to filenames for cache busting
      rollupOptions: {
        output: {
          // Add content hash to chunk names for better caching
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        }
      }
    }
  }
});