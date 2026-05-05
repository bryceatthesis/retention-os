---
name: cohort-pull
description: Pull a customer cohort from the data warehouse using natural language. Use when the user asks to "pull customers who...", "query the cohort of...", "show me subscribers who...", or wants to analyze a specific group of customers with SQL.
tools:
  - Read
  - Bash
---

# Cohort Pull

Translate a natural language customer cohort description into SQL, show the query before running it, execute it against the warehouse, and return a human-readable summary of the results.

## Sources

- Metric definitions: `knowledge/metrics-definitions.md`
- Data sources + table names: `knowledge/data-sources.md`
- Segment definitions (for named segments): `knowledge/segments.md`
- Lifecycle stage criteria: `knowledge/lifecycle-stages.md`

## Steps

### 1. Parse the request
Identify:
- **Who**: The customer criteria (subscription status, cohort window, behavior, segment membership)
- **What**: What the user wants to know about this cohort (size, retention, revenue, behavior)
- **When**: Any time window constraints

If any part is ambiguous, ask one clarifying question before proceeding. Do not guess.

### 2. Identify the source tables
Read `knowledge/data-sources.md` to confirm:
- Which table is the source of truth for the key entities (subscriptions, orders, events)
- Data freshness / lag for the relevant tables
- Any known caveats (deleted records filter, timezone handling, etc.)

State the source table(s) you'll use and why.

### 3. Write the SQL
Draft the query. Include:
- Explicit column aliases for readability
- Comments explaining any non-obvious filters
- `LIMIT` for exploratory pulls unless the user asks for a full count
- Filter for `deleted_at IS NULL` (or equivalent) per `knowledge/data-sources.md` caveats

**Show the query to the user before running it.** Say:
> "Here's the query I'll run. Does this look right, or should I adjust anything before executing?"

Wait for confirmation (or proceed if the user has already given blanket approval for this session).

### 4. Execute and summarize
Run the query. Return:
- **Result summary**: N rows, key aggregate values (count, rate, revenue) in plain English
- **Table**: Full result set if ≤ 20 rows; top 20 with row count if larger
- **Data freshness note**: State the as-of date for the data based on `knowledge/data-sources.md`

### 5. Offer next steps
Suggest 1–2 obvious follow-on pulls (e.g., "Want me to break this down by cohort vintage?" or "Should I compare this to the prior period?"). Don't run them — offer.

## Anti-patterns

- Don't run a query without showing it first.
- Don't infer table or column names — read `knowledge/data-sources.md` and ask if uncertain.
- Don't aggregate across voluntary and involuntary churn without separating them.
- Don't return raw PII columns (email, name, phone). Use customer_id only.
- Don't treat the result as final without noting data freshness lag.
- Don't use `SELECT *` — always specify columns.
