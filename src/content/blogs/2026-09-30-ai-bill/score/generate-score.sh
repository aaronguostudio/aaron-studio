#!/usr/bin/env bash
# Original Eleven Music score for "OpenAI Halved My $200 Plan. So I Priced My Own AI Bill."
# One composition-plan generation (music_v2), 11 chunks aligned to the paced narration
# timeline (audio-timeline-paced-1.10.json) plus a 5.93 s end-card tail = 510.000 s.
#
# Usage (from repo root):  bash src/content/blogs/2026-09-30-ai-bill/score/generate-score.sh <take-name> [plan.json] [output_format]
# output_format pcm_48000 returns headerless s16le stereo 48 kHz (verified 2026-09-30).
# Writes source/<take>.<ext>, source/<take>.headers.txt, source/<take>.request.json.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(git -C "$HERE" rev-parse --show-toplevel)"
TAKE="${1:?take name required}"
PLAN="${2:-composition-plan.json}"
FORMAT="${3:-pcm_48000}"
KEY="$(grep -E '^ELEVENLABS_API_KEY=' "$ROOT/.env" | head -1 | cut -d= -f2- | tr -d "\"' \r")"
[ -n "$KEY" ] || { echo "ELEVENLABS_API_KEY missing" >&2; exit 1; }

case "$FORMAT" in pcm_*) EXT=pcm ;; mp3_*) EXT=mp3 ;; opus_*) EXT=opus ;; *) EXT=audio ;; esac
OUT="$HERE/source/$TAKE.$EXT"
REQ="$HERE/source/$TAKE.request.json"

python3 - "$HERE/$PLAN" "$REQ" <<'PY'
import json, sys
plan = json.load(open(sys.argv[1]))
json.dump({"composition_plan": plan, "model_id": "music_v2"}, open(sys.argv[2], "w"), indent=2)
PY

STATUS=$(curl -sS -X POST "https://api.elevenlabs.io/v1/music?output_format=$FORMAT" \
  -H "xi-api-key: $KEY" -H "Content-Type: application/json" \
  --data-binary @"$REQ" \
  -D "$HERE/source/$TAKE.headers.txt" -o "$OUT" \
  --max-time 1500 -w "%{http_code}")
echo "HTTP $STATUS -> $OUT ($(wc -c < "$OUT") bytes)"
[ "$STATUS" = "200" ] || { head -c 1200 "$OUT"; echo; exit 2; }
