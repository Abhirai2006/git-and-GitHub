"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import TerminalWindow from "./TerminalWindow";

const headline = ["Get", "viva", "ready", "for", "Git", "&", "GitHub."];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
  },
};
const word = {
  hidden: { y: "110%", opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 h-[480px] w-[800px] rounded-full blur-[120px] opacity-30 animate-glow"
        style={{ background: "radial-gradient(circle, #1f6feb 0%, #0b3d91 45%, transparent 75%)" }}
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-term mb-8"
        >
          <Sparkles size={13} className="text-accent" />
          BAIL308C &middot; Project Management with Git
        </motion.div>

        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-14 items-center">
          <div>
            <motion.h1
              variants={container}
              initial="hidden"
              animate="show"
              className="font-display text-5xl sm:text-6xl lg:text-[68px] leading-[1.05] font-medium tracking-tight"
            >
              {headline.map((w, i) => (
                <span key={i} className="inline-block overflow-hidden align-bottom mr-3">
                  <motion.span
                    variants={word}
                    className={`inline-block ${w === "Git" || w === "GitHub." ? "text-accent" : ""}`}
                  >
                    {w}
                  </motion.span>
                </span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="mt-7 text-lg text-term/90 max-w-lg"
            >
              Forty-nine viva questions, a twenty question quiz, and a full command
              reference, all covering the twelve lab experiments. No sign-up, no
              backend, just open it and start reviewing.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, duration: 0.6 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/flashcards"
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-soft transition-colors"
              >
                Start flashcards
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/quiz"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Take the quiz
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="animate-float-slow"
          >
            <TerminalWindow
              lines={[
                { text: "$ git status", color: "text-term-green" },
                { text: "On branch master, ready for viva", color: "text-term" },
                { text: "$ git log --oneline -3", color: "text-term-green" },
                { text: "a1b2c3d Add login validation", color: "text-term" },
                { text: "e4f5g6h Merge feature-branch", color: "text-term" },
                { text: "f3a9c21 Initial commit", color: "text-term" },
                { text: "$ echo \"good luck\"", color: "text-term-green" },
                { text: "good luck", color: "text-term" },
              ]}
            />
          </motion.div>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40"
      >
        <ChevronDown size={20} />
      </motion.div>
    </section>
  );
}
