import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, MessageCircle, Plus } from "lucide-react";
import { PhoneShell, ScreenHeader } from "@/components/PhoneShell";
import { feedPosts, type FeedPost } from "@/lib/mockData";

export const Route = createFileRoute("/_authenticated/community")({
  component: CommunityPage,
  head: () => ({
    meta: [
      { title: "KIIT Life+ — Community" },
      { name: "description", content: "Anonymous feed, lost & found, marketplace and event chatter for KIIT students." },
    ],
  }),
});

const channels: FeedPost["channel"][] = ["Anonymous", "Lost & Found", "Marketplace", "Mess Reviews", "Events"];

function CommunityPage() {
  const [active, setActive] = useState<FeedPost["channel"] | "All">("All");
  const list = active === "All" ? feedPosts : feedPosts.filter((p) => p.channel === active);

  return (
    <PhoneShell>
      <ScreenHeader
        eyebrow="Student feed"
        title="Community"
        trailing={
          <button className="size-10 rounded-full bg-brand text-primary-foreground grid place-items-center" aria-label="New post">
            <Plus className="size-4" strokeWidth={2.5} />
          </button>
        }
      />

      <div className="px-6 mb-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {(["All", ...channels] as const).map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold ring-hairline ${
              active === c ? "bg-brand text-primary-foreground" : "bg-surface text-muted-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <section className="px-6 space-y-3 mb-8">
        {list.map((p) => (
          <article key={p.id} className="bg-surface ring-hairline rounded-2xl p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-full bg-gradient-to-br from-brand/40 to-brand/5 grid place-items-center text-xs font-bold">
                  {p.author[0]}
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{p.author}</p>
                  <p className="text-[10px] text-muted-foreground">{p.channel} • {p.time}</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed mb-3">{p.body}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <button className="flex items-center gap-1.5 hover:text-brand">
                <Heart className="size-3.5" />
                {p.likes}
              </button>
              <button className="flex items-center gap-1.5 hover:text-brand">
                <MessageCircle className="size-3.5" />
                {p.comments}
              </button>
            </div>
          </article>
        ))}
      </section>
    </PhoneShell>
  );
}
