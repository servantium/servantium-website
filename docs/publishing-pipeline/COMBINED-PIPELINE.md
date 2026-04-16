# Combined Docs Pipeline -- Architecture

## Overview

A single pipeline replaces the separate release-notes.yml and help-docs.yml
workflows. Two GitHub Actions workflows with a portal approval gate in between.
All generated docs from a single PR merge land in ONE bot branch and ONE PR.

The old workflows (`release-notes.yml`, `help-docs.yml`) are kept in the repo
for parallel testing but are deprecated. Remove them once the combined pipeline
has run successfully for two weeks.

## Named Actors

| Actor | Role |
|-------|------|
| **DocsOrchestrator** | AI agent. Proposes create/update/skip actions from the PR diff. |
| **DocsWriter** | AI agent. Writes/edits MDX, one call per action. Content-type overrides per type. |
| **Servantium Bot** | GitHub App. Pushes bot branches, opens PRs. Not a PAT. |
| **Internal Portal** | Hosts both approval stages, agent prompts, banned words, post-rules. |

## Workflow 1: docs-orchestrate.yml

**Trigger:** PR merged into feature/astro-prototype (or develop)

**Steps:**
1. Fetch PR diff + metadata from GitHub
2. Fetch DocsOrchestrator agent config from portal (prompt + post-rules + banned words)
3. Build docs summary index from D1 cache (title + 200-word summary + path + hash)
4. Call Claude with orchestrator prompt + PR diff + docs index
5. Parse the JSON action list: `[{type, path, title, brief, content_type}]`
6. Determine version from PR labels (`release:major`, `release:minor`, `release:patch`)
7. POST `orchestrator_complete` webhook to portal with the action list
8. Workflow ends. No files written yet.

**Portal receives:** action list + PR context + docs summaries for affected files

## Portal Stage 1: Action Review

User sees a checklist of proposed actions:
```
[x] Create: release-notes/2026-04-16-v1.2.1.mdx (Release Note)
    Brief: "Platform scroll fix and design polish"
    [Preview existing: n/a] [Edit brief]

[x] Update: guides/engagements.mdx (Help Guide)
    Brief: "Update inline editor section to match new UI"
    [Preview existing file] [Edit brief]

[ ] Update: glossary/realization-rate.mdx (Glossary)
    Brief: "Minor wording adjustment"
    [Preview existing file] [Edit brief]
```

User can:
- Check/uncheck actions
- Edit the brief (instructions to the writer)
- Preview the existing file content
- Click "Proceed to drafts" which POSTs to portal API

Portal API fires a `repository_dispatch` event to trigger Workflow 2.

## Workflow 2: docs-write.yml

**Trigger:** `repository_dispatch` event type `docs-write` from portal

**Payload:** `{pr_number, version, repo, approved_actions: [...]}`

**Steps:**
1. Checkout the repo
2. Fetch DocsWriter agent config from portal (base prompt)
3. For each approved action:
   a. Fetch the content-type override prompt from portal
   b. If update: read the existing file content
   c. Concatenate: base prompt + content-type override + brief + existing content + PR diff excerpt
   d. Call Claude
   e. Run post-processing rules (banned words, em-dash removal, curly-quote straightening, import validation, encoding cleanup -- all from portal config)
   f. Run automated validation checks
   g. Write the file to /tmp/drafts/
4. Commit ALL drafted files to ONE `bot/docs-<pr#>` branch
5. Push branch, open ONE PR
6. POST `drafts_complete` webhook to portal with all file contents
7. Workflow ends.

## Portal Stage 2: Draft Review

Multi-file tabbed preview:
```
+-- bot/docs-9 --------------------------------------------------+
|                                                                  |
| [release-notes/v1.2.1.mdx] [guides/engagements.mdx]            |
|                                                                  |
| +-- Preview ----------------+ +-- Text/MDX toggle -----------+  |
| |                            | | [Preview] [MDX Source]       |  |
| |  Rendered MDX in           | |                              |  |
| |  iframe with live          | |  ---                         |  |
| |  site CSS injected         | |  title: "v1.2.1 - ..."      |  |
| |                            | |  ---                         |  |
| |                            | |                              |  |
| |                            | |  ## What changed             |  |
| |                            | |  ...                         |  |
| +----------------------------+ +------------------------------+  |
|                                                                  |
| Validation: * Frontmatter valid  * No em dashes                  |
|             * Links resolve      * No banned words               |
|                                                                  |
| [Edit in MDX source] [Approve & Merge]                           |
+------------------------------------------------------------------+
```

Editing in MDX source saves to D1 only. On "Approve & Merge":
1. Portal commits latest D1 draft to the bot branch (if edited)
2. Portal merges the bot PR via Servantium Bot token
3. Bot branch auto-deletes (GitHub setting enabled)
4. CF Pages rebuilds from the base branch

## Agents in Portal

| Agent codename | Role | Content-type overrides |
|---|---|---|
| DocsOrchestrator | Proposes create/update/skip actions | n/a (one prompt) |
| DocsWriter | Writes/edits MDX | release-note, help-guide, glossary, blog |

Each content-type override is stored as a separate row in the
`agent_content_types` table:

```sql
CREATE TABLE agent_content_types (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL REFERENCES agents(id),
  content_type TEXT NOT NULL,  -- 'release-note', 'help-guide', 'glossary', 'blog'
  label TEXT NOT NULL,
  prompt_override TEXT,        -- appended to base prompt for this type
  post_rules TEXT,             -- JSON array, merged with agent-level rules
  max_tokens INTEGER,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(agent_id, content_type)
);
```

## Summary Database

`docs-index.mjs` generates summaries and stores them in D1:

```sql
CREATE TABLE doc_summaries (
  path TEXT PRIMARY KEY,       -- 'guides/engagements.mdx'
  title TEXT NOT NULL,
  description TEXT,
  section TEXT,                -- 'guides', 'glossary', 'release-notes'
  word_count INTEGER,
  summary TEXT,                -- 200-word AI-generated summary
  content_hash TEXT,           -- SHA256 of the file content
  updated_at TEXT DEFAULT (datetime('now'))
);
```

The workflow builds/refreshes this on each run. If the content_hash
has not changed, the cached summary is reused. If it changed, Claude
generates a new summary (~$0.005 per file).

## Post-processing Validation Checks

Automated (not AI) checks run on every drafted file:
1. Frontmatter schema: title required, date quoted, version semver
2. Em/en dash replacement (from portal post-rules)
3. Import line validation: only known Grove components
4. Internal link checker: /help/* paths must exist in docs index
5. Banned words scan (from portal agent config)
6. Character encoding: strip non-UTF8, curly quotes to straight
7. Max file size: warn if > 10KB (unusually long for a help doc)

Results surface as green/yellow/red indicators per file in Stage 2.

## Cost Estimate

| Component | Tokens | Cost |
|---|---|---|
| Orchestrator (1 call) | ~30K input + ~1K output | ~$0.10 |
| Writer per file (avg) | ~15K input + ~2K output | ~$0.06 |
| Summary refresh (per changed file) | ~5K input + ~500 output | ~$0.02 |
| **Typical PR (1 release note + 2 doc updates)** | | **~$0.28** |
| **Large PR (1 release note + 5 doc updates)** | | **~$0.52** |
