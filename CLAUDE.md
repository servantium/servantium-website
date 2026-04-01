# Servantium Website - Claude Context

> Astro 6 marketing site with Verdant design system and Grove documentation framework.

## Project Overview

**Servantium** is a CPQ and engagement management platform for professional services. This repo is the marketing website at `servantium.com`. The app lives at `app.servantium.com` (separate repo).

### Tech Stack

- **Astro 6** - Static site generator with MDX content collections
- **Tailwind CSS v4** - Utility-first CSS via `@tailwindcss/vite` plugin
- **Verdant** - Custom design system (tokens in `src/theme/verdant.css`)
- **Grove** - Custom docs framework replacing Starlight (in `src/theme/grove/`)
- **React 18** - Used only for Cal.com booking embed
- **Fontsource** - Self-hosted Playfair Display + Source Sans 3
- **Pagefind** - Client-side search (generated at build time)
- **Cloudflare Pages** - Hosting with global CDN
- **GitHub Actions** - CI/CD (`build.yml`, `release-notes.yml`)

## File Structure

```
src/
  theme/
    verdant.css           # Design tokens (@theme block for Tailwind v4)
    components/           # Shared UI: Breadcrumbs, FAQ, MetricCard, PageReveal, ScrollReveal, SkipLink, VideoEmbed
    blog/                 # Blog UI: BlogCard, BlogFilters, BlogPagination, BlogSearch, BlogTOC, BubbleGrid, FeaturedPost, RelatedPosts, ShareSidebar
    grove/                # Docs framework: DocsLayout, DocsSidebar, DocsSearch, DocsAside, DocsPagination, DocsSteps, DocsTabs, TableOfContents, ReleaseTimeline, components.ts
  components/             # Site-wide: Nav, Footer, CookieConsent, SEO, TestEnvBanner, HeroMockup, CalBooker
  layouts/
    BaseLayout.astro      # Standard pages (imports verdant.css + global.css + fonts)
    BlogLayout.astro      # Blog post layout
  pages/                  # Astro file-based routing
    index.astro           # Homepage
    about.astro           # About page
    platform.astro        # Platform page
    blog/                 # Blog listing, [slug], authors/[slug], category/[slug]
    help/                 # Docs: index, [...slug], release-notes/index
    privacy.astro, terms.astro, 404.astro
    rss.xml.ts            # RSS feed
  content/                # MDX/MD content collections
    blog/                 # ~30 blog posts (MDX)
    authors/              # Author profiles (MD)
    docs/help/            # Help docs, guides, release notes, support (MDX)
    customers/            # Future (empty, .gitkeep)
    integrations/         # Future (empty, .gitkeep)
    press/                # Future (empty, .gitkeep)
  content.config.ts       # Collection schemas (docs, authors, blog, customers, integrations, press)
  data/
    docs-nav.ts           # Grove sidebar navigation config
    authors.ts            # Author data
    metrics.ts            # Homepage metrics
    strings.ts            # UI strings
  styles/
    global.css            # Base styles, buttons, typography, skip-link
    home.css              # Homepage-specific styles
  assets/
    logo.png              # Logo (processed by Astro)
public/                   # Static assets (copied as-is to dist/)
  *.png                   # Favicons, OG image, author photos, logo
  llms.txt                # AI search visibility
  robots.txt              # Crawler rules
  _headers                # Cloudflare security headers
  _redirects              # Cloudflare redirects
  js/asteroids.js         # Easter egg game
```

## Design System: Verdant

All tokens are in `src/theme/verdant.css` as Tailwind v4 `@theme` values.

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `green` | `#00C26D` | Primary brand, CTAs |
| `green-hover` | `#00A95E` | Interactive hover states |
| `deep-forest` | `#023E25` | Deep backgrounds |
| `soft-mint` | `#E8FBF1` | Light tinted backgrounds |
| `mint-tint` | `#F3FCF8` | Subtle backgrounds |
| `ink` | `#0D0D0D` | Body text |
| `ink-light` | `#3d3d3d` | Secondary text |
| `ink-muted` | `#6b6b6b` | Tertiary text |
| `mist-grey` | `#F5F6F7` | Light backgrounds |
| `cloud-grey` | `#E1E3E6` | Borders |

**Accents:** coral `#FF5C70`, slate-blue `#4C82A7`, amber `#FFB02E`, deep-teal `#26A899`

**Semantic:** success = green, warning = amber, danger = coral, info = slate-blue

### Typography

- **Display:** `font-display` = Playfair Display (serif) - headings
- **Body:** `font-body` = Source Sans 3 (sans-serif) - everything else
- h1: `clamp(2.5rem, 5vw, 3.5rem)`, h2: `clamp(2rem, 4vw, 2.75rem)`

### Spacing (namespaced as `--v-space-*`)

`xs: 0.5rem`, `sm: 1rem`, `md: 1.5rem`, `lg: 2.5rem`, `xl: 4rem`, `2xl: 6rem`, `3xl: 8rem`

### Animation Easing

- `--ease-out`: snappy settle
- `--ease-spring`: spring-like overshoot
- `--ease-bounce`: card lift with overshoot

## Grove Documentation Framework

Custom replacement for Starlight. Components in `src/theme/grove/`.

| Feature | Component | Status |
|---------|-----------|--------|
| Layout | `DocsLayout.astro` | Full 3-column: sidebar, content, TOC |
| Sidebar | `DocsSidebar.astro` | Collapsible sections, autogenerate from dirs |
| Search | `DocsSearch.astro` | Pagefind with Cmd+K shortcut |
| TOC | `TableOfContents.astro` | Scroll-spy with IntersectionObserver |
| Aside/Callouts | `DocsAside.astro` | tip, note, caution, danger variants |
| Steps | `DocsSteps.astro` | Numbered steps with green circles + connecting line |
| Tabs | `DocsTabs.astro` | Tab switcher with ARIA roles |
| Pagination | `DocsPagination.astro` | Prev/next navigation |
| Release Timeline | `ReleaseTimeline.astro` | Vertical timeline for release notes |
| Component Exports | `components.ts` | Re-exports Aside, Steps, Tabs for MDX import |

Sidebar nav config: `src/data/docs-nav.ts`

## Content Collections

Defined in `src/content.config.ts`. All use Astro's `glob` loader.

### Blog (`src/content/blog/*.mdx`)

Required frontmatter: `title`, `description`, `date`, `author`, `category`
Optional: `image`, `imageAlt`, `readingTime`, `tags`, `draft`

### Docs (`src/content/docs/help/**/*.mdx`)

Required: `title`
Optional: `description`, `badge`, `hero`, `date`, `version`, `repo`, `featured`, `featuredIcon`, `featuredLabel`

### Authors (`src/content/authors/*.md`)

Required: `name`, `role`, `avatar`
Optional: `linkedin`, `twitter`, `bio`

### Future Collections (schemas defined, content empty)

- **customers** - Case studies with metrics and quotes
- **integrations** - Third-party integration cards with status
- **press** - Press mentions and articles

## Build & Deploy

```bash
npm install          # Install dependencies
npm run dev          # Dev server (localhost:4321)
npm run build        # Production build to dist/
npm run preview      # Preview production build locally
```

### Environments

| Environment | Domain | Branch |
|-------------|--------|--------|
| Production | servantium.com | `main` |
| Test | test.servantium.com | `develop` |

Test environment auto-injects noindex meta, disables analytics, shows orange banner.

### GitHub Actions

- `build.yml` - Build verification on push
- `release-notes.yml` - Auto-generates release note MDX from GitHub releases

### Branch Strategy

- `main` - Production (auto-deploys to servantium.com)
- `develop` - Pre-production testing (auto-deploys to test.servantium.com)
- `feature/*` - Feature branches (merge to develop)

## Common Tasks

### Add a blog post

1. Create `src/content/blog/your-slug.mdx`
2. Add frontmatter: title, description, date, author, category
3. Write content in MDX (can import Grove components)
4. Images: use Unsplash URLs with `?w=1200&h=630&fit=crop` for OG compatibility

### Add a help doc

1. Create `src/content/docs/help/guides/your-doc.mdx` (or appropriate subdirectory)
2. Add frontmatter: title, description
3. Add to sidebar in `src/data/docs-nav.ts` (or use autogenerate for release-notes)
4. Use Grove components in MDX: `import { Aside, Steps, Tabs } from '@/theme/grove/components';`

### Add a release note

Auto-generated by `release-notes.yml` GitHub Action from GitHub releases. Or manually:
1. Create `src/content/docs/help/release-notes/YYYY-MM-DD-slug.mdx`
2. Add frontmatter: title, description, date, version (optional)
3. Release notes auto-list via `autogenerate: 'release-notes'` in docs-nav

### Add a new page

1. Create `src/pages/your-page.astro`
2. Use `BaseLayout` and pass `activePage` prop for nav highlighting
3. Import `SEO` component for meta tags
4. Use Verdant tokens and Tailwind utilities for styling

## Company Info

- **Email:** hello@servantium.com
- **Address:** 1111B S Governors Ave STE 48074, Dover, DE 19904
- **Founders:** Christopher Veale (CEO), Maxwell Friel (CTO)
- **Cal.com namespace:** `servantium-introduction` (15-min demo booking)

## Key Architecture Decisions

- **Self-hosted fonts** via Fontsource (no Google Fonts external requests)
- **Verdant spacing uses `--v-space-*`** prefix to avoid Tailwind collision
- **Two CSS entry points**: `verdant.css` (Tailwind @theme tokens) + `global.css` (base styles with legacy `--color-servantium-green` var)
- **Grove replaces Starlight** for full design control over docs
- **Pagefind** for search (no server-side search needed)
- **React only for Cal.com** embed - everything else is Astro components

---

*Last updated: 2026-04-01*
