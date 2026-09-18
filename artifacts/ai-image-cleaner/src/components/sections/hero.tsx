import { Check, EyeOff, LockKeyhole, ShieldCheck, WandSparkles } from 'lucide-react';
import { scrollToSection } from '@/lib/section-nav';

function heroSplit(title: string): { head: string; accent: string } {
  const start = title.indexOf('|');
  if (start === -1) return { head: title, accent: '' };
  const end = title.indexOf('|', start + 1);
  if (end === -1) return { head: title.replace('|', ''), accent: '' };
  return {
    head: (title.slice(0, start) + title.slice(end + 1)).trim(),
    accent: title.slice(start + 1, end).trim(),
  };
}

function SceneIllustration({ showBalloon }: { showBalloon: boolean }) {
  return (
    <svg viewBox="0 0 400 440" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="mock-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#23424d" />
          <stop offset="0.55" stopColor="#152c36" />
          <stop offset="1" stopColor="#0d1b22" />
        </linearGradient>
        <linearGradient id="mock-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#33717a" stopOpacity=".85" />
          <stop offset="1" stopColor="#1d4a50" />
        </linearGradient>
        <linearGradient id="mock-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#26343b" />
          <stop offset="1" stopColor="#111d22" />
        </linearGradient>
        <radialGradient id="mock-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f0bd5b" stopOpacity=".95" />
          <stop offset="1" stopColor="#f0bd5b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="440" fill="url(#mock-sky)" />
      <circle cx="200" cy="150" r="92" fill="url(#mock-sun)" opacity=".5" />
      <circle cx="200" cy="150" r="26" fill="#f0bd5b" opacity=".9" />
      {showBalloon && (
        <g>
          <path d="M 152 150 a 21 27 0 1 1 44 0 l -4 9 a 18 24 0 0 1 -36 0 z" fill="#f1837c" opacity=".92" />
          <path d="M 162 164 l 13 5" stroke="#c96b66" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="146" cy="138" rx="4.5" ry="7" fill="#fff" opacity=".35" transform="rotate(-18 146 138)" />
          <path d="M 174 180 q 1 22 -6 26" stroke="#f1837c" strokeWidth="1.4" fill="none" opacity=".7" />
        </g>
      )}
      <path d="M 0 300 L 120 214 L 210 292 L 300 232 L 400 300 L 400 440 L 0 440 Z" fill="url(#mock-back)" />
      <path d="M 0 368 L 90 300 L 170 352 L 268 300 L 400 366 L 400 440 L 0 440 Z" fill="url(#mock-front)" />
      <g fill="#62e4dc" opacity=".35">
        <circle cx="120" cy="254" r="3" />
        <circle cx="286" cy="276" r="3" />
        <circle cx="340" cy="330" r="2.5" />
        <circle cx="66" cy="330" r="2.5" />
      </g>
    </svg>
  );
}

function HeroMockup() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none">
      <div className="cleaner-glow cleaner-glow-cyan absolute -right-10 -top-12 h-56 w-56 sm:h-72 sm:w-72" />
      <div className="cleaner-glow cleaner-glow-gold absolute -bottom-14 -left-12 h-64 w-64 sm:h-80 sm:w-80" />
      <div className="cleaner-float relative">
        <div className="relative overflow-hidden rounded-3xl border border-[#293337] bg-[#141a1d]/95 shadow-[0_35px_90px_-24px_rgba(0,0,0,.85)]">
          <div className="flex items-center justify-between gap-3 border-b border-[#252f33] px-4 py-3">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#f1837c]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#f0bd5b]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#62e4dc]" />
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[.16em] text-[#647477]">cleaner · live preview</span>
            <span className="rounded-md border border-[#f0bd5b]/30 bg-[#f0bd5b]/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[.1em] text-[#e2bf77]">
              Remove object
            </span>
          </div>
          <div className="relative aspect-[10/8]">
            <div className="absolute inset-0">
              <SceneIllustration showBalloon />
              <span className="absolute left-3 top-3 rounded-md border border-white/10 bg-[#0d1518]/80 px-2 py-1 font-mono text-[9px] uppercase tracking-[.12em] text-[#bec7c4]">
                Before
              </span>
              <circle
                cx="40%"
                cy="29%"
                r="9%"
                fill="none"
                stroke="#f0bd5b"
                strokeWidth="2"
                strokeDasharray="6 8"
                opacity=".7"
              />
            </div>
            <div className="absolute inset-0" style={{ clipPath: 'inset(0 0 0 50%)' }}>
              <SceneIllustration showBalloon={false} />
              <span className="absolute right-3 top-3 rounded-md border border-[#62e4dc]/30 bg-[#0d1518]/80 px-2 py-1 font-mono text-[9px] uppercase tracking-[.12em] text-[#9fe9e3]">
                After
              </span>
              <span className="absolute right-6 top-14 hidden items-center gap-1.5 rounded-md border border-[#62e4dc]/25 bg-[#0d1518]/80 px-2 py-1 font-mono text-[9px] uppercase tracking-[.12em] text-[#9fe9e3] sm:flex">
                <Check size={10} /> Done
              </span>
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-px bg-[#f5f1e8]/70">
              <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#f5f1e8]/60 bg-[#171719]/95 text-[#f5f1e8] shadow-lg">
                ↔
              </span>
            </div>
            <div className="absolute left-[62%] top-[28%] z-10 hidden sm:block">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#f0bd5b]/70 bg-[#f0bd5b]/15 text-[#f0bd5b] shadow-[0_0_18px_rgba(240,189,91,.35)]">
                <WandSparkles size={15} strokeWidth={1.8} />
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-[#252f33] px-4 py-3">
            <span className="flex items-center gap-2 text-[10px] text-[#8f9da0]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#62e4dc]" />
              <span className="hidden sm:inline">Object removed · kept in memory</span>
              <span className="sm:hidden">Kept in memory</span>
            </span>
            <span className="rounded-lg bg-[#f0bd5b] px-3 py-1 text-[10px] font-bold text-[#171719]">Export PNG</span>
          </div>
        </div>
        <div className="cleaner-float cleaner-float-slow absolute -right-3 -top-4 flex items-center gap-2 rounded-2xl border border-[#293337] bg-[#171d20] px-3 py-2 shadow-xl sm:-right-8">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#62e4dc]/10 text-[#62e4dc]">
            <EyeOff size={14} strokeWidth={1.8} />
          </span>
          <span className="pr-0.5">
            <span className="block text-[11px] font-semibold leading-4 text-[#f5f1e8]">Nothing uploaded</span>
            <span className="block text-[10px] leading-3 text-[#718082]">stays in the tab</span>
          </span>
        </div>
        <div className="cleaner-float absolute -bottom-4 -left-3 flex items-center gap-2 rounded-2xl border border-[#293337] bg-[#171d20] px-3 py-2 shadow-xl sm:-left-8">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f0bd5b]/10 text-[#f0bd5b]">
            <WandSparkles size={14} strokeWidth={1.8} />
          </span>
          <span className="pr-0.5">
            <span className="block text-[11px] font-semibold leading-4 text-[#f5f1e8]">Object removed</span>
            <span className="block text-[10px] leading-3 text-[#718082]">pixels refilled</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export function HeroSection({
  title,
  tagline,
}: {
  title?: string;
  tagline?: string;
}) {
  const rawTitle = title ?? 'Make your image |just right.|';
  const { head, accent } = heroSplit(rawTitle);
  const plainText = `${head}${accent ? ` ${accent}` : ''}`.trim();
  const textTagline =
    tagline ??
    'A small set of useful image tools for the moments when "good enough" is not. Quick edits, kept close.';

  return (
    <section id="hero" className="relative scroll-anchor overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="cleaner-glow cleaner-glow-gold absolute -top-28 right-[-12%] h-96 w-96 sm:right-[0%] sm:h-[460px] sm:w-[460px] lg:right-[8%]" />
        <div className="cleaner-glow cleaner-glow-cyan absolute bottom-[-18%] left-[-10%] h-80 w-80 sm:h-[380px] sm:w-[380px]" />
      </div>
      <div className="relative mx-auto w-full max-w-6xl px-4 pb-10 pt-12 sm:px-8 sm:pb-14 sm:pt-20 lg:px-12">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:gap-10">
          <div className="cleaner-animate-in max-w-2xl">
            <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#62e4dc]">
              <span className="h-px w-7 bg-[#62e4dc]" /> Free image tools in your browser
            </div>
            <h1 className="max-w-[650px] text-4xl font-bold leading-[.98] tracking-[-.06em] text-[#f5f1e8] sm:text-6xl">
              {head}
              {accent && (
                <>
                  <br />
                  <span className="text-[#f0bd5b]">{accent}</span>
                </>
              )}
            </h1>
            <p className="mt-5 max-w-[520px] text-base leading-7 text-[#9eabad] sm:text-lg">{textTagline}</p>
            <p className="mt-3 max-w-[520px] text-sm leading-6 text-[#718082]">
              Ten focused tools — remove objects, crop, convert, compress, passport photos and more — with none of your files leaving this tab.
            </p>
            <div className="cleaner-animate-in cleaner-delay-1 mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => scrollToSection('tool')}
                className="rounded-xl bg-[#f0bd5b] px-5 py-2.5 text-sm font-bold text-[#171719] shadow-[0_5px_0_#9a7031] transition-all hover:-translate-y-0.5 hover:shadow-[0_7px_0_#9a7031] active:translate-y-0 active:shadow-[0_2px_0_#9a7031]"
              >
                Try it now
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('features')}
                className="rounded-xl border border-[#3b4a4e] px-5 py-2.5 text-sm font-semibold text-[#c6cfca] transition-colors hover:border-[#718082] hover:text-[#f5f1e8]"
              >
                Explore the tools
              </button>
            </div>
          </div>
          <div className="cleaner-animate-in cleaner-delay-1 relative">
            <HeroMockup />
          </div>
        </div>
        <div className="cleaner-animate-in cleaner-delay-2 mt-12 grid max-w-3xl gap-3 sm:grid-cols-3">
          {[
            { icon: LockKeyhole, title: 'Private by default', text: 'Files stay in memory.' },
            { icon: WandSparkles, title: 'Useful, not noisy', text: 'Ten focused tools.' },
            { icon: ShieldCheck, title: '15 MB included', text: 'JPG, PNG, WEBP.' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-center gap-3 rounded-xl border border-[#293337]/80 bg-[#151b1e]/60 px-4 py-3">
                <Icon size={16} className="shrink-0 text-[#f0bd5b]" />
                <span>
                  <span className="block text-xs font-semibold text-[#dce1da]">{item.title}</span>
                  <span className="block text-[11px] text-[#718082]">{item.text}</span>
                </span>
              </div>
            );
          })}
        </div>
        <p className="cleaner-animate-in cleaner-delay-3 mt-6 max-w-3xl text-xs leading-5 text-[#647477]">
          {plainText} — no sign-up, no upload queue, and no watermarks on your downloads.
        </p>
      </div>
    </section>
  );
}