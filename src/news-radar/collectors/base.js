import { createHash } from "crypto";
import db from "../db/client.js";

export function hashUrl(url) {
  return createHash("sha256").update(url).digest("hex");
}

export async function insertItem(item) {
  const urlHash = hashUrl(item.url);
  try {
    await db.execute({
      sql: `INSERT INTO items (source, source_id, url, url_hash, title, summary, author, score, relevance, tags, category, raw_data)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        item.source,
        item.source_id || null,
        item.url,
        urlHash,
        item.title,
        item.summary || null,
        item.author || null,
        item.score || 0,
        item.relevance || 0,
        item.tags ? JSON.stringify(item.tags) : null,
        item.category || "general",
        item.raw_data ? JSON.stringify(item.raw_data) : null,
      ],
    });
    return true; // inserted
  } catch (e) {
    if (e.message?.includes("UNIQUE")) return false; // duplicate
    throw e;
  }
}

export async function startRun(source) {
  const result = await db.execute({
    sql: `INSERT INTO collect_runs (source) VALUES (?)`,
    args: [source],
  });
  return result.lastInsertRowid;
}

export async function finishRun(runId, added, skipped, error = null) {
  await db.execute({
    sql: `UPDATE collect_runs SET finished_at = datetime('now'), items_added = ?, items_skipped = ?, status = ?, error = ? WHERE id = ?`,
    args: [added, skipped, error ? "error" : "ok", error, runId],
  });
}
