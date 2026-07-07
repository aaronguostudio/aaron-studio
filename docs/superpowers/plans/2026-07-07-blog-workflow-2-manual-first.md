# Blog Workflow 2.0 Manual-First Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the manual-first version of Blog Workflow 2.0 by adding templates, a lightweight artifact generator, workflow rules, and tests that make memory reflection, editorial judgment, research, argument, red-team review, postmortem, and canon notes part of the blog production process.

**Architecture:** Keep the first implementation intentionally lightweight. Add reusable markdown templates under `tiles/blog-production/templates/workflow2/`, a small Bun script that copies missing templates into a post directory, and skill documentation updates that make `blog-production`, `blog-brainstorm`, `blog-outline`, and `blog-write` follow the new gates. Defer semantic search, automatic internal-link insertion, and historical backlink rewriting until after 2-3 posts use the manual workflow.

**Tech Stack:** Markdown skills, Bun TypeScript scripts and tests, existing `blog-production`, `blog-brainstorm`, `blog-outline`, `blog-write`, and `aaron-video-gen` skill docs.

---

## File Structure

Create:

- `tiles/blog-production/templates/workflow2/idea.md`
- `tiles/blog-production/templates/workflow2/memory-reflection.md`
- `tiles/blog-production/templates/workflow2/editorial-brief.md`
- `tiles/blog-production/templates/workflow2/research-dossier.md`
- `tiles/blog-production/templates/workflow2/argument-memo.md`
- `tiles/blog-production/templates/workflow2/red-team-review.md`
- `tiles/blog-production/templates/workflow2/postmortem.md`
- `tiles/blog-production/templates/workflow2/canon-note.md`
- `tiles/blog-production/scripts/workflow2-artifacts.ts`
- `tiles/blog-production/scripts/workflow2-artifacts.test.ts`
- `src/content/strategy/blog-memory.md`

Modify:

- `tiles/blog-production/SKILL.md`
- `tiles/blog-brainstorm/SKILL.md`
- `tiles/blog-outline/SKILL.md`
- `tiles/blog-write/SKILL.md`
- `tiles/blog-write/scripts/blog-write-workflow.test.ts`

Do not modify:

- `scripts/blog-growth/*`
- Remotion renderer files
- published blog repo files
- historical blog posts

---

### Task 1: Add Workflow 2 Template Generator Tests

**Files:**
- Create: `tiles/blog-production/scripts/workflow2-artifacts.test.ts`

- [ ] **Step 1: Create the failing test file**

Create `tiles/blog-production/scripts/workflow2-artifacts.test.ts` with this content:

```ts
import { mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { describe, expect, test } from "bun:test";
import {
  WORKFLOW2_ARTIFACTS,
  createWorkflow2Artifacts,
} from "./workflow2-artifacts";

describe("workflow2 artifact generator", () => {
  test("creates every workflow 2 artifact when missing", () => {
    const dir = mkdtempSync(join(tmpdir(), "blog-workflow2-"));

    try {
      const result = createWorkflow2Artifacts(dir);

      expect(result.created.sort()).toEqual([...WORKFLOW2_ARTIFACTS].sort());
      expect(result.skipped).toEqual([]);

      for (const artifact of WORKFLOW2_ARTIFACTS) {
        const path = join(dir, artifact);
        expect(existsSync(path)).toBe(true);
        const content = readFileSync(path, "utf-8");
        expect(content.length).toBeGreaterThan(80);
      }
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test("does not overwrite existing editorial artifacts", () => {
    const dir = mkdtempSync(join(tmpdir(), "blog-workflow2-"));

    try {
      const memoryPath = join(dir, "memory-reflection.md");
      writeFileSync(memoryPath, "# Existing Memory\n\nKeep this note.\n", "utf-8");

      const result = createWorkflow2Artifacts(dir);

      expect(result.skipped).toContain("memory-reflection.md");
      expect(readFileSync(memoryPath, "utf-8")).toContain("Keep this note.");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
```

- [ ] **Step 2: Run the test to verify RED**

Run:

```bash
npx -y bun test tiles/blog-production/scripts/workflow2-artifacts.test.ts
```

Expected: FAIL because `tiles/blog-production/scripts/workflow2-artifacts.ts` does not exist.

- [ ] **Step 3: Commit the failing test**

Run:

```bash
git add tiles/blog-production/scripts/workflow2-artifacts.test.ts
git commit -m "test: cover blog workflow 2 artifacts"
```

Expected: commit includes only `tiles/blog-production/scripts/workflow2-artifacts.test.ts`.

---

### Task 2: Add Workflow 2 Templates

**Files:**
- Create: `tiles/blog-production/templates/workflow2/idea.md`
- Create: `tiles/blog-production/templates/workflow2/memory-reflection.md`
- Create: `tiles/blog-production/templates/workflow2/editorial-brief.md`
- Create: `tiles/blog-production/templates/workflow2/research-dossier.md`
- Create: `tiles/blog-production/templates/workflow2/argument-memo.md`
- Create: `tiles/blog-production/templates/workflow2/red-team-review.md`
- Create: `tiles/blog-production/templates/workflow2/postmortem.md`
- Create: `tiles/blog-production/templates/workflow2/canon-note.md`

- [ ] **Step 1: Create `idea.md` template**

Create `tiles/blog-production/templates/workflow2/idea.md`:

```markdown
# Idea

## Topic

## Why Now

## Target Reader

## Reader Pain / Curiosity

## Initial Thesis

## Why This Should Exist

## Kill Criteria
```

- [ ] **Step 2: Create `memory-reflection.md` template**

Create `tiles/blog-production/templates/workflow2/memory-reflection.md`:

```markdown
# Memory Reflection

## Related Past Posts

## Ideas To Reuse

## Ideas To Update

## Internal Link Candidates

## Continuity Thesis

This post extends Aaron's previous writing by:
```

- [ ] **Step 3: Create `editorial-brief.md` template**

Create `tiles/blog-production/templates/workflow2/editorial-brief.md`:

```markdown
# Editorial Brief

## Reader Pain

## Sharp Thesis

## Why Aaron Can Write This

## Evidence Needed

## Counterargument

## Reusable Frame

## Distribution Hook

## Kill Criteria
```

- [ ] **Step 4: Create `research-dossier.md` template**

Create `tiles/blog-production/templates/workflow2/research-dossier.md`:

```markdown
# Research Dossier

## Primary Sources

## Secondary Sources

## Cases

## Counterarguments

## Quotes And Facts

## Open Questions
```

- [ ] **Step 5: Create `argument-memo.md` template**

Create `tiles/blog-production/templates/workflow2/argument-memo.md`:

```markdown
# Argument Memo

## Thesis

## Why Now

## Mechanism

## Evidence Map

## Counterargument

## Reusable Frame

## Implication
```

- [ ] **Step 6: Create `red-team-review.md` template**

Create `tiles/blog-production/templates/workflow2/red-team-review.md`:

```markdown
# Red-Team Review

## AI-Like Or Generic Sections

## News Summary Without Original Judgment

## Claims That Need Stronger Evidence

## Paragraphs To Cut Or Merge

## Weak Counterargument Handling

## Missing Personal Or Operator Judgment

## Ending Quality

## Required Revisions

## Revision Notes
```

- [ ] **Step 7: Create `postmortem.md` template**

Create `tiles/blog-production/templates/workflow2/postmortem.md`:

```markdown
# Postmortem

## Prediction

## Actual 24h

## Actual 7d

## What Worked

## What Failed

## Workflow Lesson

## Next Experiment
```

- [ ] **Step 8: Create `canon-note.md` template**

Create `tiles/blog-production/templates/workflow2/canon-note.md`:

```markdown
# Canon Note

## Canonical Idea

## Reusable Frame

## Claims Added

## Claims Updated

## Internal Link Map

## Future Branches
```

- [ ] **Step 9: Commit templates**

Run:

```bash
git add tiles/blog-production/templates/workflow2
git commit -m "docs: add blog workflow 2 templates"
```

Expected: commit includes only files under `tiles/blog-production/templates/workflow2/`.

---

### Task 3: Implement Workflow 2 Artifact Generator

**Files:**
- Create: `tiles/blog-production/scripts/workflow2-artifacts.ts`
- Test: `tiles/blog-production/scripts/workflow2-artifacts.test.ts`

- [ ] **Step 1: Create the generator script**

Create `tiles/blog-production/scripts/workflow2-artifacts.ts`:

```ts
#!/usr/bin/env bun

import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";

export const WORKFLOW2_ARTIFACTS = [
  "idea.md",
  "memory-reflection.md",
  "editorial-brief.md",
  "research-dossier.md",
  "argument-memo.md",
  "red-team-review.md",
  "postmortem.md",
  "canon-note.md",
] as const;

export interface Workflow2ArtifactResult {
  blogDir: string;
  created: string[];
  skipped: string[];
}

function templateDir(): string {
  const currentFile = fileURLToPath(import.meta.url);
  return resolve(dirname(currentFile), "..", "templates", "workflow2");
}

export function createWorkflow2Artifacts(blogDirInput: string): Workflow2ArtifactResult {
  const blogDir = resolve(blogDirInput);
  mkdirSync(blogDir, { recursive: true });

  const created: string[] = [];
  const skipped: string[] = [];
  const templates = templateDir();

  for (const artifact of WORKFLOW2_ARTIFACTS) {
    const targetPath = join(blogDir, artifact);

    if (existsSync(targetPath)) {
      skipped.push(artifact);
      continue;
    }

    const sourcePath = join(templates, artifact);
    const template = readFileSync(sourcePath, "utf-8");
    writeFileSync(targetPath, template, "utf-8");
    created.push(artifact);
  }

  return { blogDir, created, skipped };
}

function readCliBlogDir(argv: string[]): string {
  const dirIndex = argv.indexOf("--dir");

  if (dirIndex === -1 || !argv[dirIndex + 1]) {
    throw new Error("Usage: bun workflow2-artifacts.ts --dir src/content/blogs/YYYY-MM-DD");
  }

  return argv[dirIndex + 1];
}

if (import.meta.main) {
  const result = createWorkflow2Artifacts(readCliBlogDir(process.argv.slice(2)));

  console.log(`Blog directory: ${result.blogDir}`);
  console.log(`Created: ${result.created.length ? result.created.join(", ") : "none"}`);
  console.log(`Skipped: ${result.skipped.length ? result.skipped.join(", ") : "none"}`);
}
```

- [ ] **Step 2: Run the artifact generator test**

Run:

```bash
npx -y bun test tiles/blog-production/scripts/workflow2-artifacts.test.ts
```

Expected: PASS.

- [ ] **Step 3: Smoke run the CLI against a temporary directory**

Run:

```bash
npx -y bun tiles/blog-production/scripts/workflow2-artifacts.ts --dir /tmp/blog-workflow2-smoke
```

Expected output includes:

```text
Created: idea.md, memory-reflection.md, editorial-brief.md, research-dossier.md, argument-memo.md, red-team-review.md, postmortem.md, canon-note.md
```

- [ ] **Step 4: Commit generator**

Run:

```bash
git add tiles/blog-production/scripts/workflow2-artifacts.ts tiles/blog-production/scripts/workflow2-artifacts.test.ts
git commit -m "feat: add blog workflow 2 artifact generator"
```

Expected: commit includes the generator and its test.

---

### Task 4: Add Blog Memory Strategy File

**Files:**
- Create: `src/content/strategy/blog-memory.md`

- [ ] **Step 1: Create the memory file**

Create `src/content/strategy/blog-memory.md`:

```markdown
# Blog Memory

This file is the lightweight global memory layer for Aaron's public writing.

It should capture reusable ideas, frameworks, internal link clusters, and recurring claims that future posts can extend, revise, or challenge.

## Canonical Ideas

## Reusable Frameworks

## Internal Link Clusters

## Claims To Revisit

## Future Branches
```

- [ ] **Step 2: Commit memory file**

Run:

```bash
git add src/content/strategy/blog-memory.md
git commit -m "docs: add blog memory strategy file"
```

Expected: commit includes only `src/content/strategy/blog-memory.md`.

---

### Task 5: Update Blog Production Orchestrator

**Files:**
- Modify: `tiles/blog-production/SKILL.md`

- [ ] **Step 1: Add new artifacts to the artifact contract**

In `tiles/blog-production/SKILL.md`, update the artifact table under `## Artifact Contract` so it includes these rows near the existing planning artifacts:

```markdown
| `memory-reflection.md` | prior-post reflection, internal link candidates, continuity thesis | blog-production / blog-brainstorm |
| `editorial-brief.md` | reader pain, sharp thesis, evidence need, counterargument, kill criteria | blog-brainstorm |
| `research-dossier.md` | sources, cases, facts, counterarguments, open questions | blog-brainstorm |
| `argument-memo.md` | thesis, mechanism, evidence map, counterargument, reusable frame | blog-outline |
| `red-team-review.md` | skeptical editorial review and required revisions | blog-write |
| `postmortem.md` | prediction, 24h/7d outcomes, workflow lesson, next experiment | blog-production |
| `canon-note.md` | canonical idea, reusable frame, claim updates, internal link map | blog-write / blog-production |
```

- [ ] **Step 2: Add Workflow 2 bootstrap command**

Add this subsection after `## Workflow` begins:

````markdown
### 0. Bootstrap Workflow 2 Artifacts

For serious essays, create missing manual-first Workflow 2 artifacts before writing begins:

```bash
npx -y bun tiles/blog-production/scripts/workflow2-artifacts.ts --dir src/content/blogs/YYYY-MM-DD
```

Never overwrite an existing artifact. If a file already exists, read and preserve it.
````

- [ ] **Step 3: Update next-step detection table**

In the `### 2. Detect the next step` table, add these rows before `no content-plan.md`:

```markdown
| serious essay and no `memory-reflection.md` | bootstrap Workflow 2 artifacts, then run Memory Reflection pass |
| serious essay and no `editorial-brief.md` | use `blog-brainstorm` to create editorial brief |
| serious essay and no `research-dossier.md` | use `blog-brainstorm` to create research dossier |
| serious essay and no `argument-memo.md` | use `blog-outline` to create argument memo and plan |
```

Add these rows after the article rows:

```markdown
| article exists but no `red-team-review.md` | use `blog-write` red-team revision pass |
| article exists but no `canon-note.md` | use `blog-write` canon note pass |
| published or ready-to-publish article has no `postmortem.md` | create postmortem template and record prediction |
```

- [ ] **Step 4: Add Workflow 2 quality gates**

Add this section under `### 4. Quality gates` before `Article depth gate`:

```markdown
**Workflow 2 editorial gates** — for serious essays, do not draft until these artifacts exist and are coherent:
- `memory-reflection.md` checks at least three prior posts when relevant and records internal link candidates or explains why no useful connection exists.
- `editorial-brief.md` names reader pain, sharp thesis, evidence needed, counterargument, reusable frame, distribution hook, and kill criteria.
- `research-dossier.md` contains source-backed evidence, cases, facts, counterarguments, and open questions.
- `argument-memo.md` maps thesis -> why now -> mechanism -> evidence -> counterargument -> reusable frame -> implication.

If any artifact is missing or weak, stop and run the focused phase instead of drafting.
```

Add this section after `Article depth gate`:

```markdown
**Red-team gate** — before final article package, create `red-team-review.md` and record at least five issues across generic prose, unsupported claims, weak structure, unfair counterargument, missing operator judgment, weak ending, or unnecessary paragraphs. Complete at least one substantive revision before moving to media assets.
```

Add this section before `Publishing gate`:

```markdown
**Memory update gate** — before publishing a serious essay, create or update `canon-note.md` with canonical idea, reusable frame, claims added, claims updated, internal link map, and future branches. Add useful internal links to the article only when they help the reader.
```

- [ ] **Step 5: Run workflow text tests**

Run:

```bash
npx -y bun test tiles/blog-write/scripts/blog-write-workflow.test.ts
```

Expected: existing tests still pass.

- [ ] **Step 6: Commit orchestrator update**

Run:

```bash
git add tiles/blog-production/SKILL.md
git commit -m "docs: add workflow 2 gates to blog production"
```

Expected: commit includes only `tiles/blog-production/SKILL.md`.

---

### Task 6: Update Blog Brainstorm For Editorial Brief And Research Dossier

**Files:**
- Modify: `tiles/blog-brainstorm/SKILL.md`

- [ ] **Step 1: Update outputs**

In `tiles/blog-brainstorm/SKILL.md`, replace the `## Output` table with:

```markdown
## Output

| File | Path | Purpose |
|------|------|---------|
| Idea | `src/content/blogs/YYYY-MM-DD/idea.md` | raw topic, reader pain, initial thesis, why now |
| Memory reflection | `src/content/blogs/YYYY-MM-DD/memory-reflection.md` | prior-post connections and internal link candidates |
| Editorial brief | `src/content/blogs/YYYY-MM-DD/editorial-brief.md` | reader pain, sharp thesis, evidence need, counterargument, reusable frame, distribution hook |
| Research dossier | `src/content/blogs/YYYY-MM-DD/research-dossier.md` | primary sources, secondary sources, cases, counterarguments, quotes, open questions |
| Content plan | `src/content/blogs/YYYY-MM-DD/content-plan.md` | structured plan for writing the blog post |
```

- [ ] **Step 2: Add memory reflection instructions**

After `### Step 2: Gather Context`, add:

```markdown
### Step 2b: Memory Reflection

Before web research for a serious essay, inspect at least three prior finished English posts under `src/content/blogs/*/*.md`, skipping `*-zh.md`, planning files, social files, and video files.

Write `memory-reflection.md` with:
- related past posts and why they matter;
- ideas to reuse;
- ideas to update;
- internal link candidates;
- continuity thesis.

Do not force internal links. If no useful link exists, state why.
```

- [ ] **Step 3: Add editorial brief and research dossier output rules**

Before `### Step 6: Output Content Plan`, add:

```markdown
### Step 5b: Output Editorial Brief And Research Dossier

Before `content-plan.md`, write:
- `editorial-brief.md`
- `research-dossier.md`

`editorial-brief.md` must include:
- reader pain;
- sharp thesis;
- why Aaron can write this;
- evidence needed;
- counterargument;
- reusable frame;
- distribution hook;
- kill criteria.

`research-dossier.md` must include:
- primary sources;
- secondary sources;
- cases;
- counterarguments;
- quotes and facts;
- open questions.
```

- [ ] **Step 4: Commit brainstorm update**

Run:

```bash
git add tiles/blog-brainstorm/SKILL.md
git commit -m "docs: add workflow 2 brainstorm artifacts"
```

Expected: commit includes only `tiles/blog-brainstorm/SKILL.md`.

---

### Task 7: Update Blog Outline For Argument Memo

**Files:**
- Modify: `tiles/blog-outline/SKILL.md`

- [ ] **Step 1: Update output table**

In `tiles/blog-outline/SKILL.md`, replace the `## Output` table with:

```markdown
## Output

| File | Path | Purpose |
|------|------|---------|
| Argument memo | `src/content/blogs/YYYY-MM-DD/argument-memo.md` | thesis, mechanism, evidence map, counterargument, reusable frame, implication |
| Outline | `src/content/blogs/YYYY-MM-DD/plan.md` | writing-ready structure, story beats, examples, and distribution intent |
```

- [ ] **Step 2: Update source priority**

In `### 1. Locate the source`, replace the source priority list with:

```markdown
1. `argument-memo.md`
2. `editorial-brief.md`
3. `research-dossier.md`
4. `memory-reflection.md`
5. `content-plan.md`
6. `idea.md`
7. existing `plan.md`
8. a rough idea from the user message
```

- [ ] **Step 3: Add argument memo writing section**

Before `### 3. Build the outline`, add:

````markdown
### 2b. Build The Argument Memo

For serious essays, write `argument-memo.md` before `plan.md`.

Use this structure:

```markdown
# Argument Memo

## Thesis

State one sentence specific enough that someone could disagree.

## Why Now

## Mechanism

## Evidence Map

## Counterargument

## Reusable Frame

## Implication
```

The memo must map thesis -> why now -> mechanism -> evidence -> counterargument -> reusable frame -> implication. If the research does not support the thesis, revise the thesis before creating `plan.md`.
````

- [ ] **Step 4: Commit outline update**

Run:

```bash
git add tiles/blog-outline/SKILL.md
git commit -m "docs: add argument memo to blog outline"
```

Expected: commit includes only `tiles/blog-outline/SKILL.md`.

---

### Task 8: Update Blog Write For Red-Team And Canon Notes

**Files:**
- Modify: `tiles/blog-write/SKILL.md`
- Modify: `tiles/blog-write/scripts/blog-write-workflow.test.ts`

- [ ] **Step 1: Add workflow test expectations**

In `tiles/blog-write/scripts/blog-write-workflow.test.ts`, add this test inside the existing `describe` block:

```ts
  test("requires workflow 2 editorial artifacts in the writing skill", () => {
    const writeSkill = readFileSync("tiles/blog-write/SKILL.md", "utf-8");
    const productionSkill = readFileSync("tiles/blog-production/SKILL.md", "utf-8");

    expect(writeSkill).toContain("memory-reflection.md");
    expect(writeSkill).toContain("editorial-brief.md");
    expect(writeSkill).toContain("research-dossier.md");
    expect(writeSkill).toContain("argument-memo.md");
    expect(writeSkill).toContain("red-team-review.md");
    expect(writeSkill).toContain("canon-note.md");
    expect(productionSkill).toContain("Workflow 2 editorial gates");
    expect(productionSkill).toContain("Red-team gate");
    expect(productionSkill).toContain("Memory update gate");
  });
```

- [ ] **Step 2: Run test to verify RED**

Run:

```bash
npx -y bun test tiles/blog-write/scripts/blog-write-workflow.test.ts
```

Expected: FAIL until `tiles/blog-write/SKILL.md` includes Workflow 2 artifact rules.

- [ ] **Step 3: Update blog-write output table**

In `tiles/blog-write/SKILL.md`, add these rows to the output table:

```markdown
| Red-team review | `src/content/blogs/YYYY-MM-DD/red-team-review.md` | Skeptical editorial review and required revisions |
| Canon note | `src/content/blogs/YYYY-MM-DD/canon-note.md` | Canonical idea, reusable frame, claim updates, internal link map |
```

- [ ] **Step 4: Update locate-plan instructions**

In `### 1. Locate the plan`, add this paragraph after the paragraph about `plan.md`, `content-plan.md`, and `idea.md`:

```markdown
For serious essays using Blog Workflow 2.0, also read `memory-reflection.md`, `editorial-brief.md`, `research-dossier.md`, and `argument-memo.md` when present. Treat them as editorial source material. If they are missing for a serious essay, report the gap and ask whether to continue with the lighter workflow.
```

- [ ] **Step 5: Add red-team pass instructions**

After `### 3c. Anti-AI style gate and Story craft gate`, add:

```markdown
### 3d. Red-Team Review

Before writing companion assets for a serious essay, create `red-team-review.md`.

It must include:
- AI-like or generic sections;
- news summary without original judgment;
- claims that need stronger evidence;
- paragraphs to cut or merge;
- weak counterargument handling;
- missing personal or operator judgment;
- ending quality;
- required revisions;
- revision notes.

Record at least five issues and complete at least one substantive revision before proceeding. A substantive revision changes argument, evidence, structure, rhythm, or the ending. It is not only wording polish.
```

- [ ] **Step 6: Add canon note instructions**

After `### 5. Draft distribution files`, add:

````markdown
### 5b. Canon Note

For serious essays, create `canon-note.md` before reporting the package complete.

Use this structure:

```markdown
# Canon Note

## Canonical Idea

## Reusable Frame

## Claims Added

## Claims Updated

## Internal Link Map

## Future Branches
```

The canon note should capture what this article adds to Aaron's long-term public writing memory. It should also record useful internal link opportunities without forcing links into the article.
````

- [ ] **Step 7: Run tests to verify GREEN**

Run:

```bash
npx -y bun test tiles/blog-write/scripts/blog-write-workflow.test.ts
```

Expected: PASS.

- [ ] **Step 8: Commit blog-write update**

Run:

```bash
git add tiles/blog-write/SKILL.md tiles/blog-write/scripts/blog-write-workflow.test.ts
git commit -m "docs: add workflow 2 writing gates"
```

Expected: commit includes the blog-write skill and its workflow test.

---

### Task 9: Update Aaron Video Gen Workflow Notes

**Files:**
- Modify: `tiles/aaron-video-gen/SKILL.md`

- [ ] **Step 1: Add video-native connection to Blog Workflow 2.0**

In `tiles/aaron-video-gen/SKILL.md`, under the section that describes video generation from blog scripts, add:

```markdown
### Blog Workflow 2.0 Video Standard

When rendering a serious essay from Blog Workflow 2.0, confirm:
- `video-brief.md` exists and is video-native, not a blog read-through;
- `youtube-script.md` adds visual and spoken value beyond the article;
- framework or process slides use motion only when the motion clarifies the argument;
- structured motion slides should not sit on a mostly blank stage while narration builds context;
- audio is reviewed as a listening product before final rendering when the voice changes.
```

- [ ] **Step 2: Run Remotion validation only if renderer code changed**

Do not run Remotion validation for this documentation-only task.

- [ ] **Step 3: Commit video workflow note**

Run:

```bash
git add tiles/aaron-video-gen/SKILL.md
git commit -m "docs: document workflow 2 video standard"
```

Expected: commit includes only `tiles/aaron-video-gen/SKILL.md`.

---

### Task 10: Verify Workflow 2 Plan Implementation

**Files:**
- Test: `tiles/blog-production/scripts/workflow2-artifacts.test.ts`
- Test: `tiles/blog-write/scripts/blog-write-workflow.test.ts`
- Verify: `tiles/blog-production/SKILL.md`
- Verify: `tiles/blog-brainstorm/SKILL.md`
- Verify: `tiles/blog-outline/SKILL.md`
- Verify: `tiles/blog-write/SKILL.md`
- Verify: `tiles/aaron-video-gen/SKILL.md`

- [ ] **Step 1: Run artifact generator tests**

Run:

```bash
npx -y bun test tiles/blog-production/scripts/workflow2-artifacts.test.ts
```

Expected: PASS.

- [ ] **Step 2: Run blog-write workflow tests**

Run:

```bash
npx -y bun test tiles/blog-write/scripts/blog-write-workflow.test.ts
```

Expected: PASS.

- [ ] **Step 3: Smoke-create Workflow 2 artifacts in a temp directory**

Run:

```bash
npx -y bun tiles/blog-production/scripts/workflow2-artifacts.ts --dir /tmp/blog-workflow2-smoke
```

Expected output includes:

```text
Blog directory: /tmp/blog-workflow2-smoke
Created: idea.md, memory-reflection.md, editorial-brief.md, research-dossier.md, argument-memo.md, red-team-review.md, postmortem.md, canon-note.md
Skipped: none
```

- [ ] **Step 4: Verify smoke-created files**

Run:

```bash
ls /tmp/blog-workflow2-smoke
```

Expected output includes:

```text
argument-memo.md
canon-note.md
editorial-brief.md
idea.md
memory-reflection.md
postmortem.md
red-team-review.md
research-dossier.md
```

- [ ] **Step 5: Confirm no unrelated files are staged**

Run:

```bash
git diff --cached --stat
```

Expected: empty output after all task commits.

---

## Self-Review Against Spec

Spec coverage:

- Topic Intake: Task 2 adds `idea.md`; Task 5 and Task 6 route it into workflow.
- Memory Reflection: Task 2 adds template; Task 5 and Task 6 require it.
- Editorial Brief: Task 2 adds template; Task 5 and Task 6 require it.
- Research Dossier: Task 2 adds template; Task 5 and Task 6 require it.
- Argument Memo: Task 2 adds template; Task 7 requires it before `plan.md`.
- Draft and Red-Team Review: Task 8 requires red-team review before companion assets.
- Final Article Package and Canon Note: Task 8 adds canon note rules.
- Video-Native Adaptation: Task 9 adds Workflow 2 video standard.
- Visual + Audio Production: Task 9 includes motion and audio checks.
- Postmortem and Memory Update: Task 2 adds templates; Task 5 adds gates; Task 4 adds global memory.

Deferred from this implementation:

- semantic search over previous posts;
- automatic internal link insertion;
- automatic backlink updates to older articles;
- metric-backed postmortem automation beyond existing blog-growth commands.

These are intentionally deferred because the spec recommends a manual-first phase before automation.
