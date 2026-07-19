---
title: 'Single Source of Truth'
fullName: 'Single Source of Truth'
shortName: 'SSOT'
description: 'Give each fact one authoritative owner; treat every other copy as a traceable, rebuildable projection.'
mentalModel: 'A fact may have many copies, but only one place is authorized to answer what it is now.'
date: '2026-07-16'
updated: '2026-07-16'
domain: 'Information systems'
domainKey: 'information-systems'
tags: ['authority', 'data-lineage', 'synchronization', 'knowledge-systems']
maturity: 'growing'
published: true
featured: false
translationKey: 'single-source-of-truth'
interaction: 'single-source-of-truth'
cardImage: '/learn-img/single-source-of-truth/card-4x5.jpg'
cardImageAlt: 'One paper master record on a dark pedestal branches into a dashboard, report, and cache, showing one authority feeding many derived views.'
neighbors:
  - name: 'Canonical Source'
    fullName: 'Canonical Source'
    category: 'authority mechanism'
    summary: 'The concrete file, store, or log formally chosen to represent an authoritative fact.'
  - name: 'Data Lineage'
    fullName: 'Data Lineage'
    category: 'provenance'
    summary: 'Records where data came from, which transformations it passed through, and which source version produced it.'
  - name: 'Materialized View'
    fullName: 'Materialized View'
    category: 'derived projection'
    summary: 'A stored, query-friendly representation that can lag and should be reproducible from its source.'
  - name: 'Event Sourcing'
    fullName: 'Event Sourcing'
    category: 'implementation pattern'
    summary: 'Uses an ordered event log as the authoritative record and rebuilds current state by replaying it.'
  - name: 'CQRS'
    fullName: 'Command Query Responsibility Segregation'
    category: 'architecture pattern'
    summary: 'Separates authoritative commands from read-optimized projections, introducing an explicit synchronization boundary.'
  - name: 'SVOT'
    fullName: 'Single Version of Truth'
    category: 'consumption agreement'
    summary: 'Aligns consumers on one definition or result; related to, but different from, locating authority.'
sources:
  - title: 'Microsoft · Data considerations for microservices'
    url: 'https://learn.microsoft.com/en-us/azure/architecture/microservices/design/data-considerations'
  - title: 'Microsoft · CQRS pattern'
    url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs'
  - title: 'HashiCorp · Purpose of Terraform State'
    url: 'https://developer.hashicorp.com/terraform/language/state/purpose'
  - title: 'Kubernetes · Declarative object configuration'
    url: 'https://kubernetes.io/docs/tasks/manage-kubernetes-objects/declarative-config/'
---

# Single Source of Truth

A Single Source of Truth (SSOT) solves the question hidden inside every duplicated fact: **when copies disagree, which one has the authority to decide what is true now?**

Its answer is not “delete every copy.” Caches, search indexes, reports, replicas, translated packages, and deployed pages are all useful. The pattern gives one bounded fact one authoritative owner and makes every other representation a traceable derivative.

## The failure it prevents: drift

Imagine one article exists in four places:

```text
source.md       version 3
public package  version 3
blog copy       version 4
production      version 3 + a manual hotfix
```

All four look plausible. A future sync might erase the best edit because nobody knows which direction updates should flow. This is **drift**: representations that were meant to agree quietly diverge.

An SSOT establishes an authority contract:

1. Who may define this fact?
2. Which direction do updates flow?
3. How stale may a derived copy become?
4. How is it rebuilt or reconciled after divergence?

## One fact, one owner — not one database for everything

Authority should be scoped to a fact or domain:

- an order service owns the order lifecycle;
- an identity system owns a legal customer name;
- a source Markdown file owns an article's meaning;
- a committed main revision owns the production release.

These facts do not need to live in one physical store. In fact, forcing unrelated domains into one giant database can blur ownership instead of clarifying it.

A useful test is: **which system is allowed to originate a correction?** Other systems may read, subscribe, cache, index, translate, or project the fact, but they do not silently become a second independent writer.

## A practical pipeline

```text
authoritative source ──► public package ──► site copy ──► deployment
        write here           derived          derived        evidence
```

A healthy derivative carries enough lineage to explain itself:

```text
derived_from   = source identifier
source_version = commit, offset, or version
generated_at   = timestamp
refresh_policy = on commit / every five minutes / nightly
rebuild_path   = deterministic command or procedure
```

The safest default is one-way, repeatable generation. Circular synchronization — `A ⇄ B ⇄ C ⇄ A` — turns every participant into a potential authority and demands much harder conflict semantics.

## A service example

Suppose an Order Service owns order status. It publishes updates that feed a search index, an analytics table, and a recommendation system.

Those copies may be optimized for different queries and may be eventually consistent. A refund still goes through the Order Service because it owns the complete transaction history. A fast, nearby copy does not become authoritative merely because it is convenient.

This is why an SSOT can coexist with replication and high read scale: **physical multiplicity is allowed; ambiguous authority is not.**

## Authority is not correctness

The authoritative source can still contain a bug, a bad human entry, or an outdated rule. SSOT does not make its owner infallible. It makes correction directional: fix the owner, then regenerate or reconcile every derivative.

Without that direction, teams patch many copies independently and can never be sure the repair is complete.

## Recovering from a split truth

When two copies have both received valid-looking edits:

1. Pause the writes or releases that would widen the split.
2. Name the exact fact in conflict.
3. Choose authority using ownership, completeness, timeline, and audit evidence.
4. Reconcile any valid downstream-only changes back into that source.
5. Regenerate all derivatives.
6. Add lineage, diff checks, write permissions, or a one-way publishing path.

The order matters: restore authority before restoring consistency. Synchronizing without first choosing a judge is just an arbitrary overwrite.

## What it is not

- **Not one giant database.** SSOT is about bounded authority, not physical centralization.
- **Not a ban on copies.** Caches, replicas, materialized views, and reports are expected.
- **Not automatically correct.** It identifies where a correction belongs.
- **Not Event Sourcing.** An event log can implement an SSOT, but it is one implementation pattern.
- **Not Single Version of Truth.** SVOT emphasizes consumers agreeing on one definition or result; SSOT emphasizes where authority originates.

## Where it becomes difficult

The simple one-writer model strains under offline-first collaboration, active-active multi-region writes, network partitions, or facts that genuinely require multiple independent authors.

Those systems still need explicit authority and conflict semantics, but may distribute them through leaders, quorums, merge rules, or Conflict-free Replicated Data Types (CRDTs). “We have multiple writers” is not a reason to leave disagreement undefined.

## Five things to keep

1. A fact may have many copies, but it needs one named authority.
2. Every derivative should expose its source, version, freshness, and rebuild path.
3. Prefer one-way, idempotent generation when the domain does not require multiple writers.
4. Correct the source, then regenerate downstream; editing a projection creates drift.
5. SSOT makes errors repairable and auditable, not impossible.
