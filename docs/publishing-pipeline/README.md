# Servantium Publishing Pipeline

Automated release notes and help docs, written by AI agents, reviewed by humans in the portal, promoted by git merge.

This folder is the source of truth for how the pipeline works. If the behaviour ever drifts from what's written here, fix the docs or fix the code -- don't let them diverge.

---

## Who does what

Every actor in the pipeline has a single, named role. If you're reading a workflow log or a commit and wondering "who did this?", the table below is the answer.

| Actor | What it is | Role |
|-------|-----------|------|
| **GitHub Actions** | Compute platform | Runs the YAML workflow files. Orchestrates everything. Makes no content decisions. |
| **Servantium Bot** | GitHub App identity | Authenticates git push and PR creation. Commits show as `servantium-bot[bot]`. Created via github.com/organizations/servantium/settings/apps. Secrets: `SERVANTIUM_BOT_APP_ID` + `SERVANTIUM_BOT_PRIVATE_KEY`. |
| **DocsOrchestrator** | AI agent (Claude Sonnet 4.5) | Reads the PR diff and docs index, decides which docs to create/update/skip. Returns a JSON action list. Replaces the old ReleaseWriter + Help Docs Orchestrator. Prompt lives in the portal agents table. |
| **DocsWriter** | AI agent (Claude Sonnet 4.5) | Writes or updates individual MDX files based on the approved action list. One Claude call per action. Content-type overrides (release-note, help-guide, glossary, blog) are editable in the portal. Replaces the old Help Docs Writer. |
| **Internal Portal** | test.internal.servantium.com | Hosts the approval gate (action review + draft review), agent prompts, banned words, post-processing rules, and content-type overrides. Triggers Workflow 2 via `repository_dispatch`. |
| **GITHUB_TOKEN** | Default Actions token | Read-only: fetches PR metadata and diffs. Does not push code or open PRs. |

---

## TL;DR

1. A PR merges into the active test branch (currently `feature/astro-prototype`, soon `develop`).
2. GitHub Actions runs `docs-orchestrate.yml`. **DocsOrchestrator** proposes an action list.
3. The action list appears in the **Internal Portal** for human review (Stage 1).
4. A human checks/unchecks actions, edits briefs, then clicks "Proceed to drafts."
5. The portal fires `docs-write.yml` via `repository_dispatch`. **DocsWriter** writes each approved action.
6. Drafted files appear in the portal for review (Stage 2). The human can edit MDX, preview rendered output, and check validation results.
7. On "Approve & Merge," the portal commits any edits to the bot branch and merges the PR.
8. Bot branch auto-deletes (GitHub setting enabled).
9. `test.servantium.com` updates immediately (Cloudflare Pages auto-deploys from the test branch).
10. Later, merge the test branch into `main` for production. **The pipeline does not re-run.** Content is written once.

> **Stealth releases.** A direct push to `develop` (no PR) will not trigger the pipeline. Changes must arrive as a merged PR.

> **Branch state (2026-04-16):** The pipeline currently watches `feature/astro-prototype` AND `develop`. When the astro prototype merges to main, drop `feature/astro-prototype` from the `branches:` list in both workflow files.

![Pipeline overview](images/overview.svg)

---

## File map

```
.github/
  workflows/
    docs-orchestrate.yml         # Stage 1 -- proposes actions (calls DocsOrchestrator)
    docs-write.yml               # Stage 2 -- writes drafts (calls DocsWriter)
    release-notes.yml            # DEPRECATED -- kept for parallel testing
    help-docs.yml                # DEPRECATED -- kept for parallel testing
  claude-prompts/
    docs-orchestrator.system.md  # Orchestrator system prompt (fetched from portal at runtime)
  scripts/
    claude-run.mjs               # Shared Anthropic SDK runner
    docs-index.mjs               # Emits an index of existing help docs
    help-docs-writer.mjs         # Iterates action list, calls DocsWriter once per action

docs/publishing-pipeline/
  README.md                      # This file
  COMBINED-PIPELINE.md           # Architecture doc for the two-stage pipeline
  ROADMAP.md                     # Workflow C (screenshots) + Workflow D (linting)
  images/                        # SVG diagrams
```

> **Prompts live in the portal, not in the repo.** Both workflow files fetch the live prompt from the Internal Portal at run start. The `claude-prompts/` directory holds reference copies; the portal is the source of truth. To change what DocsOrchestrator or DocsWriter produces, edit the prompt on the /agents page at test.internal.servantium.com.

---

## Installation -- one-time setup

### 1. Repository secrets

Go to **Settings > Secrets and variables > Actions > New repository secret** on the `servantium-website` repo and add:

| Secret | Value |
|--------|-------|
| `ANTHROPIC_API_KEY` | A production-tier Anthropic key with Sonnet 4.5 access |
| `SERVANTIUM_BOT_APP_ID` | The App ID of the Servantium Bot GitHub App |
| `SERVANTIUM_BOT_PRIVATE_KEY` | The private key (.pem) for the Servantium Bot GitHub App |

**GITHUB_TOKEN** is provided automatically by Actions. It is read-only and used only to fetch PR metadata and diffs. All write operations go through **Servantium Bot**.

### 2. Workflow permissions

On the same repo, go to **Settings > Actions > General > Workflow permissions** and ensure:

- **Read and write permissions** is selected
- **Allow GitHub Actions to create and approve pull requests** is checked

### 3. Bot identity

**Servantium Bot** is a GitHub App, not a human or a PAT. Commits show as `servantium-bot[bot]` in the git log. The workflow generates an installation token from `SERVANTIUM_BOT_APP_ID` + `SERVANTIUM_BOT_PRIVATE_KEY` at run start, uses it for git push and PR creation, and the token expires after one hour.

### 4. Branch auto-delete

Enable **Settings > General > Automatically delete head branches** on the repo. This ensures bot branches (`bot/docs-<pr#>`) are cleaned up after merge.

### 5. CF Pages: exclude bot branches

In the Cloudflare Pages project settings, add `bot/*` to the list of excluded branches for preview builds. Bot PRs should not trigger preview deployments -- the portal handles preview rendering.

### 6. Testing safely -- first-run playbook

Before relying on the pipeline for real PRs:

1. **Verify permissions from Step 2 are saved.** This is the #1 first-run failure.
2. Go to **Actions > docs-orchestrate.yml > Run workflow**
3. Pick `feature/astro-prototype` as the branch, enter a recently merged PR number, click Run
4. Watch the run. Expected: the portal receives an action list at Stage 1.
5. Review actions in the portal, click "Proceed to drafts."
6. Verify `docs-write.yml` fires, DocsWriter produces drafts, and a PR appears authored by `servantium-bot[bot]`.
7. Review the PR in the portal's Stage 2 view. **Do not merge it.** Read the MDX, verify voice and frontmatter, then close the PR.

Safety guarantees:

- **Nothing auto-merges.** A human must approve in the portal. If the output is bad, close the PR.
- **Servantium Bot PRs skip the workflow** (the `if:` guard checks `user.login != 'servantium-bot[bot]'`), so bot PRs cannot loop.
- **Drafts only touch `src/content/docs/help/**` and release notes.** Nothing edits layouts, components, or config.
- **The Anthropic call has 3 retries with exponential backoff.**
- **Banned words and post-processing rules are fetched from the portal** and applied deterministically after each Claude call.

### 7. Branch protection (recommended)

On `main`, require PR review before merge and status checks passing.

---

## Two-stage pipeline

### Stage 1: docs-orchestrate.yml (DocsOrchestrator)

**Triggers:**

| Trigger | When it fires |
|---------|---------------|
| `pull_request` closed | Any PR merged into `develop` (not Servantium Bot PRs, not closed-without-merge) |
| `workflow_dispatch` | Manual run via the Actions tab, with a PR number |

**What it does:**

1. GitHub Actions checks out the repo and fetches the PR diff + metadata.
2. GitHub Actions fetches the DocsOrchestrator agent config from the portal (prompt + post-rules + banned words).
3. `docs-index.mjs` builds a summary index from the docs library (or from D1 cache if available).
4. **DocsOrchestrator** (Claude Sonnet 4.5) receives the docs index + PR context. Returns a JSON action list: `[{type, path, title, brief, content_type}]`.
5. GitHub Actions POSTs the action list to the portal (`orchestrator_complete` webhook).
6. Workflow ends. No files written yet.

**Version auto-increment:** DocsOrchestrator reads PR labels (`release:major`, `release:minor`, `release:patch`) to determine the next version number for release notes.

### Portal Stage 1: Action Review

The portal shows a checklist of proposed actions. A human can:

- Check/uncheck individual actions
- Edit the brief (instructions to DocsWriter)
- Preview the existing file content
- Click "Proceed to drafts," which fires a `repository_dispatch` to trigger Stage 2

### Stage 2: docs-write.yml (DocsWriter)

**Trigger:** `repository_dispatch` event type `docs-write` from the portal.

**Payload:** `{pr_number, version, repo, approved_actions: [...]}`

**What it does:**

1. GitHub Actions checks out the repo.
2. GitHub Actions fetches the DocsWriter base prompt from the portal.
3. For each approved action:
   a. Fetch the content-type override prompt from the portal (release-note, help-guide, glossary, blog).
   b. If update: read the existing file content.
   c. Call Claude with: base prompt + content-type override + brief + existing content + PR diff excerpt.
   d. Run post-processing: banned word replacement, em-dash removal, import validation.
   e. Run automated validation checks (frontmatter schema, internal links, file size).
   f. Write the file to `/tmp/drafts/`.
4. Commit ALL drafted files to ONE `bot/docs-<pr#>` branch.
5. Push branch, open ONE PR targeting the base branch.
6. POST `drafts_complete` webhook to the portal with all file contents.

**Single bot branch:** All docs from one PR merge land in one branch and one PR. Not one PR per doc.

### Portal Stage 2: Draft Review

The portal shows a tabbed preview of all drafted files. For each file:

- Rendered MDX preview with live site CSS
- Raw MDX source editor
- Validation indicators (frontmatter valid, no banned words, links resolve, no em dashes)

On "Approve & Merge":
1. Portal commits any edits from D1 to the bot branch.
2. Portal merges the bot PR via Servantium Bot token.
3. Bot branch auto-deletes (GitHub setting).
4. CF Pages rebuilds from the base branch.

---

## Prompt and rule editing

### Agent prompts

Go to test.internal.servantium.com/agents. Find DocsOrchestrator or DocsWriter. Edit the system prompt. Save. The next workflow run picks up the change.

### Content-type overrides

Each content type (release-note, help-guide, glossary, blog) has a per-type prompt addition stored in the portal's `agent_content_types` table. This override is appended to the DocsWriter base prompt when writing that content type. Edit at /agents in the portal.

### Banned words

Managed in the portal. Fetched at the start of each workflow run. Applied as a deterministic find-and-replace during post-processing, not by Claude.

### Post-processing rules

Also managed in the portal. Applied after each Claude call: em-dash replacement, curly-quote straightening, import line validation, character encoding cleanup. These are not AI decisions -- they are string transforms.

---

## Preview to production

![Promotion](images/promotion.svg)

The pipeline is designed around one principle: **content is authored once, then merged forward.**

- GitHub Actions workflows only fire on PRs merged **into** `develop`
- When the bot PR merges to `develop`, the MDX is live on test.servantium.com
- When you merge `develop` into `main`, the same MDX ships to production
- The promotion merge **does not trigger** the workflows (base is `main`, not `develop`)
- Servantium Bot PRs are deliberately skipped (the `if:` guard) so they never cause loops

You never have to "regenerate for production." You just merge.

---

## What to do when something goes wrong

**The workflow failed with an Anthropic API error.**
Re-run the failed job from the Actions tab. If it fails twice, check `ANTHROPIC_API_KEY` is valid and has Sonnet 4.5 access.

**DocsOrchestrator proposed bad actions.**
Uncheck them in the portal's Stage 1 view. Edit the brief if the intent was right but the scope was wrong. If it keeps making the same mistake, edit the DocsOrchestrator prompt on /agents.

**DocsWriter wrote something factually wrong.**
Edit the MDX directly in the portal's Stage 2 view before approving. Inline editing is the normal path, not a failure mode.

**Servantium Bot opened a PR you don't want.**
Close it. The bot branch auto-deletes. Next merge to `develop` produces a fresh one.

**DocsOrchestrator keeps creating duplicate docs.**
The existing doc's `description` is probably too vague for Claude to match. Tighten the description in the doc's frontmatter.

**The portal does not show a run.**
Check that the webhook URL is correct in the workflow file and that test.internal.servantium.com is reachable from GitHub Actions. The webhook POST is fire-and-forget -- it does not block PR creation.

**A banned word slipped through.**
The post-processing step should have caught it. Check the portal's banned words list. If the word is missing, add it there. The fix is live on the next run.

---

## Model

Pinned to `claude-sonnet-4-5` via the `CLAUDE_MODEL` env var in both workflows. Both agents (DocsOrchestrator, DocsWriter) use the same model. Bump when Anthropic releases a new minor.

---

## What this pipeline does NOT do (yet)

- No screenshot capture -- see [ROADMAP.md](ROADMAP.md) Workflow C
- No docs linting beyond Astro build -- see ROADMAP Workflow D
- No broken link checking
- No `llms.txt` auto-update
- No cross-language translation

All of these are planned. Ask before building anything out of order.
