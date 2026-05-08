# Build the Lifecycle Command Center (v1)

This is the working spec the v1 implementation was built against. Treat it
as a contract — if you change anything substantive, update this file *and*
the implementation in the same PR so future-you can reconstruct intent.

## What this is and why

A standing source of truth for retention performance, replacing the one-off
Klaviyo audit pattern. Designed first as the Head of Retention's daily-scan
tool, second as a leadership-readable surface. Scope is creative
performance, deliverability, and projects/roadmap — not subscription
health (deferred to v2).

## Standing rules that govern this build

1. **No customer PII on the rendered site.** Aggregate before baking into
   JSON. Use cohort labels, percentages, or campaign-level rollups only.
2. **Refill attributed-revenue caveat (rule #7) renders inline on every
   chart that displays a Klaviyo attributed-revenue figure.** Wording:
   "Klaviyo `Placed Order` attribution credits orders within a 5-day
   window of any send/open/click and includes auto-renew subscription
   orders. Substantially overstates incremental lift for subscription-
   heavy revenue. See CLAUDE.md rule #7."
3. **Credential preflight is mandatory.** At the top of every data-fetch
   run, verify each Klaviyo key independently by calling `/api/accounts/`.
   Fail the build loudly if any key is missing, lacks `accounts:read`, or
   if the two keys resolve to the same `org_id`.

## Tech stack

- Framework: Astro + TypeScript. SSG (`output: 'static'`).
- Charts: Chart.js (single library — do not mix).
- Build/deploy: GitHub Actions → GitHub Pages.
- Data fetch: Node/TypeScript scripts under `scripts/fetch/`.
- Package manager: pnpm.

## Repo layout

See `data/README.md`, `.github/workflows/`, `src/`, `scripts/` in the tree.
The fetch scripts write JSON snapshots into `data/<brand>/`; the Astro
build reads them at compile time.

## Refresh model

Three triggers:

1. **Cron** (06:00 PT, 13:00 UTC). Runs preflight → fetch → commits
   `data/` if changed → push triggers `build-on-push.yml`.
2. **`workflow_dispatch`** with `fresh_fetch: boolean`. False = rebuild
   from existing data without re-fetching.
3. **Push to main**. Skips data fetch. Reads `data/` as-is. Builds + deploys.

## Out of scope for v1

- Notion integration (v2).
- Subscription-health pages (v2; ReCharge keys validated only).
- Refill Reality / holdout-incrementality computation.
- Auth or redaction layer — public site, public Klaviyo data, owner accepts the risk.
- Write-back actions (view-only).

## Acceptance criteria

1. `pnpm install && pnpm dev` runs locally with the seeded `data/`.
2. `pnpm fetch:preflight` against live keys succeeds; fails loud on
   missing key, wrong scope, or shared org_id.
3. Cron workflow runs end-to-end, writes data, commits, push triggers
   deploy.
4. Deployed site shows real Thesis + Stasis numbers, brand toggle works,
   Flow Inventory shows drift flags, Stasis Sunset Flow alert renders,
   refill caveat appears wherever attributed revenue is shown.
5. Editing `knowledge/flow-inventory.md` and pushing rebuilds without
   hitting the Klaviyo API.
6. No customer PII in the build output.
