---
title: 'Monte Carlo Simulation'
fullName: 'Monte Carlo Simulation'
shortName: 'Monte Carlo'
description: 'Generate many conditional futures to see ranges, tails, and failure paths—without mistaking a model for a forecast.'
mentalModel: 'Do not bet on one future. Sample many coherent futures, run the full model through each one, and read the distribution.'
date: '2026-07-22'
updated: '2026-07-22'
domain: 'Finance & decision science'
domainKey: 'finance-decision-science'
tags: ['uncertainty', 'probability', 'simulation', 'decision-making', 'model-risk']
maturity: 'growing'
published: true
featured: true
translationKey: 'monte-carlo-simulation'
interaction: 'monte-carlo-simulation'
socialImage: '/learn-img/monte-carlo-simulation/og-1200x627.jpg'
socialImageAlt: 'A field of possible paths fans out from one starting point beneath the words Monte Carlo Simulation, illustrating one model producing many conditional futures.'
cardImage: '/learn-img/monte-carlo-simulation/card-4x5.jpg'
cardImageAlt: 'One orange forecast line opens into many possible paths, with the message one forecast to many conditional futures.'
neighbors:
  - name: 'Scenario Analysis'
    fullName: 'Scenario Analysis'
    category: 'narrative method'
    summary: 'Compares a small set of coherent, interpretable futures instead of systematically sampling a large distribution.'
  - name: 'Stress Testing'
    fullName: 'Stress Testing'
    category: 'complementary evidence'
    summary: 'Forces a model through named extreme conditions that an assumed distribution may rarely or never generate.'
  - name: 'Sensitivity Analysis'
    fullName: 'Sensitivity Analysis'
    category: 'diagnostic method'
    summary: 'Shows which assumptions move the answer most; Monte Carlo propagates their joint uncertainty.'
  - name: 'Sequence Risk'
    fullName: 'Sequence-of-Returns Risk'
    category: 'path-dependent risk'
    summary: 'Explains why the order of outcomes matters when withdrawals or other path-dependent cash flows are present.'
  - name: 'Bootstrap'
    fullName: 'Bootstrap Resampling'
    category: 'sampling mechanism'
    summary: 'Resamples observed data and can supply paths to a Monte Carlo model while preserving selected empirical features.'
  - name: 'Model Risk'
    fullName: 'Model Risk'
    category: 'parent risk'
    summary: 'Covers losses caused by flawed structure, inputs, data, assumptions, or inappropriate use of a model.'
sources:
  - title: 'Metropolis & Ulam (1949) · The Monte Carlo Method'
    url: 'https://doi.org/10.1080/01621459.1949.10483310'
  - title: 'NIST · New Tool to Account for Uncertainty'
    url: 'https://www.nist.gov/news-events/news/2020/01/new-tool-account-uncertainty'
  - title: 'FINRA Rule 2214 · Investment Analysis Tools'
    url: 'https://www.finra.org/rules-guidance/rulebooks/finra-rules/2214'
  - title: 'CFP Board · Core Financial Planning Technologies Questionnaire'
    url: 'https://www.cfp.net/-/media/files/cfp-board/standards-and-ethics/compliance-resources/cfp-board-tech-guide-questionnaires-checklist.pdf'
---

# Monte Carlo Simulation

A single forecast makes uncertainty look like a line. Monte Carlo simulation makes it visible as a distribution.

The method repeatedly samples uncertain inputs, sends each sample through the same model, and records the outcome. One run creates one internally consistent possible world. Thousands of runs reveal a range, a median, tails, thresholds, and the paths that fail.

The crucial word is **conditional**. The result describes what happened inside the worlds the model was allowed to generate. It is not a claim that the model has discovered the objective probability of your real future.

## An outdoor event

Suppose you are planning an outdoor event. A forecast of “22°C on average” is not enough to decide whether to rent a tent.

A more useful exercise is to replay the day thousands of times using plausible temperature, rain, and wind conditions—while keeping their relationships intact. Some versions are warm and clear; others are wet, cold, and windy. You can then ask:

- How often does the event cross the failure threshold?
- How bad is the lower tail?
- Which preparation removes the most fragile outcomes?

Monte Carlo simulation applies this same logic to any model with uncertain inputs. The casino supplied the name; disciplined sampling is the actual idea.

## The mechanism

Write the outcome as a model:

```text
Y = f(X₁, X₂, …, Xₖ)
```

`Y` is the result you care about. The `X` values are uncertain inputs. A useful simulation then follows seven steps:

1. **Name the decision and the success condition.** “Assets never run out during 30 years” is testable; “the plan looks good” is not.
2. **Represent input uncertainty.** Define ranges or distributions for returns, demand, prices, growth, costs, inflation, duration, or failure rates.
3. **Represent dependence.** Correlation and causal constraints keep sampled worlds coherent. Individually plausible inputs can form an impossible combination.
4. **Draw one joint sample.** This produces one possible world.
5. **Run the complete model.** Preserve compounding, timing, withdrawals, reinvestment, queues, or whatever makes the path matter.
6. **Repeat.** The outcomes form an empirical distribution.
7. **Read and challenge the distribution.** Report ranges, quantiles, threshold frequency, and failure paths; then change assumptions and add stress tests.

More runs reduce **sampling noise** inside the chosen model. They do not repair a bad model, missing risk, stale data, or an unrealistic distribution.

## A long-horizon funding model

Consider a model that starts with assets `B₀`, makes an inflation-adjusted withdrawal at the beginning of each year, and then applies that year's net portfolio return:

```text
Bₜ = max(0, [Bₜ₋₁ − W₀(1 + π)ᵗ⁻¹] × [1 + Rₜ − f])
```

- `Bₜ` is the year-end balance.
- `W₀` is the first withdrawal.
- `π` is inflation.
- `Rₜ` is the sampled portfolio return.
- `f` is the annual fee.

Each run samples a different sequence of stock and bond returns while preserving the assumed relationship between them. The model then follows the full path. If assets cannot meet a withdrawal, that path is classified as depleted.

Suppose 1,640 of 2,000 runs last the full period. The careful statement is:

> Under these return, volatility, correlation, inflation, fee, timing, and withdrawal assumptions, 82% of the synthetic paths did not deplete.

It is not “this person has an objective 82% chance of success.” The number is better used to compare rule changes under the same assumptions: lower spending, a different allocation, lower costs, more time, or a flexible withdrawal policy.

This page is educational and does not provide personalized investment advice. The interactive outputs are hypothetical and depend entirely on visible model assumptions.

## Why sequence changes the outcome

Without deposits or withdrawals, reordering the same annual returns leaves the final compounded value unchanged. Multiplication does not care about order.

With withdrawals, it does. An early loss reduces the capital base while cash is still leaving the model. A later recovery then compounds on fewer assets. Two paths with the same average return can therefore end very differently.

This is why an average path is often a poor substitute for simulated paths. The average can describe no path that ever occurred, hide temporary depletion, and erase the mechanism that caused failure.

## What to read in the output

The mean is rarely enough. A decision-quality readout usually includes:

- **Median:** the middle simulated outcome, useful as a center but not as a promise.
- **Quantile range:** for example, the 10th to 90th percentile band.
- **Threshold frequency:** the share of sampled worlds crossing a defined failure or target line.
- **Failure timing:** whether problems cluster early, late, or around a particular condition.
- **Tail severity:** how bad outcomes become after the threshold is crossed.
- **Sensitivity:** which assumptions most change the result.

A probability without its condition is an invitation to false precision. Good communication keeps the assumptions beside the output.

## Where it helps

Monte Carlo simulation is useful when:

- several uncertain inputs jointly drive the result;
- the order and timing of events matter;
- the decision depends on a range, tail, or threshold rather than only an average;
- strategies need to be compared under a common set of assumptions; or
- a closed-form solution is unavailable or hides the path.

Examples extend beyond financial models: project schedules, inventory, reliability, queues, energy demand, insurance losses, and measurement uncertainty.

## Where it fails

### Garbage in, distribution out

Professional-looking histograms do not make unsupported inputs credible. The hardest work is often defining plausible worlds, not generating random numbers.

### False precision

`84.7%` may only be a more stable estimate of the chosen model's answer. Assumption error can be much larger than Monte Carlo sampling error.

### Tail blindness

A thin-tailed distribution that never generates liquidity freezes, jumps, regime changes, or correlation spikes cannot reveal those risks. Add explicit stress tests.

### Independence fantasy

Sampling every variable independently can create impossible worlds. Growth, margins, rates, defaults, and asset returns often move together.

### Policy omission

Real people and organizations adapt. They may change spending, prices, staffing, financing, inventory, or project scope. A fixed-policy model can understate or overstate resilience.

### Objective error

A model can optimize the wrong definition of success. Ending just above zero may still violate liquidity, service, safety, or quality constraints along the path.

## Neighboring methods

- **Scenario analysis** tells a small number of coherent stories. It is easier to explain but covers fewer worlds.
- **Stress testing** forces named extreme conditions. It complements simulation when modeled tails are incomplete.
- **Sensitivity analysis** identifies the assumptions worth researching or monitoring. It explains drivers more directly than a distribution alone.
- **Historical simulation** preserves real combinations from observed periods but cannot show conditions absent from the sample.
- **Bootstrap resampling** draws from observed data and can preserve some empirical structure, especially with block methods.
- **A forecast** tries to identify a likely future path. Monte Carlo is usually better at conditional ranges and robustness than at naming the path that will occur.

## Remember these five things

1. Monte Carlo produces many conditional paths, not one privileged forecast.
2. The model, input distributions, dependence, and policy rules define which worlds can exist.
3. Read ranges, tails, threshold frequency, and failure paths—not only the average.
4. More iterations reduce sampling noise, not model risk.
5. Compare decisions under consistent assumptions and pair simulation with sensitivity analysis and stress testing.

## Self-test

1. Why can a fixed 6% annual return behave differently from random paths averaging 6%?
2. What assumptions must accompany a reported “82%” result?
3. Which mistake cannot be repaired by increasing the number of simulations?
4. When should a named stress test be added even if the simulation has a 5th percentile?
5. Which inputs in your model should not be sampled independently?

## Further reading

- [Metropolis & Ulam (1949), “The Monte Carlo Method”](https://doi.org/10.1080/01621459.1949.10483310)
- [National Institute of Standards and Technology · New Tool to Account for Uncertainty](https://www.nist.gov/news-events/news/2020/01/new-tool-account-uncertainty)
- [Financial Industry Regulatory Authority Rule 2214 · Requirements for Investment Analysis Tools](https://www.finra.org/rules-guidance/rulebooks/finra-rules/2214)
- [Certified Financial Planner Board · Core Financial Planning Technologies questionnaire](https://www.cfp.net/-/media/files/cfp-board/standards-and-ethics/compliance-resources/cfp-board-tech-guide-questionnaires-checklist.pdf)
