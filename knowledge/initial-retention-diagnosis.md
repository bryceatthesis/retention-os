# Initial Retention Diagnosis

Historical retention and Klaviyo diagnosis from the hiring process. This is a
starting hypothesis map, not the live source of truth.

**Provenance**: Klaviyo API audit and interview notes gathered around
March 21, 2026, plus performance tables covering May 2025-March 2026.

**Freshness rule**: Before acting, verify against current Klaviyo, ReCharge,
Shopify, Hightouch/warehouse, and `knowledge/data-sources.md`.

---

## Progress Check — May 5, 2026 (First Day In-Seat)

*~6 weeks after the original audit. Data pulled live from Klaviyo API.*

### Headline

The agency (Antidote) has been active on **segments and campaigns**. The flow architecture issues from the audit are **largely untouched** — and have gotten worse in two places (more Hormesis Transition variants, more draft clutter).

| Area | Movement |
|---|---|
| Campaign calendar | ✅ Resumed April 1 after going dark Feb–March |
| SMS sends | ✅ Restarted April 9 (still 100% blast — no lifecycle SMS) |
| Segments | ✅ +39 new Antidote segments (lead engagement + suppression framework) |
| Devotion Cold Outreach (1.2% unsub flag) | ✅ Moved live → draft |
| Hormesis Transition variant cleanup | ❌ Got worse — 6 live variants now (was 3) |
| Dead metric cleanup | ❌ 1 of 12 deleted; account now at 215 metrics (was 199/200) |
| [DRAINING] / Updated / Rebrand draft cleanup | ❌ All 17+ still in account |
| Missing flows (dunning, cross-sell, anniversary, OTP→Sub, loyalty tier, post-winback, lifecycle SMS) | ❌ None built |

### What moved

**Campaign calendar**: 13 emails sent April 1 → May 3. Mix of education/brand (Peak Performance, Neuro-Stabilizer Strategy, Earth Day, Mental Performance Gap), winback (4.21 Winback Offer + 4.23 Final Call), and customer-facing (60-Day Transformation, Thesis Results). Pace ~2–3 sends/week — genuine improvement.

**SMS restarted**: 7 sends April 9 → May 1, all paired with email campaigns. Still 100% promotional blast — zero lifecycle SMS flows.

**Antidote segment build-out**: 39 new segments tagged `[antidote]`. Tiered lead engagement at 7/14/21/30/60/90/120-day (Lead and SMS variants). New suppression tiers: `EX: Negative Engagement`, `EX: Too Many Emails`, `EX: Unengaged L30D`. New winback tiers: 90/120 Day Engaged Winbacks. Also: `Active Recharge Subscribers [antidote]`, `All Time Purchasers [antidote]`, `Eli Health Cortisol Test Purchasers` (Stasis cortisol test launch), `120 Day Clarity Abandoners` (first product-specific lapsed-customer segment).

**New lead acquisition flows** (live Mar 12): `50% Off_Leads | Browse Abandonment` and `50% OFF_Leads | Abandoned Checkout`.

**Lead Hightouch flows paused** (Apr 27): `Leads | Hightouch - AID` and its SMS counterpart moved live → draft. The 5.2M-recipient/12mo flow is now dormant. Confirm intentional.

**New utility metrics added**: Coupon Used/Assigned (Apr 21–22), Skipped Send (Apr 1), Hosted Page Viewed via Zaymo (Apr 21), Subscribed to Newsletter (Mar 26), Okendo Loyalty Store Credit Awarded (May 5).

### What didn't move

**Hormesis Transition variants — got worse**: Was 3 simultaneous live variants in March. Now 6:
- 01.24.2026 - Motivation Free
- 02.18.2026 - Clarity Free
- 03.04.2026 - Clarity
- 03.16.2026 - Clarity
- 04.16.2026 - Clarity *(new since audit)*
- 04.16.2026 - Clarity Free *(new since audit)*

Each migration cohort is getting its own dated flow rather than one parameterized flow. Cleanup debt is compounding.

**Dead metric cleanup — 1 of 12 deleted**: The "a" test metric (`W6v4LX`) was deleted. All other 11 flagged metrics still exist. Account is now at 215 metrics (limit may have moved or gone unenforced).

**Draft/draining flow pile-up**: 47 draft, 36 live, 6 manual today (audit was ~38 live / ~40 draft). Net: more drafts, fewer live — but all 7 `[DRAINING]` flows, all 7 `Updated |` replacements, and all 3 `Rebrand |` orphans are still sitting there.

**Every missing flow from the audit is still missing.** One nuance: ReCharge handles dunning natively — verify whether the "dunning gap" is actually a gap or an intentional split between ReCharge (payment retry) and Klaviyo (recovery messaging).

**Segment gaps still open**:
- No subscription tenure segments (new vs. 3mo+ vs. 6mo+)
- No LTV/spend-tier segmentation
- No Stasis-specific subscriber segment (only L30 purchasers exists)
- Product-specific segments limited to `120 Day Clarity Abandoners` — no Motivation/Stress Reset/Neuroprotection equivalents

**Winback flow unchanged**: Standard winback flow `WEFcjQ` (45.7K recip, 48% open, 0.9% click, 0.21% conv) not modified since the audit. Two campaign-level sends ran in late April (4.21 + 4.23) but the flow itself is untouched.

**M1 Onboarding unchanged**: Flow `TezDRv` not modified since the audit.

**Refill Reminders - Hormesis (crown jewel)**: Last updated 2026-04-16. Worth confirming what changed.

### Implications for week 1 triage

Three buckets:

1. **Validate and inherit what's in motion** — Antidote's engagement segment framework, campaign cadence, SMS resumption. Check whether the new winback/SMS segments are wired into flows or just sitting unused.

2. **Stop the active decay** — Hormesis Transition variant sprawl (6 live flows) and draft pile-up are accumulating debt. One consolidation pass on refill variants is the highest-leverage hygiene win.

3. **Sequence the missing strategic work** — every "missing flow" is still missing. Lifecycle SMS post-purchase and OTP→Sub conversion have the clearest revenue case. These need a build sequence and an owner.

Conspicuously absent from any progress: movement on the **structural churn floor** (~5K cancellations/month) or **campaign click-rate gap** (0.2–0.8% vs. 2–3% benchmark). Those aren't fixable inside Klaviyo alone — they need cross-functional ownership, which is the role.

---

## Executive Summary

| Theme | Historical evidence | Implication |
|---|---|---|
| Churn floor | Monthly subscription cancels held between roughly 4.9K and 5.8K for 11 months despite acquisition swings. | Retention needs structural fixes downstream of acquisition. |
| Net subscriber pressure | Cumulative net subscriber change since Hormesis launch was estimated at -3,651. | Stable revenue may be masking subscriber base erosion. |
| Month 3 risk | Approximate retention curve suggested a major drop by month 3. | Onboarding and early habit formation should be first-class workstreams. |
| Revenue lag | Monthly revenue stayed near a $1.9M-$2.35M band while subscribers declined. | Do not use revenue alone as proof retention is healthy. |
| Klaviyo complexity | Account had about 86 flows, 50+ lists, 27+ segments, and was near the 200 metric limit. | Hygiene and source-of-truth work are high-leverage. |
| Lifecycle SMS gap | SMS appeared promo-blast-heavy with no active customer lifecycle SMS flows. | SMS should be rebuilt around lifecycle value and suppression discipline. |
| Dunning gap | No active dunning/payment-failed recovery flow was visible. | Involuntary churn recovery is an urgent audit area. |

---

## Subscription Flow Snapshot

Historical ReCharge snapshot from May 2025 through partial March 2026.

| Month | Sub starts | Sub cancels | Net |
|---|---:|---:|---:|
| May 2025 | 4,927 | 5,304 | -377 |
| Jun 2025 | 4,671 | 4,859 | -188 |
| Jul 2025 | 4,288 | 4,941 | -653 |
| Aug 2025 | 6,596 | 5,012 | +1,584 |
| Sep 2025 | 4,897 | 5,357 | -460 |
| Oct 2025 | 3,908 | 5,432 | -1,524 |
| Nov 2025 | 5,702 | 5,313 | +389 |
| Dec 2025 | 3,322 | 5,171 | -1,849 |
| Jan 2026 | 7,644 | 5,810 | +1,834 |
| Feb 2026 | 4,188 | 5,668 | -1,480 |
| Mar 2026 | 2,762 | 3,689 | -927 |

March 2026 was partial through roughly March 20.

### Working Interpretation

- Acquisition spikes created temporary net-positive months, but cancellations were persistent.
- ReCharge orders plateaued around 17K-20K/month in the historical period.
- Implied active subscriber count was roughly 14K-17K at the time of the audit.
- Implied monthly churn was roughly 30%-38%, pending true cohort validation.
- Estimated retention curve:
  - Month 1: roughly 65%-70% active
  - Month 2: roughly 45%-50% active
  - Month 3: roughly 30%-35% active
  - Month 4: roughly 20%-25% active

**Validation needed**: True cohort retention curves from ReCharge/warehouse,
split by product, acquisition channel, offer, and first formulation.

---

## Klaviyo Account Snapshot

| Area | Historical state | Risk |
|---|---|---|
| Flows | About 86 total; roughly 38 live, 40 draft/manual, 7 draining. | Hard to reason about lifecycle coverage and overlap. |
| Metrics | 199/200 metrics used. | New instrumentation may be blocked; old events may confuse reporting. |
| Lists | 50+ lists, many stale. | Send/audience hygiene risk. |
| Segments | 27+ segments. | Missing lifecycle/product/LTV segmentation despite segment count. |
| Integrations | Klaviyo, Shopify, ReCharge, custom API, Zaymo, LateShipment.com, Social Snowball, Okendo, Tapp, Hightouch, Gorgias, Zendesk, Friendbuy, Eventbrite, Meta Ads, Typeform, Zapier. | Multiple overlapping systems require clear source-of-truth rules. |

---

## Strong Existing Assets

| Asset | Historical signal | Why it matters |
|---|---|---|
| Refill Reminders - Hormesis | 202K recipients, 35% open, 11% click, 23% conversion; attributed revenue around $673K in Jan and $721K in Feb. | This was the retention backbone and should be audited before changing. |
| M1 Onboarding Flow | 80.9K recipients, 57% open, 1.3% click. | Large onboarding surface with room to optimize clicks/actions. |
| M1 NYNM Mindshift Series | 36.7K recipients, 60% open, 6.8% click. | Education can drive engagement when targeted well. |
| Order Confirmation | 96.9K recipients, 44% open, 10.5% click. | Transactional moments may be valuable for habit setup and portal education. |
| D30+ Engaged leads | 120.9K recipients, 64% open, 1.1% click. | Lead education machinery exists, but active customer education looked underbuilt. |
| Super User Flow | 1.4K recipients, 74% open. | VIP/super-user logic may be reusable for loyalty or advocacy. |

---

## Missing Or Underbuilt Lifecycle Coverage

| Gap | Why it matters | First validation step |
|---|---|---|
| Dunning / payment failed | Subscription-first business needs involuntary churn recovery. | Verify payment-failed event health and current ReCharge dunning settings. |
| Lifecycle SMS | SMS was promotional, not lifecycle. | Inventory SMS consent, unsubscribe history, and safe suppression rules. |
| Cross-sell / upsell | Stasis cross-sell existed as gifting, not systematic lifecycle. | Quantify overlap between Thesis and Stasis customers. |
| Anniversary / milestone | Long-term subscribers were not visibly recognized. | Pull active tenure distribution and churn by tenure. |
| Product-specific onboarding | M1/M2 existed, but not full product-specific paths. | Map product/formulation to retention and support issues. |
| OTP to subscription | One-time purchasers were tracked but not systematically converted. | Size OTP cohorts and measure repeat/subscription conversion. |
| Loyalty tier notifications | Okendo loyalty metric existed, but no visible flow. | Confirm loyalty tool status and event reliability. |
| Post-winback nurture | Reactivated customers entered standard paths. | Measure retention of reactivated subscribers vs. first-time subscribers. |

---

## Problem Areas To Re-Audit

| Area | Historical signal | Re-audit question |
|---|---|---|
| Hormesis transition flows | Three simultaneous transition refill reminder variants were still running. | Are these still needed, or are they legacy migration leftovers? |
| Winback | 45.7K recipients, 48% open, 0.9% click, 0.21% conversion. | Is winback audience, offer, timing, or post-click path the constraint? |
| Cold outreach | Devotion Cold Outreach had 15.8K recipients and 1.2% unsubscribe. | Should this be paused, suppressed, or separated from lifecycle health? |
| Draft/draining clutter | 15+ dead, draining, or draft flows cluttered the account. | Which can be archived after confirming no dependencies? |
| Active customer campaigns | Campaigns appeared promo-driven; education went mostly to leads. | What active customer education calendar should exist? |
| SMS list health | Jan 6 SMS launch had 5.15% unsubscribe on 50.7K sends. | What suppression and lifecycle rules are needed before SMS expansion? |

---

## Segment Gaps

| Missing segment | Why it matters |
|---|---|
| Active subscribers by product/formulation | Needed for product-specific onboarding, education, and churn analysis. |
| Subscription tenure bands | Needed for new vs. 3mo+ vs. 6mo+ lifecycle strategy. |
| Stasis subscribers | Needed for brand-specific lifecycle reporting and cross-sell controls. |
| LTV / spend tier | Needed for VIP suppression, offer discipline, and loyalty design. |
| Reactivated subscribers | Needed to measure winback quality and post-winback retention. |
| OTP purchasers by conversion readiness | Needed for one-time-to-subscription lifecycle work. |

---

## Metrics Cleanup Candidates

Historical audit identified these as likely dead, duplicate, or broken. Verify
before deleting anything.

| Metric | ID | Historical issue |
|---|---|---|
| Placed Order (API) | MHnLLf | 0 events ever |
| Checkout Order Placed (API) | R6Tcmn | 0 events |
| Thesis First Subscription Order | X29XjE | Stopped May 2025 |
| Thesis Recurring Subscription Order | WhdHbk | Stopped Jun 2025 |
| Thesis One-Time Order | VDuBqr | Stopped May 2025 |
| Formula First Subscription Order | SyE7cM | Never fired |
| Formula Recurring Subscription Order | UhzfaS | Never fired |
| Formula One-Time Order | Xf7u8v | Never fired |
| Subscription Payment Failed | TFwpvU | 0 events; possibly broken/misconfigured |
| Subscription Canceled (custom) | UwyqUs | 0 events; duplicate of ReCharge metric |
| a | W6v4LX | Test metric |
| Active on Site duplicate | P6bPCq / XhWNBj | Two metrics, only one maintained |

Newer metrics at the time:

| Metric | ID | Created |
|---|---|---|
| Added to Cart | XLuKYu | Feb 18, 2026 |
| Active on Site | XhWNBj | Mar 16, 2026 |

---

## List Cleanup Candidates

Historical stale list examples included: DojoMojo Blast, Get Fit Don't Quit,
Talon Uploaded by Edison, Stay Strong Live Long, LimeLight Orders, Preview List,
CSTN Test, SA Survey Sample lists, Mother's Day sends, winback holdout lists,
Cindy test lists, webinar lists, and snapshot lists.

**Rule**: Archive/delete only after confirming no active flow, suppression, or
reporting dependency.

---

## Priority Workstreams Seeded By Discovery

| Priority | Evidence | Suggested first deliverable |
|---|---|---|
| Source-of-truth map | Multiple overlapping systems and stale metrics. | Complete `knowledge/data-sources.md`. |
| Flow inventory | Account had many live/draft/draining flows. | Complete `knowledge/flow-inventory.md` with current status. |
| Dunning recovery | No visible active payment-failed lifecycle. | Audit ReCharge/Klaviyo dunning state and event reliability. |
| Onboarding / month-3 churn | Estimated retention curve drops sharply by month 3. | Cohort retention pull by acquisition month, product, and first offer. |
| Lifecycle SMS rebuild | Promo SMS showed list damage; lifecycle SMS was absent. | SMS consent/list-health audit and lifecycle SMS principles. |
| Winback reset | Existing winback converted poorly. | Rebuild eligibility, holdout, offer rules, and post-winback nurture. |
| Product-specific lifecycle | Thesis/Stasis/Kids and formulation paths likely differ. | Product-level lifecycle map and segment definitions. |
| Loyalty/referral | Loyalty absent and referral underperforming in hiring context. | Define business case, retention hypothesis, and measurement plan. |
