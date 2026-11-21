"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const GitGraphOrb = dynamic(() => import("./GitGraphOrb"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-square max-w-[420px] mx-auto rounded-full border border-white/10 animate-pulse" />
  ),
});

export default function GraphSection() {
  return (
    <section className="relative overflow-hidden text-white py-24 bg-[linear-gradient(135deg,#3b1db8_0%,#6d3bff_45%,#ff3ea5_100%)] border-y-[2.5px] border-ink">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="relative mx-auto max-w-5xl px-5 sm:px-8 grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="sticker inline-block -rotate-2 rounded-lg bg-pop-sun px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-ink">Under the hood</span>
          <h2 className="font-display text-4xl sm:text-6xl mt-5 leading-[0.95]">
            Every dot is a commit.
            <br />
            Every line is a branch.
          </h2>
          <p className="mt-6 text-white/85 max-w-md text-lg font-medium">
            This is really what a repository looks like once you stop thinking
            in files and start thinking in history: a graph of connected
            snapshots. Branching, merging, and rebasing are just different
            ways of reshaping this same structure.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <GitGraphOrb />
        </motion.div>
      </div>
    </section>
  );
}
