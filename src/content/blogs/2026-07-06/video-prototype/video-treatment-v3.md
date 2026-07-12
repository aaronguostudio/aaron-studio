# FDE Field Signal V3 Treatment

## Decision

Preserve the approved score, voice, visual system, and scene structure from V2.
V3 fixes one motion-layout failure and one framing problem before the full render.

## Motion Boundary

The model card remains dimensional, but it is an information-bearing plane rather
than a full-screen spectacle. Its Y rotation is capped at 36 degrees, its projected
width never falls below 80 percent, and its translation stays inside the registered
transform envelope.

The deployment result band owns a protected lower zone. The transformed card and
operating panel may not enter that zone at any point in the animation. QA samples
the turn at 0, 25, 50, 75, and 100 percent, then inspects the band entry and hold.

## ACTOR Framing

ACTOR is presented as Aaron's deployment framework, not a test framework. The
spoken line is: "ACTOR is part of my deployment framework." The five cards remain
questions because they guide execution without weakening the framework's status.

## Audio

Keep the approved narration for the first three sections. Regenerate only the
ACTOR section with the production voice profile, then apply the approved 1.04x
editorial retime. Preserve the first 56 seconds of the V2 score exactly and stretch
only the ACTOR music tail to the new ending.

## Release Gate

- Source and encoded-master checks must show no overlap at the deployment turn.
- ACTOR captions, card reveals, and recursive path must follow the regenerated words.
- The final frame sequence must contain no partial layers or premature arrowhead.
- The full mix must pass loudness, true-peak, and long-silence checks.
