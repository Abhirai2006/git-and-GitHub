"use client";

import { motion } from "framer-motion";

export default function SessionFilter({
  options,
  active,
  onChange,
  layoutId,
}: {
  options: { value: string; label: string }[];
  active: string;
  onChange: (value: string) => void;
  layoutId: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isActive = opt.value === active;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
              isActive ? "text-white" : "text-foreground/70 hover:text-foreground border border-border"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-accent -z-10"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
