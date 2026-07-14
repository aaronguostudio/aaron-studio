#!/usr/bin/env bash
set -euo pipefail

# Run from the repository root after all three 1080p strict loops exist.
ROOT="$(pwd)"
BASE="$ROOT/src/content/music-visualizer/field-studies-full-v1"
TMP="$BASE/render-tmp"
OUT="$BASE/field-studies-rain-harbor-10min-1080p.mp4"
mkdir -p "$TMP"

for chapter in 01 02 03; do
  ffmpeg -y -hide_banner \
    -stream_loop -1 -i "$BASE/seedance/chapter-$chapter/final-1080p/output.mp4" \
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
