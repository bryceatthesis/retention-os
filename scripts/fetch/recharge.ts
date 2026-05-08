/**
 * ReCharge fetch — v1 stub.
 *
 * Per spec: in v1, when keys are missing, write a stub
 *   { schema_version: 1, status: "pending_credentials", checked_at: ISO }
 * to data/<brand>/subscriptions.json so the build proceeds and
 * subscription-health pages can show a "Pending — credentials not yet
 * provisioned" placeholder. v2 will add real subscription data fetch.
 *
 * When keys ARE present, this fetch only writes a "verified" stub —
 * v1 doesn't render any subscription-health pages, but the preflight
 * needs to confirm the key works.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { Brand } from './klaviyo';
import type { SourceHealth } from '../preflight';

const SCHEMA = 1 as const;

export interface RechargeStub {
  schema_version: typeof SCHEMA;
  brand: Brand;
  status: 'verified' | 'pending_credentials' | 'failed';
  checked_at: string;
  notes: string;
  org_id: string | null;
  account_name: string | null;
}

export async function writeRechargeStub(args: {
  brand: Brand;
  outDir: string;
  health: SourceHealth;
}): Promise<RechargeStub> {
  await mkdir(args.outDir, { recursive: true });

  let status: RechargeStub['status'];
  let notes: string;
  switch (args.health.status) {
    case 'verified':
      status = 'verified';
      notes = 'ReCharge credential verified. v1 does not render subscription-health pages — see knowledge/data-sources.md.';
      break;
    case 'failed':
      status = 'failed';
      notes = `ReCharge preflight failed: ${args.health.error}`;
      break;
    case 'pending':
    default:
      status = 'pending_credentials';
      notes = 'ReCharge credentials not yet provisioned. Subscription-health pages will render a placeholder until creds land.';
      break;
  }

  const stub: RechargeStub = {
    schema_version: SCHEMA,
    brand: args.brand,
    status,
    checked_at: new Date().toISOString(),
    notes,
    org_id: args.health.org_id,
    account_name: args.health.account_name,
  };

  await writeFile(resolve(args.outDir, 'subscriptions.json'), `${JSON.stringify(stub, null, 2)}\n`, 'utf8');
  return stub;
}
