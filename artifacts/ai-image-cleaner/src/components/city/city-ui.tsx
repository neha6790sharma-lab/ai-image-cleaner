import type { ReactNode } from 'react';
import {
  BadgeCheck,
  LockKeyhole,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { TOOLS } from '@/lib/tools';
import type { Accent, CityConfig } from '@/lib/city-data';

/* ------------------------------- Decorations ------------------------------ */

export function CityDecor({
  variant,
  accent,
}: {
  variant: CityConfig['decor'];
  accent: Accent;
}) {
  if (variant === 'none') return null;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {variant === 'glow' && (
        <>
          <div
            className="absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full blur-2xl sm:h-[520px] sm:w-[520px]"
            style={{ background: `radial-gradient(closest-side, ${accent.glow}, transparent)` }}
          />
          <div
            className="absolute bottom-[-30%] left-[-12%] h-80 w-80 rounded-full blur-2xl"
            style={{ background: `radial-gradient(closest-side, ${accent.tint}, transparent)` }}
          />
        </>
      )}
      {variant === 'grid' && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(${accent.tint2} 1px, transparent 1px), linear-gradient(90deg, ${accent.tint2} 1px, transparent 1px)`,
            backgroundSize: '34px 34px',
            maskImage: 'radial-gradient(circle at 60% 20%, #000 0%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(circle at 60% 20%, #000 0%, transparent 75%)',
          }}
        />
      )}
      {variant === 'dots' && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(${accent.borderSoft} 1.4px, transparent 1.4px)`,
            backgroundSize: '22px 22px',
            maskImage: 'radial-gradient(circle at 50% 30%, #000 0%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(circle at 50% 30%, #000 0%, transparent 70%)',
          }}
        />
      )}
      {variant === 'diagonal' && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(135deg, ${accent.tint} 0px, ${accent.tint} 1px, transparent 1px, transparent 16px)`,
            maskImage: 'linear-gradient(180deg, #000 0%, transparent 85%)',
            WebkitMaskImage: 'linear-gradient(180deg, #000 0%, transparent 85%)',
          }}
        />
      )}
      {variant === 'rings' && (
        <div className="absolute inset-0">
          {[220, 380, 560].map((size, index) => (
            <span
              key={size}
              className="absolute left-1/2 top-[12%] -translate-x-1/2 rounded-full border"
              style={{
                width: size,
                height: size,
                borderColor: index === 1 ? accent.borderSoft : accent.tint,
                opacity: 1 - index * 0.22,
              }}
            />
          ))}
        </div>
      )}
      {variant === 'waves' && (
        <svg
          viewBox="0 0 1440 420"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-0 h-[60%] w-full"
        >
          <path d="M0 240 C 240 120, 480 360, 720 240 S 1200 120, 1440 240 L 1440 420 L 0 420 Z" fill={accent.tint2} />
          <path d="M0 300 C 260 190, 520 400, 780 290 S 1200 190, 1440 300 L 1440 420 L 0 420 Z" fill={accent.tint} />
        </svg>
      )}
      {variant === 'noise' && (
        <div
          className="absolute inset-0 opacity-[.22]"
          style={{
            backgroundImage: `radial-gradient(${accent.borderSoft} 1px, transparent 1px)`,
            backgroundSize: '7px 7px',
          }}
        />
      )}
    </div>
  );
}

/* --------------------------------- Buttons -------------------------------- */

export function PrimaryButton({
  accent,
  onClick,
  children,
  className = '',
}: {
  accent: Accent;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-5 py-2.5 text-sm font-bold shadow-[0_5px_0_rgba(0,0,0,0.45)] transition-all hover:-translate-y-0.5 hover:shadow-[0_7px_0_rgba(0,0,0,0.45)] active:translate-y-0 active:shadow-[0_2px_0_rgba(0,0,0,0.45)] ${className}`}
      style={{ backgroundColor: accent.base, color: accent.ink }}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  accent,
  onClick,
  children,
  className = '',
}: {
  accent: Accent;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-5 py-2.5 text-sm font-semibold text-[#c6cfca] transition-colors hover:text-[#f5f1e8] ${className}`}
      style={{ borderColor: accent.borderSoft }}
    >
      {children}
    </button>
  );
}

/* ------------------------------ Section label ----------------------------- */

export function SectionLabel({
  accent,
  children,
  align = 'left',
}: {
  accent: Accent;
  children: ReactNode;
  align?: 'left' | 'center';
}) {
  return (
    <div
      className={`mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] ${
        align === 'center' ? 'justify-center' : ''
      }`}
      style={{ color: accent.base }}
    >
      <span className="h-px w-7" style={{ backgroundColor: accent.base }} />
      {children}
    </div>
  );
}

/* -------------------------------- Tool chips ------------------------------- */

const TRUST_ICONS: LucideIcon[] = [LockKeyhole, BadgeCheck, ShieldCheck];

export function trustIcon(index: number): LucideIcon {
  return TRUST_ICONS[index % TRUST_ICONS.length];
}

export function ToolChips({ accent, limit }: { accent: Accent; limit?: number }) {
  const tools = limit ? TOOLS.slice(0, limit) : TOOLS;
  return (
    <div className="flex flex-wrap gap-2">
      {tools.map((tool) => {
        const Icon = tool.icon;
        return (
          <span
            key={tool.id}
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium text-[#bcc7c4]"
            style={{ borderColor: accent.borderSoft, backgroundColor: accent.tint2 }}
          >
            <Icon size={13} strokeWidth={1.8} style={{ color: accent.base }} />
            {tool.label}
          </span>
        );
      })}
    </div>
  );
}
