# Luminous Tides — QA note

- Duration: 60.024 seconds
- Video: 1920×1080, 30 fps, H.264 + AAC
- Audio: reused `midnight-lo-fi-wave/music.mp3`; no new music generated
- Visual direction: a dark, minimal light field with five coupled neon filaments, low horizon haze, and restrained typography
- Music mapping: smoothed low band widens the woven field; calm energy changes filament thickness; high band changes only the glow/core brightness
- Motion: deterministic frame-driven WebGL. No browser clock, random values, beat-synced shakes, or continuous equalizer motion
- Render backend: Remotion `angle` (the default `swiftshader` backend does not expose the WebGL context needed by this visual)
- Review: inspected on a 5-second contact sheet; the composition remains sparse, contained, and readable through the whole minute
