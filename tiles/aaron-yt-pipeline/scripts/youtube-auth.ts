#!/usr/bin/env bun
/**
 * YouTube OAuth2 authentication for YouTube Data API v3.
 *
 * Subcommands:
 *   --setup    Interactive OAuth2 setup (one-time)
 *   --check    Check if authenticated
 *   --refresh  Force token refresh
 *
 * Usage:
 *   npx -y bun youtube-auth.ts --setup
 *   npx -y bun youtube-auth.ts --check
 *   npx -y bun youtube-auth.ts --refresh
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { loadAllEnvFiles } from "./shared/env";

loadAllEnvFiles();

const homeDir = process.env.HOME || process.env.USERPROFILE || "";
const TOKENS_DIR = join(homeDir, ".aaron-skills", "aaron-yt-pipeline");
const TOKENS_PATH = join(TOKENS_DIR, "youtube-tokens.json");

const GOOGLE_OAUTH_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";
const YOUTUBE_UPLOAD_SCOPE = "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube";
const REDIRECT_URI = "urn:ietf:wg:oauth:2.0:oob"; // manual copy-paste flow

interface Tokens {
  access_token: string;
  refresh_token: string;
  expires_at: number; // epoch ms
  token_type: string;
}

// ---------------------------------------------------------------------------
// Token management
// ---------------------------------------------------------------------------

function loadTokens(): Tokens | null {
  if (!existsSync(TOKENS_PATH)) return null;
  try {
    return JSON.parse(readFileSync(TOKENS_PATH, "utf-8"));
  } catch {
    return null;
  }
}

function saveTokens(tokens: Tokens): void {
  if (!existsSync(TOKENS_DIR)) {
    mkdirSync(TOKENS_DIR, { recursive: true });
  }
  writeFileSync(TOKENS_PATH, JSON.stringify(tokens, null, 2));
}

function getClientCredentials(): { clientId: string; clientSecret: string } {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error(
      "YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET must be set.\n\n" +
      "Setup instructions:\n" +
      "1. Go to https://console.cloud.google.com/apis/credentials\n" +
      "2. Create a project (or select existing)\n" +
      "3. Enable 'YouTube Data API v3'\n" +
      "4. Create OAuth 2.0 credentials (Desktop application type)\n" +
      "5. Add YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET to your .env file"
    );
  }
  return { clientId, clientSecret };
}

// ---------------------------------------------------------------------------
// OAuth2 flows
// ---------------------------------------------------------------------------

async function setup(): Promise<void> {
  const { clientId, clientSecret } = getClientCredentials();

  // Build authorization URL
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: YOUTUBE_UPLOAD_SCOPE,
    access_type: "offline",
    prompt: "consent",
  });

  const authUrl = `${GOOGLE_OAUTH_AUTH_URL}?${params.toString()}`;

  console.log("\n=== YouTube OAuth2 Setup ===\n");
  console.log("1. Open this URL in your browser:\n");
  console.log(`   ${authUrl}\n`);
  console.log("2. Sign in and grant permissions");
  console.log("3. Copy the authorization code from the page");
  console.log("4. Paste it below:\n");

  // Read authorization code from stdin
  process.stdout.write("Authorization code: ");
  const code = await readLine();

  if (!code.trim()) {
    throw new Error("No authorization code provided");
  }

  // Exchange code for tokens
  console.log("\nExchanging code for tokens...");

  const tokenRes = await fetch(GOOGLE_OAUTH_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: code.trim(),
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text();
    throw new Error(`Token exchange failed (${tokenRes.status}): ${errText}`);
  }

  const tokenData = await tokenRes.json();

  const tokens: Tokens = {
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token,
    expires_at: Date.now() + (tokenData.expires_in - 60) * 1000,
    token_type: tokenData.token_type,
  };

  saveTokens(tokens);
  console.log(`\nAuthentication successful! Tokens saved to ${TOKENS_PATH}`);
}

async function check(): Promise<void> {
  const tokens = loadTokens();
  if (!tokens) {
    console.log("NOT_AUTHENTICATED");
    console.error("Not authenticated. Run with --setup to authenticate.");
    process.exit(1);
  }

  // Check if token is expired
  if (Date.now() > tokens.expires_at) {
    console.log("TOKEN_EXPIRED");
    console.error("Token expired. Run with --refresh to refresh.");
    process.exit(1);
  }

  // Verify token by calling YouTube API
  const res = await fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  if (res.ok) {
    const data = await res.json();
    const channel = data.items?.[0]?.snippet;
    console.log("AUTHENTICATED");
    if (channel) {
      console.log(`Channel: ${channel.title}`);
    }
  } else if (res.status === 401) {
    console.log("TOKEN_EXPIRED");
    console.error("Token expired. Attempting refresh...");
    await refresh();
  } else {
    console.log("ERROR");
    console.error(`YouTube API error (${res.status}): ${await res.text()}`);
    process.exit(1);
  }
}

async function refresh(): Promise<void> {
  const tokens = loadTokens();
  if (!tokens?.refresh_token) {
    throw new Error("No refresh token found. Run with --setup to re-authenticate.");
  }

  const { clientId, clientSecret } = getClientCredentials();

  const tokenRes = await fetch(GOOGLE_OAUTH_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: tokens.refresh_token,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
    }),
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text();
    throw new Error(`Token refresh failed (${tokenRes.status}): ${errText}`);
  }

  const tokenData = await tokenRes.json();

  tokens.access_token = tokenData.access_token;
  tokens.expires_at = Date.now() + (tokenData.expires_in - 60) * 1000;

  saveTokens(tokens);
  console.log("Token refreshed successfully.");
}

/**
 * Get a valid access token (auto-refreshes if expired).
 * Exported for use by youtube-upload.ts.
 */
export async function getAccessToken(): Promise<string> {
  let tokens = loadTokens();
  if (!tokens) {
    throw new Error("Not authenticated. Run youtube-auth.ts --setup first.");
  }

  if (Date.now() > tokens.expires_at) {
    await refresh();
    tokens = loadTokens()!;
  }

  return tokens.access_token;
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function readLine(): Promise<string> {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
      if (data.includes("\n")) {
        process.stdin.pause();
        resolve(data.trim());
      }
    });
    process.stdin.resume();
  });
}

// ---------------------------------------------------------------------------
// CLI entrypoint
// ---------------------------------------------------------------------------

async function main() {
  const arg = process.argv[2];

  if (arg === "--setup") {
    await setup();
  } else if (arg === "--check") {
    await check();
  } else if (arg === "--refresh") {
    await refresh();
  } else {
    console.error("Usage: youtube-auth.ts <--setup|--check|--refresh>");
    process.exit(1);
  }
}

// Only run CLI when invoked directly (not when imported)
if (import.meta.main) {
  main().catch((err) => {
    console.error(`\nError: ${err.message}`);
    process.exit(1);
  });
}
