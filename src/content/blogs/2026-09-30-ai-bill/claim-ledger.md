# Claim Ledger

Verified on: 2026-09-30

## Claims

| ID | Claim | Type | Source | Source date | Confidence | Article use | Freshness / caveat |
|---|---|---|---|---|---|---|---|
| C1 | Pro 200 Work+Codex usage 20x→10x Plus and GPT-6 Pro 200→100 msgs/week from 2026-10-30; price unchanged; limits kept through 10-29 | fact | OpenAI email; TNW | 2026-09-29 | high | Opening | — |
| C2 | Existing subscribers get 62,500 credits (= $2,500) expiring 2026-12-31 | fact | OpenAI email | 2026-09-29 | high | Decision section | Active-plan requirement unknown |
| C3 | No return of the 5-hour limit | fact | email; Tibo | 2026-09-28/29 | high | Opening | — |
| C4 | New Pro 200 "will net out at half the dollar in API spend" vs old | fact (quote) | Tibo X post | 2026-09-28 | high | Opening, thesis | Text via search rendering |
| C5 | Pro 500: $500, 25x Plus, only tier with Ultrafast (≤300 tok/s in Codex) | fact | TNW | 2026-09-29 | medium | Discount section | Secondary report |
| C6 | All tiers now price usage at $20 per 1x; old Pro 200 was the only bulk discount | inference | C1, C5, Plus/Pro 100 multipliers | 2026-09-30 | high | Discount section | Arithmetic |
| C7 | API prices per 1M (Astra $10/$1/$50; 6.1 Sol $2/$0.10/$10; Opus 5.5 $4/$0.20/$20; Fable 5.1 $10/$0.25/$50; Opus 5 $5/$0.50/$25) | fact | OpenAI + Anthropic pricing pages | retrieved 2026-09-30 | high | Bill, cache sections | Live pages; 5.6 Sol promo |
| C8 | Aaron's 30-day Claude Code usage ≈ $9.4k and Codex ≈ $3.9k at list prices | personal observation | local logs (`evidence/ai-bill-output-2026-09-30.txt`) | 2026-08-31..09-29 | medium | Bill section | One Mac; Codex lower bound; not what he paid |
| C9 | Cache reads are 58-78% of cost for each main model | personal observation | local logs | same | high | Cache section | Workload-specific (agentic coding) |
| C10 | Same Astra tokens at 6.1 Sol ≈ 12% of cost ($3,105 → $383) | personal observation + price math | logs + pricing | same | high | Decision section | Price only; quality untested |
| C11 | Pro account's weekly Codex meter hit 99-100% in five September windows; credits balance went to zero | personal observation | `evidence/codex-weekly-peaks-2026-09-30.txt` | 2026-09 | high | Bill section | Reset dates shifted during month |
| C12 | Community: anger at timing and framing; switching to Claude Opus 5.5; contrarian math | inference | HN, X, Kingy | 2026-09-28..30 | medium | Community section | <48h, Reddit missing, low engagement |
| C13 | @miu21590: ~$14k→~$7k API-equivalent; Claude Max ~$8k | fact (attributed opinion) | X post | 2026-09-29 | low (their estimate) | Community section | Methodology unknown |
| C14 | Opus 5.5 cache hits 0.05x and Fable 5.1 0.025x base input; 6.1 Sol cached is 95% below input | fact | pricing pages; TechCrunch | 2026-09 | high | Forecast | — |
| C15 | Subscriptions will increasingly be shown as API-dollar budgets; competition moves to cache-read and speed pricing | judgment / forecast | Aaron inference from C4, C14, C5 | — | medium | Forecast | Labeled as forecast |

## Unsupported Or Excluded Claims

- "Claude Max is ~$8k API-equivalent" as a fact: only a community estimate; used as attributed opinion.
- Tibo replying "Agreed" to "beat Opus 5.5 on value per dollar": reported by Kingy only; excluded from article.
- "OpenAI is compute-constrained": HN speculation; mention only as how the community read it.
- Absolute Plus allowance in dollars: unpublished; not used.
- Aaron's second Codex account and client paths: excluded for privacy.

## Inference Boundaries

The linear-pricing observation, the cache-read-as-real-price argument, the forecast and the recommendations are Aaron's interpretation. The bill is one heavy user's workload priced at list; it is not what he paid and not a benchmark.

## Verification Summary

- Primary-source claims checked against the linked page: yes (email, pricing pages; Tibo via search rendering)
- Numbers and dates checked: yes (recomputed with official prices 2026-09-30)
- Promotional sources labeled and balanced: yes
- Article distinguishes fact, inference, and judgment: to verify at draft review

Decision: PASS
