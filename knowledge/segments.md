# Customer Segments Catalog

All active segments used in Klaviyo flows, campaigns, or reporting. Each segment has a canonical definition — don't redefine inline in a flow.

For launching a new segment, follow `playbooks/new-segment-launch.md`.

---

## Segment template

```
### [Segment Name]
**ID / Klaviyo list name**: [FILL IN]
**Type**: Klaviyo segment | Klaviyo list | Warehouse cohort
**Owner**: [FILL IN]
**Last reviewed**: [date]

**Definition**:
[Exact criteria — use field names as they appear in Klaviyo or the warehouse]

**Size** (approx): [FILL IN] profiles
**Primary goal**: [Retention / Reactivation / Upsell / Suppression / Research]
**Key flows / campaigns using this segment**: [links or names]
**Success metric**: [FILL IN]
**Anti-patterns**: [what to avoid when messaging this segment]
```

---

## Lifecycle segments

### New Subscribers
**ID / Klaviyo list name**: [FILL IN]
**Type**: Klaviyo segment
**Owner**: [FILL IN]
**Last reviewed**: [FILL IN]

**Definition**:
- `subscription_start_date` within last [FILL IN] days
- `subscription_status` = "active"

**Size**: [FILL IN]
**Primary goal**: Activation — get to first habit-forming behavior before day [FILL IN]
**Key flows**: Welcome series, Onboarding series
**Success metric**: Activation rate (see `metrics-definitions.md`)
**Anti-patterns**: Don't cross-sell before activation event is hit; don't suppress from educational flows.

---

### Active – Healthy
**ID / Klaviyo list name**: [FILL IN]
**Type**: Klaviyo segment
**Owner**: [FILL IN]
**Last reviewed**: [FILL IN]

**Definition**:
- `subscription_status` = "active"
- `subscription_start_date` > [FILL IN] days ago (past onboarding)
- [FILL IN: engagement or order frequency criteria]
- Not a member of "At-Risk" segment

**Size**: [FILL IN]
**Primary goal**: Deepen habit, increase LTV
**Key flows**: [FILL IN]
**Success metric**: 90d retention rate, ARPU
**Anti-patterns**: Don't over-message — this segment is already engaged.

---

### At-Risk
**ID / Klaviyo list name**: [FILL IN]
**Type**: Klaviyo segment
**Owner**: [FILL IN]
**Last reviewed**: [FILL IN]

**Definition**:
[FILL IN: behavioral signals — e.g., "no Klaviyo email open in 60d AND no order in 45d AND subscription active"]

**Size**: [FILL IN]
**Primary goal**: Prevent churn before it happens
**Key flows**: At-risk re-engagement flow
**Success metric**: Churn rate delta vs. control holdout
**Anti-patterns**: Don't offer discounts before softer re-engagement; don't send more than [FILL IN] touches in [FILL IN] days.

---

### Paused
**ID / Klaviyo list name**: [FILL IN]
**Type**: Klaviyo segment
**Owner**: [FILL IN]
**Last reviewed**: [FILL IN]

**Definition**:
- `subscription_status` = "paused"
- [FILL IN: exclude pauses initiated by Thesis ops?]

**Size**: [FILL IN]
**Primary goal**: Resume before pause converts to cancellation
**Key flows**: Pause reactivation flow
**Success metric**: Pause-to-resume rate within [FILL IN] days
**Anti-patterns**: [FILL IN]

---

### Dunning (Failed Payment)
**ID / Klaviyo list name**: [FILL IN]
**Type**: Klaviyo segment
**Owner**: [FILL IN]
**Last reviewed**: [FILL IN]

**Definition**:
- `subscription_status` = "payment_failed" OR recent failed charge event
- [FILL IN: day ranges for dunning stages]

**Size**: [FILL IN]
**Primary goal**: Recover subscription before it churns involuntarily
**Key flows**: Dunning recovery flow
**Success metric**: Dunning recovery rate (see `metrics-definitions.md`)
**Anti-patterns**: Don't send promotional content during dunning — focus on friction removal only.

---

### Winback Eligible
**ID / Klaviyo list name**: [FILL IN]
**Type**: Klaviyo segment
**Owner**: [FILL IN]
**Last reviewed**: [FILL IN]

**Definition**:
Full eligibility rules in `playbooks/winback.md`. Summary:
- `subscription_status` = "cancelled"
- Cancelled [FILL IN] – [FILL IN] days ago
- [FILL IN: other eligibility criteria, e.g., had ≥ N orders, not suppressed]

**Size**: [FILL IN]
**Primary goal**: Re-subscription
**Key flows**: Winback flow
**Success metric**: Winback conversion rate, reactivated MRR
**Anti-patterns**: Don't target customers who cancelled due to medical/safety reasons; don't exceed offer limits in `playbooks/winback.md`.

---

## Research / suppression segments

### VIP / High-LTV
**ID / Klaviyo list name**: [FILL IN]
**Definition**: [FILL IN: e.g., top X% by realized LTV, or predicted LTV > $Y]
**Use**: Suppress from aggressive offers; qualify for exclusive programs.

### Chronic Refunders
**ID / Klaviyo list name**: [FILL IN]
**Definition**: [FILL IN: e.g., ≥ N refunds in last 12 months]
**Use**: Suppression from winback and promotional flows. Flag for ops review.

### Internal / Employee
**ID / Klaviyo list name**: [FILL IN]
**Definition**: Email domain = [FILL IN] or tagged in platform
**Use**: Suppress from all reporting and live campaign sends.
