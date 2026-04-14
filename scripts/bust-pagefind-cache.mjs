// Appends a build-time version comment to every file under dist/pagefind/.
// Why: Cloudflare Pages' edge cache can stick to an old response (and its old
// headers) via ETag revalidation, even after _headers changes. A stale CSP
// header on pagefind-worker.js blocks Pagefind's WASM worker in production.
// Mutating the bytes forces a fresh ETag, a fresh cache entry, and fresh
// headers applied from the current _headers file.
import { readdirSync, statSync, appendFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = 'dist/pagefind';
if (!existsSync(root)) {
  console.log('[bust-pagefind-cache] no dist/pagefind/, skipping');
  process.exit(0);
}

const stamp = `\n// build:${Date.now()}\n`;
let touched = 0;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const s = statSync(full);
    if (s.isDirectory()) {
      walk(full);
      continue;
    }
    if (name.endsWith('.js')) {
      appendFileSync(full, stamp);
      touched++;
    }
  }
}

walk(root);
console.log(`[bust-pagefind-cache] touched ${touched} .js file(s) in ${root}`);
