# Image Generation Manifest: FDE Workflow 3

## Run

- Article: `why-ai-companies-are-becoming-deployment-companies.md`
- Generated on: 2026-07-10
- Backend: built-in imagegen
- Model or provider when known: Codex built-in image generation
- Cohesion model: Controlled Mix
- Selected concept route: A. Dead-End Meter, refined with Field Signal Editorial paper/print language
- Selected style families: Field Signal Editorial, Cutaway System Map, Executive Evidence Brief, Infographic Editorial

## Assets

| Asset | Role | Prompt file | Candidate(s) | Selected | Why selected | Rejected failure | Stock candidate |
|---|---|---|---|---|---|---|---|
| 00-cover-v7 | cover | prompts/v7-cover-final.md | candidate-a, candidate-b; plus three concept probes | candidate-b | Strongest editorial tension and clearest human correction without becoming a process diagram. | candidate-a was clearer but more diagrammatic; probes B/C weakened the title connection. | yes |
| 00-cover-thumbnail-v7 | thumbnail | prompts/v7-thumbnail-final.md | candidate-a, candidate-b | candidate-b | More visual area, cleaner condensed typography, exact text, strong mobile contrast. | candidate-a made the type dominate too heavily. | no |
| 01-task-passed-workflow-failed-v7 | body | prompts/v7-01-task-workflow.md | one accepted candidate | selected | Quiet, concrete, and clearly different from the cover. | none | yes |
| 02-human-backpropagation-v7 | archive | prompts/v7-02-human-backprop.md | one accepted candidate | replaced by v8 | Semantically correct, but too academic after the prose moved to a concrete Palantir field-work example. | three-zone abstraction | yes |
| 02-fde-field-loop-v8 | mechanism | prompts/v8-02-fde-field-loop-candidate-a.md; prompts/v8-02-fde-field-loop-candidate-b.md | tactile workbench A, operational field collage B | candidate-b | The factory, two active operators, disruption, governed route, and product workbench explain FDE work in five seconds. | candidate-a was clear but still felt like a designed process surface rather than work in the field. | yes |
| 03-fde-role-comparison-v8 | comparison | prompts/v8-03-consulting-fde-candidate-a.md; prompts/v8-03-consulting-fde-candidate-b.md | neighboring workbenches A, map-to-engine journey B | candidate-b | The planning map, blueprint handoff, embedded production work, and feedback belt tell one complementary story without a versus device. | candidate-a was vivid but divided the roles into two more separate visual camps. | yes |
| 03-four-outputs-compound-v7 | editorial cut / archive | prompts/v7-03-four-outputs.md | candidate-a plus regenerated final | regenerated final, not inserted | Four exact labels and no extra copy; later removed because the checklist competed with ACTOR. | candidate-a added unrequested headers and object text. | yes |
| 04-actor-deployment-test-v7 | framework | prompts/v7-04-actor.md | candidate-a plus regenerated final | regenerated final | Correct A -> C -> T -> O -> R -> A path and exact labels. | candidate-a routed T directly toward R and made O a disconnected feeder. | yes |
| 05-input-to-operating-capacity-v7 | archive | prompts/v7-05-value-unit.md | one accepted candidate | replaced by v8 | Quiet and coherent, but the check-card and lever did not express customer ownership strongly enough. | weak ownership signal | yes |
| 05-token-to-owned-workflow-v8 | closing | prompts/v8-05-token-owned-workflow-candidate-a.md; prompts/v8-05-token-owned-workflow-candidate-b.md | keyed workflow press A, top-down control table B | candidate-a | The orange input, brass customer key, rule plates, green action route, and cyan return make ownership and conversion immediate. | candidate-b explained more but felt closer to a workflow infographic. | yes |

## Provenance Notes

- All v7 and v8 assets are newly generated for this rewrite.
- V8 generation used the Codex built-in backend on 2026-07-10; outputs were 1672x941 and copied into the project before compression.
- Existing v1-v6 image sets and style probes remain untouched.
- No generated image is documentary evidence. Company announcements remain linked in the article text.
- No external reference image is used in the initial generation pass.

## Integrity

- Every accepted asset has a prompt or source record: yes
- Existing final assets were preserved or versioned: yes
- Cover concepts were compared before style lock: yes
- Accepted images passed visual critique: yes
