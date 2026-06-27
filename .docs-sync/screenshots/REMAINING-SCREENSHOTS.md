# Remaining screenshots

_Last updated 2026-06-27._

Each pending shot is marked inline in the docs as
`<Callout type="info">TODO(screenshot): …</Callout>`. Capture only from the
**Valdez demo** (`app.zoop.mom`) — **no real PII** — and make sure the demo is on
current `nextgen` first, or shots will contradict the docs.

## Pipeline (all in this folder)

- `capture-screenshots.mjs` — Playwright. Logs in once (session persists in
  `.userdata/`), walks a manifest, writes PNGs to `../../images/`. Redacts the PII
  map in `.redact.json`, hides transient banners, supports `scrollY` actions.
- `r2-upload.mjs` — uploads to the `zoop-docs` R2 bucket → `doc-assets.zoop.pro`.
- `.redact.json` / `.r2.env` — gitignored (PII map / R2 creds).

```
cd .docs-sync/screenshots
# first run: omit HEADLESS, log in when the browser opens
ZOOP_BASE=https://app.zoop.mom ZOOP_TENANT=valdez-painting \
ZOOP_USERDATA="$PWD/.userdata" MANIFEST=<your>.json node capture-screenshots.mjs
node r2-upload.mjs ../../images/path/to/shot.png   # scope to the files you captured
```

Then replace the matching `TODO(screenshot)` callout with
`<Image src="https://doc-assets.zoop.pro/images/<path>" alt="…" />`.

## Captured (this run, 2026-06-26/27)

- using-zoop/dashboard — owner dashboard
- using-zoop/customers — Add Customer page
- using-zoop/settings — API & MCP panel; Connected apps
- using-zoop/pricebook — CSV import wizard ("Item type")
- using-zoop/getting-started — Card payments (active state)
- using-zoop/team — member row with the shield; MCP & API access dialog
- using-zoop/dispatch — dispatch board (seeded today's jobs across both members)

## Remaining (45), grouped by what's blocking them

### Needs data or an interaction in the demo (web-reachable with setup)
Exist in the app but need a populated record, a dialog opened, or a specific state.
Seed via the Zoop MCP where the tool allows it — jobs/invoices support line items +
scheduling; **quote writes are owner-gated and the MCP connection is not
owner-scoped**, so accept/line-item quote shots need the UI as an owner.
- **quotes** — line-items table; editor with sections; "what's next" sidebar on an
  *accepted* quote; lawn-estimator polygon + tool-inputs chip (needs a drawn measurement).
- **payments** — Share-invoice dialog (payment link + QR); Issue-a-refund dialog
  (needs a card-paid invoice); "set up" + active states side by side.
- **invoices** — job detail & quote detail "Create invoice" action (conditional).
- **jobs / recurring-jobs** — "Apply changes to" scope modal (edit a series job).
- **team** — pending-invites table (needs a pending invite); job assignee picker (crew + members).
- **calendar** — holds inbox with pending requests.
- **communications** — customer timeline (SMS/email mix; failed-delivery entry) — needs message history.
- **notes** — version-history panel (needs a multi-version note).
- **recurring-billing** — auto-pay status card (needs a plan with auto-pay on).
- **getting-started** — Business info tab, full page (recapture once tagline/website fields are tidied).
- **customer-portal** — portal-access section on the customer *detail* page (Generate/Revoke) — web-reachable.

### Dashboard card close-ups (need element-level capture)
The full owner dashboard is captured; these want cropped cards / specific states.
Add element-screenshot support to the harness (capture a selector, not the page):
- stat-card row; Today's schedule (with jobs + empty); Needs attention (items + all-clear);
  payment recovery (buckets + "all caught up"); route intelligence (empty + populated).

### Fresh-owner account only
Render only for a brand-new owner mid-onboarding — not reproducible on the established Valdez tenant:
- onboarding screen (company name + trade picker); "Welcome to Zoop" dialog;
  setup-checklist card; amber "Connect Stripe" banner.

### Off-web / separate surface
- **Mobile app (8):** app-store/home icon; LoginScreen + TenantPicker; TodayScreen;
  JobsScreen; CustomersScreen; InvoicesScreen; QuotesScreen; NoteComposer — native app, capture on a device/simulator.
- **Customer portal (3):** portal home; invoice pay block; auto-pay section — token-gated customer surface.
- **Storefront:** published storefront page — enable the public storefront first (Settings → Business info toggle is off).
- **Developers / OAuth:** consent screen with grouped permission areas — needs a client mid-OAuth-flow.

### Quick win (reuse)
- **welcome.mdx** — dashboard hero: reuse `using-zoop/dashboard/dashboard-owner.png`
  (its callout still has the stale "pending invoices" wording).
</content>
