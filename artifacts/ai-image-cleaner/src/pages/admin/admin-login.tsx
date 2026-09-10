import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { Sparkles, LockKeyhole, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { ADMIN_DASHBOARD_PATH } from '@/lib/admin-config';
import { signIn } from '@/lib/blog-data';

const MAX_BACKOFF = 30_000;

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const attemptsRef = useRef(0);
  const cooldownUntilRef = useRef(0);
  const [, navigate] = useLocation();

  useEffect(() => {
    let active = true;
    if (!isSupabaseConfigured()) return;
    getSupabase()
      .auth.getSession()
      .then(({ data }) => {
        if (!active || !data.session) {
          setSigningIn(false);
          return;
        }
        const role = data.session.user?.app_metadata?.role;
        if (role === 'admin') navigate(ADMIN_DASHBOARD_PATH, { replace: true });
        else setSigningIn(false);
      })
      .catch(() => setSigningIn(false));
    return () => {
      active = false;
    };
  }, [navigate]);

  const submit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      const now = Date.now();
      if (now < cooldownUntilRef.current) {
        const wait = Math.ceil((cooldownUntilRef.current - now) / 1000);
        setError(`Too many attempts. Try again in ${wait}s.`);
        return;
      }
      if (!email.trim() || !password) {
        setError('Enter your email and password.');
        return;
      }
      setError(null);
      setSubmitting(true);
      try {
        await signIn(email.trim(), password);
        navigate(ADMIN_DASHBOARD_PATH, { replace: true });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unable to sign in.';
        setError(message);
        attemptsRef.current += 1;
        const delay = Math.min(MAX_BACKOFF, attemptsRef.current * 2_500);
        cooldownUntilRef.current = Date.now() + delay;
      } finally {
        setSubmitting(false);
      }
    },
    [email, password, navigate],
  );

  if (!isSupabaseConfigured()) {
    return (
      <main className="cleaner-shell cleaner-noise flex min-h-[100dvh] items-center justify-center px-4 text-[#f5f1e8]">
        <Card className="w-full max-w-sm border-[#293337] bg-[#151b1e]/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#f5f1e8]">
              <AlertTriangle className="h-4 w-4 text-[#f0bd5b]" /> Not configured
            </CardTitle>
            <CardDescription className="text-[#9eabad]">
              Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in a .env file, then restart the dev server.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  if (signingIn) {
    return (
      <main className="cleaner-shell cleaner-noise flex min-h-[100dvh] items-center justify-center text-[#f5f1e8]">
        <Spinner className="size-6 text-[#f0bd5b]" />
      </main>
    );
  }

  return (
    <main className="cleaner-shell cleaner-noise relative flex min-h-[100dvh] items-center justify-center px-4 py-10 text-[#f5f1e8]">
      <div className="cleaner-grid absolute inset-0" />
      <div className="relative w-full max-w-sm">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#f0bd5b]/50 bg-[#f0bd5b]/10 text-[#f0bd5b]">
            <Sparkles size={20} strokeWidth={1.8} />
          </span>
          <span>
            <span className="block text-lg font-bold tracking-[-0.02em]">
              cleaner<span className="text-[#f0bd5b]">.</span>
            </span>
            <span className="block font-mono text-[10px] uppercase tracking-[.18em] text-[#748487]">
              admin access
            </span>
          </span>
        </div>
        <Card className="cleaner-animate-in w-full border-[#293337] bg-[#151b1e]/90 shadow-none">
          <CardHeader>
            <CardTitle className="text-[15px] text-[#f5f1e8]">Sign in to manage your site</CardTitle>
            <CardDescription className="text-xs text-[#9eabad]">
              Use the admin credentials created for this account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="admin-email" className="text-xs text-[#9eabad]">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-[#36454a] bg-[#101517] text-[#f5f1e8]"
                  disabled={submitting}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="admin-password" className="text-xs text-[#9eabad]">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-[#36454a] bg-[#101517] text-[#f5f1e8]"
                  disabled={submitting}
                />
              </div>
              {error && (
                <p className="flex items-start gap-2 rounded-lg border border-[#3a2f2a] bg-[#2a1814]/60 px-3 py-2 text-xs leading-5 text-[#f0a497]">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>{error}</span>
                </p>
              )}
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? <Spinner className="size-4" /> : <LockKeyhole className="size-4" />}
                {submitting ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[.18em] text-[#546165]">
          Restricted area · unauthorized use is logged out instantly
        </p>
      </div>
    </main>
  );
}