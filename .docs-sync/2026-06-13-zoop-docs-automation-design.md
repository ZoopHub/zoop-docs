# Zoop docs automation — design

Date: 2026-06-13 · Status: accepted · Owner: David

## Goal

Maintain the Zoop documentation at `https://zoop.documentationai.com` so it
tracks the codebase as it evolves, **automatically and incrementally**, without
churning the file tree or creating 404s. Devs focus on `ZoopHub/nextgen`; an AI
agent maintains the docs in `ZoopHub/zoop-docs`.

## Platform: Documentation.ai (what we use, what we don't)

- **Docs repo = single source of truth.** Push to `main` → Documentation.ai
  builds + deploys. One-way (repo → platform). `.mdx` + `documentation.json`.
- **Use built-ins, don't reinvent:** `redirects` in `documentation.json` (404
  protection); `navigation.tabs` for the two-audience split; the CLAUDE.md
  authoring template; the read-only Docs MCP for grounded search.
- **OpenAPI import does not apply yet** — `nextgen` has no OpenAPI spec or
  generator. The API surface is an MCP server (65 tools / 13 entities) + OAuth +
  API keys, documented in `docs/mcp/README.md` and `docs/api/*`. The developer
  reference is hand-authored from those. Generating an OpenAPI spec from the tool
  registry is a future option.
- **Documentation.ai's own AI agent is interactive-only** (no triggers/API/
  schedule), so the automation comes from outside the platform.

## Engines (hybrid)

- **Engine A — Documentation.ai Workflows** (beta, Standard plan): routine,
  hands-off syncs (API-doc sync, changelog from merged PRs, link/style/nav
  audits) on schedule / PR-merge.
- **Engine B — Claude Code** via the `zoop-docs-sync` routine: narrative guides,
  concept pages, and restructures needing real codebase reasoning. Invoked
  manually now; wrapped in a `/schedule` cloud routine later (git push for
  headless reliability; Authoring MCP when interactive).

Both commit to `zoop-docs`; both obey `.docs-sync/policy.md` (no churn +
mandatory redirects). Publish model: **auto-merge** to `main`.

## Audiences

1. **End users** (`using-zoop/`) — solo FSM owner-operators, dispatchers, office
   managers. Non-technical, task-first, no code.
2. **Developers** (`developers/`) — junior developers integrating via the API.
   Low-jargon, complete runnable examples.

## State

`.docs-sync/manifest.json` holds the last documented `nextgen` SHA and a
page→source map. Each run diffs `nextgen` since that SHA, updates only affected
pages, advances the SHA.

## Bootstrap (fresh from code)

Survey `nextgen` → build IA → scaffold (`documentation.json`, `CLAUDE.md`,
manifest, policy) → generate the corpus in grounded waves (multi-agent) →
validate (JSON, nav↔file, links, frontmatter, grounding) → push `main` → stamp
baseline SHA. Screenshots deferred until live-app access; placeholders flag where
they belong.

## Risks / open items

- Auto-merge publishes unreviewed AI docs → mitigated by grounding rules,
  TODO(verify) callouts, and a recommended one-time human review of the bootstrap.
- Engine A requires a Standard plan + AI credits; enable when ready.
- API reference is hand-authored until/unless an OpenAPI generator is added to
  `nextgen`.
- End-user pages lack screenshots until live-app access is granted.
