# Experience lifecycle

## Capture

Use Capture after a real mistake, a costly near-miss, a repeated workaround, or a decision that materially improved reliability. It is not a place for vague preferences or speculative advice.

Draft a Pattern with this minimum record:

```yaml
id: lowercase-kebab-case
status: draft
scope: project, tool, or operation family
risk: low | medium | high
owner: aaron
evidence:
  - observed incident, run, or decision
```

Then record:

1. The triggering situation and what actually happened.
2. The failure mode or decision risk, not merely the preferred outcome.
3. The narrowest candidate safeguard.
4. What would show the safeguard is correct or over-broad.
5. Whether the lesson belongs in Pattern, Policy, Context, or a domain Skill.

Do not persist the draft until Aaron confirms its target path and scope. Never include secrets, raw tokens, customer data, or copied credentials in the record.

## Promote or revise

Promote a Pattern only when it has all of the following:

- a concrete scope and owner;
- a stated risk and escalation boundary;
- evidence from a real incident, run, or repeated use;
- a fixture or deterministic check that represents the important failure mode;
- no conflict with a higher-level policy.

Choose the destination by behavior:

| Need | Destination |
|---|---|
| Explain an observed lesson awaiting proof | Pattern |
| Always stop, verify, or escalate under stated conditions | Policy |
| Name project or environment facts needed at runtime | Context |
| Perform a repeatable sequence with inputs, outputs, and validation | Skill |

Use `approved` only after review; use `deprecated` rather than deleting a rule when historical reasoning matters. Link a successor when one exists.

## Change card

Every approved change should be explainable as:

```text
Change: what rule or context changed
Reason: observed failure or opportunity
Scope: where it applies and does not apply
Expected behavior: allow, block, ask, or route
Evidence: fixtures and observed runs
Risk: false block or remaining failure mode
Decision: draft, approved, revised, or deprecated
```
