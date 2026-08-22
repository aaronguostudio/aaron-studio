# LinkedIn Launch Draft

## Post Copy

DeepSeek open-sourced its agent harness this week. Most coverage read it as a product launch. The more useful read is a management document.

The repo was built in 64 days: 12,293 commits from 37 named authors, and the merge history is full of coding-agent branch names — codex/ alone appears 209 times. Most of the code was not typed by humans. What makes that work isn't the model. It's the operating system around it:

— A process note from day two: agents follow enforced gates far more reliably than written conventions. So every class of mistake that burned them became a pre-release machine check. There are 27 now.

— Every non-trivial change lands with a design note. Rejected proposals stay on file with the reasoning attached, so an agent re-pitching last month's dead idea runs into the recorded argument.

— Postmortems can't end in "lessons learned." They end in a check verified to turn red if the bug comes back.

The economics are the interesting part: documentation-heavy process is bureaucracy in a human team and a guardrail in an agent team, because the writer never gets tired. The line worth stealing: if a machine can check it, a machine checks it — humans keep the calls that need judgment.

I spent a few days inside the repo verifying claims file by file. The full teardown covers the session-log design, the config architecture, and the cache discipline too.

Which of your team's written conventions would survive being turned into an enforced check?

https://www.aaronguo.com/blogs/deepseek-harness-teardown?utm_source=linkedin&utm_medium=social&utm_campaign=deepseek-harness-teardown&utm_content=launch-preview

## Publishing Notes

- Format: direct article link with preview (no native visual exists yet — see distribution-plan.md; revisit if blog-illustrate produces a social crop before launch).
- The UTM URL is the final line; once the preview loads, leave no text after it so LinkedIn hides the long address.
- No hashtags.
- Word count: ~250 (inside the 150–260 band).
- Status: local draft only; do not publish externally.
