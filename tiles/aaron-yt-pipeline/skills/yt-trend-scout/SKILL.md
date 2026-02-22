---
name: yt-trend-scout
description: Discover trending topics and generate ranked video ideas for a YouTube channel. Searches YouTube, Google Trends, X/Twitter, Reddit, Hacker News, and the web. Outputs ranked ideas with human approval gate. Use when user asks to "find video ideas", "what should I make a video about", "trending topics for YouTube", "scout trends", or "YouTube video ideas".
---

# YouTube Trend Scout

Research trending topics across multiple sources, score and rank video ideas, and let the user choose the best one.

## Output

| File | Path | Purpose |
|------|------|---------|
| Ideas | `src/videos/YYYY-MM-DD-{slug}/ideas.md` | Ranked video ideas with research context |

## Workflow

### Step 1: Load Preferences & Strategy

Check for user preferences:

```bash
test -f .aaron-skills/aaron-yt-pipeline/EXTEND.md && echo "project"
test -f "$HOME/.aaron-skills/aaron-yt-pipeline/EXTEND.md" && echo "user"
```

| Result | Action |
|--------|--------|
| Found | Read and apply preferences (niche, content pillars, competitor channels, audience). Skip matching questions in Step 2. |
| Not found | Proceed with defaults; ask all questions in Step 2. |

If `src/strategy/x.md` exists, read it for content pillars, voice rules, and distribution context.

### Step 2: Gather Context

**If the user provides a specific topic or direction**, use it as the starting point — skip directly to Step 3 with that context.

**Otherwise**, use ONE `AskUserQuestion` call (max 4 questions):

| Q | Question | Options |
|---|----------|---------|
| Q1 | What content area for this video? | [Content pillars from EXTEND.md or defaults], (Other) |
| Q2 | What video style? | Tutorial/How-to, Explainer/Essay, News/Trends recap, Story/Documentary |
| Q3 | Target video length? | Short (2-3 min), Medium (5-8 min), Long (10-15 min) |
| Q4 | Any specific angle or trend you've noticed? | (Free text via Other) |

If EXTEND.md provides defaults for some of these, skip those questions.

### Step 3: Multi-Source Trend Research

Perform **8-12 web searches** using `WebSearch` across multiple sources. Always include the current year and month for freshness.

| Source | Query Pattern | Purpose |
|--------|--------------|---------|
| YouTube | `{niche topic} {current_month} {current_year} site:youtube.com` | What's getting views now |
| YouTube trending | `{niche topic} trending YouTube {current_year}` | Rising topics |
| Google Trends | `{topic} Google Trends {current_month} {current_year}` | Search interest signals |
| Reddit | `site:reddit.com {topic} {current_year}` | Community discussions, pain points |
| X/Twitter | `{topic} trending {current_month} {current_year}` | Real-time pulse |
| Hacker News | `site:news.ycombinator.com {topic} {current_year}` | Tech community interest |
| General web | `{topic} news {current_month} {current_year}` | Breaking developments |
| Competitor analysis | `"{competitor_channel}" latest video {current_year}` | What competitors are covering |

**For each search, extract:**
- Top 3-5 specific trending sub-topics or discussions
- The angle or framing being used
- Engagement signals (views, upvotes, comments if visible)
- Contrarian or underserved perspectives
- Hook-worthy framings (surprising outcomes, contrarian takes, personal stories)

### Step 4: Score and Rank Ideas

From the research, synthesize **5-7 distinct video ideas**. Score each on a composite index:

| Factor | Weight | Signal |
|--------|--------|--------|
| Recency | 25% | How fresh is the trend (last week vs last month) |
| Volume | 20% | How many sources mention this topic |
| Competition gap | 20% | Are major creators already covering this, or is it underserved |
| Authority fit | 20% | Does this match the user's content pillars and expertise |
| Virality potential | 15% | Is there a strong hook, controversy, or surprise |

### Step 5: Present Ideas and Approval Gate

Present all ideas in ranked order using this format:

```markdown
## Idea 1: [Title] (Score: 92/100)

**Hook:** [1-sentence scroll-stopper]
**Why now:** [What trend signal makes this timely]
**Your angle:** [How this connects to your expertise — use "I built/did/learned" framing]
**Style:** [Tutorial / Explainer / News recap / Documentary]
**Estimated length:** [X-Y minutes]
**Competition:** Low / Medium / High
**Views potential:** High / Medium / Low
**Key sources:**
- [URL or description of trend signal]
- [URL or description]
```

After presenting all ideas, use `AskUserQuestion`:

| Q | Question | Options |
|---|----------|---------|
| Q1 | Which idea do you want to develop? | [Idea 1 title], [Idea 2 title], [Idea 3 title], Let me describe a different idea |
| Q2 | Any specific angle or personal story to weave in? | Skip — I'll figure it out during scripting, (Free text via Other) |

### Step 6: Save Approved Idea

Create the video project directory and save the approved idea:

**Directory:** `src/videos/YYYY-MM-DD-{slug}/` (today's date, or user-specified)

**File:** `src/videos/YYYY-MM-DD-{slug}/ideas.md`

**Format:**

```markdown
---
title: "Selected Idea Title"
slug: kebab-case-slug
date: YYYY-MM-DD
niche: "{niche from preferences}"
style: "{selected style}"
target_length: "{selected length}"
score: 92
---

# Video Idea: [Selected Title]

## Selected Idea

**Hook:** [hook text]
**Why now:** [trend signal]
**Your angle:** [expertise connection]
**Competition:** Low/Medium/High
**Estimated length:** X-Y minutes

## Research Context

### Trend Signals
- [Signal 1: description + source]
- [Signal 2: description + source]
- [Signal 3: description + source]

### Competitor Coverage
- [What competitors have covered or missed]

### Key References
- [URL] — [relevance]
- [URL] — [relevance]

## User Notes

[Any specific angle or story the user mentioned in the approval step]

## Other Ideas Considered

### Idea 2: [Title] (Score: XX)
[Brief summary]

### Idea 3: [Title] (Score: XX)
[Brief summary]
```

**After creating the file, print:**

```
Trend Scout Complete!

Selected: "[Idea Title]"
Style: [style]
Length: [target length]
Saved: src/videos/YYYY-MM-DD-{slug}/ideas.md

Next: Run /yt-script-writer to create the video script with scene-by-scene AI video prompts.
```

## Notes

- Web searches must include the current year and month to ensure relevance.
- Steps 4-5 are analytical — present data-driven reasoning for rankings.
- Do NOT write the video script. The ideas.md is the deliverable for this skill.
- The slug should be concise (3-5 words max) and derived from the selected idea title.
- If the user provides a specific topic upfront, still perform the research to validate timing and find the best angle.
