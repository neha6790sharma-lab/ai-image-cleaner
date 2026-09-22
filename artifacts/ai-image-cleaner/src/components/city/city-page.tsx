import { Fragment, useEffect } from 'react';
import { useLocation } from 'wouter';
import { SiteNavbar } from '@/components/site-navbar';
import { SiteFooter } from '@/components/site-footer';
import { CityHero } from '@/components/city/city-hero';
import {
  CityAbout,
  CityClosing,
  CityCta,
  CityTrust,
  CityUses,
} from '@/components/city/city-sections';
import { accentFor, cityPath, type CityConfig } from '@/lib/city-data';
import { goToSection } from '@/lib/section-nav';
import {
  DEFAULT_OG_IMAGE,
  SITE_URL,
  resetDocumentMeta,
  setDocumentMeta,
} from '@/lib/seo';

export function CityPage({ city }: { city: CityConfig }) {
  const [, navigate] = useLocation();
  const accent = accentFor(city);
  const path = cityPath(city.slug);
  const url = `${SITE_URL}${path}`;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setDocumentMeta({
      title: city.metaTitle,
      description: city.metaDescription,
      canonical: url,
      og: {
        type: 'website',
        title: city.metaTitle,
        description: city.metaDescription,
        url,
        image: DEFAULT_OG_IMAGE,
      },
      twitter: {
        card: 'summary_large_image',
        title: city.metaTitle,
        description: city.metaDescription,
        image: DEFAULT_OG_IMAGE,
      },
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: city.metaTitle,
        description: city.metaDescription,
        url,
        about: {
          '@type': 'SoftwareApplication',
          name: 'cleaner.',
          applicationCategory: 'MultimediaApplication',
          operatingSystem: 'Any',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        },
      },
    });
    return resetDocumentMeta;
  }, [city, url]);

  const onTryTool = () => {
    goToSection('tool', false);
    navigate('/');
  };

  const onExplore = () => {
    goToSection('features', false);
    navigate('/');
  };

  const sections = {
    trust: <CityTrust city={city} accent={accent} />,
    about: <CityAbout city={city} accent={accent} />,
    uses: <CityUses city={city} accent={accent} />,
    cta: (
      <CityCta
        city={city}
        accent={accent}
        onTryTool={onTryTool}
        onExplore={onExplore}
      />
    ),
  } as const;

  return (
    <main className="cleaner-shell cleaner-noise min-h-[100dvh] text-[#f5f1e8]">
      <SiteNavbar />
      <CityHero
        city={city}
        accent={accent}
        onTryTool={onTryTool}
        onExplore={onExplore}
      />
      {city.order.map((key) => (
        <Fragment key={key}>{sections[key]}</Fragment>
      ))}
      <CityClosing city={city} accent={accent} />
      <SiteFooter />
    </main>
  );
}
