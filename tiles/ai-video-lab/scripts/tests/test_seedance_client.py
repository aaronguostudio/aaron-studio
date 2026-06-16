from __future__ import annotations

import sys
import unittest
from pathlib import Path


SCRIPTS_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SCRIPTS_DIR))

from seedance_client import (  # noqa: E402
    ArkSeedanceClient,
    build_video_payload,
    estimate_rmb,
    estimate_tokens,
    extract_status,
    extract_task_id,
    extract_video_url,
)


class BuildVideoPayloadTests(unittest.TestCase):
    def test_build_video_payload_defaults_to_low_cost_vertical_shape(self) -> None:
        payload = build_video_payload("make a tiny moonlit video")

        self.assertEqual(payload["model"], "doubao-seedance-2-0-260128")
        self.assertEqual(payload["ratio"], "9:16")
        self.assertEqual(payload["resolution"], "480p")
        self.assertEqual(payload["duration"], 4)
        self.assertFalse(payload["generate_audio"])
        self.assertFalse(payload["watermark"])
        self.assertEqual(
            payload["content"],
            [{"type": "text", "text": "make a tiny moonlit video"}],
        )

    def test_build_video_payload_appends_image_reference(self) -> None:
        payload = build_video_payload(
            "animate this frame",
            image_url="https://example.test/reference.png",
            image_role="reference_image",
        )

        self.assertEqual(
            payload["content"][1],
            {
                "type": "image_url",
                "image_url": {"url": "https://example.test/reference.png"},
                "role": "reference_image",
            },
        )

    def test_build_video_payload_rejects_duration_below_four_seconds(self) -> None:
        with self.assertRaises(ValueError):
            build_video_payload("too short", duration=3)

    def test_build_video_payload_rejects_duration_above_fifteen_seconds(self) -> None:
        with self.assertRaises(ValueError):
            build_video_payload("too long", duration=16)


class EstimateTests(unittest.TestCase):
    def test_estimate_tokens_uses_seedance_pixel_table(self) -> None:
        self.assertEqual(estimate_tokens("480p", "9:16", 4), 40176)
        self.assertEqual(estimate_tokens("720p", "9:16", 4), 86400)

    def test_estimate_rmb_uses_default_seedance_price(self) -> None:
        self.assertAlmostEqual(estimate_rmb(40176), 1.848096)


class ExtractHelperTests(unittest.TestCase):
    def test_extract_task_id_from_known_response_shapes(self) -> None:
        self.assertEqual(extract_task_id({"id": "task-root"}), "task-root")
        self.assertEqual(
            extract_task_id({"data": {"task_id": "task-data"}}),
            "task-data",
        )
        self.assertIsNone(extract_task_id({"data": {"task_id": None}}))

    def test_extract_status_lowercases_known_response_shapes(self) -> None:
        self.assertEqual(extract_status({"status": "SUCCEEDED"}), "succeeded")
        self.assertEqual(
            extract_status({"data": {"status": "In_Progress"}}),
            "in_progress",
        )
        self.assertIsNone(extract_status({"data": {"status": None}}))

    def test_extract_video_url_from_known_response_shapes(self) -> None:
        self.assertEqual(
            extract_video_url({"content": {"video_url": "https://example.test/a.mp4"}}),
            "https://example.test/a.mp4",
        )
        self.assertEqual(
            extract_video_url({"data": {"result": {"video_url": "https://example.test/b.mp4"}}}),
            "https://example.test/b.mp4",
        )
        self.assertEqual(
            extract_video_url({"data": {"video": {"url": "https://example.test/c.mp4"}}}),
            "https://example.test/c.mp4",
        )
        self.assertIsNone(extract_video_url({"data": {}}))


class ArkSeedanceClientTests(unittest.TestCase):
    def test_submit_task_requires_ark_api_key_for_live_requests(self) -> None:
        client = ArkSeedanceClient(api_key="")

        with self.assertRaisesRegex(RuntimeError, "ARK_API_KEY"):
            client.submit_task(build_video_payload("missing credentials"))


if __name__ == "__main__":
    unittest.main()
