from __future__ import annotations

import os
import sys
import tempfile
import time
import unittest
import json
import base64
from pathlib import Path
from unittest.mock import patch


SCRIPTS_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SCRIPTS_DIR))

from run_lab import build_lab_prompts, build_seedance_prompt, image_path_to_data_url, parse_scorecard, slugify  # noqa: E402


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

    def test_text_to_video_seedance_prompt_includes_scene_and_motion(self) -> None:
        prompts = build_lab_prompts(
            "A tiny cartoon courier rides a paper airplane through a neon cloud city",
            preset="cartoon_cinematic_worlds",
            mode="strong_first_frame",
        )

        seedance_prompt = build_seedance_prompt(
            prompts,
            has_image_url=False,
            has_video_prompt_override=False,
        )

        self.assertIn("tiny cartoon courier", seedance_prompt)
        self.assertIn("Visual direction:", seedance_prompt)
        self.assertIn("Motion direction:", seedance_prompt)

    def test_image_to_video_seedance_prompt_keeps_motion_prompt_only(self) -> None:
        prompts = build_lab_prompts(
            "A tiny cartoon courier rides a paper airplane through a neon cloud city",
            preset="cartoon_cinematic_worlds",
            mode="strong_first_frame",
        )

        seedance_prompt = build_seedance_prompt(
            prompts,
            has_image_url=True,
            has_video_prompt_override=False,
        )

        self.assertEqual(seedance_prompt, prompts["video_prompt"])
        self.assertNotIn("Visual direction:", seedance_prompt)

    def test_image_path_to_data_url_encodes_supported_image(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            image_path = Path(tmp) / "first-frame.jpg"
            image_path.write_bytes(b"fake image bytes")

            data_url = image_path_to_data_url(image_path)

            self.assertEqual(
                data_url,
                "data:image/jpeg;base64," + base64.b64encode(b"fake image bytes").decode("ascii"),
            )

    def test_image_path_to_data_url_rejects_unsupported_extension(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            image_path = Path(tmp) / "first-frame.txt"
            image_path.write_text("not an image", encoding="utf-8")

            with self.assertRaises(ValueError):
                image_path_to_data_url(image_path)

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

            request_payload = json.loads((run_dir / "request.json").read_text(encoding="utf-8"))
            request_text = request_payload["content"][0]["text"]
            self.assertIn("cathedral-sized vending machine", request_text)
            self.assertIn("Motion direction:", request_text)

    def test_dry_run_with_image_path_uses_data_url_without_summary_leak(self) -> None:
        from run_lab import main

        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            image_path = tmp_path / "first-frame.jpg"
            image_path.write_bytes(b"fake image bytes")

            exit_code = main(
                [
                    "--idea",
                    "A tiny cartoon astronaut discovers a cathedral-sized vending machine in the clouds",
                    "--preset",
                    "cartoon_cinematic_worlds",
                    "--mode",
                    "strong_first_frame",
                    "--run-id",
                    "image-path-first-frame-001",
                    "--output-root",
                    str(tmp_path / "out"),
                    "--image-path",
                    str(image_path),
                ]
            )

            self.assertEqual(exit_code, 0)
            run_dir = tmp_path / "out" / time.strftime("%Y-%m-%d") / "image-path-first-frame-001"
            request_payload = json.loads((run_dir / "request.json").read_text(encoding="utf-8"))
            self.assertEqual(request_payload["content"][1]["type"], "image_url")
            self.assertTrue(request_payload["content"][1]["image_url"]["url"].startswith("data:image/jpeg;base64,"))

            request_text = request_payload["content"][0]["text"]
            self.assertNotIn("Visual direction:", request_text)
            summary_text = (run_dir / "summary.json").read_text(encoding="utf-8")
            self.assertNotIn(str(image_path), summary_text)
            self.assertNotIn("fake image bytes", summary_text)
            self.assertIn('"host": "local-or-unknown"', summary_text)

    def test_image_url_and_image_path_are_mutually_exclusive(self) -> None:
        from run_lab import main

        with tempfile.TemporaryDirectory() as tmp:
            image_path = Path(tmp) / "first-frame.jpg"
            image_path.write_bytes(b"fake image bytes")

            with self.assertRaises(ValueError):
                main(
                    [
                        "--idea",
                        "A tiny cartoon astronaut discovers a cathedral-sized vending machine in the clouds",
                        "--run-id",
                        "exclusive-image-source-001",
                        "--output-root",
                        tmp,
                        "--image-url",
                        "https://assets.example.test/frame.jpg",
                        "--image-path",
                        str(image_path),
                    ]
                )

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

    def test_summary_and_concept_redact_image_url_userinfo(self) -> None:
        from run_lab import main

        sensitive_url = (
            "https://user:pass@assets.example.test:8443/private/frame.png"
            "?X-Amz-Signature=secret-token&token=abc"
        )

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
                    "userinfo-redaction-001",
                    "--output-root",
                    tmp,
                    "--image-url",
                    sensitive_url,
                ]
            )

            self.assertEqual(exit_code, 0)
            run_dir = Path(tmp) / time.strftime("%Y-%m-%d") / "userinfo-redaction-001"
            for artifact in ["summary.json", "concept.json"]:
                artifact_text = (run_dir / artifact).read_text(encoding="utf-8")
                self.assertNotIn(sensitive_url, artifact_text)
                self.assertNotIn("user:pass", artifact_text)
                self.assertNotIn("X-Amz-Signature", artifact_text)
                self.assertNotIn("secret-token", artifact_text)
                self.assertNotIn("token=abc", artifact_text)
                self.assertIn('"host": "assets.example.test"', artifact_text)
                self.assertIn('"port": 8443', artifact_text)
                self.assertIn('"has_query": true', artifact_text)

    def test_submit_failure_summary_redacts_provider_error_body(self) -> None:
        import run_lab
        from run_lab import main

        signed_url = "https://assets.example.test/private/frame.png?X-Amz-Signature=secret-token"

        class FailingSubmitClient:
            def __init__(self, **_kwargs: object) -> None:
                pass

            def submit_task(self, _payload: dict[str, object]) -> dict[str, object]:
                raise RuntimeError(f"Seedance HTTP 400: provider echoed {signed_url}")

        with tempfile.TemporaryDirectory() as tmp:
            with patch.dict(os.environ, {"ARK_API_KEY": "test-key"}, clear=True):
                with patch.object(run_lab, "ArkSeedanceClient", FailingSubmitClient):
                    exit_code = main(
                        [
                            "--idea",
                            "A tiny cartoon astronaut discovers a cathedral-sized vending machine in the clouds",
                            "--preset",
                            "cartoon_cinematic_worlds",
                            "--mode",
                            "strong_first_frame",
                            "--run-id",
                            "submit-failure-redaction-001",
                            "--output-root",
                            tmp,
                            "--image-url",
                            signed_url,
                            "--submit",
                        ]
                    )

            self.assertEqual(exit_code, 1)
            run_dir = Path(tmp) / time.strftime("%Y-%m-%d") / "submit-failure-redaction-001"
            summary_text = (run_dir / "summary.json").read_text(encoding="utf-8")
            self.assertIn('"status": "submit_failed"', summary_text)
            self.assertNotIn(signed_url, summary_text)
            self.assertNotIn("X-Amz-Signature", summary_text)
            self.assertNotIn("secret-token", summary_text)
            error_text = (run_dir / "submit_error.txt").read_text(encoding="utf-8")
            self.assertIn(signed_url, error_text)

    def test_task_failure_summary_redacts_provider_error_body(self) -> None:
        import run_lab
        from run_lab import main

        signed_url = "https://assets.example.test/private/frame.png?X-Amz-Signature=secret-token"

        class SubmittedTaskClient:
            def __init__(self, **_kwargs: object) -> None:
                pass

            def submit_task(self, _payload: dict[str, object]) -> dict[str, object]:
                return {"id": "task-1"}

        def fail_poll(*_args: object, **_kwargs: object) -> dict[str, object]:
            raise RuntimeError(f"Seedance task failed with provider body {signed_url}")

        with tempfile.TemporaryDirectory() as tmp:
            with patch.dict(os.environ, {"ARK_API_KEY": "test-key"}, clear=True):
                with patch.object(run_lab, "ArkSeedanceClient", SubmittedTaskClient):
                    with patch.object(run_lab, "poll_task", fail_poll):
                        exit_code = main(
                            [
                                "--idea",
                                "A tiny cartoon astronaut discovers a cathedral-sized vending machine in the clouds",
                                "--preset",
                                "cartoon_cinematic_worlds",
                                "--mode",
                                "strong_first_frame",
                                "--run-id",
                                "task-failure-redaction-001",
                                "--output-root",
                                tmp,
                                "--image-url",
                                signed_url,
                                "--submit",
                            ]
                        )

            self.assertEqual(exit_code, 1)
            run_dir = Path(tmp) / time.strftime("%Y-%m-%d") / "task-failure-redaction-001"
            summary_text = (run_dir / "summary.json").read_text(encoding="utf-8")
            self.assertIn('"status": "task_failed"', summary_text)
            self.assertNotIn(signed_url, summary_text)
            self.assertNotIn("X-Amz-Signature", summary_text)
            self.assertNotIn("secret-token", summary_text)
            error_text = (run_dir / "task_error.txt").read_text(encoding="utf-8")
            self.assertIn(signed_url, error_text)

    def test_download_retries_once_then_succeeds(self) -> None:
        import run_lab
        from run_lab import main

        class RetryDownloadClient:
            attempts = 0

            def __init__(self, **_kwargs: object) -> None:
                pass

            def submit_task(self, _payload: dict[str, object]) -> dict[str, object]:
                return {"id": "task-1"}

            def download_video(self, _video_url: str, output_path: Path) -> Path:
                type(self).attempts += 1
                if type(self).attempts == 1:
                    raise RuntimeError("temporary network failure")
                output_path.write_bytes(b"fake mp4")
                return output_path

        def successful_poll(*_args: object, **_kwargs: object) -> dict[str, object]:
            return {"data": {"status": "succeeded", "content": {"video_url": "https://cdn.example.test/out.mp4"}}}

        RetryDownloadClient.attempts = 0
        with tempfile.TemporaryDirectory() as tmp:
            with patch.dict(os.environ, {"ARK_API_KEY": "test-key"}, clear=True):
                with patch.object(run_lab, "ArkSeedanceClient", RetryDownloadClient):
                    with patch.object(run_lab, "poll_task", successful_poll):
                        exit_code = main(
                            [
                                "--idea",
                                "A tiny cartoon astronaut discovers a cathedral-sized vending machine in the clouds",
                                "--preset",
                                "cartoon_cinematic_worlds",
                                "--mode",
                                "strong_first_frame",
                                "--run-id",
                                "download-retry-success-001",
                                "--output-root",
                                tmp,
                                "--submit",
                            ]
                        )

            self.assertEqual(exit_code, 0)
            self.assertEqual(RetryDownloadClient.attempts, 2)
            run_dir = Path(tmp) / time.strftime("%Y-%m-%d") / "download-retry-success-001"
            self.assertEqual((run_dir / "output.mp4").read_bytes(), b"fake mp4")
            summary_text = (run_dir / "summary.json").read_text(encoding="utf-8")
            self.assertIn('"status": "succeeded"', summary_text)

    def test_download_failure_after_retry_has_sanitized_summary(self) -> None:
        import run_lab
        from run_lab import main

        signed_url = "https://cdn.example.test/out.mp4?X-Amz-Signature=secret-token"

        class FailingDownloadClient:
            attempts = 0

            def __init__(self, **_kwargs: object) -> None:
                pass

            def submit_task(self, _payload: dict[str, object]) -> dict[str, object]:
                return {"id": "task-1"}

            def download_video(self, _video_url: str, _output_path: Path) -> Path:
                type(self).attempts += 1
                raise RuntimeError(f"download failed for {signed_url}")

        def successful_poll(*_args: object, **_kwargs: object) -> dict[str, object]:
            return {"data": {"status": "succeeded", "content": {"video_url": signed_url}}}

        FailingDownloadClient.attempts = 0
        with tempfile.TemporaryDirectory() as tmp:
            with patch.dict(os.environ, {"ARK_API_KEY": "test-key"}, clear=True):
                with patch.object(run_lab, "ArkSeedanceClient", FailingDownloadClient):
                    with patch.object(run_lab, "poll_task", successful_poll):
                        exit_code = main(
                            [
                                "--idea",
                                "A tiny cartoon astronaut discovers a cathedral-sized vending machine in the clouds",
                                "--preset",
                                "cartoon_cinematic_worlds",
                                "--mode",
                                "strong_first_frame",
                                "--run-id",
                                "download-retry-fail-001",
                                "--output-root",
                                tmp,
                                "--submit",
                            ]
                        )

            self.assertEqual(exit_code, 1)
            self.assertEqual(FailingDownloadClient.attempts, 2)
            run_dir = Path(tmp) / time.strftime("%Y-%m-%d") / "download-retry-fail-001"
            summary_text = (run_dir / "summary.json").read_text(encoding="utf-8")
            self.assertIn('"status": "download_failed"', summary_text)
            self.assertNotIn("X-Amz-Signature", summary_text)
            self.assertNotIn("secret-token", summary_text)
            error_text = (run_dir / "download_error.txt").read_text(encoding="utf-8")
            self.assertIn(signed_url, error_text)

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
