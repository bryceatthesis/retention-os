/**
 * Orchestrator: preflight → fetch → write data/.
 *
 * Run by GitHub Actions on a daily cron (and on demand via workflow_dispatch
 * with fresh_fetch=true). Aborts the workflow on preflight failure so the
 * build can never silently render stale or wrong-brand data.
 *
 * Local dev: `pnpm fetch:data` will run preflight against your local .env,
 * which is fine — but you'll usually want to leave the committed fixtures
 * alone. To rebuild the site without re-fetching, just run `pnpm dev`.
 */

import 'dotenv/config';
import { resolve } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { logPreflight, runPreflight, type PreflightMeta } from './preflight';
import { fetchBrand } from './fetch/klaviyo';
import { writeRechargeStub } from './fetch/recharge';
import type { Brand } from './fetch/klaviyo';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const DATA_DIR = resolve(REPO_ROOT, 'data');

async function main() {
  console.log('[build-data] running preflight...');
  const meta = await runPreflight();
  logPreflight(meta);
  if (meta.errors.length > 0) {
    console.error('\n[build-data] preflight blocked the fetch:');
    for (const e of meta.errors) console.error(`  - ${e}`);
    process.exit(1);
  }

  for (const brand of ['thesis', 'stasis'] as Brand[]) {
    const brandDir = resolve(DATA_DIR, brand);
    const klaviyoKey = brand === 'thesis' ? process.env.KLAVIYO_API_KEY_THESIS : process.env.KLAVIYO_API_KEY_STASIS;
    if (!klaviyoKey) throw new Error(`Missing KLAVIYO_API_KEY for ${brand} — preflight should have caught this.`);

    console.log(`\n[build-data] === ${brand.toUpperCase()} ===`);
    await fetchBrand({
      apiKey: klaviyoKey,
      brand,
      outDir: brandDir,
      skipThumbnails: process.env.LCC_SKIP_THUMBNAILS === 'true',
    });

    const rechargeHealth = brand === 'thesis' ? meta.recharge_thesis : meta.recharge_stasis;
    await writeRechargeStub({ brand, outDir: brandDir, health: rechargeHealth });
  }

  console.log('\n[build-data] OK. Wrote data/ for both brands.');
  printSummary(meta);
}

function printSummary(meta: PreflightMeta) {
  console.log('\nSummary:');
  console.log(`  Klaviyo revision: ${meta.klaviyo_revision}`);
  console.log(`  Thesis org: ${meta.thesis.org_id ?? '—'} (${meta.thesis.account_name ?? 'no name'})`);
  console.log(`  Stasis org: ${meta.stasis.org_id ?? '—'} (${meta.stasis.account_name ?? 'no name'})`);
  console.log(`  ReCharge thesis: ${meta.recharge_thesis.status}`);
  console.log(`  ReCharge stasis: ${meta.recharge_stasis.status}`);
}

main().catch((err) => {
  console.error('[build-data] crashed:', err);
  process.exit(2);
});
