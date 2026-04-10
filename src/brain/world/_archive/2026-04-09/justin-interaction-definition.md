# Justin's Definition of "Interaction"

**Date:** 2026-04-09
**Source:** Screenshot from Teams (timestamp 3:41 PM) shared by Aaron
**Captured by:** GG from Aaron's share (OCR)
**Related:** [[people/justin-anderson]], [[projects/nova]], [[themes/ai-native-life]]

## Raw Content

> smth like this:
>
> An interaction is a purpose-built full-stack application with some important features:
>
> - An interaction is built by a user using the Nova platform purely by "vibe coding" it
> - From the user perspective, an interaction includes a familiar LLM Chat interface and/or an app-style UI
> - A user "interacts" with an interaction via either the interaction's LLM chat and/or via the interaction's UI (both for input and output)
> - The back-end of an interaction is powered by Nova's flows which provide the surface for prompt and tool orchestration that ensures reliability/determinism (where appropriate) and creativity/flexibility (where appropriate). This surface is analogous to Claude Skills (prompt/tool orchestration) but with greater ability to control the surface' orchestration.
> - Put together, an interaction goes well beyond agentic orchestration by including the basis for a context-focused full stack application and integrated LLM interface

## Context
Posted the same day as Justin's post-retreat message and his direct to Aaron about UX priority. This is Justin trying to settle the terminology and conceptual frame for "interaction" — one of Nova's core concepts that business users at the COO retreat found confusing.

The definition is important because Justin himself wrote in his post-retreat message that "business users are very sensitive about naming" and Nova needs terminology discipline. This is his attempt to provide that terminology anchor.

Timing note: Justin is in COO retreat day 2 when he posts this. Likely shaped by what he heard that day from COO group challenges.

## GG's Interpretation (at time of capture)

**This is marketing language disguised as technical specification.** Each clause reveals something:

**1. "Built purely by 'vibe coding' it"**
The most revealing clause. Writing "vibe coding" into a product *definition* — not as a methodology, but as a *defining feature* — means the platform's identity is built on a contested, unstable methodology. Any serious CTO reading this would flag it immediately. Vibe coding is a *process descriptor*, not a *product property*. Including it here is a category error, or more charitably, a rhetorical choice to make Nova sound novel.

**2. "Familiar LLM Chat interface and/or an app-style UI"**
This defines nothing. "Either or both of two things" is not a boundary — it's the absence of a boundary. Compare to Claude Skills, which has a precise definition: "prompt + tool orchestration bundled as a reusable unit." Nova's interaction has no such precision.

**3. "Analogous to Claude Skills ... but with greater ability to control the surface' orchestration"**
This is a politically risky claim. Claude Skills is backed by Anthropic's entire infrastructure team. Nova's flows are built on a Redis cluster that couldn't survive a COO retreat demo. Claiming "greater" capability than a mature Anthropic primitive will be challenged by anyone in the ET with Anthropic ecosystem knowledge.

**4. "Reliability/determinism (where appropriate) and creativity/flexibility (where appropriate)"**
Infinite elasticity. Any place can be "appropriate" for either. This clause provides zero guidance to engineers. When a team member asks "should my interaction be deterministic or creative?", the answer is "it depends" — which is why the team's output is so inconsistent.

**5. "Goes well beyond agentic orchestration by including the basis for a context-focused full stack application and integrated LLM interface"**
Five abstract words stacked: "beyond," "basis," "context-focused," "full stack," "integrated." Translation: "A full-stack application with an LLM." That's it.

**The underlying pattern:** This is *category creation* language, not *product definition* language. Its purpose is to position Nova as a new category — something that transcends existing tools, that ET members can't easily compare to alternatives, that justifies continued investment because "it's something new."

**Why this matters for engineering:** When the product definition is narrative rather than specification, the team cannot converge on what "done" means. Any failure can be explained away as "not the target form of this interaction." This is the structural reason Aaron feels Nova "says it will change the world but can't stabilize one small feature" — the definitional incoherence is the root cause of execution chaos.

**Why this matters politically:** The "greater than Claude Skills" claim is bait for challenge. If Keri or an ET member raises it, Justin will have to defend a technical superiority claim against a platform he hasn't benchmarked against. This is a narrative that cannot survive scrutiny.

**Why Aaron should care:** Aaron is being asked to polish UX for a platform whose defining concept has no UX implications. If an "interaction" can be chat, app, hybrid, deterministic, or creative — which UX is Aaron polishing? The definition's elasticity propagates down to every UX decision, making Aaron's sprint partially ungrounded. Aaron should ask Justin in the 1:1: "For Campaign UX polish, can we pick one concrete interaction pattern as the anchor, so the polish has a real target?"

## Follow-up
- 2026-04-10: Aaron's 1:1 with Justin — opportunity to either (a) get a narrower anchor definition for UX purposes, or (b) note that the abstraction level is a problem
- Monitor: does this definition get cited by ET members or challenged on the "greater than Claude Skills" claim
