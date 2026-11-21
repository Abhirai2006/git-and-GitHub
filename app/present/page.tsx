import type { Metadata } from "next";
import { ArrowUpRight, Clock, Lock, Presentation } from "lucide-react";
import { decks } from "@/lib/deckData";

export const metadata: Metadata = {
  title: "Slides - viva.prep",
  description: "Every class presentation for BAIL308C, Project Management with Git. Open any deck in your browser.",
};

const grads = [
  "from-[#2563FF] to-[#7C3AED]",
  "from-[#FF9E00] via-[#FF4D2E] to-[#FF2E88]",
  "from-[#00A862] to-[#00B2D6]",
  "from-[#FF2E88] to-[#7C3AED]",
];

export default function PresentPage() {
  return (
    <section className="mx-auto max-w-6xl px-5 sm:px-8 py-14 sm:py-20">
      <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
        <Presentation size={14} /> Class slides
      </span>
      <h1 className="font-display text-4xl sm:text-5xl font-semibold mt-4 tracking-tight">
        Missed something? <span className="text-accent">Replay the class.</span>
      </h1>
      <p className="text-muted mt-4 max-w-2xl text-lg">
        The same animated slides used in the lab, one deck per class. Open one, then use the arrow keys, click, or swipe on
        your phone. Every terminal has a Copy button, so you can paste the commands straight into Git Bash.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {decks.map((d, i) => {
          const body = (
            <>
              <div className={`relative h-40 bg-gradient-to-br ${grads[i % grads.length]} p-6 text-white overflow-hidden`}>
                <div className="absolute -right-6 -bottom-10 text-[150px] font-display font-bold leading-none opacity-20 select-none">
                  {d.classNo}
                </div>
                <div className="text-xs font-bold tracking-[.14em] uppercase opacity-90">Class {d.classNo}</div>
                <div className="font-display text-2xl font-semibold mt-2 leading-tight max-w-[85%]">{d.title}</div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">{d.date}</span>
                  <span className="rounded-full bg-panel px-2.5 py-0.5 font-semibold text-xs">{d.experiments}</span>
                </div>
                <p className="text-sm text-muted mt-3 leading-relaxed">{d.blurb}</p>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {d.topics.map((t) => (
                    <span key={t} className="rounded-md border border-border px-2 py-0.5 text-xs font-mono">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-auto pt-6 flex items-center justify-between">
                  {d.ready ? (
                    <>
                      <span className="text-xs text-muted">{d.slides} slides</span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-4 py-2 text-sm font-semibold group-hover:bg-accent group-hover:text-white transition-colors">
                        Open deck <ArrowUpRight size={15} />
                      </span>
                    </>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted">
                      {d.classNo === 1 ? <Clock size={14} /> : <Lock size={14} />} {d.classNo === 1 ? "Being prepared" : "Unlocks after class"}
                    </span>
                  )}
                </div>
              </div>
            </>
          );
          return d.ready ? (
            <a
              key={d.slug}
              href={`/decks/${d.slug}.html`}
              className="group flex flex-col rounded-3xl border border-border bg-background overflow-hidden transition-all hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-accent/15 hover:border-accent"
            >
              {body}
            </a>
          ) : (
            <div key={d.slug} className="flex flex-col rounded-3xl border border-dashed border-border bg-background overflow-hidden opacity-70">
              {body}
            </div>
          );
        })}
      </div>

      <div className="mt-12 rounded-2xl bg-panel p-6 text-sm text-muted">
        <b className="text-foreground">Keys inside a deck:</b> → or Space next · ← back · O all slides · F full screen · M sound on/off · ? help
      </div>
    </section>
  );
}
