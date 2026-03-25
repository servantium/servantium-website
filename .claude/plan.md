# Servantium Website Overhaul Plan

## 1. The Engagement Lifecycle: 6 Steps

**Current:** Discovery → Estimation → Proposal → Contract → Delivery → Learning

**Proposed:** Discovery → Estimation → Proposal → **Mobilization** → Delivery → Learning

### Why Mobilization (not Kickoff, not Staffing)

**Kickoff** is an event, not a phase. It's a meeting — 30 minutes on a Tuesday. It doesn't deserve a bubble.

**Staffing** is one activity within a larger transition. It undersells what actually happens between "deal won" and "work starts."

**Mobilization** is the real answer because:

1. **It's a recognized consulting term.** McKinsey, Deloitte, Accenture all talk about "project mobilization" — the phase where you assemble the team, finalize the SOW, set up tooling, and prepare to execute. Your buyers will recognize it instantly.

2. **It captures the full scope.** Between Proposal and Delivery, what actually happens?
   - Resource allocation (who's on the team?)
   - Capacity planning (do we have bandwidth?)
   - Document finalization (SOW, contracts, NDAs)
   - Project setup (timelines, milestones)
   - Sales-to-delivery handoff

   "Mobilization" encompasses all of that. Staffing is one piece. Kickoff is the final act. Mobilization is the whole phase.

3. **The codebase proves it.** You've built a full resource planning system: `ResourcePlan`, `ResourcePlanResource`, capacity triggers, multi-interval grids (daily/weekly/monthly), drag-and-drop allocation. That's not a "kickoff" — that's mobilization infrastructure.

4. **It balances CPQ and PSA perfectly.**
   - CPQ side: Discovery (3), Estimation (2), Proposal (1) — selling the work
   - Bridge: Mobilization — transitioning from sold to staffed
   - PSA side: Delivery — executing the work
   - Meta: Learning — feeding back into everything

   "Contract" made it feel like 4 sales steps and 1 delivery step. Mobilization shifts the weight toward execution where it belongs.

5. **It sets up the agentic narrative.** A Mobilization Agent that auto-recommends team composition based on past engagements, flags capacity conflicts, and generates project plans from the proposal scope — that's a real differentiator. "Contract Agent" would just be a document generator.

### Step descriptions for the website

| # | Step | Tagline | Description |
|---|------|---------|-------------|
| 1 | Discovery | Understand before you scope | Capture client needs, pain points, and desired outcomes. Context captured here informs every downstream decision. |
| 2 | Estimation | Price from knowledge, not guesswork | Transform discovery into structured scope and pricing. AI draws from your service catalog and historical engagement data. |
| 3 | Proposal | Documents that reflect your architecture | Generate proposals where scope, pricing, and deliverables flow directly from your estimation work and service definitions. |
| 4 | Mobilization | From won deal to working team | Allocate resources, plan capacity, finalize terms, and set up the engagement for execution. The bridge between selling and delivering. |
| 5 | Delivery | Execute with full visibility | Track progress against scope with real-time utilization, margin, and resource data. Every engagement connected to its origin. |
| 6 | Learning | Intelligence that compounds | Capture what actually happened — costs, timelines, outcomes. This data feeds back into how you price and staff future work. |

---

## 2. Feature Grid Overhaul

### Current vs. Recommended (based on codebase audit)

Changes marked: **NEW** = missing from website but built, **RENAME** = rename for clarity, **UPGRADE** = change status, **REMOVE** = redundant/consolidate, **REORG** = move to different category

#### Core Platform

| Feature | Individual | Teams | Enterprise | Change |
|---------|-----------|-------|------------|--------|
| Engagement Templates | ✓ | ✓ | ✓ | — |
| AI-Generated Engagement Templates | ✓ | ✓ | ✓ | **NEW** — `generate_engagement_template` callable exists |
| Service Catalog | ✓ | ✓ | ✓ | — |
| Catalog Learning | ✓ | ✓ | ✓ | **NEW** — `quoteCatalogFunc` auto-updates catalog from quotes |
| Document Generation | ✓ | ✓ | ✓ | **RENAME** from "Contract Generation" — it generates any doc, not just contracts |
| Custom Document Templates | ✓ | ✓ | ✓ | — |
| Client & Contact Management | ✓ | ✓ | ✓ | **RENAME** — Accounts + Contacts are separate models in the app |
| Tiered Discount Rules | ✓ | ✓ | ✓ | **NEW** — full discount engine exists (`lib/discount/`) |
| AI-Generated Estimates | ✓ | ✓ | ✓ | — |
| Engagement Notes | ✓ | ✓ | ✓ | **NEW** — notes with pinning, timestamps, speech-to-text |
| Dashboard & Pipeline Analytics | ✓ | ✓ | ✓ | **NEW** — engagement count, pipeline value, due-this-week |

#### Resource Management ← renamed from "Project Management"

| Feature | Individual | Teams | Enterprise | Change |
|---------|-----------|-------|------------|--------|
| Resource Planning Grid | — | ✓ | ✓ | **NEW + UPGRADE** — fully built with daily/weekly/monthly intervals |
| Resource Capacity Tracking | — | ✓ | ✓ | **NEW** — target vs projected hours, capacity % |
| Resource Groups & Tags | — | ✓ | ✓ | **NEW** — tag categories with colors, grouping |
| Project Planning Grid | — | ✓ | ✓ | **NEW** — allocation view by engagement across resources |
| Project Status Tracking | — | Roadmap | Roadmap | Keep as-is |
| AI Health Score | — | Roadmap | Roadmap | Keep as-is |

#### Collaboration & History

| Feature | Individual | Teams | Enterprise | Change |
|---------|-----------|-------|------------|--------|
| Version History & Audit Trail | ✓ | ✓ | ✓ | — (confirmed: `universalVersioningTrigger` exists) |
| Team Workspace | — | ✓ | ✓ | — |
| Role-Based Permissions | — | Roadmap | Roadmap | — |
| Approval Workflows | — | Roadmap | Roadmap | — |

#### Intelligence ← NEW category

| Feature | Individual | Teams | Enterprise | Change |
|---------|-----------|-------|------------|--------|
| Similar Engagement Search | ✓ | ✓ | ✓ | **NEW** — vector embeddings + `getsimilar` function |
| Semantic Note Search | ✓ | ✓ | ✓ | **NEW** — `noteEmbedding` + `vector_search` |
| Institutional Memory Engine | ✓ | ✓ | ✓ | **NEW** — the combination of catalog learning + similarity search + note embeddings. This IS the differentiator. |

#### Data & Integrations ← renamed

| Feature | Individual | Teams | Enterprise | Change |
|---------|-----------|-------|------------|--------|
| CSV Data Import | ✓ | ✓ | ✓ | **NEW** — `dataload/` with column mapping, validation, results tracking |
| Multi-Organization Support | — | ✓ | ✓ | — |
| CRM Integrations (Salesforce) | — | Roadmap | Roadmap | Need to confirm Salesforce status with Christopher |
| API Access | — | Roadmap | Roadmap | — |

#### Security & Compliance

| Feature | Individual | Teams | Enterprise | Change |
|---------|-----------|-------|------------|--------|
| Dedicated Tenant | — | — | ✓ | — |
| SSO (SAML/OIDC) | — | — | Roadmap | — |
| SOC 2 / ISO 27001 / GDPR | — | — | Roadmap | — |

### Summary of changes
- **8 features added** that are actually built and shipping
- **1 new category** (Intelligence) to spotlight the learning/memory differentiator
- **Resource Management upgraded** from all-Roadmap to mostly-shipping
- **2 renames** for accuracy
- Feature count goes from 23 → 31

---

## 3. Hero Section Overhaul

### Current state
- Orbital animation (CSS) with text-heavy copy
- Static, developer-impressive but doesn't communicate product value
- No video, no product screenshots

### Proposed: Video-first hero (inspired by Beakr + Rocketlane)

**Structure:**
1. Full-viewport hero with background video/animation (dark overlay)
2. Short, punchy headline (not paragraph-length)
3. Two CTAs: "Book a Demo" (primary) + "See How It Works" (secondary/ghost)
4. Auto-playing product demo loop (muted, 15-30s) showing the actual platform

**Headline options (pick one):**
- "Your engagements remember everything." (institutional memory angle)
- "The engagement platform that learns." (agentic angle)
- "Stop reinventing every deal." (pain-point angle)

**Subheadline:** One sentence max. e.g., "Servantium unifies how you price, staff, and deliver professional services — and gets smarter with every engagement."

**Video content needed:**
- Screen recording of the actual Servantium app showing: engagement creation → AI estimate → resource planning → document generation
- Edited down to a 15-20 second loop
- Dark UI overlay to match hero aesthetic

**The orbital animation** stays as the easter egg (double-click to activate), but it's no longer the hero visual.

---

## 4. Page Structure Overhaul

### Current flow
1. Hero (orbital + long copy)
2. Problem (stats)
3. How It Works (lifecycle circles)
4. Feature table
5. FAQ
6. Contact CTA
7. Footer

### Proposed flow (inspired by Beakr's structure + Rocketlane's messaging)

| # | Section | Purpose | Inspiration |
|---|---------|---------|-------------|
| 1 | **Hero** | Video/animation + short headline + CTAs | Beakr's full-viewport dark hero |
| 2 | **Social proof bar** | Logo strip of early customers/partners (even if small) | Rocketlane's customer logos |
| 3 | **The Problem** | Keep the SPI Research stats — they're strong | Current (keep) |
| 4 | **Engagement Lifecycle** | 6-step visual (Discovery → Learning) with interactive panels | Current lifecycle but with Mobilization replacing Contract |
| 5 | **Platform Pillars** | 3-4 feature showcases with product screenshots/animations | Rocketlane's pillar approach: organize by business outcome, not feature list |
| 6 | **Intelligence / Agentic** | Dedicated section for AI capabilities — catalog learning, similar engagement search, AI estimates | Rocketlane's Nitro section + Beakr's agent grid |
| 7 | **Feature Grid** | Updated comparison table (31 features, 6 categories) | Current but expanded |
| 8 | **Trust & Security** | Enterprise security, compliance badges, link to trust.servantium.com | Beakr's enterprise security section |
| 9 | **FAQ** | Keep current, update for agentic language | Current |
| 10 | **Contact CTA** | Book a demo + email form | Current |
| 11 | **Footer** | Updated with help/status/trust links | Current + new subdomain links |

### New sections explained

**Platform Pillars (section 5):**
Instead of jumping straight to a feature table, show 3-4 interactive panels that tell the story:

1. **"Price from knowledge, not guesswork"** — Service catalog, AI estimates, discount rules, catalog learning
2. **"Staff with confidence"** — Resource planning grids, capacity tracking, team allocation
3. **"Deliver with full context"** — Engagement notes, document generation, version history
4. **"Intelligence that compounds"** — Similar engagement search, semantic search, institutional memory

Each panel: screenshot/animation on one side, 3-4 bullet points on the other. Click to expand.

**Intelligence / Agentic section (section 6):**
This is where the Rocketlane-inspired agentic positioning lives. But done better:

- Rocketlane named agents after roles (Project Architect, Financial Controller). We can do the same:
  - **Estimation Agent** — Generates quotes from engagement context + historical data
  - **Template Agent** — Creates engagement templates from natural language
  - **Memory Agent** — Finds similar past engagements for pricing and staffing reference
  - **Mobilization Agent** — Recommends team composition based on scope and availability (this one maps to future resource planning AI)

- Key difference from Rocketlane: **Our agents learn from YOUR data.** Rocketlane positions agents as pre-built automation. Servantium positions agents as intelligence that compounds with usage. The more engagements you run, the smarter they get.

**Trust & Security section (section 8):**
Simple 3-4 card grid:
- Data encryption (at rest + in transit)
- Dedicated tenants (Enterprise)
- Compliance roadmap (SOC 2, ISO 27001, GDPR)
- Link to trust.servantium.com (when live)

---

## 5. Subdomain Readiness

### What needs to happen on the website

| Subdomain | Tool | Website changes needed |
|-----------|------|----------------------|
| status.servantium.com | Incident.io or similar | Add "Status" link in footer under Company column. Add link in nav (optional — could be footer-only). |
| help.servantium.com | Mintlify or similar | Add "Documentation" or "Help Center" link in footer under Explore column. Link from FAQ answers where relevant. |
| trust.servantium.com | Vanta/Drata/Delve or similar | Add "Trust Center" link in footer under Company column. Link from Security section on homepage. |

### DNS setup needed (Cloudflare)
- CNAME records for each subdomain pointing to the respective service
- These are independent of the website repo — just DNS + service config

### Website is ready for these — just needs the links added. No structural changes required.

---

## 6. Navigation Updates

### Current nav
```
The Problem | How It Works | Product | About | Blog | [Book a Demo] [Log In]
```

### Proposed nav
```
Platform | Pricing | About | Blog | Resources ▾ | [Book a Demo] [Log In]
```

**Changes:**
- "The Problem" and "How It Works" → removed from nav (they're scroll sections, not destinations)
- "Product" → "Platform" (broader, more modern)
- "Pricing" added as separate link (scrolls to feature grid)
- "Resources" dropdown: Help Center, Blog, Status, Trust Center (when live)

---

## 7. Visual & Aesthetic Direction

### Current
- Light/white backgrounds throughout
- Green accent color
- Serif headings (Playfair Display) + sans-serif body (Source Sans 3)
- Text-heavy, minimal product visuals

### Proposed direction
- **Dark hero section** (dark green/navy gradient) → transitions to light for content sections
- **Keep the green** — it's strong brand identity
- **Add product screenshots** throughout — the app exists, show it
- **Reduce text density** — shorter paragraphs, more bullet points, let visuals carry weight
- **Subtle scroll animations** — fade-in-up on section entry (CSS-only, no GSAP dependency)
- **Keep static HTML** — no framework migration. CSS animations + vanilla JS are sufficient

### What we're NOT doing
- No dark mode for the whole site (just hero)
- No 3D visualizations (over-engineered for static HTML)
- No Next.js migration (unnecessary complexity)
- No video autoplay on mobile (battery/data concerns)

---

## 8. Implementation Phases

### Phase 1: Content & Structure (can ship to test branch)
1. Update lifecycle steps (Contract → Mobilization, update descriptions)
2. Update feature grid (add 8 features, new Intelligence category, renames)
3. Add subdomain links to footer
4. Update nav structure
5. Update FAQ for new terminology

### Phase 2: Visual Overhaul
1. Dark hero section with video placeholder (static image until video is produced)
2. Platform Pillars section (product screenshots needed)
3. Trust & Security section
4. Social proof bar (need customer/partner logos)
5. Scroll animations

### Phase 3: Agentic Positioning
1. Intelligence/Agent section on homepage
2. Update About page messaging
3. Blog post: "The Agentic Engagement Platform"
4. Update meta descriptions and SEO for agentic keywords
5. llms.txt update for agentic framing

### Phase 4: Video & Polish
1. Product demo video for hero
2. Section-specific animations
3. Product screenshots throughout
4. Final responsive testing

---

## 9. Agentic Positioning: How to Beat Rocketlane

### What Rocketlane does well
- Named agents (Project Architect, Financial Controller)
- "Digital teammates" framing
- Governance emphasis (agents work within guardrails)

### Where Servantium wins

**1. Our agents actually learn.** Rocketlane's agents are pre-configured automation with AI polish. Servantium's intelligence compounds: the catalog learns from every quote, similar engagement search improves with volume, estimates get more accurate over time. Rocketlane automates. Servantium remembers.

**2. Engagement-centric, not project-centric.** Rocketlane optimizes project delivery. Servantium captures the full lifecycle from first conversation to institutional knowledge. Their agents operate on projects. Our agents operate on the engagement — which includes how it was sold, priced, and staffed.

**3. Institutional Memory as a product category.** Rocketlane mentions "knowledge" but doesn't make it a first-class concept. Servantium should own "Institutional Memory Engine" as a named, marketable capability. It's the thing that makes every future engagement better than the last.

### Proposed messaging framework

**Tagline options:**
- "The engagement platform that remembers."
- "Every engagement makes the next one better."
- "Intelligence that compounds."

**Agent naming convention:**
| Agent | What it does | Backed by |
|-------|-------------|-----------|
| Estimation Agent | Generates quotes from engagement context + history | `quoteAIGenFunction` |
| Template Agent | Creates engagement templates from natural language | `generate_engagement_template` |
| Memory Agent | Finds and surfaces similar past engagements | `getsimilar` + `vector_search` |
| Catalog Agent | Auto-updates service catalog from active quotes | `quoteCatalogFunc` |

Future (not yet built):
| Agent | What it would do |
|-------|-----------------|
| Mobilization Agent | Recommends team composition from scope + availability |
| Health Agent | Monitors engagement health and flags risks |
| Margin Agent | Alerts when engagement is trending off-margin |

---

## 10. Open Questions for Christopher

1. **Salesforce integration** — Is it built, in progress, or aspirational? Determines whether it shows as ✓, Coming Soon, or Roadmap on the feature grid.

2. **Product video** — Can we record a 15-20s product demo loop? This is the single biggest visual upgrade. If not immediately, we design the hero to work with a static screenshot first.

3. **Customer logos** — Do we have any early customers or design partners we can feature in a social proof bar? Even 3-4 logos make a difference.

4. **Agent naming** — Do you like the "Estimation Agent / Template Agent / Memory Agent / Catalog Agent" naming? Or prefer something more branded (like Rocketlane's "Nitro")?

5. **"Mobilization"** — Are you convinced? Or do you want to debate alternatives?

6. **Scope for Phase 1** — Can we start with content/structure changes (lifecycle + feature grid + nav + footer) and ship to `develop` for review?
