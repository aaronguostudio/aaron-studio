# Next Formats — Full Version Production Status

Updated: 2026-07-14

## Locked creative decisions

- Deliver four 10-minute, native 1080p masters: Field Studies, Slow Cinema
  World, Material Ritual and Architectural Listening Room.
- Each master uses three 202-second visual chapters and two three-second visual
  dissolves. The camera remains locked in every generated-video loop.
- Do not upscale 720p material to claim 4K or 1080p.
- Lyria music uses four independent Pro sections, six-second equal-power audio
  crossfades, and an eight-second final fade.

## Finished and passed

- All twelve final anchor frames are saved inside their respective project
  folders.
- The original sample chapter remains the approved first chapter for each
  format.
- The chapter-two 720p strict-loop prototypes completed and passed contact-sheet
  review for all four projects. Their movement is restrained and consistent;
  no obvious jump or unwanted camera motion was observed.
- 10-minute Lyria audio masters are complete, normalized, and checked for the
  first three projects:
  - `field-studies-full-v1/music/master-600s-normalized.m4a`
  - `slow-cinema-world-full-v1/music/master-600s-normalized.m4a`
  - `material-ritual-full-v1/music/master-600s-normalized.m4a`
- The three completed masters have a verified peak of approximately -1.4 to
  -1.5 dB and no detected silent interval longer than two seconds.
- **Field Studies — Rain Harbor** is now complete as a native 1080p, 10-minute
  H.264 master. Its three direct 1080p Seedance loops were generated after the
  Ark account recharge and reviewed with source contact sheets plus a final
  timeline contact sheet. See `field-studies-full-v1/qa-summary.md`.
- **Material Ritual — Glass and Water** is now complete as a native 1080p,
  10-minute H.264 master. It uses three Veo 3.1 Lite source loops, a
  first-frame seam-repair treatment for calm repetition, and the completed
  Lyria master. See `material-ritual-full-v1/qa-summary.md`.

## Provider notes

Seedance requests previously returned `403 AccountOverdueError` before the Ark
account recharge. Field Studies subsequently completed with three direct 1080p
Seedance loops. Slow Cinema World and Architectural Listening Room still need
their remaining production loops; their approved anchors and prompts are
already stored.

Lyria intermittently returned an unspecified 400 policy block for the
Architectural Listening Room after it successfully created section 01. Keep
using the simple `section-0N-alt` prompt variants when retrying it; do not
substitute a repeated short clip.

## Remaining production sequence

1. Generate the remaining native 1080p strict loops for Slow Cinema World and
   Architectural Listening Room. Direct 1080p production is now an acceptable
   path when the anchor frame is already approved.
2. Generate Architectural Listening Room music sections 02–04 and stitch its
   600-second master.
3. For each remaining project, loop every 15-second chapter to 202 seconds, assemble the
   600-second three-chapter video with two three-second dissolves, mux the
   normalized audio master, and generate a final contact sheet plus a seam
   preview at every chapter boundary.
4. Verify duration, frame dimensions, audio start/end, maximum peak, and
   visual movement at the chapter boundaries. Do not upload; upload remains a
   separate explicit action.
