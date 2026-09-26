"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Shuffle,
  Star,
  Keyboard,
} from "lucide-react";
import { vivaCards, sessionLabels } from "@/lib/vivaData";
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
  { value: "all", label: "All" },
  { value: "1", label: "S1" },
  { value: "2", label: "S2" },
  { value: "3", label: "S3" },
  { value: "4", label: "S4" },
  { value: "5", label: "S5" },
  { value: "0", label: "Bonus" },
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 70 : -70, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -70 : 70, opacity: 0 }),
};

export default function FlashcardDeck() {
  const [session, setSession] = useState("all");
  const [starredOnly, setStarredOnly] = useState(false);
  const [starred, setStarred] = useLocalStorage<string[]>("viva-starred-cards", []);
  const [, setSeen] = useLocalStorage<string[]>("viva-seen-cards", []);

  const baseFiltered = useMemo(
    () =>
      vivaCards.filter(
        (c) =>
          (session === "all" || c.session === Number(session)) &&
          (!starredOnly || starred.includes(c.id))
      ),
    [session, starredOnly, starred]
  );

  const [order, setOrder] = useState<string[]>(baseFiltered.map((c) => c.id));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [direction, setDirection] = useState(1);

  // Reset the deck whenever the active filter changes. This adjusts state
  // during render (React's recommended pattern for "derive state from a
  // changed prop") rather than in an effect, so the reset is immediate and
  // never flashes the previous filter's first card.
  const filterKey = `${session}|${starredOnly}`;
  const [lastFilterKey, setLastFilterKey] = useState(filterKey);
  if (filterKey !== lastFilterKey) {
    setLastFilterKey(filterKey);
    setOrder(baseFiltered.map((c) => c.id));
    setIndex(0);
    setFlipped(false);
  }

  const byId = useMemo(() => new Map(vivaCards.map((c) => [c.id, c])), []);
  const deck = order.map((id) => byId.get(id)!).filter(Boolean);
  const current = deck[index];

  const markSeen = useCallback(
    (id: string) => {
      setSeen((prev) => (prev.includes(id) ? prev : [...prev, id]));
    },
    [setSeen]
  );

  const goNext = useCallback(() => {
    setDirection(1);
    setFlipped(false);
    setIndex((i) => Math.min(i + 1, Math.max(deck.length - 1, 0)));
  }, [deck.length]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setFlipped(false);
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  const toggleFlip = useCallback(() => {
    setFlipped((f) => {
      const next = !f;
      if (next && current) markSeen(current.id);
      return next;
    });
  }, [current, markSeen]);

  const toggleStar = useCallback(() => {
    if (!current) return;
    setStarred((prev) =>
      prev.includes(current.id) ? prev.filter((id) => id !== current.id) : [...prev, current.id]
    );
  }, [current, setStarred]);

  const handleDragEnd = useCallback(
    (_event: unknown, info: PanInfo) => {
      const SWIPE_DISTANCE = 80;
      const SWIPE_VELOCITY = 500;
      const swipedLeft = info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY;
      const swipedRight = info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY;
      if (swipedLeft && index < deck.length - 1) goNext();
      else if (swipedRight && index > 0) goPrev();
    },
    [index, deck.length, goNext, goPrev]
  );

  const shuffle = () => {
    setDirection(1);
    setFlipped(false);
    setOrder((o) => shuffleArray(o));
    setIndex(0);
  };

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        toggleFlip();
      } else if (e.key.toLowerCase() === "s") toggleStar();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, toggleFlip, toggleStar]);

  const isStarred = current ? starred.includes(current.id) : false;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <SessionFilter
          options={sessionOptions}
          active={session}
          onChange={setSession}
          layoutId="flashcard-session-pill"
        />
        <button
          onClick={() => setStarredOnly((v) => !v)}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-colors cursor-pointer ${
            starredOnly
              ? "bg-accent text-white border-accent"
              : "border-border text-foreground/70 hover:text-foreground"
          }`}
        >
          <Star size={14} className={starredOnly ? "fill-white" : ""} />
          Starred only {starred.length > 0 && `(${starred.length})`}
        </button>
      </div>

      {deck.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-16 text-center text-muted">
          {starredOnly
            ? "You haven't starred any cards yet. Flip a few and tap the star on the ones worth revisiting."
            : "No cards in this filter."}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4 text-sm text-muted">
            <span>
              Card {index + 1} of {deck.length}
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Keyboard size={13} /> space to flip, arrows to move, S to star
            </span>
          </div>

          <div className="h-1.5 rounded-full bg-panel overflow-hidden mb-6">
            <motion.div
              className="h-full bg-accent rounded-full"
              animate={{ width: `${((index + 1) / deck.length) * 100}%` }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          <div className="relative h-[360px] sm:h-[400px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <div
                  className="w-full h-full cursor-pointer [perspective:1400px]"
                  onClick={toggleFlip}
                  role="button"
                  aria-label="Flip card"
                >
                  <motion.div
                    className="relative w-full h-full [transform-style:preserve-3d]"
                    animate={{ rotateY: flipped ? 180 : 0 }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.7}
                    onDragEnd={handleDragEnd}
                  >
                    {/* Front */}
                    <div className="absolute inset-0 card-flip-face rounded-2xl bg-ink text-white p-8 sm:p-10 flex flex-col justify-between shadow-xl">
                      <div>
                        <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-accent">
                          {sessionLabels[current.session]}
                        </span>
                        <p className="font-display text-2xl sm:text-3xl font-medium mt-6 leading-snug">
                          {current.question}
                        </p>
                      </div>
                      <p className="text-xs text-term/60">Tap to reveal the answer, or swipe to move between cards</p>
                    </div>
                    {/* Back */}
                    <div className="absolute inset-0 card-flip-face [transform:rotateY(180deg)] rounded-2xl bg-panel border border-border p-8 sm:p-10 flex flex-col justify-between overflow-y-auto">
                      <div>
                        <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                          Answer
                        </span>
                        <p className="text-lg sm:text-xl mt-6 leading-relaxed">{current.answer}</p>
                      </div>
                      <p className="text-xs text-muted">Tap again to flip back</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between mt-6">
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={goPrev}
              disabled={index === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-border text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:border-accent transition-colors cursor-pointer"
            >
              <ChevronLeft size={15} /> Prev
            </motion.button>

            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={shuffle}
                className="h-10 w-10 flex items-center justify-center rounded-full border border-border hover:border-accent transition-colors cursor-pointer"
                aria-label="Shuffle"
              >
                <Shuffle size={15} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleStar}
                className={`h-10 w-10 flex items-center justify-center rounded-full border transition-colors cursor-pointer ${
                  isStarred ? "bg-accent border-accent text-white" : "border-border hover:border-accent"
                }`}
                aria-label="Star this card"
              >
                <Star size={15} className={isStarred ? "fill-white" : ""} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setFlipped(false);
                  setIndex(0);
                }}
                className="h-10 w-10 flex items-center justify-center rounded-full border border-border hover:border-accent transition-colors cursor-pointer"
                aria-label="Restart deck"
              >
                <RotateCcw size={14} />
              </motion.button>
            </div>

            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={goNext}
              disabled={index === deck.length - 1}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-accent text-white text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-accent-soft transition-colors cursor-pointer"
            >
              Next <ChevronRight size={15} />
            </motion.button>
          </div>
        </>
      )}
    </div>
  );
}
