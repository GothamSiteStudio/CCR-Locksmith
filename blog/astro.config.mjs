import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const SITE = 'https://alphaLocks.github.io/CCR-Locksmith';
const BASE = '/CCR-Locksmith';

export default defineConfig({
  site: SITE,
  base: BASE,
  output: 'static',
  integrations: [sitemap()],
});