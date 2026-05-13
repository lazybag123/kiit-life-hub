import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneShell, ScreenHeader } from "@/components/PhoneShell";
import { messMenu } from "@/lib/mockData";
import { Star } from "lucide-react";

export const Route = createFileRoute("/mess")({
  component: MessPage,
  head: () => ({
    meta: [
      { title: "KIIT Life+ — Hostel Mess" },
      { name: "description", content: "Live mess menu, timings and ratings for KIIT hostels." },
    ],
  }),
});

function MessPage() {
  const [active, setActive] = useState(messMenu[1].slot);
  const meal = messMenu.find((m) => m.slot === active)!;

  return (
    <PhoneShell>
      <ScreenHeader eyebrow="KP-7 Hostel" title="Mess menu" />

      {/* Slot tabs */}
      <div className="px-6 mb-5 flex gap-2 overflow-x-auto scrollbar-hide">
        {messMenu.map((m) => {
          const isActive = m.slot === active;
          return (
            <button
              key={m.slot}
              onClick={() => setActive(m.slot)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold ring-hairline transition-colors ${
                isActive ? "bg-brand text-primary-foreground" : "bg-surface text-muted-foreground"
              }`}
            >
              {m.slot}
            </button>
          );
        })}
      </div>

      {/* Active meal */}
      <section className="px-6 mb-5">
        <div className="bg-surface ring-hairline rounded-3xl p-5">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-foreground tracking-tight">{meal.slot}</h2>
              <p className="text-sm text-muted-foreground">{meal.time}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">{meal.rating.toFixed(1)}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{meal.votes} votes</p>
            </div>
          </div>

          <ul className="space-y-3 mb-5">
            {meal.items.map((it) => (
              <li key={it.name} className="flex items-center justify-between bg-surface-2/60 ring-hairline rounded-xl px-3 py-2.5">
                <div className="flex items-center gap-3">
                  <span
                    className={`size-3 rounded-sm ring-1 ${
                      it.type === "veg" ? "bg-emerald-500/30 ring-emerald-500" : "bg-red-500/30 ring-red-500"
                    }`}
                  />
                  <span className="text-sm text-foreground">{it.name}</span>
                </div>
                {it.tag && (
                  <span className="text-[9px] uppercase font-bold text-brand tracking-wider">{it.tag}</span>
                )}
              </li>
            ))}
          </ul>

          <RateBar />
        </div>
      </section>

      {/* Reviews */}
      <div className="px-6 mb-2.5">
        <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Recent reviews</h3>
      </div>
      <section className="px-6 space-y-2 mb-8">
        {[
          { user: "Riya • CSE-12", text: "Paneer was actually creamy today, surprised!", rating: 5, time: "20m" },
          { user: "Rohit • IT-04", text: "Rice undercooked again, dal was ok.", rating: 3, time: "1h" },
          { user: "Anonymous", text: "Mess upgrade arc 💪", rating: 4, time: "3h" },
        ].map((r, i) => (
          <div key={i} className="bg-surface ring-hairline rounded-xl p-3">
            <div className="flex justify-between items-center mb-1">
              <p className="text-xs font-semibold text-foreground">{r.user}</p>
              <div className="flex items-center gap-1">
                <Star className="size-3 fill-brand text-brand" />
                <span className="text-xs font-semibold">{r.rating}</span>
                <span className="text-[10px] text-muted-foreground ml-1">{r.time}</span>
              </div>
            </div>
            <p className="text-sm text-foreground/90">{r.text}</p>
          </div>
        ))}
      </section>
    </PhoneShell>
  );
}

function RateBar() {
  const [rating, setRating] = useState(0);
  return (
    <div className="bg-surface-2/60 ring-hairline rounded-xl p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2">Rate this meal</p>
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setRating(n)} aria-label={`${n} stars`}>
              <Star className={`size-6 ${n <= rating ? "fill-brand text-brand" : "text-muted-foreground"}`} />
            </button>
          ))}
        </div>
        <button className="text-xs font-semibold text-brand">Comment</button>
      </div>
    </div>
  );
}
