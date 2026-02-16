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

### Step 1: Load Preferences

Check for user preferences:

```bash
test -f .aaron-skills/blog-brainstorm/EXTEND.md && echo "project"
test -f "$HOME/.aaron-skills/blog-brainstorm/EXTEND.md" && echo "user"
```

| Result | Action |
|--------|--------|
| Found | Read and apply preferences (expertise areas, audience, tone, brand context). Skip matching questions in Step 2. |
| Not found | Proceed with defaults; ask all questions in Step 2. |

### Step 2: Gather Context

**If the user provides a rough idea or an existing `plan.md`**, read it and use it as the starting point — skip directly to Step 3 with that context.

**Otherwise**, use ONE `AskUserQuestion` call (max 4 questions, 2-4 options each):

| Q | Question | Options |
|---|----------|---------|
| Q1 | What area do you want to explore? | AI & dev productivity, Product leadership, Tech + life experiences, (Other) |
| Q2 | What is the primary goal? | Build authority / thought leadership, Drive traffic / SEO, Spark community discussion, Personal story / brand building |
| Q3 | Who is the target reader? | Tech professionals / developers, Product leaders / managers, General audience, Aspiring creators / entrepreneurs |
| Q4 | What tone fits this post? | Analytical / data-driven, Personal narrative / storytelling, Practical how-to / tutorial, Opinion / hot take |

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

**For each search, extract:**
- Top 3-5 specific trending sub-topics or discussions
- The angle or framing being used
- Engagement signals (upvotes, comments, shares if visible)
- Contrarian or underserved perspectives

### Step 4: Present Findings & Brainstorm

Organize findings into **3-5 topic clusters**. Present each as:

```
## Topic Cluster: [Theme Name]

**What's trending:** [1-2 sentence summary of what people are discussing]
**Key discussions:**
- [Specific thread/article/post with brief summary]
- [Another reference point]

**Your angle:** [How this connects to the user's expertise/experience]
**Content potential:** [Why this would resonate — audience interest + personal authority]
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
**Hook:** [The opening premise or question]
**Unique value:** [What makes this different from existing content]
**Personal connection:** [How user's experience makes this authentic]
**Shareability:** [Why people would share this]
```

3. **Discuss with the user.** This step is iterative — continue the conversation until the angle is locked:
   - Which angle resonates most?
   - Do they have a specific personal story or experience to weave in?
   - Any adjustments to the framing?
   - What key points must be included?

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
topic_area: [from Step 2]
target_audience: [from Step 2]
tone: [from Step 2]
content_goal: [from Step 2]
estimated_word_count: 1500-2500
---

# Content Plan: [Working Title]

## Hook / Opening

[2-3 sentences describing how the post should open. What grabs the reader?]

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
- Call to action (comment, share, subscribe)

## Research References

- [URL] - [What's relevant]
- [URL] - [What's relevant]

## SEO Notes

**Primary keyword:** [main search term]
**Secondary keywords:** [2-3 related terms]
**Search intent:** [informational / navigational / commercial]

## Distribution Ideas

- **X/Twitter angle:** [How to tease this on X]
- **LinkedIn angle:** [How to frame for LinkedIn]
- **YouTube potential:** [Video angle if applicable]

## Personal Experience Notes

[Free-form section capturing the user's personal stories, anecdotes, or data
points discussed during brainstorming that should be woven into the post.]
```

**After creating the file, print:**

```
Blog Brainstorm Complete!

Topic: [topic area]
Title: "[Working Title]"
Plan saved: src/blogs/YYYY-MM-DD/content-plan.md

Next steps:
1. Write the blog post from the content plan
2. Illustrate with /baoyu-article-illustrator
3. Create social teasers (x-teaser.md, linkedin-post.md)
4. Create video script (youtube-script.md)
5. Generate video with /aaron-video-gen
6. Publish with /publish-to-blog
```

## Notes

- `content-plan.md` is separate from the illustration `plan.md` / `outline.md`. They coexist.
- If the user provides an existing rough idea or `plan.md`, use it as input and enhance through research.
- Web searches must include the current year to ensure relevance.
- Steps 4-5 are conversational — use free-form discussion, not just structured questions.
- Do NOT write the actual blog post. The content plan is the deliverable.
