# Distribution Plan

## Reader & Job
- Reader: operators/builders who use Claude Code / Codex / ChatGPT daily.
- Reader job: decide whether working inside a harness is a real workflow change worth rebuilding around.

## Core Tension (shared, adapted per platform)
"The model didn't get smarter — it got a body." Promising agents vs. chat wrappers; the real shift is the unit of work, not the IQ.

## Launch Hypothesis
A concrete, disagreeable frame ("watch the state, not the prose") plus the self-referential receipt earns more qualified operator replies than a generic "harness review" launch. Link placement is a live experiment, not a fixed rule.

## Platforms

### X — Discovery & conversation
- Job: reach practitioners who have operational experience with agents; start a real argument.
- Asset: one strong visual — a screenshot of the run_code-only surface, or a quote card of "watch the state, not the prose".
- CTA: reply with what you'd hand an agent first (cta_rotation: reply).
- UTM: `node scripts/blog-growth.mjs utm-url --url <blog-url> --channel x --campaign the-model-got-a-body --content launch`
- Primary metric: qualified replies + profile visits + UTM clicks.
- Follow-up atom (2-5d): the "watch the state" three-check framework as a standalone tweet.

### LinkedIn — Professional credibility
- Job: operator credibility; one useful implication for people who manage AI-native work.
- Asset: direct article link with preview (no custom image + URL combo).
- CTA: question a practitioner answers from experience ("where has a smooth demo hidden a rotting plan for you?").
- UTM: `node scripts/blog-growth.mjs utm-url --url <blog-url> --channel linkedin --campaign the-model-got-a-body --content launch-operator`
- Primary metric: comments from target role + out-of-network impressions + UTM clicks.
- Follow-up atom: the "body scales failure" point as a standalone observation.

### Facebook — Relationship-led sharing
- Job: personal, honest launch through Aaron's real network.
- Asset: direct link with preview.
- CTA: one honest question for friends who've seen this in their own work.
- UTM: `node scripts/blog-growth.mjs utm-url --url <blog-url> --channel facebook --campaign the-model-got-a-body --content launch-friends`
- Primary metric: thoughtful friend comments + shares + UTM clicks.
- Audience setting: Friends (higher-trust feedback loop for a technical topic).
- Follow-up atom: only if the launch surfaces a genuine angle worth continuing.

### Newsletter — Owned-reader follow-up
- Job: warmer, complete teaser to the owned list.
- UTM: `node scripts/blog-growth.mjs utm-url --url <blog-url> --channel newsletter --campaign the-model-got-a-body --content teaser`

## Compare after 24h / 7d (not assume)
- Direct-link vs self-reply-link click quality (X).
- Which platform sends readers who actually finish (engaged read time) vs bounce.
- Whether "watch the state" or "the model got a body" is the sharper pull line.
- Record real post IDs in distribution.json only after they exist.
