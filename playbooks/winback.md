# Winback Playbook

**Purpose**: Govern eligibility, offer tiers, measurement, and decision rules for all winback campaigns targeting churned Thesis subscribers. This file is the authority — don't negotiate winback terms ad hoc.

**Inputs required**: Churned customer segment (see `knowledge/segments.md` → "Winback Eligible").

**Output**: A campaign-ready plan with audience, offer tier, and measurement setup.

---

## Anti-patterns

- Don't run winback without a holdout — you cannot measure impact without one.
- Don't exceed offer limits in the tier table — they exist for margin and brand reasons.
- Don't target customers in the hard-suppress list (medical cancels, refund abusers).
- Don't run multiple winback treatments on the same customer simultaneously.
- Don't measure winback by opens or clicks — measure by re-subscriptions within the attribution window.

---

## Eligibility criteria

A churned customer is eligible for winback if they meet ALL of the following:

| Criterion | Rule |
|---|---|
| Days since cancellation | [FILL IN: e.g., ≥ 14 days and ≤ 180 days] |
| Cancellation type | Voluntary only (not involuntary / dunning failure) |
| Minimum historical orders | [FILL IN: e.g., ≥ 2 completed orders before cancellation] |
| LTV floor | [FILL IN: e.g., realized LTV ≥ $X] |
| Cancellation reason | Not "medical / health concern" and not "safety issue" |
| Refund history | [FILL IN: e.g., ≤ 1 refund in lifetime] |
| Prior winback attempts | [FILL IN: e.g., not contacted in prior winback campaign within 90 days] |
| Global unsubscribe | Not globally unsubscribed from email |

**Hard suppress list** (never contact for winback):
- Customers who cited medical or safety concerns in their cancellation reason
- Customers flagged by CS as "do not contact"
- Customers in the "Chronic Refunders" segment (see `knowledge/segments.md`)
- [FILL IN: any other hard-suppress rules]

---

## Offer tiers

Offer tiers are tiered by customer LTV and time since cancellation. Do not offer a higher tier than what the customer qualifies for. Offer escalation (tier 1 → tier 2 → tier 3) happens only across separate campaign sends, not within the same send.

| Tier | Eligibility | Offer | Max uses per customer per year |
|---|---|---|---|
| Tier 1 (soft) | All eligible | [FILL IN: e.g., "Welcome back" message, no discount] | [FILL IN] |
| Tier 2 (standard) | [FILL IN: e.g., LTV ≥ $X OR ≥ N orders] | [FILL IN: e.g., X% off first month back] | [FILL IN] |
| Tier 3 (high-value) | [FILL IN: e.g., LTV ≥ $Y OR top N% of churned cohort] | [FILL IN: e.g., X% off + free gift] | [FILL IN] |

**Approval required** for any offer outside of this table. Contact [FILL IN: e.g., Head of Growth / Finance].

---

## Treatment structure

### Standard winback sequence

| Touch | Timing | Message type | Offer |
|---|---|---|---|
| 1 | Day 0 | [FILL IN: e.g., "We miss you" + brand story] | Tier 1 |
| 2 | Day [FILL IN] | [FILL IN: e.g., Product update / social proof] | Tier 1 |
| 3 | Day [FILL IN] | [FILL IN: e.g., Offer introduction] | Tier 2 |
| 4 | Day [FILL IN] | [FILL IN: e.g., Offer expiry urgency] | Tier 2 |
| Exit | Day [FILL IN] | [FILL IN: e.g., Final send / goodbye] | [FILL IN] |

After the final touch, remove from the active winback segment. Do not continue messaging.

### High-LTV variant (Tier 3)
[FILL IN: custom sequence if different from standard]

---

## Measurement

### Required setup before any winback campaign
- [ ] Holdout group configured: [FILL IN: e.g., 20% of eligible audience withheld]
- [ ] Attribution window defined: [FILL IN: e.g., 30-day re-subscription counts as winback conversion]
- [ ] Baseline re-subscription rate documented (organic winback rate without campaign)
- [ ] Campaign tagged in Klaviyo for reporting isolation

### Metrics to report

| Metric | Definition | How to pull |
|---|---|---|
| Winback conversion rate | Re-subscriptions within attribution window / eligible audience messaged | [FILL IN] |
| Incremental winback rate | (Treatment conversion rate) – (holdout conversion rate) | Requires holdout |
| Reactivated MRR | Sum of monthly subscription value of re-subscribers | [FILL IN] |
| Cost per reactivation | [FILL IN: campaign cost + offer value] / re-subscriptions | [FILL IN] |
| 60d retention of reactivated subs | % of reactivated subs still active 60 days later | [FILL IN] |

**Minimum hold period before reading results**: [FILL IN: e.g., 30 days after final touch]

---

## Decision rules

### When to run winback
- [ ] Eligible audience ≥ [FILL IN: minimum size for statistical power]
- [ ] No overlapping winback campaign already in flight for the same audience
- [ ] Klaviyo flow audit completed (`playbooks/lifecycle-audit.md`)

### When NOT to run winback
- Involuntary (dunning) churn — use dunning recovery flow instead
- Audience < minimum size (underpowered)
- Within [FILL IN: e.g., 90 days] of a prior winback campaign to the same audience

### Post-campaign decision framework
| Result | Action |
|---|---|
| Incremental rate ≥ [FILL IN: target] | Continue / scale; document learnings |
| Incremental rate between [FILL IN] and [FILL IN] | Iterate on messaging or offer; re-test |
| Incremental rate < [FILL IN] | Pause winback to this segment; investigate eligibility criteria |
| Reactivated sub 60d retention < [FILL IN] | Review audience quality; tighten eligibility |
