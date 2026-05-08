# Retention OS

A Claude-native knowledge base and workflow repo for the Head of Retention at Thesis.

## Purpose

Centralizes the institutional knowledge, metric definitions, SOPs, and slash commands needed to do retention work quickly and consistently — with Claude Code handling deep analysis and Claude web/Cowork handling quick asks and scheduled tasks.

## Structure

```
CLAUDE.md                      # Claude's operating instructions (start here)
README.md                      # This file
CLAUDE.local.md                # Personal scratch (gitignored)
.mcp.json.example              # MCP connector template
knowledge/
  glossary.md                  # Term definitions
  metrics-definitions.md       # Exact metric formulas
  segments.md                  # Customer segment catalog
  lifecycle-stages.md          # Customer lifecycle model
  okrs-and-targets.md          # Current quarter targets
  data-sources.md              # Source-of-truth map
  flow-inventory.md            # Live Klaviyo flow catalog
  company-context.md           # Hiring/onboarding company context
  people-map.md                # Early stakeholder map
  onboarding-context.md        # First-month onboarding context
  initial-retention-diagnosis.md # Historical Klaviyo + retention audit
playbooks/
  churn-investigation.md       # Churn RCA playbook
  lifecycle-audit.md           # Flow audit checklist
  winback.md                   # Winback eligibility + policy
  new-segment-launch.md        # Segment launch process
experiments/
  README.md                    # Standard write-up template
  2026-Q2/                     # Quarter-organized write-ups
.claude/
  settings.json                # Tool permissions
  skills/                      # Slash commands
  agents/                      # Research subagents
private/                       # Ignored local sensitive context
```

## Getting started

1. **Copy `.mcp.json.example` to `.mcp.json`** and fill in credentials for your data connectors (Klaviyo, warehouse, Slack, Notion, Linear, GDrive). This file is gitignored.
2. **Fill in `[FILL IN]` markers** across `knowledge/` — start with `metrics-definitions.md` and `segments.md` since skills depend on them.
3. **Open this folder in VS Code** with the Claude Code extension. Skills will be available as `/cohort-pull`, `/churn-rca`, etc.
4. **For scheduled tasks**, set up `/weekly-retention-digest` as a Cowork routine on Monday mornings.

## How to grow this repo

### Adding knowledge
- New metric → add a row to `knowledge/metrics-definitions.md` with the exact formula, source, and owner.
- New segment → follow `playbooks/new-segment-launch.md`, then add to `knowledge/segments.md`.
- New Klaviyo flow → add a row to `knowledge/flow-inventory.md`.
- New historical/intake context → summarize durable operating facts in `knowledge/`; keep raw sensitive notes in ignored `private/`.

### Adding playbooks
Create `playbooks/<name>.md` with: **Purpose → Inputs → Steps → Outputs → Anti-patterns**.
Reference it from `CLAUDE.md`'s "What NOT to do" section if relevant.

### Adding skills
Create `.claude/skills/<skill-name>/SKILL.md`. Follow the frontmatter conventions already in place:
- Add `disable-model-invocation: true` for anything with side effects.
- Add `context: fork` for deep investigation skills.
- Include an "Anti-patterns" section.

### Adding experiments
Copy the template from `experiments/README.md` into `experiments/YYYY-QN/<slug>.md`.

## Lifecycle Command Center (dashboard)

A static Astro site (`src/`, deployed via GitHub Pages) renders Klaviyo
performance for both brands as a daily-refreshed dashboard. See
`prompts/lifecycle-command-center.md` for the v1 spec, `data/README.md`
for the JSON snapshot layout, and `.github/workflows/` for the
refresh + deploy automation.

```bash
pnpm install            # one-time
pnpm dev                # local dev (uses committed data/ fixtures)
pnpm fetch:preflight    # verify Klaviyo keys against /api/accounts/
pnpm fetch:data         # full preflight + fetch (writes data/)
pnpm build              # static build to dist/
```

Required GitHub Actions secrets: `KLAVIYO_API_KEY_THESIS`,
`KLAVIYO_API_KEY_STASIS`, plus optional `RECHARGE_API_KEY_THESIS`,
`RECHARGE_API_KEY_STASIS` when those creds land.

## Conventions
- `[FILL IN]` marks values that must be populated before the file is useful.
- Knowledge files use tables for scanability; prose only for nuance.
- Historical context must include provenance and a freshness note.
- Playbooks number every step. No ambiguity about sequence.
- Experiment write-ups always include a decision and a next-step owner.
