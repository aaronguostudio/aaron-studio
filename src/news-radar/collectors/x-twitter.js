import { insertItem, startRun, finishRun } from "./base.js";

const SYNDICATION_URL = (screenName) =>
  `https://syndication.twitter.com/srv/timeline-profile/screen-name/${screenName}`;

const ACCOUNTS = [
  "karpathy",
  "levelsio",
  "swyx",
  "nutlope",
  "marckohlbrugge",
  "tdinh_me",
  "ClaudeAI",
  "AnthropicAI",
  "OpenAI",
  "ylaboratory",    // Yann LeCun — world models advocate
  "drjimfan",       // Jim Fan (NVIDIA) — embodied AI / world models
  "drfeifei",       // Fei-Fei Li — spatial AI / world labs
];

const HIGH_RELEVANCE = ["ai", "llm", "agent", "claude", "openai", "anthropic", "gpt", "coding agent", "saas", "startup", "indie", "fintech", "mcp", "openclaw"];
const MED_RELEVANCE = ["python", "typescript", "javascript", "react", "open source", "self-host", "devtools", "productivity", "automation"];

function scoreRelevance(text, likes) {
  const t = text.toLowerCase();
  let rel = 3;
  for (const kw of HIGH_RELEVANCE) {
    if (t.includes(kw)) { rel += 3; break; }
  }
  for (const kw of MED_RELEVANCE) {
    if (t.includes(kw)) { rel += 1; break; }
  }
  if (likes > 5000) rel += 2;
  else if (likes > 1000) rel += 1;
  return Math.min(rel, 10);
}

function categorize(text) {
  const t = text.toLowerCase();
  if (/\b(ai|llm|gpt|claude|openai|anthropic|gemini|agent|ml|neural|transformer)\b/.test(t)) return "ai";
  if (/\b(fintech|finance|trading|bank|invest)\b/.test(t)) return "fintech";
  if (/\b(indie|solopreneur|bootstrap|saas|startup)\b/.test(t)) return "indie";
  if (/\b(rust|go|python|typescript|javascript|react|node|programming|code|dev)\b/.test(t)) return "coding";
  return "general";
}

function extractTweetsFromResponse(html, account) {
  const tweets = [];

  // The syndication page embeds JSON in a <script> tag with __NEXT_DATA__
  const jsonMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!jsonMatch) return tweets;

  try {
    const data = JSON.parse(jsonMatch[1]);
    const entries = data?.props?.pageProps?.timeline?.entries || [];

    for (const entry of entries) {
      if (entry.type !== "tweet") continue;
      const tweet = entry.content?.tweet;
      if (!tweet) continue;

      const text = tweet.full_text || tweet.text || "";
      if (!text || text.length < 15) continue;

      // Clean up t.co links from display text
      const cleanText = text.replace(/https?:\/\/t\.co\/\w+/g, "").trim();
      const id = tweet.id_str;
      const likes = tweet.favorite_count || 0;
      const retweets = tweet.retweet_count || 0;
      const screenName = tweet.user?.screen_name || account;

      tweets.push({
        id,
        text: cleanText,
        url: `https://x.com/${screenName}/status/${id}`,
        author: screenName,
        likes,
        retweets,
        created_at: tweet.created_at,
      });
    }
  } catch (e) {
    // JSON parse error, skip
  }

  return tweets;
}

export async function collectX() {
  const runId = await startRun("x-twitter");
  let added = 0, skipped = 0;

  try {
    // Randomly pick 3 accounts per run to reduce rate limiting
    const shuffled = [...ACCOUNTS].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3);
    console.log(`  🎲 Selected: ${selected.map(a => '@' + a).join(', ')}`);

    for (let i = 0; i < selected.length; i++) {
      const account = selected[i];
      // 10s delay between accounts to look more human
      if (i > 0) await new Promise(r => setTimeout(r, 10000));
      try {
        const res = await fetch(SYNDICATION_URL(account), {
          headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
            "Accept": "text/html,application/xhtml+xml",
          },
          signal: AbortSignal.timeout(15000),
        });

        if (!res.ok) {
          console.log(`  ⚠️ @${account}: HTTP ${res.status}`);
          skipped++;
          continue;
        }

        const html = await res.text();
        const tweets = extractTweetsFromResponse(html, account);

        for (const tweet of tweets) {
          const relevance = scoreRelevance(tweet.text, tweet.likes);
          const category = categorize(tweet.text);

          const inserted = await insertItem({
            source: "x-twitter",
            source_id: tweet.id,
            url: tweet.url,
            title: tweet.text.slice(0, 200) + (tweet.text.length > 200 ? "..." : ""),
            summary: tweet.text.length > 200 ? tweet.text : null,
            author: `@${tweet.author}`,
            score: tweet.likes,
            relevance,
            category,
            tags: [category],
            raw_data: {
              full_text: tweet.text,
              likes: tweet.likes,
              retweets: tweet.retweets,
              created_at: tweet.created_at,
            },
          });

          if (inserted) added++;
          else skipped++;
        }

        console.log(`  📥 @${account}: ${tweets.length} tweets found`);
      } catch (e) {
        console.log(`  ⚠️ @${account}: ${e.message}`);
        skipped++;
      }
    }

    await finishRun(runId, added, skipped);
    console.log(`✅ X/Twitter: +${added} new, ${skipped} skipped`);
  } catch (e) {
    await finishRun(runId, added, skipped, e.message);
    console.error(`❌ X/Twitter error: ${e.message}`);
  }

  return { added, skipped };
}
