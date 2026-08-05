#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../../../../.." && pwd)"
MUSIC_SOURCE="$REPO_ROOT/src/content/shorts/human-review-required-001/audio/music-selected.m4a"

# Foley is synthesized from deterministic oscillators/noise. No external sound
# libraries or third-party samples are used.
ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "sine=frequency=1040:duration=0.075:sample_rate=48000" \
  -f lavfi -i "sine=frequency=1480:duration=0.065:sample_rate=48000" \
  -filter_complex \
  "[0:a]afade=t=out:st=0.045:d=0.030,volume=-13dB[a0]; \
   [1:a]afade=t=out:st=0.035:d=0.030,adelay=90|90,volume=-15dB[a1]; \
   [a0][a1]amix=inputs=2:duration=longest:dropout_transition=0:normalize=0, \
   aresample=48000,aformat=sample_fmts=s32:channel_layouts=stereo" \
  -c:a pcm_s24le "$SCRIPT_DIR/foley-scan.wav"

ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "anoisesrc=color=brown:duration=0.18:sample_rate=48000:amplitude=0.55:seed=2104" \
  -f lavfi -i "sine=frequency=105:duration=0.18:sample_rate=48000" \
  -filter_complex \
  "[0:a]highpass=f=70,lowpass=f=1500,afade=t=out:st=0.025:d=0.155,volume=-8dB[n]; \
   [1:a]afade=t=out:st=0.015:d=0.165,volume=-10dB[t]; \
   [n][t]amix=inputs=2:duration=longest:dropout_transition=0:normalize=0, \
   aresample=48000,aformat=sample_fmts=s32:channel_layouts=stereo" \
  -c:a pcm_s24le "$SCRIPT_DIR/foley-stamp.wav"

ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "anoisesrc=color=brown:duration=0.32:sample_rate=48000:amplitude=0.62:seed=4610" \
  -f lavfi -i "sine=frequency=68:duration=0.32:sample_rate=48000" \
  -f lavfi -i "sine=frequency=215:duration=0.14:sample_rate=48000" \
  -filter_complex \
  "[0:a]highpass=f=45,lowpass=f=900,afade=t=out:st=0.025:d=0.295,volume=-7dB[n]; \
   [1:a]afade=t=out:st=0.018:d=0.302,volume=-8dB[lo]; \
   [2:a]afade=t=out:st=0.012:d=0.128,volume=-15dB[hi]; \
   [n][lo][hi]amix=inputs=3:duration=longest:dropout_transition=0:normalize=0, \
   aresample=48000,aformat=sample_fmts=s32:channel_layouts=stereo" \
  -c:a pcm_s24le "$SCRIPT_DIR/foley-clunk.wav"

# The source excerpt is intentionally steady and self-assured. The sample-level
# trim at 4.600s is the joke: there is no musical fade. The trap-door clunk lands
# on the same boundary, then decays into digital silence.
ffmpeg -hide_banner -loglevel error -y \
  -i "$MUSIC_SOURCE" \
  -i "$SCRIPT_DIR/foley-scan.wav" \
  -i "$SCRIPT_DIR/foley-stamp.wav" \
  -i "$SCRIPT_DIR/foley-clunk.wav" \
  -filter_complex \
  "[0:a]atrim=start=15.000:end=19.600,asetpts=PTS-STARTPTS,aresample=48000,volume=3dB,apad=pad_dur=3.4[music]; \
   [1:a]adelay=700|700[scan]; \
   [2:a]adelay=3150|3150[stamp]; \
   [3:a]adelay=4600|4600[clunk]; \
   [music][scan][stamp][clunk]amix=inputs=4:duration=longest:dropout_transition=0:normalize=0, \
   atrim=start=0:end=8,asetpts=PTS-STARTPTS,aformat=sample_fmts=s32:channel_layouts=stereo[mix]" \
  -map "[mix]" -ar 48000 -c:a pcm_s24le "$SCRIPT_DIR/premaster.wav"

# Fixed-gain mastering is deliberately linear: it preserves the hard stop and
# the relative punch of the three sparse effects without adaptive compression.
ffmpeg -hide_banner -loglevel error -y \
  -i "$SCRIPT_DIR/premaster.wav" \
  -af "volume=4.4dB,alimiter=limit=0.841395:attack=5:release=50:level=false" \
  -t 8 -ar 48000 -c:a pcm_s24le "$SCRIPT_DIR/final-mix.wav"

ffmpeg -hide_banner -loglevel error -y \
  -i "$SCRIPT_DIR/final-mix.wav" \
  -t 8 -ar 48000 -c:a aac -b:a 192k -movflags +faststart \
  "$SCRIPT_DIR/final-mix.m4a"
