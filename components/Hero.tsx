"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Presentation } from "lucide-react";
import TerminalWindow from "./TerminalWindow";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  return (
    <section className="relative border-b border-border">
      <div className="absolute inset-0 dot-grid [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28 grid lg:grid-cols-[1.1fr_1fr] gap-14 items-center">
        <div>
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }} className="eyebrow">
            BAIL308C · Project Management with Git
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease }}
            className="font-display mt-5 text-[46px] sm:text-[64px] leading-[1.02] tracking-tight"
          >
            Learn Git properly, <span className="italic text-accent">one commit</span> at a time.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="mt-6 text-lg text-muted max-w-lg leading-relaxed"
          >
            Class slides, flashcards, a quiz, a debugging drill and a full command reference for all twelve lab
            experiments. Free, no sign-up, and it works on your phone.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Link href="/present" className="btn-primary px-5 py-3 text-sm">
              <Presentation size={16} /> Class slides
            </Link>
            <Link href="/flashcards" className="btn-ghost group px-5 py-3 text-sm">
              Start revising
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25, ease }}>
          <TerminalWindow
            lines={[
              { text: "$ git status", color: "text-foreground" },
              { text: "On branch master", color: "text-muted" },
              { text: "nothing to commit, working tree clean", color: "text-muted" },
              { text: "$ git log --oneline -3", color: "text-foreground" },
              { text: "61ad0c2 Add login page", color: "text-muted" },
              { text: "1eb0565 Add todo list", color: "text-muted" },
              { text: "89fdfae Add initial notes file", color: "text-muted" },
            ]}
          />
        </motion.div>
      </div>
    </section>
  );
}
