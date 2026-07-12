import { expect, test } from "bun:test";
import {
  editorialMotionBounds,
  informationalPlaneTurn,
} from "../remotion/src/editorial/EditorialMotionSystem";

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
