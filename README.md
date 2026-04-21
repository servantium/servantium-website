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

## License

All rights reserved. Copyright 2026 Servantium Inc.
