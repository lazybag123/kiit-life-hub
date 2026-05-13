import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Settings, LogOut, Bell, Moon, BookOpen, Trophy, Calendar, ChevronRight } from "lucide-react";
import { PhoneShell, ScreenHeader } from "@/components/PhoneShell";
import { userProfile } from "@/lib/mockData";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: "KIIT Life+ — Profile" },
      { name: "description", content: "Your KIIT Life+ profile, attendance, CGPA and settings." },
    ],
  }),
});

function ProfilePage() {
  const navigate = useNavigate();
  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  };
  return (
    <PhoneShell>
      <ScreenHeader
        eyebrow="Account"
        title="Profile"
        trailing={
          <button className="size-10 rounded-full bg-surface ring-hairline grid place-items-center text-muted-foreground" aria-label="Settings">
            <Settings className="size-4" />
          </button>
        }
      />

      {/* Profile card */}
      <section className="px-6 mb-5">
        <div className="bg-surface ring-hairline rounded-3xl p-5 text-center">
          <div className="mx-auto size-20 rounded-full bg-gradient-to-br from-brand/50 to-brand/10 grid place-items-center text-2xl font-bold text-foreground mb-3">
            {userProfile.name[0]}
          </div>
          <h2 className="text-lg font-semibold text-foreground">{userProfile.name}</h2>
          <p className="text-xs text-muted-foreground">{userProfile.email}</p>
          <div className="mt-3 flex justify-center gap-2">
            <Chip>{userProfile.branch} • Sem {userProfile.semester}</Chip>
            <Chip>{userProfile.hostel}</Chip>
            <Chip>Roll {userProfile.rollNo}</Chip>
          </div>
        </div>
      </section>

      {/* Stat grid */}
      <section className="px-6 mb-5 grid grid-cols-3 gap-3">
        <Stat label="CGPA" value={userProfile.cgpa.toFixed(2)} />
        <Stat label="Attendance" value={`${userProfile.attendance}%`} />
        <Stat label="Streak" value="14d" />
      </section>

      {/* Menu */}
      <section className="px-6 mb-8 space-y-2">
        {[
          { label: "My timetable", icon: Calendar },
          { label: "Exam schedule", icon: BookOpen },
          { label: "Achievements", icon: Trophy },
          { label: "Notifications", icon: Bell },
          { label: "Appearance", icon: Moon },
        ].map((m) => (
          <button
            key={m.label}
            className="w-full bg-surface ring-hairline rounded-xl p-3.5 flex items-center gap-3 text-left"
          >
            <div className="size-9 rounded-lg bg-surface-2 grid place-items-center">
              <m.icon className="size-4 text-brand" />
            </div>
            <span className="flex-1 text-sm text-foreground">{m.label}</span>
            <ChevronRight className="size-4 text-muted-foreground" />
          </button>
        ))}

        <button onClick={signOut} className="w-full ring-hairline rounded-xl p-3.5 flex items-center gap-3 text-left text-red-400 mt-4">
          <div className="size-9 rounded-lg bg-red-500/10 grid place-items-center">
            <LogOut className="size-4" />
          </div>
          <span className="text-sm font-medium">Sign out</span>
        </button>
      </section>
    </PhoneShell>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2.5 py-1 rounded-full bg-surface-2 ring-hairline text-[10px] font-medium text-muted-foreground">
      {children}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface ring-hairline rounded-2xl p-4 text-center">
      <p className="text-xl font-bold text-foreground tracking-tight">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mt-0.5">{label}</p>
    </div>
  );
}
