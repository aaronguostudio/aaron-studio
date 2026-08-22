---
title: "When a Shared Currency Meets a National Failure"
date: 2026-09-23
slug: eurozone-failure-domain
category: business-strategy
tags: [greece, eurozone, resilience, agent-governance]
cover: imgs/web/00-cover-v2.webp
---

![Five distinct coastal districts share one aqueduct above a dark cutaway where a rescue boat has no obvious owner](imgs/web/00-cover-v2.webp)

In late 2009, Greece did not discover that it had a small accounting error.

It discovered that the number everyone had been using to judge the country's finances could no longer be trusted.

The estimated 2009 deficit moved from 12.5% of GDP to 13.6%, and later to 15.4%. [The IMF's retrospective record](https://www.elibrary.imf.org/view/journals/002/2013/156/article-A001-en.xml) shows both the scale of the revisions and why they mattered: wider coverage of the public sector, arrears, state entities, and better information all changed the picture.

Fifteen percent is a frightening number. But the more dangerous thing was that investors now had to ask a question that cannot be answered with a spreadsheet alone: if the old numbers were wrong, why should the next numbers be trusted?

That is the moment a fiscal problem became a system problem.

## A country has to refinance before it can recover

Governments do not usually pay every maturing bond from a pile of cash. Old debt matures; new bonds are issued; the proceeds help repay the old bonds. It is refinancing, and it relies on confidence.

When confidence breaks, the loop bends the wrong way.

Fiscal data are revised. Investors demand higher yields or stop lending. Refinancing gets more expensive. The fiscal position worsens. Default risk rises. Confidence falls further.

This is the sovereign-debt doom loop in plain language. It does not mean every country with a large deficit must default. It means trust is not a soft, downstream feeling. It is part of the financing mechanism.

By May 2010, Greece entered a programme of about €110 billion: roughly €80 billion in bilateral euro-area loans and €30 billion from the IMF. [The IMF programme document](https://www.imf.org/external/pubs/ft/scr/2010/cr10110.pdf) makes the scale visible. What had started as a question of fiscal reporting was now entangled with bank exposure, European contagion, taxation, spending, growth, and the legitimacy of outside conditions.

The hard question was no longer just, “Can Greece pay?” It was, “Who owns the failure if it cannot?”

## The euro was a shared runtime

This is where the software analogy is useful—if it stays modest.

The Eurozone shared a currency and a central monetary system. But it did not fully share public debt, taxation, national budgets, political accountability, or the ordinary expectation that one country's taxpayers automatically carry another country's fiscal losses.

Greece had adopted the euro in 2001, and the Bank of Greece became part of the Eurosystem. [The ECB announcement](https://www.ecb.europa.eu/press/pr/date/2001/html/pr010102.en.html) is a good reminder that this was not merely a branding change. Monetary policy now lived at the shared level, while many fiscal decisions and their democratic consequences stayed national.

On the happy path, that arrangement can look elegant. Shared currency lowers friction. A common monetary system can create stability and scale. Countries retain their own political and fiscal choices.

But a failure reveals the seams.

If Greece could not refinance, who should absorb the loss? Greek taxpayers? Taxpayers elsewhere in Europe? The ECB? European banks that held the debt? Institutions that had overseen the rules? There was no answer that was merely economic. Every answer allocated pain, authority, and political legitimacy.

This is why the bailout debate became so bitter. A rescue could create moral hazard: if every failure is absorbed elsewhere, what encourages better behaviour next time? But refusing support could spread fear through banks and sovereign debt markets far beyond Greece.

Rescue was dangerous. Not rescuing could be more dangerous.

## A backstop is not the same as control

It is tempting to say that Greece had “no lender of last resort” because it could not print its own currency. That is too loose.

The Eurosystem does have lender-of-last-resort functions. [The ECB explains the role here](https://www.ecb.europa.eu/ecb-and-you/explainers/tell-me-more/html/what-is-a-lender-of-last-resort.en.html). The sharper point is that Greece did not individually command a national monetary backstop in the way a country with its own currency might imagine doing. The authority, collateral, rules, and political conditions lived inside a larger institution.

In June 2015, this became painfully concrete. After the referendum decision and the non-extension of Greece's adjustment programme, the ECB held the ceiling on emergency liquidity assistance for Greek banks at its 26 June level. [Its 28 June release](https://www.ecb.europa.eu/press/pr/date/2015/html/pr150628.en.html) says exactly that. The ECB's annual report records that Greek authorities imposed a bank holiday amid widespread liquidity outflows.

Again, the point is not that one institution casually pressed a button and caused an outcome. It is that a national crisis was running through a shared system whose emergency controls were not held by the nation experiencing the panic.

## A ratio can worsen while the country cuts

The programme brought spending cuts, tax changes, pension reforms, public-sector changes, and privatisation requirements. Austerity became the word that carried all of this into everyday life.

It is not honest to say austerity alone caused Greece's depression. Greece had entered the crisis with serious fiscal, external, institutional, and competitiveness problems. But it is also not enough to say, “The country needed adjustment,” and leave the arithmetic there.

Debt/GDP has a denominator.

When demand falls, unemployment rises, businesses close, and GDP contracts, the denominator shrinks. Even if debt is being addressed, the ratio can deteriorate. The IMF's later review of the Greek programme acknowledges the extraordinary size of the adjustment and the difficulty of debt dynamics during the contraction. [Its assessment is here](https://www.elibrary.imf.org/view/journals/002/2017/044/article-A001-en.xml).

This is what a failure domain feels like from inside it. Every attempted fix changes another part of the system. A solution that protects one boundary can intensify pressure somewhere else.

## An agent needs a failure contract before it needs more autonomy

Most agent demos still start with capability: it can search, write, call tools, update records, send an email, maybe even deploy.

The Greek story makes me start somewhere else: what happens when it is wrong?

For an agent that can take consequential action, I want a failure-domain contract written before production access:

1. **Trigger:** what condition counts as a failure or an unsafe state?
2. **Owner:** which accountable person or team owns the incident?
3. **Authority:** who can pause, override, or escalate it?
4. **Cost bearer:** who absorbs the time, money, customer harm, or compute cost?
5. **Containment:** what is the blast radius, and how is it limited?
6. **Recovery:** what can be rolled back, repaired, or restored?
7. **Learning:** what evidence changes the next run, policy, or evaluation?

This is not bureaucracy added after the clever part. It is the clever part, once actions have consequences.

A shared agent platform can look excellent when every tool call succeeds. The architecture becomes real when a tool writes the wrong record, a payment goes to the wrong place, a deployment damages production, or an agent confidently continues after the world has changed.

Happy paths show performance. Failure modes show architecture.

---

*This is Part II of a series on decision systems. Next: 61% of Greek voters said No in 2015. Why did the government sign a new agreement anyway?*
