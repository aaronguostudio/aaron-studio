# Music and Visual Direction

## Direction map

| Music profile | Theme | Motion language |
|---|---|---|
| Felt upright piano, sparse, warm, intimate | `paper-moon` | cream paper, ink discs, moon phases, soft shadows |
| Low-register piano, nocturnal ambient, long reverb | `deep-ink` | dark field, warm highlights, slow depth rotation |
| Cool piano, reflective pads, open space | `soft-slate` | blue-grey paper, thin rings, restrained orbit |

The visualizer should react to musical chapters rather than every transient.
Use four broad phases: arrival, settling, opening, and release. Let phase changes
alter orbit angle, disc fill, depth, or accent opacity; do not turn the video
into a constant waveform.

## Eleven Music prompt pattern

Use descriptive attributes instead of artist or song names:

```text
Instrumental only. Minimalist felt upright piano, intimate close-miked recording,
sparse repeating motif, gentle rubato, soft pedal noise, warm room ambience,
quietly satisfying and hypnotic, low dynamic range, spacious pauses, suitable for
deep work and reading. No vocals, no drums, no abrupt climax, no trailer impacts,
no bright arpeggios, no dramatic key change.
```

For a longer piece, specify a calm structure:

```text
Structure: 20-second opening, a 3-minute piano theme, a small harmonic variation,
one gentle lift without percussion, then a slow unresolved outro.
```

Generate several candidates, select by listening rather than by prompt wording,
and keep the prompt plus model metadata in the generation manifest.

## Motion constraints

- 30 fps, 1920×1080 for the long-form master;
- 1080×1920 is a later crop/variant, not the primary layout;
- first meaningful change within 1–2 seconds;
- no hard cuts inside a quiet piano phrase;
- use frame-driven `interpolate`, easing, and seeded layout values;
- keep title and metadata stable so the viewer can work without distraction;
- end with a long, quiet fade rather than a logo sting.

## Originality and rights

Use the reference video to study restraint, spacing, and pacing. Do not use its
audio, artwork, title treatment, or melody. For commercial output, keep evidence
of the paid music-generation plan and the exact prompt/model used.
