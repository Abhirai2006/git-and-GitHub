"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import confetti from "canvas-confetti";
import {
  ArrowRight,
  Check,
  RotateCcw,
  Trophy,
  X as XIcon,
} from "lucide-react";
import { quizQuestions, type QuizQuestion } from "@/lib/quizData";
import { useLocalStorage } from "@/lib/useLocalStorage";
import SessionFilter from "./SessionFilter";

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const sessionOptions = [
  { value: "all", label: "All sessions (20)" },
  { value: "1", label: "Session 1" },
  { value: "2", label: "Session 2" },
  { value: "3", label: "Session 3" },
  { value: "4", label: "Session 4" },
  { value: "5", label: "Session 5" },
];

function scoreMessage(pct: number) {
  if (pct === 100) return "Perfect score. You could run this lab yourself.";
  if (pct >= 80) return "Viva ready. Just skim the ones you missed.";
  if (pct >= 60) return "Solid. A quick review of the misses and you're set.";
  if (pct >= 40) return "Getting there. Revisit the flashcards for the weak spots.";
  return "Worth another pass through the sessions before the viva.";
}

function ResultScore({ score, total }: { score: number; total: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(0, score, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [score]);
  return (
    <span>
      {display}
      <span className="text-muted text-3xl sm:text-4xl">/{total}</span>
    </span>
  );
}

export default function QuizRunner() {
  const [phase, setPhase] = useState<"setup" | "running" | "results">("setup");
  const [sessionFilter, setSessionFilter] = useState("all");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useLocalStorage<{ score: number; total: number } | null>(
    "viva-quiz-best",
    null
  );

  const startQuiz = () => {
    const pool =
      sessionFilter === "all"
        ? quizQuestions
        : quizQuestions.filter((q) => q.session === Number(sessionFilter));
    setQuestions(shuffleArray(pool));
    setQIndex(0);
    setSelected(null);
    setScore(0);
    setPhase("running");
  };

  const current = questions[qIndex];

  const selectOption = (optId: string) => {
    if (selected) return;
    setSelected(optId);
    if (optId === current.correctId) setScore((s) => s + 1);
  };

  const finish = useCallback(
    (finalScore: number) => {
      setPhase("results");
      if (sessionFilter === "all") {
        setBest((prev) =>
          !prev || finalScore > prev.score ? { score: finalScore, total: questions.length } : prev
        );
      }
      const pct = finalScore / questions.length;
      if (pct >= 0.5) {
        const colors = ["#1f6feb", "#58a6ff", "#2ea44f", "#ffffff"];
        confetti({
          particleCount: pct === 1 ? 160 : 90,
          spread: 75,
          origin: { y: 0.6 },
          colors,
        });
      }
    },
    [questions.length, sessionFilter, setBest]
  );

  const nextQuestion = () => {
    if (qIndex + 1 >= questions.length) {
      finish(score);
    } else {
      setQIndex((i) => i + 1);
      setSelected(null);
    }
  };

  const restart = () => {
    setPhase("setup");
  };

  if (phase === "setup") {
    return (
      <div className="max-w-xl">
        <p className="text-muted mb-6">
          Choose a session to drill, or run the full set for a proper check before the viva.
        </p>
        <SessionFilter
          options={sessionOptions}
          active={sessionFilter}
          onChange={setSessionFilter}
          layoutId="quiz-session-pill"
        />
        {best && (
          <p className="mt-6 inline-flex items-center gap-2 text-sm text-muted">
            <Trophy size={14} className="text-accent" /> Best full-set score: {best.score} / {best.total}
          </p>
        )}
        <button
          onClick={startQuiz}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white hover:bg-accent-soft transition-colors cursor-pointer"
        >
          Start quiz <ArrowRight size={15} />
        </button>
      </div>
    );
  }

  if (phase === "results") {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl text-center mx-auto py-8"
      >
        <span className="text-sm font-semibold text-accent">Quiz complete</span>
        <div className="font-display text-6xl sm:text-7xl font-medium mt-4">
          <ResultScore score={score} total={questions.length} />
        </div>
        <p className="mt-5 text-lg">{scoreMessage(pct)}</p>
        <div className="mt-9 flex items-center justify-center gap-3">
          <button
            onClick={restart}
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium hover:border-accent transition-colors cursor-pointer"
          >
            <RotateCcw size={14} /> Try again
          </button>
          <button
            onClick={startQuiz}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-soft transition-colors cursor-pointer"
          >
            Same set again <ArrowRight size={14} />
          </button>
        </div>
      </motion.div>
    );
  }

  // running
  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between text-sm text-muted mb-3">
        <span>
          Question {qIndex + 1} of {questions.length}
        </span>
        <span>
          Score: <span className="text-foreground font-medium">{score}</span>
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-panel overflow-hidden mb-8">
        <motion.div
          className="h-full bg-accent rounded-full"
          animate={{ width: `${((qIndex + (selected ? 1 : 0)) / questions.length) * 100}%` }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <h3 className="font-display text-2xl sm:text-3xl font-medium leading-snug mb-7">
            {current.prompt}
          </h3>

          <div className="space-y-3">
            {current.options.map((opt) => {
              const isCorrect = opt.id === current.correctId;
              const isSelected = opt.id === selected;
              let style =
                "border-border hover:border-accent/60 hover:bg-panel cursor-pointer";
              if (selected) {
                if (isCorrect) style = "border-green bg-green/10";
                else if (isSelected) style = "border-accent bg-accent/10";
                else style = "border-border opacity-50";
              }
              return (
                <button
                  key={opt.id}
                  onClick={() => selectOption(opt.id)}
                  disabled={!!selected}
                  className={`w-full flex items-center justify-between text-left rounded-xl border px-5 py-4 text-sm sm:text-base transition-colors ${style}`}
                >
                  <span>{opt.text}</span>
                  {selected && isCorrect && <Check size={17} className="text-green shrink-0 ml-3" />}
                  {selected && isSelected && !isCorrect && (
                    <XIcon size={17} className="text-accent shrink-0 ml-3" />
                  )}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-5 rounded-xl bg-panel border border-border p-4 text-sm text-muted">
                  {current.explanation}
                </div>
                <button
                  onClick={nextQuestion}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-soft transition-colors cursor-pointer"
                >
                  {qIndex + 1 >= questions.length ? "See results" : "Next question"}
                  <ArrowRight size={15} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
