# Video Treatment: What I Learned From DeepSeek's Harness (v2)

## Decision Status

**SELECTED: Graphite Ledger Editorial** — Aaron selected this direction and the continuous-original-score strategy in session, 2026-08-16, from a three-direction menu (vs Clean Indigo continuity and an Indigo × Paper hybrid). The v1 slide-format render (12:42, 2026-08-15) is retained as baseline only; its art direction re-used the blog's Field Signal world full-frame, which Aaron editorially rejected for video on 2026-08-03 (see 2026-08-02/video-redesign-directions.md). Locked and carried over from v1 unchanged: narration audio (approved profile aaron-pvc-identity-v1, word-level verified against the approved transcript), per-section timing, factual sources (claim-ledger C1–C28 + fact-pack), story structure (hook + 8 chapters), caption infrastructure, and QA machinery. Only the art direction and layout layer are rebuilt.

## Product Promise

The viewer leaves able to explain why the same model swings 47% → 67% by harness alone, carrying three copyable practices (pre-request assertion, cache trio, rejected/ folder) and one decision frame (rent / churn / own) — delivered as a finished editorial film, not a narrated slide deck.

## Central Visual Idea

**The film itself is a session log.** The subject of the essay — an append-only ledger the model cannot escape — is the film's own structure:

- Each chapter enters as a monospace ledger line appended to a persistent, quiet log rail (`SEQ 03 · FOLLOW THE MONEY FIRST`), echoing the article's own `seq 101  user/message` sketch.
- Append-only is the transition grammar: new chapters append; nothing is erased; prior context compresses upward.
- Model-visible moments carry the single cyan accent; everything bookkeeping stays graphite.
- The signature peak is the 44/3 scene: forty-four mono ledger lines accumulate as texture, exactly three flip cyan and advance; the rest dim to archive grey.

## Editorial Arc

1. Cold open on the 47/67 contradiction (data statement, no branding delay).
2. The winner blinks — Ronacher quote as sourced evidence; "so I went inside" pivot.
3. Follow the money — lawyer/contract metaphor as the film's warmest evidence still; safe-and-key division of labor; the timestamp that breaks the prefix.
4. The test that refuses — CI assertion as a ledger of green entries ending in one coral refusal.
5. 44/3 — the signature ledger scene; derive→gate mechanism as a system map; the five-line assertion payoff.
6. One config row — the hanging-machine still as a conceptual reset; the 178-green-tests hollow; 27 checks bought back.
7. Who built this — fleet still as scene media; the process OS as ledger entries (rejected/ freezer, verified-red).
8. The catch, and the play — honest limits; moat vs funnel as the film's one split comparison; portability cuts both ways.
9. The hour — rent / churn / own; two-column close; series pointer; brand end card.

## Visual Direction

**Graphite Ledger Editorial** — one coherent system, versioned as `ledger-editorial-v0.1`:

- Warm porcelain paper field (light canvas; dark frames are rare punctuation, never the default).
- Ink graphite carries structure and primary reading; warm grey carries secondary context; raised paper surfaces carry documents and ledger slips.
- **One dominant accent: ledger cyan** — semantic job: model-visible, delegated work, the key you hold. **One tension accent: muted coral** — refusal, full price, crash. Used as punctuation, never decoration.
- **Deliberate exclusion:** the blog set's soft green (review/gates) does not enter the film — gates and verification render in ink + cyan. Two accents is the ceiling.
- Typography: serif display (Georgia) for claims and questions; neutral sans for explanation and captions; **monospace as the motif carrier** — ledger entries, seq markers, counts, paths, and sources. Long headlines own a full-width reading axis.
- Header: `AARON GUO` + mono chapter ledger marker only. Captions: phrase-level sans in the protected bottom zone.
- The blog's paper-craft illustrations appear only as **scene media** — three to four restrained editorial stills (contract re-read, hanging machine, fleet, two shelves) that interrupt the typography without changing the film's spine. They are illustrative resets, never full-frame slides and never evidence.

## Motion Direction

- Every scene enters with a meaningful image, visible scaffold, or bridge; first change within one second; no blank stages, no title-only entries.
- Chapter grammar: ledger-append (new mono line slides into the rail; prior lines compress upward) with ~0.42s crossfade continuity where a clean cut isn't warranted.
- Working recipes: word-mask for claims, connector-draw for the derive→gate map (arrowheads ≥0.98 parent progress), focus-shift within stable layouts, count-up for the numeric heroes (static-number fallback declared), compare-wipe once (moat/funnel).
- No bounce, overshoot, page flips, per-character flicker, camera moves outside the one signature scene, or persistent dark canvas.
- Signature budget: exactly one scene (44/3 ledger cascade), well under the 20% runtime ceiling; no two adjacent high-intensity scenes.
- Intensity mix target at scene level: ≥25% calm / ~70% structured / ≤5% signature (director-plan beats carry one intensity each; calm lives in the winner, catch, and evidence-still scenes).

## Music Direction

**Continuous original score** (Aaron's selection), composed to the chapter arc, never looped beneath it:

- Instrument semantics carried over from the channel's established language: low cello = consequence and money; felt piano = human judgment; a quiet analog pulse = the agent fleet.
- Arc: pulse and cello lead the cold open; piano takes the lawyer and judgment beats; the pulse recedes for the 44/3 signature scene (precision reads better nearly dry); pulse returns for who-built; near-silence under the catch; resolved piano+cello for the hour; a held chord alone under the brand card.
- Narration stays roughly 20 dB above the score during speech; broad chapter-level gain curves, no phrase pumping, no drums or trailer lifts.
- Process: search `asset-library` first per the reusable-asset gate (mood: patient, precise, warm-mechanical; duration ≥ 13 min or seamlessly extendable; rights approved/candidate). Generate via the Eleven Music paid-plan path only if no candidate fits; record rights review before publishing. Until rights confirm, any scored master is publication-blocked, not silently dropped.

## Asset Decision

- Scene media (generated paper stills, provenance-logged, removable via text-only fallback): `02-metaphor-contract-reread` (money chapter), `s05-01-one-row-machine` (config chapter reset), `03-metaphor-rules-table-fleet` (who-built), `04-metaphor-two-shelves` (closing). Each is visibly illustrative; none carries a claim that needs a source.
- Semantic sprites: `max_semantic_sprite_beats: 0` to start. One candidate exists (a single ledger strip settling beside "the log is the only truth") and may be promoted to 1 only through the semantic-sprite gate.
- No generated video inserts in this film. No fake UIs, no fake social screenshots, no dashboard chrome.
- The YouTube thumbnail remains the existing paper-world exact-text asset (channel-facing, distinct from the film's internal system — same policy as the previous film).

## Sound And Status

- Narration: locked v1 audio (10:03 narration span, -16.64 LUFS normalized master) is the primary soundtrack; word timings from `.video-gen-cache` are the master timing source for every visual beat.
- Status: treatment recorded 2026-08-16 after Aaron's direction and music selections. Next: layout-manifest + static keyframes for the new families, fact-pack, director-plan + audit, storyboard + audit, then a 60–90s prototype slice (must contain calm, structured, and the signature scene) for Aaron's review before any full render.
- The blog publishes 2026-08-19 regardless of film status; the film ships when it passes QA, not before.
