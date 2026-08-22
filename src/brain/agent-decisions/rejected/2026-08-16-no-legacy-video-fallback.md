# Do not silently fall back to the legacy video treatment

**Status:** active  
**Surface:** blog companion videos  
**Recorded:** 2026-08-16

## Rejected decision

For a new blog companion video, do not default to the older generic slide-deck / blog-image treatment when a newer approved visual baseline exists.

## Why this exists

During the DeepSeek Harness video work, an initial run used the older treatment. The newer visual direction was only selected after the prior blog and its final video were reviewed. The preference existed, but it was not a required, reviewable input to the video plan.

The failure was not that an agent lacked a stronger adjective for the desired look. The failure was that the run could proceed without naming the reference it was inheriting or the legacy pattern it was deliberately rejecting.

## Current guardrail

The active baseline is [`src/content/strategy/video-style-baseline.md`](../../../content/strategy/video-style-baseline.md). Every `director-plan.json` must now include a reviewed `style_reference`, and `director-plan-audit.ts` fails when that reference is missing or incomplete.

## What could defeat this decision

An explicitly chosen new visual system may replace the baseline, provided it is reviewed by Aaron, recorded in the director plan, and passes the same audit. “New” is not a reason by itself; a deliberate direction is.

## Retirement test

Revisit or remove this record when the video workflow selects and verifies the approved baseline automatically, and several subsequent video runs show that the legacy fallback no longer recurs.

## Evidence limit

This guardrail has been installed and audited. It has **not** yet been validated by a later independent video run, so it must not be described as having prevented a recurrence.

