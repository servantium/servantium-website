import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // ── Vite plugins ──
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    mdx(),
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
