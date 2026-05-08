# `data/` — auto-generated snapshots

**This directory is rewritten by `scripts/build-data.ts` on every cron run.**
Do not hand-edit JSON in here unless you're seeding a fixture for local dev.

## Layout

```
data/
├── _meta.json             # preflight result + per-source health (drives <RefreshHeader />)
├── thesis/
│   ├── campaigns.json     # sent email + SMS, trailing 90d, with stats
│   ├── flows.json         # every flow + status + 30d perf + nested messages
│   ├── lists.json         # list inventory + counts
│   ├── segments.json      # segment inventory + counts
│   ├── deliverability.json# 90d daily bounces / spam / unsubs / list growth
│   ├── subscriptions.json # ReCharge stub (v1 only validates the key works)
│   └── templates/<id>.{html,png}  # rendered email HTML + 600px PNG thumb
└── stasis/
    └── (same shape)
```

## Why is this committed?

Two reasons:

1. **Diffable history.** Every daily refresh leaves a git-trackable trail
   of campaigns, flows, list/segment counts, and deliverability rates.
   That's how the deliverability page renders "lists/segments over time"
   without a separate time-series store.
2. **Preview deploys.** The Astro build reads JSON directly. Markdown-only
   PRs need to render without re-hitting the Klaviyo API, which means the
   last good snapshot has to be in-tree.

Customer PII is **never** committed. Aggregates only — see CLAUDE.md rule #1.
The fetch scripts only request rollups (campaign-values-reports, account-
values-reports), profile counts, and template HTML. They do not enumerate
profiles.

## Fixtures vs. live data

The first commit seeds these files with structurally-correct, partly-
synthetic data so the site renders end-to-end before keys land. As soon as
the cron runs against real keys, those fixtures are overwritten.

`schema_version: 1` lives at the top of every file. Bump it when the shape
changes; the loaders in `src/lib/data.ts` will fail loud rather than render
garbage.
