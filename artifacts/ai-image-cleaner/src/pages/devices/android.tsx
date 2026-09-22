import {
  AppWindow,
  BadgeCheck,
  Check,
  Download,
  Eraser,
  FileArchive,
  Maximize2,
  RefreshCw,
  ScanLine,
  Smartphone,
  Sparkles,
  Wifi,
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
import { TOOLS } from '@/lib/tools';
import { useDevicePageMeta, useGoToTool } from '@/lib/device-pages';

const CYA = '#62e4dc';

const BRANDS = [
  'Samsung',
  'Xiaomi',
  'OnePlus',
  'Realme',
  'Vivo',
  'Oppo',
  'Motorola',
  'Google Pixel',
];

const STEPS = [
  {
    title: 'Open this page in Chrome',
    text: 'No Play Store, no APK, no install wizard. Just open the site in the browser that already came with your phone.',
  },
  {
    title: 'Load a photo from your gallery',
    text: 'Pick any JPG, PNG or WEBP from your albums, chat app or files. It opens locally, not on some upload server.',
  },
  {
    title: 'Edit, then download',
    text: 'Crop, compress, remove objects, make a passport photo — then save the result straight back to your phone.',
  },
];

const TOOL_HIGHLIGHTS = [
  { icon: Eraser, title: 'Remove Object', text: 'Brush over a photobomber or a stray cable and cleaner. refills the pixels.' },
  { icon: Maximize2, title: 'Crop', text: 'Trim a screenshot or a camera shot to the frame you actually want to post.' },
  { icon: FileArchive, title: 'Compress', text: 'Shrink a 12 MB photo down to a size that sends over WhatsApp instantly.' },
  { icon: ScanLine, title: 'Passport Size', text: 'India-ready passport, visa, PAN and stamp presets in one tap.' },
  { icon: RefreshCw, title: 'Convert Format', text: 'Flip between JPG, PNG and WEBP depending on what the form or app expects.' },
  { icon: Sparkles, title: 'Adjust & Filters', text: 'Brighten a dim photo or add a sepia, black-and-white touch before sharing.' },
];

const FAQ = [
  {
    q: 'Does the Android editor need an app from the Play Store?',
    a: 'No. cleaner. runs entirely in the browser, so there is nothing to install. Open this page in any Android browser and the tools are ready immediately.',
  },
  {
    q: 'Will it work on my phone\u2019s brand?',
    a: 'Yes. The page runs in Chrome, Samsung Internet, Edge, Firefox and Opera on any Android phone — Samsung, Xiaomi, OnePlus, Realme, Vivo, Oppo, Motorola, Pixel and more. There is no brand-specific build because there is no app at all.',
  },
  {
    q: 'Are my photos uploaded anywhere?',
    a: 'No. Cropping, compressing, converting and resizing all happen on your phone. Only the Remove Object and Remove Background tools send pixels to a private local service that keeps nothing.',
  },
  {
    q: 'Does it work on an old or low-end phone?',
    a: 'It is lightweight by design. The everyday tools run in your phone\u2019s browser without lag, so even an older Android with limited storage handles a quick edit fine.',
  },
];

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[300px]">
      <div
        className="absolute -inset-8 rounded-[3rem] opacity-25 blur-2xl"
        style={{ background: 'radial-gradient(circle, #62e4dc, transparent 70%)' }}
      />
      <div className="relative rounded-[2.4rem] border border-[#334145] bg-[#10161a] p-2.5 shadow-[0_30px_80px_-24px_rgba(0,0,0,.9)]">
        <div className="rounded-[1.8rem] border border-[#293337] bg-[#151b1e]">
          <div className="flex items-center justify-center gap-1.5 px-4 pt-3">
            <span className="h-1.5 w-16 rounded-full bg-[#334145]" />
          </div>
          <div className="flex items-center gap-2 px-4 pb-2 pt-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#62e4dc]/10 text-[#62e4dc]">
              <Sparkles size={12} strokeWidth={2} />
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[.14em] text-[#8f9da0]">
              cleaner. · private editor
            </span>
          </div>
          <div className="border-t border-[#293337] p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 rounded-lg border border-[#293337] bg-[#171d20] px-3 py-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f0bd5b]/10 text-[#f0bd5b]">
                  <Maximize2 size={12} strokeWidth={1.8} />
                </span>
                <span className="text-[10px] font-semibold text-[#dce1da]">Crop</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-[#293337] bg-[#171d20] px-3 py-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f0bd5b]/10 text-[#f0bd5b]">
                  <FileArchive size={12} strokeWidth={1.8} />
                </span>
                <span className="text-[10px] font-semibold text-[#dce1da]">Compress</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-[#62e4dc]/35 bg-[#62e4dc]/10 px-3 py-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#62e4dc] text-[#102021]">
                  <Eraser size={12} strokeWidth={2} />
                </span>
                <span className="flex items-center justify-between gap-2 text-[10px] font-semibold text-[#9fe9e3]">
                  Remove Object
                  <Check size={11} />
                </span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-[#62e4dc] px-3 py-2">
              <span className="text-[10px] font-bold text-[#102021]">Download result</span>
              <Download size={12} className="text-[#102021]" />
            </div>
          </div>
          <div className="flex items-center justify-center gap-1.5 px-4 pb-4">
            <span className="h-6 w-6 rounded-full border border-[#334145]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AndroidPage() {
  const tryTool = useGoToTool();
  useDevicePageMeta({
    path: '/image-editor-for-android',
    title: 'Free Image Editor for Android — No App Install, Works in Any Browser | cleaner.',
    description:
      'Edit photos on any Android phone straight in Chrome or your browser — no Play Store app, no install, no sign-up. Crop, compress, remove objects and make passport photos for free.',
    operatingSystem: 'Android',
  });

  return (
    <main className="cleaner-shell cleaner-noise min-h-[100dvh] text-[#f5f1e8]">
      <SiteNavbar />

      {/* Hero — cyan-led split with a phone mockup */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 15% 20%, rgba(98,228,220,.14), transparent 26rem), radial-gradient(circle at 90% 80%, rgba(240,189,91,.08), transparent 22rem)',
          }}
        />
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 pb-14 pt-12 sm:px-8 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] lg:px-12">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#62e4dc]/30 bg-[#62e4dc]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[.18em] text-[#9fe9e3]">
              <Smartphone size={13} /> Image editor for Android
            </div>
            <h1 className="text-4xl font-bold leading-[1.02] tracking-[-.05em] sm:text-6xl">
              Edit photos on any{' '}
              <span className="text-[#62e4dc]">Android phone</span>, no app install needed.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#9eabad] sm:text-lg">
              cleaner. runs in the browser that already sits on your phone. Open the page in
              Chrome — or any other Android browser — and crop, compress, remove objects and
              make passport photos without downloading a single app.
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
                <Check size={14} className="text-[#62e4dc]" /> Free · No sign-up · No watermark
              </span>
            </div>
          </div>
          <div className="cleaner-float">
            <PhoneMockup />
          </div>
        </div>
      </section>

      {/* How it works — numbered steps */}
      <section className="relative border-y border-[#252f33] bg-[#10161a]/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8 lg:px-12">
          <div className="mb-9 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#62e4dc]">
            <span className="h-px w-7 bg-[#62e4dc]" /> How it works on your phone
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <div
                key={step.title}
                className="relative rounded-2xl border border-[#293337] bg-[#151b1e]/80 p-6"
              >
                <span
                  className="font-mono text-4xl font-bold"
                  style={{ color: `rgba(98,228,220,${1 - index * 0.18})` }}
                >
                  0{index + 1}
                </span>
                <h2 className="mt-3 text-base font-bold text-[#f5f1e8]">{step.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[#8f9da0]">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Works on every brand strip */}
      <section id="android-compat" className="relative overflow-hidden">
        <div className="cleaner-grid absolute inset-0 opacity-60" />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-14 sm:px-8 lg:px-12">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#62e4dc]">
              <span className="h-px w-7 bg-[#62e4dc]" /> Works on every brand
            </div>
            <h2 className="text-3xl font-bold tracking-[-.04em]">
              Not an app, so there is no phone it won&#39;t run on.
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#8f9da0]">
              Because cleaner. is a webpage, it does not care which skin, chipset or Android
              version your phone uses. Open it in Chrome, Samsung Internet, Edge, Firefox or
              Opera and the same ten tools are there.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-2.5">
            {BRANDS.map((brand) => (
              <span
                key={brand}
                className="inline-flex items-center gap-2 rounded-xl border border-[#334145] bg-[#151b1e]/70 px-4 py-2 text-sm font-semibold text-[#c6cfca]"
              >
                <Check size={14} style={{ color: CYA }} />
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Tool highlights */}
      <section className="border-y border-[#252f33] bg-[#10161a]/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8 lg:px-12">
          <div className="mb-9 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#f0bd5b]">
            <span className="h-px w-7 bg-[#f0bd5b]" /> Ten tools, all on one page
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOOL_HIGHLIGHTS.map((tool) => {
              const Icon: LucideIcon = tool.icon;
              return (
                <div
                  key={tool.title}
                  className="group rounded-2xl border border-[#293337] bg-[#151b1e]/70 p-5 transition-colors hover:border-[#62e4dc]/40"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#62e4dc]/10 text-[#62e4dc] transition-transform group-hover:-translate-y-0.5">
                    <Icon size={17} strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-4 text-sm font-bold text-[#f5f1e8]">{tool.title}</h3>
                  <p className="mt-1.5 text-xs leading-5 text-[#8f9da0]">{tool.text}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs text-[#647477]">
            <Wifi size={13} className="text-[#62e4dc]" />
            Everyday tools work without uploading — Remove Object and Remove Background use a
            private local service that keeps nothing.
          </div>
        </div>
      </section>

      {/* FAQ — question-led block */}
      <section className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-8">
        <div className="mb-6 text-center">
          <div className="mb-2 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#62e4dc]">
            <BadgeCheck size={14} /> Android questions, answered
          </div>
          <h2 className="text-3xl font-bold tracking-[-.04em]">Quick answers</h2>
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
      </section>

      {/* Closing CTA */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(circle at 80% 20%, rgba(98,228,220,.16), transparent 24rem)' }}
        />
        <div className="relative mx-auto w-full max-w-4xl px-4 pb-16 pt-4 text-center sm:px-8">
          <div className="rounded-3xl border border-[#2a373b] bg-[#151b1e]/80 p-8 sm:p-12">
            <AppWindow size={26} className="mx-auto text-[#62e4dc]" />
            <h2 className="mt-4 text-3xl font-bold tracking-[-.04em]">
              No app to install. Just open the page.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#8f9da0]">
              The editor is already in your phone&#39;s browser. Load a photo and the ten tools
              are one tap away — free, private and ready on any Android.
            </p>
            <button
              type="button"
              onClick={tryTool}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#62e4dc] px-6 py-3 text-sm font-bold text-[#102021] shadow-[0_5px_0_#1e7d78] transition-all hover:-translate-y-0.5 hover:shadow-[0_7px_0_#1e7d78] active:translate-y-0 active:shadow-[0_2px_0_#1e7d78]"
            >
              Start editing on your phone
            </button>
            <p className="mt-4 text-[11px] text-[#647477]">
              {TOOLS.length} tools · JPG, PNG &amp; WEBP · nothing leaves your device
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}