/**
 * JSON loaders for the Astro build.
 *
 * The build runs at compile time, so these read the JSON synchronously
 * from disk. If a file is missing or schema_version drifts, throw — we
 * want a build failure, not a silent placeholder.
 */

import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { PreflightMeta } from '../../scripts/preflight';
import type {
  CampaignSnapshot,
  FlowSnapshot,
  ListSnapshot,
  SegmentSnapshot,
  DeliverabilitySnapshot,
} from '../../scripts/fetch/klaviyo';
import type { RechargeStub } from '../../scripts/fetch/recharge';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..');
const DATA_DIR = resolve(REPO_ROOT, 'data');

const EXPECTED_SCHEMA = 1;

export type Brand = 'thesis' | 'stasis';
export const BRANDS: Brand[] = ['thesis', 'stasis'];

function readJson<T>(path: string): T {
  if (!existsSync(path)) {
    throw new Error(`[lcc] missing data file: ${path}. Run scripts/build-data.ts or commit a fixture.`);
  }
  const raw = readFileSync(path, 'utf8');
  const parsed = JSON.parse(raw) as T & { schema_version?: number };
  if (parsed.schema_version !== EXPECTED_SCHEMA) {
    throw new Error(
      `[lcc] schema mismatch in ${path}: expected ${EXPECTED_SCHEMA}, got ${parsed.schema_version}. Bump src/lib/data.ts or regenerate.`,
    );
  }
  return parsed;
}

export function loadMeta(): PreflightMeta {
  return readJson<PreflightMeta>(resolve(DATA_DIR, '_meta.json'));
}

export function loadCampaigns(brand: Brand): CampaignSnapshot {
  return readJson<CampaignSnapshot>(resolve(DATA_DIR, brand, 'campaigns.json'));
}

export function loadFlows(brand: Brand): FlowSnapshot {
  return readJson<FlowSnapshot>(resolve(DATA_DIR, brand, 'flows.json'));
}

export function loadLists(brand: Brand): ListSnapshot {
  return readJson<ListSnapshot>(resolve(DATA_DIR, brand, 'lists.json'));
}

export function loadSegments(brand: Brand): SegmentSnapshot {
  return readJson<SegmentSnapshot>(resolve(DATA_DIR, brand, 'segments.json'));
}

export function loadDeliverability(brand: Brand): DeliverabilitySnapshot {
  return readJson<DeliverabilitySnapshot>(resolve(DATA_DIR, brand, 'deliverability.json'));
}

export function loadRecharge(brand: Brand): RechargeStub | null {
  const path = resolve(DATA_DIR, brand, 'subscriptions.json');
  if (!existsSync(path)) return null;
  return readJson<RechargeStub>(path);
}

export interface BrandData {
  brand: Brand;
  campaigns: CampaignSnapshot;
  flows: FlowSnapshot;
  lists: ListSnapshot;
  segments: SegmentSnapshot;
  deliverability: DeliverabilitySnapshot;
  recharge: RechargeStub | null;
}

export function loadBrand(brand: Brand): BrandData {
  return {
    brand,
    campaigns: loadCampaigns(brand),
    flows: loadFlows(brand),
    lists: loadLists(brand),
    segments: loadSegments(brand),
    deliverability: loadDeliverability(brand),
    recharge: loadRecharge(brand),
  };
}

export function loadAllBrands(): Record<Brand, BrandData> {
  return {
    thesis: loadBrand('thesis'),
    stasis: loadBrand('stasis'),
  };
}
