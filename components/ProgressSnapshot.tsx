"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, Layers, Star, Trophy } from "lucide-react";
import { vivaCards } from "@/lib/vivaData";
import { quizQuestions } from "@/lib/quizData";
import { computeAndStoreStreak } from "@/lib/streak";

export default function ProgressSnapshot() {
  const [seen, setSeen] = useState(0);
  const [starred, setStarred] = useState(0);
  const [best, setBest] = useState<{ score: number; total: number } | null>(null);
  const [streak, setStreak] = useState(1);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const seenIds = JSON.parse(window.localStorage.getItem("viva-seen-cards") || "[]");
      const starredIds = JSON.parse(window.localStorage.getItem("viva-starred-cards") || "[]");
      const bestScore = JSON.parse(window.localStorage.getItem("viva-quiz-best") || "null");
      // This snapshot only exists in the browser's localStorage, so it can
      // only be read after mount; setting it here is the intended pattern.
      /* eslint-disable react-hooks/set-state-in-effect */
      setSeen(Array.isArray(seenIds) ? seenIds.length : 0);
      setStarred(Array.isArray(starredIds) ? starredIds.length : 0);
      setBest(bestScore);
      setStreak(computeAndStoreStreak());
      /* eslint-enable react-hooks/set-state-in-effect */
    } catch {
      // no stored progress yet
    }
    setReady(true);
  }, []);

  if (!ready) return null;

  const hasProgress = seen > 0 || best;
  const pct = Math.min(100, Math.round((seen / vivaCards.length) * 100));

  return (
    <section className="mx-auto max-w-6xl px-5 sm:px-8 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-border bg-panel p-7 sm:p-9"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-sm font-semibold text-accent">Your progress</span>
            <h3 className="font-display text-2xl font-medium mt-1">
              {hasProgress ? "Picking up where you left off" : "Nothing tracked yet, and that's fine"}
            </h3>
          </div>
          <Link
            href="/flashcards"
            className="text-sm font-medium text-accent hover:underline underline-offset-4"
          >
            {hasProgress ? "Keep going" : "Start now"} &rarr;
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-xl bg-background border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted uppercase tracking-wide">
                Day streak
              </span>
              <Flame size={15} className="text-accent" />
            </div>
            <div className="font-display text-2xl font-medium">{streak}</div>
            <p className="mt-3 text-xs text-muted">
              {streak > 1 ? "Come back tomorrow to keep it alive." : "Visit again tomorrow to start one."}
            </p>
          </div>

          <div className="rounded-xl bg-background border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted uppercase tracking-wide">
                Cards reviewed
              </span>
              <Layers size={15} className="text-accent" />
            </div>
            <div className="font-display text-2xl font-medium">
              {seen} / {vivaCards.length}
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-panel overflow-hidden">
              <motion.div
                className="h-full bg-accent rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>

          <div className="rounded-xl bg-background border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted uppercase tracking-wide">
                Starred for review
              </span>
              <Star size={15} className="text-accent" />
            </div>
            <div className="font-display text-2xl font-medium">{starred}</div>
            <p className="mt-3 text-xs text-muted">
              Cards flagged as tricky, filterable on the flashcards page.
            </p>
          </div>

          <div className="rounded-xl bg-background border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted uppercase tracking-wide">
                Best quiz score
              </span>
              <Trophy size={15} className="text-accent" />
            </div>
            <div className="font-display text-2xl font-medium">
              {best ? `${best.score} / ${best.total}` : "Not attempted"}
            </div>
            <p className="mt-3 text-xs text-muted">
              Out of {quizQuestions.length} questions across all five sessions.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
