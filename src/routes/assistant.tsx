import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Send, Sparkles } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";

export const Route = createFileRoute("/assistant")({
  component: AssistantPage,
  head: () => ({
    meta: [
      { title: "KIIT Life+ — AI Assistant" },
      { name: "description", content: "Ask anything about your timetable, mess menu and campus food." },
    ],
  }),
});

type Msg = { role: "user" | "assistant"; text: string };

const starters = [
  "Where is my next class?",
  "What's for dinner today?",
  "Cheapest chicken meal nearby?",
  "Which class is cancelled?",
];

function fakeReply(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes("next class")) return "Your next class is **Algorithm Design** at 09:00 in Room C-302, SCS Block (Campus 15). Leave KP-7 in ~10 minutes — it's a 7 min walk.";
  if (p.includes("dinner")) return "Tonight's dinner (19:30 – 21:30): Paneer Butter Masala, Chicken Handi, Jeera Rice and Gulab Jamun. Currently rated 4.4 / 5 by hostelers.";
  if (p.includes("cancel")) return "Software Engineering at 14:30 has been **cancelled** by Dr. P. Mishra. Your next active class after lunch is Operating Systems at 16:00.";
  if (p.includes("cheap") || p.includes("chicken")) return "Cheapest chicken option right now: Night Hunger Hub (KP-7) — chicken maggi at ₹70, low crowd, ~4 min wait.";
  if (p.includes("cold coffee")) return "Kings Food Court (Campus 15) has cold coffee at ₹60, low crowd right now. 2 min walk from your hostel.";
  return "I can help with your timetable, mess menu, exams and campus food. Try one of the suggestions below 👇";
}

function AssistantPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", text: "Hey Aryan 👋 I'm your KIIT Life+ assistant. Ask me about classes, mess or food spots." },
  ]);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }, { role: "assistant", text: fakeReply(text) }]);
    setInput("");
  };

  return (
    <PhoneShell>
      <header className="px-6 pt-12 pb-4 flex items-center gap-3">
        <Link to="/" className="size-10 rounded-full bg-surface ring-hairline grid place-items-center text-muted-foreground" aria-label="Back">
          <ArrowLeft className="size-4" />
        </Link>
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-full bg-brand grid place-items-center">
            <Sparkles className="size-4 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Campus AI</p>
            <p className="text-[10px] text-brand">Online</p>
          </div>
        </div>
      </header>

      <section className="flex-1 px-4 space-y-3 mb-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-brand text-primary-foreground rounded-br-md"
                  : "bg-surface ring-hairline text-foreground rounded-bl-md"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </section>

      {messages.length <= 1 && (
        <div className="px-4 mb-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {starters.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="shrink-0 px-3 py-2 rounded-full bg-surface ring-hairline text-xs text-muted-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="sticky bottom-24 px-4 pb-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="bg-surface ring-hairline rounded-2xl px-3 py-2 flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the campus AI…"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none px-1"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="size-9 rounded-xl bg-brand text-primary-foreground grid place-items-center disabled:opacity-40"
            aria-label="Send"
          >
            <Send className="size-4" />
          </button>
        </form>
      </div>
    </PhoneShell>
  );
}
