# YouTube Script: What I Learned From DeepSeek's Harness

## [HOOK: s01-01-scoreboard-47-67.png]

Not long ago, the same AI model ran thirty real work tasks through eight different setups.

In one setup, it finished two out of every three tasks. In another — same model, same tasks — barely half. And the cost per finished task differed by a factor of seven.

[IMAGE: s01-02-harness-between.png]

Nothing about the intelligence changed. What changed was a layer most of us have never looked at: the harness. The system that sits between you and the model. It assembles everything the model sees, runs its tools, and decides when to stop.

Two days after those numbers landed, DeepSeek open-sourced its harness. All of it. For the first time, we can read this layer end to end.

---

## [SLIDE: The Winner Blinked — s02-01-quote-card.png]

Here is the reaction that convinced me to take a few days for this.

The top scorer in that eight-harness test was Pi. Armin Ronacher — co-founder of the company behind Pi — read DeepSeek's repo and said it was the first time something new in this space made him want to revisit his own choices.

When the winner reads a rival's homework and starts rethinking his own answers, the homework is worth reading.

[IMAGE: 00-cover.png]

So I went inside. Fourteen analysis passes over the source tree, everything pinned to one commit, a few hundred claims checked file by file.

Four designs came out the other side. I'll show you all four — and the one hour of work you should do after watching.

---

## [SLIDE: Follow the Money First — 02-metaphor-contract-reread.png]

Start with the design that touches your bill.

When you send a request, your model provider caches the computation for everything it has already read. Send the same beginning again, byte for byte, and the cached part costs a fraction of full price. At DeepSeek's launch-week prices, a cache hit cost somewhere between one-fiftieth and one-hundred-twentieth of a miss.

Picture a lawyer who bills by the hour. Bring back the same contract with one new clause at the end, and he skips to the new clause. Change one word on page one, and he re-reads everything from that point — full rate.

[IMAGE: s03-02-safe-and-key.png]

Now the part nobody tells you: the provider holds the safe, but your harness holds the key.

[IMAGE: s03-03-clock-full-price.png]

Many frameworks write the current time into the top of the system prompt. It changes every second. The prefix never matches. Every request, full price, forever.

---

## [SLIDE: The Test That Refuses to Lose Money — s03-01-red-build-before-burn.png]

DeepSeek treats this as gross margin, because it is their gross margin. They sell the tokens.

So the harness keeps the clock out of the prompt entirely. Tool descriptions are sorted in one fixed order, so nothing reshuffles. And then the sharpest piece: a live test in their pipeline flatly asserts that every request after a session's first must hit the cache. If any change breaks the prefix, the build goes red before the money burns.

How can they dare to promise that? Because of the strangest design in the repo. It's next.

---

## [SLIDE: 44 Kinds of Events. The Model Sees 3. — 00-cover-v1-candidate-b.png]

Every session in this harness is an append-only log. The repo defines forty-four kinds of events — approvals, config changes, billing, turn boundaries. Exactly three are visible to the model: your messages, its messages, and tool results.

[IMAGE: 01-diagram-log-derive-refuse.png]

And the system never stores the conversation it sends. It recomputes the model's context from the log before every single request — and a runtime check compares the outgoing request against what the log says it should be. Mismatch? It refuses to send.

That's why the cache test can exist: every request is provably an extension of the last one.

[IMAGE: s04-01-replay-rewind.png]

But the everyday superpower is this. When your agent does something inexplicable, you stop guessing. Replay the log to that step, and the exact context the model saw is in front of you. Crash at step eighty? Recompute and continue. Same log, same context, as if nothing happened.

[IMAGE: s04-02-five-line-assertion.png]

You can copy the core of this in five lines: before each model call, compare what you're about to send against what your log says. Refuse on mismatch.

---

## [SLIDE: The Whole Agent Hangs From One Row — s05-01-one-row-machine.png]

Third design. In the default configuration file, the loop that drives the agent — calls the model, runs tools, decides to continue or stop — is one ordinary config row. Add "disabled: true" to that row, and there is no agent. The main loop and a tiny badge plugin are equals in the eyes of the config system.

Their "code mode" makes the point sharper: comments aside, its file is identical to standard mode — plus one appended row. That row alone flips how tools are presented to the model.

[IMAGE: s05-02-green-tests-hollow.png]

The price of this flexibility is written in the repo's own incident reports. Twice, a quiet config mistake silently broke the product — once, one-hundred-seventy-eight green tests and full coverage sat on top of a system that died the moment a real editor connected.

[IMAGE: s05-03-twenty-seven-stamps.png]

Their answer, both times: add a pre-release check that catches that class of mistake. There are twenty-seven of those checks now. That's the bill for "everything is configuration" — paid one crash at a time.

---

## [SLIDE: Who Actually Built This — 03-metaphor-rules-table-fleet.png]

Now the part I spent the most time on.

This repo is twelve thousand two hundred ninety-three commits in sixty-four days. The top contributor made five thousand of them. I counted the branch names in the merge history myself: worktree, two hundred ten times. Codex — the coding agent — two hundred nine.

[IMAGE: s06-01-markdown-outnumbers.png]

There are more markdown files in this repo than TypeScript files. Most of this code was not typed by humans. And the operating system around that fact is the real find.

[IMAGE: s06-02-rejected-freezer.png]

A note from day two states the theory: agents follow enforced checks far more reliably than written conventions — and "too much work" stops being an argument when agents do the work. So every rule that can be machine-checked, is. Rejected proposals go into a freezer, reasoning attached, so an agent re-pitching last month's dead idea runs into the recorded argument. And a postmortem doesn't count until its check is proven to turn red when the bug comes back.

Dense process is bureaucracy in a human team. In an agent team, it's guardrails — because the writer never gets tired.

---

## [SLIDE: The Catch, and the Play — 00-cover.png]

Two honest things before the takeaway.

First, the catch, from DeepSeek's own docs: the loop-runaway guard only sends reminders and eventually goes quiet; the file tools have no timeout at all. Early testers say daily experience still trails Claude Code and Codex. If you need work done this week, this is not your first choice.

[IMAGE: s07-01-moat-vs-funnel.png]

Second, the play — and this is my read, because intent doesn't live in a repo. Anthropic keeps its harness closed, wired to a subscription: a moat around the model. DeepSeek gives its harness away, and makes it read everyone else's file formats: a funnel, for the thing they actually sell — tokens. And notice the side effect: when a vendor adopts its rival's formats, your files become portable. Both directions.

---

## [SLIDE: The Hour You Should Spend — 04-metaphor-two-shelves.png]

So here's what travels, whoever's model you run.

The five-line assertion — context checked against the log before every call. The cache trio — fixed tool order, nothing volatile in the prefix, one test watching for cache hits. And a rejected folder in your own repos — because your agents also re-pitch dead ideas.

Then the bigger sort. Models are rented — built to be swapped. Harnesses are still churning — this repo warns in capital letters that compatibility will break. What's actually yours is the layer every harness reads: your skills, your instruction files, your record of what worked and what you turned down.

[IMAGE: s08-01-two-columns.png]

Spend one hour this week. Two columns: what you can take with you — and what's locked in.

That list will tell you better than any benchmark where your time goes next.

Next in this series: before you type a single word to an agent, you're already paying an entry fee. I'm measuring mine.
