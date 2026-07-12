import { expect, test } from "bun:test";
import {
  buildCaptionSegments,
  mergeSpelledAcronyms,
  type WordTimingData,
} from "../remotion/src/components/WordCaption";

test("merges separately timed acronym letters before caption segmentation", () => {
  const timings: WordTimingData[] = [
    { word: "It", start: 0, end: 0.1 },
    { word: "is", start: 0.12, end: 0.2 },
    { word: "too", start: 0.22, end: 0.3 },
    { word: "simple", start: 0.32, end: 0.44 },
    { word: "to", start: 0.46, end: 0.52 },
    { word: "call", start: 0.54, end: 0.66 },
    { word: "F", start: 0.68, end: 0.74 },
    { word: "D", start: 0.76, end: 0.82 },
    { word: "E", start: 0.84, end: 0.9 },
    { word: "consulting.", start: 0.92, end: 1.1 },
  ];

  expect(mergeSpelledAcronyms(timings).map((timing) => timing.word)).toEqual([
    "It",
    "is",
    "too",
    "simple",
    "to",
    "call",
    "FDE",
    "consulting.",
  ]);
  expect(buildCaptionSegments(timings, 8).map((segment) => segment.text)).toEqual([
    "It is too simple to call FDE consulting.",
  ]);
});

test("preserves terminal punctuation when merging a spelled acronym", () => {
  expect(
    mergeSpelledAcronyms([
      { word: "A", start: 0, end: 0.1 },
      { word: "W", start: 0.12, end: 0.2 },
      { word: "S,", start: 0.22, end: 0.3 },
    ]).map((timing) => timing.word),
  ).toEqual(["AWS,"]);
});
