import { afterEach, expect, test } from "bun:test";
import {
  buildRewriteUserPrompt,
  rememberRewriteOpenings,
  rewriteNarration,
} from "./rewrite-narration";

const originalFetch = globalThis.fetch;
const originalOpenAIKey = process.env.OPENAI_API_KEY;

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalOpenAIKey === undefined) {
    delete process.env.OPENAI_API_KEY;
  } else {
    process.env.OPENAI_API_KEY = originalOpenAIKey;
  }
});

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

test("rewrite prompt forbids generic YouTube hype and fake casualness", () => {
  const prompt = buildRewriteUserPrompt("Body", "Slide");

  expect(prompt).toContain("Avoid generic YouTube filler");
  expect(prompt).toContain("game changer");
  expect(prompt).toContain("crazy, right");
  expect(prompt).toContain("Aaron's spoken style");
  expect(prompt).toContain("Do not formalize");
  expect(prompt).toContain("consequently");
  expect(prompt).toContain("Use a light edit");
  expect(prompt).toContain("Do not replace plain words with formal synonyms");
  expect(prompt).toContain("Preserve named framework labels");
  expect(prompt).toContain("Action, Context, Trust, Outcome, or Recursive");
});

test("rewriteNarration preserves source text that already passes the spoken gate", async () => {
  process.env.OPENAI_API_KEY = "test-key";
  let calls = 0;
  globalThis.fetch = (async () => {
    calls += 1;
    throw new Error("fetch should not be called");
  }) as typeof fetch;

  const source = "This changes where the bottleneck lives.";
  const result = await rewriteNarration(source, "Bottleneck");

  expect(result).toBe(source);
  expect(calls).toBe(0);
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

test("rememberRewriteOpenings records generic hype phrases as repeat risks", () => {
  const previousOpenings: string[] = [];

  rememberRewriteOpenings(
    "AI coding sounds like a game changer. Crazy, right? But here's the kicker: review still bottlenecks.",
    previousOpenings
  );

  expect(previousOpenings).toContain("game changer");
  expect(previousOpenings).toContain("Crazy, right");
  expect(previousOpenings).toContain("here's the kicker");
});

test("rewriteNarration retries once when the model returns generic hype", async () => {
  process.env.OPENAI_API_KEY = "test-key";
  const responses = [
    "Consequently, this sounds like a game changer. Crazy, right?",
    "This changes where the bottleneck lives.",
  ];
  const prompts: string[] = [];

  globalThis.fetch = (async (_url, init) => {
    const body = JSON.parse(String(init?.body));
    prompts.push(body.messages[1].content);
    const content = responses.shift() || "";
    return new Response(
      JSON.stringify({ choices: [{ message: { content } }] }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }) as typeof fetch;

  const result = await rewriteNarration(
    "Consequently, AI changes where the bottleneck lives in software delivery.",
    "Bottleneck"
  );

  expect(result).toBe("This changes where the bottleneck lives.");
  expect(prompts).toHaveLength(2);
  expect(prompts[1]).toContain("Fix these transcript quality issues");
  expect(prompts[1]).toContain("game changer");
  expect(prompts[1]).toContain("consequently");
});

test("rewriteNarration can repair transcript quality issues twice", async () => {
  process.env.OPENAI_API_KEY = "test-key";
  const responses = [
    "Consequently, this changes review.",
    "Conversely, this changes review.",
    "This changes review.",
  ];
  const prompts: string[] = [];

  globalThis.fetch = (async (_url, init) => {
    const body = JSON.parse(String(init?.body));
    prompts.push(body.messages[1].content);
    const content = responses.shift() || "";
    return new Response(
      JSON.stringify({ choices: [{ message: { content } }] }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }) as typeof fetch;

  const result = await rewriteNarration(
    "Consequently, this changes review.",
    "Bottleneck"
  );

  expect(result).toBe("This changes review.");
  expect(prompts).toHaveLength(3);
});
