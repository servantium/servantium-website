# CTA tagging audit

Inventory of primary CTAs across the marketing site, ready to be tagged with `data-cta="<label>"` for GTM click tracking. Approve labels here, then I sprinkle the attributes in source.

Convention: snake_case, prefix by surface (`home_`, `platform_`, `about_`, `blog_`, `resource_`, `nav_`, `footer_`), then describe the action.

## Homepage (`/`)

| Element | Location | Proposed `data-cta` value |
|---|---|---|
| Hero "Schedule a Call" | Hero, primary | `home_hero_schedule_call` |
| Hero "Explore the Platform" | Hero, secondary | `home_hero_explore_platform` |
| Sticky nav "Book a Demo" | Top nav | `nav_book_demo` |
| Cal embed inline submission | Bottom CTA section | `home_cal_inline_book` *(also covered by `cal_booking_completed` event)* |
| Contact form "Send Message" submit | Bottom CTA section | `home_contact_send` *(also covered by `form_submit:homepage_contact`)* |

## Platform (`/platform/`)

| Element | Location | Proposed `data-cta` value |
|---|---|---|
| Hero "Book a Demo" | Hero | `platform_hero_book_demo` |
| Hero "Contact Us" | Hero | `platform_hero_contact` |
| Pricing card "Book a Demo" | Pricing block | `platform_pricing_book_demo` |
| Pricing card "Calculate Your ROI" | Pricing block | `platform_pricing_open_roi` |
| ROI modal "Get Your Custom Analysis" | ROI modal | `platform_roi_book` |
| Narrative "Explore features ↓" links | Comic narrative | `platform_narrative_explore` (could be variant per stage: `_scope`, `_price`, `_staff`, `_learn`) |
| Contact modal "Send Message" submit | Modal | `platform_contact_send` *(also `form_submit:platform_contact`)* |

## Platform → Scope deep dive (`/platform/scope/`)

| Element | Proposed `data-cta` value |
|---|---|
| Bottom CTA "Schedule a Demo" | `scope_cta_book_demo` |
| Bottom CTA "← Back to Platform" | `scope_cta_back` |

## About (`/about/`)

| Element | Proposed `data-cta` value |
|---|---|
| Hero / closing "Book a Demo" | `about_book_demo` |
| Hero / closing "Send a Message" (opens modal) | `about_open_contact` |
| Contact modal submit | `about_contact_send` *(also `form_submit:about_contact`)* |

## Blog (`/blog/[slug]/`)

| Element | Proposed `data-cta` value |
|---|---|
| Inline "Book a Demo" callouts (rare) | `blog_inline_book_demo` |
| Newsletter signup (when added) | `blog_newsletter_subscribe` |
| Related-post card click | `blog_related_post` (low priority — link clicks are inherently tracked as page_views) |

## Resources (`/resources/`)

| Element | Proposed `data-cta` value |
|---|---|
| LeadMagnetForm submit | `resource_lead_magnet_submit` *(also `form_submit:lead_magnet`)* |
| Resource card "Download" / "Open Tool" | `resource_open` (with `data-resource-type` for kind) |

## Navigation + Footer

| Element | Proposed `data-cta` value |
|---|---|
| Nav "Platform" | `nav_link_platform` |
| Nav "Resources" | `nav_link_resources` |
| Nav "About" | `nav_link_about` |
| Nav "Book a Demo" (primary CTA) | `nav_book_demo` |
| Nav "Log In" | `nav_login` *(outbound to `app.servantium.com`)* |
| Footer "Book a Demo" | `footer_book_demo` |
| Footer logo home link | `footer_home` |
| Footer social icons | `footer_social_<platform>` |

## What gets a tag, what doesn't

**Tag:**
- Anything with a primary or secondary button visual treatment
- Form submits (label = which form)
- Modal-opener buttons (ROI calc, contact)
- Outbound links to `app.servantium.com` (login, "open app" etc.)
- Newsletter / subscribe forms (when added)

**Don't tag:**
- Plain prose links inside body copy (auto-tracked as link clicks via GTM "Click - Just Links" if needed)
- Decorative anchors (skip-link, "back to top")
- Cookie banner accept/decline (those are consent updates, separate event)
- The astronaut Easter egg on /404

## Approval action

Either:
- Reply "approved as-is" and I sprinkle `data-cta` attributes across these files in a single commit, with a short README in `docs/` documenting the schema
- Or edit any labels above and tell me the changes; I apply.

Once tagged, the GTM trigger config is one Click trigger filtered to `data-cta` presence, one GA4 event tag firing on it. ~10 minutes of dashboard work after the code lands.
