# Aaron Studio Workflow Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore Aaron Studio's blog/content workflows and make them discoverable from Codex as well as Claude.

**Architecture:** Keep `tiles/` as the source of truth, add missing blog workflow tiles, then expose those skills through agent-specific symlinks. Use a shared config file for local paths and a validation script for workflow wiring.

**Tech Stack:** Markdown skills, JSON tile manifests, Bash validation/sync scripts, git symlinks.

---

### Task 1: Add Workflow Validation

**Files:**
- Create: `scripts/validate-workflows.sh`

- [x] **Step 1: Write the failing validation script**

Checks required blog workflow tiles, shared config keys, agent skill symlinks, cache ignore rules, and Codex documentation.

- [x] **Step 2: Run validation to verify it fails**

Run: `bash scripts/validate-workflows.sh`
Expected: FAIL for missing `blog-outline`, `blog-write`, `blog-production`, config, symlinks, and ignore rules.

### Task 2: Add Shared Config and Ignore Rules

**Files:**
- Create: `config/aaron-studio.json`
- Modify: `.gitignore`

- [x] **Step 1: Add repo-level config**

Defines content root, brain root, blog repo paths, timezone, skill surfaces, and blog workflow mapping.

- [x] **Step 2: Ignore generated caches**

Ignore `.video-gen-cache/` and local worktree directories.

### Task 3: Restore Blog Workflow Skills

**Files:**
- Create: `tiles/blog-outline/SKILL.md`
- Create: `tiles/blog-outline/tile.json`
- Create: `tiles/blog-write/SKILL.md`
- Create: `tiles/blog-write/tile.json`
- Create: `tiles/blog-production/SKILL.md`
- Create: `tiles/blog-production/tile.json`

- [x] **Step 1: Add `blog-outline`**

Turns ideas or `content-plan.md` into `plan.md`.

- [x] **Step 2: Add `blog-write`**

Generates English and Chinese articles plus X, newsletter, and YouTube script artifacts.

- [x] **Step 3: Add `blog-production`**

Detects current post state and routes to the next focused skill.

### Task 4: Add Cross-Agent Skill Sync

**Files:**
- Create: `scripts/sync-agent-skills.sh`

- [x] **Step 1: Create conservative symlink sync**

Sync local tile skills into `.agents`, `.codex`, `.claude`, `.cursor`, and `.gemini` without overwriting real directories.

- [x] **Step 2: Run sync**

Run: `./scripts/sync-agent-skills.sh`
Expected: symlinks created for blog and YouTube workflow skills.

### Task 5: Update Registry and Docs

**Files:**
- Modify: `tessl.json`
- Modify: `AGENTS.md`
- Modify: `CLAUDE.md`
- Modify: `README.md`
- Modify: `tiles/publish-to-blog/SKILL.md`
- Modify: `scripts/daily-log.sh`
- Modify: `scripts/com.aaron.daily-log.plist`
- Modify: `scripts/README-daily-log.md`

- [x] **Step 1: Add new tiles to `tessl.json`**

Register `blog-outline`, `blog-write`, `blog-production`, and `x-growth`.

- [x] **Step 2: Document Codex compatibility**

Explain that `tiles/` is the source of truth and `scripts/sync-agent-skills.sh` exposes skills across agent surfaces.

- [x] **Step 3: Update old local paths**

Replace stale `/Users/aguo/...` publishing/daily-log paths with current config or repo-relative paths.

### Task 6: Verify

**Files:**
- Read: all files above

- [x] **Step 1: Run workflow validation**

Run: `./scripts/validate-workflows.sh`
Expected: all checks pass.

- [x] **Step 2: Inspect git status**

Run: `git status --short`
Expected: only workflow/config/docs/symlink changes plus pre-existing user brain/log changes.

### Task 7: Review Cleanup Follow-Up

**Files:**
- Modify: `.gitignore`
- Modify: `scripts/daily-log.sh`
- Modify: `scripts/sync-agent-skills.sh`
- Modify: `scripts/validate-workflows.sh`
- Create: `tiles/brain-ingest/`
- Create: `tiles/daily-log/`
- Create: `tiles/weekly-review/`

- [x] **Step 1: Remove historical generated artifacts from git index**

Use `git rm --cached` for tracked `.video-gen-cache/`, generated narration audio, tile output directories, and Remotion scratch files. Keep local files on disk.

- [x] **Step 2: Move brain skills into `tiles/`**

Make `brain-ingest`, `daily-log`, and `weekly-review` source-of-truth tiles and sync agent-specific skill symlinks.

- [x] **Step 3: Make `daily-log.sh` Codex-compatible**

Prefer `codex exec`, allow Claude fallback, support explicit agent overrides, and write logs to `.agent-logs/`.

- [x] **Step 4: Remove stale hard-coded user paths**

Replace `/Users/aaron/...` examples with `$HOME`, repo-relative commands, or config-backed paths.

- [x] **Step 5: Re-run verification**

Run `bash -n`, JSON parse checks, `./scripts/validate-workflows.sh`, and `git diff --check`.
