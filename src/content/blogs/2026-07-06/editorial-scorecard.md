# Editorial Scorecard: FDE Workflow 3 Rewrite

## Editorial Contract

- **Reader:** Senior engineers, technical/product leaders, and operators accountable for enterprise AI outcomes.
- **Reader's job to be done:** Decide whether an AI initiative is becoming a durable operating capability and identify the missing deployment layer.
- **One-sentence promise:** Explain why AI platforms are building FDE organizations, reveal FDE as a human backpropagation layer, and make the diagnosis usable through ACTOR.
- **Opening scene or bottleneck:** Four major AI platforms converge on the same FDE-style organizational move, revealing a deployment gap around the model.
- **Original contribution:** Explain FDE through a real operating decision, then argue that customer-owned workflows and product write-back determine whether the model creates value.
- **Scope boundary:** No PE analysis, no claim that FDE replaces consulting, no assumption that vendor announcements prove customer ROI.
- **Success hypothesis:** Naming FDE and the four-company convergence immediately should improve early relevance; the later v1-to-v2 workflow example should make human backpropagation concrete without carrying the market argument.

## Score

| Dimension | Weight | Score | Evidence in the draft | Required change |
|---|---:|---:|---|---|
| Hook earns attention and title | 10 | 10 | The article names FDE in its first sentence, identifies the four-company convergence, and states the deployment gap before introducing supporting detail. | None. |
| Thesis is specific, original, and arguable | 15 | 14 | The first section argues that the model is not the complete enterprise product and FDE is a human backpropagation layer. A reader can dispute that interpretation. | Keep the inference boundary explicit in future excerpts. |
| Mechanism explains why | 15 | 15 | The supply-disruption example shows how an FDE connects fragmented systems, models decisions and actions, adds governance, observes exceptions, and returns repeated failures to product. | None. |
| Evidence is primary, sufficient, and honest | 15 | 14 | Five primary sources support the company commitments and Palantir's field-to-product methodology. Vendor claims and the $7.5B accounting caveat are labeled. | Add independent outcome evidence in a future follow-up when these organizations have operating history. |
| Aaron's operator judgment is visible | 10 | 10 | The draft distinguishes fast generation from high-participation workflow ownership, shows how v1-to-v2 judgments became reusable gates, and adds the token/value distinction without introducing a second framework beside ACTOR. | None. |
| Counterargument changes or sharpens the claim | 10 | 9 | Services economics, consulting overlap, one-off customization, vendor incentives, and lock-in narrow the conditions under which FDE is distinct. | A later article could test these conditions against a completed customer engagement. |
| Reader leaves with a usable decision or framework | 15 | 15 | ACTOR is applied to this article itself, including a real Recursive change made from reader feedback. | None. |
| Structure is compressed and every section earns its place | 10 | 10 | The rewrite is roughly 1,700 English words across seven H2 sections. Economics and career implications are folded into the sections that cause them, and ACTOR is the only executable framework. | None. |

Final score: 97/100

## Revision Delta

### Added

- Direct FDE and four-company opening.
- Five-minute article myth and the v1-to-v2 workflow mechanism.
- A concrete supply-disruption example for human backpropagation.
- $7.5B scale signal with careful claim boundaries.
- A concise distinction between custom services and a learning deployment model.

### Cut

- Karp/Reddit personality framing.
- Long company-by-company news recap.
- Apollo 13 internal link to an unpublished target.
- The 404 anecdote as the article's opening and closing device.
- Separate economics and career sections.
- The academic three-loop table.

### Reframed

- FDE from a role description into feedback architecture.
- Consulting comparison from job stereotypes into what compounds after the engagement.
- ACTOR `Recursive` from maintenance ownership into organizational learning.

### Intentionally Kept

- Title: `Expensive Tokens Won't Save Enterprise AI`.
- No internal link forced into the compressed draft.
- Balanced treatment of consulting, systems integration, and lock-in.

## Production Locks

- **Argument Lock: PASS**
  - Evidence: Claim ledger passed; thesis, supply-disruption mechanism, consulting counterargument, customer-ownership implication, and ACTOR are stable.
  - Caveat: The $7.5B figure remains a scale signal across different commitment categories, not a like-for-like spending measure.
- **Article Lock: PASS**
  - Evidence: English and Chinese sibling editions passed their prose gates at 100/100; seven-section structure, title, conclusion, and six article-image positions are stable.
  - Stale downstream assets: Existing `youtube-script.md`, audio, and `video.mp4` predate the locked article and require regeneration before reuse.
- **Package Lock: PASS for local blog preview**
  - Evidence: Post 28 was updated in place; 20 Markdown links and 44 blog routes passed; both language pages rendered with six images, no horizontal overflow, and no console errors at `localhost:6001`.
  - External publishing authorized: no push or external distribution performed.

## Gate

Pass at 85/100 or higher, with no dimension below 70% of its weight. A passing score does not override factual, link, or image failures.

Decision: PASS
