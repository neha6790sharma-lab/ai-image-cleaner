import {
  BadgeCheck,
  Check,
  Globe,
  LockKeyhole,
  ScanLine,
  Smartphone,
  Sparkles,
  Type,
  type LucideIcon,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { SiteNavbar } from '@/components/site-navbar';
import { SiteFooter } from '@/components/site-footer';
import { useDevicePageMeta, useGoToTool } from '@/lib/device-pages';

const GOLD = '#f0bd5b';

const FAQ = [
  {
    q: 'Does this work on my iPhone without an app?',
    a: 'Yes. cleaner. is a website, not an app, so there is nothing to download from the App Store. Open it in Safari or Chrome and the editor loads instantly in the tab.',
  },
  {
    q: 'Which iOS versions are supported?',
    a: 'Because it runs in a normal browser tab, it works across current and older iOS versions alike. If your iPhone can open Safari or Chrome, it can run cleaner.',
  },
  {
    q: 'Can I pick photos from my camera roll?',
    a: 'Yes. Tap upload and choose an image from your library, or take a fresh photo and edit it in the same session.',
  },
  {
    q: 'Are my photos stored on iCloud or any server?',
    a: 'No. Editing happens on your device in the browser. Nothing is uploaded to a cloud drive, and closing the tab leaves no copy behind.',
  },
  {
    q: 'Will downloading result in watermarks?',
    a: 'Never. Downloads come out clean on every iPhone, and all ten tools are free with no locked export.',
  },
];

function ToolmRow({ icon: Icon, label, note }: { icon: LucideIcon; label: string; note: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#2a373b] bg-[#151b1e]/70 px-4 py-3.5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f0bd5b]/10 text-[#f0bd5b]">
        <Icon size={17} strokeWidth={1.8} />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-bold text-[#f5f1e8]">{label}</p>
        <p className="truncate text-xs text-[#718082]">{note}</p>
      </div>
    </div>
  );
}

function SafariMockup() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div
        className="absolute -inset-10 rounded-full opacity-25 blur-3xl"
        style={{ background: 'radial-gradient(circle, #f0bd5b, transparent 65%)' }}
      />
      <div className="relative overflow-hidden rounded-3xl border border-[#2a373b] bg-[#10161a] shadow-[0_30px_80px_-24px_rgba(0,0,0,.9)]">
        <div className="flex items-center gap-2 border-b border-[#252f33] px-4 py-3">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#f1837c]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#f0bd5b]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#62e4dc]" />
          </span>
          <span className="ml-2 flex flex-1 items-center gap-2 rounded-lg border border-[#293337] bg-[#171d20] px-3 py-1.5">
            <LockKeyhole size={11} className="text-[#718082]" />
            <span className="truncate font-mono text-[9px] uppercase tracking-[.08em] text-[#8f9da0]">
              cleaner · private image editor
            </span>
          </span>
          <span className="font-mono text-[9px] text-[#f0bd5b]">Safari</span>
        </div>
        <div className="space-y-3 p-5">
          <div className="rounded-xl border border-[#f0bd5b]/25 bg-[#f0bd5b]/10 p-3">
            <div className="flex items-center gap-2">
              <ScanLine size={14} className="text-[#f0bd5b]" />
              <span className="text-xs font-bold text-[#f6d38f]">Passport Size</span>
            </div>
            <div className="mt-2 flex items-center justify-between rounded-lg bg-[#0d1518]/80 px-3 py-2">
              <span className="text-[10px] text-[#8f9da0]">India · Passport preset</span>
              <span className="rounded-md bg-[#f0bd5b] px-2 py-0.5 text-[10px] font-bold text-[#171719]">
                JPG
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ToolmRow icon={Sparkles} label="Adjust" note="Brightness & filters" />
            <ToolmRow icon={Type} label="Watermark" note="Add your text" />
            <ToolmRow icon={Globe} label="Convert" note="JPG · PNG · WEBP" />
            <ToolmRow icon={Sparkles} label="Compress" note="Smaller files" />
          </div>
          <div className="flex items-center justify-between rounded-xl bg-[#f0bd5b] px-4 py-2.5">
            <span className="text-xs font-bold text-[#171719]">Export & save to Photos</span>
            <Check size={14} className="text-[#171719]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function IphonePage() {
  const tryTool = useGoToTool();
  useDevicePageMeta({
    path: '/image-editor-for-iphone',
    title: 'Free Image Editor for iPhone — No App Store, Works in Safari & Chrome | cleaner.',
    description:
      'Edit photos on iPhone in Safari or Chrome — no App Store download, works on any iOS version. Crop, compress, remove objects and make passport photos for free.',
    operatingSystem: 'iOS',
  });

  return (
    <main className="cleaner-shell cleaner-noise min-h-[100dvh] text-[#f5f1e8]">
      <SiteNavbar />

      {/* Hero — gold-led, Safari window mockup */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 80% 10%, rgba(240,189,91,.16), transparent 26rem), radial-gradient(circle at 5% 90%, rgba(98,228,220,.08), transparent 20rem)',
          }}
        />
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 pb-14 pt-12 sm:px-8 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:px-12">
          <div className="order-2 lg:order-1">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#f0bd5b]/35 bg-[#f0bd5b]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[.18em] text-[#f6d38f]">
              <Smartphone size={13} /> Image editor for iPhone
            </div>
            <h1 className="text-4xl font-bold leading-[1.02] tracking-[-.05em] sm:text-6xl">
              Edit on iPhone in Safari or Chrome —{' '}
              <span className="text-[#f0bd5b]">no App Store needed.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#9eabad] sm:text-lg">
              cleaner. lives in the browser, so your iPhone never needs another download.
              Open it in Safari or Chrome, pick a photo from your library and edit — whether
              your iPhone runs the latest iOS or an older version.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={tryTool}
                className="rounded-xl bg-[#f0bd5b] px-5 py-2.5 text-sm font-bold text-[#171719] shadow-[0_5px_0_#9a7031] transition-all hover:-translate-y-0.5 hover:shadow-[0_7px_0_#9a7031] active:translate-y-0 active:shadow-[0_2px_0_#9a7031]"
              >
                Open the editor
              </button>
              <span className="flex items-center gap-2 text-xs text-[#718082]">
                <Check size={14} className="text-[#f0bd5b]" /> Free · No account · No watermark
              </span>
            </div>
          </div>
          <div className="cleaner-float order-1 lg:order-2">
            <SafariMockup />
          </div>
        </div>
      </section>

      {/* FAQ — this page leads with the questions */}
      <section className="border-y border-[#252f33] bg-[#10161a]/50">
        <div className="mx-auto grid w-full max-w-6xl items-start gap-10 px-4 py-14 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:px-12">
          <div className="lg:sticky lg:top-24">
            <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#f0bd5b]">
              <span className="h-px w-7 bg-[#f0bd5b]" /> The questions that matter
            </div>
            <h2 className="text-3xl font-bold tracking-[-.04em]">
              Everything about running the editor on an iPhone.
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#8f9da0]">
              No store download, no supported-device list, no iOS minimum. If your iPhone
              browses, it edits.
            </p>
            <div className="mt-6 space-y-3">
              {[
                ['Works in', 'Safari + Chrome'],
                ['Install', 'None — it is a website'],
                ['Photos', 'Pick from your library'],
                ['Result format', 'JPG, PNG or WEBP'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between border-b border-[#293337] pb-2 text-sm">
                  <span className="text-[#718082]">{k}</span>
                  <span className="font-semibold text-[#dce1da]">{v}</span>
                </div>
              ))}
            </div>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {FAQ.map((item) => (
              <AccordionItem key={item.q} value={item.q} className="border-[#293337]">
                <AccordionTrigger className="text-sm font-semibold text-[#dce1da]">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-6 text-[#8f9da0]">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Compatibility & trust */}
      <section className="cleaner-grid relative overflow-hidden">
        <div className="relative mx-auto w-full max-w-6xl px-4 py-14 sm:px-8 lg:px-12">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Globe, title: 'Any iOS version', text: 'Runs in the browser tab, so there is no iOS minimum and no supported-device list.' },
              { icon: Smartphone, title: 'Safari-first', text: 'Feels at home in Safari with the same share-to-photos flow you already know.' },
              { icon: LockKeyhole, title: 'Nothing uploaded', text: 'Edits happen on the iPhone itself and close with the tab — no iCloud copy.' },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="rounded-2xl border border-[#293337] bg-[#151b1e]/70 p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f0bd5b]/10 text-[#f0bd5b]">
                    <Icon size={19} strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-[#f5f1e8]">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#8f9da0]">{card.text}</p>
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
            style={{ background: 'radial-gradient(circle at 50% 0%, rgba(240,189,91,.14), transparent 20rem)' }}
          />
          <div className="relative">
            <BadgeCheck size={26} className="mx-auto text-[#f0bd5b]" />
            <h2 className="mt-4 text-3xl font-bold tracking-[-.04em]">
              Skip the App Store. Open Safari.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#8f9da0]">
              The full editor is one tab away on any iPhone. Crop, convert, compress, remove
              objects and make passport photos — free, private and with zero downloads.
            </p>
            <button
              type="button"
              onClick={tryTool}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#f0bd5b] px-6 py-3 text-sm font-bold text-[#171719] shadow-[0_5px_0_#9a7031] transition-all hover:-translate-y-0.5 hover:shadow-[0_7px_0_#9a7031] active:translate-y-0 active:shadow-[0_2px_0_#9a7031]"
            >
              Start editing on your iPhone
            </button>
            <p className="mt-4 text-[11px] text-[#647477]">
              10 tools · works on any iOS version · no App Store download
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}