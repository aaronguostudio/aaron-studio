export type SceneTiming = { id: string; title: string; start: number; end: number; template: string; intensity: string };
export type ChapterMark = { seq: string; label: string; at: number };

export const harnessScenes: SceneTiming[] = [
 {
  "id": "s01-cold-open",
  "title": "Same Model, 47 vs 67",
  "start": 0.0,
  "end": 21.3,
  "template": "editorial-statement",
  "intensity": "structured"
 },
 {
  "id": "s02-invisible-layer",
  "title": "The Layer In Between",
  "start": 21.3,
  "end": 52.76,
  "template": "system-map",
  "intensity": "structured"
 },
 {
  "id": "s03-winner-blinked",
  "title": "The Winner Blinked",
  "start": 52.76,
  "end": 83.96,
  "template": "editorial-statement",
  "intensity": "calm"
 },
 {
  "id": "s04-i-went-inside",
  "title": "Fourteen Passes, One Commit",
  "start": 83.96,
  "end": 105.98,
  "template": "editorial-statement",
  "intensity": "structured"
 },
 {
  "id": "s05-how-caching-bills",
  "title": "The Prefix Discount",
  "start": 105.98,
  "end": 127.33,
  "template": "system-map",
  "intensity": "structured"
 },
 {
  "id": "s06-the-lawyer",
  "title": "The Lawyer Re-Reads",
  "start": 127.33,
  "end": 152.3,
  "template": "image-sequence",
  "intensity": "calm"
 },
 {
  "id": "s07-safe-and-key",
  "title": "The Safe and the Key",
  "start": 152.3,
  "end": 159.15,
  "template": "editorial-statement",
  "intensity": "structured"
 },
 {
  "id": "s08-timestamp",
  "title": "One Timestamp, Full Price",
  "start": 159.15,
  "end": 173.73,
  "template": "system-map",
  "intensity": "structured"
 },
 {
  "id": "s09-gross-margin",
  "title": "Their Gross Margin",
  "start": 173.73,
  "end": 191.05,
  "template": "editorial-statement",
  "intensity": "structured"
 },
 {
  "id": "s10-test-refuses",
  "title": "The Test That Refuses",
  "start": 191.05,
  "end": 216.74,
  "template": "system-map",
  "intensity": "structured"
 },
 {
  "id": "s11-ledger-cascade",
  "title": "44 Kinds. 3 Visible.",
  "start": 216.74,
  "end": 236.51,
  "template": "system-map",
  "intensity": "signature"
 },
 {
  "id": "s12-derive-refuse",
  "title": "Derived From the Ledger",
  "start": 236.51,
  "end": 263.67,
  "template": "system-map",
  "intensity": "structured"
 },
 {
  "id": "s13-replay",
  "title": "Replay the Log",
  "start": 263.67,
  "end": 286.34,
  "template": "editorial-statement",
  "intensity": "calm"
 },
 {
  "id": "s14-five-lines",
  "title": "Five Lines",
  "start": 286.34,
  "end": 299.12,
  "template": "editorial-statement",
  "intensity": "structured"
 },
 {
  "id": "s15-one-row-machine",
  "title": "The Whole Machine, One Thread",
  "start": 299.12,
  "end": 319.51,
  "template": "image-sequence",
  "intensity": "calm"
 },
 {
  "id": "s16-disabled-true",
  "title": "disabled: true",
  "start": 319.51,
  "end": 338.91,
  "template": "editorial-statement",
  "intensity": "structured"
 },
 {
  "id": "s17-green-hollow",
  "title": "178 Green Tests",
  "start": 338.91,
  "end": 360.2,
  "template": "system-map",
  "intensity": "structured"
 },
 {
  "id": "s18-27-checks",
  "title": "Bought Back, One Crash at a Time",
  "start": 360.2,
  "end": 377.0,
  "template": "editorial-statement",
  "intensity": "structured"
 },
 {
  "id": "s19-fleet",
  "title": "Twelve Thousand Commits",
  "start": 377.0,
  "end": 401.79,
  "template": "image-sequence",
  "intensity": "calm"
 },
 {
  "id": "s20-markdown",
  "title": "More Markdown Than TypeScript",
  "start": 401.79,
  "end": 415.19,
  "template": "editorial-statement",
  "intensity": "structured"
 },
 {
  "id": "s21-process-os",
  "title": "The Operating System Around It",
  "start": 415.19,
  "end": 462.77,
  "template": "system-map",
  "intensity": "structured"
 },
 {
  "id": "s22-the-catch",
  "title": "The Catch",
  "start": 462.77,
  "end": 489.65,
  "template": "editorial-statement",
  "intensity": "calm"
 },
 {
  "id": "s23-moat-funnel",
  "title": "Moat, Funnel \u2014 My Read",
  "start": 489.65,
  "end": 523.94,
  "template": "system-map",
  "intensity": "structured"
 },
 {
  "id": "s24-what-travels",
  "title": "What Travels",
  "start": 523.94,
  "end": 549.53,
  "template": "system-map",
  "intensity": "structured"
 },
 {
  "id": "s25-rent-churn-own",
  "title": "Rented, Churning, Yours",
  "start": 549.53,
  "end": 574.53,
  "template": "editorial-statement",
  "intensity": "structured"
 },
 {
  "id": "s26-two-shelves",
  "title": "One Hour, Two Columns",
  "start": 574.53,
  "end": 597.22,
  "template": "image-sequence",
  "intensity": "calm"
 },
 {
  "id": "s27-end-card",
  "title": "Brand End Card",
  "start": 597.22,
  "end": 603.22,
  "template": "brand-end-card",
  "intensity": "calm"
 }
];

export const harnessChapters: ChapterMark[] = [
 {
  "seq": "SEQ 00",
  "label": "THE HARNESS",
  "at": 0.0
 },
 {
  "seq": "SEQ 01",
  "label": "THE WINNER BLINKED",
  "at": 52.76
 },
 {
  "seq": "SEQ 02",
  "label": "FOLLOW THE MONEY",
  "at": 105.98
 },
 {
  "seq": "SEQ 03",
  "label": "THE TEST THAT REFUSES",
  "at": 173.73
 },
 {
  "seq": "SEQ 04",
  "label": "44 KINDS \u00b7 3 VISIBLE",
  "at": 216.74
 },
 {
  "seq": "SEQ 05",
  "label": "ONE CONFIG ROW",
  "at": 299.12
 },
 {
  "seq": "SEQ 06",
  "label": "WHO BUILT THIS",
  "at": 377.0
 },
 {
  "seq": "SEQ 07",
  "label": "THE CATCH, AND THE PLAY",
  "at": 462.77
 },
 {
  "seq": "SEQ 08",
  "label": "THE HOUR",
  "at": 523.94
 }
];

export const NARRATION_END_SEC = 597.22;
export const END_CARD_SEC = 6.0;
export const FILM_END_SEC = 603.22;
