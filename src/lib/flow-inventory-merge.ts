/**
 * Merge knowledge/flow-inventory.md (curated, prose-y) with the live
 * Klaviyo flow data per brand.
 *
 * The API is the spine — it always wins for "what flows exist" and
 * "what is their current status / action count / last edited."
 * The markdown contributes:
 *   - category (the H3 heading the row lives under)
 *   - notes (free-form prose from the row)
 *   - drift detection: if the markdown explicitly states a Status that
 *     differs from the API's status, surface a <DriftFlag />.
 *
 * Markdown rows whose IDs aren't in the API are flagged separately
 * ("ID not found in Klaviyo — likely deleted or typo").
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Brand, BrandData } from './data';
import type { FlowRow } from '../../scripts/fetch/klaviyo';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..');
const FLOW_INVENTORY_PATH = resolve(REPO_ROOT, 'knowledge', 'flow-inventory.md');

export interface MarkdownFlowEntry {
  flowName: string;
  flowId: string | null;
  /** category = H3 heading the row sits under, e.g. "Refill Reminders — Hormesis (8 live flows)" */
  category: string;
  status: string | null;
  trigger: string | null;
  notes: string | null;
  brand: Brand;
}

export interface MergedFlow {
  api: FlowRow;
  category: string;
  markdown: MarkdownFlowEntry | null;
  drift: DriftFlag | null;
}

export interface DriftFlag {
  /** What the markdown said vs. what the API says. */
  field: 'status';
  markdownValue: string;
  apiValue: string;
}

export interface MergedSection {
  category: string;
  flows: MergedFlow[];
}

export interface MergedBrandInventory {
  brand: Brand;
  sections: MergedSection[];
  /** API flows that didn't appear in the markdown at all. */
  uncategorized: MergedFlow[];
  /** Markdown rows whose ID is not present in the API. */
  markdownOrphans: MarkdownFlowEntry[];
}

let parseCache: { thesis: MarkdownFlowEntry[]; stasis: MarkdownFlowEntry[] } | null = null;

export function parseFlowInventoryMarkdown(): { thesis: MarkdownFlowEntry[]; stasis: MarkdownFlowEntry[] } {
  if (parseCache) return parseCache;
  if (!existsSync(FLOW_INVENTORY_PATH)) {
    parseCache = { thesis: [], stasis: [] };
    return parseCache;
  }
  const md = readFileSync(FLOW_INVENTORY_PATH, 'utf8');

  const thesis: MarkdownFlowEntry[] = [];
  const stasis: MarkdownFlowEntry[] = [];

  let currentBrand: Brand | null = null;
  let currentCategory = 'Uncategorized';
  let inTable = false;
  let headers: string[] = [];

  const lines = md.split('\n');
  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    // Top-level brand headings.
    const h2 = /^##\s+(Thesis|Stasis)\s*$/i.exec(line);
    if (h2) {
      currentBrand = h2[1]!.toLowerCase() as Brand;
      currentCategory = 'Uncategorized';
      inTable = false;
      continue;
    }

    if (line.startsWith('## ')) {
      currentBrand = null;
      inTable = false;
      continue;
    }

    if (line.startsWith('### ') || line.startsWith('#### ')) {
      currentCategory = line.replace(/^#+\s+/, '').trim();
      inTable = false;
      continue;
    }

    if (currentBrand && line.startsWith('|')) {
      const cells = splitRow(line);
      if (!inTable) {
        if (looksLikeHeader(cells)) {
          headers = cells.map((c) => c.toLowerCase());
          inTable = true;
          continue;
        }
        continue;
      }
      if (cells.every((c) => /^:?-+:?$/.test(c))) continue;

      const row = Object.fromEntries(cells.map((cell, i) => [headers[i] ?? `col_${i}`, cell]));
      const flowName = (row.flow ?? '').trim();
      if (!flowName) continue;
      const id = (row.id ?? '').trim();
      const status = (row.status ?? '').trim() || null;
      const trigger = (row.trigger ?? '').trim() || null;
      const notes = ((row.notes ?? row.purpose ?? '') as string).trim() || null;

      const entry: MarkdownFlowEntry = {
        flowName,
        flowId: id && id !== '—' ? id : null,
        category: currentCategory,
        status,
        trigger,
        notes,
        brand: currentBrand,
      };
      (currentBrand === 'thesis' ? thesis : stasis).push(entry);
    } else {
      inTable = false;
    }
  }

  parseCache = { thesis, stasis };
  return parseCache;
}

function splitRow(line: string): string[] {
  // Strip leading/trailing pipes, then split on un-escaped pipes only.
  // Markdown escapes a literal pipe inside a cell as `\|`, so the cell
  // delimiter is "pipe not preceded by backslash". After splitting we
  // unescape the `\|` back to `|` inside each cell.
  const inner = line.replace(/^\|/, '').replace(/\|\s*$/, '');
  return inner.split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, '|'));
}

function looksLikeHeader(cells: string[]): boolean {
  return cells.length > 0 && cells[0]!.toLowerCase() === 'flow';
}

export function buildMergedInventory(brand: Brand, data: BrandData): MergedBrandInventory {
  const { thesis, stasis } = parseFlowInventoryMarkdown();
  const mdEntries = brand === 'thesis' ? thesis : stasis;

  const mdById = new Map<string, MarkdownFlowEntry>();
  for (const e of mdEntries) {
    if (e.flowId) mdById.set(e.flowId, e);
  }

  const mdMatched = new Set<string>();
  const sections = new Map<string, MergedFlow[]>();
  const uncategorized: MergedFlow[] = [];

  for (const flow of data.flows.flows) {
    const md = mdById.get(flow.id) ?? null;
    if (md) mdMatched.add(flow.id);
    const category = md?.category ?? 'Uncategorized';
    const merged: MergedFlow = {
      api: flow,
      category,
      markdown: md,
      drift: detectDrift(flow, md),
    };
    if (md) {
      const arr = sections.get(category) ?? [];
      arr.push(merged);
      sections.set(category, arr);
    } else {
      uncategorized.push(merged);
    }
  }

  const sortedSections: MergedSection[] = Array.from(sections.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([category, flows]) => ({
      category,
      flows: flows.sort(sortByStatusThenRecipients),
    }));

  const markdownOrphans = mdEntries.filter((e) => e.flowId && !mdMatched.has(e.flowId));

  return {
    brand,
    sections: sortedSections,
    uncategorized: uncategorized.sort(sortByStatusThenRecipients),
    markdownOrphans,
  };
}

function detectDrift(api: FlowRow, md: MarkdownFlowEntry | null): DriftFlag | null {
  if (!md?.status) return null;
  const apiStatus = api.status.toLowerCase();
  const mdStatus = md.status.toLowerCase();
  if (apiStatus === mdStatus) return null;
  return { field: 'status', markdownValue: md.status, apiValue: api.status };
}

function statusRank(s: string): number {
  switch (s.toLowerCase()) {
    case 'live':
      return 0;
    case 'manual':
      return 1;
    case 'draft':
      return 2;
    case 'draining':
      return 3;
    default:
      return 4;
  }
}

function sortByStatusThenRecipients(a: MergedFlow, b: MergedFlow): number {
  const sa = statusRank(a.api.status);
  const sb = statusRank(b.api.status);
  if (sa !== sb) return sa - sb;
  return (b.api.stats.recipients ?? 0) - (a.api.stats.recipients ?? 0);
}
