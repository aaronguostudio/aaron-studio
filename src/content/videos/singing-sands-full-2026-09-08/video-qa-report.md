# Full-film QA — review export

Canonical: film.mp4. Duration 201.867 s, 1920×1080, 30 fps, H.264, stereo AAC. File size 63,324,308 bytes. SHA-256 `b58cc9d364689833f4a252f421cae7bc9236e70a3a9c9bf51913a115eac368bb`.

Technical checks passed: complete decode/probe, expected duration, integrated loudness -16.69 LUFS, true peak -4.53 dBTP, loudness range 4.60 LU. Final one-second maximum -91 dBFS, with an intentional fade into silence.

Rendered review: new 60-second science prototype reviewed before full export. Initial prototype exposed a stacking issue hiding the SVG; corrected and rerendered. Final science and scene-boundary contact sheets inspected: visible particle layers, readable captions, no collision with source labels; sieve selection removes out-of-range grains without resizing them. Final return alternates the landscape and labeled macro illustration. Shot-boundary rounding is within one frame. Original pilot opening and closing picture and narration reused.

Browser: initial static server did not support seeking. Replaced with local byte-range server (`serve.py`). Chapter click to 01:10 visibly showed the synchronization chapter and running time 1:10 / 3:21. Playback and chapter navigation work. The displayed whole-second player duration floors the 201.867-second file; review page rounds to 3:22.

Source gates: full script audit PASS; fact/asset/director/storyboard preflight PASS in prototype mode; research-evidence schema PASS; TypeScript and Remotion source audit PASS with unrelated pre-existing warnings. Project-specific scientific scenes remain registered as prototype and are not advertised as a generally validated production template. Repeated-layout and long-hold warnings reflect continuous particle illustrations and quiet photographic returns; actual frame checks are attached under qa/.

Scientific boundaries: original clapping analogy, slow symbolic grain movement, hard-bottom channel redraw, size-selection illustration, and layered-dune hypothesis are labeled. No numerical sound spectra or calibrated physical simulation are claimed. Research theories remain attributed and qualified. NPS recording and photos have provenance; new photo metadata explicitly grants public domain with Kurt Moses credit. No publisher media reused.

Listening: the author approved the pilot voice and direction. The new 138-second continuation uses identical voice settings and passed technical audio checks. Browser playback is a smoke test, not a claim of human listening approval for new lines. New content remains available for author listening. English/Chinese uniformity intentionally deferred at the author's request. No publishing performed.
