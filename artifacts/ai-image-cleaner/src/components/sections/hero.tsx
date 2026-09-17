import { LockKeyhole, ShieldCheck, WandSparkles } from 'lucide-react';
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
    <section id="hero" className="scroll-anchor">
      <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-12 sm:px-8 sm:pb-14 sm:pt-20 lg:px-12">
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
          <div className="mt-7 flex flex-wrap items-center gap-3">
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
        <div className="cleaner-animate-in cleaner-delay-1 mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
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
        <p className="mt-6 max-w-3xl text-xs leading-5 text-[#647477]">
          {plainText} — no sign-up, no upload queue, and no watermarks on your downloads.
        </p>
      </div>
    </section>
  );
}