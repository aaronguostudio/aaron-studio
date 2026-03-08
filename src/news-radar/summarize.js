import db from "./db/client.js";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL = "gpt-4o-mini";
const BATCH_SIZE = parseInt(process.argv[2] || "50");
const DELAY_MS = 300;

async function summarizeText(title, summary, rawData) {
  const extra = rawData ? JSON.parse(rawData) : {};
  const fullText = summary || extra.full_text || extra.selftext || title;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 120,
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: "You summarize news items in 1-2 concise English sentences. Focus on what's interesting or actionable. Be direct.",
        },
        {
          role: "user",
          content: `Title: ${title}\nContent: ${fullText.slice(0, 1000)}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API ${res.status}: ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || null;
}

async function main() {
  if (!OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY not set — add to .env");
    process.exit(1);
  }

  // Get items without AI summaries
  const result = await db.execute({
    sql: `SELECT id, title, summary, raw_data, source FROM items WHERE ai_summary IS NULL ORDER BY relevance DESC, created_at DESC LIMIT ?`,
    args: [BATCH_SIZE],
  });

  const items = result.rows;
  console.log(`📝 ${items.length} items need summaries`);

  if (items.length === 0) {
    console.log("✅ All items have summaries");
    return;
  }

  let done = 0, failed = 0;

  for (const item of items) {
    try {
      const aiSummary = await summarizeText(item.title, item.summary, item.raw_data);
      if (aiSummary) {
        await db.execute({
          sql: `UPDATE items SET ai_summary = ? WHERE id = ?`,
          args: [aiSummary, item.id],
        });
        done++;
        console.log(`  ✅ [${item.source}] ${item.title.slice(0, 60)}...`);
      }
    } catch (e) {
      failed++;
      console.log(`  ❌ [${item.source}] ${e.message.slice(0, 80)}`);
    }

    if (done + failed < items.length) {
      await new Promise((r) => setTimeout(r, DELAY_MS));
    }
  }

  console.log(`✅ Summaries: ${done} generated, ${failed} failed, ${items.length - done - failed} skipped`);
}

main().catch(console.error);
