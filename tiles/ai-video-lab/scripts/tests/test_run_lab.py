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

    def test_storyboard_grid_preserves_exact_prompt_overrides(self) -> None:
        prompts = build_lab_prompts(
            "A tiny explorer enters a cloud market",
            preset="fpv_fantasy_route",
            mode="storyboard_grid",
            image_prompt_override="Custom storyboard prompt",
            video_prompt_override="Custom video prompt",
        )

        self.assertEqual(prompts["image_prompt"], "Custom storyboard prompt")
        self.assertEqual(prompts["video_prompt"], "Custom video prompt")

    def test_character_bible_preserves_exact_image_prompt_override(self) -> None:
        prompts = build_lab_prompts(
            "A tiny explorer enters a cloud market",
            preset="cartoon_cinematic_worlds",
            mode="character_bible_plus_shot",
            image_prompt_override="Custom bible prompt",
        )

        self.assertEqual(prompts["image_prompt"], "Custom bible prompt")
        self.assertNotIn("front view", prompts["image_prompt"])


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
