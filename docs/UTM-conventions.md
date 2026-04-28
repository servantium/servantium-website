# UTM conventions

Every external link to servantium.com that you control should carry UTM parameters. Without them GA4 has to guess where the visitor came from and rolls everything into "direct" or "social/unknown" buckets, which destroys attribution.

This is the team standard. Pick the right values from the tables below; do not invent new ones unless absolutely necessary.

## Required parameters

| Param | What | Example |
|---|---|---|
| `utm_source` | Specific platform or domain | `linkedin`, `twitter`, `newsletter`, `producthunt`, `hackernews` |
| `utm_medium` | Channel category | `social`, `email`, `paid_social`, `referral`, `community` |
| `utm_campaign` | Specific campaign or content piece | `manifesto-launch`, `weekly-digest-2026-04`, `nvidia-inception-announce` |

## Optional parameters

| Param | When to use | Example |
|---|---|---|
| `utm_content` | A/B test or distinguish placements within one campaign | `headline-a`, `cta-bottom`, `inline-link` |
| `utm_term` | Paid keyword (Google Ads only) | `professional+services+os` |

## Source allowlist

Use these values verbatim. Don't capitalize, don't pluralize, don't add the dot in `linkedin.com`.

| `utm_source` | Where it covers |
|---|---|
| `linkedin` | Personal posts, company-page posts, comments, DMs |
| `twitter` | Tweets, replies, profile bio link |
| `newsletter` | Any email blast, drip, or one-off send |
| `producthunt` | Product Hunt launch + comments |
| `hackernews` | HN submissions or comments |
| `reddit` | Subreddit posts (rare per the no-Reddit policy) |
| `slack` | Customer or community Slack workspaces |
| `discord` | Discord server posts |
| `github` | README links, repo descriptions, gists |
| `cal-com` | Cal.com confirmation emails |
| `email-signature` | Founder/staff email signatures |
| `qr` | Printed materials (events, business cards) |
| `direct-share` | Share-with-a-friend internal feature |

## Medium allowlist

| `utm_medium` | When |
|---|---|
| `social` | Organic posts on any social platform |
| `paid_social` | Boosted/sponsored posts (LinkedIn Ads, Twitter Ads) |
| `cpc` | Google Ads (we don't run these yet) |
| `email` | Any email-driven traffic |
| `referral` | Listings, podcast notes, partner links |
| `community` | Slack/Discord/forum posts (not your own) |
| `event` | Conference badge, speaker page, event microsite |

## Campaign naming

`utm_campaign` is freeform but follow the pattern: `{topic}-{format}-{period?}`.

Good:
- `manifesto-launch`
- `nvidia-inception-announce`
- `weekly-digest-2026-04`
- `cpq-comparison-blog`
- `ai-services-keynote-q2`

Bad:
- `Christopher's LinkedIn post` (use a topic, not a person)
- `april` (ambiguous)
- `test123` (will outlive your memory of what this was)

## Content naming

`utm_content` distinguishes variants of the same campaign. Use kebab-case slugs.

Examples:
- `cta-button` vs `inline-link`
- `headline-a` vs `headline-b`
- `quote-card-1` vs `quote-card-2`

## Examples

LinkedIn post linking to the manifesto:
```
https://servantium.com/blog/what-is-the-professional-services-os/?utm_source=linkedin&utm_medium=social&utm_campaign=manifesto-launch&utm_content=founder-post
```

Newsletter weekly digest pointing to a specific post:
```
https://servantium.com/blog/why-services-businesses-need-cpq/?utm_source=newsletter&utm_medium=email&utm_campaign=weekly-digest-2026-04&utm_content=feature-link
```

Cal.com confirmation email linking back to platform:
```
https://servantium.com/platform/?utm_source=cal-com&utm_medium=email&utm_campaign=demo-confirmation
```

## Tooling

Build links by hand for the first 20-30. Once the pattern is in muscle memory, use a builder. Recommended:
- [ga-dev-tools.web.app/campaign-url-builder](https://ga-dev-tools.web.app/campaign-url-builder/) (Google's)
- A spreadsheet column with a CONCAT formula if you prefer offline

## Don't UTM these

- Internal navigation (page-to-page on servantium.com)
- Email links between team members
- Backlinks others build (they're outside your control; GA4's referrer report covers them)

## When you break the rules, document it

If you set up a campaign that doesn't fit the allowlist, add the new value to the table above in the same PR. Don't quietly let one-off values accumulate; they fragment your reports.
