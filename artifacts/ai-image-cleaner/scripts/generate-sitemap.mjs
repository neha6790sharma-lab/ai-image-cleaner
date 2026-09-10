#!/usr/bin/env node
/**
 * Regenerate public/sitemap.xml from the published blog posts.
 *
 * Usage (from this project folder):
 *   pnpm sitemap
 *
 * Runs at build/deploy time (this is a static SPA, so the sitemap has to be
 * generated before you ship). Only PUBLISHED posts are included - drafts and
 * the secret admin panel are never listed.
 *
 * Optional env: SITE_URL (defaults to the https://example.com used today).
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const url = process.env.VITE_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;
const SITE_URL = (process.env.SITE_URL || 'https://example.com').replace(/\/$/, '');

if (!url || !secret) {
  console.error(
    '\n[sitemap] Missing VITE_SUPABASE_URL or SUPABASE_SECRET_KEY in .env. Aborting.\n',
  );
  process.exit(1);
}

const supabase = createClient(url, secret, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: posts, error } = await supabase
  .from('blog_posts')
  .select('slug, updated_at')
  .eq('status', 'published')
  .order('published_at', { ascending: false });

if (error) {
  console.error(`\n[sitemap] Could not read published posts: ${error.message}\n`);
  process.exit(1);
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function urlBlock(loc, mod) {
  return (
    `  <url>\n    <loc>${escapeXml(loc)}</loc>` +
    (mod ? `\n    <lastmod>${escapeXml(mod.slice(0, 10))}</lastmod>` : '') +
    '\n  </url>'
  );
}

const newestMod = posts?.[0]?.updated_at?.slice(0, 10);
const lines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  urlBlock(`${SITE_URL}/`),
  urlBlock(`${SITE_URL}/blog`, newestMod),
  ...(posts || []).map((post) =>
    urlBlock(`${SITE_URL}/blog/${post.slug}`, post.updated_at),
  ),
  '</urlset>',
  '',
];

const target = resolve(process.cwd(), 'public', 'sitemap.xml');
writeFileSync(target, lines.join('\n'), 'utf8');

console.log(
  `[sitemap] Wrote ${target} with ${(posts || []).length + 2} URLs (${posts?.length ?? 0} published posts).`,
);