import {
  AMBIENT_SCENES,
  drawAmbientScene,
  getAmbientSceneMeta,
} from "../../tiles/aaron-video-gen/remotion/src/ambient/ambient-engine.js";

const canvas = document.querySelector("#ambient-canvas");
const context = canvas.getContext("2d", { alpha: false });
const stage = document.querySelector(".stage-card");
const sceneTitle = document.querySelector("#scene-title");
const scenePurpose = document.querySelector("#scene-purpose");
const sceneKicker = document.querySelector("#scene-kicker");
const timeline = document.querySelector("#timeline");
const timeOutput = document.querySelector("#time-output");
const playToggle = document.querySelector("#play-toggle");
const musicToggle = document.querySelector("#music-toggle");
const musicToggleLabel = document.querySelector("#music-toggle-label");
const musicStatus = document.querySelector("#music-status");
const musicPlayer = document.querySelector("#music-player");
const paletteControl = document.querySelector("#palette");
const intensityControl = document.querySelector("#intensity");
const speedControl = document.querySelector("#speed");
const seedControl = document.querySelector("#seed");
const sceneButtons = [...document.querySelectorAll("[data-scene]")];

const query = new URLSearchParams(location.search);
const requestedScene = query.get("scene");
const ANALYSIS_URL = "../../src/content/music-visualizer/ambient-signal-focus-audio-v1/audio-analysis.json";
const state = {
  scene: AMBIENT_SCENES[requestedScene] ? requestedScene : "focus",
  timeSec: 0,
  paused: false,
  palette: query.get("palette") || "signal",
  intensity: 0.82,
  speed: 1,
  seed: Number(query.get("seed")) || 2718,
  lastNow: performance.now(),
  audioAnalysis: null,
  musicEnabled: false,
  musicError: null,
};

const pad = (value) => String(value).padStart(2, "0");
const formatClock = (value) => {
  const safe = Math.max(0, Number.isFinite(value) ? value : 0);
  return `${pad(Math.floor(safe / 60))}:${pad(Math.floor(safe % 60))}`;
};
const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const interpolate = (from, to, amount) => from + (to - from) * amount;

function musicTime() {
  return Number.isFinite(musicPlayer.currentTime) ? musicPlayer.currentTime : 0;
}

function signalAt(timeSec) {
  const analysis = state.audioAnalysis;
  if (!analysis?.frames?.length) return undefined;
  const duration = analysis.durationSec || analysis.frames.length / analysis.fps;
  const wrapped = ((timeSec % duration) + duration) % duration;
  const position = wrapped * analysis.fps;
  const lowerIndex = Math.max(0, Math.min(analysis.frames.length - 1, Math.floor(position)));
  const upperIndex = Math.max(0, Math.min(analysis.frames.length - 1, lowerIndex + 1));
  const amount = clamp(position - lowerIndex);
  const lower = analysis.frames[lowerIndex];
  const upper = analysis.frames[upperIndex] || lower;
  const keys = ["energy", "low", "mid", "high", "pulse", "calmEnergy", "calmLow", "calmHigh"];
  return Object.fromEntries(keys.map((key) => [key, interpolate(lower[key] ?? 0, upper[key] ?? lower[key] ?? 0, amount)]));
}

function syncMusicUi() {
  const ready = Boolean(state.audioAnalysis) && musicPlayer.readyState >= 1 && !state.musicError;
  musicToggle.disabled = !ready;
  musicToggle.classList.toggle("is-active", state.musicEnabled);
  musicToggle.setAttribute("aria-pressed", String(state.musicEnabled));
  musicToggleLabel.textContent = state.musicEnabled ? "Sound on" : ready ? "Play music" : "Loading music…";
  if (state.musicError) musicStatus.textContent = "Music unavailable · visual mode only";
  else if (state.musicEnabled) musicStatus.textContent = "Audio + precomputed signal locked";
  else if (ready) musicStatus.textContent = "60s · Rhodes · low-energy focus";
}

function sizeCanvas() {
  const bounds = stage.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(1, Math.round(bounds.width * dpr));
  const height = Math.max(1, Math.round(bounds.height * dpr));
  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;
}

function updateLabels() {
  const meta = getAmbientSceneMeta(state.scene);
  sceneTitle.textContent = meta.title;
  scenePurpose.textContent = meta.purpose;
  sceneKicker.textContent = `${state.scene} system`;
  paletteControl.value = state.palette;
  seedControl.value = String(state.seed);
  sceneButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.scene === state.scene);
  });
}

function updateTime(meta) {
  if (state.musicEnabled && Number.isFinite(musicPlayer.duration)) {
    timeline.value = String(clamp(musicTime() / musicPlayer.duration));
    timeOutput.textContent = `${formatClock(musicTime())} / ${formatClock(musicPlayer.duration)}`;
    return;
  }
  const wrapped = ((state.timeSec % meta.durationSec) + meta.durationSec) % meta.durationSec;
  timeline.value = String(wrapped / meta.durationSec);
  timeOutput.textContent = `${formatClock(wrapped)} / ${formatClock(meta.durationSec)}`;
}

function render(now) {
  const delta = Math.min(0.05, Math.max(0, (now - state.lastNow) / 1000));
  state.lastNow = now;
  const meta = getAmbientSceneMeta(state.scene);
  if (!state.paused) {
    state.timeSec = state.musicEnabled
      ? musicTime() % meta.durationSec
      : (state.timeSec + delta * state.speed) % meta.durationSec;
  }

  sizeCanvas();
  drawAmbientScene(context, {
    scene: state.scene,
    timeSec: state.timeSec,
    durationSec: meta.durationSec,
    width: canvas.width,
    height: canvas.height,
    seed: state.seed,
    intensity: state.intensity,
    palette: state.palette,
    audio: state.musicEnabled ? signalAt(musicTime()) : undefined,
  });
  updateTime(meta);
  requestAnimationFrame(render);
}

function selectScene(scene) {
  if (!AMBIENT_SCENES[scene]) return;
  state.scene = scene;
  state.timeSec = state.musicEnabled ? musicTime() % getAmbientSceneMeta(scene).durationSec : 0;
  state.palette = getAmbientSceneMeta(scene).palette;
  updateLabels();
}

sceneButtons.forEach((button) => {
  button.addEventListener("click", () => selectScene(button.dataset.scene));
});

playToggle.addEventListener("click", async () => {
  state.paused = !state.paused;
  if (state.musicEnabled) {
    if (state.paused) musicPlayer.pause();
    else {
      try {
        await musicPlayer.play();
      } catch (error) {
        state.paused = true;
        state.musicError = error;
      }
    }
  }
  playToggle.textContent = state.paused ? "Play" : "Pause";
  playToggle.setAttribute("aria-label", state.paused ? "Play animation" : "Pause animation");
  syncMusicUi();
});

musicToggle.addEventListener("click", async () => {
  if (state.musicEnabled) {
    musicPlayer.pause();
    state.musicEnabled = false;
    syncMusicUi();
    return;
  }
  state.musicEnabled = true;
  state.paused = false;
  playToggle.textContent = "Pause";
  playToggle.setAttribute("aria-label", "Pause animation and music");
  musicPlayer.playbackRate = state.speed;
  try {
    await musicPlayer.play();
  } catch (error) {
    state.musicEnabled = false;
    state.musicError = error;
  }
  syncMusicUi();
});

timeline.addEventListener("input", () => {
  const ratio = Number(timeline.value);
  const meta = getAmbientSceneMeta(state.scene);
  if (state.musicEnabled && Number.isFinite(musicPlayer.duration)) {
    musicPlayer.currentTime = ratio * musicPlayer.duration;
    state.timeSec = musicTime() % meta.durationSec;
  } else state.timeSec = ratio * meta.durationSec;
});
paletteControl.addEventListener("change", () => { state.palette = paletteControl.value; });
intensityControl.addEventListener("input", () => { state.intensity = Number(intensityControl.value); });
speedControl.addEventListener("input", () => {
  state.speed = Number(speedControl.value);
  musicPlayer.playbackRate = state.speed;
});
seedControl.addEventListener("change", () => { state.seed = Number(seedControl.value) || 2718; });

window.addEventListener("keydown", (event) => {
  if (event.key === " ") {
    event.preventDefault();
    playToggle.click();
  }
  if (["1", "2", "3"].includes(event.key)) selectScene(["focus", "sleep", "relax"][Number(event.key) - 1]);
});

new ResizeObserver(sizeCanvas).observe(stage);
musicPlayer.volume = 0.72;
musicPlayer.addEventListener("loadedmetadata", syncMusicUi);
musicPlayer.addEventListener("error", () => {
  state.musicError = musicPlayer.error || new Error("Audio could not be loaded");
  syncMusicUi();
});

fetch(ANALYSIS_URL)
  .then((response) => {
    if (!response.ok) throw new Error(`Audio analysis request failed: ${response.status}`);
    return response.json();
  })
  .then((analysis) => {
    state.audioAnalysis = analysis;
    syncMusicUi();
  })
  .catch((error) => {
    state.musicError = error;
    syncMusicUi();
  });

updateLabels();
syncMusicUi();
requestAnimationFrame(render);
