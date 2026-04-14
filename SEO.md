# Servantium SEO & AEO Plan

*Owner: Christopher Veale | Drafted: April 2026 | Launch target: ~3 weeks*

> This is a living document. Update it as decisions get made, content ships, and measurements come in. Don't treat the numbers as gospel — they're starting hypotheses.

---

## 0. Executive Summary

**Where we are (April 2026):**
- Technical SEO foundation is solid (Lighthouse Perf 95, A11y 97; Best Practices/SEO will rise on production deploy)
- Zero brand awareness, zero Google indexing of the new site
- 30 existing blog posts, 15 help docs, no query mapping yet
- LinkedIn is the active founder channel; Reddit is off the table
- Two competitors claim "OS for professional services" positioning (Operating.app, Riplo) — neither overlaps functionally
- Production launch in ~3 weeks

**What we're doing:**
1. **Win language, not features.** Define what "OS for services" actually means so we become the category reference.
2. **Fill content gaps mapped to buyer questions**, not keywords. The AEO era rewards comprehensive answers, not optimized pages.
3. **Split content by purpose, not authorship.** Op-eds on `/blog`. Reference + glossary in `/help`. All under the Servantium brand.
4. **Build LinkedIn presence as the primary brand channel** while SEO/AEO bake.
5. **Manual AI tracking only** for the first 3 months. No paid tools until we have signal to measure.

**Immediate blockers:**
- Need final tagline/positioning decision (Option A–D in this doc)
- Need CEO to confirm trademark filings with lawyer
- Production deploy (2 weeks) must precede GSC sitemap submission

---

## 1. Positioning & Category Definition

### The OS positioning fight

Three startups are claiming "OS for professional services/consulting" with completely different products. Servantium's actual differentiator is **the closed loop** — scope → price → propose → deliver → learn, where every engagement makes the next one better via institutional memory.

### Tagline candidates (pending CEO decision)

| Option | Tagline | Sub-tagline | Notes |
|---|---|---|---|
| **A** | The Services Operating System | Remembers every engagement. Compounds every delivery. | Broadest claim, sharpest qualifier ("services") |
| **B** | The Services OS | Scope, price, deliver, learn. Compound forever. | Shortest, most brand-friendly |
| **C** | ServantiumOS | The operating system for services that remember. | Most trademarkable |
| **D** | The Practice OS | The operating system for services practices. | Industry-native language, risk of medical/law confusion |

**Implementation (once picked):**
- Homepage hero H1 and meta title
- Platform page H1
- All JSON-LD `name` / `description` fields
- Social profile bios (LinkedIn company page)
- Email signatures
- Every future blog post intro

### Category definition (the manifesto)

A single long-form piece that defines the criteria for what counts as an "operating system for services" vs what's just a tool. Goals:
- Establish Servantium as the definition source AI cites when users ask what OS for services means
- Implicitly position Operating.app (resource planning only) as "missing the scope-and-price layer"
- Implicitly position Riplo (AI content generation) as "missing the operations layer"
- Never name competitors directly

**Recommended structure:**
1. Hook: "Everyone's building tools. Few are building operating systems. Here's the difference."
2. Define OS criteria: must handle (a) scope, (b) price, (c) deliver, (d) learn, with (e) data flow between all four
3. Show how the pieces feed each other (the loop is the differentiator)
4. Position Servantium as the reference implementation
5. Call out the anti-pattern: tools that automate one step without feeding the others

This piece gets written under Christopher's byline, lives at `/blog/what-is-an-operating-system-for-services`, and becomes the primary target for "what is an operating system for professional services" queries.

---

## 2. The Query Map

**The AEO mechanism:** When a user asks an LLM a question, the LLM decomposes it into 3-6 sub-queries, retrieves sources for each, and synthesizes an answer. To get cited, content must rank for multiple sub-queries per buyer question, not just the top-level phrase.

### Stage 1 — Problem-aware

| Q# | Buyer question | LLM sub-queries | Target content | Status |
|---|---|---|---|---|
| Q1 | Why do our consulting engagements always go over budget? | causes of consulting budget overruns; scope creep statistics professional services; consulting project overrun rate; why do consulting projects fail; professional services budget accuracy benchmarks | `/blog/why-consulting-projects-go-over-budget` (NEW) + existing `the-hidden-cost-of-bad-estimates.mdx` | Gap |
| Q2 | How do other consulting firms prevent scope creep? | scope creep prevention consulting; scope management professional services; change order process; how to document scope changes; scope creep software | `/help/glossary/scope-creep-prevention` (NEW) + `/blog/preventing-scope-creep-in-professional-services` (NEW) | Gap |
| Q3 | We lose institutional knowledge when senior people leave — what do firms do? | institutional memory consulting firm; knowledge retention professional services; tacit knowledge consulting; consultant attrition knowledge loss; knowledge management for consulting | Existing: `building-an-institutional-memory-engine.mdx`, `the-end-of-tribal-knowledge.mdx`, `the-architecture-of-a-learning-platform.mdx`, `the-real-ai-opportunity-institutional-memory.mdx` | **Over-indexed** — consolidate titles, add glossary |
| Q4 | Our utilization is under 70% but everyone's busy — what's wrong? | low utilization rate causes; utilization vs productivity consulting; billable vs non-billable time; utilization benchmarks professional services 2026; consulting capacity planning | `/blog/the-utilization-paradox` (NEW) | Gap |
| Q5 | How do consulting firms price engagements accurately? | consulting engagement pricing models; value-based pricing consulting; fixed-fee vs T&M consulting; how to estimate consulting projects; consulting pricing calculator | Existing: `consulting-firm-cpq-pricing-engagements.mdx`, `the-death-of-the-spreadsheet-estimate.mdx`, `the-hidden-cost-of-bad-estimates.mdx`, `the-proposal-factory.mdx` | Covered, needs AEO optimization |

### Stage 2 — Solution-aware

| Q# | Buyer question | LLM sub-queries | Target content | Status |
|---|---|---|---|---|
| Q6 | What software do consulting firms use to manage the whole engagement? | consulting firm engagement software; end-to-end consulting platform; professional services management software; software for running a consulting firm; consulting operations software | `/platform` (landing page rewrite) + `/help/glossary/engagement-management-software` (NEW) | Partial — needs landing page optimization |
| Q7 | Is there software that helps with scoping and pricing professional services? | services scoping software; CPQ for services; proposal software professional services; services pricing software; quote to cash consulting | Existing: `professional-services-cpq-vs-psa.mdx`, `why-services-businesses-need-cpq.mdx` + `/help/glossary/services-cpq` (NEW) | Covered, needs glossary entry |
| Q8 | Best tools for running a consulting firm in 2026 | best consulting software 2026; top PSA software 2026; consulting tech stack; software consulting firms use; [competitor] alternatives | `/blog/the-consulting-tech-stack-2026` (NEW, listicle format) | Gap |
| Q9 | Do I need a PSA or a CPQ for my services business? | PSA vs CPQ; difference PSA CPQ; when to use PSA; when to use CPQ for services; services CPQ explained | Existing: `professional-services-cpq-vs-psa.mdx`, `modern-engagement-platform-vs-traditional-psa.mdx` | Covered, needs glossary entry linking back |
| Q10 | What's beyond PSA software? | PSA alternatives; modern PSA; next generation services software; limitations of PSA software; unified services platform | Existing: `unified-operating-system-for-services.mdx`, `modern-engagement-platform-vs-traditional-psa.mdx`, `full-lifecycle-professional-services-engagements.mdx` | Covered, needs internal links |

### Stage 3 — Vendor comparison (deferred)

Skip until month 3. We don't have the authority to punch up at Kantata/Deltek/Rocketlane yet.

---

## 3. Content Plan: Gap Analysis

### Glossary entries to create (`/help/glossary/`)

These are the AEO workhorses. Each is 500-800 words, definition-first, structured with FAQ schema, AI-drafted and human-edited.

1. `what-is-engagement-management` — Q6
2. `what-is-services-cpq` — Q7
3. `what-is-the-engagement-lifecycle` — Q6, Q10
4. `what-is-institutional-memory-software` — Q3
5. `what-is-revenue-leakage` — Q1
6. `scope-creep-prevention` — Q2
7. `psa-vs-cpq-explained` — Q9
8. `utilization-rate-benchmarks` — Q4

### Blog posts to create (`/blog/`)

These are voice-driven, founder-authored, mid-to-long form. Target 1500-2500 words. Written by humans or heavily human-edited.

1. **Manifesto:** `what-is-an-operating-system-for-services` (PRIORITY 1)
2. `why-consulting-projects-go-over-budget` — Q1
3. `preventing-scope-creep-in-professional-services` — Q2
4. `the-utilization-paradox` — Q4
5. `the-consulting-tech-stack-2026` — Q8 (listicle)

### Comparison pages to create (`/platform/vs/`)

All three comparisons greenlit. These are pillar conversion pages, not blog posts.

1. `/platform/vs/spreadsheets` — "When running your services firm on spreadsheets breaks"
2. `/platform/vs/stitched-tools` — "The true cost of CRM + PSA + docs + spreadsheets"
3. `/platform/vs/ai-tools` — "Can you run a consulting firm on ChatGPT? A practical test" (provocative, OK)

### Existing content: AEO optimization pass

These posts exist but need to be rewritten for AEO citation. The current titles are too clever/abstract. Rewrite rules:

- **Title must contain the literal query phrase.** Example: "The Hidden Cost of Bad Estimates" → "Why Professional Services Estimates Fail (and How to Fix Them)"
- **Lead paragraph must directly answer the question in 50-80 words.** This is the 44.2% citation zone.
- **Add FAQ schema to every post** with 3-5 Q&A pairs at the bottom.
- **Add 2-3 contextual internal links per post** to `/platform`, `/help/glossary/*`, and related posts.

Priority posts for the rewrite pass:
1. `the-hidden-cost-of-bad-estimates.mdx`
2. `building-an-institutional-memory-engine.mdx`
3. `professional-services-cpq-vs-psa.mdx`
4. `modern-engagement-platform-vs-traditional-psa.mdx`
5. `why-services-businesses-need-cpq.mdx`

---

## 4. Content Split: /blog vs /help vs everything else

### Why split by purpose, not by author

Different content types need different optimal structures:

| Content type | Best format | Voice | Measurement |
|---|---|---|---|
| Op-eds, thought leadership, founder narrative | Long-form, voice-driven, narrative | Christopher or Maxwell | LinkedIn shares, brand lift |
| Definitions, how-tos, comparisons | Structured, definition-first, extractable | "Servantium Team" | AI citations, search rankings |

If you mix these on `/blog`, the reader experience gets confused (am I reading an opinion or a reference?) and the AEO performance drops (narrative structure is harder to extract).

### The structure

```
/blog/                     — Op-eds, hot takes, founder narrative
  /blog/[slug]             — Individual posts (Christopher/Maxwell byline)
  /blog/category/[slug]    — Category filters
  /blog/authors/[slug]     — Author pages

/help/                     — Reference content
  /help/quick-start        — Getting started
  /help/guides/*           — Product how-tos
  /help/glossary/*         — NEW: definitions and concept explanations
  /help/release-notes/*    — Changelog
  /help/support/*          — FAQ, contact

/platform/                 — Product pages
  /platform                — Main platform page
  /platform/vs/spreadsheets    — NEW
  /platform/vs/stitched-tools  — NEW
  /platform/vs/ai-tools        — NEW
```

### On the `/aiblog` idea

My recommendation: **don't build it.** Here's why:

- Hiding a URL from the menu doesn't hide it from Google or AI crawlers — if it's in the sitemap, it gets indexed; if it's not, nothing will ever find it
- Splitting authority across `/blog` and `/aiblog` makes both weaker than a unified `/help/glossary/`
- The instinct is right (AI-optimized content has a different voice than op-eds) but the cleanest execution is:
  - `/help/glossary/*` → AI-optimized reference content (definition-first, structured, FAQ schema)
  - `/blog/*` → op-eds and hot takes (voice-driven, narrative)
- The natural A/B test: compare AI citation rates for `/blog` posts vs `/help/glossary/` entries after 90 days. Same experiment, cleaner architecture.

**If you still want a hidden bucket for pure experimentation:** build `/help/glossary/` publicly and just track which content types get cited more by AI in the manual tracking spreadsheet. Same data, no architecture splits.

### Authorship rules

- **Humans sign what they wrote.** Christopher and Maxwell only byline content they personally authored.
- **AI-drafted content gets company byline.** Glossary entries and reference guides are bylined "Servantium Team" or similar. Not faked authorship.
- **Every AI-drafted piece gets human edit.** Fact-check, add specific examples, kill generic phrasing. Non-negotiable.
- **Human pieces ship at ~2/month.** AI-drafted reference content can ship at 4-8/month. Different velocities for different content types.

---

## 5. AI Visibility Measurement

### The problem

AI answers are non-deterministic. Same query = different answers across runs. Single-point measurements are worthless.

### The approach: manual tracking spreadsheet

**Setup:**
- 10 target queries (the buyer questions from Section 2)
- 4 platforms (ChatGPT, Claude, Perplexity, Gemini)
- 5 runs per query per platform = **200 data points/week**
- Time budget: ~2 hours/week

**Metrics to track per query:**
1. **Citation rate** = times Servantium mentioned ÷ total runs. Target: 0% → 20% over 90 days.
2. **Citation position** = first mention, mid-answer, or footnote source. First mention is best.
3. **Source linked** = which Servantium page was cited (to identify what content wins).
4. **Competitor mentions** = who else gets cited (Operating.app? Riplo? Kantata?).
5. **Answer quality** = does the AI characterize Servantium accurately? Any hallucinations?

**Review cadence:**
- Weekly: run the 200 queries, log in spreadsheet
- Monthly: trend analysis, adjust content priorities
- Quarterly: full strategy review

**When to upgrade to paid tools:**
- When Servantium starts appearing in 2+ runs/week consistently
- When you need competitor benchmarking at scale
- When you want automated daily tracking across 50+ queries
- Until then: spreadsheet is better because you'll *read* the answers and learn from what AI is saying

### Google Search Console (for traditional SEO)

- Already verified on the existing domain
- **Do not submit the new sitemap until production is live** (currently on test.servantium.com)
- After production deploy:
  1. Submit `https://servantium.com/sitemap-index.xml` to GSC
  2. Request indexing for: homepage, `/platform`, `/about`, `/blog`, `/help`
  3. Monitor "Pages" report for indexing issues (should auto-resolve the old "page with redirect" / "alternate canonical" errors)
  4. Set up GSC → GA4 integration for query performance data

---

## 6. LinkedIn Playbook

### Weekly rhythm (Christopher + Maxwell, each)

| Day | Post type | Length | Purpose |
|---|---|---|---|
| Monday | Observation post | 200-400 words | "I noticed this in services firms lately…" — insight without CTA |
| Wednesday | Comment-on-post | ≥50 words | Thoughtful reply to a VP of Services / consulting COO / analyst post — no pitching |
| Friday | Hot take | 400-600 words | Controversial opinion about services, AI, or operations — drives engagement |

### Voice ownership

- **Christopher** owns the business side: pricing dynamics, engagement economics, scope management, leadership, firm growth
- **Maxwell** owns the technology side: AI capabilities, data architecture, institutional memory, systems thinking, product philosophy

### Cross-linking rules

- Link to Servantium blog/glossary/platform pages only when it adds genuine context
- Never end a post with "check out our blog" — that's spam
- Internal linking from LinkedIn → blog matters less than the backlink from blog → LinkedIn profile (entity recognition)

### Measurement

- Weekly: follower growth, impressions, top 3 posts by engagement
- Monthly: adjust topics based on what resonates
- Tool: LinkedIn Creator Dashboard (free, built-in)

---

## 7. Trademark Strategy

### Core brand marks to file

Based on the language brainstorm from your IP attorney (Ricardo Unikel), here's my recommendation for which items to file and in what order. **Caveat: I'm not a lawyer. Validate with Ricardo before filing.**

### Tier 1 — File immediately (before launch)

1. **"Servantium"** — the brand name itself
   - Class 9: Downloadable software for engagement management
   - Class 42: SaaS for engagement management
   - Intent-to-use (ITU) or actual use depending on launch timing

2. **[Chosen tagline from Section 1]** — either "The Services Operating System" or "ServantiumOS" depending on CEO decision
   - Class 42 only
   - ITU filing

### Tier 2 — Consider for later (month 3-6)

3. **"The Engagement Operating System" variant** — defensive only, if you later decide engagement is the right qualifier
4. **Any product feature names** that have breakout adoption

### Recommended goods/services language (from Ricardo's list)

Here's how I'd combine the items from the brainstorm into the actual filing descriptions. Tell Ricardo:

**For Class 9 (downloadable software):**
> "Downloadable computer application software for the management of professional services engagements, namely, software for proposal generation, client management, project management, resource forecasting, tracking services pricing, selling, contracting, and delivering, engagement management from contracting to delivery of services, and artificial intelligence-powered automation of the foregoing."

*Combines items A, B, C, D, E, N, O from the brainstorm.*

**For Class 42 (SaaS / software-as-a-service):**
> "Software as a service (SAAS) services featuring software for the management of professional services engagements, namely, for proposal management, engagement management, client management, project management, resource forecasting, pricing and quoting of services, tracking services sales and delivery, workflow management, and the application of artificial intelligence to all of the foregoing; computer programming services for others in the field of collaborative engagement and relationship management."

*Combines items A-G, L, M, N, O, R, S from the brainstorm.*

### Items to drop from the brainstorm list

- **J) Customer relationship management** — too broad, sets you up as a CRM competitor. Drop.
- **K) Manage sales opportunities and proposals** — overlaps with L, redundant. Drop or merge.
- **T) Compilation of reporting data** — generic, describes any reporting software. Drop.
- **V) Downloadable app software for database management / electronic storage** — too generic, describes any SaaS. Drop.
- **U, W) Mobile app + task management** — drop unless you actually ship mobile apps soon.

### Next steps for Christopher

1. Review the two combined language blocks above
2. Send to Ricardo with these questions:
   - Does this language cover the actual product scope?
   - Any risk of refusal as "merely descriptive"?
   - Should we file ITU or wait for actual use?
   - Priority order between brand (Servantium) and tagline marks?
3. File Tier 1 items before production launch

### Competitive trademark landscape

Quick check: search USPTO for:
- "Operating system for professional services" — likely descriptive, no existing registrations
- "Engagement management" — hijacked by HR/employee engagement tools
- "Services OS" — check if any early-stage companies have filed
- "Operating.app" — verify their trademark status to avoid collision
- "Riplo" — verify their filings

Ricardo can do this quickly via the USPTO TESS system.

---

## 8. The 3-Week Sprint

### Week 1 — Foundation (launch - 14 days)

**Blockers to unblock first:**
- Final tagline decision (Section 1)
- Trademark filings kicked off (Section 7)

**Content to ship:**
- [ ] Rewrite homepage hero + platform page H1 with new tagline
- [ ] Draft manifesto piece: "What is an Operating System for Services?" (Christopher byline)
- [ ] 5 glossary entries (priority order):
  1. `what-is-engagement-management`
  2. `what-is-services-cpq`
  3. `what-is-institutional-memory-software`
  4. `what-is-revenue-leakage`
  5. `scope-creep-prevention`

**Tech to ship:**
- [ ] Merge current develop to main when ready to flip production DNS
- [ ] Verify build passes on main
- [ ] Submit sitemap to Google Search Console (only after production live)

**Effort estimate:** 12-15 hours

### Week 2 — Gap fillers (launch - 7 days)

**Content:**
- [ ] 4 blog posts (gap fillers):
  1. "Why Professional Services Engagements Go Over Budget"
  2. "Preventing Scope Creep: A Practical Guide for Consulting Firms"
  3. "The Utilization Paradox: Busy Teams, Low Billables"
  4. "The Consulting Tech Stack for 2026"
- [ ] 3 additional glossary entries:
  6. `what-is-the-engagement-lifecycle`
  7. `psa-vs-cpq-explained`
  8. `utilization-rate-benchmarks`
- [ ] AEO optimization pass on 5 existing blog posts (title + intro + FAQ schema)

**Effort estimate:** 10-14 hours

### Week 3 — Conversion content + launch prep (launch week)

**Content:**
- [ ] 3 comparison pages:
  1. `/platform/vs/spreadsheets`
  2. `/platform/vs/stitched-tools`
  3. `/platform/vs/ai-tools`
- [ ] Internal linking audit: add 2-3 contextual links per blog post to platform/glossary

**Launch day:**
- [ ] Flip production DNS
- [ ] Submit sitemap to GSC, request indexing
- [ ] Set up weekly AI tracking spreadsheet (Section 5)
- [ ] LinkedIn: Christopher + Maxwell launch posts

**Effort estimate:** 10-12 hours

### Total content sprint effort

~35-40 hours over 3 weeks. Distributed across founders + any writer help.

---

## 9. Decisions Log

Decisions made so far:

| Date | Decision | Status |
|---|---|---|
| 2026-04-13 | `/aiblog` concept rejected in favor of `/help/glossary/` | ✅ Confirmed |
| 2026-04-13 | Reddit channel out of scope | ✅ Confirmed |
| 2026-04-13 | LinkedIn is primary founder channel | ✅ Confirmed |
| 2026-04-13 | All 3 comparison pages (vs Spreadsheets, vs Stitched Tools, vs AI Tools) | ✅ Confirmed |
| 2026-04-13 | "vs ChatGPT" post can be provocative | ✅ Confirmed |
| 2026-04-13 | "The Engagement Operating System" rejected as tagline | ✅ Confirmed |
| 2026-04-13 | Manual AI tracking only for 3 months, no paid tools | ✅ Confirmed |
| 2026-04-13 | Christopher committed to LinkedIn rhythm (already active) | ✅ Confirmed |

Pending decisions:

| Decision needed | Owner | Deadline |
|---|---|---|
| Final tagline: A, B, C, D, or variant | CEO | Week 1 |
| Blog/glossary content split approval | CEO | Week 1 |
| Trademark filing: send Section 7 memo to Ricardo | CEO | Week 1 |
| Content writer/editor assignment | CEO | Week 1 |

---

## 10. Notes and Open Questions

- **Freshness matters more than ever.** 50% of LLM-cited content is <13 weeks old. Build a cadence of regular content, not one-time pushes.
- **LLM citations heavily weight Reddit and YouTube.** If we ever change our mind on Reddit, it's the highest-leverage channel we'd be missing.
- **The manifesto is the single most important piece** in the 3-week sprint. It defines the category for anyone (human or AI) asking "what's an OS for services?" If we only ship one thing, ship that.
- **Internal links are underrated.** We have 30 existing blog posts with almost no internal linking. Adding 2-3 contextual links per post takes 2 hours and compounds for years.
- **The LinkedIn + glossary combination is the most defensible strategy** because neither requires budget. Paid channels come later, after we have product-market fit signals.

---

*Last updated: 2026-04-13 | Next review: after tagline decision*
