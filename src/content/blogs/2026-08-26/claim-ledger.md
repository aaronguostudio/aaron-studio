# Claim Ledger — Process Economics

| ID | Claim | Type | Source / date | Confidence | Planned use | Freshness / inference caveat |
|---|---|---|---|---|---|---|
| C1 | OpenAI reports an initially three-engineer team produced an internal product with roughly one million lines of code and 1,500 PRs in five months, with no manually written code. | fact, self-reported | OpenAI Harness Engineering, 2026-02-11 | High that OpenAI made the claim | Opening contradiction | Use “reports”; the 1/10 time figure is their estimate, not an independent measurement. |
| C2 | That team treated architecture constraints normally postponed until hundreds of engineers as an early prerequisite. | fact / stated judgment | OpenAI Harness Engineering, 2026-02-11 | High | Shows process moving earlier | This is one unusually agent-native product, not a universal prescription. |
| C3 | Human QA became a bottleneck; the team initially spent every Friday (20% of the week) cleaning AI slop before automating recurring cleanup. | fact, self-reported | OpenAI Harness Engineering, 2026-02-11 | High that OpenAI made the claim | Shows throughput and maintenance tax | Do not generalize the 20% figure beyond this team. |
| C4 | The pinned DeepSeek Harness snapshot contains 12,293 commits over 64 days and 683 Agent Notes. | primary local measurement | Local clone at `47f943859b`, measured 2026-08-15 | High | Independent convergence case | Repo changes rapidly; reverify immediately before publication. |
| C5 | DeepSeek’s process turns rejected decisions and postmortems into machine-visible artifacts and executable checks. | primary local synthesis | DeepSeek source files + research note 09, 2026-08-15 | High | Explain process capital | Examples must link to exact source paths/lines in final draft. |
| C6 | A real DeepSeek loader failure escaped 178 green tests and 100% line coverage because the tests bypassed the real loader path. | primary local fact | DeepSeek postmortem 0001, verified 2026-08-15 | High | Counterexample to “more gates = truth” | Reverify source wording and current path before publication. |
| C7 | In Anthropic’s analysis of about 400,000 Claude Code sessions, humans made about 70% of planning decisions and 20% of execution decisions. | empirical vendor research | Anthropic, 2026-06-16 | Medium-high | Empirical support for judgment/execution split | Observational, classifier-based, vendor-owned sample; not causal or universal. |
| C8 | Higher task-domain expertise correlates with higher verified success and longer agent action chains per instruction. | empirical vendor research | Anthropic, 2026-06-16 | Medium-high | Explain why expertise is amplified | Expertise is classifier-derived and task-specific. |
| C9 | DORA characterizes AI as an amplifier of an organization’s existing strengths and weaknesses. | research conclusion | DORA 2025 report | Medium-high | Cross-organization support | Cite as DORA’s finding, not a law of nature. |
| C10 | General-purpose technologies such as AI require complementary investments in process, business models, products, and human capital. | peer-reviewed economic finding / model | Brynjolfsson, Rock & Syverson, 2021 | High | Historical-economic frame | The paper does not study DeepSeek Harness; applying it to harnesses is Aaron’s inference. |
| C11 | A harness is organizational capital in executable form. | author inference | Synthesis of C1–C10 | Medium-high | Central original contribution | Present as an interpretive frame, not an established term from the cited papers. |
| C12 | Good process captures recurring judgment, can be applied cheaply, and has revision/retirement ownership. | author judgment | Derived framework | Medium | Reader takeaway | A proposed management test; validate through argument, not false quantification. |

## Evidence decision

The evidence is sufficient to outline the article because three distinct layers converge: economic research on complementary capital, large agent-native engineering cases, and observed human-agent decision division.

The evidence does **not** support copying OpenAI or DeepSeek’s process density into an ordinary team, nor claiming that harnesses eliminate review.

**Decision: PASS** for outline and opening draft. Final publication still requires fresh DeepSeek source verification and careful vendor-language qualifiers.

