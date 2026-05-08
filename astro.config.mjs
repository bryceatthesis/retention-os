import { defineConfig } from 'astro/config';

const repo = process.env.GITHUB_REPOSITORY ?? 'bryceatthesis/retention-os';
const repoName = repo.split('/').pop() ?? 'retention-os';

const isUserPagesSite = process.env.LCC_USER_SITE === 'true';

export default defineConfig({
  site: process.env.LCC_SITE_URL ?? `https://bryceatthesis.github.io/${repoName}`,
  base: isUserPagesSite ? '/' : `/${repoName}`,
  trailingSlash: 'ignore',
  output: 'static',
  build: {
    format: 'directory',
    assets: 'assets',
  },
  vite: {
    server: {
      fs: {
        allow: ['..'],
      },
    },
  },
});
