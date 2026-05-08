/**
 * Reads experiments/<quarter>/*.md for the Projects page.
 * Frontmatter parsing is intentionally minimal — we don't need a full YAML
 * lib for what's effectively title/status/owner/updated.
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..');
const EXPERIMENTS_ROOT = resolve(REPO_ROOT, 'experiments');

export interface Experiment {
  slug: string;
  title: string;
  quarter: string;
  status: string | null;
  brand: string | null;
  owner: string | null;
  updated: string | null;
  bodyExcerpt: string;
  filePath: string;
  /** GitHub-relative path (for "edit on GitHub" links). */
  repoRelativePath: string;
}

export function loadExperiments(): Experiment[] {
  if (!existsSync(EXPERIMENTS_ROOT)) return [];
  const out: Experiment[] = [];
  for (const quarter of readdirSync(EXPERIMENTS_ROOT)) {
    const qPath = resolve(EXPERIMENTS_ROOT, quarter);
    let qStat;
    try {
      qStat = statSync(qPath);
    } catch {
      continue;
    }
    if (!qStat.isDirectory()) continue;
    if (!/^\d{4}-Q[1-4]$/i.test(quarter)) continue;

    for (const fname of readdirSync(qPath)) {
      if (!fname.endsWith('.md')) continue;
      const filePath = resolve(qPath, fname);
      const raw = readFileSync(filePath, 'utf8');
      const { frontmatter, body } = splitFrontmatter(raw);
      const title = frontmatter.title ?? deriveTitle(body) ?? fname.replace(/\.md$/, '');
      const slug = `${quarter}/${fname.replace(/\.md$/, '')}`;
      out.push({
        slug,
        title,
        quarter,
        status: frontmatter.status ?? deriveStatus(body) ?? null,
        brand: frontmatter.brand ?? null,
        owner: frontmatter.owner ?? null,
        updated: frontmatter.updated ?? null,
        bodyExcerpt: deriveExcerpt(body),
        filePath,
        repoRelativePath: `experiments/${quarter}/${basename(filePath)}`,
      });
    }
  }
  out.sort((a, b) => (b.updated ?? '').localeCompare(a.updated ?? ''));
  return out;
}

function splitFrontmatter(raw: string): { frontmatter: Record<string, string>; body: string } {
  const fm: Record<string, string> = {};
  if (!raw.startsWith('---\n')) return { frontmatter: fm, body: raw };
  const end = raw.indexOf('\n---', 4);
  if (end < 0) return { frontmatter: fm, body: raw };
  const fmBlock = raw.slice(4, end);
  const body = raw.slice(end + 4).replace(/^\s*\n/, '');
  for (const line of fmBlock.split('\n')) {
    const m = /^([a-zA-Z_][\w-]*)\s*:\s*(.*)$/.exec(line);
    if (m) fm[m[1]!.toLowerCase()] = m[2]!.trim().replace(/^["']|["']$/g, '');
  }
  return { frontmatter: fm, body };
}

function deriveTitle(body: string): string | null {
  const m = /^#\s+(.+)$/m.exec(body);
  return m ? m[1]!.trim() : null;
}

function deriveStatus(body: string): string | null {
  const m = /\bstatus\b\s*[:\-]\s*(.+?)(?:\n|$)/i.exec(body);
  return m ? m[1]!.trim() : null;
}

function deriveExcerpt(body: string): string {
  const stripped = body.replace(/^#+.*$/gm, '').replace(/\s+/g, ' ').trim();
  return stripped.length > 240 ? `${stripped.slice(0, 237)}…` : stripped;
}
