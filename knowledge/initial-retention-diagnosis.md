# Initial Retention Diagnosis

Historical retention and Klaviyo diagnosis from the hiring process. This is a
starting hypothesis map, not the live source of truth.

**Provenance**: Klaviyo API audit and interview notes gathered around
March 21, 2026, plus performance tables covering May 2025-March 2026.

**Freshness rule**: Before acting, verify against current Klaviyo, ReCharge,
Shopify, Hightouch/warehouse, and `knowledge/data-sources.md`.

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
