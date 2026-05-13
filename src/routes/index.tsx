import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, MapPin, Bell, BookOpenCheck, ChevronRight, Flame } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";
import { todaySchedule, messMenu, cafeterias, upcomingExams, friends, userProfile, notifications } from "@/lib/mockData";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "KIIT Life+ — Dashboard" },
      { name: "description", content: "Your day at a glance: next class countdown, mess menu, cafeteria status and AI assistant." },
    ],
  }),
});

function parseHHMM(t: string) {
  const [h, m] = t.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function Dashboard() {
  const now = useNow();

  const next = useMemo(() => {
    const upcoming = todaySchedule.find(
      (c) => c.status !== "cancelled" && parseHHMM(c.start).getTime() > now.getTime(),
    );
    return upcoming ?? todaySchedule[0];
  }, [now]);

  const minutesTo = Math.max(0, Math.round((parseHHMM(next.start).getTime() - now.getTime()) / 60000));
  const lunch = messMenu.find((m) => m.slot === "Lunch")!;
  const openCafes = cafeterias.filter((c) => c.open).slice(0, 3);

  return (
    <PhoneShell>
      <header className="px-6 pt-12 pb-4 flex justify-between items-center">
        <div>
          <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-wider mb-1">
            Good {now.getHours() < 12 ? "Morning" : now.getHours() < 17 ? "Afternoon" : "Evening"}, {userProfile.name.split(" ")[0]}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-foreground">{userProfile.hostel} Hostel</span>
            <span className="px-2 py-0.5 rounded-full bg-surface-2 ring-hairline text-[10px] font-medium text-muted-foreground">
              {userProfile.branch}-{userProfile.semester}
            </span>
          </div>
        </div>
        <button
          aria-label="Notifications"
          className="relative size-10 rounded-full bg-surface-2 ring-hairline grid place-items-center text-muted-foreground"
        >
          <Bell className="size-4" />
          <span className="absolute top-2 right-2 size-1.5 rounded-full bg-brand" />
        </button>
      </header>

      {/* Next Class Hero */}
      <section className="px-6 mb-5">
        <div className="bg-surface ring-hairline rounded-3xl p-5 relative overflow-hidden">
          <div className="absolute -right-16 -top-16 size-48 rounded-full bg-brand/10 blur-3xl pointer-events-none" />
          <div className="flex justify-between items-start mb-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand mb-1">Next class</p>
              <h2 className="text-xl font-semibold text-foreground text-balance">{next.subject}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">{next.faculty}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="size-2 rounded-full bg-brand animate-pulse" />
              <span className="text-xs font-semibold text-brand whitespace-nowrap">in {minutesTo}m</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <p className="text-[10px] uppercase text-muted-foreground font-medium tracking-wider">Room</p>
              <p className="text-sm text-foreground mt-0.5">{next.room}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-muted-foreground font-medium tracking-wider">Building</p>
              <p className="text-sm text-foreground mt-0.5">{next.building}</p>
            </div>
          </div>

          <button className="w-full bg-brand text-primary-foreground py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
            <MapPin className="size-4" strokeWidth={2.5} />
            Get directions
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 grid grid-cols-2 gap-4 mb-5">
        <div className="bg-surface ring-hairline rounded-2xl p-4 flex items-center gap-3">
          <AttendanceRing percent={userProfile.attendance} />
          <div>
            <p className="text-[10px] uppercase text-muted-foreground font-semibold">Attendance</p>
            <p className="text-sm font-medium text-foreground">On track</p>
          </div>
        </div>
        <div className="bg-surface ring-hairline rounded-2xl p-4">
          <div className="flex justify-between items-start">
            <p className="text-[10px] uppercase text-muted-foreground font-semibold">CGPA</p>
            <span className="text-[10px] text-brand font-semibold">+0.2</span>
          </div>
          <p className="text-2xl font-semibold text-foreground tracking-tight mt-1">{userProfile.cgpa.toFixed(2)}</p>
          <p className="text-[10px] text-muted-foreground">Semester {userProfile.semester}</p>
        </div>
      </section>

      {/* Mess */}
      <SectionTitle title="Today at the mess" link="/mess" />
      <section className="px-6 mb-5">
        <Link to="/mess" className="block bg-surface ring-hairline rounded-2xl p-5 active:scale-[0.99] transition-transform">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Lunch</p>
              <p className="text-sm text-foreground">{lunch.time}</p>
            </div>
            <RatingPill value={lunch.rating} />
          </div>
          <ul className="space-y-2.5 mb-4">
            {lunch.items.slice(0, 3).map((it) => (
              <li key={it.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`size-1.5 rounded-full ${it.type === "veg" ? "bg-emerald-500" : "bg-red-500"}`} />
                  <span className="text-sm text-foreground/90">{it.name}</span>
                </div>
                {it.tag && (
                  <span className="text-[9px] uppercase font-bold text-brand tracking-wider">{it.tag}</span>
                )}
              </li>
            ))}
          </ul>
          <div className="h-1.5 w-full bg-surface-2 rounded-full overflow-hidden">
            <div className="h-full bg-brand" style={{ width: `${(lunch.rating / 5) * 100}%` }} />
          </div>
        </Link>
      </section>

      {/* Cafeteria status */}
      <SectionTitle title="Live cafeteria status" link="/map" />
      <section className="px-6 mb-5 space-y-2">
        {openCafes.map((c) => (
          <div key={c.id} className="bg-surface ring-hairline rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <span className={`size-2 rounded-full shrink-0 ${
                c.crowd === "Low" ? "bg-emerald-500" : c.crowd === "Medium" ? "bg-amber-400" : "bg-red-500"
              }`} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                <p className="text-[11px] text-muted-foreground">{c.campus} • {c.distance}</p>
              </div>
            </div>
            <span className="text-[11px] text-muted-foreground shrink-0">~{c.waitMins}m wait</span>
          </div>
        ))}
      </section>

      {/* Schedule */}
      <SectionTitle title="Today's schedule" />
      <section className="px-6 mb-5 space-y-2">
        {todaySchedule.map((c) => (
          <div key={c.id} className="bg-surface ring-hairline rounded-xl p-3 flex items-center gap-3">
            <div className="font-mono text-[11px] text-muted-foreground w-12 shrink-0">{c.start}</div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${c.status === "cancelled" ? "text-muted-foreground line-through" : "text-foreground"}`}>
                {c.subject}
              </p>
              <p className="text-[11px] text-muted-foreground">{c.room} • {c.type}</p>
            </div>
            {c.status === "cancelled" && (
              <span className="text-[9px] uppercase font-bold text-red-400 tracking-wider">Cancelled</span>
            )}
          </div>
        ))}
      </section>

      {/* Exams */}
      <SectionTitle title="Upcoming exams" />
      <section className="px-6 mb-5 space-y-2">
        {upcomingExams.map((e) => (
          <div key={e.name} className="bg-surface ring-hairline rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-surface-2 grid place-items-center">
                <BookOpenCheck className="size-4 text-brand" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{e.name}</p>
                <p className="text-[11px] text-muted-foreground">{e.date} • {e.room}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">{e.days}d</p>
              <p className="text-[10px] text-muted-foreground">to go</p>
            </div>
          </div>
        ))}
      </section>

      {/* Friends */}
      <SectionTitle title="Friends right now" />
      <section className="px-6 mb-5 space-y-2">
        {friends.map((f) => (
          <div key={f.name} className="bg-surface ring-hairline rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-gradient-to-br from-brand/40 to-brand/10 grid place-items-center text-xs font-bold text-foreground">
                {f.name[0]}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{f.name} <span className="text-muted-foreground font-normal">• {f.branch}</span></p>
                <p className="text-[11px] text-muted-foreground">{f.nextClass}</p>
              </div>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${f.free ? "text-brand" : "text-muted-foreground"}`}>
              {f.free ? "Free" : "In class"}
            </span>
          </div>
        ))}
      </section>

      {/* Notifications */}
      <SectionTitle title="Latest alerts" />
      <section className="px-6 mb-8 space-y-2">
        {notifications.slice(0, 3).map((n) => (
          <div key={n.id} className="bg-surface ring-hairline rounded-xl p-3 flex items-start gap-3">
            <div className="size-8 rounded-lg bg-surface-2 grid place-items-center shrink-0">
              <Flame className="size-4 text-brand" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between gap-2">
                <p className="text-sm font-medium text-foreground truncate">{n.title}</p>
                <span className="text-[10px] text-muted-foreground shrink-0">{n.time}</span>
              </div>
              <p className="text-[11px] text-muted-foreground line-clamp-2">{n.body}</p>
            </div>
          </div>
        ))}
      </section>
    </PhoneShell>
  );
}

function SectionTitle({ title, link }: { title: string; link?: string }) {
  return (
    <div className="px-6 mb-2.5 mt-1 flex items-center justify-between">
      <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{title}</h3>
      {link && (
        <Link to={link} className="text-[11px] font-semibold text-brand flex items-center gap-0.5">
          See all <ChevronRight className="size-3" />
        </Link>
      )}
    </div>
  );
}

function AttendanceRing({ percent }: { percent: number }) {
  return (
    <div
      className="relative size-12 rounded-full grid place-items-center"
      style={{
        background: `conic-gradient(var(--brand) ${percent}%, color-mix(in oklab, var(--surface-2) 100%, transparent) 0)`,
      }}
    >
      <div className="absolute inset-1 rounded-full bg-surface" />
      <span className="relative text-xs font-bold text-foreground">{percent}%</span>
    </div>
  );
}

function RatingPill({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-surface-2 ring-hairline">
      <ArrowUpRight className="size-3 text-brand" />
      <span className="text-[11px] font-bold text-foreground">{value.toFixed(1)}</span>
    </div>
  );
}
