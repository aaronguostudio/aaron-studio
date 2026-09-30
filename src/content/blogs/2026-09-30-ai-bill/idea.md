# Idea

## Topic

OpenAI halved what the $200 Pro plan buys (20x → 10x Plus from 2026-10-30), launched Pro 500, and said the new plan nets out at "half the dollar in API spend." Aaron is a Pro 200 subscriber and a Claude Max subscriber. He priced 30 days of his own Codex and Claude Code logs at API list rates to answer: which plan is actually the better deal, and what does this change say about where AI pricing is going?

## Why Now

Announced 2026-09-28/29 around DevDay. Old limits end 2026-10-29, so the decision window is one month. Reaction is still forming (<48h).

## Target Reader

Developers and technical operators paying $100-$500/month for AI coding plans (Codex, Claude Code), plus engineering leads who will soon budget these tools like cloud spend.

## Reader Pain / Curiosity

"My plan just got halved. Is it still worth it? Should I switch? How do I even compare plans that are described as 5x, 10x, 20x of something nobody can see?"

## Initial Thesis

The flat AI subscription is turning into a prepaid API budget. Once it's denominated in API dollars, choose like a cloud engineer: price your own workload at list, find the dominant line item (for agentic coding it's cache reads), and route work to the model that does it for the least. Vendor loyalty matters less than model choice.

## Why This Should Exist

Dozens of recaps already exist. None use a real 30-day bill. Aaron's data (Codex meter maxed five times; $9.4k vs $3.9k API-equivalent; cache reads 58-78% of cost; Astra→6.1 Sol = 12% of cost) is the missing receipt.

## Kill Criteria

- If the personal numbers can't be published without exposing client work or account details, cut to a sourced explainer and hold the video.
- If Aaron won't state which Claude Max tier he pays for, the "which is cheaper" comparison must be framed per $ of plan with a stated assumption.
