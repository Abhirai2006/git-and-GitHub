import type { Metadata } from "next";
import { ArrowUpRight, Lock, Presentation } from "lucide-react";
import { decks } from "@/lib/deckData";

export const metadata: Metadata = {
  title: "Slides - viva.prep",
  description: "Every class presentation for BAIL308C, Project Management with Git. Open any deck in your browser.",
};


export default function PresentPage() {
  return (
    <section className="mx-auto max-w-6xl px-5 sm:px-8 py-14 sm:py-20">
      <span className="eyebrow inline-flex items-center gap-2">
        <Presentation size={14} /> Class slides
      </span>
      <h1 className="font-display text-4xl sm:text-5xl mt-4 leading-[1.05]">
        Missed something? <span className="italic text-accent">Replay the class.</span>
      </h1>
      <p className="text-muted mt-5 max-w-2xl text-lg leading-relaxed">
        The same animated slides used in the lab, one deck per class. Open one, then use the arrow keys, click, or swipe on
        your phone. Every terminal has a Copy button, so you can paste the commands straight into Git Bash.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {decks.map((d) => {
          const body = (
            <>
              <div className="relative h-40 bg-panel p-6 overflow-hidden border-b border-border">
                <div className="absolute right-5 -bottom-6 text-[120px] font-display leading-none text-foreground/[.06] select-none" aria-hidden>
                  {d.classNo}
                </div>
                <div className="eyebrow">Class {d.classNo}</div>
                <div className="font-display text-2xl mt-3 leading-tight max-w-[85%]">{d.title}</div>
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
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                        Open deck <ArrowUpRight size={15} />
                      </span>
                    </>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted">
                      <Lock size={14} /> Unlocks after class
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
              className="surface surface-hover group flex flex-col overflow-hidden"
            >
              {body}
            </a>
          ) : (
            <div key={d.slug} className="flex flex-col rounded-[14px] border border-dashed border-border bg-background overflow-hidden opacity-70">
              {body}
            </div>
          );
        })}
      </div>

      <div className="surface mt-12 bg-panel p-6 text-sm text-muted">
        <b className="text-foreground">Keys inside a deck:</b> → or Space next · ← back · O all slides · F full screen · M sound on/off · ? help
      </div>
    </section>
  );
}
