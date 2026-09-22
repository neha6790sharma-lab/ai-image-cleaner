import {
  Check,
  Download,
  Monitor,
  ShieldCheck,
  Sparkles,
  X,
  type LucideIcon,
} from 'lucide-react';
import { SiteNavbar } from '@/components/site-navbar';
import { SiteFooter } from '@/components/site-footer';
import { TOOLS } from '@/lib/tools';
import { useDevicePageMeta, useGoToTool } from '@/lib/device-pages';

const CYA = '#62e4dc';
const GOLD = '#f0bd5b';

const BROWSERS = ['Microsoft Edge', 'Google Chrome', 'Mozilla Firefox'];

const COMPARISON: { label: string; cleaner: string; software: string }[] = [
  { label: 'Installation', cleaner: 'None — opens in a browser tab', software: 'Setup wizard, license & updates' },
  { label: 'Storage used', cleaner: '0 MB on your PC', software: 'Several GB of installed files' },
  { label: 'Works offline', cleaner: 'Core tools run locally', software: 'Yes, after install' },
  { label: 'Cloud storage', cleaner: 'None — images stay local', software: 'Often pushes cloud sync' },
  { label: 'Cost', cleaner: 'Free, no watermark', software: 'Trial or subscription' },
  { label: 'Learning curve', cleaner: 'Ten focused tools on one page', software: 'Dense toolbars & panels' },
];

function BrowserStrip() {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      {BROWSERS.map((browser) => (
        <span key={browser} className="flex items-center gap-2 text-sm font-semibold text-[#c6cfca]">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#62e4dc]/10 text-[#62e4dc]">
            <Check size={14} />
          </span>
          {browser}
        </span>
      ))}
    </div>
  );
}

export default function PcPage() {
  const tryTool = useGoToTool();
  useDevicePageMeta({
    path: '/image-editor-for-pc',
    title: 'Free Image Editor for PC on Windows — No Software Install | cleaner.',
    description:
      'Edit images on your Windows PC in Edge, Chrome or Firefox — no software install, no download. Crop, compress, remove objects and convert photos for free.',
    operatingSystem: 'Windows',
  });

  return (
    <main className="cleaner-shell cleaner-noise min-h-[100dvh] text-[#f5f1e8]">
      <SiteNavbar />

      {/* Hero — centered, balanced accents */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 0%, rgba(98,228,220,.13), transparent 24rem), radial-gradient(circle at 90% 40%, rgba(240,189,91,.1), transparent 22rem)',
          }}
        />
        <div className="relative mx-auto w-full max-w-4xl px-4 pb-12 pt-16 text-center sm:px-8 sm:pt-20">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#62e4dc]/30 bg-[#62e4dc]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[.18em] text-[#9fe9e3]">
            <Monitor size={13} /> Image editor for PC
          </div>
          <h1 className="text-4xl font-bold leading-[1.02] tracking-[-.05em] sm:text-6xl">
            Windows photo editing with{' '}
            <span className="text-[#62e4dc]">zero software to install</span>.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#9eabad] sm:text-lg">
            cleaner. runs in Edge, Chrome or Firefox — whichever browser is already on your PC.
            Open the page, drop in an image and crop, compress, convert or remove objects
            without a single installer, update or license key.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={tryTool}
              className="rounded-xl bg-[#f0bd5b] px-6 py-3 text-sm font-bold text-[#171719] shadow-[0_5px_0_#9a7031] transition-all hover:-translate-y-0.5 hover:shadow-[0_7px_0_#9a7031] active:translate-y-0 active:shadow-[0_2px_0_#9a7031]"
            >
              Open the editor
            </button>
            <span className="flex items-center gap-2 text-xs text-[#718082]">
              <Check size={14} className="text-[#62e4dc]" /> Free · Private · No watermark
            </span>
          </div>
          <div className="mt-10">
            <BrowserStrip />
          </div>
        </div>
      </section>

      {/* Comparison — browser editor vs installed software */}
      <section className="border-y border-[#252f33] bg-[#10161a]/50">
        <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-8 lg:px-12">
          <div className="mb-8 grid gap-4 md:grid-cols-[1fr_230px] md:items-end">
            <div>
              <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#62e4dc]">
                <span className="h-px w-7 bg-[#62e4dc]" /> Why switch to browser
              </div>
              <h2 className="text-3xl font-bold tracking-[-.04em]">
                lighter. easier. <span className="text-[#f0bd5b]">on your Windows PC.</span>
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#718082]">
              <ShieldCheck size={15} className="text-[#62e4dc]" /> Everything stays on your PC
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#293337]">
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1.15fr)] bg-[#151b1e]">
              <div className="px-4 py-3 font-mono text-[10px] uppercase tracking-[.14em] text-[#718082]">Field</div>
              <div className="border-l border-[#293337] bg-[#62e4dc]/5 px-4 py-3 font-mono text-[10px] uppercase tracking-[.14em] text-[#9fe9e3]">
                cleaner. in the browser
              </div>
              <div className="border-l border-[#293337] px-4 py-3 font-mono text-[10px] uppercase tracking-[.14em] text-[#8f9da0]">
                Installed software
              </div>
            </div>
            {COMPARISON.map((row) => (
              <div key={row.label} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1.15fr)] border-t border-[#293337] bg-[#10161a]/60">
                <div className="px-4 py-3.5 text-sm font-semibold text-[#c6cfca]">{row.label}</div>
                <div className="border-l border-[#293337] bg-[#62e4dc]/5 px-4 py-3.5 text-sm leading-5" style={{ color: CYA }}>
                  {row.cleaner}
                </div>
                <div className="flex items-center gap-2 border-l border-[#293337] px-4 py-3.5 text-sm leading-5 text-[#718082]">
                  <X size={13} className="shrink-0 text-[#647477]" />
                  {row.software}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Windows-ready tool grid */}
      <section className="cleaner-grid relative overflow-hidden">
        <div className="relative mx-auto w-full max-w-6xl px-4 py-14 sm:px-8 lg:px-12">
          <div className="mb-9 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#f0bd5b]">
            <span className="h-px w-7 bg-[#f0bd5b]" /> All ten tools, right-click friendly
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-[#293337] bg-[#293337] sm:grid-cols-2 lg:grid-cols-5">
            {TOOLS.map((tool) => {
              const Icon: LucideIcon = tool.icon;
              return (
                <div key={tool.id} className="group bg-[#151b1e] p-5 transition-colors hover:bg-[#171d20]">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: tool.accent === 'cyan' ? 'rgba(98,228,220,.1)' : 'rgba(240,189,91,.1)', color: tool.accent === 'cyan' ? CYA : GOLD }}
                  >
                    <Icon size={17} strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-4 text-sm font-bold text-[#f5f1e8]">{tool.label}</h3>
                  <p className="mt-1.5 text-xs leading-5 text-[#8f9da0]">{tool.description}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            {[
              'No installation',
              'Works in Edge, Chrome & Firefox',
              'Drag & drop to start',
              'Exports straight to Downloads',
            ].map((note) => (
              <span key={note} className="flex items-center gap-1.5 text-xs text-[#718082]">
                <Check size={13} style={{ color: GOLD }} /> {note}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8 lg:px-12">
        <div className="grid items-center gap-6 rounded-3xl border border-[#2a373b] bg-[#151b1e]/70 p-8 md:grid-cols-[1fr_auto] md:p-10">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.18em] text-[#62e4dc]">
              <Sparkles size={13} /> Free on every Windows browser
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-[-.04em]">
              Your PC already has everything it needs.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#8f9da0]">
              Open cleaner. in Edge, Chrome or Firefox and the ten tools are ready. No software,
              no storage footprint and no photo ever leaving your machine.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <button
              type="button"
              onClick={tryTool}
              className="inline-flex items-center gap-2 rounded-xl bg-[#f0bd5b] px-6 py-3 text-sm font-bold text-[#171719] shadow-[0_5px_0_#9a7031] transition-all hover:-translate-y-0.5 hover:shadow-[0_7px_0_#9a7031] active:translate-y-0 active:shadow-[0_2px_0_#9a7031]"
            >
              <Download size={16} /> Start editing on your PC
            </button>
            <span className="flex items-center gap-1.5 text-[11px] text-[#647477]">
              <Check size={12} className="text-[#62e4dc]" /> Nothing to install, ever
            </span>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}