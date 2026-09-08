import { Link } from 'wouter';
import { Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] w-full items-center justify-center cleaner-shell">
      <div className="mx-4 w-full max-w-md">
        <div className="cleaner-animate-in rounded-2xl border border-[#293337] bg-[#171d20] p-8 text-center">
          <div className="mb-6 flex items-center justify-center gap-3">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#f0bd5b]/50 bg-[#f0bd5b]/10 text-[#f0bd5b]">
              <Sparkles size={17} strokeWidth={1.8} />
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#62e4dc]" />
            </span>
            <span className="text-[15px] font-bold tracking-[-0.02em] text-[#f5f1e8]">
              cleaner<span className="text-[#f0bd5b]">.</span>
            </span>
          </div>
          <h1 className="text-6xl font-bold tracking-[-0.05em] text-[#f0bd5b]">404</h1>
          <p className="mt-3 text-lg font-semibold tracking-[-0.02em] text-[#f5f1e8]">Page not found</p>
          <p className="mt-2 text-sm leading-6 text-[#8f9da0]">
            This page isn't here — maybe it moved, or the link is a little off.
          </p>
          <Link
            href="/"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#f0bd5b] px-6 py-2.5 text-sm font-bold text-[#171719] shadow-[0_5px_0_#9a7031] transition-all hover:-translate-y-0.5 hover:shadow-[0_7px_0_#9a7031] active:translate-y-0 active:shadow-[0_2px_0_#9a7031]"
          >
            Back to cleaner.
          </Link>
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[.14em] text-[#647477]">
            No account · No cloud storage
          </p>
        </div>
      </div>
    </main>
  );
}