# Redis Architecture Discussion — Duncan & Narek

**Date:** 2026-04-09
**Source:** Teams discussion messages between Duncan and Narek, shared by Aaron
**Captured by:** GG from Aaron's share
**Related:** [[people/narek]], [[people/duncan-mountford]], [[projects/nova]]

## Raw Content

### Duncan's Initial Message

> I'm still seeing loads of zombie connections to Redis when looking at the diagnostic tool, so I'm introducing a zombie reaper on the Control Plane that will run every two minutes and clean up any zombie connections it finds. This should ensure our pub/sub pool stays within the optimal range and should help resolve any max connection errors. I'm going to continue to dig into this a bit deeper and see if I can root out the source of the issue. Narek, if you run into anything on your optimization pass, let me know and we can coordinate an optimization strategy.

### Narek's Response

> Hey team,
>
> After some research, I found out that Redis dedicates a separate connection for each pub/sub subscription, it's not a single connection per worker that gets reused across the app. Since we have multiple WebSocket endpoints and listeners each creating their own pub/sub connections and holding them open, this can easily exhaust the Redis connection pool as we scale, and there is a hard limit on number of open connections.
>
> The pattern I'm proposing: instead of creating pub/sub connections ad-hoc throughout the codebase, we maintain a single shared pub/sub connection per worker (or a small handful scoped to high-level topics). On top of that, we define an event bus abstraction that lets any listener register itself with a predicate + callback pattern - subscribe, filter by condition, handle matching messages, fire callbacks, and cleanly unsubscribe when done.
>
> This keeps Redis connections bounded and predictable (e.g. 20 workers = 20 connections, not 20 × N subscribers), while giving each endpoint the same flexibility to listen for exactly the events it cares about. Thoughts?
>
> Something like this:
>
> ```python
> bus = RedisEventBus(redis)
>
> unsub = bus.subscribe(
>     channels={"flow:123"},
>     predicate=lambda e: e.data["event"] == "text.delta",
>     callback=lambda e: ws.send_json(e.data),
> )
>
> await bus.publish("flow:123", {"event": "text.delta", "delta": "Hello"})
>
> await unsub()
> ```

### Duncan's Follow-up

> I think this, coupled with the defensive measures I put in place (moving XWatch to Postgres, the zombie reaper, enforcing maxlen on the data plane, etc.) should give us a very solid reliability boost at scale. I'll be interested to see what the locust test returns once we have your proposed fix in place.
>
> Map allocation node is now integrated with the orchestrator. I'm going to give it some different scenarios to test, but it should be good to go. It also brought up a good question that I think we need an answer for: how do we normalize incoming API data so that it can be predictable and reliable for consumption by our front-end? To that end, I'm putting a bit of thought into a node that will help us normalize our retrieved data and make it homogeneous with the same CRUD node structure. This node will take me a bit of time to get working so I'll work on it in the background as we move forward to cleaning up what's already here and delivering the "production grade" quests and campaigns requested by the COO team.
>
> Have a great night!

## Context
This exchange happened on April 9, one day after the failed COO retreat where Redis overload was a primary demo-breaking issue. Justin had publicly assigned Duncan + Narek to work together on Quest Builder stability. This is their first documented technical discussion post-retreat.

## GG's Interpretation (at time of capture)

### Two different engineering mindsets on display

**Narek is doing architectural thinking.**
He went from "we have a problem" to "here's the mechanism causing it" (Redis pub/sub = 1 conn per subscription) to "here's the correct abstraction" (shared connection + event bus with predicate/callback). This is how senior engineers think. The fix is correct — it's how any mature real-time system handles pub/sub.

**Duncan is doing containment thinking.**
He identified symptom (zombie connections accumulating), built a remediation (2-minute reaper), and moved on. Zombie reapers are classic "make the dashboard green" engineering. They don't fix the bug, they clean up its output. If zombies are being created, reaping them every 2 minutes means the system is permanently in a "creating zombies, killing zombies" cycle — functional but unhealthy.

Both are needed short-term. But Duncan is treating them as equivalent solutions.

### Critical tells in Duncan's response

**1. Claiming "solid reliability boost at scale" before Narek's fix ships.**
> "I think this, coupled with the defensive measures I put in place... should give us a very solid reliability boost at scale."

This is *over-claiming*. At the moment of writing, Narek's fix is a proposal with no timeline. The "defensive measures" are patches. Calling this "solid reliability boost at scale" is premature confidence — the kind that leads to another demo failure.

**2. No commitment on Narek's fix.**
> "I'll be interested to see what the locust test returns once we have your proposed fix in place."

"Interested to see" is passive. Who will implement it? When? What priority? None of this is answered. A critical-path fix is sitting in "conversational" status. This is how urgent work quietly dies in organizations.

**3. Duncan is opening a new front in the middle of a crisis.**
> "a node that will help us normalize our retrieved data... This node will take me a bit of time to get working so I'll work on it in the background"

7 days before the next decision deadline, with the platform still unstable, Duncan is starting *new architectural work* on a data normalization node. This is the fourth parallel stream for him (zombie reaper + map allocation + data normalization + timesheet app for Keri). **Justin asked him to focus on Quest Builder stability.** He is not doing that.

### The organizational pathology

This exchange reveals why Nova can't stabilize: **the person doing root-cause thinking (Narek) has no authority to make others prioritize his fix, and the person with perceived authority (Duncan) is prioritizing whatever feels progressive to him.**

In a healthy engineering org, Narek's message would trigger:
1. Immediate recognition that this is the root cause
2. Planning: who implements, when, what else stops
3. Halt of new work until the critical fix lands
4. Coordination meeting with stakeholders on timeline impact

Instead it triggered: "cool, I'll be interested to see."

### What this means for Aaron

**Platform will not be stable by April 17.**
Narek's event bus refactor is a 1-2 week serious refactor at minimum. The team is proceeding as if zombie reapers plus patches are sufficient. They are not. Under real load (COO retreat level) the system will break again.

**Aaron's UX polish work sits on an unstable foundation.**
Any demo that stresses the system will surface the underlying Redis issue. Aaron cannot prevent this. He should explicitly scope his work to "demo-path UX" and not claim responsibility for stability.

**Narek is the person Aaron should be building a direct relationship with.**
This exchange confirms what was already suspected: Narek is the only senior-thinking engineer on the team. His work has value regardless of Nova's outcome. His fix to pub/sub is reusable in any future architecture. His approach to memory nodes is forward-looking. Aaron should find a technical reason to engage him directly (discussed in meeting prep — "how does event bus affect Campaign Builder's WebSocket listeners?").

**The "vibe coding" critique is vindicated.**
Justin's public definition of interactions mentions "vibe coding" as a defining feature. This Redis situation is the cost of vibe coding at the platform level: nobody sat down and designed the pub/sub architecture, so it was built ad-hoc, connection per subscription, until it broke. Narek is now trying to retrofit a proper abstraction on top of a vibed foundation. This is always harder than designing correctly from the start.

### Aaron's opening to Narek (suggested)

> "I read your event bus proposal. Makes sense — ad-hoc pub/sub would exhaust any pool under load. One question from the UX side: Campaign Builder has WebSocket listeners for stage progress updates (the orchestrator watches campaign runs in real-time). If we move to shared connection + predicate/callback, does the UX flow need to change? I'd rather understand this now than redesign later."

This opens a legitimate technical conversation, shows Aaron read the proposal, and signals he's thinking 2-3 moves ahead.

## Follow-up
- Narek's stress test results (expected ~April 11) will reveal whether patches are enough
- Track whether Narek's fix actually gets implemented, and by whom
- Aaron should reach out to Narek within the sprint with a technical question
- Related: [[_archive/2026-04-09/nova-team-meeting-notes]]
