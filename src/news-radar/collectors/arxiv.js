import { insertItem, startRun, finishRun } from "./base.js";

// ArXiv — AI/ML papers that matter
// Using the Atom feed for cs.AI and cs.LG (machine learning)
const FEEDS = [
  { url: "https://rss.arxiv.org/atom/cs.AI", tag: "cs.AI" },
  { url: "https://rss.arxiv.org/atom/cs.CL", tag: "cs.CL" }, // Computation and Language (LLMs)
  { url: "https://rss.arxiv.org/atom/cs.CV", tag: "cs.CV" }, // Computer Vision (world models, video gen, spatial AI)
  { url: "https://rss.arxiv.org/atom/cs.RO", tag: "cs.RO" }, // Robotics (embodied world models)
];

function parseAtomEntries(xml) {
  const entries = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;
  while ((match = entryRegex.exec(xml)) !== null) {
    const entry = match[1];
    const title = entry.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1]?.trim().replace(/\n/g, ' ') || '';
    const link = entry.match(/<link[^>]*href="([^"]+)"[^>]*rel="alternate"/)?.[1] 
              || entry.match(/<link[^>]*href="([^"]+)"/)?.[1] || '';
    const summary = entry.match(/<summary[^>]*>([\s\S]*?)<\/summary>/)?.[1]?.trim().replace(/\n/g, ' ') || '';
    const authors = [...entry.matchAll(/<author>\s*<name>([^<]+)<\/name>/g)].map(m => m[1].trim());
    const published = entry.match(/<published>([^<]+)<\/published>/)?.[1] || '';
    
    if (title && link) {
      entries.push({ title, link, summary, authors, published });
    }
  }
  return entries;
}

export async function collectArxiv() {
  const runId = await startRun("arxiv");
  let added = 0, skipped = 0;

  try {
    for (const feed of FEEDS) {
      try {
        const res = await fetch(feed.url, {
          headers: { "User-Agent": "SignalBot/1.0" },
          signal: AbortSignal.timeout(15000),
        });

        if (!res.ok) {
          console.log(`  ⚠️ ArXiv ${feed.tag}: HTTP ${res.status}`);
          continue;
        }

        const xml = await res.text();
        const entries = parseAtomEntries(xml);

        for (const entry of entries.slice(0, 25)) {
          const inserted = await insertItem({
            source: "arxiv",
            source_id: entry.link.split('/').pop(),
            url: entry.link,
            title: entry.title.slice(0, 300),
            summary: entry.summary.slice(0, 500) || null,
            author: entry.authors.slice(0, 3).join(', ') || null,
            score: 0,
            relevance: 5,
            category: "ai",
            tags: [feed.tag],
            raw_data: {
              full_text: entry.summary,
              all_authors: entry.authors,
              published: entry.published,
              feed: feed.tag,
            },
          });

          if (inserted) added++;
          else skipped++;
        }

        console.log(`  📥 ArXiv ${feed.tag}: ${entries.length} papers`);
      } catch (e) {
        console.log(`  ⚠️ ArXiv ${feed.tag}: ${e.message}`);
      }

      await new Promise(r => setTimeout(r, 1000));
    }

    await finishRun(runId, added, skipped);
    console.log(`✅ ArXiv: +${added} new, ${skipped} skipped`);
  } catch (e) {
    await finishRun(runId, added, skipped, e.message);
    console.error(`❌ ArXiv error: ${e.message}`);
  }

  return { added, skipped };
}
