"""Blog cover with hook text, same art as the YouTube thumbnail (2026-09-30-ai-bill).

Text stays inside the central 80% safe zone so site card crops keep it.
Usage: python blog_cover_compose.py <cover.png> <en|zh> <out.png>
"""
import sys
from PIL import Image, ImageDraw, ImageFont

LATIN = ("/System/Library/Fonts/HelveticaNeue.ttc", 9)      # Condensed Black
LOGO = "evidence/openai-blossom-ink.png"
CJK = ("/System/Library/Fonts/Hiragino Sans GB.ttc", 2)     # W6 (heaviest system CJK sans)
INK = (30, 33, 36)
ACCENT = (210, 112, 28)


def f(spec, size):
    return ImageFont.truetype(spec[0], size, index=spec[1])


def arrow(d, x, y, length, thick):
    head = thick * 2.4
    d.rectangle([x, y - thick / 2, x + length - head * 0.9, y + thick / 2], fill=INK)
    d.polygon([(x + length - head * 1.3, y - head), (x + length, y), (x + length - head * 1.3, y + head)], fill=INK)


def compose(cover, lang, out):
    im = Image.open(cover).convert("RGB")
    W, H = im.size
    d = ImageDraw.Draw(im)
    right = int(W * 0.88)           # inside the 80% safe zone
    top = int(H * 0.11)
    f1 = f(LATIN, int(H * 0.235))
    ink1 = f1.getbbox("$200")
    gap = int(f1.size * 0.12); alen = int(f1.size * 0.8)
    w1 = d.textlength("$200", font=f1)
    cap = ink1[3] - ink1[1]
    logo = Image.open(LOGO).convert("RGBA")
    lsz = int(cap * 1.0)                      # blossom as tall as the digits
    logo = logo.resize((lsz, lsz), Image.LANCZOS)
    lgap = int(f1.size * 0.16)
    x = right - (w1 + gap + alen)
    lx = int(x - lgap - lsz)
    im.paste(logo, (lx, int(top)), logo)
    d.text((x, top - ink1[1]), "$200", font=f1, fill=INK)
    arrow(d, x + w1 + gap, top + (ink1[3] - ink1[1]) / 2, alen, int(f1.size * 0.13))
    y2 = top + (ink1[3] - ink1[1]) + int(H * 0.05)
    word, spec, size = ("HALF", LATIN, int(H * 0.32)) if lang == "en" else ("一半", CJK, int(H * 0.26))
    f2 = f(spec, size); ink2 = f2.getbbox(word)
    w2 = ink2[2] - ink2[0]
    stroke = int(size * 0.035) if lang == "zh" else 0  # thicken CJK to match the condensed black latin
    d.text((right - w2 - ink2[0], y2 - ink2[1]), word, font=f2, fill=ACCENT, stroke_width=stroke, stroke_fill=ACCENT)
    left_text = min(lx, right - w2)
    assert left_text > W * 0.10 and right < W * 0.90, "text outside safe zone"
    print(lang, "text box x:", int(left_text), "-", right, "bottom y:", int(y2 + ink2[3] - ink2[1]), "of", H)
    if out.endswith(".jpg"):
        im.resize((1280, 720), Image.LANCZOS).save(out, "JPEG", quality=92, optimize=True, progressive=True)
    else:
        im.save(out)


if __name__ == "__main__":
    compose(sys.argv[1], sys.argv[2], sys.argv[3])
