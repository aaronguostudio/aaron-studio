---
title: "OpenAI Halved My $200 Plan, So I Priced My Own AI Bill"
date: 2026-09-30
slug: ai-subscription-cloud-bill
category: ai-native-systems
tags: [ChatGPT-Pro, Claude-Max, AI-pricing, Codex]
description: "OpenAI cut Pro 200 from 20x to 10x and said it now nets out at half the API dollars. I priced 30 days of my own Codex and Claude Code logs at list price. The subscription is turning into a cloud bill, and the line item that matters is the re-read."
cover: imgs/web/00-cover.webp
draft: false
---

# OpenAI Halved My $200 Plan, So I Priced My Own AI Bill

On September 29, OpenAI emailed me about my $200 Pro plan. Starting October 30, the usage it includes in Codex and ChatGPT Work drops from 20 times the Plus allowance to 10 times. GPT-6 Pro messages in chat go from 200 a week to 100. The price stays the same. Existing subscribers keep the old limits through October 29 and get a one-time grant of 62,500 usage credits, worth $2,500, that expire at the end of the year. The same email announced Pro 500: $500 a month, 25 times Plus, and the only tier with Ultrafast.

The cut isn't the part I keep thinking about. The unit is. The night before, Tibo, who leads Codex, [wrote](https://x.com/thsottiaux/status/2104823812042940713) that the new plan "will net out at half the dollar in API spend compared to the old Pro $200 plan." That sentence tells you what a subscription is now: a prepaid budget measured in API dollars. Once it's that, you read it the way engineers learned to read cloud bills. Price your own workload at list. Find the line item that dominates. Route work to whatever does it for less.

So I did that with my own logs, and the answer surprised me in two places: which plan gives me more, and where the money actually goes.

## The bulk discount is gone

"20x" was always an odd unit, a multiple of a Plus allowance nobody can see. Line the tiers up and the change becomes easy to read:

| Plan | Price | Usage (× Plus) | Price per 1× |
|---|---|---|---|
| Plus | $20 | 1× | $20 |
| Pro 100 | $100 | 5× | $20 |
| Pro 200, until Oct 29 | $200 | 20× | **$10** |
| Pro 200, from Oct 30 | $200 | 10× | $20 |
| Pro 500 | $500 | 25× | $20 |

The old Pro 200 was the only tier where buying more made each unit cheaper. After October 30, every tier costs $20 per 1×. Pro 500 isn't a better deal per unit. It sells a higher ceiling and speed. You'd recognize that shape from any cloud provider: a flat rate, plus a premium for performance.

OpenAI's case is that the dollars now buy more. Tibo said the company doesn't want to inflate API list prices to make subscriptions look generous, and would rather cut the price of the models. It has: GPT-6 Sol and Luna dropped 50%, and GPT-6.1 Sol, launched at DevDay, lists at $2 input and $10 output per million tokens, a fifth of GPT-6 Astra. The allowance is halved in dollars, but some of those dollars stretch further.

## What the community heard

Most people heard a price increase with extra steps, and the delivery didn't help. The cut went out about ten hours before the DevDay keynote. [Gabriel Horwitz](https://x.com/gabriel_horwitz/status/2105017036803854485) put it first on his list of avoidable mistakes: "Don't cut your users plan the night before your big day." The reply I kept seeing on [Hacker News](https://news.ycombinator.com/item?id=49889306) was about wording, not math: "Simply say 'we're cutting limits in half.' Five words." Several commenters said they had already moved their coding to Claude Opus 5.5. Others read the whole thing as an upsell: shrink Pro 200 until it isn't enough, then sell Pro 500.

The most-engaged post I found went the other way. [@miu21590](https://x.com/miu21590/status/2104936394577637476) estimated the old Pro at about $14,000 a month in API-equivalent usage, the new one at about $7,000, and Claude Max at around $8,000: "barely a meaningful difference for the same $200." I can't verify that estimate, and my own logs don't come close to it, though they can't see everything the meter counts. But notice what the argument is made of. Both sides are now comparing subscriptions in API dollars. That's the shift.

## My bill at list price

I pay $200 a month for ChatGPT Pro and $200 for Claude Max 20x. I use Codex and Claude Code every day, often with several agents running at once. Both tools keep session logs on disk with token counts for every turn, and the Codex logs also record the weekly usage meter. I took the last 30 days (August 31 to September 29) from my main machine and priced every token at each vendor's current API list price.

- **Claude Code: about $9,400** of list-price usage over 26 active days. Most of it was Opus 5 and Opus 5.5, plus some Fable 5.1 and Sonnet 5.
- **Codex, on my Pro account: about $3,600.** GPT-6 Astra was $2,900 of that.
- **The Codex meter was my constraint.** In five separate weekly windows in September, it read 99% or 100%, and my small balance of Codex credits ran out.

![Bar chart of peak weekly Codex usage on the author's Pro account in September: 99%, 59%, 99%, 99%, 100%, 100%](imgs/web/02-codex-meter.webp)

Two caveats matter. These numbers are what the work would have cost on the API, not what I paid. And they come from one machine: Codex cloud tasks and ChatGPT Work don't show up in these logs, so the Codex figure is a floor. This is one heavy user's receipt, not a benchmark.

Still, the first conclusion is plain. For someone who works the way I do, both subscriptions are heavily subsidized. Complaining that $200 of Pro only buys a few thousand dollars of API usage would be a strange complaint. The useful questions are how long each subsidy lasts and which meter runs out first. In September, mine was Codex. On October 30, its budget halves.

## The real price is the re-read

When I split the bill by line item, the one I expected to matter didn't. Output tokens, the $50-per-million line on Astra, were a small slice. The big number was cache reads: 78% of my Astra cost, 76% of Opus 5, 58% of Opus 5.5.

![Stacked bars of 30 days of usage priced at API list, split into cache reads and everything else: Claude Code about $9,400, Codex Pro account about $3,600](imgs/web/03-bill-by-model.webp)

That's how agentic coding works. An agent doesn't answer once. It runs a loop: load the repo context, call a tool, read the result, think, go again. Every turn re-reads the conversation so far. Prompt caching makes each re-read cheaper than fresh input, but the volume is huge. In 30 days, my Claude Code sessions read about 17 billion tokens from cache.

Three weeks ago I wrote about [putting Astra to work](/blogs/gpt-6-astra-real-work) on a deployment across Azure, Linux and Windows. What impressed me was that it could carry the whole job without handing it back. Carrying a whole job means re-reading its context hundreds of times. The capability I praised is the same thing the bill is made of.

So for agent work, the price that matters isn't the headline input and output. It's the cache-read price:

| Model | Input | Cache read | Output |
|---|---|---|---|
| GPT-6 Astra | $10 | $1.00 | $50 |
| Claude Opus 5 | $5 | $0.50 | $25 |
| Claude Fable 5.1 | $10 | $0.25 | $50 |
| Claude Opus 5.5 | $4 | $0.20 | $20 |
| GPT-6 Sol | $2 | $0.20 | $10 |
| GPT-6.1 Sol | $2 | $0.10 | $10 |

*Per million tokens, official [OpenAI](https://developers.openai.com/api/docs/pricing) and [Anthropic](https://platform.claude.com/docs/en/about-claude/pricing) list prices on September 30, 2026.*

![Cache-read price per million tokens: GPT-6 Astra $1.00, Claude Opus 5 $0.50, Fable 5.1 $0.25, Opus 5.5 $0.20, GPT-6 Sol $0.20, GPT-6.1 Sol $0.10](imgs/web/04-cache-read-price.webp)

Look at the middle column. Anthropic now charges 5% of the input price for Opus 5.5 cache hits and 2.5% for Fable 5.1. OpenAI's GPT-6.1 Sol cached input is 95% below its input price. Astra is still at $1. On a workload that's three-quarters re-reading, Astra's cache price is five times Opus 5.5's.

## So which plan is the better deal?

For my September workload, Claude Max, and by more than I expected. The same $200 carried about $9,400 of list-price work in Claude Code. Codex carried about $3,600 before its meter capped out, and that meter halves in a month.

But the biggest lever in my logs wasn't the vendor. It was the model. If I price the exact tokens I ran on Astra at GPT-6.1 Sol's rates, about $2,900 becomes about $350, roughly 12%. The same thing happens inside Claude: my Opus 5 tokens repriced at Opus 5.5 drop from about $6,600 to about $3,250. Picking the model moved my bill more than picking the company did. That's OpenAI's bet with the new plan: people move work to the cheaper model, and the halved allowance covers the same work. I haven't yet tested whether 6.1 Sol can do the work I've been giving Astra, so for now that's a hypothesis.

![Same tokens repriced: Astra tokens at GPT-6.1 Sol drop from $2,884 to $353; Opus 5 tokens at Opus 5.5 drop from $6,559 to $3,250](imgs/web/05-model-vs-vendor.webp)

Here's what I'm doing before October 29:

- **Keep Claude Max as my main tool.** Nothing changes there.
- **Keep Pro 200 through December 31.** The $2,500 in credits covers much of the gap between 10× and what I use, and it expires at year end. I'm not buying Pro 500. Faster generation might be nice, but not for $300 more a month at the same unit price.
- **Run Codex on GPT-6.1 Sol for a week in October** and watch the weekly meter. If Sol handles most of my work, 10× may be enough, and Astra stays for the hard cases.

## What I expect next

This part is my inference, not anything either company has announced.

**The "20×" language fades and the dollar budget becomes visible.** OpenAI has already done the conversion in private; the obvious next step is showing the meter in dollars. Anthropic is partway there too: it limits how much of a Max plan can go to Fable, and its $20 Pro plan pays for Fable from pay-as-you-go credits at API rates. When a plan is a budget, customers will ask to see the budget.

**The price war moves to the line items agents consume.** September's cuts landed on cache reads and on cheaper near-frontier models, while the premium tiers, OpenAI's Ultrafast and Anthropic's fast mode, charge for speed. I expect the headline input and output price to matter less each quarter, and cache pricing and speed tiers to matter more.

**Heavy-user subsidies keep shrinking.** The plans are still generous today. But a vendor that publishes the exchange rate has also built the dial it will turn the next time capacity gets tight. I'd plan as if a subscription is a prepaid API budget with a convenience discount, not an unlimited pass.

## What programmers should do about it

None of this is news to people who run cloud infrastructure. What's new is that it now applies to the tools we write code with, because the subscription stopped hiding the meter.

**Know your own number.** My numbers looked nothing like the estimates people were trading online. If you use Codex or Claude Code, your token counts are already on your disk. Pricing them took me one script and an afternoon, and it changed my decision.

**Route work by task, not by loyalty.** Default to the cheaper model that clears the bar and escalate to the frontier model for the hard part. In my logs, that choice was worth up to 8× on one line item.

**Treat context as a cost center.** Every turn re-reads the context. Long sessions that drag stale files and giant tool outputs through hundreds of turns are what the bill is made of. Compacting, scoping a session to one task, and keeping repo instructions short now save money, not just tokens.

**Stay portable.** My workflows live in skills, `AGENTS.md` files and scripts that run in both Codex and Claude Code. That's why changing my main tool is a pricing decision rather than a migration project. When the exchange rate can change overnight, the ability to move is worth more than any single plan.

## A bill I can finally read

For months, my subscriptions paid the meter on my behalf, and I never asked what 100% on that Codex meter was actually worth. This week OpenAI told me the exchange rate, and that from now on it will pay half.

I'm not angry about it. The timing was clumsy, and "we're changing how we calculate usage" was a worse sentence than "we're cutting it in half." But a subscription with a published exchange rate is more honest than a magic multiple, and it pushed me to do what I should have done months ago: read my own bill. Thirty days of logs told me that my agents spend most of their money re-reading, that model choice moves the bill more than vendor choice, and that the meter on my heaviest tool was about to shrink.

Engineers learned to read cloud bills because the bill decided what they could build. AI coding bills are becoming the same kind of document. Reading yours is now part of the job.
