# Zoop documentation — agent guide

This repo is the **single source of truth** for the public Zoop docs at
`https://zoop.documentationai.com`. Documentation.ai builds and deploys from the
`main` branch. Git is one-way: edits flow repo → platform. There is no other
editor of record — write here.

This file is read by Claude Code (and Documentation.ai's own AI agent) before
authoring. Follow it exactly.

## What Zoop is

Zoop is an AI-first **field service management (FSM)** SaaS for solo contractors
and small teams (1–50): plumbers, electricians, HVAC techs, landscapers,
handymen. They run a business from a truck. They are not enterprise buyers.

Core flow: customer → quote → job → invoice → get paid. Built on Next.js 16+,
Supabase (Postgres + RLS + Auth), Stripe (payments), Twilio (SMS), Resend
(email), Inngest (background jobs), and the Claude API (AI features).

## The two audiences

Every page targets exactly one audience. Set it in frontmatter (`audience`) and
write in that register.

1. **End users** (`audience: end-user`) — solo owner-operators, dispatchers,
   office managers. **Non-technical.** No code. Task-first. Tell them what to do
   and where to tap. Pages live under `using-zoop/`.
2. **Developers** (`audience: developer`) — **junior** developers integrating via
   the API. Keep it concrete: define terms, give complete runnable examples, no
   assumed deep CS background. Pages live under `developers/`.

## Voice & style (from the product's own content-style guide)

- **Direct.** "Add a customer." Not "Begin the customer creation process."
- **Human, slightly warm.** "Got it — sending now." Not "Operation completed."
- **Plainspoken.** "We couldn't reach Stripe." Not "connectivity error."
- **Confident, not corporate.** Never "comprehensive solution that empowers…".
- **Short.** Tight sentences. 5-word headings where you can.
- **Second person** for the user ("you", "your business"). **"we"** only for
  Zoop-the-company moments (onboarding/marketing).
- The product is always **Zoop** — never "the platform", "the system", "the app".
- **Sentence case for everything** — page titles, headings, buttons, table
  headers. Acronyms keep case: **API, MCP, SMS, AI, PDF, ID, OAuth, JSON**.
- **Numbers:** currency always two decimals (`$1,240.00`); counts as bare
  integers (`14 jobs`); percentages no decimals unless needed (`68%`); dates
  human-facing `Tuesday, October 15`, ISO `2026-06-13` only for APIs/exports.
- **Trade language is good** — "snake the P-trap", "run new Romex". Don't
  genericize to "perform plumbing work".
- No exclamation points, no emoji, no "click here", no "please" in labels.

## Grounding rules (non-negotiable — docs auto-deploy)

- Every statement traces to source in `ZoopHub/nextgen`. **Never invent**
  features, endpoints, fields, prices, or limits.
- If you can't verify something, do not assert it. Use a Callout flagged for a
  human instead:
  `<Callout type="warning">TODO(verify): <what to confirm></Callout>`
- Screenshots: capture ONLY from the dedicated demo/mock account — never from a
  real or staging tenant. Screenshots must contain **no real PII** (no real names,
  emails, phone numbers, or addresses). Where a shot belongs but isn't captured
  yet, leave `<Callout type="info">TODO(screenshot): <what to capture></Callout>` —
  never describe a UI you haven't seen as if it's certain.
- Image hosting: screenshots live in **Cloudflare R2** (bucket `zoop-docs`), served
  at `https://doc-assets.zoop.pro/images/<path>` — reference images by that absolute
  URL. The local `images/` dir is **gitignored** (R2 is the host, not git); after
  capturing, upload with `.zoop-docs-src/r2-upload.mjs` (reads `.r2.env`). A bare
  `/images/...` path does NOT render (Documentation.ai doesn't serve repo files), and
  never use the app/staging host.
- Never hardcode the Zoop app host (staging or production) in examples. Use the
  placeholder `https://app.zoop.example` and tell readers to resolve the real host
  from `GET /.well-known/oauth-protected-resource`.
- Prefer the product's own terminology (see Glossary in `glossary.mdx`).

## File & path conventions

- All pages are `.mdx`. Lowercase-with-hyphens filenames and directories.
- `documentation.json` references pages by path **without** the `.mdx` extension.
- Frontmatter: `title` (required, sentence case) and `description` (≤160 chars)
  on every page. Add `audience: end-user | developer`. **Quote any value that
  contains a colon** (e.g. `description: "See it all: jobs, invoices"`) — an
  unquoted colon breaks the YAML and dumps the frontmatter into the page body.
- Internal links use **absolute, extensionless** paths: `[Quotes](/using-zoop/quotes)`.
- Keep the directory shallow; align folders with the nav groups.

## No-churn + redirect policy (this is the 404 guarantee)

- **Default to editing pages in place.** Do not rename or move a page just to
  tidy structure. Slugs are stable contracts.
- When a move/rename is genuinely necessary, it is **mandatory** to add a
  `redirects` entry (old path → new path) to `documentation.json` in the same
  change. No exceptions. See `.docs-sync/policy.md`.
- Adding new pages: also add them to `navigation` in `documentation.json`.

## Documentation.ai components (use these, not raw HTML)

- `<Steps>` / `<Step title="…">` — for any procedure ("how to send an invoice").
- `<Tabs>` / `<Tab title="…">` — platform/variant splits (e.g. cURL vs JS).
- `<CodeGroup>` — the same call in multiple languages.
- `<Card>` / `<Columns>` — landing pages and choose-your-path layouts.
- `<Callout type="info|warning|success|danger">` — notes, warnings, TODOs.
- `<ParamField>` / `<ResponseField>` — request/response fields in API docs.
- `<Expandable>` — long optional detail.
- ` ```bash / ```json / ```ts ` fenced blocks for code; always specify language.

## How docs are maintained (automation)

This repo is kept in sync with the codebase by two engines (see `README.md`):
Documentation.ai **Workflows** (routine syncs) and **Claude Code** via the
`zoop-docs-sync` routine (narrative + restructures). State lives in
`.docs-sync/manifest.json` (the last documented `nextgen` commit + page→source
map). When you finish a sync, update the manifest.

## Source map (where to ground each area)

- Product/personas/architecture: `Documentation/`, `README.md`, `AGENTS.md`,
  `supabase/migrations/` (data model).
- Voice: `docs/content-style.md`, `docs/design-system.md`.
- Developer/API: `docs/mcp/README.md` (the 65-tool catalog), `docs/api/oauth.md`,
  `docs/api/api-keys.md`, `src/lib/auth/external/scopes.ts`,
  `src/lib/agent/tools/`, `src/app/api/mcp/route.ts`.
- End-user features: `src/app/[tenantId]/(management)/*`, `src/components/*`,
  `src/lib/*`, `mobile/`.
