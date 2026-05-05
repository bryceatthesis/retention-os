# New Segment Launch Playbook

**Purpose**: Structured process for defining, building, testing, and shipping a new customer segment in Klaviyo. Prevents ad hoc segment creation that leads to audience overlap, inconsistent definitions, and untestable campaigns.

**Inputs required**: A behavioral or lifecycle insight that motivates the segment, and a clear goal for what the segment will do.

**Output**: A documented segment in `knowledge/segments.md`, a validated Klaviyo segment/list, and a go/no-go decision.

---

## Anti-patterns

- Don't create a Klaviyo segment without first documenting it in `knowledge/segments.md`.
- Don't build a segment whose definition can't be expressed in SQL (it's probably too fuzzy).
- Don't skip the overlap check — overlapping segments send duplicate messages.
- Don't launch a segment without a clear goal and success metric. "We might want to message them someday" is not a goal.
- Don't name segments vaguely. Names should encode the criteria, not the aspiration.

---

## Phase 1: Research and justification (Day 1–2)

### 1.1 Write the insight
What behavioral or lifecycle observation motivates this segment?

```
Insight: [1–2 sentences describing what you observed in the data]
Source: [query / dashboard / qualitative signal]
Size estimate: ~[N] customers
```

### 1.2 Define the goal
What will you do with this segment, and how will you know it's working?

```
Goal: [Retention / Reactivation / Upsell / Research / Suppression]
Intended action: [e.g., "enroll in a new re-engagement flow"]
Success metric: [e.g., "30d churn rate decreases by X% vs. control"]
Measurement plan: [holdout? holdout size? attribution window?]
```

### 1.3 Check for existing segments
Search `knowledge/segments.md` — is there an existing segment that already captures this audience, or a close enough one to modify instead of creating new?

If a close match exists: consider modifying the existing segment rather than creating a new one. Get sign-off from the segment's owner.

---

## Phase 2: Definition (Day 2–3)

### 2.1 Write the formal definition
Express the segment in SQL first. This forces precision.

```sql
SELECT customer_id
FROM [FILL IN: subscription table]
WHERE [FILL IN: criteria]
  AND [FILL IN: criteria]
  -- exclude
  AND [FILL IN: suppression criteria]
```

### 2.2 Translate to Klaviyo conditions
Map each SQL clause to its Klaviyo equivalent:
- Property filter → Klaviyo profile property
- Event filter → Klaviyo event with filters
- Recency filter → relative date condition

Document any cases where Klaviyo can't perfectly express the SQL definition. These are approximations — note them explicitly.

### 2.3 Name the segment
Use the format: `[Stage] – [Key Criterion] – [Owner Abbrev]`
Example: `Active – No Open 60d – BR`

---

## Phase 3: Build and validate (Day 3–5)

### 3.1 Build in Klaviyo
- [ ] Segment built in Klaviyo with correct conditions
- [ ] Segment name follows naming convention
- [ ] Description field in Klaviyo populated with formal definition and link to this playbook

### 3.2 Size check
- [ ] Segment size is in the expected range (± 20% of your SQL estimate)
- If significantly off: debug the definition discrepancy before proceeding

### 3.3 Overlap check
For each existing live segment and flow audience, check whether this new segment has unacceptable overlap:

| Existing segment | Overlap % | Acceptable? |
|---|---|---|
| [FILL IN] | [FILL IN] | [Y/N] |
| [FILL IN] | [FILL IN] | [Y/N] |

Overlap > [FILL IN: e.g., 30%] with another active flow audience requires resolution (either add exclusions or consolidate).

### 3.4 Sample review
Pull a random sample of 10–20 profiles from the segment and manually verify they match the intent. This catches definition bugs faster than any automated check.

```
Sample review notes:
- Profile [ID]: [expected? Y/N] [note if N]
- Profile [ID]: ...
```

---

## Phase 4: Documentation (Day 5)

### 4.1 Add to knowledge/segments.md
Using the standard segment template:
- [ ] Segment name
- [ ] Klaviyo ID
- [ ] Formal definition
- [ ] Size (with date)
- [ ] Primary goal
- [ ] Key flows/campaigns (even if none yet)
- [ ] Success metric
- [ ] Anti-patterns

### 4.2 Confirm with stakeholders
- [ ] Reviewed with [FILL IN: e.g., Head of Growth or relevant owner]
- [ ] Any cross-functional implications flagged (e.g., CS receiving contacts from this segment)

---

## Phase 5: Launch and monitor (Day 5–30)

### 5.1 Go/no-go checklist
- [ ] Definition validated against SQL
- [ ] Overlap check passed (or exceptions documented and accepted)
- [ ] Sample review passed
- [ ] Documented in `knowledge/segments.md`
- [ ] Success metric and measurement plan confirmed
- [ ] Klaviyo segment in "Live" state

### 5.2 First 30 days
Check at Day 7 and Day 30:
- Segment size stable (not growing/shrinking unexpectedly)?
- If this segment feeds a flow: flow metrics within expected range?
- Any unexpected overlap or suppression issues?

Update `knowledge/segments.md` after 30-day check with current size and any findings.
