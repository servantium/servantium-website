import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // ── Vite plugins ──
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    mdx(),
    sitemap(),
  ],

  // ── Prefetch: preload pages on hover for near-instant navigation ──
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },

  build: {
    format: 'directory',
  },
  trailingSlash: 'ignore',

  site: 'https://servantium.com',

  // ── Security ──
  security: {
    checkOrigin: true,
  },
});
