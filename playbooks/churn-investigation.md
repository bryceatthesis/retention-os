# Churn Investigation Playbook

**Purpose**: Systematic root-cause analysis (RCA) when churn spikes, trends downward, or a specific cohort underperforms. Produces a structured write-up with a ranked hypothesis list and a recommended action.

**Inputs required**: A specific question ("Voluntary churn was X% in April vs. Y% in March — why?") and a time window.

**Output**: A written RCA document with: framing, decomposition, ranked hypotheses, findings, and a recommendation.

**Skill**: Run `/churn-rca` — it executes this playbook in a forked context.

---

## Anti-patterns

- Don't start with a hypothesis. Start with decomposition.
- Don't conflate voluntary and involuntary churn in the same analysis.
- Don't declare a root cause from a single correlational data point.
- Don't scope to one segment — always check if the pattern is broad or narrow.
- Don't skip the seasonality / external check. Thesis operates in a health cycle — January, new year, summer, etc. have baseline effects.

---

## Step 1: Frame the question (5 min)

Write down exactly:
1. **What changed**: "[Metric] moved from [X] to [Y] over [period]."
2. **Why it matters**: Impact on MRR, OKR, or a specific cohort.
3. **What you already know**: Any hypotheses or context from the team before you start.
4. **What you are NOT trying to answer**: Scope boundaries prevent rabbit holes.

Do not proceed to Step 2 until the framing is written.

---

## Step 2: Decompose (30–60 min)

Decompose the aggregate churn change across every available dimension. The goal is to find where the change is concentrated.

### 2a. Voluntary vs. involuntary
- Is the increase driven by cancellations or payment failures?
- If involuntary: stop here and go to `playbooks/` dunning section. The RCA is different.

### 2b. Cohort vintage
```sql
-- Churn rate by cohort start month, for the affected period
-- [FILL IN: cohort SQL template from /cohort-pull]
```
- Is the spike in new cohorts (onboarding failure) or tenured cohorts (habit breakdown)?

### 2c. Channel / acquisition source
- Is churn elevated in subscribers from a specific acquisition channel?
- Cross-reference with Marketing if a new channel was opened.

### 2d. Formulation / product
- Is churn concentrated in a specific formula or product variant?
- Check if there was a formula change, supply issue, or quality complaint spike.

### 2e. Geography
- Is there a regional pattern? (Could indicate a fulfillment issue.)

### 2f. Cancellation reason (if captured)
```sql
-- Top cancellation reasons in period vs. prior period
-- [FILL IN: SQL or platform query]
```
- Categorize: Price / Product not working / Found alternative / Life change / Other
- Compare distribution to baseline period.

### 2g. CS ticket patterns
- Did CS contact volume spike in the weeks before the churn window?
- Any unusual complaint categories? (Check with CS team.)

### 2h. External / seasonal factors
- Was there a notable external event? (Competitor launch, negative press, seasonal)
- Thesis baseline: [FILL IN: known seasonal patterns]

**Deliverable from Step 2**: A table showing which dimensions show concentrated change vs. which are flat. This is the most important output of the investigation.

---

## Step 3: Hypothesize (15 min)

Based on the decomposition, generate 3–5 hypotheses. Each hypothesis should be:
- Falsifiable: "If true, we'd expect to see [specific data pattern]."
- Causal: Not "churn went up because we had more cancellations" — that's circular.

**Hypothesis template**:
```
H[N]: [One sentence causal claim]
- If true, we'd see: [specific measurable pattern]
- Data needed to test: [specific query or data source]
- Prior probability: High / Medium / Low
```

---

## Step 4: Rank and investigate (30–90 min)

Rank hypotheses by:
1. Prior probability (how plausible given what we know)
2. Data availability (can we actually test it?)
3. Impact if true (would this explain most of the variance?)

Investigate top 2–3 hypotheses. For each:
- Pull the relevant data
- State whether it supports, refutes, or is inconclusive
- If inconclusive: what additional data would resolve it?

**Stop when**: You've explained ≥80% of the variance in the churn change, or you've exhausted available data.

---

## Step 5: Write up findings

Use this structure:

```markdown
## Churn RCA — [metric] [period]

**Question**: [from Step 1]
**TL;DR**: [1–2 sentence answer]

### What happened
[Quantified: how much churn increased, in which dimension, over what period]

### Root cause(s)
1. **[Primary cause]** — explains ~[X]% of the change. Evidence: [summary].
2. **[Secondary cause, if any]** — explains ~[Y]% of the change. Evidence: [summary].

### Ruled out
- [Hypothesis]: [why it was ruled out]

### Recommended action
| Action | Owner | Timeline | Expected impact |
|---|---|---|---|
| [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |

### Open questions
- [What we couldn't answer and why]

### Data sources used
- [List every source with query or link]
```

---

## Step 6: Share and socialize

1. Share write-up with [FILL IN: e.g., Head of Growth, CEO, Data team] within [FILL IN: e.g., 48h] of completing the investigation.
2. If the recommended action involves a Klaviyo change: run `/lifecycle-audit` on the affected flow before shipping.
3. If the recommended action is a new experiment: use `/experiment-writeup` to set it up properly.
4. File the write-up in `experiments/YYYY-QN/` or a designated RCA doc in [FILL IN: Notion / GDrive].
