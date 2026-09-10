import { useEffect, useState, type ReactNode } from 'react';
import { Redirect } from 'wouter';
import { ShieldAlert, Sparkles } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { getSupabase } from '@/lib/supabase';
import { ADMIN_LOGIN_PATH } from '@/lib/admin-config';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

type GuardState = 'loading' | 'anon' | 'forbidden' | 'ok';

/**
 * UI-level guard for admin routes. This only controls what the browser shows;
 * the actual security boundary is the database (Row Level Security), which
 * rejects any read/write a non-admin session attempts, no matter what the UI
 * decides to render.
 */
export function RequireAdmin({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GuardState>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let supabase: ReturnType<typeof getSupabase> | null = null;
    try {
      supabase = getSupabase();
    } catch (err) {
      setState('forbidden');
      setError(err instanceof Error ? err.message : 'Supabase is not configured.');
      return;
    }

    const evaluate = (session: { user?: { app_metadata?: Record<string, unknown> } } | null) => {
      if (!active) return;
      if (!session?.user) {
        setState('anon');
        return;
      }
      if (session.user.app_metadata?.role === 'admin') setState('ok');
      else setState('forbidden');
    };

    supabase.auth
      .getSession()
      .then(({ data }) => evaluate(data.session))
      .catch(() => setState('forbidden'));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => evaluate(session));

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (state === 'loading') {
    return (
      <div className="cleaner-shell cleaner-noise flex min-h-[100dvh] items-center justify-center">
        <Spinner className="size-6 text-[#f0bd5b]" />
      </div>
    );
  }

  if (state === 'anon') return <Redirect to={ADMIN_LOGIN_PATH} />;

  if (state === 'forbidden') {
    return (
      <div className="cleaner-shell cleaner-noise flex min-h-[100dvh] items-center justify-center px-4 text-[#f5f1e8]">
        <div className="max-w-sm rounded-2xl border border-[#3a2f2a] bg-[#2a1814]/50 p-8 text-center">
          <ShieldAlert className="mx-auto mb-4 h-8 w-8 text-[#f0a497]" />
          <h1 className="text-lg font-semibold">Access restricted</h1>
          <p className="mt-2 text-sm leading-6 text-[#9eabad]">{error ?? 'Your account does not have admin access to this panel.'}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function AdminHeader({
  onLogout,
  label,
}: {
  onLogout: () => void;
  label: string;
}) {
  const [, navigate] = useLocation();
  return (
    <header className="flex items-center justify-between gap-3 border-b border-[#252f33] px-4 py-4 sm:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#f0bd5b]/50 bg-[#f0bd5b]/10 text-[#f0bd5b]">
          <Sparkles size={16} strokeWidth={1.8} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-bold tracking-[-0.02em] text-[#f5f1e8]">
            cleaner<span className="text-[#f0bd5b]">.</span> admin
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#748487]">{label}</p>
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => {
          onLogout();
          navigate('/');
        }}
        className="text-[#9eabad]"
      >
        Log out
      </Button>
    </header>
  );
}