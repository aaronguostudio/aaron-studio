#!/usr/bin/env bash
set -euo pipefail

# Run from the repository root. Veo Lite produces eight-second 1080p source
# clips with native audio; this assembly ignores that audio and uses the
# approved 600-second Lyria master.
#
# Lite's first/last-frame adherence is not perfectly frame-identical. Before
# repetition, each clip spends its last 0.75 seconds dissolving to a held copy
# of its own first frame. The next repetition then begins on that same frame,
# avoiding a hard water/reflection reset without adding busy motion.

ROOT="$(pwd)"
BASE="$ROOT/src/content/music-visualizer/material-ritual-full-v1"
VEO="$BASE/veo-3.1-lite"
TMP="$BASE/render-tmp-veo-lite"
OUT="$BASE/material-ritual-glass-and-water-10min-1080p.mp4"
mkdir -p "$TMP"

for chapter in 01 02 03; do
  case "$chapter" in
    01) source="$VEO/chapter-01/retry-loop-locked-1080p.mp4" ;;
    02) source="$VEO/chapter-02/output-1080p.mp4" ;;
    03) source="$VEO/chapter-03/output-1080p.mp4" ;;
  esac
  repaired="$TMP/chapter-$chapter-seam-repaired-8s.mp4"

  ffmpeg -y -hide_banner \
    -i "$source" \
    -filter_complex "[0:v]trim=start=0:end=7.25,setpts=PTS-STARTPTS,format=yuv420p[body];[0:v]trim=start=7.25:end=8,setpts=PTS-STARTPTS,format=yuv420p[tail];[0:v]trim=start=0:end=0.041667,setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration=0.708333,format=yuv420p[hold];[tail][hold]xfade=transition=fade:duration=0.75:offset=0[repair];[body][repair]concat=n=2:v=1:a=0,format=yuv420p[v]" \
    -map "[v]" -an -r 24 -c:v libx264 -preset slow -crf 15 -movflags +faststart \
    "$repaired"

  ffmpeg -y -hide_banner \
    -stream_loop -1 -i "$repaired" \
    -filter_complex "[0:v]trim=duration=202,setpts=PTS-STARTPTS,format=yuv420p[v]" \
    -map "[v]" -an -r 24 -c:v libx264 -preset slow -crf 15 -movflags +faststart \
    "$TMP/chapter-$chapter-202s.mp4"
done

ffmpeg -y -hide_banner \
  -i "$TMP/chapter-01-202s.mp4" \
  -i "$TMP/chapter-02-202s.mp4" \
  -i "$TMP/chapter-03-202s.mp4" \
  -filter_complex "[0:v][1:v]xfade=transition=fade:duration=3:offset=199[x1];[x1][2:v]xfade=transition=fade:duration=3:offset=398,format=yuv420p[v]" \
  -map "[v]" -an -r 24 -c:v libx264 -preset slow -crf 15 -movflags +faststart \
  "$TMP/visual-600s.mp4"

ffmpeg -y -hide_banner \
  -i "$TMP/visual-600s.mp4" \
  -i "$BASE/music/master-600s-normalized.m4a" \
  -map 0:v:0 -map 1:a:0 -t 600 \
  -c:v copy -c:a copy -movflags +faststart \
  "$OUT"

echo "Rendered $OUT"
