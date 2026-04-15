# Publishing Pipeline Roadmap

Where the pipeline is heading. Workflow A (release notes) and Workflow B (help docs) already ship — see [README.md](README.md). This file covers **Workflow C** (automated screenshots) and **Workflow D** (docs linting).

---

## Workflow C — Screenshot Capture

**Problem:** Claude can write excellent docs about a feature, but if it can't see the UI it writes docs that feel abstract. We need real screenshots, kept in sync with the app, without anyone remembering to update them.

### Trigger

Three options, can stack:

1. **`workflow_dispatch`** — manual run, pick a route or a manifest entry
2. **Nightly cron** — every morning, full refresh of all manifest entries
3. **Cross-repo trigger from `servantium-app`** — when a PR touching UI components merges to the app's main branch, fire a `repository_dispatch` to the website repo

### Flow

1. Spin up the Servantium app in CI via `docker-compose up` (or pull a pre-built preview container from Cloudflare Pages / GHCR if the app is hosted elsewhere)
2. Seed a deterministic test account (fixture data, stable names, fixed dates)
3. Run a Playwright script that reads `scripts/screenshots.manifest.ts` and, for each entry, visits the route, waits for the specified selector, optionally performs interactions (click, fill, hover), and snapshots
4. Pipe the PNGs through `sharp` for consistent 2x resolution + webp variants
5. Compare against committed screenshots via `pixelmatch` — if nothing changed, exit clean. If pixel diff > threshold, commit the new versions
6. Open a bot PR titled "screenshots: refresh for <feature>" with before/after thumbnails in the PR body

### The manifest

`scripts/screenshots.manifest.ts`:

```ts
export const screenshots = [
  {
    id: 'engagements/create-form',
    route: '/engagements/new',
    viewport: { width: 1440, height: 900 },
    waitFor: '[data-testid="engagement-form"]',
    interactions: [],
  },
  {
    id: 'ai-features/estimate-inline',
    route: '/engagements/demo-seed/estimate',
    viewport: { width: 1440, height: 900 },
    waitFor: '[data-testid="estimate-panel"]',
    interactions: [
      { type: 'click', selector: '[data-testid="run-ai-estimate"]' },
      { type: 'wait', ms: 1500 },
    ],
  },
];
```

Max owns this file. Every new feature that should appear in docs gets an entry. The entry IDs become the canonical names used by the `<HelpScreenshot>` component.

### How help docs reference screenshots

A new Grove component:

```mdx
<HelpScreenshot id="engagements/create-form" alt="New engagement form with phase inputs" />
```

Component behaviour:
- Resolves the ID to `public/help-screenshots/<id>@2x.webp`
- Falls back to `@1x.png` if webp isn't supported
- If the file doesn't exist, renders a visible placeholder in dev and fails the build in CI (via Workflow D's lint)
- Supports `caption` and `width` props

### How the writer knows which screenshots exist

`help-docs-writer.mjs` is updated to list `public/help-screenshots/` before each writer call and append the list to the payload:

```json
{
  "available_screenshots": [
    { "id": "engagements/create-form", "alt_hint": "New engagement form" },
    { "id": "ai-features/estimate-inline", "alt_hint": "AI estimate panel" }
  ]
}
```

The writer prompt grows one rule:

> If a screenshot ID in `available_screenshots` matches the section you are writing, embed it with `<HelpScreenshot id="..." alt="..." />`. Never invent IDs.

That's it. No hallucinated screenshots, no dead references.

### Why this order (C before D)

Workflow D depends on there being something to lint. Screenshots are the biggest category of potentially-missing assets, so getting C in place first means D has real work to do on day one.

### Effort estimate

- Manifest + Playwright runner: 1 day
- `<HelpScreenshot>` component + fallback: half a day
- Writer integration (list available screenshots, prompt rule): 2 hours
- Cross-repo trigger from `servantium-app`: half a day
- **Total: ~2 days**

### Open questions

- Where does the app run in CI? Preview container, docker-compose, or against a staging environment? Answer determines auth strategy.
- Seed data: fixture file committed to the app repo, or runtime setup via API calls? Fixtures are simpler and more stable.
- Retention: do we keep old screenshots for versioned docs, or always overwrite? (Probably always overwrite until we have versioned docs.)

---

## Workflow D — Docs Lint

**Problem:** Claude can emit broken MDX, invalid frontmatter, or links to routes that don't exist. Astro's build catches some of it. Most of it is silent.

### Trigger

```yaml
on:
  pull_request:
    paths:
      - 'src/content/docs/**'
      - 'src/content/blog/**'
      - 'public/help-screenshots/**'
```

Runs on every PR that touches content, including the bot PRs from Workflows A, B, and C. This means bot output is linted before a human ever sees it — and if the bot produces bad MDX, the PR fails its own check and signals "don't merge me."

### Checks

**1. Frontmatter schema validation.** Runs `zod` against the `src/content.config.ts` schemas for `docs`, `blog`, and release notes. Any missing required field, wrong type, or invalid enum fails with an exact file + line pointer.

**2. Internal link validation.** Parses every markdown link in the content. For each `/help/...`, `/blog/...`, or `/resources/...` link, verifies the target route exists in the Astro route tree. Flags dead links with suggestions (closest match by Levenshtein).

**3. `<HelpScreenshot>` reference check.** Parses every `<HelpScreenshot id="..." />` and verifies `public/help-screenshots/<id>@2x.webp` exists. Missing references fail the build.

**4. Grove component import check.** Every MDX file that uses `<Aside>`, `<Steps>`, `<Tabs>`, or `<HelpScreenshot>` must import them from `@/theme/grove/components`. Flags Starlight imports (`@astrojs/starlight/components`) as an error — they're no longer valid.

**5. Style lint via `vale`.** Runs [Vale](https://vale.sh/) with a Servantium-specific style guide in `.vale.ini` + `styles/Servantium/*.yml`:
   - No em dashes
   - No "we're thrilled / excited to announce"
   - Definition-first paragraphs (heuristic: first sentence should declare what the page is about)
   - Preferred terms: "engagement" not "project", "operator" not "user" in certain contexts
   - Avoid hedge words ("maybe", "sort of", "kind of")

**6. Spell check via `cspell`.** With a Servantium dictionary (`cspell.json`) that includes product names, integrations, and team vocabulary. New words get added to the dictionary via the PR that introduces them, which forces a moment of "is this really the term we want."

**7. Reading-time / length sanity.** Release notes over 250 words or help docs over 1000 words get a warning (not a failure). Keeps the bot honest about the length caps in its prompts.

### Output

Failures show up as PR checks with inline annotations. Warnings surface as a comment on the PR from `servantium-bot`, listing each issue with a `Fix with inline edit` hint.

### Auto-fix mode

For trivial issues (em dash → regular dash, Starlight import → Grove import, trailing whitespace), Workflow D offers an auto-fix step that pushes a correction commit to the bot branch. Gated by a label (`auto-fix: allow`) so it never runs without a reviewer's consent.

### Effort estimate

- Frontmatter + link validation: half a day
- `<HelpScreenshot>` check: 2 hours
- Import check + Starlight flagging: 1 hour
- Vale setup + Servantium style rules: 1 day (most time is writing rules, not plumbing)
- cspell dictionary: 2 hours
- Auto-fix path: half a day
- **Total: ~2.5 days**

### Why this matters

The release-notes and help-docs bots already run unattended. Without Workflow D, the only thing standing between Claude and prod is a human who might just click "merge." Workflow D makes the review meaningful: a clean PR check means the content is at least structurally sound, and the human can focus on "is this accurate" instead of "is the MDX valid."

---

## Stretch — Workflow E (future)

Rough ideas, not committed:

- **Analytics-driven refresh.** If a help doc has a high bounce rate or triggers many chatbot escalations, fire a "stale?" alert to a Slack channel and optionally run the orchestrator against recent related PRs to see if a rewrite is needed.
- **Translation pass.** After Workflow B lands English MDX, a follow-up workflow produces `es/`, `fr/`, `de/` translations via Claude with language-specific prompts. Gated by a flag until we actually have international customers.
- **Video script generator.** For major features, a workflow that reads a release note + help doc and drafts a 60-second video script. Max or Christopher records. Posted alongside the release note.
- **Changelog digest.** Weekly cron that reads all release notes merged that week and drafts an email newsletter summary. Sits in your drafts folder until you review and send.

---

## Priority and sequencing

1. **Workflow B (done in this change set)** — unblocks automatic help docs
2. **Workflow D** — should ship next, regardless of C. Even without screenshots, the link/frontmatter/style checks pay for themselves the first time they catch a bot mistake
3. **Workflow C** — ships when Max and Christopher agree on the manifest format and CI seed-data strategy
4. **Workflow E experiments** — only after A–D are boring and stable

Each workflow is independent. None of them block each other.
