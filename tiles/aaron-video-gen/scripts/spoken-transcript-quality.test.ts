import { describe, expect, test } from "bun:test";
import { findSpokenTranscriptIssues } from "./spoken-transcript-quality";

describe("findSpokenTranscriptIssues", () => {
  test("flags generic YouTube hype phrases", () => {
    const issues = findSpokenTranscriptIssues(
      "This sounds like a game changer. Crazy, right? Here is why."
    );

    expect(issues.map((issue) => issue.phrase)).toContain("game changer");
    expect(issues.map((issue) => issue.phrase)).toContain("crazy, right");
  });

  test("flags repeated stock transitions", () => {
    const issues = findSpokenTranscriptIssues(
      "Here is the thing. The owner still owns judgment. Here is the thing. Agents only own tasks."
    );

    expect(issues).toContainEqual(
      expect.objectContaining({
        kind: "repeated-phrase",
        phrase: "here is the thing",
      })
    );
  });

  test("flags rhetorical question overuse", () => {
    const issues = findSpokenTranscriptIssues(
      "Sounds useful? Maybe. Is that enough? No. Can the team keep up? Not always."
    );

    expect(issues).toContainEqual(
      expect.objectContaining({
        kind: "question-density",
      })
    );
  });

  test("flags formalized transcript language", () => {
    const issues = findSpokenTranscriptIssues(
      "Consequently, this robust process enhances the team's output. Conversely, I appreciate the term. When it comes to review, the critical point is alignment."
    );

    expect(issues).toContainEqual(
      expect.objectContaining({
        kind: "formal-language",
        phrase: "consequently",
      })
    );
    expect(issues).toContainEqual(
      expect.objectContaining({
        kind: "formal-language",
        phrase: "when it comes to",
      })
    );
    expect(issues).toContainEqual(
      expect.objectContaining({
        kind: "formal-language",
        phrase: "conversely",
      })
    );
  });

  test("flags output that expands too far beyond the source", () => {
    const issues = findSpokenTranscriptIssues(
      "This is a longer version with extra explanation, more framing, and additional wording that was not needed.",
      {
        sourceText: "This is a short version.",
        maxExpansionRatio: 1.5,
      }
    );

    expect(issues).toContainEqual(
      expect.objectContaining({
        kind: "length-expansion",
      })
    );
  });
});
