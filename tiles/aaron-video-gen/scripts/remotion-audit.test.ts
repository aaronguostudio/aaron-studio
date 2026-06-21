import { expect, test } from "bun:test";
import { auditRemotionSourceText } from "./remotion-audit";

test("flags CSS transitions in Remotion components", () => {
  const result = auditRemotionSourceText(
    "Bad.tsx",
    "const style = { transition: 'opacity 1s' };"
  );

  expect(result.failures).toContain(
    "Bad.tsx uses CSS transition/animation instead of frame-based Remotion animation"
  );
});

test("allows frame-based interpolate animation", () => {
  const result = auditRemotionSourceText(
    "Good.tsx",
    "const opacity = interpolate(frame, [0, 10], [0, 1]);"
  );

  expect(result.failures).toEqual([]);
});
