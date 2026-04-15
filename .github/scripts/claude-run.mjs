#!/usr/bin/env node
/**
 * Shared runner for Servantium's docs pipeline.
 *
 * Reads a system prompt + one or more context files, calls Claude,
 * and writes the response to --out. Used by both the release-notes
 * workflow and the help-docs workflow.
 *
 * Usage:
 *   node claude-run.mjs \
 *     --system .github/claude-prompts/release-note.system.md \
 *     --context /tmp/pr.json,/tmp/diff.txt \
 *     --out /tmp/note.mdx \
 *     --model claude-sonnet-4-5 \
 *     [--max-tokens 2048] \
 *     [--json]
 *
 * Env:
 *   ANTHROPIC_API_KEY — required
 */

import fs from 'node:fs';
import Anthropic from '@anthropic-ai/sdk';

function arg(name, def = null) {
  const i = process.argv.indexOf('--' + name);
  return i >= 0 ? process.argv[i + 1] : def;
}

const systemFile = arg('system');
const contextFiles = (arg('context') || '').split(',').filter(Boolean);
const outFile = arg('out');
const model = arg('model', 'claude-sonnet-4-5');
const maxTokens = parseInt(arg('max-tokens', '2048'), 10);
const wantJson = process.argv.includes('--json');

if (!systemFile || !outFile) {
  console.error('claude-run: --system and --out are required');
  process.exit(2);
}
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('claude-run: ANTHROPIC_API_KEY is not set');
  process.exit(2);
}

const system = fs.readFileSync(systemFile, 'utf8');
const context = contextFiles
  .map((f) => `<context file="${f}">\n${fs.readFileSync(f, 'utf8')}\n</context>`)
  .join('\n\n');

const userMsg =
  (context || '(no context provided)') +
  '\n\nProduce the output exactly as specified in the system prompt.';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function callOnce() {
  const res = await client.messages.create({
    model,
    max_tokens: maxTokens,
    system,
    messages: [{ role: 'user', content: userMsg }],
  });
  return res.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');
}

let lastErr;
for (let attempt = 1; attempt <= 3; attempt++) {
  try {
    const text = await callOnce();

    if (wantJson) {
      const match = text.match(/```json\s*([\s\S]*?)```/);
      const raw = match ? match[1] : text;
      JSON.parse(raw); // validate
      fs.writeFileSync(outFile, raw.trim() + '\n');
    } else {
      // Strip accidental code fences wrapping the whole response.
      const stripped = text
        .replace(/^```(?:mdx|md|markdown)?\s*\n/, '')
        .replace(/\n```\s*$/, '')
        .trim();
      fs.writeFileSync(outFile, stripped + '\n');
    }

    console.log(`claude-run: wrote ${outFile} (${model}, attempt ${attempt})`);
    process.exit(0);
  } catch (err) {
    lastErr = err;
    console.error(`claude-run: attempt ${attempt} failed — ${err.message}`);
    if (attempt < 3) await new Promise((r) => setTimeout(r, 2000 * attempt));
  }
}

console.error('claude-run: all attempts failed');
console.error(lastErr);
process.exit(1);
