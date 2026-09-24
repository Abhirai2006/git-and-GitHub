"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Line = { text: string; color?: string; delayAfter?: number };

export default function TerminalWindow({
  lines,
  loop = true,
  className = "",
  typingSpeed = 32,
}: {
  lines: Line[];
  loop?: boolean;
  className?: string;
  typingSpeed?: number;
}) {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    if (lineIndex >= lines.length) {
      if (loop) {
        const resetTimer = setTimeout(() => {
          setDone([]);
          setLineIndex(0);
          setCharIndex(0);
        }, 2200);
        return () => clearTimeout(resetTimer);
      }
      return;
    }

    const current = lines[lineIndex];
    if (charIndex <= current.text.length) {
      const t = setTimeout(() => setCharIndex((c) => c + 1), typingSpeed);
      return () => clearTimeout(t);
    }

    const pause = setTimeout(() => {
      setDone((d) => [...d, current.text]);
      setLineIndex((i) => i + 1);
      setCharIndex(0);
    }, current.delayAfter ?? 500);
    return () => clearTimeout(pause);
  }, [charIndex, lineIndex, lines, loop, typingSpeed]);

  const currentLine = lines[lineIndex];

  return (
    <div
      className={`rounded-xl overflow-hidden border border-border/60 bg-ink-soft shadow-2xl shadow-black/30 ${className}`}
    >
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5 bg-black/20">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
        <span className="ml-3 text-[11px] text-term/50 font-mono">bash</span>
      </div>
      <div className="p-5 font-mono text-[13px] leading-relaxed min-h-[180px]">
        {done.map((text, i) => (
          <div key={i} className="text-term-green">
            {text}
          </div>
        ))}
        {currentLine && (
          <div className={currentLine.color ?? "text-term-green"}>
            {currentLine.text.slice(0, charIndex)}
            <motion.span
              className="inline-block w-[7px] h-[14px] bg-accent ml-0.5 align-middle caret-blink"
            />
          </div>
        )}
      </div>
    </div>
  );
}
