export interface ParsedVideoBrief {
  hasBrief: boolean;
  targetAudience?: string;
  desiredEmotion?: string;
  corePromise?: string;
  titleExpectation?: string;
  highShockFacts: string[];
  hookType?: string;
  storyStructure?: string;
  retentionBeats: string[];
  whatVideoAdds: string[];
  bannedPhrases: string[];
  ending?: string;
  auditStatus?: string;
}

function section(markdown: string, heading: string): string | undefined {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(
    `(?:^|\\n)##\\s+${escaped}\\s*\\n([\\s\\S]*?)(?=\\n##\\s+|$)`,
    "i"
  );
  return markdown.match(re)?.[1]?.trim();
}

function bulletLines(text: string | undefined): string[] {
  return (text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("-"));
}

export function parseVideoBrief(markdown: string): ParsedVideoBrief {
  const text = markdown.trim();
  return {
    hasBrief: text.length > 0,
    targetAudience: section(text, "Target Audience"),
    desiredEmotion: section(text, "Desired Emotion"),
    corePromise: section(text, "Core Promise"),
    titleExpectation: section(text, "Title/Thumbnail Expectation"),
    highShockFacts: bulletLines(section(text, "High-Shock Facts")),
    hookType: section(text, "Hook Type"),
    storyStructure: section(text, "Story Structure"),
    retentionBeats: bulletLines(section(text, "Retention Beat Map")),
    whatVideoAdds: bulletLines(section(text, "What The Video Adds")),
    bannedPhrases: bulletLines(section(text, "Banned Phrases")).map((line) =>
      line.replace(/^-\s*/, "")
    ),
    ending: section(text, "Ending"),
    auditStatus: section(text, "Audit Status"),
  };
}
