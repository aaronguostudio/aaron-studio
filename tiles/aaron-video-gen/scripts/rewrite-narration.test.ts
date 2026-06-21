import { expect, test } from "bun:test";
import {
  buildRewriteUserPrompt,
  rememberRewriteOpenings,
} from "./rewrite-narration";

test("rewrite prompt includes video promise and banned phrases", () => {
  const prompt = buildRewriteUserPrompt("Body", "Slide", [], {
    corePromise: "AI becomes a personal operating system",
    bannedPhrases: ["right", "you know"],
    retentionBeats: ["0:25 contrast tool vs OS"],
  });

  expect(prompt).toContain("AI becomes a personal operating system");
  expect(prompt).toContain("right");
  expect(prompt).toContain("0:25 contrast tool vs OS");
});

test("rememberRewriteOpenings records opening words and transition phrases", () => {
  const previousOpenings: string[] = [];

  rememberRewriteOpenings(
    "Here's the thing. This operating system keeps moving after the phone goes away.",
    previousOpenings
  );

  expect(previousOpenings[0]).toBe("Here's the thing. This operating");
  expect(previousOpenings).toContain("Here's the thing");
});
