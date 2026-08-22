# Distribution Plan: DeepSeek Harness Teardown

## Article

- **Title:** What I Learned From DeepSeek's Harness / 我从 DeepSeek Harness 学到的
- **URL:** https://www.aaronguo.com/blogs/deepseek-harness-teardown
- **Core thesis:** Here is what's actually inside DeepSeek's harness — four verified designs, with their costs — and what it tells you about which layer of your own AI stack to own.
- **Target reader:** A technical operator who uses coding agents daily (Claude Code / Codex class), follows AI infra news, and is deciding where their own tooling investment should live.
- **Reader job:** Take the three same-week adoptables (pre-request assertion, cache trio, rejected/ directory), and sort their own AI assets into portable vs locked-in.

## Launch Hypothesis

Launch coverage of DSH was news-shaped; nobody in English verified what's inside. The distribution leads with the article's most reusable verified findings, not the launch story — applying the current winning pattern `deep_reader_signal` (lead with the operating judgment, expect qualified deep readers over broad engagement) and the `concrete-bottleneck-opening` lesson (every post opens on a concrete verified fact — 44/3 visibility, a broken cache prefix, 12,293 commits — before any abstraction).

This launch also runs the current growth experiment (`single-owner-shared-boundary` in a new domain): the LinkedIn post frames finding 4 as the one-person-project model at industrial scale — one owner holding context, agents executing, the team owning boundaries and evidence.

- **Pattern to reuse:** `deep_reader_signal` — optimize for practitioners who read deep and reply with their own systems.
- **Pattern to avoid:** ranking channels while LinkedIn native metrics are missing (`linkedin_manual_import_missing`).
- **Measurement caveat:** see Measurement Caveat below.
- **Current next experiment:** single-owner/shared-boundary frame in the agent-fleet domain (LinkedIn angle).

## Shared Tension

Same model, 46.7% → 66.7% task success depending on the harness — and the layer that decides it just went open source with its complete rulebook. Almost everyone read the launch as news; the tension every post earns attention with is a verified inside fact the reader can act on.

## CTA Rotation

This launch's CTA is **follow** (rotation: follow → newsletter → reply). The follow ask rides in the X self-reply ("series continues from this repo"); the newsletter teaser keeps its inherent read-through CTA without a subscribe push.

## Selected Visual

- **Status: none exist yet.** blog-illustrate has not run; plan.md's v4-era visual ideas are stale and will be re-decided against v13 (handoff candidates: 44/3 event-visibility diagram, one-line-config before/after, the lawyer/contract cache metaphor).
- **Consequence for launch formats:** X launches text-only (the 44/3 numbers are the visual); LinkedIn launches as a **direct article link with preview** instead of 08-02's native-image format. If blog-illustrate produces a strong social crop before launch day, revisit the LinkedIn format choice and note the change here.

## Platform Jobs

| Platform | Job | Launch asset | CTA | Tracked link | Primary success metric | Follow-up atom |
|---|---|---|---|---|---|---|
| X | Discovery and practitioner conversation | Self-contained post under 280 characters, text-only | Follow (in the link reply); practitioner question: "When your agent misbehaves, can you replay what it saw?" | Link in immediate self-reply: https://www.aaronguo.com/blogs/deepseek-harness-teardown?utm_source=x&utm_medium=social&utm_campaign=deepseek-harness-teardown&utm_content=launch-reply | Qualified replies from agent builders, profile follows, UTM clicks | `x-standalone-tweet.md` 2–5 days later: provider stores the cache, harness decides the hit. |
| LinkedIn | Professional credibility with engineering and product leaders | Direct article link with preview (no native visual exists yet) | Ask which written conventions would survive becoming enforced checks | https://www.aaronguo.com/blogs/deepseek-harness-teardown?utm_source=linkedin&utm_medium=social&utm_campaign=deepseek-harness-teardown&utm_content=launch-preview | Comments from eng/product leaders, out-of-network impressions, UTM clicks | Native follow-up on the pre-request assertion (five lines that make agent behavior explainable), useful without the article link. |
| Facebook | Relationship-led sharing through Aaron's real network | Personal first-person context plus link preview; **Public** recommended | Ask what rule friends have had to write down for their AI | https://www.aaronguo.com/blogs/deepseek-harness-teardown?utm_source=facebook&utm_medium=social&utm_campaign=deepseek-harness-teardown&utm_content=launch-friends | Thoughtful comments from people using AI for real work, shares, UTM clicks | A short personal follow-up on the rejected/ directory in Aaron's own repos, only if launch comments surface a genuine angle. |
| Newsletter | Owned-reader deep read and series continuity | Plain-text teaser, 80–140 words | Read the full teardown; series continuation named (entry-fee measurement next) | https://www.aaronguo.com/blogs/deepseek-harness-teardown?utm_source=newsletter&utm_medium=email&utm_campaign=deepseek-harness-teardown&utm_content=launch-teaser | Unique UTM clicks, deep-reading sessions, replies naming readers' own asset splits | The 2026-09-02 cost-anatomy teaser (first-request entry fee measured on Aaron's own stack). |

## Link-Placement Experiment

X repeats the clean-main-post + immediate self-reply variant, keeping the series of comparable launches consistent (an experiment, not an algorithm claim). LinkedIn switches from 08-02's native-image format to a direct link preview because no visual exists yet — when comparing the two launches later, attribute differences to format before drawing channel conclusions. Facebook and Newsletter use direct tracked links; the article click is their job.

## Measurement Plan

### After 24 Hours

- Record real post URLs/IDs before registering anything as published; nothing enters `distribution.json` without one.
- Capture platform, copy version, media (none at launch unless the visual decision changes), link placement, publish time, impressions, qualified replies, profile follows/visits, UTM clicks.
- Reply quality check: are practitioners talking about replayability, cache discipline, or their own process rules — or only about DeepSeek-vs-Anthropic?
- Check article traffic for `deep_reader_signal` (engaged reading over shallow visits).

### After 7 Days

- Compare qualified conversation, UTM clicks, deep reading, follows gained, and any newsletter list growth.
- Identify which finding carried the discussion: log/replay (finding 1), config architecture (finding 2), cache economics (finding 3), or the process OS (finding 4) — this decides the B/C/D series emphasis.
- Decide whether the cache standalone atom deserves a visual re-run after blog-illustrate.
- Save one reusable reader objection for postmortem.md and the series dossiers.

## Measurement Caveat

`linkedin_manual_import_missing` remains active: LinkedIn comparisons are incomplete until native metrics are manually imported. Do not read missing LinkedIn data as zero performance or use it to rank channels.

## Publishing Boundary

These are local drafts only. No external publication, scheduling, or social registration is authorized in this package. Publish dates follow the blog going live on 2026-08-19; pre-publish checklist in claim-ledger.md must clear first.
