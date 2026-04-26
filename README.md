# Servantium Website

Marketing site for [Servantium](https://servantium.com) — the operating system for professional services firms.

| Branch | Domain | Purpose |
|---|---|---|
| `main` | https://servantium.com + https://www.servantium.com | Production |
| `develop` | https://test.servantium.com | Preview / QA |

![Astro](https://img.shields.io/badge/Astro-6-BC52EE?logo=astro&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)
![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-F38020?logo=cloudflare&logoColor=white)

## Repo layout

```
servantium-website/
├── .design-system-ref            # pins @servantium/grove + verdant to a tag or SHA
├── astro.config.mjs              # Astro config (React for Cal.com, MDX, sitemap, Tailwind v4)
├── package.json                  # deps via file: → vendor/design-system/packages/*
├── tsconfig.json                 # @/* path alias
├── docs/
│   └── publishing-pipeline/      # (legacy — moved to servantium-help)
├── public/                       # favicons, OG image, _headers, _redirects, logos, robots.txt, llms.txt
├── scripts/
│   └── bust-pagefind-cache.mjs   # forces Pagefind assets to re-fetch on deploy
├── src/
│   ├── assets/logo.png           # processed by Astro image pipeline
│   ├── components/               # Nav, Footer, SEO, HeroMockup, CookieConsent, TestEnvBanner, CalBooker, ResourceIcons
│   ├── content/                  # MDX content collections:
│   │   ├── blog/                 #   blog posts (5 published, rest status: hidden pending launch)
│   │   ├── authors/              #   author profiles (referenced by blog + future help)
│   │   ├── comparisons/          #   "X vs Y" comparison pages (hidden)
│   │   ├── customers/            #   case studies (hidden until approved)
│   │   ├── integrations/         #   empty for now
│   │   ├── press/                #   empty for now
│   │   └── resources/            #   resources/templates/guides (hidden pending approval)
│   ├── content.config.ts         # collection schemas (Zod)
│   ├── data/
│   │   ├── authors.ts            # author display data
│   │   ├── metrics.ts            # homepage stat counters
│   │   └── strings.ts            # shared copy strings
│   ├── layouts/
│   │   ├── BaseLayout.astro      # standard page shell (imports Verdant + global.css + fonts)
│   │   └── BlogLayout.astro      # blog post template
│   ├── lib/content-filter.ts     # filter by status (published|draft|hidden) at build time
│   ├── pages/                    # file-based routes:
│   │   ├── index.astro           #   /
│   │   ├── about.astro           #   /about
│   │   ├── platform/             #   /platform
│   │   ├── blog/                 #   /blog, /blog/[slug], /blog/category/[slug], /blog/authors/[slug]
│   │   ├── compare/              #   /compare, /compare/[slug]
│   │   ├── resources/            #   /resources + subdirs
│   │   ├── rss.xml.ts            #   /rss.xml
│   │   ├── 404.astro, privacy.astro, terms.astro
│   │   └── api/                  #   API routes (pipeline, search, etc.)
│   ├── styles/                   # global.css + home.css
│   └── theme/                    # site-level shared UI (components, blog widgets, home widgets)
├── vendor/                       # GITIGNORED — design-system cloned at build time
└── .github/workflows/
    ├── build.yml                 # CI build verification (runs on every push to main/develop)
    └── update-design-system.yml  # auto-bump .design-system-ref on dispatch from design-system
```

## Quick start

```bash
# Bring in the design-system
git clone https://github.com/servantium/servantium-design-system.git vendor/design-system
cd vendor/design-system && git checkout $(cat ../../.design-system-ref) && cd ../..

# Install + run
npm install
npm run dev              # http://localhost:4321
npm run build            # builds to dist/, runs Pagefind indexing
```

Cloudflare Pages does the same three steps automatically on every push.

## Design tokens + docs components

Tokens and docs components come from [servantium-design-system](https://github.com/servantium/servantium-design-system):

- `@servantium/verdant` — CSS custom properties (colors, typography, spacing)
- `@servantium/grove` — Astro components for documentation (used here mainly for blog-adjacent pages that share docs ergonomics; most docs live in `servantium-help`)

Both are consumed via `file:` protocol pointing at `vendor/design-system/packages/*`, which is cloned fresh on every CI/Cloudflare build at the version in `.design-system-ref`.

## Deploy flow

```
feature/xxx branch                          develop branch                       main branch
  ─────────────────────►  PR  ─────────────────────►   PR   ────────────────────►
        │                        │                              │
        ▼                        ▼                              ▼
  *.servantium-website       test.servantium.com           servantium.com
  -a9a.pages.dev                                           www.servantium.com
   (per-branch preview)       (preview)                     (production)
```

- Any push to a `feature/*` branch gets a unique `*.pages.dev` preview URL
- Merging to `develop` updates `test.servantium.com`
- Merging to `main` updates `servantium.com` + `www.servantium.com`

## Content status

All content collections support a `status` field: `published` (default), `draft` (visible on test.* only), `hidden` (never visible). Controlled by `src/lib/content-filter.ts`. This is how pre-launch content is staged.

## Design-system updates

When design-system publishes a new tag, it fires a `repository_dispatch` event here. The `update-design-system.yml` workflow opens a PR against `develop` bumping `.design-system-ref`. Merge the PR to preview the update on test.servantium.com; then promote `develop` → `main`.

## Help docs

Help content lives in a separate repo: [servantium-help](https://github.com/servantium/servantium-help), deployed to help.servantium.com. This site redirects `/help/*` there (see `public/_redirects`).

## Other docs

| File | Purpose |
|---|---|
| [`CLAUDE.md`](CLAUDE.md) | Architecture + design-system reference (read this for any non-trivial change) |
| [`docs/HANDOFF.md`](docs/HANDOFF.md) | Marketing/CMO handoff: positioning, content plan, 30-day execution |
| [`docs/SEO.md`](docs/SEO.md) | SEO + AEO living plan and target query map |
| [`docs/ROLLBACK.md`](docs/ROLLBACK.md) | Three-tier promotion flow + rollback runbook |

## License

All rights reserved. Copyright 2026 Servantium Inc.

---

## Content authoring reference

All content collections live under `src/content/` and are validated at build time by Zod schemas in `src/content.config.ts`. Here's the field reference for each collection.

### Shared fields (most collections)

| Field | Type | Default | Description |
|---|---|---|---|
| `status` | enum | `published` | `published` (live everywhere), `draft` (only on test.servantium.com), `hidden` (never visible; file stays in repo). Controlled by `src/lib/content-filter.ts`. |
| `featured` | boolean | `false` | Surfaces the item in hero/featured slots on listing pages. |
| `tags` | string[] | `[]` | Free-form tags for filtering + related content. |

### Blog — `src/content/blog/*.mdx`

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | ✓ | Post `<title>` and `<h1>`. |
| `description` | string | ✓ | SEO meta + post subheader + listing excerpt. 120-160 chars. |
| `date` | string (ISO) | ✓ | Publish date. Drives chronological ordering on `/blog`. |
| `author` | string | ✓ | Must match an author ID in `src/content/authors/` (e.g. `christopher-veale`). |
| `authorRole` | string | — | Optional override for author's title on this post. |
| `category` | string | ✓ | Category slug (used for `/blog/category/[slug]`). |
| `image` | string | — | OG image URL. Use Unsplash with `?w=1200&h=630&fit=crop` for ideal aspect ratio. |
| `imageAlt` | string | — | Accessibility alt text for the OG image. |
| `readingTime` | string | — | Display string like "7 min read". |
| `tags` | string[] | `[]` | — |
| `draft` | boolean | `false` | Legacy field; prefer `status: draft`. Kept for compatibility. |
| `status` | enum | `published` | See shared fields. |

### Authors — `src/content/authors/*.md`

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | ✓ | Display name. |
| `role` | string | ✓ | Title (shown under author name). |
| `avatar` | string | ✓ | Path to avatar image in `public/`. |
| `linkedin` | string | — | Profile URL. |
| `twitter` | string | — | Profile URL or handle. |
| `bio` | string | — | Short bio shown on author page. |

### Resources — `src/content/resources/*.mdx`

Lead magnets: templates, calculators, guides, playbooks, checklists, ebooks.

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | ✓ | Card title + page heading. |
| `description` | string | ✓ | Card blurb + SEO description. |
| `type` | enum | ✓ | `template` \| `calculator` \| `guide` \| `ebook` \| `playbook` \| `checklist`. Drives card icon + grouping on `/resources`. |
| `delivery` | enum | `download` | `internal` (on-site tool), `download` (file from `/public`), `gated` (email gate then download). |
| `fileUrl` | string | — | For `download` / `gated`: path to file in `/public`. |
| `toolUrl` | string | — | For `internal`: on-site URL. |
| `cover` | string | — | Card thumbnail image path. |
| `coverAlt` | string | — | Alt text for the thumbnail. |
| `readingTime` | string | — | For long-form guides. |
| `featured` | boolean | `false` | Shows in the featured section of `/resources`. |
| `order` | number | `100` | Lower = earlier in listings. |
| `date` | string (ISO) | ✓ | Publish date. |
| `tags` | string[] | `[]` | — |
| `status` | enum | `published` | See shared fields. |

### Comparisons — `src/content/comparisons/*.mdx`

Competitor and category comparison pages.

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | ✓ | e.g. "Servantium vs Kantata". |
| `description` | string | ✓ | SEO description. |
| `kind` | enum | `competitor` | `competitor` (Servantium vs {Product}) or `category` (PSA vs ERP, etc). |
| `competitor` | string | — | Name of the competing product (for `kind: competitor`). |
| `competitorLogo` | string | — | Logo URL. |
| `tagline` | string | — | One-liner honest summary; used in footer link labels. |
| `verdict` | string | — | Short verdict shown at top of page. |
| `matrix` | array | — | Feature comparison table. Each entry: `{ feature, servantium, other, winner: "servantium" \| "other" \| "tie" }`. |
| `date` | string (ISO) | ✓ | Publish date. |
| `updated` | string (ISO) | — | Last-updated date if different from publish. |
| `order` | number | `100` | Listing order. |
| `status` | enum | `published` | See shared fields. |

### Customers — `src/content/customers/*.md`

Case studies. Schema defined; collection currently empty (`status: hidden` until approved).

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | ✓ | Customer/company name. |
| `industry` | enum | ✓ | `consulting` \| `it-services` \| `agency` \| `other`. |
| `logo` | string | ✓ | Logo path in `/public`. |
| `logoWidth` | number | `120` | px; for grid alignment. |
| `metrics` | array | — | Headline metrics. Each: `{ label, value }`. |
| `quote` | string | — | Customer testimonial. |
| `quoteAuthor` | string | — | Name of person quoted. |
| `quoteRole` | string | — | Title of person quoted. |
| `featured` | boolean | `false` | — |
| `status` | enum | `published` | — |

### Integrations — `src/content/integrations/*.md`

Third-party integration cards. Schema ready; currently empty.

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | ✓ | Partner/tool name. |
| `category` | enum | ✓ | `crm` \| `accounting` \| `communication` \| `project-management` \| `other`. |
| `logo` | string | ✓ | Logo path. |
| `docsUrl` | string | — | Link to integration docs on help.servantium.com. |
| `description` | string | ✓ | Card blurb. |
| `status` | enum | `coming-soon` | `available` \| `coming-soon` \| `beta`. (Different enum than other collections — this one drives the UI state pill.) |

### Press — `src/content/press/*.md`

Press mentions. Schema ready; currently empty.

| Field | Type | Required | Description |
|---|---|---|---|
| `publication` | string | ✓ | e.g. "TechCrunch". |
| `headline` | string | ✓ | Article headline. |
| `url` | string | ✓ | Link to the external article. |
| `date` | string (ISO) | ✓ | Publish date. |
| `logo` | string | — | Publication logo in `/public`. |
| `featured` | boolean | `false` | — |
| `status` | enum | `published` | — |

### Example blog post

```mdx
---
title: "Why most AI implementations fail in services"
description: "AI wins when the data layer is structured. Most services firms don't have that — here's how to fix it before you spend on the model."
date: "2026-03-05"
author: christopher-veale
category: ai
image: "https://images.unsplash.com/photo-xxx?w=1200&h=630&fit=crop"
imageAlt: "Abstract illustration of data flowing into a model"
readingTime: "6 min read"
tags: [ai, data, services]
status: published
---

# Why most AI implementations fail in services

Opening paragraph...
```

### MDX components available across collections

All available via Grove (from `@servantium/grove/components`): `Aside`, `Steps`, `Tabs`, `TabItem`. See help-repo README for usage examples.

Blog posts can additionally use any component from `src/theme/blog/` or `src/theme/components/` via direct import.
