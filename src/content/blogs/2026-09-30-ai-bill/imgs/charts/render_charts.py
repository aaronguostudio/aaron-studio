"""Deterministic data charts for 2026-09-30-ai-bill.

Renders five charts at 1920x1080 PNG (imgs/charts/) for video slides.
Web WebP versions (imgs/web/) are produced from these PNGs by the build step
recorded in imgs/generation-manifest.md.

Every number below is copied verbatim from the chart brief. Do not edit
values here without updating the article and claim ledger.
"""

from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle
from matplotlib.transforms import blended_transform_factory

OUT = Path(__file__).resolve().parent

# ---- Design tokens -------------------------------------------------------
BG = "#F6F4EF"        # warm white
INK = "#1E2124"       # graphite
INK_2 = "#565A60"     # secondary text
INK_3 = "#8B8E93"     # footnote
RULE = "#D9D5CC"      # baseline / hairlines
NEUTRAL = "#CBC6BC"   # default bar
NEUTRAL_LIGHT = "#E3DFD7"
ACCENT = "#D2701C"    # the one accent: warm amber
OPENAI_HUE = "#71808E"     # muted slate
ANTHROPIC_HUE = "#B08F6E"  # muted clay

plt.rcParams.update(
    {
        "font.family": ["Helvetica Neue", "Arial Unicode MS", "DejaVu Sans"],
        "text.parse_math": False,
        "figure.facecolor": BG,
        "axes.facecolor": BG,
        "savefig.facecolor": BG,
    }
)

W, H, DPI = 19.2, 10.8, 100
LEFT = 0.075


def frame(title, subtitle, footnote):
    fig = plt.figure(figsize=(W, H), dpi=DPI)
    t = fig.text(LEFT, 0.905, title, fontsize=46, fontweight="bold", color=INK, va="baseline")
    r = fig.canvas.get_renderer()
    max_w = (1 - 2 * LEFT) * W * DPI
    w = t.get_window_extent(r).width
    if w > max_w:
        t.set_fontsize(46 * max_w / w)
    fig.text(LEFT, 0.845, subtitle, fontsize=25, color=INK_2, va="baseline")
    fig.text(LEFT, 0.045, footnote, fontsize=17, color=INK_3, va="baseline")
    return fig


def text_after(fig, ax, anchor, s, gap_px, **kw):
    """Place text s immediately to the right of an existing Text anchor."""
    r = fig.canvas.get_renderer()
    bb = anchor.get_window_extent(r)
    x_fig = (bb.x1 + gap_px) / (W * DPI)
    tr = blended_transform_factory(fig.transFigure, ax.transData)
    return ax.text(x_fig, anchor.get_position()[1], s, transform=tr, **kw)


def clean(ax):
    for s in ("top", "right", "left"):
        ax.spines[s].set_visible(False)
    ax.spines["bottom"].set_color(RULE)
    ax.spines["bottom"].set_linewidth(2)
    ax.tick_params(left=False, bottom=False, labelleft=False, labelbottom=False)


def save(fig, name):
    fig.savefig(OUT / f"{name}.png", dpi=DPI)
    plt.close(fig)


# ---- 01 price per unit ---------------------------------------------------
def chart_01():
    fig = frame(
        "The bulk discount is gone",
        "Monthly price per 1× of Plus usage. The old Pro 200 was the only tier below $20.",
        "Source: OpenAI plan terms, Sept 29 2026. 1× = Plus allowance.",
    )
    ax = fig.add_axes([LEFT, 0.27, 0.85, 0.46])
    plans = [
        ("Plus", "1×", 20),
        ("Pro 100", "5×", 20),
        ("Pro 200\nuntil Oct 29", "20×", 10),
        ("Pro 200\nfrom Oct 30", "10×", 20),
        ("Pro 500", "25×", 20),
    ]
    xs = range(len(plans))
    colors = [ACCENT if v == 10 else NEUTRAL for _, _, v in plans]
    ax.bar(xs, [v for *_, v in plans], width=0.58, color=colors, zorder=2)
    ax.set_xlim(-0.6, len(plans) - 0.4)
    ax.set_ylim(0, 24)
    clean(ax)
    for x, (name, mult, v) in zip(xs, plans):
        hl = v == 10
        ax.text(x, v + 0.7, f"${v}", ha="center", va="bottom", fontsize=40,
                fontweight="bold", color=ACCENT if hl else INK)
        ax.text(x, -1.3, name, ha="center", va="top", fontsize=25,
                fontweight="bold", color=INK, linespacing=1.15)
        ax.text(x, -6.6, f"{mult} Plus usage", ha="center", va="top", fontsize=22,
                color=ACCENT if hl else INK_2)
    save(fig, "01-price-per-unit")


# ---- 02 codex meter ------------------------------------------------------
def chart_02():
    fig = frame(
        "My Codex weekly meter, September",
        "Five of six windows hit 99-100%.",
        "Source: author's Codex session logs (one machine).",
    )
    ax = fig.add_axes([LEFT, 0.2, 0.80, 0.56])
    weeks = [("W1", "Sep 6", 99), ("W2", "Sep 13", 59), ("W3", "Sep 14", 99),
             ("W4", "Sep 15", 99), ("W5", "Sep 19", 100), ("W6", "Sep 26", 100)]
    xs = range(len(weeks))
    colors = [ACCENT if v >= 99 else NEUTRAL for *_, v in weeks]
    ax.bar(xs, [v for *_, v in weeks], width=0.62, color=colors, zorder=2)
    ax.set_xlim(-0.55, len(weeks) - 0.45)
    ax.set_ylim(0, 108)
    clean(ax)
    ax.axhline(100, color=INK, lw=2.4, ls=(0, (6, 4)), zorder=3)
    ax.text(len(weeks) - 0.4, 100, "  100%", ha="left", va="center", fontsize=26,
            fontweight="bold", color=INK, clip_on=False)
    for x, (wk, reset, v) in zip(xs, weeks):
        hl = v >= 99
        ax.text(x, v - 3.5, f"{v}%", ha="center", va="top", fontsize=34,
                fontweight="bold", color="white" if hl else INK, zorder=4)
        ax.text(x, -3.5, wk, ha="center", va="top", fontsize=27, fontweight="bold", color=INK)
        ax.text(x, -11.5, f"resets {reset}", ha="center", va="top", fontsize=21, color=INK_2)
    save(fig, "02-codex-meter")


# ---- 03 bill by model ----------------------------------------------------
def chart_03():
    fig = frame(
        "30 days of AI coding, priced at API list",
        "List-price value of my usage by model, split into cache reads and everything else.",
        "Aug 31-Sep 29 2026, one machine. What the work would cost on the API, not what I paid.",
    )
    # legend
    lx, ly = LEFT, 0.772
    fig.patches.append(Rectangle((lx, ly), 0.016, 0.026, transform=fig.transFigure, color=ACCENT))
    fig.text(lx + 0.022, ly + 0.004, "Cache reads", fontsize=21, color=INK, va="bottom")
    fig.patches.append(Rectangle((lx + 0.135, ly), 0.016, 0.026, transform=fig.transFigure, color=NEUTRAL))
    fig.text(lx + 0.157, ly + 0.004, "Everything else", fontsize=21, color=INK, va="bottom")

    ax = fig.add_axes([0.235, 0.11, 0.62, 0.64])
    groups = [
        ("Claude Code", "total ≈ $9,400", [
            ("Opus 5", 6559, 76), ("Opus 5.5", 1879, 58),
            ("Fable 5.1", 567, 28), ("Sonnet 5", 362, 72)]),
        ("Codex, Pro account", "total ≈ $3,600", [
            ("GPT-6 Astra", 2884, 78), ("GPT-5.6 Sol", 437, 72),
            ("GPT-5.6 Terra", 201, 67), ("Others", 93, None)]),
    ]
    y_end = sum(1 + len(r) for *_, r in groups) + 0.45 * len(groups)
    ax.set_ylim(y_end - 0.45 - 0.4, -0.7)
    ax.set_xlim(0, 8000)
    y = 0
    bar_h = 0.64
    hdr_tr = blended_transform_factory(fig.transFigure, ax.transData)
    for gname, gtotal, rows in groups:
        h = ax.text(LEFT, y, gname, transform=hdr_tr, ha="left", va="center",
                    fontsize=27, fontweight="bold", color=INK)
        text_after(fig, ax, h, gtotal, 18, ha="left", va="center", fontsize=24, color=INK_2)
        y += 1.0
        for name, total, pct in rows:
            ax.text(-0.02, y, name, transform=ax.get_yaxis_transform(), ha="right", va="center",
                    fontsize=23, color=INK)
            if pct is None:
                ax.barh(y, total, height=bar_h, color=NEUTRAL_LIGHT, zorder=2)
                tail = "not split"
            else:
                cache = total * pct / 100
                ax.barh(y, cache, height=bar_h, color=ACCENT, zorder=2)
                ax.barh(y, total - cache, left=cache, height=bar_h, color=NEUTRAL, zorder=2)
                tail = f"{pct}% cache reads"
            v = ax.text(total + 80, y, f"${total:,}", ha="left", va="center", fontsize=24,
                        fontweight="bold", color=INK)
            text_after(fig, ax, v, tail, 16, ha="left", va="center", fontsize=20,
                       color=ACCENT if pct is not None else INK_3)
            y += 1.0
        y += 0.45
    for s_ in ("top", "right", "bottom", "left"):
        ax.spines[s_].set_visible(False)
    ax.tick_params(left=False, bottom=False, labelleft=False, labelbottom=False)
    save(fig, "03-bill-by-model")


# ---- 04 cache read price -------------------------------------------------
def chart_04():
    fig = frame(
        "The price that matters is the re-read",
        "Cache-read list price per 1M tokens, the line item agent loops consume most.",
        "Official list prices, Sept 30 2026.",
    )
    lx, ly = LEFT, 0.772
    fig.patches.append(Rectangle((lx, ly), 0.016, 0.026, transform=fig.transFigure, color=OPENAI_HUE))
    fig.text(lx + 0.022, ly + 0.004, "OpenAI", fontsize=21, color=INK, va="bottom")
    fig.patches.append(Rectangle((lx + 0.095, ly), 0.016, 0.026, transform=fig.transFigure, color=ANTHROPIC_HUE))
    fig.text(lx + 0.117, ly + 0.004, "Anthropic", fontsize=21, color=INK, va="bottom")

    ax = fig.add_axes([0.25, 0.13, 0.60, 0.60])
    rows = [
        ("GPT-6 Astra", 1.00, "o", True),
        ("Claude Opus 5", 0.50, "a", False),
        ("Claude Fable 5.1", 0.25, "a", False),
        ("Claude Opus 5.5", 0.20, "a", True),
        ("GPT-6 Sol", 0.20, "o", False),
        ("GPT-6.1 Sol", 0.10, "o", False),
    ]
    for i, (name, v, vendor, hl) in enumerate(rows):
        hue = OPENAI_HUE if vendor == "o" else ANTHROPIC_HUE
        ax.barh(i, v, height=0.62, color=hue, alpha=1.0 if hl else 0.45, zorder=2)
        ax.text(-0.02, i, name, transform=ax.get_yaxis_transform(), ha="right", va="center",
                fontsize=25, fontweight="bold" if hl else "normal", color=INK)
        ax.text(v + 0.015, i, f"${v:.2f}", ha="left", va="center", fontsize=27,
                fontweight="bold", color=INK if hl else INK_2)
    # 5x bracket between Astra (row 0) and Opus 5.5 (row 3)
    bx = 1.16
    ax.plot([bx - 0.02, bx, bx, bx - 0.02], [0, 0, 3, 3], color=ACCENT, lw=3, clip_on=False,
            solid_capstyle="butt")
    ax.text(bx + 0.025, 1.5, "5×", ha="left", va="center", fontsize=40, fontweight="bold",
            color=ACCENT, clip_on=False)
    ax.set_ylim(len(rows) - 0.4, -0.6)
    ax.set_xlim(0, 1.12)
    for s in ("top", "right", "bottom"):
        ax.spines[s].set_visible(False)
    ax.spines["left"].set_color(RULE)
    ax.spines["left"].set_linewidth(2)
    ax.tick_params(left=False, bottom=False, labelleft=False, labelbottom=False)
    save(fig, "04-cache-read-price")


# ---- 05 model vs vendor --------------------------------------------------
def chart_05():
    fig = frame(
        "Picking the model moved my bill more than picking the vendor",
        "Two of my biggest lines, repriced at a cheaper model from the same vendor.",
        "Same tokens, repriced. Quality not compared.",
    )
    ax = fig.add_axes([0.27, 0.12, 0.58, 0.64])
    pairs = [
        ("Astra tokens → priced at GPT-6.1 Sol",
         ("At GPT-6 Astra prices", 2884, "$2,884"),
         ("At GPT-6.1 Sol prices", 353, "$353 (≈12%)")),
        ("Opus 5 tokens → priced at Opus 5.5",
         ("At Opus 5 prices", 6559, "$6,559"),
         ("At Opus 5.5 prices", 3250, "$3,250 (≈50%)")),
    ]
    y = 0
    for header, before, after in pairs:
        ax.text(LEFT, y, header, transform=blended_transform_factory(fig.transFigure, ax.transData),
                ha="left", va="center", fontsize=27, fontweight="bold", color=INK)
        y += 1.0
        for (label, v, vlabel), color, bold in ((before, NEUTRAL, False), (after, ACCENT, True)):
            ax.barh(y, v, height=0.66, color=color, zorder=2)
            ax.text(-0.02, y, label, transform=ax.get_yaxis_transform(), ha="right", va="center",
                    fontsize=23, color=INK)
            ax.text(v + 80, y, vlabel, ha="left", va="center", fontsize=28, fontweight="bold",
                    color=ACCENT if bold else INK)
            y += 1.0
        y += 0.7
    ax.set_ylim(y - 0.7 - 0.4, -0.7)
    ax.set_xlim(0, 7000)
    for s_ in ("top", "right", "bottom", "left"):
        ax.spines[s_].set_visible(False)
    ax.tick_params(left=False, bottom=False, labelleft=False, labelbottom=False)
    save(fig, "05-model-vs-vendor")


if __name__ == "__main__":
    for fn in (chart_01, chart_02, chart_03, chart_04, chart_05):
        fn()
    print("ok")
