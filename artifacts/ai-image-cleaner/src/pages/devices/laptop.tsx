import {
  BriefcaseBusiness,
  Check,
  Coffee,
  HardDrive,
  Home,
  Luggage,
  Sparkles,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { SiteNavbar } from '@/components/site-navbar';
import { SiteFooter } from '@/components/site-footer';
import { TOOLS, type ToolInfo } from '@/lib/tools';
import { useDevicePageMeta, useGoToTool } from '@/lib/device-pages';

const GOLD = '#f0bd5b';

const JOURNEY = [
  {
    icon: BriefcaseBusiness,
    place: 'Between meetings',
    caption: 'Crop and compress before you hit send on a laptop with three tabs and a call open.',
  },
  {
    icon: Luggage,
    place: 'On a trip',
    caption: 'Tidy your photos each evening with no storage-hungry app in the way.',
  },
  {
    icon: Coffee,
    place: 'At a café',
    caption: 'Open the editor over the wifi sign-in and finish in minutes.',
  },
  {
    icon: Home,
    place: 'On the sofa',
    caption: 'Clean up a family photo without installing anything on your laptop.',
  },
];

const BATTERY_FRIENDLY_STEPS = [
  'Browser tools stay light, so a quick edit does not spin up a heavy editor and drain the battery.',
  'In-process editing means no background sync drinking power and data while you work.',
  'Export straight to a folder — no import library to rebuild on a device with limited disk.',
];

function LaptopMockup() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div
        className="absolute -inset-8 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #f0bd5b, transparent 65%)' }}
      />
      <div className="relative">
        <div className="relative overflow-hidden rounded-t-2xl border border-[#293337] bg-[#10161a] p-2 shadow-[0_30px_80px_-24px_rgba(0,0,0,.9)]">
          <div className="rounded-xl border border-[#252f33] bg-[#151b1e]">
            <div className="flex items-center gap-2 border-b border-[#252f33] px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#f1837c]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#f0bd5b]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#62e4dc]" />
              <span className="ml-2 font-mono text-[9px] uppercase tracking-[.14em] text-[#647477]">
                cleaner · travel album <span className="text-[#f0bd5b]">~1.8 MB</span>
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 p-4">
              {[
                ['Remove Object', true],
                ['Crop', true],
                ['Compress', false],
              ].map(([label, active]) => (
                <div
                  key={label as string}
                  className={`rounded-lg border p-3 ${
                    active
                      ? 'border-[#f0bd5b]/30 bg-[#f0bd5b]/10'
                      : 'border-[#293337] bg-[#171d20] opacity-60'
                  }`}
                >
                  <span
                    className={`block h-1.5 w-1.5 rounded-full ${active ? 'bg-[#f0bd5b]' : 'bg-[#4a5a5e]'}`}
                  />
                  <span className="mt-2 block text-[10px] font-semibold text-[#dce1da]">
                    {label as string}
                  </span>
                  <span className="mt-1 block h-1.5 w-full rounded-full bg-[#252f33]" />
                  <span className="mt-1 block h-1.5 w-3/4 rounded-full bg-[#252f33]" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mx-auto h-2.5 w-[112%] -translate-x-[5%] rounded-b-2xl bg-gradient-to-b from-[#223036] to-[#10161a]" />
        <span className="absolute -right-4 top-1/2 flex -translate-y-1/2 items-center gap-2 rounded-2xl border border-[#293337] bg-[#171d20] px-3 py-2 shadow-xl">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f0bd5b]/10 text-[#f0bd5b]">
            <HardDrive size={14} strokeWidth={1.8} />
          </span>
          <span className="pr-1">
            <span className="block text-[11px] font-semibold leading-4 text-[#f5f1e8]">0 MB used</span>
            <span className="block text-[10px] leading-3 text-[#718082]">no app installed</span>
          </span>
        </span>
      </div>
    </div>
  );
}

export default function LaptopPage() {
  const tryTool = useGoToTool();
  useDevicePageMeta({
    path: '/image-editor-for-laptop',
    title: 'Free Image Editor for Laptop — Edit On the Go, No Software | cleaner.',
    description:
      'A lightweight browser image editor for laptops — perfect on the go. Crop, compress, remove objects and convert photos without heavy software or storage-hogging installs.',
    operatingSystem: 'Windows, macOS, Linux',
  });

  return (
    <main className="cleaner-shell cleaner-noise min-h-[100dvh] text-[#f5f1e8]">
      <SiteNavbar />

      {/* Hero — editorial, gold-led */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 10% 15%, rgba(240,189,91,.14), transparent 24rem), radial-gradient(circle at 95% 85%, rgba(98,228,220,.08), transparent 20rem)',
          }}
        />
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 pb-14 pt-12 sm:px-8 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:px-12">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#f0bd5b]/35 bg-[#f0bd5b]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[.18em] text-[#f6d38f]">
              <BriefcaseBusiness size={13} /> Image editor for laptop
            </div>
            <h1 className="text-4xl font-bold leading-[1.02] tracking-[-.05em] sm:text-6xl">
              Your whole image studio,{' '}
              <span className="text-[#f0bd5b]">ready wherever your laptop is.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#9eabad] sm:text-lg">
              Train journeys, airport wifi, late checkout mornings — cleaner. portable editor
              opens in your laptop&#39;s browser and lives on your device. No heavy software,
              no giant install, and no dent in your already-full disk.
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
                <Check size={14} className="text-[#f0bd5b]" /> Light enough to travel with
              </span>
            </div>
          </div>
          <div className="cleaner-float">
            <LaptopMockup />
          </div>
        </div>
      </section>

      {/* On-the-go journey timeline */}
      <section className="border-y border-[#252f33] bg-[#10161a]/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8 lg:px-12">
          <div className="mb-10 max-w-2xl">
            <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#f0bd5b]">
              <span className="h-px w-7 bg-[#f0bd5b]" /> Made for the moving laptop
            </div>
            <h2 className="text-3xl font-bold tracking-[-.04em]">
              Between meetings, boarding gates and bedtime.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#8f9da0]">
              The laptop is where edits happen away from a desk. cleaner. keeps the whole kit
              light so it fits those in-between moments.
            </p>
          </div>
          <div className="relative grid gap-5 md:grid-cols-4">
            <span aria-hidden="true" className="absolute left-8 top-0 hidden h-full w-px bg-gradient-to-b from-[#f0bd5b]/50 to-[#62e4dc]/30 md:block" />
            {JOURNEY.map((step, index) => {
              const Icon: LucideIcon = step.icon;
              return (
                <div key={step.place} className="relative pl-4 md:pl-0">
                  <span className="absolute left-0 top-1 hidden h-4 w-4 rounded-full border-2 border-[#f0bd5b] bg-[#10161a] md:block" />
                  <div className="rounded-2xl border border-[#293337] bg-[#151b1e]/70 p-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0bd5b]/10 text-[#f0bd5b]">
                      <Icon size={17} strokeWidth={1.8} />
                    </span>
                    <span className="mt-4 block font-mono text-[10px] uppercase tracking-[.16em] text-[#647477]">
                      0{index + 1}
                    </span>
                    <h3 className="mt-1 text-sm font-bold text-[#f5f1e8]">{step.place}</h3>
                    <p className="mt-2 text-xs leading-5 text-[#8f9da0]">{step.caption}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Storage + battery friendly */}
      <section className="cleaner-grid relative overflow-hidden">
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-14 sm:px-8 lg:grid-cols-2 lg:px-12">
          <div>
            <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#62e4dc]">
              <span className="h-px w-7 bg-[#62e4dc]" /> Built for limited disk & battery
            </div>
            <h2 className="text-3xl font-bold tracking-[-.04em]">
              Keeps your storage and your charge.
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#8f9da0]">
              {BATTERY_FRIENDLY_STEPS[0]} {BATTERY_FRIENDLY_STEPS[1]}
            </p>
            <ul className="mt-5 space-y-3">
              {BATTERY_FRIENDLY_STEPS.map((step) => (
                <li key={step} className="flex items-start gap-3 text-sm leading-6 text-[#9eabad]">
                  <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#62e4dc]/15">
                    <Check size={10} className="text-[#62e4dc]" />
                  </span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-3">
            {[
              { icon: HardDrive, title: '0 MB footprint', text: 'Nothing installs, so nothing eats into your disk.' },
              { icon: Zap, title: 'Fast on any spec', text: 'No rendering farm — the tools run in the tab you already have.' },
              { icon: Check, title: 'Exports to a folder', text: 'Download lands in your usual Downloads, ready to move.' },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="flex items-center gap-4 rounded-2xl border border-[#293337] bg-[#151b1e]/70 px-5 py-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#62e4dc]/10 text-[#62e4dc]">
                    <Icon size={18} strokeWidth={1.8} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[#f5f1e8]">{card.title}</p>
                    <p className="text-xs leading-5 text-[#8f9da0]">{card.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tools strip */}
      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8 lg:px-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#f0bd5b]">
              <span className="h-px w-7 bg-[#f0bd5b]" /> Ten tools on one page
            </div>
            <h2 className="text-3xl font-bold tracking-[-.04em]">Everything, in one trip.</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-[#8f9da0]">
            Pack the toolkit, not the software. Every editor below runs in your laptop browser.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {TOOLS.map((tool: ToolInfo) => {
            const Icon: LucideIcon = tool.icon;
            return (
              <div key={tool.id} className="rounded-xl border border-[#293337] bg-[#151b1e]/60 p-4 transition-colors hover:border-[#f0bd5b]/40">
                <Icon size={16} strokeWidth={1.8} style={{ color: tool.accent === 'cyan' ? '#62e4dc' : GOLD }} />
                <p className="mt-3 text-xs font-bold text-[#dce1da]">{tool.label}</p>
                <p className="mt-1 text-[11px] leading-4 text-[#718082]">{tool.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(circle at 50% 0%, rgba(240,189,91,.16), transparent 24rem)' }}
        />
        <div className="relative mx-auto w-full max-w-4xl px-4 pb-16 pt-8 text-center sm:px-8">
          <Sparkles size={26} className="mx-auto text-[#f0bd5b]" />
          <h2 className="mt-4 text-3xl font-bold tracking-[-.04em]">
            Light on disk. Ready on the road.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#8f9da0]">
            Open cleaner. on your laptop and the full editor is there — no install, no imports,
            no storage cost. Perfect for travel, café sessions and everything in between.
          </p>
          <button
            type="button"
            onClick={tryTool}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#f0bd5b] px-6 py-3 text-sm font-bold text-[#171719] shadow-[0_5px_0_#9a7031] transition-all hover:-translate-y-0.5 hover:shadow-[0_7px_0_#9a7031] active:translate-y-0 active:shadow-[0_2px_0_#9a7031]"
          >
            Start editing on your laptop
          </button>
          <p className="mt-4 text-[11px] text-[#647477]">
            Free · private · no software and no watermark
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}