# Servantium Website

The marketing website for [Servantium](https://servantium.com) -- the operating system for professional services.

![Astro](https://img.shields.io/badge/Astro-6-BC52EE?logo=astro&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)
![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-F38020?logo=cloudflare&logoColor=white)

## Quick Start

```bash
npm install        # Install dependencies
npm run dev        # Start dev server at localhost:4321
npm run build      # Production build to dist/
npm run preview    # Preview production build
```

## Project Structure

```
src/
  theme/
    verdant.css         # Verdant design system tokens
    components/         # Shared UI components (FAQ, ScrollReveal, etc.)
    blog/               # Blog components (cards, filters, pagination)
    grove/              # Grove docs framework (sidebar, search, TOC, callouts)
  components/           # Site-wide components (Nav, Footer, SEO)
  layouts/              # BaseLayout, BlogLayout
  pages/                # Astro file-based routing
  content/              # MDX/MD content collections (blog, docs, authors)
  data/                 # Sidebar nav, author data, metrics, strings
  styles/               # Global CSS and page-specific styles
public/                 # Static assets (favicons, images, robots.txt)
```

### Design System

**Verdant** is the custom design system. Tokens are defined in `src/theme/verdant.css` as Tailwind v4 `@theme` values -- colors, typography, spacing, and animation easing curves.

### Documentation Framework

**Grove** is a custom docs framework replacing Starlight, providing full design control. Components live in `src/theme/grove/` and include sidebar navigation, Pagefind search, table of contents with scroll-spy, callout boxes, step wizards, and tabs.

## Deployment

Hosted on Cloudflare Pages with automatic deployments from GitHub.

| Environment | Domain | Branch |
|-------------|--------|--------|
| Production | servantium.com | `main` |
| Test | test.servantium.com | `develop` |

GitHub Actions run build verification and auto-generate release notes.

## Contributing

### Branch Strategy

- `main` -- Production. Auto-deploys to servantium.com.
- `develop` -- Pre-production testing. Auto-deploys to test.servantium.com.
- `feature/*` -- Feature branches. Create from `develop`, merge back to `develop`.

### Adding Content

- **Blog posts:** Create MDX files in `src/content/blog/`
- **Help docs:** Create MDX files in `src/content/docs/help/`
- **Release notes:** Auto-generated from GitHub releases, or create manually in `src/content/docs/help/release-notes/`

See `CLAUDE.md` for detailed development context and architecture notes.

## License

All rights reserved. Copyright 2026 Servantium Inc.
