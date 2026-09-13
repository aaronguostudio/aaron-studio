# V4 full-film QA

Decision: PASS for local author review. This is not author acceptance or publishing approval.

Full film: 8:00.833, 1920×1080 / 30 fps, H.264 + 48 kHz AAC. Master SHA-256: `367a5b04384043cc37985079a4273b1d035fa18fece688354fb584166bc4a06e`.

All five advice chapters have a persistent numbered title and three-topic agenda. Six plates run 2.57–2.90 seconds, with 11.1 seconds of added silence in total. Seven music entries attach to the cover, five chapter plates and closing. The final minute uses one continuous music arc. Voice gain is unity, with no sidechain or master compression; all seven original PCM spans are bit-identical. The accepted articles, script, V3 audio and film match their source locks.

Full AV decode and container/subtitle parsing passed. Encoded mix measures -16.96 LUFS, -3.14 dBTP, LRA 4.40; final-second peak -133.4 dBFS. Exact timing-map checks cover 893 words and 154 subtitle cues. No new ASR is required because the spoken PCM and text are unchanged. Cues are absent throughout chapter plates.

Visual review: all eight contact sheets inspected, covering 87 sequentially decoded frames. Every body scene midpoint and six transition sequences were sampled. No overlap or missing content observed. The brief horizontal mask reveals finish within 0.4 seconds; headers remain stable within chapters. Empty tiles in the final contact sheet are padding, not video frames. The 85.4-second two-transition prototype and a long comparison were also inspected.

Browser: complete V4 loads with no media error, 1920×1080, 480.833333 seconds, readyState 4; customer and closing chapter seeks succeed, and the player is restored to the cover. No horizontal overflow. HTTP byte ranges return 206. Delivery hashes and archive CRC pass. The existing critique/review pages now link to the V4 review.

Limit: these are technical checks and sampled visual inspection, not uninterrupted human watching or listening. Aaron's rhythm/music preference remains pending. V3 remains available for comparison. Nothing was published.

Evidence: `technical-qa.json`, `timing-checks.json`, `cue-audibility.json`, `full-frames/frames.json`, `prototype-review.md`, `source-lock.json`, `encoded-loudness.log`.

Phone review delivery: V4 copied with an identical SHA-256 to iCloud Drive / Aaron-Studio / blog-videos. Foundation reports uploaded=true, uploading=false and no upload error on the final check. Prior V3 cloud file is retained. See `icloud-copy.json`.
