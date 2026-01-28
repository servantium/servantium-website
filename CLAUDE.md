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

## File Structure

```
/
├── index.html          # Homepage (main landing page)
├── about.html          # About page with founders/values
├── blog.html           # Blog listing
├── blog/
│   └── why-services-businesses-need-cpq.html
├── 404.html            # Custom error page (ASCII astronaut)
├── privacy.html        # Privacy policy (placeholder)
├── terms.html          # Terms of service (placeholder)
├── sitemap.xml         # XML sitemap for SEO
├── robots.txt          # Search engine directives
├── logo.png            # Main logo
├── favicon-*.png       # Favicons (32, 192, 512px)
├── apple-touch-icon.png
└── CLAUDE.md           # This file
```

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

## Known Issues / TODOs

- [ ] Privacy and Terms pages are placeholders
- [ ] No analytics integration yet
- [ ] Images don't use lazy loading
- [ ] Founder photos may need updating

---

*Last updated: 2026-01-28*
