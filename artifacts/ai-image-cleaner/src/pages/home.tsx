import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CleanerWorkspace } from '@/components/cleaner-workspace';
import { SiteNavbar } from '@/components/site-navbar';
import { SiteFooter } from '@/components/site-footer';
import { HeroSection } from '@/components/sections/hero';
import { FeaturesShowcase } from '@/components/sections/features';
import { AboutSection } from '@/components/sections/about';
import { FaqSection } from '@/components/sections/faq';
import { fetchSiteSettings } from '@/lib/blog-data';
import { consumePendingSection, scrollToSection } from '@/lib/section-nav';

export default function HomePage() {
  const { data: siteSettings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: fetchSiteSettings,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const pending = consumePendingSection();
    if (pending) scrollToSection(pending);
  }, []);

  return (
    <main className="cleaner-shell cleaner-noise min-h-[100dvh] text-[#f5f1e8]">
      <SiteNavbar />
      <HeroSection title={siteSettings?.homepage_title} tagline={siteSettings?.homepage_tagline} />
      <FeaturesShowcase />
      <CleanerWorkspace />
      <AboutSection />
      <FaqSection />
      <SiteFooter />
    </main>
  );
}