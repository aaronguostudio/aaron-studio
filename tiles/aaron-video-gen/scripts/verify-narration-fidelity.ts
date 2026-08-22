/**
 * Narration fidelity gate: verify that the assembled TTS narration for every
 * slide is word-for-word identical to the youtube-script.md text.
 *
 * The narration assembler builds each slide's spoken text from conversational-
 * rewrite chunks mapped onto [IMAGE:]-marker segments. When the chunk count
 * drifts from the segment count, it has historically failed SILENTLY in three
 * ways (2026-08-15/16, deepseek-harness-teardown production):
 *   - dropped trailing segments (rewrite emitted more chunks than segments);
 *   - leaked a literal "---SEGMENT---" delimiter into the spoken text;
 *   - duplicated trailing segments (rewrite emitted fewer chunks than segments).
 * Tail inspection does not catch these; only a full word-stream comparison does.
 *
 * Usage:
 *   bun tiles/aaron-video-gen/scripts/verify-narration-fidelity.ts \
 *     --script <blog-dir>/youtube-script.md [--cache <blog-dir>/.video-gen-cache]
 *
 * For each slide (hook + slides in order) the gate selects, among the cache's
 * narration-<key>-*.json candidates, the newest file whose word stream matches
 * the script. Exit 0 only when every slide has a matching take; otherwise print
 * a word-level diff summary for the closest candidate and exit 1.
 */
import { readFileSync, readdirSync, statSync } from "fs";
import { join, dirname } from "path";

function parseArgs(): { script: string; cache: string } {
  const args = process.argv.slice(2);
  let script = "";
  let cache = "";
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--script") script = args[++i];
    else if (args[i] === "--cache") cache = args[++i];
  }
  if (!script) {
    console.error("--script <youtube-script.md> is required");
    process.exit(2);
  }
  if (!cache) cache = join(dirname(script), ".video-gen-cache");
  return { script, cache };
}

/** Split the script into per-slide narration word streams, IMAGE markers and dividers stripped. */
function scriptSlideWords(scriptPath: string): { key: string; words: string[] }[] {
  const content = readFileSync(scriptPath, "utf-8");
  const headerRe = /^##\s*\[(HOOK|SLIDE)[^\]]*\]\s*$/gm;
  const blocks = content.split(headerRe).slice(1);
  // split() with a capturing group interleaves [captured, body, captured, body, ...]
  const slides: { key: string; words: string[] }[] = [];
  let slideIndex = 0;
  for (let i = 0; i + 1 < blocks.length; i += 2) {
    const kind = blocks[i];
    const body = blocks[i + 1]
      .replace(/^\[IMAGE:[^\]]*\]\s*$/gm, " ")
      .replace(/^---\s*$/gm, " ");
    const key = kind === "HOOK" ? "hook" : String(slideIndex++).padStart(2, "0");
    slides.push({ key, words: body.split(/\s+/).filter(Boolean) });
  }
  return slides;
}

function narrationWords(file: string): string[] {
  const data = JSON.parse(readFileSync(file, "utf-8"));
  const timings: { word: string }[] = data.wordTimings ?? [];
  return timings
    .flatMap((w) => w.word.split(/\s+/))
    .filter(Boolean);
}

function firstDivergence(a: string[], b: string[]): string {
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    if (a[i] !== b[i]) {
      return `first divergence at word ${i}: script '${a.slice(i, i + 8).join(" ")}' vs spoken '${b.slice(i, i + 8).join(" ")}'`;
    }
  }
  if (a.length !== b.length) {
    const extra = b.length > a.length ? b.slice(n, n + 12).join(" ") : a.slice(n, n + 12).join(" ");
    return `lengths differ (script ${a.length}w vs spoken ${b.length}w); ${b.length > a.length ? "spoken extra" : "script extra"}: '${extra}…'`;
  }
  return "streams identical";
}

const { script, cache } = parseArgs();
const slides = scriptSlideWords(script);
let failed = false;

for (const { key, words } of slides) {
  const candidates = readdirSync(cache)
    .filter((f) => f.startsWith(`narration-${key}-`) && f.endsWith(".json"))
    .map((f) => join(cache, f))
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
  if (candidates.length === 0) {
    console.error(`[FAIL] ${key}: no narration cache files found`);
    failed = true;
    continue;
  }
  const match = candidates.find((f) => {
    const spoken = narrationWords(f);
    return spoken.length === words.length && spoken.every((w, i) => w === words[i]);
  });
  if (match) {
    console.log(`[ok] ${key}: ${match.split("/").pop()} matches script (${words.length}w)`);
  } else {
    failed = true;
    const closest = candidates[0];
    console.error(`[FAIL] ${key}: no cached take matches the script; newest candidate ${closest.split("/").pop()}:`);
    console.error(`       ${firstDivergence(words, narrationWords(closest))}`);
  }
}

if (failed) {
  console.error("\nNarration fidelity gate: FAIL — do not render; regenerate the failing slides (delete their rewrite + narration cache entries) and re-run.");
  process.exit(1);
}
console.log("\nNarration fidelity gate: PASS");
