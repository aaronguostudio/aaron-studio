---
title: "Optimistic Concurrency"
fullName: "Optimistic Concurrency Control"
shortName: "OCC"
description: "Work in parallel; reject stale writes before they overwrite newer changes."
mentalModel: "Let people work in parallel; when someone commits, verify that the assumptions they started from are still true."
date: "2026-07-16"
updated: "2026-07-16"
domain: "Software systems"
domainKey: "software-systems"
tags: ["concurrency", "databases", "distributed-systems"]
maturity: "growing"
published: true
featured: true
translationKey: "optimistic-concurrency"
interaction: "optimistic-concurrency"
neighbors:
  - name: "PCC"
    fullName: "Pessimistic Concurrency Control"
    category: "strategy"
    summary: "Acquire exclusive access before doing the critical work, trading retries for waiting and lock management."
  - name: "MVCC"
    fullName: "Multi-Version Concurrency Control"
    category: "storage model"
    summary: "Keep multiple versions so readers can see a consistent snapshot without blocking writers."
  - name: "CAS"
    fullName: "Compare-and-Swap / Compare-and-Set"
    category: "atomic primitive"
    summary: "Replace a value only when it still equals the expected value; a common building block for OCC."
  - name: "Isolation"
    fullName: "Transaction Isolation"
    category: "semantics"
    summary: "Defines what concurrent transactions may observe and which anomalies the database prevents."
  - name: "Idempotency"
    fullName: "Idempotent Operation"
    category: "retry safety"
    summary: "Makes a repeated request produce the intended effect once, which is essential before automatic retries."
  - name: "OT / CRDT"
    fullName: "Operational Transformation / Conflict-free Replicated Data Type"
    category: "merge model"
    summary: "Preserves concurrent intent by transforming or converging operations instead of simply rejecting one writer."
sources:
  - title: "RFC 9110 · HTTP Semantics: If-Match"
    url: "https://www.rfc-editor.org/rfc/rfc9110.html#name-if-match"
  - title: "PostgreSQL · Concurrency Control"
    url: "https://www.postgresql.org/docs/current/mvcc.html"
  - title: "Microsoft · Handling Concurrency Conflicts in EF Core"
    url: "https://learn.microsoft.com/en-us/ef/core/saving/concurrency"
  - title: "AWS · Optimistic locking with version number"
    url: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/BestPractices_OptimisticLocking.html"
---

# Optimistic Concurrency

Optimistic Concurrency Control (OCC) solves a deceptively simple problem: two people can read the same record, make different changes, and accidentally erase each other's work.

Its defining move is not to lock the record while everyone thinks. It lets work proceed, then validates the writer's original assumption at the moment of commitment.

## The failure it prevents: lost update

Suppose Alice and Bob both read document `#42` at version 7.

- Alice changes the title and saves first. The database advances to version 8.
- Bob is still editing the old version 7. He changes the owner field and submits the whole object.
- Without concurrency control, Bob's stale object can silently restore the old title.

That is a **lost update**. The dangerous part is not that two people read together. It is that Bob's write was accepted even though the premise behind it was stale.

## The mechanism

OCC normally has three stages:

1. **Read** the business data and a concurrency token such as a version number or Entity Tag (ETag).
2. **Work** locally without holding a long-lived exclusive lock.
3. **Validate and write** as one atomic operation. If the token still matches, commit and advance it. If not, report a conflict.

```sql
UPDATE documents
SET title = 'Q3 Growth Plan',
    version = version + 1
WHERE id = 42
  AND version = 7;
```

One affected row means version 7 was still current. Zero affected rows means the record changed after it was read.

The comparison and write must be atomic. A separate `SELECT` followed later by an unconditional `UPDATE` leaves a Time of Check to Time of Use (TOCTOU) race between the two statements.

## The same idea in HTTP

Hypertext Transfer Protocol (HTTP) exposes this pattern with Entity Tag (ETag) and `If-Match`:

```http
GET /documents/42
ETag: "v7"

PUT /documents/42
If-Match: "v7"
```

If the resource is no longer version 7, the server can reject the write with `412 Precondition Failed`. The condition is evaluated where the write happens, not guessed by the client from an earlier read.

## Optimistic versus pessimistic

| Dimension          | Optimistic Concurrency Control           | Pessimistic Concurrency Control       |
| ------------------ | ---------------------------------------- | ------------------------------------- |
| Default assumption | Conflicts are uncommon                   | Conflicts are likely or very costly   |
| Control point      | Validate at commit                       | Lock or queue before work             |
| No-conflict cost   | Little waiting                           | Lock and waiting overhead remain      |
| Conflict cost      | Retry, merge, or discard work            | Usually wait rather than redo         |
| Common risks       | Retry storms, livelock, poor conflict UX | Deadlocks, timeouts, lower throughput |

A useful approximation is:

```text
optimistic cost ≈ validation + conflict probability × redo cost
pessimistic cost ≈ locking + waiting + deadlock/timeout handling
```

Real systems often mix them: optimistic editing for ordinary records, short locks or queues for a few hot resources, and idempotency keys around external side effects.

## Conflict is part of the protocol

Detecting a conflict is only half the design. The product must decide what happens next:

- reject and ask the user to refresh;
- re-read and retry a deterministic operation;
- merge independent fields;
- show a three-way merge;
- serialize a hot resource through a queue or short transaction.

Automatic retry also needs idempotency, bounded retries, and backoff with jitter. Retrying an operation that sends money, email, or third-party requests can otherwise duplicate the side effect.

## Where it fits

OCC is strongest when reads dominate writes, conflicts are rare, users may edit for a long time, and retry or merge is affordable.

It degrades when many requests fight over one hot record, conflicts invalidate expensive work, or a business invariant spans records that a single version token cannot protect.

## What it is not

- **Not Last Write Wins.** OCC makes stale writes visible instead of silently accepting the last arrival.
- **Not Multi-Version Concurrency Control (MVCC).** MVCC mainly answers which version a reader sees; OCC answers whether a writer's premise is still current.
- **Not Compare-and-Swap (CAS).** CAS is an atomic primitive that can implement the broader OCC strategy.
- **Not Optimistic User Interface.** Optimistic UI changes perceived latency; OCC protects concurrent correctness.

## Five things to keep

1. OCC means “do not block first; validate the premise at commit.”
2. The check and write must be atomic.
3. Version, ETag, and CAS are carriers or mechanisms, not the complete policy.
4. A conflict needs a designed exit: reject, retry, merge, or serialize.
5. Choose between waiting and rework based on contention and failure cost, not ideology.
