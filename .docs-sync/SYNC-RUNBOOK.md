# Keeping the docs current — sync runbook

How `zoop-docs` stays accurate as `ZoopHub/nextgen` evolves. Three layers, each
with a different trigger and scope. The state that ties it together is
`.docs-sync/manifest.json` → `documented_sha` (the last `nextgen` commit the docs
were reconciled against) and the page→source map.

```
nextgen merges ──► Layer 1: Documentation.ai Workflows (platform, auto)
       │                     API-ref sync · changelog · link/style/nav audits
       │
       └────────►  Layer 2: Claude Code sync (zoop-docs-sync, the real engine)
                             diff since documented_sha → update affected pages →
                             adversarial verify → push → advance documented_sha
                                       │
                     Layer 3: monthly drift audit (safety net)
```

## The core loop (Layer 2 — the one that does the real work)

Every run is **incremental and grounded**, never a regenerate:

1. **Refresh source.** `git -C <nextgen-clone> fetch && git checkout origin/main`.
   Read `HEAD` (new sha) and `manifest.documented_sha` (baseline).
2. **Diff.** `git diff --name-only <baseline>..<head>` + `git log <baseline>..<head>`
   → changed files + commit messages.
3. **Triage.** Map changed source paths → affected doc pages via the manifest
   page→source map. Identify net-new surface (new routes/tools/entities) that has
   no page yet.
4. **Update in place.** For each affected page, make the *smallest* edit that makes
   it true again, grounded in the new source. New surface → new page + nav entry.
5. **Honor the guardrails** (below).
6. **Verify.** Adversarially re-check each edited page against source; fix or flag
   `TODO(verify)` — never assert the unverified.
7. **Validate.** Run `.docs-sync/validate` checks (valid JSON, nav↔file, links,
   frontmatter, image refs + alt).
8. **Publish.** Commit, push `main` (auto-deploys), then **advance
   `manifest.documented_sha` to `<head>`** and update the page→source map. The SHA
   bump is what makes the next run incremental.

Run it via the workflow engine: `wf-docs-sync.js` (fan-out triage → update →
verify). Manual today; wrap in a `/schedule` cloud routine for unattended runs.

## Guardrails that keep it accurate (non-negotiable)

- **Grounding:** every statement traces to `nextgen` source. Unverifiable → a
  `TODO(verify)` callout, not a guess. (See `CLAUDE.md`.)
- **No churn + mandatory redirects:** edit pages in place; never rename/move to
  tidy. Any move/rename/delete ships a `redirects` entry in `documentation.json`
  in the same change. This is the 404 guarantee. (See `policy.md`.)
- **Adversarial verify before publish:** a second pass tries to *refute* each
  edit against source. Cheap insurance because `main` auto-deploys.
- **Incremental only:** drive everything off `documented_sha`; do not regenerate.

## Screenshots

When a change touches a documented UI surface, re-capture just that surface:
`.docs-sync/screenshots/` holds the harness (`capture-screenshots.mjs`), the
manifest, the seed scripts, and `REMAINING-SCREENSHOTS.md`. Re-run capture with
`ONLY=<page-prefix>` to refresh only the affected shots; the build CDN-hosts
repo images referenced as `<Image src="/images/…">`.

## Cadence (recommended)

| Layer | Trigger | Scope |
|---|---|---|
| 1 — Documentation.ai Workflows | PR-merge to `nextgen` + weekly | API ref, changelog, audits |
| 2 — `zoop-docs-sync` (Claude) | weekly, or on a notable feature merge | narrative/concepts/guides + restructures |
| 3 — drift audit | monthly | spot-check pages vs source; find undocumented new areas |

## Layer 1 setup (one-time, in the Documentation.ai dashboard)

Requires a Standard plan. Settings → Workflows: add the trigger repo (`nextgen`)
+ `zoop-docs` as context, enable **API sync**, **Changelog**, and **Audit**
workflows on PR-merge + weekly. These run on platform credits and need no local
infra.
