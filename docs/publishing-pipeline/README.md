# Servantium Publishing Pipeline

Automated release notes and help docs, written by Claude, reviewed by humans, promoted by git merge.

This folder is the source of truth for how the pipeline works. If the behaviour ever drifts from what's written here, fix the docs or fix the code — don't let them diverge.

---

## TL;DR

1. A PR merges to `develop`.
2. `release-notes.yml` drafts a release note. `help-docs.yml` decides which help docs need to change, then drafts the MDX.
3. Both workflows open a preview PR back into `develop`.
4. A human reviews, edits inline if needed, and merges.
5. `test.servantium.com` updates immediately (Cloudflare Pages auto-deploys from `develop`).
6. Later, when `develop` is merged into `main`, production updates. **The pipeline does not re-run.** Content is written once and reused across environments.

![Pipeline overview](images/overview.svg)

---

## File map

```
.github/
  workflows/
    release-notes.yml          # Workflow A — release notes
    help-docs.yml              # Workflow B — help docs (orchestrator + writer)
  scripts/
    claude-run.mjs             # Shared Anthropic SDK runner
    docs-index.mjs             # Emits an index of existing help docs
    help-docs-writer.mjs       # Iterates action list, calls the writer once per action
  claude-prompts/
    release-note.system.md     # Short prompt for release notes
    help-docs-orchestrator.system.md
    help-docs-writer.system.md

docs/publishing-pipeline/
  README.md                    # This file
  ROADMAP.md                   # Workflow C (screenshots) + Workflow D (linting)
  images/                      # SVG diagrams
```

All prompts are **short on purpose**. Long prompt files get skimmed. Keep them under 40 lines.

---

## Installation — one-time setup

### 1. Repository secrets

Go to **Settings → Secrets and variables → Actions → New repository secret** on the `servantium-website` repo and add:

| Secret              | Value                                                |
|---------------------|------------------------------------------------------|
| `ANTHROPIC_API_KEY` | A production-tier Anthropic key with Sonnet 4.5 access |

The existing `GITHUB_TOKEN` is provided automatically by Actions — no action needed.

### 2. Workflow permissions

On the same repo, go to **Settings → Actions → General → Workflow permissions** and ensure:

- **Read and write permissions** is selected
- **Allow GitHub Actions to create and approve pull requests** is checked

Without this, the bot cannot push branches or open PRs.

### 3. Bot identity (optional but tidy)

The workflows commit as `servantium-bot <bot@servantium.com>`. That's a string, not a real user — it just keeps the commit log clean. If you want a real identity with an avatar, create a machine user and use its token; otherwise leave it.

### 4. Branch protection (recommended)

On `main`, require:
- PR review before merge
- Status checks passing

This means the `develop -> main` promotion merge is a deliberate act, not an accident.

---

## Workflow A — Release Notes

### Triggers

| Trigger                 | When it fires                                               |
|-------------------------|-------------------------------------------------------------|
| `pull_request` closed   | Any PR merged into `develop` (not bot PRs, not closed-without-merge) |
| `workflow_dispatch`     | Manual run via the Actions tab, with a PR number            |
| `repository_dispatch`   | Cross-repo ping from the app repo (see "Hooking into app releases" below) |

### What it does

1. Checks out the website repo
2. Fetches the merged PR's title, body, and diff (truncated to 50k chars)
3. Calls Claude Sonnet 4.5 with `release-note.system.md` as the system prompt and the PR context as the user message
4. Writes the response to a new MDX file under `src/content/docs/help/release-notes/YYYY-MM-DD-<slug>.mdx`
5. Pushes a bot branch (`bot/release-note-<pr#>`) and opens a PR against `develop`

### Hooking it into Max's releases

Three options, pick one or stack them:

**Option A — trigger on every merged website PR (default, already wired).** Every PR that lands on `develop` produces a note. Good while the pipeline is new — you see every run, you catch failures early.

**Option B — trigger only on GitHub Releases from the website repo.** Edit `release-notes.yml` to add:

```yaml
on:
  release:
    types: [published]
```

Then whenever Max publishes a Release on the website repo, the workflow fires and writes a note for that release. Skip the PR triggers entirely if you prefer fewer, batched notes.

**Option C — cross-repo trigger from the app repo (Max's day-to-day).** In the `servantium-app` repo, add a workflow that fires when Max tags a new app version:

```yaml
# In servantium-app/.github/workflows/notify-website.yml
name: Notify website on release
on:
  release:
    types: [published]
jobs:
  dispatch:
    runs-on: ubuntu-latest
    steps:
      - uses: peter-evans/repository-dispatch@v3
        with:
          token: ${{ secrets.WEBSITE_REPO_TOKEN }}   # PAT with repo scope on servantium-website
          repository: servantium/servantium-website
          event-type: app-release
          client-payload: |
            {
              "version": "${{ github.event.release.tag_name }}",
              "notes": ${{ toJson(github.event.release.body) }},
              "diff": ""
            }
```

Max creates a PAT with `repo` scope on the website repo, stores it as `WEBSITE_REPO_TOKEN` on the app repo. Every app release then lands as a draft release note on the website.

### Prompt

See [`.github/claude-prompts/release-note.system.md`](../../.github/claude-prompts/release-note.system.md). Key rules:

- Customer-facing voice, not engineering
- 180 words max
- Grove components only (`import { Aside } from '@/theme/grove/components';`) — never Starlight
- Badge variant map: Feature → success, Fix → caution, Improvement → note, Internal → note

If Max wants to tweak the tone, edit that file. It's under 40 lines by design.

### How to run it manually

Actions tab → **Release Notes (preview)** → **Run workflow** → enter a PR number → **Run workflow**.

Use this to re-draft a note for an older PR, or to generate a note for a PR that the automated trigger missed.

---

## Workflow B — Help Docs (orchestrator + writer)

![Orchestrator and writer](images/orchestrator.svg)

### Why two passes

A single prompt trying to "figure out what docs to write AND write them" gets muddled. Splitting the job into two Claude calls keeps each prompt focused and short:

- **Pass 1 — the librarian.** Receives the PR diff and a machine-readable index of every existing help doc (title, path, description). Decides which docs are stale and need updates, whether any net-new docs are needed, or whether the change is purely internal and no doc action is required. Returns strict JSON.
- **Pass 2 — the writer.** Receives one action at a time, along with the existing doc content (for updates) or a blank slate (for creates). Rewrites or writes the MDX. Never sees the full docs library — just the one doc it's editing plus enough context to write well.

### Why this beats "regenerate from scratch every time"

- **Updates preserve history.** The writer sees the existing doc and rewrites only the stale sections. Git diffs stay reviewable.
- **Creates stay rare.** The librarian is told to prefer updates, so the docs library doesn't bloat.
- **Each prompt stays short.** No single prompt has to hold "all docs + diff + style guide + output format."
- **Observability.** The intermediate `actions.json` is a readable, diffable artifact. If the bot made a bad call, you can see exactly which action went wrong.

### Trigger

Same as Workflow A: PR merged into `develop` (skip bot PRs), plus manual `workflow_dispatch`.

### Flow

1. **Build the docs index.** `docs-index.mjs` walks `src/content/docs/help/**/*.mdx`, extracts title + description from frontmatter, and emits JSON.
2. **Orchestrator pass.** `claude-run.mjs --json` feeds the docs index + PR context into Sonnet 4.5 with the orchestrator prompt. Output: `/tmp/actions.json`.
3. **Short-circuit.** If `actions.length === 0`, the job exits cleanly. No PR opened.
4. **Writer pass.** `help-docs-writer.mjs` iterates actions. For each, it builds a context JSON (existing doc body, brief, PR diff) and invokes `claude-run.mjs` once with the writer prompt. Each draft is written to `/tmp/drafts/<relative path under help/>.mdx`.
5. **Open preview PR.** All drafts are copied into the live docs tree on a bot branch, committed, pushed, and a single PR is opened against `develop` with a summary of every action for reviewer context.

### How updates to existing docs work

The librarian decides: "This PR changed the engagement creation flow. The doc at `src/content/docs/help/guides/engagements/creating-engagements.mdx` covers that. Update it."

The writer then receives:

```json
{
  "action_type": "update",
  "brief": "Update the 'Add a phase' section to match the new inline editor. The modal approach is gone.",
  "reason": "PR #412 replaces the modal with an inline editor.",
  "existing_doc": "<full current MDX>",
  "diff": "<PR diff>"
}
```

And is told (by the writer prompt):

> When updating an existing doc: preserve the existing structure and headings you don't need to touch. Rewrite only the sections made stale by the PR diff. Keep the original frontmatter `title` unless the scope genuinely changed.

The output overwrites the existing file in the bot branch. Git produces a clean diff you can review section by section.

---

## Preview to production

![Promotion](images/promotion.svg)

The whole pipeline is designed around one principle: **content is authored once, then merged forward.**

- Workflows only fire on PRs merged **into** `develop`
- When a bot PR merges to `develop`, the MDX is live on test.servantium.com
- When you later merge `develop` into `main`, the exact same MDX ships to production
- The promotion merge **does not trigger** the workflows, because it's a PR whose base is `main`, not `develop`
- This also means bot PRs are deliberately skipped (the `if:` guard checks `pull_request.user.login != 'servantium-bot'`) so they never cause loops

You never have to "regenerate for production." You just merge.

---

## What to do when something goes wrong

**The workflow failed with an Anthropic API error.**
Re-run the failed job from the Actions tab. If it fails twice in a row, check `ANTHROPIC_API_KEY` is valid and has Sonnet 4.5 access.

**The bot wrote something factually wrong.**
Edit the file directly in the bot PR before merging. Prompts are short precisely so edits are the normal path, not a failure mode.

**The bot opened a PR you don't want.**
Close it. No cleanup needed — the bot branch is disposable. Next merge to `develop` produces a fresh one.

**The orchestrator keeps creating duplicate docs.**
The librarian is told to prefer updates. If it's still creating duplicates, the existing doc's `description` is probably too vague for Claude to recognise it covers the topic. Tighten the description and the orchestrator will find it next time.

**The writer ignored the existing structure and rewrote the whole doc.**
That's a prompt bug. Edit `help-docs-writer.system.md` to emphasise preservation more strongly, or temporarily increase the PR-review burden. Commit the prompt change — it's version-controlled alongside the docs.

**The release note mentions Starlight imports.**
Very old runs did. If you see this, it means the cached prompt wasn't updated — confirm the workflow is pointing at `release-note.system.md` and that file specifies `@/theme/grove/components`.

---

## Prompts: keep them short

Every prompt file in `.github/claude-prompts/` is deliberately under 40 lines.

If you feel tempted to add a new rule, first ask: can I delete an existing rule instead? The prompts should read like a short style guide, not a manual. Claude does better with tight constraints than with encyclopedic ones.

Changes to prompts ship like any other code: PR → review → merge. The prompts are version-controlled, so you can git-blame a regression back to the exact wording change that caused it.

---

## Model

Currently pinned to `claude-sonnet-4-5` via the `CLAUDE_MODEL` env var in both workflows. Bump there when Anthropic releases a new minor. If you need to test a new model without committing, use `workflow_dispatch` and pass the model as an override (not currently exposed — easy to add).

---

## What this pipeline does NOT do (yet)

- No screenshot capture — see [ROADMAP.md](ROADMAP.md) Workflow C
- No docs linting beyond Astro build — see ROADMAP Workflow D
- No broken link checking
- No `llms.txt` auto-update
- No cross-language translation

All of these are planned. Ask before building anything out of order.
