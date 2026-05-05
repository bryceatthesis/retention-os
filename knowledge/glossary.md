# Glossary

Canonical definitions for retention terminology at Thesis. When a term appears in analysis or a playbook, use this definition unless the context specifies otherwise.

---

## Core retention terms

| Term | Definition | Notes |
|---|---|---|
| **Active subscriber** | A customer with a paid subscription in good standing (not paused, not cancelled, not past-due). | [FILL IN: exact Thesis definition — does a paused sub count?] |
| **At-risk** | An active subscriber showing behavioral signals of elevated churn probability. | Defined by segment criteria in `segments.md`. |
| **Churn** | Cancellation of a subscription. Voluntary (customer-initiated) or involuntary (payment failure). | Distinguish in all reporting. |
| **Cohort** | A group of customers defined by a shared start date (e.g., "Jan 2026 new subscribers"). | Default cohort granularity: monthly unless specified. |
| **GRR (Gross Revenue Retention)** | Revenue retained from existing customers excluding expansions. Captures churn + contraction only. | Formula in `metrics-definitions.md`. |
| **LTV (Lifetime Value)** | Expected total revenue from a customer over their relationship with Thesis. | Predicted vs. realized — specify which. |
| **NRR (Net Revenue Retention)** | Revenue retained from existing customers including expansions (upsells, frequency upgrades). | Formula in `metrics-definitions.md`. |
| **Reactivation** | A previously churned customer starting a new subscription. Distinct from winback campaign conversion. | Track as its own cohort. |
| **Retention rate** | Percentage of a cohort still active at a given time interval (30d, 60d, 90d, etc.). | Formula in `metrics-definitions.md`. |
| **Winback** | A campaign targeting churned customers to re-subscribe. | Eligibility rules in `playbooks/winback.md`. |

---

## Lifecycle terms

| Term | Definition |
|---|---|
| **Onboarding window** | [FILL IN: e.g., first 30 days of subscription] |
| **Activation** | [FILL IN: the behavioral signal that predicts long-term retention, e.g., "completes product quiz + places second order"] |
| **Habit formation** | [FILL IN: e.g., 3+ consecutive monthly orders] |
| **Churn lead time** | Days between first detectable at-risk signal and actual cancellation. Typically [FILL IN] days at Thesis. |
| **Pause** | A temporary hold on subscription shipments. Counts as [FILL IN: active or inactive?] in Thesis's retention metrics. |

---

## Campaign / flow terms

| Term | Definition |
|---|---|
| **Flow** | An automated Klaviyo sequence triggered by an event or segment membership change. |
| **Campaign** | A one-time or scheduled Klaviyo send to a defined audience. |
| **Suppression** | A rule preventing a profile from receiving a message (global unsubscribe, recent send, etc.). |
| **Smart sending** | Klaviyo's default rule limiting one message per profile per 16 hours. |
| **Holdout** | A withheld control group in an experiment. Required for causal measurement of campaign impact. |

---

## Data / analysis terms

| Term | Definition |
|---|---|
| **T-1** | Yesterday's data (warehouse refresh lag). |
| **Realized LTV** | Actual revenue received from a customer to date. |
| **Predicted LTV** | Model-estimated future revenue. [FILL IN: which model/tool Thesis uses] |
| **AOV (Average Order Value)** | Total revenue ÷ number of orders in a period. |
| **MRR (Monthly Recurring Revenue)** | Sum of all active subscribers' monthly subscription value. |
