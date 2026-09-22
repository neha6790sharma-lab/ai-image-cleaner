import {
  AppWindow,
  Check,
  Command,
  Eraser,
  LucideMaximize,
  MoveUpRight,
  ScanLine,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { SiteNavbar } from '@/components/site-navbar';
import { SiteFooter } from '@/components/site-footer';
import { useDevicePageMeta, useGoToTool } from '@/lib/device-pages';

const CYA = '#62e4dc';
const GOLD = '#f0bd5b';

const STATS = [
  { value: '0', suffix: 'MB', label: 'installed on your Mac' },
  { value: '10', suffix: '', label: 'focused editing tools' },
  { value: 'Free', suffix: '', label: 'with clean downloads' },
  { value: '10s', suffix: '', label: 'to your first edit' },
];

const HOW = [
  {
    title: 'Open in Safari or Chrome',
    text: 'No Mac App Store, no .dmg, no drag into Applications. type the address in Safari and the editor is there.',
  },
  {
    title: 'Load an image from your Mac',
    text: 'Drop a file onto the page or browse Photos, Downloads and Desktop. It opens locally in the tab.',
  },
  {
    title: 'Edit and export to your Mac',
    text: 'Crop, compress, convert or paint out an object, then download straight back to your MacBook.',
  },
];

function MacBookMockup() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div
        className="absolute -inset-10 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #62e4dc, transparent 65%)' }}
      />
      <div className="relative">
        <div className="relative overflow-hidden rounded-t-2xl border border-[#293337] bg-[#10161a] p-2 shadow-[0_30px_80px_-24px_rgba(0,0,0,.9)]">
          <div className="flex items-center justify-center py-1.5">
            <span className="h-1 w-24 rounded-full bg-[#0a0f12]" />
          </div>
          <div className="rounded-xl border border-[#252f33] bg-[#151b1e]">
            <div className="flex items-center gap-2 border-b border-[#252f33] px-4 py-2.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0d1518] text-[#9fe9e3]">
                <ScanLine size={10} />
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[.14em] text-[#647477]">
                cleaner · macOS edition
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 p-4">
              <div className="col-span-2 rounded-lg border border-[#62e4dc]/30 bg-[#62e4dc]/10 p-3">
                <div className="flex items-center gap-2">
                  <Eraser size={13} className="text-[#9fe9e3]" />
                  <span className="text-[11px] font-bold text-[#9fe9e3]">Remove Object</span>
                  <span className="ml-auto flex items-center gap-1 rounded bg-[#0d1518]/70 px-1.5 py-0.5 font-mono text-[9px] text-[#8f9da0]">
                    <Command size={9} /> ⌘
                  </span>
                </div>
                <div className="mt-2.5 h-10 rounded-md bg-[#0d1518]/60" />
              </div>
              <div className="rounded-lg border border-[#293337] bg-[#171d20] p-3">
                <Sparkles size={13} className="text-[#f0bd5b]" />
                <span className="mt-1.5 block text-[10px] font-semibold text-[#dce1da]">Adjust</span>
              </div>
              <div className="rounded-lg border border-[#293337] bg-[#171d20] p-3">
                <LucideMaximize size={13} className="text-[#62e4dc]" />
                <span className="mt-1.5 block text-[10px] font-semibold text-[#dce1da]">Crop</span>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-[#252f33] px-4 py-2.5">
              <span className="font-mono text-[9px] uppercase tracking-[.1em] text-[#8f9da0]">
                Export PNG · <span className="text-[#9fe9e3]">stays on your Mac</span>
              </span>
              <span className="rounded-md bg-[#62e4dc] px-2 py-0.5 text-[10px] font-bold text-[#102021]">
                Save
              </span>
            </div>
          </div>
        </div>
        <div className="mx-auto h-2.5 w-[112%] -translate-x-[5%] rounded-b-2xl bg-gradient-to-b from-[#223036] to-[#10161a]" />
        <span className="absolute -right-5 top-1/3 flex items-center gap-2 rounded-2xl border border-[#293337] bg-[#171d20] px-3 py-2 shadow-xl">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#62e4dc]/10 text-[#62e4dc]">
            <AppWindow size={14} strokeWidth={1.8} />
          </span>
          <span className="pr-1">
            <span className="block text-[11px] font-semibold leading-4 text-[#f5f1e8]">In Safari</span>
            <span className="block text-[10px] leading-3 text-[#718082]">no install needed</span>
          </span>
        </span>
      </div>
    </div>
  );
}

export default function MacBookPage() {
  const tryTool = useGoToTool();
  useDevicePageMeta({
    path: '/image-editor-for-macbook',
    title: 'Free Image Editor for MacBook — Safari & macOS Ready, No App Store | cleaner.',
    description:
      'Edit photos on your MacBook in Safari or Chrome — no Mac App Store download, macOS compatible. Crop, compress, remove objects and convert images for free.',
    operatingSystem: 'macOS',
  });

  return (
    <main className="cleaner-shell cleaner-noise min-h-[100dvh] text-[#f5f1e8]">
      <SiteNavbar />

      {/* Hero — cyan-led */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 90% 15%, rgba(98,228,220,.15), transparent 24rem), radial-gradient(circle at 5% 85%, rgba(240,189,91,.08), transparent 20rem)',
          }}
        />
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 pb-14 pt-12 sm:px-8 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:px-12">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#62e4dc]/30 bg-[#62e4dc]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[.18em] text-[#9fe9e3]">
              <AppWindow size={13} /> Image editor for MacBook
            </div>
            <h1 className="text-4xl font-bold leading-[1.02] tracking-[-.05em] sm:text-6xl">
              Built for MacBook &amp; Safari —{' '}
              <span className="text-[#62e4dc]">no Mac App Store needed.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#9eabad] sm:text-lg">
              cleaner. runs on macOS inside Safari or Chrome, just like any web page. That
              means edits on your MacBook start instantly, stay on the machine and never ask
              for an install.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={tryTool}
                className="rounded-xl bg-[#62e4dc] px-5 py-2.5 text-sm font-bold text-[#102021] shadow-[0_5px_0_#1e7d78] transition-all hover:-translate-y-0.5 hover:shadow-[0_7px_0_#1e7d78] active:translate-y-0 active:shadow-[0_2px_0_#1e7d78]"
              >
                Open the editor
              </button>
              <span className="flex items-center gap-2 text-xs text-[#718082]">
                <Check size={14} className="text-[#62e4dc]" /> macOS · Safari · Chrome · Free
              </span>
            </div>
          </div>
          <div className="cleaner-float">
            <MacBookMockup />
          </div>
        </div>
      </section>

      {/* Stats band — the first block after the hero */}
      <section className="border-y border-[#252f33] bg-[#10161a]/60">
        <div className="mx-auto grid w-full max-w-6xl gap-px overflow-hidden px-4 py-0 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-12">
          {STATS.map((stat) => (
            <div key={stat.label} className="border-b border-[#252f33] py-7 text-center last:border-b-0 sm:border-b-0">
              <p className="font-mono text-4xl font-bold tracking-[-.04em] text-[#62e4dc]">
                {stat.value}
                <span className="text-2xl text-[#4f9d98]">{stat.suffix}</span>
              </p>
              <p className="mt-2 text-xs text-[#8f9da0]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works — vertical steps */}
      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#62e4dc]">
              <span className="h-px w-7 bg-[#62e4dc]" /> How it works
            </div>
            <h2 className="text-3xl font-bold tracking-[-.04em]">
              On a MacBook, it is just a web page.
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#8f9da0]">
              Mac apps are powerful but heavy. cleaner. skips the whole install lane — the
              editor ships to Safari the moment the page loads, so nothing touches your SSD.
            </p>
            <button
              type="button"
              onClick={tryTool}
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#62e4dc]/40 px-5 py-2.5 text-sm font-semibold text-[#9fe9e3] transition-colors hover:bg-[#62e4dc]/10"
            >
              Jump to the editor <MoveUpRight size={14} />
            </button>
          </div>
          <div className="space-y-4">
            {HOW.map((step, index) => (
              <div key={step.title} className="flex gap-4 rounded-2xl border border-[#293337] bg-[#151b1e]/70 p-5">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold"
                  style={{
                    backgroundColor: index % 2 ? 'rgba(240,189,91,.12)' : 'rgba(98,228,220,.12)',
                    color: index % 2 ? GOLD : CYA,
                  }}
                >
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#f5f1e8]">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-[#8f9da0]">{step.text}</p>
                </div>
              </div>
            ))}
            <p className="flex items-center gap-2 px-1 text-xs text-[#647477]">
              <Check size={13} className="text-[#62e4dc]" /> Works on Apple Silicon and Intel
              MacBooks alike — it is a browser, not a binary.
            </p>
          </div>
        </div>
      </section>

      {/* macOS compatibility + tools */}
      <section className="cleaner-grid relative overflow-hidden border-t border-[#252f33]">
        <div className="relative mx-auto w-full max-w-6xl px-4 py-14 sm:px-8 lg:px-12">
          <div className="mb-9 max-w-2xl">
            <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#f0bd5b]">
              <span className="h-px w-7 bg-[#f0bd5b]" /> Right at home on macOS
            </div>
            <h2 className="text-3xl font-bold tracking-[-.04em]">
              Safari-native feel, ten practical tools.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#8f9da0]">
              Every editor runs in the browser, works with trackpad gestures and exports files
              your Mac opens naturally.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Eraser, title: 'Remove Object', note: 'Brush out distractions and refill the pixels.' },
              { icon: LucideMaximize, title: 'Crop', note: 'Trim photos to the frame you want.' },
              { icon: ScanLine, title: 'Passport Size', note: 'India, US, PAN and stamp presets.' },
              { icon: Sparkles, title: 'Adjust & Filters', note: 'Brightness, contrast, sepia, black & white.' },
              { icon: Check, title: 'Convert Format', note: 'JPG, PNG and WEBP both directions.' },
              { icon: AppWindow, title: 'Safari & Chrome', note: 'No extra browser needed — both work.' },
            ].map((card) => {
              const Icon: LucideIcon = card.icon;
              return (
                <div key={card.title} className="flex items-start gap-3 rounded-2xl border border-[#293337] bg-[#151b1e]/60 p-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f0bd5b]/10 text-[#f0bd5b]">
                    <Icon size={15} strokeWidth={1.8} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[#f5f1e8]">{card.title}</p>
                    <p className="mt-1 text-xs leading-5 text-[#8f9da0]">{card.note}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8 lg:px-12">
        <div className="relative overflow-hidden rounded-3xl border border-[#2a373b] bg-[#151b1e]/70 px-6 py-10 text-center sm:px-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(circle at 50% 0%, rgba(98,228,220,.14), transparent 20rem)' }}
          />
          <div className="relative">
            <Command size={26} className="mx-auto text-[#62e4dc]" />
            <h2 className="mt-4 text-3xl font-bold tracking-[-.04em]">
              Skip the download. Open Safari.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#8f9da0]">
              The full editor is one tab away on any MacBook — Apple Silicon or Intel, newest
              macOS or older. Free, private, and with nothing installed.
            </p>
            <button
              type="button"
              onClick={tryTool}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#62e4dc] px-6 py-3 text-sm font-bold text-[#102021] shadow-[0_5px_0_#1e7d78] transition-all hover:-translate-y-0.5 hover:shadow-[0_7px_0_#1e7d78] active:translate-y-0 active:shadow-[0_2px_0_#1e7d78]"
            >
              Start editing on your MacBook
            </button>
            <p className="mt-4 text-[11px] text-[#647477]">
              10 tools · works on any macOS version · no Mac App Store download
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}