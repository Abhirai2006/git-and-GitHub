"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { vivaCards } from "@/lib/vivaData";
import { quizQuestions } from "@/lib/quizData";

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
  { label: "Lab sessions", value: 5 },
  { label: "Lab experiments", value: 12 },
  { label: "Viva questions", value: vivaCards.length },
  { label: "Quiz questions", value: quizQuestions.length },
];

export default function StatsSection() {
  return (
    <section className="border-y border-border bg-panel">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-14 grid grid-cols-2 sm:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="text-center sm:text-left"
          >
            <div className="font-display text-4xl sm:text-5xl font-medium text-accent">
              <CountUp to={s.value} suffix="+" />
            </div>
            <div className="mt-1 text-sm text-muted">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
