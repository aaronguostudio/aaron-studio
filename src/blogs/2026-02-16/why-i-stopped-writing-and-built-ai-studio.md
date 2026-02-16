# Why I Stopped Writing Blog Posts (And Built an AI Studio Instead)

I've tried to be a consistent blogger for years. I'd get fired up, write two or three posts, feel great about it — and then life would happen. Work gets busy. Weekends fill up. The draft sitting in my editor starts feeling stale. I'd tell myself I'll get back to it next week, and next week would turn into next month, and next month would turn into silence.

Rinse and repeat. For years.

But last month, I published more blog posts than I had in the previous two years combined. Not because I suddenly found more time or discovered some productivity hack. I stopped trying to *write* blog posts and started *building a system* that turns my ideas into published content.

This is the story of how I went from a chronic blog-quitter to a consistent creator — by approaching the problem like an engineer, not a writer.

![The graveyard of abandoned blogs — drafts that never saw the light of day](imgs/01-infographic-abandoned-blogs.png)

## The Real Reason I Kept Quitting

Let me be honest about what was actually happening. It wasn't a lack of ideas. Ideas were everywhere — a frustrating timeshare pitch in Las Vegas, a realization about how AI was changing my daily work, a hot take on product strategy. I had a Notes app full of half-formed thoughts begging to become posts.

The problem was everything that comes *after* the idea.

Think about what it actually takes to publish a single blog post:

- **Writing the draft** — 1 to 2 hours if the words are flowing, more if they're not
- **Formatting and editing** — cleaning up markdown, adding headers, making it readable (30 minutes)
- **Creating images** — cover image, diagrams, illustrations that aren't just stock photos (1 hour, minimum)
- **Translating to Chinese** — I write for a bilingual audience, so every post needs a natural Chinese version, not a Google Translate job (1 to 2 hours)
- **Publishing** — frontmatter, image paths, SEO metadata, deploying to the site (30 minutes)
- **Social media** — writing an X thread, a LinkedIn post, maybe a YouTube script (another 30 minutes)

Add it up: a single blog post is a 5 to 6 hour commitment. As a head of products who still codes, with a full-time job and side projects, those hours simply don't exist on a consistent basis. The math never worked. So I'd write when inspiration and free time happened to collide — which was almost never.

![The hidden cost of a blog post — 6 hours from idea to published](imgs/02-infographic-hidden-cost.png)

## The Shift: What If I Only Did the Thinking?

The breakthrough wasn't about writing faster. It was a different question entirely: **what if I only had to do the part that requires my brain?**

Every step in that 6-hour pipeline falls into one of two categories:

1. **Thinking** — deciding what to say, what angle to take, what personal experience to share, what the reader should take away
2. **Execution** — turning those decisions into formatted text, images, translations, metadata, and deployed pages

I'm the only one who can do the thinking. But the execution? That's process. That's repeatable. That's automatable.

This is where most "AI for blogging" advice gets it wrong. They tell you to use ChatGPT to write your posts. That gives you generic content that sounds like everyone else — AI slop. Nobody wants to read that, and I definitely don't want to publish it.

I didn't want AI to think for me. I wanted AI to handle everything *around* the thinking.

![Thinking vs. execution — the only part that needs to be human](imgs/03-infographic-thinking-vs-execution.png)

## What I Built: An AI Content Studio

So I built one. I call it my content studio — a set of AI-powered skills that chain together to transform a rough idea into a fully published, bilingual blog post with illustrations, social media content, and even a video.

Here's what a single blog post looks like in my system:

```
src/blogs/2026-02-14/
├── plan.md                        ← my rough idea (the only thing I truly write)
├── marriott-timeshare-las-vegas.md     ← English blog post
├── marriott-timeshare-las-vegas-zh.md  ← Chinese translation
├── youtube-script.md              ← narration script
├── x-teaser.md                    ← X/Twitter thread
├── linkedin-post.md               ← LinkedIn version
├── video.mp4                      ← YouTube-ready video
└── imgs/
    ├── 00-cover.png               ← cover image
    ├── 01-infographic-*.png       ← illustration
    ├── 02-scene-*.png             ← illustration
    └── ... (5 custom illustrations)
```

One input. Eight outputs. And the input? It's a `plan.md` that looks like this — my actual plan for the Marriott timeshare post:

> 我最近有 travel 到 Las Vegas join Marriot 他们的 vacation club 在试图销售他们的 time sharing 系统... 根据以上的信息，是否可以帮我分析 Marriot 这个产品的商业模式，盈利模式以及销售中存在的问题。

That's it. A brain dump in mixed Chinese and English. No formatting, no structure, just the raw idea and what I want the post to explore. From there, the pipeline takes over.

## The Pipeline: How It Actually Works

Each step is handled by a specialized AI skill that knows exactly what to do:

**Step 1: I write the plan.** This is the creative part — capturing what I want to say, the angle I want to take, the personal experience at the center. Sometimes it's a paragraph. Sometimes it's bullet points. Sometimes it's a voice note transcription. The format doesn't matter; the thinking does.

**Step 2: AI drafts the blog post.** Using my plan as a guide, AI writes the full article. But here's the key — I review everything. I adjust the voice, add details only I would know, cut parts that feel generic. The draft gets me 80% there; I make it 100% mine.

**Step 3: AI generates illustrations.** My article illustrator skill analyzes the post, identifies where images would add value, and generates them with a consistent visual style. Not stock photos — custom illustrations that match the content. Infographics for data, scenes for narrative moments, comparisons for analysis sections.

**Step 4: AI translates to Chinese.** Not word-for-word translation — natural, fluent Simplified Chinese that reads like it was written by a native speaker. Technical terms stay in English where appropriate. The result is a genuine Chinese article, not a translated English one.

**Step 5: AI creates distribution content.** An X teaser that hooks the Twitter audience. A LinkedIn post framed for professionals. A YouTube script structured for narration. Each one formatted for its platform, not just copy-pasted.

**Step 6: AI generates a video.** The YouTube script becomes a narrated slideshow with transitions, background music, and proper pacing. Ready to upload.

**Step 7: AI publishes.** Frontmatter generation, image path rewriting, sequential post numbering, deployment to my Nuxt 3 blog site. Both English and Chinese versions, linked as translations.

![The content pipeline — from rough plan to 8 published outputs](imgs/04-infographic-content-pipeline.png)

## Why This Isn't AI Slop

I know what you might be thinking. "Isn't this just AI-generated content with extra steps?"

No. And the distinction matters.

**AI-generated content** starts with a prompt like "write me a blog post about timeshares." The AI invents the perspective, the examples, the opinions. It sounds like everyone and no one at the same time.

**AI-produced content** starts with my experience, my analysis, my perspective. The Marriott post exists because I actually sat through that pitch and was genuinely frustrated by the sales tactics. The AI Native Journey post exists because I actually changed how I work and wanted to document what I learned. No AI can invent those experiences.

AI handles the production — the writing mechanics, the formatting, the translation, the images. But every post starts from something real. That's why the output doesn't read like generic content. The ideas have edges. The examples are specific. The opinions are mine.

The proof is in the results: I'm publishing consistently for the first time in years. My Marriott post started as a frustrated Chinese brain dump and became a bilingual analysis of timeshare business models with custom illustrations. That kind of transformation — from raw experience to polished, multi-format content — is what the pipeline enables.

## What This Means for You

I'm not suggesting everyone needs to build exactly what I built. But I think there's a broader insight here that applies to any creator struggling with consistency.

**The barrier to being a consistent creator in 2026 is not talent or ideas — it's execution overhead.** Every manual step between your idea and your audience is a friction point where you might quit. The more steps, the more likely you'll abandon the post halfway through.

AI tools have matured to the point where you can automate most of that overhead. You don't need a full content studio on day one. Start with the step that kills your momentum:

- If translation is your bottleneck, automate that first
- If creating images stops you from publishing, use AI illustration
- If the publishing process is tedious, script it away
- If repurposing for social media feels like a chore, let AI draft the variations

Each step you remove from your manual workload makes consistency that much more sustainable. And consistency compounds — more output means more audience, more feedback, more motivation to keep going.

![Start small — remove one friction point at a time](imgs/05-infographic-start-small.png)

## The Honest Truth

I didn't become a better writer. My ideas aren't sharper than they were two years ago when I was failing to blog. What changed is that I stopped treating blogging as a writing problem and started treating it as a systems problem.

The blog post you're reading right now went through this exact pipeline. A rough plan, a draft, illustrations, translation, publishing — all handled by the AI content studio I built. My job was the thinking. The system handled the rest.

If you're someone who has great ideas but struggles to ship them consistently, I'd encourage you to look at your workflow the same way. Find the step that's killing your momentum. That's your starting point.

The tools exist. The question is whether you'll build the system.

---

*This is part of my AI Native Journey series, where I share how AI is changing the way I build, create, and work. If you're building your own AI-powered workflows, I'd love to hear what's working for you.*
