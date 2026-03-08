import { insertItem, startRun, finishRun } from "./base.js";

const SUBREDDITS = ["artificial", "LocalLLaMA", "singularity", "machinelearning", "computervision"];
const REDDIT_URL = (sub) => `https://www.reddit.com/r/${sub}/hot.json?limit=25`;

const HIGH_RELEVANCE = ["ai", "llm", "agent", "claude", "openai", "anthropic", "gpt", "coding agent", "saas", "startup", "indie", "fintech", "mcp", "openclaw", "local llm", "ollama", "gguf", "world model", "video generation", "sora", "spatial ai", "embodied ai", "physics simulation"];
const MED_RELEVANCE = ["python", "typescript", "javascript", "react", "open source", "self-host", "devtools", "productivity", "automation", "fine-tune", "lora", "rag"];

function scoreRelevance(title, score, sub) {
  const t = title.toLowerCase();
  let rel = 3;
  if (sub === "LocalLLaMA") rel = 4; // baseline boost for LocalLLaMA
  for (const kw of HIGH_RELEVANCE) {
    if (t.includes(kw)) { rel += 3; break; }
  }
  for (const kw of MED_RELEVANCE) {
    if (t.includes(kw)) { rel += 1; break; }
  }
  if (score > 1000) rel += 2;
  else if (score > 300) rel += 1;
  return Math.min(rel, 10);
}

function categorize(title) {
  const t = title.toLowerCase();
  if (/\b(ai|llm|gpt|claude|openai|anthropic|gemini|agent|ml|neural|transformer|diffusion|gguf|ollama)\b/.test(t)) return "ai";
  if (/\b(fintech|finance|trading|bank|invest)\b/.test(t)) return "fintech";
  if (/\b(indie|solopreneur|bootstrap|saas|startup)\b/.test(t)) return "indie";
  if (/\b(rust|go|python|typescript|javascript|react|node|programming|code|dev)\b/.test(t)) return "coding";
  return "general";
}

export async function collectReddit() {
  const runId = await startRun("reddit");
  let added = 0, skipped = 0;

  try {
    for (const sub of SUBREDDITS) {
      try {
        const res = await fetch(REDDIT_URL(sub), {
          headers: { "User-Agent": "NewsRadar/0.1 (by aaron)" },
          signal: AbortSignal.timeout(10000),
        });

        if (!res.ok) {
          console.log(`  ⚠️ r/${sub}: HTTP ${res.status}`);
          skipped++;
          continue;
        }

        const data = await res.json();
        const posts = data?.data?.children || [];
        let subAdded = 0;

        for (const post of posts) {
          const d = post.data;
          if (!d || d.stickied) continue;

          const url = d.url || `https://reddit.com${d.permalink}`;
          const relevance = scoreRelevance(d.title, d.score || 0, sub);
          const category = categorize(d.title);

          const inserted = await insertItem({
            source: "reddit",
            source_id: d.id,
            url: `https://reddit.com${d.permalink}`,
            title: d.title,
            summary: d.selftext ? d.selftext.slice(0, 300) : null,
            author: d.author,
            score: d.score || 0,
            relevance,
            category,
            tags: [category, `r/${sub}`],
            raw_data: {
              subreddit: sub,
              num_comments: d.num_comments,
              external_url: d.url !== `https://reddit.com${d.permalink}` ? d.url : null,
            },
          });

          if (inserted) { added++; subAdded++; }
          else skipped++;
        }

        console.log(`  📥 r/${sub}: ${subAdded} new posts`);
      } catch (e) {
        console.log(`  ⚠️ r/${sub}: ${e.message}`);
        skipped++;
      }
    }

    await finishRun(runId, added, skipped);
    console.log(`✅ Reddit: +${added} new, ${skipped} skipped`);
  } catch (e) {
    await finishRun(runId, added, skipped, e.message);
    console.error(`❌ Reddit error: ${e.message}`);
  }

  return { added, skipped };
}
