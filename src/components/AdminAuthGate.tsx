import React, { createContext, FormEvent, ReactNode, useContext, useEffect, useState } from 'react';

type StoredSession = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user_id: string;
  email?: string;
};

const SESSION_KEY = 'nb_admin_session_v1';
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

async function authRequest(path: string, init: RequestInit = {}) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Admin authentication is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the deployment environment.');
  }
  const response = await fetch(`${supabaseUrl}${path}`, {
    ...init,
    headers: {
      apikey: supabaseAnonKey,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload.msg || payload.message || payload.error_description || payload.error || 'Authentication request failed.';
    throw new Error(message);
  }
  return payload;
}

async function verifyAdmin(accessToken: string) {
  const user = await authRequest('/auth/v1/user', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const roles = await authRequest(
    `/rest/v1/user_roles?select=role&user_id=eq.${encodeURIComponent(user.id)}&role=eq.admin&limit=1`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  if (!Array.isArray(roles) || !roles.some((row: { role?: string }) => row.role === 'admin')) {
    throw new Error('This account is authenticated but does not have the Admin role.');
  }
  return { user_id: user.id, email: user.email as string | undefined };
}

async function refreshSession(session: StoredSession): Promise<StoredSession> {
  const refreshed = await authRequest('/auth/v1/token?grant_type=refresh_token', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  });
  const identity = await verifyAdmin(refreshed.access_token);
  return {
    access_token: refreshed.access_token,
    refresh_token: refreshed.refresh_token,
    expires_at: Math.floor(Date.now() / 1000) + Number(refreshed.expires_in || 3600),
    ...identity,
  };
}

type Props = { children: ReactNode };

const AdminSessionContext = createContext<{ accessToken: string }>({ accessToken: '' });
export const useAdminSession = () => useContext(AdminSessionContext);

export function AdminAuthGate({ children }: Props) {
  const [session, setSession] = useState<StoredSession | null>(null);
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const raw = sessionStorage.getItem(SESSION_KEY);
        if (!raw) return;
        let saved = JSON.parse(raw) as StoredSession;
        if (saved.expires_at < Math.floor(Date.now() / 1000) + 60) {
          saved = await refreshSession(saved);
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(saved));
        } else {
          const identity = await verifyAdmin(saved.access_token);
          saved = { ...saved, ...identity };
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(saved));
        }
        if (active) setSession(saved);
      } catch {
        sessionStorage.removeItem(SESSION_KEY);
      } finally {
        if (active) setChecking(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const signIn = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const result = await authRequest('/auth/v1/token?grant_type=password', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const identity = await verifyAdmin(result.access_token);
      const next: StoredSession = {
        access_token: result.access_token,
        refresh_token: result.refresh_token,
        expires_at: Math.floor(Date.now() / 1000) + Number(result.expires_in || 3600),
        ...identity,
      };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
      setSession(next);
      setPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    const current = session;
    sessionStorage.removeItem(SESSION_KEY);
    setSession(null);
    if (current?.access_token) {
      try {
        await authRequest('/auth/v1/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${current.access_token}` },
        });
      } catch {
        // Local session is already cleared; server-side expiry remains the fallback.
      }
    }
  };

  if (checking) {
    return (
      <main className="min-h-screen grid place-items-center bg-[#150206] text-white">
        <div className="glass-panel rounded-2xl px-6 py-5 text-sm text-rose-100/80">Verifying secure admin session…</div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#150206] text-white grid place-items-center px-4 py-10">
        <div className="pointer-events-none absolute inset-0 opacity-80" style={{ background: 'radial-gradient(circle at 18% 15%, rgba(185,28,28,.30), transparent 34%), radial-gradient(circle at 85% 80%, rgba(245,158,11,.10), transparent 28%)' }} />
        <a href="https://nextborder.online" className="absolute left-5 top-5 z-10 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-rose-100/80 transition hover:bg-white/10">
          ← Back to NextBorder Website
        </a>
        <form onSubmit={signIn} className="glass-panel relative z-10 w-full max-w-md rounded-[28px] p-7 sm:p-9 shadow-2xl">
          <div className="mb-7 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-900 font-black tracking-tight shadow-lg shadow-red-950/50">NB</div>
            <div>
              <p className="text-[10px] uppercase tracking-[.28em] text-rose-200/60">NextBorder Visa Consultancy</p>
              <h1 className="mt-1 text-xl font-semibold tracking-tight">Admin Console</h1>
            </div>
          </div>
          <p className="mb-6 text-sm leading-6 text-rose-100/65">Sign in with your Supabase admin account. Access is granted only when your account has the <span className="font-semibold text-white">admin</span> role.</p>
          <label className="mb-2 block text-xs font-medium text-rose-100/75" htmlFor="admin-email">Email address</label>
          <input id="admin-email" type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} className="glass-input mb-4 w-full rounded-xl px-4 py-3 text-sm" placeholder="admin@example.com" />
          <label className="mb-2 block text-xs font-medium text-rose-100/75" htmlFor="admin-password">Password</label>
          <input id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} className="glass-input mb-4 w-full rounded-xl px-4 py-3 text-sm" placeholder="Your admin password" />
          {error && <p role="alert" className="mb-4 rounded-xl border border-red-400/25 bg-red-950/35 px-3 py-2 text-xs leading-5 text-red-200">{error}</p>}
          <button type="submit" disabled={busy} className="glass-pill-active mt-2 w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-wait disabled:opacity-60">
            {busy ? 'Verifying account…' : 'Secure Admin Sign In'}
          </button>
          <p className="mt-5 text-center text-[10px] text-rose-100/40">Protected by Supabase Authentication · Admin role verification</p>
        </form>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#150206] text-white">
      <div className="relative z-[60] flex min-h-12 items-center justify-between gap-3 border-b border-white/10 bg-[#150206]/85 px-4 py-2 backdrop-blur-xl sm:px-6">
        <a href="https://nextborder.online" className="text-xs font-medium text-rose-100/75 transition hover:text-white">← Back to Public Website</a>
        <div className="flex items-center gap-3">
          <span className="hidden text-[11px] text-rose-100/50 sm:inline">{session.email || 'Admin'} · verified</span>
          <button onClick={signOut} className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-rose-100/80 transition hover:border-red-300/40 hover:bg-red-950/40 hover:text-white">Sign out</button>
        </div>
      </div>
      {children}
    </div>
  );
}
