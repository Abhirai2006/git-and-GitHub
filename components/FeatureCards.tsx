"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Bug, Layers, ListChecks, Presentation, Terminal } from "lucide-react";
import { vivaCards } from "@/lib/vivaData";
import { quizQuestions } from "@/lib/quizData";
import { commandReference } from "@/lib/commandData";
import { debugCases } from "@/lib/debugData";
import { decks } from "@/lib/deckData";

const features = [
  {
    href: "/present",
    icon: Presentation,
    title: "Class slides",
    desc: "Missed a class, or want to replay one? The exact animated deck from the lab, with copyable commands.",
    tag: `${decks.filter((d) => d.ready).length} decks`,
    cls: "lg:col-span-2 bg-accent text-white",
    icoCls: "bg-white text-accent",
    big: true,
  },
  {
    href: "/flashcards",
    icon: Layers,
    title: "Flashcards",
    desc: "Flip through viva questions by session. Star the tough ones.",
    tag: `${vivaCards.length} cards`,
    cls: "bg-pop-sun text-ink",
    icoCls: "bg-ink text-pop-sun",
  },
  {
    href: "/quiz",
    icon: ListChecks,
    title: "Quiz mode",
    desc: "Instant feedback, real explanations, confetti if you crush it.",
    tag: `${quizQuestions.length} questions`,
    cls: "bg-pop-pink text-white",
    icoCls: "bg-white text-pop-pink",
  },
  {
    href: "/debug",
    icon: Bug,
    title: "Debug it",
    desc: "Real Git error messages. Read it, diagnose it, pick the fix.",
    tag: `${debugCases.length} scenarios`,
    cls: "bg-pop-lime text-ink",
    icoCls: "bg-ink text-pop-lime",
  },
  {
    href: "/cheatsheet",
    icon: Terminal,
    title: "Cheat sheet",
    desc: "Every command from all twelve experiments. Search it, copy it, done.",
    tag: `${commandReference.length} commands`,
    cls: "lg:col-span-3 bg-background text-foreground",
    wide: true,
    icoCls: "bg-accent text-white",
  },
];

export default function FeatureCards() {
  return (
    <section className="mx-auto max-w-6xl px-5 sm:px-8 py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mb-12"
      >
        <span className="sticker inline-block -rotate-2 rounded-lg bg-pop-lime px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-ink">
          pick your weapon
        </span>
        <h2 className="font-display text-4xl sm:text-6xl mt-5 leading-[0.95]">
          Five ways to <span className="grad-text">prep.</span> Zero excuses.
        </h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.href}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className={f.cls.includes("col-span-3") ? "sm:col-span-2 lg:col-span-3" : f.cls.includes("col-span-2") ? "sm:col-span-2" : ""}
          >
            <Link href={f.href} className={`pop-card group relative flex h-full min-h-[240px] flex-col justify-between rounded-3xl p-7 ${f.cls}`}>
              <div>
                <div className="flex items-center justify-between">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${f.icoCls}`}>
                    <f.icon size={22} strokeWidth={2.4} />
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border-[2.5px] border-current transition-transform group-hover:rotate-45">
                    <ArrowUpRight size={18} strokeWidth={2.6} />
                  </span>
                </div>
                <h3 className={`font-display mt-6 ${f.big ? "text-4xl sm:text-5xl" : "text-3xl"}`}>{f.title}</h3>
                <p className={`mt-2.5 leading-relaxed font-medium opacity-85 ${f.big ? "text-lg max-w-md" : "text-sm"}`}>{f.desc}</p>
              </div>
              <span className="mt-6 inline-block w-fit rounded-full border-2 border-current px-3 py-1 text-xs font-extrabold uppercase tracking-wider">
                {f.tag}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
