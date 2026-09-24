"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Layers, ListChecks, Terminal } from "lucide-react";
import { vivaCards } from "@/lib/vivaData";
import { quizQuestions } from "@/lib/quizData";
import { commandReference } from "@/lib/commandData";

const features = [
  {
    href: "/flashcards",
    icon: Layers,
    title: "Flashcards",
    desc: "Flip through question and answer pairs, grouped by session. Star the tough ones and review them again right before your viva.",
    tag: `${vivaCards.length} cards`,
  },
  {
    href: "/quiz",
    icon: ListChecks,
    title: "Quiz Mode",
    desc: "Multiple choice questions with instant feedback and explanations. Pick one session or run the full set for a final check.",
    tag: `${quizQuestions.length} questions`,
  },
  {
    href: "/cheatsheet",
    icon: Terminal,
    title: "Cheat Sheet",
    desc: "Every command from all twelve experiments in one searchable, copyable reference. Good for a last-minute scan before you walk in.",
    tag: `${commandReference.length} commands`,
  },
];

export default function FeatureCards() {
  return (
    <section className="mx-auto max-w-6xl px-5 sm:px-8 py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="max-w-xl mb-14"
      >
        <span className="text-sm font-semibold text-accent">Three ways to prepare</span>
        <h2 className="font-display text-3xl sm:text-4xl font-medium mt-3">
          Pick whichever fits how you study.
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.href}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href={f.href}
              className="group relative flex h-full flex-col justify-between rounded-2xl border border-border bg-background p-7 transition-all hover:-translate-y-1.5 hover:border-accent hover:shadow-xl hover:shadow-accent/10"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-panel text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                    <f.icon size={20} strokeWidth={2} />
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="text-muted opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all"
                  />
                </div>
                <h3 className="font-display text-xl font-medium mt-5">{f.title}</h3>
                <p className="text-sm text-muted mt-2.5 leading-relaxed">{f.desc}</p>
              </div>
              <span className="mt-6 inline-block w-fit rounded-full bg-panel px-3 py-1 text-xs font-medium text-muted">
                {f.tag}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
