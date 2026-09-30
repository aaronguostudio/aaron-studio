// Render review stills for AiBillFilm at chosen seconds: node render-stills.mjs <outDir> <sec> [sec...]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import fs from 'node:fs';

const here = path.dirname(fileURLToPath(import.meta.url));
const remotionRoot = path.resolve(here, '../../..');
const [outDir, ...secs] = process.argv.slice(2);
fs.mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.join(here, 'index.tsx'), publicDir: path.join(remotionRoot, 'public')});
const chromiumOptions = {gl: 'angle'};
const composition = await selectComposition({serveUrl, id: 'AiBillFilm', chromiumOptions});
for (const sec of secs) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(Number(sec) * composition.fps));
  const output = path.join(outDir, `f${String(frame).padStart(5, '0')}-${Number(sec).toFixed(2)}s.png`);
  await renderStill({composition, serveUrl, output, frame, imageFormat: 'png', chromiumOptions});
  console.log(output);
}
