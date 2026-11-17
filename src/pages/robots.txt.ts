import type { APIRoute } from 'astro';
// Allow everything and point at the sitemap; domain comes from PUBLIC_SITE_URL via astro.config `site`.
export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap-index.xml', site).href}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
