# Servantium Astronaut Mascot System

Plan for expanding the astronaut character across the Servantium website.

---

## 1. Current Astronaut Usage

The astronaut appears in **one place** today:

- **404 page** (`src/pages/404.astro`): Full-body floating astronaut at 180px. White body, green visor, antenna with green tip. Has a floating CSS animation and triggers a hidden Asteroids game on double-click. The astronaut is the visual anchor of the entire page.

---

## 2. Proposed Mascot Placements

### Already Built

| Location | Size | Variant | Notes |
|----------|------|---------|-------|
| 404 page | lg (180px original) | floating | Keep existing SVG + game trigger intact |
| Homepage journey | sm (40px) | floating | Travels between space stations as user scrolls. Built in EngagementRoad.astro |

### Planned Additions

| Location | Size | Variant | Implementation Notes |
|----------|------|---------|---------------------|
| Help docs sidebar | sm (32px) | searching | Near search input. "Ask our guide!" label beside it |
| Blog featured post | sm (32px) | peeking | Peeking from behind the top-right corner of the FeaturedPost card |
| Empty search results | md (64px) | searching | "No results found" state in DocsSearch and BlogSearch |
| Loading states | sm (32px) | floating | Floating while content loads (Pagefind search, page transitions) |
| CTA sections | md (64px) | waving | Next to CTA text with a speech bubble: "Let me show you around" |
| Cookie consent | sm (32px) | floating | In the CookieConsent banner, beside the text |

---

## 3. Astronaut Variations Needed

### Core Variants (built in Astronaut.astro)

1. **floating** - Full body, arms out, gentle float animation. The default/signature pose.
2. **peeking** - Upper body + hands gripping an edge. For card corners and reveals.
3. **waving** - Full body with right arm raised. For CTAs and greetings.
4. **searching** - Holding a magnifying glass. For search-related contexts.

### Future Variants (not yet built)

5. **with-cookie** - Holding a cookie in one hand. For cookie consent banner.
6. **with-rocket** - Riding a small rocket. For CTA sections with "launch" messaging.
7. **with-speech-bubble** - Speech bubble attached. For interactive prompts.
8. **thumbs-up** - Confirmation/success states. For form submission success.
9. **sleeping** - Eyes closed (visor dimmed). For maintenance/downtime page.

---

## 4. Reusable Component

**File:** `src/theme/components/Astronaut.astro`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | sm=32px, md=64px, lg=120px |
| `variant` | `'floating' \| 'peeking' \| 'waving' \| 'searching'` | `'floating'` | Which pose/variant to render |
| `animate` | `boolean` | `true` | Whether to apply the CSS animation |
| `class` | `string` | `''` | Additional CSS class for positioning |

### Usage Examples

```astro
---
import Astronaut from '@/theme/components/Astronaut.astro';
---

<!-- Small floating astronaut in sidebar -->
<Astronaut size="sm" variant="floating" />

<!-- Medium searching astronaut for empty states -->
<Astronaut size="md" variant="searching" />

<!-- Large waving astronaut for CTA -->
<Astronaut size="lg" variant="waving" />

<!-- Static (no animation) peeking astronaut -->
<Astronaut size="sm" variant="peeking" animate={false} />
```

### Design Constraints

- All SVGs use the same visual language: white body, `#0D0D0D` strokes, `#00C26D` visor and antenna
- Stroke width stays at 2px for body elements regardless of rendered size
- The green visor is the most recognizable feature -- it must always be visible
- On dark backgrounds, the white body provides contrast naturally
- On light backgrounds, the `#0D0D0D` strokes define the shape
- Respects `prefers-reduced-motion` -- all animations disabled when set

---

## 5. Implementation Priority

1. **Phase 1 (done):** Astronaut.astro component with 4 core variants
2. **Phase 2 (next):** Add to help docs sidebar search area
3. **Phase 3:** Add to empty states (search no-results)
4. **Phase 4:** Add to blog FeaturedPost (peeking)
5. **Phase 5:** Add to CTA sections (waving + speech bubble)
6. **Phase 6:** Cookie consent, loading states, future variants

---

## 6. Notes on the 404 Page Astronaut

The 404 page astronaut is a standalone inline SVG (not the component) because:
- It has unique interactive behavior (double-click to play Asteroids)
- It uses CSS variables from the page context (`--color-servantium-green`, etc.)
- It has hover effects and a pulse animation tied to the game trigger

The 404 astronaut should remain as-is. The Astronaut.astro component is for all other placements.
