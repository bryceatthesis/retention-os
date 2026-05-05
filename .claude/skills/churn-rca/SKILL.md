---
name: churn-rca
description: Run a structured root-cause analysis on a churn event or trend. Use when the user says "investigate churn", "why did churn spike", "churn is up — look into it", or asks for an RCA on a specific retention metric decline.
tools:
  - Read
  - Bash
  - Glob
context: fork
---

# Churn RCA

Run a structured root-cause analysis following `playbooks/churn-investigation.md`. This skill runs in a forked context — deep investigation data does not pollute the main conversation.

**Read-only**: this skill never modifies Klaviyo, the warehouse, or any external system. It produces a written RCA document.

## Sources

- Playbook: `playbooks/churn-investigation.md` — follow every step in sequence
- Metric definitions: `knowledge/metrics-definitions.md`
- Segment definitions: `knowledge/segments.md`
- Data sources and tables: `knowledge/data-sources.md`
- Lifecycle stages: `knowledge/lifecycle-stages.md`
- Flow inventory (for flow-related hypotheses): `knowledge/flow-inventory.md`

## Steps

### 0. Confirm the question

Before starting, confirm:
1. **What metric changed?** (voluntary churn rate, involuntary churn rate, retention at Nd, MRR churn?)
2. **What time period?** (This month vs. last? This cohort vs. prior cohort?)
3. **Any initial hypotheses from the team?** (Note them, but don't let them anchor the decomposition)

If any of these are unclear, ask before proceeding.

### 1–6: Follow playbooks/churn-investigation.md

Execute each step of the playbook in sequence:
1. Frame the question (write it out)
2. Decompose across all dimensions (voluntary/involuntary, cohort vintage, channel, formulation, geography, cancellation reason, CS signals, external factors)
3. Generate 3–5 falsifiable hypotheses
4. Rank and investigate top hypotheses
5. Write up findings using the template in the playbook
6. Recommend actions

Read `playbooks/churn-investigation.md` in full before beginning Step 1.

### At each decomposition step:
- State the SQL or query you'll run
- Show the result (or error) before interpreting it
- State whether the dimension shows concentrated change or is flat
- Note data freshness per `knowledge/data-sources.md`

### At each hypothesis:
- State the hypothesis clearly
- State what data would confirm or refute it
- Pull the data
- Report the verdict: **Supported / Refuted / Inconclusive**

### Output

Produce the completed RCA write-up in the format specified in `playbooks/churn-investigation.md` Step 5. Offer to save it to `experiments/YYYY-QN/<slug>-rca.md` or a location the user specifies.

## Anti-patterns

- Don't start with a hypothesis — always decompose first.
- Don't conflate voluntary and involuntary churn.
- Don't declare a root cause from one correlational data point — state confidence level.
- Don't skip seasonality / external factors check.
- Don't run more than [FILL IN: e.g., 10] queries without pausing to share interim findings and confirm you're on the right track.
- Don't expose raw PII in query results — use customer_id only.
- Don't make Klaviyo or warehouse writes during this skill.
