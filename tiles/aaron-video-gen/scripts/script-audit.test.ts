import { describe, expect, test } from "bun:test";
import { auditYoutubeScript, countScriptImages } from "./script-audit";

const strongBrief = `# Video Brief

## Target Audience
AI-native builders who already use coding agents but have not turned them into a system.

## Desired Emotion
Possibility with sober control.

## Core Promise
You will see how AI stops being a tool and becomes a personal operating system.

## Title/Thumbnail Expectation
The viewer expects a real present-day workflow that feels like the future.

## High-Shock Facts
- 90: Aaron dispatched a Notion task from a moving Tesla.
- 85: Claude Code finished a 1.5 hour development run at the same time.

## Hook Type
Personal experience: target AI builders, transformation from tool to OS, stakes are time and leverage.

## Story Structure
Educational personal story.

## Retention Beat Map
- 0:00 personal scene
- 0:25 contrast tool vs operating system
- 0:55 concrete coding run

## What The Video Adds
- Shows the moving Tesla dispatch as a scene.
- Names the operating-system loop.
- Adds the bad delegation risk.

## Banned Phrases
- right
- you know

## Ending
The human edge is building a better human-agent operating system.

## Audit Status
Pending.
`;

describe("auditYoutubeScript", () => {
  test("counts slide headers and inline image markers", () => {
    const count = countScriptImages(
      "# Title\n\n## [SLIDE: One — 01.png]\nBody.\n\n[IMAGE: 02.png]\nMore.\n\n[IMAGE: 03.png]\nEnd."
    );

    expect(count).toBe(3);
  });

  test("fails when video brief is missing", () => {
    const result = auditYoutubeScript({
      scriptMarkdown:
        "# Title\n\n## [HOOK]\nTesla scene.\n\n## [SLIDE: One — 01.png]\nBody.",
      videoBriefMarkdown: "",
      imageCount: 1,
      estimatedDurationSec: 90,
    });

    expect(result.passed).toBe(false);
    expect(result.failures).toContain("video-brief.md is missing or empty");
  });

  test("fails when hook starts with a generic meta intro", () => {
    const result = auditYoutubeScript({
      scriptMarkdown:
        "# Title\n\n## [HOOK]\nIn today's video, let's dive in.\n\n## [SLIDE: One — 01.png]\nBody.",
      videoBriefMarkdown: strongBrief,
      imageCount: 1,
      estimatedDurationSec: 90,
    });

    expect(result.passed).toBe(false);
    expect(result.failures).toContain(
      "hook uses banned meta-introduction language"
    );
  });

  test("does not warn when brief has enough high-shock facts and retention beats", () => {
    const result = auditYoutubeScript({
      scriptMarkdown:
        "# Title\n\n## [HOOK]\nTesla scene.\n\n## [SLIDE: One — 01.png]\nBody.",
      videoBriefMarkdown: strongBrief,
      imageCount: 10,
      estimatedDurationSec: 90,
    });

    expect(result.warnings).not.toContain(
      "video brief has fewer than 2 high-shock facts"
    );
    expect(result.warnings).not.toContain(
      "video brief has fewer than 3 retention beats"
    );
  });

  test("fails when additive video fields are missing from the brief", () => {
    const weakBrief = strongBrief.replace(
      /## What The Video Adds[\s\S]*?## Audit Status/,
      "## Audit Status"
    );

    const result = auditYoutubeScript({
      scriptMarkdown:
        "# Title\n\n## [HOOK]\nTesla scene.\n\n## [SLIDE: One — 01.png]\nBody.",
      videoBriefMarkdown: weakBrief,
      imageCount: 10,
      estimatedDurationSec: 90,
    });

    expect(result.failures).toContain("video brief missing What The Video Adds");
    expect(result.failures).toContain("video brief missing Banned Phrases");
    expect(result.failures).toContain("video brief missing Ending");
  });

  test("fails a long video when image count is below target", () => {
    const result = auditYoutubeScript({
      scriptMarkdown:
        "# Title\n\n## [HOOK]\nTesla scene.\n\n## [SLIDE: One — 01.png]\nBody.",
      videoBriefMarkdown: strongBrief,
      imageCount: 10,
      estimatedDurationSec: 360,
    });

    expect(result.failures).toContain("image count 10 is below target 20");
  });

  test("summary records the audited script path", () => {
    const result = auditYoutubeScript({
      scriptMarkdown:
        "# Title\n\n## [HOOK]\nTesla scene.\n\n## [SLIDE: One — 01.png]\nBody.",
      videoBriefMarkdown: strongBrief,
      imageCount: 10,
      estimatedDurationSec: 90,
      scriptPath: "src/content/blogs/2026-06-20/youtube-script-v2.md",
    });

    expect(result.summaryMarkdown).toContain(
      "Script: src/content/blogs/2026-06-20/youtube-script-v2.md"
    );
  });
});
