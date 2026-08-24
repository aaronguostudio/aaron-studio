# Personal Proof: Validation-Loop Timing on the Blog Publishing Gate

**Executed:** 2026-08-24, ~16:45–17:05 America/Edmonton, by Claude on Aaron's machine.
**Plan:** the bounded observation specified in [source-intake.md](source-intake.md) (Candidate A).
**Result:** interpretable. No stop condition triggered.

## Subject

- **Command:** `pnpm run build` in the aaronguoblog repo (Nuxt 3). This is the literal publishing-gate command in `blog-production` ("verify the blog repo build passes"). It runs `npm rebuild better-sqlite3` as a mandatory prebuild, then `nuxt build`.
- **Smallest unit gated:** any publishable change — editing one post still requires the full build to verify.
- **Repo state:** branch `codex/document-visual-language-rc` with uncommitted WIP. The build passes in this state.
- **Machine:** Apple M5 Max, 18 cores, 128 GB RAM, macOS (Darwin 25.6.0). Node v22.22.3 + pnpm 11.2.2 (note: repo's volta pins node 24.13.1; the measuring shell was not volta-active).
- **Ambient conditions:** Aaron's unrelated dev processes (erp-platform-v2 `nuxt dev`) ran throughout; load averages 2.6–8.6 across the session. Both comparison phases faced similar ambient load.

## Method

All runs executed in APFS clones (`cp -cR`, 8.6 s per clone) under the session scratchpad — **not** in the real working copy, because the real repo's `.output/` was being served by a live preview process (port 3050) at experiment time. Building in place would have swapped artifacts under a running consumer.

- Warm ×5: back-to-back builds, no cache clearing.
- Cold-ish ×5: `rm -rf .nuxt .output node_modules/.cache` before each run; `node_modules` kept installed.
- Sequential pair: build clone A, then clone B (both leveled warm).
- Concurrent pair: build clone A and clone B simultaneously.
- Network check: pnpm reported `downloaded 0` in every run — the command is local; no network dominance.

## Data

| Series | Runs (wall seconds) | Mean | Outcome |
| --- | --- | --- | --- |
| Warm | 39.61, 39.34, 39.57, 40.02, 39.93 | 39.7 | 5/5 pass, spread 0.7 s |
| Cold-ish | 41.51, 43.35, 43.52, 43.76, 42.08 | 42.8 | 5/5 pass |
| Sequential pair | 41.92 + 43.92 | — | **86 s wall for 2 results** |
| Concurrent pair | 55.66 ∥ 56.07 | — | **56 s wall for 2 results; each attempt +33% latency** |

Supporting observations:

- **CPU per build:** ~104 s user + ~23 s sys ≈ 127 CPU-seconds over ~40 s wall → each build averages only ~3 of 18 cores.
- **Concurrent aggregate:** ~4.5 cores average during the concurrent pair — the machine was mostly idle while per-attempt latency degraded 33%. Contention came from serial build phases and I/O/memory, not core exhaustion.
- **Output equivalence:** both concurrent builds exited 0 with identical reported output size (70.2 MB, 29.1 MB gzip). Results stayed interpretable under parallelism.
- **Path sensitivity:** first build of a clone in a new path ran 46.9 s despite warm caches copied from the other path — some caching is path-keyed; minor effect.

## Findings (bottleneck classification per the plan)

1. **Command duration dominates and is flat.** Cold ≈ warm + ~3 s. Caching recovers almost nothing; every attempt pays ~40 s regardless of history.
2. **One working copy is one validation lane, by construction.** Concurrent builds share `.nuxt`/`.output`, and the real repo's `.output` had a live consumer. Parallel attempts against a single checkout are structurally unsafe, not merely discouraged. Safe parallelism required deliberately provisioning isolated copies (8.6 s per APFS clone).
3. **Isolation does not remove contention.** At just 2× parallelism on an 18-core machine, per-attempt latency rose 42 s → 56 s (+33%) while total core utilization stayed near 4.5/18.
4. **Throughput vs latency tradeoff is sublinear.** Two results took 56 s concurrent vs 86 s sequential — a 1.54× speedup, not 2×, purchased with a slower loop for every individual attempt.

## Anomaly log

- One build in an early (mis-instrumented) cold series was killed early with exit 137 (SIGKILL), cause unattributed; it did not reproduce across the remaining runs. Total: 1 kill in 19 builds. The first cold series (4 passes + the kill) produced no timing data due to an instrumentation error; the instrumented cold series above is a full rerun.

## Boundary

This is one command, one repo, one machine, on one afternoon with ambient load — an illustration of a local feedback loop, not a market benchmark. It does not establish a universal agent-count multiplier or a prescribed CI/type-check target. Rerun commands: clone the repo with `cp -cR`, then `/usr/bin/time -p pnpm run build`, clearing `.nuxt .output node_modules/.cache` for cold runs.
