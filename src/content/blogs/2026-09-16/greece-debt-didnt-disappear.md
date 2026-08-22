---
title: "The Debt Didn't Disappear. Greece Moved It Into the Future."
date: 2026-09-16
slug: greece-debt-didnt-disappear
category: business-strategy
tags: [greece, metrics, agent-evaluation, decision-systems]
cover: imgs/web/00-cover-v2.webp
---

![A blank ledger on a Mediterranean worktable, its amber page travelling through an arch toward a Greek island](imgs/web/00-cover-v2.webp)

I came back from Greece with a question that did not belong on a family itinerary.

Somewhere between the ruins, the ferry schedules, and the small travel problems that AI was good at helping us untangle, I kept seeing the old story about Goldman Sachs and Greek debt. The version that travels well is dramatic: a bank used clever derivatives to make debt disappear, Greece got into the euro, and then the whole thing collapsed.

It is a satisfying story because it has a villain, a trick, and a later punishment that never quite arrives.

It is also too neat.

The more interesting truth is less cinematic: a number changed, an obligation did not simply vanish, and a large system had left too much room for everyone to own only one small part of the result.

That is why the story stayed with me. It is not only a story about Greece. It is a story about what happens when a measure becomes a target.

## First, the timing matters

One correction makes the story more useful. Greece did not use the famous Goldman transaction to get into the euro.

The EU Council had already agreed that Greece qualified to participate on 19 June 2000. Greece adopted the euro on 1 January 2001. The ECB's own account of the period is clear about both dates. [The June decision](https://www.ecb.europa.eu/pub/pdf/other/pp35_41_mb200101en.pdf) came before [Greece joined the euro area](https://www.ecb.europa.eu/press/pr/date/2001/html/pr010102.en.html).

According to a Reuters report on Goldman's 2010 statement, Greece conducted or restructured cross-currency swaps with Goldman in December 2000 and June 2001. Goldman said the transactions used historical implied exchange rates and reduced Greece's foreign-currency debt in euro terms by €2.367 billion. On that presentation, Debt/GDP fell from 105.3% to 103.7%—a 1.6-point change. [Reuters reported the details here](https://www.investing.com/news/forex-news/goldman-sachs-details-2001-greek-derivative-trades-121207).

Those dates do not make the transaction uninteresting. They make it harder to turn into a bedtime story about one bank slipping a country through one door.

## A lower number is not always a smaller obligation

The transaction is technically complicated. The useful idea is not.

Imagine a rule that says your household debt must stay below $500,000. You really owe $600,000. A financial contract changes how $100,000 of that burden shows up today: the balance sheet now displays $500,000, while later payments are embedded in a future contract.

The classification changed. Your economic life did not suddenly become $100,000 lighter.

That is deliberately a simplified analogy, not a reconstruction of Greece's contracts. But it gets to the point. A debt statistic is a measurement system. It tells us something important, but it is not the same thing as fiscal sustainability itself.

Goldman said the swaps were consistent with Eurostat principles at the time. Later, Eurostat identified uncertainty around the reporting of off-market swaps and the possibility of revisions. [Its 2010 note](https://ec.europa.eu/eurostat/documents/2995521/5046142/2-22042010-BP-EN.PDF/0ff48307-d545-4fd6-8281-a621cbda385d?version=1.0) is a useful reminder that the statistical boundary was not a settled, invisible technical detail.

This is where the usual question—*why wasn't Goldman punished?*—starts to become less satisfying than the system question.

In a 2015 answer to the European Parliament, the European Commission said that reporting public finances to the Commission is the responsibility of member states, and that it is not involved in the relationship between a member state and its advisers. [That answer is here](https://www.europarl.europa.eu/doceo/document/E-8-2015-012215-ASW_EN.html). It does not close the ethical debate. It does show why a tidy accountability story was hard to find.

One actor could discuss a transaction. Another could discuss national reporting. Another could discuss statistical rules. Another could discuss supervision. A system can have many people touching the truth without anyone being responsible for the whole picture.

## The target quietly replaces the purpose

Europe did not care about Debt/GDP because it loved ratios. The ratio was meant to stand in for something bigger: whether a country could carry its obligations sustainably.

But once a proxy becomes a condition of eligibility, a political symbol, or a target with consequences, it stops being merely descriptive. It starts shaping behaviour.

The question inside the system changes.

Instead of: *How do we improve fiscal sustainability?*

It becomes: *How do we improve the number that represents fiscal sustainability?*

Sometimes those questions point in the same direction. Often they do not.

Software teams know the pattern. Set a target of 100 story points per sprint and you may get more points, not more useful product. Reward a support team for keeping calls under five minutes and you may get shorter calls, not solved problems. Optimise a consumer product only for engagement and you may get more attention while making the product worse for the people inside it.

None of this requires bad people. It requires a visible score and an incentive to move it.

That is the practical force behind Goodhart's Law. When a measure becomes a target, intelligent participants begin to optimise the measure. The failure is not measurement. The failure is forgetting that the measure is standing in for a reality it cannot fully contain.

## Agents make this problem more immediate

This is also why I am wary of agent evaluation that sounds precise too early.

“Resolve the maximum number of tickets” is measurable. It may also teach an agent to close tickets quickly, route difficult ones away, or write a convincing answer before the customer's problem is actually resolved.

“Minimise cost per task” can teach an agent to take the cheapest path even when a high-risk task needs a slower review. “Maximise autonomous completion” can teach it to avoid escalation—the very behaviour that would make the system safer.

The model does not need a moral flaw to do this. It only needs to be competent at the goal we gave it.

That is why the first design question is not, “Can we measure this?” It is, “What behaviour will this measure make attractive?”

For every important metric, I now want three lines written beside it:

1. **Metric:** what number are we rewarding or watching?
2. **Behaviour:** what shortcut, trade-off, or gaming behaviour would improve it?
3. **Reality check:** what independent evidence would tell us that the underlying outcome improved too?

For ticket resolution, the reality check may be reopen rate, follow-up customer feedback, and a sample of difficult cases. For an engineering agent, it may be test quality, rollback rate, reviewer confidence, and production behaviour—not merely a count of merged pull requests.

The point is not to make every system suspicious of every number. That would be another kind of theatre. The point is to keep the number in conversation with the thing it was hired to represent.

## The debt did not disappear

The Greek story is not a parable in which one clever swap explains a country's crisis. Greece's later problems involved fiscal reporting, borrowing, growth, competitiveness, institutions, banks, creditors, and political choices. Anyone who makes one line of derivatives carry the whole story is simplifying in the wrong direction.

But the smaller story still matters.

An obligation can be moved across a reporting boundary. A metric can improve while the reality it was meant to track remains unsettled. And a complex system can make accountability diffuse enough that every participant has a partial answer.

That is a useful warning for anyone building with agents.

Never confuse measurable success with actual success.

The dashboard should make us curious. It should not make us stop looking.

---

*This is Part I of a series on decision systems. The next piece asks a different question: when a shared system fails, who owns the failure?*
