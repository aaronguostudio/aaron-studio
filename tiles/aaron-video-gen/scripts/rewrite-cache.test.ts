import { expect, test } from "bun:test";
import { rewriteCacheKey } from "./rewrite-cache";

test("rewrite cache key changes when rewrite context changes", () => {
  const first = rewriteCacheKey("Narration", 1, {
    corePromise: "AI becomes an operating system",
  });
  const second = rewriteCacheKey("Narration", 1, {
    corePromise: "AI becomes a creative lab",
  });

  expect(first).not.toBe(second);
});
