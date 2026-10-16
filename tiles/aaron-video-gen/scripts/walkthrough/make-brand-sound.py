#!/usr/bin/env python3
"""Write a brand card's opening sting: a warm major arpeggio on soft bell tones.

    python3 make-brand-sound.py <out.wav> [--key F3] [--seconds 2.6]

Short, bright and unhurried, to play once under a logo as it settles. Bell-like rather than
synthetic: every note carries two quiet harmonics and decays on its own curve, over a low pad
that swells in and leaves before the card does. Stdlib only, so the asset can be rebuilt and
retuned without a toolchain.
"""

import argparse
import math
import struct
import wave

RATE = 48_000
# Equal temperament from A4, so a key is named rather than typed as a frequency.
SEMITONES = {"C": -9, "D": -7, "E": -5, "F": -4, "G": -2, "A": 0, "B": 2}
# A major triad plus its octave: the four notes the arpeggio climbs.
ARPEGGIO = (0, 4, 7, 12)
STAGGER_S = 0.10
ATTACK_S = 0.006
# Harmonic, relative level. A quiet second and third give a struck-bell timbre; a bare sine
# reads as a test tone.
HARMONICS = ((1, 1.0), (2, 0.28), (3, 0.10))
PEAK = 0.5  # about -6 dBFS, so the renderer still has room to duck it under narration


def note_hz(name: str) -> float:
    letter, accidental, octave = name[0].upper(), 0, int(name[-1])
    if "#" in name:
        accidental = 1
    elif "b" in name:
        accidental = -1
    return 440.0 * 2 ** ((SEMITONES[letter] + accidental + 12 * (octave - 4)) / 12)


def envelope(t: float, tau: float) -> float:
    """Fast attack, exponential decay. The attack keeps the note from clicking."""
    if t < 0:
        return 0.0
    return min(1.0, t / ATTACK_S) * math.exp(-t / tau)


def bell(t: float, hz: float, tau: float) -> float:
    shaped = envelope(t, tau)
    if shaped <= 0:
        return 0.0
    return shaped * sum(level * math.sin(2 * math.pi * hz * partial * t) for partial, level in HARMONICS)


def render(key: str, seconds: float) -> list[tuple[float, float]]:
    root = note_hz(key) * 2  # the arpeggio sits an octave above the named key
    notes = [(i * STAGGER_S, root * 2 ** (s / 12)) for i, s in enumerate(ARPEGGIO)]
    pad = [note_hz(key) / 2, note_hz(key) * 2 ** (7 / 12) / 2]
    frames: list[tuple[float, float]] = []
    for n in range(int(seconds * RATE)):
        t = n / RATE
        left = right = 0.0
        for i, (start, hz) in enumerate(notes):
            # Higher notes ring shorter, as a struck bar does.
            voice = bell(t - start, hz, 0.85 - 0.05 * i)
            # A touch of stereo: the climb opens outward from the centre.
            spread = 0.5 + 0.12 * (i - (len(notes) - 1) / 2)
            left += voice * (1 - spread)
            right += voice * spread
        swell = min(1.0, t / 0.30) * math.exp(-t / 1.6) * 0.16
        for hz in pad:
            tone = swell * math.sin(2 * math.pi * hz * t)
            left += tone
            right += tone
        # Leave before the card does, so the cut to the walkthrough is silent.
        out = max(0.0, min(1.0, (seconds - t) / 0.45))
        frames.append((left * out, right * out))
    return frames


def write(path: str, frames: list[tuple[float, float]]) -> None:
    loudest = max((max(abs(l), abs(r)) for l, r in frames), default=1.0) or 1.0
    gain = PEAK / loudest
    packed = b"".join(
        struct.pack("<hh", int(l * gain * 32767), int(r * gain * 32767)) for l, r in frames
    )
    with wave.open(path, "wb") as out:
        out.setnchannels(2)
        out.setsampwidth(2)
        out.setframerate(RATE)
        out.writeframes(packed)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("out")
    parser.add_argument("--key", default="F3", help="root of the arpeggio (default F3, warm)")
    parser.add_argument("--seconds", type=float, default=2.6)
    args = parser.parse_args()
    write(args.out, render(args.key, args.seconds))
    print(f"{args.out}: {args.seconds:g}s {args.key} arpeggio, peak {PEAK:.2f}")


if __name__ == "__main__":
    main()
