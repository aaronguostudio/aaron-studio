// Read-only probe. Run after `npm run check` in the SkillDev checkout.
// node reproduce-evaluator-bug.mjs /absolute/path/to/skilldev/code
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const checkout = process.argv[2];
if (!checkout) throw new Error('Pass the SkillDev checkout path.');
const { evaluateOutput } = await import(pathToFileURL(path.join(checkout, 'packages/core/dist/index.js')).href);
const fixture = {
  schemaVersion: '0.1', fixtureId: 'section-boundary-probe', title: 'Decision section isolation',
  input: 'Synthetic evaluator probe; no model invocation.', expectedArtifactPath: 'decision.md',
  passThresholdPercent: 100,
  rubric: [{ id: 'decision-go', label: 'GO appears inside Decision', type: 'section-includes', section: '## Decision', values: ['GO'], points: 1 }],
};
const probes = [
  { id: 'later-section-leak', output: '## Decision\nWAIT\n\n## Notes\nGO', expectedVerdict: 'fail' },
  { id: 'valid-decision', output: '## Decision\nGO\n\n## Notes\nWAIT', expectedVerdict: 'pass' },
  { id: 'absent-go', output: '## Decision\nWAIT\n\n## Notes\nWAIT', expectedVerdict: 'fail' },
  { id: 'missing-section', output: '## Notes\nGO', expectedVerdict: 'fail' },
];
const results = probes.map(probe => {
  const evaluation = evaluateOutput(`probe-${probe.id}`, fixture, probe.output);
  return { ...probe, observedVerdict: evaluation.verdict, matchesExpectation: evaluation.verdict === probe.expectedVerdict, evaluation };
});
const report = { kind: 'deterministic evaluator unit probe; synthetic input, no model generation', observedAt: new Date().toISOString(), checkout: path.resolve(checkout), results };
await writeFile(path.join(path.dirname(fileURLToPath(import.meta.url)), 'evaluator-probe.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ probes: results.length, mismatches: results.filter(r => !r.matchesExpectation).map(r => r.id), results: results.map(({ id, expectedVerdict, observedVerdict }) => ({ id, expectedVerdict, observedVerdict })) }, null, 2));
