import { describe, expect, test } from "bun:test";
import {
  editorialMotion,
  editorialMotionBounds,
  informationalPlaneTurn,
  semanticSettle,
} from "../remotion/src/editorial/EditorialMotionSystem";
import { clampSemanticSpriteFrameTimings } from "../remotion/src/editorial/SemanticSprite";

test("informational plane turns preserve a readable projected width", () => {
  const finalTurn = informationalPlaneTurn(1);

  expect(Math.abs(finalTurn.rotateYDeg)).toBeLessThanOrEqual(
    editorialMotionBounds.maxInformationalRotateYDeg,
  );
  expect(finalTurn.projectedWidthRatio).toBeGreaterThanOrEqual(
    editorialMotionBounds.minProjectedWidthRatio,
  );
});

test("informational plane turns clamp progress to the motion envelope", () => {
  expect(informationalPlaneTurn(-1)).toEqual(informationalPlaneTurn(0));
  expect(informationalPlaneTurn(2)).toEqual(informationalPlaneTurn(1));
});

describe("editorial motion system", () => {
  test("semantic settle clamps progress and never overshoots or rotates", () => {
    expect(semanticSettle(-1)).toEqual({ opacity: 0, translateY: 10, rotationDeg: 0 });
    expect(semanticSettle(2)).toEqual({ opacity: 1, translateY: 0, rotationDeg: 0 });
    expect(semanticSettle(0, 99).translateY).toBe(
      editorialMotion.semanticSettle.maxTranslatePx,
    );
    for (const translatePx of [-10, 0, 1]) {
      expect(semanticSettle(0, translatePx).translateY).toBe(
        editorialMotion.semanticSettle.minTranslatePx,
      );
    }
  });

  test("semantic settle is monotonic and stable at its final state", () => {
    const samples = [0, 0.25, 0.5, 0.75, 1].map((value) =>
      semanticSettle(value),
    );
    for (let index = 1; index < samples.length; index += 1) {
      expect(samples[index].opacity).toBeGreaterThanOrEqual(samples[index - 1].opacity);
      expect(samples[index].translateY).toBeLessThanOrEqual(
        samples[index - 1].translateY,
      );
    }
    expect(semanticSettle(1)).toEqual(semanticSettle(10));
  });

  test("semantic settle uses seconds canonically and labels 30fps references", () => {
    expect(editorialMotion.semanticSettle.durationSec).toEqual([0.3, 0.5]);
    expect(editorialMotion.referenceFramesAt30Fps.semanticSettle).toEqual([
      9, 15,
    ]);
  });

  test("semantic sprite runtime clamps every exit shorter than its entrance", () => {
    expect(clampSemanticSpriteFrameTimings(12, 12)).toEqual({
      enterFrames: 12,
      exitFrames: 11,
    });
    expect(clampSemanticSpriteFrameTimings(1, 99)).toEqual({
      enterFrames: 2,
      exitFrames: 1,
    });
  });
});
