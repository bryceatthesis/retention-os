# Data Sources

Source-of-truth map for every data topic. When in doubt about where to pull data, check here first. Using the wrong source is the #1 cause of number discrepancies in retention reporting.

---

## Source-of-truth by topic

| Topic | Source of truth | Table / location | Refresh | Lag | Notes |
|---|---|---|---|---|---|
| Active subscriber count | [FILL IN: e.g., BigQuery] | [FILL IN: e.g., thesis_prod.subscriptions] | Daily | T-1 | [FILL IN: any caveats] |
| Subscription status | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] | |
| Churn events | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] | |
| Payment / dunning events | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] | |
| Order history | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] | |
| MRR | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] | |
| Revenue / LTV | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] | |
| Email engagement (opens, clicks) | Klaviyo | Klaviyo profiles / events | Real-time | Minutes | Don't use warehouse for email events — Klaviyo is authoritative |
| SMS engagement | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] | |
| Customer profile (name, email, etc.) | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] | |
| Quiz/formulation data | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] | |
| CS ticket data | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] | |
| NPS / survey responses | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] | |
| Product inventory / shipment | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] | |

---

## Data systems

### [FILL IN: e.g., BigQuery — thesis_prod]
**What it contains**: [FILL IN]
**Access**: [FILL IN: e.g., GCP console, service account for Claude Code via MCP]
**Primary contact**: [FILL IN]
**Gotchas**:
- [FILL IN: e.g., "subscriptions table includes deleted records — always filter WHERE deleted_at IS NULL"]
- [FILL IN]

---

### Klaviyo
**What it contains**: Email/SMS profiles, events (opens, clicks, conversions), segment memberships, flow performance metrics.
**Access**: Klaviyo dashboard; API via `.mcp.json` connector.
**Primary contact**: [FILL IN]
**Gotchas**:
- Klaviyo's open tracking is unreliable since iOS 15 (inflated opens). Prefer click rates for engagement signals.
- Segment sizes in Klaviyo are approximate and cached; run a fresh count before large sends.
- [FILL IN: any other Thesis-specific quirks]

---

### [FILL IN: subscription platform, e.g., Recharge / Skio / Bold]
**What it contains**: Subscription records, billing history, payment failures, cancellation reasons.
**Access**: [FILL IN]
**Primary contact**: [FILL IN]
**Gotchas**:
- [FILL IN: e.g., "Cancellation reasons are free-text — require standardization before analysis"]

---

### [FILL IN: e.g., Shopify]
**What it contains**: Order history, product catalog, refunds.
**Access**: [FILL IN]
**Primary contact**: [FILL IN]
**Gotchas**:
- [FILL IN]

---

### [FILL IN: e.g., Zendesk / Gorgias]
**What it contains**: CS tickets, cancellation-related contacts, NPS.
**Access**: [FILL IN]
**Primary contact**: [FILL IN]
**Gotchas**:
- [FILL IN]

---

## Data freshness rules

- **T-1 warning**: Warehouse data is as of yesterday. Do not run churn or retention reports on the day of a large campaign send — wait 24-48 hours for event data to settle.
- **Klaviyo event lag**: [FILL IN: how long Klaviyo events take to be queryable via API]
- **Real-time needs**: If you need real-time counts, use the subscription platform's dashboard directly, not the warehouse.

---

## Common discrepancies and resolutions

| Discrepancy | Likely cause | Resolution |
|---|---|---|
| Klaviyo segment size ≠ warehouse active subscriber count | Klaviyo profile deduplication / sync lag | Use warehouse for headcount reporting; Klaviyo for sends |
| Revenue in Shopify ≠ revenue in warehouse | Refunds processed with lag | Check refund sync timestamp |
| Churn rate in subscription platform ≠ warehouse | Deleted vs. cancelled distinction | [FILL IN: standard resolution] |
| [FILL IN] | [FILL IN] | [FILL IN] |
