# Semantic Sprite Accents

Transparent sprite accents are a zero-default tool. They are brief visual
mnemonics for an abstract phrase, not a quota, decorative sticker pack, or a
substitute for evidence. The approved ledger in the authority-boundary film is
the reference case: one object, one phrase, one appearance, then it leaves.

Do not use this budget to suppress scene media. A portrait, object study,
source artifact, or larger editorial still that owns an image or hybrid scene
is governed by the treatment's media mix, not by the one-sprite cap. The
distinction is narrative function: scene media carries the composition for a
beat; a semantic sprite is a small removable mnemonic inside another layout.

## Opportunity Gate

Approve a candidate only when all four conditions are true:

1. The narration contains an abstract term that a single, unambiguous object
   can make easier to remember.
2. The layout has real negative space outside titles, captions, diagrams, and
   protected transition paths.
3. The object can match the selected visual spine without becoming clip art,
   a children's sticker, fake interface, or a second visual headline.
4. Removing it leaves the argument complete. If the asset would carry a fact,
   instruction, or essential relationship, use an evidence or explanation
   scene instead.

Record accepted and rejected candidates in `asset-decision-log.md`. “No sprite”
is a successful decision. The standard director budget is
`max_semantic_sprite_beats: 0`; set it to `1` only after a candidate passes this
gate. The standard workflow hard-caps this budget at one; do not bypass the
audit to turn a semantic accent into a decorative system.

## Role And Reuse Rules

- Use only for `explanation` or `emphasis`, never `evidence`.
- Limit each scene to one semantic sprite.
- Use the same asset once in the film by default.
- Bind the appearance to a cue word or phrase in the approved narration.
- Do not place an accent merely because a screen feels empty.
- The deterministic fallback is removal. The underlying layout and argument
  must remain complete.

## Asset Contract

Keep the asset type as `generated-still` and set
`usage_role: semantic-accent`. The asset-plan beat must include:

- `semantic_job` — the one phrase it helps the viewer retain;
- `asset_id` — the same identifier used by the director plan and storyboard;
- `style_family_id` — exactly equal to the plan's `visual_spine_id`;
- `asset_path`, `render_asset_path`, and `manifest_path`; the render path is
  the exact PNG/WebP loaded by the renderer, even when it is a copied public
  asset;
- `composition_id` — the registered Remotion composition that owns the asset;
- `alpha_qa_status`;
- provenance, rights, and the removal fallback.

Start from `templates/semantic-sprite-manifest.json`. Preserve the untouched
source, exact prompt, source, output, and render hashes, post-processing method,
alpha metrics, storyboard FPS, timing, rights, library policy, and selection rationale. The
render hash must equal the canonical output hash so a stale renderer copy cannot
pass preflight. Register the composition ID, FPS, `staticFile()` path, hash,
visibility endpoints, entrance/exit duration, translation, and opacity once in
`remotion/src/editorial/SemanticSpriteRuntimeRegistry.ts`; both the renderer and
preflight must read that registry rather than duplicate those values. Search the
asset library first, but reject a reusable asset that does not match the film's
style. Project-specific assets stay out of the library until separately
curated.

## Visual Language

- Match the treatment's palette, line quality, material, contrast, and level of
  realism.
- Prefer one readable silhouette with generous transparent padding.
- Avoid readable fake text, logos, watermarks, sticker borders, cast shadows,
  glow, particles, hands, and extra objects unless the treatment explicitly
  requires them.
- Review at final on-screen size, not only as a large source image.

## Motion Contract

Use the registered `semantic-settle` recipe:

- one 0.3–0.5 second ease-out entrance;
- opacity plus 8–12 pixels of vertical settle;
- a shorter exit;
- zero rotation, bounce, autonomous loop, or scale-from-zero;
- no repeated idle movement while the object is visible.

Place the cue in `video-storyboard.json` with a structured beat-level `motion`
object, record the storyboard FPS, and add an explicit `clear`, `remove`,
`exit`, or `hide` beat. Both the entrance and exit beat must set
`target_asset_id` to the semantic sprite's asset ID. The manifest's visible end must match that beat plus the
declared exit duration within one rendered frame. Runtime entrance/exit
durations and translation must match the structured storyboard motion. Use the shared `SemanticSprite` Remotion component rather than
reimplementing timing per scene.

## QA

Run `sprite-asset-audit.ts` before rendering. It verifies alpha, transparent
corners and padding, asset hash, manifest completeness, and likely matte
fringes, and it creates light and dark composite previews.

Then review the encoded master:

- decode the entire entrance and exit sequentially;
- inspect light and dark edges for green, white, or black fringe;
- confirm the accent never overlaps titles, captions, or the next scene;
- watch once at full speed and once at 25% speed;
- confirm the title and argument remain the first visual hierarchy;
- remove the accent if it feels decorative, literal, repetitive, or tonally
  separate from the film.
