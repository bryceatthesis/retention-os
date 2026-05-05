---
name: lifecycle-audit
description: Audit a Klaviyo flow against the lifecycle audit checklist. Use when the user says "audit [flow name] flow", "review the [flow] before we launch", or "check if [flow] is set up correctly".
tools:
  - Read
  - Bash
---

# Lifecycle Audit

Audit a Klaviyo flow step-by-step against `playbooks/lifecycle-audit.md`. Produces a structured audit report with Pass / Fail / Needs Attention for each check and a prioritized action list.

**Read-only**: this skill never modifies Klaviyo flows. It produces an audit report only.

## Sources

- Audit checklist: `playbooks/lifecycle-audit.md` — execute every section
- Flow catalog: `knowledge/flow-inventory.md` — get flow ID, status, trigger, audience
- Segment definitions: `knowledge/segments.md` — verify audience matches
- Lifecycle stage expectations: `knowledge/lifecycle-stages.md` — verify timing is stage-appropriate
- Winback offer policy (if auditing winback flow): `playbooks/winback.md`

## Steps

### 1. Identify the flow

Look up the flow in `knowledge/flow-inventory.md`:
- Confirm the Klaviyo flow ID
- Note the trigger, target segment, goal, and last audit date
- Note any known issues or recent changes

If the flow isn't in `knowledge/flow-inventory.md`, flag this as a finding ("Flow not documented — add to flow-inventory.md before proceeding") and ask the user for flow details.

### 2. Gather flow details

Via Klaviyo MCP (if available) or user-provided description:
- Full flow structure: trigger → splits → messages → exits
- Audience / segment configuration
- Smart sending settings
- A/B test configuration (if any)
- Message content for each step (subject, preview, CTAs, links)
- Holdout configuration

If Klaviyo MCP is not available, prompt the user for a screenshot or export of the flow before proceeding.

### 3. Run every checklist section from playbooks/lifecycle-audit.md

Work through each section in order:
1. Trigger logic
2. Audience and segmentation
3. Flow structure and logic
4. Content review
5. Timing and cadence
6. Measurement

For each check: state Pass / Fail / Needs Attention / N/A with a brief note.

### 4. Produce the audit report

Use the report format from `playbooks/lifecycle-audit.md`:
- Summary assessment
- Findings table (section, check, status, priority)
- Prioritized action items
- Go/no-go decision

Sort action items: Fails (blocking) first, then Needs Attention by impact, then minor.

### 5. Offer next steps

If the audit passes: "This flow looks ready. Want me to document the audit date in `knowledge/flow-inventory.md`?"

If the audit has Fails: "There are [N] blocking issues to resolve before this flow should go live / continue running. Here's the fix priority order: [list]."

## Anti-patterns

- Don't skip sections of the checklist — each section catches a different failure mode.
- Don't mark a check as Pass if you couldn't verify it — mark as N/A with a note.
- Don't suggest flow changes — this skill audits, it doesn't redesign. File suggestions as action items for a separate conversation.
- Don't approve a flow to ship if it has any Fail status.
- Don't ignore the holdout check for flows measuring revenue impact — an unmeasured flow is a wasted experiment.
- Don't evaluate a flow without first reading its entry in `knowledge/flow-inventory.md`.
