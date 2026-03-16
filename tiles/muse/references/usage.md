# Muse — Usage

## Invocation

```
/muse                              # Full discovery — Signal + context + web
/muse I've been thinking about X   # Start with a rough idea, skip to refinement
```

If you arrive with an idea, Muse skips the research phase and goes straight to sharpening your angle.

## First Run

The first time you invoke `/muse`, it asks 6 questions to learn who you are — your name, content pillars, audience, writing formats, and optional Signal DB / personal context paths. This creates `.aaron-skills/muse/EXTEND.md` and only happens once.

To reconfigure: delete `.aaron-skills/muse/EXTEND.md` and run `/muse` again.

## What Muse Does

```
┌─────────────────────────────────────────────┐
│  1. Attune        Read your EXTEND.md       │
│  2. Signal        Query your trend DB       │
│  3. Read You      Journals, notes, past work│
│  4. Scan the Web  4–6 targeted searches     │
│  5. Present       4–6 topic ideas           │
│  6. Go Deeper     Conversation to sharpen   │
│  7. Confirm       One clear direction       │
└─────────────────────────────────────────────┘
```

Steps 2–4 gather intelligence. Steps 5–6 are a conversation. Step 7 is the output.

## What Muse Outputs

A confirmed topic direction — not a content plan, not a draft:

```
## Your Next Piece

Working title: "..."
In one sentence: ...
The story: ...
Pillar: ...
Format: blog / newsletter / ...
Why this week: ...
What makes it yours: ...
```

## Pairing with Other Skills

Muse finds the topic. Other skills take it from there:

| After Muse | Skill | What it does |
|------------|-------|-------------|
| Write the plan | `/blog-brainstorm` | Full content plan with outline, hooks, distribution briefs |
| Add images | `/blog-illustrate` | AI-generated illustrations for the finished post |
| Make a video | `/aaron-video-gen` | YouTube video from script + slides |

Configure `next_skill` in EXTEND.md to get an automatic hand-off suggestion.

## With or Without Signal DB

| Setup | What happens |
|-------|-------------|
| **With Signal DB** | Muse queries your Turso database for trending items and daily pulse summaries, then combines with web search + personal context |
| **Without Signal DB** | Muse relies on web search + your journals/notes. Still fully functional — just less personalized trend data |

## Editing Preferences

All configuration lives in `.aaron-skills/muse/EXTEND.md` (YAML frontmatter). Edit directly to:

- Change content pillars or audience
- Add/remove writing formats
- Update Signal DB credentials
- Advance CTA rotation
- Set a different `next_skill` for hand-off

See `references/config/preferences-schema.md` for the full field reference.
