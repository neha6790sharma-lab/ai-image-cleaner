import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { goToSection } from '@/lib/section-nav';
import {
  DEFAULT_OG_IMAGE,
  SITE_URL,
  resetDocumentMeta,
  setDocumentMeta,
} from '@/lib/seo';

export interface DeviceSeoOptions {
  path: string;
  title: string;
  description: string;
  operatingSystem?: string;
}

/**
 * Shared SEO setup used by the per-device landing pages: unique title,
 * description, canonical URL, Open Graph / Twitter tags and a WebPage JSON-LD
 * block pointing back at the cleaner. editor.
 */
export function useDevicePageMeta({
  path,
  title,
  description,
  operatingSystem = 'Any',
}: DeviceSeoOptions) {
  const url = `${SITE_URL}${path}`;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setDocumentMeta({
      title,
      description,
      canonical: url,
      og: {
        type: 'website',
        title,
        description,
        url,
        image: DEFAULT_OG_IMAGE,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        image: DEFAULT_OG_IMAGE,
      },
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: title,
        description,
        url,
        about: {
          '@type': 'SoftwareApplication',
          name: 'cleaner.',
          applicationCategory: 'MultimediaApplication',
          operatingSystem,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          featureList: [
            'Remove Object',
            'Crop',
            'Convert Format',
            'Passport Size',
            'Rotate / Flip',
            'Adjust & Filters',
            'Compress Image',
            'Watermark / Add Text',
            'Remove Privacy Data',
            'Remove Background',
          ],
        },
      },
    });
    return resetDocumentMeta;
  }, [url, title, description, operatingSystem]);
}

/**
 * Returns a handler that navigates to the homepage and scrolls straight to the
 * editor, so every device page has an obvious path back to the actual tool.
 */
export function useGoToTool() {
  const [, navigate] = useLocation();
  return () => {
    goToSection('tool', false);
    navigate('/');
  };
}