import db from "./client.js";

async function setup() {
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source TEXT NOT NULL,            -- 'hackernews', 'x-twitter', 'producthunt', etc.
      source_id TEXT,                  -- original ID from source
      url TEXT NOT NULL,
      url_hash TEXT NOT NULL UNIQUE,   -- SHA-256 of URL for dedup
      title TEXT NOT NULL,
      summary TEXT,                    -- AI-generated summary
      author TEXT,
      score INTEGER DEFAULT 0,        -- source score (HN points, likes, etc.)
      relevance INTEGER DEFAULT 0,    -- AI relevance score 1-10
      tags TEXT,                       -- JSON array of tags
      category TEXT,                   -- 'ai', 'fintech', 'indie', 'coding', 'general'
      raw_data TEXT,                   -- JSON blob of original data
      created_at TEXT DEFAULT (datetime('now')),
      collected_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_items_source ON items(source);
    CREATE INDEX IF NOT EXISTS idx_items_relevance ON items(relevance DESC);
    CREATE INDEX IF NOT EXISTS idx_items_created ON items(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
    CREATE INDEX IF NOT EXISTS idx_items_url_hash ON items(url_hash);

    CREATE TABLE IF NOT EXISTS collect_runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source TEXT NOT NULL,
      started_at TEXT DEFAULT (datetime('now')),
      finished_at TEXT,
      items_added INTEGER DEFAULT 0,
      items_skipped INTEGER DEFAULT 0,
      status TEXT DEFAULT 'running',
      error TEXT
    );
  `);

  console.log("✅ Database schema created successfully");
}

setup().catch(console.error);
