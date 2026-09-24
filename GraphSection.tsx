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
    <section className="relative overflow-hidden bg-ink text-white py-24">
      <div className="absolute inset-0 bg-grid opacity-25" />
      <div className="relative mx-auto max-w-5xl px-5 sm:px-8 grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-sm font-semibold text-accent-soft">Under the hood</span>
          <h2 className="font-display text-3xl sm:text-4xl font-medium mt-3 leading-tight">
            Every dot is a commit.
            <br />
            Every line is a branch.
          </h2>
          <p className="mt-5 text-term/80 max-w-md">
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
