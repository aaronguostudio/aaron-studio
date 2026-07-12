import { expect, test } from "bun:test";
import {
  atempoFilter,
  buildRetimePlan,
  retimeWordTimings,
} from "./retime-fde-audio";

const targetTimeline = {
  narrationOffsetSec: 2.5,
  segments: [
    { id: "hook", start: 2.5, end: 12.5, duration: 10 },
    { id: "deployment", start: 12.5, end: 22.5, duration: 10 },
    { id: "factory", start: 22.5, end: 32.5, duration: 10 },
    { id: "backprop", start: 32.5, end: 42.5, duration: 10 },
    { id: "workflow", start: 42.5, end: 52.5, duration: 10 },
    { id: "comparison", start: 52.5, end: 62.5, duration: 10 },
    { id: "ownership", start: 62.5, end: 72.5, duration: 10 },
    { id: "actor", start: 72.5, end: 82.5, duration: 10 },
    { id: "tokens", start: 82.5, end: 92.5, duration: 10 },
  ],
};

const sourceTimeline = {
  duration: 90,
  segments: [
    { id: "hook", title: "Hook", start: 0, end: 10, duration: 10 },
    ...Array.from({ length: 8 }, (_, index) => ({
      id: `slide-${String(index + 1).padStart(2, "0")}`,
      title: `Slide ${index + 1}`,
      start: (index + 1) * 10,
      end: (index + 2) * 10,
      duration: 10,
    })),
  ],
  wordTimings: [
    { word: "Hook", start: 0, end: 0.5 },
    { word: "Deployment", start: 10, end: 10.5 },
  ],
};

test("retime plan maps generated chapters onto the fixed film rhythm", () => {
  const plan = buildRetimePlan(sourceTimeline, targetTimeline, 2);

  expect(plan).toHaveLength(9);
  expect(plan[0]).toMatchObject({
    outputDuration: 5,
    sourceToOutputScale: 0.5,
    atempo: 2,
    outputVisualStart: 2.5,
  });
  expect(plan[1]?.outputVisualStart).toBe(7.5);
});

test("retimed caption words keep the audio offset and chapter boundaries", () => {
  const plan = buildRetimePlan(sourceTimeline, targetTimeline, 2);
  const words = retimeWordTimings(sourceTimeline.wordTimings, plan);

  expect(words).toEqual([
    { word: "Hook", start: 2.5, end: 2.75 },
    { word: "Deployment", start: 7.5, end: 7.75 },
  ]);
});

test("atempo chains remain valid for extreme ratios", () => {
  expect(atempoFilter(1.1)).toBe("atempo=1.10000000");
  expect(atempoFilter(3)).toBe("atempo=2,atempo=1.50000000");
  expect(atempoFilter(0.25)).toBe("atempo=0.5,atempo=0.50000000");
});
