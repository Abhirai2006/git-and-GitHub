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
  { label: "Lab experiments", value: 12 },
  { label: "Viva flashcards", value: vivaCards.length },
  { label: "Quiz questions", value: quizQuestions.length },
  { label: "Class decks", value: decks.filter((d) => d.ready).length },
];

export default function StatsSection() {
  return (
    <section className="mx-auto max-w-6xl px-5 sm:px-8 py-14">
      <dl className="grid grid-cols-2 lg:grid-cols-4 border-y border-border divide-x divide-border">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="px-6 py-8 first:pl-0 [&:nth-child(3)]:pl-0 lg:[&:nth-child(3)]:pl-6"
          >
            <dd className="font-display text-5xl tracking-tight">
              <CountUp to={s.value} />
            </dd>
            <dt className="mt-2 text-sm text-muted">{s.label}</dt>
          </motion.div>
        ))}
      </dl>
    </section>
  );
}
