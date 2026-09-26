"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import confetti from "canvas-confetti";
import { ArrowRight, Check, Download, RotateCcw, X as XIcon } from "lucide-react";
import { debugCases } from "@/lib/debugData";
import { renderScoreCard, downloadDataUrl } from "@/lib/scoreCard";

function ResultScore({ score, total }: { score: number; total: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(0, score, {
      duration: 1,
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

export default function DebugRunner() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [saved, setSaved] = useState(false);

  const current = debugCases[index];

  const select = (id: string) => {
    if (selected) return;
    setSelected(id);
    if (id === current.correctId) setScore((s) => s + 1);
  };

  const next = useCallback(() => {
    if (index + 1 >= debugCases.length) {
      setDone(true);
      if (score >= Math.ceil(debugCases.length * 0.7)) {
        confetti({
          particleCount: 110,
          spread: 75,
          origin: { y: 0.6 },
          colors: ["#1f6feb", "#58a6ff", "#2ea44f", "#ffffff"],
        });
      }
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  }, [index, score]);

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  };

  const shareScore = () => {
    const dataUrl = renderScoreCard({
      title: "Debug Session Complete",
      score,
      total: debugCases.length,
      subtitle:
        score === debugCases.length
          ? "Every scenario, correctly diagnosed."
          : "Solid troubleshooting work.",
    });
    if (dataUrl) {
      downloadDataUrl(dataUrl, "viva-prep-debug-score.png");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl text-center mx-auto py-8"
      >
        <span className="text-sm font-semibold text-accent">Debug session complete</span>
        <div className="font-display text-6xl sm:text-7xl font-medium mt-4">
          <ResultScore score={score} total={debugCases.length} />
        </div>
        <p className="mt-5 text-lg">
          {score === debugCases.length
            ? "Every scenario, correctly diagnosed. You're ready for whatever the terminal throws at you."
            : "Solid work. Revisit the ones you missed, the fix is usually simpler than the error message makes it sound."}
        </p>
        <button
          onClick={restart}
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium hover:border-accent transition-colors cursor-pointer"
        >
          <RotateCcw size={14} /> Go again
        </button>
        <div>
          <button
            onClick={shareScore}
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-accent transition-colors cursor-pointer"
          >
            <Download size={14} />
            {saved ? "Saved to your downloads" : "Download a shareable score card"}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between text-sm text-muted mb-3">
        <span>
          Scenario {index + 1} of {debugCases.length}
        </span>
        <span>
          Score: <span className="text-foreground font-medium">{score}</span>
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-panel overflow-hidden mb-7">
        <motion.div
          className="h-full bg-accent rounded-full"
          animate={{ width: `${((index + (selected ? 1 : 0)) / debugCases.length) * 100}%` }}
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
          <div className="rounded-xl overflow-hidden border border-border/60 bg-ink-soft mb-6">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5 bg-black/20">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
            </div>
            <div className="p-5 font-mono text-[13px] leading-relaxed">
              {current.errorLines.map((ln, i) => (
                <div key={i} className={ln.color ?? "text-term"}>
                  {ln.text}
                </div>
              ))}
            </div>
          </div>

          <h3 className="font-display text-xl sm:text-2xl font-medium leading-snug mb-6">
            {current.prompt}
          </h3>

          <div className="space-y-3">
            {current.options.map((opt) => {
              const isCorrect = opt.id === current.correctId;
              const isSelected = opt.id === selected;
              let style = "border-border hover:border-accent/60 hover:bg-panel cursor-pointer";
              if (selected) {
                if (isCorrect) style = "border-green bg-green/10";
                else if (isSelected) style = "border-accent bg-accent/10";
                else style = "border-border opacity-50";
              }
              return (
                <motion.button
                  key={opt.id}
                  whileTap={!selected ? { scale: 0.985 } : undefined}
                  onClick={() => select(opt.id)}
                  disabled={!!selected}
                  className={`w-full flex items-center justify-between text-left rounded-xl border px-5 py-4 text-sm sm:text-base transition-colors ${style}`}
                >
                  <span>{opt.text}</span>
                  {selected && isCorrect && <Check size={17} className="text-green shrink-0 ml-3" />}
                  {selected && isSelected && !isCorrect && (
                    <XIcon size={17} className="text-accent shrink-0 ml-3" />
                  )}
                </motion.button>
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
                  onClick={next}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-soft transition-colors cursor-pointer"
                >
                  {index + 1 >= debugCases.length ? "See results" : "Next scenario"}
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
