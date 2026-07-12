/**
 * LLM-based narration rewriter.
 * Rewrites formal script narration into conversational, natural-sounding text
 * before sending to TTS. This is the same approach Google NotebookLM uses
 * to make podcast audio sound human.
 */

import {
  findSpokenTranscriptIssues,
  formalTranscriptPhrases,
  formatSpokenTranscriptIssues,
  genericYoutubeFillerPhrases,
} from "./spoken-transcript-quality";

const GENERIC_YOUTUBE_FILLER = genericYoutubeFillerPhrases();
const FORMAL_TRANSCRIPT_LANGUAGE = formalTranscriptPhrases();

const SYSTEM_PROMPT = `You are rewriting narration for Aaron's YouTube video. Make it sound spoken, specific, and human, not like a generic YouTube explainer. Keep the same meaning and all key facts, but:

- Use Aaron's spoken style: measured, pragmatic, concrete, engineering-minded, first-person when the point comes from lived workflow
- Keep the voice calm and direct; do not add artificial excitement, fake surprise, or influencer-style hype
- Prefer concrete operator language over broad metaphors
- Vary sentence rhythm with short sentences, longer explanations, and paragraph breaks as pauses
- Use rhetorical questions only when they expose real tension; do not use them as filler
- IMPORTANT: Vary opening words and transitions. Prefer direct continuation or a specific contrast over stock transition phrases.
- IMPORTANT: Avoid generic YouTube filler such as: ${GENERIC_YOUTUBE_FILLER.join(", ")}
- Do NOT add speaker labels, stage directions, or [brackets]
- Do NOT add sound effects or music cues
- Keep roughly the same length (±20%)
- Preserve any technical terms, numbers, source names, and proper nouns exactly

Output ONLY the rewritten narration text. No preamble, no explanation.`;

export interface RewriteContext {
  corePromise?: string;
  hookType?: string;
  storyStructure?: string;
  desiredEmotion?: string;
  bannedPhrases?: string[];
  retentionBeats?: string[];
}

export function buildRewriteUserPrompt(
  text: string,
  slideTitle: string,
  previousOpenings: string[] = [],
  context: RewriteContext = {}
): string {
  return [
    `Slide title: "${slideTitle}"`,
    [
      "Aaron's spoken style:",
      "- Use a light edit. If the source already sounds clear, keep it close to the original.",
      "- Preserve named framework labels, ordered steps, numbers, and technical terms exactly.",
      "- Do not turn labels such as Action, Context, Trust, Outcome, or Recursive into generic prose.",
      "- measured, pragmatic, concrete, engineering-minded",
      "- sounds like a builder explaining a real workflow lesson, not a host performing excitement",
      "- specific examples beat broad metaphors",
      "- remove fake casualness; keep natural pauses only when they help comprehension",
      "- preserve the source's short spoken rhythm; prefer 80-100% of the source length",
      "- Do not replace plain words with formal synonyms: like stays like, QA stays QA, important stays important",
      "- do not turn short narration into a business memo or formal explainer",
    ].join("\n"),
    [
      "Avoid generic YouTube filler:",
      ...GENERIC_YOUTUBE_FILLER.map((phrase) => `- ${phrase}`),
    ].join("\n"),
    [
      "Do not formalize the transcript. Avoid formal filler:",
      ...FORMAL_TRANSCRIPT_LANGUAGE.map((phrase) => `- ${phrase}`),
    ].join("\n"),
    context.corePromise ? `Core promise: ${context.corePromise}` : "",
    context.hookType ? `Hook type: ${context.hookType}` : "",
    context.storyStructure ? `Story structure: ${context.storyStructure}` : "",
    context.desiredEmotion ? `Desired emotion: ${context.desiredEmotion}` : "",
    context.retentionBeats?.length
      ? `Retention beats to preserve:\n${context.retentionBeats
          .map((beat) => `- ${beat}`)
          .join("\n")}`
      : "",
    context.bannedPhrases?.length
      ? `Banned phrases:\n${context.bannedPhrases
          .map((phrase) => `- ${phrase}`)
          .join("\n")}`
      : "",
    previousOpenings.length
      ? `Previous openings and transitions to avoid:\n${previousOpenings
          .map((opening) => `- "${opening}"`)
          .join("\n")}`
      : "",
    "Narration to rewrite:",
    text,
  ]
    .filter(Boolean)
    .join("\n\n");
}

export async function rewriteNarration(
  text: string,
  slideTitle: string,
  previousOpenings: string[] = [],
  context: RewriteContext = {}
): Promise<string> {
  const sourceIssues = findSpokenTranscriptIssues(text);
  if (sourceIssues.length === 0) return text;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn(
      "[rewrite] OPENAI_API_KEY not set, skipping conversational rewrite"
    );
    return text;
  }

  const userContent = buildRewriteUserPrompt(
    text,
    slideTitle,
    previousOpenings,
    context
  );

  const callRewriteModel = async (prompt: string): Promise<string | null> => {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.warn(
        `[rewrite] OpenAI API error (${response.status}), using original text: ${error}`
      );
      return null;
    }

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
    };
    return data.choices[0]?.message?.content?.trim() || null;
  };

  const firstRewrite = await callRewriteModel(userContent);
  if (!firstRewrite) return text;

  let currentRewrite = firstRewrite;
  for (let attempt = 0; attempt < 2; attempt++) {
    const issues = findSpokenTranscriptIssues(currentRewrite, { sourceText: text });
    if (issues.length === 0) return currentRewrite;

    const repairPrompt = [
      "Fix these transcript quality issues in the rewritten narration.",
      formatSpokenTranscriptIssues(issues),
      "",
      "Rules:",
      "- Preserve the meaning, technical terms, numbers, and proper nouns.",
      "- Remove generic hype and fake casualness.",
      "- Remove formalized language and business-memo transitions.",
      "- Keep the repaired narration no longer than the source unless meaning would be lost.",
      "- Keep Aaron's spoken style: measured, pragmatic, concrete, engineering-minded.",
      "- Output only the repaired narration text.",
      "",
      "Narration to repair:",
      currentRewrite,
    ].join("\n");

    const repaired = await callRewriteModel(repairPrompt);
    if (!repaired) return currentRewrite;
    currentRewrite = repaired;
  }

  return currentRewrite;
}

export function rememberRewriteOpenings(
  rewrittenText: string,
  previousOpenings: string[]
): void {
  const firstWords = rewrittenText.split(/\s+/).slice(0, 5).join(" ");
  if (firstWords) previousOpenings.push(firstWords);

  const remember = (value: string) => {
    const normalized = value.trim().replace(/[.?!:]+$/g, "");
    if (normalized) previousOpenings.push(normalized);
  };

  const transitionPatterns = [
    /You know what['’]?s \w+/gi,
    /Here['’]?s the (?:thing|deal|kicker|catch|twist)/gi,
    /Let me tell you/gi,
    /Picture this/gi,
    /Think about (?:it|this|that)/gi,
    /The (?:crazy|wild|interesting|funny) (?:thing|part) is/gi,
    /But here['’]?s (?:the|what)/gi,
    /game changer/gi,
    /crazy,\s*right\??/gi,
    /supercharged/gi,
    /power-up/gi,
    /sounds like a dream/gi,
    /trusty sidekick/gi,
    /makes you think\??/gi,
  ];
  for (const pattern of transitionPatterns) {
    const matches = rewrittenText.match(pattern);
    if (matches) {
      for (const match of matches) remember(match);
    }
  }
}

export async function rewriteAllNarrations(
  slides: Array<{ title: string; narration: string; index: number }>,
  context: RewriteContext = {},
  previousOpenings: string[] = []
): Promise<Map<number, string>> {
  const rewritten = new Map<number, string>();

  for (const slide of slides) {
    if (!slide.narration.trim()) {
      rewritten.set(slide.index, slide.narration);
      continue;
    }

    console.log(`  Slide ${slide.index}: "${slide.title}"`);
    const result = await rewriteNarration(
      slide.narration,
      slide.title,
      previousOpenings,
      context
    );
    rewritten.set(slide.index, result);

    rememberRewriteOpenings(result, previousOpenings);

    const delta = result.length - slide.narration.length;
    const pct = ((delta / slide.narration.length) * 100).toFixed(0);
    console.log(
      `    ${slide.narration.length} → ${result.length} chars (${delta >= 0 ? "+" : ""}${pct}%)`
    );
  }

  return rewritten;
}
