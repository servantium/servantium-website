# Servantium Website - Claude Context

> This file helps Claude understand the project across sessions. Keep it updated.

## Project Overview

**Servantium** is a CPQ (Configure-Price-Quote) and engagement management platform for professional services businesses. This is the static marketing website at `servantium.com`. The app lives at `app.servantium.com` (separate repo).

## Tech Stack

- **Pure static HTML** - No build tools, frameworks, or preprocessors
- **Inline CSS** - All styles in `<style>` tags within HTML files
- **Vanilla JS** - Minimal JavaScript for mobile menu and interactions
- **Google Fonts** - Playfair Display (headings) + Source Sans 3 (body)
- **Cal.com** - Embedded booking system for demos
- **Cloudflare Pages** - Static site hosting with global CDN

## File Structure & Paths

**Base path:** `/Users/christopherveale/Projects/Servantium/website`

| File | Purpose | Key Sections/Lines |
|------|---------|-------------------|
| `index.html` | Homepage | CSS: ~100-1600, Hero: ~2400, Problem: ~2560, Packages: ~2900, FAQ: ~3040 |
| `about.html` | About page | Founders, values, company story |
| `blog.html` | Blog listing | Blog grid layout |
| `blog/why-services-businesses-need-cpq.html` | Blog article | First CPQ article |
| `blog/authors/christopher-veale.html` | Author page | CEO bio + articles |
| `blog/authors/maxwell-friel.html` | Author page | CTO bio + articles |
| `404.html` | Error page | ASCII astronaut animation |
| `privacy.html` | Privacy policy | Placeholder |
| `terms.html` | Terms of service | Placeholder |
| `sitemap.xml` | SEO sitemap | Update when adding pages |
| `robots.txt` | Crawler rules | |
| `CLAUDE.md` | This context file | Keep updated |

**Assets:**
- `logo.png` - Main logo
- `favicon-32.png`, `favicon-192.png`, `favicon-512.png` - Favicons
- `apple-touch-icon.png` - iOS icon

## Design System

### Colors

| Name | Hex | Usage |
|------|-----|-------|
| Primary Green | `#00C26D` | CTAs, brand color, highlights |
| Green Hover | `#00A95E` | Interactive states |
| Dark Forest | `#023E25` | Deep backgrounds |
| Light Mint | `#E8FBF1` | Soft backgrounds |
| Mint Tint | `#F3FCF8` | Subtle backgrounds |
| Ink (Dark) | `#0D0D0D` | Body text |
| Mist Grey | `#F5F6F7` | Light backgrounds |
| Cloud Grey | `#E1E3E6` | Borders |

**Accent colors** (used sparingly): Coral `#FF5C70`, Slate Blue `#4C82A7`, Amber `#FFB02E`, Deep Teal `#26A899`

### Typography

- **Headings:** Playfair Display (serif) - weights 400, 500, 600
- **Body:** Source Sans 3 (sans-serif) - weights 400, 500, 600
- **h1:** `clamp(2.5rem, 5vw, 3.5rem)` fluid
- **h2:** `clamp(2rem, 4vw, 2.75rem)` fluid
- **Body:** `1.125rem` with `1.7` line-height

### Spacing Scale (CSS Variables)

```css
--space-xs: 0.5rem;
--space-sm: 1rem;
--space-md: 1.5rem;
--space-lg: 2.5rem;
--space-xl: 4rem;
--space-2xl: 6rem;
--space-3xl: 8rem;
```

### Component Patterns

**Buttons:**
- Primary: Green bg, white text, shadow, rounded
- Secondary: Transparent, border, hover turns green
- All have `transition: all 0.25s ease`

**Cards:**
- Rounded corners (12-16px)
- Subtle shadow `0 2px 8px rgba(0,0,0,0.04)`
- Hover elevation effect

**Navigation:**
- Fixed position with backdrop blur
- 95% white background opacity
- Hides at 768px, hamburger menu appears

### Breakpoints

- **Mobile:** `max-width: 768px`
- **Tablet:** `max-width: 1024px`
- **Container:** `max-width: 1140px`

## Page Sections (Homepage)

1. **Hero** - Main headline, subhead, CTA
2. **Problem** (`#problem`) - Why services businesses struggle
3. **How It Works** (`#concept`) - Expandable steps
4. **Platform** (`#platform`) - Service architecture
5. **Outcomes** - Value propositions
6. **FAQ** (`#faq`) - 7 Q&A items
7. **Packages** (`#packages`) - Pricing tiers
8. **Contact CTA** - Book demo / email
9. **Footer** - 4-column layout

## SEO Setup

- Canonical URLs to `https://servantium.com`
- Open Graph + Twitter Card meta tags
- JSON-LD structured data:
  - Organization (company info)
  - SoftwareApplication (product)
  - WebSite
  - FAQPage
  - Article (blog posts)
- XML sitemap at `/sitemap.xml`

## Integrations

### Cal.com (Demo Booking)
- Namespace: `servantium-introduction`
- Duration: 15 minutes
- Layout: month_view
- Brand color: `#00C26D`

```html
<button data-cal-link="servantium-introduction"
        data-cal-namespace="servantium-introduction"
        data-cal-config='{"layout":"month_view"}'>
  Book a Demo
</button>
```

### External Links
- App: `https://app.servantium.com/`
- LinkedIn profiles for founders

## Company Info

- **Email:** hello@servantium.com
- **Address:** 1111B S Governors Ave STE 48074, Dover, DE 19904
- **Founders:** Christopher Veale (CEO), Maxwell Friel (CTO)

## Style Guidelines

1. **Keep it minimal** - No unnecessary complexity
2. **Consistent spacing** - Use CSS variables
3. **Mobile-first responsive** - Test at 768px breakpoint
4. **Semantic HTML** - nav, header, main, section, footer
5. **Accessible** - ARIA labels, keyboard navigation, contrast
6. **No frameworks** - Pure HTML/CSS/JS

## Common Tasks

### Adding a new page
1. Copy structure from existing page (about.html is cleanest)
2. Update `<title>`, meta description, canonical URL
3. Add to sitemap.xml
4. Ensure consistent nav/footer

### Updating styles
- Edit inline `<style>` in each HTML file
- Consider that changes may need to propagate to multiple files

### Blog posts
- Create in `/blog/` directory
- Use Article schema JSON-LD
- Add to sitemap.xml
- Link from blog.html listing

## Current Work: Pricing/Feature Table

**Status:** Implemented (2026-01-28) - Review needed

### Tier Names
- **Individual** - Personal account (single user)
- **Teams** - Shared workspace (multi-user, one org)
- **Enterprise** - Dedicated tenant (dedicated environment, potentially multiple orgs)

### Terminology
- Use **"Service Catalog"** (not "AI Line Item Library") - classic, clear naming

### Implementation Notes
- Table located at `#packages` section in index.html (~line 2900)
- CSS for table at ~line 1438 (`.feature-table-*` classes)
- Roadmap badge: amber/gold pill style
- Categories: Core CPQ, Collaboration, PSA, Organization, Integrations, Security & Compliance, Support
- Mobile responsive with horizontal scroll

---

## Known Issues / TODOs

### Pending
- [ ] Terms page is placeholder (lawyer will handle)
- [ ] LinkedIn feed widget on blog page (Elfsight) — decide after analytics data
- [ ] Set up LinkedIn company page and add URL to footer

### Content Backlog (Post-Launch SEO)
- [ ] Blog: "Professional Services CPQ vs. PSA: What's the Difference?"
- [ ] Blog: "How Professional Services CPQ Improves Utilization"
- [ ] Blog: "Consulting Firm CPQ: Pricing Engagements for Margin"
- [ ] Landing page: "Professional Services CPQ Solutions"

### Completed (Session 2026-01-29)
- [x] og-image.png resized to 1200x630 (optimal social preview size)
- [x] Blog author avatars: now use photos with links to author pages
- [x] Removed Twitter Cards (no Twitter account)
- [x] Mobile game controls: iOS arcade-style with fixed joystick and auto-fire
- [x] SEO optimization: Titles, H1s, H2s, metas with "Professional Services CPQ"
- [x] Open Graph meta tags: Added width/height/alt/site_name
- [x] llms.txt rewritten: OS framing, "What It's Not" section

---

## SEO Strategy: Professional Services CPQ Dominance

**Goal:** Become #1 landing place for "Professional Services CPQ" and "Professional Services PSA" searches.

### Primary Keywords (Optimized 2026-01-29)
- Professional Services CPQ
- CPQ for services / Services CPQ
- Professional Services PSA
- Engagement management platform
- Consulting CPQ

### Page Title Strategy
| Page | Title |
|------|-------|
| Homepage | Professional Services CPQ & Engagement Management Platform \| Servantium |
| Blog | Professional Services CPQ & PSA Blog \| Servantium Insights |
| About | About Servantium — The Founders & Our Mission |

### H1/H2 Optimization (Homepage)
- H1: "The operating system for professional services."
- H2s include: "Why Professional Services Firms Struggle", "Engagement Management for Professional Services", "Professional Services CPQ & PSA Pricing", "Professional Services CPQ & Engagement Management FAQ"

### Content Cluster Opportunities (Future)
1. New blog post: "Professional Services CPQ vs. PSA: What's the Difference?"
2. New blog post: "How Professional Services CPQ Improves Utilization"
3. New blog post: "Consulting Firm CPQ: Pricing Engagements for Margin"
4. Dedicated landing page: "Professional Services CPQ Solutions"

---

## Open Graph & Social Sharing

### Current Implementation
All pages have complete OG meta tags including:
- `og:image:width` and `og:image:height` (required for iOS/iMessage)
- `og:image:alt` for accessibility
- `og:site_name` for brand consistency
- `og:image:secure_url` for HTTPS

### Image Specifications
- **og-image.png**: 1200x630px (optimal for all social platforms)
- Blog posts use Unsplash images with `?w=1200&h=630&fit=crop`
- Author pages use profile photos at 400x400px

---

## Launch Day Checklist (2026-01-30)

### Cloudflare Pages
- [ ] Add `servantium.com` as production custom domain (pointing to `main` branch)
- [ ] Verify SSL certificate is active
- [ ] Test all pages load correctly on production domain
- [ ] Confirm test.servantium.com is assigned to `develop` branch

### Search Engines
- [ ] **Google Search Console:** Add property, verify via DNS TXT record, submit sitemap
- [ ] **Bing Webmaster Tools:** Add site, verify, submit sitemap (covers Yahoo, DuckDuckGo)

### Social Media
- [ ] Create LinkedIn company page for Servantium
- [ ] Add LinkedIn URL to website footer

### Post-Launch
- [ ] Request indexing for key pages in Search Console
- [ ] Monitor GA4 for initial traffic
- [ ] Check Core Web Vitals in Search Console (after a few days)

---

## Completed Setup

### Analytics ✅
- GA4 Property ID: `G-6EFX4FNH6H`
- Cookie consent banner on all pages
- Analytics only loads after user accepts cookies
- Automatically disabled on test.servantium.com

### Cloudflare Pages ✅
- GitHub repo connected
- Test environment (test.servantium.com) configured for `develop` branch
- Branch control: All non-production branches

---

## Hosting & Deployment

**Platform:** Cloudflare Pages

Cloudflare Pages provides:
- Global CDN for fast page loads
- Automatic SSL certificates
- Git-based deployments
- Preview URLs for branches/PRs

### Environment Setup

| Environment | Domain | Branch | Purpose |
|-------------|--------|--------|---------|
| Production | servantium.com | `main` | Live public site |
| Test | test.servantium.com | `develop` | Pre-production testing |

### Deployment Workflow

1. **Development:** Make changes locally, commit to `develop` branch
2. **Test:** Push to `develop` → auto-deploys to test.servantium.com
3. **Review:** Verify changes at test.servantium.com
4. **Production:** Merge `develop` → `main` → auto-deploys to servantium.com

### Test Environment Protection

All HTML files include a script that detects `test.servantium.com` and:
- Injects `<meta name="robots" content="noindex, nofollow">` to block search indexing
- Disables GA4 analytics entirely
- Shows an orange "TEST ENVIRONMENT" banner at the top of the page

This ensures test content never appears in search results or pollutes analytics data.

### Cloudflare Pages Setup

**To set up the pipeline:**

1. **Production Project:**
   - Go to Cloudflare Dashboard → Pages → Create a project
   - Connect GitHub repo
   - Set production branch to `main`
   - Add custom domain: servantium.com
   - Build settings: None (static HTML)

2. **Test Project (separate project):**
   - Create another Pages project OR use preview deployments
   - Option A: Separate project with `develop` branch as production
   - Option B: Use Cloudflare's branch preview URLs (auto-generated)
   - Add custom domain: test.servantium.com

### Cloudflare Branch Settings

**Current setup uses single project with branch deployments:**
- Production branch: `main` → servantium.com
- Preview branches: All non-production (includes `develop`) → test.servantium.com

**Branch control:** Set to "All non-production branches" - no include/exclude rules needed since `develop` is automatically included.

---

## Easter Egg: Asteroids Game

Hidden game in the hero section of the homepage. Activated by double-clicking/tapping the sun (orbital core).

### Controls
- **Desktop:** Arrow keys to move, Space to shoot, Escape to exit
- **Mobile:** Virtual joystick (left) for movement, fire button (right) with auto-fire

### Touch Controls Implementation
- Fixed joystick at bottom-left (iOS arcade style)
- Fixed fire button at bottom-right with "FIRE" label
- Thrust indicator shows when thrusting
- Auto-fire while holding fire button (150ms interval)

---

## AI Search Visibility (llms.txt)

The llms.txt file has been rewritten with:
1. **OS framing** - Explicitly states Servantium is not a traditional PSA or CPQ
2. **"What It's Not" section** - Prevents misclassification by LLMs
3. **Institutional Memory Engine** - Named as a distinct system, not just a feature
4. **Engagement-centric model** - Emphasized as core differentiator
5. **Grounded learning language** - Concrete descriptions of what "learning" means (engagement data, delivery outcomes, margin performance)
6. **Qualified target audience** - Initially focused on consulting, IT services, and agencies

---

*Last updated: 2026-01-29*
