# Klaviyo Flow Inventory

Last pulled: 2026-05-06. Update this file when flows are launched, paused, or archived.
For auditing a specific flow, follow `playbooks/lifecycle-audit.md`.

---

## Status key

| Status | Meaning |
|---|---|
| Live | Active and sending |
| Manual | Built but held — not auto-triggering |
| Draft | Incomplete or staging |
| Draining | Live but no new entries; being wound down |

---

## Thesis

### Post-Purchase — M1 Onboarding

| Flow | ID | Status | Trigger | Notes |
|---|---|---|---|---|
| Active \| M1 \| Onboarding Flow | TezDRv | Live | Metric | Primary M1 onboarding. 57% open rate, 1.3% CTR — subject lines work, CTAs don't. Rewrite queued. |
| Active \| M1 \| NYNM Mindshift Series | Y6nDb2 | Live | Metric | Seasonal NYNM onboarding variant |
| Active \| M1 \| Shipment Notifications \| Legacy Products | X3RuB4 | Live | Metric | Shipment notifications for legacy product customers |
| Active \| Order Confirmation | RkWf7n | Live | Metric | Order confirmation |
| Active \| Shipment Notifications \| Tapp Test | VSjPq3 | Live | Metric | Shipment notifications — Tapp test variant |

### M2+ Onboarding & Retention

| Flow | ID | Status | Trigger | Notes |
|---|---|---|---|---|
| Active \| M2 \| Onboarding Flow | X7S3Vd | Live | Metric | M2+ subscriber retention flow |
| Active \| M2 \| Okendo Review Request | UAzSju | Live | Metric | Review solicitation |
| Active \| M2 \| Okendo Review - Incentive Distribution | XFPpXz | Live | Metric | Review incentive delivery |
| Active \| M2 \| Okendo Review - Incentive Distribution - Promoter | VTFtgZ | Live | Metric | Promoter-specific review incentive |
| Active \| Okendo Referral Complete - Referrer | T2pwgP | Live | Metric | Referral reward flow |
| Active \| M2 \| Super User Flow | — | Manual | List | Held; not auto-triggering |

### Refill Reminders — Hormesis (8 live flows)

> **Known issue:** These 8 flows send simultaneously to product migration cohorts. Should be consolidated into one flow with routing logic. This is accumulated debt.

| Flow | ID | Status | Notes |
|---|---|---|---|
| Active \| Refill Reminders - Hormesis | TcGQ3t | Live | Base Hormesis refill reminder |
| Active \| Refill Reminders - Hormesis Transition - 01.24.2026 - Motivation Free | XYYzSi | Live | Motivation Free variant |
| Active \| Refill Reminders - Hormesis Transition - 02.18.2026 - Clarity Free | SkKyq7 | Live | Clarity Free variant |
| Active \| Refill Reminders - Hormesis Transition - 03.04.2026 - Clarity | TkECzJ | Live | Clarity variant |
| Active \| Refill Reminders - Hormesis Transition - 03.16.2026 - Clarity | W9TXdt | Live | Clarity variant |
| Active \| Refill Reminders - Hormesis Transition - 04.16.2026 - Clarity | XGLTEP | Live | Clarity variant |
| Active \| Refill Reminders - Hormesis Transition - 04.16.2026 - Clarity Free | SphZqX | Live | Clarity Free variant |
| Active \| Refill Reminder \| Clarity Migration Customer | RhVArK | Live | Clarity migration-specific refill reminder |

### Winback

| Flow | ID | Status | Trigger | Notes |
|---|---|---|---|---|
| Churned \| Winback \| Subscription Cancelled \| Email | WEFcjQ | Live | Metric | Primary winback. No holdout confirmed. Needs reason-specific routing. |

### Acquisition / Leads (Live)

| Flow | ID | Status | Trigger |
|---|---|---|---|
| Leads \| Hormesis Lead Flow \| Quiz Complete \| Lead \| Email | RjTatc | Live | Metric |
| Leads \| Hormesis Lead Flow \| 50% Off [antidote] | UWqjTm | Live | List |
| Leads \| D30+ Engaged \| Leads \| Lead \| Email | R5mpsX | Live | List |
| Leads \| SMS Welcome Flow \| SMS Signup \| Lead \| Email | VbPx4p | Live | Metric |
| Leads \| Sunrise Flow \| Leads \| Lead \| Email | Ty9mwJ | Live | List |
| Leads \| Sunset Flow \| Leads \| Lead \| Email | VwDvzt | Live | List |
| Leads \| Okendo Referral Invitation - Recipient | US2U2x | Live | Metric |
| Leads \| Okendo Referral Opt In - Email Verification | TUUBpH | Live | Metric |
| Lead \| Quiz Abandon Research Request | W9arMW | Live | List |
| Leads \| F7D Holdout - List subscribe | XnAtrm | Live | List |

### Operations (Live)

| Flow | ID | Status | Purpose |
|---|---|---|---|
| OTP Login | Y8c3BR | Live | OTP authentication flow |
| Operations \| Attribute Creation \| First Order Product | UiqQKM | Live | Data ops — sets product attribute on first order |
| Operations \| Attribute Creation \| Quiz Completes | Ypu6Wx | Live | Data ops — sets attribute on quiz completion |
| Shipment \| Delivery Failed Notification | Xy4Hhb | Live | Failed delivery alert |
| Auto-Suppression of Tiktok Profiles [antidote] | SwfeSU | Live | Suppression automation |

### Draft / Draining — Cleanup Queue

| Flow | Status | Notes |
|---|---|---|
| [DRAINING] Active \| M1 \| Onboarding Flow - Hormesis | Draft | Winding down — Hormesis M1 variant |
| [DRAINING] Active \| M1 \| Onboarding Flow - Hormesis - Fulfilled Order Trigger | Draft | Winding down |
| [DRAINING] Active \| M1 \| Onboarding Flow - Tapp Test (×2) | Draft | Winding down — Tapp test variants |
| [DRAINING] Active \| M1 \| Onboarding Flow - Fulfilled Trigger - Tapp Test | Draft | Winding down |
| [DRAINING] Active \| Order Confirmation - Hormesis | Draft | Winding down |
| [DRAINING] Active \| Shipment Notifications - Hormesis | Draft | Winding down |
| Rebrand \| Post-Purchase Onboarding | Draft | Rebrand version — not launched |
| Rebrand \| Subscriber Winback | Draft | Rebrand winback — not launched |
| Updated \| M2 \| Onboarding Flow | Draft | Pending replacement for live M2 flow |
| Updated \| M1 \| Shipment Notifications \| Legacy Products | Draft | Pending update |
| Updated \| M1 \| Order Confirmation \| Legacy Products | Draft | Pending update |
| Social Snowball affiliate templates (4 flows) | Draft | Clone series — evaluate or archive |
| Rebrand \| OTP Replenishment | Manual | Held rebrand version |

---

## Stasis

### Post-Purchase — Subscription

| Flow | ID | Status | Trigger | Notes |
|---|---|---|---|---|
| Subscription Post-Purchase - March 2026 [antidote] | WsitwT | Live | Metric | Primary live post-purchase flow. Launched March 2026 by Antidote. Evaluate content depth and plan upgrade messaging. |
| Subscription Post-Purchase - Delivered Shipment [antidote] | XwL2mY | Manual | Metric | Older version — held |
| Subscription Post-Purchase- Subscription started on ReCharge [antidote] | VgWQHY | Manual | Metric | Older version — held; likely superseded by March 2026 flow |

### Post-Purchase — Kids

| Flow | ID | Status | Notes |
|---|---|---|---|
| post purchase flow - stasis kids [antidote] | WJWQAM | Live | Kids subscriber post-purchase |
| Order Confirmation - Kids [antidote] | Wp4ZG3 | Live | Kids order confirmation |
| shipping confirmation - kids [antidote] | R7uByH | Live | Kids shipment notification |
| Post purchase - stasis kids - Backorder SKUs [antidote] | W8HpJS | Live | Kids backorder handling |

### Order Confirmation & Shipping

| Flow | ID | Status | Notes |
|---|---|---|---|
| Order Confirmation [90d gifting] | VEyhPa | Live | Gifting-specific order confirmation |
| Shipping [antidote] | WWKVDT | Live | Primary shipment notification |

### Refill Reminders (Subscription)

| Flow | ID | Status | Notes |
|---|---|---|---|
| Upcoming Subscription Reminder - Bundle Refills [UPDATED DEC.2025] | X9rNsj | Live | Bundle refill reminder — December 2025 update |
| Upcoming Subscription Reminder - Legacy and OTP | X5yHfL | Live | Legacy and OTP refill reminders |
| Upcoming Subscription Reminder - Non-Bundle - 90d Gifting Milestones | T2ZkLW | Live | Gifting milestone reminders |
| Upcoming Subscription Reminder - Stasis Kids [antidote] | ST6yYB | Live | Kids-specific reminder |
| Upcoming Subscription Reminder - VIP Upgrades [antidote] | XPMBy5 | Live | VIP subscriber upgrade prompts |

### Upgrades & Upsells

| Flow | ID | Status | Trigger | Notes |
|---|---|---|---|---|
| Day + Night Subscription Upgrades | RcYt6p | Live | Metric | Upsell from Day-only to Day + Night subscription |

### Winback

| Flow | ID | Status | Notes |
|---|---|---|---|
| Subscription Winback [antidote] | YgVEQB | Live | Current live winback. Antidote-built. Confirm holdout and cancellation reason routing. |
| Subscription Winback | R99Cvg | Manual | Older version — held. Archive after confirming [antidote] version is complete. |
| Customer Winback - Standard | XLHjjm | Manual | Pre-Antidote standard winback — likely superseded |

### Reviews & Referrals

| Flow | ID | Status | Notes |
|---|---|---|---|
| 2024_Okendo Review Request | T6Tg5v | Live | Review request flow |
| 2024_Okendo Review - Incentive Distribution | TZE7KT | Live | Review incentive delivery |
| Okendo Referral Complete - Referrer [antidote] | T6Fjr3 | Live | Referral reward |
| Okendo Referral Invitation [antidote] | WqdzhE | Live | Referral invitation |

### Acquisition / Leads (Live)

| Flow | ID | Status | Trigger |
|---|---|---|---|
| [25] Lead Flow | V3TSGy | Live | List |
| [26] Lead Flow_Alia Code | SCca5J | Live | List |
| [26] Quiz Leads - Welcome Offer | VUD7gW | Live | List |
| SMS Welcome Flow [antidote] | X7M4U4 | Live | Metric |
| kids lead flow [antidote] | UH6RGc | Live | List |
| Kids Quiz → Quiz Leads | XxMsKk | Live | List |
| Stasis Kids Waitlist Confirmation Flow | WyeFiF | Live | List |

### Operations (Live)

| Flow | ID | Status | Purpose |
|---|---|---|---|
| Abandoned Checkout [antidote] | URGzF3 | Live | Checkout abandonment recovery |
| Browse Abandonment [antidote] | SBYanD | Live | Browse abandonment |
| SMS Checkout Abandonment [antidote] | SBfWmw | Live | SMS checkout recovery |
| Kid Capsule Backorder | VyfyNA | Live | Kids backorder notification |
| Auto-suppression of Tiktok Profiles [antidote] | SNRgeY | Live | Suppression automation |

### Manual — Review for Archive

| Flow | ID | Notes |
|---|---|---|
| Cancelled Order | UxNuef | Manual — evaluate whether this serves a purpose |
| Cancelled Subscription | S7YxLr | Manual — may overlap with winback trigger logic |
| Subscription Reactivated | R2w8DD | Manual — evaluate |
| Refund | TdHnS3 | Manual |
| Product Review / Cross-Sell - Standard | T8TF8W | Manual — older cross-sell, likely superseded |
| GWP Post-Purchase 2024 | W8quc3 | Manual — 2024 GWP, archive |

### Notable Drafts — Cleanup Queue

| Flow | Notes |
|---|---|
| Subscription Post-Purchase - Consolidated Jan.2026 [antidote] | Superseded by March 2026 version — archive |
| Subscription Post-Purchase - Order Delivered [antidote] | Superseded — archive |
| Subscription Post-Purchase- Subscription started on ReCharge - Placed Order [antidote] | Superseded — archive |
| Subscription Reminder Flow [antidote] (×2, inc. clone) | Superseded by updated reminder flows — archive |
| Subscription Winback Flow [antidote] | Draft winback — confirm superseded by live [antidote] winback |
| BFCM Welcome Flow 11.11.25 - Desktop/Mobile Leads | BFCM seasonal — archive |
| Welcome Series variants (Jan 24, Pop-Up, Pop-Up clone, JULY PROMO, [antidote]) | Multiple old welcome series — evaluate which is active lead flow |
| OTP Post-Purchase - Order Delivered [antidote] | Draft OTP post-purchase — confirm status |
| LS - OTP Replenishment | Draft OTP replenishment |
| 90 Day Check-In | Date-based draft — evaluate fit |

---

## What's missing (no flow exists)

| Gap | Brand | Notes |
|---|---|---|
| At-risk re-engagement | Stasis | No flow targeting disengagement signals before cycle 2 |
| At-risk re-engagement | Thesis | No flow confirmed |
| Reason-specific save (pre-cancel) | Both | ReCharge cancellation test addresses "too expensive" only |
| OTP → Subscription conversion | Stasis | Michele has in-flight — confirm status |
| Plan upgrade (1-month → multi-month) | Stasis | Not present in post-purchase series; to be added in next brief |
