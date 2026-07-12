# Red-Team Review

Reviewed: 2026-07-10

## Skeptical Editorial Findings

### 1. Personal authority arrived too late

The first draft established the thesis quickly but did not explain within the opening why Aaron can distinguish a useful finance artifact from an impressive demo. A skeptical reader could read the piece as researched commentary rather than operator judgment.

**Required revision:** Move the direct experience with Claude finance plugins into the first 15%, while explicitly preserving the boundary that Aaron has not completed an equivalent long-duration ChatGPT Work test.

### 2. The maturity comparison could accidentally reward age

"More scar tissue" is memorable, but without an adoption signal it could mean only that Cowork has had more time to collect complaints. That weakens the mechanism.

**Required revision:** Add Anthropic's own usage analysis - more than 90% non-software and roughly half business operations/content creation - and label it as vendor analysis. Use it to show why the complaints are tied to real knowledge-work adoption.

### 3. Cost and capacity were underdeveloped

The draft mentioned Cowork usage limits but did not explain the equivalent uncertainty on ChatGPT Work. This could read as asymmetric criticism.

**Required revision:** Add OpenAI's Codex-style usage structure and explain why a static price table would be false precision before teams measure real work runs.

### 4. The pilot tested success but not recovery

The four-plane pilot asked whether work could be completed and reviewed, but the article's control thesis requires testing what happens after a bad source or wrong mapping.

**Required revision:** Add a deliberate failure injection and evaluate detection, evidence lineage, and recovery without restarting.

### 5. The feature table risks becoming the article

The comparison table is useful, but it could pull the reader back into a generic review if later sections merely elaborate each row.

**Required revision:** Keep the table compact and ensure later sections are organized around maturity, finance mechanism, and the four planes rather than around individual features.

### 6. Community incidents need stronger boundaries

The history-loss post is vivid and could be overread as proof of systemic data loss. The draft does balance it with users whose history remained, but the inference needs to stay focused on externalized memory and recovery.

**Required revision:** Retain it only as a single incident that produced a useful operating rule. Do not use it to rank overall reliability.

### 7. The ending could collapse into vendor-neutral advice

"Trustworthy workbench" is correct but risks sounding generic after a detailed comparison.

**Required revision:** Keep the specific finance acceptance rule: if source, exception, and workbook review cannot survive the run, the task is not done. Connect the durable asset to customer-owned skills, evals, permissions, audit history, and runbooks.

## Revision Notes

- Added Aaron's hands-on finance artifact experience to the opening and removed the later duplicated explanation.
- Added the vendor-labeled Cowork usage analysis to distinguish maturity from mere age.
- Added OpenAI's usage-allowance caveat to balance the Cowork limit discussion.
- Expanded the finance pilot with a deliberate stale-file or mapping failure and a recovery test.
- Kept the single compact feature table but preserved an argument-led section sequence.
- Kept the Reddit history incident as an anecdote and operating lesson, not a reliability statistic.
- Preserved the specific finance ending and customer-ownership implication.

## Decision

PASS after substantive revision. The article now has a clearer authority boundary, fairer maturity comparison, stronger control-plane mechanism, and a pilot that tests failure as well as completion.
