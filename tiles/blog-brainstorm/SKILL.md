---
name: blog-brainstorm
description: Research trending topics, brainstorm blog ideas, and create a structured content plan. Use when user asks to "brainstorm blog ideas", "find blog topics", "plan a blog post", "what should I write about", "blog ideation", or "research blog topics".
---

# Blog Brainstorm

Research trending topics across the web, combine them with personal experience, and produce a structured content plan through interactive conversation.

## Output

| File | Path | Purpose |
|------|------|---------|
| Idea | `src/content/blogs/YYYY-MM-DD/idea.md` | raw topic, reader pain, initial thesis, why now |
| Memory reflection | `src/content/blogs/YYYY-MM-DD/memory-reflection.md` | prior-post connections and internal link candidates |
| Editorial brief | `src/content/blogs/YYYY-MM-DD/editorial-brief.md` | reader pain, sharp thesis, evidence need, counterargument, reusable frame, distribution hook |
| Research dossier | `src/content/blogs/YYYY-MM-DD/research-dossier.md` | internal Chinese research notes: sources, cases, counterarguments, key facts, open questions |
| Claim ledger | `src/content/blogs/YYYY-MM-DD/claim-ledger.md` | fact / inference / judgment map with source dates, confidence, and verification status |
| Content plan | `src/content/blogs/YYYY-MM-DD/content-plan.md` | structured plan for writing the blog post |

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
| Not found | Use the current request and ask only for missing context that affects the article. |

**Always read** `src/content/strategy/x.md` for content pillars, rules, and distribution strategy. This grounds the entire brainstorm in the publishing workflow.

### Step 2: Gather Context

**If the user provides a rough idea or an existing `plan.md`**, reuse that context and fill the author-intent brief in Step 2b; do not repeat answered questions.

**Otherwise**, select only unanswered questions that matter from the following prompts. Use the available conversation tool; no fixed questionnaire is required:

| Q | Question | Options |
|---|----------|---------|
| Q1 | Which content pillar? | AI-Native Execution (workflows, tool breakdowns, practical guides), Product Leadership (frameworks, leading teams, strategy-to-delivery), Building in Public (project updates, revenue, mistakes, solopreneur), (Other) |
| Q2 | What is the primary goal? | Build authority / thought leadership, Drive traffic / SEO, Spark community discussion, Personal story / brand building |
| Q3 | Who is the target reader? | Tech professionals / developers, Product leaders / managers, General audience, Aspiring creators / entrepreneurs |
| Q4 | What tone fits this post? | Analytical / data-driven, Personal narrative / storytelling, Practical how-to / tutorial, Opinion / hot take |
| Q5 | What day will this publish? | This Wednesday, Next Wednesday, (Other date) |

If EXTEND.md provides defaults for some of these, skip those questions.

### Step 2b: Author Intent And Relevant Memory

Read `tiles/blog-production/references/editorial-system.md`. Capture author intent, reader promise, form/lead language and evidence boundaries in the existing `editorial-brief.md`. Ask only for missing details that would materially change the article.

Consult earlier posts only if they help explain a changed idea or provide relevant evidence. In `memory-reflection.md`, record the useful connection or that none is needed; no reading quota or compulsory continuity thesis.

### Step 3: Research Trending Topics

Research until the current reader promise has sufficient evidence. For time-sensitive work, verify dates and use current sources; do not use a fixed search quota. The following source patterns are options, not required searches.

| Source | Query pattern | Purpose |
|--------|--------------|---------|
| Reddit | `site:reddit.com {topic} {current_year}` | Community discussions, pain points, debates |
| X/Twitter | `{topic} trending {current_month} {current_year}` | Real-time pulse, hot takes |
| Hacker News | `site:news.ycombinator.com {topic}` | Tech community interest |
| General web | `{topic} trends {current_year}` | Broad trend landscape |
| YouTube | `{topic} {current_month} {current_year} site:youtube.com` | Video content gaps and popular angles |
| Competitor blogs | `{topic} blog {current_year}` | What others are writing, gaps to fill |
| X threads | `{topic} thread {current_month} {current_year}` | High-performing thread structures and hooks |

**From relevant results, extract:**
- Top 3-5 specific trending sub-topics or discussions
- The angle or framing being used
- Engagement signals (upvotes, comments, shares if visible)
- Contrarian or underserved perspectives
- Hook-worthy angles (surprising outcomes, contrarian takes, personal "I did X" stories)

### Step 4: Present Findings & Brainstorm

If the direction is still open, organize relevant findings into a few topic clusters. If the author already chose a direction, refine that direction without a new selection round. A cluster can be presented as:

```
## Topic Cluster: [Theme Name]

**What's trending:** [1-2 sentence summary of what people are discussing]
**Key discussions:**
- [Specific thread/article/post with brief summary]
- [Another reference point]

**Your angle:** [The author's genuine connection, judgment or useful interpretation; do not invent experience.]
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
**Hook:** [Name the subject and offer a concrete, supportable reason to read. Match the author's voice; do not force a formula or an invented first-person experience.]
**Unique value:** [What makes this different from existing content]
**Personal connection:** [Genuine experience or author judgment; sourced examples remain attributed]
**X distribution:** [Can this become a standalone thread? What's the visual — screenshot, diagram, before/after?]
```

3. **Discuss with the user.** This step is iterative — continue the conversation until the angle is locked:
   - Which angle resonates most?
   - Do they have a specific personal story or experience to weave in?
   - Any adjustments to the framing?
   - What key points must be included?
	   - What visual could anchor the thread? (screenshot, diagram, before/after, code snippet)

### Step 5b: Output Editorial Brief, Research Dossier, And Claim Ledger

Before `content-plan.md`, write:
- `editorial-brief.md`
- `research-dossier.md`
- `claim-ledger.md`

`editorial-brief.md` follows the single author-intent and reader-promise contract in `tiles/blog-production/references/editorial-system.md`. Include only the thesis, objections, mechanisms and reusable frames that the chosen form needs. Do not require every article to be a commercial argument.

`research-dossier.md` is an internal review artifact and should be written in Chinese by default. It must include:
- 这份材料要回答的问题;
- 核心一手资料;
- 可以使用但要谨慎的二手材料;
- 可用案例;
- 主要反方观点;
- 关键事实与引用;
- 开放问题;
- 文章应保留的判断.

Build `claim-ledger.md` from the research dossier before outlining. For every material claim, record whether it is a fact, inference, judgment, or personal observation; its source and source date; confidence; planned article use; and freshness caveat. Prefer primary sources. A vendor announcement supports what the vendor announced or claimed, not neutral proof of customer outcomes. End with `Decision: PASS` only after links, dates, numbers, and inference boundaries have been checked.

### Step 6: Output Content Plan

Once the angle is confirmed, create the blog directory and content plan.

**Create directory:** `src/content/blogs/YYYY-MM-DD/` (today's date, or user-specified)

**Create file:** `src/content/blogs/YYYY-MM-DD/content-plan.md`

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

**Positioning:** A builder sharing real work and considered reactions; the article form follows the current intent.
**Voice rule:** Preserve the author's stance. First-person experience must be real; source-backed interpretation is also valid.
**This post's material:** [Real experience, source-backed examples and author judgment, clearly distinguished]

## Hook / Opening

**Blog hook:** [2-3 sentences — how the blog post opens]
**X thread hook (tweet 1):** [A concise, supportable reason to read; match the author's voice.]

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
- Blog CTA: optional if it fits the ending
- Thread CTA: [based on cta_rotation — "follow for more", "newsletter link in bio", or "reply with your experience"]

## Research References

- [URL] - [What's relevant]
- [URL] - [What's relevant]

## SEO Notes

**Primary keyword:** [main search term]
**Secondary keywords:** [2-3 related terms]
**Search intent:** [informational / navigational / commercial]

## Distribution Intent

Name only the requested channels and each reader promise. Use `tiles/blog-write/references/social-distribution.md` when preparing those assets; do not duplicate platform formats or assume one copy fits newsletter and LinkedIn.

## Sibling Edition

Preserve the claim set and author stance across English and Chinese, with natural expression in each.

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
Plan saved: src/content/blogs/YYYY-MM-DD/content-plan.md

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
- Content plan references `src/content/strategy/x.md` for content rules and publishing workflow. If the strategy changes, the plan output stays current.
- The Distribution Plan section provides briefs, not finished content. Other skills or manual writing turn briefs into final x-teaser.md, newsletter-teaser.md, etc.
- CTA rotation should cycle across posts: follow → newsletter → reply → follow → ... Track the last used CTA across content plans to avoid repeating.
- Hooks should give a concrete reason to read and fulfill their promise; formulas are optional aids, not a voice requirement.
