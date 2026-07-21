import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  curateAsset,
  recordUsage,
  scanLibrary,
  searchAssets,
  showAsset,
  validateCatalog,
} from "./library.mjs";

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "asset-library-"));
  const content = join(root, "src/content/music-visualizer");
  const first = join(content, "quiet-piano/music.mp3");
  const duplicate = join(content, "spectrum-demos-v1/linear/music.mp3");
  mkdirSync(join(root, "config"), { recursive: true });
  mkdirSync(join(content, "quiet-piano"), { recursive: true });
  mkdirSync(join(content, "spectrum-demos-v1/linear"), { recursive: true });
  writeFileSync(first, "same-audio-content");
  writeFileSync(duplicate, "same-audio-content");
  writeFileSync(join(content, "quiet-piano/generation-manifest.json"), JSON.stringify({
    title: "Quiet Piano Study",
    prompt: "Instrumental only. Calm quiet minimalist felt piano for reading and deep work. No vocals.",
    audioPath: first,
    commercialUseNote: "Verify license before commercial publication.",
  }));
  writeFileSync(join(content, "spectrum-demos-v1/catalog.json"), JSON.stringify({
    sharedAnalysis: { fps: 30 },
    sourceReference: { url: "https://example.com/source" },
    availableSkins: [],
    styles: [{ id: "spectrum-bars", slug: "linear", name: "Linear Bars", family: "linear", sourceEvidence: "Test preset" }],
  }));
  writeFileSync(join(content, "spectrum-demos-v1/linear/render-config.json"), "{}");
  writeFileSync(join(root, "config/aaron-studio.json"), JSON.stringify({
    contentRoot: "src/content",
    assetLibrary: {
      catalogRoot: "src/content/asset-library",
      databasePath: ".cache/asset-library/assets.sqlite",
      scanRoots: ["src/content/music-visualizer"],
      spectrumCatalog: "src/content/music-visualizer/spectrum-demos-v1/catalog.json",
      defaultStatuses: ["approved", "candidate"],
      hashConcurrency: 2,
      excludePathSegments: [],
    },
  }));
  return root;
}

test("scan deduplicates copied audio and links the visualizer preset", async (t) => {
  const root = fixture();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const { assets, summary } = await scanLibrary({ repoRoot: root });
  const music = assets.find((asset) => asset.type === "music");
  const visualizer = assets.find((asset) => asset.type === "visualizer-preset");
  assert.equal(summary.unique_audio_files, 1);
  assert.equal(summary.duplicate_source_files, 1);
  assert.equal(music.files.length, 2);
  assert.ok(music.semantics.moods.includes("calm"));
  assert.ok(music.semantics.tags.includes("piano"));
  assert.deepEqual(visualizer.relations.demonstrated_with, [music.id]);
  assert.ok(music.relations.demonstrated_with.includes(visualizer.id));
});

test("search, curation, and usage update the derived catalog", async (t) => {
  const root = fixture();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const { assets } = await scanLibrary({ repoRoot: root });
  const id = assets.find((asset) => asset.type === "music").id;
  const results = searchAssets({ repoRoot: root, query: "安静 钢琴", type: "music", status: "candidate" });
  assert.equal(results[0].asset.id, id);
  curateAsset({ id, status: "approved", rating: 4, rightsStatus: "owned", commercialUse: true, repoRoot: root });
  recordUsage({ id, project: "src/content/blogs/test", role: "background-music", repoRoot: root });
  const updated = showAsset(id, root);
  assert.equal(updated.quality.status, "approved");
  assert.equal(updated.quality.rating, 4);
  assert.equal(updated.rights.status, "owned");
  assert.equal(updated.usage.use_count, 1);
  assert.equal(validateCatalog(root).errors.length, 0);
});
