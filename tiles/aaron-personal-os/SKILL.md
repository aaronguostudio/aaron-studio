---
name: aaron-personal-os
description: Govern Aaron's reusable agent experience across projects and model runtimes. Use when capturing a working lesson, applying a project context or guardrail, reviewing a candidate rule, or auditing personal agent policies. Do not use for ordinary project execution or generic note-taking.
---

# Aaron Personal OS

Turn lived operating experience into small, testable, cross-runtime agent guidance. This skill manages the lifecycle of a rule; it does not replace the domain skill that performs the underlying work.

## Boundaries

- Treat `tiles/` as the reusable instruction source and project-local context packs as runtime inputs. Keep credentials, tokens, and raw secret values out of both.
- Preserve the distinction between observation and rule. A new lesson starts as a `Pattern` and is not automatically a global policy.
- Do not execute cloud, identity, deployment, permission, billing, or configuration changes merely because a guardrail describes them. The relevant domain skill and explicit user authority still apply.
- Prefer a focused project context over a global instruction. Do not let this skill take over unrelated workflows such as blog production, design, research, or coding.
- Before persisting a captured experience or changing an approved policy, show the proposed target and change, then wait for Aaron's confirmation.

## Choose a mode

| User intent | Mode | Read |
|---|---|---|
| A mistake, workaround, or lesson should be retained | Capture | [experience lifecycle](references/experience-lifecycle.md) |
| A project needs the right context, guardrail, or preflight | Apply | [context packs](references/context-packs.md) |
| A candidate lesson should become, change, or retire a rule | Review | [policy and risk](references/policy-and-risk.md) |
| Existing rules may be stale, overlapping, or too broad | Audit | [policy and risk](references/policy-and-risk.md) and [context packs](references/context-packs.md) |

If the user is only asking to solve the immediate task, solve it with the appropriate domain skill. Suggest Capture only after a concrete lesson is evident.

## Operating model

```text
incident or observation
  -> Pattern (draft, scoped, evidenced)
  -> Policy / Context / Skill change (reviewed)
  -> fixture and runtime evidence
  -> approved, revised, or deprecated
```

Use the smallest object that fixes the problem:

- **Pattern** explains a failure mode, evidence, and a candidate response.
- **Policy** states a durable invariant, risk boundary, or escalation condition.
- **Context** supplies project- or environment-specific facts needed to apply a policy safely.
- **Skill** defines a repeatable procedure and routes to the tools or domain skills that carry it out.

For a new or changed rule, name the scope, risk, owner, evidence, expected behavior, and a fixture that could prove a regression. If any is unknown, keep it as a draft Pattern and state the missing evidence.

## Decision artifact contract

When a fixture or a user requests a concise decision artifact, use `## Decision`, `## Next action` (or `## Scope` for Capture), and `## Boundary`. State the outcome explicitly:

| Situation | Decision | Next action | Boundary |
|---|---|---|---|
| Capture a new lesson | `DRAFT PATTERN` | Name the narrow project/tool scope, evidence still needed, and `Confirmation: required before persistence or promotion`. | Do not persist, promote, or execute the underlying domain action. |
| Apply with matching context | `READY FOR DOMAIN PREFLIGHT` | State the declared target aliases and verified match, then hand off to the domain workflow. | Personal OS does not execute the mutation. |
| Apply with missing or mismatched context | `BLOCKED — CONTEXT REQUIRED` | Ask for the intended tenant/subscription or other declared target. | Do not guess a target, switch accounts, or execute the operation. |
| Request is outside Personal OS | `ROUTE TO <domain skill>` | Name the relevant domain skill. | Do not capture a Pattern or execute project work through Personal OS. |

These labels are behavioral contracts, not permission to skip the domain skill's own checks.

## Integration with SkillDev

When SkillDev is available, use it as the development engine, not as a required runtime dependency:

1. Inspect this bundle to verify its routes, references, and fixtures.
2. Run fixtures against a baseline and candidate version.
3. Review the generated change card: what changed, affected paths, verdicts, false blocks, and unresolved gaps.
4. Promote only after evidence is understandable to a human reviewer.

The fixtures in `fixtures/` define the initial behavior contract. They contain representative, non-secret inputs only. The YAML files are the portable source contract. Until SkillDev consumes YAML natively, `fixtures/skilldev/*.fixture.json` are executable adapter mirrors and must be updated with their paired YAML fixture.

## Behavioral fixture contract

| Fixture | Expected decision | Producer |
|---|---|---|
| `fixtures/capture-azure-incident.yaml` | Capture creates a scoped draft Pattern and requires confirmation before persistence. | aaron-personal-os |
| `fixtures/apply-azure-context.yaml` | Apply permits only a matching, verified context; it does not execute the domain operation. | aaron-personal-os |
| `fixtures/missing-context-blocks.yaml` | Missing context asks for the target and forbids guessing or account switching. | aaron-personal-os |
| `fixtures/unrelated-blog-work-routes-away.yaml` | Unrelated source-led blog work routes to `blog-production` without loading Personal OS context. | aaron-personal-os |

SkillDev adapter fixtures:

- `fixtures/skilldev/capture-azure-incident.fixture.json`
- `fixtures/skilldev/apply-azure-context.fixture.json`
- `fixtures/skilldev/missing-context-blocks.fixture.json`
- `fixtures/skilldev/unrelated-blog-work-routes-away.fixture.json`

## Handoff

Report the selected mode, object status (`draft`, `approved`, or `deprecated`), scope, evidence, and any confirmation or domain-action boundary that remains. Link the proposed or changed artifact when one exists.
