# zoop-docs

Public documentation for **Zoop**, published at
`https://zoop.documentationai.com` via [Documentation.ai](https://documentation.ai).

This repo is the **single source of truth**. Documentation.ai builds and deploys
from `main` (push → build → deploy; PRs get preview builds). Edit here, not in the
Documentation.ai web editor.

## Layout

```
documentation.json     Site config + navigation (2 audiences) + redirects
CLAUDE.md              Authoring guide for AI agents (voice, components, rules)
welcome.mdx            Landing page
using-zoop/            End-user docs (owner-operators, dispatchers, office mgrs)
developers/            Developer docs (API: MCP tools, OAuth, API keys)
changelog.mdx
glossary.mdx
.docs-sync/            Automation state — NOT published
  manifest.json        Last documented nextgen SHA + page→source map
  policy.md            No-churn + mandatory-redirect rules (404 protection)
  *-design.md          Design record
```

## How docs stay current

Source app: [`ZoopHub/nextgen`](https://github.com/ZoopHub/nextgen). Two engines
keep docs aligned with the code:

- **Documentation.ai Workflows** — routine syncs (API docs, changelog, audits)
  on schedule / PR-merge.
- **Claude Code (`zoop-docs-sync`)** — narrative + restructures, run manually now,
  scheduled later. Diffs `nextgen` since `manifest.documented_sha`, edits only
  affected pages, advances the SHA.

Both follow `.docs-sync/policy.md`: edit in place, never churn the tree, and any
move/rename **must** ship a `redirects` entry in `documentation.json`.

## Editing by hand

Add a page: create `path/to/page.mdx` with `title` + `description` frontmatter,
add it to `navigation` in `documentation.json`. Moving a page? Add a redirect.
Run the validation checks in `.docs-sync/policy.md` before pushing.
