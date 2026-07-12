import { describe, expect, test } from "bun:test";
import {
  deriveAudioReviewPaths,
  parseLoudnormMeasurement,
} from "./audio-review";

describe("audio review artifacts", () => {
  test("derives stable raw and opening, middle, and late sample paths", () => {
    expect(deriveAudioReviewPaths("/tmp/fde-audio.mp3")).toEqual({
      rawPath: "/tmp/fde-audio-raw.mp3",
      samplePath: "/tmp/fde-audio-sample-60s.mp3",
      middleSamplePath: "/tmp/fde-audio-sample-middle-60s.mp3",
      lateSamplePath: "/tmp/fde-audio-sample-late-60s.mp3",
    });
  });

  test("parses the final FFmpeg loudnorm measurement block", () => {
    const output = `noise before
{
  "input_i" : "-18.25",
  "input_tp" : "-2.10",
  "input_lra" : "4.20",
  "input_thresh" : "-28.40",
  "target_offset" : "0.30"
}
noise after`;

    expect(parseLoudnormMeasurement(output)).toEqual({
      integratedLufs: -18.25,
      truePeakDb: -2.1,
      loudnessRange: 4.2,
      threshold: -28.4,
      targetOffset: 0.3,
    });
  });
});
