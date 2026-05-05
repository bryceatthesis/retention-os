# Retention OS — CLAUDE.md

## What / Why / How

A Claude-native knowledge base and workflow repo for Thesis's Head of Retention.
- **Claude Code (VS Code)**: deep work — SQL, RCA, experiment design, flow audits.
- **Claude web/Cowork**: quick asks, scheduled digests, artifact generation.

This file is the map. Details live in `knowledge/`, `playbooks/`, and `experiments/`.

---

## Repo map

| Path | Contents |
|---|---|
| `knowledge/` | Definitions, metrics, segments, lifecycle, OKRs, data sources, flow inventory |
| `playbooks/` | Step-by-step SOPs for recurring retention work |
| `experiments/` | Experiment write-ups organized by quarter |
| `.claude/skills/` | Slash commands for common tasks |
| `.claude/agents/` | Subagents for specialized research |

---

## Standing rules (always on)

1. **Never quote raw customer PII.** Anonymize or aggregate before including in any output. Use user IDs, cohort labels, or percentages instead of names/emails.
2. **Confirm before side effects.** Any skill that sends messages, modifies Klaviyo flows, or writes to external systems requires explicit user confirmation. Describe the action and wait.
3. **Cite sources.** For any definitional claim, cite the `knowledge/` file, the query, or the external source that supports it. Do not assert metrics from memory.
4. **Flag data recency.** Note the freshness of any data pulled (see `knowledge/data-sources.md`). Flag if querying within 24 h of a large campaign send.
5. **Audit before modifying flows.** Don't suggest Klaviyo flow changes without referencing `knowledge/flow-inventory.md` and `playbooks/lifecycle-audit.md`.

---

## Skills

| Command | Trigger phrase | Side effects? |
|---|---|---|
| `/cohort-pull` | "pull cohort", "query customers who…" | None (read-only) |
| `/churn-rca` | "investigate churn", "why did churn spike" | None — runs in forked context |
| `/lifecycle-audit` | "audit [flow name] flow" | None (read-only) |
| `/experiment-writeup` | "write up [experiment]", "document results" | None |
| `/weekly-retention-digest` | **Manual only** — invoke explicitly | Sends to Slack; requires confirmation |

---

## Knowledge quick-reference

| Question | Go to |
|---|---|
| What is our north-star metric? | `knowledge/metrics-definitions.md` |
| How is a segment defined? | `knowledge/segments.md` |
| What flows are live in Klaviyo? | `knowledge/flow-inventory.md` |
| What are this quarter's targets? | `knowledge/okrs-and-targets.md` |
| Where does this data live? | `knowledge/data-sources.md` |
| What does a term mean? | `knowledge/glossary.md` |

---

## Agents

- **retention-researcher** (`.claude/agents/retention-researcher.md`): read-only research subagent. Use for multi-source literature/data pulls that would pollute main context. Runs on Opus.

---

## What NOT to do

- Don't run `/weekly-retention-digest` without intentional invocation — it has Slack side effects.
- Don't treat cohort SQL results as final without checking source recency (`knowledge/data-sources.md`).
- Don't define a new segment ad hoc — follow `playbooks/new-segment-launch.md`.
- Don't run a winback campaign without checking eligibility in `playbooks/winback.md`.
- Don't modify Klaviyo flows in any direction without a prior lifecycle audit.
