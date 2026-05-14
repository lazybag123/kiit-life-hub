import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mail, Lock, Sparkles } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "KIIT Life+ — Sign in" },
      { name: "description", content: "Sign in to KIIT Life+ to access your campus dashboard, mess menu and AI assistant." },
    ],
  }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/", replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (s) navigate({ to: "/", replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        setInfo("Account created. Check your inbox for a verification link before signing in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="mx-auto size-12 rounded-2xl bg-gradient-to-br from-brand to-brand/40 grid place-items-center mb-4">
            <Sparkles className="size-5 text-background" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">KIIT Life+</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "signin" ? "Welcome back. Sign in to continue." : "Create your campus account."}
          </p>
        </div>

        <form onSubmit={onSubmit} className="bg-surface ring-hairline rounded-3xl p-5 space-y-3">
          {mode === "signup" && (
            <Field label="Full name">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aarav Sharma"
                className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground/60"
              />
            </Field>
          )}
          <Field label="KIIT email" icon={<Mail className="size-4" />}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@kiit.ac.in"
              autoComplete="email"
              className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground/60"
            />
          </Field>
          <Field label="Password" icon={<Lock className="size-4" />}>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground/60"
            />
          </Field>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 ring-1 ring-red-500/20 rounded-lg px-3 py-2">{error}</p>
          )}
          {info && (
            <p className="text-xs text-emerald-400 bg-emerald-500/10 ring-1 ring-emerald-500/20 rounded-lg px-3 py-2">{info}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-brand text-background text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>

          <button
            type="button"
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); setInfo(null); }}
            className="w-full text-xs text-muted-foreground hover:text-foreground transition"
          >
            {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
          </button>
        </form>

        <p className="text-[11px] text-muted-foreground text-center mt-6">
          By continuing you agree to KIIT Life+ campus terms.
          <br />
          <Link to="/" className="underline underline-offset-2">Back home</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</span>
      <div className="mt-1.5 flex items-center gap-2 bg-surface-2 ring-hairline rounded-xl px-3 h-11 text-foreground">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        {children}
      </div>
    </label>
  );
}