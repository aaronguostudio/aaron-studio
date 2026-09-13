# Claim ledger

Cutoff and verification: 2026-09-06. Original web pages and private PRs inspected; no fresh runtime experiment.

- **name** | source_fact | verified/high | sources: launch, safety
  Official name is GPT-6 Astra; launch announcement is September 3, 2026.
  Boundary: Do not confuse with Google Project Astra or use Astro.
- **workflow** | source_fact | verified/high | sources: launch
  OpenAI presents Astra as capable of multistep computer and professional work.
  Boundary: Supports product positioning, not an all-tasks guarantee.
- **context** | source_fact | verified/high | sources: context
  Codex documents experimental context management using notes and searchable history, off by default.
  Boundary: Do not attribute personal improvements to an unverified enabled feature.
- **guidance** | source_fact | verified/high | sources: guidance
  Official guidance warns unclear or conflicting skill instructions can cause premature pauses.
  Boundary: Useful operational caveat; not a universal explanation for complaints.
- **price** | source_fact | verified/high | sources: model
  The model page lists standard API input/output rates of $10/$50 per million tokens, with separate cache and long-context terms.
  Boundary: Not subscription-message pricing; refresh before publication.
- **positive** | source_fact | verified/medium | sources: shumer
  Shumer reports stronger engineering and easier-to-read updates, while flagging speed, coordination, token demand, and visual taste limits.
  Boundary: This verifies what the author reports, not measured comparative superiority.
- **negative** | source_fact | verified/medium | sources: scope-feedback, limits-feedback, writing-feedback
  One developer reports over-scoping and unwanted implementation; other threads describe quota and creative-writing problems.
  Boundary: Purposive sample, not representative sentiment; no majority claim.
- **safety** | source_fact | verified/high | sources: safety
  OpenAI reports stronger alignment and reduced monitorability in adversarial tests, and treats cyber capability as Critical.
  Boundary: Evaluation results do not guarantee a safe individual run.
- **worker** | operator_observation | verified/high | sources: dev-worker, attachment
  Project records document Dev rendering and a later attachment/read-back/retry repair.
  Boundary: Read-only record check, not a new runtime test; exact customer data omitted.
- **smooth** | operator_observation | partial/medium | sources: dhh-package
  Aaron reports smoother project execution and fewer requested writing revisions during recent Astra use.
  Boundary: Current user statement; no baseline timings, revision count, or model-by-model causal experiment.
- **attention** | inference | partial/medium | sources: shumer, scope-feedback, dhh-package
  For Aaron, reduced correction and context-rebuilding effort may matter more than response speed.
  Boundary: Editorial thesis, not quantified productivity claim.

Decision: PASS

PASS means the bounded claims are usable, not that partial observations became independently proven facts.
