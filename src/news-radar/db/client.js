import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env manually (no extra deps)
function loadEnv() {
  const envPaths = [
    resolve(__dirname, "../.env"),
    resolve(__dirname, "../../../.env"),
  ];

  for (const envPath of envPaths) {
    try {
      const lines = readFileSync(envPath, "utf-8").split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eq = trimmed.indexOf("=");
        if (eq === -1) continue;
        const key = trimmed.slice(0, eq);
        const rawVal = trimmed.slice(eq + 1).trim();
        const val = rawVal.replace(/^("|')(.*)\1$/, "$2");
        if (!process.env[key]) process.env[key] = val;
      }
      if (process.env.TURSO_URL && process.env.TURSO_AUTH_TOKEN) break;
    } catch {}
  }
}

loadEnv();

const db = createClient({
  url: process.env.TURSO_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export default db;
