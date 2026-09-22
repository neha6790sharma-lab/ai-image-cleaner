import deviceSlugJson from './device-slugs.json';

export const DEVICE_PATH_PREFIX = 'image-editor-for';

export interface DevicePageInfo {
  slug: string;
  name: string;
  path: string;
}

export function devicePath(slug: string): string {
  return `/${DEVICE_PATH_PREFIX}-${slug}`;
}

const DEVICE_NAMES: Record<string, string> = {
  android: 'Android',
  iphone: 'iPhone',
  pc: 'PC',
  laptop: 'Laptop',
  macbook: 'MacBook',
};

/**
 * Device landing pages are static routes registered in src/App.tsx. The slug
 * list lives in src/lib/device-slugs.json so the app, the footer and the
 * sitemap generator share one source of truth.
 */
export const DEVICE_SLUGS: string[] = deviceSlugJson as string[];

export const DEVICE_PAGES: DevicePageInfo[] = DEVICE_SLUGS.map((slug) => {
  const name = DEVICE_NAMES[slug];
  if (!name) {
    throw new Error(`Missing device name for slug "${slug}".`);
  }
  return { slug, name, path: devicePath(slug) };
});

export function getDevicePage(slug: string): DevicePageInfo | undefined {
  return DEVICE_PAGES.find((d) => d.slug === slug);
}