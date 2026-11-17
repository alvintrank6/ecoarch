import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Domain not confirmed (docs/01 [CẦN BỔ SUNG]); override with PUBLIC_SITE_URL at deploy.
const site = process.env.PUBLIC_SITE_URL || 'https://eco-arch.example';

export default defineConfig({
  site,
  trailingSlash: 'always',
  build: { format: 'directory' },
  i18n: { locales: ['vi', 'en'], defaultLocale: 'vi', routing: { prefixDefaultLocale: true } },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'vi', locales: { vi: 'vi', en: 'en' } },
      filter: (p) => !/\/(cam-on|thank-you)\/$/.test(p),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
