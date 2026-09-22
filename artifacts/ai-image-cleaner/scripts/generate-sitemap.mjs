#!/usr/bin/env node
/**
 * Regenerate public/sitemap.xml from the published blog posts.
 *
 * Usage (from this project folder):
 *   pnpm sitemap
 *
 * Runs automatically at deploy time (vercel-build) - this is a static SPA, so
 * the sitemap is generated from Supabase right before the assets are built
 * rather than served from a serverless function (the app has no public API
 * routes). Only PUBLISHED posts are included - drafts and the secret admin
 * panel are never listed.
 *
 * Never fails the build: if Supabase credentials are not present (e.g. a local
 * build without .env) it writes a minimal valid sitemap with the homepage and
 * the /blog listing so crawlers still see the static core of the site.
 *
 * Optional env: SITE_URL (defaults to the https://example.com used today),
 * VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY or SUPABASE_SECRET_KEY.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const url = process.env.VITE_SUPABASE_URL;
const anon = process.env.VITE_SUPABASE_ANON_KEY;
const secret = process.env.SUPABASE_SECRET_KEY;
const SITE_URL = (process.env.SITE_URL || 'https://example.com').replace(/\/+$/, '');

/**
 * Device landing pages are static routes registered in src/App.tsx. The slug
 * list lives in src/lib/device-slugs.json so this script and the app share one
 * source of truth (the app imports the same file in src/lib/device-data.ts).
 */
function loadDeviceSlugs() {
  try {
    const raw = readFileSync(
      resolve(process.cwd(), 'src', 'lib', 'device-slugs.json'),
      'utf8',
    );
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((slug) => typeof slug === 'string' && slug.length > 0);
    }
  } catch (error) {
    console.warn(`[sitemap] Could not read device slugs: ${error.message}`);
  }
  return [];
}

const DEVICE_SLUGS = loadDeviceSlugs();


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

function buildSitemap(posts = []) {
  const newestMod = posts?.[0]?.updated_at?.slice(0, 10);
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlBlock(`${SITE_URL}/`),
    urlBlock(`${SITE_URL}/blog`, newestMod),
    ...(posts || []).map((post) =>
      urlBlock(`${SITE_URL}/blog/${post.slug}`, post.updated_at),
    ),
    ...DEVICE_SLUGS.map((slug) =>
      urlBlock(`${SITE_URL}/image-editor-for-${slug}`),
    ),
    '</urlset>',
    '',
  ].join('\n');
}

const target = resolve(process.cwd(), 'public', 'sitemap.xml');

let posts = [];
if (!url) {
  console.warn('[sitemap] Missing VITE_SUPABASE_URL - writing a minimal sitemap.');
} else if (!anon && !secret) {
  console.warn(
    '[sitemap] Missing VITE_SUPABASE_ANON_KEY / SUPABASE_SECRET_KEY - writing a minimal sitemap.',
  );
} else {
  const supabase = createClient(url, anon || secret, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    if (error) {
      console.warn(`[sitemap] Could not read published posts: ${error.message}`);
    } else {
      posts = data ?? [];
    }
  } catch (error) {
    console.warn(`[sitemap] Could not read published posts: ${error.message}`);
  }
}

writeFileSync(target, buildSitemap(posts), 'utf8');
console.log(
  `[sitemap] Wrote ${target} with ${posts.length + 2 + DEVICE_SLUGS.length} URLs (${posts.length} published posts, ${DEVICE_SLUGS.length} device pages).`,
);