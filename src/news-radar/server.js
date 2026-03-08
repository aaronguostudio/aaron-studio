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

async function handleAPI(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === "/api/items") {
    const source = url.searchParams.get("source");
    const category = url.searchParams.get("category");
    const minRelevance = parseInt(url.searchParams.get("minRelevance") || "0");
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 200);
    const offset = parseInt(url.searchParams.get("offset") || "0");
    const search = url.searchParams.get("q");

    let where = ["1=1"];
    let args = [];

    if (source) { where.push("source = ?"); args.push(source); }
    if (category) { where.push("category = ?"); args.push(category); }
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

    res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
    res.end(JSON.stringify({
      items: result.rows,
      total: countResult.rows[0].total,
      limit,
      offset,
    }));
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
    res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
    res.end(JSON.stringify({ sources: stats.rows, categories: categories.rows }));
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
    res.writeHead(500);
    res.end(e.message);
  }
});

server.listen(PORT, () => {
  console.log(`🔭 News Radar running at http://localhost:${PORT}`);
});
