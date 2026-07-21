# Signal Loom — 60-second candidate QA

## Result

Passes the prototype motion and technical gates. It remains a candidate pending
Aaron's listening pass and music-rights verification.

## Technical verification

- Master: `ambient-signal-focus-60s-1080p.mp4`
- Video: H.264, 1920×1080, 30 fps, 1800 decoded frames, 60.000 seconds.
- Audio: AAC, stereo, 48 kHz, 60.000 seconds.
- Programme loudness: −14.39 LUFS integrated; −1.38 dBTP true peak; 4.30 LU LRA.
- Black-frame scan: no black interval detected at the configured threshold.
- Render hygiene: no temporary `.render.mp4` remains beside the master.

## Visual review

- Reviewed frame 0, frame 45 (1.5 seconds), frame 899, and frame 1799.
- Reviewed the four-frame mobile contact sheet and the sequential 28–34 second
  window.
- The first meaningful change is visible within 1.5 seconds.
- Route points and structural drift remain smooth and deterministic.
- Audio affects light, route clarity, and material pressure; it does not move,
  scale, shake, or re-layout the architecture.
- No clipping, broken layout, unexpected flash, mechanical jitter, or beat-led
  camera motion was observed.

## Review assets

- `contact-sheet.jpg`
- `qa/sequential-28-34.jpg`
- `entry.png`
- `first-change.png`
- `midpoint.png`
- `release.png`

## Remaining gate

Listen on headphones and small speakers. Reject or revise if the music feels
too forward for coding, if the light response becomes consciously beat-readable,
or if the 60-second visual cycle becomes predictable before the music releases.
