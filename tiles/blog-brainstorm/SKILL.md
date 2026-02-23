---
name: blog-brainstorm
description: Research trending topics, brainstorm blog ideas, and create a structured content plan. Use when user asks to "brainstorm blog ideas", "find blog topics", "plan a blog post", "what should I write about", "blog ideation", or "research blog topics".
---

# Blog Brainstorm

Research trending topics across the web, combine them with personal experience, and produce a structured content plan through interactive conversation.

## Output

| File | Path | Purpose |
|------|------|---------|
| Content plan | `src/blogs/YYYY-MM-DD/content-plan.md` | Structured plan for writing the blog post |

## Workflow

### Step 1: Load Preferences & Strategy

Check for user preferences:

```bash
test -f .aaron-skills/blog-brainstorm/EXTEND.md && echo "project"
test -f "$HOME/.aaron-skills/blog-brainstorm/EXTEND.md" && echo "user"
```

| Result | Action |
|--------|--------|
| Found | Read and apply preferences (expertise areas, audience, tone, brand context). Skip matching questions in Step 2. |
| Not found | Proceed with defaults; ask all questions in Step 2. |

**Always read** `src/strategy/x.md` for content pillars, rules, and distribution strategy. This grounds the entire brainstorm in the publishing workflow.

### Step 2: Gather Context

**If the user provides a rough idea or an existing `plan.md`**, read it and use it as the starting point — skip directly to Step 3 with that context.

**Otherwise**, use ONE `AskUserQuestion` call (max 4 questions, 2-4 options each):

| Q | Question | Options |
|---|----------|---------|
| Q1 | Which content pillar? | AI-Native Execution (workflows, tool breakdowns, practical guides), Product Leadership (frameworks, leading teams, strategy-to-delivery), Building in Public (project updates, revenue, mistakes, solopreneur), (Other) |
| Q2 | What is the primary goal? | Build authority / thought leadership, Drive traffic / SEO, Spark community discussion, Personal story / brand building |
| Q3 | Who is the target reader? | Tech professionals / developers, Product leaders / managers, General audience, Aspiring creators / entrepreneurs |
| Q4 | What tone fits this post? | Analytical / data-driven, Personal narrative / storytelling, Practical how-to / tutorial, Opinion / hot take |
| Q5 | What day will this publish? | This Wednesday, Next Wednesday, (Other date) |

If EXTEND.md provides defaults for some of these, skip those questions.

### Step 3: Research Trending Topics

Perform **6-10 web searches** using `WebSearch` across multiple sources. Always include the current year and month for freshness.

| Source | Query pattern | Purpose |
|--------|--------------|---------|
| Reddit | `site:reddit.com {topic} {current_year}` | Community discussions, pain points, debates |
| X/Twitter | `{topic} trending {current_month} {current_year}` | Real-time pulse, hot takes |
| Hacker News | `site:news.ycombinator.com {topic}` | Tech community interest |
| General web | `{topic} trends {current_year}` | Broad trend landscape |
| YouTube | `{topic} {current_month} {current_year} site:youtube.com` | Video content gaps and popular angles |
| Competitor blogs | `{topic} blog {current_year}` | What others are writing, gaps to fill |
| X threads | `{topic} thread {current_month} {current_year}` | High-performing thread structures and hooks |

**For each search, extract:**
- Top 3-5 specific trending sub-topics or discussions
- The angle or framing being used
- Engagement signals (upvotes, comments, shares if visible)
- Contrarian or underserved perspectives
- Hook-worthy angles (surprising outcomes, contrarian takes, personal "I did X" stories)

### Step 4: Present Findings & Brainstorm

Organize findings into **3-5 topic clusters**. Present each as:

```
## Topic Cluster: [Theme Name]

**What's trending:** [1-2 sentence summary of what people are discussing]
**Key discussions:**
- [Specific thread/article/post with brief summary]
- [Another reference point]

**Your angle:** [How this connects to your expertise/experience — use "I built/did/learned" framing]
**Content potential:** [Why this would resonate — audience interest + personal authority]
**Thread potential:** High / Medium / Low — [can this be told as a standalone 5-8 tweet story?]
**Pillar:** AI-Native Execution / Product Leadership / Building in Public
**Competition:** Low / Medium / High
```

After presenting all clusters, use `AskUserQuestion`:

| Q | Question | Options |
|---|----------|---------|
| Q1 | Which cluster interests you most? | [Cluster 1], [Cluster 2], [Cluster 3], Let me describe a different direction |

### Step 5: Refine the Angle

This is the creative heart of the skill — free-form conversation.

1. **Analyze the competition.** Use `WebFetch` on 2-3 top-performing articles in the chosen topic to understand:
   - What angles have been covered already
   - What is missing from the conversation
   - What unique perspective the user can bring

2. **Propose 3 specific blog post angles:**

```
### Angle A: "[Working Title]"
**Hook (first tweet):** [Draft an actual hook using one of these formulas:
  - "I [did surprising thing]. Here's what happened:"
  - "Most [role] get [topic] wrong. Here's why:"
  - "[Number] lessons from [specific experience]:"
  - "I spent [time] building [thing]. Here's the breakdown:"
  - "Stop [common mistake]. Do this instead:"]
**Unique value:** [What makes this different from existing content]
**Personal connection:** [The specific "I did this" story that makes it authentic]
**X distribution:** [Can this become a standalone thread? What's the visual — screenshot, diagram, before/after?]
```

3. **Discuss with the user.** This step is iterative — continue the conversation until the angle is locked:
   - Which angle resonates most?
   - Do they have a specific personal story or experience to weave in?
   - Any adjustments to the framing?
   - What key points must be included?
   - What visual could anchor the thread? (screenshot, diagram, before/after, code snippet)

### Step 6: Output Content Plan

Once the angle is confirmed, create the blog directory and content plan.

**Create directory:** `src/blogs/YYYY-MM-DD/` (today's date, or user-specified)

**Create file:** `src/blogs/YYYY-MM-DD/content-plan.md`

**Format:**

```markdown
---
title: "Working Title of the Blog Post"
slug: kebab-case-slug
date: YYYY-MM-DD
pillar: ai-native-execution | product-leadership | building-in-public
target_audience: [from Step 2]
tone: [from Step 2]
content_goal: [from Step 2]
estimated_word_count: 1500-2500
publish_day: Wednesday, YYYY-MM-DD
cta_rotation: follow | newsletter | reply
---

# Content Plan: [Working Title]

## Voice Check

**Positioning:** Ship with AI, not about AI — builder who ships, not commentator.
**Voice rule:** Use "I" not "you should." Share what I did, not what others should do.
**This post's personal anchor:** [The specific personal experience/build/result this post is grounded in]

## Hook / Opening

**Blog hook:** [2-3 sentences — how the blog post opens]
**X thread hook (tweet 1):** [Single tweet, max 280 chars, uses a hook formula. Must stop the scroll.]

## Core Argument / Thesis

[1-2 sentences: the central point the post will make]

## Outline

### Section 1: [Title]
- Key points to cover
- Supporting evidence or examples
- Personal experience to include

### Section 2: [Title]
- Key points to cover
- Supporting evidence or examples
- Personal experience to include

### Section 3: [Title]
- Key points to cover
- Supporting evidence or examples
- Personal experience to include

### Conclusion / Call to Action
- How to wrap up
- What the reader should take away
- Blog CTA: newsletter signup
- Thread CTA: [based on cta_rotation — "follow for more", "newsletter link in bio", or "reply with your experience"]

## Research References

- [URL] - [What's relevant]
- [URL] - [What's relevant]

## SEO Notes

**Primary keyword:** [main search term]
**Secondary keywords:** [2-3 related terms]
**Search intent:** [informational / navigational / commercial]

## Distribution Plan

### X Post Brief (publish: [publish_day])
**Format:** Single long-form post (X Premium supports up to 25K chars). Standalone value. NO link in main post.
**Hook:** [Opening lines — the scroll-stopper. Uses a hook formula.]
**Key points:** [3-5 key insights, each as a short paragraph. One idea per paragraph.]
**Closing:** [CTA — rotate per cta_rotation field]
**Reply with link:** "Full deep dive: [blog URL]" — posted as a reply, NOT in the main post.
**Visual:** [What screenshot/diagram/image to include — at least one]

### X Standalone Tweet Brief (publish: [publish_day + 2 days])
**Format:** Single tweet with image.
**The insight:** [Pull ONE surprising or quotable insight from the post]
**Image idea:** [Screenshot, diagram, or quote card]

### Newsletter / LinkedIn Teaser Brief (publish: [publish_day])
**Format:** Short teaser post — same copy works for email newsletter (Beehiiv) and LinkedIn. Plain text, no markdown formatting. Ends with bare blog URL.
**Structure:** 3-4 short paragraphs: hook → contrast/insight → supporting data point → CTA line with bare URL.
**Link destination:** blog post URL (bare URL on its own line at the end)

### Chinese Version
**Translate:** Full blog post + X thread

## Personal Experience Notes

[Free-form section capturing personal stories, anecdotes, or data
points discussed during brainstorming that should be woven into the post.]
```

**After creating the file, print:**

```
Blog Brainstorm Complete!

Pillar: [pillar name]
Title: "[Working Title]"
Publish day: [date]
CTA this cycle: [follow / newsletter / reply]
Plan saved: src/blogs/YYYY-MM-DD/content-plan.md

Publishing timeline:
- [Wed date]: Blog + Newsletter/LinkedIn + X Post
- [Thu/Fri date]: Standalone tweet with image

Next steps:
1. Write the blog post from the content plan
2. Illustrate with /baoyu-article-illustrator
3. Write X post (use X post brief in content plan)
4. Write X standalone tweet (use tweet brief)
5. Write newsletter / LinkedIn teaser (use teaser brief)
6. Write video script (youtube-script.md)
7. Generate video with /aaron-video-gen
8. Publish with /publish-to-blog
```

## Notes

- `content-plan.md` is separate from the illustration `plan.md` / `outline.md`. They coexist.
- If the user provides an existing rough idea or `plan.md`, use it as input and enhance through research.
- Web searches must include the current year to ensure relevance.
- Steps 4-5 are conversational — use free-form discussion, not just structured questions.
- Do NOT write the actual blog post. The content plan is the deliverable.
- Content plan references `src/strategy/x.md` for content rules and publishing workflow. If the strategy changes, the plan output stays current.
- The Distribution Plan section provides briefs, not finished content. Other skills or manual writing turn briefs into final x-teaser.md, newsletter-teaser.md, etc.
- CTA rotation should cycle across posts: follow → newsletter → reply → follow → ... Track the last used CTA across content plans to avoid repeating.
- Post hooks should use a hook formula from the strategy and stop the scroll in the first few lines.
