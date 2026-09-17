import { TOOLS } from '@/lib/tools';
import { scrollToSection } from '@/lib/section-nav';

export function FeaturesShowcase() {
  return (
    <section id="features" className="scroll-anchor border-t border-[#252f33] bg-[#121719]/40">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="cleaner-animate-in mb-10 max-w-3xl">
          <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#62e4dc]">
            <span className="h-px w-7 bg-[#62e4dc]" /> What's inside
          </div>
          <h2 className="text-3xl font-bold tracking-[-.05em] text-[#f5f1e8] sm:text-4xl">
            Ten tools, <span className="text-[#f0bd5b]">one quiet place</span>
          </h2>
          <p className="mt-4 text-base leading-7 text-[#9eabad]">
            Every editor here covers a single, everyday image problem — from removing a photobomber in one brush stroke to
            exporting a correctly sized passport photo. Pick a card to jump straight to the tool, load an image, and you are
            editing. No tour, no tutorial, nothing to install.
          </p>
          <p className="mt-3 text-sm leading-6 text-[#718082]">
            All ten run in the tab you already have open. The two heavier jobs — Remove Object and Remove Background — hand off
            to a private local service for the processing step, and nothing is ever stored in a cloud library.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => scrollToSection('tool')}
                className="group flex flex-col rounded-2xl border border-[#293337] bg-[#151b1e]/70 p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#f0bd5b]/40 hover:bg-[#1c2427]"
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    tool.accent === 'gold'
                      ? 'bg-[#f0bd5b]/12 text-[#f0bd5b]'
                      : 'bg-[#62e4dc]/10 text-[#62e4dc]'
                  }`}
                >
                  <Icon size={18} strokeWidth={1.8} />
                </span>
                <h3 className="mt-4 text-[15px] font-semibold tracking-[-0.01em] text-[#f5f1e8]">{tool.label}</h3>
                <p className="mt-1 text-xs leading-4 text-[#8f9da0]">{tool.description}</p>
                <p className="mt-3 border-t border-[#293337]/80 pt-3 text-xs leading-5 text-[#718082]">{tool.useCase}</p>
              </button>
            );
          })}
        </div>
        <div className="cleaner-animate-in cleaner-delay-1 mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-[#293337] bg-[#151b1e]/75 px-5 py-4 text-sm text-[#9eabad]">
          <span className="font-mono text-[10px] uppercase tracking-[.16em] text-[#62e4dc]">One upload</span>
          <span className="text-[#506064]">·</span>
          <span>every tool above, ready the moment your image loads — no account, no sign-up.</span>
        </div>
      </div>
    </section>
  );
}