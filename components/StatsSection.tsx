"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { vivaCards } from "@/lib/vivaData";
import { quizQuestions } from "@/lib/quizData";
import { decks } from "@/lib/deckData";

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

const stats = [
  { label: "lab experiments", value: 12, cls: "bg-pop-sun text-ink", r: "-2deg" },
  { label: "viva flashcards", value: vivaCards.length, cls: "bg-accent text-white", r: "1.5deg" },
  { label: "quiz questions", value: quizQuestions.length, cls: "bg-pop-pink text-white", r: "-1deg" },
  { label: "class decks", value: decks.filter((d) => d.ready).length, cls: "bg-pop-lime text-ink", r: "2deg" },
];

export default function StatsSection() {
  return (
    <section className="mx-auto max-w-6xl px-5 sm:px-8 py-16">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-7">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 30, rotate: 0 }}
            whileInView={{ opacity: 1, y: 0, rotate: parseFloat(s.r) }}
            whileHover={{ rotate: 0, scale: 1.04 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", stiffness: 200, damping: 16, delay: i * 0.08 }}
            className={`pop-card rounded-3xl p-6 sm:p-7 ${s.cls}`}
          >
            <div className="font-display text-5xl sm:text-6xl font-extrabold tracking-tight">
              <CountUp to={s.value} />
            </div>
            <div className="mt-1 text-sm sm:text-base font-bold opacity-90">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
