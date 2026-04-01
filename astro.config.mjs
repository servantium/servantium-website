import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // ── Vite plugins ──
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    react(),
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

  // ── Remote image optimization (Unsplash blog thumbnails) ──
  image: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },

  // ── Security ──
  security: {
    checkOrigin: true,
  },
});
