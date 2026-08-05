# Distribution Plan: What AI Code Can Change

## Article

- **Title:** Should You Read AI-Generated Code? Ask What It Is Allowed to Change
- **URL:** https://www.aaronguo.com/blogs/what-ai-code-can-change
- **Core thesis:** Review depth should follow what the code can change, not who wrote it or how many lines changed.
- **Target reader:** Experienced developers, tech leads, independent builders, and engineering or product leaders responsible for AI-generated changes in real systems.
- **Reader job:** Decide where outcome-level confidence is enough and where a human must understand the system model or critical source path.

## Launch Hypothesis

The familiar “read every line” debate will earn attention, but the authority-based decision rule will earn qualified reading. The strongest signal is not broad AI engagement; it is experienced practitioners recognizing the critical-system or system-of-record boundary and describing where their own review behavior changes.

The launch applies the current `deep_reader_signal` lesson by leading distribution with the article's most reusable operating judgment rather than a general AI-coding summary. It also tests the single-owner/shared-boundary frame in code review: private, reversible work can carry a lighter review burden than changes whose consequences cross into shared or authoritative systems.

## Shared Tension

“Should I read AI-generated code?” is too broad to guide real work. A disposable script and a system-of-record write do not deserve the same scrutiny.

## Selected Visual

- **LinkedIn launch concept:** `READ THE CODE?` — Mitchell Hashimoto and Uncle Bob framed as two respected programmers with opposing answers.
- **Asset:** `imgs/social/linkedin-read-the-code.png` (1200 × 627).
- **Asset status:** **Selected.** Reuses the approved video-thumbnail visual language and has been cropped specifically for LinkedIn.
- **Role:** Earn attention with the recognizable disagreement; the post copy then replaces the binary debate with the authority-based review rule.

## Platform Jobs

| Platform | Job | Launch asset | CTA | Tracked link | Primary success metric | Follow-up atom |
|---|---|---|---|---|---|---|
| X | Discovery and practitioner conversation | Self-contained post under 280 characters; selected ladder visual only after style approval | “Where does your review boundary change?” | Link in immediate self-reply: https://www.aaronguo.com/blogs/what-ai-code-can-change?utm_source=x&utm_medium=social&utm_campaign=what-ai-code-can-change&utm_content=launch-reply | Qualified replies from builders, profile visits, and UTM clicks | Publish `x-standalone-tweet.md` 2–5 days later: five authoritative lines can deserve more scrutiny than 1,000 disposable lines. |
| LinkedIn | Professional credibility with engineering and product leaders | Native `READ THE CODE?` image; tracked article link in the first comment | Ask which change classes force source-level review in their organization | https://www.aaronguo.com/blogs/what-ai-code-can-change?utm_source=linkedin&utm_medium=social&utm_campaign=what-ai-code-can-change&utm_content=launch-native-image | Target-role comments, out-of-network impressions, and UTM clicks | Native follow-up on the four review levels, using the ladder visual without requiring the article link. |
| Facebook | Relationship-led feedback from Aaron's real network | Personal first-person context plus direct link preview; recommend **Public** for this shareable engineering topic | Ask what kind of AI-generated change makes them slow down | https://www.aaronguo.com/blogs/what-ai-code-can-change?utm_source=facebook&utm_medium=social&utm_campaign=what-ai-code-can-change&utm_content=launch-friends | Thoughtful comments from people with relevant experience, shares, and UTM clicks | A short personal follow-up on why the boundary must exist before an incident, prompted only if launch comments reveal a genuine angle. |
| Newsletter | Owned-reader follow-up and deeper reading | Warm 80–140 word plain-text teaser | Read the essay, then reply with the boundary that changes their review behavior | https://www.aaronguo.com/blogs/what-ai-code-can-change?utm_source=newsletter&utm_medium=email&utm_campaign=what-ai-code-can-change&utm_content=launch-teaser | Unique UTM clicks, deep-reading sessions, and substantive email replies | A later field note turning the authoritative-write release rule into a compact checklist. |

## Link-Placement Experiment

The X launch uses a clean main post and an immediate self-reply containing the URL. This is an experiment, not a claim about the algorithm. Compare it with direct-link launches only after several reasonably similar posts; do not turn one result into a permanent rule.

LinkedIn tests a native image with the tracked article link in the first comment. Facebook and Newsletter use direct tracked links because the article click is part of their platform job. Treat the LinkedIn link placement as a launch experiment, not a permanent algorithm rule.

## Measurement Plan

### After 24 Hours

- Record the real post URL or post ID before registering any social post as published.
- Capture platform, copy version, media used, link placement, publish time, impressions, qualified replies or comments, profile visits where available, and UTM clicks.
- Review reply quality: did practitioners discuss critical paths, systems of record, recovery, or their own review boundary?
- Check whether article traffic produces the current winning pattern, `deep_reader_signal`, rather than only shallow visits.

### After 7 Days

- Compare qualified conversation, UTM clicks, deep-reading behavior, newsletter replies, and any subscriber conversion.
- Identify which framing carried the most useful discussion: read-versus-don't-read, system-of-record authority, rollback versus restoration, or the Review Depth Ladder.
- Decide whether the standalone X atom or ladder follow-up deserves another format.
- Save one reusable reader objection or operating example for the article postmortem.

## Measurement Caveat

`linkedin_manual_import_missing` remains active. LinkedIn performance comparisons are incomplete until native metrics are manually imported. Do not interpret missing LinkedIn data as zero performance or use it to rank channels.

## Publishing Boundary

These are local drafts only. No external publication, scheduling, or social registration is authorized in this package.
