# YouTube Chapters (v3)

These chapters come from the rendered v3 master `video-v3.mp4` (8:32, 512.2 s). The film now opens on a 2.2 s musical lead-in, and the narration starts at 0:02.2.

- Each timestamp is the scene cut that opens the chapter. It is rounded down to the second, or to the nearest second when the cut is within 0.05 s of it.
- The header marker (`LINE 00–11`) changes on the same frame as each cut.
- Every cut was checked against decoded frames on either side (see `video-qa-report.md`).
- The same list applies to `video-v3-nomusic.mp4`, which has an identical picture.
- `youtube-metadata.md` still carries the pre-render estimates. Paste this list in their place at upload time.
- The v1 and v2 lists are kept in `revisions/`.

```
0:00 The meter hit 100%
0:26 What actually changed
1:08 $20 per unit: the bulk discount is gone
1:49 "Five words": the reaction
2:30 My 30-day bill at API list price
3:27 The re-read: where the money goes
4:30 The price that matters: cache reads
5:02 Model beats vendor
5:55 What I'm doing before Oct 29
6:25 What comes next
7:01 Price your own bill in four steps
7:48 A bill I can finally read
```

| Chapter | Cut in master (s) | Narration segment start + lead-in (s) | v2 stamp | Length |
|---|---|---|---|---|
| The meter hit 100% | 0.000 | 0.000 + 2.2 (hook) | 0:00 | 26.3 s |
| What actually changed | 26.266 | 24.046 + 2.2 (slide-01) | 0:24 | 41.9 s |
| $20 per unit: the bulk discount is gone | 68.196 | 65.977 + 2.2 (slide-02) | 1:06 | 41.3 s |
| "Five words": the reaction | 109.511 | 107.291 + 2.2 (slide-03) | 1:47 | 40.8 s |
| My 30-day bill at API list price | 150.352 | 148.131 + 2.2 (slide-04) | 2:28 | 57.5 s |
| The re-read: where the money goes | 207.827 | 205.607 + 2.2 (slide-05) | 3:25 | 62.5 s |
| The price that matters: cache reads | 270.331 | 268.111 + 2.2 (slide-06) | 4:28 | 31.7 s |
| Model beats vendor | 301.990 | 299.769 + 2.2 (slide-07) | 4:59 | 53.6 s |
| What I'm doing before Oct 29 | 355.605 | 353.384 + 2.2 (slide-08) | 5:53 | 30.1 s |
| What comes next | 385.674 | 383.454 + 2.2 (slide-09) | 6:23 | 35.3 s |
| Price your own bill in four steps | 420.983 | 418.763 + 2.2 (slide-10) | 6:58 | 47.4 s |
| A bill I can finally read | 468.422 | 466.202 + 2.2 (slide-11) | 7:46 | 43.8 s |

There are twelve chapters. The first is at 0:00 and the shortest runs 26.3 s (YouTube needs at least 10 s). Every stamp after 0:00 is 2.2 s later than in v2 on the film clock; after rounding to whole seconds that shows as +2 s, or +3 s for Model beats vendor (5:02) and Price your own bill (7:01). The brand end card (8:27–8:32) belongs to the last chapter.
