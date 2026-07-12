/**
 * Signal Daily Pulse Generator
 * Generates a one-line "Today's Pulse" summary + selects top items for the homepage.
 * Stored in daily_pulse table, served via blog API.
 *
 * Usage: node pulse.js [--date YYYY-MM-DD]
 */
import db from "./db/client.js";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Allow override date for testing
const dateArg = process.argv.find((_, i, a) => a[i - 1] === "--date");
const today = dateArg || new Date().toISOString().slice(0, 10);

async function getTodayItems() {
  const result = await db.execute({
    sql: `SELECT id, title, source, ai_summary, relevance, category, score, url
          FROM items 
          WHERE date(created_at) = ? AND relevance >= 5
          ORDER BY relevance DESC, score DESC
          LIMIT 30`,
    args: [today],
  });
  return result.rows;
}

async function generatePulse(items) {
  if (items.length === 0) return null;

  const itemsText = items.map((item, i) =>
    `[${item.source}|${item.category}|rel:${item.relevance}] ${item.title}`
  ).join("\n");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 100,
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: "Write ONE defensible editorial thesis (max 35 words) about today's dominant technology signal. Name the underlying shift, not a list of headlines. Be specific, source-grounded, and useful to a builder working on AI products. No emoji and no generic 'today's news highlights include' wording.",
        },
        {
          role: "user",
          content: `Today's top ${items.length} items:\n${itemsText}\n\nWrite ONE sentence capturing the main technology thesis:`,
        },
      ],
    }),
  });

  if (!res.ok) throw new Error(`OpenAI API ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || null;
}

async function main() {
  if (!OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY not set");
    process.exit(1);
  }

  console.log(`✦ Generating pulse for ${today}...`);

  const items = getTodayItems ? await getTodayItems() : [];
  console.log(`  Found ${items.length} items (rel 5+)`);

  if (items.length === 0) {
    console.log("⚠️ No items for today. Skipping.");
    return;
  }

  const pulse = await generatePulse(items);
  if (!pulse) {
    console.log("⚠️ Failed to generate pulse.");
    return;
  }

  // Pick top 5 item IDs for homepage display
  const topIds = items.slice(0, 5).map(i => i.id);

  // Upsert into daily_pulse
  await db.execute({
    sql: `INSERT INTO daily_pulse (date, pulse_text, top_item_ids)
          VALUES (?, ?, ?)
          ON CONFLICT(date) DO UPDATE SET pulse_text = ?, top_item_ids = ?, generated_at = datetime('now')`,
    args: [today, pulse, JSON.stringify(topIds), pulse, JSON.stringify(topIds)],
  });

  console.log(`✅ Pulse: "${pulse}"`);
  console.log(`  Top items: ${topIds.join(", ")}`);
}

main().catch(console.error);
