# Verdant + Grove Audit

> Comprehensive audit of the Servantium design system and documentation framework.
> Generated 2026-04-01.

---

## 1. Component Inventory

### Theme Components (`src/theme/components/`)

| Component | Status | Notes |
|-----------|--------|-------|
| `Breadcrumbs.astro` | Implemented and working | JSON-LD schema, ARIA breadcrumb nav |
| `FAQ.astro` | Implemented and working | Progressive enhancement with details/summary, CSS grid animation |
| `MetricCard.astro` | Implemented and working | Animated count-up via IntersectionObserver |
| `PageReveal.astro` | Implemented and working | CSS keyframe hero choreography, prefers-reduced-motion respected |
| `ScrollReveal.astro` | Implemented and working | IntersectionObserver with 5 animation types, GPU-hinted, prefers-reduced-motion |
| `SkipLink.astro` | Implemented and working | sr-only until focused, green pill style |
| `VideoEmbed.astro` | Implemented and working | YouTube/Loom/native, responsive aspect ratio |

**Missing components (should exist for scale):**

| Component | Priority | Rationale |
|-----------|----------|-----------|
| `Button.astro` | Medium | Buttons are defined in global.css as `.btn-*` classes; a component would enforce consistency |
| `Card.astro` | Medium | Card patterns repeat across pages; a shared component would reduce duplication |
| `Badge.astro` | Low | Badge patterns appear in blog categories and release notes; currently inline |
| `Modal.astro` | Low | Currently only used by search; would be useful for future features |
| `Toast.astro` | Low | No notification/toast pattern exists yet |
| `Testimonial.astro` | Low | Needed when customers collection has content |

### Blog Components (`src/theme/blog/`)

| Component | Status | Notes |
|-----------|--------|-------|
| `BlogCard.astro` | Implemented and working | Container queries, hover animations |
| `BlogFilters.astro` | Implemented and working | Category + tag filtering |
| `BlogPagination.astro` | Implemented and working | Page-based pagination |
| `BlogSearch.astro` | Implemented and working | Pagefind search for blog |
| `BlogTOC.astro` | Implemented and working | In-article table of contents |
| `BubbleGrid.astro` | Implemented and working | Alternative blog grid layout |
| `FeaturedPost.astro` | Implemented and working | Hero-style featured post card |
| `RelatedPosts.astro` | Implemented and working | Related posts section |
| `ShareSidebar.astro` | Implemented and working | Social sharing (LinkedIn, X, Facebook, Reddit, WhatsApp, email) |

### Grove Components (`src/theme/grove/`)

| Component | Status | Notes |
|-----------|--------|-------|
| `DocsLayout.astro` | Implemented and working | Full 3-column layout with mobile drawer |
| `DocsSidebar.astro` | Implemented and working | Collapsible sections, autogenerate, active state |
| `DocsSearch.astro` | Implemented and working | Pagefind with Cmd+K, lazy loading |
| `DocsAside.astro` | Implemented and working | 4 variants: tip, note, caution, danger |
| `DocsPagination.astro` | Implemented and working | Prev/next with hover effects |
| `DocsSteps.astro` | Implemented and working | Numbered steps with connecting line |
| `DocsTabs.astro` | Implemented and working | ARIA tab roles, data-tab-content switching |
| `TableOfContents.astro` | Implemented and working | Scroll-spy via IntersectionObserver |
| `ReleaseTimeline.astro` | Implemented and working | Vertical timeline with dots and cards |
| `components.ts` | Implemented and working | Re-exports Aside, Steps, Tabs for MDX |

### Site Components (`src/components/`)

| Component | Status | Notes |
|-----------|--------|-------|
| `Nav.astro` | Implemented and working | Fixed nav with active page highlight |
| `Footer.astro` | Implemented and working | Multi-column with copy-to-clipboard email |
| `CookieConsent.astro` | Implemented and working | Cookie banner with consent gating for analytics |
| `SEO.astro` | Implemented and working | Meta tags, Open Graph, JSON-LD |
| `TestEnvBanner.astro` | Implemented and working | Orange banner + noindex on test subdomain |
| `HeroMockup.astro` | Implemented and working | Homepage hero visual |
| `CalBooker.tsx` | Implemented and working | React component for Cal.com embed |

---

## 2. Design Token Coverage

### Colors

| Token Category | Defined in verdant.css | Coverage |
|----------------|----------------------|----------|
| Brand greens (green through mint-tint) | 10 shades | Complete |
| Accent colors (coral, slate-blue, amber, deep-teal, slate) | 5 colors | Complete |
| Semantic (success, warning, danger, info) | 4 colors | Complete |
| Neutrals (ink, ink-light, ink-muted, white, mist-grey, cloud-grey) | 6 values | Complete |

**Note:** `global.css` duplicates all color tokens as `--color-servantium-green` and `--color-*` CSS custom properties. This creates two sources of truth -- Verdant `@theme` tokens and global.css `:root` vars. Components use a mix of both.

### Typography

| Token | Defined | Used |
|-------|---------|------|
| `--font-display` (Playfair Display) | Yes | Yes, in headings |
| `--font-body` (Source Sans 3) | Yes | Yes, in body text |

Font weights imported: 400, 400-italic, 500, 600 for Playfair; 400, 500, 600 for Source Sans 3.

### Spacing

| Token | Defined | Notes |
|-------|---------|-------|
| `--v-space-xs` through `--v-space-3xl` | Yes (7 values) | Namespaced with `--v-` prefix to avoid Tailwind collision |

**Note:** `global.css` also defines `--space-xs` through `--space-3xl` (without prefix). Both exist and are used in different places. The `global.css` versions are used by legacy `.container` and `section` styles.

### Animation

| Token | Defined | Notes |
|-------|---------|-------|
| `--ease-out` | Yes | Used by ScrollReveal |
| `--ease-spring` | Yes | Used by PageReveal, ScrollReveal |
| `--ease-bounce` | Yes | Used by BlogCard |

### Layout

| Token | Defined | Location |
|-------|---------|----------|
| `--max-width` (1320px) | Yes | verdant.css `:root` (outside @theme) |
| `--content-width` (1140px) | Yes | verdant.css `:root` (outside @theme) |

---

## 3. Grove Completeness (vs. Starlight)

| Feature | Status | Implementation |
|---------|--------|---------------|
| Sidebar navigation | Done | `DocsSidebar.astro` with collapsible sections and autogenerate |
| Table of Contents | Done | `TableOfContents.astro` with scroll-spy |
| Search | Done | `DocsSearch.astro` using Pagefind with Cmd+K |
| Aside/Callouts | Done | `DocsAside.astro` with tip/note/caution/danger |
| Steps | Done | `DocsSteps.astro` with numbered circles and connecting line |
| Tabs | Done | `DocsTabs.astro` with ARIA roles |
| Pagination | Done | `DocsPagination.astro` with prev/next |
| Edit link | Done | Built into `DocsLayout.astro` footer |
| Last updated | Done | Built into `DocsLayout.astro` footer |
| Mobile sidebar | Done | Drawer with overlay, toggle FAB, escape to close |
| Prose typography | Done | Full `.grove-prose` styles in `DocsLayout.astro` scoped styles |
| Code blocks | Done | Dark theme with syntax highlighting |
| Breadcrumbs | Not in Grove | Available as separate `Breadcrumbs.astro` but not wired into DocsLayout |
| i18n | Not implemented | Not needed currently |
| Versioned docs | Not implemented | Not needed currently |
| Component storybook | Not implemented | No isolated component documentation |

---

## 4. Content Collection Schema Audit

### Blog Schema

| Field | Type | Required | Used in Templates |
|-------|------|----------|-------------------|
| `title` | string | Yes | BlogCard, FeaturedPost, [slug].astro |
| `description` | string | Yes | BlogCard, meta tags |
| `date` | string | Yes | BlogCard, sorting |
| `author` | string | Yes | BlogCard, author pages |
| `authorRole` | string | No | Not visibly used in any template |
| `category` | string | Yes | BlogCard, BlogFilters, category/[slug] |
| `image` | string | No | BlogCard, FeaturedPost, OG image |
| `imageAlt` | string | No | BlogCard alt text |
| `readingTime` | string | No | BlogCard, blog post header |
| `tags` | string[] | No (default []) | BlogFilters, BlogCard data attributes |
| `draft` | boolean | No (default false) | Filtering in blog listing |

**Observation:** `authorRole` is defined in schema but does not appear to be rendered anywhere. The `author` field is a plain string rather than a reference to the authors collection -- the comment in the schema notes this is intentional for now.

### Docs Schema

| Field | Type | Required | Used |
|-------|------|----------|------|
| `title` | string | Yes | DocsLayout header, sidebar |
| `description` | string | No | DocsLayout subtitle, meta |
| `badge` | object | No | Not visibly rendered in DocsLayout (used by ReleaseTimeline) |
| `hero` | object | No | Not rendered -- carried over from Starlight, unused |
| `date` | string | No | Release notes sorting, last updated |
| `version` | string | No | ReleaseTimeline version badge |
| `repo` | string | No | Not visibly used in any template |
| `featured` | boolean | No | Help index featured cards |
| `featuredIcon` | string | No | Help index featured card icons |
| `featuredLabel` | string | No | Help index featured card labels |

**Observation:** The `hero` and `repo` fields appear unused. `hero` was likely carried over from a Starlight migration and could be removed unless there are plans to use it.

### Authors Schema

| Field | Type | Required | Used |
|-------|------|----------|------|
| `name` | string | Yes | Author pages, blog bylines |
| `role` | string | Yes | Author pages |
| `avatar` | string | Yes | Author pages, blog bylines |
| `linkedin` | string | No | Author pages |
| `twitter` | string | No | Not used (no Twitter/X account) |
| `bio` | string | No | Author pages |

### Future Collections

- **customers**: Schema complete. No content yet.
- **integrations**: Schema complete. No content yet.
- **press**: Schema complete. No content yet.

---

## 5. Accessibility Audit (WCAG 2.1 AA)

| Criterion | Status | Details |
|-----------|--------|---------|
| Skip link | Done | `SkipLink.astro` (sr-only focus:not-sr-only) in BaseLayout; `DocsLayout` has its own inline skip link |
| Keyboard navigation | Done | Details/summary for sidebar, focus management in search modal, Escape closes drawers |
| ARIA attributes | Done | `aria-label` on nav landmarks, `aria-current="page"` on active links, `role="tablist"` on tabs, `aria-expanded` on mobile toggle |
| Focus indicators | Partial | Search input has custom focus ring (`ring-2 ring-green`). Default browser focus outlines are not explicitly styled for all interactive elements -- some may rely on browser defaults which vary |
| Color contrast | Mostly done | Primary text (#0D0D0D on white) passes AAA. Muted text (#6b6b6b on white) passes AA at 4.77:1. Slate-400 text in sidebar (#94a3b8 on white) is 3.26:1 which fails AA for normal text -- only passes for large text |
| `prefers-reduced-motion` | Done | Both PageReveal and ScrollReveal respect it. CSS animations and transitions are disabled. |
| Semantic HTML | Done | Proper use of `nav`, `main`, `article`, `header`, `footer`, `details/summary` |
| Image alt text | Partial | Blog images use `imageAlt` frontmatter but it is optional -- images without alt text fall back to title |
| Link purpose | Done | Links have descriptive text; icon-only links have aria-labels |
| Form labels | Done | Search inputs have aria-labels |

**Issues to address:**

1. Sidebar link text color (slate-400/slate-500) may not meet AA contrast on white background for smaller text sizes
2. Focus indicators should be explicitly styled site-wide rather than relying on browser defaults
3. `imageAlt` should be required in blog schema, not optional

---

## 6. Performance Checklist

| Criterion | Status | Details |
|-----------|--------|---------|
| Self-hosted fonts | Done | Fontsource packages, no external Google Fonts requests |
| Image optimization | Partial | Blog images use external Unsplash URLs (not processed by Astro). Favicons and author photos are static PNGs in public/. No `<Image>` component usage for optimized formats (WebP/AVIF). |
| Build compression | Partial | Cloudflare Pages provides Brotli/gzip automatically. No explicit Astro compression config. |
| Prefetch enabled | Done | `prefetchAll: true` with `defaultStrategy: 'hover'` in astro.config.mjs |
| CSS layer isolation | Partial | `global.css` uses `@layer base` for resets. Verdant uses Tailwind v4 `@theme`. No explicit `@layer` for component styles. |
| Pagefind lazy loading | Done | Search JS only loads on first interaction |
| Cal.com embed | Working | Inline script loads on every page -- could be deferred to pages that need it |
| Font subsetting | Not done | Full font files are imported; no subset optimization |
| Critical CSS | Not done | Astro handles CSS extraction but no explicit critical CSS inlining |

**Root-level image files that should move to `public/` or `src/assets/`:**

The repo root contains several large image files that appear to be leftovers from the old static HTML site:
- `apple-touch-icon.png` (27KB) -- duplicate of `public/apple-touch-icon.png`
- `christopher-veale.png` (266KB) -- duplicate of `public/christopher-veale.png`
- `favicon-192.png` (30KB) -- duplicate of `public/favicon-192.png`
- `favicon-32.png` (2KB) -- duplicate of `public/favicon-32.png`
- `favicon-512.png` (127KB) -- duplicate of `public/favicon-512.png`
- `icon.png` (104KB) -- duplicate of `public/icon.png`
- `logo.png` (86KB) -- also exists as `src/assets/logo.png`
- `maxwell-friel.png` (210KB) -- duplicate of `public/maxwell-friel.png`
- `og-image.png` (497KB) -- duplicate of `public/og-image.png`

Total: ~1.35MB of duplicate images in the repo root.

**Other stale directories from old static site:**

- `css/` -- contains only an empty `pages/` subdirectory
- `css/pages/` -- empty
- `js/asteroids.js` -- old location; now at `public/js/asteroids.js`
- `js/pages/` -- empty
- `internal/signature.html` -- email signature file, not part of the website
- `public/blog/` -- empty directory
- `public/images/` -- empty directory

---

## 7. Missing for Scale

### Widget Library Completeness

Current widget coverage is solid for a marketing site + docs. Gaps for future growth:

| Widget | Priority | When Needed |
|--------|----------|-------------|
| `PricingTable.astro` | High | When pricing page is built (currently inline in homepage) |
| `IntegrationCard.astro` | Medium | When integrations collection has content |
| `CustomerLogo.astro` | Medium | When customers collection has content |
| `TestimonialCard.astro` | Medium | When customer quotes are available |
| `Changelog.astro` | Low | Alternative to ReleaseTimeline for compact changelogs |
| `StatusBadge.astro` | Low | For integration status and feature availability |
| `ComparisonTable.astro` | Low | For vs-competitor pages |

### Page Template Library

Current page templates:

| Template | Exists | Used By |
|----------|--------|---------|
| BaseLayout | Yes | All marketing pages |
| BlogLayout | Yes | Blog posts |
| DocsLayout (Grove) | Yes | Help docs |

**Missing page templates:**

| Template | Priority | Rationale |
|----------|----------|-----------|
| Landing page template | Medium | For SEO landing pages (e.g., "Professional Services CPQ Solutions") |
| Comparison page template | Low | For vs-competitor content |
| Customer story template | Low | When case studies are written |

### Component Documentation

There is no component documentation system (no Storybook, no design system docs page). Components are documented via JSDoc comments in their frontmatter. For a small team this is adequate, but for scale:

- Consider a `/design` page that renders all Verdant components with props
- Or use Astro's built-in MDX to create a living style guide at `/internal/design`
- The `AUDIT.md` (this file) serves as a partial substitute

### Design Token Documentation

Verdant tokens are defined in `verdant.css` but not documented on any public page. For a design system to scale:

- Create a `/design/tokens` page showing all colors, fonts, spacing
- Or add token documentation to this audit file and keep it updated
- Consider generating token docs from verdant.css automatically

---

## Summary

The Verdant + Grove system is well-built for its current scope. The core marketing site, blog, and documentation framework are functionally complete. Key areas for improvement:

1. **Clean up duplicate files** -- ~1.35MB of root-level images are duplicates of public/ files
2. **Remove stale directories** -- `css/`, `js/` (root level), empty `public/blog/`, `public/images/`
3. **Unify design token sources** -- verdant.css @theme tokens and global.css :root vars overlap
4. **Fix contrast issues** -- sidebar text colors need darkening for AA compliance
5. **Add explicit focus styles** -- ensure all interactive elements have visible focus indicators
6. **Require imageAlt** -- make it required in blog schema
7. **Optimize images** -- use Astro's `<Image>` component for processed images; consider WebP/AVIF
8. **Remove unused schema fields** -- `hero` and `repo` in docs schema appear unused
