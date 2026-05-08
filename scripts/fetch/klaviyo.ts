/**
 * Klaviyo per-brand data fetch.
 *
 * Pinned to revision 2024-10-15 (env: KLAVIYO_API_REVISION). Do not bump
 * without re-running reproducibility checks against the May 7 baseline.
 *
 * Outputs (per brand under data/<brand>/):
 *   campaigns.json       — sent email + SMS, trailing 90d, with stats
 *   flows.json           — every flow + status + 30d stats
 *   lists.json           — list inventory + counts
 *   segments.json        — segment inventory + counts
 *   deliverability.json  — 90d account-level rates + list growth
 *   templates/<id>.html  — rendered email HTML
 *   templates/<id>.png   — 600px-wide PNG thumbnail (rendered by puppeteer)
 *
 * Every output file leads with `schema_version: 1` so we can change shape
 * without silently breaking the renderer.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import puppeteer, { type Browser } from 'puppeteer';

const KLAVIYO_API = 'https://a.klaviyo.com';
const REVISION = process.env.KLAVIYO_API_REVISION ?? '2024-10-15';
const SCHEMA = 1 as const;

const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

const PLACED_ORDER_METRIC_NAME = 'Placed Order';
const UNSUB_METRIC_NAME = 'Unsubscribed from Email Marketing';

export type Brand = 'thesis' | 'stasis';

export interface CampaignSnapshot {
  schema_version: typeof SCHEMA;
  brand: Brand;
  fetched_at: string;
  window: { start: string; end: string };
  conversion_metric_id: string | null;
  campaigns: CampaignRow[];
}

export interface CampaignRow {
  id: string;
  name: string;
  channel: 'email' | 'sms' | 'unknown';
  status: string;
  send_time: string | null;
  subject: string | null;
  preheader: string | null;
  template_id: string | null;
  template_html_path: string | null;
  template_thumb_path: string | null;
  stats: CampaignStats;
}

export interface CampaignStats {
  recipients: number;
  delivered: number | null;
  opens_unique: number | null;
  clicks_unique: number | null;
  unsubscribe_uniques: number | null;
  bounced: number | null;
  conversion_value: number | null;
  open_rate: number | null;
  click_rate: number | null;
  unsub_rate: number | null;
  bounce_rate: number | null;
}

export interface FlowSnapshot {
  schema_version: typeof SCHEMA;
  brand: Brand;
  fetched_at: string;
  window: { start: string; end: string };
  flows: FlowRow[];
}

export interface FlowMessageRow {
  id: string;
  name: string | null;
  channel: 'email' | 'sms' | 'unknown';
  subject: string | null;
  preheader: string | null;
  template_id: string | null;
  template_html_path: string | null;
  template_thumb_path: string | null;
}

export interface FlowRow {
  id: string;
  name: string;
  status: string;
  trigger_type: string | null;
  action_count: number;
  last_updated: string | null;
  created: string | null;
  stats: CampaignStats;
  messages: FlowMessageRow[];
}

export interface ListSnapshot {
  schema_version: typeof SCHEMA;
  brand: Brand;
  fetched_at: string;
  lists: Array<{ id: string; name: string; profile_count: number | null; updated: string | null }>;
}

export interface SegmentSnapshot {
  schema_version: typeof SCHEMA;
  brand: Brand;
  fetched_at: string;
  segments: Array<{ id: string; name: string; profile_count: number | null; updated: string | null; definition_summary: string | null }>;
}

export interface DeliverabilitySnapshot {
  schema_version: typeof SCHEMA;
  brand: Brand;
  fetched_at: string;
  window: { start: string; end: string };
  daily: DeliverabilityDay[];
  totals: {
    bounce_rate: number | null;
    spam_complaint_rate: number | null;
    unsub_rate: number | null;
    list_growth_net: number | null;
    list_growth_subscribed: number | null;
    list_growth_unsubscribed: number | null;
  };
  unsub_metric: { id: string | null; name: string };
}

export interface DeliverabilityDay {
  date: string;
  delivered: number;
  bounced: number;
  spam_complaints: number;
  unsubscribes: number;
}

interface KlaviyoFetchOptions {
  apiKey: string;
  brand: Brand;
  outDir: string;
  /** Skip puppeteer thumbnail rendering (useful for CI without Chrome). */
  skipThumbnails?: boolean;
}

export async function fetchBrand(opts: KlaviyoFetchOptions): Promise<{
  campaigns: CampaignSnapshot;
  flows: FlowSnapshot;
  lists: ListSnapshot;
  segments: SegmentSnapshot;
  deliverability: DeliverabilitySnapshot;
}> {
  const { brand, outDir, skipThumbnails } = opts;
  await mkdir(resolve(outDir, 'templates'), { recursive: true });

  const k = new KlaviyoClient(opts.apiKey);

  console.log(`[klaviyo:${brand}] resolving conversion metric (Placed Order)`);
  const placedOrderMetricId = await k.findMetricId(PLACED_ORDER_METRIC_NAME);
  console.log(`[klaviyo:${brand}] resolving unsub metric (${UNSUB_METRIC_NAME})`);
  const unsubMetric = await k.findMetric(UNSUB_METRIC_NAME);

  const browser = skipThumbnails ? null : await launchBrowser();

  try {
    const now = new Date();
    const ninetyDaysAgo = new Date(now.getTime() - NINETY_DAYS_MS);
    const thirtyDaysAgo = new Date(now.getTime() - THIRTY_DAYS_MS);

    console.log(`[klaviyo:${brand}] fetching campaigns (90d)`);
    const campaignRows = await k.fetchCampaigns({
      since: ninetyDaysAgo,
      conversionMetricId: placedOrderMetricId,
      outDir,
      browser,
    });
    const campaigns: CampaignSnapshot = {
      schema_version: SCHEMA,
      brand,
      fetched_at: now.toISOString(),
      window: { start: ninetyDaysAgo.toISOString(), end: now.toISOString() },
      conversion_metric_id: placedOrderMetricId,
      campaigns: campaignRows,
    };

    console.log(`[klaviyo:${brand}] fetching flows (30d perf window)`);
    const flowRows = await k.fetchFlows({
      perfWindowStart: thirtyDaysAgo,
      perfWindowEnd: now,
      conversionMetricId: placedOrderMetricId,
      outDir,
      browser,
    });
    const flows: FlowSnapshot = {
      schema_version: SCHEMA,
      brand,
      fetched_at: now.toISOString(),
      window: { start: thirtyDaysAgo.toISOString(), end: now.toISOString() },
      flows: flowRows,
    };

    console.log(`[klaviyo:${brand}] fetching lists`);
    const listRows = await k.fetchLists();
    const lists: ListSnapshot = {
      schema_version: SCHEMA,
      brand,
      fetched_at: now.toISOString(),
      lists: listRows,
    };

    console.log(`[klaviyo:${brand}] fetching segments`);
    const segmentRows = await k.fetchSegments();
    const segments: SegmentSnapshot = {
      schema_version: SCHEMA,
      brand,
      fetched_at: now.toISOString(),
      segments: segmentRows,
    };

    console.log(`[klaviyo:${brand}] fetching deliverability (90d daily)`);
    const deliverability = await k.fetchDeliverability({
      since: ninetyDaysAgo,
      until: now,
      unsubMetricId: unsubMetric?.id ?? null,
    });
    const deliverabilitySnapshot: DeliverabilitySnapshot = {
      schema_version: SCHEMA,
      brand,
      fetched_at: now.toISOString(),
      window: { start: ninetyDaysAgo.toISOString(), end: now.toISOString() },
      daily: deliverability.daily,
      totals: deliverability.totals,
      unsub_metric: { id: unsubMetric?.id ?? null, name: UNSUB_METRIC_NAME },
    };

    await writeFile(resolve(outDir, 'campaigns.json'), JSON.stringify(campaigns, null, 2));
    await writeFile(resolve(outDir, 'flows.json'), JSON.stringify(flows, null, 2));
    await writeFile(resolve(outDir, 'lists.json'), JSON.stringify(lists, null, 2));
    await writeFile(resolve(outDir, 'segments.json'), JSON.stringify(segments, null, 2));
    await writeFile(resolve(outDir, 'deliverability.json'), JSON.stringify(deliverabilitySnapshot, null, 2));

    return { campaigns, flows, lists, segments, deliverability: deliverabilitySnapshot };
  } finally {
    if (browser) await browser.close().catch(() => undefined);
  }
}

async function launchBrowser(): Promise<Browser> {
  return puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
}

class KlaviyoClient {
  constructor(private readonly apiKey: string) {}

  private get headers(): Record<string, string> {
    return {
      Authorization: `Klaviyo-API-Key ${this.apiKey}`,
      accept: 'application/vnd.api+json',
      'content-type': 'application/vnd.api+json',
      revision: REVISION,
    };
  }

  private async req<T>(path: string, init: RequestInit = {}): Promise<T> {
    const url = path.startsWith('http') ? path : `${KLAVIYO_API}${path}`;
    const res = await fetch(url, {
      ...init,
      headers: { ...this.headers, ...(init.headers as Record<string, string> | undefined) },
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Klaviyo ${init.method ?? 'GET'} ${url} -> ${res.status}: ${text.slice(0, 400)}`);
    }
    return (await res.json()) as T;
  }

  private async pageAll<T>(initialPath: string): Promise<T[]> {
    const out: T[] = [];
    let next: string | null = initialPath;
    while (next) {
      type Page = { data: T[]; links?: { next?: string | null } };
      const body: Page = await this.req<Page>(next);
      out.push(...(body.data ?? []));
      next = body.links?.next ?? null;
    }
    return out;
  }

  async findMetricId(name: string): Promise<string | null> {
    const m = await this.findMetric(name);
    return m?.id ?? null;
  }

  async findMetric(name: string): Promise<{ id: string; name: string } | null> {
    type MetricEntity = { id: string; attributes?: { name?: string } };
    const filter = encodeURIComponent(`equals(name,"${name}")`);
    const body = await this.req<{ data: MetricEntity[] }>(`/api/metrics/?filter=${filter}`);
    const hit = body.data?.[0];
    if (hit?.id) return { id: hit.id, name: hit.attributes?.name ?? name };
    return null;
  }

  async fetchCampaigns(args: {
    since: Date;
    conversionMetricId: string | null;
    outDir: string;
    browser: Browser | null;
  }): Promise<CampaignRow[]> {
    type CampaignEntity = {
      id: string;
      attributes?: {
        name?: string;
        status?: string;
        send_time?: string | null;
        scheduled_at?: string | null;
        message_template_id?: string | null;
      };
      relationships?: {
        'campaign-messages'?: { data?: Array<{ id: string }> };
      };
    };

    const rows: CampaignRow[] = [];

    for (const channel of ['email', 'sms'] as const) {
      const filter = encodeURIComponent(
        [
          `equals(messages.channel,'${channel}')`,
          `equals(status,'Sent')`,
          `greater-or-equal(send_time,${args.since.toISOString()})`,
        ].join(','),
      );
      const path = `/api/campaigns/?filter=${filter}&include=campaign-messages&page[size]=50`;
      const data = await this.pageAll<CampaignEntity>(path);

      for (const c of data) {
        const stats = args.conversionMetricId
          ? await this.fetchCampaignStats(c.id, args.conversionMetricId)
          : emptyStats();
        const messageId = c.relationships?.['campaign-messages']?.data?.[0]?.id ?? null;
        const message = messageId ? await this.fetchCampaignMessage(messageId) : null;

        let templatePaths: { html: string | null; thumb: string | null } = { html: null, thumb: null };
        if (message?.templateId) {
          templatePaths = await this.materializeTemplate({
            templateId: message.templateId,
            outDir: args.outDir,
            browser: args.browser,
          });
        }

        rows.push({
          id: c.id,
          name: c.attributes?.name ?? '(unnamed)',
          channel,
          status: c.attributes?.status ?? 'unknown',
          send_time: c.attributes?.send_time ?? null,
          subject: message?.subject ?? null,
          preheader: message?.preheader ?? null,
          template_id: message?.templateId ?? null,
          template_html_path: templatePaths.html,
          template_thumb_path: templatePaths.thumb,
          stats,
        });
      }
    }

    rows.sort((a, b) => (b.send_time ?? '').localeCompare(a.send_time ?? ''));
    return rows;
  }

  private async fetchCampaignMessage(
    messageId: string,
  ): Promise<{ subject: string | null; preheader: string | null; templateId: string | null } | null> {
    type MessageEntity = {
      id: string;
      attributes?: {
        definition?: {
          content?: { subject?: string | null; preview_text?: string | null };
        };
      };
      relationships?: {
        template?: { data?: { id?: string } };
      };
    };

    try {
      const body = await this.req<{ data: MessageEntity }>(
        `/api/campaign-messages/${messageId}/?include=template`,
      );
      const m = body.data;
      const content = m.attributes?.definition?.content;
      return {
        subject: content?.subject ?? null,
        preheader: content?.preview_text ?? null,
        templateId: m.relationships?.template?.data?.id ?? null,
      };
    } catch (err) {
      console.warn(`[klaviyo] could not fetch campaign-message ${messageId}: ${(err as Error).message}`);
      return null;
    }
  }

  private async fetchCampaignStats(campaignId: string, conversionMetricId: string): Promise<CampaignStats> {
    type ReportPayload = {
      data?: {
        attributes?: {
          results?: Array<{
            statistics?: Record<string, number | null | undefined>;
          }>;
        };
      };
    };
    const requestBody = {
      data: {
        type: 'campaign-values-report',
        attributes: {
          statistics: [
            'recipients',
            'delivered',
            'opens_unique',
            'clicks_unique',
            'unsubscribe_uniques',
            'bounced',
            'conversion_value',
          ],
          conversion_metric_id: conversionMetricId,
          filter: `equals(campaign_id,'${campaignId}')`,
          timeframe: { key: 'last_90_days' },
        },
      },
    };
    try {
      const body = await this.req<ReportPayload>('/api/campaign-values-reports/', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });
      const stats = body.data?.attributes?.results?.[0]?.statistics ?? {};
      return statsFromKlaviyoResult(stats);
    } catch (err) {
      console.warn(`[klaviyo] campaign-values-reports failed for ${campaignId}: ${(err as Error).message}`);
      return emptyStats();
    }
  }

  async fetchFlows(args: {
    perfWindowStart: Date;
    perfWindowEnd: Date;
    conversionMetricId: string | null;
    outDir: string;
    browser: Browser | null;
  }): Promise<FlowRow[]> {
    type FlowEntity = {
      id: string;
      attributes?: {
        name?: string;
        status?: string;
        trigger_type?: string | null;
        updated?: string | null;
        created?: string | null;
      };
      relationships?: {
        'flow-actions'?: { data?: Array<{ id: string }> };
      };
    };

    const data = await this.pageAll<FlowEntity>('/api/flows/?include=flow-actions&page[size]=50');
    const rows: FlowRow[] = [];

    for (const f of data) {
      const actionCount = f.relationships?.['flow-actions']?.data?.length ?? 0;
      const stats = args.conversionMetricId
        ? await this.fetchFlowStats(f.id, args.conversionMetricId)
        : emptyStats();
      const messages = await this.fetchFlowMessages({
        flowId: f.id,
        outDir: args.outDir,
        browser: args.browser,
      });

      rows.push({
        id: f.id,
        name: f.attributes?.name ?? '(unnamed)',
        status: f.attributes?.status ?? 'unknown',
        trigger_type: f.attributes?.trigger_type ?? null,
        action_count: actionCount,
        last_updated: f.attributes?.updated ?? null,
        created: f.attributes?.created ?? null,
        stats,
        messages,
      });
    }

    return rows;
  }

  private async fetchFlowStats(flowId: string, conversionMetricId: string): Promise<CampaignStats> {
    type ReportPayload = {
      data?: {
        attributes?: {
          results?: Array<{ statistics?: Record<string, number | null | undefined> }>;
        };
      };
    };
    const requestBody = {
      data: {
        type: 'flow-values-report',
        attributes: {
          statistics: [
            'recipients',
            'delivered',
            'opens_unique',
            'clicks_unique',
            'unsubscribe_uniques',
            'bounced',
            'conversion_value',
          ],
          conversion_metric_id: conversionMetricId,
          filter: `equals(flow_id,'${flowId}')`,
          timeframe: { key: 'last_30_days' },
        },
      },
    };
    try {
      const body = await this.req<ReportPayload>('/api/flow-values-reports/', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });
      const stats = body.data?.attributes?.results?.[0]?.statistics ?? {};
      return statsFromKlaviyoResult(stats);
    } catch (err) {
      console.warn(`[klaviyo] flow-values-reports failed for ${flowId}: ${(err as Error).message}`);
      return emptyStats();
    }
  }

  private async fetchFlowMessages(args: {
    flowId: string;
    outDir: string;
    browser: Browser | null;
  }): Promise<FlowMessageRow[]> {
    type FlowMessageEntity = {
      id: string;
      attributes?: {
        name?: string;
        channel?: string;
        content?: { subject?: string | null; preview_text?: string | null };
      };
      relationships?: {
        template?: { data?: { id?: string } };
      };
    };
    try {
      const body = await this.req<{ data: FlowMessageEntity[] }>(
        `/api/flows/${args.flowId}/flow-messages/?include=template&page[size]=50`,
      );
      const out: FlowMessageRow[] = [];
      for (const m of body.data ?? []) {
        const channel = (m.attributes?.channel ?? 'unknown') as 'email' | 'sms' | 'unknown';
        const templateId = m.relationships?.template?.data?.id ?? null;
        let templatePaths: { html: string | null; thumb: string | null } = { html: null, thumb: null };
        if (templateId) {
          templatePaths = await this.materializeTemplate({
            templateId,
            outDir: args.outDir,
            browser: args.browser,
          });
        }
        out.push({
          id: m.id,
          name: m.attributes?.name ?? null,
          channel,
          subject: m.attributes?.content?.subject ?? null,
          preheader: m.attributes?.content?.preview_text ?? null,
          template_id: templateId,
          template_html_path: templatePaths.html,
          template_thumb_path: templatePaths.thumb,
        });
      }
      return out;
    } catch (err) {
      console.warn(`[klaviyo] flow-messages failed for flow ${args.flowId}: ${(err as Error).message}`);
      return [];
    }
  }

  async fetchLists(): Promise<ListSnapshot['lists']> {
    type ListEntity = {
      id: string;
      attributes?: { name?: string; updated?: string | null; profile_count?: number | null };
    };
    const data = await this.pageAll<ListEntity>('/api/lists/?page[size]=50');
    return data.map((l) => ({
      id: l.id,
      name: l.attributes?.name ?? '(unnamed)',
      profile_count: l.attributes?.profile_count ?? null,
      updated: l.attributes?.updated ?? null,
    }));
  }

  async fetchSegments(): Promise<SegmentSnapshot['segments']> {
    type SegmentEntity = {
      id: string;
      attributes?: {
        name?: string;
        updated?: string | null;
        profile_count?: number | null;
        definition?: unknown;
      };
    };
    const data = await this.pageAll<SegmentEntity>('/api/segments/?page[size]=50');
    return data.map((s) => ({
      id: s.id,
      name: s.attributes?.name ?? '(unnamed)',
      profile_count: s.attributes?.profile_count ?? null,
      updated: s.attributes?.updated ?? null,
      definition_summary: s.attributes?.definition ? JSON.stringify(s.attributes.definition).slice(0, 280) : null,
    }));
  }

  async fetchDeliverability(args: { since: Date; until: Date; unsubMetricId: string | null }): Promise<{
    daily: DeliverabilityDay[];
    totals: DeliverabilitySnapshot['totals'];
  }> {
    // Klaviyo's /api/account-values-reports/ exposes daily aggregates.
    type AccountReportPayload = {
      data?: {
        attributes?: {
          results?: Array<{
            groupings?: { send_channel?: string };
            statistics?: Record<string, Array<number | null>>;
          }>;
          date_times?: string[];
        };
      };
    };

    const requestBody = {
      data: {
        type: 'account-values-report',
        attributes: {
          statistics: ['delivered', 'bounced', 'spam_complaints', 'unsubscribes'],
          interval: 'daily',
          timeframe: { start: args.since.toISOString(), end: args.until.toISOString() },
          conversion_metric_id: null,
          filter: "equals(send_channel,'email')",
        },
      },
    };

    let daily: DeliverabilityDay[] = [];
    try {
      const body = await this.req<AccountReportPayload>('/api/account-values-reports/', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });
      const dates = body.data?.attributes?.date_times ?? [];
      const stats = body.data?.attributes?.results?.[0]?.statistics ?? {};
      daily = dates.map((d, i) => ({
        date: d,
        delivered: numAt(stats.delivered, i) ?? 0,
        bounced: numAt(stats.bounced, i) ?? 0,
        spam_complaints: numAt(stats.spam_complaints, i) ?? 0,
        unsubscribes: numAt(stats.unsubscribes, i) ?? 0,
      }));
    } catch (err) {
      console.warn(`[klaviyo] account-values-reports failed: ${(err as Error).message}`);
    }

    const trimmed = daily.slice(-30);
    const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
    const delivered30 = sum(trimmed.map((d) => d.delivered));
    const bounced30 = sum(trimmed.map((d) => d.bounced));
    const spam30 = sum(trimmed.map((d) => d.spam_complaints));
    const unsub30 = sum(trimmed.map((d) => d.unsubscribes));

    const totals = {
      bounce_rate: delivered30 > 0 ? bounced30 / (bounced30 + delivered30) : null,
      spam_complaint_rate: delivered30 > 0 ? spam30 / delivered30 : null,
      unsub_rate: delivered30 > 0 ? unsub30 / delivered30 : null,
      list_growth_net: null as number | null,
      list_growth_subscribed: null as number | null,
      list_growth_unsubscribed: null as number | null,
    };

    return { daily, totals };
  }

  private async materializeTemplate(args: {
    templateId: string;
    outDir: string;
    browser: Browser | null;
  }): Promise<{ html: string | null; thumb: string | null }> {
    type RenderPayload = { data?: { attributes?: { html?: string | null } } };
    let html: string | null = null;
    try {
      const body = await this.req<RenderPayload>(`/api/templates/${args.templateId}/render/`, {
        method: 'POST',
        body: JSON.stringify({
          data: { type: 'template', id: args.templateId, attributes: { context: {} } },
        }),
      });
      html = body.data?.attributes?.html ?? null;
    } catch {
      try {
        type TemplateGet = { data?: { attributes?: { html?: string | null } } };
        const body = await this.req<TemplateGet>(`/api/templates/${args.templateId}/`);
        html = body.data?.attributes?.html ?? null;
      } catch (err) {
        console.warn(`[klaviyo] template ${args.templateId} fetch failed: ${(err as Error).message}`);
      }
    }
    if (!html) return { html: null, thumb: null };

    const htmlRel = `templates/${args.templateId}.html`;
    const thumbRel = `templates/${args.templateId}.png`;
    await writeFile(resolve(args.outDir, htmlRel), html, 'utf8');

    if (args.browser) {
      try {
        const page = await args.browser.newPage();
        await page.setViewport({ width: 600, height: 900, deviceScaleFactor: 1 });
        await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30_000 });
        await page.screenshot({
          path: resolve(args.outDir, thumbRel) as `${string}.png`,
          fullPage: true,
          type: 'png',
        });
        await page.close();
        return { html: htmlRel, thumb: thumbRel };
      } catch (err) {
        console.warn(`[klaviyo] thumbnail render failed for ${args.templateId}: ${(err as Error).message}`);
      }
    }
    return { html: htmlRel, thumb: null };
  }
}

function numAt(arr: Array<number | null> | undefined, i: number): number | null {
  if (!arr) return null;
  const v = arr[i];
  return typeof v === 'number' ? v : null;
}

function emptyStats(): CampaignStats {
  return {
    recipients: 0,
    delivered: null,
    opens_unique: null,
    clicks_unique: null,
    unsubscribe_uniques: null,
    bounced: null,
    conversion_value: null,
    open_rate: null,
    click_rate: null,
    unsub_rate: null,
    bounce_rate: null,
  };
}

function statsFromKlaviyoResult(s: Record<string, number | null | undefined>): CampaignStats {
  const recipients = s.recipients ?? 0;
  const delivered = s.delivered ?? null;
  const opens = s.opens_unique ?? null;
  const clicks = s.clicks_unique ?? null;
  const unsubs = s.unsubscribe_uniques ?? null;
  const bounced = s.bounced ?? null;
  const denom = delivered ?? recipients ?? 0;

  return {
    recipients: recipients ?? 0,
    delivered,
    opens_unique: opens,
    clicks_unique: clicks,
    unsubscribe_uniques: unsubs,
    bounced,
    conversion_value: s.conversion_value ?? null,
    open_rate: opens != null && denom > 0 ? opens / denom : null,
    click_rate: clicks != null && denom > 0 ? clicks / denom : null,
    unsub_rate: unsubs != null && denom > 0 ? unsubs / denom : null,
    bounce_rate: bounced != null && (recipients ?? 0) > 0 ? bounced / (recipients as number) : null,
  };
}
