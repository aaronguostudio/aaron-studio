/**
 * Bridge between Bun orchestration (main.ts) and Remotion CLI rendering.
 *
 * Copies images/audio into Remotion's public/ directory, writes a props
 * JSON file, invokes `npx remotion render`, and cleans up.
 */

import { execSync } from "child_process";
import {
  existsSync,
  mkdirSync,
  copyFileSync,
  unlinkSync,
  readdirSync,
  rmdirSync,
  writeFileSync,
} from "fs";
import { join, basename, dirname } from "path";
import type { Animation, ImageChangeTiming, VideoInputProps, WordTiming } from "../remotion/src/types";

export interface RemotionSlideInput {
  title: string;
  narration: string;
  imagePath: string;
  audioPath: string;
  audioDuration: number;
  animation: Animation;
  wordTimings?: WordTiming[];
  additionalImagePaths?: string[];       // extra images for progressive builds
  imageChangeTimings?: ImageChangeTiming[]; // when to crossfade to each
}

export interface RemotionRenderOptions {
  slides: RemotionSlideInput[];
  videoTitle: string;
  outputPath: string;
  fps: number;
  transitionDuration: number;
  padding: number;
  musicPath?: string;
  musicVolume?: number;
  logoPath?: string;
  slogan?: string;
  website?: string;
}

const REMOTION_DIR = join(dirname(__filename), "..", "remotion");

function ensureDir(dir: string): void {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function safeCopy(source: string, dest: string): void {
  if (existsSync(dest)) {
    unlinkSync(dest);
  }
  copyFileSync(source, dest);
}

function cleanDir(dir: string): void {
  if (!existsSync(dir)) return;
  for (const file of readdirSync(dir)) {
    const filePath = join(dir, file);
    try {
      unlinkSync(filePath);
    } catch {}
  }
  try {
    rmdirSync(dir);
  } catch {}
}

export async function renderWithRemotion(
  options: RemotionRenderOptions
): Promise<void> {
  const publicDir = join(REMOTION_DIR, "public");
  const slidesDir = join(publicDir, "slides");
  const audioDir = join(publicDir, "audio");
  const propsPath = join(REMOTION_DIR, ".tmp-props.json");

  try {
    // 1. Ensure public directories exist
    ensureDir(slidesDir);
    ensureDir(audioDir);

    // 2. Copy images and audio into Remotion public dir
    for (const slide of options.slides) {
      safeCopy(
        slide.imagePath,
        join(slidesDir, basename(slide.imagePath))
      );
      safeCopy(
        slide.audioPath,
        join(audioDir, basename(slide.audioPath))
      );
      // Copy additional images for progressive builds
      if (slide.additionalImagePaths) {
        for (const imgPath of slide.additionalImagePaths) {
          safeCopy(imgPath, join(slidesDir, basename(imgPath)));
        }
      }
    }

    // 3. Copy music file if provided
    let musicFile: string | undefined;
    if (options.musicPath && existsSync(options.musicPath)) {
      const musicFilename = basename(options.musicPath);
      safeCopy(options.musicPath, join(audioDir, musicFilename));
      musicFile = `audio/${musicFilename}`;
    }

    // 3b. Copy logo file if provided
    let logoFile: string | undefined;
    if (options.logoPath && existsSync(options.logoPath)) {
      const logoFilename = basename(options.logoPath);
      safeCopy(options.logoPath, join(slidesDir, logoFilename));
      logoFile = `slides/${logoFilename}`;
    }

    // 4. Build props JSON
    const props: VideoInputProps = {
      videoTitle: options.videoTitle,
      fps: options.fps,
      transitionDurationSec: options.transitionDuration,
      paddingSec: options.padding,
      musicFile,
      musicVolume: options.musicVolume,
      logoFile,
      slogan: options.slogan,
      website: options.website,
      slides: options.slides.map((s, i) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const slideData: any = {
          index: i,
          title: s.title,
          narration: s.narration,
          imageFile: `slides/${basename(s.imagePath)}`,
          audioFile: `audio/${basename(s.audioPath)}`,
          audioDuration: s.audioDuration,
          animation: s.animation,
          wordTimings: s.wordTimings,
        };

        // Progressive build data
        if (s.additionalImagePaths && s.additionalImagePaths.length > 0) {
          slideData.imageFiles = [
            `slides/${basename(s.imagePath)}`,
            ...s.additionalImagePaths.map((p) => `slides/${basename(p)}`),
          ];
          slideData.imageChangeTimings = s.imageChangeTimings;
        }

        return slideData;
      }),
    };

    writeFileSync(propsPath, JSON.stringify(props, null, 2));

    // 5. Ensure dependencies are installed
    const nodeModules = join(REMOTION_DIR, "node_modules");
    if (!existsSync(nodeModules)) {
      console.log("[remotion] Installing dependencies (first run)...");
      execSync("npm install", {
        cwd: REMOTION_DIR,
        stdio: "inherit",
        timeout: 120_000,
      });
    }

    // 6. Invoke Remotion render
    const cmd = [
      "npx",
      "remotion",
      "render",
      "src/index.ts",
      "SlideshowVideo",
      "--output",
      `"${options.outputPath}"`,
      "--props",
      `"${propsPath}"`,
      "--concurrency",
      "50%",
    ].join(" ");

    console.log(`[remotion] Rendering video...`);
    execSync(cmd, {
      cwd: REMOTION_DIR,
      stdio: "inherit",
      timeout: 600_000,
    });
  } finally {
    // 7. Cleanup temp files
    cleanDir(slidesDir);
    cleanDir(audioDir);
    if (existsSync(propsPath)) {
      try {
        unlinkSync(propsPath);
      } catch {}
    }
  }
}
