---
title: 'Idempotency'
fullName: 'Idempotency'
shortName: 'Idempotency'
description: 'Make an uncertain operation safe to retry: one intent may arrive many times, but its business effect happens once.'
mentalModel: 'The same intent may be delivered many times; the system creates the business effect once and replays that outcome to retries.'
date: '2026-07-16'
updated: '2026-07-16'
domain: 'Software systems'
domainKey: 'software-systems'
tags: ['reliability', 'retry', 'distributed-systems', 'api-design']
maturity: 'growing'
published: true
featured: false
translationKey: 'idempotency'
interaction: 'idempotency'
neighbors:
  - name: 'Retry'
    fullName: 'Retry'
    category: 'recovery policy'
    summary: 'Decides when and how another attempt is made; idempotency decides whether that attempt can repeat the business effect.'
  - name: 'Idempotency Key'
    fullName: 'Idempotency Key'
    category: 'request identity mechanism'
    summary: 'Names one business intent so every retry can be recognized as the same operation.'
  - name: 'Deduplication'
    fullName: 'Deduplication'
    category: 'duplicate detection mechanism'
    summary: 'Detects or suppresses repeats; one possible mechanism for delivering idempotent behavior.'
  - name: 'At-least-once Delivery'
    fullName: 'At-least-once Delivery'
    category: 'delivery guarantee'
    summary: 'May deliver a message repeatedly, requiring an idempotent consumer to absorb duplicates safely.'
  - name: 'Transactional Outbox'
    fullName: 'Transactional Outbox'
    category: 'consistency pattern'
    summary: 'Bridges a database change and message publication without an unsafe gap, while consumers still handle duplicates.'
  - name: 'Exactly-once'
    fullName: 'Exactly-once Processing'
    category: 'stronger guarantee'
    summary: 'A frequently overclaimed end-to-end guarantee; idempotency usually converges the effect rather than preventing repeated delivery or execution.'
sources:
  - title: 'RFC 9110 · Idempotent Methods'
    url: 'https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2'
  - title: 'Stripe · Idempotent requests'
    url: 'https://docs.stripe.com/api/idempotent_requests'
  - title: "AWS Builders' Library · Making retries safe with idempotent APIs"
    url: 'https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/'
  - title: 'Amazon EC2 · Ensuring idempotency in API requests'
    url: 'https://docs.aws.amazon.com/ec2/latest/devguide/ec2-api-idempotency.html'
---

# Idempotency

Idempotency solves the hardest kind of distributed-system failure: not a clear success or failure, but an **unknown outcome**.

A client sends a payment request. The server charges the card, but the response disappears on the network. The client sees a timeout. If it gives up, a payment that should complete may look failed. If it retries blindly, the customer may be charged twice.

An idempotent contract separates recovery from duplication: **the request may be attempted again, but the same business intent does not create the business effect again.**

## A restaurant ticket

Imagine handing ticket `A-842` to a kitchen and hearing no confirmation. You hand over the same ticket again.

- Without an order number, the kitchen may cook two meals.
- With a stable order number, it finds `A-842` and returns the existing order status.
- A genuinely new meal needs a new number.
- Reusing `A-842` with a different dish should be rejected, not guessed.

The ticket is only an identifier. The kitchen still needs a reliable ledger, and recording the number cannot be separated from accepting the order by an unsafe gap.

## Mathematical and system meaning

An idempotent function satisfies:

```text
f(f(x)) = f(x)
```

In software systems, the useful definition is semantic: making the same request multiple times has the same **intended effect** as making it once. It does not require byte-identical responses or forbid extra logs, metrics, and timestamps.

For example, the first `DELETE /documents/42` might return `204` and the second `404`. The responses differ, but the intended state — document 42 is absent — has converged.

## Two ways to get idempotency

### Make the operation naturally idempotent

State assignment tends to converge:

```text
SET order.status = "PAID"     repeated → still PAID
DELETE document 42            repeated → still absent
PUT /profile { name: "Li" }   repeated → same representation
```

Relative changes usually do not:

```text
balance = balance + 10
toggle subscription
send welcome email
create a new charge
```

This gives a practical first question: can “change it again” be rewritten as “make it equal to this state”?

### Add an Idempotency Key

Creating a payment, booking, or cloud resource cannot always be reduced to a simple assignment. The client can instead generate one stable key for one business intent and reuse it for every retry.

```text
Idempotency-Key: order-842-payment
POST /payments { amount: 42, currency: "CAD" }
```

A complete protocol normally needs to:

1. use one key for one intent, and a new key for a new intent;
2. scope the key by caller, account, and operation;
3. reserve it atomically with a unique constraint or transaction;
4. bind it to a request fingerprint so changed parameters are rejected;
5. record whether the operation is processing, complete, or failed;
6. replay the stored or semantically equivalent result to a completed duplicate;
7. define what a concurrent duplicate sees; and
8. declare the TTL (Time to Live) after which the key may be treated as new.

## The atomicity gap is the real danger

This implementation has a race:

```text
if key does not exist:
  charge_card()
  save(key, result)
```

Two concurrent requests can both observe a missing key and both charge. The service can also crash after charging but before saving the record, leaving a retry indistinguishable from a new request.

Key reservation, business state transition, and result recording should share one atomic boundary where possible. If the effect crosses a database, queue, email provider, or external payment service, each boundary needs its own idempotency strategy — often a state machine, Transactional Outbox, or consumer Inbox.

**A header without an atomic state machine is decoration, not a guarantee.**

## Four cases the contract must name

### A completed duplicate

Return the first recorded result or a semantically equivalent current result. Do not execute the business action again.

### The same key with different parameters

Reject it. Otherwise the service cannot know whether it received a retry or a mistakenly reused key. Stripe and Amazon Elastic Compute Cloud (Amazon EC2) both treat parameter mismatch as an error.

### A concurrent duplicate

The second request must not also begin the effect. It can wait, receive an `in progress` response, or get a conflict; the API (Application Programming Interface) contract must choose.

### An expired key

Idempotency memory is usually bounded. Once the record is pruned, the same key may execute again. The server's guarantee window must cover the client's maximum retry horizon.

## HTTP: safe is not the same as idempotent

HTTP (Hypertext Transfer Protocol) distinguishes safe methods from idempotent methods.

| Method   | Safe? | Idempotent by semantics? | Meaning                                                        |
| -------- | ----- | ------------------------ | -------------------------------------------------------------- |
| `GET`    | yes   | yes                      | Requests a read and should not ask for a state change.         |
| `PUT`    | no    | yes                      | Replaces the target with a representation; repeats converge.   |
| `DELETE` | no    | yes                      | Changes state once, but repeated deletion has the same intent. |
| `POST`   | no    | no, by default           | Often means “create another”; needs a business-level contract. |

An operation can therefore be state-changing and idempotent. Idempotent does not mean harmless or read-only.

## Know the neighboring concepts

- **Retry is a recovery policy.** It controls timeouts, attempt limits, exponential backoff, and jitter. Idempotency makes those attempts safe for the business effect.
- **Deduplication is a detection mechanism.** It may be used to implement idempotency, but the semantic contract is broader than dropping duplicates.
- **At-least-once delivery is a delivery guarantee.** It can repeat messages, so consumers need idempotent handling.
- **Exactly-once is a stronger and often misleading claim.** Idempotency does not prevent repeated delivery or execution; it makes a scoped effect converge as if it happened once.
- **Optimistic Concurrency Control (OCC) protects against stale writes.** OCC distinguishes competing intentions; idempotency recognizes another delivery of the same intention.
- **Transactional Outbox closes a cross-system consistency gap.** It still expects duplicate publication and therefore an idempotent consumer.

## What it does not solve

- It does not prevent retry storms; use bounded attempts, backoff, jitter, rate limits, and circuit breaking.
- It does not automatically cross databases, queues, emails, and third-party APIs.
- It does not prevent two different keys from racing for the same inventory.
- It does not decide whether an API should cache and replay a first `500` response.
- It does not create global exactly-once processing.

## Remember these five things

1. Idempotency is a response to unknown outcomes: retry the attempt without repeating the intent's effect.
2. Prefer naturally idempotent state assignment when the domain permits it.
3. One intent gets one key; retries reuse it; a new intent gets a new key.
4. Reject the same key with changed parameters, and define concurrent and expired-key behavior.
5. The most dangerous bug lives in the non-atomic gap between the side effect and its idempotency record.

## Self-test

1. If the payment committed but its response vanished, what evidence makes a retry safe?
2. Does your key identify a business intent, or only hash a payload?
3. What happens when the same key carries a different amount?
4. Which request wins when two duplicates arrive concurrently?
5. Does the key's lifetime cover the client's longest retry horizon?

## Further reading

- [RFC 9110 · HTTP Semantics §9.2.2 Idempotent Methods](https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2)
- [Stripe API · Idempotent requests](https://docs.stripe.com/api/idempotent_requests)
- [AWS Builders' Library · Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)
- [Amazon EC2 · Ensuring idempotency in API requests](https://docs.aws.amazon.com/ec2/latest/devguide/ec2-api-idempotency.html)
