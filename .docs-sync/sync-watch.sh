#!/usr/bin/env bash
# Local doc-sync watcher.
#
# Polls nextgen's main; when it advances past manifest.documented_sha, runs the
# doc sync (see sync.md), which opens a PR on a docs-sync/* branch. Scheduled by
# launchd (com.zoop.docs-sync.plist). Logs to .docs-sync/sync.log.
#
# Before trusting it unattended, run it once by hand and watch the log + the PR:
#   bash .docs-sync/sync-watch.sh
#
# Requirements for unattended runs:
#   - Claude Code CLI logged in for this user, with a NON-INTERACTIVE permission
#     setting (verify the flag for your version — see CLAUDE_CMD below). Without
#     it the headless run will stall on a tool-permission prompt.
#   - `gh` authenticated (the sync opens the PR with it).
#   - The Mac awake/online (launchd StartInterval only fires while awake).
set -uo pipefail

DOCS="/Users/david/Repo/zoop-docs"
NEXTGEN="/Users/david/Repo/nextgen"
LOG="$DOCS/.docs-sync/sync.log"
LOCK="$DOCS/.docs-sync/.sync.lock"

exec >>"$LOG" 2>&1
ts() { date "+%Y-%m-%d %H:%M:%S"; }

# Don't overlap a previous (possibly long) sync run.
if [ -e "$LOCK" ]; then echo "[$(ts)] previous run still active; skipping"; exit 0; fi
trap 'rm -f "$LOCK"' EXIT
: > "$LOCK"

git -C "$NEXTGEN" fetch -q origin main || { echo "[$(ts)] nextgen fetch failed"; exit 0; }
HEAD="$(git -C "$NEXTGEN" rev-parse origin/main)"
BASE="$(node -e "process.stdout.write(require('$DOCS/.docs-sync/manifest.json').documented_sha)")"

if [ "$HEAD" = "$BASE" ]; then echo "[$(ts)] up to date ($BASE)"; exit 0; fi

# A docs-sync PR only advances documented_sha when it MERGES. Until then this delta
# is still open — skip, or we'd open a duplicate PR every interval.
if command -v gh >/dev/null 2>&1; then
  OPEN_PRS="$(cd "$DOCS" && gh pr list --state open --base main --json headRefName -q '.[].headRefName' 2>/dev/null | grep -c '^docs-sync/' || true)"
  if [ "${OPEN_PRS:-0}" != "0" ]; then echo "[$(ts)] a docs-sync PR is already open — waiting for review/merge; skipping"; exit 0; fi
fi

echo "[$(ts)] nextgen advanced ${BASE:0:9} -> ${HEAD:0:9}; starting sync"

cd "$DOCS" || exit 0
git checkout -q main && git pull -q --ff-only origin main || true

# The sync itself is an intelligent run: it follows .docs-sync/sync.md and opens a PR.
# Adjust CLAUDE_CMD's flags to your Claude Code version's non-interactive/permission
# options before relying on this unattended.
CLAUDE_CMD=(claude -p "Run the documentation sync in .docs-sync/sync.md. nextgen BASE=$BASE HEAD=$HEAD. Open a PR on a docs-sync/* branch; do not push to main.")
if command -v claude >/dev/null 2>&1; then
  "${CLAUDE_CMD[@]}" || echo "[$(ts)] sync run exited non-zero"
else
  echo "[$(ts)] 'claude' CLI not found — sync needs to run by hand this time"
fi
echo "[$(ts)] done"
