# Servantium Growth & Platform Plan

> Two-phase strategic plan: Drive traffic first, build infrastructure second.

---

## Phase 1: Visitor Traffic Attack

**Goal:** Dominate "Professional Services CPQ" search results and become the go-to resource for services firms looking to systematize their operations.

### 1.1 Content Engine

#### Blog Posts - SEO Targets

| Priority | Topic | Target Keyword | Est. Search Volume |
|----------|-------|----------------|-------------------|
| **P0** | Professional Services CPQ vs PSA: What's the Difference? | professional services cpq vs psa | Low but high intent |
| **P0** | The Complete Guide to Pricing Professional Services | pricing professional services | Medium |
| **P0** | What is CPQ for Services? (And Why You Need It) | cpq for services | Low but growing |
| **P1** | How to Calculate Consulting Utilization Rates | consulting utilization rate | Medium |
| **P1** | Services Proposal Templates That Actually Win | services proposal template | High |
| **P1** | Time & Materials vs Fixed Price: Which Model Wins? | time and materials vs fixed price | Medium |
| **P1** | How to Scope a Consulting Engagement | scoping consulting engagement | Low-Medium |
| **P2** | Professional Services Metrics That Matter in 2026 | professional services metrics | Medium |
| **P2** | Why Your PSA Software Isn't Enough | psa software limitations | Low |
| **P2** | Building a Service Catalog for Your Consulting Firm | consulting service catalog | Low |

#### Comparison Pages (High Intent)

These are landing pages, not blog posts. Direct product comparisons for buyers actively searching.

| Comparison | URL | Notes |
|------------|-----|-------|
| Servantium vs Salesforce CPQ | /compare/salesforce-cpq | They focus on product sales, not services |
| Servantium vs HubSpot | /compare/hubspot | CRM doesn't understand services delivery |
| Servantium vs Accelo | /compare/accelo | Direct PSA competitor |
| Servantium vs Harvest | /compare/harvest | Time tracking isn't engagement management |
| Servantium vs Monday.com | /compare/monday | Project management ≠ CPQ |
| Servantium vs Kantata (Mavenlink) | /compare/kantata | Enterprise PSA competitor |
| Servantium vs BigTime | /compare/bigtime | PSA for accounting/consulting |
| Servantium vs Scoro | /compare/scoro | All-in-one competitor |

**Page structure for comparisons:**
1. Quick comparison table (features, pricing, ideal customer)
2. Where [Competitor] excels
3. Where Servantium differs
4. Who should choose what
5. CTA to demo

### 1.2 Directory & Review Sites

**Must-have listings (do immediately):**

| Platform | Priority | Action | Notes |
|----------|----------|--------|-------|
| G2 | P0 | Create vendor profile | Reviews matter here |
| Capterra | P0 | Create profile | Gartner-owned, good for software discovery |
| GetApp | P0 | Create profile | Same backend as Capterra |
| Software Advice | P0 | Create profile | Same backend as Capterra |
| Product Hunt | P1 | Plan launch | Wait until you have a compelling "launch" moment |
| AlternativeTo | P1 | Add listing | People search "[competitor] alternative" |
| SaaSHub | P2 | Add listing | Growing directory |
| Clutch.co | P2 | May not fit | More for agencies than SaaS |

**LinkedIn presence:**
- [ ] Create LinkedIn company page
- [ ] Link in footer (done in code, need actual page)
- [ ] Post weekly from company page (repurpose blog content)
- [ ] Founders post 2-3x/week (thought leadership)

### 1.3 AI & LLM Indexing

**Already done:**
- [x] llms.txt with clear positioning
- [x] Structured data (JSON-LD)
- [x] Clean, crawlable HTML

**To do:**
- [ ] Monitor ChatGPT/Claude responses for "professional services CPQ" queries
- [ ] Create FAQ-heavy content (LLMs love pulling from FAQs)
- [ ] Ensure every page has clear, extractable definitions
- [ ] Consider llms-full.txt with more detailed product info

### 1.4 Technical SEO Checklist

| Task | Status | Notes |
|------|--------|-------|
| Google Search Console | ✅ | Verify ownership, submit sitemap |
| Bing Webmaster Tools | ✅ | Submit sitemap (covers DuckDuckGo) |
| Core Web Vitals | ⏳ | Check after 1 week of traffic |
| Mobile usability | ✅ | Static site, fast |
| Internal linking | ⏳ | Blog posts should link to each other |
| Image optimization | ✅ | Using optimized Unsplash URLs |
| Canonical URLs | ✅ | Set on all pages |
| 404 page | ✅ | Custom page exists |

### 1.5 Backlink Strategy

**Easy wins:**
1. HARO (Help a Reporter Out) - respond to journalist queries about consulting/services
2. Guest posts on consulting industry blogs
3. Podcast appearances (professional services, SaaS, startups)
4. Partner with complementary tools (accounting software, CRMs)

**Harder but valuable:**
1. Industry analyst coverage (Forrester, Gartner)
2. Case studies with early customers
3. Original research (surveys, benchmarks)

### 1.6 Analytics Setup

**Current state:** GA4 with cookie consent. Cloudflare analytics for all traffic.

**To verify:**
- [ ] GA4 tracking working (check Realtime view)
- [ ] Goals set up (demo booked, contact form submitted)
- [ ] Search Console linked to GA4
- [ ] Cloudflare Web Analytics enabled

**Dashboard needs:**
- Weekly: Unique visitors, top pages, traffic sources
- Monthly: Keyword rankings, backlinks, conversion rate

---

## Phase 2: The Platform

**Goal:** Build a proper web application that can grow with the business - composable, connected, maintainable.

### 2.1 What You Actually Need

Based on our conversations, here's the real requirements list:

| Feature | Priority | Complexity |
|---------|----------|------------|
| **Public marketing site** | P0 | Have it (static) |
| **Blog with visual editor** | P1 | Medium |
| **Internal pages (intranet)** | P1 | Medium |
| **Google SSO authentication** | P1 | Low-Medium |
| **Cookie consent (geo-aware)** | P2 | Low (use service) |
| **Admin dashboard** | P2 | Medium |
| **Email templates/signatures** | P2 | Low |
| **Analytics dashboard** | P3 | Medium |

### 2.2 Recommended Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 14)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Public    │  │  Internal   │  │      Admin          │  │
│  │   Pages     │  │   Pages     │  │     Dashboard       │  │
│  │ (marketing) │  │ (SSO-gated) │  │   (role-gated)      │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      SERVICES LAYER                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐  │
│  │  Auth    │  │   CMS    │  │ Analytics│  │   Email     │  │
│  │ (Clerk)  │  │ (Sanity) │  │ (GA4 +   │  │  (Resend)   │  │
│  │          │  │          │  │ PostHog) │  │             │  │
│  └──────────┘  └──────────┘  └──────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      HOSTING LAYER                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Vercel (or Cloudflare Pages)              │  │
│  │         - Edge functions for geo-detection             │  │
│  │         - Preview deployments for branches             │  │
│  │         - Automatic HTTPS and CDN                      │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Technology Stack

| Layer | Choice | Why |
|-------|--------|-----|
| **Framework** | Next.js 14 (App Router) | React-based, great DX, works with Claude |
| **Language** | TypeScript | Type safety, better autocomplete |
| **Styling** | Tailwind CSS | Utility-first, fast iteration |
| **Auth** | Clerk | Google SSO out of box, generous free tier |
| **CMS** | Sanity | Visual editing, real-time preview, free tier |
| **Database** | Postgres (Neon or Supabase) | If needed for custom data |
| **Email** | Resend | Simple API, great deliverability |
| **Analytics** | PostHog | Product analytics, session replay, free tier |
| **Cookies** | Cookiebot or custom | Geo-aware consent |
| **Hosting** | Vercel | Best Next.js experience |

### 2.4 Migration Path

**Week 1: Foundation**
- [ ] Initialize Next.js project with TypeScript
- [ ] Set up Tailwind with your design tokens
- [ ] Configure Vercel deployment
- [ ] Port existing pages (index, about, blog) to Next.js
- [ ] Verify parity with current site

**Week 2: Auth & Internal**
- [ ] Add Clerk authentication
- [ ] Configure Google SSO
- [ ] Create `/internal` route group (protected)
- [ ] Move signature template to internal area
- [ ] Set up role-based access (admin, internal, public)

**Week 3: CMS Integration**
- [ ] Set up Sanity project
- [ ] Define blog post schema
- [ ] Create visual editing experience
- [ ] Migrate existing blog posts
- [ ] Set up preview mode

**Week 4: Polish & Launch**
- [ ] Cookie consent with geo-detection
- [ ] Analytics verification
- [ ] Performance testing
- [ ] DNS cutover from static to Next.js
- [ ] Deprecate old static site

### 2.5 Cost Estimate

| Service | Free Tier | Paid (if needed) |
|---------|-----------|------------------|
| Vercel | 100GB bandwidth | $20/mo (Pro) |
| Clerk | 10k MAU | $25/mo (Pro) |
| Sanity | 100k API requests | $15/mo (Growth) |
| Resend | 3k emails/mo | $20/mo (Pro) |
| PostHog | 1M events/mo | $0 (free tier is generous) |
| Cookie Consent | Custom-built | Iubenda $29/yr (fallback) |
| **Total** | **$0** | **~$80/mo if you scale** |

### 2.6 Cookie Consent Decision

**Approach:** Build custom geo-aware consent system first. If it sucks after 1-2 weeks, switch to Iubenda ($29/yr).

**Custom build requirements:**
- Geo-detection via Cloudflare headers or IP lookup
- EU visitors: Opt-in (no tracking until consent)
- US visitors: Opt-out (tracking by default, can decline)
- Consent logging for compliance audits
- Preference storage in localStorage + optional server-side log

**Fallback:** Iubenda handles all of this out of the box for $29-99/year.

### 2.6 What This Enables

Once built, you can:

1. **Add pages instantly** - Just create a file in the right folder
2. **Edit content visually** - Sanity Studio for blog posts, pages
3. **Gate content by role** - Internal docs, admin tools
4. **Track everything** - PostHog shows user journeys
5. **Ship email** - Automated sequences, newsletters
6. **A/B test** - Vercel has built-in feature flags
7. **Scale globally** - Edge runtime, automatic CDN

### 2.7 What This Does NOT Include

Be clear about scope:

- ❌ The Servantium product (app.servantium.com) - that's a separate system
- ❌ Customer data or CRM functionality
- ❌ Billing/payments (use Stripe separately if needed)
- ❌ Complex workflows (this is marketing infra, not product)

---

## Decision Point

**Phase 1** can start immediately. It's content and listings work.

**Phase 2** requires a decision:
- Are you ready to invest 2-4 weeks in migration?
- Are you comfortable with the ~$80/mo potential cost at scale?
- Do you want me to start scaffolding the Next.js project?

Let me know which direction you want to go.

---

*Created: 2026-02-13*
*Last updated: 2026-02-13*
