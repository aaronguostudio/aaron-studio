import fs from "node:fs";
import path from "node:path";

const sampleRate = 48_000;
const durationSec = 18.5;
const channelCount = 2;
const frameCount = Math.round(sampleRate * durationSec);
const outputPath = process.argv[2] || path.join(path.dirname(new URL(import.meta.url).pathname), "original-ui-pulse-raw.wav");

let randomState = 0x5a17c0de;
const random = () => {
  randomState = (Math.imul(randomState, 1_664_525) + 1_013_904_223) >>> 0;
  return randomState / 0x1_0000_0000;
};

const midiToHz = (note) => 440 * 2 ** ((note - 69) / 12);
const roots = [45, 48, 41, 43];
const pluckNotes = [69, 72, 76, 72, 65, 69, 72, 67];
const cutTimes = [1.5, 3.2, 5.6, 12.6, 16.2];
const beatSec = 0.5;
const halfBeatSec = beatSec / 2;

const pcm = Buffer.alloc(frameCount * channelCount * 2);
let previousNoise = 0;

for (let frame = 0; frame < frameCount; frame += 1) {
  const time = frame / sampleRate;
  const section = Math.min(roots.length - 1, Math.floor(time / 4.625));
  const rootHz = midiToHz(roots[section]);

  const fadeIn = Math.min(1, time / 0.22);
  const fadeOut = Math.min(1, Math.max(0, (durationSec - time) / 0.48));
  const masterFade = fadeIn * fadeOut;

  const padLfo = 0.5 + 0.5 * Math.sin(2 * Math.PI * 0.14 * time);
  const pad =
    0.055 * Math.sin(2 * Math.PI * rootHz * time) +
    0.025 * Math.sin(2 * Math.PI * rootHz * 1.5 * time + 0.6) +
    0.018 * Math.sin(2 * Math.PI * rootHz * 2 * time + 1.1) * padLfo;

  const beatPhase = time % beatSec;
  const kickEnvelope = Math.exp(-beatPhase * 16);
  const kickFrequency = 48 + 72 * Math.exp(-beatPhase * 28);
  const kick = 0.42 * kickEnvelope * Math.sin(2 * Math.PI * kickFrequency * beatPhase);

  const bassEnvelope = Math.exp(-beatPhase * 5.5);
  const bass = 0.12 * bassEnvelope * Math.sin(2 * Math.PI * (rootHz / 2) * time);

  const halfBeatPhase = time % halfBeatSec;
  const noise = random() * 2 - 1;
  const highNoise = noise - previousNoise * 0.94;
  previousNoise = noise;
  const hatAccent = Math.floor(time / halfBeatSec) % 2 === 0 ? 1 : 0.58;
  const hat = 0.026 * hatAccent * Math.exp(-halfBeatPhase * 58) * highNoise;

  const pluckIndex = Math.floor(time / beatSec) % pluckNotes.length;
  const pluckHz = midiToHz(pluckNotes[pluckIndex]);
  const pluckEnvelope = Math.exp(-beatPhase * 7.5);
  const pluck =
    0.065 *
    pluckEnvelope *
    (Math.sin(2 * Math.PI * pluckHz * time) +
      0.35 * Math.sin(2 * Math.PI * pluckHz * 2 * time + 0.25));

  let transition = 0;
  for (const cutTime of cutTimes) {
    const delta = cutTime - time;
    if (delta >= 0 && delta < 0.22) {
      const progress = 1 - delta / 0.22;
      transition += 0.04 * progress ** 2 * highNoise;
    }
    const after = time - cutTime;
    if (after >= 0 && after < 0.08) {
      transition += 0.12 * Math.exp(-after * 48) * Math.sin(2 * Math.PI * 1_400 * after);
    }
  }

  const pan = 0.18 * Math.sin(2 * Math.PI * 0.09 * time);
  const centered = pad + kick + bass + transition;
  const left = centered + hat * (1 - pan) + pluck * (0.82 - pan);
  const right = centered + hat * (1 + pan) + pluck * (0.82 + pan);

  const softClip = (value) => Math.tanh(value * 1.35) * 0.72 * masterFade;
  const leftInt = Math.round(Math.max(-1, Math.min(1, softClip(left))) * 32_767);
  const rightInt = Math.round(Math.max(-1, Math.min(1, softClip(right))) * 32_767);
  const offset = frame * 4;
  pcm.writeInt16LE(leftInt, offset);
  pcm.writeInt16LE(rightInt, offset + 2);
}

const header = Buffer.alloc(44);
header.write("RIFF", 0);
header.writeUInt32LE(36 + pcm.length, 4);
header.write("WAVE", 8);
header.write("fmt ", 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(channelCount, 22);
header.writeUInt32LE(sampleRate, 24);
header.writeUInt32LE(sampleRate * channelCount * 2, 28);
header.writeUInt16LE(channelCount * 2, 32);
header.writeUInt16LE(16, 34);
header.write("data", 36);
header.writeUInt32LE(pcm.length, 40);

fs.writeFileSync(outputPath, Buffer.concat([header, pcm]));
console.log(outputPath);
