/**
 * Credential preflight — runs before every data fetch.
 *
 * The Theo Klaviyo audit failure (May 2026) was caused by misconfigured
 * brand keys: one key silently pointed at the wrong org, so "Stasis"
 * numbers were actually "Thesis" numbers. This preflight makes that
 * specific failure mode loud and unmissable.
 *
 * Failure modes (any one aborts the build):
 *   1. A required key is missing from the environment.
 *   2. A key 401s on GET /api/accounts/ (missing accounts:read scope).
 *   3. Both Klaviyo keys resolve to the SAME org_id — brand partitioning
 *      is impossible and downstream data would be silently mislabeled.
 *
 * Preflight writes data/_meta.json so the rendered site can show a per-
 * source health badge in <RefreshHeader />.
 */

import 'dotenv/config';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const DATA_DIR = resolve(REPO_ROOT, 'data');
const META_PATH = resolve(DATA_DIR, '_meta.json');

const KLAVIYO_API = 'https://a.klaviyo.com';
const KLAVIYO_REVISION = process.env.KLAVIYO_API_REVISION ?? '2024-10-15';
const RECHARGE_API = 'https://api.rechargeapps.com';

export type SourceStatus = 'verified' | 'pending' | 'failed';

export interface SourceHealth {
  status: SourceStatus;
  org_id: string | null;
  account_name: string | null;
  error: string | null;
  checked_at: string;
}

export interface PreflightMeta {
  schema_version: 1;
  verified_at: string;
  klaviyo_revision: string;
  thesis: SourceHealth;
  stasis: SourceHealth;
  recharge_thesis: SourceHealth;
  recharge_stasis: SourceHealth;
  errors: string[];
}

function nowIso(): string {
  return new Date().toISOString();
}

function pendingHealth(reason: string): SourceHealth {
  return {
    status: 'pending',
    org_id: null,
    account_name: null,
    error: reason,
    checked_at: nowIso(),
  };
}

function failedHealth(reason: string): SourceHealth {
  return {
    status: 'failed',
    org_id: null,
    account_name: null,
    error: reason,
    checked_at: nowIso(),
  };
}

async function checkKlaviyoKey(label: string, key: string | undefined): Promise<SourceHealth> {
  if (!key || key.trim() === '') {
    return failedHealth(`Missing required env var KLAVIYO_API_KEY_${label.toUpperCase()}.`);
  }

  let res: Response;
  try {
    res = await fetch(`${KLAVIYO_API}/api/accounts/`, {
      headers: {
        Authorization: `Klaviyo-API-Key ${key}`,
        accept: 'application/vnd.api+json',
        revision: KLAVIYO_REVISION,
      },
    });
  } catch (err) {
    return failedHealth(`Klaviyo /api/accounts/ network error for ${label}: ${(err as Error).message}`);
  }

  if (res.status === 401 || res.status === 403) {
    return failedHealth(
      `Klaviyo key for ${label} returned ${res.status} on /api/accounts/. Likely missing the accounts:read scope or invalid key.`,
    );
  }
  if (!res.ok) {
    return failedHealth(`Klaviyo /api/accounts/ for ${label} returned HTTP ${res.status}.`);
  }

  let body: { data?: Array<{ id?: string; attributes?: { contact_information?: { organization_name?: string } } }> };
  try {
    body = (await res.json()) as typeof body;
  } catch (err) {
    return failedHealth(`Klaviyo /api/accounts/ for ${label} returned non-JSON body: ${(err as Error).message}`);
  }

  const account = body.data?.[0];
  if (!account?.id) {
    return failedHealth(`Klaviyo /api/accounts/ for ${label} returned no account record.`);
  }

  return {
    status: 'verified',
    org_id: account.id,
    account_name: account.attributes?.contact_information?.organization_name ?? null,
    error: null,
    checked_at: nowIso(),
  };
}

async function checkRechargeKey(label: string, key: string | undefined): Promise<SourceHealth> {
  if (!key || key.trim() === '') {
    return pendingHealth(
      `RECHARGE_API_KEY_${label.toUpperCase()} not set. v1 stubs ReCharge until creds land — see knowledge/data-sources.md.`,
    );
  }

  let res: Response;
  try {
    res = await fetch(`${RECHARGE_API}/shop`, {
      headers: {
        'X-Recharge-Access-Token': key,
        accept: 'application/json',
      },
    });
  } catch (err) {
    return failedHealth(`ReCharge /shop network error for ${label}: ${(err as Error).message}`);
  }

  if (res.status === 401 || res.status === 403) {
    return failedHealth(`ReCharge key for ${label} returned ${res.status} on /shop. Invalid or insufficient scope.`);
  }
  if (!res.ok) {
    return failedHealth(`ReCharge /shop for ${label} returned HTTP ${res.status}.`);
  }

  let body: { shop?: { id?: number | string; name?: string; domain?: string } };
  try {
    body = (await res.json()) as typeof body;
  } catch (err) {
    return failedHealth(`ReCharge /shop for ${label} returned non-JSON body: ${(err as Error).message}`);
  }

  return {
    status: 'verified',
    org_id: body.shop?.id != null ? String(body.shop.id) : null,
    account_name: body.shop?.name ?? body.shop?.domain ?? null,
    error: null,
    checked_at: nowIso(),
  };
}

export async function runPreflight(): Promise<PreflightMeta> {
  const [thesis, stasis, rechargeThesis, rechargeStasis] = await Promise.all([
    checkKlaviyoKey('thesis', process.env.KLAVIYO_API_KEY_THESIS),
    checkKlaviyoKey('stasis', process.env.KLAVIYO_API_KEY_STASIS),
    checkRechargeKey('thesis', process.env.RECHARGE_API_KEY_THESIS),
    checkRechargeKey('stasis', process.env.RECHARGE_API_KEY_STASIS),
  ]);

  const errors: string[] = [];
  if (thesis.status === 'failed') errors.push(`thesis: ${thesis.error}`);
  if (stasis.status === 'failed') errors.push(`stasis: ${stasis.error}`);

  if (
    thesis.status === 'verified' &&
    stasis.status === 'verified' &&
    thesis.org_id &&
    thesis.org_id === stasis.org_id
  ) {
    errors.push(
      `KLAVIYO_API_KEY_THESIS and KLAVIYO_API_KEY_STASIS both resolve to org_id=${thesis.org_id}. Brand partitioning is impossible — see knowledge/theo-klaviyo-audits.md.`,
    );
  }

  if (rechargeThesis.status === 'failed') errors.push(`recharge_thesis: ${rechargeThesis.error}`);
  if (rechargeStasis.status === 'failed') errors.push(`recharge_stasis: ${rechargeStasis.error}`);

  const meta: PreflightMeta = {
    schema_version: 1,
    verified_at: nowIso(),
    klaviyo_revision: KLAVIYO_REVISION,
    thesis,
    stasis,
    recharge_thesis: rechargeThesis,
    recharge_stasis: rechargeStasis,
    errors,
  };

  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(META_PATH, `${JSON.stringify(meta, null, 2)}\n`, 'utf8');

  return meta;
}

export function logPreflight(meta: PreflightMeta): void {
  const fmt = (label: string, h: SourceHealth) =>
    `  ${label.padEnd(18)} ${h.status.padEnd(9)} ${h.org_id ?? '—'}  ${h.account_name ?? ''}${h.error ? `  (${h.error})` : ''}`;
  console.log('Preflight results:');
  console.log(fmt('klaviyo:thesis', meta.thesis));
  console.log(fmt('klaviyo:stasis', meta.stasis));
  console.log(fmt('recharge:thesis', meta.recharge_thesis));
  console.log(fmt('recharge:stasis', meta.recharge_stasis));
}

const isMain = (() => {
  try {
    return import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('preflight.ts');
  } catch {
    return false;
  }
})();

if (isMain) {
  runPreflight()
    .then((meta) => {
      logPreflight(meta);
      if (meta.errors.length > 0) {
        console.error('\nPreflight FAILED. Klaviyo errors must be fixed before fetch will run:');
        for (const err of meta.errors) console.error(`  - ${err}`);
        process.exit(1);
      }
      console.log('\nPreflight OK.');
    })
    .catch((err) => {
      console.error('Preflight crashed:', err);
      process.exit(2);
    });
}
