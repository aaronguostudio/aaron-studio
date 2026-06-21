import { createHash } from "crypto";
import type { RewriteContext } from "./rewrite-narration";

const REWRITE_PROMPT_VERSION = "yt-scriptwriting-v2";

function normalizeContext(context: RewriteContext): string {
  return JSON.stringify({
    corePromise: context.corePromise || "",
    hookType: context.hookType || "",
    storyStructure: context.storyStructure || "",
    desiredEmotion: context.desiredEmotion || "",
    bannedPhrases: context.bannedPhrases || [],
    retentionBeats: context.retentionBeats || [],
  });
}

export function rewriteCacheKey(
  originalText: string,
  slideIndex: number,
  context: RewriteContext = {}
): string {
  const hash = createHash("md5")
    .update(`${REWRITE_PROMPT_VERSION}|${normalizeContext(context)}|${originalText}`)
    .digest("hex")
    .slice(0, 12);
  return `rewrite-${String(slideIndex).padStart(2, "0")}-${hash}`;
}
