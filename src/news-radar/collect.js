import { collectHN } from "./collectors/hackernews.js";
import { collectX } from "./collectors/x-twitter.js";
import { collectReddit } from "./collectors/reddit.js";
import { collectPH } from "./collectors/producthunt.js";
import { collectGitHub } from "./collectors/github-trending.js";
import { collectLobsters } from "./collectors/lobsters.js";
import { collectArxiv } from "./collectors/arxiv.js";

async function main() {
  const source = process.argv[2] || "all";
  console.log(`🔍 Collecting from: ${source}`);

  if (source === "all" || source === "hackernews") {
    await collectHN(30);
  }

  if (source === "x-twitter" || source === "x") {
    await collectX();
  }

  if (source === "all" || source === "reddit") {
    await collectReddit();
  }

  if (source === "all" || source === "producthunt") {
    await collectPH();
  }

  if (source === "all" || source === "github") {
    await collectGitHub();
  }

  if (source === "all" || source === "lobsters") {
    await collectLobsters();
  }

  if (source === "all" || source === "arxiv") {
    await collectArxiv();
  }

  // Auto-summarize new items after collection
  if (process.argv.includes("--summarize")) {
    console.log("\n📝 Running AI summarizer...");
    const { default: summarize } = await import("./summarize.js");
  }

  console.log("✅ Collection complete");
}

main().catch(console.error);
