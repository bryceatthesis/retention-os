# Metrics Definitions

Exact formulas and thresholds. Every metric here has an owner, a source, and a refresh cadence.
Do not use approximations in reporting — cite this file.

---

## North-star metric

**[FILL IN: Metric name, e.g., "90-Day Retained Revenue"]**

```
[FILL IN: formula]
```

| Attribute | Value |
|---|---|
| Owner | [FILL IN] |
| Source | [FILL IN: e.g., BigQuery > thesis_prod.subscriptions] |
| Refresh | [FILL IN: e.g., daily at 06:00 PT] |
| Current value | [FILL IN] |
| Q2 target | See `okrs-and-targets.md` |

---

## Subscription retention rate

**Definition**: Percentage of a cohort still active N days after their first subscription start date.

```
Retention(N) = active_at_day_N / cohort_size
```

Where:
- `active_at_day_N` = subscribers in the cohort whose subscription was in good standing on day N (not cancelled, not failed payment for >[FILL IN] days)
- `cohort_size` = total subscribers who started in the cohort period

| Interval | Benchmark (internal) | Source |
|---|---|---|
| 30d | [FILL IN] | [FILL IN] |
| 60d | [FILL IN] | [FILL IN] |
| 90d | [FILL IN] | [FILL IN] |
| 180d | [FILL IN] | [FILL IN] |

---

## Churn rate

### Voluntary churn rate (monthly)

```
Voluntary Churn Rate = voluntary_cancellations_in_period / avg_active_subscribers_in_period
```

Where `avg_active_subscribers = (active_start_of_period + active_end_of_period) / 2`

### Involuntary churn rate (monthly)

```
Involuntary Churn Rate = failed_payment_cancellations_in_period / avg_active_subscribers_in_period
```

**Note**: Involuntary churn is tracked separately because the intervention (dunning) is different. Always report both.

| Metric | Current | Target | Source |
|---|---|---|---|
| Voluntary churn (monthly) | [FILL IN] | [FILL IN] | [FILL IN] |
| Involuntary churn (monthly) | [FILL IN] | [FILL IN] | [FILL IN] |

---

## NRR (Net Revenue Retention)

```
NRR = (MRR_start + expansion_MRR - contraction_MRR - churned_MRR) / MRR_start
```

Measured over a rolling 12-month window unless specified.

- **Expansion MRR**: upgrades, add-ons, frequency increases
- **Contraction MRR**: downgrades, pauses (if MRR-reducing)
- **Churned MRR**: cancelled subscriptions

| Attribute | Value |
|---|---|
| Owner | [FILL IN] |
| Source | [FILL IN] |
| Refresh | Monthly |
| Current (TTM) | [FILL IN] |
| Target | [FILL IN] |

---

## GRR (Gross Revenue Retention)

```
GRR = (MRR_start - contraction_MRR - churned_MRR) / MRR_start
```

GRR is capped at 100% (expansions excluded). GRR < NRR always. GRR is the floor — it shows pure retention without upsell masking churn.

| Attribute | Value |
|---|---|
| Owner | [FILL IN] |
| Source | [FILL IN] |
| Refresh | Monthly |
| Current (TTM) | [FILL IN] |

---

## LTV (Customer Lifetime Value)

### Realized LTV

```
Realized LTV = SUM(order_revenue) for a given customer_id, from first order to today
```

### Predicted LTV (12-month)

```
Predicted LTV(12m) = [FILL IN: model formula or tool]
```

| Attribute | Value |
|---|---|
| Model | [FILL IN: e.g., statistical model in BigQuery / Klaviyo predictive / third-party] |
| Owner | [FILL IN] |
| Refresh | [FILL IN] |

---

## MRR

```
MRR = SUM(monthly_subscription_value) for all active subscribers
```

**Note**: If subscription cadences vary (monthly vs. quarterly vs. annual), normalize to monthly: `annual_value / 12`, `quarterly_value / 3`.

| Attribute | Value |
|---|---|
| Source | [FILL IN] |
| Refresh | Daily |
| Current | [FILL IN] |

---

## ARPU (Average Revenue Per User)

```
ARPU = MRR / active_subscribers
```

---

## Activation rate

**Definition**: [FILL IN: e.g., "Percentage of new subscribers who complete the activation event within 14 days of first subscription"]

```
Activation Rate = activated_subscribers_in_cohort / cohort_size
```

- **Activation event**: [FILL IN: e.g., "logs in + completes onboarding survey + places second order"]
- **Window**: [FILL IN: e.g., 14 days]

| Attribute | Value |
|---|---|
| Current | [FILL IN] |
| Target | [FILL IN] |
| Source | [FILL IN] |

---

## Dunning recovery rate

```
Dunning Recovery Rate = recovered_subscriptions / failed_payment_subscriptions_entered_dunning
```

| Attribute | Value |
|---|---|
| Current | [FILL IN] |
| Dunning flow | See `knowledge/flow-inventory.md` |

---

## Reporting cadence

| Metric | Reported | Owner | Shared to |
|---|---|---|---|
| Retention rate (30/60/90d) | Weekly | [FILL IN] | [FILL IN] |
| Churn rate | Weekly | [FILL IN] | [FILL IN] |
| NRR / GRR | Monthly | [FILL IN] | [FILL IN] |
| MRR | Daily | [FILL IN] | [FILL IN] |
| North-star | [FILL IN] | [FILL IN] | [FILL IN] |
