import { insertItem, startRun, finishRun } from "./base.js";

// Lobste.rs — higher signal-to-noise than HN for deep technical content
const FEED_URL = "https://lobste.rs/hottest.json";

export async function collectLobsters() {
  const runId = await startRun("lobsters");
  let added = 0, skipped = 0;

  try {
    const res = await fetch(FEED_URL, {
      headers: { "User-Agent": "SignalBot/1.0" },
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const items = await res.json();

    for (const item of items.slice(0, 40)) {
      const url = item.url || item.short_id_url;
      if (!url) continue;

      const inserted = await insertItem({
        source: "lobsters",
        source_id: item.short_id,
        url,
        title: item.title,
        summary: item.description || null,
        author: item.submitter_user?.username || null,
        score: item.score || 0,
        relevance: 5, // Will be re-scored by AI
        category: "coding",
        tags: item.tags || [],
        raw_data: {
          comment_count: item.comment_count,
          tags: item.tags,
          created_at: item.created_at,
        },
      });

      if (inserted) added++;
      else skipped++;
    }

    await finishRun(runId, added, skipped);
    console.log(`✅ Lobsters: +${added} new, ${skipped} skipped`);
  } catch (e) {
    await finishRun(runId, added, skipped, e.message);
    console.error(`❌ Lobsters error: ${e.message}`);
  }

  return { added, skipped };
}
