# Automated doc sync — run playbook

What the sync does on **each new `nextgen` release**. Runs locally, opens a **PR**
(never pushes to `main`). Driven by `sync-watch.sh` (launchd). Obeys the guardrails
in `../CLAUDE.md`, `policy.md`, and `SYNC-RUNBOOK.md`.

## Inputs
- Docs repo: this repo (`zoop-docs`), clean `main`.
- Source: `/Users/david/Repo/nextgen` (read-only), branch `origin/main`.
- Baseline: `manifest.json` → `documented_sha`.

## Each run
1. **Refresh.** `git -C <nextgen> fetch origin main`. `HEAD = origin/main`, `BASE = documented_sha`. If `HEAD == BASE`, stop — nothing to do.
2. **Diff.** `git -C <nextgen> diff --name-only BASE..HEAD` and `git -C <nextgen> log --oneline BASE..HEAD`. Read the actual changed files at HEAD with `git -C <nextgen> show HEAD:<path>` — **never guess** (this is the grounding rule; docs auto-deploy).
3. **Triage.** Map each changed source path → affected doc page(s) via the `manifest.json` page→source map. Flag **net-new surface** (a new route, MCP tool, entity, or migration) that has no page yet.
4. **Update in place.** For each affected page, make the *smallest* edit that makes it true again, grounded in the new source. Net-new surface → new page + a `documentation.json` nav entry + a `manifest.json` page entry (+ a `redirects` entry if anything moved or renamed — the 404 guarantee).
5. **Changelog.** Add dated entries for user- and developer-facing changes.
6. **Screenshots.** If a change touches a documented UI surface, list it for an assisted re-capture (see `screenshots/REMAINING-SCREENSHOTS.md` + `capture-screenshots.mjs ONLY=<page-prefix>`). Don't block the text sync — keep/leave the `TODO(screenshot)` and call it out in the PR.
7. **Guardrails.** Grounding (no invented facts; `TODO(verify)` callouts for anything unverifiable). No-churn + mandatory redirects. App host is always `app.zoop.pro`. Voice/style and components per `CLAUDE.md`.
8. **Verify.** Adversarially re-check each edited page against the source; fix or flag.
9. **Validate.** `node .docs-sync/screenshots/validate.mjs` must print `VALIDATION: PASS`.
10. **Advance.** Set `manifest.json` `documented_sha = HEAD`, `documented_at = <today>`; extend the page→source map for any new pages. (Advancing the SHA every run is what stops the platform's "advance the SHA" nag loop.)
11. **PR — do not push to `main`.** Branch `docs-sync/<short-HEAD>`, commit, push, and open a PR with `gh`, summarizing: pages touched, new pages, screenshot TODOs, and any `TODO(verify)` flags. A human reviews and merges; the merge auto-deploys.

## Stop-and-flag
If the diff is large or adds a whole feature area, say so **prominently** in the PR. Under-documenting a release is worse than a noisy PR — that's how a 33-commit backlog slipped through once.
