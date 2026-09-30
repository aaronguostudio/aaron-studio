# Director memo: Receipt Ledger Editorial

The film is the bill. It inherits `ledger-editorial-v1` (porcelain field, serif claims, mono rows that append and are never erased, the AARON GUO header with an appending chapter marker, phrase captions, a quiet end card) and swaps the ledger's session log for a receipt: chapters read `LINE 00–11`, and every key number is a typeset receipt row with a dotted leader.

**Frame zero** is the approved receipt cover with the title, the one-line promise ("One heavy user's 30-day AI coding bill, priced line by line at API list.") and `AARON GUO · AI-NATIVE BUILDER` already on screen. The meter row appends at 0.6 s and the cover breathes with a 1.8% scale. Narration starts at frame zero because the locked 557.85 s master must stay aligned to its word timeline.

**One accent, one meaning.** Receipt amber (#D2701C, the charts' own accent) means cache reads, the re-read, and nothing else: the cache-read column, the overflowing line, "re-reading it", "cheaper cache reads", "for me: the re-read". The lost $10 discount, the capped meter and "cut in half" are carried in ink: strikes, boxes, bold and stamps. The two charts whose orange means something else (weekly meter, model-vs-vendor repricing) appear desaturated as graphite exhibits with a label saying why. The bill-by-model chart stays in colour because its amber already means cache reads.

**The spine, beat by beat.** Meter, then the email (20× struck to 10×), then an unlabeled amber row: "the expensive part wasn't what I expected." The plan terms as rows. Tibo's exact excerpt with attribution. "The unit is now the API dollar." The price list rebuilt as a table where every tier resolves to $20 per 1×, and the old $10 row is struck. The Hacker News "Five words." quote, exact and attributed. One X user's $14k / $7k / $8k estimate with an UNVERIFIED stamp. Aaron's setup, the two totals (≈ $9,400 vs ≈ $3,600), the meter exhibit, the two caveats. Then the **signature**: the same receipt splits into four line items, output is boxed as the expected cost and resolves to a small slice, and the CACHE READS row turns amber and its bar runs off the paper to the frame edge (the cover, made literal) while 78 / 76 / 58% append. The agent loop draws node by node with an amber return arc. ≈ 17 billion tokens. The earlier Astra post as a framed callback. The cache-read price table with a 5× bracket. The verdict, the bill exhibit, "It wasn't the vendor. It was the model.", the repricing exhibit, OpenAI's bet (UNTESTED stamp). Three moves, three guesses (labeled inferences), the four-step walkthrough with one worked multiplication, three habits. The meter returns: "What was 100% worth?" Two closing statements. Then the cover returns and the last three sentences land verbatim, with captions and chrome stepped back. The final line holds for about 1.15 s, and the brand end card follows.

**Honesty labels.** Every personal number carries "API LIST PRICE, NOT WHAT I PAID · ONE MACHINE". Codex figures are the Pro account only. Community numbers are one X user's estimate. Forecasts are "MY INFERENCES". The Sol question is "UNTESTED · A HYPOTHESIS".

**Explicit exclusions.** No file paths, account IDs, client or project names, or second Codex account anywhere on screen. The step-01 walkthrough names folders only in words. The OpenAI email screenshot (a private account artifact) is not shown. There is no fake UI, terminal collage or dashboard chrome, no generated video, no semantic sprite (budget 0), and no music bed in the master (see `asset-decision-log.md`). The legacy SlideshowVideo renderer is not used.

**Composition:** `tiles/aaron-video-gen/remotion/src/projects/ai-subscription-cloud-bill/index.tsx` (entry with `registerRoot`, composition `AiBillFilm`, 1920×1080 at 30 fps, 565.0 s). `build-data.py` derives scene cuts, cue times and phrase captions from `audio-timeline-retimed-1.05.json`, and `prepare-package.py` writes the director plan, storyboard and asset plan from the same spec.

## v2 addendum (2026-09-30)

- **Cold open:** the cover-hero becomes a 3D desk in the same palette. At frame 0 the title, promise and AARON GUO · AI-NATIVE BUILDER sit over it. The sequence then runs:
  - graphite meter bars reach the dashed 100% line five times out of six;
  - the email line appears and strikes 20× to 10×;
  - the printer feeds the bill, grey item and price pairs line by line;
  - the one amber line prints and keeps running right, off the paper, across the desk and out of frame.
  Amber still means only the re-read.
- **The re-read (signature):** the agent loop made physical.
  - The repo-context stack is labeled.
  - A thin page arrives on "call a tool" and another on "read the result"; THINK and GO AGAIN are listed at the right.
  - On "And every turn, it re-reads the conversation so far" an amber beam scans the whole stack bottom to top. Each later turn adds pages, so each sweep lasts a little longer.
  - "But the volume is enormous" starts the time-lapse and the camera rises.
  - "≈ 17 billion tokens re-read from cache" (the one real number, labeled one machine) lands beside the grown stack.
  - The turn counter and "pages re-read so far" are the scene's own conceptual counts.
- **Sound:** the voice at unity, with the original score about 20 LU under it throughout. The score thins into the final line and is gone by the end card.
- **Code:** `ledger-3d.tsx` (3D and overlays) in the same project. The composition is still `AiBillFilm`; the reviewed slice was `AiBill3DPrototype`.

## v3 addendum (2026-09-30)

- **The opening breathes.** For 2.2 s there is only the cover-hero and the score. The camera drifts slowly toward the meter and the printer's status light pulses.
- **Then the voice:** "Five times in September…". The meter bars begin filling 0.6 s later.
- **Everything after** is the approved v2 film on a clock shifted by 2.2 s.
- **Small fix:** the title and email text blocks no longer overlap at about 9.9 s.
