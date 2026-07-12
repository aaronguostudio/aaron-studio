import React from "react";
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from "remotion";

export interface WordTimingData {
  word: string;
  start: number; // seconds
  end: number; // seconds
}

interface WordCaptionProps {
  wordTimings: WordTimingData[];
  /** Frame offset for when audio starts within the sequence */
  audioDelay?: number;
  maxWordsPerLine?: number;
}

export interface CaptionSegment {
  text: string;
  start: number;
  end: number;
}

function cleanWord(word: string): string {
  return word.replace(/\s+/g, " ").trim();
}

const spelledLetter = (
  word: string,
): { letter: string; punctuation: string } | null => {
  const match = cleanWord(word).match(/^([A-Z])([,.;:!?]*)$/);
  if (!match) return null;
  return { letter: match[1], punctuation: match[2] };
};

/**
 * ElevenLabs occasionally emits a spoken acronym as one timing token per
 * letter. Merge a contiguous cluster before phrase segmentation so `F D E`
 * cannot become `F D` / `E consulting` on screen.
 */
export function mergeSpelledAcronyms(
  wordTimings: WordTimingData[],
): WordTimingData[] {
  const normalized = wordTimings
    .map((timing) => ({ ...timing, word: cleanWord(timing.word) }))
    .filter((timing) => timing.word);
  const merged: WordTimingData[] = [];

  for (let index = 0; index < normalized.length; ) {
    const first = spelledLetter(normalized[index].word);
    if (!first) {
      merged.push(normalized[index]);
      index += 1;
      continue;
    }

    const cluster = [normalized[index]];
    let cursor = index + 1;
    while (cursor < normalized.length) {
      const previous = cluster[cluster.length - 1];
      const candidate = normalized[cursor];
      if (
        !spelledLetter(candidate.word) ||
        candidate.start - previous.end > 0.75
      ) {
        break;
      }
      cluster.push(candidate);
      cursor += 1;
    }

    if (cluster.length < 2) {
      merged.push(normalized[index]);
      index += 1;
      continue;
    }

    const finalToken = spelledLetter(cluster[cluster.length - 1].word)!;
    merged.push({
      word: `${cluster.map((timing) => spelledLetter(timing.word)!.letter).join("")}${finalToken.punctuation}`,
      start: cluster[0].start,
      end: cluster[cluster.length - 1].end,
    });
    index = cursor;
  }

  return merged;
}

export function buildCaptionSegments(
  wordTimings: WordTimingData[],
  maxWordsPerSegment: number,
): CaptionSegment[] {
  const segments: CaptionSegment[] = [];
  let current: WordTimingData[] = [];

  function flush(): void {
    const words = current.map((w) => cleanWord(w.word)).filter(Boolean);
    if (words.length === 0) {
      current = [];
      return;
    }

    segments.push({
      text: words.join(" "),
      start: current[0].start,
      end: current[current.length - 1].end,
    });
    current = [];
  }

  for (const timing of mergeSpelledAcronyms(wordTimings)) {
    const word = cleanWord(timing.word);
    if (!word) continue;

    current.push({ ...timing, word });

    const segmentDuration = timing.end - current[0].start;
    const endsPhrase = /[,.!?;:，。！？；：]$/.test(word);
    const longEnoughToBreak = current.length >= 4 && endsPhrase;
    const tooManyWords = current.length >= maxWordsPerSegment;
    const tooLong = segmentDuration >= 4.2;

    if (longEnoughToBreak || tooManyWords || tooLong) {
      flush();
    }
  }

  flush();
  return segments;
}

/**
 * Stable phrase-level subtitle overlay.
 * Word timings drive precise segment timing, but the display avoids
 * karaoke-style per-word color changes that can feel visually jumpy.
 */
export const WordCaption: React.FC<WordCaptionProps> = ({
  wordTimings,
  audioDelay = 0,
  maxWordsPerLine = 10,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!wordTimings || wordTimings.length === 0) return null;

  // Current time relative to audio start
  const currentTime = Math.max(0, (frame - audioDelay) / fps);

  const segments = React.useMemo(
    () => buildCaptionSegments(wordTimings, maxWordsPerLine),
    [wordTimings, maxWordsPerLine],
  );
  const activeSegment = segments.find((segment) => {
    return (
      currentTime >= segment.start - 0.12 && currentTime <= segment.end + 0.55
    );
  });

  if (!activeSegment) return null;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "0 40px 60px 40px",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.68)",
          padding: "11px 24px 12px",
          borderRadius: 8,
          maxWidth: "76%",
          minWidth: 520,
          minHeight: 54,
          boxSizing: "border-box",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <span
          style={{
            color: "rgba(255, 255, 255, 0.92)",
            fontSize: 28,
            fontFamily:
              'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            fontWeight: 560,
            lineHeight: 1.35,
            textAlign: "center",
          }}
        >
          {activeSegment.text}
        </span>
      </div>
    </AbsoluteFill>
  );
};
