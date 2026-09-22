import { Link, useLocation } from 'wouter';
import { Sparkles } from 'lucide-react';
import { goToSection, scrollToTop } from '@/lib/section-nav';
import { CITIES, cityPath } from '@/lib/city-data';

const FOOTER_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/', section: 'features' },
  { label: 'About', href: '/', section: 'about' },
  { label: 'Blog', href: '/blog' },
];

export function SiteFooter() {
  const [location, navigate] = useLocation();
  const cleanLocation = location.replace(/\/$/, '') || '/';
  const onHome = cleanLocation === '/';
  const year = new Date().getFullYear();

  const handle = (href: string, section?: string) => {
    if (section) {
      goToSection(section, onHome);
      if (!onHome) navigate('/');
      return;
    }
    if (href === '/') {
      if (onHome) scrollToTop();
      else navigate('/');
    } else {
      navigate(href);
    }
  };

  return (
    <footer className="border-t border-[#252f33] bg-[#10161a]/60">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-8 lg:px-12">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
          <div className="max-w-sm">
            <button type="button" onClick={() => handle('/')} className="group flex items-center gap-3">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#f0bd5b]/50 bg-[#f0bd5b]/10 text-[#f0bd5b] transition-transform group-hover:rotate-6">
                <Sparkles size={17} strokeWidth={1.8} />
                <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#62e4dc]" />
              </span>
              <span className="text-left">
                <span className="block text-[15px] font-bold tracking-[-0.02em] text-[#f5f1e8]">
                  cleaner<span className="text-[#f0bd5b]">.</span>
                </span>
                <span className="block text-[10px] uppercase tracking-[.18em] text-[#748487]">private image utility</span>
              </span>
            </button>
            <p className="mt-4 text-sm leading-6 text-[#8f9da0]">
              Remove objects, crop, convert, compress, and clean up photos — all in your browser, with no account and no cloud storage.
            </p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-1 sm:grid-cols-4 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
            {FOOTER_LINKS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handle(item.href, item.section)}
                className="rounded-lg px-3 py-2 text-left text-sm font-medium text-[#9eabad] transition-colors hover:text-[#f5f1e8]"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-8 border-t border-[#252f33] pt-6">
          <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#748487]">
            Haryana — image editor by city
          </p>
          <nav
            aria-label="Image editor in Haryana cities"
            className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3 lg:grid-cols-4"
          >
            {CITIES.map((city) => (
              <Link
                key={city.slug}
                href={cityPath(city.slug)}
                className="rounded-lg py-1 text-sm font-medium text-[#9eabad] transition-colors hover:text-[#f5f1e8]"
              >
                Image editor in {city.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#252f33] pt-6 font-mono text-[10px] uppercase tracking-[.14em] text-[#647477]">
          <span>© {year} cleaner. All rights reserved.</span>
          <span>Made with care — right in your browser.</span>
        </div>
      </div>
    </footer>
  );
}