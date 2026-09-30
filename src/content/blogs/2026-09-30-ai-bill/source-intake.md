# Source Intake And Greenlight

## Source map

| Source | What it says | What it does not establish |
|---|---|---|
| OpenAI email to Aaron (2026-09-29, `imgs/evidence/openai-pro-email-zh.png`) | Pro 200 Work+Codex 20x→10x and GPT-6 Pro 200→100/week from 10-30; limits kept through 10-29; 62,500 credits (= $2,500) expiring 12-31; no return of 5-hour cap; Dot for all Pro; Pro 500 with Ultrafast | How "Plus allowance" is measured; whether credits need an active plan |
| Tibo (thsottiaux) X post | New calculation nets out at half the dollar in API spend vs old Pro 200; OpenAI won't inflate list prices to make plans look generous | Absolute dollar allowance |
| OpenAI API pricing page | Astra $10/$1.00 cached/$50; 6.1 Sol $2/$0.10/$10; 6 Sol $2/$0.20/$10; 5.6 Sol $4/$0.40/$20 (promo) | Subscription allowances |
| Anthropic pricing docs | Opus 5.5 $4/$20, cache hit 0.05x ($0.20); Fable 5.1 $10/$50, cache hit 0.025x ($0.25); Opus 5 $5/$25, $0.50 | Max plan token allowances (unpublished) |
| HN thread (74 pts / 90 comments), X posts, Kingy AI, TNW | Anger at timing/framing, switching to Opus 5.5, contrarian "math isn't that bad" | Representative sentiment; Reddit not collected |
| Aaron's local logs (one Mac, 2026-08-31..09-29) | Claude Code ≈ $9.4k, Codex ≈ $3.9k at list; cache reads 58-78% of cost; Codex weekly meter 99-100% in 5 windows; Astra tokens at 6.1 Sol ≈ 12% | Other machines, Codex cloud, ChatGPT Work; whether Sol is good enough for his tasks |

## Angle

**Reader promise:** after reading, you can decide what to do before 10-29 and compare AI plans in the one unit that now matters (API dollars), using your own logs.

**Aaron's judgment:** not outrage. OpenAI finally named the unit. The subscription is a prepaid API budget; treat it like a cloud bill. For his workload Claude Max gives more per dollar, but the bigger lever is model routing and context cost.

## Distinctness test

- *2026-08-21 "I Stopped Renting Intelligence"*: the metered invoice follows the price sheet; decide per work class whether to rent or move local. **This post changes:** the flat subscription is no longer a shield from the price sheet. OpenAI pegged it to API dollars. The per-work-class question now applies inside subscriptions too.
- *2026-09-06 "I put GPT-6 Astra into real work"*: Astra can carry a whole task. **This post changes:** carrying a whole task means re-reading context every turn; 77% of Astra's cost in his logs is cache reads, and that's the line item the plan change hits hardest.
- The sentence that makes it new: "The price on the pricing page is input and output. The price you actually pay for agentic coding is the re-read."

## Evidence path

Personal proof exists (priced logs). No experiment is claimed as done: the Sol switch is stated as a planned October test, not a result.

## Media proof map

1. Linear pricing table ($20 per 1x at every tier): simple chart, makes "the discount is gone" visible.
2. Weekly Codex meter at 99-100%: bar chart of weekly peaks.
3. 30-day bill split by model with cache-read share: stacked bar; shows cache reads dominate.
4. Cache-read price per 1M across models: bar chart; the real price war.
5. Astra vs same tokens at 6.1 Sol ($3,105 vs $383): before/after.

Decision: GO
