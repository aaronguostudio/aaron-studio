from __future__ import annotations

import os
import sys
import tempfile
import time
import unittest
from pathlib import Path
from unittest.mock import patch


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

    def test_dry_run_writes_artifacts_and_secret_free_summary(self) -> None:
        from run_lab import main

        with tempfile.TemporaryDirectory() as tmp:
            exit_code = main(
                [
                    "--idea",
                    "A tiny cartoon astronaut discovers a cathedral-sized vending machine in the clouds",
                    "--preset",
                    "cartoon_cinematic_worlds",
                    "--mode",
                    "strong_first_frame",
                    "--run-id",
                    "cartoon-astronaut-vending-001",
                    "--output-root",
                    tmp,
                ]
            )

            self.assertEqual(exit_code, 0)
            run_dir = Path(tmp) / time.strftime("%Y-%m-%d") / "cartoon-astronaut-vending-001"
            self.assertTrue((run_dir / "brief.md").exists())
            self.assertTrue((run_dir / "concept.json").exists())
            self.assertTrue((run_dir / "image_prompt.md").exists())
            self.assertTrue((run_dir / "video_prompt.md").exists())
            self.assertTrue((run_dir / "request.json").exists())
            self.assertTrue((run_dir / "summary.json").exists())
            self.assertTrue((run_dir / "critique.md").exists())
            self.assertTrue((run_dir / "next_variations.md").exists())

            summary_text = (run_dir / "summary.json").read_text(encoding="utf-8")
            self.assertNotIn("ARK_API_KEY", summary_text)
            self.assertNotIn("Authorization", summary_text)
            self.assertIn('"status": "dry_run"', summary_text)

    def test_submit_without_api_key_returns_clear_error_and_keeps_request(self) -> None:
        from run_lab import main

        with tempfile.TemporaryDirectory() as tmp:
            with patch.dict(os.environ, {}, clear=True):
                exit_code = main(
                    [
                        "--idea",
                        "A mythic fictional camera floating above a glass desert",
                        "--preset",
                        "impossible_product_mythology",
                        "--mode",
                        "strong_first_frame",
                        "--run-id",
                        "missing-key-product-myth-001",
                        "--output-root",
                        tmp,
                        "--submit",
                    ]
                )

            self.assertEqual(exit_code, 2)
            run_dir = Path(tmp) / time.strftime("%Y-%m-%d") / "missing-key-product-myth-001"
            self.assertTrue((run_dir / "request.json").exists())
            summary_text = (run_dir / "summary.json").read_text(encoding="utf-8")
            self.assertIn('"status": "missing_api_key"', summary_text)
            self.assertNotIn("Authorization", summary_text)

    def test_summary_redacts_signed_image_url(self) -> None:
        from run_lab import main

        signed_url = "https://assets.example.test/private/frame.png?X-Amz-Signature=secret-token"

        with tempfile.TemporaryDirectory() as tmp:
            exit_code = main(
                [
                    "--idea",
                    "A tiny cartoon astronaut discovers a cathedral-sized vending machine in the clouds",
                    "--preset",
                    "cartoon_cinematic_worlds",
                    "--mode",
                    "strong_first_frame",
                    "--run-id",
                    "signed-url-redaction-001",
                    "--output-root",
                    tmp,
                    "--image-url",
                    signed_url,
                ]
            )

            self.assertEqual(exit_code, 0)
            run_dir = Path(tmp) / time.strftime("%Y-%m-%d") / "signed-url-redaction-001"
            summary_text = (run_dir / "summary.json").read_text(encoding="utf-8")
            self.assertNotIn(signed_url, summary_text)
            self.assertNotIn("X-Amz-Signature", summary_text)
            self.assertNotIn("secret-token", summary_text)
            self.assertIn('"host": "assets.example.test"', summary_text)
            self.assertIn('"has_query": true', summary_text)

    def test_run_id_rejects_path_traversal(self) -> None:
        from run_lab import main

        with tempfile.TemporaryDirectory() as tmp:
            outside_path = Path(tmp).parent / "outside"

            with self.assertRaisesRegex(ValueError, "run-id"):
                main(
                    [
                        "--idea",
                        "A tiny cartoon astronaut discovers a cathedral-sized vending machine in the clouds",
                        "--preset",
                        "cartoon_cinematic_worlds",
                        "--mode",
                        "strong_first_frame",
                        "--run-id",
                        "../outside",
                        "--output-root",
                        tmp,
                    ]
                )

            self.assertFalse(outside_path.exists())
            self.assertFalse((Path(tmp) / "outside").exists())

    def test_run_id_rejects_nested_path(self) -> None:
        from run_lab import main

        with tempfile.TemporaryDirectory() as tmp:
            with self.assertRaisesRegex(ValueError, "run-id"):
                main(
                    [
                        "--idea",
                        "A tiny cartoon astronaut discovers a cathedral-sized vending machine in the clouds",
                        "--preset",
                        "cartoon_cinematic_worlds",
                        "--mode",
                        "strong_first_frame",
                        "--run-id",
                        "foo/bar",
                        "--output-root",
                        tmp,
                    ]
                )

    def test_normalize_run_id_preserves_valid_slug_like_id(self) -> None:
        from run_lab import normalize_run_id

        self.assertEqual(
            normalize_run_id("cartoon-astronaut-vending-001", "idea"),
            "cartoon-astronaut-vending-001",
        )


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
