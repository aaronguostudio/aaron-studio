# Style Directions

## Article Fit Summary

This FDE article is an enterprise / market argument with one practical framework section. It needs credible business texture, enough visual tension for the "expensive tokens" critique, and a clean ACTOR framework image that can be reused later.

The main visual risk is sameness: if every image uses dark workbench + glass + cyan line, the set becomes more polished than the first version but still too uniform. The second risk is over-correction: if every image switches style, the post may feel visually random.

## Style Direction Menu

| Direction | Visual character | Best use in this article | Why it fits | Risks | Whole post or accent? |
|---|---|---|---|---|---|
| Enterprise Editorial Workbench | Premium realistic desk/workbench, paper, runbooks, stamps, graphite/amber lighting | Cover, thumbnail, one body metaphor | Strong business credibility and good title tension | Can become dark/heavy if used everywhere | Primary or cover-only |
| Clean Operator Graphics | Warm white background, large shapes, restrained glass, no tiny labels | ACTOR, consulting vs FDE, platform convergence | Makes frameworks readable and reusable | Can feel too sterile if used for every image | Accent for diagrams/frameworks |
| Human Paper Metaphor | Soft editorial paper objects, notebooks, folders, pencil lines, very low glow | Demo-to-deployment gap, personal workflow analogy | Gives the reader breathing room and reduces AI visual fatigue | May feel too quiet for cover | Primary body style |
| Magazine Photo Collage | Real object texture plus restrained graphic overlay | Cover alternative, market/platform section | Less "AI illustration", more business/editorial | Can drift into stock-photo energy if people/rooms appear | Cover or one body image |
| System Sketch Minimal | Clean hand-drawn or paper-sketch diagrams with very low element count | Optional comparison or ACTOR variation | Adds authorial thinking and lowers synthetic polish | Can get dirty fast; bad for dense diagrams | Experimental accent only |

## Style Library Candidates

Additional candidates from `src/content/strategy/blog-visual-style-library.md` for a broader style probe:

| Candidate | Source style family | Best role | Why it deserves consideration | Main risk |
|---|---|---|---|---|
| Infographic Editorial | Infographic Editorial | ACTOR / deployment gap summary | Tests whether the argument can become a shareable visual without looking like a consulting slide | Tiny labels and chart clutter |
| Cartoon Briefing | Cartoon Briefing | Consulting vs FDE contrast, reader hook | Tests a warmer and more memorable voice for a serious enterprise topic | Too cute or unserious |
| Executive Brief | Executive Brief | Cover, thesis, thumbnail-adjacent image | Tests a board-memo / strategy-brief tone that may fit enterprise AI readers | Generic slide-deck energy |
| Data Poster | Data Poster | Provocative cover alternative | Tests whether "expensive tokens" can become a stronger visual hook | Decorative numbers without substance |
| Cutaway System Map | Cutaway System Map | Deployment operating model | Tests whether FDE can be shown as layers and handoffs, not just desk metaphors | Isometric clutter |
| Paper System Sketch | Paper System Sketch | Lightweight framework explanation | Tests a human, thinking-in-public style with less AI polish | Messy handwriting or low authority |

## Style Probe Menu

Run these as v4 style probes. They are intentionally not a final cohesive set.

| Probe | Style family | Target image role | Visual difference from other probes | Success criteria |
|---|---|---|---|---|
| v4-a | Infographic Editorial | framework / share card | Bright magazine infographic, large shapes, minimal type zones | ACTOR and deployment gap are scanable in five seconds |
| v4-b | Cartoon Briefing | contrast / hook | Simplified editorial cartoon, lighter mood, one punchline | Serious point becomes more memorable without feeling childish |
| v4-c | Executive Brief | thesis / cover alternative | Board memo surface, crisp grid, restrained evidence blocks | Feels authoritative but not like generic PowerPoint |
| v4-d | Data Poster | provocative cover alternative | Poster composition, one large token motif, bold negative space | "Expensive tokens don't equal value" lands instantly |
| v4-e | Cutaway System Map | mechanism | Layered enterprise workflow cutaway, few labels, visible handoffs | Shows deployment-native work without clutter |
| v4-f | Paper System Sketch | body metaphor / framework | Warm paper sketch, pencil arrows, minimal objects | Feels human and lighter than glass workbench |

## Style Cohesion Decision

Choose one:

| Cohesion model | Decision | Notes |
|---|---|---|
| Unified | Pending | One style family carries the whole post. Best if we want a consistent magazine essay look. |
| Controlled Mix | Recommended | Enterprise Editorial Workbench for cover/thumbnail, Human Paper Metaphor for the quiet body image, Clean Operator Graphics for ACTOR and comparison. |
| Experimental Mix | Pending | Generate style probes across 3-4 visibly different directions before choosing finals. |

## Recommendation

Use `Controlled Mix`.

This article has different jobs: the cover must create tension, the middle needs breathing room, and ACTOR must be clean enough to remember. One single style will probably make the set feel polished but monotonous. A controlled mix lets the style change by function without making the article feel random.

## Aaron's Decision

Run an A/B style probe for both:

- `Controlled Mix`: Enterprise Editorial Workbench for cover, Human Paper Metaphor for the quiet body image, and Clean Operator Graphics for ACTOR.
- `Unified`: one Enterprise Editorial Workbench / editorial artifact world carries cover, body, and ACTOR.

This is not the final style decision yet. Generate probe images with `v3` filenames and compare them before replacing any final article image.

## Prompt Implications

- If `Unified`: generate all v3 images in one coherent style family, likely Enterprise Editorial Workbench or Magazine Photo Collage.
- If `Controlled Mix`: generate v3 as role-based styles: workbench cover, paper metaphor body, operator graphics for diagrams.
- If `Experimental Mix`: generate a small style-probe batch first, likely 2 covers + 2 ACTOR/framework variants, before regenerating the full set.
