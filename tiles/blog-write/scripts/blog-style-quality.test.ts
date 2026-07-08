import { describe, expect, test } from "bun:test";
import {
  assessBlogStyleQuality,
  findBlogStyleIssues,
  formatBlogStyleIssues,
} from "./blog-style-quality";

describe("findBlogStyleIssues", () => {
  test("flags clustered AI slop vocabulary and phrases", () => {
    const issues = findBlogStyleIssues(
      [
        "In today's fast-paced world, AI is reshaping the ever-evolving landscape of software.",
        "At its core, this robust and seamless system empowers teams to leverage a game-changing workflow.",
        "It is important to note that this does not just improve speed, it unlocks a holistic paradigm.",
      ].join("\n\n")
    );

    expect(issues).toContainEqual(
      expect.objectContaining({
        kind: "ai-slop-density",
      })
    );
    expect(issues).toContainEqual(
      expect.objectContaining({
        kind: "formulaic-contrast",
      })
    );
  });

  test("does not flag sparse slop markers in a long specific article", () => {
    const body = [
      "Last month, the review queue became the constraint. Two developers were shipping with Codex, but the release owner still had to decide what was safe.",
      "The useful lesson was practical: keep module ownership clear, keep integration review short, and make the evidence visible before merge.",
      ...Array.from({ length: 30 }, (_, index) =>
        `Section ${index} describes a concrete workflow detail, a real tradeoff, and a decision the team had to make before the next release.`
      ),
      "The word leverage can be natural in an operator essay. Leverage should not fail a long article by itself. Product leverage and judgment leverage still need context.",
    ].join("\n\n");

    const issues = findBlogStyleIssues(body, { requirePersonalAnchor: true });

    expect(issues.map((issue) => issue.kind)).not.toContain("ai-slop-density");
  });

  test("flags generic topic openings when story craft is required", () => {
    const issues = findBlogStyleIssues(
      [
        "AI is transforming the way modern teams build software.",
        "In this article, we will explore why AI coding matters and how companies can adapt.",
        "The topic is important for product and engineering leaders.",
      ].join("\n\n"),
      { requireStoryCraft: true }
    );

    expect(issues).toContainEqual(
      expect.objectContaining({
        kind: "weak-hook",
      })
    );
  });

  test("flags operator essays with no narrative tension", () => {
    const issues = findBlogStyleIssues(
      [
        "Last month, our team adopted Codex in two modules.",
        "It helped us generate tests, docs, and release notes.",
        "The workflow improved and everyone aligned around clear ownership.",
        "The process became smoother every week.",
      ].join("\n\n"),
      { requirePersonalAnchor: true, requireStoryCraft: true }
    );

    expect(issues).toContainEqual(
      expect.objectContaining({
        kind: "missing-narrative-tension",
      })
    );
  });

  test("flags endings that do not land a story payoff", () => {
    const issues = findBlogStyleIssues(
      [
        "Last month, our QA process broke before the product did.",
        "Two developers could ship agent-generated changes faster than the review queue could absorb them.",
        "The team moved each module to one clear owner and shortened the integration review.",
        "This topic matters for AI coding teams.",
      ].join("\n\n"),
      { requirePersonalAnchor: true, requireStoryCraft: true }
    );

    expect(issues).toContainEqual(
      expect.objectContaining({
        kind: "missing-story-payoff",
      })
    );
  });

  test("flags operator posts that lack lived evidence", () => {
    const issues = findBlogStyleIssues(
      [
        "AI changes how modern teams operate.",
        "The best organizations will adopt better workflows and improve alignment.",
        "This creates important leverage across product, engineering, and strategy.",
      ].join("\n\n"),
      { requirePersonalAnchor: true }
    );

    expect(issues).toContainEqual(
      expect.objectContaining({
        kind: "missing-lived-evidence",
      })
    );
  });

  test("does not require first person when concrete operator evidence is present", () => {
    const issues = findBlogStyleIssues(
      [
        "Last week, the QA queue grew from 4 tickets to 19 while two developers were shipping with Codex.",
        "The bottleneck was not coding speed. It was review bandwidth.",
        "That changed the process: each module now has one owner who asks AI for implementation, tests, and release notes before opening the integration review.",
      ].join("\n\n"),
      { requirePersonalAnchor: true }
    );

    expect(issues.map((issue) => issue.kind)).not.toContain("missing-lived-evidence");
  });

  test("flags low rhythm variation in English paragraphs", () => {
    const issues = findBlogStyleIssues(
      [
        "The team adopted AI coding tools for daily work.",
        "The process improved delivery speed across multiple projects.",
        "The review step became harder for every engineer.",
        "The organization needed new workflow rules immediately.",
      ].join(" ")
    );

    expect(issues).toContainEqual(
      expect.objectContaining({
        kind: "low-rhythm-variation",
      })
    );
  });

  test("flags generic summary endings", () => {
    const issues = findBlogStyleIssues(
      [
        "A one-person project works only when judgment stays visible.",
        "Ownership collapses the handoff cost, but integration still protects the company.",
        "In conclusion, AI will continue to transform the future of work. Exciting times lie ahead.",
      ].join("\n\n")
    );

    expect(issues).toContainEqual(
      expect.objectContaining({
        kind: "generic-ending",
      })
    );
  });

  test("flags Chinese translation tone that sounds mechanical", () => {
    const issues = findBlogStyleIssues(
      [
        "首先，AI时代的团队协作具有重要意义。",
        "其次，这种模式能够在一定程度上提高效率。",
        "综上所述，我们应该积极拥抱这一趋势，并不断提升自身能力。",
      ].join("\n"),
      { language: "zh" }
    );

    expect(issues).toContainEqual(
      expect.objectContaining({
        kind: "mechanical-chinese",
      })
    );
  });

  test("flags imprecise Chinese word choice in negative business context", () => {
    const issues = findBlogStyleIssues(
      "很多企业确实感受到了同一种张力：token 消耗、模型访问和漂亮 demo，并不会自动变成 operating value。",
      { language: "zh" }
    );

    expect(issues).toContainEqual(
      expect.objectContaining({
        kind: "imprecise-chinese-word-choice",
      })
    );
  });

  test("allows 张力 when it describes title or argument energy", () => {
    const issues = findBlogStyleIssues(
      "这个标题比旧标题更有张力，但正文开头需要更快兑现这个冲突。",
      { language: "zh" }
    );

    expect(issues.map((issue) => issue.kind)).not.toContain("imprecise-chinese-word-choice");
  });

  test("flags ACTOR lens when the article means an actionable framework", () => {
    const issues = findBlogStyleIssues(
      "The practical lens is ACTOR: Action, Context, Trust, Outcome, Recursive ownership."
    );

    expect(issues).toContainEqual(
      expect.objectContaining({
        kind: "imprecise-methodology-label",
      })
    );
  });

  test("allows lens when it means an interpretive perspective", () => {
    const issues = findBlogStyleIssues(
      "The ending gives readers a decision lens for evaluating the next workflow."
    );

    expect(issues.map((issue) => issue.kind)).not.toContain("imprecise-methodology-label");
  });
});

describe("assessBlogStyleQuality", () => {
  test("scores clean operator writing higher than generic AI writing", () => {
    const generic = assessBlogStyleQuality(
      [
        "In today's fast-paced world, AI is a game-changing force in the ever-evolving landscape of work.",
        "It is important to note that teams must leverage robust workflows to unlock their full potential.",
        "In conclusion, the future looks bright as organizations continue this exciting journey.",
      ].join("\n\n"),
      { requirePersonalAnchor: true }
    );

    const specific = assessBlogStyleQuality(
      [
        "Last month, our QA process broke before the product did.",
        "Two developers could ship agent-generated changes faster than the review queue could absorb them.",
        "That is the real constraint in AI coding: not typing speed, but ownership of judgment.",
        "The fix was not a bigger meeting. It was a clearer owner for each module and a shorter integration contract.",
      ].join("\n\n"),
      { requirePersonalAnchor: true }
    );

    expect(specific.score).toBeGreaterThan(generic.score);
    expect(specific.passed).toBe(true);
    expect(generic.passed).toBe(false);
  });

  test("formats issues for revision prompts", () => {
    const report = formatBlogStyleIssues([
      {
        kind: "generic-ending",
        severity: "high",
        message: "Ending summarizes instead of advancing the thesis.",
      },
    ]);

    expect(report).toContain("high");
    expect(report).toContain("Ending summarizes");
  });

  test("does not flag a concrete hook with tension and payoff", () => {
    const issues = findBlogStyleIssues(
      [
        "Last month, our QA process broke before the product did.",
        "Two developers could ship agent-generated changes faster than the review queue could absorb them.",
        "The bottleneck was not code generation. It was ownership of judgment.",
        "The operating rule is simple: AI can own tasks, but one person has to own the module story before the team integrates it.",
      ].join("\n\n"),
      { requirePersonalAnchor: true, requireStoryCraft: true }
    );

    expect(issues.map((issue) => issue.kind)).not.toContain("weak-hook");
    expect(issues.map((issue) => issue.kind)).not.toContain("missing-narrative-tension");
    expect(issues.map((issue) => issue.kind)).not.toContain("missing-story-payoff");
  });

  test("accepts a decision-question payoff", () => {
    const issues = findBlogStyleIssues(
      [
        "Last month, our QA process broke before the product did.",
        "Two developers could ship agent-generated changes faster than the review queue could absorb them.",
        "The bottleneck was not code generation. It was ownership of judgment.",
        "The strongest software teams will stop asking what each role does in the process.",
        "They will ask sharper questions: Who owns this end to end? Which agents can they use? Where are the team boundaries? What evidence would make us trust this enough to ship?",
      ].join("\n\n"),
      { requirePersonalAnchor: true, requireStoryCraft: true }
    );

    expect(issues.map((issue) => issue.kind)).not.toContain("missing-story-payoff");
  });

  test("accepts a payoff spread across the final section", () => {
    const issues = findBlogStyleIssues(
      [
        "Last month, our QA process broke before the product did.",
        "Two developers could ship agent-generated changes faster than the review queue could absorb them.",
        "The bottleneck was not code generation. It was ownership of judgment.",
        "The strongest software teams will stop asking what each role does in the process.",
        "They will ask a sharper set of questions: Who owns this end to end? Which agents can they use? Where are the team boundaries? What evidence would make us trust this enough to ship?",
        "The teams that can answer those four questions will keep individual speed without losing team quality.",
      ].join("\n\n"),
      { requirePersonalAnchor: true, requireStoryCraft: true }
    );

    expect(issues.map((issue) => issue.kind)).not.toContain("missing-story-payoff");
  });
});
