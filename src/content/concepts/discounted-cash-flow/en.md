---
title: 'Discounted Cash Flow'
fullName: 'Discounted Cash Flow Valuation'
shortName: 'DCF'
description: 'Translate future cash flows, time, and risk into a conditional estimate of value today.'
mentalModel: 'A DCF is a translator: future cash flow + time + risk → value today.'
date: '2026-07-23'
updated: '2026-07-23'
domain: 'Finance & valuation'
domainKey: 'finance-valuation'
tags: ['valuation', 'present-value', 'free-cash-flow', 'cost-of-capital', 'terminal-value']
maturity: 'growing'
published: true
featured: true
translationKey: 'discounted-cash-flow'
interaction: 'discounted-cash-flow'
socialImage: '/learn-img/discounted-cash-flow/og-1200x627.jpg'
socialImageAlt: 'An English editorial diagram showing future cash-flow bars being discounted into smaller present-value blocks, beside the title Discounted Cash Flow.'
cardImage: '/learn-img/discounted-cash-flow/card-4x5.jpg'
cardImageAlt: 'An English editorial card titled Discounted Cash Flow, showing future cash-flow bars translated through time and risk into present value.'
neighbors:
  - name: 'Present Value'
    fullName: 'Present Value'
    category: 'mathematical mechanism'
    summary: 'Converts one future amount into today’s units; DCF applies that mechanism to a complete cash-flow stream.'
  - name: 'Free Cash Flow'
    fullName: 'Free Cash Flow'
    category: 'core input'
    summary: 'Connects operating profit, taxes, reinvestment, and working capital to cash available to capital providers.'
  - name: 'WACC'
    fullName: 'Weighted Average Cost of Capital'
    category: 'discount-rate input'
    summary: 'Supplies a blended required return that matches free cash flow to the firm.'
  - name: 'Terminal Value'
    fullName: 'Terminal Value'
    category: 'long-horizon approximation'
    summary: 'Compresses all cash flows after the explicit forecast period into one value at the horizon.'
  - name: 'Sensitivity Analysis'
    fullName: 'Sensitivity Analysis'
    category: 'diagnostic method'
    summary: 'Shows which assumptions move the conditional valuation most.'
  - name: 'Monte Carlo'
    fullName: 'Monte Carlo Simulation'
    category: 'uncertainty layer'
    summary: 'Runs the DCF value function across many coherent input sets to produce a conditional distribution.'
sources:
  - title: 'Aswath Damodaran · Basics of Discounted Cash Flow Valuation'
    url: 'https://pages.stern.nyu.edu/~adamodar/pdfiles/basics.pdf'
  - title: 'CFA Institute · Free Cash Flow Valuation'
    url: 'https://www.cfainstitute.org/insights/professional-learning/refresher-readings/2026/free-cash-flow-valuation'
  - title: 'Robert S. Harris · Fundamentals of Discounted Cash Flow'
    url: 'https://doi.org/10.2139/ssrn.909070'
  - title: 'Myron J. Gordon · Dividends, Earnings, and Stock Prices'
    url: 'https://doi.org/10.2307/1927792'
---

# Discounted Cash Flow

Discounted Cash Flow (DCF) valuation asks a simple but demanding question: **what are future distributable cash flows worth today, after accounting for when they arrive and the return required for bearing their risk?**

The answer is not a hidden “correct price.” It is a conditional sentence:

> If these operating, reinvestment, timing, and risk assumptions hold, the estimated value is approximately this amount.

That distinction is the heart of the method. A spreadsheet can calculate precisely while the assumptions remain deeply uncertain.

## A machine that produces cash coupons

Imagine buying a machine that produces one cash coupon every year.

A seller might say the machine will generate `$1,000` over ten years. But adding the coupons without adjustment would treat `$100` next year as equal to `$100` ten years from now.

You would instead stamp each coupon with a discount for waiting and risk:

- a later coupon is worth less today;
- a less certain coupon requires a higher return and is worth less today;
- after discounting every coupon into the same “today” unit, you add them.

That is the intuition behind DCF. A real valuation adds the difficult parts: taxes, reinvestment, capital structure, a terminal period, and consistent definitions.

## First choose whose cash flow you are valuing

The first decision is not the growth rate. It is the capital claim.

- **Free Cash Flow to the Firm (FCFF)** belongs to debt and equity capital providers together. It is commonly discounted using the **Weighted Average Cost of Capital (WACC)** to estimate Enterprise Value.
- **Free Cash Flow to Equity (FCFE)** belongs only to common equity holders. It is discounted using the cost of equity to estimate Equity Value directly.

The cash-flow definition and discount rate must match. Discounting FCFF at the cost of equity, or FCFE at WACC, mixes up who receives the cash and who bears the risk.

The interactive model on this page uses FCFF, WACC, and a simplified net-debt bridge.

## Build the explicit forecast

A common FCFF bridge begins with Earnings Before Interest and Taxes (EBIT):

```text
FCFF
= EBIT × (1 − tax rate)
+ Depreciation & Amortization
− Capital Expenditure
− Change in Net Working Capital
```

The bridge exposes a constraint that optimistic stories often hide: **growth is not free**. More revenue may require inventory, receivables, equipment, research, distribution, or other reinvestment before it becomes distributable cash.

For each year `t`, discount the forecast cash flow:

```text
Present Value of FCFFₜ = FCFFₜ / (1 + r)ᵗ
```

The rate `r` must use the same currency, inflation convention, time scale, and capital claim as the cash flow.

## Account for cash flows beyond the forecast

A company does not disappear because a model stops after year five. DCF models therefore use a Terminal Value to summarize cash flows after the explicit period.

One common stable-growth form is:

```text
Terminal Valueₙ = FCFFₙ₊₁ / (r − g)
```

Here `g` is the stable growth rate. The model requires `r > g`.

When `g` approaches `r`, the denominator approaches zero and Terminal Value explodes. That is not a discovery of enormous value. It is a warning that the long-run assumptions have lost economic discipline.

Discount the Terminal Value back to today and add it to the explicit-period cash flows:

```text
Enterprise Value
= Σ Present Value of explicit FCFF
+ Present Value of Terminal Value
```

A simplified equity bridge is:

```text
Equity Value = Enterprise Value − Net Debt
```

A complete bridge may also add non-operating cash and investments and subtract other non-equity claims. The interactive model uses only net debt so the mechanism stays visible.

## A worked example

Suppose a fictional business starts with `$100m` of FCFF:

- five-year explicit forecast;
- 7% annual FCFF growth;
- 9% WACC;
- 3% stable growth;
- `$250m` of net debt.

The present value of the five explicit cash flows is about `$473m`. The present value of Terminal Value is about `$1,565m`.

```text
Enterprise Value ≈ $2,038m
Equity Value     ≈ $1,788m
Terminal share  ≈ 77%
```

That final line is often the most informative. A 77% terminal share does not automatically make the model wrong, but it says most of the answer is controlled by distant assumptions. The next research question should be about sustainable growth, reinvestment, competitive advantage, and the discount rate—not another decimal place.

## What DCF is actually good at

### Turning a story into a causal chain

“This is a great business” cannot enter a model directly. DCF forces the story into observable drivers:

```text
market and competitive advantage
→ revenue growth and margins
→ reinvestment
→ free cash flow
→ risk and required return
→ value today
```

### Locating disagreement

Two people may produce different values, but the disagreement usually lives in a small number of assumptions: how long growth lasts, what steady-state margins look like, how much reinvestment growth requires, and whether risk is consistently reflected.

DCF turns “I disagree with the price” into “I disagree with this operating or capital assumption.”

### Comparing decisions without pretending to know the future

DCF can compare projects, acquisitions, capital-allocation choices, or operating scenarios under a common framework. Sensitivity analysis, scenario analysis, stress testing, and Monte Carlo simulation then challenge the conditional answer.

## Where it works—and where it degrades

DCF tends to be most useful when:

- value mainly comes from future distributable cash flows;
- the operating model and reinvestment logic can be explained;
- cash flow and discount rate can be matched consistently; and
- the purpose is to understand value drivers, not merely reproduce a market multiple.

It becomes fragile when:

- an early-stage business has no credible path to normalized cash flow;
- a cyclical company is modeled from an abnormal peak or trough;
- debt is closer to operating raw material, as in many financial institutions;
- value comes largely from options to delay, expand, or abandon;
- Terminal Value dominates while steady-state economics remain unconstrained; or
- the model uses precision as decoration but does not test its critical inputs.

These cases do not always prohibit DCF. They often require a different model structure, cash-flow definition, or uncertainty treatment.

## Common mistakes

### “DCF is subjective, so it is useless”

Judgment is unavoidable, but judgment does not have to be hidden. A useful DCF makes assumptions visible, internally consistent, falsifiable, and easy to challenge. A market multiple contains assumptions too; they are simply less explicit.

### “A higher discount rate is always more conservative”

Holding everything else constant, a higher discount rate lowers present value. But changing risk, inflation, growth, and cash-flow conventions inconsistently does not create conservatism. It creates a mismatched model.

### “Terminal Value is the leftover bucket”

Terminal Value is often most of the valuation. It deserves operating constraints: What reinvestment supports stable growth? Does return on capital fade? Can the growth rate remain below the discount rate and fit the economy?

### “A precise calculation is an accurate valuation”

The arithmetic can be exact while the assumptions are wrong. A responsible result is a range with visible drivers, not a fact disguised to two decimal places.

### “Enterprise Value equals Equity Value”

FCFF discounted at WACC usually produces Enterprise Value. Only after bridging cash, debt, and other claims do you reach Equity Value.

## Remember these five things

1. Match the claim, cash flow, and discount rate: FCFF ↔ WACC; FCFE ↔ cost of equity.
2. Growth consumes reinvestment before it becomes distributable cash.
3. Terminal Value is often the main valuation, not an appendix.
4. DCF outputs a conditional sentence, not an objective price.
5. Use sensitivity, scenarios, stress tests, and simulation to challenge the result.

## Self-test

1. Why should FCFF not be discounted at the cost of equity?
2. Why does value usually fall when WACC rises and all else stays constant?
3. What happens as stable growth approaches the discount rate?
4. Can revenue rise while FCFF falls? What reinvestment could cause that?
5. If Terminal Value is 85% of Enterprise Value, which assumptions deserve the most scrutiny?

This page is an educational, hypothetical illustration. It does not provide investment advice or estimate the value of any real security or company.

## Further reading

- [Aswath Damodaran, “Basics of Discounted Cash Flow Valuation”](https://pages.stern.nyu.edu/~adamodar/pdfiles/basics.pdf)
- [CFA Institute, “Free Cash Flow Valuation”](https://www.cfainstitute.org/insights/professional-learning/refresher-readings/2026/free-cash-flow-valuation)
- [Robert S. Harris, “Fundamentals of Discounted Cash Flow”](https://doi.org/10.2139/ssrn.909070)
- [Myron J. Gordon, “Dividends, Earnings, and Stock Prices”](https://doi.org/10.2307/1927792)
