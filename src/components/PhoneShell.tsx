import { Link, useLocation } from "@tanstack/react-router";
import { Home, UtensilsCrossed, MapPin, Users, User, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/mess", label: "Mess", icon: UtensilsCrossed },
  { to: "/map", label: "Map", icon: MapPin },
  { to: "/community", label: "Community", icon: Users },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function PhoneShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAssistant = pathname === "/assistant";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto w-full max-w-[480px] min-h-screen bg-surface/30 border-x border-hairline flex flex-col relative pb-28">
        {children}

        {/* Floating AI Assistant */}
        {!isAssistant && (
          <Link
            to="/assistant"
            aria-label="Open AI assistant"
            className="fixed z-50 bottom-24 right-[max(1rem,calc(50%-220px))] size-14 rounded-full bg-brand text-primary-foreground shadow-[0_10px_40px_-8px_color-mix(in_oklab,var(--brand)_70%,transparent)] flex items-center justify-center active:scale-90 transition-transform"
          >
            <Sparkles className="size-6" strokeWidth={2.4} />
          </Link>
        )}

        {/* Bottom Nav */}
        <nav className="fixed z-40 bottom-0 inset-x-0 pointer-events-none">
          <div className="mx-auto max-w-[480px] px-3 pb-3 pt-2">
            <div className="pointer-events-auto glass ring-hairline rounded-2xl px-2 py-2 flex items-center justify-between">
              {tabs.map(({ to, label, icon: Icon }) => {
                const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex-1 flex flex-col items-center gap-1 py-1.5 rounded-xl transition-colors ${
                      active ? "text-brand" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="size-5" strokeWidth={active ? 2.4 : 1.8} />
                    <span className="text-[10px] font-semibold tracking-wide">{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </main>
    </div>
  );
}

export function ScreenHeader({
  eyebrow,
  title,
  trailing,
}: {
  eyebrow?: string;
  title: string;
  trailing?: ReactNode;
}) {
  return (
    <header className="px-6 pt-12 pb-4 flex justify-between items-end">
      <div>
        {eyebrow && (
          <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-wider mb-1">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
      </div>
      {trailing}
    </header>
  );
}
