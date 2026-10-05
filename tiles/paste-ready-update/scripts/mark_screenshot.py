#!/usr/bin/env python3
"""Crop a screenshot and mark what the reader should click. Needs Pillow (pip install pillow).

    python3 mark_screenshot.py IN.png --info
    python3 mark_screenshot.py IN.png OUT.png [--crop x0,y0,x1,y1] [--box x0,y0,x1,y1[:label]] ...

All coordinates are pixels of the ORIGINAL image (use --info for its size), so --crop can change
without moving the boxes. Each --box draws a red rectangle; a label (for example 1, 2, 3) is drawn
in a red badge to the left of the box, matching the step numbers in the message.
"""

from __future__ import annotations

import argparse
import sys

RED = (217, 45, 32)


def parse_rect(text: str):
    label = None
    if ":" in text:
        text, label = text.split(":", 1)
    parts = [int(round(float(p))) for p in text.split(",")]
    if len(parts) != 4:
        raise argparse.ArgumentTypeError("expected x0,y0,x1,y1 but got %r" % text)
    x0, y0, x1, y1 = parts
    if x1 <= x0 or y1 <= y0:
        raise argparse.ArgumentTypeError("x1,y1 must be right of and below x0,y0: %r" % text)
    return (x0, y0, x1, y1), label


def font(size):
    from PIL import ImageFont

    for path in ("/System/Library/Fonts/Helvetica.ttc", "/Library/Fonts/Arial.ttf",
                 "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "C:/Windows/Fonts/arialbd.ttf"):
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    try:
        return ImageFont.load_default(size=size)
    except TypeError:  # Pillow < 10.1
        return ImageFont.load_default()


def mark(src, dst, crop=None, boxes=()):
    from PIL import Image, ImageDraw

    with Image.open(src) as opened:
        im = opened.convert("RGB")
    ox, oy = 0, 0
    if crop:
        (x0, y0, x1, y1), _ = crop
        x0, y0 = max(0, x0), max(0, y0)
        x1, y1 = min(im.width, x1), min(im.height, y1)
        im = im.crop((x0, y0, x1, y1))
        ox, oy = x0, y0
    draw = ImageDraw.Draw(im)
    stroke = max(2, round(min(im.width, im.height) / 250))
    radius = max(10, stroke * 5)
    for (x0, y0, x1, y1), label in boxes:
        x0, y0, x1, y1 = x0 - ox, y0 - oy, x1 - ox, y1 - oy
        pad = stroke + 1
        draw.rounded_rectangle((x0 - pad, y0 - pad, x1 + pad, y1 + pad), radius=stroke * 2, outline=RED, width=stroke)
        if label:
            cx = max(radius, x0 - pad - radius - stroke * 2)
            cy = (y0 + y1) / 2
            draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=RED)
            draw.text((cx, cy), label, fill="white", font=font(round(radius * 1.2)), anchor="mm")
    im.save(dst)
    return im.size


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description="Crop a screenshot and mark what to click.")
    parser.add_argument("src")
    parser.add_argument("dst", nargs="?")
    parser.add_argument("--info", action="store_true", help="print the image size and exit")
    parser.add_argument("--crop", type=parse_rect, help="x0,y0,x1,y1 in original pixels")
    parser.add_argument("--box", type=parse_rect, action="append", default=[], help="x0,y0,x1,y1[:label], repeatable")
    args = parser.parse_args(argv)
    try:
        from PIL import Image
    except ImportError:
        print("error: Pillow is not installed (pip install pillow); use the screenshot unmarked instead", file=sys.stderr)
        return 2
    if args.info:
        with Image.open(args.src) as im:
            print("%dx%d" % im.size)
        return 0
    if not args.dst:
        parser.error("OUT is required unless --info is given")
    width, height = mark(args.src, args.dst, args.crop, args.box)
    print("wrote %s (%dx%d)" % (args.dst, width, height))
    return 0


if __name__ == "__main__":
    sys.exit(main())
