#!/usr/bin/env node
// v1.9.0 posts/paths frontmatter migration.
//
// CDP v1.9.0 filters posts and paths unconditionally by `published: true`.
// Tenant content that predates this rename either has the old `publish:` key
// or no publish key at all. This script does a surgical line-level edit per
// file so TinaCMS's frontmatter formatting is preserved:
//
//   - If `published:` already present → no-op.
//   - Else if `publish:` present     → rename `publish:` → `published:` (value preserved).
//   - Else                            → append `published: true` to the frontmatter block.
//
// Idempotent — running twice is a no-op.
//
// Usage:  node scripts/migrations/v1.9.0-posts-published.mjs <dir> [<dir>...]
// Example (against a checked-out tenant content repo):
//   node scripts/migrations/v1.9.0-posts-published.mjs \
//     ../tenant-content/content/posts \
//     ../tenant-content/content/paths
//
// See docs/upgrade-notes.md § 1.9.0 for context.

import fs from 'node:fs';
import path from 'node:path';

const dirs = process.argv.slice(2);
if (dirs.length === 0) {
  console.error('Usage: node scripts/migrations/v1.9.0-posts-published.mjs <dir> [<dir>...]');
  process.exit(1);
}

const totals = { renamed: 0, added: 0, alreadyMigrated: 0, noFrontmatter: 0, notMdx: 0 };

for (const dir of dirs) {
  if (!fs.existsSync(dir)) {
    console.error(`SKIP dir (does not exist): ${dir}`);
    continue;
  }
  const stats = { dir, renamed: 0, added: 0, alreadyMigrated: 0, noFrontmatter: 0 };
  const entries = fs.readdirSync(dir);
  for (const name of entries) {
    if (!name.endsWith('.mdx')) { totals.notMdx++; continue; }
    const full = path.join(dir, name);
    const content = fs.readFileSync(full, 'utf8');

    // Frontmatter block: leading '---\n', body, trailing '\n---\n' (or end-of-file '\n---').
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(\r?\n|$)/);
    if (!match) {
      console.warn(`  no frontmatter: ${name}`);
      stats.noFrontmatter++;
      totals.noFrontmatter++;
      continue;
    }
    const fmBlock = match[0];
    const fmBody = match[1];
    const trailing = match[2]; // '\n', '\r\n', or ''

    let newFmBody;
    if (/^published:\s/m.test(fmBody)) {
      stats.alreadyMigrated++;
      totals.alreadyMigrated++;
      continue;
    } else if (/^publish:\s/m.test(fmBody)) {
      newFmBody = fmBody.replace(/^publish:(\s)/m, 'published:$1');
      stats.renamed++;
      totals.renamed++;
    } else {
      newFmBody = fmBody + '\npublished: true';
      stats.added++;
      totals.added++;
    }

    const newFmBlock = `---\n${newFmBody}\n---${trailing}`;
    const newContent = content.replace(fmBlock, newFmBlock);
    fs.writeFileSync(full, newContent);
  }
  console.log(`${dir}: ${JSON.stringify(stats)}`);
}

console.log('\nTotals:', JSON.stringify(totals, null, 2));
