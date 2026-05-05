# Experiment Write-ups

Standard format for all retention experiments. Every experiment gets a write-up — even failed ones. Especially failed ones.

Use `/experiment-writeup` to generate a write-up from a description of the experiment.

Files go in `experiments/YYYY-QN/<slug>.md`. Example: `experiments/2026-Q2/winback-offer-tier-test.md`.

---

## Standard write-up template

Copy this template for each new experiment.

```markdown
# [Experiment Title]

**Slug**: [kebab-case-slug]
**Quarter**: [YYYY-QN]
**Owner**: [name]
**Status**: Planning | Running | Complete | Paused | Cancelled
**Start date**: [YYYY-MM-DD]
**Read date**: [YYYY-MM-DD]
**Decision date**: [YYYY-MM-DD]

---

## Hypothesis

**We believe** [describing the intervention]
**will cause** [describing the expected effect]
**for** [the target audience]
**because** [the mechanism — why would this work?]

---

## Setup

### Treatment
[Exact description of what the treatment group received]

### Control
[Exact description of the holdout / control condition]

### Randomization
- Split: [e.g., 50/50, 80/20]
- Unit of randomization: [customer ID / subscription ID]
- Randomization method: [e.g., Klaviyo holdout group / manual SQL split]
- Audience: [segment name + size at launch]

---

## Metrics

### Primary metric
**[Metric name]** — [definition per knowledge/metrics-definitions.md]
- Target effect: [e.g., ≥ 5% lift]
- Minimum detectable effect (MDE): [FILL IN]

### Guardrail metrics (must not move negatively)
- [Metric]: [definition]
- [Metric]: [definition]

### Statistical parameters
- Significance threshold: [e.g., p < 0.05]
- Power: [e.g., 80%]
- Required sample size (per arm): [FILL IN]
- Estimated time to reach sample size: [FILL IN]

---

## Pre-experiment checklist

- [ ] Hypothesis written
- [ ] Metrics and MDE defined
- [ ] Sample size adequate
- [ ] Holdout configured in Klaviyo
- [ ] Klaviyo flow audited (`playbooks/lifecycle-audit.md`)
- [ ] Baseline metrics documented:
  - [Metric]: [baseline value as of experiment start]
- [ ] Segment definition validated (`playbooks/new-segment-launch.md` if new segment)
- [ ] Stakeholders informed

---

## Results

*Fill in after experiment reads.*

### Sample sizes
| Group | N |
|---|---|
| Treatment | [FILL IN] |
| Control | [FILL IN] |

### Primary metric
| Group | Value | Delta vs. control | p-value | Significant? |
|---|---|---|---|---|
| Treatment | [FILL IN] | [FILL IN] | [FILL IN] | Y/N |
| Control | [FILL IN] | — | — | — |

### Guardrail metrics
| Metric | Treatment | Control | Delta | Flag? |
|---|---|---|---|---|
| [Metric] | [FILL IN] | [FILL IN] | [FILL IN] | Y/N |

### Confidence interval
[Primary metric effect]: [lower bound] to [upper bound] (95% CI)

---

## Learnings

### What we found
[2–4 sentences. What did the data show? What surprised you?]

### Why (mechanistic interpretation)
[What does this tell us about customer behavior? What was the underlying driver?]

### What we'd do differently
[Honest reflection on design, execution, or measurement choices]

---

## Decision

**Outcome**: Ship | Iterate | Stop | Needs more data

**Rationale**: [1–2 sentences justifying the decision against the results]

**Next step**:
| Action | Owner | By when |
|---|---|---|
| [FILL IN] | [FILL IN] | [FILL IN] |

---

## Data and sources

| Source | Table / location | Query |
|---|---|---|
| [FILL IN] | [FILL IN] | [link or inline] |
```
