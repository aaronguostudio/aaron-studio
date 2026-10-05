"""Tests for mark_screenshot.py (skipped when Pillow is missing)."""

import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import mark_screenshot  # noqa: E402

try:
    from PIL import Image
except ImportError:  # pragma: no cover
    Image = None


@unittest.skipIf(Image is None, "Pillow is not installed")
class MarkScreenshotTest(unittest.TestCase):
    def setUp(self):
        self.dir = Path(tempfile.mkdtemp())
        self.src = self.dir / "in.png"
        Image.new("RGB", (400, 300), "white").save(self.src)

    def test_box_coordinates_stay_in_original_pixels_after_a_crop(self):
        out = self.dir / "out.png"
        crop = mark_screenshot.parse_rect("100,50,400,300")
        box = mark_screenshot.parse_rect("200,150,260,180:1")
        self.assertEqual(mark_screenshot.mark(self.src, out, crop, [box]), (300, 250))
        with Image.open(out) as im:
            # The box's top edge sits just above y=150-50=100, at x=(200+260)/2-100=130.
            column = [im.getpixel((130, y)) for y in range(90, 101)]
            self.assertIn(mark_screenshot.RED, column)
            self.assertEqual(im.getpixel((10, 10)), (255, 255, 255))

    def test_rejects_an_inverted_rectangle(self):
        with self.assertRaises(Exception):
            mark_screenshot.parse_rect("50,50,10,10")


if __name__ == "__main__":
    unittest.main()
