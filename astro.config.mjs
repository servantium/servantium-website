import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // ── Vite plugins ──
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    // Starlight stays for now — removed in Phase 3 (Grove migration)
    starlight({
      title: 'Servantium',
      logo: {
        src: './src/assets/logo.png',
        alt: 'Servantium',
        replacesTitle: true,
      },
      favicon: '/favicon-32.png',
      social: [
        { icon: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/company/servantium' },
        { icon: 'email', label: 'Email', href: 'mailto:hello@servantium.com' },
      ],
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Welcome', slug: 'help' },
            { label: 'Quick Start', slug: 'help/quick-start' },
            { label: 'Key Concepts', slug: 'help/key-concepts' },
          ],
        },
        {
          label: 'Using Servantium',
          items: [
            { label: 'Engagements', slug: 'help/guides/engagements' },
            { label: 'Quotes & Pricing', slug: 'help/guides/quotes-pricing' },
            { label: 'Resource Planning', slug: 'help/guides/resource-planning' },
            { label: 'Documents & Proposals', slug: 'help/guides/documents' },
            { label: 'Notes & AI', slug: 'help/guides/notes-ai' },
          ],
        },
        {
          label: 'Release Notes',
          autogenerate: { directory: 'help/release-notes' },
        },
        {
          label: 'Support',
          items: [
            { label: 'Contact Us', slug: 'help/support/contact' },
            { label: 'FAQ', slug: 'help/support/faq' },
          ],
        },
      ],
      components: {
        Header: './src/components/starlight/Header.astro',
        Footer: './src/components/starlight/Footer.astro',
      },
      customCss: ['./src/styles/starlight-custom.css'],
      editLink: {
        baseUrl: 'https://github.com/servantium/servantium-website/edit/main/',
      },
      lastUpdated: true,
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      // Fonts self-hosted via @fontsource (imported in BaseLayout) — no Google Fonts
      head: [],
      disable404Route: true,
    }),
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
