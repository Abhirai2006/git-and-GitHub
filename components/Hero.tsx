"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Presentation, Sparkles } from "lucide-react";
import TerminalWindow from "./TerminalWindow";

const line1 = ["Git", "good."];
const line2 = ["Ace", "the", "viva."];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
const word = {
  hidden: { y: "105%", rotate: 6, opacity: 0 },
  show: { y: 0, rotate: 0, opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

const stickers = [
  { text: "12 experiments", cls: "bg-pop-sun text-ink", pos: "left-[2%] top-[2%]", r: "-8deg", d: 0.9 },
  { text: "no sign-up", cls: "bg-pop-lime text-ink", pos: "right-[4%] top-[0%]", r: "7deg", d: 1.05 },
  { text: "100% free", cls: "bg-pop-pink text-white", pos: "right-[0%] bottom-[2%]", r: "-5deg", d: 1.2 },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden paper-grid">
      {/* colour blobs */}
      <div className="pointer-events-none absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full bg-pop-sun/60 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute top-20 -right-32 h-[460px] w-[460px] rounded-full bg-pop-pink/40 blur-3xl animate-blob [animation-delay:-5s]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/3 h-[420px] w-[420px] rounded-full bg-accent/30 blur-3xl animate-blob [animation-delay:-9s]" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8 pt-14 pb-20 sm:pt-20 sm:pb-28">
        <motion.div
          initial={{ opacity: 0, y: -10, rotate: -3 }}
          animate={{ opacity: 1, y: 0, rotate: -2 }}
          transition={{ duration: 0.5 }}
          className="sticker inline-flex items-center gap-2 rounded-full bg-background px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-8"
        >
          <Sparkles size={13} className="text-accent" />
          BAIL308C · Project Management with Git
        </motion.div>

        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-14 items-center">
          <div>
            <motion.h1
              variants={container}
              initial="hidden"
              animate="show"
              className="font-display text-[64px] sm:text-[92px] lg:text-[108px] leading-[0.92] tracking-tight"
            >
              <span className="block">
                {line1.map((w, i) => (
                  <span key={i} className="inline-block overflow-hidden align-bottom mr-4 pb-2">
                    <motion.span variants={word} className={`inline-block ${w === "good." ? "grad-text" : ""}`}>
                      {w}
                    </motion.span>
                  </span>
                ))}
              </span>
              <span className="block">
                {line2.map((w, i) => (
                  <span key={i} className="inline-block overflow-hidden align-bottom mr-4 pb-2">
                    <motion.span variants={word} className={`inline-block ${w === "viva." ? "text-stroke" : ""}`}>
                      {w}
                    </motion.span>
                  </span>
                ))}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-8 text-lg sm:text-xl text-muted max-w-lg font-medium"
            >
              Flashcards, a quiz, a debug drill, a cheat sheet, and the slides from every class, covering all twelve lab
              experiments. Open it and start. No login, no tracking.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95, duration: 0.6 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Link href="/flashcards" className="pop-btn group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-base font-bold text-white">
                Start flashcards
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/present" className="pop-btn inline-flex items-center gap-2 rounded-full bg-pop-sun px-7 py-3.5 text-base font-bold text-ink">
                <Presentation size={17} /> Class slides
              </Link>
              <Link href="/quiz" className="inline-flex items-center gap-2 px-3 py-3.5 text-base font-bold underline decoration-[3px] decoration-pop-pink underline-offset-[6px] hover:decoration-accent">
                Take the quiz
              </Link>
            </motion.div>
          </div>

          <div className="relative">
            {stickers.map((s) => (
              <motion.div
                key={s.text}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: s.d, type: "spring", stiffness: 260, damping: 14 }}
                className={`absolute z-10 ${s.pos} hidden sm:block`}
              >
                <div style={{ ["--r" as string]: s.r }} className={`sticker animate-wobble rounded-xl px-3.5 py-1.5 text-sm font-extrabold ${s.cls}`}>
                  {s.text}
                </div>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: 1.5 }}
              transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="py-12"
            >
              <TerminalWindow
                lines={[
                  { text: "$ git status", color: "text-accent" },
                  { text: "On branch master, ready for viva", color: "text-foreground" },
                  { text: "$ git log --oneline -3", color: "text-accent" },
                  { text: "b2651d7 Add login page", color: "text-foreground" },
                  { text: "e4f5a6b Merge feature-branch", color: "text-foreground" },
                  { text: "92d4b40 Add initial notes file", color: "text-foreground" },
                  { text: '$ echo "you got this"', color: "text-accent" },
                  { text: "you got this", color: "text-green" },
                ]}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
