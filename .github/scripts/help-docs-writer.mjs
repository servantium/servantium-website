#!/usr/bin/env node
/**
 * Iterates over the orchestrator's action list and drives the writer
 * prompt once per action, emitting MDX drafts into an output dir.
 *
 * Usage:
 *   node .github/scripts/help-docs-writer.mjs \
 *     --actions /tmp/actions.json \
 *     --pr /tmp/pr.json \
 *     --diff /tmp/diff.txt \
 *     --out-dir /tmp/drafts
 *
 * Each draft is written to `<out-dir>/<relative path under help/>`.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

function arg(name) {
  const i = process.argv.indexOf('--' + name);
  return i >= 0 ? process.argv[i + 1] : null;
}

const actionsFile = arg('actions');
const prFile = arg('pr');
const diffFile = arg('diff');
const outDir = arg('out-dir');

if (!actionsFile || !outDir) {
  console.error('help-docs-writer: --actions and --out-dir are required');
  process.exit(2);
}

const { actions = [] } = JSON.parse(fs.readFileSync(actionsFile, 'utf8'));
const pr = prFile && fs.existsSync(prFile) ? JSON.parse(fs.readFileSync(prFile, 'utf8')) : {};
const diff = diffFile && fs.existsSync(diffFile) ? fs.readFileSync(diffFile, 'utf8') : '';

if (actions.length === 0) {
  console.log('help-docs-writer: no actions — exiting cleanly');
  process.exit(0);
}

fs.mkdirSync(outDir, { recursive: true });
const HELP_ROOT = 'src/content/docs/help';

for (const [idx, action] of actions.entries()) {
  if (action.type === 'none') continue;

  let relPath;
  let existingDoc = '';

  if (action.type === 'update') {
    if (!action.path || !action.path.startsWith(HELP_ROOT)) {
      console.error(`skip action ${idx}: invalid update path`);
      continue;
    }
    relPath = path.relative(HELP_ROOT, action.path);
    existingDoc = fs.existsSync(action.path) ? fs.readFileSync(action.path, 'utf8') : '';
  } else if (action.type === 'create') {
    if (!action.section || !action.title) {
      console.error(`skip action ${idx}: create missing section/title`);
      continue;
    }
    const slug = action.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60);
    relPath = path.join(action.section, `${slug}.mdx`);
  } else {
    continue;
  }

  const ctxFile = `/tmp/action-${idx}.json`;
  const payload = {
    action_type: action.type,
    title: action.title || null,
    brief: action.brief || '',
    reason: action.reason || '',
    existing_doc: existingDoc,
    pr_title: pr.title || '',
    pr_body: pr.body || '',
    diff: diff.slice(0, 30000),
    today: new Date().toISOString().slice(0, 10),
  };
  fs.writeFileSync(ctxFile, JSON.stringify(payload, null, 2));

  const outFile = path.join(outDir, relPath);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });

  try {
    execSync(
      [
        'node .github/scripts/claude-run.mjs',
        '--system .github/claude-prompts/help-docs-writer.system.md',
        `--context ${ctxFile}`,
        `--out ${outFile}`,
        `--model ${process.env.CLAUDE_MODEL || 'claude-sonnet-4-5'}`,
        '--max-tokens 3000',
      ].join(' '),
      { stdio: 'inherit' },
    );
    console.log(`help-docs-writer: ${action.type} -> ${relPath}`);
  } catch (err) {
    console.error(`help-docs-writer: action ${idx} failed — ${err.message}`);
  }
}
