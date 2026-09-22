import { ArrowRight, Check, EyeOff, Sparkles } from 'lucide-react';
import type { Accent, CityConfig } from '@/lib/city-data';
import { CityDecor, GhostButton, PrimaryButton } from '@/components/city/city-ui';

interface HeroProps {
  city: CityConfig;
  accent: Accent;
  onTryTool: () => void;
  onExplore: () => void;
}

function Actions({
  accent,
  onTryTool,
  onExplore,
  align = 'left',
}: {
  accent: Accent;
  onTryTool: () => void;
  onExplore: () => void;
  align?: 'left' | 'center';
}) {
  return (
    <div
      className={`flex flex-wrap items-center gap-3 ${
        align === 'center' ? 'justify-center' : ''
      }`}
    >
      <PrimaryButton accent={accent} onClick={onTryTool} className="inline-flex items-center gap-2">
        Try the tool <ArrowRight size={15} />
      </PrimaryButton>
      <GhostButton accent={accent} onClick={onExplore}>
        See all ten tools
      </GhostButton>
    </div>
  );
}

function Eyebrow({ accent, children }: { accent: Accent; children: string }) {
  return (
    <div
      className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em]"
      style={{ color: accent.base }}
    >
      <span className="h-px w-7" style={{ backgroundColor: accent.base }} />
      {children}
    </div>
  );
}

function ChipRow({ accent }: { accent: Accent }) {
  const items = ['Private', 'Free', 'No account'];
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium text-[#bcc7c4]"
          style={{ borderColor: accent.borderSoft, backgroundColor: accent.tint2 }}
        >
          <Check size={12} strokeWidth={2.4} style={{ color: accent.base }} />
          {item}
        </span>
      ))}
    </div>
  );
}

/* ------------------------------- 1. Spotlight ------------------------------ */

function SpotlightHero({ city, accent, onTryTool, onExplore }: HeroProps) {
  return (
    <section className="relative scroll-anchor overflow-hidden">
      <CityDecor variant={city.decor} accent={accent} />
      <div className="relative mx-auto w-full max-w-4xl px-4 pb-14 pt-16 text-center sm:px-8 sm:pt-24">
        <div className="mb-4 flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[.2em]" style={{ color: accent.base }}>
          <span className="h-px w-7" style={{ backgroundColor: accent.base }} />
          {city.eyebrow}
          <span className="h-px w-7" style={{ backgroundColor: accent.base }} />
        </div>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-[1.02] tracking-[-.055em] text-[#f5f1e8] sm:text-6xl">
          {city.headlineLead}{' '}
          <span style={{ color: accent.base }}>{city.headlineAccent}</span>
        </h1>
        <div className="mx-auto mt-6 max-w-2xl space-y-4 text-base leading-7 text-[#9eabad]">
          {city.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Actions accent={accent} onTryTool={onTryTool} onExplore={onExplore} align="center" />
        </div>
        <div className="mt-8 flex justify-center">
          <ChipRow accent={accent} />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- 2. Editorial ------------------------------ */

function EditorialHero({ city, accent, onTryTool, onExplore }: HeroProps) {
  return (
    <section className="relative scroll-anchor overflow-hidden">
      <CityDecor variant={city.decor} accent={accent} />
      <div className="relative mx-auto w-full max-w-6xl px-4 pb-14 pt-14 sm:px-8 sm:pt-20 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start">
          <div>
            <Eyebrow accent={accent}>{city.eyebrow}</Eyebrow>
            <h1 className="max-w-[620px] text-4xl font-bold leading-[1.03] tracking-[-.055em] text-[#f5f1e8] sm:text-5xl">
              {city.headlineLead}{' '}
              <span className="underline decoration-2 underline-offset-8" style={{ color: accent.base, textDecorationColor: accent.base }}>
                {city.headlineAccent}
              </span>
            </h1>
            <div className="mt-6 grid gap-4 text-base leading-7 text-[#9eabad] sm:grid-cols-2">
              {city.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-8">
              <Actions accent={accent} onTryTool={onTryTool} onExplore={onExplore} />
            </div>
          </div>
          <aside
            className="rounded-2xl border p-6 lg:mt-2"
            style={{ borderColor: accent.borderSoft, backgroundColor: accent.tint2 }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[.2em]" style={{ color: accent.base }}>
              At a glance
            </p>
            <ul className="mt-4 space-y-4">
              {city.useCases.map((item, index) => (
                <li key={item.title} className="flex gap-3">
                  <span
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg font-mono text-[11px] font-bold"
                    style={{ backgroundColor: accent.tint, color: accent.base }}
                  >
                    {index + 1}
                  </span>
                  <span className="text-sm leading-6 text-[#c6cfca]">{item.title}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t pt-5" style={{ borderColor: accent.borderSoft }}>
              <button
                type="button"
                onClick={onTryTool}
                className="inline-flex items-center gap-2 text-sm font-bold"
                style={{ color: accent.base }}
              >
                Open the editor <ArrowRight size={15} />
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- 3. Banner -------------------------------- */

function BannerHero({ city, accent, onTryTool, onExplore }: HeroProps) {
  return (
    <section className="relative scroll-anchor overflow-hidden">
      <CityDecor variant={city.decor} accent={accent} />
      <div className="relative mx-auto w-full max-w-5xl px-4 pb-14 pt-14 sm:px-8 sm:pt-20">
        <div
          className="overflow-hidden rounded-3xl border"
          style={{
            borderColor: accent.borderSoft,
            background: `linear-gradient(140deg, ${accent.tint} 0%, rgba(16,22,26,0.6) 55%, rgba(16,22,26,0.9) 100%)`,
          }}
        >
          <div className="px-6 py-12 text-center sm:px-12 sm:py-16">
            <div className="mb-4 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[.28em]" style={{ color: accent.base }}>
              <Sparkles size={13} />
              {city.eyebrow}
            </div>
            <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-[1.02] tracking-[-.055em] text-[#f5f1e8] sm:text-6xl">
              {city.headlineLead} <span style={{ color: accent.base }}>{city.headlineAccent}</span>
            </h1>
            <div className="mx-auto mt-6 max-w-2xl space-y-4 text-base leading-7 text-[#b6c0bd]">
              {city.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <Actions accent={accent} onTryTool={onTryTool} onExplore={onExplore} align="center" />
            </div>
          </div>
          <div className="grid divide-y border-t sm:grid-cols-3 sm:divide-x sm:divide-y-0" style={{ borderColor: accent.borderSoft }}>
            {[
              { label: 'Ten focused tools', value: '01' },
              { label: 'Up to 15 MB per image', value: '02' },
              { label: 'No account, no cloud', value: '03' },
            ].map((cell) => (
              <div key={cell.label} className="px-6 py-5 text-center">
                <p className="font-mono text-lg font-bold" style={{ color: accent.base }}>{cell.value}</p>
                <p className="mt-1 text-xs uppercase tracking-[.14em] text-[#8f9da0]">{cell.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- 4. Split -------------------------------- */

function SplitHero({ city, accent, onTryTool, onExplore }: HeroProps) {
  return (
    <section className="relative scroll-anchor overflow-hidden">
      <CityDecor variant={city.decor} accent={accent} />
      <div className="relative mx-auto w-full max-w-6xl px-4 pb-14 pt-12 sm:px-8 sm:pt-16 lg:px-12">
        <div className="grid overflow-hidden rounded-3xl border lg:grid-cols-2" style={{ borderColor: accent.borderSoft }}>
          <div className="bg-[#10161a]/80 px-6 py-12 sm:px-10 sm:py-14">
            <Eyebrow accent={accent}>{city.eyebrow}</Eyebrow>
            <h1 className="text-4xl font-bold leading-[1.03] tracking-[-.055em] text-[#f5f1e8] sm:text-5xl">
              {city.headlineLead} <span style={{ color: accent.base }}>{city.headlineAccent}</span>
            </h1>
            <div className="mt-6 space-y-4 text-base leading-7 text-[#9eabad]">
              {city.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-8">
              <Actions accent={accent} onTryTool={onTryTool} onExplore={onExplore} />
            </div>
          </div>
          <div
            className="relative min-h-[280px] overflow-hidden"
            style={{ background: `linear-gradient(160deg, ${accent.tint} 0%, rgba(13,18,22,0.9) 100%)` }}
          >
            <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <defs>
                <linearGradient id={`split-${city.slug}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor={accent.base} stopOpacity="0.85" />
                  <stop offset="1" stopColor={accent.soft} stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <circle cx="300" cy="90" r="120" fill={`url(#split-${city.slug})`} opacity="0.35" />
              <path d="M0 300 Q 110 220 200 300 T 400 300 L 400 400 L 0 400 Z" fill={accent.tint} />
              <rect x="70" y="150" width="150" height="110" rx="16" fill="#12181c" stroke={accent.borderSoft} />
              <rect x="88" y="170" width="70" height="8" rx="4" fill={accent.base} opacity="0.7" />
              <rect x="88" y="188" width="114" height="8" rx="4" fill="#3a4448" />
              <rect x="88" y="206" width="96" height="8" rx="4" fill="#3a4448" />
            </svg>
            <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-xl border bg-[#12181c]/90 px-3 py-2" style={{ borderColor: accent.borderSoft }}>
              <EyeOff size={15} style={{ color: accent.base }} />
              <span className="text-[11px] leading-4 text-[#c6cfca]">
                Nothing uploaded
                <span className="block text-[10px] text-[#718082]">stays in your tab</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ 5. Asymmetric ------------------------------ */

function AsymmetricHero({ city, accent, onTryTool, onExplore }: HeroProps) {
  return (
    <section className="relative scroll-anchor overflow-hidden">
      <CityDecor variant={city.decor} accent={accent} />
      <div className="relative mx-auto w-full max-w-6xl px-4 pb-14 pt-14 sm:px-8 sm:pt-20 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="hidden lg:col-span-1 lg:flex lg:justify-center">
            <span
              className="h-fit font-mono text-[10px] uppercase tracking-[.3em] text-[#718082]"
              style={{ writingMode: 'vertical-rl' }}
            >
              {city.name} · cleaner.
            </span>
          </div>
          <div className="lg:col-span-7">
            <SectionEyebrow accent={accent} text={city.eyebrow} />
            <h1 className="text-4xl font-bold leading-[1.02] tracking-[-.055em] text-[#f5f1e8] sm:text-6xl">
              {city.headlineLead}
              <span className="block" style={{ color: accent.base }}>{city.headlineAccent}</span>
            </h1>
          </div>
          <div className="lg:col-span-8 lg:col-start-5">
            <div className="border-l-2 pl-5" style={{ borderColor: accent.borderSoft }}>
              <div className="space-y-4 text-base leading-7 text-[#9eabad]">
                {city.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-7">
                <Actions accent={accent} onTryTool={onTryTool} onExplore={onExplore} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionEyebrow({ accent, text }: { accent: Accent; text: string }) {
  return (
    <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em]" style={{ color: accent.base }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent.base }} />
      {text}
    </div>
  );
}

/* -------------------------------- 6. Mosaic -------------------------------- */

function MosaicHero({ city, accent, onTryTool, onExplore }: HeroProps) {
  const tiles = Array.from({ length: 12 });
  return (
    <section className="relative scroll-anchor overflow-hidden">
      <CityDecor variant={city.decor} accent={accent} />
      <div className="relative mx-auto w-full max-w-6xl px-4 pb-14 pt-14 sm:px-8 sm:pt-20 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_190px]">
          <div
            className="rounded-3xl border bg-[#10161a]/85 p-7 backdrop-blur-sm sm:p-10"
            style={{ borderColor: accent.borderSoft }}
          >
            <Eyebrow accent={accent}>{city.eyebrow}</Eyebrow>
            <h1 className="max-w-2xl text-4xl font-bold leading-[1.03] tracking-[-.055em] text-[#f5f1e8] sm:text-5xl">
              {city.headlineLead} <span style={{ color: accent.base }}>{city.headlineAccent}</span>
            </h1>
            <div className="mt-6 max-w-2xl space-y-4 text-base leading-7 text-[#9eabad]">
              {city.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-8">
              <Actions accent={accent} onTryTool={onTryTool} onExplore={onExplore} />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 lg:grid-cols-2">
            {tiles.map((_, index) => (
              <span
                key={index}
                className="aspect-square rounded-xl border"
                style={{
                  borderColor: index % 3 === 0 ? accent.border : accent.tint2,
                  backgroundColor: index % 4 === 0 ? accent.tint : 'transparent',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- 7. Terminal ------------------------------- */

function TerminalHero({ city, accent, onTryTool, onExplore }: HeroProps) {
  return (
    <section className="relative scroll-anchor overflow-hidden">
      <CityDecor variant={city.decor} accent={accent} />
      <div className="relative mx-auto w-full max-w-5xl px-4 pb-14 pt-14 sm:px-8 sm:pt-20">
        <div className="overflow-hidden rounded-2xl border border-[#2a3539] bg-[#0f1417]/95 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
          <div className="flex items-center gap-2 border-b border-[#252f33] px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#f1837c]" />
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: accent.base }} />
            <span className="h-2.5 w-2.5 rounded-full bg-[#62e4dc]" />
            <span className="ml-2 font-mono text-[10px] uppercase tracking-[.16em] text-[#647477]">
              cleaner://{city.slug}
            </span>
          </div>
          <div className="px-5 py-10 sm:px-10 sm:py-12">
            <p className="font-mono text-xs" style={{ color: accent.base }}>
              $ cleaner --city {city.slug}
            </p>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-[-.04em] text-[#f5f1e8] sm:text-5xl">
              {city.headlineLead} <span style={{ color: accent.base }}>{city.headlineAccent}</span>
            </h1>
            <div className="mt-6 space-y-3 font-mono text-sm leading-6 text-[#8f9da0]">
              {city.intro.map((paragraph) => (
                <p key={paragraph}>
                  <span style={{ color: accent.base }}>&gt;</span> {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-8">
              <Actions accent={accent} onTryTool={onTryTool} onExplore={onExplore} />
            </div>
          </div>
        </div>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[.18em] text-[#506064]">
          {city.eyebrow}
        </p>
      </div>
    </section>
  );
}

/* ------------------------------- 8. Magazine ------------------------------- */

function MagazineHero({ city, accent, onTryTool, onExplore }: HeroProps) {
  return (
    <section className="relative scroll-anchor overflow-hidden">
      <CityDecor variant={city.decor} accent={accent} />
      <div className="relative mx-auto w-full max-w-5xl px-4 pb-14 pt-14 sm:px-8 sm:pt-20">
        <div className="flex items-center justify-between gap-4 border-b pb-3" style={{ borderColor: accent.borderSoft }}>
          <span className="font-mono text-[10px] uppercase tracking-[.24em]" style={{ color: accent.base }}>
            {city.eyebrow}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[.18em] text-[#647477]">
            Haryana edition
          </span>
        </div>
        <h1 className="mt-8 text-5xl font-bold leading-[.98] tracking-[-.06em] text-[#f5f1e8] sm:text-7xl">
          {city.headlineLead} <span style={{ color: accent.base }}>{city.headlineAccent}</span>
        </h1>
        <div className="mt-8 flex flex-wrap items-center gap-4 border-y py-3 font-mono text-[10px] uppercase tracking-[.16em] text-[#718082]" style={{ borderColor: accent.borderSoft }}>
          <span>Private image utility</span>
          <span style={{ color: accent.base }}>•</span>
          <span>10 tools</span>
          <span style={{ color: accent.base }}>•</span>
          <span>No account</span>
        </div>
        <div className="mt-8 gap-8 text-base leading-7 text-[#9eabad] sm:columns-2">
          {city.intro.map((paragraph, index) => (
            <p key={paragraph} className={index === 0 ? '' : 'mt-4'}>
              {index === 0 ? (
                <>
                  <span className="float-left mr-2 text-5xl font-bold leading-[.8]" style={{ color: accent.base }}>
                    {paragraph.charAt(0)}
                  </span>
                  {paragraph.slice(1)}
                </>
              ) : (
                paragraph
              )}
            </p>
          ))}
        </div>
        <div className="mt-8">
          <Actions accent={accent} onTryTool={onTryTool} onExplore={onExplore} />
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Switch --------------------------------- */

export function CityHero(props: HeroProps) {
  switch (props.city.hero) {
    case 'spotlight':
      return <SpotlightHero {...props} />;
    case 'editorial':
      return <EditorialHero {...props} />;
    case 'banner':
      return <BannerHero {...props} />;
    case 'split':
      return <SplitHero {...props} />;
    case 'asymmetric':
      return <AsymmetricHero {...props} />;
    case 'mosaic':
      return <MosaicHero {...props} />;
    case 'terminal':
      return <TerminalHero {...props} />;
    case 'magazine':
      return <MagazineHero {...props} />;
    default:
      return <SpotlightHero {...props} />;
  }
}
