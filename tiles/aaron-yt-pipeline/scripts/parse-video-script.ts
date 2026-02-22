/**
 * Parse a video-script.md file into structured scene data.
 *
 * Expected format:
 *   ## [SCENE 01: Title — Xs]
 *   **Video prompt:** ...
 *   **Motion:** ...
 *   **Text overlay:** ...
 *   **Narration:**
 *   Text...
 *   ---
 */

import type { VideoScript, VideoScene } from "./shared/types";

const SCENE_HEADER_RE = /^##\s*\[SCENE\s+(\d+):\s*(.+?)(?:\s*[—–\-]\s*(\d+)s?)?\s*\]\s*$/;
const SECTION_DIVIDER = /^---\s*$/;
const FIELD_RE = /^\*\*([^*]+?):\*\*\s*(.+)?$/;
const META_RE = /^\*\*([^*]+?):\*\*\s*(.+)$/;

export function parseVideoScript(content: string): VideoScript {
  const lines = content.split("\n");
  let scriptTitle = "";
  let estimatedLength = "";
  let style = "";
  let aspectRatio = "16:9";
  let resolution = "1920x1080";
  let productionNotes = "";
  let inProductionNotes = false;

  const scenes: VideoScene[] = [];

  // Extract the top-level title
  for (const line of lines) {
    if (line.startsWith("# ") && !line.startsWith("## ")) {
      scriptTitle = line.replace(/^#\s*(?:Video Script:\s*)?/, "").trim();
      break;
    }
  }

  // Extract metadata line (e.g., **Length:** 6-8 minutes  |  **Style:** explainer  |  ...)
  for (const line of lines) {
    if (line.includes("**Length:**") || line.includes("**Style:**")) {
      const parts = line.split("|").map((p) => p.trim());
      for (const part of parts) {
        const match = part.match(META_RE);
        if (match) {
          const key = match[1].trim().toLowerCase();
          const val = match[2].trim();
          if (key === "length") estimatedLength = val;
          else if (key === "style") style = val;
          else if (key === "aspect ratio") aspectRatio = val;
          else if (key === "resolution") resolution = val;
        }
      }
      break;
    }
  }

  let currentScene: Partial<VideoScene> | null = null;
  let currentField: string | null = null;
  let fieldLines: string[] = [];

  function flushField() {
    if (!currentScene || !currentField) return;
    const value = fieldLines.join("\n").trim();
    switch (currentField) {
      case "video prompt":
        currentScene.videoPrompt = value;
        break;
      case "motion":
        currentScene.motion = value;
        break;
      case "text overlay":
        currentScene.textOverlay = value;
        break;
      case "narration":
        currentScene.narration = cleanNarration(value);
        break;
    }
    currentField = null;
    fieldLines = [];
  }

  function flushScene() {
    flushField();
    if (currentScene && currentScene.title) {
      scenes.push({
        index: currentScene.index ?? 0,
        title: currentScene.title ?? "",
        duration: currentScene.duration ?? 8,
        videoPrompt: currentScene.videoPrompt ?? "",
        motion: currentScene.motion,
        textOverlay: currentScene.textOverlay,
        narration: currentScene.narration ?? "",
      });
    }
    currentScene = null;
  }

  for (const line of lines) {
    // Check for production notes section
    if (/^##\s*Production Notes/i.test(line)) {
      flushScene();
      inProductionNotes = true;
      continue;
    }

    if (inProductionNotes) {
      productionNotes += line + "\n";
      continue;
    }

    // Check for scene header
    const headerMatch = line.match(SCENE_HEADER_RE);
    if (headerMatch) {
      flushScene();
      currentScene = {
        index: parseInt(headerMatch[1], 10) - 1, // 0-indexed internally
        title: headerMatch[2].trim(),
        duration: headerMatch[3] ? parseInt(headerMatch[3], 10) : 8,
      };
      continue;
    }

    // Skip section dividers
    if (SECTION_DIVIDER.test(line)) {
      continue;
    }

    // Inside a scene — check for field headers
    if (currentScene) {
      const fieldMatch = line.match(FIELD_RE);
      if (fieldMatch) {
        flushField();
        currentField = fieldMatch[1].trim().toLowerCase();
        const inlineValue = fieldMatch[2]?.trim() || "";
        fieldLines = inlineValue ? [inlineValue] : [];
        continue;
      }

      // Accumulate content for current field
      if (currentField) {
        fieldLines.push(line);
      }
    }
  }

  // Flush last scene
  flushScene();

  return {
    title: scriptTitle,
    estimatedLength,
    style,
    aspectRatio,
    resolution,
    scenes,
    productionNotes: productionNotes.trim() || undefined,
  };
}

function cleanNarration(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1") // strip bold
    .replace(/\*([^*]+)\*/g, "$1") // strip italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // strip links
    .trim();
}
