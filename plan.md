# Homepage Redesign Plan

## Goal
Redesign servantium.com homepage to be a focused, modern landing page with 4 A/B variants for review. All work on `feature/homepage-redesign` branch → deploys to test.servantium.com when pushed to `develop`.

## Decisions Made
- **Lifecycle step 4:** "Contract" → "Activation"
- **Tiering:** Remove 3-tier comparison. Single feature list on platform.html instead.
- **Marketing angle:** "Every engagement makes the next one smarter." No competitor references, no named agents. AI is part of the product, not the product.
- **Salesforce:** Bi-directional integration, mark as shipping (not Roadmap)
- **REST API:** In development, mark appropriately
- **Logo bar:** Placeholder "Trusted by" section, ready for future customer logos
- **Page split:** Homepage is the hook (5 sections), platform.html is the detail page

## A/B Variants (4 total)
All variants built into ONE index.html file, toggled via URL params + floating switcher panel:

| Variant | Hero | Theme | URL |
|---------|------|-------|-----|
| A | CSS particle animation | Light | (default) |
| B | CSS particle animation | Dark | ?theme=dark |
| C | Video background | Light | ?hero=video |
| D | Video background | Dark | ?hero=video&theme=dark |

Floating A/B switcher panel in bottom-right corner for easy toggling during review.

## Homepage Section Flow (5 sections, down from current ~6)

### 1. Hero
- Full-viewport height
- **Canvas particle animation** (network of dots connected by lines, green theme, subtle)
- Left: Headline text + CTAs ("Schedule a Call", "See the Platform")
- Right: Canvas animation (or full background on dark variant)
- Video variant: `<video>` element replaces canvas, plays muted loop
- Video TBD — user will source from Coverr or similar

### 2. Logo Bar
- "Trusted by innovative services teams" or similar
- Greyed-out placeholder shapes (6-8 slots)
- Ready for real logos when available

### 3. The Problem (keep existing)
- Dark background (#023E25)
- 4 SPI Research stat cards (68.9%, 1 in 4, 20%, -4.6%)
- This section is strong as-is, minimal changes

### 4. Engagement Lifecycle (updated)
- 6 interactive steps: Discovery → Estimation → Proposal → **Activation** → Delivery → Learning
- Keep existing hover/click panel interaction
- Update step 4 copy: "Win the deal, assign the team, and activate the engagement. Resources, timelines, and deliverables align automatically from your scoped work."
- Keep loop arrow and mobile expandable behavior

### 5. CTA (keep existing)
- Green background
- Cal.com embed + contact form side by side
- Minor copy updates

### Removed from homepage (moved to platform.html):
- Feature comparison table → now a single feature list on platform.html
- Packages/pricing tiers → removed entirely for now
- Phases section (CSS existed but HTML was already removed)
- AI Philosophy section (CSS existed but HTML was already removed)
- Outcomes section (CSS existed but HTML was already removed)

### FAQ
- Keep on homepage (good for SEO)
- Update integrations answer to mention Salesforce (shipping, bi-directional)
- Update terminology: remove "Contract" references

## Navigation Update (all pages)
Old: The Problem | How It Works | Product | About | Blog
New: Platform | About | Blog | [Book a Demo] | [Log In]

Homepage-specific nav may also include anchor links (#problem, #concept).

## Dark Theme Implementation
CSS custom properties override via `body.theme-dark`:
- Background: #0D0D0D (ink) / #1a1a1a (sections)
- Text: white / rgba(255,255,255,0.8)
- Cards: dark backgrounds with subtle borders
- Green accent stays the same
- Nav: dark background with white text
- Canvas particles: brighter opacity on dark bg

## CSS Animated Hero (Canvas)
Particle network animation:
- 60-80 floating dots/nodes
- Connected by thin lines when within proximity
- Green color scheme (matches brand)
- Dots drift slowly, lines appear/disappear
- Subtle, not distracting — premium feel
- Responsive: fewer particles on mobile
- Canvas element behind hero content

## Video Hero (Variant C/D)
- `<video>` element with muted autoplay loop
- Overlaid with semi-transparent gradient for text readability
- User will provide video file (Coverr or custom)
- Fallback to canvas animation if video fails to load

## Files Changed

| File | Change |
|------|--------|
| `index.html` | Major rewrite: new hero, logo bar, lifecycle update, theme variants, A/B switcher, remove packages section, clean up orphaned CSS |
| `platform.html` | NEW — detail page (already created) |
| `sitemap.xml` | Add platform.html (already done) |
| `about.html` | Update nav links (add Platform) |
| `blog.html` | Update nav links (add Platform) |
| `blog/*.html` | Update nav links (add Platform) — 5 blog posts + 2 author pages |
| `404.html` | No change (simplified nav/footer) |

## Implementation Order
1. ✅ Create branch from develop
2. ✅ Create platform.html
3. ✅ Update sitemap.xml
4. **→ Rebuild index.html hero section** (replace orbital CSS/HTML with canvas animation)
5. **→ Add logo bar section**
6. **→ Update lifecycle: Contract → Activation** (HTML, JS data, CSS class names)
7. **→ Remove packages section from homepage** (HTML + orphaned CSS)
8. **→ Clean up orphaned CSS** (phases, AI philosophy, outcomes — HTML already gone)
9. **→ Update FAQ** (Salesforce integration answer, terminology)
10. **→ Add dark theme CSS variant**
11. **→ Add A/B variant switcher** (URL params + floating panel)
12. **→ Update nav across all pages** (add Platform link)
13. **→ Review all changes in browser**
14. **→ Push to develop for test.servantium.com deployment**

## Open Questions
- [ ] Video source: User to pick from Coverr or provide custom video
- [ ] "Activation" step imagery: current uses Unsplash contract-signing photo, needs update
- [ ] Logo bar: exact placeholder style (greyed shapes vs. "Your Logo Here" text)
- [ ] Keep FAQ on homepage or move to platform.html?

---
*Branch: feature/homepage-redesign*
*Last updated: 2026-03-17*
