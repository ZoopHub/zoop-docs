// Zoop docs — Cloudflare R2 uploader (replaces the deleted .zoop-docs-src/r2-upload.mjs).
//
// Uploads captured screenshots from ../../images into the `zoop-docs` R2 bucket so
// they serve at https://doc-assets.zoop.pro/images/<path>. R2 is S3-compatible, so
// this uses @aws-sdk/client-s3 (already in node_modules).
//
// Credentials live in .docs-sync/screenshots/.r2.env (gitignored via *.env), so no
// secrets ever go through chat or into git. Required keys:
//   R2_ACCOUNT_ID=...            # Cloudflare account id (for the S3 endpoint)
//   R2_ACCESS_KEY_ID=...         # R2 API token access key id
//   R2_SECRET_ACCESS_KEY=...     # R2 API token secret
//   R2_BUCKET=zoop-docs
//   R2_PUBLIC_BASE=https://doc-assets.zoop.pro
//
// Usage:
//   node r2-upload.mjs                 # upload everything under ../../images
//   node r2-upload.mjs path/to/a.png   # upload specific files (paths under images/)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.resolve(__dirname, '../../images');
const ENV_FILE = path.resolve(__dirname, '.r2.env');

function loadEnv(file) {
  if (!fs.existsSync(file)) {
    console.error(`Missing ${file}. Create it with R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_BASE.`);
    process.exit(1);
  }
  const env = {};
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    env[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/^["']|["']$/g, '');
  }
  return env;
}

const CONTENT_TYPES = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml' };

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(full));
    else if (CONTENT_TYPES[path.extname(e.name).toLowerCase()]) out.push(full);
  }
  return out;
}

const env = loadEnv(ENV_FILE);
for (const k of ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET']) {
  if (!env[k]) { console.error(`Missing ${k} in .r2.env`); process.exit(1); }
  if (env[k].startsWith('REPLACE_')) { console.error(`${k} still has its placeholder value — edit .r2.env and fill in the real value.`); process.exit(1); }
}
const PUBLIC_BASE = (env.R2_PUBLIC_BASE || 'https://doc-assets.zoop.pro').replace(/\/$/, '');

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: env.R2_ACCESS_KEY_ID, secretAccessKey: env.R2_SECRET_ACCESS_KEY },
});

const args = process.argv.slice(2);
const files = args.length
  ? args.map(a => (path.isAbsolute(a) ? a : path.resolve(process.cwd(), a)))
  : walk(IMAGES_DIR);

if (!files.length) { console.log('No image files to upload under', IMAGES_DIR); process.exit(0); }

let ok = 0, fail = 0;
for (const file of files) {
  const rel = path.relative(IMAGES_DIR, file).split(path.sep).join('/');
  if (rel.startsWith('..')) { console.warn('  SKIP (outside images/):', file); continue; }
  const key = `images/${rel}`;
  try {
    await s3.send(new PutObjectCommand({
      Bucket: env.R2_BUCKET,
      Key: key,
      Body: fs.readFileSync(file),
      ContentType: CONTENT_TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
      CacheControl: 'public, max-age=86400',
    }));
    ok++;
    console.log('  uploaded', `${PUBLIC_BASE}/${key}`);
  } catch (e) {
    fail++;
    console.warn('  FAILED  ', key, '-', e.message || e);
  }
}
console.log(`\nDone. ${ok} uploaded, ${fail} failed.`);
if (fail) process.exit(1);
