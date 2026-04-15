#!/usr/bin/env node
/**
 * Emit a JSON index of all existing help docs for the orchestrator
 * to read. Output shape:
 *   { docs: [{ path, section, title, description }] }
 *
 * Usage:
 *   node .github/scripts/docs-index.mjs > /tmp/docs-index.json
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'src/content/docs/help';
const out = { docs: [] };

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!/\.mdx?$/.test(entry.name)) continue;

    const content = fs.readFileSync(full, 'utf8');
    const fm = content.match(/^---\n([\s\S]*?)\n---/);
    if (!fm) continue;

    const title = (fm[1].match(/^title:\s*["']?(.+?)["']?\s*$/m) || [])[1] || '';
    const description =
      (fm[1].match(/^description:\s*["']?(.+?)["']?\s*$/m) || [])[1] || '';
    const section = path
      .relative(ROOT, path.dirname(full))
      .split(path.sep)
      .filter(Boolean)
      .join('/');

    out.docs.push({ path: full, section, title, description });
  }
}

walk(ROOT);
out.docs.sort((a, b) => a.path.localeCompare(b.path));
process.stdout.write(JSON.stringify(out, null, 2) + '\n');
