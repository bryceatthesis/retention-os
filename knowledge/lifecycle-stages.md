# Customer Lifecycle Stages

The five stages of the Thesis subscriber journey. Every retention intervention maps to a stage. Use these labels consistently across flows, reporting, and analysis.

---

## Stage overview

```
Prospect → New → Active → At-Risk → Churned
                  ↑                     |
                  └─────────────────────┘  (Winback / Reactivation)
```

---

## 1. Prospect

**Definition**: Has not yet placed a first order. May have submitted the quiz, joined the email list, or started checkout.

**Entry**: Quiz completion OR email opt-in OR abandoned checkout event.

**Exit**: Places first order → moves to New.

**Thesis goal**: Convert to first subscription. Retention's involvement is indirect — this is primarily Acquisition's domain, but handoff quality affects retention.

| Signal | Action |
|---|---|
| Quiz completed, no order in [FILL IN] days | [FILL IN: nurture flow] |
| Abandoned checkout | [FILL IN: abandon flow] |

**Retention stake**: Formulation match quality at this stage is a leading indicator of onboarding success. Coordinate with Product/Acquisition if quiz-to-activation rate is low.

---

## 2. New Subscriber (Onboarding)

**Definition**: Active subscriber within the first [FILL IN] days of subscription start.

**Entry**: First successful subscription charge.

**Exit conditions**:
- Completes activation event → moves to Active
- Cancels before activation → Churned (early churn — track separately)
- [FILL IN] days pass without activation → moves to At-Risk (onboarding failure)

**Thesis goal**: Drive the activation event. The activation event is: [FILL IN: e.g., "completes onboarding check-in + places second order within 30 days"].

**Key flows**: Welcome series, Onboarding series.

**Key risks at this stage**:
1. Formulation mismatch — customer doesn't feel the product working
2. Expectation mismatch — didn't understand subscription terms
3. Logistics — shipping issues, damaged product

**Metrics to watch**: Activation rate, early churn rate (< [FILL IN] days), CS ticket rate per new cohort.

---

## 3. Active (Habit Formation)

**Definition**: Active subscriber past the onboarding window who has completed the activation event.

**Entry**: Completes activation event AND > [FILL IN] days since subscription start.

**Exit conditions**:
- Behavioral signals decline → moves to At-Risk
- Cancels → Churned
- Payment fails → enters Dunning (parallel state, may exit to Churned)

**Thesis goal**: Deepen habit. The primary churn lever here shifts from product education to ongoing value reinforcement, formulation optimization, and LTV expansion.

**Sub-stages** (optional):
| Sub-stage | Criteria | Strategy |
|---|---|---|
| Early Active | [FILL IN: e.g., 30–90 days] | Reinforce routine, prevent early fatigue |
| Established | [FILL IN: e.g., 91–180 days] | Expand product understanding, introduce add-ons |
| Loyal | [FILL IN: e.g., >180 days] | Treat as VIP, gather advocacy |

**Key flows**: [FILL IN: e.g., Monthly check-in, Formulation update, Loyalty milestone]

---

## 4. At-Risk

**Definition**: Active subscriber showing behavioral signals predictive of churn within [FILL IN] days.

**Entry criteria**: See `knowledge/segments.md` → "At-Risk" segment definition.

**Exit conditions**:
- Re-engagement signal detected → moves back to Active
- Cancels → Churned
- Payment fails → Dunning

**Thesis goal**: Intervene before the cancellation decision is made. Interventions at this stage are [FILL IN: X]x more cost-effective than winback.

**Intervention priority**:
1. Understand reason (behavioral inference or direct ask)
2. Address specific friction (formulation, expectations, logistics, price)
3. Offer pause before cancel as a default escape valve
4. Discount as a last resort and only within policy

**Key flows**: At-risk re-engagement flow, Save offer flow.

---

## 5. Churned

**Definition**: Subscription cancelled or permanently lapsed (involuntary churn not recovered through dunning).

**Entry conditions**:
- Customer cancels (voluntary)
- Dunning period exhausted without payment recovery (involuntary)

**Sub-states**:
| Sub-state | Definition | Winback eligible? |
|---|---|---|
| Recent churned | Cancelled [FILL IN] – [FILL IN] days ago | Evaluate per `playbooks/winback.md` |
| Stale churned | Cancelled > [FILL IN] days ago | Generally no — suppress |
| Medical cancel | Cancelled citing health/safety | Never — hard suppress |
| Refund abuse | Cancelled after excessive refunds | Suppress from winback |

**Thesis goal**: Recover the highest-potential churned customers within the winback window. After the window, focus on learnings, not campaigns.

**Key flows**: Winback flow. See `playbooks/winback.md` for full policy.

---

## Dunning (parallel state)

**Definition**: Active subscriber whose most recent payment has failed. Not yet churned — subscription is technically active but at risk of involuntary churn.

**Entry**: First failed payment charge event.

**Exit conditions**:
- Payment recovered → returns to Active
- Dunning period exhausted → Churned (involuntary)

**Dunning stages** (customize per Thesis's retry logic):

| Stage | Day | Action |
|---|---|---|
| D+0 | Failure day | Soft payment failure email |
| D+[FILL IN] | [FILL IN] | Second notice + update payment CTA |
| D+[FILL IN] | [FILL IN] | Urgency email — service about to lapse |
| D+[FILL IN] | [FILL IN] | Final notice |
| D+[FILL IN] | [FILL IN] | Subscription cancelled (involuntary churn) |

**Key flow**: Dunning recovery flow. See `knowledge/flow-inventory.md`.
