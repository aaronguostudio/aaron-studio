/**
 * Shared environment and preference loading for aaron-yt-pipeline.
 * Follows the same pattern as aaron-video-gen.
 */

import { existsSync, readFileSync } from "fs";
import { join } from "path";

const homeDir = process.env.HOME || process.env.USERPROFILE || "";

// ---------------------------------------------------------------------------
// Environment variable loading
// ---------------------------------------------------------------------------

export function loadEnvFile(filePath: string): void {
  if (!existsSync(filePath)) return;
  const content = readFileSync(filePath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

export function loadAllEnvFiles(): void {
  // Lower priority first, higher priority overwrites
  loadEnvFile(join(homeDir, ".baoyu-skills", ".env"));
  loadEnvFile(join(homeDir, ".aaron-skills", ".env"));
  loadEnvFile(join(process.cwd(), ".baoyu-skills", ".env"));
  loadEnvFile(join(process.cwd(), ".aaron-skills", ".env"));
  loadEnvFile(join(process.cwd(), ".env"));
}

// ---------------------------------------------------------------------------
// Preferences loading (EXTEND.md)
// ---------------------------------------------------------------------------

export interface PipelinePreferences {
  // Channel
  channel_name?: string;
  niche?: string;
  content_pillars?: string[];
  competitor_channels?: string[];
  language?: string;

  // Video defaults
  preferred_video_length?: string;
  default_style?: string;
  resolution?: string;
  aspect_ratio?: string;

  // AI video generation
  video_provider?: string;
  video_model?: string;
  variations_per_scene?: number;

  // TTS
  tts_provider?: string;
  voice?: string;

  // Post-production
  transition?: string;
  transition_duration?: number;
  music_volume?: number;
  fps?: number;

  // YouTube
  youtube_default_privacy?: string;
  youtube_category?: string;
}

export function loadPreferences(): PipelinePreferences {
  const paths = [
    join(homeDir, ".aaron-skills", "aaron-yt-pipeline", "EXTEND.md"),
    join(process.cwd(), ".aaron-skills", "aaron-yt-pipeline", "EXTEND.md"),
  ];

  let prefs: PipelinePreferences = {};
  for (const p of paths) {
    if (!existsSync(p)) continue;
    const content = readFileSync(p, "utf-8");
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (match) {
      for (const line of match[1].split("\n")) {
        const colonIdx = line.indexOf(":");
        if (colonIdx === -1) continue;
        const key = line.slice(0, colonIdx).trim();
        const rawVal = line.slice(colonIdx + 1).trim();

        // Handle YAML arrays: ["item1", "item2"]
        if (rawVal.startsWith("[") && rawVal.endsWith("]")) {
          try {
            (prefs as any)[key] = JSON.parse(rawVal);
          } catch {
            (prefs as any)[key] = rawVal;
          }
        } else if (!isNaN(Number(rawVal)) && rawVal !== "") {
          (prefs as any)[key] = Number(rawVal);
        } else {
          (prefs as any)[key] = rawVal;
        }
      }
    }
  }
  return prefs;
}
