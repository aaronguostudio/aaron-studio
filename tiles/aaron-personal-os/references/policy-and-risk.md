# Policy and risk

## Policy shape

A Policy is a durable constraint. Write it in terms of observable conditions and outcomes rather than a model-specific prompt trick.

```yaml
id: policy-id
status: approved
scope: azure-cli-write-operations
risk: high
when: a command can mutate Azure resources or identity state
require:
  - load the project's declared cloud context
  - compare the active tenant and subscription to that context
block_when:
  - context is missing
  - active identity does not match the declared target
escalate_when:
  - production, permission, billing, or identity changes are requested
verify:
  - fixture name or deterministic preflight
```

The runtime adapter may express this in Codex, Claude, DeepSeek, or another platform's native format. The policy's semantics remain the source of truth; byte-identical system prompts are not the goal.

## Risk boundaries

| Risk | Default behavior |
|---|---|
| Low and reversible | Proceed when context is sufficient; record evidence when useful. |
| Medium or externally visible | Present the intended target and verification plan before mutation. |
| High, irreversible, identity-, permission-, money-, or production-affecting | Stop for explicit approval after preflight; never infer authority from a prior related task. |

Do not turn an incomplete observation into a hard block. If the correct action is uncertain, retain it as a Pattern or request the missing context.

## Review and audit

During Review or Audit, check each rule for:

1. **Scope:** Is it still attached to the right project, tool, or environment?
2. **Authority:** Does it state what the agent may do versus what requires confirmation?
3. **Evidence:** Does an incident, run, or fixture still support it?
4. **Collision:** Does it duplicate or contradict a broader policy or domain skill?
5. **Cost:** Does it add a false block, repeated question, or unnecessary context load?

Recommend one outcome: retain, narrow, promote, split, deprecate, or return to draft. Do not change an approved policy without confirmation.
