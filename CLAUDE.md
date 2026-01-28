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

## File Structure & Paths

**Base path:** `/Users/christopherveale/Projects/Servantium/website`

| File | Purpose | Key Sections/Lines |
|------|---------|-------------------|
| `index.html` | Homepage | CSS: ~100-1600, Hero: ~2400, Problem: ~2560, Packages: ~2900, FAQ: ~3040 |
| `about.html` | About page | Founders, values, company story |
| `blog.html` | Blog listing | Blog grid layout |
| `blog/why-services-businesses-need-cpq.html` | Blog article | First CPQ article |
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

- [ ] Privacy and Terms pages are placeholders
- [ ] Images don't use lazy loading
- [x] ~~Implement pricing/feature comparison table~~
- [x] ~~Add llms.txt for AI search visibility~~
- [x] ~~Add og-image.png for social shares~~

---

## Pre-Production Launch Checklist

**Manual setup required before going live on servantium.com:**

### Google Search Console
1. Go to https://search.google.com/search-console
2. Add property for `servantium.com`
3. Verify domain ownership (DNS TXT record or HTML file upload)
4. Submit sitemap: `https://servantium.com/sitemap.xml`
5. Request indexing for key pages

### Bing Webmaster Tools
1. Go to https://www.bing.com/webmasters
2. Add site `servantium.com`
3. Verify ownership
4. Submit sitemap (covers Bing, Yahoo, DuckDuckGo)

### Analytics (Optional but Recommended)
1. Create GA4 property at https://analytics.google.com
2. Get Measurement ID (G-XXXXXXXXXX)
3. Add tracking script to all HTML pages (in `<head>`)
4. If adding analytics, also add cookie consent banner (GDPR/CCPA)

### DNS/Hosting
- [ ] Point servantium.com DNS to hosting provider
- [ ] Verify SSL certificate is active
- [ ] Test all pages load correctly on production domain

---

*Last updated: 2026-01-28*
