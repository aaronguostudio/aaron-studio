# QA Factory Prototype — Video QA

Status: PASS for prototype review

## Delivery

- File: `render/qa-factory-prototype-9x16.mp4`
- SHA-256: `08455c895a0d1d2b840eb84283515ff451bd3425d82e25dccdccae4630892c54`
- Canvas: 1080 × 1920 (9:16)
- Video: H.264, 30 fps, 240 decoded frames, 8.000 s picture duration
- Audio: AAC, 48 kHz, stereo
- Container duration: 8.043 s (AAC encoder padding)

## Automated checks

- Full audio/video decode: PASS, zero reported errors
- TypeScript typecheck: PASS
- Planning preflight: PASS in prototype mode
- Integrated loudness: -16.00 LUFS
- True peak: -3.74 dBTP
- Loudness range: 4.90 LU
- Designed silence: 4.966–8.043 s after the trapdoor clunk

## Visual review

- Entry, scan, pass stamp, human intervention, trapdoor fall, `NOPE` afterbeat, and loop entry were inspected from the encoded MP4.
- The action remains inside one continuous miniature factory space.
- The real prior video remains visible as the product under review.
- The paper hand was reduced and shifted right so the pass-to-rejection handoff stays readable.
- `NOPE` is unobstructed after the product clears the trapdoor.
- Contact sheet: `render/qa-contact-sheet.png`
- Lever/fall sequence: `render/qa-action-strip.png`

## Human review required

- The runtime cannot audition sound by ear. Timing, decode, silence, loudness, and peaks pass, but music/foley taste still needs a human listen.
- This is deliberately an experimental custom-signature prototype; approval here decides whether the format merits a longer short or repeatable series.
