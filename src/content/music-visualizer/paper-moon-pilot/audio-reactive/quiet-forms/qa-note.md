# Quiet Forms audio-reactive prototype QA

- Source audio: the existing Eleven Music track; no new music was generated.
- Final master: 1920×1080, 30 fps, 45.024 seconds, H.264 video + AAC audio.
- Offline analysis: 1,351 deterministic frames at 30 fps.
- Detected visual chapters:
  - 0.00–8.87s: `Ink Current`
  - 8.87–24.63s: `Paper Resonance`
  - 24.63–36.67s: `Ink Current`
  - 36.67–45.03s: `Soft Relic`
- v2 motion uses calm, smoothed energy envelopes rather than mapping every
  onset directly to geometry. Low-band energy controls a slow breath, while
  spectral flux/onsets are limited to a faint opacity response.
- Ink Current keeps its nodes at stable sizes and lets the line drift slowly;
  Paper Resonance uses a long, gentle bar envelope and a monotonic sweep;
  Soft Relic is one restrained form with a barely perceptible turn and light.
- The audio analysis still includes RMS, low/mid/high-band energy, spectral
  centroid, spectral flux, and a decaying onset pulse, but those features are
  deliberately filtered before they reach the visual geometry.
- Reviewed the full duration with a sequential 1 fps contact sheet and three
  sequential transition windows. No persistent black tile, broken layout,
  clipped typography, or incomplete style transition was observed.
- The overlapping geometry during chapter transitions is intentional: it lets
  the three visual systems hand off through a shared musical state instead of
  appearing as unrelated cuts.
