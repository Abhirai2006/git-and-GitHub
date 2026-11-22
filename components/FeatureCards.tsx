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
  { href: "/present", icon: Presentation, title: "Class slides", desc: "The same animated deck used in the lab, one per class. Every command has a copy button.", tag: `${decks.filter((d) => d.ready).length} decks` },
  { href: "/flashcards", icon: Layers, title: "Flashcards", desc: "Viva questions grouped by session. Star the hard ones and come back to them.", tag: `${vivaCards.length} cards` },
  { href: "/quiz", icon: ListChecks, title: "Quiz", desc: "Multiple choice with an explanation for every answer. One session or the full set.", tag: `${quizQuestions.length} questions` },
  { href: "/debug", icon: Bug, title: "Debug it", desc: "Real Git error messages. Read the error, work out the cause, choose the fix.", tag: `${debugCases.length} scenarios` },
  { href: "/cheatsheet", icon: Terminal, title: "Cheat sheet", desc: "Every command from the twelve experiments, searchable and ready to copy.", tag: `${commandReference.length} commands` },
];

export default function FeatureCards() {
  return (
    <section className="mx-auto max-w-6xl px-5 sm:px-8 py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mb-12"
      >
        <p className="eyebrow">What is here</p>
        <h2 className="font-display text-3xl sm:text-[44px] leading-[1.08] mt-4">
          Everything you need for the lab, the record and the viva.
        </h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <motion.div
            key={f.href}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className={i === 0 ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : ""}
          >
            <Link
              href={f.href}
              className={`surface surface-hover group flex h-full flex-col justify-between p-7 ${i === 0 ? "bg-accent-soft border-transparent" : ""}`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <f.icon size={22} strokeWidth={1.7} className="text-accent" />
                  <ArrowUpRight size={17} className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <h3 className={`font-display mt-8 ${i === 0 ? "text-4xl" : "text-2xl"}`}>{f.title}</h3>
                <p className={`mt-3 text-muted leading-relaxed ${i === 0 ? "text-base max-w-sm" : "text-sm"}`}>{f.desc}</p>
              </div>
              <span className="mt-8 font-mono text-xs text-muted">{f.tag}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
