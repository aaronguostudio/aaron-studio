"""Deterministic YouTube thumbnail text overlay for 2026-09-30-ai-bill.

The image model never draws the headline. This script crops the selected clean
cover to 1280x720 and sets the headline with a system font.

Usage: python thumbnail_compose.py <cover.png> <variant> <out.jpg> [zoom fx fy]
  variant: half  -> "$200 → HALF"
           bill  -> "I PRICED / MY AI BILL"
"""

import sys

from PIL import Image, ImageDraw, ImageFont

FONT = "/System/Library/Fonts/HelveticaNeue.ttc"
BLACK_COND = 9  # Helvetica Neue Condensed Black
INK = (30, 33, 36)
ACCENT = (210, 112, 28)
TW, TH = 1280, 720


def cover_crop(path, zoom=1.0, fx=0.5, fy=0.5):
    """Scale cover to fill 1280x720 (times zoom), then crop; fx/fy pick the window (0=left/top)."""
    im = Image.open(path).convert("RGB")
    w, h = im.size
    scale = max(TW / w, TH / h) * zoom
    im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
    x = round((im.width - TW) * fx)
    y = round((im.height - TH) * fy)
    return im.crop((x, y, x + TW, y + TH))


def font(size):
    return ImageFont.truetype(FONT, size, index=BLACK_COND)


def draw_arrow(d, x, y_mid, length, thick, color):
    head = thick * 2.4
    d.rectangle([x, y_mid - thick / 2, x + length - head * 0.9, y_mid + thick / 2], fill=color)
    d.polygon([(x + length - head * 1.3, y_mid - head), (x + length, y_mid),
               (x + length - head * 1.3, y_mid + head)], fill=color)


def draw_line(d, right, top, segments, f, arrow=False):
    """Right-align one line of (text, color) segments; returns bottom y of glyph ink."""
    gap = int(f.size * 0.12)
    widths = [d.textlength(t, font=f) for t, _ in segments]
    arrow_len = int(f.size * 0.8) if arrow else 0
    total = sum(widths) + gap * (len(segments) - 1) + (gap + arrow_len if arrow else 0)
    x = right - total
    bb = f.getbbox("$200HALF")  # ink box relative to draw origin
    y = top - bb[1]
    for (t, c), w in zip(segments, widths):
        d.text((x, y), t, font=f, fill=c)
        x += w + gap
    if arrow:
        draw_arrow(d, x, y + (bb[1] + bb[3]) / 2, arrow_len, int(f.size * 0.13), INK)
    return top + (bb[3] - bb[1])


def compose(cover, variant, out, zoom=1.0, fx=0.5, fy=0.5):
    im = cover_crop(cover, zoom, fx, fy)
    d = ImageDraw.Draw(im)
    right = TW - 64  # right-aligned column, clear of the frame edge
    top = 58
    if variant == "half":
        y = draw_line(d, right, top, [("$200", INK)], font(170), arrow=True)
        draw_line(d, right, y + 34, [("HALF", ACCENT)], font(230))
    elif variant == "bill":
        y = draw_line(d, right, top, [("I PRICED", INK)], font(150))
        draw_line(d, right, y + 30, [("MY AI", INK), ("BILL", ACCENT)], font(150))
    else:
        raise SystemExit(f"unknown variant {variant}")
    im.save(out, "JPEG", quality=92, optimize=True, progressive=True)


if __name__ == "__main__":
    extra = [float(v) for v in sys.argv[4:7]]
    compose(sys.argv[1], sys.argv[2], sys.argv[3], *extra)
