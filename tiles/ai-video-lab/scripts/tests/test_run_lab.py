from __future__ import annotations

import sys
import unittest
from pathlib import Path


SCRIPTS_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SCRIPTS_DIR))

from run_lab import build_lab_prompts, parse_scorecard, slugify  # noqa: E402


class SlugifyTests(unittest.TestCase):
    def test_slugify_normalizes_title_text(self) -> None:
        self.assertEqual(
            slugify("Cartoon Astronaut: Cloud Vending Machine!"),
            "cartoon-astronaut-cloud-vending-machine",
        )


class BuildLabPromptsTests(unittest.TestCase):
    def test_cartoon_strong_first_frame_prompts_include_core_direction(self) -> None:
        prompts = build_lab_prompts(
            "A tiny cartoon astronaut discovers a cathedral-sized vending machine in the clouds",
            preset="cartoon_cinematic_worlds",
            mode="strong_first_frame",
        )

        self.assertIn("cathedral-sized vending machine", prompts["image_prompt"])
        self.assertIn("cartoon cinematic", prompts["image_prompt"].lower())
        self.assertIn("slow", prompts["video_prompt"].lower())
        self.assertLess(len(prompts["video_prompt"].split()), 90)


class ParseScorecardTests(unittest.TestCase):
    def test_parse_scorecard_extracts_scores_and_candidates(self) -> None:
        scorecard = """hook: 4
visual_impact: 5
imagination: 4
motion: 3
consistency: 4
shareability: 5
defects: 3
keep: the scale contrast
change: simplify camera motion
next_prompt_variation: keep the scene but switch to a slower dolly
publish_candidate: yes
upgrade_candidate: no
"""

        parsed = parse_scorecard(scorecard)

        self.assertEqual(parsed["scores"]["hook"], 4)
        self.assertEqual(parsed["scores"]["visual_impact"], 5)
        self.assertTrue(parsed["publish_candidate"])
        self.assertFalse(parsed["upgrade_candidate"])

    def test_parse_scorecard_rejects_missing_motion_score(self) -> None:
        scorecard = """hook: 4
visual_impact: 5
imagination: 4
consistency: 4
shareability: 5
defects: 3
publish_candidate: yes
upgrade_candidate: no
"""

        with self.assertRaisesRegex(ValueError, "motion"):
            parse_scorecard(scorecard)
