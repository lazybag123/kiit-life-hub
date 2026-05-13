import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Star, MapPin } from "lucide-react";
import { PhoneShell, ScreenHeader } from "@/components/PhoneShell";
import { cafeterias } from "@/lib/mockData";

export const Route = createFileRoute("/map")({
  component: MapPage,
  head: () => ({
    meta: [
      { title: "KIIT Life+ — Campus Food Map" },
      { name: "description", content: "Cafeterias, Khao Galli and night canteens around KIIT campus." },
    ],
  }),
});

const filters = ["All", "Cafeteria", "Khao Galli", "Cafe", "Night Canteen"] as const;

function MapPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [q, setQ] = useState("");

  const list = cafeterias.filter(
    (c) =>
      (filter === "All" || c.category === filter) &&
      (q === "" || c.name.toLowerCase().includes(q.toLowerCase()) || c.popular.some((p) => p.toLowerCase().includes(q.toLowerCase()))),
  );

  return (
    <PhoneShell>
      <ScreenHeader eyebrow="Around campus" title="Food map" />

      {/* Search */}
      <div className="px-6 mb-3">
        <div className="bg-surface ring-hairline rounded-xl flex items-center gap-2 px-3 py-2.5">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search cold coffee, biryani, maggi…"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 mb-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold ring-hairline ${
              filter === f ? "bg-brand text-primary-foreground" : "bg-surface text-muted-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Faux Map */}
      <section className="px-6 mb-5">
        <div className="relative h-44 rounded-2xl overflow-hidden ring-hairline bg-surface">
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "linear-gradient(color-mix(in oklab, var(--brand) 30%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--brand) 30%, transparent) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          {list.slice(0, 4).map((c, i) => (
            <div
              key={c.id}
              className="absolute size-7 rounded-full bg-brand text-primary-foreground grid place-items-center text-[10px] font-bold shadow-lg shadow-brand/30"
              style={{ left: `${15 + i * 22}%`, top: `${30 + ((i * 17) % 40)}%` }}
            >
              {i + 1}
            </div>
          ))}
          <div className="absolute bottom-3 left-3 right-3 glass ring-hairline rounded-lg px-3 py-2 flex items-center gap-2">
            <MapPin className="size-3.5 text-brand" />
            <span className="text-[11px] text-foreground">{list.length} places near KP-7 hostel</span>
          </div>
        </div>
      </section>

      {/* List */}
      <section className="px-6 space-y-3 mb-8">
        {list.map((c) => (
          <div key={c.id} className="bg-surface ring-hairline rounded-2xl p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{c.name}</p>
                <p className="text-[11px] text-muted-foreground">{c.campus} • {c.distance}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Star className="size-3 fill-brand text-brand" />
                <span className="text-xs font-semibold">{c.rating}</span>
              </div>
            </div>
            <div className="flex gap-1.5 flex-wrap mb-3">
              {c.popular.map((p) => (
                <span key={p} className="text-[10px] px-2 py-0.5 rounded-full bg-surface-2 text-muted-foreground ring-hairline">
                  {p}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-3">
                <StatusDot open={c.open} crowd={c.crowd} />
                <span className="text-muted-foreground">{c.priceRange}</span>
              </div>
              <span className="text-muted-foreground">{c.open ? `~${c.waitMins}m wait` : "Closed"}</span>
            </div>
          </div>
        ))}
      </section>
    </PhoneShell>
  );
}

function StatusDot({ open, crowd }: { open: boolean; crowd: "Low" | "Medium" | "High" }) {
  const color = !open
    ? "bg-muted-foreground/50"
    : crowd === "Low"
    ? "bg-emerald-500"
    : crowd === "Medium"
    ? "bg-amber-400"
    : "bg-red-500";
  return (
    <span className="flex items-center gap-1.5">
      <span className={`size-1.5 rounded-full ${color}`} />
      <span className="text-foreground/80">{open ? `${crowd} crowd` : "Closed"}</span>
    </span>
  );
}
