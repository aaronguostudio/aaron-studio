# Agent Decision Memory

This directory holds small, durable decisions that help an agent avoid repeating a known, tempting mistake. It is deliberately separate from `src/brain/decisions/`, which records Aaron's life-level ADRs.

Use a record only when all three conditions hold:

1. The failure or trade-off actually occurred in this studio.
2. The reason would be easy for a later agent to rediscover imperfectly.
3. The record points to a concrete check, owner, or review moment—not merely a preference.

`rejected/` is for choices we do not want silently reintroduced. A record must say what future evidence could defeat its reasoning, and when to retire it. Keeping every rejected idea forever turns memory into policy fog.

