import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { TOOLS, type ToolId, type ToolInfo } from '@/lib/tools';
import { scrollToSection, subscribeActiveTool } from '@/lib/section-nav';

const TAB_ACCENT = {
  gold: {
    border: 'border-[#f0bd5b]/60',
    bg: 'bg-[#f0bd5b]/12',
    icon: 'text-[#f0bd5b]',
    underline: 'bg-[#f0bd5b]',
    iconBox: 'bg-[#f0bd5b]/12 text-[#f0bd5b]',
    cta: 'bg-[#f0bd5b] text-[#171719]',
  },
  cyan: {
    border: 'border-[#62e4dc]/60',
    bg: 'bg-[#62e4dc]/12',
    icon: 'text-[#62e4dc]',
    underline: 'bg-[#62e4dc]',
    iconBox: 'bg-[#62e4dc]/10 text-[#62e4dc]',
    cta: 'bg-[#62e4dc] text-[#102021]',
  },
} as const;

function ToolDetailCard({ tool }: { tool: ToolInfo }) {
  const Icon = tool.icon;
  const accent = TAB_ACCENT[tool.accent];
  return (
    <div key={tool.id} className="cleaner-animate-in grid gap-5 rounded-2xl border border-[#293337] bg-[#151b1e]/75 p-6 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:gap-7 sm:p-7">
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${accent.iconBox}`}>
        <Icon size={22} strokeWidth={1.8} />
      </span>
      <div>
        <h3 className="text-base font-semibold tracking-[-0.01em] text-[#f5f1e8]">{tool.label}</h3>
        <p className="mt-1 text-sm leading-6 text-[#9eabad]">{tool.description}</p>
        <p className="mt-3 text-xs leading-5 text-[#718082]">{tool.useCase}</p>
      </div>
      <button
        type="button"
        onClick={() => scrollToSection('tool')}
        className={`flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all hover:-translate-y-0.5 ${accent.cta}`}
      >
        Open this tool <ArrowRight size={15} />
      </button>
    </div>
  );
}

export function FeaturesShowcase({ initialTool = null }: { initialTool?: ToolId | null }) {
  const [activeTool, setActiveTool] = useState<ToolId | null>(initialTool);
  const active = activeTool ? TOOLS.find((tool) => tool.id === activeTool) ?? null : null;

  useEffect(() => {
    const unsubscribe = subscribeActiveTool(setActiveTool);
    return unsubscribe;
  }, []);

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

        <div role="tablist" aria-label="Image tools" className="cleaner-scrollbar -mx-4 overflow-x-auto px-4 sm:-mx-8 sm:px-8 lg:-mx-12 lg:overflow-x-visible lg:px-12">
          <div className="flex min-w-max gap-1.5 lg:min-w-0 lg:flex-wrap lg:gap-2">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              const selected = activeTool === tool.id;
              const accent = TAB_ACCENT[tool.accent];
              return (
                <button
                  key={tool.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveTool(selected ? null : tool.id)}
                  className={`group relative flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                    selected ? `${accent.border} ${accent.bg} text-[#f5f1e8]` : 'border-transparent text-[#9eabad] hover:border-[#293337] hover:bg-[#f5f1e8]/5 hover:text-[#f5f1e8]'
                  }`}
                >
                  <Icon size={15} strokeWidth={1.8} className={selected ? accent.icon : 'text-[#647477] group-hover:text-[#9eabad]'} />
                  {tool.label}
                  {selected && <span className={`absolute inset-x-2 bottom-px h-0.5 rounded-full ${accent.underline}`} />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-7">
          {active ? (
            <ToolDetailCard tool={active} />
          ) : (
            <div className="flex min-h-[104px] items-center justify-center rounded-2xl border border-dashed border-[#2a3539] bg-[#151b1e]/40 px-6 py-8 text-center text-xs leading-5 text-[#718082]">
              Select a tool above to see what it does — every one runs free in this browser.
            </div>
          )}
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