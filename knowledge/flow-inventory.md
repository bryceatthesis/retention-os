# Klaviyo Flow Inventory

Catalog of all live and draft Klaviyo flows owned by Retention. Update this file whenever a flow is launched, paused, or archived.

For auditing a flow, follow `playbooks/lifecycle-audit.md`.

---

## Flow status key

| Status | Meaning |
|---|---|
| Live | Active and sending |
| Draft | Built but not yet live |
| Paused | Live but temporarily stopped |
| Archived | Deprecated, no longer sending |

---

## Lifecycle flows

### Welcome / Onboarding Series
| Attribute | Value |
|---|---|
| Klaviyo flow ID | [FILL IN] |
| Status | [FILL IN] |
| Trigger | [FILL IN: e.g., "Placed Order" with tag = first subscription] |
| Target segment | New Subscribers |
| Goal | Drive activation event within [FILL IN] days |
| Emails / messages | [FILL IN: N emails over N days] |
| Last audit | [FILL IN] |
| Owner | [FILL IN] |
| Notes | [FILL IN] |

---

### At-Risk Re-engagement
| Attribute | Value |
|---|---|
| Klaviyo flow ID | [FILL IN] |
| Status | [FILL IN] |
| Trigger | [FILL IN: e.g., Segment membership: At-Risk] |
| Target segment | At-Risk |
| Goal | Re-engage before cancellation decision |
| Emails / messages | [FILL IN] |
| Holdout | [FILL IN: % withheld for measurement] |
| Last audit | [FILL IN] |
| Owner | [FILL IN] |
| Notes | [FILL IN] |

---

### Pause Reactivation
| Attribute | Value |
|---|---|
| Klaviyo flow ID | [FILL IN] |
| Status | [FILL IN] |
| Trigger | [FILL IN: e.g., Subscription paused event] |
| Target segment | Paused |
| Goal | Resume subscription before pause expires |
| Emails / messages | [FILL IN] |
| Last audit | [FILL IN] |
| Owner | [FILL IN] |
| Notes | [FILL IN] |

---

### Dunning Recovery
| Attribute | Value |
|---|---|
| Klaviyo flow ID | [FILL IN] |
| Status | [FILL IN] |
| Trigger | [FILL IN: e.g., Payment failed event] |
| Target segment | Dunning (Failed Payment) |
| Goal | Recover payment before subscription lapses |
| Emails / messages | [FILL IN: N emails, cadence] |
| Recovery rate (baseline) | [FILL IN] — see `metrics-definitions.md` |
| Last audit | [FILL IN] |
| Owner | [FILL IN] |
| Notes | [FILL IN] |

---

### Winback
| Attribute | Value |
|---|---|
| Klaviyo flow ID | [FILL IN] |
| Status | [FILL IN] |
| Trigger | [FILL IN: e.g., Segment membership: Winback Eligible] |
| Target segment | Winback Eligible |
| Goal | Re-subscription |
| Emails / messages | [FILL IN] |
| Offer tiers | See `playbooks/winback.md` |
| Holdout | [FILL IN: % withheld for measurement] |
| Last audit | [FILL IN] |
| Owner | [FILL IN] |
| Notes | [FILL IN] |

---

## Transactional / triggered flows

### Post-Cancel Save Offer
| Attribute | Value |
|---|---|
| Klaviyo flow ID | [FILL IN] |
| Status | [FILL IN] |
| Trigger | [FILL IN: e.g., Cancel initiated event, pre-confirmation] |
| Goal | Offer a save (pause, discount, formulation switch) before cancel completes |
| Last audit | [FILL IN] |
| Notes | [FILL IN] |

---

### [FILL IN: e.g., Monthly Check-in / Formulation Update]
| Attribute | Value |
|---|---|
| Klaviyo flow ID | [FILL IN] |
| Status | [FILL IN] |
| Trigger | [FILL IN] |
| Target segment | [FILL IN] |
| Goal | [FILL IN] |
| Last audit | [FILL IN] |

---

## Campaigns (recurring)

| Campaign | Cadence | Last sent | Next send | Owner |
|---|---|---|---|---|
| [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |

---

## Flow performance snapshot

| Flow | Metric | Value | As of |
|---|---|---|---|
| Welcome series | Open rate | [FILL IN] | [FILL IN] |
| Welcome series | Activation rate (attributed) | [FILL IN] | [FILL IN] |
| At-risk | Churn reduction (vs. holdout) | [FILL IN] | [FILL IN] |
| Dunning | Recovery rate | [FILL IN] | [FILL IN] |
| Winback | Conversion rate | [FILL IN] | [FILL IN] |

*Full performance data lives in [FILL IN: e.g., Klaviyo reports / shared dashboard link].*
