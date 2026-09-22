import { ArrowRight, Check } from 'lucide-react';
import { TOOLS } from '@/lib/tools';
import type { Accent, CityConfig } from '@/lib/city-data';
import {
  GhostButton,
  PrimaryButton,
  SectionLabel,
  ToolChips,
  trustIcon,
} from '@/components/city/city-ui';

interface SectionProps {
  city: CityConfig;
  accent: Accent;
}

/* --------------------------------- Trust ---------------------------------- */

export function CityTrust({ city, accent }: SectionProps) {
  const style = city.trustStyle;

  if (style === 'strip') {
    return (
      <section className="border-t border-[#252f33] bg-[#121719]/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-8 lg:px-12">
          <div
            className="grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-3"
            style={{ borderColor: accent.borderSoft, backgroundColor: accent.borderSoft }}
          >
            {city.trust.map((point, index) => {
              const Icon = trustIcon(index);
              return (
                <div key={point.title} className="bg-[#12171a] p-6">
                  <Icon size={18} strokeWidth={1.8} style={{ color: accent.base }} />
                  <p className="mt-3 text-sm font-semibold text-[#f5f1e8]">{point.title}</p>
                  <p className="mt-1.5 text-xs leading-5 text-[#8f9da0]">{point.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  if (style === 'list') {
    return (
      <section className="border-t border-[#252f33]">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8 sm:py-16 lg:px-12">
          <SectionLabel accent={accent}>What you can count on</SectionLabel>
          <div className="grid gap-4 lg:grid-cols-3">
            {city.trust.map((point, index) => {
              const Icon = trustIcon(index);
              return (
                <div
                  key={point.title}
                  className="border-l-2 py-1 pl-5"
                  style={{ borderColor: accent.base }}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={16} strokeWidth={1.8} style={{ color: accent.base }} />
                    <p className="text-sm font-semibold text-[#f5f1e8]">{point.title}</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#8f9da0]">{point.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  if (style === 'stack') {
    return (
      <section className="border-t border-[#252f33] bg-[#121719]/40">
        <div className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-8 sm:py-16">
          <SectionLabel accent={accent}>The basics, kept simple</SectionLabel>
          <div className="space-y-3">
            {city.trust.map((point, index) => {
              const Icon = trustIcon(index);
              return (
                <div
                  key={point.title}
                  className="flex items-start gap-4 rounded-2xl border bg-[#151b1e]/70 px-5 py-4"
                  style={{ borderColor: accent.borderSoft }}
                >
                  <span
                    className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: accent.tint, color: accent.base }}
                  >
                    <Icon size={18} strokeWidth={1.8} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#f5f1e8]">{point.title}</p>
                    <p className="mt-1 text-sm leading-6 text-[#8f9da0]">{point.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-[#252f33]">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8 sm:py-16 lg:px-12">
        <SectionLabel accent={accent}>Why people keep it open</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-3">
          {city.trust.map((point, index) => {
            const Icon = trustIcon(index);
            return (
              <div
                key={point.title}
                className="rounded-2xl border bg-[#151b1e]/70 p-6"
                style={{ borderColor: accent.borderSoft }}
              >
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: accent.tint, color: accent.base }}
                >
                  <Icon size={19} strokeWidth={1.8} />
                </span>
                <p className="mt-4 text-sm font-semibold text-[#f5f1e8]">{point.title}</p>
                <p className="mt-2 text-sm leading-6 text-[#8f9da0]">{point.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- About ---------------------------------- */

export function CityAbout({ city, accent }: SectionProps) {
  const style = city.aboutStyle;

  if (style === 'centered') {
    return (
      <section className="border-t border-[#252f33] bg-[#121719]/40">
        <div className="mx-auto w-full max-w-3xl px-4 py-14 text-center sm:px-8 sm:py-16">
          <SectionLabel accent={accent} align="center">
            What cleaner. is
          </SectionLabel>
          <div className="space-y-4 text-base leading-7 text-[#9eabad]">
            {city.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-7 flex justify-center">
            <ToolChips accent={accent} />
          </div>
        </div>
      </section>
    );
  }

  if (style === 'aside') {
    return (
      <section className="border-t border-[#252f33]">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8 sm:py-16 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <SectionLabel accent={accent}>Inside the toolkit</SectionLabel>
              <p className="font-mono text-xs leading-5 text-[#647477]">
                Ten editors. One upload. Zero uploads to a server.
              </p>
            </div>
            <div>
              <div className="space-y-4 text-base leading-7 text-[#9eabad]">
                {city.about.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-7">
                <ToolChips accent={accent} />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (style === 'panel') {
    return (
      <section className="border-t border-[#252f33] bg-[#121719]/40">
        <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-8 sm:py-16">
          <div
            className="rounded-3xl border p-7 sm:p-10"
            style={{ borderColor: accent.borderSoft, backgroundColor: accent.tint2 }}
          >
            <SectionLabel accent={accent}>The tool, briefly</SectionLabel>
            <div className="space-y-4 text-base leading-7 text-[#9eabad]">
              {city.about.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-7">
              <ToolChips accent={accent} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-[#252f33]">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8 sm:py-16 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)] lg:items-start">
          <div>
            <SectionLabel accent={accent}>What this page does</SectionLabel>
            <div className="space-y-4 text-base leading-7 text-[#9eabad]">
              {city.about.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border bg-[#151b1e]/70 p-6" style={{ borderColor: accent.borderSoft }}>
            <p className="font-mono text-[10px] uppercase tracking-[.18em]" style={{ color: accent.base }}>
              Ten tools included
            </p>
            <ul className="mt-4 space-y-2.5">
              {TOOLS.map((tool) => (
                <li key={tool.id} className="flex items-center gap-2 text-[13px] text-[#9eabad]">
                  <Check size={13} strokeWidth={2.4} style={{ color: accent.base }} />
                  {tool.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Use cases -------------------------------- */

export function CityUses({ city, accent }: SectionProps) {
  const style = city.usesStyle;

  if (style === 'list') {
    return (
      <section className="border-t border-[#252f33] bg-[#121719]/40">
        <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-8 sm:py-16">
          <SectionLabel accent={accent}>Common jobs in {city.name}</SectionLabel>
          <div className="divide-y divide-[#252f33]">
            {city.useCases.map((item, index) => (
              <div key={item.title} className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-6">
                <span className="font-mono text-xs" style={{ color: accent.base }}>
                  0{index + 1}
                </span>
                <p className="text-base font-semibold text-[#f5f1e8] sm:w-64">{item.title}</p>
                <p className="text-sm leading-6 text-[#8f9da0]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (style === 'numbered') {
    return (
      <section className="border-t border-[#252f33]">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8 sm:py-16 lg:px-12">
          <SectionLabel accent={accent}>Where it helps around {city.name}</SectionLabel>
          <div className="grid gap-8 sm:grid-cols-3">
            {city.useCases.map((item, index) => (
              <div key={item.title}>
                <span className="block text-4xl font-bold tracking-[-.04em]" style={{ color: accent.base }}>
                  {index + 1}
                </span>
                <p className="mt-3 text-base font-semibold text-[#f5f1e8]">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-[#8f9da0]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (style === 'pills') {
    return (
      <section className="border-t border-[#252f33] bg-[#121719]/40">
        <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-8 sm:py-16">
          <SectionLabel accent={accent}>Everyday uses</SectionLabel>
          <div className="flex flex-wrap gap-3">
            {city.useCases.map((item) => (
              <div
                key={item.title}
                className="max-w-md flex-1 rounded-full border px-5 py-4"
                style={{ borderColor: accent.borderSoft, backgroundColor: accent.tint2 }}
              >
                <p className="text-sm font-semibold text-[#f5f1e8]">{item.title}</p>
                <p className="mt-1 text-xs leading-5 text-[#8f9da0]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-[#252f33]">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8 sm:py-16 lg:px-12">
        <SectionLabel accent={accent}>How {city.name} uses it</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-3">
          {city.useCases.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border p-6"
              style={{ borderColor: accent.borderSoft, backgroundColor: accent.tint2 }}
            >
              <p className="text-base font-semibold text-[#f5f1e8]">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-[#8f9da0]">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- CTA ----------------------------------- */

export function CityCta({
  city,
  accent,
  onTryTool,
  onExplore,
}: SectionProps & { onTryTool: () => void; onExplore: () => void }) {
  const style = city.ctaStyle;

  if (style === 'bar') {
    return (
      <section className="border-t border-[#252f33]">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-8 lg:px-12">
          <div
            className="flex flex-col gap-5 rounded-2xl border px-6 py-7 sm:flex-row sm:items-center sm:justify-between"
            style={{ borderColor: accent.borderSoft, backgroundColor: accent.tint2 }}
          >
            <div>
              <p className="text-lg font-bold tracking-[-.02em] text-[#f5f1e8]">{city.ctaHeading}</p>
              <p className="mt-1 max-w-xl text-sm leading-6 text-[#8f9da0]">{city.ctaBody}</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <PrimaryButton accent={accent} onClick={onTryTool} className="inline-flex items-center gap-2">
                Try the tool <ArrowRight size={15} />
              </PrimaryButton>
              <GhostButton accent={accent} onClick={onExplore}>
                Explore tools
              </GhostButton>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (style === 'card') {
    return (
      <section className="border-t border-[#252f33] bg-[#121719]/40">
        <div className="mx-auto w-full max-w-3xl px-4 py-14 text-center sm:px-8 sm:py-16">
          <div
            className="rounded-3xl border px-6 py-10 sm:px-10"
            style={{ borderColor: accent.borderSoft, backgroundColor: accent.tint2 }}
          >
            <h2 className="text-2xl font-bold tracking-[-.04em] text-[#f5f1e8] sm:text-3xl">{city.ctaHeading}</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#8f9da0]">{city.ctaBody}</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <PrimaryButton accent={accent} onClick={onTryTool} className="inline-flex items-center gap-2">
                Open the editor <ArrowRight size={15} />
              </PrimaryButton>
              <GhostButton accent={accent} onClick={onExplore}>
                See all ten tools
              </GhostButton>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (style === 'split') {
    return (
      <section className="border-t border-[#252f33]">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8 sm:py-16 lg:px-12">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-[-.04em] text-[#f5f1e8] sm:text-3xl">{city.ctaHeading}</h2>
              <p className="mt-3 text-sm leading-6 text-[#8f9da0]">{city.ctaBody}</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <PrimaryButton accent={accent} onClick={onTryTool} className="inline-flex items-center gap-2">
                Try the tool <ArrowRight size={15} />
              </PrimaryButton>
              <GhostButton accent={accent} onClick={onExplore}>
                Explore tools
              </GhostButton>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-[#252f33] bg-[#121719]/40">
      <div className="mx-auto w-full max-w-3xl px-4 py-14 text-center sm:px-8 sm:py-16">
        <p className="text-lg font-semibold text-[#f5f1e8]">{city.ctaHeading}</p>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#8f9da0]">{city.ctaBody}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={onTryTool}
            className="inline-flex items-center gap-2 text-sm font-bold underline decoration-2 underline-offset-4"
            style={{ color: accent.base, textDecorationColor: accent.base }}
          >
            Try the tool <ArrowRight size={15} />
          </button>
          <button
            type="button"
            onClick={onExplore}
            className="text-sm font-semibold text-[#9eabad] underline decoration-2 underline-offset-4 decoration-[#3a4448] transition-colors hover:text-[#f5f1e8]"
          >
            Explore tools
          </button>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Closing -------------------------------- */

export function CityClosing({ city, accent }: SectionProps) {
  return (
    <section className="border-t" style={{ borderColor: accent.borderSoft }}>
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-2 px-4 py-8 text-center sm:px-8">
        <p className="text-sm font-medium text-[#c6cfca]">{city.closing}</p>
        <p className="font-mono text-[10px] uppercase tracking-[.18em]" style={{ color: accent.base }}>
          Private · Free · No account
        </p>
      </div>
    </section>
  );
}
