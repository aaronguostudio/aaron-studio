import { insertItem, startRun, finishRun } from "./base.js";

const HN_TOP = "https://hacker-news.firebaseio.com/v0/topstories.json";
const HN_ITEM = (id) => `https://hacker-news.firebaseio.com/v0/item/${id}.json`;
const HN_LINK = (id) => `https://news.ycombinator.com/item?id=${id}`;

// Aaron's interest keywords for basic relevance scoring
const HIGH_RELEVANCE = ["ai", "llm", "agent", "claude", "openai", "anthropic", "gpt", "coding agent", "saas", "startup", "indie", "fintech", "mcp"];
const MED_RELEVANCE = ["python", "typescript", "javascript", "react", "open source", "self-host", "devtools", "productivity", "automation"];

function scoreRelevance(title, score) {
  const t = title.toLowerCase();
  let rel = 3; // baseline

  for (const kw of HIGH_RELEVANCE) {
    if (t.includes(kw)) { rel += 3; break; }
  }
  for (const kw of MED_RELEVANCE) {
    if (t.includes(kw)) { rel += 1; break; }
  }

  // Boost high-scoring posts
  if (score > 500) rel += 2;
  else if (score > 200) rel += 1;

  return Math.min(rel, 10);
}

function categorize(title) {
  const t = title.toLowerCase();
  if (/\b(ai|llm|gpt|claude|openai|anthropic|gemini|agent|ml|neural|transformer)\b/.test(t)) return "ai";
  if (/\b(fintech|finance|trading|bank|invest)\b/.test(t)) return "fintech";
  if (/\b(indie|solopreneur|bootstrap|saas|startup)\b/.test(t)) return "indie";
  if (/\b(rust|go|python|typescript|javascript|react|node|programming|code|dev)\b/.test(t)) return "coding";
  return "general";
}

export async function collectHN(limit = 30) {
  const runId = await startRun("hackernews");
  let added = 0, skipped = 0;

  try {
    const res = await fetch(HN_TOP);
    const topIds = await res.json();
    const ids = topIds.slice(0, limit);

    for (const id of ids) {
      try {
        const itemRes = await fetch(HN_ITEM(id));
        const item = await itemRes.json();
        if (!item || item.type !== "story" || !item.title) continue;

        const url = item.url || HN_LINK(id);
        const relevance = scoreRelevance(item.title, item.score || 0);
        const category = categorize(item.title);

        const inserted = await insertItem({
          source: "hackernews",
          source_id: String(id),
          url,
          title: item.title,
          author: item.by || null,
          score: item.score || 0,
          relevance,
          category,
          tags: [category],
          raw_data: { hn_id: id, comments: item.descendants || 0, hn_url: HN_LINK(id) },
        });

        if (inserted) added++;
        else skipped++;
      } catch (e) {
        skipped++;
      }
    }

    await finishRun(runId, added, skipped);
    console.log(`✅ HN: +${added} new, ${skipped} skipped`);
  } catch (e) {
    await finishRun(runId, added, skipped, e.message);
    console.error(`❌ HN error: ${e.message}`);
  }

  return { added, skipped };
}
