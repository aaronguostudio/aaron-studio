# AI Video Lab Scorecard

Score every output from 1 to 5.

```text
1 = failed
2 = weak
3 = usable direction
4 = strong
5 = publish-level
```

For `defects`, reverse the intuition:

```text
1 = severe artifacts
3 = visible but tolerable issues
5 = clean output
```

## Fields

- `hook`: first-second stopping power
- `visual_impact`: composition, color, scale, contrast
- `imagination`: freshness and surprise
- `motion`: camera movement and animation quality
- `consistency`: character, object, and style stability
- `shareability`: YouTube Shorts potential
- `defects`: artifact cleanliness

## Required Critique Ending

```text
keep:
change:
next_prompt_variation:
publish_candidate: yes/no
upgrade_candidate: yes/no
```

## Learning Rule

For the next run, change only one major variable:

- Camera path
- Character pose
- Environment scale
- Color palette
- Motion intensity
- Shot count
- Style family
