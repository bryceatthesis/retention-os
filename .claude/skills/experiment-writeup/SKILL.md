---
name: experiment-writeup
description: Generate a structured experiment write-up or fill in results for an existing one. Use when the user says "write up [experiment]", "document our results for [test]", "set up an experiment doc for [hypothesis]", or "we got results on [experiment] — write it up".
tools:
  - Read
  - Bash
---

# Experiment Write-up

Generate a complete experiment write-up using the standard format from `experiments/README.md`. Works for two modes:

- **Pre-experiment**: Create the setup doc (hypothesis through pre-experiment checklist). Helps catch design problems before running.
- **Post-experiment**: Fill in results, learnings, and decision.

## Sources

- Write-up template: `experiments/README.md`
- Metric definitions and targets: `knowledge/metrics-definitions.md`
- OKR context: `knowledge/okrs-and-targets.md`
- Segment definitions (if audience is a named segment): `knowledge/segments.md`
- Flow details (if experiment is on a flow): `knowledge/flow-inventory.md`

## Steps

### 1. Determine mode

Ask if not clear from context:
- "Are you setting this up before running it, or documenting results after?"

### 2a. Pre-experiment mode: build the setup doc

Gather the following (ask for any that are missing):
- Intervention description (what exactly is changing)
- Target audience (segment name or criteria)
- Randomization method and split
- Primary metric (cite `knowledge/metrics-definitions.md`)
- Guardrail metrics
- Hypothesis (mechanism — why would this work?)
- Expected effect size / MDE
- Statistical parameters (significance threshold, power)

**Sample size calculation**: Using the MDE and baseline rate, calculate required sample size per arm:

```
For a proportion test:
n ≈ 2 × ((z_α/2 + z_β)² × p(1−p)) / (MDE²)

Where:
- p = baseline conversion rate
- MDE = minimum detectable effect (absolute)
- z_α/2 = 1.96 for α = 0.05
- z_β = 0.84 for 80% power
```

Show the calculation. If baseline rate is unknown, flag it as a gap.

**Pre-experiment checklist**: Run through every item in the checklist from `experiments/README.md`. Flag any incomplete items as blockers.

Offer to save the doc to `experiments/[YYYY-QN]/[slug].md`.

### 2b. Post-experiment mode: fill in results

Gather:
- Experiment slug / name (to find existing doc or start fresh)
- Sample sizes for treatment and control
- Primary metric values for each group
- Guardrail metric values
- Read date

**Statistical analysis**:

For a proportion test (conversion rate):
```
delta = treatment_rate - control_rate
SE = sqrt(p_pool × (1 - p_pool) × (1/n_t + 1/n_c))
  where p_pool = (conversions_t + conversions_c) / (n_t + n_c)
z = delta / SE
p-value = 2 × (1 - Φ(|z|))
95% CI = delta ± 1.96 × SE
```

State:
- Whether the result is statistically significant at the stated threshold
- The 95% confidence interval on the effect
- Whether any guardrail metrics moved (flag if so)
- A plain-English interpretation ("The treatment increased [metric] by [X percentage points], 95% CI [low, high]. This is statistically significant at p < 0.05.")

**Decision framework**: Map the result to a decision per `experiments/README.md`:
- Ship if: statistically significant, effect ≥ MDE, no guardrail violations
- Iterate if: directionally positive but underpowered, or guardrail concern
- Stop if: null or negative result, confident in the measurement

Offer to save/update the doc at `experiments/[YYYY-QN]/[slug].md`.

## Anti-patterns

- Don't round p-values to "significant" without stating the actual value.
- Don't declare a result significant without checking guardrail metrics.
- Don't call an underpowered experiment conclusive — state the power gap.
- Don't omit the confidence interval — the point estimate alone is insufficient.
- Don't interpret a null result as proof of no effect without checking power.
- Don't skip the sample size calculation in pre-experiment mode — it prevents underpowered tests.
- Don't file a write-up without a decision and a next-step owner.
