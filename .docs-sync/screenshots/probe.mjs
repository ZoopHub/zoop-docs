// One-off: print clickable controls (buttons/links/tabs) for each route, using the
// saved login session. Helps build accurate capture manifest entries for dialogs.
//   node probe.mjs /pricebook /invoices ...
import { chromium } from 'playwright';

const BASE = (process.env.ZOOP_BASE || 'https://app.zoop.mom').replace(/\/$/, '');
const TENANT = process.env.ZOOP_TENANT || 'valdez-painting';
const USER_DATA = process.env.ZOOP_USERDATA;
const routes = process.argv.slice(2);

const ctx = await chromium.launchPersistentContext(USER_DATA, { headless: true, viewport: { width: 1440, height: 900 } });
const page = ctx.pages()[0] || await ctx.newPage();
for (const r of routes) {
  await page.goto(BASE + '/' + TENANT + r, { waitUntil: 'networkidle' }).catch(() => {});
  await page.waitForTimeout(900);
  const els = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('button,a[href],[role=button],[role=tab],[role=menuitem]').forEach(e => {
      const t = (e.innerText || e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 44) || ('[aria] ' + (e.getAttribute('aria-label') || ''));
      const href = e.tagName === 'A' ? '  -> ' + (e.getAttribute('href') || '') : '';
      if (t.trim()) out.push(e.tagName.toLowerCase() + ': ' + t + href);
    });
    document.querySelectorAll('input,textarea').forEach(e => {
      out.push('FIELD ' + (e.name || e.id || e.getAttribute('placeholder') || e.type) + ' = ' + JSON.stringify((e.value || '').slice(0, 30)));
    });
    return [...new Set(out)];
  });
  console.log(`\n=== ${r}  ->  ${page.url()} ===`);
  console.log(els.join('\n') || '(no controls / maybe redirected)');
}
await ctx.close();
