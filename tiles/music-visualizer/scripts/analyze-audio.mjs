#!/usr/bin/env node

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const [inputPath, outputPath] = process.argv.slice(2);

if (!inputPath || !outputPath) {
  console.error("Usage: node analyze-audio.mjs <audio-file> <analysis-json>");
  process.exit(1);
}

const SAMPLE_RATE = 22050;
const FPS = 30;
const FFT_SIZE = 1024;
const HOP_SIZE = Math.round(SAMPLE_RATE / FPS);
const TWO_PI = Math.PI * 2;

const clamp01 = (value) => Math.max(0, Math.min(1, value));
const smoothstep = (value) => value * value * (3 - 2 * value);

const quantile = (values, percentile) => {
  const sorted = [...values].sort((a, b) => a - b);
  const position = (sorted.length - 1) * percentile;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  if (lower === upper) return sorted[lower] ?? 0;
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (position - lower);
};

const normalizeSeries = (values, lowPercentile = 0.08, highPercentile = 0.92) => {
  const low = quantile(values, lowPercentile);
  const high = quantile(values, highPercentile);
  const range = Math.max(high - low, 1e-8);
  return values.map((value) => clamp01((value - low) / range));
};

const smoothSeries = (values, attack = 0.3, release = 0.12) => {
  let previous = values[0] ?? 0;
  return values.map((value, index) => {
    if (index === 0) {
      previous = value;
      return value;
    }
    const coefficient = value > previous ? attack : release;
    previous += (value - previous) * coefficient;
    return previous;
  });
};

const round = (value, digits = 4) => Number(value.toFixed(digits));

const decodeAudio = (filePath) => {
  const result = spawnSync(
    "ffmpeg",
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-i",
      resolve(filePath),
      "-f",
      "s16le",
      "-ac",
      "1",
      "-ar",
      String(SAMPLE_RATE),
      "pipe:1",
    ],
    { maxBuffer: 64 * 1024 * 1024 },
  );

  if (result.status !== 0) {
    throw new Error(`ffmpeg could not decode ${filePath}`);
  }

  const bytes = result.stdout;
  const samples = new Float64Array(Math.floor(bytes.length / 2));
  for (let index = 0; index < samples.length; index += 1) {
    samples[index] = bytes.readInt16LE(index * 2) / 32768;
  }
  return samples;
};

const createHannWindow = () => {
  const window = new Float64Array(FFT_SIZE);
  for (let index = 0; index < FFT_SIZE; index += 1) {
    window[index] = 0.5 - 0.5 * Math.cos((TWO_PI * index) / (FFT_SIZE - 1));
  }
  return window;
};

const fftMagnitude = (samples, window) => {
  const real = new Float64Array(FFT_SIZE);
  const imaginary = new Float64Array(FFT_SIZE);

  for (let index = 0; index < FFT_SIZE; index += 1) {
    real[index] = samples[index] * window[index];
  }

  for (let index = 1, bit = 0; index < FFT_SIZE; index += 1) {
    for (let mask = FFT_SIZE >> 1; (bit & mask) !== 0; mask >>= 1) bit ^= mask;
    bit ^= FFT_SIZE >> 1;
    if (index < bit) {
      const realValue = real[index];
      real[index] = real[bit];
      real[bit] = realValue;
    }
  }

  for (let length = 2; length <= FFT_SIZE; length <<= 1) {
    const angle = -TWO_PI / length;
    const rootReal = Math.cos(angle);
    const rootImaginary = Math.sin(angle);
    for (let start = 0; start < FFT_SIZE; start += length) {
      let currentReal = 1;
      let currentImaginary = 0;
      const half = length >> 1;
      for (let offset = 0; offset < half; offset += 1) {
        const even = start + offset;
        const odd = even + half;
        const oddReal = currentReal * real[odd] - currentImaginary * imaginary[odd];
        const oddImaginary = currentReal * imaginary[odd] + currentImaginary * real[odd];
        const evenReal = real[even];
        const evenImaginary = imaginary[even];
        real[even] = evenReal + oddReal;
        imaginary[even] = evenImaginary + oddImaginary;
        real[odd] = evenReal - oddReal;
        imaginary[odd] = evenImaginary - oddImaginary;
        const nextReal = currentReal * rootReal - currentImaginary * rootImaginary;
        currentImaginary = currentReal * rootImaginary + currentImaginary * rootReal;
        currentReal = nextReal;
      }
    }
  }

  const magnitudes = new Float64Array(FFT_SIZE / 2 + 1);
  for (let index = 0; index <= FFT_SIZE / 2; index += 1) {
    magnitudes[index] = Math.hypot(real[index], imaginary[index]);
  }
  return magnitudes;
};

const findBreakpoints = (energy, onset, durationSec) => {
  const minimumSpacing = Math.round(FPS * 5);
  const searchRadius = Math.round(FPS * Math.min(5, durationSec * 0.1));
  const derivativeWindow = Math.round(FPS * 0.7);
  const targets = [0.22, 0.48, 0.72].map((fraction) => Math.round(energy.length * fraction));
  const selected = [];

  for (const target of targets) {
    let bestIndex = target;
    let bestScore = -Infinity;
    const start = Math.max(derivativeWindow, target - searchRadius);
    const end = Math.min(energy.length - derivativeWindow - 1, target + searchRadius);
    for (let index = start; index <= end; index += 1) {
      if (selected.some((other) => Math.abs(other - index) < minimumSpacing)) continue;
      const change = Math.abs(energy[index + derivativeWindow] - energy[index - derivativeWindow]);
      const score = change + onset[index] * 0.28;
      if (score > bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    }
    selected.push(bestIndex);
  }

  return selected.sort((a, b) => a - b);
};

const styleIndex = {
  "ink-current": 0,
  "paper-resonance": 1,
  "soft-relic": 2,
};

const buildStyleMix = (frameIndex, sections) => {
  const sectionIndex = sections.findIndex((section) => frameIndex >= section.startFrame && frameIndex < section.endFrame);
  const currentIndex = sectionIndex === -1 ? sections.length - 1 : sectionIndex;
  const current = sections[currentIndex];
  const weights = [0, 0, 0];
  const currentStyle = styleIndex[current.style];
  weights[currentStyle] = 1;

  const transitionFrames = Math.round(FPS * 1.7);
  for (let boundaryIndex = 1; boundaryIndex < sections.length; boundaryIndex += 1) {
    const boundary = sections[boundaryIndex].startFrame;
    if (Math.abs(frameIndex - boundary) > transitionFrames) continue;
    const previousStyle = styleIndex[sections[boundaryIndex - 1].style];
    const nextStyle = styleIndex[sections[boundaryIndex].style];
    const progress = smoothstep((frameIndex - boundary + transitionFrames) / (transitionFrames * 2));
    weights[previousStyle] = 1 - progress;
    weights[nextStyle] = progress;
    break;
  }

  return weights.map((value) => round(value, 3));
};

const analyze = (samples) => {
  const durationSec = samples.length / SAMPLE_RATE;
  const frameCount = Math.max(1, Math.ceil(durationSec * FPS));
  const window = createHannWindow();
  const frequencies = Array.from({ length: FFT_SIZE / 2 + 1 }, (_, index) => (index * SAMPLE_RATE) / FFT_SIZE);
  const rawFrames = [];
  let previousMagnitude = new Float64Array(FFT_SIZE / 2 + 1);

  for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
    const start = frameIndex * HOP_SIZE;
    const frameSamples = new Float64Array(FFT_SIZE);
    let sumSquares = 0;
    for (let offset = 0; offset < FFT_SIZE; offset += 1) {
      const sample = samples[start + offset] ?? 0;
      frameSamples[offset] = sample;
      sumSquares += sample * sample;
    }

    const magnitude = fftMagnitude(frameSamples, window);
    let totalEnergy = 1e-12;
    let centroidNumerator = 0;
    let lowEnergy = 0;
    let midEnergy = 0;
    let highEnergy = 0;
    let flux = 0;

    for (let index = 1; index < magnitude.length; index += 1) {
      const power = magnitude[index] * magnitude[index];
      const frequency = frequencies[index];
      totalEnergy += power;
      centroidNumerator += frequency * power;
      if (frequency >= 20 && frequency < 180) lowEnergy += power;
      else if (frequency < 2000) midEnergy += power;
      else if (frequency < 8000) highEnergy += power;
      flux += Math.max(0, magnitude[index] - previousMagnitude[index]);
    }

    rawFrames.push({
      t: round(frameIndex / FPS, 3),
      rms: Math.sqrt(sumSquares / FFT_SIZE),
      centroid: centroidNumerator / totalEnergy,
      lowPower: lowEnergy,
      midPower: midEnergy,
      highPower: highEnergy,
      flux: frameIndex < 3 ? 0 : flux / Math.max(Math.sqrt(totalEnergy), 1e-8),
    });
    previousMagnitude = magnitude;
  }

  const rms = smoothSeries(normalizeSeries(rawFrames.map((frame) => frame.rms)), 0.38, 0.12);
  const flux = smoothSeries(normalizeSeries(rawFrames.map((frame) => frame.flux), 0.12, 0.9), 0.5, 0.18).map((value, index) => (
    index < FPS * 0.5 ? value * (index / (FPS * 0.5)) : value
  ));
  const fluxBaseline = smoothSeries(flux, 0.08, 0.2);
  const onset = flux.map((value, index) => clamp01((value - fluxBaseline[index] - 0.035) * 8));
  const low = smoothSeries(normalizeSeries(rawFrames.map((frame) => Math.log10(frame.lowPower + 1e-10)), 0.1, 0.9), 0.24, 0.1);
  const mid = smoothSeries(normalizeSeries(rawFrames.map((frame) => Math.log10(frame.midPower + 1e-10)), 0.1, 0.9), 0.24, 0.1);
  const high = smoothSeries(normalizeSeries(rawFrames.map((frame) => Math.log10(frame.highPower + 1e-10)), 0.1, 0.9), 0.3, 0.12);
  const centroid = smoothSeries(rawFrames.map((frame) => clamp01((frame.centroid - 80) / 7200)), 0.28, 0.12);
  const energy = smoothSeries(rms.map((value, index) => value * 0.62 + low[index] * 0.2 + mid[index] * 0.18), 0.26, 0.1);
  const calmEnergy = smoothSeries(energy, 0.035, 0.02);
  const calmLow = smoothSeries(low, 0.03, 0.018);
  const calmHigh = smoothSeries(high, 0.03, 0.018);
  const pulse = [];
  let pulseValue = 0;
  for (let index = 0; index < frameCount; index += 1) {
    pulseValue = Math.max(onset[index], pulseValue * 0.82);
    pulse.push(pulseValue);
  }

  const breakpoints = findBreakpoints(energy, flux, durationSec);
  const styles = ["ink-current", "paper-resonance", "ink-current", "soft-relic"];
  const boundaries = [0, ...breakpoints, frameCount];
  const sections = boundaries.slice(0, -1).map((startFrame, index) => ({
    startFrame,
    endFrame: boundaries[index + 1],
    startSec: round(startFrame / FPS, 2),
    endSec: round(boundaries[index + 1] / FPS, 2),
    style: styles[index],
  }));

  const frames = rawFrames.map((rawFrame, index) => ({
    t: rawFrame.t,
    rms: round(rms[index]),
    low: round(low[index]),
    mid: round(mid[index]),
    high: round(high[index]),
    centroid: round(centroid[index]),
    flux: round(flux[index]),
    pulse: round(pulse[index]),
    energy: round(energy[index]),
    calmEnergy: round(calmEnergy[index]),
    calmLow: round(calmLow[index]),
    calmHigh: round(calmHigh[index]),
    mix: buildStyleMix(index, sections),
  }));

  return {
    analysisVersion: 1,
    sampleRate: SAMPLE_RATE,
    fps: FPS,
    durationSec: round(durationSec, 3),
    frameCount,
    features: ["rms", "low", "mid", "high", "centroid", "flux", "pulse", "energy", "calmEnergy", "calmLow", "calmHigh"],
    sections,
    frames,
  };
};

const analysis = analyze(decodeAudio(inputPath));
mkdirSync(dirname(resolve(outputPath)), { recursive: true });
writeFileSync(resolve(outputPath), JSON.stringify(analysis, null, 2));
console.log(`Audio analysis: ${analysis.durationSec}s / ${analysis.frameCount} frames / sections ${analysis.sections.map((section) => `${section.startSec}-${section.endSec}s:${section.style}`).join(", ")}`);
