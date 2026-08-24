# Context packs

## Purpose

A context pack supplies the minimum project facts needed to make a guarded decision. It does not contain credentials or replace tool-specific authentication.

Suggested project-local layout:

```text
.agent-context/
  aaron-personal-os/
    context.yaml
    policies.yaml
```

Keep reusable semantics in the Personal OS source; keep project facts in the project. Store secret references only by opaque name or secure-provider reference, never by value.

## Context shape

```yaml
schema_version: 1
project: example-project
contexts:
  azure:
    environment: non-production
    tenant_alias: client-a
    subscription_alias: sandbox
    verification:
      command: az account show
      required_fields: [tenantId, id]
policies:
  - azure-multi-tenant-guard
```

Aliases make intent visible without making a repository the source of credentials. Resolve exact tenant or subscription values only through an approved local configuration or secret provider at execution time.

## Apply

When applying a context pack:

1. Read the project-local context and the referenced approved policies.
2. State the relevant target, risk, and preflight evidence required.
3. If the context is absent, stale, or inconsistent with the runtime, stop and ask for the missing decision; do not select a tenant, account, region, or production target by guesswork.
4. Hand control to the domain skill or command workflow. Personal OS provides the guard, not the privileged action.

## Cross-runtime output

Emit an adapter-neutral instruction envelope:

```yaml
context: azure
policy: azure-multi-tenant-guard
intent: write-operation
must_verify: [active-tenant, active-subscription]
on_mismatch: block
on_missing_context: ask
```

Adapters can compile the envelope into platform-native skill/context surfaces. Verify equivalent `allow`, `block`, and `ask` behavior rather than exact wording.
