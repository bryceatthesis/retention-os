/**
 * Copy committed template HTML/PNG bundles from data/<brand>/templates/
 * into public/data-assets/<brand>/templates/ so the Astro build can
 * serve them as static assets.
 *
 * Idempotent — runs before `astro dev` and `astro build`. We do this
 * via copy rather than symlink so the GitHub Pages deploy bundle is
 * self-contained.
 */

import { existsSync, mkdirSync, readdirSync, copyFileSync, statSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const DATA_ROOT = resolve(REPO_ROOT, 'data');
const PUBLIC_TARGET = resolve(REPO_ROOT, 'public', 'data-assets');

const BRANDS = ['thesis', 'stasis'] as const;

function copyDir(src: string, dst: string): void {
  if (!existsSync(src)) return;
  mkdirSync(dst, { recursive: true });
  for (const name of readdirSync(src)) {
    const s = join(src, name);
    const d = join(dst, name);
    const st = statSync(s);
    if (st.isDirectory()) copyDir(s, d);
    else copyFileSync(s, d);
  }
}

function main(): void {
  for (const brand of BRANDS) {
    const src = resolve(DATA_ROOT, brand, 'templates');
    const dst = resolve(PUBLIC_TARGET, brand, 'templates');
    if (existsSync(src)) {
      copyDir(src, dst);
      console.log(`[sync-public-assets] ${brand}: ${src} -> ${dst}`);
    }
  }
}

main();
