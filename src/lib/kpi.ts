/**
 * KPI tile computations for the homepage.
 * Pure functions over the loaded BrandData — no I/O.
 */

import type { Brand, BrandData } from './data';
import { type Thresholds, status } from './thresholds';

const DAY_MS = 24 * 60 * 60 * 1000;

export interface KpiNumbers {
  emailCampaigns7d: number;
  smsCampaigns7d: number;
  emailCampaignsSparkline90d: SparkPoint[];
  smsCampaignsSparkline90d: SparkPoint[];
  weightedClickRate30d: number | null;
  weightedClickRate90dBaseline: number | null;
  bounceRate30d: number | null;
  unsubRate30d: number | null;
  spamRate30d: number | null;
  netListGrowth30d: number | null;
  listGrowthSubscribed30d: number | null;
  listGrowthUnsubscribed30d: number | null;
  bounceStatus: ReturnType<typeof status>;
  unsubStatus: ReturnType<typeof status>;
  spamStatus: ReturnType<typeof status>;
}

export interface SparkPoint {
  date: string;
  value: number;
}

export function computeKpis(data: BrandData, thresholds: Thresholds, now = new Date()): KpiNumbers {
  const sevenDaysAgo = now.getTime() - 7 * DAY_MS;
  const thirtyDaysAgo = now.getTime() - 30 * DAY_MS;
  const ninetyDaysAgo = now.getTime() - 90 * DAY_MS;

  const sentEmail = data.campaigns.campaigns.filter((c) => c.channel === 'email');
  const sentSms = data.campaigns.campaigns.filter((c) => c.channel === 'sms');

  const emailCampaigns7d = sentEmail.filter((c) => sendTime(c.send_time) >= sevenDaysAgo).length;
  const smsCampaigns7d = sentSms.filter((c) => sendTime(c.send_time) >= sevenDaysAgo).length;

  const emailSpark = bucketDailyCount(sentEmail.map((c) => c.send_time), ninetyDaysAgo, now.getTime());
  const smsSpark = bucketDailyCount(sentSms.map((c) => c.send_time), ninetyDaysAgo, now.getTime());

  // Weighted email click rate (30d): sum(clicks) / sum(delivered).
  const email30d = sentEmail.filter((c) => sendTime(c.send_time) >= thirtyDaysAgo);
  const clicks30 = sumNullable(email30d.map((c) => c.stats.clicks_unique));
  const delivered30 = sumNullable(email30d.map((c) => c.stats.delivered ?? c.stats.recipients ?? 0));
  const weightedClickRate30d = delivered30 > 0 ? clicks30 / delivered30 : null;

  const email90d = sentEmail;
  const clicks90 = sumNullable(email90d.map((c) => c.stats.clicks_unique));
  const delivered90 = sumNullable(email90d.map((c) => c.stats.delivered ?? c.stats.recipients ?? 0));
  const weightedClickRate90dBaseline = delivered90 > 0 ? clicks90 / delivered90 : null;

  const totals = data.deliverability.totals;
  const bounceStatus = status(totals.bounce_rate, thresholds.bounceRate);
  const unsubStatus = status(totals.unsub_rate, thresholds.unsubRate);
  const spamStatus = status(totals.spam_complaint_rate, thresholds.spamRate);

  return {
    emailCampaigns7d,
    smsCampaigns7d,
    emailCampaignsSparkline90d: emailSpark,
    smsCampaignsSparkline90d: smsSpark,
    weightedClickRate30d,
    weightedClickRate90dBaseline,
    bounceRate30d: totals.bounce_rate,
    unsubRate30d: totals.unsub_rate,
    spamRate30d: totals.spam_complaint_rate,
    netListGrowth30d: totals.list_growth_net,
    listGrowthSubscribed30d: totals.list_growth_subscribed,
    listGrowthUnsubscribed30d: totals.list_growth_unsubscribed,
    bounceStatus,
    unsubStatus,
    spamStatus,
  };
}

function sendTime(iso: string | null): number {
  if (!iso) return 0;
  return new Date(iso).getTime() || 0;
}

function sumNullable(arr: Array<number | null | undefined>): number {
  let s = 0;
  for (const v of arr) {
    if (typeof v === 'number' && Number.isFinite(v)) s += v;
  }
  return s;
}

function bucketDailyCount(timestamps: Array<string | null>, startMs: number, endMs: number): SparkPoint[] {
  const days: SparkPoint[] = [];
  for (let t = startMs; t <= endMs; t += DAY_MS) {
    const d = new Date(t);
    days.push({ date: d.toISOString().slice(0, 10), value: 0 });
  }
  for (const ts of timestamps) {
    if (!ts) continue;
    const t = new Date(ts).getTime();
    if (!Number.isFinite(t) || t < startMs || t > endMs) continue;
    const idx = Math.floor((t - startMs) / DAY_MS);
    if (idx >= 0 && idx < days.length) days[idx]!.value += 1;
  }
  return days;
}

export function aggregateAcrossBrands(values: Array<KpiNumbers>): KpiNumbers {
  if (values.length === 1) return values[0]!;
  const safe = (v: number | null | undefined) => (typeof v === 'number' && Number.isFinite(v) ? v : null);
  const sum = (key: keyof KpiNumbers) => {
    let total = 0;
    let any = false;
    for (const v of values) {
      const n = v[key] as number | null | undefined;
      if (typeof n === 'number' && Number.isFinite(n)) {
        total += n;
        any = true;
      }
    }
    return any ? total : null;
  };
  // Recompute weighted click rate by re-aggregating clicks & delivered from sparklines is not possible;
  // for "Both" view we average weighted by each brand's delivered30 — but that requires keeping the inputs.
  // For simplicity we expose null and let the page render brand-by-brand for click rate.
  return {
    emailCampaigns7d: sum('emailCampaigns7d') ?? 0,
    smsCampaigns7d: sum('smsCampaigns7d') ?? 0,
    emailCampaignsSparkline90d: combineSpark(values.map((v) => v.emailCampaignsSparkline90d)),
    smsCampaignsSparkline90d: combineSpark(values.map((v) => v.smsCampaignsSparkline90d)),
    weightedClickRate30d: null,
    weightedClickRate90dBaseline: null,
    bounceRate30d: avgNullable(values.map((v) => safe(v.bounceRate30d))),
    unsubRate30d: avgNullable(values.map((v) => safe(v.unsubRate30d))),
    spamRate30d: avgNullable(values.map((v) => safe(v.spamRate30d))),
    netListGrowth30d: sum('netListGrowth30d'),
    listGrowthSubscribed30d: sum('listGrowthSubscribed30d'),
    listGrowthUnsubscribed30d: sum('listGrowthUnsubscribed30d'),
    bounceStatus: 'unknown',
    unsubStatus: 'unknown',
    spamStatus: 'unknown',
  };
}

function combineSpark(series: SparkPoint[][]): SparkPoint[] {
  if (series.length === 0) return [];
  const len = series[0]!.length;
  const out: SparkPoint[] = [];
  for (let i = 0; i < len; i++) {
    const date = series[0]![i]!.date;
    let value = 0;
    for (const s of series) value += s[i]?.value ?? 0;
    out.push({ date, value });
  }
  return out;
}

function avgNullable(arr: Array<number | null>): number | null {
  const valid = arr.filter((v): v is number => typeof v === 'number' && Number.isFinite(v));
  if (valid.length === 0) return null;
  return valid.reduce((a, b) => a + b, 0) / valid.length;
}

/** Re-export Brand for convenience. */
export type { Brand };
