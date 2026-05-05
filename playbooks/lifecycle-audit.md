# Lifecycle Audit Playbook

**Purpose**: Structured checklist for auditing any Klaviyo flow before launch, after a change, or as part of a regular review cycle. Catches logic errors, audience overlap, content issues, and measurement gaps before they cost subscribers.

**Inputs required**: Flow name or Klaviyo flow ID.

**Output**: An audit report with Pass / Fail / Needs Attention for each check, plus a prioritized action list.

**Skill**: Run `/lifecycle-audit [flow name]` — it steps through this checklist against `knowledge/flow-inventory.md` and any Klaviyo data available via MCP.

---

## Anti-patterns

- Don't audit your own flow without a second read — familiarity blinds you to errors.
- Don't ship a flow with a Fail on any trigger, audience, or suppression check.
- Don't skip the holdout check for any flow intended to measure revenue impact.
- Don't treat "Live" status as evidence the flow is healthy — flows degrade silently.

---

## Pre-audit: gather context (5 min)

Before running the checklist, confirm:
- [ ] Flow name and Klaviyo flow ID (from `knowledge/flow-inventory.md`)
- [ ] Flow owner and last modification date
- [ ] Reason for audit: New launch / Scheduled review / Post-incident / Pre-campaign
- [ ] Any known issues or recent changes to flag

---

## Section 1: Trigger logic

| Check | Pass / Fail / N/A | Notes |
|---|---|---|
| Trigger event is correctly defined (event name, filters) | | |
| Trigger conditions are tightly scoped — no risk of firing on wrong profiles | | |
| Trigger does not overlap with another active flow's trigger on the same audience | | |
| Smart sending is configured correctly (on or deliberately off) | | |
| Flow is not re-triggerable when it shouldn't be (check "Allow a profile to be in this flow multiple times" setting) | | |

---

## Section 2: Audience and segmentation

| Check | Pass / Fail / N/A | Notes |
|---|---|---|
| Audience definition matches intended segment (verify against `knowledge/segments.md`) | | |
| Internal / employee profiles are suppressed | | |
| Profiles with hard bounces / global unsubscribes are excluded | | |
| Any suppression for recent purchases, recent cancellations, or overlapping flows is in place | | |
| Segment size is plausible (not accidentally too broad or too narrow) | | |
| [FILL IN: any Thesis-specific suppression rules] | | |

---

## Section 3: Flow structure and logic

| Check | Pass / Fail / N/A | Notes |
|---|---|---|
| All conditional splits have a matching "else" path | | |
| All paths eventually reach an end (no dead branches) | | |
| Time delays are intentional and appropriate for the stage (see `knowledge/lifecycle-stages.md`) | | |
| A/B test splits are correctly weighted (if any) | | |
| Profile update actions are intentional (not accidentally overwriting data) | | |
| Any exit condition is correctly configured | | |

---

## Section 4: Content review

| Check | Pass / Fail / N/A | Notes |
|---|---|---|
| Subject lines are set (no "untitled" defaults) | | |
| Preview text is set | | |
| From name / from address matches Thesis brand standards | | |
| No broken links (click every CTA) | | |
| UTM parameters are in place on all links | | |
| Unsubscribe / manage preferences link is present | | |
| No PII or raw customer data in dynamic blocks | | |
| Mobile rendering checked | | |
| Content tone matches lifecycle stage (educational for new, value-reinforcing for active, empathetic for at-risk) | | |
| Offer (if any) is within policy limits (see `playbooks/winback.md` for winback-specific rules) | | |
| [FILL IN: any Thesis brand / compliance checks] | | |

---

## Section 5: Timing and cadence

| Check | Pass / Fail / N/A | Notes |
|---|---|---|
| Send times are appropriate for audience timezone | | |
| Cadence is not too aggressive for lifecycle stage | | |
| Flow does not create a contact burst within 24h of another major campaign | | |
| Total flow duration is appropriate (not running forever when subscriber churns mid-flow) | | |

---

## Section 6: Measurement

| Check | Pass / Fail / N/A | Notes |
|---|---|---|
| Conversion goal is defined in Klaviyo | | |
| Conversion window is appropriate for the goal (purchase, reactivation, etc.) | | |
| Holdout group is configured (for any flow where we want to measure causal impact) | | |
| Holdout size is adequate for statistical power: [FILL IN: standard holdout %] | | |
| UTMs are consistent with attribution model | | |
| Baseline metrics are documented before launch (for comparison) | | |

---

## Audit report output

```markdown
## Flow Audit: [Flow Name]
**Date**: [date]
**Auditor**: [name]
**Klaviyo flow ID**: [ID]
**Reason**: [New launch / Scheduled review / etc.]

### Summary
[One-paragraph assessment. Is this flow ready to ship / continue running?]

### Findings

| Section | Check | Status | Priority |
|---|---|---|---|
| Trigger | [issue] | Fail | High |
| Audience | [issue] | Needs Attention | Medium |
| ... | | | |

### Action items
| # | Action | Owner | Due |
|---|---|---|---|
| 1 | [FILL IN] | [FILL IN] | [FILL IN] |

### Approved to ship / continue?
[ ] Yes — no Fails, all Needs Attention are acknowledged
[ ] No — [specific Fail(s) must be resolved]
```
