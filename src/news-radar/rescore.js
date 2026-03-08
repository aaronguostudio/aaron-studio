/**
 * AI Re-scorer: Uses LLM to score items based on Aaron's actual interests.
 * Replaces dumb keyword scoring with personalized relevance.
 * 
 * Usage: node rescore.js [batch_size] [--new-only]
 */
import db from "./db/client.js";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL = "gpt-4o-mini";
const BATCH_SIZE = parseInt(process.argv[2] || "30");
const NEW_ONLY = process.argv.includes("--new-only");

const AARON_PROFILE = `
You are scoring news items for Aaron Guo. Score each item 1-10 based on how relevant and valuable it is TO HIM SPECIFICALLY.

WHO AARON IS:
- Senior Manager & Partner at a $100B+ AUM investment firm (Mawer), Head of Products
- Building OrgNext: AI-native firm/company management software (CEO role)
- Building AI-native personal infrastructure with OpenClaw (AI agent framework)
- Active on X/Twitter, building personal brand around AI + finance + indie building
- YouTuber (AI-generated music/visual shorts)

SCORE 9-10 (Must Read — stop everything):
- AI agent breakthroughs (autonomous agents, MCP protocol, computer use, coding agents)
- World models (video generation, spatial AI, physics simulation, embodied AI, Sora-like systems)
- AI in financial services / investment management
- AI-native company building / org design disruption
- OpenClaw, Claude, Anthropic major announcements
- Indie SaaS founders sharing real revenue numbers, tactics, pivots
- Enterprise AI adoption stories with real ROI data
- Management/leadership insights applicable to tech teams

SCORE 7-8 (High Value — worth reading):
- Deep technical AI advances with practical implications
- New AI tools/frameworks Aaron could actually use
- Content creation / creator economy insights
- Open source projects relevant to his stack (Node.js, Nuxt, TypeScript)
- Contrarian or non-obvious takes on AI that challenge thinking
- Startup strategy, fundraising, GTM insights

SCORE 5-6 (Moderate — scan headline):
- General AI news (model releases, benchmarks) without unique insight
- Programming tutorials or tips
- Tech industry news (acquisitions, layoffs) without direct relevance
- Product launches in adjacent spaces

SCORE 3-4 (Low — skip):
- Generic motivational/hustle content
- Viral tweets that are entertaining but not actionable
- Celebrity tech opinions without substance
- Random discoveries, fun facts, travel content
- Hardware reviews, consumer tech
- Political takes, drama, controversy

SCORE 1-2 (Noise):
- Completely unrelated to Aaron's interests
- Spam, self-promotion without substance
- Memes, jokes, casual banter

Also assign a CATEGORY from: ai, fintech, indie, coding, management, content, general

RESPOND ONLY IN JSON: {"score": N, "category": "...", "reason": "10 words max"}
`;

async function scoreBatch(items) {
  const itemsText = items.map((item, i) => {
    const extra = item.raw_data ? JSON.parse(item.raw_data) : {};
    const fullText = extra.full_text || item.title;
    return `[${i}] (${item.source}) ${fullText.slice(0, 300)}`;
  }).join("\n\n");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1500,
      temperature: 0.1,
      messages: [
        { role: "system", content: AARON_PROFILE },
        {
          role: "user",
          content: `Score these ${items.length} items. Return a JSON array of objects, one per item, in order:\n\n${itemsText}`,
        },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API ${res.status}: ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  
  try {
    const parsed = JSON.parse(content);
    // Handle both {scores: [...]} and {items: [...]} and direct array
    return parsed.scores || parsed.items || parsed.results || 
           (Array.isArray(parsed) ? parsed : Object.values(parsed)[0]);
  } catch (e) {
    console.log("  ⚠️ Parse error, skipping batch");
    return null;
  }
}

async function main() {
  if (!OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY not set");
    process.exit(1);
  }

  // Get items to re-score
  const whereClause = NEW_ONLY 
    ? "WHERE ai_relevance IS NULL" 
    : "WHERE 1=1";
  
  const result = await db.execute({
    sql: `SELECT id, title, source, raw_data, relevance FROM items ${whereClause} ORDER BY created_at DESC LIMIT ?`,
    args: [BATCH_SIZE],
  });

  const items = result.rows;
  console.log(`🧠 Re-scoring ${items.length} items with AI...`);

  if (items.length === 0) {
    console.log("✅ Nothing to score");
    return;
  }

  // Process in batches of 10 for reliable JSON output
  const CHUNK = 10;
  let updated = 0;

  for (let i = 0; i < items.length; i += CHUNK) {
    const chunk = items.slice(i, i + CHUNK);
    console.log(`  Batch ${Math.floor(i/CHUNK) + 1}/${Math.ceil(items.length/CHUNK)}...`);
    
    try {
      const scores = await scoreBatch(chunk);
      if (!scores || scores.length !== chunk.length) {
        console.log("  ⚠️ Score count mismatch, skipping batch");
        continue;
      }

      for (let j = 0; j < chunk.length; j++) {
        const item = chunk[j];
        const s = scores[j];
        if (!s || typeof s.score !== "number") continue;

        await db.execute({
          sql: `UPDATE items SET ai_relevance = ?, category = ?, relevance = ? WHERE id = ?`,
          args: [s.score, s.category || item.category, s.score, item.id],
        });
        
        const arrow = s.score > item.relevance ? "⬆" : s.score < item.relevance ? "⬇" : "=";
        if (s.score !== Number(item.relevance)) {
          console.log(`    ${arrow} ${item.relevance}→${s.score} [${item.source}] ${item.title?.slice(0, 60)}`);
        }
        updated++;
      }
    } catch (e) {
      console.log(`  ❌ Batch error: ${e.message.slice(0, 100)}`);
    }

    // Rate limit between batches
    if (i + CHUNK < items.length) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  console.log(`\n✅ Re-scored ${updated} items`);
  
  // Show new distribution
  const dist = await db.execute("SELECT relevance, COUNT(*) as c FROM items GROUP BY relevance ORDER BY relevance DESC");
  console.log("\n📊 New distribution:");
  for (const row of dist.rows) console.log(`  Score ${row.relevance}: ${row.c}`);
}

main().catch(console.error);
