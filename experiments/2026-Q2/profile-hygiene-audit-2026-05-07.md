---
title: Profile hygiene audit (Stasis Sunset Flow)
status: In flight
brand: stasis
owner: Bryce
updated: 2026-05-07
---

# Profile hygiene audit — Stasis Sunset Flow

## Hypothesis

Sending to long-unengaged Stasis profiles is dragging deliverability and
inflating "Unengaged 90d" segment counts. The `Sunset Flow [antidote]`
should be suppressing them but is currently Live with 0 actions, so
nothing is happening.

## Status

- API confirms: `Sunset Flow [antidote]` (id `fix_flow_s_sunset`) is Live, 0 actions.
- Pinned alert is rendering on `/deliverability` until this is fixed.
- Owner: Bryce. Awaiting Antidote rebuild or in-house fix.

## Next step

Rebuild the suppression logic in-house if Antidote can't ship by 2026-05-20.
Tracked alongside the broader cleanup queue on `/projects`.

## Related

- `knowledge/flow-inventory.md` — Stasis section, currently lacks a Sunset Flow row.
- `knowledge/initial-retention-diagnosis.md` — original engagement-suppression gap.
