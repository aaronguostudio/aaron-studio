import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  detectHookCandidates,
  handleHookStart,
  handleHookStop,
  listHookInbox,
} from "./asset-hook.mjs";

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "asset-hook-"));
  mkdirSync(join(root, "config"), { recursive: true });
  mkdirSync(join(root, "src/content/music-visualizer/new-track"), { recursive: true });
  mkdirSync(join(root, "src/content/blogs/post/imgs"), { recursive: true });
  mkdirSync(join(root, "src/content/videos/video/assets"), { recursive: true });
  writeFileSync(join(root, "config/aaron-studio.json"), JSON.stringify({
    assetLibrary: {
      catalogRoot: "src/content/asset-library",
      hook: {
        enabled: true,
        candidateRoots: ["src/content/music-visualizer", "src/content/blogs", "src/content/videos"],
        maxCandidatesPerTurn: 20,
        clockSkewMs: 100,
      },
    },
  }));
  return root;
}

test("detects manifested music while ignoring ordinary project images", (t) => {
  const root = fixture();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const startedAtMs = Date.now() - 1_000;
  const audio = join(root, "src/content/music-visualizer/new-track/music.mp3");
  writeFileSync(audio, "audio");
  writeFileSync(join(root, "src/content/music-visualizer/new-track/generation-manifest.json"), JSON.stringify({
    title: "New Track",
    audioPath: audio,
    commercialUseNote: "Verify license before commercial publication.",
  }));
  writeFileSync(join(root, "src/content/blogs/post/imgs/cover.png"), "project image");

  const candidates = detectHookCandidates({ repoRoot: root, startedAtMs });
  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].kind, "music");
  assert.equal(candidates[0].policy, "auto");
  assert.equal(candidates[0].rights_status, "needs-verification");
  assert.equal(candidates[0].path, "src/content/music-visualizer/new-track/music.mp3");
});

test("explicit manifest policy can suggest a generic project image", (t) => {
  const root = fixture();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const startedAtMs = Date.now() - 1_000;
  const image = join(root, "src/content/videos/video/assets/texture.png");
  writeFileSync(image, "generic texture");
  writeFileSync(join(root, "src/content/videos/video/assets/generation-manifest.json"), JSON.stringify({
    outputPath: image,
    asset_library: { policy: "suggest", scope: "generic", kind: "image" },
  }));

  const candidates = detectHookCandidates({ repoRoot: root, startedAtMs });
  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].kind, "image");
  assert.equal(candidates[0].policy, "suggest");
});

test("turn hooks append candidates once and remain idempotent", (t) => {
  const root = fixture();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const input = { session_id: "session-1", turn_id: "turn-1", cwd: root };
  handleHookStart(input, Date.now() - 1_000);
  const audio = join(root, "src/content/music-visualizer/new-track/music.mp3");
  writeFileSync(audio, "audio");
  writeFileSync(join(root, "src/content/music-visualizer/new-track/generation-manifest.json"), JSON.stringify({ audioPath: audio }));

  const first = handleHookStop(input);
  assert.equal(first.added.length, 1);
  assert.equal(listHookInbox(root).length, 1);
  const second = handleHookStop(input);
  assert.equal(second.handled, false);
  assert.equal(listHookInbox(root).length, 1);
});
