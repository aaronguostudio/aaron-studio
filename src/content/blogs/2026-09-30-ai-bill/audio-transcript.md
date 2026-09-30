# Audio Transcript: OpenAI Halved My $200 Plan. So I Priced My Own AI Bill.

Provider: elevenlabs
Voice profile: aaron-pvc-identity-v1
Voice ID: R2DWp7zZuWmGxk3r8GIA
Model: eleven_multilingual_v2
Output format: mp3_44100_192
Stability: 0.5
Similarity boost: 0.75
Style: 0.5
Speaker boost: true
Speed: 1

## Hook

Five times in September, the weekly meter on my two-hundred-dollar Codex plan hit one hundred percent. Then OpenAI emailed me. Starting October thirtieth, the same two hundred dollars buys half as much. So I opened my logs and priced every token I used in the last thirty days. The expensive part wasn't what I expected.

## The Sentence That Matters

Here's what changed. Pro 200 drops from twenty times the Plus allowance to ten times, in Codex and ChatGPT Work. Same price. Existing subscribers keep the old limits until October twenty-ninth, plus a one-time grant of credits worth two thousand five hundred dollars that expires at year end.

But the line I keep coming back to came the night before, from Tibo, who leads Codex. He wrote that the new plan "will net out at half the dollar in API spend." Half the dollar in API spend. That's the unit now. Your subscription is a prepaid budget, measured in API dollars.

## Twenty Dollars Per Unit

Once you see the unit, the price list reads differently. Plus is twenty dollars for one unit. Pro 100 is five units for a hundred. The new Pro 200 is ten units for two hundred. Pro 500 is twenty-five units for five hundred. Every tier is twenty dollars per unit.

The old Pro 200 was the only exception. Twenty units for two hundred dollars. Ten dollars a unit. That was the bulk discount, and it's the thing that's going away. Pro 500 doesn't bring it back. It sells a higher ceiling, and speed. A flat rate, with a premium for performance. That's how cloud providers price.

## Five Words

A lot of the reaction was about delivery. The cut went out about ten hours before OpenAI's DevDay keynote. On Hacker News, the reply I kept seeing was: "Simply say 'we're cutting limits in half.' Five words." Several people said they'd already moved to Claude Opus 5.5.

The most-engaged post took the other side: the old plan was worth about fourteen thousand a month in API value, the new one seven, Claude Max about eight. Barely a difference. I can't verify that. But notice both sides are now arguing in API dollars.

So I stopped reading estimates and pulled my own.

## My Thirty

I pay two hundred a month for ChatGPT Pro, and two hundred for Claude Max. I use both every day, usually with several agents running. Both tools keep session logs on disk, with token counts for every turn. I took thirty days from my main machine and priced every token at API list price.

Claude Code: about nine thousand four hundred dollars. Codex, on my Pro account: about three thousand six hundred. And Codex is the one that hit the wall. Five of six weekly windows, at ninety-nine or one hundred percent.

Two caveats. This is what the work would have cost on the API, not what I paid. And it's one machine, so Codex is a floor. One heavy user's receipt, not a benchmark. Still, both plans are heavily subsidized. The question is which meter runs out first. For me it was Codex, and that's the one getting cut in half.

## The Re

Now the part that surprised me. I split the bill by line item. I expected output tokens to be the big cost. On Astra, output is fifty dollars per million. It was a small slice.

The big number was cache reads. Seventy-eight percent of my Astra cost. Seventy-six percent of Opus 5. Fifty-eight percent of Opus 5.5.

Here's why. An agent doesn't answer once. It runs a loop. Load the repo context, call a tool, read the result, think, go again. And every turn, it re-reads the conversation so far. Caching makes each re-read cheaper than fresh input. But the volume is enormous. In thirty days, my Claude Code sessions read about seventeen billion tokens from cache.

Three weeks ago I praised Astra for carrying a whole deployment without handing it back. Carrying the whole job means re-reading it, hundreds of times. The capability I praised is exactly what the bill is made of.

## The Price That Matters

So for agent work, the price that matters isn't the big input and output numbers on the pricing page. It's the cache-read price.

GPT-6 Astra: one dollar per million. Claude Opus 5: fifty cents. Fable 5.1: twenty-five cents. Opus 5.5: twenty cents. GPT-6.1 Sol: ten cents.

This is where September's price cuts actually landed. On the line item agents burn. On a workload that's three-quarters re-reading, Astra costs five times what Opus 5.5 costs.

## Model Beats Vendor

So which plan is the better deal? For my September workload, Claude Max, and by more than I expected. Same two hundred dollars. About nine thousand four hundred of work on one side. About three thousand six hundred on the other, before the meter capped out.

But here's the bigger lever in my logs. It wasn't the vendor. It was the model. Take the exact tokens I ran on Astra and price them at GPT-6.1 Sol. About twenty-nine hundred dollars becomes about three hundred fifty. Twelve percent. Inside Claude, my Opus 5 tokens, repriced at Opus 5.5, drop by about half.

That's OpenAI's bet with this plan. Move the work to the cheaper model, and the halved allowance covers the same work. Can Sol do the work I've been giving Astra? I don't know yet. I haven't tested it.

## Before October Twenty

So here's what I'm actually doing.

One. Claude Max stays my main tool.

Two. I keep Pro 200 through December thirty-first, to use those credits before they expire. I'm not buying Pro 500. Same unit price, three hundred more a month, mostly for speed.

Three. In October, I run Codex on GPT-6.1 Sol for a week and watch the meter. If Sol carries most of the work, ten times might be enough.

## What Comes Next

Now, my guesses. These are my inferences, not anything either company has said.

First, the "twenty x" language fades and the dollar budget becomes visible. OpenAI has already done the conversion.

Second, the price war moves to what agents consume. Cheaper cache reads. A premium for speed.

Third, heavy-user subsidies keep shrinking. A company that publishes the exchange rate has built the dial it'll turn next time capacity gets tight. Plan as if your subscription is a prepaid API budget, not an unlimited pass.

## Price Your Own Bill

If you want to do this yourself, it's four steps.

Find the logs. Codex keeps session files under a sessions folder in its home directory. Claude Code keeps them under projects in its home directory. Both record tokens per turn.

Pull four numbers per model. Fresh input, cache writes, cache reads, and output.

Multiply each by that model's list price.

Then find your biggest line. For me, it was the re-read.

Then three habits. Route by task, not loyalty. Treat context as a cost, because long sessions dragging stale files through hundreds of turns are the bill. And stay portable. My workflows run in both tools, so switching is a pricing decision, not a migration.

## A Bill I Can Finally Read

That meter hit one hundred percent five times last month, and I never asked what one hundred percent was worth. Now I know the unit, and I've read the bill.

I'm not angry about the change. The timing was clumsy, and "we're changing how we calculate usage" was a worse sentence than "we're cutting it in half." But a subscription with a published exchange rate is more honest than a magic multiple.

Engineers learned to read cloud bills because the bill decided what they could build. AI coding bills are becoming that same kind of document.

Reading yours is now part of the job.
