# Animation improvement plans

| #   | Plan                                                                                                           | Severity | Status | Dependency |
| --- | -------------------------------------------------------------------------------------------------------------- | -------- | ------ | ---------- |
| 001 | [Animate the no-harness vs harness output comparison](001-animate-harness-output-comparison.md)                | HIGH     | DONE   | None       |
| 002 | [Deepen the harness comparison into an evidence-led documentary](002-deepen-harness-comparison-documentary.md) | HIGH     | DONE   | None       |
| 003 | [Rebuild the harness comparison as a kinetic paired stage](003-rebuild-harness-as-kinetic-paired-stage.md)      | HIGH     | DONE   | Supersedes 001/002 comparison UI |
| 004 | [Rebuild the Harness comparison as a 3D mission](004-rebuild-harness-as-3d-mission-control.md)                  | HIGH     | DONE   | Supersedes 003 comparison UI and metaphor |
| 005 | [Turn the Harness comparison into one Starship-class mission](005-rebuild-harness-as-starship-mission.md)       | HIGH     | DONE   | Supersedes 004 scene metaphor and choreography |

## Recommended execution order

1. Plan 001 established the synchronized two-lane comparison.
2. Plan 002 expanded that comparison into a research-backed, 12-chapter documentary
   with evidence provenance.
3. Plan 003 supersedes the earlier comparison UI with two persistent kinetic
   canvases and five stage-specific causal animations. Execute it against the
   current five-stage version.
4. Plan 004 supersedes Plan 003's system-box metaphor and CSS stage. It replaces
   both with one self-contained Three.js mission scene whose five physical events
   explain coordinates, permission, integration, recovery, and verification.
5. Plan 005 retains Plan 004's offline controller and accessibility architecture,
   but replaces its five generic dioramas with one continuous Starship-inspired
   launch mission. It reframes recovery as `NO-GO → DIVERT` rather than physical
   checkpoint rollback.

Plan 003 reuses the existing research, phase copy, and image assets, but it does not
depend on retaining the filmstrip or documentary markup from Plans 001 and 002.
Plan 004 retains the research, source registry, controls, and accessible narration,
but deliberately deletes Plan 003's target card, system-box imagery, kinetic lanes,
keyframes, and host-owned phase timers.
Plan 005 retains Plan 004's controller API, local Three.js runtime, controls,
responsive layout, and fallback contract. It supersedes the scene factories,
timeline choreography, animation copy, and recovery metaphor.
