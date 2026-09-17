import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, Sparkles, X } from 'lucide-react';
import { goToSection, scrollToTop } from '@/lib/section-nav';

interface NavItem {
  label: string;
  href: string;
  section?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/', section: 'features' },
  { label: 'About', href: '/', section: 'about' },
  { label: 'Blog', href: '/blog' },
];

function Brand({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label="cleaner. — go to homepage" className="group flex items-center gap-3">
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#f0bd5b]/50 bg-[#f0bd5b]/10 text-[#f0bd5b] transition-transform group-hover:rotate-6">
        <Sparkles size={17} strokeWidth={1.8} />
        <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#62e4dc]" />
      </span>
      <span className="text-left">
        <span className="block text-[15px] font-bold tracking-[-0.02em] text-[#f5f1e8]">
          cleaner<span className="text-[#f0bd5b]">.</span>
        </span>
        <span className="hidden text-[10px] uppercase tracking-[.18em] text-[#748487] sm:block">private image utility</span>
      </span>
    </button>
  );
}

export function SiteNavbar() {
  const [location, navigate] = useLocation();
  const [open, setOpen] = useState(false);
  const cleanLocation = location.replace(/\/$/, '') || '/';
  const onHome = cleanLocation === '/';
  const onBlog = cleanLocation === '/blog' || cleanLocation.startsWith('/blog');

  useEffect(() => {
    setOpen(false);
  }, [location]);

  const handleBrand = () => {
    if (onHome) scrollToTop();
    else navigate('/');
    setOpen(false);
  };

  const handleSection = (item: NavItem) => {
    setOpen(false);
    if (item.section) {
      goToSection(item.section, onHome);
      if (!onHome) navigate('/');
      return;
    }
    if (item.href === '/') {
      if (onHome) scrollToTop();
      else navigate('/');
    } else {
      navigate(item.href);
    }
  };

  const linkClass = (active: boolean) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      active ? 'text-[#f0bd5b]' : 'text-[#9eabad] hover:bg-[#f5f1e8]/5 hover:text-[#f5f1e8]'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-[#252f33] bg-[#121719]/85 backdrop-blur-md">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-8 lg:px-12" aria-label="Main">
        <Brand onClick={handleBrand} />
        <div className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = item.section ? false : item.href === '/' ? onHome : onBlog;
            if (item.section) {
              return (
                <button key={item.label} type="button" onClick={() => handleSection(item)} className={linkClass(false)}>
                  {item.label}
                </button>
              );
            }
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => {
                  if (item.href === '/' && onHome) {
                    scrollToTop();
                    return false;
                  }
                  return true;
                }}
                className={linkClass(active)}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#293337] text-[#9eabad] transition-colors hover:text-[#f5f1e8] md:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>
      {open && (
        <div className="border-t border-[#252f33] bg-[#121719]/95 md:hidden">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 pb-5 pt-3 sm:px-8">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleSection(item)}
                className="flex items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-medium text-[#bcc7c4] transition-colors hover:bg-[#f5f1e8]/5 hover:text-[#f5f1e8]"
              >
                {item.label}
              </button>
            ))}
            <div className="mt-3 rounded-xl border border-[#293337] bg-[#171d20] px-4 py-3 text-xs leading-5 text-[#718082]">
              No account. No cloud storage. Everything runs right in your browser.
            </div>
          </div>
        </div>
      )}
    </header>
  );
}