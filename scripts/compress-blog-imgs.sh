#!/bin/bash
# compress-blog-imgs.sh
# Converts PNG images in a blog's imgs/ directory to WebP for web use.
# Originals are preserved. WebP versions saved to imgs/web/.
#
# Usage:
#   ./scripts/compress-blog-imgs.sh src/content/blogs/YYYY-MM-DD
#   ./scripts/compress-blog-imgs.sh src/content/blogs/YYYY-MM-DD 85   (custom quality, default: 82)

set -e

BLOG_DIR="${1}"
QUALITY="${2:-82}"

if [ -z "$BLOG_DIR" ]; then
  echo "Usage: $0 <blog-dir> [quality]"
  echo "Example: $0 src/content/blogs/2026-03-08"
  exit 1
fi

IMGS_DIR="${BLOG_DIR}/imgs"
WEB_DIR="${IMGS_DIR}/web"

if [ ! -d "$IMGS_DIR" ]; then
  echo "No imgs/ directory found at ${IMGS_DIR}"
  exit 1
fi

mkdir -p "$WEB_DIR"

PNG_COUNT=$(find "$IMGS_DIR" -maxdepth 1 -name "*.png" | wc -l | tr -d ' ')
if [ "$PNG_COUNT" -eq 0 ]; then
  echo "No PNG files found in ${IMGS_DIR}"
  exit 0
fi

echo "Compressing ${PNG_COUNT} PNG(s) → WebP (quality: ${QUALITY})"
echo ""

TOTAL_ORIG=0
TOTAL_COMP=0

for f in "$IMGS_DIR"/*.png; do
  name=$(basename "$f" .png)
  out="${WEB_DIR}/${name}.webp"
  cwebp -q "$QUALITY" "$f" -o "$out" 2>/dev/null
  orig=$(stat -f%z "$f")
  compressed=$(stat -f%z "$out")
  saved=$(( (orig - compressed) * 100 / orig ))
  orig_kb=$(( orig / 1024 ))
  comp_kb=$(( compressed / 1024 ))
  echo "  ${name}: ${orig_kb}KB → ${comp_kb}KB (-${saved}%)"
  TOTAL_ORIG=$((TOTAL_ORIG + orig))
  TOTAL_COMP=$((TOTAL_COMP + compressed))
done

TOTAL_ORIG_KB=$((TOTAL_ORIG / 1024))
TOTAL_COMP_KB=$((TOTAL_COMP / 1024))
TOTAL_SAVED=$(( (TOTAL_ORIG - TOTAL_COMP) * 100 / TOTAL_ORIG ))

echo ""
echo "Total: ${TOTAL_ORIG_KB}KB → ${TOTAL_COMP_KB}KB (-${TOTAL_SAVED}%)"
echo "WebP files saved to: ${WEB_DIR}"
