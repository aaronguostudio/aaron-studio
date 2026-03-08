import { insertItem, startRun, finishRun } from "./base.js";

// Product Hunt front page via unofficial RSS-like endpoint
const PH_URL = "https://www.producthunt.com/frontend/graphql";
const PH_HOMEPAGE = "https://www.producthunt.com";

const HIGH_RELEVANCE = ["ai", "llm", "agent", "claude", "openai", "gpt", "saas", "startup", "automation", "no-code", "developer", "api"];
const MED_RELEVANCE = ["productivity", "workflow", "analytics", "dashboard", "open source", "self-host"];

function scoreRelevance(name, tagline, votes) {
  const t = `${name} ${tagline}`.toLowerCase();
  let rel = 3;
  for (const kw of HIGH_RELEVANCE) {
    if (t.includes(kw)) { rel += 3; break; }
  }
  for (const kw of MED_RELEVANCE) {
    if (t.includes(kw)) { rel += 1; break; }
  }
  if (votes > 500) rel += 2;
  else if (votes > 200) rel += 1;
  return Math.min(rel, 10);
}

function categorize(text) {
  const t = text.toLowerCase();
  if (/\b(ai|llm|gpt|claude|openai|agent|ml)\b/.test(t)) return "ai";
  if (/\b(fintech|finance|trading|bank|invest|payment)\b/.test(t)) return "fintech";
  if (/\b(indie|solopreneur|bootstrap|saas|startup)\b/.test(t)) return "indie";
  if (/\b(developer|api|code|programming|devtool)\b/.test(t)) return "coding";
  return "general";
}

// Fallback: scrape the RSS feed
async function fetchPHFromRSS() {
  const res = await fetch("https://www.producthunt.com/feed", {
    headers: { "User-Agent": "NewsRadar/0.1" },
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) return [];

  const xml = await res.text();
  const items = [];

  // Parse Atom feed entries
  const itemRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null && items.length < 20) {
    const block = match[1];
    const title = block.match(/<title>(.*?)<\/title>/)?.[1] || "";
    const linkMatch = block.match(/<link[^>]*href="([^"]+)"[^>]*\/>/);
    const link = linkMatch ? linkMatch[1] : (block.match(/<link>(.*?)<\/link>/)?.[1] || "");
    const desc = block.match(/<content[^>]*>([\s\S]*?)<\/content>/)?.[1] ||
                 block.match(/<summary[^>]*>([\s\S]*?)<\/summary>/)?.[1] || "";
    const guid = block.match(/<id>(.*?)<\/id>/)?.[1] || link;

    if (title && link) {
      items.push({
        name: title,
        tagline: desc.replace(/<[^>]*>/g, "").slice(0, 200),
        url: link,
        id: guid,
        votes: 0,
      });
    }
  }

  return items;
}

export async function collectPH() {
  const runId = await startRun("producthunt");
  let added = 0, skipped = 0;

  try {
    const products = await fetchPHFromRSS();

    for (const product of products) {
      const text = `${product.name} ${product.tagline}`;
      const relevance = scoreRelevance(product.name, product.tagline, product.votes);
      const category = categorize(text);

      const inserted = await insertItem({
        source: "producthunt",
        source_id: product.id,
        url: product.url,
        title: product.name,
        summary: product.tagline || null,
        score: product.votes,
        relevance,
        category,
        tags: [category, "product"],
        raw_data: { tagline: product.tagline },
      });

      if (inserted) added++;
      else skipped++;
    }

    await finishRun(runId, added, skipped);
    console.log(`✅ Product Hunt: +${added} new, ${skipped} skipped`);
  } catch (e) {
    await finishRun(runId, added, skipped, e.message);
    console.error(`❌ Product Hunt error: ${e.message}`);
  }

  return { added, skipped };
}
