# Remotion YouTube Scriptwriting Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deeply integrate the external Remotion best-practices skill and YouTube scriptwriting skill into Aaron's blog-to-video workflow so every video script and Remotion render passes concrete gates before generation.

**Architecture:** Add a scriptwriting layer before TTS/rendering and a Remotion engineering layer around the renderer. The scriptwriting layer produces/validates `video-brief.md`, `youtube-script.md`, and a new `youtube-script-audit.md`; the Remotion layer adds reusable renderer rules, static audits, and frame checks before full regeneration.

**Tech Stack:** Bun/TypeScript, Remotion 4, existing `aaron-video-gen` parser/renderer, Markdown workflow artifacts, `scripts/sync-agent-skills.sh`, `scripts/validate-workflows.sh`.

---

## Research Summary

External skills inspected:

- `remotion-dev/skills@remotion-best-practices`
  - Relevant rules: `timing.md`, `transitions.md`, `measuring-text.md`, `images.md`, `subtitles.md`, `display-captions.md`, `sequencing.md`, `audio.md`, `voiceover.md`.
  - Workflow impact: enforce frame-based animation, `TransitionSeries` duration math, text overflow checks, structured captions, audio timing, and Remotion-specific renderer validation.
- `cdeistopened/skill-stack@youtube-scriptwriting`
  - Relevant references: `research.md`, `hooks.md`, `structures.md`, `retention.md`, `editing.md`.
  - Workflow impact: require audience/emotion/promise, shock-score facts, hook type, story structure, rehooks, value loops, and three audits: story flow, comprehension, speed-to-value.

Current local findings:

- `src/content/blogs/2026-06-20/youtube-script.md` exists and uses rich image markers, but `video-brief.md` is missing.
- `aaron-video-gen` already uses Remotion, `TransitionSeries`, word timings, phrase captions, and progressive image switching.
- `aaron-video-gen` has no local test suite for script validation or Remotion rule validation yet.
- Existing narration rewrite is a polish layer; it does not receive `video-brief.md`, hook type, shock facts, retention beats, or banned phrase context.

## File Structure

Create:

- `src/content/strategy/youtube-scriptwriting-playbook.md`
  - Distilled local playbook from the external YouTube scriptwriting skill.
- `src/content/strategy/remotion-video-engineering.md`
  - Distilled local Remotion renderer rules and audit checklist.
- `tiles/aaron-video-gen/scripts/video-brief.ts`
  - Parse `video-brief.md` into structured fields.
- `tiles/aaron-video-gen/scripts/script-audit.ts`
  - Score `youtube-script.md` against the scriptwriting playbook.
- `tiles/aaron-video-gen/scripts/audit-script.ts`
  - CLI wrapper that writes `youtube-script-audit.md`.
- `tiles/aaron-video-gen/scripts/script-audit.test.ts`
  - Bun tests for the script audit.
- `tiles/aaron-video-gen/scripts/remotion-audit.ts`
  - Static Remotion rule audit for renderer source.
- `tiles/aaron-video-gen/scripts/remotion-audit.test.ts`
  - Bun tests for the Remotion audit.
- `tiles/aaron-video-gen/remotion/AGENTS.md`
  - Renderer-local guidance requiring Remotion best-practice checks before editing.

Modify:

- `src/content/strategy/youtube-video-language.md`
  - Promote external candidates from references to required workflow concepts.
- `tiles/blog-write/SKILL.md`
  - Require expanded `video-brief.md` schema and `youtube-script-audit.md`.
- `tiles/blog-production/SKILL.md`
  - Add new missing-artifact routing and gates.
- `tiles/aaron-video-gen/SKILL.md`
  - Require audit before TTS/render; require Remotion audit before renderer code changes.
- `tiles/aaron-video-gen/scripts/main.ts`
  - Add `--audit-only`, `--skip-script-audit`, `--audit-output`.
- `tiles/aaron-video-gen/scripts/rewrite-narration.ts`
  - Pass video brief and retention context into rewrite prompt; version cache keys.
- `tiles/aaron-video-gen/remotion/package.json`
  - Add `typecheck`, `audit`, and `validate` scripts.
- `scripts/validate-workflows.sh`
  - Verify new strategy docs and audit scripts exist.

---

### Task 1: Add Local Scriptwriting And Remotion Playbooks

**Files:**

- Create: `src/content/strategy/youtube-scriptwriting-playbook.md`
- Create: `src/content/strategy/remotion-video-engineering.md`
- Modify: `src/content/strategy/youtube-video-language.md`

- [ ] **Step 1: Create the scriptwriting playbook**

Write `src/content/strategy/youtube-scriptwriting-playbook.md` with these sections:

```markdown
# YouTube Scriptwriting Playbook

## Required Inputs

- Target audience
- Desired emotion
- Core promise
- Title/thumbnail expectation
- 5-10 high-shock facts or lived moments
- Hook type
- Story structure

## Hook Gate

The first 3-8 seconds must confirm the click and open a curiosity loop.
Choose one hook type: secret reveal, case study, comparison, question, education, list, contrarian, personal experience, or problem.

Every hook must state:
- Target: who this is for
- Transformation: what they gain
- Stakes: why staying matters

## Structure Gate

Choose one structure: breakdown, newscaster, case-study explainer, listicle, problem-solver, tutorial, or educational personal story.

For Aaron's blog videos, default to educational personal story or breakdown unless the post is clearly a tutorial.

## Retention Gate

Every 20-35 seconds, include one retention beat:
- rehook
- contrast
- setup/payoff
- example
- objection
- visual reset
- cold-open callback

## Audit Gate

Before rendering, run:
- Story flow audit
- Comprehension audit
- Speed-to-value audit
```

- [ ] **Step 2: Create the Remotion engineering playbook**

Write `src/content/strategy/remotion-video-engineering.md` with these sections:

```markdown
# Remotion Video Engineering

## Required Rules

- Use Remotion frame primitives: `useCurrentFrame`, `interpolate`, `Sequence`, `Series`, `TransitionSeries`.
- Do not use CSS transitions, CSS animations, or Tailwind animation classes inside Remotion compositions.
- Prefer `Easing.bezier(0.16, 1, 0.3, 1)` for crisp UI entrance and balanced `Easing.bezier(0.45, 0, 0.55, 1)` for editorial fades.
- Use `TransitionSeries` for between-scene transitions and subtract transition overlaps from duration calculations.
- Keep captions phrase-level and stable unless a short-form format explicitly needs word highlighting.
- Check text overflow for title cards, captions, chapter indicators, and thumbnail-like frames.

## Renderer Audit

Run the static Remotion audit before changing renderer code and after changing renderer code.
Run a still/frame check before accepting a full render when layout or timing changed.
```

- [ ] **Step 3: Update the video language file**

Modify `src/content/strategy/youtube-video-language.md` so its `Required Video Brief` section includes:

```markdown
- **Target audience:** specific viewer and what they already believe.
- **Desired emotion:** one primary feeling the video should transfer.
- **Core promise:** the value the viewer gets.
- **Title/thumbnail expectation:** what the viewer thinks they clicked for.
- **High-shock facts or lived moments:** 5-10 bullets with score or rationale.
- **Hook type:** one of the playbook hook types, with target/transformation/stakes.
- **Story structure:** one selected structure and why.
- **Retention beat map:** timestamp/beat/image idea every 20-35 seconds.
- **Audit status:** story flow, comprehension, speed-to-value.
```

- [ ] **Step 4: Verify docs**

Run:

```bash
rg -n "Hook Gate|Retention Gate|Renderer Audit|High-shock" src/content/strategy
git diff --check
```

Expected:

- `rg` finds the new playbook terms.
- `git diff --check` exits `0`.

---

### Task 2: Add Script Audit Parser And Tests

**Files:**

- Create: `tiles/aaron-video-gen/scripts/video-brief.ts`
- Create: `tiles/aaron-video-gen/scripts/script-audit.ts`
- Create: `tiles/aaron-video-gen/scripts/script-audit.test.ts`

- [ ] **Step 1: Write failing tests for missing brief and weak hook**

Create `tiles/aaron-video-gen/scripts/script-audit.test.ts`:

```ts
import { describe, expect, test } from "bun:test";
import { auditYoutubeScript } from "./script-audit";

const strongBrief = `# Video Brief

## Target Audience
AI-native builders who already use coding agents but have not turned them into a system.

## Desired Emotion
Possibility with sober control.

## Core Promise
You will see how AI stops being a tool and becomes a personal operating system.

## Title/Thumbnail Expectation
The viewer expects a real present-day workflow that feels like the future.

## High-Shock Facts
- 90: Aaron dispatched a Notion task from a moving Tesla.
- 85: Claude Code finished a 1.5 hour development run at the same time.

## Hook Type
Personal experience: target AI builders, transformation from tool to OS, stakes are time and leverage.

## Story Structure
Educational personal story.

## Retention Beat Map
- 0:00 personal scene
- 0:25 contrast tool vs operating system
- 0:55 concrete coding run

## Audit Status
Pending.
`;

test("fails when video brief is missing", () => {
  const result = auditYoutubeScript({
    scriptMarkdown: "# Title\n\n## [HOOK]\nTesla scene.\n\n## [SLIDE: One — 01.png]\nBody.",
    videoBriefMarkdown: "",
    imageCount: 1,
    estimatedDurationSec: 90,
  });
  expect(result.passed).toBe(false);
  expect(result.failures).toContain("video-brief.md is missing or empty");
});

test("fails when hook starts with a generic meta intro", () => {
  const result = auditYoutubeScript({
    scriptMarkdown: "# Title\n\n## [HOOK]\nIn today's video, let's dive in.\n\n## [SLIDE: One — 01.png]\nBody.",
    videoBriefMarkdown: strongBrief,
    imageCount: 1,
    estimatedDurationSec: 90,
  });
  expect(result.passed).toBe(false);
  expect(result.failures).toContain("hook uses banned meta-introduction language");
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
bun test tiles/aaron-video-gen/scripts/script-audit.test.ts
```

Expected: fails because `./script-audit` does not exist.

- [ ] **Step 3: Implement minimal video brief parser**

Create `tiles/aaron-video-gen/scripts/video-brief.ts`:

```ts
export interface ParsedVideoBrief {
  hasBrief: boolean;
  targetAudience?: string;
  desiredEmotion?: string;
  corePromise?: string;
  titleExpectation?: string;
  highShockFacts: string[];
  hookType?: string;
  storyStructure?: string;
  retentionBeats: string[];
}

function section(markdown: string, heading: string): string | undefined {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`^##\\s+${escaped}\\s*\\n([\\s\\S]*?)(?=^##\\s+|\\s*$)`, "im");
  const match = markdown.match(re);
  return match?.[1]?.trim();
}

export function parseVideoBrief(markdown: string): ParsedVideoBrief {
  const text = markdown.trim();
  return {
    hasBrief: text.length > 0,
    targetAudience: section(text, "Target Audience"),
    desiredEmotion: section(text, "Desired Emotion"),
    corePromise: section(text, "Core Promise"),
    titleExpectation: section(text, "Title/Thumbnail Expectation"),
    highShockFacts: (section(text, "High-Shock Facts") || "")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("-")),
    hookType: section(text, "Hook Type"),
    storyStructure: section(text, "Story Structure"),
    retentionBeats: (section(text, "Retention Beat Map") || "")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("-")),
  };
}
```

- [ ] **Step 4: Implement minimal script audit**

Create `tiles/aaron-video-gen/scripts/script-audit.ts`:

```ts
import { parseYoutubeScript } from "./parse-script";
import { parseVideoBrief } from "./video-brief";

export interface ScriptAuditInput {
  scriptMarkdown: string;
  videoBriefMarkdown: string;
  imageCount: number;
  estimatedDurationSec?: number;
}

export interface ScriptAuditResult {
  passed: boolean;
  failures: string[];
  warnings: string[];
  summaryMarkdown: string;
}

const BANNED_HOOK_PATTERNS = [
  /\bin today's video\b/i,
  /\blet'?s dive in\b/i,
  /\bwelcome back\b/i,
];

const BANNED_FILLER_PATTERNS = [
  /\bright\b/gi,
  /\byou know\b/gi,
  /\bbasically\b/gi,
  /what'?s interesting is/gi,
  /the real shift is/gi,
];

export function auditYoutubeScript(input: ScriptAuditInput): ScriptAuditResult {
  const failures: string[] = [];
  const warnings: string[] = [];
  const brief = parseVideoBrief(input.videoBriefMarkdown);
  const parsed = parseYoutubeScript(input.scriptMarkdown);

  if (!brief.hasBrief) failures.push("video-brief.md is missing or empty");
  if (!parsed.hookNarration) failures.push("script is missing ## [HOOK]");
  if (parsed.hookNarration && BANNED_HOOK_PATTERNS.some((p) => p.test(parsed.hookNarration!))) {
    failures.push("hook uses banned meta-introduction language");
  }

  if (brief.hasBrief) {
    if (!brief.targetAudience) failures.push("video brief missing Target Audience");
    if (!brief.desiredEmotion) failures.push("video brief missing Desired Emotion");
    if (!brief.corePromise) failures.push("video brief missing Core Promise");
    if (!brief.titleExpectation) failures.push("video brief missing Title/Thumbnail Expectation");
    if (brief.highShockFacts.length < 2) warnings.push("video brief has fewer than 2 high-shock facts");
    if (!brief.hookType) failures.push("video brief missing Hook Type");
    if (!brief.storyStructure) failures.push("video brief missing Story Structure");
    if (brief.retentionBeats.length < 3) warnings.push("video brief has fewer than 3 retention beats");
  }

  const wholeScript = input.scriptMarkdown;
  for (const pattern of BANNED_FILLER_PATTERNS) {
    const matches = wholeScript.match(pattern);
    if (matches && matches.length > 1) {
      failures.push(`repeated filler phrase: ${matches[0].toLowerCase()}`);
    }
  }

  const minImages =
    (input.estimatedDurationSec || 0) >= 300 ? 20 :
    (input.estimatedDurationSec || 0) >= 180 ? 16 :
    10;
  if (input.imageCount < minImages) {
    warnings.push(`image count ${input.imageCount} is below target ${minImages}`);
  }

  const passed = failures.length === 0;
  return {
    passed,
    failures,
    warnings,
    summaryMarkdown: [
      "# YouTube Script Audit",
      "",
      `Status: ${passed ? "PASS" : "FAIL"}`,
      "",
      "## Failures",
      failures.length ? failures.map((f) => `- ${f}`).join("\n") : "- none",
      "",
      "## Warnings",
      warnings.length ? warnings.map((w) => `- ${w}`).join("\n") : "- none",
      "",
      "## Source",
      "- YouTube scriptwriting playbook",
      "- Aaron YouTube video language",
    ].join("\n"),
  };
}
```

- [ ] **Step 5: Run tests to verify pass**

Run:

```bash
bun test tiles/aaron-video-gen/scripts/script-audit.test.ts
```

Expected: all tests pass.

---

### Task 3: Add Audit CLI And Wire Into Video Generator

**Files:**

- Create: `tiles/aaron-video-gen/scripts/audit-script.ts`
- Modify: `tiles/aaron-video-gen/scripts/main.ts`
- Modify: `tiles/aaron-video-gen/SKILL.md`

- [ ] **Step 1: Create audit CLI**

Create `tiles/aaron-video-gen/scripts/audit-script.ts`:

```ts
#!/usr/bin/env bun
import { existsSync, readFileSync, writeFileSync } from "fs";
import { dirname, join, resolve } from "path";
import { auditYoutubeScript } from "./script-audit";

const scriptArgIndex = process.argv.indexOf("--script");
if (scriptArgIndex === -1 || !process.argv[scriptArgIndex + 1]) {
  console.error("Usage: bun audit-script.ts --script <youtube-script.md>");
  process.exit(1);
}

const scriptPath = resolve(process.argv[scriptArgIndex + 1]);
const postDir = dirname(scriptPath);
const briefPath = join(postDir, "video-brief.md");
const auditPath = join(postDir, "youtube-script-audit.md");

const scriptMarkdown = readFileSync(scriptPath, "utf-8");
const videoBriefMarkdown = existsSync(briefPath) ? readFileSync(briefPath, "utf-8") : "";
const imageCount = (scriptMarkdown.match(/\[IMAGE:\s*[^]]+\]|##\s*\[SLIDE:/g) || []).length;

const result = auditYoutubeScript({
  scriptMarkdown,
  videoBriefMarkdown,
  imageCount,
});

writeFileSync(auditPath, result.summaryMarkdown, "utf-8");
console.log(`[audit] ${result.passed ? "PASS" : "FAIL"} -> ${auditPath}`);
if (!result.passed) process.exit(2);
```

- [ ] **Step 2: Add main.ts flags**

In `parseArgs()` in `tiles/aaron-video-gen/scripts/main.ts`, add:

```ts
} else if (arg === "--audit-only") {
  args.auditOnly = "true";
} else if (arg === "--skip-script-audit") {
  args.skipScriptAudit = "true";
}
```

- [ ] **Step 3: Run audit before rewrite/TTS**

After parsing the script in `main.ts`, add:

```ts
if (args.skipScriptAudit !== "true") {
  const { auditYoutubeScript } = await import("./script-audit");
  const briefPath = join(scriptDir, "video-brief.md");
  const briefMarkdown = existsSync(briefPath) ? readFileSync(briefPath, "utf-8") : "";
  const imageCount = (scriptContent.match(/\[IMAGE:\s*[^]]+\]|##\s*\[SLIDE:/g) || []).length;
  const audit = auditYoutubeScript({
    scriptMarkdown: scriptContent,
    videoBriefMarkdown: briefMarkdown,
    imageCount,
  });
  const auditPath = join(scriptDir, "youtube-script-audit.md");
  writeFileSync(auditPath, audit.summaryMarkdown, "utf-8");
  console.log(`[audit] ${audit.passed ? "PASS" : "FAIL"} -> ${auditPath}`);
  if (args.auditOnly === "true") process.exit(audit.passed ? 0 : 2);
  if (!audit.passed) {
    throw new Error("YouTube script audit failed. Fix youtube-script.md or run with --skip-script-audit for an explicit override.");
  }
}
```

- [ ] **Step 4: Verify audit-only behavior**

Run on the current 2026-06-20 post:

```bash
npx -y bun tiles/aaron-video-gen/scripts/main.ts \
  --script src/content/blogs/2026-06-20/youtube-script.md \
  --audit-only
```

Expected before fixing that post: exits non-zero because `video-brief.md` is missing, and writes `src/content/blogs/2026-06-20/youtube-script-audit.md`.

---

### Task 4: Make Narration Rewrite Use Video Brief And Retention Context

**Files:**

- Modify: `tiles/aaron-video-gen/scripts/rewrite-narration.ts`
- Modify: `tiles/aaron-video-gen/scripts/main.ts`
- Create or modify: `tiles/aaron-video-gen/scripts/rewrite-narration.test.ts`

- [ ] **Step 1: Expose prompt builder for testing**

In `rewrite-narration.ts`, add:

```ts
export interface RewriteContext {
  corePromise?: string;
  hookType?: string;
  storyStructure?: string;
  desiredEmotion?: string;
  bannedPhrases?: string[];
  retentionBeats?: string[];
}

export function buildRewriteUserPrompt(
  text: string,
  slideTitle: string,
  previousOpenings: string[] = [],
  context: RewriteContext = {}
): string {
  return [
    `Slide title: "${slideTitle}"`,
    context.corePromise ? `Core promise: ${context.corePromise}` : "",
    context.hookType ? `Hook type: ${context.hookType}` : "",
    context.storyStructure ? `Story structure: ${context.storyStructure}` : "",
    context.desiredEmotion ? `Desired emotion: ${context.desiredEmotion}` : "",
    context.retentionBeats?.length ? `Retention beats to preserve:\n${context.retentionBeats.map((b) => `- ${b}`).join("\n")}` : "",
    context.bannedPhrases?.length ? `Banned phrases:\n${context.bannedPhrases.map((p) => `- ${p}`).join("\n")}` : "",
    previousOpenings.length ? `Previous openings and transitions to avoid:\n${previousOpenings.map((o) => `- "${o}"`).join("\n")}` : "",
    "Narration to rewrite:",
    text,
  ].filter(Boolean).join("\n\n");
}
```

- [ ] **Step 2: Add a failing prompt test**

Create `tiles/aaron-video-gen/scripts/rewrite-narration.test.ts`:

```ts
import { expect, test } from "bun:test";
import { buildRewriteUserPrompt } from "./rewrite-narration";

test("rewrite prompt includes video promise and banned phrases", () => {
  const prompt = buildRewriteUserPrompt("Body", "Slide", [], {
    corePromise: "AI becomes a personal operating system",
    bannedPhrases: ["right", "you know"],
    retentionBeats: ["0:25 contrast tool vs OS"],
  });
  expect(prompt).toContain("AI becomes a personal operating system");
  expect(prompt).toContain("right");
  expect(prompt).toContain("0:25 contrast tool vs OS");
});
```

- [ ] **Step 3: Thread context from main.ts**

In `main.ts`, parse the brief once:

```ts
const { parseVideoBrief } = await import("./video-brief");
const videoBriefPath = join(scriptDir, "video-brief.md");
const videoBrief = parseVideoBrief(
  existsSync(videoBriefPath) ? readFileSync(videoBriefPath, "utf-8") : ""
);
```

When calling `rewriteAllNarrations`, pass context:

```ts
const rewriteContext = {
  corePromise: videoBrief.corePromise,
  hookType: videoBrief.hookType,
  storyStructure: videoBrief.storyStructure,
  desiredEmotion: videoBrief.desiredEmotion,
  bannedPhrases: ["right", "you know", "basically", "let's dive in", "in today's video"],
  retentionBeats: videoBrief.retentionBeats,
};
const rewritten = await rewriteAllNarrations(uncachedSlides, rewriteContext);
```

- [ ] **Step 4: Version rewrite cache**

Change `rewriteCacheKey()` in `main.ts` to include a prompt version:

```ts
const REWRITE_PROMPT_VERSION = "yt-scriptwriting-v1";
function rewriteCacheKey(originalText: string, slideIndex: number): string {
  const hash = createHash("md5")
    .update(`${REWRITE_PROMPT_VERSION}|${originalText}`)
    .digest("hex")
    .slice(0, 12);
  return `rewrite-${String(slideIndex).padStart(2, "0")}-${hash}`;
}
```

- [ ] **Step 5: Verify rewrite tests**

Run:

```bash
bun test tiles/aaron-video-gen/scripts/rewrite-narration.test.ts
```

Expected: pass.

---

### Task 5: Add Remotion Engineering Audit

**Files:**

- Create: `tiles/aaron-video-gen/scripts/remotion-audit.ts`
- Create: `tiles/aaron-video-gen/scripts/remotion-audit.test.ts`
- Create: `tiles/aaron-video-gen/remotion/AGENTS.md`
- Modify: `tiles/aaron-video-gen/remotion/package.json`

- [ ] **Step 1: Write failing Remotion audit tests**

Create `tiles/aaron-video-gen/scripts/remotion-audit.test.ts`:

```ts
import { expect, test } from "bun:test";
import { auditRemotionSourceText } from "./remotion-audit";

test("flags CSS transitions in Remotion components", () => {
  const result = auditRemotionSourceText("Bad.tsx", "const style = { transition: 'opacity 1s' };");
  expect(result.failures).toContain("Bad.tsx uses CSS transition/animation instead of frame-based Remotion animation");
});

test("allows frame-based interpolate animation", () => {
  const result = auditRemotionSourceText("Good.tsx", "const opacity = interpolate(frame, [0, 10], [0, 1]);");
  expect(result.failures).toEqual([]);
});
```

- [ ] **Step 2: Implement static audit**

Create `tiles/aaron-video-gen/scripts/remotion-audit.ts`:

```ts
#!/usr/bin/env bun
import { existsSync, readFileSync, readdirSync } from "fs";
import { join } from "path";

export interface RemotionAuditResult {
  failures: string[];
  warnings: string[];
}

export function auditRemotionSourceText(file: string, text: string): RemotionAuditResult {
  const failures: string[] = [];
  const warnings: string[] = [];

  if (/\btransition\s*:|animation\s*:|animate-/.test(text)) {
    failures.push(`${file} uses CSS transition/animation instead of frame-based Remotion animation`);
  }
  if (/useCurrentFrame|interpolate|spring|TransitionSeries|Sequence/.test(text) === false && file.endsWith(".tsx")) {
    warnings.push(`${file} has no obvious Remotion timing primitive`);
  }
  if (/per-character opacity|split\(""\).*opacity/i.test(text)) {
    failures.push(`${file} appears to use per-character opacity for text animation`);
  }

  return { failures, warnings };
}

function listTsxFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return listTsxFiles(path);
    return entry.name.endsWith(".tsx") ? [path] : [];
  });
}

if (import.meta.main) {
  const root = join(import.meta.dir, "..", "remotion", "src");
  if (!existsSync(root)) {
    console.error(`[remotion-audit] missing ${root}`);
    process.exit(1);
  }
  const combined = { failures: [] as string[], warnings: [] as string[] };
  for (const file of listTsxFiles(root)) {
    const result = auditRemotionSourceText(file, readFileSync(file, "utf-8"));
    combined.failures.push(...result.failures);
    combined.warnings.push(...result.warnings);
  }
  for (const warning of combined.warnings) console.warn(`[warn] ${warning}`);
  for (const failure of combined.failures) console.error(`[fail] ${failure}`);
  process.exit(combined.failures.length ? 2 : 0);
}
```

- [ ] **Step 3: Add renderer-local AGENTS.md**

Create `tiles/aaron-video-gen/remotion/AGENTS.md`:

```markdown
# Remotion Renderer Rules

Before changing renderer code, consult `src/content/strategy/remotion-video-engineering.md`.

Required checks:

- Use Remotion frame primitives instead of CSS transitions or CSS animations.
- Keep caption display stable and phrase-level unless explicitly building a short-form karaoke caption style.
- Account for `TransitionSeries` overlap when computing durations.
- Run `npm run validate` from this directory after renderer changes.
```

- [ ] **Step 4: Add package scripts**

Modify `tiles/aaron-video-gen/remotion/package.json`:

```json
{
  "scripts": {
    "studio": "npx remotion studio src/index.ts",
    "render": "npx remotion render src/index.ts SlideshowVideo",
    "typecheck": "tsc --noEmit",
    "audit": "bun ../scripts/remotion-audit.ts",
    "validate": "npm run typecheck && npm run audit"
  }
}
```

- [ ] **Step 5: Verify Remotion audit**

Run:

```bash
bun test tiles/aaron-video-gen/scripts/remotion-audit.test.ts
cd tiles/aaron-video-gen/remotion && npm run validate
```

Expected: tests pass and `npm run validate` exits `0` after any real renderer issues are fixed.

---

### Task 6: Promote New Gates Into Blog Workflow Skills

**Files:**

- Modify: `tiles/blog-write/SKILL.md`
- Modify: `tiles/blog-production/SKILL.md`
- Modify: `tiles/aaron-video-gen/SKILL.md`
- Modify: `scripts/validate-workflows.sh`

- [ ] **Step 1: Update blog-write video artifact rules**

In `tiles/blog-write/SKILL.md`, replace the current `video-brief.md` bullet list with the expanded schema from Task 1. Add:

```markdown
`youtube-script-audit.md`:
- Must be generated before rendering.
- Must pass story flow, comprehension, and speed-to-value gates.
- If it fails, revise `video-brief.md` or `youtube-script.md`; do not rely on the TTS rewrite to fix it.
```

- [ ] **Step 2: Update blog-production artifact contract**

Add row:

```markdown
| `youtube-script-audit.md` | scriptwriting gate result | blog-write / aaron-video-gen |
```

Add routing:

```markdown
| `youtube-script.md` exists but no `youtube-script-audit.md` | use `aaron-video-gen --audit-only` or `blog-write` video adaptation pass |
| `youtube-script-audit.md` fails | use `blog-write` video adaptation pass |
```

- [ ] **Step 3: Update aaron-video-gen preflight**

Add:

```markdown
Before TTS or rendering, run the script audit. Rendering without a passing audit requires an explicit `--skip-script-audit` override and should be reported to Aaron.
```

Add:

```markdown
Before editing Remotion renderer code, read `src/content/strategy/remotion-video-engineering.md` and run `cd tiles/aaron-video-gen/remotion && npm run validate` after changes.
```

- [ ] **Step 4: Update workflow validation**

In `scripts/validate-workflows.sh`, add:

```bash
require_file "src/content/strategy/youtube-scriptwriting-playbook.md"
require_file "src/content/strategy/remotion-video-engineering.md"
require_file "tiles/aaron-video-gen/scripts/audit-script.ts"
require_file "tiles/aaron-video-gen/scripts/script-audit.ts"
require_file "tiles/aaron-video-gen/scripts/remotion-audit.ts"
```

- [ ] **Step 5: Sync skills and validate**

Run:

```bash
scripts/sync-agent-skills.sh
scripts/validate-workflows.sh
git diff --check
```

Expected: all commands exit `0`.

---

### Task 7: Rebuild The 2026-06-20 Video As A Controlled Experiment

**Files:**

- Create: `src/content/blogs/2026-06-20/video-brief.md`
- Create: `src/content/blogs/2026-06-20/youtube-script-audit.md`
- Modify or create candidate: `src/content/blogs/2026-06-20/youtube-script-v2.md`
- Create output: `src/content/blogs/2026-06-20/video-v2-remotion-scriptwriting.mp4`

- [ ] **Step 1: Create the missing video brief**

Use the article and current script to create `video-brief.md` with the expanded schema:

```markdown
# Video Brief

## Target Audience
AI-native builders, founders, and operators who already use AI tools but have not turned them into a repeatable operating system.

## Desired Emotion
Near-future immediacy with grounded agency.

## Core Promise
This is how AI stops being a collection of tools and becomes a personal operating system for real work.

## Title/Thumbnail Expectation
The viewer clicked expecting a concrete present-day workflow that sounds futuristic but is already happening.

## High-Shock Facts
- 95: Aaron gave Codex a Notion task from a moving Tesla.
- 90: Claude Code finished a 1.5 hour development task at the same time.
- 85: Agents route work to home workstations, cloud machines, subagents, websites, and APIs.
- 80: The workflow now covers blogs, images, videos, admin, analytics, and daily operations.

## Hook Type
Personal experience plus comparison: target AI-native builders, transformation from tool to operating system, stakes are time, leverage, and judgment.

## Story Structure
Educational personal story: concrete scene, contrast, expansion beyond coding, operating loop, self-enhancement, human payoff.

## Retention Beat Map
- 0:00 Tesla scene and simultaneous Claude run.
- 0:25 tool vs operating system contrast.
- 0:55 coding run as first proof.
- 1:30 work escapes the IDE.
- 2:10 operating loop.
- 3:00 self-enhancement layer.
- 4:00 judgment moves up.
- 5:00 life gets bigger.

## What The Video Adds
- Shows the Notion dispatch moment as a working scene, not just an anecdote.
- Makes the operating-system metaphor visible through the workflow loop.
- Names the risk: bad delegation gets expensive faster.

## Banned Phrases
- right
- you know
- basically
- let's dive in
- in today's video
- what's interesting is

## Ending
The durable edge is building a better human-agent operating system that leaves the most human work to the human.

## Audit Status
Pending.
```

- [ ] **Step 2: Produce a v2 script instead of overwriting first**

Copy current script:

```bash
cp src/content/blogs/2026-06-20/youtube-script.md \
  src/content/blogs/2026-06-20/youtube-script-v2.md
```

Revise `youtube-script-v2.md` so:

- Hook confirms title/thumbnail in first 3-8 seconds.
- Slide 1 does not restate the blog thesis; it extends the Tesla scene into the OS contrast.
- Each slide contains at least one retention beat.
- Filler phrases stay below one occurrence each.

- [ ] **Step 3: Audit v2**

Run:

```bash
npx -y bun tiles/aaron-video-gen/scripts/audit-script.ts \
  --script src/content/blogs/2026-06-20/youtube-script-v2.md
```

Expected: writes `youtube-script-audit.md` and exits `0`.

- [ ] **Step 4: Render v2 without touching published video**

Run:

```bash
npx -y bun tiles/aaron-video-gen/scripts/main.ts \
  --script src/content/blogs/2026-06-20/youtube-script-v2.md \
  --output src/content/blogs/2026-06-20/video-v2-remotion-scriptwriting.mp4 \
  --renderer remotion \
  --tts elevenlabs \
  --voice 991lF4hc0xxfec4Y6B0i \
  --speed 1.1 \
  --logo assets/aaron-logo-assets/ag-logo.png \
  --slogan "AI-native builder. Human-first thinker." \
  --website aaronguo.com \
  --cover src/content/blogs/2026-06-20/imgs/00-cover-thumbnail-v2-youtube.jpg
```

Expected: creates the v2 MP4 while leaving `video.mp4` untouched.

- [ ] **Step 5: Extract review frames**

Run:

```bash
mkdir -p src/content/blogs/2026-06-20/imgs/video-v2-check
ffmpeg -y -ss 3 -i src/content/blogs/2026-06-20/video-v2-remotion-scriptwriting.mp4 -frames:v 1 src/content/blogs/2026-06-20/imgs/video-v2-check/frame-3s.jpg
ffmpeg -y -ss 25 -i src/content/blogs/2026-06-20/video-v2-remotion-scriptwriting.mp4 -frames:v 1 src/content/blogs/2026-06-20/imgs/video-v2-check/frame-25s.jpg
ffmpeg -y -ss 60 -i src/content/blogs/2026-06-20/video-v2-remotion-scriptwriting.mp4 -frames:v 1 src/content/blogs/2026-06-20/imgs/video-v2-check/frame-60s.jpg
ffmpeg -y -ss 180 -i src/content/blogs/2026-06-20/video-v2-remotion-scriptwriting.mp4 -frames:v 1 src/content/blogs/2026-06-20/imgs/video-v2-check/frame-180s.jpg
```

Expected: four frames exist for visual review.

- [ ] **Step 6: Compare v1 vs v2**

Create a short comparison note in the final response:

```text
V1: existing published video.
V2: scriptwriting-audited and Remotion-audited version.
Changed: hook, retention beat map, rewrite prompt context, renderer validation.
Review request: watch first 60 seconds first; if it feels stronger, review the full video.
```

---

## Self-Review Checklist

- Spec coverage:
  - Remotion skill integrated through renderer rules, static audit, package validation, and v2 render checks.
  - YouTube scriptwriting skill integrated through video brief schema, script audit, rewrite context, and blog-production routing.
  - Current pain point addressed: video should stop feeling like the blog being read aloud.
  - User instruction honored: no immediate regeneration before research and integration plan.
- Placeholder scan:
  - No task contains `TBD`, `TODO`, or vague "add tests" language.
  - The experimental video output is separate from the existing published `video.mp4`.
- Type consistency:
  - `ParsedVideoBrief`, `ScriptAuditInput`, `ScriptAuditResult`, and `RewriteContext` are defined before use.
  - CLI names match task commands: `audit-script.ts`, `remotion-audit.ts`, `main.ts --audit-only`.

## Execution Options

1. **Subagent-Driven (recommended)** - Implement one task at a time with review after each task.
2. **Inline Execution** - Implement in this session with checkpoints after docs, script audit, Remotion audit, and v2 render.
