/**
 * Parse a youtube-script.md file into structured slide data.
 *
 * Expected format:
 *   ## [SLIDE: Title — image-reference]
 *   Narration text...
 *   ---
 *
 * Progressive builds (optional):
 *   ## [SLIDE: Title — 01a.png]
 *   First narration segment...
 *   [IMAGE: 01b.png]
 *   Second narration segment...
 */

export interface NarrationSegment {
  imageRef: string; // filename reference for this segment's image
  text: string; // narration text for this segment
}

export interface SlideSection {
  index: number;
  title: string;
  imageRef: string; // filename, number prefix, or description
  narration: string;
  imagePath?: string; // resolved absolute path
  narrationSegments?: NarrationSegment[]; // ordered segments for multi-image slides
  allImagePaths?: string[]; // resolved paths: [primary, ...additional]
}

export interface ParsedScript {
  title: string;
  slides: SlideSection[];
  productionNotes?: string;
  hookNarration?: string;
  hookImageRef?: string;
}

const SLIDE_HEADER_RE = /^##\s*\[SLIDE:\s*(.+?)(?:\s*[—–\-]\s*(.+?))?\s*\]\s*$/;
const HOOK_HEADER_RE = /^##\s*\[HOOK(?:\s*:\s*(.+?))?\s*\]\s*$/;
const SECTION_DIVIDER = /^---\s*$/;
const IMAGE_MARKER_RE = /^\[IMAGE:\s*(.+?)\s*\]\s*$/;

export function parseYoutubeScript(content: string): ParsedScript {
  const lines = content.split("\n");
  const slides: SlideSection[] = [];
  let scriptTitle = "";
  let productionNotes = "";
  let inProductionNotes = false;

  // Extract the top-level title
  for (const line of lines) {
    if (line.startsWith("# ") && !line.startsWith("## ")) {
      scriptTitle = line.replace(/^#\s*/, "").trim();
      break;
    }
  }

  // Parse [HOOK] section (appears before first slide)
  let hookNarration: string | undefined;
  let hookImageRef: string | undefined;
  let inHook = false;
  let hookLines: string[] = [];

  let currentSlide: Partial<SlideSection> | null = null;
  let narrationLines: string[] = [];
  // Tracks [IMAGE:] markers found within a slide's narration.
  // Each entry stores the marker's imageRef and the narration lines
  // that were accumulated *before* that marker appeared.
  let imageMarkers: Array<{ imageRef: string; linesBefore: string[] }> = [];
  let slideIndex = 0;

  for (const line of lines) {
    // Check for hook header (before any slide)
    const hookMatch = line.match(HOOK_HEADER_RE);
    if (hookMatch && slides.length === 0 && !currentSlide) {
      inHook = true;
      hookImageRef = hookMatch[1]?.trim() || undefined;
      continue;
    }

    // Check for production notes section
    if (/^##\s*Production Notes/i.test(line)) {
      if (currentSlide) {
        flushSlide(currentSlide, narrationLines, imageMarkers, slides);
        currentSlide = null;
        narrationLines = [];
        imageMarkers = [];
      }
      inProductionNotes = true;
      continue;
    }

    if (inProductionNotes) {
      productionNotes += line + "\n";
      continue;
    }

    // Check for slide header
    const headerMatch = line.match(SLIDE_HEADER_RE);
    if (headerMatch) {
      // Flush hook section if we were in it
      if (inHook) {
        hookNarration = cleanNarration(hookLines);
        inHook = false;
        hookLines = [];
      }
      // Flush previous slide
      if (currentSlide) {
        flushSlide(currentSlide, narrationLines, imageMarkers, slides);
        narrationLines = [];
        imageMarkers = [];
      }

      currentSlide = {
        index: slideIndex++,
        title: headerMatch[1].trim(),
        imageRef: headerMatch[2]?.trim() || "",
        narration: "",
      };
      continue;
    }

    // Skip section dividers (but flush hook if in hook mode)
    if (SECTION_DIVIDER.test(line)) {
      if (inHook) {
        hookNarration = cleanNarration(hookLines);
        inHook = false;
        hookLines = [];
      }
      continue;
    }

    // Accumulate hook narration lines
    if (inHook) {
      hookLines.push(line);
      continue;
    }

    // Accumulate narration lines, detecting [IMAGE:] markers
    if (currentSlide) {
      const imageMatch = line.match(IMAGE_MARKER_RE);
      if (imageMatch) {
        // Save lines accumulated so far as the text before this marker
        imageMarkers.push({
          imageRef: imageMatch[1].trim(),
          linesBefore: [...narrationLines],
        });
        narrationLines = [];
      } else {
        narrationLines.push(line);
      }
    }
  }

  // Flush last slide
  if (currentSlide) {
    flushSlide(currentSlide, narrationLines, imageMarkers, slides);
  }

  return {
    title: scriptTitle,
    slides,
    productionNotes: productionNotes.trim() || undefined,
    hookNarration: hookNarration || undefined,
    hookImageRef: hookImageRef || undefined,
  };
}

function flushSlide(
  slide: Partial<SlideSection>,
  trailingLines: string[],
  markers: Array<{ imageRef: string; linesBefore: string[] }>,
  output: SlideSection[]
): void {
  if (markers.length === 0) {
    // Single-image slide — no change from current behavior
    slide.narration = cleanNarration(trailingLines);
  } else {
    // Multi-image slide: build NarrationSegment[]
    const segments: NarrationSegment[] = [];

    // Segment 0: primary image + text before the first [IMAGE:] marker
    segments.push({
      imageRef: slide.imageRef!,
      text: cleanNarration(markers[0].linesBefore),
    });

    // Segments 1..N: each [IMAGE:] marker + text between it and the next marker
    for (let i = 0; i < markers.length; i++) {
      const textLines =
        i < markers.length - 1 ? markers[i + 1].linesBefore : trailingLines;
      segments.push({
        imageRef: markers[i].imageRef,
        text: cleanNarration(textLines),
      });
    }

    slide.narrationSegments = segments;
    slide.narration = segments
      .map((s) => s.text)
      .filter(Boolean)
      .join("\n\n");
  }

  output.push(slide as SlideSection);
}

function cleanNarration(lines: string[]): string {
  return lines
    .join("\n")
    .replace(/\*\*([^*]+)\*\*/g, "$1") // strip bold markdown
    .replace(/\*([^*]+)\*/g, "$1") // strip italic markdown
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // strip links
    .trim();
}

/**
 * Resolve a single image reference to a file path.
 */
function resolveOneImage(
  ref: string,
  fallbackIndex: number,
  imageFiles: string[],
  imagesDir: string,
  join: (a: string, b: string) => string
): string {
  let resolved: string | undefined;

  // 1. Exact filename match
  if (ref && imageFiles.includes(ref)) {
    resolved = join(imagesDir, ref);
  }

  // 2. Number prefix match (e.g., "01" matches "01-scene-something.png")
  if (!resolved && ref && /^\d+$/.test(ref)) {
    const match = imageFiles.find((f) => f.startsWith(ref));
    if (match) {
      resolved = join(imagesDir, match);
    }
  }

  // 3. Partial filename match
  if (!resolved && ref) {
    const refLower = ref.toLowerCase().replace(/\s+/g, "-");
    const match = imageFiles.find((f) => f.toLowerCase().includes(refLower));
    if (match) {
      resolved = join(imagesDir, match);
    }
  }

  // 4. Order-based fallback: use the provided index
  if (!resolved && fallbackIndex < imageFiles.length) {
    resolved = join(imagesDir, imageFiles[fallbackIndex]);
  }

  if (!resolved) {
    throw new Error(
      `Could not resolve image for ref "${ref}" (fallback index: ${fallbackIndex})`
    );
  }

  return resolved;
}

/**
 * Resolve image references to actual file paths.
 */
export async function resolveImagePaths(
  slides: SlideSection[],
  imagesDir: string
): Promise<SlideSection[]> {
  const { readdirSync } = await import("fs");
  const { join } = await import("path");

  let imageFiles: string[];
  try {
    imageFiles = readdirSync(imagesDir)
      .filter((f) => /\.(png|jpe?g|webp|gif|bmp|tiff?)$/i.test(f))
      .sort();
  } catch {
    throw new Error(`Images directory not found: ${imagesDir}`);
  }

  return slides.map((slide) => {
    // Resolve primary image
    const primaryPath = resolveOneImage(
      slide.imageRef,
      slide.index,
      imageFiles,
      imagesDir,
      join
    );

    // Resolve additional images from narration segments
    let allImagePaths: string[] | undefined;
    if (slide.narrationSegments && slide.narrationSegments.length > 1) {
      allImagePaths = slide.narrationSegments.map((seg, i) => {
        if (i === 0) return primaryPath;
        return resolveOneImage(
          seg.imageRef,
          slide.index,
          imageFiles,
          imagesDir,
          join
        );
      });
    }

    return { ...slide, imagePath: primaryPath, allImagePaths };
  });
}
