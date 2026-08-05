# Visual Postmortem: What AI Code Can Change

## What Worked

- Concept-first comparison separated three different predicates before style selection. The Authority Gate earned the title more directly than the key / ledger or state-ripple concepts.
- Field Signal Editorial gave the post an authored, tactile identity without repeating the glass-heavy language of prior AI workflow articles.
- Cover candidate A stayed legible with only three groups: human intent, authority boundary, and trusted records.
- Both thumbnail candidates rendered the exact headline correctly. Candidate A's calm two-column zone produced the more reliable mobile hierarchy.
- The authority-ripple image became stronger after a narrow edit removed pseudo-code texture and an unrelated green patch while preserving the state-propagation meaning.
- The review ladder passed semantic QA on the first generation: exact labels, correct order, and one reversible-to-authoritative arrow.
- The contact sheet confirmed that Controlled Mix worked through shared paper, graphite, and coral signals while silhouettes changed by role.
- Built-in image generation produced consistent 1672 × 941 landscape assets with no API-key or provider fallback.
- WebP compression reduced accepted files by roughly 95–97% while preserving the generated dimensions.

## What Failed Or Ranked Lower

- Cover candidate B used too many record cards. Their embossed line texture resembled pseudo-microcopy and pushed the cover toward a dashboard.
- Thumbnail candidate B was accurate but visually busier: the diagonal split crowded the hand and strip under the headline.
- Authority-ripple candidate A violated the no-text intent with code-like marks and added an unexplained green corner patch.
- Prompted format did not control an exact export size. The backend returned 1672 × 941 rather than a named 2K size; validation must continue to record actual dimensions.

## Reusable Prompt And Composition Patterns

- For authority and system-of-record essays, show a visible material transformation across one boundary rather than using security icons.
- To show state propagation without a diagram wall, repeat one restrained color mark across a central record and only three downstream artifacts.
- For framework diagrams, list every permitted word, exact order, one allowed arrow, and all forbidden extra text.
- Use a targeted edit when the predicate and composition are correct but one local texture violates the prompt. Preserve the original candidate and record the edit target.
- A split thumbnail works when copy gets a calm high-contrast zone and the source metaphor remains complete on the other side.

## Anti-Patterns To Carry Forward

- Blank record cards with embossed lines can still read as fake UI or pseudo-documents when there are too many.
- “Code texture” should be abstract blocks when the asset bans readable text; tiny generated code is unnecessary visual noise.
- Do not add a verification color patch unless its location and meaning are explicit.
- Do not accept a clean framework only because the words are correct; order and arrow direction remain hard gates.

## Image-Stock Candidates

- Positive reference candidates: `00-cover.png` for authority-boundary metaphors; `01-authority-ripple.png` for rollback-versus-recovery; `02-review-depth-ladder.png` for operator frameworks.
- Distribution-only reuse: `00-cover-thumbnail.png`.
- Negative references: `00-cover-v1-candidate-b.png` for record-card density; `01-authority-ripple-v1-candidate-a.png` for pseudo-text and unexplained accent drift.
- No asset was silently added to the reusable library; library curation remains a separate decision.

## Backend And Delivery Notes

- Backend: Codex built-in `image_gen`; model/provider name not exposed.
- Generated candidates: seven outputs across cover, thumbnail, body, framework, and one targeted body edit.
- All generated candidate dimensions: 1672 × 941; contact sheet: 1672 × 940.
- Final PNGs remain as project archives; accepted WebPs are in `imgs/web/`.
- Compression: quality 82 for editorial images and quality 80 for the operator diagram.
- No external stock, logo, or documentary source was used.

## Next Article Guidance

Keep the concept-first and exact-text gates. Reuse Field Signal Editorial when the argument concerns authority, evidence, or operational consequence, but change the central material metaphor so the coral gate does not become a repeated trope. Continue validating generated text and semantic arrows independently before promotion.
