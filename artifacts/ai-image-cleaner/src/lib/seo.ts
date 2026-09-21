export const DEFAULT_SITE_TITLE =
  'cleaner. — Free Online Image Editor: Remove Objects, Crop, Compress & More';

export const DEFAULT_SITE_DESCRIPTION =
  'cleaner. — a private image utility in your browser. Remove objects, crop, convert, compress, resize, and enhance images. No account, no cloud storage.';

export const DEFAULT_OG_IMAGE = '/og-image.png';

/**
 * Deploy-time origin for canonical/og:url values. Keep the example.com
 * placeholder unless VITE_SITE_URL is set at deploy time - the site does not
 * hard-code a real domain on purpose.
 */
export const SITE_URL = (
  (import.meta.env.VITE_SITE_URL as string | undefined) || 'https://example.com'
).replace(/\/+$/, '');

const PAGE_JSONLD_ID = 'seo-jsonld-post';

export interface SeoOg {
  type?: 'website' | 'article';
  title?: string;
  description?: string;
  url?: string;
  image?: string;
}

export interface SeoTwitter {
  card?: 'summary' | 'summary_large_image';
  title?: string;
  description?: string;
  image?: string;
}

export interface PageMeta {
  title: string;
  description: string;
  canonical?: string;
  og?: SeoOg;
  twitter?: SeoTwitter;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

function upsertMeta(
  attr: 'name' | 'property',
  key: string,
  content: string,
): HTMLMetaElement {
  const selector = attr === 'name' ? `meta[name="${key}"]` : `meta[property="${key}"]`;
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
  return el;
}

function upsertCanonical(href: string) {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function setPageJsonLd(data: Record<string, unknown> | Record<string, unknown>[]) {
  removePageJsonLd();
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = PAGE_JSONLD_ID;
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

function removePageJsonLd() {
  document.getElementById(PAGE_JSONLD_ID)?.remove();
}

function applyMeta(meta: PageMeta) {
  document.title = meta.title;
  upsertMeta('name', 'description', meta.description);
  if (meta.canonical) upsertCanonical(meta.canonical);

  const og = meta.og;
  if (og?.title) upsertMeta('property', 'og:title', og.title);
  if (og?.description) upsertMeta('property', 'og:description', og.description);
  if (og?.type) upsertMeta('property', 'og:type', og.type);
  if (og?.url) upsertMeta('property', 'og:url', og.url);
  if (og?.image) upsertMeta('property', 'og:image', og.image);

  const twitter = meta.twitter;
  if (twitter?.card) upsertMeta('name', 'twitter:card', twitter.card);
  if (twitter?.title) upsertMeta('name', 'twitter:title', twitter.title);
  if (twitter?.description)
    upsertMeta('name', 'twitter:description', twitter.description);
  if (twitter?.image) upsertMeta('name', 'twitter:image', twitter.image);

  if (meta.jsonLd) setPageJsonLd(meta.jsonLd);
}

export function setDocumentMeta(title: string, description: string): void;
export function setDocumentMeta(meta: PageMeta): void;
export function setDocumentMeta(
  titleOrMeta: string | PageMeta,
  maybeDescription?: string,
): void {
  const meta: PageMeta =
    typeof titleOrMeta === 'string'
      ? { title: titleOrMeta, description: maybeDescription ?? '' }
      : titleOrMeta;
  applyMeta(meta);
}

export function resetDocumentMeta() {
  applyMeta({
    title: DEFAULT_SITE_TITLE,
    description: DEFAULT_SITE_DESCRIPTION,
    canonical: SITE_URL,
    og: {
      type: 'website',
      title: DEFAULT_SITE_TITLE,
      description: DEFAULT_SITE_DESCRIPTION,
      url: SITE_URL,
      image: DEFAULT_OG_IMAGE,
    },
    twitter: {
      card: 'summary_large_image',
      title: DEFAULT_SITE_TITLE,
      description: DEFAULT_SITE_DESCRIPTION,
      image: DEFAULT_OG_IMAGE,
    },
  });
  removePageJsonLd();
}

/**
 * Restore the site-wide canonical/OG/twitter defaults and drop any per-page
 * JSON-LD while leaving the current <title>/description untouched. Used by the
 * homepage, where the workspace updates the title/description from admin
 * settings and only page-scoped artifacts need clearing.
 */
export function clearPageMeta() {
  const currentTitle = document.title || DEFAULT_SITE_TITLE;
  const currentDescription =
    document.querySelector('meta[name="description"]')?.getAttribute('content') ||
    DEFAULT_SITE_DESCRIPTION;
  applyMeta({
    title: currentTitle,
    description: currentDescription,
    canonical: SITE_URL,
    og: {
      type: 'website',
      title: DEFAULT_SITE_TITLE,
      description: DEFAULT_SITE_DESCRIPTION,
      url: SITE_URL,
      image: DEFAULT_OG_IMAGE,
    },
    twitter: {
      card: 'summary_large_image',
      title: DEFAULT_SITE_TITLE,
      description: DEFAULT_SITE_DESCRIPTION,
      image: DEFAULT_OG_IMAGE,
    },
  });
  removePageJsonLd();
}