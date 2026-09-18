import { BadgeCheck, EyeOff, Layers, LockKeyhole } from 'lucide-react';

const TRUST_POINTS = [
  {
    icon: LockKeyhole,
    title: 'No account needed',
    text: 'Upload an image and start editing. There is nothing to sign up for, and no password to forget.',
  },
  {
    icon: EyeOff,
    title: 'Nothing leaves your browser',
    text: 'Your files stay in memory in the tab you are using. Close the tab and the image is gone.',
  },
  {
    icon: BadgeCheck,
    title: 'Free forever',
    text: 'No trials, no watermark on your downloads, no credit card. All ten tools are free.',
  },
  {
    icon: Layers,
    title: '10 tools in one place',
    text: 'One upload covers every common edit — crop, resize, convert, compress, watermark, and more.',
  },
];

export function AboutSection() {
  return (
    <section id="about" className="scroll-anchor border-t border-[#252f33]">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)]">
          <div className="cleaner-animate-in">
            <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#62e4dc]">
              <span className="h-px w-7 bg-[#62e4dc]" /> Why cleaner.
            </div>
            <h2 className="text-3xl font-bold tracking-[-.05em] text-[#f5f1e8] sm:text-4xl">
              A small tool with a <span className="text-[#f0bd5b]">big privacy promise</span>
            </h2>
            <div className="mt-6 space-y-5 text-base leading-7 text-[#9eabad]">
              <p>
                cleaner. is an image utility that lives in your browser. You open the page, drop in a JPG, PNG, or WEBP, and
                every common edit — cropping, converting, compressing, rotating, watermarking, passport sizing — happens
                right there in the tab. No upload queue, no waiting for render jobs, and no desktop app to install.
              </p>
              <p>
                Most online image editors make you trade away your photos to use them: you sign up, upload to their servers,
                wait in a queue, and hope your file gets deleted afterwards. cleaner. works the other way around. Your image
                stays in memory on your device, and the page simply asks you what you want to do with it.
              </p>
              <p>
                The two heavier tools — Remove Object and Remove Background — use a private local service for the processing
                step. The model runs on the machine that serves the page, the request is handled in memory, and nothing is
                written to disk or saved to a library. Once you close the tab, there is no copy of your photo anywhere on the
                internet.
              </p>
              <p>
                It is also genuinely free. There are no locked features, no watermark printed across your exports, and no
                "upgrade to export in HD" screen. If the tool can do the job, you can use it — that is the whole deal.
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:h-full lg:grid-cols-1 lg:grid-rows-[repeat(4,minmax(0,1fr))]">
            {TRUST_POINTS.map((point) => {
              const Icon = point.icon;
              return (
                <div
                  key={point.title}
                  className="flex items-start gap-3 rounded-2xl border border-[#293337] bg-[#151b1e]/70 px-4 py-4"
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f0bd5b]/12 text-[#f0bd5b]">
                    <Icon size={17} strokeWidth={1.8} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-[#f5f1e8]">{point.title}</span>
                    <span className="mt-1 block text-xs leading-5 text-[#8f9da0]">{point.text}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}