import { createServer } from "http";
import { readFileSync } from "fs";
import { resolve, dirname, extname } from "path";
import { fileURLToPath } from "url";
import db from "./db/client.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3847;

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
};

const CATEGORY_LABELS = {
  ai: "AI",
  coding: "Coding",
  indie: "Indie",
  fintech: "Fintech",
  general: "General",
};

function parseJsonArray(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function sendJson(res, payload, status = 200) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(payload));
}

function buildThemes(items) {
  const groups = new Map();

  for (const item of items) {
    const category = item.category || "general";
    if (!groups.has(category)) groups.set(category, []);
    groups.get(category).push(item);
  }

  return [...groups.entries()]
    .map(([category, categoryItems]) => ({
      key: category,
      label: CATEGORY_LABELS[category] || category,
      count: categoryItems.length,
      items: categoryItems
        .sort((a, b) => (b.relevance - a.relevance) || (b.score - a.score))
        .slice(0, 3),
    }))
    .sort((a, b) => (b.count - a.count) || (b.items[0]?.relevance || 0) - (a.items[0]?.relevance || 0))
    .slice(0, 3);
}

function fallbackThesis(themes) {
  if (!themes.length) return "No fresh technology signal has cleared the quality bar yet.";
  const lead = themes[0].label;
  const secondary = themes[1]?.label;
  return secondary
    ? `${lead} is the strongest signal today, with ${secondary} providing the second-order context.`
    : `${lead} is the strongest technology signal today.`;
}

async function getPulse() {
  try {
    const result = await db.execute(`
      SELECT date, pulse_text, top_item_ids, generated_at
      FROM daily_pulse
      ORDER BY date DESC
      LIMIT 1
    `);
    return result.rows[0] || null;
  } catch {
    // Older databases may not have daily_pulse yet. The brief still works
    // from the recent items and falls back to a deterministic thesis.
    return null;
  }
}

function isFreshPulse(pulse) {
  if (!pulse?.date) return false;
  const pulseDate = new Date(`${pulse.date}T23:59:59Z`);
  if (Number.isNaN(pulseDate.getTime())) return false;
  const age = Date.now() - pulseDate.getTime();
  return age < 3 * 24 * 60 * 60 * 1000 && age > -24 * 60 * 60 * 1000;
}

async function getBrief() {
  const result = await db.execute({
    sql: `SELECT id, source, url, title, summary, ai_summary, author, score, relevance, tags, category, created_at
          FROM items
          WHERE created_at >= datetime('now', '-24 hours')
            AND relevance >= 5
          ORDER BY relevance DESC, score DESC, created_at DESC
          LIMIT 40`,
    args: [],
  });
  const items = result.rows;
  const themes = buildThemes(items);
  const storedPulse = await getPulse();
  const pulse = items.length && isFreshPulse(storedPulse) ? storedPulse : null;
  const pulseIds = parseJsonArray(pulse?.top_item_ids).map(Number);
  const itemById = new Map(items.map((item) => [Number(item.id), item]));
  const selectedItems = pulseIds
    .map((id) => itemById.get(id))
    .filter(Boolean)
    .slice(0, 3);

  return {
    segment: "technology",
    label: "Technology",
    thesis: pulse?.pulse_text || fallbackThesis(themes),
    generated_at: pulse?.generated_at || pulse?.date || null,
    themes,
    selected_items: selectedItems.length ? selectedItems : items.slice(0, 3),
    candidate_count: items.length,
    window_hours: 24,
  };
}

async function getTagCounts() {
  const result = await db.execute(`SELECT tags FROM items WHERE tags IS NOT NULL`);
  const counts = new Map();
  for (const row of result.rows) {
    for (const tag of parseJsonArray(row.tags)) {
      if (!tag) continue;
      counts.set(tag, (counts.get(tag) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 18)
    .map(([tag, count]) => ({ tag, count }));
}

async function handleAPI(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === "/api/brief") {
    sendJson(res, await getBrief());
    return;
  }

  if (url.pathname === "/api/items") {
    const source = url.searchParams.get("source");
    const category = url.searchParams.get("category");
    const tag = url.searchParams.get("tag");
    const minRelevance = parseInt(url.searchParams.get("minRelevance") || "0");
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 200);
    const offset = parseInt(url.searchParams.get("offset") || "0");
    const search = url.searchParams.get("q");

    let where = ["1=1"];
    let args = [];

    if (source) { where.push("source = ?"); args.push(source); }
    if (category) { where.push("category = ?"); args.push(category); }
    if (tag) { where.push("tags LIKE ?"); args.push(`%\"${tag}\"%`); }
    if (minRelevance > 0) { where.push("relevance >= ?"); args.push(minRelevance); }
    if (search) { where.push("title LIKE ?"); args.push(`%${search}%`); }

    const result = await db.execute({
      sql: `SELECT id, source, url, title, summary, ai_summary, author, score, relevance, tags, category, created_at
            FROM items WHERE ${where.join(" AND ")}
            ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      args: [...args, limit, offset],
    });

    const countResult = await db.execute({
      sql: `SELECT COUNT(*) as total FROM items WHERE ${where.join(" AND ")}`,
      args,
    });

    sendJson(res, {
      items: result.rows,
      total: countResult.rows[0].total,
      limit,
      offset,
    });
    return;
  }

  if (url.pathname === "/api/stats") {
    const stats = await db.execute(`
      SELECT source, COUNT(*) as count, MAX(created_at) as latest
      FROM items GROUP BY source
    `);
    const categories = await db.execute(`
      SELECT category, COUNT(*) as count FROM items GROUP BY category ORDER BY count DESC
    `);
    sendJson(res, {
      sources: stats.rows,
      categories: categories.rows,
      tags: await getTagCounts(),
    });
    return;
  }

  return false;
}

const server = createServer(async (req, res) => {
  try {
    // API routes
    if (req.url.startsWith("/api/")) {
      const handled = await handleAPI(req, res);
      if (handled !== false) return;
    }

    // Static files
    let filePath = req.url === "/" ? "/index.html" : req.url;
    const ext = extname(filePath);
    const mime = MIME[ext] || "text/plain";

    try {
      const content = readFileSync(resolve(__dirname, "public", filePath.slice(1)));
      res.writeHead(200, { "Content-Type": mime });
      res.end(content);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  } catch (e) {
    console.error(`Request failed: ${e.stack || e.message}`);
    res.writeHead(500);
    res.end(e.message);
  }
});

server.listen(PORT, () => {
  console.log(`🔭 News Radar running at http://localhost:${PORT}`);
});
