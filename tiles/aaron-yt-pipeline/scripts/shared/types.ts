/**
 * Shared TypeScript interfaces for aaron-yt-pipeline.
 */

// ---------------------------------------------------------------------------
// Video Script Types
// ---------------------------------------------------------------------------

export interface VideoScript {
  title: string;
  estimatedLength: string;
  style: string;
  aspectRatio: string;
  resolution: string;
  scenes: VideoScene[];
  productionNotes?: string;
}

export interface VideoScene {
  index: number;
  title: string;
  duration: number; // seconds
  videoPrompt: string;
  motion?: string;
  textOverlay?: string;
  narration: string;
}

// ---------------------------------------------------------------------------
// Video Generation Types
// ---------------------------------------------------------------------------

export type VideoProvider = "kling" | "veo" | "runway" | "minimax";

export interface VideoGenRequest {
  provider: VideoProvider;
  prompt: string;
  negativePrompt?: string;
  duration: number; // seconds
  aspectRatio: string; // "16:9", "9:16", "1:1"
  referenceImage?: string; // path for image-to-video mode
  model?: string; // specific model version
  outputPath: string;
}

export interface VideoGenResult {
  videoPath: string;
  duration: number;
  provider: string;
  taskId: string;
  cost?: number;
}

// ---------------------------------------------------------------------------
// Trend Scout Types
// ---------------------------------------------------------------------------

export interface TrendIdea {
  rank: number;
  score: number;
  title: string;
  hook: string;
  whyNow: string;
  yourAngle: string;
  competition: "low" | "medium" | "high";
  viewsPotential: "low" | "medium" | "high";
  sources: string[];
}

export interface TrendResearch {
  niche: string;
  date: string;
  ideas: TrendIdea[];
  rawSignals: TrendSignal[];
}

export interface TrendSignal {
  source: string;
  topic: string;
  engagement: string;
  url?: string;
}

// ---------------------------------------------------------------------------
// YouTube Metadata Types
// ---------------------------------------------------------------------------

export interface VideoMetadata {
  title: string;
  description: string;
  tags: string[];
  category: string;
  language: string;
  privacy: "public" | "unlisted" | "private";
  thumbnailPath?: string;
}
