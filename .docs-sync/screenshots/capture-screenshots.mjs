// Zoop docs screenshot capture.
//
// Drives a real browser against the live app and captures every screenshot the
// docs need, into ../../images/. You log in once (the session persists in a
// local user-data dir), then it walks the manifest unattended.
//
// Setup + run:
//   cd zoop-docs/.docs-sync/screenshots
//   npm install            # installs playwright
//   npx playwright install chromium
//   node capture-screenshots.mjs
//
// Env overrides:
//   ZOOP_BASE   (default https://app.zoop.pro)
//   ZOOP_TENANT (default david-company)
//   ONLY=customers,jobs   capture only shots whose `page` is in this list
//   HEADLESS=1            run headless (only works once a session is saved)

import { chromium, devices } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = (process.env.ZOOP_BASE || 'https://app.zoop.pro').replace(/\/$/, '');
const TENANT = process.env.ZOOP_TENANT || 'david-company';
const ONLY = process.env.ONLY ? new Set(process.env.ONLY.split(',').map(s => s.trim())) : null;
const HEADLESS = process.env.HEADLESS === '1';

const IMAGES_DIR = path.resolve(__dirname, '../../images');
// Session/cookies live OUTSIDE the docs repo so auth never risks being committed.
const USER_DATA = process.env.ZOOP_USERDATA || '/Users/david/Repo/.zoop-docs-src/screenshots-userdata';
const MANIFEST = path.resolve(__dirname, process.env.MANIFEST || 'manifest.json');

if (!fs.existsSync(MANIFEST)) {
  console.error('No manifest.json found at', MANIFEST);
  console.error('Generate it first (the docs sync routine produces it from the TODO(screenshot) callouts).');
  process.exit(1);
}
fs.mkdirSync(IMAGES_DIR, { recursive: true });

let shots = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
if (ONLY) shots = shots.filter(s => [...ONLY].some(p => (s.filename || '').startsWith(p)));
// Only capture shots with a navigable route (no unresolved [param]); manual ones
// live in MANUAL-SHOTS.md and are captured by hand.
const navigable = s => s.url || (s.route && s.route.trim() && !s.route.includes('['));
const manualCount = shots.filter(s => !navigable(s)).length;
shots = shots.filter(navigable);
if (manualCount) console.log(`Skipping ${manualCount} manual shots (capture by hand — see MANUAL-SHOTS.md).`);

// resolve {tenant} placeholder and relative routes
function urlFor(shot) {
  if (shot.url) return shot.url;
  const route = (shot.route || '/').replace('{tenant}', TENANT);
  return BASE + (route.startsWith('/') ? route : '/' + route);
}

const iPhone = devices['iPhone 14 Pro'];

// Redaction map: explicit find→replace pairs from .redact.json (gitignored — it
// holds real PII), plus any owner emails from ZOOP_REDACT_EMAIL. Applied to every
// shot before it's written. Longest find first so a substring can't pre-empt a
// longer match (e.g. "riceguitar@gmail.com" before "riceguitar").
const REDACT_FILE = path.resolve(__dirname, process.env.ZOOP_REDACT_FILE || '.redact.json');
const redactMap = [];
if (fs.existsSync(REDACT_FILE)) {
  try {
    for (const e of JSON.parse(fs.readFileSync(REDACT_FILE, 'utf8'))) {
      if (e && e.find) redactMap.push({ find: String(e.find), replace: String(e.replace ?? '') });
    }
  } catch (e) { console.warn('Could not parse', REDACT_FILE, '-', e.message); }
}
for (const e of (process.env.ZOOP_REDACT_EMAIL || '').split(',').map(s => s.trim()).filter(Boolean)) {
  redactMap.push({ find: e, replace: 'owner@valdezpainting.example' });
}
redactMap.sort((a, b) => b.find.length - a.find.length);
if (redactMap.length) console.log(`Redaction: scrubbing ${redactMap.length} pattern(s) from every shot.`);

// Transient/notification banners to hide before shooting (not part of the
// documented UI). Pipe-separated phrases via ZOOP_HIDE_TEXT.
const HIDE_TEXTS = (process.env.ZOOP_HIDE_TEXT || 'Team roles updated').split('|').map(s => s.trim()).filter(Boolean);

async function waitForAuth(page) {
  // The capture tenant dashboard is the signal we're logged in.
  const target = `${BASE}/${TENANT}/dashboard`;
  await page.goto(target, { waitUntil: 'domcontentloaded' }).catch(() => {});
  const authed = async () => {
    const u = page.url();
    return u.includes(`/${TENANT}/`) && !/login|sign-?in|auth|accounts\.google/i.test(u);
  };
  if (await authed()) return;
  console.log('\n>>> Please log in to Zoop in the browser window that just opened.');
  console.log(`>>> Once you land on ${target}, capture will start automatically.\n`);
  const deadline = Date.now() + 5 * 60 * 1000;
  while (Date.now() < deadline) {
    await page.waitForTimeout(1500);
    if (await authed()) { console.log('Logged in. Starting capture...\n'); await page.waitForTimeout(1500); return; }
  }
  throw new Error('Timed out waiting for login (5 min).');
}

async function run() {
  const ctx = await chromium.launchPersistentContext(USER_DATA, {
    headless: HEADLESS,
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = ctx.pages()[0] || await ctx.newPage();
  await waitForAuth(page);

  const results = { ok: [], failed: [] };
  for (const shot of shots) {
    const out = path.join(IMAGES_DIR, shot.filename);
    try {
      const mobile = shot.viewport === 'mobile';
      if (mobile) await page.setViewportSize({ width: iPhone.viewport.width, height: iPhone.viewport.height });
      else await page.setViewportSize({ width: 1440, height: 900 });

      await page.goto(urlFor(shot), { waitUntil: 'networkidle' }).catch(() => {});
      if (shot.waitFor) await page.waitForSelector(shot.waitFor, { timeout: 15000 }).catch(() => {});
      for (const step of shot.actions || []) {
        if (step.click) await page.click(step.click, { timeout: 8000 }).catch(() => {});
        if (step.fill) await page.fill(step.fill[0], step.fill[1]).catch(() => {});
        if (step.scrollY !== undefined) await page.evaluate(y => window.scrollTo(0, y), step.scrollY).catch(() => {});
        if (step.waitFor) await page.waitForSelector(step.waitFor, { timeout: 8000 }).catch(() => {});
        if (step.waitMs) await page.waitForTimeout(step.waitMs);
      }
      await page.waitForTimeout(shot.settleMs ?? 700);
      // Scrub real PII (redaction map) from text, form values, and common
      // attributes (title/aria-label/alt), and hide transient banners, before shooting.
      if (redactMap.length || HIDE_TEXTS.length) await page.evaluate(({ pairs, hideTexts }) => {
        const apply = (s) => { for (const { find, replace } of pairs) if (s.includes(find)) s = s.split(find).join(replace); return s; };
        const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const nodes = []; while (w.nextNode()) nodes.push(w.currentNode);
        nodes.forEach(n => { const v = n.nodeValue; if (v) { const nv = apply(v); if (nv !== v) n.nodeValue = nv; } });
        document.querySelectorAll('input,textarea').forEach(i => { if (i.value) i.value = apply(i.value); });
        document.querySelectorAll('[title],[aria-label],[alt]').forEach(el => {
          for (const a of ['title', 'aria-label', 'alt']) { const v = el.getAttribute(a); if (v) el.setAttribute(a, apply(v)); }
        });
        for (const phrase of hideTexts) {
          // Only the banner box itself: contains the phrase AND its whole text is
          // short (so we never hide a big layout container that merely wraps it).
          const cands = [...document.querySelectorAll('div,section,aside,li,[role=alert],[role=status]')]
            .filter(e => e.textContent && e.textContent.includes(phrase) && e.textContent.trim().length < phrase.length + 240 && e.children.length < 12);
          if (cands.length) {
            let el = cands[0];
            cands.forEach(c => { if (c.contains(el)) el = c; }); // outermost short wrapper = the styled banner
            el.style.display = 'none';
          }
        }
      }, { pairs: redactMap, hideTexts: HIDE_TEXTS }).catch(() => {});
      await page.waitForTimeout(120);
      fs.mkdirSync(path.dirname(out), { recursive: true });
      await page.screenshot({ path: out, fullPage: shot.fullPage ?? false });
      results.ok.push(shot.filename);
      console.log('  captured', shot.filename, '  (' + shot.id + ')');
    } catch (e) {
      results.failed.push({ filename: shot.filename, error: String(e.message || e) });
      console.warn('  FAILED  ', shot.filename, '-', e.message || e);
    }
  }

  await ctx.close();
  console.log(`\nDone. ${results.ok.length} captured, ${results.failed.length} failed.`);
  if (results.failed.length) console.log('Failed:', JSON.stringify(results.failed, null, 2));
}

run().catch(e => { console.error(e); process.exit(1); });
