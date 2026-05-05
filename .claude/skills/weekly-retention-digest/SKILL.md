---
name: weekly-retention-digest
description: Generate the weekly Monday retention digest. Only invoke when explicitly asked. Has Slack side effects — requires confirmation before sending.
tools:
  - Read
  - Bash
disable-model-invocation: true
---

# Weekly Retention Digest

Generate a weekly retention digest covering key metrics vs. the prior week and the quarter target. Requires explicit confirmation before sending to Slack.

**This skill has side effects**: it sends a message to Slack. Never send without explicit user confirmation. If running in a scheduled context, surface the draft and wait.

## Sources

- Metric definitions and targets: `knowledge/metrics-definitions.md`
- OKR targets: `knowledge/okrs-and-targets.md`
- Data sources: `knowledge/data-sources.md`
- Slack channel: [FILL IN: e.g., #retention-metrics]

## Steps

### 1. Pull metrics (read-only)

Pull the following from the warehouse or Klaviyo as appropriate. Note the as-of date for each.

| Metric | Source | SQL / query |
|---|---|---|
| Active subscribers (EOW) | [FILL IN] | [FILL IN] |
| Net subscriber change WoW | [FILL IN] | [FILL IN] |
| New subscribers this week | [FILL IN] | [FILL IN] |
| Churned subscribers this week (voluntary) | [FILL IN] | [FILL IN] |
| Churned subscribers this week (involuntary) | [FILL IN] | [FILL IN] |
| Current weekly churn rate | [FILL IN] | [FILL IN] |
| MRR (current) | [FILL IN] | [FILL IN] |
| MRR change WoW | [FILL IN] | [FILL IN] |
| [North-star metric] | [FILL IN] | [FILL IN] |
| Dunning recovery rate (trailing 4 weeks) | [FILL IN] | [FILL IN] |

Read `knowledge/data-sources.md` before querying to confirm correct table and freshness.

### 2. Compare to targets

For each metric that has a Q2 target in `knowledge/okrs-and-targets.md`:
- Calculate: current value vs. target
- Status: On track / At risk / Off track
- Use simple thresholds: [FILL IN: e.g., "On track = within 5% of target pace, At risk = 5–15% off, Off track = >15% off"]

### 3. Draft the digest

Format as a Slack message:

```
📊 *Weekly Retention Digest — [Week of YYYY-MM-DD]*

*Subscribers*
• Active: [N] ([+/-N] WoW)
• New this week: [N]
• Churned (voluntary / involuntary): [N] / [N]

*Revenue*
• MRR: $[N] ([+/-N%] WoW)

*[North-star metric]*: [value] ([status emoji])

*Flow health*
• Dunning recovery (4w avg): [N%]

*OKR status*
• [KR1]: [value] vs. [target] — [On track ✅ / At risk ⚠️ / Off track 🔴]
• [KR2]: ...

*Flags / notes*
• [Any anomaly, data gap, or thing to watch]

_Data as of [date]. Source: [warehouse/Klaviyo]._
```

### 4. Show draft and confirm

Present the draft digest to the user. Say:
> "Here's this week's digest. Ready to send to [channel], or would you like to adjust anything first?"

**Do not send until the user explicitly confirms.** If the user says "looks good" or "send it", proceed to Step 5.

### 5. Send to Slack

Send the digest to [FILL IN: Slack channel] via the Slack MCP connector. Confirm success and return the message permalink.

## Anti-patterns

- Never send to Slack without explicit user confirmation.
- Never fabricate metric values — if a query fails, show the error and list which metrics are missing.
- Never omit the data-as-of date.
- Never send on a day other than Monday without the user explicitly requesting it.
- Don't include raw customer counts that could expose PII patterns (e.g., "subscriber ID 12345 churned").
