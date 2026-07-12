import { expect, test } from "bun:test";
import {
  editorialLayouts,
  validateEditorialLayouts,
  validateLayoutItemCount,
} from "../remotion/src/editorial/EditorialLayoutEngine";

test("registered editorial layouts keep primary slots out of one another's protected zones", () => {
  expect(validateEditorialLayouts()).toEqual([]);
});

test("registered layouts declare fixed capacities for dense editorial scenes", () => {
  expect(
    validateLayoutItemCount("workflow-gates", "gates", 5),
  ).toBeNull();
  expect(
    validateLayoutItemCount("workflow-gates", "gates", 6),
  ).toContain("at most 5 items");
  expect(
    validateLayoutItemCount("split-loop", "comparison", 2),
  ).toBeNull();
  expect(
    validateLayoutItemCount("media-split", "media", 1),
  ).toBeNull();
  expect(
    validateLayoutItemCount("media-split", "media", 2),
  ).toContain("at most 1 items");
  expect(
    validateLayoutItemCount("decision-row", "nodes", 4),
  ).toBeNull();
  expect(
    validateLayoutItemCount("decision-row", "nodes", 5),
  ).toContain("at most 4 items");
  expect(
    validateLayoutItemCount("people-hero", "roles", 4),
  ).toBeNull();
  expect(
    validateLayoutItemCount("people-hero", "roles", 5),
  ).toContain("at most 4 items");
  expect(
    validateLayoutItemCount("cover-hero", "brand", 3),
  ).toBeNull();
  expect(
    validateLayoutItemCount("cover-hero", "brand", 4),
  ).toContain("at most 3 items");
  expect(editorialLayouts["workflow-gates"].slots.workflowRail.maxItems).toBe(8);
});
