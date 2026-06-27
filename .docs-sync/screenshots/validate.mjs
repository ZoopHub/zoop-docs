// Lightweight docs validator (rebuilt). Checks documentation.json + .mdx pages:
// nav<->file, orphans, broken internal links, .mdx-extension links, frontmatter,
// image alt. Run from anywhere: `node .docs-sync/screenshots/validate.mjs`.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DOCS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
let cfg;
try { cfg = JSON.parse(fs.readFileSync(path.join(DOCS, 'documentation.json'), 'utf8')); }
catch (e) { console.error('INVALID documentation.json:', e.message); process.exit(2); }

const navPaths = new Set();
const walk = (pages) => { for (const p of pages || []) { if (p.path) navPaths.add(p.path); if (p.pages) walk(p.pages); if (p.groups) for (const g of p.groups) walk(g.pages); } };
for (const tab of cfg.navigation?.tabs || []) for (const g of tab.groups || []) walk(g.pages);
const redirectSources = new Set((cfg.redirects || []).map(r => r.source));
const redirectDests = new Set((cfg.redirects || []).map(r => r.destination));

const walkDir = (dir) => {
  let out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '.git' || e.name === 'node_modules' || e.name === '.docs-sync') continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out = out.concat(walkDir(full));
    else if (e.name.endsWith('.mdx')) out.push(full);
  }
  return out;
};
const mdxFiles = walkDir(DOCS);
const mdxRel = new Set(mdxFiles.map(f => path.relative(DOCS, f).replace(/\.mdx$/, '')));

const R = { missing_files_for_nav: [], orphan_files_not_in_nav: [], pages_missing_frontmatter: [], internal_links_with_mdx_ext: [], broken_internal_links: [], images_without_alt: [] };

for (const p of navPaths) if (!mdxRel.has(p)) R.missing_files_for_nav.push(p);
for (const f of mdxRel) if (!navPaths.has(f) && !redirectDests.has(f)) R.orphan_files_not_in_nav.push(f);

for (const file of mdxFiles) {
  const rel = path.relative(DOCS, file);
  const src = fs.readFileSync(file, 'utf8');
  const fm = src.match(/^---\n([\s\S]*?)\n---/);
  if (!fm || !/^title:/m.test(fm[1]) || !/^description:/m.test(fm[1])) R.pages_missing_frontmatter.push(rel);
  for (const m of src.matchAll(/\]\((\/[^)]+)\)/g)) {
    const target = m[1].split('#')[0].replace(/\/$/, '');
    if (target.endsWith('.mdx')) R.internal_links_with_mdx_ext.push(`${rel} -> ${m[1]}`);
    const clean = target.replace(/^\//, '');
    if (clean && !mdxRel.has(clean) && !navPaths.has(clean) && !redirectSources.has(clean)) R.broken_internal_links.push(`${rel} -> ${m[1]}`);
  }
  for (const m of src.matchAll(/<Image\b[^>]*>/g)) if (!/\balt=/.test(m[0])) R.images_without_alt.push(rel);
}

const summary = { nav_pages: navPaths.size, mdx_files: mdxRel.size, ...Object.fromEntries(Object.entries(R).map(([k, v]) => [k, v])) };
console.log(JSON.stringify(summary, null, 2));
const fail = Object.values(R).some(v => v.length);
console.log(fail ? '\nVALIDATION: FAIL' : '\nVALIDATION: PASS');
process.exit(fail ? 1 : 0);
