# Document Publishing Console — Internal Portal Spec

A new tab in the Servantium internal portal that gives humans a live view into the publishing pipeline, an editable agent library, and a review queue for every draft the bots produce. This is a **spec**, not code — the portal lives in a separate repo and the work below is scoped as a design doc for that team.

---

## Goals

1. **See it happen.** Every pipeline run is visible in real time, not buried in GitHub Actions logs.
2. **Steer the agents without redeploying.** Change a prompt in the portal, the next workflow run uses it.
3. **Human always holds the pen.** AI drafts, proposes, flags — humans approve, merge, and delete.
4. **One screen for review.** PR + diff + draft + checklist + audit trail all visible without tab-hopping.
5. **Status at a glance.** Green / yellow / red on every row so the queue is scannable.

---

## Layout (matches the mockup)

```
┌─ Document Publishing ──────────────────────────────────────────────┐
│                                                                    │
│  ┌─ Pending Releases ─┐  ┌─ PR Detail ──────────────────────────┐  │
│  │ [All] [Review]     │  │ feat: Agent memory context expansion │  │
│  │                    │  │ #412 · merged by max · 2h ago  🟡    │  │
│  │ 🔴 #412 High Risk  │  │                                      │  │
│  │ 🟡 #411 Needs QA   │  │ ── Diff summary (3 files, +142/-18) ─│  │
│  │ 🟢 #410 Ready      │  │                                      │  │
│  │ 🟢 #409 Ready      │  │ ── AI draft (editable MDX) ──────────│  │
│  │ ⚪ #408 Draft      │  │ [Markdown editor with live preview]  │  │
│  │                    │  │                                      │  │
│  │                    │  │ ── Checklist ────────────────────────│  │
│  │                    │  │ ☐ QA sign-off                        │  │
│  │                    │  │ ☐ SEO/AEO review                     │  │
│  │                    │  │ ☐ Marketing comms                    │  │
│  │                    │  │                                      │  │
│  │                    │  │ ── Review actions ───────────────────│  │
│  │                    │  │ [Approve & Queue]  [Request Changes] │  │
│  │                    │  │                                      │  │
│  │                    │  │ ── Audit trail (reverse chron) ──────│  │
│  │                    │  │ • 14:02 servantium-bot drafted note  │  │
│  │                    │  │ • 14:03 CI passed                    │  │
│  │                    │  │ • 14:05 chris edited 3 lines         │  │
│  └────────────────────┘  └──────────────────────────────────────┘  │
│                                                                    │
│  ┌─ Agent Library ────────┐  ┌─ Live Pipeline Log ─────────────┐  │
│  │ [Release Notes Writer] │  │ 14:05 → writer: doc #412 ready  │  │
│  │ [Help Docs Librarian]  │  │ 14:03 → orch: 2 actions decided │  │
│  │ [Help Docs Writer]     │  │ 14:02 → trigger: PR #412 merged │  │
│  │ [+ New Agent]          │  │ 13:47 → writer: doc #411 ready  │  │
│  └────────────────────────┘  └─────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

Pending Releases and PR Detail are the primary pane (matches mockup). Agent Library and Live Pipeline Log are secondary panes accessed via tabs or a collapsible panel — they don't need to be on-screen all the time.

---

## Status model (green / yellow / red / grey)

Every row — pending release, draft document, agent — carries a status derived from rules, not manually set.

| Color     | Meaning                                    | Trigger                                                                 |
|-----------|--------------------------------------------|-------------------------------------------------------------------------|
| 🟢 green  | Ready for human review, low risk           | Draft complete, CI passing, no flags, <50 LOC diff                      |
| 🟡 yellow | Needs attention                             | Any unchecked checklist item, or diff >200 LOC, or doc touches >3 files |
| 🔴 red    | Blocked or risky                             | CI failing, agent returned error, diff touches security-sensitive paths, or flagged term in draft |
| ⚪ grey   | In progress                                  | Agent currently running, draft not yet committed                        |

Status is computed server-side on every pipeline event and stored with the run, so the UI just reads it.

---

## Data model

Four tables. This is minimal on purpose — the portal can use D1 (Cloudflare) or whatever the portal repo already uses.

### `agents`

The editable prompt library. Each agent is a versioned row.

```
id             uuid
slug           text        -- 'release-note-writer', 'help-docs-orchestrator', 'help-docs-writer'
name           text
description    text
system_prompt  text        -- the full MD prompt
model          text        -- 'claude-sonnet-4-5'
max_tokens     int
json_mode      bool
created_at     timestamptz
updated_at     timestamptz
updated_by     text        -- portal user email
version        int         -- monotonic, bumped on every edit
```

On save, the old row is moved to `agents_history` so you can always diff prompt versions and roll back.

### `pipeline_runs`

One row per workflow invocation.

```
id              uuid
agent_slug      text         -- which agent ran
workflow        text         -- 'release-notes' | 'help-docs'
trigger_type    text         -- 'pull_request' | 'workflow_dispatch' | 'repository_dispatch'
pr_number       int
status          text         -- 'pending' | 'running' | 'drafted' | 'approved' | 'merged' | 'rejected' | 'failed'
risk            text         -- 'green' | 'yellow' | 'red' | 'grey'
started_at      timestamptz
finished_at     timestamptz
gh_run_url      text
```

### `documents`

Every draft the pipeline produces, linked back to a run.

```
id             uuid
run_id         uuid        -- FK pipeline_runs
action_type    text        -- 'create' | 'update' | 'propose_delete'
path           text        -- 'src/content/docs/help/...'
draft_body     text        -- current MDX (edited or not)
original_body  text        -- what the agent produced, never overwritten
checklist      jsonb       -- [{key, label, checked, checked_by}]
status         text        -- 'draft' | 'approved' | 'merged' | 'rejected'
merged_sha     text
```

### `audit_log`

Append-only, one row per interesting event.

```
id          uuid
run_id      uuid
document_id uuid nullable
actor       text         -- 'servantium-bot' | user email | 'system'
action      text         -- 'drafted' | 'edited' | 'checklist_checked' | 'approved' | 'merged' | 'prompt_edited' | ...
payload     jsonb        -- diff, checklist key, before/after text, etc.
at          timestamptz
```

---

## How agent edits propagate

This is the part that needs to be right. The goal: **edit a prompt in the portal, next workflow run picks it up automatically, with zero redeploy.**

### Option A — agents live in D1, workflows fetch them at run start (recommended)

1. Portal saves prompt to `agents` table in Cloudflare D1.
2. Expose a tiny read-only Cloudflare Worker endpoint: `GET /api/agents/:slug` returns `{system_prompt, model, max_tokens}`.
3. Workflows fetch the prompt on every run before calling Claude:
   ```yaml
   - name: Fetch agent config
     run: |
       curl -sSL -H "Authorization: Bearer $AGENT_API_KEY" \
         https://portal-api.servantium.com/api/agents/release-note-writer \
         > /tmp/agent.json
       jq -r '.system_prompt' /tmp/agent.json > /tmp/system.md
   ```
4. `claude-run.mjs` reads `/tmp/system.md` instead of the static file in `.github/claude-prompts/`.
5. The `.github/claude-prompts/` files become **seeds** — used for the initial portal row import and as emergency fallback if D1 is unreachable.

Pros: true hot-reload, no commit needed, history is in D1, rollback is a button.
Cons: workflows depend on a portal endpoint being up. Fallback: if the fetch fails, fall back to the committed `.github/claude-prompts/` file and mark the run 🟡.

### Option B — agents live in a config repo, portal commits on edit

Portal writes to a `servantium/agent-configs` repo. Workflows read the file at run time via `gh api`. Simpler, no new API surface, but every edit is a commit (good audit, slightly noisier).

**Recommendation: Option A.** The portal team probably already has a D1 or KV namespace for other features; reusing it keeps the stack thin. Option B is a fine fallback if the portal team would rather not expose an API.

---

## Deletion proposals (AI can propose, never execute)

Hard rule: **no workflow ever deletes a committed file.** The pipeline currently can't — but as soon as you let the orchestrator return `{action: "delete"}`, you need a safety rail.

Proposed flow:

1. Orchestrator returns a new action type: `{type: "propose_delete", path, reason}`.
2. The writer workflow does **not** delete the file. It writes a marker into the draft PR body:
   > ⚠️ The orchestrator proposed deleting `src/content/docs/help/foo.mdx` because: "superseded by PR #412." Review and delete manually if you agree.
3. Portal sees the proposal, surfaces it in the PR Detail pane with its own 🟡 row: **"Deletion proposed — review."**
4. Human clicks **Accept deletion** → portal opens a second PR on a fresh branch that does the `git rm`, requiring a separate human merge. Two-step because deletions are the one action with no undo that `git revert` doesn't cleanly fix (the history is still there, but broken inbound links aren't).

No automation path ever performs the `rm`. Full stop.

---

## Real-time log — the plumbing

Two event sources feed the Live Pipeline Log and keep the Pending Releases list fresh:

1. **GitHub Actions → portal webhook.** Add a step to each workflow that POSTs run events (`started`, `drafted`, `failed`) to `https://portal-api.servantium.com/api/pipeline-events` with an HMAC signature. The portal writes to `pipeline_runs` + `audit_log`.
2. **Portal → browser via SSE.** The Document Publishing tab opens an EventSource to `/api/pipeline-events/stream?since=<cursor>`. Server-sent events are enough — no WebSocket needed. Each event re-renders the affected row only.

If the portal is offline when a run fires, no data is lost: on reconnect the client asks for events since the last cursor and the workflow's audit row is already in D1 because the workflow wrote to it directly, not only via SSE.

---

## Checklist

Checklist items live on the document, not the run, because one run can produce multiple docs and each doc might need different approvals.

Default items (configurable per workflow in the agent config):

- **QA sign-off** — required for any doc touching `release-notes/`
- **SEO/AEO review** — required for docs with `featured: true` frontmatter
- **Marketing comms** — required for red-status runs

A document cannot move from `draft` to `approved` until all required items are checked. Optional items can stay unchecked.

---

## API surface (server side)

Short list, all live behind the portal's existing auth:

```
GET    /api/agents                    -- list
GET    /api/agents/:slug              -- fetch one (also called by workflows)
PUT    /api/agents/:slug              -- edit prompt; bumps version, logs to history
GET    /api/agents/:slug/history      -- version list for rollback
POST   /api/agents/:slug/rollback     -- revert to a specific version

GET    /api/runs?status=&risk=        -- pending releases list
GET    /api/runs/:id                  -- detail with documents + audit trail
POST   /api/runs/:id/approve          -- flip status to approved, merge the GH PR
POST   /api/runs/:id/request-changes  -- post a comment on the GH PR, notify bot

GET    /api/documents/:id
PUT    /api/documents/:id/draft       -- save edited MDX
POST   /api/documents/:id/checklist   -- toggle checklist items

POST   /api/pipeline-events           -- webhook target for GH Actions
GET    /api/pipeline-events/stream    -- SSE to the browser
```

Workflows authenticate to `/api/agents/:slug` and `/api/pipeline-events` with a static bearer token stored as a GH secret (`AGENT_API_KEY`). The portal validates the HMAC of the payload for webhook calls.

---

## Phases

Build this in three phases so something useful ships in week one, not month three.

### Phase 1 — Read-only console (1 week)

- Pending Releases list pulling from GitHub Actions run API directly (no D1 yet, no webhook)
- PR Detail pane showing the bot PR body, diff, and a link to edit on GitHub
- Green/yellow/red status computed from PR checks + diff size
- Live Pipeline Log polling `gh api /repos/.../actions/runs` every 15s

Delivers: a visible queue. No new backend.

### Phase 2 — Editable drafts + checklist (2 weeks)

- Add D1 tables for `documents`, `audit_log`
- Pipeline events webhook from workflows → D1
- Inline MDX editor saves to D1, commits back to the bot branch on Save
- Checklist wired up, approval button merges the GH PR via `gh api`

Delivers: one screen for review, no more bouncing to GitHub.

### Phase 3 — Editable agents + deletion proposals (1 week)

- `agents` table, edit UI with version history
- Workflows fetch prompts from D1 at run start
- `propose_delete` action type, two-step deletion flow
- SSE replaces polling

Delivers: prompt tuning without redeploy, safe deletion path.

---

## Open questions for the portal team

1. Does the portal already have a D1 namespace we can reuse, or should this get its own?
2. Auth model for workflows calling portal API — existing bearer token pattern or new?
3. Who owns rotation of `AGENT_API_KEY`?
4. Is there an existing SSE helper in the portal stack, or should we start with polling in Phase 1?
5. Should agent edits require a second approver (four-eyes) or is single-user edit fine for now?

Ship Phase 1 first and these answers will be obvious by the time Phase 2 starts.
