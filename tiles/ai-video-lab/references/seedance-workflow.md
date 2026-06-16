# Seedance Workflow Notes

## Prompt Split

Use detailed image prompts and short Seedance prompts.

Image prompt owns:
- Character identity
- Scene design
- Composition
- Palette
- Lighting
- Style
- Storyboard order

Seedance prompt owns:
- Action
- Camera movement
- Duration
- Pacing
- Sequence following

## Default Low-Cost Settings

```text
duration: 4
resolution: 480p
ratio: 9:16
generate_audio: false
watermark: false
```

## Upgrade Rule

Upgrade only after a low-cost run scores at least:

```text
hook >= 4
visual_impact >= 4
motion >= 3
defects >= 3
```

Upgrade options:
- 720p
- 8 to 12 seconds
- storyboard grid instead of single frame
- stronger first frame
- generated audio only after the visual direction works

## Failure Diagnosis

If output is weak, record one primary failure:

- Image too generic
- Seedance prompt too verbose
- Camera move too complex
- Character too realistic
- Too many subjects
- Bad hands or faces
- Object deformation
- Style drift
- Motion too static
- Motion too chaotic
