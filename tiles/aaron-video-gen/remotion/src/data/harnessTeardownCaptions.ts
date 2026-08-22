export type LedgerCaption = { start: number; end: number; text: string };

export const ledgerCaptions: LedgerCaption[] = [
 {
  "start": 0.0,
  "end": 3.251,
  "text": "Not long ago, the same AI model ran thirty"
 },
 {
  "start": 3.355,
  "end": 7.001,
  "text": "real work tasks through eight different setups."
 },
 {
  "start": 7.419,
  "end": 10.379,
  "text": "In one setup, it finished two out of every"
 },
 {
  "start": 10.437,
  "end": 12.864,
  "text": "three tasks. In another —"
 },
 {
  "start": 12.98,
  "end": 15.128,
  "text": "same model, same tasks —"
 },
 {
  "start": 15.232,
  "end": 19.261,
  "text": "barely half. And the cost per finished task differed"
 },
 {
  "start": 19.331,
  "end": 21.13,
  "text": "by a factor of seven."
 },
 {
  "start": 22.257,
  "end": 24.451,
  "text": "Nothing about the intelligence changed."
 },
 {
  "start": 25.415,
  "end": 27.771,
  "text": "What changed was a layer most of us have"
 },
 {
  "start": 27.818,
  "end": 29.966,
  "text": "never looked at: the harness."
 },
 {
  "start": 30.407,
  "end": 32.833,
  "text": "The system that sits between you and the model."
 },
 {
  "start": 33.542,
  "end": 35.701,
  "text": "It assembles everything the model sees,"
 },
 {
  "start": 35.945,
  "end": 39.37,
  "text": "runs its tools, and decides when to stop."
 },
 {
  "start": 40.183,
  "end": 42.772,
  "text": "Two days after those numbers landed,"
 },
 {
  "start": 43.468,
  "end": 45.988,
  "text": "DeepSeek open-sourced its harness."
 },
 {
  "start": 46.8,
  "end": 49.598,
  "text": "All of it. For the first time,"
 },
 {
  "start": 49.772,
  "end": 52.756,
  "text": "we can read this layer end to end."
 },
 {
  "start": 52.756,
  "end": 55.299,
  "text": "Here is the reaction that convinced me to take"
 },
 {
  "start": 55.345,
  "end": 56.773,
  "text": "a few days for this."
 },
 {
  "start": 57.806,
  "end": 61.301,
  "text": "The top scorer in that eight-harness test was Pi."
 },
 {
  "start": 62.183,
  "end": 66.189,
  "text": "Armin Ronacher — co-founder of the company behind Pi"
 },
 {
  "start": 66.491,
  "end": 70.427,
  "text": "— read DeepSeek's repo and said it was the"
 },
 {
  "start": 70.485,
  "end": 73.527,
  "text": "first time something new in this space made him"
 },
 {
  "start": 73.631,
  "end": 75.837,
  "text": "want to revisit his own choices."
 },
 {
  "start": 76.975,
  "end": 80.005,
  "text": "When the winner reads a rival's homework and starts"
 },
 {
  "start": 80.098,
  "end": 82.037,
  "text": "rethinking his own answers,"
 },
 {
  "start": 82.478,
  "end": 84.243,
  "text": "the homework is worth reading."
 },
 {
  "start": 85.218,
  "end": 86.6,
  "text": "So I went inside."
 },
 {
  "start": 87.738,
  "end": 91.0,
  "text": "Fourteen analysis passes over the source tree,"
 },
 {
  "start": 91.488,
  "end": 93.694,
  "text": "everything pinned to one commit,"
 },
 {
  "start": 94.262,
  "end": 97.084,
  "text": "a few hundred claims checked file by file."
 },
 {
  "start": 97.85,
  "end": 100.137,
  "text": "Four designs came out the other side."
 },
 {
  "start": 100.706,
  "end": 102.389,
  "text": "I'll show you all four —"
 },
 {
  "start": 102.54,
  "end": 104.677,
  "text": "and the one hour of work you should do"
 },
 {
  "start": 104.758,
  "end": 105.977,
  "text": "after watching."
 },
 {
  "start": 105.976,
  "end": 108.426,
  "text": "Start with the design that touches your bill."
 },
 {
  "start": 109.598,
  "end": 111.177,
  "text": "When you send a request,"
 },
 {
  "start": 111.804,
  "end": 115.694,
  "text": "your model provider caches the computation for everything it"
 },
 {
  "start": 115.74,
  "end": 119.838,
  "text": "has already read. Send the same beginning again,"
 },
 {
  "start": 120.024,
  "end": 123.043,
  "text": "byte for byte, and the cached part costs a"
 },
 {
  "start": 123.113,
  "end": 124.599,
  "text": "fraction of full price."
 },
 {
  "start": 125.586,
  "end": 127.815,
  "text": "At DeepSeek's launch-week prices,"
 },
 {
  "start": 128.151,
  "end": 133.527,
  "text": "a cache hit cost somewhere between one-fiftieth and one-hundred-twentieth"
 },
 {
  "start": 133.863,
  "end": 137.288,
  "text": "of a miss. Picture a lawyer who bills by"
 },
 {
  "start": 137.346,
  "end": 140.818,
  "text": "the hour. Bring back the same contract with one"
 },
 {
  "start": 140.876,
  "end": 142.281,
  "text": "new clause at the end,"
 },
 {
  "start": 142.861,
  "end": 145.032,
  "text": "and he skips to the new clause."
 },
 {
  "start": 145.822,
  "end": 147.888,
  "text": "Change one word on page one,"
 },
 {
  "start": 148.388,
  "end": 151.313,
  "text": "and he re-reads everything from that point —"
 },
 {
  "start": 151.429,
  "end": 155.098,
  "text": "full rate. Now the part nobody tells you:"
 },
 {
  "start": 155.888,
  "end": 157.675,
  "text": "the provider holds the safe,"
 },
 {
  "start": 158.047,
  "end": 159.835,
  "text": "but your harness holds the key."
 },
 {
  "start": 160.276,
  "end": 163.434,
  "text": "Many frameworks write the current time into the top"
 },
 {
  "start": 163.515,
  "end": 165.048,
  "text": "of the system prompt."
 },
 {
  "start": 165.489,
  "end": 167.242,
  "text": "It changes every second."
 },
 {
  "start": 167.683,
  "end": 169.727,
  "text": "The prefix never matches."
 },
 {
  "start": 170.168,
  "end": 172.362,
  "text": "Every request, full price,"
 },
 {
  "start": 172.571,
  "end": 173.732,
  "text": "forever."
 },
 {
  "start": 173.732,
  "end": 176.379,
  "text": "DeepSeek treats this as gross margin,"
 },
 {
  "start": 176.576,
  "end": 178.678,
  "text": "because it is their gross margin."
 },
 {
  "start": 179.154,
  "end": 180.64,
  "text": "They sell the tokens."
 },
 {
  "start": 180.872,
  "end": 183.194,
  "text": "So the harness keeps the clock out of the"
 },
 {
  "start": 183.264,
  "end": 188.117,
  "text": "prompt entirely. Tool descriptions are sorted in one fixed"
 },
 {
  "start": 188.221,
  "end": 190.555,
  "text": "order, so nothing reshuffles."
 },
 {
  "start": 191.321,
  "end": 193.144,
  "text": "And then the sharpest piece:"
 },
 {
  "start": 193.504,
  "end": 197.486,
  "text": "a live test in their pipeline flatly asserts that"
 },
 {
  "start": 197.602,
  "end": 201.375,
  "text": "every request after a session's first must hit the"
 },
 {
  "start": 201.445,
  "end": 205.23,
  "text": "cache. If any change breaks the prefix,"
 },
 {
  "start": 205.369,
  "end": 207.981,
  "text": "the build goes red before the money burns."
 },
 {
  "start": 208.469,
  "end": 210.582,
  "text": "How can they dare to promise that?"
 },
 {
  "start": 211.395,
  "end": 214.541,
  "text": "Because of the strangest design in the repo."
 },
 {
  "start": 215.145,
  "end": 216.735,
  "text": "It's next."
 },
 {
  "start": 216.735,
  "end": 220.381,
  "text": "Every session in this harness is an append-only log."
 },
 {
  "start": 220.926,
  "end": 223.968,
  "text": "The repo defines forty-four kinds of events —"
 },
 {
  "start": 224.049,
  "end": 227.381,
  "text": "approvals, config changes, billing,"
 },
 {
  "start": 227.637,
  "end": 231.549,
  "text": "turn boundaries. Exactly three are visible to the model:"
 },
 {
  "start": 232.002,
  "end": 234.184,
  "text": "your messages, its messages,"
 },
 {
  "start": 234.382,
  "end": 238.155,
  "text": "and tool results. And the system never stores the"
 },
 {
  "start": 238.225,
  "end": 243.612,
  "text": "conversation it sends. It recomputes the model's context from"
 },
 {
  "start": 243.728,
  "end": 246.34,
  "text": "the log before every single request —"
 },
 {
  "start": 247.118,
  "end": 250.705,
  "text": "and a runtime check compares the outgoing request against"
 },
 {
  "start": 250.821,
  "end": 252.586,
  "text": "what the log says it should be."
 },
 {
  "start": 253.062,
  "end": 255.965,
  "text": "Mismatch? It refuses to send."
 },
 {
  "start": 256.441,
  "end": 258.751,
  "text": "That's why the cache test can exist:"
 },
 {
  "start": 259.308,
  "end": 262.872,
  "text": "every request is provably an extension of the last"
 },
 {
  "start": 262.954,
  "end": 266.773,
  "text": "one. But the everyday superpower is this."
 },
 {
  "start": 267.331,
  "end": 270.013,
  "text": "When your agent does something inexplicable,"
 },
 {
  "start": 270.187,
  "end": 274.32,
  "text": "you stop guessing. Replay the log to that step,"
 },
 {
  "start": 274.703,
  "end": 277.188,
  "text": "and the exact context the model saw is in"
 },
 {
  "start": 277.258,
  "end": 280.462,
  "text": "front of you. Crash at step eighty?"
 },
 {
  "start": 280.903,
  "end": 283.539,
  "text": "Recompute and continue. Same log,"
 },
 {
  "start": 283.573,
  "end": 286.36,
  "text": "same context, as if nothing happened."
 },
 {
  "start": 286.801,
  "end": 289.088,
  "text": "You can copy the core of this in five"
 },
 {
  "start": 289.146,
  "end": 292.327,
  "text": "lines: before each model call,"
 },
 {
  "start": 292.768,
  "end": 295.264,
  "text": "compare what you're about to send against what your"
 },
 {
  "start": 295.346,
  "end": 299.119,
  "text": "log says. Refuse on mismatch."
 },
 {
  "start": 299.119,
  "end": 303.45,
  "text": "Third design. In the default configuration file,"
 },
 {
  "start": 303.589,
  "end": 305.412,
  "text": "the loop that drives the agent —"
 },
 {
  "start": 305.528,
  "end": 307.815,
  "text": "calls the model, runs tools,"
 },
 {
  "start": 307.966,
  "end": 309.998,
  "text": "decides to continue or stop —"
 },
 {
  "start": 310.079,
  "end": 311.983,
  "text": "is one ordinary config row."
 },
 {
  "start": 312.981,
  "end": 315.466,
  "text": "Add \"disabled: true\" to that row,"
 },
 {
  "start": 315.652,
  "end": 316.999,
  "text": "and there is no agent."
 },
 {
  "start": 318.02,
  "end": 321.19,
  "text": "The main loop and a tiny badge plugin are"
 },
 {
  "start": 321.236,
  "end": 323.756,
  "text": "equals in the eyes of the config system."
 },
 {
  "start": 324.94,
  "end": 327.784,
  "text": "Their \"code mode\" makes the point sharper:"
 },
 {
  "start": 328.179,
  "end": 331.813,
  "text": "comments aside, its file is identical to standard mode"
 },
 {
  "start": 331.918,
  "end": 333.741,
  "text": "— plus one appended row."
 },
 {
  "start": 334.484,
  "end": 337.189,
  "text": "That row alone flips how tools are presented to"
 },
 {
  "start": 337.27,
  "end": 341.45,
  "text": "the model. The price of this flexibility is written"
 },
 {
  "start": 341.531,
  "end": 344.155,
  "text": "in the repo's own incident reports."
 },
 {
  "start": 345.072,
  "end": 349.182,
  "text": "Twice, a quiet config mistake silently broke the product"
 },
 {
  "start": 349.344,
  "end": 354.604,
  "text": "— once, one-hundred-seventy-eight green tests and full coverage sat"
 },
 {
  "start": 354.685,
  "end": 357.623,
  "text": "on top of a system that died the moment"
 },
 {
  "start": 357.704,
  "end": 359.643,
  "text": "a real editor connected."
 },
 {
  "start": 360.247,
  "end": 362.278,
  "text": "Their answer, both times:"
 },
 {
  "start": 362.882,
  "end": 366.202,
  "text": "add a pre-release check that catches that class of"
 },
 {
  "start": 366.353,
  "end": 370.475,
  "text": "mistake. There are twenty-seven of those checks now."
 },
 {
  "start": 370.684,
  "end": 374.167,
  "text": "That's the bill for \"everything is configuration\" —"
 },
 {
  "start": 374.249,
  "end": 377.0,
  "text": "paid one crash at a time."
 },
 {
  "start": 376.999,
  "end": 379.321,
  "text": "Now the part I spent the most time on."
 },
 {
  "start": 380.459,
  "end": 384.627,
  "text": "This repo is twelve thousand two hundred ninety-three commits"
 },
 {
  "start": 384.696,
  "end": 388.899,
  "text": "in sixty-four days. The top contributor made five thousand"
 },
 {
  "start": 388.957,
  "end": 392.034,
  "text": "of them. I counted the branch names in the"
 },
 {
  "start": 392.115,
  "end": 395.018,
  "text": "merge history myself: worktree,"
 },
 {
  "start": 395.18,
  "end": 396.817,
  "text": "two hundred ten times."
 },
 {
  "start": 397.398,
  "end": 399.755,
  "text": "Codex — the coding agent —"
 },
 {
  "start": 399.871,
  "end": 403.888,
  "text": "two hundred nine. There are more markdown files in"
 },
 {
  "start": 403.957,
  "end": 406.488,
  "text": "this repo than TypeScript files."
 },
 {
  "start": 407.069,
  "end": 410.029,
  "text": "Most of this code was not typed by humans."
 },
 {
  "start": 410.795,
  "end": 413.257,
  "text": "And the operating system around that fact is the"
 },
 {
  "start": 413.349,
  "end": 416.925,
  "text": "real find. A note from day two states the"
 },
 {
  "start": 416.995,
  "end": 422.336,
  "text": "theory: agents follow enforced checks far more reliably than"
 },
 {
  "start": 422.405,
  "end": 426.573,
  "text": "written conventions — and \"too much work\" stops being"
 },
 {
  "start": 426.62,
  "end": 429.221,
  "text": "an argument when agents do the work."
 },
 {
  "start": 430.37,
  "end": 432.541,
  "text": "So every rule that can be machine-checked,"
 },
 {
  "start": 432.587,
  "end": 436.221,
  "text": "is. Rejected proposals go into a freezer,"
 },
 {
  "start": 436.779,
  "end": 441.504,
  "text": "reasoning attached, so an agent re-pitching last month's dead"
 },
 {
  "start": 441.574,
  "end": 444.279,
  "text": "idea runs into the recorded argument."
 },
 {
  "start": 445.173,
  "end": 448.517,
  "text": "And a postmortem doesn't count until its check is"
 },
 {
  "start": 448.633,
  "end": 451.663,
  "text": "proven to turn red when the bug comes back."
 },
 {
  "start": 452.476,
  "end": 456.017,
  "text": "Dense process is bureaucracy in a human team."
 },
 {
  "start": 456.83,
  "end": 458.06,
  "text": "In an agent team,"
 },
 {
  "start": 458.118,
  "end": 462.774,
  "text": "it's guardrails — because the writer never gets tired."
 },
 {
  "start": 462.774,
  "end": 465.096,
  "text": "Two honest things before the takeaway."
 },
 {
  "start": 466.222,
  "end": 469.461,
  "text": "First, the catch, from DeepSeek's own docs:"
 },
 {
  "start": 470.286,
  "end": 473.954,
  "text": "the loop-runaway guard only sends reminders and eventually goes"
 },
 {
  "start": 474.024,
  "end": 478.274,
  "text": "quiet; the file tools have no timeout at all."
 },
 {
  "start": 479.4,
  "end": 482.732,
  "text": "Early testers say daily experience still trails Claude Code"
 },
 {
  "start": 482.767,
  "end": 486.412,
  "text": "and Codex. If you need work done this week,"
 },
 {
  "start": 486.552,
  "end": 488.444,
  "text": "this is not your first choice."
 },
 {
  "start": 489.593,
  "end": 491.103,
  "text": "Second, the play —"
 },
 {
  "start": 491.207,
  "end": 492.484,
  "text": "and this is my read,"
 },
 {
  "start": 492.705,
  "end": 495.224,
  "text": "because intent doesn't live in a repo."
 },
 {
  "start": 496.373,
  "end": 498.463,
  "text": "Anthropic keeps its harness closed,"
 },
 {
  "start": 498.591,
  "end": 500.123,
  "text": "wired to a subscription:"
 },
 {
  "start": 500.646,
  "end": 502.364,
  "text": "a moat around the model."
 },
 {
  "start": 503.316,
  "end": 505.359,
  "text": "DeepSeek gives its harness away,"
 },
 {
  "start": 505.684,
  "end": 508.506,
  "text": "and makes it read everyone else's file formats:"
 },
 {
  "start": 509.028,
  "end": 512.023,
  "text": "a funnel, for the thing they actually sell —"
 },
 {
  "start": 512.407,
  "end": 515.96,
  "text": "tokens. And notice the side effect:"
 },
 {
  "start": 516.285,
  "end": 519.141,
  "text": "when a vendor adopts its rival's formats,"
 },
 {
  "start": 519.582,
  "end": 521.765,
  "text": "your files become portable."
 },
 {
  "start": 522.09,
  "end": 523.936,
  "text": "Both directions."
 },
 {
  "start": 523.935,
  "end": 525.479,
  "text": "So here's what travels,"
 },
 {
  "start": 525.549,
  "end": 527.302,
  "text": "whoever's model you run."
 },
 {
  "start": 527.952,
  "end": 529.589,
  "text": "The five-line assertion —"
 },
 {
  "start": 530.065,
  "end": 533.664,
  "text": "context checked against the log before every call."
 },
 {
  "start": 534.082,
  "end": 535.313,
  "text": "The cache trio —"
 },
 {
  "start": 535.417,
  "end": 538.97,
  "text": "fixed tool order, nothing volatile in the prefix,"
 },
 {
  "start": 539.272,
  "end": 541.374,
  "text": "one test watching for cache hits."
 },
 {
  "start": 542.256,
  "end": 545.286,
  "text": "And a rejected folder in your own repos —"
 },
 {
  "start": 545.483,
  "end": 548.583,
  "text": "because your agents also re-pitch dead ideas."
 },
 {
  "start": 549.466,
  "end": 550.766,
  "text": "Then the bigger sort."
 },
 {
  "start": 551.405,
  "end": 552.751,
  "text": "Models are rented —"
 },
 {
  "start": 553.158,
  "end": 554.342,
  "text": "built to be swapped."
 },
 {
  "start": 555.096,
  "end": 556.838,
  "text": "Harnesses are still churning —"
 },
 {
  "start": 557.477,
  "end": 561.134,
  "text": "this repo warns in capital letters that compatibility will"
 },
 {
  "start": 561.192,
  "end": 566.068,
  "text": "break. What's actually yours is the layer every harness"
 },
 {
  "start": 566.184,
  "end": 570.445,
  "text": "reads: your skills, your instruction files,"
 },
 {
  "start": 570.828,
  "end": 573.475,
  "text": "your record of what worked and what you turned"
 },
 {
  "start": 573.51,
  "end": 576.25,
  "text": "down. Spend one hour this week."
 },
 {
  "start": 576.575,
  "end": 579.315,
  "text": "Two columns: what you can take with you —"
 },
 {
  "start": 579.35,
  "end": 580.929,
  "text": "and what's locked in."
 },
 {
  "start": 581.533,
  "end": 584.54,
  "text": "That list will tell you better than any benchmark"
 },
 {
  "start": 584.656,
  "end": 586.931,
  "text": "where your time goes next."
 },
 {
  "start": 587.535,
  "end": 589.207,
  "text": "Next in this series:"
 },
 {
  "start": 589.59,
  "end": 592.388,
  "text": "before you type a single word to an agent,"
 },
 {
  "start": 592.632,
  "end": 595.082,
  "text": "you're already paying an entry fee."
 },
 {
  "start": 595.685,
  "end": 597.218,
  "text": "I'm measuring mine."
 }
];
