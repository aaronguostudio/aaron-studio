# Claim Ledger

Verified on: 2026-07-10

## Claims

| ID | Claim | Type | Source | Source date | Confidence | Article use | Freshness / caveat |
|---|---|---|---|---|---|---|---|
| C1 | OpenAI launched ChatGPT Work on July 9, powered by Codex and GPT-5.6, for long-running work across apps and files. | fact | [OpenAI launch](https://openai.com/index/chatgpt-for-your-most-ambitious-work/) | 2026-07-09 | high | Why now / product definition | Vendor capability statement, not outcome proof. |
| C2 | Work is cloud-based on web/mobile; desktop can use local files/apps; at launch cloud Work conversations do not appear in desktop Work. | fact | [OpenAI Help](https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex) | updated 2026-07-10 | high | Surface and maturity comparison | Likely to change quickly. |
| C3 | ChatGPT Work uses plugins, has a built-in browser, scheduled/event tasks, and can create Sites plus documents, spreadsheets, and presentations. | fact | [OpenAI launch](https://openai.com/index/chatgpt-for-your-most-ambitious-work/) | 2026-07-09 | high | Feature matrix | Availability varies by surface/plan. |
| C4 | OpenAI presents finance close and forecast work as a Work use case, including sourcing data, moving it into Excel/Sheets, reconciling, creating slides, and verifying. | fact about vendor claim | [OpenAI launch](https://openai.com/index/chatgpt-for-your-most-ambitious-work/) | 2026-07-09 | high | Finance section | Do not rewrite as audited time savings. |
| C5 | ChatGPT for Excel/Sheets reached general availability by May 5, 2026 and targets modeling, scenario analysis, data extraction, and research. | fact | [OpenAI finance announcement](https://openai.com/index/chatgpt-for-excel/) | 2026-02, updated 2026-05-05 | high | Finance ecosystem context | Distinct product surface from Work; avoid conflation. |
| C6 | Anthropic launched Cowork in January 2026 and expanded it to cloud web/mobile beta on July 7. | fact | [Cowork plugins](https://claude.com/blog/cowork-plugins), [web/mobile](https://claude.com/blog/cowork-web-mobile/) | 2026-01-30 / 2026-07-07 | high | Timeline | Rollout starts with Max and expands later. |
| C7 | Anthropic says more than 90% of Cowork use is non-software work and business operations plus content creation are roughly half of usage. | fact about vendor analysis | [Cowork web/mobile](https://claude.com/blog/cowork-web-mobile/) | 2026-07-07 | medium-high | Adoption context | Proprietary 1.2M-session analysis; no public raw data. |
| C8 | Claude's finance stack includes cross-Excel/PowerPoint workflows, five finance plugins, and institutional data connectors. | fact | [Cowork finance](https://claude.com/blog/cowork-plugins-finance) | 2026-02-24 | high | Finance comparison | Data access may require separate entitlements. |
| C9 | Cowork computer use prioritizes connectors, then browser, then screen interaction; it requires per-app permission and screenshots can expose visible sensitive data. | fact | [Claude Help](https://support.claude.com/en/articles/14128542-let-claude-use-your-computer-in-cowork) | 2026-04-24 | high | Control plane | Research-preview safeguards are imperfect by Anthropic's own warning. |
| C10 | A launch-day ChatGPT Work walkthrough visibly generated a sourced 10-slide `.pptx` in about 15 minutes. | observed demo | [Skill Leap AI](https://www.youtube.com/watch?v=TUu5SuFcf44) at 04:08 | 2026-07-10 | medium | Opening / artifact evidence | Single creator demo; not a controlled benchmark. |
| C11 | A Cowork walkthrough processed more than 100 receipt images into an `.xlsx` with 84 line items, two sheets, formulas, and verification flags. | observed demo | [Jeff Su](https://www.youtube.com/watch?v=z9rdrNrkvDY) at 04:22-04:58 | 2026-04-12 | medium-high | Opening / finance artifact | Creator-provided test data; visible output but not independently reproduced here. |
| C12 | The same Cowork walkthrough rebuilt image-based slides as an editable PowerPoint with real text boxes. | observed demo | [Jeff Su](https://www.youtube.com/watch?v=z9rdrNrkvDY) at 05:55-06:10 | 2026-04-12 | medium-high | Artifact-plane section | Demonstration, not quality benchmark. |
| C13 | A r/ClaudeCowork user reported losing work/history after an update; top advice was to keep memory/context in files or git/cloud. | community anecdote | [Reddit](https://www.reddit.com/r/ClaudeCowork/comments/1us1c97/claude_cowork_update_just_stole_all_my_data_and/) | 2026-07-09 | medium | Recovery / maturity cost | One report; other commenters said their history remained. |
| C14 | Cowork users complain that temporary higher five-hour limits do not solve weekly limits. | community pattern | [Reddit](https://www.reddit.com/r/ClaudeAI/comments/1txyx3j/your_claude_cowork_usage_limits_just_doubled_for/) | 2026-06-05 | medium | Cost and capacity caveat | Plan rules may change. |
| C15 | ChatGPT Work currently has broader integrated surface area; Cowork has more public evidence of sustained file and Office workflows. | inference | C1-C14 | 2026-07-10 | medium-high | Core comparison | Observation-window asymmetry must be explicit. |
| C16 | The durable competition is over the context, execution, artifact, and control planes of knowledge work, not model quality alone. | judgment | Synthesis of sources and Aaron's prior work | 2026-07-10 | medium-high | Main thesis / framework | Aaron's operator interpretation. |
| C17 | Finance teams should select by evidence lineage, editable artifact fidelity, permissions, review, recovery, and ownership rather than a launch-day feature count. | judgment | Aaron's finance experience + C4-C14 | 2026-07-10 | high | Decision rule | Recommendation, not empirical universal. |

## Unsupported Or Excluded Claims

- Excluded: "Cowork is categorically better than ChatGPT Work." Observation periods are not comparable.
- Excluded: a Reddit claim that Cowork produced a 12-slide deck in 38 seconds while ChatGPT returned only an outline. The methodology and task setup were not independently verifiable.
- Excluded: OpenAI's "days to hours" finance wording as a measured customer outcome. It remains a vendor use-case claim.
- Excluded: any claim that the reported Cowork history incident proves systemic data loss.
- Excluded: direct model-reasoning rankings. No fair same-task benchmark was performed.
- Excluded: X sentiment because the research environment had no X authorization.

## Inference Boundaries

- "Broader surface" refers to documented product integration, not higher reliability.
- "More scar tissue" refers to a longer public use period and visible complaints, not objectively lower quality.
- The four-plane model is Aaron's synthesis, not vendor terminology.
- A hybrid stack may be practical, but the article treats institutional boundary ownership as a necessary design decision.

## Verification Summary

- Primary-source claims checked against the linked page: yes
- Numbers and dates checked: yes
- Promotional sources labeled and balanced: yes
- Article distinguishes fact, inference, and judgment: yes

Decision: PASS
