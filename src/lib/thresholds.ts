/**
 * Thresholds and benchmarks rendered on KPI tiles.
 *
 * Source: knowledge/metrics-definitions.md (parsed at build time when those
 * tables fill in). Until that file is fully populated, these defaults match
 * the spec body of prompts/lifecycle-command-center.md and what we cited in
 * the Theo audit (0.4% bounce, 0.2% unsub, 1.7% click benchmark).
 *
 * If you change these, also update knowledge/metrics-definitions.md so the
 * dashboard and the playbook agree.
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..');

export interface Thresholds {
  bounceRate: { healthy: number; warn: number; bad: number };
  unsubRate: { healthy: number; warn: number; bad: number };
  spamRate: { healthy: number; warn: number; bad: number };
  clickRate: { benchmark: number };
}

const DEFAULTS: Thresholds = {
  bounceRate: { healthy: 0.002, warn: 0.004, bad: 0.006 },
  unsubRate: { healthy: 0.0015, warn: 0.002, bad: 0.004 },
  spamRate: { healthy: 0.0005, warn: 0.001, bad: 0.002 },
  // Klaviyo's published email click-rate benchmark for ecom — used as the
  // reference line on KPI tile #3.
  clickRate: { benchmark: 0.017 },
};

let cached: Thresholds | null = null;

export function loadThresholds(): Thresholds {
  if (cached) return cached;
  const path = resolve(REPO_ROOT, 'knowledge', 'metrics-definitions.md');
  if (!existsSync(path)) {
    cached = DEFAULTS;
    return cached;
  }
  const md = readFileSync(path, 'utf8');
  const result: Thresholds = structuredClone(DEFAULTS);

  const bounce = matchPercent(md, /bounce[^|\n]*?(?:rate|threshold)[^|\n]*?(\d+(?:\.\d+)?)\s*%/i);
  if (bounce != null) result.bounceRate.warn = bounce;
  const unsub = matchPercent(md, /unsub[^|\n]*?(?:rate|target|threshold)[^|\n]*?(\d+(?:\.\d+)?)\s*%/i);
  if (unsub != null) result.unsubRate.warn = unsub;
  const click = matchPercent(md, /click[^|\n]*?(?:benchmark|reference)[^|\n]*?(\d+(?:\.\d+)?)\s*%/i);
  if (click != null) result.clickRate.benchmark = click;

  cached = result;
  return cached;
}

function matchPercent(s: string, re: RegExp): number | null {
  const m = s.match(re);
  if (!m) return null;
  const v = Number.parseFloat(m[1]!);
  if (!Number.isFinite(v)) return null;
  return v / 100;
}

export function status(metric: number | null, threshold: { healthy: number; warn: number; bad: number }): 'healthy' | 'warn' | 'bad' | 'unknown' {
  if (metric == null) return 'unknown';
  if (metric >= threshold.bad) return 'bad';
  if (metric >= threshold.warn) return 'warn';
  return 'healthy';
}
