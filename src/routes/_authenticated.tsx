import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, MailCheck, RefreshCw, LogOut } from "lucide-react";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (ready && !session) {
      navigate({ to: "/login", replace: true });
    }
  }, [ready, session, navigate]);

  if (!ready || !session) {
    return (
      <div className="min-h-screen grid place-items-center bg-background text-muted-foreground text-sm">
        Loading…
      </div>
    );
  }

  const verified = Boolean(session.user.email_confirmed_at ?? (session.user as { confirmed_at?: string }).confirmed_at);
  if (!verified) {
    return <VerifyEmailGate email={session.user.email ?? ""} />;
  }

  return <Outlet />;
}

function VerifyEmailGate({ email }: { email: string }) {
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  // Auto-poll: refresh session every 5s in case the user verified in another tab.
  useEffect(() => {
    const id = setInterval(() => {
      supabase.auth.refreshSession();
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const resend = async () => {
    setSending(true);
    setMsg(null);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${window.location.origin}/` },
    });
    setSending(false);
    setMsg(
      error
        ? { kind: "err", text: error.message }
        : { kind: "ok", text: "Verification email sent. Check your inbox." }
    );
  };

  const recheck = async () => {
    setChecking(true);
    await supabase.auth.refreshSession();
    setChecking(false);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="mx-auto size-12 rounded-2xl bg-gradient-to-br from-brand to-brand/40 grid place-items-center mb-4">
            <MailCheck className="size-5 text-background" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Verify your email</h1>
          <p className="text-sm text-muted-foreground mt-1">
            We sent a verification link to
          </p>
          <p className="text-sm font-medium text-foreground mt-0.5 break-all">{email}</p>
        </div>

        <div className="bg-surface ring-hairline rounded-3xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 ring-1 ring-amber-500/20 rounded-lg px-3 py-2">
            <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
            Pending verification — access blocked until confirmed.
          </div>

          {msg && (
            <p
              className={`text-xs rounded-lg px-3 py-2 ${
                msg.kind === "ok"
                  ? "text-emerald-400 bg-emerald-500/10 ring-1 ring-emerald-500/20"
                  : "text-red-400 bg-red-500/10 ring-1 ring-red-500/20"
              }`}
            >
              {msg.text}
            </p>
          )}

          <button
            onClick={recheck}
            disabled={checking}
            className="w-full h-11 rounded-xl bg-brand text-background text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {checking && <Loader2 className="size-4 animate-spin" />}
            I've verified — continue
          </button>

          <button
            onClick={resend}
            disabled={sending}
            className="w-full h-11 rounded-xl bg-surface-2 ring-hairline text-foreground text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {sending ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
            Resend verification email
          </button>

          <button
            onClick={signOut}
            className="w-full h-10 rounded-xl text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-2"
          >
            <LogOut className="size-3.5" />
            Use a different account
          </button>
        </div>

        <p className="text-[11px] text-muted-foreground text-center mt-6">
          Didn't get it? Check spam, or wait a minute and try again.
        </p>
      </div>
    </div>
  );
}