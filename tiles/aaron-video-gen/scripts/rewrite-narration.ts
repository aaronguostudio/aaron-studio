/**
 * LLM-based narration rewriter.
 * Rewrites formal script narration into conversational, natural-sounding text
 * before sending to TTS. This is the same approach Google NotebookLM uses
 * to make podcast audio sound human.
 */

const SYSTEM_PROMPT = `You are rewriting narration for a YouTube video. Make it sound like a real person talking naturally — not reading a script. Keep the same meaning and all key facts, but:

- Add natural pauses (use "..." for brief pauses)
- Use conversational language, occasional informal expressions
- Add light humor or rhetorical questions where they fit naturally
- Vary sentence rhythm — mix short punchy sentences with longer flowing ones
- Sound like you're explaining something interesting to a friend over coffee
- IMPORTANT: Vary your opening words! Do NOT start with "So" every time. Mix it up — start with a question, a bold statement, a direct fact, or just dive straight in. Each slide MUST open differently.
- IMPORTANT: Do NOT overuse transition phrases like "You know what's interesting", "Here's the thing", "Here's what's crazy", "Let me tell you". Use each phrase AT MOST once across the entire video. Prefer direct, varied transitions — or no transition at all. Just state the next point.
- Do NOT add speaker labels, stage directions, or [brackets]
- Do NOT add sound effects or music cues
- Keep roughly the same length (±20%)
- Preserve any technical terms or proper nouns exactly

Output ONLY the rewritten narration text. No preamble, no explanation.`;

export async function rewriteNarration(
  text: string,
  slideTitle: string,
  previousOpenings?: string[]
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn(
      "[rewrite] OPENAI_API_KEY not set, skipping conversational rewrite"
    );
    return text;
  }

  let userContent = `Slide title: "${slideTitle}"\n\nNarration to rewrite:\n\n${text}`;
  if (previousOpenings && previousOpenings.length > 0) {
    userContent += `\n\nIMPORTANT: Previous slides already used these openings and transitions (do NOT reuse any of them — find fresh, different ways to connect ideas):\n${previousOpenings.map((o) => `- "${o}"`).join("\n")}`;
  }

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
        { role: "user", content: userContent },
      ],
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.warn(
      `[rewrite] OpenAI API error (${response.status}), using original text: ${error}`
    );
    return text;
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
  };
  return data.choices[0]?.message?.content?.trim() || text;
}

export async function rewriteAllNarrations(
  slides: Array<{ title: string; narration: string; index: number }>
): Promise<Map<number, string>> {
  const rewritten = new Map<number, string>();
  const previousOpenings: string[] = [];

  for (const slide of slides) {
    if (!slide.narration.trim()) {
      rewritten.set(slide.index, slide.narration);
      continue;
    }

    console.log(`  Slide ${slide.index}: "${slide.title}"`);
    const result = await rewriteNarration(
      slide.narration,
      slide.title,
      previousOpenings
    );
    rewritten.set(slide.index, result);

    // Track opening words and transition phrases to avoid repetition
    const firstWords = result.split(/\s+/).slice(0, 5).join(" ");
    previousOpenings.push(firstWords);

    // Also extract common transition phrases used in this slide
    const transitionPatterns = [
      /You know what[''']s \w+/gi,
      /Here[''']s the (?:thing|deal|kicker|catch|twist)/gi,
      /Let me tell you/gi,
      /Picture this/gi,
      /Think about (?:it|this|that)/gi,
      /The (?:crazy|wild|interesting|funny) (?:thing|part) is/gi,
      /But here[''']s (?:the|what)/gi,
    ];
    for (const pattern of transitionPatterns) {
      const matches = result.match(pattern);
      if (matches) {
        for (const m of matches) previousOpenings.push(m);
      }
    }

    const delta = result.length - slide.narration.length;
    const pct = ((delta / slide.narration.length) * 100).toFixed(0);
    console.log(
      `    ${slide.narration.length} → ${result.length} chars (${delta >= 0 ? "+" : ""}${pct}%)`
    );
  }

  return rewritten;
}
