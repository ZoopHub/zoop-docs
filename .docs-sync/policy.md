# Sync policy — incremental, no churn, no 404s

Rules every doc-maintenance run (human, Claude Code, or Documentation.ai
Workflow) must follow. The goal: docs track the code with the smallest possible
change set and **never** create a broken link.

## 1. Edit in place by default

- A page's path/slug is a stable, public contract. Treat moving or renaming a
  page as a last resort, not a cleanup habit.
- When code changes, find the affected page(s) via the page→source map in
  `manifest.json` and make **surgical edits**. Don't rewrite a whole page to
  change one sentence.

## 2. Moves/renames require a redirect (mandatory)

If you must move or rename a page (or delete one):

1. Add an entry to the top-level `redirects` array in `documentation.json`:
   ```json
   { "redirects": [ { "source": "/old/path", "destination": "/new/path", "statusCode": 308 } ] }
   ```
2. Put more specific redirects before general ones.
3. Update every internal link that pointed at the old path.
4. Update `navigation` and the `manifest.json` page entry.

A move/rename/delete commit without a matching redirect is **invalid** — do not
merge it.

## 3. New pages

- Create the `.mdx` file, add frontmatter (`title`, `description`, `audience`),
  add it to `navigation` in `documentation.json`, and add a `manifest.json`
  entry recording the `nextgen` source files it documents.

## 4. Incremental delta detection

- The baseline is `manifest.documented_sha` (a `ZoopHub/nextgen` commit).
- A run diffs `nextgen` since that SHA, maps changed source files → affected
  pages, updates only those, then advances `documented_sha` to the new HEAD.

## 5. Grounding

- Never assert anything not backed by `nextgen` source. Flag unknowns with
  `<Callout type="warning">TODO(verify): …</Callout>` rather than guessing.

## 6. Validation before commit

- `documentation.json` is valid JSON.
- Every `navigation` page path resolves to an existing `.mdx` file.
- Every `.mdx` file (except intentional drafts) appears in `navigation`.
- Every internal link target resolves to a known page or a redirect.
- Every page has `title` + `description` frontmatter.
