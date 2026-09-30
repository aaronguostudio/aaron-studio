#!/usr/bin/env bun
/**
 * YouTube video upload via YouTube Data API v3 (resumable upload).
 *
 * Usage:
 *   npx -y bun youtube-upload.ts \
 *     --video final.mp4 \
 *     --metadata metadata.yaml \
 *     [--thumbnail thumbnail.png] \
 *     [--privacy unlisted]
 */

import { existsSync, readFileSync, statSync, createReadStream } from "fs";
import { execFileSync } from "child_process";
import { resolve } from "path";
import { loadAllEnvFiles } from "./shared/env";
import { getAccessToken, getAuthenticatedChannel } from "./youtube-auth";

loadAllEnvFiles();

const YOUTUBE_UPLOAD_URL = "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status";
const YOUTUBE_THUMBNAILS_URL = "https://www.googleapis.com/upload/youtube/v3/thumbnails/set";

// ---------------------------------------------------------------------------
// Metadata parsing (simple YAML)
// ---------------------------------------------------------------------------

interface VideoMetadata {
  title: string;
  description: string;
  tags: string[];
  category: string;
  language: string;
  privacy: string;
  publishAt?: string; // ISO 8601 datetime for scheduled publishing
  containsSyntheticMedia?: boolean; // YouTube's altered or synthetic content disclosure
}

function parseMetadataYaml(content: string): VideoMetadata {
  const meta: any = {};
  let inDescription = false;
  let descLines: string[] = [];
  let currentArrayKey: string | null = null;

  for (const line of content.split("\n")) {
    if (inDescription) {
      if (line.match(/^\S/) && !line.startsWith("  ") && !line.startsWith("\t")) {
        inDescription = false;
        meta.description = descLines.join("\n").trim();
      } else {
        descLines.push(line.replace(/^  /, ""));
        continue;
      }
    }

    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    if (currentArrayKey && trimmed.startsWith("- ")) {
      meta[currentArrayKey].push(trimmed.slice(2).trim().replace(/^["']|["']$/g, ""));
      continue;
    }

    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;

    const key = line.slice(0, colonIdx).trim();
    const rawVal = line.slice(colonIdx + 1).trim();
    currentArrayKey = null;

    if (key === "description" && (rawVal === "|" || rawVal === "")) {
      inDescription = true;
      descLines = [];
      continue;
    }

    if (rawVal === "") {
      meta[key] = [];
      currentArrayKey = key;
      continue;
    }

    if (rawVal.startsWith("- ")) {
      // Start of YAML array — collect subsequent lines
      if (!meta[key]) meta[key] = [];
      meta[key].push(rawVal.slice(2).trim().replace(/^["']|["']$/g, ""));
      currentArrayKey = key;
      continue;
    }

    if (line.startsWith("  - ")) {
      // Continuation of YAML array
      const lastKey = Object.keys(meta).pop();
      if (lastKey && Array.isArray(meta[lastKey])) {
        meta[lastKey].push(line.slice(4).trim().replace(/^["']|["']$/g, ""));
      }
      continue;
    }

    meta[key] = rawVal.replace(/^["']|["']$/g, "");
  }

  if (inDescription) {
    meta.description = descLines.join("\n").trim();
  }

  return {
    title: meta.title || "Untitled Video",
    description: meta.description || "",
    tags: meta.tags || [],
    category: meta.category || "28", // Science & Technology
    language: meta.language || "en",
    privacy: meta.privacy || "unlisted",
    publishAt: meta.publishAt || undefined,
    containsSyntheticMedia: meta.contains_synthetic_media === undefined ? undefined : meta.contains_synthetic_media === "true",
  };
}

// ---------------------------------------------------------------------------
// Resumable upload
// ---------------------------------------------------------------------------

async function initiateUpload(
  accessToken: string,
  metadata: VideoMetadata,
  fileSize: number
): Promise<string> {
  const body = {
    snippet: {
      title: metadata.title,
      description: metadata.description,
      tags: metadata.tags,
      categoryId: metadata.category,
      defaultLanguage: metadata.language,
    },
    status: {
      privacyStatus: metadata.publishAt ? "private" : metadata.privacy,
      selfDeclaredMadeForKids: false,
      // Set explicitly: without them the channel default made a 2026-09-30 upload
      // non-embeddable, which breaks the blog's video embed.
      embeddable: true,
      publicStatsViewable: true,
      ...(metadata.publishAt ? { publishAt: metadata.publishAt } : {}),
      ...(metadata.containsSyntheticMedia === undefined ? {} : { containsSyntheticMedia: metadata.containsSyntheticMedia }),
    },
  };

  const res = await fetch(YOUTUBE_UPLOAD_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=UTF-8",
      "X-Upload-Content-Length": String(fileSize),
      "X-Upload-Content-Type": "video/mp4",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Upload initiation failed (${res.status}): ${errText}`);
  }

  const uploadUrl = res.headers.get("location");
  if (!uploadUrl) {
    throw new Error("No upload URL returned from YouTube API");
  }

  return uploadUrl;
}

async function uploadVideoChunks(
  uploadUrl: string,
  videoPath: string,
  fileSize: number
): Promise<string> {
  // Read the entire file and upload in one go (for files < 500MB)
  // For larger files, chunk uploading would be needed
  const fileBuffer = readFileSync(videoPath);

  console.log(`[upload] Uploading ${(fileSize / 1024 / 1024).toFixed(1)} MB...`);

  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Length": String(fileSize),
      "Content-Type": "video/mp4",
    },
    body: fileBuffer,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Video upload failed (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.id; // YouTube video ID
}

/**
 * YouTube rejects thumbnails above 2 MB with a generic "invalid image content"
 * 400 that reads like a format problem (hit 2026-08-16: a 3.56 MB 2048x1152
 * PNG). Downscale to 1280x720 JPEG when the source is over the limit, so a
 * legitimate cover never fails on size alone.
 */
const YOUTUBE_THUMBNAIL_MAX_BYTES = 2 * 1024 * 1024;

function prepareThumbnail(thumbnailPath: string): string {
  const bytes = readFileSync(thumbnailPath).length;
  if (bytes <= YOUTUBE_THUMBNAIL_MAX_BYTES) return thumbnailPath;
  const converted = thumbnailPath.replace(/\.[^.]+$/, "") + "-yt.jpg";
  console.log(
    `[upload] Thumbnail is ${(bytes / 1048576).toFixed(2)} MB (limit 2 MB); converting to 1280x720 JPEG.`
  );
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", thumbnailPath, "-vf", "scale=1280:720", "-q:v", "3", converted]);
  return converted;
}

async function setThumbnail(
  accessToken: string,
  videoId: string,
  rawThumbnailPath: string
): Promise<void> {
  const thumbnailPath = prepareThumbnail(rawThumbnailPath);
  const thumbnailBuffer = readFileSync(thumbnailPath);
  const contentType = thumbnailPath.endsWith(".png") ? "image/png" : "image/jpeg";

  const res = await fetch(`${YOUTUBE_THUMBNAILS_URL}?videoId=${videoId}&uploadType=media`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": contentType,
      "Content-Length": String(thumbnailBuffer.length),
    },
    body: thumbnailBuffer,
  });

  if (!res.ok) {
    const errText = await res.text();
    console.warn(`[upload] Thumbnail upload failed (${res.status}): ${errText}`);
  } else {
    console.log("[upload] Thumbnail set successfully.");
  }
}

// ---------------------------------------------------------------------------
// Update privacy status
// ---------------------------------------------------------------------------

export async function updatePrivacy(videoId: string, privacy: string): Promise<void> {
  const accessToken = await getAccessToken();

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=status`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: videoId,
        status: { privacyStatus: privacy },
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Privacy update failed (${res.status}): ${errText}`);
  }

  console.log(`[upload] Privacy updated to: ${privacy}`);
}

// ---------------------------------------------------------------------------
// CLI entrypoint
// ---------------------------------------------------------------------------

function parseArgs(): Record<string, string> {
  const args: Record<string, string> = {};
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--video") args.video = argv[++i];
    else if (arg === "--metadata") args.metadata = argv[++i];
    else if (arg === "--thumbnail") args.thumbnail = argv[++i];
    else if (arg === "--privacy") args.privacy = argv[++i];
    else if (arg === "--schedule") args.schedule = argv[++i]; // ISO 8601 datetime
    else if (arg === "--make-public") args.makePublic = argv[++i]; // video ID
    else if (arg === "--set-thumbnail") args.setThumbnail = argv[++i]; // video ID
    else if (arg === "--expect-handle") args.expectHandle = argv[++i]; // e.g. @visual-and-sound
  }
  return args;
}

// Refuse to act when the token belongs to a different channel than the caller intends.
async function assertChannel(expectHandle?: string): Promise<void> {
  const channel = await getAuthenticatedChannel();
  console.log(`[upload] Authenticated channel: ${channel.title} ${channel.handle} (${channel.id})`);
  if (expectHandle && channel.handle !== expectHandle.toLowerCase()) {
    throw new Error(`Channel mismatch: token is for ${channel.handle || channel.title}, expected ${expectHandle}. Nothing was uploaded.`);
  }
}

async function main() {
  const args = parseArgs();
  await assertChannel(args.expectHandle);

  // Handle --make-public subcommand
  if (args.makePublic) {
    await updatePrivacy(args.makePublic, "public");
    console.log(`Video ${args.makePublic} is now public.`);
    return;
  }

  if (args.setThumbnail) {
    if (!args.thumbnail) {
      console.error("Usage: youtube-upload.ts --set-thumbnail <video-id> --thumbnail <img>");
      process.exit(1);
    }
    const accessToken = await getAccessToken();
    const thumbnailPath = resolve(args.thumbnail);
    if (!existsSync(thumbnailPath)) throw new Error(`Thumbnail not found: ${thumbnailPath}`);
    await setThumbnail(accessToken, args.setThumbnail, thumbnailPath);
    console.log(`[upload] Thumbnail updated for: https://youtu.be/${args.setThumbnail}`);
    return;
  }

  if (!args.video || !args.metadata) {
    console.error("Usage: youtube-upload.ts --video <file> --metadata <yaml> [--thumbnail <img>] [--privacy unlisted] [--schedule <ISO8601>]");
    console.error("       youtube-upload.ts --make-public <video-id>");
    console.error("\nSchedule example: --schedule 2026-02-25T08:00:00-07:00");
    process.exit(1);
  }

  const videoPath = resolve(args.video);
  const metadataPath = resolve(args.metadata);

  if (!existsSync(videoPath)) throw new Error(`Video not found: ${videoPath}`);
  if (!existsSync(metadataPath)) throw new Error(`Metadata not found: ${metadataPath}`);

  const metadata = parseMetadataYaml(readFileSync(metadataPath, "utf-8"));
  if (args.privacy) metadata.privacy = args.privacy;
  if (args.schedule) metadata.publishAt = args.schedule;

  const fileSize = statSync(videoPath).size;
  const accessToken = await getAccessToken();

  console.log(`\n[upload] Title: "${metadata.title}"`);
  console.log(`[upload] Privacy: ${metadata.publishAt ? "private (scheduled)" : metadata.privacy}`);
  if (metadata.publishAt) console.log(`[upload] Scheduled: ${metadata.publishAt}`);
  console.log(`[upload] File: ${videoPath} (${(fileSize / 1024 / 1024).toFixed(1)} MB)`);

  // Step 1: Initiate resumable upload
  console.log("\n[upload] Initiating upload...");
  const uploadUrl = await initiateUpload(accessToken, metadata, fileSize);

  // Step 2: Upload video data
  const videoId = await uploadVideoChunks(uploadUrl, videoPath, fileSize);
  console.log(`\n[upload] Upload complete!`);
  console.log(`[upload] Video ID: ${videoId}`);
  console.log(`[upload] URL: https://youtu.be/${videoId}`);

  // Step 3: Set thumbnail if provided
  if (args.thumbnail) {
    const thumbnailPath = resolve(args.thumbnail);
    if (existsSync(thumbnailPath)) {
      console.log("\n[upload] Setting thumbnail...");
      await setThumbnail(accessToken, videoId, thumbnailPath);
    } else {
      console.warn(`[upload] Thumbnail not found: ${thumbnailPath}`);
    }
  }

  console.log(`\n[upload] Done! Video available at: https://youtu.be/${videoId}`);
  if (metadata.publishAt) {
    console.log(`[upload] Status: Scheduled for ${metadata.publishAt}`);
  } else {
    console.log(`[upload] Status: ${metadata.privacy}`);
  }
}

main().catch((err) => {
  console.error(`\nError: ${err.message}`);
  process.exit(1);
});
