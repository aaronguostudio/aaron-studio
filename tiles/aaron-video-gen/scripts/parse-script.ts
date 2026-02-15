/**
 * Parse a youtube-script.md file into structured slide data.
 *
 * Expected format:
 *   ## [SLIDE: Title — image-reference]
 *   Narration text...
 *   ---
 */

export interface SlideSection {
  index: number;
  title: string;
  imageRef: string; // filename, number prefix, or description
  narration: string;
  imagePath?: string; // resolved absolute path
}

export interface ParsedScript {
  title: string;
  slides: SlideSection[];
  productionNotes?: string;
}

const SLIDE_HEADER_RE = /^##\s*\[SLIDE:\s*(.+?)(?:\s*[—–\-]\s*(.+?))?\s*\]\s*$/;
const SECTION_DIVIDER = /^---\s*$/;

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

  let currentSlide: Partial<SlideSection> | null = null;
  let narrationLines: string[] = [];
  let slideIndex = 0;

  for (const line of lines) {
    // Check for production notes section
    if (/^##\s*Production Notes/i.test(line)) {
      // Flush current slide
      if (currentSlide) {
        currentSlide.narration = cleanNarration(narrationLines);
        slides.push(currentSlide as SlideSection);
        currentSlide = null;
        narrationLines = [];
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
      // Flush previous slide
      if (currentSlide) {
        currentSlide.narration = cleanNarration(narrationLines);
        slides.push(currentSlide as SlideSection);
        narrationLines = [];
      }

      currentSlide = {
        index: slideIndex++,
        title: headerMatch[1].trim(),
        imageRef: headerMatch[2]?.trim() || "",
        narration: "",
      };
      continue;
    }

    // Skip section dividers
    if (SECTION_DIVIDER.test(line)) {
      continue;
    }

    // Accumulate narration lines
    if (currentSlide) {
      narrationLines.push(line);
    }
  }

  // Flush last slide
  if (currentSlide) {
    currentSlide.narration = cleanNarration(narrationLines);
    slides.push(currentSlide as SlideSection);
  }

  return {
    title: scriptTitle,
    slides,
    productionNotes: productionNotes.trim() || undefined,
  };
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
    const ref = slide.imageRef;
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
      const match = imageFiles.find((f) =>
        f.toLowerCase().includes(refLower)
      );
      if (match) {
        resolved = join(imagesDir, match);
      }
    }

    // 4. Order-based fallback: use the slide index
    if (!resolved && slide.index < imageFiles.length) {
      resolved = join(imagesDir, imageFiles[slide.index]);
    }

    if (!resolved) {
      throw new Error(
        `Could not resolve image for slide ${slide.index}: "${slide.title}" (ref: "${ref}")`
      );
    }

    return { ...slide, imagePath: resolved };
  });
}
